import React from 'react';
import { cookies } from 'next/headers';
import { setServerLanguage } from '@/lib/i18n';
// `globals.css` is imported by the root layout (app/layout.tsx). Avoid importing
// it here to prevent duplicate side-effect imports during server compilation.
import ClientAuthHeader from '@/components/ClientAuthHeader';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const cookieLang = cookieStore.get('lang')?.value;
  const htmlLang = cookieLang === 'vi' ? 'vi' : 'en';
  setServerLanguage(htmlLang);

  return (
    <html lang={htmlLang}>
      <body className="antialiased">
        <div className="fixed top-4 right-4 z-50">
          <ClientAuthHeader />
        </div>
        {/* ClientInit is mounted in root layout */}
        {children}
      </body>
    </html>
  );
}
