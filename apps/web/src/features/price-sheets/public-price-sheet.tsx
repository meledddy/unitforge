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
import type { PublishedPriceSheet } from "@/server/price-sheets/service";

interface PublicPriceSheetProps {
  priceSheet: PublishedPriceSheet;
  requestedLanguage?: string;
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

interface PublicPriceSheetTheme {
  id: string;
  heroSurfaceClassName: string;
  badgeClassName: string;
  markClassName: string;
  glowClassName: string;
  sidebarSurfaceClassName: string;
  sectionSurfaceClassName: string;
}

const publicPriceSheetCopy: Record<PriceSheetInterfaceLanguage, PublicPriceSheetCopy> = {
  en: {
    publishedEyebrow: "Public price list",
    languageLabel: "Language",
    catalogEyebrow: "Price list",
    summaryEyebrow: "At a glance",
    summaryTitle: "Pricing details",
    browseTitle: "Services and rates",
    browseDescription: "Browse the available services, compare sections, and use this page as the current customer-facing price reference.",
    allServicesTitle: "Services",
    generalSectionTitle: "General",
    updatedLabel: "Updated",
    currencyLabel: "Currency",
    localeLabel: "Content locale",
    itemCountLabel: "Items",
    sectionCountLabel: "Sections",
    contactEyebrow: "Contact",
    contactTitle: "Get in touch",
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
    browseDescription: "Просматривайте доступные услуги, сравнивайте разделы и используйте эту страницу как актуальный прайс для клиентов.",
    allServicesTitle: "Услуги",
    generalSectionTitle: "Общее",
    updatedLabel: "Обновлено",
    currencyLabel: "Валюта",
    localeLabel: "Язык контента",
    itemCountLabel: "Позиции",
    sectionCountLabel: "Разделы",
    contactEyebrow: "Контакты",
    contactTitle: "Связаться",
    emailLabel: "Почта",
    phoneLabel: "Телефон / мессенджер",
    noItemsTitle: "Прайс-лист обновляется",
    noItemsDescription: "Опубликованные позиции пока не добавлены.",
  },
};

const publicPriceSheetThemes: PublicPriceSheetTheme[] = [
  {
    id: "amber",
    heroSurfaceClassName: "border-amber-200/70 bg-gradient-to-br from-amber-50 via-card to-card",
    badgeClassName: "bg-amber-100 text-amber-950",
    markClassName: "bg-amber-200/80 text-amber-950",
    glowClassName: "bg-gradient-to-b from-amber-200/40 via-amber-100/10 to-transparent",
    sidebarSurfaceClassName: "border-amber-200/60 bg-gradient-to-br from-amber-50/90 to-card",
    sectionSurfaceClassName: "border-amber-100/80 bg-amber-50/35",
  },
  {
    id: "slate",
    heroSurfaceClassName: "border-slate-200/80 bg-gradient-to-br from-slate-100 via-card to-card",
    badgeClassName: "bg-slate-200 text-slate-900",
    markClassName: "bg-slate-900 text-slate-50",
    glowClassName: "bg-gradient-to-b from-slate-300/35 via-slate-100/10 to-transparent",
    sidebarSurfaceClassName: "border-slate-200/70 bg-gradient-to-br from-slate-100/95 to-card",
    sectionSurfaceClassName: "border-slate-200/80 bg-slate-100/40",
  },
  {
    id: "stone",
    heroSurfaceClassName: "border-stone-200/80 bg-gradient-to-br from-stone-100 via-card to-card",
    badgeClassName: "bg-stone-200 text-stone-900",
    markClassName: "bg-stone-900 text-stone-50",
    glowClassName: "bg-gradient-to-b from-stone-300/35 via-stone-100/10 to-transparent",
    sidebarSurfaceClassName: "border-stone-200/70 bg-gradient-to-br from-stone-100/95 to-card",
    sectionSurfaceClassName: "border-stone-200/80 bg-stone-100/45",
  },
];

const supportedLanguageOptions = [
  { value: "en", label: "EN" },
  { value: "ru", label: "RU" },
] as const;

export function PublicPriceSheet({ priceSheet, requestedLanguage }: PublicPriceSheetProps) {
  const interfaceLanguage = resolvePriceSheetInterfaceLanguage(requestedLanguage, priceSheet.defaultContentLocale);
  const copy = publicPriceSheetCopy[interfaceLanguage];
  const interfaceLocale = mapInterfaceLanguageToPriceSheetContentLocale(interfaceLanguage);
  const localizedSheet = resolvePriceSheetContent({
    defaultContentLocale: priceSheet.defaultContentLocale,
    requestedContentLocale: interfaceLocale,
    title: priceSheet.title,
    description: priceSheet.description,
    translations: priceSheet.translations,
  });
  const localizedItems = priceSheet.items.map((item) => {
    const localizedItem = resolvePriceSheetItemContent({
      defaultContentLocale: priceSheet.defaultContentLocale,
      requestedContentLocale: interfaceLocale,
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
  const updatedAt = new Intl.DateTimeFormat(interfaceLocale, { dateStyle: "medium" }).format(priceSheet.updatedAt);
  const introText = buildIntroText(priceSheet, sections.length, interfaceLocale);
  const summaryText = localizedSheet.description?.trim() || introText;
  const publicContactActions = getPublicContactActions(priceSheet, localizedSheet.title, interfaceLanguage);
  const hasPublicContactBlock =
    Boolean(priceSheet.publicSettings.contactEmail) ||
    Boolean(priceSheet.publicSettings.contactPhone) ||
    Boolean(priceSheet.publicSettings.inquiryText) ||
    publicContactActions.length > 0;

  return (
    <div className="relative isolate overflow-hidden pb-16 sm:pb-24" data-price-sheet-theme={theme.id}>
      <div aria-hidden className={cn("absolute inset-x-0 top-0 h-[26rem] blur-3xl", theme.glowClassName)} />

      <section className="container relative pt-8 sm:pt-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Badge className={cn("border-transparent px-3 py-1 text-xs uppercase tracking-[0.22em]", theme.badgeClassName)} variant="secondary">
            {copy.publishedEyebrow}
          </Badge>

          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/90 px-2 py-2 shadow-sm">
            <span className="px-2 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">{copy.languageLabel}</span>
            {supportedLanguageOptions.map((option) => {
              const isActive = option.value === interfaceLanguage;

              return (
                <Link
                  key={option.value}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                    isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                  href={`/price-sheets/${priceSheet.slug}?lang=${option.value}`}
                >
                  {option.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.1fr),320px] lg:items-start">
          <div className={cn("rounded-[2rem] border p-6 shadow-sm sm:p-8", theme.heroSurfaceClassName)}>
            <div className="flex items-start gap-4">
              <div className={cn("flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-lg font-semibold shadow-sm", theme.markClassName)}>
                {getSheetMark(localizedSheet.title)}
              </div>

              <div className="space-y-3">
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground">{copy.catalogEyebrow}</p>
                <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">{localizedSheet.title}</h1>
                <p className="max-w-3xl text-lg leading-8 text-muted-foreground">{summaryText}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <MetricChip label={copy.itemCountLabel} value={String(priceSheet.items.length)} />
              <MetricChip label={copy.sectionCountLabel} value={String(sections.length)} />
              <MetricChip label={copy.localeLabel} value={interfaceLocale} />
              <MetricChip label={copy.currencyLabel} value={priceSheet.currency} />
              <MetricChip label={copy.updatedLabel} value={updatedAt} />
            </div>
          </div>

          <Card className={cn("bg-card/95", theme.sidebarSurfaceClassName)}>
            <CardHeader>
              <Badge className="w-fit" variant="outline">
                {copy.summaryEyebrow}
              </Badge>
              <CardTitle className="pt-3 text-xl">{copy.summaryTitle}</CardTitle>
              <CardDescription>{introText}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <DetailRow label={copy.currencyLabel} value={priceSheet.currency} />
              <DetailRow label={copy.localeLabel} value={interfaceLocale} />
              <DetailRow label={copy.updatedLabel} value={updatedAt} />
              <DetailRow label={copy.itemCountLabel} value={String(priceSheet.items.length)} />
              <DetailRow label={copy.sectionCountLabel} value={String(sections.length)} />
              {priceSheet.publicSettings.contactLabel ? <DetailRow label={copy.contactEyebrow} value={priceSheet.publicSettings.contactLabel} /> : null}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="container relative mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr),320px]">
        <div className="space-y-5">
          <div className="space-y-2">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted-foreground">{copy.catalogEyebrow}</p>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{copy.browseTitle}</h2>
            <p className="max-w-2xl text-muted-foreground">{copy.browseDescription}</p>
          </div>

          {sections.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>{copy.noItemsTitle}</CardTitle>
                <CardDescription>{copy.noItemsDescription}</CardDescription>
              </CardHeader>
            </Card>
          ) : (
            sections.map((section) => (
              <Card key={section.title}>
                <CardHeader className="gap-2 border-b border-border/70">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <CardTitle className="text-xl">{section.title}</CardTitle>
                    <Badge variant="outline">
                      {section.items.length} {copy.itemCountLabel.toLowerCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 p-4 sm:p-6">
                  {section.items.map((item) => (
                    <article
                      key={item.id}
                      className={cn(
                        "grid gap-4 rounded-[1.5rem] border p-4 sm:grid-cols-[minmax(0,1fr),auto] sm:items-start sm:p-5",
                        theme.sectionSurfaceClassName,
                      )}
                    >
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <h3 className="text-lg font-semibold">{item.name}</h3>
                          {item.description ? <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{item.description}</p> : null}
                        </div>
                      </div>

                      <div className="sm:text-right">
                        <p className="text-xl font-semibold tracking-tight">
                          {formatPublicPrice(item.priceCents, priceSheet.currency, interfaceLocale)}
                        </p>
                      </div>
                    </article>
                  ))}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <aside className="space-y-4">
          {hasPublicContactBlock ? (
            <Card id="contact" className={cn("border-border/70 bg-card/95", theme.sidebarSurfaceClassName)}>
              <CardHeader>
                <Badge className="w-fit" variant="secondary">
                  {copy.contactEyebrow}
                </Badge>
                <CardTitle className="pt-3">{priceSheet.publicSettings.contactLabel || copy.contactTitle}</CardTitle>
                {priceSheet.publicSettings.inquiryText ? <CardDescription>{priceSheet.publicSettings.inquiryText}</CardDescription> : null}
              </CardHeader>
              <CardContent className="space-y-4">
                {priceSheet.publicSettings.contactEmail ? (
                  <ContactRow
                    href={buildEmailHref(priceSheet.publicSettings.contactEmail, localizedSheet.title, interfaceLanguage)}
                    label={copy.emailLabel}
                    value={priceSheet.publicSettings.contactEmail}
                  />
                ) : null}

                {priceSheet.publicSettings.contactPhone ? (
                  <ContactRow
                    href={buildPhoneHref(priceSheet.publicSettings.contactPhone) ?? undefined}
                    label={copy.phoneLabel}
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
            locale={interfaceLocale}
            priceSheetSlug={priceSheet.slug}
          />
        </aside>
      </section>
    </div>
  );
}

function MetricChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-full border border-border/70 bg-background/75 px-4 py-2 shadow-sm">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-background/70 px-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

function ContactRow({ label, value, href }: { label: string; value: string; href?: string }) {
  const content = href ? (
    <Link className="font-medium hover:underline" href={href}>
      {value}
    </Link>
  ) : (
    <span className="font-medium">{value}</span>
  );

  return (
    <div className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
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

function buildIntroText(priceSheet: PublishedPriceSheet, sectionCount: number, interfaceLocale: string) {
  const updatedAt = new Intl.DateTimeFormat(interfaceLocale, { dateStyle: "long" }).format(priceSheet.updatedAt);

  if (interfaceLocale.startsWith("ru")) {
    return `В прайс-листе ${priceSheet.items.length} позиций в ${sectionCount} разделах. Цены показаны в ${priceSheet.currency}, обновление от ${updatedAt}.`;
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

function formatPublicPrice(priceCents: number, currency: string, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(priceCents / 100);
}

function getPublicPriceSheetTheme(themeId: PublishedPriceSheet["theme"]) {
  return publicPriceSheetThemes.find((theme) => theme.id === themeId) ?? publicPriceSheetThemes[0]!;
}

function getSheetMark(title: string) {
  return title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
