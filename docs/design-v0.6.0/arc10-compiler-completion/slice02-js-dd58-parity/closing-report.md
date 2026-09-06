# Slice 02: js-dd58-parity — Closing Report

**By:** CC (Claude Code) · **Date:** 2026-07-05 · **Branch:** `release/0.6.x`
**Verdict: delivered.** The JS compiler (`packages/lang/`) now has DD-58 parity —
**strict default-on** plus the **`(kernel:<form> …)` escape** — so the closed
surface namespace holds at the *language* level (doctests, `deno test`, browser,
JSR), not just the Rust CLI. **arc10's A-3 goes from *partial* (Rust-only) to
*met* (both compilers).** Breaking for JS-API/browser consumers compiling bare
kernel forms — flagged for the 0.6.0 release notes.

---

## F-1 — Attach-point trace

`lykn(source)` = `compile(expand(read(source)))` (`mod.js`). Unlike Rust (where
the classifier does surface→kernel), the **JS `expand()` does both macro *and*
surface expansion** (`bind`→`const` happens inside the expander). So strict must
run on **top-level forms after pass0/pass1 but before `pass2ExpandAll`** — at
that point `bind` is still `bind`, macro invocations are still invocations, and
only user-written **bare kernel heads** are visible. This matches Rust's
top-level-only semantics (nested kernel forms in surface bodies still compile).

- **Strict** (`expander.js` `enforceStrictTopLevel`, called from `expand()` when
  `strict`): scans top-level form heads, throws on the 5 kernel-only declaration
  forms. `_kernel`-independent (runs before expansion) — does **not** deepen the
  `_kernel` dependence slice03 removes.
- **`kernel:` escape** (`expander.js` `expandExpr`): strips the prefix, validates
  against the whitelist, emits the raw kernel form marked `_kernel` (skips
  re-classification/macro-expansion). Works at any depth, in both modes.

**Consumer-path table (post-change):**

| Path | Entry | Mode after |
|------|-------|-----------|
| doctests (`lykn test --docs`) | generated `.test.js` → `lykn()` | **strict** (enables `compile-fail` fences) |
| `deno test test/` | `helpers.js` `compile`/`compileAll`/`compileBoth` | **lax** (internal compiler-testing) |
| `helpers.js` `compileKernel` | bypasses `expand()` | exempt (unchanged) |
| browser inline `<script type="text/lykn">` | `scripts.js` → `run()` | **strict** |
| browser `src="….lyk"` / `.lykn` | `load()` | **extension-aware** (`.lyk`→lax) |
| `lykn test` codegen (`main.rs`) | deno-eval → `lykn()` | **extension-aware** (`.lyk`→lax) |
| JSR `@lykn/lang` `lykn()` | public API | **strict** (breaking) |

---

## F-2 — the `kernel:` escape (both modes)

`packages/lang/kernel-forms.js` (new) mirrors the Rust dispatch tables:
`KERNEL_FORMS` (whitelist), `KERNEL_ONLY_FORMS` (the 5), `levenshtein` +
`closestKernelForm` (did-you-mean, edit distance ≤ 2), `kernelOnlyMessage`
(diagnostic text). `(kernel:const x 42)` → `const x = 42;` (was the bogus
`kernel.const(x, 42)`); `(kernel:functoin …)` → `unknown kernel form 'functoin'
… did you mean 'function'?`. Works in lax mode too.

> ⚠ **Divergence risk (surfaced):** `KERNEL_FORMS`/`KERNEL_ONLY_FORMS` are a
> **second copy** of the Rust source of truth (`dispatch.rs`). Both files carry
> a cross-reference comment. I reconciled the two sets during the port — **no
> mismatch found** (the JS whitelist is byte-for-byte the Rust `KERNEL_FORMS`).
> A shared generated source would remove the risk; filed as a follow-up.

## F-3 — strict default-on

