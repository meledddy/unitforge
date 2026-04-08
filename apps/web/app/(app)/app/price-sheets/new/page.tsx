import { PageHeader } from "@/components/app/page-header";
import { PriceSheetForm } from "@/features/price-sheets/price-sheet-form";
import { getEmptyPriceSheetFormValues } from "@/features/price-sheets/validation";
import { createPriceSheetAction } from "@/server/price-sheets/actions";

export const dynamic = "force-dynamic";

export default function NewPriceSheetPage() {
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
