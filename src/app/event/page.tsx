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

type Phase = 0 | 1 | 2 | 3 | 4 | 5 | 6;
type GoalId = "money" | "job" | "portfolio" | "growth";
type SkillId = "code" | "design" | "cook" | "teach" | "psy" | "law";
type StickerKind = "boss" | "market" | "mentor" | "employer" | "skill" | "portfolio";

type Skill = {
  id: SkillId;
  title: string;
  text: string;
  icon: LucideIcon;
  meme: string;
  layers: string[];
  traps: string[];
  funnyWin: string;
  funnyFail: string;
  workTitle: string;
  weakSpot: string;
  weakLabel: string;
  fix: string;
  hotspot: { x: string; y: string; w: string; h: string };
};

const goals: Array<{ id: GoalId; title: string; text: string; result: string }> = [
  { id: "money", title: "Зарабатывать", text: "получать первые заказы", result: "заказ" },
  { id: "job", title: "Попасть на работу", text: "показать работодателю результат", result: "работа" },
  { id: "portfolio", title: "Собрать портфолио", text: "заменить пустую страницу кейсами", result: "портфолио" },
  { id: "growth", title: "Прокачаться", text: "учиться через реальные задачи", result: "рост" },
];

const skills: Skill[] = [
  {
    id: "code",
    title: "Программирование",
    text: "сайты, формы, боты, автоматизация",
    icon: Code2,
    meme: "Код есть. Теперь докажи, что он реально работает.",
    layers: ["Навык: форма заявки", "Задача: страница для клиента", "Правка: проверить отправку", "Skill ID: рабочий кейс"],
    traps: ["Красивый фон без формы", "Мёртвая кнопка", "Ошибка в консоли"],
    funnyWin: "Форма отправилась. Малый бизнес выдохнул. Консоль молчит, и это красиво.",
    funnyFail: "Красивая кнопка без действия — это лифт, который открывается в стену.",
    workTitle: "Страница заявки для малого бизнеса",
    weakSpot: "Форма выглядит красиво, но заявка не отправляется.",
    weakLabel: "кнопка молчит",
    fix: "Добавить проверку формы и показать, что пользователь реально может оставить заявку.",
    hotspot: { x: "55%", y: "58%", w: "32%", h: "18%" },
  },
  {
    id: "design",
    title: "Дизайн",
    text: "интерфейсы, визуал, карточки, презентации",
    icon: Palette,
    meme: "Красиво — хорошо. Понятно и полезно — уже кейс.",
    layers: ["Навык: визуальная иерархия", "Задача: первый экран сайта", "Правка: усилить CTA", "Skill ID: понятный экран"],
    traps: ["17 шрифтов", "Мелкий текст", "Эффекты ради эффектов"],
    funnyWin: "Пользователь понял, куда нажать. Где-то один UX-дизайнер тихо улыбнулся.",
    funnyFail: "17 шрифтов вошли в чат. Смысл вышел из чата.",
    workTitle: "Первый экран сайта",
    weakSpot: "Польза и кнопка потерялись среди декора.",
    weakLabel: "куда нажимать?",
    fix: "Убрать лишние эффекты. Сделать заголовок, пользу и кнопку главным фокусом.",
    hotspot: { x: "56%", y: "61%", w: "34%", h: "17%" },
  },
  {
    id: "cook",
    title: "Поварское дело",
    text: "блюда, подача, меню, технология",
    icon: ChefHat,
    meme: "«Вкусно» на словах не считается. Нужна технология и результат.",
    layers: ["Навык: технология блюда", "Задача: позиция для меню", "Правка: описать подачу", "Skill ID: блюдо-кейс"],
    traps: ["Просто «вкусно»", "Нет времени готовки", "Нет состава"],
    funnyWin: "Теперь блюдо можно повторить, а не просто загадочно нюхать экран.",
    funnyFail: "«Вкусно» — это эмоция. Заказчик просит рецепт, а не поэму.",
    workTitle: "Блюдо для меню кафе",
    weakSpot: "Блюдо нельзя повторить: нет технологии и подачи.",
    weakLabel: "где технология?",
    fix: "Описать технологию и подачу так, чтобы блюдо можно было повторить и оценить.",
    hotspot: { x: "22%", y: "54%", w: "46%", h: "20%" },
  },
  {
    id: "teach",
    title: "Педагогика",
    text: "объяснение, уроки, работа с учениками",
    icon: GraduationCap,
    meme: "Объяснить так, чтобы поняли — сильный навык.",
    layers: ["Навык: объяснение темы", "Задача: мини-урок", "Правка: вопрос на понимание", "Skill ID: понятный урок"],
    traps: ["Только термины", "Без примера", "Не проверил понимание"],
    funnyWin: "Новичок понял тему и не сделал вид. Редкий, но ценный момент.",
    funnyFail: "Ученик кивнул. Это не победа, это тревожный сигнал.",
    workTitle: "Мини-урок для новичка",
    weakSpot: "Ученик кивнул, но ты не проверил, понял ли он.",
    weakLabel: "кивок опасен",
    fix: "Добавить пример из жизни и вопрос, который проверяет понимание.",
    hotspot: { x: "18%", y: "60%", w: "55%", h: "18%" },
  },
  {
    id: "psy",
    title: "Психология",
    text: "коммуникация, поддержка, этика",
    icon: HeartHandshake,
    meme: "Слушать, уточнять и не давить — база профессионального общения.",
    layers: ["Навык: уточнение запроса", "Задача: разбор ситуации", "Правка: сохранить границы", "Skill ID: этичный кейс"],
    traps: ["Диагноз за 5 секунд", "Давление мнением", "Совет без запроса"],
    funnyWin: "Ты сначала понял запрос. Разговор не превратился в шоу «я сейчас всё решу».",
    funnyFail: "Диагноз за 5 секунд — скорость высокая, профессионализм низкий.",
    workTitle: "Учебная коммуникационная ситуация",
    weakSpot: "Ты слишком быстро даёшь совет, не уточнив запрос.",
    weakLabel: "слишком быстро",
    fix: "Сначала уточнить запрос и сохранить безопасные границы общения.",
    hotspot: { x: "20%", y: "48%", w: "45%", h: "20%" },
  },
  {
    id: "law",
    title: "Юриспруденция",
    text: "факты, документы, правовая логика",
    icon: Scale,
    meme: "Позиция без фактов — уверенный монолог.",
    layers: ["Навык: правовая логика", "Задача: позиция по ситуации", "Правка: найти основание", "Skill ID: аргументированный кейс"],
    traps: ["Обещать победу", "Игнорировать документы", "Громкий голос"],
    funnyWin: "Факты на месте, основание найдено. Уверенный монолог стал позицией.",
    funnyFail: "Громкий голос добавляет децибелы, но не добавляет основания.",
    workTitle: "Учебная правовая позиция",
    weakSpot: "Есть уверенность, но нет фактов и основания.",
    weakLabel: "где основание?",
    fix: "Сначала факты и документы, потом основание. Без обещаний результата.",
    hotspot: { x: "46%", y: "48%", w: "42%", h: "18%" },
  },
];

