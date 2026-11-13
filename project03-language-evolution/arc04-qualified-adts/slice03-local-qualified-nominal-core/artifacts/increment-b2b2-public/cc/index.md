# Iteration17 CC intake and implementation record

## Intake/readback before source edits and test commands

Issued prompt read in full: `cc-prompt-iteration17.md` (196 lines).
Linked recipe read in full: `artifacts/b2-public-icu-hygiene-recipe.md` (136 lines).
Separate public design-readiness read in full:
`artifacts/increment-b2b2-public/cdc/readiness.md` (178 lines).
Native16 independent acceptance read in full:
`artifacts/increment-b2b2/cdc/README.md` (143 lines).
Native16 CC index read for previous attempts/gates: 49 lines at
`artifacts/increment-b2b2/cc/index.md`. The source-tree `AGENTS.md` was
read in full (186 lines) from the assigned source worktree, not the planning
worktree.

Planning readback: `slice-plan.md` B2b/name-policy boundary lines 358–374 and
current B2-ICU-N/B2-ICU-P rows at ledger lines 14–17; iteration17 history and
open-scope recap at slice-plan lines 578–624. Original retained public/native
capture baseline read from `artifacts/increment-b2b2/cdc/fixtures/
canonical-matrix.lykn` and `canonical-matrix.expected.txt`. Native acceptance
states exact pin 228e8c99707e5dc4ee86a50e8aea532c9a99a80b,
tree 5a2c9a4ba836aaf6e34ef63c04f08b7f47621877, independent B2-ICU-N acceptance;
B2-ICU-P, ordinary source-name policy, typed-owner activation and LC02–08
remain open. B2-ID-NAME remains explicitly unresolved and outside this
generated ICU family repair.

Project guidance loaded: JavaScript/Deno skill entrypoint and
`guides/01-core-idioms.md`, `guides/06-functions-closures.md` ID-08,
`guides/09-anti-patterns.md` ID-12; Testing skill and
`guides/01-testing-discipline.md` plus `03-validation-gates.md`; repository
`skills/lykn/SKILL.md`. Applied guidance: invocation-local closure state;
the fix addresses generated-name shadow/TDZ capture, not removal of compiler
IIFEs; prove actual output/runtime and retain numeric exits, failures, skips and
test populations. No Python/Ruby/Fennel or handwritten JS research helper is
permitted.

Source/build intake: assigned source worktree
`/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`,
branch `codex/qualified-adt-core`, was clean at
228e8c99707e5dc4ee86a50e8aea532c9a99a80b/tree
5a2c9a4ba836aaf6e34ef63c04f08b7f47621877. Exact embedded compiler initially
compares byte-identical to `packages/lang/compiler.js`. No source files,
build outputs or tests were changed/run before this index.

Source-cited readback already completed: `packages/lang/compiler.js`
196–201 owns ambient ICU counter/reset; 201–299 validates and compiles keyword
values before fixed-name hoists; 301–439 recursively emits MFT/plural/select;
literal-only `template` dispatch at 1314–1353 calls `emitMft`; the sole
`compileExpr` implementation at 1743 onward emits ordinary ESTree and
normalizes atom/colon identifiers; final complete compile at 2220 onward
finalizes private host invocations before generation. `host-invocation.js`
1–98 exposes only the existing private request constructors and preserves
PROVISIONAL CallExpression identity through finalization. M6's
`macro_dependencies.rs` selects four public test files (lines 1124–1159),
contains14 byte comparisons, captures inner receipts through
`LYKN_MACRO_DEPENDENCIES_EVIDENCE_DIR`, and currently asserts49 cases.
`project.json` maps `lang/` and `browser/` to materialized/staged packages.
The mapped test contract in iteration17 supersedes old recipe wording:
create new six-group `test/forms/icu-generated-names.test.js`, keep existing
`template-icu.test.js` unchanged.

