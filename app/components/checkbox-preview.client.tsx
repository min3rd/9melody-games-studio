"use client";
import React, { useState } from 'react';
import Checkbox from '@/components/ui/Checkbox';
import { type Preset } from '@/components/ui/presets';

export default function CheckboxPreview(): React.ReactElement {
  const [checked, setChecked] = useState(false);
  const [preset, setPreset] = useState<Preset>('primary');
  const [useCustom, setUseCustom] = useState(false);
  const [color, setColor] = useState('#06b6d4');
  const [size, setSize] = useState<'sm'|'md'|'lg'>('md');
  const [disabled, setDisabled] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 flex-wrap">
        <label className="text-sm">Checked
          <input className="ml-2" type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} />
        </label>
        <label className="text-sm">Disabled
          <input className="ml-2" type="checkbox" checked={disabled} onChange={(e) => setDisabled(e.target.checked)} />
        </label>
        <label className="text-sm">Size
          <select className="ml-2 rounded p-1 border text-sm" value={size} onChange={(e) => setSize(e.target.value as 'sm'|'md'|'lg')}>
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
          </select>
        </label>
        <label className="text-sm">Preset
          <select className="ml-2 rounded p-1 border text-sm" value={preset} onChange={(e) => setPreset(e.target.value as Preset)}>
            <option value="primary">primary</option>
            <option value="muted">muted</option>
            <option value="success">success</option>
            <option value="danger">danger</option>
            <option value="warning">warning</option>
            <option value="info">info</option>
          </select>
        </label>
        <label className="text-sm">Custom Color
          <input className="ml-2" type="checkbox" checked={useCustom} onChange={(e) => setUseCustom(e.target.checked)} />
        </label>
        {useCustom && <input className="ml-2" type="color" value={color} onChange={(e) => setColor(e.target.value)} />}
      </div>

      <div className="p-4 bg-white border rounded">
        <Checkbox
          checked={checked}
          onCheckedChange={setChecked}
          title={<span>Lead checkbox</span>}
          description="A short description"
          hint="Hint"
          size={size}
          disabled={disabled}
          preset={preset}
          color={useCustom ? color : undefined}
        />
      </div>
    </div>
  );
}
