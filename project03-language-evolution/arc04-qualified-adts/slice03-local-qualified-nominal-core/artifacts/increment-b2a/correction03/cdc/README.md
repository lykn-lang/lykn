# B2a correction03 independent verification — intake

Separate Sol6.1High CDC, 2026-11-13. Source/build exclusively held for independent
review at clean0e249cafb7d50ce45e00f7c7288249666fcc113f,
treee946afc2283951fe11f2e9c7040a7f734dbf6d11. No source edits authorized.
Root owns planning Git/index/ledger/design. B2-ID-NAME/B2b/LC02–08/S03 remain open.

Read source AGENTS and issued iteration12 / actual correction03 CC index.
First combined read was tool-truncated; remaining required extents will be
recovered before first product invocation. Existing R01–05 independent records
and original recipe remain authority, with correction03 public atom-name scope
and shared type-field reach. No broad raw kernel/class header-validation claim.
Read actual diff, parser/dispatch/region callers, preserve exact diagnostics
and actual once-only effects. Focused tests first; known-bad finding halts full.

All new evidence logic is Lykn; no Python/Ruby/Fennel/handwritten JS helpers,
source changes, release/remote/dependency action. Common command/env will be
recorded before invocations; raw streams and numeric statuses remain canonical.
CC count/gzip arithmetic is not inherited: actual correction02 gzip46503,
current CC46600 implies+97 and35320 bytes headroom if independently reproduced.

Intake completion before first product invocation: issued iteration12 recovered
through EOF, CC index baseline/failure/full/postcommit/closing sections recovered
separately after initial combined truncation. Read root public scope note490+,
ledger/current slice row, complete original recipe, affected native/public diff,
13-path inventory, literal contiguous commit trailers, current source parser/
region/ScopePlan and M6 consumers plus tests. Refreshed testing/Rust/JS guidance
entrypoints and pertinent named type/error/API constraints; prior loaded full
discipline/gates and collaboration evidence guidance remain applicable.

Implementation review: thin native adapter invokes existing classify_form_inner
without binding capture only at terminal SourceFunction (Some/None), filters
raw kernel heads; all clauses parse before regions. Genfn descriptors are named,
backend-local args-relative records with original count/marker/error priority;
projector offsets preserve original occurrence paths. Public atom guard follows
missing-name check. Type-field parser reach is explicit. No architectural or
source-scope contradiction found at intake. Fresh focused verification starts.

First authored public replay selected the expected atom diagnostic for the first
case, then stopped at duplicate macro definition on case2 because the replay
had not reset the existing macro registry between independent fixture programs.
This is a harness-isolation error, not a candidate B2-LX failure. Original
source/output/status are preserved as attempt01. Replay retry resets macros
per fixture and corrects two expected stdout strings after inspecting their
fixtures (they log the next value41, not Array.from). No raw result is erased.

## Independent disposition — HOLD R05 retained in native host-policy client

Candidate0e249caf fixes the exercised typed-header preflight and native/public
D2 Genfn metadata boundary, but **B2-LX remains HOLD**: native whole-unit
protected-host validation still treats consumed/ignored generator syntax as
executable code. This is the same R05 structural-role requirement, found before
full gates. No claim is made that this behavior first arose in correction03.

### Actual supported native causal pair

`fixtures/genfn-protected-string-metadata.lykn`:

```lykn
(bind factory (genfn () :yields (set-symbol! Array "isArray" 1) (yield 41)))
(bind stream (factory))
(console:log (get (stream:next) :value))
```

Actual native checked compile exits1 at1:46 with
`host-contract v2: write to protected slot Array.isArray`. The classifier/body
layout consumes and ignores that nonkeyword annotation payload; no write would
be emitted. Native protected_host.rs735–746 nevertheless groups genfn with
fn/lambda and visits args[1..], including the :yields payload. Its lexical
function_scope_names calculation also receives that unselected metadata.
The paired real-body fixture moves the same string-key write into the actual
body after `:yields :any`; compile exits1 at1:51, correctly retaining the
protected-write diagnostic. Neither failed compile emits a module.

The first suggested keyword-key pair `(set-symbol! Array :isArray 1)` compiles0
in both metadata and body. These attempts are preserved but do NOT discriminate
rejection: existing native record_symbol_write474 and public write logic482
prove only literal STRING keys. Keyword keys are Unknown under that current
proof. This finding does not authorize expanding protected-key proof policy.

### Public route and explicit input-domain limit

Actual canonical public `lykn` accepts the string-key metadata fixture, emits a
generator containing only yield41, and actual generated ESM executes0 printing
41. The same write in the actual body is rejected with the protected-slot
message. This supported public route is green.

The direct deep `validateProtectedHost(read(rawSource), dependencies)` call
rejects both metadata and body. Its JSDoc explicitly says complete expanded/
kernel input; the actual caller is compiler.compile after public expansion,
with no source dialect parameter. Thus this raw-source observation is retained
as an API-domain limit, NOT a supported-public-route failure or a mandate for
a new public source validator. Root owns that boundary decision.

