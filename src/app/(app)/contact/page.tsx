"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { useAppStore } from "@/store/useAppStore";

export default function ContactPage() {
  const submitContactRequest = useAppStore((state) => state.submitContactRequest);
  const [form, setForm] = useState({
    name: "",
    contact: "",
    topic: "",
    message: "",
  });

  const inputClass =
    "mt-1 w-full rounded-xl border border-[rgba(168,85,247,0.25)] bg-[rgba(7,4,26,0.8)] px-3 py-2.5 text-sm outline-none focus:border-[#A855F7]";

  const handleSubmit = () => {
    if (!form.name.trim() || !form.contact.trim() || !form.topic.trim() || !form.message.trim()) return;
    submitContactRequest({
      name: form.name.trim(),
      contact: form.contact.trim(),
      topic: form.topic.trim(),
      message: form.message.trim(),
    });
    setForm({ name: "", contact: "", topic: "", message: "" });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 overflow-x-hidden pb-8">
      <PageHeader title="Contact" description="Отправьте обратную связь по MVP, урокам, задачам или вашей траектории SkillBarter." />

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
            <label className="text-sm text-[#AFA8C8]">Email или Telegram/MAX</label>
            <input
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-sm text-[#AFA8C8]">Тема</label>
            <input
              value={form.topic}
              onChange={(e) => setForm({ ...form, topic: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-sm text-[#AFA8C8]">Сообщение</label>
            <textarea
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>
      </GlassCard>

      <button type="button" className="btn-primary w-full py-3" onClick={handleSubmit}>
        Отправить
      </button>
    </div>
  );
}
