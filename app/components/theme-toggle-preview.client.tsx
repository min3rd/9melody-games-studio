"use client";
import React, { useState } from 'react';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { type Preset } from '@/components/ui/presets';

export default function ThemeTogglePreview(): React.ReactElement {
  const [preset, setPreset] = useState<Preset | null>('muted');
  const [useCustom, setUseCustom] = useState(false);
  const [color, setColor] = useState('#06b6d4');

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="text-sm">Preset
          <select className="ml-2 rounded p-1 border text-sm" value={preset ?? 'muted'} onChange={(e) => setPreset(e.target.value as Preset)}>
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
      </div>
      <div className="p-4 bg-white border rounded flex items-center gap-2">
        <ThemeToggle preset={useCustom ? undefined : (preset ?? 'muted')} color={useCustom ? color : undefined} />
        <span className="text-sm">Toggle theme color</span>
      </div>
    </div>
  );
}
