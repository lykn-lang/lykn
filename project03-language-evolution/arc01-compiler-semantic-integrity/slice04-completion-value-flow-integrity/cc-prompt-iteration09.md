# S04 iteration 09 — isolate native positive fixture caches

Same Luna 6 High CC and Sol 6.1 High CDC, standard Autonomous Mode.
Source refinement 07, explicitly beyond the normal five. Preserve clean
`decb1bb6c09f41cff44c9cb09f5c1260eb27046f` and all actual first runs.
CC current gates passed. CDC separately ran both same-span controls and
public eight steps successfully. Its native aggregate was eight passes,
one failure. Original macro F3 passed. Existing F2 check exited 1 with
`I/O error: Invalid argument (os error 22)`, strict compile exited 0,
and its runtime was unrun after the check assertion. Actual independent
raw is `/private/tmp/lykn-nec14-cdc.BX3ezvC2/native/` and `/private/tmp/lykn-nec14-cdc.BX3ezvC2/evidence/native/`.

The two native macro fixtures used the same fresh process-wide XDG cache.
Existing `expander/embedded.rs::materialize_packages` checks readiness
then can remove/extract shared package files without coordination. Cold
fixture interference is a source-supported hypothesis. The reported
error does not identify the syscall. Product cache concurrency is
outside this correction.

Only `crates/lykn-cli/tests/semantic_roles.rs`:
in `run_positive` create a unique `xdg-cache` directory under the existing
fixture `TempDir` before launching either compiler child. Set that path
as explicit `XDG_CACHE_HOME` on both its check and compile commands,
using existing `record_command` to retain the override. Keep the normal
parallel native runner, exact command arguments, strict runtime
conditions, sources, artifact checks and stdout/stderr oracles. No
global cache override, serialization, framework or production changes.

Use the fixed `/private/tmp/lykn-d736-release-cdc.Gdv7dxje/c14-fixture-cache-message.txt`,
normal hooks/exact paths. Freeze exact change for CDC static review.
Repeat current native nine with fresh scoped roots, actual build/pins
and complete raw, then normal unfiltered Make and standalone cites.
Unchanged private/public focused observations keep their exact earlier
pins; current full Make still covers them. Return clean exclusive
ownership for CDC's separate fresh current validation and acceptance.
