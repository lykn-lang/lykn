# CC correction01 — physical identifier reservation across native producers

Issued2026-11-14 after final separate source-readiness PASS and committed issue.
Same Luna6 High CC / separate Sol6.1 High CDC, Autonomous Mode. First refinement,
1/5 on dispatch. Root owns consequential design/planning/index/status.

## Immutable input, finding and preserved scope

Start clean taskfa6562a13ffc1069c06bb98d81cc4561fee68e12,
tree71c65689be1c8e3dbc2638aa5a7d60cee89944a0, parentc0ed4546, existing
`/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`, branch
codex/qualified-adt-core. Separate planning worktree remains canonical; release
staysc60. Preserve the initial commit/prompt/partial close and all failed attempts.

Actual attempt11 proves the root/source-readiness design omission: emitted
await__gensym0.child reads a JS root hidden from the original whole/colon set,
so the helper captures its own initializer and throws TDZ. This is not intended
behavior. Source inspection shows the same incomplete extraction at ICU, host
alias/helper and completion collectors; those are source-grounded risks, not
claimed runtime findings until the new controls actually execute.

The revised slice-plan.md v1.1 D is the binding recipe. The useful capability
and ALL8 NH criteria are unchanged. Original seven source paths remain, and
ONLY three additional paths are authorized: codegen/names.rs,
codegen/host_references.rs, codegen/host_invocation.rs under crates/lykn-lang/src.
Total delivery10 paths. Correction edits may touch those three, original
emitter/gensym.rs/forms.rs, two generated_name_hygiene test files and guide06
if needed. Keep original source_names visitor/canonical wiring intact unless
a concrete integration fix is required. No AST/resolver/DTS/protected policy/
JS/dependency/lock/M6 population or public source grammar change.

## Required reading and intake

Required-full: this prompt, current slice-plan.md, unchanged eight-row ledger,
source AGENTS.md, partial closing-report.md, existing intake, attempt11 full
native log and summary, current gensym.rs/source_names.rs and both new product
test files. Required-section: initial prompt helper/gate/commit/return rules;
plan D and A–C preserved contracts; complete actual codegen/names.rs production
allocator, normalizer, emit_atom/member-chain bodies; JsWriter new/write/finish;
complete host_references prepare/visitor/alias allocation and invocation prepare/
normalized_payload_names/anchor validation; forms.rs completion finalization,
reserve_emitted_names and its marker branch/local pattern callers; actual reader
lexer atom/default/delimiter code. Read pure-colon-call fixture at the CORRECT
test/fixtures/ordered-member-calls/pure-colon-call.lykn home, plus current
protected_host root/binder census ONLY to retain its separate API boundary.
Reuse unchanged existing producer/caller/guidance reads with explicit applicable
pins/extents; recover any missing material. Rust AP09/12/13, testing discipline/
Proportionate Proof, engineering-methods intake and correction-retention rules
remain binding. This is not another general investigation or parser project.

Append pre-edit intake/readback to the EXACT existing canonical file:
`/Users/oubiwann/lab/lykn/lang/.worktrees/planning/project03-language-evolution/arc05-binding-semantics-and-hygienic-emission/slice05-native-generated-name-hygiene/artifacts/cc/intake.md`.
Explain physical text versus source spellings, all five consumers, decoder
failure/normalization order, marker preservation and the S06/S07 limits before
edits. Root transfers exclusive source/build only on committed dispatch.

## Concrete repair

1. Add the crate-private shared helper specified in D. Use actual emit_atom
   through existing JsWriter to obtain physical text, preserving exact colon/
   dotted/private-member normalization. Retain old full/colon occupancy too.
   Do not simply split raw input on dots: normalization must precede extraction.
2. Conservatively collect every identifier-shaped run from physical text,
   including bracket-key variable reads. Treat ASCII alphanumeric/_/$ and
   non-ASCII non-whitespace as parts; whitespace and FEFF separate runs. Property/
   quoted/numeric extras may be occupied without becoming source bindings.
3. Decode static Unicode escapes BEFORE collecting runs, never renormalize
   decoded identifiers. Fixed-u4 code units and braced scalars use checked
   hex/range handling. Optional UTF16 decoding handles adjacent surrogate units;
   invalid/incomplete forms cannot panic or loop. Never index a UTF8 slice at an
   unchecked boundary. Ordinary no-escape names need no extra decoded buffer.
   Braced parsing stops incrementally on invalid nonhex input; never repeatedly
   find a closing brace over the whole remaining suffix before checking digits.
   This is conservative occupancy, not syntax validation or arbitrary eval.
