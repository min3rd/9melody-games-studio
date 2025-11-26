import React from 'react';
import { cookies } from 'next/headers';
import { setServerLanguage } from '@/lib/i18n';
import Link from 'next/link';

export default async function PrivateAdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const cookieLang = cookieStore.get('lang')?.value;
  const htmlLang = cookieLang === 'vi' ? 'vi' : 'en';
  setServerLanguage(htmlLang);

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900">
      <div className="flex h-screen">
        <aside className="w-64 p-4 bg-white dark:bg-neutral-800 border-r dark:border-neutral-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold">Admin</h2>
          </div>
          <nav className="space-y-2">
            <Link href="/private/admin" className="block px-3 py-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700">Overview</Link>
            <Link href="/private/admin/users" className="block px-3 py-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700">Users</Link>
            <Link href="/private/admin/settings" className="block px-3 py-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700">Settings</Link>
          </nav>
        </aside>
        <main className="flex-1 p-6 overflow-auto">
          <section className="space-y-4">{children}</section>
        </main>
      </div>
    </div>
  );
}
