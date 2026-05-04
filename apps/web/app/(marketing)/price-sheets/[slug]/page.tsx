import { notFound } from "next/navigation";

import { PublicPriceSheet } from "@/features/price-sheets/public-price-sheet";
import type { InterfaceLocale } from "@/i18n/interface-locale";
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

  const publicInterfaceLocale = resolvePublicPriceSheetLanguage(lang, interfaceLocale);

  return <PublicPriceSheet interfaceLocale={publicInterfaceLocale} priceSheet={priceSheet} requestedContentLanguage={publicInterfaceLocale} />;
}

function resolvePublicPriceSheetLanguage(requestedLanguage: string | undefined, fallbackLocale: InterfaceLocale): InterfaceLocale {
  if (requestedLanguage === "ru" || requestedLanguage === "ru-RU") {
    return "ru";
  }

  if (requestedLanguage === "en" || requestedLanguage === "en-US") {
    return "en";
  }

  return fallbackLocale;
}

