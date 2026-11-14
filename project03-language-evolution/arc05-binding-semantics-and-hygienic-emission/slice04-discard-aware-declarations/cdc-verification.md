# S04 independent CDC verification

## Source-readiness verdict — PASS — 2026-11-14

Separate reviewer context `/root/arc05_s04_cdc`, selected OpenAI
gpt-6.1-sol/high, reviewed the **unissued** S04 open set against task source
`codex/qualified-adt-core` at
`c60dea62d126bb07557a7f4f7183662dec3f6a58`, tree
`9c247edcf632ef2e038078a2833e727db949730d`. Read-only Git checks before and
after review show that task checkout clean at that pin. Root retains source,
build, planning Git/index and status ownership. This record is the reviewer's
only write: no product edit, Git mutation, build or test execution occurred.

The corrected draft is source-ready for the authorized four product paths and
eight DT criteria. This verdict permits committed issuance under the existing
authority; it does not accept implementation, reproduce the release gates,
close any DT/BS row or authorize S05, release integration or external action.

### Material correction resolved before issue

The initial marker recipe needed an explicit source representation boundary.
At this pin, `classifier/forms.rs:1080–1114` classifies default and re-export
forms as `SurfaceForm::KernelPassthrough`, rather than `SurfaceForm::Export`.
`classify_kernel_escape` at `46–73` strips an admitted `kernel:export` to a raw
`export` head. An implementation counting only `Export`/`Exports` could thus
mistake a handled empty bind export beside an unsupported default/re-export
for an empty interface.

Root revised plan C, the prompt spine, required reading and controls before
issue. I reread the complete revised open set. It now vetoes the empty marker
for a top-level passthrough raw list whose first `as_form_head()` is `export`,
preserves bound-call identity and tests unsupported exports alone and mixed
with handled empty binds. No descendant/string scan or unsupported API
implementation is commissioned. This resolves the material readiness finding.

The draft also now names `FuncClause`/`Constructor` in intake, gives a valid
two-pair zero-name grouped-bind specimen, and explicitly sets
`skipLibCheck:false` in the owned checker configuration. These clarifications
retain the four-file/eight-row boundary.

### Why the remaining recipe is coherent

- The declaration-local set reserves normalized meaningful Simple names before
  allocating synthetic labels in source order. It handles later named `arg0`,
  `arg2` and suffix candidates without changing runtime names, AST ownership or
  the existing general source-name policy. Every argument slot/type survives.
- Existing `TypedParam` flags and destructured element variants support the
  specified default/rest policy directly. Last-required-index rendering keeps
  a default before a required argument positional, allows the trailing suffix,
  and treats a rest tail separately. Required destructured arguments remain
  required. Explicit undefined for optional object/tuple defaults matches the
  strict/exactOptionalPropertyTypes consumer contract. Fixed overloads and the
  existing rejected simple multi-clause default/rest boundary remain intact.
- `binding_names_in_pattern(..., BindingKind::Bind)` supplies the actual source
  projection already used by native inline runtime exports. Shared private
  rendering can serve inline/named scalar/group/pattern entrances without
  assigning a whole initializer type to each destructured leaf. Selection before
  normalization and source/pair order preserve the source namespace contract.
- The handled-all-empty marker is deliberately narrower than output emptiness.
  It replaces a prior sidecar through the existing CLI write path and can follow
  retained local type declarations, while unsupported-only or mixed unsupported
  exports and ordinary empty non-module source retain their existing behavior.
- `emit_dts_module` takes a borrowed successful `AnalyzedUnit`; reader/resolver/
  classifier/analyze provide a real test route without exposing its registry or
  creating an alternate API. File compilation and package `emitDts:true` already
  call this emitter and write nonempty results. Existing TempDir/Command and
  package fixtures supply viable integration setup within the allowed test file.
- Real generated local DTS consumers, opposing argument/arity/export controls,
  one unguarded TS negative, exact runtime namespaces, 99-versus-7 witnesses and
  schema TypeError controls discriminate the promised behavior. String tests
  remain supplementary. The valid old-output semantic red is still required
  before production edits; no such execution is claimed by this review.

The generator/class/default/re-export/imported declaration omissions are
pre-existing unsupported native DTS routes, rather than a new loss of an
implemented interface. The bounded Func/Bind/BindGroup/Type repair is consistent
with BS-04's discard declaration carryover provided the close explicitly routes
those omissions to open Arc06 LI-04. This is not whole-language DTS/API parity.
Schema/property `_`, low-level literal-rendering helpers and runtime/compiler
behavior keep their separate roles. Later naming/S09/qualified/module/library/
research/reader/book/human/licence and release gates retain their owners.

