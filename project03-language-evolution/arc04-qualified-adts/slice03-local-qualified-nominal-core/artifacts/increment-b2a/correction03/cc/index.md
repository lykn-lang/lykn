# B2a correction03 CC intake and source-cited readback

## Authority, source pin and evidence home

Issued assignment: `cc-prompt-iteration12.md` (read all 1–188 lines through EOF); implementation scope is B2a correction03 only. Root owns planning Git/index/ledger/status; CC owns source/build until clean commit handoff; separate Sol6.1High owns subsequent independent review. No B2b/name-policy, OwnerRef/CaseRef, nominal, purity, LC closure, release or external action is authorized. No Python/Ruby/Fennel/handwritten JS research helper is permitted.

Source worktree: `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`, branch `codex/qualified-adt-core`; exact initial HEAD `595f672b9991896754ba62a05c7c647dfaaeaa01`, tree `dd518b1bf339aac75e25a8459c67804f0559de72`; initial source status was clean. Correction03 evidence home is this absolute directory; no evidence or source changes have yet been written outside this home. There is no separate file named `manifest` in the owning slice; the issued iteration12 prompt supplies the path, scope and evidence contract.

All runtime/cache/temp roots were created before any product invocation at `/private/tmp/lykn-b2a-correction03-cc/{xdg,npm,tmp}`. Every product/build/test invocation will receive all four environment values: `XDG_CACHE_HOME=/private/tmp/lykn-b2a-correction03-cc/xdg`, `NPM_CONFIG_CACHE=/private/tmp/lykn-b2a-correction03-cc/npm`, `TMPDIR=/private/tmp/lykn-b2a-correction03-cc/tmp`, `DENO_DIR=/Users/oubiwann/Library/Caches/deno`. These owned runtime caches remain outside repository/config ancestors and outside this canonical evidence archive. Exact cwd/command/environment/raw stdout/stderr/numeric status are captured contemporaneously for each attempt.

## Required intake read extents

- Issued correction03 prompt: all 1–188 lines, including full R05 contract, source scope, tests, M6, full Make, citation/size and prepared-trailer commit requirements.
- Owning slice plan: all 444 lines (v1.22); ledger: all 14 lines; source worktree `AGENTS.md`: all 186 lines; B2a lexical-region recipe: all 224 lines; correction02 independent HOLD/addendum: all 219 lines.
- Required prior recipe context: iteration10 R01–03, lines 62–131; iteration11 defect, tests and gate/return, lines 65–188.
- Closing report: root correction02 authorized scope clarifications, lines 330–437; CC correction02 result and root returned-candidate metadata/trailer reconciliation, lines 438–488. The latter confirms f39's bare author lines were not trailers and that root's empty follow-up 595f supplies the correct contiguous `Co-authored-by:` labels. Correction03 will inspect the exact parsed and literal trailers before committing; no amend/reset.
- Rust guidance: rust-guidelines entry/selection and `TD-01`–`TD-03` in `guides/05-type-design.md`, plus `EH-01` in `guides/03-error-handling.md`. JS guidance: javascript-deno-guidelines entry and owning Lykn `docs/guides/02-api-design.md` `ID-03`–`ID-04`. Testing guidance: testing component entry, complete `01-testing-discipline.md` and `03-validation-gates.md`. Ledger/evidence guidance: work-verification entry, ledger-discipline and evidence-strength guides, plus collaboration-framework posture/process-rigour guidance. Owning `skills/lykn/SKILL.md` entry and Lykn testing-guide entry were consulted. Relevant contract application: named layout fields/typed absent-or-valid state, propagate the existing fallible classifier diagnostic, preserve backend error order, assert actual runtime and diagnostic behavior, report evidence as CC-attested/proposed-done pending Sol.

The first path-discovery command mistakenly addressed planning relative to the Lykn root rather than under `lang/.worktrees/planning`; its file lookup missed. The corrected absolute planning path was then used. This was read-only intake setup, no product process ran and no source/evidence was lost. Its tool output is retained in the conversation transcript rather than being represented as a contemporaneous raw test receipt.

## Source-cited contract readback

