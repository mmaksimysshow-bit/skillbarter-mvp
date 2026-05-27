"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";

export function Toast() {
  const toastMessage = useAppStore((s) => s.toastMessage);
  const clearToast = useAppStore((s) => s.clearToast);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!toastMessage) return;
    const t = setTimeout(() => clearToast(), 3500);
    return () => clearTimeout(t);
  }, [toastMessage, clearToast]);

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="fixed bottom-24 left-1/2 z-[60] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-2xl border border-[rgba(168,85,247,0.35)] bg-[linear-gradient(180deg,rgba(20,12,44,0.96),rgba(12,8,30,0.94))] px-4 py-3 text-center text-sm font-medium text-[#F4F0FF] shadow-[0_18px_44px_rgba(0,0,0,0.45)] glow-purple lg:bottom-8"
        >
          {toastMessage}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
