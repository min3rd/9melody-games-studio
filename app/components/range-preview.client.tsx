"use client";
import React, { useState } from 'react';
import Range from '@/components/ui/Range';
import { useI18n } from '@/hooks/useI18n';
import { PRESET_MAP } from '@/components/ui/presets';

export default function RangePreview(): React.ReactElement {
  const { t } = useI18n();
  const [val, setVal] = useState<number>(50);
  const [preset, setPreset] = useState<'primary'|'success'|'danger'|'warning'|'info'|'muted'|'custom'|'none'>('primary');
  const [color, setColor] = useState(PRESET_MAP.primary);
  const [size, setSize] = useState<'sm'|'md'|'lg'>('md');
  const [min, setMin] = useState<number>(0);
  const [max, setMax] = useState<number>(100);
  const [step, setStep] = useState<number>(1);
  const [withEffects, setWithEffects] = useState(true);

  let presetProp: any = undefined;
  if (preset !== 'custom' && preset !== 'none') presetProp = preset;
  const colorProp = preset === 'custom' ? color : undefined;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Range value={val} onValueChange={(v) => setVal(v)} min={min} max={max} step={step} preset={presetProp} color={colorProp} size={size} withEffects={withEffects} />
          <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">{t('selected_lang').replace('{{lang}}', String(val))}</div>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <label className="text-sm">Preset
          <select className="ml-2 text-sm rounded p-1 border" value={preset} onChange={(e) => setPreset(e.target.value as any)}>
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
          <label className="text-sm">Color
            <input className="ml-2" type="color" value={color} onChange={(e) => setColor(e.target.value)} />
          </label>
        )}

        <label className="text-sm">Size
          <select className="ml-2 text-sm rounded p-1 border" value={size} onChange={(e) => setSize(e.target.value as any)}>
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
          </select>
        </label>

        <label className="text-sm">Effects
          <input className="ml-2" type="checkbox" checked={withEffects} onChange={(e) => setWithEffects(e.target.checked)} />
        </label>
      </div>

      <div className="flex gap-4 items-center">
        <label className="text-sm">Min
          <input type="number" className="ml-2 p-1 border rounded text-sm" value={min} onChange={(e) => setMin(Number(e.target.value))} />
        </label>
        <label className="text-sm">Max
          <input type="number" className="ml-2 p-1 border rounded text-sm" value={max} onChange={(e) => setMax(Number(e.target.value))} />
        </label>
        <label className="text-sm">Step
          <input type="number" className="ml-2 p-1 border rounded text-sm" value={step} onChange={(e) => setStep(Number(e.target.value))} />
        </label>
      </div>

      <div className="text-sm">
        <div className="font-medium mb-2">Usage</div>
        <pre className="bg-neutral-50 dark:bg-neutral-900 p-3 rounded text-xs">
{`<Range min={${min}} max={${max}} step={${step}} value={${val}} preset="${preset}${preset === 'custom' ? `" color="${color}` : ''}" size="${size}" withEffects={${withEffects}} />`}
        </pre>
      </div>
    </div>
  );
}
