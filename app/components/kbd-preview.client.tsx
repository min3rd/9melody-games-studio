"use client";
import React, { useState } from 'react';
import { Kbd } from '@/components/ui';
import type { Preset } from '@/components/ui/presets';
import type { UISize } from '@/components/ui/presets';

type UIPreset = Preset | 'custom' | 'none';

export default function KbdPreview(): React.ReactElement {
  const [preset, setPreset] = useState<UIPreset>('muted');
  const [color, setColor] = useState('#3b82f6');
  const [size, setSize] = useState<UISize>('sm');
  const [rounded, setRounded] = useState(true);
  const [withEffects, setWithEffects] = useState(true);

  const presetProp: Preset | undefined = preset === 'custom' || preset === 'none' ? undefined : (preset as Preset);
  const colorProp = preset === 'custom' ? color : undefined;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Kbd preset={presetProp} color={colorProp} size={size} rounded={rounded} withEffects={withEffects}>Ctrl</Kbd>
        <Kbd preset={presetProp} color={colorProp} size={size} rounded={rounded} withEffects={withEffects}>K</Kbd>
        <Kbd preset={presetProp} color={colorProp} size={size} rounded={rounded} withEffects={withEffects}>⌘</Kbd>
      </div>

      <div className="flex items-center gap-4">
        <label className="text-sm">Size
          <select className="ml-2 text-sm rounded p-1 border" value={size} onChange={(e) => setSize(e.target.value as UISize)}>
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
          </select>
        </label>

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
            <input className="ml-2" type="color" value={color} onChange={(e) => setColor(e.target.value)} />
          </label>
        )}

        <label className="text-sm">Rounded
          <input className="ml-2" type="checkbox" checked={rounded} onChange={(e) => setRounded(e.target.checked)} />
        </label>

        <label className="text-sm">Effects
          <input className="ml-2" type="checkbox" checked={withEffects} onChange={(e) => setWithEffects(e.target.checked)} />
        </label>
      </div>
    </div>
  );
}
