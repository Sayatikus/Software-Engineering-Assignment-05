# Software Engineering — Assignment #05

Zhaulybek Sayat · 24B031037 · Friday 14:00–17:00

This assignment reviews and improves a small fictional Smart Campus Room Availability Checker. It preserves the baseline, documents agent safety rules, investigates seven risk candidates, addresses two confirmed risks and includes automated test evidence.

**Verification:** the submitted final Node test suite reports 30/30 passing. Full dependency installation, lint/typecheck/build and a final browser test were not independently verified, so release status is **CONDITIONAL**.

## Source and evidence

The source is a React/TypeScript Vite project. See `AGENTS.md` for operating rules, `ACCEPTANCE_CRITERIA.md` for the five preserved behaviors, and `evidence/` for the audit, logs and decisions. The original complete source bundle and PDF report are separately available in the ChatGPT assignment conversation. Do not treat this repo as source-complete until the app and test files are uploaded.

## Run after source upload

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm run dev
```

No real personal data, credentials or production API integrations are part of this coursework.
