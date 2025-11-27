"use client";
import React from "react";
import ClientInit from "@/components/ClientInit";
import AuthProvider from "@/components/auth/AuthProvider";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ClientInit />
      {children}
    </AuthProvider>
  );
}
