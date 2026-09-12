# Research protocol RP01

Prepared 2026-09-12; CC-attested design for later execution. Baseline:
[B01](baseline.md); case contract: [FM01](fixture-matrix.md); source claims:
[source register](source-register.md). This slice's completion means an
inspectable protocol with honest prerequisites, not executed format evidence.

## Questions and decision use

Can Lykn express a JSON or YAML read/parse/edit/write workflow with explicit
representation, validation, failure, permission and fidelity boundaries? Which
native facilities suffice, and which additional dependency or language work is
necessary? A case with lost numeric tokens, collapsed keys, unbounded expansion,
permission escalation, or unexplained source-byte changes counts against a
lossless/policy-compliant claim even if the output parses successfully.

Use an exploratory case series first. Freeze each expanded fixture/options
manifest before a confirmation run. A correction comparison changes one
variable: package API/options, guide text, compiler or runtime revision. Run
unchanged fixtures and preserve contrary outcomes. A bundle change cannot
establish which component caused the difference.

## Execution homes and opening requirements

Durable S02 research belongs in its future owning `artifacts/` directory on
planning; S03 and S04 follow the same convention. **Their prompts must enumerate
exact source/input/output/log paths before writes**; these are recommendations,
not additional paths authorized by Slice01. Keep research modules at their
package root if using a workspace. Generated JS/config output belongs under
`target/lykn/` in a disposable run directory, never hand-authored into source.
Do not use `lykn new` for this setup: it initializes Git, unnecessary here.

For execution, use a fresh directory created by:

```sh
trial_dir=$(mktemp -d /private/tmp/lykn-p07-trial.XXXXXX)
```

Record its actual absolute path in the durable run packet. All editable fixture
files, destinations, siblings used for replacement, failure injection and
isolated cache live below it. No source/release/book tree is a runtime output
location. S02's opening must preserve the exact original `.lykn` inputs and data
fixtures in planning before invoking them; copy them to this disposable home.
Never overwrite an earlier attempt. Preserve outputs in the owning artifact
paths before cleanup; `/private/tmp` alone is not a replay artifact.

## Preflight: available baseline and explicit gates

1. Rerun B01 identity commands and `git status --short` in all source homes.
   Identify every changed baseline field. Select the existing absolute CLI path
   from B01; do not resolve a different CLI through PATH. Pin the Deno path too.
2. Read this protocol, relevant case rows, actual source-branch Lykn SKILL and
   selected guides. Record exact revisions/sections actually loaded. A guide
   update starts a new condition, not a silent B01 refresh.
3. Record the source/binary provenance gap. Version text and matching
   bin/release hashes do not prove a source build. If strict source-to-binary
   attribution is required, open an authorized build/provenance step first.
4. **Resolve D-2609-PERM before runtime trials.** At B01 the `run` source inserts
   `-A` and help has no permission-forwarding surface. Do not execute `lykn run`
   assuming flags after FILE restrict Deno. CDC must open a narrow correction
   under Arc03 or obtain an explicit operator-authorized research launch route.
   Record effective child argv and a denied-read negative control before any
   permission-sensitive case. A direct-Deno route, if authorized later, still
   runs CLI-generated code from retained Lykn programs; it is not permission
   to hand-author a JS replacement. **No such exception is granted here.**
5. **Resolve D-2609-YNOD before executing @eemeli/yaml 2.9.1.** It has live Node
   API imports. Static comparisons can continue. Preserve the document workflow
   requirement; evaluate a compatible candidate or record operator policy
   disposition rather than deleting Y-14.
6. Freeze package versions and schema/options. For package cases retain the
   complete import map, generated effective config and lock. `@std` names or
   top-level exact pins do not freeze transitive ranges. S02/03 must capture
   their actual graph before interpreting results; S04 performs the complete
   policy/compatibility audit. No npm or Node API additions under current scope.

Available read-only checks (confirmed `--help` shape, no runtime format execution):

```sh
research_cli=/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn
research_deno=/opt/homebrew/bin/deno
"$research_cli" --version
"$research_cli" compile --help
"$research_cli" run --help
"$research_deno" --version
```

After a future opening writes a retained case to the isolated directory, use
CLI source operations with that directory as cwd:

```sh
cd "$trial_dir"
"$research_cli" check case.lykn >check.stdout 2>check.stderr
check_status=$?
"$research_cli" lint case.lykn >lint.stdout 2>lint.stderr
lint_status=$?
mkdir -p target/lykn
"$research_cli" compile case.lykn -o target/lykn/case.js >compile.stdout 2>compile.stderr
compile_status=$?
```

Record all three statuses separately; never interpret a later successful
command as erasing an earlier failure. These commands are future templates,
not claims of successful execution in Slice01. Runtime command remains a
mandatory concrete field in the next opening **after the launch gate is
resolved**; inventing working CLI permission syntax would weaken the evidence.
Do not use --strip-assertions or --no-strict except in specifically labeled
L-06 comparison variants. Formatter evaluation operates on a copy and retains
before/after bytes. Do not post-process generated JS with a formatter/linter
as a repair; report generated-output defects.

## Permissions, dependency resolution and file operations

