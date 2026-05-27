"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { useAppStore } from "@/store/useAppStore";

export function DemoGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const activeUserId = useAppStore((s) => s.activeUserId);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && !activeUserId) {
      router.replace("/access");
    }
  }, [hydrated, activeUserId, router]);

  if (!hydrated) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-[#030014]">
        <AnimatedBackground />
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#7B2CFF] border-t-transparent glow-purple" />
      </div>
    );
  }

  if (!activeUserId) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center gap-4 overflow-x-hidden bg-[#030014] p-6 text-center">
        <AnimatedBackground />
        <h1 className="text-2xl font-bold glow-text">Нужен демо-доступ</h1>
        <p className="max-w-md text-[#AFA8C8]">
          Войдите или создайте профиль на странице доступа, чтобы открыть личный кабинет.
        </p>
        <Link href="/access" className="btn-primary px-6 py-3">
          Перейти к доступу
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
