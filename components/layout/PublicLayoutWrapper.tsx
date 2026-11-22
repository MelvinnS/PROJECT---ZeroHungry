"use client";

import React from "react";
import { usePathname } from "next/navigation";

export function PublicNavbarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  if (pathname.startsWith("/dashboard")) {
    return null;
  }
  return <>{children}</>;
}

export function PublicFooterWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  if (pathname.startsWith("/dashboard")) {
    return null;
  }
  return <>{children}</>;
}

export function PublicMainWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <main
      className={
        isDashboard
          ? "flex-1 w-full"
          : "flex-1 w-full max-w-6xl mx-auto px-5 sm:px-8"
      }
    >
      {children}
    </main>
  );
}
