# Qualified ADT emission comparison protocol — proposal

**State:** initial proposal retained for provenance; superseded and not
executable. This file still contains only the initial L1/L2 sketches. The
iteration01-required L2 case/identity-sidecar candidate was not completed:
root found that separate producer evaluations can import the same cached
identity sidecar and thereby share a token, violating generative runtime
identity. Do not execute these initial sketches or mistake them for the
iteration01 gate. Root will issue iteration02 with a coherent same-module
facade versus direct-case-lowering comparison. QD-04 remains open; no cells
ran.

## Question and controlled scope

Compare whether qualified ADT emission supports useful tree shaking while
preserving owner identity, values, effects, exports and escaping namespace
behavior. The bounded population is fixed at two layouts × six consumers ×
two output settings = **24 unique bundle cells per contributor**. A separate
independent replay, if authorized later, is reported separately and does not
inflate or replace those 24 cells. No cell or replay was executed for this
draft.

Use exactly these consumer families for each layout:

| Consumer | Frozen demand | Primary oracle |
| --- | --- | --- |
| C1 unused ADT | Import/declare an ADT that is not observed; include a pure control | Zero retained ADT contribution, while unrelated wrapper/control remains accounted for |
| C2 one static case | Statically construct/match one case; other cases are unused | Used case and behavior retained; unused case code removed from full unminified output and attributable metafile/output bytes |
| C3 all cases | Statically use every declared case | All case constructors and selected behaviors retained |
| C4 same names | Two module owners both declare `Label.Text`; consume both | Values and match branches remain owner-distinct |
| C5 escaping/dynamic namespace | Export/return/store the namespace, then access members dynamically; include observable effects | All observable members, effects and exports retained |
| C6 imported alias | Import `Label` through an alias, including a lower-case alias | Alias resolves the same owner and statically selected behavior remains correct |

Freeze exact source files/bytes, owner IDs, public exports, build entrypoints,
expected value/effect traces and fixture checksums before execution. The
fixtures must make “unused” genuinely pure and distinguish wrapper/common
code from ADT-specific code. Preserve effectful constructor/guard/control
cases where applicable so removal cannot be manufactured by dropping an
observable effect. Test both Lykn-produced modules and the consumer boundary;
do not broaden the matrix with extra stimulus after observing outcomes.

## Candidate layouts (neither selected)

**L1: owner namespace object.** Emit a named owner binding whose members are
the cases, e.g. `export const Label = ...; Label.Text(...)`. This makes the
public namespace a first-class value and may retain members when the namespace
escapes. Static property access may or may not permit member elimination;
measure it. Any freeze/descriptor operation is a separate namespace mutation
decision and host-intrinsic concern.

**L2: flat case bindings plus namespace facade.** Emit owner-scoped private
case bindings and build a named `Label` facade for public/dynamic access. Static
compiler-generated references can target a case binding directly; escaping
facade use must retain every observable member. The facade must preserve the
same owner/case identity semantics as L1. Do not equate a renamed flat binding
with owner identity.

Both layouts must expose equivalent approved qualified public access and
named module exports. Lykn surface namespace imports and `export *` remain
banned. If either candidate uses a compiler-internal ESM namespace import,
label it as generated implementation detail and explicitly specify the module
boundary, package export map and `.d.ts` behavior; current source has no
`ImportNamespaceSpecifier` support. Any need to introduce it is a prerequisite
and expands/changes the candidate, requiring CDC agreement before execution.

The identity encoding must be selected independently or held byte/semantically
constant across both layouts. If it differs, this comparison confounds layout
with representation and cannot attribute results. Namespace mutability,
payload mutability, guard policy and hygiene must also be identical across the
two candidate fixtures or reported as uncontrolled and the comparison stopped.

## Cell construction and output measures

