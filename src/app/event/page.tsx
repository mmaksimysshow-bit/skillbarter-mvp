"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
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
  RefreshCcw,
  Scale,
  ShieldCheck,
  Trophy,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
type GoalId = "money" | "job" | "portfolio" | "growth";
type TrackId = "code" | "design" | "cook" | "teach" | "psy" | "law";

type Goal = {
  id: GoalId;
  title: string;
  short: string;
  meme: string;
  opportunity: string;
  icon: LucideIcon;
};

type Track = {
  id: TrackId;
  title: string;
  short: string;
  icon: LucideIcon;
  meme: string;
  caseTitle: string;
  mission: string;
  good: string[];
  bad: string[];
  badMeme: string;
  repairScene: string;
  weakSpot: string;
  repairOptions: string[];
  repairAnswer: number;
  repairWin: string;
  mentorLine: string;
};

type CasePart = {
  id: string;
  title: string;
  good: boolean;
};

const goals: Goal[] = [
  {
    id: "money",
    title: "Заработок",
    short: "получать первые заказы",
    meme: "Клиент платит не за «я умею», а за результат, который можно посмотреть.",
    opportunity: "заказ",
    icon: Coins,
  },
  {
    id: "job",
    title: "Работа",
    short: "выглядеть сильнее на собеседовании",
    meme: "Работодатель не телепат. Ему нужен кейс, а не обещание «я быстро учусь».",
    opportunity: "работа",
    icon: BriefcaseBusiness,
  },
  {
    id: "portfolio",
    title: "Портфолио",
    short: "собрать первые доказательства",
    meme: "Пустое портфолио грустит. Пора кормить его кейсами.",
    opportunity: "портфолио",
    icon: Trophy,
  },
  {
    id: "growth",
    title: "Прокачка",
    short: "понять свой уровень через практику",
    meme: "Теория без практики - как спортзал по видео: понял, но форму не набрал.",
    opportunity: "рост",
    icon: Zap,
  },
];