The causal R05 boundary is in native `crates/lykn-lang/src/classifier/forms.rs`: `classify_form` and dispatch are at 833–920; `classify_form_with_bindings` is 837–843 and its two structural/D2 callers in `binding.rs` at 798 and 803 currently swallow `Diagnostic` via `unwrap_or_default`; `classify_func`/clause parse at 1654–1808; `classify_genfunc`/clause parse at 1815–1968; `classify_genfn` at 1972–2014; typed `fn` and `lambda` paths at 2283–2335; typed parameter grammar at 2526–2700. These existing parsers select canonical last-wins keyword groups, parse parameter/default header shapes and retain executable body/default SExpr without macro evaluation or recursive classification. The ordinary classifier result preserves `Diagnostic.message` and `span`; `LyknError::Classify(Diagnostic)` is the existing outer error variant (`crates/lykn-lang/src/error.rs:4–14`). The thin preflight must call those exact source grammar paths with no binding capture and propagate their original diagnostic.

Actual phase ordering is public `lykn-cli/src/compile.rs` (`check_strict` expands before resolver/classification at lines 88–100; other compile/check routes at 150–172 and 230–245). Native Pass2 root dispatch is `crates/lykn-lang/src/expander/pass2.rs:53–157`: quote, lexical binding and supported diagnostics/desugaring/user-macro dispatch are settled at each chain step, and terminal `expand_dispatched` calls `expand_children_scoped`; `SourceFunction(Some(layout))` and `SourceFunction(None)` meet at `pass2.rs:299–316`. `resolver.rs:224–254` makes a source-function `ScopePlan` only after actual dispatch head and incoming scope checks, with `function_regions` allowed to be absent. Thus header preflight belongs at that actual terminal source-function boundary before defaults/pre/body/post; it must cover `None` layouts. A bound call, raw/lazy macro argument, quote/template datum or raw kernel function is not to be reclassified as a typed source function. Existing root macro priority, lazy arguments, one chain budget and error wrapping remain unchanged.

`lexical_regions.rs:122–197` currently computes shallow `source_function_regions` and `function_regions`; its typed-source body path starts immediately after params. Native region consumers are resolver plan/body/shadow paths, pass2 `expand_source_function`, and `binding.rs` `walk_source_function` / `walk_typed_function`; the full source-tree query `rg -n 'function_regions\\(|source_function_regions\\(' crates packages` found only `resolver.rs:251`, `binding.rs:407,525,585`, `pass2.rs:108`, and the two declarations in `lexical_regions.rs`. `ScopePlan::SourceFunction` construction and all matches are confined to resolver/pass2. This makes those actual consumers the integration seam; classification remains the authority for header validity.

Public `packages/lang/classifier.js:309–316` creates `GenFn(args[0], args)` after its existing shallow parameter-list check. `emitSurfaceForm`'s `GenFn` lowering at 781–817 selects yields metadata when args length is at least three and slot 1 is keyword `:yields`; it errors when that recognized shape has fewer than four args, consumes slot 2 as the payload, starts emitted body at index 3, and otherwise starts at index 1. Native `classify_genfn` parses params first, then recognizes that same threshold/marker/slot and applies its `genfn: :yields requires a type keyword and body` diagnostic. Public's current emitter checks the malformed yields-body count before typed param parsing; native's typed param parser precedes the yields-body diagnostic. Preserve this existing backend-specific diagnostic order and permissive non-keyword payload behavior. Factor a named shared descriptor in native `lexical_regions.rs` and public `function-clauses.js`, consumed by actual classifier/lowerer and projector. Projectors must safely return absent on invalid shape; they must skip `:yields` marker/payload and walk only actual body/default paths. Don't make an ignored payload a body, tighten annotation grammar, or walk ignored body metadata. Native/public D2 typed layout clients are `binding.rs`'s source/typed function walkers and public `binding.js`'s `walkSourceFunction`; public structural `bindingsIntroduced` remains distinct.

The complete occurrence query across crates/packages shows `function_regions`/`source_function_regions` uses only listed above; `classify_form_with_bindings` only at the two swallowed-error structural projection call sites; `ScopePlan::SourceFunction` only at resolver and Pass2. Public region layout is consumed through `binding.js` typed/source walkers and default/parameter paths. `function-clauses.js` owns canonical `FUNC_CLAUSE_KEYS`, `parseKeywordClauses` and `keywordGroupRanges`, so it is the authorized descriptor home; actual lowering is in `classifier.js`. The M6 module list in `macro_dependencies.rs:955–970` has 14 modules, including `classifier.js`, `function-clauses.js` and `lexical-regions.js`; its four materialized strict test inputs at 1017–1023 are embedded ADT pattern, surface type context, reserved binding output and lexical regions. Changed JS sources require exact embedded mirrors and fresh 14-module cold M6 plus a derived materialized case count with staged `target/lykn/build/browser/` adapter.

