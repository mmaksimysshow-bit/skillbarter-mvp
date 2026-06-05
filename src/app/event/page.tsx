"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChefHat, Code2, Fingerprint, GraduationCap, HeartHandshake, Palette, RefreshCcw, Scale, ShieldCheck, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Phase = 0 | 1 | 2 | 3 | 4 | 5;
type SkillId = "code" | "design" | "cook" | "teach" | "psy" | "law";

type Skill = {
  id: SkillId;
  title: string;
  icon: LucideIcon;
  mission: string;
  chaos: string[];
  proof: string[];
  weakSpots: string[];
  repairs: Record<string, string>;
  decoyRepairs: string[];
  mentor: string;
  result: string;
};

const skills: Skill[] = [
  {
    id: "code",
    title: "Программирование",
    icon: Code2,
    mission: "Собери доказательства, что страница заявки реально работает, а не просто красиво светится.",
    chaos: ["мёртвая кнопка", "неоновый фон", "ошибка 404", "форма без отправки", "скрин успеха", "адаптив 390px", "описание результата", "запись заявки", "папка FINAL_v9"],
    proof: ["скрин успеха", "адаптив 390px", "описание результата", "запись заявки"],
    weakSpots: ["форма не отправляет", "нет мобильной проверки", "не показан результат"],
    repairs: {
      "форма не отправляет": "добавить состояние успешной отправки",
      "нет мобильной проверки": "показать скрин на телефоне 390px",
      "не показан результат": "описать, какую заявку получает бизнес",
    },
    decoyRepairs: ["добавить ещё свечения", "переименовать кнопку", "сказать что всё работает"],
    mentor: "Покажи рабочую заявку: форма, успех, мобильная версия. Тогда это не код в стол, а кейс.",
    result: "Рабочая страница заявки",
  },
  {
    id: "design",
    title: "Дизайн",
    icon: Palette,
    mission: "Спаси первый экран от визуального шума и докажи, что дизайн помогает человеку понять действие.",
    chaos: ["17 шрифтов", "понятный заголовок", "кнопка действия", "куб ради куба", "мелкий текст", "мобильный скрин", "польза на первом экране", "градиент судьбы"],
    proof: ["понятный заголовок", "кнопка действия", "мобильный скрин", "польза на первом экране"],
    weakSpots: ["кнопка потерялась", "польза не видна", "слишком много шума"],
    repairs: {
      "кнопка потерялась": "оставить один главный CTA",
      "польза не видна": "переписать заголовок через результат",
      "слишком много шума": "убрать лишний декор и эффекты",
    },
    decoyRepairs: ["добавить 3D-куб", "сделать текст мельче", "поставить ещё два шрифта"],
    mentor: "Оставь один фокус: заголовок, польза, кнопка. Если человек понял за 5 секунд — это кейс.",
    result: "Первый экран с понятным CTA",
  },
  {
    id: "cook",
    title: "Поварское дело",
    icon: ChefHat,
    mission: "Преврати «вкусно, отвечаю» в блюдо, которое можно повторить, оценить и показать.",
    chaos: ["просто вкусно", "состав", "технология", "фото подачи", "секрет шефа", "время готовки", "авторское вайбово", "пустая тарелка"],
    proof: ["состав", "технология", "фото подачи", "время готовки"],
    weakSpots: ["нет технологии", "нет состава", "нет подачи"],
    repairs: {
      "нет технологии": "описать шаги приготовления",
      "нет состава": "добавить ингредиенты и граммовки",
      "нет подачи": "показать фото и идею сервировки",
    },
    decoyRepairs: ["написать просто вкусно", "назвать блюдо авторским", "добавить красивую легенду"],
    mentor: "Кейс в поварском деле — это состав, технология, время и подача. Эмоция хорошо, но доказательство сильнее.",
    result: "Блюдо для меню кафе",
  },
  {
    id: "teach",
    title: "Педагогика",
    icon: GraduationCap,
    mission: "Сделай так, чтобы новичок не просто кивнул, а реально понял тему.",
    chaos: ["42 термина", "пример из жизни", "мини-вопрос", "простые слова", "ну очевидно же", "план урока", "ученик кивнул", "проверка понимания"],
    proof: ["пример из жизни", "мини-вопрос", "простые слова", "проверка понимания"],
    weakSpots: ["нет проверки", "слишком сложно", "нет примера"],
    repairs: {
      "нет проверки": "добавить мини-вопрос после объяснения",
      "слишком сложно": "заменить термины простыми словами",
      "нет примера": "добавить пример из жизни",
    },
    decoyRepairs: ["сказать это очевидно", "добавить ещё терминов", "ускорить объяснение"],
    mentor: "Сильный педагогический кейс показывает: было сложно, ты объяснил, человек понял и выполнил мини-задание.",
    result: "Мини-урок для новичка",
  },
  {
    id: "psy",
    title: "Психология",
    icon: HeartHandshake,
    mission: "Покажи этичную коммуникацию: сначала понять запрос, а не включать режим «сейчас всё решу».",
    chaos: ["диагноз за 5 секунд", "уточняющий вопрос", "границы общения", "совет без запроса", "бережное резюме", "давление мнением", "этика", "внутренний эксперт"],
    proof: ["уточняющий вопрос", "границы общения", "бережное резюме", "этика"],
    weakSpots: ["нет границ", "не уточнён запрос", "слишком быстрый совет"],
    repairs: {
      "нет границ": "обозначить безопасные рамки общения",
      "не уточнён запрос": "задать уточняющий вопрос",
      "слишком быстрый совет": "сначала отразить и уточнить ситуацию",
    },
    decoyRepairs: ["поставить диагноз", "надавить авторитетом", "решить за человека"],
    mentor: "В учебной ситуации важно показать коммуникацию, этику и границы. Не лечение, не диагноз, а профессиональный разбор запроса.",
    result: "Этичный коммуникационный кейс",
  },
  {
    id: "law",
    title: "Юриспруденция",
    icon: Scale,
    mission: "Собери позицию, которая держится на фактах и основании, а не на громком голосе.",
    chaos: ["обещание победы", "факты ситуации", "документы", "громкий голос", "правовое основание", "логика позиции", "игнор бумаг", "уверенный монолог"],
    proof: ["факты ситуации", "документы", "правовое основание", "логика позиции"],
    weakSpots: ["нет фактов", "нет основания", "документы не разобраны"],
    repairs: {
      "нет фактов": "собрать факты по порядку",
      "нет основания": "найти норму или основание позиции",
      "документы не разобраны": "проверить документы и даты",
    },
    decoyRepairs: ["обещать победу", "говорить увереннее", "игнорировать документы"],
    mentor: "Правовой кейс — это факты, документы и основание. Без обещаний результата и магии уверенного тона.",
    result: "Аргументированная позиция",
  },
];

