import { Badge } from "@unitforge/ui";

import type { PriceSheetStatus } from "./validation";

interface PriceSheetStatusBadgeProps {
  status: PriceSheetStatus;
}

export function PriceSheetStatusBadge({ status }: PriceSheetStatusBadgeProps) {
  if (status === "published") {
    return <Badge>Published</Badge>;
  }

  return <Badge variant="outline">Draft</Badge>;
}

