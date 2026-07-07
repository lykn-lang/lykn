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
| **slice03 · binding-walker + d2-validation** (re-slice) | **DD-61 §A2's binding-position walker on both backends** — the single per-backend component that knows what binds — **+ the D2 reserved-word validator riding it** (every binding position, `export`, the `kernel:` name slot; list-parity test against the probe). Ships first: resolution-independent, kills the ID-44 genus, and builds D1's chassis. | **Closed** (commit pending on staged source; `binding.rs`/`binding.js` + 16 parity fixtures; D2 both backends; matrix: only D2 rows moved, disagreement 312→208; suites 1387/0; **finding: DD-60 list missed 3 binding positions** → refinement confirmed → slice04) |
| **slice04 · walker-extension** (from slice03's finding; operator packaging call) | +3 binding positions (`if-let`/`when-let` patterns, `match` clause patterns — live ID-44-genus leaks) through walker + D2 + matrix probe, both backends. | **Closed** (matrix 5→8 position columns, originals byte-identical; fixtures 16→20; suites 1391/0; **finding #2: 3 more leaking positions** — catch/import-local/label → refinement #2 + the method change → slice05) |
| **slice05 · position-sweep + walker-completion** | Refinement #2's positions (catch/import-local D1+D2; label D2-only) **+ the derived-exhaustiveness sweep** (enumerate identifier-emitting binding slots from the grammar/codegen per backend; diff vs walker = a **standing test** in `make check`). Ends discovery-by-leak: the list becomes complete by construction. | **Closed** (catch/import/label + the **name-slot class the sweep found** [func/genfunc/class/type names + ctor params — invalid JS at rc=0, all folded]; coverage test standing w/ seeded-gap demo; matrix 8→11, originals byte-identical; suites 1401/0; **exhaustiveness by construction**) |
| **slice06 · rust-resolution** | Env + resolved-atom tags (DD-61 §A1) through the Rust pipeline (classifier hosts the env; expander gets the light binding-scan); emitter/codegen → read-only consumers via the `as_form_head()` swap (**DD-61 §A6 rows pinned at scoping**: zero dispatch-purpose raw-head reads [F-3] + a standing static check [F-4]; JS matrix columns + corpus outputs byte-identical [F-5] — movement = leak = stop). §A6 *privacy* is phased per the operator call (2026-07-06): this slice lands accessor + `#[must_use]` + check; the `Atom` payload restructure is a follow-up slice. | **Open** (open set written 2026-07-06) |
| *(next)* · js-resolution | Same through `expandExpr`; `formHead()` + the static grep-conformance check (§A6). | Future |
| *(next)* · atom-payload-privacy | The §A6 by-construction layer (operator phasing call, 2026-07-06): restructure `SExpr::Atom` to a private-field struct payload (~259 mechanical sites) so the `binding` field is truly private. Any time after slice06; lands before arc close. | Future |
| *(next)* · conformance-corpus + arc close | The permanent cross-backend corpus; A-4/A-5 reproduced; DD-60 cross-ref recording DD-61 as-built. | Future |

*(Future entries carry **no numbers** — numbered at creation per the
creation-order convention; the v1.4 tail-renumber was a CDC slip, corrected
here.)*

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
| A-1 | slice01 (matrix + DD-60) closed | ptr: cdc-verification | serious | arc-plan | done | slice01/cdc-verification.md (attested) | |
| A-2 | slice02 (rust-shadowing) — self-stopped; superseded by the v1.2 re-slice, all 5 rows deferred with homes | ptr: slice02 closing docs | serious | arc-plan | no-op | slice02/closing-report.md + cdc-verification.md | was: "slice02 (Rust) closed" — the Rust work moved to slice06 |
| A-3 | slice03 (binding-walker + D2) closed | ptr: cdc-verification | serious | arc-plan | done | slice03/cdc-verification.md (attested) | was: "slice03 (JS + corpus)" — the v1.2 re-slice renamed the slice map; JS resolution + corpus have their own rows below |
| A-4 | **the matrix converges** — every live cell behaves per DD-60 on both backends; zero cells where the backends disagree | run the conformance corpus; matrix re-probe transcript | serious | arc05 F-4 recon | open | | reproduce at arc scale on host |
| A-5 | **no invalid output at rc=0 for any name class** — reserved-word (and any matrix-surfaced) name misuse is a compile error with a diagnostic, both backends | the validator demos; `deno check` on emitted corpus output | serious | Principle 3 / ID-44 genus | open | | |
| A-6 | arc05's ID-42 question re-answered from the fixed state | arc05 slice03 scoping note: reserved-param-name rule shrunk/dropped with rationale | correctness | operator decision 2026-07-06 | open | | the point of pausing: do the right thing instead of warning broadly |
| A-7 | slice04 (walker-extension) closed | ptr: cdc-verification | serious | accrued at slice close (v1.7 catch-up) | done | slice04/cdc-verification.md (attested) | |
| A-8 | slice05 (position-sweep) closed | ptr: cdc-verification | serious | accrued at slice close (v1.7 catch-up) | done | slice05/cdc-verification.md (attested) | binding layer complete by construction; coverage test standing |
| A-9 | slice06 (rust-resolution) closed | ptr: cdc-verification | serious | arc-plan v1.7 | open | | |
| A-10 | js-resolution slice closed | ptr: cdc-verification | serious | arc-plan v1.7 | open | | slice un-numbered until creation |
| A-11 | atom-payload-privacy slice closed (§A6 by-construction layer) | ptr: cdc-verification | correctness | operator phasing call 2026-07-06 | open | | un-numbered until creation; lands before arc close |
| A-12 | DD-60 refinements #1/#2/addendum dispositioned (routed, confirmed, landed) | DD-60 refinement log (3 entries) + v1.4/v1.5/v1.6 change-log entries | correctness | bubble-ups: slices 03/04/05 | done | DD-60 §Refinement log; slices 04/05 closed | class-(c) rows, accrued at v1.7 catch-up |

## 5. Version History

### v1.7 — 2026-07-06 (slice06 · rust-resolution scoped; §A6 privacy finding + operator phasing call)
slice06 open set written (slice-doc / ledger [6 rows] / cc-prompt),
grounded in the tree: the four dispatch sites re-cited at current lines
(pass2 `expand_expr` :39/:100/:157; classifier `classify_form{,_strict,
_kernel_only}` :37/:117/:232; emitter `emit_expr` :319/:348; codegen
`emit_list` :198/:214 + `emit_class_member` :1394 + three inline checks).
**Scoping finding (which-child-surfaced: slice06 scoping, CDC):** DD-61
§A6's "the `binding` field is private" is unimplementable as written —
Rust pub-enum-variant fields cannot be private; by-construction privacy
requires an `Atom` struct-payload restructure (~259 sites). **Operator
call: phase it** — slice06 lands `as_form_head()` + `#[must_use]` +
`#[non_exhaustive]` + a standing static conformance check (the §A6 pin
holds: zero dispatch-purpose raw-head reads); the payload restructure is
a new future slice (*atom-payload-privacy*, un-numbered until creation).
DD-61 carries the matching refinement note. Also named at scoping, for
CC to surface not decide: the `PartialEq`-includes-the-tag question and
the `has_macros` short-circuit exposure check. **Arc-ledger catch-up
(disclosed):** the class-(a) accrual missed three slice closes — A-1
marked done (attested), A-2 no-op'd as superseded (was "slice02 (Rust)
closed"), A-3 repointed to the re-sliced slice03 (was "slice03 (JS +
corpus)"), A-7/A-8 added done-attested for slices 04/05, A-9/A-10/A-11
opened for slice06 / js-resolution / atom-payload-privacy, A-12 added as
the class-(c) disposition row for the three DD-60 refinements.
(Housekeeping: the v1.5 entry was recorded twice — long and short forms
of the same event; the short duplicate below v1.6 is marked as such
rather than deleted.)

### v1.5 — 2026-07-06 (slice04 closed; refinement #2 + the method change; slice05 scoped)
slice04 closed (both walkers cover the +3 via existing hook points —
pattern-grammar reuse held; matrix 5→8 columns, originals byte-identical;
fixtures 20; suites 1391/0). **Finding #2 (probe-for-a-fourth found
three):** `catch` bindings, `import` local names (lexical — D1+D2),
`label` names (own namespace — D2-only rc=0 leak). **Operator: refinement
confirmed + method change** — two leak-discovered rounds means the list
must be **derived**: **slice05 · position-sweep + walker-completion**
(the 3 positions + a grammar/codegen-derived position inventory per
backend, diffed against the walker as a standing `make check` test —
complete by construction). DD-60 refinement log entry #2 written.
**Convention correction (owned):** the v1.4 tail-renumber violated
stop-renumbering; future entries are now un-numbered until creation.

