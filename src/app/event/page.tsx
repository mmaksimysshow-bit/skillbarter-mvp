"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ChefHat,
  Code2,
  Fingerprint,
  GraduationCap,
  HeartHandshake,
  Palette,
  RefreshCcw,
  Scale,
  ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Phase = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
type ProId = "code" | "design" | "cook" | "teach" | "psy" | "law";
type MemeKind = "boss" | "client" | "mentor" | "market" | "employer" | "skill" | "money" | "panic";

type Hotspot = {
  id: string;
  label: string;
  issue: boolean;
  hint: string;
  x: string;
  y: string;
  w: string;
  h: string;
};

type Pro = {
  id: ProId;
  title: string;
  role: string;
  icon: LucideIcon;
  client: string;
  order: string;
  rawWork: string;
  caseTitle: string;
  meme: string;
  hotspots: Hotspot[];
  repairSteps: string[];
  decoys: string[];
  mentorCards: Array<{ id: string; title: string; good: boolean; note: string }>;
  bossAnswers: string[];
};

const professions: Pro[] = [
  {
    id: "code",
    title: "Программирование",
    role: "страница заявки",
    icon: Code2,
    client: "Локальный сервис ремонта",
    order: "Нужна страница, где клиент с телефона оставляет заявку. Заказчик хочет понять, работает ли форма, а не просто выглядит красиво.",
    rawWork: "Сырая страница: форма есть, кнопка есть, но результат пока не доказан.",
    caseTitle: "Рабочая заявка для бизнеса",
    meme: "Код есть. Теперь докажи, что он реально работает.",
    hotspots: [
      { id: "form", label: "Форма не отправляет", issue: true, hint: "Подключить отправку и показать успешную заявку.", x: "54%", y: "58%", w: "30%", h: "18%" },
      { id: "mobile", label: "Мобильная версия ломается", issue: true, hint: "Проверить ширину, кнопки и поля на телефоне.", x: "13%", y: "62%", w: "25%", h: "22%" },
      { id: "proof", label: "Нет доказательства результата", issue: true, hint: "Добавить скрин или состояние успешной отправки.", x: "42%", y: "30%", w: "38%", h: "15%" },
      { id: "logo", label: "Логотип маленький", issue: false, hint: "Это не мешает кейсу. Главное - работающая заявка.", x: "12%", y: "16%", w: "20%", h: "13%" },
      { id: "shadow", label: "Тень неоновая", issue: false, hint: "Стиль не доказывает навык.", x: "66%", y: "18%", w: "20%", h: "14%" },
    ],
    repairSteps: ["Починить отправку", "Проверить на телефоне", "Показать успешную заявку"],
    decoys: ["Добавить еще фон", "Спрятать ошибку", "Переименовать кнопку"],
    mentorCards: [
      { id: "test", title: "Тест формы", good: true, note: "доказательство работы" },
      { id: "mobile", title: "Скрин с телефона", good: true, note: "адаптив подтвержден" },
      { id: "comment", title: "Короткое описание решения", good: true, note: "заказчик понял" },
      { id: "glow", title: "Больше свечения", good: false, note: "кейс не усиливает" },
    ],
    bossAnswers: ["Вот рабочая форма", "Вот правка наставника", "Вот Skill ID с кейсом"],
  },
  {
    id: "design",
    title: "Дизайн",
    role: "первый экран сайта",
    icon: Palette,
    client: "Школа английского",
    order: "Нужен первый экран, где за 5 секунд понятно: что предлагают, кому полезно и куда нажимать.",
    rawWork: "Сырой экран: красиво, но взгляд бегает, кнопка теряется, смысл не считывается.",
    caseTitle: "Первый экран с понятным CTA",
    meme: "Красиво - хорошо. Понятно и полезно - уже кейс.",
    hotspots: [
      { id: "headline", label: "Заголовок не объясняет пользу", issue: true, hint: "Сделать пользу конкретной.", x: "17%", y: "25%", w: "42%", h: "16%" },
      { id: "cta", label: "Кнопка теряется", issue: true, hint: "Сделать один главный CTA.", x: "61%", y: "62%", w: "25%", h: "15%" },
      { id: "chaos", label: "Слишком много эффектов", issue: true, hint: "Убрать шум, оставить фокус.", x: "62%", y: "20%", w: "24%", h: "22%" },
      { id: "dark", label: "Темный фон", issue: false, hint: "Фон может быть темным, если текст читается.", x: "12%", y: "68%", w: "20%", h: "14%" },
      { id: "icon", label: "Иконка маленькая", issue: false, hint: "Не главная проблема.", x: "42%", y: "54%", w: "16%", h: "12%" },
    ],
    repairSteps: ["Переписать заголовок", "Выделить CTA", "Убрать визуальный шум"],
    decoys: ["Добавить 3 шрифта", "Сделать кнопку меньше", "Положить еще градиент"],
    mentorCards: [
      { id: "hierarchy", title: "Визуальная иерархия", good: true, note: "взгляд идет правильно" },
      { id: "cta", title: "CTA виден", good: true, note: "действие понятно" },
      { id: "mobile", title: "Мобильная проверка", good: true, note: "экран не развалился" },
      { id: "decor", title: "Еще декора", good: false, note: "шумит" },
    ],
    bossAnswers: ["Вот экран с фокусом", "Вот правка наставника", "Вот Skill ID с кейсом"],
  },
  {
    id: "cook",
    title: "Поварское дело",
    role: "блюдо для меню",
    icon: ChefHat,
    client: "Небольшое кафе",
    order: "Нужно блюдо для меню: состав, технология, время, подача. Не просто «вкусно», а кейс, который можно оценить.",
    rawWork: "Сырой кейс: фото аппетитное, но нет состава, технологии и времени.",
    caseTitle: "Блюдо для меню кафе",
    meme: "«Вкусно» на словах не считается. Нужна технология.",
    hotspots: [
      { id: "recipe", label: "Нет состава", issue: true, hint: "Добавить ингредиенты и граммовки.", x: "16%", y: "42%", w: "30%", h: "18%" },
      { id: "tech", label: "Нет технологии", issue: true, hint: "Описать шаги приготовления.", x: "55%", y: "44%", w: "32%", h: "18%" },
      { id: "time", label: "Нет времени", issue: true, hint: "Указать время приготовления.", x: "33%", y: "66%", w: "30%", h: "14%" },
      { id: "plate", label: "Тарелка круглая", issue: false, hint: "Форма тарелки не проблема.", x: "64%", y: "19%", w: "20%", h: "14%" },
      { id: "name", label: "Название красивое", issue: false, hint: "Название не заменяет технологию.", x: "18%", y: "21%", w: "26%", h: "12%" },
    ],
    repairSteps: ["Добавить состав", "Описать технологию", "Показать подачу"],
    decoys: ["Написать «очень вкусно»", "Скрыть время", "Сделать фото ярче"],
    mentorCards: [
      { id: "ingredients", title: "Состав и граммовки", good: true, note: "можно повторить" },
      { id: "steps", title: "Технология", good: true, note: "виден навык" },
      { id: "serve", title: "Подача результата", good: true, note: "можно показать" },
      { id: "word", title: "Слово «авторское»", good: false, note: "не доказательство" },
    ],
    bossAnswers: ["Вот блюдо с технологией", "Вот правка наставника", "Вот Skill ID с кейсом"],
  },
  {
    id: "teach",
    title: "Педагогика",
    role: "мини-урок",
    icon: GraduationCap,
    client: "Подготовительный курс",
    order: "Нужно объяснить сложную тему новичку так, чтобы он понял и смог выполнить маленькое задание.",
    rawWork: "Сырой мини-урок: тема есть, объяснение есть, но нет примера и проверки понимания.",
    caseTitle: "Мини-урок для новичка",
    meme: "Ученик кивнул. Но понял ли он?",
    hotspots: [
      { id: "example", label: "Нет примера", issue: true, hint: "Добавить пример из жизни.", x: "17%", y: "42%", w: "32%", h: "18%" },
      { id: "check", label: "Нет проверки понимания", issue: true, hint: "Добавить вопрос или мини-задание.", x: "56%", y: "61%", w: "32%", h: "18%" },
      { id: "terms", label: "Слишком много терминов", issue: true, hint: "Объяснить проще.", x: "55%", y: "25%", w: "30%", h: "18%" },
      { id: "topic", label: "Есть тема", issue: false, hint: "Тема нужна. Не ломаем.", x: "16%", y: "20%", w: "24%", h: "12%" },
      { id: "color", label: "Цвет спокойный", issue: false, hint: "Цвет не мешает.", x: "34%", y: "68%", w: "18%", h: "12%" },
    ],
    repairSteps: ["Упростить объяснение", "Добавить пример", "Проверить понимание"],
    decoys: ["Добавить терминов", "Сказать «очевидно»", "Убрать задание"],
    mentorCards: [
      { id: "simple", title: "Простое объяснение", good: true, note: "новичок понял" },
      { id: "example", title: "Пример из жизни", good: true, note: "стало ясно" },
      { id: "quiz", title: "Мини-вопрос", good: true, note: "есть проверка" },
      { id: "terms", title: "Больше терминов", good: false, note: "сложно" },
    ],
    bossAnswers: ["Вот мини-урок с проверкой", "Вот правка наставника", "Вот Skill ID с кейсом"],
  },
  {
    id: "psy",
    title: "Психология",
    role: "этичный разбор",
    icon: HeartHandshake,
    client: "Учебный центр",
    order: "Нужно показать безопасную коммуникацию: уточнить запрос, не давить, не ставить диагнозы.",
    rawWork: "Сырой диалог: ответ звучит быстро и обесценивающе. Границы не обозначены.",
    caseTitle: "Этичный разбор запроса",
    meme: "Диагноз за 5 секунд - сразу бан.",
    hotspots: [
      { id: "request", label: "Запрос не уточнен", issue: true, hint: "Сначала понять, с чем пришел человек.", x: "18%", y: "44%", w: "30%", h: "18%" },
      { id: "borders", label: "Нет границ", issue: true, hint: "Сохранить безопасную коммуникацию.", x: "57%", y: "61%", w: "30%", h: "18%" },
      { id: "devalue", label: "Обесценивание", issue: true, hint: "Не говорить «просто не думай».", x: "55%", y: "28%", w: "32%", h: "18%" },
      { id: "soft", label: "Мягкий тон", issue: false, hint: "Мягкий тон полезен.", x: "18%", y: "24%", w: "22%", h: "12%" },
      { id: "pause", label: "Пауза", issue: false, hint: "Пауза не проблема.", x: "36%", y: "70%", w: "18%", h: "12%" },
    ],
    repairSteps: ["Уточнить запрос", "Сохранить границы", "Ответить бережно"],
    decoys: ["Поставить диагноз", "Давить мнением", "Решить за человека"],
    mentorCards: [
      { id: "ask", title: "Уточняющий вопрос", good: true, note: "сначала понять" },
      { id: "ethics", title: "Этичные границы", good: true, note: "безопасно" },
      { id: "support", title: "Бережный ответ", good: true, note: "не давит" },
      { id: "diagnose", title: "Диагноз сразу", good: false, note: "нельзя" },
    ],
    bossAnswers: ["Вот этичный диалог", "Вот правка наставника", "Вот Skill ID с кейсом"],
  },
  {
    id: "law",
    title: "Юриспруденция",
    role: "правовая позиция",
    icon: Scale,
    client: "Учебная юридическая клиника",
    order: "Нужно собрать позицию: факты, документы, основание. Без обещаний победы.",
    rawWork: "Сырая позиция: звучит уверенно, но фактов мало, документы не разобраны.",
    caseTitle: "Правовая позиция",
    meme: "Громкий голос - не доказательство.",
    hotspots: [
      { id: "facts", label: "Не хватает фактов", issue: true, hint: "Сначала фактическая картина.", x: "18%", y: "42%", w: "31%", h: "18%" },
      { id: "docs", label: "Документы не проверены", issue: true, hint: "Документы - основа позиции.", x: "56%", y: "44%", w: "32%", h: "18%" },
      { id: "promise", label: "Обещание победы", issue: true, hint: "Нельзя обещать результат без основания.", x: "37%", y: "66%", w: "30%", h: "14%" },
      { id: "tone", label: "Уверенный тон", issue: false, hint: "Тон не заменяет факты, но сам по себе не ошибка.", x: "14%", y: "22%", w: "24%", h: "12%" },
      { id: "date", label: "Дата указана", issue: false, hint: "Дата полезна.", x: "64%", y: "22%", w: "20%", h: "12%" },
    ],
    repairSteps: ["Собрать факты", "Проверить документы", "Сформулировать основание"],
    decoys: ["Обещать победу", "Спорить громче", "Игнорировать документы"],
    mentorCards: [
      { id: "facts", title: "Факты", good: true, note: "основа" },
      { id: "docs", title: "Документы", good: true, note: "доказательство" },
      { id: "base", title: "Основание", good: true, note: "логика" },
      { id: "promise", title: "Гарантия победы", good: false, note: "нельзя" },
    ],
    bossAnswers: ["Вот позиция на фактах", "Вот правка наставника", "Вот Skill ID с кейсом"],
  },
];

