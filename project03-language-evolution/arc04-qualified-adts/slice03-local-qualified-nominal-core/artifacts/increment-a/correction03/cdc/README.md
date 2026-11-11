# Independent correction03 receipts

Independent Sol review of increment A only, at source
`5caf3d871a80a711c08dbda0db8c5f5446dffb56`, tree
`115ce5ecc254ea9ed15263612bed67b6cec80ab2`, branch
`codex/qualified-adt-core`, task worktree
`/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`.
Source/index remained unchanged and clean. Root owns planning Git/index.

[Raw bounded archive](receipts-5caf3d87.tar.gz), SHA-256:
`d3a2505a1b74aff97870bacb9c134f551254bed1ca6538cf4c6ed7b10554f9d5`.
Original working evidence remains at `/private/tmp/lykn-s03-a-cdc-5caf3d87`.
The archive retains useful logs, Lykn helper sources, compiled helper output,
generated runtime modules and process/config/comparison receipts. It excludes
the copied executable and extracted cache; the exact executable digest and
byte-comparison results are retained. No prior evidence was removed.

## Navigation

Every `receipts/<name>/` has actual launch cwd/argv/selected environment,
stdout/stderr raw bytes and exit status. `run.lykn` implements this capture.

| Receipt / file | Actual proof |
| --- | --- |
| `emitter-forms` | 202 emitter tests, 974 other library tests filtered |
| `emission-results` | 8 tests, including single- and multi-clause parsed-span/public-fragment boundaries |
| `dispatch-matrix` | One integration test executes four module/parameter × checked/stripped native conditions |
| `same-spelling-macro` | One native owned-guard/source-macro control |
| `public-focused` | 24 tests: runway 12, host refs 7, browser compile/ESM 1, lazy Reflect invocation 4 |
| `m6-cold`, `m6/` | Copied actual built CLI, absent owned versioned cache, no canonical cwd fallback, seven module byte comparisons, five actual materialized public runtimes |
| `reference-probes`, `reference-results.json` | Existing Lykn all-nine driver: 27 actual runtime checks across unshadowed/module/parameter scopes; three unfinished public fragment rejections; shared-node compilation |
| `test-census`, `test-census.json` | Static census: 202 = 44 raw aliases + 125 direct public-call sections + 33 other sections; exact names retained |
| `full-make-check` | Fresh full `make check`; language units 1,176; corpus 1,513/0 across 67 steps; docs 482/0, once |
| `browser-size` | 42,223 gzip bytes; baseline 27,630; delta +14,593; under 80 KiB |
| `committed-citations` | Committed HEAD, 64 documents and 601 frozen historical citations accepted |
| `cold-cli-retry`, `cold-cli/result.json` | Freshly built release CLI copied to empty standalone cwd, empty separate XDG; real macro plus shadowed number/array/error runtime; seven module plus config/lock equality |
| `json-roundtrip`, `kernel-json*` | Actual native CLI complete kernel JSON → public compiler → emitted ESM runtime; exact guard/error results and empty runtime stderr |
| `final-pins-complete`, `pins.json` | Exact HEAD/tree/clean status, six-path diff, empty fixture diff, contiguous trailers, tools and three identical binary hashes |

Both explicit existing `DENO_DIR=/Users/oubiwann/Library/Caches/deno` and owned
`npm_config_cache`, XDG and tmp were supplied. Focused M6 receipt variables were
scoped to that command. Rust/Cargo 1.97.0; Deno 2.9.6. Built release, installed
`bin/lykn` and standalone copied CLI all SHA-256:
`5a226c7af5a79e91dc76464f02c7b40a24057bdbc4436b1bb0a5b7b988dcc476`.

## Attempts and limits

The first extra cold-driver attempt failed before starting any CLI child:
the reviewer used `package` as a binding, emitted as a strict-mode reserved JS
identifier. `cold-cli-first.lykn/js` and `receipts/cold-cli` preserve it. The
reviewer renamed only that probe binding to `package-path`; the subsequent
owned empty-cache runtime passed. This is not an A host-reference regression
or a source repair. The first and retry helper compile logs are preserved.
Helper compilation emits existing unused-binding warnings. The browser size
log retains existing astring package-condition warnings and esbuild registry
metadata access; no dependency was added. Full gate processes passed without
a gate retry. An incidental read-only process-inventory command was denied by
the sandbox; it supplied no verification evidence.

Prior 5a/16 HOLDs, correction02's two failing materialized dispatch cases and
saved partial patch remain in their original homes. No historical log was
reconstructed. Acceptance covers A/LC-01 host foundation, not all S03. Fixed
nine-value inline modules remain the approved provisional layout; sparse
imports/aliases do not imply a sparse module body or purity. Later B/C,
initialization-removal proof, I4, warm-cache, legacy fallback and browser
eval-based run/load limitations remain open as previously recorded.
