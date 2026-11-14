# Public preparation baselines —759567f9

Root2026-11-13, source codex/qualified-adt-core at759567f9/tree52dd6558;
public compiler files are unchanged from accepted57c76c99. Native source/build
remains root-owned. These two bounded probes establish concrete integration
inputs for public discard preparation; they are not a new research framework
or general compiler/guide verdict.

Both helpers are authored in Lykn and import the actual canonical public
packages/lang/mod.js `lykn` adapter. Native release CLI compilation succeeds0;
the generated helper runs with existing DENO_DIR, --frozen --cached-only
--deny-net --no-prompt and only the exact output-file write grant, succeeds0,
and writes the actual public-generated ESM. That emitted ESM runs outside repo
ancestors with --no-config --cached-only --no-npm --no-remote --deny-net
--no-prompt. Helpers/generated files/streams are retained without overwrites.

| Probe | Expected useful result | Actual public runtime |
| --- | --- | --- |
| probe.lykn: typed nonliteral `(bind :number value (Number 7))`, then log value |7|1, ReferenceError value is not defined. Public output puts const/check in a real block and later read outside. |
| nested-rest-probe.lykn: `(array :number first (rest :number tail))` passed `[1,2]` |1|1, TypeError take arg tail expected number, got object. Actual output checks the collected rest ARRAY as number instead of each member. |

Each compile and helper execution is status0; each resulting runtime is1.
The first expected/actual output is in probe.stdout.txt/runtime.stderr.txt;
the second in nested-rest-probe.stdout.txt/nested-rest-runtime.stderr.txt.
Neither is an authoring/fixture failure. The second fixture intentionally needs
no return annotation to isolate the existing argument-check path; it compiled
successfully before the erroneous guard. Source guide/import references and
actual generated JS were inspected before conclusions.

Commands use these literal homes:

```text
SOURCE=/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering
EVIDENCE=/Users/oubiwann/lab/lykn/lang/.worktrees/planning/project03-language-evolution/arc04-qualified-adts/slice03-local-qualified-nominal-core/artifacts/increment-b2b3/root/public-baseline
RUNTIME=/private/tmp/lykn-public-discard-design
DENO_DIR=/Users/oubiwann/Library/Caches/deno
XDG_CACHE_HOME=$RUNTIME/xdg
npm_config_cache=$RUNTIME/npm
TMPDIR=$RUNTIME/tmp
```

For each helper name probe or nested-rest-probe, the actual compile command
was `$SOURCE/target/release/lykn compile $EVIDENCE/<name>.lykn -o $RUNTIME/<name>.mjs`
from SOURCE with those env values. Helper run from RUNTIME:
`deno run --frozen --cached-only --deny-net --no-prompt --allow-write=<exact output> --config $SOURCE/project.json $RUNTIME/<name>.mjs`.
Exact outputs are public-output.mjs and nested-rest-output.mjs. Then from
RUNTIME: `deno run --no-config --cached-only --no-npm --no-remote --deny-net --no-prompt <output>`.
Those commands are direct native invocation, not an authored shell helper.
The source/generated helper and emitted modules were copied to this evidence
home; source path strings intentionally identify this host/pinned worktree.

No Node process/new dependency, alternate-language helper, source modification
or accepted-library/qualified-ADT completion follows. Native checkpoint's
independent acceptance remains unchanged. Public source-readiness must repair
these actual routes while preserving data keys, guards/effects and scope.
