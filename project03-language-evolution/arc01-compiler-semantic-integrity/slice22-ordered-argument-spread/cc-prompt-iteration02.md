# Apply the S22 formatting gate's exact Rust changes

Current `a1137ea2` passed native 53/53 and public 15 tests plus 43
steps. The normal Make run stopped at the three rustfmt differences
printed in `/private/tmp/lykn-s22-current-a1137ea2/full-make/stdout.raw`.
Retain that failure and all prior raw runs, including the first public
run without a separate evidence directory and the completed repeat.

Apply only those rustfmt changes to
`crates/lykn-lang/src/emitter/forms.rs`. No code, fixture, predicate,
mirror, or other source changes. Use the supplied
`correction02-message.txt` and return the actual clean freeze and raw
commit body. This is the second issued refinement. The provisional
`8bc43a41` attempt remains separately visible.

After static release, run normal unfiltered Make and standalone cited
paths under the original prospective receipt contract. Existing direct
focused results retain their original producer. The CDC will separately
reproduce the current focused and full gates at the final freeze.
