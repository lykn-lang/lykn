# Slice12 Phase A parser prerequisite

This directory holds the small Lykn parser core, probe and raw-outcome
observer. It does not contain or claim a JavaScript AST walker. The selected
Acorn input is the already-cached npm-distributed 8.17.0 ESM file named in
`../controls.json`; the core hashes that exact absolute path and imports its
matching literal `file:` URL only after the expected hash matches. Probe inputs
are inert JavaScript text parsed as ESM and are never executed.

## Frozen conditions

`../controls.json` retains the full accepted K01–K12 control data. Only four
observations are active in this phase, in fixed order: K11 identity mismatch,
K01 module/location/range parsing, K08 imports/re-exports/top-level-await
parsing, then K09 syntax-error location. `../predictions.md` records their
fixed expected results. K02–K07, K10a/K10b and K12 are explicitly unrun; the
full K01–K12 walker gate remains unrun and requires a later CDC-issued PhaseB
assignment after independent PhaseA review.

## Native source gates

Use only this binary for every Lykn operation:

```text
/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/target/release/lykn
SHA-256 57a49f559a79700d66a2d1db216bd179d54fd0c51fd7f2626ff2029bd3163d28
```

The compiler searches ancestor directories for `project.json`. Use an empty
owned cwd at `/private/tmp/lykn-slice12-cc-01`; verify `project.json` is absent
from it and each ancestor before each compilation. Generated files and Deno
caches belong under the existing ignored
`lang/.worktrees/contract-predicate-lowering/target/slice12/cc/` path. Preserve
each candidate body before a source gate or edit.

From that cwd, run the pinned binary on these exact Lykn files, preserving each
argv, cwd, executable hash, stdout, stderr and exit:

```sh
"/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/target/release/lykn" check \
  /Users/oubiwann/lab/lykn/lang/.worktrees/planning/project03-language-evolution/slice12-offline-walker-capability/artifacts/tooling/parser-core.lykn \
  /Users/oubiwann/lab/lykn/lang/.worktrees/planning/project03-language-evolution/slice12-offline-walker-capability/artifacts/tooling/parser-probe.lykn \
  /Users/oubiwann/lab/lykn/lang/.worktrees/planning/project03-language-evolution/slice12-offline-walker-capability/artifacts/tooling/offline-observer.lykn

"/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/target/release/lykn" fmt --check \
  /Users/oubiwann/lab/lykn/lang/.worktrees/planning/project03-language-evolution/slice12-offline-walker-capability/artifacts/tooling/parser-core.lykn \
  /Users/oubiwann/lab/lykn/lang/.worktrees/planning/project03-language-evolution/slice12-offline-walker-capability/artifacts/tooling/parser-probe.lykn \
  /Users/oubiwann/lab/lykn/lang/.worktrees/planning/project03-language-evolution/slice12-offline-walker-capability/artifacts/tooling/offline-observer.lykn

"/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/target/release/lykn" lint \
  /Users/oubiwann/lab/lykn/lang/.worktrees/planning/project03-language-evolution/slice12-offline-walker-capability/artifacts/tooling/parser-core.lykn \
  /Users/oubiwann/lab/lykn/lang/.worktrees/planning/project03-language-evolution/slice12-offline-walker-capability/artifacts/tooling/parser-probe.lykn \
  /Users/oubiwann/lab/lykn/lang/.worktrees/planning/project03-language-evolution/slice12-offline-walker-capability/artifacts/tooling/offline-observer.lykn
```

Compile each file separately with `compile <source> --output <target path>`;
do not use a global binary or the task worktree's different `lykn`. Preserve
the exact generated modules in the ignored target directory. Read all generated
bytes and function boundaries before executing any of them, especially that
the parser SHA check dominates the dynamic import and that the observer writes
attempt metadata before spawning Deno, then raw stdout/stderr and exit before
decoding or asserting.

## Offline replay

The observer arguments are the frozen controls path, exact Deno path, parser
path, generated probe/core modules, a new result directory, a new cache root,
and the verified config-free cwd. Deno is fixed at
`/opt/homebrew/bin/deno` SHA-256
`2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74`.
Use a fresh `DENO_DIR` for the observer and one new child `DENO_DIR` per
observation. The observer's Deno grants must be exact reads for controls,
parser, generated modules and required probe inputs; exact writes for that
run's result/cache directories; and `--allow-run` for only the absolute
Deno executable. It has no network, prompt or environment read grant. Each
probe child has no write, run, environment or network grant; it receives only
exact read paths for parser, generated modules and its one input. Both levels
use `--no-config --no-npm --no-remote --cached-only --deny-net --no-prompt`.

Each observation first creates `attempt.json` with exact argv, cwd, child
environment, control/input/parser/generated hashes and expectations. After the
child exits it stores stdout and stderr as untouched `.bin` files and records
the actual exit/signal before decoding JSON. It then writes `witness.json`
before assertions. K11 must exit nonzero with
`parser_artifact_identity_mismatch` and no AST. K01/K08 must parse with the
frozen module/range/location oracles and unchanged parser hash. K09 must retain
Acorn's actual `SyntaxError` message and its position, with no AST and nonzero
exit. Any unexpected status or oracle mismatch stops the sequence; later
observations remain unrun. These four observations prove only bounded parser
capability under the selected offline condition, not walker behavior or full
audit coverage.
