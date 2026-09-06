# Slice 01: treeshake-audit — plan-of-record

**Status:** open (2026-07-07)
**Kind:** diagnostic audit — no production code changes
**Feeds:** 0.7.0 project definition (candidate arc: app bundling / dead-code-eliminated output)

## Goal

Determine whether — and precisely where — lykn's compiled JS output is
tree-shakeable by a standard ESM bundler (esbuild), and produce an
evidence-graded audit report that the 0.7.0 bundling work can be planned
against. The report answers three questions:

1. **What do the emitters place at module top level**, and which of those
   emissions are load-time side effects that block dead-code elimination?
2. **What does esbuild actually retain and drop** when bundling compiled
   lykn output, and do the outcomes match the static classification?
3. **What is missing from dist metadata** (`sideEffects`, PURE annotations)
   that the 0.7.0 work would need to add?

## Background (established in the 2026-07-07 planning session)

- Compiled output is already one ESM module per `.lykn` file, zero runtime
  deps — the structural prerequisites for tree-shaking are in place.
- Tree-shaking granularity is per-export plus esbuild's function-level DCE;
  the gating factor is top-level side effects in emitted code, not file
  separation.
- The CLI already embeds an esbuild-via-Deno invocation
  (`lykn-cli/src/main.rs::build_browser_bundle`) — precedent and machinery
  for a future `lykn bundle`.
- There are **two candidate emission paths**: native Rust codegen
  (`lykn_lang::codegen` / `emitter`) and the bridge path
  (`lykn-cli/src/bridge.rs`: kernel JSON → Deno → `packages/lang/compiler.js`).
  Which is authoritative for 0.6.0+ is audit step F-1, not an assumption.
- `sideEffects` appears nowhere in `crates/lykn-cli/src/dist.rs` (verified
  by grep, 2026-07-07).

## Scope

**In:**

- Identify the authoritative emission path(s); if both are live, both are
  in scope for the inventory and the cross-emitter diff.
- Static emission inventory: every construct each live emitter can place at
  module top level, classified pure-declaration vs load-time effect, with
  file:line citations. Surface families: `bind`, `func`, `type`, `match`,
  `cell`, threading macros, `template`/ICU, `import`/`export` (incl.
  re-exports), macro use.
- Fixture suite: one minimal `.lykn` module per surface family, plus a
  two-module app (`main` imports a strict subset of `lib`'s exports) as the
  shake target. Fixtures live under this slice's `fixtures/`, **not** under
  `test/` (they must not join the corpus run).
- Tree-shake experiment: esbuild `bundle+treeShaking+metafile` over the
  compiled fixtures; retained-vs-dropped measured from the metafile.
- Corpus scan: an ESTree walker over the compiled test corpus flagging
  effectful top-level statements.
- dist metadata review: generated `package.json` / `deno.json` fields
  relevant to shaking.
- Toolchain probe: Deno version, `deno bundle` availability, esbuild version.
- The audit report (`report.md` in this directory), severity-graded, with
  0.7.0 recommendations.

**Out:**

- Any change to compiler, CLI, or dist code. No `lykn bundle`
  implementation, no PURE-annotation emission, no `sideEffects` flag —
  those are the 0.7.0 work this audit informs.
- Minification aesthetics (identifier mangling etc.); only dead-code
  elimination is in scope.
- JSR/npm publishing behaviour changes.

## Verification approach — predictions before evidence

The experiment must test the static classification, not decorate it.
Sequence is therefore load-bearing:

1. **CDC static phase:** emission inventory, fixture sources, walker +
   experiment scripts, and a **committed per-fixture prediction table**
   (what esbuild will retain/drop and why).
2. **CC execution phase** (operator hands off `cc-prompt.md`): toolchain
   probe, fixture compile via the live path(s), esbuild experiment, corpus
   scan. Evidence lands under `evidence/`, strength *attested*.
3. **CDC close phase:** divergence table (prediction vs outcome, every
   divergence dispositioned), report assembly, ledger walk. Independent
   verification of CC's rows per LEDGER-DISCIPLINE.md.

**Named structural limitation:** CDC both performs the static analysis and
verifies the slice — weaker separation than the canonical CC-does /
CDC-verifies split. Mitigations: the prediction-before-run discipline makes
the mechanical experiment an independent check on CDC's classification; the
operator gates the close; CC's execution evidence is reproducible by
command transcript.

## Roles and handoff points

| Phase | Who | Why |
|-------|-----|-----|
| Emission inventory, fixtures, scripts, predictions | CDC (Cowork session) | Static reading + thinking work; no toolchain needed |
| Toolchain probe, fixture compile, esbuild run, corpus scan | CC (operator hands off `cc-prompt.md`) | Requires the repo's real deno/cargo/lykn versions, which CDC's sandbox does not reproduce |
| Divergence analysis, report, verification | CDC + operator gate | Judgment work stays in the main context |

## Exit criteria

The ledger rows in `ledger.md` (F-1 … F-12). Every row reaches
`done`/`deferred`/`no-op` with evidence per LEDGER-DISCIPLINE.md before
this slice closes. Iteration budget: five, per discipline.

## Version History

- **v1.0 (2026-07-07)** — initial plan-of-record. Layout
  (`docs/design-v0.7.0/01-treeshake-audit/`, arc wrapper collapsed,
  project-plan deferred) confirmed with operator this date.
