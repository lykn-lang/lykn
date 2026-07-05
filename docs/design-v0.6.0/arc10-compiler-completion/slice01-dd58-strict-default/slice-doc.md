# Slice 01: dd58-strict-default

> Complete DD-58: make its strict enforcement **default-on for ordinary `.lykn`
> compilation**, so surface lykn actually prevents the kernel-form leaks the
> design (and `philosophy.md`) already claim it prevents. **It lands** — a
> breaking change with a repo-wide migration. **Repo-only** this pass (downstream
> e.g. mycelium is a tracked follow-up, per the operator).

## Goal

Bare kernel-only forms (`function`, `function*`, `const`, `let`, `var`) written
directly in a **surface `.lykn`** file become **compile errors**, resolvable via
the `(kernel:<form> …)` escape — during normal `lykn compile`/`build` (and
`check`), not just `lykn test`. Then migrate the repo so everything compiles.

## Current state (why this is more than a flag flip)

- The strict classifier **exists** — `classify_form_strict` in
  `crates/lykn-lang/src/classifier/forms.rs:117` — but is invoked **only** by the
  test runner (`lykn-cli` `main.rs` `strict: !is_lyk`, in the `is_lykn_test_file`
  path). Its own unit tests exercise it, nothing else.
- `compile_source` (`crates/lykn-cli/src/compile.rs`) takes **no `strict`
  param** and does **not** call `classify_form_strict`. `classifier.js` (JS) has
  **no strict concept** at all (grep: none).
- So `lykn compile`/`build`/doctests emit bare kernel forms straight through
  (`(var x 1)` → `var x = 1`).
- **`.lyk` kernel-only files are, and must stay, exempt** (`is_lyk` → kernel-only
  mode). Strict applies to **`.lykn` surface** only.

## Scope (in)

1. **Locate the enforcement point** (F-1) — trace exactly where `lykn compile` /
   `build` / the doctest runner compile `.lykn`, and wire `classify_form_strict`
   in there (Rust `compile_source` path; confirm whether the doctest/JS path also
   needs it). Preserve the `.lyk` exemption. (Build on CC's anti-patterns-report trace.)
2. **Strict default-on** (F-2) — bare kernel-only forms in `.lykn` → the
   `classify_form_strict` diagnostic; `kernel:` escape resolves. No silent blanket
   bypass (the `kernel:` escape is the sanctioned per-form opt-out — flag if the
   migration reveals a genuine need for more).
3. **Migration audit + fix** (F-3/F-4, repo-only) — the offending occurrences
   (~9 `(var …)`, ~57 `(const …)`, ~35 `(=== …)`/`(&& …)`/`(function …)` across
   `docs/guides/`, `test/`, `examples/`). Classify each: **real surface code** →
   convert to the surface form (`bind`, `=`, `and`, `fn`); **documentation /
   anti-pattern examples** (esp. guide 09, guide 00 surface-forms reference) →
   either use the `kernel:` escape or mark the fence **`compile-fail`** (like the
   W-4d ICU fences); **`.lyk` kernel tests** → exempt, no change.

## Scope (out)

- **Downstream migration** (mycelium etc.) — deferred; tracked as a follow-up
  (repo-only this pass, per the operator).
- **DD-37 step-4 `_kernel` removal** — arc10 slice02.
- The broader arc07 guide-drift audit — though this slice necessarily touches
  guide 09's kernel-form examples (they become compile-fail), which *advances*
  the guide-09 "ELIMINATED"-is-now-enforced reframe.

## Verification approach

Rebuild-first. This lands + is breaking, so the whole repo must compile under
strict. Headline demo (A-3): the 10 leak snippets from the anti-patterns report
(`(var x 1)`, `(== a b)`, `(function f () …)`, `require`, IIFE, …) now **error**
in a `.lykn` file, and the `kernel:` escape resolves. `make check` + doctests +
`.lyk` kernel tests all green.

## Exit criteria

Strict default-on for `.lykn` (exempt `.lyk`); the 10 leaks error; the repo
migrated so `make check`/doctests are green; the guide's "ELIMINATED" claims are
now compiler-enforced. Downstream migration filed as a follow-up.

## Design sub-questions (surface, don't decide silently)
- Does `lykn check` also go strict-by-default? (It's the validation compiler —
  it should.)
- Is any blanket escape hatch (`--no-strict`) warranted, or is `kernel:` enough?
  (Default: `kernel:` only.)
