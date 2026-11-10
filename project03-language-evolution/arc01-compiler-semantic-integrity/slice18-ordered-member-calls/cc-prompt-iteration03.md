# Use the actual ordered member anchor span for checked emission

S18 refinement 03 of five, same standard Autonomous Mode and
actor split. Exact `0acfc33da05b246030bed8b287fd18ba966a7bb6`,
tree `aced4e48b269246c4f017f46f8576f31eb5c9f93`.
Public focus 12 tests/35 steps passes. Native no-run and CLI build
each exit 101 with E0599 at `forms.rs:286`, since SurfaceForm has
no `span()` method. Retain actual raw and no native dependent runs.

Edit only `crates/lykn-lang/src/emitter/forms.rs`. Replace the
private boolean scan at standalone `emit_form` with a private
first marked occurrence span lookup on the actual lowered kernel.
Prefer the actual list anchor span when its first operand is the
brand, and use the existing SExpr span on any stray private atom.
Use that actual span in the same existing Codegen error. Do not
change behavior, diagnostic text, kernel model, or any test/fixture.
No default span if the actual occurrence is available.

Use supplied `/private/tmp/lykn-s18-cdc.FqQ4W4hQ/correction03-message.txt` and normal
exact-path commit with actual body/tree/clean readback. Return for
static release before affected native and full current gates. The
unchanged public focus is still attributable to 0acfc33d. Reuse
already-authored public artifact inputs only after actual exact
unchanged JS/test-source proof. CDC runs both backends on final.
