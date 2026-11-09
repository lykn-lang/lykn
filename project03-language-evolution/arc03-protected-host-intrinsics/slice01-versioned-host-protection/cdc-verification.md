# CDC verification — S01 attempts, 2026-11-08

## V1 production candidate stopped at static review — 2026-11-09

[Iteration05](cc-prompt-iteration05.md) authorized the original production
implementation after the accepted pre-policy baseline. Luna6 High CC
froze clean `cabfc621dd28331aafe1315292bd830be2dd459d`, tree
`1809cdaa7918c0cd2c24fa6e5a9d878161fc59cf`, parent
`5a2e569852fa88181498c18d28cdfb26f70e2dae`. I inspected the actual
17-path scope, commit body and trailers, and the source from that clean
checkout. The public host test is unchanged and the native test diff
only replaces the Deno fallback path. CC attested mirror comparisons
exit 0. Neither reviewer released any formatter, build or test.

**Verdict: substantive static STOP.** These are source-derived findings
at the frozen revision. No v1 compiler result has been observed.

| Finding | Frozen source trace and affected contract |
| --- | --- |
| Public walker enters in the wrong dialect | `packages/lang/mod.js:23–24` sends `expand(read(source))` to `compile`. The expansion of SetProp and SetSymbol emits ordinary kernel `=` forms at `packages/lang/classifier.js:513–516`. `packages/lang/compiler.js:2271–2275` calls the new validator. Its visitor defaults to Surface at `packages/lang/protected-host.js:40`, uses that default for the full unit at line 106, and only records `=` in Kernel at lines 95–96. It therefore misses the ordinary expanded assignment route used by W1/W2/W4/W5/W8/W9. |
| Both walkers omit delete | Frozen W7 is `(kernel:delete Reflect:apply)`. JS strips the prefix at `packages/lang/expander.js:942–955` and supports kernel `delete` at `packages/lang/compiler.js:1642–1649`. The new JS target dispatch at `packages/lang/protected-host.js:87–98` lacks `delete`. Native strips the explicit prefix in `crates/lykn-lang/src/protected_host.rs:330–349` but also has no delete target case. |
| Native Surface `func` parameter scope is missing | The new function handling at `crates/lykn-lang/src/protected_host.rs:231–254` covers fn/lambda/genfn and kernel function only. The later generic visit walks a Surface `func` body with no parameter scope. The unchanged V2/V3 functions assign through their own `Reflect`, `globalThis` and normalized `Reflect!` parameters. The walk reaches those writes as though their roots were global. |
| Native explicit escape leaks into unprefixed children | `crates/lykn-lang/src/protected_host.rs:330–349` changes the operation's dialect and then passes that changed dialect to every child. Iteration05 requires unprefixed source children to retain the surrounding dialect. A parent escape alone must not reinterpret source equality as a write. |

The mechanical source diff check exited 2 on the new Rust module's
blank EOF line at line 440. It remains as frozen. The typed dist
adapter, macro-time wrapper and docs are present in the draft and have
no build or behavioral acceptance. The frozen candidate and both
accepted prerequisite refs remain intact.

**Re-entry held.** Retain the exact frozen W/legal/oracle tests and
approved source contracts. A proposed correction would align the JS
whole-unit boundary with expanded Kernel, cover delete in both target
dispatches, derive actual Surface function/parameter/body scopes from
the source binder grammar, and keep an explicit escape's dialect local
to its operation. Recheck the remaining scope/target cases in the
issued recipe before the existing independent static gate. Preserve
macro-time exclusion, typed dist and the portable test fallback.
If authorized, the next correction is source refinement 04 of 5.
No correction is issued here. HC-01 through HC-06 and the linked
PHI/CV work remain open. All planned v1 behavioral gates are unrun.
The previous pre-policy baseline remains accepted at `5a2e569`.

## Original pre-policy baseline independently reproduced

At clean local composite `5a2e569852fa88181498c18d28cdfb26f70e2dae`,
Luna6 High CC and separate Sol6.1 High CDC ran the original frozen
baseline after the composition review below. Each execution used its
own prospective argv/cwd/env/pins, named-file checks and raw destinations.
CC returned clean ownership before my separate build and runtime pass.
Both no-run builds exited 0. The post-build test SHA-256 was
`7431c1d06f40d9873895b6ee6871acbf6113d7ff4954f001d2b44db2f135fb9e`
and debug CLI SHA-256 was
`40b47fb877f8cdce1ac177104eed1a80535e907a6d726307da9dc548c05cfd45`.
Deno 2.9.6 retained the assigned binary identity.

