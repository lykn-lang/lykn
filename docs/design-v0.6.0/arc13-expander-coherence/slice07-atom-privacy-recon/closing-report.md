# Slice 07: atom-privacy-recon — Closing Report

**By:** CC (Claude Code) · **Date:** 2026-07-06 · **Branch:** `release/0.6.x`
**Verdict: delivered — recon complete, empty source diff.** The two censuses
are published with grep-reproducible citations against the **post-slice06**
tree (HEAD `dc37ae9`); the design proposal surfaces options + a sizing judgment
for the operator; the blast radius is confirmed — **and it corrects a wrong
assumption in the phasing plan** (`lykn-cli` is *not* independent; see F-4).

**Headline:** slice06's central `SExpr::atom()` constructor already retired the
entire **construction** class. The atom-payload-privacy implementation is
therefore a **pattern-site** problem, not a construction problem — **~85
field-naming pattern sites** break under privacy (vs the field-add's 28 floor),
spread across **two crates**.

## F-1 — Construction-site census (post-slice06) — MET

**Construction is done.** slice06 routed every `SExpr::Atom` construction
through the central `SExpr::atom(value, span) -> Unresolved` constructor.

| Category | Count | Notes |
|---|---|---|
| `SExpr::atom(…)` constructor calls (lykn-lang) | **170** | the §A4 funnel |
| Local-helper `fn atom(…)` definitions | **7** | `emitter/forms.rs:18` (pub) + 6 test helpers (`analysis/mod`, `codegen/emit`, `codegen/mod`, `classifier/forms`, `expander/pass2`, `expander/mod`) — **all delegate to `SExpr::atom()`** (verified) |
| **Bare construction literals remaining** | **1** | only `SExpr::atom()`'s own body (`ast/sexpr.rs:157`) — inside the defining module |

*Reproduce:* `grep -rn "SExpr::atom(" crates/lykn-lang/src | wc -l` (170);
`grep -rn "fn atom(" crates/lykn-lang/src` (8, incl. the constructor).

**Reconciliation with slice06's in-flight measure:** the field-add broke 31 bare
constructions; slice06 converted all 31 to `SExpr::atom()` (and a further ~220
pre-existing constructions besides). Post-slice06 the construction count outside
`ast::sexpr` is **zero**. The implementation slice inherits exactly one
construction site — the constructor body — which the payload restructure
rewrites by definition.

**Local-helper consolidation recommendation:** *none needed.* The 7 helpers are
thin conveniences that already funnel through `SExpr::atom()`; they cost nothing
under the restructure (they call the constructor, which the restructure updates
in one place). Leave them.

## F-2 — Pattern-site census (the real question) — MET

**Privacy breaks every pattern that *names* a field** — `Atom { value, .. }`
included; only field-free `Atom { .. }` survives. This is a strictly larger
class than the field-add's 28 non-`..` patterns, because it also breaks the
~57 patterns that carry `..` but still name `value`/`span`/`binding`.

**Total field-naming pattern sites that break: ~85**, across two crates
(excluding `ast/sexpr.rs`, the defining module, whose ~10 sites keep private
access):

| Location | Sites | Test/Prod |
|---|---|---|
| `lykn-lang` production | **63** | prod |
| `lykn-lang` tests | **17** | test (14 of them in `reader/parser.rs` `matches!` guards) |
| **`lykn-cli`** (cross-crate) | **5** | prod (`formatter.rs:25`; `lint/rules.rs:18,159,205,451`) |

Per-file (lykn-lang, prod): `classifier/forms.rs` 23 · `binding.rs` 8 ·
`codegen/emit.rs` 7 · `expander/pass0.rs` 5 · `emitter/forms.rs` 4 ·
`analysis/mod.rs` 3 · `expander/pass1.rs` 3 · `expander/pass2.rs` 2 · nine
files × 1.

**By accessor needed** (all accessors already exist post-slice06):

| Field(s) read | Shape | Count | Accessor | Mechanical? |
|---|---|---|---|---|
| value only | `{ value, .. }` / `{ value: n, .. }` | ~52 | `as_atom()` | ✅ one-line |
| value + span | `{ value, span, .. }` / `{ value: n, span: s, .. }` | **16** | `as_atom()` + `span()` | ⚠ can't destructure two fields → two accessor calls + rebind |
| value + binding | `{ value, binding, .. }` | 3 | `as_atom()` + `name_res()` | ✅ (all in `resolver.rs` test helpers) |
| field-free | `{ .. }` | 4 | — | ✅ survives unchanged |

**Flagged non-mechanical sites** (the effort concentration — *this* is what
decides one-slice-vs-two):

1. **25 nested `Some(SExpr::Atom {…})` / `let SExpr::Atom {…}`** embedded in
   `if let … && …` let-chains (e.g. `classifier/forms.rs`, `expander/pass0.rs`,
   `codegen/emit.rs`, `binding.rs`, `resolver.rs`). Converting means
   restructuring the *whole* let-chain — you can't `&& let Some(SExpr::Atom {
   value, .. }) = x.first()` once `value` is private; it becomes
   `&& let Some(v) = x.first().and_then(|e| e.as_atom())`. Not one-line, and the
   surrounding boolean chain must be re-threaded.
2. **16 value+span multi-field reads** — no single accessor returns both; each
   match arm that binds `{ value, span, .. }` must become `x.as_atom()` +
   `x.span()` (or a new `atom_parts()` accessor — see F-3).
3. **14 parser `matches!(x, SExpr::Atom { value, .. } if value == "…")`**
   (`reader/parser.rs`, test) → `x.as_atom() == Some("…")`. Mechanical but a
   distinct idiom, and it touches nearly every reader test.
4. **5 `lykn-cli` cross-crate sites** — private fields are *unreachable* from
   `lykn-cli`; these MUST convert (2 were already `A6-exempt`-marked in slice06,
   proving they're structural reads that stay `as_atom()`).

*Reproduce:* `grep -rn "SExpr::Atom {" crates/…/src | grep -v "ast/sexpr.rs"`,
then subtract field-free `{ .. }`.

## F-3 — Design proposal (options for the operator — not decided) — MET

### Payload shape

- **Option A (recommended): `Atom(AtomData)` tuple variant** with
  `struct AtomData { value: String, span: Span, binding: NameRes }`, fields
  private to `ast::sexpr`, reads via accessors. Idiomatic Rust; `SExpr::Atom(_)`
  still matches field-free; the restructure is localized to the payload type.
- **Option B: `#[non_exhaustive]` on the *variant*** (keep `Atom { value, span,
  binding }`). Rejected: `#[non_exhaustive]` blocks external *construction* and
  exhaustive-field *patterns*, but still lets a consumer *read* `value` in a
  `{ value, .. }` pattern — so it does **not** funnel name reads through the
  accessor. Insufficient for the §A6 goal.
