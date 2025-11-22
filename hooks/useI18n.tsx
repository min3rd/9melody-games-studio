"use client";
import { useEffect, useState } from 'react';
import i18n from '@/lib/i18n';

export function useI18n() {
  const [lng, setLng] = useState(i18n.language || 'en');

  useEffect(() => {
    function handleChange(l: string) {
      setLng(l);
    }
    i18n.on('languageChanged', handleChange);
    return () => i18n.off('languageChanged', handleChange);
  }, []);

  return {
    t: (k: string, opt?: Record<string, unknown>) => i18n.t(k, opt),
    i18n,
    language: lng,
    changeLanguage: (l: string) => i18n.changeLanguage(l),
  } as const;
}
