# Slice09 — Lykn research helpers

Status: open. Current assignment: `cc-prompt-iteration01.md`.
Collapsed standalone Project03 increment; no new arc or project. Artifacts:
`artifacts/tooling/` holds reusable Lykn research helpers and their usage;
`artifacts/evidence/` holds actual parity/control receipts. Generated JS and
temporary inputs belong only in the task checkout's ignored `target/slice09/`.
This is explicitly authorized research tooling, not a product compiler change.

## Authority and endpoint

On 2026-11-06 Operator requested replacing the Python helpers with Lykn,
retaining originals only for development parity and deleting Python code when
done, plus an explicit no-Python rule in AGENTS and CC prompts. This overrides
earlier current-tree preservation only for the identified Python code; Git
history, hashes, stderr/status/data and factual outcomes remain preserved.
It does not authorize a repository-wide Python purge or a compiler repair.

Same Autonomous roles: CDC OpenAI Sol 6.1 High designs/independently reviews;
fresh CC OpenAI Luna 6 High implements. Root transports and performs read-only
lookups. Five refinement iterations maximum. Endpoint: usable Lykn helpers,
meaningful parity/negative controls, scoped Python deletion, synchronized
seven-home guidance and independent review/retrospective; or an honest actual
language/tool blocker. No merge, propagation, push, publication, dependency or
toolchain acquisition, new backend, production-library work or full pilot rerun.

## Baseline and inventory

Planning starts clean at 7048fba9c5da1fefef4659d9c668d0b01d4616eb.
Read-only source/API baseline: reused task checkout
`../contract-predicate-lowering`, branch `codex/template-string-boundary`,
clean a061c2149792178ba037d17a31220545e34b4ac1. Product source stays unchanged.
Use its already accepted native compiler, SHA-256
544041ecf2ff61a9b1b3338ed08728a12db549a69dbcadfa644a30d39bfb908a,
and Deno 2.9.6 at `/opt/homebrew/bin/deno`, SHA-256
2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74.
The task branch need not be renamed or recreated for research tooling.

Concrete code under Slice08 `artifacts/evidence/pilot/run-01/raw/`:

| Original | SHA-256 | Git blob at planning 7048fba |
| --- | --- | --- |
| `staging/export-map-check.py` | 8bdaed8398d03e491cb6b349c7d764fc5d8066a6bf1d2467161d037dee105865 | 37e39ae6bc285a9a6212efd6725b5e1e1222562c |
| `gate/launch-setup-error-01/command.txt` inline Python | 01b6100ba22d690908dcda64c0bd89e9f4d0cf6fab73cd384e3a493dee060797 | dbf448910ab1ac9ad9ab286b4c435f9c24c4c60a |

Each has an ignored duplicate under task `target/slice08/pilot/run-01/raw/`.
Verify complete scoped inventory before deletion: all Slice08 tracked files
and task `target/slice08/`, including non-.py inline executable text. Other
historical projects/scripts, including Slice03's catalog, are outside scope.
Broader Python compile/build/staging/copy orchestration is attested in Slice08
results, but its program source is not known to be retained. Do not fabricate
it or claim exact-code parity for missing programs. Source and failure records
remain accessible at their original Git identities after authorized deletion.

## Binding implementation and oracles

Author all new logic in surface Lykn. No Python helpers, validators, evidence
processing, JSON operations, command construction or orchestration; no Ruby,
Fennel or handwritten JS/Node replacement. Native shell/CLI is only for direct
invocation and simple filesystem lifecycle, not a replacement logic language.
Only the exact frozen original validator may execute temporarily for this
Operator-authorized migration parity. No edits/new Python or wrappers. Pin the
existing Python executable and original source before that run. The broken
inline builder is not useful as an executable oracle and must not be repaired.

1. `artifacts/tooling/public-check.lykn WORKSPACE` replaces the real validator.
   Preserve its exact positive stdout: json/yaml/effects order, key order,
   Python `True` spelling, nine export count and the 13 checksums in their
   original order. Compare exports structurally: exactly the original keys and
   target strings, independent of JSON property order; require declared targets
   and all 13 public files to be regular files (following symlinks as original
   is_file did). Parse with JSON:parse, get dynamic fields with `get`, inspect
   Object:keys/hasOwn/entries; never use stringify equality for maps. SHA-256
   must hash actual readFile bytes using crypto:subtle:digest and lowercase
   two-digit hex. This helper EMITS hashes; it does not compare them to a frozen
   baseline. Content mutation therefore changes its digest and still exits 0.
   Missing/wrong/extra exports and missing targets fail nonzero with context.
   Workspace is an argument, replacing the original hardcoded location.
2. `artifacts/tooling/orchestrate.lykn MANIFEST RECEIPT-DIRECTORY` replaces
   needed ordering/child/copy/compare logic. Manifest is `{actions:[...]}`;
   actions have `kind` command/copy/compare. Command fields are absolute
   `executable`, string-array `args`, absolute `cwd`; copy fields `from`,`to`;
   compare fields `left`,`right`. Validate these shapes before executing them.
   Create a NEW receipt directory, use numbered per-action directories, write
   attempt JSON before each action. Commands run sequentially through
   Deno:Command with clearEnv true, fixed PATH `/opt/homebrew/bin:/usr/bin:/bin`,
   DENO_NO_UPDATE_CHECK=1 and NO_COLOR=1, stdin null, stdout/stderr piped.
   Pass argv directly, never through a shell/eval. Await output; write raw
   Uint8Array stdout/stderr and code/signal/argv/cwd/environment JSON BEFORE
   propagating a nonzero child code. Never decode/re-encode raw bytes. Copy
   uses actual bytes and createNew true: no destination clobber. Compare uses
   actual byte lengths/elements, records equality, exits 1 on mismatch.
   Stop before every subsequent action on failure. Unexpected I/O/spawn errors
   remain nonzero with the prior attempt receipt, not invented success/code.
   This is a small local action runner, not a supervisor framework.