| Gate | Reconciled result in each execution |
| --- | --- |
| Native predicate controls | 15 of 15 exact verdicts, one accept and 14 rejects |
| Native pre-policy routes | 29 of 29 exit 0, each exact rejection predicate false, including W8 on all three routes |
| Native legal controls | Four strict children exit 0, exact outputs and empty stderr |
| Dist | Actual `Ok` for the typed fixture, with source newer than both epoch outputs and both JS/DTS bytes and mtimes changed |
| Native parent | Exit 101 with one pass and two expected policy failures, zero ignored or filtered |
| Public pre-policy cases | Nine generated modules with no write-case runtime. W8 emitted exact `Reflect.apply = 0;\n`. Four legal before/after pairs have strict child exit 0, exact outputs and empty stderr |
| Public parent | Exit 1 with 0 passed, 13 caught step statuses marked ok and one failed parent. Its actual failure list has nine missing rejections, compared with expected empty |

Legal outputs were exact `"function"\n`, `[7,8]\n`, `9\n` and
`99\n` in both pipelines. The runners are intentionally red because
v1 rejection is unimplemented. No protected-write artifact was executed.
The native Homebrew fallback remains a future portability issue for the
normal Arc03 suite. These baseline runs explicitly set the Deno path.

[CC baseline evidence](artifacts/evidence/cc/resumed-baseline-5a2e569/)
and [CDC independent baseline evidence](artifacts/evidence/cdc/resumed-baseline-5a2e569/)
preserve the raw statuses, case artifacts and file-effect receipts.
My runs use the shared tool/source-config readbacks in the earlier
[independent prerequisite archive](artifacts/evidence/cdc/w8-prerequisite-46ca1c04/).
The prelaunch hold caught missing original native flags and missing
public Deno/evidence exports in CC drafts. Both drafts are preserved
unexecuted, with separate corrected readbacks preceding the actual
launches. The archived run directories compared byte-for-byte. The raw
evidence diff check exits 2 on native EOF blank lines and public runner
heading spaces/EOF. Prose-only and source checks pass.

**Disposition.** Accept the exact local composition and reproduced
pre-policy baseline. This fulfills AM-04's explicit bounded re-entry
condition alongside the earlier accepted Arc02 MR rows. HC, PHI and CV
remain open. Source refinement 03 of 5 is spent. V1 and typed dist
production remain separate from this authorization. No full Make was
run on the intentionally red composite. Release `62e9531e` is clean
and unchanged.

## Local composition verified before baseline

Luna6 High CC performed the authorized normal two-parent merge at
`5a2e569852fa88181498c18d28cdfb26f70e2dae`, tree
`7a9f29b2a312e4b3d1a20bee3cd14fdadddb4a79`. I independently read the
actual commit and trailers, parent order `a7153649`, `46ca1c04`, clean
status and the exact five-path union over `f2cd8139`. Both owning-parent
path comparisons and the source diff check exited 0. The two original
host fixture files and the three prerequisite paths are byte-identical
to their respective parents. This releases only baseline preparation.
Each build, native executable and public target still requires a
separate prospective release. Release `62e9531e` remains unchanged.

## W8 numeric prerequisite accepted independently

Under [iteration04](cc-prompt-iteration04.md), Luna6 High CC replayed the
same frozen red at `17d7018` with a fresh XDG cache and actual prospective
receipts. Refresh exited 0 and the focused target exited 1 with seven
existing passes and the two predicted missing-node-type failures. Each
released command had an actual named config check, scoped argv/env/cwd
readback and separate raw outputs/status. The earlier red and its missed
preflight remain preserved below.

CC then froze `46ca1c04b41e19385bc2867125bf4c816b7be31e`, tree
`d483d56d7f807237e6248d5b05cbd8ad8e4a3e17`. I reviewed the immutable
three-path diff from `f2cd8139`, the actual commit body, and unchanged
frozen tests. The two expander copies add one private numeric strategy
operation for root and nested quasiquote templates. Compiled templates
construct a typed number node and ordinary expansion preserves its
existing node. No string/keyword behavior or public API change was
introduced.

