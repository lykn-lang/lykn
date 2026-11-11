# S03 A correction02 — complete the materialized dispatch oracle

Same Luna 6 High CC and separate Sol 6.1 High CDC, standard Autonomous Mode.
Implement this bounded completion after root's explicit source/build handoff.
The independent correction01 review holds 16dcd64f: production dispatch and
reference fixes passed focused controls, but the materialized test omits the
required multi-clause fixtures and one dispatch diagnostic uses a synthetic
span. Do not start B/C, nominal syntax or purity work.

## Homes and rules

Source `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`,
`codex/qualified-adt-core`, baseline
16dcd64f09946b6bd484a893dcefa16c01e1b431, tree
6f36076d83c0f87b5e038be99604b8bc7eb5d531. Recheck clean state after Sol returns
ownership. Planning is `/Users/oubiwann/lab/lykn/lang/.worktrees/planning`;
root owns its Git/index. No release changes/integration, push, dependency,
publication/tag, remote CI or subagents. Preserve original attempts/commits.

No Python execution is permitted and there is no parity exception. No Python,
Ruby, Fennel or handwritten JS research helpers, even temporary ones. Research
probes/helpers use Lykn. Compiler implementation and normal product Rust/JS
tests are authorized. Use shell/native CLI only for direct invocation and
simple file lifecycle. Read AGENTS, initial/correction01 prompts and current
CDC record; load relevant Rust, JS/Deno and testing guidance. Root inspected
the exact functions below at 16dcd64f. Return a concise readback, then implement.

## Binding implementation

1. In `test/forms/embedded-adt-pattern.test.js`, keep the recursive-pattern,
   macro-hygiene and `host-reference-shadowing` fixture tests. Add separate
   actual runtime tests using `assertRuntimeFixture` for BOTH existing
   `dispatch-array-module-shadow` and `dispatch-array-parameter-shadow` fixtures.
   Their independent exact expected stdout is:

   ```text
   ["array","string",["TypeError","choose-value: no matching clause for arguments"]]
   ```

   Include its trailing newline. Verify each fixture's actual source/committed
   native oracle before editing; report a discrepancy rather than inventing an
   expectation. New test names must identify multi-clause dispatch and their
   module/parameter distinction. The current test named guard/dispatch runs
   only single-clause guards; make that title accurate. All compiler imports
   remain `lang/`, so M6's existing explicit import map selects the real cold-
   materialized package. Canonical relative imports are not this proof.
   Assert child runtime stderr is empty on success as well as exact stdout and
   exit zero; retain existing failure propagation and temp-file cleanup.
2. In native `emitter/forms.rs`, `build_dispatch_check` currently assigns
   ArrayIsArray metadata `expr.span()`. Its production `arg_access` is created
   with `list(...)` and has a synthetic default span. Add an explicit `span:
   Span` parameter to this private helper and pass actual `param.span()` from
   `emit_func_multi`'s dispatch loop. Use that supplied span on the owned ref.
   Update its direct unit callers with their intended test span. Keep the
   generated expression and dispatch behavior unchanged. Add a parsed-source
   multi-clause public `emit_form` rejection test in `tests/emission_results.rs`
   that proves the diagnostic points to the real array parameter/type site,
   not Span::default. Retain the existing single-clause span, no-request,
   complete-unit and old ordered-call controls. No global test shim or further
   structural-test migrations are needed.
3. Preserve the 44 scoped internal-producer tests. Correct the documentary
   census by appending a clarification, not rewriting prior attestation:
   202 total test sections, 44 local raw aliases, 158 untouched remainder;
   independent source census finds 125 of that remainder containing direct
   public emit_form calls and 33 testing helpers/other internals. Thus 158 is
   not the number of public API tests. Keep static census distinct from
   actually executed integration controls. Also append any available exact
   first-span/fixture-draft failure details from correction01, identifying
   missing raw logs explicitly; do not reconstruct them.

These are source/test completion of the issued boundary, not permission to
change public macro semantics or add a public assertion-stripping option.
Public source stripping does not exist at this A baseline; native checked and
stripped dispatch controls remain separate. No new runtime dependency or data-
module layout change belongs here. Existing browser run/load limits remain.

## Gates and handoff

Run focused emission_results and dispatch-builder tests, then the full
materialized M6 test with its existing seven-file comparison and copied CLI /
cold cache / no-canonical-fallback assertions. Its strict public test process
must now actually run all five embedded runtime cases. Retain actual command,
exit and stdout/stderr receipts. Re-run both native dispatch fixtures in
checked/stripped modes if affected by the span change; preserve the original
four-condition failure and subsequent correct evidence at their own pins.

Use explicit `DENO_DIR=/Users/oubiwann/Library/Caches/deno` AND task-owned
npm_config_cache; owned XDG/tmp for isolation. After focused checks pass, run
`make check` and the 80 KiB `make bundle-size-check`; commit exact source paths,
then run committed-HEAD `make check-cited-paths`. No duplicate docs outside
make check. Keep focused receipt environment variables local to their focused
commands; a full gate log is sufficient for unrelated unchanged populations.
Do not delete/consolidate any existing receipts based on file count, amend
history, weaken checks or reformat legacy files wholesale.

Expected source paths are only `test/forms/embedded-adt-pattern.test.js`,
`crates/lykn-lang/src/emitter/forms.rs` and
`crates/lykn-lang/tests/emission_results.rs`, plus a directly necessary caller
of the changed private helper if actual inspection finds one. Commit named
paths with `git commit --only`, adjacent Codex/Billo AI co-author trailers in
one body, and check `%B`. No source module/policy/runtime change beyond the
diagnostic span is expected.

Append the correction checkpoint and census clarification to closing-report.md
and use artifacts/increment-a/correction02/ for new useful receipts. Prior
artifacts stay intact; source and review failures keep original pins. Root owns
all planning staging/commits/parent status. Return exact commit/tree, clean
state, actual denominators/warnings/failures/unrun checks and source/build
ownership for independent Sol review. CC success accepts no LC row and starts
no dependent B/C work.