const tracks: Track[] = [
  {
    id: "code",
    title: "Программист",
    short: "сайты, формы, боты",
    icon: Code2,
    meme: "Если работает с первого раза - подозрительно. Но кейс спасает.",
    caseTitle: "Страница заявки для бизнеса",
    mission: "Бизнесу нужна страница, где клиент может оставить заявку.",
    good: ["Форма реально отправляет заявку", "Кнопка работает", "На телефоне все нормально"],
    bad: ["Красивый фон, но кнопка мертвая", "Ошибка в консоли", "Мобилка уехала в отпуск"],
    badMeme: "Кнопка умерла. Пользователь почти тоже.",
    repairScene: "На макете форма есть, но заявка никуда не отправляется.",
    weakSpot: "мертвая кнопка",
    repairOptions: ["Перекрасить фон", "Проверить отправку формы", "Добавить еще один слоган"],
    repairAnswer: 1,
    repairWin: "Форма отправляет заявку. Это уже можно показать.",
    mentorLine: "Покажи, что пользователь реально может оставить заявку.",
  },
  {
    id: "design",
    title: "Дизайнер",
    short: "интерфейсы, визуал, презентации",
    icon: Palette,
    meme: "17 шрифтов - это не стиль, это преступление.",
    caseTitle: "Первый экран сайта",
    mission: "Клиенту нужен первый экран, которому можно доверять.",
    good: ["Понятный заголовок", "Видимая кнопка", "Польза за 5 секунд"],
    bad: ["18 эффектов, все мигает", "Мелкий текст как договор банка", "Градиент ради градиента"],
    badMeme: "18 эффектов покинули чат.",
    repairScene: "На первом экране много декора, но непонятно, что делать.",
    weakSpot: "слабый фокус",
    repairOptions: ["Добавить больше эффектов", "Выделить пользу и кнопку", "Сделать текст еще мельче"],
    repairAnswer: 1,
    repairWin: "Польза и кнопка стали главным фокусом.",
    mentorLine: "Убери шум. Заголовок, польза и кнопка должны вести взгляд.",
  },
  {
    id: "cook",
    title: "Повар",
    short: "блюда, подача, технология",
    icon: ChefHat,
    meme: "«Вкусно» на словах не считается.",
    caseTitle: "Блюдо для меню кафе",
    mission: "Кафе просит блюдо, которое можно оценить и повторить.",
    good: ["Состав блюда", "Технология приготовления", "Подача и фото результата"],
    bad: ["Просто написать «вкусно»", "Готовить на глаз", "Время приготовления пустое"],
    badMeme: "«Вкусно» - эмоция. Кейс - доказательство.",
    repairScene: "Фото блюда есть, но состава, технологии и времени нет.",
    weakSpot: "нет технологии",
    repairOptions: ["Добавить состав, технологию и время", "Написать «авторское»", "Оставить только фото"],
    repairAnswer: 0,
    repairWin: "Блюдо можно повторить и оценить. Кейс ожил.",
    mentorLine: "Добавь состав, технологию, время и подачу.",
  },
  {
    id: "teach",
    title: "Педагог",
    short: "объяснение, уроки, ученики",
    icon: GraduationCap,
    meme: "Ученик кивнул. Но понял ли он?",
    caseTitle: "Мини-урок для новичка",
    mission: "Нужно объяснить сложную тему так, чтобы новичок понял.",
    good: ["Объяснить простыми словами", "Дать пример из жизни", "Проверить понимание"],
    bad: ["Завалить терминами", "Сказать «ну очевидно»", "Кивнул - значит понял"],
    badMeme: "Кивок не всегда понимание.",
    repairScene: "В мини-уроке есть тема, но нет примера и проверки.",
    weakSpot: "нет проверки",
    repairOptions: ["Добавить пример и вопрос", "Добавить терминов", "Закончить словами «понятно же»"],
    repairAnswer: 0,
    repairWin: "Теперь ученик не просто кивнул, а проверил понимание.",
    mentorLine: "Добавь пример и короткий вопрос ученику.",
  },
  {
    id: "psy",
    title: "Психолог",
    short: "коммуникация, этика, поддержка",
    icon: HeartHandshake,
    meme: "Диагноз за 5 секунд - сразу бан.",
    caseTitle: "Этичный разбор запроса",
    mission: "Человек описал трудную ситуацию. Нужна безопасная коммуникация.",
    good: ["Уточнить запрос", "Соблюдать границы", "Не обесценивать"],
    bad: ["Диагноз за 5 секунд", "Давить мнением", "Решить все за человека"],
    badMeme: "Диагноз за 5 секунд - бан. Запрос и границы - база.",
    repairScene: "Ответ звучит обесценивающе: «да все нормально, не думай».",
    weakSpot: "обесценивание",
    repairOptions: ["Уточнить запрос и границы", "Поставить диагноз", "Сказать, что делать"],
    repairAnswer: 0,
    repairWin: "Диалог стал этичным: сначала запрос, потом поддержка.",
    mentorLine: "Сначала уточни запрос и сохрани границы общения.",
  },
  {
    id: "law",
    title: "Юрист",
    short: "факты, документы, позиция",
    icon: Scale,
    meme: "Громкий голос - не доказательство.",
    caseTitle: "Правовая позиция по ситуации",
    mission: "Человеку нужно понять, на чем строить позицию.",
    good: ["Выяснить факты", "Посмотреть документы", "Найти основание"],
    bad: ["Обещать победу", "Громко спорить", "Забыть про факты"],
    badMeme: "Обещать победу легко. Доказать позицию сложнее.",
    repairScene: "Ответ: «точно выиграем», но фактов и основания нет.",
    weakSpot: "обещание без фактов",
    repairOptions: ["Обещать увереннее", "Сначала факты, документы и основание", "Спорить громче"],
    repairAnswer: 1,
    repairWin: "Позиция стала основываться на фактах, а не на обещании.",
    mentorLine: "Сначала факты и документы, потом основание. Без обещаний победы.",
  },
];

const bossRounds = [
  { question: "А опыт есть?", attack: "Показать кейс", result: "Минус аргумент босса." },
  { question: "А кто проверил?", attack: "Показать правку наставника", result: "Наставник вошел в чат." },
  { question: "А где посмотреть?", attack: "Открыть Skill ID", result: "Skill ID добил босса." },
];

const clamp = (value: number) => Math.max(0, Math.min(100, value));

