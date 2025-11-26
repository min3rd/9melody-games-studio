import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const res = NextResponse.json({ ok: true });
  res.cookies.set('isAdmin', '', { maxAge: 0, path: '/' });
  res.cookies.set('adminEmail', '', { maxAge: 0, path: '/' });
  return res;
}

