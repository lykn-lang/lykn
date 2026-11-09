---
project: project03-language-evolution
arc: arc03-protected-host-intrinsics
slice: slice02-lazy-protected-invocation
status: in-progress
planned-release: unassigned
depends-on: [slice01-versioned-host-protection]
---

# S02 — Lazy protected invocation

## HI-05 re-entry authority — 2026-11-09

The Operator approved a compiler-generated, feature-local ESM fallback only
for actual private request plans with a real normalized module-scope Reflect
binding. Keep the existing default helper, stable private identity/ordering,
exact empty-plan behavior, and no third-party or ambient runtime. Source stays
on `codex/lazy-protected-invocation` at accepted bounded baseline `801fcd83`.
Luna 6 High CC and Sol 6.1 High CDC remain in standard Autonomous Mode.
Implement and independently verify the fallback, then close S02 and Arc03 if
their criteria are met. No release integration, push, K or S04 implementation.

Before assignment, CDC will test one fixed inline static data-ESM encoding
using Lykn-authored specimens and the existing pinned native compiler,
Deno 2.9.6 and esbuild 0.25.5. Six Lykn compiles, two bundles and three
runs suffice: unbundled live-import/direct eval, statically used ordinary
bundle proof without direct eval, and a retained-bundle lookup observer.
The shaken ordinary entry is the static-use bundle and must retain the
provider effect and used marker while removing the unused helper/import.
The retained bundle must expose the invocation and defer host lookup.
No network/cache expansion, unbounded configuration search or policy changes.
Unexpected output stops architecture selection for that encoding. Actual
proof and remaining limits are retained with the assignment; this is neither
a source product result nor independent verification of a future implementation.

[Iteration 05](cc-prompt-iteration05.md) selects the tested static data ESM
encoding. After the initial specimen-compile setup corrections, both bundles
and all three prescribed strict Deno runs passed. The
[original and corrected feasibility receipts](artifacts/evidence/hi05-feasibility/)
retain exact input variants. The direct-eval proof is unbundled; current
pinned esbuild's top-level ESM eval limitation remains explicit. The
five-pass accounting and prior independent results retain their provenance.

[Iteration 06](cc-prompt-iteration06.md) is a bounded prevalidation correction
under the Operator's standard Autonomous Mode authority. The initial
implementation `f0ccce4` is preserved. Static review found that two raw writer
specimens retained CLI-only kernel prefixes and named-import assertions
assumed the wrong generator spacing. No candidate gate had run. This is
explicitly one beyond the normal five, with no reset or changed oracle.

## Prior bounded disposition — 2026-11-09

The [independent review](cdc-verification.md) accepts the eligible-module
delivery and exact four-case proof at `801fcd83`. It retains the actual
[CC return](closing-report.md) and [CDC retrospective](cdc-retrospective.md).
Refinement 04 of 5 is spent. HI-05 blocks complete S02; the Operator's
authorization to plan and implement the next source-ready step was applied
to the [bounded design pass](cdc-verification.md#hi-05-design-disposition).
The source is unchanged at this gate. The outstanding decision concerns
generated module imports or direct-eval lexical behavior. No S04 production,
release propagation or original tooling advance.

[Refinement 03](cc-prompt-iteration03.md) assigns the observed focused
assertion and unused Rust corrections. Normal refinement 03 of 5 is
assigned. The original four runtime results and HI-05 gate are unchanged.

[Refinement 02](cc-prompt-iteration02.md) follows clean `27eeef0`.
The normal commit used the correct dot-path fixed message after a failed
hyphen-path attempt that created no commit. Static review found request
shape/identity and fixture implementation gaps. No execution claim.

[Refinement 01](cc-prompt-iteration01.md) follows the exact
`c945bca8` source freeze. No source gate ran at that revision.
It preserves the disclosed commit-command deviation and assigns the
known local implementation gaps and original fixture completion.
Normal refinement 01 of 5 is assigned. HI-05 stays held.

## Authority and actual baseline — 2026-11-09

The Operator approved S02 implementation and independent validation in
standard Autonomous Mode, Luna 6 High CC and Sol 6.1 High CDC. Routine
in-scope fixes proceed with retained evidence and review. A real unresolved
design/evidence choice holds affected work. CDC owns planning and acceptance.
CC owns the existing task checkout, index and build only after intake.
Dedicated branch `codex/lazy-protected-invocation` starts from the exact
accepted S01 `e7b44c1cc8b36dc19c2faf6e9667b3f82d87c214`, tree
`407aba5e00b53ea682f073e6742a6de7324abaa7`. The S01 and local release
refs stay protected. No K, S04 production, release propagation, push or publication.

## Deliverable and real semantic boundary

Implement one compiler-private request for the already saved callable,
receiver and fully materialized argument list. A feature-local module function
calls the real `Reflect.apply` only when invoked. Caller-side reference/getter,
argument/spread and abrupt-control sequencing remains owned by S04 I3.
The helper name reserves normalized expanded bindings and free references.
Preserve public interfaces, public syntax/AST, existing import/export and
property names, and byte-identical ordinary output without requests.

A module-level `Reflect` declaration, import or hoisted var shadows bare
`Reflect`. Renaming it can change what the documented direct-eval escape hatch
observes, including a live imported binding. The anti-pattern guide discourages
eval but does not redefine its semantics. `globalThis.Reflect` cannot replace
the recipe because the approved host contract permits replacement of the
alias. Dynamic evaluation, new protected slots and imported support would
change the approved contract. Use an explicit internal unavailable result
for such modules, before returning JS. Do not expose it as a new source error.
Ordinary source compilation remains unchanged even with these bindings.

This slice's separable implementation and four-case proof proceed within
existing authority. A complete S02 or arc verdict remains held on this
module-level hygiene/interop choice. The retained design choices are
scope-aware remapping with an explicit eval contract, or a separately
authorized host/compilation boundary that preserves the lexical binding.
Do not select either silently. No S04 production use is claimed.

## Readiness and proof

The [assignment](cc-prompt.md) records the reviewed implementation recipe,
typed boundaries, fixtures, exact tool pins and mandatory independent gates.
Actual local esbuild v0.25.5 is the same previously reproduced binary and
clean source commit used in Slice06. Deno 2.9.6 matches its accepted pin.
No new tool acquisition. Test four finite optimizer conditions for each
backend. Retain source freeze, actual tool/argv/cwd/env, raw code, metafiles,
streams and statuses. The native compiler writes JS directly and public
compiler generates ESTree via astring. Neither may infer a request from text.
Independent review replays focused, four-case, full normal Make and citations.
Initial normal source refinements 0 of 5. Earlier S01 and original tooling
budgets and evidence remain unchanged.
