# arc16 slice11 - CDC Verification

Verified by CDC on 2026-09-12.

## Verdict

slice11 is **CDC-verified closed**.

CDC reproduced the behavioral claim behind `D-2609-FOVL`: the JS API path now
compile-rejects overlapping same-arity compatible multi-clause `func`
definitions before dispatch emission, matching the CLI compile path used by
the language surface. The book overlap examples are restored as executable
`lisp,compile-fail` examples and the whole-book `lisp` fence gate remains
green.

## Reproduced Evidence

| Check | CDC result |
|-------|------------|
| Source commit scope | `2a0cabf` changes `packages/lang/classifier.js` and `test/forms/language-surface-runway.test.js`; the commit has both required co-author trailers. |
| Book commit scope | `43cfebc` updates only `src/part2/chapter8/4-overlap.md`; the commit has both required co-author trailers. |
| Planning close scope | `f50d2c7` closes slice11 from CC's side and opens slice12; the commit has both required co-author trailers. |
| Focused JS regression | `deno test --config project.json -A test/forms/language-surface-runway.test.js` passed: 7/0. |
| Canonical source gate | `make check` passed on `release/0.6.x`; the earlier sandbox-only npm-log failure was not reproduced outside the sandbox. |
| Manual CLI probe | `bin/lykn compile /private/tmp/overlap-fovl.lykn` exited 1 with `bad: clauses 0 and 1 overlap (same arity 1, compatible types)`. |
| Manual JS API probe | `packages/lang/mod.js` through Deno threw the same overlap error instead of returning generated dispatch code. |
| Focused book gate | `lykn test --docs src/part2/chapter8/4-overlap.md --fence lisp` generated 1 file from 4 blocks, 0 skipped, and passed 4/0. |
| Whole-book book gate | `lykn test --docs src --fence lisp` generated 177 files from 428 blocks, 19 skipped, and passed 428/0. |
| Whitespace/status hygiene | Source and book touched-file `git diff --check` passed; planning `git diff --check` passed; planning status JSON parsed. |

The generated book `target/` directory was removed after the doctest gates. The
book repo's pre-existing untracked `_to_delete/` directory was preserved.

## Ledger Disposition

| Row | CDC disposition |
|-----|-----------------|
| O-1 | Accepted. The close packet records the original path mismatch; CDC reproduced the post-fix CLI and JS API rejection on a fresh throwaway fixture. |
| O-2 | Accepted. The fixed JS behavior matches the CLI's compile-time overlap error semantics. |
| O-3 | Accepted. The JS classifier now checks same-arity compatible clause types before dispatch emission, and the focused regression suite covers duplicate typed overlap, `:any` overlap, and destructured-object overlap. |
| O-4 | Accepted. The book chapter no longer carries the temporary caveat; focused doctest execution passed with all four blocks runnable. |
| O-5 | Accepted. CDC reproduced the focused source regression, canonical source gate, focused book gate, whole-book book gate, and hygiene checks. |
| O-6 | Accepted. Generated book output was removed; unrelated `_to_delete/` and project07 planning artifacts were preserved. |
| O-7 | Accepted. CDC updated this verification note and the slice/arc/project/status surfaces while leaving unrelated project07 discovery work unstaged. |

## Final State

- `release/0.6.x` is clean at `2a0cabf`.
- The book repo is clean except for the pre-existing untracked `_to_delete/`.
- The writers-guide repo is clean and unchanged.
- The planning worktree carries this CDC close update; unrelated project07
  discovery work was observed and intentionally left out of slice11 staging.

slice12 `edition-close-and-release-gate` remains the next open arc16 slice.
