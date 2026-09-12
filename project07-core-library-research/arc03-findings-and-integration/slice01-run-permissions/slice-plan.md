# Slice01 — Explicit run permissions

Status: **CC proposed-done; awaiting CDC**. Expedited Mode.
See [closing-report.md](closing-report.md) and [RP-B01](artifacts/build-receipt.md).
All six ledger rows remain open; JSON execution remains gated.

## Goal and contract

Repair D-2609-PERM: both `lykn run` paths inject `-A`, contrary to governance.
[Arc01/Slice01 CDC](../../arc01-format-runtime-evidence/slice01-baseline-and-protocol/cdc-verification.md)
confirmed the source finding and current binary drift. Produce a traceable
corrected build so JSON trials can use honest narrow permissions.

Keep `lykn run [OPTIONS] FILE [ARGS]...`:

- Remove unconditional grants in both branches. No explicit permission option
  means no synthesized grant; Deno retains its ordinary prompting policy.
- Expose long `--allow-read/write/net/env/run/sys/ffi/import` and corresponding
  `--deny-*` forms (each slash-separated name denotes its own option).
  Accept bare flags or `=LIST`, requiring equals for scoped optional values
  so FILE is never consumed. Preserve and test repeated scope semantics.
- Support explicit `-A`/`--allow-all`, `--no-prompt`, `--cached-only` and
  `--frozen[=true|false]`. These forms exist in inspected Deno 2.7.7 help.
- Put requested runtime options before the emitted/selected program in Deno
  argv. After FILE, every argument belongs to the program, including strings
  resembling runtime flags. Preserve the documented `--` script separator.
- Preserve effective config/build behavior and child exit status. No shell
  interpolation, arbitrary Deno passthrough, new dependency, or silent grant
  expansion. Unsupported underlying Deno options must surface honestly.

These flags constrain the launched program, not the compiler's own file access.
Permission-sensitive controls use explicit `--no-prompt`.

## Exact source scope

Worktree `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x`, branch `release/0.6.x`.
Inspected head `2a0cabf`; refresh and preserve concurrent work, never reset it.

```text
crates/lykn-cli/src/main.rs
crates/lykn-cli/tests/run_permissions.rs
docs/guides/15-lykn-cli.md
docs/guides/12-deno/12-01-runtime-basics.md
```

New integration tests use isolated synthetic fixtures, retaining Lykn source
as test strings; the JS route can use compiler-generated JS. No repaired
generated output. Amend scope explicitly before needing another tracked file.
No main edits, release propagation/rebase, package adoption or publication.

## Artifacts and verification

Durable evidence: `artifacts/reproduction.md`, `artifacts/validation.md`, and
`artifacts/build-receipt.md` in this slice. Retain original/revised argv,
commands, outputs, source commit/tree and dirty manifest, binary hash, Deno
identity and build settings. B01 remains historical; corrected build is a new
condition, never silently substituted.

1. Process-level argv tests cover standalone/workspace `.lykn` and generated
   `.js`, absent grants, requested flags, repetition, paths containing spaces,
   explicit -A, `--`, flags after FILE, invalid options and nonzero exit.
   Capture original failing argv using an isolated fake child when useful;
   do not run user workloads under the old grant.
2. Real Deno controls: read/write denied without grants under no-prompt;
   scoped success; outside-scope denial; explicit deny overriding allow;
   program arguments cannot grant permissions. Argv checks alone do not prove
   enforcement. All fixture paths remain in a disposable temporary root.
3. Check config preservation and cached/frozen option placement without new
   package adoption. Full graph/offline evidence remains Arc01/Slice04.
4. Run targeted `run_permissions` integration tests, then canonical `make check`
   and `make check-cited-paths`. Inspect Make help first. Do not repeat doc
   tests after make check, weaken assertions or auto-accept snapshots.
5. Build the corrected binary with a source/tree-to-byte receipt and fresh
   help. Update the two guides for scoped grants, no-prompt failure and script
   args. General LINT/NPMB guide corrections remain separate.

[ledger.md](ledger.md) is the exit contract. CC commits source then planning,
reports proposed-done, and CDC verifies before lifting the JSON gate. The test
runner's separate implicit grants remain Arc03/Slice02; do not declare all
toolchain permission behavior fixed.

## Version History

- 2026-09-12 v1.1: CC delivered the scoped source repair and attested gates/build
  receipt. Independent verification and JSON launch prerequisite remain open.

- 2026-09-12 v1.0: Opened from D-2609-PERM; fixed CLI contract, paths,
  process/denial tests, guide updates and corrected-build receipt.
