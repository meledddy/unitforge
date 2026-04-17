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
import { useActionState, useEffect, useState } from "react";

import type { InterfaceLocale } from "@/i18n/interface-locale";
import { getMessages } from "@/i18n/messages";
import type { PriceSheetFormActionState } from "@/server/price-sheets/actions";

import {
  getAlternatePriceSheetContentLocale,
  getPriceSheetContentLocaleLabel,
  type PriceSheetContentLocale,
} from "./localization";
import {
  getEmptyPriceSheetFormValues,
  getEmptyPriceSheetItemValues,
  type PriceSheetFormValues,
  slugifyPriceSheetValue,
} from "./validation";

interface PriceSheetFormProps {
  mode: "create" | "edit";
  locale: InterfaceLocale;
  action: (
    previousState: PriceSheetFormActionState,
    formData: FormData,
  ) => Promise<PriceSheetFormActionState>;
  initialValues?: PriceSheetFormValues;
  cancelHref: string;
}

type PriceSheetItemValues = PriceSheetFormValues["items"][number];
type ContentEditorTab = "primary" | "translation";

const initialFormState: PriceSheetFormActionState = {
  status: "idle",
};

export function PriceSheetForm({ mode, locale, action, initialValues = getEmptyPriceSheetFormValues(), cancelHref }: PriceSheetFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialFormState);
  const [values, setValues] = useState(initialValues);
  const [hasEditedSlug, setHasEditedSlug] = useState(Boolean(initialValues.slug));
  const [sheetContentTab, setSheetContentTab] = useState<ContentEditorTab>("primary");
  const [collapsedItems, setCollapsedItems] = useState(() => createInitialCollapsedItems(initialValues.items.length));
  const [itemContentTabs, setItemContentTabs] = useState(() => createInitialItemContentTabs(initialValues.items.length));
  const fieldErrorEntries = state.fieldErrors ? Object.entries(state.fieldErrors) : [];
  const secondaryLocale = getAlternatePriceSheetContentLocale(values.defaultContentLocale);
  const primaryLocaleLabel = getPriceSheetContentLocaleLabel(values.defaultContentLocale);
  const secondaryLocaleLabel = getPriceSheetContentLocaleLabel(secondaryLocale);
  const messages = getMessages(locale);
  const formCopy = messages.priceSheetForm;

  useEffect(() => {
    if (!state.fieldErrors) {
      return;
    }

    const itemIndexesWithErrors = new Set<number>();
    const itemTabsWithErrors = new Map<number, ContentEditorTab>();
    let nextSheetContentTab: ContentEditorTab | null = null;

    for (const path of Object.keys(state.fieldErrors)) {
      if (path === "secondaryTitle" || path === "secondaryDescription") {
        nextSheetContentTab = "translation";
      } else if ((path === "title" || path === "description") && nextSheetContentTab !== "translation") {
        nextSheetContentTab = "primary";
      }

      const itemMatch = path.match(/^items\.(\d+)\./);

      if (itemMatch) {
        const itemIndex = Number(itemMatch[1]);
        itemIndexesWithErrors.add(itemIndex);

        if (path.startsWith(`items.${itemIndex}.secondary`)) {
          itemTabsWithErrors.set(itemIndex, "translation");
        } else if (!path.endsWith(".price") && !itemTabsWithErrors.has(itemIndex)) {
          itemTabsWithErrors.set(itemIndex, "primary");
        }
      }
    }

    if (itemIndexesWithErrors.size === 0) {
      if (nextSheetContentTab) {
        setSheetContentTab(nextSheetContentTab);
      }
      return;
    }

    setCollapsedItems((currentState) =>
      currentState.map((isCollapsed, index) => (itemIndexesWithErrors.has(index) ? false : isCollapsed)),
    );

    if (nextSheetContentTab) {
      setSheetContentTab(nextSheetContentTab);
    }

    if (itemTabsWithErrors.size > 0) {
      setItemContentTabs((currentState) =>
        currentState.map((tab, index) => itemTabsWithErrors.get(index) ?? tab ?? "primary"),
      );
    }
  }, [state.fieldErrors]);

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

  function updateItemField(index: number, field: keyof PriceSheetItemValues, value: string) {
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
    setCollapsedItems((currentState) => [...currentState, false]);
    setItemContentTabs((currentState) => [...currentState, "primary"]);
  }

  function duplicateItem(index: number) {
    setValues((currentValues) => {
      const sourceItem = currentValues.items[index];

      if (!sourceItem) {
        return currentValues;
      }

      const duplicatedItem: PriceSheetItemValues = {
        ...sourceItem,
        id: undefined,
      };

      return {
        ...currentValues,
        items: [...currentValues.items.slice(0, index + 1), duplicatedItem, ...currentValues.items.slice(index + 1)],
      };
    });
    setCollapsedItems((currentState) => [...currentState.slice(0, index + 1), false, ...currentState.slice(index + 1)]);
    setItemContentTabs((currentState) => [
      ...currentState.slice(0, index + 1),
      currentState[index] ?? "primary",
      ...currentState.slice(index + 1),
    ]);
  }

  function removeItem(index: number) {
    setValues((currentValues) => ({
      ...currentValues,
      items:
        currentValues.items.length > 1
          ? currentValues.items.filter((_, itemIndex) => itemIndex !== index)
          : [getEmptyPriceSheetItemValues()],
    }));

    setCollapsedItems((currentState) =>
      currentState.length > 1 ? currentState.filter((_, itemIndex) => itemIndex !== index) : [false],
    );
    setItemContentTabs((currentState) =>
      currentState.length > 1 ? currentState.filter((_, itemIndex) => itemIndex !== index) : ["primary"],
    );
  }

  function toggleItem(index: number) {
    setCollapsedItems((currentState) => currentState.map((isCollapsed, itemIndex) => (itemIndex === index ? !isCollapsed : isCollapsed)));
  }

  function setItemContentTab(index: number, tab: ContentEditorTab) {
    setItemContentTabs((currentState) => currentState.map((currentTab, itemIndex) => (itemIndex === index ? tab : currentTab)));
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
        description: formCopy.description.toLowerCase(),
        name: formCopy.name.toLowerCase(),
        price: formCopy.price.toLowerCase(),
        secondaryDescription: formCopy.translatedDescription.toLowerCase(),
        secondaryName: formCopy.translatedName.toLowerCase(),
        secondarySection: formCopy.translatedCategory.toLowerCase(),
        section: formCopy.category.toLowerCase(),
      };
      const itemIndex = Number(itemMatch[1]) + 1;
      const fieldKey = itemMatch[2] as keyof typeof fieldLabels;

      return `${formCopy.itemLabel} ${itemIndex} ${fieldLabels[fieldKey] ?? formCopy.title.toLowerCase()}`;
    }

    const topLevelLabels: Record<string, string> = {
      contactEmail: formCopy.contactEmail,
      contactLabel: formCopy.contactLabel,
      contactPhone: formCopy.contactPhone,
      currency: formCopy.currency,
      defaultContentLocale: formCopy.defaultContentLocale,
      description: formCopy.description,
      inquiryText: formCopy.inquiryText,
      items: formCopy.itemsTitle,
      primaryCtaLabel: formCopy.primaryCtaLabel,
      publicInquiryState: formCopy.publicInquiryState,
      secondaryDescription: formCopy.translatedDescription,
      secondaryCtaLabel: formCopy.secondaryCtaLabel,
      secondaryTitle: formCopy.translatedTitle,
      slug: formCopy.slug,
      theme: formCopy.theme,
      title: formCopy.title,
    };

    return topLevelLabels[path] ?? formCopy.title;
  }

  function getFieldClasses(path: string) {
    return getFieldError(path) ? "border-destructive focus-visible:ring-destructive" : undefined;
  }

  function hasItemErrors(index: number) {
    return fieldErrorEntries.some(([path]) => path.startsWith(`items.${index}.`));
  }

  function hasSheetTabErrors(tab: ContentEditorTab) {
    const fieldPaths =
      tab === "primary"
        ? ["title", "description"]
        : ["secondaryTitle", "secondaryDescription"];

    return fieldPaths.some((path) => Boolean(getFieldError(path)));
  }

  function hasItemTabErrors(index: number, tab: ContentEditorTab) {
    const fieldPaths =
      tab === "primary"
        ? [`items.${index}.name`, `items.${index}.section`, `items.${index}.description`]
        : [`items.${index}.secondaryName`, `items.${index}.secondarySection`, `items.${index}.secondaryDescription`];

    return fieldPaths.some((path) => Boolean(getFieldError(path)));
  }

  return (
    <form action={formAction} className="space-y-5 sm:space-y-6">
      <input name="payload" type="hidden" value={JSON.stringify(values)} />

      {state.status === "success" && state.message ? (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-700">
          {state.message}
        </div>
      ) : null}

      {state.status === "error" && state.message ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {state.message}
        </div>
      ) : null}

      {fieldErrorEntries.length > 0 ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3">
          <p className="text-sm font-medium text-destructive">{formCopy.validationErrors}</p>
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
          <CardTitle>{mode === "create" ? formCopy.detailsTitleCreate : formCopy.detailsTitleEdit}</CardTitle>
          <CardDescription>{formCopy.detailsDescription}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 sm:gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="default-content-locale">{formCopy.defaultContentLocale}</Label>
            <Select
              aria-invalid={Boolean(getFieldError("defaultContentLocale"))}
              className={getFieldClasses("defaultContentLocale")}
              id="default-content-locale"
              value={values.defaultContentLocale}
              onChange={(event) => updateDefaultContentLocale(event.target.value as PriceSheetContentLocale)}
            >
              <option value="en-US">English (en-US)</option>
              <option value="ru-RU">Русский (ru-RU)</option>
            </Select>
            {getFieldError("defaultContentLocale") ? (
              <p className="text-sm text-destructive">{getFieldError("defaultContentLocale")}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">{formCopy.status}</Label>
            <Select
              aria-invalid={Boolean(getFieldError("status"))}
              className={getFieldClasses("status")}
              id="status"
              value={values.status}
              onChange={(event) => updateTopLevelField("status", event.target.value)}
            >
              <option value="draft">{messages.shared.draft}</option>
              <option value="published">{messages.shared.published}</option>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">{formCopy.slug}</Label>
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
            <Label htmlFor="theme">{formCopy.theme}</Label>
            <Select
              aria-invalid={Boolean(getFieldError("theme"))}
              className={getFieldClasses("theme")}
              id="theme"
              value={values.theme}
              onChange={(event) => updateTopLevelField("theme", event.target.value)}
            >
              <option value="amber">{formCopy.themeAmber}</option>
              <option value="slate">{formCopy.themeSlate}</option>
              <option value="stone">{formCopy.themeStone}</option>
            </Select>
            {getFieldError("theme") ? <p className="text-sm text-destructive">{getFieldError("theme")}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">{formCopy.currency}</Label>
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

          <div className="rounded-3xl border border-border/70 bg-background/70 p-4 sm:p-5 md:col-span-2">
            <p className="text-sm font-medium">{formCopy.contactAndCtaTitle}</p>
            <p className="mt-1 text-sm text-muted-foreground">{formCopy.contactAndCtaDescription}</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contact-label">{formCopy.contactLabel}</Label>
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
                <Label htmlFor="contact-email">{formCopy.contactEmail}</Label>
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
                <Label htmlFor="contact-phone">{formCopy.contactPhone}</Label>
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
                <Label htmlFor="primary-cta-label">{formCopy.primaryCtaLabel}</Label>
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
                <Label htmlFor="public-inquiry-state">{formCopy.publicInquiryState}</Label>
                <Select
                  aria-invalid={Boolean(getFieldError("publicInquiryState"))}
                  className={getFieldClasses("publicInquiryState")}
                  id="public-inquiry-state"
                  value={values.publicInquiryState}
                  onChange={(event) => updateTopLevelField("publicInquiryState", event.target.value)}
                >
                  <option value="enabled">{formCopy.publicInquiryEnabled}</option>
                  <option value="hidden">{formCopy.publicInquiryHidden}</option>
                </Select>
                {getFieldError("publicInquiryState") ? (
                  <p className="text-sm text-destructive">{getFieldError("publicInquiryState")}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondary-cta-label">{formCopy.secondaryCtaLabel}</Label>
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
                <Label htmlFor="inquiry-text">{formCopy.inquiryText}</Label>
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

          <div className="rounded-3xl border border-border/70 bg-background/70 p-4 sm:p-5 md:col-span-2">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">{formCopy.contentTitle}</p>
                <p className="text-sm text-muted-foreground">{formCopy.translationHint}</p>
              </div>
              <EditorTabSwitcher
                activeTab={sheetContentTab}
                primaryHasErrors={hasSheetTabErrors("primary")}
                primaryTabLabel={formCopy.primaryContentTab}
                primaryLocaleLabel={primaryLocaleLabel}
                secondaryLocaleLabel={secondaryLocaleLabel}
                translationOptionalSuffix={formCopy.translationOptionalSuffix}
                translationTabLabel={formCopy.translationTab}
                translationHasErrors={hasSheetTabErrors("translation")}
                onChange={setSheetContentTab}
              />
            </div>

            <div className="mt-4 rounded-2xl border border-border/70 bg-card/80 p-4 sm:p-5">
              {sheetContentTab === "primary" ? (
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="space-y-2 lg:col-span-2">
                    <Label htmlFor="title">{formCopy.title}</Label>
                    <Input
                      aria-invalid={Boolean(getFieldError("title"))}
                      className={getFieldClasses("title")}
                      id="title"
                      value={values.title}
                      onChange={(event) => updateTitle(event.target.value)}
                    />
                    {getFieldError("title") ? <p className="text-sm text-destructive">{getFieldError("title")}</p> : null}
                  </div>

                  <div className="space-y-2 lg:col-span-2">
                    <Label htmlFor="description">{formCopy.description}</Label>
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
              ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="space-y-2 lg:col-span-2">
                    <p className="text-sm text-muted-foreground">
                      {secondaryLocaleLabel}. {formCopy.translationHint}
                    </p>
                  </div>

                  <div className="space-y-2 lg:col-span-2">
                    <Label htmlFor="secondary-title">{formCopy.translatedTitle}</Label>
                    <Input
                      aria-invalid={Boolean(getFieldError("secondaryTitle"))}
                      className={getFieldClasses("secondaryTitle")}
                      id="secondary-title"
                      value={values.secondaryTitle}
                      onChange={(event) => updateTopLevelField("secondaryTitle", event.target.value)}
                    />
                    {getFieldError("secondaryTitle") ? <p className="text-sm text-destructive">{getFieldError("secondaryTitle")}</p> : null}
                  </div>

                  <div className="space-y-2 lg:col-span-2">
                    <Label htmlFor="secondary-description">{formCopy.translatedDescription}</Label>
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
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <CardTitle>{formCopy.itemsTitle}</CardTitle>
              <CardDescription>{formCopy.itemsDescription}</CardDescription>
            </div>
            <Button className="w-full sm:w-auto" onClick={addItem} type="button" variant="outline">
              {formCopy.addItem}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {values.items.map((item, index) => {
            const isCollapsed = collapsedItems[index] ?? false;
            const activeItemTab = itemContentTabs[index] ?? "primary";
            const itemError = hasItemErrors(index);
            const itemSummary = getItemSummary(item, values.currency, locale, values.defaultContentLocale);

            return (
              <div
                key={item.id ?? `item-${index}`}
                className={cn(
                  "rounded-3xl border bg-background/70 p-4 transition-colors sm:p-5",
                  itemError ? "border-destructive/40" : "border-border/70",
                )}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-border/70 bg-card/80 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                          {formCopy.itemLabel} {index + 1}
                        </span>
                        <span className="rounded-full border border-border/70 bg-card/80 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                          {itemSummary.price}
                        </span>
                        {itemSummary.section ? (
                          <span className="rounded-full border border-border/70 bg-card/80 px-2.5 py-1 text-xs text-muted-foreground">
                            {itemSummary.section}
                          </span>
                        ) : null}
                      </div>
                      <div className="space-y-1">
                        <p className="truncate font-medium">{item.name.trim() || `${formCopy.itemLabel} ${index + 1}`}</p>
                        {isCollapsed ? <p className="text-sm text-muted-foreground">{itemSummary.description}</p> : null}
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-1 self-start rounded-2xl border border-border/70 bg-card/80 p-1">
                      <Button
                        className="h-8 rounded-xl px-3"
                        onClick={() => toggleItem(index)}
                        size="sm"
                        type="button"
                        variant="secondary"
                      >
                        {isCollapsed ? formCopy.expand : formCopy.collapse}
                      </Button>
                      <Button
                        className="h-8 rounded-xl px-3"
                        onClick={() => duplicateItem(index)}
                        size="sm"
                        type="button"
                        variant="outline"
                      >
                        {messages.shared.duplicate}
                      </Button>
                      <Button
                        className="h-8 rounded-xl px-3 text-muted-foreground"
                        onClick={() => removeItem(index)}
                        size="sm"
                        type="button"
                        variant="ghost"
                      >
                        {formCopy.remove}
                      </Button>
                    </div>
                  </div>

                  {!isCollapsed ? (
                    <div className="grid gap-4 xl:grid-cols-[minmax(0,208px),minmax(0,1fr)]">
                      <div className="rounded-2xl border border-border/70 bg-card/80 p-4">
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium">{formCopy.sharedFields}</p>
                        </div>
                        <div className="mt-3 space-y-2">
                          <Label htmlFor={`item-price-${index}`}>{formCopy.price}</Label>
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
                      </div>

                      <div className="rounded-2xl border border-border/70 bg-card/80 p-4 sm:p-5">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <p className="text-sm font-medium">{formCopy.localizedContent}</p>
                          <EditorTabSwitcher
                            activeTab={activeItemTab}
                            primaryHasErrors={hasItemTabErrors(index, "primary")}
                            primaryTabLabel={formCopy.primaryContentTab}
                            primaryLocaleLabel={primaryLocaleLabel}
                            secondaryLocaleLabel={secondaryLocaleLabel}
                            translationOptionalSuffix={formCopy.translationOptionalSuffix}
                            translationTabLabel={formCopy.translationTab}
                            translationHasErrors={hasItemTabErrors(index, "translation")}
                            onChange={(tab) => setItemContentTab(index, tab)}
                          />
                        </div>

                        <div className="mt-4">
                          {activeItemTab === "primary" ? (
                            <div className="grid gap-4 lg:grid-cols-2">
                              <div className="space-y-2">
                                <Label htmlFor={`item-name-${index}`}>{formCopy.name}</Label>
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
                                <Label htmlFor={`item-section-${index}`}>{formCopy.category}</Label>
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

                              <div className="space-y-2 lg:col-span-2">
                                <Label htmlFor={`item-description-${index}`}>{formCopy.description}</Label>
                                <Textarea
                                  aria-invalid={Boolean(getFieldError(`items.${index}.description`))}
                                  className={getFieldClasses(`items.${index}.description`)}
                                  id={`item-description-${index}`}
                                  rows={3}
                                  value={item.description}
                                  onChange={(event) => updateItemField(index, "description", event.target.value)}
                                />
                                {getFieldError(`items.${index}.description`) ? (
                                  <p className="text-sm text-destructive">{getFieldError(`items.${index}.description`)}</p>
                                ) : null}
                              </div>
                            </div>
                          ) : (
                            <div className="grid gap-4 lg:grid-cols-2">
                              <div className="space-y-2">
                                <Label htmlFor={`item-secondary-name-${index}`}>{formCopy.translatedName}</Label>
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
                                <Label htmlFor={`item-secondary-section-${index}`}>{formCopy.translatedCategory}</Label>
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

                              <div className="space-y-2 lg:col-span-2">
                                <Label htmlFor={`item-secondary-description-${index}`}>{formCopy.translatedDescription}</Label>
                                <Textarea
                                  aria-invalid={Boolean(getFieldError(`items.${index}.secondaryDescription`))}
                                  className={getFieldClasses(`items.${index}.secondaryDescription`)}
                                  id={`item-secondary-description-${index}`}
                                  rows={3}
                                  value={item.secondaryDescription}
                                  onChange={(event) => updateItemField(index, "secondaryDescription", event.target.value)}
                                />
                                {getFieldError(`items.${index}.secondaryDescription`) ? (
                                  <p className="text-sm text-destructive">{getFieldError(`items.${index}.secondaryDescription`)}</p>
                                ) : null}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}

          {getFieldError("items") ? <p className="text-sm text-destructive">{getFieldError("items")}</p> : null}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        {mode === "create" ? (
          <Button className="w-full sm:w-auto" disabled={isPending} type="submit">
            {isPending ? formCopy.creating : formCopy.create}
          </Button>
        ) : (
          <>
            <Button className="w-full sm:w-auto" disabled={isPending} name="intent" type="submit" value="continue">
              {isPending ? messages.shared.saving : formCopy.saveAndContinue}
            </Button>
            <Button className="w-full sm:w-auto" disabled={isPending} name="intent" type="submit" value="return" variant="outline">
              {isPending ? messages.shared.saving : formCopy.saveAndReturn}
            </Button>
          </>
        )}
        <Link className={cn(buttonVariants({ size: "default", variant: "outline" }), "w-full sm:w-auto")} href={cancelHref}>
          {formCopy.cancel}
        </Link>
      </div>
    </form>
  );
}

function createInitialCollapsedItems(itemsLength: number) {
  if (itemsLength <= 1) {
    return [false];
  }

  return Array.from({ length: itemsLength }, (_, index) => index > 0);
}

function createInitialItemContentTabs(itemsLength: number) {
  return Array.from({ length: Math.max(itemsLength, 1) }, (): ContentEditorTab => "primary");
}

function getItemSummary(
  item: PriceSheetItemValues,
  currency: string,
  interfaceLocale: InterfaceLocale,
  contentLocale: PriceSheetContentLocale,
) {
  const description = item.description.trim() || item.secondaryDescription.trim() || getMessages(interfaceLocale).priceSheetForm.noDescriptionYet;
  const section = item.section.trim() || item.secondarySection.trim();

  return {
    description,
    price: formatItemSummaryPrice(item.price, currency, interfaceLocale, contentLocale),
    section,
  };
}

function formatItemSummaryPrice(
  value: string,
  currency: string,
  interfaceLocale: InterfaceLocale,
  contentLocale: PriceSheetContentLocale,
) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return getMessages(interfaceLocale).priceSheetForm.noPriceYet;
  }

  const amount = Number(trimmedValue);

  if (!Number.isFinite(amount)) {
    return trimmedValue;
  }

  try {
    return new Intl.NumberFormat(contentLocale, {
      style: "currency",
      currency,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

interface EditorTabSwitcherProps {
  activeTab: ContentEditorTab;
  onChange: (tab: ContentEditorTab) => void;
  primaryTabLabel: string;
  primaryLocaleLabel: string;
  secondaryLocaleLabel: string;
  translationOptionalSuffix: string;
  translationTabLabel: string;
  primaryHasErrors?: boolean;
  translationHasErrors?: boolean;
}

function EditorTabSwitcher({
  activeTab,
  onChange,
  primaryTabLabel,
  primaryLocaleLabel,
  secondaryLocaleLabel,
  translationOptionalSuffix,
  translationTabLabel,
  primaryHasErrors = false,
  translationHasErrors = false,
}: EditorTabSwitcherProps) {
  return (
    <div className="inline-flex rounded-2xl border border-border/70 bg-background/80 p-1">
      <EditorTabButton
        active={activeTab === "primary"}
        hasErrors={primaryHasErrors}
        label={primaryTabLabel}
        localeLabel={primaryLocaleLabel}
        onClick={() => onChange("primary")}
      />
      <EditorTabButton
        active={activeTab === "translation"}
        hasErrors={translationHasErrors}
        label={translationTabLabel}
        localeLabel={`${secondaryLocaleLabel} ${translationOptionalSuffix}`}
        onClick={() => onChange("translation")}
      />
    </div>
  );
}

interface EditorTabButtonProps {
  active: boolean;
  hasErrors: boolean;
  label: string;
  localeLabel: string;
  onClick: () => void;
}

function EditorTabButton({ active, hasErrors, label, localeLabel, onClick }: EditorTabButtonProps) {
  return (
    <button
      aria-pressed={active}
      className={cn(
        "min-w-[132px] rounded-xl px-3 py-2 text-left transition-colors",
        active ? "bg-foreground text-background shadow-sm" : "text-foreground hover:bg-card",
      )}
      type="button"
      onClick={onClick}
    >
      <span className="flex items-center gap-2 text-sm font-medium">
        {label}
        {hasErrors ? <span className={cn("h-2 w-2 rounded-full", active ? "bg-background" : "bg-destructive")} /> : null}
      </span>
      <span className={cn("mt-1 block text-xs", active ? "text-background/75" : "text-muted-foreground")}>{localeLabel}</span>
    </button>
  );
}
