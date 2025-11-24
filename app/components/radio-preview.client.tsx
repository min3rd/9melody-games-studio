"use client";
import React, { useState } from 'react';
import Radio from '@/components/ui/Radio';
import { useI18n } from '@/hooks/useI18n';

export default function RadioPreview() {
  const { t } = useI18n();
  const [val, setVal] = useState<string | undefined>('option-2');
  const options = [
    { value: 'option-1', label: t('preview.common.small') },
    { value: 'option-2', label: t('preview.common.medium') },
    { value: 'option-3', label: t('preview.common.large') },
  ];
  return (
    <div className="space-y-2">
      <Radio options={options} value={val} onValueChange={(v) => setVal(v)} preset="muted" />
      <div className="text-xs text-neutral-500 dark:text-neutral-400">{t('selected_lang').replace('{{lang}}', val ?? '-')}</div>
    </div>
  );
}
