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
type MemeKind = "boss" | "market" | "employer" | "mentor" | "portfolio" | "skill" | "money";

type Goal = {
  id: GoalId;
  title: string;
  text: string;
  meme: string;
  result: string;
  icon: LucideIcon;
};

type Track = {
  id: TrackId;
  title: string;
  text: string;
  icon: LucideIcon;
  meme: string;
  caseTitle: string;
  mission: string;
  goodParts: string[];
  badParts: string[];
  badMeme: string;
  weakSpot: string;
  repairOptions: string[];
  repairAnswer: number;
  mentorAdvice: string;
};

type Chip = {
  id: string;
  title: string;
  good: boolean;
  note: string;
};

const goals: Goal[] = [
  {
    id: "money",
    title: "Деньги",
    text: "первые заказы",
    meme: "Клиент: «Покажи результат, и можно говорить про оплату».",
    result: "заказ",
    icon: Coins,
  },
  {
    id: "job",
    title: "Работа",
    text: "сильнее на собеседовании",
    meme: "Работодатель не телепат. Ему нужен кейс.",
    result: "работа",
    icon: BriefcaseBusiness,
  },
  {
    id: "portfolio",
    title: "Портфолио",
    text: "не пустая страница",
    meme: "Портфолио оживает, когда в нем есть реальные работы.",
    result: "портфолио",
    icon: Trophy,
  },
  {
    id: "growth",
    title: "Прокачка",
    text: "понять свой уровень",
    meme: "Теория без практики - это тренировка без подходов.",
    result: "рост",
    icon: Zap,
  },
];

const tracks: Track[] = [
  {
    id: "code",
    title: "Код",
    text: "сайты, формы, боты",
    icon: Code2,
    meme: "Код есть. Теперь докажи, что он работает.",
    caseTitle: "Страница заявки для бизнеса",
    mission: "Бизнесу нужна страница, где клиент оставляет заявку.",
    goodParts: ["Рабочая форма", "Кнопка отправляет", "Мобильная версия"],
    badParts: ["Кнопка мертвая", "Ошибка в консоли", "Красивый фон вместо смысла"],
    badMeme: "Кнопка умерла. Пользователь почти тоже.",
    weakSpot: "форма не отправляет заявку",
    repairOptions: ["Перекрасить фон", "Проверить отправку формы", "Добавить еще слоган"],
    repairAnswer: 1,
    mentorAdvice: "Покажи, что пользователь реально может оставить заявку.",
  },
  {
    id: "design",
    title: "Дизайн",
    text: "интерфейсы, визуал",
    icon: Palette,
    meme: "17 шрифтов - это не стиль, это преступление.",
    caseTitle: "Первый экран сайта",
    mission: "Клиенту нужен первый экран, которому верят за 5 секунд.",
    goodParts: ["Понятный заголовок", "Видимая кнопка", "Польза за 5 секунд"],
    badParts: ["18 эффектов", "Текст как договор банка", "Градиент ради градиента"],
    badMeme: "18 эффектов покинули чат.",
    weakSpot: "польза и кнопка потерялись",
    repairOptions: ["Добавить огня", "Выделить пользу и кнопку", "Сделать текст мельче"],
    repairAnswer: 1,
    mentorAdvice: "Убери шум. Пусть заголовок, польза и кнопка ведут взгляд.",
  },
  {
    id: "cook",
    title: "Повар",
    text: "блюда, подача, меню",
    icon: ChefHat,
    meme: "«Вкусно» на словах не считается.",
    caseTitle: "Блюдо для меню кафе",
    mission: "Кафе нужно блюдо, которое можно повторить и оценить.",
    goodParts: ["Состав блюда", "Технология", "Подача результата"],
    badParts: ["Просто «вкусно»", "Готовить на глаз", "Время пустое"],
    badMeme: "«Вкусно» - эмоция. Кейс - доказательство.",
    weakSpot: "нет состава и технологии",
    repairOptions: ["Оставить только фото", "Добавить состав, технологию и время", "Назвать авторским"],
    repairAnswer: 1,
    mentorAdvice: "Добавь состав, технологию, время и подачу.",
  },
  {
    id: "teach",
    title: "Педагог",
    text: "мини-уроки, объяснение",
    icon: GraduationCap,
    meme: "Ученик кивнул. Но понял ли он?",
    caseTitle: "Мини-урок для новичка",
    mission: "Новичку нужно объяснить сложную тему простым языком.",
    goodParts: ["Простое объяснение", "Пример из жизни", "Проверка понимания"],
    badParts: ["Завалить терминами", "«Ну это очевидно»", "Кивнул - понял"],
    badMeme: "Кивок не всегда понимание.",
    weakSpot: "нет проверки понимания",
    repairOptions: ["Добавить пример и вопрос", "Добавить терминов", "Сказать «понятно же»"],
    repairAnswer: 0,
    mentorAdvice: "Добавь пример и короткий вопрос ученику.",
  },
  {
    id: "psy",
    title: "Психология",
    text: "коммуникация, этика",
    icon: HeartHandshake,
    meme: "Диагноз за 5 секунд - сразу бан.",
    caseTitle: "Этичный разбор запроса",
    mission: "Человеку нужна безопасная коммуникация, а не давление.",
    goodParts: ["Уточнить запрос", "Соблюдать границы", "Не обесценивать"],
    badParts: ["Диагноз за 5 секунд", "Давить мнением", "Решить за человека"],
    badMeme: "Диагноз за 5 секунд - бан. Запрос и границы - база.",
    weakSpot: "ответ звучит обесценивающе",
    repairOptions: ["Уточнить запрос", "Поставить диагноз", "Сказать, что делать"],
    repairAnswer: 0,
    mentorAdvice: "Сначала уточни запрос и сохрани границы общения.",
  },
  {
    id: "law",
    title: "Юрист",
    text: "факты, документы",
    icon: Scale,
    meme: "Громкий голос - не доказательство.",
    caseTitle: "Правовая позиция",
    mission: "Нужно построить позицию на фактах, а не обещаниях.",
    goodParts: ["Выяснить факты", "Посмотреть документы", "Найти основание"],
    badParts: ["Обещать победу", "Спорить громче", "Забыть факты"],
    badMeme: "Обещать победу легко. Доказать позицию сложнее.",
    weakSpot: "обещание результата без фактов",
    repairOptions: ["Обещать увереннее", "Факты, документы, основание", "Говорить громче"],
    repairAnswer: 1,
    mentorAdvice: "Сначала факты и документы, потом основание.",
  },
];

