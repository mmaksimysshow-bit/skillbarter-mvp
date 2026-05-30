"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  ChefHat,
  Code2,
  Coins,
  Fingerprint,
  GraduationCap,
  HeartHandshake,
  LayoutTemplate,
  MessageCircle,
  Palette,
  RefreshCcw,
  Scale,
  Send,
  Sparkles,
  Target,
  Trophy,
  UserRoundCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type GoalId = "orders" | "job" | "portfolio" | "confidence";
type SkillId = "programming" | "design" | "cooking" | "teaching" | "psychology" | "law";
type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
type MentorDecision = "improve" | "ignore" | null;

type Goal = {
  id: GoalId;
  title: string;
  description: string;
  icon: LucideIcon;
  reaction: string;
  opportunity: string;
};

type SkillTrack = {
  id: SkillId;
  title: string;
  description: string;
  icon: LucideIcon;
  situation: string;
  actions: string[];
  correct: number[];
  mentorFix: string;
  reaction: string;
  caseName: string;
};

type Scores = {
  trust: number;
  quality: number;
  opportunity: number;
};

const questPath = ["Цель", "Навык", "Миссия", "Рынок", "Правка", "Кейс", "Skill ID", "Возможность"];

const goals: Goal[] = [
  {
    id: "orders",
    title: "Зарабатывать на заказах",
    description: "Показать результат, чтобы тебе могли доверить работу",
    icon: Coins,
    reaction: "POV: ты понял, что навык может приносить деньги, если его можно доказать.",
    opportunity: "заказ",
  },
  {
    id: "job",
    title: "Попасть на работу",
    description: "Принести не обещания, а понятный кейс",
    icon: BriefcaseBusiness,
    reaction: "Работодатель не экстрасенс. Ему нужен результат, а не «я быстро учусь».",
    opportunity: "работа",
  },
  {
    id: "portfolio",
    title: "Собрать портфолио",
    description: "Начать с первого доказанного результата",
    icon: Palette,
    reaction: "Портфолио само себя не соберёт. Пора открывать первый кейс.",
    opportunity: "портфолио",
  },
  {
    id: "confidence",
    title: "Прокачаться и стать увереннее",
    description: "Понять, что ты уже можешь сделать руками",
    icon: Trophy,
    reaction: "Прокачка без практики — это как спортзал по видео. Вроде понял, но форму не набрал.",
    opportunity: "рост",
  },
];

const tracks: SkillTrack[] = [
  {
    id: "programming",
    title: "Программирование",
    description: "сайты, боты, автоматизация, приложения",
    icon: Code2,
    situation: "Малому бизнесу нужна простая страница заявки. Что сделает работу похожей на реальный кейс?",
    actions: [
      "Сделать красивый фон и забыть про форму",
      "Добавить понятную форму заявки",
      "Проверить, что кнопка работает",
      "Оставить страницу без адаптива",
    ],
    correct: [1, 2],
    mentorFix: "Добавь проверку формы и покажи, что пользователь реально может оставить заявку.",
    reaction: "Код есть. Теперь бы ещё показать, что он реально работает.",
    caseName: "Страница заявки для бизнеса",
  },
  {
    id: "design",
    title: "Дизайн",
    description: "интерфейсы, визуал, карточки, презентации",
    icon: LayoutTemplate,
    situation: "Клиенту нужен первый экран сайта. Что повысит доверие?",
    actions: ["Понятный заголовок", "Много случайных эффектов", "Видимая кнопка действия", "Мелкий текст на весь экран"],
    correct: [0, 2],
    mentorFix: "Убери лишние эффекты. Сделай заголовок, пользу и кнопку главным фокусом.",
    reaction: "Красиво — хорошо. Понятно и полезно — уже кейс.",
    caseName: "Первый экран сайта",
  },
  {
    id: "cooking",
    title: "Поварское дело",
    description: "блюда, подача, меню, технология приготовления",
    icon: ChefHat,
    situation: "Кафе просит придумать блюдо для меню. Что сделает это кейсом?",
    actions: ["Описать состав и технологию", "Просто написать «вкусно»", "Продумать подачу блюда", "Не считать время приготовления"],
    correct: [0, 2],
    mentorFix: "Опиши технологию и подачу так, чтобы блюдо можно было повторить и оценить.",
    reaction: "Вкусно на словах не считается. Нужна технология, подача и результат.",
    caseName: "Блюдо для меню кафе",
  },
  {
    id: "teaching",
    title: "Педагогика",
    description: "объяснение темы, уроки, работа с учениками",
    icon: GraduationCap,
    situation: "Тебе нужно объяснить сложную тему новичку. Что покажет твой навык?",
    actions: ["Объяснить простыми словами", "Дать пример из жизни", "Сразу завалить терминами", "Не проверять, понял ли ученик"],
    correct: [0, 1],
    mentorFix: "Добавь пример и вопрос для проверки понимания.",
    reaction: "Объяснить так, чтобы поняли — это тоже сильный навык.",
    caseName: "Мини-урок для новичка",
  },
  {
    id: "psychology",
    title: "Психология",
    description: "коммуникация, поддержка, разбор ситуации, этика",
    icon: HeartHandshake,
    situation: "Человек описал трудную ситуацию. Что важно сделать правильно?",
    actions: ["Выслушать и уточнить запрос", "Сразу поставить диагноз", "Соблюдать этику и границы", "Давить своим мнением"],
    correct: [0, 2],
    mentorFix: "Не оценивай человека. Сначала уточни запрос и сохрани безопасные границы общения.",
    reaction: "Слушать, уточнять и не давить — база профессионального общения.",
    caseName: "Учебный разбор запроса",
  },
  {
    id: "law",
    title: "Юриспруденция",
    description: "правовая логика, документы, защита позиции",
    icon: Scale,
    situation: "Человеку нужно понять, как защитить свою позицию. Что показывает правовой навык?",
    actions: ["Выяснить факты ситуации", "Сразу обещать победу", "Найти норму или основание", "Игнорировать документы"],
    correct: [0, 2],
    mentorFix: "Сначала факты и документы, потом правовое основание. Без обещаний результата.",
    reaction: "Правовая позиция без фактов — это просто уверенный монолог.",
    caseName: "Логика правовой позиции",
  },
];

