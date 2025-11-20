import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-surface dark:bg-surface-dark text-black dark:text-white">{children}</div>;
}