The cell key is `(layout, consumer, setting)`; no retries overwrite a cell.
Settings are one non-minified and one minified bundle for each of the 12
layout/consumer pairs. Record raw unminified bytes, raw minified bytes, and
gzip length computed from those exact minified bytes. Gzip is derived data,
not a third input or another compile. Do not gzip the unminified output. Record
the gzip executable/version and deterministic options in the frozen plan.

Use the already-built native esbuild 0.25.5 from
`slice06-native-esbuild-controls` with its recorded source/build receipt; do
not use a PATH-resolved substitute or rebuild. The existing pinned executable
was confirmed available read-only; `esbuild` is not on the current PATH and
`/usr/bin/gzip` is available. The prior source/build receipt records source
commit `ea453bf687c8e5cf3c5f11aae372c5ca33be0c98` and binary SHA-256
`b26c07a…fe1f` (use the full committed receipt when freezing commands). The
prior experiment stopped after C4 and a C5 parse failure; it supplies tool
provenance only, not evidence about either ADT layout.

Proposed esbuild controls, to be finalized with exact argv and paths before
execution, are bundle + tree shaking + ESM + neutral platform + ES2022 target
+ metafile + explicit output path, with minification toggled only for the
paired setting. Preserve complete stdout/stderr/exit, command/environment,
resolved input list, output files, metafile and hashes. The exact gzip
command/options must consume the captured minified output bytes. A fresh
directory and unique filenames per cell prevent stale-output contamination.
An independent replay uses a separate population directory and receipts.

## Falsifiable gates and inspection

**PR-01: unused and selective retention.** C1 passes only when complete
unminified emitted code/source bodies and metafile evidence show zero retained
ADT-specific contribution for the unused pure ADT, with common wrappers and
unrelated control code separately identified. C2 passes only when the used
case remains and unused case code is absent from the complete unminified
output/source body and attributable `bytesInOutput` or equivalent output
accounting. Then run the frozen behavior/effect oracle. A resolved-input list,
smaller byte count, absent minified identifier or minifier-only removal does
not prove tree shaking. A layout that cannot meet a predeclared retention
target fails honestly; do not change the target after results.

**PR-02: bounded cells and independent replay.** Count all 24 unique cells
with unique keys and both settings. Report independent replay separately with
its own exact denominator. A failed command still occupies its cell and is
reported; correction/new stimulus requires a separately approved plan and
must preserve the failed receipt.

For every cell, inspect complete unminified code, emitted source bodies,
metafile inputs/outputs and associated byte attribution. For every applicable
consumer, execute the frozen runtime behavior/effect controls only after
operator agreement: returned values and owner distinctions, exit/stdout/
stderr, retained effects, named exports and package entrypoints. C3 proves all
cases are usable. C4 proves identically named cases do not alias. C5 proves
escaping or dynamic access retains all members that remain observable. C6
proves import alias spelling does not affect identity or selection. Capture
the full export and declaration surfaces and compare them across layouts.

Record baseline and layout output differences by code region: ADT namespace,
case constructor, payload/guard helper, pattern dispatch, ordinary consumer,
shared wrapper and package glue. State limitations for bundler metafile
attribution where it cannot identify semantic contribution. Do not claim
effect preservation from byte comparison; use explicit effect oracle. Do not
claim namespace/payload mutation or host-intrinsic safety unless those policies
are frozen and their checks are included. Protected-host v1 only covers global
`Reflect` and exact `Reflect.apply`; `Object`, `Symbol`, freeze/descriptor
operations and other intrinsics require their own stated assumptions or a
separate contract decision.

## Stop conditions and reporting

Stop before running if operator agreement on the concrete protocol, layouts,
identity parity, source fixtures, exact commands or oracles is absent; if the
pinned binary receipt cannot be verified; if package exports/declarations
cannot be represented without unapproved surface syntax; or if a required
fixture is effectful when designated unused. On any unexpected parse, build,
metafile or behavior result, preserve the raw cell and stop the affected
continuation for disposition; do not rebuild, alter pins, switch tools or
weaken a gate. Report all planned, launched, failed and completed cells with
denominators. No experimental result is claimed by this protocol draft.