Bare `const`/`let`/`var`/`function`/`function*` at top level → **throw** with
diagnostic text matching the Rust CLI **verbatim**. `strict` is the default of
`lykn()`/`expand()`; the explicit **`{ strict: false }`** opt-out (options bag,
threaded `lykn → expand`) is the harness/kernel opt-out. Strict rejects
**exactly** the 5 heads + invalid `kernel:` — unknown heads stay function calls.
TDD: `test/expander/dd58-strict.test.js` (9 tests: the 5 throw with Rust text,
nested compiles, operators/surface pass, lax opt-out, `kernel:` all-modes,
did-you-mean).

---

## F-4 / F-5 — Migration (repo-only)

**Count reconciliation.** CDC's grep found 38 one-line sites / 9 `.lykn` files;
my slice01 estimate was ~59 (broader net). The **actual** strict-default breakage
(rebuild-first, empirical): **26** test failures — 24 in `deno test` (10 files)
+ 2 in `lykn test` (the `.lykn` mirrors). The gap vs. 38/59: most `compileBoth`
sites are inside `.lykn` files that route through the (now-lax) shared helper, so
they never individually break — the helper fix covers them wholesale.

| Site | Kind | Disposition |
|------|------|-------------|
| `helpers.js` local `lykn` (→ `compile`/`compileAll`/`compileBoth`) | harness | **lax** (rationale comment; the wholesale fix) |
| `helpers.js` `compileKernel` | harness | exempt (bypasses `expand`) — unchanged |
| `test/expander/{as-pattern,expansion-walk,macroexpand,macro-basic,pipeline,import-macros}.test.js` | expander mechanics | local wrapper → `{ strict: false }` |
| `test/forms/generator.test.js` | kernel `function*`/`yield` codegen | wrapper → `{ strict: false }` |
| `test/integration/{control-flow-macros,data-structure-macros,gensym-hygiene}.test.js` | integration (kernel forms) | wrapper → `{ strict: false }` |
| `test/expander/{pipeline,import-macros}_test.lykn` | `.lykn` mirrors | `(expand … (obj … :strict false))` |
| `main.rs` codegen script | `.lyk` test files → JS API | extension-aware (`.lyk` → `lykn(source, { strict:false })`) |
| browser `compiler.js` `load()` | `.lyk`/`.lykn` src | extension-aware (`.lyk` → lax) |
| `examples/kernel/browser{,-macros}.html` | inline kernel HTML | top-level `const`/`let` → `(kernel:…)` escape (compiles strict, stays kernel demo) |
| `examples/surface/browser-macros.html` | inline **surface** HTML — had a stray `let`+`+=` (bug) | → surface `cell`/`swap!`/`express` |

**Coverage preserved** — every migrated test still verifies what it verified
(lax only disables the strict *rejection*; output assertions are unchanged). No
tests deleted.

---

## F-6 — Guide fence flip

Audited all **16** `lykn,skip` fences (15 real + 1 doc-table row in guide-16).
Only **2** had the JS-parity gap as their skip reason — both flipped:

| Fence | Was | Now |
|-------|-----|-----|
| `09-anti-patterns.md` ID-38 `(const x 42)` demo | `skip` | **`compile-fail`** (JS doctest now asserts the throw) |
| `06-functions-closures.md` `function*` demo | `skip` (bare) | **runnable** `(kernel:function* …)` (escape now compiles) |

The other 13 keep `skip` for non-parity reasons: external deps (00×3 & README
`import-macros` to `./lib.lykn`/`jsr:` packages), kernel technical docs (01×4:
top-level-`=` semantics, kernel object methods, `.lyk` threading, `.lyk`
property-assign), guide-16's own testing examples (×4), and guide-10's
multi-file `type` fragment.

## F-7 — A-3 composition demo (both compilers)

```
                 JS API              Rust CLI
(const x 1)      throws              errors
(let x 1)        throws              errors
(var x 1)        throws              errors
(function f ..)  throws              errors
(function* g ..) throws              errors
(kernel:const x 1)    → const x = 1;        (both, convergent)
(kernel:var x 1)      → var x = 1;          (both, convergent)
(kernel:function* g …)→ function* g() { yield 1; }  (both, convergent)
```

