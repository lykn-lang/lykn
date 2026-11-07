# Correction06 native syntax checks

Frozen source commit: `442eccd03e06ca8baf859f55e7810ff89d4188b3`; preflight commit: `5f08fc8` (updated here with exact Deno executable path/version fields before Deno use).
Compiler: `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/release/lykn` 0.6.0, SHA256 `aa31947fd4bb0ae0024cf82380c8e076bc2b92ba4493fec4feade586058bfaf8`.
Working directory: `/private/tmp/s19-native-cwd`.

Each command was `<absolute compiler> check <absolute frozen source path>`, with stdout and stderr captured separately in raw `.bin` files. Each command returned exit status 0:

- `parser-core.lykn`
- `estree-walker.lykn`
- `scanner.lykn`
- `capability-observer.lykn`

All stdout files are empty (SHA256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`). Stderr SHA256 values:

- parser core: `2870da127c96ed811f4a903534a0a7489864a2f6d244cba4a0?` 
