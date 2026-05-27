"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Copy, Fingerprint, ShieldCheck, Star } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { EmptyState, GlowBadge, MotionPage, SectionTitle, StaggerGroup, StaggerItem } from "@/components/ui/motion";
import { skillIdCode } from "@/data/mock";
import { useAppStore } from "@/store/useAppStore";

export default function SkillIdPage() {
  const user = useAppStore((state) => state.user);
  const skillId = useAppStore((state) => state.skillId);
  const earnedSkills = useAppStore((state) => state.earnedSkills);
  const confirmedCases = useAppStore((state) => state.confirmedCases);
  const getCompletedTasksCount = useAppStore((state) => state.getCompletedTasksCount);
  const getSkillIdGrowth = useAppStore((state) => state.getSkillIdGrowth);
  const getSkillIdRating = useAppStore((state) => state.getSkillIdRating);
  const [copied, setCopied] = useState(false);

  const skillIdAvg = Math.round(skillId.reduce((sum, pillar) => sum + pillar.percent, 0) / skillId.length);
  const shareUrl = `https://skillbarter.demo/id/${skillIdCode}`;
  const growth = getSkillIdGrowth();
  const rating = getSkillIdRating();
  const mentorNames = [...new Set(confirmedCases.map((item) => item.mentorName).filter(Boolean))];
  const latestResults = confirmedCases.slice(0, 3);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <MotionPage className="page-wrap max-w-5xl space-y-5 sm:space-y-6">
      <PageHeader
        title="Skill ID"
        description="Skill ID — это не резюме и не сертификат. Это профиль, где навыки подтверждены уроками, задачами и проверкой наставника."
      />

      <GlassCard hover={false} className="relative overflow-hidden !p-6 sm:!p-8">
        <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#C084FC] to-transparent" />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <GlowBadge icon={ShieldCheck}>verified by work</GlowBadge>
          <button type="button" className="btn-primary gap-2 sm:w-auto" onClick={handleCopy}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Скопировано" : "Скопировать ссылку"}
          </button>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-end">
          <div>
            <p className="text-sm text-[#AFA8C8]">Skill ID</p>
            <p className="mt-2 break-all text-2xl font-semibold tracking-[0.16em] text-[#C084FC] glow-text sm:text-3xl">
              {skillIdCode}
            </p>
            <div className="mt-6 space-y-2">
              <h2 className="text-2xl font-semibold">{user.name}</h2>
              <p className="text-[#A855F7]">{user.roleLabel}</p>
              <p className="text-sm text-[#AFA8C8]">{user.direction}</p>
              <p className="text-sm text-[#AFA8C8]">{user.city}</p>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-[rgba(168,85,247,0.16)] bg-[rgba(255,255,255,0.035)] p-5">
            <div className="flex items-center gap-2">
              <Fingerprint className="h-5 w-5 text-[#C084FC]" />
              <span className="text-sm font-medium text-[#D8C7FF]">profile strength</span>
            </div>
            <p className="mt-3 text-4xl font-semibold">{skillIdAvg}%</p>
            <ProgressBar value={skillIdAvg} className="mt-3" size="sm" />
            <p className="mt-3 text-sm text-[#AFA8C8]">
              Профиль растет из завершенных уроков, подтвержденных задач и реальных кейсов.
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <div>
            <p className="text-xs text-[#AFA8C8]">Задач выполнено</p>
            <p className="text-2xl font-bold">{getCompletedTasksCount()}</p>
          </div>
          <div>
            <p className="text-xs text-[#AFA8C8]">Подтвержденные кейсы</p>
            <p className="text-2xl font-bold">{confirmedCases.length}</p>
          </div>
          <div>
            <p className="text-xs text-[#AFA8C8]">Рейтинг</p>
            <p className="text-2xl font-bold">{rating > 0 ? rating : "—"}</p>
          </div>
          <div>
            <p className="text-xs text-[#AFA8C8]">Growth</p>
            <p className="text-2xl font-bold">{growth}%</p>
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-semibold">Рост навыков</h2>
          <span className="text-sm text-[#A855F7]">{skillIdAvg}%</span>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {skillId.map((pillar) => (
            <div key={pillar.id}>
              <div className="mb-1 flex justify-between text-sm">
                <span>{pillar.label}</span>
                <span className="text-[#A855F7]">{pillar.percent}%</span>
              </div>
              <ProgressBar value={pillar.percent} size="sm" />
            </div>
          ))}
        </div>
      </GlassCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard>
          <SectionTitle title="Подтвержденные навыки" description="навыки, полученные через уроки и задачи" />
          {earnedSkills.length === 0 ? (
            <EmptyState
              title="Пока здесь пусто"
              description="Пройдите первый урок и выполните задачу, чтобы получить первый подтвержденный кейс."
              action={
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <Link href="/lessons" className="btn-primary">Начать первый урок</Link>
                  <Link href="/tasks" className="btn-ghost">Открыть задачи</Link>
                </div>
              }
            />
          ) : (
            <StaggerGroup className="mt-4 flex flex-wrap gap-2">
              {earnedSkills.map((skill) => (
                <StaggerItem key={skill.id}>
                  <div className="rounded-full border border-[rgba(168,85,247,0.18)] bg-[rgba(123,44,255,0.08)] px-3 py-2 text-sm shadow-[0_0_24px_rgba(123,44,255,0.12)]">
                    <p className="break-words font-medium">{skill.name}</p>
                    <p className="mt-1 break-words text-[11px] text-[#AFA8C8]">
                      {skill.sourceType === "lesson" ? "Из урока" : "Из задачи"} · {skill.sourceTitle}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          )}
        </GlassCard>

        <GlassCard>
          <SectionTitle title="Кейсы" description="работы, подтвержденные наставником" />
          {confirmedCases.length === 0 ? (
            <EmptyState
              title="Пока нет подтвержденных кейсов"
              description="Сначала пройди урок, затем выполни задачу и подтверди ее у наставника. Тогда здесь появится первый кейс."
              action={<Link href="/tasks" className="btn-primary mt-4">Выполнить задачу</Link>}
            />
          ) : (
            <ul className="mt-4 space-y-3">
              {confirmedCases.map((skillCase) => (
                <li key={skillCase.id} className="rounded-[1.4rem] border border-[rgba(168,85,247,0.14)] bg-[linear-gradient(160deg,rgba(19,10,44,0.78),rgba(8,5,28,0.7))] px-4 py-4 text-sm shadow-[0_20px_60px_rgba(6,3,20,0.35)]">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="min-w-0 break-words font-medium">{skillCase.title}</p>
                    <span className="status-pill-success">Подтвержден</span>
                  </div>
                  <p className="mt-1 break-words text-xs text-[#AFA8C8]">
                    {skillCase.client} · {skillCase.category}
                  </p>
                  <p className="mt-2 break-words text-xs text-[#A855F7]">{skillCase.skills.join(", ")}</p>
                </li>
              ))}
            </ul>
          )}
        </GlassCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard>
          <SectionTitle title="Наставники, которые подтвердили" description="кто усилил доверие к твоим кейсам" />
          {mentorNames.length === 0 ? (
            <EmptyState title="Наставники появятся вместе с кейсами" description="После подтверждения задачи имя наставника появится в профиле и будет усиливать доверие к результату." />
          ) : (
            <ul className="mt-4 space-y-3">
              {mentorNames.map((mentorName) => (
                <li key={mentorName} className="rounded-2xl border border-[rgba(168,85,247,0.12)] px-4 py-4 text-sm">
                  <p className="font-medium text-[#F4F0FF]">{mentorName}</p>
                  <p className="mt-1 text-[#AFA8C8]">Подтвердил результат и навыки в одном из кейсов.</p>
                </li>
              ))}
            </ul>
          )}
        </GlassCard>

        <GlassCard>
          <SectionTitle title="Последние результаты" description="что уже попало в профиль" />
          {latestResults.length === 0 ? (
            <EmptyState title="Результаты появятся после первой проверки" description="Когда наставник подтвердит задачу, здесь сразу будет видно последний кейс и его эффект на профиль." />
          ) : (
            <ul className="mt-4 space-y-3">
              {latestResults.map((skillCase) => (
                <li key={`${skillCase.id}-result`} className="rounded-2xl border border-[rgba(168,85,247,0.12)] px-4 py-4 text-sm">
                  <p className="break-words font-medium">{skillCase.title}</p>
                  <p className="mt-1 break-words text-[#AFA8C8]">{skillCase.comment || skillCase.reviewText}</p>
                </li>
              ))}
            </ul>
          )}
        </GlassCard>
      </div>

      <GlassCard>
        <SectionTitle title="Что делать дальше" description="какой шаг сильнее всего усилит Skill ID" />
        {confirmedCases.length > 0 ? (
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/path" className="btn-primary">Продолжить маршрут</Link>
            <Link href="/tasks" className="btn-ghost">Взять следующую задачу</Link>
            <Link href="/lessons" className="btn-ghost">Открыть уроки</Link>
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/lessons" className="btn-primary">Начать первый урок</Link>
            <Link href="/tasks" className="btn-ghost">Посмотреть задачи</Link>
          </div>
        )}
      </GlassCard>

      <GlassCard>
        <SectionTitle title="Отзывы наставников" description="доверие к подтвержденным работам" />
        {confirmedCases.length === 0 ? (
          <EmptyState title="Отзывы появятся вместе с кейсами" description="После подтверждения задачи наставник оставляет review, который сразу попадает в Skill ID." />
        ) : (
          <ul className="mt-4 space-y-4">
            {confirmedCases.map((skillCase) => (
              <li key={`${skillCase.id}-review`} className="rounded-[1.4rem] border border-[rgba(168,85,247,0.14)] bg-[rgba(255,255,255,0.025)] px-4 py-4 text-sm">
                <p className="flex flex-wrap items-center gap-2 break-words font-medium text-[#A855F7]">
                  <span>{skillCase.mentorName ?? "Наставник"}</span>
                  <span className="inline-flex items-center gap-1 text-[#F4F0FF]">
                    <Star className="h-4 w-4 fill-[#F4F0FF] text-[#F4F0FF]" />
                    {skillCase.rating}
                  </span>
                </p>
                <p className="mt-1 break-words text-[#AFA8C8]">{skillCase.reviewText}</p>
              </li>
            ))}
          </ul>
        )}
      </GlassCard>
    </MotionPage>
  );
}
