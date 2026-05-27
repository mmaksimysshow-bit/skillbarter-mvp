import type { LessonStatus, TaskStatus } from "@/types";

export const lessonStatusLabel: Record<LessonStatus, string> = {
  completed: "Завершён",
  in_progress: "В процессе",
  available: "Доступен",
  locked: "Заблокирован",
};

export const taskStatusLabel: Record<TaskStatus, string> = {
  completed: "Завершена",
  in_progress: "В работе",
  submitted: "На проверке",
  pending: "Ожидает",
};
