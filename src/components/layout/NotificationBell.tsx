"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";

export function NotificationBell() {
  const notifications = useAppStore((s) => s.notifications);
  const markAllNotificationsRead = useAppStore((s) => s.markAllNotificationsRead);
  const unread = useAppStore((s) => s.getUnreadNotificationsCount());
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[rgba(168,85,247,0.25)] bg-[rgba(255,255,255,0.04)] text-[#AFA8C8] transition-colors hover:border-[#A855F7] hover:text-[#F4F0FF]"
        aria-label="Уведомления"
        aria-expanded={open}
      >
        <motion.span
          animate={unread > 0 && !reduceMotion ? { rotate: [0, -12, 12, -8, 0] } : undefined}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Bell className="h-5 w-5" />
        </motion.span>
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#7B2CFF] px-1 text-[10px] font-bold text-white glow-purple">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="glass-card absolute right-0 top-full z-50 mt-2 w-[calc(100vw-2rem)] max-w-sm rounded-[1.5rem] p-0 shadow-xl sm:w-80"
          >
            <div className="flex items-center justify-between border-b border-[rgba(168,85,247,0.15)] px-4 py-3">
              <p className="font-semibold">Уведомления</p>
              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={markAllNotificationsRead}
                  className="text-xs text-[#A855F7] hover:underline"
                >
                  Отметить все
                </button>
              )}
            </div>
            <ul className="max-h-72 overflow-y-auto">
              {notifications.length === 0 ? (
                <li className="px-4 py-8 text-center text-sm text-[#AFA8C8]">Пока нет уведомлений</li>
              ) : (
                notifications.map((n) => (
                  <li key={n.id}>
                    {n.href ? (
                      <Link
                        href={n.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "block border-b border-[rgba(168,85,247,0.08)] px-4 py-3 transition-colors hover:bg-[rgba(123,44,255,0.1)]",
                          !n.read && "bg-[rgba(123,44,255,0.06)]",
                        )}
                      >
                        <p className="break-words text-sm font-medium">{n.title}</p>
                        <p className="mt-0.5 break-words text-xs text-[#AFA8C8]">{n.text}</p>
                        <p className="mt-1 text-[10px] text-[#AFA8C8]/70">{n.time}</p>
                      </Link>
                    ) : (
                      <div
                        className={cn(
                          "border-b border-[rgba(168,85,247,0.08)] px-4 py-3",
                          !n.read && "bg-[rgba(123,44,255,0.06)]",
                        )}
                      >
                        <p className="break-words text-sm font-medium">{n.title}</p>
                        <p className="mt-0.5 break-words text-xs text-[#AFA8C8]">{n.text}</p>
                      </div>
                    )}
                  </li>
                ))
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
