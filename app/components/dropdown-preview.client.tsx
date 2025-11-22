"use client";
import React, { useState } from 'react';
import { Dropdown } from '@/components/ui';
import { type Preset } from '@/components/ui/presets';
import { useI18n } from '@/hooks/useI18n';

export default function DropdownPreview(): React.ReactElement {
  const items = [
    { key: 'edit', label: 'Edit', onClick: () => alert('Edit clicked') },
    { key: 'duplicate', label: 'Duplicate', onClick: () => alert('Duplicate clicked') },
    { key: 'separator', label: '—', disabled: true },
    { key: 'docs', label: 'Docs', href: '/docs' },
  ];

  const { t } = useI18n();
  const [useCustom, setUseCustom] = useState(false);
  const [preset, setPreset] = useState<Preset | null>('muted');
  const [color, setColor] = useState('#3b82f6');

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label className="text-sm">Use custom color
          <input className="ml-2" type="checkbox" checked={useCustom} onChange={(e) => setUseCustom(e.target.checked)} />
        </label>
        <label className="text-sm">Preset
          <select className="ml-2 rounded p-1 border text-sm" value={preset ?? 'muted'} onChange={(e) => setPreset(e.target.value as Preset)}>
            <option value="muted">muted</option>
            <option value="primary">primary</option>
            <option value="success">success</option>
            <option value="danger">danger</option>
            <option value="warning">warning</option>
            <option value="info">info</option>
          </select>
        </label>
        {useCustom && <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />}
      </div>

      <Dropdown label={<span>{t('actions')}</span>} items={items} preset={useCustom ? undefined : (preset ?? 'muted')} color={useCustom ? color : undefined} />
    </div>
  );
}
