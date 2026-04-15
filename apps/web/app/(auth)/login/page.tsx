import { redirect } from "next/navigation";

import { LampLoginShell } from "@/features/auth/lamp-login-shell";
import { getCurrentAppShellSession } from "@/server/current-session";

interface LoginPageProps {
  searchParams: Promise<{
    next?: string;
  }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getCurrentAppShellSession();

  if (session) {
    redirect("/app");
  }

  const { next } = await searchParams;

  return <LampLoginShell next={next} />;
}