Parser-only trials request no application file/net/env/run access. Read/write
trials grant only the isolated input/output directories, with no prompt-based
implicit expansion. Denial variants explicitly remove one grant and suppress
interactive prompts through the approved launch mechanism. Package fetching is
an explicit setup phase; application network permissions and module-download
policy are distinct. Put DENO_DIR under the isolated root; do not mutate the
user's cache. Prefetch exact pins via the permitted infrastructure route only
once the owning prompt enumerates it; retain graph and lock first, then replay
with cached-only/frozen resolution using flags verified for that CLI/runtime.
Cold-cache offline failure and warm-cache offline success are different cases.

No destructive real disk-full test. Failures use a missing fixture, a permission
mode on an isolated directory, or a declared injected failure at open/write/
flush/rename. A simulated failure proves handling at that injection point,
not real filesystem behavior. Restore only fixture modes. Stop if any path or
symlink resolves outside the isolated root.

For proposed safe replacement: preserve original bytes; write a unique sibling
temp file; complete write and flush/close; rename only after serialization and
validation succeed; record cleanup after failure. Observe reader-visible
atomicity separately from power-loss durability, permissions/ownership and
symlink behavior. Do not claim cross-platform guarantees from Darwin. A
cross-filesystem case stays unavailable when no suitable isolated target exists;
never create a mount or modify a real destination to manufacture coverage.

## Exact recording format

One durable record per case variant and attempt:

```text
run_id: <case>-<variant>-<attempt>
protocol: RP01; matrix: FM01; condition: baseline|exploration|correction
UTC_start/end; operator/agent role; model/settings or unavailable
original_task: exact text; original_input_path/hash/bytes
compiler_path/version/hash; source_repo/branch/commit/dirty_paths
runtime_path/version/hash; OS/filesystem; cwd
package_pins; resolved_graph; import_map; effective_config; lock_hash
references_actually_loaded: path/URL, revision, section, access order
permissions_requested/effective; full_command_and_environment_overrides
stdout_path/hash; stderr_path/hash; exit_code/signal; wall_ms; max_RSS
raw_input/output_paths_and_hashes; edit_operation
observed_value_tree; own_key_presence; graph_identity; byte_difference
expected_invariant; outcome: pass|fail|unsupported|blocked|not-run
observation; interpretation; alternatives; deviation; discovery_ID
correction_attempt_links; operator_comment/disposition: pending|verbatim
```

Retain logs before interpretation, including failed compilations, partial
stream output, warning callbacks, timeouts and operator interventions. Redact
only real incidental secrets, recording the redaction; all fixture content is
synthetic. Source provenance and checkable locators survive redaction.

For values, compare an independently stated expected tree, not merely
parse(stringify(parse(input))). That round trip can conceal loss on the first
parse. Record Number token/value separately, own keys separately from values,
Date/Map/Set kinds explicitly, and aliases with stable traversal IDs. Do not
serialize observation records through the same lossy conversion being tested.
Use bounded Lykn inspection that emits tagged textual facts, including cycle
references; inability to express it is an actual capability finding.

For bytes, compare original, no-op rewrite and edited rewrite independently.
Record sizes, hashes, exact differing ranges and whether each change is the
intended edit, permitted normalization or unexplained loss. “Parsed values
match” never closes a document-preservation case.

## Resource controls and stopping rules

Initial payload limit is **8 MiB** (total encoded input cap **9 MiB**, allowing
format delimiters), nesting **256**, alias DAG depth **12** and
fanout **2**, output **16 MiB**, per-process wall time **10 seconds**, observed
RSS stop threshold **512 MiB**. These are protocol budgets, not package claims.
A future Lykn supervisor must enforce wall/output bounds externally to the
parser process; an in-process timer cannot interrupt synchronous parsing.
Capture peak RSS with the host measurement tool and monitor the threshold;
if reliable process termination/RSS observation is unavailable, mark resource
execution blocked and open the tooling prerequisite. Never claim a hard memory
cap from sampled RSS alone. No stress trial runs before the supervisor is
verified on a bounded timeout control.

Start with smallest variants, stop that family at a cap/failure and record larger
variants not-run with the same owner and re-entry condition. Retain unsupported
cases. A new dependency, source fix, actual compiler gap, policy conflict,
write escape, or missing original task triggers a stop of the affected route
and project finding. Continue independent inspection; do not improvise a
fallback language or broaden permissions. Five correction iterations maximum
before re-assessing slice size, preserving all cases in any split.

## Controls and analysis

Keep input bytes/edit, runtime/compiler, package pin/options, launch permissions,
cache state, host, validator and result format fixed in a paired comparison.
Change one named factor. Repeat deterministic functional cases in two fresh
processes; timing characterization uses one warm-up plus five measured runs,
reports all values and median/range, and makes no population performance claim.
Order package conditions alternately where practical; report unavoidable order
and cache effects. Never tune acceptance thresholds after seeing a result.

Threats: binary/source mismatch; package/type-check drift; schema names hiding
implementation differences; first-parse information loss; coupled serializer
oracle; in-process timeout failure; filesystem/platform dependence; candidate
selection bias; memory/model contamination; and operator/evaluator familiarity.
Separate raw observations, measurements, inference and proposed decision.
Record runtime results only after execution. Format synthesis requires S02–04
and arc-level independent replay; authoring/human acceptance follows the
[separate evaluation](authoring-evaluation.md).
