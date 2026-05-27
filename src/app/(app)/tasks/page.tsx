"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, BriefcaseBusiness } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { taskCategories } from "@/data/mock";
import { taskStatusLabel } from "@/lib/labels";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import type { TaskStatus } from "@/types";

const statusFilters: Array<"Все" | TaskStatus> = ["Все", "pending", "in_progress", "submitted", "completed"];

export default function TasksPage() {
  const tasks = useAppStore((state) => state.tasks);
  const lessons = useAppStore((state) => state.lessons);
  const takeTask = useAppStore((state) => state.takeTask);
  const [category, setCategory] = useState("Все");
  const [status, setStatus] = useState<"Все" | TaskStatus>("Все");

  const filtered = useMemo(() => {
    return tasks.filter((task) => {
      const categoryMatch = category === "Все" || task.category === category;
      const statusMatch = status === "Все" || task.status === status;
      return categoryMatch && statusMatch;
    });
  }, [category, status, tasks]);

  return (
    <div className="page-wrap max-w-6xl space-y-5 sm:space-y-6">
      <PageHeader
        title="Задачи"
        description="Задачи — это способ доказать навык. Выполненная и подтвержденная задача становится кейсом в Skill ID."
      />

      <GlassCard hover={false}>
        <div className="flex items-start gap-3">
          <BriefcaseBusiness className="mt-0.5 h-5 w-5 shrink-0 text-[#A855F7]" />
          <p className="break-words text-sm text-[#AFA8C8]">
            Открыть задачу можно и заранее, но лучший путь такой: сначала пройди связанный урок, потом возьми задачу и сдай результат наставнику.
          </p>
        </div>
      </GlassCard>

      <div className="space-y-3">
        <div className="-mx-0.5 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
          {statusFilters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setStatus(item)}
              className={cn(
                "filter-chip",
                status === item ? "bg-[#7B2CFF] text-white" : "border border-[rgba(168,85,247,0.25)] text-[#AFA8C8]",
              )}
            >
              {item === "Все" ? "Все" : taskStatusLabel[item]}
            </button>
          ))}
        </div>

        <div className="-mx-0.5 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
          {taskCategories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={cn(
                "filter-chip",
                category === item
                  ? "bg-[rgba(123,44,255,0.3)] text-[#F4F0FF]"
                  : "border border-[rgba(168,85,247,0.25)] text-[#AFA8C8]",
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
        {filtered.map((task) => {
          const relatedLesson = task.relatedLessonId ? lessons.find((lesson) => lesson.id === task.relatedLessonId) : undefined;
          const recommendedFirst = relatedLesson && relatedLesson.status !== "completed";
          const canTake = !recommendedFirst && task.status === "pending";

          return (
            <GlassCard key={task.id} hover className="flex min-w-0 flex-col">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <span className="text-xs uppercase tracking-[0.16em] text-[#A855F7]">{task.category}</span>
                <span className="text-xs text-[#AFA8C8]">{taskStatusLabel[task.status]}</span>
              </div>

              <h3 className="mt-2 break-words font-semibold">{task.title}</h3>
              <p className="mt-2 break-words text-sm text-[#AFA8C8]">{task.description}</p>

              <div className="mt-4 grid gap-2 text-xs text-[#AFA8C8]">
                <p className="break-words">Для кого: {task.client}</p>
                <p className="break-words">Что сделать: {task.goal}</p>
                <p className="break-words">Подтвердит навык: {task.skills.join(", ")}</p>
                <p className="break-words">После урока: {relatedLesson?.title ?? "Можно открыть как отдельную практику"}</p>
                <p>Сложность: {task.difficulty}</p>
                <p className="break-words">Пример результата: {task.exampleResult}</p>
              </div>

              {recommendedFirst && (
                <div className="mt-4 rounded-2xl border border-[rgba(168,85,247,0.16)] bg-[rgba(10,6,32,0.78)] px-3 py-3 text-sm text-[#AFA8C8]">
                  Лучше сначала пройти урок «{relatedLesson.title}», чтобы задача стала понятнее и легче превратилась в кейс.
                </div>
              )}

              <div className="mt-4 flex w-full flex-col gap-2">
                <Link href={`/tasks/${task.id}`} className="btn-primary w-full justify-center gap-2 text-center">
                  Открыть задачу
                  <ArrowRight className="h-4 w-4" />
                </Link>
                {task.status === "pending" && (
                  <button
                    type="button"
                    className="btn-ghost w-full disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() => takeTask(task.id)}
                    disabled={!canTake}
                  >
                    {recommendedFirst ? "Сначала пройти урок" : "Взять задачу"}
                  </button>
                )}
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
