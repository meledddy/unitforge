import { getStripeScaffoldState } from "@unitforge/billing";
import { Badge, buttonVariants, Card, CardContent, CardDescription, CardHeader, CardTitle, cn } from "@unitforge/ui";
import Link from "next/link";

import { getMembershipRoleLabel, getSubscriptionStatusLabel } from "@/components/app/app-shell-labels";
import { PageHeader } from "@/components/app/page-header";
import { PlaceholderPanel } from "@/components/app/placeholder-panel";
import { getCurrentInterfaceLocale } from "@/i18n/interface-locale.server";
import { getMessages } from "@/i18n/messages";
import { requireCurrentAppShellSession } from "@/server/current-session";

export default async function SettingsPage() {
  const [session, locale] = await Promise.all([requireCurrentAppShellSession(), getCurrentInterfaceLocale()]);
  const stripe = getStripeScaffoldState(process.env);
  const messages = getMessages(locale);
  const userDisplayName = session.currentUser.name || session.currentUser.email;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={messages.settingsPage.eyebrow}
        title={messages.settingsPage.title}
        description={messages.settingsPage.description}
        actions={
          <Link className={cn(buttonVariants({ size: "sm", variant: "outline" }))} href="/pricing">
            {messages.settingsPage.pricingCta}
          </Link>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{messages.settingsPage.workspaceTitle}</CardTitle>
            <CardDescription>{messages.settingsPage.workspaceDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">{session.currentWorkspace.name}</p>
            <p>{session.currentWorkspace.slug}</p>
            <Badge variant="outline">{getMembershipRoleLabel(locale, session.membership.role)}</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{messages.settingsPage.currentUserTitle}</CardTitle>
            <CardDescription>{messages.settingsPage.currentUserDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">{userDisplayName}</p>
            <p>{session.currentUser.email}</p>
            <p>{messages.settingsPage.currentUserBody}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{messages.settingsPage.subscriptionTitle}</CardTitle>
            <CardDescription>{messages.settingsPage.subscriptionDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">
              {session.subscription ? getSubscriptionStatusLabel(locale, session.subscription.status) : messages.settingsPage.unconfigured}
            </p>
            <p>
              {messages.settingsPage.plan}: {session.subscription?.plan ?? messages.settingsPage.notAssigned}
            </p>
            <p>
              {messages.settingsPage.provider}: {session.subscription?.provider ?? messages.settingsPage.notConfigured}
            </p>
          </CardContent>
        </Card>
      </div>

      <PlaceholderPanel title={messages.settingsPage.stripeTitle} description={messages.settingsPage.stripeDescription}>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-3xl border border-border/70 bg-background/70 p-4">
            <p className="font-medium">{messages.settingsPage.configurationTitle}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {stripe.configured ? messages.settingsPage.configurationReady : messages.settingsPage.configurationMissing}
            </p>
          </div>
          <div className="rounded-3xl border border-border/70 bg-background/70 p-4">
            <p className="font-medium">{messages.settingsPage.missingKeysTitle}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {stripe.missingKeys.length > 0 ? stripe.missingKeys.join(", ") : messages.shared.none}
            </p>
          </div>
        </div>
      </PlaceholderPanel>
    </div>
  );
}
