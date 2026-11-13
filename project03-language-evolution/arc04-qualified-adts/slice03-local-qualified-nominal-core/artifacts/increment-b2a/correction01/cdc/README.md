# B2a correction01 independent HOLD — 804be5da

Separate Sol6.1High CDC, 2026-11-13. Source is clean at
804be5daace5b0cb708ad21b3beb7eecbd5d00fa,
tree d25f2b660d3de2e6f52b8ee890172f223c9abc80, dedicated
codex/qualified-adt-core worktree. Exactly seven authorized paths changed from
bcb98482. No source edits were made during review. Root owns planning Git/index,
ledger, status and architecture. Source/build ownership returns clean to root.

**B2-LX remains HOLD.** Original R01–03 have passing focused correction evidence,
but R04 actual enclosing-declaration transitions remain incomplete. This is an
unfulfilled iteration09 requirement, not necessarily a newly introduced defect.
A/B1/IC independent acceptance is unchanged. B2b/B2-ID-NAME, LC-02–08 and S03
remain open. No release integration or remote action occurred.

## New causal finding: B2a-R04 (P1)

The expander's actual-result policy is not shared by the later resolver, D2
and shadow state transitions. Public trusted wrappers also bypass declaration
unwrapping. Structural binder discovery is being used as following visibility.

### Ordinary bound calls falsely introduce native declarations

`resolver.rs:253–267` calls resolve_form, then unconditionally extends the
scope from hoisted_names of the original form. That helper is structural.

Exact source at fixtures/native-bound-declaration-hoist.lykn:

```lykn
(set-symbol! globalThis :array 100)
(bind bind (fn (:any left :any right) left))
(bind array 1)
(console:log (array 7))
```

The second bind head is a call to the local function; its argument array reads
the ordinary global property set above. It introduces no declaration. Native
compile exits0 but emits `console.log(array(7))`, then ESM execution exits1
with `TypeError: array is not a function`. Public compilation of the exact
source emits `console.log([7])` and executes0 printing `[ 7 ]`. Native renamed
ordinary-call control also executes0 printing `[ 7 ]`. The required native
behavior is the latter array literal, with the callback call retained.

### Wrapped declarations lose following visibility

- Native `normal-export-hoist.lykn` exports a function named array, then calls
  `(array 1)`. Compilation0 emits an actual exported function but replaces its
  following call with `[1]`; execution0 prints `[ 1 ]` instead of41. Public
  normal-export control executes41; native direct unwrapped function control
  executes41.
- Public `escaped-export-hoist.lykn` uses supported kernel:export wrapping
  kernel:function array. Compilation0 emits the exported function and `[1]`;
  execution0 prints `[ 1 ]` instead of41. The canonical source helper at
  expander-core.js:1126–1135 returns shallow hoistedNames immediately for
  isKernel, before wrapper recursion. Its embedded mirror is byte-equal.

### Default export needs its actual declaration slot

`default-named-function-hoist.lykn` emits `export default function array` in
both backends. This is a module binding. Native executes `[ 1 ]` instead of41;
public already executes41. The paired default-function-expression-control
places the named function inside a conditional default value. Both backends
correctly execute `[ 1 ]`: that name is expression-local and must not hoist.
All four compilations and materialized executions exited0. This distinguishes
named direct declarations from arbitrary descendants of a default expression.
The named-class fixture was authored but not executed; no class runtime claim
is inferred from it.

## Complete bounded caller and trust review

Raw query results are native-helper-callers.txt/public-helper-callers.txt.

Native actual transition clients: pass2 top37, source-body360, class-body448,
sequence561 (helper491 recursively examines all tailchildren at508); resolver
sequence265, source-body451, member567, shadow sequence804 and shadow member1029;
binding sequence240 and reference sequence257. D2 already gates incoming head
dispatch but still uses the shallow structural helper. Shadow's hoisted_sites
is also structural and retains spans/kinds which a replacement must preserve.
Raw binding/body-scope discovery remains a separate structural client.

Public transition clients: actualExpandedHoists at903/919/953/986/1017/1053/
1172/2131/2413 and its recursive wrapper path1133; D2 binding.js67 uses a
separate partial adapter. Public kernel escape producer marks the stripped
wrapper root, not its original children (expander-core.js1954). A shared query
must retain actual trusted-root priority without granting trust to an unmarked
child. Exact helper and producer excerpts are retained.

Normal native export writer1645 and classifier1066 consume the first payload
child; async classifier1103/writer605 likewise consume their supported child.
Public compiler.js960–1024 distinguishes default, names/reexport and normal
export slots. Its function784 and class1418 producers supply declaration kinds.
Default named declarations use the default value slot, unlike normal export's
first payload. Neither arbitrary extra arguments nor expression descendants
can provide enclosing declarations. Root's iteration11 sites-helper recipe
settles these facts without changing writer grammar or name/owner policy.

## Independent corrected R01–03 evidence

| Scope | Actual result |
| --- | --- |
| Native macro-result/sugar/multistep, genuine limit, escaped parameter and own-recursion product tests | 4/4 passed,6filtered, exit0 after setup-only retry |
| Native bound genfunc with/without unrelated macro | 1/1 passed,193filtered, exit0 |
| Native escaped named function and generator header compiler controls | 2/2 passed,192filtered, exit0 |
| Canonical current-source public lexical product suite | 11/11 passed, exit0 |
| Exact prior bound-chain fixture | native compile0, run0 prints41 |
| Exact prior escaped named-function fixture | native compile0, run0 prints7 |
| Exact prior class-default fixture | public compile0, run0 prints42 |

