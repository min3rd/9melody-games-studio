"use client";
import React, { useState, useEffect } from 'react';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { useI18n } from '@/hooks/useI18n';

type User = { id: number; email: string; name?: string; username?: string; role?: string; createdAt: string };

export default function UsersClient() {
  const { t } = useI18n();
  const [users, setUsers] = useState<User[]>([]);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<any>(null);

  async function loadUsers() {
    setError(null);
    const res = await fetch('/api/users');
    if (res.ok) setUsers(await res.json());
    else {
      const body = await res.json().catch(() => null);
      setError(body ?? 'Failed to load users');
    }
  }

  useEffect(() => { loadUsers(); }, []);

  async function addUser() {
    setError(null);
    const res = await fetch('/api/users', { method: 'POST', body: JSON.stringify({ email, username, password }), headers: { 'content-type': 'application/json' } });
    if (res.ok) {
      setEmail(''); setUsername(''); setPassword('');
      loadUsers();
    } else {
      const body = await res.json().catch(() => null);
      setError(body ?? 'Failed to add user');
    }
  }

  async function deleteUser(id: number) {
    setError(null);
    const res = await fetch(`/api/users?id=${id}`, { method: 'DELETE' });
    if (res.ok) loadUsers();
    else {
      const body = await res.json().catch(() => null);
      setError(body ?? 'Failed to delete');
    }
  }

  return (
    <div>
      <div className="mb-4 grid grid-cols-1 sm:grid-cols-4 gap-2">
        <input className="input" value={email} placeholder="email" onChange={(e) => setEmail(e.target.value)} />
        <input className="input" value={username} placeholder="username" onChange={(e) => setUsername(e.target.value)} />
        <input className="input" value={password} placeholder="password" onChange={(e) => setPassword(e.target.value)} />
        <button className="btn" onClick={addUser}>{t('actions')}</button>
      </div>
      <ErrorMessage error={error} />
      <div className="space-y-3">
        {users.map(u => (
          <div key={u.id} className="p-3 bg-white dark:bg-neutral-800 rounded border flex items-center justify-between">
            <div>
              <div className="font-medium">{u.name ?? u.email}</div>
              <div className="text-sm text-neutral-500">{u.email} {u.username ? `(${u.username})` : ''}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => deleteUser(u.id)} className="btn btn-ghost">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
