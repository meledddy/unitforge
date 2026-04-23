---
name: unitforge-design-review
description: Critique and prioritize UI or UX improvements in Unitforge from a senior product design perspective. Use when reviewing existing screens for hierarchy, consistency, mobile behavior, localization fit, accessibility, or polish across `apps/web/app/*`, `apps/web/src/features/*`, and `packages/ui/src/*`.
---

# Unitforge Design Review

## Overview

Use this skill when the main task is evaluation, critique, or prioritization instead of immediate redesign.
Review the screen like a demanding product designer with commercial taste, not like a linter.

## Review Order

Check the screen in this order:

1. First impression:
   does the page have a strong idea or does it feel generic
2. Hierarchy:
   can a user understand the structure in 3 seconds
3. Rhythm:
   spacing, grouping, and density
4. Surface language:
   cards, buttons, badges, inputs, shadows, borders
5. Interaction:
   hover, focus, active, loading, empty, error, disabled
6. Responsive behavior:
   desktop, tablet, mobile
7. Localization:
   RU and EN fit, wrap, and density

## Severity Model

When reviewing, prioritize findings like this:

- High:
  harms trust, clarity, conversion, or makes the product look amateur
- Medium:
  creates visible inconsistency or weakens the brand feel
- Low:
  minor polish issue with limited product impact

## Review Standards

Good findings are:

- visually specific
- tied to the user impression
- tied to a concrete file or screen
- prioritized by impact, not by count

Bad findings are:

- generic advice with no visible consequence
- tiny polish notes before naming the real hierarchy problem
- feedback that ignores RU/EN behavior

## Preferred Output

When this skill is used for review, structure the result as:

1. top 1-3 findings first
2. one-line reasoning for why each matters commercially
3. exact owning files
4. only then optional improvement direction

## Unitforge Notes

Be especially strict on:

- landing page distinctiveness
- public price sheet trust and premium feel
- login screen consistency between theatrical shell and form UX
- shared primitive quality in `packages/ui`

## Response Pattern

If the user asks for a review, do not start coding by default.
Lead with the highest-signal design findings unless the user explicitly asks for implementation.
