# CC closeout — Arc05 S04 discard-aware declarations

Date: 2026-11-14

Root location correction2026-11-14: after CC's clean/no-jobs handoff, root
moved this complete doer report byte-preservingly from artifacts/cc/closing.md
to the canonical slice-root closing-report.md, then appended this notice. No
doer prose or evidence was rewritten. The source candidate and row proposals
below remain pending independent implementation review; the earlier path is
provenance, not a second current closing report.

## Source delivery

- Branch: `codex/qualified-adt-core`
- Base/release authority: `c60dea62d126bb07557a7f4f7183662dec3f6a58`
- Commit: `918f2e9c4237770fc7b2e0e950d726e735e95198`
- Tree: `37b1cd6e7a457caf94933a35cdac54335c7afb66`
- Parent: `c60dea62d126bb07557a7f4f7183662dec3f6a58`
- Final task source worktree was clean; only these four paths changed:
  `crates/lykn-lang/src/emitter/dts.rs`,
  `crates/lykn-cli/tests/discard_declarations.rs`,
  `docs/guides/00-lykn-surface-forms.md`, and
  `docs/guides/06-functions-closures.md`.
- Commit trailers are adjacent and intact. No release write/merge/push,
  publication, dependency change, or S05 work occurred.

## Implementation and oracle

The native DTS emitter now reserves normalized meaningful parameter names per
clause before allocating collision-free `arg{i}`/suffix labels. Parameter
positions remain intact; `_value` remains named; default and rest input types
follow required-position constraints, including nested tuple skip/default/rest
and object default fields under exact optional semantics. Bind and BindGroup use
the existing binding projection for inline and named exports. Scalar inference
is unchanged, destructured leaves remain `unknown`, and an empty module marker
is emitted only for explicitly handled empty inline Bind/BindGroup exports;
default, re-export, kernel passthrough and named-exports routes veto that marker.
Object/schema `_` keys remain data.

The retained pre-edit semantic red is in `artifacts/cc/baseline-red/`: valid
local type-only TS client, real c60 generated `.d.ts`, Deno exit 1 with exactly
two TS2300 duplicate-identifier errors, and a 1/1 Rust witness asserting that
real checker failure. The earlier invalid `import type`-as-value consumer is
separately preserved as a failed TS1361 attempt and is not counted as semantic
red.

The ordinary required-simple-after-destructured source spelling was separately
run through the existing release-worktree default/debug c60 binary. Its exact
input, command, stdout, stderr and status are in
`artifacts/cc/classifier-boundary/`; it exits 1 in existing CLI prevalidation
with “method call on a parenthesized expression”. The classifier/runtime source
was not changed. The accepted current CLI producer fixtures use first-position
destructuring followed by named defaults (reserving `arg0`/`arg0_1`), and a
named required argument before destructuring; the native lower-level shape test
also covers the required-named-after collision. Root has routed the existing
validator/API limitation to backlog `D-2611-MPVR` and an Arc02 unopened
candidate. This attribution remains an open owner item, not a claim that the
rejected spelling reached DTS generation.

## Final evidence

- `artifacts/cc/focused/final08/native-dts/`: 32 passed, 0 failed;
  1,179 library tests filtered.
- `artifacts/cc/focused/final08/`: CLI integration 4 passed, 0 failed;
  complete raw streams, actual child commands/statuses, generated DTS,
  TypeScript checker receipts, and runtime outputs are nested in `cli/`.
- `artifacts/cc/fresh-artifacts/final03/`: status 0.
- `artifacts/cc/gates/make-check-final03/`: status 0. Full results are
  1,786 Rust tests passed with no failed/ignored tests across 40 harness-result
  rows; 99 Lykn product inputs compiled; product suite 1,578/1,578 across 67
  steps; docs 482/482. Docs separately show 15 annotation/fragment skips and 9
  no-Lykn-block inputs.
- `artifacts/cc/m6-final/`: actual strict Deno 2.9.6 command/config, seven
  selected paths, 70/70 tests, full streams and five compiler warnings. Fourteen
  `.comparison.txt` receipts each show canonical equality to both embedded and
  materialized output.
- `artifacts/cc/gates/cited-paths-final-head/`: status 0, 64 documents,
  601 accepted historical citations.
