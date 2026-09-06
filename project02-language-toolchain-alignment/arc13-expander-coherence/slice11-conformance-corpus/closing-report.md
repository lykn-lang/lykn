# Slice 11: conformance-corpus + dispositions — Closing Report

**By:** CC (Claude Code) · **Date:** 2026-07-09 · **Branch:** `release/0.6.x`
**Verdict: delivered — arc13's convergence is now permanent and its residual
is zero-ambiguity.** A standing cross-backend corpus rides in `make check`
(≥1 test per name-class × position equivalence class), with a demonstrated
seeded-divergence gate. Every one of the 53 remaining matrix disagreements is
either **fixed** (the `macro` row converged; a latent `await` misfire closed)
or **documented-as-intended** with a rationale a future session can find. This
is the last slice of arc13; the arc close-set (arc closing-report, arc-scale
A-4/A-5, ancestry reconciles, DD-61 as-built) follows as CDC + operator work.

## Headline numbers

| measure | slice10 close | slice11 close |
|---|---|---|
| divergent matrix cells (of 1947) | 56 | **53** |
| Rust `calls-binding` | 899 | **902** (+3, the `macro` row) |
| Rust `throws` | 960 | **957** (−3) |
| residual classes | 3 (all to disposition) | **2, both documented-as-intended** |

The 53 residual cells: **38 form-named-label** (32 surface-form + 6 kernel-head)
+ **15 `kernel:if`**. Both classes are pre-existing, orthogonal to DD-60's
name-binding semantics, and now pinned by the corpus as expected divergence.

## The corpus (F-1 — MET)

