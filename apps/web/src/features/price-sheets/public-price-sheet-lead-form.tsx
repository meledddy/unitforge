"use client";

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, cn, Input, Label, Textarea } from "@unitforge/ui";
import { useActionState, useEffect, useState } from "react";

import { getPriceSheetLeadCopy, type PriceSheetLeadFormCopy } from "@/features/price-sheets/lead-form";
import type { PriceSheetContentLocale, PriceSheetInterfaceLanguage } from "@/features/price-sheets/localization";
import type { PublicPriceSheetTheme } from "@/features/price-sheets/public-theme";
import { type PriceSheetLeadActionState, submitPriceSheetLeadAction } from "@/server/price-sheet-leads/actions";

interface PublicPriceSheetLeadFormProps {
  interfaceLanguage: PriceSheetInterfaceLanguage;
  locale: PriceSheetContentLocale;
  priceSheetSlug: string;
  inquiryEnabled: boolean;
  theme: PublicPriceSheetTheme;
}

interface LeadFormValues {
  contactName: string;
  companyOrBusinessName: string;
  email: string;
  phoneOrHandle: string;
  message: string;
}

const initialActionState: PriceSheetLeadActionState = {
  status: "idle",
};

const initialFormValues: LeadFormValues = {
  contactName: "",
  companyOrBusinessName: "",
  email: "",
  phoneOrHandle: "",
  message: "",
};

