import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const pathname = nextUrl.pathname;

  if (pathname.startsWith("/private/admin")) {
    const adminCookie = request.cookies.get("isAdmin");
    const isAdmin = adminCookie?.value === "true";
    if (!isAdmin) {
      const redirectUrl = new URL("/private/admin/not-authorized", request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/private/admin/:path*", "/admin/:path*"],
};
