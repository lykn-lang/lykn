# Independent verification of S19

Accepted exact `c729a0df3547336307795fd8d345a3562902e3f2`,
tree `4a0b3a56e55710f1762d2142ce673c0189d81433`, on
`codex/completion-value-flow`. Luna 6 High CC proposed all four
CM rows. Sol 6.1 High CDC independently reviewed the eight
source paths and reproduced the exact current gates after the
clean exclusive handoff. Release remains `6c9dbd5c`.

| Row | Independent disposition |
| --- | --- |
| CM-01 | Done. F1 saves base and key once, then performs the actual computed property read and native coercion before arguments. Normal runtime preserves receiver. Early key transfer returns 93 before GetValue or arguments. |
| CM-02 | Done. Actual native and public getter and argument throws retain exact object identity and skip later effects at their own stage. Both complete strict stdout traces match exactly with empty runtime stderr. |
| CM-03 | Done. F2 bound get and checked explicit kernel get retain ordinary output. Original F2 old/current bytes match each backend. Final fixture's module name change produces exactly two name-only emitted differences. F3 native exact error at 2:3 exits 1 with no JS/DTS. Public exact Error with no output. No F3 output executed. Actual kernel JSON and public direct/clone/JSON paths emit ordinary output. |
| CM-04 | Done. Independent native focused 45/45 and public 13 tests/37 steps, full unfiltered Make and standalone citations all exit 0. Actual source and backend outputs, post-Make CLI and freshly materialized packages agree. |

[Independent full receipts](artifacts/evidence/cdc/final-c729a0df)
include actual prospective cwd, argv, scoped environment and
64 named configuration checks per launch. Final native CLI,
runner and Deno stay pinned across focus. Native and public
complete modules match each respective CC module. Full normal
Make passes 1,167 Rust library tests, 1,492 JS/Lykn tests and
61 steps, 482 documentation tests, formatting and lint.
Standalone citations passes 64 documents and accepts 601
historical citations. Final task `bin/lykn` and
`target/release/lykn` are both
`9f602bcb664c7114d702380fd454885647c483d6b526b1a17ea8cf4a12b4c0b8`,
matching CC. Canonical, embedded and actual fresh materialized
expander bytes agree. The complete fresh package tree matches
the repository embedded package tree.

[Public old and initial native compiler
failure](artifacts/evidence/cc/old-5e5c2c6a) retain the actual
5e5c test-only condition. Public reached all 13 tests and 37
steps, with 11 passing tests and 36 passing steps, two
expected test failures including the one step. The first
native no-run fails E0382. The [corrected old native run](artifacts/evidence/cc/old-f71882b3)
has 43/45 pass and the same two expected reds. F1 uses 93 as a
property key and catches TypeError after argument effects.
F3 emits JS and is never executed. F2 passes both old routes.

The [initial current focus and Make
failure](artifacts/evidence/cc/before-lint-fix-0b899986) retain
all original exact F2 byte equality. First normal Make reaches
Lykn lint and exits 2 on one incidental shadowed source name.
The exact fixture-only correction changes the old spelling.
Final current runtime is still exact; retained final module
diffs show only the actual name and reference changes.
[CC final gates](artifacts/evidence/cc/final-c729a0df) retain
separate attribution from independent proof.

The accepted scope is actual computed get calls in the direct
unprotected function region. The mixed spread guard is a
temporary I3 boundary, including when only the reference
needs lifting. It does not require a new runtime policy.
Assignments, iterator transport, lifted direct eval and other
special references retain their own scope. A separate root
public runtime observation at e9eeee3d shows generated private
temporaries assign an observable name to an anonymous value.
That confirmed follow-up has its own source-ready gate and does
not expand this finite receiver proof. CV-04 and CI-04 stay open.

Scoped prose and product source whitespace checks pass. The
aggregate staged archive check exits 2 on verbatim raw stream
whitespace and blank EOF lines. Preserve those original bytes.
