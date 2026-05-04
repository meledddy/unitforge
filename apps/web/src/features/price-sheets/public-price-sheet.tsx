import { Badge, buttonVariants, Card, CardContent, CardDescription, CardHeader, CardTitle, cn } from "@unitforge/ui";
import Link from "next/link";

import type { PriceSheetInterfaceLanguage } from "@/features/price-sheets/localization";
import {
  mapInterfaceLanguageToPriceSheetContentLocale,
  resolvePriceSheetContent,
  resolvePriceSheetInterfaceLanguage,
  resolvePriceSheetItemContent,
} from "@/features/price-sheets/localization";
import { PublicPriceSheetLeadForm } from "@/features/price-sheets/public-price-sheet-lead-form";
import { getPublicPriceSheetTheme, type PublicPriceSheetTheme } from "@/features/price-sheets/public-theme";
import type { InterfaceLocale } from "@/i18n/interface-locale";
import type { PublishedPriceSheet } from "@/server/price-sheets/service";

interface PublicPriceSheetProps {
  interfaceLocale: InterfaceLocale;
  priceSheet: PublishedPriceSheet;
  requestedContentLanguage?: string;
}

interface PublicPriceSheetCopy {
  publishedEyebrow: string;
  languageLabel: string;
  catalogEyebrow: string;
  summaryEyebrow: string;
  summaryTitle: string;
  browseTitle: string;
  browseDescription: string;
  allServicesTitle: string;
  generalSectionTitle: string;
  updatedLabel: string;
  currencyLabel: string;
  localeLabel: string;
  itemCountLabel: string;
  sectionCountLabel: string;
  contactEyebrow: string;
  contactTitle: string;
  businessDetailsEyebrow: string;
  businessDetailsTitle: string;
  businessLocationLabel: string;
  businessHoursLabel: string;
  businessResponseTimeLabel: string;
  businessNoteLabel: string;
  emailLabel: string;
  phoneLabel: string;
  noItemsTitle: string;
  noItemsDescription: string;
}

interface LocalizedPublicPriceSheetItem {
  id: string;
  name: string;
  description: string | null;
  section: string | null;
  priceCents: number;
}

interface PriceSheetSection {
  title: string;
  items: LocalizedPublicPriceSheetItem[];
}

interface BusinessDetail {
  label: string;
  value: string;
}

const publicPriceSheetCopy: Record<PriceSheetInterfaceLanguage, PublicPriceSheetCopy> = {
  en: {
    publishedEyebrow: "Public price list",
    languageLabel: "Language",
    catalogEyebrow: "Price list",
    summaryEyebrow: "At a glance",
    summaryTitle: "Pricing details",
    browseTitle: "Services and rates",
    browseDescription: "Browse available services, compare sections, and use this page as the current customer-facing price reference.",
    allServicesTitle: "Services",
    generalSectionTitle: "General",
    updatedLabel: "Updated",
    currencyLabel: "Currency",
    localeLabel: "Content locale",
    itemCountLabel: "Items",
    sectionCountLabel: "Sections",
    contactEyebrow: "Contact",
    contactTitle: "Get in touch",
    businessDetailsEyebrow: "Business details",
    businessDetailsTitle: "Useful details",
    businessLocationLabel: "Address",
    businessHoursLabel: "Working hours",
    businessResponseTimeLabel: "Response time",
    businessNoteLabel: "Note",
    emailLabel: "Email",
    phoneLabel: "Phone / messaging",
    noItemsTitle: "This price list is being updated",
    noItemsDescription: "Published service items have not been added yet.",
  },
  ru: {
    publishedEyebrow: "Публичный прайс-лист",
    languageLabel: "Язык",
    catalogEyebrow: "Прайс-лист",
    summaryEyebrow: "Кратко",
    summaryTitle: "Детали прайса",
    browseTitle: "Услуги и цены",
    browseDescription: "Просмотрите доступные услуги, сравните разделы и используйте эту страницу как актуальный прайс для клиентов.",
    allServicesTitle: "Услуги",
    generalSectionTitle: "Общее",
    updatedLabel: "Обновлено",
    currencyLabel: "Валюта",
    localeLabel: "Язык контента",
    itemCountLabel: "Позиции",
    sectionCountLabel: "Разделы",
    contactEyebrow: "Контакты",
    contactTitle: "Связаться",
    businessDetailsEyebrow: "О бизнесе",
    businessDetailsTitle: "Полезные детали",
    businessLocationLabel: "Адрес",
    businessHoursLabel: "Рабочие часы",
    businessResponseTimeLabel: "Время ответа",
    businessNoteLabel: "Заметка",
    emailLabel: "Почта",
    phoneLabel: "Телефон / мессенджер",
    noItemsTitle: "Прайс-лист обновляется",
    noItemsDescription: "Опубликованные позиции пока не добавлены.",
  },
};

