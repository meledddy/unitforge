---
name: unitforge-marketing-polish
description: Polish Unitforge public marketing surfaces, especially Public Home and Pricing, including brand identity, logo treatment, light/dark themes, CTA states, premium spacing, and restrained motion. Use when work touches `apps/web/app/(marketing)/page.tsx`, `apps/web/app/(marketing)/pricing`, marketing header/footer components, marketing tokens, or public brand presentation without changing product logic.
---

# Unitforge Marketing Polish

## Overview

Use this skill for focused visual and interaction passes on Unitforge marketing pages. Keep changes scoped to public Home, Pricing, shared marketing branding, and global tokens only when needed by those surfaces.

## Scope

Primary files to inspect first:

- `apps/web/app/(marketing)/page.tsx`
- `apps/web/app/(marketing)/pricing/*`
- `apps/web/app/globals.css`
- `apps/web/src/components/*`
- `apps/web/src/features/*` only when the marketing route imports the feature

Do not touch authenticated app UI, Price Sheet product logic, auth, billing, rate limits, notifications, or data models unless the user explicitly expands scope.

## Design Rules

- Preserve current routes, copy structure, pricing logic, and section order unless explicitly asked.
- Use semantic CSS variables or established tokens before one-off colors.
- Keep the premium Unitforge direction: warm ivory/bone, deep plum/ink, champagne/copper accents, restrained neutrals.
- Use accent color selectively; do not turn every control gold.
- Preserve light and dark theme quality independently.
- Avoid sci-fi glow, generic SaaS gradients, decorative blobs, or heavy illustration unless requested.
- Do not reintroduce old orbit/halo/satellite logo language.

## Motion Rules

Use existing CSS or already-installed motion tools. Do not add a heavy dependency.

- Respect `prefers-reduced-motion`.
- Avoid layout shift.
- Prefer opacity, small translate, soft hover lift, and restrained timing.
- No bounce, spin, orbiting, aggressive parallax, or loading-like loops.

## Workflow

1. Read the current page and shared header/footer implementation before editing.
2. Identify whether the task is token, component, page polish, or motion.
3. Keep the edit area narrow and avoid redesigning unrelated sections.
4. Check desktop and mobile behavior when page structure or responsive classes change.
5. Summarize what changed and what was intentionally left untouched.

## Verification

Use the narrowest useful checks:

```powershell
pnpm typecheck
pnpm build
```

When visual changes are substantial, use browser QA for:

- `/` light/dark desktop and mobile
- `/pricing` light/dark desktop and mobile
- header/footer logo, CTA states, no clipping, no overflow, no unreadable contrast