No concrete design contradiction is observed. Planned allocator is private,
owned per `templateIcu`, reserves actual compiled kwarg ESTree Identifier
names without mutation/replacement, and shares one occupied-name set between
hoists and selectors across recursive branches. Public/embedded compiler
remain exact copies. Preserve AST anchors, map order, compile counts,
evaluation/error/IIFE boundaries and current native/public distinctions.
Implement only iteration17's five authorized source paths; no new API/runtime/
dependency, no native production edits, no source-name/owner policy, release or
remote action.

Before any source edit or test invocation, remaining assigned source inventory
is still pending and will be appended here: detailed module/test/runtime
adapter and M6 receipt-path inspection, plus full caller census for every
changed helper. This index deliberately records the real intake chronology and
does not imply those later checks have already happened.

### Intake completion — actual source/test/caller inventory, still pre-edit

Completed the required read-only inventory after creating this index and before
source edits or test commands. Whole helper-caller census from
`packages/lang/compiler.js` finds one `templateIcu` call (kernel template
dispatch at1353); `emitMft` is called at template body280, its plural/select
node cases323/327, recursive branch emitters362/374/383/418/425, and the
literal-only dispatcher1338; `emitPluralIife` and `emitSelectIife` are called
only by `emitMft`. Thus allocator state can be threaded through the complete
recursive family and literal-only path without changing other compiler routes.

Read `packages/lang/mod.js` and `packages/browser/compiler.js`: public
`lykn`/browser `compileLykn` each perform read→expand→compile and accept only
`strict`; package compiler `compileExpr` returns AST and exported `compile`
generates complete ESM after private invocation finalization. No stripped option
or new writer is to be added. Read `host-invocation.js` lines1–125: request
anchors are original nodes validated in the input tree; requested calls become
ordinary CallExpression nodes keyed in private PROVISIONAL WeakMap; finalization
walks the generated program, preserves object identity and selects its helper
name after seeing emitted Identifier names. Therefore the proposed scan must
only read AST fields and must not clone or mutate objects.

Read existing `test/forms/template-icu.test.js` (raw reader→kernel writer helper
and its current assertions), `test/forms/lazy-protected-invocation.test.js`
(the exact existing request/anchor discovery shape and module-Reflect fallback),
and `test/expander/lexical-regions.test.js` (mapped aliases and runtime ESM
helper). Read `project.json`: aliases resolve lang/browser to staged
`target/lykn/build`; M6 overrides lang to its materialized package and browser
to fresh staged browser. Existing test file and browser host test remain
unchanged regression inputs. Read native cross-compiler test helpers in
`crates/lykn-lang/tests/icu_cross_compiler_tests.rs`; they compare actual
runtime results but have optional Deno skip behavior, so new cases must be
executed under the required environment and report selection/status honestly.
The embedded product compiler is byte-identical to canonical at intake.

Read `crates/lykn-cli/tests/macro_dependencies.rs` M6 receipt writers and
public selector/assertion. It requires precreated absolute
`LYKN_MACRO_DEPENDENCIES_EVIDENCE_DIR`, writes one comparison record per each
of14 materialized modules, sets a separate owned XDG for its copied CLI, writes
strict public config/command/output/status, runs four mapped test files and
asserts49. This assignment adds precisely the new test file and six real
top-level groups, so the actual materialized population must become55; no
receipt/count result exists yet. Existing native16 accepted source/test paths
and evidence are read-only. This completes the intake; no contradiction or
unresolved required source route remains.

### Chronology correction — original test and evidence setup attempts

