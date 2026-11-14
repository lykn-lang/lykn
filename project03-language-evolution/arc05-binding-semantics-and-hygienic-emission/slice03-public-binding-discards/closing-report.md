# S03 CC implementation handoff

Date: 2026-11-14

## Source delivery

- Branch: `codex/qualified-adt-core`
- Parent: `9e6fb1270c3efcbaa0f6ddb9f0fbfd3b2c1c825a`
- Implementation commit: `df39449034e3e8530927b0df8129049833af5f5f`
- Coverage correction: `85ddca6325012f12f72f18bcc2530669709e5216`
- Final tree: `eed763256aada46c8bc5e7a848be09c7a1f7f19c`
- Source worktree is clean; the commit contains exactly the fourteen product paths authorized by `slice-plan.md`, with contiguous Codex and Billo AI coauthor trailers.

Implementation prepares source discard targets at public expansion roles, after explicit kernel whitelist admission or after lexical/macro resolution, while preserving raw compiler writer behavior. It carries catch's legacy expression grammar, spread binding projections, grouped static alias key normalization, and early multi-clause signature checks. Direct one-clause builder inputs delegate to single-clause behavior. Five embedded modules are byte-identical mirrors. The eight new Deno groups cover the public behavior and delivery cases; factual changes update surface and function guides.

## CC evidence and proposed row disposition

The canonical intake, baseline red, and M6 receipts are under `artifacts/cc/`. PB-01 through PB-07 have implementation evidence and are proposed for independent acceptance. PB-08 is proposed with the documentation-command caveat below; PB-09 remains open for independent closeout and root reconciliation. These are CC attestations, not acceptance or ledger closure.

| Row | CC evidence / limit |
| --- | --- |
| PB-01 | New group 1: declaration and loop forms, foreign `_` and `_value`, initializer effect, iterator result `value` getter 0 versus 2, early break `next=1/return=1`, for-in, numeric-for, and async for-await-of. |
| PB-02 | New group 2: named and anonymous generator, named function, arrow, async function/arrow, typed lambda, class and class-expr constructor/method/get/set/static/async wrappers and object callable; arity, foreign lookup, lazy defaults and thrown default; generator default at call and body on `.next()`. |
| PB-03 | New group 3: scalar, array/object value consumption and shorthand, pair/computed/alias-named properties, default/rest/spread array operands, finally selection, direct return; body `_` observes foreign 99. Existing S01 suite retains nested reserved-name rejection. |
| PB-04 | New group 4 and existing discard/private tests: named spread resolution, form-name shadow, reserved-name rejection, defaults/body lookup, JSON/failure reuse/private marker behavior. Existing whole/fragment tests retain private lifecycle controls. |
| PB-05 | New group 5 and existing discard tests: zero-name/all-discard/empty-list groups, getter/default effects, Atom/Keyword/String/Unicode/punctuation/numeric and negative-zero keys, colon/dot early errors, typed-name and duplicate limits, and source-only exports. |
| PB-06 | New group 6: early exact diagnostic at source, browser, direct classify/emit/build boundaries, mixed simple/destructured signatures, zero macro RHS calls, direct and source single-clause default/rest, and typed priority/pre/post runtime control. No variadic overload claim. |
| PB-07 | New group 7–8: raw compile argument 7 versus expanded public 99, whole JSON round-trip/no private marker, ADT field `_` positive and runtime type-error controls, strict/lax/unsupported prefix controls, browser compile-to-ESM and actual source-only ESM import. No browser load/CSP assertion. |
| PB-08 | Focused Deno command: 66 passed / 0 failed (21 lexical + 30 walker parity + 8 new + 7 existing discard). One `make check` exit 0; M6 inner child exit 0 and 70 passed / 0 failed; fourteen receipts each show canonical=embedded and canonical=materialized. Final citations and bundle-size checks passed. `make docs` returned “up to date” without executing because the existing `docs` directory is a make target. Its exact recipe `cargo doc --all-features --no-deps --workspace` did run and exit 0 with seven rustdoc link warnings and a known `lykn` lib/bin output collision. `make check` includes documentation tests, which reported 482 passed / 0 failed. Aggregate JavaScript/.lykn count was not retained in the truncated tool output and is not claimed. |
| PB-09 | Open for separate source-first review, independent nine-row verdict, and root retrospective. No CC self-acceptance or closure. |

## Gate details

