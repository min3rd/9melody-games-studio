import React from 'react';
import { validateAdminAccess } from '@/lib/adminAuth';

export default async function PrivateAdminIndex() {
  await validateAdminAccess();
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">Admin Overview</h1>
      <p className="mb-4">Welcome to the admin area. Please use the left navigation to manage the admin features.</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded bg-white dark:bg-neutral-800 border">Users Overview</div>
        <div className="p-4 rounded bg-white dark:bg-neutral-800 border">Settings</div>
        <div className="p-4 rounded bg-white dark:bg-neutral-800 border">Reports</div>
      </div>
    </div>
  );
}
