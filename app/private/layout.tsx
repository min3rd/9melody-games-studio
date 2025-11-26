import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { setServerLanguage } from '@/lib/i18n';
import { ThemeToggle, UserMenu, Button } from '@/components/ui';

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
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
          <ThemeToggle />
          {userEmail ? (
            <UserMenu email={userEmail} isAdmin={cookieStore.get('isAdmin')?.value === 'true'} />
          ) : (
            <Button variant="ghost" pattern="pixel" onClick={() => { window.location.href = '/public/auth/login'; }}>
              Login
            </Button>
          )}
        </div>
        {/* ClientInit is mounted in root layout */}
        <div className="p-4">
          <main className="mt-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
