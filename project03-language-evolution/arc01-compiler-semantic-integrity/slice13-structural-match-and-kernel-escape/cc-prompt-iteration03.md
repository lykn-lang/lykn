# Correct the native object-property pattern

S13 refinement 03/5. Same Luna 6 High CC and independent Sol
6.1 High CDC, standard Autonomous Mode. Keep exact clean
`afdb7d77` and its first grouped build. The latter exited 101
with E0308 at emitter/forms.rs line 679, before any native
test executable ran. A separate public focused run may finish
on this unchanged source and keeps its own identity and raw.

In `crates/lykn-lang/src/emitter/forms.rs` only, change the
left pattern in `emit_kernel_object_property` to
`let SExpr::List { values, span } = property else {`.
The input is `&SExpr`. Match it directly, retaining the same
else branch, role choice, spans, executable slots and context.
No test, fixture, JS, diagnostic or other source changes.

Read the prepared commit body
`/private/tmp/lykn-s04-i2.tBlMBxu9/s13-rust-pattern-message.txt`
and use it with the normal exact-path commit. Retain raw Git
body and scoped diff. Await static release on the corrected
clean source, then resume the original focused and full gates
with prospective receipts and current executable pins. Preserve
the old baseline, initial source build failure, and any public
run on `afdb7d77`. No original oracle or denominator changes.
