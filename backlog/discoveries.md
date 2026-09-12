# Discovery register

Append-only. Protocol in [`README.md`](README.md). IDs are permanent — never
renumber, never delete a row. Dispositioned and rejected entries stay: "we looked
at this and decided no" is information the next person needs.

Seeded 2026-07-24 from the session that closed arc06, so the format was tested
against a real corpus rather than designed in the abstract.

**Relocated 2026-07-25** from the gitignored `workbench/` into this tracked
home — the path five committed documents had already been citing
(`project-plan.md:313`, `:343`; `01-macro-entry-diagnostics/{slice-doc,
closing-report,cdc-verification}.md`). See `README.md` for the protocol and
the routing rule.

---

## ★ The systemic finding

### `D-2607-Z5KN` — the uncovered case is reliably the one that ships wrong

- **What:** We have several distinct ways for a green build to mean nothing, and
  in every instance below the *specific path with no coverage* is the path that
  shipped a defect. Four independent code paths in a single day.
- **How found:** `cdc-review` ×2, `dogfooding` ×2 — i.e. **both activities found
  it independently**, which is what makes it systemic rather than anecdotal.
- **Guess:** Highest of anything in this register. Every symptom below cost real
  time, and the class will keep producing them.
- **Kind:** `systemic` · **Status:** `open`

**The four instances:**

1. **`D-2607-H4TC`** — `write_effective_deno_config` rewritten three ways at once
   with **zero** test coverage → a silent overlay-drop regression. The causal
   chain is exact: no coverage → rewrite → silent defect.
2. **`D-2607-B8SY`** — a test **named** for a guard whose body asserted the
   opposite case. The ledger row, the commit message and the closing report all
   inherited a guarantee nothing checked. *A test that overclaims is worse than a
   missing test:* it converts absence-of-evidence into apparent-evidence at three
   documentation levels simultaneously.
3. **`D-2607-3VXM`** — threading tests assert compiled **shape**, never
   execution. Green forever while the code they describe cannot run.
4. **`D-2607-7RQD`** — the missing-directory case had no test in *either*
   compiler, and it is the case that shipped a confidently wrong hint.

**Why this is one finding and not four:** the shape is identical each time — the
untested branch is the defective branch, and nothing in `make check` could have
caught any of them, because `make check` was green throughout.

**Two more instances, added 2026-07-25** — same shape, one in test coverage and
one in documentation:

5. **`D-2607-2PQR`** — cross-compiler threading parity rests on **two** test
   cases, neither of which covers the keyword-step path DD-18.1 changed in both
   emitters. The implementations happen to agree; nothing checks that they do.
6. **`D-2607-V8DM`** — a register row quoted compiled output it had
   *transcribed* rather than *re-run*, and the quote was wrong. The line nobody
   executed is the line that is wrong — now demonstrated in prose as well as
   code.

