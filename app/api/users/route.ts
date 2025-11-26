import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ErrorCodes, formatError } from '@/lib/errorCodes';
import type { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    email,
    username,
    name,
    googleId,
    picture,
    locale,
    hd,
    profile,
    emailVerified,
    accessToken,
    refreshToken,
    password,
  } = body;

  if (!email) {
    return NextResponse.json(formatError(ErrorCodes.EMAIL_REQUIRED), { status: 400 });
  }

  try {
    const data: any = {
      email,
      name,
      googleId,
      picture,
      locale,
      hd,
      profile,
      emailVerified,
      accessToken,
      refreshToken,
      username,
    };
    if (password) {
      // Hash password before saving
      const hash = await bcrypt.hash(password, 10);
      data.passwordHash = hash;
    }
    const user = await prisma.user.create({ data });
    return NextResponse.json(user, { status: 201 });
  } catch (err: any) {
    // Detect unique constraint for email/username and return specific codes
    const msg = String(err?.message || '');
    if (msg.includes('Unique constraint failed') || msg.includes('duplicate key')) {
      if (msg.includes('email') || msg.includes('EMAIL')) {
          return NextResponse.json(formatError(ErrorCodes.EMAIL_EXISTS), { status: 409 });
        }
        if (msg.includes('username')) {
          return NextResponse.json(formatError(ErrorCodes.USERNAME_EXISTS), { status: 409 });
        }
    }
    return NextResponse.json({ ...formatError(ErrorCodes.INTERNAL_ERROR), message: err?.message }, { status: 500 });
  }
}
