import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { ErrorCodes, formatError } from '@/lib/errorCodes';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, username, password } = body;
  if (!password) return NextResponse.json(formatError(ErrorCodes.PASSWORD_REQUIRED), { status: 400 });

  let user = null;
  if (email) user = await prisma.user.findUnique({ where: { email } });
  else if (username) user = await prisma.user.findUnique({ where: { username } });
  else return NextResponse.json(formatError(ErrorCodes.IDENTIFIER_REQUIRED), { status: 400 });

  if (!user) return NextResponse.json(formatError(ErrorCodes.USER_NOT_FOUND), { status: 404 });
  if (user.disabled) return NextResponse.json(formatError(ErrorCodes.USER_DISABLED ?? ErrorCodes.FORBIDDEN), { status: 403 });
  if (!user.passwordHash) return NextResponse.json(formatError(ErrorCodes.PASSWORD_SIGNIN_NOT_AVAILABLE), { status: 403 });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return NextResponse.json(formatError(ErrorCodes.INVALID_CREDENTIALS), { status: 401 });

  const res = NextResponse.json({ ok: true, user: { id: user.id, email: user.email, role: user.role } });
  // Set a session cookie for the logged-in user and set admin cookie only if role is admin
  res.cookies.set('userEmail', user.email, { path: '/', maxAge: 60 * 60 * 12, httpOnly: true, sameSite: 'lax' });
  // include session version to allow global session revocation
  res.cookies.set('sv', String(user.sessionVersion ?? 0), { path: '/', maxAge: 60 * 60 * 12, httpOnly: true, sameSite: 'lax' });
  if (user.role === 'admin') {
    res.cookies.set('isAdmin', 'true', { path: '/', maxAge: 60 * 60 * 12, httpOnly: true, sameSite: 'lax' });
    res.cookies.set('adminEmail', user.email, { path: '/', maxAge: 60 * 60 * 12, httpOnly: true, sameSite: 'lax' });
  }
  return res;
}