- **Option C: `Atom(Box<AtomData>)`** — only if `SExpr` size regresses matter
  (AtomData is `String`+`Span`+`NameRes`; measure before boxing).

### The §A6 nuance to surface (a finding, not folded)

Privacy on the payload removes the **direct-destructure** path to the raw name,
funnelling reads through accessors — but `as_atom()` **still returns the raw
value**. So privacy alone does **not** force dispatch sites onto `as_form_head()`
over `as_atom()`; it reduces the ways-to-get-the-name from three (destructure /
`as_atom` / `as_form_head`) to two. **The F-4 static check from slice06 remains
load-bearing** — privacy strengthens layer 1, it does not replace layers 2–3.
The operator should confirm the intended end state: (a) `value` private, both
`as_atom()` + `as_form_head()` public, static check retained (recommended, least
churn, matches the three-layer story); or (b) a stricter split where `as_atom()`
is renamed/narrowed to make non-dispatch use conspicuous (more churn, marginal
gain over the static check).

### Accessor API

Existing (post-slice06): `as_atom() -> Option<&str>`, `span() -> Span`,
`name_res() -> NameRes`, `as_form_head() -> Option<&str>`, `SExpr::atom(v, s)`,
`with_name_res(res)`. **Add** for the 16 multi-field sites (optional but halves
their churn): `atom_parts(&self) -> Option<(&str, Span)>`. Nothing else required.

### Equality / Display / Debug / span carry-over

slice06's **tag-insensitive manual `PartialEq`** carries over cleanly: the impl
already compares value+span and skips `binding`; under `Atom(AtomData)` it
destructures `Atom(a)`/`Atom(b)` inside the defining module and compares
`a.value == b.value && a.span == b.span`. `Display`/`Debug` and `span()` likewise
re-target to the payload inside `ast::sexpr` — all within the module that keeps
private access. **No equality re-decision needed.**

### Migration order (green at each step — slice06's proven pattern)

1. Add `atom_parts()` (if adopted); no behavior change.
2. **Convert all ~85 pattern sites to accessors while fields are still public**
   (accessors work on public fields → tree stays green throughout; per-crate:
   lykn-lang prod, then tests, then lykn-cli).
3. **Flip `AtomData` fields private + restructure the variant** (the atomic
   step). If step 2 is complete, this breaks only the defining-module impls +
   the one constructor — a small, contained change.

