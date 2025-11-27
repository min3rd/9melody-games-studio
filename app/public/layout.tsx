import React from 'react';
import ClientAuthHeader from '@/components/ClientAuthHeader';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <ClientAuthHeader />
      </div>
      {children}
    </>
  );
}
