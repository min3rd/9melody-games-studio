"use client";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export interface AuthState {
  email?: string | null;
  isAdmin?: boolean;
}

export interface AuthContextValue extends AuthState {
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

async function fetchMe(): Promise<AuthState> {
  try {
    const res = await fetch('/api/auth/me', { cache: 'no-store' });
    if (!res.ok) return { email: undefined, isAdmin: false };
    const body = await res.json();
    return { email: body?.email ?? undefined, isAdmin: body?.isAdmin ?? false };
  } catch (e) {
    return { email: undefined, isAdmin: false };
  }
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ email: undefined, isAdmin: false });
  const [loading, setLoading] = useState(true);

  const performRefresh = useCallback(async () => {
    setLoading(true);
    const me = await fetchMe();
    setState(me);
    setLoading(false);
    try { window.localStorage.setItem('auth-changed', String(Date.now())); } catch (e) {}
    // Dispatch the event so other tabs update as well
    try { window.dispatchEvent(new Event('auth-changed')); } catch (e) {}
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      // ignore
    }
    await performRefresh();
  }, [performRefresh]);

  useEffect(() => {
    let mounted = true;
    (async function init() {
      await performRefresh();
      if (!mounted) return;
      // Subscribe to storage events to handle cross-tab logins/logouts
      const onAuth = () => performRefresh();
      const onStorage = (e: StorageEvent) => { if (e.key === 'auth-changed') performRefresh(); };
      window.addEventListener('auth-changed', onAuth);
      window.addEventListener('storage', onStorage);
      return () => {
        window.removeEventListener('auth-changed', onAuth);
        window.removeEventListener('storage', onStorage);
      };
    })();
    return () => { mounted = false; };
  }, [performRefresh]);

  const value = useMemo(() => ({ ...state, loading, refresh: performRefresh, logout }), [state, loading, performRefresh, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
