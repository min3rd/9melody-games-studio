import React from 'react';
import { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: '9melody Games Studio - Game Development Company',
  description: 'Welcome to 9melody Games Studio - Creating innovative and engaging gaming experiences',
};

export default function PublicHomePage() {
  return <HomeClient />;
}