CC returned clean exclusive ownership before my separate Sol6.1 High
execution. Each role observed refresh exit 0, focused nine passes,
and safe native compile exit 0 with exact 16-byte
`console.log(0);\n` and empty stderr. The actual newly materialized
expander in each native XDG root matched the canonical and embedded
source bytes (SHA-256 `239bbdcf5b50d7168b0e477bc940d6b1da0a46452ac715d833e76b3baa280c0b`).
Each strict Deno execution printed exact `0\n` with exit 0 and empty
stderr. Both full normal Make gates exited 0 with all Rust targets,
1,473 suite tests and 15 steps, and 482 documentation tests. Both
standalone citation gates exited 0 (63 documents, 601 historical
citations). The independent refresh and post-Make release and bin
SHA-256 were `3c96663e9dab5d51cdf12b8cf816e8819e9e20793e19dac8f700bc4f4383e5dc`.

[CC raw and prospective receipts](artifacts/evidence/cc/w8-continuation/)
and [CDC independent receipts](artifacts/evidence/cdc/w8-prerequisite-46ca1c04/)
retain the distinct invocations. Their source directories compared
byte-for-byte before archival. The evidence diff check exits 2 on the
original runner headings/EOF and two byte-dump whitespace records.
Prose is checked separately. Source diff check passed.

**Disposition.** Accept only the numeric prerequisite at `46ca1c04`.
Its immutable branch remains distinct from the Arc03 baseline branch.
The authorized exact local composition and original pre-policy baseline
are next. All six HC rows and the linked PHI/CV obligations remain open.
Source refinement 03 of 5 remains spent. Release `62e9531e` is unchanged.

## W8 repair prerequisite stopped before production

Source refinement 03 of 5 followed [iteration03](cc-prompt-iteration03.md).
The source trace accounts for the earlier public W8 failure. The compiled
template's number node becomes primitive `0` inside the public macro
result. Expansion expects a node with a type, while the native JSON decoder
turns a raw number into `SExpr::Number`. The proposed repair stays numeric.
Adjacent string and keyword behavior has no new execution evidence.

Luna6 High CC froze the two harmless regressions at `533fe76`, then aligned
the canonical reset helpers at `17d7018fe679fcc75e1912fcd336af133e5c9cd4`,
tree `718af9ecb77bcf4f750b61a5720b92cdaf98c2e8`. Sol6.1 High CDC
independently reviewed both commits and released only the red gate.
The prerequisite branch is `codex/public-macro-numeric-literals` based on
accepted `f2cd8139`, with a one-file delta in `test/expander/macro-basic.test.js`.
The clean CC handoff retained `codex/protected-host-contract@a7153649`
and release `62e9531e`.

The [original raw red](artifacts/evidence/cc/prerequisite-17d7018/) shows
refresh exit 0 and a focused test exit 1. Seven existing tests passed.
Both new safe numeric cases failed with
`expandExpr: unexpected node type 'undefined'` through the canonical
expander. CDC independently inspected those actual streams and hashes.
The W8 fixture and its earlier stopped baseline remain preserved.
The archive matches the original directory byte-for-byte. The planning
diff check exits 2 on two original runner headings with trailing spaces
and one EOF blank line in `macro-basic/stdout.raw`. Prose-only exits 0.

**Mandatory launch evidence is incomplete.** CC confirmed the individual
named configuration paths were never inspected before either launch.
The files named `named-ancestor-checks.txt` contain only directory
metadata. No durable prelaunch argv/environment record and readback were
made. CC attested the following original tool invocation strings from
its transcript, with cwd the source checkout. This is a post-run report
of the originals, separate from the missing prospective records.

```text
env TMPDIR=/private/tmp/arc03-s01-17d7018/fresh-artifacts DENO_DIR=/Users/oubiwann/Library/Caches/deno XDG_CONFIG_HOME=/private/tmp/arc03-s01-17d7018/xdg-config XDG_DATA_HOME=/private/tmp/arc03-s01-17d7018/xdg-data npm_config_cache=/private/tmp/arc03-s01-17d7018/npm make fresh-artifacts
env TMPDIR=/private/tmp/arc03-s01-17d7018/macro-basic DENO_DIR=/Users/oubiwann/Library/Caches/deno XDG_CONFIG_HOME=/private/tmp/arc03-s01-17d7018/xdg-config XDG_DATA_HOME=/private/tmp/arc03-s01-17d7018/xdg-data npm_config_cache=/private/tmp/arc03-s01-17d7018/npm /opt/homebrew/bin/deno test --config project.json -A test/expander/macro-basic.test.js
```

Those overrides omit `XDG_CACHE_HOME`. Fresh embedded materialization
cannot be inferred from the config and data directories. The actual red
is retained as an observation. The promised controlled gate remains
incomplete. CC returned all ownership clean at `17d7018`. Under the
Operator stop rule, production, independent acceptance, composition and
the resumed Arc03 baseline remain held. This attempt executed no W8
protected-write module. All HC/PHI/CV rows remain open.

