# Slice 02: rust-shadowing — Ledger

DD-60 on the Rust backend: D1 scope-threaded dispatch, D2 reserved-word
validation (incl. export + `kernel:` name slot), D3 untouched. Acceptance
spec = the matrix's Rust columns at DD-60 target. Per
`collaboration-framework/templates/LEDGER-DISCIPLINE.md`. Rebuild-first.
5 rows.

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| F-1 | **D1 on Rust** — lexical bindings (params, `bind`, destructuring, loop bindings, class-method params) shadow macro/form/user-macro dispatch, whole-scope; the `macro-fires` wrong-code rows and the shape-coincidence rows all become `calls-binding` | per-cell tests for each flipped row class; the matrix re-probe shows every Rust cell at its DD-60 target | serious | DD-60 D1 (confirmed) | open | | mechanism (classifier env vs pre-pass) = CC's call, stated; user-macro expansion must see the same environment |
| F-2 | **D2 on Rust** — reserved-word names rejected with a proper diagnostic at every binding position, **including `export`ed names and the `kernel:` escape's name slot**; no invalid JS at rc=0 for any name | validator tests per position; `(kernel:const if 0)` and `(export (bind if 0))` → compile errors; emitted-output spot-check via `deno check` on the probe set | serious | DD-60 D2 (confirmed, incl. edge cases 2–3) | open | | follow the `check_loop_binding` guard pattern; diagnostics name the word + the fix |
| F-3 | **Reserved-word list parity-checked** — the embedded static list is tested against `tools/conformance-matrix.js`'s empirical legality function; drift fails `make check` | the parity test present + a seeded-drift demonstration | correctness | DD-60 D2 (empirical authority) + A-7 precedent | open | | the list's authority is the probe, not the hand-list |
| F-4 | **Matrix re-probe: Rust at target, JS untouched** — all Rust columns at DD-60 targets; JS columns byte-identical to the slice01 baseline | re-probe transcript + diff vs baseline | serious | arc A-4 (at slice scale, Rust half) | open | | JS drift here would mean this slice leaked into slice03's scope |
| F-5 | **Green bar at baseline** — the breaking analysis ("nothing currently-correct changes meaning") proven by the suites | `make check` ✓; `lykn test` ≥1368/0; deno ≥673/0; doctests green; diagnostics snapshots reviewed | serious | standing bar + DD-60 breaking analysis | open | | any suite regression = a DD-60 breaking-analysis miss — surface immediately, don't patch around |

## What Worked

_(At slice close.)_

## Closure

_(At slice close: commit SHA, date, verifier, row disposition counts.)_

> Scope-threading is expander/classifier core: the five-iteration cap and
> the self-stop-on-scope-explosion clause both apply. Any DD-60 cell the
> implementation finds ambiguous is surfaced, not reinterpreted. Bubble-up
> carries mechanism notes forward to slice03 (JS + conformance corpus).