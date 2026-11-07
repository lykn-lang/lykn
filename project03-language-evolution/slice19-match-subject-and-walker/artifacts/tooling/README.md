# Lykn ESTree capability tools

These research modules inspect inert JavaScript bytes. They do not execute or
resolve those bytes and do not establish that any reported potential effect
was observed. The walker reports conservative potential load-time evaluation;
functions, method bodies and instance initializers remain deferred. A finite
explicit node/field table is the coverage boundary, so unsupported syntax or
unlisted child fields produce `unsupported_ast`.

## Modules

- `parser-core.lykn` is the byte-identical Slice14 parser identity guard. It
  hashes Acorn before dynamic import of its literal file URL, checks version
  `8.17.0`, and can verify the bytes remain unchanged.
- `estree-walker.lykn` exports pure `walk-program(program)` and performs no
  file, parser or module operations. It returns source-ordered parent records,
  nested reasons, static dependency edges, coverage status and unsupported
  nodes. `observed_effect` is always null.
- `scanner.lykn` accepts exactly one absolute manifest path:
  `scanner.js MANIFEST`. `kind` must be `file_scan` or `synthetic_unit`. A file
  manifest carries run/source/compiler/Deno/parser metadata and required
  condition rows with distinct source/emitter/mode/condition keys. K11's
  expected parser hash is 64 zeros, and its one required K01-reference row
  remains `not_processed` because identity rejection happens before any input
  read or parse. K12 is a direct synthetic walker unit and has no parser/file
  count. Complete reports exit 0; incomplete reports exit 2.
- `capability-observer.lykn` accepts exactly eight absolute values in this
  order: `CONTROLS DENO SCANNER_JS CORE_JS WALKER_JS TASK_ROOT CACHE_ROOT
  CONFIG_FREE_CWD`. The two output roots must be absent before launch. It stages
  fixed inputs/manifests, invokes only the supplied absolute Deno executable,
  and records raw child stdout/stderr and exit before decoding or assertions.

## Offline gate

The frozen 13-row population is in `../controls.json`; the source data are the
unchanged Slice12 `fullAuditControls`. Expected outcomes and numeric/path
oracles are recorded in `../predictions.md`. Children run with
`--no-config --no-npm --no-remote --cached-only --deny-net --no-prompt`, a
fresh per-condition `DENO_DIR`, a minimal cleared environment, exact file read
paths, no write/run/env/network grants, and no JavaScript execution. K10a has
an exact read grant for the absent path; K10b's existing file is staged and
hashed by the observer, while the child is deliberately denied that path.
K11's child can read the parser for its hash check but not the K01 reference.
K12 reads no parser.

The supervisor's 13/13 result is a finite capability result, not a full
ECMAScript coverage or corpus-completeness claim. See the adjacent Slice17
plan and accepted Slice11 contract for the binding method and limitations.
