"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, LayoutDashboard, ListChecks, Menu, MessageCircle, User } from "lucide-react";
import { appNavItems, mobileNavItems } from "@/data/mock";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";

const mobileIcons = {
  overview: LayoutDashboard,
  lessons: BookOpen,
  tasks: ListChecks,
  messages: MessageCircle,
  profile: User,
} as const;

function isNavActive(pathname: string, href: string) {
  if (href === "/demo") return pathname === "/demo";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppBottomNav() {
  const pathname = usePathname();
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen);

  const items = mobileNavItems
    .map((id) => appNavItems.find((n) => n.id === id))
    .filter(Boolean);

  return (
    <nav className="topbar-glass fixed bottom-0 left-0 right-0 z-30 flex max-w-[100vw] items-stretch justify-around border-t border-[rgba(168,85,247,0.15)] px-0.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1 lg:hidden">
      {items.map((item) => {
        if (!item) return null;
        const Icon = mobileIcons[item.id as keyof typeof mobileIcons] ?? LayoutDashboard;
        const active = isNavActive(pathname, item.href);
        return (
          <Link
            key={item.id}
            href={item.href}
            className={cn(
              "flex min-h-11 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-lg px-0.5 py-1 text-[10px] sm:text-xs",
              active ? "text-[#A855F7]" : "text-[#AFA8C8]",
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
      <button
        type="button"
        onClick={() => setSidebarOpen(true)}
        className="flex min-h-11 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-lg px-0.5 py-1 text-[10px] text-[#AFA8C8] sm:text-xs"
      >
        <Menu className="h-5 w-5" />
        <span>Ещё</span>
      </button>
    </nav>
  );
}
