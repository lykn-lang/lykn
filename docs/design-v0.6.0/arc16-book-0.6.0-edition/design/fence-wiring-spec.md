# Spec — let `lykn test --docs` see the book's `lisp` fences

**For:** CC · **From:** CDC · **Date:** 2026-07-24
**Register:** `D-2607-R4NW` · **Blocks:** arc16 phase 2 (the book compile pass)
**Size:** small — one function, one flag, tests.

## The problem

`extract_blocks` (`crates/lykn-cli/src/doctest.rs:104`) matches only ` ```lykn `
and ` ```lykn,<annotation> `, and explicitly skips everything else:

```rust
if line.starts_with("```lykn") && !line.starts_with("````") {
    let annotation = if let Some(rest) = line.strip_prefix("```lykn,") {
        parse_annotation(rest)
    } else if line == "```lykn" {
        Annotation::Compile
    } else {
        // Something like ```lykn-foo — not our block
        i += 1;
        continue;
    };
```

The Lykn Book authors in ` ```lisp `, per B0-K and the Linguist deferral (through
0.6.0, lykn blocks use `lisp` because highlight.js knows `lisp` and doesn't know
`lykn`).

**Census of `~/lab/cnbb/lykn/src`:** 444 ` ```lisp `, 170 ` ```javascript `,
3 ` ```lykn `, 1 ` ```scheme ` (correct — actual Scheme, in the lineage chapter).

So the harness sees **three** of 444 blocks, and those three are in
`part6/chapter29/6-markdown-testing.md` — the chapter that teaches the doctest
feature. Everything else is invisible.

## Why this is worth doing carefully

The obvious fix — teach the extractor `lisp` unconditionally — is wrong, because
`lisp` is a *real language tag*. A `lisp` fence in some other document may be
actual Common Lisp or Scheme (the book already has a `scheme` block for exactly
this reason). Hard-coding `lisp` as "lykn" makes the extractor lie about a tag it
doesn't own.

## Recommended shape: an opt-in flag

Add a repeatable `--fence <tag>` to `lykn test --docs`, defaulting to `lykn`:

```sh
# unchanged default — the guides keep working exactly as today
lykn test --docs docs/guides/ --docs README.md

# the book, whose lykn blocks are tagged `lisp` through 0.6.0
lykn test --docs src/ --fence lisp
```

**Why this shape:**

- **No book churn.** 444 fences stay as authored; nothing to review, nothing to
  get wrong in a sed.
- **Doesn't pre-empt the 0.7.0 Linguist decision.** When ` ```lykn ` becomes a
  usable tag, the book migrates and drops the flag. The flag becomes vestigial
  rather than wrong.
- **The extractor never claims to own `lisp`.** It extracts what the *caller*
  says is lykn, which is true by construction.
- **Composes with annotations.** `--fence lisp` should accept
  ` ```lisp,compile-fail ` on the same `<tag>,<annotation>` grammar, so the book
  can mark intentional-error blocks the same way the guides do.

Rejected alternatives, for the record: hard-coding `lisp` (the extractor lies);
flipping the book to ` ```lykn ` (churns 444 blocks, loses syntax highlighting
until Linguist lands, contradicts a recorded decision).

## Implementation notes

- Generalise the fence match to a set of accepted tags rather than the literal
  `"```lykn"`, preserving the existing `!starts_with("````")` guard and the
  `<tag>,<annotation>` split.
- The `else { continue }` branch stays — an unmatched tag is still skipped, just
  against a configurable set now.
- Watch the prefix hazard: with `lisp` accepted, ` ```lisp-foo ` must still be
  skipped. The current code guards this by comparing the whole line for the bare
  case and requiring a comma for the annotated case; keep that discipline.
- `--fence` should be repeatable (`--fence lisp --fence lykn`) so a mixed tree
  works in one invocation.

## Tests

1. Bare ` ```lisp ` block extracted when `--fence lisp` is set; **not** extracted
   by default.
2. ` ```lisp,compile-fail ` gets `Annotation::CompileFail`.
3. ` ```lisp-foo ` is skipped even with `--fence lisp`.
4. Default behaviour byte-identical to today with no flag (regression guard —
   the guides' 472 doctests must not change).
5. Repeated `--fence` accepts both tags in one run.

## Scope

**Out:** any change to the book's fences; the Linguist submission; running the
book's blocks (that's arc16's own work — this spec only makes them *reachable*).

**Bar:** `lykn test --docs src/ --fence lisp` from `~/lab/cnbb/lykn` extracts on
the order of 444 blocks. It will report a large number of failures on the first
run — **that is the expected and desired outcome**, and it is the input to
arc16's compile pass, not a defect in this change.

## One thing worth knowing before the first run

Expect `D-2607-F6PA` to dominate the initial failures: six book sites use `try`
as an expression, which does not compile until DD-57's W-2 ships (decided for
0.6.0, 2026-07-24). Don't let those mask the rest — filter them out of the first
triage and treat the remainder as the real signal.
