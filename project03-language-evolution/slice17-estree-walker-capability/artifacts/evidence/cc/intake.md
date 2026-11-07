# CC intake and contract readback

## Required text coverage

Read the complete active assignment at `project03-language-evolution/slice17-estree-walker-capability/cc-prompt.md`, complete Slice17 plan and ledger (201 and 13 lines), planning `AGENTS.md` (186 lines), planning and Project03 READMEs, complete accepted Slice11 `artifacts/audit-contract.md` (574 lines), complete Slice11 `cdc-verification.md` including its final affected-delta review, complete Slice12 `artifacts/controls.json` (13 `fullAuditControls` rows plus the separate four-row historical Phase A set), Slice12 plan, Slice14 `artifacts/stage-c/tooling/parser-core.lykn` and `offline-observer.lykn`, and complete Slice15 `artifacts/parser-reentry/cdc/replay.md`. This records the resolved source extents and data population separately; prior receipts do not replace the source text.

Also read the collaboration-framework entrypoint, project-management wayfinder and applicable canonical-worktree/top-down guides, implementation-prompt authoring/intake guidance, work-verification evidence-strength/independent-verification guidance, testing discipline/validation-gates guidance, scientific-methods controlled-constants/measures/evidence-capture/comparison guidance, and JavaScript/Deno domain guidance. No other agent's attestation is treated as this CC's reading.

## Baseline and artifact identity

- Planning worktree: `/Users/oubiwann/lab/lykn/lang/.worktrees/planning`, branch `planning`, HEAD `99e0a2c8aa6562249b868b9fbf012fc75b1db177`; this index is clean at intake.
- Read-only source: `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x`, branch `release/0.6.x`, HEAD `5408abd432b8789ae474a3895436f68818c4e482`; source is clean. Release CLI at `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/target/release/lykn` is version `0.6.0`, SHA-256 `85d6d3d528c404873bae712ebc8594d0d7a5dacaeffecba2c388fbe7f19f87fc`.
- Deno's path named `/opt/homebrew/bin/deno2.9.6` in the plan is absent. The existing `/opt/homebrew/bin/deno` resolves to the Homebrew Cellar 2.9.6 executable, reports Deno 2.9.6, and hashes to the assigned SHA-256 `2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74`; the existing binary is the pinned executable used below.
- Cached Acorn ESM `/Users/oubiwann/Library/Caches/deno/npm/registry.npmjs.org/acorn/8.17.0/dist/acorn.mjs` hashes to `1cbcbf252a5800e496dc505c706f309a9dd4e1789392e12963c77ae9497ff6f7`. This is the literal cached npm-distributed third-party artifact; it is not an authenticated-origin or acquisition claim.
- Slice14 parser core source hashes to `6ca1afe83d6d9a47f7eb1fea7f0aa3872ae626cc4f39d5b3ed017aab38308bf7`. Original Slice12 controls hash to `0f20dba4713b93671b337fa1ba0a5cde00fdbe29bed195a00e3ae1c689473a5d`.
- Reused task checkout is `.worktrees/contract-predicate-lowering`, branch `codex/async-expression-values`, HEAD `5408abd432b8789ae474a3895436f68818c4e482`, clean. Only its owned ignored `target/slice17` is used for generated output and caches. Temporary compiler cwd/config-absence proofs are under fresh `/private/tmp` ancestry.

## Contract readback: behavior and equations

The walker measures conservative *potential load-time evaluation*, never runtime-observed effects or arbitrary-code purity. One direct record is associated with each `Program.body` parent in source order; nested reasons are separate counts. Functions, method bodies and instance initializers are explicit deferred boundaries. An IIFE gets the outer call reason, not body descent. Member reads, unknown reference identifiers, spreads, destructuring, coercions, class heritage/key coercion, static fields/blocks, calls/new/tags/await/dynamic import and control/throw paths retain the accepted conservative rules. Static imports and re-exports form dependency edges; bare static imports also increment the bare-import observation. Evaluated node/field roles are explicit; an unknown visited type or unlisted evaluated child fails closed. Absent `loc`/`range` on K12 stays null and does not block recording its unsupported node.

Foreign ESTree and status JSON are validated boundary data. Internal closed roles/outcomes use private ADTs and `match`; parsed status strings remain the required wire representation. The walker is pure and does no IO, parser loading, import resolution or source execution. Scanner parser identity is checked before a literal Acorn file-URL import; a gate failure makes required rows `not_processed`. Fatal UTF-8, actual NotFound versus NotCapable distinctions, actual diagnostics, exact identities/options, mutually exclusive row statuses and reconciled totals are preserved. Incomplete scans exit 2; findings alone do not invalidate complete scans. Scanner has no write/process/environment/network grants.

