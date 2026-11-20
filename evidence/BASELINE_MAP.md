# Baseline and reproducibility record

Source baseline: real Smart Campus export from the user's earlier Practice #08 archive, copied before changing files. No commit hash is claimed; a `baseline_snapshot/` directory preserves the source.

Entry points: `index.html`, `src/main.tsx`, `src/App.tsx`.
Domain: `src/lib/checkAvailability.ts` (pure function), `src/lib/types.ts` (types), `src/lib/data.ts` (fictional rooms), `src/lib/time.ts` (time parsing).
Tests: `booking.test.mjs`, `booking.first.test.mjs`.
Tooling: Vite/React, TypeScript, ESLint, Tailwind; `package-lock.json` included.

Baseline commands (from actual logs):

```
npm test                  -> PASS 19/19
npm run typecheck         -> FAIL: missing React and JSX dependencies in this environment
npm run lint              -> FAIL: eslint executable not found
npm run build             -> FAIL: vite executable not found
npm ci --ignore-scripts --no-audit --no-fund -> TIMEOUT during package retrieval; installation unverified
```

Three concrete baseline weaknesses:

1. `src/App.tsx`: form fields changed without invalidating `resultView`; observed stale Available after editing start time in browser.
2. `src/lib/checkAvailability.ts`: did not validate `now`, and `App.tsx` defaulted malformed current-time input to 10:00; baseline NaN regression failed.
3. Baseline root lacked `AGENTS.md`; agent permission boundaries and review requirements were not written down.

Other findings: `@supabase/supabase-js` listed in `package.json` even though no source import was found; automated browser test command not present.

The npm installation failure is environmental evidence, not proof that the repository fails to build on a normally configured computer.
