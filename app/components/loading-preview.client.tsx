"use client";
import React, { useState } from 'react';
import Loading from '@/components/ui/Loading';
import { type Preset } from '@/components/ui/presets';
import type { UISize } from '@/components/ui/presets';

export default function LoadingPreview(): React.ReactElement {
  const [size, setSize] = useState<UISize>('md');
  const [preset, setPreset] = useState<Preset>('muted');
  const [useCustom, setUseCustom] = useState(false);
  const [color, setColor] = useState('#06b6d4');
  const [inline, setInline] = useState(false);
  const [overlay, setOverlay] = useState(false);
  // Keep `text` for backward-compat if needed by component API; not used in preview
  // const [text, setText] = useState('Loading...');
  const [label, setLabel] = useState('Loading...');

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="text-sm">Size
          <select className="ml-2 rounded p-1 border text-sm" value={size} onChange={(e) => setSize(e.target.value as UISize)}>
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
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
        <label className="text-sm">Custom Color
          <input className="ml-2" type="checkbox" checked={useCustom} onChange={(e) => setUseCustom(e.target.checked)} />
        </label>
        {useCustom && (
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        )}
        <label className="text-sm">Inline
          <input className="ml-2" type="checkbox" checked={inline} onChange={(e) => setInline(e.target.checked)} />
        </label>
        <label className="text-sm">Overlay
          <input className="ml-2" type="checkbox" checked={overlay} onChange={(e) => setOverlay(e.target.checked)} />
        </label>
        <label className="text-sm">Label
          <input className="ml-2 rounded p-1 border text-sm" value={label} onChange={(e) => setLabel(e.target.value)} />
        </label>
      </div>

      <div className="p-4 bg-white border rounded">
        <div className={`p-6 ${overlay ? 'relative' : ''}`}>
          <Loading size={size} preset={preset} color={useCustom ? color : undefined} label={label} inline={inline} overlay={overlay} />
        </div>
      </div>
    </div>
  );
}
