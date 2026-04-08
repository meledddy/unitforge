import { productSurfaces } from "@unitforge/core";
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@unitforge/ui";

const readinessCards = [
  {
    title: "Data layer",
    description: "Drizzle schema and PostgreSQL client factory are in place for workspace data.",
  },
  {
    title: "Billing",
    description: "Shared plan definitions are ready to back Stripe wiring when product billing lands.",
  },
  {
    title: "Analytics",
    description: "A lightweight event contract is ready for provider-specific integrations.",
  },
] as const;

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Badge variant="secondary">Authenticated app shell</Badge>
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Overview</h2>
          <p className="max-w-2xl text-muted-foreground">
            This dashboard stays intentionally lean: structure first, data wiring second.
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {readinessCards.map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reserved product surfaces</CardTitle>
          <CardDescription>Dedicated areas are already mapped into the app router for future products.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {productSurfaces.map((surface) => (
            <div key={surface.href} className="rounded-3xl border border-border/70 bg-background/70 p-5">
              <p className="font-medium">{surface.title}</p>
              <p className="mt-2 text-sm text-muted-foreground">{surface.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

