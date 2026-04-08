import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@unitforge/ui";
import { notFound } from "next/navigation";

import { isServerDbConfigured } from "@/server/db";
import { getPublishedPriceSheetBySlug } from "@/server/price-sheets/service";

export const dynamic = "force-dynamic";

interface PublicPriceSheetPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PublicPriceSheetPage({ params }: PublicPriceSheetPageProps) {
  if (!isServerDbConfigured()) {
    notFound();
  }

  const { slug } = await params;
  const priceSheet = await getPublishedPriceSheetBySlug(slug);

  if (!priceSheet) {
    notFound();
  }

  const sections = priceSheet.items.reduce<Map<string, typeof priceSheet.items>>((groups, item) => {
    const key = item.section ?? "General";
    const existingGroup = groups.get(key) ?? [];
    groups.set(key, [...existingGroup, item]);
    return groups;
  }, new Map());

  return (
    <div className="container space-y-8 py-20">
      <div className="space-y-4">
        <Badge>Published Price Sheet</Badge>
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{priceSheet.title}</h1>
          <p className="text-lg text-muted-foreground">
            {priceSheet.currency} / {priceSheet.locale} / Updated {priceSheet.updatedAt.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {Array.from(sections.entries()).map(([section, items]) => (
          <Card key={section}>
            <CardHeader>
              <CardTitle>{section}</CardTitle>
              <CardDescription>Published workspace pricing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex flex-col gap-3 rounded-3xl border border-border/70 bg-background/70 p-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">{item.name}</p>
                    {item.description ? <p className="max-w-2xl text-sm text-muted-foreground">{item.description}</p> : null}
                  </div>
                  <p className="text-lg font-semibold">{item.formattedPrice}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

