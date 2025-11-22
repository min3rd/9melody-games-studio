"use client";
import React, { useState } from 'react';
import { List, ListItem } from '@/components/ui';
import type { Preset } from '@/components/ui/presets';

type UIPreset = Preset | 'custom' | 'none';

export default function ListPreview(): React.ReactElement {
  const [preset, setPreset] = useState<UIPreset>('muted');
  const [color, setColor] = useState('#f59e0b');
  const [size, setSize] = useState<'sm'|'md'|'lg'>('md');
  const [rounded, setRounded] = useState(true);
  const [divided, setDivided] = useState(true);

  const presetProp = preset === 'custom' || preset === 'none' ? undefined : (preset as Preset);
  const colorProp = preset === 'custom' ? color : undefined;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="text-sm">Preset
          <select className="ml-2 text-sm rounded p-1 border" value={preset} onChange={(e) => setPreset(e.target.value as UIPreset)}>
            <option value="primary">Primary</option>
            <option value="success">Success</option>
            <option value="danger">Danger</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
            <option value="muted">Muted</option>
            <option value="custom">Custom</option>
            <option value="none">None</option>
          </select>
        </label>
        {preset === 'custom' && (
          <label className="text-sm">Color
            <input type="color" className="ml-2" value={color} onChange={(e) => setColor(e.target.value)} />
          </label>
        )}
        <label className="text-sm">Size
          <select className="ml-2 text-sm rounded p-1 border" value={size} onChange={(e) => setSize(e.target.value as 'sm'|'md'|'lg')}>
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
          </select>
        </label>
        <label className="text-sm">Rounded
          <input className="ml-2" type="checkbox" checked={rounded} onChange={(e) => setRounded(e.target.checked)} />
        </label>
        <label className="text-sm">Dividers
          <input className="ml-2" type="checkbox" checked={divided} onChange={(e) => setDivided(e.target.checked)} />
        </label>
      </div>

      <div className="mt-4">
        <List preset={presetProp} color={colorProp} size={size} rounded={rounded} divided={divided} className="max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-sm">
          <ListItem leading={<span>🥐</span>} trailing={<button className="btn">Go</button>}>First item</ListItem>
          <ListItem leading={<span>🍕</span>} trailing={<button className="btn">Open</button>} selected>Second item (selected)</ListItem>
          <ListItem leading={<span>🍔</span>} disabled>Disabled item</ListItem>
          <ListItem leading={<span>🍣</span>}>Last item</ListItem>
        </List>
      </div>
    </div>
  );
}
