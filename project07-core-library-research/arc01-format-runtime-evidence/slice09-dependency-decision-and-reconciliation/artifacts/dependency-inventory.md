# DD01 dependency inventory

CC research, 2026-09-13 local date. No package adoption or new candidate execution.
[dependency-graphs.json](dependency-graphs.json) contains complete captured graph
objects, every dependency record (including code/type resolution errors), package
export maps, 188 manifest-verified files, 594 published metadata edges, 4,587
regular source-file hashes, 15,618 source-reference lines, the 30-path interval,
full Cargo metadata and Eemeli's complete npm lock. Reference-line matches are a
search index, **not a JavaScript parser or proof of dynamic dependency closure**.
Exact raw files, source archives, locks, diffs and transport receipts are in the
[packet](raw-transcript.txt); paths below are relative to extracted `payload/`.

## Roots and boundary coverage

| Graph | Root population | Modules / dependency records | Unresolved evidence |
| --- | --- | --- | --- |
| Permitted published runtime/type | All 38 exports: json 6, jsonc 2, yaml 6, streams 24 | 67 / 144, including generated local root | No missing modules or resolution errors; no Node/npm module |
| Published development | Original 96 published TS roots | 168 / 453 | Three original missing URLs retained verbatim |
| Upstream std development | All 98 TS files under json/jsonc/yaml/streams in std commit 99cc1a3 | 257 / 705 | No missing module or edge error in this static condition |
| Eemeli source/test/build/examples | All 113 TS/JS/MJS files in immutable v2.9.1 archive | 124 / 654 | Five missing file nodes and 53 code/type edge errors; all retained |
| Existing JS compiler | `source/export/packages/lang/mod.js` | 15 / 23 | npm/astring intentionally unresolved by `--no-npm`; node:path present |

These are dependency records, not sums of separate code/type targets or unique
edges across graphs. Runtime/type classification comes from `kind`, `code`,
`type` and source ranges; path-derived categories are initial source-role labels.
A runtime file can contain a type-only edge. A test can import a runtime module.
The complete module objects preserve those distinctions. Source locators in
Deno graph ranges and JSR `specifierRange` are zero-based; the reference index
uses one-based line numbers. Do not treat the path label as semantic proof.

The old cache paths are provenance, not replay dependencies. Map
`/private/tmp/lykn-p07-db-final.LuQhzp/work/transport/` to `prior/transport/`,
`work/dev-transport/` to `prior/dev-transport/`, and the two old `work/gates/`
roots to `prior/gates/`. Current graph paths map the original DD scratch
`payload/` prefix to the extracted packet's `payload/`. Auditing captured graphs
uses relative packet paths and never reads those old absolute cache paths.

The runtime lock resolves std/bytes **1.0.6** as the only additional runtime
package: JSON → streams; JSONC → JSON (type); streams → bytes; YAML's value
implementation is local. `prior/transport/resolved.lock` preserves exact
specifier resolutions/integrities, and both transport caches retain module
bytes. `transport/bytes-meta.json` adds the full pinned transitive manifest,
exports and source graph. This does not upgrade any package. The original
rejected lock and incomplete graph files remain under `prior/transport/`.

## Three original development errors

| Original unresolved URL | Source locator and recovered context | Disposition |
| --- | --- | --- |
| `https://jsr.io/@std/jsonc/1.0.2/testdata/JSONTestSuite/test.ts` | Published `parse_test.ts:11`; recovered at `upstream/std-jsonc/jsonc/testdata/JSONTestSuite/test.ts` | Root std config excludes `jsonc/testdata`; package contains the importing test but omits the harness/corpus. Recovered source is evidence, not a repaired published URL |
| `https://jsr.io/@std/jsonc/1.0.2/testdata/test262/test.ts` | Published `parse_test.ts:12`; recovered at `upstream/std-jsonc/jsonc/testdata/test262/test.ts` | Same exclusion; exact source, fixture bytes and copied-corpus notices retained |
| `https://jsr.io/@std/streams/assert/mod.ts` | Published/upstream `concat_readable_streams_test.ts:3`, `../assert/mod.ts` | Relative sibling import works in repository; the published version directory yields the wrong URL. Upstream `assert/mod.ts` exists and the 257-module graph resolves it |

The first two are publication omissions, the third a repository-relative test
import. No test execution, package patch, empty substitute or resolution success
is claimed for the original failed URLs. Repository and published graphs are
different conditions; later upstream fixtures are not substituted into original
published runtime evidence.

## Published-to-upstream correspondence

