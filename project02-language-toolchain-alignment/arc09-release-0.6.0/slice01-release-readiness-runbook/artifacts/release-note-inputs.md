# Release-note Input Inventory — 0.6.0

Date: 2026-09-12
Input window: local `0.5.2..release/0.6.x` (`HEAD` `d0bb981dae2a4abf6c984406c4b2081a45cc92f8`)

## User-visible release-note candidates

- Build and publish pipeline reorganization: generated dist staging, JSR/npm package generation, crates packaging, and a publish path that refuses dirty trees unless the operator explicitly chooses the risk.
- Type declaration generation from Lykn `:type` annotations, including single-file declaration emission and literal-type inference refinements.
- Compiler surface coherence: strict kernel/surface split, `kernel:` escape handling, `.lyk` kernel-only handling, removal of `_kernel` from ordinary user-facing form paths, and classifier/corpus gates that keep compiler surfaces aligned.
- Conditional and block semantics: position-aware `if` validation, missing-else expression diagnostics, and `do` block behavior aligned across compiler/runtime examples.
- JavaScript interop parity from the book refresh: JS function return parity and overlapping JavaScript function clause behavior are now explicit and tested/routed rather than left as prose drift.
- Source-only test build and test topology fixes: compiled test artifacts are staged under `target/lykn/test`, and the suite avoids double-running generated corpus files.
- Lykn source linter: `lykn lint`, source lint rules, and resolution-aware shadowing diagnostics.
- Cross-project dependency ergonomics: `lykn add`, `lykn link`, `lykn unlink`, specifier imports, version consolidation, and local link-registry behavior.
- Template/i18n example support using ICU-style examples and the associated README/docs refresh.
- Documentation and book refresh: guides, README, and the v0.6 book edition now align with the current language/toolchain surface and have mechanical fence-gate coverage.
- Run permission correction: `lykn run` no longer injects blanket Deno `-A` permissions; it exposes explicit scoped options and preserves the boundary between Deno options and script arguments.
- Deno compatibility floor: compatibility checks retain the Deno 2.3.1 floor, current stable `2.x`, and canary coverage.

## Breaking or compatibility notes to consider

- The 0.6.0 compiler surface is stricter than earlier development-era behavior. Kernel-only constructs and surface forms have clearer boundaries.
- Publish/dry-run checks deliberately preserve dirty-tree gates. A failed dirty-tree gate means the release tree must be cleaned, committed, or explicitly handled by the operator; the wrapper must not silently pass bypass flags.
- `lykn run` permission behavior changed from implicit broad permission grants to explicit opt-in permission flags. Existing commands that accidentally depended on blanket Deno `-A` must name the permissions they need.
- Unscoped `deno test --config project.json` is not the supported repository test command; use `deno test --config project.json -A test/` or the Makefile gates.
- Book Lykn fences remain tagged `lisp` through 0.6.0; `lykn` fence migration is deferred to a later release.

## Discovery rows and routed release context

| Discovery | Release relevance | Status for release notes/runbook |
| --- | --- | --- |
| `D-2608-XPRT`, `D-2608-LBND`, `D-2608-COND`, `D-2608-SOWN`, `D-2608-BINW`, `D-2608-TDSL`, `D-2608-BREC`, `D-2608-RIMP` | Book/source drift found during arc16 and routed or resolved before release readiness. | Mention only where the final behavior is user-visible; keep raw discovery mechanics out of public notes. |
| `D-2608-W2HF` | Missing-else `if` expression drift; corrected/routed by the book close sequence. | Include as conditional-expression diagnostic/semantics improvement if release notes have a compiler section. |
| `D-2609-FNRT` | JS function return parity found by book refresh. | Include under JS interop parity or compiler/runtime parity. |
| `D-2609-FOVL` | Overlapping JS function clause behavior surfaced by book refresh. | Include under JS interop parity or compatibility notes. |
| `D-2609-PERM` | Run-permission bug fixed at source commit `d0bb981`; CDC still pending in Project07 planning context. | Include as a release-note candidate only after the release line accepts that source commit. Do not claim Project07 CDC closure. |
| `D-2609-LINT`, `D-2609-NPMB`, `D-2609-JSER`, `D-2609-YNOD` | Project07 findings from the current planning worktree. | Not release blockers for Project02 0.6.0 as inventoried here; keep routed to Project07 unless later evidence shows they affect the release cut. `D-2609-JSER` is a book correction candidate, not a language artifact blocker. |

## Deferred/non-release items

- Do not present Project07 research dependency candidates as accepted 0.6.0 release dependencies.
- Do not promise `lykn` code-fence tagging in the book for 0.6.0; the accepted gate is `lykn test --docs src --fence lisp`.
- Do not treat current `make publish-dry-run` output as release evidence while it uses `--allow-dirty`.
- Do not imply external registry publication or release tags exist until the operator publication/tag slice records them.
