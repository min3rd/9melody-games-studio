import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = cookies();
  const email = cookieStore.get('userEmail')?.value ?? null;
  const isAdmin = cookieStore.get('isAdmin')?.value === 'true';
  return NextResponse.json({ email, isAdmin });
}
