# S02 JSON files and modules ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| FM-01 | JSON file edit changes only n in the value tree and retains exact keys | Successful read/write plus parsed original/output and complete J-08 key comparison | correctness-grade | AT-01, J-01/08 | open | — |
| FM-02 | Expected read/parse failures preserve an existing destination | Malformed/missing input, exact result and pre/post physical file bytes under declared permissions | correctness-grade | AT-01, J-03/17 | open | — |
| FM-03 | Two actual modules preserve visible public ADTs and imported matching | Compile and execute real decoder/caller files with exports, constructors and match | correctness-grade | AT-04, L-05 | open | — |
| FM-04 | Async rejection remains an explicit result at the consumer | Real failed asynchronous read, awaited result and cleanup observations | correctness-grade | AT-04, L-05 | open | — |
| FM-05 | Original authoring, formatting, assertions and references survive | Both original responses and sources, fixed file matrix, actual loaded references, source check/lint and paired formatting/behavior with default/stripped conditions | correctness-grade | AE01, L-06/07 | open | — |
