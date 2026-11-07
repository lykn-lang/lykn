# Slice17 — Lykn ESTree walker and bounded capability gate

Opened2026-11-07; open collapsed standalone increment, same established Project03
layout. Operator: “Awesome! Let's implement the Lykn ESTree walker and run the
bounded K01–K12 capability gate. Same models, Autonomous Mode, and stop if we hit
another real evidence gap :-D”. Endpoint reusable tooling + independently reviewed
fixed gate, or first real compiler/parser/offline/coverage/oracle gap with remaining
unruns. No full corpus/F6 matrix/library, product compiler edit, merge/propagation,
push/publication/remoteCI/install/new dependency/global install/next unit.

CDC /root/cdc gpt-6.1-sol High owns design/planning/independent review; one fresh
fork-none CC gpt-6-luna High implements source/raw only; root read-only transport.
Default two contributors, normal five preserved correction passes for THIS new
tool unit, no reset of prior source budgets. No automatic compiler repair.
CC returns all indices before CDC review/replay. CDC alone owns prose/ledger
statuses/parent; canonical review cdc-verification.md and CDC retrospective at close.

## Current inputs and binding method

Planning54ad54776657fa888557e862d4bb964ac6cabfae clean. Source read-only
release/0.6.x /Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x at
5408abd432b8789ae474a3895436f68818c4e482/tree39bc56b73897e568ff81ce60a2feef28a2310ea8,
same task checkout tracked bytes. Reuse task checkout
/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering only for
owned ignored target/slice17 outputs/caches, no source/index/build mutation.
Actual absolute release target/release/lykn SHA
85d6d3d528c404873bae712ebc8594d0d7a5dacaeffecba2c388fbe7f19f87fc,version0.6.0;
Deno executable `/opt/homebrew/bin/deno`, version `2.9.6`,
SHA2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74.
Re-pin before use, never bare/global/task-old CLI. No full Make/redundant old
parser/pilot matrix is required for these research sources.

Binding: FULL Slice11 artifacts/audit-contract.md (accepted at a9ccd823 by its
final cdc-verification), particularly §2 explicit field/node table and §5 fixed
controls/status equations; Slice12 PhaseB design; Slice15 successful parser4/4.
Historical “proposed/unrun” wording remains historical, not current authority.
Reuse exact cached unmodified npm-distributed Acorn8.17.0 ESM at
/Users/oubiwann/Library/Caches/deno/npm/registry.npmjs.org/acorn/8.17.0/dist/acorn.mjs,
SHA1cbcbf252a5800e496dc505c706f309a9dd4e1789392e12963c77ae9497ff6f7.
Literal file URL only/hash BEFORE dynamic import, version and after-use hash;
no authenticated-origin/general npm-source reuse claim or acquisition/vendor copy.

Original Slice12 artifacts/controls.json unchanged SHA
0f20dba4713b93671b337fa1ba0a5cde00fdbe29bed195a00e3ae1c689473a5d is the complete
fullAuditControls population:12families/13rows (K10a,b). Copy unchanged, never
edit old source/oracles. K06 abbreviated controls prose omits the `start` Identifier
in its list while declaring9; FULL accepted §5 explicitly says static-block
CallExpression+start read. Thus required K06 is9, including both at4:11. This is
source-grounded clarification, not a silent oracle change or new case.

## Implementation spine (four Lykn modules only)

Sources in this slice artifacts/tooling/:

1. parser-core.lykn: unchanged copy of Slice14 stage-c/tooling/parser-core.lykn
   SHA6ca1afe83d6d9a47f7eb1fea7f0aa3872ae626cc4f39d5b3ed017aab38308bf7.
2. estree-walker.lykn: pure exported walk-program(program:any)→machine-readable
   walk result; no file IO/parser/import execution. Explicit node-type dispatch
   and field roles from §2, never Object.values/generic-recursion as completeness.
3. scanner.lykn: manifest→hash guard/parser→walker→one JSON stdout report; process
   exit0 only for complete scan,2 for incomplete. Separate synthetic mode calls
   walker directly on frozen K12 AST, no Acorn load/parse/file counts.
