"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Clapperboard,
  FileText,
  Fingerprint,
  LayoutTemplate,
  Megaphone,
  Play,
  Presentation,
  RotateCcw,
  Send,
  Sparkles,
  Wand2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type SkillId = "design" | "sites" | "video" | "smm" | "texts" | "slides";
type Step = 0 | 1 | 2 | 3 | 4 | 5;
type MentorChoice = "improve" | "ignore" | null;

type QuestSkill = {
  id: SkillId;
  title: string;
  description: string;
  icon: LucideIcon;
  mission: string;
  options: string[];
  correctIndex: number;
  feedback: string;
  caseTitle: string;
};

const steps = ["Навык", "Миссия", "Правка", "Кейс", "Skill ID"];

const skills: QuestSkill[] = [
  {
    id: "design",
    title: "Дизайн",
    description: "Первый экран, карточки, доверие",
    icon: LayoutTemplate,
    mission: "Клиенту нужен первый экран сайта. Что усилит доверие?",
    options: ["Много декоративных элементов", "Понятный заголовок, польза и кнопка", "Длинный текст без структуры"],
    correctIndex: 1,
    feedback: "Сделай заголовок короче и добавь понятную кнопку.",
    caseTitle: "Первый экран сайта",
  },
  {
    id: "sites",
    title: "Сайты",
    description: "CTA, структура, сценарий действия",
    icon: Wand2,
    mission: "Пользователь зашёл на сайт. Какой CTA лучше?",
    options: ["Подробнее", "Начать сейчас", "Информация"],
    correctIndex: 1,
    feedback: "Убери лишнее и оставь один главный сценарий действия.",
    caseTitle: "Сценарий действия на сайте",
  },
  {
    id: "video",
    title: "Видео",
    description: "Хук, динамика, удержание зрителя",
    icon: Clapperboard,
    mission: "У тебя 3 секунды, чтобы удержать зрителя. Что выбрать?",
    options: ["Долгое вступление", "Сильный хук", "Тихий фон без смысла"],
    correctIndex: 1,
    feedback: "Начни с интриги: зритель должен захотеть досмотреть.",
    caseTitle: "Промо-хук для ролика",
  },
  {
    id: "smm",
    title: "SMM",
    description: "Пост, оффер, внимание аудитории",
    icon: Megaphone,
    mission: "Нужно сделать пост, который заметят. Что сработает лучше?",
    options: ["Одна сильная мысль и понятный оффер", "30 хэштегов", "Случайный длинный текст"],
    correctIndex: 0,
    feedback: "Усиль структуру: проблема → польза → действие.",
    caseTitle: "Пост с понятным оффером",
  },
  {
    id: "texts",
    title: "Тексты",
    description: "Польза, смысл, результат без воды",
    icon: FileText,
    mission: "Как объяснить проект так, чтобы человек понял пользу?",
    options: ["Сложные термины", "Много красивой воды", "Простая польза и конкретный результат"],
    correctIndex: 2,
    feedback: "Убери воду. Покажи конкретный результат для человека.",
    caseTitle: "Короткий текст пользы",
  },
  {
    id: "slides",
    title: "Презентации",
    description: "Слайд, мысль, визуальный акцент",
    icon: Presentation,
    mission: "Что делает слайд сильным?",
    options: ["Одна главная мысль", "Много мелкого текста", "Случайные картинки"],
    correctIndex: 0,
    feedback: "Оставь одну мысль на слайде и усили её визуалом.",
    caseTitle: "Сильный слайд проекта",
  },
];

function vibrate(pattern: number | number[]) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
}

function getTrust(isCorrect: boolean, mentorChoice: MentorChoice) {
  if (isCorrect && mentorChoice === "improve") return 100;
  if (!isCorrect && mentorChoice === "improve") return 80;
  if (isCorrect && mentorChoice === "ignore") return 70;
  return 50;
}

