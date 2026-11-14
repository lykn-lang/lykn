# S06 CC intake

2026-11-14. CC: OpenAI gpt-6-luna/high. CDC: separate gpt-6.1-sol/high.
The dispatch authorizes source/build work on the named non-default task branch;
root retains planning Git/index/ledger ownership. No source edits preceded this
intake.

## Required reading coverage

The committed planning identity is `83d75e450b806f857f9beb980741d635f28cf755`
plus the current S06 open set. The source identity is clean
`82f1b65b92529979afd6c624183912ca31453927`, tree
`4bb6bfc9e171bc6424548b0f740dd32f0cf98c75`, branch
`codex/qualified-adt-core`; `git status --short --branch` was clean.

| Manifest item | Loaded extent |
| --- | --- |
| CC prompt | Entire `cc-prompt.md`, lines 1–262, including scope, producer recipes, 8 proof groups, gates and handoff. |
| Slice plan and ledger | Entire `slice-plan.md` (1–246) and `ledger.md` (1–15); all eight PN rows remain open. |
| Parent plan | Entire Arc05 `arc-plan.md` (1–388), including active S06 authority, boundaries, roadmap and history. |
| Source `AGENTS.md` | Entire file; repo/worktree ownership, source citation, Lykn-only research-helper rule, exact-path commit and dual trailers. |
| Root baseline and readiness | Entire baseline README and readiness report; all baseline `*.lykn`, `*.generated.txt`, `*.stdout`, `*.stderr` files read. They show the actual typed duplicate declaration, thread result 14, and ICU TDZ failure, with root's repaired oracles 7/106/5. These are inherited observations, not my reruns. |
| Framework / Autonomous Mode | Collaboration-framework route and Autonomous Mode contract; project-management README Autonomous Mode/existing-record routing; engineering-methods Autonomous Mode and CC intake. Scope ends at independently reviewed S06 close; role selection, separate CDC, source branch, root planning ownership, commits authorized, external actions not authorized. |
| Testing and language guidance | Testing discipline and validation gates (complete); JS/Deno module and test guidance plus anti-pattern IDs 07/12/14/16/35; Lykn `SKILL.md` Before Anything, bindings, functions, generators, threading; `docs/guides/06-functions-closures.md` ID-01/helper boundary, generators and threading. Rust guidance consulted for membership/count-only integration test edits. |
| Identifier and invocation source | Entire `identifier.js` (1–130), `host-invocation-kernel.js` (1–96), `host-invocation.js` (1–228), and `compiler-private-atoms.js` (1–48). The read covered identity anchors, WeakMaps, plan validation/consumption/finalization, AST identifier traversal, private markers, and existing identifier normalization. |
| Compiler | `compiler.js` module imports and `lowerHostReferences` (1–91), actual Atom emission/colon validation and `compileExpr` entry (1816–1895), ICU reservation/allocation/emission (195–340), closed carrier (1720–1815), and public compile/finalization (2296–2305). These sections establish original validation order, helper scopes and finalization calls. |
| Expander | `expander-core.js` exports and legacy counter (1–150), expansion environment and occurrence clone (720–890), emitted-name/private completion finalizer (1247–1288), helper objects/Match adapters and fragment entry (1831–1881), classifier dispatch and macro fixed point (2010–2150), and whole-unit Pass 2/import entry (2444–2550). Cross-references were followed to actual helpers, clone identity checks, macro output cloning, sibling sequence and host lowering. |
| Classifier and AST | `classifier.js` dispatch producers (493–812), full single/multi builders and signature guard (830–1225), genfunc (1277–1357), value/statement Match and reservation (1379–1575), yield recursion (1665–1700), and actual `surface-ast.js` constructors/fields (1–69). Existing tests confirmed helper defaults and direct callers. |
| Surface helper preservation | `surface-helpers.js` typed discard/rest helper functions (250–310), discard binding preparation (365–465), compiler pattern/private-atom sites (535–635); private identity sites at 267/279/556/611 were read with their containing functions. |
| Product tests and runtime consumers | Entire `icu-generated-names.test.js` (1–209), `lazy-protected-invocation.test.js` (1–309), `browser-host-reference-compile.test.js` (1–40); required `remaining-discard-bindings.test.js` direct signature/private boundary and JSON round-trip sections (390–475); entire `dd-37-classifier-pilot.test.js` (1–32); `reserved-binding-output.test.js` source, defaults, and completion-relevant sections (1–120, 245–310). Actual fixture conventions and `lang/`/`browser/` aliases are recorded. |
| M6 / build / import map | `macro_dependencies.rs` receipt helpers and complete M6 test (940–1165); `embedded.rs` materialization readiness/include path (25–55); Makefile fresh-artifacts, lint/format, check, and bundle-size targets (200–230, 294–374, 580–583); complete `project.json` (1–19). M6 retains its seven prior paths/70 cases/14 comparisons, uses materialized `lang/` and `browser/` aliases, and needs 78/15 after this slice. |