const bossRounds = [
  { question: "А где опыт?", artifact: "case", title: "Показать кейс" },
  { question: "А кто проверил?", artifact: "mentor", title: "Показать правку наставника" },
  { question: "А где посмотреть?", artifact: "skill", title: "Открыть Skill ID" },
];

const clamp = (value: number) => Math.max(0, Math.min(100, value));

const getAssets = (profession: Pro) => [
  ...profession.repairSteps.map((title, index) => ({ id: `good-${index}`, title, good: true, note: "усиливает кейс" })),
  { id: "good-result", title: "Скрин результата", good: true, note: "можно показать" },
  ...profession.decoys.map((title, index) => ({ id: `bad-${index}`, title, good: false, note: "ловушка" })),
  { id: "bad-empty", title: "Пустое описание", good: false, note: "не доказательство" },
];

export default function EventPage() {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>(0);
  const [professionId, setProfessionId] = useState<ProId | null>(null);
  const [route, setRoute] = useState<string[]>([]);
  const [caseCards, setCaseCards] = useState<string[]>([]);
  const [fixed, setFixed] = useState<string[]>([]);
  const [mentor, setMentor] = useState<string[]>([]);
  const [bossRound, setBossRound] = useState(0);
  const [bossWrong, setBossWrong] = useState(0);
  const [moves, setMoves] = useState(7);
  const [combo, setCombo] = useState(1);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("Выбери профессию. Дальше будет настоящий мини-заказ, а не тест.");
  const [shared, setShared] = useState(false);

  const profession = professions.find((item) => item.id === professionId) ?? professions[0];
  const availableAssets = getAssets(profession);
  const goodCaseCards = caseCards.filter((id) => availableAssets.find((asset) => asset.id === id)?.good).length;
  const caseReady = goodCaseCards >= 4;
  const repairReady = fixed.length >= 3;
  const mentorReady = mentor.length >= 3;

  const stats = useMemo(
    () => ({
      trust: clamp(score + route.length * 6 + goodCaseCards * 8 + fixed.length * 9 + mentor.length * 9 + bossRound * 10),
      casePower: clamp(route.length * 7 + goodCaseCards * 12 + fixed.length * 10 + mentor.length * 10),
      chance: clamp(score + goodCaseCards * 7 + fixed.length * 8 + mentor.length * 10 + bossRound * 12),
    }),
    [score, route.length, goodCaseCards, fixed.length, mentor.length, bossRound],
  );

  const reward = (points: number, text: string) => {
    setScore((value) => clamp(value + points * combo));
    setCombo((value) => Math.min(9, value + 1));
    setMessage(text);
    navigator.vibrate?.(20);
  };

  const punish = (text: string) => {
    setCombo(1);
    setScore((value) => Math.max(0, value - 3));
    setMessage(text);
    navigator.vibrate?.([18, 30, 18]);
  };

  const chooseProfession = (item: Pro) => {
    setProfessionId(item.id);
    setRoute([]);
    setCaseCards([]);
    setFixed([]);
    setMentor([]);
    setBossRound(0);
    setBossWrong(0);
    setMoves(7);
    reward(4, item.meme);
  };

  const chooseRoute = (label: string) => {
    const expected = profession.repairSteps[route.length];
    if (route.includes(label)) return;
    if (label !== expected) {
      punish("Маршрут не сходится. Настоящий кейс начинается с правильного процесса.");
      return;
    }
    setRoute((items) => [...items, label]);
    reward(5, `${label}: шаг принят. Так работа становится кейсом.`);
  };

  const chooseAsset = (id: string) => {
    if (caseCards.includes(id) || caseCards.length >= 4 || moves <= 0) return;
    const asset = availableAssets.find((item) => item.id === id);
    if (!asset) return;
    setCaseCards((items) => [...items, id]);
    setMoves((value) => value - 1);
    if (asset.good) {
      reward(6, `${asset.title}: добавлено в кейс.`);
    } else {
      punish(`${asset.title}: выглядит как действие, но навык не доказывает.`);
    }
  };

  const tapHotspot = (spot: Hotspot) => {
    if (fixed.includes(spot.id)) return;
    if (!spot.issue) {
      punish(spot.hint);
      return;
    }
    setFixed((items) => [...items, spot.id]);
    reward(8, `${spot.label}: найдено. ${spot.hint}`);
  };

  const chooseMentorCard = (id: string) => {
    if (mentor.includes(id)) return;
    const card = profession.mentorCards.find((item) => item.id === id);
    if (!card) return;
    if (!card.good) {
      punish(`${card.title}: наставник качает головой. Это не усиливает кейс.`);
      return;
    }
    setMentor((items) => [...items, id]);
    reward(7, `${card.title}: правка принята, кейс сильнее.`);
  };

  const attackBoss = (artifact: string) => {
    const expected = bossRounds[bossRound]?.artifact;
    if (artifact !== expected) {
      setBossWrong((value) => value + 1);
      punish("Работодатель не понял аргумент. Доказательства нужны в правильном порядке.");
      return;
    }
    setBossRound((value) => value + 1);
    reward(10, `${bossRounds[bossRound].title}: аргумент сработал.`);
  };

  const restart = () => {
    setPhase(0);
    setProfessionId(null);
    setRoute([]);
    setCaseCards([]);
    setFixed([]);
    setMentor([]);
    setBossRound(0);
    setBossWrong(0);
    setMoves(7);
    setCombo(1);
    setScore(0);
    setMessage("Выбери профессию. Дальше будет настоящий мини-заказ, а не тест.");
    setShared(false);
  };

  const shareQuest = async () => {
    const text = "SkillBarter: учись, выполняй настоящие задачи, собирай Skill ID.";
    if (navigator.share) {
      await navigator.share({ title: "SkillBarter Quest", text, url: window.location.href }).catch(() => undefined);
    } else {
      await navigator.clipboard?.writeText(window.location.href).catch(() => undefined);
    }
    setShared(true);
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#05020b] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(217,70,239,0.22),transparent_32%),radial-gradient(circle_at_84%_24%,rgba(16,185,129,0.16),transparent_30%),linear-gradient(180deg,#05020b,#12071f_54%,#05020b)]" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:28px_28px] opacity-45 [mask-image:radial-gradient(circle_at_center,black,transparent_82%)]" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-6 pt-4 sm:px-6">
        <header className="sticky top-0 z-20 -mx-4 mb-3 border-b border-white/10 bg-[#05020b]/90 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-fuchsia-200">SkillBarter case simulator</p>
              <h1 className="truncate text-lg font-black sm:text-2xl">Навык → настоящий кейс → деньги/работа</h1>
            </div>
            <div className="rounded-full border border-fuchsia-400/30 bg-fuchsia-400/10 px-3 py-1 text-xs font-bold text-fuchsia-100">
              {phase + 1}/8
            </div>
          </div>
          <Bar value={((phase + 1) / 8) * 100} />
        </header>

        <Hud stats={stats} combo={combo} moves={phase === 3 ? moves : null} wrong={phase === 6 ? bossWrong : null} />
        <motion.div key={message} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 mt-3 rounded-2xl border border-fuchsia-300/20 bg-fuchsia-300/10 p-3 text-sm font-bold text-fuchsia-50">
          {message}
        </motion.div>

        <div className="flex flex-1 items-center py-4">
          <AnimatePresence mode="wait">
            {phase === 0 && (
              <Screen key="intro">
                <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                  <div>
                    <Pills />
                    <motion.h2 {...titleMotion(reduceMotion)} className="text-4xl font-black leading-[0.95] sm:text-6xl">
                      Твой навык может приносить деньги. Но сначала нужен <span className="text-fuchsia-300">кейс</span>.
                    </motion.h2>
                    <motion.p {...fade(0.12, reduceMotion)} className="mt-4 max-w-xl text-base leading-relaxed text-white/72 sm:text-lg">
                      Это симулятор SkillBarter: ты получишь реальный заказ, найдешь ошибки, соберешь кейс, примешь правки наставника и победишь босса «Без опыта не берем».
                    </motion.p>
                    <motion.div {...fade(0.22, reduceMotion)} className="mt-6">
                      <PrimaryButton onClick={() => setPhase(1)}>Играть</PrimaryButton>
                    </motion.div>
                  </div>
                  <motion.div {...pop(0.1, reduceMotion)} className="space-y-3">
                    <MemePoster kind="boss" title="Без опыта не берем" caption="финальный босс" />
                    <div className="grid grid-cols-2 gap-3">
                      <MemePoster kind="panic" title="Я умею" caption="рынок: ну допустим" compact />
                      <MemePoster kind="skill" title="Вот мой кейс" caption="рынок: уже интересно" compact />
                    </div>
                  </motion.div>
                </div>
              </Screen>
            )}

            {phase === 1 && (
              <Screen key="profession">
                <Title eyebrow="Раунд 1" title="Выбери профессию и получи настоящий заказ" text="У каждой профессии своя задача, свои ошибки и свой способ доказать навык." />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {professions.map((item, index) => (
                    <ProfessionCard key={item.id} item={item} active={professionId === item.id} delay={index * 0.03} onClick={() => chooseProfession(item)} reduceMotion={reduceMotion} />
                  ))}
                </div>
                <Footer>
                  <PrimaryButton disabled={!professionId} onClick={() => setPhase(2)}>Открыть заказ</PrimaryButton>
                </Footer>
              </Screen>
            )}

            {phase === 2 && (
              <Screen key="route">
                <Title eyebrow="Раунд 2" title="Собери маршрут выполнения" text={profession.order} />
                <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                  <MissionPanel profession={profession} />
                  <div>
                    <p className="mb-3 text-sm font-bold text-white/60">Тапай шаги в правильном порядке:</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {[...profession.repairSteps, ...profession.decoys].sort().map((label, index) => (
                        <TapCard key={label} label={label} active={route.includes(label)} index={index} onClick={() => chooseRoute(label)} reduceMotion={reduceMotion} />
                      ))}
                    </div>
                  </div>
                </div>
                <RouteBoard route={profession.repairSteps} selected={route} />
                <Footer>
                  <PrimaryButton disabled={route.length < profession.repairSteps.length} onClick={() => setPhase(3)}>Начать кейс-рейд</PrimaryButton>
                </Footer>
              </Screen>
            )}

            {phase === 3 && (
              <Screen key="case">
                <Title eyebrow="Раунд 3" title="Кейс-рейд: 7 ходов, собери 4 доказательства" text="Это сложнее теста: хорошие элементы усиливают кейс, плохие тратят ход и сбивают комбо." />
                <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                  <CaseBoard profession={profession} selected={caseCards} />
                  <div className="grid gap-3 sm:grid-cols-2">
                    {availableAssets.map((asset, index) => (
                      <AssetCard key={asset.id} asset={asset} active={caseCards.includes(asset.id)} disabled={caseCards.length >= 4 || moves <= 0} index={index} onClick={() => chooseAsset(asset.id)} reduceMotion={reduceMotion} />
                    ))}
                  </div>
                </div>
                <Footer>
                  <PrimaryButton disabled={!caseReady} onClick={() => setPhase(4)}>Показать наставнику</PrimaryButton>
                </Footer>
              </Screen>
            )}

            {phase === 4 && (
              <Screen key="inspect">
                <Title eyebrow="Раунд 4" title="Найди ошибки на сырой работе" text="Тапай по проблемным зонам на макете. Нужно найти 3 настоящих ошибки. Ложные зоны сбивают комбо." />
                <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
                  <HotspotBoard profession={profession} fixed={fixed} onTap={tapHotspot} />
                  <div className="space-y-3">
                    <MemePoster kind="mentor" title="Наставник" caption={profession.rawWork} />
                    <div className="rounded-3xl border border-emerald-300/25 bg-emerald-400/10 p-4">
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-100">Найдено ошибок</p>
                      <p className="mt-2 text-3xl font-black">{fixed.length}/3</p>
                      <p className="mt-2 text-sm text-white/62">Так работает SkillBarter: правка превращает попытку в кейс.</p>
                    </div>
                  </div>
                </div>
                <Footer>
                  <PrimaryButton disabled={!repairReady} onClick={() => setPhase(5)}>Принять правки</PrimaryButton>
                </Footer>
              </Screen>
            )}

            {phase === 5 && (
              <Screen key="mentor">
                <Title eyebrow="Раунд 5" title="Собери подтверждение наставника" text="Выбери 3 сильных артефакта после правки. Мусор не попадет в Skill ID." />
                <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                  <div className="space-y-3">
                    <MemePoster kind="mentor" title="Правка получена" caption="не обидеться, а усилить работу" />
                    <MemePoster kind="market" title="Рынок смотрит" caption="слова без кейса уже не проходят" compact />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {profession.mentorCards.map((card, index) => (
                      <MentorCard key={card.id} card={card} active={mentor.includes(card.id)} index={index} onClick={() => chooseMentorCard(card.id)} reduceMotion={reduceMotion} />
                    ))}
                  </div>
                </div>
                <Footer>
                  <PrimaryButton disabled={!mentorReady} onClick={() => setPhase(6)}>Идти на собеседование</PrimaryButton>
                </Footer>
              </Screen>
            )}

            {phase === 6 && (
              <Screen key="boss">
                <Title eyebrow="Раунд 6" title="Битва с работодателем" text="Он не верит словам. Используй артефакты в правильном порядке." />
                <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                  <div className="space-y-3">
                    <MemePoster kind="employer" title={bossRound >= 3 ? "Работодатель заинтересовался" : "Покажите опыт"} caption={bossRound >= 3 ? "кейс сработал" : bossRounds[bossRound].question} />
                    <BossHp hp={bossRound >= 3 ? 0 : clamp(100 - bossRound * 34)} />
                  </div>
                  <div className="space-y-3">
                    <MemePoster kind="skill" title="Твой арсенал" caption={profession.caseTitle} />
                    {bossRound < 3 ? (
                      <div className="grid gap-3">
                        {bossRounds.map((round, index) => (
                          <motion.button key={round.artifact} type="button" whileTap={{ scale: 0.96 }} onClick={() => attackBoss(round.artifact)} className={cn("min-h-14 rounded-2xl border p-4 text-left font-black transition active:bg-white/[0.1]", index === bossRound ? "border-fuchsia-300/60 bg-fuchsia-400/12" : "border-white/12 bg-white/[0.06]")}>
                            {round.title}
                          </motion.button>
                        ))}
                      </div>
                    ) : (
                      <motion.div {...pop(0, reduceMotion)} className="space-y-3">
                        <MemePoster kind="money" title="Кейс принят" caption="теперь есть что показать" />
                        <PrimaryButton onClick={() => setPhase(7)}>Открыть Skill ID</PrimaryButton>
                      </motion.div>
                    )}
                  </div>
                </div>
              </Screen>
            )}

            {phase === 7 && (
              <Screen key="final">
                <Burst />
                <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr] lg:items-start">
                  <SkillIdCard profession={profession} stats={stats} />
                  <div className="space-y-3">
                    <Title eyebrow="Финал" title="Теперь понятно, что за проект" text="SkillBarter это проект где вы сможете зарабатывать учиться и получить работу проще выполняя настоящие задачи!" />
                    <div className="rounded-3xl border border-fuchsia-300/25 bg-fuchsia-400/10 p-4 text-base font-bold leading-relaxed text-white/82">
                      Ты учишься, берешь реальные задания, получаешь правки наставника и собираешь Skill ID. Навык становится не обещанием, а доказанным результатом.
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <MemePoster kind="money" title="Заработок" caption="кейс проще продать" compact />
                      <MemePoster kind="employer" title="Работа" caption="есть что показать" compact />
                      <MemePoster kind="mentor" title="Рост" caption="правки качают" compact />
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <LinkButton href="/access">Открыть MVP</LinkButton>
                      <SecondaryButton onClick={restart}>
                        <RefreshCcw className="h-4 w-4" />
                        Еще раз
                      </SecondaryButton>
                      <SecondaryButton onClick={shareQuest}>{shared ? "Ссылка готова" : "Показать другу"}</SecondaryButton>
                    </div>
                  </div>
                </div>
              </Screen>
            )}
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}

