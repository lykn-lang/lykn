# Slice 03: dd37-step4-kernel-removal — Ledger

DD-37 step 4 (`_kernel` removal) + the arc10 boundary closeout (A-6/A-7/A-8),
bundled per the operator decision 2026-07-05 (A-6's enforcement shares the
`_kernel`-replacement signal). **Behavior-identity is the headline invariant.**
Rebuild-first verify. Per
`collaboration-framework/templates/LEDGER-DISCIPLINE.md`.

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| F-1 | **A-6 recon confirmed empirically + surface-macro map written** — (a) Rust: a user macro expanding to a top-level bare kernel-only decl errors under strict (CDC's claim is code-read only — confirm at runtime); (b) JS today: same input compiles; (c) enumeration of what the remaining `macroEnv` surface macros emit at top level (false-positive risk for post-expansion enforcement) | fixture macro + `lykn compile` transcript (Rust) + JS API transcript; macro-output table in the closing report | serious | slice02 CDC finding / A-6 | open | | **gates F-4; self-stop if (a) disconfirms** — contract adapts before code |
| F-2 | **`_kernel` marker removed** — zero reads/writes in `packages/` — replaced by a documented sanctioned-kernel signal covering all four setter roles (classifier output `expander.js:762,764`; `kernel:` escape `:750`; Obj pairs `classifier.js:297`; `kernelArray` — assess, likely dead) | `grep -rn "_kernel" packages/` → 0 hits; replacement design documented in closing report | serious | arc-plan A-5 (DD-37 step 4) | open | | mechanism = CC's call (wrapper / WeakSet / split-walk), constraints in slice-doc |
| F-3 | **Behavior identical after removal** — corpus, JS suite, doctests all green with unchanged semantics; **no compileBoth normalizer extension** (forbidden-extension policy: fix divergences, don't hide them) | `lykn test` ≥1354/0; `deno test --config project.json -A test/` ≥667/0; `make test-docs` 0 failed; `git diff` of `helpers.js` `normalize` = none | serious | arc-plan A-5 | open | | the invariant that made arc04 safe; same bar here |
| F-4 | **A-6 enforced on JS (Rust semantics, operator-decided 2026-07-05)** — a user macro emitting a top-level bare kernel-only decl throws the Rust-verbatim kernel-only diagnostic; `(kernel:…)` in macro templates compiles; nested macro-emitted kernel stays legal (top-level-only); sanctioned output (classifier / escape / surface-macro / Obj pairs) unaffected; DD-58 doc gains the refinement entry | new tests both directions; demo transcript on both compilers; `grep` DD-58 doc for the refinement entry | serious | A-6 (CDC finding + operator decision) | open | | Rust unchanged — it is the reference; Duncan reconciles odm versioning |
| F-5 | **A-7 kernel-form parity guard** — an automated test parses Rust `dispatch.rs` (`KERNEL_FORMS`, `is_kernel_only_form`) and JS `kernel-forms.js` (`KERNEL_FORMS`, `KERNEL_ONLY_FORMS`) and fails on any set difference; runs in the default `make check` path | seeded-mismatch demonstration (fails) + real-sets run (passes); named in `make check` output or its constituent commands | correctness | A-7 (slice02 bubble-up) | open | | kills the duplication risk slice02 filed |
| F-6 | **A-8 `kernel:` corpus rows** — the compileBoth corpus gains `(kernel:…)` rows (≥ the 5 kernel-only heads), green cross-compiler | corpus diff shows the new rows; `lykn test` green including them | correctness | A-8 (slice02 CDC finding) | open | | regression-protects the escape convergence F-7 demonstrated manually |
| F-7 | **Rebuild-first full green** | `make check` green; `make test-docs` 0 failed; `lykn test` 0 failed; `deno test --config project.json -A test/` 0 failed; `cargo clippy --all-features --workspace -- -D warnings` exit 0 | serious | standing bar | open | | this is arc10's last slice — the numbers here feed the arc composition run |

## What Worked

_(At slice close.)_

## Closure

_(At slice close: commit SHA, date, verifier, row disposition counts.)_

> F-1 gates F-4: recon before enforcement, self-stop on disconfirmation.
> Expander-core work — if the `_kernel` rework exceeds the slice (scope
> explosion, not iteration count), stop and surface for a re-slice rather
> than grinding. Bubble-up must state arc10's readiness for its
> closing-report + host composition run.
