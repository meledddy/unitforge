# Unitforge Codex Kit

## Skills

Use these project-local skills with an explicit path when you want Codex to bias toward Unitforge's real workflows:

1. `$unitforge-auth-onboarding`
   Path: `.codex/skills/unitforge-auth-onboarding/SKILL.md`
2. `$unitforge-price-sheets`
   Path: `.codex/skills/unitforge-price-sheets/SKILL.md`

## Prompts

1. Fix auth regression

```text
Use $unitforge-auth-onboarding at .codex/skills/unitforge-auth-onboarding/SKILL.md. Investigate why the Unitforge login flow is failing after the latest changes. Start from apps/web/scripts/verify-auth.ts, identify the broken invariant, apply the smallest safe fix, and run the narrowest verification that proves the fix.
```

2. Harden pilot onboarding

```text
Use $unitforge-auth-onboarding at .codex/skills/unitforge-auth-onboarding/SKILL.md. Review the pilot onboarding flow across packages/db/src/onboarding.ts, packages/db/src/scripts/onboard-pilot-user.ts, and apps/web/scripts/verify-pilot-onboarding.ts. Find the highest-risk failure mode, fix it if needed, and explain the behavior change in terms of user creation, workspace creation, and owner membership.
```

3. Repair Price Sheets bug

```text
Use $unitforge-price-sheets at .codex/skills/unitforge-price-sheets/SKILL.md. Debug the current Price Sheets issue in Unitforge. Start from apps/web/scripts/verify-price-sheets.ts, trace the failing path through validation, services, and routes, land the smallest safe fix, and verify the affected flow.
```

4. Polish EN/RU public sheet UX

```text
Use $unitforge-price-sheets at .codex/skills/unitforge-price-sheets/SKILL.md. Improve the public price sheet experience for both en-US and ru-RU without changing the product scope. Focus on apps/web/app/(marketing)/price-sheets/[slug]/page.tsx and the public price sheet components, preserve publication and inquiry rules, and verify both default and ?lang=ru rendering paths.
```

5. Run a product health sweep

```text
Use both $unitforge-auth-onboarding at .codex/skills/unitforge-auth-onboarding/SKILL.md and $unitforge-price-sheets at .codex/skills/unitforge-price-sheets/SKILL.md. Inspect the Unitforge repo and choose the single highest-value next fix across auth, onboarding, and price sheets. Prefer targeted verification over blanket commands, make one well-scoped improvement, and summarize any remaining blockers with file references.
```