function Hud({ stats, combo, moves, wrong }: { stats: { trust: number; casePower: number; chance: number }; combo: number; moves: number | null; wrong: number | null }) {
  return (
    <div className="relative z-10 grid gap-2 rounded-2xl border border-white/10 bg-white/[0.05] p-3 sm:grid-cols-[1fr_1fr_1fr_auto_auto]">
      <Meter label="Доверие" value={stats.trust} />
      <Meter label="Сила кейса" value={stats.casePower} />
      <Meter label="Шанс" value={stats.chance} />
      <Badge label="combo" value={`x${combo}`} />
      {moves !== null && <Badge label="ходы" value={String(moves)} />}
      {wrong !== null && <Badge label="ошибки" value={String(wrong)} />}
    </div>
  );
}

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between gap-2 text-xs font-bold text-white/70">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/10">
        <motion.div className="h-full rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-300" animate={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function Badge({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-fuchsia-300/25 bg-fuchsia-400/10 px-3 py-2 text-center">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-fuchsia-100">{label}</p>
      <p className="text-xl font-black">{value}</p>
    </div>
  );
}

function Screen({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.24, ease: "easeOut" }} className="relative z-10 w-full">
      {children}
    </motion.div>
  );
}

function Title({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <div className="mb-5">
      <p className="text-xs font-black uppercase tracking-[0.24em] text-fuchsia-200">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-black leading-tight sm:text-5xl">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/66 sm:text-base">{text}</p>
    </div>
  );
}

