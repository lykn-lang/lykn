# S05 author baseline — actual c0ed consumer failures

2026-11-14, root, routine representative checks for the authorized S05 repair,
before product edits. Source worktree is clean atc0ed4546/tree7d8b3359.
Installed bin/lykn and target/release/lykn both hash SHA256
`b732f4c38526b8158fea2e2d7adb606ae6bf80331e78998712a1f9f4b58097ad`,
matching the S04 independent optimized build record. No rebuild was needed.

From `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`,
root invoked `bin/lykn compile` on each retained absolute `.lykn` path here,
with `-o /private/tmp/lykn-arc05-s05-root/baseline/<stem>.mjs`.
All three actual compile commands exited0; generated `.mjs` files are retained
byte-for-byte here. typed-result compile warned of unused result__gensym0 at2:18;
foreign-args warned of unused value at2:19 and3:19; multi-args emitted no warning.
Those compiler streams were observed in the tool transcript, not separately
captured raw; no complete compiler-log preservation is claimed.

Runtime commands used actual Deno `eval --no-config --ext=js` with:

| Stem | Exact eval source | Exit and observed behavior |
| --- | --- | --- |
| typed-result | `await import('file:///private/tmp/lykn-arc05-s05-root/baseline/typed-result.mjs')` |1, SyntaxError: Identifier 'result__gensym0' has already been declared |
| multi-args | `await import('file:///private/tmp/lykn-arc05-s05-root/baseline/multi-args.mjs')` |1, ReferenceError: Cannot access 'args' before initialization, actual const args = args[0] |
| foreign-args | `globalThis.args = 99; await import('file:///private/tmp/lykn-arc05-s05-root/baseline/foreign-args.mjs')` |0, stdout `[ 7 ]` instead of intended99 |

Each runtime's complete separate stdout/stderr files are retained. Numeric
exits above are direct exec-tool results, not inferred from diagnostic text.
These are actual old failures/opposing outputs; SyntaxError/ReferenceError are
not acceptable success oracles for the repaired program. Correct behavior is
typed-result7, multi-args7, foreign-args99, with ordinary overloads/type errors
and strip behavior preserved. Root did not claim a complete producer matrix
from these three checks; the S05 tests cover the other promised paths.
