"use client";
import React, { useState } from 'react';
import { Button, CodePreview } from '@/components/ui';
import PreviewLayout from '@/components/preview/PreviewLayout';
import type { Preset } from '@/components/ui/presets';
import { useI18n } from '@/hooks/useI18n';

export default function ButtonPreview(): React.ReactElement {
  const [count, setCount] = useState(0);
  type UIButtonPreset = Preset | 'custom' | 'none';
  const [preset, setPreset] = useState<UIButtonPreset>('primary');
  const [color, setColor] = useState<string>('#3b82f6');
  const [withEffects, setWithEffects] = useState(true);
  const [rounded, setRounded] = useState(false);
  const [pattern, setPattern] = useState<'none' | 'pixel'>('none');
  const [waveDirection, setWaveDirection] = useState<'ltr'|'rtl'|'ttb'|'btt'|'diag'>('ltr');
  const { t } = useI18n();

  return (
    <PreviewLayout
      title="Button"
      preview={(
        <div className="flex flex-wrap items-center gap-3">
      <Button
        onClick={() => setCount((c) => c + 1)}
        preset={preset !== 'none' && preset !== 'custom' ? (preset as Preset) : undefined}
        color={preset === 'custom' ? color : undefined}
        withEffects={withEffects}
        rounded={rounded}
        pattern={pattern === 'pixel' ? 'pixel' : undefined}
      >Primary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
        <Button size="sm">Small</Button>
        <Button size="lg">Large</Button>
        </div>
      )}
      controls={(
        <div className="space-y-3">

      <div className="flex gap-2 items-center mt-2">
        <label className="text-sm">Preset
          <select className="ml-2 text-sm rounded p-1 border" value={preset} onChange={(e) => setPreset(e.target.value as UIButtonPreset)}>
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

      <div className="flex gap-2 items-center mt-2">
        <label className="text-sm">Effects
          <input className="ml-2" type="checkbox" checked={withEffects} onChange={(e) => setWithEffects(e.target.checked)} />
        </label>
        <label className="text-sm">Rounded
          <input className="ml-2" type="checkbox" checked={rounded} onChange={(e) => setRounded(e.target.checked)} />
        </label>
        <label className="text-sm">Pattern
          <select className="ml-2 text-sm rounded p-1 border" value={pattern} onChange={(e) => setPattern(e.target.value as 'none' | 'pixel')}>
            <option value="none">None</option>
            <option value="pixel">Pixel</option>
          </select>
        </label>
      </div>

        </div>
      )}
      snippet={(
        <CodePreview code={`<Button ${preset !== 'none' ? (preset === 'custom' ? `color="${color}"` : `preset="${preset}"`) : ''} withEffects={${withEffects}} rounded={${rounded}} ${pattern !== 'none' ? `pattern="${pattern}"` : ''}>Primary</Button>`} />
      )}
    />
  );
}
