# Agent Instructions — Smart Campus Room Availability Checker

## Project purpose and scope
This is a one-page fictional room availability checker for coursework. It does not book real rooms, store real personal data, connect to a database, or use credentials. It takes simulated current time, a selected room, and a requested interval, then reports Available/Unavailable.

## Repository map
- `src/App.tsx`: React UI, form controls, room selection, feedback and display.
- `src/lib/checkAvailability.ts`: pure booking/overlap validation; never mutates bookings.
- `src/lib/resultFreshness.ts`: compares the input snapshot against a displayed result.
- `src/lib/time.ts`: converts clock text to minutes and back.
- `src/lib/data.ts`, `src/lib/types.ts`: fictional data and TypeScript contracts.
- `booking.test.mjs`, `assignment05.test.mjs`: executable regression tests.
- `baseline_snapshot/`: source preserved before Assignment #05 changes.
- `evidence/`: actual commands, output, risk assessment and diff.

## Setup and safe commands
Use Node.js 22 or newer. From repository root:
1. `npm ci` (only if dependency installation is approved).
2. `npm test` (first, fast regression suite).
3. `npm run typecheck`, `npm run lint`, `npm run build` (after installing dependencies).
4. `npm run dev` for a local UI check.

If commands cannot run, say so and preserve the real stderr/stdout. Do not invent passing checks. Use existing dependencies before suggesting additions.

## Coding and test rules
- Preserve 0 <= start < end <= 1440, integer minutes, start > a valid supplied current time, and a maximum of 120 minutes.
- Blocked rooms are never available. Overlap uses strict `<` comparisons so touching endpoints are allowed.
- Never mutate the input room or existing bookings. The UI must never display a result from changed inputs as if it were current.
- Add small deterministic tests for any behavior change and keep UI feedback understandable on narrow screens.
- Favor pure functions and existing module boundaries; do not add a design pattern without a demonstrated need.
- Keep fixes focused and review the diff before accepting an AI suggestion.

## Permissions / prohibited operations
- Do not access, create, display or upload secrets, private student details, `.env` contents, or tokens.
- Do not run destructive shell commands, delete history, force-push, write to unrelated repositories, or deploy to production.
- Do not add a database, login, payments, remote APIs, analytics, or tracking.
- No dependency upgrades, package installations, external network calls, or changes to GitHub without explicit human approval.
- A background agent must work on a separate branch/worktree and cannot merge or deploy itself.
- Require human review of changed files, test logs, scope and risk notes before merge.

## Evidence and escalation
Provide a change summary, file diff, exact test/build commands with results, new limitations and a suggested rollback. Escalate an unverified critical finding instead of asserting it is resolved.
