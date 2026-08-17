import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SORAZUM — платформа коллективного разума",
  description: "Реальные оплачиваемые задачи. Сильные команды. Один усиленный результат.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru"><body>{children}</body></html>
  );
}
