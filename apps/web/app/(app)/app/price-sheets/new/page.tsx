import { buttonVariants, cn } from "@unitforge/ui";
import Link from "next/link";

import { PageHeader } from "@/components/app/page-header";
import { PlaceholderPanel } from "@/components/app/placeholder-panel";
import { PriceSheetForm } from "@/features/price-sheets/price-sheet-form";
import { getEmptyPriceSheetFormValues } from "@/features/price-sheets/validation";
import { isServerDbConfigured } from "@/server/db";
import { createPriceSheetAction } from "@/server/price-sheets/actions";

export const dynamic = "force-dynamic";

export default function NewPriceSheetPage() {
  if (!isServerDbConfigured()) {
    return (
      <div className="space-y-8">
        <PageHeader
          eyebrow="Create"
          title="New Price Sheet"
          description="Configure the database connection before creating the first sheet."
          actions={
            <Link className={cn(buttonVariants({ size: "sm", variant: "outline" }))} href="/app/price-sheets">
              Back to Price Sheets
            </Link>
          }
        />
        <PlaceholderPanel
          title="Database setup required"
          description="Add DATABASE_URL and apply the schema before creating Price Sheets."
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Create"
        title="New Price Sheet"
        description="Create a workspace-owned sheet and add the first public pricing items."
      />
      <PriceSheetForm
        action={createPriceSheetAction}
        cancelHref="/app/price-sheets"
        initialValues={getEmptyPriceSheetFormValues()}
        mode="create"
      />
    </div>
  );
}