4. capability-observer.lykn: stages frozen inert data/manifests, hashes actual
   bytes before child, launches ONLY exact Deno with raw receipts before assertions;
   validates fixed outcomes and writes capability-results.json. No other new
   helper/framework/producer is needed. README/predictions explain replay/API.

**Pre-authoring API clarification (iteration01):** scanner argv is exactly ONE
absolute manifest path: `scanner.js MANIFEST`. Manifest `kind` is `file_scan` or
`synthetic_unit`. File manifest contains run/tool/source/parser metadata (including
`parser.expected_sha256`) and `rows` array of required condition records below.
K11 sets expected_sha256 to64zeros and points its single required row at existing
K01 bytes; scanner gate runs before reading any row. Synthetic manifest instead
contains `control_id: K12` and the unchanged injected AST JSON value; no rows/parser
activity. Use the same minimal report envelope with explicit run kind; its parser/
file counts are not-applicable, not zero claimed parsed files.

Observer argv EXACTLY8 absolute values in order: `CONTROLS DENO SCANNER_JS CORE_JS
WALKER_JS TASK_ROOT CACHE_ROOT CONFIG_FREE_CWD`. The three module args identify
already compiled siblings; parser path/version/hash come from frozen controls.
TASK_ROOT/CACHE_ROOT must not preexist (parent only); observer creates them and
fixed staged inputs/manifests/results. It validates the exact13 IDs before writes,
uses K11 thenK01–K10b,K12 order, and hashes writes before each dependent child.
Compiler/source identity metadata references the frozen native preflight receipt,
not an invented Git subprocess/self-authentication. Scanner stdout is one JSON
report plusLF; only observer launches subprocesses.

Real zero-arg module oracles BEFORE data/case activity: parser-core and walker
load0 with empty streams; scanner exits2 with one JSON object
`{"status":"scanner_usage_error","expectedArgs":1,"actualArgs":0}` plusLF,
empty stderr; observer exits2 with
`{"status":"observer_usage_error","expectedArgs":8,"actualArgs":0}` plusLF,
empty stderr. Guards precede all IO/Acorn use/children. These are not capability
cases; they test actual module syntax/guard paths after complete generated review.

Walker: one record per Program.body parent in source order; reasons attached to
that parent with node type/path/generated loc.start/range/category/rule. Count
each finding parent once; reason count separate. Static edges/bare imports are
separate, observed_effect stays unpopulated. Deterministic diagnostic traversal
is not runtime execution order. Treat all §2 fields deliberately:

Top-level executable/control/expression statements are direct evaluation parents;
declarations are direct only when evaluated-child potential exists. Dependency-only
imports/re-exports remain edges, not direct findings. K01 functions stay0/0.

- Variable patterns use Binding role, plain names ignored; patterns themselves,
  defaults, computed keys/destructuring/spread/coercion get the specified reasons.
  Member property names and labels are Name role, never identifier reads.
- Calls/new/tag/await/import/assignment/update traverse evaluated operands and
  flag syntax potential; unknown reference Identifiers count, no name-purity
  inference. IIFE outer call counts, function body/defaults do not.
- Functions/method bodies/parameters and instance initializers are explicit opaque
  Deferred fields; computed class keys, heritage validation, static values/blocks
  evaluate. Completion means coverage of visited evaluated fields plus explicit
  deferred dispositions, NOT whole descendant AST coverage. Unknown visited node
  or unlisted evaluated child fails unsupported_ast; no generic fallback. Known
  deferred fields cannot hide a newly unlisted sibling executable field.
- Control tests/branches/loops/switch/try/catch are visited conservatively. Throw
  gets its own reason. Direct control parent and nested reasons are distinct;
  transparent SwitchCase/CatchClause are not extra direct parents. Preserve export
  wrapper parent identity; default expressions/initializers evaluate, functions
  remain deferred. Static import/re-export edges are not local call findings.
- Implement explicit type/child roles, including Acorn ImportExpression.source
  AND nullable options (not argument); class PropertyDefinition/static/StaticBlock;
  import attributes are not silently treated as an evaluated ordinary expression.
  Empty attributes metadata is allowed; an unapproved child node/field fails closed.
  Exact accepted node subset is not extended opportunistically for future syntax.
  Unknown-node handling precedes assumptions about loc/range; K12's inert synthetic
  node lacks them, so retain absent metadata as null/not-applicable, never invent
  coordinates or crash before reporting ExperimentalNode at Program.body[0].

