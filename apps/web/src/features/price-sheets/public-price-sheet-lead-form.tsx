"use client";

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label, Textarea } from "@unitforge/ui";
import { useActionState, useState } from "react";

import { getPriceSheetLeadCopy, type PriceSheetLeadFormCopy } from "@/features/price-sheets/lead-form";
import type { PriceSheetContentLocale, PriceSheetInterfaceLanguage } from "@/features/price-sheets/localization";
import { type PriceSheetLeadActionState,submitPriceSheetLeadAction } from "@/server/price-sheet-leads/actions";

interface PublicPriceSheetLeadFormProps {
  interfaceLanguage: PriceSheetInterfaceLanguage;
  locale: PriceSheetContentLocale;
  priceSheetSlug: string;
  inquiryEnabled: boolean;
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
}: PublicPriceSheetLeadFormProps) {
  const copy = getPriceSheetLeadCopy(interfaceLanguage);
  const [state, formAction, isPending] = useActionState(submitPriceSheetLeadAction, initialActionState);
  const [values, setValues] = useState(initialFormValues);

  if (!inquiryEnabled) {
    return (
      <Card className="border-border/70 bg-card/95">
        <CardHeader>
          <CardTitle>{copy.hiddenTitle}</CardTitle>
          <CardDescription>{copy.hiddenDescription}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (state.status === "success") {
    return (
      <Card className="border-border/70 bg-card/95">
        <CardHeader>
          <CardTitle>{copy.successTitle}</CardTitle>
          <CardDescription>{state.message || copy.successDescription}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const fieldErrorEntries = state.fieldErrors ? Object.entries(state.fieldErrors) : [];

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
    return getFieldError(field) ? "border-destructive focus-visible:ring-destructive" : undefined;
  }

  return (
    <Card className="border-border/70 bg-card/95">
      <CardHeader>
        <CardDescription>{copy.eyebrow}</CardDescription>
        <CardTitle>{copy.title}</CardTitle>
        <CardDescription>{copy.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <input name="priceSheetSlug" type="hidden" value={priceSheetSlug} />
          <input name="locale" type="hidden" value={locale} />
          <input name="language" type="hidden" value={interfaceLanguage} />

          {state.status === "error" && state.message ? (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {state.message}
            </div>
          ) : null}

          {fieldErrorEntries.length > 0 ? (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3">
              <p className="text-sm font-medium text-destructive">{copy.validationTitle}</p>
              <ul className="mt-2 space-y-1 text-sm text-destructive">
                {fieldErrorEntries.map(([field, message]) => (
                  <li key={field}>
                    {getFieldLabel(field, copy)}: {message}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="lead-contact-name">{copy.contactNameLabel}</Label>
            <Input
              aria-invalid={Boolean(getFieldError("contactName"))}
              className={getFieldClasses("contactName")}
              id="lead-contact-name"
              name="contactName"
              value={values.contactName}
              onChange={(event) => updateField("contactName", event.target.value)}
            />
            {getFieldError("contactName") ? <p className="text-sm text-destructive">{getFieldError("contactName")}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lead-company-name">{copy.companyNameLabel}</Label>
            <Input
              aria-invalid={Boolean(getFieldError("companyOrBusinessName"))}
              className={getFieldClasses("companyOrBusinessName")}
              id="lead-company-name"
              name="companyOrBusinessName"
              value={values.companyOrBusinessName}
              onChange={(event) => updateField("companyOrBusinessName", event.target.value)}
            />
            {getFieldError("companyOrBusinessName") ? (
              <p className="text-sm text-destructive">{getFieldError("companyOrBusinessName")}</p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="lead-email">{copy.emailLabel}</Label>
              <Input
                aria-invalid={Boolean(getFieldError("email"))}
                className={getFieldClasses("email")}
                id="lead-email"
                name="email"
                type="email"
                value={values.email}
                onChange={(event) => updateField("email", event.target.value)}
              />
              {getFieldError("email") ? <p className="text-sm text-destructive">{getFieldError("email")}</p> : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lead-phone">{copy.phoneLabel}</Label>
              <Input
                aria-invalid={Boolean(getFieldError("phoneOrHandle"))}
                className={getFieldClasses("phoneOrHandle")}
                id="lead-phone"
                name="phoneOrHandle"
                value={values.phoneOrHandle}
                onChange={(event) => updateField("phoneOrHandle", event.target.value)}
              />
              {getFieldError("phoneOrHandle") ? <p className="text-sm text-destructive">{getFieldError("phoneOrHandle")}</p> : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lead-message">{copy.messageLabel}</Label>
            <Textarea
              aria-invalid={Boolean(getFieldError("message"))}
              className={getFieldClasses("message")}
              id="lead-message"
              name="message"
              rows={6}
              value={values.message}
              onChange={(event) => updateField("message", event.target.value)}
            />
            {getFieldError("message") ? <p className="text-sm text-destructive">{getFieldError("message")}</p> : null}
          </div>

          <Button disabled={isPending} type="submit">
            {isPending ? copy.submittingLabel : copy.submitLabel}
          </Button>
        </form>
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
