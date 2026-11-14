# Candidate30 source-first evidence

2026-11-14, separate Sol6.1 High CDC. Candidate
30d8b77c4e5516191fc9d470325c4ead64e9fba4, tree
eed763256aada46c8bc5e7a848be09c7a1f7f19c. No product edits or Git/index writes.

## Native inspection and identity

From the assigned source cwd, ran read-only `git status --short`, `git log -3
--format=fuller`, `git diff --stat 9e6fb127..HEAD`, `git diff --name-only
9e6fb127..HEAD`, and the complete canonical/test/docs/M6 diff. Source was clean;
baseline delta is exactly14 authorized paths. Five direct `cmp canonical mirror`
commands produced no differences. Full378-line new suite read in numbered
ranges1–200/198–378; canonical modules' complete changes read with neighboring
writer/region/projection/identity code. Duplicate mirrors were omitted from
semantic rereading only after byte comparison.

Read all four raw metadata01 commit receipts. Each `git hash-object -t commit`
reproduced its named original or replacement object. Replacement C1 parents9e,
C2 parents86c3d77f; old/new trees match and `git diff --exit-code 85ddca63
30d8b77c` returned0. Actual replacement trailer lines are adjacent. Original
objects and the earlier false report line remain preserved. Root's authority
to replace only those then-unreviewed messages matches the actual correction.

`git rev-parse refs/heads/release/0.6.x` returned
0829e892999890e8877dec5e35cd249753e1be5d. The reviewer's earlier query of
release/0.8.x returned its unrelated c733f7ab and was the wrong release branch,
not drift. No release change or cross-release investigation occurred.

## Runtime preparation and commands

Owned precreated roots: `/private/tmp/lykn-arc05-s03-cdc/{xdg,tmp,npm}`.
DENO_DIR=`/Users/oubiwann/Library/Caches/deno`, XDG_CACHE_HOME/TMPDIR/
NPM_CONFIG_CACHE set to those respective owned roots. M6 home precreated at
this directory's `m6-final01/`, but no M6 run is claimed.

1. `make fresh-artifacts` from source cwd returned0 before staged consumers;
   raw `initial-fresh.log` and `initial-fresh.status` are retained.
2. `target/release/lykn compile <this-dir>/compile-public.lykn -o
   target/arc05-s03-cdc/compile-public.js` returned0. This Lykn consumer imports
   the real public Deno/browser facades and compiles a source file argument to
   the output-path argument. No handwritten JavaScript helper was authored.
3. For the first seven cases below, invoked
   `deno run --config project.json -A
   target/arc05-s03-cdc/compile-public.js <deno-or-browser> <case.lykn>
   target/arc05-s03-cdc/<case.mjs>`. All returned0 with no output; generated
   files were then run with `deno run --no-config --no-prompt --no-npm
   --cached-only target/arc05-s03-cdc/<case.mjs>`. Each runtime's separate
   stdout/stderr/status is retained under its case stem. Copies of consequential
   generated outputs are alongside their Lykn inputs.
4. Typed-object cases use the same consumer and actual flags, with separate
   `.compile.{stdout,stderr,status}` receipts. The async object case fails during
   compilation, so no runtime is claimed for it.
5. For the narrow actual9e comparison, copied `packages/lang` to ignored
   `target/arc05-s03-cdc/baseline-lang`, then restored exactly its five changed
   canonical modules using direct `git show 9e6fb127:packages/lang/<module>`
   redirects. All other package paths are unchanged in the inspected delivery.
   Compiled `compile-baseline-public.lykn` with the same CLI to the same target
   directory; it imports that isolated baseline package. Ran only the typed
   object async and lexical-async-for cases through it, using the same Deno
   config/permissions, and then the same isolated generated-ESM runtime flags.
   Baseline compilation/runtime streams/statuses and consequential generated
   outputs use `baseline-` stems. The working source was never switched/edited.
6. `deno test --config project.json -A
   test/forms/remaining-discard-bindings.test.js` returned0,8 passed/0 failed.
   Raw `candidate30-new8.log` and `.status` retained. This passing suite includes
   the false throwing-default assertion below; it is not an acceptance verdict.

## Observations

| Case / stem | Compile | Runtime | Exact relevant observation |
| --- | --- | --- | --- |
| typed-lambda-control |0|1| Actual TypeError `anonymous: arg '_' expected number, got string` |
| typed-async-lambda |0|1| Actual TypeError leaks `arg 'discardValue__private'` |
| browser-typed-async-lambda |0|1| Same leaked source-name diagnostic through staged browser facade |
| for-lexical-async |0|1| Lexically bound async callback path also leaks private label |
| anonymous-generator-sentinel |0|0| stdout `7` newline; foreign global is99, so discard contract fails |
| throwing-default-original |0|1| `SyntaxError: Expression expected`; generated `x = throw new Error("default boom");` |
| throwing-default-control |0|1| Valid throwing helper yields actual `Error: default boom` |
| typed-object-lambda-control |0|0| stdout `99` newline; empty stderr |
| typed-object-async-lambda |1|unrun| Compilation rejects `field name must be an atom` |
| baseline-typed-object-async-lambda |0|0| Identical source at9e prints99, empty stderr |
| baseline-for-lexical-async |0|1| Identical source at9e preserves actual TypeError `arg '_'` |

No aggregate `make check`, full66 focused selection, inner M6, final citations
or fresh size gate was run on the known-held candidate. Old CC gate results
remain attested at their original unchanged-content conditions; metadata-only
retention does not turn them into independent behavior proof. No test ignores,
permission bypasses, network/release/publication claims or browser run/load/CSP
claims were introduced. All processes completed; source remained clean30d8b77c.
