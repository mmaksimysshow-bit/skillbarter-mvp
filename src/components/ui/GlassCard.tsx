"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  id?: string;
}

export function GlassCard({ children, className, hover = true, id }: GlassCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      id={id}
      initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileTap={hover ? { scale: 0.992 } : undefined}
      className={cn(
        "glass-card rounded-[1.35rem] p-4 sm:p-5",
        hover && "glass-card-hover",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
