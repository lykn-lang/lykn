# Corrected executable receipt — RP-B01

Date: 2026-09-12 UTC. Strength: CC attested; CDC reproduction pending.
This is a new build condition. Arc01/Slice01 B01 remains historical.

## Source and executable identity

| Field | Recorded value |
| --- | --- |
| Worktree / branch | `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x` / `release/0.6.x` |
| Source commit | `d0bb981dae2a4abf6c984406c4b2081a45cc92f8` |
| Source tree | `1c91b11c6ebfc7305ca4bc3fca4a5148eb2fdaf5` |
| Parent commit | `2a0cabf80fcc881c47995421b579244b3b7fb19c` |
| Parent tree | `2441360df1496e002239037ce6ef2ccd3ab50c16` |
| Executable | `bin/lykn`, identical to `target/release/lykn` in that worktree |
| Version text | `lykn 0.6.0-dev` |
| SHA-256 | `5efc8299cc005e977c4d33304f3c9f7062bc4eeb0038c93136a95dccdbaceb86` |
| Byte length | 2947264 |
| Post-commit observation | 2026-09-12T22:35:08.397145+00:00; tracked/untracked status clean |
| Cargo.lock SHA-256 | `bbec9052ee3a3401d716c3b4f2d227107e7e0a8c6f8c846c27fd902e0f39ca92` |

The source commit contains exactly the four paths below. Before staging,
`git status --porcelain=v1 --untracked-files=all` reported three modified files
and one new integration test, with no unrelated source work. The successful
`make check` built these bytes; all four file hashes were then matched against
`git show SOURCE_COMMIT:PATH`. No source edits occurred between that gate and
the commit. The committed locked build retained the same executable hash.

| Dirty build input path | State before staging | SHA-256 of verified and committed bytes |
| --- | --- | --- |
| `crates/lykn-cli/src/main.rs` | modified | `fce290a3e7477dc63026ae526f92996530f002c5bd50ddc5b71f07777ecc59c3` |
| `crates/lykn-cli/tests/run_permissions.rs` | untracked | `c0cbf94a576ff2e2cd480d436fed80898fe133e6eb62468f70be4c378426c3f0` |
| `docs/guides/15-lykn-cli.md` | modified | `d255ba98f7a895579bb3e7c14f964cf49e5925b3ce83216d8c9617d6872f5eb7` |
| `docs/guides/12-deno/12-01-runtime-basics.md` | modified | `619208843e8a131b690c6d0479dbf2e25f81825488355fee6d94166b08e197b2` |

## Commands and build settings

All build commands ran from the source worktree above:

```sh
make help
make check
# After the scoped source commit, with clean tracked/untracked status:
cargo build --release --locked
make check-cited-paths
git rev-parse HEAD HEAD^{tree}
git status --porcelain=v1 --untracked-files=all
shasum -a 256 Cargo.lock bin/lykn target/release/lykn
./bin/lykn --version
./bin/lykn run --help
```

`make check` used `make build-release`, hence `cargo build --release` with
workspace default features, native `aarch64-apple-darwin` target and Cargo's
release profile. No dependency or lockfile changes. The subsequent locked build
used Cargo's existing artifact cache; this is a source-to-byte attestation,
not an independent clean-room or cross-machine reproducibility claim.

No `.cargo/config` or `.cargo/config.toml` was found in the source/ancestor
lookup chain or the user's Cargo home. These environment overrides were unset:
`RUSTFLAGS`, `CARGO_ENCODED_RUSTFLAGS`, `CARGO_BUILD_TARGET`, `CARGO_TARGET_DIR`, `RUSTC_WRAPPER`, `CARGO_PROFILE_RELEASE_OPT_LEVEL`, `CARGO_PROFILE_RELEASE_LTO`.

```text
rustc 1.97.0 (2d8144b78 2026-07-07)
binary: rustc
commit-hash: 2d8144b7880597b6e6d3dfd63a9a9efae3f533d3
commit-date: 2026-07-07
host: aarch64-apple-darwin
release: 1.97.0
LLVM version: 22.1.6
cargo 1.97.0 (c980f4866 2026-06-30)
    Finished `release` profile [optimized] target(s) in 0.02s
```

## Runtime identity

Selected Deno: `/opt/homebrew/bin/deno` (Homebrew 2.7.7 executable).
SHA-256: `103ea70463213b1a8ea7b46852a34612f4e0afcc1ff09d1656d185ed215772d4`.

```text
deno 2.7.7 (stable, release, aarch64-apple-darwin)
v8 14.6.202.9-rusty
typescript 5.9.2
```

Integration tests launch the Cargo-built debug executable using
`CARGO_BIN_EXE_lykn`. The actual receipt executable additionally passed six
read/write controls, including absolute scopes containing spaces; see
[validation.md](validation.md). Runtime selection uses subprocess PATH;
subsequent research must pin/check this Deno identity and the receipt hash.
Do not substitute the older PATH-installed Lykn by version text alone.

## Fresh help from the receipt executable

```text
Run a .lykn or .js file

Usage: lykn run [OPTIONS] <FILE> [ARGS]...

Arguments:
  <FILE>...  File to run, followed by script arguments (optional -- separator)

Options:
      --allow-read[=<LIST>]    Allow read access; optionally scope with =LIST (repeatable)
      --allow-write[=<LIST>]   Allow write access; optionally scope with =LIST (repeatable)
      --allow-net[=<LIST>]     Allow net access; optionally scope with =LIST (repeatable)
      --allow-env[=<LIST>]     Allow env access; optionally scope with =LIST (repeatable)
      --allow-run[=<LIST>]     Allow run access; optionally scope with =LIST (repeatable)
      --allow-sys[=<LIST>]     Allow sys access; optionally scope with =LIST (repeatable)
      --allow-ffi[=<LIST>]     Allow ffi access; optionally scope with =LIST (repeatable)
      --allow-import[=<LIST>]  Allow import access; optionally scope with =LIST (repeatable)
      --deny-read[=<LIST>]     Deny read access; optionally scope with =LIST (repeatable)
      --deny-write[=<LIST>]    Deny write access; optionally scope with =LIST (repeatable)
      --deny-net[=<LIST>]      Deny net access; optionally scope with =LIST (repeatable)
      --deny-env[=<LIST>]      Deny env access; optionally scope with =LIST (repeatable)
      --deny-run[=<LIST>]      Deny run access; optionally scope with =LIST (repeatable)
      --deny-sys[=<LIST>]      Deny sys access; optionally scope with =LIST (repeatable)
      --deny-ffi[=<LIST>]      Deny ffi access; optionally scope with =LIST (repeatable)
      --deny-import[=<LIST>]   Deny import access; optionally scope with =LIST (repeatable)
  -A, --allow-all              Explicitly grant all Deno permissions
      --no-prompt              Fail instead of prompting for missing permissions
      --cached-only            Require remote dependencies to be cached
      --frozen[=<FROZEN>]      Fail if the lockfile is out of date [possible values: true, false]
  -h, --help                   Print help
```

CDC must inspect/reproduce this receipt and the scoped source commit before
lifting the JSON gate. A source commit or CC smoke run is not independent closure.
