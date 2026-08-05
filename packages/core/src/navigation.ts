export const marketingLinks = [
  { href: "/#benefits", label: "Product" },
  { href: "/pricing", label: "Pricing" },
  { href: "/app", label: "Dashboard" },
] as const;

export const appNavigation = [
  {
    href: "/app",
    label: "Overview",
    description: "Published pages and recent inquiries.",
  },
  {
    href: "/app/price-sheets",
    label: "Price Sheets",
    description: "Create, publish, and manage service catalogs.",
  },
  {
    href: "/app/settings",
    label: "Settings",
    description: "Workspace, account, and plan details.",
  },
] as const;

export function isAppNavigationItemActive(href: string, pathname: string) {
  if (href === "/app") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getCurrentAppNavigationItem(pathname: string) {
  return (
    appNavigation.find((item) =>
      isAppNavigationItemActive(item.href, pathname),
    ) ?? null
  );
}
