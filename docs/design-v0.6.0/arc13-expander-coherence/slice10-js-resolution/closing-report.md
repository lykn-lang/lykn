# Slice 10: js-resolution — Closing Report

**By:** CC (Claude Code) · **Date:** 2026-07-07 · **Branch:** `release/0.6.x`
**Verdict: delivered — DD-60 D1 now holds on the JS backend.** Every
legal-identifier name a user lexically binds *means the binding* on JS, in every
binding position and every reference position, with the label exception intact
(labels do not shadow values — DD-60 ‡). The JS matrix columns meet their DD-60
targets; the Rust columns are byte-identical (no Rust source touched); the
`.lykn` corpus and the whole JS suite are green. This is the mirror of slice06.

## Architecture as built (grounded)

`read → expand[+resolve] → compile`

The load-bearing fact (slice-doc, recon): the JS expander lowers surface→kernel
**inline and monolithically** — a hit on the DD-37 classifier lowers the whole
form and re-walks the emitted kernel with one env. So resolution cannot be a
separate pass (Rust's shape); it lives **inside** the `expandExpr` walk.

- **One env threaded through `expandExpr(form, env)`** — an immutable `Set` of
  in-scope value names (each recursion gets its own env; scope-exit is
  automatic, no truncation). The env is consulted **only at head position**
  (arguments/values always compile to identifiers/literals regardless of tag),
  which is what makes the region model tractable.
- **The ref gate (F-2):** a head atom bound in `env` (or already tagged `ref`)
  is tagged `ref`, emitted as a plain call, and skips classifier + user-macro +
  kernel dispatch. Sanctioned kernel (`isKernel`) is exempt — the compiler's own
  `(array …)` output is never re-read as a bound reference.
- **`scopePlan(form)`** (port of Rust `resolver::scope_plan`, dispatching on both
  surface and kernel heads) drives the default branch: `Sequence` hoists
  `bind`/import names across siblings; `Body{names, bodyStart}` keeps a loop
  iterable / scrutinee outside the binding's scope.
- **`formHead(node)`** in `compiler.js` — the `as_form_head` mirror: the name for
  untagged atoms, `null` for `def` and `ref`. The single dispatch door
  (`macros[headName]`, compileExpr's list case) reads through it; a `ref` head
  falls through to a plain `CallExpression`.

### The open sub-question, decided on contact

**Surface-level env extension and kernel-level `scopePlan` are two mechanisms
that must agree, applied mutually-exclusively per form** — forced by monolithic
lowering + no spans on JS atoms:

- **Function-family (`func`/`genfunc`/`fn`/`lambda`/`genfn`)** lower to
  `function`/`=>`/`function*`, whose param lists `bindingsIntroduced` does not
  re-expose (it returns only the decl name). Their bindings are added to the env
  at the **surface** level, before lowering (bodyStart 0 → whole body in scope,
  no region to protect).
- **Everything else** (`for-of` stays `for-of`; `bind`→`const`; `if-let`/
  `match`→inner `const` decls; `class` reaches the default branch) re-exposes its
  binders at the kernel level, where `scopePlan` extends the env region-correctly.

Extending at **both** would double-shadow a `for-of` iterable — the mutual
exclusivity is the invariant. (CDC's design sketch proposed a single uniform
`scopePlan` over both stages; on contact that dissolves for the region-bearing
forms but **not** for the function-family, whose params vanish at the kernel
level — so the answer is "two that agree", not "one".)

## Per-row walk (6 rows)

**F-1 — env + tags in the walk — MET.** One immutable `env` threaded through all
16 `expandExpr` call sites, extended only via `bindingsIntroduced` (skipping
`kind === "label"` for the value env). Region model mirrors `scope_plan`:
`for-*` body after the iterable (bodyStart 3), `if-let`/`when-let`/`match` after
the scrutinee (bodyStart 2), decls scope over following siblings only (Sequence
hoist), `func`/`class` names in own body + siblings, function-family params over
the whole body. Atoms tagged `def` (binder atoms via `bindingsIntroduced`, which
now carries the binder `node`) / `ref` (bound heads) as an own property;
compiler-generated atoms (classifier `sym()`, gensyms) stay untagged.
**Region probe green:** `(for-of array #a(1) (array 987))` → `for (const array of
[1]) array(987)` — iterable `[1]`, never `array(1)`. Evidence:
`test/expander/resolution.test.js` (11 tests: region probes, scope exit,
label-non-shadow, def/ref tags, tag survival, compiler-generated-untagged).
*Disclosed artifact:* a function-family **simple** param that is a form-name
(`(fn (:any array) …)`) ends up tagged `ref` rather than `def`, because the
lowered `=>` param list is re-walked as an expression with the param in scope.
Inert (the compiler reads param lists structurally), and output is correct.

**F-2 — dispatch gating — MET.** A lexically bound head skips
`classifySurfaceForm` and `macroEnv` (plain call, tagged `ref`); binding-position
atoms are never dispatched (they sit in pattern/param/name positions, not at any
dispatch site). This fixes JS's throws-from-the-binding-site rows: `(fn (:any
obj) (obj 987))` was `throws`, now `obj(987)`; `(fn (:any cell) (cell 987))` was
`macro-fires`, now `cell(987)`. `kernel:` escape unaffected. Evidence:
resolution.test.js F-2 case; the matrix (below).

**F-3 — `formHead(node)` + compiler consumer — MET.** `formHead` added to
`compiler.js`; the single dispatch door (`compileExpr` list case,
`macros[head.value]` → `macros[formHead(head)]`) converted. All other 18
`.value ===` head reads are **structural** (import/export `alias`, decl kind in a
loop slot, destructure target, export `names`, try `finally`/`catch`, switch
`default`, object `spread`/`computed`, object/array pattern `rest`/`default`/
`alias`, accessor `get`/`set`) — each marked `A6-exempt`. A `ref` head emits a
plain readable call (`array(987)`).

**F-4 — JS static conformance check — MET.**
`test/expander/a6-dispatch-conformance.test.js` scans `compiler.js` for form-head
dispatch reads (`macros[<x>.value]` and head `.value ===`) and fails unless each
uses `formHead` or is `A6-exempt`-marked. **Seeded-violation demo:** reinstating
`macros[head.value]` at the door fails the check (`compiler.js:1783`); removed →
green. The third instantiation of the A-7 / slice06-F-4 pattern (JS twin).

**F-5 — matrix: JS columns → targets; no leaks — MET.**
- **Every legal-ident × non-label cell on JS = `calls-binding`** (func-param
  through import, surface + kernel-head names). JS `calls-binding` 323 → 874;
  `throws` 1453 → 1010; `macro-fires` 120 → 12. Divergence 601 → 56 cells (3%).
- **Reserved-word / kernel-only rows** → `✗throw` both backends (D2 intact).
- **Label column** kept: labels do not shadow values (`(label array (block
  (array 987)))` → `[987]`, the array form fires). Not "fixed". DD-60 ‡ honoured.
- **Rust columns byte-identical:** no `packages/**`… wait — no `crates/**` source
  touched (`git status crates/` empty); Rust `macro-fires` = 22 = the slice06
  label residual.
- **Corpus outputs unchanged** — `make check` green (test-suite + docs).
- **No Rust/corpus movement = no leak.**

**F-6 — green bar — MET.** `make check` ✓ (build + lint + fmt + Rust tests + JS
suite + `.lykn` corpus + docs). `./bin/lykn` rebuilt before every matrix/probe
run (the import map resolves `lang/` to `target/lykn/build/lang/`, so
`./bin/lykn build` must refresh the artifacts before the JS pipeline reflects a
source edit — a trap that cost one confused matrix run mid-slice). **JS test
migrations: NONE** — the migration landscape is empty (recon-confirmed; DD-60
blast radius 0). No old throws-behavior assertions existed to migrate.

## The three named design tensions — resolved

1. **D2 timing asymmetry — DOCUMENTED (not unified).** JS validates reserved
   names at `expand()` entry via `walkBindings` on surface forms (pre-lowering).
   Measured on contact: a macro whose template *lexically* contains the binder
   (`` `(bind if 0) ``) **is** caught on JS — `walkBindings` recurses the
   quasiquoted template and sees the literal `(bind if 0)`. The residual gap is
   only a name **constructed** into a binder position from a macro argument
   (`` `(bind ,n 0) `` with `(mk if)`): Rust catches it post-expansion; JS today
   hits an unrelated macro-expansion error on that same input, so it is not a
   clean silent rc=0 leak either. The threaded env does **not** make a
   post-expansion reserved-name check cheaper (`validateReservedNames` rides the
   env-independent `walkBindings`), so "unify" would mean a second
   `validateReservedNames(expanded)` pass — a behavior change better scoped on
   its own. Blast radius ~0. Documented; routed to the corpus/arc-close slice as
   a bubble-up rather than folded in here.
2. **Tag survival through rebuilds — PINNED.** The `ref` tag is set by mutating
   the head atom **in place** (preserving node identity for the `markKernel`
   WeakSet), and `emitSurfaceForm` reuses body sub-forms, so the tag rides
   through surface→kernel lowering. `resolution.test.js` "tag survival" pins it
   (`fn`→`=>`, body head still `ref`).
3. **Browser bundle — NOTE.** The 73 KB browser bundle is generated on demand by
   `lykn build --browser` (esbuild over `packages/lang`); there is no committed
   bundle to go stale. Source changes are picked up on the next build; `make
   check` does not (and need not) regenerate it.

## Bubble-up to arc13 (for the corpus + arc-close slice)

- **Backend-agreement snapshot (the A-4 baseline):** 56 disagreeing cells remain
  (of 1947). They are three classes, none a leak:
  1. **Label column** (shape-strict form names: `fn`/`func`/`and`/`or`/`bind`/
     `obj`/`assoc`/`dissoc`/`conj`/`match`/`type`/`express`/`assign`/`async`/
     `get`/`lambda`/`macro`): Rust falls through to a call (or fires) on the
     shape-mismatched reference `(fn 987)`, JS throws. **Pre-existing**
     accidental-shadowing asymmetry (DD-60 §Context) — labels don't shadow, so
     D1 does not apply; unchanged by this slice (label kind is filtered from the
     value env, so label behaviour is byte-identical to pre-slice JS).
  2. **`macro` row** (bind/destructuring/import): JS reaches the DD-60 target
     (`macro(987)`), Rust still throws — **JS ahead of a Rust gap** (Rust's
     expander light-scan does not gate the `macro` head when bound).
  3. **`kernel:if` row**: JS `throws` where Rust `invalid-output` — pre-existing
     strict-mode asymmetry (matrix compiles JS strict, Rust `--no-strict`).
  The corpus slice should reproduce A-4 against this snapshot; classes (1) and
  (3) are matrix/backend-shape artifacts, class (2) is a Rust follow-up.
- **D2-timing disposition:** documented asymmetry (above) — candidate for a small
  unification slice if the operator wants macro-emitted reserved-binding coverage.
- **Migration list:** empty (no tests asserted the old behaviour).
- **Hook note for the corpus:** the region probe, the label non-shadow, and the
  bound-form-head-is-a-call cases are the load-bearing corpus fixtures; the JS
  pipeline needs `./bin/lykn build` (artifact refresh) before any JS probe.

## Silent-drop diff (what moved, what didn't)

- **JS, moved (toward DD-60):** every legal-ident × non-label cell → `calls-binding`
  (323→874); the throws-from-the-binding-site and macro-fires rows for bound
  form names collapse to plain calls. Below-matrix: bound user macros and bound
  desugars now call the binding.
- **JS, deliberately not moved:** the label column (D1 does not apply);
  reserved-word / kernel-only rows stay rejecting; `kernel:`-prefixed stays
  unbindable.
- **Rust + corpus: nothing moved.** No `crates/**` touched; corpus green.

## Findings surfaced (not folded)

1. **`bindingsIntroduced` sites now carry the binder `node`** (purely additive —
   D2 reads only `name`/`kind`; the walker-parity test is behavioural). This is
   the sanctioned "consumes `bindingsIntroduced` only" path for def-tagging.
2. **Function-family simple params tag `ref`, not `def`** (disclosed in F-1) —
   inert, a consequence of re-walking the lowered `=>` param list as an
   expression with the param in scope. A precise fix would need param-list
   structural awareness the flat walk does not surface; not worth it while inert.
3. **The `lang/` import map → `target/lykn/build/lang/`.** The JS pipeline is
   exercised through the *build artifact*, not `packages/lang` directly, so
   `./bin/lykn build` must refresh artifacts before any `deno test` / matrix run
   reflects a source edit. (Cost one confused matrix run before it was spotted.)

## Discipline notes

- Source only touched (`packages/lang/{expander,compiler,binding}.js` + two new
  `test/expander/*.test.js`); the closing report + ledger live under
  `docs/design-v0.6.0/**`. No safety-gate shortcuts; every mechanical sweep was
  an exact-string edit, dry-run-diffed.
- `./bin/lykn` rebuilt (and `./bin/lykn build` artifacts refreshed) before every
  matrix/probe run.
