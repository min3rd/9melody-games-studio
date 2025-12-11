"use client";
import React, { useState } from "react";
// Link unused in AdminShell; navigation is done via router
import { usePathname, useRouter } from "next/navigation";
import {
  Drawer,
  DrawerContainer,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Menu,
  ThemeToggle,
  UserMenu,
  LanguageSwitcher,
} from "@/components/ui";
import i18n from "@/lib/i18n";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const t = (key: string) => i18n.t(key, { ns: 'admin' });

  const items = [
    { label: t("dashboard"), href: "/private/admin" },
    { label: t("users"), href: "/private/admin/users" },
    { label: t("3dEditor"), href: "/private/admin/3d-editor" },
    { label: t("settings"), href: "/private/admin/settings" },
  ];

  const menuItems = items.map((it) => ({
    label: it.label,
    onClick: () => {
      setOpen(false);
      router.push(it.href);
    },
    selected: pathname?.startsWith(it.href ?? "") ?? false,
  }));

  return (
    <DrawerContainer open={open} onClose={() => setOpen(false)} mode="over" position="left" width={260}>
      {/* Mobile Drawer */}
      <Drawer aria-label="Admin navigation">
        <DrawerHeader>
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Admin</div>
            <div>
              <button
                className="px-2 py-1 rounded-sm"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </div>
          </div>
        </DrawerHeader>
        <DrawerBody>
          <Menu items={menuItems} className="w-full" />
        </DrawerBody>
        <DrawerFooter>
          <div className="flex items-center justify-between gap-2 px-4 py-2">
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
            <UserMenu />
          </div>
        </DrawerFooter>
      </Drawer>

      {/* Desktop layout */}
      <div className="flex h-screen overflow-hidden">
        <aside className="hidden md:flex flex-col w-64 p-4 bg-white dark:bg-neutral-800 border-r dark:border-neutral-700">
          {/* Header with title and controls */}
          <div className="flex flex-col gap-3 mb-6">
            <div className="flex items-center justify-between">
              <h2 className="font-bold">Admin</h2>
            </div>
            {/* Controls row */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <LanguageSwitcher />
              </div>
              <UserMenu />
            </div>
          </div>
          <nav className="flex-1 overflow-auto">
            <Menu items={menuItems} className="w-full" />
          </nav>
        </aside>
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile header for hamburger menu only */}
          <header className="md:hidden flex items-center gap-3 px-4 py-3 bg-white dark:bg-neutral-800 border-b dark:border-neutral-700">
            <button
              className="px-2 py-1 rounded-sm"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              ☰
            </button>
            <h1 className="text-lg font-semibold">Admin</h1>
          </header>
          <div className="flex-1 overflow-auto">{children}</div>
        </main>
      </div>
    </DrawerContainer>
  );
}
