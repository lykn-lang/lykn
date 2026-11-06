# CDC verification — Slice10

**ACCEPT, 2026-11-06.** Reviewer `/root/cdc`, OpenAI Sol6.1 High, independently
reviewed fresh Luna6 High CC `/root/cdc/template_integration_cc`. CC implemented
the merge; CDC authored no product source. Reviewed CC planning commits
70de6ff5e9936defabe784c6d0a62a9e2fafcbf5 and
a4a2bf1d7539956627ffc979733c8f23cc89ade9, their raw bodies, source merge
f70565566088f5d55129edda6bd73a4691e5a58d and all five opening criteria.

## Independent evidence and applicability

Own [commands](artifacts/evidence/cdc/commands.txt), [preflight](artifacts/evidence/cdc/preflight.log),
[full gate](artifacts/evidence/cdc/make-check.log),
[focused observations](artifacts/evidence/cdc/native-focused.log),
[citations](artifacts/evidence/cdc/cited-paths.log) and
[identities](artifacts/evidence/cdc/identity.log) are durable. Each actual gate
exit is separately retained; all three are0. Source was clean before/after
CDC's gate, outputs went directly to canonical planning, and newly created
owned XDG/npm caches were separate from CC's. DENO_DIR remained the existing
accepted cache. Source override selected Rust/Cargo1.97.0, Deno2.9.6; no installs,
new dependencies, Python, alternative authored helper, test filters, gate skips
or additional permission flags were introduced. Existing npm packaging dry-run
tests remained in the unmodified canonical gate.

The actual full Make log contains25 Rust result summaries:1509 passes,0 failed,
three empty selections. JS+Lykn1467/1467 across six steps; docs482/482. The new
native integration selects **one test**, checking22 values over six fixtures;
focused output includes every strict compile/generated JS/runtime/stdout witness.
Public-JS likewise selects one test over the same six fixtures/22 assertions,
not22 separately selected tests. Native focused and committed citation gate
also pass independently (63 documents/601 unchanged historical citations).
Build, dependency check, lint/format and all canonical Make components passed.

Full merge tree572bc953a053c34cf4ded4520c36d12e7657c2c3 equals accepted task tip
bc83b43cc9084d0eddb910c73497cef0f9c43179 byte-for-byte. Parents are exactly
 ae51223089def7b7b3498519d9f51283b3a6065b and
 a061c2149792178ba037d17a31220545e34b4ac1; accepted repair ancestry holds. The
13 target-relative paths match the opening list. Thus prior Slice08 independent
source/semantic review applies to identical repair/test bytes, while fresh
release execution above supplies this integration's own evidence. AGENTS,
Cargo.lock, Cargo.toml, Makefile and citation census are unchanged from target.
Both source/planning commit messages have genuine contiguous required trailers;
no history rewrite or other source propagation occurred.

Absolute release `target/release/lykn` and `bin/lykn` both hash
57a49f559a79700d66a2d1db216bd179d54fd0c51fd7f2626ff2029bd3163d28, version0.6.0.
This is the newly built release artifact, not the accepted task or stale global
binary. Canonical, embedded and actually materialized compiler.js under fresh
`target/slice10/cdc/xdg-cache/lykn/embedded/0.6.0/packages/lang/` all hash
50db21ce3d1f30325e9541c284cb37ffdc3f6e93bad55521a26cd6b4734ac1f4 and cmp0.
Lock hash672c8bf62e441cfaa6ec22bd511d55e002812d8f18814faea0e99d4c5e2813ce;
policy hash1b5d78b96a4ef888153696e8e6656029ee24bc00be602ad5568e40265398c73d.
This controls NE-C04's known same-version cache risk without repairing it.

## Five-row disposition and scope

| ID | Verdict | Evidence strength and boundary |
| --- | --- | --- |
| TI-01 | done | Reconciled: opening CDC/CC clean identity checks, independent accepted patch/tree/path and source condition reconciliation; no hooks or unexpected inputs |
| TI-02 | done | Reconciled: actual two parents/repair ancestry/predicted whole tree/13 paths/trailers; unchanged target governance/lock |
| TI-03 | done | Reproduced: own complete unfiltered release Make, native focused and committed citation executions/populations above |
| TI-04 | done | Reconciled: own absolute binary/version/hash and actual fresh materialized/canonical/embedded byte comparisons |
| TI-05 | done | Reconciled: all five rows accounted, actual reports/raw records/history inspected, dated parent/backlog integration update and CDC retrospective; no project-wide acceptance |

CC's malformed binstall availability probe exited2 without installation. Its
preliminary Rust tally/“22 tests” claim was corrected from raw output before
initial handoff. CC initially wrote raw logs into untracked source `artifacts/`,
then moved unchanged bytes to planning and removed that directory; CC's gate
therefore is not represented as clean throughout. CDC's fresh clean-source gate
independently resolves that condition. A second explicit-path planning commit
retained the focused log omitted from the first commit; no evidence was erased.
See [retrospective](cdc-retrospective.md) for proportionate follow-through.

No deferred/no-op rows or required unrun gates remain in this slice. This accepts
only the local0.6 integration. Original Slice08 bounded5/11 evidence is retained
at its original condition, not newly replayed or generalized. NE-C02/04/05/06,
NE-D01, Slice01 F1–F12, Project07 final synthesis/licence/bootstrap/library/ADT/
book/human gates remain owned/open. No push, publication, main/other-release
propagation, new compiler repair, optimizer audit or next unit follows.
