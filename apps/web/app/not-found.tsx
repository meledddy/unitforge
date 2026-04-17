import { buttonVariants, cn } from "@unitforge/ui";
import Link from "next/link";

import { InterfaceLanguageSwitcher } from "@/components/interface-language-switcher";
import { getCurrentInterfaceLocale } from "@/i18n/interface-locale.server";
import { getMessages } from "@/i18n/messages";

export default async function NotFound() {
  const locale = await getCurrentInterfaceLocale();
  const messages = getMessages(locale);

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#11151d] text-stone-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.12),transparent_32%),radial-gradient(circle_at_50%_35%,rgba(59,130,246,0.08),transparent_28%),linear-gradient(180deg,#121722_0%,#0f141b_58%,#0b1017_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_58%,rgba(148,163,184,0.08),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_18%)]" />

      <div className="absolute right-6 top-6 z-20 sm:right-10 sm:top-8">
        <InterfaceLanguageSwitcher
          className="border-white/10 bg-white/[0.04]"
          inactiveClassName="text-slate-300 hover:bg-white/[0.06] hover:text-white"
          label={messages.shared.language}
          labelClassName="text-slate-400"
          locale={locale}
        />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12 sm:px-10">
        <div className="flex w-full max-w-3xl flex-col items-center">
          <span className="pointer-events-none relative z-0 mb-[-2.5rem] select-none text-center text-[7rem] font-semibold leading-none tracking-[-0.08em] text-white/[0.08] sm:mb-[-3.5rem] sm:text-[9.5rem] md:text-[12rem] lg:text-[14rem]">
            404
          </span>

          <div className="relative z-10 w-full max-w-xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-[0_28px_80px_-36px_rgba(0,0,0,0.72)] backdrop-blur-xl sm:p-10">
            <div className="space-y-5 text-center">
              <p className="text-xs font-medium uppercase tracking-[0.34em] text-slate-400">{messages.notFound.label}</p>
              <h1 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {messages.notFound.title}
              </h1>
              <p className="mx-auto max-w-md text-sm leading-6 text-slate-300/78 sm:text-base">
                {messages.notFound.description}
              </p>
              <div className="flex flex-col gap-3 pt-3 sm:flex-row sm:justify-center">
                <Link className={cn(buttonVariants({ size: "lg" }), "h-12 rounded-full px-6")} href="/app">
                  {messages.shared.backToApp}
                </Link>
                <Link
                  className={cn(
                    buttonVariants({ size: "lg", variant: "outline" }),
                    "h-12 rounded-full border-white/12 bg-white/[0.03] px-6 text-stone-100 hover:bg-white/[0.07] hover:text-white",
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