**Disposition needed.** Candidate structural moves, in rough cost order: audit
for other shape-only assertions (cheap, direct from #3); require a coverage
statement in the ledger row of any function being materially rewritten (process,
free); execute `examples/` in CI (kills `D-2607-P4WQ` too). **Do not close this
by fixing the four symptoms** — they are already fixed. It closes when the
*generation rate* drops.

---

## Systemic

### `D-2607-P4WQ` — nothing executes the examples

- **What:** No test target runs `examples/*.lykn`. `make check` runs the corpus;
  `make test-docs` runs fenced blocks under `docs/`. `examples/` is in neither.
- **How found:** `dogfooding` · **Guess:** High — this is *why* `D-2607-K9RT`
  survived the life of the language. **Kind:** `systemic` · **Status:** `open`
- **Symptoms:** `D-2607-K9RT`
- **Note:** Structural fix beats vigilance. Executing examples in CI kills the
  class at once and needs no ongoing discipline.

### `D-2607-3VXM` — shape-assertions stand in for execution

- **What:** `test/surface/threading_test.lykn:25` asserts
  `"(->> items (filter pred) (map f) (reduce g init))"` nests correctly — and
  passes green while that code cannot run. Any macro tested only by shape can be
  green and broken.
- **How found:** `dogfooding` · **Guess:** High, and broader than threading —
  worth sweeping all of `test/surface/`. **Kind:** `systemic` ·
  **Status:** `open` · **Parent:** `D-2607-Z5KN`

### `D-2607-2PQR` — cross-compiler threading parity rests on two test cases

- **What:** `crates/lykn-lang/tests/cross_compiler.rs:144-145` is the *entire*
  JS/Rust parity surface for threading — `cross_test!(cross_thread_first,
  "(-> x f g)")` and `cross_test!(cross_thread_last, "(->> x (f a) (g b))")`.
  Bare symbols and one plain call. **No keyword-step parity test**, though
  DD-18.1 changed the keyword path in *both* emitters (Phase 2 and Phase 3).
  Nothing compares the two on `(:method args)`, namespaced heads, or
  `some->`/`some->>`.
- **How found:** `audit` — building the Rust compiler to settle whether `->>`
  existed there too, after the operator surfaced conflicting accounts.
- **Guess:** Medium as defect risk, **high as explanation.** The two do agree
  today — 14/14 in `project03-language-evolution/slice03-threading-macros/data/parity-transcript.txt`
  — but the thinness is *why* a JS-only check felt sufficient to the surveying
  session, and `AGENTS.md` states the obligation outright: *"Changes to the
  grammar should be reflected in both."*
- **Kind:** `gap` · **Status:** `open` · **Parent:** `D-2607-Z5KN`
- **Suggested:** promote the 14 transcript cases into `cross_compiler.rs`. They
  exist, they pass, and they already cover keyword steps, namespaced heads,
  `some->`/`some->>` and `as->`'s silent miscompile. Converts a transcript into
  a regression gate.

### `D-2607-V8DM` — a correct finding degraded, in retelling, into a false one

- **What:** `dogfooding-friction-log.md` F-1 found, correctly, that **the
  collection prelude is missing** — *"`->>` is a purely syntactic macro… `filter`,
  `map` and `reduce` do not exist."* Downstream, that travelled informally as
  ***"`->>` is not implemented"*** — a different claim, and false. `->>` is
  implemented correctly in **both** compilers (14/14 parity).
- **How found:** `operator` — Duncan held three accounts of `->>` side by side
  and asked which to believe. Reconstruction showed **all three agreed**; the
  contradiction lived entirely in the summaries.
- **Guess:** Medium-high, and structural. The tracked artifacts were *precise* —
  F-1 is precise, `D-2607-K9RT` is precise. The drift happened in the informal
  channel between them, which no register can police. Cost: a session re-derived
  a settled fact and nearly wrote a false one into a planning tree.
- **Kind:** `systemic` · **Status:** `open` · **Parent:** `D-2607-Z5KN`
- **The sharper half:** F-1 said `even?` maps to `evenQMARK`. It maps to
  **`isEven`**. `D-2607-K9RT` **transcribed** `evenQMARK` from F-1 and it sat in
  this register unchecked. The register did not merely fail to stop the drift —
  **it propagated an error from its source document.** Corrected at both sites
  2026-07-25 as annotations, not silent rewrites.
- **Candidate disposition:** when a register row quotes *compiled output*, that
  quote is a claim about the code and owes the same evidence strength as any
  other — **re-run, not transcribed.** `D-2607-Z5KN`'s thesis applied to
  documentation.

### `D-2607-L7BX` — `project03-language-evolution/` is absent from `main`, with debris that makes it look present

- **What:** The 0.7.0 planning tree exists only on `release/0.7.x`. On `main`,
  `project03-language-evolution/` holds two **empty, untracked** directories
  (`02-packaging-strategy/artifacts`, `.../evidence`) and nothing else. An `ls`
  suggests a sparse tree; `git ls-files` shows no tree at all.
- **How found:** `audit` — locating the home for `03-threading-macros`.
- **Guess:** Low-medium as a hazard, but it is the **`workbench/` failure shape
  in miniature** — a path resolving on disk and not in git, in the directory
  where planning artifacts are meant to be findable. `D-2607-D3NL` is the same
  class at scale.
- **Kind:** `trap` · **Status:** `open`
- **The mirror problem, and the one with teeth:** `docs/ecmascript-2025/` (the
  42-file ES2025 corpus, `0a4b138`) is on **`main` only**. Units under
  `project03-language-evolution/` live on `release/0.7.x` and therefore **cannot cite it
  with a path that resolves on their own branch** — which `AGENTS.md` requires
  and `make check` enforces. Found the hard way: `03-threading-macros`'
  reproduce command was written against `../../ecmascript-2025/…` and did not
  resolve. ~~**Operator call:** cherry-pick `0a4b138` onto `release/0.7.x`, or
  accept a cross-branch note in every unit that uses the corpus.~~
  **RESOLVED 2026-07-25 — `release/0.7.x` was rebased onto `main`, which
  carried `0a4b138`.** The corpus is now on all three branches (42 files each:
  `git ls-tree -r --name-only <branch> -- docs/ecmascript-2025 | wc -l`), the
  in-branch `../../ecmascript-2025/…` path resolves, and `inventory.md` §9 +
  ledger R-1 are amended to use it. **The mirror problem is closed.**
- **Also:** `backlog/owed-0.7.x-rows.md:4` named the worktree
  `.workdirs/release-0.7.x`; the actual path is `.worktrees/0.7.x`. Fixed
  2026-07-25.
- **UPDATE 2026-07-25 (same day):** the operator **committed `backlog/`**
  after this row was written — it is now tracked on both `main` and
  `release/0.6.x` (3 files each, identical), so the six rows added by
  `03-threading-macros` are genuinely `routed`. ~~The *branch-split* half of
  this row stands: `docs/ecmascript-2025/` is still `main`-only while
  `project03-language-evolution/` is still `release/0.7.x`-only.~~ **Amended later the
  same day by an independent CDC pass:** only *half* of that still stands.
  `docs/ecmascript-2025/` is **no longer** `main`-only (the rebase; see the
  struck bullet above). `project03-language-evolution/` **is** still `release/0.7.x`-only
  — that is this row's surviving primary claim, and it is fine: the 0.7.0
  planning tree *should* live on the 0.7.x branch under the new rule. What was
  wrong was the *debris* on `main` implying otherwise.
- **Structural fix adopted:** `AGENTS.md` now carries a **"Which branch do I
  write to?"** section (confirmed with the operator 2026-07-25) — `main` changes
  by rebase/merge only; 0.6.0 work is authored in `.worktrees/0.6.x/`, 0.7.0
  work in `.worktrees/0.7.x/`, and cross-cutting artifacts (this register, the
  DDs) are owned by the **active release branch**, currently 0.6.x. That removes
  the guesswork that produced this row and the two failures beside it.

### `D-2607-K4WT` — the double-return path fires on four heads, not one

- **What:** ID-32 records that a typed `fn` ending in an explicit `(return X)`
  emits `return return X`. The guard responsible lists **four** heads, so
  `(throw X)`, `(break)` and `(continue)` in the same position emit
  `return throw X;` / `return break;` too. Only the `return` case was ever
  written down.
- **Where:** `crates/lykn-lang/src/emitter/forms.rs`, `is_valueless_last_expr`
  — `if matches!(head, "return" | "throw" | "break" | "continue") { return false }`
  (→ not valueless → gets wrapped). JS reaches the identical behaviour by
  **omission**: `STATEMENT_ONLY_HEADS` (`packages/lang/surface-helpers.js:26`)
  simply does not list them, so `wrapReturnLast` wraps.
- **How found:** `cdc-review` — the arc15 slice04 liveness re-check.
- **Guess:** Low-medium. The output is invalid JS, so it fails loudly at parse
  time rather than miscompiling silently — the *"compiles ≠ valid output"*
  genus, not arc15's charter. Cheap to fix, and plausibly one edit for all four.
- **Kind:** `bug` · **Status:** `closed` →
  `project02-language-toolchain-alignment/arc15-surface-syntax-traps/slice04-sibling-traps/closing-report.md`.
- **Parity note worth keeping:** the two backends *behave* identically and
  *reason* differently — Rust names the heads in an explicit `matches!`, JS
  omits them from a list. A fix must touch both, and the JS side carries no
  record of why the heads are treated this way.
- **Evidence:** source read at `e77ebcf`, both backends. Runtime behaviour of
  the emitted JS was originally **inference**; slice04 executed the probe on
  2026-08-08, then fixed both emitters so `return`/`throw`/`break`/`continue`
  are not wrapped as returned expressions. Residual `break`/`continue`
  illegality is ordinary JavaScript control-flow validity, not `return <head>`.

### `D-2607-N6HS` — the string-escape gap is every escape, not `\uNNNN`

- **What:** ID-33 says lykn does not process `\uNNNN`. Both readers in fact
  implement exactly four escapes — `\n`, `\t`, `\\`, `\"` — and pass
  **everything else** through as the bare character. `"\r"` becomes the letter
  `r`; `"\u2026"` becomes `u2026`. Also affected: `\0`, `\b`, `\f`, `\v`,
  `\xNN`, `\'`, `\u{…}`.
- **Where:** `crates/lykn-lang/src/reader/lexer.rs:212-217` (`read_string`,
  catch-all `Some(c) => value.push(c)`); `packages/lang/reader.js:61`
  (`readString`, catch-all `else value += esc`).
- **How found:** `cdc-review` — the arc15 slice04 liveness re-check.
- **Guess:** Medium-high. Silent, no diagnostic, and the result is a
  plausible-looking string that will read as a typo in someone's data rather
  than a compiler gap. This *is* arc15's class.
- **Kind:** `trap` · **Status:** `closed` →
  `arc15-.../slice04-sibling-traps/closing-report.md`.
- **Good news for scoping:** the two readers are in **exact parity** — same four
  escapes, same catch-all — so a fix lands symmetrically with no divergence to
  reconcile first.
- **Closure:** slice04 taught both readers the standard escape set
  (`\r`, `\0`, `\b`, `\f`, `\v`, `\/`, `\'`, `\xNN`, `\uNNNN`, `\u{...}`) and
  rejects malformed or unknown escapes instead of silently dropping the
  backslash. The guide entry was re-scoped in the same slice.

### `D-2607-3XKP` — a build flag silently changes what a function returns

- **What:** the `fn` return-wrap was gated on `has_type_checks`, which is
  `!ctx.strip_assertions && <params are typed>`. So a typed multi-statement `fn`
  that returns correctly in a normal build **returns `undefined` under
  `--strip-assertions`** — the wrap is skipped, the arrow gets a block body, and
  the value is discarded. The liveness note also described untyped
  multi-statement `fn` as the same silent class; the 2026-08-08 execution probe
  corrected that premise for current 0.6.x: JS rejects `(fn (x) ...)`, while
  Rust mis-lowers it as a bad plain call. That mismatch is tracked separately
  as `D-2608-H7FN`.
- **Where:** `emitter/forms.rs` `emit_fn_expr` (the `else` arm →
  `items.extend(emitted_body)`) + `codegen/emit.rs` `emit_arrow`
  (`body.len() > 1` → `emit_block_body`). JS: `classifier.js` `case "Fn"`,
  the `typeChecks.length > 0` test.
- **How found:** `cdc-review` — the arc15 slice04 liveness re-check. Stated in
  ID-32's guide rationale almost in passing; the source confirms it and it is
  the most dangerous item the re-check found.
- **Guess:** **High.** Silent, value-destroying, and *conditional on a build
  flag* — so it can pass every test in a normal build and fail in a stripped
  one. Worse than the trap ID-32 is named for.
- **Kind:** `trap` · **Status:** `closed` →
  `arc15-.../slice04-sibling-traps/closing-report.md`.
- **Parent:** `D-2607-Z5KN` — **zero test coverage in either compiler**
  (`grep "return return"` → 0 hits; no escape-gap test either). Another
  instance of *the uncovered case is the one that ships wrong*.
- **Evidence:** source read at `e77ebcf`, both backends; runtime claim was
  **inference** until slice04. The 2026-08-08 probe reproduced the stripped
  Rust `undefined` return, then verified `--strip-assertions` emits `return y`
  and runs as `2`.

### `D-2608-H7FN` — Rust mis-lowers bare-parameter `fn` instead of rejecting it

- **What:** current docs and JS behaviour require typed `fn` parameters:
  `(fn (x) ...)` should be a surface compile error. The 2026-08-08 slice04
  probe found that JS rejects the shape, but Rust compiles it as a plain call to
  `fn(...)`, yielding runtime `ReferenceError: fn is not defined`.
- **Where:** Rust's recursive surface classification path does not reject this
  nested `fn` form before emitter/codegen fallback. The direct classifier
  helper already errors on non-keyword parameter entries; the missing piece is
  applying that rejection on the nested compile path.
- **How found:** `cc-implementation` — arc15 slice04 execution probe.
- **Guess:** Medium. This is a loud failure rather than a silent miscompile, so
  it is outside slice04's fixed silent-return headline, but it is a compiler
  parity and language-safety defect.
- **Kind:** `bug` · **Status:** `closed` →
  `project02-language-toolchain-alignment/arc15-surface-syntax-traps/slice05-nested-fn-param-validation/closing-report.md`.
- **Parent:** `D-2607-Z5KN` — the direct case was not covered by cross-backend
  execution tests.
- **Closure:** slice05 added a resolved pre-classification Rust validator for
  nested `fn`/`lambda`/`genfn` parameter-list errors, wired through both
  `lykn compile` and `lykn check`. JS already rejected the shape and is now
  pinned by a focused regression. The older labelled-`fn` non-param arity
  residual remains separately documented and unchanged.

### `D-2607-W2FJ` — the governance document cannot satisfy the rule it carries

- **What:** `AGENTS.md`'s cited-path rule says every citation must resolve on
  the document's own branch. `AGENTS.md` is byte-identical on every branch by
  its own design, and it carries **eight** citations that cannot resolve on
  `release/0.6.x`: `project03-language-evolution/` (0 files there — the routing table's
  own target), `workbench/` (0 — the rule naming it is *"workbench is scratch,
  nothing durable, nothing cited"*), `.worktrees/0.6.x/` and `.worktrees/0.7.x/`
  (0 — worktree roots are git plumbing, never tracked content), plus skill paths
  the document itself marks conditional.
- **How found:** `cc-review` — CC ran the L-7 gate against `AGENTS.md` and it
  fired correctly on all eight.
- **Guess:** Medium. Not a defect in the *code*; a defect in **my spec**. The
  `02-artifact-homes` ledger amendment (point 4) asserted `AGENTS.md`'s
  citations must resolve on *all* branches — the strictest possible reading —
  without walking what `AGENTS.md` actually has to say. A routing table's job is
  to name places that do not exist here. **The rule as written outlaws the
  document that carries it.**
- **Kind:** `bug` (in the spec) · **Status:** `open — operator decision`
- **Proposed fix (CC's, endorsed by CDC):** exempt a sibling release's planning
  tree **only when that tree is absent from `HEAD` entirely**. *A missing root
  is a branch-ownership fact; a missing leaf under a present root is a bug.*
  That keeps the teeth — a typo'd path under a tree that **does** exist still
  fails — while accepting the branch-ownership reality the rule itself created.
- **Lesson, same shape as the ones this register keeps recording:** I wrote
  point 4 as a *consequence* of "AGENTS.md is byte-identical everywhere" and
  never opened `AGENTS.md` to check what that consequence implied. *A
  consequence is a claim about a path you have not walked* — the fourth instance
  this week, and the first where the unwalked path was my own rule.

### `D-2607-Q8LM` — the commit discipline guarantees a red gate mid-session — **CLOSED**

- **What:** Two rules adopted the same day interact. (1) The L-7 gate resolves
  citations against `git ls-tree HEAD`, so a file present in the working tree
  but uncommitted **fails** — deliberately, because that *is* the original
  register bug. (2) `AGENTS.md`'s branch rule makes commits the operator's and
  CC's, never a remote CDC session's. **Therefore any CDC session that writes a
  document citing a sibling it also just wrote leaves the gate red until the
  operator commits.** It is not a false positive and not a race — it is the two
  rules composing.
- **Where, on the day it landed:** `slice04-sibling-traps/liveness-recheck.md`,
  written by CDC and cited from `arc-plan.md`, `discoveries.md` **and CC's own
  `02-artifact-homes/closing-report.md`** — so the report announcing the gate
  extended the condition the gate reports. Nobody did anything wrong.
- **How found:** `cc-review`, within hours of the gate landing.
- **Guess:** Low as a defect, **high as a process fact.** If it is not named, the
  next session sees red on a clean checkout-plus-work and "fixes" it by
  weakening the gate.
- **Kind:** `gap` · **Status:** `open — operator decision`
- **The three options, and CDC's read:**
  1. **Accept red-until-commit as normal** *(recommended)*. The gate's contract
     becomes *green at `HEAD` after the operator commits*, not *green
     continuously*. A dirty tree reading red is arguably **correct** — the
     citations genuinely do not resolve for anyone else yet.
  2. Have CDC avoid citing newly-written siblings. Rejected: that is
     spec-softening — it makes the documents worse to keep a check quiet.
  3. Move the gate to pre-commit rather than `make check`. Costs the CI signal.
- **RESOLVED 2026-07-25 (operator): option 1 — accept red-until-commit.** *"A
  good, strong stance that will keep us disciplined."* The contract is **green
  at `HEAD` after the operator commits, not green continuously.** Landed in
  `AGENTS.md` on all three branches, next to the gate, together with the
  explicit prohibitions: never weaken the gate, never drop a citation, and
  **never avoid citing a new sibling to keep the gate quiet** — that last is
  spec-softening, making documents worse to keep a check happy.
- Also landed the sibling convention (CC's item 3, CDC-endorsed): *documents
  that discuss dangling paths cite them in fenced blocks, not inline code* —
  convention, not mechanism, preserving `Makefile:308`'s standing position
  against inline suppression.
- **Status: CLOSED (repaired — the rule now says what the behaviour is).**

### `D-2607-5TDW` — the gate found 14 real defects on a branch it was never tuned against

- **What:** Run on `release/0.7.x`, the L-7 gate reported **14** citations that
  resolve for nobody: 0.7.0 ledgers and slice-docs citing
  scripts/probe-threading.js, scripts/build-catalog.py, `evidence/`,
  `artifacts/` — none of them in any branch's git. **Two are ledger rows citing
  their own evidence**, which is the strongest possible form of the defect: a
  verification row whose verification cannot be opened.
- **Where:** `release/0.7.x`, `project03-language-evolution/` units. Enumerated in
  `project02-language-toolchain-alignment/arc16.1-artifact-homes/slice01-artifact-homes/closing-report.md`.
- **How found:** `cc-review` — CC ran the gate cross-branch unprompted.
- **Guess:** Medium-high, and **this is the row that justifies the gate.** It
  was specified from a `workbench/`-shaped problem on 0.6.x, tuned against
  nothing on 0.7.x, and immediately found live defects there — including the
  `evidence/`/`artifacts/` empty untracked directories already recorded as
  debris under `D-2607-L7BX`.
- **Kind:** `bug` · **Status:** `open` — owed to `release/0.7.x`; **not**
  `routed` until a 0.7.x-side home exists and contains them (the rule).
- **Note:** CC deliberately did not fix these — right call, they are another
  branch's work — and deliberately wrote no register rows for any of today's
  findings, to avoid racing a concurrent CDC session editing this file. Also the
  right call. These three rows are CDC's, written after that session (mine)
  finished.

### `D-2607-8HTN` — a routing row named an owner instead of a home

- **What:** The 0.7.x BACKLOG recorded the Lykn Book as "owned by the Book
  project." No such project was ever instantiated. The work read as handled for
  three months.
- **Where:** `release/0.7.x` → `project03-language-evolution/BACKLOG.md:290`
- **How found:** `audit` · **Kind:** `systemic` · **Status:** `routed` →
  project-plan v1.34 records the rule: *a routing row must name a home that can
  be opened, not an owner that might someday exist.*

### `D-2607-QZ62` — an arc-plan went stale while five slices closed under it

- **What:** `arc06/arc-plan.md` still said "slice02 is the next work" while
  slices 02–05 had closed and 06/07 were committed. Caused by recon-first
  scoping: every slice after 02 was scoped against recon output, so nobody
  re-read the plan.
- **How found:** `cdc-review` · **Kind:** `systemic` · **Status:** `routed` →
  arc-plan v1.3, lesson in §2 (re-reconcile at each slice close, not only at arc
  close).

---

## Held for design

Discoveries whose *fix* is a language decision, parked pending the language-design
discussion. **Logged so the pending conversation is durable, not to pre-empt it.**

### `D-2607-K9RT` — the flagship `->>` example cannot run

- **What:** `(->> items (filter even?) (map double))` expands to
  `map(double, filter(isEven, items))`. **`filter`, `map` and `reduce` do not
  exist** — no prelude, no stdlib. Compiles clean, throws `ReferenceError`.
  *(Corrected 2026-07-25: this row said `evenQMARK`, transcribed from
  `dogfooding-friction-log.md` F-1. The mapping is `isEven`, verified in both
  compilers. See `D-2607-V8DM` — the row was transcribed, not re-run.)*
- **Where:** `docs/guides/00-lykn-surface-forms.md:678` and `:697`;
  `examples/surface/threading.lykn:33-37`.
- **How found:** `dogfooding` — asked "where does `filter` come from?" while
  writing the first fold in `fences.lykn`.
- **Guess:** High. Not stale — *never true*. Teaches Clojure muscle memory to
  people writing JavaScript, in the most-read reference guide.
- **Kind:** `trap` · **Status:** `held-for-design`
- **Caused by:** `D-2607-P4WQ`, `D-2607-3VXM`
- **The design question:** JS collection APIs are methods on the receiver, so
  `->` + method-threading is the real idiom and `->>` has little natural to point
  at. Ship a collection prelude (making `->>` earn its place), or demote `->>` in
  the docs? The doc fix is 0.6.0-cheap either way; the prelude is a language call.
- **EVIDENCE BASE, 2026-07-25 — this row now has one.**
  `project03-language-evolution/slice03-threading-macros/` (on `release/0.7.x`) censused all
  **489** ES2025 built-ins and **214** host callables. Headline: **417 of 489
  (85%)** cannot distinguish `->` from `->>` at all; of the **48** that can, it
  is **37 datum-first : 2 datum-last** (the two being `BigInt.asIntN/asUintN`).
  The host tier is where thread-last actually lives — 18 operations, all either
  *configured operators* (WebCrypto) or *keyed sinks* (`Deno.writeTextFile`,
  `Headers.set`). Conclusion: `->>` has a real but **terminal, one-step** domain,
  not a pipeline one. Recommendation is *keep `->>` and re-scope the docs; ship
  `as->` (`D-2607-3KTP`); do **not** ship a datum-last prelude* — the last is
  coupled to `01-treeshake-audit`, since a prelude needs runtime functions in
  compiled output. **Still `held-for-design`:** the unit supplies evidence, the
  language-design conversation owns the call.
- **Also settled:** `->>` *is* implemented, correctly, in **both** compilers
  (14/14 byte-identical parity). The "not implemented" reading was a retelling
  artifact — `D-2607-V8DM`.

### `D-2607-W7KD` — no idiomatic answer for accumulate-over-a-sequence

- **What:** The most common shape in text processing has no documented spelling.
  `bind` is immutable, `cell` is discouraged, `reduce` doesn't exist, no guide
  shows a fold. Worse: the SKILL's own generator example uses
  `(for (let i start) …)` — kernel `let` — while its anti-patterns table bans
  exactly that. **The guides model the thing they prohibit.**
- **How found:** `dogfooding` · **Guess:** Medium-high — every non-trivial
  program hits this in its first hour. **Kind:** `gap` ·
  **Status:** `held-for-design`
- **Note:** The *doc* half (an "Iteration and accumulation" section ranking
  method `:reduce` → recursion → `cell` → kernel loop) can land without the
  design call. The design call is whether a fold primitive should exist.

### `D-2607-XXXX` — PLACEHOLDER: further `fences.lykn` discoveries pending

- **What:** The operator has additional discoveries from the `fences.lykn`
  dogfooding work that he wants to raise **after** a language-design discussion.
  This row exists so the *existence* of that pending conversation is durable.
- **How found:** `dogfooding` · **Status:** `held-for-design` ·
  **Owner:** the language-design chat
- **Source material:** `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/design/dogfooding-friction-log.md`
  (relocated 2026-07-25 from the book repo's gitignored `workbench/book-audit/`;
  the `fences.lykn` tool it came from is tracked in the book repo)
- **Replace this row** with real IDs once the discussion happens. Do not close it
  until they exist.

### `D-2608-XPRT` — inline exports plus `mod.lykn` exports need one coherent story

- **What:** CC's external-library dogfood project followed the current SKILL
  guidance and wrote exported definitions inline, e.g. `(export (func
  collect-valid-records ...))`. The operator rejected that as the long-term
  module style: Lykn modules should put their exports at the top, so the public
  API is visible before implementation bodies. A follow-up read of the same
  dogfood project found a second export list in `mod.lykn`:
  `(export "./record-shape.js" (names ...))`. The design task must explain
  whether definition-site exports plus entrypoint re-exports are both required,
  duplicated by accident, or intentionally separate concepts.
- **Where:** `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/design/dogfooding-friction-log.md`
  F-7 records the dogfood example and the desired top-of-module shape.
- **How found:** `operator` + `dogfooding` — CC's generated utility-library code
  exposed the current style in realistic module code.
- **Guess:** High for the book surface. This may be a large language/compiler
  change, but the decision must happen before arc16 writes the 0.6.0 book
  examples; otherwise the book will normalize a shape the operator does not want
  to teach and may accidentally teach two export declarations where one should
  be enough.
- **Kind:** `gap` · **Status:** `held-for-design`
- **Design question:** choose the top-of-module export syntax and semantics
  before the book pass. Candidate shape: `(exports name other-name predicate?)`
  followed by ordinary `(func ...)` / `(bind ...)` definitions. The final design
  needs to specify ordering, duplicate/missing export diagnostics, whether
  `mod.lykn` re-exports are a package-entrypoint layer or redundant with module
  export declarations, JS emitted names for predicates, and whether inline
  `(export (func ...))` remains accepted, deprecated, or rejected.
- **Routing:** arc16 must include this as a pre-draft language-surface decision.
  If the chosen syntax is not supported, route the compiler work to arc10 or a
  new 0.6.0 language-surface slice before arc16 closes. Do not close this row by
  rewriting examples around the current inline wrapper.
- **Active route:** arc16 slice04
  `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice04-language-surface-runway/`
  is open to land or explicitly defer this for 0.6.0.

### `D-2608-LBND` — repeated local binds need a grouped let-style binding surface

- **What:** CC's external-library dogfood project used several consecutive
  local `(bind name value)` forms to normalize one record. The operator rejected
  that as the only durable local-binding shape: when a module needs several
  derived locals, Lykn should support a grouped let-style binding surface.
- **Where:** `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/design/dogfooding-friction-log.md`
  F-8 records the example and candidate grouped form.
- **How found:** `operator` + `dogfooding` — realistic normalization code made
  the repeated-binding shape visible.
- **Guess:** High for the book surface. Validation, parsing, and normalization
  examples will hit this constantly; without a grouped form, the book either
  teaches verbose sibling binds or invents prose around a missing Lisp idiom.
- **Kind:** `gap` · **Status:** `held-for-design`
- **Design question:** choose the grouped local-binding syntax and semantics
  before the book pass. Candidate shape: `(bind name expr name2 expr2 ...)`, but
  the final design must settle simultaneous vs sequential binding, body
  placement, shadowing and duplicate-name diagnostics, whether this extends
  `bind` or introduces `let`/`let*`, and how it interacts with the existing
  "bind for all values" rule.
- **Routing:** arc16 must include this as a pre-draft language-surface decision.
  If the chosen syntax is not supported, route the compiler work to arc10 or a
  new 0.6.0 language-surface slice before arc16 closes. Do not close this row by
  telling authors to keep writing repeated sibling binds.
- **Active route:** arc16 slice04
  `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice04-language-surface-runway/`
  is open to land or explicitly defer this for 0.6.0.

### `D-2608-COND` — nested validation conditionals need a flatter branch surface

- **What:** CC's external-library dogfood project expressed ordered validation
  as deeply nested `?` forms: check one invalid case, return `ShapeErr`, else
  nest the next invalid case, and so on until the final `ShapeOk`. The operator
  flagged the deep repetition as a syntax smell: repeated nesting of the same
  branch form indicates the surface likely needs a flatter construct.
- **Where:** `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/design/dogfooding-friction-log.md`
  F-9 records the nested validation example and a candidate `cond`-style shape.
- **How found:** `operator` + `dogfooding` — realistic validation code exposed
  the readability cost.
- **Guess:** High for the book surface. Validation and parsing examples are core
  teaching material; nested `?` ladders are technically valid but too hard to
  scan as the default idiom.
- **Kind:** `gap` · **Status:** `held-for-design`
- **Design question:** choose the flatter branching syntax and semantics before
  the book pass. Candidate shape: `cond` with ordered predicate/result pairs and
  `:else`, but the final design must settle naming, required/default else
  behavior, expression vs statement positions, exhaustiveness diagnostics, and
  interaction with existing `?`, no-else `if`, and `match` guidance.
- **Routing:** arc16 must include this as a pre-draft language-surface decision.
  If the chosen syntax is not supported, route the compiler work to arc10 or a
  new 0.6.0 language-surface slice before arc16 closes. Do not close this row by
  teaching nested `?` ladders as the permanent validation idiom.
- **Active route:** arc16 slice04
  `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice04-language-surface-runway/`
  is open to land or explicitly defer this for 0.6.0.

### `D-2608-SOWN` — Lykn-owned generated manifests need a source ownership boundary

- **What:** CC's external-library dogfood project exposed that `lykn new`
  scaffolds a package-level `deno.json` beside `.lykn` source. The operator
  clarified the desired rule: user-owned project resources may include any file
  type, but files generated, configured, or owned by Lykn's build/publish
  pipeline should not be made to look like author-owned source. Generated JSON
  manifests and publish/build metadata need a generated home such as `target/`,
  `dist/`, or another explicitly generated artifact directory.
- **Where:** `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/design/dogfooding-friction-log.md`
  F-10 records the dogfood `deno.json` example and the clarified source-tree
  ownership rule.
- **How found:** `operator` + `dogfooding` — CC's fresh external project used
  the scaffolded package layout and made the source/package boundary visible.
- **Guess:** High for the book and for scaffolding. Existing docs and tool
  behavior still treat source package `deno.json` as package config and export
  metadata, while newer build/dist guidance says generated publish manifests are
  staged outside the source tree. The contradiction must be resolved before the
  book teaches project structure.
- **Kind:** `gap` · **Status:** `held-for-design`
- **Design question:** choose the source-tree ownership model for Lykn-built
  package artifacts before the book pass. The final design must distinguish
  user-owned non-Lykn source files from Lykn-owned generated/configured files,
  decide whether package metadata remains in source `deno.json`, moves to
  `project.json`, lives in a Lykn-native package manifest, or is generated from
  `.lykn` declarations, and specify how `lykn new`, `lykn build`, `lykn dist`,
  macro metadata, exports, and publish staging all interact.
- **Routing:** arc16 must include this as a pre-draft project-structure decision.
  If the chosen model changes current behavior, route implementation to the
  relevant scaffold/build/publish/docs slice before arc16 closes. Do not close
  this row by banning user-authored JSON/assets/resources from source trees.
- **Partial closure:** arc16 slice03 implemented the 0.6.0 floor: user-authored
  non-Lykn files remain allowed in source trees, generated build/test/dist output
  stays under `target/lykn/`, and runtime build/dist does not copy arbitrary
  non-Lykn package source. The broader package-metadata ownership model remains
  `held-for-design` before final book project-structure prose.

### `D-2608-BINW` — fresh projects lack the local `bin/lykn` guides expect

- **What:** arc16 slice02 used `lykn new` to create a scratch utility library.
  The generated project did not include a project-local `bin/lykn`, while the
  current guides, slice prompts, and standing release workflow prefer
  `./bin/lykn` so commands exercise the checked-out compiler rather than
  whatever is on `PATH`. CC had to add a scratch-only symlink before following
  the normal workflow.
- **Where:** `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice02-dogfood-implementation-runway/closing-report.md`
  records the failed `./bin/lykn --version` probe and scratch symlink fix.
- **How found:** `dogfooding` — fresh scaffold run through the current
  SKILL/guides.
- **Guess:** Medium-high for DevX and guide truth. New users will hit the first
  command in the guides and either fail, use a global binary, or drift away from
  release-branch reproducibility.
- **Kind:** `gap` · **Status:** `closed` →
  `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice03-cli-scaffold-package-runway/closing-report.md`
- **Routing:** arc16's next implementation-routing slice must decide whether
  `lykn new` creates a project-local shim or whether the guides/prompts change
  their default command shape. Do not let book examples assume `./bin/lykn`
  unless the scaffold makes that true.
- **Closure:** arc16 slice03 made `lykn new` create project-local `bin/lykn`,
  updated scaffolded commands to `./bin/lykn`, and added fresh-scaffold
  regression coverage. CDC reproduced the scratch workflow in
  `slice03-cli-scaffold-package-runway/cdc-verification.md`.

### `D-2608-TDSL` — scaffolded Lykn tests cannot load the testing macros

- **What:** The scratch project's scaffold-style Lykn tests failed before any
  assertions ran: the macro module `jsr:@lykn/testing` had no
  `lykn.macroEntry` field and no `mod.lykn` fallback. CC switched to JS tests to
  finish the project, so the scaffold's advertised Lykn testing route was not
  usable in the fresh-project path.
- **Where:** `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice02-dogfood-implementation-runway/closing-report.md`
  records the failed test command and the JS-test workaround.
- **How found:** `dogfooding` — using the scaffold's normal test shape in a
  fresh project.
- **Guess:** High for teaching and package readiness. A testing DSL that is
  present in guidance but cannot expand in a new project will push the book
  toward JavaScript tests or manual demos, which hides a 0.6.0 tooling defect.
- **Kind:** `bug` · **Status:** `closed` →
  `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice03-cli-scaffold-package-runway/closing-report.md`
- **Routing:** route through arc16's implementation runway or the package/testing
  owner before book chapter work. Either make the macro package resolvable from
  scaffolded Lykn tests, or change the scaffold/guides so their first-class test
  path is the one that actually runs.
- **Closure:** arc16 slice03 switched scaffolded tests to the bare `testing`
  import, added `lykn.macroEntry` metadata to `packages/testing/deno.json`, and
  uses a gitignored `project.local.json` overlay for source-checkout dogfood.
  CDC reproduced fresh scaffold `./bin/lykn test` and targeted testing-DSL
  gates in `slice03-cli-scaffold-package-runway/cdc-verification.md`.

### `D-2608-BREC` — `lykn build` skips nested package source directories

- **What:** The scratch package originally placed a helper module under a nested
  package source directory. `lykn build` succeeded but did not emit the nested
  helper, so the JS test path failed looking for the built helper module. CC had
  to flatten the helper into the package root to get a working build.
- **Where:** `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice02-dogfood-implementation-runway/closing-report.md`
  records the missing built helper and the flattening workaround.
- **How found:** `dogfooding` — realistic package organization in a fresh
  utility library.
- **Guess:** High for package structure. Nested modules are a normal library
  shape; silently skipping them creates a green build with missing runtime
  files, exactly the kind of output-quality defect arc16 should catch before the
  book teaches package layout.
- **Kind:** `bug` · **Status:** `closed` →
  `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice03-cli-scaffold-package-runway/closing-report.md`
- **Routing:** arc16's implementation-routing slice must either make `lykn build`
  recurse into package source directories or document and enforce a flat-package
  rule with an explicit diagnostic. Do not teach nested helper modules as
  supported until the build owns them.
- **Closure:** arc16 slice03 made build/dist traversal recursive for `.lykn`,
  `.lyk`, and handwritten `.js` package source while preserving relative paths.
  CDC reproduced nested helper emission and the Rust regression in
  `slice03-cli-scaffold-package-runway/cdc-verification.md`.

### `D-2608-RIMP` — source-file `lykn run` resolves relative imports from temp output

- **What:** Running the scratch project's source entrypoint with `./bin/lykn run`
  compiled it to a temporary file, then resolved `./mod.js` relative to the temp
  directory rather than the source file/package directory. The built-JS
  entrypoint ran successfully, so this is a source-run import-resolution
  problem, not an application failure.
- **Where:** `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice02-dogfood-implementation-runway/closing-report.md`
  records the failed source run and successful built-JS demo.
- **How found:** `dogfooding` — running a fresh package demo through the current
  CLI workflow.
- **Guess:** High for examples and debugging. `lykn run packages/.../main.lykn`
  is the natural command to teach during development; if it only works for
  import-free files, the book needs either an implementation fix or a deliberately
  narrower command story.
- **Kind:** `bug` · **Status:** `closed` →
  `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice03-cli-scaffold-package-runway/closing-report.md`
- **Routing:** arc16's implementation-routing slice should choose between fixing
  source-run relative import resolution and steering all package demos through
  `lykn build` plus built entrypoints. Do not let book examples imply the source
  command works for package modules until this is settled.
- **Closure:** arc16 slice03 routes workspace source-file `lykn run` through the
  generated package build output so relative imports resolve beside nested
  helpers. CDC reproduced source and built entrypoint runs in
  `slice03-cli-scaffold-package-runway/cdc-verification.md`.

---

## Language & docs

### `D-2607-N8RP` — surface `try` cannot produce a value; SKILL teaches kernel-only

- **What:** DD-57's W-2 (position-aware `try`, D-2.γ, approved 2026-05-14) never
  shipped. `"try"` is still in `STATEMENT_FORM_HEADS`
  (`crates/lykn-lang/src/emitter/forms.rs:2583`); `is_valueless_last_expr`
  (`:445-455`) special-cases only `if` and the control transfers.
  `assets/ai/SKILL.md` still teaches try as kernel-statement-only.
- **How found:** `dogfooding` + `audit` · **Guess:** High — error handling has no
  expression-position spelling, so it can't live in pipelines.
- **Kind:** `blocker` · **Status:** `routed` → operator decided 2026-07-24 to
  **ship W-2 in 0.6.0**; new gating arc + DD-57 W-4a/b/c doc updates.

### `D-2607-8QVL` — DD-18's `->>` example documents the wrong expansion, and it is `final`

- **What:** `project01-mvp/arc03-surface-language/artifacts/design/06-final/0023-dd-18-threading-macros-and-conditional-binding.md`,
  §`->>` thread-last, states that `(->> items (filter even?) (map double) (take 5))`
  compiles to `take(map(filter(items, even?), double), 5)`. That is the
  **thread-first** nesting. Both compilers produce
  `take(5, map(double, filter(isEven, items)))`. The DD's stated *kernel
  expansion*, `(take (map (filter items even?) double) 5)`, is wrong the same way.
  **The code is correct; the DD is wrong.**
- **Where:** `docs/design/06-final/0023-dd-18-…md`, §`->>` thread-last — the
  Syntax JS block and the kernel-expansion block.
- **How found:** `audit`, confirmed by **executing both compilers**
  (`project03-language-evolution/slice03-threading-macros/data/parity-transcript.txt`, case 1).
- **Guess:** High. `final`-state DD, normative description of the macro, and it
  teaches the reader that `->>` does what `->` does — the exact confusion
  `D-2607-V8DM` records spreading informally.
- **Kind:** `trap` · **Status:** `open`
- **Note:** `D-2607-3VXM`'s shape one level up. There, tests asserted a shape
  nobody executed; here the *specification* did.

### `D-2607-3KTP` — `as->` does not exist and fails silently

- **What:** `(as-> x $ (f $ 1) (g 2 $))` compiles clean, no diagnostic, to
  `asTo(x, $, f($, 1), g(2, $));` — a call to an undefined `asTo` plus an
  undefined `$`. `ReferenceError` at runtime. Identical in both compilers.
  `asTo` comes from the `->` → `To` rule at `compiler.js:405`
  (`MULTI_CHAR_ESCAPES`) rewriting an unrecognised head.
- **Where:** `packages/lang/classifier.js` — registered threading heads are
  `->`, `->>`, `some->`, `some->>`; no `as->`. Same set on the Rust side.
- **How found:** `audit` — probing the threading surface during
  `03-threading-macros`.
- **Guess:** Medium-high. Strictly an instance of `D-2607-P4WQ`'s class, but a
  **high-traffic** one: `as->` is the third threading macro a Clojure user
  reaches for, and the guides teach the other four.
- **Kind:** `gap` · **Status:** `routed` → `project03-language-evolution/BACKLOG.md` §A7
- **Why it matters beyond the missing macro:** the survey found `as->` is the
  *general* form — one macro covers datum-last, datum-**middle**, and
  operator-receiver, including the datum-in-the-middle shape that has **no**
  spelling in lykn today (`Reflect.set(target, key, V)` threading `V`; the six
  `SubtleCrypto` datum-middle signatures). A dedicated `->>` serves two ES2025
  built-ins; `as->` serves all the residue.

### `D-2607-W4RC` — `->` and `->>` are byte-identical across 85% of the ES surface

- **What:** DD-18.1's keyword-step rule fires *before* the position check in
  **both** compilers, so a `(:method args)` step threads the receiver regardless
  of macro. With unary functions (first and last coincide), **417 of 489 ES2025
  built-ins cannot distinguish the two macros.**
- **How found:** `audit` + execution — `03-threading-macros` R-2, R-6, R-11.
- **Guess:** Medium as a defect (it is correct behaviour), **high as a docs
  finding.** A reader arriving from Clojure assumes the choice is meaningful
  everywhere; it is meaningful in 48 of 489 core cases and 71 of 214 host cases.
- **Kind:** `gap` · **Status:** `open` → arc07 (guides) / book
- **Suggested:** say it outright in the threading guide — *"for method steps the
  two macros are the same; the choice only matters for free and namespaced
  functions"* — and give the rule for picking.

### `D-2607-5MJC` — record types and multi-field constructor layout undocumented

- **What:** Every `type` example is a sum type. Declaring a plain record is never
  shown, and **the field layout of a multi-field constructor is never shown** —
  the SKILL documents `(Some v)` → `{tag, value}` and stops.
- **How found:** `dogfooding` — could not determine whether `s:blocks` reads a
  constructor field. **Guess:** High for anyone modelling data.
- **Kind:** `gap` · **Status:** `open` → arc07 + book
- **Suggested:** one worked record example *including the compiled JS*. Records
  before sum types is also the friendlier teaching order for the book.

### `D-2607-T2FB` — no examples of JS method names needing lisp-case conversion

- **What:** Every method-call example in the guides is single-word, so
  `str.startsWith` → `(:starts-with)` has to be trusted rather than seen.
- **How found:** `dogfooding` · **Guess:** Low-medium · **Kind:** `gap` ·
  **Status:** `open` → arc07

### `D-2607-4WGT` — a swallowed validation error hides the local compiler's message

- **What:** `compile_lykn_test_files` swallows the Rust validation error, so the
  local binary's (now good) macro-resolution diagnostic never reaches the
  operator on the `lykn test` path — even when the local compiler produces it.
- **How found:** `cc-implementation` — CC found it while fixing `D-2607-7RQD` and
  routed it rather than expanding scope into `cmd_test` control-flow.
- **Guess:** Medium. Close cousin of the green-means-nothing family: a real error
  exists and is discarded before anyone sees it.
- **Kind:** `gap` · **Status:** `open` — routed as a follow-up to
  `01-macro-entry-diagnostics`

### `D-2607-9PLC` — `lykn add`'s resolve failure leaks deno's crash into a user-facing error

- **What:** A 404 on `lykn add` prints the lykn wrapper *and* the raw deno crash:

  ```
  error: could not resolve @std/does-not-exist-xyz: error: Uncaught (in promise) Error: registry returned 404 ...
      at file:///private/tmp/.../$deno$eval.js:1:93
  ```

  `Uncaught (in promise)` and a `$deno$eval.js:1:93` frame — a generated script the
  user cannot act on — are concatenated into what should be a clean CLI error.
- **Where:** the `lykn add` resolve path (deno-eval driver), `crates/lykn-cli/src/add.rs`
  + `main.rs`.
- **How found:** `downstream-friction` — operator running arc06 runsheet Part A6.
- **Guess:** Medium. **Same root as `01-macro-entry-diagnostics` M-5, different
  call site** — that fix caught the compile-driver; this path still leaks. Compare
  the bar set two rows over in the same runsheet: *"run 'lykn build' in <path>
  first"*.
- **Kind:** `gap` · **Status:** `open`
- **Note:** the ledger row **passed** — the runsheet expected "registry returned
  404, rc=1" and that is what happened, with `project.json` correctly unchanged.
  The *behaviour* is right; the *diagnostic* is below the bar. Worth a sweep for
  other deno-eval call sites rather than a third one-off fix.

### `D-2607-Q3TV` — `lykn link` behaves differently for a package name than a specifier

- **What:** `lykn link <package-name>` writes **two** overlay entries — the exact
  key → the entry *file*, the slash key → the *directory*:

  ```
  localdep  = /tmp/.../target/lykn/build/localdep/mod.js
  localdep/ = /tmp/.../target/lykn/build/localdep/
  ```

  `lykn link <jsr:/npm: specifier>` writes **one**, directory-valued
  (`cmd_link_specifier`: `let entries = [(specifier.to_string(), val)]` with a
  trailing slash forced). That single-entry shape is exactly why a *runtime*
  import of a linked specifier doesn't resolve.
- **How found:** `downstream-friction` — visible in the operator's Part B output.
- **Guess:** Low-medium as a defect; **high as an estimate correction.** The routed
  0.7.0 "full runtime override" item is **not new design** — it is bringing the
  specifier path to parity with the package-name path, which already does the
  right thing. Re-estimate accordingly.
- **Kind:** `gap` · **Status:** `routed` → 0.7.x BACKLOG (row 3, sharpened
  2026-07-24). Related: `D-2607-Z5KN`'s theme, one scale down — *two sibling code
  paths in one command drifted, and nothing compared them.*

---

## Guides (arc07)

### `D-2608-W2HF` — no-else `if` in expression position emits invalid JS at rc=0

- **What:** `docs/guides/00-lykn-surface-forms.md:797-802` says a no-else `if`
  in expression position is a compile error. Today `lykn check` and
  `lykn compile` return success for `(bind label (if (> 1 0) "items"))`, while
  compile emits invalid JavaScript: `const label = throw new TypeError(...)`.
  `lykn run` fails only later when Deno parses the generated JS.
- **How found:** arc07 slice02 current-drift recon; CDC reproduced during
  `project02-language-toolchain-alignment/arc07-docs/slice02-current-drift-recon/cdc-verification.md`.
- **Guess:** High. This is the same "rc=0 but generated JS is invalid" class the
  release has been killing before broader documentation/book work builds on the
  final surface semantics.
- **Kind:** `bug` · **Status:** `routed` →
  `project02-language-toolchain-alignment/arc10-compiler-completion/slice04-no-else-if-expression-error/slice-plan.md`
  before arc07/arc16 teach the no-else expression case as settled.

### `D-2607-6BQX` — `lykn publish`'s dirty-check gate is shipped and undocumented
Originally found: `main.rs` enforced the dirty-tree gate and exposed
`--allow-dirty`, but the guides did not document either surface. `audit` ·
Medium · `gap` · `closed` → arc07

**Closed 2026-08-08 in arc07 slice03.** Guide 15 now documents the dirty-tree
gate, `--allow-dirty`, and `--no-build`; guide 12-04 points readers at that
workflow. Verification: `./bin/lykn publish --help` exposes `--allow-dirty` and
the `target/lykn/dist/` `--no-build` assumption; docs gates passed at slice
close.

### `D-2607-J3HV` — `.d.ts` generation is shipped and near-invisible
`emitter/dts.rs` ships; the guides mention `.d.ts` once, generically, at
`05-type-discipline.md:529`. `audit` · High (flagship capability, undiscoverable)
· `gap` · `open` → arc07

### `D-2607-V5DK` — the guides teach a deprecated command and contradict themselves
Originally found: `16-testing.md` used `target/lykn/*` as present tense while
guide 15 and guide 10 still taught `lykn build --dist` / repo-root `dist/`;
the CLI also printed "Did `lykn build --dist` complete successfully?" in a
user-facing publish error. `audit` · Medium · `trap` · `closed` → arc07

**Closed 2026-08-08 in arc07 slice03.** SKILL, guides 10/12-04/15, and the
publish error string now use `lykn dist` and `target/lykn/{build,dist}` as the
current workflow, with `lykn build --dist` retained only as a deprecated alias
where useful.

### `D-2607-Y9GS` — the `compileBoth` guide row is superseded, not outstanding
`main.rs:52-62` documents the flags as harness-only, *explicitly not for
authoring*; doing the row would manufacture new drift. Must be closed as
**superseded**, not silently dropped. `audit` · Low · `polish` · `open` → arc07

### `D-2607-2FHM` — legacy repo-root `dist/` is stale debris that corroborates a stale doc
Originally found: legacy root `dist/{lang,testing,browser}` debris could
corroborate stale docs even though publish reads `target/lykn/dist/`.
`audit` · Low · `trap` · `no-op` → arc07, same root as `D-2607-V5DK`
*(Correction: this was first logged as an arc09 publish precondition. That framing
was wrong — see the bootstrap's "a consequence is a claim about a path you have
not walked.")*

**Closed 2026-08-08 as no-op in arc07 slice03.** `git ls-files dist` returned
empty output and `test ! -e dist` passed in the slice worktree, so there was no
tracked or filesystem root `dist/` debris to delete. The stale guide corroborator
was removed by the guide refresh.

---

## Book (arc16)

Book *findings* live here — they are facts about the language and its docs.
Chapter rewrites live in the book repo.

### `D-2607-R4NW` — `lykn test --docs` could not see any of the book — **CLOSED (route implemented)**
`extract_blocks` formerly matched only ` ```lykn ` and
` ```lykn,<annotation> `. The book authors in ` ```lisp `. Census: **444
`lisp`, 170 `javascript`, 3 `lykn`** — and the only three default-visible
blocks are in `part6/chapter29/6-markdown-testing.md`, the chapter that
*teaches the doctest feature*. `audit` · High (hard prerequisite for any book
compile pass) · `blocker` · **Status:** `closed`
*Disposition: arc16 slice06 implemented the opt-in, repeatable route
`lykn test --docs PATH --fence TAG`. With no `--fence`, Markdown doctests still
extract only `lykn` fences. From the book repo, the current gate is
`/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn test --docs src --fence lisp`.
The first slice06 run generated 176 doctest files from 444 `lisp` blocks and
reached Deno execution (`417 passed / 27 failed`); the mixed run with
`--fence lisp --fence lykn` generated 177 files from 447 blocks (`420 passed /
27 failed`). Remaining book example failures re-enter through arc16 slice07
`current-book-drift-refresh` or new Discovery rows if triage proves an
implementation/tooling defect.*

### `D-2607-C7LZ` — Chapter 9.1 states something now simply false
*"Lykn's `if` is a kernel form that maps directly to JavaScript's `if`
statement."* Post-DD-50, surface `if` is position-aware.
`src/part2/chapter9/1-conditionals.md:3`. Flagged by DD-57 §1.4.3 on 2026-05-14;
unchanged since. `audit` · High (foundational chapter, known 14 months) · `trap`
· `open`

### `D-2607-F6PA` — six book sites use `try` as an expression and will not compile
`part3/chapter17/4-error-handling.md:11,47`; `part5/chapter25/2-json.md:26`;
`part6/chapter27/5-fetch.md:35`; `part8/chapter37/5-routes.md:29`;
`part8/chapter38/3-api.md:11,24`. The book teaches the idiomatic error pattern
using a form that does not compile. `audit` · High · **Status:** `routed` →
resolved when W-2 ships (`D-2607-N8RP`).

### `D-2607-M2XE` — Chapter 9.5 contradicts five later chapters
*"`throw`, `try`, `catch`, `finally` are kernel forms with no surface
transformation"* — currently accurate, contradicted by every chapter in
`D-2607-F6PA`. `src/part2/chapter9/5-exceptions.md:3`. `audit` · Medium-high ·
`trap` · **Status:** `routed` → DD-57 W-4a, after W-2.


### `D-2609-FNRT` — JS compiler rejects `func` returning `fn` that the Rust CLI accepts
The current book fence gate exposes three closure examples where a `func` with
`:returns :function` ends with an `fn` expression. The generated doctest path
uses the JS compiler and fails with `body ends with fn (a statement-only form
which cannot produce a value)`. A focused Rust CLI probe on the same shape using
`/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn check` and `lykn
compile` succeeds and emits a return-checked closure. Current guides also teach
`fn` as a value-producing anonymous function. `probe` . High . `bug` .
**Status:** `closed` ->
`project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice08-js-fn-return-parity/closing-report.md`.
Source fix: release/0.6.x commit `8c66469`; JS now accepts direct `fn`/`lambda`
returns under `:returns :function`, with cross-compiler regression coverage.


### `D-2609-FOVL` — JS API doctest path does not compile-reject overlapping `func` clauses
The slice10 book pass rechecked `src/part2/chapter8/4-overlap.md` after marking
intentional overlap examples as `lisp,compile-fail`. The doctest-generated JS
API path did not throw at compile time; under the release config,
`packages/lang/mod.js` emits two compatible clause checks followed by a
fall-through `TypeError`. The CLI compile path using
`/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn compile` rejects the
same examples with `clauses 0 and 1 overlap (same arity 1, compatible types)`.
The book chapter now skips those examples with an explicit note rather than
normalizing the defect. `probe` . High . `bug` . **Status:** `routed` ->
`project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice11-js-overlap-compile-parity/`.

---

## Closed

Kept for trending. `cdc-review` is a "how found" category and must stay
countable against the others.

### `D-2607-D3NL` — the committed corpus cites an ignored tree 353 times, and 40% of it is already gone — **CLOSED (accepted, not repaired)**

> **WHY `workbench/` LOOKS LIKE A LOSS AND MOSTLY ISN'T — operator, 2026-07-25.**
> Read this before the disposition; it is the premise the original row was
> written without. **`workbench/` was designed from the start to hold ephemeral,
> non-code content.** As the project-management methodology matured, work began
> there on the assumption that these artifacts would not live in the codebase
> permanently and that **git history was itself the sufficient record of
> change** — the artifacts captured the *how*. What changed is that the *why*
> turned out to be of interest to others, so the project started tracking it,
> and **the important material did make it into the repo** via `project01-mvp/artifacts/design-index.md/`
> and `docs/dev/` through the `odm` tool. A pruned subset resting there is the
> intended end state, not a shortfall.
>
> **This row was therefore written with an unchecked premise** — that the
> material was *meant* to be permanent — and its severity framing ("the evidence
> base is unrecoverable") inflated accordingly. The counts were right; the
> significance was not. Corrected here rather than quietly softened.
>
> **DISPOSITION — operator, 2026-07-25: option (a), accept and mark.** The 57
> dead paths and the documents citing them are *purely historical*; the evidence
> is not being salvaged and the citations are not being repointed. This is a
> CAP-style accept-with-rationale closure, **not a repair** — the underlying
> condition persists by design, and the title above is left intact so nobody
> reads this row as fixed.
>
> **What that costs, stated plainly:** pre-0.6.0 closing reports whose evidence
> links are dead can be *trusted* but not *re-verified*. They are `asserted`-tier
> permanently. 0.6.0's own tree is unaffected — it is tracked and healthy.
>
> **The one live consequence, routed to a home that exists:** the L-7 gate must
> not fail on this accepted class. Design handed to CC at
> `docs/design-v0.6.0/02-artifact-homes/{ledger.md,cc-prompt.md}` — a **frozen
> census allowlist**, generated once from today's 143 paths × 106 files and
> never appended to. That is what makes the exemption self-closing: a *new*
> `workbench/` citation is absent from the snapshot and therefore fails, which
> is exactly what `AGENTS.md`'s "nothing durable, nothing cited" rule requires.
> Same prefix, opposite verdicts, decided by age rather than by judgement.
>
> **AMENDED same day — the freeze covers `workbench/` only.** The operator
> narrowed it once CC's census showed the corpus is **631 pairs, 306
> `workbench/` : 325 other**: *any citation whose target migrated to a tracked
> location should be **updated**, unless updating it would damage the accuracy
> of the historical record.* So `crates/design/…` → `docs/design/…` and the
> migrated `test/` paths get **repointed**, not frozen; `assets/ai/*` (gitignored
> symlink) and the `workbench/` half stay frozen because they can never resolve.
> The carve-out: repoint a *reference to* an artifact; never rewrite a sentence
> that *narrates the move itself*. Full classification in
> `project02-language-toolchain-alignment/arc16.1-artifact-homes/slice01-artifact-homes/ledger.md`, amendment (4).
>
> **And four cited files are not lost at all** — they are cited at a
> destination inside the tracked planning tree while still sitting in
> `workbench/`: the arc01 build-dir kickoff thread and three arc03 compiler-
> coherence documents. A committed document already decided where each belongs
> and nobody executed the move. Those are migrations to finally perform, not
> citations to freeze. See amendment (4).

- **What:** A sweep of 507 tracked documents found **106 of them citing 143
  distinct `workbench/…` paths across 353 citation sites**. `workbench/` is
  gitignored (`.gitignore:10`), so none of those targets is in git. **57 of the
  143 no longer exist on the operator's disk at all** — closing reports, CDC
  reviews, DD drafts, and verification transcripts (`workbench/verify/m11-m13/
  baseline.txt`, `workbench/M2-guide-drift-inventory.md` ×10 sites,
  `workbench/phase-2-plan.md` ×9). The evidence base those documents rest on is
  unrecoverable from this machine.
- **Where:** repo-wide. Sweep script to be landed as the `02-artifact-homes`
  L-7 gate; census reproducible from it.
- **How found:** `audit` — a verification pass on the register's own relocation,
  which was scoped as a five-document problem and turned out to be a
  106-document one.
- **Guess:** High. Not for the current work — 0.6.0's own planning tree is
  tracked and healthy — but for **provenance**: a closing report whose evidence
  link is dead cannot be re-verified, only trusted. That is precisely the
  `asserted` tier the ledger discipline exists to escape.
- **Kind:** `systemic` · **Status:** `open` · **Parent:** `D-2607-Z5KN`
- **Sub-finding:** several cites are **literal unfilled placeholders** committed
  as-is — `workbench/YYYY-MM-DD-DD-50.7-closing-report.md`,
  `workbench/2026-05-XX-DD-53-closing-report.md`,
  `workbench/2026-MM-DD-M11-M13-closing-report.md`. Those never pointed at
  anything; the template was committed with the slot unfilled.
- **Confidence note:** the `workbench/`-prefixed count is reliable (the prefix is
  unambiguous). A *general* dangling-path sweep over the same corpus returned
  ~436 distinct unresolved paths, but that number is **not** trustworthy — most
  are shorthand fragments (`ast/sexpr.rs` for
  `crates/lykn-lang/src/ast/sexpr.rs`), pre-restructure historical paths
  (`src/surface.js`), or deliberately out-of-repo (`assets/ai/…`, a gitignored
  symlink). **Designing the extractor to tell those four classes apart is the
  hard half of the `02-artifact-homes` L-7 row**, not the checking.
- **Disposition owed:** this is a large, mostly-historical corpus. The realistic
  options are (a) accept-and-mark historical documents as citing dead evidence,
  (b) salvage the 86 paths still on disk into a tracked `docs/archive/`, or
  (c) both, scoped by document age. **Operator call — do not decide by
  implementation.**


### `D-2607-H4TC` — `lykn link` could silently apply nothing — **CLOSED**
The overlay-insertion loop sat inside `if let Some(imports) = …`, so with no
`imports` key in `project.json` no override was written — yet the effective
config was still written, `workspace` still stripped, and `lykn link` printed
`✓ linked`. `config.rs:301-310` (introduced `58e22e8`). `cdc-review` · High ·
`blocker` · **closed** by slice07 iteration 1 (`72a1cfd`) — hoisted, plus four
table tests and a malformed-`imports` warn-and-fall-back. **Parent:** `D-2607-Z5KN`

### `D-2607-B8SY` — a test named for a guard asserted the opposite case — **CLOSED**
`test_resolve_specifier_scheme_target_override_is_not_taken` inserted a
*non*-scheme target and asserted Tier 0 fires — a duplicate of the positive case.
The advertised "never reroute registry→registry" guard had no coverage.
`cdc-review` · Medium · `gap` · **closed** by slice07 iteration 1 — renamed, plus
a direct network-free `test_is_scheme_specifier`. **Parent:** `D-2607-Z5KN`

### `D-2607-7RQD` — a confidently wrong hint for a missing macro directory — **CLOSED**
Neither compiler checked whether `pkg_dir` existed before walking the candidate
chain, so a *missing directory* produced "no macro entry found" plus *"add
`lykn.macroEntry` to the package's `deno.json`"* — instructing the user to edit a
file inside a directory that isn't there. **Well-formed but wrong is worse than
terse.** Found by the operator running arc06's runsheet Part C-bis.
`downstream-friction` · High · `trap` · **closed** by `01-macro-entry-diagnostics`
(`41cf05a`) — distinct message, overlay provenance, and a drift-detecting parity
test. **Parent:** `D-2607-Z5KN` · **Spawned:** `D-2607-4WGT`
*Residual: the end-to-end demo is deferred until 0.6.0 publishes (mycelium's
`lykn test` pins published `@lykn/lang@0.5.2`, whose JS compiler predates the fix).*

---

## Trending (recompute at each triage pass)

| How found | Entries | Of which `trap`/`blocker` | Systemic |
|---|---|---|---|
| `dogfooding` | 6 | 2 | 2 |
| `audit` | 14 | 7 | 2 |
| `cdc-review` | 3 | 1 | 1 |
| `cc-implementation` | 1 | 0 | 0 |
| **`downstream-friction`** | **3** | **1** | **0** |
| **`operator`** | **1** | **0** | **1** |
| **Total** | **28** | **11** | **6** |

*Recomputed 2026-07-25 (+6 from `03-threading-macros`). **`operator` is a new
category**: `D-2607-V8DM` was found by the operator noticing that three accounts
of one feature disagreed — not by audit, dogfooding, review, implementation, or
downstream friction. That is a distinct discovery surface, and it went 1-for-1
on a systemic finding. Same reasoning that made `downstream-friction` worth
separating.*

**Early read (one session — do not over-fit).** `dogfooding` has the highest
severity-per-entry: six entries from writing *one module of one program*, two of
them traps, and **both** of the non-process systemic findings. `audit` produced
more entries but skews toward coverage gaps rather than things actively wrong.
**`downstream-friction` is 3-for-3.** Every time the operator has actually *run*
the toolchain against a real project, it produced a finding: the misleading macro
hint (`D-2607-7RQD`, a trap), the `lykn add` crash leak (`D-2607-9PLC`), and the
link/link-specifier behavioural drift (`D-2607-Q3TV`, which also corrected a
0.7.0 estimate). Three for three on one runsheet.

**This is the strongest signal in the register.** arc06 also produced two
unplanned *slices* (06 and 07) from the same runsheet pass. That is five distinct
pieces of work discovered by one operator sitting down and running the thing —
which is why the arc's closing report records host reconcile as a **discovery
surface, not a formality**, and why future arcs should budget for it rather than
treating it as a checkbox at the end.

If that holds across the next fifty, the conclusion is uncomfortable and useful:
**writing and running real programs in lykn finds more than reading lykn does.**
That would argue the book pass should be structured as *building things while
writing about them*, and that runsheets are a discovery surface rather than a
formality — which arc06 already demonstrated twice, since both slice06 and
slice07 originated in one.