Use source-proven implicit-final-value funcs, typed boundaries/foreign:any, cell+
swap!+conj for actual accumulators, get/Object:hasOwn/Object:entries as needed.
Use private type+match for closed roles/outcomes (e.g zero-field ReferenceRole,
BindingRole, NameRole), not manual internal tag-string ladders; ESTree's open
foreign type strings and required JSON status strings remain validated wire data.
No unnecessary cross-module ADT registry. Small helpers visit-one/visit-list/
visit-pattern/add-reason/dependency are local discretion, behavior is binding.

Scanner manifest keys identify source_id/source_sha256/emitter/mode/condition_id,
path/hash/required/segment, with inert-js-control route (NOT live emitter proof).
Direct data source/output paths may coincide; no invented original-source map.
Report §5's statuses/totals/partition equations and all required identity/options/
error fields, zero applicable unused counters. No new registry/schema machinery.
Parser gate failure leaves every selected required condition not_processed;
successful parse+unknown coverage is unsupported_ast, never clean. Read errors
distinguish Deno.errors.NotFound/NotCapable; preserve actual diagnostic. Catch only
the intended boundary; programming errors are unexpected failures, not parse_error.
Use fatal UTF-8 decoding for actual source bytes; cannot silently replace bytes.
Aggregate findings do not fail a complete scan; real row errors yield incomplete.

## Frozen gate and predictions

One child per frozen row,13 total, order K11 then K01–K09,K10a,K10b,K12. Each
condition has its own fresh cache/raw home/manifest; no pooled fiction. K11 uses
the already-frozen K01 file only as one declared REQUIRED gated manifest row:
expected hash64zeros, no input read grant/import/parse, row not_processed, aggregate
incomplete/exit2. No extra control bytes; K11's own input remainsnull.
K01–K08: complete0, respectively direct/reasons0/0,2/3,1/2,1/4,2/4,1/9,1/3,1/3;
aggregate9direct/28reasons across these eight. K08 has2edges/1bareimport.
Validate ALL original numeric locations/paths/ranges/categories, not only totals.
K09 actual parse_error pos14/1:14, no AST, incomplete2. K10a exact missing path
is granted so NotFound is observable; K10b existing exact file is denied in child,
outer staging/hash receipt proves existence; separate keys/source_missing vs
source_unreadable, no AST, incomplete2 each. No directory-wide grants.
K12 injected ExperimentalNode at Program.body[0], unsupported_ast, no parser or
file count (not-applicable), synthetic unit exit2. Supervisor can pass13/13 when
eight complete file cases and FIVE expected negative/unit outcomes are correct;
scanner incomplete/nonzero outcomes are not rewritten as scan successes.
Twelve file-condition rows across scanner calls include K11's gated reference;
K12 is excluded. Parsed/completely-walked8, parse_error1, missing1, unreadable1,
not_processed1; no full corpus claim. Per-condition source counts are not summed
as a fictional distinct-source total. Freeze these predictions before runs.

## Freeze/gates/permissions/stop

Commit exact full source/control/predictions BEFORE checks/runs, retain every
candidate body before editing/checking and unique failed output/argv/cwd/exits.
Formatter edits require new source pin. Copy compilation inputs to owned truly
config-free /private/tmp cwd/ancestry; no ancestor project.json/deno.json. Generated
JS stays owned ignored task target or that scratch, durable evidence copied here.
Pinned native check/fmt--check/lint/DEFAULT strict compile, complete generated-code
review, Deno check plus genuine zero-argument module/usage guards BEFORE gate.
Core/walker exports-only load0; scanner/observer usage rejection before IO is
explicitly predicted in committed source/README. DenoCheck0 alone is insufficient.

