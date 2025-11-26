"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import Avatar from '../Avatar';
import Dropdown from '../Dropdown';
import { useI18n } from '@/hooks/useI18n';

export default function UserMenu({ email, isAdmin }: { email?: string | null; isAdmin?: boolean; }) {
  const router = useRouter();
  const { t } = useI18n();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    try { window.localStorage.setItem('auth-changed', String(Date.now())); } catch {}
    try { window.dispatchEvent(new Event('auth-changed')); } catch {}
    router.push('/');
  }

  const label = (
    <div className="inline-flex items-center gap-2">
      <Avatar name={email ?? 'User'} size="md" indicator={false} />
    </div>
  );

  const items = [
    { key: 'account', label: t('common:account') || 'Account', href: '/account' },
    ...(isAdmin ? [{ key: 'admin', label: t('admin:dashboard') || 'Admin', href: '/private/admin' }] : []),
    { key: 'logout', label: t('admin:logout') || 'Logout', onClick: handleLogout },
  ];

  return (
    <Dropdown label={label} items={items} align="right" />
  );
}
