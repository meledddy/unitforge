export type AppTheme = "light" | "dark";

export const appThemeStorageKey = "unitforge-app-theme";

export function getAppThemeBootstrapScript() {
  return `
    (function () {
      var root = document.documentElement;
      var path = window.location.pathname || "";

      if (!path || path.indexOf("/app") !== 0) {
        return;
      }

      var fallback = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

      try {
        var stored = window.localStorage.getItem("${appThemeStorageKey}");
        root.dataset.appTheme = stored === "dark" || stored === "light" ? stored : fallback;
      } catch (error) {
        root.dataset.appTheme = fallback;
      }
    })();
  `;
}
