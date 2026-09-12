# arc16 slice08 - JS `fn` Return Parity Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| F-1 | Required language guidance and current compiler implementation are read before edits | closing report lists `AGENTS.md`, relevant Lykn JS/Rust guidance, `packages/lang` implementation files, Rust compiler path, and slice07 inventory with one-line roles | serious | `D-2609-FNRT` | open | | no source edits before grounding |
| F-2 | The Rust/JS mismatch is reproduced in focused tests or probes | closing report records Rust CLI success and JS compiler failure on the same `func` returning `fn` form | serious | slice07 probe | open | | establishes actual defect boundary |
| F-3 | Intended semantics are explicit | closing report names Rust behavior, JS behavior, or a deferred design choice as the selected source of truth | serious | compiler coherence | open | | prevents accidental prose workaround |
| F-4 | Implementation or deferral is scoped | diff shows only necessary compiler/tests/docs/planning files, or deferral records a re-entry condition | serious | project-management | open | | no broad chapter rewrite |
| F-5 | Affected book fence subset is rerun | command from book repo records current status for `chapter4/3-scope.md` and `chapter7/4-closures.md` | correctness | slice07 failure set | open | | validates the exposed examples |
| F-6 | Required lang gates pass | `cargo fmt --check`, `cargo test -p lykn-cli`, `deno test --config project.json -A test/`, `make test-docs`, `make check-cited-paths` | serious | AGENTS.md | open | | adjust only if no source changes occur |
| F-7 | Discovery and planning surfaces are updated | `D-2609-FNRT`, arc16 plan, project/status surfaces, ledger, and closing report reflect final disposition | serious | register routing rule | open | | close honestly |

## Closure

Open as of 2026-09-12. Rows: 7. Done: 0. Deferred: 0. No-op: 0. Pending: 7.
