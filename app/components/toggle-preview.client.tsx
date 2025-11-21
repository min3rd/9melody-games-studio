"use client";
import React, { useState } from 'react';
import { Toggle } from '@/components/ui';
import { CodePreview } from '@/components/ui';

export default function TogglePreview() {
  const [checked, setChecked] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [color, setColor] = useState('#3b82f6');
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
        <label className="text-sm ml-2">Color
          <input type="color" className="ml-2" value={color} onChange={(e) => setColor(e.target.value)} />
        </label>
      </div>

      <Toggle
        checked={checked}
        onCheckedChange={(c) => setChecked(c)}
        disabled={disabled}
        title={title}
        description={description}
        hint={hint}
        color={color}
      />

      <CodePreview code={`<Toggle
  checked={${checked}}
  onCheckedChange={(c) => setChecked(c)}
  disabled={${disabled}}
  title={\"${title}\"}
  description={\"${description}\"}
  hint={\"${hint}\"}
  color={\"${color}\"}
/>`} />
    </div>
  );
}
