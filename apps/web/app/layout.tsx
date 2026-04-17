import "./globals.css";

import { appConfig } from "@unitforge/config";
import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";
import type { ReactNode } from "react";

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
    <html lang={getInterfaceLocaleTag(locale)}>
      <body className={`${sans.variable} ${mono.variable} min-h-screen font-sans text-foreground`}>{children}</body>
    </html>
  );
}
