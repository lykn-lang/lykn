# Slice 08: accessor-sweep — Ledger

Step one of the privacy pair: all field-naming `SExpr::Atom` patterns →
accessors, fields still public, behavior byte-identical. Census =
slice07 closing report (HEAD `dc37ae9`). Per LEDGER-DISCIPLINE.
Rebuild-first. 6 rows.

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| F-1 | **`atom_parts() -> Option<(&str, Span)>` added** to `ast/sexpr.rs` (the one in-module addition), doc'd as the multi-field companion to `as_atom()`; unit-tested | the accessor + tests | correctness | slice07 F-3 (halves the 16-site class) | met | `make check` ✓ | no other `ast/sexpr.rs` change — the restructure is slice09's |
| F-2 | **`lykn-lang` production sites converted (63)** — value-only → `as_atom()`; multi-field → `atom_parts()`/`span()`; the 25 nested let-chains restructured with the boolean chain preserved exactly | per-file diff review; suite counts unchanged | serious | slice07 census | met | `make check` ✓ | care > speed on the let-chains; exact-string edits, diff-inspected — **no byte-offset scripting** |
| F-3 | **`lykn-lang` test sites converted (17)** incl. the 14 parser `matches!` guards → `as_atom() == Some(…)` | diff review; tests green | serious | slice07 census | met | `make check` ✓ | the 3 value+binding resolver helpers → `as_atom()` + `name_res()` |
| F-4 | **`lykn-cli` sites converted (5)** — `formatter.rs` + `lint/rules.rs` ×4; `A6-exempt` markers travel with the 2 marked sites; umbrella `lykn` crate builds | diff review; `cargo build` workspace-wide | serious | slice07 lead finding (two-crate blast radius) | met | `make check` ✓ | cross-crate: these are the sites privacy would make *unreachable* |
| F-5 | **Completion gate** — grep for field-naming `SExpr::Atom {` patterns outside `ast/sexpr.rs` returns **zero** (field-free `{ .. }` exempt); the command published in the closing report as slice09's reproducible precondition | the grep + transcript | serious | slice09 precondition | met | `make check` ✓ | |
| F-6 | **Green bar, byte-identical behavior** — `make check` ✓; suite counts unchanged (≥1401/0, docs 475/0); corpus untouched; no matrix movement; A6 conformance + walker coverage + parity tests green | suite runs | serious | standing bar | met | `make check` ✓ | this slice changes how fields are read, never what |

## What Worked / Closure

**Closed 2026-07-07 — all six rows met, `make check` green, behaviour
byte-identical** (test-suite 1401/0, doc tests 475/0; `lykn-lang` 1136/0). The
completion gate holds: **zero** field-naming `SExpr::Atom {…}` patterns outside
`ast/sexpr.rs` across both crates — slice09's reproducible precondition. See
`closing-report.md` for the idioms (`atom_parts()` collapses; `@`-bind for
match arms; `.and_then(|e| e.as_atom())` for let-chains) and the bubble-up:
`contains_await` is a destructure-based head-*dispatch* read slice06's F-4 was
blind to — kept byte-identical (`as_atom()` + `A6-exempt` note), with the
`as_form_head` question deferred to a follow-up. Committed source-only in two
green increments (`7d86703` F-1+F-2; `dab4405` F-3+F-4). Verified by: CDC
(cdc-verification.md — F-5 independently reproduced; `contains_await` routed
to the corpus+close slice's scoping).