R05 must preflight all selected headers of a terminal typed-source function before any selected default/pre/body/post effect, using existing pure classifier grammar and preserving existing `Diagnostic` message/span; this includes invalid/missing layouts. Actual last-group-wins ignored duplicate metadata stays inert. Root lexical/macro dispatch has first priority. Multi-clause errors must occur before first-clause effects. The repair is not whole-unit classification, a new parameter validator, a macro phase, or early semantic type-owner validation. Raw kernel BindingPattern and class-member grammar remain at established classifier/writer boundaries; no broader header claim. The paired get-null macro fixtures in correction02 HOLD are the actual execution oracle, not unsupported throw fixtures. Valid default/body probe positives must still execute once. Genfn nonkeyword `:yields` data and the metadata marker are ignored structural slots; equivalent `:yields` with a keyword type remains existing typed metadata. A body declaration still receives strict D2 diagnostics while an ignored metadata declaration does not. The existing no-yields generator and missing-body error remain controls.

Prior R01–04 fixes, scope proofs, macro chains/laziness/count/limits, raw-return behavior, pass1 and D2 actual-site behavior, imports, class defaults, public occurrence ownership/private Reflect and host controls, match14 goldens, completion behavior and old baseline receipts remain preserved. No golden is to be weakened. Required gates are focused real diagnostics/runtime before full checks; then full fresh `make check` with docs once; cold-XDG M6 14 comparisons, copied CLI/browser ESM/private boundary and exact derived strict test count; post-commit HEAD citations and 80 KiB browser gzip. The source gate is a proposed-done artifact only; separate Sol must independently review it.

## Current state before first product invocation

No source edits or tests have been made in correction03. Initial source pin is verified clean. All mandatory input files and sections and the actual caller/layout census above were read before any source change. All test/runtime/cache invocations must set the four exact env paths stated above from their first call. Baseline receipts, focused receipts, full gates and post-commit gates will be stored under this canonical `receipts/` home; no cache trees are allowed here. The first substantive baseline failures, subsequent corrections and final receipts will be appended below without rewriting history.

## Held-source baseline attempts before source edits

The first baseline CLI receipt wrapper mistakenly quoted the shell status variable in its `printf`; those output streams remain in `receipts/baseline/`, but their status files contain the literal token and are explicitly not numeric evidence. All 18 cases were rerun with numeric status capture in `receipts/baseline-retry01/`. The numeric baseline release build used the held 595f source worktree and exited 0 (`receipts/baseline-build/`). No source edits preceded these baseline calls.

Native held-source `lykn compile` reproduces the substantive R05 ordering defects (exit 1 macro expansion/get-null before typed-header diagnostics) for the exact frozen HOLD `header-order.lykn`, `header-default-order.lykn`, `anonymous-header-order.lykn`, plus separate supported `fn`, `lambda`, `genfn`, and later malformed non-overlapping clause shapes. `header-valid-invocation-control` also gets the get-null expansion error, showing the probe is genuinely executable; `header-registration-control` gets the ordinary parameter-name diagnostic without executing it. The original macro fixture is byte-copied from correction02 CDC and verified with `cmp`; raw sources and per-command paths are in `fixtures/baseline/` and receipts.

Genfn held-source baseline: native `genfn-ignored-header.lykn` fails by executing a supported get-null probe in the ignored `:yields` payload; native/public `genfn-inert-binding-payload.lykn` fails strict binding on inert `eval`; corresponding legal-name controls compile exit 0. The exact R05 CDC public payload/control raw status and stderr remain in the immutable correction02 HOLD; correction03 additionally ran public canonical source through the retained Lykn `public-driver.lykn`, with absolute `lang/` map and all four owned environment paths. The new public baseline receipts show inert `eval` rejected and legal control accepted. Actual native and public ESM runtime controls for valid default macro result, ignored genfn metadata, inert legal-name payload, no metadata, and typed `:yields` each exit 0 and print41 (`receipts/baseline-runtime/`). These positives ensure the repair does not disable valid defaults, bodies, or generators.

