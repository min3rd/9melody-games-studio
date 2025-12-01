import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const cookieStore = await cookies();
  const email = cookieStore.get?.('userEmail')?.value ?? null;
  const svCookie = cookieStore.get?.('sv')?.value ?? null;
  let isAdmin = cookieStore.get?.('isAdmin')?.value === 'true';
  if (!email) return NextResponse.json({ email: null, isAdmin: false });
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.disabled) {
      const res = NextResponse.json({ email: null, isAdmin: false });
      res.cookies.set('userEmail', '', { maxAge: 0, path: '/' });
      res.cookies.set('isAdmin', '', { maxAge: 0, path: '/' });
      res.cookies.set('adminEmail', '', { maxAge: 0, path: '/' });
      res.cookies.set('sv', '', { maxAge: 0, path: '/' });
      return res;
    }
    const sv = String(user.sessionVersion ?? 0);
    if (svCookie !== sv) {
      const res = NextResponse.json({ email: null, isAdmin: false });
      res.cookies.set('userEmail', '', { maxAge: 0, path: '/' });
      res.cookies.set('isAdmin', '', { maxAge: 0, path: '/' });
      res.cookies.set('adminEmail', '', { maxAge: 0, path: '/' });
      res.cookies.set('sv', '', { maxAge: 0, path: '/' });
      return res;
    }
    isAdmin = user.role === 'admin';
    return NextResponse.json({ email: user.email, isAdmin });
  } catch {
    return NextResponse.json({ email: null, isAdmin: false });
  }
}
