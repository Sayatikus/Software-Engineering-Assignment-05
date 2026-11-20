# Two confirmed-risk mitigation records

## M1 — Stale result after editing booking details
- Initial evidence: baseline `src/App.tsx` set start/end/now values without clearing `resultView`. Compiled-baseline browser check logged `Available` before and still after changing start time (see `baseline_ui.log` and screenshots).
- Cause: the result was calculated for previous form inputs but displayed without comparing its snapshot to the active inputs.
- Approved minimal change: clear `resultView` when start/end/now changes and guard rendering using the tiny `isResultCurrent` helper.
- Verification: targeted A5-07..A5-11 tests pass in `targeted_tests.log`. Baseline browser demonstrated failure. Final browser build/UI check still pending.
- Residual risk: medium, because actual final browser integration could not be run with dependencies unavailable.

## M2 — Invalid simulated current time could be accepted
- Initial evidence: baseline test with `now=NaN`, `start=660`, `end=720`, empty bookings failed: expected Unavailable, actual Available. See `baseline_invalid_now_FAIL.log`.
- Cause: `start <= NaN` is false; no explicit validation for `now`, and the UI silently used 10:00 when parsing failed.
- Approved minimal change: reject non-integer/out-of-range `now` in `checkAvailability`; reject malformed current-time input in UI rather than substituting a default.
- Verification: targeted A5-01..A5-06 pass, and the original AC1–AC5 suite stays green; see `final_tests.log` (30/30).
- Residual risk: low in the pure function; a final UI run is still needed.
