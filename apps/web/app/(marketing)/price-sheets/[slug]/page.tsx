import { notFound } from "next/navigation";

import { PublicPriceSheet } from "@/features/price-sheets/public-price-sheet";
import { getCurrentInterfaceLocale } from "@/i18n/interface-locale.server";
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
  const [{ slug }, { lang }, interfaceLocale] = await Promise.all([params, searchParams, getCurrentInterfaceLocale()]);
  const priceSheet = await getPublishedPriceSheetBySlug(slug);

  if (!priceSheet) {
    notFound();
  }

  return <PublicPriceSheet interfaceLocale={interfaceLocale} priceSheet={priceSheet} requestedContentLanguage={lang} />;
}

