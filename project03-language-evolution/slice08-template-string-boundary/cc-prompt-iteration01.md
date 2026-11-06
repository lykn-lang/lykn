# CC iteration01 — encode decoded template values, prove both runtimes

Phase A is independently accepted in cdc-verification.md: ID-33 plus actual
source/runtime values resolve NE-C03 without a new language decision. Same
Luna6 High CC/Sol6.1 High CDC. Execute this narrow repair now, not more inquiry.
Source remains task codex/template-string-boundary@b841f71b; planning/source
ownership is yours after handoff. Other worktrees, frozen observer and pilot
remain read-only. No release integration, new dependency/backend or reader fix.

## Load changed requirements

Required-full: this prompt, current sibling plan/ledger and CDC Phase A record.
Reuse unchanged source/guidance intake at4700e286, qualifying the original cwd
as the review does. Required-section: actual native emit_template_text and its
three tests; canonical packages/lang/compiler.js makeTemplateElement plus
concat/emitMft callers; identical embedded compiler mirror and
expander/embedded.rs materialize/cache rules; public packages/lang/mod.js lykn
(strict default), packages/testing/helpers.js compile/compileBoth limitations.
Required-full six frozen run-01 P*.lykn inputs; test/forms/tag_test.lykn and
template-escape-convergence_test.lykn. Required-section Rust borrowed-input and
no-production-panic rules; JS anti-patterns/async/finally/Deno testing/no-eval;
testing behavior/negative controls/native gates. Retain prior actual reads where
unchanged; recover missing content, don't turn this into another full intake.
Append a short changed-contract readback in results before edits.

## Binding repair

Incoming string values are already decoded. Preserve their runtime characters;
encode their representation in generated JS rather than cooking escapes twice.
In native codegen/emit.rs keep emit_template_text's borrowed-str signature and
shared concat/ICU callers. Its per-character encoding is exactly:

| Input scalar | JS template source characters |
| --- | --- |
| backslash92 | two backslashes92,92 |
| CR13 | backslash92 then r114 |
| backtick96 | backslash92 then backtick96 |
| dollar36 | backslash92 then dollar36 (existing policy) |
| all others, including LF10 | unchanged |

Replace the misleading passthrough comment with the decoded-value/source-
representation rationale. In JS makeTemplateElement, use the same encoding:
double original backslashes FIRST, encode actual CR, then existing backtick/$
escaping; leave cooked equal to the original decoded input. Private local naming
is discretionary. Do not re-escape the inserted delimiter escapes afterward.
Sync crates/lykn-lang/embedded/packages/lang/compiler.js byte-for-byte from the
canonical changed JS file; include_dir! embeds this mirror in the CLI binary.
No new AST encoding layer, public API, reader transformation or compiler mode.

Reconcile the existing two native passthrough assertions with decoded-value
preservation, retaining their separate concat/ICU coverage and updating names/
rationale as appropriate. These manual AST Strings now receive the same value
semantics as reader-produced Strings. Update D2's contrary comment and strengthen
its emitted-text check to the correctly encoded literal, with a pointer to the
runtime regressions. Remove the stale tag-test deferral explanation; retain its
member-tag smoke coverage. No normalizer changes, silent test deletion, snapshot
acceptance or unrelated expectation updates. Report unexpected affected tests.

Tagged raw remains the post-expansion JS representation: for P6's decoded
backslash+n, both raw results must be scalars92,92,110; cooked P1 values remain
92,110. This deliberately changes the old printed/raw spelling, reconciling the
historical tests with ID-33. It does not promise original Lykn token spelling.

## Durable regressions before and after

Before any build can replace it, copy/hash-verify the current e69f67f4 baseline
binary into task target/lykn/tools/lykn-b841f71b/bin/lykn; never commit binaries.
Copy the six accepted run-01 P*.lykn sources byte-for-byte into
test/fixtures/template-string-boundary/, keeping names. No new payload family.
New crates/lykn-cli/tests/template_string_boundary.rs uses existing tempfile,
CARGO_BIN_EXE_lykn/default strict compile in each owned OS temp cwd, then actual
Deno modules with the Phase A minimal flags. Reuse accepted contract-test
mechanics, not its cases. Parse JSON stdout; assert exact field count and each
string's Unicode scalar array. P1–P5 all four fields equal their plan scalar
payload; P6 both raw fields equal92,92,110. All22 must run/pass after repair;
collect/report failures without silently short-circuiting remaining cases.
Actual compile/run errors are failures, never successful data or ignored tests.

