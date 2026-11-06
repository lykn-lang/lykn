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

## Final affected-delta review — ACCEPT, 2026-11-06

Reviewed actual CC correction a9ccd823f246a9a920e91255788c8822e0841f61 and its
complete delta, final close and five-row ledger. Initial rejected candidate and
numbered correction remain intact; no acceptance is backdated. All AC-R1–R5
are resolved at **contract scale**. No parser, walker, control, bundle or corpus
execution is inferred from this verdict.

Independently reconciled public exports at packages/lang/mod.js4–6 and wrapper
23–25, expand's real filePath/strict context and retained macro environment at
expander.js1838–1865, relative resolution1555–1566, current project.json and
actual test caller main.rs964–1055. The selected future public producer uses
exported stages in a fresh process per source; actual test-CLI cwd-context
output remains a different condition. Its existing npm-distributed astring and
Deno node:path compatibility are reported, separate from the scanner's exact
local Acorn ESM/no-npm-loader route. No general npm-source reuse/acquisition
permission or cache authenticity is inferred. Contract's mod.js1–3 export cite
is slightly imprecise; actual named exports are4–6, independently checked here.

Rechecked node-family boundaries, control K01–K12 literal inputs/counts and
representative zero-based columns by source inspection, including the cached
Acorn parseExprSubscripts/parseSubscript source2912–3010 preserving K02 call
start14. K08 now uses valid quoted static module specifiers; K12 is explicitly
an injected walker-unit boundary, not parser success. Class heritage validation
is supported by the official [ClassDefinitionEvaluation algorithm](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-runtime-semantics-classdefinitionevaluation): constructor validation and prototype access can throw independently of child evaluation. This was documentation-only reading, not an execution or new syntax baseline. Guarding unknown identifiers/coercions and failing closed on unsupported evaluated nodes deliberately trades precision for conservative coverage; no whole-JS purity/exception theorem is accepted.

Every route has a separate source/emitter/mode/condition key. Disjoint terminal
statuses sum to selected-condition rows; parsed and complete-walk counts differ;
missing/hash/compile/parse/unsupported/not-processed rows cannot become success
or named exclusions for required coverage. Partial observations stay partial.
The two minification artifacts need distinct membership evidence; renaming,
inlining or insufficient mapping yields an explicit indeterminate claim rather
than an unsupported retain/drop pass. The existing complete C4 bundle/metafile
supports dead406 resolved/no output row versus used365/effect28/barrel0; it is
neither minified parity nor symbol attribution for arbitrary audit outputs.

Live source remains clean f70565566088f5d55129edda6bd73a4691e5a58d. Independently
rehashed release compiler57a49f559a79700d66a2d1db216bd179d54fd0c51fd7f2626ff2029bd3163d28,
Deno2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74,
Acorn1cbcbf252a5800e496dc505c706f309a9dd4e1789392e12963c77ae9497ff6f7 and
native esbuildb26c07a69bc734c1661ee3180bc2a8b71ee860826a866393e94c519cda46fe1f.
These match initial checked inputs; retain the unchanged initial source/API/
provenance/C4 observations at their original date and pins. No cache was
installed, repaired or executed. Reviewed raw commit bodies and exact scope;
original F ledger, predictions, fixtures and scripts are unchanged by this unit.

| Row | Final verdict | Evidence strength at this scale |
| --- | --- | --- |
| WC-01 | done | Reconciled: actual local artifact/hash/lock/API inspection and exact offline candidate policy; future capability unrun |
| WC-02 | done | Reproduced static review: explicit conservative rules/table, consistent boundary and fixed12-case oracles; no control pass claimed |
| WC-03 | done | Reconciled: real source-discovery/caller/API context and complete per-condition schema/status equations; future population not scanned |
| WC-04 | done | Reconciled: native CLI contract and accepted raw C4 source/meta proof; variant/member/runtime distinctions preserved |
| WC-05 | done | Reconciled: all12 original IDs retained/open; reviewed amendment adopted by Slice01 reference, independent five-row walk and CDC retrospective |

No deferred/no-op WC rows remain. This accepts the method only. Future work
still must implement the Lykn walker/producer, freeze bytes/predictions, prove
the exact-artifact offline parser/control gate, then obtain separate execution
authority for the full audit. Runtime compatibility, implementation correctness,
corpus counts/results, both-emitter outputs and full F6/F10 results remain
unproved here. No product source, full Make gate or irrelevant pilot was run.
All inherited F1–F12, Project07 synthesis/licence/bootstrap/library/ADT/book/human
and separate NE-C02/04/05/06/NE-D01 obligations survive. Stop at this endpoint.
