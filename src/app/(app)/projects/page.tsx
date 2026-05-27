"use client";

import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { mockProjects } from "@/data/mock";
import { useAppStore } from "@/store/useAppStore";

function getProjectProgress(total: number, completed: number) {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

function getProjectStatus(progress: number, joined: boolean) {
  if (!joined) return "Не начат";
  if (progress >= 100) return "Завершен";
  return progress > 0 ? "В процессе" : "Подключен";
}

export default function ProjectsPage() {
  const tasks = useAppStore((state) => state.tasks);
  const projectStates = useAppStore((state) => state.projectStates);
  const joinProject = useAppStore((state) => state.joinProject);

  return (
    <div className="page-wrap max-w-6xl space-y-5 overflow-x-hidden sm:space-y-6">
      <PageHeader
        title="Проекты"
        description="Проекты собирают задачи в связную работу. Так пользователь видит не отдельные экраны, а реальный кусок продукта или кейса."
      />

      <GlassCard hover={false}>
        <p className="break-words text-sm text-[#AFA8C8]">
          Проект — это надстройка над задачами. Сначала ты проходишь урок, затем берешь задачу, а проект помогает увидеть, как эти задачи складываются в цельную работу.
        </p>
      </GlassCard>

      <div className="grid gap-4 sm:grid-cols-2">
        {mockProjects.map((project) => {
          const projectTasks = tasks.filter((task) => task.projectId === project.id);
          const completed = projectTasks.filter((task) => task.status === "completed").length;
          const progress = getProjectProgress(projectTasks.length, completed);
          const joined = projectStates.some((state) => state.projectId === project.id && state.joined);
          const nextTask =
            projectTasks.find((task) => task.status === "submitted") ??
            projectTasks.find((task) => task.status === "in_progress") ??
            projectTasks.find((task) => task.status === "pending");

          return (
            <GlassCard key={project.id} hover className="min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <span className="text-xs uppercase tracking-[0.16em] text-[#A855F7]">{project.direction}</span>
                <span className="text-xs text-[#AFA8C8]">{getProjectStatus(progress, joined)}</span>
              </div>
              <h3 className="mt-2 break-words font-semibold">{project.title}</h3>
              <p className="mt-1 break-words text-sm text-[#AFA8C8]">{project.description}</p>
              <p className="mt-3 break-words text-sm text-[#F4F0FF]">{project.goal}</p>
              <p className="mt-2 break-words text-xs text-[#AFA8C8]">
                Выполнено задач: {completed}/{projectTasks.length}
              </p>

              <div className="mt-3 flex justify-between text-sm">
                <span className="text-[#AFA8C8]">Прогресс</span>
                <span className="font-semibold text-[#A855F7]">{progress}%</span>
              </div>
              <ProgressBar value={progress} size="sm" className="mt-2" />

              <div className="mt-4 rounded-2xl border border-[rgba(168,85,247,0.12)] bg-[rgba(255,255,255,0.025)] px-3 py-3 text-sm text-[#AFA8C8]">
                {nextTask ? (
                  <>
                    <p className="text-xs uppercase tracking-[0.16em] text-[#A855F7]">Следующая задача</p>
                    <p className="mt-1 break-words text-[#F4F0FF]">{nextTask.title}</p>
                  </>
                ) : (
                  <p className="break-words">Проект завершен. Можно переходить к следующему направлению или новому кейсу.</p>
                )}
              </div>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <Link href={`/projects/${project.id}`} className="btn-primary flex-1 text-center">
                  Открыть проект
                </Link>
                {!joined && (
                  <button type="button" className="btn-ghost flex-1" onClick={() => joinProject(project.id)}>
                    Присоединиться
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