- `make check`: exit 0. Dependency, cited paths, release build, clippy, format, Lykn syntax, source lint, Rust tests, M6, full Deno/`.lykn` corpus, and docs tests all completed successfully. Deno docs summary visible in tool output: 482 passed / 0 failed. The aggregate JS/`.lykn` denominator was not captured because the tool output truncated; status is supported by the final `make check` exit 0 only.
- M6 strict materialized public tests: status 0, `ok | 70 passed | 0 failed`; selected set is 62 retained + 8 S03. All 14 canonical/embedded/materialized comparisons are true. See `artifacts/cc/m6-final/m6-embedded-public-strict.{command.txt,status.txt,stdout.bin,stderr.bin}` and the fourteen `m6-embedded-delivery-*.comparison.txt` receipts.
- Final-HEAD `make check-cited-paths`: exit 0, 64 documents, 601 historical citations accepted.
- Final-HEAD `make bundle-size-check`: exit 0; gzip 48,730 bytes against 81,920, baseline 27,630, delta +21,100. Existing esbuild warning: astring's `browser` package condition follows `import` and `require` and is unreachable.
- `make docs`: no-op (“up to date”). Direct recipe `cargo doc --all-features --no-deps --workspace`: exit 0, five lykn-lang and two CLI rustdoc link warnings, plus the known output filename collision for the `lykn` CLI/lib targets. Do not record the make target as a successful docs build. Markdown/documentation tests ran inside `make check`.

## Preserved authoring history

`artifacts/cc/intake.md` preserves the initial invalid-fixture run counts, lack of pre-edit full-test snapshot, source-side misplaced intake location, valid baseline raw/source red witness and its relocation history. It also records the later schema assertion correction (compile-time throw expectation replaced with real child runtime type-error assertion) and the rejected native-style catch object-rest assumption after inspection of actual emitted ESM. These corrections are retained as history, not counted as test failures in the final denominator. Initial green M6 receipts before the PB-02 class-expr coverage correction are preserved at `artifacts/cc/m6-pre-class-expr/`.

No source/build jobs remain owned by CC. No push, merge, release, remote CI, or external communication was performed.

## Correction01 — commit metadata and handoff reconciliation (2026-11-14)

The initial report's contiguous-trailer statement above was incorrect. Reading the actual original commit objects showed a blank line between the two coauthor lines in both messages. No independent implementation review had started, so the two local commits were reconstructed as message-only replacements; originals remain preserved as raw bytes and identified by their original hashes. Author/committer identities and dates, subjects, bodies, tree, order and base lineage are unchanged.

| Commit | Original | Replacement | Tree | Parent |
| --- | --- | --- | --- | --- |
| C1 | `df39449034e3e8530927b0df8129049833af5f5f` | `86c3d77f60af08438a184fdc4aad0beef66f17d2` | `a35f249bdf71a8744f19be2f4af5376ae28b8413` (unchanged) | baseline `9e6fb1270c3efcbaa0f6ddb9f0fbfd3b2c1c825a` |
| C2 | `85ddca6325012f12f72f18bcc2530669709e5216` | `30d8b77c4e5516191fc9d470325c4ead64e9fba4` | `eed763256aada46c8bc5e7a848be09c7a1f7f19c` (unchanged) | C1, respectively original/replacement |

Original raw receipts and `git hash-object -t commit` confirmations are in `artifacts/cc/metadata01/original-c1.commit` and `original-c2.commit`; replacement raw receipts and hash confirmations are alongside them. Both replacement messages were inspected from Git objects and end with the exact adjacent coauthor lines required by `AGENTS.md`. The ref update used explicit compare-and-swap from original C2 to replacement C2. `git diff --exit-code original-C2 replacement-C2` returned 0; the baseline-to-original-final and baseline-to-replacement-final path lists each contain the same fourteen authorized paths. The final source branch is `codex/qualified-adt-core`, HEAD `30d8b77c4e5516191fc9d470325c4ead64e9fba4`, tree `eed763256aada46c8bc5e7a848be09c7a1f7f19c`, clean. No product bytes or runtime behavior changed. Full raw/hash/graph/content evidence is in `artifacts/cc/metadata01/verification.md`.

No full focused, aggregate or M6 runtime gate was repeated: those prior doer-attested claims apply to the identical source trees and inputs, at their original recorded conditions, and remain independent-review work for CDC. This correction did rerun required final-HEAD `make check-cited-paths` (exit 0; 64 documents, 601 historical citations accepted) and fresh `make bundle-size-check` (exit 0; gzip 48,730 bytes vs 81,920 limit; baseline 27,630; delta +21,100). The size check printed two existing astring package-condition warnings (`browser` after `import`/`require`) and reported downloading esbuild from npm. These gates are captured in `artifacts/cc/metadata01/verification.md`.

