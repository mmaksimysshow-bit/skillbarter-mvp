"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, BookOpen } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { lessonCategories, mockCourses } from "@/data/mock";
import { lessonStatusLabel } from "@/lib/labels";
import { formatDuration, cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";

function getLessonCta(status: string) {
  if (status === "completed") return "Открыть урок";
  if (status === "in_progress") return "Продолжить";
  return "Начать урок";
}

export default function LessonsPage() {
  const lessons = useAppStore((state) => state.lessons);
  const tasks = useAppStore((state) => state.tasks);
  const [category, setCategory] = useState("Все");

  const filteredLessons = useMemo(
    () => (category === "Все" ? lessons : lessons.filter((lesson) => lesson.category === category)),
    [category, lessons],
  );

  return (
    <div className="page-wrap max-w-6xl space-y-5 sm:space-y-6">
      <PageHeader
        title="Уроки"
        description="Уроки дают базу. После каждого урока открывается практическая задача, которая может стать кейсом в Skill ID."
      />

      <GlassCard hover={false}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-[#A855F7]">
              <BookOpen className="h-4 w-4" />
              <p className="text-sm font-medium">Как работать с уроками</p>
            </div>
            <p className="mt-3 break-words text-sm text-[#AFA8C8]">
              Не нужно проходить все подряд. Начни с первого доступного урока: внутри будет короткая теория, пример, мини-практика и связанная задача, которая закрепит навык.
            </p>
          </div>
          <Link href="/path" className="btn-ghost">
            Мой путь
          </Link>
        </div>
      </GlassCard>

      <div className="-mx-0.5 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
        {lessonCategories.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            className={cn(
              "filter-chip transition-colors",
              category === item
                ? "bg-[#7B2CFF] text-white glow-purple"
                : "border border-[rgba(168,85,247,0.25)] text-[#AFA8C8]",
            )}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
        {filteredLessons.map((lesson) => {
          const course = mockCourses.find((item) => item.id === lesson.courseId);
          const relatedTask = tasks.find((task) => task.id === lesson.relatedTaskId);

          return (
            <GlassCard key={lesson.id} hover className="flex min-w-0 flex-col">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <span className="text-xs font-medium uppercase tracking-[0.16em] text-[#A855F7]">{lesson.category}</span>
                <span className="text-xs text-[#AFA8C8]">{lessonStatusLabel[lesson.status]}</span>
              </div>

              <h3 className="mt-2 break-words font-semibold">{lesson.title}</h3>
              <p className="mt-1 break-words text-sm text-[#CFC7E8]">{lesson.subtitle}</p>

              <div className="mt-4 grid gap-2 text-xs text-[#AFA8C8]">
                <p className="break-words">Курс: {course?.title ?? "Индивидуальный модуль"}</p>
                <p className="break-words">Зачем это: {lesson.whyItMatters}</p>
                <p>Время: {formatDuration(lesson.durationMin)} · {lesson.level}</p>
                <p className="break-words">Навык: {lesson.skillName ?? "Навык появится после завершения"}</p>
                <p className="break-words">Откроет задачу: {relatedTask?.title ?? "Связанная задача появится позже"}</p>
              </div>

              <div className="mt-4">
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-[#AFA8C8]">Прогресс</span>
                  <span>{lesson.progress}%</span>
                </div>
                <ProgressBar value={lesson.progress} size="sm" />
              </div>

              {lesson.status === "locked" ? (
                <div className="mt-4 rounded-2xl border border-[rgba(168,85,247,0.16)] bg-[rgba(10,6,32,0.78)] px-3 py-3 text-sm text-[#AFA8C8]">
                  Завершите предыдущий урок, чтобы открыть этот.
                </div>
              ) : (
                <div className="mt-4 rounded-2xl border border-[rgba(168,85,247,0.12)] bg-[rgba(255,255,255,0.025)] px-3 py-3 text-sm text-[#AFA8C8]">
                  {lesson.learningGoal}
                </div>
              )}

              <Link
                href={`/lessons/${lesson.id}`}
                className={cn(
                  "btn-primary mt-4 flex w-full items-center justify-center gap-2 text-center",
                  lesson.status === "locked" && "pointer-events-none opacity-50",
                )}
                aria-disabled={lesson.status === "locked"}
              >
                {getLessonCta(lesson.status)}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
