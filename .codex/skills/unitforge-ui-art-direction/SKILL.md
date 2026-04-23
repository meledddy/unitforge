---
name: unitforge-ui-art-direction
description: Create or reshape Unitforge screens with strong visual direction, hierarchy, and component language. Use when redesigning landing pages, pricing surfaces, login, dashboard shells, or shared UI tokens in `apps/web/app/*`, `apps/web/app/globals.css`, `apps/web/src/components/*`, `apps/web/src/features/*`, or `packages/ui/src/*`.
---

# Unitforge UI Art Direction

## Overview

Use this skill when the request is about making Unitforge feel more premium, memorable, and intentional.
Drive the work from visual direction first, then map it into tokens, layout, and component decisions.

## Start Position

Assume these are the main levers:

- Global tokens:
  `apps/web/app/globals.css`
  `apps/web/tailwind.config.ts`
- Shared primitives:
  `packages/ui/src/components/*`
- High-visibility screens:
  `apps/web/app/(marketing)/page.tsx`
  `apps/web/src/features/auth/lamp-login-shell.tsx`
  `apps/web/src/features/price-sheets/public-price-sheet.tsx`
  `apps/web/src/features/price-sheets/public-theme.ts`

## Working Method

For a new screen or redesign, always do the work in this order:

1. Define the visual thesis in 3-5 lines.
2. Pick one dominant mood:
   warm editorial
   industrial premium
   quiet luxury software
   precise modern utility
3. Identify the hero moment:
   the first thing the user should remember after 3 seconds.
4. Translate that into system changes:
   palette
   type hierarchy
   surface treatment
   spacing rhythm
   CTA treatment
5. Only then patch screen-level JSX and classes.

## Design Rules

Keep these rules unless the user asks to break them:

- Avoid generic SaaS neutrality. Each key screen should have one visible idea.
- Preserve clarity over ornament. Decorative layers must reinforce hierarchy.
- Prefer a small number of strong motifs over many weak flourishes.
- Use `packages/ui` for reusable patterns once a treatment appears twice.
- Do not let premium styling destroy readability, density, or mobile flow.
- Validate both English and Russian copy lengths on high-value screens.

## What To Change First

Choose the smallest layer that creates the biggest visual improvement:

- If multiple screens feel bland, start with `globals.css` tokens and `packages/ui`.
- If one flagship screen feels weak, start in the feature component.
- If the UI looks inconsistent, extract a reusable surface/card/button pattern.
- If the layout reads poorly, fix hierarchy and spacing before color or effects.

## High-Value Outputs

Good work from this skill usually includes one or more of:

- a clearer visual thesis for the screen
- improved section rhythm
- stronger headline and CTA hierarchy
- better depth and contrast strategy
- a reusable premium surface pattern
- fewer generic defaults in cards, badges, and buttons

## Anti-Patterns

Avoid these:

- “make it prettier” changes that only add gradients and blur
- polishing one component while the page hierarchy stays weak
- adding multiple accent colors without a clear role split
- using motion or glow to hide poor layout
- overusing `packages/ui` defaults when the screen needs bespoke composition

## Response Pattern

When asked to redesign:

1. State the visual direction in concrete terms.
2. Name the primary files that own the look.
3. Implement the design directly.
4. Summarize the result in terms of hierarchy, mood, and reuse potential.