export function PublicPriceSheetLeadForm({
  interfaceLanguage,
  locale,
  priceSheetSlug,
  inquiryEnabled,
  theme,
}: PublicPriceSheetLeadFormProps) {
  const copy = getPriceSheetLeadCopy(interfaceLanguage);
  const [state, formAction, isPending] = useActionState(submitPriceSheetLeadAction, initialActionState);
  const [values, setValues] = useState(initialFormValues);
  const [isExpanded, setIsExpanded] = useState(false);
  const fieldErrorEntries = state.fieldErrors ? Object.entries(state.fieldErrors) : [];
  const hasSubmissionErrors = state.status === "error" || fieldErrorEntries.length > 0;
  const formRegionId = `lead-form-${priceSheetSlug}`;

  useEffect(() => {
    if (hasSubmissionErrors) {
      setIsExpanded(true);
    }
  }, [hasSubmissionErrors]);

  if (!inquiryEnabled) {
    return (
      <Card className={cn("rounded-[1.6rem]", theme.leadCardClassName)}>
        <CardHeader>
          <CardTitle className={theme.leadTitleClassName}>{copy.hiddenTitle}</CardTitle>
          <CardDescription className={theme.leadDescriptionClassName}>{copy.hiddenDescription}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (state.status === "success") {
    return (
      <Card className={cn("rounded-[1.6rem]", theme.leadCardClassName)}>
        <CardHeader>
          <CardTitle className={theme.leadTitleClassName}>{copy.successTitle}</CardTitle>
          <CardDescription className={theme.leadDescriptionClassName}>{state.message || copy.successDescription}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  function updateField(field: keyof LeadFormValues, value: string) {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
  }

  function getFieldError(field: keyof LeadFormValues) {
    return state.fieldErrors?.[field];
  }

  function getFieldClasses(field: keyof LeadFormValues) {
    return getFieldError(field) ? theme.leadFieldErrorClassName : undefined;
  }

  function getFieldErrorId(field: keyof LeadFormValues) {
    return `lead-${field}-error`;
  }

  return (
    <Card className={cn("rounded-[1.6rem]", theme.leadCardClassName)}>
      <CardHeader className="space-y-2 p-5 pb-3">
        <CardDescription className={theme.leadEyebrowClassName}>{copy.eyebrow}</CardDescription>
        <CardTitle className={theme.leadTitleClassName}>{copy.title}</CardTitle>
        <CardDescription className={theme.leadDescriptionClassName}>{copy.description}</CardDescription>
        <p className={cn("text-sm leading-6", theme.leadDescriptionClassName)}>{copy.helperText}</p>
        <Button
          aria-controls={formRegionId}
          aria-expanded={isExpanded}
          className={cn("mt-2 w-full sm:w-auto", theme.primaryButtonClassName)}
          type="button"
          onClick={() => setIsExpanded((currentValue) => !currentValue)}
        >
          {isExpanded ? copy.closeFormLabel : copy.openFormLabel}
        </Button>
      </CardHeader>
      <CardContent
        aria-hidden={!isExpanded}
        className={cn(
          "grid overflow-hidden px-5 transition-[grid-template-rows,opacity,transform,padding-bottom] duration-300 ease-out motion-reduce:transition-none motion-reduce:transform-none",
          isExpanded
            ? "grid-rows-[1fr] pb-5 opacity-100 translate-y-0"
            : "pointer-events-none grid-rows-[0fr] pb-0 opacity-0 -translate-y-1",
        )}
        id={formRegionId}
      >
        <div className="min-h-0 overflow-hidden">
        <form action={formAction} className="space-y-3.5">
          <input name="priceSheetSlug" type="hidden" value={priceSheetSlug} />
          <input name="locale" type="hidden" value={locale} />
          <input name="language" type="hidden" value={interfaceLanguage} />

          {state.status === "error" && state.message ? (
            <div aria-live="polite" className={cn("rounded-2xl border px-4 py-3 text-sm", theme.leadErrorSummaryClassName)} role="alert">
              {state.message}
            </div>
          ) : null}

          {fieldErrorEntries.length > 0 ? (
            <div className={cn("rounded-2xl border px-4 py-3", theme.leadErrorSummaryClassName)}>
              <p className="text-sm font-medium">{copy.validationTitle}</p>
              <ul className="mt-2 space-y-1 text-sm">
                {fieldErrorEntries.map(([field, message]) => (
                  <li key={field}>
                    {getFieldLabel(field, copy)}: {message}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="space-y-2">
            <Label className={theme.leadLabelClassName} htmlFor="lead-contact-name">
              {copy.contactNameLabel}
            </Label>
            <Input
              aria-describedby={getFieldError("contactName") ? getFieldErrorId("contactName") : undefined}
              aria-invalid={Boolean(getFieldError("contactName"))}
              autoComplete="name"
              className={cn(theme.leadInputClassName, getFieldClasses("contactName"))}
              disabled={!isExpanded}
              id="lead-contact-name"
              name="contactName"
              value={values.contactName}
              onChange={(event) => updateField("contactName", event.target.value)}
            />
            {getFieldError("contactName") ? (
              <p className={cn("text-sm", theme.leadErrorTextClassName)} id={getFieldErrorId("contactName")}>
                {getFieldError("contactName")}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label className={theme.leadLabelClassName} htmlFor="lead-company-name">
              {copy.companyNameLabel}
            </Label>
            <Input
              aria-describedby={getFieldError("companyOrBusinessName") ? getFieldErrorId("companyOrBusinessName") : undefined}
              aria-invalid={Boolean(getFieldError("companyOrBusinessName"))}
              autoComplete="organization"
              className={cn(theme.leadInputClassName, getFieldClasses("companyOrBusinessName"))}
              disabled={!isExpanded}
              id="lead-company-name"
              name="companyOrBusinessName"
              value={values.companyOrBusinessName}
              onChange={(event) => updateField("companyOrBusinessName", event.target.value)}
            />
            {getFieldError("companyOrBusinessName") ? (
              <p className={cn("text-sm", theme.leadErrorTextClassName)} id={getFieldErrorId("companyOrBusinessName")}>
                {getFieldError("companyOrBusinessName")}
              </p>
            ) : null}
          </div>

          <div className="grid gap-3.5">
            <div className="space-y-2">
              <Label className={theme.leadLabelClassName} htmlFor="lead-email">
                {copy.emailLabel}
              </Label>
              <Input
                aria-describedby={getFieldError("email") ? getFieldErrorId("email") : undefined}
                aria-invalid={Boolean(getFieldError("email"))}
                autoComplete="email"
                className={cn(theme.leadInputClassName, getFieldClasses("email"))}
                disabled={!isExpanded}
                id="lead-email"
                name="email"
                type="email"
                value={values.email}
                onChange={(event) => updateField("email", event.target.value)}
              />
              {getFieldError("email") ? (
                <p className={cn("text-sm", theme.leadErrorTextClassName)} id={getFieldErrorId("email")}>
                  {getFieldError("email")}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label className={theme.leadLabelClassName} htmlFor="lead-phone">
                {copy.phoneLabel}
              </Label>
              <Input
                aria-describedby={getFieldError("phoneOrHandle") ? getFieldErrorId("phoneOrHandle") : undefined}
                aria-invalid={Boolean(getFieldError("phoneOrHandle"))}
                autoComplete="tel"
                className={cn(theme.leadInputClassName, getFieldClasses("phoneOrHandle"))}
                disabled={!isExpanded}
                id="lead-phone"
                name="phoneOrHandle"
                value={values.phoneOrHandle}
                onChange={(event) => updateField("phoneOrHandle", event.target.value)}
              />
              {getFieldError("phoneOrHandle") ? (
                <p className={cn("text-sm", theme.leadErrorTextClassName)} id={getFieldErrorId("phoneOrHandle")}>
                  {getFieldError("phoneOrHandle")}
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label className={theme.leadLabelClassName} htmlFor="lead-message">
              {copy.messageLabel}
            </Label>
            <Textarea
              aria-describedby={getFieldError("message") ? getFieldErrorId("message") : undefined}
              aria-invalid={Boolean(getFieldError("message"))}
              autoComplete="off"
              className={cn(theme.leadTextareaClassName, getFieldClasses("message"))}
              disabled={!isExpanded}
              id="lead-message"
              name="message"
              rows={6}
              value={values.message}
              onChange={(event) => updateField("message", event.target.value)}
            />
            {getFieldError("message") ? (
              <p className={cn("text-sm", theme.leadErrorTextClassName)} id={getFieldErrorId("message")}>
                {getFieldError("message")}
              </p>
            ) : null}
          </div>

          <Button className={cn("w-full", theme.leadSubmitButtonClassName)} disabled={!isExpanded || isPending} type="submit">
            {isPending ? copy.submittingLabel : copy.submitLabel}
          </Button>
        </form>
        </div>
      </CardContent>
    </Card>
  );
}

function getFieldLabel(field: string, copy: PriceSheetLeadFormCopy) {
  const labels: Record<string, string> = {
    companyOrBusinessName: copy.companyNameLabel,
    contactName: copy.contactNameLabel,
    email: copy.emailLabel,
    message: copy.messageLabel,
    phoneOrHandle: copy.phoneLabel,
  };

  return labels[field] ?? "Form";
}
