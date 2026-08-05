import { buttonVariants, Card, cn } from "@unitforge/ui";
import Link from "next/link";

import { PriceSheetStatusBadge } from "@/features/price-sheets/price-sheet-status-badge";
import {
  getInterfaceNumberLocale,
  type InterfaceLocale,
} from "@/i18n/interface-locale";
import type { PriceSheetLeadView } from "@/server/price-sheet-leads/service";
import type { PriceSheetListItem } from "@/server/price-sheets/service";

export interface DashboardInquiry extends PriceSheetLeadView {
  priceSheetTitle: string;
}

interface DashboardOverviewProps {
  accessRequestsHref?: string;
  inquiries: DashboardInquiry[];
  locale: InterfaceLocale;
  operatorName: string;
  priceSheets: PriceSheetListItem[];
  workspaceName: string;
}

const dashboardCopy = {
  en: {
    eyebrow: "Dashboard",
    title: "Pricing at a glance",
    description: "Publish price sheets and review new inquiries.",
    workspaceLabel: "Workspace",
    signedInAs: "Signed in as",
    createSheet: "Create Price Sheet",
    openSheets: "All Price Sheets",
    published: "Published",
    drafts: "Drafts",
    inquiries: "Inquiries",
    recentSheets: "Recent Price Sheets",
    latestInquiries: "Latest inquiries",
    viewAll: "View all",
    itemSingle: "item",
    itemPlural: "items",
    updated: "Updated",
    emptySheetsTitle: "Create your first Price Sheet",
    emptySheetsDescription:
      "Add services, publish the page, and share one link.",
    emptySheetsAction: "Create Price Sheet",
    emptyInquiriesTitle: "No inquiries yet",
    emptyInquiriesDescription: "New customer requests will appear here.",
    openInquiry: "Open inquiry",
    accessRequests: "Access requests",
  },
  ru: {
    eyebrow: "Панель управления",
    title: "Цены и заявки",
    description: "Публикуйте прайс-листы и просматривайте новые заявки.",
    workspaceLabel: "Пространство",
    signedInAs: "Аккаунт",
    createSheet: "Создать прайс-лист",
    openSheets: "Все прайс-листы",
    published: "Опубликовано",
    drafts: "Черновики",
    inquiries: "Заявки",
    recentSheets: "Последние прайс-листы",
    latestInquiries: "Последние заявки",
    viewAll: "Смотреть все",
    itemOne: "позиция",
    itemFew: "позиции",
    itemMany: "позиций",
    updated: "Обновлён",
    emptySheetsTitle: "Создайте первый прайс-лист",
    emptySheetsDescription:
      "Добавьте услуги, опубликуйте страницу и поделитесь ссылкой.",
    emptySheetsAction: "Создать прайс-лист",
    emptyInquiriesTitle: "Заявок пока нет",
    emptyInquiriesDescription: "Новые обращения клиентов появятся здесь.",
    openInquiry: "Открыть заявку",
    accessRequests: "Запросы доступа",
  },
} as const;

