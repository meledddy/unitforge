import {
  type DashboardInquiry,
  DashboardOverview,
} from "@/components/app/dashboard-overview";
import { getCurrentInterfaceLocale } from "@/i18n/interface-locale.server";
import { isUnitforgeAdminEmail } from "@/server/access-requests/admin";
import { requireCurrentAppShellSession } from "@/server/current-session";
import { listWorkspacePriceSheetLeads } from "@/server/price-sheet-leads/service";
import { listWorkspacePriceSheets } from "@/server/price-sheets/service";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [session, locale] = await Promise.all([
    requireCurrentAppShellSession(),
    getCurrentInterfaceLocale(),
  ]);
  const priceSheets = await listWorkspacePriceSheets(session);
  const leadsByPriceSheet = await Promise.all(
    priceSheets.map(async (priceSheet) => {
      const leads = await listWorkspacePriceSheetLeads(session, priceSheet.id);

      return leads.map(
        (lead) =>
          ({
            ...lead,
            priceSheetTitle: priceSheet.title,
          }) satisfies DashboardInquiry,
      );
    }),
  );
  const inquiries = leadsByPriceSheet
    .flat()
    .sort(
      (left, right) => right.createdAt.getTime() - left.createdAt.getTime(),
    );
  const operatorName = session.currentUser.name || session.currentUser.email;

  return (
    <DashboardOverview
      accessRequestsHref={
        isUnitforgeAdminEmail(session.currentUser.email)
          ? "/app/access-requests"
          : undefined
      }
      inquiries={inquiries}
      locale={locale}
      operatorName={operatorName}
      priceSheets={priceSheets}
      workspaceName={session.currentWorkspace.name}
    />
  );
}
