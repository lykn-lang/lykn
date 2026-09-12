# arc16 slice11 - JS Overlap Compile Parity

Status: **Open**
Opened: 2026-09-12

## Capability

Fix or explicitly dispose `D-2609-FOVL`: the JS API path used by book doctests does not compile-reject overlapping multi-clause `func` definitions, while the CLI compile path rejects the same source. The book overlap chapter is skipped pending this parity fix.

## Scope

- Reproduce the overlap behavior through the JS API and the CLI compile path.
- Decide the correct 0.6.x behavior from the shipped language design and source guides.
- If the JS API is wrong, implement compile-time overlap rejection in the JS compiler path with regression coverage.
- Re-enable the overlap chapter examples as `lisp,compile-fail` when the doctest path can prove them.
- Update `D-2609-FOVL`, slice ledger/close artifacts, arc plan/status, project/status, and the next slice.

## Out of scope

- Broad multi-clause dispatch redesign.
- Language-surface chapter rewrites already handled in slice10.
- Final whole-book edition close; slice12 owns that after this blocker is fixed or explicitly disposed.

## Verification

Minimum expected gates if source changes:

- focused JS compiler regression for overlapping multi-clause `func` definitions;
- relevant source test target(s) in release/0.6.x;
- focused book doctest for `src/part2/chapter8/4-overlap.md` with `--fence lisp` proving `lisp,compile-fail` works;
- whole-book `lykn test --docs src --fence lisp` if the book chapter changes.

Run additional source gates as required by the touched implementation area. Preserve unrelated work and remove generated book `target/` unless intentionally tracked.

## Close conditions

- `D-2609-FOVL` is fixed or explicitly disposed with evidence.
- Book overlap examples no longer require a skip for JS API compile-time parity, unless an explicit accepted deferral says otherwise.
- Source and book verification results are recorded.
- Planning surfaces reflect whether slice12 edition close is ready.
