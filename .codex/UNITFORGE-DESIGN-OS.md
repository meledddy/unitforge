# Unitforge Design OS

## Purpose

This operating system is for making Unitforge feel closer to a premium, animated, designer-led product without waiting for desktop `computer use` on Windows.

Use it in a fixed sequence:

1. Choose visual direction with `$unitforge-ui-art-direction`
2. Add interaction feel with `$unitforge-motion-pass`
3. Critique the result with `$unitforge-design-review`

## Skills

1. `$unitforge-ui-art-direction`
   Path: `.codex/skills/unitforge-ui-art-direction/SKILL.md`
   Use for new visual direction, premium polish, hierarchy changes, surface language, landing page redesign, login redesign, and shared UI upgrades.

2. `$unitforge-motion-pass`
   Path: `.codex/skills/unitforge-motion-pass/SKILL.md`
   Use after layout is already good. Focus on timing, transitions, hover, reveal, and interaction feel.

3. `$unitforge-design-review`
   Path: `.codex/skills/unitforge-design-review/SKILL.md`
   Use for critique, prioritization, design QA, and deciding what to fix next.

## How To Use The Skills

Use one skill when the task is narrow.
Use two skills when the work has a natural second pass.
Use all three only for flagship screens.

Recommended sequencing:

- New flagship page:
  `$unitforge-ui-art-direction` -> `$unitforge-motion-pass` -> `$unitforge-design-review`
- Polish an already decent page:
  `$unitforge-motion-pass` -> `$unitforge-design-review`
- Audit a weak screen before changing code:
  `$unitforge-design-review`

## Prompt Formula

Every strong design prompt should specify:

1. the screen
2. the visual direction
3. the constraints
4. the viewports
5. the success bar

Template:

```text
Use $skill-name at .codex/skills/skill-name/SKILL.md.
Screen: <screen>.
Direction: <visual thesis>.
Do not change: <logic/data/routing constraints>.
Check: <desktop/mobile/ru/en>.
Success means: <clear visual outcome>.
```

## Five Design Prompts

1. Landing page art direction

```text
Use $unitforge-ui-art-direction at .codex/skills/unitforge-ui-art-direction/SKILL.md.
Redesign the Unitforge marketing landing page in apps/web/app/(marketing)/page.tsx so it feels like a premium industrial studio tool, not a generic SaaS launch page.
Do not change the product scope, pricing content, routing, or bilingual support.
Focus on stronger section rhythm, sharper typography hierarchy, more intentional surfaces, and a more memorable hero.
Check desktop and mobile. Success means the page feels sellable to a design-sensitive customer in under 5 seconds.
```

2. Public price sheet flagship redesign

```text
Use $unitforge-ui-art-direction at .codex/skills/unitforge-ui-art-direction/SKILL.md and $unitforge-motion-pass at .codex/skills/unitforge-motion-pass/SKILL.md.
Upgrade the public price sheet experience across apps/web/src/features/price-sheets/public-price-sheet.tsx and public-theme.ts so it feels closer to a premium editorial product with subtle motion.
Do not change publication logic, lead capture behavior, data shape, or locale rules.
Focus on hierarchy, section pacing, CTA treatment, premium depth, and restrained animation.
Verify desktop, mobile, default locale, and ?lang=ru.
```

3. Login screen coherence pass

```text
Use $unitforge-ui-art-direction at .codex/skills/unitforge-ui-art-direction/SKILL.md and $unitforge-design-review at .codex/skills/unitforge-design-review/SKILL.md.
Refine the Unitforge login experience so the lamp interaction and the sign-in form feel like one cohesive premium experience instead of a strong shell with a weaker form.
Keep the lamp mechanic, auth flow, accessibility, and locale behavior intact.
Improve hierarchy, visual integration, control styling, and emotional coherence.
Leave the screen feeling designer-led without becoming gimmicky.
```

4. Shared UI premium primitives pass

```text
Use $unitforge-ui-art-direction at .codex/skills/unitforge-ui-art-direction/SKILL.md.
Upgrade the shared primitives in packages/ui/src/components/button.tsx and card.tsx so more screens inherit a premium baseline without bespoke redesign every time.
Do not break API shape or general usability.
Focus on defaults for radius, borders, shadows, density, contrast, and interaction feel that better fit Unitforge's warm premium direction.
Explain which improvements become system-level wins for future screens.
```

5. Senior design critique

```text
Use $unitforge-design-review at .codex/skills/unitforge-design-review/SKILL.md.
Review the current Unitforge product experience across the marketing landing page, public price sheet, and login screen.
Do not code yet.
Identify the top 3 design issues that most hurt perceived product quality or conversion, rank them by impact, and name the owning files.
Be commercially strict and visually specific.
```

## Working Rhythm

For important UI work:

1. Run a critique prompt first if the screen is weak.
2. Run an art-direction prompt to change the screen.
3. Run a motion prompt only after the layout is strong.
4. Finish with a design-review prompt to catch what still feels amateur.

## Automation

UI automation for this thread:

- Name: `Unitforge UI Sweep`
- Style: heartbeat
- Purpose: revisit key screens, identify the single highest-value UI issue, and either land a small safe polish fix or leave precise design direction.
