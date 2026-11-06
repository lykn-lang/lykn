# Slice11 CDC verification

## Initial review — revision required, 2026-11-06

Reviewer `/root/cdc`, OpenAI Sol6.1 High; substantive author fresh CC
`/root/cdc/audit_contract_cc`, OpenAI 6 Luna High. Reviewed committed candidate
5919c742b963b69594099ee1c818432ba190f8d2, complete433-line contract, close/ledger,
opening plan/prompt and original audit obligations. No self-authored substantive
contract is being independently accepted.

Independently checked original scripts/fixture bodies/inventory/predictions,
Slice04 crosswalk/protocol, actual release main.rs711–1055 and public
packages/lang/mod.js1–25. Read the complete accepted Slice08 C4 bundle/raw
metafile and relevant final review; verified live release/compiler/Deno/native
esbuild/cached Acorn hashes and cached parser manifest/options/export source.
All source/candidate pins match the opening. Parser provenance/policy and raw
C4 interpretation are supported, with future execution unproved and unrun.

Five bounded precision findings keep affected criteria open:

| ID | Finding at candidate5919c742 | Required correction |
| --- | --- | --- |
| AC-R1 | §3 labels the same native `lykn compile` command public-JS, then defers the actual mechanism | Select/source-cite the actual public `lykn(source,{strict})` API or another real route; give a truthful future Lykn invocation/producer recipe and macro/cwd/mode mapping, no fictitious public-JS CLI |
| AC-R2 | §2 forbids function-body descent but immediately promises IIFE-body nested-call reasons; explicit supported-node table is not supplied | One consistent conservative boundary and explicit evaluated-node coverage table; no implied call-graph/purity theorem; unknowns remain incomplete |
| AC-R3 | §5 future controls describe categories, not fixed literal inputs or independent numeric location expectations | Specify a finite exact inert-text/control input set with AST paths/categories and concrete representative locations/status/count falsifiers before any future implementation/run |
| AC-R4 | §3/5 global one-output-per-source conflicts with multiple emitter conditions; missing/hash/compile/unsupported statuses do not form explicit disjoint partitions | Key produced rows by source+emitter/mode condition and define each terminal accounting status, failure/coverage totals and valid complete-scan condition without overlap or omissions |
| AC-R5 | §4 says minified code inspected “as needed” while generic table supports membership claims | Require artifact-specific evidence for each variant; no name-absence inference through mangling/inlining or unminified-to-minified transfer; unresolved membership remains explicit |

Iteration01 consolidates these within the existing method assignment. No runtime
experiment, new dependency, full scan or source correction is warranted. Preserve
this rejected candidate in Git; retain unaffected source/hash/provenance receipts
at their original condition rather than rerunning them or backdating intake.
All five WC rows and all twelve original F rows remain open pending review.
