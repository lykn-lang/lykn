# S04 CC intake and contract readback

2026-11-14. Implementer: Luna6 High, Autonomous Mode. This is the assigned
source checkout, not the release or planning worktree.

## Starting authority and state

- `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`,
  `codex/qualified-adt-core`, HEAD `c60dea62d126bb07557a7f4f7183662dec3f6a58`,
  tree `9c247edcf632ef2e038078a2833e727db949730d`; clean before this evidence
  file. This matches the pin in the assignment and the independently accepted
  release tree.
- Required-full reads: issued `cc-prompt.md` (all 140 lines); `slice-plan.md`
  (all 248 lines); `ledger.md` (all 14 lines); task `AGENTS.md` (all 186
  lines); `crates/lykn-lang/src/emitter/dts.rs` (all 660 lines, including all
  existing tests). These were read in bounded calls; an earlier combined
  display was clipped and recovered as separate reads. The eight DT rows remain
  open; no row is accepted by this intake.
- S03 evidence read: complete `artifacts/release-integration-c60dea62.md`,
  including RI-01–03 and separate Sol ACCEPT; `cdc-retrospective.md` Outcome
  and inspection (lines 1–28), observations and successful repairs (29–83),
  follow-through/recommendations (84–114). S03 is immutable same-tree context,
  not a substitute for S04 proof.
- Source guidance read from this task checkout: `skills/lykn/SKILL.md` complete
  Before You Do Anything (36–75) and Bindings & Mutation (172–239);
  `docs/guides/00-lykn-surface-forms.md` complete bind/export/function and
  type sections (78–285, 498–571); `docs/guides/06-functions-closures.md`
  ID-01 (14–52) and ID-30 (1040–1075). Surface source is pinned c60, not the
  planning checkout.
- Skills resolved from the installed catalog and loaded: rust-guidelines
  entrypoint plus complete AP-09/AP-12/AP-13 sections; testing entrypoint and
  complete Testing Discipline plus Validation Gates Proportionate Proof;
  engineering-methods entrypoint and Required reading/CC intake (guide07
  297–390); work-verification entrypoint, Evidence Strength and Independent
  Verification including correction-review rules. No skill was substituted.

## Source extents and observed contracts

- `ast/surface.rs`: complete definitions for `TypedParam`, `DestructuredField`,
  `ArrayParamElement`, `ParamShape`, their shape helpers, `FuncClause`,
  `Constructor`, `BindBinding`, and `SurfaceForm` variants Bind/BindGroup/Func/
  Type/Export/Exports (lines 1–75, 153–180, 205–218, 257–end; targeted ranges
  were read). `TypedParam` stores default and rest independently. Object fields
  distinguish typed simple leaves and nested aliases; array patterns distinguish
  typed entries, rest, skip holes, nested and aliased nested patterns. `FuncClause`
  owns its own args, return, contracts, body and span.
- `binding.rs`: complete `binding_names_in_pattern` implementation (944–948),
  plus its pattern-walker context (binding kinds and pattern dispatch read at
  85–140 and 220–290). This returns source `BindingSite`s and is the native
  binding projection, not a textual underscore filter.
- `emitter/forms.rs`: export dispatch around `Export` (520–558) and complete
  `direct_bind_export_names` helper (3234–3253). It projects each Bind name or
  each BindGroup pair through `binding_names_in_pattern(..., BindingKind::Bind)`
  in source order. This is the reusable authority for DTS exports.
- `classifier/forms.rs`: `classify_form_inner`, strict and kernel-only
  dispatch (843–1078); `classify_export` and `classify_exports` (1080–1112,
  1255–1284); `classify_kernel_escape` (46–70); complete typed parameter parser
  and object/array pattern parser extents (2781–3280). The parser represents
  defaults only in explicit `(default :type name value)` forms and rest only in
  final simple/array rest positions; object property labels are retained
  separately from bound aliases. Empty `exports` and `exports _` are errors.
  Unsupported export forms are `KernelPassthrough`; explicit `kernel:export`
  strips its prefix to raw `(export ...)`. Strict/lax dispatch both preserve
  those cases. Parser admission is fixed; this task changes declaration
  interpretation only.
- `ast/sexpr.rs`: complete `as_atom`/`atom_parts`/`as_form_head` contract
  (360–405). `as_form_head` is present only for unresolved atoms with no host
  reference; a resolved lexical call head must not count as syntax. A top-level
  passthrough export census must examine only the raw form head through this
  API, not descendant or string text.
