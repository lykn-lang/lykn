# Slice 04: Language Surface Runway

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| F-1 | Required source and guidance read before implementation | closing report lists `AGENTS.md`, Lykn SKILL/guides, arc16 plan, slice01/slice02/slice03 close artifacts, discoveries, and relevant Rust/Deno guidance with one-line roles | serious | collaboration framework | open | | protects against syntax invention |
| F-2 | Scope fit is explicitly confirmed or split before compiler changes | closing report states whether XPRT/LBND/COND fit one slice; if not, no partial compiler implementation landed and new slice routes are named | serious | slice-doc | open | | no heroic half-slice |
| F-3 | `D-2608-XPRT` has a settled 0.6.0 compatibility policy | tests/docs show whether inline `(export (func ...))` remains accepted, deprecated/linted, or rejected; closing report names the policy and migration path | serious | operator feedback | open | | top-of-module exports are the target teaching shape |
| F-4 | Top-of-module export declarations work or are explicitly deferred | positive fixture with module-level export declaration checks/compiles and emitted JS exports the declared names; missing/duplicate/non-top-level cases have diagnostics or documented deferral | serious | `D-2608-XPRT` | open | | target syntax: `(exports name ...)` unless implementation justifies another spelling |
| F-5 | `mod.lykn` ownership is clarified relative to module exports | guide/SKILL or design text states whether `mod.lykn` is a package-entrypoint/barrel re-export layer, redundant, or replaced; tests cover the supported package API path if behavior changes | correctness | `D-2608-XPRT` | open | | no duplicate unexplained export story |
| F-6 | `D-2608-LBND` grouped binding syntax is settled | closing report states the final syntax and semantics: sequential vs simultaneous, typed pair support, destructuring support, shadowing, duplicate names, and earlier-binding visibility | serious | operator feedback | open | | user target shape extends `(bind ...)` |
| F-7 | Grouped bindings compile and preserve lexical binding rules | positive fixture emits/runs equivalently to consecutive binds; negative fixtures cover malformed groups and any chosen duplicate/shadowing diagnostics | serious | `D-2608-LBND` | open | | resolver behavior must not regress |
| F-8 | `D-2608-COND` branch syntax is settled | closing report states final `cond` syntax, expression vs statement semantics, required/default else behavior, and relationship to `?`, `if`, and `match` | serious | operator feedback | open | | target syntax: ordered predicate/result pairs plus `:else` |
| F-9 | `cond` compiles/runs in expression position and rejects incomplete value cases | positive validation fixture checks/compiles/runs; expression-position no-else or malformed clauses fail `check`/`compile` with clear diagnostics | serious | `D-2608-COND` + arc10 no-invalid-JS lesson | open | | no invalid JS emission |
| F-10 | Statement-position `cond` behavior is covered or explicitly out of scope | fixture or diagnostic proves statement-position behavior; if omitted, closing report explains why and routes re-entry before docs teach it | correctness | `D-2608-COND` | open | | avoid accidental expression-only teaching gap |
| F-11 | SKILL/guides reflect the accepted 0.6.0 language truth | `rg` sweep shows no newly rejected inline export, repeated-bind-as-idiom, or nested-validation-ladder guidance remains in touched/current guide surfaces; `make test-docs` passes | serious | arc16 A-9 | open | | do not start book prose with stale guide truth |
| F-12 | Standard release-worktree gates pass | `cargo fmt --check`; relevant cargo/CLI/form tests; `git diff --check`; `make check-cited-paths`; `make test-docs` | serious | AGENTS.md + arc16 | open | | exact command set depends on touched surfaces |

## What Worked

_(At slice close. Patterns that made the slice close cleanly.)_

## Closure

Closed at commit <SHA> on <date>. Verified by: <name/session>.
Rows: 12. Done: <n>. Deferred: <n>. No-op: <n>.
