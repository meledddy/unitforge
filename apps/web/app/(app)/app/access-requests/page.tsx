import { Badge, Button, buttonVariants, Card, cn, Select } from "@unitforge/ui";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getInterfaceNumberLocale,
  type InterfaceLocale,
} from "@/i18n/interface-locale";
import { getCurrentInterfaceLocale } from "@/i18n/interface-locale.server";
import { updateAccessRequestStatusAction } from "@/server/access-requests/actions";
import {
  type AccessRequestStatus,
  accessRequestStatuses,
  isUnitforgeAdminEmail,
} from "@/server/access-requests/admin";
import { listAccessRequests } from "@/server/access-requests/service";
import { requireAuthenticatedAppShellSession } from "@/server/current-session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Access requests",
};

const inboxCopy = {
  en: {
    admin: "Admin",
    title: "Access requests",
    description: "Latest access and contact requests.",
    back: "Dashboard",
    contact: "Contact",
    email: "Email",
    business: "Business",
    subject: "Subject",
    phone: "Phone",
    note: "Note",
    source: "Source",
    noPhone: "No phone",
    noNote: "No note",
    sourceLabels: {
      "request-access": "Access request",
      contact: "Contact form",
    },
    status: "Status",
    save: "Save",
    emptyTitle: "No access requests yet",
    emptyDescription: "New requests will appear here after submission.",
    statusLabels: {
      new: "New",
      contacted: "Contacted",
      qualified: "Qualified",
      closed: "Closed",
    },
  },
  ru: {
    admin: "Администратор",
    title: "Запросы доступа",
    description: "Последние запросы доступа и обращения.",
    back: "Панель управления",
    contact: "Контакт",
    email: "Почта",
    business: "Бизнес",
    subject: "Тема",
    phone: "Телефон",
    note: "Комментарий",
    source: "Источник",
    noPhone: "Телефон не указан",
    noNote: "Без комментария",
    sourceLabels: {
      "request-access": "Запрос доступа",
      contact: "Форма контактов",
    },
    status: "Статус",
    save: "Сохранить",
    emptyTitle: "Запросов доступа пока нет",
    emptyDescription: "Новые заявки появятся здесь после отправки формы.",
    statusLabels: {
      new: "Новая",
      contacted: "Связались",
      qualified: "Подтверждена",
      closed: "Закрыта",
    },
  },
} as const;

export default async function AccessRequestsPage() {
  const [session, locale] = await Promise.all([
    requireAuthenticatedAppShellSession(),
    getCurrentInterfaceLocale(),
  ]);

  if (!isUnitforgeAdminEmail(session.currentUser.email)) {
    notFound();
  }

  const requests = await listAccessRequests(100);
  const copy = inboxCopy[locale];
  const numberLocale = getInterfaceNumberLocale(locale);

  return (
    <div className="space-y-5 sm:space-y-6">
      <header className="border-border/70 bg-card/92 rounded-[1.8rem] border p-5 shadow-[0_24px_70px_hsl(var(--app-shadow)/0.08)] sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{copy.admin}</Badge>
              <span className="text-muted-foreground text-xs">
                {requests.length}
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              {copy.title}
            </h1>
            <p className="text-muted-foreground mt-2 text-sm leading-6 sm:text-base">
              {copy.description}
            </p>
          </div>
          <Link
            className={cn(
              buttonVariants({ size: "sm", variant: "outline" }),
              "bg-background/75 h-10",
            )}
            href="/app"
          >
            {copy.back}
          </Link>
        </div>
      </header>

      {requests.length > 0 ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {requests.map((request) => (
            <Card
              className="border-border/70 bg-card/92 overflow-hidden rounded-[1.55rem] shadow-[0_16px_48px_hsl(var(--app-shadow)/0.05)]"
              key={request.id}
            >
              <div className="border-border/60 flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4">
                <StatusBadge locale={locale} status={request.status} />
                <time
                  className="text-muted-foreground text-xs"
                  dateTime={request.createdAt.toISOString()}
                >
                  {request.createdAt.toLocaleString(numberLocale, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
              </div>

              <div className="space-y-5 p-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Detail
                    label={
                      request.source === "contact"
                        ? copy.subject
                        : copy.business
                    }
                    value={request.businessName}
                  />
                  <Detail label={copy.contact} value={request.contactName} />
                  <Detail label={copy.email} value={request.email} />
                  <Detail
                    label={copy.source}
                    value={
                      copy.sourceLabels[
                        request.source === "contact"
                          ? "contact"
                          : "request-access"
                      ]
                    }
                  />
                  <Detail
                    label={copy.phone}
                    muted={!request.phone}
                    value={request.phone ?? copy.noPhone}
                  />
                </div>

                <div>
                  <p className="text-muted-foreground text-xs font-medium uppercase tracking-[0.12em]">
                    {copy.note}
                  </p>
                  <p
                    className={cn(
                      "mt-2 whitespace-pre-wrap break-words text-sm leading-6",
                      !request.note && "text-muted-foreground",
                    )}
                  >
                    {request.note ?? copy.noNote}
                  </p>
                </div>

                <form
                  action={updateAccessRequestStatusAction}
                  className="border-border/60 grid gap-2 border-t pt-4 sm:grid-cols-[minmax(0,1fr)_auto]"
                >
                  <input
                    name="accessRequestId"
                    type="hidden"
                    value={request.id}
                  />
                  <div>
                    <label
                      className="sr-only"
                      htmlFor={`access-request-status-${request.id}`}
                    >
                      {copy.status}
                    </label>
                    <Select
                      className="bg-background/75 h-10 rounded-xl"
                      defaultValue={request.status}
                      id={`access-request-status-${request.id}`}
                      name="status"
                    >
                      {accessRequestStatuses.map((status) => (
                        <option key={status} value={status}>
                          {copy.statusLabels[status]}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <Button className="h-10 rounded-xl" type="submit">
                    {copy.save}
                  </Button>
                </form>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-border/75 bg-card/92 rounded-[1.55rem] border-dashed p-8 text-center">
          <h2 className="text-lg font-semibold">{copy.emptyTitle}</h2>
          <p className="text-muted-foreground mt-2 text-sm leading-6">
            {copy.emptyDescription}
          </p>
        </Card>
      )}
    </div>
  );
}

function Detail({
  label,
  muted = false,
  value,
}: {
  label: string;
  muted?: boolean;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-muted-foreground text-xs font-medium uppercase tracking-[0.12em]">
        {label}
      </p>
      <p
        className={cn(
          "mt-1.5 break-words text-sm font-medium",
          muted && "text-muted-foreground font-normal",
        )}
      >
        {value}
      </p>
    </div>
  );
}

function StatusBadge({
  locale,
  status,
}: {
  locale: InterfaceLocale;
  status: AccessRequestStatus;
}) {
  const styles: Record<AccessRequestStatus, string> = {
    new: "border-blue-500/25 bg-blue-500/10 text-blue-700 dark:text-blue-200",
    contacted:
      "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-200",
    qualified:
      "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200",
    closed: "border-border/70 bg-secondary/70 text-muted-foreground",
  };

  return (
    <Badge className={styles[status]} variant="outline">
      {inboxCopy[locale].statusLabels[status]}
    </Badge>
  );
}
