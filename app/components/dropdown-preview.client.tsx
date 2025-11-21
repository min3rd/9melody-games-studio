"use client";
import React from 'react';
import { Dropdown } from '@/components/ui';

export default function DropdownPreview(): JSX.Element {
  const items = [
    { key: 'edit', label: 'Edit', onClick: () => alert('Edit clicked') },
    { key: 'duplicate', label: 'Duplicate', onClick: () => alert('Duplicate clicked') },
    { key: 'separator', label: '—', disabled: true },
    { key: 'docs', label: 'Docs', href: '/docs' },
  ];

  return (
    <div className="space-y-4">
      <Dropdown label={<span>Actions</span>} items={items} />
    </div>
  );
}
