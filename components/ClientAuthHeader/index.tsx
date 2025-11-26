"use client";
import React, { useEffect, useState } from 'react';
import { Button, UserMenu, ThemeToggle } from '@/components/ui';

function getCookie(name: string) {
  const cookies = document.cookie.split(';').map(c => c.trim());
  for (const c of cookies) {
    if (c.startsWith(`${name}=`)) return decodeURIComponent(c.split('=')[1]);
  }
  return undefined;
}

export default function ClientAuthHeader() {
  const [userEmail, setUserEmail] = useState<string | undefined>(undefined);
  const [isAdmin, setIsAdmin] = useState(false);

  const update = async () => {
    try {
      const res = await fetch('/api/auth/me', { cache: 'no-store' });
      if (!res.ok) {
        setUserEmail(undefined);
        setIsAdmin(false);
        return;
      }
      const body = await res.json();
      setUserEmail(body?.email ?? undefined);
      setIsAdmin(body?.isAdmin ?? false);
    } catch (err) {
      setUserEmail(undefined);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    update();
    // listen for custom events and storage events
    const onAuth = () => update();
    window.addEventListener('auth-changed', onAuth);
    function onStorage(e: StorageEvent) {
      if (e.key === 'auth-changed') onAuth();
    }
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('auth-changed', onAuth);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  return (
    <div className="flex items-center gap-3">
      <ThemeToggle />
      {userEmail ? (
        <UserMenu email={userEmail} isAdmin={isAdmin} />
      ) : (
        <Button variant="ghost" pattern="pixel" href="/public/auth/login">Login</Button>
      )}
    </div>
  );
}
