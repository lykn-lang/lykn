# Anchor the protected assignment oracle at the actual target

Same S21 scope and actor roles. Preserve frozen test-only
`7fe47e3d`, with no build/run or product edit before this correction.
The protected walker records the actual target's parsed span, not the
assignment root. The fixed source target `(get Reflect "apply")`
starts at line 2, column 13. Native F4 requires exact exit 1, empty
stdout, exact phase-rendered stderr and the same absent JS/DTS.
Check renders `<actual input path>: error: 2:13: error: …\n`.
Compile renders `2:13: error: …\n`. Follow the existing
protected_host.rs exact formatter pattern and use the full existing
slot message. No new phase, policy or fixture.

In public F4, record actual source, full error name/message and
whether output was returned before assertions using the existing
bounded semantic-role receipt idiom. Require actual Error,
exact `host-contract v1: write to protected slot Reflect.apply`
and no output. No execution. No changes to F1–F3, test populations
or ordinary validations. Only the two existing test paths may change.
Use supplied exact `correction01-message.txt`, return immutable
freeze before old focus. S21 refinement 01 of five.
