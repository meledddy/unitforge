---
name: unitforge-browser-design-qa
description: Run repeatable in-app browser QA for Unitforge marketing and design changes. Use when checking localhost Unitforge pages for desktop/mobile layout, light/dark theme behavior, header/logo rendering, contrast, clipping, overlap, visual regressions, and concise design-review summaries after frontend edits.
---

# Unitforge Browser Design QA

Use this skill after Unitforge marketing or design-system edits when browser verification is needed.

## Scope

Focus on visible product quality, not broad refactors:

- marketing home `/`
- pricing `/pricing`
- shared marketing header/footer
- public brand/logo surfaces
- light and dark marketing themes
- desktop and mobile responsive states

Do not inspect authenticated app UI, auth pages, Price Sheets product areas, or billing flows unless the user explicitly includes them.

## Workflow

1. Confirm the local dev server is running. If not, start it with the repo dev command and note the URL.
2. Open the target URL in the in-app browser, preferring `http://127.0.0.1:3000`.
3. Capture one orientation screenshot before interacting.
4. Check the exact surfaces affected by the change.
5. Toggle light/dark using the visible marketing theme control.
6. Check a mobile-width view when the browser surface or test setup supports it.
7. Review console errors and visible Next.js overlays.
8. End with findings first, then verification notes.

## Design Checks

For each affected page, verify:

- Logo is not clipped, cropped, blurry, or visually lost at header size.
- Header controls fit without overlap at mobile width.
- Main hero text does not collide with controls, badges, cards, or browser overlays.
- Accent color is selective, not applied to every interactive element.
- Text contrast remains readable in light and dark themes.
- Borders and cards remain calm and consistent with Unitforge premium direction.
- Theme toggle preserves state and does not break the page background.
- No unexpected layout jump appears after reload or theme switch.

## Browser Discipline

- Prefer screenshots for visual judgment and DOM snapshots for locator certainty.
- Do not dump full page text unless needed for a specific locator.
- Before clicking a control, confirm the locator resolves to one element when it is not obviously unique.
- After a theme switch, reload only when needed to verify persistence or hot reload.
- If the in-app browser is stuck at a mobile width, say that desktop visual QA was limited instead of pretending it was covered.

## Output

Use this shape:

1. Top visual risks or "No blocking visual issues found."
2. Pages and states checked.
3. Verification commands or browser checks run.
4. Remaining limitations.

Keep the summary short and actionable.
