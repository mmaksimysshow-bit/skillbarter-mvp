"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BriefcaseBusiness,
  ChefHat,
  Code2,
  Coins,
  Fingerprint,
  GraduationCap,
  HeartHandshake,
  Palette,
  Scale,
  ShieldCheck,
  Trophy,
  Zap,
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

type CaseCard = {
  id: string;
  title: string;
  good: boolean;
  meme: string;
};

type Track = {
  id: TrackId;
  title: string;
  short: string;
  icon: LucideIcon;
  meme: string;
  caseName: string;
  situation: string;
  cards: CaseCard[];
  badMeme: string;
  mentorFix: string;
};

const pathItems = ["Навык", "Кейс", "Правка", "Skill ID", "Деньги/Работа"];

const goals: Goal[] = [
  {
    id: "orders",
    title: "Хочу зарабатывать",
    short: "Чтобы заказчик понял, за что платит",
    reaction: "POV: ты понял, что навык может приносить деньги, если его можно доказать.",
    opportunity: "заказ",
    icon: Coins,
  },
  {
    id: "job",
    title: "Хочу работу",
    short: "Чтобы работодатель видел результат",
    reaction: "Работодатель не экстрасенс. Ему нужен результат.",
    opportunity: "работа",
    icon: BriefcaseBusiness,
  },
  {
    id: "portfolio",
    title: "Хочу портфолио",
    short: "Чтобы было что показать",
    reaction: "Портфолио само себя не соберет. Открываем первый кейс.",
    opportunity: "портфолио",
    icon: Trophy,
  },
  {
    id: "levelup",
    title: "Хочу прокачаться",
    short: "Чтобы практика стала уверенностью",
    reaction: "Теория без практики - это как спортзал только в TikTok.",
    opportunity: "рост",
    icon: Zap,
  },
];

