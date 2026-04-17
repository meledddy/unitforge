import { Badge } from "@unitforge/ui";

import type { InterfaceLocale } from "@/i18n/interface-locale";
import { getMessages } from "@/i18n/messages";

import type { PriceSheetStatus } from "./validation";

interface PriceSheetStatusBadgeProps {
  locale: InterfaceLocale;
  status: PriceSheetStatus;
}

export function PriceSheetStatusBadge({ locale, status }: PriceSheetStatusBadgeProps) {
  const messages = getMessages(locale);

  if (status === "published") {
    return <Badge>{messages.priceSheets.statusPublished}</Badge>;
  }

  return <Badge variant="outline">{messages.priceSheets.statusDraft}</Badge>;
}
