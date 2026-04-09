import { appConfig } from "@unitforge/config";
import { Badge, buttonVariants, Card, CardContent, CardDescription, CardHeader, CardTitle, cn } from "@unitforge/ui";
import Link from "next/link";

import type { PriceSheetItemView, PublishedPriceSheet } from "@/server/price-sheets/service";

type SupportedPublicLanguage = "en" | "ru";

interface PublicPriceSheetProps {
  priceSheet: PublishedPriceSheet;
  requestedLanguage?: string;
}

interface PublicPriceSheetCopy {
  publishedEyebrow: string;
  languageLabel: string;
  catalogEyebrow: string;
  introLabel: string;
  detailsTitle: string;
  browseTitle: string;
  browseDescription: string;
  allServicesTitle: string;
  generalSectionTitle: string;
  updatedLabel: string;
  currencyLabel: string;
  localeLabel: string;
  itemCountLabel: string;
  sectionCountLabel: string;
  requestEyebrow: string;
  requestTitle: string;
  requestDescription: string;
  requestAction: string;
  contactAction: string;
  responseNote: string;
  leadEyebrow: string;
  leadTitle: string;
  leadDescription: string;
  futureFieldLabels: string[];
  noItemsTitle: string;
  noItemsDescription: string;
}

interface PriceSheetSection {
  title: string;
  items: PriceSheetItemView[];
}

interface PublicPriceSheetTheme {
  id: string;
  heroSurfaceClassName: string;
  badgeClassName: string;
  markClassName: string;
  glowClassName: string;
}

const publicPriceSheetCopy: Record<SupportedPublicLanguage, PublicPriceSheetCopy> = {
  en: {
    publishedEyebrow: "Published price sheet",
    languageLabel: "Language",
    catalogEyebrow: "Customer pricing",
    introLabel: "Prepared for review",
    detailsTitle: "Commercial details",
    browseTitle: "Pricing overview",
    browseDescription: "Review sections, compare line items, and use this page as the source of truth for commercial conversations.",
    allServicesTitle: "Services",
    generalSectionTitle: "General",
    updatedLabel: "Updated",
    currencyLabel: "Currency",
    localeLabel: "Format",
    itemCountLabel: "Items",
    sectionCountLabel: "Sections",
    requestEyebrow: "Next step",
    requestTitle: "Need a tailored quote?",
    requestDescription: "Use this sheet as the starting point, then request a scoped proposal, timeline, or custom packaging.",
    requestAction: "Request service",
    contactAction: "Contact team",
    responseNote: `Customer inquiries can route to ${appConfig.supportEmail} until a dedicated lead form is connected.`,
    leadEyebrow: "Lead form slot",
    leadTitle: "Inquiry form comes next",
    leadDescription: "This section is reserved for a lightweight lead form and follow-up workflow. The public layout already leaves room for it.",
    futureFieldLabels: ["Contact name", "Company", "Work email", "Project scope"],
    noItemsTitle: "No line items available",
    noItemsDescription: "This sheet is public, but no priced services have been published yet.",
  },
  ru: {
    publishedEyebrow: "Опубликованный прайс-лист",
    languageLabel: "Язык",
    catalogEyebrow: "Клиентский прайс",
    introLabel: "Подготовлено для просмотра",
    detailsTitle: "Коммерческие детали",
    browseTitle: "Структура цен",
    browseDescription: "Просматривайте разделы, сравнивайте позиции и используйте эту страницу как рабочую основу для коммерческого диалога.",
    allServicesTitle: "Услуги",
    generalSectionTitle: "Общее",
    updatedLabel: "Обновлено",
    currencyLabel: "Валюта",
    localeLabel: "Формат",
    itemCountLabel: "Позиции",
    sectionCountLabel: "Разделы",
    requestEyebrow: "Следующий шаг",
    requestTitle: "Нужен индивидуальный расчет?",
    requestDescription: "Используйте этот прайс как базу, затем запросите уточненное предложение, сроки или индивидуальную упаковку услуги.",
    requestAction: "Запросить услугу",
    contactAction: "Связаться",
    responseNote: `Пока форма еще не подключена, входящие запросы можно направлять на ${appConfig.supportEmail}.`,
    leadEyebrow: "Слот для формы",
    leadTitle: "Форма заявки будет следующей",
    leadDescription: "Этот блок зарезервирован под простую форму лида и дальнейший workflow. Публичная страница уже готова к такому расширению.",
    futureFieldLabels: ["Контактное лицо", "Компания", "Рабочая почта", "Описание задачи"],
    noItemsTitle: "Нет опубликованных позиций",
    noItemsDescription: "Страница уже публична, но ценовые позиции пока не опубликованы.",
  },
};

