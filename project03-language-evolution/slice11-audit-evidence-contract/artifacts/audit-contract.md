# Proposed audit walker and native-bundler evidence contract

**Disposition:** method contract proposed by CC for independent CDC review.
This is not an audit run, an execution prompt, an F-row disposition, or
production guidance. Source basis is the read-only Lykn `release/0.6.x`
worktree at `f70565566088f5d55129edda6bd73a4691e5a58d` (tree
`572bc953a053c34cf4ded4520c36d12e7657c2c3`). Planning was clean at
`4565793b4ac9eeac665942f7e00bd69d7eca8aed` before these edits.

## 1. Parser input and exact-artifact policy

F-10 is an AST scan of the **printed JavaScript files**, after emission. The
native kernel JSON and either emitter's in-memory/pre-print AST are not
substitutes: neither is the JavaScript text whose top-level behavior and line
locations F-10 reports. Tokens, regular expressions, grep, byte counts and
emitter-form inventories cannot stand in for ESTree.

Use the already-present, unmodified Acorn `8.17.0` ESM artifact as the one
candidate parser input for a future separately authorized offline capability
gate:

```text
/Users/oubiwann/Library/Caches/deno/npm/registry.npmjs.org/acorn/8.17.0/dist/acorn.mjs
SHA-256 1cbcbf252a5800e496dc505c706f309a9dd4e1789392e12963c77ae9497ff6f7
```

At the assigned source commit, `deno.lock` maps `npm:acorn@8` to `8.17.0` and
records archive integrity
`sha512-xRQbDb9BnwDafYNn6Vwl839DYVjqXYb1XVGtWAZ1kcDc6iwAL4hg3B1dZlRiuENFeO2H53gFG3in621AdERVAg==`
(`deno.lock:16,207-210`). The cached package manifest reports version `8.17.0`,
an ESM export `./dist/acorn.mjs`, MIT license and Acorn's ESTree parser API.
The inspected ESM source exports `parse`, `version`, `Parser` and ESTree node
types; `parse(input, options)` returns an ESTree Program
(`dist/acorn.mjs:325-421, 6285-6304`). Its `ranges` option adds start/end offset
pairs, and `locations` adds start/end line-column positions. Range offsets are
JavaScript string offsets (UTF-16 code units); ESTree `loc` lines are
one-based. The lock integrity is for the npm archive, not this extracted ESM
file. The separate file hash pins the selected cached file for the proposed
run; neither value authenticates its origin by itself.

The provenance remains explicit: this is **npm-distributed third-party
JavaScript**, already present in Deno's npm registry cache. The proposed method
imports that literal file by `file:` URL, never by `npm:` specifier, package
name, or resolver. No npm/Node client, package manager, network resolver,
vendor copy, wrapper, vendoring step, dependency update or cache mutation is
part of the route. This settles a candidate exact-artifact policy for review;
it does not imply npm-free source provenance, authenticated-origin proof,
runtime capability, or permission to fetch/install/execute. If the exact file
is absent or its SHA-256/version/manifest/lock correspondence differs, stop
with `parser_artifact_missing` or `parser_artifact_identity_mismatch`; do not
fall back, fetch, repair, or silently choose another parser.

The future capability gate must be a separate authorized Lykn-only assignment
before scanning the corpus. It must run Deno with `--no-config --no-npm
--no-remote`, omit network permission, use an isolated task-local `DENO_DIR`,
and grant read access only to the pinned parser, frozen JS inputs/manifests and
required local compiler modules, plus write access only to the run evidence
directory. The Lykn-authored capability probe must verify parser version and
file hash before import/use, prove module-mode parsing, top-level await,
locations, ranges and parse-error reporting, demonstrate operation with no
network and no npm resolution, and show the parser hash unchanged after the
probe. A missing input, identity discrepancy, attempted resolution, need for
network, or unsupported required syntax stops before the corpus scan. No such
probe or scan was run in this slice.

Freeze parse options in the future report as:

```text
ecmaVersion: "latest"        # interpreted by the pinned Acorn 8.17.0 artifact
sourceType: "module"
locations: true
ranges: true
```

Record those literal options with parser path/version/hash, Deno version/hash,
source commit, emitter identity, and each emitted-JS file hash. Do not use
`allow*` recovery options or partial-parse fallbacks. A parser error makes that
file `parse_error`; unsupported syntax for this pinned parser is not guessed
around. If the walker's node-coverage contract does not account for a parsed
node, mark the file `unsupported_ast`, preserve its path/type/location, and
stop that file's completeness claim. Never treat an omitted file or partial
AST as zero findings. Findings locate **generated JS** only. Since the native
CLI writes JS without source-map output (`crates/lykn-cli/src/compile.rs:180-305`),
source links must be manifest provenance, not invented original-source line
maps.

## 2. Walker claim and conservative evaluation model

The walker reports **potential load-time evaluation**. Static AST inspection
cannot prove that an arbitrary JavaScript expression is pure or that an effect
was observed at runtime. Keep three ideas separate in every record and report:

1. `potential_load_evaluation`: syntax evaluated while the module is being
   linked/evaluated that may call user or host behavior, mutate state, throw,
   suspend, or resolve/load another module.