4. Route ALL five actual consumers: EmitterGensym.reserve;
   GeneratedNameAllocator.reserve_expr Atom; host_references.prepare Atom;
   host_invocation.normalized_payload_names Atom; forms.reserve_emitted_names
   ordinary Atom. Preserve the completion-marker early return and marker-found
   boolean, all traversal, borrowed node identity, anchor maps, allocation order,
   checked suffix rules and support strategy. No context/global cache or AST copy.
5. Keep generated candidate comparison/insertion in that same physical key
   domain. Add emitted_identifier_key(raw_generated_name) using actual emit_atom
   and the shared decoder; EmitterGensym next/preferred use it but return the
   old raw candidate spelling. ICU GeneratedNameAllocator writes ALREADY emitted
   preferred/suffix text, so decode its key WITHOUT normalizing again. Preserve
   suffix order/failure/return APIs. ASCII host/completion keys are unchanged.
   Test literal occupancy→escaped candidate and escaped allocation→equivalent
   candidate in both generators. This is private candidate identity, not escaped
   source-binding/protected-root resolution.
6. Existing to_js_identifier cost is inherited. New decoding/scanning must avoid
   repeated suffix reconstruction; do not claim entire normalization is linear
   or refactor unrelated identifier rules here. Binder identity/protected-root
   selection remain separate and unchanged; no source spellings acquire aliases.

## Discriminating tests

Extend existing4native/2CLI groups, keep all original accepted-intent controls.
Plan D supplies concrete family inputs/values and opposing behavior. Required:

- Actual dotted await root from attempt11 runs8 both modes; computed-key early
  box[t__gensym0] with t0=99, box99=5/box7=100 runs12 rather than107.
- A static escaped ASCII physical root equivalent to await__gensym0 runs8;
  ensure Rust does not decode the intended source backslash first. Check actual
  post-normalization/private-member and escaped/scalar/code-unit helper inputs,
  malformed escape nonpanic boundaries, then actual generated runtime outcomes.
- Real late consumers: completion discarded typed parameter versus foreign
  completionValue__gensym0.child41; canonical/native ICU dotted and computed-key
  selector inputs; actual NumberIsNaN alias versus foreign dotted alias0.child41;
  actual invocation support versus foreign lyknHostReflectApply0.child41 using
  the real pure-colon-call shape. Verify the relevant helper/request actually
  exists before claiming its runtime case exercises that producer.
- Retain guards/effects/strip differences, original rest diagnostic text,
  data/schema/property/export roles, unit/fragment failure lifecycle and exact
  package names/signatures. Early corrected native JSON must execute through the
  actual JS kernel compiler; do not claim public ICU/naming producers are repaired
  by native changes. Escaped binder/host-root policy remains S07/LI-04, not fixed.

No spelling-only substitute for the actual producer/consumer behavior. Preserve
failed controls and report genuine source-contract mismatches instead of masking
SyntaxError or changing intended language semantics. Local mechanics are yours;
consequential behavior follows this explicit recipe and its independently
reviewed actual plan. Same eight criteria, no new framework or source API.

## Gates, commit and handback

After coherent source/oracle inspection, run format/Clippy preflight before the
expensive full gate and focused native+CLI --nocapture targets. Retain complete
new semantic logs under artifacts/cc/correction01, not overwritten attempt11.
No new general validator/evidence helper. Source/build ownership must remain
known: retain and print the FULL exec_command result/session_id for long jobs,
resume with write_stdin/wait as appropriate; never discard it by printing only
.output or launch overlapping retries. Capture numeric exit and complete streams.

Then make fresh-artifacts, ONE final make check/docs once with absolute existing
M6 capture env/directory set BEFORE execution. Inspect actual7paths/70/all14,
commands/config/status and profile/cache/warnings/skips. Earlier incomplete gates
are not waived. Commit the exact final ten-path delivery (new3files are existing
tracked files) using an exact message FILE with adjacent Codex/Billo AI trailers,
never amend initialfa/c0ed. Final-HEAD citations and fresh81920 size remain required.

Append correction01 all8 row proposals, exact actual execution/pins/counts,
inventory and bubble-up to the existing canonical slice-root closing-report.md.
Root owns planning Git/index/rows/retrospective and later-owner reconciliation;
separate Sol source-first independent review/fresh gates precede any acceptance.
Return clean/no jobs/source ownership and exact candidate pin. No S06 or release
integration follows. All earlier prompts/failures/partial source remain visible.

All helper/script/orchestration/validator/evidence-processing/JSON/command logic
must be Lykn, never Python/Ruby/Fennel/handwritten JS/Node/alternate scripting.
No Python execution or parity exception. Named Rust product tests/static runtime
clients and direct native shell/Git/simple file lifecycle remain allowed.
No new dependency/licence/publication/push/remote CI/library action.
