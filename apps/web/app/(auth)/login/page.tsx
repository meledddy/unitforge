import { appConfig } from "@unitforge/config";
import { Badge } from "@unitforge/ui";
import { redirect } from "next/navigation";

import { SignInForm } from "@/features/auth/sign-in-form";
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

  return (
    <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[0.95fr,0.7fr] lg:items-center">
      <div className="space-y-6">
        <Badge variant="secondary">Auth V1</Badge>
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Sign in to the Price Sheets workspace.</h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            {appConfig.name} now uses a real credentials-based login and protected app routes while keeping the current Price Sheets
            product flow intact.
          </p>
        </div>
        <div className="rounded-3xl border border-border/70 bg-background/85 p-5 text-sm text-muted-foreground">
          Public price sheet pages and lead capture remain open. Only `/app` routes require authentication.
        </div>
      </div>

      <SignInForm next={next} />
    </div>
  );
}