const tracks: Track[] = [
  {
    id: "programming",
    title: "Программист",
    short: "Код, сайты, формы, боты, автоматизация",
    icon: Code2,
    meme: "Если работает с первого раза - подозрительно.",
    caseName: "Страница заявки для бизнеса",
    situation: "Малому бизнесу нужна страница заявки.",
    badMeme: "Кнопка умерла. Пользователь тоже почти.",
    mentorFix: "Покажи, что форма реально работает, а не просто красиво стоит на странице.",
    cards: [
      { id: "p1", title: "Форма заявки работает", good: true, meme: "Пользователь оставил заявку. Жизнь налаживается." },
      { id: "p2", title: "Кнопка отправляет данные", good: true, meme: "Кнопка нажалась. Уже успех." },
      { id: "p3", title: "На телефоне все не развалилось", good: true, meme: "Адаптив спас проект." },
      { id: "p4", title: "Красивый фон, но кнопка мертвая", good: false, meme: "Красиво, но не работает. Босс доволен." },
      { id: "p5", title: "Ошибка в консоли, но мы ее не видели", good: false, meme: "Консоль все видела." },
      { id: "p6", title: "На мобилке сайт уехал в отпуск", good: false, meme: "Мобильная версия просит помощи." },
    ],
  },
  {
    id: "design",
    title: "Дизайнер",
    short: "Интерфейсы, визуал, карточки, презентации",
    icon: Palette,
    meme: "17 шрифтов - это не стиль, это преступление.",
    caseName: "Первый экран сайта",
    situation: "Клиенту нужен первый экран сайта.",
    badMeme: "18 эффектов покинули чат.",
    mentorFix: "Убери лишний шум. Заголовок, польза и кнопка должны быть главными.",
    cards: [
      { id: "d1", title: "Понятный заголовок", good: true, meme: "Человек понял пользу за 5 секунд." },
      { id: "d2", title: "Видимая кнопка", good: true, meme: "Теперь понятно, куда нажимать." },
      { id: "d3", title: "Польза за 5 секунд", good: true, meme: "Не красота ради красоты, а смысл." },
      { id: "d4", title: "18 эффектов, все мигает", good: false, meme: "Глаза вышли из чата." },
      { id: "d5", title: "Мелкий текст как договор банка", good: false, meme: "Прочитать смог только юрист." },
      { id: "d6", title: "Градиент ради градиента", good: false, meme: "Градиент красивый. Польза потерялась." },
    ],
  },
  {
    id: "cooking",
    title: "Повар",
    short: "Блюда, подача, технология, меню",
    icon: ChefHat,
    meme: "'Вкусно' на словах не считается.",
    caseName: "Блюдо для меню кафе",
    situation: "Кафе просит блюдо для меню.",
    badMeme: "'Вкусно' - это эмоция. Кейс - это доказательство.",
    mentorFix: "Добавь технологию, время и подачу - тогда блюдо можно оценить как работу.",
    cards: [
      { id: "c1", title: "Состав блюда", good: true, meme: "Теперь понятно, что внутри." },
      { id: "c2", title: "Технология приготовления", good: true, meme: "Это можно повторить и оценить." },
      { id: "c3", title: "Подача и фото результата", good: true, meme: "Блюдо стало кейсом, а не легендой." },
      { id: "c4", title: "Просто написать 'вкусно'", good: false, meme: "Вкусно кому? Когда? Почему?" },
      { id: "c5", title: "Готовить на глаз и надеяться", good: false, meme: "Надежда - не технология." },
      { id: "c6", title: "Время приготовления? Не слышали", good: false, meme: "Кафе слышало. И ждет." },
    ],
  },
  {
    id: "teaching",
    title: "Педагог",
    short: "Объяснение темы, мини-урок, работа с учеником",
    icon: GraduationCap,
    meme: "Ученик кивнул. Но понял ли он? Вопрос века.",
    caseName: "Мини-урок для новичка",
    situation: "Нужно объяснить сложную тему новичку.",
    badMeme: "Кивок не всегда понимание.",
    mentorFix: "Добавь пример и мини-вопрос. Так видно, что ученик понял.",
    cards: [
      { id: "t1", title: "Объяснить простыми словами", good: true, meme: "Сложное стало человеческим." },
      { id: "t2", title: "Дать пример из жизни", good: true, meme: "Пример включил мозг." },
      { id: "t3", title: "Проверить понимание", good: true, meme: "Кивок прошел проверку." },
      { id: "t4", title: "Завалить терминами", good: false, meme: "Новичок потерялся на втором слове." },
      { id: "t5", title: "Сказать 'ну это же очевидно'", good: false, meme: "Очевидно только тому, кто уже знает." },
      { id: "t6", title: "Ученик кивнул - значит понял", good: false, meme: "Опасная педагогическая магия." },
    ],
  },
  {
    id: "psychology",
    title: "Психолог",
    short: "Коммуникация, этика, поддержка, разбор запроса",
    icon: HeartHandshake,
    meme: "Диагноз за 5 секунд - сразу бан.",
    caseName: "Этичный разбор запроса",
    situation: "Человек описал трудную ситуацию.",
    badMeme: "Диагноз за 5 секунд - бан. Запрос и границы - база.",
    mentorFix: "Сначала запрос и границы. Не надо играть в 'я все понял за 5 секунд'.",
    cards: [
      { id: "ps1", title: "Уточнить запрос", good: true, meme: "Сначала понять, потом говорить." },
      { id: "ps2", title: "Соблюдать границы", good: true, meme: "Безопасная коммуникация включена." },
      { id: "ps3", title: "Показать этичную коммуникацию", good: true, meme: "Профессионально и спокойно." },
      { id: "ps4", title: "Диагноз за 5 секунд", good: false, meme: "Это не навык, это тревожный флаг." },
      { id: "ps5", title: "Давить своим мнением", good: false, meme: "Поддержка вышла из комнаты." },
      { id: "ps6", title: "Решить все за человека", good: false, meme: "Так не строится доверие." },
    ],
  },
  {
    id: "law",
    title: "Юрист",
    short: "Факты, документы, позиция, правовая логика",
    icon: Scale,
    meme: "Громкий голос - не доказательство.",
    caseName: "Правовая позиция по ситуации",
    situation: "Человеку нужно понять, как защитить позицию.",
    badMeme: "Обещать победу легко. Доказать позицию сложнее.",
    mentorFix: "Факты, документы, основание. Без обещаний победы.",
    cards: [
      { id: "l1", title: "Выяснить факты", good: true, meme: "Позиция получила основу." },
      { id: "l2", title: "Посмотреть документы", good: true, meme: "Документы вошли в дело." },
      { id: "l3", title: "Найти основание", good: true, meme: "Теперь это логика, а не монолог." },
      { id: "l4", title: "Обещать победу", good: false, meme: "Красиво звучит. Слабо доказывает." },
      { id: "l5", title: "Громко спорить", good: false, meme: "Громкость не равна аргументу." },
      { id: "l6", title: "Забыть про факты", good: false, meme: "Позиция зависла в воздухе." },
    ],
  },
];

const bossLines = ["А опыт есть?", "А кто подтвердил?", "А где это посмотреть?"];
const attacks = [
  { label: "Показать кейс", text: "Вот мой кейс." },
  { label: "Показать правку наставника", text: "Наставник проверил." },
  { label: "Открыть Skill ID", text: "В Skill ID." },
];

const clamp = (value: number) => Math.max(0, Math.min(100, value));

