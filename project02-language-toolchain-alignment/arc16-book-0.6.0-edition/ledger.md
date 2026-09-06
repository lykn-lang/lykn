# Arc ledger

Extracted from arc-plan.md on 2026-09-06 without changing the historical rows, dispositions, or explicit not-yet-opened status.

## 6. Arc Ledger

Capability: the 0.6.0 Lykn Book edition is release-ready, and the book pass has
either fixed or routed every language/tooling defect it surfaced.

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| A-1 | slice01 pre-book decision gate closed | ptr: slice01 closing-report + cdc-verification | serious | arc-plan | **done** | [`slice01-pre-book-decision-gate/closing-report.md`](slice01-pre-book-decision-gate/closing-report.md) + [`slice01-pre-book-decision-gate/cdc-verification.md`](slice01-pre-book-decision-gate/cdc-verification.md); commit `00b3338` plus CDC follow-up | decisions before edits |
| A-2 | every pre-book decision gate has a final disposition | arc close: compare §5 gates with operator decisions and routed homes | serious | arc-plan | open | | no design silent drops |
| A-3 | book/writers-guide instructions are reconciled with the confirmed layout and current toolchain | read sibling `AGENTS.md`, writer-guide diffs, and slice02 close | serious | arc-plan | **done** | [`slice05-book-instruction-bootstrap/closing-report.md`](slice05-book-instruction-bootstrap/closing-report.md) + [`slice05-book-instruction-bootstrap/cdc-verification.md`](slice05-book-instruction-bootstrap/cdc-verification.md); book commit `4a82c62d97c15f3201e66d642c7270545bb1f45f`; writers-guide commit `491df62edb763a29981092be082ff7a6fcaace09` | instruction layer reconciled and independently verified |
| A-4 | book code fences/examples are reachable by an automated gate | run the chosen book fence/test command and record extracted/passing/failing counts | serious | `D-2607-R4NW` + B0-G | **done** | [`slice06-book-fence-reachability/closing-report.md`](slice06-book-fence-reachability/closing-report.md) + [`slice06-book-fence-reachability/cdc-verification.md`](slice06-book-fence-reachability/cdc-verification.md): CDC reproduced book `--fence lisp` at 176 files / 444 blocks / 417 passed / 27 failed and mixed `lisp` + `lykn` at 177 files / 447 blocks / 420 passed / 27 failed | class-(b) composition row reproduced by CDC; remaining failures route to slice07/new discoveries |
| A-5 | stale 0.5.x/tooling/book drift inventory rows are either fixed, no-op, or deferred with re-entry | arc close: compare refreshed inventory against slice closures | serious | inventory | open | | anti-silent-drop row |
| A-6 | chapters touched for 0.6.0 language/tooling changes match shipped behavior | chapter-scope tests plus source sweeps against current lang guides/SKILL | serious | P-20 | open | | reproduced at arc scale |
| A-7 | final book outputs build and render in supported formats | run mdBook HTML/EPUB build and any configured book checks | serious | P-20 | open | | include known EPUB workaround |
| A-8 | arc16 bubbles up honestly to arc09 | arc closing-report updates project-plan/status and names remaining blockers, if any | serious | project-management | open | | release gate |
| A-9 | implementation-first rule honored before book prose | arc close: show accepted 0.6.0 implementation findings from dogfood are closed or explicitly deferred before book/writers-guide/chapter slices depend on them | serious | operator clarification 2026-08-08 | open | slice02 closed/CDC-verified; slice03 closed/CDC-verified with `D-2608-BINW`, `D-2608-TDSL`, `D-2608-BREC`, `D-2608-RIMP`, and the 0.6.0 `D-2608-SOWN` floor implemented; slice04 closed/CDC-verified for `D-2608-XPRT`, `D-2608-LBND`, and `D-2608-COND`; slice05 added explicit defect-routing and implementation-first instruction rules; slice06 implemented the book fence gate and routed the first 27 failures to slice07/new discoveries | prevents prose from masking unsettled language |

