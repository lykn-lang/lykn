# arc16 slice12 - CDC Verification

Verified by CDC on 2026-09-12.

## Verdict

slice12 is **CDC-verified closed**. arc16 composes and is **closed /
CDC-verified**.

CDC reproduced the final edition gate instead of treating CC's close as
accepted: the book builds HTML and EPUB, the generated outputs carry the 0.6
edition metadata, the whole-book `lisp` doctest gate passes, link and stale
caveat sweeps are clean after excluding code examples from link resolution, and
the release handoff to arc09 is the correct remaining Project02 route.

## Reproduced Evidence

| Check | CDC result |
|-------|------------|
| Book commit scope | `de0342c` changes only book edition metadata, navigation, footer styling/template, and `src/book-versions.md`; both co-author trailers are present. |
| Planning commit scope | `0261421` adds slice12 and arc16 close reports, closes P-20 from CC's side, and moves Project02's current arc to arc09; both co-author trailers are present. |
| Starting repo state | `release/0.6.x` clean at `2a0cabf`; planning clean at `0261421`; book clean except pre-existing `_to_delete/`; writers-guide clean at `4ecd1cc`. |
| Book build | `mdbook build -d book` passed. HTML was written to `book/html`; EPUB was written to `book/epub/Lykn.epub`. The only warning was the known mdbook-mermaid 0.5.2 versus mdBook 0.5.3 warning. |
| Generated HTML | `book/html/index.html` and `book/html/book-versions.html` contain `Lykn v0.6 edition`, `Book Versions`, `Feedback`, and `book-v0.6.0` where expected. |
| Generated EPUB | `book/epub/Lykn.epub` exists and contains edition metadata, the `book-v0.6.0` marker, 8 TTF fonts, `OEBPS/stylesheet.css`, and cover assets. |
| Whole-book doctest | `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn test --docs src --fence lisp` generated 177 test files with 428 blocks, 19 skipped, and passed 428/0. |
| Link sweep | Code-aware Markdown link sweep reported `missing_markdown_links 0`; the initial naive sweep's only hit was the literal inline-code example `[text](url)`. |
| SUMMARY sweep | `summary_missing_entries 0`. |
| Stale-caveat sweep | Book source had no `D-2609`, pending-fix, temporary-caveat, stale `docs/design-v`, or old raw `deno test test/book` matches. Instruction-file hits were negative guidance, not active stale commands. |
| Hygiene | Book changed-file `git diff --check` passed; planning `git diff --check` passed; generated book `target/` was removed after doctests. |

## Ledger Disposition

| Row | CDC disposition |
|-----|-----------------|
| E-1 | Accepted. CDC re-read the repo instructions and confirmed the starting statuses across release, planning, book, and writers-guide repos. |
| E-2 | Accepted. The HTML build passed and generated the expected output path. |
| E-3 | Accepted. The EPUB backend ran through `mdbook build -d book`, produced `Lykn.epub`, and the archive spot-check found the expected metadata and assets. |
| E-4 | Accepted. The whole-book `lisp` gate passed at 428/0 with 19 skipped blocks. |
| E-5 | Accepted. Code-aware link and SUMMARY sweeps are clean, and edition metadata is present in source and generated outputs. |
| E-6 | Accepted. Stale caveat/source sweeps found no release-blocking contradiction. Negative instruction-file references to old gates remain appropriate guidance. |
| E-7 | Accepted. CDC found no new implementation or release-blocking book defect requiring slice13. |
| E-8 | Accepted. This verification updates the remaining CDC-pending surfaces and opens arc09 slice01 for release readiness planning. |
| E-9 | Accepted. Generated doctest `target/` was removed, and unrelated book `_to_delete/` was preserved. |

## Arc Composition

Arc16 promised a 0.6.0 book edition that reflects shipped behavior, verifies
touched Lykn examples, reconciles book/writers-guide instructions, fixes or
routes dogfood/book-discovered defects, and records final HTML/EPUB/link/path
evidence. The verified slice set composes into that capability:

- slices01-02 established the decision/dogfood runway;
- slices03-04 landed the accepted 0.6.0 implementation work before prose;
- slices05-06 reconciled standing instructions and made book fences reachable;
- slices07-11 refreshed book drift and fixed the two final JS/compiler parity
  defects before final prose was treated as true;
- slice12 built and checked the final book edition and found no remaining
  release-blocking defect.

P-20 is therefore done. Project02's remaining open work is arc09/P-12: release
planning, version bumps, release notes, dry-runs, publication, tags, and
post-publish artifact/install verification.

## Final State

- `release/0.6.x` remains clean at `2a0cabf`.
- The book repo remains clean except for the pre-existing untracked
  `_to_delete/`.
- The writers-guide repo remains clean at `4ecd1cc`.
- Planning is updated by this CDC close and opens arc09 slice01
  `release-readiness-runbook`.
