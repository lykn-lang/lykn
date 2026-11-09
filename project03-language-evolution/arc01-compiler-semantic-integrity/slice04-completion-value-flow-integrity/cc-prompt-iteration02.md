# S04 iteration 02 — separate direct branch proof from macro binder identity

Continue I1 in standard Autonomous Mode with the same Luna 6 High CC and
Sol 6.1 High CDC. This is source refinement 01/5 for the initial fixture
population. The planned I1 production implementation remains the original
assignment. Read [iteration 01](cc-prompt-iteration01.md) and
[the actual baseline disposition](artifacts/i1-baseline-disposition.md).
Retain exact clean test-only parent `7cc78d673ab229f2cde29d2a41d23a762107cf7a`
and original raw. NE-C14 is a separate native resolver prerequisite for
later macro-boundary proof. Do not fix it in this I1 handoff.

## Exact fixture change and old-source proof

Keep `test/fixtures/semantic-roles/if-direct-transfers.lykn` byte-identical
and tracked for NE-C14. Add
`test/fixtures/semantic-roles/if-direct-transfers-literal.lykn`. Copy the
whole original source after the `(make-pick)` line without altering bytes.
Instead of the original macro declaration and invocation, start this new
fixture with the literal intended expansion below.

```lykn
(kernel:function select (flag)
  (if flag (return 7))
  (return 9))
```

Select this explicit literal witness in the existing native/public I1
direct-transfer test entries, preserving exact `[7,9,[0,2],4]\n` stdout,
exit 0, empty stderr and the native actual absent-DTS proof. Use distinct
`if-direct-transfers-literal` evidence labels. The original F3 is not in
I1's active acceptance population because its first native execution
exposed independent resolver corruption. Its original source/oracle remain
the prerequisite replay witness. Do not add skip/ignore flags or weaken
F1, F2, preservation or negative conditions.

Only the new fixture and its two existing test selection entries change
at the test-only freeze. Use the supplied exact source message at
`/private/tmp/lykn-d736-release-cdc.Gdv7dxje/i1-direct-test-message.txt`, normal Git/hooks,
explicit paths and actual raw Git body. Return the exact source ID and
focused diff to CDC for read-only review before launch. Old production
must still equal `d73601a5`. Under the original prospective metadata and
pinned isolated settings run the exact native literal test and the existing
public fixture parent with this witness. Expected literal check/compile
succeed, actual native DTS absent, strict child exits 0 and emits empty
stderr but both old outputs retain dangling else and emit
`[7,9,[0,2,901],4]\n`. Capture complete module/status/streams even though
the outer exact-output assertion fails. Report any differing actual
symptom as such. The original native five passing and F1/F2 red results
stand on their exact source/test freeze. Public parent replay naturally
observes the same seven total steps including the literal replacement.

Return actual baseline before the original I1 production recipe. That
recipe, formatting/static hold, direct source checks, normal Make,
standalone cites, real fresh pin/environment/raw obligations and CDC
independent verification remain binding. No new resolver scope beyond
I1's original conditional plan, no downstream stage, release change,
fixture oracle relaxation or macro protocol rewrite. I1 final reporting
claims direct boundaries only, with NE-C14 and original macro-boundary
proof carried forward.
