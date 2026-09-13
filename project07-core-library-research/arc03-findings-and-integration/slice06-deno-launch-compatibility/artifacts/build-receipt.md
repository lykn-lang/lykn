# LC-B01 — Corrected source and executable

2026-09-13, CC attestation; independent CDC pending.

| Identity | Recorded value |
| --- | --- |
| Source branch | release/0.6.x; no propagation or push |
| Parent commit | 50608c443c452107b138cc30deda4a09ab5c7642 |
| Correction commit | 4dded883bbd321d19635e6fce233343f33803f9e |
| Source tree | 218b085176053f1273642496cf75d7691c399f6e |
| Source status | clean before edits and after scoped commit |
| Isolated source | /private/tmp/lykn-p07-launch.6O8dPq/source |
| Binary | /private/tmp/lykn-p07-launch.6O8dPq/source/target/release/lykn |
| Selected binary SHA-256 | d4a7028ebba234ffcd6fdb544c256489d22b840da2e94e0aa833b0520c834326 |
| Build | cargo build --release --locked; default features, native target |
| Cargo | 1.97.0 (c980f4866 2026-06-30) |
| rustc | 1.97.0 (2d8144b7880597b6e6d3dfd63a9a9efae3f533d3); LLVM 22.1.6 |
| Host | aarch64-apple-darwin; macOS 15.7.9 (24G830) |
| Build overrides | RUSTFLAGS, CARGO_ENCODED_RUSTFLAGS, CARGO_BUILD_TARGET unset |
| Runtime | /opt/homebrew/bin/deno, 2.9.6; V8 15.0.245.2-rusty; TypeScript 6.0.3 |
| Runtime SHA-256 | 2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74 |

The export came from `git archive` of the correction commit, with a fresh
target directory. The source worktree was not reset. Normal make checks refresh
its ignored bin/build outputs; no shared installed CLI was replaced. The isolated
export is not a Git checkout; its committed source identity comes from the
archive receipt. Build products are generated separately from those source bytes.

## Binary transition during verification

The first locked release build produced the selected `d4a7028…` hash. Running
`cargo test --release --locked -p lykn-cli --test run_permissions` rebuilt the
CLI and produced `a871df4a5c2de812c023b4c123acffc7b15511769a8f13a9cbe4238b43ac79c6`;
all 16 tests passed. That is a distinct build identity, not assumed equivalent
bytes. Running the locked release build again restored `d4a7028…`.

The already-built integration harness was then executed directly:
`target/release/deps/run_permissions-090766e538b8548a`. Its compiled-in CLI path
points to this isolated `target/release/lykn`. All 16 tests passed against the
selected binary; hashes before and after matched. The eight fresh captures and
Lykn evidence audit subsequently used the same selected binary. Both build
conditions and all logs remain in the raw packet.

For a fresh rebuild, use the test-harness filename printed by Cargo rather than
assuming this host's suffix. If Cargo testing changes the CLI hash, rebuild the
selected release condition and rerun that already-built harness, recording
hashes on both sides. A newly built binary must be measured, not assigned this
receipt's hash by assumption.

Only Deno 2.9.6 was available. No fresh 2.7.7 comparison, downgrade, installation,
Windows run or cross-release propagation is claimed. Existing stdin/specifier
and path handling is preserved by source/argv evidence and the tested native
boundaries; remote/package execution was outside this correction's regressions.
