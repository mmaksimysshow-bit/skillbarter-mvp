"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Fingerprint,
  GraduationCap,
  Layers3,
  ListChecks,
  Sparkles,
  Users,
} from "lucide-react";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { GlassCard } from "@/components/ui/GlassCard";
import { landingHighlights, siteConfig } from "@/data/mock";
import { GlowBadge, Reveal, SectionTitle, StaggerGroup, StaggerItem } from "@/components/ui/motion";

const features = [
  {
    icon: Fingerprint,
    title: "Skill ID",
    text: "Профиль навыков растёт из реальных действий: уроки, задачи, подтверждённые кейсы и отзывы наставников.",
  },
  {
    icon: ListChecks,
    title: "Реальные задачи",
    text: "Вместо абстрактных тестов пользователь делает блоки, страницы, тексты и кейсы, которые можно показать в портфолио.",
  },
  {
    icon: Users,
    title: "Наставники",
    text: "Разборы, встречи и подтверждение кейсов происходят внутри одной платформы и сразу отражаются в Skill ID.",
  },
];

const audiences = [
  {
    title: "Студенты и джуны",
    text: "Нужен понятный маршрут: пройти урок, сделать работу, получить подтверждение и собрать профиль навыков.",
  },
  {
    title: "Менторы",
    text: "Можно вести прогресс, давать точечный feedback и подтверждать кейсы без внешних таблиц и переписок.",
  },
  {
    title: "Продуктовые команды",
    text: "Demo MVP показывает, как обучение, практика и Skill ID складываются в единый карьерный продукт.",
  },
];

const flowCards = [
  { title: "Урок", text: "контекст, разбор и практический шаг", icon: GraduationCap },
  { title: "Задача", text: "реальная сдача с комментарием и ссылкой", icon: ListChecks },
  { title: "Skill ID", text: "подтверждённый кейс и цифровой профиль", icon: Fingerprint },
];

