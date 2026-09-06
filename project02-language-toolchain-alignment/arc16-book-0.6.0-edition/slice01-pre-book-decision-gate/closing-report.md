# arc16 slice01 - Pre-Book Decision Gate Closing Report

## 1. Source Material Read

### Required slice sources

| File | Role in this closeout |
|------|-----------------------|
| `AGENTS.md` | Repository operating rules, commit trailers, arc16 split between lang planning and sibling book/writers-guide content, and `workbench/` scratch rule. |
| `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/arc-plan.md` | Arc capability, provisional slice map, decision gates, and arc ledger context. |
| `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice01-pre-book-decision-gate/slice-plan.md` | Slice scope, exit criteria, and required close-set shape. |
| `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice01-pre-book-decision-gate/ledger.md` | F-1...F-10 criteria closed by this report. |
| `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice01-pre-book-decision-gate/cc-prompt.md` | CC execution contract for this slice. |
| `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/design/kickoff-thread-book-0.6.0-update.md` | Historical May kickoff assumptions, especially the stale book example-test tree, raw Deno, and book `AGENTS.md` claims. |
| `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/design/book-drift-inventory-0.6.0.md` | Historical D-1...D-5 decision rows and Bucket 0 drift inventory. |
| `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/design/fence-wiring-spec.md` | `D-2607-R4NW` design spec for making book `lisp` fences reachable. |
| `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/design/dogfooding-friction-log.md` | Source for `D-2608-XPRT`, `D-2608-LBND`, `D-2608-COND`, and `D-2608-SOWN`. |
| `backlog/discoveries.md` | Current discovery-register status for the decision rows. |

### Required sibling repo sources

| File | Role in this closeout |
|------|-----------------------|
| `/Users/oubiwann/lab/cnbb/lykn/AGENTS.md` | Current book-repo operating instructions; confirmed the May "missing AGENTS" claim is stale. |
| `/Users/oubiwann/lab/cnbb/lykn/book.toml` | Current mdBook config; confirmed presence and no explicit 0.6.0 edition/version field. |
| `/Users/oubiwann/lab/cnbb/lykn/src/SUMMARY.md` | Current book table of contents; source of truth for live chapter count. |
| `/Users/oubiwann/lab/cnbb/lykn-writers-guide/AGENTS.md` | Current writers-guide repo operating instructions; confirmed current AGENTS/CLAUDE state. |
| `/Users/oubiwann/lab/cnbb/lykn-writers-guide/authoring-guide.md` | Current authoring guidance; source of stale raw Deno and book example-test tree claims. |
| `/Users/oubiwann/lab/cnbb/lykn-writers-guide/new-ch-prompt.md` | Current chapter bootstrap prompt; source of stale `~/lab/oxur/lykn/` paths and mdBook workflow instructions. |
| `/Users/oubiwann/lab/cnbb/lykn-writers-guide/planned-toc.md` | Historical planned ToC v2; compared with live book `src/SUMMARY.md`. |

### Supporting current implementation snippets inspected

| File | Role in this closeout |
|------|-----------------------|
| `assets/ai/SKILL.md` | Current Lykn authoring guidance for CLI wrappers, exports, package root layout, generated artifacts, and Deno boundary. |
| `docs/guides/00-lykn-surface-forms.md` | Current surface syntax for `export`, `if`, `?`, `match`, `if-let`, and `when-let`. |
| `docs/guides/01-core-idioms.md` | Current guidance for guard clauses and avoiding deep nesting. |
| `docs/guides/02-api-design.md` | Current guidance for inline exports and selective `mod.lykn` re-exports. |
| `docs/guides/10-project-structure.md` | Current package/source/generated-output guidance and `deno.json` tension. |
| `crates/lykn-cli/src/main.rs` | Current CLI flags for `lykn test`, `lykn new` scaffold source, and package-level `deno.json` generation. |
| `crates/lykn-cli/src/doctest.rs` | Current docs-fence extractor; confirms only `lykn` fences are recognized. |
| `crates/lykn-lang/src/classifier/dispatch.rs` | Current closed surface namespace; confirms no `cond` or grouped local-binding form is present. |
| `crates/lykn-lang/src/codegen/emit.rs` | Current export codegen support for declaration exports, bare named exports, and selective re-exports. |
| `crates/lykn-lang/src/emitter/forms.rs` | Current surface export wrapping and no-else `if` validation tests. |

