# DB01 draft scope — generation blocked

The [generator source](audit.lykn) contains 47 explicitly named variant seeds,
including one harness family. The first freeze launch failed; the subsequent
operator-suggested eval route generated candidate inputs.json with three ownership
checks. This document records intended work, not an execution-ready operational
freeze. Original FM01 rows remain verbatim in inputs.json and the raw packet's
fm01.md. All operational conditions, budgets and repeat rules
in slice-plan.md remain authoritative, including conditions not yet implemented
by these drafts. No variant is fulfilled by a declaration in source.

| Family | Draft IDs (prefix shown once) | Disposition |
| --- | --- | --- |
| R-01 | identity, help, argv, minimal | Build/identity/argv evidence partial; minimal launch blocked in a separate diagnostic fixture |
| R-02 | std-json-1.1.0, std-jsonc-1.0.2, std-yaml-1.2.0, std-streams-1.1.2, eemeli-yaml-2.9.1, toolchain | All 188 sizes/hashes match published metadata; complete graph/lineage inventory remains owed |
| R-03 | narrow, alias, missing-package, missing-subpath, corrupt-lock | Not run; launcher prerequisite |
| R-04 | prefetch, warm, cold | Not run; static file download is not a runtime-cache prefetch result |
| R-05 | parser-native, parser-yaml, read-allowed, read-denied, write-allowed, write-denied, env-denied, net-denied, run-denied | Not run; all-permissions diagnostic did not reach application permissions |
| R-06 | new, existing, symlink, mode, reader, two-writers | Not run; checkpoint worker drafts not validated |
| HP | partial-observer | Not run; observer capability not established |
| R-07 | cross-filesystem, inject-open, inject-write, inject-flush, inject-rename, cancel-before, cancel-after, directory | Not run; empty secondary scratch removed, recreate only under original restrictions |
| R-08 | reconciliation, json-parse, yaml-parse, yaml-stringify | New representative replay and reconciliation audit not run |
| R-09 | available-pair | Original runtime removed; no supported live comparison pair established |

All executable functional/fault/concurrency variants still owe two fresh attempts;
the three planned representative resource variants owe one warm-up and five
measurements each. Wall/output/RSS controls are separate and have not run.

The complete original YAML ownership input is retained byte-for-byte in
the raw packet's yp-inputs.json: 54 Y-13 resource cells, 28 gated Y-14 document
cells and the other 267 YAML rows plus three harness rows. Slice06's independently
verified 36 unsupported resource cells retain their API/bound reasons, overlap
and re-entry. They are not newly executed or converted into launch failures.
The original JSON manifest is the raw packet's j-inputs.json; all eight J-16
variants and their prior evidence remain inherited. Slice04 owns reconciliation;
Slice07 owns all 28 document cases after the still-unresolved compatible route.

Owner of every blocked R family: Slice04, after independently verified
D-2609-DARG correction in Arc03/Slice06. Re-entry requires a new traceable compiler,
actual runtime identity, corrected draft review, generated manifest, graph/lock
checks and controls in fresh roots. No protocol family cap or sample exists yet.
