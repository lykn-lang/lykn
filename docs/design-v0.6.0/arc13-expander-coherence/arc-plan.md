# arc13 — Expander Coherence (bindings shadow macros, everywhere)

> **Status: Open — scoped 2026-07-06.** Created from arc05/slice02's F-4
> recon (the ID-42 self-stop): the Rust and JS expanders **resolve
> param-vs-macro shadowing differently**, and each is also internally
> inconsistent. Operator call (2026-07-06): *"pause arc05 and fix the
> expander divergence — this is a blocker… fix the compiler bugs (and any
> related bugs while we're at it), and then we won't have to warn on all
> macro names — we can just do the right thing."* **arc05 is PAUSED at 2/3
> slices until this arc closes.** Appended by creation order.

## 1. Capability

**A lexically-bound name means the binding — on both backends, in every
position.** The F-4 probe matrix (arc05/slice02 closing report) shows today:

| Param named… | Rust | JS |
|---|---|---|
| `fn`, `func`, `type`, `match`, `obj`, `and`, `or`, `bind`, … | calls param ✓ | **throws** ✗ |
| `cell`, `express`, `get`, `not`, `lambda` | **macro fires → wrong code** ✗ | throws ✗ |
| `template`, `new` | wrong code ✗ | wrong code ✗ |
| JS reserved words (`if`, `while`, …) | **invalid JS at rc=0** ✗ | invalid ✗ |

Same source: compiles on one backend, throws on the other — a P-9-class
semantic divergence outside the corpus's coverage. After this arc:
lexical bindings (params, `bind`, destructuring, loop bindings) **shadow**
macro/form dispatch in their scope, identically on both compilers; JS
reserved words are **rejected as names** with a proper diagnostic (the
ID-44 genus — no invalid output at rc=0); and a **name-binding conformance
corpus** pins all of it cross-compiler, permanently.

## 2. Slice breakdown

| Slice | Scope | Status |
|-------|-------|--------|
| **slice01 · conformance-matrix + DD** | Systematically extend the F-4 probe: name classes (surface macros, classifier forms, kernel heads, `kernel:`-prefixed, JS reserved words, ordinary names) × binding positions (func/fn/genfunc params, `bind`, destructuring, loop bindings, class fields) × reference positions (call-head, argument, nested-fn body) × both backends. Output: the full matrix (ground truth) + **DD-60 draft**: the intended semantics — *lexical bindings shadow macros/forms within their scope; JS reserved words are invalid names; kernel-only heads stay closed (DD-58 untouched)* — with per-cell target behavior and the migration/breaking analysis. Recon-only slice: **no compiler changes.** | **Closed** (885-cell matrix, `tools/conformance-matrix.js`; 35% backend disagreement; Rust's "shadowing" exposed as shape-coincidence; **DD-60 operator-confirmed in full 2026-07-06** incl. export + `kernel:` name-slot coverage; recon-only CDC-reproduced) |
| **slice02 · rust-shadowing + name-validation** | ~~DD-60 on the Rust backend via scope-threading~~ | **SELF-STOPPED → superseded** (2026-07-06): implementation contact found **four** independent name-dispatch subsystems (expander / classifier / emitter / codegen — kernel heads dispatch in codegen, `emit.rs:224/248/270`), not the recon's one path. Tree reverted clean; the four-site map + the validated EmitterContext mechanism carried into the re-slice; all 5 ledger rows deferred with homes. |
| **slice03 · binding-walker + d2-validation** (re-slice) | **DD-61 §A2's binding-position walker on both backends** — the single per-backend component that knows what binds — **+ the D2 reserved-word validator riding it** (every binding position, `export`, the `kernel:` name slot; list-parity test against the probe). Ships first: resolution-independent, kills the ID-44 genus, and builds D1's chassis. | **Open — scoped** (open set written 2026-07-06) |
| **slice04 · rust-resolution** | Env + resolved-atom tags (DD-61 §A1) through the Rust pipeline: expander light binding-scan (shared walker) → classifier hosts the env + tags atoms → emitter and codegen become **read-only consumers**. Rust matrix columns → DD-60 targets. | Open (scope after slice03) |
| **slice05 · js-resolution** | Same through the JS pipeline: env threads the `expandExpr` walk (binding-position atoms are never dispatched — kills the throws-at-binding-site rows); `compiler.js` consumes tags for kernel heads. JS matrix columns → targets. | Open (scope after slice04) |
| **slice06 · conformance-corpus + arc close** | The permanent cross-backend name-binding corpus generated from the matrix; A-4/A-5 reproduced; DD-60 refinement entry recording the resolve-once architecture. | Open |

*(Architecture per **DD-61 · Resolve-Once** —
[`design/dd-61-resolve-once-resolution-architecture.md`](./design/dd-61-resolve-once-resolution-architecture.md):
**resolved-atom flags** [operator-confirmed 2026-07-06 over alpha-renaming
and a new kernel construct — the enrich-the-identifier pattern of Racket
syntax objects / rustc `Res` fields], one binding-walker per backend,
dispatch sites become consumers.)*

## 3. Dependencies

Consumes: arc10's kernel-mark/sanctioned-signal machinery + the per-backend
enforcement discipline; arc05 slice02's F-4 matrix as the seed. **Blocks:
arc05 slice03** (the `reserved-param-name` lint question resolves properly
once bindings shadow correctly — likely to a much smaller rule or none) —
and therefore arc05's close and the P-11 demo. Sequence: **arc13 → arc05
slice03 → arc06 → arc07 → arc09.**

## 4. Arc ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| A-1 | slice01 (matrix + DD-60) closed | ptr: cdc-verification | serious | arc-plan | open | | |
| A-2 | slice02 (Rust) closed | ptr: cdc-verification | serious | arc-plan | open | | |
| A-3 | slice03 (JS + corpus) closed | ptr: cdc-verification | serious | arc-plan | open | | |
| A-4 | **the matrix converges** — every live cell behaves per DD-60 on both backends; zero cells where the backends disagree | run the conformance corpus; matrix re-probe transcript | serious | arc05 F-4 recon | open | | reproduce at arc scale on host |
| A-5 | **no invalid output at rc=0 for any name class** — reserved-word (and any matrix-surfaced) name misuse is a compile error with a diagnostic, both backends | the validator demos; `deno check` on emitted corpus output | serious | Principle 3 / ID-44 genus | open | | |
| A-6 | arc05's ID-42 question re-answered from the fixed state | arc05 slice03 scoping note: reserved-param-name rule shrunk/dropped with rationale | correctness | operator decision 2026-07-06 | open | | the point of pausing: do the right thing instead of warning broadly |

## 5. Version History

### v1.3 — 2026-07-06 (architecture doc renumbered: "DD-60 Appendix A" → DD-61)
Operator catch: a separate file carrying DD-weight decisions under another
DD's number is a numbering collision waiting to confuse odm. Renamed to
**DD-61 — Resolve-Once: Name-Resolution Architecture (implements DD-60)**
(`design/dd-61-resolve-once-resolution-architecture.md`), per the house
implements-pattern (DD-37 implements DD-36). Internal §A1–A6 labels kept;
live references updated to "DD-61 §An" style (historical entries left
verbatim). Also this session, DD-61 gained **§A6** — the operator's
mandatory-tooling refinement (the `as_form_head()` accessor swap that
withholds the name from dispatch for binding-refs; the JS `formHead()` +
static grep-conformance test; three enforcement layers + a recorded
revisit-trigger) — and the **tooling accounting** (lint must consume
resolution → arc05 v1.5; fmt = documented no-op; no new slices needed;
§A6 rows pinned in slices 04/05 ledgers at scoping). For odm: DD-61 is
ready to add.

### v1.2 — 2026-07-06 (slice02 self-stopped; architecture hammered out; re-sliced 03–06)
slice02 **self-stopped with data** (the clause working as designed): name
dispatch lives in **four** subsystems — the slice01 F-3 recon missed the
emitter and codegen sites (miss owned jointly: CC's sketch, CDC's
acceptance without an exhaustive dispatch-site enumeration → issues log).
**Architecture session (operator + CDC, drawing on Racket scope-sets /
GHC's Renamer / rustc RFC-1560):** root cause is the *stringly head
position* in the kernel IR; cure is **resolve once, consume everywhere**
— Appendix A drafted and operator-confirmed: **resolved-atom flags** (the
enrich-the-identifier canon; chosen over alpha-renaming [would need
un-renaming to keep readable-JS output] and a new kernel construct [the
grammar is user-facing, dual-implemented, and macro-visible]); **one
binding-position walker per backend** (D2's home and D1's chassis).
**Re-slice:** 03 walker+D2 (both backends, dispatched) → 04 rust-resolution
→ 05 js-resolution → 06 conformance corpus + close. slice02's five rows
deferred into 03–06 with named homes; no silent drops.

### v1.1 — 2026-07-06 (slice01 closed; DD-60 CONFIRMED; slice02 scoped)
slice01 closed (commit pending for `tools/`+`design/`; content
CDC-verified; recon-only reproduced by empty diff): the 885-cell matrix
corrected the record — **neither backend has binding awareness** (Rust's
apparent shadowing = shape-check coincidence; 312 cells / 35% disagree;
reserved words = ID-44 at scale). **DD-60 operator-confirmed in full**:
D1 whole-scope lexical shadowing (incl. user macros), D2 empirical
reserved-word validation covering `export` and the `kernel:` name slot,
D3 DD-58 untouched. Sizing accepted: 02/03 split kept. **slice02
(rust-shadowing) scoped** — open set written against DD-60.

### v1.0 — 2026-07-06 (created; arc05 paused)
Created from arc05/slice02's F-4 self-stop recon + the operator's blocker
call. LoE judged arc-worthy (CDC): a semantics decision (DD-60), expander-
core changes on both backends, and a conformance corpus — not a patch.
Three slices (recon+DD → Rust → JS+corpus), with a possible 02/03 merge
per the sizing judgment once the matrix is in. arc05 paused at 2/3; its
slice03 (and the ID-42 lint question) resumes after this arc closes.
