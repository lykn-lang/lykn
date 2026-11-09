# Arc03 S01 refinement 02 of 5 — native diagnostic oracle and pre-policy baseline

Operator authorizes the reviewed test correction and finite baseline on the
independently verified `8443fdeda07139cdc2c333e03f210ac471454249` composite
(tree `4cf3cc9654899e21faecbc5cb3ff5fc5f5fc383b`). Same Luna6 High CC and
separate Sol6.1 High CDC in Autonomous Mode. Stop at the next unexpected
substantive failure or real evidence gap. This is source refinement 02 of 5.
Arc02 source refinements, Arc03 earlier stops and raw evidence, and S04/tooling
8/K0/13 retain their original states. The endpoint is independent baseline
reconciliation. V1 production and the typed dist adapter require later
authority.

Read this complete assignment, original [prompt](cc-prompt.md),
[iteration01](cc-prompt-iteration01.md), slice plan, ledger and earlier
stop records. Read the [reviewed oracle design, sections 3–4](../../arc02-ad-hoc-maintenance/slice02-embedded-macro-dependency-resolution/artifacts/repair-and-oracle-design.md#3-arc03-native-oracle-correction-proposal-held-separate-owner),
and the complete source `protected_host.rs` and `protected-host.test.js`.
Reuse prior design and gate intake, refreshing the actual source/plan changes
and exact commit message. Verify `reader::read`, `SExpr::as_list/span`,
`Diagnostic/Severity`, `Span`, CLI check/compile rendering and typed
`DistError` against the current checkout. Apply the inherited Rust/test
guidance. CDC retains planning and hands off exclusive source/index/build/raw
ownership. Same task checkout and `codex/protected-host-contract` branch.

## Exact test change

Edit only `crates/lykn-cli/tests/protected_host.rs`. Keep W1–W9 source bytes,
the 29 native routes, legal V1–V4, typed dist and public 13 steps. Preserve the
public receipt phase correction and the original child flags. Apply the
reviewed design to the existing native parent test:

1. Expected diagnostic message is independently literal
   `host-contract v1: write to protected slot <slot>`. W3/W4 use `Reflect`
   and all other W cases use `Reflect.apply`. Error severity and no
   suggestion. Parse the unchanged fixture with `lykn_lang::reader::read`,
   then use `as_list()` to select form0 child1. W9 selects
   `form0[7][1][1]`, and W8 uses `Span::default()` for unknown origin.
   Get the full span through `SExpr::span()`. CLI rendering uses the start
   line and column only. The check route requires exact
   `<source-path>: error: <line>:<column>: error: <message>\n`.
   Every compile route requires exact
   `<line>:<column>: error: <message>\n`, including strip and missing output.
   Use actual path display and independent literal severity/message rather
   than formatting actual compiler diagnostics as expected output.
2. One private predicate borrows actual observation fields. It requires
   `code == Some(1)`, empty stdout, exact stderr bytes and matching file
   effects. Existing outputs require JS/DTS bytes AND observed mtime pairs
   unchanged. Missing output requires actual absence before and after.
   Distinguish NotFound from other artifact read/stat errors. For routes
   with output paths, snapshot the actual bytes/metadata on both sides and
   feed those fields to the predicate. Do not pass a synthetic effects-ok
   boolean, use generic nonzero, or forge ExitStatus. Preserve or extract
   actual Output fields for real observations and use the same predicate
   with synthetic fields.
3. For all existing-output CLI sentinels set the actual epoch mtimes using
   `File::set_modified` as in the existing typed dist test, then read
   actual mtimes. Retain JS/DTS before/after bytes and actual mtime/absence
   receipts before desired-rejection assertions, including strip and the
   missing-output route. Preserve all 29 observations before the aggregate
   rejection assertion. Keep raw source/commands/streams/status at the
   existing before-assert points. The predicate verdict may be rendered
   locally using the existing receipt mechanism.
4. At the start of that same negative parent test, run exactly 15 private
   predicate observations. One complete accept control uses an exact
   compile diagnostic, exit 1, empty stdout, and unchanged JS/DTS sentinel
   bytes and epoch times. Each reject changes the relevant data: syntax
   error, I/O error, unrelated astring macro error, v1 marker embedded in
   macro error, wrong slot, wrong severity, wrong span, exit 0, exit 101,
   no exit code, stdout payload, JS mutation, DTS mutation, or mtime-only
   mutation. Keep other fields at the passing values wherever applicable.
   Assert the same predicate under all 15 controls with case identity and
   retain each verdict. These are inline Rust product test data, with no
   extra test parent, compiler launch, fixture family or helper framework.
5. Keep the typed dist epoch/byte preservation checks and real raw receipts.
   Require `DistError::Language`, exact `path == source_path`, and
   `LyknError::Classify(actual)` equal to a `Diagnostic` with literal
   Reflect.apply message, Error severity, suggestion None, and actual parsed
   `DIST_SOURCE` form1 child1 span. Preserve the expectation of the old
   typed dist success/overwrite as baseline evidence. The production
   `dist.rs` adapter is held.

Keep the pre-existing native legal-test Homebrew fallback unchanged in this
scope. All evidenced native baselines explicitly pin `LYKN_TEST_DENO`.
Portable normal full-suite readiness remains an obligation before the later
v1 acceptance gate.

## Freeze and exact baseline

Read [correction02.txt](artifacts/commit-messages/correction02.txt) verbatim
before using `git commit --only -F <absolute file> -- <exact test path>`.
Return actual immutable diff, raw message/hash and clean status. Hold all
formatter/build/test launches for CDC static review. The inherited optional
mechanical leaf rustfmt may follow release with old/new bodies and actual
receipts, a new formatting freeze if changed, and static release before
builds. No quiet semantic corrections after a stop.

After release, build only `cargo test --offline --locked -p lykn-cli --test
protected_host --no-run`. Pin the actual CLI/test executables after last
Cargo and the exact Deno2.9.6 binary. Direct native test first. The expected
old baseline has all 15 predicate controls correct, all 29 CLI routes exit 0
including all three W8 macro routes, native legal4 exact runtimes, and typed
dist success with real JS/DTS overwrite. The parent native result is expected
1 pass/2 fail, exit 101. Reconcile the exact observations, since a generic
runner total cannot distinguish unrelated failures.

After expected native evidence, run the unchanged public target using the
repo's existing configured contributor command,
`/opt/homebrew/bin/deno test --config project.json -A test/forms/protected-host.test.js`.
Keep test cwd the source checkout and fresh separate absolute public evidence
root. Verify all nine bad cases actually return generated JS and have no
runtime child. All four legal cases must retain their before/after receipt
pairs and exact strict runtime outputs. The expected aggregate is an old
rejection-oracle failure at the parent, with the actual 13 step statuses
recorded separately. Never execute any protected-write generated program.

Each run uses fresh owned absolute TMPDIR/XDG/npm paths, fixed approved
`DENO_DIR=/Users/oubiwann/Library/Caches/deno`, the original pinned
`/opt/homebrew/bin/deno` SHA256
`2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74`,
and distinct `LYKN_PROTECTED_HOST_EVIDENCE_DIR` roots. Before launch retain
the prospective exact named `project.json`, `deno.json`, `deno.jsonc`
checks for fixed fixture-root ancestors. Use no directory traversal.
Document actual argv/cwd/scoped env/pins/raw locators before launch and full
raw bytes/status afterward. Keep phase pairs and no outputs executed from
bad cases. Return clean ownership for independent reconciliation/replay.

All authored research, helper and orchestration logic uses Lykn. No Python
execution or exceptions, substitute scripts, new dependencies, gate bypasses,
source production edits, full Make on the red pre-policy candidate, Arc02
or release integration, push or publication.
