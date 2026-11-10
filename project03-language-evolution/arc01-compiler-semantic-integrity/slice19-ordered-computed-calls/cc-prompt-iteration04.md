# Remove the pure fixture's incidental source shadowing

S19 refinement 04 of five, same standard Autonomous Mode and
actors. Exact `0b899986cd74a264eedb48149bc08d552e9d9ca8`,
tree `793ef00a12bd7fae5a55c9d64f5591c7c711dcd6`. Native
focus45 and public13/37 pass, with actual old/current F2
byte equality on both backends. Normal Make stops at the one
source shadowing warning in F2. Retain original full raw.

Edit only `test/fixtures/semantic-roles/computed-member-no-prefix.lykn`.
Rename its module-level `receiver` to `pure-receiver`, and
its one call-site reference accordingly. Keep the independent
parameter `receiver`, exact `kernel:get`, bound `get`, input
and expected stdout. This removes real emitted shadowing. No
other fixture, test, compiler, policy or expectation changes.

Use supplied `/private/tmp/lykn-s19-cdc.OPnp9nfQ/correction04-message.txt` and normal exact
one-path commit. Return clean source/body and await static
release. Retain original exact F2 old/current module equality
at its actual source identities. Refresh both current focused
runs and compare final F2 to earlier current F2 to confirm
only the intentional module binding rename in generated code.
Prior executable pins apply only after verifying actual hashes.
Do not claim same bytes for two different source spellings.
Then complete normal full Make and standalone citations.
