# Slice 02: js-dd58-parity

> Bring the JS compiler (`packages/lang/`) to **DD-58 parity** with the Rust
> CLI: strict classification default-on for surface compilation, plus the
> `(kernel:<form> …)` escape — so DD-58 holds at the **language level** (the
> doctest / `deno test` / browser / JSR-consumer paths), not just the Rust CLI.
> **It lands; it's breaking** (for JS-API consumers compiling bare kernel
> forms). Scoped by slice01's bubble-up ① (2026-06-30/07-05). Gates arc10's
> A-3 composition.

## Goal

1. `(kernel:<form> …)` works in the JS compiler — in **both** lax and strict
   modes (Rust has had it in lax since M17): strip the prefix, validate the
   form against the kernel whitelist, pass through. `(kernel:const x 42)` →
   `const x = 42;` — today it **mis-compiles** to the bogus member call
   `kernel.const(x, 42)`.
2. Bare kernel-only heads — exactly `const` / `let` / `var` / `function` /
   `function*` — at the **top level** of surface compilation become compile
   errors (throws), with diagnostics matching the Rust CLI's text, resolvable
   via the `kernel:` escape. Strict is the **default** for the surface
   pipeline (`lykn()`, `expand()`); an explicit lax opt-out exists for the
   coherence harness and kernel-form testing only.
