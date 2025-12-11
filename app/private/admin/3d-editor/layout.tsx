import React from 'react';

export default function Editor3DLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Custom layout for 3D Editor - no AdminShell wrapper
  // The Editor3DClient component handles its own layout with sidebar
  return <>{children}</>;
}
