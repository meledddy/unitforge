---
name: unitforge-pilot-release-readiness
description: Audit or harden Unitforge for a public pilot or production launch, including env variables, deployment assumptions, domain/HTTPS, onboarding, public QA, auth/session safety, security headers, rate limits, lead traceability, observability, and launch checklist documentation.
---

# Unitforge Pilot Release Readiness

## Overview

Use this skill when preparing Unitforge for real pilot users or reviewing whether the app is safe to share publicly. Separate audit-only work from implementation work.

## Audit Workflow

When asked to audit, do not implement fixes unless explicitly requested.

Review:

- Public Home and Pricing: desktop/mobile, light/dark, CTAs, navigation.
- Public Price Sheet flow: published visibility, readability, lead form validation, success/error states.
- Authenticated app flow: login, workspace context, list/create/edit/publish/unpublish, inquiry inbox, logout.
- Manual pilot onboarding: user, workspace, membership, login verification, workspace isolation.
- Production readiness: required env vars, build/start scripts, migrations, deployment assumptions, domains and public URLs.
- Security baseline: session cookies, protected routes, workspace scoping, input validation, rate limits, headers, secrets exposure, error leakage.
- Observability: logs, lead traceability, alerts, analytics/event gaps.

Report findings as:

- P0 blockers before public pilot
- P1 important fixes before client sharing
- P2 polish/improvements
- Already good enough
- Recommended next implementation phase

## Implementation Workflow

When asked to fix readiness gaps:

- Keep changes focused and production-safe.
- Prefer small reusable utilities over heavy dependencies.
- Keep local development working.
- Do not break auth, onboarding, price sheet logic, or public routes.
- Document limitations when using in-memory guards or env-gated scaffolds.
- Failure of notifications should not block lead creation.

## Validation

Use checks matching the touched area:

```powershell
pnpm typecheck
pnpm build
pnpm verify:auth
pnpm verify:price-sheets
pnpm verify:onboarding
```

For docs-only checklist work, no build is required; verify command names against `package.json`.

## Common Readiness Artifacts

- `docs/pilot-launch-checklist.md`
- `next.config.ts` security headers
- `.env.example` updates for pilot-only envs
- rate limit utility and focused auth/lead integration
- lead notification/traceability scaffold