2. `observed_effect`: a behavior actually observed by a separately identified
   runtime experiment. The static walker never fills this field.
3. `deferred_execution`: syntax inside function/method bodies or instance
   initializers that does not execute merely because the containing declaration
   is evaluated. This is not a proof that the body is pure when later called.

Walk each `Program.body` statement in source order. Emit a direct top-level
record for the statement and attach all nested reasons, with ESTree node type,
AST path, `loc.start`, range and the conservative rule that caused it. A single
parent statement with several nested reasons is counted once in the direct
statement total and once per reason in the nested-reason total. Never inflate
the direct count by reporting both a declaration and each child as independent
top-level statements. Preserve static import/re-export edges as a distinct
module-dependency observation.

Evaluation/traversal rules for a future Lykn-authored walker:

- Function declarations and function/arrow expressions are deferred boundaries:
  do not report their bodies as load-time evaluation. Still report a call or
  `new` that invokes/constructs one; inspect its callee and immediately
  evaluated arguments, but do not descend into a function body's statements.
  Class method bodies and instance-field initializers are deferred until
  invocation/instantiation. Their computed method keys are evaluated when the
  class is defined.
- Calls, `new`, tagged templates, `await`, dynamic `import()`, assignments and
  updates are potential load-time evaluation when reached outside a deferred
  boundary. Descend into their evaluated operands/arguments so nested reasons
  are retained. A call through an IIFE is represented by its outer
  `CallExpression` reason; stop at the nested function node and do not report
  individual body operations. The outer call is sufficient to say that the
  initializer may evaluate user code. This is a deliberately conservative
  syntax rule, not a call-graph analysis or a claim that every call has an
  observed effect.
- Treat every top-level non-declaration control-flow statement (`if`, loops,
  `switch`, `try`, `throw`, labels, and
  expression statements) as direct module evaluation. Walk tests, iterables,
  discriminants, conditions and bodies for nested reasons. Do not assume a
  branch is unreachable or harmless from syntax alone.
- Member reads are potential evaluation: getters and proxies can run. Computed
  member keys are evaluated too. This deliberately accepts false positives to
  avoid the legacy walker's documented getter blind spot.
- Destructuring patterns are not inert: computed keys, iterator acquisition,
  getters, and default-value expressions may execute. Walk pattern keys/defaults
  and report their operations. Object/array spreads may invoke getters or
  iterators; flag spread as potential. Operators involving object values,
  templates/string conversion, and other coercion points may invoke
  `valueOf`, `toString` or `Symbol.toPrimitive`; mark these as potential
  coercion where the operand type is not statically established. Do not infer
  primitive types or purity from Lykn names.
- A class declaration/expression executes its heritage expression, computed
  keys, static field initializers and static blocks at class evaluation. Walk
  each and report potential evaluation. Method bodies and instance field
  initializers are deferred; do not confuse them with static fields/blocks.
- A static `ImportDeclaration` with bindings and source-bearing re-export
  (`ExportNamedDeclaration` / `ExportAllDeclaration`) record a dependency edge;
  the imported module can itself have load-time effects. A bare import is also
  an edge and is separately marked `bare_import`. Neither static-import form
  proves the dependency safe. `ImportExpression` is potential dynamic loading.
  Exported variable initializers and default-export expressions are evaluated
  under the same rules as other declarations/expressions; exported function
  bodies remain deferred.
- Any AST node type outside an explicit node-coverage table is a fail-closed
  `unsupported_ast` result for the containing file. Generic child traversal may
  retain diagnostics but cannot upgrade that file to complete. New ECMAScript
  syntax requires an explicit table update and control before acceptance.

The finite walker coverage contract is this table. Node fields not named as
evaluated are syntax/metadata, not implicit recursive traversal. A child path
that is not a supported field is `unsupported_ast`; locations/ranges are
retained for every reason.

