---
project: project03-language-evolution
arc: arc03-protected-host-intrinsics
slice: slice02-lazy-protected-invocation
status: in-progress
planned-release: unassigned
depends-on: [slice01-versioned-host-protection]
---

# S02 — Lazy protected invocation

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
