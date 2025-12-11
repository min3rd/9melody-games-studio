"use client";
import React from 'react';
import EditorPanel from './EditorPanel';
import { TextInput, Range, Toggle } from '@/components/ui';
import { SceneObject } from './HierarchyPanel';

export interface PropertiesPanelProps {
  selectedObject: SceneObject | null;
  onPropertyChange?: (property: string, value: any) => void;
  translations: {
    title: string;
    noSelection: string;
    selectObject: string;
    transform: string;
    position: string;
    rotation: string;
    scale: string;
    appearance: string;
    color: string;
    wireframe: string;
  };
}

/**
 * PropertiesPanel - Displays and allows editing properties of the selected object
 */
export default function PropertiesPanel({
  selectedObject,
  onPropertyChange,
  translations,
}: PropertiesPanelProps) {
  if (!selectedObject) {
    return (
      <EditorPanel title={translations.title} className="h-full">
        <div className="flex flex-col items-center justify-center h-full text-center text-neutral-500 dark:text-neutral-400">
          <div className="text-4xl mb-4">📋</div>
          <div className="text-sm font-medium">{translations.noSelection}</div>
          <div className="text-xs mt-2">{translations.selectObject}</div>
        </div>
      </EditorPanel>
    );
  }

  return (
    <EditorPanel title={translations.title} className="h-full">
      <div className="space-y-6">
        {/* Object Name */}
        <div>
          <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Name
          </label>
          <TextInput
            value={selectedObject.name}
            onChange={(e) => onPropertyChange?.('name', e.target.value)}
            size="sm"
            className="w-full"
          />
        </div>

        {/* Transform Section */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 uppercase tracking-wide">
            {translations.transform}
          </h4>

          {/* Position */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              {translations.position}
            </label>
            <div className="space-y-2">
              {['X', 'Y', 'Z'].map((axis) => (
                <div key={axis} className="flex items-center gap-2">
                  <span className="text-xs font-medium w-4">{axis}</span>
                  <input
                    type="number"
                    defaultValue={0}
                    step={0.1}
                    className="flex-1 px-2 py-1 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-sm"
                    onChange={(e) => onPropertyChange?.(`position${axis}`, parseFloat(e.target.value))}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Rotation */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              {translations.rotation}
            </label>
            <div className="space-y-2">
              {['X', 'Y', 'Z'].map((axis) => (
                <div key={axis} className="flex items-center gap-2">
                  <span className="text-xs font-medium w-4">{axis}</span>
                  <input
                    type="number"
                    defaultValue={0}
                    step={1}
                    className="flex-1 px-2 py-1 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-sm"
                    onChange={(e) => onPropertyChange?.(`rotation${axis}`, parseFloat(e.target.value))}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Scale */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              {translations.scale}
            </label>
            <div className="space-y-2">
              {['X', 'Y', 'Z'].map((axis) => (
                <div key={axis} className="flex items-center gap-2">
                  <span className="text-xs font-medium w-4">{axis}</span>
                  <input
                    type="number"
                    defaultValue={1}
                    step={0.1}
                    min={0.1}
                    className="flex-1 px-2 py-1 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-sm"
                    onChange={(e) => onPropertyChange?.(`scale${axis}`, parseFloat(e.target.value))}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Appearance Section - Only for objects */}
        {selectedObject.type === 'object' && (
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 uppercase tracking-wide">
              {translations.appearance}
            </h4>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                {translations.color}
              </label>
              <input
                type="color"
                defaultValue="#3b82f6"
                className="w-full h-8 rounded-sm border border-neutral-300 dark:border-neutral-700 cursor-pointer"
                onChange={(e) => onPropertyChange?.('color', e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                {translations.wireframe}
              </label>
              <Toggle
                size="sm"
                defaultChecked={false}
                onChange={(checked) => onPropertyChange?.('wireframe', checked)}
              />
            </div>
          </div>
        )}

        {/* Light Settings - Only for lights */}
        {selectedObject.type === 'light' && (
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 uppercase tracking-wide">
              Light Settings
            </h4>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Intensity
              </label>
              <Range
                min={0}
                max={2}
                step={0.1}
                defaultValue={1}
                size="sm"
                onChange={(value) => onPropertyChange?.('intensity', value)}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                {translations.color}
              </label>
              <input
                type="color"
                defaultValue="#ffffff"
                className="w-full h-8 rounded-sm border border-neutral-300 dark:border-neutral-700 cursor-pointer"
                onChange={(e) => onPropertyChange?.('color', e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
    </EditorPanel>
  );
}
