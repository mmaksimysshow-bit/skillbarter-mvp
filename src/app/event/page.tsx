"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BriefcaseBusiness,
  ChefHat,
  CheckCircle2,
  Code2,
  Coins,
  Eye,
  Fingerprint,
  GraduationCap,
  HeartHandshake,
  LayoutTemplate,
  Palette,
  RefreshCcw,
  Scale,
  Send,
  Sparkles,
  Trophy,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type GoalId = "orders" | "job" | "portfolio" | "levelup";
type TrackId = "programming" | "design" | "cooking" | "teaching" | "psychology" | "law";
type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type MentorDecision = "improve" | "ignore" | null;

type Goal = {
  id: GoalId;
  title: string;
  short: string;
  reaction: string;
  opportunity: string;
  icon: LucideIcon;
};

type Track = {
  id: TrackId;
  title: string;
  short: string;
  icon: LucideIcon;
  riddle: string;
  riddleOptions: string[];
  riddleAnswer: number;
  riddleMeme: string;
  situation: string;
  actions: string[];
  correctActions: number[];
  mentorFix: string;
  skillMeme: string;
  caseName: string;
};

type Scores = {
  trust: number;
  quality: number;
  chance: number;
};

const pathItems = ["Навык", "Загадка", "Миссия", "Правка", "Кейс", "Skill ID", "Возможность"];

const goals: Goal[] = [
  {
    id: "orders",
    title: "Зарабатывать на заказах",
    short: "Навык должен быть понятен заказчику",
    reaction: "POV: ты понял, что навык может приносить деньги, если его можно доказать.",
    opportunity: "заказ",
    icon: Coins,
  },
  {
    id: "job",
    title: "Попасть на работу",
    short: "Работодателю нужен результат",
    reaction: "Работодатель не экстрасенс. Ему нужен результат.",
    opportunity: "работа",
    icon: BriefcaseBusiness,
  },
  {
    id: "portfolio",
    title: "Собрать портфолио",
    short: "Первый кейс запускает движение",
    reaction: "Портфолио само себя не соберёт. Открываем первый кейс.",
    opportunity: "портфолио",
    icon: Palette,
  },
  {
    id: "levelup",
    title: "Прокачаться",
    short: "Практика даёт уверенность",
    reaction: "Теория без практики — это как спортзал только в TikTok.",
    opportunity: "рост",
    icon: Trophy,
  },
];

