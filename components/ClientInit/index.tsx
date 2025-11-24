"use client";
import React, { useEffect } from 'react';
import { setClientLanguage } from '@/lib/i18n';

export default function ClientInit() {
  useEffect(() => {
    setClientLanguage();
  }, []);

  return null;
}
