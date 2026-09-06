# Slice 04: walker-extension (+3 binding positions) — Closing Report

**By:** CC (Claude Code) · **Date:** 2026-07-06 · **Branch:** `release/0.6.x`
**Verdict: delivered — and it surfaced a further finding (held out, not folded).**
Both walkers now cover the DD-60 refinement's three positions
(`if-let`/`when-let` binding patterns, `match` clause patterns); D2 rejects
reserved words there on both backends (the slice03 `(if-let (if x) …)` leak is
closed); the matrix probe gained the three positions and the re-probe shows
**only** the new positions' D2 rows as rejects-cleanly with every pre-existing
cell byte-identical. `make check` green; suites 1391/0. **But probing for a
"fourth" missed position (the discipline clause) found three more — `catch`,
`import` local names, and `label` names — surfaced below, not folded.**

## Per-row walk (4 rows)

**F-1 — walkers cover the 3 positions — MET.** Via the existing hook points, no
parallel enumeration:
- **Rust** (`binding.rs`): `if-let`/`when-let`/`match` arms in
  `bindings_introduced`, reusing `classify_expr` → the typed `Pattern`, with a
  `collect_pattern` recursion (Binding names bind; Constructor/Obj sub-patterns
  recurse; Wildcard/Literal — incl. `true`/`false`/`null` — bind nothing). New
  `BindingKind::Pattern`. 4 unit tests (18 total).
- **JS** (`binding.js`): the same, `matchPatternNames` mirroring the Rust
  `classify_pattern` grammar (`_`/literals/PascalCase bind nothing; lowercase
  binds; constructor/`obj` recurse).
- **Shared parity fixtures extended** (`binding-walker-parity.test.js`, 16 → 20):
  a reserved word in each new position rejected by both; a `match` literal clause
  (`(match v (true 1) …)`) accepted by both (no false binding).

**F-2 — D2 covers them — MET.** Reserved word in `if-let`/`when-let`/`match`
patterns → compile error on both backends, DD-58-voice diagnostic ("… as a lykn
pattern binding …"). The slice03 evidence repro now errors on both:
`(if-let (if x) …)`, `(when-let (for x) …)`, `(match v ((Some if) if) …)`.
`deno check` confirms no `const if` reaches output.

**F-3 — matrix probe extended, only-new-D2 delta — MET.**
`tools/conformance-matrix.js` gained `if-let`/`when-let`/`match` binding
positions (5 → 8 columns). Verified: **the original 5 position columns are
byte-identical** to the post-D2 (slice03) baseline — no scope leak — and the 3
new positions' reserved-word rows are `✗throw/✗throw` (rejects-cleanly, both
backends). Re-run is deterministic.

**F-4 — green bar — MET.** `make check` ✓; `lykn test` **1391/0** (+4 fixtures);
three-way reserved-word parity green; Rust walker unit tests +4.

## Bubble-up to arc13

### The DD-60 binding-position list is STILL not exhaustive (surfaced, not folded)

Probing for the discipline clause's "fourth" position found **three** more
positions that bind names and **leak the ID-44 genus today** (invalid JS at
rc=0, both backends), none in DD-60's list even after this slice:

| Position | Repro | Emits (rc=0) | Class |
|---|---|---|---|
| **`catch` clause** | `(try (f) (catch if (g)))` | `catch (if) { … }` | lexical value binding (D1 + D2) |
| **`import` local name** | `(import "mod" (if))` | `import {if} from "mod"` | lexical value binding (D1 + D2) |
| **`import` alias local** | `(import "mod" ((alias x if)))` | `import {x as if}` (local `if`) | lexical value binding (D1 + D2) |
| **`label` name** | `(label if (block))` | `if: { }` | label namespace (D2-only; does not shadow values) |

**Judgment (asked for in the ledger): the list is NOT yet exhaustive.** `catch`
and `import` local names are genuine lexical bindings — they belong in DD-60's
D1/D2 list on the same footing as the others; `label` is a separate namespace
but still a rc=0-invalid-JS leak D2 should close (Principle 3). All three are
small walker additions (`catch` → the error atom; `import` → the local names /
alias locals; `label` → the label atom), but per the operator's slice03 protocol
I am **surfacing, not folding** — recommend a further DD-60 refinement packaging
these (and a probe-position sweep to confirm no fifth). Evidence above is
reproducible with `./bin/lykn compile --no-strict`.

### Hook-point notes for slices 05/06 (rust-/js-resolution)

- The walker's `bindings_introduced` / `bindingsIntroduced` now yield the
  pattern positions too (kind `Pattern`) — slices 05/06 extend the D1 env at
  these the same way. `match`/`if-let`/`when-let` patterns are classified (Rust)
  / grammar-mirrored (JS) to the same Binding-vs-Constructor rule, so the env
  gets exactly the bound leaves.
- The matrix now has 8 binding-position columns; slices 05/06's A-4 convergence
  target is every legal-ident cell → `calls-binding` across all 8. The
  slice04 baseline (`matrix_baseline_slice04.md` shape) is the reference; the
  208 remaining D1 disagreements are unchanged by this slice.
- If the `catch`/`import` refinement lands before 05/06, those columns should be
  added to the probe then, so D1 convergence covers them too.

## Discipline notes

- Resolution-independent: no scope/tags/dispatch changes — only D2 validation +
  the walker/probe extension.
- Surfaced, not folded: the `catch`/`import`/`label` finding (the slice03 move,
  repeated as instructed).
- Closing report untracked; `docs/design-v0.6.0/**` is CDC's. Source only.

Handed back for CDC verification → the `catch`/`import`/`label` refinement is
the operator's packaging call; slices 05/06 (rust-/js-resolution) proceed on the
walker hook points regardless.
