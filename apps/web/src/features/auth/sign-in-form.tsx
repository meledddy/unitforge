"use client";

import { Button, Card, CardContent, CardHeader, CardTitle, cn, Input, Label } from "@unitforge/ui";
import Link from "next/link";
import { useActionState } from "react";

import type { InterfaceLocale } from "@/i18n/interface-locale";
import { getMessages } from "@/i18n/messages";
import { signInAction } from "@/server/auth/actions";
import { initialSignInActionState } from "@/server/auth/sign-in-state";

interface SignInFormProps {
  enabled: boolean;
  locale: InterfaceLocale;
  next?: string;
}

export function SignInForm({ enabled, locale, next }: SignInFormProps) {
  const [state, formAction, isPending] = useActionState(signInAction, initialSignInActionState);
  const messages = getMessages(locale);

  function getFieldError(field: "email" | "password") {
    return state.fieldErrors?.[field];
  }

  return (
    <div
      aria-hidden={!enabled}
      className={cn(
        "w-full max-w-[424px] overflow-hidden transition-[max-height,opacity,transform] duration-[920ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
        enabled
          ? "pointer-events-auto max-h-[760px] opacity-100 translate-y-0 delay-[180ms]"
          : "pointer-events-none max-h-0 opacity-0 translate-y-8 lg:translate-y-0 lg:translate-x-8",
      )}
    >
      <Card
        className={cn(
          "origin-top border border-white/10 bg-white/[0.07] text-stone-100 shadow-[0_32px_90px_-28px_rgba(0,0,0,0.72)] backdrop-blur-2xl transition-[opacity,transform,filter] duration-[920ms] ease-[cubic-bezier(0.16,1,0.3,1)] lg:origin-right",
          enabled ? "translate-y-0 scale-100 opacity-100 blur-0 delay-[180ms]" : "translate-y-5 scale-[0.985] opacity-0 blur-sm",
        )}
      >
        <div
          className={cn(
            "transition-[opacity,transform] duration-[640ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
            enabled ? "translate-y-0 opacity-100 delay-[260ms]" : "translate-y-3 opacity-0 delay-0",
          )}
        >
          <CardHeader className="space-y-3 p-7 sm:p-8">
            <CardTitle className="text-4xl font-semibold tracking-tight text-stone-50">{messages.auth.welcomeBack}</CardTitle>
          </CardHeader>
          <CardContent className="p-7 pt-0 sm:p-8 sm:pt-0">
            <form action={formAction} className="space-y-4">
              <input name="next" type="hidden" value={next ?? ""} />

              {state.status === "error" && state.message ? (
                <div className="rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {state.message}
                </div>
              ) : null}

              <div className="space-y-2">
                <Label className="text-sm font-medium text-stone-200/88" htmlFor="sign-in-email">
                  {messages.auth.email}
                </Label>
                <Input
                  aria-invalid={Boolean(getFieldError("email"))}
                  className={cn(
                    "h-14 rounded-[1.35rem] border-white/10 bg-white/[0.07] px-4 text-base text-stone-50 placeholder:text-stone-500 focus-visible:ring-[#d0a94c] focus-visible:ring-offset-[#1a1d24]",
                    getFieldError("email") ? "border-red-400/70 focus-visible:ring-red-300" : undefined,
                  )}
                  disabled={!enabled || isPending}
                  id="sign-in-email"
                  name="email"
                  placeholder={messages.auth.emailPlaceholder}
                  type="email"
                />
                {getFieldError("email") ? <p className="text-sm text-red-200">{getFieldError("email")}</p> : null}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-stone-200/88" htmlFor="sign-in-password">
                  {messages.auth.password}
                </Label>
                <Input
                  aria-invalid={Boolean(getFieldError("password"))}
                  className={cn(
                    "h-14 rounded-[1.35rem] border-white/10 bg-white/[0.07] px-4 text-base text-stone-50 placeholder:text-stone-500 focus-visible:ring-[#d0a94c] focus-visible:ring-offset-[#1a1d24]",
                    getFieldError("password") ? "border-red-400/70 focus-visible:ring-red-300" : undefined,
                  )}
                  disabled={!enabled || isPending}
                  id="sign-in-password"
                  name="password"
                  placeholder={messages.auth.passwordPlaceholder}
                  type="password"
                />
                {getFieldError("password") ? <p className="text-sm text-red-200">{getFieldError("password")}</p> : null}
              </div>

              <div className="space-y-4 pt-2">
                <Button
                  className="h-14 w-full rounded-[1.45rem] bg-[linear-gradient(120deg,#f1d37d_0%,#fff5c3_32%,#c9982b_52%,#fff2b7_74%,#d1a13a_100%)] text-base font-semibold text-[#1b1407] shadow-[0_18px_35px_-16px_rgba(232,191,92,0.78)] transition-transform duration-200 hover:brightness-105 active:scale-[0.99] focus-visible:ring-[#f7e29f] disabled:cursor-not-allowed disabled:opacity-65"
                  disabled={!enabled || isPending}
                  type="submit"
                >
                  {isPending ? messages.auth.signingIn : messages.auth.signIn}
                </Button>
                <Link className="block text-center text-sm text-stone-400 transition-colors hover:text-stone-100" href="/">
                  {messages.auth.returnToPublicSite}
                </Link>
              </div>
            </form>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
