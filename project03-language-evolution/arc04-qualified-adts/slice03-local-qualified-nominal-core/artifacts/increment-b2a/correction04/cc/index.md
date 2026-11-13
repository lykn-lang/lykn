# B2a correction04 CC intake and evidence index

Issued scope: S03 iteration13 correction04. Source/build owner is CC until
clean source commit and handback; root retains planning Git/status ownership.
The initial source pin is `0e249cafb7d50ce45e00f7c7288249666fcc113f`, tree
`e946afc2283951fe11f2e9c7040a7f734dbf6d11`, branch `codex/qualified-adt-core`,
with clean status. This file and receipt home are the canonical planning-side
CC evidence location. Required intake and source/docs readback were recorded
before product edits and tests.

## Intake and readback (pre-edit)

Read the complete issued iteration13 prompt (156 lines) and its source-cited
manifest. Its bounded change is native Surface protected-host lexical policy:
derive real typed parameter leaves from parsed `ParamShape`, classify the
actual parsed Surface function families at their emitted boundaries, and
exclude Genfunc post metadata because the emitter does not execute it. Keep
the raw Kernel walk, diagnostics and ordering, language syntax, public
validator input contract, and all unrelated language decisions unchanged.
Iteration13 keeps the original focused/full/cold M6/citation/bundle gates and
requires exact-path commit plus clean handback for separate Sol review.

Read source `AGENTS.md` in full (186 lines). It requires Rust/testing skills,
source/planning worktree separation, preservation of first failures, exact
gate populations, and explicit-path commits with parsed contiguous
Co-authored-by trailers. Rust skill entrypoint, anti-patterns, core idioms,
API design, ownership/borrowing, type design, and error handling were read;
the skill-relevant guidance here is to accept borrowed slices, avoid clones
when ownership can move, keep APIs narrow, and preserve normal diagnostics
instead of panicking on user input. Testing skill and its testing-discipline
and validation-gates guides were read: focused causal pairs precede full
gates, and failed evidence is retained.

Planning source readback: full `slice-plan.md` (471 lines), `ledger.md` (14
lines), original lexical-regions recipe (224 lines), correction03 CDC HOLD
readback (174 lines), correction03 closing-report carryovers (lines 438–558),
and iteration10/11/12 affected sections. The slice remains active, B2-LX is
open, and B2-ID-NAME and dependent B2b remain unanswered/held. Correction03
CDC's source-grounded HOLD is reproducible: native Surface traversal treats
raw anonymous `fn|lambda|genfn` arguments as body sequence, so Genfn `:yields`
metadata is visited and contributes scope names; named Surface Genfunc also
visits and scopes post even though the emitter ignores it. The valid
discriminating host-write key is the string `"isArray"`; keyword `:isArray`
is not a rejection oracle. Metadata and ignored-post positive controls must
compile and execute with value 41, while the corresponding executable-body
write rejects at the receiver's source span. Moving a write into the real
body must reject even when metadata/post contains a same-named binding.
Ordinary Func post remains executable. Direct public raw-source validator
calls are outside its documented complete expanded/kernel input domain and
are not an authorized policy change.

Source readback before edits:

* `crates/lykn-lang/src/protected_host.rs:49-52` selects `scope_names` by
dialect. At line 307 onward `param_scope_names` currently projects
`ParamShape::bound_names()`, incorrectly treating external nested alias keys
as local bindings; `typed_params()` is the actual leaf projection.
* `protected_host.rs:670-733` already uses the pure
`crate::classifier::classify_expr` in the Surface-only named Func/Genfunc
path. Func scopes/visits pre, post, body. Genfunc currently also scopes and
visits post. The raw anonymous `fn|lambda|genfn` path at 735 onward consumes
raw args and therefore treats metadata as body; the raw Kernel traversal
follows afterward and is to remain unchanged.
* `crates/lykn-lang/src/ast/surface.rs:50-128` defines actual ParamShape leaf
and bound-name projections; `:153-177` defines parsed Func/Genfunc clause
fields, and parser-selected Surface Fn/Lambda/Genfn forms contain typed params
plus body with Genfn metadata already removed. Thus the native Surface
classifier can use actual body/default regions without re-parsing syntax.
* `crates/lykn-lang/src/classifier/forms.rs` parses typed clause headers and
selects Genfn metadata/body regions; `crates/lykn-lang/src/emitter/forms.rs`
dispatches parsed Surface forms and `emit_genfunc` (around 3987–4075) emits
generator pre/body while omitting Genfunc post. Ordinary Func post remains
emitted. This confirms the boundary distinction.
* `crates/lykn-cli/tests/protected_host.rs` has INVALID/LEGAL matrices and
separate check, compile-output, missing-output, and stripped-route
observations. Existing `INVALID[0]`, `[8]` selectors and original failure
receipts must remain stable if adding cases; expected counts should derive
from matrix length. Native unit tests use `validate_program(...,
InputDialect::Surface)` for source-only behavior.
* `packages/lang/protected-host.js` documents validation of one complete
expanded/kernel unit; `packages/lang/compiler.js` invokes it after
`lowerHostReferences`. Public proof therefore uses actual `lykn` compilation
and generated ESM execution, not direct raw-source validator calls.
* `test/expander/lexical-regions.test.js` (all 407 lines) was recovered in two
reads. It already includes prior B2a typed-header, default/body macro
single-evaluation, Genfn metadata, class, result-slot, export-slot, macro
priority, and private-host-control tests. Preserve its existing fixtures and
full M6 inclusion; do not weaken or remove prior assertions.

Environment and evidence policy: before each product invocation, create and
set all owned runtime/cache directories under
`/private/tmp/lykn-b2a-correction04-cc/{tmp,xdg,npm}`; retain existing
`DENO_DIR=/Users/oubiwann/Library/Caches/deno`. Capture contemporaneous
command, cwd, env, stdout, stderr, and numeric status to this canonical
correction04 evidence home. Do not place cache/build trees in evidence.

Read-only intake queries included an initial incorrect lookup of
`crates/lykn-lang/src/surface_ast.rs` (the actual file is `src/ast/surface.rs`)
and a Rust guide lookup for `05-type-design.md` (the actual repository guide
is `05-type-discipline.md`). Both were corrected; neither attempted a product
command. A broad initial listing of the lexical test exceeded output limits;
the file was then read completely in bounded chunks. No source changes or
product/test invocations occurred before this readback was written.

## Evidence

The initial source pin above is verified. First focused causal pair and
source-helper test results will be appended below with contemporaneous
commands and raw streams.

## Implementation

Only the authorized production file changed: `crates/lykn-lang/src/protected_host.rs`.
`param_scope_names` now projects `ParamShape::typed_params()` leaves and
normalizes each actual emitted parameter name; the classifier's
`bound_names()` remains unchanged. A private `visit_surface_callable` owns
parameter/default and selected-body scopes. The Surface dispatch now handles
parsed `Func`, `Genfunc`, `Fn`, `Lambda`, and `Genfn` through
`classify_expr`. Func keeps pre/post/body. Genfunc keeps pre/body and omits
post from both scope collection and visits. Anonymous callable defaults and
bodies use parsed `ParamShape` and selected body. The raw Kernel handler and
classifier-error fallback remain unchanged.

Native unit coverage in the same file exercises string-key Array.isArray
metadata/body pairs, Genfunc post/body/pre pairs, same-name metadata/post
bindings that cannot hide actual body writes, ordinary Func post rejection,
all Fn/Lambda/Genfn protected defaults and real-parameter shadows, body-only
binding exclusion from defaults, and nested object/array alias, hole, and
rest leaves. The helper asserts exact protected-slot message and receiver
span. It also inspects parsed classifier `typed_params()` and shows the
external alias is present only in `bound_names()`.