| Supported ESTree node/family | Fields traversed at module evaluation | Rule / deferred boundary |
|---|---|---|
| `Program`, `BlockStatement`, `ExpressionStatement`, `IfStatement`, `SwitchStatement`, `SwitchCase`, `TryStatement`, `CatchClause`, `ThrowStatement`, `WhileStatement`, `DoWhileStatement`, `ForStatement`, `ForInStatement`, `ForOfStatement`, `LabeledStatement`, `BreakStatement`, `ContinueStatement`, `WithStatement`, `DebuggerStatement`, `EmptyStatement` | Statement body; tests, discriminant, case test/consequents, init/test/update, right/left, argument, catch parameter/body, handler/finalizer, label body as applicable | Top-level executable statement is one direct parent finding when it may evaluate; recursively visit the listed expression/statement fields. `ThrowStatement` is a potential throw even when branch reachability is unknown. `CatchClause` and `SwitchCase` are transparent control containers, not separately counted top-level parents. `BreakStatement`/`ContinueStatement` have no evaluated fields. `WithStatement` is unsupported if parser mode admits it; module strict parsing normally rejects it. |
| `VariableDeclaration`, `VariableDeclarator` | Each `init`; binding pattern computed keys and defaults | One direct declaration finding if any evaluated child is potential. Plain identifiers are binding names, not reads. Destructuring itself is a potential iterator/getter read; `AssignmentPattern.right` may run conditionally and is still potential. |
| `FunctionDeclaration`, `FunctionExpression`, `ArrowFunctionExpression` | No body or parameter-default expressions | Function body/default expressions are deferred to invocation. A call to the function is represented by the call node; no body descent, including for an IIFE. |
| `ClassDeclaration`, `ClassExpression`, `ClassBody`, `MethodDefinition`, `PropertyDefinition`, `StaticBlock` | Class `superClass`; computed member `key`; static `value`; static-block `body` | Add `class_heritage_validation` potential at every non-null `superClass` independently of child reasons: constructor/prototype validation can throw even when the expression itself is inert. Add `computed_key_coercion` potential for every computed class key because `ToPropertyKey` may invoke user conversion. Heritage, computed keys, static initializers and static blocks execute at class definition. Method bodies and non-static field initializers are deferred. |
| `CallExpression`, `NewExpression`, `TaggedTemplateExpression`, `AwaitExpression`, `ImportExpression`, `AssignmentExpression`, `UpdateExpression`, `YieldExpression` | Callee/tag, evaluated arguments/operands/argument, left/right as applicable | Record this node as a potential reason, then traverse evaluated fields. `ImportExpression` is dynamic loading; `AwaitExpression` may suspend module evaluation. `YieldExpression` is supported only under a deferred generator body. |
| `MemberExpression`, `ChainExpression` | Object and computed property; optional-chain expression | Member reads are potential getter/proxy evaluation. Computed properties also have `computed_key_coercion` potential (`ToPropertyKey`) independent of key-expression children. Noncomputed property identifiers are names, not binding reads. |
| `Identifier` in reference position | The identifier value | Record `identifier_read` as potential because the walker does no scope/name resolution: an arbitrary name may be unbound and throw. Do not mark any name pure based on spelling. Exclude declaration/binding identifiers and noncomputed property/member keys. |
| `ArrayExpression`, `ObjectExpression`, `SpreadElement`, `Property`, `ArrayPattern`, `ObjectPattern`, `RestElement`, `AssignmentPattern` | Element/value, spread argument, computed key, pattern default/key/value | Object/array spreads and destructuring may invoke iterators/getters. Property values/computed keys are evaluated; every computed key also has independent `computed_key_coercion` potential (`ToPropertyKey`); static noncomputed keys are not reads. |
| `UnaryExpression`, `BinaryExpression`, `LogicalExpression`, `ConditionalExpression`, `SequenceExpression`, `TemplateLiteral`, `TemplateElement`, `Literal`, `ThisExpression`, `Super`, `MetaProperty` | Operand(s), test/consequent/alternate, expression list, template substitutions | Traverse evaluated operands. For every unary/binary operator whose JavaScript semantics may coerce an unconstrained operand, add `operator_coercion`; template substitution likewise adds `coercion` because conversion hooks may run. Literal/template raw text and fixed property-name fields are not expressions. |
| `ImportDeclaration`, `ExportNamedDeclaration`, `ExportDefaultDeclaration`, `ExportAllDeclaration`, `ImportSpecifier`, `ExportSpecifier` | Imported/exported declaration or default expression; module source as an edge | Static imports/re-exports create dependency-edge records, not a local call finding; imported modules may have effects. Bare imports also get `bare_import`. Recurse into exported initializers under normal rules. |

The table is an explicit supported subset, not a claim that these are all
possible ECMAScript node types. In particular, any future proposal node,
decorator, parser extension, or node with an unlisted executable child fails
closed. The walker does not prove identifier resolution, branch reachability,
callee behavior, exception behavior, or primitive operand types.

Retain and expand legacy blind spots explicitly: getters/member reads; class
heritage, computed keys, static fields and blocks versus deferred methods and
instance fields; destructuring/defaults; spread and coercion; calls/IIFEs;
await/dynamic import; imports, exports and re-exports; and control-flow
statements. The original walker only recognized a small set of call-like nodes,
skipped function bodies, and intentionally missed member reads/static class
work (`slice01-treeshake-audit/scripts/toplevel-walker.js`). Its results are
historical method inputs, not acceptable F-10 semantics.

## 3. Future corpus population, emitter mapping and reconciliation

The source has two distinct JS emission contexts. `lykn compile` follows the
native Rust pipeline through `compile_source_inner` to
`codegen::emit_module_js` (`crates/lykn-cli/src/compile.rs:180-305`; normal
compile dispatch in `crates/lykn-cli/src/main.rs`). In contrast,
`lykn test --compile-only` discovers the default `test/` corpus, performs Rust
validation, then invokes `deno eval` importing `lang/mod.js` and calls
`lykn(source)` for `.lykn` files (`crates/lykn-cli/src/main.rs:711-1055`).
`.lyk` files take the explicitly lax JS API call. The latter is JS-emitter
output; Rust pre-validation does not make it native-emitter output. The
public-JS compiler is also used by browser/product paths (`packages/lang/mod.js`
and `crates/lykn-cli/src/main.rs:1913-1953`). The Rust-to-JS bridge is a
separate kernel-JSON route (`crates/lykn-cli/src/bridge.rs:1-55`), not the
default `lykn compile` route. F-1/F-8 must identify these roles from source and
actual re-entry evidence; do not collapse them into one compiler or assert an
unavailable CLI route.

