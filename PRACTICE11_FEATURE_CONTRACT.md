# Practice work #11 — Explain availability

**Student:** Zhaulybek Sayat | **ID:** 24B031037 | **Group:** Friday 14:00–17:00

## User story
As a student, I want a short explanation of a room's availability so I can understand the booking result without changing it.

## Architecture and trust boundary
Student selects room + time -> UI validates HH:MM -> existing `checkAvailability` rule engine returns `{ available, reasons }` -> confirmed status rendered in ResultPanel.
Only when student presses **Explain availability (mock AI)** does the UI pass structured `{ roomLabel, start, end, result }` to the *mock* adapter -> validate input -> mock response -> strict response validation -> explanation shown under the confirmed booking status.
Timeout, thrown error, malformed response, invented claim -> safe fallback. No network request, API secret, database, login, real personal data or booking mutation.

**Booking source of truth:** `src/lib/checkAvailability.ts` remains unchanged; the explanation is a non-authoritative, labelled secondary output.

## Input/output contract
Input:
- `roomLabel`: non-empty plain-text name, maximum 80 characters (not a prompt/instruction)
- `start`, `end`: integer minutes, `0 <= start < end <= 1440`
- `result`: verified `CheckResult` with `available: boolean` and bounded `reasons: string[]`

Output: `{ explanation: string, source: 'mock' | 'fallback' }`; explanation maximum 240 characters, at most two sentences; mock output must equal the safe text derived from deterministic result. Unknown/untrusted output is discarded. No LLM has permission to edit the `available` flag.

Failure behavior: invalid input, timeout (500ms), thrown error, malformed or contradictory response -> labelled fallback. No change to room data or confirmed status. The mock intentionally simulates an LLM boundary without a paid API.

## Acceptance criteria
- **AC1:** Existing time, capacity/duration, blocked-room and overlap rules remain unchanged; touching endpoints continue to be permitted.
- **AC2:** Explanation agrees with the deterministic availability result and never invents booking details.
- **AC3:** Empty, malformed, inconsistent or overly long input and invalid generated output are rejected safely.
- **AC4:** Timeout, API failure or unavailable key results in safe, non-disruptive fallback; no browser secret is needed in mock mode.
- **AC5:** User can clearly distinguish labelled mock explanation from confirmed booking status.

## Implementation files
- `src/lib/explainAvailability.ts`: pure contract validation, mock producer, strict output checking, timeout/fallback.
- `src/components/ExplanationPanel.tsx`: optional button, labelled mock/fallback UI, cleanup against stale asynchronous output.
- `src/App.tsx`: mounts explanation below independently computed result, resets its component instance for every new check.
- `practice11.test.mjs`: 14 new unit scenarios, included in `npm test`.

## Baseline / checkpoint
`main` branch at initial Practice #11 checkpoint. Implementation is isolated on branch `practice-11`, so the Assignment #05 submission is not overwritten.

## Run
```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm run dev
```
The pre-existing 30-test suite is kept in the npm test command, together with 14 Practice #11 tests (nominal expected total: 44, **not a claim of 44 passing**).
