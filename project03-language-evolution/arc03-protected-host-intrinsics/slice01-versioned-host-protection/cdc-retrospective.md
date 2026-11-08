# CDC retrospective — initial attempt stopped, 2026-11-08

Author/reviewer `/root/cdc`, Sol6.1 High; inspected issued prompt, full frozen
two-test source871f and actual Luna CC return. No builds or runtime trials are
available. This retrospective closes the attempt record, not the slice/arc.

The intended result was usable protected-host source policy. Actual result is
an unvalidated test-only commit and a prelaunch static stop: a writer intended
to retain before/after evidence reuses a createNew filename. With evidence
enabled it would prevent the post-child assertions. This is a concrete local
test-authoring defect, not evidence against the language design, shared Deno
infrastructure or any model generally.

CDC's prompt required both records and collision prevention but did not show
distinct phase names explicitly. CC selected the colliding path. CDC owns that
example/readiness omission and caught the delivered defect at the agreed
immutable static gate. The gate and immediate CC hold prevented a misleading
runtime result; they did not deliver the requested capability.

If Operator resumes, use explicit before/after names preserving createNew and
all predicates. Review the pair together against actual call sites before
release. This is a bounded prompting recommendation, not an executed repair or
a proven cure. Do not add a replacement receipt framework or overwrite the
first observation. Current untested remainder still requires original gates.

Prior lessons applied: fresh actor, fixed -F files with actual raw-body readback,
real Git freeze before checks, named ownership and separate static release.
They succeeded as provenance/control measures here; no claim is made about
comparative speed or model effectiveness. All old failures/budgets/tooling8 and
K0/13 remain historical/current as recorded; a new arc does not cure or reset
them. Follow-through waits an explicitly approved correction, not automatic
advancement.
