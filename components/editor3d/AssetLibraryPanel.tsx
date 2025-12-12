"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import EditorPanel from './EditorPanel';
import { TextInput } from '@/components/ui';
import { ErrorCodes } from '@/lib/errorCodes';

export interface AssetItem {
  id: number | string;
  name: string;
  type: 'folder' | 'file';
  thumbnail?: string | null;
  path?: string;
  parentId?: number | string | null;
  source?: 'api' | 'fallback';
}

type FolderNode = {
  id: number | string;
  name: string;
  parentId: number | string | null;
  children: FolderNode[];
  source?: 'api' | 'fallback';
};

type ApiAsset = {
  id: number;
  name: string;
  type: 'FOLDER' | 'FILE';
  parentId: number | null;
  previewUrl?: string | null;
};

type ApiFolderNode = {
  id: number;
  name: string;
  parentId: number | null;
  children?: ApiFolderNode[];
};

export interface AssetLibraryPanelProps {
  fallbackAssets?: AssetItem[];
  onAssetSelect?: (asset: AssetItem) => void;
  onAssetDragStart?: (asset: AssetItem) => void;
  translations: {
    title: string;
    search: string;
    newFolder: string;
    upload: string;
    refresh: string;
    grid: string;
    list: string;
    noAssets: string;
    dragDrop: string;
    folders: string;
    rename: string;
    delete: string;
    move: string;
    root: string;
    confirmDelete: string;
    destination: string;
    save: string;
    cancel: string;
    namePlaceholder: string;
    moveTitle: string;
    errorConflict: string;
    errorGeneric: string;
  };
}

function normalizeFallbackAssets(assets?: AssetItem[]) {
  if (!assets) return [];
  return assets.map((asset) => {
    if (asset.parentId !== undefined) return asset;
    const segments = asset.path?.split('/').filter(Boolean) ?? [];
    const parentId = segments.length > 1 ? segments[segments.length - 2] : null;
    return { ...asset, parentId };
  });
}

function buildFolderTree(items: AssetItem[]): FolderNode[] {
  const folders = items.filter((item) => item.type === 'folder');
  const map = new Map<number | string, FolderNode>();
  folders.forEach((folder) =>
    map.set(folder.id, {
      id: folder.id,
      name: folder.name,
      parentId: folder.parentId ?? null,
      children: [],
      source: folder.source,
    })
  );

  const roots: FolderNode[] = [];
  map.forEach((node) => {
    if (node.parentId !== null && map.has(node.parentId)) {
      map.get(node.parentId)?.children.push(node);
    } else {
      roots.push(node);
    }
  });
  return roots;
}

function flattenFolderNodes(
  nodes: FolderNode[],
  exclude?: Set<FolderNode['id']>,
  depth = 0
): Array<{ id: FolderNode['id']; name: string; depth: number }> {
  const result: Array<{ id: FolderNode['id']; name: string; depth: number }> = [];
  for (const node of nodes) {
    if (!exclude?.has(node.id)) {
      result.push({ id: node.id, name: node.name, depth });
      if (node.children.length) {
        result.push(...flattenFolderNodes(node.children, exclude, depth + 1));
      }
    }
  }
  return result;
}

function isDescendant(tree: FolderNode[], ancestorId: FolderNode['id'], candidateId: FolderNode['id']): boolean {
  for (const node of tree) {
    if (node.id === ancestorId) {
      const stack = [...node.children];
      while (stack.length) {
        const current = stack.pop();
        if (!current) continue;
        if (current.id === candidateId) return true;
        stack.push(...current.children);
      }
      return false;
    }
    if (node.children.length && isDescendant(node.children, ancestorId, candidateId)) {
      return true;
    }
  }
  return false;
}

function getParentValue(parentId: FolderNode['id'] | null) {
  if (parentId === null || parentId === undefined) return '';
  return String(parentId);
}

function coerceId(value: string) {
  const numeric = Number(value);
  return Number.isNaN(numeric) ? value : numeric;
}

