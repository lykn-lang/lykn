# Slice06 CC handoff — Deno launch compatibility

2026-09-13. **All six LC criteria are CC proposed-done; independent CDC is
pending and ledger statuses remain open.** Slice04's execution gate is not
lifted by this attestation.

Source commit: `4dded883bbd321d19635e6fce233343f33803f9e`, release/0.6.x.
Planning started at `45b0b45`; this handoff's exact planning commit is returned
after its scoped commit. No source propagation, push or installed CLI replacement.

The fix passes the intended script directly to deno run, protecting only
leading-hyphen local entries with `./`. It preserves stdin, existing specifier
pass-through, path spelling, requested permissions, optional caller separators
and script arguments. The 16-test suite covers actual denial/scoped/all-grants
behavior, all four run routes, symlink import bases and overlays. Full
`make check` and `make check-cited-paths` pass. The selected isolated release
binary passed the same 16 tests without its recorded hash changing.

## Six-row walk

| Row | CC disposition | Evidence |
| --- | --- | --- |
| LC-01 | proposed-done | [LC-R01](artifacts/reproduction.md): current source/runtime identities, four original test failures, fresh minimal failure, source/emitted bytes and actual NUL argv |
| LC-02 | proposed-done | [LC-V01](artifacts/validation.md): real and argv coverage of four routes, spaces/hyphen names, optional separators, literal arguments, stdin/file URLs and unchanged remote specifier spelling |
| LC-03 | proposed-done | [LC-V01](artifacts/validation.md): NotCapable read/write controls, scoped outside-path rejection, explicit denies/all-grants, repeated/empty scopes, effective overlay, frozen/cache argv and actual exit 23 |
| LC-04 | proposed-done | [LC-V01](artifacts/validation.md): 16 focused tests; canonical gates with 1,507 Rust, 1,465 suite and 482 doc tests; separate cited-path gate |
| LC-05 | proposed-done | [LC-B01](artifacts/build-receipt.md): exact source/tree, isolated locked build, runtime/compiler hashes, explicit Cargo test binary transition and final same-binary regressions |
| LC-06 | proposed-done | Exact-path commits, four artifacts, retained failed conditions and replay, ancestor body/history updates and full gated Slice04 re-entry below |

## Artifact inventory and scope

Four durable artifacts: `artifacts/reproduction.md`, `artifacts/validation.md`,
`artifacts/build-receipt.md`, `artifacts/raw-transcript.txt`. The raw packet
preserves test/source snapshots, exact streams, argv, original failures, build
receipts and native Lykn audit/packing source. It contains no executable binary
or dependency cache. Counts and tested extraction are in LC-V01.

Exact source commit paths:

```text
crates/lykn-cli/src/main.rs
crates/lykn-cli/tests/run_permissions.rs
docs/guides/15-lykn-cli.md
docs/guides/12-deno/12-01-runtime-basics.md
```

Exact planning commit paths, relative to the planning root:

```text
backlog/discoveries.md
project07-core-library-research/project-plan.md
project07-core-library-research/ledger.md
project07-core-library-research/arc03-findings-and-integration/arc-plan.md
project07-core-library-research/arc03-findings-and-integration/ledger.md
project07-core-library-research/arc03-findings-and-integration/slice06-deno-launch-compatibility/slice-plan.md
project07-core-library-research/arc03-findings-and-integration/slice06-deno-launch-compatibility/ledger.md
project07-core-library-research/arc03-findings-and-integration/slice06-deno-launch-compatibility/cc-prompt.md
project07-core-library-research/arc03-findings-and-integration/slice06-deno-launch-compatibility/closing-report.md
project07-core-library-research/arc03-findings-and-integration/slice06-deno-launch-compatibility/artifacts/reproduction.md
project07-core-library-research/arc03-findings-and-integration/slice06-deno-launch-compatibility/artifacts/validation.md
project07-core-library-research/arc03-findings-and-integration/slice06-deno-launch-compatibility/artifacts/build-receipt.md
project07-core-library-research/arc03-findings-and-integration/slice06-deno-launch-compatibility/artifacts/raw-transcript.txt
project07-core-library-research/arc01-format-runtime-evidence/arc-plan.md
project07-core-library-research/arc01-format-runtime-evidence/ledger.md
project07-core-library-research/arc01-format-runtime-evidence/slice04-dependency-and-runtime-boundary/slice-plan.md
project07-core-library-research/arc01-format-runtime-evidence/slice04-dependency-and-runtime-boundary/cc-prompt.md
```

## Bubble-up to the arc

The assigned launcher compatibility correction is delivered at attested
strength. It does not independently close A3-06 or the source correction.
CDC is the next action. After verification, resume the existing Slice04 prompt
with a freshly reconciled compiler/runtime condition and complete preparation.

Implementation confirmed why path canonicalization would be wrong for this
boundary: Deno retains the symlink entry location for relative imports. Tests
also exposed a runtime diagnostic wording change and a Cargo test binary
identity change, both preserved and reconciled. These observations fit the
existing slice; no new prerequisite or scope expansion was required. Arc and
project bodies/history now record the delivered correction and pending CDC.

Silent-drop walk: all six correction criteria survive. Source changes are
limited to the four named files. Actual native permission tests remain distinct
from fake argv checks; stdin and file URLs ran, while remote/package specifiers
have source/argv preservation only. No unavailable 2.7.7 run or Windows run is
claimed. Historical PERM closure is unchanged. Test-runner permissions,
guide/book/language findings and integration retain their Arc03 owners.

Slice04 retains all eight open DB criteria, all R-01–09, its three charged
authoring failures, complete harness/preflight obligations, all 36 unsupported
Y-13 cells and all 28 gated Y-14 cases. A launcher fix establishes no compatible
document route or package adoption. Source/compiler/formatter/tooling,
guide/book evaluation, recursive ADTs, patch identity and operator code-shape
acceptance retain their existing owners. No arc/project/human closure follows.
