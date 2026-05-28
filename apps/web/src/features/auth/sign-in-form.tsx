"use client";

import { Button, Card, CardContent, CardHeader, CardTitle, cn, Input, Label } from "@unitforge/ui";
import Link from "next/link";
import { useActionState } from "react";

import type { InterfaceLocale } from "@/i18n/interface-locale";
import { getMessages } from "@/i18n/messages";
import { signInAction } from "@/server/auth/actions";
import { initialSignInActionState } from "@/server/auth/sign-in-state";

interface SignInFormProps {
  locale: InterfaceLocale;
  next?: string;
  showBackLink?: boolean;
  showHeader?: boolean;
}

export function SignInForm({ locale, next, showBackLink = true, showHeader = true }: SignInFormProps) {
  const [state, formAction, isPending] = useActionState(signInAction, initialSignInActionState);
  const messages = getMessages(locale);

  function getFieldError(field: "email" | "password") {
    return state.fieldErrors?.[field];
  }

  return (
    <div className="w-full max-w-[398px]">
      <Card
        className="relative overflow-hidden rounded-[1.15rem] border border-[hsl(var(--login-border)/0.72)] bg-[hsl(var(--login-surface)/0.78)] text-[hsl(var(--login-foreground))] shadow-[0_32px_92px_-46px_hsl(var(--login-shadow)/0.82),inset_0_1px_0_hsl(var(--login-foreground)/0.065)] backdrop-blur-2xl"
      >
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,hsl(var(--login-accent)/0.52),transparent)]" />
        <div>
          {showHeader ? (
            <CardHeader className="space-y-2 p-7 sm:p-8">
              <CardTitle className="text-3xl font-semibold tracking-tight text-[hsl(var(--login-foreground))] sm:text-4xl">{messages.auth.title}</CardTitle>
              <p className="text-sm leading-6 text-[hsl(var(--login-foreground-muted))]">{messages.auth.formSubtitle}</p>
            </CardHeader>
          ) : null}
          <CardContent className={cn("p-6 sm:p-7", showHeader ? "pt-0 sm:pt-0" : undefined)}>
            <form action={formAction} className="space-y-4">
              <input name="next" type="hidden" value={next ?? ""} />

              {state.status === "error" && state.message ? (
                <div className="rounded-[1rem] border border-red-300/25 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                  {state.message}
                </div>
              ) : null}

              <div className="space-y-2">
                <Label className="text-sm font-medium text-[hsl(var(--login-foreground-soft))]" htmlFor="sign-in-email">
                  {messages.auth.email}
                </Label>
                <Input
                  aria-invalid={Boolean(getFieldError("email"))}
                  className={cn(
                    "h-[3.25rem] rounded-[1rem] border-[hsl(var(--login-border)/0.82)] bg-[hsl(var(--login-surface-muted)/0.68)] px-4 text-base text-[hsl(var(--login-foreground))] shadow-[inset_0_1px_0_hsl(var(--login-foreground)/0.04)] placeholder:text-[hsl(var(--login-foreground-muted)/0.76)] focus-visible:ring-[hsl(var(--login-accent))] focus-visible:ring-offset-[hsl(var(--login-surface))]",
                    getFieldError("email") ? "border-red-400/70 focus-visible:ring-red-300" : undefined,
                  )}
                  disabled={isPending}
                  id="sign-in-email"
                  name="email"
                  placeholder={messages.auth.emailPlaceholder}
                  type="email"
                />
                {getFieldError("email") ? <p className="text-sm text-red-200">{getFieldError("email")}</p> : null}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-[hsl(var(--login-foreground-soft))]" htmlFor="sign-in-password">
                  {messages.auth.password}
                </Label>
                <Input
                  aria-invalid={Boolean(getFieldError("password"))}
                  className={cn(
                    "h-[3.25rem] rounded-[1rem] border-[hsl(var(--login-border)/0.82)] bg-[hsl(var(--login-surface-muted)/0.68)] px-4 text-base text-[hsl(var(--login-foreground))] shadow-[inset_0_1px_0_hsl(var(--login-foreground)/0.04)] placeholder:text-[hsl(var(--login-foreground-muted)/0.76)] focus-visible:ring-[hsl(var(--login-accent))] focus-visible:ring-offset-[hsl(var(--login-surface))]",
                    getFieldError("password") ? "border-red-400/70 focus-visible:ring-red-300" : undefined,
                  )}
                  disabled={isPending}
                  id="sign-in-password"
                  name="password"
                  placeholder={messages.auth.passwordPlaceholder}
                  type="password"
                />
                {getFieldError("password") ? <p className="text-sm text-red-200">{getFieldError("password")}</p> : null}
              </div>

              <div className="space-y-4 pt-2">
                <Button
                  className="h-[3.25rem] w-full rounded-[1rem] bg-[linear-gradient(135deg,hsl(var(--login-accent-strong))_0%,hsl(var(--login-mark-cream))_44%,hsl(var(--login-accent))_100%)] text-base font-semibold text-[hsl(var(--login-button-text))] shadow-[0_20px_42px_-20px_hsl(var(--login-accent)/0.88),inset_0_1px_0_hsl(var(--login-foreground)/0.46)] transition-[filter,transform] duration-200 hover:brightness-105 active:scale-[0.99] focus-visible:ring-[hsl(var(--login-mark-cream))] disabled:cursor-not-allowed disabled:opacity-65"
                  disabled={isPending}
                  type="submit"
                >
                  {isPending ? messages.auth.signingIn : messages.auth.signIn}
                </Button>
                {showBackLink ? (
                  <Link className="block text-center text-sm text-[hsl(var(--login-foreground-muted))] transition-colors hover:text-[hsl(var(--login-accent))]" href="/">
                    {messages.auth.returnToPublicSite}
                  </Link>
                ) : null}
              </div>
            </form>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
