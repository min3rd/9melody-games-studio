import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
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
    return NextResponse.json({ error: 'email is required' }, { status: 400 });
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
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
