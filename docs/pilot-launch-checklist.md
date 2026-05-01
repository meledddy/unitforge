# Unitforge Pilot Launch Checklist

Use this before sending a public pilot link to a real service-business user.

## 1. Required Environment Variables

- [ ] Set `NEXT_PUBLIC_APP_NAME=Unitforge`.
- [ ] Set `NEXT_PUBLIC_APP_URL=https://<production-domain>` and confirm it matches the deployed app URL exactly.
- [ ] Set `DATABASE_URL` to the production PostgreSQL database. Prefer an explicit SSL mode such as `sslmode=verify-full` when the provider supports it.
- [ ] Set `AUTH_BOOTSTRAP_PASSWORD` only if the seeded/mock verification path is used in that environment.
- [ ] Optional pilot lead alerts: set `PRICE_SHEET_LEAD_NOTIFICATION_WEBHOOK_URL`.
- [ ] Optional pilot lead alerts: set `PRICE_SHEET_LEAD_NOTIFICATION_WEBHOOK_SECRET` if the receiver supports bearer auth.
- [ ] Deferred billing variables can stay empty until Stripe billing is activated: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_STUDIO_MONTHLY_ID`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
- [ ] Optional analytics can stay empty until analytics is wired: `ANALYTICS_WRITE_KEY`.
- [ ] Confirm no secrets are exposed through `NEXT_PUBLIC_*` variables except values intentionally safe for the browser.

## 2. Domain And HTTPS

- [ ] Point the production domain to the deployed app.
- [ ] Confirm HTTPS is active before sharing any public link.
- [ ] Confirm `NEXT_PUBLIC_APP_URL` uses the final `https://` domain.
- [ ] Open `/` and `/pricing` on the production domain.
- [ ] Open one published public price sheet at `/price-sheets/<slug>`.
- [ ] Confirm any generated public price sheet links use the production domain, not localhost.

## 3. Database

- [ ] Run migrations against the production database:
  ```powershell
  pnpm db:migrate
  ```
- [ ] Confirm migrations target the intended `DATABASE_URL`.
- [ ] Take a provider-level backup/export before the pilot starts.
- [ ] Do not run destructive local reset/seed commands against production.
- [ ] If using mock bootstrap data locally, keep it out of the real pilot unless explicitly intended.

## 4. Manual Pilot Onboarding

- [ ] Create the first pilot owner/workspace:
  ```powershell
  pnpm onboard:pilot -- --workspace-name "Acme Studio" --email owner@example.com --password "StrongPass-1234" --name "Owner Name"
  ```
- [ ] Expected result: a user, workspace, and owner membership are created in one transaction.
- [ ] Verify onboarding mechanics when needed:
  ```powershell
  pnpm verify:onboarding
  ```
- [ ] Verify sign-in/session behavior:
  ```powershell
  pnpm verify:auth
  ```
- [ ] Log in as the onboarded account and confirm the workspace name appears in the app shell.

## 5. Final Browser QA

- [ ] Public Home: light theme desktop.
- [ ] Public Home: dark theme desktop.
- [ ] Public Home: light/dark mobile.
- [ ] Pricing: light theme desktop.
- [ ] Pricing: dark theme desktop.
- [ ] Pricing: light/dark mobile.
- [ ] Login page opens and returns to `/app` after successful login.
- [ ] Logout returns to `/login`.
- [ ] Price Sheets list loads for the workspace.
- [ ] Create a draft Price Sheet.
- [ ] Edit title, slug, items, locale, and inquiry settings.
- [ ] Publish and open the public page.
- [ ] Unpublish and confirm public visibility is removed.
- [ ] Submit a public lead and confirm success state.
- [ ] Submit invalid lead fields and confirm clear errors.
- [ ] Confirm the lead appears in the app lead inbox.
- [ ] Delete confirmation appears before deleting a Price Sheet.
- [ ] Cancel delete and confirm the sheet remains.
- [ ] Confirm delete and verify the sheet is removed from the list.

## 6. Security Checklist

- [ ] Rate limiting is present for login and public lead submission.
- [ ] Security headers are active from `apps/web/next.config.ts`.
- [ ] Confirm production responses include `Strict-Transport-Security`.
- [ ] Confirm auth cookies are secure in production.
- [ ] Confirm `/app` routes redirect unauthenticated visitors to `/login`.
- [ ] Confirm cross-workspace Price Sheet access returns not found/unavailable behavior.
- [ ] Confirm public lead logs do not print private lead contact details.
- [ ] Confirm `PRICE_SHEET_LEAD_NOTIFICATION_WEBHOOK_URL` payload contains operational metadata only.
- [ ] Confirm `.env` and provider secrets are not committed.

## 7. Known Deferred Items

- [ ] Full self-serve signup.
- [ ] Full Stripe billing and webhook production flow.
- [ ] Advanced observability, alert retries, and durable notification delivery.
- [ ] Analytics dashboard and event review loop.
- [ ] Full CSP rollout. Current baseline uses safer headers; strict CSP should start in report-only mode.
- [ ] Shared modal/dialog primitive beyond the current pilot-safe delete confirmation.
- [ ] Deeper authenticated app UI redesign beyond current pilot surfaces.

## 8. Final Command Pass

- [ ] Run typecheck:
  ```powershell
  pnpm typecheck
  ```
- [ ] Run production build:
  ```powershell
  pnpm build
  ```
- [ ] Run Price Sheets flow verification:
  ```powershell
  pnpm verify:price-sheets
  ```