**Next bounded gate.** Keep the same two frozen regressions. Once resumed,
use fresh owned TMPDIR, XDG cache and npm roots. Inspect the exact named
configuration files prospectively and write/read the actual argv/cwd/env
and raw locators before each launch. Repeat only the same refresh and
focused red with those conditions. Its raw result will be a separate
observation. Source refinement 03 of 5 is spent.

## W8 regression prelaunch review

The tests-only freeze `533fe76ee62f4f196fddd56e79c04aae527d77e7` adds
the two approved canonical-public-compiler cases. Its calls to the old
reset helpers resolve through the built package, a different registry
from the canonical compiler. CDC's clarification arrived after the
freeze. The two new names are distinct and no gate has run. Before
release, use canonical aliased reset imports only for the two new cases
with [the supplied message](artifacts/commit-messages/w8-test-registry.txt).
Preserve the original freeze, fixtures, assertions and static hold.

## Correction02 public baseline stop

Operator authorized the one-file native-oracle correction and finite
baseline through [iteration02](cc-prompt-iteration02.md), source refinement
02 of 5. CC `/root/cdc/macro_dependency_design_luna` (Luna6 High) froze
the native test at `f84b599dc6c3fba9166687a09806ef76f783ba81` and leaf
formatting at `a71536496ab8ee858cafdc319deea2e0d483077f`, tree
`2bb3c5903acea127e291304091d1be05a7e92e6b`. Sol6.1 High CDC read both
complete immutable deltas, checked exact scope and digest, and released
the baseline. The final native file SHA-256 is
`f8a93bcc9223f59826ddd3a5f01ceb40fe38a96ee6e76c10fef34b6b55651ef7`.
The implementation tree delta from the accepted composite is the native
test only. The public test still has the original phase pairs.

CDC independently reconciled the [raw CC evidence](artifacts/evidence/cc/correction02-baseline/)
against the exact commands, fixed-ancestor checks and pinned tool identities.
No-run exited 0. Direct native target exited 101 with one pass and two
expected failed parent tests. The acceptance control and all fourteen
rejecting controls matched their independent expectations. All 29 original
routes exited 0, including all three native W8 routes, and all 29 failed
the exact v1 rejection predicate. The four legal native runtimes exited 0
with exact `"function"\n`, `[7,8]\n`, `9\n`, `99\n`, and empty
stderr. The typed dist package returned success and overwrote both actual
JS/DTS sentinels and their epoch mtimes. The new exact typed diagnostic
comparison is a future v1 assertion. This old success never reached it.

After native reconciliation, CC launched only the released public target,
`/opt/homebrew/bin/deno test --config project.json -A test/forms/protected-host.test.js`.
It exited 1 at the final aggregate assertion. The runner printed 13 step
statuses as ok because each step captures its error. Actual per-case
receipts show eight write cases returning JS. The unchanged W8 fixture
instead recorded `generated: null`, `runtime: null`, with the exact
reported error `expandExpr: unexpected node type 'undefined'`. This
differs from the required nine public generated-module results and is the
first unexpected substantive failure. It supplies neither generated JS
nor a host policy rejection. The four legal public runtimes retained
before/after pairs and passed exact outputs, exit 0 and empty stderr.
No protected-write module ran.

**Verdict.** The correction's source and native pre-policy results are
verified. Public baseline stopped on W8. CC returned clean ownership at
`a7153649`. Separate replay, full Make and production v1/dist work were
held at the stop. All HC, PHI and CV rows stay open. Source refinement
02 of 5 is spent. The future normal full-suite gate still owns the
pre-existing Homebrew-only native legal-runtime fallback. This baseline
used the explicit pinned Deno override. The public W8 evidence gap needs
its own bounded disposition before resuming the baseline.

The archived raw directories and command receipts match the original bytes.
The full planning diff check exited 2 on trailing spaces in the original
public runner headings and EOF blank lines in native/public stdout. Prose-only
diff check exited 0. Runner stdout is preserved without normalization.

## Earlier native-baseline STOP — no product acceptance

Luna ran native baseline once at e2f after the released correction. CDC read
original no-run/native metadata/status/runner output, all37 CLI/runtime status
receipts, three full W8 errors/source, four complete legal generated modules/
runtime bytes and actual dist before/after/mtime records. Current CLI/test/Deno
hashes match prelaunch metadata. This is independent reconciliation of original
CC evidence, NOT fresh runtime reproduction; root explicitly held any rerun.

