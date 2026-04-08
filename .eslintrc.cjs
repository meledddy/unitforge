module.exports = {
  root: true,
  ignorePatterns: ["**/dist/**", "**/.next/**", "**/node_modules/**", "**/coverage/**", "**/next-env.d.ts"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "simple-import-sort"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
  overrides: [
    {
      files: ["apps/web/**/*.{ts,tsx}"],
      extends: ["next/core-web-vitals"],
      parserOptions: {
        project: "./apps/web/tsconfig.json",
        tsconfigRootDir: __dirname,
      },
    },
    {
      files: ["packages/**/*.{ts,tsx}"],
      parserOptions: {
        project: [
          "./packages/ui/tsconfig.json",
          "./packages/core/tsconfig.json",
          "./packages/db/tsconfig.json",
          "./packages/billing/tsconfig.json",
          "./packages/analytics/tsconfig.json",
          "./packages/config/tsconfig.json",
        ],
        tsconfigRootDir: __dirname,
      },
    },
    {
      files: ["**/*.{ts,tsx}"],
      rules: {
        "@typescript-eslint/consistent-type-imports": [
          "error",
          {
            prefer: "type-imports",
          },
        ],
        "simple-import-sort/imports": "error",
        "simple-import-sort/exports": "error",
      },
    },
  ],
};
