import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { ErrorCodes, formatError } from '@/lib/errorCodes';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, username, password, name } = body;

  if (!email) return NextResponse.json(formatError(ErrorCodes.EMAIL_REQUIRED), { status: 400 });
  if (!password) return NextResponse.json(formatError(ErrorCodes.PASSWORD_REQUIRED), { status: 400 });

  try {
    const hashed = await bcrypt.hash(password, 10);
    const data: Prisma.UserCreateInput = { email, username, name, passwordHash: hashed } as Prisma.UserCreateInput;
    const user = await prisma.user.create({ data });

    const res = NextResponse.json({ ok: true, user: { id: user.id, email: user.email, role: user.role } }, { status: 201 });
    res.cookies.set('userEmail', user.email, { path: '/', maxAge: 60 * 60 * 12, httpOnly: true, sameSite: 'lax' });
    if (user.role === 'admin') {
      res.cookies.set('isAdmin', 'true', { path: '/', maxAge: 60 * 60 * 12, httpOnly: true, sameSite: 'lax' });
      res.cookies.set('adminEmail', user.email, { path: '/', maxAge: 60 * 60 * 12, httpOnly: true, sameSite: 'lax' });
    }
    return res;
  } catch (err: unknown) {
    // Prisma known errors include a code property (P2002 = unique constraint violation)
    const e = err as { code?: string; message?: string; meta?: { target?: string[] } | undefined };
    const code = e?.code;
    const msg = String(e?.message || '');
    if (code === 'P2002') {
      // err.meta.target may include the failing fields
      const target = Array.isArray(e?.meta?.target) ? e.meta.target.join(',') : String(e?.meta?.target || '');
      if (target.includes('email')) return NextResponse.json(formatError(ErrorCodes.EMAIL_EXISTS), { status: 409 });
      if (target.includes('username')) return NextResponse.json(formatError(ErrorCodes.USERNAME_EXISTS), { status: 409 });
    }
    if (msg.includes('Unique constraint failed') || msg.includes('duplicate key')) {
      if (msg.includes('email') || msg.includes('EMAIL')) {
        return NextResponse.json(formatError(ErrorCodes.EMAIL_EXISTS), { status: 409 });
      }
      if (msg.includes('username')) {
        return NextResponse.json(formatError(ErrorCodes.USERNAME_EXISTS), { status: 409 });
      }
    }
    return NextResponse.json({ ...formatError(ErrorCodes.INTERNAL_ERROR), message: e?.message }, { status: 500 });
  }
}