`crates/lykn-cli/tests/protected_host.rs` adds valid Genfn metadata and
Genfunc ignored-post compile-plus-ESM controls (both print `41\n`) and
protected executable Genfn/Genfunc/Func writes. It preserves the original
`INVALID[0]`/`INVALID[8]` witnesses; adds exact receiver-span diagnostics for
new source fixtures; and runs Genfn/Genfunc body rejections with assertions
stripped. The derived observation count is `INVALID.len() * 3 + 4` (49).
`test/expander/lexical-regions.test.js` adds one actual package-compiler test:
public `lykn` metadata/post positives compile and execute to 41; real body
writes reject; Fn/Lambda/Genfn defaults reject global writes, allow a real
Array parameter shadow, and do not let a body-only Array binder hide a
protected default. No direct raw `validateProtectedHost` source call was added.
`crates/lykn-cli/tests/macro_dependencies.rs` updates the M6 expected public
population from 48 to 49, derived from current declarations in its four
selected test files: 5 + 6 + 17 + 21.

## Focused raw evidence and preserved failures

All focused and full invocations used
`XDG_CACHE_HOME=/private/tmp/lykn-b2a-correction04-cc/xdg`,
`NPM_CONFIG_CACHE=/private/tmp/lykn-b2a-correction04-cc/npm`,
`TMPDIR=/private/tmp/lykn-b2a-correction04-cc/tmp`, and
`DENO_DIR=/Users/oubiwann/Library/Caches/deno`. Exact commands, cwd, env,
stdout, stderr, and numeric status are in each named subdirectory of `raw/`.
No runtime cache or build tree was placed in the evidence directory.

* `raw/focused-native/` and `raw/focused-native-leaves/`: status 0; each
  selected native causal/helper test passed 1/1.
* `raw/focused-surface-pairs/`: first wider `cargo test -p lykn-lang surface_`
  attempt exit 101. The fixture assertion expected only `leaf`, but the real
  object header also binds `wrapper`; the parser reported both real leaves.
  This was a test-oracle mistake, not a contract conflict. It is preserved.
* `raw/focused-surface-pairs-retry01/`: status 0; 12 matching-filter tests,
  0 failed. Corrected classifier projection expects `wrapper, leaf`.
* `raw/focused-cli/` and `raw/focused-cli-retry01/`: status 0; 4 tests,
  0 failed, 43 rejection observations in the first generated matrix.
  `raw/focused-cli-retry02/` is the final native CLI matrix after adding the
  metadata/post scope-pollution controls: status 0; 4 tests, 0 failed, 49
  exact-route observations. Legal generator controls compiled and generated
  ESM printed `41\n`; stripped executable writes retained protected-slot
  diagnostics and preserved existing JS/declaration sentinels.
* `raw/focused-public/`, `raw/focused-public-retry01/`, and
  `raw/focused-public-retry02/` preserve the public progression. The original
  20-test public lexical file passed with explicit imports mapping `lang/` to
  current `packages/lang/` and `browser/` to current `packages/browser/`.
  The final source test has 21/21 passing; `retry02` includes public runtime,
  body-negative, and Fn/Lambda/Genfn default controls. This avoids the stale
  `project.json` staged-lang mapping for this focused source run.
* `raw/deno-format/`: exploratory `deno fmt --check` reported exit 1 for both
  the current lexical test file and the untouched HEAD version (same preexisting
  formatting differences in older imports/calls). The new test block is not in
  the formatter's reported diff. This formatter is not a project `make check`
  gate; the required Rust formatter gate passed. The initial current-file
  formatter output was streamed and truncated by the tool; the retry stores
  both complete streams and baseline comparison. This does not alter source.
* `raw/diff-check.status.txt` is 0. `raw/final-precommit-check/` records
  `cargo fmt --all -- --check && git diff --check`, status 0.

No behavior/design contradiction was found. The one failed focused assertion
is retained above; its source-supported correction was applied without changing
language semantics.

## Full check, post-check test-only delta, and M6

