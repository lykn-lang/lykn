# Keep normalized super on the existing path

S19 refinement 03 of five, same standard Autonomous Mode and
actors. Exact product freeze `d7deb623e8825edcda36967a7a02e8f5626b82bc`,
tree `c1ce899db03b220c1b22cfeb46e7744c230e2b07`. No current
behavioral command ran. Current computed receiver selectors check
raw `super`, but the actual name mappers strip trailing `!`.
A saved emitted `super` is not a normal JS receiver value.

Use existing name mapping in both selectors to leave emitted
`super` on its original route. Keep the existing actual binding,
macro, escape and shape gates. In native remove the redundant
`ComputedMemberCallPlan` adapter and use the shared `OrderedCallPlan`
directly while retaining the reference data. The common argument
planners can run one genuine spread guard for all lifted cases,
including when only the reference lifts. Keep all previous
unlifted values and the exact diagnostic. In the new guide paragraph
use two sentences for the held spread and ordinary unlifted outcome.

Only the same four product paths may change. No fixture, test,
new case, invocation-materializer or public API changes. Format
owned Rust, compare mirrors, use supplied
`/private/tmp/lykn-s19-cdc.OPnp9nfQ/correction03-message.txt` and exact normal commit. Return
clean exact source/body for static release before all original
current gates.
