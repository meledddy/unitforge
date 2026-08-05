import "./globals.css";
import "@/env";

import { appConfig } from "@unitforge/config";
import type { Metadata } from "next";
import { Cormorant_Garamond, IBM_Plex_Mono, Manrope } from "next/font/google";
import type { ReactNode } from "react";

import { getAppThemeBootstrapScript } from "@/components/app/app-theme";
import { getMarketingThemeBootstrapScript } from "@/components/marketing/marketing-theme";
import { getInterfaceLocaleTag } from "@/i18n/interface-locale";
import { getCurrentInterfaceLocale } from "@/i18n/interface-locale.server";

const sans = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

const serif = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  variable: "--font-serif",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
  applicationName: appConfig.name,
  title: {
    default: appConfig.name,
    template: `%s | ${appConfig.name}`,
  },
  description: appConfig.description,
  openGraph: {
    type: "website",
    siteName: appConfig.name,
    title: appConfig.name,
    description: appConfig.description,
  },
  twitter: {
    card: "summary",
    title: appConfig.name,
    description: appConfig.description,
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const locale = await getCurrentInterfaceLocale();

  return (
    <html lang={getInterfaceLocaleTag(locale)} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: getMarketingThemeBootstrapScript(),
          }}
        />
        <script
          dangerouslySetInnerHTML={{ __html: getAppThemeBootstrapScript() }}
        />
      </head>
      <body
        className={`${sans.variable} ${mono.variable} ${serif.variable} text-foreground min-h-screen font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
