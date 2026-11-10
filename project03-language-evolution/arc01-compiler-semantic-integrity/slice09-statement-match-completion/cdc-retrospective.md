# CDC retrospective — direct statement match

Reviewed the first I2 assignment through accepted task `7b17a784`
on 2026-11-09. Luna 6 High authored the candidate and Sol 6.1 High
reviewed and independently executed it. The [verification](cdc-verification.md)
holds the detailed dispositions and raw links.

The F1 baseline exposed a planning miss. The intended runtime
guard probe had only guarded coverage, so strict native compilation
properly stopped before runtime. The source contract already made
that distinction visible. Adding an explicit unguarded last case
preserved the intended trace and left F4 to prove runtime exhaustion.
Separately, F5 needed both the test-only public counter reset and a
target allocation that could actually encounter the post-expansion
collision. Reviewing the complete emitted modules made that distinction
observable. The first production freeze had passed mechanical checks
while still letting a legacy synthetic arrow re-enter direct roles
and retaining obsolete native shape assertions. The same review
found guide wording broader than the implemented boundary.

The corrected roles and the finite F6 check preserved existing
wrapper/checked behavior. Whole modules mattered there too. The first
CC baseline summary ascribed a runtime number guard to native F6,
while its actual earlier post branch has no such guard. The raw
module survived and supports the correction. One extra CC Rust
run omitted the required Deno cache and failed on registry DNS.
A clean replay passed under the intended cache. A post-freeze
unexecuted WIP intermediate was also unretained. Exact frozen sources,
first raw failures, separate prospective records and independent
producer pins still establish the accepted condition.

For the next I2 assignment, CDC should review an example through
strict analysis before freezing a nested runtime oracle, pair actual
positive role transitions with an existing legacy boundary, and
identify which phase assigns each generated name before claiming a
collision test. Use the existing per-command preflight to check the
effective Deno cache before all process launches. The inherited native
per-fixture XDG isolation was retained and the current native population
passed on both runs. It gives no new answer about concurrent product
cache behavior. These are slice-level observations, with no comparative
model or framework-effect claim.