For F-8's same-input public-JS fixture comparison, the future producer is a
Lykn-authored **single-input** driver compiled with the pinned native CLI, then
run once per input in a fresh Deno process from the release worktree root. A
fresh process avoids carrying `macroEnv` registrations across inputs
(`packages/lang/expander.js:1838-1865`). The driver imports the already-public
`read`, `expand`, and `compile` exports from `lang/mod.js`
(`packages/lang/mod.js:1-3`); for each absolute source input it performs the
public JS stages:

```text
forms = read(sourceText)
expanded = expand(forms, { strict: sourceExtension != ".lyk", filePath: absoluteSourcePath })
printedJavaScript = compile(expanded)
write(outputPath, printedJavaScript)
```

The driver source and all orchestration/data handling are Lykn. Build it using
`"$LYKN_BIN" compile <driver.lykn> --output "$RUN/public-js-producer.js"`;
then invoke it once per manifest row with
`DENO_DIR="$RUN/frozen-deno-dir" deno run --config project.json --cached-only --no-remote --allow-read=<one-input,project.json,build/lang,local-macro-inputs> --allow-write=<one-output> "$RUN/public-js-producer.js" <absolute-input> <absolute-output> <strict|lax>`.
Run from the release source root. Materialize the task-local `DENO_DIR` only
from already-present, lock-matched compiler dependencies (including baseline
npm-distributed `astring`); record dependency identities/hashes and stop on any
cache miss. `--cached-only --no-remote` prevents downloading missing compiler
inputs; do not use `--no-npm` because the current JS compiler imports
`npm:astring`. Omit network, subprocess and cache-write permission. The JS
compiler's existing `node:path` import uses Deno's built-in compatibility layer
(`packages/lang/expander.js:20-31`); it is not a new Node client. The
`project.json` config is required for the existing `lang/` import map; the
built `target/lykn/build/lang` identity and source/config hashes are inputs and
must be frozen. `expand` has
an explicit `filePath` context (`packages/lang/expander.js:1838-1847`), while
the convenience `lykn(source, {strict})` wrapper at `mod.js:23-25` accepts no
file path and passes only strictness to `expand`. Therefore this producer must
not invent a `{filePath}` option for `lykn()`: supplying `filePath` through the
exported lower-level public stages preserves each fixture's relative
`import-macros` base (`expander.js:1469-1566`). If any required source uses a
registry macro, resolution would require Deno subprocess/network behavior
(`expander.js:1337-1467`); without separate authorization and pinned local
inputs, that route is `blocked_unapproved_macro_resolution`, not silently
fetched or counted as a successful JS output.

For F-10's production-like test corpus, retain the actual
`lykn test --compile-only` route as a distinct condition: its caller performs
Rust validation, then `deno eval --config` imports `lang/mod.js` and calls
`lykn(source)` (or `lykn(source, {strict:false})` for `.lyk`) before writing
each result (`main.rs:964-1055`). That exact route has no per-source filePath
argument; give it key `js-test-cli-cwd-context` and preserve any
relative-macro-context failure for the original path. Do not substitute the
F-8 `read`/`expand({filePath})` producer for this F-10 condition or claim the
two outputs are identical. If any required source cannot be emitted under its
assigned route/context, record the route row's precise failed status and leave
that route's coverage incomplete.

The future F-10 denominator begins with source-driven discovery matching the
pinned CLI contract: default `test/`, recursive selection of `*_test.lykn`,
`*.test.lykn`, `*_test.lyk`, `*.test.lyk`, and any `.lykn`/`.lyk` in
`__tests__` (`main.rs:909-951`). `make test-suite` is the full handwritten
`*.test.js` plus compiled Lykn corpus suite and depends on `fresh-artifacts`
(`Makefile:207-245`). For F-10, run **only** the compile-only emission step;
never run test bodies to get ASTs. `--compile-only` does not compile handwritten
JavaScript, so enumerate `*.test.js` separately, hash and parse those files as
the `handwritten-test-js` segment. Identify native-source tests, fixture inputs,
and test helpers as their own segments. Do not count a generated `.js` twice
because it shares a basename with a source file.

Future re-entry commands, after a separate execution assignment and source/tool
identity check, include the direct native CLI fixture invocation and the
Lykn-authored public-JS producer recipe above:

```sh
"$LYKN_BIN" test --compile-only --out-dir "$RUN/compiled-js-emitter" test/
"$LYKN_BIN" compile <frozen-fixture.lykn> --output "$RUN/native-js-emitter/<fixture>.js"
```

The output of `test --compile-only` and the direct public-JS producer are
different keyed conditions. For the F-8 fixture parity set, stage byte-identical
source copies only under ignored `$RUN` paths (the original fixtures remain
outside `test/`), and map each copy back to the original path/hash; do not run
test bodies. The commands specify future route identity and output ownership,
not authorization to execute now. If the exact public-JS stage sequence,
config, mode, source path or macro base cannot be established for one input,
record it as a route failure and leave F-8 incomplete for that comparison.

