import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { cookies } from 'next/headers';

export default async function PrivateAdminNotAuthorized() {
  // Check if user is logged in at all
  const cookieStore = await cookies();
  const userEmail = cookieStore.get("userEmail")?.value;
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-6 rounded shadow bg-white dark:bg-neutral-900 max-w-md">
        <h1 className="text-xl font-bold mb-2">Not authorized</h1>
        <p className="mb-4">
          {userEmail 
            ? "You do not have admin permission to view this page."
            : "You need to log in to access the admin area."}
        </p>
        <div className="flex gap-2">
          <Link href="/" className="btn">Home</Link>
          {!userEmail && (
            <Button preset="primary" href="/auth/login?next=/private/admin">
              Log in
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
