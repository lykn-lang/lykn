# CC Prompt — Verify `09-anti-patterns.md` against the real compiler (report, don't fix)

**From:** CDC (Cowork) · **To:** CC (Claude Code, host) · **Date:** 2026-06-30
**Branch:** `release/0.6.x` (read/compile only; no edits — **write a report**, like
the CI report). Rebuild-first (`cargo build --release && export
LYKN_BIN=$(pwd)/target/release/lykn && "$LYKN_BIN" build`).
**Why:** `docs/guides/09-anti-patterns.md` is the seed corpus for arc05's
`lykn lint`. Before we build rules on it, two things need ground-truth *from the
compiler* (not from prose): (A) are the "ELIMINATED by language design" entries
*truly* impossible, and (B) the ID-38 kernel-forms-in-surface reality vs DD-58
strict mode. CDC will plan the resulting guide edits (arc07) + corpus (arc05) from
your report.

## Task A — Verify the 12 `ELIMINATED` entries are truly impossible

The guide marks these as "ELIMINATED BY LANGUAGE DESIGN": ID-01 (`==`), 07
(method extraction loses `this`), 08 (fn-as-callback `this`), 09 (arrow-as-method
`this`), 10 (`var` in loops), 11 (accidental globals), 13 (`var` hoisting), 15
(`bind` = deep-immutable confusion), 28 (`var` anywhere), 30 (`arguments`), 32
(IIFEs), 33 (`require()`).

For **each**, try to actually express the anti-pattern in **surface lykn** and
compile it. Classify:
- **TRULY-ELIMINATED** — the construct doesn't exist / is unreachable in surface,
  or compiling it errors. (e.g. is `var` even a reader/expander form? can you
  write `this` in surface and does it error? can you produce a bare global
  assignment?)
- **LEAKS** — you *can* still express it in surface (→ the "eliminated" claim is
  false; a real gap worth flagging).
- **PARTIAL / NUANCED** — eliminated in surface but reachable via `kernel:` /
  `js:` escape, or true only under some mode.

Record the exact snippet you tried + the compiler's response per entry.

## Task B — Resolve ID-38 (kernel forms in surface) vs DD-58 strict mode

The guide (ID-38, **SHOULD-AVOID**) says `(const x 42)`, `(=== a b)`, `(&& x y)`
in surface "work but aren't idiomatic." But DD-58's draft says strict enforcement
"turns on once DD-37's classifier lands" (it has). Determine the **actual**
behaviour on `release/0.6.x`:

1. Does `(const x 42)` / `(=== a b)` / `(&& x y)` in a `.lykn` surface file
   **compile**, **error**, or **require** `(kernel:const …)`?
2. Is DD-58 **strict mode default-on**, opt-in, or tests-only? (M18 added the flag;
   M19 enforced it *for tests* — is it on for ordinary compilation?)
3. Guide 09's ID-38 block is an *uncommented* `lykn` doctest and guide 09 is
   **green** in CI. Are those lines actually executed, and if so, how do they pass
   if bare kernel forms are meant to be rejected? **This is the key question:** if
   DD-58 says "prohibited" but the doctest passes, either the guide is right
   (strict mode isn't on for surface) or **strict mode isn't being enforced when
   it should be — a real bug.** Tell us which.

## Report (write to `workbench/cc-anti-patterns-verification-2026-06-30.md`)

1. **Task A table:** per entry — snippet tried, compiler response, classification
   (truly-eliminated / leaks / nuanced), and a one-line recommended disposition
   (safe to remove from the guide / relocate to a "what lykn eliminates" note /
   keep — it actually leaks).
2. **Task B verdict:** the actual kernel-forms-in-surface behaviour, whether
   strict mode is on, and — decisively — whether ID-38 is (a) an accurate lint
   rule, (b) now a compiler error (so guide should say so), or (c) a **strict-mode
   enforcement bug** (prohibited-but-passing).
3. **Anything else** you notice that's stale vs shipped 0.6.0 while you're in there.

Do **not** edit the guide or the compiler — report only. CDC routes the outcomes:
guide edits → arc07; corpus curation → arc05; any compiler defect → a new finding.
