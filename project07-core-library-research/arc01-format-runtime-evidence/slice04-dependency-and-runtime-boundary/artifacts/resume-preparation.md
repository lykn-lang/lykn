# Resumed preparation and explicit re-slicing

CC attestation, 2026-09-13; independent verification pending. This is a
preparation handoff, not DB closure. Four source-authoring failed conditions
are retained, plus a distinct failed command/configuration condition below.
The slice plan requires re-slicing before exhausting five failed corrections.
Supervisor adaptation and preflight now have a bounded owner:
[Arc03/Slice07](../../../arc03-findings-and-integration/slice07-research-supervisor/slice-plan.md).
All research requirements remain with Slice04; its budget is not reset.

## Actual preparation

- Fresh isolated source export/build: `4dded883bbd321d19635e6fce233343f33803f9e`,
  tree `218b085176053f1273642496cf75d7691c399f6e`; `cargo build --release --locked`.
  CLI SHA-256 `d4a7028ebba234ffcd6fdb544c256489d22b840da2e94e0aa833b0520c834326`.
- Live Deno 2.9.6 SHA-256
  `2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74`.
  Shared source binaries/worktrees were not changed. The initial export from
  the project subdirectory failed; export from the planning root succeeded.
  Both build receipts and the explanation remain in the packet.
- Full d0bb981-to-4dded88 interval: 30 paths, including embedded compiler,
  Cargo/JS package metadata, workflows and guides. Paths, commits and diffstat
  are captured; this is not the still-owed complete toolchain graph inventory.
- Historical packet restored through corrected, restricted `lykn run`:
  460 files / 2,301 extraction checks. These verify retained bytes, not 460
  fresh research executions. Original packet SHA-256 remains
  `bef1eb72d43e13edc1491e87d481d88c12c79b4bca392b2711f263126a51c60d`.
- Candidate cases and package programs passed fresh check/lint/compile gates.
  Adapted supervisor initially failed at `230:10` with an excess `)` near its
  compiled-output hash field. Both sources and all diagnostics are retained.
  Removing that parenthesis made its three gates pass. This is failed source
  condition **4**, not an additional compiler defect or a runtime result.
- Host `/bin/ps -axo pid=,ppid=,rss=,stat=,lstart=` preflight succeeded through
  the authorized host route. This does not establish termination or cleanup.
- A supplemental native `published` audit from `seed/` failed before its body:
  `{}` config and the merged package-workspace lock disagree under frozen
  mode. `logs/published.*` preserve this additional command/configuration
  mistake. No new 188-file verification is claimed. That failed lock was not
  repaired. Packet tooling uses a separate native root with its own config
  and version-5 lock; frozen mode remains enabled and lock bytes are unchanged.
- Two current JSR version API responses were retained as static metadata;
  exact URLs and retrieval date are in `meta/resume-commands.md`. Neither
  establishes an immutable upstream lineage or a permissible execution graph.

**Zero resumed supervisor controls, harness controls, permission cases,
replacement/fault trials or resource measurements ran.** Package evaluation
did not occur. Neither `inputs.json`, a native child lock, nor a warm package
cache has been prepared in `seed/`. Its 47-row inventory is still candidate-only.

## Review findings and re-entry

These are source-review risks, not reproduced runtime defects:

1. An early RSS stop may precede compiled output; unconditional hashing then
   loses the result. Represent absence explicitly and test that condition.
2. Guard an empty kill target list; verify process identity, descendant capture,
   bounded termination and absence of survivors, including parent exit.
3. Harness/permission marker creation must require semantic checks. An exit
   code alone does not establish a partial-write observation or `NotCapable`.
4. Original concurrency candidate flags omit the explicit child-CLI run grant.
   Freeze parent/worker authority separately before evaluating concurrency.
5. Native/package configs, locks and caches must be separate exact fixtures.
   Review checkpoint paths, symlink handling, worker bounds, timeout paths,
   cancellation byte checks and cleanup before control execution.

Arc03/Slice07 must independently close its bounded tooling contract before
Slice04 resumes. A source-gated draft is not a verified supervisor. DB-01–08
remain open and unchanged. All 47 IDs in original `inputs.json` and the resumed
`seed/candidate-inputs.json` remain owned by Slice04, together with their full
required expansions; no old or prerequisite run silently becomes a DB attempt.