The public11 includes the actual once-only default macro count, constructor,
static wrapper, own-member shadow, clause isolation, post/body, result slots,
shared source occurrence and macro priority controls. The native product test
records exact actual sources, ESM, commands, streams and statuses under
receipts/native-product-retry01. Genuine runaway expansion returns normal
`expansion limit (1000) exceeded expanding 'alpha'` at its original source
position. These focused successes do not replace full original B2-LX proof.

The first native product attempt selected4 but failed before behavior because
CDC had not precreated the specifically requested evidence subdirectory.
Its raw0passed/4setupfailures/6filtered/exit101 remain native-b2a.*. After
creating a distinct native-product-retry01 directory, the same tests passed.
No failure was overwritten or counted as software behavior.

Copied prior fixtures not selected for direct replay remain in fixtures/ as
source provenance; their presence is not an execution claim. In particular,
class-default-count and default-named-class-hoist were not separately run.
The product public11 supplies the actual default count/constructor/static proof.

## Gates, attestation and limits

Fresh native release build exited0. Source pin/status/inventory, binary hashes,
Deno version and exact mirror comparison are retained. No golden changed in
the seven-path correction inventory. Source review confirms the corrected
native root loop maintains one original-name/location macro budget through
redispatch and terminal-child processing; class defaults use the existing array
path helper; supported kernel:function/function* optional names use base kind.

A new substantive HOLD was reported before full gates. Independent make check,
docs, cold M6, copied CLI/browser, complete private/host/fragment census,
committed citations and browser size were not run. No broad acceptance is
claimed from prior CC green. CC raw full log was inspected directly:1547
product cases/67steps/0failures and482docs/0failures. Its raw committed size log
reports46,418 gzip bytes. Excerpts/copy/digests identify those actual logs;
these remain CC evidence, not independent reruns. The prior B2a raw46,457
versus original prose45,457 transcription error remains append-only historical
provenance; its prior HOLD archive is unchanged.

CC's late intake, zero-selection filters, wrong evidence-path move, failed
fixture/style attempts and retrospectively transcribed command descriptions
remain disclosed in its original index. None was silently converted into a
verified before-edit record or a behavioral pass by this review.

## Commands and evidence conventions

All new helper logic is Lykn; no Python/Ruby/Fennel/handwritten JS helper was
authored. runtime/*.mjs files are compiler output. Common environment:

```
DENO_DIR=/Users/oubiwann/Library/Caches/deno
XDG_CACHE_HOME=/tmp/lykn-b2a-c1-cdc-xdg
NPM_CONFIG_CACHE=/tmp/lykn-b2a-c1-cdc-npm
TMPDIR=/tmp/lykn-b2a-c1-cdc-tmp
```

Those directories were created before the first invocation. Raw streams and
numeric statuses were captured directly to this absolute canonical home on
each invocation. The command descriptions here are transcribed from actual
tool invocations after execution; they are not separate contemporaneous shell
command-file captures. No missing status/output was inferred or reconstructed.

Source cwd is /Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering.
Build: cargo build --release -p lykn-cli. Focused tests:

```
cargo test -p lykn-cli --test macro_dependencies b2a_native -- --nocapture
cargo test -p lykn-cli --bin lykn compile_source_bound_genfunc_call_ignores_unrelated_macro_presence -- --nocapture
cargo test -p lykn-cli --bin lykn compile_source_kernel_escaped_named -- --nocapture
deno test --no-prompt --config /tmp/lykn-b2a-project.json -A test/expander/lexical-regions.test.js
```

The native product commands specify absolute LYKN_MACRO_DEPENDENCIES_EVIDENCE_DIR;
the first nonexistent path and retry's actual directory are named above. The
canonical public test config is copied in receipts and points lang/ at current
packages/lang, never target staging.

Witness cwd is this CDC directory. Native compile uses the absolute source
`target/release/lykn compile fixtures/<fixture>.lykn -o runtime/<name>.mjs`.
Public compile uses the generated public-driver.mjs, which imports the current
canonical module by absolute path:

```
deno run --no-prompt --cached-only --allow-read --allow-env \
  --config /Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/project.json \
  runtime/public-driver.mjs fixtures/<fixture>.lykn
```

Generated stdout is saved as its named runtime/public-*.mjs; stderr/status are
matching *-compile files. Native streams/status use the same convention. Every
runtime call uses `deno run --no-config --no-prompt --cached-only runtime/<name>.mjs`
and matching *-run streams/status. Source/helper query commands are identified
by exact file/line coverage above and raw outputs. All substantive and setup
attempts remain separate.

## Handoff and next recipe

B2-LX stays HOLD on R04; original corrected R01–03 focused controls pass. Root's
draft iteration11 R04 shared sites-query mechanics were independently reviewed
read-only and are source-ready, including actual wrapper/default slots and
trusted child boundaries. Its blanket 'following must fail held' wording should
be narrowed to failing regression witnesses; paired positives already pass.
No new architecture, source-name normalization or owner policy is selected.
Source/build ownership returns clean to root, with no active build/test process.
