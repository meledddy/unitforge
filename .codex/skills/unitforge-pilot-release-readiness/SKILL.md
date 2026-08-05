---
name: unitforge-pilot-release-readiness
description: Audit, harden, or run an evidence-based final production-readiness interview for Unitforge. Use for pilot or production launch reviews, go/no-go decisions, release dossiers, resuming a readiness interview, or checking whether a prior readiness decision drifted after code or deployment changes. Covers environment and deployment assumptions, domain/HTTPS, database recovery, onboarding, public QA, auth/session and tenant isolation, privacy, rate limits, lead traceability, observability, legal operations, cutover, and rollback.
---

# Unitforge Pilot Release Readiness

## Overview

Use this skill when preparing Unitforge for real pilot users or reviewing whether the app is safe to share publicly. Separate audit-only work, implementation work, and the interactive release gate.

## Select the mode

- For an audit or status report, follow **Audit Workflow**. Stay read-only.
- For requested readiness fixes, follow **Implementation Workflow**.
- For a final production interview, go/no-go review, release dossier, resumed interview, or drift check, read `references/PRODUCTION_INTERVIEW.md` completely before taking further task action and follow it as the controlling protocol.

Do not treat an interview verdict as a substitute for CI, browser QA, provider backups, or runtime monitoring. A claim is ready only when it has current evidence or an explicit, bounded human attestation.

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

Prefer evidence from the current checkout. Cite `file:line`, a command and result, or a runtime URL/status for every material finding. Label user statements as attestations rather than observed evidence.

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
- Preserve existing user changes and keep production-mutating operations out of readiness automation.
- Re-run only the validation needed for the touched area, then update the readiness finding with fresh evidence.

## Validation

Use checks matching the touched area:

```powershell
pnpm typecheck
pnpm build
pnpm verify:auth
pnpm verify:price-sheets
pnpm verify:onboarding
```

`verify:auth`, `verify:onboarding`, and `verify:price-sheets` may mutate database state. Run them only after proving that `DATABASE_URL` targets disposable local or staging data. Never print credentials while checking the target.

For docs-only checklist work, no build is required; verify command names against `package.json`.

## Common Readiness Artifacts

- `docs/private/pilot-launch-checklist.md`
- `apps/web/next.config.ts` security headers
- `.env.example` updates for pilot-only envs
- rate limit utility and focused auth/lead integration
- lead notification/traceability scaffold