New test/forms/template-string-boundary_test.js is a PRODUCT regression, not a
research helper. Import public strict lykn from lang/mod.js and existing assert
facilities. Read the SAME six fixtures from Deno.cwd()/test/fixtures/… . In an
async Deno.test with awaited case steps, compile via lykn(source), write the
generated module to an owned await Deno.makeTempDir(), then await
new Deno.Command(Deno.execPath(),{args:["run","--no-config","--cached-only",
"--no-npm","--no-remote","--deny-net","--no-prompt",modulePath],cwd:tmp,
stdin:"null",stdout:"piped",stderr:"piped",clearEnv:true,env:{DENO_DIR:ownedCache,
NO_COLOR:"1",DENO_NO_UPDATE_CHECK:"1"}}).output(). Assert code0/empty stderr,
JSON shape and the same22 scalar values. Clean up only the owned temp directory
in awaited finally. No eval/newFunction/normalizer/lax compileBoth substitute.
These Deno2.9.6 APIs were checked via the local pinned `deno types` declarations.
Include source/generated JS/raw output in useful failure diagnostics before
cleanup so an old-compiler failure remains inspectable.

Commit fixtures/tests first; establish real expected-red native AND JS runtime
evidence on the unfixed source (initial JS source was only inspected). Existing
fresh-artifacts is the prerequisite for lang/ imports, not a semantic bypass.
Then commit the narrow fix/reconciled assertions and run green22/22 per backend,
focused kernel/D2/tag and accepted contract17 regressions. Retain authoring/setup
errors separately; do not call them red compiler proof. Reuse unaffected accepted
records with explicit applicability; preserve every raw attempt under unique names.

## Packaged copy and full gates

Use existing `make fresh-artifacts`, then the existing focused route
`LYKN_BIN=./bin/lykn ./bin/lykn test test/forms/template-escape-convergence_test.lykn`
under explicit fresh owned XDG_CACHE_HOME and
DENO_DIR=/Users/oubiwann/Library/Caches/deno (accepted existing cache). This
normal macro route materializes the embedded packages; compare the resulting
XDG lykn/embedded/0.6.0/packages/lang/compiler.js to canonical AND mirror bytes.
Do not delete/modify the old global cache or assume same-version cache refresh.
Version-only cache invalidation is a separate NE-C04 candidate, not this patch.

At committed source HEAD run full unfiltered make check and cited-path gate.
For the full gate use a fresh owned XDG_CACHE_HOME, that same explicit DENO_DIR,
and ignored task npm_config_cache. Record these environment differences and
actual hashes; no HOME override, tool install, test filtering or dependency update.
Legacy npm compatibility checks remain included. No extra docs-test rerun after
make check. No auto-accepted snapshots or bypass on unrelated gate failures.

## Exact paths and return

Source writes ONLY these thirteen paths:

- crates/lykn-lang/src/codegen/emit.rs
- packages/lang/compiler.js
- crates/lykn-lang/embedded/packages/lang/compiler.js
- test/forms/template-escape-convergence_test.lykn
- test/forms/tag_test.lykn
- crates/lykn-cli/tests/template_string_boundary.rs
- test/forms/template-string-boundary_test.js
- test/fixtures/template-string-boundary/P1-backslash-n.lykn
- test/fixtures/template-string-boundary/P2-backslash-quote.lykn
- test/fixtures/template-string-boundary/P3-line-feed.lykn
- test/fixtures/template-string-boundary/P4-carriage-return.lykn
- test/fixtures/template-string-boundary/P5-backslash-backtick-dollar.lykn
- test/fixtures/template-string-boundary/P6-tag-raw.lykn

No other production/test/helper/lock/manifest/cache-policy changes.
Planning writes only existing four CC outputs and actual new raw evidence under
artifacts/repair/run-01/ (later unique attempts only on real failures). Do not
change reviewer/prompt/parent records. Exact-path commits using a real text
message file; verify raw contiguous trailers immediately; no history rewrite.

Return source/plan commits, actual red/green/runtime/kernel/packaging/full-gate
receipts, unchanged fixture checksums, scoped clean status, lock/compiler hashes
and explicit compatibility/remaining-cache caveat. All ledger statuses remain
open except CDC-done TE-01. Relinquish ownership. STOP before frozen pilot:
CDC independently accepts this repair and required gates before the next phase.