Several fixture/capture attempts are retained, not overwritten. The public driver initially received an invalid raw-number macro result in `header-valid-default-probe.lykn`; native compiled it but public failed with `expandExpr: unexpected node type 'undefined'`. The corrected supported macro uses quasiquoted `41` in `header-valid-default-probe-quoted.lykn`, which compiles on native and public; actual ESM executes and prints41. The initial later-clause fixture gave both clauses arity1 and public correctly rejected their overlap before reaching the malformed second header; it remains preserved, and `header-later-clause-valid-overloads.lykn` now uses distinct arities while retaining a later malformed header. Public `header-default-order.lykn` independently reports its existing default-name diagnostic before a macro effect; `header-default-body-order.lykn` adds the body probe, and the public result is the ordinary `(default) second element must be a name` error (exit1). The public no-macro `header-registration-control.lykn` currently returns status0 and emits `function invalid(9)`; unlike native it has no current parameter-name diagnostic. This is retained as source-grounded public behavior; the issued pure adapter is crate-private/native, so no public header-validator policy is inferred here without root clarification.

A first public retry used the typo `arc04-qualified-adtss` in the task-specific evidence path and failed loading the import-map config (status1 before product code). Its complete raw streams/status were moved byte-preserving into canonical `receipts/baseline-retry02/public-*`; the mistaken empty hierarchy was removed. Corrected numeric public reruns are `receipts/baseline-retry03/public-*`. First baseline numeric status files are under `baseline-retry01`; the earlier literal-status records stay separate. All product commands after the first invocation set owned XDG/npm/TMPDIR and existing DENO_DIR as recorded per receipt. No cache was written in the evidence home.

No implementation edit has occurred yet. Baseline opportunities from the exact HOLD are now preserved with numeric exit status and actual runtime controls. The only unresolved scope question is whether the prescribed native typed-source diagnostic adapter requires any public header diagnostic changes; public genfn descriptor alignment and public D2 controls remain in the authorized source recipe regardless.
### Root-authorized public typed-name correction (before edits)

Root clarified the observed public baseline difference: the malformed typed
header `(func invalid :args (:number 9) :body 41)` was accepted and emitted
`function invalid(9)`, while the native compiler rejected it. Within R05, root
authorized the narrow fix in `packages/lang/surface-helpers.js` and its exact
embedded mirror: `parseTypedParams` must require the simple typed parameter
name node to be an atom and throw a normal parser error otherwise. This reuses
the existing parser path before body expansion across typed function families;
it does not add a second header validator or source phase. Existing default,
rest, and destructuring parsing/error wording remains untouched. This scope
decision is recorded before editing either file.

### Root/Sol parser clarification and first source-edit checkpoint

Root resolved the public-path question affirmatively: fix the existing
`parseTypedParams` simple-name branch only, with no second public validator.
Separate Sol read-only review confirmed this is the existing parser point
before typed lowering/body expansion, and noted that type constructor fields
also call `parseTypedParams` (`classifier.js:1561`). Thus the atom guard also
rejects malformed simple typed constructor field names; this follows the
same typed-name grammar and does not add a distinct phase or new syntax.
Existing default/rest/destructuring diagnostic branches remain unmodified.

After this clarification, the first implementation edits were made in the
owned source tree: native `lexical_regions.rs` now carries the named
`GenfnBodyLayout`; native `classify_genfn` consumes its selected body and
payload indexes; `pass2.rs` invokes the existing classifier with no binding
capture at `ScopePlan::SourceFunction` before walking any selected region,
including `None` layouts. Public `function-clauses.js` now carries the same
backend-local descriptor; public GenFn lowering and `lexical-regions.js`
consume it so the metadata slots are excluded from body walks. Public
`surface-helpers.js` rejects non-atom simple typed names before appending a
parameter record. All four public files were copied byte-for-byte to their
exact embedded mirrors. These edits are in progress and have not yet been
compiled or product-tested; the broken first attempted native classifier
closure was corrected after inspecting the resulting diff, before any build.

