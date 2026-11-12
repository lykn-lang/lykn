# Independent IC-01 correction02 verification — ACCEPTED

Independent review accepts **IC-01 only** at clean
`e80f613baf8f52d7b8f42e05ac38e99c69513d46`, tree
`7376b33d7ca8e66942afd88036599e9e5e4bae35`, branch
`codex/qualified-adt-core`, source worktree
`/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`.
Reviewed the six-path b8a1fa17-to-e80f613b delta against issued iteration08,
correction02 design, role contract and slice plan v1.14. Prior 5bdb/b8 HOLD
records remain historical. No source/index edit, stage or commit was made;
source remains clean and git diff --check passes. Root owns planning status.

[Raw receipts](receipts-e80f613b.tar.gz), SHA-256
`a889c79e0a1fb50847b9a0dbe8edd975a45096b1a0bd9d75eaef46c32c93fd7a`.
Working originals: `/private/tmp/lykn-s03-ic01-cdc-e80f613b`.
The archive preserves Lykn-authored drivers, their compiler-produced JS,
sources/generated ESM, actual invocation environments/arguments/numeric exits
and streams, independent full log and M6 byte/runtime receipts. Caches and the
copied executable are excluded; its exact hash and invocation are retained.

## Findings closed and bounded source review

- **R06:** The original loop and bind keyword-key/package-local inputs now
  reject through actual native checked compile, stripped compile and check,
  plus public direct validation/complete/expandExpr. Corresponding safe locals
  compile/check and actual native checked/stripped and public ESM each print
  exactly `1\n` with empty stderr. Typed nested-alias external `package` key
  remains legal and emits runtime `local-value\n` on both backends/modes.
- **R07:** The retained independent direct walker shows named kernel function
  `[example,value,local,inner]`, typed fn/arrow `[value,local,inner]`, class
  `[Example,value,local,inner]`, declaration `[value,local,inner]`, each once.
  Product direct-count assertions cover named func/genfunc, anonymous generator,
  fn/lambda/genfn, arrow and escaped kernel lambda; native equivalents pass.
  Distinct same-spelled parameters remain two actual sites, not globally
  deduplicated. Parser function and clause-key Set reexport identities remain
  equal in the independent driver.
- **R08:** Actual standalone `(func)` and `(genfunc)` now exit **1**, never101,
  in native checked/stripped compile and check, with the established missing-name
  diagnostics. Public complete/expandExpr preserve ordinary errors. Direct
  walkers return no fabricated binding; reserved-name validation alone is not
  a grammar validator and therefore need not reject a binder-free malformed
  header.

The private projection/default caller census in both modules now explicitly
selects TypedParameter for typed source func/genfunc/fn/genfn/lambda headers,
BindingPattern for source bind/declarations/loops/catch/raw class parameters,
kernel function/function*/arrow/lambda and public pattern-helper adapters.
Recursive calls retain grammar. No private grammar default remains. Match
patterns use their existing separate grammar. Surface typed lambda is distinct
from actual escaped native kernel lambda and trusted public markKernel lambda;
the public escape whitelist remains unchanged. Public function traversal
projects sites once, walks defaults once, then only its actual body sequence;
native empty-header splitting is checked. Optional alias defaults in loop and
catch are exercised by direct validator tests. The catch emitter's older
safe-input failure is still not runtime coverage or a repaired claim.

Prior independently repaired R01–05 evidence remains applicable to unchanged
clause parser/computed-callee policy. This pin's focused public/product tests,
CLI controls and full suite keep those controls green. The independent census
also re-executes supported restricted/renamed macro output, typed alias,
last-wins body groups and both public body/post textual orders. Public orders
actually print `true\n`; native body-before-post prints `true\n` checked and
stripped and passes check. Native known post-before-body rejection is retained
as required; no general resolver/order repair is inferred. The supported safe
macro actually prints `0\n` and repeated body groups print `1\n`.

No substantive software finding remains in this bounded corrected review.

## Independent gates and actual populations

| Check | Actual independent result |
| --- | --- |
| canonical-mapped public parity + role tests | 20/20: 3 parity + 17 role |
| native binding units | 33/33; 1,154 filtered |
| native CLI compile controls | 43/43; 141 filtered |
| fresh make check | numeric exit0; all-checks-passed marker |
| full language units | 1,187/1,187 |
| product corpus | 1,536 passed, 67 steps, 0 failed |
| documentation, once within make check | 482/482 |
| committed-HEAD cited paths | exit0; 64 documents, 601 historical citations |
| browser budget | exit0; 43,996 gzip bytes, +16,366 over27,630; within80KiB |
| fresh cold release-profile M6 | 1/1 integration test, 5 filtered |
| actual M6 materialized public suite | 28/28: 11 retained + 17 role |
| M6 canonical/embedded/materialized compiler union | 12/12 byte comparisons |
| supplemental current mirror inventory | 7/7 changed/new IC module comparisons |

