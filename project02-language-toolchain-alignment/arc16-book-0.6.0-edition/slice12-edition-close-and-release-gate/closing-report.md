# arc16 slice12 - Edition Close and Release Gate Closing Report

Date: 2026-09-12
Status: **Closed / CC proposed-done; CDC pending**

## Outcome

The Lykn Book 0.6.0 edition gate is satisfied from CC's side. The final book build produces HTML and EPUB, the whole-book `lisp` doctest gate is green, links and summary entries resolve, stale temporary caveats from the chapter-refresh work are gone, and the book now carries visible 0.6 edition metadata in front matter, navigation, generated page footer, and EPUB output.

No new implementation defect or release-blocking book/documentation defect remained after the edition metadata fix. arc16 is therefore closed as CC proposed-done, and project02 hands the 0.6.0 release back to arc09.

## Changes

Book commit: `de0342c` (`/Users/oubiwann/lab/cnbb/lykn` main)

- `src/fm/title-page.md` adds the `Lykn v0.6 edition` marker.
- `src/fm/copyright.md` adds the `Lykn · v0.6 edition` EPUB/front-matter marker.
- `src/book-versions.md` records the current edition and the `book-v0.6.0` tag/artifact path.
- `src/SUMMARY.md` adds Book Versions near Feedback.
- `theme/index.hbs` adds the quiet generated-page footer: `Lykn v0.6 edition · Book Versions · Feedback`.
- `css/custom.css` styles the footer unobtrusively.

No release-worktree source files changed in this slice, so `make check` was not rerun. The source gate remains the slice11 CDC-verified source state at `2a0cabf`.

## Verification

Starting state:

- release/0.6.x: clean at `2a0cabf`.
- planning: started at `eb200e5`.
- book: started at `43cfebc`, with pre-existing untracked `_to_delete/` preserved.
- writers-guide: clean at `4ecd1cc`.

Tooling:

- `mdbook v0.5.3`.
- `mdbook-epub 0.5.2`.
- all 8 configured EPUB font files present under `theme/fonts/`.

Build gate:

```sh
mdbook build -d book
```

Result: passed. The EPUB backend ran and wrote `/Users/oubiwann/lab/cnbb/lykn/book/epub/Lykn.epub`; the HTML backend wrote `/Users/oubiwann/lab/cnbb/lykn/book/html`. The only warning was the known mdbook-mermaid version warning: the preprocessor was built against mdBook 0.5.2 and was invoked by mdBook 0.5.3.

Generated output checks:

- HTML index contains the edition footer and links to `book-versions.html` and `feedback.html`.
- Generated `book-versions.html` contains `Lykn v0.6 edition` and `book-v0.6.0`.
- EPUB text contains an edition marker.
- EPUB archive contains 8 TTF font files, `OEBPS/stylesheet.css`, 52 chapter image assets, and cover assets.
- EPUB size after the metadata update: 143,697,741 bytes.

Whole-book example gate:

```sh
/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn test --docs src --fence lisp
```

Result: generated 177 test files with 428 blocks, 19 skipped; `ok | 428 passed | 0 failed (6s)`.

Fence inventory:

```text
4 bash
1 erlang
9 html
170 javascript
1 js
1 json
420 lisp
6 lisp,compile-fail
2 lisp,continue
3 lisp,fragment
16 lisp,skip
2 markdown
2 scheme
34 sh
17 text
1 yaml
```

No additional Lykn executable fence tag was present. The `lisp` gate covers the book's Lykn examples, including the `lisp,compile-fail` and `lisp,continue` cases; `lisp,fragment` and `lisp,skip` are intentionally excluded. The remaining `lisp,skip` sites are macro-context examples, kernel/internal sketches, and one reader AST sketch.

Link/path/version sweep:

- Markdown link sweep: `missing_markdown_links 0`.
- `SUMMARY.md` entry sweep: `summary_missing_entries 0`.
- stale-caveat grep for live `D-2609` caveats, pending routed fixes, temporary caveats, stale `docs/design-v` paths, and old raw book-test commands returned no matches.
- Edition metadata is present in source front matter, generated HTML, and generated EPUB.

Generated book `target/` was removed after the doctest run. The book repo's pre-existing `_to_delete/` directory was preserved.

## Ledger row walk

- E-1 done: starting heads and instructions were checked across release, planning, book, and writers-guide repos.
- E-2 done: HTML build passed and output path was recorded.
- E-3 done: EPUB build passed and archive contents were spot-checked.
- E-4 done: the whole-book `lisp` gate passed with 428/0 and 19 skipped.
- E-5 done: links, summary entries, and edition metadata were swept; the only detected gap was fixed in book commit `de0342c`.
- E-6 done: stale caveats and remaining skip sites were reviewed; no release-blocking contradiction remained.
- E-7 done: no new findings required a discovery row or slice13 after the metadata fix.
- E-8 done: arc16/project/arc09 status surfaces are updated in this closeout.
- E-9 done: generated `target/` was removed and unrelated book scratch was preserved.

## Arc handoff

arc16 is closed from CC's side as proposed-done. CDC verification is still pending. arc09 `release-0.6.0` is now the next Project02 arc for release planning, version bumps, release notes, dry-runs, publication, tags, and post-publish artifact verification.