The first focused invocation ran the six authored tests with an empty inherited
`DENO_DIR` explicitly passed as empty. It exited1 before test selection because
`@std/assert` was unavailable under `--cached-only`. `deno info` identified
the existing cache at `/Users/oubiwann/Library/Caches/deno`; the retry set that
existing path explicitly and made no fetch. Preserve the first streams/status
under `raw/baseline-public/`, the cache retry under
`raw/baseline-public-cache/`. The first selected six-test run exposed product
baseline `ReferenceError: Cannot access '_n' before initialization` plus two
test-authoring issues: duplicate source `_v0` declaration and an incorrect
expectation that repeated branch-only work remained lazy. Both were corrected
without changing the contract. The corrected old-compiler baseline is
`raw/baseline-public-corrected/`: 1 pass,5 fail; actual _n, _v0 and _x
initialization captures, plus the incorrect new AST-name assertion. Later
focused authoring retry recorded a missing _n fixture binding; it was corrected
before six-group green. All these raw receipts are retained and are not
reclassified as additional product findings.

Evidence-location correction: the first relative raw receipt writes were made
from the source worktree, so the original receipt tree at
`/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/artifacts/increment-b2b2-public/cc/raw/`
was moved byte-for-byte into this canonical planning location:
`/Users/oubiwann/lab/lykn/lang/.worktrees/planning/project03-language-evolution/arc04-qualified-adts/slice03-local-qualified-nominal-core/artifacts/increment-b2b2-public/cc/raw/`.
The saved command/environment/stream/status bytes were not rewritten; command
redirection arguments accurately describe their original source-relative
execution. All50 files were moved; only the empty mistaken source directories
were removed. The canonical index above was created before those attempts.
Every remaining receipt is written using an absolute planning evidence-home
path.

First full `make check` attempt is retained under `raw/full-check-m6/`, status2.
It passed dependency check, citations at the pre-commit HEAD and release/dev
build + clippy, then failed rustfmt on one layout line in the new cross-test.
No product/full tests or M6 subcommand ran and therefore no M6 comparison
receipts were emitted. The one Rust test file was formatted with
`rustfmt --edition 2024`; the entire 28-test ICU cross-compiler suite then
passed. A corrected full gate is still required. No conclusion is drawn from
the pre-test failure about the final gate or cold materialized population.

## Final CC checkpoint — proposed B2-ICU-P only

Implementation was committed to the assigned source worktree at
`57c76c99cbed07ff992e78aac8afefa4bdf0b2ad`, tree
`f044d795e88c3dac8e84a73a557cf071edd5327c`. Branch remains
`codex/qualified-adt-core`; final porcelain is clean. Commit contains exactly
the five iteration17 paths listed in the issued prompt:
`packages/lang/compiler.js`, its byte-identical embedded copy,
`test/forms/icu-generated-names.test.js`,
`crates/lykn-lang/tests/icu_cross_compiler_tests.rs`, and
`crates/lykn-cli/tests/macro_dependencies.rs`. Commit message was checked
with `git interpret-trailers --parse` before and after commit; literal
contiguous trailers are Codex and Billo AI. No source-name policy, native
production, public interface/runtime helper, dependency, release, remote, or
planning ledger changed.

The compiler now scans each validated template's compiled kwarg ESTree
read-only, reserves ordinary Identifier names, and creates one local
allocator with checked suffix and selector cursors. All hoists and plural/
select identifiers share that occupied set through every recursive MFT branch
and literal-only dispatch. AST references are not replaced or cloned, so
private PROVISIONAL host-call identity survives into existing finalization.
Map order, compile count, IIFE placement and evaluation boundaries remain.
Tests observe actual source-generated ESM for `_n`, `_v0`, normalized
`_n!`, colon root, occupied suffix, a-b/aB, selector/hoist overlap, nested
templates, once-only effects, original exception, lazy once-reference and
eager repeated branch-only evaluation. Fragment AST shape plus whole-source
runtime recovery are distinct checks. Browser compiled ESM executes from the
browser adapter. Trusted raw private API uses the actual original saved-call
node in PROVISIONAL, with both normal Reflect helper and module-Reflect inline
fallback; outputs are14 14 and[10]. Native/public cross tests assert pure
runtime values only; no effect-count equality is claimed for their known
colon/triviality difference.

### Actual validation

