import { notFound } from "next/navigation";

import { PublicPriceSheet } from "@/features/price-sheets/public-price-sheet";
import { getPublishedPriceSheetBySlug } from "@/server/price-sheets/service";

export const dynamic = "force-dynamic";

interface PublicPriceSheetPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    lang?: string;
  }>;
}

export default async function PublicPriceSheetPage({ params, searchParams }: PublicPriceSheetPageProps) {
  const [{ slug }, { lang }] = await Promise.all([params, searchParams]);
  const priceSheet = await getPublishedPriceSheetBySlug(slug);

  if (!priceSheet) {
    notFound();
  }

  return <PublicPriceSheet priceSheet={priceSheet} requestedLanguage={lang} />;
}