export default function HomePage() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <PublicNavbar />

      <section className="container-app relative py-14 sm:py-18 lg:py-24">
        <div className="absolute inset-x-0 top-8 -z-10 mx-auto h-72 w-[min(92vw,64rem)] rounded-full bg-[radial-gradient(circle,rgba(123,44,255,0.2),transparent_70%)] blur-3xl" />

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-center">
          <div className="min-w-0">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              <GlowBadge icon={Sparkles}>premium demo MVP</GlowBadge>
            </motion.div>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 32, clipPath: "inset(0 0 100% 0)" }}
              animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
              transition={{ duration: 0.82, delay: 0.08, ease: "easeOut" }}
              className="mt-5 overflow-hidden"
              style={{ clipPath: "inset(0 0 0% 0)" }}
            >
              <h1 className="max-w-4xl text-4xl font-semibold leading-[0.98] tracking-tight text-[#F4F0FF] sm:text-5xl lg:text-7xl">
                Навык подтверждается делом, а не обещанием в профиле.
              </h1>
            </motion.div>

            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.56, delay: 0.18, ease: "easeOut" }}
              className="mt-5 max-w-2xl text-base leading-7 text-[#B8B0D9] sm:text-lg"
            >
              {siteConfig.description}
            </motion.p>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.26, ease: "easeOut" }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <motion.div whileTap={{ scale: 0.98 }}>
                <Link href="/demo" className="btn-primary gap-2 px-6 py-3.5 text-base">
                  Открыть demo
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </motion.div>
              <motion.div whileTap={{ scale: 0.98 }}>
                <Link href="/access" className="btn-ghost px-6 py-3.5 text-base">
                  Создать профиль
                </Link>
              </motion.div>
            </motion.div>

            <StaggerGroup className="mt-8 grid gap-3 sm:grid-cols-3">
              {flowCards.map((item) => (
                <StaggerItem key={item.title}>
                  <GlassCard className="h-full !p-4" hover>
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(123,44,255,0.18)] text-[#C084FC]">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <p className="mt-4 text-lg font-semibold">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-[#AFA8C8]">{item.text}</p>
                  </GlassCard>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.58, delay: 0.22, ease: "easeOut" }}
            className="relative"
          >
            <div className="pointer-events-none absolute -left-8 top-10 h-28 w-28 rounded-full bg-[#7B2CFF]/25 blur-3xl" />
            <div className="pointer-events-none absolute -right-6 bottom-6 h-32 w-32 rounded-full bg-[#C084FC]/18 blur-3xl" />
            <GlassCard hover={false} className="relative overflow-hidden !p-5 sm:!p-6">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C084FC] to-transparent opacity-80" />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[#AFA8C8]">dashboard preview</p>
                  <h2 className="mt-2 text-2xl font-semibold">SkillBarter Workspace</h2>
                </div>
                <div className="status-pill">live scenario</div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.25rem] border border-[rgba(168,85,247,0.16)] bg-[rgba(255,255,255,0.035)] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#AFA8C8]">progress</p>
                  <p className="mt-3 text-4xl font-semibold text-[#F4F0FF]">42%</p>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-[rgba(255,255,255,0.06)]">
                    <motion.div
                      initial={reduceMotion ? false : { width: 0 }}
                      whileInView={reduceMotion ? undefined : { width: "42%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-[#7B2CFF] via-[#A855F7] to-[#C084FC]"
                    />
                  </div>
                  <p className="mt-3 text-sm text-[#AFA8C8]">уроки, задачи, кейсы и встречи складываются в единый путь.</p>
                </div>

                <div className="space-y-3 rounded-[1.25rem] border border-[rgba(168,85,247,0.16)] bg-[rgba(255,255,255,0.035)] p-4">
                  {landingHighlights.map((item) => (
                    <div key={item.title} className="rounded-2xl border border-[rgba(168,85,247,0.14)] bg-[rgba(7,4,26,0.5)] px-3 py-3">
                      <p className="font-medium text-[#F4F0FF]">{item.title}</p>
                      <p className="mt-1 text-sm leading-6 text-[#AFA8C8]">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  ["5", "earned skills"],
                  ["2", "confirmed cases"],
                  ["1", "active mentor"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-2xl border border-[rgba(168,85,247,0.14)] bg-[rgba(255,255,255,0.025)] px-4 py-3">
                    <p className="text-2xl font-semibold text-[#F4F0FF]">{value}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#AFA8C8]">{label}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      <section id="how" className="container-app py-10 sm:py-14">
        <SectionTitle
          eyebrow="flow"
          title="Один сценарий от первого урока до подтверждённого кейса."
          description="SkillBarter выглядит как продукт, в котором обучение и практика не расходятся по разным страницам и инструментам."
        />
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {features.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.06}>
              <GlassCard hover className="h-full">
                <item.icon className="h-8 w-8 text-[#7B2CFF]" />
                <h3 className="mt-5 text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#AFA8C8]">{item.text}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="skill-id" className="container-app py-8 sm:py-14">
        <GlassCard hover={false} className="overflow-hidden !p-6 sm:!p-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center">
            <div>
              <GlowBadge icon={Fingerprint}>verified profile</GlowBadge>
              <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">Skill ID собирает доверие в цифровой профиль.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#B8B0D9] sm:text-base">
                Завершённые уроки добавляют навыки, подтверждённые задачи становятся кейсами, а отзывы наставников
                усиливают доверие к профилю.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["earned skills", "confirmed cases", "mentor reviews"].map((chip) => (
                  <span key={chip} className="glow-badge">{chip}</span>
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-[rgba(192,132,252,0.22)] bg-[linear-gradient(160deg,rgba(19,10,44,0.92),rgba(8,5,28,0.86))] p-5 shadow-[0_24px_80px_rgba(6,3,20,0.48)]">
              <p className="text-xs uppercase tracking-[0.24em] text-[#AFA8C8]">Skill ID</p>
              <p className="mt-2 break-all text-2xl font-semibold text-[#C084FC]">SB-7F3A-2026</p>
              <div className="mt-6 space-y-3">
                {[
                  ["Подтверждённые навыки", "5"],
                  ["Кейсы", "2"],
                  ["Рост профиля", "+28%"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between rounded-2xl border border-[rgba(168,85,247,0.16)] bg-[rgba(255,255,255,0.03)] px-4 py-3">
                    <span className="text-sm text-[#AFA8C8]">{label}</span>
                    <span className="font-semibold text-[#F4F0FF]">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>
      </section>

      <section id="audience" className="container-app py-10 sm:py-14">
        <SectionTitle
          eyebrow="audience"
          title="Сильный MVP для трёх типов пользователей."
          description="Структура остаётся компактной, но каждый экран поддерживает реальный сценарий показа продукта."
        />
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {audiences.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.05}>
              <GlassCard hover className="h-full">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(123,44,255,0.16)] text-[#C084FC]">
                    <Layers3 className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                </div>
                <p className="mt-4 text-sm leading-6 text-[#AFA8C8]">{item.text}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-app pb-16 pt-4 sm:pb-20">
        <GlassCard hover={false} className="overflow-hidden !p-6 sm:!p-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div>
              <GlowBadge icon={CheckCircle2}>ready to demo</GlowBadge>
              <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">Откройте продуктовый сценарий за пару минут.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#B8B0D9] sm:text-base">
                Зарегистрируйте демо-профиль, пройдите урок, сдайте задачу и посмотрите, как Skill ID обновляется вживую.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/access" className="btn-primary gap-2 px-6 py-3.5 text-base">
                Создать профиль
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/demo" className="btn-ghost px-6 py-3.5 text-base">
                Посмотреть dashboard
              </Link>
            </div>
          </div>
        </GlassCard>
      </section>

      <footer className="border-t border-[rgba(168,85,247,0.12)] py-8 text-center text-sm text-[#AFA8C8]">
        <div className="container-app">© {new Date().getFullYear()} {siteConfig.name}</div>
      </footer>
    </div>
  );
}