The added `genfnBodyLayout` export is a deep internal module seam in the
already M6-covered `function-clauses.js`; it is not a package/Jsr entrypoint.
Its concise JSDoc now states the args-relative record fields and `null`
meaning, and the embedded mirror was recopied after that documentation edit.

### Focused implementation outcomes and chronology

The first post-edit native compile check, `cargo check -p lykn-lang`, passed
(exit 0; exact command/environment/streams at
`receipts/focused-native-check01/`). Native focused test attempt 01 exited
101 only because its assertion incorrectly required the simple-name wording
for a malformed typed default; its raw stderr showed the existing parser
message `(default) expected :type name value`, and no get-null marker. The
assertion was corrected to preserve that existing diagnostic. Retry01 passed
six invalid typed-source header/probe cases and valid body macro runtime 41.
After adding explicit genfn metadata and body D2 controls, retry03 passed the
same header cases, valid body/default probes, inert `:yields` get-null payload,
inert nonkeyword `eval` metadata at runtime, and rejection of an actual body
`eval` binding. The superseded retry02 is retained. All exact command,
working-directory, owned environment, raw stdout/stderr and numeric status
files are adjacent in each receipt directory.

A first public test launch used a Deno `--filter` expression unsupported by
that invocation; status was 0 but it selected zero tests. It is preserved as
`receipts/focused-public-r05-01/`. The next full lexical module run initially
failed only because its expected rendering of an array was `41` rather than
Deno's actual `[ 41 ]`; the raw exit-1 output is preserved in
`receipts/focused-public-r05-02/`. The expected runtime text was corrected to
the observed array display. The subsequent canonical-source run passed 19/19
at that point; after adding constructor-field and default/body macro controls,
`receipts/focused-public-r05-retry02/` passed 20/20. All public runs used the
explicit absolute current `packages/lang/` map and fresh staged browser
adapter from `make fresh-artifacts`, with all owned environment paths. That
staging build passed exit 0 at `receipts/focused-fresh-artifacts01/`.

`cargo fmt --check` first identified only routine formatting in the newly
edited Rust source/test code (exit 1, preserved at
`receipts/focused-rustfmt01/`). `cargo fmt --all` then completed exit 0 at
`receipts/focused-rustfmt-retry01/`; it touched only the authorized modified
Rust files. M6's prior strict public denominator was 45; the current public
lexical module has three additional tests (invalid typed headers, valid
once-only default/body expansion, and inert GenFn metadata), so its test
assertion was derived as 48. The upcoming M6 raw summary is the authoritative
count check. One attempt to append this record used an incorrect `arc04-...`
path (missing the final `s`); shell reported path-not-found before writing.
No file/product command ran through that failed append. This note is appended
to the correct canonical evidence home.

### Full and cold-delivery gates

After focused green results, the single issued `make check` invocation completed
exit 0 (`receipts/full-make-check01/`). Its raw output reports 1,556 product
cases passed across 67 steps, 99 compiled Lykn test files, and 482 documentation
blocks passed (15 skipped); the repository emitted its `All checks passed`
marker. Rust unit/integration/doc tests all passed, including 1,195 unit cases
and the affected macro-dependency integration suite. The run rebuilt staged
`target/lykn/build/lang/`, `browser/`, and `testing/` outputs from the current
source. It used all four owned environment values in `environment.txt`.

Cold M6 retry01 passed exit 0 at `receipts/cold-m6-01/`. It compared all 14
canonical public modules to both embedded and materialized bytes, ran the
copied standalone CLI against the materialized compiler package, and executed
the four strict public test modules with the fresh staged browser adapter. The
raw strict result is `48 passed | 0 failed`; that establishes the derived
population rather than relying on the prior 45-case assertion. The test used
an empty owned XDG/compiler cache for the cold standalone run. The workspace
browser adapter was freshly staged by `make check`; “cold” applies to the
owned-XDG compiler delivery path, not to an absent workspace build. Full M6
command/cwd/environment and all per-module comparisons, copied CLI, runtime,
strict test, status and streams are in the receipt directory. No bundle/cache
was stored under canonical evidence.

### Source commit and post-commit gates

The source-only commit is `0e249cafb7d50ce45e00f7c7288249666fcc113f`, tree
`e946afc2283951fe11f2e9c7040a7f734dbf6d11`, on
`codex/qualified-adt-core`. Its exact 13-path inventory is:

