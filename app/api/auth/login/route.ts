import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, username, password } = body;
  if (!password) return NextResponse.json({ error: 'password required' }, { status: 400 });

  let user = null;
  if (email) user = await prisma.user.findUnique({ where: { email } });
  else if (username) user = await prisma.user.findUnique({ where: { username } });
  else return NextResponse.json({ error: 'email or username required' }, { status: 400 });

  if (!user) return NextResponse.json({ error: 'user not found' }, { status: 404 });
  if (!user.passwordHash) return NextResponse.json({ error: 'password sign-in not available' }, { status: 403 });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return NextResponse.json({ error: 'invalid credentials' }, { status: 401 });

  const res = NextResponse.json({ ok: true, user: { id: user.id, email: user.email, role: user.role } });
  // Set a session cookie for the logged-in user and set admin cookie only if role is admin
  res.cookies.set('userEmail', user.email, { path: '/', maxAge: 60 * 60 * 12, httpOnly: true, sameSite: 'lax' });
  if (user.role === 'admin') {
    res.cookies.set('isAdmin', 'true', { path: '/', maxAge: 60 * 60 * 12, httpOnly: true, sameSite: 'lax' });
    res.cookies.set('adminEmail', user.email, { path: '/', maxAge: 60 * 60 * 12, httpOnly: true, sameSite: 'lax' });
  }
  return res;
}
