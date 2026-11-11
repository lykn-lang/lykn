# S03 B1 — isolate public type metadata per expansion

Implement the bounded [per-unit type-context design](artifacts/per-unit-type-context-design.md).
Luna 6 High CC, separate Sol 6.1 High CDC, standard Autonomous Mode. A is
independently accepted at 5caf3d87; LC-01 is its completed prerequisite.
B1 is a usable fresh-state repair within B, not qualified activation or all
of LC-02. Typed OwnerRef/CaseRef, lexical owner/alias semantics, nominal values,
precise DTS and purity remain the original B/C obligations.

## Intake, ownership and guidance

Source `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`,
`codex/qualified-adt-core`, clean baseline
5caf3d871a80a711c08dbda0db8c5f5446dffb56, tree
115ce5ecc254ea9ed15263612bed67b6cec80ab2. Root rechecked this accepted pin;
the relevant 16-to-5caf JS difference is only the reviewed multi-clause
implicit-return fix. Preserve that fix. Recheck source status before editing;
no reset or overwrite of unexpected edits. CC owns task source/index/build
after issue; root owns planning Git/index and parent plans. Sol reviews after
the clean committed handoff. No subagents, release edits/integration, push,
publication/tag, dependency or remote CI action.

No Python execution is permitted; no parity exception exists. No Python/Ruby/
Fennel/handwritten JS research helper, even temporary. New research helpers,
drivers, evidence processing and command-construction logic use Lykn. Actual
compiler JS/Rust and ordinary product tests are allowed. Native CLI/shell is
for direct invocation and simple filesystem lifecycle. Do not create a JS
research harness disguised as a test. These tests must exercise the actual
compiler/state regression as described below.

Read AGENTS, initial S03 plan/ledger, accepted A verification and the complete
linked B1 design. Load installed JS/Deno guidance (anti-patterns, values/shared
identity and API practices), testing, and Rust guidance for the small M6 edit;
read relevant source guides, not unrelated corpora. Root's applied decisions
and source/caller map are in the design. Recover truncated required text.
Return a concise source-cited readback, then implement; do not stop at a plan.

Create owned npm/XDG/tmp/evidence directories before setting TMPDIR or receipt
variables. Use explicit `DENO_DIR=/Users/oubiwann/Library/Caches/deno` and an
owned npm_config_cache from the first focused command; do not repair user cache
ownership. Record actual paths/tool pins. Keep receipt variables local to
focused commands rather than capturing every unchanged full-suite fixture.

## Binding implementation and source shape

1. Add private `packages/lang/surface-type-context.js` with fresh creator
   createSurfaceTypeContext. Each invocation allocates a Map AND fresh prelude
   field arrays. No new JSR entrypoint or emitted runtime helper. Remove the
   global typeRegistry and resetTypeRegistry; preserve macroEnv, explicit
   resetMacros registration/clearing and resetGensym semantics. No global active
   registry or save/restore/clear-in-finally workaround.
2. Implement the core's explicit environment wrapper, with `bindings` Set and
   `typeContext`. Both public complete expansion and public expandExpr create
   their own context; internal recursion and child scopes share it. Preserve
   expandExpr's existing Set argument/result and lack of Pass-0/Pass-1 side
   effects. Use existing extendBindingEnv for copied names; replace all seven
   env.has reads and the separate classifier clause Set with the prescribed
   wrapper/callback. Do not subclass Set, clone source ASTs, move macro expansion
   or change completion uses to transport state.
3. Pass helpers.typeContext at all three emitSurfaceForm sites and every
   statement/direct/result match adapter. Thread it through TypeDef, Match,
   IfLet/WhenLet and recursive constructor patterns/compileLetPattern. Private
   metadata consumers require the explicit context; non-metadata helpers remain
   usable without one. Keep the existing direct Not emitter pilot unmodified
   as a positive control. No helper silently creates a second context inside
   the same expansion. Fully lowered kernel still compiles without one.
4. **Explicit root disposition:** seed each unit's prelude field metadata from
   the old explicit-reset baseline. The old never-reset Map was empty; this
   intentionally normalizes reset-history-dependent behavior. It is not a
   runtime prelude or an unchanged cold positional fallback. Current legacy
   type syntax/fallback remains for this checkpoint and must enter the later
   qualified migration census; no flat constructor compatibility is promised
   as the final S03 language.