function Pills() {
  return (
    <div className="mb-5 flex flex-wrap gap-2">
      {["Учишься", "Делаешь задачу", "Получаешь правку", "Собираешь Skill ID"].map((item, index) => (
        <motion.span key={item} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="rounded-full border border-fuchsia-300/25 bg-fuchsia-300/10 px-3 py-1 text-xs font-bold text-fuchsia-100">
          {item}
        </motion.span>
      ))}
    </div>
  );
}

function ProfessionCard({ item, active, delay, onClick, reduceMotion }: { item: Pro; active: boolean; delay: number; onClick: () => void; reduceMotion: boolean | null }) {
  const Icon = item.icon;
  return (
    <motion.button type="button" initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.96 }} animate={{ opacity: active ? 1 : 0.92, y: 0, scale: active ? 1.04 : 1 }} transition={{ delay, duration: 0.24 }} whileTap={{ scale: 0.94 }} onClick={onClick} className={cn("min-h-44 rounded-3xl border p-4 text-left transition active:bg-white/[0.1]", active ? "border-fuchsia-300/70 bg-fuchsia-400/12" : "border-white/12 bg-white/[0.06]")}>
      <Icon className="mb-4 h-7 w-7 text-fuchsia-100" />
      <h3 className="text-xl font-black">{item.title}</h3>
      <p className="mt-2 text-sm text-white/62">{item.role}</p>
      <p className="mt-3 rounded-2xl border border-white/10 bg-black/20 p-2 text-xs text-white/58">{item.meme}</p>
    </motion.button>
  );
}