### v1.6 — 2026-07-06 (slice05 closed — the binding layer is complete by construction)
slice05 closed: catch/import-locals at D1+D2, labels D2-only with
`shadows_values()=false` in the API; **the sweep found the name-slot class**
(func/genfunc/class/type names + ctor params → invalid JS at rc=0 — a class
two rounds of leak-probing structurally couldn't see; folded mechanically);
derived per-backend inventories with codegen citations; **the coverage-diff
test stands in `make check`** (seeded-gap demo'd). Matrix 8→11 positions,
originals byte-identical; suites 1401/0. DD-60 refinement log: name-slot
addendum; the position list is **derived + test-pinned**. Session handoff
prepared (BOOTSTRAP refreshed): **next = scope rust-resolution** (D1 env +
tags; `as_form_head()` §A6 rows; hook notes in CC's slice03/05 reports).

### v1.5 — 2026-07-06 (duplicate entry — same event as the fuller v1.5 above; kept for history, marked per v1.7)
slice04 closed (matrix 5→8, originals intact; fixtures 20; 1391/0); its
probe found catch/import-local/label leaking; operator confirmed refinement
#2 **with the derive-don't-accumulate method change**; slice05 scoped;
future entries de-numbered (correcting the v1.4 tail-renumber slip).

### v1.4 — 2026-07-06 (slice03 closed; DD-60 +3 refinement; slice04 inserted, tail renumbered)
slice03 closed (staged; CDC content-verified): walkers on both backends
(`binding.rs`/`binding.js`, `ParamShape` reuse, 16 parity fixtures), D2
everywhere (ID-44 genus dead at the confirmed positions), three-way list
parity in `make check`, matrix disagreement **312→208** with only-D2
movement, suites 1387/0. **Finding:** the walker build exposed DD-60's
binding-position list as incomplete (`if-let`/`when-let`/`match` patterns —
live rc=0 leaks). **Operator: refinement confirmed, packaged as its own
small slice** → **slice04 · walker-extension** (created now; open set
written). Un-created tail entries renumbered: rust-resolution → slice05,
js-resolution → slice06, corpus+close → slice07 (no dirs existed; the
no-bisection rule respected — new work takes the next creation number).
DD-60 refinement log updated (which-child-surfaced: slice03). DD-61 §A6
enforcement rows explicitly pinned into the 05/06 table lines.

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
