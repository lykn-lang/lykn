# Independent review — first new-gap stop, 2026-11-06

CDC `/root/cdc`, OpenAI Sol6.1 High, reviewed fresh CC
`/root/cdc/async_export_cc`, OpenAI6 Luna High. Ownership returned before this
review. NE-C07 is **unaccepted and unfixed**. The bounded stop is accepted;
this is not source implementation acceptance.

## Red evidence and candidate limits

CC froze tests at a451360b4be54812fa3ed4fcde55113c02379626. Retained
`artifacts/red-unit-exports.txt` records 7/8 selected passing, one intended
async-export failure (1110 filtered). Initial CLI run records 0/2: the positive
fails native check, and an overbroad newly authored reserved-name check oracle
also fails. Both raw failures and all candidate bodies remain.

Intermediate bdad42216c235a18d51609474f32f6ae9ce84a95 correctly tests the
documented compile-time reserved-binding rule through `compile -o`, which
unexpectedly succeeds. Its failed Rust assertion drops the temporary output;
those original emitted bytes were not recovered. The raw old Cargo run does
not retain the exact CARGO_BIN_EXE_lykn hash/path. These are evidence limits,
not supplied later by inference. The subsequent test-only commit
2bf7a10929dc870acbd37709d5851cfd109f0082 changes that assertion to stdout
compile: final CLI red is 1/2, unknown/nested predicates pass, stdout reserved
rejection passes, positive async still fails. That narrower green predicate
does not dispose of the observed output-route gap.

CC then authored a 14-line private-collector production patch. Its complete
body, exact diff and provenance are in
[unvalidated-candidate](artifacts/unvalidated-candidate/provenance.md).
CDC independently confirmed saved/current byte equality, then restored only
the uncommitted production path. No post-patch validation occurred. Source is
clean on codex/async-export-binding at the committed test-only head above;
release/0.6.x remains f70565566088f5d55129edda6bd73a4691e5a58d.

## Independently reproduced NE-C08

The exact intermediate test input, predictions, command, tool hash and
config-absence receipts were committed **before execution** at
2d677c43b3f61e64e969a3c266c93a5f4fa5fc99. CDC ran only that same condition,
not another variant, using the unchanged absolute release compiler SHA-256
57a49f559a79700d66a2d1db216bd179d54fd0c51fd7f2626ff2029bd3163d28
from the recorded fresh `/private/tmp` cwd. Full raw evidence is
[cdc-output-route](artifacts/evidence/cdc-output-route/command.txt).

Actual exit **0**; stderr only warns about missing return annotation. Complete
output inspected: `function default() { return 42; }` followed by
`export {default};`; declaration output says `export function default(): unknown;`.
There is no legitimate escaped binding. Source SHA-256 is
63ea6ca5e1c1286f7de9f9b603c081b389f7c5185deb6f2a1c80b4d5b8fae43c;
JS aecf658cfe20068ba7fb3e497e9ff28c703605848303e61fd8925460cdbefae7;
DTS ffe1235a99f225c9e35262ffdca8711efc3bfeb620bd28ec655f05c21da7dec1.
These are fresh independent artifacts, not reconstructed old temporary files.

At source f705655, guide09 lines829–841 requires compile-time rejection of JS
reserved bindings; philosophy Principle3 makes output validity compiler-owned.
CLI main.rs routes `-o` through `compile_source_with_dts` (compile.rs311+), whose
validation sequence lacks `validate_reserved_names`; stdout compile invokes it
at compile.rs201–213. The same-condition success plus literal unescaped output
therefore establishes a real output-route validation gap, **NE-C08**, rather
than a bad new rejection oracle. No additional runtime syntax probe was needed.

## Endpoint and remaining work

The Operator's first-new-gap stop applies before continuing NE-C07. No green
repair, full Make/citation gate, generated async module/import runtime or new
tested compiler is claimed. Parser observations **0/4 run, 4/4 unrun**;
walker controls and corpus remain unrun. AE-01–06 deferred, AE-07 done.
Original Slice12 deferrals/process failures/reviewer retraction, F1–F12 and
Project07 synthesis/licence/bootstrap/lib/ADT/guides/book/human gates survive.

Project03 CDC owns NE-C08's future output-route validation parity/shared-frontend
disposition, including comparison of existing validation sequences; this is not
a request to blacklist only `default`. After separately authorized acceptance,
resume NE-C07 from the retained red tests/candidate with fresh review/tool pins,
then only the unchanged four parser observations. No next unit is opened here.

Final scoped diff hygiene: explicitly named prose passes the staged diff check.
The complete retained-body diff reports existing blank EOF lines in
candidates/004-before-format/async_exports.rs and
candidates/pre-test-review/async_exports.rs, plus the space-prefixed blank
context line at forms.patch:25. These exact draft/patch bytes are intentionally
preserved; the whole evidence diff is not claimed whitespace-clean.
