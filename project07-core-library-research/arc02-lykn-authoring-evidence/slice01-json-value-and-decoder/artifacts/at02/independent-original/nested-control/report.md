# Independent balanced nested-constructor control

This is a separate L-03 characterization, authorized after unchanged original AT-02 reproduction. It does not modify or repair the original task. Source root/branch/pin: /Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering, codex/completion-value-flow, 685bbe1dbbfdaf34ecf49017c22e43f7dc8adb95. CLI and Deno identities remain the Stage1 pins. No canonical write or Git mutation occurred.

Source: nested.lykn, SHA-256 2fc3df55b4034c966295f5f02dcf922938ebf9694c5ab8cc46c84c4d495cd3a6. Explicit Option and InnerValue declarations eliminate dependence on implicit constructor definitions. The balanced source constructs Some(InnerNumber(7)), matches ((Some (InnerNumber value)) value), and prints the selected field. Expected output 7 was declared before compilation in source and launches.txt. Exact commands/common environment, cwd and permissions are in launches.txt; each cell retains raw stdout/stderr/exits. inputs-output.sha256 preserves source and emitted hashes. Generated JS is unmodified.

| Cell | Exit | Observation |
| --- | --- | --- |
| native compile | 0 | Two unused type-name warnings (Option, InnerValue); emitted JS omits nested tag test and binding |
| native run | 1 | ReferenceError: value is not defined at target/native.js:18 |
| public driver compile | 0 | No diagnostics |
| public compile | 0 | Emitted JS uses t__gensym1 in branch condition before declaration inside branch |
| public run | 1 | ReferenceError: t__gensym1 is not defined at public/target/public.js:23 |

AT02-N01: correctness-grade implementation defect, native path. nested.lykn:15 is a nested constructor pattern; target/native.js:15-18 tests only outer Some and returns unbound value. The known valid input fails rather than yielding 7. This contradicts the assigned captured book references/3-match.md, Nested Patterns section (the compiler generates nested checks and bound fields), and guide00:540-543 binding scope. Exact raw error: run-native/stderr.raw. No malformed source, undeclared constructor, absence of match arm, or unsupported host object explains this failure.

AT02-N02: correctness-grade implementation defect, public path. Same source/input, public/target/public.js:23 tests t__gensym1.tag before public/target/public.js:24 binds it. Known valid input fails before returning selected value. Same source contract. Exact raw error: run-public/stderr.raw. This is a distinct emitted failure mode from native; do not collapse it to the initial unbalanced-source failure.

Observed positive nested-input results: 0/2 compiler/runtime conditions. Both compile paths accepted source, both runtime paths raised unexpected exceptions. This is not an expected decode Result and neither path passes the nested-match control. No negative nested input or stripped cell is claimed by this bounded follow-up. Original Stage1 emitted unbound identifiers are now supported by a balanced, isolated executed witness.