The run must freeze (before emission/scan) the exact source-tree commit, binary
hash/version, Deno hash/version, all source roots and discovery rules, one
sorted source manifest with path/extension/segment/SHA-256, and a unique
expected source-to-generated-output mapping per emitter/mode condition.
Compile-only wipes its output
directory (`main.rs:789-820`), but the assigned runner must still use a fresh
task-local run path and reconcile every expected output; no stale `target/`
tree is a corpus. Hash every emitted JS input before scanning. Record each
source and output identity, route (`native-rust`, `public-js`, or
`js-test-compile`), strict/lax mode, compiler/dependency context, and whether
the file is test-shaped, local product/support, hand-written JS, or external
dependency. Keep local product/support sources reachable from tests visible in
a separate segment; do not silently remove them from the population. External
and built-in dependency modules need an explicit inventory and exclusion reason
if they are outside the Lykn-generated source corpus.

Any discovered-but-not-emitted source, duplicate mapping, missing/unreadable
output, compile error, parse error, unsupported AST, hash mismatch or excluded
file without a named reason remains in the denominator and makes the run
incomplete. Never scan a pre-existing package build tree as a stand-in for
freshly emitted test modules. The emitted-file line and column are generated-JS
coordinates; preserve the source path/hash mapping without claiming source-map
precision that the emitters did not produce.

## 4. Native esbuild F-6 evidence contract

F-6 continues to use the accepted source-built esbuild `0.25.5` native binary,
not Deno bundle, npm-distributed esbuild, or an assumed equivalent. Its
upstream source commit is `ea453bf687c8e5cf3c5f11aae372c5ca33be0c98`; the
accepted binary SHA-256 is
`b26c07a69bc734c1661ee3180bc2a8b71ee860826a866393e94c519cda46fe1f`.
Use the accepted binary path from the Slice06/08 tool provenance and verify the
hash/version at re-entry. Slice06/08's C4 witness is bounded method evidence:
Slice08 independently read the complete 538-byte bundle and raw metafile;
`dead.js` resolves (406 input bytes) but contributes no output row, `used`
contributes 365 bytes, effect 28, barrel 0, and complete code lacks
`unusedPure`. It establishes these finite observations for C4, not the original
Slice01 app, F-10 classification, minified parity, general symbol attribution,
or overall audit success (`slice08-template-string-boundary/cdc-verification.md`,
“Frozen pilot accepted”).

After the original Slice01 app fixtures have been frozen and emitted, run the
same two-module entry twice with identical resolution settings, from its frozen
input root, using the direct native CLI. Capture each invocation's argv, exit,
stdout and stderr separately:

```sh
"$ESBUILD" "$RUN/compiled/app-main.js" --bundle --format=esm \
  --tree-shaking=true --metafile="$RUN/evidence/f6-unminified.meta.json" \
  --outfile="$RUN/evidence/f6-unminified.js" --analyze=verbose \
  --log-level=warning

"$ESBUILD" "$RUN/compiled/app-main.js" --bundle --format=esm \
  --tree-shaking=true --minify --metafile="$RUN/evidence/f6-minified.meta.json" \
  --outfile="$RUN/evidence/f6-minified.js" --analyze=verbose \
  --log-level=warning
```

Save the two raw metafiles, both complete bundle files, each analysis output,
and separate stdout/stderr/exit records. Record esbuild version/hash, platform,
entry and resolved input hashes, working directory, format, minify state,
tree-shaking setting, resolution defaults/plugins/aliases, `sideEffects`
inputs, and Deno/CLI identities where involved. Do not report only esbuild's
formatted analysis: inspect the complete raw `inputs`/`outputs` JSON and full
unminified code and each minified artifact against its own distinct hash. A
failed command or absent metafile is an incomplete F-6 attempt, not an empty
graph.

For each variant, separate these evidence claims:

| Observation | What it supports | What it cannot establish alone |
|---|---|---|
| Resolved input/import graph | Which modules were resolved into the build | That any module contributes retained output bytes |
| `outputs[*].inputs[*].bytesInOutput` | Per-module output contribution for that output | Which individual declaration/body contributed those bytes |
| Full bundle code / declaration-body membership | Whether a named declaration/body is visibly retained in this artifact | Runtime execution, functional correctness, or package public API availability |
| Runtime effect/control receipts | Actual observed behavior for the exact executed case | Unexecuted cases or general purity of arbitrary calls |
| Generated public export maps and positive consumers | Declared and exercised public package paths | Application bundle retention or dead-code elimination |

Module `bytesInOutput` is not symbol attribution. A missing output row can be
reported as zero contribution for that module in that output; it does not say
why unless full code/controls corroborate. Metafile input presence is not
retained contribution. A module's contribution is not evidence that every
export/body survived. Minified and unminified runs are separate observations;
byte-size difference alone is not shaking evidence. F-6 does not validate the
F-10 walker or establish ESTree classification.

Make membership decisions per artifact. For unminified output, a retained
declaration/body claim requires full-code inspection with an identifiable
declaration/body or semantically distinct body, plus that artifact's raw
metafile. For minified output, inspect that minified file itself and map a
candidate body by its actual operation/control-flow/literal semantics, never
by the original identifier (which may be renamed) or a module byte count. Do
not transfer a minified prediction from unminified code or claim absence just
because a source name is absent. If minification/inlining makes a predicted
declaration/body indistinguishable or untraceable, report that exact
source/artifact claim as `indeterminate_minified_membership` with the reason;
do not count the original retain/drop prediction as passed from size/name
heuristics. Preserve any resolvable per-module graph/contribution observation
separately.

