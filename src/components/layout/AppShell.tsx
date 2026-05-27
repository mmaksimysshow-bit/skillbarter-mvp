"use client";

import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { Toast } from "@/components/ui/Toast";
import { AppBottomNav } from "./AppBottomNav";
import { AppSidebar } from "./AppSidebar";
import { AppTopbar } from "./AppTopbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen overflow-x-hidden bg-[#030014]">
      <AnimatedBackground />
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar />
        <main className="flex-1 overflow-x-hidden p-3 pb-[calc(5.5rem+env(safe-area-inset-bottom))] sm:p-6 sm:pb-24 lg:pb-6">
          {children}
        </main>
      </div>
      <AppBottomNav />
      <Toast />
    </div>
  );
}