The initial broad source index command was visibly clipped; it was only a locator
query. No required text was inferred from it. All implementation-relevant
required sections above were recovered by bounded source reads. No required
input is missing or contradictory.

Recovery note: the pre-edit pass also loaded the complete classifier `emitSurfaceForm`
helper binding and opening switch (489–525), `reserveNodeNames` (1474–1494), all
three Match adapter definitions (1290–1375), the captured macro API values
(234–244), `resolveAutoGensym` (488–520), and Deno surface-macro registration
and macro-environment restoration (475–590). The embedded Rust include and
cache setup (1–24) was read before its readiness logic (25–55). These preserve
the legacy global gensym captured by macro environments and the existing
module-private macro scope; they do not add a new allocator to macro APIs.

## Contract readback

This is static generated-name protection, not source-binding renaming or macro
hygiene. The public whole-unit entry must seed one closure-owned physical-name
set from every owned form before the first emitter, then carry it through
Pass 0/Pass 2 imports, macro-result barriers, child environments, classifier
helpers and Match adapters. A one-form fragment and standalone ordinary-name
builders own only their supplied inputs. Existing global `gensym`/reset stays
observable, monotonically advances even on failed compilation, and receives an
exhaustion check; names are reserved in a separate per-entry allocator.

Physical occupancy must use the same normalized colon/private-member parts as
the compiler after the compiler's existing validation order, while decoding
static Unicode escapes for conservative source scanning and already-emitted
ESTree identifiers without normalizing emitted text twice. Allocation accepts
an already inserted candidate once, handles escaped-equivalent keys, and fails
on a repeated rejected raw callback rather than spinning. Strings, keywords,
literal values, metadata and opaque private markers are not executable name
inputs. Owned clones and WeakMap capabilities must remain intact.

The patch is limited to six canonical JS package files, their six tracked
byte-identical embedded mirrors copied before fresh builds, one new eight-group
public Deno product test, one Rust M6 membership/count change, and the existing
function/closure guide. Late completion, ICU and host invocation consumers must
share physical keys without altering protected-root selection, lazy
`patternNames`, exact invocation anchors, cleanup or helper enclosure. The
easily missed invalidation is a locally correct allocator that fails to reserve
a later sibling or generated/macro-exposed name before an earlier producer;
another is replacing identity-bearing nodes through generic cloning. Proof must
therefore use real Source expansion/compile/run, actual direct APIs, existing
private requests, and fresh materialized packages, not token checks or invented
IR. Raw compile retains its existing boundary and does not gain Source binding
resolution. The eight PN proposals remain open until independent CDC review;
green CC evidence is proposed-done only.

No Python or alternate helper-language execution is authorized. Research,
fixture generation, validation, orchestration and evidence logic remain Lykn;
named JS/Rust product tests and static runtime consumers are in-scope. No
dependency, release integration, push, publication, S07, or library work is
authorized.
