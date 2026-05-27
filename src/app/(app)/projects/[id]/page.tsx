"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { taskStatusLabel } from "@/lib/labels";
import { mockProjects } from "@/data/mock";
import { useAppStore } from "@/store/useAppStore";

function getProjectProgress(total: number, completed: number) {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const tasks = useAppStore((state) => state.tasks);
  const projectStates = useAppStore((state) => state.projectStates);
  const joinProject = useAppStore((state) => state.joinProject);
  const setActiveChatMentor = useAppStore((state) => state.setActiveChatMentor);

  const project = mockProjects.find((item) => item.id === id);

  if (!project) {
    return (
      <div className="text-center">
        <p>Проект не найден</p>
        <Link href="/projects" className="btn-primary mt-4 inline-flex">К списку проектов</Link>
      </div>
    );
  }

  const projectTasks = tasks.filter((task) => task.projectId === id);
  const completed = projectTasks.filter((task) => task.status === "completed").length;
  const progress = getProjectProgress(projectTasks.length, completed);
  const joined = projectStates.some((state) => state.projectId === id && state.joined);

  return (
    <div className="mx-auto max-w-4xl space-y-6 overflow-x-hidden pb-8">
      <PageHeader title={project.title} description={project.description} />

      <GlassCard hover={false}>
        <p className="break-words text-sm text-[#AFA8C8]">{project.direction}</p>
        <p className="mt-2 break-words">{project.goal}</p>
        {project.mentorName && <p className="mt-2 break-words text-sm text-[#AFA8C8]">Куратор: {project.mentorName}</p>}
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-[#AFA8C8]">Прогресс</span>
            <span className="text-[#A855F7]">{progress}%</span>
          </div>
          <ProgressBar value={progress} />
        </div>
      </GlassCard>

      <GlassCard>
        <h2 className="font-semibold">Связанные задачи</h2>
        <ul className="mt-4 space-y-3">
          {projectTasks.map((task) => (
            <li key={task.id} className="rounded-xl border border-[rgba(168,85,247,0.12)] px-3 py-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="break-words font-medium">{task.title}</p>
                  <p className="break-words text-xs text-[#AFA8C8]">{taskStatusLabel[task.status]}</p>
                </div>
                <Link href={`/tasks/${task.id}`} className="btn-ghost text-center">
                  Открыть задачу
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </GlassCard>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {!joined && (
          <button type="button" className="btn-primary" onClick={() => joinProject(project.id)}>
            Присоединиться
          </button>
        )}
        {project.mentorId && (
          <Link
            href={`/messages?mentor=${project.mentorId}`}
            className="btn-ghost text-center"
            onClick={() => setActiveChatMentor(project.mentorId!)}
          >
            Написать наставнику
          </Link>
        )}
      </div>
    </div>
  );
}
