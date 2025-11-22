"use client";
import React, { useState } from 'react';
import { Toggle } from '@/components/ui';
import type { Preset } from '@/components/ui/presets';
import { CodePreview } from '@/components/ui';

export default function TogglePreview() {
  const [checked, setChecked] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [color, setColor] = useState('#3b82f6');
  type UITogglePreset = Preset | 'custom' | 'none';
  const [preset, setPreset] = useState<UITogglePreset>('primary');
  const [title, setTitle] = useState('Enable feature');
  const [description, setDescription] = useState('Toggle this to enable or disable the feature');
  const [hint, setHint] = useState('Beta');

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <button className="px-3 py-2 rounded bg-foreground text-background" onClick={() => setChecked((c) => !c)}>
          Toggle controlled
        </button>
        <label className="text-sm"><input type="checkbox" checked={disabled} onChange={(e) => setDisabled(e.target.checked)} /> Disabled</label>
        <label className="text-sm ml-2">Preset
          <select className="ml-2 text-sm rounded p-1 border" value={preset} onChange={(e) => setPreset(e.target.value as UITogglePreset)}>
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
          <label className="text-sm ml-2">Custom
            <input type="color" className="ml-2" value={color} onChange={(e) => setColor(e.target.value)} />
          </label>
        )}
      </div>

      <Toggle
        checked={checked}
        onCheckedChange={(c) => setChecked(c)}
        disabled={disabled}
        title={title}
        description={description}
        hint={hint}
        {...(preset === 'custom' ? { color } : {})}
        {...(preset !== 'custom' && preset !== 'none' ? { preset } : {})}
      />

      <CodePreview code={`<Toggle
  checked={${checked}}
  onCheckedChange={(c) => setChecked(c)}
  disabled={${disabled}}
  title={\"${title}\"}
  description={\"${description}\"}
  hint={\"${hint}\"}
  ${preset === 'custom' ? `color={"${color}"}` : (preset !== 'none' ? `preset={"${preset}"}` : '')}
/>`} />
    </div>
  );
}
