# Slice 04: walker-extension (+3 binding positions)

> The DD-60 refinement landed as its own small slice (operator packaging
> call, 2026-07-06): extend the binding-position walkers + D2 validation +
> the matrix probe to cover **`if-let` / `when-let` bindings and `match`
> clause patterns** — the three positions slice03's walker build exposed as
> missing from the confirmed list, each a live ID-44-genus leak today
> (`(if-let (if x) …)` → invalid `const if` at rc=0).

## Goal

Both walkers (`binding.rs` / `binding.js`) enumerate the three new
positions; D2 rejects reserved words there (both backends, DD-58-voice
diagnostics); the matrix probe gains the corresponding binding-position
cells (baseline first, then the D2 rows flip); parity fixtures extended.
Slices 05/06 then inherit the complete list through the same hook points.

## Scope (in)

1. **F-1** — walker extension, both backends: `if-let`/`when-let` binding
   patterns (including destructuring inside them) + `match` clause
   patterns, via `bindings_introduced`/`bindingsIntroduced`; shared parity
   fixtures extended (16 → +N).
2. **F-2** — D2 coverage: reserved word in any of the three positions →
   compile error, both backends; the live leaks close.
3. **F-3** — matrix probe extension: the new binding-position dimension
   cells added (`tools/conformance-matrix.js`), baselined, and the re-probe
   shows **only the new positions' D2 rows** as `rejects-cleanly` — all
   pre-existing cells byte-identical.

## Scope (out)

Resolution/env/tags (slices 05/06); any dispatch change; other binding-like
forms *not* in the refinement (if the extension work surfaces a fourth
missed position — surface it, don't fold it).

## Verify / exit

Rebuild-first; `make check` ✓; suites ≥1387/0 + new tests; parity test
green three-way; re-probe diff exactly the new-position D2 delta;
`./bin/lykn` everywhere. Bubble-up: hook-point notes for slices 05/06 and
confirmation the DD-60 list is now believed exhaustive (or a further
finding, surfaced).
