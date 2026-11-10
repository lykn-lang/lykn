# Preserve the native spread marker before argument lifting

S17 refinement 03 of five. Same Luna 6 High CC and separate
Sol 6.1 High CDC, standard Autonomous Mode. The [original
assignment](cc-prompt.md), [frozen cases](artifacts/fixtures.md)
and earlier exact [eligibility correction](cc-prompt-iteration02.md)
remain in force.

Current focused base `41e2969a288c660b751c7c0ee65373d4fb6b353f`,
tree `b19cf997649600b3a5602e9c02d8f414198fd172`. Keep its
actual focused results. Before current normal Make, correct only
`crates/lykn-lang/src/emitter/forms.rs`.

The native writer's actual `emit_spread` emits the first operand
even when a raw kernel form has excess operands. The ordered
call planner's exact two-value predicate can miss a genuine
normalized native spread and move it into a const initializer
when a later argument has a prefix. Inspect the first resolved
form head without a cardinality test in the native predicate.
Keep no-prefix native output and the existing checked mixed
diagnostic. The JS compiler already independently rejects
malformed spread arity. Leave its predicate unchanged. Use
coercion in the existing direct-tail `filter` call, passing
`head` instead of `*head` to avoid explicit auto-deref. Apply only
owned mechanical formatting if needed.

Use the supplied `/private/tmp/lykn-s17-cdc.lAFdsMI8/correction03-message.txt` and normal
exact-path `git commit --only -F`. Same scope, exact source freeze
and separate static release. Full normal Make covers the whole
current source. Refresh the affected focused native proof with
actual current pins. Existing public focused receipts retain
their original identity and exact unchanged JS source. CDC
independently reproduces both backends on final source.
