# CDC verification — S01 attempts, 2026-11-08

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