## 2. Current-State Evidence

| Area | Evidence |
|------|----------|
| Lang worktree | `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x`; `git status --short --branch` reported `## release/0.6.x`; `git rev-parse --short HEAD` reported `b4573bf` before slice edits. |
| Book repo status | `/Users/oubiwann/lab/cnbb/lykn`; `git status --short --branch` reported `## main` plus untracked `_to_delete/`. This is a caveat for later book work, but this slice made no book-repo edits. |
| Book `AGENTS.md` and `CLAUDE.md` | `git ls-files -s AGENTS.md CLAUDE.md book.toml src/SUMMARY.md` shows tracked `AGENTS.md` mode `100644` and tracked `CLAUDE.md` mode `120000`; `readlink CLAUDE.md` returns `AGENTS.md`. |
| Book example-test tree | The absolute book example-test directory at /Users/oubiwann/lab/cnbb/lykn/test/book does not exist. The parent /Users/oubiwann/lab/cnbb/lykn/test directory also does not exist. |
| Book audit helper | `test -f tools/book-audit/fences.lykn` in the book repo exited 0. |
| Book fences | `rg -o '^```[A-Za-z0-9_-]+' src -g '*.md'` census in the book repo found 444 `lisp`, 170 `javascript`, 3 `lykn`, 1 `scheme`, plus smaller shell/text/html/json/yaml counts. |
| Book `book.toml` | Tracked and present; title is `Lykn`, author is `Duncan McGreggor`, description is the book subtitle; no edition/version field was found. |
| Book `src/SUMMARY.md` | Tracked and present; current ToC has Ch 0 through Ch 38, 39 chapters total, and no appendix entries. It still includes current sections such as Biome, ESLint, Deno KV, and project chapters. |
| Writers-guide repo status | `/Users/oubiwann/lab/cnbb/lykn-writers-guide`; `git status --short --branch` reported `## main` with no dirty entries. |
| Writers-guide `AGENTS.md` and `CLAUDE.md` | `git ls-files -s AGENTS.md CLAUDE.md authoring-guide.md new-ch-prompt.md planned-toc.md` shows tracked `AGENTS.md` mode `100644` and tracked `CLAUDE.md` mode `120000`; `readlink CLAUDE.md` returns `AGENTS.md`. |
| Writers-guide stale items | `authoring-guide.md` still says use `lisp` fences, the absent book example-test tree, and raw Deno test commands; `new-ch-prompt.md` still points at `~/lab/oxur/lykn/`; `planned-toc.md` is v2 with 37 chapters plus 9 appendices. |
| Current `lykn test --docs` surface | `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn test --help` shows `--docs` but no `--fence`; running `lykn test --docs docs/guides/00-lykn-surface-forms.md --fence lisp` exited 2 with `unexpected argument '--fence'`. |
| Current doctest implementation | `crates/lykn-cli/src/doctest.rs` recognizes lines starting with ` ```lykn ` or ` ```lykn,<annotation> `; `run_doc_tests` writes generated tests under `target/lykn/test/doctest/`. |
| Current export implementation | Guides/SKILL teach inline `(export (func ...))` and `(export (bind ...))`; guide 02 and guide 10 also teach selective `mod.lykn` re-exports; codegen supports declaration exports, bare named exports, and re-exports. |
| Current local binding and branch surface | The closed surface namespace has `bind`, `if-let`, `when-let`, `match`, `?`, and `if`, but no `cond` and no grouped local-binding form. Guide 01 recommends guard clauses as the current low-nesting idiom. |
| Current source-ownership behavior | `lykn new` writes `project.json`, `packages/<name>/deno.json`, `packages/<name>/mod.lykn`, and a generated placeholder test under the new project's test directory; guide 10 simultaneously says each package has source `deno.json` and that generated publish `deno.json` under `target/lykn/dist/` should not be hand-written. |

## 3. Decision Packet Table