const supportedLanguageOptions = [
  { value: "en", label: "EN" },
  { value: "ru", label: "RU" },
] as const;

export function PublicPriceSheet({ interfaceLocale, priceSheet, requestedContentLanguage }: PublicPriceSheetProps) {
  const interfaceLanguage: PriceSheetInterfaceLanguage = interfaceLocale;
  const copy = publicPriceSheetCopy[interfaceLanguage];
  const contentLanguage = resolvePriceSheetInterfaceLanguage(requestedContentLanguage ?? interfaceLanguage, priceSheet.defaultContentLocale);
  const contentLocale = mapInterfaceLanguageToPriceSheetContentLocale(contentLanguage);
  const localizedSheet = resolvePriceSheetContent({
    defaultContentLocale: priceSheet.defaultContentLocale,
    requestedContentLocale: contentLocale,
    title: priceSheet.title,
    description: priceSheet.description,
    translations: priceSheet.translations,
  });
  const localizedItems = priceSheet.items.map((item) => {
    const localizedItem = resolvePriceSheetItemContent({
      defaultContentLocale: priceSheet.defaultContentLocale,
      requestedContentLocale: contentLocale,
      name: item.name,
      description: item.description,
      section: item.section,
      translations: item.translations,
    });

    return {
      id: item.id,
      name: localizedItem.name,
      description: localizedItem.description,
      section: localizedItem.section,
      priceCents: item.priceCents,
    } satisfies LocalizedPublicPriceSheetItem;
  });
  const theme = getPublicPriceSheetTheme(priceSheet.theme);
  const sections = groupPriceSheetItems(localizedItems, copy);
  const updatedAt = new Intl.DateTimeFormat(contentLocale, { dateStyle: "medium" }).format(priceSheet.updatedAt);
  const introText = buildIntroText(priceSheet, sections.length, interfaceLanguage, contentLocale);
  const summaryText = localizedSheet.description?.trim() || introText;
  const publicContactActions = getPublicContactActions(priceSheet, localizedSheet.title, interfaceLanguage);
  const businessDetails = getBusinessDetails(priceSheet, copy);
  const hasPublicContactBlock =
    Boolean(priceSheet.publicSettings.contactEmail) ||
    Boolean(priceSheet.publicSettings.contactPhone) ||
    publicContactActions.length > 0;

  return (
    <div className={cn("relative isolate overflow-hidden pb-12 sm:pb-16", theme.pageClassName)} data-price-sheet-theme={theme.id}>
      <div aria-hidden className={cn("absolute inset-x-0 top-0 h-[22rem] blur-3xl", theme.glowClassName)} />

      <section className="container relative pt-7 sm:pt-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <Badge className={cn("w-fit px-3 py-1 text-xs uppercase tracking-[0.22em]", theme.eyebrowBadgeClassName)} variant="secondary">
            {copy.publishedEyebrow}
          </Badge>

          <div
            className={cn(
              "inline-flex w-full max-w-full items-center justify-between gap-2 rounded-full border px-2 py-2 shadow-sm sm:w-auto sm:justify-start",
              theme.languageShellClassName,
            )}
          >
            <span className={cn("px-2 text-xs font-medium uppercase tracking-[0.22em]", theme.languageLabelClassName)}>{copy.languageLabel}</span>
            {supportedLanguageOptions.map((option) => {
              const isActive = option.value === interfaceLanguage;

              return (
                <Link
                  key={option.value}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                    isActive ? theme.languageActiveClassName : theme.languageInactiveClassName,
                  )}
                  href={`/price-sheets/${priceSheet.slug}?lang=${option.value}`}
                >
                  {option.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-5 grid gap-5 sm:mt-6 lg:grid-cols-[minmax(0,1fr),300px] lg:items-start xl:grid-cols-[minmax(0,1fr),320px]">
          <div className="min-w-0 space-y-6 lg:space-y-7">
            <div className={cn("min-w-0 rounded-[1.85rem] border p-5 shadow-sm sm:p-7", theme.heroSurfaceClassName)}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div
                  className={cn(
                    "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-semibold shadow-sm sm:h-16 sm:w-16",
                    theme.heroMarkClassName,
                  )}
                >
                  {getSheetMark(localizedSheet.title)}
                </div>

                <div className="min-w-0 space-y-2.5">
                  <p className={cn("font-mono text-xs uppercase tracking-[0.28em]", theme.heroEyebrowClassName)}>{copy.catalogEyebrow}</p>
                  <h1 className={cn("text-balance break-words text-3xl font-semibold tracking-tight sm:text-5xl", theme.heroTitleClassName)}>
                    {localizedSheet.title}
                  </h1>
                  <p className={cn("max-w-3xl text-base leading-7 sm:text-lg sm:leading-8", theme.heroBodyClassName)}>{summaryText}</p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2.5">
                <MetricChip label={copy.itemCountLabel} theme={theme} value={String(priceSheet.items.length)} />
                <MetricChip label={copy.sectionCountLabel} theme={theme} value={String(sections.length)} />
                <MetricChip label={copy.localeLabel} theme={theme} value={contentLocale} />
                <MetricChip label={copy.currencyLabel} theme={theme} value={priceSheet.currency} />
                <MetricChip label={copy.updatedLabel} theme={theme} value={updatedAt} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <p className={cn("font-mono text-xs uppercase tracking-[0.24em]", theme.heroEyebrowClassName)}>{copy.catalogEyebrow}</p>
                <h2 className={cn("text-2xl font-semibold tracking-tight sm:text-3xl", theme.heroTitleClassName)}>{copy.browseTitle}</h2>
                <p className={cn("max-w-2xl", theme.heroBodyClassName)}>{copy.browseDescription}</p>
              </div>

              {sections.length === 0 ? (
                <Card className={cn("rounded-[1.6rem]", theme.sectionCardClassName)}>
                  <CardHeader>
                    <CardTitle className={theme.heroTitleClassName}>{copy.noItemsTitle}</CardTitle>
                    <CardDescription className={theme.heroBodyClassName}>{copy.noItemsDescription}</CardDescription>
                  </CardHeader>
                </Card>
              ) : (
                sections.map((section) => (
                  <Card key={section.title} className={cn("overflow-hidden rounded-[1.6rem]", theme.sectionCardClassName)}>
                    <CardHeader className={cn("gap-2 border-b p-5", theme.sectionHeaderClassName)}>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <CardTitle className={cn("text-xl", theme.heroTitleClassName)}>{section.title}</CardTitle>
                        <Badge className={theme.sectionBadgeClassName} variant="outline">
                          {formatSectionItemCount(section.items.length, interfaceLanguage)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3 p-4 sm:p-5">
                      {section.items.map((item) => (
                        <article
                          key={item.id}
                          className={cn(
                            "grid gap-3 rounded-[1.25rem] border p-4 sm:grid-cols-[minmax(0,1fr),auto] sm:items-start sm:gap-5 sm:p-5",
                            theme.itemSurfaceClassName,
                          )}
                        >
                          <div className="space-y-1.5">
                            <h3 className={cn("text-lg font-semibold", theme.itemTitleClassName)}>{item.name}</h3>
                            {item.description ? <p className={cn("max-w-2xl text-sm leading-6", theme.itemDescriptionClassName)}>{item.description}</p> : null}
                          </div>

                          <div className="sm:text-right">
                            <p className={cn("text-xl font-semibold tracking-tight", theme.priceClassName)}>
                              {formatPublicPrice(item.priceCents, priceSheet.currency, contentLocale)}
                            </p>
                          </div>
                        </article>
                      ))}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          <aside className="space-y-4 lg:space-y-5">
            <Card className={cn("rounded-[1.6rem]", theme.summaryCardClassName)}>
              <CardHeader className="space-y-3 p-5 pb-3">
                <Badge className={cn("w-fit", theme.summaryBadgeClassName)} variant="outline">
                  {copy.summaryEyebrow}
                </Badge>
                <CardTitle className={cn("text-xl", theme.summaryTitleClassName)}>{copy.summaryTitle}</CardTitle>
                <CardDescription className={theme.summaryDescriptionClassName}>{introText}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 p-5 pt-0">
                <DetailRow label={copy.currencyLabel} theme={theme} value={priceSheet.currency} />
                <DetailRow label={copy.localeLabel} theme={theme} value={contentLocale} />
                <DetailRow label={copy.updatedLabel} theme={theme} value={updatedAt} />
                <DetailRow label={copy.itemCountLabel} theme={theme} value={String(priceSheet.items.length)} />
                <DetailRow label={copy.sectionCountLabel} theme={theme} value={String(sections.length)} />
                {priceSheet.publicSettings.contactLabel ? <DetailRow label={copy.contactEyebrow} theme={theme} value={priceSheet.publicSettings.contactLabel} /> : null}
              </CardContent>
            </Card>

            {businessDetails.length > 0 ? (
              <Card className={cn("rounded-[1.6rem]", theme.railCardClassName)}>
                <CardHeader className="space-y-3 p-5 pb-3">
                  <Badge className={cn("w-fit", theme.railBadgeClassName)} variant="secondary">
                    {copy.businessDetailsEyebrow}
                  </Badge>
                  <CardTitle className={theme.summaryTitleClassName}>{copy.businessDetailsTitle}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 p-5 pt-0">
                  {businessDetails.map((detail, index) => (
                    <DetailRow key={`${detail.label}-${index}`} label={detail.label} theme={theme} value={detail.value} />
                  ))}
                </CardContent>
              </Card>
            ) : null}

            {hasPublicContactBlock ? (
              <Card id="contact" className={cn("rounded-[1.6rem]", theme.railCardClassName)}>
                <CardHeader className="space-y-3 p-5 pb-3">
                  <Badge className={cn("w-fit", theme.railBadgeClassName)} variant="secondary">
                    {copy.contactEyebrow}
                  </Badge>
                  <CardTitle className={theme.summaryTitleClassName}>{priceSheet.publicSettings.contactLabel || copy.contactTitle}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 p-5 pt-0">
                  {priceSheet.publicSettings.contactEmail ? (
                    <ContactRow
                      href={buildEmailHref(priceSheet.publicSettings.contactEmail, localizedSheet.title, interfaceLanguage)}
                      label={copy.emailLabel}
                      theme={theme}
                      value={priceSheet.publicSettings.contactEmail}
                    />
                  ) : null}

                  {priceSheet.publicSettings.contactPhone ? (
                    <ContactRow
                      href={buildPhoneHref(priceSheet.publicSettings.contactPhone) ?? undefined}
                      label={copy.phoneLabel}
                      theme={theme}
                      value={priceSheet.publicSettings.contactPhone}
                    />
                  ) : null}

                  {publicContactActions.length > 0 ? (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                      {publicContactActions.map((action, index) => (
                        <Link
                          key={`${action.label}-${action.href}`}
                          className={cn(
                            buttonVariants({
                              size: "lg",
                              variant: index === 0 ? "default" : "outline",
                            }),
                            "w-full",
                            index === 0 ? theme.primaryButtonClassName : theme.secondaryButtonClassName,
                          )}
                          href={action.href}
                        >
                          {action.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ) : null}

            <PublicPriceSheetLeadForm
              inquiryEnabled={priceSheet.publicSettings.inquiryEnabled}
              interfaceLanguage={interfaceLanguage}
              locale={contentLocale}
              priceSheetSlug={priceSheet.slug}
              theme={theme}
            />
          </aside>
        </div>
      </section>
    </div>
  );
}

function MetricChip({ label, theme, value }: { label: string; theme: PublicPriceSheetTheme; value: string }) {
  return (
    <div className={cn("rounded-full border px-3.5 py-2 shadow-sm", theme.metricChipClassName)}>
      <p className={cn("text-xs uppercase tracking-[0.18em]", theme.metricChipLabelClassName)}>{label}</p>
      <p className={cn("mt-1 text-sm font-semibold", theme.metricChipValueClassName)}>{value}</p>
    </div>
  );
}

function DetailRow({ label, theme, value }: { label: string; theme: PublicPriceSheetTheme; value: string }) {
  return (
    <div className={cn("flex items-center justify-between gap-4 rounded-2xl border px-4 py-3", theme.detailRowClassName)}>
      <span className={cn("text-sm", theme.detailRowLabelClassName)}>{label}</span>
      <span className={cn("min-w-0 text-right text-sm font-medium", theme.detailRowValueClassName)}>{value}</span>
    </div>
  );
}

function ContactRow({
  label,
  value,
  href,
  theme,
}: {
  label: string;
  value: string;
  href?: string;
  theme: PublicPriceSheetTheme;
}) {
  const content = href ? (
    <Link className={cn("break-all font-medium hover:underline", theme.contactValueClassName)} href={href}>
      {value}
    </Link>
  ) : (
    <span className={cn("break-all font-medium", theme.contactValueClassName)}>{value}</span>
  );

  return (
    <div className={cn("rounded-2xl border px-4 py-3", theme.contactRowClassName)}>
      <p className={cn("text-xs uppercase tracking-[0.18em]", theme.contactLabelClassName)}>{label}</p>
      <div className="mt-2 text-sm">{content}</div>
    </div>
  );
}

function groupPriceSheetItems(items: LocalizedPublicPriceSheetItem[], copy: PublicPriceSheetCopy) {
  if (items.length === 0) {
    return [] satisfies PriceSheetSection[];
  }

  const groups = new Map<string, LocalizedPublicPriceSheetItem[]>();

  for (const item of items) {
    const key = item.section?.trim() ?? "";
    const existingItems = groups.get(key) ?? [];
    groups.set(key, [...existingItems, item]);
  }

  const hasNamedSections = Array.from(groups.keys()).some((key) => key.length > 0);

  return Array.from(groups.entries()).map(([key, groupedItems]) => ({
    title: key || (hasNamedSections ? copy.generalSectionTitle : copy.allServicesTitle),
    items: groupedItems,
  })) satisfies PriceSheetSection[];
}

function buildIntroText(
  priceSheet: PublishedPriceSheet,
  sectionCount: number,
  interfaceLanguage: PriceSheetInterfaceLanguage,
  contentLocale: string,
) {
  const updatedAt = new Intl.DateTimeFormat(contentLocale, { dateStyle: "long" }).format(priceSheet.updatedAt);

  if (interfaceLanguage === "ru") {
    return `В прайс-листе ${priceSheet.items.length} позиций в ${sectionCount} разделах. Цены указаны в ${priceSheet.currency}, обновлено ${updatedAt}.`;
  }

  return `This sheet includes ${priceSheet.items.length} priced items across ${sectionCount} sections. Prices are shown in ${priceSheet.currency}, updated ${updatedAt}.`;
}

function buildEmailHref(contactEmail: string, title: string, language: PriceSheetInterfaceLanguage) {
  const subject = language === "ru" ? `Запрос по прайс-листу: ${title}` : `Price sheet inquiry: ${title}`;

  return `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}`;
}

function buildPhoneHref(contactPhone: string) {
  const trimmedValue = contactPhone.trim();

  if (trimmedValue.startsWith("http://") || trimmedValue.startsWith("https://")) {
    return trimmedValue;
  }

  if (trimmedValue.startsWith("@")) {
    return `https://t.me/${trimmedValue.slice(1)}`;
  }

  if (trimmedValue.includes("t.me/")) {
    return trimmedValue.startsWith("http") ? trimmedValue : `https://${trimmedValue}`;
  }

  const normalizedPhone = trimmedValue.replace(/(?!^\+)[^\d]/g, "");

  return normalizedPhone.length >= 6 ? `tel:${normalizedPhone}` : null;
}

function getPublicContactActions(priceSheet: PublishedPriceSheet, localizedTitle: string, interfaceLanguage: PriceSheetInterfaceLanguage) {
  const actions: Array<{ label: string; href: string }> = [];
  const emailHref = priceSheet.publicSettings.contactEmail
    ? buildEmailHref(priceSheet.publicSettings.contactEmail, localizedTitle, interfaceLanguage)
    : null;
  const phoneHref = priceSheet.publicSettings.contactPhone ? buildPhoneHref(priceSheet.publicSettings.contactPhone) : null;

  if (emailHref && priceSheet.publicSettings.primaryCtaLabel) {
    actions.push({
      label: priceSheet.publicSettings.primaryCtaLabel,
      href: emailHref,
    });
  }

  const phoneLabel = emailHref
    ? priceSheet.publicSettings.secondaryCtaLabel
    : priceSheet.publicSettings.primaryCtaLabel ?? priceSheet.publicSettings.secondaryCtaLabel;

  if (phoneHref && phoneLabel) {
    actions.push({
      label: phoneLabel,
      href: phoneHref,
    });
  }

  return actions;
}

function getBusinessDetails(priceSheet: PublishedPriceSheet, copy: PublicPriceSheetCopy) {
  const details = [
    createBusinessDetail(copy.businessLocationLabel, priceSheet.publicSettings.businessLocation),
    createBusinessDetail(copy.businessHoursLabel, priceSheet.publicSettings.businessHours),
    createBusinessDetail(copy.businessResponseTimeLabel, priceSheet.publicSettings.businessResponseTime),
    createBusinessDetail(copy.businessNoteLabel, priceSheet.publicSettings.businessNote),
  ].filter((detail): detail is BusinessDetail => Boolean(detail));

  if (details.length > 0) {
    return details;
  }

  return parseLegacyBusinessDetails(priceSheet.publicSettings.inquiryText, copy);
}

function createBusinessDetail(label: string, value: string | null) {
  const trimmedValue = value?.trim();

  return trimmedValue ? ({ label, value: trimmedValue } satisfies BusinessDetail) : null;
}

function parseLegacyBusinessDetails(value: string | null, copy: PublicPriceSheetCopy) {
  const trimmedValue = value?.trim();

  if (!trimmedValue) {
    return [] satisfies BusinessDetail[];
  }

  const parsedRows = trimmedValue
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/^([^:：-]{2,40})[:：-]\s*(.+)$/);

      if (!match) {
        return null;
      }

      return {
        label: resolveLegacyBusinessDetailLabel(match[1]!.trim(), copy),
        value: match[2]!.trim(),
      } satisfies BusinessDetail;
    })
    .filter((detail): detail is BusinessDetail => Boolean(detail && detail.value));

  if (parsedRows.length > 0) {
    return parsedRows;
  }

  return [{ label: copy.businessNoteLabel, value: trimmedValue }] satisfies BusinessDetail[];
}

function resolveLegacyBusinessDetailLabel(label: string, copy: PublicPriceSheetCopy) {
  const normalizedLabel = label.toLowerCase();

  if (/(address|location|адрес|локац)/i.test(normalizedLabel)) {
    return copy.businessLocationLabel;
  }

  if (/(hours|working|schedule|час|график)/i.test(normalizedLabel)) {
    return copy.businessHoursLabel;
  }

  if (/(response|reply|ответ)/i.test(normalizedLabel)) {
    return copy.businessResponseTimeLabel;
  }

  if (/(note|замет|комментар)/i.test(normalizedLabel)) {
    return copy.businessNoteLabel;
  }

  return label;
}

function formatPublicPrice(priceCents: number, currency: string, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(priceCents / 100);
}

function formatSectionItemCount(itemCount: number, language: PriceSheetInterfaceLanguage) {
  if (language === "ru") {
    return `${itemCount} поз.`;
  }

  return itemCount === 1 ? "1 item" : `${itemCount} items`;
}

function getSheetMark(title: string) {
  return title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
