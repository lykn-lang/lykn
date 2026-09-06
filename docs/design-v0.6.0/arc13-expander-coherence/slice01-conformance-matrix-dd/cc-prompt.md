# CC Prompt — arc13 / slice01 · conformance-matrix + DD-60

**From:** CDC (Cowork) · **To:** CC (Claude Code, host) · **Date:** 2026-07-06
**Branch:** `release/0.6.x` (fresh branch or worktree — Duncan's call; git host-side).
**Re:** Your arc05/slice02 F-4 self-stop was the right call, and the
operator agreed with its implication: *"pause arc05 and fix the expander
divergence — this is a blocker… then we won't have to warn on all macro
names; we can just do the right thing."* **arc13 · expander-coherence** is
that fix. This slice is **recon-only**: turn your F-4 probe into the full
name-binding conformance matrix and draft **DD-60**, the semantics the
implementation slices will build to. **No compiler changes.**

## 0. Read first

- `…/slice01-conformance-matrix-dd/ledger.md` (5 rows) and `slice-doc.md`.
- Your own arc05/slice02 closing report F-4 — the seed matrix and the four
  behavior classes you found.
- `arc13/arc-plan.md` — the capability and the A-4/A-5 composition rows
  your matrix will eventually verify.

## 1. The work (MUST)

1. **F-1 — the full matrix, automated.** Extend your probe across: name
   classes (the **complete** surface-macro + classifier-form name sets —
   enumerate them from the source, don't sample; kernel form heads;
   `kernel:`-prefixed atoms; JS reserved words; ordinary names as
   controls) × binding positions (`func`/`fn`/`genfunc` params, `bind`,
   destructuring patterns, loop bindings, class fields) × reference
   positions (call-head, argument, nested-`fn` capture) × both backends.
   **Automate it** — a deterministic script that generates, compiles, and
   classifies each cell (calls-binding / macro-fires / throws /
   invalid-output / rejects-cleanly). It must re-run identically: it seeds
   slice03's conformance corpus and the arc's A-4 re-probe. Propose its
   home (fixture corpus vs `tools/`) — surface, don't decide.
2. **F-2 — DD-60 draft** (into `arc13/design/`): the semantics — **lexical
   bindings shadow macro/form dispatch within their scope** (standard Lisp
   lexical scoping); **JS reserved words are invalid lykn names** (compile
   error with diagnostic, every binding position — the ID-44 genus dies
   here); **DD-58's closed kernel namespace untouched**. Per-cell target
   behavior for every live cell (zero TBDs); edge cases named
   (user macros via `import-macros` — same shadowing rule; exported names —
   probe and propose); and the **breaking-change analysis**: the expected
   claim is "wrong-code rows become correct; nothing currently-correct
   breaks" — *verify that claim against the matrix*, don't assert it.
3. **F-3 — implementation recon + sizing.** Sketch where binding awareness
   attaches in each expander (Rust: the classifier sees param lists — how
   does dispatch learn them? JS: the `expandExpr` macro loop has no scope —
   binding-env threading vs a pre-pass?). Honest LoE per backend, and a
   **merge-or-split recommendation** for slices 02/03. This decides the
   arc's remaining shape — calibrate, don't soften.

## 2. Verify

`make check` ✓ unchanged (F-5); **empty diff on `crates/` + `packages/`**
(F-4 — probe artifacts live wherever F-1's home decision puts them); the
matrix re-run transcript matches itself.

## 3. Discipline

- **Recon only.** The temptation to fix the obvious cells is the exact
  thing this slice exists to resist — the fix without the DD is how the
  divergence happened in the first place.
- **Surface, don't decide:** shadowing granularity (whole-lexical-scope is
  DD-60's proposal — flag any cell where that surprises), exported-name
  coverage, probe home.
- `./bin/lykn` everywhere; rebuild-first.
- Leave `docs/design-v0.6.0/**` to CDC except your closing report
  (untracked, staging convention).

## 4. Close

`closing-report.md`: per-row walk (5 rows) + the matrix + DD-60 pointer +
the sizing recommendation + a **bubble-up to arc13** (anything the matrix
shows that DD-60's proposed semantics can't cleanly cover). → CDC
verification → **operator confirms DD-60** → slice02 (Rust) is scoped
against it. arc05 resumes (slice03 + the shrunken ID-42 question) when
this arc closes.
