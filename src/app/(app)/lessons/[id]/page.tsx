"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, MessageCircle, PlayCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { getMentorById, mockCourses } from "@/data/mock";
import { lessonStatusLabel } from "@/lib/labels";
import { formatDuration, cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";

const lessonFlow = [
  { id: "goal", label: "Цель" },
  { id: "theory", label: "Теория" },
  { id: "practice", label: "Практика" },
  { id: "review", label: "Проверка" },
  { id: "task", label: "Задача" },
] as const;

const sectionFlow = [
  "goal",
  "theory",
  "example",
  "steps",
  "practice",
  "checklist",
  "quiz",
  "task",
] as const;

export default function LessonDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const lessons = useAppStore((state) => state.lessons);
  const tasks = useAppStore((state) => state.tasks);
  const startLesson = useAppStore((state) => state.startLesson);
  const completeLesson = useAppStore((state) => state.completeLesson);
  const setActiveChatMentor = useAppStore((state) => state.setActiveChatMentor);
  const lesson = lessons.find((item) => item.id === id);

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [checkedChecklist, setCheckedChecklist] = useState<string[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});

  const mentor = lesson ? getMentorById(lesson.mentorId) : undefined;
  const course = lesson?.courseId ? mockCourses.find((item) => item.id === lesson.courseId) : undefined;
  const relatedTask = lesson?.relatedTaskId ? tasks.find((item) => item.id === lesson.relatedTaskId) : undefined;

  const currentSection = sectionFlow[currentSectionIndex];
  const flowIndex = currentSectionIndex <= 0 ? 0 : currentSectionIndex <= 2 ? 1 : currentSectionIndex <= 4 ? 2 : currentSectionIndex <= 6 ? 3 : 4;
  const allChecklistDone = lesson ? checkedChecklist.length === lesson.checklist.length : false;
  const allQuizAnswered = lesson ? lesson.miniQuiz.every((_, index) => typeof selectedAnswers[index] === "number") : false;

  const canComplete = useMemo(() => {
    if (!lesson || lesson.status === "locked" || lesson.status === "completed") return false;
    return currentSection === "task" && allChecklistDone && allQuizAnswered;
  }, [allChecklistDone, allQuizAnswered, currentSection, lesson]);

  if (!lesson) {
    return (
      <div className="page-wrap max-w-3xl text-center">
        <p>Урок не найден</p>
        <Link href="/lessons" className="btn-primary mt-4 inline-flex">
          К каталогу уроков
        </Link>
      </div>
    );
  }

  const nextSection = () => setCurrentSectionIndex((current) => Math.min(current + 1, sectionFlow.length - 1));
  const prevSection = () => setCurrentSectionIndex((current) => Math.max(current - 1, 0));

  return (
    <div className="page-wrap mx-auto max-w-4xl space-y-5 overflow-x-hidden pb-8 sm:space-y-6">
      <PageHeader title={lesson.title} description={lesson.subtitle} />

      <GlassCard hover={false}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.16em] text-[#A855F7]">{lesson.category}</p>
            <p className="break-words text-sm text-[#CFC7E8]">{lesson.shortDescription}</p>
          </div>
          <span className="rounded-full border border-[rgba(168,85,247,0.18)] px-3 py-1 text-xs text-[#F4F0FF]">
            {lessonStatusLabel[lesson.status]}
          </span>
        </div>

        <div className="mt-4 grid gap-2 text-sm text-[#AFA8C8] sm:grid-cols-2 lg:grid-cols-3">
          <p className="break-words">Курс: {course?.title ?? "Индивидуальный модуль"}</p>
          <p>Наставник: {mentor?.name ?? "Назначается автоматически"}</p>
          <p>{formatDuration(lesson.durationMin)} · {lesson.level}</p>
        </div>

        <div className="mt-5">
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-[#AFA8C8]">Прогресс урока</span>
            <span>{lesson.progress}%</span>
          </div>
          <ProgressBar value={lesson.progress} />
        </div>

        <div className="mt-6 grid gap-2 sm:grid-cols-5">
          {lessonFlow.map((step, index) => {
            const isDone = flowIndex > index;
            const isCurrent = flowIndex === index;
            return (
              <div
                key={step.id}
                className={cn(
                  "rounded-2xl border px-3 py-3 text-center text-xs transition-all",
                  isCurrent
                    ? "border-[rgba(192,132,252,0.36)] bg-[rgba(123,44,255,0.12)] text-[#F4F0FF]"
                    : isDone
                      ? "border-[rgba(16,185,129,0.2)] bg-[rgba(16,185,129,0.08)] text-[#A7F3D0]"
                      : "border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] text-[#AFA8C8]",
                )}
              >
                {step.label}
              </div>
            );
          })}
        </div>
      </GlassCard>

      <GlassCard>
        {currentSection === "goal" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">1. Цель урока</h2>
            <p className="break-words text-sm text-[#AFA8C8]">{lesson.learningGoal}</p>
            <div className="rounded-2xl border border-[rgba(168,85,247,0.16)] bg-[rgba(10,6,32,0.78)] px-4 py-4">
              <p className="text-sm text-[#A855F7]">Почему это важно</p>
              <p className="mt-2 break-words text-sm text-[#F4F0FF]">{lesson.whyItMatters}</p>
            </div>
          </div>
        )}

        {currentSection === "theory" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">2. Короткая теория</h2>
            {lesson.theoryBlocks.map((block) => (
              <div key={block.title} className="rounded-2xl border border-[rgba(168,85,247,0.12)] bg-[rgba(255,255,255,0.025)] px-4 py-4">
                <h3 className="font-medium">{block.title}</h3>
                <p className="mt-2 break-words text-sm text-[#AFA8C8]">{block.text}</p>
                <ul className="mt-3 space-y-2 text-sm text-[#CFC7E8]">
                  {block.keyPoints.map((point) => (
                    <li key={point} className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#A855F7]" />
                      <span className="break-words">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {currentSection === "example" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">3. Пример</h2>
            <p className="text-sm text-[#A855F7]">{lesson.exampleBlock.title}</p>
            <p className="break-words text-sm text-[#AFA8C8]">{lesson.exampleBlock.situation}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] px-4 py-4">
                <p className="text-xs uppercase text-[#F472B6]">Плохо</p>
                <p className="mt-2 break-words text-sm text-[#F4F0FF]">{lesson.exampleBlock.badExample}</p>
              </div>
              <div className="rounded-2xl border border-[rgba(168,85,247,0.18)] bg-[rgba(123,44,255,0.08)] px-4 py-4">
                <p className="text-xs uppercase text-[#A855F7]">Хорошо</p>
                <p className="mt-2 break-words text-sm text-[#F4F0FF]">{lesson.exampleBlock.goodExample}</p>
              </div>
            </div>
            <p className="break-words text-sm text-[#AFA8C8]">{lesson.exampleBlock.explanation}</p>
          </div>
        )}

        {currentSection === "steps" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">4. Пошаговый план</h2>
            <ol className="space-y-3">
              {lesson.stepByStep.map((item, index) => (
                <li key={item.title} className="rounded-2xl border border-[rgba(168,85,247,0.12)] px-4 py-4">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[rgba(123,44,255,0.16)] text-sm text-[#C084FC]">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <h3 className="break-words font-medium">{item.title}</h3>
                      <p className="mt-1 break-words text-sm text-[#AFA8C8]">{item.description}</p>
                      <p className="mt-2 break-words text-sm text-[#F4F0FF]">Действие: {item.action}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}

        {currentSection === "practice" && (
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">5. Мини-практика</h2>
              <p className="font-medium">{lesson.miniPractice.title}</p>
              <p className="break-words text-sm text-[#AFA8C8]">{lesson.miniPractice.description}</p>
              <p className="break-words text-sm text-[#F4F0FF]">Что сдаешь: {lesson.miniPractice.deliverable}</p>
              <p className="text-sm text-[#A855F7]">Оценка времени: {lesson.miniPractice.timeEstimate}</p>
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Частые ошибки</h2>
              <ul className="space-y-2">
                {lesson.commonMistakes.map((item) => (
                  <li key={item} className="break-words rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] px-4 py-3 text-sm text-[#AFA8C8]">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {currentSection === "checklist" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">6. Чек-лист</h2>
            <p className="break-words text-sm text-[#AFA8C8]">
              Пройди по пунктам перед завершением урока. Когда все отмечено, можно переходить к мини-тесту и связанной задаче.
            </p>
            <ul className="space-y-3">
              {lesson.checklist.map((item) => {
                const checked = checkedChecklist.includes(item);
                return (
                  <li key={item}>
                    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[rgba(168,85,247,0.12)] px-4 py-3">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          setCheckedChecklist((current) =>
                            checked ? current.filter((value) => value !== item) : [...current, item],
                          )
                        }
                        className="mt-1 h-4 w-4 accent-[#7B2CFF]"
                      />
                      <span className="break-words text-sm text-[#F4F0FF]">{item}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {currentSection === "quiz" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">7. Мини-тест</h2>
            <div className="space-y-4">
              {lesson.miniQuiz.map((item, index) => {
                const selected = selectedAnswers[index];
                const answered = typeof selected === "number";
                const isCorrect = selected === item.correctIndex;

                return (
                  <div key={item.question} className="rounded-2xl border border-[rgba(168,85,247,0.12)] px-4 py-4">
                    <p className="break-words font-medium">{item.question}</p>
                    <div className="mt-3 space-y-2">
                      {item.options.map((option, optionIndex) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setSelectedAnswers((current) => ({ ...current, [index]: optionIndex }))}
                          className={`w-full rounded-2xl border px-3 py-3 text-left text-sm transition ${
                            selected === optionIndex
                              ? "border-[rgba(168,85,247,0.45)] bg-[rgba(123,44,255,0.12)] text-white"
                              : "border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] text-[#CFC7E8]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    {answered && (
                      <p className={cn("mt-3 break-words text-sm", isCorrect ? "text-[#A7F3D0]" : "text-[#F4B8D8]")}>
                        {item.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {currentSection === "task" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">8. Связанная задача</h2>
            {relatedTask ? (
              <div className="rounded-2xl border border-[rgba(168,85,247,0.12)] px-4 py-4">
                <p className="break-words font-semibold">{relatedTask.title}</p>
                <p className="mt-2 break-words text-sm text-[#AFA8C8]">{relatedTask.description}</p>
                <p className="mt-3 break-words text-sm text-[#F4F0FF]">После подтверждения в Skill ID попадут навыки: {relatedTask.skills.join(", ")}</p>
                <Link href={`/tasks/${relatedTask.id}`} className="btn-primary mt-4 inline-flex">
                  Закрепить задачей
                </Link>
              </div>
            ) : (
              <p className="text-sm text-[#AFA8C8]">Для этого урока задача появится позже.</p>
            )}
            <div className="rounded-2xl border border-[rgba(168,85,247,0.12)] bg-[rgba(255,255,255,0.025)] px-4 py-4">
              <p className="text-sm text-[#AFA8C8]">Результат после урока</p>
              <p className="mt-2 break-words text-sm text-[#F4F0FF]">{lesson.resultAfterLesson}</p>
            </div>
          </div>
        )}
      </GlassCard>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {lesson.status !== "completed" && (
          <button
            type="button"
            className="btn-primary"
            disabled={lesson.status === "locked"}
            onClick={() => startLesson(lesson.id)}
          >
            <PlayCircle className="h-4 w-4" />
            {lesson.status === "in_progress" ? "Продолжить обучение" : "Начать обучение"}
          </button>
        )}

        {currentSectionIndex > 0 && (
          <button type="button" className="btn-ghost" onClick={prevSection}>
            <ArrowLeft className="h-4 w-4" />
            Предыдущий блок
          </button>
        )}

        {currentSectionIndex < sectionFlow.length - 1 && (
          <button type="button" className="btn-ghost" onClick={nextSection}>
            Следующий блок
            <ArrowRight className="h-4 w-4" />
          </button>
        )}

        <button
          type="button"
          className="btn-ghost"
          disabled={!canComplete}
          onClick={() => completeLesson(lesson.id)}
        >
          <CheckCircle2 className="h-4 w-4" />
          {lesson.status === "completed" ? "Урок завершен" : "Завершить урок"}
        </button>

        {lesson.relatedTaskId && (
          <Link href={`/tasks/${lesson.relatedTaskId}`} className="btn-ghost text-center">
            Закрепить задачей
          </Link>
        )}

        {lesson.mentorId && (
          <Link
            href={`/messages?mentor=${lesson.mentorId}`}
            className="btn-ghost text-center"
            onClick={() => setActiveChatMentor(lesson.mentorId)}
          >
            <MessageCircle className="h-4 w-4" />
            Написать наставнику
          </Link>
        )}
      </div>
    </div>
  );
}
