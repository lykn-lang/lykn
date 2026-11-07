# Frozen source and preflight intent

Source/control/prediction freeze precedes every check and execution. Planning
HEAD at freeze: `4e1b16858888c54a62dd08965b30ce03370d9f29`; source remains clean
at `5408abd432b8789ae474a3895436f68818c4e482`; task checkout is clean at
`5408abd432b8789ae474a3895436f68818c4e482`. No commands or cases have run.

Frozen SHA-256 pins:

| File | SHA-256 |
|---|---|
| `artifacts/tooling/parser-core.lykn` | `6ca1afe83d6d9a47f7eb1fea7f0aa3872ae626cc4f39d5b3ed017aab38308bf7` |
| `artifacts/tooling/estree-walker.lykn` | `f16e28e84e3a5e1c35501e2dc472f8556f28223184bc0640a4814561cade5a3d` |
| `artifacts/tooling/scanner.lykn` | `4a7c3f9e22fd935341dc226303561e06d1076fc47be524fb80a45cb81b6320d3` |
| `artifacts/tooling/capability-observer.lykn` | `611dea52ea2dbea9079968ed3d78eda63e762a2730429ff6b811e8c9a3d097a8` |
| `artifacts/controls.json` | `0f20dba4713b93671b337fa1ba0a5cde00fdbe29bed195a00e3ae1c689473a5d` |
| `artifacts/predictions.md` | `b20e7b3359fc77bd53f6e229745a9625f964cefeab7f3c67752f23115b59517f` |

`controls.json` compares byte-for-byte with Slice12's original full controls.
Acorn remains the literal cached ESM at its recorded hash. Deno invocation uses
the resolved `/opt/homebrew/bin/deno` 2.9.6 executable/hash. Native CLI is the
absolute `release/0.6.x/target/release/lykn` 0.6.0 binary/hash.

Native gates will run from fresh `/private/tmp/lykn-s17-cc` with no ancestor
`project.json` or `deno.json`, against byte-copies of these four Lykn modules.
Commands use only that absolute CLI: `check FILE`, `fmt --check FILE`, `lint
FILE`, then default strict `compile FILE --output <owned ignored
target/slice17/generated/NAME.js>`. Capture each argv/cwd/executable hash/raw
stdout/raw stderr/exit under unique `artifacts/evidence/cc/native-*` files.
Generated JS is reviewed in full before Deno checks or guards.

Gate child plan, frozen before launch:

- Observer args: absolute paths to this `controls.json`, `/opt/homebrew/bin/deno`,
  generated `scanner.js`, `parser-core.js`, `estree-walker.js`, absent
  `target/slice17/run`, absent `target/slice17/cache`, and the verified
  config-free `/private/tmp/lykn-s17-cc` cwd.
- Outer observer flags: `--no-config --no-npm --no-remote --cached-only
  --deny-net --no-prompt`; exact file reads for controls, Deno executable,
  Acorn file, observer/scanner/core/walker JS, seed
  `run/seed/K01.js`, every `run/Kxx/manifest.json`, and staged `input.js` for
  K01–K09 and K10b. No directory-wide read, env or network grant. Exact writes
  only to absent `run` and `cache` roots. `--allow-run` names only the absolute
  Deno executable. Environment is cleared to fixed `PATH`, per-case `DENO_DIR`,
  `DENO_NO_UPDATE_CHECK=1`, and `NO_COLOR=1`.
- Each scanner child gets exact reads for its manifest, the three imported
  generated modules, parser where applicable, and its input where applicable;
  zero write/run/env/network grants and a fresh cache. K10a gets only the exact
  missing-path read grant; K10b's existing path is omitted. K11 has no input
  grant; K12 has no parser grant.
- Observer records attempt argv/grants/tool/input/manifest hashes before each
  child; then saves raw stdout/stderr bytes, child result and raw JSON report
  before decoding or assertions. The supervisor stops at the first unexpected
  oracle and retains remaining rows as unrun.

The exact shell-captured native and Deno invocations, permission lists and
receipts will be appended as separate raw evidence; this intent is not a claim
that any gate or case passed.
