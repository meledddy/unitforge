import { Badge, Card, CardDescription, CardHeader, CardTitle } from "@unitforge/ui";

export default function ImportMarginPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Badge variant="secondary">Placeholder</Badge>
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Import Margin</h2>
          <p className="max-w-2xl text-muted-foreground">
            This route is intentionally reserved for a future import margin workflow and ships without demo content.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Next step</CardTitle>
          <CardDescription>
            Add the domain model, ingestion flow, and reporting UI only when the product requirements are clear.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
