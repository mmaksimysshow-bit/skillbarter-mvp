"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { getMentorById, mockCourses } from "@/data/mock";
import { lessonStatusLabel } from "@/lib/labels";
import { useAppStore } from "@/store/useAppStore";

function getCourseProgress(total: number, completed: number) {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

export default function CourseDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const lessons = useAppStore((state) => state.lessons);
  const tasks = useAppStore((state) => state.tasks);

  const course = mockCourses.find((item) => item.id === id);
  const courseLessons = lessons.filter((lesson) => lesson.courseId === id).sort((left, right) => left.order - right.order);

  if (!course) {
    return (
      <div className="page-wrap max-w-3xl text-center">
        <p>Курс не найден</p>
        <Link href="/courses" className="btn-primary mt-4 inline-flex">
          К списку курсов
        </Link>
      </div>
    );
  }

  const completedLessons = courseLessons.filter((lesson) => lesson.status === "completed").length;
  const progress = getCourseProgress(courseLessons.length, completedLessons);
  const mentor = course.mentorId ? getMentorById(course.mentorId) : undefined;
  const recommendedTask = course.recommendedTaskId ? tasks.find((task) => task.id === course.recommendedTaskId) : undefined;

  return (
    <div className="page-wrap mx-auto max-w-4xl space-y-5 overflow-x-hidden pb-8 sm:space-y-6">
      <PageHeader title={course.title} description={course.description} />

      <GlassCard hover={false}>
        <div className="flex flex-wrap gap-3 text-sm text-[#AFA8C8]">
          <span>{course.direction}</span>
          <span>·</span>
          <span>{course.level}</span>
          <span>·</span>
          <span>{courseLessons.length} уроков</span>
        </div>
        {mentor && (
          <p className="mt-2 break-words text-sm">
            Наставник курса: <span className="text-[#A855F7]">{mentor.name}</span>
          </p>
        )}
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-[#AFA8C8]">Прогресс курса</span>
            <span className="text-[#A855F7]">{progress}%</span>
          </div>
          <ProgressBar value={progress} />
        </div>
      </GlassCard>

      <GlassCard>
        <h2 className="font-semibold">Уроки курса</h2>
        <ul className="mt-4 space-y-3">
          {courseLessons.map((lesson) => (
            <li key={lesson.id} className="rounded-2xl border border-[rgba(168,85,247,0.12)] px-4 py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="break-words font-medium">{lesson.title}</p>
                  <p className="mt-1 break-words text-sm text-[#AFA8C8]">{lesson.subtitle}</p>
                  <p className="mt-2 break-words text-xs text-[#A855F7]">{lessonStatusLabel[lesson.status]} · {lesson.level}</p>
                  {lesson.status === "locked" && (
                    <p className="mt-2 break-words text-xs text-[#AFA8C8]">
                      Завершите предыдущий урок, чтобы открыть этот блок курса.
                    </p>
                  )}
                </div>
                <Link
                  href={`/lessons/${lesson.id}`}
                  className={`btn-ghost text-center ${lesson.status === "locked" ? "pointer-events-none opacity-50" : ""}`}
                  aria-disabled={lesson.status === "locked"}
                >
                  Открыть урок
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </GlassCard>

      {recommendedTask && (
        <GlassCard>
          <h2 className="font-semibold">Рекомендуемая задача после курса</h2>
          <p className="mt-3 break-words text-sm text-[#F4F0FF]">{recommendedTask.title}</p>
          <p className="mt-2 break-words text-sm text-[#AFA8C8]">{recommendedTask.goal}</p>
          <Link href={`/tasks/${recommendedTask.id}`} className="btn-primary mt-4 inline-flex">
            Открыть задачу
          </Link>
        </GlassCard>
      )}
    </div>
  );
}
