import React from 'react';
import { cookies } from 'next/headers';
import { setServerLanguage } from '@/lib/i18n';
import Editor3DClient from './Editor3DClient';

export const metadata = {
  title: '3D Editor - Admin',
  description: 'Create and edit 3D scenes',
};

export default async function Editor3DPage() {
  const cookieStore = await cookies();
  const cookieLang = cookieStore.get('lang')?.value;
  const htmlLang = cookieLang === 'vi' ? 'vi' : 'en';
  setServerLanguage(htmlLang);

  return <Editor3DClient />;
}
