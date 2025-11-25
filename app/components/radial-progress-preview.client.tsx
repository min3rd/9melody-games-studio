"use client";
import React, { useState } from 'react';
import { useI18n } from '@/hooks/useI18n';
import RadialProgress from '@/components/ui/RadialProgress';
import PreviewLayout from '@/components/preview/PreviewLayout';
import { CodePreview } from '@/components/ui';
import { type Preset } from '@/components/ui/presets';
import type { UISize } from '@/components/ui/presets';

export default function RadialProgressPreview(): React.ReactElement {
  const { t } = useI18n();
  const [value, setValue] = useState(65);
  const [indeterminate, setIndeterminate] = useState(false);
  const [size, setSize] = useState<UISize>('md');
  const [preset, setPreset] = useState<Preset>('muted');
  const [useCustom, setUseCustom] = useState(false);
  const [color, setColor] = useState<string>('#06b6d4');
  const preview = (
    <div className="p-4 bg-white dark:bg-neutral-800 rounded">
      <div className="flex items-center gap-4 flex-wrap">
        <label className="text-sm">{t('preview.progress.value')}
          <input type="range" min={0} max={100} value={value} onChange={(e) => setValue(Number(e.target.value))} className="ml-2" />
        </label>
        <label className="text-sm">{t('preview.progress.indeterminate')}
          <input className="ml-2" type="checkbox" checked={indeterminate} onChange={(e) => setIndeterminate(e.target.checked)} />
        </label>
        <label className="text-sm">{t('preview.common.size')}
          <select className="ml-2 rounded p-1 border text-sm" value={size} onChange={(e) => setSize(e.target.value as UISize)}>
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
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
      </div>

      <div className="p-4 bg-white dark:bg-neutral-800 rounded flex items-center gap-6">
        <RadialProgress value={value} indeterminate={indeterminate} size={size} preset={preset} color={useCustom ? color : undefined} />
        <div className="flex gap-6 items-center">
          <div className="flex flex-col items-center">
            <RadialProgress value={25} size="sm" preset="primary" />
            <div className="text-xs text-neutral-600">25% (sm)</div>
          </div>
          <div className="flex flex-col items-center">
            <RadialProgress value={50} size="md" preset="success" />
            <div className="text-xs text-neutral-600">50% (md)</div>
          </div>
          <div className="flex flex-col items-center">
            <RadialProgress value={85} size="lg" preset="info" />
            <div className="text-xs text-neutral-600">85% (lg)</div>
          </div>
        </div>
      </div>
    </div>
  );
  const snippetCode = `import { RadialProgress } from '@/components/ui';\n\n<RadialProgress value={${value}} size="${size}" preset="${preset}"${useCustom ? ` color="${color}"` : ''} indeterminate={${indeterminate}} />`;

  const snippet = (
    <CodePreview language="tsx" code={snippetCode} />
  );

  const controls = (
    <div className="flex items-center gap-3 flex-wrap">
      <label className="text-sm">{t('preview.progress.value')}
        <input type="range" min={0} max={100} value={value} onChange={(e) => setValue(Number(e.target.value))} className="ml-2" />
      </label>
      <label className="text-sm">{t('preview.progress.indeterminate')}
        <input className="ml-2" type="checkbox" checked={indeterminate} onChange={(e) => setIndeterminate(e.target.checked)} />
      </label>
      <label className="text-sm">{t('preview.common.size')}
        <select className="ml-2 rounded p-1 border text-sm" value={size} onChange={(e) => setSize(e.target.value as UISize)}>
          <option value="sm">Small</option>
          <option value="md">Medium</option>
          <option value="lg">Large</option>
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
    </div>
  );

  return (
    <PreviewLayout
      title="Radial Progress"
      preview={preview}
      controls={controls}
      snippet={snippet}
    />
  );
}
