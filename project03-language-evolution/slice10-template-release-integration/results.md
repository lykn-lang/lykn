# CC results — Slice10 template release integration

Date: 2026-11-06. Implementer: fresh OpenAI 6 Luna High CC. CDC `/root/cdc` (OpenAI Sol 6.1 High) is the assigned independent verifier. This is doer-attested evidence; CDC acceptance remains pending.

## Intake and contract readback

I read the full Slice10 `cc-prompt.md`, `slice-plan.md`, `ledger.md`, and the current Lykn repository guidance in both planning and release homes. Planning was `bb8188d7cf590320b6cc590b271f7b389024bbaf` on `planning`; source began at `ae51223089def7b7b3498519d9f51283b3a6065b` on `release/0.6.x`. The two live `AGENTS.md` files were byte-identical (SHA256 `1b5d78b96a4ef888153696e8e6656029ee24bc00be602ad5568e40265398c73d`).

Required prior evidence read: full Slice08 `cdc-verification.md` (Phase A, accepted repair, and frozen pilot sections) and Slice07 `artifacts/release-integration.md`. The accepted Slice08 repair is source commit `a061c2149792178ba037d17a31220545e34b4ac1`; its exact reviewed delta is 13 target-relative paths. Slice08 already independently observed 22 native and 22 public-JS values, fresh-XDG materialization, and an unfiltered release gate. Slice07 provides the local non-FF release-merge precedent. Neither prior record substitutes for this integration's own gates or CDC's independent review.

Loaded framework/gate guidance: collaboration-framework entry and engineering-methodology role/shared-invariant and Autonomous Mode sections; Project Management Guides README and Autonomous Mode execution rules; work-verification ledger discipline, evidence strength, and independent verification; testing validation gates; Rust/Cargo guidance and JS/Deno test guidance. Source-grounded reading was from this assigned release worktree: `skills/lykn/SKILL.md` (CLI, Deno testing, and compiler-owned output sections) and `docs/philosophy.md` (source-only workflow, contributor obligations, and compiler-owned output quality). The operative integration contract is the exact-identity/clean-tree gate, local-only merge, full unfiltered `make check`, focused native regression, committed citation gate, and three-way compiler-byte reconciliation; it does not authorize repairs or propagation.

Pre-mutation readback sent to CDC: preserve sole release source/index and this slice's specified planning ownership; verify target/repair/task identities and predicted tree; make the exact local merge with two trailers; run the prescribed gates with Rust 1.97.0 and owned XDG/npm caches plus the existing DENO_DIR; retain raw receipts; leave acceptance open for CDC; do not push, publish, propagate, add fixes, or author helper logic. No Python or alternate authored scripting was used.

## Inputs and local integration

Before mutation, both worktrees were clean. The task branch was `bc83b43cc9084d0eddb910c73497cef0f9c43179`; accepted repair `a061c2149792178ba037d17a31220545e34b4ac1` was its ancestor. `git merge-tree --write-tree --name-only ae51223089def7b7b3498519d9f51283b3a6065b a061c2149792178ba037d17a31220545e34b4ac1` predicted tree `572bc953a053c34cf4ded4520c36d12e7657c2c3`, identical to the task tree. The final target-relative path set was exactly the 13 reviewed template implementation, fixture, and test paths. `AGENTS.md`, `Cargo.lock`, and `Makefile` were unchanged; pre-merge lock SHA256 was `672c8bf62e441cfaa6ec22bd511d55e002812d8f18814faea0e99d4c5e2813ce`. No configured hooks path or active non-sample hook was found.

A normal `git merge --no-ff` created `f70565566088f5d55129edda6bd73a4691e5a58d` with parents `ae51223089def7b7b3498519d9f51283b3a6065b` and `a061c2149792178ba037d17a31220545e34b4ac1`, and exact tree `572bc953a053c34cf4ded4520c36d12e7657c2c3`. The post-merge target-relative diff contains exactly those 13 paths. Raw `%b` confirms both contiguous trailers. Release worktree and index are clean after the merge and gates. No push, publication, remote CI, other merge, or other release propagation occurred.

## Runtime and validation receipts

The source cwd selected Rust/Cargo 1.97.0 from `rust-toolchain.toml` (rustc SHA256 `f7c7e11eb2e07f006e532a8aaac77b32f4527d305ac386c0c633ca6133d35ca9`) and `/opt/homebrew/bin/deno` 2.9.6 (SHA256 `2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74`). The full gate used exactly:

- `npm_config_cache=$PWD/target/slice10/cc/npm-cache`
- `XDG_CACHE_HOME=$PWD/target/slice10/cc/xdg-cache` (fresh before the run)
- `DENO_DIR=/Users/oubiwann/Library/Caches/deno` (existing fixed cache)

`make check` ran unfiltered and exited 0. Its raw transcript and exit are [make-check.log](artifacts/evidence/cc/make-check.log) and [make-check.exit](artifacts/evidence/cc/make-check.exit). Observed totals: 25 Rust test-result summaries with 1,509 passed, 0 failed, and three empty selections. The affected native test binary selected one test and passed it; that test emitted 22 observations over the six fixtures. The JS+Lykn suite selected 1,467 tests across six steps and passed all; the public strict-JS template test ran one test over the six frozen fixtures and passed. Documentation selected 482 and passed all. The canonical full target includes dependency checking, citations, release build, lint/format, Rust tests, JS+Lykn tests, and documentation tests. Legacy npm compatibility tests remained part of the unchanged gate. The standalone `make check-cited-paths` exited 0, resolving 63 documents with 601 historical citations; its log and exit are retained.

The focused `cargo test --offline --locked -p lykn-cli --test template_string_boundary -- --nocapture` exited 0: one native test, six fixtures, and 22 observed values (four plain/interpolated/concat/ICU observations each for P1–P5 and both raw paths for P6). Exact stdout, generated JS, and exit are in [native-focused.log](artifacts/evidence/cc/native-focused.log) and [native-focused.exit](artifacts/evidence/cc/native-focused.exit).

After the full gate, absolute `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/target/release/lykn --version` exited 0 and reported `lykn 0.6.0`. Both that newly built binary and `bin/lykn` hash to `57a49f559a79700d66a2d1db216bd179d54fd0c51fd7f2626ff2029bd3163d28`. Canonical `packages/lang/compiler.js`, embedded `crates/lykn-lang/embedded/packages/lang/compiler.js`, and the compiler materialized by the fresh XDG test route at `target/slice10/cc/xdg-cache/lykn/embedded/0.6.0/packages/lang/compiler.js` all hash to `50db21ce3d1f30325e9541c284cb37ffdc3f6e93bad55521a26cd6b4734ac1f4`; both byte comparisons exited 0. [materialized-identities.log](artifacts/evidence/cc/materialized-identities.log) records hashes and comparisons. Lock hash remained unchanged.

## Attempt notes and evidence custody

A preliminary `cargo binstall --version` availability probe was malformed because that option requires a value; the raw probe exited 2 and is retained. `cargo binstall --help` then exited 0, confirming availability; `cargo-outdated` 0.17.0 and `cargo-llvm-cov` 0.6.21 were present. No installation was attempted, and no validation gate failed or remained unrun.

One intermediate progress message initially reported 26 Rust summaries/1,685 passes by including an unrelated repeated 176-pass summary, and described the native suite as 22 tests. Re-reading the canonical full log established the figures above: 25 summaries/1,509 passes, one native test, and 22 observations inside that test. The focused native transcript independently confirms one test and the same 22 observations. The corrected values are used throughout this record.

The first CC gate outputs were written under the source worktree's `artifacts/evidence/cc` by mistake. I relocated those exact files byte-for-byte into this planning slice's canonical `artifacts/evidence/cc/` home and removed the accidental source-root directory. Source Git status is clean; the owned build and cache remain ignored under source `target/`. No gate was rerun because of that evidence-path correction. This custody mistake and correction are retained here for CDC reconciliation.

## Proposed dispositions and limits

CC proposes TI-01 through TI-04 as done at the doer-attested level, with the receipts above. TI-05 remains open for CDC's independent source/ancestry/path review, independent full release gate and witness checks, row-by-row disposition, and retrospective. All five ledger status cells remain `open` pending CDC.

This result establishes the specified local release integration and these exact local gates. It does not independently accept itself, claim a published release, validate other release homes, alter the prior bounded Slice08 pilot, or close inherited Project03/backlog obligations. No source repair was needed; no out-of-scope issue or unrun required gate remains from this CC execution.