const tracks: Track[] = [
  {
    id: "programming",
    title: "Программирование",
    short: "код, сайты, боты, автоматизация",
    icon: Code2,
    riddle:
      "Я не виден, пока всё работает. Но если меня нет — пользователь злится, кнопка молчит, форма грустит. Кто я?",
    riddleOptions: ["Красивый фон", "Проверка работы функции", "Название проекта"],
    riddleAnswer: 1,
    riddleMeme: "Кнопка нажалась. Пользователь не плачет. Уже успех.",
    situation: "Малому бизнесу нужна страница заявки.",
    actions: ["Добавить понятную форму", "Проверить, что кнопка работает", "Сделать только красивый фон", "Забыть про мобильную версию"],
    correctActions: [0, 1],
    mentorFix: "Добавь проверку формы и покажи, что заявка реально отправляется.",
    skillMeme: "Код есть. Теперь бы ещё показать, что он реально работает.",
    caseName: "Страница заявки для бизнеса",
  },
  {
    id: "design",
    title: "Дизайн",
    short: "визуал, интерфейсы, презентации",
    icon: LayoutTemplate,
    riddle:
      "Я не украшение, но без меня человек не понимает, куда смотреть. Я веду взгляд и спасаю слайд от хаоса. Кто я?",
    riddleOptions: ["Визуальная иерархия", "Случайный градиент", "17 шрифтов сразу"],
    riddleAnswer: 0,
    riddleMeme: "17 шрифтов покинули чат.",
    situation: "Клиенту нужен первый экран сайта.",
    actions: ["Понятный заголовок", "Видимая кнопка действия", "Много случайных эффектов", "Мелкий текст на весь экран"],
    correctActions: [0, 1],
    mentorFix: "Убери лишние эффекты. Сделай заголовок, пользу и кнопку главным фокусом.",
    skillMeme: "Красиво — хорошо. Понятно и полезно — уже кейс.",
    caseName: "Первый экран сайта",
  },
  {
    id: "cooking",
    title: "Поварское дело",
    short: "блюда, подача, меню, технология",
    icon: ChefHat,
    riddle:
      "Меня нельзя просто назвать «вкусно». Меня можно повторить, оценить и показать. Я превращаю блюдо в кейс. Кто я?",
    riddleOptions: ["Технология приготовления", "Настроение повара", "Красивое слово «авторское»"],
    riddleAnswer: 0,
    riddleMeme: "«Вкусно» — это эмоция. Технология — это уже доказательство.",
    situation: "Кафе просит блюдо для меню.",
    actions: ["Описать состав", "Продумать подачу", "Просто написать «вкусно»", "Не считать время приготовления"],
    correctActions: [0, 1],
    mentorFix: "Опиши технологию и подачу так, чтобы блюдо можно было повторить и оценить.",
    skillMeme: "Вкусно на словах не считается. Нужна технология, подача и результат.",
    caseName: "Блюдо для меню кафе",
  },
  {
    id: "teaching",
    title: "Педагогика",
    short: "объяснение, уроки, работа с учениками",
    icon: GraduationCap,
    riddle: "Если ученик кивнул, это ещё не значит, что понял. Что помогает проверить реальный результат?",
    riddleOptions: ["Вопрос или мини-задание", "Ещё больше терминов", "Сказать «ну это же очевидно»"],
    riddleAnswer: 0,
    riddleMeme: "Ученик кивнул. Опасный момент.",
    situation: "Нужно объяснить сложную тему новичку.",
    actions: ["Объяснить простыми словами", "Дать пример из жизни", "Завалить терминами", "Не проверять понимание"],
    correctActions: [0, 1],
    mentorFix: "Добавь пример и вопрос для проверки понимания.",
    skillMeme: "Объяснить так, чтобы поняли — это тоже сильный навык.",
    caseName: "Мини-урок для новичка",
  },
  {
    id: "psychology",
    title: "Психология",
    short: "коммуникация, поддержка, этика",
    icon: HeartHandshake,
    riddle:
      "Я помогаю не лезть с советами сразу, а сначала понять человека. Без меня разговор превращается в «сейчас я всё решу за тебя». Кто я?",
    riddleOptions: ["Уточнение запроса", "Давление мнением", "Диагноз за 5 секунд"],
    riddleAnswer: 0,
    riddleMeme: "Диагноз за 5 секунд — бан. Уточнение запроса — база.",
    situation: "Человек описал трудную ситуацию.",
    actions: ["Выслушать и уточнить запрос", "Соблюдать границы", "Сразу поставить диагноз", "Давить своим мнением"],
    correctActions: [0, 1],
    mentorFix: "Сначала уточни запрос и сохрани границы общения.",
    skillMeme: "Слушать, уточнять и не давить — база профессионального общения.",
    caseName: "Учебный разбор запроса",
  },
  {
    id: "law",
    title: "Юриспруденция",
    short: "факты, документы, правовая логика",
    icon: Scale,
    riddle:
      "Без меня правовая позиция звучит уверенно, но пусто. Я отвечаю на вопрос: «На чём основано?» Кто я?",
    riddleOptions: ["Факт и правовое основание", "Громкий голос", "Обещание победы"],
    riddleAnswer: 0,
    riddleMeme: "Обещать победу легко. Доказать позицию сложнее.",
    situation: "Человеку нужно понять, как защитить позицию.",
    actions: ["Выяснить факты", "Найти основание", "Сразу обещать победу", "Игнорировать документы"],
    correctActions: [0, 1],
    mentorFix: "Сначала факты и документы, потом основание. Без обещаний результата.",
    skillMeme: "Правовая позиция без фактов — это просто уверенный монолог.",
    caseName: "Логика правовой позиции",
  },
];

function vibrate(pattern: number | number[]) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(pattern);
}

function getMissionScore(selected: number[], correct: number[]) {
  const hits = selected.filter((item) => correct.includes(item)).length;
  if (hits === 2 && selected.length === 2) return "strong";
  if (hits === 1) return "medium";
  return "weak";
}

