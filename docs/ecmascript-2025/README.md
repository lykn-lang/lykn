# ECMAScript 2025 Language Specification — split Markdown

A clean, chapter-split Markdown rendering of the ECMAScript® 2025 Language
Specification (ECMA-262, 16th edition, June 2025), derived from the official
single-page HTML (see Provenance for the source; it is not tracked in this
repo).

Optimised for reading, grepping, and loading one clause at a time.

## Layout

| File | Contents |
|------|----------|
| `INDEX.md` | Navigable table of contents: section number → title → file (clauses + 2 levels deep). Start here. |
| `function-heads.md` | Every clause heading shaped `Name ( params )` (1,165 of them) with the "*takes arguments … and returns …*" signature sentence. Purpose-built for auditing how operations declare and handle their parameters. |
| `00-front-matter.md` | Title page, "About", "Contributing", "Introduction". *(Contains some leftover UI chrome from the spec's interactive shell — see Caveats.)* |
| `NN-<slug>.md` | One file per top-level clause, `01`–`29`. |
| `annex-<x>-<slug>.md` | One file per annex, `A`–`F` (B is normative). |
| `zz-back-matter.md` | Bibliography, Colophon, Copyright & License. |

Heading depth mirrors the section number: `7` → `#`, `7.2` → `##`,
`7.2.12` → `###`. Un-numbered in-clause subsections (`Syntax`, `Definitions:`,
`[[GetPrototypeOf]] ( )`, …) nest one level under their enclosing clause.

## Pipeline

`regenerate.sh` runs the whole thing (`pandoc` ≥ 3, `perl`, `python3`):

1. **Pre-strip** the spec's cosmetic rendering spans with `perl`. Only two
   `<span>` classes are removed — `list-marker` (13,648; duplicate the ordered-
   list numbers pandoc already emits) and `item-toggle` (2,237; TOC chrome). A
   tag-census diff confirms *no other element type is touched*, and every
   removed span contained only a step marker or toggle glyph — zero prose.
   `secnum` spans are deliberately **kept**: they carry the canonical section
   numbers the leveling and cross-references depend on.
2. **Convert** to GFM with `pandoc -t gfm-raw_html --wrap=none
   --markdown-headings=atx --strip-comments`. `gfm-raw_html` drops unmappable
   raw HTML rather than embedding it (variant A left raw HTML on ~24k lines;
   this leaves 37, all bare-URL autolinks).
3. **Split & level** with `build_spec.py`: derive heading depth from section
   numbers, split one file per top-level clause/annex, emit `INDEX.md` and
   `function-heads.md`.

To regenerate this edition in place (auto-detects the sibling HTML, runs a
content-integrity self-check at the end):

```sh
./regenerate.sh                 # or: ./regenerate.sh path/to/spec.html
```

## Regenerating for a future edition (e.g. ES2027)

This directory is **self-contained**: the two scripts (`regenerate.sh`,
`build_spec.py`) that built this corpus live beside their output, frozen with
the exact ecmarkup conventions they target. A future edition gets its own
directory with its own copy — so a tweak needed for 2027's markup never
disturbs this 2025 corpus.

Step by step, for the 18th edition (ES2027):

1. **Get the source HTML.** Download the single-page rendering of the edition
   (see Provenance for the URL pattern) to
   `docs/ECMAScript-2027-Language-Specification.html`.
2. **Create the edition directory with a fresh copy of the tooling only:**
   ```sh
   mkdir docs/ecmascript-2027
   cp docs/ecmascript-2025/{regenerate.sh,build_spec.py} docs/ecmascript-2027/
   ```
   Copy *only* the two scripts — starting from an empty output dir avoids
   leaving stale chapter files if the edition's clause set changed.
3. **Run it:**
   ```sh
   cd docs/ecmascript-2027 && ./regenerate.sh
   ```
   It auto-detects `../ECMAScript-2027-Language-Specification.html`, builds the
   corpus, and runs the self-check. **A green `self-check: OK` line means the
   split reproduced the source content exactly** — the single most important
   signal that nothing broke. A `self-check: FAILED` prints the first
   divergence; do not trust the output until it passes.
4. **Sanity-check the ecmarkup assumptions held** (these are the things that
   drift between editions — see checklist below).
5. Write a `README.md` for the new dir (copy this one, update the edition,
   file/heading/function-head counts, and Provenance).

### ecmarkup-drift checklist

The pipeline hard-codes conventions of TC39's `ecmarkup` HTML generator. They
have been stable across recent editions, but verify each on a new one — if the
generator changed, the symptom is usually a *passing* self-check with wrong or
empty output, so check by eye too:

| Assumption | Where | How to verify on the new HTML |
|---|---|---|
| Cosmetic spans are `class="list-marker"` / `class="item-toggle*"` | `regenerate.sh` step 1 | `grep -oE 'class="[a-z-]*"' new.html \| sort \| uniq -c` — confirm those classes exist and are the step-number / toggle chrome |
| No `N. N.` duplicated list markers survive | after step 2 | `grep -cE '^[0-9]+\.[[:space:]]+[0-9]+\. ' flat.md` should be `0` (non-zero ⇒ a marker span wasn't stripped) |
| Numbered headings start with a section number | `build_spec.py` `SECNUM` | headings look like `# 7.2.12 IsLessThan …` |
| Annex roots read `Annex X (informative\|normative) Title` | `build_spec.py` `ANNEX` | `grep -E '^#+ Annex ' flat.md` — confirm the wording |
| Back-matter titles are Bibliography / Colophon / Copyright & Software License | `build_spec.py` `BACKMATTER` | check the tail headings; add any new ones to the set |
| Heading levels form a pyramid (not all `#`) | output | `cat *.md \| grep -oE '^#{1,6} ' \| sort \| uniq -c` |

## Caveats

- **Ordered-list lettering is lost.** The spec numbers algorithm steps
  `1.` / `a.` / `i.`; Markdown renumbers every nesting level from `1.`, so
  hierarchy survives as indentation but the `a`/`i` labels do not. Prose that
  cites "step 1.a.i" won't line up literally.
- **`\<` escaping.** pandoc escapes bare `<` as `\<` to avoid HTML-tag parsing.
  Harmless; renders as `<`.
- **Front-matter chrome.** `00-front-matter.md` still holds the interactive
  shell's leftovers (keyboard-shortcut list, a base64 menu icon, the full
  rendered TOC). `INDEX.md` supersedes that TOC; the chrome is inert noise.

## Provenance

Source: ECMA-262, 16th edition (ECMAScript 2025), June 2025 — the **single-page**
HTML rendering.

Ecma publishes each finalized edition at a version-numbered URL keyed to the
*edition* number, not the year:

| Year | Edition | Single-page HTML |
|---|---|---|
| ES2024 | 15th | `https://262.ecma-international.org/15.0/` |
| ES2025 | 16th | `https://262.ecma-international.org/16.0/` ← this corpus |
| ES2026 | 17th | `https://262.ecma-international.org/17.0/` |
| ES2027 | 18th | `https://262.ecma-international.org/18.0/` (when published) |

Save the single-page HTML (the multipage split will not work with this
pipeline). The always-current editor's draft lives at `https://tc39.es/ecma262/`,
but pin a finalized edition for a stable corpus. Confirm the exact URL when the
edition is published — the edition/year mapping is the reliable part.

© Ecma International. Reproduced here as reference material under Ecma's
copyright terms; see `zz-back-matter.md` for the notice and software license.