function MissionPanel({ profession }: { profession: Pro }) {
  return (
    <div className="space-y-3">
      <MemePoster kind="client" title={profession.client} caption="дает настоящий заказ" />
      <div className="rounded-3xl border border-white/12 bg-white/[0.06] p-4">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-fuchsia-100">Заказ</p>
        <p className="mt-2 text-lg font-bold leading-relaxed text-white/82">{profession.order}</p>
      </div>
    </div>
  );
}

function RouteBoard({ route, selected }: { route: string[]; selected: string[] }) {
  return (
    <div className="mt-4 rounded-3xl border border-fuchsia-300/25 bg-fuchsia-400/[0.08] p-4">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-fuchsia-100">Твой процесс</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        {route.map((step, index) => (
          <div key={step} className={cn("rounded-2xl border p-3 text-sm font-black", selected[index] ? "border-emerald-300/55 bg-emerald-400/12" : "border-dashed border-white/15 bg-black/20")}>
            {index + 1}. {selected[index] ?? "пусто"}
          </div>
        ))}
      </div>
    </div>
  );
}

function CaseBoard({ profession, selected }: { profession: Pro; selected: string[] }) {
  const assets = getAssets(profession);
  return (
    <div className="rounded-3xl border border-fuchsia-300/25 bg-fuchsia-400/[0.08] p-4">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-fuchsia-100">Кейс-рейд</p>
      <h3 className="mt-2 text-2xl font-black">{profession.caseTitle}</h3>
      <div className="mt-4 grid gap-3">
        {[0, 1, 2, 3].map((slot) => {
          const asset = assets.find((item) => item.id === selected[slot]);
          return (
            <motion.div key={slot} layout className={cn("min-h-16 rounded-2xl border p-3", asset ? (asset.good ? "border-emerald-300/45 bg-emerald-400/10" : "border-amber-300/45 bg-amber-400/10") : "border-dashed border-white/15 bg-black/18")}>
              <p className="text-sm font-bold">{asset ? asset.title : `[${slot + 1}] слот доказательства`}</p>
              {asset && <p className="mt-1 text-xs text-white/50">{asset.note}</p>}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function HotspotBoard({ profession, fixed, onTap }: { profession: Pro; fixed: string[]; onTap: (spot: Hotspot) => void }) {
  return (
    <div className="relative min-h-[480px] overflow-hidden rounded-[2rem] border border-white/12 bg-white/[0.06] p-4">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-fuchsia-100">Сырая работа</p>
      <h3 className="mt-2 text-2xl font-black">{profession.caseTitle}</h3>
      <p className="mt-2 max-w-lg text-sm text-white/58">{profession.rawWork}</p>
      <div className="absolute inset-x-8 bottom-8 top-28 rounded-[2rem] border border-white/14 bg-black/24 p-5">
        <div className="h-8 rounded-xl bg-white/10" />
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="h-28 rounded-2xl bg-fuchsia-300/12" />
          <div className="h-28 rounded-2xl bg-emerald-300/12" />
        </div>
        <div className="mt-5 h-12 rounded-2xl bg-white/10" />
      </div>
      {profession.hotspots.map((spot) => (
        <motion.button key={spot.id} type="button" whileTap={{ scale: 0.92 }} onClick={() => onTap(spot)} className={cn("absolute rounded-2xl border px-3 py-2 text-xs font-black", fixed.includes(spot.id) ? "border-emerald-300/70 bg-emerald-400/20 text-emerald-50" : "border-amber-300/60 bg-amber-400/18 text-amber-50")} style={{ left: spot.x, top: spot.y, width: spot.w, minHeight: spot.h }}>
          {fixed.includes(spot.id) ? "✓ " : "!"}
          {spot.label}
        </motion.button>
      ))}
    </div>
  );
}

function TapCard({ label, active, index, onClick, reduceMotion }: { label: string; active: boolean; index: number; onClick: () => void; reduceMotion: boolean | null }) {
  return (
    <motion.button type="button" initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: active ? 0.58 : 1, y: 0, scale: active ? 0.95 : 1 }} transition={{ delay: index * 0.025 }} whileTap={{ scale: 0.96 }} onClick={onClick} disabled={active} className={cn("min-h-20 rounded-2xl border p-4 text-left font-black transition active:bg-white/[0.1]", active ? "border-emerald-300/60 bg-emerald-400/12" : "border-white/12 bg-white/[0.06]")}>
      {label}
    </motion.button>
  );
}

function AssetCard({ asset, active, disabled, index, onClick, reduceMotion }: { asset: ReturnType<typeof getAssets>[number]; active: boolean; disabled: boolean; index: number; onClick: () => void; reduceMotion: boolean | null }) {
  return (
    <motion.button type="button" initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: active ? 0.58 : 1, y: 0, scale: active ? 0.95 : 1, x: active && !asset.good ? [0, -4, 4, -2, 0] : 0 }} transition={{ delay: index * 0.025 }} whileTap={{ scale: 0.96 }} onClick={onClick} disabled={active || disabled} className={cn("min-h-24 rounded-2xl border p-4 text-left transition active:bg-white/[0.1]", active && asset.good ? "border-emerald-300/70 bg-emerald-400/12" : active && !asset.good ? "border-amber-300/70 bg-amber-400/12" : "border-white/12 bg-white/[0.06]")}>
      <p className="text-sm font-black">{asset.title}</p>
      <p className="mt-2 text-xs text-white/52">{asset.note}</p>
    </motion.button>
  );
}

function MentorCard({ card, active, index, onClick, reduceMotion }: { card: Pro["mentorCards"][number]; active: boolean; index: number; onClick: () => void; reduceMotion: boolean | null }) {
  return (
    <motion.button type="button" initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: active ? 0.58 : 1, y: 0, scale: active ? 0.95 : 1 }} transition={{ delay: index * 0.03 }} whileTap={{ scale: 0.96 }} onClick={onClick} disabled={active} className={cn("min-h-24 rounded-2xl border p-4 text-left transition active:bg-white/[0.1]", active && card.good ? "border-emerald-300/70 bg-emerald-400/12" : "border-white/12 bg-white/[0.06]")}>
      <p className="text-sm font-black">{card.title}</p>
      <p className="mt-2 text-xs text-white/52">{card.note}</p>
    </motion.button>
  );
}

