import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@unitforge/ui";

const schemaCoverage = [
  "users",
  "workspaces",
  "memberships",
  "subscriptions",
  "price_sheets",
  "price_sheet_items",
] as const;

export default function PriceSheetsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Badge variant="secondary">Product area</Badge>
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Price Sheets</h2>
          <p className="max-w-2xl text-muted-foreground">
            The route is live and the database schema is ready. Query wiring and CRUD flows can land here next.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Schema coverage</CardTitle>
          <CardDescription>The initial data model is already scoped for price-sheet work.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {schemaCoverage.map((table) => (
            <Badge key={table} variant="outline" className="px-3 py-1">
              {table}
            </Badge>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Empty state by design</CardTitle>
          <CardDescription>
            No fake rows were added. This page is ready for real workspace queries once authentication and data fetching are connected.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

