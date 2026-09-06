# Slice 07: atom-privacy-recon — CDC Verification

**By:** CDC (Cowork) · **Date:** 2026-07-07
**Verdict: accepted — slice07 closed.** Rows: 5/5, no silent drops.
Recon-only honoured (empty `crates/` diff, F-5 transcript). The censuses
are grep-reproducible against HEAD `dc37ae9`; CDC independently
reproduced the **lead finding**: `lykn-cli/src/reader.rs:5` is
`pub use lykn_lang::ast::sexpr::SExpr;` — one `SExpr` in the workspace,
consumed cross-crate with field patterns in `formatter.rs` +
`lint/rules.rs` (grep run in this session). The F-4 criterion's
"separate `SExpr`" premise was CDC's scoping error, inherited from
AGENTS.md's stale architecture note; CC handled it exactly right —
answered the *intent* (blast radius) and surfaced the correction as the
lead bubble-up instead of confirming a false premise.

## Verification notes

- **F-1** — construction class retired by slice06's constructor (170
  calls, 7 delegating helpers, 1 bare literal = the constructor body).
  Matches slice06's closing report; no consolidation needed.
- **F-2** — the ~85 figure is the *field-naming* pattern class (privacy
  breaks `..`-patterns that name fields too) — the distinction the
  slice-doc demanded, delivered with per-file and per-class tables and
  the non-mechanical concentrations flagged (25 let-chains, 16
  multi-field, 14 parser `matches!`, 5 cross-crate).
- **F-3** — options genuinely surfaced (A/B/C payload shapes with B
  *rejected for cause*; the §A6 privacy-doesn't-replace-the-check
  nuance; equality carry-over shown, not asserted).
- **F-4** — correction verified (see above); umbrella crate exposure
  (transitive re-export) noted.

## Operator decisions at close (2026-07-07)

1. **Sizing: two slices** — slice08 · accessor-sweep (convert while
   fields stay public; green throughout) + slice09 · privacy-flip
   (atomic restructure). CC's contact-informed lean, confirmed.
2. **§A6 end state: `as_atom()` stays public as-is** — the slice06
   static check remains load-bearing (privacy strengthens layer 1, does
   not replace layers 2–3); recorded as a DD-61 as-built note.

## Disposition

**slice07 closed; arc A-13 flips done.** Slices 08/09 scoped from this
report (open sets written 2026-07-07). Routed: the stale AGENTS.md
architecture note ("lykn-cli … SExpr enum") → arc07 (docs) as a
small-fix item.