- `compile.rs`: complete `compile_source_with_dts` (217–273). It reads,
  expands, resolves, validates, classifies, analyzes once, emits JS from that
  `AnalyzedUnit`, then calls `emit_dts_module`; empty declaration text maps to
  `None`. `main.rs` compile-file output branch (470–526) writes JS first and
  writes a `.d.ts` sidecar only when present. It does not delete an older sidecar;
  this is an observed CLI lifecycle boundary to account for in the allowed test,
  without adding production plumbing. `dist.rs` complete `compile_lykn_sources`
  (182–278) independently analyzes each Lykn source and calls the same
  `emit_dts_module` when package `emitDts` is enabled.
- Existing caller/test patterns: complete
  `crates/lykn-cli/tests/compile_validation_parity.rs` (231 lines), including
  `TempDir`, `Command`, actual CLI files, read-before-assert receipts and a
  runtime Deno command; complete `crates/lykn-cli/tests/emission_failures.rs`
  (598 lines), including package fixture (`emitDts:true`), `build_project`,
  `TempDir`/`Command`, runtime receipts and stale-output sentinel patterns.
  These define permissible fixtures only; neither is edited.
- Declaration emitter: full `dts.rs` read establishes the current behavior:
  simple params use normalized source names; destructured args use `arg{i}`;
  defaults/rest are ignored; object optional properties render with `?` but do
  not explicitly admit `undefined`; tuple skips are `unknown`; inline export
  supports only scalar Bind/Func/Type and ignores destructured Bind/BindGroup;
  named Exports supports scalar Bind/BindGroup and functions/types; empty output
  has no module marker. Low-level type and bind renderers are used beyond
  module-level projections and must remain compatible.
- Prior review evidence: S03 retrospective identifies the earlier false-positive
  pattern where a syntax diagnostic excerpt was mistaken for runtime rejection;
  the implemented tests must inspect actual tool exit/diagnostic class, and
  source-specific preparation must follow its actual producer. The S04 proof
  therefore needs actual generated declarations and actual Deno checking, not
  snapshots alone.

## Contract readback before dependent edits

The correction belongs solely in native `dts.rs`, one new CLI integration test,
then immediate factual teaching in guides00 and 06. For each `FuncClause`,
parameter positions/types remain positional while only `_` and anonymous
pattern parameters receive deterministic compiler labels. Reserve all normalized
meaningful simple labels before allocating `arg{i}`/suffixes; keep allocation
local to that clause, so a later named `arg0` cannot collide. Do not rename
`_value` or schema/object property keys. Required/default/rest optionality must
be computed from the last required input position: trailing defaults use `?`,
defaults before a later required argument admit explicit `undefined`, rest is
per-element typed, nested caller parameters remain required. Apply the same
rules recursively to tuple defaults/skips and object default fields, including
`undefined` under exact optional properties, without widening the fixed
multi-clause admission rule.

At module entrances, export only source-bound names obtained via the existing
binding walker; share Bind/BindGroup declaration logic for inline and named
exports. Destructured leaves are `unknown`, while scalar literal/type inference
stays as it is. The easy-to-miss empty-module rule is deliberately conservative:
`export {}` is valid only when explicit export forms exist and all are handled
inline Bind/BindGroup forms with no projected names. Default/re-export and
kernel-escaped raw exports are `KernelPassthrough` and veto this marker when the
raw unresolved head is `export`. Empty non-module source stays sidecar-free;
Type constructor `_` remains typed data. Preserve unsupported signature/raw
export vetoes, contracts, returns and warnings, bound call heads, runtime JS,
serialized schema/property roles, and existing low-level helper signatures.

Proof must start with a valid actual Deno type-check failure from the c60
compiler before production edits. Final evidence must then flow through an
actual successful `AnalyzedUnit`, normal and stripped CLI output, package
`emitDts:true`, generated local `.d.ts` TypeScript imports checked with strict,
exactOptionalPropertyTypes and skipLibCheck false (offline/no npm), actual runtime
outputs/namespace, and the repository's prescribed final gates. Rust unit/string
tests alone cannot prove declaration validity or the file/package consumer
routes. Root owns planning Git and ledger state; my report is proposed-done for
separate Sol, not acceptance.

No contradiction or unresolved contract choice was found during intake. No
product file has been edited yet.

## Location correction — 2026-11-14

The initial intake bytes were mistakenly created under the source checkout's
`artifacts/cc/`. Before running the baseline or editing product code, I moved
those bytes unchanged to the canonical planning location required by the slice
prompt: `/Users/oubiwann/lab/lykn/lang/.worktrees/planning/project03-language-evolution/arc05-binding-semantics-and-hygienic-emission/slice04-discard-aware-declarations/artifacts/cc/intake.md`.
This append preserves the original intake text and records the correction. No
other source artifact was moved; source `artifacts/cc/` is removed only if now
empty. Root owns planning Git/index and no planning index operation was done.

## Required c60 semantic red — before production edits