The 13 immutable controls run one child each in plan order: K11, K01–K09, K10a, K10b, K12. K01–K08 expected direct/reason counts are respectively 0/0, 2/3, 1/2, 1/4, 2/4, 1/9, 1/3 and 1/3; K08 also has 2 dependency edges and 1 bare import. K06's nine reasons include the two distinct static-block `CallExpression` and `start` `Identifier` findings at 4:11, as explicitly recorded in the full accepted oracle. K09 is a genuine parse error at pos 14 / 1:14. K10a grants the exact absent path and expects `source_missing`; K10b's staged existing file is proven outside the child and exact read is denied, expecting `source_unreadable`. K11 declares one required K01 file row with a zero hash but no input read; it must reject before import/parse. K12 directly injects `ExperimentalNode` at `Program.body[0]`; parser and source/file counts are not applicable. Thus the 12 file-condition rows partition as 8 complete walks, 1 parse error, 1 missing, 1 unreadable, 1 not processed; plus one synthetic unit outcome. The supervisor's predicted 13/13 is distinct from the scanner's expected incomplete/nonzero negatives.

## Source-cited application

- Accepted contract and finite semantics: Slice11 `artifacts/audit-contract.md`, §1 exact artifact/failure policy (lines 1–40); §2 potential/deferred/effect distinction and node/field table (lines 41–175); §5 controls, raw report shape and disjoint status equations (lines 392–519). Slice11 final `cdc-verification.md`, final affected-delta review and verdict table, accepts these as method only, not runtime evidence (lines 19–57).
- Immutable data/oracle: Slice12 `artifacts/controls.json`, `fullAuditControls` (lines 39–128), read as structured data in full. K06 states nine reasons, including CallExpression and identifier at the static block. Slice12 Phase B plan (lines 49–68) routes the fixed controls to the walker and keeps K12 synthetic.
- Reused code contracts: Slice14 `parser-core.lykn` uses digest-before-literal-dynamic-import and post-use hash check. Slice14 `offline-observer.lykn` demonstrates Deno.Command argv/env/cwd capture, exact-path grants, raw Uint8Array stdout/stderr saved before decode, and recorded results before assertions. It is a structural reference only; its old four-case oracle is not this gate.
- Parser prerequisite history: Slice15 `artifacts/parser-reentry/cdc/replay.md` records the independent fresh four-case parser prerequisite, actual raw-stream comparison and limits. It does not attest this new walker or any K01–K12 row.
- Lykn implementation guidance: source `skills/lykn/SKILL.md` at `5408abd`, relevant sections Bindings & Mutation, Functions, Types & Pattern Matching, Colon Syntax & Member Access, Modules, Error Handling, Async & Concurrency and runtime rules (lines 170–515); source `docs/guides/09-anti-patterns.md` for strict equality and boundary checks, safe collection mutation, error handling, type discipline and interop limits (IDs 01–02, 14–16, 36, 39–41). Apply immutable bindings, cells only for actual accumulators, typed functions/foreign `:any` at the boundary, exhaustive matches for closed roles, ordinary strict equality, and direct Deno APIs for IO/processes.
- Framework/testing/evidence application: the project-management open-set and preserved-assignment rules are already satisfied by the plan/prompt. Evidence remains raw-first; expected failures and unrun denominators are retained, exact native gates are run once at this scope, and CC attestation is not independent CDC acceptance. The fixed K rows are the operational measures and controls; no new control family or inference is introduced.

## Scope decision

No unresolved consequential design choice remains. Authoring is limited to four Lykn modules under `artifacts/tooling/`, README, unchanged Slice12 control copy, frozen predictions and CC evidence. The full-corpus audit, product/compiler changes, extra dependencies, new controls, production effects, full Make and any release/push/merge remain outside the endpoint. All implementation and generated-code gates must pass before the 13-row gate starts; a real parser/compiler/offline/coverage/oracle gap stops all downstream cases without a workaround.

## Iteration01 clarification readback

The preserved initial prompt was amended before source/check/runtime. The active
iteration explicitly resolves the Deno executable to `/opt/homebrew/bin/deno`
(version 2.9.6 and the same pinned hash), and records the failed lookup of the
concatenated nonexistent path as a metadata error. It also fixes the CLI
contract: scanner takes one absolute manifest path; `kind` is `file_scan` or
`synthetic_unit`; file rows use K11's 64-zero `parser.expected_sha256` pre-read
gate; synthetic K12 has no file rows/parser activity. Observer takes exactly
eight absolute args, in order `CONTROLS DENO SCANNER_JS CORE_JS WALKER_JS
TASK_ROOT CACHE_ROOT CONFIG_FREE_CWD`, and the task/cache roots must not exist
before invocation. Zero-argument behavior is frozen before runtime: core/walker
load successfully with empty streams; scanner returns exit 2 and exactly one
JSON usage record declaring 1 expected/0 actual args plus LF and empty stderr;
observer does the analogous 8/0 record. Their guards precede file IO, Acorn,
or child processes. These are module prerequisites, outside the 13 cases.