`raw/full-make-check/` records the exact `make check` invocation before the
public-only test addition. It completed status 0: release build, clippy,
`cargo fmt`, Lykn syntax/lint, fresh release CLI plus materialized workspace
artifacts, full Rust workspace tests (lykn-lang library 1197 passed), full
Lykn/Deno suite 1556 passed across 67 steps, and documentation suite 482
passed. The full suite included the then-current four-file M6 population of
48 tests. Its output/status and protected-host/M6 inner receipts are preserved.

After that full run, no production file changed. Two test-only paths changed:
`test/expander/lexical-regions.test.js` gained the public compiler regression,
and `crates/lykn-cli/tests/macro_dependencies.rs` changed the fixed M6 count
48→49. `raw/full-make-check/source-diff-pre-final-public.txt` preserves the
production plus native CLI source diff present during the full check; those
files remained byte-identical through commit (SHA-256: protected_host.rs
`b6a43e6d7d20935c4b4cac71445ca7f57e52eabc437ec6596a2f96a58fdfb0c3`, CLI
protected_host.rs `92e2e791c50010ba9327502ce755ee56e9f703ae473695cb16b92e7f372931bb`).
`raw/full-make-check/post-full-check-test-only-delta.patch` records the later
public test and M6-count delta. The added public test population received its
own focused and M6 replay; this CC does not claim the earlier full-check's 48
count included it. Separate Sol should run fresh final-source `make check`
before any B2-LX acceptance.

`raw/cold-m6-final/` is the replay on the final 49-test population. Command:
`cargo test -p lykn-cli --test macro_dependencies
m6_embedded_compiler_payload_matches_canonical_and_runs_from_cold_cache
-- --exact --nocapture`, status 0, 1 passed/13 filtered. The copied standalone
CLI starts without a canonical-package fallback, materializes into its owned
XDG cache and asserts that cache is cold before compiling. The standalone
working/cache tree is under the owned TMPDIR. Its Deno `DENO_DIR` remains the
existing shared cache and Deno uses `--cached-only`; “cold” here means a cold
compiler/materialization XDG cache. The browser adapter was freshly staged by
`make check` at `target/lykn/build/browser/`; it is not claimed cold. M6
compares all 14 canonical/embedded/materialized compiler modules and runs the
current strict four-file public population to `49 passed, 0 failed`. The exact
module list, generated JS, Deno config, commands and output are in
`raw/cold-m6-final/test-receipts/`.

## Commit and post-commit gates

Prepared message was parsed before commit with `git interpret-trailers
--parse`; the committed literal message was inspected afterward and has the
contiguous exact trailers `Co-authored-by: Codex <noreply@openai.com>` and
`Co-authored-by: Billo AI <ai-engineering@billo.systems>`.

Source commit: `f9be7cb85f62513f1624964fcc6773bffe4f66fe`; tree
`0ea27d21f759e0c068e8f655b14f43a1a5f20452`. Exactly these four authorized
paths were committed: `crates/lykn-lang/src/protected_host.rs`,
`crates/lykn-cli/tests/protected_host.rs`,
`crates/lykn-cli/tests/macro_dependencies.rs`, and
`test/expander/lexical-regions.test.js`.

Post-commit `raw/cited-paths/` status 0: 64 documents scanned on
`codex/qualified-adt-core`; 601 historical citations accepted. Post-commit
`raw/bundle-size/` status 0: baseline gzip 27,630 bytes; current browser bundle
46,600 bytes; delta +18,970 bytes; within the 80 KiB budget. The current
measurement was run against committed HEAD by `make bundle-size-check`.

Final source/build status is clean on branch `codex/qualified-adt-core` at the
commit/tree above. No planning/ledger edit, release, push, or external action
was performed. B2a correction04 is proposed-done for independent Sol review;
this is not CDC acceptance or B2-LX closure. The public raw-source validator
domain remains unchanged. B2-ID-NAME is still unanswered, dependent B2b is
held, and the rest of S03's lexical/nominal/purity criteria remain open.
