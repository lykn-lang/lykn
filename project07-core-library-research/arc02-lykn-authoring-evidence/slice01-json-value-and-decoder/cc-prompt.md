# AT-02 initial authoring assignment

Read this assignment completely and follow the repository's `AGENTS.md`.
The task below is the original AT-02. Produce one initial answer in a fresh
context. Keep the authoring answer and its runnable source before compiler
feedback. This assignment ends at the first capture; evaluation and any
revisions have their own preserved assignment.

## Fixed task

“Model decoded JSON values and expected decode failures with Lykn ADTs. Decode a config with an integer port from 0 through 65535 and an optional label. Distinguish a missing label, explicit null, and an empty string. Demonstrate rejection of a wrong nested value and state which checks are static, runtime, or absent.”

J-07 input anchor: `{}`, `{"x":null}`, `{"x":false}`, `{"x":0}`,
`{"x":""}`, and a runtime object with own `x=undefined`. The task
uses a domain configuration and label. Choose and state the sample config
shape. The planned L-01–04 evaluation follows the initial capture.

## Pinned condition and required text

- Source root `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`,
  `codex/completion-value-flow` at
  `685bbe1dbbfdaf34ecf49017c22e43f7dc8adb95`. Verify HEAD and clean state.
  Pinned native CLI is `target/release/lykn` in that root
  (SHA-256 `0cf695212c617b413f0d54fbfc1d0134da1361c33eba4bf627c13f9cb550e4a2`).
  Deno 2.9.6 aarch64 Darwin SHA-256
  `2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74`.
  Confirm identities with shell tools. Actual code execution follows capture.
- Load planning `AGENTS.md`, then the source `skills/lykn/SKILL.md` and
  `docs/guides/09-anti-patterns.md` first among the guides.
  Load `docs/guides/00-lykn-surface-forms.md` sections Syntax Fundamentals,
  Bindings & Mutation, Functions (`func` and `fn`), Types & Pattern Matching,
  and Objects & Immutable Updates. Load `docs/guides/05-type-discipline.md`
  ID-01–05, 19, 21, 26–30, and `docs/guides/06-functions-closures.md`
  ID-01, 02, 11–13, 20–24 and 28–29. Use bounded reads and recover truncation.
  The skill's directly applicable topic sections may be consulted for extra
  syntax. Record any extra source guides consulted.
- Load both exact captured book chapters in
  `artifacts/at02/references/` under this slice, from `main` of
  `/Users/oubiwann/lab/cnbb/lykn` at
  `f55da0e86068ce1aa27581fe1199b68258e64f3f`.
  Original locators are `src/part2/chapter10/2-type.md` and
  `src/part2/chapter10/3-match.md`. The snapshots are immutable.
- No preflight probe, evaluated solution, other repository examples, prior
  conversation, memory or web search in the initial authoring condition.
  If governing instructions inject anything additional, record it. The
  governing source-only/no-new-dependencies policy takes precedence over
  conflicting older tool guidance. Note any conflict encountered.

Research tooling must be Lykn. Use shell only for direct command invocations,
Git and simple file lifecycle. No Python execution or parity exception is
authorized. No Python, Ruby, Fennel, handwritten JS/Node or substitute
research logic. No new Node/npm dependency, no network, no generated output
repair, no source repository edits, no public API or publication decision.

## Evidence and finish

Use the planning worktree `/Users/oubiwann/lab/lykn/lang/.worktrees/planning`.
Write only inside this slice's `artifacts/at02/initial/`. During intake record
`references.md` with required and extra references separately, exact revision
and file, read time, extents and actual use, including unavailable and unread
entries. Include tool calls, material instruction/assumption readback and
available model/effort identification. Write the full initial user-facing
answer to `response.md` and its exact runnable source to `decoder.lykn`
(additional .lykn files only if the answer actually needs them). Preserve
claims as authored. Capture the first coherent answer once, with no run,
formatter feedback or reviewer hint beforehand. Record any pre-capture
mistake or deviation without retrospective correction.

Commit the named initial files only with `git commit --only` and both
contiguous co-author trailers from AGENTS.md. Return the commit and paths.
All JV rows stay open at this checkpoint.