const proofChips: Chip[] = [
  { id: "lesson", title: "Урок", good: true, note: "получил базу" },
  { id: "task", title: "Задача", good: true, note: "применил навык" },
  { id: "mentor", title: "Правка", good: true, note: "наставник усилил" },
  { id: "words", title: "Я умею", good: false, note: "слова без кейса" },
  { id: "random", title: "Скрин без смысла", good: false, note: "не доказывает" },
  { id: "empty", title: "Пустое портфолио", good: false, note: "грустит" },
];

const bossRounds = [
  { ask: "А опыт есть?", attack: "Показать кейс", win: "Минус аргумент босса." },
  { ask: "А кто проверил?", attack: "Показать правку", win: "Наставник вошел в чат." },
  { ask: "А где посмотреть?", attack: "Открыть Skill ID", win: "Skill ID добил босса." },
];

const clamp = (value: number) => Math.max(0, Math.min(100, value));

export default function EventPage() {
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState<Step>(0);
  const [charge, setCharge] = useState(0);
  const [goalId, setGoalId] = useState<GoalId | null>(null);
  const [trackId, setTrackId] = useState<TrackId | null>(null);
  const [proof, setProof] = useState<string[]>([]);
  const [caseParts, setCaseParts] = useState<Chip[]>([]);
  const [repair, setRepair] = useState<number | null>(null);
  const [boosts, setBoosts] = useState<string[]>([]);
  const [bossRound, setBossRound] = useState(0);
  const [message, setMessage] = useState("Тапай ядро навыка. Сейчас сделаем из «я умею» доказательство.");
  const [combo, setCombo] = useState(0);
  const [shared, setShared] = useState(false);

  const goal = goals.find((item) => item.id === goalId) ?? goals[0];
  const track = tracks.find((item) => item.id === trackId) ?? tracks[0];
  const repairDone = repair === track.repairAnswer;
  const caseGood = caseParts.filter((item) => item.good).length;

  const scores = useMemo(() => {
    return {
      trust: clamp(Math.round(charge * 0.14) + (goalId ? 10 : 0) + (trackId ? 10 : 0) + proof.length * 9 + caseGood * 11 + boosts.length * 7 + (repairDone ? 16 : 0)),
      casePower: clamp(proof.length * 10 + caseGood * 14 + boosts.length * 10 + (repairDone ? 20 : 0)),
      chance: clamp((goalId ? 14 : 0) + proof.length * 8 + caseGood * 9 + boosts.length * 8 + (repairDone ? 22 : 0)),
    };
  }, [charge, goalId, trackId, proof.length, caseGood, boosts.length, repairDone]);

  const restart = () => {
    setStep(0);
    setCharge(0);
    setGoalId(null);
    setTrackId(null);
    setProof([]);
    setCaseParts([]);
    setRepair(null);
    setBoosts([]);
    setBossRound(0);
    setCombo(0);
    setMessage("Тапай ядро навыка. Сейчас сделаем из «я умею» доказательство.");
    setShared(false);
  };

  const pulse = (pattern: number | number[] = 18) => navigator.vibrate?.(pattern);

  const tapCharge = () => {
    setCharge((value) => clamp(value + 13));
    setCombo((value) => value + 1);
    setMessage(charge >= 87 ? "Навык проснулся. Но без кейса ему не поверят." : "Комбо растет. Навык заряжается.");
    pulse(14);
  };

  const chooseGoal = (item: Goal) => {
    setGoalId(item.id);
    setMessage(item.meme);
    pulse(20);
  };

  const chooseTrack = (item: Track) => {
    setTrackId(item.id);
    setCaseParts([]);
    setRepair(null);
    setBoosts([]);
    setMessage(item.meme);
    pulse(20);
  };

  const collectProof = (chip: Chip) => {
    if (proof.includes(chip.id)) return;
    if (!chip.good) {
      setMessage(`${chip.title}: смешно, но боссу это не доказательство.`);
      setCombo(0);
      pulse([18, 30, 18]);
      return;
    }
    setProof((items) => [...items, chip.id]);
    setCombo((value) => value + 1);
    setMessage(`${chip.title} пойман: ${chip.note}. SkillBarter собирает доказательство.`);
    pulse(20);
  };

  const addPart = (part: Chip) => {
    if (caseParts.find((item) => item.id === part.id) || caseParts.length >= 3) return;
    setCaseParts((items) => [...items, part]);
    setMessage(part.good ? "Деталь вошла в кейс. Портфолио оживает." : track.badMeme);
    setCombo(part.good ? combo + 1 : 0);
    pulse(part.good ? 18 : [18, 30, 18]);
  };

  const chooseRepair = (index: number) => {
    setRepair(index);
    if (index === track.repairAnswer) {
      setMessage("Ошибка починена. Работа стала сильнее.");
      setCombo((value) => value + 2);
      pulse(30);
    } else {
      setMessage("Почти, но это не лечит проблему. Попробуй другой фикс.");
      setCombo(0);
      pulse([18, 30, 18]);
    }
  };

  const toggleBoost = (boost: string) => {
    if (boosts.includes(boost)) return;
    setBoosts((items) => [...items, boost]);
    setMessage("Правка принята. Кейс эволюционировал.");
    setCombo((value) => value + 1);
    pulse(18);
  };

  const attackBoss = (index: number) => {
    if (index !== bossRound) {
      setMessage("Босс не понял этот аргумент. Нужен правильный порядок.");
      setCombo(0);
      pulse([18, 30, 18]);
      return;
    }
    setBossRound((value) => value + 1);
    setMessage(bossRounds[index].win);
    setCombo((value) => value + 2);
    pulse(35);
  };

  const shareQuest = async () => {
    const text = "Я прошел SkillBarter Quest: навык -> кейс -> Skill ID.";
    if (navigator.share) {
      await navigator.share({ title: "SkillBarter Quest", text, url: window.location.href }).catch(() => undefined);
    } else {
      await navigator.clipboard?.writeText(window.location.href).catch(() => undefined);
    }
    setShared(true);
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#06030d] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(217,70,239,0.24),transparent_32%),radial-gradient(circle_at_88%_22%,rgba(124,58,237,0.22),transparent_30%),linear-gradient(180deg,#06030d,#10071e_52%,#06030d)]" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:28px_28px] opacity-50 [mask-image:radial-gradient(circle_at_center,black,transparent_80%)]" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 pb-6 pt-4 sm:px-6">
        <header className="sticky top-0 z-20 -mx-4 mb-3 border-b border-white/10 bg-[#06030d]/90 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-fuchsia-200">SkillBarter arcade</p>
              <h1 className="truncate text-lg font-black sm:text-2xl">Навык → кейс → деньги/работа</h1>
            </div>
            <div className="rounded-full border border-fuchsia-400/30 bg-fuchsia-400/10 px-3 py-1 text-xs font-bold text-fuchsia-100">
              {step + 1}/8
            </div>
          </div>
          <Progress value={((step + 1) / 8) * 100} />
        </header>

        <ScorePanel scores={scores} combo={combo} />
        <motion.div key={message} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 mt-3 rounded-2xl border border-fuchsia-300/20 bg-fuchsia-300/10 p-3 text-sm font-bold text-fuchsia-50">
          {message}
        </motion.div>

        <div className="flex flex-1 items-center py-4">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <Screen key="intro">
                <div className="grid gap-5 lg:grid-cols-[1.04fr_0.96fr] lg:items-center">
                  <div>
                    <Pills />
                    <motion.h2 {...titleMotion(reduceMotion)} className="text-4xl font-black leading-[0.95] sm:text-6xl">
                      Ты умеешь. <br />Но пока это только <span className="text-fuchsia-300">слова</span>.
                    </motion.h2>
                    <motion.p {...fade(0.12, reduceMotion)} className="mt-4 max-w-xl text-base leading-relaxed text-white/72 sm:text-lg">
                      В SkillBarter навык проходит путь: урок, задача, правка наставника, кейс и Skill ID. Так появляется доверие, заказы и шанс на работу.
                    </motion.p>
                    <motion.div {...fade(0.2, reduceMotion)} className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                      <ChargeCore value={charge} onTap={tapCharge} />
                      <PrimaryButton disabled={charge < 100} onClick={() => setStep(1)}>
                        Старт
                      </PrimaryButton>
                    </motion.div>
                  </div>
                  <motion.div {...pop(0.1, reduceMotion)} className="space-y-3">
                    <MemePoster kind="boss" title="Без опыта не берем" caption="финальный босс студента" />
                    <ChatBubble who="Студент" text="А где взять опыт, если без опыта не берут?" />
                    <div className="grid grid-cols-2 gap-3">
                      <MemePoster kind="portfolio" title="Я умею" caption="рынок: ну допустим" compact />
                      <MemePoster kind="skill" title="Вот мой кейс" caption="рынок: о, интересно" compact />
                    </div>
                  </motion.div>
                </div>
              </Screen>
            )}

            {step === 1 && (
              <Screen key="goal">
                <Title eyebrow="Раунд 1" title="Выбери, ради чего играешь" text="Тапни цель. Она попадет в твой игровой инвентарь и сразу объяснит, зачем нужен кейс." />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {goals.map((item, index) => (
                    <GoalCard key={item.id} goal={item} active={goalId === item.id} delay={index * 0.04} onClick={() => chooseGoal(item)} reduceMotion={reduceMotion} />
                  ))}
                </div>
                <Inventory title="Инвентарь цели" value={goalId ? goal.title : "пусто"} />
                <Footer>
                  <PrimaryButton disabled={!goalId} onClick={() => setStep(2)}>
                    Выбрать профессию
                  </PrimaryButton>
                </Footer>
              </Screen>
            )}

            {step === 2 && (
              <Screen key="track">
                <Title eyebrow="Раунд 2" title="Выбери персонажа" text="Неважно, какая сфера. Важно, чтобы результат можно было показать." />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {tracks.map((item, index) => (
                    <TrackCard key={item.id} track={item} active={trackId === item.id} delay={index * 0.03} onClick={() => chooseTrack(item)} reduceMotion={reduceMotion} />
                  ))}
                </div>
                <Footer>
                  <PrimaryButton disabled={!trackId} onClick={() => setStep(3)}>
                    Собрать доказательство
                  </PrimaryButton>
                </Footer>
              </Screen>
            )}

            {step === 3 && (
              <Screen key="proof">
                <Title eyebrow="Раунд 3" title="Поймай формулу SkillBarter" text="Нужно собрать правильную цепочку: урок, задача, правка. Лишнее босс не принимает." />
                <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
                  <ProofBoard proof={proof} />
                  <div className="grid gap-3 sm:grid-cols-2">
                    {proofChips.map((chip, index) => (
                      <ChipButton key={chip.id} chip={chip} index={index} active={proof.includes(chip.id)} onClick={() => collectProof(chip)} reduceMotion={reduceMotion} />
                    ))}
                  </div>
                </div>
                <Footer>
                  <PrimaryButton disabled={proof.length < 3} onClick={() => setStep(4)}>
                    Открыть миссию
                  </PrimaryButton>
                </Footer>
              </Screen>
            )}

            {step === 4 && (
              <Screen key="lab">
                <Title eyebrow="Раунд 4" title="Собери кейс в лаборатории" text={track.mission} />
                <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                  <CaseBoard parts={caseParts} track={track} />
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      ...track.goodParts.map((title, index) => ({ id: `g-${index}`, title, good: true, note: "в кейс" })),
                      ...track.badParts.map((title, index) => ({ id: `b-${index}`, title, good: false, note: "мимо" })),
                    ].map((part, index) => (
                      <ChipButton key={part.id} chip={part} index={index} active={caseParts.some((item) => item.id === part.id)} disabled={caseParts.length >= 3} onClick={() => addPart(part)} reduceMotion={reduceMotion} />
                    ))}
                  </div>
                </div>
                <Footer>
                  <PrimaryButton disabled={caseParts.length < 3} onClick={() => setStep(5)}>
                    Отправить наставнику
                  </PrimaryButton>
                </Footer>
              </Screen>
            )}

            {step === 5 && (
              <Screen key="repair">
                <Title eyebrow="Раунд 5" title="Почини работу после правки" text="Наставник не ругает. Он показывает, как превратить попытку в кейс." />
                <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                  <div className="space-y-3">
                    <MemePoster kind="mentor" title="Наставник" caption="докрутим до кейса" />
                    <ChatBubble who="Правка" text={track.mentorAdvice} />
                    <div className="rounded-2xl border border-amber-300/25 bg-amber-400/10 p-4">
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-100">Слабое место</p>
                      <p className="mt-2 text-lg font-black">{track.weakSpot}</p>
                    </div>
                  </div>
                  <div className="grid gap-3">
                    {track.repairOptions.map((option, index) => {
                      const selected = repair === index;
                      const correct = index === track.repairAnswer;
                      return (
                        <motion.button
                          key={option}
                          type="button"
                          whileTap={{ scale: 0.96 }}
                          onClick={() => chooseRepair(index)}
                          className={cn(
                            "min-h-16 rounded-2xl border p-4 text-left text-base font-black transition active:bg-white/[0.1]",
                            selected && correct ? "border-emerald-300/70 bg-emerald-400/14" : selected && !correct ? "border-amber-300/70 bg-amber-400/14" : "border-white/12 bg-white/[0.06]",
                          )}
                        >
                          {option}
                        </motion.button>
                      );
                    })}
                    {repairDone && (
                      <div className="grid gap-3 sm:grid-cols-3">
                        {["Результат виден", "Ошибка исправлена", "Кейс усилен"].map((boost) => (
                          <motion.button
                            key={boost}
                            type="button"
                            whileTap={{ scale: 0.96 }}
                            onClick={() => toggleBoost(boost)}
                            className={cn("rounded-2xl border p-3 text-sm font-black", boosts.includes(boost) ? "border-emerald-300/60 bg-emerald-400/14" : "border-white/12 bg-white/[0.06]")}
                          >
                            {boosts.includes(boost) ? "✓ " : "+ "}
                            {boost}
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <Footer>
                  <PrimaryButton disabled={!repairDone || boosts.length < 3} onClick={() => setStep(6)}>
                    На битву с боссом
                  </PrimaryButton>
                </Footer>
              </Screen>
            )}

            {step === 6 && (
              <Screen key="boss">
                <Title eyebrow="Финал" title="Босс-файт: «Без опыта не берем»" text="Босс атакует сомнениями. Бей только доказательствами." />
                <div className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
                  <div className="space-y-3">
                    <MemePoster kind="boss" title={bossRound >= 3 ? "Босс сломан" : "Без опыта не берем"} caption={bossRound >= 3 ? "доказательство сильнее" : bossRounds[bossRound].ask} />
                    <BossHp hp={bossRound >= 3 ? 0 : clamp(100 - bossRound * 34)} />
                    <MemePoster kind="employer" title="Работодатель" caption={bossRound >= 3 ? "так, интересно" : "покажите кейс"} compact />
                  </div>
                  <div className="space-y-3">
                    <MemePoster kind="skill" title="Твой арсенал" caption={track.caseTitle} />
                    {bossRound < 3 ? (
                      <div className="grid gap-3">
                        {bossRounds.map((round, index) => (
                          <motion.button
                            key={round.attack}
                            type="button"
                            whileTap={{ scale: 0.96 }}
                            onClick={() => attackBoss(index)}
                            className={cn("min-h-14 rounded-2xl border p-4 text-left font-black transition active:bg-white/[0.1]", index === bossRound ? "border-fuchsia-300/60 bg-fuchsia-400/12" : "border-white/12 bg-white/[0.06]")}
                          >
                            {round.attack}
                          </motion.button>
                        ))}
                      </div>
                    ) : (
                      <motion.div {...pop(0, reduceMotion)} className="space-y-3">
                        <MemePoster kind="money" title="Кейс разблокирован" caption="теперь есть что показать" />
                        <PrimaryButton onClick={() => setStep(7)}>
                          Активировать Skill ID
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
                  <SkillIdCard goal={goal} track={track} scores={scores} />
                  <div className="space-y-3">
                    <Title eyebrow="Победа" title="Вот про что SkillBarter" text="Ты проходишь уроки, делаешь реальные задачи, получаешь правки наставника и собираешь Skill ID. Так навык превращается в доказательство, а доказательство - в доверие." />
                    <div className="grid gap-3 sm:grid-cols-3">
                      <MemePoster kind="money" title="Заказы" caption="можно показать клиенту" compact />
                      <MemePoster kind="employer" title="Работа" caption="есть что обсудить" compact />
                      <MemePoster kind="mentor" title="Рост" caption="правки усиливают" compact />
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

function ScorePanel({ scores, combo }: { scores: { trust: number; casePower: number; chance: number }; combo: number }) {
  return (
    <div className="relative z-10 grid gap-2 rounded-2xl border border-white/10 bg-white/[0.05] p-3 sm:grid-cols-[1fr_1fr_1fr_auto]">
      <Score label="Доверие" value={scores.trust} />
      <Score label="Сила кейса" value={scores.casePower} />
      <Score label="Шанс" value={scores.chance} />
      <div className="rounded-2xl border border-fuchsia-300/25 bg-fuchsia-400/10 px-3 py-2 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-fuchsia-100">combo</p>
        <p className="text-xl font-black">x{Math.max(1, combo)}</p>
      </div>
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
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/66 sm:text-base">{text}</p>
    </div>
  );
}

function Pills() {
  return (
    <div className="mb-5 flex flex-wrap gap-2">
      {["Урок", "Задача", "Правка", "Кейс", "Skill ID"].map((item, index) => (
        <motion.span key={item} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="rounded-full border border-fuchsia-300/25 bg-fuchsia-300/10 px-3 py-1 text-xs font-bold text-fuchsia-100">
          {item}
        </motion.span>
      ))}
    </div>
  );
}

function ChargeCore({ value, onTap }: { value: number; onTap: () => void }) {
  return (
    <motion.button type="button" whileTap={{ scale: 0.94 }} onClick={onTap} className="relative min-h-44 w-full overflow-hidden rounded-[2rem] border border-fuchsia-300/35 bg-fuchsia-400/12 p-5 text-left">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(217,70,239,0.35),transparent_35%)]" />
      <div className="relative flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-fuchsia-100">tap zone</p>
          <p className="mt-2 text-3xl font-black">{value >= 100 ? "Навык заряжен" : "Тапай по ядру"}</p>
          <p className="mt-2 text-sm text-white/62">без кейса это пока просто энергия</p>
        </div>
        <motion.div animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 0.9, repeat: Infinity }} className="flex h-24 w-24 items-center justify-center rounded-[2rem] border border-white/15 bg-black/25 text-3xl font-black">
          {value}%
        </motion.div>
      </div>
      <div className="relative mt-5 h-3 overflow-hidden rounded-full bg-white/10">
        <motion.div className="h-full rounded-full bg-gradient-to-r from-fuchsia-400 to-emerald-300" animate={{ width: `${value}%` }} />
      </div>
    </motion.button>
  );
}

function GoalCard({ goal, active, delay, onClick, reduceMotion }: { goal: Goal; active: boolean; delay: number; onClick: () => void; reduceMotion: boolean | null }) {
  const Icon = goal.icon;
  return (
    <motion.button type="button" initial={reduceMotion ? false : { opacity: 0, y: -22, rotate: delay * 20 - 3 }} animate={{ opacity: 1, y: 0, rotate: active ? 0 : delay * 20 - 3, scale: active ? 1.05 : 1 }} transition={{ delay, duration: 0.25 }} whileTap={{ scale: 0.94 }} onClick={onClick} className={cn("min-h-36 rounded-3xl border p-4 text-left transition active:bg-white/[0.1]", active ? "border-emerald-300/65 bg-emerald-400/12" : "border-white/12 bg-white/[0.06]")}>
      <Icon className="mb-4 h-7 w-7 text-fuchsia-100" />
      <h3 className="text-xl font-black">{goal.title}</h3>
      <p className="mt-2 text-sm text-white/62">{goal.text}</p>
    </motion.button>
  );
}

function TrackCard({ track, active, delay, onClick, reduceMotion }: { track: Track; active: boolean; delay: number; onClick: () => void; reduceMotion: boolean | null }) {
  const Icon = track.icon;
  return (
    <motion.button type="button" initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.96 }} animate={{ opacity: active ? 1 : 0.92, y: 0, scale: active ? 1.04 : 1 }} transition={{ delay, duration: 0.25 }} whileTap={{ scale: 0.94 }} onClick={onClick} className={cn("min-h-40 rounded-3xl border p-4 text-left transition active:bg-white/[0.1]", active ? "border-fuchsia-300/70 bg-fuchsia-400/12" : "border-white/12 bg-white/[0.06]")}>
      <Icon className="mb-4 h-7 w-7 text-fuchsia-100" />
      <h3 className="text-xl font-black">{track.title}</h3>
      <p className="mt-2 text-sm text-white/62">{track.text}</p>
      <p className="mt-3 rounded-2xl border border-white/10 bg-black/20 p-2 text-xs text-white/56">{track.meme}</p>
    </motion.button>
  );
}

function Inventory({ title, value }: { title: string; value: string }) {
  return (
    <motion.div layout className="mt-4 rounded-3xl border border-emerald-300/25 bg-emerald-400/10 p-4">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-100">{title}</p>
      <p className="mt-2 text-lg font-black">{value}</p>
    </motion.div>
  );
}

function ProofBoard({ proof }: { proof: string[] }) {
  const map: Record<string, string> = { lesson: "Урок", task: "Задача", mentor: "Правка" };
  return (
    <div className="rounded-3xl border border-fuchsia-300/25 bg-fuchsia-400/[0.08] p-4">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-fuchsia-100">Формула доказательства</p>
      <div className="mt-4 grid gap-3">
        {["lesson", "task", "mentor"].map((id, index) => (
          <motion.div key={id} layout className={cn("rounded-2xl border p-4", proof.includes(id) ? "border-emerald-300/55 bg-emerald-400/12" : "border-dashed border-white/15 bg-black/20")}>
            <p className="text-sm font-black">{index + 1}. {proof.includes(id) ? map[id] : "поймай правильный элемент"}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function CaseBoard({ parts, track }: { parts: Chip[]; track: Track }) {
  return (
    <div className="rounded-3xl border border-fuchsia-300/25 bg-fuchsia-400/[0.08] p-4">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-fuchsia-100">Кейс-лаборатория</p>
      <h3 className="mt-2 text-2xl font-black">{track.caseTitle}</h3>
      <div className="mt-4 grid gap-3">
        {[0, 1, 2].map((slot) => {
          const part = parts[slot];
          return (
            <motion.div key={slot} layout initial={part ? { opacity: 0, x: 22, scale: 0.92 } : false} animate={{ opacity: 1, x: 0, scale: 1 }} className={cn("min-h-20 rounded-2xl border p-3", part ? (part.good ? "border-emerald-300/45 bg-emerald-400/10" : "border-amber-300/45 bg-amber-400/10") : "border-dashed border-white/15 bg-black/18")}>
              <p className="text-sm font-bold">{part ? part.title : `[${slot + 1}] слот кейса`}</p>
              {!part && <p className="mt-1 text-xs text-white/42">добавь деталь</p>}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function ChipButton({ chip, index, active, disabled, onClick, reduceMotion }: { chip: Chip; index: number; active: boolean; disabled?: boolean; onClick: () => void; reduceMotion: boolean | null }) {
  return (
    <motion.button type="button" initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: active ? 0.58 : 1, y: 0, scale: active ? 0.95 : 1, x: active && !chip.good ? [0, -4, 4, -2, 0] : 0 }} transition={{ delay: index * 0.025 }} whileTap={{ scale: 0.96 }} onClick={onClick} disabled={active || disabled} className={cn("min-h-24 rounded-2xl border p-4 text-left transition active:bg-white/[0.1]", active && chip.good ? "border-emerald-300/70 bg-emerald-400/12" : active && !chip.good ? "border-amber-300/70 bg-amber-400/12" : "border-white/12 bg-white/[0.06]")}>
      <p className="text-sm font-black">{chip.title}</p>
      <p className="mt-2 text-xs text-white/52">{chip.note}</p>
    </motion.button>
  );
}

function SkillIdCard({ goal, track, scores }: { goal: Goal; track: Track; scores: { trust: number; casePower: number; chance: number } }) {
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
        Доказательство получено
      </div>
    </motion.div>
  );
}

function MemePoster({ kind, title, caption, compact }: { kind: MemeKind; title: string; caption: string; compact?: boolean }) {
  const faces: Record<MemeKind, string> = {
    boss: "ಠ_ಠ",
    market: "👀",
    employer: "o_O",
    mentor: ":D",
    portfolio: "T_T",
    skill: "★_★",
    money: "$_$",
  };
  const palettes: Record<MemeKind, string> = {
    boss: "border-red-300/35 bg-red-500/10",
    market: "border-fuchsia-300/35 bg-fuchsia-400/10",
    employer: "border-violet-300/35 bg-violet-400/10",
    mentor: "border-sky-300/35 bg-sky-400/10",
    portfolio: "border-amber-300/35 bg-amber-400/10",
    skill: "border-emerald-300/35 bg-emerald-400/10",
    money: "border-lime-300/35 bg-lime-400/10",
  };
  return (
    <motion.div initial={{ opacity: 0, y: 12, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} className={cn("relative overflow-hidden rounded-[2rem] border p-4 text-center", palettes[kind], compact ? "min-h-40" : "min-h-64")}>
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />
      <div className={cn("mx-auto mb-3 flex items-center justify-center rounded-[2rem] border border-white/15 bg-black/25 font-black", compact ? "h-20 w-20 text-2xl" : "h-28 w-28 text-4xl")}>{faces[kind]}</div>
      <h3 className={cn("font-black", compact ? "text-lg" : "text-2xl")}>{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-white/62">{caption}</p>
    </motion.div>
  );
}

function ChatBubble({ who, text }: { who: string; text: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-4">
      <p className="text-sm text-white/55">{who}</p>
      <p className="mt-1 text-xl font-black">{text}</p>
    </div>
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

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/18 p-3">
      <span className="text-sm text-white/55">{label}</span>
      <span className="text-right text-sm font-black">{value}</span>
    </div>
  );
}

function Progress({ value }: { value: number }) {
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
