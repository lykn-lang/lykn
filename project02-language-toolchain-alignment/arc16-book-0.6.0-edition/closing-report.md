# arc16 - Lykn Book 0.6.0 Edition Closing Report

Date: 2026-09-12
Status: **Closed / CC proposed-done; CDC pending**

## Outcome

arc16 completed the Lykn Book 0.6.0 edition pass and release gate from CC's side. The book review surfaced and resolved language/toolchain defects before the release cut, then closed with whole-book build, EPUB, doctest, link/path, stale-caveat, and edition-metadata evidence.

The release branch remains at source commit `2a0cabf`, where slice11 fixed the final compiler/book parity defect (`D-2609-FOVL`). The book repo is at commit `de0342c`, which adds the final 0.6 edition metadata and Book Versions navigation. The writers-guide repo remains clean at `4ecd1cc`.

## Defect-routing result

| Finding | Final disposition |
| --- | --- |
| `D-2608-BINW` | Fixed in slice03; fresh scaffolds install `bin/lykn`. |
| `D-2608-TDSL` | Fixed in slice03; testing macros run through the scaffolded project path. |
| `D-2608-BREC` | Fixed in slice03; nested package sources build recursively. |
| `D-2608-RIMP` | Fixed in slice03; source-file `lykn run` resolves relative package imports from build output. |
| `D-2608-SOWN` | 0.6.0 floor fixed/routed in slice03 and book chapters; generated output ownership is explicit. |
| `D-2608-XPRT` | Fixed in slice04/slice10; module-local `(exports ...)` is the preferred named-export teaching surface. |
| `D-2608-LBND` | Fixed in slice04/slice10; grouped sequential `bind` is the related-local binding surface. |
| `D-2608-COND` | Fixed in slice04/slice10; `cond` is the flatter ordered predicate/result branching surface. |
| `D-2609-FNRT` | Fixed in slice08; JS path accepts `func` returning `fn` parity with CLI. |
| `D-2609-FOVL` | Fixed in slice11; JS path rejects overlapping multi-clause `func` definitions before dispatch emission. |

No additional release-blocking implementation or book-documentation defect remained after slice12. The final slice12 metadata gap was fixed directly in the book repo as book-only work.

## Final gate evidence

- slice11 source state: release/0.6.x clean at `2a0cabf`.
- slice12 book state: `/Users/oubiwann/lab/cnbb/lykn` main at `de0342c`.
- writers-guide state: `/Users/oubiwann/lab/cnbb/lykn-writers-guide` clean at `4ecd1cc`.
- `mdbook build -d book` passed; HTML output path `/Users/oubiwann/lab/cnbb/lykn/book/html`; EPUB output path `/Users/oubiwann/lab/cnbb/lykn/book/epub/Lykn.epub`.
- EPUB verification: edition marker present; 8 TTF fonts; `OEBPS/stylesheet.css`; 52 chapter images; cover assets; size 143,697,741 bytes.
- Whole-book doctest: `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn test --docs src --fence lisp` generated 177 test files with 428 blocks, 19 skipped, and passed 428/0.
- Link sweep: `missing_markdown_links 0`; `summary_missing_entries 0`.
- Stale-caveat sweep: no remaining `D-2609`, pending-fix, temporary-caveat, stale design-path, or old raw doctest command matches.
- Generated book `target/` was removed after doctests; the book repo's pre-existing untracked `_to_delete/` directory was preserved.

## Ledger row walk

- A-1 done: slice01 pre-book decision gate closed and CDC-verified.
- A-2 done: pre-book decisions and subsequent findings have final dispositions in the slice close reports and defect-routing table above.
- A-3 done: book and writers-guide instructions were reconciled and CDC-verified in slice05.
- A-4 done: the automated book fence gate landed in slice06 and is green at arc close.
- A-5 done: stale 0.5.x/tooling/book drift rows were fixed, no-op'd, or routed across slices07-12.
- A-6 done: chapters touched for 0.6.0 language/tooling changes match shipped behavior and are covered by whole-book doctests.
- A-7 done: final HTML and EPUB outputs build; EPUB contents were spot-checked.
- A-8 done: arc16 bubbles up to project02 and arc09; release planning is next.
- A-9 done: implementation-first sequencing was honored. Accepted 0.6.0 implementation findings landed before the book prose normalized the final surface.

## Handoff to arc09

arc09 is unblocked for release planning. It still owns version bumps, release notes, publish dry-runs, manual publication to JSR/npm/crates.io, release tags, and post-publish artifact/install verification. P-12 remains open until arc09 completes publication; P-20 is done from CC's side, pending CDC verification of this close.
