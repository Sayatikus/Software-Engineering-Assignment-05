# Tasks #06–#07 — Read-only agentic review and verification

Scope: diff on `practice-11` relative to `main`, `AGENTS.md`, `PRACTICE11_FEATURE_CONTRACT.md`, existing booking rules, test cases. No external production services. Review by source inspection; test execution not available. Human approval is required before merge.

| Finding | Category / severity | Evidence | Verification / disposition |
|---|---|---|---|
| F1 **Confirmed**: an explanation from an earlier check could be displayed after a later check if requests share a panel instance | Correctness, medium | UI adds asynchronous producer; without lifecycle isolation it may return out of order | Mitigated: `src/App.tsx` increments `checkNumber` for each check and uses it as the panel key; `ExplanationPanel` effect cleanup ignores stale resolutions. Code reviewed; browser test still needed. |
| F2 **Confirmed**: accepting arbitrary provider prose can contradict booking status or invent booking data | Security/quality, high | Provider output is untrusted; it could say Available when `result.available=false` | Mitigated: `validateExplainOutput` enforces schema, 240-char bound and exact agreement with `expectedExplanation`. Negative tests T10/T11 authored. Execution pending. |
| F3 **Confirmed**: multiple booking rejection causes are collapsed to only the first recognized reason in the short mock output | UX/accuracy, low | `reasonCode` prioritizes one of invalid/past/duration/blocked/overlap | Unresolved limitation: core UI continues listing *all* deterministic reasons; mock explanation is short by design. Improve wording or show "one reason" if needed. |
| F4 **Plausible / unverified**: a real remote LLM service could require a server-side proxy and additional abuse controls | Security, high if real API introduced | No remote integration exists; all calls currently mock and local | No real key or network exposure here. Must reassess before introducing an actual API. |
| F5 **Unsupported**: the adapter writes bookings or sends personal student data to a third party | Data integrity/privacy, high if true | No write path or network request in `explainAvailability.ts`; input uses only fictional label and checker data | Rejected as unsupported for this mock implementation. |

## Top-two repair decisions
1. **F1:** isolate each checked result's explanation lifecycle, with a unique React component key and cleanup guard. Critical because delayed explanations must not attach to a different booking request.
2. **F2:** validate output against the immutable checker verdict. Critical because the mock explanation is non-authoritative and cannot change factual status.

## Regression
Preserved: `src/lib/checkAvailability.ts` has **no changes** on this branch. Old booking tests remain in `npm test`. Tests for stale UI responses require manual UI / browser inspection in addition to unit checks.

## Demonstration readiness
**CONDITIONAL.** Mock functionality and tests are committed to a separate branch; CI, TypeScript, lint, build and browser checks have not been independently executed here. Do not merge without human verification. This is an academic mock, not a real external LLM.