`test/expander/conformance-corpus.test.js` — 9 `Deno.test` blocks, **~1.0 s**
in `make check` (measured standalone; the corpus's `make check` cost delta).

- **Vehicle, decided on timing evidence.** The full matrix shells `./bin/lykn`
  per cell + `deno check` per name: **14.3 s** — too slow for `make check`, and
  it stays the on-demand audit tool. `compileBoth` (byte-identical Rust≡JS) was
  tried and **rejected**: the region-bearing forms (`if-let`/`when-let`/`match`)
  desugar to a bare block on Rust and an IIFE on JS — a benign *formatting*
  divergence (already documented in `packages/testing/helpers.js`) that both
  resolve identically. The corpus therefore uses the **matrix's own
  classification method** — does the output call the binding (`name(987)`)? —
  applied to both backends per cell. Resolution-focused, formatting-robust, and
  it still catches any real divergence (F-2 proves it).
- **Coverage bar met.** Published as a header comment mapping every equivalence
  class → the test that pins it: control / surface-form / kernel-head legal
  idents (D1, every value-shadowing binding × ref position); the `macro` row
  (F-3); the region model (initializer/iterable/scrutinee outside scope);
  reserved words (D2, every binding position); the label exception (DD-60 ‡);
  and the two documented residuals.
- The matrix stays the audit tool (`tools/conformance-matrix.js`, unchanged).

## Teeth (F-2 — MET)

Seeded-divergence demo, both backends, transcript in the ledger's evidence:

- **JS break:** `formHead` (compiler.js) made to ignore the DD-61 ref tag → a
  bound head dispatches as a form again → the corpus goes **red** on
  *kernel-head shadow* and *region model* (2 tests). Restored → green;
  `compiler.js` byte-identical to committed.
- **Rust break:** pass1's top-level binding-scan removed → a bound `macro` head
  is treated as a leaked definition again → the corpus goes **red** on the
  *macro row*. Restored → green.

A corpus that cannot fail is theatre; this one fails on a resolution regression
on either backend, in a binding or a reference position.

## The five dispositions (probe → decision → where recorded)

### 1. The `macro` name row — FIXED (Rust converged; F-3)

- **Probe.** `(bind macro 0)\n(macro 987)` → Rust threw *"macro expansion error:
  Cannot read properties of undefined"*; JS emitted `const macro = 0; macro(987)`.
  Root cause (grounded, not guessed): the expander's macro passes run only when
  a top-level `(macro …)` head is present (`expander/mod.rs` `has_macros` scan),
  and a top-level `(macro 987)` *reference* trips that scan. pass1's
  `is_macro_def` then treats `(macro 987)` as a **definition** and sends it to
  `compile_macro`, which chokes. (This is why `func-param`/`macro` already
  agreed — nested references don't trip the top-level scan.)
- **Decision.** Small, contained fix — make the expander's macro-definition
  detection binding-aware, mirroring pass2's existing light scan:
  1. `pass1.rs`: track top-level hoisted names (`resolver::hoisted_names`,
     already the shared source of truth); a `(macro …)` whose head is shadowed
     by a preceding `bind`/destructuring/import binder is a call, not a def.
  2. `pass2.rs`: the leaked-definition error now fires only for genuine
     *definition shape* (`macro` head + atom name) and only when not bound — so
     `(macro 987)` and the `(import "m" (macro))` binder atom both fall through
     to a plain call.
- **Recorded.** `crates/lykn-lang/src/expander/{pass1,pass2}.rs`; corpus row
  *"D1/F-3: bound `macro` calls the binding on both backends"* (bind /
  destructuring / import). Matrix delta = exactly these 3 cells (56→53), Rust
  `calls-binding` +3, no other cell moved, all Rust tests green.

### 2. `contains_await` — FIXED (a latent Rust misfire the probe uncovered; F-5)

- **Probe.** The canonical case — bound `await` param, plain non-async body —
  is already correct and byte-identical on both backends
  (`function probe(await){ return await(987); }`, sync). But probing the
  **await-gated wrapper** paths surfaced a real, matrix-invisible divergence:
  `(func p (:any await) (bind r (if-let (x 1) (await 987) 0)) r)` → **Rust**
  async-wrapped the IIFE (`await (async () => … return await(987))()`) and
  thereby reinterpreted `await(987)` as the `await` *operator*; **JS** correctly
  kept it a sync call. `contains_await` (emitter) read raw `.as_atom()=="await"`,
  ignoring the resolver tag — exactly the slice08 bubble-up.
- **Decision.** The one-line-per-site `as_form_head()` change F-5 anticipated:
  async detection now honours resolution (a bound `await` is a value, not the
  operator). Genuine `(await x)` still async-wraps (verified); the bound case no
  longer does (now matches JS).
- **Recorded.** `crates/lykn-lang/src/emitter/forms.rs` (`contains_await` +
  `step_contains_await`); unit test `test_contains_await_honours_resolution`.
  Full Rust suite (1064+ tests) green.

### 3. Form-named label asymmetry — DOCUMENTED (F-4; 38 cells)

- **Probe.** `(label fn (block (fn 987)))` → Rust `fn: { fn(987); }` (falls
  through to a call); `(label lambda …)` → Rust fires the form; **JS throws**
  *"fn requires at least 2 arguments"*. Control: `(label widget (block
  (widget 987)))` → **both** `widget: { widget(987); }` (agree).
- **Decision — document, not fix.** This is **not** a D1 violation. A label does
  not shadow values (DD-60 ‡, settled), so on *both* backends the reference
  means the **form**, not a binding. The backends then differ only in how they
  treat a form invoked with the wrong *shape* (`(fn 987)`): Rust falls through to
  a plain call, JS raises a form-arity error — the **pre-existing
  accidental-shadowing asymmetry** named in DD-60 §Context, orthogonal to
  name-binding semantics and out of DD-60's scope. Practical risk nil: `(fn 987)`
  is malformed either way; neither output is "correct," and JS's compile error is
  arguably the better behaviour.
- **Recorded.** Corpus rows *"DD-60 ‡: a label does not shadow a value"*
  (the settled, convergent part) and *"residual (documented): form-named label
  — shape-mismatch asymmetry"* (pins the expected divergence). **CDC action:**
  a DD-60 refinement-log note (operator-confirmed) — CC did not edit the DD.

### 4. `kernel:if` strict cells — DOCUMENTED (F-4; 15 cells)

- **Probe.** `(bind kernel:if 0)` → Rust `const kernel.if = 0; kernel.if(987)`
  (invalid JS at rc=0); JS `const kernel:if = 0; if (987) null` / throws. Both
  are garbage; neither round-trips as a usable binding.
- **Decision — document, no action (DD-60 edge case 4).** `kernel:if` is not a
  legal identifier (the `:` is the kernel-escape syntax); splicing it into a
  binding position is **unrepresentable in real code** — the matrix constructs
  it artificially. The Rust-vs-JS divergence is two flavours of
  garbage-in/garbage-out, not a D1/D2 violation (`kernel:if` is not a *name*
  subject to D1/D2). `kernel:const` (33/33) agrees and is the same class.
- **Recorded.** Corpus row *"residual (documented): kernel:-prefixed name is
  unbindable (edge 4)"*.

### 5. D2-timing constructed-name residual — DOCUMENTED (F-6)

- **Probe.** `` (macro mk (n) `(bind ,n 0))\n(mk if) `` → **Rust** rejects
  cleanly (*"'if' is a JavaScript reserved word…"*, post-expansion); **JS** hits
  an *unrelated* macro-expansion error (`expandExpr: unexpected node type
  'undefined'`). The **literal**-in-template twin
  (`` (macro mk () `(bind if 0)) ``) → **both** reject cleanly.
- **Decision — document as the permanent asymmetry.** JS validates reserved
  names pre-lowering (`walkBindings` on surface forms), so a name *constructed*
  into a binder from a macro argument escapes that scan and trips an unrelated
  error; Rust validates post-expansion and gives the precise diagnostic.
  Crucially **neither leaks invalid JS at rc=0** — the ID-44 genus is not
  reintroduced; the only difference is diagnostic *quality*. Unifying would need
  a second `validateReservedNames(expanded)` pass on JS — a behaviour change,
  out of scope (slice-doc: "unifying pass placement is out unless trivially
  cheap"). Practical risk nil (constructing reserved binders from macro args is
  pathological). The two probes above are the cheap pin.

## Final matrix snapshot (F-7 — the A-4 evidence input)

`make check` ✓ (build + lint + fmt + Rust tests + JS/lykn suite + the new
corpus + docs 475/0). End-state matrix (`tools/conformance-matrix.js`,
deterministic, re-runnable):

```
1947 cells · 53 where the backends disagree (3%)
| outcome        | rust | js  |
| calls-binding  | 902  | 874 |
| macro-fires    |  22  |  12 |
| throws         | 957  | 1010|
| invalid-output |  66  |  51 |
```

The 53 documented-as-intended residuals, by class:

| class | cells | disposition |
|---|---|---|
| form-named label (surface-form, call-head + nested-fn) | 32 | F-4 — pre-existing shape-mismatch asymmetry (DD-60 §Context) |
| form-named label (kernel-head: assign/async/get) | 6 | F-4 — same class |
| `kernel:if` (all binding positions, call-head + nested-fn) | 15 | F-4 — DD-60 edge 4, unbindable |

There are **no undocumented divergences and no leaks**: every legal-ident name a
user lexically binds means the binding on both backends (D1); every reserved
word is rejected at every binding position on both backends (D2, confirmed —
the only `invalid-output` names are the `kernel:`-prefixed unbindables, never a
real reserved word).

## Bubble-up to the arc close

- **Capability confirmed end-to-end.** arc13's statement — "lexical bindings
  shadow macros on **both** backends; reserved words rejected; conformance
  corpus" — holds. D1/D2 are implemented on Rust (slices 03–09) and JS
  (slice10), and now **pinned permanently** by a cross-backend `make check` gate
  with demonstrated teeth. The linter work (arc05 slice03) can resume on true
  lexical scoping in place.
- **A-4 input is this report + the snapshot above** (53 cells, 2 classes, each
  documented-as-intended). The arc-scale A-4/A-5 reproduction consumes it.
- **Two DD refinement-log notes for CDC/operator** (CC did not edit the DDs):
  (a) DD-60 — the form-named-label shape-mismatch asymmetry is the documented
  residual of the ‡ label exception; (b) optionally note the `contains_await`
  resolution-honouring fix under DD-61 as-built (async detection now reads
  `as_form_head`).
- **What the corpus build taught.** The `contains_await` misfire (F-5) was
  **matrix-invisible** — the matrix probes bound-name × reference-position, not
  bound-name-inside-an-async-gated-wrapper. The corpus's coverage bar is by
  equivalence class, so it too would not have caught it; the *probe discipline*
  did. Worth carrying into the arc close: the matrix/corpus bound the
  *dispatch* surface, not the *emit-time heuristics* (await-detection, and any
  future structural `.value` reads in the emitter that should honour
  resolution).
- **Staleness trap #4 held throughout:** `./bin/lykn build` before every probe
  (the `lang/` import map → `target/lykn/build/lang/`).

## Discipline notes

- **Source touched:** `crates/lykn-lang/src/expander/{pass1,pass2}.rs`,
  `crates/lykn-lang/src/emitter/forms.rs`, and the new
  `test/expander/conformance-corpus.test.js`. No safety-gate shortcuts; every
  fix is minimal and green-verified; the two seeded breaks were reverted to
  byte-identical committed state (`git diff` clean).
- The matrix tool and `compileBoth` normalizer were **not** extended (the
  formatting divergences are handled by choosing the classification vehicle, not
  by hiding differences).
- Closing report untracked at hand-off per LEDGER-DISCIPLINE; the source landed
  as a green increment.
