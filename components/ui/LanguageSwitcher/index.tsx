"use client";
import React, { useEffect, useState } from 'react';
import i18n from '@/lib/i18n';
import { PRESET_MAP, type Preset } from '../presets';

export default function LanguageSwitcher({ preset, color }: { preset?: Preset; color?: string } = {}) {
  // Initialize to the server-rendered default to avoid hydration mismatch.
  // Read `localStorage` only on the client in an effect and update state there.
  const [lang, setLang] = useState<'en' | 'vi'>('en');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('lang');
      if (stored === 'vi') setLang('vi');
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('lang', lang);
    } catch {}
    // persist as cookie so server can read the language for SSR
    try {
      const maxAge = 60 * 60 * 24 * 365; // 1 year
      document.cookie = `lang=${lang}; path=/; max-age=${maxAge}; samesite=lax`;
    } catch {}
    if (typeof document !== 'undefined') document.documentElement.lang = lang;
    // inform i18n about language change
    if (i18n && i18n.language !== lang) i18n.changeLanguage(lang);
  }, [lang]);

  function setLanguage(l: 'en' | 'vi') {
    setLang(l);
  }

  return (
    <div suppressHydrationWarning className="inline-flex items-center gap-2 rounded-sm border border-neutral-200 dark:border-neutral-800 p-1 bg-white dark:bg-neutral-900">
      <button
        onClick={() => setLanguage('en')}
        className={`px-2 py-1 text-xs rounded-sm ${lang === 'en' ? 'text-background' : 'text-neutral-700 dark:text-neutral-300'}`}
        style={lang === 'en' ? { background: color ?? (preset ? PRESET_MAP[preset] : undefined), color: '#fff' } : undefined}
        aria-pressed={lang === 'en'}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('vi')}
        className={`px-2 py-1 text-xs rounded-sm ${lang === 'vi' ? 'text-background' : 'text-neutral-700 dark:text-neutral-300'}`}
        style={lang === 'vi' ? { background: color ?? (preset ? PRESET_MAP[preset] : undefined), color: '#fff' } : undefined}
        aria-pressed={lang === 'vi'}
      >
        VI
      </button>
    </div>
  );
}