| Row | Current evidence | Options | CDC/CC recommendation | Duncan input required? | Implementation/book impact | Proposed routing home |
|-----|------------------|---------|-----------------------|------------------------|----------------------------|-----------------------|
| D-1 - B0-G book example verification | May inventory's book example-test gate still does not exist: the book repo has no `test/` directory. The book has 444 `lisp` fences, while current `lykn test --docs` sees only `lykn` fences and rejects `--fence`. | A. Bootstrap the external book example-test tree first as May planned. B. Implement repeatable doctest `--fence lisp` and use book fences as the first coverage gate. C. Hybrid: `--fence lisp` for broad reachability, targeted external book tests for examples needing dual-compiler or runtime assertions. D. Downgrade the test claim and rely on manual review. | Choose C, ordered as B first. Implement repeatable `--fence <tag>` for `lykn test --docs`, defaulting to `lykn`, then make `lykn test --docs src/ --fence lisp` the pre-chapter book gate. Keep a targeted external book test suite as later coverage, not the only baseline. | Yes. This replaces the May test-suite-first recommendation with a fence-first verification model. | Requires CLI implementation before chapter slices that modify code fences. Writers-guide must stop saying raw Deno test commands are the universal gate. | `D-2607-R4NW`; arc16 slice03 `book-fence-reachability`, with writer-guide updates in slice02. |
| D-2 - B0-I planned ToC reconciliation | Current book `src/SUMMARY.md` has 39 chapters and no appendices. Writers-guide `planned-toc.md` is v2 with 37 chapters plus 9 appendices. | A. Preserve v2 and create a 0.6.0/v3 ToC artifact. B. Reconcile `planned-toc.md` in place. C. Treat current `SUMMARY.md` as sufficient and drop planned ToC refresh. | Preserve v2 as historical input and create a current 0.6.0 ToC/reconciliation artifact before prose work. The live book `SUMMARY.md` should be the starting source of truth, not the stale planned ToC. | Yes. This is an editorial/methodology call about historical artifact value and 0.6.0 structure. | Slice02 must update writers-guide references and decide whether appendices are deferred, folded into chapters, or restored. | arc16 slice02 `book-instruction-bootstrap`, then slice04 drift refresh. |
| D-3 - B0-M close-artifact home | May recommendation said lang `workbench/`; current lang/book/writers-guide AGENTS rules say `workbench/` is scratch and durable arc16 planning lives under tracked lang `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/`. | A. Use book repo `workbench/`. B. Use lang `workbench/`. C. Use tracked lang arc16 design directory. D. Put planning in writers-guide. | D-3 is effectively resolved by current governance: use the tracked lang arc16 directory for durable planning and close reports. Do not cite or rely on any `workbench/` scratch path. | No, unless Duncan wants to reopen artifact-home policy. | Writers-guide/book prompts should point at lang arc16 tracked paths. No compiler/book content implementation needed. | arc16 slice02 docs refresh; keep durable close artifacts in this slice directory. |
| D-4 - ordering of verification bootstrap | The book still lacks an example-test tree; `--fence lisp` is not implemented; the book repo has untracked `_to_delete/`, making parallel book work higher-risk. | A. Run verification bootstrap sequentially before chapter edits. B. Run in parallel with chapter/prose work. C. Skip until edition close. | Keep sequential ordering. First slice02 reconciles instructions, then slice03 implements/proves fence reachability, then chapter slices may touch examples. | Yes for schedule, but CC recommendation is sequential. | Delays chapter work until the book has a real example gate; reduces rework and avoids manual-only code review. | arc16 slice order: slice02, then slice03, then slice04 or implementation slices as decided. |
| D-5 - iteration/PR cadence | Separate lang/book/writers-guide repos all have current AGENTS/CLAUDE conventions; book has an untracked `_to_delete/` caveat. | A. One PR/commit series per iter per repo. B. Multiple PRs per iter. C. Batch all repos in one cross-repo milestone. | Use one scoped branch/PR per executable slice per repo, with separate commits for lang planning/implementation and sibling book/writers-guide edits. Do not bundle multi-repo changes in one assumed atomic unit. | Usually no; confirm only if Duncan wants a different review cadence. | Keeps CDC reviewable and avoids cross-repo ambiguity. Slice prompts must name repo, branch, checks, and trailers. | arc16 operating convention; slice02 should encode this in refreshed instructions. |
| `D-2607-R4NW` - book `lisp` fence reachability | The book has 444 `lisp` fences and only 3 `lykn` fences. Current extractor only recognizes `lykn`; CLI has no `--fence`; invalid `--fence lisp` exits 2. | A. Add repeatable `--fence <tag>` to `lykn test --docs`. B. Hard-code `lisp` as also-Lykn. C. Rename 444 fences to `lykn`. D. Use an external book example-test tree only. | Implement A. Keep default `lykn`, let book run `lykn test --docs src/ --fence lisp`, support repeated flags for mixed trees, and preserve annotations. Pair this with targeted external book tests only where doctest annotations are insufficient. | Low for the technical route if Duncan accepts fence-first D-1; otherwise yes to choose verification policy. | CLI work plus tests; book and writers-guide instructions need to use the new gate. No book fence churn. | `D-2607-R4NW`; arc16 slice03 or a small CLI slice before slice03 closes. |
| `D-2608-XPRT` - export ownership | Current compiler supports inline exports and re-exports; guides/SKILL recommend inline `(export (func ...))` and selective `mod.lykn` re-exports. Operator/dogfood feedback wants public exports visible at top of module and one coherent story for `mod.lykn`. | A. Teach current inline exports plus entrypoint re-exports. B. Add top-of-module `(exports ...)` declaration and clarify `mod.lykn` as package-entrypoint re-export. C. Use metadata/manifest exports only. D. Defer to 0.7.0 and avoid teaching the new style in 0.6.0. | Make a 0.6.0 decision before module/API chapters. CC recommends B if the compiler work is accepted: top-of-module export declarations for implementation modules, with `mod.lykn` remaining a package API/barrel layer. Keep existing inline export accepted or deprecated by policy, but do not normalize it as the long-term book idiom unless Duncan explicitly chooses A. | Yes. This is a language/API-style decision. | If B is selected for 0.6.0, compiler/linter/docs work is required before slice06. If deferred, the book must explicitly teach the accepted current 0.6.0 style and not imply a missing form exists. | Discovery `D-2608-XPRT`; arc10/compiler-completion or a new 0.6.0 language-surface slice before arc16 slice06. |
| `D-2608-LBND` - grouped local bindings | Current surface has only normal `bind`; no grouped local-binding form appears in the closed surface namespace. Dogfood normalization code produced long sibling `bind` runs. | A. Keep sibling `bind`s and teach guard clauses. B. Extend `bind` with grouped local bindings. C. Add a new `let`/`let*`-style expression-scoped surface form. D. Defer and avoid examples needing it. | Do not teach repeated sibling `bind`s as the durable answer. CC favors a new expression-scoped grouped local-binding form over overloading top-level `bind`, because it can make body placement, shadowing, and sequential/simultaneous semantics explicit. Duncan should choose spelling and semantics. | Yes. | If selected for 0.6.0, implement classifier/emitter/resolver/linter/tests before book local-binding or data-normalization examples depend on it. | Discovery `D-2608-LBND`; arc10/compiler-completion or new language-surface slice before arc16 slice06. |
| `D-2608-COND` - flatter validation branching | Current guidance offers `?`, position-aware `if`, `match`, `if-let`, `when-let`, and guard clauses. No `cond` exists. Dogfood validation had deeply nested `?` ladders. | A. Teach guard clauses plus `?` only. B. Add `cond` with ordered predicate/result clauses and required `:else` in expression position. C. Use `match`/Result combinators for validation. D. Defer and avoid nested validation examples. | Make a pre-draft language decision. CC recommends B for validation/parsing examples, with explicit relationship to `?` for single ternaries, `if` for statement control flow, and `match` for structural/tagged dispatch. | Yes. | If accepted for 0.6.0, compiler/docs/tests required before control-flow/validation chapters. If deferred, book examples must use current guard clauses and avoid presenting nested `?` as ideal. | Discovery `D-2608-COND`; arc10/compiler-completion or new language-surface slice before arc16 slice06. |
| `D-2608-SOWN` - source ownership/generated manifests | `lykn new` writes source package `deno.json`; guide 10 says each package has `deno.json`, while build/dist guidance says generated publish manifests under `target/lykn/dist/` are not hand-written. Dogfood exposed the ownership tension. | A. Keep package `deno.json` as user-owned source config for 0.6.0 and clarify generated files live only under `target/lykn/*`. B. Move package metadata to `project.json`. C. Add Lykn-native package metadata/declarations and generate Deno manifests. D. Defer a redesign to 0.7.0 while documenting the 0.6.0 compromise. | Decide before project-structure chapters. If schedule matters, CC recommends A plus explicit docs as the 0.6.0 floor, and route C as a future design. If Duncan wants the stronger source-only story for 0.6.0, route scaffold/build/dist changes before slice05. | Yes. | Could be docs-only if A/D is chosen; could be scaffold/build/publish implementation if B/C is chosen. Book project-structure chapters depend on the chosen ownership model. | Discovery `D-2608-SOWN`; arc16 slice05 if docs-only, or scaffold/build/dist implementation slice before slice05 if behavior changes. |

