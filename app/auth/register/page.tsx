import React from 'react';
import RegisterClient from '@/app/public/auth/register/RegisterClient';

export const metadata = {
  title: 'Register',
  description: 'Create a new account',
};

export default function RegisterPage() {
  return <RegisterClient />;
}
