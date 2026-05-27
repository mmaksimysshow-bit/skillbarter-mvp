"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { ArrowRight, LogOut, Menu, Sparkles } from "lucide-react";
import { NotificationBell } from "./NotificationBell";
import { GlowBadge } from "@/components/ui/motion";
import { useAppStore } from "@/store/useAppStore";

function getNextStep(lessons: ReturnType<typeof useAppStore.getState>["lessons"], tasks: ReturnType<typeof useAppStore.getState>["tasks"]) {
  const activeLesson = lessons.find((lesson) => lesson.status === "in_progress");
  const firstLesson = lessons.find((lesson) => lesson.status === "available");
  const latestCompletedLesson = [...lessons]
    .filter((lesson) => lesson.status === "completed")
    .sort((left, right) => right.order - left.order)[0];
  const submittedTask = tasks.find((task) => task.status === "submitted");
  const activeTask = tasks.find((task) => task.status === "in_progress");

  if (submittedTask) {
    return {
      label: "Подтвердить кейс",
      helper: "Задача уже сдана. Остался финальный шаг до Skill ID.",
      href: `/tasks/${submittedTask.id}`,
    };
  }

  if (activeTask) {
    return {
      label: "Продолжить задачу",
      helper: "Практика уже начата. Доведи её до сдачи наставнику.",
      href: `/tasks/${activeTask.id}`,
    };
  }

  if (latestCompletedLesson?.relatedTaskId) {
    return {
      label: "Перейти к задаче",
      helper: "Урок завершён. Теперь нужно закрепить навык практикой.",
      href: `/tasks/${latestCompletedLesson.relatedTaskId}`,
    };
  }

  if (activeLesson) {
    return {
      label: "Продолжить обучение",
      helper: "Сейчас самый полезный шаг — закончить текущий урок.",
      href: `/lessons/${activeLesson.id}`,
    };
  }

  if (firstLesson) {
    return {
      label: "Начать первый урок",
      helper: "Это лучший старт: урок откроет первую практическую задачу.",
      href: `/lessons/${firstLesson.id}`,
    };
  }

  return {
    label: "Открыть Skill ID",
    helper: "База уже собрана. Посмотри, как маршрут отражается в профиле навыков.",
    href: "/skill-id",
  };
}

export function AppTopbar() {
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const lessons = useAppStore((state) => state.lessons);
  const tasks = useAppStore((state) => state.tasks);
  const setSidebarOpen = useAppStore((state) => state.setSidebarOpen);
  const logout = useAppStore((state) => state.logout);
  const nextStep = useMemo(() => getNextStep(lessons, tasks), [lessons, tasks]);

  const handleLogout = () => {
    logout();
    router.push("/access");
  };

  return (
    <header className="topbar-glass sticky top-0 z-30 flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[rgba(168,85,247,0.25)] bg-[rgba(255,255,255,0.04)] text-[#F4F0FF] hover:bg-[rgba(123,44,255,0.15)] lg:hidden"
          onClick={() => setSidebarOpen(true)}
          aria-label="Открыть меню"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="min-w-0 lg:hidden">
          <p className="truncate text-sm font-semibold">{user.name}</p>
          <p className="text-xs text-[#AFA8C8]">{user.roleLabel}</p>
        </div>
        <div className="hidden lg:block">
          <GlowBadge icon={Sparkles}>active workspace</GlowBadge>
        </div>
      </div>

      <Link
        href={nextStep.href}
        className="hidden min-w-0 max-w-[38rem] flex-1 items-center justify-between rounded-2xl border border-[rgba(168,85,247,0.16)] bg-[rgba(255,255,255,0.04)] px-4 py-2.5 lg:flex"
      >
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#A855F7]">Следующий шаг</p>
          <p className="truncate text-sm font-semibold text-[#F4F0FF]">{nextStep.label}</p>
          <p className="truncate text-xs text-[#AFA8C8]">{nextStep.helper}</p>
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-[#C084FC]" />
      </Link>

      <div className="flex items-center gap-2 sm:gap-4">
        <NotificationBell />

        <div className="hidden items-center gap-3 rounded-2xl border border-[rgba(168,85,247,0.14)] bg-[rgba(255,255,255,0.04)] px-2.5 py-2 sm:flex">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7B2CFF] to-[#A855F7] text-sm font-bold text-white glow-purple">
            {user.avatarInitials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="truncate text-xs text-[#AFA8C8]">{user.roleLabel}</p>
          </div>
        </div>

        <button type="button" onClick={handleLogout} className="btn-ghost hidden gap-2 sm:inline-flex">
          <LogOut className="h-4 w-4" />
          Выход
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[rgba(168,85,247,0.25)] text-[#AFA8C8] sm:hidden"
          aria-label="Выйти"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
