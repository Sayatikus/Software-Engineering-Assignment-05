# Pattern and release decisions

## Pattern decision (Task 03)
The source used separate booking/domain and presentation modules already. The immediate problem was an old result remaining on screen after inputs changed. Strategy would add an unnecessary family of interchangeable policies; Adapter is aimed at incompatible interfaces, which the project does not have. **Neither pattern is warranted** for one fixed booking policy.

One small focused extraction was accepted: the pure `isResultCurrent` check in `src/lib/resultFreshness.ts`. It is used directly in `src/App.tsx` and covered by 5 targeted tests. The second change strengthens current-time validation without new architecture.

Before: `App.tsx -> checkAvailability.ts`, form state and result display coupled, no snapshot freshness check.
After: `App.tsx -> resultFreshness.ts` for freshness, and `App.tsx -> checkAvailability.ts` for domain rules; old domain tests still pass.

## Release decision — CONDITIONAL
The two confirmed correctness bugs have targeted fixes and all 30 available Node tests passed. However, final build, lint, typecheck and full end-to-end UI checks were not verified because this environment did not complete dependency installation. The app is suitable for a reviewed coursework demonstration, not an unreviewed production release. Before GO: run `npm ci`, `npm run typecheck`, `npm run lint`, `npm run build`, and perform desktop/mobile UI regression checks on a properly provisioned machine. Owner: student/developer. Unused Supabase dependency and lack of automated browser tests remain additional follow-up risks.
