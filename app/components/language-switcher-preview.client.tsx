"use client";
import React, { useEffect, useState } from 'react';
import { LanguageSwitcher } from '@/components/ui';
import { type Preset } from '@/components/ui/presets';
// (react import already present above)
import { useI18n } from '@/hooks/useI18n';

export default function LanguageSwitcherPreview(): React.ReactElement {
  const [lang, setLang] = useState<'en' | 'vi'>(() => {
    if (typeof window === 'undefined') return 'en';
    const stored = localStorage.getItem('lang');
    return stored === 'vi' ? 'vi' : 'en';
  });

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === 'lang') setLang(e.newValue === 'vi' ? 'vi' : 'en');
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const { t } = useI18n();
  const [useCustom, setUseCustom] = useState(false);
  const [preset, setPreset] = useState<Preset>('muted');
  const [color, setColor] = useState('#06b6d4');

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label className="text-sm">Use custom color
          <input className="ml-2" type="checkbox" checked={useCustom} onChange={(e) => setUseCustom(e.target.checked)} />
        </label>
        <label className="text-sm">Preset
          <select className="ml-2 rounded p-1 border text-sm" value={preset} onChange={(e) => setPreset(e.target.value as Preset)}>
            <option value="muted">muted</option>
            <option value="primary">primary</option>
            <option value="success">success</option>
            <option value="danger">danger</option>
            <option value="warning">warning</option>
            <option value="info">info</option>
          </select>
        </label>
        {useCustom && <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />}

        <LanguageSwitcher preset={useCustom ? undefined : preset} color={useCustom ? color : undefined} />
        <div className="text-sm text-neutral-700 dark:text-neutral-300">{t('selected')} <span className="font-medium">{lang === 'en' ? 'English' : 'Tiếng Việt'}</span></div>
      </div>
      <div className="text-sm text-neutral-700 dark:text-neutral-300">
        {t('example_text')}
      </div>
    </div>
  );
}
