# Unitforge Production Readiness Interview

Use this protocol only for a final pilot or production go/no-go review, a resumed review, or a drift check against an existing release dossier.

The interview is a release gate, not a generic product-discovery exercise. Inspect the project first, ask only for facts or decisions that cannot be established from evidence, and never convert an unknown into a pass.

## 1. Establish the review

Determine from the request or, if missing, ask only whether the gate targets an assisted pilot or public production. Establish the intended environment, domain, deployment topology, and release window in later questions, one fact or decision at a time, when they affect the verdict.

Use a filesystem-safe release ID such as `2026-08-05-public-production`. Store private artifacts under:

```text
docs/private/release-readiness/<release-id>.md
docs/private/release-readiness/.<release-id>.state.json
```

The directory is intentionally private and gitignored. Never store secrets, credentials, connection strings, cookies, submitted PII, or complete environment values. Record only variable names and `present`, `missing`, or `not checked`.

Capture before analysis:

- current date and timezone;
- branch and `git rev-parse --short HEAD`;
- dirty paths from `git status --short`, without overwriting or cleaning them;
- target environment and domain, if known;
- whether this is a new, resumed, or drift review.

### Clean-tree hard gate

Run this exact check before treating the checkout as a release candidate:

```powershell
git status --porcelain=v1 --untracked-files=all
```

The output must be empty. Staged, unstaged, and untracked files all make the candidate non-reproducible. Ignored private readiness artifacts do not count because they are not part of the release candidate.

When the output is not empty:

- record the command and every dirty path as evidence;
- create a P0 finding named `Release candidate is not a clean committed Git state`;
- set and retain the verdict as `NO-GO` until a later check proves a clean tree;
- continue evidence gathering and the interview only when it remains useful for planning;
- do not issue `CONDITIONAL GO`, `GO`, or final sign-off.

Never clean, discard, stash, stage, commit, or push the user's changes automatically to satisfy this gate. Ask the user to reconcile them in a separate implementation or Git step. Re-run the exact check immediately before the final verdict because validation, dossier work, or concurrent work may have changed the tree.

If a matching state file exists, load it and continue from the first incomplete or invalidated coverage area. Do not restart a completed area without evidence that it changed.

## 2. Build evidence before asking questions

Read the sources that exist, including:

- `package.json`, `.env.example`, `.github/workflows/quality.yml`, and deployment configuration;
- `docs/private/pilot-launch-checklist.md` when present;
- `apps/web/next.config.ts`, `apps/web/middleware.ts`, public metadata routes, and legal pages;
- auth/session, workspace scoping, admin allowlist, rate-limit, notification, onboarding, billing, and database migration code;
- the auth, onboarding, Price Sheets, access-request, and sales-demo verification scripts.

Use parallel subagents when it materially shortens the review. Divide work without overlap: platform/recovery, security/data, and product/operations. The primary agent must reconcile their findings against the code before using them.

Classify every evidence item:

- `observed` — a current file or configuration with a precise path and line;
- `command` — a command, exit status, timestamp, and short result;
- `runtime` — a URL or provider check with timestamp and environment;
- `attested` — a named human statement with timestamp;
- `missing` — required evidence not found, including searches tried.

Inference may guide the next check but cannot close a gate. Test fixtures, mocks, screenshots, and local behavior never prove production runtime behavior by themselves.

## 3. Run validation safely

Run the safe local preflight on the release candidate when time and dependencies permit:

```powershell
pnpm audit --prod --audit-level=high
pnpm lint
pnpm typecheck
pnpm db:check:sales-demo
pnpm verify:access-requests
pnpm build
```

Record every command separately so one failure does not hide later results. Do not silently omit a failed or unavailable command.

### Format only the release diff

Do not use repository-wide `pnpm format` as a release gate while the repository has no clean Prettier baseline and CI does not enforce that command. It would mix old formatting debt with regressions introduced by the candidate.

Choose and record the comparison ref first: use the target branch for a pre-merge candidate, normally `origin/main`, or the last deployed commit/tag for a release already on the target branch. Do not guess when the intended release baseline is ambiguous.

Check only added, copied, modified, or renamed files from that baseline:

```powershell
$comparisonRef = "origin/main" # Replace with the recorded release baseline.
$formatFiles = @(git diff --name-only --diff-filter=ACMR "$comparisonRef...HEAD")

if ($formatFiles.Count -gt 0) {
  $prettierArgs = @("exec", "prettier", "--check", "--ignore-unknown", "--") + $formatFiles
  & pnpm @prettierArgs
}
```

