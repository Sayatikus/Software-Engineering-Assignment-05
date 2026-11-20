# Task #05 — Test matrix (expected vs observed)

These 14 executable tests are implemented in `practice11.test.mjs`. **Execution not yet verified in this workspace**: the environment cannot clone GitHub and the repository's npm dependencies are not available here. "Observed" therefore refers only to static code inspection, not a passing test run; run `npm test` locally or through CI to fill in real results.

| ID | Scenario | Expected | Observed execution |
|---|---|---|---|
| T01 | Available 11–12, booking ends at 11 | mock says Available | Not run |
| T02 | Overlaps booking 10–11 | Unavailable + overlap | Not run |
| T03 | Blocked room | Unavailable + blocked | Not run |
| T04 | End earlier than start | Safe fallback, result unchanged | Not run |
| T05 | Start in the past/equal now | Unavailable, does not override status | Not run |
| T06 | Empty room label | Fallback | Not run |
| T07 | Room label 81 characters | Fallback | Not run |
| T08 | Mock API throws | Fallback, status retained | Not run |
| T09 | Producer never settles / 5ms timeout | Fallback | Not run |
| T10 | Contradictory model claims Available | Rejected, fallback | Not run |
| T11 | Malformed generated response | Rejected, fallback | Not run |
| T12 | Explain request vs existing bookings | No mutation | Not run |
| T13 | P3 prompt protective rules | Guard text present | Not run |
| T14 | Mock schema | Explanation is short string | Not run |

Regression suite: existing booking tests (30/30 previously documented for Assignment #05, **not rerun here**). New suite count: 14. CI/build/lint/typecheck/browser screenshots require real runs and should not be claimed successful.
