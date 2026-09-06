# Slice 01: lint-infra — Closing Report

**By:** CC (Claude Code) · **Date:** 2026-07-06 · **Branch:** `release/0.6.x`
**Verdict: delivered.** `lykn lint` is real end-to-end — a spanned,
pre-expansion SExpr walk with a parent-context stack, a hardcoded
match-dispatch registry, three TDD'd pilot rules, text + `--format=json`
output, exit codes `0/1/2`, and `insta` snapshots. The whole DD-59 rule
inventory (19 candidates) was compiler-verified **before** any rule was scoped
against it (arc10 lesson #4). `make check` green; the issue-#1 stub is gone.

---

## F-1 — The rule inventory, compiler-verified (the authoritative slice02 corpus)

Every DD-59 candidate's bad-example was written as a `.lykn` snippet and
compiled with the current `./bin/lykn compile`. Count reconciles with DD-59:
**15 tier-1 + 2 tier-2 + 2 conventions = 19**. Result:
**18 compiles-and-lintable (IN) · 1 already-errors (OUT)** — plus **three
flags** the verification surfaced (two guide-divergences, one severity-deferred).

| # | Rule (guide ID) | Tier | Bad-example compiled | Compiler result | Class |
|---|---|---|---|---|---|
| 1 | no-require (33) | 1 | `(bind fs (require "fs"))` | rc=0 → `require("fs")` | **IN** · pilot |
| 2 | no-eval (31) | 1 | `(eval "1 + 1")` · `(js:eval …)` | rc=0 (both) | **IN** |
| 3 | sort-without-comparator (17) | 1 | `(bind s (nums:sort))` | rc=0 | **IN** · pilot |
| 4 | parseint-radix (5) | 1 | `(bind n (parseInt s))` | rc=0 | **IN** · pilot |
| 5 | no-new-wrappers (6) | 1 | `(bind b (new Boolean false))` | rc=0 | **IN** |
| 6 | global-isnan (4) | 1 | `(bind r (isNaN x))` | rc=0 | **IN** |
| 7 | no-arguments (30) | 1 | `(bind a arguments)` | rc=0 | **IN** |
| 8 | no-iife (32) | 1 | `((fn () 1))` | rc=0 | **IN** |
| 9 | no-delete-on-array (34) | 1 | `(delete arr 0)` | rc=0 | **IN** |
| 10 | no-json-deep-copy (35) | 1 | `(JSON:parse (JSON:stringify x))` | rc=0 | **IN** |
| 11 | prefer-surface-operators (38) | 1 | `(=== a b)` | rc=0 (legal passthrough) | **IN** |
| 12 | or-for-defaults (3) | 1 | `(bind y (or x 5))` | rc=0 | **IN** ⚠ severity-deferred |
| 13 | for-in-on-arrays (29) | 1 | `(for-in k arr …)` | rc=0 | **IN** |
| 14 | fn-as-param-name (42) | 1 | `(func f :args (:function fn) :body (fn))` | rc=0 → **valid** JS | **IN** ⚠ guide stale |
| 15 | const-wrapped-for-of-binding (44) | 1 | `(for-of (const (array i v) …) …)` | rc=0 → **invalid JS** | **IN** ⚠ compiler bug |
| 16 | missing-type-annotations (39) | 2 | `(func f :args (x) :body x)` | **rc=1** — `expected type keyword or destructuring pattern` | **OUT** |
| 17 | shadowing (12) | 2 | `(bind x 1)(func f :args (:number x) :body x)` | rc=0 | **IN** |
| 18 | no-relative-source-imports (arc11) | conv | `(import "./foo.js" (bar))` | rc=0 | **IN** |
| 19 | no-dirname-fixtures (arc11) | conv | `(path:join import.meta:dirname "fix.json")` | rc=0 | **IN** |

### The three flags (surfaced, not decided — slice02 owns the calls)

- **ID-39 missing-type-annotations → OUT.** The compiler already rejects
  untyped params (`func`/`genfunc`/`fn`) with a hard error at read/expand time.
  The compiler owns this; the linter must not duplicate it. This is the one
  candidate removed from the corpus. **Corpus = 18.**

- **ID-42 fn-as-param-name → guide is STALE.** Guide-09 claims using `fn` as a
  param name *"Throws: fn requires at least 2 arguments"*. It does **not** — the
  current expander accepts it and emits **correct** JS (`function f(fn) { … return fn(); }`).
  The rule's original justification (it breaks) no longer holds. Slice02 must
  re-derive the rule's rationale against measured behaviour ("still confusing to
  read though it works" is a *style* argument, weaker than the guide's stated
  *breakage* argument) or drop it. Kept **IN** pending that call.

