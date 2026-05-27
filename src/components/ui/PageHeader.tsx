"use client";

import { motion, useReducedMotion } from "framer-motion";
import { GlowBadge } from "./motion";

interface PageHeaderProps {
  title: string;
  description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.header
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="space-y-3"
    >
      <GlowBadge className="w-fit">SkillBarter Workspace</GlowBadge>
      <h1 className="break-words text-2xl font-semibold tracking-tight sm:text-4xl glow-text">{title}</h1>
      {description && (
        <p className="max-w-3xl break-words text-sm leading-relaxed text-[#AFA8C8] sm:text-base">
          {description}
        </p>
      )}
    </motion.header>
  );
}
