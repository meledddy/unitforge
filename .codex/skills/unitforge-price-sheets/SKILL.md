---
name: unitforge-price-sheets
description: Investigate or modify Unitforge Price Sheets workspace CRUD, publication, localization, duplication, public rendering, and inquiry capture flows. Use when work touches `apps/web/app/(app)/app/price-sheets*`, `apps/web/app/(marketing)/price-sheets/[slug]`, `apps/web/src/features/price-sheets/*`, `apps/web/src/server/price-sheets/*`, `apps/web/src/server/price-sheet-leads/*`, or `apps/web/scripts/verify-price-sheets.ts`.
---

# Unitforge Price Sheets

## Overview

Use this skill for the main live product surface in Unitforge.
Anchor changes to the existing route split: operator workspace under `/app/price-sheets` and public sheets under `/price-sheets/[slug]`.

## Scope Split

Map the request to one primary slice:

- Operator list and editor routes:
  `apps/web/app/(app)/app/price-sheets/page.tsx`
  `apps/web/app/(app)/app/price-sheets/new/*`
  `apps/web/app/(app)/app/price-sheets/[priceSheetId]/*`
- Public rendering:
  `apps/web/app/(marketing)/price-sheets/[slug]/page.tsx`
  `apps/web/src/features/price-sheets/public-price-sheet.tsx`
- Form and validation:
  `apps/web/src/features/price-sheets/price-sheet-form.tsx`
  `apps/web/src/features/price-sheets/validation.ts`
  `apps/web/src/features/price-sheets/localization.ts`
  `apps/web/src/features/price-sheets/public-settings.ts`
- Services and persistence:
  `apps/web/src/server/price-sheets/*`
  `apps/web/src/server/price-sheet-leads/*`
  `packages/db/src/schema.ts`

## Working Rules

Preserve these invariants unless the task explicitly changes them:

- Only `published` sheets are visible on the public route.
- Inquiry capture only works for published sheets and only when `publicSettings.inquiryEnabled` is true.
- Slugs must stay globally unique and obey the validation regex `^[a-z0-9]+(?:-[a-z0-9]+)*$`.
- Content locales are currently limited to `en-US` and `ru-RU`.
- Secondary translation fields map to the alternate locale selected by `defaultContentLocale`.
- Duplication creates a new draft sheet with a `Copy` title and a unique `-copy` slug variant.
- Cross-workspace access must fail with `NOT_FOUND`, not with data leakage.

## Verification Path

Targeted flow check:

```powershell
pnpm verify:price-sheets
```

Broader safety net:

```powershell
pnpm typecheck
pnpm --filter @unitforge/web typecheck
pnpm --filter @unitforge/web build
```

Environment gates:

- `pnpm verify:price-sheets` requires `DATABASE_URL`.
- The verification script assumes the seeded app shell session from `apps/web/scripts/bootstrap-session.ts`.

Useful runtime checks after changes:

```text
/app/price-sheets
/app/price-sheets/new
/price-sheets/<slug>
/price-sheets/<slug>?lang=ru
```

## Common Failure Modes

- Updating UI fields without keeping `toPriceSheetMutationInput` and `toPriceSheetFormValues` in sync.
- Breaking the relationship between `defaultContentLocale` and secondary translations.
- Making list or public queries ignore workspace boundaries or publication status.
- Forgetting to preserve `publicSettings` when duplicating or updating a sheet.
- Accepting inquiry submissions for drafts or hidden inquiry states.
- Editing search/filter UI without matching the list service filter contract.

## Response Pattern

When asked to work in this area:

1. Decide whether the bug is operator, public, validation, or persistence owned.
2. Read `apps/web/scripts/verify-price-sheets.ts` before making broad assumptions.
3. Patch the lowest layer that restores the invariant.
4. Re-run the targeted verification and then only widen to repo checks if needed.
