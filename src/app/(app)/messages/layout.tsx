import { Suspense } from "react";

export default function MessagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[200px] items-center justify-center text-[#AFA8C8]">
          Загрузка чата…
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
