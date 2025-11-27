"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import { Button, UserMenu, ThemeToggle } from '@/components/ui';
import { useAuth } from '@/components/auth/AuthProvider';

export default function ClientAuthHeader() {
  const { email, isAdmin } = useAuth();
  // compute the login link using the router pathname in a client component
  // so we avoid reading window directly or using setState in an effect.
  const pathname = usePathname() ?? '/';
  const loginHref = `/auth/login?next=${encodeURIComponent(pathname)}`;

  return (
    <div className="flex items-center gap-3">
      <ThemeToggle />
      {email ? (
        <UserMenu email={email} isAdmin={isAdmin} />
      ) : (
        <Button variant="ghost" pattern="pixel" href={loginHref}>Login</Button>
      )}
    </div>
  );
}
