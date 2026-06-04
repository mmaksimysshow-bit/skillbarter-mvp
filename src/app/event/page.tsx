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

type Phase = 0 | 1 | 2 | 3 | 4 | 5 | 6;
type ProfessionId = "code" | "design" | "cook" | "teach" | "psy" | "law";
type MemeKind = "boss" | "mentor" | "market" | "employer" | "portfolio" | "skill" | "money";

type Profession = {
  id: ProfessionId;
  title: string;
  role: string;
  icon: LucideIcon;
  meme: string;
  caseTitle: string;
  quest: string;
  route: string[];
  traps: string[];
  assets: Array<{ id: string; title: string; good: boolean; note: string }>;
  hotspots: Array<{ id: string; title: string; correct: boolean; x: string; y: string; fix: string }>;
  mentorLine: string;
};

const professions: Profession[] = [
  {
    id: "code",
    title: "Программирование",
    role: "страница заявки",
    icon: Code2,
    meme: "Код есть. Теперь докажи, что он работает.",
    caseTitle: "Рабочая заявка для бизнеса",
    quest: "Бизнесу нужна страница, где клиент оставляет заявку с телефона.",
    route: ["Понять задачу", "Собрать форму", "Проверить отправку", "Показать результат"],
    traps: ["Выбрать шрифт на 2 часа", "Сделать фон вместо формы"],
    mentorLine: "Форма должна не просто выглядеть, а реально отправлять заявку.",
    assets: [
      { id: "c1", title: "Рабочая форма", good: true, note: "пользователь оставил заявку" },
      { id: "c2", title: "Проверка кнопки", good: true, note: "кнопка не мертвая" },
      { id: "c3", title: "Мобильная версия", good: true, note: "ничего не уехало" },
      { id: "c4", title: "Скрин результата", good: true, note: "можно показать" },
      { id: "c5", title: "Ошибка в консоли", good: false, note: "босс хлопает" },
      { id: "c6", title: "Форма без отправки", good: false, note: "муляж" },
      { id: "c7", title: "Красивая тень", good: false, note: "не доказывает" },
      { id: "c8", title: "Нет адаптива", good: false, note: "телефон плачет" },
    ],
    hotspots: [
      { id: "h1", title: "кнопка молчит", correct: true, x: "58%", y: "64%", fix: "подключить отправку" },
      { id: "h2", title: "нет мобильной проверки", correct: true, x: "28%", y: "73%", fix: "проверить телефон" },
      { id: "h3", title: "логотип слишком яркий", correct: false, x: "22%", y: "22%", fix: "не главное" },
    ],
  },
  {
    id: "design",
    title: "Дизайн",
    role: "первый экран",
    icon: Palette,
    meme: "Красиво - хорошо. Понятно и полезно - уже кейс.",
    caseTitle: "Первый экран сайта",
    quest: "Клиенту нужен экран, где за 5 секунд понятно: что это и куда нажимать.",
    route: ["Понять аудиторию", "Собрать иерархию", "Выделить CTA", "Проверить на телефоне"],
    traps: ["17 шрифтов", "Градиент ради градиента"],
    mentorLine: "Сделай заголовок, пользу и кнопку главным фокусом.",
    assets: [
      { id: "d1", title: "Понятный заголовок", good: true, note: "смысл виден" },
      { id: "d2", title: "CTA крупно", good: true, note: "ясно куда жать" },
      { id: "d3", title: "Польза за 5 секунд", good: true, note: "не надо гадать" },
      { id: "d4", title: "Мобильный экран", good: true, note: "поместилось" },
      { id: "d5", title: "18 эффектов", good: false, note: "хаос" },
      { id: "d6", title: "Мелкий текст", good: false, note: "как договор банка" },
      { id: "d7", title: "Кнопка спряталась", good: false, note: "квест не тот" },
      { id: "d8", title: "Случайные картинки", good: false, note: "не помогает" },
    ],
    hotspots: [
      { id: "h1", title: "кнопка незаметна", correct: true, x: "63%", y: "66%", fix: "усилить CTA" },
      { id: "h2", title: "заголовок слабый", correct: true, x: "34%", y: "31%", fix: "сделать пользу ясной" },
      { id: "h3", title: "фон темный", correct: false, x: "72%", y: "24%", fix: "не проблема" },
    ],
  },
  {
    id: "cook",
    title: "Поварское дело",
    role: "блюдо для меню",
    icon: ChefHat,
    meme: "«Вкусно» на словах не считается. Нужна технология.",
    caseTitle: "Блюдо для меню кафе",
    quest: "Кафе просит блюдо, которое можно повторить, посчитать и показать.",
    route: ["Выбрать идею", "Описать состав", "Записать технологию", "Показать подачу"],
    traps: ["Просто сказать вкусно", "Готовить на глаз"],
    mentorLine: "Добавь состав, технологию, время и подачу.",
    assets: [
      { id: "k1", title: "Состав блюда", good: true, note: "понятно что внутри" },
      { id: "k2", title: "Технология", good: true, note: "можно повторить" },
      { id: "k3", title: "Время приготовления", good: true, note: "кафе считает" },
      { id: "k4", title: "Фото подачи", good: true, note: "можно показать" },
      { id: "k5", title: "Просто вкусно", good: false, note: "это эмоция" },
      { id: "k6", title: "Без граммовок", good: false, note: "хаос на кухне" },
      { id: "k7", title: "Нет времени", good: false, note: "меню страдает" },
      { id: "k8", title: "Случайное фото", good: false, note: "не кейс" },
    ],
    hotspots: [
      { id: "h1", title: "нет технологии", correct: true, x: "62%", y: "54%", fix: "описать шаги" },
      { id: "h2", title: "нет состава", correct: true, x: "28%", y: "42%", fix: "добавить состав" },
      { id: "h3", title: "тарелка круглая", correct: false, x: "48%", y: "22%", fix: "это нормально" },
    ],
  },
  {
    id: "teach",
    title: "Педагогика",
    role: "мини-урок",
    icon: GraduationCap,
    meme: "Ученик кивнул. Но понял ли он?",
    caseTitle: "Мини-урок для новичка",
    quest: "Нужно объяснить тему новичку так, чтобы он понял и смог повторить.",
    route: ["Разбить тему", "Объяснить просто", "Дать пример", "Проверить понимание"],
    traps: ["Завалить терминами", "Сказать очевидно"],
    mentorLine: "Добавь пример и вопрос, чтобы проверить понимание.",
    assets: [
      { id: "t1", title: "Простое объяснение", good: true, note: "человеческий язык" },
      { id: "t2", title: "Пример из жизни", good: true, note: "мозг включился" },
      { id: "t3", title: "Мини-вопрос", good: true, note: "проверка" },
      { id: "t4", title: "Короткое задание", good: true, note: "практика" },
      { id: "t5", title: "Гора терминов", good: false, note: "новичок исчез" },
      { id: "t6", title: "Кивнул - понял", good: false, note: "опасная магия" },
      { id: "t7", title: "Без примера", good: false, note: "сухо" },
      { id: "t8", title: "Слишком быстро", good: false, note: "не успели" },
    ],
    hotspots: [
      { id: "h1", title: "нет проверки", correct: true, x: "64%", y: "68%", fix: "добавить вопрос" },
      { id: "h2", title: "нет примера", correct: true, x: "31%", y: "45%", fix: "дать пример" },
      { id: "h3", title: "тема написана", correct: false, x: "30%", y: "24%", fix: "это нужно" },
    ],
  },
  {
    id: "psy",
    title: "Психология",
    role: "этичный диалог",
    icon: HeartHandshake,
    meme: "Диагноз за 5 секунд - сразу бан.",
    caseTitle: "Этичный разбор запроса",
    quest: "Нужно показать безопасную коммуникацию: без давления и диагнозов.",
    route: ["Выслушать", "Уточнить запрос", "Сохранить границы", "Сформулировать поддержку"],
    traps: ["Диагноз за 5 секунд", "Решить за человека"],
    mentorLine: "Сначала запрос и границы. Не обесценивай человека.",
    assets: [
      { id: "p1", title: "Уточнение запроса", good: true, note: "сначала понять" },
      { id: "p2", title: "Границы общения", good: true, note: "безопасно" },
      { id: "p3", title: "Этичная реакция", good: true, note: "без давления" },
      { id: "p4", title: "Поддержка", good: true, note: "бережно" },
      { id: "p5", title: "Диагноз сразу", good: false, note: "красный флаг" },
      { id: "p6", title: "Давить мнением", good: false, note: "не помощь" },
      { id: "p7", title: "Обесценить", good: false, note: "плохо" },
      { id: "p8", title: "Решить за человека", good: false, note: "границы вышли" },
    ],
    hotspots: [
      { id: "h1", title: "обесценивание", correct: true, x: "36%", y: "58%", fix: "заменить на уточнение" },
      { id: "h2", title: "нет запроса", correct: true, x: "67%", y: "42%", fix: "уточнить запрос" },
      { id: "h3", title: "мягкий тон", correct: false, x: "42%", y: "24%", fix: "оставить" },
    ],
  },
  {
    id: "law",
    title: "Юриспруденция",
    role: "правовая позиция",
    icon: Scale,
    meme: "Громкий голос - не доказательство.",
    caseTitle: "Правовая позиция",
    quest: "Нужно показать позицию на фактах, документах и основании.",
    route: ["Выяснить факты", "Проверить документы", "Найти основание", "Собрать позицию"],
    traps: ["Обещать победу", "Спорить громче"],
    mentorLine: "Факты, документы, основание. Без обещаний победы.",
    assets: [
      { id: "l1", title: "Факты ситуации", good: true, note: "основа" },
      { id: "l2", title: "Документы", good: true, note: "доказательства" },
      { id: "l3", title: "Основание", good: true, note: "логика" },
      { id: "l4", title: "Позиция", good: true, note: "собрано" },
      { id: "l5", title: "Обещать победу", good: false, note: "нельзя" },
      { id: "l6", title: "Громко спорить", good: false, note: "не аргумент" },
      { id: "l7", title: "Забыть документы", good: false, note: "плохо" },
      { id: "l8", title: "Без фактов", good: false, note: "пусто" },
    ],
    hotspots: [
      { id: "h1", title: "нет фактов", correct: true, x: "34%", y: "58%", fix: "собрать факты" },
      { id: "h2", title: "обещание победы", correct: true, x: "66%", y: "42%", fix: "убрать обещание" },
      { id: "h3", title: "есть документы", correct: false, x: "38%", y: "23%", fix: "оставить" },
    ],
  },
];

