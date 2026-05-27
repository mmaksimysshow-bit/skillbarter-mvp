"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { FileText, Fingerprint, MessageCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Modal } from "@/components/ui/Modal";
import { PageHeader } from "@/components/ui/PageHeader";
import { taskStatusLabel } from "@/lib/labels";
import { useAppStore } from "@/store/useAppStore";

export default function TaskDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const tasks = useAppStore((state) => state.tasks);
  const lessons = useAppStore((state) => state.lessons);
  const takeTask = useAppStore((state) => state.takeTask);
  const submitTask = useAppStore((state) => state.submitTask);
  const confirmTask = useAppStore((state) => state.confirmTask);
  const setActiveChatMentor = useAppStore((state) => state.setActiveChatMentor);

  const [submitOpen, setSubmitOpen] = useState(false);
  const [link, setLink] = useState("");
  const [comment, setComment] = useState("");
  const [fileName, setFileName] = useState("result-link.txt");

  const task = tasks.find((item) => item.id === id);
  const relatedLesson = task?.relatedLessonId ? lessons.find((item) => item.id === task.relatedLessonId) : undefined;
  const shouldTakeLessonFirst = relatedLesson && relatedLesson.status !== "completed";

  const canSubmit = useMemo(() => task && (task.status === "in_progress" || task.status === "pending"), [task]);
  const canConfirm = useMemo(() => task && (task.status === "submitted" || task.status === "in_progress"), [task]);

  if (!task) {
    return (
      <div className="page-wrap max-w-3xl text-center">
        <p>Задача не найдена</p>
        <Link href="/tasks" className="btn-primary mt-4 inline-flex">
          К каталогу задач
        </Link>
      </div>
    );
  }

  const handleSubmit = () => {
    submitTask(id, link, comment, fileName);
    setSubmitOpen(false);
  };

  return (
    <div className="page-wrap mx-auto max-w-4xl space-y-5 overflow-x-hidden pb-8 sm:space-y-6">
      <PageHeader title={task.title} description={task.description} />

      <GlassCard hover={false}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.16em] text-[#A855F7]">{task.category}</p>
            <p className="break-words text-sm text-[#CFC7E8]">{task.goal}</p>
          </div>
          <span className="rounded-full border border-[rgba(168,85,247,0.18)] px-3 py-1 text-xs text-[#F4F0FF]">
            {taskStatusLabel[task.status]}
          </span>
        </div>

        <div className="mt-4 grid gap-2 text-sm text-[#AFA8C8] sm:grid-cols-2 lg:grid-cols-3">
          <p className="break-words">Заказчик: {task.client}</p>
          <p className="break-words">Наставник: {task.mentor ?? "Назначается позже"}</p>
          <p>{task.difficulty} · {task.deadline}</p>
          <p className="break-words">Проект: {task.projectId ?? "Индивидуальная задача"}</p>
          <p className="break-words">Подтверждает: {task.skills.join(", ")}</p>
          <p>Оценка времени: {task.estimatedHours}</p>
        </div>
      </GlassCard>

      {relatedLesson && (
        <GlassCard>
          <h2 className="font-semibold">Связанный урок</h2>
          <p className="mt-3 break-words text-sm text-[#F4F0FF]">{relatedLesson.title}</p>
          <p className="mt-2 break-words text-sm text-[#AFA8C8]">
            Рекомендуется после урока: {relatedLesson.subtitle}
          </p>
          {shouldTakeLessonFirst && (
            <p className="mt-3 break-words text-sm text-[#A855F7]">
              Лучше сначала пройти урок, чтобы задача была понятной и сразу превратилась в сильный кейс.
            </p>
          )}
          <Link href={`/lessons/${relatedLesson.id}`} className="btn-ghost mt-4 inline-flex">
            Открыть урок
          </Link>
        </GlassCard>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <h2 className="font-semibold">1. Контекст</h2>
          <p className="mt-3 break-words text-sm text-[#AFA8C8]">{task.context}</p>
        </GlassCard>
        <GlassCard>
          <h2 className="font-semibold">2. Проблема</h2>
          <p className="mt-3 break-words text-sm text-[#AFA8C8]">{task.problem}</p>
        </GlassCard>
      </div>

      <GlassCard>
        <h2 className="font-semibold">3. Цель</h2>
        <p className="mt-3 break-words text-sm text-[#AFA8C8]">{task.goal}</p>
      </GlassCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <h2 className="font-semibold">4. Что сделать</h2>
          <ul className="mt-4 space-y-2 text-sm text-[#AFA8C8]">
            {task.whatToDo.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#A855F7]" />
                <span className="break-words">{item}</span>
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard>
          <h2 className="font-semibold">5. Что сдать</h2>
          <ul className="mt-4 space-y-2 text-sm text-[#AFA8C8]">
            {task.deliverables.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#A855F7]" />
                <span className="break-words">{item}</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <h2 className="font-semibold">6. Критерии оценки</h2>
          <ul className="mt-4 space-y-2 text-sm text-[#AFA8C8]">
            {task.criteria.map((item) => (
              <li key={item} className="break-words rounded-2xl border border-[rgba(168,85,247,0.12)] px-4 py-3">
                {item}
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard>
          <h2 className="font-semibold">7. Советы по сдаче</h2>
          <ul className="mt-4 space-y-2 text-sm text-[#AFA8C8]">
            {task.submissionTips.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#A855F7]" />
                <span className="break-words">{item}</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <h2 className="font-semibold">8. Пример результата</h2>
          <p className="mt-3 break-words text-sm text-[#AFA8C8]">{task.exampleResult}</p>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-2">
            <Fingerprint className="h-5 w-5 text-[#A855F7]" />
            <h2 className="font-semibold">9. Что появится в Skill ID</h2>
          </div>
          <p className="mt-3 break-words text-sm text-[#AFA8C8]">
            После подтверждения наставником эта задача станет кейсом с названием, заказчиком, навыками, ссылкой на результат и отзывом.
          </p>
          <p className="mt-3 break-words text-sm text-[#F4F0FF]">Навыки: {task.skills.join(", ")}</p>
        </GlassCard>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {task.status === "pending" && (
          <button
            type="button"
            className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => takeTask(id)}
            disabled={shouldTakeLessonFirst}
          >
            Взять задачу
          </button>
        )}

        {canSubmit && (
          <button type="button" className="btn-ghost" onClick={() => setSubmitOpen(true)}>
            <FileText className="h-4 w-4" />
            Сдать результат
          </button>
        )}

        {canConfirm && (
          <button type="button" className="btn-primary" onClick={() => confirmTask(id)}>
            Подтвердить наставником
          </button>
        )}

        {task.mentorId && (
          <Link
            href={`/messages?mentor=${task.mentorId}`}
            className="btn-ghost text-center"
            onClick={() => setActiveChatMentor(task.mentorId!)}
          >
            <MessageCircle className="h-4 w-4" />
            Написать наставнику
          </Link>
        )}
      </div>

      {task.submission && (
        <GlassCard>
          <h2 className="font-semibold">Последняя сдача</h2>
          <div className="mt-3 space-y-2 text-sm text-[#AFA8C8]">
            <p className="break-words"><span className="text-[#F4F0FF]">Ссылка:</span> {task.submission.link || "Не указана"}</p>
            <p className="break-words"><span className="text-[#F4F0FF]">Комментарий:</span> {task.submission.comment || "Не указан"}</p>
            <p className="break-words"><span className="text-[#F4F0FF]">Файл:</span> {task.submission.fileName || "Не указан"}</p>
          </div>
        </GlassCard>
      )}

      <Modal open={submitOpen} onClose={() => setSubmitOpen(false)} title="Сдать результат">
        <div className="space-y-4">
          <p className="break-words text-sm text-[#AFA8C8]">
            Можно вставить ссылку на Figma, Google Drive, GitHub, скрин или любой другой понятный артефакт результата.
          </p>
          <div>
            <label className="text-sm text-[#AFA8C8]">Ссылка на работу</label>
            <input
              value={link}
              onChange={(event) => setLink(event.target.value)}
              className="mt-1 min-h-[44px] w-full rounded-xl border border-[rgba(168,85,247,0.25)] bg-[rgba(7,4,26,0.8)] px-3 py-2 text-base outline-none focus:border-[#A855F7]"
              placeholder="https://figma.com/... или https://drive.google.com/..."
            />
          </div>
          <div>
            <label className="text-sm text-[#AFA8C8]">Комментарий</label>
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              rows={4}
              className="mt-1 w-full rounded-xl border border-[rgba(168,85,247,0.25)] bg-[rgba(7,4,26,0.8)] px-3 py-2 text-base outline-none focus:border-[#A855F7]"
              placeholder="Коротко опиши, что сделал и какой результат хочешь показать наставнику."
            />
          </div>
          <div>
            <label className="text-sm text-[#AFA8C8]">Mock fileName</label>
            <input
              value={fileName}
              onChange={(event) => setFileName(event.target.value)}
              className="mt-1 min-h-[44px] w-full rounded-xl border border-[rgba(168,85,247,0.25)] bg-[rgba(7,4,26,0.8)] px-3 py-2 text-base outline-none focus:border-[#A855F7]"
              placeholder="skillbarter-task.fig"
            />
          </div>
          <button type="button" className="btn-primary w-full" onClick={handleSubmit}>
            Отправить на проверку
          </button>
        </div>
      </Modal>
    </div>
  );
}
