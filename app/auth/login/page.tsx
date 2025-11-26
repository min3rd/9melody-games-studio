import React from 'react';
import LoginClient from '@/app/public/auth/login/LoginClient';

export const metadata = {
  title: 'Login',
  description: 'Sign in to your account',
};

export default function LoginPage() {
  return <LoginClient />;
}