| Retained obligation | Owner and exact re-entry |
| --- | --- |
| R-01 baseline/help/argv/minimal and source drift | Slice04 after supervisor CDC; freeze and execute actual conditions |
| R-02 five package inventories and toolchain | Slice04; complete runtime/type/dev/test/example graphs, URLs/checksums/licenses/ancestry before permitted evaluation |
| R-03 resolution/lock faults; R-04 two-cache prefetch/warm/cold | Slice04; freeze complete configs/locks and resolve reviewed graphs before trials |
| R-05 permissions | Slice04; import the verified native harness, then run the full native/package denial matrix |
| R-06 replacement/link/mode/concurrency; R-07 cross-filesystem/injection/cancellation | Slice04; verify controls and readiness, two fresh attempts, retain pre-cleanup bytes; use only an already mounted suitable volume |
| R-08 all 8 J-16 and 54 Y-13 IDs plus representative replay | Slice04; reconcile exact old attempt IDs, preserve 36 unsupported cells and overlapping reasons; one warm-up plus five measurements per new recipe |
| R-09 available supported pair | Slice04; identify an already installed supported pair or record unavailable with re-entry; removed 2.7.7 is not a live comparison |
| 28 Y-14 document variants and document-route decision | Slice04 owns compatible-route evidence or an actual bounded design prerequisite; Arc01/Slice07 retains execution only after that gate |
| Source/guide/book/ADT/operator code-shape outcomes | Existing Arc02/Arc03 owners; no source repair, policy acceptance or human acceptance inferred |

## Packet and replay

[resume-raw-transcript.txt](resume-raw-transcript.txt) is a lossless native
Lykn-generated JSONL packet: **94 files, 1,040,715 decoded bytes**;
SHA-256 `44d74cbd889a462cfeaa174057b2bbc075e037528f07c697a7e748443c46ef93`.
Packing passed 282 checks; extraction to a fresh destination passed 471 checks.
The original [raw-transcript.txt](raw-transcript.txt) is unchanged and separately
required. No nested packet or source build tree is duplicated in this packet.

Inventory: native `audit.lykn` plus its config/lock; `meta/` pins, source
interval, worktrees, opening prompt/ledger and host observation; `logs/` failed
and successful setup/restoration plus frozen-lock failure and first-pack
receipts; `seed/` candidate cases/package/supervisor/audit source and emitted
files, candidate manifest, exact inherited inputs, configs/lock, two static API
responses, and both source gate directories. `packet-files.txt` is the closed
94-path inventory. Final pack/extract outputs were respectively:

```text
{"checks":282,"files":94,"bytes":1040715,"result":"packed"}
{"checks":471,"files":94,"result":"extracted and verified"}
```

Captured replay uses the already committed `artifacts/audit.lykn` (unchanged),
not package code. From a fresh isolated directory with the accepted CLI at
`$DB_CLI`, absolute packet path `$DB_PACKET`, and copied `audit.lykn`:

```sh
mkdir home tmp cache
printf '{}\n' > project.json
printf '{"version":"5"}\n' > deno.lock
env -i PATH=/opt/homebrew/bin:/usr/bin:/bin HOME="$PWD/home" \
  TMPDIR="$PWD/tmp" DENO_DIR="$PWD/cache" DENO_NO_UPDATE_CHECK=1 NO_COLOR=1 \
  "$DB_CLI" run --no-prompt --cached-only --frozen=true \
  "--allow-read=$DB_PACKET" "--allow-write=$PWD/extracted" \
  audit.lykn extract "$DB_PACKET" "$PWD/extracted" </dev/null
```

This route was tested in isolated scratch with the accepted CLI and final
packet; extraction destination must not exist. The native lock remained
SHA-256 `e6f8e7f253a8e419d745ffca442817365cbfc1574c1a462e2f19bc2b5956a6cd`.
To reproduce preparation, export the pinned source from the planning root,
build locked, verify both binary hashes, and replay retained source gates.
**Fresh matrix replay is not available:** do not run the draft supervisor.
Its concrete repair/preflight assignment is Arc03/Slice07.

The literal captured-replay command was additionally run from a second fresh
directory against the planning packet: 94 files / 471 checks, exit 0. The
unchanged native planning audit passed 27 checks over all 16 changed paths and
128 links, including byte-identical preservation of the eight DB ledger rows.
Its existing six-LC-row check still targets the closed launcher ledger; it does
not verify the new SH criteria. The six SH opening rows were inspected directly.
These are CC checks, not independent CDC or runtime capability verification.

## References and limits

Resumed reads: active Slice04 prompt/plan/ledger and project/arc plans/ledgers;
launcher CDC; original cases/audit and retained supervisor; FM01 R rows and
RP01 execution/evidence sections; selected compiler's `assets/ai/SKILL.md`,
selected anti-patterns/async/project-structure guidance (not full-guide coverage);
installed scientific-methods and evidence-capture guidance, work-verification,
project-management README/scales/planning/closing/plan-change guidance. Earlier
reads remain in [authoring-observations.md](authoring-observations.md).
The already authorized installed Rust guidance remains the substitution.

## Bubble-up to the arc

Slice04 has not delivered the assigned runtime/dependency capability. Its
supervisor adaptation and full research inventory exceeded the remaining
authoring headroom. Arc03/Slice07 now isolates tooling verification, retaining
four historical source failures and the separate configuration mistake.
All DB rows and all research/document/source/human owners survive. CDC may
verify this routing and packet; that is not closure of Slice04 or its new
prerequisite. The full graph/document-route work remains explicitly owed here.
