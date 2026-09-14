# DB01 frozen scope and partial dispositions

[inputs.json](inputs.json) preserves `originalFm01` verbatim,
`originalCandidates` (47 IDs), inherited J/Y inputs, exact sources/configs/locks,
48 executable `variants`, 11 static `dispositions` and 103 expected attempts.
The executable count is 36 original runtime candidates, five external controls
and seven explicit package permission expansions. Static rows do not count as
runtime passes. The packet retains both frozen manifests; the top-level copy is
work02. Resource attempt 1 is warm-up; attempts 2–6 are measurements. Other
research variants repeat twice; external controls run once per condition.

| Family | Original IDs, family prefix shown once | Latest evidence and remaining work |
| --- | --- | --- |
| R-01 | identity, help, argv, minimal | Pinned build/help and two actual minimal runs; full new argv recorder/reconciliation owed to planned Slice09 |
| R-02 | std-json-1.1.0, std-jsonc-1.0.2, std-yaml-1.2.0, std-streams-1.1.2, eemeli-yaml-2.9.1, toolchain | Published byte inventory and 67-module permitted graph; full dev/type/example/toolchain classification and lineage still owed to Slice09 |
| R-03 | narrow, alias, missing-package, missing-subpath, corrupt-lock | Narrow imports twice; four static resolution/integrity fault variants twice; earlier alias-audit failure retained |
| R-04 | prefetch, warm, cold | Two prefetch, two warm package runs, two cold offline failures with expected semantics |
| R-05 | parser-native, parser-yaml, read-allowed, read-denied, write-allowed, write-denied, env-denied, net-denied, run-denied | Each twice; seven file/env/net/run cases additionally twice with `-package` suffix; parser no-grant success is distinct from host grants |
| R-06 | new, existing, symlink, mode, reader, two-writers | Four file variants twice and both concurrency variants twice; bounded live observations only |
| HP | partial-observer | Deliberate partial-write detection twice; separate from ordinary writer success |
| R-07 | cross-filesystem, inject-open, inject-write, inject-flush, inject-rename, cancel-before, cancel-after, directory | Cancellation twice each; first cross-FS record fails its audit due source-read NotCapable; second cross-FS, eight injections and two directory attempts not run; Slice08 owns completion |
| R-08 | reconciliation, json-parse, yaml-parse, yaml-stringify | Three recipes each warm-up + five measurements; exact inherited reconciliation owed to Slice09 |
| R-09 | available-pair | Only selected supported pair established; removed 2.7.7 unavailable; no alternative installed or fabricated |

The latest 103-attempt inventory contains 92 retained records (91 passing audits,
one failed audit), leaving 11 unrun. Completing the fault subset requires
12 fresh fault attempts: rerun the failed first cross-FS attempt as well as the
11 unrun attempts, plus affected controls and five negative audit copies.
No marker was fabricated to skip the failed files group. The earlier condition
retains 71 records, 69 passing and two failing audits; the symlink setup error
occurred before a child/record existed. [Results](results.md) separates these
populations rather than adding them into a completed denominator.

All eight J-16 variants and 54 Y-13 cells remain in `inherited`; prior resource
measurements remain historical evidence, not new runs. All 36 unsupported Y-13
cells retain API/bound reasons and re-entry (18 JavaScript-value conversions,
27 explicit-bound variants, overlap nine). Their current owner is Slice04 via
planned Slice09 reconciliation. All 28 Y-14 document variants remain gated until
an actual compatible route/design prerequisite is established; owner Arc01's
planned Slice07 after Slice09's decision work. Unavailability and not-run are
neither passes nor removed requirements.