The first consumer attempt (preserved in `baseline-invalid-consumer-attempt/`)
used an `import type` binding as a runtime value and correctly produced an
additional TS1361; that invalid consumer is not counted as the semantic red.
The test was corrected to a type-only import, `typeof` type alias, and declared
call-signature variable, then rerun against unchanged c60 production code.

`baseline-red/cargo.status` is `0`: the focused Rust witness ran 1/1 and passed
its assertion that the actual checker rejects the generated declaration.
`baseline-red/generated.d.ts` is the compiler's real output:
`export function ignore(_: number, _: string): void;`. The saved
`baseline-red/consumer.ts` is valid TypeScript importing this local `.d.ts`;
`baseline-red/deno.json` has `strict:true`,
`exactOptionalPropertyTypes:true`, `skipLibCheck:false`. The actual offline Deno
command and stdout/stderr/status are preserved as
`baseline-red/deno-check.command`, `.stdout`, `.stderr`, `.status`; nested Deno
exit is 1 with exactly two TS2300 `Duplicate identifier '_'` errors and no
other diagnostic. CLI compile stdout/stderr/status and the complete cargo test
streams/status are also preserved. This is the required valid semantic red;
`baseline-red/test-source.rs` records the pre-production witness.

## CC execution evidence — 2026-11-14

Implementation changed exactly the four permitted product paths and committed
them on `codex/qualified-adt-core` as `918f2e9c4237770fc7b2e0e950d726e735e95198`
(tree `37b1cd6e7a457caf94933a35cdac54335c7afb66`, parent c60
authority `c60dea62d126bb07557a7f4f7183662dec3f6a58`). Final source status is
clean. The commit has both adjacent Codex and Billo AI trailers.

The pre-edit baseline red remains the valid unchanged-c60 case recorded above:
actual generated duplicate `_` parameter declaration, one Rust witness passed,
and offline Deno exited 1 with two TS2300 diagnostics. The invalid earlier TS1361
consumer remains a separately labeled failed attempt, not the red oracle.

Current focused receipts are under `artifacts/cc/focused/final08/`: native DTS
unit suite 32/32 passed (1,179 filtered from the library harness); CLI generated
DTS suite 4/4 passed. The Deno config used by those tests explicitly enables
`strict`, `exactOptionalPropertyTypes`, and `skipLibCheck:false`, with local
`.d.ts` imports and offline/no-npm options. Positive consumers cover discarded
positions, defaults, rest, tuple optional skips, object data, destructuring label
collisions, fixed overloads, exact export namespaces, package declarations and
typed constructor inputs. The unguarded wrong-type call exited 1 with TS2345.
Checked and stripped JS runtime outputs agree; a true discarded parameter with
foreign global `_ = 99` resolves to 99, while `_value` returns its supplied 7.
The constructor positive and invalid input produce the expected data and a real
`TypeError`. CLI and package declarations for identical source match byte for
byte. The overloaded test specimen emits two existing unused-binding warnings
for its intentionally unused named argument; those streams are retained.

`make fresh-artifacts` passed in `fresh-artifacts/final03/`. Final full `make
check` is status 0 in `gates/make-check-final03/`: 40 Cargo harness result rows,
1,786 Rust tests passed, zero failed or ignored; 99 `.lykn` product test inputs
compiled; the product suite passed 1,578 tests across 67 steps, zero failed;
documentation passed 482 tests, zero failed. Documentation accounting remains
separate: 15 annotation/fragment exclusions and 9 inputs with no Lykn blocks.
The M6 inner Deno 2.9.6 run used the recorded command/config and seven explicit
source test paths, with 70 passed and zero failed. All 14 delivery comparisons
report canonical equality to both embedded and materialized output. Five
compiler warnings from those probes remain in the captured M6 streams; no
source-level M6 code or counter changed.

Final-HEAD `make check-cited-paths` passed for 64 documents and 601 accepted
historical citations. Fresh `make bundle-size-check` passed against the 81,920
byte gzip limit: raw 379,173 bytes, minified 181,014 bytes, gzip 48,689 bytes.
That size command downloaded esbuild into the Deno cache and captured astring
package-condition warnings; it made no project dependency or lockfile change.

## CC correction01 intake and contract readback — 2026-11-14

### Assignment/source revalidation

Loaded the complete canonical correction prompt at
`.../slice04-discard-aware-declarations/cc-prompt-iteration01.md`. The active
assignment is Correction01, refinement 1/5, and permits only
`crates/lykn-cli/tests/discard_declarations.rs` on the task branch. Task HEAD is
`918f2e9c4237770fc7b2e0e950d726e735e95198`, tree
`37b1cd6e7a457caf94933a35cdac54335c7afb66`; `git status --short` was empty.
Release remains c60 and root owns planning index/status. Prior 918 independent
HOLD, all-eight row walk, first close and root location correction remain
retained; this record is appended, not substituted.

