# DD01 baseline and replay protocol

Planning entry: 4bef53a, clean; existing planning worktree inspected before
writing. Static research only. Source worktrees and all original DB rows remain
unchanged. Exact original identities/variants and input-file hashes are in
[inputs.json](inputs.json); original packets remain authoritative for historical
runtime evidence rather than being replaced by this static packet.

The original Slice04 `artifacts/raw-transcript.txt` was rehashed unchanged:
`beb47407afaa2effbcd12c95206fff2f426556afb585aba37e4f1a82e95ed94f`.
Its nine retained failures remain historical evidence; the file is not
duplicated or edited here. Final post-seal packet/replay counts are in results.md.

| Identity | Frozen value |
| --- | --- |
| Compiler source | 4dded883bbd321d19635e6fce233343f33803f9e |
| Source tree | 218b085176053f1273642496cf75d7691c399f6e |
| Accepted CLI SHA-256 | d4a7028ebba234ffcd6fdb544c256489d22b840da2e94e0aa833b0520c834326 |
| Deno | 2.9.6, `/opt/homebrew/bin/deno` |
| Deno SHA-256 | 2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74 |
| Accepted binary | `/private/tmp/lykn-p07-db-final.LuQhzp/source/target/release/lykn` |
| DD scratch | `/private/tmp/lykn-p07-dd.RPMRfR` |
| Native config / lock | `{}` plus LF / `{"version":"5"}` plus LF |
| First official refresh receipt | 2026-09-14T02:39:51Z; September 13 local |

Binary hashes were refreshed and match. The source export/archive, full Git
interval/tree, version/OS receipts and Cargo metadata are retained. No build or
replacement compiler was needed. Deno 2.7.7 was not installed or compared.

## Static transport

Durable static transport used explicit curl retrievals of primary sources; no
package was installed. Official web pages were also consulted. Exact curl HTTP
headers and returned bodies remain in
`payload/transport/`. Archive endpoints are
`https://api.github.com/repos/denoland/std/tarball/COMMIT` for the three commits
listed in the inventory, and
`https://api.github.com/repos/nodeca/js-yaml/tarball/665aadda42349dcae869f12040d9b10ef18d12da`.
The inherited Eemeli archive/tag receipt remains in `payload/prior/upstream/`.
New ref receipts use `/repos/denoland/std/git/ref/tags/release-2026.07.30` and
`/repos/eemeli/yaml/git/ref/tags/v2.9.1`; the std tree request uses the same
immutable commit with `?recursive=1`. The org query is
`https://api.github.com/orgs/lykn-patch/repos?per_page=100` and returned one repo.
Version receipts use
`https://api.jsr.io/scopes/SCOPE/packages/NAME/versions/VERSION` for all five
frozen candidates. Eemeli latest-release receipt uses
`https://api.github.com/repos/eemeli/yaml/releases/latest`.
The bytes manifest is `https://jsr.io/@std/bytes/1.0.6_meta.json`; copied test262
LICENSE uses its immutable GitHub raw commit URL named in the inventory.
The packet provides length/SHA-256 for every returned file. No signed provenance
verification or registry build reconstruction is claimed.

Native Lykn `prepare` enumerates roots and hashes every published manifest file.
Both generated root programs pass check/lint/compile and emitted inspection;
**they are inputs only to Deno info, never to run**. Static graph commands from
`payload/` (with cleared environment/null stdin and private DENO_DIR) were:

```sh
deno info --json --no-npm --config upstream/std/deno.json --lock=transport/upstream.lock --frozen=false upstream-root.js
deno info --json --no-npm --no-config --lock=transport/eemeli.lock --frozen=false eemeli-root.js
deno info --json --no-npm --config source/export/project.json --lock=transport/compiler.lock --frozen=false source/export/packages/lang/mod.js
```

Their stdout/stderr and private caches are retained. `--frozen=false` applies
only to new preparation-lock paths, not to original locks. With no installed
npm and local graphs these commands did not emit new lock files; the named
absence is retained, not replaced with invented successful resolution. Original
package/runtime/development locks are separate retained bytes. Empty native
lock remains unchanged for every audit execution. Graph error nodes/edges are
research outcomes, not corrected or suppressed.

## Tested captured-evidence replay

