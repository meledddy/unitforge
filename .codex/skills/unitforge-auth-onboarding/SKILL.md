---
name: unitforge-auth-onboarding
description: Investigate or modify Unitforge sign-in, auth session, mock bootstrap session, and pilot onboarding flows in the pnpm monorepo. Use when work touches `/login`, `apps/web/src/server/auth/*`, `apps/web/scripts/verify-auth.ts`, `apps/web/scripts/verify-pilot-onboarding.ts`, `packages/db/src/onboarding.ts`, or `packages/db/src/scripts/onboard-pilot-user.ts`.
---

# Unitforge Auth Onboarding

## Overview

Use this skill for auth and onboarding work that must stay aligned with Unitforge's seeded workspace model.
Start from the existing service and verification scripts instead of inventing a parallel flow.

## Scope Split

Map the request to one primary slice before editing:

- Sign-in UI and form state:
  `apps/web/app/(auth)/login/page.tsx`
  `apps/web/src/features/auth/lamp-login-shell.tsx`
  `apps/web/src/features/auth/sign-in-form.tsx`
- Session and auth service:
  `apps/web/src/server/auth/service.ts`
  `apps/web/src/server/auth/actions.ts`
  `apps/web/src/server/auth/repository.ts`
  `apps/web/src/server/auth/session.ts`
- Current app shell context:
  `apps/web/src/server/current-session.ts`
  `apps/web/scripts/bootstrap-session.ts`
  `packages/core/src/mock-session.ts`
- Pilot onboarding:
  `packages/db/src/onboarding.ts`
  `packages/db/src/scripts/onboard-pilot-user.ts`

## Working Rules

Preserve these invariants unless the task explicitly changes product behavior:

- `authenticateUserByPassword` only succeeds when the user exists, the password matches, and the user has a default workspace membership.
- Session storage is token-hash based. Create and invalidate sessions through the helpers in `apps/web/src/server/auth/session.ts` and `service.ts`; do not compare or persist raw token state elsewhere.
- `getAppShellSessionForSessionToken` and `getBootstrapAppShellSession` must continue returning the app-shell shape with `currentUser`, `currentWorkspace`, `membership`, and optional `subscription`.
- Bootstrap helpers assume the seeded identity from `packages/core/src/mock-session.ts`.
- Pilot onboarding only creates brand-new users, enforces a minimum password length of 12, generates a unique workspace slug, and creates an owner membership inside one transaction.

## Verification Path

Use the lightest relevant verification first, then widen only if the change crosses boundaries.

Static checks:

```powershell
pnpm typecheck
pnpm --filter @unitforge/web typecheck
```

Flow checks:

```powershell
pnpm verify:auth
pnpm verify:onboarding
```

Environment gates:

- `pnpm verify:auth` requires `DATABASE_URL` and `AUTH_BOOTSTRAP_PASSWORD`.
- `pnpm verify:onboarding` requires `DATABASE_URL`.

Manual onboarding path:

```powershell
pnpm onboard:pilot -- --workspace-name "Acme Studio" --email owner@example.com --password "StrongPass-1234" --name "Owner Name"
```

## Common Failure Modes

- Changing the login UI without updating the server action or auth error mapping.
- Returning a session shape that no longer matches the app shell consumer.
- Breaking the seeded bootstrap path by changing `mockSessionUser` or `mockSessionWorkspace` assumptions without updating the fixtures that depend on them.
- Letting onboarding create duplicate users instead of failing fast.
- Bypassing repository/service helpers and duplicating token or membership logic in pages or forms.

## Response Pattern

When asked to fix something in this area:

1. Identify which of the four slices above owns the behavior.
2. Read the verification script first if one exists for that flow.
3. Patch the smallest layer that fixes the issue.
4. Run targeted verification before broader repo checks.