The canonical focused config maps `lang/` directly to current `packages/lang/`,
not stale target staging. Existing `DENO_DIR=/Users/oubiwann/Library/Caches/deno`
and owned npm/XDG/tmp are recorded from the first focused launch. Tools were
Rust/Cargo1.97.0, Deno2.9.6. Full make check already includes docs, so no extra
documentation run was made. Existing compiler warnings and esbuild package
condition-order warnings remain in stderr; they were not suppressed.

## Actual delivery and ESM consumers

`cold-cli.lykn` copies **bin/lykn produced by this fresh full build** to an
initially empty standalone directory and uses a distinct initially empty owned
XDG cache. There is no colocated canonical package fallback. Its actual macro
trigger prints42, then Number/Array/error host-shadowing controls produce the
expected TypeError/TypeError/Error results with empty runtime stderr. Twelve
materialized compiler modules plus deno.json/deno.lock match embedded bytes.
The separate M6 test independently compares canonical, embedded and actual
materialized bytes for all12 modules, then runs all28 public cases through its
recorded real materialized lang/ import map.

`copied-controls.lykn` uses that copied binary for package, normalized if!,
R06 loop alias and supported macro-parameter negatives: each of twelve
checked/stripped/check invocations exits1 with the intended identifier message.
Legal package property/global eval/bound bind call source compiles in both
modes, executes generated `.mjs` as `property-ok\nfunction\n` with empty stderr,
and passes check. This is actual generated ESM execution, not string presence.

`browser-controls.lykn` imports normal compileLykn with the browser-specific
expander mapping used by the bundle. It rejects package, normalized if! and
the loop alias; actual shadowing output contains a fallback import and its
generated `.mjs` executes the expected three guard/error results in an
ESM-capable Deno consumer with no network/npm access. This accepts compile
output only: indirect-eval run/load cannot execute fallback imports and remain
an explicit S06 execution-policy limit. No new CSP/eval policy is claimed.

Fresh full-built bin/lykn and its independent copied CLI SHA-256:
`67dc1b6ad2881b9b80fabfc36544db90f7eb6f4d1c8577b5aff32f1189e75106`.
The later release-profile Cargo M6 build leaves target/release/lykn at
`36fe67a4ae7e26d5df01245110b2a117ea2d8109fe682cd9ed2cbae4c3bd905f`.
Both use the same committed source; the record does not assert these binaries
are byte-identical. `receipts/final-binary-hashes/` preserves the actual hashes.

## Receipt navigation, failed attempts and limits

- `receipts/full-make-check/`: numeric exit0, complete raw stdout/stderr.
- `receipts/canonical-focused/`, `native-binding/`, `native-compile-controls/`:
  actual focused populations.
- `census-results.json`, `replay-summary.json`, `probes/`, and
  `receipts/changed-census/`: original changed-path witnesses and positives.
- `extra-role-results.json`, `extra-roles.lykn`: direct occurrence counts and
  parser/Set identity.
- `m6/`: twelve comparisons, source/generated output, actual command/map,
  numeric status and materialized28-case streams.
- `cold-cli/result.json`, `cold-cli/controls.json`: cold launch/bytes/runtime
  and actual copied-CLI compile/check/strip/positive ESM observations.
- `browser-result.json`, `browser-output.mjs`, `browser.json`: browser adapter
  mapping, rejected bindings and actual fallback ESM execution.
- `inventory.json`, `receipts/final-source-status/`, `final-binary-hashes/`:
  exact pin/tree, clean branch, changed paths, contiguous trailers, tools and
  existing unchanged DD49 comparison (known blank line only).

Two reviewer setup/helper failures are retained with successful corrections:
the first M6 invocation exited101 before product execution because the required
evidence directory had not been precreated; after directory creation a fresh
cold fixture passed. The first browser research helper used forbidden bare
`set!` and failed compilation; its original Lykn source and raw diagnostic are
retained, then the helper was corrected to an object property before running.
These do not indicate a product regression. An exploratory rg/sed used the
wrong source path/current directory during navigation; it did not execute a
product oracle. CC's earlier missing full wrapped numeric status and historical
transcript-only failed logs/Clippy stream remain disclosed; this independent
run supplies new actual receipts, not reconstructed historical ones.

Accepted A/B1 stay unchanged. IC acceptance does not close LC02–08 or S03,
activate qualified constructors/purity, fix legacy D1 source Func/class
aggregates or native ordering/catch emission, solve browser run/load, or change
I4/warm-cache/legacy fallback limits. Release0829 remains untouched. Source/build
and CDC record/evidence ownership return to root; root retains planning
Git/index/ledger/status and architecture. No further implementation or release
authority follows from this acceptance.