function QuestProgress({ step }: { step: Step }) {
  const percent = Math.round(((step + 1) / 6) * 100);

  return (
    <div className="sticky top-0 z-30 border-b border-[rgba(168,85,247,0.16)] bg-[rgba(3,0,20,0.82)] px-4 py-3 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-3xl items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[rgba(168,85,247,0.28)] bg-[rgba(123,44,255,0.14)] text-sm font-bold text-[#F4F0FF]">
          {step + 1}/6
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.16em] text-[#AFA8C8]">
            <span>Skill ID Quest</span>
            <span>{percent}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[rgba(255,255,255,0.08)]">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#7B2CFF] via-[#A855F7] to-[#E9D5FF]"
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function NeonPath({ active = 0 }: { active?: number }) {
  return (
    <div className="mx-auto mt-8 w-full max-w-xl">
      <div className="relative flex items-center justify-between">
        <div className="absolute left-5 right-5 top-5 h-px bg-[rgba(168,85,247,0.22)]" />
        <motion.div
          className="absolute left-5 top-5 h-px bg-gradient-to-r from-[#7B2CFF] to-[#C084FC] shadow-[0_0_18px_rgba(168,85,247,0.75)]"
          animate={{ width: `${Math.min(100, (active / (steps.length - 1)) * 100)}%` }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        />
        {steps.map((item, index) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, y: 8, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: index <= active ? 1 : 0.94 }}
            transition={{ delay: index * 0.08, duration: 0.35 }}
            className="relative flex w-16 flex-col items-center gap-2"
          >
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border text-xs font-bold transition",
                index <= active
                  ? "border-[#C084FC] bg-[#7B2CFF] text-white shadow-[0_0_28px_rgba(123,44,255,0.55)]"
                  : "border-[rgba(168,85,247,0.2)] bg-[rgba(255,255,255,0.04)] text-[#AFA8C8]",
              )}
            >
              {index + 1}
            </div>
            <span className="text-center text-[10px] uppercase tracking-[0.08em] text-[#AFA8C8]">{item}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function QuestCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 22, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -18, scale: 0.98 }}
      transition={{ duration: 0.32, ease: "easeOut" }}
      className={cn(
        "relative mx-auto w-full max-w-3xl overflow-hidden rounded-[2rem] border border-[rgba(168,85,247,0.22)] bg-[linear-gradient(180deg,rgba(18,12,42,0.9),rgba(7,4,26,0.84))] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.45),0_0_34px_rgba(123,44,255,0.16)] sm:p-8",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#C084FC] to-transparent" />
      {children}
    </motion.section>
  );
}

function TrustMeter({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frame = 0;
    const total = 28;
    const id = window.setInterval(() => {
      frame += 1;
      setDisplay(Math.round((value * frame) / total));
      if (frame >= total) window.clearInterval(id);
    }, 18);
    return () => window.clearInterval(id);
  }, [value]);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-[#AFA8C8]">Доверие</span>
        <span className="font-semibold text-[#E9D5FF]">{display}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-[rgba(255,255,255,0.08)]">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#7B2CFF] via-[#C084FC] to-[#22C55E]"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function SkillIdResultCard({ skill, trust }: { skill: QuestSkill; trust: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="relative overflow-hidden rounded-[2rem] border border-[rgba(192,132,252,0.36)] bg-[linear-gradient(150deg,rgba(35,18,74,0.96),rgba(8,5,28,0.94))] p-5 shadow-[0_0_44px_rgba(123,44,255,0.28)]"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E9D5FF] to-transparent" />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[#C4B5FD]">SKILL ID ACTIVATED</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-white">SB-QUEST-2026</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#7B2CFF] shadow-[0_0_30px_rgba(123,44,255,0.55)]">
          <Fingerprint className="h-6 w-6" />
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        {[
          ["Навык", skill.title],
          ["Статус", "подтверждён через действие"],
          ["Кейс", skill.caseTitle],
          ["Доверие", `${trust}%`],
        ].map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4 rounded-2xl border border-[rgba(168,85,247,0.16)] bg-[rgba(255,255,255,0.04)] px-4 py-3">
            <span className="text-sm text-[#AFA8C8]">{label}</span>
            <span className="break-words text-right text-sm font-semibold text-[#F4F0FF]">{value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function EventQuestPage() {
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState<Step>(0);
  const [selectedSkillId, setSelectedSkillId] = useState<SkillId | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [mentorChoice, setMentorChoice] = useState<MentorChoice>(null);
  const [typingDone, setTypingDone] = useState(false);
  const [shared, setShared] = useState(false);

  const selectedSkill = useMemo(
    () => skills.find((skill) => skill.id === selectedSkillId) ?? skills[0],
    [selectedSkillId],
  );
  const isCorrect = selectedAnswer === selectedSkill.correctIndex;
  const trust = getTrust(Boolean(isCorrect), mentorChoice);

  useEffect(() => {
    if (step !== 3) return;
    setTypingDone(false);
    const id = window.setTimeout(() => setTypingDone(true), 850);
    return () => window.clearTimeout(id);
  }, [step, selectedSkillId]);

  useEffect(() => {
    if (step === 5) vibrate([30, 40, 30]);
  }, [step]);

  const goNext = (next: Step) => {
    vibrate(18);
    setStep(next);
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  const reset = () => {
    setStep(0);
    setSelectedSkillId(null);
    setSelectedAnswer(null);
    setMentorChoice(null);
    setShared(false);
    setTypingDone(false);
  };

  const shareQuest = async () => {
    const url = "https://skillbarter-mvp-bh44.vercel.app/event";
    try {
      if (navigator.share) {
        await navigator.share({ title: "Skill ID Quest", text: "Пройди мини-квест SkillBarter", url });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      }
      setShared(true);
      vibrate(20);
    } catch {
      setShared(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#030014] text-[#F4F0FF]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(123,44,255,0.34),transparent_34%),radial-gradient(circle_at_15%_28%,rgba(168,85,247,0.16),transparent_24%),radial-gradient(circle_at_88%_72%,rgba(34,197,94,0.1),transparent_22%),#030014]" />
        <motion.div
          className="absolute left-[-8rem] top-20 h-64 w-64 rounded-full bg-[#7B2CFF]/18 blur-3xl"
          animate={reduceMotion ? undefined : { x: [0, 18, 0], y: [0, -12, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-16 right-[-7rem] h-72 w-72 rounded-full bg-[#A855F7]/16 blur-3xl"
          animate={reduceMotion ? undefined : { x: [0, -16, 0], y: [0, 18, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="scene-grid opacity-80" />
        <div className="noise-layer" />
      </div>

      <QuestProgress step={step} />

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-4xl flex-col px-4 pb-7 pt-6 sm:px-6">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <QuestCard key="intro" className="my-auto text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#7B2CFF] shadow-[0_0_42px_rgba(123,44,255,0.62)]"
              >
                <Fingerprint className="h-8 w-8" />
              </motion.div>
              <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-6 text-xs uppercase tracking-[0.24em] text-[#C4B5FD]">
                Skill ID Quest
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 18, clipPath: "inset(0 0 100% 0)" }}
                animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
                transition={{ duration: 0.65, ease: "easeOut" }}
                className="mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-6xl"
              >
                У тебя есть навык.
                <br />
                Но сможешь ли ты его доказать?
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="mx-auto mt-5 max-w-xl text-base leading-7 text-[#B8B0D9]">
                Пройди Skill ID Quest и собери первый подтверждённый кейс.
              </motion.p>
              <NeonPath active={4} />
              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={() => goNext(1)}
                className="btn-primary mt-9 w-full gap-2 py-4 text-base sm:w-auto sm:px-8"
              >
                Начать квест
                <Play className="h-5 w-5" />
              </motion.button>
            </QuestCard>
          )}

          {step === 1 && (
            <QuestCard key="skill">
              <p className="text-xs uppercase tracking-[0.22em] text-[#C4B5FD]">Шаг 1</p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">Выбери навык для испытания</h1>
              <p className="mt-3 text-sm leading-6 text-[#AFA8C8]">Выбор задаёт миссию. Дальше нужно будет доказать навык действием.</p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {skills.map((skill, index) => {
                  const Icon = skill.icon;
                  const selected = selectedSkillId === skill.id;
                  return (
                    <motion.button
                      key={skill.id}
                      type="button"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0, scale: selected ? 1.03 : selectedSkillId ? 0.98 : 1 }}
                      transition={{ delay: index * 0.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => {
                        setSelectedSkillId(skill.id);
                        vibrate(18);
                      }}
                      className={cn(
                        "min-h-28 rounded-[1.5rem] border p-4 text-left transition",
                        selected
                          ? "border-[#C084FC] bg-[rgba(123,44,255,0.28)] shadow-[0_0_34px_rgba(123,44,255,0.32)]"
                          : "border-[rgba(168,85,247,0.18)] bg-[rgba(255,255,255,0.04)] hover:border-[rgba(192,132,252,0.38)]",
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[rgba(123,44,255,0.18)] text-[#E9D5FF]">
                          <Icon className="h-6 w-6" />
                        </span>
                        <span>
                          <span className="block text-lg font-semibold">{skill.title}</span>
                          <span className="mt-1 block text-sm leading-5 text-[#AFA8C8]">{skill.description}</span>
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <AnimatePresence>
                {selectedSkillId && (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-6 rounded-2xl border border-[rgba(34,197,94,0.24)] bg-[rgba(34,197,94,0.1)] p-4 text-sm text-[#D1FAE5]">
                    Навык выбран. Теперь докажи его делом.
                  </motion.div>
                )}
              </AnimatePresence>

              <button type="button" disabled={!selectedSkillId} onClick={() => goNext(2)} className="btn-primary mt-6 w-full gap-2 py-4 disabled:cursor-not-allowed disabled:opacity-45">
                Получить миссию
                <ArrowRight className="h-5 w-5" />
              </button>
            </QuestCard>
          )}

          {step === 2 && (
            <QuestCard key="mission">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[rgba(123,44,255,0.18)] text-[#E9D5FF]">
                  <selectedSkill.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[#C4B5FD]">Миссия от заказчика</p>
                  <h1 className="mt-2 text-2xl font-bold leading-tight sm:text-4xl">{selectedSkill.mission}</h1>
                </div>
              </div>

              <div className="mt-7 grid gap-3">
                {selectedSkill.options.map((option, index) => {
                  const answered = selectedAnswer !== null;
                  const correct = index === selectedSkill.correctIndex;
                  const chosen = selectedAnswer === index;
                  return (
                    <motion.button
                      key={option}
                      type="button"
                      whileTap={{ scale: answered ? 1 : 0.96 }}
                      disabled={answered}
                      onClick={() => {
                        setSelectedAnswer(index);
                        vibrate(correct ? [20, 30, 20] : 25);
                      }}
                      className={cn(
                        "min-h-16 rounded-2xl border px-4 py-4 text-left text-base font-medium transition",
                        !answered && "border-[rgba(168,85,247,0.18)] bg-[rgba(255,255,255,0.04)] hover:border-[#A855F7]",
                        answered && correct && "border-[rgba(34,197,94,0.45)] bg-[rgba(34,197,94,0.14)] text-[#DCFCE7]",
                        answered && chosen && !correct && "border-[rgba(245,158,11,0.45)] bg-[rgba(245,158,11,0.12)] text-[#FEF3C7]",
                        answered && !chosen && !correct && "border-[rgba(168,85,247,0.12)] bg-[rgba(255,255,255,0.025)] text-[#8D87A9]",
                      )}
                    >
                      <span className="mr-3 text-[#C084FC]">{index + 1}.</span>
                      {option}
                    </motion.button>
                  );
                })}
              </div>

              {selectedAnswer !== null && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-6 rounded-2xl border border-[rgba(168,85,247,0.2)] bg-[rgba(255,255,255,0.04)] p-4">
                  <p className="font-semibold text-[#F4F0FF]">{isCorrect ? "+30 доверия" : "Наставник поможет усилить результат"}</p>
                  <p className="mt-1 text-sm text-[#AFA8C8]">
                    {isCorrect ? "Решение попало в цель. Но хороший результат всё равно становится сильнее после правки." : "Ошибаться можно. В SkillBarter важнее пройти путь и улучшить работу."}
                  </p>
                  <button type="button" onClick={() => goNext(3)} className="btn-primary mt-5 w-full gap-2 py-4">
                    Получить правку
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </motion.div>
              )}
            </QuestCard>
          )}

          {step === 3 && (
            <QuestCard key="mentor">
              <p className="text-xs uppercase tracking-[0.22em] text-[#C4B5FD]">Правка наставника</p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">Результат можно усилить</h1>

              <div className="mt-7 rounded-[1.5rem] border border-[rgba(168,85,247,0.18)] bg-[rgba(255,255,255,0.04)] p-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7B2CFF] to-[#C084FC] font-bold shadow-[0_0_28px_rgba(123,44,255,0.45)]"
                  >
                    М
                  </motion.div>
                  <div>
                    <p className="font-semibold">Наставник SkillBarter</p>
                    <p className="text-sm text-[#AFA8C8]">{typingDone ? "Правка получена" : "печатает..."}</p>
                  </div>
                </div>
                <div className="mt-4 rounded-2xl bg-[rgba(7,4,26,0.74)] p-4 text-sm leading-6 text-[#EDE9FE]">
                  {typingDone ? selectedSkill.feedback : <span className="inline-flex gap-1"><span>.</span><span>.</span><span>.</span></span>}
                </div>
              </div>

              {typingDone && (
                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mt-6 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMentorChoice("ignore");
                      goNext(4);
                    }}
                    className="btn-ghost w-full py-4"
                  >
                    Игнорировать
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMentorChoice("improve");
                      goNext(4);
                    }}
                    className="btn-primary w-full gap-2 py-4"
                  >
                    Доработать
                    <Sparkles className="h-5 w-5" />
                  </button>
                </motion.div>
              )}
            </QuestCard>
          )}

          {step === 4 && (
            <QuestCard key="confirm" className="text-center">
              <p className="text-xs uppercase tracking-[0.22em] text-[#C4B5FD]">Проверка результата</p>
              <h1 className="mt-3 text-3xl font-bold sm:text-5xl">Проверяем результат...</h1>

              <div className="mx-auto mt-8 max-w-md space-y-3 text-left">
                {["Навык применён", "Наставник проверил", "Кейс добавлен в Skill ID"].map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.35, duration: 0.35 }}
                    className="flex items-center gap-3 rounded-2xl border border-[rgba(34,197,94,0.22)] bg-[rgba(34,197,94,0.09)] px-4 py-4"
                  >
                    <CheckCircle2 className="h-5 w-5 text-[#86EFAC]" />
                    <span className="font-medium">{item}</span>
                  </motion.div>
                ))}
              </div>

              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1.1, duration: 0.35 }} className="mt-8">
                <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[rgba(34,197,94,0.32)] bg-[rgba(34,197,94,0.12)] px-5 py-2 text-sm font-semibold text-[#DCFCE7] shadow-[0_0_28px_rgba(34,197,94,0.2)]">
                  <BadgeCheck className="h-5 w-5" />
                  Кейс подтверждён
                </div>
                <button type="button" onClick={() => goNext(5)} className="btn-primary mt-7 w-full gap-2 py-4 sm:w-auto sm:px-8">
                  Открыть Skill ID
                  <ArrowRight className="h-5 w-5" />
                </button>
              </motion.div>
            </QuestCard>
          )}

          {step === 5 && (
            <QuestCard key="finish">
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {Array.from({ length: 16 }).map((_, index) => (
                  <motion.span
                    key={index}
                    className="absolute left-1/2 top-20 h-1.5 w-1.5 rounded-full bg-[#C084FC]"
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{
                      x: Math.cos(index) * (80 + index * 4),
                      y: Math.sin(index * 1.7) * (60 + index * 3),
                      opacity: 0,
                      scale: 0.4,
                    }}
                    transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-full border border-[rgba(34,197,94,0.28)] bg-[rgba(34,197,94,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#BBF7D0]">
                  case unlocked
                </span>
              </div>
              <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">Skill ID открыт</h1>
              <p className="mt-3 text-sm leading-6 text-[#AFA8C8]">
                Так работает SkillBarter: урок, задача, правка наставника, подтверждённый кейс и Skill ID.
              </p>

              <div className="mt-7 grid gap-5 lg:grid-cols-[1fr_0.9fr] lg:items-center">
                <SkillIdResultCard skill={selectedSkill} trust={trust} />
                <div className="rounded-[1.5rem] border border-[rgba(168,85,247,0.18)] bg-[rgba(255,255,255,0.04)] p-5">
                  <TrustMeter value={trust} />
                  <p className="mt-5 text-sm leading-6 text-[#AFA8C8]">
                    Навык становится ценным, когда за ним есть действие, обратная связь и подтверждённый результат.
                  </p>
                </div>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <Link href="/access" className="btn-primary gap-2 py-4">
                  Открыть MVP
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <button type="button" onClick={reset} className="btn-ghost gap-2 py-4">
                  <RotateCcw className="h-5 w-5" />
                  Пройти ещё раз
                </button>
                <button type="button" onClick={shareQuest} className="btn-ghost gap-2 py-4">
                  <Send className="h-5 w-5" />
                  {shared ? "Ссылка готова" : "Поделиться"}
                </button>
              </div>
            </QuestCard>
          )}
        </AnimatePresence>

        <p className="relative mx-auto mt-6 max-w-md text-center text-xs leading-5 text-[#AFA8C8]">
          SkillBarter — платформа, где навык становится доказанным результатом.
        </p>
      </div>
    </main>
  );
}
