"use client";
import React, { useState } from 'react';
import { Indicator } from '@/components/ui';
import type { IndicatorPreset } from '@/components/ui/Indicator';

type UIIndicatorPreset = 'primary'|'success'|'danger'|'warning'|'info'|'muted'|'custom'|'none';

export default function IndicatorPreview(): React.ReactElement {
  const [preset, setPreset] = useState<UIIndicatorPreset>('primary');
  const [color, setColor] = useState('#3b82f6');
  const [rounded, setRounded] = useState(true);
  const [withEffects, setWithEffects] = useState(true);
  const [content, setContent] = useState('');

  let presetProp: IndicatorPreset | undefined;
  if (preset === 'custom' || preset === 'none') presetProp = undefined;
  else presetProp = preset as IndicatorPreset;
  const colorProp = preset === 'custom' ? color : undefined;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Indicator preset={presetProp} color={colorProp} size="sm" rounded={rounded} withEffects={withEffects}>{content || undefined}</Indicator>
        <Indicator preset={presetProp} color={colorProp} size="md" rounded={rounded} withEffects={withEffects}>{content || undefined}</Indicator>
        <Indicator preset={presetProp} color={colorProp} size="lg" rounded={rounded} withEffects={withEffects}>{content || undefined}</Indicator>
      </div>

      <div className="flex gap-4 items-center">
        <label className="text-sm">Preset
          <select className="ml-2 text-sm rounded p-1 border" value={preset} onChange={(e) => setPreset(e.target.value as UIIndicatorPreset)}>
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
      </div>

      <div className="flex gap-4 items-center">
        <label className="text-sm">Content
          <input className="ml-2 p-1 border rounded text-sm" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Optional content" />
        </label>
      </div>

      <div className="text-sm">
        <div className="font-medium mb-2">Usage</div>
        <pre className="bg-neutral-50 dark:bg-neutral-900 p-3 rounded text-xs">
{`<Indicator preset="${preset === 'custom' ? 'primary' : preset}" ${preset === 'custom' ? `color="${color}" ` : ''}${`rounded={${rounded}} withEffects={${withEffects}}`}>${content}</Indicator>`}
        </pre>
      </div>
    </div>
  );
}
