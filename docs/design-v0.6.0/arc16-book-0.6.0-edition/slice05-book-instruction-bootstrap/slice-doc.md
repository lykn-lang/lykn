# arc16 slice05 - Book Instruction Bootstrap

## Goal

Reconcile the standing book and writers-guide instructions with the current
0.6.0 implementation truth before chapter prose begins.

slice01 proved that the May book-update plan and writers-guide still carried
stale paths, stale test commands, missing test-suite assumptions, and an
unsettled planning-home story. slice02 through slice04 closed the accepted
implementation runway before prose. This slice now updates the instruction
surface that later book slices and CC prompts will imitate.

This is also where arc16 records the operator's current process rule: the book
pass is expected to discover more language, tooling, and DevX defects. That is
not a failure of planning. New defects should become new named discoveries and,
when needed, new implementation slices before the book teaches around them.

## Scope

In scope:

- Read current lang, book, and writers-guide instructions rather than trusting
  the historical inventory as live truth.
- Reconcile stale writers-guide paths from the old `~/lab/oxur/lykn/` layout
  to the active lang repo and release worktree.
- Update writers-guide testing instructions away from raw `deno test
  test/book/` as the universal gate. If the final book fence gate is not yet
  implemented, state the current placeholder honestly and point at slice06 /
  `D-2607-R4NW` as the gate home.
- Preserve the 0.6.0 ` ```lisp ` fence tag rule while making clear that
  automated reachability is pending the fence slice.
- Reconcile compiler architecture wording with the current Rust CLI plus
  JS/Deno compiler split.
- Reconcile package/source ownership wording with slice03's 0.6.0 floor and
  avoid implying that user-owned non-Lykn source files are forbidden.
- Reconcile export, grouped `bind`, and `cond` authoring guidance with
  slice04's shipped 0.6.0 surface.
- Preserve `AGENTS.md` as the canonical instruction filename and `CLAUDE.md`
  as a compatibility symlink in the book and writers-guide repos.
- Decide and document the planned-ToC handling for this bootstrap slice:
  preserve the current `planned-toc.md` as historical v2 input and either
  create/update a current 0.6.0 ToC planning artifact or explicitly defer that
  artifact with a named re-entry condition.
- Add a durable defect-routing rule for book work: when the book pass exposes
  unwanted or incorrect 0.6.0 behavior, route it to the lang Discovery Register
  and open a new slice or explicit deferral before prose normalizes the defect.
- Update lang arc16/project/status surfaces to reflect the slice close and any
  newly routed follow-up work.

Out of scope:

- Editing normal book chapter prose.
- Implementing `lykn test --docs --fence` or any other fence reachability
  change. That belongs to slice06 unless this slice proves the sequencing must
  change.
- Building the final HTML/EPUB outputs.
- Full chapter drift refresh, current-book inventory rewrite, or language
  chapter updates. Those remain later slices.
- New Rust/JS/Lykn compiler behavior, except for trivial documentation typo
  fixes in lang if CC discovers one that blocks the instruction work.
- Moving sibling repo planning artifacts into the book or writers-guide repos.
  The plan-of-record remains in this lang arc16 directory.

## Grounding

Known current-state facts from prior slices and CDC's opening read:

- `/Users/oubiwann/lab/cnbb/lykn/AGENTS.md` already records that arc16 planning
  lives in the lang repo, `workbench/` is scratch, and `CLAUDE.md` is a symlink
  to `AGENTS.md`.
- `/Users/oubiwann/lab/cnbb/lykn-writers-guide/AGENTS.md` records the same
  split planning home and scratch rule, but `authoring-guide.md` and
  `new-ch-prompt.md` still contain stale old lang paths, raw Deno test commands,
  and assumptions about an absent external book test suite.
- The book repo currently has an untracked `_to_delete/` directory; this slice
  must avoid touching unrelated user work.
- Through 0.6.0, the book intentionally uses ` ```lisp ` fences for Lykn
  examples. The automation gap is that current `lykn test --docs` only sees
  `lykn` fences and has no `--fence` flag yet.
- slice03 closed the 0.6.0 project/scaffold/source-ownership floor.
- slice04 closed `(exports ...)`, grouped sequential `bind`, and `cond` for
  the 0.6.0 language surface.

## Expected Result

At close, a fresh CC chapter-writing session should learn the right things from
the standing instructions:

- Planning and close artifacts live in lang arc16, not book/writers-guide
  scratch directories.
- `AGENTS.md` is canonical; `CLAUDE.md` remains a symlink for compatibility.
- Book code fences stay `lisp` for 0.6.0, with the pending automated fence gate
  named and routed.
- Normal project commands use `lykn` wrappers where Lykn owns the workflow.
- New module examples prefer top-level `(exports ...)`, grouped `bind` for
  related locals, and `cond` for ordered validation branches.
- The book pass is allowed, and expected, to discover additional defects. Those
  defects must be routed as discoveries and slices; they must not be hidden in
  prose or treated as "too late" by default.

## Verification

Minimum lang planning/docs gates:

- `git diff --check`
- `make check-cited-paths`
- `make test-docs`

Minimum sibling repo gates:

- `git status --short --branch` before and after edits in both sibling repos.
- `git ls-files -s AGENTS.md CLAUDE.md` and `readlink CLAUDE.md` in both
  sibling repos.
- Targeted `rg` sweeps proving stale paths, stale raw Deno test commands,
  stale absent-test-suite claims, and stale surface examples were removed or
  explicitly retained as historical material.
- Any configured book/writers-guide formatting or build checks that already
  exist and are appropriate for instruction-only changes. If none exist, say so
  in the close.

## Exit Criteria

- The ledger rows all reach a final status with evidence.
- The book and writers-guide instruction surfaces reflect current 0.6.0 truth
  and the split-by-design planning layout.
- Stale historical inventory rows that this slice can close are closed or
  routed; rows that remain open have named homes and re-entry conditions.
- The "book findings may spawn new implementation slices" rule is explicit in
  the updated instructions and arc16 bubble-up.
- The closing report states whether slice06 `book-fence-reachability` remains
  next, or whether this slice surfaced a higher-priority implementation slice.
