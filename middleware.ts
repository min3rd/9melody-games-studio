import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protect the /private/admin and redirect /admin to /private/admin
export function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const pathname = nextUrl.pathname;

  // Redirect legacy /admin routes to the new location under /private/admin
  if (pathname.startsWith('/admin')) {
    const newPath = pathname.replace('/admin', '/private/admin');
    const redirectUrl = new URL(newPath || '/', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Only protect /private/admin routes
  if (pathname.startsWith('/private/admin')) {
    const adminCookie = request.cookies.get('isAdmin');
    const isAdmin = adminCookie?.value === 'true';
    if (!isAdmin) {
      // Redirect to admin not-authorized page for clarity
      const redirectUrl = new URL('/private/admin/not-authorized', request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/private/admin/:path*', '/admin/:path*'],
};