Record the comparison ref and exact file set with the result. An empty set is `not applicable`, not an automatic pass. Never run Prettier with `--write` during an audit or interview.

Treat a release-diff format failure as P1 by default. Elevate it to a release-blocking validation failure only when the exact check is required by protected-branch CI or an explicit release policy. If a future repository-wide `pnpm format` baseline is green and the same check is enforced in CI, the full command may replace this scoped check.

The following checks may mutate database state:

```powershell
pnpm verify:auth
pnpm verify:onboarding
pnpm verify:price-sheets
```

Run them only after proving that `DATABASE_URL` points to disposable local or staging data. Inspect the host and database name without echoing the credential-bearing URL. If safety cannot be proven, skip them and record `missing` evidence; never guess.

Production checks are read-only by default. Do not migrate, seed, onboard, publish, unpublish, delete, or submit a real inquiry/access request without explicit authorization for that exact action. A browser smoke test may inspect public pages and authenticated state read-only; use `$unitforge-browser-design-qa` for the scoped browser workflow.

## 4. Maintain the coverage map

Track these eight areas as `pending`, `in progress`, `done`, or `blocked`:

1. Release target and infrastructure — provider, domain, TLS, canonical origin, topology, capacity assumptions.
2. Configuration and dependencies — required env variables, secret handling, supply-chain findings, build/start assumptions.
3. Data and recovery — migrations, snapshot, backup schedule, restore rehearsal, data integrity, rollback compatibility.
4. Security and privacy — auth/session, workspace isolation, admin access, public mutations, PII flow, retention/export/deletion.
5. Product operations — Price Sheets, inquiries, access requests, assisted onboarding, billing, entitlements, operator ownership.
6. Browser and experience quality — public/authenticated smoke tests, mobile, themes, accessibility, localization, intentional errors.
7. Observability and incident response — logs, alerts, uptime, database alerts, lead traceability, incident owner, escalation.
8. Legal, cutover, and sign-off — public identity, privacy/terms approval, release order, rollback trigger, owners, final approval.

Show a compact coverage tracker immediately before each interview question. Do not mark an area done while a required fact remains unknown.

## 5. Conduct the interview

Ask exactly one decision-bearing question per turn. A question must resolve one decision or one attestation; do not combine target, provider, topology, domain, owners, or dates into one prompt. Never ask for a fact already visible in code, docs, command output, or current browser state.

When a structured user-input tool is available, offer two or three meaningful choices. Otherwise ask one concise open question without a textual option menu. Explain the evidence or conflict that makes the question necessary.

Push back when an answer:

- contradicts current evidence or an earlier answer;
- relies on an untested deployment, backup, restore, or rollback assumption;
- assigns no owner to an operational obligation;
- treats a local check as proof of production behavior;
- accepts an unbounded risk or postpones it without a deadline and trigger.

After one or two focused challenges, record the user's decision and rationale. Security hard blockers remain blockers even when acknowledged.

Persist the private state after each answered question:

```json
{
  "releaseId": "string",
  "updatedAt": "ISO-8601 timestamp",
  "target": {
    "kind": "pilot | production",
    "environment": "string",
    "domain": "string or null"
  },
  "baseline": {
    "branch": "string",
    "commit": "string",
    "clean": true,
    "statusCapturedAt": "ISO-8601 timestamp",
    "dirtyPaths": ["string"]
  },
  "coverage": { "area": "pending | in progress | done | blocked" },
  "qaLog": [
    {
      "area": "string",
      "question": "string",
      "answer": "string",
      "answeredAt": "ISO-8601 timestamp"
    }
  ],
  "evidence": [
    {
      "id": "E1",
      "area": "string",
      "kind": "observed | command | runtime | attested | missing",
      "summary": "string",
      "source": "string",
      "capturedAt": "ISO-8601 timestamp"
    }
  ],
  "findings": [
    {
      "id": "F1",
      "severity": "P0 | P1 | P2",
      "status": "open | resolved | risk-accepted",
      "summary": "string",
      "evidenceIds": ["E1"]
    }
  ],
  "decisions": [
    {
      "id": "D1",
      "topic": "string",
      "decision": "string",
      "rationale": "string",
      "owner": "string",
      "date": "YYYY-MM-DD"
    }
  ],
  "redTeamStatus": "pending | complete",
  "verdict": "NO-GO | CONDITIONAL GO | GO"
}
```

Keep IDs stable when editing or resuming. Treat absent keys from older state files as empty rather than failing.

## 6. Apply hard blockers and severity

Use these severities:

