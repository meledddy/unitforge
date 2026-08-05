"use client";

import { Button, cn, Input, Label, Textarea } from "@unitforge/ui";
import Link from "next/link";
import { type ReactNode, useActionState, useEffect, useRef } from "react";

import type { InterfaceLocale } from "@/i18n/interface-locale";
import { submitAccessRequestAction } from "@/server/access-requests/actions";

import {
  type AccessRequestSource,
  getAccessRequestCopy,
  initialAccessRequestActionState,
} from "./access-request-form";

interface AccessRequestFormCardProps {
  locale: InterfaceLocale;
  source?: AccessRequestSource;
}

const contactFormCopy = {
  en: {
    eyebrow: "Contact",
    title: "Send a message.",
    description: "Ask about access, billing, privacy, or the product.",
    businessNameLabel: "Subject",
    businessNamePlaceholder: "Access, billing, privacy…",
    contactNameLabel: "Your name",
    emailLabel: "Email",
    noteLabel: "Message",
    noteOptional: "",
    notePlaceholder: "How can we help?",
    submitLabel: "Send message",
    submittingLabel: "Sending…",
    successTitle: "Message received",
    successDescription: "Your message is now in the Unitforge inbox.",
  },
  ru: {
    eyebrow: "Контакты",
    title: "Отправьте сообщение.",
    description: "Спросите о доступе, оплате, данных или продукте.",
    businessNameLabel: "Тема",
    businessNamePlaceholder: "Доступ, оплата, данные…",
    contactNameLabel: "Ваше имя",
    emailLabel: "Почта",
    noteLabel: "Сообщение",
    noteOptional: "",
    notePlaceholder: "Чем мы можем помочь?",
    submitLabel: "Отправить сообщение",
    submittingLabel: "Отправка…",
    successTitle: "Сообщение получено",
    successDescription: "Сообщение сохранено во входящих Unitforge.",
  },
} as const;

const fieldClassName =
  "marketing-focus-ring min-h-12 rounded-[0.9rem] border-[hsl(var(--marketing-border-strong)/0.42)] bg-[hsl(var(--marketing-surface)/0.76)] px-4 text-base text-[hsl(var(--marketing-foreground))] shadow-[inset_0_1px_0_hsl(var(--marketing-foreground)/0.035)] placeholder:text-[hsl(var(--marketing-foreground-muted)/0.72)] focus-visible:ring-[hsl(var(--marketing-accent))] focus-visible:ring-offset-[hsl(var(--marketing-surface-elevated))]";

