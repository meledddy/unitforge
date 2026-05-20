---
name: unitforge-public-price-sheet-polish
description: Polish the customer-facing Unitforge Public Price Sheet page, including `/price-sheets/[slug]`, amber/stone/slate presentation themes, light/dark sheet appearance, language switching, business details, public inquiry form UX, validation states, and customer-facing header/footer behavior.
---

# Unitforge Public Price Sheet Polish

## Overview

Use this skill for the customer-facing price sheet page that service businesses share with clients. It is a public document surface, not a marketing landing page and not the authenticated operator app.

## Files

Start with:

- `apps/web/app/(marketing)/price-sheets/[slug]/page.tsx`
- `apps/web/src/features/price-sheets/public-price-sheet.tsx`
- `apps/web/src/features/price-sheets/public-settings.ts`
- `apps/web/src/features/price-sheets/localization.ts`
- `apps/web/src/server/price-sheets/*`
- `apps/web/src/server/price-sheet-leads/*`
- `apps/web/src/i18n/messages.ts`

Use `unitforge-price-sheets` with this skill when persistence, validation, publication status, or lead capture logic is involved.

## Product Rules

- Public visitors must not control light/dark appearance.
- Public rendering uses `presentationTheme` for amber/stone/slate and `presentationAppearance` for light/dark.
- Keep the single visible language switch for the whole public page UI and content.
- If translated content is missing, fall back safely without breaking layout.
- Do not show empty business detail rows.
- Keep the inquiry form as the universal action; it may be collapsed, but validation errors must reopen/highlight fields.
- Lead submission must not expose private lead data publicly.

## Visual Rules

- Amber, stone, and slate are variants of one premium template, not separate products.
- Light appearance needs clear surface hierarchy; dark appearance needs contrast without muddy low-light text.
- Avoid strong yellow borders, sci-fi effects, heavy glow, or artificial filler sections.
- Solve sparse one-item pages with stable layout rhythm, not conditional filler blocks.
- The public header should remain minimal and customer-facing.

## Workflow

1. Inspect existing DTO/types before adding any public field.
2. Prefer optional display of real business metadata over schema expansion.
3. Preserve publication and workspace access invariants.
4. Patch UI, copy, and validation together when form behavior changes.
5. Check mobile widths around 390px and 430px when responsive layout changes.

## Verification

```powershell
pnpm typecheck
pnpm build
pnpm verify:price-sheets
```

Browser QA targets:

- amber light/dark
- stone light/dark
- slate light/dark
- EN/RU switch changes UI labels and content
- invalid lead form highlights fields
- successful lead submission if practical

