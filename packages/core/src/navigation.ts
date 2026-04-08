export const marketingLinks = [
  { href: "/#platform", label: "Platform" },
  { href: "/pricing", label: "Pricing" },
  { href: "/app", label: "Dashboard" },
] as const;

export const appNavigation = [
  {
    href: "/app",
    label: "Overview",
    description: "Workspace status, product surfaces, and rollout readiness.",
  },
  {
    href: "/app/price-sheets",
    label: "Price Sheets",
    description: "Pricing operations scaffolded against the shared schema.",
  },
  {
    href: "/app/settings",
    label: "Settings",
    description: "Workspace defaults, billing setup, and integration status.",
  },
] as const;

export function isAppNavigationItemActive(href: string, pathname: string) {
  if (href === "/app") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getCurrentAppNavigationItem(pathname: string) {
  return appNavigation.find((item) => isAppNavigationItemActive(item.href, pathname)) ?? null;
}
