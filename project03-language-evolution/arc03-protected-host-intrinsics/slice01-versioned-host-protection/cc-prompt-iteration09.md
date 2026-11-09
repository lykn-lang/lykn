# Complete the native object pattern adapter

Continue Arc03 S01 from clean `dd0360cb96c6ec042947ae7a28cb55b0bf7d7506`.
The Operator's standard Autonomous Mode instruction still applies.
Record this local follow-through as source pass 07, with the normal
five spent and two actual passes beyond them. Same Luna6 High CC and
separate Sol6.1 High CDC. No new slice or reset.

Read the [iteration08 assignment](cc-prompt-iteration08.md) and actual
`codegen/emit.rs` object-pattern spread arm. The candidate skips
`(spread Reflect)` when collecting binding names. In that native
pattern slot the writer emits `...Reflect`. Collect the atom operand
as the rest binding, without collecting arbitrary expression operands
or confusing a spread in an object **value** with a declaration. Check
the new private native function test with an object spread member
`(function f ((object (spread Reflect))) (++ Reflect))` as another
compile-only legal case. Keep the existing alias-key negative.

Combine the identical declaration-name branches for `function` and
`function*` using the existing match/predicate style. No behavior
change there. Only `crates/lykn-lang/src/protected_host.rs` may change.
The corrected JS test and all original oracles stay immutable. Use
[the supplied commit body](artifacts/commit-messages/continuation07-v1.txt).
Freeze exact Git, read back and return for bounded static review.
All original prospective format/build/test and independent gates then
continue. No pre-policy replay, emitted protected-write execution,
release mutation or later slice.
