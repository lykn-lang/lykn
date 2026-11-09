# S04 iteration 08 — finish native occurrence compile readiness

Same Luna 6 High CC and Sol 6.1 High CDC, standard Autonomous Mode.
Preserve first production `e0a216433552b918826f99a4153663d90822fa8c`,
static-only. Source refinement 06, explicitly beyond the normal five.
The Operator's standing direction is to fix clear local issues. No
budget reset or new semantic decision.

Only `crates/lykn-lang/src/classifier/forms.rs` and `binding.rs`:

1. The two borrowed clause bodies call `.collect()` before an
   `.is_empty()` method test. Declare their result `Vec<SExpr>`.
2. The old `classify_pattern` wrapper now has only test callers. Mark
   that wrapper `#[cfg(test)]`; keep the real captured parser unchanged.
3. Let the borrowed keyword helper elide its single-input lifetime,
   preserving its exact map and loop. The private classification capture
   entry returns `Result<Vec<BindingOccurrence<'_>>, Diagnostic>` with
   the completed borrowed sites only. Keep the success check and discard
   the classified owned AST locally. Its sole binding walker caller
   consumes that Result directly. Preserve public classifier signatures.

Use the fixed message
`/private/tmp/lykn-d736-release-cdc.Gdv7dxje/c14-compile-ready-message.txt`.
Normal hooks/exact paths, format and commit. Return exact clean
successor for static release before actual focused build/verification.
All original test source/oracles, role semantics, publication boundary
and full independent gate requirements stand.
