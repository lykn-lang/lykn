# Independent verification of structural match and nested escapes

Accepted 2026-11-10 by Sol 6.1 High CDC after Luna 6 High CC
returned clean exclusive task, index, build and raw ownership. CC
proposed MK-01 through MK-04 done, with MK-05 held for this replay.
CDC independently inspected the exact source and repeated every
current gate below.

Clean task `codex/completion-value-flow` at
`31893710bbba8999e936fade2d79ae6f6aee929c`, tree
`3a5e2505d991896016fb1a20070487325c37d19c`. Exact delta from
accepted `b5c22b63` is 15 allowed paths. The nine production
paths cover three native files and three byte-identical
canonical/embedded JS pairs. The other six paths are two tests and
four fixtures. The emitter file also contains its private tests.
The two original S12 fixtures match the Git blobs from
`bd081320`. No public export or API signature changes.

| Row | Disposition | Independently reproduced evidence |
| --- | --- | --- |
| MK-01 | Done | Original F1 runs through public `lykn` with `[11,22,14]`. Actual pattern, guard and body reserved-binding diagnostics and definition order remain distinct passing controls. The genuine guard and sibling match survive in generated JS. |
| MK-02 | Done | F3 yields `[7,8]`. The complete public module keeps ordinary parameter and enclosing `match` calls and both conditional arguments. The source scan preserves computed callee traversal. |
| MK-03 | Done | Exact original F2 now yields `[7]` in the native route. Its consumed subject is an object literal. F4 yields `[11,11,7,9,6]`, preserving the static `if` property, computed and spread properties, and actual kernel assignment. |
| MK-04 | Done | Nested unknown strict CLI exit 1 with the existing 1:14 error and `kernel:object` suggestion, no JS or DTS. The independent private controls verify the typed parsed diagnostic and original tagged head plus restored context. Public unknown error remains exact. |
| MK-05 | Done | Independent grouped no-run, native 22/22, private 2/2 and public six tests with 20 steps pass. Normal `make check` and standalone cited paths exit 0. Scoped source diff and fresh materialized package byte comparisons pass. |

The [fixture comparisons](artifacts/evidence/cdc/31893710/fixture-comparisons.txt)
record each native check, strict compile and runtime exit 0, generated
JS present, DTS absent, and each paired public strict runtime exit 0.
All eight runtime outputs match their exact JSON plus LF and empty
stderr. The four complete generated modules from each backend are
byte-identical to that backend's CC modules. [Native](artifacts/evidence/cdc/31893710/native-fixtures/)
and [public](artifacts/evidence/cdc/31893710/public-fixtures/) retain the
module and child receipts. Exact current native F1 warns at 6:3
on unreachable match. F2 warns at 7:3 and 8:3 on unreachable
matches and 6:4 on unused `clause-push`. Those diagnostics remain
for later analysis. Unknown native compile also retains the unused
`result` warning. The original four inherited no-else controls
prove failed JS file effects. Their DTS receipt is an unobserved
placeholder, separate from the new fixture file checks.

[Normal unfiltered Make](artifacts/evidence/cdc/31893710/make/)
passed build, Clippy, format, lint, Rust and the main and docs
suites. It reports 1,166 Rust library tests, 1,485 JS/Lykn tests
with 44 steps and 482 documentation cases. [Standalone citations](artifacts/evidence/cdc/31893710/cites/)
passed for 64 documents and 601 historical citations. The
[post-Make pins](artifacts/evidence/cdc/31893710/post-make-pins.txt)
identify matching task release and installed producer SHA-256
`fa7b7f62f4a837503174a4dcde2d6a0c12f60f6bcb96ec06b665922d65765e95`.
The native focused producer hashes match before and after.
The [fresh embedded package](artifacts/evidence/cdc/31893710/materialized-byte-check.txt)
matches the source package, with canonical, embedded and actual
cache bytes identical for all three changed JS modules. Independent
runs use separate fresh /private/tmp TMPDIR, XDG and npm roots
with 128 exact config names observed absent before their applicable
launches, fixed DENO_DIR, Rust/Cargo 1.97.0 and Deno 2.9.6. The
full Make uses ordinary PATH with test overrides removed.

## Earlier conditions and limits

- Initial tests-only `d80959e7` held on static oracle review with
  zero launches. Refinement 01 `28ed061d` measured the unchanged
  `b5c22b63` compiler. Native 19/22, private tagged passes and
  private unknown fails as expected. F2 emitted
  `kernel.object(key(7))` and runtime exited 1. F4 rejected a
  structural `if` key before emission. Unknown strict compile
  exited 0 and emitted JS, which was never executed.
  [Original raw](artifacts/evidence/cc/baseline-28ed061d/).
- First old public parent had 17/20 steps and all five separate
  negatives pass. F1 and F3 had their planned false-binder
  diagnostics. F2 additionally failed on duplicate `obj` macro
  registration in the parent, before artifact creation. Refinement
  02 `4a8ff730` scopes the existing reset to F2 alone. Old public
  replay had 18/20 steps with only F1/F3 red, all five negatives
  passing, and exact unchanged F2/F4 green.
  [Old replay](artifacts/evidence/cc/replay-4a8ff730/).
- Initial source `afdb7d77` grouped build exit 101 with E0308
  at emitter/forms.rs:679 before native execution. Source review
  missed the accidental Option pattern. Separate public focused
  passed six tests and 20 steps on that same unchanged source.
  Refinement 03 replaces only that pattern. A broad JS formatter
  run during initial authoring was restored before the first
  source freeze and is retained in the [first-source raw](artifacts/evidence/cc/first-source-afdb7d77/).
- A prohibited read-only Python authoring command was disclosed
  and excluded from evidence. Independent native Git/blob checks
  verify fixture identity. The [original disclosure](artifacts/evidence/cc/initial-raw-handoff.txt)
  is preserved.
- First current CC direct native run passed 22/22, with generated
  bytes in the combined log, inherited Deno resolution, and no
  dedicated artifact directory. The separate pinned current
  replay with a fresh evidence directory passed 22/22. Both are
  preserved. CC recorded inherited PATH rather than a complete
  value in some outer receipts, and several CC outer streams are
  combined. The [current CC records](artifacts/evidence/cc/current-31893710/)
  and separate CDC streams retain actual execution conditions.
  CC's separate post-Make compiler invocation materialized a
  fresh package and matched all 17 files. Independent Make
  materialized the matching package in a different fresh root.
- The scoped source and planning prose diff checks pass. The
  full staged planning whitespace check exits 2 on trailing
  whitespace and blank EOF lines confined to original raw logs.
  Their bytes are preserved.

NE-C16 and NE-C17 are accepted on the task branch. Release
`7b17a7841cc4d749276467ec2bcec7ed9faed7b2` is clean and
unmodified by this slice. General consumed completion, I3/I4
and CV-04/CI-04 composition remain open.