Use the accepted binary above (rehash first); if absent, independently rebuild
only the exact source revision/lock using the existing source-build contract.
The bootstrap packet tool is the unchanged, reviewed
[Slice04 audit.lykn](../../slice04-dependency-and-runtime-boundary/artifacts/audit.lykn),
also retained as `payload/packet.lykn`. It supports gzip-hex JSONL capture and
safe create-new extraction. No candidate imports are involved.

From this artifacts directory, set an actual new scratch directory and copy the
bootstrap source plus this empty config/lock into it. The following route was
tested; substitute the actual absolute artifact and scratch paths:

```sh
dd_replay=$(mktemp -d /private/tmp/lykn-p07-dd-replay.XXXXXX)
dd_artifacts="$PWD"
dd_cli=/private/tmp/lykn-p07-db-final.LuQhzp/source/target/release/lykn
cp ../../slice04-dependency-and-runtime-boundary/artifacts/audit.lykn "$dd_replay/packet.lykn"
cp project.json deno.lock "$dd_replay/"
cd "$dd_replay"
"$dd_cli" check packet.lykn
"$dd_cli" lint packet.lykn
"$dd_cli" compile packet.lykn -o packet.js
# Inspect emitted capture code before running it.
env -i PATH=/opt/homebrew/bin:/usr/bin:/bin HOME="$dd_replay" DENO_DIR="$dd_replay/cache" DENO_NO_UPDATE_CHECK=1 NO_COLOR=1 "$dd_cli" run --no-prompt --cached-only --frozen=true --allow-read="$dd_artifacts/raw-transcript.txt" --allow-write="$dd_replay/extracted" packet.lykn extract "$dd_artifacts/raw-transcript.txt" "$dd_replay/extracted" < /dev/null
cd "$dd_replay/extracted/payload"
# File packets omit empty directories. These five are evidenced by the archives
# and the omitted-link manifest; restore layout without inventing source bytes.
mkdir -p upstream/std/fs/testdata/copy_dir_link_file prior/upstream/eemeli/playground prior/upstream/eemeli/tests/json-test-suite prior/upstream/eemeli/tests/yaml-test-suite prior/upstream/eemeli/docs-slate
"$dd_cli" check audit.lykn
"$dd_cli" lint audit.lykn
"$dd_cli" compile audit.lykn -o replay-audit.js
# Inspect emitted output; then regenerate native source/graph crosswalks.
env -i PATH=/opt/homebrew/bin:/usr/bin:/bin HOME="$dd_replay" DENO_DIR="$dd_replay/native-cache" DENO_NO_UPDATE_CHECK=1 NO_COLOR=1 "$dd_cli" run --no-prompt --cached-only --frozen=true --allow-read="$PWD" --allow-write="$PWD/source-inventory.json,$PWD/upstream-root.lykn,$PWD/eemeli-root.lykn" audit.lykn prepare < /dev/null
env -i PATH=/opt/homebrew/bin:/usr/bin:/bin HOME="$dd_replay" DENO_DIR="$dd_replay/native-cache" DENO_NO_UPDATE_CHECK=1 NO_COLOR=1 "$dd_cli" run --no-prompt --cached-only --frozen=true --allow-read="$PWD" --allow-write="$PWD/dependency-graphs.json,$PWD/inputs.json" audit.lykn graphs < /dev/null
cmp inputs.json "$dd_artifacts/inputs.json"
cmp dependency-graphs.json "$dd_artifacts/dependency-graphs.json"
```

The capture packet's original graph absolute paths remain provenance; replay
does not rewrite or dereference them. Native auditing reads relative retained
bytes. Re-running static graph transport in a relocated tree naturally changes
file URLs and is a separate condition, not byte-identical captured replay.
Source archive symlinks remain inside archives; expanded copies omit the 12
documented links. Original binary/source hashes, exact package metadata hashes
and all failed drafts survive. Results report packing/extraction counts and
post-seal replay receipts separately; a packet cannot contain its own final hash.

Scope: no runtime matrix, extra supported-pair claim, Y-14 execution, new API,
hard resource bound, design execution or library/source edit. Four program
authoring failures and one packet-layout verification condition are retained;
the fifth condition is charged conservatively to the ceiling. No new helper was
authored after it. The first 5,217-file packet and the initial 1,059-check prepare
receipt remain nested under `receipts/`; restoring the five empty directories
reproduces the original 1,063/4,886 checks and byte-identical JSON artifacts.
All parent DB rows remain byte-identical and open.
