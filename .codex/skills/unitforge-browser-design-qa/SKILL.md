---
name: unitforge-browser-design-qa
description: Run fast, scoped in-app browser QA for Unitforge UI changes. Use when checking localhost public pages, Price Sheets, marketing surfaces, light/dark or responsive behavior, visual regressions, clipping, contrast, and form states without expensive setup.
---

# Unitforge Browser Design QA

Use this skill only when browser verification is useful for the current UI change. Keep it fast, scoped, and evidence-driven.

## Core Rules

- Reuse an already-running local server whenever possible.
- Do not run `pnpm build`, `pnpm typecheck`, database seeds, installs, or full verification scripts from this skill.
- Do not create persistent browser profiles, QA folders, logs, traces, or screenshots unless the user asks or a visual finding needs evidence.
- Check only the pages, themes, and breakpoints affected by the task.
- Prefer the current in-app browser tab and `http://127.0.0.1:3000`.
- If a page is already open at the target URL, inspect it before restarting or navigating away.

## Fast Server Protocol

1. Probe the existing dev server first:

   ```powershell
   try { (Invoke-WebRequest -UseBasicParsing -Uri "http://127.0.0.1:3000" -TimeoutSec 2).StatusCode } catch { "offline" }
   ```

2. If it returns a status code, use `http://127.0.0.1:3000` immediately.

3. If offline, start the web dev server once from the repo root:

   ```powershell
   Start-Process -WindowStyle Hidden -FilePath "C:\nvm4w\nodejs\pnpm.cmd" -ArgumentList "dev" -WorkingDirectory "C:\Users\ASUS\Desktop\Files\Git\Unitforge"
   ```

4. Poll `http://127.0.0.1:3000` for up to 20 seconds. Stop polling as soon as the page responds.

5. If port 3000 is occupied by a non-Unitforge page or Next starts on another port, report the actual URL and continue there only if it is clearly the Unitforge app.

Do not kill existing processes unless the user explicitly asks for cleanup or the process is clearly a stale Unitforge dev server you started.

## Browser Workflow

- Open only the requested path or the smallest set of affected paths.
- Use desktop first. Check mobile only when the change affects layout, header controls, forms, cards, or the user requested mobile.
- Toggle light/dark only when the changed surface is theme-aware.
- For public Price Sheets, check the exact slug/theme/language relevant to the task; do not sweep every sample sheet unless requested.
- For forms, test the visible states needed by the task: collapsed/expanded, validation, success only when practical.
- Watch for visible Next.js overlays and obvious console errors, but do not dump console output unless it explains a failure.

## Visual Checks

Verify only what is relevant:

- clipping, cropping, overflow, or horizontal scroll
- unreadable contrast in light or dark
- header/control overlap
- logo/brand rendering
- form affordance, field size, validation highlight, and localized copy
- layout shift after theme switch, expand/collapse, reload, or form state changes
- excessive animation, bounce, heavy glow, or CPU-heavy motion

## Output

Keep the result short:

1. Blocking visual issues, or `No blocking visual issues found.`
2. Pages, themes, and widths checked.
3. Browser limitations, if any.

Include screenshots only when they materially help the user evaluate a finding.
