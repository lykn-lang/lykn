# SH01 baseline and protocol

Frozen before each named condition on 2026-09-13. CC/Codex/Sofie;
[results](results.md) report the completed primary run and fresh replay.
Operator authorized an eight-failure maximum for this same
bounded unit, with four prior failed drafts retained. No verification requirement
changed. Source tree and shared worktrees are preserved.

Immutable source `4dded883bbd321d19635e6fce233343f33803f9e`, tree
`218b085176053f1273642496cf75d7691c399f6e`, freshly exported from the planning
root and built with `cargo build --release --locked` in isolated scratch.
CLI SHA-256 `d4a7028ebba234ffcd6fdb544c256489d22b840da2e94e0aa833b0520c834326`;
Deno 2.9.6 SHA-256 `2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74`.
Actual root: `/private/tmp/lykn-p07-sh.TGzSnZ`; final seed `work03/`, with
superseded `work/` and `work02/` preserved and a separate `replay/`.
Host macOS arm64; exact version, build streams, pins and preflight are retained.
`/bin/ps` observation preflight passed through the authorized host route.

The retained [inputs.json](inputs.json) freezes 19 variants / 33 attempts:
five external controls, nine native variants twice, three observer/concurrency
variants twice and two cancellation variants twice. Five separate synthetic
negative-audit controls follow the live evidence. Cases, supervisor and audit
passed nine source gates; emitted code was inspected. Exact frozen source
hashes and per-variant flags are in the manifest and packet.

Every attempt has a fresh cwd, HOME, TMPDIR, DENO_DIR, input/output directories,
empty native project config and matching version-5 lock. No imports or package
resolution. Null stdin, no prompt, frozen/cached-only execution and cleared
environment; only PATH, HOME, TMPDIR, DENO_DIR, NO_COLOR and
DENO_NO_UPDATE_CHECK are supplied. Narrow grants belong to each declared
operation. Supervisor grants do not transfer to children.

Default operation stop threshold 9s leaves cleanup headroom within a 10s total
deadline. Retained stdout/stderr cap 16MiB, sampled process-tree RSS 512MiB;
controls lower the wall threshold to 500ms, output cap to 64KiB, RSS threshold
to 1KiB, and parent-exit wall threshold to 1.5s. The early-RSS control prefixes
25,000 distinct flat bindings to the same candidate source to expose the
precompile window; success requires that compiled output actually be absent.
The first 100,000-comment-line stimulus failed that check and is retained as
condition five. The substantive stimulus passed in all subsequent controls.
It allocates
no large runtime payload. A failed absence check stops the control family.

Process samples are limited to 512, tracked processes to 32, retained errors
to 16 (messages 1,024 characters), kill receipts to 16. Parent/reader/writer
protocols use at most three workers, 5s internal deadlines, 512 reader samples,
10ms reader polls, 65,537-byte complete candidates and a 32,768-byte partial
write. Sampled RSS is not a hard memory bound. Host ps/kill are trusted local
observation infrastructure; these controls do not prove behavior if the host
kernel or observation utility itself hangs.

Five external controls run first: wall, output, RSS before compiled output,
nested child retaining inherited pipes after root exit, and injected observation
failure after child registration. The normal watchdog continues until root,
streams and owned processes settle; it checks observed PID/start-time identity
before kill and never calls kill with an empty target set. The injected failure
is caught and cleanup uses a fresh, working host observation call.

Native permissions then establish actual NotCapable and expected file bytes.
Observer and cancellation groups require prior verified markers. Each marker
is written only after every group attempt passed the semantic audit, including
live file hashes/modes. Before/aftermath and checkpoint bytes remain in the
attempt root; no cleanup repairs them. Reaching a bound or invalid observation
stops that group, leaving all absent IDs/repetitions owed. No prerequisite
attempt is a DB attempt, and no no-partial-read observation proves universal
atomicity, conflict policy or crash durability.

Raw record, stdout/stderr hex and hashes, exact argv/environment, process samples,
termination receipts, source/compiled identities, before/after config/lock and
fixture bytes are retained before semantic interpretation. Negative controls
modify labeled record copies only and require rejection for the intended reason.
Independent CDC remains required for all six SH criteria. Slice04 retains all
eight DB rows, 47 candidate IDs/expansions, 36 unsupported resource cells, 28
gated documents and existing source/book/guide/ADT/human owners.