## Bubble-up to Arc05 / Arc06

**Capability and integration state.** S03 now supplies the assigned public Deno/source-expansion behavior and browser compile-to-ESM parity, with staged embedded delivery and the documented raw-compiler boundary. Its task branch is a clean, reviewable integration candidate consisting of the two commits above on baseline9e. It has not been merged or propagated. CDC must first review source and reproduce the prescribed source gates; root retains integration authority. No browser load/CSP, publication or human approval is inferred.

**Discoveries and preparation.** The product contract remained stable; no structural roadmap change is indicated. The concrete corrections were evidence/fixture distinctions: schema field type failure is a generated runtime `TypeError`, not a `lykn(...)` compile-time error; the legacy catch parameter uses the public expression grammar, so a catch object `(rest _)` spells property `rest` rather than native object-rest syntax; generator parameter defaults occur at call time while the body starts on `.next()`; class-expr was an explicit PB-02 case and was added before final source gates. The initial invalid-fixture attempts, the accepted raw/source red, original artifact-location correction, and both original commit objects remain recorded without backdating or replacing them. The metadata defect was the noncontiguous trailer formatting; it is corrected in the replacement messages and the original false report line remains above as history.

**Nine-row scope versus current CC evidence.** All rows remain open pending independent disposition; these are doer attestations, not CDC acceptance.

| Row | Scope delivered or remaining evidence / owner |
| --- | --- |
| PB-01 | Public declaration and loop roles exercised, including numeric-for, for-in/of/await-of, effect controls, hole getter 0 vs named 2 and iterator close 1/1. Candidate evidence is the focused 66/0 run at the unchanged source tree. |
| PB-02 | Named/anonymous functions and generators, arrows, async function/arrow, typed lambda, class and class-expr constructors/members/wrappers/object-callable roles, arity/default/error/timing controls. Class-expr coverage was the second source commit. |
| PB-03 | Legacy scalar/array/object catch values, shorthand/pair/computed/alias-named property roles, array default/rest/spread, finally selection and direct return; existing S01 nested strict-name rejection remains the control. |
| PB-04 | Top-level untyped spread projections, fallback/form-name and reserved-name behavior, private lifecycle/whole-fragment JSON/reuse controls supplied by S03 plus retained S01 tests. No authority from generated-name prefixes. |
| PB-05 | Existing zero-name grouped admission, empty-list shorthand, nested/default patterns and static alias key normalization for Atom/Keyword/String/Unicode/numeric/negative-zero data; early colon/dot errors and typed/duplicate limits. **Arc06 LI-04 owner:** review and carry the classified-IR representation change (static Atom/Keyword alias keys become String data only for zero-name grouped patterns), its serialization and internal helper export/API contract, and compatibility tests. S03 does not broaden a library API audit. |
| PB-06 | Exact multi-clause top-level default/rest diagnostic at source, browser, classify, emit and direct-builder entrances; mixed signatures and zero macro RHS effects; one-clause default/rest and typed priority/pre/post behavior. The public classify/emit/build helper surfaces and associated immediate guide semantics are bounded impacts for Arc06 LI-04 API/IR review. **Arc05 S09 owner:** later explicit omitted/variadic overload selection/binding/effect/guard design; S03 adds no variadic overload behavior. |
| PB-07 | Raw7 versus expanded99, source/lax/strict and unsupported-prefix controls, schema field/type behavior, JSON round-trip and actual ESM source-only export. Guides 00 and 06 were updated for the public/raw/schema and parameter/generator timing distinctions. No browser execution-policy claim. |
| PB-08 | Original-condition focused/full/docs/M6 results remain doer-attested in the prior intake and `m6-final` (66/0 focused, 70/0 strict M6, all14 comparisons; `make check` exit0 with 482/0 visible docs summary). The complete product-wide JS/.lykn denominator is unavailable from the truncated original tool output and is deliberately not invented. In this correction the required final citation and fresh size checks ran at replacement HEAD. `make docs` had previously been a no-op; its direct Cargo recipe succeeded with warnings, but is not represented as a passed make-docs build. CDC owns fresh independent reproduction. |
| PB-09 | Remains open for separate Sol source-first nine-row review and root retrospective/ledger reconciliation. |

**Later owners remain held.** S04 source declaration and DTS follow-up; S05–08 naming/ADT work; Arc06 LI-04 classified-IR, immediate guide, and internal helper export/API review; Arc05 S09 variadic signature design; NUMI; RDEO/RDCL reader work; Arc04 local qualified work; and Project07/library/dependency/license, book and explicit human acceptance remain in their existing plans/owners. No roadmap row is advanced or closed by this bubble-up, and no release or S04 work is opened.

