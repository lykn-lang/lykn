# arc16 slice06 - Book Fence Reachability

> **Status:** Closed / CDC-verified on 2026-08-21.

## Goal

Make the Lykn Book's `lisp` fenced Lykn examples reachable through the normal
`lykn test --docs` doctest path without changing the book's fence tags.

This slice implements the fence-first route recommended by
[`design/fence-wiring-spec.md`](../design/fence-wiring-spec.md): add an opt-in,
repeatable fence-tag flag to the Rust CLI/doc-test runner, preserve today's
default behavior for `lykn` fences, and prove the sibling book can now expose
its `lisp` fences to automation.

The expected book-level outcome is **reachability**, not a clean book run. The
first whole-book run is expected to reveal many stale examples and known
language/tooling defects. Those failures are signal for later arc16 slices; this
slice is done when the harness can see the blocks and report them honestly.

## Scope

In scope:

- Read the collaboration framework, project-management, ledger, Rust, Deno/JS,
  Lykn SKILL/guide, lang `AGENTS.md`, arc16 plan, slice05 CDC verification,
  fence-wiring spec, Discovery Register row `D-2607-R4NW`, current doctest
  implementation, current CLI argument handling, book `AGENTS.md`, and
  writers-guide instruction surfaces before editing.
- Add a repeatable CLI flag for doc tests:

```sh
lykn test --docs PATH --fence TAG
```

- Preserve default behavior: with no `--fence`, only Markdown `lykn` fences are
  extracted, and current guide doctest counts must stay stable unless a
  deliberate docs change explains otherwise.
- Let `--fence lisp` extract Markdown `lisp` fences as Lykn blocks for the
  caller who opted into that tag.
- Let repeated flags accept multiple tags in one run, such as `lykn` plus
  `lisp`.
- Preserve the existing annotation grammar for additional tags, including
  `compile-fail`, `run`, `skip`, `fragment`, and `continue`.
- Preserve the prefix guard: accepting `lisp` must not accept tags such as
  `lisp-foo`.
- Keep HTML `<script type="text/lykn">` extraction behavior unchanged unless
  implementation analysis proves a minimal signature change is needed; if so,
  the behavior must still be covered by tests.
- Add focused Rust tests for extractor/tag matching and CLI/doctest flow.
- Add or update user-facing docs/guides for the new flag, including the current
  0.6.0 book command.
- Update book and writers-guide standing instructions so they no longer call
  the fence gate pending once this slice lands.
- Update `D-2607-R4NW` with the implemented route and remaining book-run
  re-entry condition.
- Run a book-level reachability command from the sibling book repo, capture
  extracted/generated/failing counts, and record the result in the closing
  report. A non-zero result from stale book examples is acceptable only if the
  report proves the failure happens after extraction and routes the follow-up
  work.
- Bubble the slice outcome through arc16/project/status surfaces at close.

Out of scope:

- Rewriting normal book chapter prose.
- Changing book code fences from `lisp` to `lykn`.
- Submitting or depending on GitHub Linguist changes.
- Making the full book doctest run pass by editing hundreds of examples.
- Implementing per-chapter drift fixes discovered by the new gate. New defects
  must be registered and routed as later slices or explicit deferrals.
- Replacing the doctest runner wholesale. Keep the change local to fence
  selection unless the existing shape proves insufficient.
- Weakening existing docs tests, cited-path checks, Deno permissions, or CLI
  safety behavior.

## Grounding

Current facts:

- The book intentionally uses `lisp` fences through 0.6.0 for highlighting.
- The sibling book currently contains 444 `lisp` fences and 3 `lykn` fences.
- The current Rust extractor only recognizes `lykn` Markdown fences.
- `D-2607-R4NW` is open and blocks the automated book compile pass.
- slice05 already updated sibling instructions to name this gate as pending and
  to route new book-discovered defects back to the lang Discovery Register.
- The book repo has a pre-existing untracked `_to_delete/` directory. Do not
  touch it.

## Verification Approach

The slice should produce evidence at three levels:

1. Unit-level extraction tests proving default, opt-in, repeated-tag,
   annotation, and prefix-guard behavior.
2. Lang-level integration tests/gates proving current docs behavior remains
   stable and the CLI accepts the new flag.
3. Book-level reachability evidence proving the sibling book's `lisp` fences are
   now visible to the doctest runner, even if the resulting run fails on stale
   examples.

The book-level command should be run from the sibling book repo using the
current lang binary. If the exact command needs a local path to the lang binary,
record it in the closing report.

## Exit Criteria

- `lykn test --docs` defaults still extract `lykn` fences only.
- `lykn test --docs --fence lisp` extracts `lisp` fences.
- Repeated `--fence` values compose.
- `lisp-foo` or other prefix-similar tags do not match accidentally.
- `lisp,<annotation>` uses the same annotation semantics as `lykn,<annotation>`.
- The sibling book's `lisp` fences are reachable and produce a durable failure
  inventory/count rather than being invisible.
- Book and writers-guide standing instructions name the landed gate honestly.
- `D-2607-R4NW` is no longer open without a route; any remaining book-run
  failures have named follow-up homes.
- Lang planning/status surfaces identify slice06 as implemented/closed only
  after CC closes it, and CDC verification remains separate.
