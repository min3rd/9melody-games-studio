"use client";
import React, { useState } from 'react';
import { useI18n } from '@/hooks/useI18n';
import { Toggle } from '@/components/ui';
import type { Preset } from '@/components/ui/presets';
import { CodePreview } from '@/components/ui';

export default function TogglePreview() {
  const [checked, setChecked] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [color, setColor] = useState('#3b82f6');
  type UITogglePreset = Preset | 'custom' | 'none';
  const [preset, setPreset] = useState<UITogglePreset>('primary');
  const { t } = useI18n();
  const title = t('preview.toggle.title');
  const description = t('preview.toggle.description');
  const hint = t('preview.toggle.hint');

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <button className="px-3 py-2 rounded bg-foreground text-background" onClick={() => setChecked((c) => !c)}>
          {t('preview.toggle.toggleControlled')}
        </button>
        <label className="text-sm"><input type="checkbox" checked={disabled} onChange={(e) => setDisabled(e.target.checked)} /> {t('preview.toggle.disabled')}</label>
        <label className="text-sm ml-2">{t('preview.toggle.preset')}
          <select className="ml-2 text-sm rounded p-1 border" value={preset} onChange={(e) => setPreset(e.target.value as UITogglePreset)}>
            <option value="primary">{t('preset.primary')}</option>
            <option value="success">{t('preset.success')}</option>
            <option value="danger">{t('preset.danger')}</option>
            <option value="warning">{t('preset.warning')}</option>
            <option value="info">{t('preset.info')}</option>
            <option value="muted">{t('preset.muted')}</option>
            <option value="custom">{t('preview.common.custom')}</option>
            <option value="none">{t('preview.common.none')}</option>
          </select>
        </label>
        {preset === 'custom' && (
          <label className="text-sm ml-2">Custom
            <input type="color" className="ml-2" value={color} onChange={(e) => setColor(e.target.value)} />
          </label>
        )}
      </div>

      <Toggle
        checked={checked}
        onCheckedChange={(c) => setChecked(c)}
        disabled={disabled}
        title={title}
        description={description}
        hint={hint}
        {...(preset === 'custom' ? { color } : {})}
        {...(preset !== 'custom' && preset !== 'none' ? { preset } : {})}
      />

      <CodePreview code={`<Toggle
  checked={${checked}}
  onCheckedChange={(c) => setChecked(c)}
  disabled={${disabled}}
  title={\"${title}\"}
  description={\"${description}\"}
  hint={\"${hint}\"}
  ${preset === 'custom' ? `color={"${color}"}` : (preset !== 'none' ? `preset={"${preset}"}` : '')}
/>`} />
    </div>
  );
}
