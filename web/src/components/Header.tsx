import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <header className="py-4 border-b dark:border-neutral-800">
      <div className="container mx-auto flex justify-between items-center">
        <nav>
          <Link href="/" className="font-semibold mr-4">9Melody</Link>
          <Link href="/posts" className="mr-4">Bài viết</Link>
          <Link href="/jobs" className="mr-4">Tuyển dụng</Link>
          <Link href="/forum">Forum</Link>
        </nav>
        <div className="flex items-center gap-4">
          <button
            aria-label="Toggle theme"
            className="px-3 py-1 rounded border dark:border-neutral-700"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>
      </div>
    </header>
  );
}