- Canonical focused public six-group test: `raw/focused-public-03/` passed
  6/6; the raw baseline before the allocator was5 failed/1 pass, with actual
  `_n`, `_v0`, and `_x` TDZ captures. First empty-cache selection failure,
  authored duplicate-`_v0`/eager-oracle corrections, and missing exception
  fixture binding remain retained in their separately named directories.
- Existing kernel ICU regression + new public file:
  `raw/focused-js-icu-01/` passed53/53. Native/public selected parity:
  `raw/focused-cross-icu-all/` and its post-format rerun
  `raw/focused-cross-after-format/` each passed28/28. The focused parity
  includes `_n`, plural/select `_v0`, shared selector/hoist7 7 and nested
  template cases.
- One corrected full `make check` at final source contents passed:
  1199 Rust library tests,1563 product tests/67 steps,482 documentation blocks.
  The test harness reports15 intentionally skipped documentation/examples.
  Original full attempt status2 is preserved and explicitly pre-test: the
  formatter caught one new Rust test line; after formatting that exact test
  file, all28 ICU cross tests passed and the corrected full passed. No test
  failure is hidden by that retry.
- The successful full run's real M6 receipt home is
  `raw/full-check-m6-corrected/`: 14 named module comparisons each report
  canonical=embedded=materialized, including compiler.js; actual copied CLI
  receives an isolated fresh XDG child directory and runs outside the repo
  package tree. The materialized strict Deno selector explicitly runs the
  existing four files plus `icu-generated-names.test.js`, and captured
  stdout is `55 passed | 0 failed` (derived5+6+17+21+6), status0. Its
  config maps `lang/` to that run's temporary materialized embedded package
  and `browser/` to the freshly staged `target/lykn/build/browser/`, so
  the actual browser test ran against staged delivery. The existing DENO_DIR
  is reused; cold scope is the owned isolated XDG/copy-cli and materialized
  package, not a claim that every workspace/cache is absent.
- Post-commit `make check-cited-paths` passed at the committed HEAD:
  64 current documents and601 historical census citations.
- Fresh post-commit `make bundle-size-check` passed the80KiB gzip budget:
  raw363450, minified173685, gzip46857 bytes; historical gzip baseline27630,
  delta+19227, remaining headroom35063. This emits Deno's existing pinned
  esbuild download notice and astring package-condition warnings; the check
  used the existing toolchain/cache and made no manifest/lock/dependency
  change. It was not wholly offline. Full command/environment/raw streams,
  exit numbers, M6 outputs/config/status and all14 comparisons are preserved
  in `raw/`.

The successful full run occurred after all source/test edits and before the
commit; no source bytes changed between that gate and the committed tree.
The first full attempt, initial empty-DENO_DIR miss, fixture corrections, and
path relocation are chronology, not acceptance failures. The source-relative
receipt tree was byte-moved as described above; after relocation all later
outputs used this canonical planning evidence path.

Disposition is **CC proposed-done for B2-ICU-P only**, pending separate Sol
software review. It is not B2-ICU-P acceptance, a decision on B2-ID-NAME or
source-name identity, OwnerRef/CaseRef/typed-owner/nominal activation, purity,
LC02–08, or S03 closure. Source/build handback is clean at the exact pin/tree
above. No task process remains active.

### Append-only policy correction

Correction to the earlier intake and final checkpoint wording: the operator
explicitly resolved B2-ID-NAME on 2026-11-13: distinct Lykn source spellings
identify distinct bindings. The language policy is resolved; implementation of
that broader source-name identity remains open and outside iteration17. Earlier
statements that the policy itself remained unresolved are preserved as the
actual earlier chronology, not rewritten. This correction does not alter the
B2-ICU-P acceptance or any source/test evidence. The original CC index SHA
390914710182cd18e7edbeef94de2e82639746c62cdc9b4a6f8cb7064a3e6bc4 was recorded
before this append and is retained in root review intake.