- `artifacts/cc/gates/bundle-size-final-head/`: status 0, fresh gzip 48,689 B
  against 81,920 B; raw/minified sizes and actual esbuild download/astring
  condition warnings are retained.
- `artifacts/cc/gates/make-check-final/` preserves the initial Clippy
  `redundant_guards` failure; `make-check-final02/` preserves the next
  formatting-only failure. The direct cargo-format correction touched only the
  permitted DTS source. `make-check-final03/` is the terminal successful gate.
- `artifacts/cc/focused/retry01/`, `retry02/`, `retry03/`, `final03/`,
  `final04/`, `final05/`, `final06/`, and `final07/` preserve observed failed or
  superseded test conditions and successes. Some intermediate retry test-source
  versions were not snapshotted byte-for-byte; no such preservation is claimed.
  The baseline and final test sources are retained in their canonical locations.

A first `git commit --only` attempt rejected the new test path because it was
untracked. The exact test file was then staged and the same explicit four-path
`git commit --only` succeeded; no other source path entered the commit. No jobs
remain and final HEAD is clean.

## CC row proposals for separate review

These are CC proposals only. No planning ledger row is accepted or closed by
this report.

| Row | CC proposal | Evidence and limit |
| --- | --- | --- |
| DT-01 | Proposed done | Actual generated declarations and TS calls cover repeated typed discards at indices 0, 1 and 2; later named `arg0`, `arg2`, and `arg0_1`; `_value`; defaults wrapping a first destructured slot; named-before-destructured slot; actual successful AnalyzedUnit and fresh-unit allocator tests. Ordinary required-simple-after-destructured CLI syntax is rejected before generation by the existing validator, recorded above. |
| DT-02 | Proposed done | Actual generated-DTS strict/exact-optional consumer covers default-before-required, trailing and before-rest defaults, discarded rest, tuple before-required/trailing/default/rest/bare-skip optional positions and object default. Native tests cover renderer boundaries. |
| DT-03 | Proposed done | CLI tests cover inline typed/inferred scalar, Bind destructuring, reserved data keys aliased to names, named exports, exact TypeScript `keyof` namespace and runtime keys, empty inline group, stale sidecar replacement, non-module source, and default/re-export/kernel veto controls alone and mixed. |
| DT-04 | Proposed done | TypeScript and runtime checks retain object `_`, ADT `_` property/constructor input, missing constructor field rejection, real `TypeError`, foreign global `_ = 99`, `_value = 7`, empty non-module behavior, overload/warning preservation. |
| DT-05 | Proposed done | A successful AnalyzedUnit projects declarations; CLI normal/stripped DTS bytes match and produced JS is executed; actual `lykn build` package with `emitDts:true` has byte-identical declaration to CLI output for identical source. |
| DT-06 | Proposed done | Local generated `.d.ts` consumers use offline Deno with strict, exactOptionalPropertyTypes and skipLibCheck false; positive and expect-error calls pass and unguarded wrong type yields actual TS2345; runtime/data/export namespace oracles pass. |
| DT-07 | Proposed done | Focused suites, `make fresh-artifacts`, terminal `make check`, exact M6 70/7-path/14-comparison evidence, final-HEAD citations, clean exact-path commit and fresh gzip budget passed. Earlier failed Clippy/format attempts remain separately preserved. |
| DT-08 | Open pending | Separate Sol eight-row disposition and root retrospective/routing are still required. CC inventory, history, explicit boundary and later-owner evidence are provided here. |

## Bubble-up

1. Keep the ordinary required-simple-after-destructured CLI parameter
   validator behavior attributed to existing `classifier/forms.rs` method-call
   prevalidation, distinct from reader, DTS emitter, and generated declarations.
   Root recorded backlog `D-2611-MPVR` and an Arc02 candidate; do not silently
   broaden this slice or claim that spelling was emitted.
2. Preserve downstream owners for class/generator/default/re-export/package
   declaration coverage, general source-name lowering and browser-facing
   declaration entrypoints, whole-language API inventory, qualified pattern
   state/IR provenance, and guide/book/human review, as described by the plan.
3. The measured size target fetched esbuild into the Deno cache during its
   required fresh measurement. This is a tool cache event; no repository
   dependency/lockfile changed.

Independent Sol review and root retrospective remain outstanding. All rows stay
open in the planning ledger until their owners record their disposition.