## Correction02 — source-boundary and proof repair (2026-11-14)

Correction02 addresses independent candidate30 HOLD findings R01–R05 within its exact six paths. Final source commit is `3d21eab58cb3d28714338e8742dbb0a9c519822b`, tree `b7788f6564863f51d5e8fe62979098b583b7b4b6`, on `codex/qualified-adt-core`; parent is prior metadata01 final `30d8b77c4e5516191fc9d470325c4ead64e9fba4` / tree `eed763256aada46c8bc5e7a848be09c7a1f7f19c`. The six changed product paths are `packages/lang/surface-helpers.js`, `packages/lang/lexical-regions.js`, their two embedded mirrors, `test/forms/remaining-discard-bindings.test.js`, and `docs/guides/00-lykn-surface-forms.md`. The original baseline-to-final fourteen-path set is unchanged. Both mirror comparisons are byte-equal, `git diff --check` is clean, the source worktree is clean, and actual commit message trailers are adjacent. The prior HOLD, original candidate and commits remain immutable.

### Correction02 gate evidence

- Intake/readback and required extents: `artifacts/cc/intake.md`, correction02 sections; the contract record preceded source edits.
- Focused exact four-file command: `artifacts/cc/correction02/focused-rerun04.log` / `.status`, exit0, 66/0 (21 lexical + 30 walker parity + 8 S03 + 7 retained discard). Earlier fixture failures and the one overwritten parse failure are described with their precise retention limits in the correction02 intake section; they are not erased or counted as final failures.
- `make fresh-artifacts`: exit0; `artifacts/cc/correction02/fresh-artifacts.log` / `.status`.
- One final `make check`: exit0 with complete 5,962-line raw output at `artifacts/cc/correction02/make-check.log` and `.status`. Full Lykn/JS corpus: 1,578 passed (67 steps), 0 failed. Docs tests: 482 passed, 0 failed; 15 annotated skip/fragment blocks, plus nine no-Lykn-block inputs. One existing JSR e2e test self-skipped because jsr.io was unreachable. No full-check warning lines observed; no separate `make docs` or Cargo doc was run.
- M6 materialization in new `artifacts/cc/correction02/m6-final/` (prior candidate packets untouched): inner strict result 70 passed/0 failed (62 retained + 8 S03), status0; all14 canonical/embedded/materialized comparison receipts true. The packet's `m6-embedded-public-strict.command.txt`, config and streams are present. Its nested command argv was not separately traced; that limit is retained.
- Final-HEAD `make check-cited-paths`: exit0, 64 docs/601 accepted historical citations; `artifacts/cc/correction02/check-cited-paths.log` / `.status`.
- Fresh final-HEAD `make bundle-size-check`: exit0, gzip 48,691 bytes against 81,920; baseline 27,630, delta +21,061. The run downloaded esbuild from npm and emitted repeated existing astring conditional-export warnings. Receipts: `artifacts/cc/correction02/bundle-size-check.log` / `.status`.

### Nine-row CC proposal and downstream limits

All rows remain open pending the separate Sol source-first review and root disposition. This correction directly supplies renewed CC evidence for PB-01 (child-boundary, typed async and loop controls), PB-02 (actual generator sentinel/layout and timing), PB-03 (legacy catch distinction), PB-04 (callable spread and fragment lifecycle), PB-05 (nested grouped effect/key metadata checks), PB-06 (prior unchanged signature behavior rerun in focused suite), PB-07 (actual Error/TypeError, JSON/raw/schema and dual-facade behavior), and PB-08 (full focused/aggregate/M6/citation/size gates with stated limits). PB-09 remains open for independent verdict, root retrospective and ledger reconciliation. This is CC evidence, not independent acceptance.

The immediate guide now distinguishes ordinary binding-pattern array elision from a bare legacy `(catch (array _) ...)` expression slot, which reads the thrown item without introducing a source name. Public raw IR and generated schema roles stay distinct. Arc06 LI-04 still owns classified-IR/key representation and immediate helper/API review; Arc05 S09 owns later omitted/variadic signature design. S04–S08, release, propagation, remote CI, publication, book/library/licence and explicit human acceptance remain held. The behavior demonstrated is browser-facade compile-to-ESM through actual module import; no browser loader, run/load/CSP or publication claim is made.

The root has exclusive source/build ownership now; no CC jobs remain. Do not mark a row accepted or close S03 from this handoff.
