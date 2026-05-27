"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import {
  BookOpen,
  Fingerprint,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  ListChecks,
  Mail,
  MessageCircle,
  PanelLeftClose,
  PanelLeftOpen,
  Route,
  Settings,
  User,
  Users,
  X,
} from "lucide-react";
import { appNavItems, siteConfig } from "@/data/mock";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";

const iconMap = {
  "layout-dashboard": LayoutDashboard,
  user: User,
  "book-open": BookOpen,
  "list-checks": ListChecks,
  "folder-kanban": FolderKanban,
  "graduation-cap": GraduationCap,
  route: Route,
  users: Users,
  "message-circle": MessageCircle,
  fingerprint: Fingerprint,
  mail: Mail,
  settings: Settings,
} as const;

function isNavActive(pathname: string, href: string) {
  if (href === "/demo") return pathname === "/demo";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppSidebar() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const sidebarCollapsed = useAppStore((s) => s.sidebarCollapsed);
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen);
  const toggleSidebarCollapsed = useAppStore((s) => s.toggleSidebarCollapsed);

  const sections = [
    { title: "Старт", itemIds: ["overview", "path"] },
    { title: "Обучение", itemIds: ["lessons", "tasks", "courses", "projects"] },
    { title: "Подтверждение", itemIds: ["skill-id", "profile"] },
    { title: "Коммуникация", itemIds: ["mentors", "messages", "contact", "settings"] },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col bg-[linear-gradient(180deg,rgba(10,5,28,0.95),rgba(6,3,20,0.98))] backdrop-blur-2xl">
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b border-[rgba(168,85,247,0.15)] px-4",
          sidebarCollapsed ? "justify-center" : "justify-between",
        )}
      >
        {!sidebarCollapsed && (
          <Link href="/demo" className="flex min-w-0 items-center gap-3 font-bold tracking-tight text-[#F4F0FF]">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.12)] bg-gradient-to-br from-[#7B2CFF] to-[#A855F7] text-sm shadow-[0_0_24px_rgba(123,44,255,0.4)]">
              SB
            </span>
            <div className="min-w-0">
              <span className="block truncate glow-text">{siteConfig.name}</span>
              <span className="block text-[11px] font-medium text-[#AFA8C8]">workspace</span>
            </div>
          </Link>
        )}
        <button
          type="button"
          className="hidden rounded-lg p-2 text-[#AFA8C8] hover:bg-[rgba(123,44,255,0.15)] lg:inline-flex"
          onClick={toggleSidebarCollapsed}
          aria-label={sidebarCollapsed ? "Развернуть sidebar" : "Свернуть sidebar"}
        >
          {sidebarCollapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
        </button>
        <button
          type="button"
          className="rounded-lg p-2 text-[#AFA8C8] hover:bg-[rgba(123,44,255,0.15)] lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Закрыть меню"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto p-2.5">
        {sections.map((section) => (
          <div key={section.title} className="space-y-1">
            {!sidebarCollapsed && (
              <p className="px-3 pb-1 text-[10px] font-medium uppercase tracking-[0.22em] text-[#7E7896]">
                {section.title}
              </p>
            )}
            {section.itemIds.map((itemId) => {
              const item = appNavItems.find((navItem) => navItem.id === itemId);
              if (!item) return null;
              const Icon = iconMap[item.icon as keyof typeof iconMap] ?? LayoutDashboard;
              const active = isNavActive(pathname, item.href);

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  title={sidebarCollapsed ? item.label : undefined}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "group relative flex items-center gap-3 overflow-hidden rounded-2xl px-3 py-3 text-sm font-medium transition-all duration-300",
                    active
                      ? "sidebar-active-glow border border-[rgba(168,85,247,0.2)] text-[#F4F0FF]"
                      : "border border-transparent text-[#AFA8C8] hover:border-[rgba(168,85,247,0.16)] hover:bg-[rgba(123,44,255,0.1)] hover:text-[#F4F0FF]",
                    sidebarCollapsed && "justify-center px-2",
                  )}
                >
                  {active && !sidebarCollapsed && (
                    <motion.span
                      layoutId={reduceMotion ? undefined : "sidebar-active-pill"}
                      className="absolute inset-y-2 left-0 w-1 rounded-full bg-gradient-to-b from-[#C084FC] to-[#7B2CFF]"
                    />
                  )}
                  <Icon className="h-5 w-5 shrink-0" />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="border-t border-[rgba(168,85,247,0.15)] p-3">
        <Link
          href="/"
          className={cn(
            "block rounded-2xl border border-[rgba(168,85,247,0.2)] bg-[rgba(255,255,255,0.03)] px-3 py-2.5 text-center text-sm text-[#AFA8C8] hover:border-[#A855F7] hover:text-[#F4F0FF]",
            sidebarCollapsed && "px-2 text-xs",
          )}
        >
          {sidebarCollapsed ? "←" : "На лендинг"}
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={cn(
          "hidden shrink-0 border-r border-[rgba(168,85,247,0.15)] transition-[width] duration-300 lg:block",
          sidebarCollapsed ? "w-[72px]" : "w-64",
        )}
      >
        {sidebarContent}
      </aside>

      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          aria-label="Закрыть меню"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <motion.aside
        initial={false}
        animate={reduceMotion ? undefined : { x: sidebarOpen ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        className="fixed inset-y-0 left-0 z-50 w-72 max-w-[86vw] border-r border-[rgba(168,85,247,0.15)] lg:hidden"
      >
        {sidebarContent}
      </motion.aside>
    </>
  );
}