function calculateScores(riddleCorrect: boolean, missionScore: ReturnType<typeof getMissionScore>, decision: MentorDecision): Scores {
  const riddle = riddleCorrect ? 20 : 0;
  const mission =
    missionScore === "strong"
      ? { trust: 30, quality: 30, chance: 20 }
      : missionScore === "medium"
        ? { trust: 15, quality: 15, chance: 10 }
        : { trust: 5, quality: 5, chance: 5 };
  const mentor = decision === "improve" ? { trust: 40, quality: 40, chance: 20 } : { trust: 0, quality: 0, chance: 10 };
  return {
    trust: Math.min(100, riddle + mission.trust + mentor.trust + 10),
    quality: Math.min(100, mission.quality + mentor.quality + (riddleCorrect ? 10 : 0) + 15),
    chance: Math.min(100, mission.chance + mentor.chance + (decision === "improve" ? 35 : 25)),
  };
}

function marketCopy(score: ReturnType<typeof getMissionScore>) {
  if (score === "strong") {
    return {
      main: "Заказчик: «О, тут человек не просто говорил» 👀",
      mentor: "Наставник: «База есть. Сейчас сделаем кейс.»",
      employer: "Работодатель: «Можно смотреть результат.»",
      badge: "Навык пошёл в дело",
    };
  }
  if (score === "medium") {
    return {
      main: "Наставник: «Материал есть, сейчас докрутим.»",
      mentor: "SkillBarter: «Для этого и есть правки.»",
      employer: "Работодатель: «Идея есть, но мало доказательств.»",
      badge: "Кейс почти готов",
    };
  }
  return {
    main: "Рынок: «Пока сыровато.»",
    mentor: "SkillBarter: «Спокойно. Для этого и есть наставник.»",
    employer: "Заказчик: «Покажите результат — тогда поговорим.»",
    badge: "Нужен апгрейд",
  };
}

function finalMeme(scores: Scores) {
  if (scores.trust >= 90) return "Работодатель: «Так, это уже интересно.»";
  if (scores.trust >= 70) return "Хороший старт. Ещё пару кейсов — и профиль будет мощнее.";
  return "Первый кейс есть. Теперь главное — не остановиться.";
}

