import { Badge, buttonVariants, Card, CardContent, CardDescription, CardHeader, CardTitle, cn } from "@unitforge/ui";
import Link from "next/link";

import { PageHeader } from "@/components/app/page-header";
import { PlaceholderPanel } from "@/components/app/placeholder-panel";

const schemaCoverage = ["users", "workspaces", "memberships", "subscriptions", "price_sheets", "price_sheet_items"] as const;

export default function PriceSheetsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Product area"
        title="Price sheets"
        description="This slice is intentionally empty of fake records. The route, schema, and shell are ready for real workspace data."
        actions={
          <Link className={cn(buttonVariants({ size: "sm", variant: "outline" }))} href="/pricing">
            View pricing
          </Link>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1.2fr,0.8fr]">
        <PlaceholderPanel
          title="No price sheets yet"
          description="Keep this empty until workspace queries, permissions, and form flows are ready to land together."
          actionHref="/app/settings"
          actionLabel="Open settings"
        >
          <div className="rounded-3xl border border-dashed border-border/80 bg-background/70 p-6 text-sm text-muted-foreground">
            Database tables and navigation are already in place. The next safe move is wiring read access from a real workspace session.
          </div>
        </PlaceholderPanel>

        <Card>
          <CardHeader>
            <CardTitle>Schema coverage</CardTitle>
            <CardDescription>The current Drizzle model already covers the first price-sheet slice.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {schemaCoverage.map((table) => (
              <Badge key={table} variant="outline" className="px-3 py-1">
                {table}
              </Badge>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Planned next implementation</CardTitle>
          <CardDescription>Read queries, create flows, and workspace permissions can be layered in without changing the shell.</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
