"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function MotionPage({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.08,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={{
        hidden: reduceMotion ? {} : { opacity: 0, y: 18 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function GlowBadge({
  children,
  icon: Icon,
  className,
}: {
  children: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-[rgba(168,85,247,0.28)] bg-[linear-gradient(135deg,rgba(123,44,255,0.22),rgba(168,85,247,0.1))] px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-[#D8C4FF] shadow-[0_0_24px_rgba(123,44,255,0.18)]",
        className,
      )}
    >
      {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
      {children}
    </span>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", className)}>
      {eyebrow && <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#A855F7]">{eyebrow}</p>}
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#F7F3FF] sm:text-3xl">{title}</h2>
      {description && <p className="mt-3 text-sm leading-relaxed text-[#AFA8C8] sm:text-base">{description}</p>}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-dashed border-[rgba(168,85,247,0.24)] bg-[linear-gradient(180deg,rgba(15,10,38,0.92),rgba(7,4,26,0.72))] px-5 py-8 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]",
        className,
      )}
    >
      <div className="mx-auto mb-4 h-16 w-16 rounded-2xl border border-[rgba(168,85,247,0.2)] bg-[radial-gradient(circle_at_30%_30%,rgba(168,85,247,0.25),transparent_70%)] shadow-[0_0_30px_rgba(123,44,255,0.2)]" />
      <h3 className="text-lg font-semibold text-[#F7F3FF]">{title}</h3>
      <p className="mx-auto mt-2 max-w-md break-words text-sm text-[#AFA8C8]">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
