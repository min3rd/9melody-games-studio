"use client";
import React, { useState } from 'react';
import Alert from '@/components/ui/Alert';
import { type Preset } from '@/components/ui/presets';
import type { UISize } from '@/components/ui/presets';

export default function AlertPreview(): React.ReactElement {
  const [preset, setPreset] = useState<Preset>('muted');
  const [useCustom, setUseCustom] = useState(false);
  const [color, setColor] = useState('#f59e0b');
  const [size, setSize] = useState<UISize>('md');
  const [variant, setVariant] = useState<'solid'|'outline'|'ghost'>('outline');
  const [rounded, setRounded] = useState<'sm'|'full'|'none'>('sm');
  const [withEffects, setWithEffects] = useState(true);
  const [dismissible, setDismissible] = useState(true);
  const [showAction] = useState(true);

  return (
    <div className="space-y-4 bg-white dark:bg-neutral-800 rounded-lg shadow text-neutral-900 dark:text-neutral-100">
      <div className="flex items-center gap-4">
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
        <label className="text-sm">Custom color
          <input className="ml-2" type="checkbox" checked={useCustom} onChange={(e) => setUseCustom(e.target.checked)} />
        </label>
        {useCustom && <input className="ml-2" type="color" value={color} onChange={(e) => setColor(e.target.value)} />}
        <label className="text-sm">Variant
          <select className="ml-2 rounded p-1 border text-sm" value={variant} onChange={(e) => setVariant(e.target.value as 'solid'|'outline'|'ghost')}>
            <option value="outline">outline</option>
            <option value="solid">solid</option>
            <option value="ghost">ghost</option>
          </select>
        </label>
        <label className="text-sm">Size
          <select className="ml-2 rounded p-1 border text-sm" value={size} onChange={(e) => setSize(e.target.value as UISize)}>
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
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
        <label className="text-sm">Dismissible
          <input className="ml-2" type="checkbox" checked={dismissible} onChange={(e) => setDismissible(e.target.checked)} />
        </label>
      </div>

      <div className="p-4 bg-white border rounded">
        <Alert
          title="Heads up"
          description="This is an alert message to notify the user about something important."
          preset={preset}
          color={useCustom ? color : undefined}
          variant={variant}
          size={size}
          rounded={rounded}
          withEffects={withEffects}
          dismissible={dismissible}
          action={showAction ? { label: 'Fix', preset: preset, onClick: () => alert('Action clicked') } : undefined}
        />
      </div>
    </div>
  );
}
