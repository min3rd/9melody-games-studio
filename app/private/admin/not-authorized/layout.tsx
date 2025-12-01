import React from "react";

export default function NotAuthorizedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Simple layout without validation to prevent redirect loops
  return <>{children}</>;
}
