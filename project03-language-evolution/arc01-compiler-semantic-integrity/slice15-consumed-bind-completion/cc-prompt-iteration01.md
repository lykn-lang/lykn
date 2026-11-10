# Update the paired DD-50 direct-bind expectations

S15 refinement 01 of the normal five. Standard Autonomous Mode.
Same Luna 6 High CC, separate Sol 6.1 High CDC. The accepted
implementation intent and original inputs stay fixed. Read the
[initial assignment](cc-prompt.md), existing tests and the actual
DD-50 assertion output in
`/private/tmp/lykn-s15-direct-bind-zqq6BJfM/make-check/stdout`.

Task base is clean exact `dcd007f574c96622ee0eb8f990903edf5fbe9e09`,
tree `1bd3d76b07154d1a6ee25ff13747ba9d014b5559`.
Focused native 31/31 and public 28 shared steps plus 7 standalone
controls passed. First normal Make exits 2 at test-suite with
1,485 passed, 52 steps and two paired failures. Rust, lint and
earlier Make steps passed. Its two old shape assertions require
an IIFE for the exact simple bind now admitted by S15. Actual
output is a direct branch, original throw, original const and
source function return.

Keep the exact string input and use each existing test helper.
Edit only the two relevant tests in
`test/forms/dd-50.test.js` and `test/forms/dd-50_test.lykn`.
Rename both cases to describe the ordinary direct bind, and
their immediately adjacent headings if stale. Assert that the
generated source contains `if (x === 1) {`, the ordinary branch
assignment of `"a"`, `throw new Error("e");`,
`const y = completionValue__gensym0;` and `return y;`, and
does not contain `(() =>`. For the Lykn-authored test
use its existing `includes` and `ok` macros with the existing
Lykn idiom `(ok (not (r:includes "(() =>")))`. For the JS
test use its existing assert imports, including `assertEquals`
on `out.includes("(() =>")`. The exact temp 0 is justified
by this fresh single-unit compiler fixture and these observed
bytes. Existing top-level/legacy IIFE, ordinary ternary,
native typed F5, all 31/28+7 current focused cases and all
production/docs remain byte unchanged.

Read actual failed-phase stdout, retain all first-run raw and
follow the original exact source/index ownership and prelaunch
receipt rules. Use the prepared `/private/tmp/lykn-s15-cdc.i8haO4zE/correction01-message.txt`
with normal exact-path `git commit --only -F`. Return immutable
two-file commit and clean status for independent static release
before tests. After release run a fresh normal unfiltered Make
and standalone citations, with new scoped TMPDIR/XDG_CACHE_HOME/
npm and fixed DENO_DIR, exact actual pins and named ancestor
checks. Both test-only env vars are unset for normal Make.
The unchanged earlier focused results remain attributed to
`dcd007f57`; they need not be repeated by CC solely for two
unrelated assertion files. Current full Make must exercise both
corrected cases and all preservation rows. Compare actual
materialized mirror and post-Make binaries. Return all four
DB row proposals and clean exclusive handoff. CDC separately
runs current full, focused and citation gates. No S16 execution,
release update, production patch or replacement of previous evidence.
