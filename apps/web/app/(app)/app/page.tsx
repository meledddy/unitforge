import { productSurfaces } from "@unitforge/core";
import { Badge, buttonVariants, Card, CardContent, CardDescription, CardHeader, CardTitle, cn } from "@unitforge/ui";
import Link from "next/link";

import { PageHeader } from "@/components/app/page-header";
import { PlaceholderPanel } from "@/components/app/placeholder-panel";
import { requireCurrentAppShellSession } from "@/server/current-session";

export default async function DashboardPage() {
  const session = await requireCurrentAppShellSession();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Authenticated app shell"
        title="Workspace overview"
        description="The first functional slice now runs behind real login, session handling, and workspace-scoped data access."
        actions={
          <Link className={cn(buttonVariants({ size: "sm", variant: "outline" }))} href="/app/settings">
            Review settings
          </Link>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Current user</CardTitle>
            <CardDescription>The authenticated operator account now drives protected app access.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">{session.currentUser.name}</p>
            <p>{session.currentUser.email}</p>
            <Badge variant="outline">{session.membership.role}</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current workspace</CardTitle>
            <CardDescription>The current workspace comes from the authenticated membership context.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">{session.currentWorkspace.name}</p>
            <p>{session.currentWorkspace.slug}</p>
            <p>Workspace-scoped queries and billing ownership now resolve from the signed-in user session.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Billing status</CardTitle>
            <CardDescription>Stripe is scaffolded, but final checkout and webhook handling are intentionally deferred.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p className="font-medium capitalize text-foreground">{session.subscription?.status ?? "Unconfigured"}</p>
            <p>Plan: {session.subscription?.plan ?? "Not assigned"}</p>
            <p>Provider: {session.subscription?.provider ?? "Not configured"}</p>
          </CardContent>
        </Card>
      </div>

      <PlaceholderPanel
        title="Reserved product surfaces"
        description="The workspace already has clear seams for product-specific operations without introducing fake application data."
        actionHref="/app/price-sheets"
        actionLabel="Open price sheets"
      >
        <div className="grid gap-4 md:grid-cols-2">
          {productSurfaces.map((surface) => (
            <div key={surface.href} className="rounded-3xl border border-border/70 bg-background/70 p-5">
              <p className="font-medium">{surface.title}</p>
              <p className="mt-2 text-sm text-muted-foreground">{surface.description}</p>
            </div>
          ))}
        </div>
      </PlaceholderPanel>
    </div>
  );
}
