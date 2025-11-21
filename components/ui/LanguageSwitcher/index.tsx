"use client";
import React, { useEffect, useState } from 'react';

export default function LanguageSwitcher() {
  const [lang, setLang] = useState<'en' | 'vi'>(() => {
    if (typeof window === 'undefined') return 'en';
    const stored = localStorage.getItem('lang');
    return stored === 'vi' ? 'vi' : 'en';
  });

  useEffect(() => {
    try {
      localStorage.setItem('lang', lang);
    } catch (e) {}
    if (typeof document !== 'undefined') document.documentElement.lang = lang;
  }, [lang]);

  function setLanguage(l: 'en' | 'vi') {
    setLang(l);
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-sm border border-neutral-200 dark:border-neutral-800 p-1 bg-white dark:bg-neutral-900">
      <button
        onClick={() => setLanguage('en')}
        className={`px-2 py-1 text-xs rounded-sm ${lang === 'en' ? 'bg-foreground text-background dark:bg-background dark:text-foreground' : 'text-neutral-700 dark:text-neutral-300'}`}
        aria-pressed={lang === 'en'}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('vi')}
        className={`px-2 py-1 text-xs rounded-sm ${lang === 'vi' ? 'bg-foreground text-background dark:bg-background dark:text-foreground' : 'text-neutral-700 dark:text-neutral-300'}`}
        aria-pressed={lang === 'vi'}
      >
        VI
      </button>
    </div>
  );
}
