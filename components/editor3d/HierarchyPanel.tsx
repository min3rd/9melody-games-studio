"use client";
import React, { useState } from 'react';
import EditorPanel from './EditorPanel';
import { Button, TextInput } from '@/components/ui';

export interface SceneObject {
  id: string;
  name: string;
  type: 'object' | 'light' | 'group';
  children?: SceneObject[];
  selected?: boolean;
}

export interface HierarchyPanelProps {
  objects: SceneObject[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  onAdd?: (type: 'object' | 'light' | 'group') => void;
  onDelete?: (id: string) => void;
  onRename?: (id: string, newName: string) => void;
  translations: {
    title: string;
    addObject: string;
    addLight: string;
    addGroup: string;
    noObjects: string;
    delete: string;
    rename: string;
  };
}

/**
 * HierarchyPanel - Displays the scene hierarchy with objects, lights, and groups
 */
export default function HierarchyPanel({
  objects,
  selectedId,
  onSelect,
  onAdd,
  onDelete,
  onRename,
  translations,
}: HierarchyPanelProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleStartRename = (obj: SceneObject) => {
    setEditingId(obj.id);
    setEditingName(obj.name);
  };

  const handleFinishRename = () => {
    if (editingId && editingName.trim()) {
      onRename?.(editingId, editingName.trim());
    }
    setEditingId(null);
    setEditingName('');
  };

  const renderObject = (obj: SceneObject, level = 0) => {
    const isSelected = obj.id === selectedId;
    const isEditing = obj.id === editingId;
    const icon = obj.type === 'light' ? '💡' : obj.type === 'group' ? '📁' : '📦';

    return (
      <div key={obj.id} style={{ marginLeft: `${level * 16}px` }}>
        <div
          className={`flex items-center gap-2 px-2 py-1.5 rounded-sm cursor-pointer transition-colors ${
            isSelected
              ? 'bg-primary-500 text-white'
              : 'hover:bg-neutral-100 dark:hover:bg-neutral-700'
          }`}
          onClick={() => !isEditing && onSelect?.(obj.id)}
        >
          <span className="text-sm">{icon}</span>
          {isEditing ? (
            <input
              type="text"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onBlur={handleFinishRename}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleFinishRename();
                if (e.key === 'Escape') {
                  setEditingId(null);
                  setEditingName('');
                }
              }}
              className="flex-1 px-1 py-0.5 text-xs bg-white dark:bg-neutral-900 border rounded-sm"
              autoFocus
            />
          ) : (
            <span className="flex-1 text-sm">{obj.name}</span>
          )}
          {isSelected && !isEditing && (
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartRename(obj);
                }}
                className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded-sm text-xs"
                title={translations.rename}
              >
                ✏️
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(obj.id);
                }}
                className="p-1 hover:bg-red-500 rounded-sm text-xs"
                title={translations.delete}
              >
                🗑️
              </button>
            </div>
          )}
        </div>
        {obj.children?.map((child) => renderObject(child, level + 1))}
      </div>
    );
  };

  const headerActions = (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onAdd?.('object')}
        className="px-2 py-1 text-xs bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded-sm transition-colors"
        title={translations.addObject}
      >
        + 📦
      </button>
      <button
        onClick={() => onAdd?.('light')}
        className="px-2 py-1 text-xs bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded-sm transition-colors"
        title={translations.addLight}
      >
        + 💡
      </button>
      <button
        onClick={() => onAdd?.('group')}
        className="px-2 py-1 text-xs bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded-sm transition-colors"
        title={translations.addGroup}
      >
        + 📁
      </button>
    </div>
  );

  return (
    <EditorPanel title={translations.title} headerActions={headerActions} className="h-full">
      {objects.length === 0 ? (
        <div className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-8">
          {translations.noObjects}
        </div>
      ) : (
        <div className="space-y-0.5">{objects.map((obj) => renderObject(obj))}</div>
      )}
    </EditorPanel>
  );
}
