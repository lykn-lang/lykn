# Slice 01: dd58-strict-default — Closing Report

**By:** CC (Claude Code) · **Date:** 2026-07-05 · **Branch:** `release/0.6.x`
**Verdict: delivered (Rust side) — DD-58 strict is now default-on for `.lykn`
compilation** across `lykn compile`/`run`/`build`/`check` (the `lykn test` path
already enforced it). The repo compiles green under strict. **One major finding
reshapes the arc:** the **JS compiler implements neither strict mode nor the
`kernel:` escape**, so full DD-58 parity across the JS-compiled paths (doctests,
`deno test`) is a **filed follow-up**, not this slice. Scope confirmed with the
operator: **the 5 kernel-only declaration forms only** (`const`/`let`/`var`/
`function`/`function*`).

---

## F-1 — Enforcement-point trace

`.lykn` compilation runs through **two backends**:

| Command | Backend | Path | Strict before | Strict after |
|---------|---------|------|---------------|--------------|
| `lykn compile` | **Rust** | `cmd_compile` → `compile::compile_source` → `codegen::emit_module_js` | ✗ (`classify`) | ✓ (`classify_with_options`, strict for `.lykn`) |
| `lykn run` | **Rust** | `cmd_run` → `compile_file` → `compile_source` | ✗ | ✓ |
| `lykn build`/`dist` | **Rust** | `cmd_build` → `dist::build_project` (`dist.rs`) | ✗ | ✓ (per-file ext) |
| `lykn check` | **Rust** | `cmd_check` (was parse-only) | ✗ (no classify) | ✓ (`compile::check_strict`) |
| `lykn test` (`.lykn`) | Rust validate + **JS** codegen | `compile_lykn_test_files` (`main.rs`) | ✓ already | ✓ (unchanged) |
| `lykn test --docs` | **JS** (`lykn()`) | `doctest.rs` → generated `.test.js` importing `packages/lang` | ✗ | ✗ (JS has no strict) |
| `deno test test/` | **JS** (`lykn()`) | `helpers.js` `compile`/`compileBoth` | ✗ | ✗ (JS has no strict) |

**Enforcement wired** into the Rust `compile_source` (via a new
`classifier_options_for(file_path)` — strict for `.lykn`/`None`, exempt for
`.lyk`), `dist.rs`, and `cmd_check` (new `check_strict`). The `.lyk`
kernel-file exemption is preserved.

---

## F-2 — Strict default-on (TDD)

Added `classifier_options_for` + `compile_source_inner`; `compile_source` now
calls `classify_with_options`. TDD in `compile.rs` (5 new tests): bare
`const`/`let`/`var`/`function` in `.lykn` → error; `(kernel:var …)` compiles;
`None`-path is strict; `.lyk` exempt; operators/surface stay legal. Diagnostic is
the existing DD-58 message (`'const' is a kernel-only form; use 'bind' … or
'(kernel:const …)'`). **No silent blanket bypass** — the per-form `(kernel:…)`
escape is the sanctioned resolution (Rust only; see the JS-parity finding).

## F-5 — A-3 composition demo (5 forms)

Verified via the release binary:

```
(const x 1)      → error: 'const' is a kernel-only form …
(let x 1)        → error: 'let' is a kernel-only form …
(var x 1)        → error: 'var' is a kernel-only form …
(function f () 1) → error: 'function' is a kernel-only form …
(function* g …)  → error: 'function*' is a kernel-only form …
(kernel:const x 1) → const x = 1;      (kernel:var …)/(kernel:function …) likewise
(bind x 1)/(= 1 1)/(=== 1 1)/(&& 1 1) → compile (operators legal, per DD-58)
```

The report's other "leaks" (`==`, `this`, `arguments`, `require`, IIFE) are **not**
DD-58 violations and stay legal — routed to arc05 (linter), as the corrected scope
directs. `require`→invalid-ESM is not fixed here.

---

## F-3 / F-4 — Migration (repo-only)

**Strict checks only top-level form heads** — nested kernel forms inside surface
bodies compile fine (verified: `(genfunc … :body (let a 0) …)` and
`(func … :body (const x 1) …)` both compile). So only **top-level** bare kernel
forms are hard offenders. `lykn build` (packages) and `lykn test` (test `.lykn`,
already strict) were already clean; `examples/` clean. The migration was
**guide doctests** only:

| Guide | Occurrence(s) | Disposition |
|-------|---------------|-------------|
| `02-api-design.md` | `function*` lazy-map/lazy-filter | → `genfunc` (surface) |
| `08-performance.md` | `function*` lazy-filter/lazy-map/take | → `genfunc` |
| `01-core-idioms.md` | `const` object/array destructure (ID-… ) | → `bind` (surface destructuring) + prose |
| `01-core-idioms.md` | `function find-max` (rest params) | → `func :args (… (rest …))` |
| `01-core-idioms.md` | `const arr`/`const step` intermediate bindings | → `bind` + prose |
| `00-lykn-surface-forms.md` | `const` destructuring section | → `bind`; retitled "Destructuring" (was "(kernel forms)") |
| `06-functions-closures.md` | `function* simple` ("kernel function* still available") | **`skip`** — kernel technical doc |
| `01-core-idioms.md` | ID-38 top-level `=` semantics (`let`/`function`) | **`skip`** — kernel-semantics doc |
| `01-core-idioms.md` | ID-39 kernel object methods (`function`/`const`) | **`skip`** — kernel technical doc |
| `01-core-idioms.md` | ID-42 threading in `.lyk` (`const` bindings) | **`skip`** — kernel-file doc |
| `09-anti-patterns.md` | ID-38 (F-8, below) | reframed |

