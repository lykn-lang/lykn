# Correction1 authoring receipt — capture nonconformance

The complete initial source freeze is planning commit `b312cf3`; its exact
source bodies and first native failure remain available in Git and
`evidence/cc/native-0001` through `native-0003`. After CDC issued the consolidated
EW-R1–R5 directive, the scanner was replaced and then received two consecutive
source patches before its immediate intermediate body was copied. This is a
capture **NONCONFORMANCE**. The prior scanner is in `b312cf3` and
`correction-01/current-3/scanner.lykn`; the new post-edit scanner is in
`correction-01/current-4/scanner.lykn`; current full source bodies after the
subsequent recorded patch are in `correction-01/current-5/`. The exact
delete/add and two patch payloads are available in the interaction trace, but
no stable patch IDs were emitted and the missed intermediate file/hash is not
reconstructed or claimed. The initial walker edits also retain their dated
candidate snapshots under `correction-01/current` and `current-2`.

No check, compile, Deno invocation or control ran during this uncommitted source
authoring. This nonconformance is retained as such, not treated as cured by the
later snapshot and not attributed to a compiler/evidence-capability gap. All
future source edits/checks in this correction use a unique exact candidate
snapshot first.
