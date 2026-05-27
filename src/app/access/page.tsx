"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, KeyRound, ShieldCheck, Sparkles } from "lucide-react";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { GlassCard } from "@/components/ui/GlassCard";
import { accessFeatures, siteConfig } from "@/data/mock";
import { GlowBadge, Reveal } from "@/components/ui/motion";
import { useAppStore } from "@/store/useAppStore";

type Mode = "login" | "register";

export default function AccessPage() {
  const router = useRouter();
  const activeUserId = useAppStore((state) => state.activeUserId);
  const loginAccount = useAppStore((state) => state.loginAccount);
  const registerAccount = useAppStore((state) => state.registerAccount);

  const [mode, setMode] = useState<Mode>("register");
  const [error, setError] = useState("");
  const [loginForm, setLoginForm] = useState({ identifier: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    identifier: "",
    direction: "",
    roleLabel: "Студент",
  });

  const inputClass =
    "input-mobile mt-1 w-full rounded-2xl border border-[rgba(168,85,247,0.22)] bg-[rgba(7,4,26,0.8)] px-4 py-3 text-sm outline-none transition focus:border-[#A855F7] focus:bg-[rgba(14,9,36,0.9)]";

  const handleLogin = () => {
    setError("");
    const result = loginAccount(loginForm.identifier, loginForm.password);
    if (!result.success) {
      setError(result.message);
      return;
    }
    router.push("/demo");
  };

  const handleRegister = () => {
    setError("");
    if (!registerForm.name.trim() || !registerForm.identifier.trim() || !registerForm.direction.trim()) {
      setError("Заполните имя, email/login и направление.");
      return;
    }
    const result = registerAccount(registerForm);
    if (!result.success) {
      setError(result.message);
      return;
    }
    router.push("/demo");
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <PublicNavbar />

      <div className="container-app py-10 sm:py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#AFA8C8] transition-colors hover:text-[#A855F7]">
          <ArrowLeft className="h-4 w-4" />
          На главную
        </Link>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto mt-8 max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(360px,440px)]">
            <div className="min-w-0 px-1 py-4 sm:px-0 sm:py-8">
              <Reveal delay={0.04}>
                <GlowBadge icon={Sparkles}>early access</GlowBadge>
              </Reveal>
              <Reveal delay={0.1}>
                <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-tight text-[#F4F0FF] sm:text-5xl lg:text-6xl">
                  Создайте демо-профиль, чтобы пройти путь от урока до подтверждённого кейса.
                </h1>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="mt-5 max-w-2xl text-base leading-7 text-[#B8B0D9] sm:text-lg">
                  {siteConfig.name} в этом MVP работает как отдельный workspace на пользователя: свой прогресс,
                  свои задачи, свои навыки и свой Skill ID.
                </p>
              </Reveal>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <GlassCard hover className="!p-5">
                  <ShieldCheck className="h-7 w-7 text-[#C084FC]" />
                  <h2 className="mt-4 text-lg font-semibold">Чистый старт</h2>
                  <p className="mt-2 text-sm leading-6 text-[#AFA8C8]">
                    Новый профиль получает чистое состояние и не смешивается с прогрессом других пользователей.
                  </p>
                </GlassCard>
                <GlassCard hover className="!p-5">
                  <CheckCircle2 className="h-7 w-7 text-[#C084FC]" />
                  <h2 className="mt-4 text-lg font-semibold">Демо-сценарий</h2>
                  <p className="mt-2 text-sm leading-6 text-[#AFA8C8]">
                    Уроки, задачи, подтверждения наставника и Skill ID уже связаны и обновляются после действий.
                  </p>
                </GlassCard>
              </div>

              <ul className="mt-8 space-y-3">
                {accessFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#7B2CFF]" />
                    <span className="text-[#AFA8C8]">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <GlassCard hover={false} className="relative overflow-hidden !p-6 sm:!p-8">
              <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#C084FC] to-transparent" />
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(123,44,255,0.18)] text-[#A855F7] glow-purple">
                <KeyRound className="h-6 w-6" />
              </div>

              <h2 className="mt-5 text-2xl font-semibold">Доступ к {siteConfig.name}</h2>
              <p className="mt-2 text-sm leading-6 text-[#AFA8C8]">
                Выберите режим входа или создайте новый профиль для персонального demo-workspace.
              </p>

              <div className="relative mt-6 rounded-2xl border border-[rgba(168,85,247,0.16)] bg-[rgba(255,255,255,0.03)] p-1">
                <motion.div
                  className="absolute inset-y-1 rounded-[1rem] bg-gradient-to-r from-[#7B2CFF] to-[#A855F7]"
                  initial={false}
                  animate={{ left: mode === "login" ? "0.25rem" : "calc(50% + 0.125rem)", width: "calc(50% - 0.375rem)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 28 }}
                />
                <div className="relative grid grid-cols-2 gap-1">
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className={`relative z-10 min-h-11 rounded-[1rem] px-3 py-2.5 text-sm font-medium transition ${mode === "login" ? "text-white" : "text-[#AFA8C8]"}`}
                  >
                    Войти
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("register")}
                    className={`relative z-10 min-h-11 rounded-[1rem] px-3 py-2.5 text-sm font-medium transition ${mode === "register" ? "text-white" : "text-[#AFA8C8]"}`}
                  >
                    Создать профиль
                  </button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {mode === "login" ? (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22 }}
                    className="mt-8 space-y-4"
                  >
                    <div>
                      <label className="text-sm text-[#AFA8C8]">Email или login</label>
                      <input
                        value={loginForm.identifier}
                        onChange={(e) => setLoginForm({ ...loginForm, identifier: e.target.value })}
                        className={inputClass}
                        placeholder="demo@skillbarter.ru"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-[#AFA8C8]">Пароль</label>
                      <input
                        type="password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        className={inputClass}
                        placeholder="Для demo: skill2026"
                      />
                    </div>
                    <button type="button" onClick={handleLogin} className="btn-primary w-full py-3">
                      {activeUserId ? "Продолжить" : "Войти"}
                    </button>
                    <p className="break-words text-xs text-[#AFA8C8]/75">
                      Demo login: <span className="text-[#D8C7FF]">demo@skillbarter.ru</span> /{" "}
                      <span className="text-[#D8C7FF]">skill2026</span>
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="register"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22 }}
                    className="mt-8 space-y-4"
                  >
                    <div>
                      <label className="text-sm text-[#AFA8C8]">Имя</label>
                      <input
                        value={registerForm.name}
                        onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                        className={inputClass}
                        placeholder="Иван Петров"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-[#AFA8C8]">Email или login</label>
                      <input
                        value={registerForm.identifier}
                        onChange={(e) => setRegisterForm({ ...registerForm, identifier: e.target.value })}
                        className={inputClass}
                        placeholder="ivan@skillbarter.demo"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-[#AFA8C8]">Направление</label>
                      <input
                        value={registerForm.direction}
                        onChange={(e) => setRegisterForm({ ...registerForm, direction: e.target.value })}
                        className={inputClass}
                        placeholder="Продуктовый дизайн"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-[#AFA8C8]">Роль</label>
                      <input
                        value={registerForm.roleLabel}
                        onChange={(e) => setRegisterForm({ ...registerForm, roleLabel: e.target.value })}
                        className={inputClass}
                        placeholder="Студент"
                      />
                    </div>
                    <button type="button" onClick={handleRegister} className="btn-primary w-full py-3">
                      Создать профиль
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {error && <p className="mt-4 break-words text-sm text-[#F87171]">{error}</p>}
            </GlassCard>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
