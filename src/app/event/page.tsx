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
  RefreshCcw,
  Scale,
  ShieldCheck,
  Trophy,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type GoalId = "orders" | "job" | "portfolio" | "levelup";
type TrackId = "programming" | "design" | "cooking" | "teaching" | "psychology" | "law";

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

type Repair = {
  scene: string[];
  weakSpot: string;
  options: string[];
  correctIndex: number;
  improvement: string;
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
  mentorFix: string;
  repair: Repair;
};

const pathItems = ["Навык", "Кейс", "Правка", "Skill ID", "Деньги/Работа"];

const goals: Goal[] = [
  {
    id: "orders",
    title: "Хочу зарабатывать",
    short: "Клиент платит за результат, а не за фразу",
    reaction: "Клиент не платит за «я вроде умею». Клиент платит за результат.",
    opportunity: "заказы",
    icon: Coins,
  },
  {
    id: "job",
    title: "Хочу работу",
    short: "Работодателю нужен кейс, а не телепатия",
    reaction: "Работодатель не телепат. Ему нужен кейс.",
    opportunity: "работа",
    icon: BriefcaseBusiness,
  },
  {
    id: "portfolio",
    title: "Хочу портфолио",
    short: "Пустое портфолио грустит",
    reaction: "Пустое портфолио грустит. Пора кормить его кейсами.",
    opportunity: "портфолио",
    icon: Trophy,
  },
  {
    id: "levelup",
    title: "Хочу прокачаться",
    short: "Практика превращает знания в уверенность",
    reaction: "Теория без практики - это как купить абонемент и не ходить в зал.",
    opportunity: "рост",
    icon: Zap,
  },
];

