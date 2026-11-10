# Retain the actual public computed spread compile result

S19 refinement 01 of five, same standard Autonomous Mode and
actors. Exact test freeze `da1f0a386beec87464f275e71fb0c1ad02bdca20`,
tree `bfa5254f4483f611ee70aca43b6003de8fe03a09`. No behavioral
command ran. The new public F3 `assertThrows` loses old successful
compiler output, which is a required baseline artifact.

Edit only the new computed F3 case in
`test/forms/semantic-roles.test.js`. Use the existing S18
member spread receipt pattern for the actual returned output
or thrown Error. Retain exact source, output and error message
using unique computed receipt names and preassert log. Check
the actual Error with the same exact message and absent output.
Never execute the output. Preserve all fixtures, cases and
other source paths. Use supplied
`/private/tmp/lykn-s19-cdc.OPnp9nfQ/correction01-message.txt` with normal exact path-only
commit and actual body readback. Return clean immutable freeze
for separate static release before original old gates.
