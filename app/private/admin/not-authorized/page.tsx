import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';

export default function PrivateAdminNotAuthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-6 rounded shadow bg-white dark:bg-neutral-900">
        <h1 className="text-xl font-bold mb-2">Not authorized</h1>
        <p className="mb-4">You do not have permission to view this page.</p>
        <div className="flex gap-2">
          <Link href="/" className="btn">Home</Link>
          <Button variant="ghost" pattern="pixel" href="/public/auth/login">
            Log in
          </Button>
        </div>
      </div>
    </div>
  );
}
