# Require the compiled provider before running its importing entry

S18 source refinement 01 of five, same standard Autonomous Mode
and actor split. Exact test-only freeze `a452db44fc8e93bb55e3ae7c223fe43c0856eb4b`,
tree `28cc22b0c49c71aa74f4dea39977cd76917ae380`. No behavioral
command ran. The native live entry depends on the independently
compiled provider and currently checks only its own artifact.

In `crates/lykn-cli/tests/semantic_roles.rs` reuse the actual
successful provider compile and present-file condition for both
native runtimes. The live entry additionally needs its own
successful compile and present-file result. Keep the recorded
skip reason precise. No fixture, JavaScript, runtime expected
output, diagnostic or independent case changes. Format the owned
file and freeze exact one-path commit using the supplied
`/private/tmp/lykn-s18-cdc.FqQ4W4hQ/correction01-message.txt`.
Return exact clean source for baseline release. The [initial
prompt](cc-prompt.md) and every original gate still apply.
