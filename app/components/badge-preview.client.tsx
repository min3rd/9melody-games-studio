"use client";
import React, { useState } from 'react';
import { Badge, CodePreview } from '@/components/ui';
import type { Preset } from '@/components/ui/presets';
import PreviewLayout from '@/components/preview/PreviewLayout';

type UIPreset = Preset | 'custom' | 'none';

export default function BadgePreview(): React.ReactElement {
  const [preset, setPreset] = useState<UIPreset>('muted');
  const [color, setColor] = useState<string>('#3b82f6');
  const [size, setSize] = useState<'sm'|'md'|'lg'>('md');
  const [rounded, setRounded] = useState(true);
  const [withEffects, setWithEffects] = useState(true);
  const [asDot, setAsDot] = useState(false);
  const [value, setValue] = useState(7);

  const presetProp: Preset | undefined = preset === 'custom' || preset === 'none' ? undefined : (preset as Preset);
  const colorProp = preset === 'custom' ? color : undefined;

  const preview = (
    <div className="flex items-center gap-4">
      <Badge preset={presetProp} color={colorProp} size={size} rounded={rounded} withEffects={withEffects}>{value}</Badge>
      <Badge preset={presetProp} color={colorProp} size={size} rounded={rounded} withEffects={withEffects}>{'New'}</Badge>
      <Badge preset={presetProp} color={colorProp} size={size} rounded={rounded} withEffects={withEffects} asDot={asDot} />
    </div>
  );

  const controls = (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <label className="text-sm">Size
          <select className="ml-2 text-sm rounded p-1 border" value={size} onChange={(e) => setSize(e.target.value as 'sm'|'md'|'lg')}>
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
          <label className="text-sm">Custom color
            <input className="ml-2" type="color" value={color} onChange={(e) => setColor(e.target.value)} />
          </label>
        )}
      </div>

      <div className="flex gap-4 items-center">
        <label className="text-sm">Rounded
          <input className="ml-2" type="checkbox" checked={rounded} onChange={(e) => setRounded(e.target.checked)} />
        </label>
        <label className="text-sm">Effects
          <input className="ml-2" type="checkbox" checked={withEffects} onChange={(e) => setWithEffects(e.target.checked)} />
        </label>
        <label className="text-sm">Dot
          <input className="ml-2" type="checkbox" checked={asDot} onChange={(e) => setAsDot(e.target.checked)} />
        </label>
      </div>

      <div className="flex gap-3 items-center">
        <label className="text-sm">Value
          <input className="ml-2 p-1 border rounded text-sm" type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} />
        </label>
      </div>
    </div>
  );

  const snippet = (
    <CodePreview code={`<Badge ${preset !== 'none' ? (preset === 'custom' ? `color="${color}"` : `preset="${preset}"`) : ''} size="${size}" rounded={${rounded}} withEffects={${withEffects}} ${asDot ? 'asDot ' : ''}>${asDot ? '' : value}</Badge>`} />
  );

  return (
    <PreviewLayout title="Badge" preview={preview} controls={controls} snippet={snippet} />
  );
}
