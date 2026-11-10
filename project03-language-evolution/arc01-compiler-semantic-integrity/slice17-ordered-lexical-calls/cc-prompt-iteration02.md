# Match lexical call eligibility to emitted names

S17 refinement 02 of five. Same Luna 6 High CC and separate
Sol 6.1 High CDC, standard Autonomous Mode. The original
[assignment](cc-prompt.md), frozen [oracles](artifacts/fixtures.md)
and existing execution receipts still apply. Correction 01 remains
spent. Native and public baseline reached all scheduled cases.

Product freeze `d69fcbfb2142f10952035d4e0c633225d13ff3ae`, tree
`d5568c95e0148ce989a0bdc023f752f0c5a4810c`, held in static
review before any current execution. Actual native and public
name mappings strip trailing `!`. The raw special-name check
would admit `eval!` even though the emitted identifier is
`eval`; saving that callee can turn direct eval into indirect eval.
Use the existing identifier mappings for the special-name
exclusion after checking actual lexical resolution and no colon.
A tagged legal `dynamic-import` lookalike is an ordinary
`dynamicImport` binding. Actual kernel dispatch stays excluded
by the existing resolution gate.

Preserve original native source span for an unlifted lexical
call by rebuilding its `SExpr::List` with the original span.
Use the already matched nonempty call parts at the native helper
boundary. Clarify Guide 00's exact eligible direct argument
paths and mixed-spread behavior without claiming unsupported
nested value or ordered-reference routes.

Only the existing four product paths may change. Maintain exact
canonical and embedded JS mirror. No test, fixture, receipt,
diagnostic or acceptance population change. Normal exact-path
`git commit --only -F` with supplied
`/private/tmp/lykn-s17-cdc.lAFdsMI8/correction02-message.txt`. Return clean exact commit,
tree, actual message, mirror and scope before any current run.
After separate static release use the original current focused
and normal full gates.