**arc10 A-3: partial → met.**

---

## Verification (rebuild-first)

**Observed (2026-07-05, rebuild-first):**
- `make check` → **`✓ All checks passed (build + lint + test)`** (exit 0) — F-8.
- `make test-docs` → guides `468 | 0`, README `1 | 0`, examples **both trees**
  green (surface `2 | 0`, kernel `2 | 0`).
- `lykn test` → **`1354 | 0`**; `deno test --config project.json -A test/` →
  **`667 | 0`** (was 658 + 9 new DD-58 tests).
- `cargo test --all-features --workspace` 0 failed; `cargo clippy --all-features
  --workspace -- -D warnings` exit 0; `deno lint packages/` clean (15 files).
- A-3 demo (F-7): the 5 bare heads throw on the JS API **and** error on the Rust
  CLI; `(kernel:const|var|function*)` converge byte-for-byte on both.

---

## Design-call answers

1. **API shape.** Options bag on the existing entry points — `lykn(source,
   { strict = true })`, threaded into `expand(forms, { …, strict })`. Verified
   ergonomic against helpers, the doctest template (uses bare `lykn()` → strict),
   and the browser (`compileLykn(source, { strict })`). No separate entry point
   needed.
2. **Where the check lives.** A pre-pass (`enforceStrictTopLevel`) over the
   top-level forms in `expand()`, after pass0/pass1, before `pass2ExpandAll` —
   top-level-only, `_kernel`-independent, before macro/classifier dispatch.
3. **Browser strict-default.** Yes — inline `<script type="text/lykn">` and
   `.lykn` src compile strict; the loader is **extension-aware** (`.lyk` src →
   lax), mirroring the CLI. Breaking for inline bare-kernel users (release note).
4. **Diagnostic parity depth.** Primary message text matches Rust **verbatim**;
   did-you-mean **is** ported (F-2 mirrors that code path anyway).

---

## Bubble-up to arc10

- **A-3 delivered at language level** — the headline. DD-58 is now true on every
  path the language compiles.
- **Release notes (arc09), breaking:** (a) bare kernel-only forms in `.lykn`
  authored via the JS API / browser now throw — use `bind`/`func`/`fn`/`genfunc`
  or `(kernel:…)`; (b) `(kernel:…)` in the JS compiler changed meaning from a
  bogus member call to the real escape.
- **For slice03 (`_kernel` removal):** strict is deliberately
  `_kernel`-independent; the `kernel:` escape *sets* `_kernel` on the stripped
  form (the marker's intended use — skip re-expansion), so slice03's removal must
  provide an equivalent "this is already kernel, don't re-expand" signal for both
  the escape output and surface-macro output. The escape + strict together are a
  clean reference for the surface/kernel boundary.
- **Kernel-form set duplication** — JS `kernel-forms.js` copies Rust
  `dispatch.rs`. Reconciled now (no mismatch); a shared/generated source is a
  filed follow-up.
- **`compileBoth` strict|strict** — both backends now enforce; running the
  *surface* corpus strict|strict (not just lax|lax) is a candidate follow-up
  (filed, not done — the harness must stay lax for the kernel-form corpus).
- **Discovered latent bug (out of scope):** `examples/kernel/browser*.html` use
  top-level `(= el:inner-HTML …)`, which is equality (`===`), a runtime no-op —
  the innerHTML was never actually set (pre-existing; compile-only doctest never
  caught it). Noted for a docs/examples pass.
- **Downstream (mycelium)** — remains a filed follow-up (repo-only boundary held).

---

## Discipline notes

- Breaking (JS API + browser inline scripts) — release-notes item above.
- **No Rust compiler/classifier change** — the one sanctioned Rust touch is the
  `main.rs` codegen script threading mode by extension (F-4/F-5), which changes
  what the script passes to the JS API, not the compiler. No Rust divergence
  found beyond the (documented) kernel-form-set duplication.
- `docs/design-v0.6.0/**` left to CDC except this closing report. Source only.

Handed back for CDC `cdc-verification.md`.
