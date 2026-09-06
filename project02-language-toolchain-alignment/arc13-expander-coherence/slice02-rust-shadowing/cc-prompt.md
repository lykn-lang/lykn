# CC Prompt — arc13 / slice02 · rust-shadowing

**From:** CDC (Cowork) · **To:** CC (Claude Code, host) · **Date:** 2026-07-06
**Branch:** `release/0.6.x` (fresh branch or worktree — Duncan's call; git host-side).
**Re:** Implement **DD-60 on the Rust backend**. The operator confirmed the
DD **in full** (D1 whole-scope lexical shadowing incl. user macros; D2
empirical reserved-word validation **including `export`ed names and the
`kernel:` escape's name slot**; D3 DD-58 untouched). Your matrix's Rust
columns are the acceptance spec — every cell has a target, and the
re-probe is the proof. (Also: commit your slice01 artifacts — `tools/` +
`arc13/design/dd-60…` — first if not yet done; single source commit.)

## 0. Read first

- `…/slice02-rust-shadowing/ledger.md` (5 rows) and `slice-doc.md`.
- **DD-60** (`arc13/design/dd-60-name-binding-semantics.md`) — now
  confirmed; the per-cell target table is the contract.
- Your own slice01 F-3 recon (the mechanism sketch) and the matrix
  baseline output (F-4 diffs against it).

## 1. The work (MUST)

1. **F-1 — scope-threaded dispatch (D1).** Bindings shadow macro/form/
   user-macro dispatch, whole-scope. Binding introducers = DD-60's list
   (params of `func`/`fn`/`genfunc`/`genfn`, `bind`, destructuring
   patterns, loop bindings, class-method params). Mechanism is your call
   (classifier-threaded environment vs a pre-pass annotation — state the
   rationale); hard constraint: **user-macro expansion consults the same
   environment** (a bound name shadows an `import-macros` macro
   identically). The wrong-code rows (`cell`/`express`/`get`/`not`/
   `lambda`/`template`/`new`) and the shape-coincidence rows (`fn`/`func`/
   `obj`) all become `calls-binding` — deliberately.
2. **F-2 — reserved-word validation (D2).** Every binding position +
   `export` + the `kernel:` name slot ("validity is not a macro concern" —
   operator-confirmed). Follow your `check_loop_binding` guard pattern.
   Diagnostics name the word and the fix (align with DD-58's voice; e.g.
   `'if' is a JavaScript reserved word and cannot be used as a lykn name`).
   Placement of the `kernel:` check (escape-resolution vs emission) — pick
   for the better span, say why.
3. **F-3 — parity-check the list.** The embedded reserved-word list is
   tested against the probe's empirical legality function
   (`tools/conformance-matrix.js`) — drift fails `make check`.
   Demonstrate with a seeded drift, then restore. (The A-7
   kernel-forms-parity precedent, applied to names.)
4. **F-4 — re-probe the matrix.** All Rust columns at DD-60 target; **JS
   columns byte-identical to the slice01 baseline** — if JS moves, this
   slice leaked into slice03; stop and surface.

## 2. Verify (rebuild-first, all green)

`make check` ✓; suites **at baseline** (≥1368/0 · ≥673/0 · doctests green)
— DD-60's breaking analysis says nothing in-tree changes meaning, and the
suites are that claim's proof: **any regression = a breaking-analysis
miss; surface it immediately, don't patch around it.** Per-cell tests for
each flipped row class; diagnostics snapshots reviewed, never
auto-accepted; `./bin/lykn` everywhere.

## 3. Discipline

- Expander/classifier core: the five-iteration cap and
  **self-stop-on-scope-explosion** both apply — if scope-threading wants
  an architecture change beyond the recon sketch, stop with data.
- **Ambiguous DD-60 cells are surfaced, not reinterpreted** — the DD is
  operator-confirmed; drift in its meaning is a plan change, not an
  implementation detail.
- No JS-backend changes (slice03). No DD-58 changes (D3). No arc05 work.
- Leave `docs/design-v0.6.0/**` to CDC except your closing report
  (untracked, staging convention). Source only.

## 4. Close

`closing-report.md`: per-row walk (5 rows) + the re-probe transcript/diff
+ mechanism rationale + design-call answers + a **bubble-up to arc13**:
mechanism notes slice03's JS work should inherit; shared test shapes; any
cell ambiguity. → CDC verification → slice03 (js-shadowing + the
permanent conformance corpus) closes the arc — then **arc05 resumes** and
the ID-42 question gets its post-fix answer (arc13 A-6).
