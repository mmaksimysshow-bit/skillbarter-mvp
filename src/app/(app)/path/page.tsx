"use client";

import Link from "next/link";
import { BookOpen, Fingerprint, ListChecks } from "lucide-react";
import { LearningPath } from "@/components/path/LearningPath";
import { GlassCard } from "@/components/ui/GlassCard";
import { MotionPage, SectionTitle } from "@/components/ui/motion";
import { PageHeader } from "@/components/ui/PageHeader";
import { useAppStore } from "@/store/useAppStore";

export default function PathPage() {
  const lessons = useAppStore((state) => state.lessons);
  const tasks = useAppStore((state) => state.tasks);
  const earnedSkills = useAppStore((state) => state.earnedSkills);
  const confirmedCases = useAppStore((state) => state.confirmedCases);

  const nextLesson =
    lessons.find((lesson) => lesson.status === "in_progress") ??
    lessons.find((lesson) => lesson.status === "available");

  const nextTask =
    tasks.find((task) => task.status === "submitted") ??
    tasks.find((task) => task.status === "in_progress") ??
    tasks.find(
      (task) =>
        task.status === "pending" &&
        (!task.relatedLessonId || lessons.find((lesson) => lesson.id === task.relatedLessonId)?.status === "completed"),
    );

  return (
    <MotionPage className="page-wrap max-w-6xl space-y-5 sm:space-y-6">
      <PageHeader
        title="Мой путь"
        description="Здесь видно, что уже сделано, что откроется дальше и как каждый шаг влияет на Skill ID."
      />

      <LearningPath variant="full" />

      <div className="grid gap-4 lg:grid-cols-3">
        <GlassCard>
          <SectionTitle title="Следующий урок" description="ближайший учебный шаг" />
          <p className="mt-4 break-words font-semibold">{nextLesson?.title ?? "Все доступные уроки уже завершены"}</p>
          <p className="mt-2 break-words text-sm text-[#AFA8C8]">
            {nextLesson?.learningGoal ?? "Открой Skill ID или задачи, чтобы продолжить путь от практики к кейсу."}
          </p>
          <Link href={nextLesson ? `/lessons/${nextLesson.id}` : "/lessons"} className="btn-primary mt-4 inline-flex">
            <BookOpen className="h-4 w-4" />
            {nextLesson?.status === "in_progress" ? "Продолжить урок" : "Открыть урок"}
          </Link>
        </GlassCard>

        <GlassCard>
          <SectionTitle title="Следующая задача" description="практика, которая закрепит навык" />
          <p className="mt-4 break-words font-semibold">{nextTask?.title ?? "Задача откроется после следующего урока"}</p>
          <p className="mt-2 break-words text-sm text-[#AFA8C8]">
            {nextTask
              ? `Эта задача подтверждает навыки: ${nextTask.skills.join(", ")}.`
              : "Сначала закончи урок. После этого связанная задача станет доступной."}
          </p>
          <Link href={nextTask ? `/tasks/${nextTask.id}` : "/tasks"} className="btn-ghost mt-4 inline-flex">
            <ListChecks className="h-4 w-4" />
            Открыть задачу
          </Link>
        </GlassCard>

        <GlassCard>
          <SectionTitle title="Что попадёт в Skill ID" description="итог твоего маршрута" />
          <p className="mt-4 break-words text-sm text-[#AFA8C8]">
            Сейчас в профиле: {earnedSkills.length} навыков и {confirmedCases.length} подтверждённых кейсов.
          </p>
          <p className="mt-2 break-words text-sm text-[#AFA8C8]">
            Урок добавляет earned skill. Подтверждённая задача добавляет кейс, наставника и результат.
          </p>
          <Link href="/skill-id" className="btn-ghost mt-4 inline-flex">
            <Fingerprint className="h-4 w-4" />
            Открыть Skill ID
          </Link>
        </GlassCard>
      </div>
    </MotionPage>
  );
}
