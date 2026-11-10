# Preserve strict exhaustiveness in the progression witness

Same Luna 6 High CC and Sol 6.1 High CDC, standard Autonomous Mode.
S09 source refinement 02. Preserve the original test-only
`13e7a4bf3688891a6b39924db5cb314c9a7f2990` and actual old receipts.
Native 11/15 passed, with F1 rejected by strict analysis and F2/F4/F5
reaching their expected old bad runtime results. Public 10/14 steps
passed, with F2/F3/F4/F5 old failures. F6 passed on both.

The original F1 had only guarded candidates. Its native check exited 0
and strict compile exited 1 with `non-exhaustive match: missing '_'`;
there was no native module/runtime. The existing top-level analyzer
correctly excludes guarded patterns from the exhaustiveness matrix.
Keep that behavior. F4 is a separate nested runtime exhaustion witness.

In only `test/fixtures/semantic-roles/statement-match-guards.lykn`,
append an unguarded last clause `(_ (trace:push "fallback"))` after
the late guarded clause. Keep every earlier clause and the exact
current stdout oracle. The intended chosen clause prevents this
fallback from running. No other fixture/test/production changes.
Use fixed `/private/tmp/lykn-s04-i2.tBlMBxu9/i2-guard-test-message.txt` with normal hooks
and exact path. Freeze for CDC review. Replay the old native exact
F1 and public parent with prospective roots and before/after producer
pins. Native F1 should now reach its runtime red
`["subject","literal-false"]\n`. Existing other old cases stand.
Report actual warnings and runtime results. Original source recipe
and production hold continue.