## 4. Ledger Walk

| ID | Status | Evidence |
|----|--------|----------|
| F-1 | done | Section 1 lists every required slice and sibling source, plus supporting snippets used for current implementation evidence. |
| F-2 | done | Section 2 records lang, book, and writers-guide branch/status facts; AGENTS/CLAUDE symlink facts; absent book example-test tree; book `book.toml`/`src/SUMMARY.md`; and git-status caveats. |
| F-3 | done | Section 3 includes D-1 through D-5 with current evidence, options, recommendation, Duncan-input classification, impact, and routing. |
| F-4 | done | Section 3 includes both D-1 and `D-2607-R4NW`, comparing `lykn test --docs --fence lisp`, the absent external book example-test tree, and hybrid strategy. |
| F-5 | done | Section 3 includes `D-2608-XPRT` export ownership packet, with current compiler/doc evidence and implementation route. |
| F-6 | done | Section 3 includes `D-2608-LBND` grouped local-binding packet, with syntax/semantics options and compiler impact. |
| F-7 | done | Section 3 includes `D-2608-COND` flatter branching packet, including relation to `?`, `if`, `match`, and no-else behavior. |
| F-8 | done | Section 3 includes `D-2608-SOWN` source ownership packet, distinguishing user-owned resources from generated/config manifests. |
| F-9 | done | Section 5 recommends next slice order and names blocking implementation work. |
| F-10 | done | Section 6 records `git diff --check`, `make check-cited-paths`, and `make test-docs` outcomes. |

