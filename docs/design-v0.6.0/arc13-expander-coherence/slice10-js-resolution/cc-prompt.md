# CC Prompt — arc13 / slice10 · js-resolution

**From:** CDC (Cowork) · **To:** CC (Claude Code, host) · **Date:** 2026-07-07
**Branch:** `release/0.6.x`. **Re:** The JS mirror of slice06 — DD-60 D1
on `packages/lang` per DD-61 §A3. **Read first:** the slice-doc (grounded
dispatch map + three named tensions), **slice06's closing report** (the
hook notes are your spec-companion — especially the `scope_plan` region
model), DD-61 §A3/§A6, and DD-60's ‡ label footnote (canonical copy:
`docs/design/05-active/0062-…`).

## The work (MUST) — 6 rows (ledger has the table)

1. **F-1 — env in the walk.** One env through `expandExprInner`
   (:718), extended only via `bindingsIntroduced` (skip
   `kind === "label"`), **mirroring the region model**: body starts
   after the iterable/scrutinee; decls scope over following siblings
   only (carry the env across list children — Rust's `resolve_seq`
   analogue); `func`/`class` names in own body + siblings; keep the
   multi-clause approximation aligned with Rust's. Tag `def`/`ref` as
   an own property; compiler-generated atoms stay untagged. **The
   region probe is non-negotiable:** `(for-of array #a(1) …)` → `[1]`,
   never `array(1)`.
2. **F-2 — gate dispatch.** Bound head → skip `classifySurfaceForm`
   (:777) and `macroEnv` (:788) → plain call, tag `ref`.
   Binding-position atoms are **never dispatched** — this is what fixes
   JS's throws-from-the-binding-site rows.
3. **F-3 — `formHead(node)`.** Name only for untagged atoms, `null`
   for `def` AND `ref`; convert `compiler.js`'s kernel-head dispatch
   (`switch (head.value)` :1802 + the dispatch-purpose `.value ===`
   reads — most of the ~54 are structural, mark those exempt, the Rust
   lesson). `ref` heads → plain readable call.
4. **F-4 — the JS static check** in `make check`: head-dispatch
   `.value ===` reads outside sanctioned sites fail; seeded demo.
5. **F-5 — matrix.** JS columns → DD-60 targets; reserved rows stay
   `rejects-cleanly`; **label column stays `macro-fires` on both — do
   NOT "fix" it** (DD-60 ‡, confirmed semantics); **Rust columns
   byte-identical**; corpus unchanged. **Any Rust/corpus movement =
   leak = STOP.**
6. **F-6** — `make check` ✓; **list every JS test you migrate** (old
   throws-behavior assertions → arc09 breaking notes); `./bin/lykn`
   rebuilt for probes.

## Tensions (decide on contact, surface the decision)

D2 timing (post-expansion validation now cheap? unify + test, or
document the asymmetry); tag survival through quasiquote/markKernel
rebuilds (pin with a test); browser bundle regen if needed (note it).

## Discipline

Surface, don't fold — this arc's DDs were refined four times by exactly
that. Self-stop beats working around; fresh-context handoff is a proven
move here if the session runs long. Closing report untracked; commit
**source only**, green increments. Bubble-up: the backend-agreement
snapshot (remaining disagreeing cells + why — the corpus slice's A-4
baseline), the D2-timing disposition, the migration list, hook notes
for corpus+close.
