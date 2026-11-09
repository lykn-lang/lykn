# S04 iteration 03 — explicit kernel function validation adapter

Continue the original I1 implementation from exact clean test-only
`1118b8fd85f41e78b424d2ffb02f7d5acbba281d`, same Luna 6 High CC and
Sol 6.1 High CDC, standard Autonomous Mode. Read
[iteration 01](cc-prompt-iteration01.md), [iteration 02](cc-prompt-iteration02.md)
and the [reconciled baseline](artifacts/i1-baseline-disposition.md).
Refinement 02 of the normal five adds one known source adapter to I1.
The old baseline is complete. No fixture, oracle or runtime flags change.

Native no-else validation runs on resolved raw source before strict
classification removes `kernel:` from the genuine explicit wrapper.
In `crates/lykn-lang/src/classifier/forms.rs`
`walk_no_else_if_expression`, include `"kernel:function"` in the existing
`"function"` arm that passes the current position through to its arguments.
Keep `as_form_head` gating and every other role, including the
`"return"` arm's required Value operand. A genuine module-level named
kernel function then walks its body in Statement as the equivalent bare
form already does. Do not generalize explicit-kernel stripping or
alter other function forms. The exact I1 native literal fixture exercises
both check and strict compile on this adapter. The existing four consumed
no-else rejection conditions remain binding. No separate new test case.

This one file is added to the existing source allowlist. Use the original
fixed I1 source message, exact named paths and normal Git/hooks. Complete
the original I1 conditional scope, branch grouping, printers, tests and
bounded Guide 00 work. Preserve the complete actual first and literal raw
attempts. Freeze current product bytes for CDC's static review before
dependent validation, then the original independent focused, normal Make,
cited-path and artifact obligations. NE-C14, other stages, release and K
remain outside this handoff.