## 5. Bubble-up to the Arc

### Delivered assigned piece

slice01 delivered its assigned decision-gate packet. It did not make compiler,
CLI, scaffold, book prose, writers-guide, or book-repo edits. It reconciled
May-era claims against current repository state and separated already-resolved
governance drift from still-open operator decisions.

### Arc-plan changes required before slice02 opens

No book-prose slice should open from the old May iteration model. Before or as
part of opening slice02, the arc plan should record these slice01 outcomes:

1. D-3 is resolved by current tracked lang arc16 planning homes; `workbench/`
   is scratch, not a durable close-artifact home.
2. D-1 and `D-2607-R4NW` should be treated as one verification strategy:
   implement repeatable `lykn test --docs --fence <tag>` and use
   `lykn test --docs src/ --fence lisp` as the first broad book gate.
3. D-2 should route to a current 0.6.0 ToC/writers-guide reconciliation, using
   live book `src/SUMMARY.md` as source of truth and preserving planned-toc v2
   as historical input unless Duncan chooses otherwise.
4. `D-2608-XPRT`, `D-2608-LBND`, and `D-2608-COND` remain language-surface
   decisions. If Duncan wants any of them in 0.6.0, insert implementation
   slices before arc16 slice06 teaches those surfaces.
5. `D-2608-SOWN` remains a project-structure/scaffold decision. If the behavior
   changes for 0.6.0, insert implementation before slice05; otherwise slice05
   must teach the explicit 0.6.0 compromise.

### Next recommended slice

Open slice02 `book-instruction-bootstrap` next. Its job should be narrow:
refresh book and writers-guide instructions, stale paths, raw Deno commands,
AGENTS/CLAUDE facts, planned-ToC policy, and durable close-artifact rules based
on Duncan's decisions from this packet.

After slice02, open slice03 `book-fence-reachability` before any chapter slice
touches code examples. The immediate blocking implementation work is
`D-2607-R4NW`: add repeatable `--fence <tag>` to `lykn test --docs`, prove it
against book `src/`, and update the book/writers-guide gate text.

Language-surface implementation for XPRT/LBND/COND should not be hidden inside a
book prose slice. Those need explicit operator decisions and their own compiler
or design slices if accepted for 0.6.0.

