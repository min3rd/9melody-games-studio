"use client";
import React from "react";
import AdminShell from "@/components/admin/AdminShell";

export default function AdminPreview() {
  return (
    <AdminShell>
      <div className="p-4">
        <h2 className="text-xl font-bold">Admin preview content</h2>
        <p className="text-sm">This is a preview of the responsive admin layout with Drawer + Menu integration.</p>
      </div>
    </AdminShell>
  );
}
