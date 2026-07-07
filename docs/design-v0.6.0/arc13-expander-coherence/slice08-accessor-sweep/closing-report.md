# Slice 08: accessor-sweep — Closing Report

**By:** CC (Claude Code) · **Date:** 2026-07-07 · **Branch:** `release/0.6.x`
(from `dc37ae9`)
**Verdict: delivered — every field-naming `SExpr::Atom {…}` pattern outside the
defining module is now an accessor read; behaviour byte-identical; `make check`
green.** Step one of the atom-payload-privacy pair (slice07's two-slice plan).
The completion gate holds: **zero** field-naming `Atom` patterns remain outside
`ast/sexpr.rs`, across **both crates** — slice09's reproducible precondition.

## Per-row walk (6 rows)

**F-1 — `atom_parts()` added — MET.** `SExpr::atom_parts(&self) -> Option<(&str,
Span)>` (`ast/sexpr.rs`), the multi-field companion to `as_atom()`; reads through
accessors so it survives the slice09 restructure. Two unit tests
(`atom_parts_some`/`_none`). **The only in-module change** — the payload
restructure is slice09's.

**F-2 — `lykn-lang` production sites converted (63) — MET.** All value-field
reads now go through accessors, no field destructuring. The idioms used:
- **value-only** → `as_atom()` — as a match arm, `a @ SExpr::Atom { .. } => …
  a.as_atom().unwrap() …` (the `@`-bind works for by-value *and* by-ref
  scrutinees); as a `matches!`/guard, `x.as_atom() == Some("…")`.
- **value+span** → `atom_parts()` — a `match X { Atom {…} => .., _ => Err }`
  collapses cleanly to `match X.atom_parts() { Some((v, s)) => .., None => Err }`;
  inside tuple/other matches, `a @ SExpr::Atom { .. } => { let (v, s) =
  a.atom_parts().unwrap(); … }`.
- **the 25 nested let-chains** → `… && let Some(v) = x.first().and_then(|e|
  e.as_atom())`, the surrounding boolean chain preserved exactly — done one at a
  time (`binding.rs`, `expander/*`, `classifier/forms.rs`, `codegen/emit.rs`,
  `emitter/forms.rs`).
- Type follow-ons where the accessor now yields `&str`: `value.clone()` →
  `.to_string()`, `value.as_str()` → `value`, `n == value` → `n.as_str() ==
  value`, `env.contains_key(head_name.as_str())` → `env.contains_key(head_name)`.
  Each caught by per-file `cargo build`.

**F-3 — `lykn-lang` test sites converted (17) — MET.** The 14 `reader/parser.rs`
`matches!` guards → `assert_eq!(X.as_atom(), Some("…"))` (cleaner than the
original); the 3 `resolver.rs` value+binding helpers → `as_atom()` +
`name_res()`.

**F-4 — `lykn-cli` sites converted (5) — MET.** `formatter.rs:25`
(`as_atom()`), `lint/rules.rs` ×4 — `atom_call` and three rule `enter`s, all
value+span → `atom_parts()`. These are the cross-crate sites privacy would make
*unreachable*; they now build against the public accessor. **Umbrella `lykn`
crate builds** (`cargo build --workspace` clean; it re-exports `SExpr` via
`lykn_cli::reader`).

**F-5 — completion gate — MET.** Reproducible precondition for slice09:
```
grep -rn "SExpr::Atom {" crates/*/src --include="*.rs" \
  | grep -v "ast/sexpr.rs" | grep -vE "SExpr::Atom \{ \.\. \}"
```
returns **zero** rows. Only field-free `Atom { .. }` patterns (4) and the
defining module's own `Atom { … }` sites remain — both survive privacy.

**F-6 — green bar, byte-identical — MET.** `make check` ✓; suite counts
unchanged (test-suite 1401/0, doc tests 475/0); corpus and matrix untouched;
A6-conformance + walker-coverage + parity green. `lykn-lang` lib+integration
1136/0. This slice changed *how* fields are read, never *what*.

## Bubble-up to arc13 — for slice09 (privacy flip) and beyond

1. **A destructure-based head-*dispatch* read that slice06's F-4 could not see —
   `contains_await`.** slice06's static check greps only `.as_atom()`, so it was
   blind to head reads written as a *destructure* (`if let SExpr::Atom { value,
   .. } = head && value == "await"`). `emitter/forms.rs::contains_await` is one:
   it scans for the `await` **form** to decide async-ness, and a lexically bound
   `await` param should *not* count (a bound `await` is a call). Converting it to
   `as_atom()` is **byte-identical** (matches the old destructure semantics), so
   this slice kept `as_atom()` + an `A6-exempt` marker with an inline note.
   **Finding for slice09 / a follow-up:** whether `contains_await` (and any
   sibling await/async-detection scan) should honour resolution
   (`as_form_head`, so a bound `await` isn't counted) is a **behaviour change**,
   deliberately out of this byte-identical sweep. *Silver lining:* now that every
   head read is an accessor call, the F-4 check is no longer blind to this class —
   the gap self-closes after slice08.
2. **`lykn-cli` had no `A6-exempt` markers to carry.** The slice07 census noted
   "2 of the 5 `lykn-cli` sites are `A6-exempt`-marked structural reads"; in the
   landed tree those markers live in `lykn-lang` (the F-4 check scans only
   `lykn-lang`'s three consumers, not `lykn-cli`). No markers travelled; a minor
   census over-attribution, surfaced not folded.
3. **`atom_parts()` earned its place.** It collapsed the value+span class to a
   clean `match X.atom_parts() { Some((v, s)) => … }` at ~a dozen sites and
   removed the two-accessor-call churn the recon anticipated. slice09 keeps it.

## slice09 precondition (handoff)

The tree is ready for the atomic privacy flip: with the completion gate at zero,
slice09 makes `AtomData`'s fields private (per slice07 F-3's recommended
`Atom(AtomData)` shape) and updates only the defining module (`ast/sexpr.rs`) —
the `PartialEq`/`Display`/`span`/accessor impls and the one `SExpr::atom()`
constructor. `as_atom()` stays public as-is (operator call 2026-07-07); the
slice06 F-4 static check stays load-bearing.

## Discipline notes

- Exact-string edits, diff-inspected; **no byte-offset scripting** — per-file
  `cargo build` caught the two type follow-ons (`value.clone()` on `&str`,
  `Pattern::Constructor` name) immediately. Committed in green increments
  (F-1+F-2, then F-3+F-4).
- Source only; the closing report + ledger live under `docs/design-v0.6.0/**`
  (CDC's tree). `./bin/lykn` rebuilt before `make check`.