function vibrate(pattern: number | number[]) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
}

function getMissionScore(selected: number[], correct: number[]) {
  const hits = selected.filter((item) => correct.includes(item)).length;
  if (hits === 2 && selected.length === 2) return "strong";
  if (hits === 1) return "medium";
  return "weak";
}

function scoresFor(missionScore: ReturnType<typeof getMissionScore>, mentorDecision: MentorDecision): Scores {
  const base =
    missionScore === "strong"
      ? { trust: 30, quality: 30, opportunity: 20 }
      : missionScore === "medium"
        ? { trust: 15, quality: 18, opportunity: 12 }
        : { trust: 5, quality: 8, opportunity: 6 };

  if (mentorDecision === "improve") {
    return {
      trust: Math.min(100, base.trust + 40 + (missionScore === "strong" ? 30 : missionScore === "medium" ? 25 : 20)),
      quality: Math.min(100, base.quality + 40 + (missionScore === "strong" ? 30 : missionScore === "medium" ? 22 : 18)),
      opportunity: Math.min(100, base.opportunity + 20 + (missionScore === "strong" ? 60 : missionScore === "medium" ? 48 : 42)),
    };
  }

  return {
    trust: Math.min(100, base.trust + (missionScore === "strong" ? 40 : missionScore === "medium" ? 35 : 30)),
    quality: Math.min(100, base.quality + (missionScore === "strong" ? 35 : missionScore === "medium" ? 28 : 22)),
    opportunity: Math.min(100, base.opportunity + 10 + (missionScore === "strong" ? 40 : missionScore === "medium" ? 30 : 24)),
  };
}

function getMarketReaction(score: ReturnType<typeof getMissionScore>) {
  if (score === "strong") {
    return {
      title: "Рынок: «Окей, тут уже есть за что зацепиться» 👀",
      subtitle: "Наставник: «База есть. Сейчас сделаем из этого кейс.»",
      badge: "Навык пошёл в дело",
      result: "Сильно. Это уже похоже на работу, которую можно показать.",
    };
  }
  if (score === "medium") {
    return {
      title: "Заказчик: «Идея есть, но надо докрутить»",
      subtitle: "SkillBarter: «Для этого и существуют правки.»",
      badge: "Кейс почти готов",
      result: "Неплохо. Но кейс станет сильнее после правки наставника.",
    };
  }
  return {
    title: "Рынок: «Пока неубедительно»",
    subtitle: "Наставник: «Не страшно. Сейчас усилим результат.»",
    badge: "Теперь нужен апгрейд",
    result: "Не провал. В реальной работе правки — часть роста.",
  };
}