Strict runtime flags --no-config --no-npm --no-remote --cached-only --deny-net
--no-prompt, fresh DENO_DIR, no env grant. Observer only run=absoluteDeno, exact
reads for frozen inputs/tools/parser/modules and ALL own just-written inputs/
manifests it hashes; writes only owned run/cache roots. State actual exact path
list/argv before launch; never root/directory-wide read/-A. Scanner child exact
manifest/modules/parser/permitted own input reads, zero write/run/env/net grants,
clearEnv with fixed PATH/DENO_DIR/update/no-color. K10b child read deliberately
omitted; K10a missing exact path included. K11 no JS input read; K12 no parser read.
Observer saves attempt then raw Uint8Array stdout/stderr/result BEFORE decoding/
assertions, writes raw JSON scan report separately, then case verdict. All data
are parsed only, NEVER executed/import-resolved; no Acorn mutation/instrumentation.

Unexpected compiler/parser/offline/coverage/oracle result stops subsequent cases
and preserves unrun denominator, no alternative helper shape to bypass real gap.
Ordinary author errors only source-grounded corrections under max5 preserved
numbered prompts; source fix/new dependency outside scope. NO Python whatsoever/
exception/jq/Ruby/Fennel/handwritten research JS/Node/other substitute/shell logic.
Native direct CLI/simple filesystem only; no hooks bypass/no-verify/force/skip/
suppression/permissions widening/history rewrite/blanket staging. Exact-path
normal commits, real newlines and contiguous Codex/BilloAI trailers/rawbody check.

CDC independently reviews actual sources/generated code/manifest/status partitions
and replays the SAME fixed gate fresh after ownership return. Prior unchanged
parser/core/API readings and parser4/4 retained with actual applicability, not
relabeled fresh. Compare each run to fixed oracles; run IDs/absolute paths may
legitimately differ, no raw-byte-equivalence requirement/new normalizer. The13
rows prove only their finite cases, not every table family/future JS node.
Close rows/report/retro/project/backlog at endpoint; original
F1–F12/full audit/Project07 ADT/guide/book/licence/bootstrap/synthesis/human and
NE-C02/04/05/NE-T01 owners survive. No automatic next unit.

Author readiness: complete574-line accepted contract and full13-row data read;
current source/tool/parser hashes revalidated; §5 K06 clarification above grounded
in explicit full oracle. Actual core/observer/raw-byte/digest/Command APIs reused;
Lykn reference/ADT match/foreign boundary guidance applied. Framework/PM/verification/
testing full current reads retained from Slice16; domain guides unchanged at5408.
No consequential choice remains for CC to invent; precise local names/layout are
discretion. All original-method node/status rules remain binding.

## Assignment history

| Prompt | Date | Predecessor | Reason | Disposition |
| --- | --- | --- | --- | --- |
| cc-prompt.md | 2026-11-07 | none | Explicit Lykn walker/fixed capability gate | Replaced before authoring/check/runtime by iteration01 |
| cc-prompt-iteration01.md | 2026-11-07 | cc-prompt.md | Pre-authoring Deno separator/API/usage clarification | Returnedb312; source failure/review requires iteration02 |
| cc-prompt-iteration02.md | 2026-11-07 | iteration01 | Actual b312 source failure + consolidated EW-R1–R5 | Current ordinary source correction1/5 |

Initial plan concatenated executable/version as `/opt/homebrew/bin/deno2.9.6`;
CC correctly found that literal path absent and verified actual `/opt/homebrew/bin/deno`
version2.9.6/hash2ad84 before any source/check/runtime. Lookup remains historical,
not a compiler/parser gap. CC returned index ownership for this preserved amendment;
initial prompt is unchanged. No source pass ran; normal max5 budget is not reset.

Initial implementationb312cf36 freezes all four modules/data/predictions/drafts.
Core nativecheck0/warning; first walker launch failed receipt setup before CLI;
actual unchanged walkercheck1 reports unterminated list120:3. No generated/runtime/
capability proof (0/13). [Partial CDC review](cdc-verification.md) classifies
documented authoring/API/coverage/verifier defects, not a valid-Lykn compiler gap.
Iteration02 consolidates correction1 under unchanged contract; no new cases or
product repair. Bounded positive Program retention is reused from prior probe
solely to validate fixed numeric oracles; negative rows omit AST, K12 synthetic.
