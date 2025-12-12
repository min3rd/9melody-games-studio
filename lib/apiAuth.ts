import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";

export async function requireAdminFromRequest(request: NextRequest) {
  const email = request.cookies.get("userEmail")?.value ?? null;
  const sessionVersion = request.cookies.get("sv")?.value ?? null;
  const isAdminCookie = request.cookies.get("isAdmin")?.value === "true";

  if (!email || !isAdminCookie) {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.disabled || user.role !== "admin") {
      return null;
    }
    if (sessionVersion && String(user.sessionVersion ?? 0) !== sessionVersion) {
      return null;
    }
    return user;
  } catch {
    return null;
  }
}
