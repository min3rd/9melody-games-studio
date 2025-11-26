"use client";
import React from 'react';
import { useI18n } from '@/hooks/useI18n';

export default function ErrorMessage({ error }: { error?: any }) {
  const { t } = useI18n();
  if (!error) return null;
  // Accept either { code: 'SOME_CODE' } or raw string
  const code = typeof error === 'object' && error?.code ? error.code : null;
  const message = typeof error === 'object' && error?.message ? error.message : String(error);
  const translated = code ? t(`errors.${code}`) : null;
  return (
    <div className="text-red-600 text-sm">
      {translated ?? message}
    </div>
  );
}