const tracks: Track[] = [
  {
    id: "programming",
    title: "Программист",
    short: "Сайты, формы, боты, автоматизация",
    icon: Code2,
    meme: "Если работает с первого раза - подозрительно.",
    caseName: "Страница заявки для бизнеса",
    situation: "Бизнесу нужна страница заявки.",
    mentorFix: "Покажи, что форма реально работает, а не просто красиво стоит на странице.",
    repair: {
      scene: ["Макет страницы", "Форма есть", "Но кнопка не отправляет заявку"],
      weakSpot: "кнопка/отправка формы",
      options: ["Перекрасить фон", "Проверить отправку формы", "Добавить еще один заголовок"],
      correctIndex: 1,
      improvement: "Работа улучшена: форма отправляет заявку, кейс стал проверяемым.",
    },
    cards: [
      { id: "p1", title: "Форма заявки работает", good: true, meme: "Пользователь оставил заявку. Жизнь налаживается." },
      { id: "p2", title: "Кнопка отправляет данные", good: true, meme: "Кнопка нажалась. Уже успех." },
      { id: "p3", title: "На телефоне все нормально", good: true, meme: "Адаптив спас проект." },
      { id: "p4", title: "Красивый фон, но кнопка мертвая", good: false, meme: "Кнопка умерла. Пользователь почти тоже." },
      { id: "p5", title: "Ошибка в консоли, но мы ее не видели", good: false, meme: "Консоль все видела." },
      { id: "p6", title: "Мобилка уехала в отпуск", good: false, meme: "Мобильная версия просит помощи." },
    ],
  },
  {
    id: "design",
    title: "Дизайнер",
    short: "Интерфейсы, визуал, презентации",
    icon: Palette,
    meme: "17 шрифтов - это не стиль, это преступление.",
    caseName: "Первый экран сайта",
    situation: "Клиенту нужен первый экран сайта.",
    mentorFix: "Убери лишний шум. Заголовок, польза и кнопка должны быть главным фокусом.",
    repair: {
      scene: ["Первый экран", "Огромный декор", "Маленький заголовок и незаметная кнопка"],
      weakSpot: "заголовок/кнопка",
      options: ["Добавить еще эффектов", "Сделать пользу и кнопку заметными", "Уменьшить весь текст"],
      correctIndex: 1,
      improvement: "Работа улучшена: человек сразу видит пользу и главное действие.",
    },
    cards: [
      { id: "d1", title: "Понятный заголовок", good: true, meme: "Польза видна за 5 секунд." },
      { id: "d2", title: "Видимая кнопка", good: true, meme: "Теперь понятно, куда нажимать." },
      { id: "d3", title: "Польза за 5 секунд", good: true, meme: "Красиво и понятно - уже кейс." },
      { id: "d4", title: "18 эффектов, все мигает", good: false, meme: "18 эффектов покинули чат." },
      { id: "d5", title: "Мелкий текст как договор банка", good: false, meme: "Прочитать смог только юрист." },
      { id: "d6", title: "Градиент ради градиента", good: false, meme: "Градиент красивый. Польза потерялась." },
    ],
  },
  {
    id: "cooking",
    title: "Повар",
    short: "Блюда, подача, технология, меню",
    icon: ChefHat,
    meme: "«Вкусно» на словах не считается.",
    caseName: "Блюдо для меню кафе",
    situation: "Кафе просит блюдо для меню.",
    mentorFix: "Добавь технологию, время и подачу - тогда блюдо можно оценить как работу.",
    repair: {
      scene: ["Фото блюда есть", "Состава нет", "Технологии и времени нет"],
      weakSpot: "технология/состав",
      options: ["Написать «очень вкусно»", "Добавить состав, технологию и время", "Оставить только фото"],
      correctIndex: 1,
      improvement: "Работа улучшена: блюдо можно повторить, оценить и показать.",
    },
    cards: [
      { id: "c1", title: "Состав блюда", good: true, meme: "Теперь понятно, что внутри." },
      { id: "c2", title: "Технология приготовления", good: true, meme: "Это можно повторить и оценить." },
      { id: "c3", title: "Подача и фото результата", good: true, meme: "Блюдо стало кейсом, а не легендой." },
      { id: "c4", title: "Просто написать «вкусно»", good: false, meme: "«Вкусно» - эмоция. Кейс - доказательство." },
      { id: "c5", title: "Готовить на глаз и надеяться", good: false, meme: "Надежда - не технология." },
      { id: "c6", title: "Время приготовления? Не слышали", good: false, meme: "Кафе слышало. И ждет." },
    ],
  },
  {
    id: "teaching",
    title: "Педагог",
    short: "Объяснение, мини-уроки, ученики",
    icon: GraduationCap,
    meme: "Ученик кивнул. Но понял ли он?",
    caseName: "Мини-урок для новичка",
    situation: "Нужно объяснить сложную тему новичку.",
    mentorFix: "Добавь пример и мини-вопрос. Так видно, что ученик понял.",
    repair: {
      scene: ["Тема есть", "Объяснение есть", "Нет примера и проверки понимания"],
      weakSpot: "проверка понимания",
      options: ["Добавить пример и вопрос", "Завалить терминами", "Сказать «ну это очевидно»"],
      correctIndex: 0,
      improvement: "Работа улучшена: ученик не просто кивнул, а проверил понимание.",
    },
    cards: [
      { id: "t1", title: "Объяснить простыми словами", good: true, meme: "Сложное стало человеческим." },
      { id: "t2", title: "Дать пример из жизни", good: true, meme: "Пример включил мозг." },
      { id: "t3", title: "Проверить понимание", good: true, meme: "Кивок прошел проверку." },
      { id: "t4", title: "Завалить терминами", good: false, meme: "Новичок потерялся на втором слове." },
      { id: "t5", title: "Сказать «ну это очевидно»", good: false, meme: "Очевидно только тому, кто уже знает." },
      { id: "t6", title: "Ученик кивнул - значит понял", good: false, meme: "Опасная педагогическая магия." },
    ],
  },
  {
    id: "psychology",
    title: "Психолог",
    short: "Коммуникация, этика, поддержка",
    icon: HeartHandshake,
    meme: "Диагноз за 5 секунд - сразу бан.",
    caseName: "Этичный разбор запроса",
    situation: "Человек описал трудную ситуацию.",
    mentorFix: "Сначала запрос и границы. Не надо играть в «я все понял за 5 секунд».",
    repair: {
      scene: ["Человек: мне сложно", "Плохой ответ: да все нормально", "Запрос не уточнен"],
      weakSpot: "обесценивание/нет уточнения",
      options: ["Уточнить запрос и границы", "Сразу поставить диагноз", "Давить своим мнением"],
      correctIndex: 0,
      improvement: "Работа улучшена: диалог стал этичным и безопасным.",
    },
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
    short: "Факты, документы, позиция",
    icon: Scale,
    meme: "Громкий голос - не доказательство.",
    caseName: "Правовая позиция по ситуации",
    situation: "Человеку нужно понять, как защитить позицию.",
    mentorFix: "Факты, документы, основание. Без обещаний победы.",
    repair: {
      scene: ["Ситуация: мне должны деньги", "Плохой ответ: точно выиграем", "Фактов и основания нет"],
      weakSpot: "обещание результата без фактов",
      options: ["Обещать победу", "Сначала факты, документы и основание", "Говорить громче"],
      correctIndex: 1,
      improvement: "Работа улучшена: появилась позиция, основанная на фактах.",
    },
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

const bossRounds = [
  { line: "А опыт есть?", attack: "Показать кейс", result: "Минус аргумент босса." },
  { line: "А кто это проверил?", attack: "Показать правку наставника", result: "Наставник вошел в чат." },
  { line: "А где это посмотреть?", attack: "Открыть Skill ID", result: "Skill ID добил босса." },
];

const clamp = (value: number) => Math.max(0, Math.min(100, value));

export default function EventPage() {
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState<Step>(0);
  const [goalId, setGoalId] = useState<GoalId | null>(null);
  const [trackId, setTrackId] = useState<TrackId | null>(null);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [meme, setMeme] = useState<string | null>(null);
  const [repairChoice, setRepairChoice] = useState<number | null>(null);
  const [repairFixed, setRepairFixed] = useState(false);
  const [typed, setTyped] = useState(false);
  const [attackIndex, setAttackIndex] = useState(0);
  const [attackMeme, setAttackMeme] = useState<string | null>(null);
  const [activeOpportunity, setActiveOpportunity] = useState<string | null>(null);
  const [shared, setShared] = useState(false);

  const goal = goals.find((item) => item.id === goalId) ?? goals[0];
  const track = tracks.find((item) => item.id === trackId) ?? tracks[0];
  const chosenCards = track.cards.filter((card) => selectedCards.includes(card.id));
  const goodCount = chosenCards.filter((card) => card.good).length;
  const marketLevel = goodCount >= 3 ? "strong" : goodCount >= 2 ? "medium" : "weak";

  const scores = useMemo(() => {
    return {
      trust: clamp((goalId ? 10 : 0) + (trackId ? 10 : 0) + goodCount * 15 + (repairFixed ? 30 : 0)),
      quality: clamp(goodCount * 15 + (repairFixed ? 45 : 0)),
      chance: clamp((goalId ? 10 : 0) + goodCount * 10 + (repairFixed ? 35 : 0)),
    };
  }, [goalId, trackId, goodCount, repairFixed]);

  const bossHp = clamp(100 - attackIndex * 35);

  useEffect(() => {
    if (step !== 5) return;
    setTyped(false);
    const timer = window.setTimeout(() => setTyped(true), 720);
    return () => window.clearTimeout(timer);
  }, [step, trackId]);

  const next = (target: Step) => setStep(target);

  const restart = () => {
    setStep(0);
    setGoalId(null);
    setTrackId(null);
    setSelectedCards([]);
    setMeme(null);
    setRepairChoice(null);
    setRepairFixed(false);
    setAttackIndex(0);
    setAttackMeme(null);
    setActiveOpportunity(null);
    setShared(false);
  };

  const chooseGoal = (goalItem: Goal) => {
    setGoalId(goalItem.id);
    setMeme(goalItem.reaction);
    setActiveOpportunity(goalItem.title);
    navigator.vibrate?.(20);
  };

  const chooseTrack = (trackItem: Track) => {
    setTrackId(trackItem.id);
    setMeme("Персонаж выбран. Теперь нужна не фраза, а доказательство.");
    navigator.vibrate?.(20);
  };

  const chooseCaseCard = (card: CaseCard) => {
    if (selectedCards.includes(card.id) || selectedCards.length >= 3) return;
    setSelectedCards((items) => [...items, card.id]);
    setMeme(card.meme);
    navigator.vibrate?.(card.good ? 25 : [20, 30, 20]);
  };

  const chooseRepair = (index: number) => {
    setRepairChoice(index);
    if (index === track.repair.correctIndex) {
      setRepairFixed(true);
      setMeme("Правка принята. Кейс эволюционировал.");
      navigator.vibrate?.(35);
    } else {
      setRepairFixed(false);
      setMeme("Почти, но наставник подсветил проблему. Попробуй точнее.");
      navigator.vibrate?.([20, 40, 20]);
    }
  };

  const hitBoss = (index: number) => {
    if (index !== attackIndex) {
      setAttackMeme("Босс не понял. Попробуй другой аргумент.");
      navigator.vibrate?.([20, 35, 20]);
      return;
    }
    setAttackIndex((value) => value + 1);
    setAttackMeme(bossRounds[index].result);
    navigator.vibrate?.(35);
  };

  const shareQuest = async () => {
    const text = "Я прошел SkillBarter Quest: навык -> кейс -> правка -> Skill ID.";
    if (navigator.share) {
      await navigator.share({ title: "SkillBarter Quest", text, url: window.location.href }).catch(() => undefined);
    } else {
      await navigator.clipboard?.writeText(window.location.href).catch(() => undefined);
    }
    setShared(true);
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#07040f] text-white">
      <div className="pointer-events-none fixed inset-0">
        <motion.div
          className="absolute -left-24 top-8 h-72 w-72 rounded-full bg-fuchsia-600/25 blur-3xl"
          animate={reduceMotion ? undefined : { x: [0, 22, 0], y: [0, 18, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-28 top-72 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl"
          animate={reduceMotion ? undefined : { x: [0, -22, 0], y: [0, -16, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:26px_26px] [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]" />
      </div>

      <section className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-8 pt-4 sm:px-6">
        <header className="sticky top-0 z-20 -mx-4 mb-4 border-b border-white/10 bg-[#07040f]/84 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-fuchsia-200">SkillBarter event</p>
              <h1 className="truncate text-lg font-black sm:text-2xl">Прокачай навык до денег и работы</h1>
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
                      Мини-игра на 60-90 секунд
                    </motion.p>
                    <motion.h2 {...titleMotion(0.05)} className="text-4xl font-black leading-[0.96] sm:text-6xl">
                      Ты умеешь. <br />Но тебе говорят: <span className="text-fuchsia-300">«А кейсы есть?»</span>
                    </motion.h2>
                    <motion.p {...fade(0.16)} className="mt-5 max-w-xl text-base leading-relaxed text-white/74 sm:text-lg">
                      Пройди мини-игру SkillBarter и собери первый кейс, который можно показать заказчику или работодателю.
                    </motion.p>
                    <motion.div {...fade(0.24)} className="mt-6">
                      <PrimaryButton onClick={() => next(1)}>Начать игру</PrimaryButton>
                    </motion.div>
                  </div>
                  <motion.div {...pop(0.12)} className="space-y-4">
                    <BossSticker big />
                    <Speech title="Студент" text="А где взять опыт, если без опыта не берут?" />
                    <div className="grid grid-cols-2 gap-3">
                      <Sticker title="Я умею" text="рынок: ну допустим" face=":|" />
                      <Sticker title="Вот мой кейс" text="это уже можно оценить" face=":)" glow />
                    </div>
                  </motion.div>
                </div>
              </Screen>
            )}

            {step === 1 && (
              <Screen key="goal">
                <SectionTitle eyebrow="Уровень 1" title="Поймай свою возможность" text="Тапни карточку цели. Она улетит в инвентарь и даст первый бонус." />
                <motion.div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {goals.map((item, index) => (
                    <OpportunityCard key={item.id} item={item} active={goalId === item.id} delay={index * 0.04} onClick={() => chooseGoal(item)} />
                  ))}
                </motion.div>
                <Inventory title="Инвентарь цели" value={activeOpportunity ?? "пока пусто"} />
                {meme && <MemeBubble text={meme} />}
                <FooterAction>
                  <PrimaryButton disabled={!goalId} onClick={() => next(2)}>Дальше</PrimaryButton>
                </FooterAction>
              </Screen>
            )}

            {step === 2 && (
              <Screen key="class">
                <SectionTitle eyebrow="Уровень 2" title="Выбери своего персонажа" text="Это игровые классы. Выбери сферу, где хочешь доказать навык делом." />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {tracks.map((item, index) => (
                    <ClassCard key={item.id} item={item} active={trackId === item.id} delay={index * 0.035} onClick={() => chooseTrack(item)} />
                  ))}
                </div>
                {trackId && <MemeBubble text={meme ?? track.meme} />}
                <FooterAction>
                  <PrimaryButton disabled={!trackId} onClick={() => next(3)}>Получить первую миссию</PrimaryButton>
                </FooterAction>
              </Screen>
            )}

            {step === 3 && (
              <Screen key="collect">
                <SectionTitle eyebrow="Уровень 3" title="Собери кейс, который не стыдно показать" text={track.situation} />
                <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                  <CaseSlots cards={chosenCards} />
                  <div className="grid gap-3 sm:grid-cols-2">
                    {track.cards.map((card, index) => (
                      <CaseButton
                        key={card.id}
                        card={card}
                        index={index}
                        selected={selectedCards.includes(card.id)}
                        locked={selectedCards.length >= 3}
                        onClick={() => chooseCaseCard(card)}
                      />
                    ))}
                  </div>
                </div>
                {meme && <MemeBubble text={meme} />}
                <FooterAction>
                  <PrimaryButton disabled={selectedCards.length < 3} onClick={() => next(4)}>Показать рынку</PrimaryButton>
                </FooterAction>
              </Screen>
            )}

            {step === 4 && (
              <Screen key="market">
                <SectionTitle eyebrow="Уровень 4" title="Суд рынка" text="Заказчик, работодатель и наставник смотрят на твой кейс. Слова уже не спасают - работает результат." />
                <div className="grid gap-3 sm:grid-cols-3">
                  {marketReactions(marketLevel).map((item, index) => (
                    <Sticker key={item.title} title={item.title} text={item.text} face={item.face} glow={index === 1} />
                  ))}
                </div>
                <MemeBubble text={marketLevel === "strong" ? "Рынок: тут уже есть за что зацепиться." : marketLevel === "medium" ? "Материал есть, но надо докрутить." : "Пока сыровато. Для этого и есть правка."} />
                <FooterAction>
                  <PrimaryButton onClick={() => next(5)}>Починить ошибку</PrimaryButton>
                </FooterAction>
              </Screen>
            )}

            {step === 5 && (
              <Screen key="repair">
                <SectionTitle eyebrow="Уровень 5" title="Почини ошибку" text="Наставник подсветил слабое место. Тапни, что нужно исправить, чтобы кейс стал сильнее." />
                <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                  <div className="rounded-3xl border border-white/12 bg-white/[0.06] p-4">
                    <div className="mb-4 flex items-start gap-3">
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
                    <div className="grid gap-2">
                      {track.repair.scene.map((item) => (
                        <div key={item} className="rounded-2xl border border-white/10 bg-black/20 p-3 text-sm font-bold text-white/75">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-3">
                    {track.repair.options.map((option, index) => {
                      const chosen = repairChoice === index;
                      const correct = index === track.repair.correctIndex;
                      return (
                        <motion.button
                          key={option}
                          type="button"
                          whileTap={{ scale: 0.96 }}
                          onClick={() => chooseRepair(index)}
                          className={cn(
                            "min-h-16 rounded-2xl border p-4 text-left text-base font-black transition",
                            "border-white/12 bg-white/[0.06] hover:bg-white/[0.1]",
                            chosen && correct && "border-emerald-300/70 bg-emerald-400/14 shadow-lg shadow-emerald-500/15",
                            chosen && !correct && "border-amber-300/70 bg-amber-400/14 shadow-lg shadow-amber-500/15",
                          )}
                        >
                          {option}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
                {meme && <MemeBubble text={repairFixed ? track.repair.improvement : meme} />}
                <FooterAction>
                  <PrimaryButton disabled={!repairFixed} onClick={() => next(6)}>Идем к боссу</PrimaryButton>
                </FooterAction>
              </Screen>
            )}

            {step === 6 && (
              <Screen key="boss">
                <SectionTitle eyebrow="Уровень 6" title="Финальная битва" text="Выбирай правильный аргумент под фразу босса. Не тот аргумент - босс не понимает." />
                <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                  <div className="space-y-3">
                    <Sticker title="Студент с кейсом" text={track.caseName} face=":)" glow />
                    <Speech title="Босс спрашивает" text={attackIndex >= 3 ? "..." : bossRounds[attackIndex].line} />
                    {attackMeme && <MemeBubble compact text={attackMeme} />}
                  </div>
                  <div className="space-y-4">
                    <BossSticker defeated={attackIndex >= 3} />
                    <BossHp hp={attackIndex >= 3 ? 0 : bossHp} />
                    {attackIndex < 3 ? (
                      <div className="grid gap-3">
                        {bossRounds.map((round, index) => (
                          <motion.button
                            key={round.attack}
                            type="button"
                            whileTap={{ scale: 0.96 }}
                            onClick={() => hitBoss(index)}
                            className={cn(
                              "min-h-14 rounded-2xl border p-4 text-left font-black transition",
                              "border-white/12 bg-white/[0.06] hover:bg-white/[0.1]",
                              index === attackIndex && "border-fuchsia-300/50 shadow-lg shadow-fuchsia-500/15",
                            )}
                          >
                            {round.attack}
                          </motion.button>
                        ))}
                      </div>
                    ) : (
                      <motion.div initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="space-y-3">
                        <MemeBubble text="Босс побежден. Теперь у тебя есть не слова, а доказательство." />
                        <PrimaryButton onClick={() => next(7)}>Разблокировать Skill ID</PrimaryButton>
                      </motion.div>
                    )}
                  </div>
                </div>
              </Screen>
            )}

            {step === 7 && (
              <Screen key="skillid">
                <Confetti />
                <SectionTitle eyebrow="Награда" title="SKILL ID ACTIVATED" text="Кейс, правка и результат собираются в цифровое доказательство навыка." />
                <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr] lg:items-start">
                  <SkillIdCard goal={goal} track={track} scores={scores} />
                  <OpportunityTabs />
                </div>
                <MemeBubble text={finalMeme(scores)} />
                <FooterAction>
                  <PrimaryButton onClick={() => next(8)}>Показать итог</PrimaryButton>
                </FooterAction>
              </Screen>
            )}

            {step === 8 && (
              <Screen key="final">
                <div className="mx-auto max-w-3xl text-center">
                  <motion.div {...pop(0)} className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-[2rem] border border-fuchsia-300/40 bg-fuchsia-400/15 text-5xl shadow-2xl shadow-fuchsia-500/20">
                    <ShieldCheck className="h-11 w-11 text-fuchsia-100" />
                  </motion.div>
                  <motion.h2 {...titleMotion(0.05)} className="text-4xl font-black leading-tight sm:text-6xl">
                    Вот зачем нужен SkillBarter
                  </motion.h2>
                  <motion.p {...fade(0.16)} className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/72 sm:text-lg">
                    Наш проект помогает показывать навыки не словами, а реальными кейсами. Ты проходишь уроки, выполняешь задачи, получаешь правки наставников и собираешь Skill ID.
                  </motion.p>
                  <motion.div {...pop(0.24)} className="mt-6 rounded-3xl border border-emerald-300/25 bg-emerald-400/10 p-5 text-2xl font-black text-emerald-100">
                    Не просто «я умею». А «вот что я сделал».
                  </motion.div>
                  <motion.div {...fade(0.32)} className="mt-6 grid gap-3 sm:grid-cols-3">
                    <LinkButton href="/access">Открыть SkillBarter</LinkButton>
                    <SecondaryButton onClick={restart}>
                      <RefreshCcw className="h-4 w-4" />
                      Пройти еще раз
                    </SecondaryButton>
                    <SecondaryButton onClick={shareQuest}>{shared ? "Ссылка готова" : "Показать другу"}</SecondaryButton>
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
    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-fuchsia-400 via-violet-300 to-emerald-300"
        animate={{ width: `${((step + 1) / 9) * 100}%` }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      />
    </div>
  );
}

function ScoreBars({ scores }: { scores: { trust: number; quality: number; chance: number } }) {
  return (
    <div className="relative z-10 grid gap-2 rounded-2xl border border-white/10 bg-white/[0.045] p-3 sm:grid-cols-3">
      <Score label="Доверие" value={scores.trust} />
      <Score label="Сила кейса" value={scores.quality} />
      <Score label="Шанс на деньги/работу" value={scores.chance} />
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

function OpportunityCard({ item, active, delay, onClick }: { item: Goal; active: boolean; delay: number; onClick: () => void }) {
  const Icon = item.icon;
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: -24, rotate: delay * 40 - 4 }}
      animate={{ opacity: 1, y: 0, rotate: active ? 0 : delay * 35 - 3, scale: active ? 1.06 : 1 }}
      transition={{ delay, duration: 0.32 }}
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      className={cn(
        "min-h-40 rounded-3xl border p-4 text-left transition",
        "bg-white/[0.055] hover:-translate-y-1 hover:bg-white/[0.085]",
        active ? "border-emerald-300/70 shadow-2xl shadow-emerald-500/20" : "border-white/12",
      )}
    >
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-fuchsia-300/25 bg-fuchsia-300/10 text-fuchsia-100">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-lg font-black">{item.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-white/62">{item.short}</p>
    </motion.button>
  );
}

function ClassCard({ item, active, delay, onClick }: { item: Track; active: boolean; delay: number; onClick: () => void }) {
  const Icon = item.icon;
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 18, scale: 0.96 }}
      animate={{ opacity: active ? 1 : 0.92, y: 0, scale: active ? 1.04 : 1 }}
      transition={{ delay, duration: 0.28 }}
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      className={cn(
        "min-h-44 rounded-3xl border p-4 text-left transition",
        "bg-white/[0.055] hover:bg-white/[0.085]",
        active ? "border-fuchsia-300/70 shadow-2xl shadow-fuchsia-500/20" : "border-white/12",
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-fuchsia-300/25 bg-fuchsia-300/10 text-fuchsia-100">
          <Icon className="h-6 w-6" />
        </div>
        <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1 text-xs font-bold text-white/50">class</span>
      </div>
      <h3 className="text-xl font-black">{item.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-white/62">{item.short}</p>
      <p className="mt-3 rounded-2xl border border-white/10 bg-black/20 p-2 text-xs text-white/56">{item.meme}</p>
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

function CaseSlots({ cards }: { cards: CaseCard[] }) {
  return (
    <motion.div layout className="rounded-3xl border border-fuchsia-300/25 bg-fuchsia-400/[0.07] p-4 shadow-2xl shadow-fuchsia-950/30">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-fuchsia-100">Твой кейс</p>
        <p className="text-xs text-white/55">{cards.length}/3</p>
      </div>
      <div className="mt-4 grid gap-3">
        {[0, 1, 2].map((slot) => {
          const card = cards[slot];
          return (
            <motion.div
              key={slot}
              layout
              initial={card ? { opacity: 0, x: 24, scale: 0.92 } : false}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              className={cn(
                "min-h-20 rounded-2xl border p-3",
                card ? (card.good ? "border-emerald-300/45 bg-emerald-400/10" : "border-amber-300/45 bg-amber-400/10") : "border-dashed border-white/15 bg-black/18",
              )}
            >
              <p className="text-sm font-bold">{card ? card.title : `[${slot + 1}] слот кейса`}</p>
              {!card && <p className="mt-1 text-xs text-white/42">тапни карточку справа</p>}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function CaseButton({ card, index, selected, locked, onClick }: { card: CaseCard; index: number; selected: boolean; locked: boolean; onClick: () => void }) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{
        opacity: selected ? 0.55 : 1,
        y: 0,
        scale: selected ? 0.94 : 1,
        x: selected && !card.good ? [0, -5, 5, -3, 0] : 0,
      }}
      transition={{ delay: index * 0.035 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      disabled={selected || locked}
      className={cn(
        "min-h-24 rounded-2xl border p-4 text-left transition",
        "bg-white/[0.055] hover:bg-white/[0.085]",
        selected && card.good && "border-emerald-300/70 bg-emerald-400/12 shadow-lg shadow-emerald-500/15",
        selected && !card.good && "border-amber-300/70 bg-amber-400/12 shadow-lg shadow-amber-500/15",
        !selected && "border-white/12",
      )}
    >
      <p className="text-sm font-black text-white">{card.title}</p>
      <p className="mt-2 text-xs text-white/52">{card.good ? "усиливает кейс" : "риск для кейса"}</p>
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
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/14 bg-white/[0.06] px-5 py-3 text-base font-black text-white transition hover:bg-white/[0.1]"
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

function Speech({ title, text }: { title: string; text: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-white/10 bg-white/[0.06] p-4 shadow-2xl shadow-fuchsia-950/30">
      <p className="text-sm text-white/55">{title}</p>
      <p className="mt-1 text-xl font-black">{text}</p>
    </motion.div>
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
      <p className="mt-2 text-sm text-white/55">{defeated ? "обезврежен кейсом" : "атакует фразой: а кейсы есть?"}</p>
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

function TypingDot({ delay = 0 }: { delay?: number }) {
  return (
    <motion.span
      className="h-2 w-2 rounded-full bg-fuchsia-200"
      animate={{ opacity: [0.35, 1, 0.35], y: [0, -3, 0] }}
      transition={{ duration: 0.8, repeat: Infinity, delay }}
    />
  );
}

function OpportunityTabs() {
  const [active, setActive] = useState("orders");
  const items = [
    { id: "orders", title: "Заказы", text: "Кейс помогает заказчику понять, за что он платит." },
    { id: "job", title: "Работа", text: "Работодатель видит не обещания, а подтвержденный результат." },
    { id: "growth", title: "Рост", text: "Наставник помогает довести работу до уровня, который можно показать." },
  ];
  return (
    <div className="grid gap-3">
      <p className="text-lg font-black">Что теперь открывается?</p>
      {items.map((item) => (
        <motion.button
          key={item.id}
          type="button"
          whileTap={{ scale: 0.96 }}
          onClick={() => setActive(item.id)}
          className={cn("rounded-3xl border p-4 text-left", active === item.id ? "border-emerald-300/45 bg-emerald-400/12" : "border-white/12 bg-white/[0.06]")}
        >
          <h3 className="font-black">{item.title}</h3>
          {active === item.id && <p className="mt-2 text-sm text-white/66">{item.text}</p>}
        </motion.button>
      ))}
    </div>
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
        <InfoRow label="Сила кейса" value={`${scores.quality}%`} />
        <InfoRow label="Шанс" value={`${scores.chance}%`} />
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
      { title: "Работодатель", text: "Потенциал вижу. Нужна правка.", face: "o_o" },
      { title: "Наставник", text: "Сейчас сделаем сильнее.", face: ":D" },
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
  if (total >= 85) return "Работодатель проснулся: «Так, это уже интересно»";
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
