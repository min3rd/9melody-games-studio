"use client";
import React from 'react';
import TextInput from '@/components/ui/TextInput';
import Button from '@/components/ui/Button';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { useI18n } from '@/hooks/useI18n';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';

export default function LoginClient() {
  const { t } = useI18n();
  const router = useRouter();
  const params = useSearchParams();
  const next = params?.get('next') ?? '/';

  const auth = useAuth();
  const [identifier, setIdentifier] = React.useState('');
  const [password, setPassword] = React.useState('');
  type APIError = { code?: string; message?: string } | string | null;
  const [error, setError] = React.useState<APIError>(null);
  const [loading, setLoading] = React.useState(false);

  async function handleLogin() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: identifier, username: identifier, password }), headers: { 'content-type': 'application/json' } });
      if (res.ok) {
        // refresh auth provider state so UI updates immediately
        try { await auth.refresh(); } catch (e) {}
        router.push(next);
        return;
      }
      const body = await res.json();
      setError(body ?? { code: '00x0011' });
    } catch {
      setError({ code: '00x0011' });
    } finally {
      setLoading(false);
    }
  }

  const identId = 'login-identifier';
  const passId = 'login-password';

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 p-6 rounded shadow">
        <h1 className="text-xl font-bold mb-2">{t('public:auth.login.title')}</h1>
        <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">{t('public:auth.login.description')}</p>
        <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-x-4 gap-y-3 items-center mb-4">
          <label htmlFor={identId} className="text-sm font-medium mb-0 block">{t('public:auth.login.identifier')}</label>
          <TextInput id={identId} value={identifier} onValueChange={setIdentifier} placeholder={String(t('public:auth.login.identifierPlaceholder'))} variant="outline" />

          <label htmlFor={passId} className="text-sm font-medium mb-0 block">{t('public:auth.login.password')}</label>
          <TextInput id={passId} value={password} onValueChange={setPassword} placeholder="Password" type="password" variant="outline" />
        </div>

        {error ? <ErrorMessage error={error} /> : null}

        <div className="flex items-center justify-between gap-2 mt-4">
          <Button onClick={handleLogin} disabled={loading} pattern="pixel">{t('public:auth.login.submit')}</Button>
          <div className="text-sm text-neutral-600 dark:text-neutral-300">
            {t('public:auth.login.noAccount')} <a className="underline" href="/public/auth/register">{t('public:auth.login.register')}</a>
          </div>
        </div>
      </div>
    </div>
  );
}