export function DashboardOverview({
  accessRequestsHref,
  inquiries,
  locale,
  priceSheets,
  workspaceName,
}: DashboardOverviewProps) {
  const copy = dashboardCopy[locale];
  const publishedCount = priceSheets.filter(
    (priceSheet) => priceSheet.status === "published",
  ).length;
  const draftCount = priceSheets.length - publishedCount;
  const recentPriceSheets = priceSheets.slice(0, 4);
  const recentInquiries = inquiries.slice(0, 4);
  const numberLocale = getInterfaceNumberLocale(locale);

  return (
    <div className="space-y-5 sm:space-y-6">
      <section className="app-panel app-dashboard-hero border-border/70 bg-card/92 relative isolate rounded-[1.8rem] border px-5 py-6 shadow-[0_24px_70px_hsl(var(--app-shadow)/0.08)] sm:px-7 sm:py-7 lg:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className="text-muted-foreground max-w-full truncate text-xs font-medium">
                {copy.workspaceLabel}:{" "}
                <span className="text-foreground">{workspaceName}</span>
              </p>
              {accessRequestsHref ? (
                <Link
                  className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded-sm text-xs font-medium underline decoration-current/35 underline-offset-4 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2"
                  href={accessRequestsHref}
                >
                  {copy.accessRequests}
                </Link>
              ) : null}
            </div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {copy.title}
            </h1>
          </div>

          <Link
            className={cn(
              buttonVariants({ size: "sm" }),
              "h-10 w-full px-4 shadow-sm sm:w-auto",
            )}
            href="/app/price-sheets/new"
          >
            {copy.createSheet}
            <ArrowIcon />
          </Link>
        </div>
      </section>

      <section
        aria-label={copy.eyebrow}
        className="grid grid-cols-2 gap-3 sm:grid-cols-3"
      >
        <MetricCard
          href="/app/price-sheets?status=published"
          label={copy.published}
          value={publishedCount}
        />
        <MetricCard
          href="/app/price-sheets?status=draft"
          label={copy.drafts}
          value={draftCount}
        />
        <MetricCard
          className="col-span-2 sm:col-span-1"
          label={copy.inquiries}
          value={inquiries.length}
        />
      </section>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
        <section className="app-panel border-border/70 bg-card/92 overflow-hidden rounded-[1.65rem] border shadow-[0_18px_55px_hsl(var(--app-shadow)/0.055)]">
          <div className="border-border/60 flex items-center justify-between gap-3 border-b px-5 py-4 sm:px-6">
            <h2 className="text-base font-semibold tracking-tight sm:text-lg">
              {copy.recentSheets}
            </h2>
            {priceSheets.length > 0 ? (
              <Link
                className="text-primary hover:text-primary/75 text-sm font-medium transition-colors duration-200"
                href="/app/price-sheets"
              >
                {copy.viewAll}
              </Link>
            ) : null}
          </div>

          {recentPriceSheets.length > 0 ? (
            <div className="divide-border/55 divide-y">
              {recentPriceSheets.map((priceSheet) => (
                <Link
                  className="hover:bg-secondary/35 group grid min-w-0 gap-3 px-5 py-4 transition-colors duration-200 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-6"
                  href={`/app/price-sheets/${priceSheet.id}`}
                  key={priceSheet.id}
                >
                  <div className="min-w-0 space-y-2">
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                      <PriceSheetStatusBadge
                        locale={locale}
                        status={priceSheet.status}
                      />
                      <h3 className="text-foreground min-w-0 break-words text-sm font-semibold tracking-tight sm:text-base">
                        {priceSheet.title}
                      </h3>
                    </div>
                    <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                      <span>
                        {formatItemCount(locale, priceSheet.itemCount)}
                      </span>
                      <span className="font-mono text-[11px] uppercase tracking-[0.12em]">
                        /{priceSheet.slug}
                      </span>
                    </div>
                  </div>

                  <div className="text-muted-foreground flex items-center justify-between gap-3 text-xs sm:justify-end">
                    <span>
                      {copy.updated}{" "}
                      {priceSheet.updatedAt.toLocaleDateString(numberLocale)}
                    </span>
                    <span
                      aria-hidden="true"
                      className="border-border/65 bg-background/70 text-foreground group-hover:border-primary/30 group-hover:text-primary flex h-8 w-8 items-center justify-center rounded-full border transition duration-200 group-hover:translate-x-0.5"
                    >
                      <ChevronIcon />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              actionHref="/app/price-sheets/new"
              actionLabel={copy.emptySheetsAction}
              description={copy.emptySheetsDescription}
              title={copy.emptySheetsTitle}
            />
          )}
        </section>

        <section className="app-panel border-border/70 bg-card/92 overflow-hidden rounded-[1.65rem] border shadow-[0_18px_55px_hsl(var(--app-shadow)/0.055)]">
          <div className="border-border/60 border-b px-5 py-4 sm:px-6">
            <h2 className="text-base font-semibold tracking-tight sm:text-lg">
              {copy.latestInquiries}
            </h2>
          </div>

          {recentInquiries.length > 0 ? (
            <div className="divide-border/55 divide-y">
              {recentInquiries.map((inquiry) => (
                <Link
                  aria-label={`${copy.openInquiry}: ${inquiry.contactName}`}
                  className="hover:bg-secondary/35 group block px-5 py-4 transition-colors duration-200 sm:px-6"
                  href={`/app/price-sheets/${inquiry.priceSheetId}/inquiries`}
                  key={inquiry.id}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1.5">
                      <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <span
                          className="bg-primary h-2 w-2 shrink-0 rounded-full"
                          aria-hidden="true"
                        />
                        <h3 className="min-w-0 break-words text-sm font-semibold">
                          {inquiry.contactName}
                        </h3>
                      </div>
                      <p className="text-muted-foreground break-words text-xs">
                        {inquiry.companyOrBusinessName ?? inquiry.email}
                      </p>
                      <p className="text-muted-foreground/85 line-clamp-1 text-xs">
                        {inquiry.priceSheetTitle}
                      </p>
                    </div>
                    <span className="text-muted-foreground shrink-0 text-xs">
                      {inquiry.createdAt.toLocaleDateString(numberLocale, {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              description={copy.emptyInquiriesDescription}
              title={copy.emptyInquiriesTitle}
            />
          )}
        </section>
      </div>
    </div>
  );
}

function MetricCard({
  className,
  href,
  label,
  value,
}: {
  className?: string;
  href?: string;
  label: string;
  value: number;
}) {
  const content = (
    <>
      <p className="text-muted-foreground text-xs font-medium sm:text-sm">
        {label}
      </p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {value}
        </p>
        {href ? (
          <span
            aria-hidden="true"
            className="border-border/65 bg-background/70 text-muted-foreground group-hover:border-primary/30 group-hover:text-primary mb-1 flex h-7 w-7 items-center justify-center rounded-full border transition duration-200"
          >
            <ChevronIcon />
          </span>
        ) : null}
      </div>
    </>
  );
  const classes = cn(
    "app-panel app-metric-card group relative overflow-hidden rounded-[1.35rem] border border-border/70 bg-card/92 p-4 shadow-[0_14px_40px_hsl(var(--app-shadow)/0.045)] before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-primary/30 before:to-transparent sm:p-5",
    href &&
      "transition-[border-color,background-color,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:bg-card",
    className,
  );

  return href ? (
    <Link className={classes} href={href}>
      {content}
    </Link>
  ) : (
    <Card className={classes}>{content}</Card>
  );
}

function EmptyState({
  actionHref,
  actionLabel,
  description,
  title,
}: {
  actionHref?: string;
  actionLabel?: string;
  description: string;
  title: string;
}) {
  return (
    <div className="border-border/75 bg-background/55 m-4 rounded-[1.25rem] border border-dashed p-5 sm:m-5 sm:p-6">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold sm:text-base">{title}</h3>
        <p className="text-muted-foreground text-sm leading-6">{description}</p>
      </div>
      {actionHref && actionLabel ? (
        <Link
          className={cn(
            buttonVariants({ size: "sm", variant: "outline" }),
            "bg-card/75 mt-4",
          )}
          href={actionHref}
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      className="ml-1 h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M5 12h14m-5-5 5 5-5 5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="m9 6 6 6-6 6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function formatItemCount(locale: InterfaceLocale, count: number) {
  if (locale === "en") {
    return `${count} ${count === 1 ? dashboardCopy.en.itemSingle : dashboardCopy.en.itemPlural}`;
  }

  const lastTwoDigits = count % 100;
  const lastDigit = count % 10;
  const noun =
    lastTwoDigits >= 11 && lastTwoDigits <= 14
      ? dashboardCopy.ru.itemMany
      : lastDigit === 1
        ? dashboardCopy.ru.itemOne
        : lastDigit >= 2 && lastDigit <= 4
          ? dashboardCopy.ru.itemFew
          : dashboardCopy.ru.itemMany;

  return `${count} ${noun}`;
}