| Package | Selected immutable upstream | Identical / different / package-relative absent |
| --- | --- | --- |
| std/json 1.1.0, 19 files | `a4ea43c2b50f9d220aeee33c80c4d78b9c6ee731`, release-2026.04.20 | 12 / 6 / 1 |
| std/jsonc 1.0.2, 5 files | `b3a2c2a2623db6b9ce833d79fbbb18e90722c269`, release-2025.04.24 | 2 / 2 / 1 |
| std/yaml 1.2.0, 32 files | `99cc1a3073207a3e231880698c1b05a1946dd446`, release-2026.07.30 | 28 / 3 / 1 |
| std/streams 1.1.2, 52 files | Same 99cc1a3 release | 27 / 24 / 1 |
| Eemeli YAML 2.9.1, 80 files | `1440ecd3d1bff41e4ac399f8f6839e810328bd16`, v2.9.1 | 78 / 2 / 0 |
| Total | All published manifest entries checked for length and SHA-256 | **147 / 37 / 4 = 188** |

All four package-relative absences are `LICENSE`: their bytes match the std
repository-root LICENSE, SHA-256
`0961f97da6619d5fe9ddb98649191d5ca6e958856ea5252f4cce7c9b85513819`.
They are relocated notices, not missing license evidence. All 35 std changed
files have explicit import-specifier rewrites in `transport/*-source.diff`.
The two Eemeli changes are `src/schema/yaml-1.1/{pairs,set}.ts`: the type-only
Schema import changes `../../schema/Schema.ts` to `../Schema.ts`, resolving to
the same local source. Do not call these 37 files byte-identical.

The July std snapshot retains JSONC version 1.0.2 but changes copyright years;
the earlier same-release source was therefore retrieved for the final published
crosswalk. The July snapshot remains separately identified for the complete
repository development graph. Exact publication identity is not established
by version text alone. Registry receipts retain rekor IDs where supplied, but
no Rekor signature/attestation verification was performed. YAML/streams registry
metadata has null rekor IDs. This is content correspondence with named release
commits, not a verified supply-chain attestation or byte-for-byte rebuild.

Deno cache entries append `// denoCacheMetadata=...` after the response body.
For example published yaml/mod.ts is 1,533 bytes while one retained cache entry
is 3,125 bytes. Both exact forms are retained; the published manifest hash refers
to the body, not the cache container. No cache hash is represented as a registry
source hash, and no bytes were silently stripped from the retained cache.

## License, ancestry and maintenance

std source and package LICENSE files retain the MIT notice. YAML additionally
declares js-yaml 3.13.1 ancestry at commit
`665aadda42349dcae869f12040d9b10ef18d12da`; `upstream/js-yaml/` contains that
archive's actual source, package manifest and Vitaly Puzrin MIT notice. The
ancestor declares argparse/esprima and development tools including browserify,
mocha and uglify-js. Those are historical ancestor dependencies, not current
std/yaml runtime imports. Their uninstalled registry transitive source closure
is unavailable here; no exact ancestor dependency installation is claimed.

JSONC's copied JSONTestSuite fixtures name commit
`d64aefb55228d9584d3e5b2433f720ea8fd00c82` and retain Nicolas Seriot's MIT notice
in their README. Copied test262 fixtures name
`488eb365db7c613d52e72a9f5b8726684906e540`; the exact upstream LICENSE is retained
at `transport/test262-LICENSE`. These test-corpus ancestries are distinct from
the JSONC runtime implementation.

Eemeli's root/published ISC license and copyright match. Its actual source uses
node:process in `src/log.ts:1`, `src/compose/composer.ts:1` and
`src/parse/parser.ts:1`, and node:buffer in `src/schema/yaml-1.1/binary.ts:1`.
Published metadata records their reachable runtime/type edges. JSR's
`usesNpm:false` field does not mean Node-API-free. Build scripts and the complete
package-lock retain npm tool versions, integrities and dependency declarations;
none was installed or executed. Browser Rollup config uses Babel/TypeScript and
replaces Buffer/emitWarning with null plus an env object. Those substitutions
change available behavior; browser targeting is not proof of API equivalence.

Eemeli's five missing files are browser/dist/index.js, dist/cli.mjs,
dist/index.js, dist/util.js and the extensionless src/index test reference.
The first four require generated distribution outputs absent from the source
archive; the fifth belongs to upstream resolver conventions. The 53 edge errors
retain bare tool/test/self imports such as rollup, plugin packages, yaml,
yaml/util, fs/path/stream. `--no-npm` deliberately leaves their executable source
closure unresolved. Package-lock and config/jest.config.js provide declared
upstream resolution context, not compatible Deno execution. Dynamic test fixture
loading, package script execution and generated-build graphs remain unexecuted
and cannot be certified by the lexical reference census.

Four upstream gitlinks are also explicit unavailable source boundaries; the
archive has empty directories, not their contents. `.gitmodules` and immutable
`transport/eemeli-tree.json` identify them exactly. None was fetched or executed:

| Gitlink / role | Repository | Pinned commit |
| --- | --- | --- |
| docs-slate / documentation build | eemeli/yaml-docs | 1300e6d10471c1a158752a0eb10e2122d3fb1aae |
| playground / browser example and tests | eemeli/yaml-playground | 9b7816fee30a30b9546d1f59e9529c5e7a58856f |
| tests/json-test-suite / corpus | nst/JSONTestSuite | 984defc2deaa653cb73cd29f4144a720ec9efe7c |
| tests/yaml-test-suite / corpus | eemeli/yaml-test-suite | 50861920b1fd990159811fdbdca1beeb7ab3604a |

Thus 113 roots means every TS/JS/MJS file **present in the parent source archive**,
not a complete checkout including these submodules. Their outgoing dependencies,
license contents and runtime behavior remain unretrieved. The design prerequisite
must resolve relevant example/build/corpus boundaries before any later route
acceptance; missing submodules cannot be counted as clean empty graphs.

The std repository's deno.json also declares npm fast-check, node-graphviz and
TypeScript; its Node/Bun test tasks use additional installers/runners. These
whole-repository development roots are explicit build/test declarations with
unretrieved executable transitive source, distinct from the resolved selected
98-root development graph. `_tools/`, workflows and configs are retained for
inspection, not silently admitted as a policy exception.

Official metadata was refreshed on the recorded UTC retrieval date in
`transport/retrieved-at.txt` (2026-09-14 UTC / 2026-09-13 local). The five pinned
JSR version receipts report not yanked and zero newer versions at retrieval;
GitHub's latest Eemeli release receipt identifies v2.9.1, published September 11.
These support a dated availability observation, not a maintenance-quality or
future-support guarantee. Source authorities: [std release](https://github.com/denoland/std/releases/tag/release-2026.07.30),
[Eemeli release](https://github.com/eemeli/yaml/releases/tag/v2.9.1),
[pinned std YAML source](https://github.com/denoland/std/blob/99cc1a3073207a3e231880698c1b05a1946dd446/yaml/mod.ts).

## Full compiler interval

`source/full-interval.diff`, `source/changed-paths.txt`, source archive/tree and
the JSON `interval` cover **all 30 paths**, d0bb981 → 4dded88. Fifteen newly
embedded files are byte-identical to their corresponding packages/lang files:
binding.js, classifier.js, compiler.js, deno.json, deno.lock, expander.js,
icu-parser.js, kernel-forms.js, kernel-mark.js, mod.js, reader.js,
reserved-words.js, surface-ast.js, surface-helpers.js and surface.js. Their
functions/imports are retained with line locators; embedding changes packaging,
not an independently reimplemented compiler. The remaining 15 paths are:

| Paths | Actual change / boundary implication |
| --- | --- |
| .github/workflows/{ci,consumer-smoke,deno-compat}.yml (3) | actions/checkout v4 → v5; CI transport/tooling, not candidate runtime |
| Cargo.toml, Cargo.lock (2) | Three workspace crate versions 0.6.0-dev → 0.6.0; locked dependency graph retained via Cargo metadata |
| Makefile (1) | Dry-run uses cargo publish --dry-run; removes prior implicit allow-dirty package-list shortcut |
| crates/lykn-cli/src/main.rs (1) | Pass script directly; prefix leading-hyphen local files; preserve stdin and relative spelling, without injected grants |
| crates/lykn-cli/tests/run_permissions.rs (1) | Explicit cached/frozen controls; all routes, argv, stdin, path/symlink and denial regressions; source evidence only here |
| crates/lykn-lang/src/expander/embedded.rs (1) | include_dir moves to crate-local embedded/packages/lang so packaging is self-contained |
| docs/guides/12-deno/12-01-runtime-basics.md, docs/guides/15-lykn-cli.md (2) | Explain run/stdin/separator/path behavior and preserved permission boundary |
| packages/{browser,lang,testing}/deno.json (3) | Package version 0.6.0-dev → 0.6.0 |
| release-notes-0.6.0.md (1) | Draft release summary; explicitly not publication evidence |

The embedded/compiler graph imports npm/astring (lock 1.9.0) and node:path
(`packages/lang/expander.js:16–31` explains the browser shim). Source tooling
uses acorn 8.17.0 and esbuild 0.27.4. Cargo metadata preserves normal/dev/build
kinds, feature and target conditions, package license/source fields and resolved
nodes; it is build provenance, not proof that every target was executed. The
source test command retains explicit -A and the test-wrapper policy debt remains
Arc03/Slice02. These facts qualify “zero runtime dependencies in compiled output”:
they do not imply a Node/npm-free compiler or development toolchain.

Original archives retain symlinks. To keep extraction safe and replay portable,
12 unrelated symlinks were omitted from expanded audit copies; their exact link
spellings are in `transport/archive-symlinks.txt` and their original archives.
No changed-interval file is omitted. The 4,587 count is regular expanded source
files, not all archive entries. No source worktree was edited.
