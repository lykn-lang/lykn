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

## Recon addendum (2026-07-07 — fresh-context handoff)

The prior session self-stopped **before writing any source** — recon only,
tree clean at **`a9a5131`** ("Started slice10."), the ledger stands (this is a
recycle, not an iteration — nothing was delivered). It read the slice-doc,
slice06's closing report, and the JS pipeline, and grounded the following so
the fresh session starts from evidence, not the open set's implications.

### Architecture findings (grounded in the tree)

- **`bindingsIntroduced` (binding.js:44) dispatches on *surface* heads.** It
  returns the full binder set for `func`/`genfunc`/`fn`/`lambda`/`for-of`/
  `if-let`/`match`/`class`/`type`/`catch`/`import`/`bind` — but for a **kernel**
  decl head (`function`/`const`/… via the `DECL_HEADS` default case) it returns
  **only the declared name**, not params. **Consequence — the load-bearing
  constraint the open set only implied:** the value env must be extended at the
  **surface** level, *before* the expander lowers. Extending it after lowering
  (on kernel forms) would miss `func`/`fn` params → a matrix leak.
- **The JS expander lowers surface→kernel *inline and monolithically*.**
  `expandExprInner` (:777) calls `classifySurfaceForm(head.value, …)`; on a hit
  it `emitSurfaceForm(...)` → one `expandExpr(markKernel(kernel))` on the whole
  emitted form. So there is no Rust-style "after macro-expand, before lower" gap
  in which a separate resolver pass could run — and a **pre-**pass is ruled out
  because user macros expand *during* the walk and produce fresh atoms that need
  resolving (DD-60 §A4). Resolution must live in the walk.
- **The design core is `region-model × monolithic-lowering`.** slice06's lead
  hook note — a binding is *not* in scope over its own initializer / iterable /
  `match`-subject / `if-let` scrutinee (`(for-of array #a(1) …)` must stay
  `[1]`, never `array(1)`) — was clean on Rust because its resolver is a
  *separate* pass with full per-region env control. On JS the monolithic
  lowering recurses the whole form with one env, which fights per-region control.
  **This is where a subtle error becomes an F-5 leak** (Rust-column/corpus
  movement = STOP). Diagnose and resolve *this* first; the rest (F-2 gating, F-3
  `formHead`, F-4 static check) is well-defined mirror-work off slice06.
- **Inventory for the mechanical rows.** `formHead` does **not** exist yet
  (create it — the `as_form_head` mirror: name only for untagged atoms, `null`
  for `def` *and* `ref`). `compiler.js` has **21 `.value ===`** reads (dispatch
  + structural — most structural; mark those exempt, the slice06 A6-exempt
  lesson, and expect ~a handful of genuine dispatch reads to convert around the
  `switch (head.value)` at :1802). No `.binding` atom property is used anywhere
  yet (clean to add as the own-property tag). **16 `expandExpr` call sites** in
  `expander.js` to thread the env through.

### Region-model approach — CDC's design sketch (validate on contact, not a directive)

Offered as CDC's guess for the fresh session to *test*, not a mandate — if it's
wrong on contact, **that finding is itself the bubble-up**:

> Since lowering hands the emitted kernel form back to the **same** recursive
> `expandExpr`, a **single `env` parameter threaded through the walk** plus a
> **`scopePlan(form)` defined over *both* surface and kernel heads** (kernel
> decl-and-siblings included — the kernel shapes are few and known) may dissolve
> the monolithic-lowering tension: the recursion becomes uniformly region-aware
> regardless of which stage (surface or kernel) a form is caught at. This is also
> structurally closest to what Rust's `resolve_seq` / `scope_plan` pair does —
> the fresh session should port that model, not invent one.

Concretely, that means: thread `env` through `expandExpr`/`expandExprInner`
(default it at the public entry so existing callers are unaffected); a JS
`scopePlan(form)` returning `Sequence` vs `Body { names, bodyStart }` mirroring
Rust's `resolver.rs`; a `resolveSeq`-analogue that carries the env across list
children so `bind`/decl names hoist to **following siblings only** (not their own
value); `func`/`class` names in own-body + siblings; the disclosed multi-clause /
method-param over-approximation kept **aligned with Rust's** (divergence there is
a leak). Tag `def` at binder atoms, `ref` at bound heads; compiler-generated
atoms (classifier `sym()` output, gensyms) stay untagged. **Non-negotiable
region probe:** `(for-of array #a(1) …)` → `[1]`.

Open sub-question for the fresh session to decide-on-contact: whether the
surface-level env extension (needed because `bindingsIntroduced` is surface-only)
and the uniform kernel-aware `scopePlan` are the *same* mechanism or two that
must agree — i.e. does `scopePlan` need to compute regions for kernel `function`/
`for-of` too, and if so does `bindingsIntroduced` need a kernel-aware companion
for the param sets it currently drops? Surface the answer.

### Migration-triage plan (F-6's "list every JS test you migrate")

~126 test files touch `throw`/`toThrow`; **most are unrelated** (reader/kernel/
publishing errors). The migration class is narrow and specific: tests asserting
the **old** throws-from-the-binding-site or macro-named-param behavior that D1
now turns into `calls-binding`. Triage: `grep` the corpus/JS suite for fixtures
that bind a macro/surface/kernel-form name and assert a throw or the fired-macro
output; each flipped assertion is a **behavior change** for arc09's breaking
notes (matrix-verified blast radius 0 in-tree). List them per-file in the closing
report; do **not** silently rewrite — route the class to arc09.

### Named tensions — carried forward unresolved (decide on contact)

D2-timing (JS validates reserved names at `expand()` entry :1596, pre-lowering;
the threaded env may make a cheap post-expansion check possible — unify+test or
document the asymmetry); tag survival through `quasiquote`/`markKernel`/
classifier rebuilds (pin with a test — verify the tagging point sits after the
rebuilds that matter); browser-bundle regen (note if the 73KB bundle needs a
regen step beyond `make check`). All three are still open — the recon did not
touch them.

### Tree state

Clean at `a9a5131`; no source modified; `bin/lykn` current as of slice09's
close. First act for the fresh session (per F-1's spirit): re-read this addendum
+ slice06's closing report, then start with the region model.