export function AccessRequestFormCard({
  locale,
  source = "request-access",
}: AccessRequestFormCardProps) {
  const baseCopy = getAccessRequestCopy(locale);
  const copy =
    source === "contact"
      ? { ...baseCopy, ...contactFormCopy[locale] }
      : baseCopy;
  const [state, formAction, isPending] = useActionState(
    submitAccessRequestAction,
    initialAccessRequestActionState,
  );
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const formId = source === "contact" ? "contact-form" : "access-request-form";

  useEffect(() => {
    function focusFormFromHash() {
      if (window.location.hash === `#${formId}`) {
        window.requestAnimationFrame(() => {
          firstFieldRef.current?.focus({ preventScroll: true });
        });
      }
    }

    focusFormFromHash();
    window.addEventListener("hashchange", focusFormFromHash);

    return () => window.removeEventListener("hashchange", focusFormFromHash);
  }, [formId]);

  useEffect(() => {
    if (state.status === "error") {
      errorSummaryRef.current?.focus();
    }
  }, [state]);

  function getFieldError(field: string) {
    return state.fieldErrors?.[field];
  }

  if (state.status === "success") {
    return (
      <section
        aria-live="polite"
        className="scroll-mt-28 rounded-[2rem] border border-[hsl(var(--marketing-border)/0.7)] bg-[hsl(var(--marketing-surface-elevated)/0.82)] p-7 shadow-[0_30px_76px_-48px_hsl(var(--marketing-shadow)/0.34)] sm:p-8"
        id={formId}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--marketing-accent-soft)/0.55)] text-xl text-[hsl(var(--marketing-accent))]">
          ✓
        </div>
        <h2 className="mt-6 font-serif text-3xl font-medium tracking-[-0.045em] text-[hsl(var(--marketing-foreground))]">
          {copy.successTitle}
        </h2>
        <p className="mt-3 max-w-md text-base leading-7 text-[hsl(var(--marketing-foreground-soft))]">
          {state.message ?? copy.successDescription}
        </p>
      </section>
    );
  }

  return (
    <section
      className="scroll-mt-28 rounded-[2rem] border border-[hsl(var(--marketing-border)/0.7)] bg-[hsl(var(--marketing-surface-elevated)/0.82)] p-6 shadow-[0_30px_76px_-48px_hsl(var(--marketing-shadow)/0.34)] sm:p-7"
      id={formId}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[hsl(var(--marketing-accent))]">
        {copy.eyebrow}
      </p>
      <h2 className="mt-3 font-serif text-3xl font-medium tracking-[-0.045em] text-[hsl(var(--marketing-foreground))]">
        {copy.title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-[hsl(var(--marketing-foreground-soft))]">
        {copy.description}
      </p>

      <form action={formAction} className="mt-6 space-y-4" noValidate>
        <input name="locale" type="hidden" value={locale} />
        <input name="source" type="hidden" value={source} />
        <div
          aria-hidden="true"
          className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"
        >
          <Label htmlFor="access-request-website">Website</Label>
          <Input
            autoComplete="off"
            id="access-request-website"
            name="website"
            tabIndex={-1}
          />
        </div>

        {state.status === "error" && state.message ? (
          <div
            className="bg-red-500/8 rounded-[0.9rem] border border-red-500/30 px-4 py-3 text-sm leading-6 text-[hsl(var(--marketing-error))] outline-none"
            ref={errorSummaryRef}
            role="alert"
            tabIndex={-1}
          >
            {state.message}
          </div>
        ) : null}

        <FormField
          error={getFieldError("businessName")}
          id="access-request-business-name"
          label={copy.businessNameLabel}
        >
          <Input
            aria-describedby={
              getFieldError("businessName")
                ? "access-request-business-name-error"
                : undefined
            }
            aria-invalid={Boolean(getFieldError("businessName"))}
            autoComplete="organization"
            className={cn(
              fieldClassName,
              getFieldError("businessName") && "border-red-500/60",
            )}
            disabled={isPending}
            id="access-request-business-name"
            maxLength={160}
            name="businessName"
            placeholder={copy.businessNamePlaceholder}
            ref={firstFieldRef}
            required
          />
        </FormField>

        <FormField
          error={getFieldError("contactName")}
          id="access-request-contact-name"
          label={copy.contactNameLabel}
        >
          <Input
            aria-describedby={
              getFieldError("contactName")
                ? "access-request-contact-name-error"
                : undefined
            }
            aria-invalid={Boolean(getFieldError("contactName"))}
            autoComplete="name"
            className={cn(
              fieldClassName,
              getFieldError("contactName") && "border-red-500/60",
            )}
            disabled={isPending}
            id="access-request-contact-name"
            maxLength={120}
            name="contactName"
            placeholder={copy.contactNamePlaceholder}
            required
          />
        </FormField>

        <FormField
          error={getFieldError("email")}
          id="access-request-email"
          label={copy.emailLabel}
        >
          <Input
            aria-describedby={
              getFieldError("email") ? "access-request-email-error" : undefined
            }
            aria-invalid={Boolean(getFieldError("email"))}
            autoComplete="email"
            className={cn(
              fieldClassName,
              getFieldError("email") && "border-red-500/60",
            )}
            disabled={isPending}
            id="access-request-email"
            inputMode="email"
            maxLength={160}
            name="email"
            placeholder={copy.emailPlaceholder}
            required
            type="email"
          />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            error={getFieldError("phone")}
            id="access-request-phone"
            label={copy.phoneLabel}
            optionalLabel={copy.phoneOptional}
          >
            <Input
              aria-describedby={
                getFieldError("phone")
                  ? "access-request-phone-error"
                  : undefined
              }
              aria-invalid={Boolean(getFieldError("phone"))}
              autoComplete="tel"
              className={cn(
                fieldClassName,
                getFieldError("phone") && "border-red-500/60",
              )}
              disabled={isPending}
              id="access-request-phone"
              inputMode="tel"
              maxLength={120}
              name="phone"
              placeholder={copy.phonePlaceholder}
              type="tel"
            />
          </FormField>

          <FormField
            error={getFieldError("note")}
            id="access-request-note"
            label={copy.noteLabel}
            optionalLabel={copy.noteOptional}
          >
            <Textarea
              aria-describedby={
                getFieldError("note") ? "access-request-note-error" : undefined
              }
              aria-invalid={Boolean(getFieldError("note"))}
              className={cn(
                fieldClassName,
                "min-h-28 resize-y py-3",
                getFieldError("note") && "border-red-500/60",
              )}
              disabled={isPending}
              id="access-request-note"
              maxLength={1_200}
              name="note"
              placeholder={copy.notePlaceholder}
            />
          </FormField>
        </div>

        <p className="text-xs leading-5 text-[hsl(var(--marketing-foreground-muted))]">
          {copy.privacyPrefix}{" "}
          <Link
            className="marketing-focus-ring rounded-sm underline decoration-[hsl(var(--marketing-accent)/0.48)] underline-offset-4"
            href="/privacy"
          >
            {copy.privacyLinkLabel}
          </Link>
          .
        </p>

        <Button
          className="marketing-focus-ring h-[3.25rem] w-full rounded-full bg-[hsl(var(--marketing-primary))] px-6 text-base font-semibold text-[hsl(var(--marketing-primary-foreground))] shadow-[0_20px_44px_-24px_hsl(var(--marketing-shadow)/0.5)] transition-[transform,filter] duration-200 hover:-translate-y-px hover:brightness-[1.02] active:translate-y-0 motion-reduce:transition-none"
          disabled={isPending}
          type="submit"
        >
          {isPending ? copy.submittingLabel : copy.submitLabel}
        </Button>
      </form>
    </section>
  );
}

interface FormFieldProps {
  children: ReactNode;
  error?: string;
  id: string;
  label: string;
  optionalLabel?: string;
}

function FormField({
  children,
  error,
  id,
  label,
  optionalLabel,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <Label
          className="text-sm font-medium text-[hsl(var(--marketing-foreground))]"
          htmlFor={id}
        >
          {label}
        </Label>
        {optionalLabel ? (
          <span className="text-xs text-[hsl(var(--marketing-foreground-muted))]">
            {optionalLabel}
          </span>
        ) : null}
      </div>
      {children}
      {error ? (
        <p
          className="text-sm text-[hsl(var(--marketing-error))]"
          id={`${id}-error`}
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
