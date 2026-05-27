"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Send, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { GlowBadge, MotionPage } from "@/components/ui/motion";
import { mockMentors } from "@/data/mock";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";

function TypingIndicator() {
  return (
    <div className="mr-auto flex max-w-[85%] gap-1 rounded-2xl bg-[rgba(123,44,255,0.2)] px-4 py-3">
      <span className="h-2 w-2 animate-bounce rounded-full bg-[#A855F7] [animation-delay:0ms]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-[#A855F7] [animation-delay:150ms]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-[#A855F7] [animation-delay:300ms]" />
    </div>
  );
}

export default function MessagesPage() {
  const searchParams = useSearchParams();
  const chats = useAppStore((s) => s.chats);
  const typingMentorId = useAppStore((s) => s.typingMentorId);
  const activeChatMentorId = useAppStore((s) => s.activeChatMentorId);
  const setActiveChatMentor = useAppStore((s) => s.setActiveChatMentor);
  const sendChatMessage = useAppStore((s) => s.sendChatMessage);
  const [text, setText] = useState("");
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mentor = searchParams.get("mentor");
    if (mentor) {
      setActiveChatMentor(mentor);
      setMobileChatOpen(true);
    }
  }, [searchParams, setActiveChatMentor]);

  const activeMentor = mockMentors.find((m) => m.id === activeChatMentorId) ?? mockMentors[0];
  const messages = useMemo(() => chats[activeMentor.id] ?? [], [chats, activeMentor.id]);
  const isTyping = typingMentorId === activeMentor.id;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isTyping]);

  const handleSend = () => {
    if (!text.trim()) return;
    sendChatMessage(activeMentor.id, text);
    setText("");
    setMobileChatOpen(true);
  };

  const selectMentor = (id: string) => {
    setActiveChatMentor(id);
    setMobileChatOpen(true);
  };

  return (
    <MotionPage className="page-wrap flex max-w-6xl flex-col gap-3 sm:gap-4 lg:h-[calc(100vh-8rem)]">
      <PageHeader title="Сообщения" description="Чат с наставниками SkillBarter. Сообщения, системные статусы и ответы собраны в один рабочий поток." />
      <div className="flex flex-wrap gap-2">
        <GlowBadge icon={Sparkles}>mentor chat</GlowBadge>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 sm:min-h-[min(480px,60vh)] lg:min-h-0 lg:flex-row lg:gap-4">
        <GlassCard hover={false} className={cn("lg:w-72 lg:shrink-0", mobileChatOpen ? "hidden lg:block" : "block")}>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[#AFA8C8]">Диалоги</p>
          <ul className="space-y-1">
            {mockMentors.map((m) => {
              const last = chats[m.id]?.[chats[m.id].length - 1];
              return (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => selectMentor(m.id)}
                    className={cn(
                      "min-h-11 w-full rounded-2xl border border-transparent px-3 py-3 text-left text-sm transition-colors",
                      activeMentor.id === m.id
                        ? "sidebar-active-glow border-[rgba(168,85,247,0.16)]"
                        : "hover:border-[rgba(168,85,247,0.16)] hover:bg-[rgba(123,44,255,0.12)]",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium">{m.name}</span>
                      <span className={cn("h-2 w-2 shrink-0 rounded-full", m.online ? "bg-[#22C55E]" : "bg-[#AFA8C8]")} />
                    </div>
                    <span className="mt-0.5 block text-xs text-[#AFA8C8]">{m.role}</span>
                    {last && (
                      <span className="mt-1 line-clamp-1 text-[10px] text-[#AFA8C8]/80">
                        {last.sender === "user" ? "Вы: " : ""}
                        {last.text}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </GlassCard>

        <GlassCard hover={false} className={cn("flex min-h-[min(320px,55vh)] flex-1 flex-col !p-0 sm:min-h-[360px]", !mobileChatOpen && "hidden lg:flex")}>
          <div className="flex items-center gap-2 border-b border-[rgba(168,85,247,0.15)] px-4 py-3">
            <button
              type="button"
              className="touch-target shrink-0 rounded-lg text-[#AFA8C8] hover:bg-[rgba(123,44,255,0.15)] lg:hidden"
              onClick={() => setMobileChatOpen(false)}
              aria-label="К списку диалогов"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{activeMentor.name}</p>
              <p className="text-xs text-[#AFA8C8]">
                {activeMentor.statusLabel} · {activeMentor.role}
              </p>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.length === 0 && !isTyping ? (
              <p className="text-center text-sm text-[#AFA8C8]">Напишите наставнику — ответ придёт через секунду</p>
            ) : (
              messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "max-w-[90%] rounded-2xl px-3 py-2.5 text-sm shadow-[0_12px_30px_rgba(6,3,20,0.22)] sm:max-w-[85%]",
                    msg.sender === "user" && "ml-auto bg-[#7B2CFF] text-white",
                    msg.sender === "mentor" && "bg-[rgba(123,44,255,0.2)] text-[#F4F0FF]",
                    msg.sender === "system" && "mx-auto max-w-full border border-[rgba(168,85,247,0.2)] bg-[rgba(7,4,26,0.6)] text-center text-xs text-[#AFA8C8]",
                  )}
                >
                  <p className="break-words">{msg.text}</p>
                  {msg.sender !== "system" && <p className="mt-1 text-[10px] opacity-70">{msg.time}</p>}
                </motion.div>
              ))
            )}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex gap-2 border-t border-[rgba(168,85,247,0.15)] p-3">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="Сообщение..."
              className="input-mobile min-h-11 min-w-0 flex-1 rounded-2xl border border-[rgba(168,85,247,0.25)] bg-[rgba(7,4,26,0.8)] px-4 py-2.5 outline-none focus:border-[#A855F7]"
            />
            <button
              type="button"
              className="btn-primary touch-target shrink-0 !min-w-11 !px-3"
              onClick={handleSend}
              aria-label="Отправить"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </GlassCard>
      </div>
    </MotionPage>
  );
}
