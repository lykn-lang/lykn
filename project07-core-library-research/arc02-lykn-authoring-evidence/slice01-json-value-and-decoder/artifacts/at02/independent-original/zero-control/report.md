# Independent zero-field declaration syntax control

Separate L-03 control, with expected output frozen in zero.lykn:2 before compilation. This source defines `(ListZero)` and bare `BareZero` in the same type and prints both typeof/value pairs via JSON:stringify, so a constructor function cannot silently disappear from an object property. `js:typeof` is deliberate compiler-characterization logic, not a JSON validation rule. Neither source nor generated output was repaired.

Pin: source /Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering, branch codex/completion-value-flow, commit 685bbe1dbbfdaf34ecf49017c22e43f7dc8adb95. Same pinned CLI/Deno as Stage1. Public config/lock/driver copied unchanged and packages/lang copied unchanged from the independent exact-pin export. Exact argv/common environment/cwd are in launches.txt. Every run cell retains exit-status.txt, stdout.raw, stderr.raw. Source and emitted digests are in inputs-output.sha256.

Expected both paths: ["object",{"tag":"ListZero"},"object",{"tag":"BareZero"}]

| Cell | Exit | Observation |
| --- | --- | --- |
| native compile | 0 | Unused binding ZeroForms warning; target/native.js:1-2 emits two constants |
| native runtime | 0 | Exactly the expected serialized array |
| public driver compile | 0 | No diagnostics |
| public compile | 0 | public/target/public.js:1-5 emits ListZero as function, :6-8 emits BareZero constant |
| public runtime | 0 | ["function",null,"object",{"tag":"BareZero"}] |

AT02-Z01: correctness-grade public implementation discrepancy. At the source pin, guide00 lines497-516 explicitly displays `(Point)` in a type and says zero-field constructors become constants, not functions. The frozen captured book type chapter's Multi-Field Constructors and What You're Looking At sections likewise show `(Point)` becoming a constant. Native honors both declaration spellings. Public emits a callable function for parenthesized ListZero, and the value itself serializes to null in the array. This is not equivalent to the documented tagged constant and can change matching/serialization behavior. Primary AE01 category: implementation defect; it is not an author violation of a documented requirement to use bare syntax. The bare spelling is an observed workaround, not evidence that list syntax was invalid.

Across the two compiler paths, 1/2 conditions produced both expected tagged constants; bare declaration produced its expected constant in 2/2, parenthesized declaration in 1/2. Both public compile and runtime returned success, so exit code alone would miss the wrong value. No stripped cell or broader constructor claim is made. No canonical planning/source files, Git state, compiler code or original task artifacts changed.
