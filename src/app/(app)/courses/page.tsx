"use client";

import Link from "next/link";
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

function getCourseStatus(progress: number) {
  if (progress === 0) return "Не начат";
  if (progress >= 100) return "Завершен";
  return "В процессе";
}

export default function CoursesPage() {
  const lessons = useAppStore((state) => state.lessons);

  return (
    <div className="page-wrap max-w-6xl space-y-5 overflow-x-hidden sm:space-y-6">
      <PageHeader
        title="Курсы"
        description="Курсы дают структуру. Внутри каждого курса — последовательные уроки, которые открывают задачи и постепенно собирают Skill ID."
      />

      <GlassCard hover={false}>
        <p className="break-words text-sm text-[#AFA8C8]">
          Если не знаешь, с чего начать, открой курс с первым доступным уроком. Он подхватит маршрут и покажет, какой навык ты соберешь следующим.
        </p>
      </GlassCard>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockCourses.map((course) => {
          const courseLessons = lessons.filter((lesson) => lesson.courseId === course.id);
          const completedLessons = courseLessons.filter((lesson) => lesson.status === "completed").length;
          const progress = getCourseProgress(courseLessons.length, completedLessons);
          const mentor = course.mentorId ? getMentorById(course.mentorId) : undefined;
          const nextLesson = courseLessons.find((lesson) => lesson.status === "in_progress") ?? courseLessons.find((lesson) => lesson.status === "available");

          return (
            <GlassCard key={course.id} hover className="min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <span className="text-xs uppercase tracking-[0.16em] text-[#A855F7]">{course.direction}</span>
                <span className="text-xs text-[#AFA8C8]">{getCourseStatus(progress)}</span>
              </div>
              <h3 className="mt-2 break-words font-semibold">{course.title}</h3>
              <p className="mt-1 break-words text-sm text-[#AFA8C8]">{course.description}</p>
              <p className="mt-2 break-words text-xs text-[#AFA8C8]">{courseLessons.length} уроков · {course.level}</p>
              {mentor && <p className="mt-1 break-words text-xs text-[#AFA8C8]">Наставник: {mentor.name}</p>}

              <div className="mt-3 flex justify-between text-sm">
                <span className="text-[#AFA8C8]">Прогресс</span>
                <span className="font-semibold text-[#A855F7]">{progress}%</span>
              </div>
              <ProgressBar value={progress} size="sm" className="mt-2" />

              <div className="mt-4 rounded-2xl border border-[rgba(168,85,247,0.12)] bg-[rgba(255,255,255,0.025)] px-3 py-3 text-sm text-[#AFA8C8]">
                {nextLesson ? (
                  <>
                    <p className="text-xs uppercase tracking-[0.16em] text-[#A855F7]">Следующий урок</p>
                    <p className="mt-1 break-words text-[#F4F0FF]">{nextLesson.title}</p>
                  </>
                ) : (
                  <p className="break-words">Курс завершен. Можно переходить к задаче или следующему направлению.</p>
                )}
              </div>

              <div className="mt-4 space-y-2 text-xs text-[#AFA8C8]">
                {courseLessons.slice(0, 3).map((lesson) => (
                  <p key={lesson.id} className="break-words">
                    {lesson.title} · {lessonStatusLabel[lesson.status]}
                  </p>
                ))}
              </div>

              <Link href={`/courses/${course.id}`} className="btn-primary mt-4 flex w-full justify-center">
                Открыть курс
              </Link>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
