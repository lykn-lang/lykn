# DB01 resumed baseline and partial replay protocol

Status: partial CC evidence, stopped after the amended failure ceiling was
exceeded. The [closing report](../closing-report.md) is authoritative for current
scope/status; original protocols and failures remain in the packet. All eight
DB criteria remain open. Dates use the operator's 2026-09-13 local session;
the second manifest records 2026-09-14T00:05:23.009Z.

| Identity | Value |
| --- | --- |
| Planning start | b54714b; clean planning worktree |
| Immutable source | 4dded883bbd321d19635e6fce233343f33803f9e |
| Source tree | 218b085176053f1273642496cf75d7691c399f6e |
| Fresh locked release CLI SHA-256 | d4a7028ebba234ffcd6fdb544c256489d22b840da2e94e0aa833b0520c834326 |
| Deno executable | /opt/homebrew/bin/deno, 2.9.6 |
| Deno SHA-256 | 2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74 |
| V8 / TypeScript | 15.0.245.2-rusty / 6.0.3 |
| Native supervisor baseline | Arc03/Slice07 commit 910268d, independently CDC closed |
| Packet SHA-256 | beb47407afaa2effbcd12c95206fff2f426556afb585aba37e4f1a82e95ed94f |

The source archive was built in exclusive scratch with `cargo build --release
--locked`; the selected CLI matches the accepted binary. Registered source
worktrees and shared binaries were not modified. The source interval d0bb981 to
4dded88 has 30 changed paths, including embedded/compiler/toolchain changes;
it is not solely the launcher fix. Full Cargo metadata, help, versions, configs,
lock bytes, archive and corrected root-scoped diff are retained under `payload/meta/`.
The initial empty subdirectory-scoped diff is retained as a setup mistake.

Runtime supervisors use cleared environment, null stdin, no prompt, frozen
locks and cached-only execution for permitted graphs. No-grant parsers and
path-scoped file grants are distinct from explicit host observation/kill and
isolated `/bin/ln` setup. The normal stop is 9s with 10s external deadline,
16MiB output and 512MiB sampled process-tree RSS; smaller controls deliberately
exercise stops. These are observed bounds, not allocation/durability guarantees.
Each condition has five external controls. The latest manifest specifies
48 executable variants/103 attempts and 11 static rows. Full successful replay
and five negative audit copies are still owed.

`work/` is the first frozen condition. `work02/` is the corrected second condition;
never mix their source hashes, expectations, records or denominators. Its exact
runtime audit hash is in [inputs.json](inputs.json). The top-level
[audit.lykn](audit.lykn) is a later, gated capture-only revision supporting
lossless gzip-hex packets; it is not the audit used to generate runtime records.
[cases.lykn](cases.lykn) and [supervisor.lykn](supervisor.lykn) are work02 snapshots.
The top-level [project.json](project.json) and [deno.lock](deno.lock) describe
permitted package imports. Native tools instead use the empty config and version-5
empty lock preserved separately in each packet condition. Do not run capture
under the package config or mistake the invalid closeout helper for tooling.

## Tested captured-evidence replay

[raw-transcript.txt](raw-transcript.txt) is JSONL, 20,067,124 encoded bytes,
3,997 files, 144,067,786 decoded bytes. Each row carries its safe relative path,
uncompressed byte count/SHA-256, `encoding: gzip-hex` and compressed bytes.
The capture tool checks unique safe paths and decoded lengths/hashes, writing
only new files. Packing and fresh extraction each passed 11,991 checks.
The packet contains both exact conditions, all raw process records/streams,
fixtures, emitted/gate evidence, historical Slice04 artifacts and source archive;
transport source caches are retained under `meta/runtime-package-cache` and
`meta/static-dev-cache`. Machine-local absolute locators remain provenance,
not portable resolution instructions.

The actual fresh replay was performed at
`/private/tmp/lykn-p07-db-final.LuQhzp/evidence/extracted`. From the isolated
`evidence/` directory with native project/lock, `home/`, `tmp/`, `cache/` and an
empty `extracted/` directory, the tested extraction invocation was:

```sh
env -i PATH=/opt/homebrew/bin:/usr/bin:/bin HOME="$PWD/home" TMPDIR="$PWD/tmp" \
  DENO_DIR="$PWD/cache" DENO_NO_UPDATE_CHECK=1 NO_COLOR=1 \
  ../source/target/release/lykn run --no-prompt --cached-only --frozen=true \
  --allow-read=./raw-transcript.txt --allow-write=./extracted \
  audit.lykn extract raw-transcript.txt extracted </dev/null
```

For another location, copy the packet/capture audit into exclusive scratch,
create its native `project.json` as `{}` plus LF and `deno.lock` as
`{"version":"5"}` plus LF, and substitute an absolute accepted CLI path.
Do not overwrite an existing extraction. The audited shell dispatcher in the
packet only invokes each condition's unchanged Lykn semantic verifier:

```sh
DB_CLI=/private/tmp/lykn-p07-db-final.LuQhzp/source/target/release/lykn \
DB_ROOT=/private/tmp/lykn-p07-db-final.LuQhzp/evidence/extracted/payload \
DB_LOGS=/private/tmp/lykn-p07-db-final.LuQhzp/logs/extracted-reverify \
/bin/bash /private/tmp/lykn-p07-db-final.LuQhzp/evidence/extracted/payload/meta/verify-captured.sh
```

This completed with exit 0 and `All retained semantic-audit dispositions
reproduced.` It matched all 163 original audit exits, including three expected
failures; it does not turn those failures into passes. An earlier identical
163-record replay is retained inside the sealed packet. Post-seal extraction
and replay receipts are reported here; a packet cannot include its own final
seal/replay receipts. Packet hashing verifies extracted file bytes, while the
existing semantic audits verify record contents. A new crosswalk between every
physical extracted fixture and its record was not completed: the ninth draft
intended for that purpose was rejected before execution.

## Fresh runtime re-entry

No complete successful 103-attempt fresh replay exists. The retained per-group
supervisor invocations/gates are evidence of the actual partial execution, not
an instruction to replay a known failing full suite. Independent preparation
review must first accept [Slice08](../../slice08-file-fault-completion/slice-plan.md).
That unit freezes corrected source-temp grants, revalidates affected controls,
and completes the remaining faults. Planned Slice09 then owns full composition,
negative controls, exact inherited reconciliation and successful fresh/captured
replay. Preserve every failure and original ID; do not reset Slice04's history.
