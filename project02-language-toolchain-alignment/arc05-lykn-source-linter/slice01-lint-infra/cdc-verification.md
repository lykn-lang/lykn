# Slice 01: lint-infra — CDC Verification

**By:** CDC (Cowork) · **Date:** 2026-07-06
**Verdict: accepted — slice01 closed.** `lykn lint` is real end-to-end; the
F-1 verification table is the authoritative slice02 contract and caught one
already-enforced rule (ID-39 out), one stale guide rationale (ID-42), and
one **compiler bug** (ID-44: rc=0 + unparseable JS). Operator decisions
taken at scoping (below) reshape the corpus to 12 lint rules + 2 compiler
fixes for slice02.

## Verification (git + code review + grep; runtime CC-attested)

Commit: **`1989138` at `release/0.6.x` tip.** Diff: 6 files, +790/−12
(lint module 309+97 lines, 2 snapshots, `main.rs` CLI, the closing report).

| Row | How CDC verified | Strength |
|-----|------------------|----------|
| F-1 | Table complete: 19/19 candidates, count reconciles with DD-59; 18 IN / 1 OUT; three flags each with transcripts. The prompt's ID-44/45/46 watch paid off exactly as designed. | reproduced (read; transcripts attested) |
| F-2 | **Code-reproduced**: `LintRule` trait `enter`/`exit` both `&mut self` (stateful-capable ✓); parent-context stack with `parent()`; the currently-unused fields are `#[allow(dead_code)]` **with the disclosed forward-reference comment** naming consuming slices — buried-intent discipline honored at write time. | reproduced (code) |
| F-3 | Stub text grep = **0**; CLI accepts files/dirs, `.lyk` exempt (recorded as a design call); exit 0/1/2 and JSON shape attested with demos. | reproduced (grep) + attested |
| F-4 | 3 shape-diverse pilots; 9 assertion tests both directions; span-at-head-atom precision pinned. | reproduced (code) + attested |
| F-5 | Both snapshots committed; review-then-accept process documented (`INSTA_UPDATE=no` first). | reproduced (files) + attested (process) |
| F-6 | `make check` ✓ (~1m16s), suites unchanged, +11 Rust tests; smoke dogfood 117 files / 0 findings / no crash — correctly read as "narrow pilots on a clean corpus," not overclaimed. | attested |

Rows: 6/6. Done: 6. Deferred: 0. No-op: 0. **No silent drops.**
Convention note (minor): the closing report rode the source commit rather
than the staging pass — harmless; noted so the seam stays deliberate.

## Operator decisions at slice02 scoping (2026-07-06)

1. **ID-44 → fix the compiler** (Principle 3: no silent invalid output at
   rc=0). The for-of binding validator rejects const-wrapped bindings with
   a proper diagnostic — making guide-09's "Throws" claim true. ID-44
   leaves the lint corpus. **Both compilers must be checked** (DD-58
   lesson: enforcement is per-backend — the JS compiler's behavior on the
   same input is unverified).
2. **ID-42 → disallow at compile time, recon-gated** (operator: "why don't
   we simply disallow it?"). CDC concurs with reason: the F-1 transcript
   shows a param named `fn` *semantically shadows the special form* inside
   its body — a footgun, not just style. Recon must settle the reserved
   set (the dangerous shadowers, not all form heads) and blast radius on
   both compilers; lint-warn is the measured fallback if the radius is
   large. ID-42 leaves the lint corpus pending recon.

**Slice02 corpus: 12 lint rules** (18 − 3 pilots − shadowing[slice03] −
ID-44 − ID-42) **+ 2 recon-gated compiler fixes.** DD-59 draft gets an
addendum note at arc close.

## Bubble-up check

Delivered its assigned piece: yes — machinery + pilots + the verified
corpus, exactly the arc-plan's slice01 line. Silent-drop diff clean.
arc-plan change: **yes** — v1.3 records the two decisions and the corpus
reshape (done this pass).

## Disposition

**slice01 closed.** Next: slice02 (`shape-rule-corpus`) — open set written
against the F-1 table + the two decisions; the compiler fixes are
recon-gated rows with self-stop.
