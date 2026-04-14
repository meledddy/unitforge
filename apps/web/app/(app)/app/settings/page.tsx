import { getStripeScaffoldState } from "@unitforge/billing";
import { Badge, buttonVariants, Card, CardContent, CardDescription, CardHeader, CardTitle, cn } from "@unitforge/ui";
import Link from "next/link";

import { PageHeader } from "@/components/app/page-header";
import { PlaceholderPanel } from "@/components/app/placeholder-panel";
import { requireCurrentAppShellSession } from "@/server/current-session";

export default async function SettingsPage() {
  const session = await requireCurrentAppShellSession();
  const stripe = getStripeScaffoldState(process.env);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Workspace settings"
        title="Settings"
        description="This area holds workspace identity, authenticated user context, and Stripe readiness."
        actions={
          <Link className={cn(buttonVariants({ size: "sm", variant: "outline" }))} href="/pricing">
            Pricing page
          </Link>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Workspace</CardTitle>
            <CardDescription>Workspace access now resolves from the active authenticated membership.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">{session.currentWorkspace.name}</p>
            <p>{session.currentWorkspace.slug}</p>
            <Badge variant="outline">{session.membership.role}</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current user</CardTitle>
            <CardDescription>The protected app now uses the real signed-in operator account.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">{session.currentUser.name}</p>
            <p>{session.currentUser.email}</p>
            <p>Sign out from the app shell to clear the current session cookie and block access again.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
            <CardDescription>Billing state is loaded from the workspace subscription record.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p className="font-medium capitalize text-foreground">{session.subscription?.status ?? "Unconfigured"}</p>
            <p>Plan: {session.subscription?.plan ?? "Not assigned"}</p>
            <p>Provider: {session.subscription?.provider ?? "Not configured"}</p>
          </CardContent>
        </Card>
      </div>

      <PlaceholderPanel
        title="Stripe scaffold"
        description="The code path for billing setup exists, but checkout session creation is still intentionally blocked behind a scaffold response."
      >
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-3xl border border-border/70 bg-background/70 p-4">
            <p className="font-medium">Configuration</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {stripe.configured ? "All required Stripe keys are present." : "Stripe is not fully configured yet."}
            </p>
          </div>
          <div className="rounded-3xl border border-border/70 bg-background/70 p-4">
            <p className="font-medium">Missing keys</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {stripe.missingKeys.length > 0 ? stripe.missingKeys.join(", ") : "None"}
            </p>
          </div>
        </div>
      </PlaceholderPanel>
    </div>
  );
}
