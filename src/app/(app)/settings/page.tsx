"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { useAppStore } from "@/store/useAppStore";
import type { UserSettings } from "@/types";

export default function SettingsPage() {
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const settings = useAppStore((s) => s.settings);
  const saveSettings = useAppStore((s) => s.saveSettings);
  const logout = useAppStore((s) => s.logout);
  const [form, setForm] = useState<UserSettings>(settings);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    saveSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputClass =
    "mt-1 w-full rounded-xl border border-[rgba(168,85,247,0.25)] bg-[rgba(7,4,26,0.8)] px-3 py-2.5 text-sm outline-none focus:border-[#A855F7]";

  const handleLogout = () => {
    logout();
    router.push("/access");
  };

  return (
    <div className="mx-auto max-w-xl space-y-6 overflow-x-hidden">
      <PageHeader title="Настройки" description="Профиль и уведомления SkillBarter." />

      <GlassCard hover={false}>
        <h2 className="font-semibold">Аккаунт</h2>
        <div className="mt-4 space-y-2 text-sm">
          <p className="break-words"><span className="text-[#AFA8C8]">Имя:</span> {user.name}</p>
          <p className="break-words"><span className="text-[#AFA8C8]">Email:</span> {user.email || "—"}</p>
          <p className="break-words"><span className="text-[#AFA8C8]">Login:</span> {user.login || "—"}</p>
          <p className="break-words"><span className="text-[#AFA8C8]">Дата регистрации:</span> {new Date(user.joinedAt).toLocaleDateString("ru-RU")}</p>
        </div>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <button type="button" className="btn-ghost flex-1" onClick={handleLogout}>
            Выйти
          </button>
          <Link href="/access" className="btn-ghost flex-1 text-center">
            Создать новый профиль
          </Link>
        </div>
      </GlassCard>

      <GlassCard hover={false}>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-[#AFA8C8]">Имя</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-sm text-[#AFA8C8]">Контакт</label>
            <input
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-sm text-[#AFA8C8]">Направление</label>
            <input
              value={form.direction}
              onChange={(e) => setForm({ ...form, direction: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-sm text-[#AFA8C8]">Роль</label>
            <input
              value={form.roleLabel}
              onChange={(e) => setForm({ ...form, roleLabel: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>
      </GlassCard>

      <GlassCard hover={false}>
        <h2 className="font-semibold">Уведомления</h2>
        <label className="mt-4 flex items-center justify-between gap-3 text-sm">
          <span>Уроки и дедлайны</span>
          <input
            type="checkbox"
            checked={form.notifyLessons}
            onChange={(e) => setForm({ ...form, notifyLessons: e.target.checked })}
            className="h-5 w-5 accent-[#7B2CFF]"
          />
        </label>
        <label className="mt-3 flex items-center justify-between gap-3 text-sm">
          <span>Задачи и проверки</span>
          <input
            type="checkbox"
            checked={form.notifyTasks}
            onChange={(e) => setForm({ ...form, notifyTasks: e.target.checked })}
            className="h-5 w-5 accent-[#7B2CFF]"
          />
        </label>
      </GlassCard>

      <GlassCard hover={false}>
        <h2 className="font-semibold">Приватность Skill ID</h2>
        <label className="mt-4 flex items-center justify-between gap-3 text-sm">
          <span>Публичный профиль Skill ID</span>
          <input
            type="checkbox"
            checked={form.skillIdPublic}
            onChange={(e) => setForm({ ...form, skillIdPublic: e.target.checked })}
            className="h-5 w-5 accent-[#7B2CFF]"
          />
        </label>
      </GlassCard>

      <button type="button" className="btn-primary w-full py-3" onClick={handleSave}>
        {saved ? "Сохранено ✓" : "Сохранить"}
      </button>
    </div>
  );
}
