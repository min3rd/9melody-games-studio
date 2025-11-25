"use client";
import React, { useState } from 'react';
import TextArea from '@/components/ui/TextArea';
import PreviewLayout from '@/components/preview/PreviewLayout';
import { CodePreview } from '@/components/ui';
import { type Preset } from '@/components/ui/presets';
import type { UISize } from '@/components/ui/presets';
import { useI18n } from '@/hooks/useI18n';

export default function TextAreaPreview(): React.ReactElement {
  const { t } = useI18n();
  const [value, setValue] = useState('');
  const [size, setSize] = useState<UISize>('md');
  const [preset, setPreset] = useState<Preset>('muted');
  const [useCustom, setUseCustom] = useState(false);
  const [color, setColor] = useState('#3b82f6');
  const [variant, setVariant] = useState<'solid'|'ghost'|'outline'|'none'>('solid');
  const [pattern, setPattern] = useState<'pixel' | 'neon' | 'bubble' | 'pixel3d' | 'none' | 'undefined'>('pixel3d');
  const [label, setLabel] = useState('Label');
  const [hint, setHint] = useState('This is a hint');

  const preview = (
    <div className="p-4 bg-white dark:bg-neutral-800 rounded">
      <div className="space-y-2">
        <TextArea
          label={label}
          placeholder={t('preview.common.placeholder') ?? 'Type here...'}
          size={size}
          preset={preset}
          color={useCustom ? color : undefined}
          variant={variant}
          pattern={pattern === 'none' ? undefined : (pattern as any)}
          value={value}
          onValueChange={setValue}
          hint={hint}
          rows={5}
        />
      </div>
    </div>
  );

  const snippetCode = `import { TextArea } from '@/components/ui';\n\n<TextArea label=\"${label}\" placeholder=\"${t('preview.common.placeholder') ?? 'Type here...'}\" size=\"${size}\" ${useCustom ? `color=\"${color}\"` : ''} preset=\"${preset}\" variant=\"${variant}\" ${pattern === 'none' ? '' : `pattern=\"${pattern}\"`} />`;
  const snippet = <CodePreview language="tsx" code={snippetCode} />;

  const controls = (
    <div className="flex flex-wrap items-center gap-3">
      <label className="text-sm">{t('preview.common.size')}
        <select className="ml-2 rounded p-1 border text-sm" value={size} onChange={(e) => setSize(e.target.value as UISize)}>
          <option value="sm">Small</option>
          <option value="md">Medium</option>
          <option value="lg">Large</option>
        </select>
      </label>
      <label className="text-sm">{t('preview.common.variant') ?? 'Variant'}
        <select className="ml-2 rounded p-1 border text-sm" value={variant} onChange={(e) => setVariant(e.target.value as any)}>
          <option value="solid">Solid</option>
          <option value="ghost">Ghost</option>
          <option value="outline">Outline</option>
          <option value="none">None</option>
        </select>
      </label>
      <label className="text-sm">{t('preview.common.preset')}
        <select className="ml-2 rounded p-1 border text-sm" value={preset} onChange={(e) => setPreset(e.target.value as Preset)}>
          <option value="muted">muted</option>
          <option value="primary">primary</option>
          <option value="success">success</option>
          <option value="danger">danger</option>
          <option value="warning">warning</option>
          <option value="info">info</option>
        </select>
      </label>
      <label className="text-sm">{t('preview.common.customColor')}
        <input className="ml-2" type="checkbox" checked={useCustom} onChange={(e) => setUseCustom(e.target.checked)} />
      </label>
      {useCustom && <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />}
      <label className="text-sm">Label
        <input className="ml-2 rounded p-1 border text-sm" value={label} onChange={(e) => setLabel(e.target.value)} />
      </label>
      <label className="text-sm">Hint
        <input className="ml-2 rounded p-1 border text-sm" value={hint} onChange={(e) => setHint(e.target.value)} />
      </label>
      <label className="text-sm">Rows
        <input className="ml-2 rounded p-1 border text-sm w-16" type="number" value={5} readOnly />
      </label>
      <label className="text-sm">{t('preview.common.pattern') ?? 'Pattern'}
        <select className="ml-2 rounded p-1 border text-sm" value={pattern} onChange={(e) => setPattern(e.target.value as any)}>
          <option value="none">None</option>
          <option value="pixel">Pixel</option>
          <option value="neon">Neon (pixels)</option>
          <option value="bubble">Bubble</option>
          <option value="pixel3d">Pixel 3D</option>
        </select>
      </label>
    </div>
  );

  return (
    <PreviewLayout title={t('preview.common.textarea') ?? 'TextArea'} preview={preview} snippet={snippet} controls={controls} />
  );
}
