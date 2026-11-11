# S02 dependency correction: sequence-expression grouping

Continue the issued S02 assignment, same Luna 6 High CC and separate Sol 6.1
High CDC in Autonomous Mode. Source/build ownership remains CC. No Python
execution is permitted; no Python/Ruby/Fennel/handwritten JS research helpers,
including temporary helpers. New probes/drivers use Lykn. Existing product
compiler Rust/JS and normal product tests remain in scope. No merge/push,
publication, new dependencies or qualified-ADT implementation is authorized.

The first focused semantic-role runtime run exposed malformed native nested
`seq` output. The temporary tautology workaround also failed because assignment
grouping is absent. Preserve those observations and the rejected two-filter
Cargo invocation in the closing record; do not retain the workaround in source.
Root's recipe assumed supported sequence expressions were compositional without
first verifying native grouping. This is a preparation gap at the codegen boundary.

Restore the straightforward `(seq (= cached parent:field) true)` capture.
Repair native `crates/lykn-lang/src/codegen/emit.rs::emit_seq` so a sequence
expression remains one expression in every consuming grammar context. The
dispatcher currently discards parent precedence for seq; `emit_call_args` and
some initializers also pass precedence zero. Merely threading parent precedence
into seq is therefore insufficient for argument/initializer grammar boundaries.
A small safe repair is to emit all sequence expressions parenthesized, including
the top-level case. Alternatively fix the complete relevant context/precedence
contract, but do not undertake an unrelated writer redesign. Update the existing
top-level seq test if choosing consistent grouping. No separate assignment
lowering change is necessary for the restored capture, whose assignment is an
operand of a grouped comma expression.

Add meaningful product codegen/runtime coverage: sequence as an `&&` operand
must short-circuit and perform the read/assignment once; as one call argument it
must not change arity; as an initializer it must not become a second declarator.
Existing product harness and Lykn kernel escape fixtures are appropriate. This
is compiler-owned output behavior, not license to author a JS research helper.
Run a focused check immediately, then resume original NPAT/ZVAR, route, hygiene
and effect regressions and the full S02 gates. Keep all five PC rows; PC-03/04
now explicitly consume this bounded dependency correction and its tests.
