"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, CircleDot, Fingerprint, GraduationCap, ListChecks, Route, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowBadge } from "@/components/ui/motion";
import { mockCourses } from "@/data/mock";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";

type Variant = "compact" | "full";

type Stage = {
  id: string;
  title: string;
  description: string;
  status: "done" | "active" | "locked";
  href?: string;
  actionLabel?: string;
};

function sortLessons<T extends { order: number }>(items: T[]) {
  return [...items].sort((left, right) => left.order - right.order);
}

function getStageIndex(stages: Stage[]) {
  const activeIndex = stages.findIndex((stage) => stage.status === "active");
  if (activeIndex >= 0) return activeIndex;
  const lastDone = stages.map((stage) => stage.status).lastIndexOf("done");
  return Math.max(lastDone, 0);
}

export function LearningPath({ variant = "compact" }: { variant?: Variant }) {
  const reduceMotion = useReducedMotion();
  const lessons = useAppStore((state) => state.lessons);
  const tasks = useAppStore((state) => state.tasks);
  const earnedSkills = useAppStore((state) => state.earnedSkills);
  const confirmedCases = useAppStore((state) => state.confirmedCases);

  const sortedLessons = sortLessons(lessons);
  const firstLesson = sortedLessons.find((lesson) => lesson.status === "available") ?? sortedLessons[0];
  const activeLesson = sortedLessons.find((lesson) => lesson.status === "in_progress");
  const latestCompletedLesson = [...sortedLessons]
    .filter((lesson) => lesson.status === "completed")
    .sort((left, right) => right.order - left.order)[0];

  const submittedTask = tasks.find((task) => task.status === "submitted");
  const inProgressTask = tasks.find((task) => task.status === "in_progress");
  const unlockedTask =
    tasks.find(
      (task) =>
        task.relatedLessonId &&
        lessons.find((lesson) => lesson.id === task.relatedLessonId)?.status === "completed" &&
        task.status === "pending",
    ) ?? tasks.find((task) => task.status === "pending");

  const relatedTask =
    submittedTask ??
    inProgressTask ??
    (latestCompletedLesson?.relatedTaskId ? tasks.find((task) => task.id === latestCompletedLesson.relatedTaskId) : undefined) ??
    unlockedTask;

  const currentCourse = mockCourses.find(
    (course) =>
      course.id === activeLesson?.courseId ||
      course.id === latestCompletedLesson?.courseId ||
      course.id === firstLesson?.courseId,
  );

  const primaryAction =
    submittedTask
      ? {
          label: "Подтвердить наставником",
          href: `/tasks/${submittedTask.id}`,
          helper: "Задача уже сдана. Остался финальный demo-шаг до подтверждённого кейса.",
        }
      : inProgressTask
        ? {
            label: "Продолжить задачу",
            href: `/tasks/${inProgressTask.id}`,
            helper: "Практика уже начата. Заверши задачу, чтобы отправить результат наставнику.",
          }
        : latestCompletedLesson?.relatedTaskId
          ? {
              label: "Перейти к задаче",
              href: `/tasks/${latestCompletedLesson.relatedTaskId}`,
              helper: "Урок завершён. Теперь закрепи навык практической задачей.",
            }
          : activeLesson
            ? {
                label: "Продолжить обучение",
                href: `/lessons/${activeLesson.id}`,
                helper: "Ты уже внутри урока. Дойди до мини-практики и открой задачу.",
              }
            : firstLesson
              ? {
                  label: "Начать первый урок",
                  href: `/lessons/${firstLesson.id}`,
                  helper: "Самый простой старт: урок даст базу и сразу откроет связанную задачу.",
                }
              : {
                  label: "Посмотреть Skill ID",
                  href: "/skill-id",
                  helper: "Путь уже собран. Проверь, как он отразился в профиле навыков.",
                };

  const stages: Stage[] = [
    {
      id: "direction",
      title: "Выбери направление",
      description: currentCourse
        ? `Сейчас твой путь идёт через курс «${currentCourse.title}».`
        : "Открой курсы и выбери, с какого направления хочешь начать.",
      status: activeLesson || latestCompletedLesson || relatedTask || confirmedCases.length > 0 ? "done" : "active",
      href: "/courses",
      actionLabel: "Открыть курсы",
    },
    {
      id: "lesson",
      title: "Пройди урок",
      description: activeLesson
        ? `Сейчас активен урок «${activeLesson.title}».`
        : latestCompletedLesson
          ? `Последний завершённый урок: «${latestCompletedLesson.title}».`
          : firstLesson
            ? `Первый доступный урок: «${firstLesson.title}».`
            : "Первый урок даст базу и подготовит к задаче.",
      status: activeLesson ? "active" : latestCompletedLesson ? "done" : "locked",
      href: activeLesson ? `/lessons/${activeLesson.id}` : firstLesson ? `/lessons/${firstLesson.id}` : "/lessons",
      actionLabel: activeLesson ? "Продолжить урок" : "Открыть уроки",
    },
    {
      id: "practice",
      title: "Сделай мини-практику",
      description: activeLesson
        ? "Внутри урока есть мини-практика и чек-лист. Они подготавливают к реальной задаче."
        : latestCompletedLesson
          ? "Мини-практика завершена вместе с уроком. Можно переходить к задаче."
          : "Мини-практика идёт внутри урока и делает задачу понятнее.",
      status: latestCompletedLesson ? "done" : activeLesson ? "active" : "locked",
      href: activeLesson ? `/lessons/${activeLesson.id}` : latestCompletedLesson ? `/lessons/${latestCompletedLesson.id}` : undefined,
      actionLabel: activeLesson ? "Вернуться в урок" : undefined,
    },
    {
      id: "task",
      title: "Возьми связанную задачу",
      description: relatedTask
        ? `Следующая задача: «${relatedTask.title}».`
        : "После завершения урока откроется связанная задача.",
      status: submittedTask || inProgressTask ? "done" : latestCompletedLesson && relatedTask ? "active" : "locked",
      href: relatedTask ? `/tasks/${relatedTask.id}` : "/tasks",
      actionLabel: relatedTask ? "Открыть задачу" : undefined,
    },
    {
      id: "review",
      title: "Сдай результат и отправь на проверку",
      description: submittedTask
        ? "Результат уже отправлен. В demo-логике можно сразу подтвердить его наставником."
        : inProgressTask
          ? "Когда закончишь работу, отправь ссылку и короткий комментарий."
          : "Здесь задача превращается из практики в реальный кейс.",
      status: submittedTask ? "active" : confirmedCases.length > 0 ? "done" : inProgressTask ? "active" : "locked",
      href: submittedTask ? `/tasks/${submittedTask.id}` : inProgressTask ? `/tasks/${inProgressTask.id}` : undefined,
      actionLabel: submittedTask ? "Подтвердить кейс" : inProgressTask ? "Сдать результат" : undefined,
    },
    {
      id: "case",
      title: "Получи подтверждённый кейс",
      description: confirmedCases.length > 0
        ? `У тебя уже ${confirmedCases.length} подтверждённ${confirmedCases.length > 1 ? "ых кейса" : "ый кейс"}.`
        : "После подтверждения задача становится кейсом с результатом, навыками и отзывом наставника.",
      status: confirmedCases.length > 0 ? "done" : submittedTask ? "active" : "locked",
      href: confirmedCases.length > 0 ? "/skill-id" : submittedTask ? `/tasks/${submittedTask.id}` : undefined,
      actionLabel: confirmedCases.length > 0 ? "Открыть кейс" : undefined,
    },
    {
      id: "skill-id",
      title: "Посмотри Skill ID",
      description: earnedSkills.length > 0
        ? "Здесь собираются навыки из уроков и кейсы из подтверждённых задач."
        : "Skill ID — это итог пути: не сертификат, а профиль с реальными доказательствами навыка.",
      status: confirmedCases.length > 0 ? "active" : earnedSkills.length > 0 ? "done" : "locked",
      href: "/skill-id",
      actionLabel: "Открыть Skill ID",
    },
  ];

  const stageIndex = getStageIndex(stages);
  const progressPercent = Math.round((stageIndex / (stages.length - 1)) * 100);
  const activeStage = stages.find((stage) => stage.status === "active") ?? stages[0];

  return (
    <GlassCard hover={false} className="relative overflow-hidden">
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#C084FC] to-transparent" />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <GlowBadge icon={Route}>interactive learning path</GlowBadge>
          <h2 className="mt-4 text-2xl font-semibold text-[#F7F3FF] sm:text-3xl">Твой путь к подтверждённому навыку</h2>
          <p className="mt-3 max-w-2xl break-words text-sm leading-relaxed text-[#AFA8C8] sm:text-base">
            SkillBarter работает как маршрут: урок даёт базу, мини-практика закрепляет материал, задача превращает навык
            в работу, а Skill ID собирает подтверждённый результат.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href={primaryAction.href} className="btn-primary relative overflow-hidden px-5 py-3">
              <span className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_42%)]" />
              <span className="relative flex items-center gap-2">
                {primaryAction.label}
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
            <p className="max-w-xl break-words text-sm text-[#AFA8C8]">{primaryAction.helper}</p>
          </div>
        </div>

        <div className="min-w-[220px] rounded-[1.4rem] border border-[rgba(168,85,247,0.16)] bg-[rgba(255,255,255,0.03)] p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-[#A855F7]">главный следующий шаг</p>
          <p className="mt-2 text-lg font-semibold">{activeStage.title}</p>
          <p className="mt-2 break-words text-sm text-[#AFA8C8]">{activeStage.description}</p>
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between text-xs text-[#AFA8C8]">
          <span>Маршрут пользователя</span>
          <span>{progressPercent}% пути уже открыто</span>
        </div>
        <div className="relative h-2 overflow-hidden rounded-full bg-[rgba(255,255,255,0.08)]">
          <motion.div
            initial={reduceMotion ? false : { width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="absolute inset-y-0 left-0 rounded-full bg-[linear-gradient(90deg,#7B2CFF,#C084FC)] shadow-[0_0_20px_rgba(123,44,255,0.35)]"
          />
        </div>
      </div>

      <div className={cn("mt-6 grid gap-3", variant === "compact" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1")}>
        {stages.map((stage, index) => {
          const active = stage.status === "active";
          const done = stage.status === "done";

          return (
            <motion.div
              key={stage.id}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.04, ease: "easeOut" }}
              className={cn(
                "group relative overflow-hidden rounded-[1.45rem] border px-4 py-4 transition-all duration-300",
                active
                  ? "border-[rgba(192,132,252,0.36)] bg-[linear-gradient(160deg,rgba(45,24,89,0.78),rgba(12,8,32,0.8))] shadow-[0_18px_60px_rgba(36,14,74,0.35)]"
                  : done
                    ? "border-[rgba(168,85,247,0.18)] bg-[rgba(255,255,255,0.03)]"
                    : "border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)]",
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border",
                    active
                      ? "border-[rgba(192,132,252,0.4)] bg-[rgba(123,44,255,0.2)] text-[#F4F0FF]"
                      : done
                        ? "border-[rgba(52,211,153,0.35)] bg-[rgba(16,185,129,0.12)] text-[#A7F3D0]"
                        : "border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] text-[#AFA8C8]",
                  )}
                >
                  {done ? <CheckCircle2 className="h-5 w-5" /> : active ? <CircleDot className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs uppercase tracking-[0.16em] text-[#AFA8C8]">Шаг {index + 1}</span>
                    {active && <span className="rounded-full bg-[rgba(123,44,255,0.18)] px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-[#D8C4FF]">сейчас</span>}
                    {done && <span className="rounded-full bg-[rgba(16,185,129,0.12)] px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-[#A7F3D0]">готово</span>}
                  </div>
                  <h3 className="mt-1 break-words font-semibold">{stage.title}</h3>
                  <p className="mt-2 break-words text-sm text-[#AFA8C8]">{stage.description}</p>
                  {stage.href && stage.actionLabel && (
                    <Link
                      href={stage.href}
                      className={cn(
                        "mt-4 inline-flex items-center gap-2 text-sm transition-colors",
                        active || done ? "text-[#C084FC] hover:text-[#F4F0FF]" : "text-[#8D87A9] hover:text-[#CFC7E8]",
                      )}
                    >
                      {stage.actionLabel}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {variant === "full" && (
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <div className="rounded-[1.4rem] border border-[rgba(168,85,247,0.12)] bg-[rgba(255,255,255,0.025)] p-4">
            <div className="flex items-center gap-2 text-[#A855F7]">
              <GraduationCap className="h-4 w-4" />
              <p className="text-sm font-medium">Текущий курс</p>
            </div>
            <p className="mt-3 break-words font-semibold">{currentCourse?.title ?? "Курс будет выбран после первого старта"}</p>
            <p className="mt-2 break-words text-sm text-[#AFA8C8]">
              {currentCourse?.description ?? "Открой любой стартовый урок, и маршрут автоматически подхватит подходящее направление."}
            </p>
          </div>

          <div className="rounded-[1.4rem] border border-[rgba(168,85,247,0.12)] bg-[rgba(255,255,255,0.025)] p-4">
            <div className="flex items-center gap-2 text-[#A855F7]">
              <ListChecks className="h-4 w-4" />
              <p className="text-sm font-medium">Следующая задача</p>
            </div>
            <p className="mt-3 break-words font-semibold">{relatedTask?.title ?? "Откроется после первого урока"}</p>
            <p className="mt-2 break-words text-sm text-[#AFA8C8]">
              {relatedTask
                ? `Эта задача закрепляет навык: ${relatedTask.skills.join(", ")}.`
                : "Сначала пройди урок. После этого появится практическая задача, и путь станет линейным."}
            </p>
          </div>

          <div className="rounded-[1.4rem] border border-[rgba(168,85,247,0.12)] bg-[rgba(255,255,255,0.025)] p-4">
            <div className="flex items-center gap-2 text-[#A855F7]">
              <Fingerprint className="h-4 w-4" />
              <p className="text-sm font-medium">Влияние на Skill ID</p>
            </div>
            <p className="mt-3 break-words font-semibold">
              {confirmedCases.length > 0 ? "Навыки и кейсы уже подтверждаются в профиле." : "После подтверждения задача станет кейсом в Skill ID."}
            </p>
            <p className="mt-2 break-words text-sm text-[#AFA8C8]">
              Урок добавляет earned skill. Подтверждённая задача добавляет кейс, отзыв наставника и усиливает цифровой профиль навыков.
            </p>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