- `P0` — launch must stop;
- `P1` — must be fixed or explicitly bounded before launch;
- `P2` — post-launch improvement with no immediate safety or operability threat.

Always create a P0 for any unresolved instance of:

- a staged, unstaged, or untracked file in the release candidate at baseline or final sign-off;
- auth bypass, tenant/workspace isolation failure, or unauthorized admin access;
- exposed plaintext secret or credential;
- sensitive data leakage, injection path, or unprotected public mutation endpoint;
- production migration without a verified target, current backup, and viable rollback/recovery path;
- destructive verification pointed at production;
- missing deletion/retention process for collected personal data;
- no responsible incident owner or no way to detect a critical outage/data failure;
- unresolved legal identity or privacy/terms placeholder on a public production launch;
- a required validation failure that affects the release path.

Process-local rate limiting is a P0 for a multi-instance deployment unless traffic is pinned safely to one instance or a shared limiter is in place. It may be a documented P1 constraint for a deliberately single-instance pilot.

Risk acceptance requires rationale, owner, expiry or review date, observable failure signal, and rollback/mitigation. A P0 remains blocking until resolved; recording acceptance does not lower its severity or change the verdict.

## 7. Run the red-team pass

For a final production review, run an independent red-team after the coverage map is complete and before the verdict. It is optional only for an explicitly early pilot review, and skipping it must be recorded.

Give the reviewing subagent the raw dossier/state, baseline, and repository access. Do not give it the desired verdict. Require it to attack:

1. partial failures and error recovery;
2. auth, authorization, privacy, and abuse paths;
3. migrations, consistency, backup, and restore;
4. capacity, topology, rate limits, and dependency failure;
5. monitoring, alerts, incident ownership, and diagnosis;
6. onboarding, billing, entitlements, and human operations;
7. cutover ordering, rollback triggers, and irreversibility;
8. one wildcard failure scenario.

Every surviving finding needs concrete evidence or a named missing check. Discard duplicates already resolved in the decision log. Present critical and major findings first, then resolve decision-bearing findings one question at a time.

## 8. Write the release dossier

Keep the dossier current throughout the interview and finish it with these exact headings:

```markdown
# Unitforge Release Readiness — <release ID>

## Verdict

## Scope and Baseline

## Coverage

## Automated Validation

## Runtime and Browser Evidence

## P0 Blockers

## P1 Required Before Launch

## P2 Follow-ups

## Already Good Enough

## Decisions Log

## Risk Acceptances

## Cutover and Rollback

## Final Sign-off
```

The Decisions Log table uses:

```markdown
| ID  | Topic | Decision | Rationale | Evidence | Owner | Date |
| --- | ----- | -------- | --------- | -------- | ----- | ---- |
```

For each validation command, record status, timestamp, commit, environment, and a concise result. For each finding, link evidence IDs and state what closes it. Do not include raw secrets or PII.

Assign the verdict mechanically:

- `NO-GO`: a dirty working tree; any other unresolved P0 (including one marked risk-accepted); a release-path validation failure; unknown production target; missing backup/recovery; incomplete mandatory red-team; or missing final owner/sign-off.
- `CONDITIONAL GO`: the final clean-tree check passed; no P0 remains; every remaining P1 is explicitly bounded with owner, deadline, signal, and rollback; all mandatory checks and red-team completed.
- `GO`: the final clean-tree check passed; no open P0 or P1; mandatory checks are current for the reviewed commit/environment; red-team is complete; cutover, rollback, and human sign-off are recorded.

Lead with the verdict and blockers. Never say "prod-ready" when the mechanical criteria produce another result.

## 9. Resume or verify a prior dossier

Start read-only. Load the dossier and state, compare the stored baseline with current `HEAD`, and include uncommitted paths. Use `git diff --name-only <baseline>..HEAD` when the baseline is reachable.

Re-run the clean-tree check before trusting the stored baseline. A dirty tree immediately reopens the release-target coverage area, creates or reopens the clean-state P0, and forces `NO-GO`. When a previously dirty tree becomes clean, capture the new committed `HEAD` and re-run every check whose evidence came from the earlier dirty state before resolving the P0.

Invalidate evidence when its source changed, its command was run on a different commit, the deployment changed after capture, the target environment changed, an acceptance expired, or a runtime assertion no longer has a current check. Re-scan unmapped changed files for release relevance.

Re-run safe affected checks and re-open only the impacted coverage areas. Keep still-valid answers and stable IDs. Report the drift before rewriting the dossier, then update the baseline and verdict only after reconciliation. Never edit application code in verify mode unless the user separately asks to fix a finding.
