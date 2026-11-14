# Correction02 source-first evidence

2026-11-14, same separate Sol6.1 High CDC. Candidate
3d21eab58cb3d28714338e8742dbb0a9c519822b / tree
b7788f6564863f51d5e8fe62979098b583b7b4b6; parent30d8b77c. Clean before/after.
Read-only Git confirms exactly six correction paths, same14 baseline paths,
adjacent actual commit trailers and no diff-check errors. All five canonical/
embedded pairs were compared; no differences. Release/0.6.x remains0829e892.

Read complete199-line correction02 prompt and current correction02 intake/
closing additions, complete six-path delta (duplicate mirrors excluded only
after byte comparison), full540-line suite in ranges1–185/185–365/365–540,
plus actual preparation/layout/scope/dispatch/default consumers. Prior30 HOLD,
readiness02 and all earlier evidence remain unchanged.

## Fresh reproduction

New owned roots `/private/tmp/lykn-arc05-s03-cdc/correction02/{xdg,tmp,npm}`
were precreated and assigned XDG_CACHE_HOME/TMPDIR/NPM_CONFIG_CACHE. DENO_DIR
remains the shared warm `/Users/oubiwann/Library/Caches/deno`. New M6 evidence
home here is precreated but unrun. `make fresh-artifacts` returned0 before
staged consumers (`fresh.log`, `fresh.status`).

Recompiled the unchanged prior `../compile-public.lykn` consumer using
`target/release/lykn compile <absolute-consumer-path> -o
target/arc05-s03-cdc/correction02/compile-public.js` (0). For each candidate
case, executed `deno run --config project.json -A <generated-consumer>
<deno-or-browser> <absolute-source-case> <target-output.mjs>` (each0), then
`deno run --no-config --no-prompt --no-npm --cached-only <target-output.mjs>`
(each0). Separate compile/runtime stdout/stderr/status receipts are retained
under each stem; all stderr streams are empty. Consequential generated ESM
copies and both Lykn source inputs are alongside them. No JavaScript helper
logic was authored; ESM is compiler output.

| Case | Facade/source | Runtime stdout |
| --- | --- | --- |
| bare-arrow-prefix | candidate public Deno | `2 99` newline |
| browser-bare-arrow-prefix | candidate staged browser compiler | `2 99` newline |
| escaped-arrow-prefix-control | candidate explicit kernel escape | `1 99` newline |
| baseline-bare-arrow-prefix | actual9e public Deno package | `1 7` newline |

The same user macro is declared in each input:
`(macro discardValue__private () \`(captured-one captured-two))`.
The ordinary arrow input uses `(=> (_) _)`; its candidate output is
`const arrow = (capturedOne, capturedTwo) => _;`. The escape control produces
`const arrow = discardValue__gensym0 => _;`. Baseline's length1/body7 is the
old literal underscore behavior; the macro did not intercept its parameter
list. Candidate discard semantics should change the body result to99 while
preserving length1 and structural parameter ownership.

The narrow baseline comparison reused the isolated9e package previously
materialized under ignored target (construction documented in
`../candidate30-source-first.md`) and its unchanged Lykn consumer. No checkout,
source/index change, baseline rewrite or new archive was made.

Independently ran `deno test --config project.json -A
test/forms/remaining-discard-bindings.test.js`:0,8 passed/0 failed (`new8.log`,
`new8.status`). The R01–05 controls now execute and pass, but this does not
cover the new R06 prefix interception. Full66, aggregate make check, actual
inner M6, citations and fresh size gates remain unrun on known-held source.

## Documentation accounting reconciliation

Read the root-attributed dated correction in S02 cdc-verification.md:399–413,
the new closing-report.md erratum and final04-commands.md opening note.
Retained old final04-make-check.stderr:168–177 actually lists nine no-block
inputs and Generated22 test files/482 blocks/15 skipped. Unchanged CLI
doctest.rs:685–697 excludes Annotation::Skip/Fragment from testable_count and
counts them separately. Thus482 executed/testable and15 annotated exclusions
are distinct from nine no-block inputs. Old erroneous prose and raw receipts
remain preserved. Current CC S03 make-check.log:5442–5451 has the same9/482/15
categories, and separately records1578 product tests/67steps,482 docs and the
unreachable-JSR self-skip. This is inspection of CC/raw historical evidence,
not a fresh independent full gate. No S02 source or status change is implied.

No product/test/Git/index/ledger edit was made. All commands completed; source
remains clean3d21eab5. Source/build returns to root with the consolidated HOLD.