function finalReaction(scores: Scores) {
  if (scores.trust >= 95) return ["Работодатель: «Так, это уже интересно.»", "Заказчик: «Можно посмотреть подробнее?»"];
  if (scores.trust >= 80) return ["Хороший старт.", "Ещё пару кейсов — и профиль будет выглядеть мощно."];
  return ["Первый кейс есть.", "Теперь главное — не остановиться."];
}

function QuestProgress({ step }: { step: Step }) {
  const percent = Math.round(((step + 1) / 8) * 100);

  return (
    <div className="sticky top-0 z-30 border-b border-[rgba(168,85,247,0.16)] bg-[rgba(3,0,20,0.86)] px-4 py-3 backdrop-blur-xl">
      <div className="mx-auto flex max-w-4xl items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[rgba(168,85,247,0.32)] bg-[rgba(123,44,255,0.16)] text-sm font-bold">
          {step + 1}/8
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-[#AFA8C8]">
            <span>Skill ID Quest</span>
            <span>{percent}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[rgba(255,255,255,0.08)]">
            <motion.div
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-[#7B2CFF] via-[#C084FC] to-[#22C55E] shadow-[0_0_20px_rgba(168,85,247,0.6)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function QuestShell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 22, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.98 }}
      transition={{ duration: 0.32, ease: "easeOut" }}
      className={cn(
        "relative mx-auto w-full max-w-4xl overflow-hidden rounded-[2rem] border border-[rgba(168,85,247,0.22)] bg-[linear-gradient(180deg,rgba(18,12,42,0.92),rgba(7,4,26,0.86))] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.45),0_0_34px_rgba(123,44,255,0.16)] sm:p-8",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#C084FC] to-transparent" />
      {children}
    </motion.section>
  );
}

function MemeCard({ children, icon: Icon = Sparkles }: { children: React.ReactNode; icon?: LucideIcon }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="rounded-2xl border border-[rgba(168,85,247,0.2)] bg-[rgba(255,255,255,0.045)] p-4 text-sm leading-6 text-[#EDE9FE]"
    >
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#C084FC]" />
        <div className="break-words">{children}</div>
      </div>
    </motion.div>
  );
}

function PathLights({ active }: { active: number }) {
  return (
    <div className="mt-8">
      <div className="relative flex items-start justify-between gap-1">
        <div className="absolute left-5 right-5 top-5 h-px bg-[rgba(168,85,247,0.2)]" />
        <motion.div
          className="absolute left-5 top-5 h-px bg-gradient-to-r from-[#7B2CFF] to-[#22C55E]"
          animate={{ width: `${Math.min(100, (active / (questPath.length - 1)) * 100)}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        {questPath.map((item, index) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="relative flex w-12 flex-col items-center gap-2 sm:w-20"
          >
            <span
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border text-xs font-bold",
                index <= active
                  ? "border-[#C084FC] bg-[#7B2CFF] text-white shadow-[0_0_26px_rgba(123,44,255,0.55)]"
                  : "border-[rgba(168,85,247,0.2)] bg-[rgba(255,255,255,0.04)] text-[#AFA8C8]",
              )}
            >
              {index + 1}
            </span>
            <span className="hidden text-center text-[10px] uppercase tracking-[0.08em] text-[#AFA8C8] sm:block">{item}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ScorePills({ scores }: { scores: Scores }) {
  const items = [
    ["Доверие", scores.trust],
    ["Качество кейса", scores.quality],
    ["Шанс", scores.opportunity],
  ] as const;

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {items.map(([label, value]) => (
        <div key={label} className="rounded-2xl border border-[rgba(168,85,247,0.16)] bg-[rgba(255,255,255,0.04)] p-3">
          <div className="mb-2 flex items-center justify-between gap-3 text-xs">
            <span className="text-[#AFA8C8]">{label}</span>
            <span className="font-semibold text-[#E9D5FF]">{value}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[rgba(255,255,255,0.08)]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${value}%` }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-[#7B2CFF] to-[#22C55E]"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function MentorChat({ track, done }: { track: SkillTrack; done: boolean }) {
  return (
    <div className="rounded-[1.5rem] border border-[rgba(168,85,247,0.18)] bg-[rgba(255,255,255,0.04)] p-4">
      <div className="flex items-center gap-3">
        <motion.div
          initial={{ scale: 0.84 }}
          animate={{ scale: 1 }}
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7B2CFF] to-[#C084FC] font-bold shadow-[0_0_28px_rgba(123,44,255,0.45)]"
        >
          М
        </motion.div>
        <div>
          <p className="font-semibold">Наставник SkillBarter</p>
          <p className="text-sm text-[#AFA8C8]">{done ? "Правка получена" : "печатает..."}</p>
        </div>
      </div>
      <div className="mt-4 rounded-2xl bg-[rgba(7,4,26,0.74)] p-4 text-sm leading-6 text-[#EDE9FE]">
        {done ? track.mentorFix : <span className="inline-flex gap-1"><span>.</span><span>.</span><span>.</span></span>}
      </div>
    </div>
  );
}

function ResultCard({ goal, track, scores }: { goal: Goal; track: SkillTrack; scores: Scores }) {
  const reaction = finalReaction(scores);

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
          <p className="mt-2 text-2xl font-bold tracking-tight text-white">SB-EVENT-2026</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#7B2CFF] shadow-[0_0_30px_rgba(123,44,255,0.55)]">
          <Fingerprint className="h-6 w-6" />
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        {[
          ["Цель", goal.title],
          ["Направление", track.title],
          ["Кейс", track.caseName],
          ["Доверие", `${scores.trust}%`],
          ["Качество кейса", `${scores.quality}%`],
          ["Возможность", goal.opportunity],
        ].map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4 rounded-2xl border border-[rgba(168,85,247,0.16)] bg-[rgba(255,255,255,0.04)] px-4 py-3">
            <span className="text-sm text-[#AFA8C8]">{label}</span>
            <span className="break-words text-right text-sm font-semibold text-[#F4F0FF]">{value}</span>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-[rgba(34,197,94,0.22)] bg-[rgba(34,197,94,0.09)] p-4 text-sm leading-6 text-[#DCFCE7]">
        <p>{reaction[0]}</p>
        <p>{reaction[1]}</p>
      </div>
    </motion.div>
  );
}

function Confetti() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 18 }).map((_, index) => (
        <motion.span
          key={index}
          className="absolute left-1/2 top-24 h-1.5 w-1.5 rounded-full bg-[#C084FC]"
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos(index * 0.9) * (80 + index * 4),
            y: Math.sin(index * 1.7) * (60 + index * 3),
            opacity: 0,
            scale: 0.35,
          }}
          transition={{ duration: 0.9, delay: 0.08, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

export default function EventQuestPage() {
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState<Step>(0);
  const [goalId, setGoalId] = useState<GoalId | null>(null);
  const [trackId, setTrackId] = useState<SkillId | null>(null);
  const [selectedActions, setSelectedActions] = useState<number[]>([]);
  const [missionChecked, setMissionChecked] = useState(false);
  const [typingDone, setTypingDone] = useState(false);
  const [mentorDecision, setMentorDecision] = useState<MentorDecision>(null);
  const [shared, setShared] = useState(false);

  const goal = useMemo(() => goals.find((item) => item.id === goalId) ?? goals[0], [goalId]);
  const track = useMemo(() => tracks.find((item) => item.id === trackId) ?? tracks[0], [trackId]);
  const missionScore = getMissionScore(selectedActions, track.correct);
  const market = getMarketReaction(missionScore);
  const scores = scoresFor(missionScore, mentorDecision);

  useEffect(() => {
    if (step !== 5) return;
    setTypingDone(false);
    const id = window.setTimeout(() => setTypingDone(true), 900);
    return () => window.clearTimeout(id);
  }, [step, trackId]);

  const go = (next: Step) => {
    vibrate(18);
    setStep(next);
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  const reset = () => {
    setStep(0);
    setGoalId(null);
    setTrackId(null);
    setSelectedActions([]);
    setMissionChecked(false);
    setTypingDone(false);
    setMentorDecision(null);
    setShared(false);
  };

  const toggleAction = (index: number) => {
    if (missionChecked) return;
    setSelectedActions((current) => {
      if (current.includes(index)) return current.filter((item) => item !== index);
      if (current.length >= 2) return current;
      return [...current, index];
    });
    vibrate(15);
  };

  const shareQuest = async () => {
    const url = "https://skillbarter-mvp-bh44.vercel.app/event";
    try {
      if (navigator.share) {
        await navigator.share({ title: "Skill ID Quest", text: "Преврати навык в возможность", url });
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(123,44,255,0.34),transparent_34%),radial-gradient(circle_at_12%_32%,rgba(168,85,247,0.15),transparent_22%),radial-gradient(circle_at_88%_74%,rgba(34,197,94,0.1),transparent_22%),#030014]" />
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
        <div className="scene-grid opacity-70" />
        <div className="noise-layer" />
      </div>

      <QuestProgress step={step} />

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl flex-col px-4 pb-7 pt-6 sm:px-6">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <QuestShell key="intro" className="my-auto text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#7B2CFF] shadow-[0_0_42px_rgba(123,44,255,0.62)]"
              >
                <Fingerprint className="h-8 w-8" />
              </motion.div>
              <p className="mt-6 text-xs uppercase tracking-[0.24em] text-[#C4B5FD]">Skill ID Quest: преврати навык в возможность</p>
              <motion.h1
                initial={{ opacity: 0, y: 18, clipPath: "inset(0 0 100% 0)" }}
                animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
                transition={{ duration: 0.65, ease: "easeOut" }}
                className="mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-6xl"
              >
                Ты умеешь.
                <br />
                Но кто это увидит?
              </motion.h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#B8B0D9]">
                Пройди Skill ID Quest и преврати навык в кейс, который можно показать заказчику, наставнику или работодателю.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <MemeCard icon={MessageCircle}>😐 «Я умею» без кейса: ну… допустим</MemeCard>
                <MemeCard icon={Sparkles}>👀 Кейс в Skill ID: о, это уже можно посмотреть</MemeCard>
              </div>
              <PathLights active={7} />
              <button type="button" onClick={() => go(1)} className="btn-primary mt-9 w-full gap-2 py-4 text-base sm:w-auto sm:px-8">
                Начать квест
                <ArrowRight className="h-5 w-5" />
              </button>
            </QuestShell>
          )}

          {step === 1 && (
            <QuestShell key="goal">
              <p className="text-xs uppercase tracking-[0.22em] text-[#C4B5FD]">Цель</p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">Что ты хочешь получить от своего навыка?</h1>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {goals.map((item, index) => {
                  const Icon = item.icon;
                  const selected = goalId === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      type="button"
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0, scale: selected ? 1.03 : goalId ? 0.98 : 1 }}
                      transition={{ delay: index * 0.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => {
                        setGoalId(item.id);
                        vibrate(15);
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
                          <span className="block text-lg font-semibold">{item.title}</span>
                          <span className="mt-1 block text-sm leading-5 text-[#AFA8C8]">{item.description}</span>
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
              {goalId && <MemeCard icon={Target}>{goal.reaction}</MemeCard>}
              <button type="button" disabled={!goalId} onClick={() => go(2)} className="btn-primary mt-6 w-full gap-2 py-4 disabled:cursor-not-allowed disabled:opacity-45">
                Выбрать сферу
                <ArrowRight className="h-5 w-5" />
              </button>
            </QuestShell>
          )}

          {step === 2 && (
            <QuestShell key="track">
              <p className="text-xs uppercase tracking-[0.22em] text-[#C4B5FD]">Навык</p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">В какой сфере ты хочешь доказать себя?</h1>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {tracks.map((item, index) => {
                  const Icon = item.icon;
                  const selected = trackId === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      type="button"
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0, scale: selected ? 1.03 : trackId ? 0.98 : 1 }}
                      transition={{ delay: index * 0.035 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => {
                        setTrackId(item.id);
                        vibrate(15);
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
                          <span className="block text-lg font-semibold">{item.title}</span>
                          <span className="mt-1 block text-sm leading-5 text-[#AFA8C8]">{item.description}</span>
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
              {trackId && <MemeCard icon={Sparkles}>{track.reaction}</MemeCard>}
              <button type="button" disabled={!trackId} onClick={() => go(3)} className="btn-primary mt-6 w-full gap-2 py-4 disabled:cursor-not-allowed disabled:opacity-45">
                Получить миссию
                <ArrowRight className="h-5 w-5" />
              </button>
            </QuestShell>
          )}

          {step === 3 && (
            <QuestShell key="mission">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[rgba(123,44,255,0.18)] text-[#E9D5FF]">
                  <track.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[#C4B5FD]">Новая миссия</p>
                  <h1 className="mt-2 text-2xl font-bold leading-tight sm:text-4xl">{track.situation}</h1>
                </div>
              </div>
              <p className="mt-5 text-sm leading-6 text-[#AFA8C8]">
                Тебя не знают лично. Поэтому смотрят не на слова, а на то, что ты можешь сделать. Выбери 2 сильных действия.
              </p>

              <div className="mt-7 grid gap-3">
                {track.actions.map((action, index) => {
                  const selected = selectedActions.includes(index);
                  const correct = track.correct.includes(index);
                  return (
                    <motion.button
                      key={action}
                      type="button"
                      whileTap={{ scale: missionChecked ? 1 : 0.96 }}
                      disabled={missionChecked}
                      onClick={() => toggleAction(index)}
                      className={cn(
                        "min-h-16 rounded-2xl border px-4 py-4 text-left text-base font-medium transition",
                        !missionChecked && selected && "border-[#C084FC] bg-[rgba(123,44,255,0.24)]",
                        !missionChecked && !selected && "border-[rgba(168,85,247,0.18)] bg-[rgba(255,255,255,0.04)] hover:border-[#A855F7]",
                        missionChecked && correct && "border-[rgba(34,197,94,0.45)] bg-[rgba(34,197,94,0.14)] text-[#DCFCE7]",
                        missionChecked && selected && !correct && "border-[rgba(245,158,11,0.45)] bg-[rgba(245,158,11,0.12)] text-[#FEF3C7]",
                        missionChecked && !selected && !correct && "border-[rgba(168,85,247,0.12)] bg-[rgba(255,255,255,0.025)] text-[#8D87A9]",
                      )}
                    >
                      <span className="mr-3 text-[#C084FC]">{index + 1}.</span>
                      {action}
                    </motion.button>
                  );
                })}
              </div>

              {missionChecked && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-3">
                  <MemeCard icon={BadgeCheck}>{market.result}</MemeCard>
                  <ScorePills scores={scoresFor(missionScore, null)} />
                </motion.div>
              )}

              {!missionChecked ? (
                <button
                  type="button"
                  disabled={selectedActions.length !== 2}
                  onClick={() => {
                    setMissionChecked(true);
                    vibrate([18, 30, 18]);
                  }}
                  className="btn-primary mt-6 w-full gap-2 py-4 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Проверить решение
                  <ArrowRight className="h-5 w-5" />
                </button>
              ) : (
                <button type="button" onClick={() => go(4)} className="btn-primary mt-6 w-full gap-2 py-4">
                  Посмотреть реакцию рынка
                  <ArrowRight className="h-5 w-5" />
                </button>
              )}
            </QuestShell>
          )}

          {step === 4 && (
            <QuestShell key="market">
              <p className="text-xs uppercase tracking-[0.22em] text-[#C4B5FD]">Как тебя видит рынок</p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">{market.title}</h1>
              <div className="mt-6 grid gap-3">
                <MemeCard icon={UserRoundCheck}>{market.subtitle}</MemeCard>
                <MemeCard icon={Sparkles}>{market.badge}</MemeCard>
              </div>
              <button type="button" onClick={() => go(5)} className="btn-primary mt-7 w-full gap-2 py-4">
                Получить правку наставника
                <ArrowRight className="h-5 w-5" />
              </button>
            </QuestShell>
          )}

          {step === 5 && (
            <QuestShell key="mentor">
              <p className="text-xs uppercase tracking-[0.22em] text-[#C4B5FD]">Правка наставника</p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">Момент истины</h1>
              <p className="mt-3 text-sm leading-6 text-[#AFA8C8]">Обидеться на правку или сделать работу сильнее?</p>
              <div className="mt-6">
                <MentorChat track={track} done={typingDone} />
              </div>
              {typingDone && (
                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mt-6 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMentorDecision("ignore");
                      go(6);
                    }}
                    className="btn-ghost py-4"
                  >
                    Игнорировать правку
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMentorDecision("improve");
                      go(6);
                    }}
                    className="btn-primary gap-2 py-4"
                  >
                    Доработать результат
                    <Sparkles className="h-5 w-5" />
                  </button>
                </motion.div>
              )}
            </QuestShell>
          )}

          {step === 6 && (
            <QuestShell key="case" className="text-center">
              <Confetti />
              <p className="text-xs uppercase tracking-[0.22em] text-[#C4B5FD]">Проверяем результат...</p>
              <h1 className="mt-3 text-3xl font-bold sm:text-5xl">Кейс разблокирован</h1>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#AFA8C8]">
                Теперь это не «я вроде умею», а «вот что я сделал».
              </p>
              <div className="mx-auto mt-8 max-w-md space-y-3 text-left">
                {["Навык применён", "Наставник проверил", "Кейс добавлен в Skill ID"].map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.25, duration: 0.35 }}
                    className="flex items-center gap-3 rounded-2xl border border-[rgba(34,197,94,0.22)] bg-[rgba(34,197,94,0.09)] px-4 py-4"
                  >
                    <CheckCircle2 className="h-5 w-5 text-[#86EFAC]" />
                    <span className="font-medium">{item}</span>
                  </motion.div>
                ))}
              </div>
              <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-[rgba(34,197,94,0.3)] bg-[rgba(34,197,94,0.12)] px-4 py-2 text-sm font-semibold text-[#DCFCE7]">
                <BadgeCheck className="h-5 w-5" />
                Доказательство получено
              </div>
              <button type="button" onClick={() => go(7)} className="btn-primary mt-7 w-full gap-2 py-4 sm:w-auto sm:px-8">
                Открыть Skill ID
                <ArrowRight className="h-5 w-5" />
              </button>
            </QuestShell>
          )}

          {step === 7 && (
            <QuestShell key="finish">
              <Confetti />
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-[rgba(34,197,94,0.28)] bg-[rgba(34,197,94,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#BBF7D0]">
                  Работодатель заинтересовался
                </span>
                <span className="rounded-full border border-[rgba(168,85,247,0.25)] bg-[rgba(123,44,255,0.14)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#D8C4FF]">
                  Теперь есть что показать
                </span>
              </div>
              <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">Твой навык может работать на тебя</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-[#AFA8C8]">
                Неважно, ты программист, повар, педагог, психолог, юрист или дизайнер. Если твой результат можно показать, его можно оценить.
              </p>

              <div className="mt-7 grid gap-5 lg:grid-cols-[1fr_0.9fr] lg:items-start">
                <ResultCard goal={goal} track={track} scores={scores} />
                <div className="space-y-4">
                  <ScorePills scores={scores} />
                  <div className="grid gap-3">
                    {[
                      ["Заработок", "Когда есть кейс, заказчику проще поверить, что ты справишься.", Coins],
                      ["Работа", "Работодатель видит не только слова, а подтверждённый результат.", BriefcaseBusiness],
                      ["Рост", "Наставник помогает превратить попытку в работу, которую не стыдно показать.", TrendingIcon],
                    ].map(([title, text, Icon]) => {
                      const CardIcon = Icon as LucideIcon;
                      return (
                        <div key={title as string} className="rounded-2xl border border-[rgba(168,85,247,0.16)] bg-[rgba(255,255,255,0.04)] p-4">
                          <div className="flex items-start gap-3">
                            <CardIcon className="mt-0.5 h-5 w-5 shrink-0 text-[#C084FC]" />
                            <div>
                              <p className="font-semibold">{title as string}</p>
                              <p className="mt-1 text-sm leading-6 text-[#AFA8C8]">{text as string}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <MemeCard icon={Fingerprint}>
                SkillBarter — это платформа, где ты проходишь уроки, выполняешь реальные задачи, получаешь правки наставников и собираешь Skill ID. Так навык превращается в кейс, кейс — в доверие, а доверие — в возможность заработать, попасть в команду или начать карьеру.
              </MemeCard>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <Link href="/access" className="btn-primary gap-2 py-4">
                  Открыть MVP
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <button type="button" onClick={reset} className="btn-ghost gap-2 py-4">
                  <RefreshCcw className="h-5 w-5" />
                  Пройти ещё раз
                </button>
                <button type="button" onClick={shareQuest} className="btn-ghost gap-2 py-4">
                  <Send className="h-5 w-5" />
                  {shared ? "Ссылка готова" : "Показать другу"}
                </button>
              </div>
            </QuestShell>
          )}
        </AnimatePresence>

        <p className="relative mx-auto mt-6 max-w-md text-center text-xs leading-5 text-[#AFA8C8]">
          SkillBarter — платформа, где навык становится доказанным результатом.
        </p>
      </div>
    </main>
  );
}

function TrendingIcon(props: React.ComponentProps<"svg">) {
  return <Target {...props} />;
}