const goals = ["Заказы", "Работа", "Портфолио", "Рост"];

const memeImages = [
  {
    title: "рынок смотрит",
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/Disapproving_face.jpg",
    caption: "когда вместо кейса снова «я умею»",
    fallback: "😐",
  },
  {
    title: "босс злится",
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/Rage_face.png",
    caption: "без пруфов он не пропускает",
    fallback: "😤",
  },
  {
    title: "live reaction",
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/Surprised_face.jpg",
    caption: "работодатель увидел Skill ID",
    fallback: "👀",
  },
];

export default function EventPage() {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>(0);
  const [skillId, setSkillId] = useState<SkillId>("code");
  const [goal, setGoal] = useState("Заказы");
  const [scan, setScan] = useState(0);
  const [holding, setHolding] = useState(false);
  const [caught, setCaught] = useState<string[]>([]);
  const [misses, setMisses] = useState(0);
  const [fixed, setFixed] = useState<string[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<string | null>(null);
  const [repairMistakes, setRepairMistakes] = useState(0);
  const [screamer, setScreamer] = useState(false);
  const [bossHp, setBossHp] = useState(100);
  const [bar, setBar] = useState(0);
  const [message, setMessage] = useState("Собери навык, докажи его кейсом и выбей возможность.");
  const [surrendered, setSurrendered] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState("");
  const [roasts, setRoasts] = useState<Array<{ id: number; text: string }>>([]);
  const [shakeReady, setShakeReady] = useState(true);
  const [clapMode, setClapMode] = useState(false);
  const barRef = useRef(0);
  const barDirectionRef = useRef(1);
  const audioRef = useRef<AudioContext | null>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const fartRef = useRef<HTMLAudioElement | null>(null);
  const shakeRef = useRef<HTMLAudioElement | null>(null);
  const lastShakeRef = useRef(0);
  const clapTimeoutRef = useRef<number | null>(null);
  const musicFadeRef = useRef<number | null>(null);
  const vibrationLoopRef = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const skill = useMemo(() => skills.find((item) => item.id === skillId) ?? skills[0], [skillId]);
  const requiredProofs = Math.min(4, skill.proof.length);
  const score = Math.min(100, 30 + caught.length * 10 + fixed.length * 12 + (100 - bossHp) / 2 - misses * 4);
  const repairOptions = useMemo(() => {
    if (!selectedSpot) return [];
    return buildRepairOptions(skill, selectedSpot);
  }, [selectedSpot, skill]);

  useEffect(() => {
    return () => {
      if (clapTimeoutRef.current) window.clearTimeout(clapTimeoutRef.current);
      if (musicFadeRef.current) cancelAnimationFrame(musicFadeRef.current);
      if (vibrationLoopRef.current) window.clearInterval(vibrationLoopRef.current);
      if (typeof navigator !== "undefined") navigator.vibrate?.(0);
      stopMusic();
      stopCamera();
    };
  }, []);

  useEffect(() => {
    if (!holding || phase !== 1) return;
    const timer = window.setInterval(() => {
      setScan((value) => {
        const next = Math.min(100, value + 4);
        if (next >= 100) {
          setHolding(false);
          setMessage("Навык заряжен. Теперь поймай доказательства, пока рынок не уснул.");
          setTimeout(() => setPhase(2), 450);
        }
        return next;
      });
    }, 55);
    return () => window.clearInterval(timer);
  }, [holding, phase]);

  useEffect(() => {
    if (phase !== 4 || bossHp <= 0) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const delta = Math.min(32, now - last);
      last = now;
      setBar((value) => {
        let next = value + barDirectionRef.current * delta * 0.12;
        if (next >= 100) {
          next = 100;
          barDirectionRef.current = -1;
        }
        if (next <= 0) {
          next = 0;
          barDirectionRef.current = 1;
        }
        barRef.current = next;
        return next;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, bossHp]);

  useEffect(() => {
    if (!shakeReady || typeof window === "undefined") return;
    const onMotion = (event: DeviceMotionEvent) => {
      const acceleration = event.accelerationIncludingGravity ?? event.acceleration;
      if (!acceleration) return;
      const x = acceleration.x ?? 0;
      const y = acceleration.y ?? 0;
      const z = acceleration.z ?? 0;
      const force = Math.sqrt(x * x + y * y + z * z);
      const now = Date.now();
      if (force < 27 || now - lastShakeRef.current < 1800) return;
      lastShakeRef.current = now;
      triggerClapMode();
    };
    window.addEventListener("devicemotion", onMotion);
    return () => window.removeEventListener("devicemotion", onMotion);
    // The handler intentionally uses the latest refs/state setters without re-subscribing on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shakeReady]);

  const restart = () => {
    setPhase(0);
    setSkillId("code");
    setGoal("Заказы");
    setScan(0);
    setHolding(false);
    setCaught([]);
    setMisses(0);
    setFixed([]);
    setSelectedSpot(null);
    setRepairMistakes(0);
    setScreamer(false);
    setBossHp(100);
    setBar(0);
    barRef.current = 0;
    barDirectionRef.current = 1;
    setMessage("Собери навык, докажи его кейсом и выбей возможность.");
    setSurrendered(false);
    setPhoto(null);
    setCameraError("");
    setRoasts([]);
    stopCamera();
  };

  const startGame = () => {
    initAudio();
    startMusic();
    void enableShakeMode(false);
    playTone(540, 0.08, "triangle", 0.06);
    setMessage("Выбери цель и сферу. Потом игра начнётся.");
    setPhase(1);
  };

  const catchArtifact = (item: string) => {
    const good = skill.proof.includes(item);
    if (!good) {
      setMisses((value) => value + 1);
      setCaught([]);
      const burn = roast();
      setMessage(`${randomBad(item)} ${burn} Раунд сброшен: собери пруфы заново.`);
      spawnRoast(burn);
      playFart();
      if (typeof navigator !== "undefined") navigator.vibrate?.(22);
      return;
    }
    if (caught.includes(item)) return;
    setCaught((value) => [...value, item]);
    setMessage(randomGood(item));
    playClick();
    if (caught.length + 1 >= requiredProofs) {
      setTimeout(() => {
        setScreamer(true);
        playScreamer();
        if (typeof navigator !== "undefined") navigator.vibrate?.([30, 20, 30]);
      }, 550);
      setTimeout(() => {
        setScreamer(false);
        setMessage("Работодатель появился внезапно. Теперь быстро чини слабые места кейса.");
        setPhase(3);
      }, 1650);
    }
  };

  const selectSpot = (spot: string) => {
    if (fixed.includes(spot)) return;
    setSelectedSpot(spot);
    setMessage(`Проблема выбрана: ${spot}. Теперь подбери правку, которая реально чинит кейс.`);
  };

  const applyRepair = (repair: string) => {
    if (!selectedSpot || fixed.includes(selectedSpot)) return;
    const correct = skill.repairs[selectedSpot] === repair;
    if (!correct) {
      setRepairMistakes((value) => value + 1);
      setMisses((value) => value + 1);
      setFixed([]);
      setSelectedSpot(null);
      const burn = roast();
      setMessage(`Наставник: не то. «${repair}» проблему не чинит. ${burn} Ремонт сброшен к нулю.`);
      spawnRoast(burn);
      playFart();
      if (typeof navigator !== "undefined") navigator.vibrate?.(18);
      return;
    }
    const repairedSpot = selectedSpot;
    setFixed((value) => [...value, repairedSpot]);
    setSelectedSpot(null);
    setMessage(`Правка принята: ${repair}. ${skill.mentor}`);
    playSuccess();
    if (fixed.length + 1 >= 3) {
      setTimeout(() => {
        setMessage("Кейс отремонтирован. Остался босс «без опыта не берём».");
        setPhase(4);
      }, 850);
    }
  };

  const hitBoss = () => {
    const currentBar = barRef.current;
    const perfect = currentBar >= 49 && currentBar <= 52;
    if (!perfect) {
      setMisses((value) => value + 1);
      setBossHp(100);
      setBar(0);
      barRef.current = 0;
      barDirectionRef.current = 1;
      const burn = roast();
      setMessage(`Промах (${Math.round(currentBar)}%). ${burn} Босс полностью восстановился: бей только по белой линии.`);
      spawnRoast(burn);
      playFart();
      if (typeof navigator !== "undefined") navigator.vibrate?.(25);
      return;
    }
    setBossHp((hp) => {
      const next = Math.max(0, hp - 34);
      if (next <= 0) setTimeout(() => setPhase(5), 700);
      return next;
    });
    setMessage("Чистое попадание. Кейс ударил прямо по фразе «без опыта не берём».");
    playSuccess();
  };

  const surrender = () => {
    setSurrendered(true);
    setMessage("Сдался? Ладно, бот, Skill ID всё равно покажем, но сверху будет позорная печать.");
    spawnRoast("Сдался бот. Но хотя бы честный.");
    playFart();
    setTimeout(() => setPhase(5), 360);
  };

  const spawnRoast = (text: string) => {
    const id = Date.now() + Math.random();
    setRoasts((items) => [...items.slice(-2), { id, text: text.toUpperCase() }]);
    window.setTimeout(() => {
      setRoasts((items) => items.filter((item) => item.id !== id));
    }, 3000);
  };

  const initAudio = () => {
    if (audioRef.current || typeof window === "undefined") return;
    const AudioCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtor) return;
    audioRef.current = new AudioCtor();
    fartRef.current = new Audio("/sounds/fart-with-reverb.mp3");
    fartRef.current.preload = "none";
    fartRef.current.volume = 0.72;
    shakeRef.current = new Audio("/sounds/the-last-67.mp3");
    shakeRef.current.preload = "none";
    shakeRef.current.volume = 0.78;
  };

  const playTone = (frequency: number, duration = 0.08, type: OscillatorType = "sine", volume = 0.04) => {
    const audio = audioRef.current;
    if (!audio) return;
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(volume, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + duration);
    osc.connect(gain);
    gain.connect(audio.destination);
    osc.start();
    osc.stop(audio.currentTime + duration);
  };

  const playClick = () => {
    playTone(760, 0.045, "square", 0.035);
    window.setTimeout(() => playTone(1180, 0.04, "triangle", 0.025), 45);
  };
  const playSuccess = () => {
    playTone(620, 0.08, "triangle", 0.04);
    window.setTimeout(() => playTone(930, 0.1, "triangle", 0.035), 80);
  };
  const playFart = () => {
    const fart = fartRef.current;
    if (fart) {
      fart.currentTime = 0;
      void fart.play().catch(() => {
        playTone(86, 0.16, "sawtooth", 0.06);
      });
      return;
    }
    playTone(86, 0.16, "sawtooth", 0.06);
  };
  const playScreamer = () => {
    playTone(80, 0.12, "sawtooth", 0.08);
    window.setTimeout(() => playTone(980, 0.18, "square", 0.075), 90);
  };

  const fadeMusicVolume = (target: number, duration = 260) => {
    const music = musicRef.current;
    if (!music) return;
    if (musicFadeRef.current) cancelAnimationFrame(musicFadeRef.current);
    const start = music.volume;
    const startedAt = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      music.volume = start + (target - start) * progress;
      if (progress < 1) {
        musicFadeRef.current = requestAnimationFrame(tick);
      } else {
        musicFadeRef.current = null;
      }
    };
    musicFadeRef.current = requestAnimationFrame(tick);
  };

  const stopStrongVibration = () => {
    if (vibrationLoopRef.current) {
      window.clearInterval(vibrationLoopRef.current);
      vibrationLoopRef.current = null;
    }
    if (typeof navigator !== "undefined") navigator.vibrate?.(0);
  };

  const startStrongVibration = () => {
    if (typeof navigator === "undefined" || !navigator.vibrate) return;
    stopStrongVibration();
    const pattern = [180, 45, 180, 45, 260, 60];
    navigator.vibrate(pattern);
    vibrationLoopRef.current = window.setInterval(() => {
      navigator.vibrate(pattern);
    }, 770);
  };

  const playShake67 = () => {
    const sound = shakeRef.current;
    if (sound) {
      sound.currentTime = 0;
      const playback = sound.play();
      if (playback) void playback.catch(() => {
        playTone(67, 0.22, "sawtooth", 0.08);
        window.setTimeout(() => playTone(134, 0.18, "square", 0.05), 120);
      });
      return;
    }
    playTone(67, 0.22, "sawtooth", 0.08);
  };

  const triggerClapMode = () => {
    if (clapTimeoutRef.current) window.clearTimeout(clapTimeoutRef.current);
    setClapMode(true);
    fadeMusicVolume(0.015, 180);
    startStrongVibration();
    const sound = shakeRef.current;
    const closeClapMode = () => {
      setClapMode(false);
      stopStrongVibration();
      fadeMusicVolume(0.13, 420);
    };
    if (sound) {
      sound.onended = closeClapMode;
      playShake67();
      const duration = Number.isFinite(sound.duration) && sound.duration > 0 ? sound.duration * 1000 + 180 : 4200;
      clapTimeoutRef.current = window.setTimeout(closeClapMode, duration);
      return;
    }
    playShake67();
    clapTimeoutRef.current = window.setTimeout(closeClapMode, 4200);
  };

  const enableShakeMode = async (showFeedback = true) => {
    initAudio();
    if (typeof window === "undefined") return;
    const MotionEventWithPermission = window.DeviceMotionEvent as typeof DeviceMotionEvent & {
      requestPermission?: () => Promise<"granted" | "denied">;
    };
    try {
      if (typeof MotionEventWithPermission?.requestPermission === "function") {
        const permission = await MotionEventWithPermission.requestPermission();
        if (permission !== "granted") {
          setMessage("Браузер не дал доступ к тряске. 67-режим пока в засаде.");
          return;
        }
      }
      setShakeReady(true);
      if (showFeedback) {
        setMessage("67-режим включён. Теперь потряси телефон: ладони выйдут на сцену.");
        triggerClapMode();
      }
    } catch {
      if (showFeedback) setMessage("67-режим не включился. На iPhone иногда нужно разрешить движение в Safari.");
    }
  };

  const startMusic = () => {
    if (musicRef.current) return;
    const music = new Audio("/sounds/background-song.mp3");
    music.preload = "none";
    music.crossOrigin = "anonymous";
    music.loop = true;
    music.volume = 0.13;
    musicRef.current = music;
    void music.play().catch(() => {
      musicRef.current = null;
      playTone(392, 0.2, "sine", 0.012);
    });
  };

  const stopMusic = () => {
    const music = musicRef.current;
    if (!music) return;
    music.pause();
    music.currentTime = 0;
    musicRef.current = null;
  };

  const startCamera = async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setCameraError("Камера не доступна в этом браузере.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraError("");
    } catch {
      setCameraError("Камера не включилась. Браузер сказал: нет.");
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const width = video.videoWidth || 480;
    const height = video.videoHeight || 480;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.filter = "none";
    ctx.drawImage(video, 0, 0, width, height);
    setPhoto(canvas.toDataURL("image/png"));
    stopCamera();
    playSuccess();
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#05030b] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-90px] top-[-60px] h-64 w-64 rounded-full bg-fuchsia-600/18 sm:bg-fuchsia-600/25 sm:blur-3xl" />
        <div className="absolute bottom-[-80px] right-[-90px] h-72 w-72 rounded-full bg-cyan-500/12 sm:bg-cyan-500/15 sm:blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] bg-[size:34px_34px] opacity-30" />
      </div>

      <section className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-6 pt-4 sm:px-6">
        <RoastBurst items={roasts} />
        {clapMode && <Clap67Overlay />}
        <header className="mb-4 rounded-[28px] border border-white/10 bg-white/[0.06] p-3 shadow-2xl shadow-violet-950/40 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-fuchsia-200">Skill ID Rush</p>
              <p className="truncate text-sm text-white/60">мини-игра: навык → кейс → доверие → возможность</p>
            </div>
            <div className="rounded-full border border-fuchsia-300/30 bg-fuchsia-400/10 px-3 py-2 text-xs font-black text-fuchsia-100">{phase + 1}/6</div>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-fuchsia-400 via-violet-300 to-cyan-300" animate={{ width: `${((phase + 1) / 6) * 100}%` }} transition={{ duration: reduceMotion ? 0 : 0.4 }} />
          </div>
        </header>

        <AnimatePresence mode="wait">
          {phase === 0 && (
            <Screen key="intro">
              <div className="grid flex-1 items-center gap-5 lg:grid-cols-[1fr_.9fr]">
                <div>
                  <Badge>не тест. маленький карьерный рейд.</Badge>
                  <motion.h1 className="mt-5 max-w-3xl text-4xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl" initial={{ opacity: 0, y: 22, clipPath: "inset(0 0 45% 0)" }} animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }} transition={{ duration: reduceMotion ? 0 : 0.7 }}>
                    У тебя есть навык. Но рынку нужны пруфы.
                  </motion.h1>
                  <p className="mt-5 max-w-2xl text-lg text-white/72 sm:text-xl">
                    За 60 секунд заряди навык, поймай доказательства, переживи работодателя-скримера и выбей Skill ID.
                  </p>
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <Meme title="Пустое «я умею»" face="😐" text="рынок: ну допустим" />
                    <Meme title="Кейс с правкой" face="👀" text="работодатель проснулся" />
                    <Meme title="Skill ID" face="⚡" text="теперь есть что показать" />
                  </div>
                  <InternetMemeWall />
                  <Primary className="mt-6 w-full sm:w-auto" onClick={startGame}>
                    Влететь в рейд <ArrowRight size={18} />
                  </Primary>
                </div>
                <div className="rounded-[34px] border border-white/10 bg-white/[0.055] p-5">
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-100">что будет</p>
                  {["зарядить навык удержанием", "ловить артефакты кейса", "получить скример от работодателя", "чинить слабые места", "побить босса таймингом", "открыть Skill ID"].map((item, index) => (
                    <motion.div key={item} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.06 }} className="mt-3 flex items-center gap-3 rounded-[22px] border border-white/10 bg-black/20 p-3">
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-fuchsia-400 to-cyan-300 font-black text-black">{index + 1}</span>
                      <span className="font-bold text-white/78">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Screen>
          )}

          {phase === 1 && (
            <Screen key="scan">
              <Title tag="Раунд 1" title="Выбери маршрут и заряди навык" text="Сначала цель и профессия. Потом удерживай кнопку, пока навык не зарядится до 100%." />
              <div className="grid gap-5 lg:grid-cols-2">
                <Panel title="Цель">
                  <div className="grid grid-cols-2 gap-3">
                    {goals.map((item) => (
                      <Choice key={item} active={goal === item} onClick={() => setGoal(item)}>{item}</Choice>
                    ))}
                  </div>
                </Panel>
                <Panel title="Профессия">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {skills.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button key={item.id} onClick={() => setSkillId(item.id)} className={`min-h-[96px] rounded-[24px] border p-4 text-left transition active:scale-[0.98] ${item.id === skillId ? "border-fuchsia-300 bg-fuchsia-400/15" : "border-white/10 bg-white/[0.055]"}`}>
                          <Icon className="mb-2 text-fuchsia-200" size={22} />
                          <p className="font-black">{item.title}</p>
                        </button>
                      );
                    })}
                  </div>
                </Panel>
              </div>
              <div className="mt-5 rounded-[34px] border border-white/10 bg-white/[0.06] p-5 text-center">
                <p className="text-lg font-black">{skill.title}: {skill.mission}</p>
                <div className="mx-auto mt-5 h-7 max-w-xl overflow-hidden rounded-full bg-black/35">
                  <motion.div className="h-full rounded-full bg-gradient-to-r from-fuchsia-400 to-cyan-300" animate={{ width: `${scan}%` }} />
                </div>
                <p className="mt-2 text-sm font-black text-cyan-100">заряд навыка: {scan}%</p>
                <button
                  onPointerDown={() => setHolding(true)}
                  onPointerUp={() => setHolding(false)}
                  onPointerLeave={() => setHolding(false)}
                  className="mt-5 min-h-16 w-full max-w-sm rounded-full bg-gradient-to-r from-fuchsia-400 to-cyan-300 px-6 text-lg font-black text-black shadow-[0_0_42px_rgba(217,70,239,.38)] active:scale-[0.98]"
                >
                  Удерживай, чтобы зарядить
                </button>
              </div>
            </Screen>
          )}

          {phase === 2 && (
            <Screen key="catch">
              <Title tag="Раунд 2" title="Лови пруфы, не мусор" text={`На экране хаос проекта. Тапай только то, что можно показать как доказательство навыка. Нужно ${requiredProofs} пруфа.`} />
              <div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
                <motion.div className="relative min-h-[520px] overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.055] p-4" animate={misses ? { x: [0, -4, 4, 0] } : { x: 0 }}>
                  {skill.chaos.map((item, index) => (
                    <motion.button
                      key={item}
                      onClick={() => catchArtifact(item)}
                      disabled={caught.includes(item)}
                      className="absolute rounded-[24px] border border-white/12 bg-black/55 px-4 py-3 text-left text-sm font-black shadow-xl shadow-black/30 transition active:scale-[0.94] disabled:opacity-35"
                      style={{ left: `${8 + ((index * 31) % 64)}%`, top: `${8 + ((index * 19) % 72)}%`, maxWidth: "190px" }}
                      animate={{ y: reduceMotion ? 0 : [0, index % 2 ? 42 : -42, 0], x: reduceMotion ? 0 : [0, index % 2 ? -24 : 24, 0], rotate: reduceMotion ? 0 : [0, index % 2 ? 5 : -5, 0] }}
                      transition={{ duration: 1.25 + (index % 3) * 0.18, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {caught.includes(item) ? "✅ " : "🎯 "}
                      {item}
                    </motion.button>
                  ))}
                </motion.div>
                <Panel title="Радар кейса">
                  <div className="space-y-4">
                    <Meme title="Реакция" face={misses > 1 ? "🫠" : "👀"} text={message} />
                    <Meter label="Пруфы" value={(caught.length / requiredProofs) * 100} />
                    <Meter label="Доверие" value={score} />
                    <p className="text-sm text-white/58">Поймано: {caught.length}/{requiredProofs}. Ошибки: {misses}</p>
                  </div>
                </Panel>
              </div>
              {screamer && <Screamer />}
            </Screen>
          )}

          {phase === 3 && (
            <Screen key="repair">
              <Title tag="Раунд 3" title="Ремонт кейса от наставника" text="Теперь не просто тыкай ошибки. Сначала выбери слабое место, потом подбери правку, которая реально его чинит." />
              <div className="grid gap-5 lg:grid-cols-[1.08fr_.92fr]">
                <div className="relative min-h-[520px] overflow-hidden rounded-[34px] border border-white/10 bg-gradient-to-br from-white/[0.12] to-white/[0.035] p-5">
                  <div className="rounded-[28px] border border-white/12 bg-black/25 p-5">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-fuchsia-100">черновик кейса</p>
                    <h2 className="mt-3 text-2xl font-black">{skill.result}</h2>
                    <div className="mt-5 grid gap-3">
                      <div className="h-14 rounded-2xl bg-white/10" />
                      <div className="h-24 rounded-2xl border border-dashed border-white/18 bg-white/[0.05]" />
                      <div className="h-12 w-2/3 rounded-full bg-fuchsia-400/18" />
                    </div>
                  </div>
                  {skill.weakSpots.map((spot, index) => (
                    <motion.button
                      key={spot}
                      onClick={() => selectSpot(spot)}
                      disabled={fixed.includes(spot)}
                      className={`absolute rounded-[24px] border px-3 py-2 text-xs font-black shadow-[0_0_34px_rgba(251,191,36,.28)] disabled:border-emerald-200/60 disabled:bg-emerald-400/18 ${selectedSpot === spot ? "border-fuchsia-200 bg-fuchsia-400/25 text-fuchsia-50" : "border-amber-200/70 bg-amber-300/18 text-amber-50"}`}
                      style={{ left: `${14 + index * 25}%`, top: `${34 + (index % 2) * 28}%` }}
                      animate={fixed.includes(spot) ? { scale: 1, x: 0, y: 0 } : { scale: [1, 1.08, 1], x: [0, index % 2 ? 86 : -72, index % 2 ? -54 : 68, 0], y: [0, index % 2 ? -58 : 62, index % 2 ? 64 : -48, 0] }}
                      transition={{ repeat: fixed.includes(spot) ? 0 : Infinity, duration: 1.35 + index * 0.12, ease: "easeInOut" }}
                    >
                      {fixed.includes(spot) ? "починено" : selectedSpot === spot ? "выбрано" : "сломано"}: {spot}
                    </motion.button>
                  ))}
                </div>
                <Panel title="Чат наставника">
                  <Meme title="Наставник" face="🧠" text={message} />
                  <div className="mt-4 rounded-[24px] border border-white/10 bg-black/20 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-fuchsia-100">выбранная проблема</p>
                    <p className="mt-2 text-lg font-black">{selectedSpot ?? "тапни слабое место на черновике"}</p>
                  </div>
                  {selectedSpot && (
                    <div className="mt-4 grid gap-3">
                      {repairOptions.map((repair, index) => (
                        <button key={repair} onClick={() => applyRepair(repair)} className="min-h-[68px] rounded-[22px] border border-white/10 bg-white/[0.06] p-3 text-left text-sm font-bold transition hover:border-cyan-200/40 active:scale-[0.97]">
                          <span className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-xs font-black">{index + 1}</span>
                          {repair}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 space-y-3">
                    {fixed.map((item) => <div key={item} className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-3 text-sm font-bold text-emerald-50">+ {item}</div>)}
                  </div>
                  <p className="mt-3 text-sm text-white/50">Ошибок в правках: {repairMistakes}</p>
                </Panel>
              </div>
            </Screen>
          )}

          {phase === 4 && (
            <Screen key="boss">
              <Title tag="Раунд 4" title="Босс-файт: «Без опыта не берём»" text="Теперь засчитывается только белая линия в центре. Серые зоны и края не считаются: босс вредный." />
              <div className="grid flex-1 items-center gap-5 lg:grid-cols-[.95fr_1.05fr]">
                <div className="rounded-[36px] border border-red-300/25 bg-red-500/10 p-5 text-center">
                  <Meme title={bossHp <= 0 ? "Босс повержен" : "Без опыта не берём"} face={bossHp <= 0 ? "💀" : "😤"} text={bossHp <= 0 ? "доказательства победили скепсис" : "покажи кейс, а не красивые обещания"} />
                  <div className="mt-5 h-6 overflow-hidden rounded-full bg-black/35">
                    <motion.div className="h-full bg-gradient-to-r from-red-400 to-fuchsia-300" animate={{ width: `${bossHp}%` }} />
                  </div>
                  <p className="mt-2 text-sm font-black text-white/48">HP босса: {bossHp}</p>
                </div>
                <Panel title="Тайминг удара">
                  <div className="relative h-12 overflow-hidden rounded-full bg-white/10">
                    <div className="absolute left-[44%] top-0 h-full w-[14%] bg-zinc-400/20" />
                    <div className="absolute left-[49%] top-0 h-full w-[3%] bg-emerald-300/30" />
                    <div className="absolute left-[50.5%] top-0 h-full w-[2px] bg-white shadow-[0_0_18px_rgba(255,255,255,.9)]" />
                    <div className="absolute top-0 h-full w-2 -translate-x-1/2 rounded-full bg-cyan-200 shadow-[0_0_24px_rgba(103,232,249,.8)]" style={{ left: `${bar}%` }} />
                  </div>
                  <p className="mt-2 text-center text-xs font-black uppercase tracking-[0.16em] text-white/50">попади в белую линию, не в серую область</p>
                  <Primary className="mt-5 w-full" onClick={hitBoss}>
                    Ударить кейсом <Zap size={18} />
                  </Primary>
                  <button onClick={surrender} className="mt-3 min-h-11 w-full rounded-full border border-red-300/30 bg-red-500/10 px-4 py-2 text-sm font-black text-red-100 transition active:scale-[0.98]">
                    Сдаться и получить позорный Skill ID
                  </button>
                  <Meme title="Боевой лог" face="⚔️" text={message} />
                </Panel>
              </div>
            </Screen>
          )}

          {phase === 5 && (
            <Screen key="final">
              <div className="grid flex-1 items-center gap-5 lg:grid-cols-[.9fr_1.1fr]">
                <div>
                  <Badge>финал</Badge>
                  <div className={`mt-4 inline-flex rounded-full px-4 py-2 text-sm font-black uppercase tracking-[0.16em] ${surrendered ? "bg-red-500 text-white shadow-[0_0_34px_rgba(239,68,68,.45)]" : "bg-emerald-400 text-black shadow-[0_0_34px_rgba(52,211,153,.35)]"}`}>
                    {surrendered ? "СДАЛСЯ БОТ" : "КРАСАВЧИК WW UwU"}
                  </div>
                  <h1 className="mt-4 text-4xl font-black leading-tight sm:text-6xl">SKILL ID ACTIVATED</h1>
                  <p className="mt-4 text-lg text-white/72">Не просто: «я умею». А: «вот что я сделал».</p>
                  <div className="mt-5 grid gap-3">
                    <Meme title={surrendered ? "Кейс открыт в режиме бота" : "Кейс разблокирован"} face={surrendered ? "🤖" : "⚡"} text={surrendered ? "Ты сдался, но понял механику: без кейса рынок не верит." : "Теперь навык можно показать заказчику, наставнику или работодателю."} />
                    <Meme title="Портфолио ожило" face="📁" text="Пустая папка больше не смотрит осуждающе." />
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
                  <div className="mt-5 grid gap-3">
                    <Info label="Цель" value={goal} />
                    <Info label="Направление" value={skill.title} />
                    <Info label="Кейс" value={skill.result} />
                    <Info label="Доверие" value={`${Math.round(score)}%`} />
                  </div>
                  <div className="mt-5 rounded-[28px] border border-white/10 bg-black/24 p-4">
                    <p className="text-sm font-black uppercase tracking-[0.16em] text-fuchsia-100">фото в Skill ID</p>
                    <div className="mt-3 overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.04]">
                      {photo ? (
                        <img src={photo} alt="Фото Skill ID" className="h-56 w-full object-cover" />
                      ) : (
                        <video ref={videoRef} muted playsInline className="h-56 w-full bg-black object-cover" />
                      )}
                    </div>
                    <canvas ref={canvasRef} className="hidden" />
                    {cameraError && <p className="mt-2 text-sm text-red-200">{cameraError}</p>}
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      <Secondary onClick={photo ? () => { setPhoto(null); startCamera(); } : startCamera}>{photo ? "Перефоткаться" : "Включить камеру"}</Secondary>
                      <Secondary onClick={capturePhoto}>Сфоткать Skill ID</Secondary>
                    </div>
                    <p className="mt-2 text-xs text-white/52">
                      {photo ? "Фото добавлено с мемным фильтром. Теперь это почти документ эпохи." : "Можно сделать фото, и оно появится прямо в твоём Skill ID."}
                    </p>
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <Benefit title="Заработок" text="с кейсом проще получить первый заказ" />
                    <Benefit title="Работа" text="работодатель видит результат" />
                    <Benefit title="Рост" text="наставник помогает докрутить работу" />
                  </div>
                  <p className="mt-5 rounded-[24px] border border-white/10 bg-black/20 p-4 text-sm leading-relaxed text-white/72">
                    SkillBarter это проект где вы сможете зарабатывать, учиться и получить работу проще, выполняя настоящие задачи. Ты проходишь уроки, делаешь реальные задания, получаешь правки наставников и собираешь Skill ID. Так навык превращается в кейс, кейс — в доверие, а доверие — в возможность.
                  </p>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <Link href="/access" className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-4 py-3 text-sm font-black text-black">Открыть MVP</Link>
                    <Secondary onClick={restart}><RefreshCcw size={16} /> Ещё раз</Secondary>
                  </div>
                </div>
              </div>
            </Screen>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}

function randomGood(item: string) {
  const messages = [
    `${item}: принято. Рынок перестал щуриться.`,
    `${item}: это уже похоже на работу, которую можно показать.`,
    `${item}: портфолио тихо сказало «спасибо».`,
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

function randomBad(item: string) {
  const messages = [
    `${item}: мем смешной, кейс слабый.`,
    `${item}: работодатель посмотрел и ушёл за кофе.`,
    `${item}: это вайб, но не доказательство.`,
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

function roast() {
  const lines = [
    "Фу бот, нажимай нормально.",
    "Ботяра, ты куда попал?",
    "Иван Золо бы сейчас заржал.",
    "Иван Золо на минималках.",
    "У Ивана Золо реакция быстрее.",
    "Маме такое не показывай.",
    "Мама сказала бы: выключай компьютер.",
    "Мама бы спросила: это мой чемпион?",
    "Мамкин киберспортсмен промахнулся.",
    "Мамкин speedrunner без speed.",
    "Фу, нубский клик.",
    "Лох-момент засчитан.",
    "Фу лох, соберись.",
    "Нажал как бот из 2012.",
    "Даже бот бы попал лучше.",
    "Бот на автопилоте и то умнее.",
    "Позорный тык.",
    "Фут, минус аура.",
    "Ты сейчас как лаг в Roblox.",
    "Руки в демо-версии.",
    "Кнопка тебя переиграла.",
    "Мышка подала на развод.",
    "Мама бы сказала: сынок, ну как так.",
    "Иван Золо момент, но без харизмы.",
    "Бот-режим активирован.",
    "Нубасик, попробуй ещё раз.",
    "Это был клик уровня табуретки.",
    "Ты промахнулся как Wi-Fi в лифте.",
    "Фу, кринжовый промах.",
    "Мама верит, но статистика нет.",
    "Мамка сказала не позориться, а ты опять.",
    "Мамкин Roblox-герой промахнулся.",
    "Иван Золо смотрит и молчит. Это хуже смеха.",
    "Иван Золо на твоём месте уже бы выиграл шоу.",
    "Бот, ты даже в Roblox obby упал бы на первом прыжке.",
    "Фу ботяра, Roblox тебя не простит.",
    "Мама спросит, зачем ты так нажал.",
    "Мамкин тащер снова не тащит.",
    "Иван Золо energy, но батарейка села.",
    "Ботский клик, мамка не одобрит.",
    "Roblox лагает меньше, чем твоя реакция.",
    "Мамка принесла чай, а ты принес промах.",
    "Иван Золо бы сказал: ну это база, но ты не база.",
    "Фу, мамкин чемпион по промахам.",
  ];
  return lines[Math.floor(Math.random() * lines.length)];
}

function RoastBurst({ items }: { items: Array<{ id: number; text: string }> }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-[80] overflow-hidden">
      <AnimatePresence>
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.35, y: 80, rotate: -14 }}
            animate={{ opacity: 1, scale: [0.35, 1.2, 1], y: 0, rotate: [index % 2 ? 12 : -12, index % 2 ? -5 : 5, 0], x: [0, -12, 12, 0] }}
            exit={{ opacity: 0, scale: 0.85, y: -70 }}
            className="absolute rounded-[28px] border-2 border-white/70 bg-red-600 px-5 py-4 text-center text-lg font-black leading-tight text-white shadow-[0_0_70px_rgba(239,68,68,.7)] sm:text-2xl"
            style={{ left: `${8 + index * 22}%`, top: `${30 + index * 14}%`, maxWidth: 360 }}
          >
            {item.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function buildRepairOptions(skill: Skill, spot: string) {
  const correct = skill.repairs[spot];
  const decoys = skill.decoyRepairs;
  const index = Math.max(0, skill.weakSpots.indexOf(spot));
  if (index % 3 === 0) return [decoys[1], correct, decoys[0], decoys[2]];
  if (index % 3 === 1) return [decoys[2], decoys[0], correct, decoys[1]];
  return [correct, decoys[1], decoys[2], decoys[0]];
}

function Clap67Overlay() {
  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[60] grid place-items-center overflow-hidden bg-black/72"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.12 }}
    >
      <motion.div
        className="absolute text-[34vw] font-black leading-none text-fuchsia-300/18 sm:text-[220px]"
        initial={{ scale: 0.4, rotate: -8, opacity: 0 }}
        animate={{ scale: [0.7, 1.2, 1], rotate: [-8, 5, 0], opacity: [0, 1, 0.55] }}
        transition={{ duration: 0.9, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      >
        67
      </motion.div>
      <div className="relative h-[320px] w-full max-w-[520px]">
        <motion.div
          className="absolute left-[8%] top-[18%] grid h-36 w-36 place-items-center rounded-[38px] border border-fuchsia-200/40 bg-fuchsia-400/18 text-7xl shadow-[0_0_55px_rgba(217,70,239,.45)] sm:h-44 sm:w-44 sm:text-8xl"
          initial={{ x: -180, y: 120, rotate: -28, scale: 0.7 }}
          animate={{ x: [0, 92, 12, 118], y: [90, -32, 28, -68], rotate: [-24, 18, -10, 20], scale: [0.85, 1.12, 0.96, 1.16] }}
          transition={{ duration: 0.72, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        >
          🫲
        </motion.div>
        <motion.div
          className="absolute right-[8%] bottom-[18%] grid h-36 w-36 place-items-center rounded-[38px] border border-cyan-200/40 bg-cyan-400/18 text-7xl shadow-[0_0_55px_rgba(34,211,238,.45)] sm:h-44 sm:w-44 sm:text-8xl"
          initial={{ x: 180, y: -120, rotate: 28, scale: 0.7 }}
          animate={{ x: [0, -92, -12, -118], y: [-90, 32, -28, 68], rotate: [24, -18, 10, -20], scale: [0.85, 1.12, 0.96, 1.16] }}
          transition={{ duration: 0.72, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        >
          🫱
        </motion.div>
        <motion.div
          className="absolute left-1/2 top-1/2 rounded-full border border-white/20 bg-white px-5 py-3 text-2xl font-black text-black shadow-[0_0_44px_rgba(255,255,255,.55)]"
          initial={{ x: "-50%", y: "-50%", scale: 0, rotate: -14 }}
          animate={{ x: "-50%", y: "-50%", scale: [0, 1.22, 1], rotate: [-14, 8, 0] }}
          transition={{ delay: 0.18, duration: 0.5, repeat: Infinity, repeatType: "mirror" }}
        >
          CLAP 67
        </motion.div>
      </div>
    </motion.div>
  );
}

function Screen({ children }: { children: React.ReactNode }) {
  return (
    <motion.div className="flex min-h-[calc(100vh-128px)] flex-col" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.26 }}>
      {children}
    </motion.div>
  );
}

function Title({ tag, title, text }: { tag: string; title: string; text: string }) {
  return (
    <div className="mb-5">
      <Badge>{tag}</Badge>
      <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight sm:text-5xl">{title}</h1>
      <p className="mt-3 max-w-3xl text-base text-white/68 sm:text-lg">{text}</p>
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

function Choice({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`min-h-14 rounded-[20px] border px-4 py-3 text-sm font-black transition active:scale-[0.98] ${active ? "border-cyan-200 bg-cyan-300/12 text-cyan-50" : "border-white/10 bg-white/[0.055] text-white"}`}>
      {children}
    </button>
  );
}

function Primary({ children, onClick, className = "" }: { children: React.ReactNode; onClick: () => void; className?: string }) {
  return (
    <button onClick={onClick} className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-400 to-cyan-300 px-6 py-3 text-sm font-black text-black shadow-[0_0_32px_rgba(217,70,239,.34)] transition hover:-translate-y-0.5 active:scale-[0.98] ${className}`}>
      {children}
    </button>
  );
}

function Secondary({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.07] px-4 py-3 text-sm font-black text-white transition active:scale-[0.98]">
      {children}
    </button>
  );
}

function Meme({ title, face, text }: { title: string; face: string; text: string }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.96, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="relative overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.07] p-4">
      <div className="absolute right-[-18px] top-[-26px] text-7xl opacity-20">{face}</div>
      <div className="flex items-start gap-3">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-fuchsia-200/25 bg-fuchsia-400/12 text-2xl">{face}</div>
        <div className="min-w-0">
          <p className="font-black">{title}</p>
          <p className="mt-1 break-words text-sm text-white/62">{text}</p>
        </div>
      </div>
    </motion.div>
  );
}

function InternetMemeWall() {
  return (
    <div className="mt-5 grid gap-3 sm:grid-cols-3">
      {memeImages.map((meme, index) => (
        <motion.div key={meme.title} initial={{ opacity: 0, y: 12, rotate: index % 2 ? 2 : -2 }} animate={{ opacity: 1, y: 0, rotate: index % 2 ? -1 : 1 }} transition={{ delay: index * 0.08 }} className="overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.06]">
          <div className="relative grid h-24 place-items-center bg-black/40">
            <div className="absolute text-5xl opacity-60">{meme.fallback}</div>
            <img src={meme.src} alt={meme.title} className="relative h-full w-full object-contain p-2" loading="lazy" referrerPolicy="no-referrer" onError={(event) => { event.currentTarget.style.display = "none"; }} />
          </div>
          <div className="p-3">
            <p className="text-sm font-black">{meme.title}</p>
            <p className="mt-1 text-xs text-white/58">{meme.caption}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs font-black uppercase tracking-[0.14em] text-white/52">
        <span>{label}</span>
        <span>{Math.round(value)}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <motion.div className="h-full rounded-full bg-gradient-to-r from-fuchsia-400 to-cyan-300" animate={{ width: `${Math.min(100, value)}%` }} />
      </div>
    </div>
  );
}

function Screamer() {
  return (
    <motion.div className="fixed inset-0 z-50 grid place-items-center bg-red-950/90 p-4" initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.92, 1] }} exit={{ opacity: 0 }}>
      <motion.div initial={{ scale: 0.08, rotate: -18 }} animate={{ scale: [0.08, 1.35, 0.92, 1.08], rotate: [-18, 10, -4, 0] }} transition={{ duration: 0.32 }} className="max-w-sm rounded-[36px] border border-red-200/70 bg-black p-6 text-center shadow-[0_0_120px_rgba(239,68,68,.8)]">
        <motion.div className="text-8xl" animate={{ scale: [1, 1.25, 1], rotate: [-4, 4, -4] }} transition={{ repeat: Infinity, duration: 0.16 }}>😳</motion.div>
        <h2 className="mt-3 text-3xl font-black text-red-100">РАБОТОДАТЕЛЬ!</h2>
        <p className="mt-2 text-white/76">«А где кейс посмотреть?»</p>
      </motion.div>
    </motion.div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3">
      <span className="text-white/48">{label}</span>
      <span className="text-right font-black">{value}</span>
    </div>
  );
}

function Benefit({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-3">
      <ShieldCheck className="mb-2 text-cyan-200" size={18} />
      <p className="font-black">{title}</p>
      <p className="mt-1 text-xs text-white/58">{text}</p>
    </div>
  );
}