3. `artifacts/tooling/check-helpers.lykn` and one small
   `child-fixture.lykn` provide the finite behavior checks below. No new test
   dependency, JS harness, generated-source patch, eval or kernel workaround.
   An actual compiler/language blocker stops dependent work for CDC disposition.

### Fixed comparison/control population

Freeze predictions/actual helper source before execution; retain every failure.
Original positive: execute the unmodified Python validator once against its
existing accepted hardcoded workspace, without mutating that workspace; execute
Lykn on the SAME inputs and require stdout byte equality and exit 0. Preserve
both outputs and all input hashes. Do not call negative or portability checks
exact Python parity: the original accepts no workspace argument.

Lykn validator cases V0–V7: V0 same positive; V1 clone with reordered export
properties still passes; V2 missing export, V3 wrong target, V4 extra export and
V5 missing target each fail nonzero; V6 exactly one public JS file byte mutation
still passes and changes exactly that emitted digest; V7 unchanged clone under
space-containing paths has byte-identical positive output. Clone only into
owned scratch; leave accepted source workspace and existing evidence untouched.

Orchestration cases R0–R3: R0 real pinned strict Lykn compile of the tiny child
under paths with spaces, actual Deno child invocation with spaced/literal-shell
metacharacter args, new-file copy and byte comparison all succeed in order;
assert captured argv, code 0 and exact stdout/stderr. R1 child writes fixed raw
stdout `[0,255,10]` and stderr `[1,254,10]`, exits 7; both files match bytes,
recorded/outer code is 7 and a following sentinel action never runs. R2 unequal
byte comparison fails 1, records false and prevents its sentinel. R3 existing
receipt directory or copy destination fails without altering existing bytes;
use one fixed pre-existing destination setup and assert no later action.
The child behavior and expected data belong in Lykn, not shell snippets.
These prove useful reconstructed functionality, not nonexistent original-source
parity. No rerun of the unrelated five-bundle/eleven-runtime pilot is required.

## Guidance, deletion and acceptance sequence

Seven homes: main, release/0.6.x, release/0.7.x, release/0.8.x, planning,
native-esbuild-controls and template task. Expected clean source tips are
1dc8583, b841f71b, d51f494, e0356ee, 9be0c301, a061c214 respectively.
Revalidate before each mutation. Only AGENTS.md may change in source homes.
Replace its weak “prefer Lykn” research sentence with the explicit rule above,
retain all other governance and relative CLAUDE.md symlink. Require every new
initial/iteration CC prompt to repeat the rule and any exact temporary parity
exception; do not silently rewrite historical issued prompts. No local reusable
CC prompt template was found in tracked planning paths; the host framework's
template is not repository-owned and must not be edited.

First CC returns working helpers/parity/control evidence and policy candidate;
original Python remains only for independent parity review. CDC independently
reviews/replays. Then a preserved cleanup iteration deletes the tracked .py and
ignored duplicate, and replaces inline Python command.txt bodies in both homes
with dated locator/hash/failure explanations (no retained code block/copy).
Preserve stderr, exit status, outcomes and other raw data; update stale active
usage references to replacement/locator. Never amend old history or erase the
process finding. Final scan establishes absence in the scoped current tree and
owned ignored helper paths, not a claim of global repository Python absence.

Checks: native Lykn check/fmt/lint on authored sources, fresh strict compilation
and manual generated-output review, actual V/R behavior; six committed-source
citation gates after AGENTS commits; seven AGENTS byte equality/CLAUDE relative
targets/modes; explicit path/code-scope/metadata checks. No Rust/product source
changes means no repeat of full Rust make check. No scope gate is waived.
All original F1–F12, NE-C02/04/D01 and Project07 obligations remain open.

## Applied guidance and author readiness

Source/API baseline a061: Lykn reference object/get/receiver/async/error forms,
anti-patterns ID-01/18–20/31/35/37–40 and Deno guide ID-01/02/05/07/09 guide
structural equality, awaited receiver calls, strict types, no eval, raw-byte
output and granular permissions. Domain JS/Deno skill's async/error/no-Node
sections govern API use, not permission to author JS. Pinned Deno types confirm
CommandOutput Uint8Array and writeFile Uint8Array/createNew. Existing frozen
driver command/digest/public-snapshot shapes are proven examples; its decoded
save-result is deliberately NOT copied for byte evidence. Scientific comparison
guidance separates exact positive parity from stronger new controls and missing
original-code coverage. Testing requires actual child failure and no-clobber
sentinels, not mere source presence. Framework/PM/authoring contracts reloaded;
unchanged prior role/posture/source policy remains applicable. No new language
semantics or architecture choice is left for CC to select.

## Assignment history

- 2026-11-06 initial `cc-prompt.md`: prepared for fresh Luna High execution;
  working helper/parity/policy return precedes independent review and deletion.
- Initial return 888b1f6a: policy delivered; helper/control candidates and
  wrong-tool provenance retained. Zero accepted V/R controls or Python oracle;
  one pre-freeze standalone child attempt. Latest compiles used stale global
  c02d3b84, invalidating apparent current-compiler blocker/green claims. CDC
  recompile of the same public source with accepted544041ec disproves the
  claimed blocker; actual evidence is in artifacts/evidence/cdc-pin-recheck/.
- 2026-11-06 iteration01: correct exact tool invocation, actual source boundaries
  and fixed case oracles/R0 compile action, then execute original parity/control
  population. No compiler prerequisite or source repair authorized or needed.
