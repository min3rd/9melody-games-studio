"use client";
import React, { useState } from 'react';
import { useI18n } from '@/hooks/useI18n';
import Checkbox from '@/components/ui/Checkbox';
import { type Preset } from '@/components/ui/presets';

export default function CheckboxPreview(): React.ReactElement {
  const [checked, setChecked] = useState(false);
  const [preset, setPreset] = useState<Preset>('primary');
  const [useCustom, setUseCustom] = useState(false);
  const [color, setColor] = useState('#06b6d4');
  const [size, setSize] = useState<'sm'|'md'|'lg'>('md');
  const [disabled, setDisabled] = useState(false);

  const { t } = useI18n();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 flex-wrap">
        <label className="text-sm">{t('preview.checkbox.checked')}
          <input className="ml-2" type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} />
        </label>
        <label className="text-sm">{t('preview.checkbox.disabled')}
          <input className="ml-2" type="checkbox" checked={disabled} onChange={(e) => setDisabled(e.target.checked)} />
        </label>
        <label className="text-sm">{t('preview.common.size')}
          <select className="ml-2 rounded p-1 border text-sm" value={size} onChange={(e) => setSize(e.target.value as 'sm'|'md'|'lg')}>
            <option value="sm">{t('preview.common.small')}</option>
            <option value="md">{t('preview.common.medium')}</option>
            <option value="lg">{t('preview.common.large')}</option>
          </select>
        </label>
        <label className="text-sm">{t('preview.common.preset')}
          <select className="ml-2 rounded p-1 border text-sm" value={preset} onChange={(e) => setPreset(e.target.value as Preset)}>
            <option value="primary">{t('preset.primary')}</option>
            <option value="muted">{t('preset.muted')}</option>
            <option value="success">{t('preset.success')}</option>
            <option value="danger">{t('preset.danger')}</option>
            <option value="warning">{t('preset.warning')}</option>
            <option value="info">{t('preset.info')}</option>
          </select>
        </label>
        <label className="text-sm">{t('preview.common.customColor')}
          <input className="ml-2" type="checkbox" checked={useCustom} onChange={(e) => setUseCustom(e.target.checked)} />
        </label>
        {useCustom && <input className="ml-2" type="color" value={color} onChange={(e) => setColor(e.target.value)} />}
      </div>

      <div className="p-4 bg-white border rounded">
        <Checkbox
          checked={checked}
          onCheckedChange={setChecked}
          title={<span>{t('preview.checkbox.title')}</span>}
          description={t('preview.checkbox.description')}
          hint={t('preview.checkbox.hint')}
          size={size}
          disabled={disabled}
          preset={preset}
          color={useCustom ? color : undefined}
        />
      </div>
    </div>
  );
}
