import React from 'react';
import { cookies } from 'next/headers';
import { setServerLanguage } from '@/lib/i18n';
// `globals.css` is imported by the root layout (app/layout.tsx). Avoid importing
// it here to prevent duplicate side-effect imports during server compilation.
import { ThemeToggle, UserMenu, Button } from '@/components/ui';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const cookieLang = cookieStore.get('lang')?.value;
  const htmlLang = cookieLang === 'vi' ? 'vi' : 'en';
  setServerLanguage(htmlLang);

  return (
    <html lang={htmlLang}>
      <body className="antialiased">
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
          <ThemeToggle />
          {cookieStore.get('userEmail')?.value ? (
            <UserMenu email={cookieStore.get('userEmail')?.value} isAdmin={cookieStore.get('isAdmin')?.value === 'true'} />
          ) : (
            <Button
              variant="ghost"
              pattern="pixel"
              onClick={() => {
                // Client-side navigation to login page
                window.location.href = '/public/auth/login';
              }}
            >
              Login
            </Button>
          )}
        </div>
        {/* ClientInit is mounted in root layout */}
        {children}
      </body>
    </html>
  );
}