## 5. Frozen controls and machine-readable scan record

Before any future parser or bundler execution, CDC must freeze a finite control
set with exact input bytes/hashes, parser/build identities, expected AST paths,
categories, generated coordinates, failure statuses and falsifiers. Reuse the
original Slice01 nine-family fixtures, both partial-app files, the committed
predictions and accepted C4 evidence as historical inputs; any added scanner
controls are Lykn source or inert JS text data inside Lykn control records, not
handwritten JS helpers. Store command outputs and failed attempts distinctly.

Finite unexecuted control set. Each quoted value below is inert JavaScript text
data for the parser/walker (never helper code); within quoted strings, `\n`
means one LF byte. For successful AST locations, Acorn `loc.line` is one-based
and `loc.column` zero-based. Freeze the exact bytes/hash before any future run.

| ID and exact input | Expected AST path, category, counts and location | Falsifier / status |
|---|---|---|
| K01 pure/deferred: `"function lazy() {\n  runLater();\n}\nconst later = () => runLater();\n"` | `Program.body[0]` function body call at `{line:2,column:2}` and `Program.body[1].declarations[0].init.body` arrow call are deferred. Direct findings 0; nested reasons 0. | Any body-only reason falsifies function boundaries; complete scan, exit 0. |
| K02 evaluated/IIFE: `"const value = (() => 1)();\nrun();\n"` | Direct findings 2 (the declaration at `Program.body[0]`, expression statement at `[1]`). Reasons 3: outer `CallExpression` at 1:14; `CallExpression` and `Identifier` reference `run` at 2:0. No reason for the IIFE body. | More than one direct finding per parent, descent into IIFE body, missing call/read reason or mismatched numeric location falsifies the policy; complete scan with findings, exit 0. |
| K03 member/getter: `"const value = object.field;\n"` | One direct declaration. Two reasons at `Program.body[0].declarations[0].init`: `MemberExpression` and object `Identifier` read, both 1:14; noncomputed `field` is not a binding read. | Omitting member/getter potential or treating `field` as a reference falsifies; complete scan with findings, exit 0. |
| K04 destructuring/default: `"const { value = fallback() } = source;\n"` | One direct declaration. Four reasons: destructuring read at `Program.body[0].declarations[0].id` 1:6; `CallExpression` and `Identifier` read `fallback` at `id.properties[0].value.right` 1:16; source `Identifier` read at `declarations[0].init` 1:31. | Wrong path/count/location or missing conditional default/getter/iterator potential falsifies; complete scan with findings, exit 0. |
| K05 spread/coercion: `"const value = { ...source };\nconst text = `x${value}`;\n"` | Two direct declarations, four reasons: `SpreadElement` at `body[0].declarations[0].init.properties[0]` 1:16 and source `Identifier` 1:19; template coercion at `body[1].declarations[0].init` 2:13 and substitution `Identifier` 2:17. | Missing spread/coercion or claiming observed conversion falsifies; complete scan with findings, exit 0. |
| K06 class boundaries: `"class Box extends Base {\n  [key()]() { run(); }\n  static value = init();\n  static { start(); }\n  item = later();\n}\n"` | One direct class declaration, nine reasons: `class_heritage_validation` plus `Base` read at `superClass` 1:18; computed-key `CallExpression`+`key` read+`computed_key_coercion` at `ClassBody.body[0].key` 2:3; static-field `CallExpression`+`init` 3:17; static-block `CallExpression`+`start` 4:11. Method-body `run()` and instance initializer `later()` are deferred. | Wrong static/instance boundary, missing independent heritage/key-coercion reason, count, path or location falsifies; complete scan with findings, exit 0. |
| K07 control/throw: `"if (ready) {\n  throw issue;\n}\n"` | One direct `IfStatement`; three reasons: `ready` read at `body[0].test` 1:4; `ThrowStatement` at `body[0].consequent.body[0]` 2:2; `issue` read at its argument 2:8. | Treating unknown identifiers/throw as pure or counting nested throw as a second top-level parent falsifies; complete scan with findings, exit 0. |
| K08 imports/async: `"import \"./dep.js\";\nexport { value } from \"./dep.js\";\nawait load();\n"` | Two dependency edges; first is also `bare_import`. One direct await expression parent; three reasons: `AwaitExpression` at `body[2].expression` 3:0, `CallExpression` and `load` identifier read 3:6. | Edge/finding conflation, missing await/call/read, or claim static dependency is safe falsifies; complete scan with findings, exit 0. |
| K09 parse error: `"const value = ;\n"` | Acorn `pos=14`, `loc={line:1,column:14}` (column zero-based); no AST findings for the file. | Terminal status `parse_error`; aggregate `incomplete`, nonzero exit. Treating it as clean falsifies. |
| K10 missing/unreadable: `missing-control.js` has no file; `unreadable-control.js` contains `"const value = 1;\n"` but its scoped read grant denies it. | Two distinct manifest keys, no AST path. | Exclusive statuses `source_missing` and `source_unreadable`; both retained; aggregate incomplete/nonzero. Omission falsifies. |
| K11 changed identity: parser gate expected hash is exactly 64 zero hex digits while the selected artifact still has the frozen Acorn hash. | Pre-scan parser gate, no file AST path. | `parser_artifact_identity_mismatch`, no fallback/parse; aggregate incomplete/nonzero. Any AST output falsifies. |
| K12 unsupported walker node: inject inert AST data `{"type":"ExperimentalNode","argument":{"type":"Literal","value":1}}` at `Program.body[0]` directly into the Lykn walker's unit boundary. | Node path `Program.body[0]`, type `ExperimentalNode`; parser and corpus file counts are not applicable because this is a unit-boundary injection, not parsed JS. | Control status `unsupported_ast` with node/path; for an actual corpus node the source-condition row must be `unsupported_ast` and aggregate incomplete/nonzero. Generic traversal marked complete falsifies. |

