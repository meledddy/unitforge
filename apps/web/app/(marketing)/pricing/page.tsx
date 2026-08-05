import { permanentRedirect } from "next/navigation";

import { marketingLinks } from "@/components/marketing/marketing-links";

export default function PricingPage() {
  permanentRedirect(marketingLinks.pricing);
}
