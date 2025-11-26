import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { setServerLanguage } from '@/lib/i18n';
import ClientAuthHeader from '@/components/ClientAuthHeader';

export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const cookieLang = cookieStore.get('lang')?.value;
  const htmlLang = cookieLang === 'vi' ? 'vi' : 'en';
  setServerLanguage(htmlLang);

  const userEmail = cookieStore.get('userEmail')?.value;
  if (!userEmail) {
    // Not logged in - redirect to public login
    redirect('/public/auth/login');
  }

  return (
    <html lang={htmlLang}>
      <body className="antialiased min-h-screen bg-neutral-50 dark:bg-neutral-900">
        <div className="fixed top-4 right-4 z-50">
          <ClientAuthHeader />
        </div>
        {/* ClientInit is mounted in root layout */}
        <div className="p-4">
          <main className="mt-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
