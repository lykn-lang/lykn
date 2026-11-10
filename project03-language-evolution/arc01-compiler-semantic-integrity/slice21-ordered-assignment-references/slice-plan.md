---
project: project03-language-evolution
arc: arc01-compiler-semantic-integrity
slice: slice21-ordered-assignment-references
status: closed
depends-on: [slice20-anonymous-value-names]
---

# S21 — ordered assignment references

Luna 6 High CC with separate Sol 6.1 High CDC in standard Autonomous
Mode. Start exact accepted `125a1f2970a308dd6cd34ab82259623c999fe2d9`
on `codex/completion-value-flow` in the existing task checkout.
[Prior acceptance](../slice20-anonymous-value-names/cdc-verification.md)
preserves private name hygiene. Release stays read-only.

In the admitted direct unprotected Statement/Return/Bind regions,
simple computed writes with a proved ordinary bare lexical base
save the base and evaluated raw key before lifted RHS. The final
ordinary assignment performs its original coercion and write.
Genuine `set-symbol!` and checked explicit kernel `=` share this
path. A resolved bare lexical assignment keeps its actual binding.
A bounded real `+=` with string-literal property saves the old
property value before lifted RHS and does numeric/string conversion
and write only on normal completion. Source return or throw exits
before the relevant later effect. Preserve ordinary no-lift modules,
resolution and protected writes.

The [official property Reference algorithm](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-evaluate-property-access-with-expression-key)
delays key coercion until after RHS for simple assignment. The
existing pinned-Deno isolated Lykn observations distinguish one
post-RHS conversion in simple assignment from the engine's two
key conversions in the object-key compound case. The latter
writes the second coerced key. That is an actual measured host
result, not a general Reference rule. Arbitrary effectful keys
in lifted compound writes and other operators remain held.
[Observed source and outputs](artifacts/evidence/preliminary-reference)
preserve both cases. Array/destructuring targets, optional,
private, super and aliased/protected base paths are excluded.

Do not remove the recognizable original v1 write path to gain
the lowering. Select only genuine computed target roles whose
base is a bare lexical atom and whose normalized root is neither
Reflect nor globalThis. Exclude colon/structured bases and leave
those and local same-spelling controls on the existing policy
route. Add actual compile-only lifted protected rejection and
replay the unchanged v1 suites. No new provenance system or
public AST/API. Apply accepted anonymous-name barrier to any new
private initializer that may receive an anonymous definition.

Freeze the exact source oracles and real registrations first.
Independently review, then obtain old native/public reds, unchanged
plain control, exact v1 rejection, current focus, full normal Make
and standalone citations. The separate CDC replays current full
gates and inspects complete artifacts before acceptance. Ordered
argument iteration and special references remain I3. I4, K and
release propagation stay outside this slice.

Accepted at `b1937050` after
[independent current replay](cdc-verification.md).
[Close](closing-report.md) preserves exact scope and follow-up.
