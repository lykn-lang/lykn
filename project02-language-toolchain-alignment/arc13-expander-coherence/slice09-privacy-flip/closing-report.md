# Slice 09: privacy-flip — Closing Report

**By:** CC (Claude Code) · **Date:** 2026-07-07 · **Branch:** `release/0.6.x`
**Verdict: delivered — `SExpr::Atom` is now `Atom(AtomData)` with private
fields; privacy holds by construction (compile-fail proven in *both* crates);
behaviour byte-identical; `make check` green.** The DD-61 §A6 by-construction
layer the operator phased out of slice06 is landed: outside `ast::sexpr` there
is no destructure path to a raw atom name — the accessors are the only door,
and `as_form_head()` is the only dispatch-purpose one. **The flip broke only
`ast/sexpr.rs`** — smaller than the slice-doc anticipated (see F-2's finding).

## Per-row walk (5 rows)

**F-1 — precondition re-verified — MET.** slice08's completion grep re-run
against the start tree (`a0b2dc8`):
```
grep -rn "SExpr::Atom {" crates/*/src --include="*.rs" \
  | grep -v "ast/sexpr.rs" | grep -vE "SExpr::Atom \{ \.\. \}"
```
→ **zero** rows. slice08 did its job; nothing to surface.

**F-2 — the restructure — MET.** `Atom { value, span, binding }` →
`Atom(AtomData)`; `struct AtomData { value, span, binding }` with **private
fields** (recon Option A). Eleven in-module sites re-targeted, all behaviour
unchanged:
- `SExpr::atom()` — the one construction door — builds `Atom(AtomData { … })`.
- accessors `as_atom` / `atom_parts` / `span` / `name_res` / `with_name_res` /
  `as_form_head` read the payload (`SExpr::Atom(a) => &a.value`, etc.);
  `as_form_head` destructures the private `AtomData { value, binding:
  Unresolved, .. }` — legal in-module.
- `is_atom` → `matches!(self, SExpr::Atom(_))`.
- the **tag-insensitive manual `PartialEq`** carries over verbatim in intent:
  `(Atom(a), Atom(b)) => a.value == b.value && a.span == b.span` (skip
  `binding`). No equality re-decision (recon F-3).
- `Display`/`Debug` re-target (`Debug` still derived).

**Size:** `size_of::<SExpr>()` = **48 bytes before, 48 after** — unchanged
(tuple vs struct variant is the same layout). **No regression → no boxing**
(Option C stays a non-option, as the recon scoped it).

> **Finding — the flip is smaller than scoped.** The slice-doc listed "field-free
> matches updated (`Atom(_)`) across both crates" as in-scope, expecting ~42
> conversions. **They were unnecessary:** Rust's `{ .. }` rest-pattern is valid
> on tuple variants/structs, so every field-free `SExpr::Atom { .. }` pattern
> (42 across both crates) compiled **unchanged**. The struct→tuple change breaks
> only field-*naming* patterns (slice08 removed those) and in-module field
> access (re-targeted). Net: **the only file that changed is `ast/sexpr.rs`.**
> Kept minimal per "small and atomic is the spec" — the `{ .. }`→`Atom(_)`
> churn was left undone deliberately (surfaced, not folded; a follow-up may
> normalise the idiom if desired, but it is cosmetic).

**F-3 — privacy holds by construction — MET.** Seeded field-naming destructures
of the private payload, both crates, both rejected at compile time (seed →
error → removed; seeds were `#[cfg(test)]` modules, removed surgically, not via
`git checkout`):
- **lykn-lang** (sibling module `resolver.rs`): `if let SExpr::Atom(AtomData {
  value, .. }) = x` → `error[E0451]: field \`value\` of struct \`AtomData\` is
  private`.
- **lykn-cli** (cross-crate — the recon's lead finding): same pattern in
  `lint/rules.rs` → the identical `error[E0451]: … is private`.

One construction door (`SExpr::atom()`), one dispatch door (`as_form_head()`).

**F-4 — §A6 end state as decided — MET.** `as_atom()` is public and unrenamed
(operator call 2026-07-07); the slice06 A6 static conformance check is green
(`a6_dispatch_conformance` 1/0) and remains load-bearing; the accessor doc
comments are true post-restructure, and `AtomData`'s doc records the
by-construction layer.

**F-5 — green bar — MET.** `make check` ✓ (both crates + the umbrella `lykn`
crate build); suite counts unchanged (test-suite 1401/0, doc tests 475/0);
`lykn-lang` 1136/0; corpus + matrix untouched. `./bin/lykn` rebuilt before the
run. Behaviour byte-identical.

## Bubble-up to arc13 — DD-61 §A6 as-built (Rust)

**The three-layer story is now `visibility + static check + corpus` on Rust:**
1. **Visibility (layer 1, this slice):** `AtomData`'s fields are private —
   no consumer can destructure to the raw name. `SExpr::atom()` is the only
   construction door; `as_form_head()` the only dispatch-purpose accessor.
2. **Static check (layer 2, slice06):** the `a6_dispatch_conformance` test —
   still load-bearing, because `as_atom()` stays public (it *can* return the raw
   name for non-dispatch use), so visibility narrows the doors but does not by
   itself force `as_form_head` over `as_atom`. The check keeps that discipline.
3. **Corpus (layer 3):** the cross-backend conformance corpus pins any surviving
   divergence.

Anything the flip revealed:
- **`{ .. }` works on tuple variants** (F-2 finding) — the field-free-match
  conversion the slice-doc scoped was unnecessary; the flip touched one file.
- **Equality needed no re-decision** — the recon's call held: the tag-insensitive
  manual `PartialEq` re-targets to the payload verbatim.
- **CDC records the DD-61 as-built note** (per the operator decision); this
  slice's job was that the check and the doc comments stay true — they do.

## Discipline notes

- Exact-string edits; the one `git checkout`-to-clean-a-probe mistake reverted
  the (uncommitted) restructure and was caught immediately and redone — probes
  are removed surgically thereafter. `size_of` measured before *and* after.
- Source only; the closing report + ledger live under `docs/design-v0.6.0/**`
  (CDC's tree). Commit is source-only.
