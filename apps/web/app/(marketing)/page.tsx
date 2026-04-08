import Link from "next/link";

import { formatPlanPrice, studioPlans } from "@unitforge/billing";
import { appConfig } from "@unitforge/config";
import { productSurfaces, studioCapabilities } from "@unitforge/core";
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, buttonVariants, cn } from "@unitforge/ui";

const studioPlan = studioPlans[0];
const sharedPackages = ["ui", "core", "db", "billing", "analytics", "config"] as const;

if (!studioPlan) {
  throw new Error("Studio plan configuration is missing.");
}

export default function LandingPage() {
  return (
    <div className="pb-16">
      <section className="container py-20 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
          <div className="space-y-6">
            <Badge variant="secondary">Vertical SaaS studio starter</Badge>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                Forge repeatable products without rebuilding the platform every time.
              </h1>
              <p className="max-w-2xl text-lg text-muted-foreground">
                {appConfig.description} The initial foundation includes one marketing surface, one authenticated app shell,
                and shared packages for data, billing, analytics, and UI.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link className={cn(buttonVariants({ size: "lg" }))} href="/app">
                Open dashboard
              </Link>
              <Link className={cn(buttonVariants({ size: "lg", variant: "outline" }))} href="/app/price-sheets">
                Browse product areas
              </Link>
            </div>
          </div>
          <Card className="border-primary/10 bg-card/90">
            <CardHeader>
              <CardTitle>Shared foundation</CardTitle>
              <CardDescription>Start each future product from the same platform contracts instead of a blank repo.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {sharedPackages.map((pkg) => (
                  <Badge key={pkg} variant="outline" className="px-3 py-1">
                    {pkg}
                  </Badge>
                ))}
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/80 p-5">
                <p className="font-medium">Ready for product number two.</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Marketing pages, authenticated routes, billing hooks, and database scaffolding stay in one clean monorepo.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="container pb-20" id="platform">
        <div className="mb-8 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted-foreground">Platform</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">One studio foundation, multiple future products.</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {studioCapabilities.map((capability) => (
            <Card key={capability.title}>
              <CardHeader>
                <CardTitle>{capability.title}</CardTitle>
                <CardDescription>{capability.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="container grid gap-6 pb-12 lg:grid-cols-[0.95fr,1.05fr]" id="pricing">
        <Card>
          <CardHeader>
            <CardTitle>{studioPlan.name}</CardTitle>
            <CardDescription>{studioPlan.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-4xl font-semibold tracking-tight">{formatPlanPrice(studioPlan.monthlyPriceInCents)}</p>
              <p className="text-sm text-muted-foreground">per month, per deployed vertical baseline</p>
            </div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {studioPlan.features.map((feature) => (
                <li key={feature} className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3">
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reserved product areas</CardTitle>
            <CardDescription>The initial web app already holds space for future operational workflows.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {productSurfaces.map((surface) => (
              <Link
                key={surface.href}
                href={surface.href}
                className="rounded-3xl border border-border/70 bg-background/70 p-5 transition-colors hover:border-accent"
              >
                <p className="font-medium">{surface.title}</p>
                <p className="mt-2 text-sm text-muted-foreground">{surface.description}</p>
              </Link>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