export default function EventPage() {
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState<Step>(0);
  const [energy, setEnergy] = useState(0);
  const [goalId, setGoalId] = useState<GoalId | null>(null);
  const [trackId, setTrackId] = useState<TrackId | null>(null);
  const [caseParts, setCaseParts] = useState<CasePart[]>([]);
  const [repairChoice, setRepairChoice] = useState<number | null>(null);
  const [mentorBoosts, setMentorBoosts] = useState<string[]>([]);
  const [bossRound, setBossRound] = useState(0);
  const [message, setMessage] = useState<string | null>("Заряди навык тапами и начни игру.");
  const [shared, setShared] = useState(false);

  const goal = goals.find((item) => item.id === goalId) ?? goals[0];
  const track = tracks.find((item) => item.id === trackId) ?? tracks[0];
  const goodCount = caseParts.filter((part) => part.good).length;
  const repairDone = repairChoice === track.repairAnswer;

  const scores = useMemo(() => {
    const base = Math.round(energy * 0.18);
    return {
      trust: clamp(base + (goalId ? 10 : 0) + (trackId ? 10 : 0) + goodCount * 12 + mentorBoosts.length * 8 + (repairDone ? 22 : 0)),
      casePower: clamp(base + goodCount * 15 + mentorBoosts.length * 9 + (repairDone ? 25 : 0)),
      chance: clamp((goalId ? 12 : 0) + goodCount * 10 + mentorBoosts.length * 8 + (repairDone ? 25 : 0)),
    };
  }, [energy, goalId, trackId, goodCount, mentorBoosts.length, repairDone]);

  const bossHp = clamp(100 - bossRound * 34);
  const availableParts = [...track.good.map((title, index) => ({ id: `g-${index}`, title, good: true })), ...track.bad.map((title, index) => ({ id: `b-${index}`, title, good: false }))];

  const tapEnergy = () => {
    setEnergy((value) => clamp(value + 14));
    setMessage(energy >= 86 ? "Навык заряжен. Теперь докажи его делом." : "Навык пошел в дело.");
    navigator.vibrate?.(18);
  };

  const restart = () => {
    setStep(0);
    setEnergy(0);
    setGoalId(null);
    setTrackId(null);
    setCaseParts([]);
    setRepairChoice(null);
    setMentorBoosts([]);
    setBossRound(0);
    setMessage("Заряди навык тапами и начни игру.");
    setShared(false);
  };

  const chooseGoal = (item: Goal) => {
    setGoalId(item.id);
    setMessage(item.meme);
    navigator.vibrate?.(20);
  };

  const chooseTrack = (item: Track) => {
    setTrackId(item.id);
    setCaseParts([]);
    setRepairChoice(null);
    setMentorBoosts([]);
    setMessage(item.meme);
    navigator.vibrate?.(20);
  };

  const addCasePart = (part: CasePart) => {
    if (caseParts.find((item) => item.id === part.id) || caseParts.length >= 3) return;
    setCaseParts((items) => [...items, part]);
    setMessage(part.good ? "Деталь кейса добавлена. Портфолио оживает." : track.badMeme);
    navigator.vibrate?.(part.good ? 25 : [18, 35, 18]);
  };

  const chooseRepair = (index: number) => {
    setRepairChoice(index);
    setMessage(index === track.repairAnswer ? track.repairWin : "Почти. Наставник подсветил слабое место - выбери точнее.");
    navigator.vibrate?.(index === track.repairAnswer ? 35 : [18, 35, 18]);
  };

  const toggleBoost = (boost: string) => {
    setMentorBoosts((items) => {
      if (items.includes(boost)) return items;
      return [...items, boost];
    });
    setMessage("Правка принята. Кейс стал сильнее.");
    navigator.vibrate?.(20);
  };

  const attackBoss = (index: number) => {
    if (index !== bossRound) {
      setMessage("Босс не понял. Попробуй другой аргумент.");
      navigator.vibrate?.([18, 35, 18]);
      return;
    }
    setBossRound((value) => value + 1);
    setMessage(bossRounds[index].result);
    navigator.vibrate?.(35);
  };

  const shareQuest = async () => {
    const text = "SkillBarter Quest: навык -> кейс -> правка -> Skill ID.";
    if (navigator.share) {
      await navigator.share({ title: "SkillBarter Quest", text, url: window.location.href }).catch(() => undefined);
    } else {
      await navigator.clipboard?.writeText(window.location.href).catch(() => undefined);
    }
    setShared(true);
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#07040f] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(168,85,247,0.22),transparent_34%),radial-gradient(circle_at_80%_30%,rgba(217,70,239,0.16),transparent_30%),linear-gradient(180deg,#07040f,#0d0618_48%,#07040f)]" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] opacity-60 [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 pb-7 pt-4 sm:px-6">
        <header className="sticky top-0 z-20 -mx-4 mb-3 border-b border-white/10 bg-[#07040f]/88 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-fuchsia-200">SkillBarter live quest</p>
              <h1 className="truncate text-lg font-black sm:text-2xl">Навык → кейс → деньги/работа</h1>
            </div>
            <div className="rounded-full border border-fuchsia-400/30 bg-fuchsia-400/10 px-3 py-1 text-xs font-bold text-fuchsia-100">
              {step + 1}/8
            </div>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-fuchsia-400 via-violet-300 to-emerald-300" animate={{ width: `${((step + 1) / 8) * 100}%` }} />
          </div>
        </header>

        <ScorePanel scores={scores} />
        {message && <ToastLine text={message} />}

        <div className="flex flex-1 items-center py-4">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <Screen key="start">
                <div className="grid gap-5 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
                  <div>
                    <PathPills />
                    <motion.h2 {...titleMotion(0, reduceMotion)} className="text-4xl font-black leading-[0.95] sm:text-6xl">
                      Ты умеешь. <br />Но кто это увидит?
                    </motion.h2>
                    <motion.p {...fade(0.12, reduceMotion)} className="mt-4 max-w-xl text-base leading-relaxed text-white/72 sm:text-lg">
                      Заряди навык тапами, собери кейс, прими правку наставника и победи босса «Без опыта не берем».
                    </motion.p>
                    <motion.div {...fade(0.2, reduceMotion)} className="mt-5">
                      <EnergyButton value={energy} onTap={tapEnergy} />
                    </motion.div>
                    <motion.div {...fade(0.28, reduceMotion)} className="mt-5">
                      <PrimaryButton disabled={energy < 100} onClick={() => setStep(1)}>
                        Начать квест
                      </PrimaryButton>
                    </motion.div>
                  </div>
                  <motion.div {...pop(0.1, reduceMotion)} className="space-y-3">
                    <BossCard defeated={false} />
                    <Speech who="Студент" text="А где взять опыт, если без опыта не берут?" />
                    <div className="grid grid-cols-2 gap-3">
                      <Sticker title="Я умею" text="ну... допустим" face=":|" />
                      <Sticker title="Вот мой кейс" text="о, уже интересно" face=":)" hot />
                    </div>
                  </motion.div>
                </div>
              </Screen>
            )}

            {step === 1 && (
              <Screen key="goal">
                <Title eyebrow="Уровень 1" title="Поймай возможность" text="Тапни цель. Она попадет в инвентарь и даст первый бонус к шансу." />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {goals.map((item, index) => (
                    <GoalCard key={item.id} goal={item} active={goalId === item.id} delay={index * 0.04} onClick={() => chooseGoal(item)} reduceMotion={reduceMotion} />
                  ))}
                </div>
                <Inventory label="Инвентарь цели" value={goalId ? goal.title : "пока пусто"} />
                <Footer>
                  <PrimaryButton disabled={!goalId} onClick={() => setStep(2)}>
                    Выбрать персонажа
                  </PrimaryButton>
                </Footer>
              </Screen>
            )}

            {step === 2 && (
              <Screen key="track">
                <Title eyebrow="Уровень 2" title="Выбери персонажа" text="Любая профессия может стать кейсом, если результат можно показать." />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {tracks.map((item, index) => (
                    <TrackCard key={item.id} track={item} active={trackId === item.id} delay={index * 0.035} onClick={() => chooseTrack(item)} reduceMotion={reduceMotion} />
                  ))}
                </div>
                <Footer>
                  <PrimaryButton disabled={!trackId} onClick={() => setStep(3)}>
                    Получить миссию
                  </PrimaryButton>
                </Footer>
              </Screen>
            )}

            {step === 3 && (
              <Screen key="case">
                <Title eyebrow="Уровень 3" title="Собери кейс руками" text={track.mission} />
                <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                  <CaseForge parts={caseParts} />
                  <div className="grid gap-3 sm:grid-cols-2">
                    {availableParts.map((part, index) => (
                      <PartCard key={part.id} part={part} index={index} selected={caseParts.some((item) => item.id === part.id)} locked={caseParts.length >= 3} onClick={() => addCasePart(part)} reduceMotion={reduceMotion} />
                    ))}
                  </div>
                </div>
                <Footer>
                  <PrimaryButton disabled={caseParts.length < 3} onClick={() => setStep(4)}>
                    Отправить на проверку
                  </PrimaryButton>
                </Footer>
              </Screen>
            )}

            {step === 4 && (
              <Screen key="repair">
                <Title eyebrow="Уровень 4" title="Почини слабое место" text="Наставник нашел проблему. Тапни правильное улучшение, чтобы работа стала кейсом." />
                <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
                  <div className="rounded-3xl border border-white/12 bg-white/[0.06] p-4">
                    <div className="mb-3 flex items-center gap-3">
                      <Avatar face=":D" label="ментор" />
                      <div className="rounded-2xl border border-violet-300/25 bg-violet-400/10 p-3 text-sm font-bold text-white/76">
                        {track.mentorLine}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-amber-300/25 bg-amber-400/10 p-4">
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-100">Слабое место</p>
                      <p className="mt-2 text-lg font-black">{track.weakSpot}</p>
                      <p className="mt-2 text-sm text-white/62">{track.repairScene}</p>
                    </div>
                  </div>
                  <div className="grid gap-3">
                    {track.repairOptions.map((option, index) => {
                      const chosen = repairChoice === index;
                      const correct = index === track.repairAnswer;
                      return (
                        <motion.button
                          key={option}
                          type="button"
                          whileTap={{ scale: 0.96 }}
                          onClick={() => chooseRepair(index)}
                          className={cn(
                            "min-h-16 rounded-2xl border p-4 text-left text-base font-black transition",
                            "border-white/12 bg-white/[0.06] active:bg-white/[0.11] sm:hover:bg-white/[0.1]",
                            chosen && correct && "border-emerald-300/70 bg-emerald-400/14",
                            chosen && !correct && "border-amber-300/70 bg-amber-400/14",
                          )}
                        >
                          {option}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
                <Footer>
                  <PrimaryButton disabled={!repairDone} onClick={() => setStep(5)}>
                    Принять правку
                  </PrimaryButton>
                </Footer>
              </Screen>
            )}

            {step === 5 && (
              <Screen key="mentor">
                <Title eyebrow="Уровень 5" title="Апгрейд от наставника" text="Собери три улучшения. Это показывает, что навык растет через обратную связь." />
                <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                  <div className="rounded-3xl border border-fuchsia-300/25 bg-fuchsia-400/10 p-5">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-fuchsia-100">Чат наставника</p>
                    <p className="mt-3 text-xl font-black">«Не ругаю. Докручиваю до кейса.»</p>
                    <p className="mt-2 text-sm text-white/62">Тапни улучшения справа. Каждое усиливает Skill ID.</p>
                  </div>
                  <div className="grid gap-3">
                    {["Показать результат", "Убрать слабое место", "Добавить проверку"].map((boost) => (
                      <motion.button
                        key={boost}
                        type="button"
                        whileTap={{ scale: 0.96 }}
                        onClick={() => toggleBoost(boost)}
                        className={cn(
                          "min-h-16 rounded-2xl border p-4 text-left font-black transition",
                          mentorBoosts.includes(boost) ? "border-emerald-300/60 bg-emerald-400/14" : "border-white/12 bg-white/[0.06] active:bg-white/[0.1]",
                        )}
                      >
                        {mentorBoosts.includes(boost) ? "✓ " : "+ "}
                        {boost}
                      </motion.button>
                    ))}
                  </div>
                </div>
                <Footer>
                  <PrimaryButton disabled={mentorBoosts.length < 3} onClick={() => setStep(6)}>
                    Идем к боссу
                  </PrimaryButton>
                </Footer>
              </Screen>
            )}

            {step === 6 && (
              <Screen key="boss">
                <Title eyebrow="Финал" title="Битва с боссом" text="Босс атакует сомнением. Выбери правильный аргумент и сними HP." />
                <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                  <div className="space-y-3">
                    <Sticker title="Студент с кейсом" text={track.caseTitle} face=":)" hot />
                    <Speech who="Босс" text={bossRound >= 3 ? "..." : bossRounds[bossRound].question} />
                    <BossHp hp={bossRound >= 3 ? 0 : bossHp} />
                  </div>
                  <div className="space-y-3">
                    <BossCard defeated={bossRound >= 3} />
                    {bossRound < 3 ? (
                      <div className="grid gap-3">
                        {bossRounds.map((round, index) => (
                          <motion.button
                            key={round.attack}
                            type="button"
                            whileTap={{ scale: 0.96 }}
                            onClick={() => attackBoss(index)}
                            className={cn(
                              "min-h-14 rounded-2xl border p-4 text-left font-black transition",
                              "border-white/12 bg-white/[0.06] active:bg-white/[0.1]",
                              index === bossRound && "border-fuchsia-300/55 bg-fuchsia-400/10",
                            )}
                          >
                            {round.attack}
                          </motion.button>
                        ))}
                      </div>
                    ) : (
                      <motion.div {...pop(0, reduceMotion)} className="space-y-3">
                        <Sticker title="Босс побежден" text="теперь есть доказательство" face="x_x" hot />
                        <PrimaryButton onClick={() => setStep(7)}>
                          Разблокировать Skill ID
                        </PrimaryButton>
                      </motion.div>
                    )}
                  </div>
                </div>
              </Screen>
            )}

            {step === 7 && (
              <Screen key="final">
                <Burst />
                <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr] lg:items-start">
                  <SkillCard goal={goal} track={track} scores={scores} />
                  <div className="space-y-3">
                    <Title eyebrow="Награда" title="Skill ID активирован" text="Навык превратился в кейс, кейс - в доверие, доверие - в шанс на деньги или работу." />
                    <div className="grid gap-3">
                      <Sticker title="Заказы" text="клиенту проще поверить" face="$" hot />
                      <Sticker title="Работа" text="работодатель видит результат" face=":O" />
                      <Sticker title="Рост" text="правки делают сильнее" face="^_^" />
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

function ScorePanel({ scores }: { scores: { trust: number; casePower: number; chance: number } }) {
  return (
    <div className="relative z-10 grid gap-2 rounded-2xl border border-white/10 bg-white/[0.045] p-3 sm:grid-cols-3">
      <Score label="Доверие" value={scores.trust} />
      <Score label="Сила кейса" value={scores.casePower} />
      <Score label="Шанс" value={scores.chance} />
    </div>
  );
}

function Score({ label, value }: { label: string; value: number }) {
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
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base">{text}</p>
    </div>
  );
}

function PathPills() {
  return (
    <div className="mb-5 flex flex-wrap gap-2">
      {["Навык", "Кейс", "Правка", "Skill ID", "Деньги/Работа"].map((item, index) => (
        <motion.span key={item} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="rounded-full border border-fuchsia-300/25 bg-fuchsia-300/10 px-3 py-1 text-xs font-bold text-fuchsia-100">
          {item}
        </motion.span>
      ))}
    </div>
  );
}

function EnergyButton({ value, onTap }: { value: number; onTap: () => void }) {
  return (
    <motion.button type="button" whileTap={{ scale: 0.94 }} onClick={onTap} className="w-full rounded-[2rem] border border-fuchsia-300/35 bg-fuchsia-400/12 p-5 text-left sm:max-w-md">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-fuchsia-100">Заряд навыка</p>
          <p className="mt-1 text-2xl font-black">{value >= 100 ? "Готов к делу" : "Тапай сюда"}</p>
        </div>
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-black/20 text-2xl font-black">{value}%</div>
      </div>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
        <motion.div className="h-full rounded-full bg-gradient-to-r from-fuchsia-400 to-emerald-300" animate={{ width: `${value}%` }} />
      </div>
    </motion.button>
  );
}

function GoalCard({ goal, active, delay, onClick, reduceMotion }: { goal: Goal; active: boolean; delay: number; onClick: () => void; reduceMotion: boolean | null }) {
  const Icon = goal.icon;
  return (
    <motion.button type="button" initial={reduceMotion ? false : { opacity: 0, y: -22, rotate: delay * 20 - 3 }} animate={{ opacity: 1, y: 0, rotate: active ? 0 : delay * 20 - 3, scale: active ? 1.05 : 1 }} transition={{ delay, duration: 0.25 }} whileTap={{ scale: 0.94 }} onClick={onClick} className={cn("min-h-36 rounded-3xl border p-4 text-left transition active:bg-white/[0.1]", active ? "border-emerald-300/65 bg-emerald-400/12" : "border-white/12 bg-white/[0.055]")}>
      <Icon className="mb-4 h-7 w-7 text-fuchsia-100" />
      <h3 className="text-lg font-black">{goal.title}</h3>
      <p className="mt-2 text-sm text-white/62">{goal.short}</p>
    </motion.button>
  );
}

function TrackCard({ track, active, delay, onClick, reduceMotion }: { track: Track; active: boolean; delay: number; onClick: () => void; reduceMotion: boolean | null }) {
  const Icon = track.icon;
  return (
    <motion.button type="button" initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.96 }} animate={{ opacity: active ? 1 : 0.92, y: 0, scale: active ? 1.04 : 1 }} transition={{ delay, duration: 0.25 }} whileTap={{ scale: 0.94 }} onClick={onClick} className={cn("min-h-40 rounded-3xl border p-4 text-left transition active:bg-white/[0.1]", active ? "border-fuchsia-300/70 bg-fuchsia-400/12" : "border-white/12 bg-white/[0.055]")}>
      <Icon className="mb-4 h-7 w-7 text-fuchsia-100" />
      <h3 className="text-xl font-black">{track.title}</h3>
      <p className="mt-2 text-sm text-white/62">{track.short}</p>
      <p className="mt-3 rounded-2xl border border-white/10 bg-black/20 p-2 text-xs text-white/56">{track.meme}</p>
    </motion.button>
  );
}

function Inventory({ label, value }: { label: string; value: string }) {
  return (
    <motion.div layout className="mt-4 rounded-3xl border border-emerald-300/25 bg-emerald-400/10 p-4">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-100">{label}</p>
      <p className="mt-2 text-lg font-black">{value}</p>
    </motion.div>
  );
}

function CaseForge({ parts }: { parts: CasePart[] }) {
  return (
    <motion.div layout className="rounded-3xl border border-fuchsia-300/25 bg-fuchsia-400/[0.07] p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-fuchsia-100">Твой кейс</p>
        <p className="text-xs text-white/55">{parts.length}/3</p>
      </div>
      <div className="mt-4 grid gap-3">
        {[0, 1, 2].map((slot) => {
          const part = parts[slot];
          return (
            <motion.div key={slot} layout initial={part ? { opacity: 0, x: 22, scale: 0.92 } : false} animate={{ opacity: 1, x: 0, scale: 1 }} className={cn("min-h-20 rounded-2xl border p-3", part ? (part.good ? "border-emerald-300/45 bg-emerald-400/10" : "border-amber-300/45 bg-amber-400/10") : "border-dashed border-white/15 bg-black/18")}>
              <p className="text-sm font-bold">{part ? part.title : `[${slot + 1}] слот кейса`}</p>
              {!part && <p className="mt-1 text-xs text-white/42">выбери деталь</p>}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function PartCard({ part, index, selected, locked, onClick, reduceMotion }: { part: CasePart; index: number; selected: boolean; locked: boolean; onClick: () => void; reduceMotion: boolean | null }) {
  return (
    <motion.button type="button" initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: selected ? 0.55 : 1, y: 0, scale: selected ? 0.94 : 1, x: selected && !part.good ? [0, -4, 4, -2, 0] : 0 }} transition={{ delay: index * 0.025 }} whileTap={{ scale: 0.96 }} onClick={onClick} disabled={selected || locked} className={cn("min-h-24 rounded-2xl border p-4 text-left transition active:bg-white/[0.1]", selected && part.good ? "border-emerald-300/70 bg-emerald-400/12" : selected && !part.good ? "border-amber-300/70 bg-amber-400/12" : "border-white/12 bg-white/[0.055]")}>
      <p className="text-sm font-black">{part.title}</p>
      <p className="mt-2 text-xs text-white/52">{part.good ? "усиливает кейс" : "риск для кейса"}</p>
    </motion.button>
  );
}

function SkillCard({ goal, track, scores }: { goal: Goal; track: Track; scores: { trust: number; casePower: number; chance: number } }) {
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
        <Info label="Цель" value={goal.title} />
        <Info label="Направление" value={track.title} />
        <Info label="Кейс" value={track.caseTitle} />
        <Info label="Доверие" value={`${scores.trust}%`} />
        <Info label="Сила кейса" value={`${scores.casePower}%`} />
        <Info label="Шанс" value={`${scores.chance}%`} />
      </div>
      <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-300/35 bg-emerald-400/12 px-3 py-2 text-sm font-black text-emerald-100">
        <ShieldCheck className="h-4 w-4" />
        Кейс разблокирован
      </div>
    </motion.div>
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

function ToastLine({ text }: { text: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 mt-3 rounded-2xl border border-fuchsia-300/20 bg-fuchsia-300/10 p-3 text-sm font-bold text-fuchsia-50">
      {text}
    </motion.div>
  );
}

function Sticker({ title, text, face, hot }: { title: string; text: string; face: string; hot?: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} className={cn("rounded-3xl border p-4 text-center", hot ? "border-fuchsia-300/45 bg-fuchsia-400/12" : "border-white/12 bg-white/[0.06]")}>
      <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-[1.4rem] border border-white/14 bg-black/20 text-2xl font-black">{face}</div>
      <h3 className="text-base font-black">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-white/62">{text}</p>
    </motion.div>
  );
}

function Speech({ who, text }: { who: string; text: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-4">
      <p className="text-sm text-white/55">{who}</p>
      <p className="mt-1 text-xl font-black">{text}</p>
    </div>
  );
}

function Avatar({ face, label }: { face: string; label: string }) {
  return (
    <div className="shrink-0 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-fuchsia-300/30 bg-fuchsia-400/15 text-xl font-black">{face}</div>
      <p className="mt-1 text-[10px] font-bold text-white/50">{label}</p>
    </div>
  );
}

function BossCard({ defeated }: { defeated: boolean }) {
  return (
    <motion.div animate={defeated ? { rotate: [-1, 1, -2, 0], scale: 0.96, opacity: 0.76 } : { scale: [1, 1.015, 1] }} transition={{ duration: defeated ? 0.45 : 1.8, repeat: defeated ? 0 : Infinity }} className={cn("rounded-[2rem] border bg-red-500/10 p-5 text-center", defeated ? "border-emerald-300/45" : "border-red-300/35")}>
      <div className="mx-auto mb-3 flex h-24 w-24 items-center justify-center rounded-[2rem] border border-red-300/35 bg-black/25 text-5xl font-black">{defeated ? "x_x" : "😐"}</div>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-100">финальный босс</p>
      <h3 className="mt-2 text-2xl font-black">Без опыта не берем</h3>
      <p className="mt-2 text-sm text-white/55">{defeated ? "побежден доказательством" : "просит кейсы"}</p>
    </motion.div>
  );
}

function BossHp({ hp }: { hp: number }) {
  return (
    <div className="rounded-2xl border border-red-300/25 bg-red-500/10 p-4">
      <div className="flex items-center justify-between text-sm font-bold">
        <span>HP босса</span>
        <span>{hp}%</span>
      </div>
      <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/10">
        <motion.div className="h-full rounded-full bg-gradient-to-r from-red-400 to-fuchsia-300" animate={{ width: `${hp}%` }} />
      </div>
    </div>
  );
}

function Burst() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {Array.from({ length: 14 }).map((_, index) => (
        <motion.span key={index} className="absolute h-2 w-2 rounded-full bg-fuchsia-300" style={{ left: `${(index * 41) % 100}%`, top: "8%" }} animate={{ y: ["0vh", "70vh"], opacity: [0, 1, 0], rotate: [0, 180] }} transition={{ duration: 1.6 + (index % 4) * 0.12, delay: index * 0.03 }} />
      ))}
    </div>
  );
}

function fade(delay = 0, reduceMotion: boolean | null = false) {
  return {
    initial: reduceMotion ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.3, ease: "easeOut" as const },
  };
}

function pop(delay = 0, reduceMotion: boolean | null = false) {
  return {
    initial: reduceMotion ? false : { opacity: 0, y: 16, scale: 0.97 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { delay, duration: 0.32, ease: "easeOut" as const },
  };
}

function titleMotion(delay = 0, reduceMotion: boolean | null = false) {
  return {
    initial: reduceMotion ? false : { opacity: 0, y: 24, clipPath: "inset(0 0 100% 0)" },
    animate: { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" },
    transition: { delay, duration: 0.52, ease: "easeOut" as const },
  };
}
