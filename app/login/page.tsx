"use client";
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useI18n } from '@/hooks/useI18n';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function LoginPageClient() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params?.get('next') ?? '/admin';
  const { t } = useI18n();
  const [identifier, setIdentifier] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<any | null>(null);

  async function handleLogin() {
    setError(null);
    const res = await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: identifier, username: identifier, password }), headers: { 'content-type': 'application/json' } });
    if (res.ok) {
      router.push(next);
      return;
    }
    try {
      const body = await res.json();
      setError(body ?? { code: 'INTERNAL_ERROR' });
    } catch (e) {
      setError({ code: 'INTERNAL_ERROR' });
    }
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-6 rounded shadow bg-white dark:bg-neutral-900">
        <h1 className="text-xl font-bold mb-2">{t('admin:loginToAdmin')}</h1>
        <p className="mb-4">{t('admin:welcome')}</p>
        <div className="flex flex-col gap-2 mb-4">
          <input value={identifier} onChange={(e)=>setIdentifier(e.target.value)} placeholder="Email or username" className="input" />
          <input value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" type="password" className="input" />
        </div>
        {error ? <ErrorMessage error={error} /> : null}
        <div className="flex gap-2">
          <button className="btn" onClick={handleLogin}>{t('admin:loginToAdmin')}</button>
          <button className="btn btn-ghost" onClick={handleLogout}>{t('admin:logout')}</button>
        </div>
      </div>
    </div>
  );
}
