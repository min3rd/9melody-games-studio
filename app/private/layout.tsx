import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ClientAuthHeader from "@/components/ClientAuthHeader";

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const userEmail = cookieStore.get("userEmail")?.value;
  if (!userEmail) {
    redirect("/auth/login?next=/private");
  }

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <ClientAuthHeader />
      </div>
      <div className="flex flex-col w-full h-full overflow-hidden bg-neutral-50 dark:bg-neutral-900">
        {children}
      </div>
    </>
  );
}
