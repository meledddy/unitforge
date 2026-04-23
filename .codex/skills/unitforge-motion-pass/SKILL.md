---
name: unitforge-motion-pass
description: Add or refine motion, timing, transitions, and interaction feel across Unitforge web screens. Use when polishing client-side interactions, reveal sequences, hover states, scroll behavior, or state changes in `apps/web/src/features/*`, `apps/web/src/components/*`, `apps/web/app/globals.css`, or reusable UI primitives in `packages/ui/src/*`.
---

# Unitforge Motion Pass

## Overview

Use this skill after the layout and visual hierarchy are already solid.
Motion should make Unitforge feel deliberate and expensive, not busy.

## Motion Ownership

Start with the right layer:

- Screen-specific choreography:
  feature components in `apps/web/src/features/*`
- Shared interaction behavior:
  `packages/ui/src/components/*`
- Global feel:
  `apps/web/app/globals.css`

## Motion Rules

Preserve these rules:

- Motion must explain state change, hierarchy, or focus.
- Use a few meaningful transitions rather than motion everywhere.
- Favor eased, slightly asymmetric timing over default linear behavior.
- Keep hover motion small and tactile.
- Keep entrance motion subtle unless the screen is intentionally theatrical.
- Always preserve reduced-friction interaction on mobile.

## Good Targets

High-value motion work usually improves:

- hero reveals
- CTA hover and press response
- list/filter transitions
- modal/panel/accordion state changes
- focus transitions on forms
- language/theme switches
- publish/draft state changes

## Avoid

Avoid these mistakes:

- adding motion before fixing hierarchy
- long animations that block interaction
- stacking scale + blur + translate + opacity on everything
- using the same easing curve everywhere
- making critical form flows feel slower

## Practical Pattern

For a motion pass:

1. Identify the 2-3 most important state changes on the screen.
2. Choose one timing family for the screen.
3. Apply motion only to those transitions first.
4. Add hover/focus polish second.
5. Stop when the screen feels guided, not animated.

## Unitforge Notes

Use `lamp-login-shell.tsx` as a reminder that Unitforge can support expressive interaction, but do not copy its theatricality onto every screen.
The public price sheet and marketing pages usually need restrained motion, not spectacle.

## Response Pattern

When asked for a motion pass:

1. Name the key state changes that deserve motion.
2. Implement targeted motion on those paths.
3. Keep the final explanation focused on feel, timing, and restraint.
