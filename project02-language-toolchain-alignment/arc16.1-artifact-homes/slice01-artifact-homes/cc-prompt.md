# CC prompt — `02-artifact-homes`

**From:** CDC · **Date:** 2026-07-25 · **Branch:** `main` (== `release/0.6.x` @
`cff68b5`) · **Size:** small — one check, wired into `make check`, plus tests.

CDC has already landed the documentation half (L-1…L-6, L-9 — see `ledger.md`).
**Your rows are L-7 and L-8.** Everything else is context.

## L-7 — the dangling-path gate

**Spec revised 2026-07-25 — read `ledger.md`'s amendment section before starting.**

Add a check that **fails `make check` when a tracked document cites a
repo-relative path that does not resolve in git *on that document's own
branch*.** Resolve against `git ls-tree HEAD` — **not** `--all`, **not** the
working tree. A file that exists on another branch must fail on this one; that
is the point, not a false positive.

Why this row exists: `backlog/discoveries.md` was cited by **five committed
documents** while the file itself sat in a gitignored tree. Nobody typed a wrong
path — the agreed home was simply never created. A cited path is a claim, and it
was going unchecked. This is `D-2607-Z5KN` ("the uncovered case is reliably the
one that ships wrong") applied to our own documentation.

Shape, to your judgment:

- Input: tracked `*.md` (and `status.html`) under `docs/`, plus root `AGENTS.md`.
- Extract candidate repo-relative paths — backticked paths, markdown link
  targets. Be deliberate about the extraction rule and **write down what it
  deliberately does not catch**; a check that silently under-matches is exactly
  the failure mode we are closing (`D-2607-B8SY`: a test that overclaims is
  worse than a missing test).
- Resolve against **git**, not the working tree — an untracked file present on
  disk must still fail. That distinction *is* the bug this catches.
- Report `file:line` and the offending path. Exit non-zero.
- Wire into `make check` (the canonical bar) — not a separate target.

**Seeded-failure demo is a hard requirement.** Add a bogus citation, show red;
remove it, show green. Green with nothing seeded proves nothing.

## L-8 — sweep the corpus, and the exemption question

Run the check over HEAD and walk the output. Expect a real class of hits:
**closed historical documents cite paths verbatim by project convention**, and
some of those paths have since moved. Known example:
`project02-language-toolchain-alignment/arc03-compiler-coherence/design/phase-2-divergence-catalog.md:234`
cites `workbench/book-drift-inventory-0.6.0.md`, which this slice moved to
`arc16-book-0.6.0-edition/design/`.

**Resolved 2026-07-25 — the operator has decided, so this is no longer yours to
surface.** Disposition: **option (a), accept and mark**; the historical corpus is
not salvaged. Build the **frozen census allowlist** specified in `ledger.md`'s
second amendment: generated once from the 143 paths × 106 files, matched on the
exact `(file, path)` pair, **never appended to**. A blanket `workbench/`
exemption is explicitly rejected — new `workbench/` citations must still fail.

What *is* still yours to surface: the other three exemption classes (shorthand
fragments like `ast/sexpr.rs`, pre-restructure paths like `src/surface.js`,
out-of-repo symlinks under `assets/ai/`). Bring the census and your
recommendation for those.

## Standing

- `./bin/lykn`, never bare `lykn`. `make check` is the bar (~1m04s).
- Do not weaken an existing gate to make a new one pass (`AGENTS.md` §Lykn CLI
  safety gates).
- Five-iteration budget; **self-stop and write a handoff if a premise cracks.**
  Every time you have pushed back on CDC, you have been right — including twice
  in one day on arc06. Do it again if this smells wrong.
- CDC does not run the toolchain (no cargo/deno in the sandbox), so L-7's green
  is **CC-attested** and reconciles on the operator's host.