export default function EventPage() {
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState<Step>(0);
  const [goalId, setGoalId] = useState<GoalId | null>(null);
  const [trackId, setTrackId] = useState<TrackId | null>(null);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [lastMeme, setLastMeme] = useState<string | null>(null);
  const [mentorDecision, setMentorDecision] = useState<MentorDecision>(null);
  const [typed, setTyped] = useState(false);
  const [attackIndex, setAttackIndex] = useState(0);
  const [shared, setShared] = useState(false);

  const goal = goals.find((item) => item.id === goalId) ?? goals[0];
  const track = tracks.find((item) => item.id === trackId) ?? tracks[0];
  const chosenCaseCards = track.cards.filter((card) => selectedCards.includes(card.id));
  const goodCount = chosenCaseCards.filter((card) => card.good).length;
  const marketLevel = goodCount >= 3 ? "strong" : goodCount >= 2 ? "medium" : "weak";

  const scores = useMemo(() => {
    const mentorTrust = mentorDecision === "improve" ? 40 : mentorDecision === "ignore" ? 0 : 0;
    const mentorQuality = mentorDecision === "improve" ? 40 : mentorDecision === "ignore" ? 0 : 0;
    const mentorChance = mentorDecision === "improve" ? 30 : mentorDecision === "ignore" ? 5 : 0;
    return {
      trust: clamp(goodCount * 15 + mentorTrust + (marketLevel === "strong" ? 10 : 0)),
      quality: clamp(goodCount * 15 + mentorQuality + (marketLevel === "strong" ? 10 : 0)),
      chance: clamp(goodCount * 10 + mentorChance + (mentorDecision === "improve" ? 20 : 10)),
    };
  }, [goodCount, marketLevel, mentorDecision]);

  const bossHp = clamp(100 - attackIndex * 34);

  useEffect(() => {
    if (step !== 5) return;
    setTyped(false);
    const timer = window.setTimeout(() => setTyped(true), 750);
    return () => window.clearTimeout(timer);
  }, [step, trackId]);

  const next = (target: Step) => setStep(target);

  const restart = () => {
    setStep(0);
    setGoalId(null);
    setTrackId(null);
    setSelectedCards([]);
    setLastMeme(null);
    setMentorDecision(null);
    setAttackIndex(0);
    setShared(false);
  };

  const shareQuest = async () => {
    const text = "Я прошел Skill ID Quest: навык -> кейс -> правка -> Skill ID.";
    if (navigator.share) {
      await navigator.share({ title: "Skill ID Quest", text, url: window.location.href }).catch(() => undefined);
    } else {
      await navigator.clipboard?.writeText(window.location.href).catch(() => undefined);
    }
    setShared(true);
  };

  const toggleCaseCard = (card: CaseCard) => {
    if (selectedCards.includes(card.id) || selectedCards.length >= 3) return;
    setSelectedCards((items) => [...items, card.id]);
    setLastMeme(card.good ? card.meme : card.meme || track.badMeme);
    if ("vibrate" in navigator) navigator.vibrate?.(card.good ? 25 : [20, 30, 20]);
  };

  const chooseMentor = (decision: Exclude<MentorDecision, null>) => {
    setMentorDecision(decision);
    setLastMeme(
      decision === "improve"
        ? "Правка принята. Кейс эволюционировал."
        : "Правка была бесплатным DLC, но ты пропустил.",
    );
    window.setTimeout(() => next(6), 700);
  };

  const hitBoss = () => {
    if (attackIndex >= 3) return;
    setAttackIndex((value) => value + 1);
    if ("vibrate" in navigator) navigator.vibrate?.(35);
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#07040f] text-white">
      <div className="pointer-events-none fixed inset-0">
        <motion.div
          className="absolute -left-28 top-10 h-80 w-80 rounded-full bg-fuchsia-600/25 blur-3xl"
          animate={reduceMotion ? undefined : { x: [0, 26, 0], y: [0, 18, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-20 top-64 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl"
          animate={reduceMotion ? undefined : { x: [0, -24, 0], y: [0, -16, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]" />
      </div>

      <section className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-8 pt-4 sm:px-6">
        <header className="sticky top-0 z-20 -mx-4 mb-4 border-b border-white/10 bg-[#07040f]/82 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-fuchsia-200">SkillBarter event</p>
              <h1 className="truncate text-lg font-black sm:text-2xl">Skill ID Quest</h1>
            </div>
            <div className="rounded-full border border-fuchsia-400/30 bg-fuchsia-400/10 px-3 py-1 text-xs font-bold text-fuchsia-100">
              {step + 1}/9
            </div>
          </div>
          <ProgressLine step={step} />
        </header>

        <ScoreBars scores={scores} />

        <div className="flex flex-1 items-center py-4">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <Screen key="intro">
                <PathLights />
                <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                  <div>
                    <motion.p {...fade(0)} className="mb-3 inline-flex rounded-full border border-fuchsia-400/40 bg-fuchsia-400/10 px-3 py-1 text-sm font-bold text-fuchsia-100">
                      SkillBarter: победи босса &quot;Без опыта не берем&quot;
                    </motion.p>
                    <motion.h2 {...titleMotion(0.05)} className="text-4xl font-black leading-[0.96] sm:text-6xl">
                      Ты умеешь. <br />Но тебе говорят: <span className="text-fuchsia-300">&quot;А кейсы есть?&quot;</span>
                    </motion.h2>
                    <motion.p {...fade(0.16)} className="mt-5 max-w-xl text-base leading-relaxed text-white/74 sm:text-lg">
                      Победи босса: собери первый кейс, получи правку наставника и открой Skill ID.
                    </motion.p>
                    <motion.div {...fade(0.24)} className="mt-6">
                      <PrimaryButton onClick={() => next(1)}>Начать битву</PrimaryButton>
                    </motion.div>
                  </div>
                  <motion.div {...pop(0.12)} className="space-y-4">
                    <BossSticker big />
                    <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-4 text-center shadow-2xl shadow-fuchsia-950/40">
                      <p className="text-sm text-white/60">Ответ студента</p>
                      <p className="mt-1 text-xl font-black">А где взять опыт, если без опыта не берут?</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Sticker title="Я умею 😐" text="рынок: ну допустим" face=":|" />
                      <Sticker title="Вот мой кейс 👀" text="рынок: уже интересно" face=":)" glow />
                    </div>
                  </motion.div>
                </div>
              </Screen>
            )}

            {step === 1 && (
              <Screen key="goal">
                <SectionTitle eyebrow="Шаг 1" title="Зачем тебе навык?" text="Выбери цель. SkillBarter дальше покажет, почему без кейса навык остается просто фразой." />
                <CardGrid>
                  {goals.map((item, index) => (
                    <ChoiceCard
                      key={item.id}
                      delay={index * 0.04}
                      active={goalId === item.id}
                      icon={item.icon}
                      title={item.title}
                      text={item.short}
                      onClick={() => setGoalId(item.id)}
                    />
                  ))}
                </CardGrid>
                {goalId && <MemeBubble text={goal.reaction} />}
                <FooterAction>
                  <PrimaryButton disabled={!goalId} onClick={() => next(2)}>Выбрать навык</PrimaryButton>
                </FooterAction>
              </Screen>
            )}

            {step === 2 && (
              <Screen key="track">
                <SectionTitle eyebrow="Шаг 2" title="Выбери своего персонажа" text="Профессия любая. Правило одно: результат должен быть виден." />
                <CardGrid>
                  {tracks.map((item, index) => (
                    <ChoiceCard
                      key={item.id}
                      delay={index * 0.035}
                      active={trackId === item.id}
                      icon={item.icon}
                      title={item.title}
                      text={item.short}
                      badge={item.meme}
                      onClick={() => setTrackId(item.id)}
                    />
                  ))}
                </CardGrid>
                {trackId && <MemeBubble text="Персонаж выбран. Теперь нужна не фраза, а доказательство." />}
                <FooterAction>
                  <PrimaryButton disabled={!trackId} onClick={() => next(3)}>Собрать кейс</PrimaryButton>
                </FooterAction>
              </Screen>
            )}

            {step === 3 && (
              <Screen key="collect">
                <SectionTitle eyebrow="Шаг 3" title="Собери кейс" text={track.situation} />
                <div className="grid gap-4 lg:grid-cols-[1fr_0.92fr]">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {track.cards.map((card, index) => {
                      const selected = selectedCards.includes(card.id);
                      return (
                        <motion.button
                          key={card.id}
                          type="button"
                          initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: selected ? 1.03 : 1 }}
                          transition={{ delay: index * 0.035 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => toggleCaseCard(card)}
                          disabled={selected || selectedCards.length >= 3}
                          className={cn(
                            "min-h-24 rounded-2xl border p-4 text-left transition",
                            "bg-white/[0.055] hover:bg-white/[0.085]",
                            selected && card.good && "border-emerald-300/70 bg-emerald-400/12 shadow-lg shadow-emerald-500/15",
                            selected && !card.good && "border-amber-300/70 bg-amber-400/12 shadow-lg shadow-amber-500/15",
                            !selected && "border-white/12",
                          )}
                        >
                          <p className="text-sm font-black text-white">{card.title}</p>
                          <p className="mt-2 text-xs text-white/52">{card.good ? "может стать доказательством" : "звучит рискованно"}</p>
                        </motion.button>
                      );
                    })}
                  </div>
                  <motion.div layout className="rounded-3xl border border-fuchsia-300/25 bg-fuchsia-400/[0.07] p-4 shadow-2xl shadow-fuchsia-950/30">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-fuchsia-100">Твой кейс</p>
                      <p className="text-xs text-white/55">{selectedCards.length}/3</p>
                    </div>
                    <div className="mt-4 grid gap-3">
                      {chosenCaseCards.length === 0 ? (
                        <Sticker title="Портфолио" text="мне грустно" face=":(" />
                      ) : (
                        chosenCaseCards.map((card) => (
                          <motion.div
                            key={card.id}
                            layout
                            initial={reduceMotion ? false : { opacity: 0, x: 24, scale: 0.92 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            className={cn("rounded-2xl border p-3", card.good ? "border-emerald-300/45 bg-emerald-400/10" : "border-amber-300/45 bg-amber-400/10")}
                          >
                            <p className="text-sm font-bold">{card.title}</p>
                          </motion.div>
                        ))
                      )}
                    </div>
                    {lastMeme && <MemeBubble compact text={lastMeme} />}
                  </motion.div>
                </div>
                <FooterAction>
                  <PrimaryButton disabled={selectedCards.length < 3} onClick={() => next(4)}>Показать рынку</PrimaryButton>
                </FooterAction>
              </Screen>
            )}

            {step === 4 && (
              <Screen key="market">
                <SectionTitle eyebrow="Шаг 4" title="Суд рынка" text="Теперь смотрим, как кейс воспринимают люди, которым нужно доверять твоему навыку." />
                <div className="grid gap-3 sm:grid-cols-3">
                  {marketReactions(marketLevel).map((item, index) => (
                    <Sticker key={item.title} title={item.title} text={item.text} face={item.face} glow={index === 1} />
                  ))}
                </div>
                <MemeBubble text={marketLevel === "strong" ? "База мощная. Сейчас доведем до конфетки." : marketLevel === "medium" ? "Материал есть, сейчас докрутим." : "Не паникуй. SkillBarter как раз для этого."} />
                <FooterAction>
                  <PrimaryButton onClick={() => next(5)}>Получить правку наставника</PrimaryButton>
                </FooterAction>
              </Screen>
            )}

            {step === 5 && (
              <Screen key="mentor">
                <SectionTitle eyebrow="Шаг 5" title="Наставник подключился" text="Он не ругает. Он превращает попытку в кейс." />
                <div className="rounded-3xl border border-white/12 bg-white/[0.06] p-4 shadow-2xl shadow-violet-950/30">
                  <div className="flex items-start gap-3">
                    <StickerAvatar label="Ментор" face=":D" />
                    <div className="min-w-0 flex-1 rounded-2xl border border-violet-300/25 bg-violet-400/10 p-4">
                      {!typed ? (
                        <div className="flex gap-1">
                          <TypingDot />
                          <TypingDot delay={0.12} />
                          <TypingDot delay={0.24} />
                        </div>
                      ) : (
                        <motion.p initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-base font-semibold leading-relaxed">
                          {track.mentorFix}
                        </motion.p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <SecondaryButton onClick={() => chooseMentor("ignore")}>Игнорировать и страдать</SecondaryButton>
                  <PrimaryButton onClick={() => chooseMentor("improve")}>Принять правку и апгрейднуться</PrimaryButton>
                </div>
                {mentorDecision && <MemeBubble text={lastMeme ?? ""} />}
              </Screen>
            )}

            {step === 6 && (
              <Screen key="boss">
                <SectionTitle eyebrow="Шаг 6" title="Финальная битва" text="Босс слабее, когда у тебя есть не слова, а доказательство." />
                <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                  <div className="space-y-3">
                    <Sticker title="Студент с кейсом" text={track.caseName} face=":)" glow />
                    <div className="rounded-3xl border border-white/12 bg-white/[0.06] p-4">
                      <p className="text-sm text-white/55">Твой ответ</p>
                      <AnimatePresence mode="wait">
                        <motion.p key={attackIndex} initial={reduceMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mt-2 text-2xl font-black text-emerald-200">
                          {attackIndex === 0 ? "Готов к атаке." : attacks[Math.min(attackIndex - 1, 2)].text}
                        </motion.p>
                      </AnimatePresence>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <BossSticker defeated={attackIndex >= 3} />
                    <div className="rounded-2xl border border-red-300/25 bg-red-500/10 p-4">
                      <div className="flex items-center justify-between text-sm font-bold">
                        <span>HP босса</span>
                        <span>{bossHp}%</span>
                      </div>
                      <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/10">
                        <motion.div className="h-full rounded-full bg-gradient-to-r from-red-400 to-fuchsia-300" animate={{ width: `${bossHp}%` }} />
                      </div>
                      <p className="mt-3 text-lg font-black">{attackIndex >= 3 ? "Босс побежден" : bossLines[attackIndex]}</p>
                    </div>
                    <AnimatePresence>
                      {attackIndex < 3 ? (
                        <motion.div key="attacks" className="grid gap-3" initial={false}>
                          <PrimaryButton onClick={hitBoss}>{attacks[attackIndex].label}</PrimaryButton>
                        </motion.div>
                      ) : (
                        <motion.div key="defeat" initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="space-y-3">
                          <MemeBubble text="Босс побежден. Теперь у тебя есть не слова, а доказательство." />
                          <PrimaryButton onClick={() => next(7)}>Разблокировать Skill ID</PrimaryButton>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </Screen>
            )}

            {step === 7 && (
              <Screen key="skillid">
                <Confetti />
                <SectionTitle eyebrow="Шаг 7" title="Skill ID активирован" text="Кейс, правка и результат собираются в цифровое доказательство навыка." />
                <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr] lg:items-start">
                  <SkillIdCard goal={goal} track={track} scores={scores} />
                  <div className="grid gap-3">
                    <Sticker title="Можно зарабатывать" text="Кейс помогает заказчику понять, за что он платит." face="$" glow />
                    <Sticker title="Можно искать работу" text="Работодатель видит подтвержденный результат." face=":O" />
                    <Sticker title="Можно расти" text="Наставник помогает сделать работу сильнее." face="^_^" />
                  </div>
                </div>
                <MemeBubble text={finalMeme(scores)} />
                <div className="grid gap-3 sm:grid-cols-3">
                  <LinkButton href="/access">Открыть MVP</LinkButton>
                  <SecondaryButton onClick={restart}>Пройти еще раз</SecondaryButton>
                  <SecondaryButton onClick={shareQuest}>{shared ? "Ссылка готова" : "Показать другу"}</SecondaryButton>
                </div>
                <FooterAction>
                  <PrimaryButton onClick={() => next(8)}>Финальный вывод</PrimaryButton>
                </FooterAction>
              </Screen>
            )}

            {step === 8 && (
              <Screen key="final">
                <div className="mx-auto max-w-3xl text-center">
                  <motion.div {...pop(0)} className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-[2rem] border border-fuchsia-300/40 bg-fuchsia-400/15 text-5xl shadow-2xl shadow-fuchsia-500/20">
                    ✨
                  </motion.div>
                  <motion.h2 {...titleMotion(0.05)} className="text-4xl font-black leading-tight sm:text-6xl">
                    Твой навык может работать на тебя
                  </motion.h2>
                  <motion.p {...fade(0.16)} className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/72 sm:text-lg">
                    Неважно, ты программист, повар, педагог, психолог, юрист или дизайнер. Если результат можно показать, ему проще доверять. SkillBarter помогает сделать первый шаг: пройти урок, выполнить задачу, получить правку и собрать доказанный Skill ID.
                  </motion.p>
                  <motion.div {...pop(0.24)} className="mt-6 rounded-3xl border border-emerald-300/25 bg-emerald-400/10 p-5 text-2xl font-black text-emerald-100">
                    Не просто &quot;я умею&quot;. А &quot;вот что я сделал&quot;.
                  </motion.div>
                  <motion.div {...fade(0.32)} className="mt-6">
                    <LinkButton href="/access">Перейти на SkillBarter</LinkButton>
                  </motion.div>
                </div>
              </Screen>
            )}
          </AnimatePresence>
        </div>

        <footer className="relative z-10 pb-4 text-center text-xs text-white/45">
          SkillBarter - платформа, где навык становится доказанным результатом.
        </footer>
      </section>
    </main>
  );
}

function ProgressLine({ step }: { step: Step }) {
  return (
    <div className="mt-3">
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-fuchsia-400 via-violet-300 to-emerald-300"
          animate={{ width: `${((step + 1) / 9) * 100}%` }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function ScoreBars({ scores }: { scores: { trust: number; quality: number; chance: number } }) {
  return (
    <div className="relative z-10 grid gap-2 rounded-2xl border border-white/10 bg-white/[0.045] p-3 sm:grid-cols-3">
      <Score label="Доверие" value={scores.trust} />
      <Score label="Качество кейса" value={scores.quality} />
      <Score label="Шанс" value={scores.chance} />
    </div>
  );
}

function Score({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs font-bold text-white/70">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/10">
        <motion.div className="h-full rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-300" animate={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function Screen({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="relative z-10 w-full"
    >
      {children}
    </motion.div>
  );
}

function SectionTitle({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <div className="mb-5">
      <p className="text-xs font-black uppercase tracking-[0.24em] text-fuchsia-200">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-black leading-tight sm:text-5xl">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base">{text}</p>
    </div>
  );
}

function CardGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{children}</div>;
}

function ChoiceCard({
  active,
  icon: Icon,
  title,
  text,
  badge,
  onClick,
  delay = 0,
}: {
  active: boolean;
  icon: LucideIcon;
  title: string;
  text: string;
  badge?: string;
  onClick: () => void;
  delay?: number;
}) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: active ? 1.035 : 1 }}
      transition={{ delay, duration: 0.26 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={cn(
        "min-h-40 rounded-3xl border p-4 text-left transition",
        "bg-white/[0.055] hover:-translate-y-0.5 hover:bg-white/[0.085]",
        active ? "border-fuchsia-300/70 shadow-2xl shadow-fuchsia-500/20" : "border-white/12",
      )}
    >
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-fuchsia-300/25 bg-fuchsia-300/10 text-fuchsia-100">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-lg font-black">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-white/62">{text}</p>
      {badge && <p className="mt-3 rounded-2xl border border-white/10 bg-black/20 p-2 text-xs text-white/56">{badge}</p>}
    </motion.button>
  );
}

function PrimaryButton({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: disabled ? 1 : 0.96 }}
      onClick={onClick}
      disabled={disabled}
      className="min-h-12 w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 to-violet-500 px-5 py-3 text-base font-black text-white shadow-lg shadow-fuchsia-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto"
    >
      <span className="inline-flex items-center justify-center gap-2">
        {children}
        <ArrowRight className="h-4 w-4" />
      </span>
    </motion.button>
  );
}

function SecondaryButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className="min-h-12 rounded-2xl border border-white/14 bg-white/[0.06] px-5 py-3 text-base font-black text-white transition hover:bg-white/[0.1]"
    >
      {children}
    </motion.button>
  );
}

function LinkButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-500 to-violet-500 px-5 py-3 text-base font-black text-white shadow-lg shadow-fuchsia-500/20 transition hover:-translate-y-0.5 sm:w-auto">
      {children}
    </Link>
  );
}

function FooterAction({ children }: { children: React.ReactNode }) {
  return <div className="mt-5 flex justify-center">{children}</div>;
}

function MemeBubble({ text, compact }: { text: string; compact?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={cn("mt-4 rounded-3xl border border-fuchsia-300/25 bg-fuchsia-300/10 p-4 font-bold text-fuchsia-50 shadow-xl shadow-fuchsia-950/20", compact && "text-sm")}
    >
      {text}
    </motion.div>
  );
}

function PathLights() {
  return (
    <div className="mb-5 flex flex-wrap gap-2">
      {pathItems.map((item, index) => (
        <motion.div
          key={item}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.08 }}
          className="rounded-full border border-fuchsia-300/25 bg-fuchsia-300/10 px-3 py-1 text-xs font-bold text-fuchsia-100"
        >
          {item}
        </motion.div>
      ))}
    </div>
  );
}

function Sticker({ title, text, face, glow }: { title: string; text: string; face: string; glow?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -3 }}
      className={cn(
        "rounded-3xl border p-4 text-center",
        glow ? "border-fuchsia-300/45 bg-fuchsia-400/12 shadow-xl shadow-fuchsia-500/15" : "border-white/12 bg-white/[0.06]",
      )}
    >
      <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-[1.4rem] border border-white/14 bg-black/20 text-2xl font-black">
        {face}
      </div>
      <h3 className="text-base font-black">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-white/62">{text}</p>
    </motion.div>
  );
}

function StickerAvatar({ label, face }: { label: string; face: string }) {
  return (
    <div className="shrink-0 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-fuchsia-300/30 bg-fuchsia-400/15 text-xl font-black">{face}</div>
      <p className="mt-1 text-[10px] font-bold text-white/50">{label}</p>
    </div>
  );
}

function BossSticker({ big, defeated }: { big?: boolean; defeated?: boolean }) {
  return (
    <motion.div
      animate={defeated ? { rotate: [-1, 1, -2, 0], scale: 0.96, opacity: 0.75 } : { y: [0, -5, 0] }}
      transition={{ duration: defeated ? 0.45 : 2.2, repeat: defeated ? 0 : Infinity }}
      className={cn("rounded-[2rem] border bg-red-500/10 p-5 text-center shadow-2xl shadow-red-950/30", defeated ? "border-emerald-300/45" : "border-red-300/35", big && "p-6")}
    >
      <div className="mx-auto mb-3 flex h-24 w-24 items-center justify-center rounded-[2rem] border border-red-300/35 bg-black/25 text-5xl font-black">
        {defeated ? "x_x" : "😐"}
      </div>
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-100">финальный босс студента</p>
      <h3 className="mt-2 text-2xl font-black">Без опыта не берем</h3>
      <p className="mt-2 text-sm text-white/55">{defeated ? "временно обезврежен кейсом" : "атакует фразой: а кейсы есть?"}</p>
    </motion.div>
  );
}

function TypingDot({ delay = 0 }: { delay?: number }) {
  return (
    <motion.span
      className="h-2 w-2 rounded-full bg-fuchsia-200"
      animate={{ opacity: [0.35, 1, 0.35], y: [0, -3, 0] }}
      transition={{ duration: 0.8, repeat: Infinity, delay }}
    />
  );
}

function SkillIdCard({ goal, track, scores }: { goal: Goal; track: Track; scores: { trust: number; quality: number; chance: number } }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="rounded-[2rem] border border-emerald-300/35 bg-gradient-to-br from-emerald-400/14 via-fuchsia-400/10 to-white/[0.05] p-5 shadow-2xl shadow-emerald-950/30"
    >
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
        <InfoRow label="Цель" value={goal.title} />
        <InfoRow label="Направление" value={track.title} />
        <InfoRow label="Кейс" value={track.caseName} />
        <InfoRow label="Доверие" value={`${scores.trust}%`} />
        <InfoRow label="Качество кейса" value={`${scores.quality}%`} />
        <InfoRow label="Возможность" value={goal.opportunity} />
      </div>
      <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-300/35 bg-emerald-400/12 px-3 py-2 text-sm font-black text-emerald-100">
        <ShieldCheck className="h-4 w-4" />
        Кейс разблокирован
      </div>
    </motion.div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/18 p-3">
      <span className="text-sm text-white/55">{label}</span>
      <span className="text-right text-sm font-black">{value}</span>
    </div>
  );
}

