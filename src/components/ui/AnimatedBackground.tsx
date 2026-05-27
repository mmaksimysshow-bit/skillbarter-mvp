"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export function AnimatedBackground({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className={cn("pointer-events-none fixed inset-0 -z-10 overflow-hidden gradient-bg gradient-bg-animated", className)} aria-hidden>
      <div className="scene-grid" />
      <div className="noise-layer" />
      <motion.div
        animate={reduceMotion ? undefined : { x: [0, 18, -8, 0], y: [0, -14, 12, 0] }}
        transition={reduceMotion ? undefined : { duration: 18, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(123,44,255,0.32),transparent_68%)] blur-3xl"
      />
      <motion.div
        animate={reduceMotion ? undefined : { x: [0, -20, 12, 0], y: [0, 16, -10, 0] }}
        transition={reduceMotion ? undefined : { duration: 24, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className="absolute right-[-7rem] top-[15%] h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.24),transparent_70%)] blur-3xl"
      />
      <motion.div
        animate={reduceMotion ? undefined : { x: [0, 16, -6, 0], y: [0, -12, 14, 0] }}
        transition={reduceMotion ? undefined : { duration: 28, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className="absolute bottom-[-6rem] left-1/3 h-[20rem] w-[20rem] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.16),transparent_70%)] blur-3xl"
      />
    </div>
  );
}
