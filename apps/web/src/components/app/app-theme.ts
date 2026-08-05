export type AppTheme = "light" | "dark";

export const appThemeStorageKey = "unitforge-app-theme";
export const legacyLoginThemeStorageKey = "unitforge-login-theme";

export function getAppThemeBootstrapScript() {
  return `
    (function () {
      var root = document.documentElement;
      var path = window.location.pathname || "";

      if (!path || (path.indexOf("/app") !== 0 && path.indexOf("/login") !== 0)) {
        return;
      }

      var fallback = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

      try {
        var stored = window.localStorage.getItem("${appThemeStorageKey}");
        var legacyLogin = window.localStorage.getItem("${legacyLoginThemeStorageKey}");
        root.dataset.appTheme = stored === "dark" || stored === "light" ? stored : legacyLogin === "dark" || legacyLogin === "light" ? legacyLogin : fallback;
      } catch (error) {
        root.dataset.appTheme = fallback;
      }
    })();
  `;
}
