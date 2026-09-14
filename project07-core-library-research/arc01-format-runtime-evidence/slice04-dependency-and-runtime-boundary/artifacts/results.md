# Partial runtime results

CC execution evidence only; all eight DB rows remain open. The latest condition
has 91 passing process audits, one failed process audit and 11 unrun attempts.
Two frozen conditions are retained; they are not a complete original/fresh
successful comparison. Expected application errors can pass a semantic audit;
the audit exit, child exit, stop reason and emitted output remain separate.

| Group | First condition records: pass / fail | Latest condition records: pass / fail | Latest unrun |
| --- | --- | --- | --- |
| External controls | 5 / 0 | 5 / 0 | 0 |
| Native and package permission/import cases | 38 / 0 | 38 / 0 | 0 |
| Observers/concurrency | 6 / 0 | 6 / 0 | 0 |
| Cancellation | 4 / 0 | 4 / 0 | 0 |
| Replacement and faults | 4 / 0 | 8 / 1 | 11 |
| Resource recipes | 12 / 1 | 18 / 0 | 0 |
| Resolution/cold offline | 0 / 1 | 10 / 0 | 0 |
| Fresh prefetch | 0 / 0 | 2 / 0 | 0 |
| Total | 69 / 2 = 71 | 91 / 1 = 92 | 11 |

Across both conditions: 163 records, 160 passing and three failing audits.
All 163 original dispositions reproduced before sealing and again from fresh
packet extraction. This is retained semantic replay, not independent CDC.
The five planned negative audit copies did not run: the failed files marker
correctly prevents that stage. Full successful fresh replay remains owed.

Native JSON and pinned standard YAML parsing succeeded without user-operation
grants. Both native and package-backed read/write allowed/denied cases and
env/net/run denials were observed with valid arguments and actual NotCapable
classification. Explicit host grants used to supervise processes do not imply
that child programs received them. Actual argv recorder evidence for the new
full condition remains owed despite recorded commands and earlier launcher CDC.

Warm cached-only execution succeeded; empty-cache runtime failed before package
evaluation. Two fresh all-export prefetch graphs resolved 67 modules (local root
included). Missing alias/package/subpath and corrupt-lock outcomes retain exact
stderr/graph errors and original lock bytes. `deno info` can exit zero with error
nodes; those are parsed faults, never permission to execute an unresolved graph.
`info --cached-only` is unsupported in this runtime; static graph retrieval and
cached-only runtime execution are distinct conditions.

New/existing/symlink/mode replacement, observer readiness, intentional partial
write detection, two writers and before/after cancellation passed their live
audits in work02. These observations cover complete bytes and sampled process
conditions; they do not prove crash durability, universal atomicity or race
freedom. Initial symlink setup required authority unavailable through narrow
Deno symlink grants; the operator explicitly authorized `/bin/ln` only for the
isolated fixture, and the second condition retained narrow child grants.

The existing Games01 filesystem has device 16777245 versus 16777233 for tmp.
The first attempted cross-device rename instead failed with NotCapable because
its source temp lacked read authority. A complete 65,537-byte temp remains at
`/Volumes/Games01/lykn-p07-db-final.8zToIv/R-07-cross-filesystem-1.tmp`; destination
stayed `ORIGINAL` plus LF. This is not OS cross-device evidence. No grant fix or
retry followed failure eight. Two corrected cross-FS trials, eight injections,
two directory-error trials and affected controls are owned by Slice08.

The three representative resource recipes use 1,048,576 `x` characters and run
one warm-up plus five measurements each. JSON/YAML parse return the declared
value; YAML stringify emits a folded scalar: `>-` + LF + two spaces + payload
+ LF, 1,048,582 bytes, SHA-256
`45fd52e44307a1770e6ad4c06dfb21f588a0793431c56204dc4f5b18ece50560`.
The first condition's plain-scalar expectation was wrong; exact old/new audit
sources are preserved. Timings, process CPU snapshots and sampled RSS remain
per-record observations. No speed comparison or peak-memory guarantee is made;
setup, compilation, observation and audit costs are separate from package calls.
Exact J-16/Y-13 attempt reconciliation remains owed to planned Slice09.

All nine failures, including the unexecuted helper authored after the ceiling,
are in [authoring observations](authoring-observations.md). No further source
correction, prohibited package execution, installation or source edit occurred.
