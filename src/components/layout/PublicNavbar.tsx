"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Menu, Sparkles, X } from "lucide-react";
import { publicNavLinks, siteConfig } from "@/data/mock";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { GlowBadge } from "@/components/ui/motion";

export function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <>
      <AnimatedBackground />
      <header className="sticky top-0 z-50 border-b border-[rgba(168,85,247,0.12)] bg-[rgba(5,2,22,0.72)] backdrop-blur-2xl">
        <div className="container-app flex h-16 items-center justify-between gap-4">
          <Link href="/" className="group flex items-center gap-3 font-bold text-[#F4F0FF]">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.12)] bg-gradient-to-br from-[#7B2CFF] to-[#A855F7] text-sm font-bold shadow-[0_0_32px_rgba(123,44,255,0.45)] transition-transform duration-300 group-hover:-translate-y-0.5">
              SB
            </span>
            <div className="hidden min-w-0 sm:block">
              <span className="block glow-text">{siteConfig.name}</span>
              <span className="block text-[11px] font-medium text-[#AFA8C8]">premium demo workspace</span>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {publicNavLinks.map((link) => (
              <motion.a
                key={link.href}
                href={link.href}
                whileHover={reduceMotion ? undefined : { y: -1 }}
                className="rounded-full px-3 py-2 text-sm text-[#AFA8C8] transition-colors hover:bg-[rgba(123,44,255,0.12)] hover:text-[#F4F0FF]"
              >
                {link.label}
              </motion.a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <GlowBadge icon={Sparkles}>demo MVP</GlowBadge>
            <Link href="/access" className="btn-ghost py-2">
              Войти
            </Link>
            <Link href="/demo" className="btn-primary gap-2 py-2">
              Открыть demo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[rgba(168,85,247,0.25)] bg-[rgba(255,255,255,0.04)] md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={reduceMotion ? false : { height: 0, opacity: 0 }}
              animate={reduceMotion ? undefined : { height: "auto", opacity: 1 }}
              exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-[rgba(168,85,247,0.15)] bg-[rgba(5,2,22,0.82)] md:hidden"
            >
              <nav className="container-app flex flex-col gap-2 py-4">
                {publicNavLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="rounded-2xl border border-transparent px-4 py-3 text-sm text-[#AFA8C8] hover:border-[rgba(168,85,247,0.18)] hover:bg-[rgba(123,44,255,0.12)]"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
                <div className="mt-2 flex flex-col gap-2 border-t border-[rgba(168,85,247,0.15)] pt-4">
                  <Link href="/access" className="btn-ghost text-center" onClick={() => setMobileOpen(false)}>
                    Войти
                  </Link>
                  <Link href="/demo" className="btn-primary text-center" onClick={() => setMobileOpen(false)}>
                    Открыть demo
                  </Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
