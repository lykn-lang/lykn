# Slice06 — Deno launch compatibility

Status: **Open for execution.** Expedited Mode. This is a prerequisite correction
opened by Arc01/Slice04's reproduced D-2609-DARG failure. Numbering does not change
the existing test-permission, guide, book/language and integration owners.

## Capability and evidence

Restore explicit `lykn run` script selection on the available Deno 2.9.6 while
preserving permission scopes, argument bytes, filename safety, configuration,
compiled output routes and child exit status. Read the
[Slice04 blocked report](../../arc01-format-runtime-evidence/slice04-dependency-and-runtime-boundary/closing-report.md)
and its baseline, raw files, argv and pinned Deno parser source before editing.

The original d0bb981 CLI hash is
`78aac90c4b4d6c644ac376e99ce91f88cdae32477aff476980912e68eba0c1bb`.
The available Deno 2.9.6 hash is
`2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74`.
The operator removed 2.7.7 during upgrade. Two no-grant and two explicitly
all-granted minimal runs fail before execution. Source analysis identifies the
pre-script `--` / missing script_arg interaction; stdin was closed and is not
the tested failure. Do not infer a Deno stdin regression.

## Source scope and implementation constraints

Use the existing `release/0.6.x` worktree at
`/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x`; inspected HEAD was 50608c4,
not authority to reset it. Inspect current worktree/status first. Read its
AGENTS.md, installed rust-guidelines (already approved substitute), testing
guidance and pinned Lykn fixture guidance. No main/source propagation or push.

Exact source paths:

```text
crates/lykn-cli/src/main.rs
crates/lykn-cli/tests/run_permissions.rs
docs/guides/15-lykn-cli.md
docs/guides/12-deno/12-01-runtime-basics.md
```

Source changes must solve selection without interpreting filenames or script
arguments as runtime options. Inspect absolute/relative local paths, spaces,
leading-hyphen JS filenames, standalone/workspace/no-project routes and any
currently supported specifier forms before choosing normalization. Preserve
literal script arguments, the caller's optional separator, configured overlays,
requested flags (including explicit `--allow-all`), and nonzero exits. Do not
silently inject grants or remove frozen/cache controls. The user's all-grants
diagnostic did not repair selection and does not remove denial-test obligations.

No PATH shim, hand-edited generated JS, direct-Deno runtime-matrix fallback, dependency
installation, Deno downgrade, upstream patch, unrelated CLI redesign, automatic
snapshot acceptance or unapproved extra source path. If current supported forms
require broader changes, amend the exact source scope before editing them.
The operator-suggested eval route remains an explicit exception for native
Lykn-authored evidence tooling; it does not validate restricted wrapper behavior.

## Required verification

1. Reproduce original no-import launch failure on the actual available runtime;
   retain source/emitted code, exact argv, environment and exit. Original bytes
   and failed draft sources in Slice04 stay unchanged.
2. Add meaningful argv and real-runtime regressions covering all existing run
   routes, spaces/leading-hyphen filenames, option-like script arguments, explicit
   grants/denials, repeated and empty scopes, overlay config and nonzero exit.
   Demonstrate actual NotCapable errors, rather than accepting generic exit 1.
3. Demonstrate corrected no-import execution, denied and scoped read/write, and
   argument preservation through the actual 2.9.6 executable. Keep frozen/cache
   controls explicit. A fake recorder alone does not prove runtime compatibility.
4. Run targeted `cargo test -p lykn-cli --test run_permissions`, canonical
   `make check` and `make check-cited-paths` in the source home. Investigate actual
   gate failures without bypass flags. Do not redundantly chain test-docs after
   make check. Record the host observation route when needed.
5. Commit only the exact changed source paths, then build a traceable corrected
   executable in isolation. Reconcile source/tree, toolchain/settings, binary
   hash, runtime hash and clean/dirty manifests. Test the same resulting identity.
   Do not overwrite shared binaries merely for research.
6. Report all six ledger rows as CC proposed-done only where justified; CDC must
   independently reproduce before closing this correction or lifting Slice04's
   gate. Keep source versus planning commits distinct.

No fresh old/new runtime comparison is possible without another already available
identified binary. Record unavailability; do not install one to manufacture it.
Backward compatibility can have source/argv evidence but must not be labeled a
fresh 2.7.7 runtime test. The original PERM closure remains historical evidence.

## Handoff

Durable artifacts: artifacts/reproduction.md, artifacts/validation.md,
artifacts/build-receipt.md and artifacts/raw-transcript.txt. Retain enough exact
source/config/argv/streams to replay; enumerate any additional raw paths before
writing them. Research/evidence processing remains Lykn; shell/Git/Cargo and
native test/build recording are infrastructure.

After CDC, refresh Arc01/Slice04's compiler/runtime condition and resume its
entire open set. Preserve three failed source-authoring conditions, all R-01–09,
all 36 unsupported Y-13 cells, all 28 gated Y-14 cells and every source/book/guide/
ADT/operator outcome. This correction does not select a YAML document route,
adopt a package, close Arc01/Arc03/project composition or supply human acceptance.
