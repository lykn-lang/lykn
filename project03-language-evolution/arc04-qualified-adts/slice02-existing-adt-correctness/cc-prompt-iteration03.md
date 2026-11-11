# S02 correction: deliver the repaired embedded compiler

Continue Luna 6 High CC, separate Sol 6.1 High CDC, Autonomous Mode, on the
same source branch/worktree. Source candidate
`7b09a4e119fb841f950111217a07d5d8e833c220` is committed and clean but not
accepted. All five PC rows remain open. The initial CC report and Sol's
read-only hold are retained in `closing-report.md` and `cdc-verification.md`.

No Python execution is permitted. No Python/Ruby/Fennel/handwritten JS
research helpers, including temporary ones. New research probe/orchestration
logic uses Lykn; normal product Rust/JS implementation/tests and direct native
CLI/file lifecycle are authorized. No new dependency, merge/push, publication,
qualified-ADT implementation or unrelated completion redesign.

## Required delivery correction

Sol RV-01 identifies a real packaging gap: native
`crates/lykn-lang/src/expander/embedded.rs` embeds
`crates/lykn-lang/embedded/packages/lang`, not canonical `packages/lang`.
The initial source commit repaired only the canonical public compiler. Its
embedded binding/classifier/expander-core/surface-helpers remain at baseline,
and its new compiler-private-atoms module is absent. The prior full gate does
not prove the installed/materialized route. Root's source-ready recipe also
missed this duplicate delivery home; retain that preparation gap.

1. Synchronize these five owned compiler files into the real embedded payload,
   preserving canonical source as authority. Use direct file copy for this
   lifecycle operation; do not introduce a research sync helper. Preserve the
   actual standalone package config/lock and self-contained crate publication
   contract. Don't point include_dir outside the crate to bypass delivery.
2. Add a meaningful product delivery/drift regression using existing CLI
   macro/embedding test infrastructure, especially
   `crates/lykn-cli/tests/macro_dependencies.rs`. It must catch stale changed
   payload bytes and a missing transitive private module. Use an owned fresh
   XDG cache and the actual built CLI to materialize the embedded package;
   compare relevant canonical/embedded/materialized bytes rather than running
   only canonical imports. Verify the actual materialized strict public path
   executes nested and zero-field controls and a private-name/macro control.
   A standalone copied binary/owned cwd should establish no dependency on
   source-tree package fallback. Reuse fixtures and existing recorded-process
   harness; don't build a new evidence framework.
3. Test fresh materialization explicitly and state its cache conditions. Do
   not silently claim a content-addressed or same-version warm-cache upgrade
   contract; existing readiness is version-based. A broader cache redesign
   needs separate disposition rather than an incidental constant bump.
4. Run focused delivery/regression checks, then required complete source gates
   on the corrected candidate. Commit only exact named paths with the existing
   trailers. Run cited paths on committed HEAD; repeat browser measurement only
   if relevant canonical/browser inputs changed (otherwise justify retention
   of the recorded 7b09a4e result against the actual delta).

## Evidence and handoff

The initial CC report is attested prose. CC confirmed no raw gate/replay logs
were saved under its temporary home. Preserve available source/generated files
and the report's actual observations; do not fabricate historical logs or call
a reconstruction the original failure. Its source/control origins and stated
stdout remain useful evidence. Add the omitted setup/Cargo-filter and focused
assertion corrections to the historical narrative where known.

Capture useful bounded final-gate/delivery/original-control runtime receipts
under this slice's `artifacts/` (or temporary logs copied there). Existing
recorded-process helpers suffice. A small log set/archive is justified to
retain fresh exact commands, statuses, stdout/stderr and generated output for
the final independent review and exposed protected-return interaction; no
binary/source archive, per-file inventory or bulk reconstruction is requested.
Record actual tool/binary/source pins. Later independent reproductions must
be identified as fresh, not substituted for missing original logs.

Append a corrected-candidate section and current status to canonical
`closing-report.md`; preserve its initial7b09a4e report and Sol's RV-01 hold.
Include exact changed source paths, planning paths/artifact inventory, all five
PC proposed dispositions, gates and retained/repeated evidence rationale.
Leave acceptance and parent ledgers to Sol/root. Source and planning ownership
are yours for this bounded correction and close report/evidence only; do not
edit `cdc-verification.md` or parent plans. Return ownership explicitly after
scoped source/planning commits and clean status. The prior root note about no
Git/build operations applied to the reviewer; this assignment explicitly
authorizes CC's scoped implementation, validation and commits.
