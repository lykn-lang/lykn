# Slice06 CC closeout — bounded stop at C5 source parse

Date: 2026-11-05. Owner: CC. Evidence remains **attested**; ledger statuses remain
**open** pending CDC's formal disposition. CDC independently replayed the frozen
source/build and reproduced the C4 result and first C5 parse failure. This is a
bounded stop, not five-control completion or public-library acceptance.

## Result and exact endpoint

The pinned source-built esbuild 0.25.5 and Lykn 0.6.0-dev toolchains were used
without Node/npm. The frozen five-stimulus, ten-support, one-observer workspace
compiled and staged; all 15 stimulus/support generated JS files matched staged
JS, and all nine public exports resolved to the recorded paths. The C4-first
native bundle completed. Its complete code and raw metafile show the effect
side effect and used implementation retained, while the unused-pure declaration
and body are absent. The metafile resolves dead.js but gives it no selected
output contribution; used.js contributes 365 bytes and effect.js contributes
28 bytes. The 538-byte C4 bundle SHA-256 is
`6476e3082c6904e253caad9740d2463941b6f9ab49382a63a478f8ff5e433b8a`.

The authorized controls phase accepted that exact hash, then its first ordered
runtime `C5-source-before` exited 1 before module evaluation. Deno rejected
staged `yaml/value.js` line 4 (`if (!text = "answer: 42")`), generated from the
frozen Lykn precondition `(= text "answer: 42")`. The documented equality and
`:pre` surface were checked; CDC reproduced the mismatch. This assignment does
not authorize changing the specimen/support source or compiler/emitter, so CC
stopped at this evidence gap. There were no later bundles or runtime calls.

| Measure | Actual | Remaining |
| --- | ---: | ---: |
| Native esbuild bundles | 1 of 5 (C4 passed) | 4 unrun |
| Runtime invocations | 1 of 11 (C5 source-before failed before evaluation) | 10 unrun |

No runtime/API oracle passed. In particular, C5 did not prove all nine public
keys or positive unused-pure contribution; C1–C3 and remaining C4/C5 runtime
pairs are unrun. No bundle results establish package or general tree-shaking
acceptance.

## Ledger walk and proposed dispositions

All rows remain **open** pending CDC's final review, even where CC proposes
done. Evidence is CC-attested; the independent replay is recorded in CDC's
review channel and formal closure remains theirs.

| Row | CC evidence and proposed disposition | Remaining owner/work |
| --- | --- | --- |
| NE-01 | Pinned immutable esbuild source, Go/x/sys inputs and binary provenance; CDC rebuilt the binary and reproduced the hash. **Proposed done.** | CDC formal disposition. |
| NE-02 | Pinned Lykn build, dedicated task worktree and unchanged tracked source baseline; no product-source commit. **Proposed done.** | CDC formal disposition. |
| NE-03 | Five stimuli, ten supports, one observer and nine public keys were frozen before bundle/runtime; syntax, staging, data bytes and export maps were checked. **Proposed done.** | CDC formal disposition. |
| NE-04 | C4 actual metafile and complete emitted-code inspection distinguish resolved dead input from retained output. **Proposed deferred.** | A later authorized slice must establish C5 positive unused-pure contribution and then complete independent review. |
| NE-05 | The first runtime produced a durable C5 parse-failure receipt; ten calls and all functional/effect/API oracles remain unrun. **Proposed deferred.** | Resolve the documented-source/generated-JS mismatch under separate authority; then reauthorize and run the complete fixed sequence. |
| NE-06 | C4 is the only native metafile; C1, C2, C3 and C5 exclusion oracles are unrun. **Proposed deferred.** | Later authorized controls work after the C5 source-generation gap is resolved. |
| NE-07 | Failed attempts, correction commits, source/build/runtime receipts, actual denominators and original obligations are preserved here. **Proposed done.** | CDC verifies artifact inventory and records formal closeout. |

Original Project03 F-1–F-12, Project07 synthesis, licensing, bootstrap,
authoring, book and human gates remain open. No result here updates those
obligations or changes the parent ledger.

## Artifact and history inventory

- `artifacts/source/`: frozen input, five controls, ten support modules and the
  finite observer. Source corrections remain in separate planning commits.
- `artifacts/evidence/compilation/run-01` through `run-10/`: retained parse and
  delimiter failures, retries, successful strict compilation, checks, lint,
  generated-code inspections and unaffected-output comparisons.
- `artifacts/evidence/staging/run-07/`: dist receipt, staged-byte comparisons,
  export-map comparison, and the corrected-wrapper success; the earlier wrapper
  setup failure remains recorded.
- `artifacts/evidence/gate/run-08` and `run-09/`: pre-load failures retained;
  `run-10/`: exact C4 command/receipt, complete bundle and raw metafile, gate
  observations, pre-snapshot, and hashes.
- `artifacts/evidence/runtime/run-10/`: failed first C5 child receipt, outer
  command/stderr, controls observation, frozen YAML source/generated-JS witness,
  and command-log reconciliation. No later runtime evidence exists.
- `artifacts/evidence/source-review/` and `tool-identity.txt`: pinned Deno API
  witness and executable identities.
- Ignored task `target/lykn/tools/esbuild-0.25.5/`,
  `target/lykn/compiler-build/`, and
  `target/lykn/experiments/native-esbuild-controls/` retain rebuild inputs,
  tools and generated attempts; they are not committed to Git.

Planning history is preserved through scoped commits, including source freezes,
pre-gate corrections, C4 evidence and the C5 stop. The task worktree's tracked
source remains at pinned commit `74a90d51b853fc18fe2b7c6ee07417736e1ce464`;
no upstream/compiler patch, fixture repair, publish, push, release or remote CI
was performed. The final planning commit is reported in the handoff; the local
planning diff is checked and the working tree is clean.

## Retrospective notes for CDC

The first API/source readback caught nonexistent receiver/static methods,
incorrect root-versus-subpath C5 coverage, and insufficient actual metafile and
receipt evidence. Full emitted-JS review then exposed source-shape failures that
native `check`/`compile` success did not reveal: an expression-position catch
sentinel, a strict-mode reserved binding, and awaits nested in a synchronous
conditional IIFE. The observer corrections used pinned Deno APIs and explicit
async phase bodies, with every failed attempt kept. A final source/generated
mismatch in the frozen YAML precondition stopped C5 before evaluation. CDC owns
the formal retrospective and any durable follow-up; this report does not issue
an upstream defect conclusion or prescribe a compiler fix.
