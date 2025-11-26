import React from 'react';
import { Metadata } from 'next';
import { Button } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Public Home',
  description: 'Welcome to the public home page',
};

export default function PublicHomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white dark:bg-neutral-900 p-8 rounded shadow text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to 9melody Games</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          This is the public home page. Sign in to access your dashboard or browse available components and demos.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button variant="primary" pattern="pixel" href="/auth/login">Login</Button>
          <Button variant="ghost" pattern="pixel" href="/auth/register">Register</Button>
          <Button variant="ghost" pattern="pixel" href="/components">Explore Components</Button>
        </div>
      </div>
    </div>
  );
}
