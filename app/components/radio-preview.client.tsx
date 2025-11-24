"use client";
import React, { useState } from 'react';
import Radio from '@/components/ui/Radio';
import { useI18n } from '@/hooks/useI18n';
import { PRESET_MAP, type Preset } from '@/components/ui/presets';
import PreviewLayout from '@/components/preview/PreviewLayout';
import { CodePreview } from '@/components/ui';

export default function RadioPreview() {
  const { t } = useI18n();
  const [val, setVal] = useState<string | undefined>('option-2');
  type UIRadioPreset = 'primary'|'success'|'danger'|'warning'|'info'|'muted'|'custom'|'none';
  const [preset, setPreset] = useState<UIRadioPreset>('muted');
  const [color, setColor] = useState<string>(PRESET_MAP.muted);
  const [withEffects, setWithEffects] = useState(true);
  type SizeChoice = 'all'|'sm'|'md'|'lg';
  const [sizeChoice, setSizeChoice] = useState<SizeChoice>('all');
  const options = [
    { value: 'option-1', label: t('preview.common.small') },
    { value: 'option-2', label: t('preview.common.medium') },
    { value: 'option-3', label: t('preview.common.large') },
  ];

  let presetProp: Preset | undefined;
  if (preset === 'custom' || preset === 'none') presetProp = undefined;
  else presetProp = preset as Preset;
  const colorProp = preset === 'custom' ? color : undefined;

  const preview = (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3">
        {sizeChoice === 'all' ? (
          <>
            <Radio options={options} value={val} onValueChange={(v) => setVal(v)} preset={presetProp} color={colorProp} size="sm" withEffects={withEffects} />
            <Radio options={options} value={val} onValueChange={(v) => setVal(v)} preset={presetProp} color={colorProp} size="md" withEffects={withEffects} />
            <Radio options={options} value={val} onValueChange={(v) => setVal(v)} preset={presetProp} color={colorProp} size="lg" withEffects={withEffects} />
          </>
        ) : (
          <Radio options={options} value={val} onValueChange={(v) => setVal(v)} preset={presetProp} color={colorProp} size={sizeChoice} withEffects={withEffects} />
        )}
      </div>
      <div className="text-xs text-neutral-500 dark:text-neutral-400">{t('selected_lang').replace('{{lang}}', val ?? '-')}</div>
    </div>
  );

  const controls = (
    <div>
      <div className="flex gap-4 items-center">
        <label className="text-sm">Preset
            <select className="ml-2 text-sm rounded p-1 border" value={preset} onChange={(e) => setPreset(e.target.value as UIRadioPreset)}>
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

        <label className="text-sm">Effects
          <input className="ml-2" type="checkbox" checked={withEffects} onChange={(e) => setWithEffects(e.target.checked)} />
        </label>
        <label className="text-sm">Size
          <select className="ml-2 text-sm rounded p-1 border" value={sizeChoice} onChange={(e) => setSizeChoice(e.target.value as SizeChoice)}>
            <option value="all">All</option>
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
          </select>
        </label>
      </div>
    </div>
  );

  const snippet = (
    <CodePreview code={`<Radio ${preset !== 'none' ? (preset === 'custom' ? `color="${color}"` : `preset="${preset}"`) : ''} size="md" withEffects={${withEffects}} options={...} />`} />
  );

  return (
    <PreviewLayout title="Radio" preview={preview} controls={controls} snippet={snippet} />
  );
}
