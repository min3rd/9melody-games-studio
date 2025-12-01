import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function validateAdminAccess() {
  const cookieStore = await cookies();
  const userEmail = cookieStore.get("userEmail")?.value ?? null;
  const svCookie = cookieStore.get("sv")?.value ?? null;
  const isAdmin = cookieStore.get("isAdmin")?.value === "true";

  if (!isAdmin || !userEmail) {
    redirect("/private/admin/not-authorized");
  }

  try {
    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user || user.disabled || String(user.sessionVersion ?? 0) !== svCookie || user.role !== "admin") {
      redirect("/private/admin/not-authorized");
    }
    return user;
  } catch {
    redirect("/private/admin/not-authorized");
  }
}