5. Mirror all five changed/new canonical modules into the actual embedded
   package. M6 compares NINE files: A's seven plus surface.js and
   surface-type-context.js. Existing recursive copy/*.js/npm/browser routes
   include the module; no filename export/allowlist or dependency addition is
   needed. Keep cold copied CLI/config/lock/no-canonical-fallback controls.

The exact supported public API change here is removal of resetTypeRegistry
from the actual ./surface.js JSR export. Record it for S06. Do not retain a
misleading no-op and do not add public context injection, metadata/module IDs,
assertion stripping, nominal syntax or purity in B1.

## Discriminating product tests

Use a new `test/forms/surface-type-context.test.js` for black-box source/runtime
regressions. Import existing `lang/mod.js`/reader/expander/compiler interfaces
and private macroEnv via `lang/expander-core.js` where needed, so the same test
file can execute against M6's materialized mapping. Do not import a not-yet-
created module into the initial failing tests: a module-not-found failure is
not the registry regression. The production creator needs no mirror-only test.

- Establish a cold baseline for an unregistered uniquely named legacy case
  whose object property order makes positional and named-field extraction
  differ. Compile a separate declaration that registers its named field, then
  compile/run the baseline source again, without reset calls. Results must be
  equal. The oracle is isolation, not a permanent golden for legacy fallback.
- Repeat after a failing compile that first emits/registers the type, THEN
  reaches a later malformed surface form in Pass 2 (e.g. not with two args).
  An early reader/reserved-name/import/Pass-1 failure does not populate the
  old registry and would be a weak negative. Capture the pre-fix difference.
- In a product macro callback, compile an inner declaration of the same short
  case with a different field name between the outer declaration and outer
  match. Outer extraction returns its exact outer marker. Include successful
  and caught failed inner compilation. Restore only that callback's prior
  macroEnv entry in finally; do not reset shared macros or type state.
- Check public expandExpr isolation separately and verify a supplied binding
  Set remains unchanged and still gates a same-spelled macro. No Pass-0/Pass-1
  behavior is added to that API.
- Run the fresh-process cold-prelude control first/alone: a prelude-shaped
  object with an inserted decoy before value must select its named value field
  consistently without resetMacros. Record that this is intentional cold
  normalization; it emits no runtime Some/None/Ok/Err binding.

Run a difficult re-entrant case through the complete output/runtime path as
soon as coherent, then finish all scopes. Preserve useful original failing
attempts. Execute generated ESM with exact results/exit/stderr checks, not only
source inclusion or Map allocation assertions. Normal product JS orchestration
is authorized; new research probes remain Lykn-only.

Extend M6's actual strict public process to execute the new context test file
as well as all five existing embedded runtimes. Derive/report the actual test
and step denominators; do not infer them from names. Keep all nine byte checks.
Exercise normal browser compile-to-ESM state isolation through its existing
adapter/ESM consumer, preserving the eval-based run/load limitation. Existing
S02 recursive field/macro/completion/Reflect tests must remain green. This
checkpoint does not repair or claim new general builtin-guard parity.

## Gates, files and handoff

After focused regressions and cold M6 pass, run `make check` (docs once) and
`make bundle-size-check` (80 KiB); commit the actual source candidate, then
committed-HEAD `make check-cited-paths`. Do not auto-approve snapshots, weaken
oracles or reformat legacy files wholesale. Preserve warnings, failures and
unrun conditions. Do not remove/consolidate old receipts based on file count.

Expected source paths: canonical and embedded expander-core.js, classifier.js,
surface-helpers.js, surface.js, new surface-type-context.js;
crates/lykn-cli/tests/macro_dependencies.rs; new surface-type-context.test.js;
existing embedded-adt-pattern.test.js and browser-host-reference-compile.test.js
if needed for their direct oracles. Direct metadata-helper test callers may
need scoped signature migration; enumerate actual names before staging.
The Not pilot remains unchanged. No unrelated cleanup or new public exports.

Use exact named `git commit --only` paths and adjacent Codex/Billo AI trailers
in one body; verify actual %B, source pin/tree and clean state. Root owns
planning staging/commits. Append B1 checkpoint/API/migration notes to
closing-report.md; useful new receipts go under artifacts/increment-b1/.
Leave original A evidence, CDC/ledger and parent files unchanged. Return
source/build ownership for separate Sol verification. B1 CC success closes
neither LC-02 nor S03 and grants no next implementation authority.