### Required reading delivered

- **Required-full:** correction01 prompt (complete, 70 lines); source
  `AGENTS.md` (complete); `slice-plan.md` (complete, 300 lines); `ledger.md`
  (complete, 14 lines); current `discard_declarations.rs` (complete, 817 lines);
  independent HOLD in `cdc-verification.md` (complete, 339 lines); original
  `cc-prompt.md` (complete, 140 lines); canonical `closing-report.md`
  (complete, 129 lines, including root's location notice).
- **Required-section:** plan A–D and row proof map; original prompt's helper,
  commit and return rules; closing report's handoff/retention limits; `dts.rs`
  `param_shape_to_ts`, `emit_func_args`, module Bind/BindGroup and helper paths
  (loaded complete in source ranges 1–205 and 270–470); relevant AST parameter
  definitions in `surface.rs` (complete relevant declarations in 1–115 and
  145–310); actual classifier BindGroup parser (`forms.rs` 1344–1390), full
  typed parameter parser (`2781–2955`), nested object parameter parser
  (`2964–3132`), array destructure parser and rest parser (`3132–3341`);
  nested parameter emitter (`emitter/forms.rs` 3710–3945) and
  `emit_alias_pattern` (`codegen/emit.rs` 1360–1425). The latter establishes
  `items` as an object property alias, not a leaf binding; the nested function
  body must use `_`, `label`, `total`, and `tail` only.
- **Required guidance:** testing skill entrypoint; complete Testing Discipline
  and Validation Gates guides, including Proportionate Proof and preservation
  of actual failures; Engineering Methods required-reading/CC-intake contract
  (guide 07, lines 240–445); Rust Guidelines skill entrypoint and complete
  AP-09, AP-12 and AP-13 extents; work-verification Independent Verification
  `Evidence During Correction Review`; project-management canonical worktree
  `Existing records and supporting evidence` section. These direct the test to
  prove public producer behavior, not implementation details; retain the 918
  red/HOLD and other attempts; separate new candidate evidence from retained
  applicable evidence and never relabel prior receipts as fresh.
- **Prior boundary-applicability:** loaded the complete source-readiness and
  boundary-applicability discussion in `cdc-verification.md`; required-after-
  destructure CLI prevalidation remains a separately attributed inherited
  finding and is not repaired or used as a specimen here.

One initial combined guidance read exceeded available output and was discarded;
all named required extents above were recovered in bounded reads before edits.
No unresolved required material remains. No structured Required-data query was
assigned in this correction.

### Contract readback before edits

The independent 918 HOLD did not demonstrate a production defect: it identified
missing behavioral proofs. DT/BS obligations remain open; CC adds tests only.
For R01, the existing export group must exercise actual multi-pair inline and
named BindGroups. Typed scalar pairs prove their inferred TypeScript types;
untyped destructured leaves remain `unknown`. Exact public namespace keys and
runtime values must prove that inline groups project every legal binding and
named groups select only the requested bindings, excluding discards and
unselected pairs. Preserve existing scalar, pattern, empty-sidecar, veto,
reexport and schema controls.

For R02, one valid exported function must exercise the actual nested
Object→Array→Object path, optional defaulted `_` object field, default-before-
required tuple slot and typed rest through generated DTS, strict/exact optional
TypeScript inputs, checked/stripped compile, runtime and package equality. Its
body references `_`, `label`, `total`, and `tail`; `items` is only the source
property key. Runtime with foreign `_ = 99` distinguishes discarded values
from captured locals, and caller arrays are measured before/after. Positive
opposing provided-value cases plus wrong nested `_`, missing required label
and wrong rest type must establish both acceptance and rejection at the actual
consumer. Keep to the existing four test groups and shared test flows. If a new
valid specimen shows an emitter defect, preserve its red evidence and return to
root; no implementation edits are authorized in this refinement.

The test path must run against fresh generated artifacts before consumers,
then focused CLI tests, one final `make check`/docs run, actual M6/all14
comparisons, and final-HEAD cited-path and fresh bundle-size gates. Preserve
complete command streams, exact status, warning/profile/cache/skip facts and
historical attempts. Commit only this named test file with adjacent trailers;
return exact pin/tree, clean/no jobs and all eight row proposals. Root alone
maintains planning Git/index/row status. Independent Sol review and acceptance
remain separate; no S05, merge, push, publication or release movement.

Receipt correction (2026-11-14): the correction01 prompt is 144 lines, not 70.
It was loaded completely in the initial full read and then recovered in explicit
contiguous ranges 1–75 and 76–155 after root's count check; no omitted prompt
text remains. The earlier line-count shorthand in this intake was mistaken.
