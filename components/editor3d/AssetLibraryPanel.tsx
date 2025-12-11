"use client";
import React, { useState } from 'react';
import EditorPanel from './EditorPanel';
import { TextInput, Button } from '@/components/ui';

export interface AssetItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  thumbnail?: string;
  path: string;
  children?: AssetItem[];
}

export interface AssetLibraryPanelProps {
  assets: AssetItem[];
  onAssetSelect?: (asset: AssetItem) => void;
  onAssetDragStart?: (asset: AssetItem) => void;
  onNewFolder?: (parentPath: string) => void;
  onUpload?: () => void;
  onRefresh?: () => void;
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
  };
}

/**
 * AssetLibraryPanel - File explorer-like interface for managing 3D assets
 */
export default function AssetLibraryPanel({
  assets,
  onAssetSelect,
  onAssetDragStart,
  onNewFolder,
  onUpload,
  onRefresh,
  translations,
}: AssetLibraryPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPath, setCurrentPath] = useState('/');

  const filteredAssets = assets.filter((asset) =>
    asset.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderAssetItem = (asset: AssetItem) => {
    const isFolder = asset.type === 'folder';
    const icon = isFolder ? '📁' : '🎨';

    if (viewMode === 'grid') {
      return (
        <div
          key={asset.id}
          draggable={!isFolder}
          onDragStart={() => !isFolder && onAssetDragStart?.(asset)}
          onClick={() => {
            if (isFolder) {
              setCurrentPath(asset.path);
            } else {
              onAssetSelect?.(asset);
            }
          }}
          className="flex flex-col items-center p-3 border border-neutral-300 dark:border-neutral-700 rounded-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer transition-colors"
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
        </div>
      );
    }

    // List view
    return (
      <div
        key={asset.id}
        draggable={!isFolder}
        onDragStart={() => !isFolder && onAssetDragStart?.(asset)}
        onClick={() => {
          if (isFolder) {
            setCurrentPath(asset.path);
          } else {
            onAssetSelect?.(asset);
          }
        }}
        className="flex items-center gap-3 px-3 py-2 border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer transition-colors"
      >
        <span className="text-xl">{icon}</span>
        <span className="flex-1 text-sm truncate">{asset.name}</span>
        {!isFolder && <span className="text-xs text-neutral-500">Asset</span>}
      </div>
    );
  };

  const headerActions = (
    <div className="flex items-center gap-1">
      <button
        onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
        className="px-2 py-1 text-xs bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded-sm transition-colors"
        title={viewMode === 'grid' ? translations.list : translations.grid}
      >
        {viewMode === 'grid' ? '☰' : '⊞'}
      </button>
      <button
        onClick={() => onNewFolder?.(currentPath)}
        className="px-2 py-1 text-xs bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded-sm transition-colors"
        title={translations.newFolder}
      >
        📁+
      </button>
      <button
        onClick={onUpload}
        className="px-2 py-1 text-xs bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded-sm transition-colors"
        title={translations.upload}
      >
        ⬆️
      </button>
      <button
        onClick={onRefresh}
        className="px-2 py-1 text-xs bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded-sm transition-colors"
        title={translations.refresh}
      >
        🔄
      </button>
    </div>
  );

  return (
    <EditorPanel title={translations.title} headerActions={headerActions} className="h-full">
      <div className="space-y-3">
        {/* Search Bar */}
        <TextInput
          placeholder={translations.search}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="sm"
          className="w-full"
        />

        {/* Current Path Breadcrumb */}
        {currentPath !== '/' && (
          <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
            <button
              onClick={() => setCurrentPath('/')}
              className="hover:text-primary-500 transition-colors"
            >
              Home
            </button>
            <span>/</span>
            <span className="text-neutral-800 dark:text-neutral-200">{currentPath}</span>
          </div>
        )}

        {/* Assets Grid/List */}
        {filteredAssets.length === 0 ? (
          <div className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-8">
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

        {/* Drag Drop Hint */}
        <div className="text-xs text-center text-neutral-500 dark:text-neutral-400 italic py-4 border-t border-neutral-200 dark:border-neutral-700">
          {translations.dragDrop}
        </div>
      </div>
    </EditorPanel>
  );
}
