import React from 'react';
import { validateAdminAccess } from '@/lib/adminAuth';
import UsersClient from './UsersClient';

export default async function PrivateAdminUsers() {
  await validateAdminAccess();
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">Users</h1>
      <UsersClient />
    </div>
  );
}