const publicPriceSheetThemes: PublicPriceSheetTheme[] = [
  {
    id: "amber",
    heroSurfaceClassName: "border-amber-200/70 bg-gradient-to-br from-amber-50 via-card to-card",
    badgeClassName: "bg-amber-100 text-amber-950",
    markClassName: "bg-amber-200/80 text-amber-950",
    glowClassName: "bg-gradient-to-b from-amber-200/40 via-amber-100/10 to-transparent",
  },
  {
    id: "slate",
    heroSurfaceClassName: "border-slate-200/80 bg-gradient-to-br from-slate-100 via-card to-card",
    badgeClassName: "bg-slate-200 text-slate-900",
    markClassName: "bg-slate-900 text-slate-50",
    glowClassName: "bg-gradient-to-b from-slate-300/35 via-slate-100/10 to-transparent",
  },
  {
    id: "stone",
    heroSurfaceClassName: "border-stone-200/80 bg-gradient-to-br from-stone-100 via-card to-card",
    badgeClassName: "bg-stone-200 text-stone-900",
    markClassName: "bg-stone-900 text-stone-50",
    glowClassName: "bg-gradient-to-b from-stone-300/35 via-stone-100/10 to-transparent",
  },
];

const supportedLanguageOptions = [
  { value: "en", label: "EN", locale: "en-US" },
  { value: "ru", label: "RU", locale: "ru-RU" },
] as const;

