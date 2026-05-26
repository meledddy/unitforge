import { buttonVariants, cn } from "@unitforge/ui";
import Link from "next/link";

import { UnitforgeLogo } from "@/components/marketing/brand-mark";
import { getCurrentInterfaceLocale } from "@/i18n/interface-locale.server";
import { getMessages } from "@/i18n/messages";

export default async function NotFound() {
  const locale = await getCurrentInterfaceLocale();
  const messages = getMessages(locale);

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#170d17] text-[#fff8ec]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(242,198,118,0.18),transparent_28%),radial-gradient(circle_at_18%_28%,rgba(126,78,55,0.16),transparent_30%),linear-gradient(180deg,#1d111d_0%,#120b14_58%,#0c0710_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,247,232,0.045),transparent_18%),radial-gradient(circle_at_50%_58%,rgba(243,203,134,0.09),transparent_26%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#f5ce86]/35 to-transparent" />
      <div className="absolute -left-32 top-16 h-72 w-72 rounded-full bg-[#f1c879]/10 blur-3xl" />
      <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-[#7f4a35]/12 blur-3xl" />

      <div className="absolute left-1/2 top-8 z-20 -translate-x-1/2 sm:left-10 sm:translate-x-0">
        <Link
          aria-label="Unitforge"
          className="inline-flex rounded-full border border-[#f5ce86]/15 bg-[#fff8ec]/[0.04] px-4 py-2 shadow-[0_20px_60px_-42px_rgba(242,198,118,0.85)] backdrop-blur-xl transition hover:border-[#f5ce86]/30 hover:bg-[#fff8ec]/[0.07]"
          href="/"
        >
          <UnitforgeLogo
            className="text-[#fff8ec]"
            markClassName="h-7 w-7"
            tone="light"
            variant="wordmark"
            wordmarkClassName="text-[1.45rem] text-[#fff8ec]"
          />
        </Link>
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12 sm:px-10">
        <div className="flex w-full max-w-3xl flex-col items-center">
          <span className="pointer-events-none relative z-0 mb-[-2.5rem] select-none text-center text-[7rem] font-semibold leading-none tracking-[-0.08em] text-[#f5ce86]/[0.09] sm:mb-[-3.5rem] sm:text-[9.5rem] md:text-[12rem] lg:text-[14rem]">
            404
          </span>

          <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-[2rem] border border-[#f5ce86]/15 bg-[#211421]/80 p-8 shadow-[0_32px_96px_-42px_rgba(0,0,0,0.86),0_0_70px_-58px_rgba(245,206,134,0.9)] backdrop-blur-2xl sm:p-10">
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#f5ce86]/45 to-transparent" />
            <div className="pointer-events-none absolute left-1/2 top-0 h-28 w-64 -translate-x-1/2 rounded-full bg-[#f5ce86]/10 blur-3xl" />
            <div className="space-y-5 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#f5ce86]/18 bg-[#fff8ec]/[0.05] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                <UnitforgeLogo className="h-8 w-8" tone="light" variant="icon" />
              </div>
              <p className="text-xs font-medium uppercase tracking-[0.34em] text-[#e7c58d]/75">{messages.notFound.label}</p>
              <h1 className="text-balance text-3xl font-semibold tracking-tight text-[#fff8ec] sm:text-4xl">
                {messages.notFound.title}
              </h1>
              <p className="mx-auto max-w-md text-sm leading-6 text-[#d8c9bd]/82 sm:text-base">
                {messages.notFound.description}
              </p>
              <div className="flex flex-col gap-3 pt-3 sm:flex-row sm:justify-center">
                <Link
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-12 rounded-full bg-[#f3c978] px-6 font-semibold text-[#20111d] shadow-[0_18px_42px_-28px_rgba(245,206,134,0.9)] hover:bg-[#ffd98e] hover:text-[#20111d]",
                  )}
                  href="/app"
                >
                  {messages.shared.backToApp}
                </Link>
                <Link
                  className={cn(
                    buttonVariants({ size: "lg", variant: "outline" }),
                    "h-12 rounded-full border-[#f5ce86]/24 bg-[#fff8ec]/[0.035] px-6 text-[#fff8ec] hover:border-[#f5ce86]/38 hover:bg-[#fff8ec]/[0.07] hover:text-[#fff8ec]",
                  )}
                  href="/"
                >
                  {messages.shared.publicSite}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
