# Complete the frozen match scope adapter

S12 refinement 02/5. Same Luna 6 High CC, separate Sol 6.1 High
CDC, standard Autonomous Mode. Preserve `e96ab03c`, the prior
two fixture freezes and original raw. No current behavioral gate
has launched. All exact fixtures, oracles and source boundaries
in the original assignment remain. Lykn only for authored
research tooling, native CLI for direct invocation, no Python
execution or substitute Node/handwritten JS, no new dependency.

In the existing resolver Match shadow arm, use the already
established single-slot idiom
`shadow_seq(std::slice::from_ref(guard), scope, out)`. This checks
a guard's own declaring form and restores any hoist before its
body, consistent with independent guard and body regions. Iterate
successful plans directly (for example `clauses.into_iter().flatten()`)
in that lint-only arm. Call `resolve_pattern(clause.pattern_input, ...)`
without the needless extra borrow.

In the existing borrowed parser, retain the original optional
capture mode. Give `parse_match_clause` the existing
`&mut Option<&mut Vec<BindingOccurrence>>` parameter and return the
same parsed syntax without an owned occurrences field. The
ordinary classifier passes its existing capture. The scoped
projection creates an isolated capture per clause and uses it
only on success. This avoids allocating a discarded occurrence
vector on ordinary classification and keeps the classifier's
exact parse order and existing error/diagnostic path.

No test/fixture or further behavior changes. Use the two paths
`crates/lykn-lang/src/resolver.rs` and
`crates/lykn-lang/src/classifier/forms.rs`, exact normal-hook
`/private/tmp/lykn-s04-i2.tBlMBxu9/s12-adapter-source-message.txt`. Freeze and return for
the existing static release. Then execute original grouped
current focused and full gates with prospective recorded named
paths and fixed DENO_DIR. No release/K/I3/I4/second integration.
