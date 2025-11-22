"use client";
import React, { useState } from 'react';
import Progress, { type LabelPosition } from '@/components/ui/Progress';
import { type Preset } from '@/components/ui/presets';
import type { UISize } from '@/components/ui/presets';

export default function ProgressPreview(): React.ReactElement {
  const [value, setValue] = useState(45);
  const [indeterminate, setIndeterminate] = useState(false);
  const [size, setSize] = useState<UISize>('md');
  const [preset, setPreset] = useState<Preset>('muted');
  const [useCustom, setUseCustom] = useState(false);
  const [color, setColor] = useState('#06b6d4');
  const [labelPosition, setLabelPosition] = useState<LabelPosition>('inside');
  const [rounded, setRounded] = useState<'sm'|'full'|'none'>('sm');
  const [withEffects, setWithEffects] = useState(true);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="text-sm">Value
          <input type="range" min={0} max={100} value={value} onChange={(e) => setValue(Number(e.target.value))} className="ml-2" />
        </label>
        <label className="text-sm">Indeterminate
          <input className="ml-2" type="checkbox" checked={indeterminate} onChange={(e) => setIndeterminate(e.target.checked)} />
        </label>
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
        {useCustom && <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />}
      </div>

      <div className="flex items-center gap-4">
        <label className="text-sm">Label Position
          <select className="ml-2 rounded p-1 border text-sm" value={labelPosition} onChange={(e) => setLabelPosition(e.target.value as LabelPosition)}>
            <option value="inside">inside</option>
            <option value="outside">outside</option>
            <option value="none">none</option>
          </select>
        </label>
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
        <Progress value={value} indeterminate={indeterminate} size={size} preset={preset} color={useCustom ? color : undefined} rounded={rounded} withEffects={withEffects} labelPosition={labelPosition} />
      </div>
    </div>
  );
}
