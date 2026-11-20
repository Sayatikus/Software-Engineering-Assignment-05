# Background coding agent — hypothetical safety plan

Task (hypothetical only): verify that booking result is cleared on all four form edits and propose one missing UI regression test.

Isolation: create branch `audit/ui-regression` from the reviewed main commit, or a separate worktree. No shared ports, no credentials and no production services. Constrain scope to `src/App.tsx`, `src/lib/resultFreshness.ts`, `assignment05.test.mjs`, and evidence notes.

Permitted commands: `git status`, `git diff`, `npm test`; if dependencies are already installed and user approved, `npm run typecheck`, `npm run lint`, `npm run build`. Budget: 20 minutes of agent time, then stop and report. This is a proposed limit, NOT a task scheduled in this chat.

Forbidden: force push, destructive commands, package upgrades, reading `.env`, external APIs, deployment and automatic merge.

Required artifacts: change summary; unified diff; actual test and build output (or honest not-run reasons); updated risk notes; rollback instructions.

Review gate: human checks diff, test evidence, scope and affected UI before merging. If checks fail, leave the branch unmerged; roll back by discarding the isolated worktree or reverting the review commit. Any release requires separate human approval.