function QuestProgress({ step }: { step: Step }) {
  const percent = Math.round(((step + 1) / 9) * 100);
  return (
    <div className="sticky top-0 z-30 border-b border-[rgba(168,85,247,0.16)] bg-[rgba(3,0,20,0.86)] px-4 py-3 backdrop-blur-xl">
      <div className="mx-auto flex max-w-4xl items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[rgba(168,85,247,0.32)] bg-[rgba(123,44,255,0.16)] text-sm font-bold">
          {step + 1}/9
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
              className="h-full rounded-full bg-gradient-to-r from-[#7B2CFF] via-[#C084FC] to-[#22C55E]"
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

function StickerCard({
  face,
  title,
  text,
  tone = "violet",
}: {
  face: string;
  title: string;
  text: string;
  tone?: "violet" | "green" | "amber";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={cn(
        "relative overflow-hidden rounded-[1.5rem] border p-4",
        tone === "green" && "border-[rgba(34,197,94,0.28)] bg-[rgba(34,197,94,0.1)]",
        tone === "amber" && "border-[rgba(245,158,11,0.3)] bg-[rgba(245,158,11,0.1)]",
        tone === "violet" && "border-[rgba(168,85,247,0.22)] bg-[rgba(255,255,255,0.045)]",
      )}
    >
      <div className="flex items-center gap-3">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-[rgba(255,255,255,0.12)] bg-[rgba(123,44,255,0.18)] text-3xl shadow-[0_0_24px_rgba(123,44,255,0.25)]">
          {face}
        </div>
        <div>
          <p className="font-semibold">{title}</p>
          <p className="mt-1 text-sm leading-5 text-[#AFA8C8]">{text}</p>
        </div>
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
          animate={{ width: `${Math.min(100, (active / (pathItems.length - 1)) * 100)}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        {pathItems.map((item, index) => (
          <motion.div key={item} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="relative flex w-12 flex-col items-center gap-2 sm:w-20">
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

function ScoreBars({ scores }: { scores: Scores }) {
  const items = [
    ["Доверие", scores.trust],
    ["Качество кейса", scores.quality],
    ["Шанс", scores.chance],
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

function MentorChat({ track, done }: { track: Track; done: boolean }) {
  return (
    <div className="rounded-[1.5rem] border border-[rgba(168,85,247,0.18)] bg-[rgba(255,255,255,0.04)] p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7B2CFF] to-[#C084FC] text-2xl shadow-[0_0_28px_rgba(123,44,255,0.45)]">
          🧠
        </div>
        <div>
          <p className="font-semibold">Наставник в чате</p>
          <p className="text-sm text-[#AFA8C8]">{done ? "Правка получена" : "печатает..."}</p>
        </div>
      </div>
      <div className="mt-4 rounded-2xl bg-[rgba(7,4,26,0.74)] p-4 text-sm leading-6 text-[#EDE9FE]">
        {done ? track.mentorFix : <span className="inline-flex gap-1"><span>.</span><span>.</span><span>.</span></span>}
      </div>
    </div>
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
          animate={{ x: Math.cos(index * 0.9) * (80 + index * 4), y: Math.sin(index * 1.7) * (60 + index * 3), opacity: 0, scale: 0.35 }}
          transition={{ duration: 0.9, delay: 0.08, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

function SkillIdCard({ goal, track, scores }: { goal: Goal; track: Track; scores: Scores }) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-[rgba(192,132,252,0.36)] bg-[linear-gradient(150deg,rgba(35,18,74,0.96),rgba(8,5,28,0.94))] p-5 shadow-[0_0_44px_rgba(123,44,255,0.28)]">
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
    </div>
  );
}

export default function EventQuestPage() {
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState<Step>(0);
  const [goalId, setGoalId] = useState<GoalId | null>(null);
  const [trackId, setTrackId] = useState<TrackId | null>(null);
  const [riddleAnswer, setRiddleAnswer] = useState<number | null>(null);
  const [selectedActions, setSelectedActions] = useState<number[]>([]);
  const [missionChecked, setMissionChecked] = useState(false);
  const [typingDone, setTypingDone] = useState(false);
  const [mentorDecision, setMentorDecision] = useState<MentorDecision>(null);
  const [shared, setShared] = useState(false);

  const goal = useMemo(() => goals.find((item) => item.id === goalId) ?? goals[0], [goalId]);
  const track = useMemo(() => tracks.find((item) => item.id === trackId) ?? tracks[0], [trackId]);
  const riddleCorrect = riddleAnswer === track.riddleAnswer;
  const missionScore = getMissionScore(selectedActions, track.correctActions);
  const scores = calculateScores(riddleCorrect, missionScore, mentorDecision);
  const market = marketCopy(missionScore);

  useEffect(() => {
    if (step !== 6) return;
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
    setRiddleAnswer(null);
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
      if (navigator.share) await navigator.share({ title: "Skill ID Quest", text: "Докажи навык в мини-квесте", url });
      else if (navigator.clipboard) await navigator.clipboard.writeText(url);
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
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-[#7B2CFF] shadow-[0_0_42px_rgba(123,44,255,0.62)]">
                <Fingerprint className="h-8 w-8" />
              </div>
              <p className="mt-6 text-xs uppercase tracking-[0.24em] text-[#C4B5FD]">Skill ID Quest</p>
              <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
                Ты умеешь.
                <br />
                Но кто это увидит?
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#B8B0D9]">
                Пройди Skill ID Quest и преврати навык в кейс, который можно показать заказчику, наставнику или работодателю.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <StickerCard face="😐" title="Я умею" text="рынок: ну допустим" tone="amber" />
                <StickerCard face="👀" title="Вот мой кейс в Skill ID" text="рынок: о, это уже интересно" tone="green" />
              </div>
              <PathLights active={6} />
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
                      initial={{ opacity: 0, y: 12 }}
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
                        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[rgba(123,44,255,0.18)] text-[#E9D5FF]">
                          <Icon className="h-6 w-6" />
                        </span>
                        <span>
                          <span className="block text-lg font-semibold">{item.title}</span>
                          <span className="mt-1 block text-sm leading-5 text-[#AFA8C8]">{item.short}</span>
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
              {goalId && <StickerCard face="💡" title="Окей, цель есть" text={goal.reaction} />}
              <button type="button" disabled={!goalId} onClick={() => go(2)} className="btn-primary mt-6 w-full gap-2 py-4 disabled:cursor-not-allowed disabled:opacity-45">
                Выбрать профессию
                <ArrowRight className="h-5 w-5" />
              </button>
            </QuestShell>
          )}

          {step === 2 && (
            <QuestShell key="track">
              <p className="text-xs uppercase tracking-[0.22em] text-[#C4B5FD]">Профессия</p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">В какой сфере докажешь себя?</h1>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {tracks.map((item, index) => {
                  const Icon = item.icon;
                  const selected = trackId === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      type="button"
                      initial={{ opacity: 0, y: 12 }}
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
                        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[rgba(123,44,255,0.18)] text-[#E9D5FF]">
                          <Icon className="h-6 w-6" />
                        </span>
                        <span>
                          <span className="block text-lg font-semibold">{item.title}</span>
                          <span className="mt-1 block text-sm leading-5 text-[#AFA8C8]">{item.short}</span>
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
              {trackId && <StickerCard face="🧩" title="Навык выбран" text={`${track.skillMeme} Теперь нужна не фраза, а доказательство.`} />}
              <button type="button" disabled={!trackId} onClick={() => go(3)} className="btn-primary mt-6 w-full gap-2 py-4 disabled:cursor-not-allowed disabled:opacity-45">
                Открыть загадку
                <ArrowRight className="h-5 w-5" />
              </button>
            </QuestShell>
          )}

          {step === 3 && (
            <QuestShell key="riddle">
              <p className="text-xs uppercase tracking-[0.22em] text-[#C4B5FD]">Первое испытание</p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">Отгадай, что делает навык доказанным</h1>
              <StickerCard face="🤔" title="Загадка" text={track.riddle} />
              <div className="mt-6 grid gap-3">
                {track.riddleOptions.map((option, index) => {
                  const answered = riddleAnswer !== null;
                  const chosen = riddleAnswer === index;
                  const correct = track.riddleAnswer === index;
                  return (
                    <motion.button
                      key={option}
                      type="button"
                      whileTap={{ scale: answered ? 1 : 0.96 }}
                      disabled={answered}
                      onClick={() => {
                        setRiddleAnswer(index);
                        vibrate(correct ? [15, 20, 15] : 18);
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
              {riddleAnswer !== null && (
                <div className="mt-5">
                  <StickerCard
                    face={riddleCorrect ? "😎" : "😅"}
                    title={riddleCorrect ? "+20 доверия" : "Не провал"}
                    text={riddleCorrect ? track.riddleMeme : "Наставник позже поможет докрутить результат."}
                    tone={riddleCorrect ? "green" : "amber"}
                  />
                </div>
              )}
              <button type="button" disabled={riddleAnswer === null} onClick={() => go(4)} className="btn-primary mt-6 w-full gap-2 py-4 disabled:cursor-not-allowed disabled:opacity-45">
                Получить миссию
                <ArrowRight className="h-5 w-5" />
              </button>
            </QuestShell>
          )}

          {step === 4 && (
            <QuestShell key="mission">
              <div className="flex items-start gap-3">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[rgba(123,44,255,0.18)] text-[#E9D5FF]">
                  <track.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[#C4B5FD]">Реальная миссия</p>
                  <h1 className="mt-2 text-2xl font-bold leading-tight sm:text-4xl">{track.situation}</h1>
                </div>
              </div>
              <p className="mt-5 text-sm leading-6 text-[#AFA8C8]">Выбери 2 действия, которые превратят работу в кейс.</p>
              <div className="mt-7 grid gap-3">
                {track.actions.map((action, index) => {
                  const selected = selectedActions.includes(index);
                  const correct = track.correctActions.includes(index);
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
                <div className="mt-6 space-y-3">
                  <StickerCard face={missionScore === "strong" ? "👀" : missionScore === "medium" ? "🛠️" : "🥲"} title={market.badge} text={market.main} tone={missionScore === "strong" ? "green" : missionScore === "medium" ? "violet" : "amber"} />
                  <ScoreBars scores={calculateScores(riddleCorrect, missionScore, null)} />
                </div>
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
                <button type="button" onClick={() => go(5)} className="btn-primary mt-6 w-full gap-2 py-4">
                  Как это видит рынок?
                  <ArrowRight className="h-5 w-5" />
                </button>
              )}
            </QuestShell>
          )}

          {step === 5 && (
            <QuestShell key="market">
              <p className="text-xs uppercase tracking-[0.22em] text-[#C4B5FD]">Мем-реакция рынка</p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">Три зрителя твоего кейса</h1>
              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <StickerCard face="🧐" title="Рынок" text={market.main} tone={missionScore === "weak" ? "amber" : "violet"} />
                <StickerCard face="🧠" title="Наставник" text={market.mentor} />
                <StickerCard face="💼" title="Работодатель" text={market.employer} tone={missionScore === "strong" ? "green" : "violet"} />
              </div>
              <button type="button" onClick={() => go(6)} className="btn-primary mt-7 w-full gap-2 py-4">
                Получить правку наставника
                <ArrowRight className="h-5 w-5" />
              </button>
            </QuestShell>
          )}

          {step === 6 && (
            <QuestShell key="mentor">
              <p className="text-xs uppercase tracking-[0.22em] text-[#C4B5FD]">Наставник в чате</p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">Обидеться или доработать?</h1>
              <div className="mt-6">
                <MentorChat track={track} done={typingDone} />
              </div>
              {typingDone && (
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMentorDecision("ignore");
                      go(7);
                    }}
                    className="btn-ghost py-4"
                  >
                    Обидеться и игнорировать
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMentorDecision("improve");
                      go(7);
                    }}
                    className="btn-primary gap-2 py-4"
                  >
                    Доработать как будущий профи
                    <Sparkles className="h-5 w-5" />
                  </button>
                </div>
              )}
            </QuestShell>
          )}

          {step === 7 && (
            <QuestShell key="case" className="text-center">
              <Confetti />
              <p className="text-xs uppercase tracking-[0.22em] text-[#C4B5FD]">Проверяем результат...</p>
              <h1 className="mt-3 text-3xl font-bold sm:text-5xl">Кейс разблокирован</h1>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#AFA8C8]">Теперь это не «я вроде умею», а «вот что я сделал».</p>
              <div className="mx-auto mt-8 max-w-md space-y-3 text-left">
                {["Навык применён", "Работа доработана", "Наставник проверил", "Кейс добавлен в Skill ID"].map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.22, duration: 0.35 }}
                    className="flex items-center gap-3 rounded-2xl border border-[rgba(34,197,94,0.22)] bg-[rgba(34,197,94,0.09)] px-4 py-4"
                  >
                    <CheckCircle2 className="h-5 w-5 text-[#86EFAC]" />
                    <span className="font-medium">{item}</span>
                  </motion.div>
                ))}
              </div>
              <div className="mt-7 flex flex-wrap justify-center gap-2">
                {["Доказательство получено", "Портфолио оживает", "Skill ID обновлён"].map((badge) => (
                  <span key={badge} className="rounded-full border border-[rgba(34,197,94,0.3)] bg-[rgba(34,197,94,0.12)] px-4 py-2 text-sm font-semibold text-[#DCFCE7]">
                    {badge}
                  </span>
                ))}
              </div>
              <button type="button" onClick={() => go(8)} className="btn-primary mt-7 w-full gap-2 py-4 sm:w-auto sm:px-8">
                Открыть Skill ID
                <ArrowRight className="h-5 w-5" />
              </button>
            </QuestShell>
          )}

          {step === 8 && (
            <QuestShell key="finish">
              <Confetti />
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-[rgba(34,197,94,0.28)] bg-[rgba(34,197,94,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#BBF7D0]">
                  Работодатель проснулся
                </span>
                <span className="rounded-full border border-[rgba(168,85,247,0.25)] bg-[rgba(123,44,255,0.14)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#D8C4FF]">
                  Это уже не просто слова
                </span>
              </div>
              <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">SKILL ID ACTIVATED</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-[#AFA8C8]">Навык стал кейсом. Кейс стал доверием. Доверие стало шансом на возможность.</p>
              <div className="mt-7 grid gap-5 lg:grid-cols-[1fr_0.9fr] lg:items-start">
                <SkillIdCard goal={goal} track={track} scores={scores} />
                <div className="space-y-4">
                  <ScoreBars scores={scores} />
                  <StickerCard face="💬" title="Мем-реакция" text={finalMeme(scores)} tone={scores.trust >= 90 ? "green" : "violet"} />
                  <div className="grid gap-3">
                    {[
                      ["Можно показать заказчику", Eye],
                      ["Можно добавить в портфолио", Palette],
                      ["Можно использовать на собеседовании", BriefcaseBusiness],
                    ].map(([title, Icon]) => {
                      const CardIcon = Icon as LucideIcon;
                      return (
                        <div key={title as string} className="flex items-center gap-3 rounded-2xl border border-[rgba(168,85,247,0.16)] bg-[rgba(255,255,255,0.04)] p-4">
                          <CardIcon className="h-5 w-5 shrink-0 text-[#C084FC]" />
                          <span className="text-sm font-semibold">{title as string}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <StickerCard
                face="🚀"
                title="Что такое SkillBarter"
                text="Ты проходишь уроки, выполняешь реальные задачи, получаешь правки наставников и собираешь Skill ID. Так навык превращается в кейс, кейс — в доверие, а доверие — в возможность заработать, попасть в команду или начать карьеру."
              />
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
