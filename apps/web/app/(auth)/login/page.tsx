import { redirect } from "next/navigation";

import { LampLoginShell } from "@/features/auth/lamp-login-shell";
import { getCurrentInterfaceLocale } from "@/i18n/interface-locale.server";
import { getCurrentAppShellSession } from "@/server/current-session";

interface LoginPageProps {
  searchParams: Promise<{
    next?: string;
  }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const [session, locale] = await Promise.all([getCurrentAppShellSession(), getCurrentInterfaceLocale()]);

  if (session) {
    redirect("/app");
  }

  const { next } = await searchParams;

  return <LampLoginShell locale={locale} next={next} />;
}