function Confetti() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {Array.from({ length: 22 }).map((_, index) => (
        <motion.span
          key={index}
          className="absolute h-2 w-2 rounded-full bg-fuchsia-300"
          style={{ left: `${(index * 37) % 100}%`, top: "-8px" }}
          animate={{ y: ["0vh", "105vh"], rotate: [0, 220], opacity: [0, 1, 0] }}
          transition={{ duration: 2.8 + (index % 5) * 0.18, delay: index * 0.035, repeat: Infinity, repeatDelay: 1.8 }}
        />
      ))}
    </div>
  );
}

function marketReactions(level: "strong" | "medium" | "weak") {
  if (level === "strong") {
    return [
      { title: "Заказчик", text: "О, тут уже есть за что платить", face: "👀" },
      { title: "Работодатель", text: "Не просто слова. Можно открыть кейс.", face: ":O" },
      { title: "Наставник", text: "База мощная. Докрутим.", face: ":D" },
    ];
  }
  if (level === "medium") {
    return [
      { title: "Заказчик", text: "Идея есть, но надо докрутить.", face: ":/" },
      { title: "Работодатель", text: "Пока не вау, но потенциал вижу.", face: "o_o" },
      { title: "Наставник", text: "Сейчас правка сделает магию.", face: ":D" },
    ];
  }
  return [
    { title: "Рынок", text: "Пока сыровато.", face: ":|" },
    { title: "Работодатель", text: "Мне нужно доказательство.", face: "-_-" },
    { title: "Наставник", text: "Спокойно, апгрейднем.", face: ":)" },
  ];
}

function finalMeme(scores: { trust: number; quality: number; chance: number }) {
  const total = Math.round((scores.trust + scores.quality + scores.chance) / 3);
  if (total >= 85) return "Работодатель: 'Так, это уже интересно.'";
  if (total >= 65) return "Хороший старт. Еще пару кейсов - и профиль будет мощнее.";
  return "Первый кейс есть. Теперь главное - не остановиться.";
}

function fade(delay = 0) {
  return {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.34, ease: "easeOut" as const },
  };
}

function pop(delay = 0) {
  return {
    initial: { opacity: 0, y: 18, scale: 0.96 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { delay, duration: 0.36, ease: "easeOut" as const },
  };
}

function titleMotion(delay = 0) {
  return {
    initial: { opacity: 0, y: 26, clipPath: "inset(0 0 100% 0)" },
    animate: { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" },
    transition: { delay, duration: 0.62, ease: "easeOut" as const },
  };
}
