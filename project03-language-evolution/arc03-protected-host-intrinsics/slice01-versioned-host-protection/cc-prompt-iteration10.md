# Apply the observed native lint corrections

Same Arc03 S01 and same Luna6 High CC and Sol6.1 High CDC. Source
`629fb6712954a7bc61bad0ec7ef5ce1001d82ce7` passed the focused gates.
The normal Make gate reached Clippy and exited 2 after eight
`collapsible_if` diagnostics in the single new native policy module.
Read the actual `target/arc03-s01/cc/final-make-check-629fb671-20261109/stderr.raw`.
Preserve that failed attempt and all earlier receipts unchanged.

Under current Operator steering this is actual source pass 08, the
third beyond the normal five. Apply exactly the eight recommended
let-chain collapses in `crates/lykn-lang/src/protected_host.rs`.
Preserve branch order, scope, every diagnostic and all tests and
fixtures. No refactoring, changed oracle, lint suppression or unrelated
edit. Use the [supplied -F body](artifacts/commit-messages/continuation08-v1.txt).
Preserve the lint fix freeze and any necessary separately recorded
mechanical formatter freeze. Return the exact diff for CDC review.

Then resume the complete original validation against the final source.
Use separate exact prospective records and actual readbacks, batching
release where possible. Keep earlier green gates attributed to their
source. No protected-write execution, baseline replay, release action
or later slice.
