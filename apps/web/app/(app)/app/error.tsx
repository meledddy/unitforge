"use client";

import { Button, buttonVariants, cn } from "@unitforge/ui";
import Link from "next/link";
import { useEffect, useState } from "react";

const errorContent = {
  en: {
    eyebrow: "Dashboard unavailable",
    title: "We couldn’t load this page",
    description: "Try again. If the problem continues, return to Price Sheets.",
    retry: "Try again",
    priceSheets: "Open Price Sheets",
  },
  ru: {
    eyebrow: "Панель недоступна",
    title: "Не удалось загрузить страницу",
    description:
      "Попробуйте ещё раз. Если ошибка повторится, вернитесь к прайс-листам.",
    retry: "Попробовать снова",
    priceSheets: "Открыть прайс-листы",
  },
} as const;

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [locale, setLocale] = useState<keyof typeof errorContent>("en");

  useEffect(() => {
    setLocale(document.documentElement.lang === "ru" ? "ru" : "en");
    console.error(error);
  }, [error]);

  const copy = errorContent[locale];

  return (
    <div className="mx-auto flex min-h-[55vh] max-w-2xl items-center justify-center py-10">
      <section className="border-border/70 bg-card/92 relative w-full overflow-hidden rounded-[1.8rem] border p-6 text-center shadow-[0_24px_70px_hsl(var(--app-shadow)/0.08)] sm:p-9">
        <div
          aria-hidden="true"
          className="via-primary/45 pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent"
        />
        <p className="text-primary text-xs font-semibold uppercase tracking-[0.18em]">
          {copy.eyebrow}
        </p>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
          {copy.title}
        </h1>
        <p className="text-muted-foreground mx-auto mt-3 max-w-lg text-sm leading-6">
          {copy.description}
        </p>
        <div className="mt-6 grid gap-2 sm:inline-flex">
          <Button className="w-full sm:w-auto" onClick={reset} type="button">
            {copy.retry}
          </Button>
          <Link
            className={cn(
              buttonVariants({ variant: "outline" }),
              "bg-background/70 w-full sm:w-auto",
            )}
            href="/app/price-sheets"
          >
            {copy.priceSheets}
          </Link>
        </div>
      </section>
    </div>
  );
}