### Actual reading and inspection extents

All source ranges below are from the task worktree at the pinned commit, not
from planning. Reads are text inspection; searches, Git facts and external
version checks are distinct from full-document reading. Clipped aggregate
outputs were recovered with bounded reads for the required relevant extents.

| Input | Loaded extent |
| --- | --- |
| S04 open set | Complete initial and complete revised `slice-plan.md`, `ledger.md`, `cc-prompt.md`, including all eight DT rows |
| Repository instructions | Complete task `AGENTS.md` |
| Native declarations | Complete `emitter/dts.rs:1–660`, including existing inline tests |
| Typed AST | `ast/surface.rs:1–115,125–190,248–307,420–480`: parameter variants/dependencies, clauses, constructors, binding/type/export/passthrough forms |
| Binding projection | `binding.rs:135–165,900–1005,1100–1255`: BindingKind, complete projection helper and its recursive grammar dependency |
| Native runtime export projection | `emitter/forms.rs:515–568,3210–3275`, including complete `direct_bind_export_names` |
| Classifier | `classifier/forms.rs:1–115,870–1167,1170–1300,1337–1438,2781–3335`: escape/strict/lax/export dispatch, exports errors, grouped-bind admission, complete typed/default/rest/object/array parsers |
| Classifier entry points | `classifier/mod.rs:1–180` through EOF |
| Head identity | `ast/sexpr.rs:380–417`, complete `as_form_head` contract/body |
| File compile/DTS | `compile.rs:214–290`, complete `compile_source_with_dts`; `main.rs:465–550`, output sidecar write branch |
| Package compile/DTS | `dist.rs:182–279`, complete `compile_lykn_sources` |
| Existing test patterns | Complete `compile_validation_parity.rs`; `emission_failures.rs:1–200`, including complete package fixture/helper prerequisites |
| Lykn reference | `skills/lykn/SKILL.md:36–84,172–230`: complete Before You Do Anything and Bindings & Mutation |
| Immediate guide context | Guide00 `15–190,498–524,811–866,1380–1429`: bind/type/export and data/discard boundaries; guide06 `1–67,1040–1125`: complete ID-01 and ID-30 |
| Prior accepted input | S03 release integration independent intake/ACCEPT/RI disposition sections `133–EOF`; complete S03 `cdc-retrospective.md` |
| Parent scope | Arc05 `arc-plan.md:75–165` and BS-04 row; complete Arc06 ledger and open LI-04 ownership |
| Existing gate recipes | Makefile `200–237,350–380`; named focused/full/final gates reconciled with the draft, no command executed |
| Collaboration guidance | Installed collaboration-framework entrypoint; complete project-management guides README; complete implementation-prompt-authoring guide; methodology role/shared/two-contributor `26–154` and Autonomous authorization/model/preflight `326–410` sections |
| Testing/verification guidance | Installed testing entrypoint, complete Testing Discipline, validation Gate Selection/Proportionate Proof/substrate/minimum gate sections `1–126`; independent-verification `1–140`, including correction retention |
| Rust guidance | Installed Rust entrypoint and complete AP-09/AP-12/AP-13 sections; applied no user-reachable panic, borrowed unit, existing projection and no ceremonial collect rules |

The checker-version concern was resolved from primary **v2.9.6** source, not
assumed from current-main documentation: [Deno's pinned configuration](https://github.com/denoland/deno/blob/v2.9.6/libs/resolver/deno_json.rs#L296-L334)
defaults `skipLibCheck` to false and permits an explicit setting; its getter
also defaults false at `797–812`. The pinned
[checker entry point](https://github.com/denoland/deno/blob/v2.9.6/cli/tsc/99_main_compiler.js#L92-L164)
collects semantic diagnostics. A newer native-tsgo caveat was investigated and
not promoted to a fact about this pin. These source checks establish a viable
method, not a local checker run or a produced semantic red.

### Readiness disposition

Source-grounded, design-complete, guideline-applied, executable, falsifiable and
coherent after the pre-issue correction above. No material readiness issue
remains. The initial assignment is still unissued at this review cutoff and
has spent zero implementation refinements. DT-01–08 and BS-04 stay open for
CC evidence and separate implementation verification; root alone owns their
eventual status/retrospective/bubble-up updates.
