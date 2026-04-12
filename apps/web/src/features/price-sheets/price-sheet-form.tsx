"use client";

import {
  Button,
  buttonVariants,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
  Input,
  Label,
  Select,
  Textarea,
} from "@unitforge/ui";
import Link from "next/link";
import { useActionState, useState } from "react";

import type { PriceSheetFormActionState } from "@/server/price-sheets/actions";

import { getAlternatePriceSheetContentLocale, getPriceSheetContentLocaleLabel, type PriceSheetContentLocale } from "./localization";
import {
  getEmptyPriceSheetFormValues,
  getEmptyPriceSheetItemValues,
  type PriceSheetFormValues,
  slugifyPriceSheetValue,
} from "./validation";

interface PriceSheetFormProps {
  mode: "create" | "edit";
  action: (
    previousState: PriceSheetFormActionState,
    formData: FormData,
  ) => Promise<PriceSheetFormActionState>;
  initialValues?: PriceSheetFormValues;
  cancelHref: string;
}

const initialFormState: PriceSheetFormActionState = {
  status: "idle",
};

export function PriceSheetForm({ mode, action, initialValues = getEmptyPriceSheetFormValues(), cancelHref }: PriceSheetFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialFormState);
  const [values, setValues] = useState(initialValues);
  const [hasEditedSlug, setHasEditedSlug] = useState(Boolean(initialValues.slug));
  const fieldErrorEntries = state.fieldErrors ? Object.entries(state.fieldErrors) : [];
  const secondaryLocale = getAlternatePriceSheetContentLocale(values.defaultContentLocale);
  const primaryLocaleLabel = getPriceSheetContentLocaleLabel(values.defaultContentLocale);
  const secondaryLocaleLabel = getPriceSheetContentLocaleLabel(secondaryLocale);

  function updateTopLevelField(field: keyof Omit<PriceSheetFormValues, "items">, value: string) {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
  }

  function updateDefaultContentLocale(nextLocale: PriceSheetContentLocale) {
    setValues((currentValues) => {
      if (currentValues.defaultContentLocale === nextLocale) {
        return currentValues;
      }

      return {
        ...currentValues,
        defaultContentLocale: nextLocale,
        title: currentValues.secondaryTitle || currentValues.title,
        description: currentValues.secondaryDescription || currentValues.description,
        secondaryTitle: currentValues.title,
        secondaryDescription: currentValues.description,
        items: currentValues.items.map((item) => ({
          ...item,
          name: item.secondaryName || item.name,
          description: item.secondaryDescription || item.description,
          section: item.secondarySection || item.section,
          secondaryName: item.name,
          secondaryDescription: item.description,
          secondarySection: item.section,
        })),
      };
    });
  }

  function updateTitle(value: string) {
    setValues((currentValues) => ({
      ...currentValues,
      title: value,
      slug: hasEditedSlug ? currentValues.slug : slugifyPriceSheetValue(value),
    }));
  }

  function updateSlug(value: string) {
    setHasEditedSlug(true);
    updateTopLevelField("slug", slugifyPriceSheetValue(value));
  }

  function updateItemField(index: number, field: keyof PriceSheetFormValues["items"][number], value: string) {
    setValues((currentValues) => ({
      ...currentValues,
      items: currentValues.items.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    }));
  }

  function addItem() {
    setValues((currentValues) => ({
      ...currentValues,
      items: [...currentValues.items, getEmptyPriceSheetItemValues()],
    }));
  }

  function removeItem(index: number) {
    setValues((currentValues) => ({
      ...currentValues,
      items:
        currentValues.items.length > 1
          ? currentValues.items.filter((_, itemIndex) => itemIndex !== index)
          : [getEmptyPriceSheetItemValues()],
    }));
  }

  function getFieldError(path: string) {
    return state.fieldErrors?.[path];
  }

  function getFieldErrorLabel(path: string) {
    const itemMatch = path.match(
      /^items\.(\d+)\.(name|price|section|description|secondaryName|secondaryDescription|secondarySection)$/,
    );

    if (itemMatch) {
      const fieldLabels: Record<string, string> = {
        description: "description",
        name: "name",
        price: "price",
        secondaryDescription: "translated description",
        secondaryName: "translated name",
        secondarySection: "translated category / section",
        section: "category / section",
      };
      const itemIndex = Number(itemMatch[1]) + 1;
      const fieldKey = itemMatch[2] as keyof typeof fieldLabels;

      return `Item ${itemIndex} ${fieldLabels[fieldKey] ?? "field"}`;
    }

    const topLevelLabels: Record<string, string> = {
      contactEmail: "Contact email",
      contactLabel: "Contact label",
      contactPhone: "Phone or messaging handle",
      currency: "Currency",
      defaultContentLocale: "Default content locale",
      description: "Description",
      inquiryText: "Inquiry help text",
      items: "Items",
      primaryCtaLabel: "Primary CTA label",
      secondaryDescription: "Translated description",
      secondaryCtaLabel: "Secondary CTA label",
      secondaryTitle: "Translated title",
      slug: "Slug",
      theme: "Theme",
      title: "Title",
    };

    return topLevelLabels[path] ?? "Form";
  }

  function getFieldClasses(path: string) {
    return getFieldError(path) ? "border-destructive focus-visible:ring-destructive" : undefined;
  }

  return (
    <form action={formAction} className="space-y-6">
      <input name="payload" type="hidden" value={JSON.stringify(values)} />

      {state.status === "error" && state.message ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {state.message}
        </div>
      ) : null}

      {fieldErrorEntries.length > 0 ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3">
          <p className="text-sm font-medium text-destructive">Validation errors</p>
          <ul className="mt-2 space-y-1 text-sm text-destructive">
            {fieldErrorEntries.map(([path, message]) => (
              <li key={path}>
                {getFieldErrorLabel(path)}: {message}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>{mode === "create" ? "Price Sheet details" : "Edit Price Sheet"}</CardTitle>
          <CardDescription>
            Set the default content locale, then add optional translation copy for the second language. The public page falls back to
            the default content when a translation is missing.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="default-content-locale">Default content locale</Label>
            <Select
              aria-invalid={Boolean(getFieldError("defaultContentLocale"))}
              className={getFieldClasses("defaultContentLocale")}
              id="default-content-locale"
              value={values.defaultContentLocale}
              onChange={(event) => updateDefaultContentLocale(event.target.value as PriceSheetContentLocale)}
            >
              <option value="en-US">English (en-US)</option>
              <option value="ru-RU">Russian (ru-RU)</option>
            </Select>
            {getFieldError("defaultContentLocale") ? (
              <p className="text-sm text-destructive">{getFieldError("defaultContentLocale")}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              aria-invalid={Boolean(getFieldError("status"))}
              className={getFieldClasses("status")}
              id="status"
              value={values.status}
              onChange={(event) => updateTopLevelField("status", event.target.value)}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              aria-invalid={Boolean(getFieldError("slug"))}
              className={getFieldClasses("slug")}
              id="slug"
              value={values.slug}
              onChange={(event) => updateSlug(event.target.value)}
            />
            {getFieldError("slug") ? <p className="text-sm text-destructive">{getFieldError("slug")}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="theme">Presentation theme</Label>
            <Select
              aria-invalid={Boolean(getFieldError("theme"))}
              className={getFieldClasses("theme")}
              id="theme"
              value={values.theme}
              onChange={(event) => updateTopLevelField("theme", event.target.value)}
            >
              <option value="amber">Amber</option>
              <option value="slate">Slate</option>
              <option value="stone">Stone</option>
            </Select>
            {getFieldError("theme") ? <p className="text-sm text-destructive">{getFieldError("theme")}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Input
              aria-invalid={Boolean(getFieldError("currency"))}
              className={getFieldClasses("currency")}
              id="currency"
              maxLength={3}
              value={values.currency}
              onChange={(event) => updateTopLevelField("currency", event.target.value.toUpperCase())}
            />
            {getFieldError("currency") ? <p className="text-sm text-destructive">{getFieldError("currency")}</p> : null}
          </div>

          <div className="rounded-3xl border border-border/70 bg-background/70 p-5 md:col-span-2">
            <p className="text-sm font-medium">Public contact and CTA</p>
            <p className="mt-1 text-sm text-muted-foreground">
              These details appear on the public page. Leave any field blank to hide it cleanly.
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contact-label">Business or contact label</Label>
                <Input
                  aria-invalid={Boolean(getFieldError("contactLabel"))}
                  className={getFieldClasses("contactLabel")}
                  id="contact-label"
                  value={values.contactLabel}
                  onChange={(event) => updateTopLevelField("contactLabel", event.target.value)}
                />
                {getFieldError("contactLabel") ? <p className="text-sm text-destructive">{getFieldError("contactLabel")}</p> : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-email">Contact email</Label>
                <Input
                  aria-invalid={Boolean(getFieldError("contactEmail"))}
                  className={getFieldClasses("contactEmail")}
                  id="contact-email"
                  type="email"
                  value={values.contactEmail}
                  onChange={(event) => updateTopLevelField("contactEmail", event.target.value)}
                />
                {getFieldError("contactEmail") ? <p className="text-sm text-destructive">{getFieldError("contactEmail")}</p> : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-phone">Phone or messaging handle</Label>
                <Input
                  aria-invalid={Boolean(getFieldError("contactPhone"))}
                  className={getFieldClasses("contactPhone")}
                  id="contact-phone"
                  value={values.contactPhone}
                  onChange={(event) => updateTopLevelField("contactPhone", event.target.value)}
                />
                {getFieldError("contactPhone") ? <p className="text-sm text-destructive">{getFieldError("contactPhone")}</p> : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="primary-cta-label">Primary CTA label</Label>
                <Input
                  aria-invalid={Boolean(getFieldError("primaryCtaLabel"))}
                  className={getFieldClasses("primaryCtaLabel")}
                  id="primary-cta-label"
                  value={values.primaryCtaLabel}
                  onChange={(event) => updateTopLevelField("primaryCtaLabel", event.target.value)}
                />
                {getFieldError("primaryCtaLabel") ? (
                  <p className="text-sm text-destructive">{getFieldError("primaryCtaLabel")}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondary-cta-label">Secondary CTA label</Label>
                <Input
                  aria-invalid={Boolean(getFieldError("secondaryCtaLabel"))}
                  className={getFieldClasses("secondaryCtaLabel")}
                  id="secondary-cta-label"
                  value={values.secondaryCtaLabel}
                  onChange={(event) => updateTopLevelField("secondaryCtaLabel", event.target.value)}
                />
                {getFieldError("secondaryCtaLabel") ? (
                  <p className="text-sm text-destructive">{getFieldError("secondaryCtaLabel")}</p>
                ) : null}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="inquiry-text">Public inquiry help text</Label>
                <Textarea
                  aria-invalid={Boolean(getFieldError("inquiryText"))}
                  className={getFieldClasses("inquiryText")}
                  id="inquiry-text"
                  value={values.inquiryText}
                  onChange={(event) => updateTopLevelField("inquiryText", event.target.value)}
                />
                {getFieldError("inquiryText") ? <p className="text-sm text-destructive">{getFieldError("inquiryText")}</p> : null}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border/70 bg-background/70 p-5 md:col-span-2">
            <p className="text-sm font-medium">Primary content</p>
            <p className="mt-1 text-sm text-muted-foreground">{primaryLocaleLabel}</p>
            <div className="mt-4 grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  aria-invalid={Boolean(getFieldError("title"))}
                  className={getFieldClasses("title")}
                  id="title"
                  value={values.title}
                  onChange={(event) => updateTitle(event.target.value)}
                />
                {getFieldError("title") ? <p className="text-sm text-destructive">{getFieldError("title")}</p> : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  aria-invalid={Boolean(getFieldError("description"))}
                  className={getFieldClasses("description")}
                  id="description"
                  value={values.description}
                  onChange={(event) => updateTopLevelField("description", event.target.value)}
                />
                {getFieldError("description") ? <p className="text-sm text-destructive">{getFieldError("description")}</p> : null}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-dashed border-border/80 bg-background/60 p-5 md:col-span-2">
            <p className="text-sm font-medium">Optional translated content</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {secondaryLocaleLabel}. Leave blank to keep public pages falling back to the default content locale.
            </p>
            <div className="mt-4 grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="secondary-title">Translated title</Label>
                <Input
                  aria-invalid={Boolean(getFieldError("secondaryTitle"))}
                  className={getFieldClasses("secondaryTitle")}
                  id="secondary-title"
                  value={values.secondaryTitle}
                  onChange={(event) => updateTopLevelField("secondaryTitle", event.target.value)}
                />
                {getFieldError("secondaryTitle") ? <p className="text-sm text-destructive">{getFieldError("secondaryTitle")}</p> : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondary-description">Translated description</Label>
                <Textarea
                  aria-invalid={Boolean(getFieldError("secondaryDescription"))}
                  className={getFieldClasses("secondaryDescription")}
                  id="secondary-description"
                  value={values.secondaryDescription}
                  onChange={(event) => updateTopLevelField("secondaryDescription", event.target.value)}
                />
                {getFieldError("secondaryDescription") ? (
                  <p className="text-sm text-destructive">{getFieldError("secondaryDescription")}</p>
                ) : null}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Items</CardTitle>
              <CardDescription>Enter primary content first, then add optional translated copy for the second locale.</CardDescription>
            </div>
            <Button onClick={addItem} type="button" variant="outline">
              Add item
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {values.items.map((item, index) => (
            <div key={item.id ?? `item-${index}`} className="rounded-3xl border border-border/70 bg-background/70 p-5">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-medium">Item {index + 1}</p>
                  <p className="text-sm text-muted-foreground">Price is shared across languages. Content can differ by locale.</p>
                </div>
                <Button onClick={() => removeItem(index)} type="button" variant="ghost">
                  Remove
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`item-price-${index}`}>Price</Label>
                <Input
                  aria-invalid={Boolean(getFieldError(`items.${index}.price`))}
                  className={getFieldClasses(`items.${index}.price`)}
                  id={`item-price-${index}`}
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  type="number"
                  value={item.price}
                  onChange={(event) => updateItemField(index, "price", event.target.value)}
                />
                {getFieldError(`items.${index}.price`) ? (
                  <p className="text-sm text-destructive">{getFieldError(`items.${index}.price`)}</p>
                ) : null}
              </div>

              <div className="mt-5 grid gap-5 xl:grid-cols-2">
                <div className="space-y-4 rounded-3xl border border-border/70 bg-card/80 p-4">
                  <div>
                    <p className="text-sm font-medium">Primary content</p>
                    <p className="text-sm text-muted-foreground">{primaryLocaleLabel}</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`item-name-${index}`}>Name</Label>
                    <Input
                      aria-invalid={Boolean(getFieldError(`items.${index}.name`))}
                      className={getFieldClasses(`items.${index}.name`)}
                      id={`item-name-${index}`}
                      value={item.name}
                      onChange={(event) => updateItemField(index, "name", event.target.value)}
                    />
                    {getFieldError(`items.${index}.name`) ? (
                      <p className="text-sm text-destructive">{getFieldError(`items.${index}.name`)}</p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`item-section-${index}`}>Category / section</Label>
                    <Input
                      aria-invalid={Boolean(getFieldError(`items.${index}.section`))}
                      className={getFieldClasses(`items.${index}.section`)}
                      id={`item-section-${index}`}
                      value={item.section}
                      onChange={(event) => updateItemField(index, "section", event.target.value)}
                    />
                    {getFieldError(`items.${index}.section`) ? (
                      <p className="text-sm text-destructive">{getFieldError(`items.${index}.section`)}</p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`item-description-${index}`}>Description</Label>
                    <Textarea
                      aria-invalid={Boolean(getFieldError(`items.${index}.description`))}
                      className={getFieldClasses(`items.${index}.description`)}
                      id={`item-description-${index}`}
                      value={item.description}
                      onChange={(event) => updateItemField(index, "description", event.target.value)}
                    />
                    {getFieldError(`items.${index}.description`) ? (
                      <p className="text-sm text-destructive">{getFieldError(`items.${index}.description`)}</p>
                    ) : null}
                  </div>
                </div>

                <div className="space-y-4 rounded-3xl border border-dashed border-border/80 bg-card/60 p-4">
                  <div>
                    <p className="text-sm font-medium">Optional translated content</p>
                    <p className="text-sm text-muted-foreground">{secondaryLocaleLabel}</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`item-secondary-name-${index}`}>Translated name</Label>
                    <Input
                      aria-invalid={Boolean(getFieldError(`items.${index}.secondaryName`))}
                      className={getFieldClasses(`items.${index}.secondaryName`)}
                      id={`item-secondary-name-${index}`}
                      value={item.secondaryName}
                      onChange={(event) => updateItemField(index, "secondaryName", event.target.value)}
                    />
                    {getFieldError(`items.${index}.secondaryName`) ? (
                      <p className="text-sm text-destructive">{getFieldError(`items.${index}.secondaryName`)}</p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`item-secondary-section-${index}`}>Translated category / section</Label>
                    <Input
                      aria-invalid={Boolean(getFieldError(`items.${index}.secondarySection`))}
                      className={getFieldClasses(`items.${index}.secondarySection`)}
                      id={`item-secondary-section-${index}`}
                      value={item.secondarySection}
                      onChange={(event) => updateItemField(index, "secondarySection", event.target.value)}
                    />
                    {getFieldError(`items.${index}.secondarySection`) ? (
                      <p className="text-sm text-destructive">{getFieldError(`items.${index}.secondarySection`)}</p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`item-secondary-description-${index}`}>Translated description</Label>
                    <Textarea
                      aria-invalid={Boolean(getFieldError(`items.${index}.secondaryDescription`))}
                      className={getFieldClasses(`items.${index}.secondaryDescription`)}
                      id={`item-secondary-description-${index}`}
                      value={item.secondaryDescription}
                      onChange={(event) => updateItemField(index, "secondaryDescription", event.target.value)}
                    />
                    {getFieldError(`items.${index}.secondaryDescription`) ? (
                      <p className="text-sm text-destructive">{getFieldError(`items.${index}.secondaryDescription`)}</p>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {getFieldError("items") ? <p className="text-sm text-destructive">{getFieldError("items")}</p> : null}
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <Button disabled={isPending} type="submit">
          {isPending ? "Saving..." : mode === "create" ? "Create Price Sheet" : "Save changes"}
        </Button>
        <Link className={cn(buttonVariants({ size: "default", variant: "outline" }))} href={cancelHref}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