Direction from the operator: guides are moving to **100% surface**; kernel forms
get **technical documentation only**. So surface-teaching examples were converted
to surface forms; deliberate kernel-form documentation was marked `skip` (kept as
reference, not a runnable doctest). No bare top-level kernel form remains in any
**runnable** guide doctest.

## F-8 — Guide-09 ID-38 reframe

Split ID-38: **declaration forms** (`const`/`let`/`var`/`function`/`function*`)
are kernel-only → **compile error** in surface (use `bind`/`func`/`fn`/`genfunc`
or `(kernel:…)`); **operators** (`===`/`&&`/`||`/`==`) are **legal surface
passthrough** — a lint preference (`=`/`and`/`or`), not eliminated. The `const`
demo is `skip` (a strict compile-error can't be a JS-`compile-fail` — see the
JS-parity finding); the operator demo compiles.

---

## Verification (rebuild-first)

**Observed (2026-07-05, rebuild-first):**
- `make check` → **`✓ All checks passed (build + lint + test)`** (exit 0) — F-6.
- `make test-docs` → guides `468 | 0` (4 fewer than the prior `472` = the newly
  `skip`ped kernel-doc blocks), README `1 | 0`, examples `2 | 0` — all green.
- `lykn test` → **`1345 | 0`**; `deno test --config project.json -A test/` →
  **`658 | 0`** (compileBoth now passes `--no-strict`) — F-7.
- `cargo test --all-features --workspace` → 17 suites `ok`, 0 failed;
  `cargo clippy --all-features --workspace -- -D warnings` → exit 0 — F-7.
- A-3 demo (F-5): the 5 kernel-only forms error in `.lykn`; `(kernel:…)` resolves
  each; operators/surface stay legal.

---

## Design-call answers (surfaced, not decided silently)

1. **Does `lykn check` go strict-by-default?** **Yes** — implemented. `cmd_check`
   was parse-only; it now runs `check_strict` (read→expand→classify strict for
   `.lykn`, `.lyk` exempt), so the validation compiler enforces the same rule as
   `lykn compile`/`build`.
2. **Is a `--no-strict` escape hatch warranted?** **Yes — but scoped to the
   cross-compiler coherence harness, not surface authoring.** Forced by the
   JS-parity finding below: `compileBoth` compiles the same source with **both**
   backends and compares codegen; since the JS compiler has no strict mode and no
   `kernel:` escape, the Rust side must run **lax** for a meaningful comparison.
   Added `lykn compile --no-strict` (documented as harness-only) and wired
   `compileBoth` to it. For **users**, the sanctioned per-form escape remains
   `(kernel:…)` (Rust); there is intentionally **no** user-facing blanket bypass.
   (Note: `--no-strict` currently applies to the stdout path used by the harness;
   the `-o`/dts path stays strict — the harness never uses `-o`.)

---

## Bubble-up to arc10

**① MAJOR — the JS compiler lacks BOTH strict mode AND the `kernel:` escape.**
`(kernel:const x 42)` → `kernel.const(x, 42)` in JS (a bogus member call) vs
`const x = 42;` in Rust; `classifier.js` has no strict concept at all. Consequences:
- "DD-58 complete" holds only for the **Rust CLI** paths. The **JS-compiled**
  paths (`lykn test --docs` doctests, `deno test test/`) remain lax — a `.lykn`
  authored via those paths is not strict-checked.
- Guide-09/00 kernel demos **cannot** use `kernel:` (JS emits garbage) and
  **cannot** be `compile-fail` (JS has no strict) in doctests — hence `skip`.
- **Follow-up slice (recommended next in arc10): JS-compiler DD-58 parity** —
  implement strict mode + the `kernel:` escape in `packages/lang` so both
  compilers enforce the closed namespace. This is the real "surface is genuinely
  closed everywhere" work and is larger than this slice (it touches ~59 JS test
  call sites that compile bare kernel forms, plus doctests).

**② Downstream (mycelium) migration** — deferred per the operator; file as a
repo-external follow-up (bare kernel forms in downstream `.lykn` will break once
they consume a strict compiler).

**③ slice02 (`_kernel` removal)** — untouched here; the strict classifier's
closed-namespace dispatch (`is_kernel_only_form` = the 5 forms) is the
authoritative surface/kernel boundary and is a good reference point for that work.

**④ Minor defects noted (from the anti-patterns report, not fixed here):**
`js:function` emits malformed JS; `(require …)` compiles to un-runnable ESM.
arc05/linter material.

---

## Discipline notes

- Breaking change; lands. Migration was guide-doctests only (packages/tests/
  examples already clean). Surface-teaching examples → surface forms; deliberate
  kernel docs → `skip`.
- `docs/design-v0.6.0/**` left to CDC except this closing report.

Handed back for CDC `cdc-verification.md`.
