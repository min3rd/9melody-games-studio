"use client";
import React from 'react';
import TextInput from '@/components/ui/TextInput';
import Button from '@/components/ui/Button';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { useI18n } from '@/hooks/useI18n';
import { useRouter } from 'next/navigation';

export default function RegisterClient() {
  const { t } = useI18n();
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [name, setName] = React.useState('');
  const [password, setPassword] = React.useState('');
  type APIError = { code?: string; message?: string } | string | null;
  const [error, setError] = React.useState<APIError>(null);
  const [loading, setLoading] = React.useState(false);

  async function handleRegister() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, username, name, password }),
      });
      if (res.ok) {
        // registration success - redirect to login or home
        router.push('/login');
        return;
      }
      const body = await res.json();
      setError((body as APIError) ?? { code: '00x0011' });
    } catch (err: unknown) {
      const e = err as { message?: string } | undefined;
      setError({ code: '00x0011', message: String(e?.message ?? String(err)) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 p-6 rounded shadow">
        <h1 className="text-xl font-bold mb-2">{t('public:auth.register.title')}</h1>
        <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">{t('public:auth.register.description')}</p>
        <div className="flex flex-col gap-3 mb-4">
          <TextInput label={t('public:auth.register.email')} value={email} onValueChange={setEmail} placeholder="you@example.com" />
          <TextInput label={t('public:auth.register.username')} value={username} onValueChange={setUsername} placeholder="username" />
          <TextInput label={t('public:auth.register.name')} value={name} onValueChange={setName} placeholder="Your full name" />
          <TextInput label={t('public:auth.register.password')} value={password} onValueChange={setPassword} placeholder="Password" type="password" />
        </div>
        {error ? <ErrorMessage error={error} /> : null}
        <div className="flex items-center justify-between gap-2 mt-4">
          <Button onClick={handleRegister} disabled={loading}>
            {t('public:auth.register.submit')}
          </Button>
          <div className="text-sm text-neutral-600 dark:text-neutral-300">
            {t('public:auth.register.alreadyHave')} <a className="underline" href="/login">{t('public:auth.register.login')}</a>
          </div>
        </div>
      </div>
    </div>
  );
}
