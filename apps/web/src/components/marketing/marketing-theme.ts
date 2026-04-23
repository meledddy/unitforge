export type MarketingTheme = "light" | "dark";

export const marketingThemeStorageKey = "unitforge-marketing-theme";

export function getMarketingThemeBootstrapScript() {
  return `
    (function () {
      var root = document.documentElement;
      var fallback = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

      try {
        var stored = window.localStorage.getItem("${marketingThemeStorageKey}");
        root.dataset.marketingTheme = stored === "dark" || stored === "light" ? stored : fallback;
      } catch (error) {
        root.dataset.marketingTheme = fallback;
      }
    })();
  `;
}
