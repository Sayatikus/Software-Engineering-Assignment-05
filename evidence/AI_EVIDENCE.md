# AI assistance record — Assignment #05

Tool/model: ChatGPT, GPT-6 (20 November 2026). This is a transparent summary of analysis and work during this conversation, not a claim that a separately installed skill or background agent ran.

## Review prompt (read-only phase)
"Review the inherited Smart Campus React/TypeScript repository against its acceptance criteria. Identify correctness, maintainability, dependency and agent-operation risks. Use exact files and tests. Do not assume a claim is verified or invent test results."

Assistant output considered:
- `src/App.tsx` kept `resultView` visible when start/end/current time changed, possibly showing stale Available.
- `src/lib/checkAvailability.ts` did not validate `now`, so NaN could bypass the `start <= now` rejection.
- `package.json` lists `@supabase/supabase-js`, while no source imports use it.
- Baseline lacked root `AGENTS.md` and did not have an automated UI browser test script.

Independent checks recorded:
- Browser baseline screenshot and console log (`baseline_ui.log`) showed Available persisted after editing start time.
- Node targeted test (`baseline_invalid_now_FAIL.log`) produced `true !== false` for NaN current time.
- Package metadata, source search and file listing are evidence for the other structural observations.

## Focused implementation request
"Only fix the two reproduced correctness risks. Prevent stale results and reject invalid current-time values. Preserve the existing booking/overlap contract and avoid unrelated features. Add deterministic regression tests."

Assistant proposal and implementation:
- Introduce `isResultCurrent` in `src/lib/resultFreshness.ts` and invalidate a displayed result after room/time edits.
- Validate integer current-time values in `checkAvailability` and reject malformed input in `App.tsx` rather than falling back to 10:00.
- Add `assignment05.test.mjs` with 11 focused checks and run the old 19-test suite unchanged.

Verification:
- `npm test`: baseline 19/19 pass and final 30/30 pass; captured in logs.
- `assignment05.test.mjs`: 11/11 pass.
- Browser final build was not verified because dependencies could not be installed in this execution environment. Do not claim the final UI screenshot exists.

## Suggestion rejected/modified
A generic Strategy or Adapter abstraction was considered for booking policy. Rejected: this app has one fixed overlap rule and one policy. An abstraction layer would create unnecessary code and more places to maintain. The accepted smaller extraction was the pure `resultFreshness.ts` helper.

## Human-approval boundary
The assistant performed the code edits and available local tests. The student must still review the diff and run the remaining UI/build checks on their machine before approving a public release. No autonomous background job was run.
