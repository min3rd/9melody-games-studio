import React from "react";
import { cookies } from "next/headers";
import { setServerLanguage } from "@/lib/i18n";
// Client AdminShell handles navigation and responsive UI
import AdminShell from "@/components/admin/AdminShell";

export default async function PrivateAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const cookieLang = cookieStore.get("lang")?.value;
  const htmlLang = cookieLang === "vi" ? "vi" : "en";
  setServerLanguage(htmlLang);

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900">
      <AdminShell>{children}</AdminShell>
    </div>
  );
}
