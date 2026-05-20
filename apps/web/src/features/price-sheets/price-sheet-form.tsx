"use client";

import {
  Button,
  buttonVariants,
  cn,
  Input,
  Label,
  Select,
  Textarea,
} from "@unitforge/ui";
import Link from "next/link";
import { type ReactNode, useActionState, useEffect, useState } from "react";

import type { InterfaceLocale } from "@/i18n/interface-locale";
import { getMessages } from "@/i18n/messages";
import type { PriceSheetFormActionState } from "@/server/price-sheets/actions";

import {
  getAlternatePriceSheetContentLocale,
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

const editorSectionFrameClassName =
  "relative overflow-hidden rounded-[1.65rem] border border-border/75 bg-card/95 shadow-[0_18px_55px_rgba(15,23,42,0.045)] before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-primary/25 before:to-transparent";
const editorSectionHeaderClassName =
  "flex flex-col gap-3 border-b border-border/60 bg-gradient-to-r from-muted/20 via-card/80 to-muted/10 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5";
const editorSectionBodyClassName = "p-4 sm:p-5";
const editorInnerPanelClassName =
  "rounded-[1.35rem] border border-border/65 bg-gradient-to-br from-background/95 via-card/80 to-muted/20 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]";
const editorFieldGridClassName = "grid gap-4 md:grid-cols-2";
const editorControlClassName =
  "rounded-2xl border-border/75 bg-background/95 shadow-[inset_0_1px_0_rgba(15,23,42,0.03)]";

export function PriceSheetForm({ mode, locale, action, initialValues = getEmptyPriceSheetFormValues(), cancelHref }: PriceSheetFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialFormState);
  const [values, setValues] = useState(initialValues);
  const [hasEditedSlug, setHasEditedSlug] = useState(Boolean(initialValues.slug));
  const [sheetContentTab, setSheetContentTab] = useState<ContentEditorTab>("primary");
  const [collapsedItems, setCollapsedItems] = useState(() => createInitialCollapsedItems(initialValues.items.length, mode));
  const [itemContentTabs, setItemContentTabs] = useState(() => createInitialItemContentTabs(initialValues.items.length));
  const fieldErrorEntries = state.fieldErrors ? Object.entries(state.fieldErrors) : [];
  const messages = getMessages(locale);
  const formCopy = messages.priceSheetForm;
  const secondaryLocale = getAlternatePriceSheetContentLocale(values.defaultContentLocale);
  const primaryLocaleLabel = getContentLanguageLabel(values.defaultContentLocale, formCopy);
  const secondaryLocaleLabel = getContentLanguageLabel(secondaryLocale, formCopy);

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
      businessHours: formCopy.businessHours,
      businessLocation: formCopy.businessLocation,
      businessNote: formCopy.businessNote,
      businessResponseTime: formCopy.businessResponseTime,
      currency: formCopy.currency,
      defaultContentLocale: formCopy.defaultContentLocale,
      description: formCopy.description,
      inquiryText: formCopy.inquiryText,
      items: formCopy.itemsTitle,
      presentationAppearance: formCopy.presentationAppearance,
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
    return cn(editorControlClassName, getFieldError(path) ? "border-destructive focus-visible:ring-destructive" : undefined);
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

      {mode === "edit" ? (
        <div className="rounded-[1.35rem] border border-border/70 bg-gradient-to-r from-card/95 via-background/95 to-card/95 px-3 py-2 shadow-sm">
          <div className="flex justify-end">
            <div className="inline-flex w-full flex-col gap-1.5 rounded-2xl border border-border/70 bg-background/90 p-1.5 shadow-sm sm:w-auto sm:flex-row">
              <Button className="h-9 w-full rounded-xl px-4 sm:w-auto" disabled={isPending} name="intent" type="submit" value="continue">
                {isPending ? messages.shared.saving : formCopy.saveAndContinue}
              </Button>
              <Button className="h-9 w-full rounded-xl px-4 sm:w-auto" disabled={isPending} name="intent" type="submit" value="return" variant="outline">
                {isPending ? messages.shared.saving : formCopy.saveAndReturn}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <EditorSectionFrame title={mode === "create" ? formCopy.detailsTitleCreate : formCopy.publishingSetupTitle}>
        <div className={cn(editorFieldGridClassName, "gap-4 sm:gap-5")}>
          <div className="space-y-2">
            <Label htmlFor="default-content-locale">{formCopy.defaultContentLocale}</Label>
            <Select
              aria-invalid={Boolean(getFieldError("defaultContentLocale"))}
              className={getFieldClasses("defaultContentLocale")}
              id="default-content-locale"
              value={values.defaultContentLocale}
              onChange={(event) => updateDefaultContentLocale(event.target.value as PriceSheetContentLocale)}
            >
              <option value="en-US">{formCopy.contentLanguageEnglish}</option>
              <option value="ru-RU">{formCopy.contentLanguageRussian}</option>
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

          <div className={cn(editorInnerPanelClassName, "md:col-span-2")}>
            <div className="flex items-center justify-between gap-3 border-b border-border/55 pb-3">
              <p className="text-sm font-medium">{formCopy.appearanceSetupTitle}</p>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
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
                <Label htmlFor="presentation-appearance">{formCopy.presentationAppearance}</Label>
                <Select
                  aria-invalid={Boolean(getFieldError("presentationAppearance"))}
                  className={getFieldClasses("presentationAppearance")}
                  id="presentation-appearance"
                  value={values.presentationAppearance}
                  onChange={(event) => updateTopLevelField("presentationAppearance", event.target.value)}
                >
                  <option value="dark">{formCopy.presentationAppearanceDark}</option>
                  <option value="light">{formCopy.presentationAppearanceLight}</option>
                </Select>
                {getFieldError("presentationAppearance") ? (
                  <p className="text-sm text-destructive">{getFieldError("presentationAppearance")}</p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </EditorSectionFrame>

      <EditorSectionFrame title={formCopy.contactAndCtaTitle}>
        <div className={editorFieldGridClassName}>
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
                  rows={3}
                  value={values.inquiryText}
                  onChange={(event) => updateTopLevelField("inquiryText", event.target.value)}
                />
                {getFieldError("inquiryText") ? <p className="text-sm text-destructive">{getFieldError("inquiryText")}</p> : null}
              </div>
        </div>
      </EditorSectionFrame>

      <EditorSectionFrame title={formCopy.businessDetailsTitle}>
        <div className={editorFieldGridClassName}>
                  <div className="space-y-2">
                    <Label htmlFor="business-location">{formCopy.businessLocation}</Label>
                    <Input
                      aria-invalid={Boolean(getFieldError("businessLocation"))}
                      className={getFieldClasses("businessLocation")}
                      id="business-location"
                      value={values.businessLocation}
                      onChange={(event) => updateTopLevelField("businessLocation", event.target.value)}
                    />
                    {getFieldError("businessLocation") ? (
                      <p className="text-sm text-destructive">{getFieldError("businessLocation")}</p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="business-hours">{formCopy.businessHours}</Label>
                    <Input
                      aria-invalid={Boolean(getFieldError("businessHours"))}
                      className={getFieldClasses("businessHours")}
                      id="business-hours"
                      value={values.businessHours}
                      onChange={(event) => updateTopLevelField("businessHours", event.target.value)}
                    />
                    {getFieldError("businessHours") ? <p className="text-sm text-destructive">{getFieldError("businessHours")}</p> : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="business-response-time">{formCopy.businessResponseTime}</Label>
                    <Input
                      aria-invalid={Boolean(getFieldError("businessResponseTime"))}
                      className={getFieldClasses("businessResponseTime")}
                      id="business-response-time"
                      value={values.businessResponseTime}
                      onChange={(event) => updateTopLevelField("businessResponseTime", event.target.value)}
                    />
                    {getFieldError("businessResponseTime") ? (
                      <p className="text-sm text-destructive">{getFieldError("businessResponseTime")}</p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="business-note">{formCopy.businessNote}</Label>
                    <Textarea
                      aria-invalid={Boolean(getFieldError("businessNote"))}
                      className={getFieldClasses("businessNote")}
                      id="business-note"
                      rows={3}
                      value={values.businessNote}
                      onChange={(event) => updateTopLevelField("businessNote", event.target.value)}
                    />
                    {getFieldError("businessNote") ? <p className="text-sm text-destructive">{getFieldError("businessNote")}</p> : null}
                  </div>
        </div>
      </EditorSectionFrame>

      <EditorSectionFrame
        action={
              <ContentLanguageSelect
                activeTab={sheetContentTab}
                id="sheet-content-language"
                label={formCopy.contentLanguage}
                primaryHasErrors={hasSheetTabErrors("primary")}
                primaryLocaleLabel={primaryLocaleLabel}
                secondaryLocaleLabel={secondaryLocaleLabel}
                translationHasErrors={hasSheetTabErrors("translation")}
                onChange={setSheetContentTab}
              />
        }
        title={formCopy.pageContentTitle}
      >
            <div className="rounded-2xl border border-border/65 bg-background/80 p-4 shadow-sm sm:p-5">
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
                      rows={3}
                      value={values.description}
                      onChange={(event) => updateTopLevelField("description", event.target.value)}
                    />
                    {getFieldError("description") ? <p className="text-sm text-destructive">{getFieldError("description")}</p> : null}
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 lg:grid-cols-2">
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
                      rows={3}
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
      </EditorSectionFrame>

      <EditorSectionFrame
        action={
          <Button className="w-full rounded-xl sm:w-auto" onClick={addItem} type="button" variant="outline">
            {formCopy.addItem}
          </Button>
        }
        title={formCopy.servicesItemsTitle}
      >
        <div className="space-y-4">
          {values.items.map((item, index) => {
            const isCollapsed = collapsedItems[index] ?? false;
            const activeItemTab = itemContentTabs[index] ?? "primary";
            const itemError = hasItemErrors(index);
            const itemSummary = getItemSummary(item, locale);
            const itemTitle = item.name.trim() || item.secondaryName.trim() || `${formCopy.itemLabel} ${index + 1}`;

            return (
              <div
                key={item.id ?? `item-${index}`}
                className={cn(
                  "rounded-[1.45rem] border bg-background/70 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition-colors sm:p-4",
                  itemError ? "border-destructive/40" : "border-border/70",
                )}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-3 rounded-[1.2rem] border border-border/60 bg-card/95 p-3 shadow-sm lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center">
                      <span className="w-fit rounded-full border border-primary/10 bg-primary/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                        {formCopy.itemLabel} {index + 1}
                      </span>
                      <div className="min-w-0 space-y-0.5">
                        <p className="break-words text-sm font-semibold">{itemTitle}</p>
                        {isCollapsed ? <p className="break-words text-xs text-muted-foreground">{itemSummary.description}</p> : null}
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-1 self-start rounded-2xl border border-border/70 bg-background/95 p-1 shadow-sm lg:self-center">
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
                    <div className="grid gap-4 xl:grid-cols-[minmax(180px,0.68fr)_minmax(0,1.6fr)]">
                      <div className="rounded-[1.15rem] border border-border/70 bg-card/90 p-4 shadow-sm">
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

                      <div className="rounded-[1.15rem] border border-border/70 bg-card/90 p-4 shadow-sm sm:p-5">
                        <div className="flex flex-col gap-3 border-b border-border/55 pb-3 sm:flex-row sm:items-center sm:justify-between">
                          <p className="text-sm font-medium">{formCopy.localizedContent}</p>
                          <ContentLanguageSelect
                            activeTab={activeItemTab}
                            id={`item-content-language-${index}`}
                            label={formCopy.contentLanguage}
                            primaryHasErrors={hasItemTabErrors(index, "primary")}
                            primaryLocaleLabel={primaryLocaleLabel}
                            secondaryLocaleLabel={secondaryLocaleLabel}
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
        </div>
      </EditorSectionFrame>

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

interface EditorSectionFrameProps {
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  title: string;
}

function EditorSectionFrame({ action, children, className, title }: EditorSectionFrameProps) {
  return (
    <section className={cn(editorSectionFrameClassName, className)}>
      <div className={editorSectionHeaderClassName}>
        <div className="flex min-w-0 items-center gap-3">
          <h2 className="truncate text-base font-semibold tracking-tight">{title}</h2>
        </div>
        {action ? <div className="flex shrink-0 flex-wrap items-center gap-2">{action}</div> : null}
      </div>
      <div className={editorSectionBodyClassName}>{children}</div>
    </section>
  );
}

function createInitialCollapsedItems(itemsLength: number, mode: "create" | "edit") {
  if (mode === "edit") {
    return Array.from({ length: Math.max(itemsLength, 1) }, () => true);
  }

  if (itemsLength <= 1) {
    return [false];
  }

  return Array.from({ length: itemsLength }, (_, index) => index > 0);
}

function createInitialItemContentTabs(itemsLength: number) {
  return Array.from({ length: Math.max(itemsLength, 1) }, (): ContentEditorTab => "primary");
}

function getItemSummary(item: PriceSheetItemValues, interfaceLocale: InterfaceLocale) {
  const description = item.description.trim() || item.secondaryDescription.trim() || getMessages(interfaceLocale).priceSheetForm.noDescriptionYet;

  return {
    description,
  };
}

function getContentLanguageLabel(
  locale: PriceSheetContentLocale,
  labels: {
    contentLanguageEnglish: string;
    contentLanguageRussian: string;
  },
) {
  return locale === "ru-RU" ? labels.contentLanguageRussian : labels.contentLanguageEnglish;
}

interface ContentLanguageSelectProps {
  activeTab: ContentEditorTab;
  id: string;
  label: string;
  onChange: (tab: ContentEditorTab) => void;
  primaryLocaleLabel: string;
  secondaryLocaleLabel: string;
  primaryHasErrors?: boolean;
  translationHasErrors?: boolean;
}

function ContentLanguageSelect({
  activeTab,
  id,
  label,
  onChange,
  primaryLocaleLabel,
  secondaryLocaleLabel,
  primaryHasErrors = false,
  translationHasErrors = false,
}: ContentLanguageSelectProps) {
  const hasErrors = primaryHasErrors || translationHasErrors;

  return (
    <div className="w-full rounded-2xl border border-border/65 bg-background/85 p-3 sm:w-56">
      <Label className="text-xs uppercase tracking-[0.16em] text-muted-foreground" htmlFor={id}>
        {label}
      </Label>
      <Select
        aria-invalid={hasErrors}
        className={cn(editorControlClassName, "mt-2", hasErrors ? "border-destructive focus-visible:ring-destructive" : undefined)}
        id={id}
        value={activeTab}
        onChange={(event) => onChange(event.target.value as ContentEditorTab)}
      >
        <option value="primary">{primaryLocaleLabel}</option>
        <option value="translation">{secondaryLocaleLabel}</option>
      </Select>
    </div>
  );
}
