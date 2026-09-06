# Slice 01: dd58-strict-default — CDC Verification

**By:** CDC (Cowork) · **Date:** 2026-06-30
**Verdict: accepted — slice01 closed.** DD-58 strict is now default-on for `.lykn`
on the **Rust CLI**, scoped to the correct 5 forms. One major bubble-up (JS-compiler
parity gap) routed to a new arc10 slice.

## Verification (git + code review; runtime CC-attested)

| Row | How CDC verified | Strength |
|-----|------------------|----------|
| — commit/scope | **git:** `faee8a1` on `release/0.6.x`; diff is Rust (`compile.rs`+164/`dist.rs`/`main.rs`) + guides + `helpers.js` — **`packages/lang/` untouched** (grounds the JS-parity finding). | reproduced (git) |
| F-1/F-2 enforcement | **code-reviewed** `compile.rs`: `classifier_options_for` → `strict: !is_lyk` (`.lykn`/None strict, `.lyk` exempt); `compile_source` classifies strict; `check_strict` makes `lykn check` enforce it; `compile_source_lax` + `--no-strict` for the harness. Wiring is exactly the 5-form design. | reproduced (code) |
| A-3 (5 forms) | code-verified the path (bare `const`/`let`/`var`/`function`/`function*` in `.lykn` → classify error; `kernel:` resolves on Rust). CC-attested runtime (`make check` ✓). | reproduced (code) + attested |
| F-3/F-4 migration | **grep:** guides migrated — surface-teaching examples → surface forms; **15 `lykn,skip` fences** for deliberate kernel docs; guide-09 ID-38 **reframed** ("operators `===`/`&&`/`==` are legal surface passthrough — a lint preference, not an error", :649). | reproduced (grep) |
| F-6/F-7 green | CC-attested: `make check` ✓, `lykn test` 1345/0, `clippy -D warnings` ✓, guide docs **468/0** (was 472 — 4 examples now `skip`, expected). | attested |
| F-8 guide framing | guide-09 kernel-form examples `skip`/`kernel:`-escaped; operator framing corrected. (See note: `skip` not `compile-fail` — because the doctest path is JS, which is lax — the parity finding.) | reproduced (grep) |

## Design sub-questions (answered by CC)
- **`lykn check` goes strict-by-default:** yes — `check_strict` (was parse-only).
- **Escape hatch:** `lykn compile --no-strict` exists but is **harness-only**
  (used by `compile-both`, which compares raw Rust vs JS codegen); the sanctioned
  per-form path stays the `kernel:` escape.

## ⚠ Major bubble-up (→ new arc10 slice)

**The JS compiler (`packages/lang/`) implements neither DD-58 strict nor the
`kernel:` escape.** CDC confirmed: `classifier.js`/`expander.js` have zero `strict`
concept and no `kernel:` handling; `packages/lang/` isn't in the slice diff. So:
- **Rust CLI** (`lykn compile`/`build`/`check`): strict enforced ✓.
- **JS-compiled paths** (doctests, `deno test`, and anything routing through the
  embedded JS compiler): **still lax** — bare kernel forms pass through, and
  `(kernel:const x 42)` mis-compiles (`kernel.const(x,42)` in JS vs `const x = 42`
  in Rust).

**Consequence:** DD-58 is complete on the Rust CLI but **not at the language
level** until the JS compiler reaches parity. This is why guide kernel demos are
`lykn,skip` (the JS doctest path won't error on them) rather than `compile-fail`.
arc10's **A-3 composition (surface prevents kernel-form leaks)** is therefore met
on the Rust path only — **arc10 stays open** pending JS parity.

→ Routed as **arc10 slice02 · js-dd58-parity** (recommended next; the DD-37 step-4
`_kernel` removal moves to slice03). Follow-up: once JS parity lands, the guide
kernel demos can go `skip`→`compile-fail`.

## Disposition

- Rows all done (F-8 as `skip`, correctly, pending JS parity). No silent drops. ✓
- **slice01 closed.** Operator host re-run recommended to reconcile the runtime rows.
- arc10 A-3 open until slice02 (js-parity).