const swipeCards = [
  { text: "Я быстро учусь, честно", side: "cringe", sticker: "😐", reaction: "Рынок: ну... допустим." },
  { text: "Вот задача, результат и правка наставника", side: "case", sticker: "👀", reaction: "О, это уже можно смотреть." },
  { text: "Портфолио пока пустое, но я перспективный", side: "cringe", sticker: "🫥", reaction: "Перспектива без кейса пока не продаёт." },
  { text: "Skill ID: навык подтверждён реальной задачей", side: "case", sticker: "⚡", reaction: "Навык пошёл в дело." },
] as const;

const bossRounds = [
  { ask: "А опыт есть?", right: "Показать кейс", wrong: ["Сказать «я умею»", "Уйти в туман"] },
  { ask: "А кто проверил?", right: "Показать правку наставника", wrong: ["Сказать «мама оценила»", "Спрятать работу"] },
  { ask: "Где это посмотреть?", right: "Открыть Skill ID", wrong: ["Отправить пустой файл", "Сказать «потом»"] },
] as const;

export default function EventPage() {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>(0);
  const [goalId, setGoalId] = useState<GoalId>("money");
  const [skillId, setSkillId] = useState<SkillId>("code");
  const [swipeIndex, setSwipeIndex] = useState(0);
  const [swipeDone, setSwipeDone] = useState(false);
  const [swipeLocked, setSwipeLocked] = useState(false);
  const [message, setMessage] = useState("Свайпай: влево — просто слова, вправо — реальный кейс.");
  const [stack, setStack] = useState<string[]>([]);
  const [shake, setShake] = useState(false);
  const [fixed, setFixed] = useState(false);
  const [bossRound, setBossRound] = useState(0);
  const [bossHp, setBossHp] = useState(100);
  const [shared, setShared] = useState(false);
  const [stats, setStats] = useState({ trust: 12, casePower: 8, chance: 5 });

  const goal = useMemo(() => goals.find((item) => item.id === goalId) ?? goals[0], [goalId]);
  const skill = useMemo(() => skills.find((item) => item.id === skillId) ?? skills[0], [skillId]);
  const progress = ((phase + 1) / 7) * 100;

  const addStats = (trust = 0, casePower = 0, chance = 0) => {
    setStats((current) => ({
      trust: Math.min(100, current.trust + trust),
      casePower: Math.min(100, current.casePower + casePower),
      chance: Math.min(100, current.chance + chance),
    }));
  };

  const restart = () => {
    setPhase(0);
    setGoalId("money");
    setSkillId("code");
    setSwipeIndex(0);
    setSwipeDone(false);
    setSwipeLocked(false);
    setMessage("Свайпай: влево — просто слова, вправо — реальный кейс.");
    setStack([]);
    setShake(false);
    setFixed(false);
    setBossRound(0);
    setBossHp(100);
    setShared(false);
    setStats({ trust: 12, casePower: 8, chance: 5 });
  };

  const swipe = (direction: "left" | "right") => {
    if (swipeLocked || swipeDone) return;
    setSwipeLocked(true);
    const card = swipeCards[swipeIndex];
    const correct = (card.side === "case" && direction === "right") || (card.side === "cringe" && direction === "left");
    setMessage(correct ? card.reaction : "Почти. Смысл такой: слова не работают без доказательства.");
    addStats(correct ? 10 : 3, correct ? 8 : 2, correct ? 5 : 1);
    if (typeof navigator !== "undefined") navigator.vibrate?.(correct ? 18 : 8);

    if (swipeIndex >= swipeCards.length - 1) {
      setSwipeDone(true);
      setTimeout(() => setMessage("Ты понял базу: кейс сильнее обещаний. Пора собрать свой."), 260);
      return;
    }
    setTimeout(() => {
      setSwipeIndex((current) => current + 1);
      setSwipeLocked(false);
    }, 240);
  };

  const addLayer = (layer: string, good: boolean) => {
    if (!good) {
      setShake(true);
      setMessage(skill.funnyFail);
      setTimeout(() => setShake(false), 420);
      return;
    }
    if (stack.includes(layer)) return;
    setStack((current) => [...current, layer]);
    addStats(7, 12, 4);
    setMessage(stack.length + 1 >= skill.layers.length ? "Кейс-бургер собран. Теперь наставник найдёт слабое место." : skill.funnyWin);
  };

  const tapWork = (hit: boolean) => {
    if (!hit) {
      setShake(true);
      setMessage(`Не туда. Ищи слабое место: ${skill.weakLabel}.`);
      setTimeout(() => setShake(false), 380);
      return;
    }
    setFixed(true);
    addStats(18, 20, 10);
    setMessage("Слабое место найдено. Наставник дал правку, работа стала сильнее.");
  };

  const attackBoss = (attack: string) => {
    const round = bossRounds[bossRound];
    if (attack !== round.right) {
      setShake(true);
      setMessage("Босс не пробит. Нужен не ответ красивее, а доказательство сильнее.");
      setTimeout(() => setShake(false), 400);
      return;
    }
    const nextHp = Math.max(0, bossHp - 34);
    setBossHp(nextHp);
    setBossRound((current) => current + 1);
    addStats(12, 10, 18);
    setMessage(nextHp <= 0 ? "Босс «без опыта» побеждён. Skill ID готов к запуску." : "Попадание. Доказательство работает лучше слов.");
  };

  const shareQuest = async () => {
    setShared(true);
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({
          title: "Skill ID Quest",
          text: "Я прошёл Skill ID Rush и выбил оффер.",
          url: "https://skillbarter-mvp-bh44.vercel.app/event",
        });
      } catch {
        setShared(true);
      }
    }
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#05030b] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-20%] top-[-12%] hidden h-72 w-72 rounded-full bg-fuchsia-600/25 blur-3xl sm:block" />
        <div className="absolute right-[-18%] top-[20%] hidden h-80 w-80 rounded-full bg-violet-500/20 blur-3xl sm:block" />
        <div className="absolute bottom-[-16%] left-[18%] hidden h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl sm:block" />
        <div className="absolute left-[-90px] top-10 h-52 w-52 rounded-full bg-fuchsia-600/18 sm:hidden" />
        <div className="absolute bottom-0 right-[-110px] h-56 w-56 rounded-full bg-cyan-500/12 sm:hidden" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] bg-[size:34px_34px] opacity-35" />
      </div>

      <section className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-6 pt-4 sm:px-6 lg:px-8">
        <header className="mb-4 rounded-[28px] border border-white/10 bg-white/[0.06] p-3 shadow-2xl shadow-violet-950/40 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-fuchsia-200">Skill ID Rush</p>
              <p className="truncate text-sm text-white/60">выбей оффер через кейс, а не через «я умею»</p>
            </div>
            <div className="shrink-0 rounded-full border border-fuchsia-300/30 bg-fuchsia-400/10 px-3 py-2 text-xs font-black text-fuchsia-100">
              {phase + 1}/7
            </div>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-fuchsia-400 via-violet-300 to-cyan-300" animate={{ width: `${progress}%` }} transition={{ duration: reduceMotion ? 0 : 0.45 }} />
          </div>
        </header>

        <AnimatePresence mode="wait">
          {phase === 0 && (
            <Screen key="intro">
              <div className="grid flex-1 items-center gap-5 lg:grid-cols-[1.08fr_.92fr]">
                <div>
                  <Badge>мини-игра для мероприятия</Badge>
                  <motion.h1 className="mt-5 max-w-3xl text-4xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl" initial={{ opacity: 0, y: 22, clipPath: "inset(0 0 45% 0)" }} animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }} transition={{ duration: reduceMotion ? 0 : 0.75 }}>
                    Ты умеешь. Но кто это увидит?
                  </motion.h1>
                  <p className="mt-5 max-w-2xl text-lg text-white/72 sm:text-xl">
                    Пройди Skill ID Quest: собери кейс, прими правку наставника и покажи навык так, чтобы он помог заработать или попасть на работу.
                  </p>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <Sticker kind="market" title="Я умею 😐" text="рынок: ну допустим" />
                    <Sticker kind="skill" title="Вот мой кейс 👀" text="рынок: о, интересно" />
                  </div>
                  <PrimaryButton className="mt-6 w-full sm:w-auto" onClick={() => setPhase(1)}>
                    Начать квест <ArrowRight size={18} />
                  </PrimaryButton>
                </div>
                <RouteMap />
              </div>
            </Screen>
          )}

          {phase === 1 && (
            <Screen key="swipe">
              <GameTitle kicker="Раунд 1" title="Кринж или кейс?" text="Твоя задача: отличить пустые обещания от доказательства навыка." />
              <RuleCard step="Что делать" text="Свайпни карточку или нажми кнопку: «Это слова» для обещаний, «Это кейс» для результата, который можно проверить." />
              <div className="grid flex-1 items-center gap-5 lg:grid-cols-[.95fr_1.05fr]">
                <div className="mx-auto w-full max-w-sm">
                  <motion.div
                    key={swipeIndex}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(_, info) => {
                      if (info.offset.x > 80) swipe("right");
                      if (info.offset.x < -80) swipe("left");
                    }}
                    initial={{ opacity: 0, y: 24, rotate: -2 }}
                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="min-h-[300px] touch-pan-y rounded-[34px] border border-white/15 bg-gradient-to-br from-white/[0.14] to-white/[0.04] p-6 shadow-2xl shadow-fuchsia-950/40"
                  >
                    <div className="text-6xl">{swipeCards[swipeIndex].sticker}</div>
                    <p className="mt-6 text-3xl font-black leading-tight">{swipeCards[swipeIndex].text}</p>
                    <div className="mt-8 flex items-center justify-between gap-3 text-sm font-black uppercase tracking-[0.18em] text-white/50">
                      <span>← кринж</span>
                      <span>кейс →</span>
                    </div>
                  </motion.div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <SecondaryButton disabled={swipeLocked || swipeDone} onClick={() => swipe("left")}>Это слова</SecondaryButton>
                    <SecondaryButton disabled={swipeLocked || swipeDone} onClick={() => swipe("right")}>Это кейс</SecondaryButton>
                  </div>
                </div>
                <SidePanel sticker="market" message={message}>
                  <StatBars stats={stats} />
                  <PrimaryButton disabled={!swipeDone} onClick={() => setPhase(2)}>
                    Собрать свой кейс <ArrowRight size={18} />
                  </PrimaryButton>
                </SidePanel>
              </div>
            </Screen>
          )}

          {phase === 2 && (
            <Screen key="choice">
              <GameTitle kicker="Раунд 2" title="Выбери цель и профессию" text="Теперь игра подстроит миссию под тебя: деньги, работа, портфолио или рост." />
              <RuleCard step="Что делать" text="Выбери одну цель и одну сферу. Дальше ты будешь собирать кейс именно под этот навык." />
              <div className="grid gap-5 lg:grid-cols-2">
                <Panel title="Что хочешь получить?">
                  <div className="grid gap-3">
                    {goals.map((item) => (
                      <Choice key={item.id} active={item.id === goalId} onClick={() => setGoalId(item.id)} title={item.title} text={item.text} />
                    ))}
                  </div>
                </Panel>
                <Panel title="В какой сфере докажешь себя?">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {skills.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button key={item.id} onClick={() => setSkillId(item.id)} className={`min-h-[112px] rounded-[24px] border p-4 text-left transition active:scale-[0.98] ${item.id === skillId ? "border-fuchsia-300 bg-fuchsia-400/15 shadow-xl shadow-fuchsia-950/40" : "border-white/10 bg-white/[0.055] hover:border-white/25"}`}>
                          <Icon className="mb-3 text-fuchsia-200" size={22} />
                          <p className="font-black">{item.title}</p>
                          <p className="mt-1 text-sm text-white/58">{item.text}</p>
                        </button>
                      );
                    })}
                  </div>
                </Panel>
              </div>
              <Footer>
                <Sticker kind="portfolio" title={skill.title} text={skill.meme} />
                <PrimaryButton onClick={() => setPhase(3)}>
                  Собрать кейс-бургер <ArrowRight size={18} />
                </PrimaryButton>
              </Footer>
            </Screen>
          )}

          {phase === 3 && (
            <Screen key="burger">
              <GameTitle kicker="Раунд 3" title="Собери кейс-бургер" text="Кейс — это не «я старался». Это навык + задача + правка + результат в Skill ID." />
              <RuleCard step="Что делать" text="Перед тобой 7 ингредиентов. Выбери 4, которые реально убедят заказчика или работодателя. Ошибёшься — рынок отреагирует." />
              <div className="grid flex-1 items-center gap-5 lg:grid-cols-[.9fr_1.1fr]">
                <motion.div animate={shake ? { x: [-8, 8, -6, 6, 0] } : { x: 0 }} className="rounded-[34px] border border-white/10 bg-white/[0.055] p-5">
                  <div className="mx-auto flex min-h-[330px] max-w-sm flex-col-reverse justify-center gap-3">
                    {stack.length === 0 && <p className="rounded-[24px] border border-dashed border-white/20 p-8 text-center text-white/48">Тут пока пусто. Собери доказательство слоями.</p>}
                    {stack.map((layer, index) => (
                      <motion.div key={layer} initial={{ opacity: 0, y: -34, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="rounded-full border border-fuchsia-200/30 bg-gradient-to-r from-fuchsia-500/25 to-cyan-400/15 px-5 py-4 text-center font-black shadow-lg shadow-fuchsia-950/40">
                        {index === stack.length - 1 ? "✨ " : ""}
                        {layer}
                      </motion.div>
                    ))}
                  </div>
                  <p className="mt-4 text-center text-sm text-white/58">{message}</p>
                </motion.div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[...skill.layers.map((title) => ({ title, good: true })), ...skill.traps.map((title) => ({ title, good: false }))].map((layer, index) => (
                    <button key={layer.title} onClick={() => addLayer(layer.title, layer.good)} disabled={stack.includes(layer.title)} className="min-h-[92px] rounded-[24px] border border-white/10 bg-white/[0.06] p-4 text-left font-bold transition hover:border-fuchsia-300/45 hover:bg-fuchsia-400/10 active:scale-[0.97] disabled:opacity-45">
                      <span className="mb-2 inline-flex rounded-full bg-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-white/48">
                        ингредиент #{index + 1}
                      </span>
                      <span className="block">🍔 {layer.title}</span>
                    </button>
                  ))}
                </div>
              </div>
              <Footer>
                <Sticker kind="mentor" title="Наставник" text="Кейс почти есть. Но сильная работа проходит через правку." />
                <PrimaryButton disabled={stack.length < skill.layers.length} onClick={() => setPhase(4)}>
                  Отдать на правку <ArrowRight size={18} />
                </PrimaryButton>
              </Footer>
            </Screen>
          )}

          {phase === 4 && (
            <Screen key="fix">
              <GameTitle kicker="Раунд 4" title="Найди слабое место" text="Сырая работа почти готова, но в ней есть ошибка. Наставник не ругает — он усиливает кейс." />
              <RuleCard step="Что делать" text={`Тапни подсвеченную проблемную область: ${skill.weakLabel}. Если промахнёшься, игра подскажет.`} />
              <div className="grid flex-1 items-center gap-5 lg:grid-cols-[1.05fr_.95fr]">
                <motion.div animate={shake ? { x: [-8, 8, -6, 6, 0] } : { x: 0 }} className="relative min-h-[410px] overflow-hidden rounded-[34px] border border-white/12 bg-gradient-to-br from-white/[0.12] to-white/[0.04] p-5">
                  <div className="rounded-[28px] border border-white/12 bg-black/25 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-black uppercase tracking-[0.2em] text-fuchsia-200">черновик</p>
                      <span className="rounded-full bg-red-400/15 px-3 py-1 text-xs font-black text-red-100">слабое место внутри</span>
                    </div>
                    <h3 className="mt-5 text-2xl font-black">{skill.workTitle}</h3>
                    <div className="mt-5 grid gap-3">
                      <div className="h-16 rounded-2xl bg-white/10" />
                      <div className="h-10 w-2/3 rounded-2xl bg-white/10" />
                      <div className="h-20 rounded-2xl border border-dashed border-white/18 bg-white/[0.04]" />
                      <div className="h-12 w-1/2 rounded-full bg-fuchsia-400/20" />
                    </div>
                    <p className="mt-5 text-white/66">{skill.weakSpot}</p>
                  </div>
                  <motion.button
                    aria-label="Слабое место"
                    onClick={() => tapWork(true)}
                    animate={{ scale: [1, 1.04, 1] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                    className="absolute rounded-[22px] border border-fuchsia-200/70 bg-fuchsia-400/18 shadow-[0_0_40px_rgba(217,70,239,.42)]"
                    style={{ left: skill.hotspot.x, top: skill.hotspot.y, width: skill.hotspot.w, height: skill.hotspot.h }}
                  >
                    <span className="absolute -top-8 left-0 rounded-full bg-fuchsia-300 px-3 py-1 text-xs font-black text-black">проверь</span>
                  </motion.button>
                  <button aria-label="Ложная область" onClick={() => tapWork(false)} className="absolute left-[8%] top-[22%] h-20 w-28 rounded-3xl" />
                </motion.div>
                <SidePanel sticker="mentor" message={message}>
                  <div className="rounded-[26px] border border-fuchsia-200/20 bg-fuchsia-400/10 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-fuchsia-100">правка наставника</p>
                    <p className="mt-3 text-white/78">{skill.fix}</p>
                  </div>
                  {fixed && <Sticker kind="skill" title="Кейс усилен" text="Правка принята. Работа стала взрослее." />}
                  <PrimaryButton disabled={!fixed} onClick={() => setPhase(5)}>
                    Выйти на босса <ArrowRight size={18} />
                  </PrimaryButton>
                </SidePanel>
              </div>
            </Screen>
          )}

          {phase === 5 && (
            <Screen key="boss">
              <GameTitle kicker="Финальный раунд" title="Босс: «Без опыта не берём»" text="Скептик задаёт вопросы. Побеждай не словами, а тем, что ты собрал: кейс, правка, Skill ID." />
              <RuleCard step="Что делать" text="Выбирай атаку-доказательство, которая отвечает на вопрос босса. Ошибся — ничего страшного, пробуй сильнее." />
              <div className="grid flex-1 items-center gap-5 lg:grid-cols-[.95fr_1.05fr]">
                <motion.div animate={shake ? { x: [-9, 9, -6, 6, 0] } : { x: 0 }} className="rounded-[36px] border border-red-300/20 bg-gradient-to-br from-red-500/15 to-fuchsia-500/10 p-5 text-center shadow-2xl shadow-red-950/30">
                  <Sticker kind={bossRound >= 3 ? "skill" : "boss"} title={bossRound >= 3 ? "Босс повержен" : "Без опыта не берём"} text={bossRound >= 3 ? "теперь есть доказательство" : bossRounds[bossRound].ask} />
                  <div className="mt-5 h-5 overflow-hidden rounded-full bg-black/35">
                    <motion.div className="h-full rounded-full bg-gradient-to-r from-red-400 to-fuchsia-300" animate={{ width: `${bossRound >= 3 ? 0 : bossHp}%` }} />
                  </div>
                  <p className="mt-3 text-sm font-black uppercase tracking-[0.18em] text-white/48">HP босса: {bossRound >= 3 ? 0 : bossHp}</p>
                </motion.div>
                <div className="grid gap-3">
                  {bossRound >= 3 ? (
                    <>
                      <Sticker kind="employer" title="Работодатель заинтересовался" text="Не просто слова. Есть Skill ID и кейс." />
                      <PrimaryButton onClick={() => setPhase(6)}>
                        Разблокировать Skill ID <ArrowRight size={18} />
                      </PrimaryButton>
                    </>
                  ) : (
                    [bossRounds[bossRound].right, ...bossRounds[bossRound].wrong].map((attack) => (
                      <button key={attack} onClick={() => attackBoss(attack)} className="min-h-[76px] rounded-[24px] border border-white/10 bg-white/[0.06] p-4 text-left text-lg font-black transition hover:border-cyan-200/40 hover:bg-cyan-300/10 active:scale-[0.97]">
                        ⚔️ {attack}
                      </button>
                    ))
                  )}
                  <p className="text-sm text-white/58">{message}</p>
                </div>
              </div>
            </Screen>
          )}

          {phase === 6 && (
            <Screen key="final">
              <Final goal={goal} skill={skill} stats={stats} restart={restart} share={shareQuest} shared={shared} />
            </Screen>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}

function Screen({ children }: { children: React.ReactNode }) {
  return (
    <motion.div className="flex min-h-[calc(100vh-132px)] flex-col" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.28 }}>
      {children}
    </motion.div>
  );
}

function GameTitle({ kicker, title, text }: { kicker: string; title: string; text: string }) {
  return (
    <div className="mb-5">
      <Badge>{kicker}</Badge>
      <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight sm:text-5xl">{title}</h1>
      <p className="mt-3 max-w-2xl text-base text-white/68 sm:text-lg">{text}</p>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex rounded-full border border-fuchsia-300/25 bg-fuchsia-400/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-fuchsia-100">{children}</span>;
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[32px] border border-white/10 bg-white/[0.055] p-4 shadow-2xl shadow-violet-950/25 sm:p-5">
      <h2 className="mb-4 text-xl font-black">{title}</h2>
      {children}
    </div>
  );
}

function Choice({ active, onClick, title, text }: { active: boolean; onClick: () => void; title: string; text: string }) {
  return (
    <button onClick={onClick} className={`min-h-[86px] rounded-[24px] border p-4 text-left transition active:scale-[0.98] ${active ? "border-cyan-200 bg-cyan-300/12 shadow-lg shadow-cyan-950/30" : "border-white/10 bg-white/[0.05] hover:border-white/25"}`}>
      <p className="font-black">{title}</p>
      <p className="mt-1 text-sm text-white/58">{text}</p>
    </button>
  );
}

function PrimaryButton({ children, onClick, disabled, className = "" }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; className?: string }) {
  return (
    <button onClick={onClick} disabled={disabled} className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-400 to-cyan-300 px-6 py-3 text-sm font-black text-black shadow-[0_0_32px_rgba(217,70,239,.34)] transition hover:-translate-y-0.5 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 ${className}`}>
      {children}
    </button>
  );
}

function SecondaryButton({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} className="min-h-12 rounded-full border border-white/12 bg-white/[0.07] px-4 py-3 text-sm font-black text-white transition hover:border-fuchsia-200/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45">
      {children}
    </button>
  );
}

function RuleCard({ step, text }: { step: string; text: string }) {
  return (
    <div className="mb-5 rounded-[24px] border border-cyan-200/20 bg-cyan-300/10 p-4">
      <div className="flex items-start gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-cyan-200 text-lg font-black text-black">?</div>
        <div className="min-w-0">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-cyan-100">{step}</p>
          <p className="mt-1 break-words text-sm leading-relaxed text-white/72">{text}</p>
        </div>
      </div>
    </div>
  );
}

function Footer({ children }: { children: React.ReactNode }) {
  return <div className="mt-auto grid gap-3 pt-5 sm:grid-cols-[1fr_auto] sm:items-center">{children}</div>;
}

function SidePanel({ sticker, message, children }: { sticker: StickerKind; message: string; children: React.ReactNode }) {
  return (
    <Panel title="Что происходит?">
      <div className="grid gap-4">
        <Sticker kind={sticker} title="Реакция" text={message} />
        {children}
      </div>
    </Panel>
  );
}

function StatBars({ stats }: { stats: { trust: number; casePower: number; chance: number } }) {
  return (
    <div className="grid gap-3">
      <Meter label="Доверие" value={stats.trust} />
      <Meter label="Сила кейса" value={stats.casePower} />
      <Meter label="Шанс на возможность" value={stats.chance} />
    </div>
  );
}

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs font-black uppercase tracking-[0.14em] text-white/52">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <motion.div className="h-full rounded-full bg-gradient-to-r from-fuchsia-400 to-cyan-300" animate={{ width: `${value}%` }} transition={{ duration: 0.45 }} />
      </div>
    </div>
  );
}

function Sticker({ kind, title, text }: { kind: StickerKind; title: string; text: string }) {
  const faces: Record<StickerKind, string> = {
    boss: "😤",
    market: "👀",
    mentor: "🧠",
    employer: "💼",
    skill: "⚡",
    portfolio: "📁",
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.96, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="relative overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.07] p-4">
      <div className="absolute right-[-22px] top-[-28px] text-7xl opacity-20">{faces[kind]}</div>
      <div className="flex items-start gap-3">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-fuchsia-200/25 bg-fuchsia-400/12 text-2xl">{faces[kind]}</div>
        <div className="min-w-0">
          <p className="font-black">{title}</p>
          <p className="mt-1 break-words text-sm text-white/62">{text}</p>
        </div>
      </div>
    </motion.div>
  );
}

function RouteMap() {
  const items = ["Навык", "Кейс", "Правка", "Босс", "Skill ID", "Оффер"];
  return (
    <div className="rounded-[36px] border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-violet-950/30">
      <div className="grid gap-3">
        {items.map((item, index) => (
          <motion.div key={item} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.08 }} className="flex items-center gap-3 rounded-[24px] border border-white/10 bg-black/20 p-4">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-fuchsia-400 to-cyan-300 font-black text-black">{index + 1}</div>
            <p className="font-black">{item}</p>
            <div className="ml-auto h-2 w-12 rounded-full bg-fuchsia-300/40" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Final({ goal, skill, stats, restart, share, shared }: { goal: (typeof goals)[number]; skill: Skill; stats: { trust: number; casePower: number; chance: number }; restart: () => void; share: () => void; shared: boolean }) {
  return (
    <div className="grid flex-1 items-center gap-5 lg:grid-cols-[.92fr_1.08fr]">
      <div>
        <Badge>финал</Badge>
        <h1 className="mt-4 text-4xl font-black leading-tight sm:text-6xl">SKILL ID ACTIVATED</h1>
        <p className="mt-4 max-w-xl text-lg text-white/70">
          Не просто: «я умею». А: «вот что я сделал».
        </p>
        <div className="mt-5 grid gap-3">
          <Sticker kind="skill" title="Кейс разблокирован" text="Теперь навык можно показать заказчику, наставнику или работодателю." />
          <Sticker kind="employer" title="Работодатель проснулся" text="Есть результат, проверка и понятный Skill ID." />
        </div>
      </div>

      <div className="rounded-[36px] border border-fuchsia-200/25 bg-gradient-to-br from-fuchsia-500/15 via-white/[0.07] to-cyan-400/10 p-5 shadow-2xl shadow-fuchsia-950/40">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-fuchsia-100">SkillBarter ID</p>
            <h2 className="mt-2 text-2xl font-black">SB-RUSH-2026</h2>
          </div>
          <Fingerprint className="text-cyan-200" size={34} />
        </div>
        <div className="mt-5 grid gap-3 text-sm">
          <ResultLine label="Цель" value={goal.title} />
          <ResultLine label="Направление" value={skill.title} />
          <ResultLine label="Кейс" value={skill.workTitle} />
          <ResultLine label="Возможность" value={goal.result} />
        </div>
        <div className="mt-5 grid gap-3">
          <Meter label="Доверие" value={Math.max(stats.trust, 76)} />
          <Meter label="Сила кейса" value={Math.max(stats.casePower, 72)} />
          <Meter label="Шанс на заказ/работу" value={Math.max(stats.chance, 68)} />
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <MiniBenefit title="Заказы" text="с кейсом проще поверить, что ты справишься" />
          <MiniBenefit title="Работа" text="виден результат, а не только обещания" />
          <MiniBenefit title="Рост" text="правки превращают попытку в сильную работу" />
        </div>
        <p className="mt-5 rounded-[24px] border border-white/10 bg-black/20 p-4 text-sm leading-relaxed text-white/72">
          Наш проект помогает тебе показать свои навыки не словами, а реальными кейсами. В SkillBarter ты проходишь уроки, выполняешь настоящие задачи, получаешь правки наставников и собираешь Skill ID. Так навык превращается в доказательство, доказательство — в доверие, а доверие — в возможность зарабатывать, брать заказы и легче попасть на работу.
        </p>
        <p className="mt-3 text-center text-sm font-black text-fuchsia-100">
          SkillBarter — платформа, где навык становится доказанным результатом.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Link href="/access" className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-4 py-3 text-sm font-black text-black transition hover:-translate-y-0.5">
            Открыть MVP
          </Link>
          <SecondaryButton onClick={restart}>
            <RefreshCcw size={16} className="inline" /> Ещё раз
          </SecondaryButton>
          <SecondaryButton onClick={share}>{shared ? "Ссылка готова" : "Показать другу"}</SecondaryButton>
        </div>
      </div>
    </div>
  );
}

function ResultLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3">
      <span className="text-white/48">{label}</span>
      <span className="text-right font-black">{value}</span>
    </div>
  );
}

function MiniBenefit({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-3">
      <ShieldCheck className="mb-2 text-cyan-200" size={18} />
      <p className="font-black">{title}</p>
      <p className="mt-1 text-xs text-white/58">{text}</p>
    </div>
  );
}