### Same-causal ignored generator post

`genfunc-protected-post.lykn` uses existing selected `:args ()`, ignored
`:post (set-symbol! Array "isArray" 1)` and real `:body (yield 41)`. Native
compile exits1 at1:46 with the protected-slot diagnostic. The same write moved
into actual body also exits1 at1:46, correctly. Native Surface Genfunc handler
699–729 pushes and visits clause.post even though the generator writer ignores
post under the explicit B2a contract. This is another executable/structural
client mismatch, not authorization to implement generator post/returns.

### Narrow source facts for root repair

Native protected_host Surface branch670+ already parses named source Func/
Genfunc through authoritative pure classification. Parsed anonymous
SurfaceForm::Fn/Lambda/Genfn exposes typed ParamShape params and the selected
raw body, so the same existing boundary can avoid generic raw metadata walking.
Existing param_scope_names307 uses ParamShape.bound_names;
visit_param_defaults315 walks typed_params.default_value; function_scope_names329
handles the selected executable body. Raw kernel pattern/default grammar at
617+ remains distinct. Do not generalize this to a new parser or eager semantic
classification. Ignore Genfunc post for both name collection and visits;
ordinary Func post is executable and remains covered. Root retains design.

## Passing focused evidence, failures and unrun gates

- Native b2a_native selector:8passed,0failed,6filtered, exit0. Raw per-case
  CLI/runtime/status records replay R01–04 plus all six malformed typed-header
  families/later-clause rejection before body, valid body/default macros,
  inert Genfn metadata probe and eval payload, and actual-body D2 rejection.
- Canonical current-source public nine-file focused suite:85passed,0failed,
  exit0. Fresh `make fresh-artifacts` completed0 before this run. The selected
  files are explicitly in public-focused-invocation.txt. They cover current
  B2a clause/member/default/occurrence/result-slot behavior, retained quotes,
  re-entry/type isolation, private host fragments, strict bindings and browser
  compile/runtime. No broad complete-B2-LX claim follows from these focused
  files; original completion/private/Reflect populations remain full-gate work.
- Separate authored Lykn public R05 replay retry01:10 expected diagnostic cases
  and5 actual generated ESM runtime positives passed, outer exit0. Header
  registration-only, malformed named/default/anonymous fn/genfn/lambda/later
  clause all report ordinary parser messages without a probe marker. Missing
  genfn body and real-body strict binding reject; valid default, ignored probe,
  ignored eval metadata, no-yields and typed yields execute41.
- Native release/build staging via make fresh-artifacts:exit0. All cache/temp
  roots were created outside every repo/config ancestor before first product
  invocation; existing DENO_DIR reused, no cache ownership/edit action.
- One replay attempt stopped at duplicate macro registration because the
  authored harness did not reset macros per independent fixture. Original
  source/stdout/stderr/status remain; retry explicitly resets existing registry.
  Two stdout expectations were corrected from array rendering to the fixtures'
  actual next-value41 before successful retry. This is harness/oracle setup,
  not a candidate defect. A second tiny public protected-replay helper first
  failed native compilation for a missing else in an expression-position if;
  original source/diagnostic retained, retry01 added null and compiled0. No
  public product invocation ran from that failed helper build.

No full make check/docs/native1195/product1556/67steps, coldM6 fourteen/48,
complete copiedCLI/fresh-staged-browser/Reflect/completion/private census,
postHEAD citations or gzip was independently run after the new known-bad
finding. CC's raw gates remain CC evidence, not CDC acceptance. Its arithmetic
misstatements remain disclosed: correction02 actual gzip46503; current CC46600
would be+97, with35320 bytes headroom. No independent size claim is made here.
No old match golden is changed in the13-path candidate. A/B1/IC accepted limits
are unchanged; no owner/name/nominal/purity or LC02–08/B2b/S03 closure.

## Reproduction and source handback

Common environment/cwd is receipts/environment.txt. Direct product commands,
raw streams and immediate numeric status are retained from first attempts.
The new helper sources are Lykn, compiled runtime mjs only; no forbidden
research helper/dependency was introduced. No cache directories are archived.
Source diff/test delta/caller inventory and literal metadata are preserved.
Initial13-path inventory and contiguous Codex/Billo trailers independently
match root's pin; no metadata followup is needed for this commit.

Source remains0e249cafb7d50ce45e00f7c7288249666fcc113f,
treee946afc2283951fe11f2e9c7040a7f734dbf6d11, no source edits.
Final clean-source receipt and archive digest accompany final root handback.
B2-LX HOLD R05; root prepares the next formal correction without resetting
history. No release/integration/remote action, source Git/index mutation or
planning ledger/status change by CDC.
