# First unchanged walker re-entry — 2026-11-07

After source acceptance a8f2070, CDC extracted the immutable
bd3e4c730a60184e13a2426ffd61318f1c5b9770 Slice17 estree-walker.lykn to owned
`/private/tmp/lykn-s19-walker-reentry-MEgWAk/estree-walker.lykn`.
Extraction exit0; SHA256
6976a853a9fea81bcf47e47d634fa5bcd568e9f3b72e6f36c4f58be2bd48d1c6.
The exact scratch/parent ancestor project.json, deno.json and deno.jsonc checks
found none (12 expected absent paths). No recursive inventory or grant change.

Actual invocation, cwd that scratch:

```text
/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/release/lykn check /private/tmp/lykn-s19-walker-reentry-MEgWAk/estree-walker.lykn
```

Exit0. stdout empty; stderr is the normal success INFO (20 top-level expressions),
not a warning. Complete actual source/stdout/stderr retained beside this record.
Compiler SHA256 before and after:
aa31947fd4bb0ae0024cf82380c8e076bc2b92ba4493fec4feade586058bfaf8.
This is native source-check evidence only; no scanner/observer check or K runtime.
