"use client";
import React, { useState } from 'react';
import Dock, { type DockItem } from '@/components/ui/Dock';
import { type Preset } from '@/components/ui/presets';
import type { UISize } from '@/components/ui/presets';

export default function DockPreview(): React.ReactElement {
  const [placement, setPlacement] = useState<'bottom'|'top'|'left'|'right'>('bottom');
  const [size, setSize] = useState<UISize>('md');
  const [preset] = useState<Preset>('muted');
  const [useCustom, setUseCustom] = useState(false);
  const [color, setColor] = useState('#3b82f6');
  const [showLabels, setShowLabels] = useState(false);
  const [hoverEffect, setHoverEffect] = useState<'scale'|'glow'|'bounce'|'highlight'|'none'>('scale');

  const items: DockItem[] = [
    {icon: <span className="inline-block w-6 h-6 bg-blue-500 rounded-full"/>, label: 'App1'},
    {icon: <span className="inline-block w-6 h-6 bg-green-500 rounded-full"/>, label: 'App2'},
    {icon: <span className="inline-block w-6 h-6 bg-red-500 rounded-full"/>, label: 'App3', active: true},
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 flex-wrap">
        <label className="text-sm">Placement
          <select className="ml-2 p-1 border rounded" value={placement} onChange={e => setPlacement(e.target.value as 'bottom'|'top'|'left'|'right')}>
            <option value="bottom">Bottom</option>
            <option value="top">Top</option>
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
        </label>
        <label className="text-sm">Size
          <select className="ml-2 p-1 border rounded" value={size} onChange={e => setSize(e.target.value as UISize)}>
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
          </select>
        </label>
        <label className="text-sm">Hover Effect
          <select className="ml-2 p-1 border rounded" value={hoverEffect} onChange={e => setHoverEffect(e.target.value as 'scale'|'glow'|'bounce'|'highlight'|'none')}>
            <option value="scale">Scale</option>
            <option value="glow">Glow</option>
            <option value="bounce">Bounce</option>
            <option value="highlight">Highlight</option>
            <option value="none">None</option>
          </select>
        </label>
        <label className="text-sm">Show Labels
          <input className="ml-2" type="checkbox" checked={showLabels} onChange={e => setShowLabels(e.target.checked)} />
        </label>
        <label className="text-sm">Use Custom Color
          <input className="ml-2" type="checkbox" checked={useCustom} onChange={e => setUseCustom(e.target.checked)} />
        </label>
        {useCustom && (
          <label className="text-sm">Color
            <input className="ml-2" type="color" value={color} onChange={(e) => setColor(e.target.value)} />
          </label>
        )}
      </div>

      <div className="mt-4 p-4 bg-white rounded border">
  <Dock items={items} placement={placement} size={size} preset={preset} color={useCustom ? color : undefined} hoverEffect={hoverEffect} showLabels={showLabels} />
      </div>
    </div>
  );
}