const bossRounds = [
  { question: "А где опыт?", attack: "Показать кейс", win: "Босс потерял аргумент." },
  { question: "А кто проверил?", attack: "Показать правку наставника", win: "Наставник вошел в чат." },
  { question: "А где посмотреть?", attack: "Открыть Skill ID", win: "Skill ID добил босса." },
];

const clamp = (value: number) => Math.max(0, Math.min(100, value));

export default function EventPage() {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>(0);
  const [professionId, setProfessionId] = useState<ProfessionId | null>(null);
  const [routeSlots, setRouteSlots] = useState<string[]>([]);
  const [caseAssets, setCaseAssets] = useState<string[]>([]);
  const [fixedHotspots, setFixedHotspots] = useState<string[]>([]);
  const [bossRound, setBossRound] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [moves, setMoves] = useState(6);
  const [message, setMessage] = useState("Выбери профессию и докажи навык делом.");
  const [shared, setShared] = useState(false);

  const profession = professions.find((item) => item.id === professionId) ?? professions[0];
  const goodAssets = caseAssets.filter((id) => profession.assets.find((item) => item.id === id)?.good).length;
  const caseReady = goodAssets >= 4;
  const repairReady = fixedHotspots.length >= 2;

  const stats = useMemo(() => {
    return {
      trust: clamp(score + routeSlots.length * 8 + goodAssets * 10 + fixedHotspots.length * 12 + bossRound * 9),
      casePower: clamp(routeSlots.length * 10 + goodAssets * 13 + fixedHotspots.length * 15),
      chance: clamp(score + goodAssets * 8 + fixedHotspots.length * 10 + bossRound * 12),
    };
  }, [score, routeSlots.length, goodAssets, fixedHotspots.length, bossRound]);

  const bump = (points: number, text: string) => {
    setScore((value) => clamp(value + points * combo));
    setCombo((value) => Math.min(9, value + 1));
    setMessage(text);
    navigator.vibrate?.(20);
  };

  const fail = (text: string) => {
    setCombo(1);
    setMessage(text);
    navigator.vibrate?.([18, 30, 18]);
  };

  const chooseProfession = (item: Profession) => {
    setProfessionId(item.id);
    setRouteSlots([]);
    setCaseAssets([]);
    setFixedHotspots([]);
    setBossRound(0);
    setMoves(6);
    bump(4, item.meme);
  };

  const tapRoute = (label: string) => {
    const expected = profession.route[routeSlots.length];
    if (routeSlots.includes(label)) return;
    if (label !== expected) {
      fail("Маршрут сломался: сначала нужен правильный порядок работы.");
      return;
    }
    setRouteSlots((items) => [...items, label]);
    bump(5, `${label}: шаг принят. Так задача превращается в результат.`);
  };

  const pickAsset = (id: string) => {
    if (caseAssets.includes(id) || moves <= 0 || caseAssets.length >= 4) return;
    const asset = profession.assets.find((item) => item.id === id);
    if (!asset) return;
    setCaseAssets((items) => [...items, id]);
    setMoves((value) => value - 1);
    if (asset.good) {
      bump(6, `${asset.title}: добавлено в кейс.`);
    } else {
      fail(`${asset.title}: мемно, но это не доказательство.`);
    }
  };

  const tapHotspot = (id: string) => {
    const spot = profession.hotspots.find((item) => item.id === id);
    if (!spot || fixedHotspots.includes(id)) return;
    if (!spot.correct) {
      fail("Это не слабое место. Наставник просит смотреть на результат.");
      return;
    }
    setFixedHotspots((items) => [...items, id]);
    bump(8, `${spot.fix}: работа стала сильнее.`);
  };

  const attackBoss = (index: number) => {
    if (index !== bossRound) {
      fail("Босс не понял аргумент. Нужна правильная последовательность доказательств.");
      return;
    }
    setBossRound((value) => value + 1);
    bump(10, bossRounds[index].win);
  };

  const restart = () => {
    setPhase(0);
    setProfessionId(null);
    setRouteSlots([]);
    setCaseAssets([]);
    setFixedHotspots([]);
    setBossRound(0);
    setScore(0);
    setCombo(1);
    setMoves(6);
    setMessage("Выбери профессию и докажи навык делом.");
    setShared(false);
  };

  const shareQuest = async () => {
    const text = "SkillBarter: навык -> задача -> кейс -> Skill ID.";
    if (navigator.share) {
      await navigator.share({ title: "SkillBarter Quest", text, url: window.location.href }).catch(() => undefined);
    } else {
      await navigator.clipboard?.writeText(window.location.href).catch(() => undefined);
    }
    setShared(true);
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#06030d] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(217,70,239,0.24),transparent_34%),radial-gradient(circle_at_82%_24%,rgba(16,185,129,0.14),transparent_28%),linear-gradient(180deg,#06030d,#120822_54%,#06030d)]" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:28px_28px] opacity-45 [mask-image:radial-gradient(circle_at_center,black,transparent_82%)]" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-6 pt-4 sm:px-6">
        <header className="sticky top-0 z-20 -mx-4 mb-3 border-b border-white/10 bg-[#06030d]/90 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-fuchsia-200">SkillBarter hard mode</p>
              <h1 className="truncate text-lg font-black sm:text-2xl">Мини-игра про кейсы, деньги и работу</h1>
            </div>
            <div className="rounded-full border border-fuchsia-400/30 bg-fuchsia-400/10 px-3 py-1 text-xs font-bold text-fuchsia-100">
              {phase + 1}/7
            </div>
          </div>
          <Bar value={((phase + 1) / 7) * 100} />
        </header>

        <Hud stats={stats} combo={combo} moves={phase === 3 ? moves : null} />
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
                      Не говори <span className="text-fuchsia-300">«я умею»</span>. Докажи.
                    </motion.h2>
                    <motion.p {...fade(0.12, reduceMotion)} className="mt-4 max-w-xl text-base leading-relaxed text-white/72 sm:text-lg">
                      SkillBarter показывает простой путь: ты учишься, выполняешь настоящую задачу, получаешь правку наставника и собираешь Skill ID. Такой кейс можно показать заказчику или работодателю.
                    </motion.p>
                    <motion.div {...fade(0.22, reduceMotion)} className="mt-6">
                      <PrimaryButton onClick={() => setPhase(1)}>Начать миссию</PrimaryButton>
                    </motion.div>
                  </div>
                  <motion.div {...pop(0.1, reduceMotion)} className="space-y-3">
                    <MemePoster kind="boss" title="Без опыта не берем" caption="главный босс студента" />
                    <div className="grid grid-cols-2 gap-3">
                      <MemePoster kind="portfolio" title="Я умею" caption="рынок: ну допустим" compact />
                      <MemePoster kind="skill" title="Вот мой кейс" caption="рынок: уже интересно" compact />
                    </div>
                  </motion.div>
                </div>
              </Screen>
            )}

            {phase === 1 && (
              <Screen key="profession">
                <Title eyebrow="Раунд 1" title="Выбери профессию" text="Мини-игра сложнее под разные сферы: у каждой свой маршрут, кейс, ошибки и правки." />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {professions.map((item, index) => (
                    <ProfessionCard key={item.id} item={item} active={professionId === item.id} delay={index * 0.03} onClick={() => chooseProfession(item)} reduceMotion={reduceMotion} />
                  ))}
                </div>
                <Footer>
                  <PrimaryButton disabled={!professionId} onClick={() => setPhase(2)}>Собрать маршрут</PrimaryButton>
                </Footer>
              </Screen>
            )}

            {phase === 2 && (
              <Screen key="route">
                <Title eyebrow="Раунд 2" title="Собери правильный маршрут работы" text="Это не тест: ты строишь процесс. Ошибешься в порядке - кейс развалится." />
                <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                  <RouteBoard slots={routeSlots} route={profession.route} />
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[...profession.route, ...profession.traps].sort().map((label, index) => (
                      <TapCard key={label} label={label} index={index} active={routeSlots.includes(label)} onClick={() => tapRoute(label)} reduceMotion={reduceMotion} />
                    ))}
                  </div>
                </div>
                <Footer>
                  <PrimaryButton disabled={routeSlots.length < profession.route.length} onClick={() => setPhase(3)}>Открыть кейс-рейд</PrimaryButton>
                </Footer>
              </Screen>
            )}

            {phase === 3 && (
              <Screen key="assets">
                <Title eyebrow="Раунд 3" title="Кейс-рейд: 6 ходов, нужен сильный кейс" text={profession.quest} />
                <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                  <CaseBoard profession={profession} selected={caseAssets} />
                  <div className="grid gap-3 sm:grid-cols-2">
                    {profession.assets.map((asset, index) => (
                      <AssetCard key={asset.id} asset={asset} index={index} active={caseAssets.includes(asset.id)} disabled={moves <= 0 || caseAssets.length >= 4} onClick={() => pickAsset(asset.id)} reduceMotion={reduceMotion} />
                    ))}
                  </div>
                </div>
                <Footer>
                  <PrimaryButton disabled={!caseReady} onClick={() => setPhase(4)}>Отдать наставнику</PrimaryButton>
                </Footer>
              </Screen>
            )}

            {phase === 4 && (
              <Screen key="hotspots">
                <Title eyebrow="Раунд 4" title="Найди слабые места на работе" text="Тапай прямо по проблемам на макете. Нужно исправить два настоящих слабых места." />
                <div className="grid gap-4 lg:grid-cols-[1fr_0.92fr]">
                  <HotspotBoard profession={profession} fixed={fixedHotspots} onTap={tapHotspot} />
                  <div className="space-y-3">
                    <MemePoster kind="mentor" title="Наставник" caption={profession.mentorLine} />
                    <div className="rounded-3xl border border-emerald-300/25 bg-emerald-400/10 p-4">
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-100">Исправлено</p>
                      <p className="mt-2 text-2xl font-black">{fixedHotspots.length}/2</p>
                      <p className="mt-2 text-sm text-white/62">Правки превращают попытку в работу, которую можно показать.</p>
                    </div>
                  </div>
                </div>
                <Footer>
                  <PrimaryButton disabled={!repairReady} onClick={() => setPhase(5)}>Идти к боссу</PrimaryButton>
                </Footer>
              </Screen>
            )}

            {phase === 5 && (
              <Screen key="boss">
                <Title eyebrow="Финал" title="Босс-файт: «Без опыта не берем»" text="Босс задает вопросы. Бей доказательствами в правильном порядке." />
                <div className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
                  <div className="space-y-3">
                    <MemePoster kind="boss" title={bossRound >= 3 ? "Босс повержен" : "Без опыта не берем"} caption={bossRound >= 3 ? "кейс сильнее слов" : bossRounds[bossRound].question} />
                    <BossHp hp={bossRound >= 3 ? 0 : clamp(100 - bossRound * 34)} />
                    <MemePoster kind="employer" title="Работодатель" caption={bossRound >= 3 ? "так, это можно смотреть" : "покажи результат"} compact />
                  </div>
                  <div className="space-y-3">
                    <MemePoster kind="skill" title="Твой арсенал" caption={profession.caseTitle} />
                    {bossRound < 3 ? (
                      <div className="grid gap-3">
                        {bossRounds.map((round, index) => (
                          <motion.button key={round.attack} type="button" whileTap={{ scale: 0.96 }} onClick={() => attackBoss(index)} className={cn("min-h-14 rounded-2xl border p-4 text-left font-black transition active:bg-white/[0.1]", index === bossRound ? "border-fuchsia-300/60 bg-fuchsia-400/12" : "border-white/12 bg-white/[0.06]")}>
                            {round.attack}
                          </motion.button>
                        ))}
                      </div>
                    ) : (
                      <motion.div {...pop(0, reduceMotion)} className="space-y-3">
                        <MemePoster kind="money" title="Кейс разблокирован" caption="теперь есть что показать" />
                        <PrimaryButton onClick={() => setPhase(6)}>Активировать Skill ID</PrimaryButton>
                      </motion.div>
                    )}
                  </div>
                </div>
              </Screen>
            )}

            {phase === 6 && (
              <Screen key="final">
                <Burst />
                <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr] lg:items-start">
                  <SkillIdCard profession={profession} stats={stats} />
                  <div className="space-y-3">
                    <Title eyebrow="Победа" title="Вот что делает SkillBarter" text="SkillBarter это проект где вы сможете зарабатывать учиться и получить работу проще выполняя настоящие задачи!" />
                    <div className="grid gap-3 sm:grid-cols-3">
                      <MemePoster kind="money" title="Заработок" caption="кейс проще продать" compact />
                      <MemePoster kind="employer" title="Работа" caption="есть результат" compact />
                      <MemePoster kind="mentor" title="Рост" caption="правки усиливают" compact />
                    </div>
                    <div className="rounded-3xl border border-fuchsia-300/25 bg-fuchsia-400/10 p-4 text-lg font-black">
                      Не просто «я умею». А «вот что я сделал».
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <LinkButton href="/access">Открыть MVP</LinkButton>
                      <SecondaryButton onClick={restart}>
                        <RefreshCcw className="h-4 w-4" />
                        Еще раз
                      </SecondaryButton>
                      <SecondaryButton onClick={shareQuest}>{message && shared ? "Ссылка готова" : "Показать другу"}</SecondaryButton>
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

function Hud({ stats, combo, moves }: { stats: { trust: number; casePower: number; chance: number }; combo: number; moves: number | null }) {
  return (
    <div className="relative z-10 grid gap-2 rounded-2xl border border-white/10 bg-white/[0.05] p-3 sm:grid-cols-[1fr_1fr_1fr_auto_auto]">
      <Meter label="Доверие" value={stats.trust} />
      <Meter label="Сила кейса" value={stats.casePower} />
      <Meter label="Шанс" value={stats.chance} />
      <Badge label="combo" value={`x${combo}`} />
      {moves !== null && <Badge label="ходы" value={String(moves)} />}
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
      {["Учусь", "Делаю задачу", "Получаю правку", "Собираю Skill ID"].map((item, index) => (
        <motion.span key={item} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="rounded-full border border-fuchsia-300/25 bg-fuchsia-300/10 px-3 py-1 text-xs font-bold text-fuchsia-100">
          {item}
        </motion.span>
      ))}
    </div>
  );
}

function ProfessionCard({ item, active, delay, onClick, reduceMotion }: { item: Profession; active: boolean; delay: number; onClick: () => void; reduceMotion: boolean | null }) {
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

function RouteBoard({ slots, route }: { slots: string[]; route: string[] }) {
  return (
    <div className="rounded-3xl border border-fuchsia-300/25 bg-fuchsia-400/[0.08] p-4">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-fuchsia-100">Маршрут кейса</p>
      <div className="mt-4 grid gap-3">
        {route.map((step, index) => (
          <motion.div key={step} layout className={cn("rounded-2xl border p-4", slots[index] ? "border-emerald-300/55 bg-emerald-400/12" : "border-dashed border-white/15 bg-black/20")}>
            <p className="text-sm font-black">{index + 1}. {slots[index] ?? "выбери правильный шаг"}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function CaseBoard({ profession, selected }: { profession: Profession; selected: string[] }) {
  return (
    <div className="rounded-3xl border border-fuchsia-300/25 bg-fuchsia-400/[0.08] p-4">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-fuchsia-100">Кейс-рейд</p>
      <h3 className="mt-2 text-2xl font-black">{profession.caseTitle}</h3>
      <div className="mt-4 grid gap-3">
        {[0, 1, 2, 3].map((slot) => {
          const asset = profession.assets.find((item) => item.id === selected[slot]);
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

function HotspotBoard({ profession, fixed, onTap }: { profession: Profession; fixed: string[]; onTap: (id: string) => void }) {
  return (
    <div className="relative min-h-[460px] overflow-hidden rounded-[2rem] border border-white/12 bg-white/[0.06] p-4">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-fuchsia-100">Макет работы</p>
      <h3 className="mt-2 text-2xl font-black">{profession.caseTitle}</h3>
      <div className="absolute inset-x-8 bottom-8 top-24 rounded-[2rem] border border-white/14 bg-black/24 p-5">
        <div className="h-8 rounded-xl bg-white/10" />
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="h-28 rounded-2xl bg-fuchsia-300/12" />
          <div className="h-28 rounded-2xl bg-emerald-300/12" />
        </div>
        <div className="mt-5 h-12 rounded-2xl bg-white/10" />
      </div>
      {profession.hotspots.map((spot) => (
        <motion.button key={spot.id} type="button" whileTap={{ scale: 0.92 }} onClick={() => onTap(spot.id)} className={cn("absolute min-h-11 rounded-full border px-3 py-2 text-xs font-black", fixed.includes(spot.id) ? "border-emerald-300/70 bg-emerald-400/20 text-emerald-50" : "border-amber-300/60 bg-amber-400/18 text-amber-50")} style={{ left: spot.x, top: spot.y }}>
          {fixed.includes(spot.id) ? "✓ " : "!"}
          {spot.title}
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

function AssetCard({ asset, active, disabled, index, onClick, reduceMotion }: { asset: Profession["assets"][number]; active: boolean; disabled: boolean; index: number; onClick: () => void; reduceMotion: boolean | null }) {
  return (
    <motion.button type="button" initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: active ? 0.58 : 1, y: 0, scale: active ? 0.95 : 1, x: active && !asset.good ? [0, -4, 4, -2, 0] : 0 }} transition={{ delay: index * 0.025 }} whileTap={{ scale: 0.96 }} onClick={onClick} disabled={active || disabled} className={cn("min-h-24 rounded-2xl border p-4 text-left transition active:bg-white/[0.1]", active && asset.good ? "border-emerald-300/70 bg-emerald-400/12" : active && !asset.good ? "border-amber-300/70 bg-amber-400/12" : "border-white/12 bg-white/[0.06]")}>
      <p className="text-sm font-black">{asset.title}</p>
      <p className="mt-2 text-xs text-white/52">{asset.note}</p>
    </motion.button>
  );
}

function SkillIdCard({ profession, stats }: { profession: Profession; stats: { trust: number; casePower: number; chance: number } }) {
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
    mentor: ":D",
    market: "👀",
    employer: "o_O",
    portfolio: "T_T",
    skill: "★_★",
    money: "$_$",
  };
  const palette: Record<MemeKind, string> = {
    boss: "border-red-300/35 bg-red-500/10",
    mentor: "border-sky-300/35 bg-sky-400/10",
    market: "border-fuchsia-300/35 bg-fuchsia-400/10",
    employer: "border-violet-300/35 bg-violet-400/10",
    portfolio: "border-amber-300/35 bg-amber-400/10",
    skill: "border-emerald-300/35 bg-emerald-400/10",
    money: "border-lime-300/35 bg-lime-400/10",
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
