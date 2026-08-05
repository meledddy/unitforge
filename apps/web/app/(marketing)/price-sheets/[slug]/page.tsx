import { appConfig } from "@unitforge/config";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import {
  isPriceSheetContentLocaleAvailable,
  mapInterfaceLanguageToPriceSheetContentLocale,
  resolvePriceSheetContent,
} from "@/features/price-sheets/localization";
import {
  getPublicPriceSheetDisplayTitle,
} from "@/features/price-sheets/public-display";
import { PublicPriceSheet } from "@/features/price-sheets/public-price-sheet";
import type { InterfaceLocale } from "@/i18n/interface-locale";
import { getCurrentInterfaceLocale } from "@/i18n/interface-locale.server";
import { getPublishedPriceSheetBySlug } from "@/server/price-sheets/service";

export const dynamic = "force-dynamic";

const getCachedPublishedPriceSheetBySlug = cache(getPublishedPriceSheetBySlug);

interface PublicPriceSheetPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    lang?: string;
  }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: PublicPriceSheetPageProps): Promise<Metadata> {
  const [{ slug }, { lang }, interfaceLocale] = await Promise.all([
    params,
    searchParams,
    getCurrentInterfaceLocale(),
  ]);
  const priceSheet = await getCachedPublishedPriceSheetBySlug(slug);

  if (!priceSheet) {
    return {
      title: "Price sheet",
      robots: { index: false, follow: false },
    };
  }

  const requestedInterfaceLocale = resolvePublicPriceSheetLanguage(
    lang,
    interfaceLocale,
  );
  const requestedContentLocale = mapInterfaceLanguageToPriceSheetContentLocale(
    requestedInterfaceLocale,
  );
  const contentLocale = isPriceSheetContentLocaleAvailable({
    defaultContentLocale: priceSheet.defaultContentLocale,
    requestedContentLocale,
    translations: priceSheet.translations,
    items: priceSheet.items,
  })
    ? requestedContentLocale
    : priceSheet.defaultContentLocale;
  const publicInterfaceLocale: InterfaceLocale =
    contentLocale === "ru-RU" ? "ru" : "en";
  const localizedContent = resolvePriceSheetContent({
    defaultContentLocale: priceSheet.defaultContentLocale,
    requestedContentLocale: contentLocale,
    title: priceSheet.title,
    description: priceSheet.description,
    translations: priceSheet.translations,
  });
  const canonicalPath = `/price-sheets/${priceSheet.slug}`;
  const isDemo = priceSheet.slug.startsWith("demo-");
  const displayTitle = getPublicPriceSheetDisplayTitle({
    isDemo,
    title: localizedContent.title,
  });
  const localizedPath = `${canonicalPath}?lang=${publicInterfaceLocale}`;
  const fallbackDescription =
    publicInterfaceLocale === "ru"
      ? `Услуги и цены: ${displayTitle}.`
      : `Services and prices from ${displayTitle}.`;
  const baseDescription = localizedContent.description || fallbackDescription;
  const title = isDemo
    ? publicInterfaceLocale === "ru"
      ? `Демо Unitforge — ${displayTitle}`
      : `Unitforge demo — ${displayTitle}`
    : displayTitle;
  const description = isDemo
    ? `${
        publicInterfaceLocale === "ru"
          ? "Вымышленные демонстрационные данные Unitforge."
          : "Fictional Unitforge demo data."
      } ${baseDescription}`
    : baseDescription;
  const languageAlternates = Object.fromEntries(
    [
      ["en", "en-US"],
      ["ru", "ru-RU"],
    ].flatMap(([language, locale]) =>
      isPriceSheetContentLocaleAvailable({
        defaultContentLocale: priceSheet.defaultContentLocale,
        requestedContentLocale: locale as "en-US" | "ru-RU",
        translations: priceSheet.translations,
        items: priceSheet.items,
      })
        ? [[language, `${canonicalPath}?lang=${language}`]]
        : [],
    ),
  );

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: languageAlternates,
    },
    openGraph: {
      type: "website",
      siteName: appConfig.name,
      title,
      description,
      url: localizedPath,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    ...(isDemo
      ? {
          robots: { index: false, follow: false },
        }
      : {}),
  };
}

export default async function PublicPriceSheetPage({
  params,
  searchParams,
}: PublicPriceSheetPageProps) {
  const [{ slug }, { lang }, interfaceLocale] = await Promise.all([
    params,
    searchParams,
    getCurrentInterfaceLocale(),
  ]);
  const priceSheet = await getCachedPublishedPriceSheetBySlug(slug);

  if (!priceSheet) {
    notFound();
  }

  const publicInterfaceLocale = resolvePublicPriceSheetLanguage(
    lang,
    interfaceLocale,
  );

  return (
    <PublicPriceSheet
      interfaceLocale={publicInterfaceLocale}
      priceSheet={priceSheet}
      requestedContentLanguage={publicInterfaceLocale}
    />
  );
}

function resolvePublicPriceSheetLanguage(
  requestedLanguage: string | undefined,
  fallbackLocale: InterfaceLocale,
): InterfaceLocale {
  if (requestedLanguage === "ru" || requestedLanguage === "ru-RU") {
    return "ru";
  }

  if (requestedLanguage === "en" || requestedLanguage === "en-US") {
    return "en";
  }

  return fallbackLocale;
}