- `crates/lykn-cli/tests/macro_dependencies.rs`
- `crates/lykn-lang/embedded/packages/lang/{classifier.js,function-clauses.js,lexical-regions.js,surface-helpers.js}`
- `crates/lykn-lang/src/classifier/forms.rs`
- `crates/lykn-lang/src/expander/pass2.rs`
- `crates/lykn-lang/src/lexical_regions.rs`
- `packages/lang/{classifier.js,function-clauses.js,lexical-regions.js,surface-helpers.js}`
- `test/expander/lexical-regions.test.js`

The exact message was prepared at `/private/tmp/lykn-b2a-correction03-cc/commit-message.txt` and checked with `git interpret-trailers --parse` before commit. The committed message was read back and the parser plus literal lines both confirmed contiguous `Co-authored-by: Codex <noreply@openai.com>` and `Co-authored-by: Billo AI <ai-engineering@billo.systems>` trailers. The commit was created with `git commit --only` over only the listed paths. Post-commit status was clean.

At committed HEAD, `make check-cited-paths` passed: 64 documents on this branch,
with 601 historical citations accepted by the existing census
(`receipts/postcommit-citations01/`). `make bundle-size-check` passed the
80 KiB gzip gate (`receipts/postcommit-bundle-size01/`): current gzip is
46,600 bytes, 35,220 bytes under the 81,920-byte limit; raw 361,569 and
minified 172,901. The script reports 27,630-byte baseline and +18,970-byte
current delta. Relative to correction02's measured 46,418 bytes, the current
bundle is +182 bytes, consistent with this increment's public parser guard and
shared GenFn descriptor. The script's raw stderr includes the normal esbuild
package-condition warnings and a cached npm registry fetch; no dependency or
repository source change was made by this measurement.

The classifier module re-exports the helper from `function-clauses.js` along
with its existing clause helpers; `genfnBodyLayout` is documented and used by
the public lowerer and lexical projector. The function is not a new package
entrypoint. Canonical and embedded copies compare byte-equal in M6. Include
this module export in the S06 audit input.

### Closing checkpoint and ownership handoff

Correction03 implements only the issued R05 typed-source header preflight,
shared GenFn metadata/body descriptor, and source regressions. Native header
validation uses the existing pure classifier with binding capture disabled,
only after root dispatch has selected the terminal form and before selected
regions expand; original diagnostics propagate as `LyknError::Classify`.
Public malformed simple typed names now fail in the existing typed-parameter
parser before parameter records are built. Both GenFn backends preserve their
existing error priority and slot permissiveness; `:yields` marker/payload no
longer leaks into expansion or D2 body regions. Raw kernel/class writer
formats and language owner/name policy were not changed.

Evidence limit: CC's own baseline and candidate runs support the retained R05
behavior, but independent Sol disposition remains required; no CDC/CRC
acceptance is claimed. The public compile-time error family retains its own
existing messages and is not asserted byte-identical to native diagnostics.
Cold M6's workspace browser adapter had been freshly staged by `make check`;
only its owned-XDG standalone compiler path was cold. Full and cold gates ran
before commit on the exact committed source tree; post-commit citation and
size gates ran at the committed HEAD. No release, push, dependencies or
external side effects were performed.

Source/build ownership is returned for separate Sol6.1High review. Exact
source HEAD/tree are the values stated above; current worktree status was clean.
B2-LX, B2b, LC-02–08 and S03 remain open under their separate gates.

## Root returned-candidate reconciliation

Root verified clean0e249cafb7d50ce45e00f7c7288249666fcc113f,
treee946afc2283951fe11f2e9c7040a7f734dbf6d11, exactly13 authorized paths and
actual contiguous Co-authored-by labels; no metadata follow-up is needed.
Root read raw full-check0 with1556 product/67steps and482 docs plus raw46600
gzip. Separate Sol now owns source/build for independent review; these remain
CC gate results, not independent acceptance.

Two numerical prose errors above remain historical: correction02's raw bundle
was46503 bytes (46418 was correction01), so correction03 is97 bytes larger
than its immediate predecessor, not182. Headroom to81920 is35320, not35220.
The original raw size gate itself is correct:46600,baseline27630,delta18970.
No measurement/source change or additional size investigation is required.
