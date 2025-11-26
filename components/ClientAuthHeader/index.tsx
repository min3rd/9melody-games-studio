"use client";
import React from 'react';
import { Button, UserMenu, ThemeToggle } from '@/components/ui';
import { useAuth } from '@/components/auth/AuthProvider';

export default function ClientAuthHeader() {
  const { email, isAdmin } = useAuth();

  return (
    <div className="flex items-center gap-3">
      <ThemeToggle />
      {email ? (
        <UserMenu email={email} isAdmin={isAdmin} />
      ) : (
        <Button variant="ghost" pattern="pixel" href="/auth/login">Login</Button>
      )}
    </div>
  );
}
