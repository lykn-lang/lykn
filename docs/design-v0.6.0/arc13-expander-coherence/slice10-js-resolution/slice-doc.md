# Slice 10: js-resolution

> **DD-60 D1 on the JS backend, per DD-61 §A3 — the mirror of slice06.**
> Rust is done (slices 06–09: resolver + light scan + `as_form_head()` +
> static check + by-construction privacy). This slice brings
> `packages/lang` to the same targets: one env threaded through the
> `expandExpr` walk (on JS the scan and the tagger are **the same
> walk** — the expander lowers surface→kernel during expansion, so
> resolution must live inside it), `formHead()` as the dispatch door in
> `compiler.js`, and the JS static grep-conformance check (§A6's JS
> twin). **Acceptance = the matrix: JS columns → DD-60 targets; Rust
> columns byte-identical** (the exact mirror of slice06's F-5).
> Slice06's closing-report hook notes are this slice's spec-companion —
> read them before any code.

## Goal

Every legal-identifier name a user lexically binds **means the binding**
on JS — in every binding position (the walker's derived set) and every
reference position — with the label exception intact (labels do not
shadow values; **do not "fix" the label column** — DD-60's ‡ footnote
and refinement #4 state this as confirmed semantics). After this slice
the two backends should agree on (essentially) every live matrix cell;
the corpus+close slice reproduces A-4 formally.

## Architecture (grounded in the tree, 2026-07-07)

The JS pipeline dispatches heads in **two** places (vs Rust's four):

1. **Expander** — `expander.js::expandExprInner` (:718): head dispatch in
   order — quasiquote/unquote (:737–750), the `kernel:` escape (:757 —
   unaffected: `kernel:x` is not a bindable name), **DD-37 classifier**
   (:777 `classifySurfaceForm(head.value, …)` — the surface-form path),
   **user macros** (:788 `macroEnv.has(head.value)`, fixed-point).
   The env lives here: entering a form extends it per the region model
   from `bindingsIntroduced` (binding.js:44 — the single what-binds
   source; kinds are strings; skip `kind === "label"` for the value
   env, mirroring Rust's `shadows_values()`); **binding-position atoms
   are tagged `def` and never dispatched** (this alone fixes JS's
   throws-from-the-binding-site rows — the slice03 D2-timing note);
   a bound head skips classifier + macro dispatch → plain call, tagged
   `ref`.
2. **Compiler** — `compiler.js` kernel-head dispatch (`switch
   (head.value)` :1802 and the `head.value ===`-style reads; ~54
   `.value ===` reads across the four files, most structural/non-
   dispatch — the Rust A6-exempt lesson transfers). Consumes tags via
   **`formHead(node)`**: the name only for untagged (unresolved) atoms,
   `null` for `def` *and* `ref` — the mirror of `as_form_head()`. A
   `ref` head emits a plain readable `CallExpression` (`array(987)`).

**The tag** (DD-61 §A1, JS form): an own property on the atom node
(`{type:'atom', value, binding:'def'|'ref'}`; absent = unresolved) —
survives spreads/rebuilds; compiler-generated atoms (classifier `sym()`
output, gensyms) are never tagged, mirroring "reader → Unresolved."

**The region model is the load-bearing import** (slice06's lead hook
note): a binding is **not** in scope over its own initializer /
iterable / scrutinee — a naive whole-subtree push **miscompiles**
`(for-of array #a(1) …)`. Mirror `scope_plan`'s regions: `for-*` body
starts after the iterable; `if-let`/`when-let`/`match` bodies after the
scrutinee; `bind` + kernel declaration escapes scope over *following
siblings only* (the walk must carry the env across list children —
Rust's `resolve_seq` analogue); `func`/`class` names scope over their
own body (recursion) *and* siblings; multi-clause/method params may use
Rust's disclosed conservative over-approximation (keep the two backends'
approximations aligned — divergence here is a matrix leak).

## Design tensions (named at scoping — surface, don't decide silently)

1. **D2 timing asymmetry** (slice03 bubble-up): JS validates reserved
   names at `expand()` entry (:1596), pre-lowering — a user macro that
   *emits* a reserved binding name isn't caught on JS (Rust, post-expand,
   catches it). The threaded env may make a post-expansion check cheap
   here. If cheap, unify and pin with a test; if not, document the
   asymmetry explicitly. Decide on contact, surface the choice.
2. **Tag survival through rebuilds.** The expander rebuilds nodes
   heavily (quasiquote, `markKernel`, classifier emission). Reused atom
   objects keep own-properties; *recreated* atoms don't. Verify the
   tagging point sits after the rebuilds that matter, or that rebuilds
   in the resolved region carry the tag; pin with a test.
3. **Existing JS suite expectations.** Some tests may assert the *old*
   behavior (throws for macro-named params). Migrating those is
   expected and small — but each is a **behavior change**: list them in
   the closing report and route the class to arc09's breaking-change
   notes (D1 on JS: bound names now resolve instead of throwing;
   matrix-verified blast radius 0 in-tree).

## Scope (in)

1. **F-1** — the env in the `expandExpr` walk, region-model scoping,
   def/ref tagging; consumes `bindingsIntroduced` only.
2. **F-2** — dispatch gating: bound heads skip classifier + user-macro
   dispatch; binding-position atoms never dispatched.
3. **F-3** — `formHead()` + the `compiler.js` consumer conversion;
   `ref` heads → plain call.
4. **F-4** — the JS static grep-conformance check, standing in
   `make check` (seeded-violation demo) — DD-61 §A6's JS twin.
5. **F-5** — matrix: JS columns → DD-60 targets; Rust columns
   byte-identical; label column stays `macro-fires` on **both**.
6. **F-6** — green bar.

## Scope (out)

Rust (done — slices 06–09); the conformance corpus and A-4's formal
reproduction (next slice); the label namespace's D1 semantics (labels
don't shadow — confirmed, documented, tested; not implemented); browser
bundle rebuild beyond what `make check` covers (note if the 73KB bundle
needs a regen step — surface, don't fold); any DD-60/61 semantics
change.

## Exit criteria

The ledger's six rows closed: env + tags in the walk, both dispatch
sites gated/converted, the standing JS check, JS matrix columns at
target with Rust byte-identical, `make check` green. Bubble-up: the
backend-agreement snapshot (how many live cells still disagree and why
— the corpus slice's A-4 baseline), the D2-timing disposition, the
suite-migration list for arc09, and anything resolution contact reveals
that the Rust pass didn't already teach us.
