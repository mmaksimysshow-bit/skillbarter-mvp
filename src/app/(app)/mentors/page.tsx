"use client";

import Link from "next/link";
import { useState } from "react";
import { MessageCircle, Calendar } from "lucide-react";
import { BookingModal } from "@/components/mentors/BookingModal";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { mockMentors } from "@/data/mock";
import { cn } from "@/lib/utils";
import type { Mentor } from "@/types";
import { useAppStore } from "@/store/useAppStore";

export default function MentorsPage() {
  const setActiveChatMentor = useAppStore((s) => s.setActiveChatMentor);
  const [bookMentor, setBookMentor] = useState<Mentor | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);

  const openBooking = (mentor: Mentor) => {
    setBookMentor(mentor);
    setBookingOpen(true);
  };

  return (
    <div className="page-wrap max-w-6xl space-y-5 pb-2 sm:space-y-6">
      <PageHeader
        title="Наставники"
        description="Запишитесь на разбор или напишите наставнику SkillBarter — feedback по реальным задачам MVP."
      />

      <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
        {mockMentors.map((m) => (
          <GlassCard key={m.id} hover className="!p-5">
            <div className="flex gap-4">
              <div className="relative shrink-0">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7B2CFF] to-[#A855F7] text-lg font-bold glow-purple">
                  {m.avatarInitials}
                </div>
                <span
                  className={cn(
                    "absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#07041A]",
                    m.online ? "bg-[#22C55E]" : "bg-[#AFA8C8]",
                  )}
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="break-words text-lg font-semibold">{m.name}</h3>
                <p className="text-sm text-[#A855F7]">{m.role}</p>
                <p className="mt-1 text-xs text-[#AFA8C8]">
                  {m.direction} · {m.experience}
                </p>
              </div>
            </div>

            <p className="mt-4 break-words text-sm text-[#AFA8C8]">
              <span className="text-[#F4F0FF]">Чем помогает:</span> {m.helpsWith}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
              <span className="text-[#A855F7]">★ {m.rating}</span>
              <span className="text-[#AFA8C8]">{m.sessions} разборов</span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs",
                  m.online
                    ? "bg-[rgba(34,197,94,0.15)] text-[#22C55E]"
                    : "bg-[rgba(175,168,200,0.15)] text-[#AFA8C8]",
                )}
              >
                {m.statusLabel}
              </span>
            </div>

            <div className="mt-5 flex w-full flex-col gap-2">
              <Link
                href="/messages"
                className="btn-ghost flex w-full items-center justify-center gap-2"
                onClick={() => setActiveChatMentor(m.id)}
              >
                <MessageCircle className="h-4 w-4" />
                Написать
              </Link>
              <button
                type="button"
                className="btn-primary flex w-full items-center justify-center gap-2"
                onClick={() => openBooking(m)}
              >
                <Calendar className="h-4 w-4" />
                Записаться
              </button>
            </div>
          </GlassCard>
        ))}
      </div>

      <BookingModal
        open={bookingOpen}
        onClose={() => {
          setBookingOpen(false);
          setBookMentor(null);
        }}
        mentor={bookMentor}
      />
    </div>
  );
}