Observed native29 =26 old-success +3 W8 macro dependency errors. Legal native
4/4 exact expected bytes/exit0/empty stderr; dist Ok/JS+DTS overwritten. Runner
1pass2fail/exit101 is not enough to certify a meaningful entire baseline: W8
failed early with bare-astring dependency resolution, not protected-host v1.
Public0/13. Full [report](closing-report.md) retains source/pins/limits and all
unrun gates; no protected-write code executed or policy implementation authored.

Separate test-oracle gap: native generic-nonzero predicate cannot distinguish
this unrelated error from desired policy rejection. CDC owns a future approved
discriminating-v1 oracle design, not a quiet edit. The phase-path correction is
statically resolved, but its public runtime effect remains untested.

Bounded source inspection: actual `expander/deno.rs` find_project_json walks
caller cwd, build_deno_command materializes packages and supplies --config only
when found, then changes child cwd to that materialization. Compiler.js imports
bare astring. This aligns with the observed boundary; it does not prove a repair
or an unavailable-versus-unmapped dependency diagnosis. No probe/installation/
environment workaround followed. Earlier read of a guessed subprocess.rs path
failed; actual source was then located/read as deno.rs, no runtime involved.

CC ownership is fully returned. Verdict STOP; all6HC/PHI/CV OPEN, source
refinement01/5 spent, no new correction issued. Exact existing raw copies compare
identical; prior stopped records and setup/pin-capture limitations remain.
Actual whole staged diff-check2 is solely raw/native.stdout's trailing blank
line; prose-only gate0. Raw fidelity is retained, not silently normalized or
represented as a green whole-diff check.

## Correction01 static release — no behavioral acceptance

Operator-approved iteration01 issued at planning 63723f42a15f5267424ac5fff2caec4bcf2386c9.
Same Luna actor completed renewed intake/F-body readback; CDC explicitly renewed
exclusive source/index/build/raw ownership. CC froze correction at
`e2f29597ab677346abc6e17ec3616d4a340b7861`, clean, direct child of preserved 871f.
CDC independently read the COMPLETE new public test and exact one-file diff:
only final default phase parameter, phase-qualified path and before/after
arguments changed. createNew, both records, all fields/sources/assertions/flags
are intact. Native test blob is unchanged from the prior complete review.
Actual raw Git body matches the supplied correction01-F and contiguous trailers.

The known static writer collision is resolved by distinct literal phase paths;
this is not a runtime result or universal test correctness claim. CDC releases
the ORIGINAL still-unrun baseline build/final-pin/direct-native/public stage
after this record commits. No production policy edit before actual baseline
return and explicit source-stage release. All6HC/all6PHI/CV remain OPEN;
refinement01/5, original first-further-substantive-failure STOP remains.
The initial STOP/report below remains valid for its871f condition.

## Initial static STOP — preserved

Reviewer `/root/cdc`, gpt-6.1-sol High, independently inspected the complete
two-file test freeze `871f0a3b5d444213fb59e7f25dab8f9a95fa0893` authored by
`/root/cdc/protected_host_s01_luna_cc`, gpt-6-luna High. CDC designed the
assignment and authored planning, not either test implementation. Root supplied
a separate read-only confirmation, not a fresh runtime replay.

**Verdict: HOLD/STOP, no source acceptance.** The exact public writer and its
pre/post calls are `test/forms/protected-host.test.js:35–57`, `104`, `111`.
Same path plus createNew cannot preserve both legal-case records under the
assigned evidence environment. The second write precedes the runtime predicates.
No compiler behavior was tested; no runtime exception was observed. Stop was
issued immediately after this finding, before static baseline release.

Actual commit/raw trailer and complete source reads support this finding.
CC confirmed no build/no-run/test/runtime and no corrective edit. All6HC,
all6PHI and all6CV remain open; [report](closing-report.md) accounts for each
row and every unrun denominator. No completed source criterion is inferred from
the existence of a regression commit. Static review beyond this stopping point
and all implementation/generated/backend behavior remain unaccepted/untested.

The report is CDC's attributed stopped-attempt reconciliation of CC chat return,
not an implementer-authored proposed-done report. Artifact inventory and parent
updates preserve initial prompt/commit/history; no retrospective evidence is
represented as independent behavioral proof. The existing two-slice roadmap
does not need architectural amendment; its current blocked status does.

Re-entry requires renewed Operator authority for the concrete phase-path-only
test correction in the report. No correction prompt, new source, experiment or
next slice was issued after STOP. Accepted release and old accepted source refs
remain62e; current candidate is the unvalidated tests-only871f branch.
