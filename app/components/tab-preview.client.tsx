"use client";
import React, { useState } from 'react';
import Tabs from '@/components/ui/Tabs';
import { type Preset } from '@/components/ui/presets';
import type { UISize } from '@/components/ui/presets';

export default function TabPreview(): React.ReactElement {
  const [size, setSize] = useState<UISize>('md');
  const [preset, setPreset] = useState<Preset>('muted');
  const [useCustom, setUseCustom] = useState(false);
  const [color, setColor] = useState('#3b82f6');
  const [variant, setVariant] = useState<'solid'|'ghost'|'outline'>('ghost');
  const [rounded, setRounded] = useState<'sm'|'full'|'none'>('sm');
  const [withEffects, setWithEffects] = useState(true);
  const [active, setActive] = useState<string | number>('home');

  const items = [
    { key: 'home', label: 'Home' },
    { key: 'games', label: 'Games' },
    { key: 'blog', label: 'Blog' },
    { key: 'contact', label: 'Contact' },
  ];

  return (
    <div className="space-y-4 bg-white dark:bg-neutral-900 rounded-lg shadow text-neutral-900 dark:text-neutral-100 p-4">
      <div className="flex items-center gap-4">
        <label className="text-sm">Size
          <select className="ml-2 rounded p-1 border text-sm" value={size} onChange={(e) => setSize(e.target.value as UISize)}>
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
          </select>
        </label>
        <label className="text-sm">Variant
          <select className="ml-2 rounded p-1 border text-sm" value={variant} onChange={(e) => setVariant(e.target.value as 'solid'|'ghost'|'outline')}>
            <option value="ghost">ghost</option>
            <option value="solid">solid</option>
            <option value="outline">outline</option>
          </select>
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
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        )}
        <label className="text-sm">Rounded
          <select className="ml-2 rounded p-1 border text-sm" value={rounded} onChange={(e) => setRounded(e.target.value as 'sm'|'full'|'none')}>
            <option value="sm">sm</option>
            <option value="full">full</option>
            <option value="none">none</option>
          </select>
        </label>
        <label className="text-sm">With Effects
          <input className="ml-2" type="checkbox" checked={withEffects} onChange={(e) => setWithEffects(e.target.checked)} />
        </label>
      </div>

      <div className="p-4 bg-white border rounded">
        <Tabs items={items} activeKey={active} onTabChange={(k) => setActive(k)} size={size} preset={preset} color={useCustom ? color : undefined} rounded={rounded} withEffects={withEffects} variant={variant} renderPanel={(key) => (
          <div className="p-4">
            <div className="font-medium">Panel for {String(key)}</div>
            <div className="text-sm text-neutral-600">Sample content for {String(key)} tab.</div>
          </div>
        )} />
      </div>
    </div>
  );
}
