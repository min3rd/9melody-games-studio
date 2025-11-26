"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import Avatar from '../Avatar';
import Dropdown from '../Dropdown';
import { useI18n } from '@/hooks/useI18n';

export default function UserMenu({ email, isAdmin }: { email?: string | null; isAdmin?: boolean; }) {
  const router = useRouter();
  const auth = useAuth();
  const { t } = useI18n();

  async function handleLogout() {
    await auth.logout();
    router.push('/');
  }

  const label = (
    <div className="inline-flex items-center gap-2">
      <Avatar name={email ?? 'User'} size="sm" indicator={false} />
    </div>
  );

  const items = [
    { key: 'account', label: t('common:account') || 'Account', href: '/account' },
    ...(isAdmin ? [{ key: 'admin', label: t('admin:dashboard') || 'Admin', href: '/private/admin' }] : []),
    { key: 'logout', label: t('admin:logout') || 'Logout', onClick: handleLogout },
  ];

  return (
    <Dropdown compact label={label} items={items} align="right" />
  );
}