For each successful file, `corpus-scan.json` must contain at least:

- schema/method version; run ID/time; source commit/tree and clean-state
  receipt; compiler/emitter/Deno/parser/esbuild identities as applicable;
- literal Acorn artifact path, package version/provenance, file SHA-256, lock
  specifier/archive integrity, parse option object, and offline capability-gate
  receipt reference;
- roots, discovery rules, sorted source manifest and per-condition
  source-to-output keys (`source_id`, source SHA-256, emitter, strict/lax mode,
  condition ID, output path/hash). Each row records source/generated paths,
  segment, parser status, AST coverage status, generated-JS locations and
  explicit exclusion reason where excluded;
- `selected_sources`, `selected_condition_rows`, `required_condition_rows`, `complete_walk`,
  `source_missing`, `source_unreadable`, `source_hash_mismatch`, `compile_failed`, `output_missing`,
  `output_hash_mismatch`, `output_unreadable`, `parse_error`, `unsupported_ast`,
  `not_processed`, `excluded_named`, `files_parsed`, `files_completely_walked`,
  `direct_statements_with_findings`, `nested_reasons`, dependency-edge and
  bare-import totals, plus findings/reasons and per-row error/status;
- a terminal status `complete_no_findings`, `complete_with_findings`, or
  `incomplete`, and a process exit that is `0` only for a complete scan;
  findings themselves do not make the scanner fail. Parser/identity/input/
  coverage/manifest errors produce a nonzero exit and cannot be counted as
  clean files.

Terminal statuses are mutually exclusive for each selected
`(source_id, source_sha256, emitter, strict/lax mode, condition_id)` row:
`complete_walk`, `source_missing`, `source_unreadable`, `source_hash_mismatch`,
`compile_failed`, `output_missing`, `output_hash_mismatch`, `output_unreadable`, `parse_error`,
`unsupported_ast`, `not_processed`, or `excluded_named`. `excluded_named` is
valid only for a source/condition declared non-required before execution; it
cannot replace any required route/output. Equations are:

```text
selected_condition_rows = complete_walk + source_missing + source_unreadable
  + source_hash_mismatch + compile_failed + output_missing + output_hash_mismatch
  + output_unreadable + parse_error + unsupported_ast + not_processed + excluded_named
files_parsed = complete_walk + unsupported_ast
files_completely_walked = complete_walk
```

The required key set is explicit per condition: Slice01 fixtures require both
`native-rust` and `public-js-api-filepath` output rows for F-8; the selected
compiled `.lykn`/`.lyk` test files use `js-test-cli-cwd-context` for F-10;
handwritten tests use `handwritten-js-direct` with source bytes as their output.
The project/compiler/product/support/dependency segments retain their own
manifest rows and named boundaries. A parser gate has a separate terminal
`passed`, `missing`, `identity_mismatch`, or `not_processed`; unless it is
`passed`, every required scan condition is `not_processed` and aggregate status
is incomplete. For every route, exact source/output mapping is unique and all
listed totals equal the row set.

Aggregate status is `complete_no_findings` or `complete_with_findings` only
when the parser gate passes, every required key is `complete_walk`, every
non-required selected key has a predeclared named exclusion, and all equations
hold. Findings alone do not fail a complete scan (exit 0). Any missing,
mismatched, unreadable, failed, parse-error, unsupported or not-processed
required row yields `incomplete` (nonzero exit), while preserving valid partial
findings as explicitly partial observations. The report reconciles every
condition denominator with compile-only/API transcripts, source/output
manifests, scanner JSON, exit records and F-10 summary. Test-shaped findings
are segmented from product/support findings without reducing raw denominators.
F-10 never establishes `sideEffects: false` suitability or public API safety.

## 6. Exact method amendment proposed for CDC review

Append this amendment to Slice01's current method contract at the next
authorized plan-edit step; do not rewrite the original prompt, original
predictions, Slice01 evidence/history, or statuses:

> **Proposed F-6/F-10 method amendment (not yet issued):** Keep all original
> F-1–F-12 criteria, fixture families, partial-import app, predictions and
> divergences, metadata review, full-corpus obligation, audit-report sections,
> diagnostic-only guarantee and independent close unchanged. F-6's required
> evidence is produced by the already accepted source-built native esbuild
> 0.25.5 binary at the pinned hash, with paired minified/unminified executions,
> one raw metafile, full output artifact, analysis and diagnostic/exit record
> per variant. Assess retained declaration/body membership separately within
> each artifact: no symbol attribution from module bytes, no absence test on
> renamed identifiers, and no unminified-to-minified transfer. If minification
> or inlining prevents attribution, mark that claim indeterminate with reason;
> do not pass its prediction on size/name heuristics. Distinguish resolved
> graph inputs, per-module `bytesInOutput`, runtime effects and generated/public
> APIs. The accepted Slice08
> five-bundle/eleven-call C1–C5 witness and Slice06 source-built provenance are
> bounded reusable evidence, not a substitute for the original Slice01 F-6
> fixture/prediction experiment. F-10 remains an ESTree walk of post-emission
> JavaScript using the literal existing Acorn 8.17.0 cached ESM artifact,
> directly identified by its recorded hash and source provenance. A future
> separately authorized capability gate must prove exact-artifact offline
> operation before full corpus scanning; no npm specifier/resolver, acquisition,
> fallback parser, handwritten JS helper or non-AST proxy is permitted. The
> scanner is authored in Lykn. F-8 fixture parity maps the native Rust
> `lykn compile` route against a Lykn-authored producer calling exported JS
> `read` → `expand({filePath, strict})` → `compile` from a fresh, offline Deno
> process per input; it must not pretend `lykn(source,{strict})` accepts
> `filePath`. F-10 separately scans the actual Deno JS
> `lykn test --compile-only` outputs under their cwd macro context and maps
> every source/output condition. The future population includes the complete
> source/output manifest, handwritten JS segment, named exclusions, failures
> and denominator reconciliation. No test
> body is run to obtain ASTs. Every original F-1–F-12 status remains open until
> its own evidence, divergence/report obligations and independent review are
> complete.

The current prompt's Python prohibition is unchanged and must be repeated
verbatim in every future initial/iteration prompt: no Python execution or
authorship for helpers, scripts, orchestration, validators, evidence
processing, JSON or command construction; no parity exception. No Ruby,
Fennel, handwritten JS/Node, or other scripting replacement. Authored helper
logic is Lykn; native shell/CLI is only for direct invocation/simple filesystem
lifecycle. Historical prompts and process records remain byte-preserved.

## 7. F-1–F-12 preservation and re-entry map

| Original row | Preserved obligation and next evidence; no closure here |
|---|---|
| F-1 | Establish the authoritative/default emission route and name each relevant live emitter. Re-entry records native `lykn compile`, JS compiler test output, browser/product use and bridge status separately; source citations are not a compile transcript. |
| F-2 | Complete source-cited top-level emission inventory for every live emitter and reconcile classifier form sets; historical inventory remains attested/incomplete. |
| F-3 | Retain all nine surface families and two-module partial-import app. Validate and map each existing fixture; filenames alone are not validity evidence. |
| F-4 | Record Deno, cargo, source-built esbuild, clean build identity/probe as the amended authorized plan requires; current accepted hashes are provenance, not a new probe. |
| F-5 | Keep the original prediction history. Verify the prediction commit predates every new compile/bundle/scan evidence commit; any new prediction is frozen before its dependent run. |
| F-6 | Run the amended paired native esbuild CLI experiments over the original compiled app with distinct raw meta/output/analyze/diagnostic receipts; reconcile full code and predictions. |
| F-7 | Disposition every prediction/outcome divergence, including recorded zero divergences if that is the result. No outcomes exist in this contract unit. |
| F-8 | Compare equivalent fixture output from each relevant live emitter, or cite F-1's proved non-invocability for a genuine no-op. The JS compiler is a live product/test path. |
| F-9 | Inspect actual generated npm and Deno metadata for shaking fields and exports; source inspection or old grep is not generated-output evidence. |
| F-10 | After the future exact-parser capability gate, scan the complete reconciled emitted-JS/test corpus with AST paths/locations, classifications, errors and segmented totals. No parser or corpus run here. |
| F-11 | CDC assembles the severity-graded audit report, recommendations, emission paths, inventory, prediction comparison, metadata and F-10 corpus results only after prerequisites. |
| F-12 | Preserve diagnostic-only scope and prove no production/source/test implementation paths changed against the opening source state. |

Slice01 ledger rows F-1 through F-12 remain `open`; the five Slice11 WC rows
also remain `open` with CC evidence attested pending CDC inspection. This
contract does not close Slice01, Project03, Project07 or any public API,
licensing, packaging or release gate.

## Evidence basis and limits

In addition to the assigned slice prompt/plan/ledger, sources read for this
contract were Slice01's full plan, ledger, historical prompt, inventory,
predictions, both historical scripts and all twelve fixture bodies; Slice04's
F-1–F-12 map and full proposed protocol; Slice06 native-esbuild provenance and
results; Slice08 final independent C4/C1–C5 review; the current planning/source
AGENTS and required project-management, work-verification, scientific-methods,
JavaScript/Deno and Lykn guidance. This reading list documents scope, not
independent review. No parser, bundler, compile-only corpus command, test, build,
or runtime experiment was run by CC in this slice. The only current dynamic
claims are identities read from existing records and source/cache files. CDC
must verify the contract citations, paths, hashes, invariants and amendment
before any future assignment is issued.
