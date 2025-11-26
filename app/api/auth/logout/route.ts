import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const res = NextResponse.json({ ok: true });
  // Clear all auth-related cookies including userEmail so user is fully logged out
  res.cookies.set('userEmail', '', { maxAge: 0, path: '/' });
  res.cookies.set('isAdmin', '', { maxAge: 0, path: '/' });
  res.cookies.set('adminEmail', '', { maxAge: 0, path: '/' });
  return res;
}

