# CDC retrospective — 2026-11-06

The positive red regression reproduced the documented async-export problem.
A meaningful reserved-binding countercontrol exposed another native output
route's missing validation before a repair could be accepted. Source/guide
review and one independently pinned same-condition execution were sufficient
to invoke the promised stop; no parser capability conclusion follows.

The first new reserved check expectation exceeded the documented compile-time
contract. Its correction to compile-with-output exposed a real gap. Narrowing
again to stdout produced a passing predicate but did not resolve that gap;
review caught this before post-patch validation or acceptance. Future gate
instructions should retain route-specific failures as findings until the
source contract disposes of them, rather than substitute another route.

Retained raw output and whole candidate snapshots help reconstruction, but the
failed Rust test dropped its temporary generated output and did not record the
exact child compiler hash/path. The later independent artifact is clearly new;
it cannot repair that historical provenance. For future failing CLI tests,
persist executable identity and emitted bytes before assertions/temporary-drop.

The private-collector patch had already been authored when the stop was agreed.
Saving its exact full body/diff/hash, then restoring only the known own edit,
preserves useful work without implying validation. Preparation produced many
draft snapshots for this small change; their count is not useful-work evidence.
No reliable timed overhead ratio is available. Keep subsequent packets small,
freeze the actual condition, and let the earliest real gate decide progress.

No framework policy change or new repair is enacted by these recommendations.
Slice12's hook/precheck deficiencies and CDC's incorrect export instruction
remain independently recorded history, not retroactively cured by this unit.
