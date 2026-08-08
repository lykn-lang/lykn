# CC Prompt — arc10 / slice02 · js-dd58-parity

**From:** CDC (Cowork) · **To:** CC (Claude Code, host) · **Date:** 2026-07-05
**Branch:** `release/0.6.x` (fresh branch or worktree — Duncan's call; git host-side).
**Re:** **DD-58 parity for the JS compiler** — strict default-on + the
`(kernel:<form> …)` escape in `packages/lang/`, so the closed surface
namespace holds at the *language* level (doctests, `deno test`, browser, JSR),
not just the Rust CLI. **It lands; it's breaking (JS API); repo-only.**
This is your own slice01 bubble-up ①, routed.

## 0. Read first

- `…/slice02-js-dd58-parity/ledger.md` (8 rows) and `slice-doc.md`.
- Your slice01 closing report — the F-1 enforcement-point table and
  bubble-up ① are this slice's spec seed.
- **The Rust parity reference** — `classify_form_strict`
  (`crates/lykn-lang/src/classifier/forms.rs:117`) and the dispatch tables
  (`dispatch.rs`: `is_kernel_only_form` :194, `KERNEL_FORMS` :200). The JS
  implementation mirrors this behavior; it does not have to mirror the
  structure.
- DD-58 (`docs/design/05-active/0059-…`, v1.1) — §strict-mode + §kernel:
  escape are the spec.

## 1. The finding you're fixing

`packages/lang/` implements **neither** strict **nor** `kernel:`:

- `(kernel:const x 42)` mis-compiles to the bogus member call
  `kernel.const(x, 42)` (no `kernel:` handling anywhere; the head falls
  through to colon-namespace member syntax).
- Bare `const`/`let`/`var`/`function`/`function*` pass straight through
  (`(var x 1)` → `var x = 1`) on every JS-compiled path.

So a `.lykn` authored via doctests / `deno test` / the browser is not
strict-checked, and the guide kernel demos had to be `lykn,skip` instead of
`compile-fail`.

## 2. The work (MUST)

1. **F-1 — trace + attach point.** Strict applies to **top-level forms only**
   (Rust parity: nested kernel forms inside surface bodies compile fine —
   your own slice01 finding). The natural point is the top-level walk in
   `expand()` (`pass2ExpandAll`, `expander.js:959`), **before**
   classifier/macro dispatch and **independent of `_kernel`** (slice03
   removes that marker — do not deepen the dependence). Write the trace,
   including the consumer-path table (doctest `lykn()` · helpers
   `compile`/`compileAll`/`compileBoth`/`compileKernel` · browser
   `compileLykn` · JSR consumers).
2. **F-2 — the `kernel:` escape, both modes.** Strip prefix → validate
   against a kernel-forms whitelist (mirror `KERNEL_FORMS`,
   `dispatch.rs:200`) → pass the stripped form through as kernel. Unknown
   form → error with did-you-mean (Rust: edit distance ≤ 2). MUST work in
   lax mode too (Rust has had it in lax since M17). TDD:
   `(kernel:const x 42)` → `const x = 42;`, convergent under `compileBoth`;
   `(kernel:functoin …)` → error suggesting `function`.
   ⚠ The whitelist is a **second copy** of Rust's `KERNEL_FORMS` — note the
   divergence risk in code comments on both sides, and surface any mismatch
   you find between the two compilers' kernel-form sets.
3. **F-3 — strict default-on.** Bare 5 heads at top level → **throw**, with
   diagnostic text matching the Rust messages verbatim (`"'const' is a
   kernel-only form; use 'bind' …"`, `"'function' is a kernel-only form; use
   'func', 'fn', or 'lambda' …"`). Strict is the default of `lykn()` /
   `expand()`. Provide an explicit lax opt-out for the harness/kernel-test
   paths (proposed shape: `{ strict: false }` options bag — verify ergonomics
   against the real call sites and propose in the closing report). **No
   silent blanket bypass** on user-facing paths (AGENTS.md safety-gates).
   Strict rejects **exactly** the 5 heads + invalid `kernel:` — unknown heads
   remain function calls; do not close the namespace further.
4. **F-4 — migration audit (repo-only).** Enumerate every JS-path call site
   compiling bare kernel-form source. CDC's one-line grep found **38 sites
   across 9 `.lykn` test files** (hot: `test/forms/destructuring-*`,
   `generator`, `function`, `default-params`, `class-expr`, `async-await`);
   your slice01 report estimated ~59 with a broader net — **reconcile the
   counts** and classify each site: `kernel:` escape in the source · lax
   variant · `compile-kernel` · leave-with-rationale. Include `helpers.js`
   and `packages/browser/`. Note: `compileKernel` bypasses `expand()`, so
   sites that need the expander's destructuring desugar can't move there —
   check what the destructuring tests actually exercise before choosing.
   **Two paths CDC ground-truthed as strict-default breakage risks — audit
   them explicitly:** (a) the **`lykn test` codegen script**
   (`main.rs:716–722`) calls `lykn(source)` for `.lyk` files too — thread
   the mode by extension (`.lyk` → lax; a script-generation change, not a
   Rust-compiler change; today's `test/kernel/*.lyk` have no top-level
   kernel-only heads, so don't rely on that accident); (b) the **browser
   script-tag loader** — `examples/kernel/browser-src.html` loads
   `browser-app.lyk` (top-level kernel forms) via
   `<script type="text/lykn" src=…>`; make the loader extension-aware or
   surface the alternative.
5. **F-5 — apply the migration.** `compileBoth`'s JS side runs explicitly lax
   with a rationale comment (pair it with its existing `--no-strict` comment,
   `helpers.js:124–130`). **Preserve coverage** — a migrated test must still
   verify what it verified; surface any loss.
6. **F-6 — guide fence flip.** Audit the ```` ```lykn,skip ```` fences —
   grounded count: **14 in guides** (00:3, 01:4, 06:1, 09:1, 10:1, 16:4)
   **+ 1 in README** = 15 total; not all are slice01's or parity-gap
   (guide-16's are the testing guide's own examples). Flip **only** those
   whose skip reason was the JS parity gap: bare-form demos →
   `compile-fail` (the doctest machinery already asserts the JS path throws,
   `doctest.rs:368`); `kernel:` demos → runnable. Others keep their skip +
   rationale. Keep guide-16's fence documentation accurate.
7. **F-7 — the A-3 demo, both compilers.** Transcript: each of the 5 bare
   heads errors via the JS API **and** the Rust CLI; `kernel:` resolves each
   on both. This closes arc10 A-3 from *partial* to *met* — it's the
   headline.

## 3. Verify (rebuild-first, all green)

`make check` green; **`make test-docs` 0 failed** (this slice touches guides —
the standing bar requires it); `lykn test` 0 failed; `deno test --config
project.json -A test/` 0 failed; `clippy -D warnings` exit 0 (F-8). Rebuild
first; trust no stale binary or build dir.

## 4. Discipline

- Lands; breaking for JS-API/browser consumers compiling bare kernel forms —
  flag for the 0.6.0 release notes (arc09) in your bubble-up.
- **Surface, don't decide silently:** the API option shape; where the check
  lives; whether the browser path stays strict-default (parity says yes;
  it's breaking for inline `<script type="text/lykn">` kernel forms);
  did-you-mean depth. → closing report.
- **Rust compiler/classifier changes are out of scope.** If parity work
  exposes a Rust divergence (kernel-form set mismatch, message drift),
  surface it — don't fix it silently. (The `main.rs` codegen-script change
  in F-4(a) is in scope — it changes what the script passes to the JS API,
  not the Rust compiler.)
- **Self-stop applies**: if the contract here contradicts what the code
  tells you (it has caught two CDC errors before), stop and surface.
- Leave `docs/design-v0.6.0/**` to CDC except your closing report. Commit
  source only.

## 5. Close

`closing-report.md`: per-row walk (8 rows, no silent drops) + the F-1 trace +
the F-4 migration table + design-call answers + a **bubble-up to arc10**:
did this deliver A-3 at language level; anything revealed for slice03
(`_kernel` reachability map — you'll be staring at that code); the
strict|strict `compileBoth` follow-up; release-notes items. → hand back for
CDC `cdc-verification.md`. Closing slice02 makes DD-58 true everywhere the
language compiles; slice03 (`_kernel`) then finishes arc10.
