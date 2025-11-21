"use client";
import React, { useEffect, useState } from 'react';
import { LanguageSwitcher } from '@/components/ui';

export default function LanguageSwitcherPreview(): React.ReactElement {
  const [lang, setLang] = useState<'en' | 'vi'>(() => {
    if (typeof window === 'undefined') return 'en';
    const stored = localStorage.getItem('lang');
    return stored === 'vi' ? 'vi' : 'en';
  });

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === 'lang') setLang(e.newValue === 'vi' ? 'vi' : 'en');
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <LanguageSwitcher />
        <div className="text-sm text-neutral-700 dark:text-neutral-300">Selected: <span className="font-medium">{lang === 'en' ? 'English' : 'Tiếng Việt'}</span></div>
      </div>
      <div className="text-sm text-neutral-700 dark:text-neutral-300">
        {lang === 'en' ? 'This is an example text in English.' : 'Đây là đoạn văn ví dụ bằng tiếng Việt.'}
      </div>
    </div>
  );
}