export default function AssetLibraryPanel({
  fallbackAssets,
  onAssetSelect,
  onAssetDragStart,
  translations,
}: AssetLibraryPanelProps) {
  const normalizedFallback = useMemo(() => normalizeFallbackAssets(fallbackAssets), [fallbackAssets]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [currentFolderId, setCurrentFolderId] = useState<FolderNode['id'] | null>(null);
  const [assets, setAssets] = useState<AssetItem[]>(normalizedFallback);
  const [folderTree, setFolderTree] = useState<FolderNode[]>(() => buildFolderTree(normalizedFallback));
  const [loading, setLoading] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  const [moveCandidate, setMoveCandidate] = useState<AssetItem | null>(null);
  const [moveTarget, setMoveTarget] = useState<FolderNode['id'] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; target: AssetItem | null } | null>(null);
  const [modalState, setModalState] = useState<
    | { type: 'create'; parentId: FolderNode['id'] | null }
    | { type: 'rename'; target: AssetItem }
    | { type: 'delete'; target: AssetItem }
    | null
  >(null);
  const [nameInput, setNameInput] = useState('');
  const assetsAreaRef = useRef<HTMLDivElement | null>(null);

  const filteredAssets = useMemo(
    () =>
      assets.filter((asset) => asset.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [assets, searchTerm]
  );

  const loadTree = useCallback(
    async (preferApi = true) => {
      if (!preferApi) {
        setFolderTree(buildFolderTree(normalizedFallback));
        return false;
      }
      try {
        const response = await fetch('/api/assets/tree?foldersOnly=true', { cache: 'no-store' });
        if (!response.ok) {
          if (normalizedFallback.length) {
            setUsingFallback(true);
            setFolderTree(buildFolderTree(normalizedFallback));
          } else {
            setErrorMessage(translations.errorGeneric);
          }
          return false;
        }
        const json = await response.json();
        const mapNode = (item: ApiFolderNode): FolderNode => ({
          id: item.id,
          name: item.name,
          parentId: item.parentId ?? null,
          children: (item.children ?? []).map(mapNode),
          source: 'api',
        });
        const mapped: FolderNode[] = ((json.items ?? []) as ApiFolderNode[]).map(mapNode);
        setFolderTree(mapped);
        setUsingFallback(false);
        return true;
      } catch (error: unknown) {
        if (normalizedFallback.length) {
          setUsingFallback(true);
          setFolderTree(buildFolderTree(normalizedFallback));
        } else {
          setErrorMessage(translations.errorGeneric);
        }
        return false;
      }
    },
    [normalizedFallback, translations.errorGeneric]
  );

  const loadAssets = useCallback(
    async (parentId: FolderNode['id'] | null, preferApi = true) => {
      setLoading(true);
      const useApi = preferApi && !usingFallback;
      if (useApi) {
        setErrorMessage(null);
      }
      if (!useApi) {
        setAssets(normalizedFallback.filter((asset) => (asset.parentId ?? null) === (parentId ?? null)));
        setLoading(false);
        return;
      }

      try {
        const search = parentId === null || parentId === undefined ? '' : String(parentId);
        const response = await fetch(`/api/assets?parentId=${encodeURIComponent(search)}`, { cache: 'no-store' });
        if (!response.ok) {
          if (normalizedFallback.length) {
            setUsingFallback(true);
            setAssets(normalizedFallback.filter((asset) => (asset.parentId ?? null) === (parentId ?? null)));
          } else {
            setErrorMessage(translations.errorGeneric);
          }
          setLoading(false);
          return;
        }
        const json = await response.json();
        const mapped: AssetItem[] = ((json.items ?? []) as ApiAsset[]).map((item) => ({
          id: item.id,
          name: item.name,
          type: item.type === 'FOLDER' ? 'folder' : 'file',
          parentId: item.parentId ?? null,
          thumbnail: item.previewUrl,
          source: 'api',
        }));
        setAssets(mapped);
        setUsingFallback(false);
      } catch (error: unknown) {
        if (normalizedFallback.length) {
          setUsingFallback(true);
          setAssets(normalizedFallback.filter((asset) => (asset.parentId ?? null) === (parentId ?? null)));
        } else {
          setErrorMessage(translations.errorGeneric);
        }
      } finally {
        setLoading(false);
      }
    },
    [normalizedFallback, translations.errorGeneric, usingFallback]
  );

  useEffect(() => {
    async function bootstrap() {
      const treeLoaded = await loadTree();
      await loadAssets(currentFolderId, treeLoaded);
    }
    void bootstrap();
  }, [currentFolderId, loadAssets, loadTree]);

  useEffect(() => {
    function handleGlobalClick() {
      setContextMenu(null);
    }
    function handleEsc(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setContextMenu(null);
        setModalState(null);
      }
    }
    window.addEventListener('click', handleGlobalClick);
    window.addEventListener('keyup', handleEsc);
    return () => {
      window.removeEventListener('click', handleGlobalClick);
      window.removeEventListener('keyup', handleEsc);
    };
  }, []);

  function handleFolderNavigate(folderId: FolderNode['id'] | null) {
    setCurrentFolderId(folderId);
    loadAssets(folderId);
  }

  function getActionError(code?: string | null) {
    if (code === ErrorCodes.ASSET_NAME_CONFLICT || code === 'ASSET_NAME_CONFLICT' || code === '00x0016') {
      return translations.errorConflict;
    }
    return translations.errorGeneric;
  }

  function openCreateModal(parentId?: FolderNode['id'] | null) {
    if (usingFallback) return;
    setErrorMessage(null);
    setModalState({ type: 'create', parentId: parentId ?? currentFolderId });
    setNameInput('');
    setContextMenu(null);
  }

  function openRenameModal(asset: AssetItem) {
    if (usingFallback || asset.type !== 'folder') return;
    setErrorMessage(null);
    setModalState({ type: 'rename', target: asset });
    setNameInput(asset.name);
    setContextMenu(null);
  }

  function openDeleteModal(asset: AssetItem) {
    if (usingFallback || asset.type !== 'folder') return;
    setErrorMessage(null);
    setModalState({ type: 'delete', target: asset });
    setContextMenu(null);
  }

  async function handleRefresh() {
    const treeLoaded = await loadTree(true);
    await loadAssets(currentFolderId, treeLoaded);
  }

  function handleContextMenu(event: React.MouseEvent, asset: AssetItem | null = null) {
    event.preventDefault();
    const bounds = assetsAreaRef.current?.getBoundingClientRect();
    const x = bounds ? event.clientX - bounds.left : event.clientX;
    const y = bounds ? event.clientY - bounds.top : event.clientY;
    setContextMenu({ x, y, target: asset });
  }

  function openMove(asset: AssetItem) {
    if (usingFallback || asset.type !== 'folder') return;
    setErrorMessage(null);
    setMoveCandidate(asset);
    setMoveTarget(asset.parentId ?? null);
    setContextMenu(null);
  }

  async function submitModal(event?: React.FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    if (!modalState || usingFallback) return;
    setLoading(true);
    try {
      if (modalState.type === 'create') {
        const trimmed = nameInput.trim();
        if (!trimmed) return;
        const response = await fetch('/api/assets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: trimmed, type: 'FOLDER', parentId: modalState.parentId }),
        });
        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          setErrorMessage(getActionError(payload?.code));
          return;
        }
      } else if (modalState.type === 'rename') {
        const trimmed = nameInput.trim();
        if (!trimmed || trimmed === modalState.target.name || typeof modalState.target.id !== 'number') return;
        const response = await fetch(`/api/assets/${modalState.target.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: trimmed }),
        });
        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          setErrorMessage(getActionError(payload?.code));
          return;
        }
      } else if (modalState.type === 'delete') {
        if (typeof modalState.target.id !== 'number') return;
        const response = await fetch(`/api/assets/${modalState.target.id}`, { method: 'DELETE' });
        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          setErrorMessage(getActionError(payload?.code));
          return;
        }
        if (moveCandidate?.id === modalState.target.id) {
          setMoveCandidate(null);
        }
      }

      setModalState(null);
      await loadTree();
      await loadAssets(currentFolderId);
    } finally {
      setLoading(false);
    }
  }

  async function handleMoveSubmit() {
    if (!moveCandidate || typeof moveCandidate.id !== 'number') return;
    if (usingFallback) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/assets/${moveCandidate.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parentId: moveTarget ?? null }),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        setErrorMessage(getActionError(payload?.code));
        return;
      }
      setMoveCandidate(null);
      await loadTree();
      await loadAssets(currentFolderId);
    } finally {
      setLoading(false);
    }
  }

  const folderOptions = useMemo(() => {
    const exclude = new Set<FolderNode['id']>();
    if (moveCandidate?.type === 'folder') {
      exclude.add(moveCandidate.id);
    }
    const options = [{ id: null as FolderNode['id'] | null, name: translations.root, depth: 0 }];
    const flattened = flattenFolderNodes(folderTree, exclude);
    const filtered = moveCandidate
      ? flattened.filter((opt) => !isDescendant(folderTree, moveCandidate.id, opt.id))
      : flattened;
    return [...options, ...filtered];
  }, [folderTree, moveCandidate, translations.root]);

  const headerActions = (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-1">
        <button
          onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          className="px-2 py-1 text-xs bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded-sm transition-colors"
          title={viewMode === 'grid' ? translations.list : translations.grid}
        >
          {viewMode === 'grid' ? '☰' : '⊞'}
        </button>
        <button
          onClick={() => openCreateModal()}
          disabled={loading || usingFallback}
          className="px-2 py-1 text-xs bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          title={translations.newFolder}
        >
          📁+
        </button>
        <button
          onClick={() => handleRefresh()}
          className="px-2 py-1 text-xs bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded-sm transition-colors"
          title={translations.refresh}
        >
          🔄
        </button>
      </div>
      <TextInput
        placeholder={translations.search}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        size="sm"
        className="w-48"
      />
    </div>
  );

  const renderAssetItem = (asset: AssetItem) => {
    const isFolder = asset.type === 'folder';
    const icon = isFolder ? '📁' : '🎨';
    const actionButtons = isFolder ? (
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
        <button
          onClick={(event) => {
            event.stopPropagation();
            openRenameModal(asset);
          }}
          disabled={loading || usingFallback || typeof asset.id !== 'number'}
          className="px-1 py-0.5 text-[10px] bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded-sm disabled:opacity-60"
          title={translations.rename}
        >
          ✏️
        </button>
        <button
          onClick={(event) => {
            event.stopPropagation();
            openMove(asset);
          }}
          disabled={loading || usingFallback || typeof asset.id !== 'number'}
          className="px-1 py-0.5 text-[10px] bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded-sm disabled:opacity-60"
          title={translations.move}
        >
          ↗
        </button>
        <button
          onClick={(event) => {
            event.stopPropagation();
            openDeleteModal(asset);
          }}
          disabled={loading || usingFallback || typeof asset.id !== 'number'}
          className="px-1 py-0.5 text-[10px] bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded-sm disabled:opacity-60"
          title={translations.delete}
        >
          🗑️
        </button>
      </div>
    ) : null;

    if (viewMode === 'grid') {
      return (
        <div
          key={String(asset.id)}
          draggable={!isFolder}
          onDragStart={() => !isFolder && onAssetDragStart?.(asset)}
          onClick={() => {
            if (isFolder) {
              handleFolderNavigate(asset.id);
            } else {
              onAssetSelect?.(asset);
            }
          }}
          onContextMenu={(event) => handleContextMenu(event, asset)}
          className="group relative flex flex-col items-center p-3 border border-neutral-300 dark:border-neutral-700 rounded-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer transition-colors"
        >
          {asset.thumbnail ? (
            <img
              src={asset.thumbnail}
              alt={asset.name}
              className="w-16 h-16 object-cover rounded-sm mb-2"
            />
          ) : (
            <div className="w-16 h-16 flex items-center justify-center text-3xl mb-2 bg-neutral-100 dark:bg-neutral-900 rounded-sm">
              {icon}
            </div>
          )}
          <span className="text-xs text-center truncate w-full" title={asset.name}>
            {asset.name}
          </span>
          {actionButtons && <div className="mt-2">{actionButtons}</div>}
        </div>
      );
    }

    return (
      <div
        key={String(asset.id)}
        draggable={!isFolder}
        onDragStart={() => !isFolder && onAssetDragStart?.(asset)}
        onClick={() => {
          if (isFolder) {
            handleFolderNavigate(asset.id);
          } else {
            onAssetSelect?.(asset);
          }
        }}
        onContextMenu={(event) => handleContextMenu(event, asset)}
        className="group relative flex items-center gap-3 px-3 py-2 border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer transition-colors"
      >
        <span className="text-xl">{icon}</span>
        <span className="flex-1 text-sm truncate">{asset.name}</span>
        {actionButtons}
      </div>
    );
  };

  return (
    <EditorPanel title={translations.title} headerActions={headerActions} className="h-full">
      <div className="space-y-3">
        <div className="flex gap-4 h-full">
          <div className="w-52 border border-neutral-200 dark:border-neutral-700 rounded-sm p-2 space-y-1 bg-white dark:bg-neutral-900 overflow-y-auto max-h-[320px] sm:max-h-full pr-1">
            <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-200">{translations.folders}</div>
            <button
              onClick={() => handleFolderNavigate(null)}
              className={`text-xs w-full text-left px-2 py-1 rounded-sm ${currentFolderId === null ? 'bg-neutral-200 dark:bg-neutral-700' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}
            >
              {translations.root}
            </button>
            <div className="space-y-1">
              {folderTree.map((node) => (
                <FolderTreeNode
                  key={String(node.id)}
                  node={node}
                  currentFolderId={currentFolderId}
                  onNavigate={handleFolderNavigate}
                />
              ))}
            </div>
          </div>

          <div
            className="flex-1 relative"
            ref={assetsAreaRef}
            data-testid="asset-area"
            onContextMenu={(event) => handleContextMenu(event, null)}
          >
            {errorMessage && (
              <div className="mb-2 text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/40 border border-amber-200 dark:border-amber-700 rounded-sm px-3 py-2">
                {errorMessage}
              </div>
            )}

            {filteredAssets.length === 0 ? (
              <div className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-8 border border-dashed border-neutral-200 dark:border-neutral-700 rounded-sm">
                {translations.noAssets}
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3'
                    : 'space-y-0'
                }
              >
                {filteredAssets.map((asset) => renderAssetItem(asset))}
              </div>
            )}

            <div className="text-xs text-center text-neutral-500 dark:text-neutral-400 italic py-4 border-t border-neutral-200 dark:border-neutral-700">
              {translations.dragDrop}
            </div>

            {contextMenu && (
              <div
                className="absolute z-20 min-w-[180px] rounded-sm border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-lg py-1 text-sm"
                style={{ top: contextMenu.y, left: contextMenu.x }}
                onClick={(event) => event.stopPropagation()}
                onContextMenu={(event) => event.preventDefault()}
              >
                <ContextMenuButton
                  label={translations.newFolder}
                  disabled={usingFallback}
                  onClick={() => openCreateModal(
                    contextMenu.target?.type === 'folder' ? contextMenu.target.id : currentFolderId
                  )}
                />
                <ContextMenuButton
                  label={translations.refresh}
                  onClick={() => {
                    handleRefresh();
                    setContextMenu(null);
                  }}
                />
                {contextMenu.target?.type === 'folder' && (
                  <>
                    <ContextMenuButton
                      label={translations.rename}
                      disabled={usingFallback || typeof contextMenu.target.id !== 'number'}
                      onClick={() => openRenameModal(contextMenu.target as AssetItem)}
                    />
                    <ContextMenuButton
                      label={translations.move}
                      disabled={usingFallback || typeof contextMenu.target.id !== 'number'}
                      onClick={() => openMove(contextMenu.target as AssetItem)}
                    />
                    <ContextMenuButton
                      label={translations.delete}
                      disabled={usingFallback || typeof contextMenu.target.id !== 'number'}
                      onClick={() => openDeleteModal(contextMenu.target as AssetItem)}
                    />
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {modalState && (
          <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 px-4" onClick={() => setModalState(null)}>
            <div
              className="w-full max-w-sm rounded-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 p-4 space-y-3"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                {modalState.type === 'create' && translations.newFolder}
                {modalState.type === 'rename' && translations.rename}
                {modalState.type === 'delete' && translations.delete}
              </div>

              {modalState.type === 'delete' ? (
                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                  {translations.confirmDelete.replace('{name}', modalState.target.name)}
                </p>
              ) : (
                <form className="space-y-2" onSubmit={submitModal}>
                  <label className="text-xs text-neutral-700 dark:text-neutral-300 flex flex-col gap-1">
                    {translations.namePlaceholder}
                    <input
                      value={nameInput}
                      onChange={(event) => setNameInput(event.target.value)}
                      className="w-full rounded-sm border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-2 py-1 text-sm"
                      autoFocus
                    />
                  </label>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setModalState(null)}
                      className="px-3 py-1 text-xs bg-neutral-200 dark:bg-neutral-700 rounded-sm"
                    >
                      {translations.cancel}
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-3 py-1 text-xs bg-primary-500 text-white rounded-sm disabled:opacity-60"
                    >
                      {translations.save}
                    </button>
                  </div>
                </form>
              )}

              {modalState.type === 'delete' && (
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModalState(null)}
                    className="px-3 py-1 text-xs bg-neutral-200 dark:bg-neutral-700 rounded-sm"
                  >
                    {translations.cancel}
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => submitModal()}
                    className="px-3 py-1 text-xs bg-red-500 text-white rounded-sm disabled:opacity-60"
                  >
                    {translations.delete}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {moveCandidate && moveCandidate.type === 'folder' && (
          <div className="border border-neutral-200 dark:border-neutral-700 rounded-sm p-3 bg-white dark:bg-neutral-900 space-y-2">
            <div className="text-sm font-semibold">{translations.moveTitle}</div>
            <div className="text-xs text-neutral-600 dark:text-neutral-400">
              {moveCandidate.name}
            </div>
            <label className="text-xs text-neutral-700 dark:text-neutral-300 flex flex-col gap-1">
              {translations.destination}
              <select
                className="text-sm px-2 py-1 border border-neutral-300 dark:border-neutral-700 rounded-sm bg-white dark:bg-neutral-800"
                value={getParentValue(moveTarget)}
                onChange={(e) => setMoveTarget(e.target.value === '' ? null : coerceId(e.target.value))}
              >
                {folderOptions.map((option) => (
                  <option key={String(option.id ?? 'root')} value={option.id === null ? '' : option.id}>
                    {`${'— '.repeat(option.depth)}${option.name}`}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex gap-2">
              <button
                onClick={handleMoveSubmit}
                disabled={loading || usingFallback}
                className="px-3 py-1 text-xs bg-primary-500 text-white rounded-sm disabled:opacity-60"
              >
                {translations.save}
              </button>
              <button
                onClick={() => setMoveCandidate(null)}
                className="px-3 py-1 text-xs bg-neutral-200 dark:bg-neutral-700 rounded-sm"
              >
                {translations.cancel}
              </button>
            </div>
          </div>
        )}
      </div>
    </EditorPanel>
  );
}

function FolderTreeNode({
  node,
  currentFolderId,
  onNavigate,
}: {
  node: FolderNode;
  currentFolderId: FolderNode['id'] | null;
  onNavigate: (id: FolderNode['id']) => void;
}) {
  return (
    <div className="space-y-1">
      <button
        onClick={() => onNavigate(node.id)}
        className={`text-xs w-full text-left px-2 py-1 rounded-sm ${currentFolderId === node.id ? 'bg-neutral-200 dark:bg-neutral-700' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}
      >
        {node.name}
      </button>
      {node.children.length > 0 && (
        <div className="ml-3 border-l border-neutral-200 dark:border-neutral-700 pl-2">
          {node.children.map((child) => (
            <FolderTreeNode
              key={String(child.id)}
              node={child}
              currentFolderId={currentFolderId}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ContextMenuButton({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`w-full text-left px-3 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
    >
      {label}
    </button>
  );
}
