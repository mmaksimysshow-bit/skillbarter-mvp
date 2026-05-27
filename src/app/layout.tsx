import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { siteConfig } from "@/data/mock";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "SkillBarter — навык, подтверждённый делом",
    template: `%s | ${siteConfig.name}`,
  },
  description:
    "MVP платформы, где пользователи проходят уроки, выполняют реальные задачи, получают подтверждённые кейсы и собирают Skill ID.",
  openGraph: {
    title: "SkillBarter — навык, подтверждённый делом",
    description:
      "MVP платформы, где пользователи проходят уроки, выполняют реальные задачи, получают подтверждённые кейсы и собирают Skill ID.",
    type: "website",
    siteName: "SkillBarter",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={inter.variable}>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
