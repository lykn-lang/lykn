# Slice 02: js-dd58-parity — Ledger

DD-58 parity for the JS compiler: strict default-on + the `kernel:` escape in
`packages/lang/`, so the closed surface namespace holds on **every** compile
path. **Lands; breaking (JS API); repo-only migration.** Rebuild-first verify;
guides are touched, so `make test-docs` is in the green bar. Per
`collaboration-framework/templates/LEDGER-DISCIPLINE.md`.

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| F-1 | **Attach-point trace written** — where strict attaches in the JS pipeline (top-level walk of `expand()`), confirming: top-level-only (nested kernel forms in surface bodies still compile, Rust parity), `compileKernel`/kernel-test paths exempt, no `_kernel` deepening | written trace in the closing report, incl. the consumer-path table (doctest / helpers / browser / JSR) | serious | slice-doc | open | | Rust reference: `classify_form_strict` forms.rs:117; JS walk: expander.js:959/1505 |
| F-2 | **`kernel:` escape works in the JS compiler, both modes** — `(kernel:const x 42)` → `const x = 42;` (was `kernel.const(x, 42)`); whitelist-validated (mirror of `KERNEL_FORMS`, dispatch.rs:200); unknown form → error with did-you-mean | new deno tests: each of the 5 via `kernel:` compiles; `(kernel:functoin …)` → error suggesting `function`; `compileBoth` converges on `kernel:` forms | serious | slice01 bubble-up ① | open | | escape must work in lax mode too (Rust has it in lax since M17) |
| F-3 | **Strict default-on for the JS surface pipeline** — bare `const`/`let`/`var`/`function`/`function*` at top level → throw, diagnostic text matching the Rust CLI's; `lykn()`/`expand()` default strict; explicit lax opt-out exists for harness/kernel paths only, no silent blanket bypass | unit tests: `lykn("(var x 1)")` throws with the Rust message text; nested case (`(func … :body (const x 1) …)`) compiles; lax opt-out compiles bare forms | serious | slice01 bubble-up ① | open | | strict rejects **exactly** the 5 heads + invalid `kernel:` — nothing else (unknown heads stay function calls) |
| F-4 | **Migration audit** — every JS-path call site compiling bare kernel-form source enumerated + classified (migrate to `kernel:` / lax variant / `compile-kernel` / leave-with-rationale); counts reconciled (CDC one-line grep: 38 sites / 9 `.lykn` test files; CC report estimate ~59); audit includes the **`lykn test` codegen script** (`main.rs:716–722` calls `lykn()` for `.lyk` too) and the **browser script-tag loader** (`examples/kernel/browser-src.html` loads `browser-app.lyk`, a top-level-kernel-form file) | table in the closing report; count reconciles with a stated repo grep | serious | slice-doc | open | | hot spots: `test/forms/destructuring-*`, `generator`, `function`, `default-params`, `class-expr`, `async-await`; plus `helpers.js`, browser, `main.rs` codegen script |
| F-5 | **Migration applied (repo-only)** — call sites migrated per F-4; `compileBoth`'s JS side explicitly lax with rationale comment (mirroring its existing `--no-strict` comment); the `lykn test` codegen script and browser loader thread mode by extension (`.lyk` → lax) so the kernel exemption is structural; kernel destructuring/generator coverage preserved (not deleted to get green) | `deno test --config project.json -A test/` 0 failed; `lykn test` 0 failed (incl. `test/kernel/*.lyk`); browser kernel examples still work (`lykn build --browser` + manual or scripted check); grep shows no bare kernel-head source compiled through a strict path | serious | slice-doc | open | | migrating a test must keep what it verifies — surface any coverage loss |
| F-6 | **Guide parity-gap fences flipped** — `lykn,skip` fences whose only skip reason was the JS parity gap become `compile-fail` (bare-form demos, now erroring on the JS doctest path) or runnable (`kernel:` demos, now compiling); remaining skips carry a rationale; guide-16's fence documentation stays accurate | ``grep -rc '^```lykn,skip' docs/guides/*.md README.md`` count reduced by exactly the audited flips; `make test-docs` 0 failed | correctness | slice01 F-8 / cdc-verification follow-up | open | | grounded 2026-07-05: **14 fences** in guides (00:3, 01:4, 06:1, 09:1, 10:1, 16:4) **+ 1 in README** = 15; not all are slice01's or parity-gap (guide-16's are the testing guide's own examples) — audit all 15, flip only the parity-gap subset, table says which and why |
| F-7 | **A-3 composition demo at language level** — each of the 5 bare heads errors on **both** compilers (JS API throw + Rust CLI diagnostic); `kernel:` resolves each on both, convergent output | demo transcript: `lykn("(const x 1)")` … throws ×5; `lykn compile` errors ×5; `(kernel:<form> …)` ×5 via `compileBoth` | serious | arc10 A-3 | open | | this is the evidence arc10's A-3 has been waiting on (currently *partial*, Rust-only) |
| F-8 | **Rebuild-first full green** | `make check` green; `make test-docs` 0 failed; `lykn test` 0 failed; `deno test --config project.json -A test/` 0 failed; `cargo clippy --all-features --workspace -- -D warnings` exit 0 | serious | standing bar (2026-06-30 process standard) | open | | doc-touching slice → `make test-docs` mandatory; rebuild first, trust nothing stale |

## What Worked

- **Grounding the open set in the actual code paid off again**: the two
  CDC-ground-truthed breakage paths (`main.rs` codegen script, browser
  loader) were real and landed as clean, small fixes instead of surprises.
- **Empirical migration sizing beat both grep estimates** (26 actual vs
  38/59 estimated) because the shared-helper fix covered call sites
  wholesale — the audit-then-classify discipline surfaced *why* the numbers
  differed instead of leaving them in tension.
- **Behavior-parity-not-structure-parity** as the porting rule kept the JS
  implementation idiomatic (a pre-pass fits the JS expander architecture)
  while the whitelist/diagnostics stayed byte-faithful.

## Closure

Closed 2026-07-05 (commit `feb056c`). Verified by: CC (attested) + CDC
(`cdc-verification.md`: git/code/grep-verified; whitelist parity
independently reproduced by set-diff; runtime attested). Rows: 8. Done: 8.
Deferred: 0. No-op: 0. **Bubble-ups:** A-3 partial → met; two CDC findings
routed (macro-boundary strict asymmetry → slice03 scope assessment;
`kernel:` compileBoth corpus gap → slice03 drive-by); CC follow-ups filed
(kernel-form set duplication, strict|strict harness, browser-example
equality bug → arc07, release notes → arc09).

> Breaking change (JS API + browser inline scripts): flagged for the 0.6.0
> release notes (arc09). Design sub-questions (API option shape; check
> placement; browser default; did-you-mean depth) go in the closing report,
> not decided silently. **Rust compiler/classifier changes are out of scope**
> (a discovered Rust divergence is surfaced, not silently fixed); the one
> sanctioned Rust touch is the `main.rs` codegen script threading mode by
> extension (F-4/F-5). Downstream (mycelium) stays a filed follow-up.
