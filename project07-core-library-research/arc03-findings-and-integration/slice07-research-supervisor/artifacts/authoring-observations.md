# Supervisor authoring observations

2026-09-13, CC/Codex/Sofie. Final CC handoff; independent CDC pending.
The fresh immutable build matches the accepted 4dded88 CLI and Deno 2.9.6
hashes. Both Slice04 packets extracted and their three adaptation-source hashes
match CDC. The inherited Slice04 four-failure budget remains separate.

## Retained conditions

1. `gates-01/supervisor.lykn`: excess closing parenthesis in the local
   `join-bytes` result binding; check reported unexpected `)` at 178:10.
   Cases and audit passed source gates. Authoring error; no compiler defect
   claimed from this syntax failure.
2. `gates-02/supervisor.js`: all source gates returned zero, but emitted review
   found `COMPILE_ERROR` throws for statement-only `if` in expression contexts
   and an invalid `return throw`. This repeats the known JSCF class; source
   gates alone are insufficient. Replaced affected forms with helper calls
   and explicit expression alternatives. No generated-JS repair.
3. `gates-03/supervisor.js`: source gates returned zero and no COMPILE_ERROR
   marker remained, but the deadline expression emitted a synchronous IIFE
   containing `await`. Extracted that branch to a named async function.
   The original emitted bytes are evidence; no runtime was attempted.
4. `gates-04/supervisor.js`: emitted review found
   `await files(root, "outputs").concat(await files(root, "inputs"))`, which
   calls `concat` on the pending Promise. The intended Lykn form threads an
   awaited snapshot into concat. The concrete source correction is to await
   each snapshot into a named binding, then call concat on the resulting array.
   This is a retained emitted-semantics failure, not an observed file result.

At condition four, correction runs paused at the original budget boundary.
The operator explicitly authorized: **“Continue Slice07 with an eight-failure
maximum.”** This same bounded unit continued; no verification requirement or
Slice04 history changed. The await-order correction uses named snapshot bindings.

5. First runtime condition (`work/`): wall/output controls passed. The RSS stop
   succeeded but compilation had already completed despite 100,000 comment
   lines, so its semantic check failed. Replaced comment-only padding with
   25,000 distinct flat bindings and froze a new condition in `work02/`.
6. Second runtime condition (`work02/`): all external/native/observer checks
   passed, but cancel-before's marker appeared after the preceding process
   snapshot. The supervisor rejected its as-yet-unregistered PID, killed the
   child and then repeatedly revisited the marker until the cleanup deadline.
   The final correction takes a fresh ownership snapshot when a marker appears
   and stops checkpoint polling after termination. It also explicitly records
   any error-evidence truncation. `work03/` and the fresh `replay/` both pass.

Final count: **six failed source/control conditions**, below the operator's
eight-failure maximum. Nine final source gates passed; emitted output was
inspected and reproduced byte-for-byte in fresh replay. Primary and replay
each contain 33 successful process-attempt assessments and five negative-audit
controls. Earlier attempts remain separate evidence, not replacement results.

Separate setup error: both initial packet extractions targeted a sibling of
the working directory while `--allow-write` covered only that directory.
Both correctly returned NotCapable. The retry named each exact destination
grant and passed 2,301 and 471 extraction checks. These were setup attempts,
not SH permission controls or source failures. Both streams are retained.

Another command/protocol mistake is retained: negative-audit execution began
before the failed cancellation result had been inspected. It rejected one
altered observation record, then failed because no valid checkpoint existed.
That incomplete invocation is not a completed negative-control suite. The
final negative mode requires all four positive-group markers first.

## References and method

The installed collaboration-framework, project-management README and closing
guidance, work-verification/row-closure, scientific-methods controls/confounds
and evidence-capture guides were consulted. The installed Rust guidance was
already operator-authorized; no source Rust was edited.

Pinned 4dded88 references: `assets/ai/SKILL.md` selected sections (output was
truncated, not a claim of full coverage), anti-patterns summary, core idioms
IDs 01–04, error handling IDs 01–04, async guide opening/event-loop/Promise
sections and cancellation/stream sections. Project/arc plans and ledgers,
full Slice07 open set, Slice04 resumed preparation/CDC, RP01, FM01 R rows and
selected resource/file and launcher CDC evidence informed the work. This is
not a blinded guide experiment. Earlier conversation context and retained
programs were known inputs.

Lykn owns research-source authoring. Shell/Git/Cargo supply isolated exports,
builds, source gates, byte copies and exact command recording. The generated
JavaScript is inspected as evidence and never edited. Package execution,
source correction, dependency adoption and human code-shape acceptance remain
outside this prerequisite's claimed results.
