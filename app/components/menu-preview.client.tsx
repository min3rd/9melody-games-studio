"use client";
import React, { useState } from 'react';
import Menu, { type MenuItemProps } from '@/components/ui/Menu';
import { type Preset } from '@/components/ui/presets';
import type { UISize } from '@/components/ui/presets';

export default function MenuPreview(): React.ReactElement {
  const [size, setSize] = useState<UISize>('md');
  const [preset, setPreset] = useState<Preset>('muted');
  const [useCustom, setUseCustom] = useState(false);
  const [color, setColor] = useState('#06b6d4');
  const [withEffects, setWithEffects] = useState(true);

  const items: MenuItemProps[] = [
    { label: 'New File', icon: <span className="w-4 h-4 bg-neutral-300 rounded-full" />, shortcut: '⌘N' },
    { label: 'Open...', icon: <span className="w-4 h-4 bg-neutral-300 rounded-full" />, shortcut: '⌘O' },
    { label: 'Save', icon: <span className="w-4 h-4 bg-neutral-300 rounded-full" />, shortcut: '⌘S', disabled: true },
    { label: 'Quit', icon: <span className="w-4 h-4 bg-neutral-300 rounded-full" />, shortcut: '⌘Q' },
  ];

  return (
    <div className="space-y-4 bg-white dark:bg-neutral-800 rounded-lg shadow text-neutral-900 dark:text-neutral-100">
      <div className="flex items-center gap-4">
        <label className="text-sm">Size
          <select className="ml-2 rounded p-1 border text-sm" value={size} onChange={(e) => setSize(e.target.value as UISize)}>
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
          </select>
        </label>
        <label className="text-sm">With Effects
          <input className="ml-2" type="checkbox" checked={withEffects} onChange={(e) => setWithEffects(e.target.checked)} />
        </label>
        <label className="text-sm">Preset
          <select className="ml-2 rounded p-1 border text-sm" value={preset} onChange={(e) => setPreset(e.target.value as Preset)}>
            <option value="muted">muted</option>
            <option value="primary">primary</option>
            <option value="success">success</option>
            <option value="danger">danger</option>
            <option value="warning">warning</option>
            <option value="info">info</option>
          </select>
        </label>
        <label className="text-sm">Use custom color
          <input className="ml-2" type="checkbox" checked={useCustom} onChange={(e) => setUseCustom(e.target.checked)} />
        </label>
        {useCustom && (
          <label className="text-sm">Color
            <input className="ml-2" type="color" value={color} onChange={(e) => setColor(e.target.value)} />
          </label>
        )}
      </div>

      <div className="mt-4 p-4 bg-white dark:bg-neutral-800 rounded">
        <Menu items={items} size={size} preset={preset} color={useCustom ? color : undefined} withEffects={withEffects} />
      </div>
    </div>
  );
}
