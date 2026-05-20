---
name: unitforge-repo-handoff
description: Clean up Unitforge workspace state before handoff, including git status review, temporary QA file cleanup, local process shutdown, validation recap, commit/push preparation, and concise handoff summaries. Use when the user asks to clean the tree, stop processes, inspect commits, prepare a commit, or make the repo tidy.
---

# Unitforge Repo Handoff

## Overview

Use this skill for operational cleanup and handoff. The goal is a readable working tree, no stray temporary artifacts, no unnecessary background processes, and a clear summary of what is ready.

## Safety Rules

- Do not commit automatically unless the user explicitly asks.
- Do not push automatically unless the user explicitly asks.
- Do not delete project files unless they are clearly temporary artifacts or the user explicitly approves.
- Never revert user changes unless explicitly requested.
- Before any recursive delete, confirm the resolved path is inside the Unitforge workspace or a clearly named temporary QA path.

## Cleanup Workflow

1. Check repository state:

```powershell
git status --short --branch
git diff --stat
```

2. Identify temporary artifacts:

- browser QA profiles
- local test output folders
- ignored log/tmp files
- stale screenshots only if they are generated artifacts inside the repo

3. Check local processes when relevant:

- running dev server
- Node/Next processes on known ports
- background browser capture helpers

4. Stop only processes that belong to the current Unitforge work.

5. Re-check status and summarize remaining tracked/untracked changes.

## Commit Workflow

When the user approves commit/push:

1. Re-run the relevant validation commands for the changed area.
2. Stage only intended files.
3. Use a specific commit message describing the phase.
4. Push the current branch only after commit succeeds and the user asked for push.
5. Report commit hash, branch, and any residual working tree state.

## Summary Format

Keep handoff summaries short and concrete:

- files changed
- validation run
- processes stopped or left running
- temp files removed
- commit/push status
- remaining concerns

