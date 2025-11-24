"use client";
import React, { useState } from 'react';
import { useI18n } from '@/hooks/useI18n';
import Progress, { type LabelPosition } from '@/components/ui/Progress';
import { type Preset } from '@/components/ui/presets';
import type { UISize } from '@/components/ui/presets';

export default function ProgressPreview(): React.ReactElement {
  const { t } = useI18n();
  const [value, setValue] = useState(45);
  const [indeterminate, setIndeterminate] = useState(false);
  const [size, setSize] = useState<UISize>('md');
  const [preset, setPreset] = useState<Preset>('muted');
  const [useCustom, setUseCustom] = useState(false);
  const [color, setColor] = useState<string>('#06b6d4');
  const [labelPosition, setLabelPosition] = useState<LabelPosition>('inside');
  const [rounded, setRounded] = useState<'sm'|'full'|'none'>('sm');
  const [withEffects, setWithEffects] = useState(true);

  return (
    <div className="space-y-4 bg-white dark:bg-neutral-800 rounded-lg shadow text-neutral-900 dark:text-neutral-100">
      <div className="flex items-center gap-4">
        <label className="text-sm">{t('preview.progress.value')}
          <input type="range" min={0} max={100} value={value} onChange={(e) => setValue(Number(e.target.value))} className="ml-2" />
        </label>
        <label className="text-sm">{t('preview.progress.indeterminate')}
          <input className="ml-2" type="checkbox" checked={indeterminate} onChange={(e) => setIndeterminate(e.target.checked)} />
        </label>
        <label className="text-sm">{t('preview.common.size')}
          <select className="ml-2 rounded p-1 border text-sm" value={size} onChange={(e) => setSize(e.target.value as UISize)}>
            <option value="sm">{t('preview.common.small')}</option>
            <option value="md">{t('preview.common.medium')}</option>
            <option value="lg">{t('preview.common.large')}</option>
          </select>
        </label>
        <label className="text-sm">{t('preview.common.preset')}
          <select className="ml-2 rounded p-1 border text-sm" value={preset} onChange={(e) => setPreset(e.target.value as Preset)}>
            <option value="muted">{t('preset.muted')}</option>
            <option value="primary">{t('preset.primary')}</option>
            <option value="success">{t('preset.success')}</option>
            <option value="danger">{t('preset.danger')}</option>
            <option value="warning">{t('preset.warning')}</option>
            <option value="info">{t('preset.info')}</option>
          </select>
        </label>
        <label className="text-sm">{t('preview.common.customColor')}
          <input className="ml-2" type="checkbox" checked={useCustom} onChange={(e) => setUseCustom(e.target.checked)} />
        </label>
        {useCustom && <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />}
      </div>

      <div className="flex items-center gap-4">
        <label className="text-sm">{t('preview.progress.labelPosition')}
          <select className="ml-2 rounded p-1 border text-sm" value={labelPosition} onChange={(e) => setLabelPosition(e.target.value as LabelPosition)}>
            <option value="inside">{t('preview.common.inside')}</option>
            <option value="outside">{t('preview.common.outside')}</option>
            <option value="none">{t('preview.common.none')}</option>
          </select>
        </label>
        <label className="text-sm">{t('preview.progress.rounded')}
          <select className="ml-2 rounded p-1 border text-sm" value={rounded} onChange={(e) => setRounded(e.target.value as 'sm'|'full'|'none')}>
            <option value="sm">sm</option>
            <option value="full">full</option>
            <option value="none">none</option>
          </select>
        </label>
        <label className="text-sm">{t('preview.progress.withEffects')}
          <input className="ml-2" type="checkbox" checked={withEffects} onChange={(e) => setWithEffects(e.target.checked)} />
        </label>
      </div>

      <div className="p-4 bg-white dark:bg-neutral-800 rounded">
        <Progress value={value} indeterminate={indeterminate} size={size} preset={preset} color={useCustom ? color : undefined} rounded={rounded} withEffects={withEffects} labelPosition={labelPosition} />
      </div>
    </div>
  );
}