## 6. Verification and Probe Transcript

### Read-only sibling repo probes

| Command | Workdir | Result |
|---------|---------|--------|
| `git status --short --branch` | `/Users/oubiwann/lab/cnbb/lykn` | exit 0; `## main`; untracked `_to_delete/`. |
| `git ls-files -s AGENTS.md CLAUDE.md book.toml src/SUMMARY.md` | `/Users/oubiwann/lab/cnbb/lykn` | exit 0; `AGENTS.md`, `book.toml`, and `src/SUMMARY.md` tracked mode `100644`; `CLAUDE.md` tracked mode `120000`. |
| `readlink CLAUDE.md` | `/Users/oubiwann/lab/cnbb/lykn` | exit 0; `AGENTS.md`. |
| test -d /Users/oubiwann/lab/cnbb/lykn/test/book | lang worktree | exit 1; book example-test directory absent. |
| find /Users/oubiwann/lab/cnbb/lykn/test -maxdepth 2 -type d -print | lang worktree | exit 1; book test parent directory absent. |
| `test -f tools/book-audit/fences.lykn` | `/Users/oubiwann/lab/cnbb/lykn` | exit 0; audit helper exists. |
| `rg -o '^```[A-Za-z0-9_-]+' src -g '*.md'` census | `/Users/oubiwann/lab/cnbb/lykn` | exit 0; found 444 `lisp`, 170 `javascript`, 3 `lykn`, 1 `scheme`, plus smaller auxiliary fence tags. |
| chapter/appendix `rg` probe over `src/SUMMARY.md` | `/Users/oubiwann/lab/cnbb/lykn` | exit 0; Ch 0 through Ch 38 present; no appendix entries. |
| `git status --short --branch` | `/Users/oubiwann/lab/cnbb/lykn-writers-guide` | exit 0; `## main`; clean. |
| `git ls-files -s AGENTS.md CLAUDE.md authoring-guide.md new-ch-prompt.md planned-toc.md` | `/Users/oubiwann/lab/cnbb/lykn-writers-guide` | exit 0; `AGENTS.md`, `authoring-guide.md`, `new-ch-prompt.md`, and `planned-toc.md` tracked mode `100644`; `CLAUDE.md` tracked mode `120000`. |
| `readlink CLAUDE.md` | `/Users/oubiwann/lab/cnbb/lykn-writers-guide` | exit 0; `AGENTS.md`. |
| stale-guidance `rg` probe over `AGENTS.md`, `authoring-guide.md`, `new-ch-prompt.md`, and `planned-toc.md` | `/Users/oubiwann/lab/cnbb/lykn-writers-guide` | exit 0; confirmed stale example-test tree, raw Deno test, `lisp` fence, and old source-path guidance. |

### Lang repo probes

| Command | Result |
|---------|--------|
| `git status --short --branch` | exit 0; `## release/0.6.x` before edits. |
| `git rev-parse --short HEAD` | exit 0; `b4573bf` before edits. |
| `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn test --help` | exit 0; help shows `--docs` but no `--fence`. |
| `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn test --docs docs/guides/00-lykn-surface-forms.md --fence lisp` | exit 2; `unexpected argument '--fence'`. |
| `rg -n ...` and `sed -n ...` over `crates/lykn-cli/src/doctest.rs`, `crates/lykn-cli/src/main.rs`, `crates/lykn-lang/src/classifier/dispatch.rs`, `crates/lykn-lang/src/codegen/emit.rs`, and guide/SKILL files | exit 0 except one non-material shell-quoting probe that included literal backticks and was replaced by targeted `sed` reads. Evidence is summarized in sections 2 and 3. |

### Required close checks

| Command | Result |
|---------|--------|
| `git diff --check` | exit 0; clean. |
| `make check-cited-paths` | First post-draft run exited 2 with 13 dangling citations caused by inline-code references to the absent book example-test tree and a scaffold-only test path. I reworded those as absence evidence rather than tracked-path citations. Final rerun exited 0: cited-path check passed, 603 documents on `release/0.6.x`, 601 historical citations accepted via `scripts/cited-paths-census.tsv`. |
| `make test-docs` | exit 0; generated 22 doctest files with 476 blocks, 15 skipped; final Deno result: 476 passed, 0 failed. |