function SkillIdCard({ profession, stats }: { profession: Pro; stats: { trust: number; casePower: number; chance: number } }) {
  return (
    <motion.div {...pop(0, false)} className="rounded-[2rem] border border-emerald-300/35 bg-gradient-to-br from-emerald-400/14 via-fuchsia-400/10 to-white/[0.05] p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-200">Skill ID activated</p>
          <h3 className="mt-2 text-3xl font-black">SB-QUEST-2026</h3>
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-300/40 bg-emerald-400/15 text-emerald-100">
          <Fingerprint className="h-7 w-7" />
        </div>
      </div>
      <div className="mt-5 grid gap-3">
        <Info label="Профессия" value={profession.title} />
        <Info label="Кейс" value={profession.caseTitle} />
        <Info label="Доверие" value={`${stats.trust}%`} />
        <Info label="Сила кейса" value={`${stats.casePower}%`} />
        <Info label="Шанс" value={`${stats.chance}%`} />
      </div>
      <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-300/35 bg-emerald-400/12 px-3 py-2 text-sm font-black text-emerald-100">
        <ShieldCheck className="h-4 w-4" />
        Подтверждено делом
      </div>
    </motion.div>
  );
}

function MemePoster({ kind, title, caption, compact }: { kind: MemeKind; title: string; caption: string; compact?: boolean }) {
  const faces: Record<MemeKind, string> = {
    boss: "ಠ_ಠ",
    client: "👀",
    mentor: ":D",
    market: "👀",
    employer: "o_O",
    skill: "★_★",
    money: "$_$",
    panic: "T_T",
  };
  const palette: Record<MemeKind, string> = {
    boss: "border-red-300/35 bg-red-500/10",
    client: "border-fuchsia-300/35 bg-fuchsia-400/10",
    mentor: "border-sky-300/35 bg-sky-400/10",
    market: "border-fuchsia-300/35 bg-fuchsia-400/10",
    employer: "border-violet-300/35 bg-violet-400/10",
    skill: "border-emerald-300/35 bg-emerald-400/10",
    money: "border-lime-300/35 bg-lime-400/10",
    panic: "border-amber-300/35 bg-amber-400/10",
  };
  return (
    <motion.div initial={{ opacity: 0, y: 12, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} className={cn("relative overflow-hidden rounded-[2rem] border p-4 text-center", palette[kind], compact ? "min-h-40" : "min-h-64")}>
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />
      <div className={cn("mx-auto mb-3 flex items-center justify-center rounded-[2rem] border border-white/15 bg-black/25 font-black", compact ? "h-20 w-20 text-2xl" : "h-28 w-28 text-4xl")}>{faces[kind]}</div>
      <h3 className={cn("font-black", compact ? "text-lg" : "text-2xl")}>{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-white/62">{caption}</p>
    </motion.div>
  );
}

function BossHp({ hp }: { hp: number }) {
  return (
    <div className="rounded-2xl border border-red-300/25 bg-red-500/10 p-4">
      <div className="flex items-center justify-between text-sm font-bold">
        <span>Скепсис работодателя</span>
        <span>{hp}%</span>
      </div>
      <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/10">
        <motion.div className="h-full rounded-full bg-gradient-to-r from-red-400 to-fuchsia-300" animate={{ width: `${hp}%` }} />
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/18 p-3">
      <span className="text-sm text-white/55">{label}</span>
      <span className="text-right text-sm font-black">{value}</span>
    </div>
  );
}

function Bar({ value }: { value: number }) {
  return (
    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
      <motion.div className="h-full rounded-full bg-gradient-to-r from-fuchsia-400 via-violet-300 to-emerald-300" animate={{ width: `${value}%` }} />
    </div>
  );
}

function PrimaryButton({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <motion.button type="button" whileTap={{ scale: disabled ? 1 : 0.96 }} onClick={onClick} disabled={disabled} className="min-h-12 w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 to-violet-500 px-5 py-3 text-base font-black text-white shadow-lg shadow-fuchsia-500/15 transition disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto">
      <span className="inline-flex items-center justify-center gap-2">
        {children}
        <ArrowRight className="h-4 w-4" />
      </span>
    </motion.button>
  );
}

function SecondaryButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <motion.button type="button" whileTap={{ scale: 0.96 }} onClick={onClick} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/14 bg-white/[0.06] px-5 py-3 text-base font-black text-white transition active:bg-white/[0.1]">
      {children}
    </motion.button>
  );
}

function LinkButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-500 to-violet-500 px-5 py-3 text-base font-black text-white shadow-lg shadow-fuchsia-500/15 sm:w-auto">
      {children}
    </Link>
  );
}

function Footer({ children }: { children: React.ReactNode }) {
  return <div className="mt-5 flex justify-center">{children}</div>;
}

function Burst() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {Array.from({ length: 16 }).map((_, index) => (
        <motion.span key={index} className="absolute h-2 w-2 rounded-full bg-fuchsia-300" style={{ left: `${(index * 43) % 100}%`, top: "8%" }} animate={{ y: ["0vh", "72vh"], opacity: [0, 1, 0], rotate: [0, 180] }} transition={{ duration: 1.4 + (index % 4) * 0.1, delay: index * 0.025 }} />
      ))}
    </div>
  );
}

function fade(delay = 0, reduceMotion: boolean | null = false) {
  return {
    initial: reduceMotion ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.28, ease: "easeOut" as const },
  };
}

function pop(delay = 0, reduceMotion: boolean | null = false) {
  return {
    initial: reduceMotion ? false : { opacity: 0, y: 16, scale: 0.97 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { delay, duration: 0.3, ease: "easeOut" as const },
  };
}

function titleMotion(reduceMotion: boolean | null = false) {
  return {
    initial: reduceMotion ? false : { opacity: 0, y: 24, clipPath: "inset(0 0 100% 0)" },
    animate: { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" },
    transition: { duration: 0.5, ease: "easeOut" as const },
  };
}
