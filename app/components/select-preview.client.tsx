"use client";
import React, { useState } from 'react';
import { Select, CodePreview } from '@/components/ui';
import PreviewLayout from '@/components/preview/PreviewLayout';
import type { Preset } from '@/components/ui/presets';
import { useI18n } from '@/hooks/useI18n';

export default function SelectPreview(): React.ReactElement {
  const { t } = useI18n();
  const [value, setValue] = useState<string | undefined>('option-2');
  const [preset, setPreset] = useState<Preset>('primary');
  const [color, setColor] = useState('#3b82f6');
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [withEffects, setWithEffects] = useState(true);
  const [rounded, setRounded] = useState<'sm' | 'none' | 'full'>('sm');
  const [variant, setVariant] = useState<'solid' | 'ghost' | 'outline' | 'none'>('solid');

  const options = [
    { value: 'option-1', label: 'Option 1' },
    { value: 'option-2', label: 'Option 2' },
    { value: 'option-3', label: 'Option 3' },
  ];

  const preview = (
    <div className="flex items-center gap-3">
      <Select
        title={t('preview.common.preset')}
        options={options}
        value={value}
        onValueChange={(v) => setValue(v)}
        preset={preset}
        color={color}
        size={size}
        withEffects={withEffects}
        rounded={rounded}
        variant={variant}
      />

      <Select options={options} placeholder={t('selected')} variant={variant} />
    </div>
  );

  const controls = (
    <div className="flex gap-2 items-center mt-2">
      <label className="text-sm">Preset
        <select className="ml-2 text-sm rounded p-1 border" value={preset} onChange={(e) => setPreset(e.target.value as Preset)}>
          <option value="primary">Primary</option>
          <option value="success">Success</option>
          <option value="danger">Danger</option>
          <option value="warning">Warning</option>
          <option value="info">Info</option>
          <option value="muted">Muted</option>
        </select>
      </label>
      <label className="text-sm">Size
        <select className="ml-2 text-sm rounded p-1 border" value={size} onChange={(e) => setSize(e.target.value as 'sm' | 'md' | 'lg')}>
          <option value="sm">Small</option>
          <option value="md">Medium</option>
          <option value="lg">Large</option>
        </select>
      </label>
      <label className="text-sm">Effects
        <input className="ml-2" type="checkbox" checked={withEffects} onChange={(e) => setWithEffects(e.target.checked)} />
      </label>
      <label className="text-sm">Rounded
        <select className="ml-2 text-sm rounded p-1 border" value={rounded} onChange={(e) => setRounded(e.target.value as 'sm' | 'none' | 'full')}>
          <option value="sm">Sm</option>
          <option value="none">None</option>
          <option value="full">Full</option>
        </select>
      </label>
      <label className="text-sm">Variant
        <select className="ml-2 text-sm rounded p-1 border" value={variant} onChange={(e) => setVariant(e.target.value as 'solid'|'ghost'|'outline'|'none')}>
          <option value="solid">Solid</option>
          <option value="ghost">Ghost</option>
          <option value="outline">Outline</option>
          <option value="none">None</option>
        </select>
      </label>
    </div>
  );

  const snippet = (
    <CodePreview code={`<Select ${preset ? `preset="${preset}" ` : ''} ${size ? `size="${size}" ` : ''}${withEffects ? `withEffects ` : ''} rounded={${rounded === 'sm' ? 'true' : rounded === 'none' ? 'none' : '"full"'}} variant="${variant}" />`} />
  );

  return (
    <PreviewLayout title={t('select')} preview={preview} controls={controls} snippet={snippet} />
  );
}
