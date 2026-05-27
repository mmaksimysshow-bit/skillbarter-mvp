"use client";

import { AppShell } from "@/components/layout/AppShell";
import { DemoGuard } from "@/components/layout/DemoGuard";

export function AppFrame({ children }: { children: React.ReactNode }) {
  return (
    <DemoGuard>
      <AppShell>{children}</AppShell>
    </DemoGuard>
  );
}
