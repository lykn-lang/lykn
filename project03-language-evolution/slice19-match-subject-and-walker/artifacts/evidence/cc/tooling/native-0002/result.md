# Final correction5 native syntax checks

Frozen source commit: `fd532d0` (`Complete Slice19 tooling correction 5`)
Preflight: `preflight.txt`; it records the full source hashes and clean status before checks.
Compiler: `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/release/lykn` 0.6.0, SHA256 `aa31947fd4bb0ae0024cf82380c8e076bc2b92ba4493fec4feade586058bfaf8`.
Working directory: `/private/tmp/s19-native-cwd`.

Each command was `<absolute compiler> check <absolute frozen source path>`, with stdout and stderr captured separately as raw `.bin` files. Exit statuses returned directly:

- `parser-core.lykn`: 0
- `estree-walker.lykn`: 0
- `scanner.lykn`: 0
- `capability-observer.lykn`: 1; stderr: `error: unterminated list at 136:1`

All four stdout files are empty (SHA256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`). Raw stderr hashes:

- parser core: `2870da127c96ed811f4a903534a0a7489864a2f6d244cba7d1b5f5b47659b008`
- walker: `30d52705d40c7700fa8dd94819b8ec32d520b4f3d1f0babee184bcde456526e0`
- scanner: `cc2d0c98b970e6cbad54b1fdbb5c2911edeb689935d70a34152fb8977164c64d`
- observer: `4a034cfa5b3d6a26b33dd499ca1b4a48018d05a79430453e18a0586968ab784d`

The observer parse failure is the final correction5 native outcome. No source edit or dependent check/runtime followed it. Formatter, lint, compile, Deno, zero-argument guards, and all 13 K rows remain unrun.
