# S02 existing ADT correctness ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| PC-01 | Original nested-constructor defect is repaired in both compilers | Unchanged balanced NPAT control prints 7; wrong inner/outer/literal controls reject | correctness-grade | D-2611-NPAT | open | — |
| PC-02 | Both zero-field spellings emit constant tagged values in both compilers | Unchanged ZVAR control exact typeof/JSON output and matching checks; fielded variants remain callable | correctness-grade | D-2611-ZVAR | open | — |
| PC-03 | Recursive pattern plans preserve observable semantics across affected paths | Native/public match, if-let and when-let; statement/value/protected routes; null/missing fields, falsy payloads, guard fallthrough, clause scope, registered/object getter order/once, transfer and hygiene regressions; public unregistered positional fallback compatibility check with its historical enumeration limitation | correctness-grade | Shared-helper source audit | open | — |
| PC-04 | Complete source gates and independent regression verification pass | Focused runtime regressions, make check, committed-HEAD cited-path gate, browser size gate; exact pins and failure dispositions | correctness-grade | Repository AGENTS.md | open | — |
| PC-05 | Durable handoff preserves scope, history and downstream obligations | Named source/planning commits, all five rows, independent review, retrospective and arc bubble-up; no qualified-feature or release integration claim | serious | Arc04/S01 | open | — |
