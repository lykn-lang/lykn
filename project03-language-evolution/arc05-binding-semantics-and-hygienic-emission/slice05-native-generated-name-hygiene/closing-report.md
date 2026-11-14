# S05 CC initial candidate preservation report (partial)

**Status: proposed source candidate only; not done, not accepted.** This bounded
report preserves an initial seven-path candidate at the root-authorized request
before the identified dotted-atom correction. All eight NH criteria remain open.
No final gates, fresh M6 success, independent acceptance, or project close is
claimed.

## Pins and source state

- Opening task source: branch `codex/qualified-adt-core`, commit
  `c0ed454610f3a384196e4fa003335373819fb2fd`, tree
  `7d8b3359fa570b2e8322996dbe8b648f02af58da`.
- Preserved initial candidate: commit
  `fa6562a1`; tree `71c65689be1c8e3dbc2638aa5a7d60cee89944a0`; parent is the
  opening pin above. The raw commit object contains the required title and
  adjacent coauthor trailers. Its exact seven-path delta is the named source
  recipe in the prompt.
- After commit, `git status --short` was empty. A filtered process check found
  no active `make check`, Cargo test/Clippy, or Deno test process. Source/build
  ownership returns to root for the numbered correction 01. No S06, merge,
  push, or release operation occurred.
- The implementation includes the initial borrowed full-unit/single-form
  occupancy pass, early allocator coordination, multi-clause/rest fixes, and
  native/CLI product tests. Later review established that this initial design
  does not yet account for the lexical root of dotted emitted atoms.

## Executed evidence and retained attempts

- Focused initial targets passed in attempt10: native 4/4 and CLI 2/2. Full
  `--nocapture` generated sources, JS, runtime commands/status/stdout/stderr
  are retained in `artifacts/cc/attempt10-focused-native.log` and
  `attempt10-focused-cli.log`. Attempt10 contains the nested-default normalized
  leaf, adjacent generated suffixes, colon-root await, checked/stripped
  producer consumers, fragment lifecycle, JSON consumer, and package checks.
- Attempt07 `make check` exited 2 at Clippy for imports after a test module;
  its summary is `artifacts/cc/attempt07-make-check.txt`. The immediate retry's
  nested session identifier was lost by the orchestration wrapper, so its
  result could not initially be recovered. A later filtered process query
  found no active matching process. The reliable captured attempt08 command
  exited 2 at Clippy for a needless borrow, with full output in
  `artifacts/cc/attempt08-make-check.log` and summary in
  `attempt08-make-check.txt`. Both lint findings were corrected before the
  focused attempt10 run. No later full `make check` was run.
- Attempt11 adds a bounded dotted-root product oracle and records a real failure:
  source `(some-> (await (Promise:resolve await__gensym0.child)) (+ 1)
  (console:log))`, with caller setup `globalThis.await__gensym0 = {child: 7};`.
  The emitter produced `const await__gensym0 = await
  Promise.resolve(await__gensym0.child);`; Deno exited 1 with
  `ReferenceError: Cannot access 'await__gensym0' before initialization`.
  Complete source, generated JS, command/status/stdout/stderr are retained in
  `artifacts/cc/attempt11-focused-native.log` and summary in
  `attempt11-focused-native.txt`. This is an actual source-contract gap in the
  initial candidate, not an accepted runtime behavior.
- `artifacts/cc/attempt01` through `attempt11` preserve earlier implementation,
  fixture, and validation failures. The M6 evidence directory exists but has no
  claimed successful population. There is no final 70/7 or 14-comparison M6
  receipt.

## Current dispositions

| Criterion | Current state |
| --- | --- |
| NH-01 — Complete owned source names are reserved before native helper allocation | open; dotted lexical-root omission remains |
| NH-02 — Every early native generated-binding producer uses the reserved namespace | open; candidate focused proofs only, correction pending |
| NH-03 — Names preserve behavior, effects, checks and data/API roles | open |
| NH-04 — Owned units and supported fragment entrances retain lifecycle boundaries | open |
| NH-05 — Existing late allocators and private host/completion protocols compose | open |
| NH-06 — Actual CLI, JSON and package delivery uses protected native producers | open |
| NH-07 — Final source and mandatory delivery gates pass | open; only prior Clippy failures and focused targets are recorded |
| NH-08 — Independent close preserves history, scope and later owners | open |

The corrected source design and its bounded test are root-owned next steps.
The independent verifier has not accepted this candidate. BS-05/API/research
routing and the remaining later owners are not changed by this report.
