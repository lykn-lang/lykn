# CLI integration fixture portability and isolation

The Operator authorized the repair alongside I3. The root
contributor prepared test-only `fcc786bf70ddc7a7913892a7ed5bcfd71581a627`,
tree `47ebb0207e47c020ec64f8cbbb278c9908519491`, on
`codex/hosted-ci-repair` based on release `6c9dbd5c`.
Only `binding_scan_shadows_macros.rs` and
`match_clause_validation.rs` change. The binding scan gives
parallel compiler children unique fixture directories, cwd and
embedded-cache roots. The match runtime respects the existing
`LYKN_TEST_DENO` override and otherwise uses Deno on PATH.
The assertions and test populations are preserved.

Hosted Rust/integration jobs 129918627823 and 129918628062
show the hardcoded Deno path failure. Publishing job 129918627788
shows the cold macro-binding ENOENT. Local isolation addresses
the shared-file/cache risk. The exact hosted ENOENT cause is
unconfirmed. The root contributor's candidate checks passed
focused tests, ordinary full Make, publishing, the exact all-features
workspace command with ignored tests included, and standalone
cited paths. Its initial local npm cache permissions failure
remains in the original execution history.

Independent CDC verified the exact candidate diff and ordinary
PATH behavior with the override unset. Both integration targets
passed, 4/4 and 5/5. [Candidate receipts](evidence/hosted-ci-test-isolation/candidate).

After independent [S18 acceptance](../../arc01-compiler-semantic-integrity/slice18-ordered-member-calls/cdc-verification.md),
root cherry-picked the exact test patch onto accepted `e851ac76`.
The resulting clean task `e9eeee3d49ee42268a1d6d082e39b357ea47a079`,
tree `2fa18ac7de07cf7cec266cd99fe2b4e14ee1a8b9`, has
the two exact patch blobs and no production delta. Independent
CDC reproduced the same two tests on the composed checkout
with fresh named config checks and fixed pins, 4/4 and 5/5.
[Composition receipts](evidence/hosted-ci-test-isolation/composed).
Release `6c9dbd5c` remains unchanged. No hosted rerun is claimed.

DD-37 is a distinct browser compiler size failure. The same
frozen baseline script on local Deno 2.9.6 measures 27,630 to
41,370 gzip bytes, a 13,740-byte increase. Hosted job
129918628123 measures 27,906 to 41,830, a 13,924-byte increase.
These are same-platform comparisons against source
`4b9546cdba6bdcd4e5dd82d7cdf6cf58da9edde0`. No baseline or
budget change is recorded here. The browser budget stays open.
S18 measured unused support in compiled user programs, a
different artifact. [Local and hosted size streams](evidence/hosted-ci-test-isolation/dd37).

Scoped planning prose and source whitespace checks pass. The
aggregate staged evidence check exits 2 on preserved raw blank
EOF lines and hosted trailing whitespace.
