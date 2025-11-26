import React from 'react';
import UsersClient from './UsersClient';

export default function PrivateAdminUsers() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">Users</h1>
      <UsersClient />
    </div>
  );
}
