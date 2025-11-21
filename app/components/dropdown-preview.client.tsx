"use client";
import React from 'react';
import { Dropdown } from '@/components/ui';
import { useI18n } from '@/hooks/useI18n';

export default function DropdownPreview(): React.ReactElement {
  const items = [
    { key: 'edit', label: 'Edit', onClick: () => alert('Edit clicked') },
    { key: 'duplicate', label: 'Duplicate', onClick: () => alert('Duplicate clicked') },
    { key: 'separator', label: '—', disabled: true },
    { key: 'docs', label: 'Docs', href: '/docs' },
  ];

  const { t } = useI18n();

  return (
    <div className="space-y-4">
      <Dropdown label={<span>{t('actions')}</span>} items={items} />
    </div>
  );
}