Source/domain details completed after the initial intake draft: Lykn functions
use typed parameters and implicit final values; internal closed roles use ADTs
and exhaustive matches, while ESTree remains validated foreign data. Use
`get` for computed foreign fields and explicit Deno APIs. Cells are reserved for
real accumulators, equality is strict, errors are rethrown or preserved, and
interop stays narrow. The relevant current Deno guidance confirms ESM file
extensions, no Node execution helpers, typed boundaries, secure granular
permissions and raw Uint8Array/file APIs. The four fixed controls' raw bytes and
their predeclared oracles were completely read before any authored tool code.

## Correction1 source readback

Current pinned source guidance for the corrective pass was reread directly:
`docs/guides/00-lykn-surface-forms.md` shows literal match clauses as
`(pattern result)` at 471–515, mutable C-style iteration as `(for (let i 0)
... (++ i) ...)` at 899–915, and `try` clauses at 917–930. `docs/guides/03-error-handling.md`
ID-09 (lines 255–285) uses prefix `(instanceof error ErrorType)` and handles
only known errors before rethrowing; ID-10 reinforces rethrowing unknown errors.
`docs/guides/05-type-discipline.md` ID-04, ID-18, ID-24/25 (126–169, 470–502,
602–645) grounds closed internal roles in zero-field ADTs and `match`, with
exhaustiveness. Foreign ESTree objects and JSON status strings remain validated
open data at the boundary, not internal ADTs. Rechecking the exact unchanged
parser-core at Slice14 shows `(exports load-parser verify-parser)` only; its
digest helper is private, so the scanner needs its own private local digest.

The consolidated findings map to the existing contract: R1 restores these
actual surface forms and the node/role table; R2 obeys the async function and
private core API; R3 restores Binding/Name/Reference role behavior and finite
coverage; R4 retains only observed identities, positive Program and real status
partitions; R5 makes assertions discriminate the original fixed controls and
preserves raw evidence first. Control/prediction bytes remain frozen.

## Correction1 sequencing amendment readback

Iteration03 changes sequencing only. I will commit a partial correction1 freeze
of all actual module bodies, unchanged core/control bytes and predictions, with
the observer explicitly marked unfinished and not runtime-ready. The saved
current-8 bodies are historical snapshots; they do not represent every
intermediate. The already-reported missing intermediate scanner snapshot remains
a capture-process nonconformance; no check or runtime consumed that missing
body. From the exact commit, only stable walker/scanner pinned native checks run
from config-free copies; no generation, Deno check, guards or capability case is
permitted at this partial stage. Complete observer predicates and all original
final source/generated/runtime prerequisites remain required. The earlier
native-0001 core check exited 0; its 80-byte stderr is normal success
information `(7 top-level expressions)`, not a warning. No capability runtime
has run (0/13).

## Correction2 source readback

Iteration04 spends correction2/5 after the independently reproduced f2c2a60
syntax failures; no source edit followed that freeze before handoff. The exact
walker failure is structural: `walk-program` leaves the numeric `for` open
after its final `swap! direct`, so the aggregate result begins inside the loop
and the function remains unterminated. The scanner parser-gate `try/catch` is
still open before `bind rows`; its failed-gate `for-of` branch also remains open
before the sibling success `do`. These intended form boundaries, not EOF
padding, are the correction target. Preserve the actual failed sources and raw
native-0004/0005 results. Both CC and independent CDC checks exited 1 with empty
stdout and the recorded unterminated-list locations; neither was a compiler gap.

Observer obligations remain incomplete at this partial point: the fixed IDs are
checked before writes and K10a/b use distinct paths with the existing K10b input
omitted from the child read grant; K11 uses the K01 source identity and leaves
observed hashes null. The candidate has not yet asserted every frozen reason's
type/path/category/loc/range or all §5 partition equations, and it is explicitly
not runtime-ready. No source generation, module guard, or capability case has
run (0/13). After intended boundaries are repaired, freeze before the two
native checks; if either fails, return before more semantic source editing.

## Correction3 source readback

Iteration05 is correction3/5. Before editing, I preserved all four actual
333b209 module bodies under `artifacts/evidence/cc/correction-03/baseline/`.
The pinned native feedback is ordinary source syntax: walker `flag-unlisted`
leaves its function open before `check-unlisted`; scanner `scan-row` leaves the
read, decoder, and parse try/catch scopes crossing into their following guards;
and `scan-file-manifest` is not fully closed before `scan-synthetic`. The fix
must close each intended local boundary, keep `walk-program` outside the parse
catch, and leave `(express result)` as `scan-row`'s final value. The observer is
still unfinished: its existing candidate checks K10 path/grant separation and
K11 unread hashes, but lacks the full per-reason type/path/category/loc/range
oracles and §5 aggregate partitions. CDC reports no runtime (0/13), and its
wrong-CWD empty-input check remains non-evidence. Freeze before only the two
native checks; a failure returns before further semantic edits.
