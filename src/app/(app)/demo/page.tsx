"use client";

import Link from "next/link";
import { BookOpen, Calendar, Fingerprint, ListChecks, Sparkles } from "lucide-react";
import { LearningPath } from "@/components/path/LearningPath";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { EmptyState, GlowBadge, MotionPage, SectionTitle, StaggerGroup, StaggerItem } from "@/components/ui/motion";
import { mockCourses, mockProjects } from "@/data/mock";
import { taskStatusLabel } from "@/lib/labels";
import { useAppStore } from "@/store/useAppStore";

export default function DemoOverviewPage() {
  const user = useAppStore((state) => state.user);
  const lessons = useAppStore((state) => state.lessons);
  const tasks = useAppStore((state) => state.tasks);
  const skillId = useAppStore((state) => state.skillId);
  const earnedSkills = useAppStore((state) => state.earnedSkills);
  const confirmedCases = useAppStore((state) => state.confirmedCases);
  const activities = useAppStore((state) => state.activities);
  const bookings = useAppStore((state) => state.bookings);
  const getOverallProgress = useAppStore((state) => state.getOverallProgress);

  const overallProgress = getOverallProgress();
  const completedLessons = lessons.filter((lesson) => lesson.status === "completed");
  const activeLesson = lessons.find((lesson) => lesson.status === "in_progress");
  const nextLesson = activeLesson ?? lessons.find((lesson) => lesson.status === "available");
  const submittedTask = tasks.find((task) => task.status === "submitted");
  const activeTask = tasks.find((task) => task.status === "in_progress");
  const skillIdAvg =
    skillId.length > 0 ? Math.round(skillId.reduce((sum, pillar) => sum + pillar.percent, 0) / skillId.length) : 0;

  const activeCourses = mockCourses
    .map((course) => {
      const courseLessons = lessons.filter((lesson) => lesson.courseId === course.id);
      const done = courseLessons.filter((lesson) => lesson.status === "completed").length;
      const progress = courseLessons.length > 0 ? Math.round((done / courseLessons.length) * 100) : 0;
      return { ...course, progress };
    })
    .filter((course) => course.progress > 0 || course.id === nextLesson?.courseId)
    .slice(0, 2);

  const activeProjects = mockProjects
    .map((project) => {
      const projectTasks = tasks.filter((task) => task.projectId === project.id);
      const done = projectTasks.filter((task) => task.status === "completed").length;
      const progress = projectTasks.length > 0 ? Math.round((done / projectTasks.length) * 100) : 0;
      return { ...project, progress };
    })
    .filter(
      (project) =>
        project.progress > 0 ||
        project.taskIds.includes(activeTask?.id ?? "") ||
        project.taskIds.includes(submittedTask?.id ?? ""),
    )
    .slice(0, 2);

  return (
    <MotionPage className="page-wrap max-w-6xl space-y-5 sm:space-y-7">
      <PageHeader
        title={`Привет, ${(user.name || "пользователь").split(" ")[0]}`}
        description="SkillBarter — это путь от урока к задаче, от задачи к подтверждённому кейсу и дальше к Skill ID. Ниже всегда видно, что делать следующим шагом."
      />

      <div className="flex flex-wrap items-center gap-2">
        <GlowBadge icon={Sparkles}>route-first dashboard</GlowBadge>
        <GlowBadge>one clear next action</GlowBadge>
      </div>

      <LearningPath variant="compact" />

      <StaggerGroup className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Пройдено уроков", value: completedLessons.length, href: "/lessons" },
          { label: "Навыки", value: earnedSkills.length, href: "/skill-id" },
          { label: "Кейсы", value: confirmedCases.length, href: "/skill-id" },
          { label: "Общий прогресс", value: `${overallProgress}%`, href: "/path" },
        ].map((item) => (
          <StaggerItem key={item.label}>
            <Link href={item.href}>
              <GlassCard hover className="min-w-0 !p-4">
                <p className="break-words text-[11px] uppercase tracking-[0.16em] text-[#AFA8C8]">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold">{item.value}</p>
              </GlassCard>
            </Link>
          </StaggerItem>
        ))}
      </StaggerGroup>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <GlassCard>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Fingerprint className="h-5 w-5 text-[#A855F7]" />
              <h2 className="text-lg font-semibold">Почему это важно</h2>
            </div>
            <Link href="/skill-id" className="text-sm text-[#A855F7]">
              Открыть Skill ID →
            </Link>
          </div>
          <p className="mt-4 break-words text-sm text-[#AFA8C8]">
            Skill ID — это итог всей платформы. Уроки добавляют навыки, задачи превращают их в реальные результаты, а
            подтверждение наставника делает работу кейсом.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-[#AFA8C8]">Сила профиля</span>
                <span className="text-[#A855F7]">{skillIdAvg}%</span>
              </div>
              <ProgressBar value={skillIdAvg} size="sm" />
            </div>
            <div className="rounded-2xl border border-[rgba(168,85,247,0.12)] bg-[rgba(255,255,255,0.025)] px-4 py-3 text-sm text-[#AFA8C8]">
              {confirmedCases.length > 0
                ? `У тебя уже ${confirmedCases.length} подтверждённый кейс и ${earnedSkills.length} навыков в профиле.`
                : "Пока кейсов нет. Пройди урок и закрепи его задачей — тогда Skill ID начнёт заполняться автоматически."}
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <SectionTitle title="Следующие шаги" description="коротко и без лишних экранов" />
          <ul className="mt-4 space-y-3">
            <li className="rounded-2xl border border-[rgba(168,85,247,0.12)] px-4 py-3 text-sm">
              <p className="font-medium">1. Урок</p>
              <p className="mt-1 break-words text-[#AFA8C8]">
                {nextLesson ? `Следующий урок: ${nextLesson.title}` : "Все доступные уроки завершены."}
              </p>
            </li>
            <li className="rounded-2xl border border-[rgba(168,85,247,0.12)] px-4 py-3 text-sm">
              <p className="font-medium">2. Задача</p>
              <p className="mt-1 break-words text-[#AFA8C8]">
                {submittedTask
                  ? "Результат уже сдан. Осталось подтверждение."
                  : activeTask
                    ? `Текущая задача: ${activeTask.title}`
                    : "После урока откроется практическая задача."}
              </p>
            </li>
            <li className="rounded-2xl border border-[rgba(168,85,247,0.12)] px-4 py-3 text-sm">
              <p className="font-medium">3. Подтверждение</p>
              <p className="mt-1 break-words text-[#AFA8C8]">
                Подтверждённая задача превращается в кейс и усиливает твой Skill ID.
              </p>
            </li>
          </ul>
        </GlassCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-[#A855F7]" />
              <h2 className="font-semibold">Мой путь в обучении</h2>
            </div>
            <Link href="/path" className="text-sm text-[#A855F7]">
              Весь маршрут →
            </Link>
          </div>
          {nextLesson ? (
            <div className="space-y-3">
              <div className="rounded-2xl border border-[rgba(168,85,247,0.12)] px-4 py-4">
                <p className="text-xs uppercase tracking-[0.16em] text-[#A855F7]">Следующий урок</p>
                <p className="mt-2 break-words font-semibold">{nextLesson.title}</p>
                <p className="mt-2 break-words text-sm text-[#AFA8C8]">{nextLesson.learningGoal}</p>
                <Link href={`/lessons/${nextLesson.id}`} className="btn-primary mt-4 inline-flex">
                  {nextLesson.status === "in_progress" ? "Продолжить обучение" : "Начать первый урок"}
                </Link>
              </div>
            </div>
          ) : (
            <EmptyState
              title="База уже собрана"
              description="Открой задачи, подтверди кейсы или посмотри, как весь путь отразился в Skill ID."
            />
          )}
        </GlassCard>

        <GlassCard>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ListChecks className="h-5 w-5 text-[#A855F7]" />
              <h2 className="font-semibold">Практика и проверка</h2>
            </div>
            <Link href="/tasks" className="text-sm text-[#A855F7]">
              Все задачи →
            </Link>
          </div>
          {submittedTask || activeTask ? (
            <div className="space-y-3">
              {[submittedTask ?? activeTask].filter(Boolean).map((task) => (
                <Link
                  key={task!.id}
                  href={`/tasks/${task!.id}`}
                  className="block rounded-2xl border border-[rgba(168,85,247,0.12)] px-4 py-4"
                >
                  <p className="break-words font-semibold">{task!.title}</p>
                  <p className="mt-1 text-sm text-[#AFA8C8]">{taskStatusLabel[task!.status]}</p>
                  <p className="mt-2 break-words text-sm text-[#AFA8C8]">
                    {task!.status === "submitted"
                      ? "Результат уже отправлен. Остался шаг подтверждения."
                      : "Эта задача закрепляет урок и может стать кейсом в Skill ID."}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Пока нет активной задачи"
              description="Сначала пройди урок. После него откроется практическая задача, которую можно сдать наставнику."
            />
          )}
        </GlassCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <GlassCard>
          <SectionTitle title="Курсы" description="где брать базу" />
          {activeCourses.length === 0 ? (
            <p className="mt-4 text-sm text-[#AFA8C8]">Начни первый урок — и здесь появится активный курс с прогрессом.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {activeCourses.map((course) => (
                <li key={course.id}>
                  <Link href={`/courses/${course.id}`} className="block rounded-2xl border border-[rgba(168,85,247,0.12)] px-3 py-3 text-sm">
                    <span className="break-words">{course.title}</span>
                    <span className="mt-1 block text-xs text-[#AFA8C8]">{course.progress}%</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </GlassCard>

        <GlassCard>
          <SectionTitle title="Проекты" description="где задачи складываются в работу" />
          {activeProjects.length === 0 ? (
            <p className="mt-4 text-sm text-[#AFA8C8]">
              Когда возьмёшь задачу или присоединишься к проекту, здесь появится связанный прогресс.
            </p>
          ) : (
            <ul className="mt-4 space-y-2">
              {activeProjects.map((project) => (
                <li key={project.id}>
                  <Link href={`/projects/${project.id}`} className="block rounded-2xl border border-[rgba(168,85,247,0.12)] px-3 py-3 text-sm">
                    <span className="break-words">{project.title}</span>
                    <span className="mt-1 block text-xs text-[#AFA8C8]">{project.progress}%</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </GlassCard>

        <GlassCard>
          <div className="mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#A855F7]" />
            <h2 className="font-semibold">Встречи и поддержка</h2>
          </div>
          {bookings.length === 0 ? (
            <EmptyState
              title="Пока встреч нет"
              description="Если застрянешь на уроке или задаче, можно записаться к наставнику и разобрать работу по шагам."
              action={
                <Link href="/mentors" className="btn-ghost mt-4">
                  Открыть наставников
                </Link>
              }
            />
          ) : (
            <ul className="space-y-3">
              {bookings.slice(0, 3).map((booking) => (
                <li key={booking.id} className="rounded-2xl border border-[rgba(168,85,247,0.12)] px-3 py-3 text-sm">
                  <p className="break-words font-medium">{booking.topic}</p>
                  <p className="mt-1 break-words text-[#AFA8C8]">{booking.mentorName}</p>
                </li>
              ))}
            </ul>
          )}
        </GlassCard>
      </div>

      <GlassCard>
        <SectionTitle title="Последние действия" description="что уже произошло в твоём маршруте" />
        {activities.length === 0 ? (
          <EmptyState
            title="История появится после первого шага"
            description="Как только начнёшь урок или задачу, здесь будет видно движение по маршруту."
          />
        ) : (
          <ul className="mt-4 grid gap-3 lg:grid-cols-2">
            {activities.slice(0, 4).map((activity) => (
              <li
                key={activity.id}
                className="rounded-2xl border border-[rgba(168,85,247,0.08)] bg-[rgba(255,255,255,0.025)] px-4 py-4 text-sm"
              >
                <p className="break-words">{activity.text}</p>
                <p className="mt-2 text-xs text-[#AFA8C8]">{activity.time}</p>
              </li>
            ))}
          </ul>
        )}
      </GlassCard>
    </MotionPage>
  );
}