- **ID-44 const-wrapped-for-of-binding → guide STALE *and* a compiler bug.**
  Guide-09 claims it *"Throws: for-of requires binding, iterable, and body"*.
  The current compiler neither throws nor emits valid JS — it returns rc=0 and
  emits **syntactically invalid** JavaScript:
  ```
  for (const const [i, v] = items.entries();
   of console.log(i)) {
  ```
  `deno check` on the emitted file: `error: The module's source code could not
  be parsed: Expected ident … for (const const [i, v] = …`. So `lykn compile`
  **silently produces unparseable output**. This is a strong **error**-severity
  lint candidate (catch what the compiler lets through) *and* a latent compiler
  defect bubbled up below. Kept **IN**.

- **ID-03 or-for-defaults → severity deferred (per DD-59).** Compiles fine;
  DD-59 already flagged the false-positive-rate concern (`(or x <literal>)` is
  often legitimate). Left **IN** with severity to be decided in slice02 against
  measured repo corpus data, exactly as instructed — not decided here.

The prompt flagged ID-44/45/46 to watch post-DD-49/50. ID-45/46 are **not**
DD-59 candidates (class-syntax errors the compiler owns). ID-44 **is** a
candidate, and the watch paid off — see above.

---

## Per-row ledger walk (6 rows, no silent drops)

**F-1 — Rule inventory compiler-verified — MET.** Table above; all 19
candidates compiled against the live binary; classification 18 IN / 1 OUT;
count reconciles with DD-59; three flags surfaced. Evidence: the transcripts
in F-1.

**F-2 — Lint infrastructure — MET.** `crates/lykn-cli/src/lint/mod.rs`:
spanned DFS `walk` maintaining a `LintContext` ancestor stack (outermost-first,
`parent()` accessor); `LintRule` trait with `enter`/`exit` both `&mut self` so
**stateful** rules aren't precluded (slice03 shadowing needs scope); hardcoded
`registry()`; `Diagnostic`-based findings with error/warn severities; text
render mirrors `lykn check`'s `file:line:col: severity [rule]: message`. The 3
pilots exercise walk + registry + both severities. Findings sort by source
position.

**F-3 — CLI wired, stub replaced — MET.** `cmd_lint` in `main.rs` replaces the
issue-#1 stub: accepts files **and** dirs (`.lykn` discovered recursively via
`collect_files_recursive`; **`.lyk` kernel files exempt** — see design calls);
exit **0** clean / **1** findings / **2** usage-or-IO (empty args, unknown
`--format`, missing path, non-`.lykn` file, parse error); `--format=json` emits
the stable shape (rule, severity, message, file, span{start,end{line,column}},
suggestion). Demonstrated: bad → exit 1 + 3 diagnostics; good → exit 0; bad path
→ exit 2; no args → exit 2; JSON parses. `grep` confirms the
`not yet implemented`/`issue #1` stub text is gone.

**F-4 — 3 pilot rules green — MET.** `rules.rs`, shape-diverse on purpose:
`no-require` (call-head match, **error**), `sort-without-comparator`
(method-call arity, warn), `parseint-radix` (call arity, warn). Nine
assertion tests pin both directions — bad flagged at the right span (head-atom
precision) with a suggestion; good silent — plus nested-walk, sort-order, and
clean-source coverage.

**F-5 — Snapshots — MET.** Two `insta` snapshots under
`src/lint/snapshots/` (`lint_text_all_three`, `lint_json_all_three`),
**manually reviewed** (contents checked line-by-line: right rules, severities,
messages, suggestions; spans at head atoms — `nums:sort` at col 10 per DD-01
colon-in-atom) then accepted. **Never auto-accepted** (`INSTA_UPDATE=no` on the
first run; `cargo insta accept` only after review).

**F-6 — Green bar + smoke dogfood — MET.** `make check` ✓ (build + lint +
test, ~1m16s). JS suite **1365 / 0 unchanged** (no JS work). Rust grew by
exactly the **+11** lint tests (bin unittest 94 → 105), all green. Smoke
dogfood `./bin/lykn lint test/ examples/` → **117 `.lykn` files, 0 findings,
exit 0, no crash** (recorded below; not fixed here).

---

## Design-call rationales (surfaced)