export function PublicPriceSheet({ priceSheet, requestedLanguage }: PublicPriceSheetProps) {
  const language = resolvePublicLanguage(requestedLanguage, priceSheet.locale);
  const copy = publicPriceSheetCopy[language];
  const presentationLocale = resolvePresentationLocale(language, priceSheet.locale);
  const theme = getPublicPriceSheetTheme(priceSheet.theme);
  const sections = groupPriceSheetItems(priceSheet.items, copy);
  const updatedAt = new Intl.DateTimeFormat(presentationLocale, { dateStyle: "medium" }).format(priceSheet.updatedAt);
  const introText = buildIntroText(priceSheet, sections.length, presentationLocale);
  const detailText = priceSheet.description?.trim() || introText;
  const contactHref = buildContactHref(priceSheet.title, language);

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
              const isActive = option.value === language;

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
                {getSheetMark(priceSheet.title)}
              </div>

              <div className="space-y-3">
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground">{copy.catalogEyebrow}</p>
                <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">{priceSheet.title}</h1>
                <p className="max-w-3xl text-lg leading-8 text-muted-foreground">{detailText}</p>
                {priceSheet.description ? <p className="text-sm leading-6 text-muted-foreground">{introText}</p> : null}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <MetricChip label={copy.itemCountLabel} value={String(priceSheet.items.length)} />
              <MetricChip label={copy.sectionCountLabel} value={String(sections.length)} />
              <MetricChip label={copy.localeLabel} value={presentationLocale} />
              <MetricChip label={copy.currencyLabel} value={priceSheet.currency} />
              <MetricChip label={copy.updatedLabel} value={updatedAt} />
            </div>
          </div>

          <Card className="border-primary/10 bg-card/95">
            <CardHeader>
              <Badge className="w-fit" variant="outline">
                {copy.introLabel}
              </Badge>
              <CardTitle className="pt-3 text-xl">{copy.detailsTitle}</CardTitle>
              <CardDescription>
                {copy.currencyLabel}: {priceSheet.currency} · {copy.localeLabel}: {presentationLocale}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link className={cn(buttonVariants({ size: "lg" }), "w-full")} href="#request">
                {copy.requestAction}
              </Link>
              <Link className={cn(buttonVariants({ size: "lg", variant: "outline" }), "w-full")} href={contactHref}>
                {copy.contactAction}
              </Link>
              <p className="text-sm leading-6 text-muted-foreground">{copy.responseNote}</p>
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
                      className="grid gap-4 rounded-[1.5rem] border border-border/70 bg-background/80 p-4 sm:grid-cols-[minmax(0,1fr),auto] sm:items-start sm:p-5"
                    >
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <h3 className="text-lg font-semibold">{item.name}</h3>
                          {item.description ? <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{item.description}</p> : null}
                        </div>
                      </div>

                      <div className="sm:text-right">
                        <p className="text-xl font-semibold tracking-tight">
                          {formatPublicPrice(item.priceCents, priceSheet.currency, presentationLocale)}
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
          <Card id="request" className="border-border/70 bg-card/95">
            <CardHeader>
              <Badge className="w-fit" variant="secondary">
                {copy.requestEyebrow}
              </Badge>
              <CardTitle className="pt-3">{copy.requestTitle}</CardTitle>
              <CardDescription>{copy.requestDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link className={cn(buttonVariants({ variant: "outline" }), "w-full")} href={contactHref}>
                {copy.contactAction}
              </Link>
              <p className="text-sm leading-6 text-muted-foreground">{copy.responseNote}</p>
            </CardContent>
          </Card>

          <Card className="border-dashed border-border/80 bg-background/80">
            <CardHeader>
              <Badge className="w-fit" variant="outline">
                {copy.leadEyebrow}
              </Badge>
              <CardTitle className="pt-3">{copy.leadTitle}</CardTitle>
              <CardDescription>{copy.leadDescription}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {copy.futureFieldLabels.map((label) => (
                <div key={label} className="rounded-2xl border border-dashed border-border/80 bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                  {label}
                </div>
              ))}
            </CardContent>
          </Card>
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

function groupPriceSheetItems(items: PriceSheetItemView[], copy: PublicPriceSheetCopy) {
  if (items.length === 0) {
    return [] satisfies PriceSheetSection[];
  }

  const groups = new Map<string, PriceSheetItemView[]>();

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

function resolvePublicLanguage(requestedLanguage: string | undefined, storedLocale: string): SupportedPublicLanguage {
  if (requestedLanguage === "ru" || requestedLanguage === "ru-RU") {
    return "ru";
  }

  if (requestedLanguage === "en" || requestedLanguage === "en-US") {
    return "en";
  }

  return storedLocale.toLowerCase().startsWith("ru") ? "ru" : "en";
}

function resolvePresentationLocale(language: SupportedPublicLanguage, storedLocale: string) {
  if (language === "ru") {
    return "ru-RU";
  }

  if (language === "en") {
    return storedLocale.toLowerCase().startsWith("en") ? storedLocale : "en-US";
  }

  return storedLocale;
}

function buildIntroText(
  priceSheet: PublishedPriceSheet,
  sectionCount: number,
  presentationLocale: string,
) {
  const updatedAt = new Intl.DateTimeFormat(presentationLocale, { dateStyle: "long" }).format(priceSheet.updatedAt);

  if (presentationLocale.startsWith("ru")) {
    return `Просмотрите ${priceSheet.items.length} позиций в ${sectionCount} разделах. Цены отображаются в ${priceSheet.currency}, обновление от ${updatedAt}.`;
  }

  return `Review ${priceSheet.items.length} priced items across ${sectionCount} sections. Prices are displayed in ${priceSheet.currency}, updated ${updatedAt}.`;
}

function buildContactHref(title: string, language: SupportedPublicLanguage) {
  const subject = language === "ru" ? `Запрос по прайс-листу: ${title}` : `Price sheet inquiry: ${title}`;

  return `mailto:${appConfig.supportEmail}?subject=${encodeURIComponent(subject)}`;
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