### LoE + sizing judgment

**Two viable shapes:**
- **One slice** (convert + flip together, incremental internally). Feasible: ~52
  trivial + ~30 non-mechanical + 5 cross-crate + the payload restructure.
  Comparable scale to slice06; *less* total churn but *more* per-site care.
- **Two slices (recommended lean):** slice 1 = the 85 accessor conversions
  (fields stay public → green, purely mechanical-to-moderate, fully reviewable);
  slice 2 = the privacy flip + payload restructure + defining-module + accessor
  additions (small, atomic, focused). This is a **clean** split because the
  conversions do not depend on privacy — they can land first and the flip
  becomes the last, small step.

**Recommendation:** lean **two slices.** The arc was burned once by
under-scoped recon (slice02); the two non-mechanical classes (25 nested
let-chains + 16 multi-field) plus the *cross-crate* reach (a new fact — F-4)
argue for isolating the mechanical conversion sweep from the atomic
restructure. It also keeps each slice comfortably inside one context. If the
operator prefers one slice, it is feasible with an internal checkpoint after
the nested-let-chain class. **Surfaced, not decided.**

## F-4 — Blast radius outside `crates/lykn-lang` — MET (with a correction)

- **Exactly one `SExpr` in the workspace:** `crates/lykn-lang/src/ast/sexpr.rs:36`
  (`grep -rn "pub enum SExpr" crates/` → one hit). There is **no second/separate
  `SExpr`.**
- **Umbrella `lykn` crate** (`crates/lykn/src/lib.rs`): re-exports
  `lykn_cli::formatter` and `lykn_cli::reader`. It exposes `SExpr` *transitively*
  — `lykn-cli/src/reader.rs:5` does `pub use lykn_lang::ast::sexpr::SExpr;`. No
  direct payload access; no break, but downstream users of the umbrella crate
  see the type.
- **⚠ CORRECTION TO THE PHASING PLAN — `lykn-cli` is NOT independent.** The
  slice-doc/ledger/prompt state "`lykn-cli`'s *separate* `SExpr`" and task F-4
  with "confirm the separation." **There is no separate `SExpr`.** `lykn-cli`
  imports `lykn_lang::ast::sexpr::SExpr` and **pattern-matches its fields** in 5
  places (`formatter.rs`, `lint/rules.rs` ×4). Under privacy these **break
  cross-crate** and must convert to accessors. The blast radius is **two
  crates**, not one. (This is the single assumption the census overturned —
  bubble-up below.)
- No other `ast::sexpr` consumer exists (`grep -rln "ast::sexpr\|SExpr::Atom\|
  NameRes"` outside lykn-lang → only lykn-cli's formatter/reader/lint).

## F-5 — Recon-only guard — MET

`git status --short crates/` → **empty** (0 lines). No source touched; the slice
closes on an empty diff (the slice01 precedent). This report + the ledger live
under `docs/design-v0.6.0/**` (CDC's tree).

## Bubble-up to arc13 — for the implementation slice's open set

1. **The blast radius is two crates, not one.** The "separate `lykn-cli`
   `SExpr`" premise is false; `lykn-cli` consumes `lykn_lang`'s `SExpr` and
   pattern-matches it (5 sites). The implementation slice's scope, ledger, and
   `make check` gate must include `lykn-cli` (and re-confirm the umbrella
   `lykn` crate builds — it re-exports `SExpr` via `lykn_cli::reader`).
2. **It's a pattern problem, not a construction problem.** slice06's constructor
   retired the construction class; do not re-plan around construction sweeps.
   The open set is: add `atom_parts()` (optional) → convert ~85 pattern sites to
   accessors (green, public fields) → flip privacy (atomic, small).
3. **The §A6 end state needs an operator confirm** (F-3): privacy funnels reads
   to accessors but does not by itself force `as_form_head` over `as_atom` — the
   slice06 F-4 static check stays load-bearing. Decide whether `as_atom()` stays
   public as-is (recommended) or is narrowed.
4. **Sizing: recommend two slices** (mechanical conversion sweep, then the atomic
   privacy flip) — the clean split the arc's "don't under-scope the big churn"
   lesson argues for. One slice is feasible with an internal checkpoint.
5. **Equality does not need re-deciding** — slice06's tag-insensitive manual
   `PartialEq` re-targets to the payload inside the defining module unchanged.

## Discipline notes

- Recon-only: zero source changes (F-5 empty diff verified). All figures are
  grep-reproducible against HEAD `dc37ae9` (post-slice06 close).
- One census assumption from the phasing plan was overturned (lykn-cli
  independence) — surfaced as the lead bubble-up, not folded.
