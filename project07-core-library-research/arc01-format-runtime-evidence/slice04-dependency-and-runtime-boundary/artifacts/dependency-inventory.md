# Dependency inventory: exact bytes, qualified coverage

[dependency-graph.json](dependency-graph.json) is the native inventory output,
not an assertion that every dependency surface is complete. It retains published
file URLs, lengths/hashes, metadata, the all-export graph and module identities.
The native inventory passed 654 checks, reporting five packages and 67 modules.
Prior published-file evidence covers all 188 files and remains nested in the
packet; repeated checking does not create additional unique files.

| Surface | Evidence | Limit / remaining owner |
| --- | --- | --- |
| Permitted public exports | All 38 exports of std/json 1.1.0, jsonc 1.0.2, yaml 1.2.0 and streams 1.1.2; 67-module graph including local root; no Node/npm or unresolved edges | Exact resolved condition; no blanket claim about every development surface |
| Resolved transitive package | std/bytes 1.0.6 | Exact integrity and dependency relationships in frozen lock |
| Published development/test sources | Separate static graph from 96 published TypeScript files; original graph, lock and source cache retained | Three unresolved modules; full development/example/type classification owed to planned Slice09 |
| Eemeli YAML 2.9.1 | Immutable upstream archive/tag receipt, package manifest/lock, source, browser build config, ISC license | Static only; Node edges and npm build ancestry; no compatible execution route established |
| Lykn toolchain | Immutable source archive, full Cargo metadata/lock, configs/workflows/embedded source, 30-path compiler interval | Complete classification and published-to-upstream crosswalk remain owed to Slice09 |

[project.json](project.json) and [deno.lock](deno.lock) are the exact permitted
package config and resolved lock. Their SHA-256 values are respectively
`d47e3a254a709253bcc123a4e0fc6309b30384bf11b5ad637a5df44f63400607` and
`7e120ebdafdeaa8eb00f86413f2604843b891c6882c5f5abef8c35c0214c107d`.
The inherited merged lock failed frozen all-export resolution; its exact bytes
are retained as `work/transport/rejected-inherited-lock.json`. Creating a distinct
resolved preparation lock was not silently changing a frozen research record.
Native tools use separate empty configs/locks. The graph root's generated JS
comes from gated Lykn; no generated JS was hand-repaired.

The separate development graph contains these unresolved locators:

- `https://jsr.io/@std/jsonc/1.0.2/testdata/JSONTestSuite/test.ts`
- `https://jsr.io/@std/jsonc/1.0.2/testdata/test262/test.ts`
- `https://jsr.io/@std/streams/assert/mod.ts`

They are retained as graph errors, not pruned or evaluated. Runtime export
closure does not close this development graph. Slice09 must attribute each to
published packaging/source context, retain exact dependency categories and
establish a reproducible crosswalk or an explicit unavailable disposition.
Static transport, including error resolution, is distinct from module evaluation.

The Eemeli v2.9.1 tag resolves to commit
`1440ecd3d1bff41e4ac399f8f6839e810328bd16`; the immutable tarball and tag receipt
are retained under `payload/work/upstream/` and `payload/logs/`. Its direct source
edges include `node:process` in `src/log.ts`, `src/compose/composer.ts` and
`src/parse/parser.ts`, plus `node:buffer` in `src/schema/yaml-1.1/binary.ts`.
Browser Rollup configuration supplies substitutes but depends on npm build tools
including Rollup, Babel and TypeScript; no browser artifact was accepted as a
policy-compliant route. The exact upstream package lock and build configuration
are preserved, not installed. The [upstream manifest](https://raw.githubusercontent.com/eemeli/yaml/v2.9.1/package.json)
supports the package/build distinction; the immutable archive is the retained
source authority for this condition.

Published std/yaml source explicitly cites js-yaml 3.13.1 at commit
`665aadda42349dcae869f12040d9b10ef18d12da` with MIT copyright. This is declared
ancestry, separate from current JSR transport/runtime edges. Exact published
checksums prove file identity against registry metadata, not independent release
provenance. The source-to-upstream byte/license mapping for all candidates remains
owed; tag lookup did not establish a complete standard-library release mapping.
Do not infer acceptance or rejection of an independently maintained port from
ancestry alone: operator policy disposition remains required.

The selected source config retains `npm:astring@^1.9.0`; its lock resolves astring
1.9.0, acorn 8.17.0 and esbuild 0.27.4, and the embedded compiler has an astring
mapping. These existing compiler/development dependencies are distinct from
permitted new-library runtime imports. Full Cargo metadata was captured with
`--locked --offline`; it does not execute npm packages. Source changes between
d0bb981 and 4dded88 include embedded compiler, configs/locks, CI, Makefile and
guides. Slice09 must finish their category/lineage implications; the launcher
fix alone cannot stand in for that interval audit.

R-09 established only the accepted 4dded88/Deno 2.9.6 pair. The operator removed
2.7.7; no supported second installed pair was established and none was installed
for comparison. Owner: Slice09; re-entry requires an actually available supported
pair, exact identities and independent controls. Historical 2.7.7 evidence is
not a live compatibility comparison.