1. **Walk context built now (F-2), though the pilots don't use it.** The DD-59
   inventory's next rules are ancestry-dependent (`for-in-on-arrays`, the two
   arc11 conventions rules in slice02; `shadowing` in slice03). The prompt
   recommended "a lightweight parent stack from the start"; I built it and
   marked the currently-unread `LintContext` fields/`parent()`
   `#[allow(dead_code)]` **with an explicit forward-reference comment** naming
   the consuming slices. This is *disclosed* forward-API with a re-entry
   condition, not buried intent (arc11/slice02's lesson) — called out here so
   the marker is tracked, not silent.

2. **`.lyk` kernel files exempt (F-3).** Kernel idiom is its own vocabulary
   (the very forms the linter flags in surface code — `const`, bare operators,
   raw JS interop — are *correct* in `.lyk`). Linting them would be noise.
   Discovery skips `.lyk`; only `.lykn` is walked. Recorded as the default per
   the ledger.

3. **Rule IDs are kebab-case, deno-lint style (F-2).** `no-require`,
   `sort-without-comparator`, `parseint-radix`. These become API (they print in
   findings and JSON), so the convention is set now: lowercase, hyphenated,
   matching the ecosystem the audience already knows (`deno lint`, ESLint).

4. **Span points at the head atom, not the whole form (F-4).** `(require "fs")`
   flags at `require` (col 11), not the enclosing `(bind …)` — the diagnostic
   points precisely at the offending identifier. Consistent across all three
   pilots; pinned in the tests and snapshots.

5. **Text render mirrors `lykn check` (F-2).** `file:line:col: severity
   [rule]: message` + an indented `suggestion:` line — so `lykn lint` reads
   like the tool users already know, per DD-59 Q3.

---

## Smoke-dogfood findings (for slice02 triage — NOT fixed here)

`./bin/lykn lint test/ examples/` → **117 files, 0 findings, exit 0.** The
three narrow pilots (`no-require`, `sort-without-comparator`, `parseint-radix`)
do not fire on the existing corpus — the codebase doesn't use CommonJS
`require`, bare `:sort`, or radix-less `parseInt`. This is the *expected*
smoke result: a clean corpus against three deliberately-narrow rules confirms
no false positives, but the real dogfood signal arrives when slice02 lands the
full 18-rule corpus (the broader rules — `prefer-surface-operators`,
`or-for-defaults`, `shadowing` — will actually exercise the repo). No crash,
no parse failures across 117 files: the walk and discovery are sound at corpus
scale.

---

## Bubble-up to arc05

- **AUTHORITATIVE SLICE02 CORPUS: 18 rules.** The F-1 table is the contract.
  Start slice02 from it, not from DD-59's target list (which still lists 19 and
  is now superseded by measured ground truth).

- **Compiler bug (filed, out of scope) — `const`-wrapped `for-of` emits
  invalid JS.** `(for-of (const …) …)` compiles rc=0 but produces unparseable
  `for (const const … of …)`. The compiler should either reject it (as Guide-09
  claims it does) or emit valid JS. This straddles arc05 (lint corpus: strong
  `error` candidate) and the compiler arcs (arc03/arc10 territory: a latent
  emit defect). Recommend a DD/issue against the compiler independent of the
  lint rule — the lint rule shouldn't be the *only* guard against unparseable
  output.

- **Guide-09 has stale "Throws" claims (filed for slice03).** ID-42 and ID-44
  both document runtime/compile throws that no longer happen. Slice03 owns
  guide alignment; these two entries need correcting against the F-1
  transcripts. ID-42's *entire rationale* (it breaks) is void — slice02 should
  decide whether a style-only version survives.

- **Severity still open for ID-03 (or-for-defaults)** per DD-59's false-positive
  concern — decide against measured repo data in slice02, not a priori.

- **Stateful-rule readiness confirmed.** The `enter`/`exit` `&mut self` trait
  + fresh-per-file registry instances are in place for slice03's `shadowing`
  (scope tracking); no rework needed when that lands.

---

## Discipline notes

- **F-1 before F-2 in reporting order** — the table ships complete and first,
  as a first-class deliverable, regardless of pilot ordering.
- **Surfaced, not decided silently:** walk-context design + its disclosed
  `allow(dead_code)`, the `.lyk` exemption, kebab-case rule IDs, and every F-1
  reclassification/flag (above).
- **No scope creep:** no `--fix`, no config files, no JS-side work, no guide
  relabeling, no `make lint` wiring — later slices own those. Source only;
  `docs/design-v0.6.0/**` left to CDC except this report.
- **Rebuild-first** throughout; `./bin/lykn` in every transcript.

Handed back for CDC `cdc-verification.md`. → then slice02 (the 18-rule corpus +
real dogfood), slice03 (context rules + guide alignment), and the arc's P-11
demo.
