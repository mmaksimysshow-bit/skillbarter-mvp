"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { bookingTopics, mockMentors } from "@/data/mock";
import type { Mentor } from "@/types";
import { useAppStore } from "@/store/useAppStore";

const inputClass =
  "input-mobile mt-1 min-h-11 w-full rounded-xl border border-[rgba(168,85,247,0.25)] bg-[rgba(7,4,26,0.8)] px-3 py-2.5 outline-none focus:border-[#A855F7]";

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  mentor: Mentor | null;
}

export function BookingModal({ open, onClose, mentor }: BookingModalProps) {
  const createBooking = useAppStore((s) => s.createBooking);
  const [mentorId, setMentorId] = useState(mentor?.id ?? "m1");
  const [topic, setTopic] = useState(bookingTopics[0]);
  const [direction, setDirection] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (mentor) {
      setMentorId(mentor.id);
      setDirection(mentor.direction);
    }
  }, [mentor]);

  const selectedMentor = mockMentors.find((m) => m.id === mentorId);

  const handleSubmit = () => {
    if (!selectedMentor || !date || !time) return;
    const dateFormatted = new Date(date).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
    });
    createBooking({
      mentorId: selectedMentor.id,
      mentorName: selectedMentor.name,
      topic,
      direction: direction || selectedMentor.direction,
      date: dateFormatted,
      time,
      comment,
    });
    onClose();
    setComment("");
    setDate("");
    setTime("");
  };

  return (
    <Modal open={open} onClose={onClose} title="Запись к наставнику">
      <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
        <div>
          <label className="text-sm text-[#AFA8C8]">Наставник</label>
          <select
            value={mentorId}
            onChange={(e) => {
              const m = mockMentors.find((x) => x.id === e.target.value);
              setMentorId(e.target.value);
              if (m) setDirection(m.direction);
            }}
            className={inputClass}
          >
            {mockMentors.map((m) => (
              <option key={m.id} value={m.id} className="bg-[#07041A]">
                {m.name} — {m.role}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-[#AFA8C8]">Тема занятия</label>
          <select value={topic} onChange={(e) => setTopic(e.target.value)} className={inputClass}>
            {bookingTopics.map((t) => (
              <option key={t} value={t} className="bg-[#07041A]">
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-[#AFA8C8]">Направление</label>
          <input
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
            className={inputClass}
            placeholder="Дизайн, маркетинг..."
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm text-[#AFA8C8]">Дата</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="text-sm text-[#AFA8C8]">Время</label>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={inputClass} />
          </div>
        </div>

        <div>
          <label className="text-sm text-[#AFA8C8]">Комментарий</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className={inputClass}
            placeholder="Что хотите разобрать на встрече?"
          />
        </div>

        <button
          type="button"
          className="btn-primary w-full py-3"
          onClick={handleSubmit}
          disabled={!date || !time}
        >
          Записаться
        </button>
      </div>
    </Modal>
  );
}
