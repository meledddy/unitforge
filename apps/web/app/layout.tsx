import "./globals.css";

import { appConfig } from "@unitforge/config";
import type { Metadata } from "next";
import { Cormorant_Garamond, IBM_Plex_Mono, Manrope } from "next/font/google";
import type { ReactNode } from "react";

import { getAppThemeBootstrapScript } from "@/components/app/app-theme";
import { getMarketingThemeBootstrapScript } from "@/components/marketing/marketing-theme";
import { getInterfaceLocaleTag } from "@/i18n/interface-locale";
import { getCurrentInterfaceLocale } from "@/i18n/interface-locale.server";

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

const serif = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  variable: "--font-serif",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: appConfig.name,
    template: `%s | ${appConfig.name}`,
  },
  description: appConfig.description,
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getCurrentInterfaceLocale();

  return (
    <html lang={getInterfaceLocaleTag(locale)} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: getMarketingThemeBootstrapScript() }} />
        <script dangerouslySetInnerHTML={{ __html: getAppThemeBootstrapScript() }} />
      </head>
      <body className={`${sans.variable} ${mono.variable} ${serif.variable} min-h-screen font-sans text-foreground`}>{children}</body>
    </html>
  );
}
