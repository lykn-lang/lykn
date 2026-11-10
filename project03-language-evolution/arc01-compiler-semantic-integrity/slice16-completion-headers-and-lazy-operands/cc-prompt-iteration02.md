# Apply the value-prefix plan to consumed public if tests

S16 refinement 02 of five. Same Luna 6 High CC and separate
Sol 6.1 High CDC in standard Autonomous Mode. Read the
[initial assignment](cc-prompt.md) and unchanged H1 in
[exact fixtures](artifacts/fixtures.md).

Exact clean base `71f52728b0030b0a0f848aa3e785b0a4ce356cc3`,
tree `5e6270c244f02fc9c5deb30af3368cedfc5af12c`. Its
current gates were held before any execution. The public
discarded-if route uses `expandDirectValuePlan`. The consumed
branch inside `expandResultOperand` still does
`expandSingle(..., "Value", "if condition")`. That keeps
H1's second return in the old synthetic wrapper.

Change only `packages/lang/expander.js` and its exact embedded
mirror. In `expandResultOperand` for a well-formed consumed
if, get the condition's `{ prefix, value: condition }` from
the existing `expandDirectValuePlan(form.values[1], env)`.
Preserve the current branch expansion under the same result
use and environment. The existing pure-value ternary path
requires both value arms and empty condition prefix. For the
other path use the existing branch conversion, and place the
actual prefix before the existing statement conditional in
the same `directBlock([...prefix, conditional])`. Keep the
no-else diagnostic branch before this, exact scoped children
and single expansion of the condition. Native, match and
logical code, all fixtures and assertions stay byte unchanged.

Use prepared `/private/tmp/lykn-s16-cdc.B22ECt81/correction02-message.txt` and
normal exact-path `git commit --only -F`. Read back the
actual body, exact mirror, full diff and clean tree. Return
the immutable correction for separate static release. The
original current focused, full normal and cited gates follow
only after release. Prepare actual prelaunch evidence and
fresh roots while authoring. No product or evidence from the
unexecuted first freeze is claimed.

## Consolidated native lexical barrier before dispatch

This addendum replaces the native byte-unchanged sentence above
only for the exact first-operand block in `emit_direct_logical`
in `crates/lykn-lang/src/emitter/forms.rs`. Current code extends
the surrounding logical region with a raw first statement plan.
Keep the private result `let` outside, and put the first actual
statement plan in its own lexical block, as already required for
header prefixes and done in public logical lowering. Reuse a single
existing block as-is. A first ordinary Value remains one assignment,
and all-value expression lowering and later branches stay unchanged.
A tiny shared native block adapter may reuse the existing header
wrapper. Preserve all other native code.

Exact correction paths are forms.rs and the two expander copies.
Use the updated prepared `/private/tmp/lykn-s16-cdc.B22ECt81/correction02-message.txt`
only after reading its body. Same correction 02, original
finite proof, no fixture change or further scope.
