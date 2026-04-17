import { PageHeader } from "@/components/app/page-header";
import { PriceSheetForm } from "@/features/price-sheets/price-sheet-form";
import { getEmptyPriceSheetFormValues } from "@/features/price-sheets/validation";
import { getCurrentInterfaceLocale } from "@/i18n/interface-locale.server";
import { getMessages } from "@/i18n/messages";
import { createPriceSheetAction } from "@/server/price-sheets/actions";

export const dynamic = "force-dynamic";

export default async function NewPriceSheetPage() {
  const locale = await getCurrentInterfaceLocale();
  const messages = getMessages(locale);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={messages.priceSheets.createEyebrow}
        title={messages.priceSheets.createTitle}
        description={messages.priceSheets.createDescription}
      />
      <PriceSheetForm
        action={createPriceSheetAction}
        cancelHref="/app/price-sheets"
        initialValues={getEmptyPriceSheetFormValues()}
        locale={locale}
        mode="create"
      />
    </div>
  );
}
