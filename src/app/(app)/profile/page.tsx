"use client";

import Link from "next/link";
import { Fingerprint, Pencil } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { mockCourses, mockProjects } from "@/data/mock";
import { lessonStatusLabel, taskStatusLabel } from "@/lib/labels";
import { useAppStore } from "@/store/useAppStore";

export default function ProfilePage() {
  const user = useAppStore((state) => state.user);
  const lessons = useAppStore((state) => state.lessons);
  const tasks = useAppStore((state) => state.tasks);
  const skillId = useAppStore((state) => state.skillId);
  const confirmedCases = useAppStore((state) => state.confirmedCases);
  const activities = useAppStore((state) => state.activities);
  const bookings = useAppStore((state) => state.bookings);
  const earnedSkills = useAppStore((state) => state.earnedSkills);
  const projectStates = useAppStore((state) => state.projectStates);
  const getSkillIdGrowth = useAppStore((state) => state.getSkillIdGrowth);

  const completedLessons = lessons.filter((lesson) => lesson.status === "completed");
  const activeTasks = tasks.filter((task) => task.status === "in_progress");
  const submittedTasks = tasks.filter((task) => task.status === "submitted");
  const completedTasks = tasks.filter((task) => task.status === "completed");
  const skillIdAvg = Math.round(skillId.reduce((sum, pillar) => sum + pillar.percent, 0) / skillId.length);
  const recentActivity = activities.slice(0, 6);
  const growth = getSkillIdGrowth();
  const myCourses = mockCourses
    .map((course) => {
      const courseLessons = lessons.filter((lesson) => lesson.courseId === course.id);
      const done = courseLessons.filter((lesson) => lesson.status === "completed").length;
      const progress = courseLessons.length > 0 ? Math.round((done / courseLessons.length) * 100) : 0;
      return { ...course, progress };
    })
    .filter((course) => course.progress > 0)
    .slice(0, 3);
  const myProjects = mockProjects
    .map((project) => {
      const projectTasks = tasks.filter((task) => task.projectId === project.id);
      const done = projectTasks.filter((task) => task.status === "completed").length;
      const progress = projectTasks.length > 0 ? Math.round((done / projectTasks.length) * 100) : 0;
      const joined = projectStates.some((state) => state.projectId === project.id && state.joined);
      return { ...project, progress, joined };
    })
    .filter((project) => project.joined || project.progress > 0)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-5xl space-y-6 overflow-x-hidden">
      <PageHeader title="Профиль" description="Ваш прогресс, подтверждённые кейсы и активность в SkillBarter MVP." />

      <GlassCard hover={false} className="!p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7B2CFF] to-[#A855F7] text-2xl font-bold glow-purple">
            {user.avatarInitials}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="break-words text-2xl font-bold">{user.name}</h2>
            <p className="text-[#A855F7]">{user.roleLabel}</p>
            <p className="mt-2 break-words text-sm text-[#AFA8C8]">{user.direction}</p>
            <p className="text-sm text-[#AFA8C8]">{user.city}</p>
            <p className="mt-1 text-xs text-[#AFA8C8]/80">В MVP с {new Date(user.joinedAt).toLocaleDateString("ru-RU")}</p>
          </div>
          <Link href="/settings" className="btn-primary shrink-0 gap-2">
            <Pencil className="h-4 w-4" />
            Редактировать профиль
          </Link>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Fingerprint className="h-5 w-5 text-[#A855F7]" />
            <h2 className="font-semibold">Skill ID Summary</h2>
          </div>
          <Link href="/skill-id" className="text-sm text-[#A855F7]">Подробнее →</Link>
        </div>
        <p className="mt-2 text-2xl font-bold">{skillIdAvg}%</p>
        <ProgressBar value={skillIdAvg} className="mt-2" size="sm" />
        <p className="mt-3 break-words text-sm text-[#AFA8C8]">
          Growth: {growth}% · навыков: {earnedSkills.length} · кейсов: {confirmedCases.length}
        </p>
      </GlassCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Ближайшие встречи</h2>
            <Link href="/mentors" className="text-sm text-[#A855F7]">Записаться</Link>
          </div>
          {bookings.length === 0 ? (
            <p className="text-sm text-[#AFA8C8]">Нет запланированных встреч с наставниками.</p>
          ) : (
            <ul className="space-y-2">
              {bookings.slice(0, 4).map((booking) => (
                <li key={booking.id} className="rounded-xl border border-[rgba(168,85,247,0.12)] px-3 py-2.5 text-sm">
                  <p className="break-words font-medium">{booking.topic}</p>
                  <p className="break-words text-[#AFA8C8]">{booking.mentorName} · {booking.date}, {booking.time}</p>
                </li>
              ))}
            </ul>
          )}
        </GlassCard>

        <GlassCard>
          <h2 className="font-semibold">Подтверждённые кейсы</h2>
          {confirmedCases.length === 0 ? (
            <p className="mt-4 text-sm text-[#AFA8C8]">Подтверждённые кейсы появятся после сдачи и проверки задач.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {confirmedCases.slice(0, 4).map((skillCase) => (
                <li key={skillCase.id} className="rounded-xl border border-[rgba(168,85,247,0.12)] px-3 py-2.5 text-sm">
                  <p className="break-words font-medium">{skillCase.title}</p>
                  <p className="break-words text-[#AFA8C8]">{skillCase.client}</p>
                </li>
              ))}
            </ul>
          )}
        </GlassCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Мои курсы</h2>
            <Link href="/courses" className="text-sm text-[#A855F7]">Все</Link>
          </div>
          <ul className="space-y-2">
            {myCourses.length === 0 ? (
              <p className="text-sm text-[#AFA8C8]">Курсы появятся после прохождения уроков.</p>
            ) : (
              myCourses.map((course) => (
                <li key={course.id}>
                  <Link href={`/courses/${course.id}`} className="break-words text-sm hover:text-[#A855F7]">
                    {course.title} · {course.progress}%
                  </Link>
                </li>
              ))
            )}
          </ul>
        </GlassCard>

        <GlassCard>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Мои проекты</h2>
            <Link href="/projects" className="text-sm text-[#A855F7]">Все</Link>
          </div>
          <ul className="space-y-2">
            {myProjects.length === 0 ? (
              <p className="text-sm text-[#AFA8C8]">Проекты появятся после присоединения.</p>
            ) : (
              myProjects.map((project) => (
                <li key={project.id}>
                  <Link href={`/projects/${project.id}`} className="break-words text-sm hover:text-[#A855F7]">
                    {project.title} · {project.progress}%
                  </Link>
                </li>
              ))
            )}
          </ul>
        </GlassCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <GlassCard>
          <h2 className="font-semibold">Активные задачи</h2>
          <ul className="mt-4 space-y-2">
            {activeTasks.length === 0 ? (
              <p className="text-sm text-[#AFA8C8]">Нет активных задач</p>
            ) : (
              activeTasks.map((task) => (
                <li key={task.id}>
                  <Link href={`/tasks/${task.id}`} className="break-words text-sm hover:text-[#A855F7]">
                    {task.title} · {taskStatusLabel[task.status]}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </GlassCard>

        <GlassCard>
          <h2 className="font-semibold">Задачи на проверке</h2>
          <ul className="mt-4 space-y-2">
            {submittedTasks.length === 0 ? (
              <p className="text-sm text-[#AFA8C8]">Нет задач на проверке</p>
            ) : (
              submittedTasks.map((task) => (
                <li key={task.id}>
                  <Link href={`/tasks/${task.id}`} className="break-words text-sm hover:text-[#A855F7]">
                    {task.title} · {taskStatusLabel[task.status]}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </GlassCard>

        <GlassCard>
          <h2 className="font-semibold">Завершённые задачи</h2>
          <ul className="mt-4 space-y-2">
            {completedTasks.length === 0 ? (
              <p className="text-sm text-[#AFA8C8]">Нет завершённых задач</p>
            ) : (
              completedTasks.map((task) => (
                <li key={task.id}>
                  <Link href={`/tasks/${task.id}`} className="break-words text-sm hover:text-[#A855F7]">
                    {task.title} · {taskStatusLabel[task.status]}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </GlassCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard>
          <h2 className="font-semibold">Завершённые уроки</h2>
          <ul className="mt-4 space-y-2">
            {completedLessons.map((lesson) => (
              <li key={lesson.id}>
                <Link href={`/lessons/${lesson.id}`} className="break-words text-sm hover:text-[#A855F7]">
                  {lesson.title} · {lessonStatusLabel[lesson.status]}
                </Link>
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard>
          <h2 className="font-semibold">Последняя активность</h2>
          <ul className="mt-4 space-y-3">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-[#AFA8C8]">Активность появится после уроков, задач и чатов.</p>
            ) : (
              recentActivity.map((activity) => (
                <li key={activity.id} className="text-sm">
                  <p className="break-words">{activity.text}</p>
                  <p className="text-xs text-[#AFA8C8]">{activity.time}</p>
                </li>
              ))
            )}
          </ul>
        </GlassCard>
      </div>
    </div>
  );
}
