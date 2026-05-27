"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            aria-label="Закрыть"
            onClick={onClose}
          />
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="glass-card fixed left-1/2 top-1/2 z-50 max-h-[min(90dvh,100%)] w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[1.7rem] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.5)] sm:w-[calc(100%-2rem)] sm:p-6"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <h2 className="break-words pr-2 text-lg font-semibold">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                className="touch-target shrink-0 rounded-lg text-[#AFA8C8] hover:bg-[rgba(123,44,255,0.15)]"
                aria-label="Закрыть"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
