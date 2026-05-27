"use client";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  className?: string;
  size?: "sm" | "md";
}

export function ProgressBar({ value, className, size = "md" }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      className={cn(
        "overflow-hidden rounded-full border border-[rgba(168,85,247,0.12)] bg-[linear-gradient(90deg,rgba(168,85,247,0.08),rgba(168,85,247,0.02))]",
        size === "sm" ? "h-1.5" : "h-2.5",
        className,
      )}
    >
      <div
        className="progress-bar-fill h-full rounded-full bg-[linear-gradient(90deg,#7B2CFF_0%,#A855F7_52%,#D8B4FE_100%)] shadow-[0_0_18px_rgba(123,44,255,0.35)]"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
