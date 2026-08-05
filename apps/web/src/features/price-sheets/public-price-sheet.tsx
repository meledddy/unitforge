import {
  Badge,
  buttonVariants,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
} from "@unitforge/ui";
import Link from "next/link";

import type { PriceSheetInterfaceLanguage } from "@/features/price-sheets/localization";
import {
  isPriceSheetContentLocaleAvailable,
  mapInterfaceLanguageToPriceSheetContentLocale,
  resolvePriceSheetContent,
  resolvePriceSheetInterfaceLanguage,
  resolvePriceSheetItemContent,
} from "@/features/price-sheets/localization";
import {
  getPublicPriceSheetDisplayTitle,
} from "@/features/price-sheets/public-display";
import { PublicPriceSheetLeadForm } from "@/features/price-sheets/public-price-sheet-lead-form";
import {
  getPublicPriceSheetTheme,
  type PublicPriceSheetTheme,
} from "@/features/price-sheets/public-theme";
import type { InterfaceLocale } from "@/i18n/interface-locale";
import type { PublishedPriceSheet } from "@/server/price-sheets/service";

interface PublicPriceSheetProps {
  interfaceLocale: InterfaceLocale;
  priceSheet: PublishedPriceSheet;
  requestedContentLanguage?: string;
}

interface PublicPriceSheetCopy {
  demoEyebrow: string;
  languageLabel: string;
  browseTitle: string;
  allServicesTitle: string;
  generalSectionTitle: string;
  updatedLabel: string;
  itemCountLabel: string;
  inquiryCta: string;
  contactTitle: string;
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

const publicPriceSheetCopy: Record<
  PriceSheetInterfaceLanguage,
  PublicPriceSheetCopy
> = {
  en: {
    demoEyebrow: "Unitforge demo",
    languageLabel: "Language",
    browseTitle: "Services and rates",
    allServicesTitle: "Services",
    generalSectionTitle: "General",
    updatedLabel: "Updated",
    itemCountLabel: "Items",
    inquiryCta: "Request a quote",
    contactTitle: "Get in touch",
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
    demoEyebrow: "Демо Unitforge",
    languageLabel: "Язык",
    browseTitle: "Услуги и цены",
    allServicesTitle: "Услуги",
    generalSectionTitle: "Общее",
    updatedLabel: "Обновлено",
    itemCountLabel: "Позиции",
    inquiryCta: "Оставить заявку",
    contactTitle: "Связаться",
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

export function PublicPriceSheet({
  interfaceLocale,
  priceSheet,
  requestedContentLanguage,
}: PublicPriceSheetProps) {
  const resolvedContentLanguage = resolvePriceSheetInterfaceLanguage(
    requestedContentLanguage ?? interfaceLocale,
    priceSheet.defaultContentLocale,
  );
  const requestedContentLocale = mapInterfaceLanguageToPriceSheetContentLocale(
    resolvedContentLanguage,
  );
  const contentLocale = isPriceSheetContentLocaleAvailable({
    defaultContentLocale: priceSheet.defaultContentLocale,
    requestedContentLocale,
    translations: priceSheet.translations,
    items: priceSheet.items,
  })
    ? requestedContentLocale
    : priceSheet.defaultContentLocale;
  const interfaceLanguage: PriceSheetInterfaceLanguage =
    contentLocale === "ru-RU" ? "ru" : "en";
  const copy = publicPriceSheetCopy[interfaceLanguage];
  const availableLanguageOptions = supportedLanguageOptions.filter((option) =>
    isPriceSheetContentLocaleAvailable({
      defaultContentLocale: priceSheet.defaultContentLocale,
      requestedContentLocale: mapInterfaceLanguageToPriceSheetContentLocale(
        option.value,
      ),
      translations: priceSheet.translations,
      items: priceSheet.items,
    }),
  );
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
  const isDemo = priceSheet.slug.startsWith("demo-");
  const displayTitle = getPublicPriceSheetDisplayTitle({
    isDemo,
    title: localizedSheet.title,
  });
  const sections = groupPriceSheetItems(localizedItems, copy);
  const updatedAt = new Intl.DateTimeFormat(contentLocale, {
    dateStyle: "medium",
  }).format(priceSheet.updatedAt);
  const summaryText = localizedSheet.description?.trim() || null;
  const publicContactActions = getPublicContactActions(
    priceSheet,
    displayTitle,
    interfaceLanguage,
  );
  const businessDetails = getBusinessDetails(priceSheet, copy, {
    includeBusinessNote: !isDemo,
  });
  const hasPublicContactBlock =
    Boolean(priceSheet.publicSettings.contactEmail) ||
    Boolean(priceSheet.publicSettings.contactPhone) ||
    publicContactActions.length > 0;
  const hasPublicRail =
    priceSheet.publicSettings.inquiryEnabled ||
    businessDetails.length > 0 ||
    hasPublicContactBlock;

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden pb-12 sm:pb-16",
        priceSheet.publicSettings.inquiryEnabled && "pb-28 sm:pb-16",
        theme.pageClassName,
      )}
      data-price-sheet-appearance={
        priceSheet.publicSettings.presentationAppearance
      }
      data-price-sheet-theme={theme.id}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0",
          theme.glowClassName,
        )}
      />

      <section className="container relative z-10 max-w-[1180px] pt-7 sm:pt-10">
        {isDemo || availableLanguageOptions.length > 1 ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            {isDemo ? (
              <Badge
                className={cn(
                  "w-fit px-3 py-1 text-xs uppercase tracking-[0.22em]",
                  theme.eyebrowBadgeClassName,
                )}
                variant="secondary"
              >
                {copy.demoEyebrow}
              </Badge>
            ) : null}

            {availableLanguageOptions.length > 1 ? (
              <div
                aria-label={copy.languageLabel}
                className={cn(
                  "ml-auto inline-flex items-center gap-1 rounded-full border p-1 shadow-sm",
                  theme.languageShellClassName,
                )}
                role="group"
              >
                <span className="sr-only">{copy.languageLabel}</span>
                {availableLanguageOptions.map((option) => {
                  const isActive = option.value === interfaceLanguage;

                  return (
                    <Link
                      key={option.value}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                        isActive
                          ? theme.languageActiveClassName
                          : theme.languageInactiveClassName,
                      )}
                      href={`/price-sheets/${priceSheet.slug}?lang=${option.value}`}
                    >
                      {option.label}
                    </Link>
                  );
                })}
              </div>
            ) : null}
          </div>
        ) : null}

        <div
          className={cn(
            "grid gap-5 xl:items-start",
            hasPublicRail && "xl:grid-cols-[minmax(0,1fr),300px]",
            isDemo || availableLanguageOptions.length > 1
              ? "mt-5 sm:mt-6"
              : "mt-0",
          )}
        >
          <div
            className={cn(
              "order-1 min-w-0 rounded-[1.85rem] border p-5 shadow-sm sm:p-7 xl:order-none xl:col-start-1 xl:row-start-1",
              theme.heroSurfaceClassName,
            )}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div
                aria-hidden="true"
                className={cn(
                  "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-semibold shadow-sm sm:h-16 sm:w-16",
                  theme.heroMarkClassName,
                )}
              >
                {getSheetMark(displayTitle)}
              </div>

              <div className="min-w-0 space-y-2.5">
                <h1
                  className={cn(
                    "text-balance break-words text-3xl font-semibold tracking-tight sm:text-5xl",
                    theme.heroTitleClassName,
                  )}
                >
                  {displayTitle}
                </h1>
                {summaryText ? (
                  <p
                    className={cn(
                      "max-w-3xl text-base leading-7 sm:text-lg sm:leading-8",
                      theme.heroBodyClassName,
                    )}
                  >
                    {summaryText}
                  </p>
                ) : null}
              </div>
            </div>

            <div
              className={cn(
                "mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 border-t pt-4 text-sm",
                theme.heroMetaClassName,
              )}
            >
              <span>
                {copy.itemCountLabel}: {priceSheet.items.length}
              </span>
              <span aria-hidden>·</span>
              <span>
                {copy.updatedLabel}: {updatedAt}
              </span>
            </div>

            {priceSheet.publicSettings.inquiryEnabled ? (
              <Link
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "mt-5 w-full rounded-full sm:w-auto",
                  theme.primaryButtonClassName,
                )}
                href="#inquiry"
              >
                {copy.inquiryCta}
              </Link>
            ) : null}
          </div>

          <div className="order-2 min-w-0 space-y-4 xl:order-none xl:col-start-1 xl:row-start-2">
            <div>
              <h2
                className={cn(
                  "text-2xl font-semibold tracking-tight sm:text-3xl",
                  theme.heroTitleClassName,
                )}
              >
                {copy.browseTitle}
              </h2>
            </div>

            {sections.length === 0 ? (
              <Card
                className={cn("rounded-[1.6rem]", theme.sectionCardClassName)}
              >
                <CardHeader>
                  <CardTitle className={theme.heroTitleClassName}>
                    {copy.noItemsTitle}
                  </CardTitle>
                  <CardDescription className={theme.heroBodyClassName}>
                    {copy.noItemsDescription}
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : (
              sections.map((section) => (
                <Card
                  key={section.title}
                  className={cn(
                    "overflow-hidden rounded-[1.6rem]",
                    theme.sectionCardClassName,
                  )}
                >
                  <CardHeader
                    className={cn(
                      "border-b px-5 py-4",
                      theme.sectionHeaderClassName,
                    )}
                  >
                    <CardTitle
                      className={cn("text-lg", theme.heroTitleClassName)}
                    >
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="divide-y divide-[hsl(var(--ps-border)/0.58)] p-0">
                    {section.items.map((item) => (
                      <article
                        key={item.id}
                        className={cn(
                          "grid gap-2 px-5 py-4 sm:grid-cols-[minmax(0,1fr),9.5rem] sm:items-start sm:gap-6 sm:py-5",
                          theme.itemSurfaceClassName,
                        )}
                      >
                        <div className="space-y-1.5">
                          <h3
                            className={cn(
                              "text-lg font-semibold",
                              theme.itemTitleClassName,
                            )}
                          >
                            {item.name}
                          </h3>
                          {item.description ? (
                            <p
                              className={cn(
                                "max-w-2xl text-sm leading-6",
                                theme.itemDescriptionClassName,
                              )}
                            >
                              {item.description}
                            </p>
                          ) : null}
                        </div>

                        <div className="min-w-[9.5rem] sm:text-right">
                          <p
                            className={cn(
                              "whitespace-nowrap text-lg font-semibold tabular-nums tracking-tight",
                              theme.priceClassName,
                            )}
                          >
                            {formatPublicPrice(
                              item.priceCents,
                              priceSheet.currency,
                              contentLocale,
                            )}
                          </p>
                        </div>
                      </article>
                    ))}
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {hasPublicRail ? (
            <aside
              className={cn(
                "order-3 space-y-4 xl:order-none xl:col-start-2 xl:row-span-2 xl:row-start-1 xl:space-y-5",
                !priceSheet.publicSettings.inquiryEnabled &&
                  "xl:sticky xl:top-24",
              )}
            >
            {priceSheet.publicSettings.inquiryEnabled ? (
              <PublicPriceSheetLeadForm
                inquiryEnabled
                interfaceLanguage={interfaceLanguage}
                locale={contentLocale}
                priceSheetSlug={priceSheet.slug}
                theme={theme}
              />
            ) : null}

            {businessDetails.length > 0 ? (
              <Card className={cn("rounded-[1.6rem]", theme.railCardClassName)}>
                <CardHeader className="border-b border-[hsl(var(--ps-border)/0.58)] px-5 py-4">
                  <CardTitle
                    className={cn("text-base", theme.summaryTitleClassName)}
                  >
                    {copy.businessDetailsTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent className="divide-y divide-[hsl(var(--ps-border)/0.58)] p-0">
                  {businessDetails.map((detail, index) => (
                    <DetailRow
                      key={`${detail.label}-${index}`}
                      label={detail.label}
                      theme={theme}
                      value={detail.value}
                    />
                  ))}
                </CardContent>
              </Card>
            ) : null}

            {hasPublicContactBlock ? (
              <Card
                id="contact"
                className={cn("rounded-[1.6rem]", theme.railCardClassName)}
              >
                <CardHeader className="border-b border-[hsl(var(--ps-border)/0.58)] px-5 py-4">
                  <CardTitle
                    className={cn("text-base", theme.summaryTitleClassName)}
                  >
                    {priceSheet.publicSettings.contactLabel ||
                      copy.contactTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-[hsl(var(--ps-border)/0.58)]">
                    {priceSheet.publicSettings.contactEmail ? (
                      <ContactRow
                        href={buildEmailHref(
                          priceSheet.publicSettings.contactEmail,
                          displayTitle,
                          interfaceLanguage,
                        )}
                        label={copy.emailLabel}
                        theme={theme}
                        value={priceSheet.publicSettings.contactEmail}
                      />
                    ) : null}

                    {priceSheet.publicSettings.contactPhone ? (
                      <ContactRow
                        href={
                          buildPhoneHref(
                            priceSheet.publicSettings.contactPhone,
                          ) ?? undefined
                        }
                        label={copy.phoneLabel}
                        theme={theme}
                        value={priceSheet.publicSettings.contactPhone}
                      />
                    ) : null}
                  </div>

                  {publicContactActions.length > 0 ? (
                    <div
                      className={cn(
                        "grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-1",
                        (priceSheet.publicSettings.contactEmail ||
                          priceSheet.publicSettings.contactPhone) &&
                          "border-t border-[hsl(var(--ps-border)/0.58)]",
                      )}
                    >
                      {publicContactActions.map((action, index) => (
                        <Link
                          key={`${action.label}-${action.href}`}
                          className={cn(
                            buttonVariants({
                              size: "lg",
                              variant: index === 0 ? "default" : "outline",
                            }),
                            "w-full",
                            index === 0
                              ? theme.primaryButtonClassName
                              : theme.secondaryButtonClassName,
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
            </aside>
          ) : null}
        </div>
      </section>

      {priceSheet.publicSettings.inquiryEnabled ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[hsl(var(--ps-border)/0.76)] bg-[hsl(var(--ps-surface)/0.92)] px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-18px_48px_-30px_hsl(var(--ps-shadow)/0.42)] backdrop-blur-xl xl:hidden">
          <Link
            className={cn(
              buttonVariants({ size: "lg" }),
              "mx-auto flex w-full max-w-md rounded-full",
              theme.primaryButtonClassName,
            )}
            href="#inquiry"
          >
            {copy.inquiryCta}
          </Link>
        </div>
      ) : null}
    </div>
  );
}

function DetailRow({
  label,
  theme,
  value,
}: {
  label: string;
  theme: PublicPriceSheetTheme;
  value: string;
}) {
  return (
    <div className={cn("grid gap-1 px-5 py-3.5", theme.detailRowClassName)}>
      <span
        className={cn(
          "text-xs uppercase tracking-[0.14em]",
          theme.detailRowLabelClassName,
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "min-w-0 break-words text-sm font-medium leading-5",
          theme.detailRowValueClassName,
        )}
      >
        {value}
      </span>
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
    <Link
      className={cn(
        "break-all font-medium hover:underline",
        theme.contactValueClassName,
      )}
      href={href}
    >
      {value}
    </Link>
  ) : (
    <span className={cn("break-all font-medium", theme.contactValueClassName)}>
      {value}
    </span>
  );

  return (
    <div className={cn("px-5 py-3.5", theme.contactRowClassName)}>
      <p
        className={cn(
          "text-xs uppercase tracking-[0.18em]",
          theme.contactLabelClassName,
        )}
      >
        {label}
      </p>
      <div className="mt-1.5 text-sm leading-5">{content}</div>
    </div>
  );
}

function groupPriceSheetItems(
  items: LocalizedPublicPriceSheetItem[],
  copy: PublicPriceSheetCopy,
) {
  if (items.length === 0) {
    return [] satisfies PriceSheetSection[];
  }

  const groups = new Map<string, LocalizedPublicPriceSheetItem[]>();

  for (const item of items) {
    const key = item.section?.trim() ?? "";
    const existingItems = groups.get(key) ?? [];
    groups.set(key, [...existingItems, item]);
  }

  const hasNamedSections = Array.from(groups.keys()).some(
    (key) => key.length > 0,
  );

  return Array.from(groups.entries()).map(([key, groupedItems]) => ({
    title:
      key ||
      (hasNamedSections ? copy.generalSectionTitle : copy.allServicesTitle),
    items: groupedItems,
  })) satisfies PriceSheetSection[];
}

function buildEmailHref(
  contactEmail: string,
  title: string,
  language: PriceSheetInterfaceLanguage,
) {
  const subject =
    language === "ru"
      ? `Запрос по прайс-листу: ${title}`
      : `Price sheet inquiry: ${title}`;

  return `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}`;
}

function buildPhoneHref(contactPhone: string) {
  const trimmedValue = contactPhone.trim();

  if (
    trimmedValue.startsWith("http://") ||
    trimmedValue.startsWith("https://")
  ) {
    return trimmedValue;
  }

  if (trimmedValue.startsWith("@")) {
    return `https://t.me/${trimmedValue.slice(1)}`;
  }

  if (trimmedValue.includes("t.me/")) {
    return trimmedValue.startsWith("http")
      ? trimmedValue
      : `https://${trimmedValue}`;
  }

  const normalizedPhone = trimmedValue.replace(/(?!^\+)[^\d]/g, "");

  return normalizedPhone.length >= 6 ? `tel:${normalizedPhone}` : null;
}

function getPublicContactActions(
  priceSheet: PublishedPriceSheet,
  localizedTitle: string,
  interfaceLanguage: PriceSheetInterfaceLanguage,
) {
  const actions: Array<{ label: string; href: string }> = [];
  const emailHref = priceSheet.publicSettings.contactEmail
    ? buildEmailHref(
        priceSheet.publicSettings.contactEmail,
        localizedTitle,
        interfaceLanguage,
      )
    : null;
  const phoneHref = priceSheet.publicSettings.contactPhone
    ? buildPhoneHref(priceSheet.publicSettings.contactPhone)
    : null;

  if (emailHref && priceSheet.publicSettings.primaryCtaLabel) {
    actions.push({
      label: priceSheet.publicSettings.primaryCtaLabel,
      href: emailHref,
    });
  }

  const phoneLabel = emailHref
    ? priceSheet.publicSettings.secondaryCtaLabel
    : (priceSheet.publicSettings.primaryCtaLabel ??
      priceSheet.publicSettings.secondaryCtaLabel);

  if (phoneHref && phoneLabel) {
    actions.push({
      label: phoneLabel,
      href: phoneHref,
    });
  }

  return actions;
}

function getBusinessDetails(
  priceSheet: PublishedPriceSheet,
  copy: PublicPriceSheetCopy,
  { includeBusinessNote }: { includeBusinessNote: boolean },
) {
  const details = [
    createBusinessDetail(
      copy.businessLocationLabel,
      priceSheet.publicSettings.businessLocation,
    ),
    createBusinessDetail(
      copy.businessHoursLabel,
      priceSheet.publicSettings.businessHours,
    ),
    createBusinessDetail(
      copy.businessResponseTimeLabel,
      priceSheet.publicSettings.businessResponseTime,
    ),
    includeBusinessNote
      ? createBusinessDetail(
          copy.businessNoteLabel,
          priceSheet.publicSettings.businessNote,
        )
      : null,
  ].filter((detail): detail is BusinessDetail => Boolean(detail));

  if (details.length > 0) {
    return details;
  }

  return parseLegacyBusinessDetails(
    priceSheet.publicSettings.inquiryText,
    copy,
    { includeBusinessNote },
  );
}

function createBusinessDetail(label: string, value: string | null) {
  const trimmedValue = value?.trim();

  return trimmedValue
    ? ({ label, value: trimmedValue } satisfies BusinessDetail)
    : null;
}

function parseLegacyBusinessDetails(
  value: string | null,
  copy: PublicPriceSheetCopy,
  { includeBusinessNote }: { includeBusinessNote: boolean },
) {
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
    .filter((detail): detail is BusinessDetail =>
      Boolean(
        detail &&
        detail.value &&
        (includeBusinessNote || detail.label !== copy.businessNoteLabel),
      ),
    );

  if (parsedRows.length > 0) {
    return parsedRows;
  }

  return includeBusinessNote
    ? ([
        { label: copy.businessNoteLabel, value: trimmedValue },
      ] satisfies BusinessDetail[])
    : ([] satisfies BusinessDetail[]);
}

function resolveLegacyBusinessDetailLabel(
  label: string,
  copy: PublicPriceSheetCopy,
) {
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

function formatPublicPrice(
  priceCents: number,
  currency: string,
  locale: string,
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    ...(currency.toUpperCase() === "AMD"
      ? { minimumFractionDigits: 0, maximumFractionDigits: 0 }
      : {}),
  }).format(priceCents / 100);
}

function getSheetMark(title: string) {
  return title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
