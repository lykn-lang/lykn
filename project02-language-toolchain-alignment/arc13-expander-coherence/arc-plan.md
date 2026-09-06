# arc13 — Expander Coherence (bindings shadow macros, everywhere)

> **Status: CLOSED — gate GO 2026-07-09** (operator ran the full §5
> runbook: ancestry ×6 ok; `make check` 100%; matrix **1947/53 exact**
> with the divergent set = precisely the two documented classes;
> D2/D1 demos verbatim — gate record in `closing-report.md` §5).
> A-4/A-5 reconciled; A-6 hands off to arc05 slice03. Originally: Created from arc05/slice02's F-4
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
| **slice06 · rust-resolution** | Env + resolved-atom tags (DD-61 §A1) through the Rust pipeline (classifier hosts the env; expander gets the light binding-scan); emitter/codegen → read-only consumers via the `as_form_head()` swap (**DD-61 §A6 rows pinned at scoping**: zero dispatch-purpose raw-head reads [F-3] + a standing static check [F-4]; JS matrix columns + corpus outputs byte-identical [F-5] — movement = leak = stop). §A6 *privacy* is phased per the operator call (2026-07-06): this slice lands accessor + `#[must_use]` + check; the `Atom` payload restructure is a follow-up slice. | **Closed** (`dc37ae9`; all 6 rows met; `make check` ✓, suites 1401/0, docs 475/0; Rust matrix at DD-60 targets — macro-fires 182→22, residue = the label column by design; JS + corpus byte-identical; resolver = standalone pass [`resolver.rs`, §A3 as-built deviation, surfaced]; central `SExpr::atom()` landed. First session self-stopped cleanly same day → fresh-context recycle; delivery by the fresh session) |
| **slice07 · atom-privacy-recon** | Recon-only investigation for the atom-payload-privacy layer: construction + pattern censuses, design proposal, LoE + sizing, blast radius. Empty diff at close. | **Closed** (2026-07-07, empty diff; **construction class already retired** by slice06's constructor — 170 calls, 1 bare literal; real blast radius = **~85 field-naming pattern sites across TWO crates** — lead finding: `lykn-cli` has **no separate `SExpr`**, it imports lykn-lang's [phasing-plan premise corrected]; design = `Atom(AtomData)` Option A; **operator 2026-07-07: two slices; `as_atom()` stays as-is**) |
| **slice08 · accessor-sweep** | Privacy pair, step 1 (from slice07's report): `atom_parts()` + convert all ~85 field-naming `Atom` pattern sites to accessors **while fields stay public** — green throughout, behavior byte-identical, both crates (incl. the 5 `lykn-cli` sites); completion gate = zero field-naming patterns outside `ast/sexpr.rs` (slice09's precondition). **Depends on: slice06 (landed).** | **Closed** (`7d86703` + `dab4405`; 6/6 rows; byte-identical, counts unchanged; **F-5 gate CDC-reproduced**; finding: `contains_await` destructure head-read — F-4's blind spot, self-closed by the sweep; behavior question routed → corpus+close scoping) |
| **slice09 · privacy-flip** | Privacy pair, step 2 — the atomic restructure: `Atom(AtomData)`, fields private to `ast::sexpr`; seeded compile-fail demos both crates; `as_atom()` public/unrenamed (operator call), slice06 A6 check stays load-bearing; the DD-61 §A6 by-construction layer lands. **Depends on: slice08.** | **Closed** (`4c12301` — a **single-file** change; 5/5 rows; E0451 proof both crates; size 48→48; finding: `{ .. }` valid on tuple variants → the `Atom(_)` conversions were unnecessary, left minimal; §A6 as-built = visibility + static check + corpus) |
| **slice10 · js-resolution** | The JS mirror of slice06: one env inside the `expandExpr` walk (the JS expander lowers during expansion, so resolution lives in-walk — §A3); binding-position atoms never dispatched; bound heads skip classifier + macro dispatch; `formHead()` (null for defs AND refs) converts `compiler.js`; the §A6 JS static check. **Mirrors the `scope_plan` region model** (naive whole-subtree push miscompiles the iterable) and **keeps the label exception** (DD-60 ‡ — do not "fix" the label column). Acceptance: JS matrix columns → DD-60 targets; **Rust columns + corpus byte-identical** (leak = stop). | **Closed** (`c19a1fb`; 6/6 rows; JS calls-binding 323→874, macro 120→12, **divergence 601→56** — all 56 explained, none a leak: label asymmetry [pre-existing] + `macro` row [JS ahead of a Rust gap] + `kernel:if` [strict]; Rust + corpus byte-identical; migration list EMPTY; the two-mechanism surface-level/scopePlan design surfaced + accepted; staleness trap #4 found [import-map artifacts]) |
| **slice11 · conformance-corpus + dispositions** | The permanent cross-backend corpus in `make check` (≥1 test per name-class × position equivalence class; seeded-divergence demo; matrix stays the audit tool) + recorded dispositions for every residual: the `macro`-row Rust gap (converge), label asymmetry + `kernel:if` (fix-or-document), `contains_await` (probe → decide), the D2-timing constructed-name residual (document). Output feeds A-4. **The arc close is NOT in this slice** — the arc closing-report, arc-scale A-4/A-5 reproduction, ancestry reconciles ×6, DD-61 as-built record, and the operator gate follow as the arc close-set (the old "corpus + arc close" bundling was a mis-label, corrected 2026-07-07). **Depends on: slice10.** | **Closed** (`a0b24b9`, 2026-07-09; 7/7 rows; corpus standing ~1 s w/ seeded-teeth transcript; two fixes — the `macro` row converged on Rust, `contains_await` honours resolution [a latent Rust misfire the probe caught, matrix-invisible]; three documented dispositions; final matrix **1947/53**, every residual documented-as-intended) |

*(Future entries carry **no numbers** — numbered at creation per the
creation-order convention; the v1.4 tail-renumber was a CDC slip, corrected
here.)*

*(Architecture per **DD-61 · Resolve-Once** —
[`design/dd-61-resolve-once-resolution-architecture.md`](design/dd-61-resolve-once-resolution-architecture.md):
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

See [ledger.md](ledger.md). Historical rows were extracted without changing their dispositions during project06-planning-reorg.

## 5. Version History

### v1.18 — 2026-07-09 (GATE GO — ARC13 CLOSED)
Operator ran the full §5 runbook same day: ancestry ×6 ok; rebuild;
`make check` 100%; **matrix 1947/53 exact** (tallies byte-identical to
slice11's snapshot; CDC recounted the divergent set from the transcript
— 38 form-named-label + 15 `kernel:if`, nothing else); D2/D1 demos
verbatim. A-4/A-5 → done/**reconciled**; attested slice rows reconciled
via ancestry + workspace-green; **A-6 stays open by design** (closes at
arc05 slice03 scoping — its Verify is that scoping note). P-18 flipped
in project-plan (v1.25); arc05 UNPAUSED. Which-child-surfaced: the gate.

### v1.17 — 2026-07-09 (slice11 closed — ALL SLICES DONE; arc → CLOSING; closing-report written)
slice11 closed (`a0b24b9`; 7/7; the corpus stands in `make check` ~1 s
with demonstrated teeth; final matrix **1947/53**, both residual classes
documented-as-intended). Two probe-grounded fixes: the **`macro` row
converged** on Rust (pass1/pass2 binding-aware macro-def detection,
reusing `hoisted_names`) and **`contains_await` honours resolution**
(a latent, matrix-invisible Rust misfire — bound `await` in an
async-gated wrapper was reinterpreted as the operator; the slice08
routing paid off exactly as designed). Three documented dispositions
(form-named-label shape asymmetry → DD-60 refinement note written by
CDC; `kernel:if` edge 4; D2-timing constructed-name residual —
diagnostic quality only, probe-pinned). A-14/A-15 done. **The arc
closing-report is written** (slice walk 11/11; A-row walk; the §5
operator gate runbook; bubble-up to project). DD-61 as-built record
complete (incl. the dispatch-vs-heuristics caution). Formal close =
the host gate. Which-child-surfaced: slice11.

### v1.16 — 2026-07-07 (slice11 scoped — the arc's last slice; the "corpus + arc close" bundling corrected)
**Operator question at scoping ("sounds like a new arc?") answered: no**
— this is arc13's own recomposition (the corpus is in the capability
statement; the dispositions are the arc's bubble-up findings); a new arc
would close arc13 by fiat. But the instinct caught a real mis-label:
**the arc close is not slice work** — the old "conformance-corpus + arc
close" row bundled the arc close-set (closing-report, arc-scale A-4/A-5
reproduction, ancestry reconciles ×6, DD-61 as-built record, operator
gate) into a slice; corrected — those follow slice11 as the close-set
per LEDGER-DISCIPLINE §B. **slice11 · conformance-corpus + dispositions
scoped** (7-row open set): the standing corpus (≥1 test per equivalence
class; vehicle on timing evidence; seeded-divergence demo) + the five
dispositions (the `macro`-row Rust gap; label asymmetry; `kernel:if`;
`contains_await`; the D2-timing residual — each probe → decision →
recorded). A-14 (slice11 closed) + A-15 (routed findings dispositioned)
accrued. Which-child-surfaced: slice10 (the baseline) + operator
(the structure catch).

### v1.15 — 2026-07-07 (slice10 closed — DD-60 D1 holds on BOTH backends; A-10 done)
slice10 closed (`c19a1fb`; 6/6; the second fresh-context recycle
delivered same-day again). JS: calls-binding 323→874, macro 120→12,
throws 1453→1010; **divergence 601→56, every residual explained**;
Rust columns + corpus byte-identical; migration list empty. The design
decision surfaced + accepted: **two mechanisms that must agree** —
function-family params env-extend at the surface level (lowered param
lists don't survive to `bindingsIntroduced`), everything else through
the uniform `scopePlan` walk (extending at both would double-shadow a
`for-of` iterable). Dispositions: `ref`-not-`def` on simple params =
disclosed, inert; **D2 timing = documented, not unified** (JS catches
lexically-visible macro-emitted reserved binders; the constructed-name
residual → corpus+close); **the 56-cell baseline = A-4's input, three
classes each needing a corpus+close disposition** (label asymmetry /
the `macro` row — a *Rust-side* gap JS is now ahead of / `kernel:if`
strict); **staleness trap #4** (import-map artifacts —
`target/lykn/build/lang/`; `./bin/lykn build` before probes) → issues
log. Which-child-surfaced: slice10.

### v1.14 — 2026-07-07 (slice10 recon done in-session; self-stop → second fresh-context recycle)
CC ran a recon-only pass on slice10 (tree clean at `a9a5131`) and
self-stopped with a recommendation rather than pushing through at the
tail of a six-slice session — operator + CDC concur: **fresh-context
handoff** (the slice06 pattern, second use; it delivered same-day last
time). Recon findings sharpen the open set: **(1) `bindingsIntroduced`
dispatches on *surface* heads** → the env must extend at the surface
level, *before* lowering; **(2) the monolithic lowering**
(`classifySurfaceForm` → `emitSurfaceForm` → one recursive `expandExpr`
on the emitted kernel) is in tension with per-region env control — the
region model must hold across *both* surface and kernel shapes; this is
the slice's real design work; **(3)** `formHead` doesn't exist yet;
`compiler.js` has 21 `.value ===` dispatch/structural reads; no
`.binding` property in use (clean to add); 16 `expandExpr` call sites to
thread; ~126 test files touch throw-assertions (migration triage).
CC writes the handoff as a **Recon addendum** in slice10's
`cc-prompt.md` (the proven mechanism). Not an iteration — no delivery
attempted; ledger untouched. Which-child-surfaced: slice10 (recon).

### v1.13 — 2026-07-07 (slice10 · js-resolution scoped)
Open set written (slice-doc / 6-row ledger / cc-prompt), grounded in
`packages/lang` at current lines: **two** dispatch sites on JS (vs
Rust's four) — `expandExprInner` :718 (quasiquote → `kernel:` escape
:757 → DD-37 classifier :777 → user macros :788) and `compiler.js`
kernel-head dispatch (:1802 + ~54 `.value ===` reads, most structural —
the Rust A6-exempt lesson transfers). Resolution lives **in-walk** (§A3:
the JS expander lowers surface→kernel during expansion — no post-pass
option), which also makes scan-and-tagger one thing on this backend.
Slice06's hook notes lifted into the rows: the **region model** (F-1,
with the iterable probe non-negotiable), the **label exception** (F-5 —
DD-60 ‡, do not "fix"), `formHead()` null for defs AND refs (F-3),
the JS static check (F-4). Tensions named: D2-timing unification
(decide-and-surface), tag survival through rebuilds (test-pinned),
JS suite migrations = behavior changes (list → arc09). A-10 updated:
js-resolution = slice10 (numbered at creation).
Which-child-surfaced: slices 06/09 (hook notes + as-built).

### v1.12 — 2026-07-07 (slice09 closed — the privacy pair is complete; A-11 done; next: scope js-resolution)
slice09 closed (`4c12301` — **one file**, `ast/sexpr.rs`, exactly the
atomicity the phasing bought; 5/5 rows; E0451 compile-fail proof in both
crates; size 48→48, no boxing). **A-11 done: DD-61 §A6 is fully landed
on Rust** — `as_form_head()` + static check (slice06) + by-construction
privacy (slice09) + the corpus (arc gate). Findings dispositioned:
`{ .. }` rest-pattern valid on tuple variants → the scoped `Atom(_)`
conversions were unnecessary (left minimal per spec; cosmetic
normalization → post-0.6.0 polish list); a disclosed-and-recovered
process near-miss (checkout-based probe cleanup reverted uncommitted
work — caught immediately; lesson: surgical edits over checkout on
uncommitted trees). **Next: scope the js-resolution slice** (numbered at
creation) from slice06's hook notes — the `scope_plan` region model, the
label exception, `formHead()` + the JS static grep check.
Which-child-surfaced: slice09.

### v1.11 — 2026-07-07 (slice08 closed — the sweep is done; slice09 is GO)
slice08 closed (`7d86703` + `dab4405`, two green increments; 6/6 rows;
behavior byte-identical, counts unchanged 1401/0 + 475/0 + 1136/0).
**The F-5 completion gate — zero field-naming `Atom` patterns outside
`ast/sexpr.rs`, both crates — was independently reproduced by CDC**, so
slice09's precondition is verified twice. **Finding (surfaced, not
folded): `contains_await`** (`emitter/forms.rs:59`) — a
destructure-shaped head-dispatch read the slice06 F-4 check was
structurally blind to (it greps `as_atom()` calls); converted
byte-identical + `A6-exempt`-noted; the *behavior* question (should
async-ness detection honour resolution? a bound `await` param arguably
shouldn't mark a body async) is **routed to the corpus+close slice's
scoping** as a probe row + decision. Structural note: the sweep
self-closes that blind-spot class — destructure dispatch reads no
longer exist, and post-flip they cannot compile. Emergent conversion
idioms recorded in the closing report for slice09/js-resolution
reviewers. Which-child-surfaced: slice08.

### v1.10 — 2026-07-07 (slice06 formally closed; slice07 closed; privacy split into slices 08/09)
**slice06 CLOSED** — source landed (`dc37ae9`; A-9 done, attested; host
ancestry reconcile folds into the arc-close gate). **slice07 CLOSED**
(A-13; empty diff; CDC reproduced the lead finding): the construction
class was already retired by slice06's constructor; the real work is
**~85 field-naming pattern sites across two crates** — the phasing
plan's "separate `lykn-cli` `SExpr`" premise was **false** (a CDC
scoping error inherited from AGENTS.md's stale architecture note —
routed to arc07 as a docs fix). **Operator decisions (2026-07-07):**
(1) **two slices** — the un-numbered *atom-payload-privacy* entry splits
into **slice08 · accessor-sweep** (convert while fields public; green
throughout; both crates) + **slice09 · privacy-flip** (atomic
`Atom(AtomData)` restructure; seeded compile-fail demos) — A-11 amended
accordingly (was: single slice); (2) **`as_atom()` stays public,
unrenamed** — privacy strengthens §A6 layer 1, the slice06 static check
stays load-bearing; recorded in DD-61's refinement log as as-built.
Open sets for 08/09 written from slice07's closing report.
Which-child-surfaced: slice07.

### v1.9 — 2026-07-06 (slice06 delivered; CDC content-verified; commit pending)
Fresh-context pickup delivered all 6 rows same day. **CDC verification:
accepted** (structure reproduced by code review — `NameRes` +
`SExpr::atom()` + tag-insensitive `PartialEq` to spec; `ScopePlan`
regions; one `bound` gate over desugar + macros; `as_form_head()` honors
the tag; A6 conformance test with seeded demo; runtime rows attested).
**Formal close = source-only commit + ancestry check → A-9.** Bubble-up
findings routed: §A3 as-built deviation (standalone resolver pass — same
resolve-once substance) → the corpus+close slice's DD-61 as-built
record; the **`scope_plan` region model** (bindings not in scope over
initializer/iterable/scrutinee — naive push miscompiles) → pinned into
the js-resolution row above; label cells stay `macro-fires` by design →
DD-60 textual refinement **confirmed + folded same day** (label
exception now stated in the per-cell target table, ‡ footnote +
refinement-log entry; odm 0062 mirror = Duncan); two disclosed
simplifications (decl self-reference → `Sequence`; multi-clause param
over-approximation) recorded, blast radius 0, corpus-pinned. The central
constructor landed → the *atom-payload-privacy* follow-up shrinks to the
field-visibility step, as planned. Which-child-surfaced: slice06.

### v1.8 — 2026-07-06 (slice07 · atom-privacy-recon scoped; slice06 self-stop → fresh-context recycle)
**slice07 created** (operator call: a research pass before the privacy
restructure — the slice02 lesson applied proactively): recon-only open
set written (censuses / design options / LoE + sizing / blast radius /
empty-diff guard); A-13 opened; the un-numbered *atom-payload-privacy*
entry now explicitly consumes slice07's closing report. **slice06
self-stop (same day, in-flight):** the first session reverted cleanly at
`0055ba1` after a byte-offset fix script corrupted files — context
exhaustion named honestly at the tail of a long session; per
LEDGER-DISCIPLINE this is a **fresh-context recycle, not an iteration**
(nothing delivered; open set unchanged; ledger rows untouched).
Findings carried (cc-prompt handoff addendum): the field add breaks only
**~59 sites** (31 constructions + 28 non-`..` patterns — the ~259 was
the total site population, most absorb via `..`); `NameRes` designed
(`#[non_exhaustive]`, `Default = Unresolved`); tension #2 decided by CC
= **tag-insensitive `PartialEq`**; `as_form_head()` returns `None` for
*any* non-`Unresolved` atom (defs and refs). Which-child-surfaced:
slice06 (in-flight CC census + self-stop report).

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
