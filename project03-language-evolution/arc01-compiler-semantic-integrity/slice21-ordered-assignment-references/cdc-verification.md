# Independent verification of S21

Accepted exact `b1937050a2c25fa1a385410a05a45aa22b9f2843`, tree
`54c04540942581d66d471c881e630d1792ab4cdd`, on
`codex/completion-value-flow`. Luna 6 High CC proposed all four
AW rows and returned a clean checkout. Sol 6.1 High CDC reviewed
actual source and reproduced the focused and full current gates
after taking exclusive ownership. Release remains `6c9dbd5c`.

| Row | Independent disposition |
| --- | --- |
| AW-01 | Done. F1 key effects run before RHS. A source early return leaves the original receiver unchanged and skips key coercion, write and following code. Normal RHS mutates the source receiver binding, but the saved receiver still gets one write with one post-RHS coercion. The direct Statement control returns or writes at its own boundaries. |
| AW-02 | Done. F2 reads the old property before RHS. Early return 91 skips conversion and setter. Normal completion coerces the saved old object with hint default, writes 14 once, and returns 14. Both actual native/public runtime traces and complete modules substantiate this sequence. |
| AW-03 | Done. F3 native old/current complete JavaScript and kernel JSON, and public old/current complete JavaScript, compare equal. The genuine local Reflect write remains legal. F4 check and compile return actual exit 1 with the exact 2:13 target diagnostic, empty stdout and no JavaScript or DTS. Public actual Error has the same slot and null output. Unchanged protected-host native 3 and public 1 parent with 13 steps are green. No protected specimen was executed. |
| AW-04 | Done. Independent native 50/50, public 14 tests with 41 steps, both protected suites, normal Make and standalone citations exit 0. Final compiled modules and actual package mirrors match. |

[Independent current receipts](artifacts/evidence/cdc/final-b1937050)
retain exact prospective commands and 72 named config absence checks
per launch, distinct roots and actual producer pins. F1–F3 complete
native JS/kernel and public JS match their respective CC evidence.
Both strict runtime streams match the exact stdout oracles, empty
stderr and native DTS absence. Full Make passes 1,167 Rust library
tests, 1,493 JS/Lykn tests with 65 steps, 482 documentation tests,
Clippy and formatting. Standalone citations passes 64 documents
and 601 historical citations. Task `bin/lykn` and `target/release/lykn`
both hash to
`285db3648980258a43ac2d05b51e6c17d0a3250dfe028c00bd70a8dd5cd0e068`,
matching CC. Actual fresh whole materialized packages compare
equal to tracked embedded bytes. Canonical and embedded expander
match the actual materialized file.

[Exact old evidence](artifacts/evidence/cc/old-7768e003) has native
48/50 and public 13 passing tests with 39 passing steps, with sole
F1/F2 behavioral failures on each backend after successful strict
runtime. F3/F4 are green. The old CLI build exited 0 and was pinned
before direct execution. CC did not preserve a durable prospective
manifest or run build-specific config checks for that build. Its
actual launch was retained in the contemporaneous tool record.
The old focused launches and final independent builds have their
own prospective receipts.

[Before-correction CC evidence](artifacts/evidence/cc/before-clippy-fix-9f5e2562)
preserves the exact first public current green, which applies to
final source by unchanged JS/test bytes. The first full/cites
wrappers supplied duplicate make arguments and reached no repo
target. Corrected Make then reached actual Clippy and failed on two
question-mark diagnostics. CC first used Python for the unstaged
text replacement against project instructions. The exact resulting
diff is retained as process provenance. CC reversed its two owned
hunks and re-authored the two exact changes using apply_patch before
the final immutable freeze. The prohibited action occurred and
remains part of this record. Acceptance uses the permitted final
source and independent actual executions.
[CC final evidence](artifacts/evidence/cc/final-b1937050) is separate.

The accepted source scope is ordinary simple computed writes,
resolved bare lexical assignment, and computed literal-string
`+=` in the selected direct named-function contexts. Other
operators and arbitrary effectful compound keys remain outside
this scoped proof. Existing pinned-Deno object-key compounds
actually coerce twice in the retained probe. The property
Reference and compound operator algorithms do not establish
that engine behavior across hosts.
[ECMAScript assignment](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-assignment-operators)
and [observed native probe](artifacts/evidence/preliminary-reference).

No claim of a current safe control-bearing fallback follows for
held compound or special reference shapes. Ordered spread is
the next separate delivery. CV-04 and CI-04 remain open.

Scoped prose and source whitespace checks pass. The aggregate
staged evidence check exits 2 on original stream whitespace and
blank EOF lines. Original receipts retain their bytes.
