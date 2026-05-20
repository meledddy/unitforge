---
name: unitforge-price-sheet-operator-ui
description: Polish authenticated Unitforge Price Sheet operator surfaces under `/app/price-sheets`, including the list page, edit page, section hierarchy, save actions, item editor density, inquiry inbox presentation, search/filter/load-more behavior, and responsive management UI.
---

# Unitforge Price Sheet Operator UI

## Overview

Use this skill for authenticated operator-facing Price Sheet management screens. The goal is a calm, dense, practical workspace, not a marketing page.

## Files

Start with:

- `apps/web/app/(app)/app/price-sheets/page.tsx`
- `apps/web/app/(app)/app/price-sheets/[priceSheetId]/page.tsx`
- `apps/web/app/(app)/app/price-sheets/new/*`
- `apps/web/src/features/price-sheets/price-sheet-form.tsx`
- `apps/web/src/features/price-sheets/price-sheet-list*.tsx`
- `apps/web/src/features/price-sheets/price-sheet-leads-panel.tsx`
- `apps/web/src/i18n/messages.ts`

Use `unitforge-price-sheets` with this skill for mutations, validation, publication status, duplication, localization, or persistence changes.

## UI Principles

- Keep operator workflows fast: title, status, primary action, and next step should be obvious.
- Use compact surfaces, soft borders, clear section headers, dividers, and controlled density.
- Avoid long helper paragraphs. If clarity is missing, improve labels or section structure first.
- Separate primary and secondary actions.
- Preserve semantic buttons/links, focus states, and accessible labels.
- Long titles, slugs, emails, and phone values must wrap or truncate safely.

## List Surface

- Do not render every sheet as an endless long list.
- Prefer 4-5 initial items with load-more unless server pagination already exists.
- Search and filters must interact correctly with visible item logic.
- Published/draft state must be immediately scannable.
- Preserve existing actions: open/edit, public page, duplicate, publish/unpublish.

## Edit Surface

- Group the editor by task: publishing setup, appearance, contact/CTA, business details, page content, services/items, inquiries.
- Top save controls should be compact and useful; bottom controls can remain as final form actions.
- Theme and appearance should feel like one visual setting group.
- Item cards should be collapsed by default in edit mode when practical.
- Expanded item cards should separate shared fields from localized content without feeling displaced.
- Keep delete confirmation behavior intact.

## Verification

```powershell
pnpm typecheck
pnpm build
pnpm verify:price-sheets
```

Manual checks when relevant:

- `/app/price-sheets`
- `/app/price-sheets/new`
- `/app/price-sheets/[priceSheetId]`
- search/filter/no-results/load-more
- save and return/continue
- item collapse, duplicate, remove
- RU/EN labels

