import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  // cookies() returns a Promise in some Next.js runtimes and must be awaited
  // to ensure we have the `RequestCookies` API available with .get().
  const cookieStore = await cookies();
  const email = cookieStore.get?.('userEmail')?.value ?? null;
  const isAdmin = cookieStore.get?.('isAdmin')?.value === 'true';
  return NextResponse.json({ email, isAdmin });
}