3. Migrate the repo's JS-path consumers (test call sites, helpers, guide
   fences) so everything is green — and the guide kernel demos that slice01
   had to mark `lykn,skip` (because the JS doctest path couldn't error) flip
   to `compile-fail` (bare forms) or runnable (`kernel:` escapes, which now
   compile correctly).

## Current state (grounded 2026-07-05)

- **No `kernel:` concept anywhere in `packages/lang/`** (grep: zero hits in
  `expander.js` / `classifier.js` / `compiler.js` beyond the `_kernel` marker
  and comments). A `kernel:const` head falls through classification and macro
  dispatch to the compiler's colon-namespace handling → member call.
  (Mis-compile attested in slice01's closing report; absence of handling
  reproduced by code review.)
- **No strict concept in the JS pipeline.** `lykn(source)` =
  `compile(expand(read(source)))` (`mod.js:17`); `expand(forms, context)`
  (`expander.js:1505`) runs pass0 (import-macros) → pass1 (register macros) →
  `pass2ExpandAll` (`expander.js:959`), which walks the **top-level forms** —
  the natural strict enforcement point, matching Rust's top-level-only
  semantics.
- **Rust parity reference:** `classify_form_strict`
  (`crates/lykn-lang/src/classifier/forms.rs:117`). Order of checks: (1)
  `kernel:` prefix → validate against `KERNEL_FORMS` (`dispatch.rs:200`),
  unknown → error with did-you-mean (edit distance ≤ 2); (2)
  `is_kernel_only_form` (`dispatch.rs:194` — exactly the 5 heads) → error
  with per-form-class message + `(kernel:<head> …)` suggestion; (3) everything
  else classifies/passes through/is a function call as in lax mode. **Strict
  rejects nothing else.** Nested kernel forms inside surface bodies compile
  fine (slice01 F-3 finding) — JS must match.
- **The `_kernel` marker** (`expander.js:733–751`) guards macro-emitted kernel
  output from re-classification. Strict applies to **top-level input forms
  only**, so it need not (and must not) interact with `_kernel` recursion —
  and slice03 removes `_kernel`, so this slice must not deepen the dependence.
- **JS-path consumers** (from slice01's F-1 trace, re-confirmed):
  - doctests: `doctest.rs:331` generates `.test.js` importing `{ lykn }` from
    `packages/lang` and calling `lykn(...)` directly; the `compile-fail`
    annotation (`doctest.rs:368–380`) asserts the call **throws** — the
    machinery the fence-flip needs already exists (used by guide 17's ICU
    fences).
  - `packages/testing/helpers.js`: `compile` / `compileAll` (surface pipeline),
    `compileKernel` (bypasses `expand()` entirely — naturally exempt from
    strict), `compileBoth` (JS pipeline + Rust `lykn compile --no-strict`;
    the JS side must run **lax** to stay a meaningful raw-codegen comparison —
    its rationale comment at `helpers.js:124–130` already anticipates this).
  - browser: `packages/browser/compiler.js` `compileLykn` = same pipeline
    (surface-only per README → strict-default applies; a breaking-change note
    for inline `<script type="text/lykn">` users writing bare kernel forms).
    ⚠ **`examples/kernel/browser-src.html` loads `browser-app.lyk`** (a
    top-level-kernel-form file) **via the script-tag loader** — the browser
    path needs extension-aware mode (`.lyk` src → lax) or those examples
    break. `examples/kernel/browser.html` inlines kernel forms too.
  - **the `lykn test` codegen script** — `main.rs:716–722` generates a
    deno-eval script calling `lykn(source)` for **both** `.lykn` *and* `.lyk`
    test files (Rust-side validation distinguishes; the JS codegen call does
    not). The current `test/kernel/*.lyk` files have no top-level kernel-only
    heads (verified 2026-07-05, per their CONVENTIONS), so they may compile
    under strict today — but the script must thread the mode by extension
    (`.lyk` → lax) so the exemption is structural, not accidental.
  - JSR consumers of `@lykn/lang` (breaking; 0.6.0 is the vehicle).

## Scope (in)

1. **F-1 — trace + attach point.** Written trace of where strict attaches
   (top-level walk of `expand()`), confirming top-level-only parity and the
   exemption of `compileKernel`/kernel paths.
2. **F-2 — `kernel:` escape** (both modes) with whitelist validation
   mirroring `KERNEL_FORMS` and did-you-mean on unknown forms.
3. **F-3 — strict default-on** for the surface pipeline; the 5 heads error at
   top level with Rust-matching diagnostic text; explicit lax opt-out for
   harness/kernel-testing paths only — **no silent blanket bypass**
   (AGENTS.md safety-gates).
4. **F-4/F-5 — migration (repo-only).** Enumerate + classify + migrate the
   JS-path call sites compiling bare kernel forms (grounding grep found
   **38 one-line sites across 9 `.lykn` test files** — hot spots
   `test/forms/destructuring-*`, `generator`, `function`, `default-params`,
   `class-expr`, `async-await`; CC's earlier estimate was ~59 with a broader
   net — reconcile the counts), plus `helpers.js` and the browser entry.
5. **F-6 — guide fence flip.** Audit the ```` ```lykn,skip ```` fences —
   grounded count (2026-07-05): **14 in guides** (00:3, 01:4, 06:1, 09:1,
   10:1, 16:4) **+ 1 in README** = 15; not all are slice01's or parity-gap
   (guide-16's are the testing guide's own examples). Flip those whose
   **only** skip reason was the JS parity gap: bare-form demos →
   `compile-fail`, `kernel:` demos → runnable. Leave skips with other
   reasons, with rationale.

## Scope (out)

- **DD-37 step-4 `_kernel` removal** — slice03 (but note in the bubble-up
  anything this work reveals about `_kernel` reachability, as a map for it).
- **Rust compiler/classifier changes** — none expected; if parity work
  uncovers a Rust divergence, **surface it, don't fix it silently**. (One
  Rust *touch* IS in scope: the `lykn test` codegen script in `main.rs`
  that invokes the JS API must thread the mode by extension — see Current
  state. It changes what the script passes to `lykn()`, not the compiler.)
- **Downstream (mycelium) migration** — the standing repo-only boundary.
- The operator/expression anti-patterns (`==`/`&&`/`require`/IIEF etc.) —
  arc05 linter territory, unchanged by this slice.
- Making `compileBoth` run strict|strict for the surface corpus — a candidate
  follow-up once both backends enforce; file it, don't do it.

## Verification approach

Rebuild-first, per the standing bar — and this slice touches guides, so
**`make test-docs` is mandatory**, not optional (process standard, 2026-06-30).
Headline demo (arc10 A-3, now at language level): each of the 5 bare heads
errors via the **JS API** (`lykn("(var x 1)")` throws) *and* the Rust CLI;
`(kernel:var …)` etc. resolves on **both**, byte-convergent under
`compileBoth`. Full suite green: `make check`, `make test-docs`, `lykn test`,
`deno test --config project.json -A test/`, `clippy -D warnings`.

## Exit criteria

The 5 kernel-only heads error at top level on the JS surface pipeline
(strict default-on; lax opt-out harness-only); `kernel:` escape works in both
modes on the JS compiler with output convergent with Rust; the repo's JS-path
call sites migrated and green; the parity-gap `lykn,skip` fences flipped to
`compile-fail`/runnable; A-3's demo reproduced on both compilers; no `_kernel`
deepening. Follow-ups (strict|strict compileBoth; anything surfaced for
slice03) filed in the bubble-up.

## Design sub-questions (surface, don't decide silently)

1. **API shape for the strict option.** Direction: an options bag on the
   existing entry points (`lykn(source, { strict = true })`, threaded through
   `expand`), strict default. CC verifies the ergonomics against the actual
   call sites (helpers, doctest template, browser) and proposes; if a separate
   entry point is cleaner, surface it.
2. **Where does the check live** — a pre-pass over top-level forms in
   `expand()`, or inside `pass2ExpandAll`? Constraint: top-level-only, before
   macro/classifier dispatch, `_kernel`-independent. CC decides mechanism,
   documents in F-1.
3. **Browser strict-default** — parity says yes for inline scripts and
   `.lykn` src (it's surface by design); but the script-tag loader should be
   **extension-aware** (`src="….lyk"` → lax) so the kernel browser examples
   keep working — mirror the CLI's extension rule. Confirm or surface.
4. **Diagnostic parity depth** — primary message text should match Rust
   exactly (it's user-visible and guide-quoted); is the did-you-mean
   suggestion worth porting now? (Default: yes for `kernel:` unknown-form,
   since F-2 mirrors that code path anyway.)
