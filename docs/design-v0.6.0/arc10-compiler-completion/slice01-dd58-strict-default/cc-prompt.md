# CC Prompt — arc10 / slice01 · dd58-strict-default

**From:** CDC (Cowork) · **To:** CC (Claude Code, host) · **Date:** 2026-06-30
**Branch:** `release/0.6.x` (fresh branch or worktree — Duncan's call; git host-side).
**Re:** **Complete DD-58** — make its strict enforcement default-on for ordinary
`.lykn` compilation, then migrate the repo. **It lands; it's breaking. Repo-only.**

> **⚠ Scope corrected 2026-06-30 (your finding — thank you; a CDC error):** DD-58
> strict rejects **exactly the 5 kernel-only declaration heads** — `const`, `let`,
> `var`, `function`, `function*` (`is_kernel_only_form`, `forms.rs:195`). It does
> **NOT** reject `==`/`===`/`&&`/`||` (legal surface passthrough) or
> `this`/`arguments`/`require`/IIFE (ordinary expressions). The earlier F-5/F-8
> ("all 10 leaks error") and "subsumes `require`" were wrong and are fixed below.
> **This slice = the 5 forms only.** The other anti-pattern leaks are arc05
> (linter) idiom rules, not DD-58 violations. **Option 1 (scope to DD-58 as
> designed) — confirmed by CDC.**

## 0. Read first
- `…/slice01-dd58-strict-default/ledger.md` (8 rows) and `slice-doc.md`.
- DD-58 (`docs/design/05-active/0059-dd-58-…md`) — **v1.1 Version History** records
  this decision; §strict-mode + the `(kernel:<form> …)` escape are the spec.
- Your own `workbench/cc-anti-patterns-verification-2026-06-30.md` — the trace +
  the 10 leak snippets that must become errors.

## 1. The finding you're fixing
`classify_form_strict` (`crates/lykn-lang/src/classifier/forms.rs:117`) **exists**
but is wired **only** to the test runner (`main.rs` `strict: !is_lyk`).
`compile_source` (`compile.rs`) doesn't call it; `classifier.js` has no strict
concept. So bare kernel-only forms emit straight through. This slice wires strict
into normal compilation.

## 2. The work (MUST)

1. **F-1 — locate the enforcement point.** Trace exactly where `lykn compile` /
   `build` / the doctest runner compile `.lykn` (Rust `compile_source` →
   `emit_module_js`? does any path route through the JS compiler?), and where
   `classify_form_strict` must run so bare kernel-only forms in **surface `.lykn`**
   are rejected. **Preserve the `.lyk` (kernel-only) exemption** — strict is for
   `.lykn` only. Write the trace.
2. **F-2 — strict default-on.** Wire it in: bare `function`/`function*`/`const`/
   `let`/`var` in `.lykn` → the `classify_form_strict` diagnostic; `.lyk` exempt.
   The `(kernel:<form> …)` escape is the sanctioned resolution — **no silent
   blanket bypass** (CLAUDE.md safety-gates). TDD the compiler change.
3. **F-3 — migration audit (repo-only), the 5 forms only.** Enumerate every bare
   `const`/`let`/`var`/`function`/`function*` in surface `.lykn` + guide doctests
   (repo grep: ~57 `const`, ~21 `let`, ~14 `function`, ~7 `function*` across ~29
   files; hot spots `docs/guides/{00,01,09}`, `test/`, `examples/`; many
   doc/comment false-positives to filter). **Do NOT touch `===`/`&&`/`==`** — legal
   surface. Classify each: **real surface code** → surface form (`bind`/`fn`);
   **documentation examples** → `kernel:` escape *or* `compile-fail` fence (as W-4d
   did for ICU); **`.lyk` kernel tests** → leave alone.
4. **F-4 — apply the migration** so the whole repo compiles under strict. Repo-only.
5. **F-5 — the A-3 demo (5 forms).** Confirm bare `const`/`let`/`var`/`function`/
   `function*` each error in a `.lykn` file, and `(kernel:var …)` etc. compiles.
   (The report's `==`/`this`/`arguments`/`require`/IIFE stay legal — don't touch;
   they're arc05 lint. Note `require`→invalid-ESM is *not* fixed here.)

## 3. Verify (rebuild-first, all green)
`make check` green; `make test-docs` 0 failed; `.lyk` kernel tests pass;
`cargo test`/`clippy -D warnings`/`lykn test`/`deno test test/` all green (F-6/F-7).
Guide-09: the **5 kernel-only-form** examples are `compile-fail`/`kernel:`-escaped,
and ID-38's framing is corrected so `===`/`&&`/`==` read as legal-but-non-idiomatic
(a lint preference), not compiler-eliminated (F-8).

## 4. Discipline
- Lands; breaking. The migration (F-3/F-4) is the bulk — be exhaustive (a missed
  bare form = a broken build).
- **Surface, don't decide:** does `lykn check` also go strict-by-default (it
  should)? Any `--no-strict` escape hatch needed (default: no — `kernel:` only)?
  → closing report.
- **Downstream (mycelium) is out of scope** — file it as a follow-up finding in
  the bubble-up; do not migrate it here.
- Leave `docs/design-v0.6.0/**` to CDC.

## 5. Close
`closing-report.md`: per-row walk + the F-1 trace + the F-3 migration table + the
design-call answers + a **bubble-up to arc10** (the downstream-migration follow-up;
anything the wiring revealed for slice02 `_kernel` removal) → hand back for CDC
`cdc-verification.md`. Closing slice01 makes surface lykn genuinely closed;
slice02 (`_kernel` removal) then finishes arc10.
