# Agent-readiness audit

Rubric from Lesson #10: Level 1 Baseline, Level 2 Documented, Level 3 Agent-ready.

| Check | Baseline | Final | Evidence / gap |
|---|---|---|---|
| Source layout | App and lib modules present | Same + `resultFreshness.ts` | file inventory and source |
| README setup | no useful project README in baseline export | complete README | `README.md` |
| Lockfile | package-lock.json present | kept | files, not independent supply-chain audit |
| Unit regression | 19/19 passed | 30/30 passed | `baseline_test.log`, `final_tests.log` |
| Typecheck | failed (missing React packages) | not run | `baseline_typecheck.log` |
| Lint/build | binaries unavailable | not run | `baseline_lint.log`, `baseline_build.log` |
| Root agent rules | absent | explicit AGENTS.md | `AGENTS.md` |
| Browser behavior | baseline stale result confirmed | final browser not run | `baseline_ui.log` and screenshots |
| CI/hook and dependency security scan | not established | not established | follow-up needed |

**Decision:** Level **2 — Documented**, with caveat. The instructions, structure, lockfile and passing Node tests are present, but this is not a Level 3 certified agent-ready repository. Final build, lint/typecheck, browser integration and security review still require a connected environment and human sign-off. It would be unjustified to claim Level 3.
