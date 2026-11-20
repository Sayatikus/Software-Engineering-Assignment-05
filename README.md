# Smart Campus Room Availability Checker — Assignment #05

**Student:** Zhaulybek Sayat  
**ID:** 24B031037  
**Group:** Friday 14:00–17:00  
**Course:** Software Engineering

Small fictional React + TypeScript availability checker reused from the Practice #08 project. Assignment #05 focuses on repository instructions, reproducible evidence, risk review and two minimal verified fixes. No login, database, live API or real personal information is used.

## Requirements

Node.js 22+ and npm. A normal network connection may be needed for the first `npm ci`.

## Run and verify

```bash
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm run dev
```

Open the local Vite URL printed by `npm run dev`. Build/type/lint commands were attempted in the submitted execution environment, but dependencies could not be installed because `npm ci` did not finish. See `evidence/` for actual logs. Do **not** treat those commands as passing. The Node built-in test suite runs without external packages on Node 22+.

## Repository map

- `src/App.tsx`: UI / form / result display.
- `src/lib/checkAvailability.ts`: availability rules.
- `src/lib/resultFreshness.ts`: pure comparison of checked vs current form inputs.
- `src/lib/time.ts`: clock conversion.
- `src/lib/data.ts`: fictional room catalog.
- `booking.test.mjs`: 19 original regression tests.
- `assignment05.test.mjs`: 11 targeted checks for the two fixes.
- `baseline_snapshot/`: copy of original source before this assignment (not a deployed version).
- `AGENTS.md`: safe commands, boundaries, review gates.
- `ACCEPTANCE_CRITERIA.md`: five preserved acceptance criteria.
- `evidence/`: logs, before/after results, candidate findings and diff.

## Actual tests in this environment

| Check | Baseline | Final |
|---|---|---|
| `npm test` | 19/19 passed | 30/30 passed |
| Invalid current-time regression | fails as expected | passes (included in final suite) |
| Browser baseline: result after time edit | stale Available visible (observed) | final browser run not verified here |
| `npm ci` | timed out (cannot confirm install) | not run |
| `npm run typecheck` | failed: missing React type dependencies | not verified |
| `npm run lint` / `npm run build` | failed: local binaries unavailable | not verified |

These results document the available environment, not a general claim that the app cannot build on a normally configured computer.

## Changes made

1. Explicitly reject invalid simulated current time in `checkAvailability` and prevent the UI from silently substituting a default after malformed input.
2. Clear and guard stale availability results when input fields change. The small `resultFreshness.ts` helper gives this rule a focused regression test.

No extra pattern (Strategy/Adapter) was introduced: a single booking policy and pure helper are simpler and more appropriate than an extensible hierarchy.

## Report

The PDF report provides the risk register, readiness audit, evidence, two mitigation records, release decision, background-agent safety exercise and 200–300 word AI reflection.

## Handover and safety

AI suggestions are review aids, not proof. Review diffs and run full checks locally before merging/deploying. The release recommendation is **CONDITIONAL** because final UI/build verification could not be completed in the environment used for this report.
