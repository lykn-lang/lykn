# Slice 08: accessor-sweep

> **Step one of the atom-payload-privacy pair** (operator-confirmed
> 2026-07-07, two-slice packaging per the slice07 recon's lean): convert
> every field-naming `SExpr::Atom {…}` pattern outside the defining
> module to accessors **while the fields are still public** — so the
> tree is green at every step and the behavior is byte-identical.
> slice09 then flips privacy as a small, atomic step. The census, site
> lists, and per-class breakdown live in **slice07's closing report**
> (grounded against HEAD `dc37ae9`) — that report is this slice's
> ground truth; do not re-derive it.

## Goal

Zero field-naming `SExpr::Atom` patterns remain outside `ast/sexpr.rs`
(field-free `Atom { .. }` is exempt — it survives privacy), across
**both crates** (`lykn-lang` and `lykn-cli` — the recon's lead finding:
there is no separate `lykn-cli` `SExpr`; it consumes `lykn-lang`'s and
pattern-matches it in 5 places). Behavior byte-identical: this slice
changes *how fields are read*, never *what is read*.

## The site classes (from the recon — ~85 total, ~81 to convert)

- **~52 value-only** (`{ value, .. }`) → `as_atom()`. One-line.
- **16 value+span** → the new `atom_parts() -> Option<(&str, Span)>`
  (added first; halves this class's churn) or `as_atom()` + `span()`.
- **3 value+binding** (resolver test helpers) → `as_atom()` + `name_res()`.
- **25 nested let-chain sites** (the effort concentration):
  `… && let Some(SExpr::Atom { value, .. }) = x.first()` becomes
  `… && let Some(v) = x.first().and_then(|e| e.as_atom())` — the
  surrounding boolean chain re-threaded, not one-line. Care > speed.
- **14 parser `matches!` guards** (reader tests) →
  `x.as_atom() == Some("…")`.
- **5 `lykn-cli` sites** (`formatter.rs:25`; `lint/rules.rs:18,159,205,451`)
  — cross-crate; 2 are `A6-exempt`-marked structural reads that *stay*
  `as_atom()` semantically (the exemption marks move with them).
- **4 field-free `{ .. }`** — untouched.

## Scope (out)

The privacy flip, `AtomData`, any change inside `ast/sexpr.rs` beyond
adding `atom_parts()` (slice09 owns the restructure); any behavior
change; any JS; renaming `as_atom()` (operator decision 2026-07-07:
stays as-is; the slice06 static check remains load-bearing).

## Exit criteria

The completion gate: a grep for field-naming `SExpr::Atom {` patterns
outside `ast/sexpr.rs` returns **zero** (this is slice09's
precondition, stated as a reproducible command in the closing report);
`make check` green with unchanged suite counts; corpus and matrix
untouched; both crates + the umbrella `lykn` crate build. Bubble-up:
anything the conversion surfaces that the recon's census missed
(a site class, an idiom that resists conversion) — surfaced, not
folded.
