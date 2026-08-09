# arc16 slice02 - Dogfood Implementation Runway Closing Report

## 1. Source Material Read

| File | Role in this slice |
|------|--------------------|
| `AGENTS.md` | Branch/worktree rules, scratch artifact policy, arc16 split layout, and commit trailers. |
| `assets/ai/SKILL.md` | Primary Lykn authoring guidance: CLI-only workflow, no hand-written generated output, no package-root `src/`, surface idioms, exports, errors, tests, and Deno boundary. |
| `docs/guides/00-lykn-surface-forms.md` | Surface syntax reference for `bind`, `func`, `type`, `match`, `obj`, `assoc`, `conj`, `if`, `?`, `try`, imports, and exports. |
| `docs/guides/01-core-idioms.md` | Core style rules: immutable binding, lisp-case, named exports, guard clauses, type/match, method-call traps, and no Node. |
| `docs/guides/02-api-design.md` | API rules for options objects, consistent return types, named exports, barrel re-exports, type constructors, contracts, and absence modeling. |
| `docs/guides/03-error-handling.md` | Error and validation guidance: throw only `Error`, do not throw for expected absence, use tagged results for expected outcomes, fail fast at boundaries. |
| `docs/guides/10-project-structure.md` | Project layout guidance: scaffold shape, package root source, `mod.lykn` entrypoints, feature directories, generated output, tests, and build pipeline. |
| `docs/guides/15-lykn-cli.md` | CLI command semantics for `lykn new`, `build`, `test`, `lint`, `run`, `dist`, and publish. |
| `docs/design-v0.6.0/arc16-book-0.6.0-edition/arc-plan.md` | Arc capability, implementation-first rule, known decision gates, and arc ledger context. |
| `docs/design-v0.6.0/arc16-book-0.6.0-edition/slice01-pre-book-decision-gate/closing-report.md` | Current decision packet for D-1...D-5 and `D-2607-R4NW`, `D-2608-XPRT`, `D-2608-LBND`, `D-2608-COND`, `D-2608-SOWN`. |
| `docs/design-v0.6.0/arc16-book-0.6.0-edition/slice01-pre-book-decision-gate/cdc-verification.md` | Independent verification of slice01 and the updated arc-plan state this slice must plan against. |
| `docs/design-v0.6.0/arc16-book-0.6.0-edition/slice02-dogfood-implementation-runway/slice-doc.md` | This slice's goal, in/out scope, required project shape, verification, and exit criteria. |
| `docs/design-v0.6.0/arc16-book-0.6.0-edition/slice02-dogfood-implementation-runway/ledger.md` | F-1 through F-9 acceptance criteria for this closeout. |
| `docs/design-v0.6.0/arc16-book-0.6.0-edition/slice02-dogfood-implementation-runway/cc-prompt.md` | Direct CC execution contract for the dogfood run and report shape. |

## 2. Scratch Project Summary

Project path:

```text
/private/tmp/lykn-dogfood-run-20260808-204448/record-shape-tools
```

Subject: `record-shape-tools`, a small utility library for normalizing
contact-like records. It trims and lowercases fields, normalizes tag arrays,
constructs ordered validation issues, returns tagged `ValidRecord` /
`InvalidRecord` results, filters valid records, summarizes result sets, and has
a runnable demo.

Created with:

```sh
/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn new record-shape-tools --path /private/tmp/lykn-dogfood-run-20260808-204448
```

Scratch-only setup added a `bin/lykn` symlink back to the repo binary because
the scaffold did not create `bin/lykn`, while this slice requires running
`./bin/lykn ...` commands.

Final source layout:

```text
README.md
bin/lykn -> /Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn
packages/record-shape-tools/deno.json
packages/record-shape-tools/issues.lykn
packages/record-shape-tools/main.lykn
packages/record-shape-tools/mod.lykn
packages/record-shape-tools/normalize.lykn
packages/record-shape-tools/result.lykn
packages/record-shape-tools/strings.lykn
project.json
test/mod_test.js
```

Public API:

| Export | Purpose |
|--------|---------|
| `ValidRecord(record)` | Tagged success constructor for normalized records. |
| `InvalidRecord(issues)` | Tagged failure constructor with ordered validation issues. |
| `normalize-record(raw)` | Validate and normalize one record, returning a tagged result. |
| `normalize-records(records)` | Normalize an ordered array of records. |
| `collect-valid-records(records)` | Return only normalized records from valid results. |
| `summarize-results(results)` | Count total, valid, and invalid tagged results. |

Why it is realistic enough: the library has a package entrypoint, multiple
modules, a tagged result surface, public functions with typed boundaries,
ordered validation, collection transforms, object construction, tests, a README,
and an executable demo. It is still small enough that every failure can be
attributed to a concrete language, CLI, scaffold, or project choice.

No scratch project files were added to the Lykn repo. The only tracked lang repo
artifacts produced by this slice are this report and the slice ledger update.

## 3. Command Transcript and Outcomes

### Creation and setup

| Command | Exit | Outcome |
|---------|------|---------|
| `mkdir -p /private/tmp/lykn-dogfood-run-20260808-204448` | 0 | Created scratch parent. |
| `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn new record-shape-tools --path /private/tmp/lykn-dogfood-run-20260808-204448` | 0 | Created project and initialized git. |
| `./bin/lykn --version` | 127 | Failed: `./bin/lykn: No such file or directory`. Scaffold did not create the local binary path expected by this slice. |
| `mkdir -p bin` | 0 | Scratch-only setup. |
| `ln -s /Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn bin/lykn` | 0 | Scratch-only local CLI shim. |
| `./bin/lykn --version` | 0 | Reported `lykn 0.6.0-dev`. |

Classification: scaffold/guidance mismatch. The project-structure guide and
this slice expect a local `bin/lykn`; `lykn new` did not create it and the
scaffold "next steps" use PATH-dependent `lykn`.

### Scratch project build/test/lint/run

| Command | Exit | Outcome |
|---------|------|---------|
| `./bin/lykn build` | 0 | Built `@record-shape-tools/record-shape-tools` into `target/lykn/build/record-shape-tools/`. |
| `./bin/lykn test` with scaffold-style Lykn test macros | 1 | Failed before tests: macro module `jsr:@lykn/testing` had no `lykn.macroEntry` field and no `mod.lykn` fallback. |
| `./bin/lykn test` after switching to JS tests | 1 | Failed because `target/lykn/build/record-shape-tools/shared/strings.js` was missing. `lykn build` had skipped nested package source. |
| `./bin/lykn build` after flattening helper module to package root | 0 | Built root package files, including `strings.js`. |
| `./bin/lykn test` final | 0 | Ran 3 tests from `test/mod_test.js`; 3 passed, 0 failed. |
| `./bin/lykn lint` | 2 | Failed with usage: `lykn lint <paths...>`. The command requires paths. |
| `./bin/lykn lint packages/record-shape-tools test` | 0 | Clean: no lint findings across 6 Lykn source files. |
| `./bin/lykn run packages/record-shape-tools/main.lykn` | 1 | Failed: temp-compiled source resolved `./mod.js` from the temp directory, not the package directory. |
| `./bin/lykn run target/lykn/build/record-shape-tools/main.js` | 0 | Demo succeeded through the compiled JS entrypoint. |

Final successful test output:

```text
running 3 tests from ./test/mod_test.js
normalizeRecord trims and lowercases accepted records ... ok (0ms)
normalizeRecord returns ordered validation issues ... ok (0ms)
collection helpers keep result order and valid records ... ok (0ms)

ok | 3 passed | 0 failed (3ms)
```

Final demo output:

```json
{
  "total": 2,
  "valid": 1,
  "invalid": 1
}
[
  {
    "name": "Ada Lovelace",
    "email": "ada@example.org",
    "tags": [
      "math",
      "notes"
    ],
    "active": true
  }
]
```

### Lang repo gates

| Command | Exit | Outcome |
|---------|------|---------|
| `git diff --check` | 0 | Clean. |
| `make check-cited-paths` | 0 | Passed: 607 documents on `release/0.6.x`; 601 historical citations accepted via `scripts/cited-paths-census.tsv`. |
| `make test-docs` | 0 | Passed: generated 22 doctest files with 476 blocks, 15 skipped; final result 476 passed, 0 failed. |

## 4. Best-Practices Self-Grade

Grade: **B-**.

The project follows the current authoring guidance where the toolchain lets it:
CLI wrappers only, no Node/npm workflow, no `src/` layout, no hand-written
generated output, named exports, a package barrel, typed public functions,
tagged validation results, immutable transforms, and no module-level side
effects in library modules. The grade is not higher because the final tests are
JS-on-compiled-output rather than Lykn testing DSL, the intended nested helper
layout had to be flattened to match current build behavior, and validation code
is noisier than the surface we likely want the book to teach.

| Guide area | How the project complied | Evidence | Confidence | Weakness |
|------------|--------------------------|----------|------------|----------|
| CLI-only workflow | Used `lykn new`, `./bin/lykn build`, `./bin/lykn test`, `./bin/lykn lint`, and `./bin/lykn run`; no raw Deno/npm/node commands. | Command transcript. | high | Needed scratch symlink because scaffold lacked `bin/lykn`. |
| Package-root source, no `src/` | All package source files ended at the package root after flattening. | Final source layout. | high | Guide's feature-directory examples did not match build recursion. |
| Named exports and barrel API | Implementation modules use inline named exports; `mod.lykn` uses selective re-exports. | Public API table. | high | This still exercises the unsettled `D-2608-XPRT` style rather than resolving it. |
| Typed public boundaries | Public functions have typed args and returns where current type vocabulary supports them. | `normalize-record`, `normalize-records`, `summarize-results`. | medium | Tagged result return had to use `:any`; guide does not show a precise public return annotation for custom ADTs. |
| Expected validation as data | Invalid records return `InvalidRecord(issues)` rather than throwing. | Ordered validation test. | high | Issue accumulation uses a `cell`, which is explicit but verbose. |
| Object and array handling | Uses `obj`, keywords, array `map`/`filter`, `conj`, and object property access. | Normalization and collection tests. | high | Tests had to avoid the documented `(get ...):field` trap by binding first. |
| Control-flow style | Uses guard-return in helper code and statement-position `if` for validation. | `normalize-tags`, `collect-issues`. | medium | Ordered validation still produced nested `if` and repeated sibling conditionals. |
| Tests | Final `./bin/lykn test` runs 3 Deno tests through the Lykn CLI. | Final test output. | high for behavior | Lykn testing DSL package resolution failed, so tests are JS instead of Lykn. |
| Demo | Built JS entrypoint runs through `./bin/lykn run`. | Final demo output. | high | Direct source run failed for relative imports. |

## 5. Guide/SKILL Feedback

Especially useful guidance:

- The CLI-only rule kept the workflow honest: every project action went through
  `lykn`, even when raw Deno would have been an easy bypass.
- The "no `src/` package-root layout" rule prevented a known publish/build
  failure mode.
- The surface-form and core-idiom guides were directly useful for `bind`,
  `func`, `obj`, `conj`, keyword keys, lisp-case naming, `:returns`, and
  method-call receiver traps.
- The API and error-handling guides gave a clear rationale for tagged expected
  validation results instead of exceptions.

Missing, ambiguous, stale, or hard to apply:

- The testing guidance says the Lykn testing DSL should work through
  `jsr:@lykn/testing` / `testing`, but a fresh scaffold's `.lykn` test could not
  expand the macro package.
- The project-structure guide recommends feature directories, but current
  `lykn build` did not compile a nested `shared/strings.lykn` file.
- The scaffold does not create `bin/lykn`, while guide 10 and this slice's
  command contract assume a local binary.
- `lykn run` on a source file with relative imports compiled to a temp file and
  broke import resolution.
- The guide does not answer how to annotate a function that returns a custom
  tagged result without falling back to `:any`.
- The current guidance can describe ordered validation with guard clauses, but
  it does not provide a satisfying flat expression form for multi-branch
  validation.

## 6. Dogfood Evidence for Known Pre-Book Decisions

| Decision | Dogfood evidence | Recommendation |
|----------|------------------|----------------|
| `D-2607-R4NW` | This project did not exercise book fences directly. It did show that test reachability is fragile enough that the book should not rely on manual fence review or stale test claims. | Keep the slice01 fence-first recommendation. Implement and prove the book fence gate before chapter code edits. |
| `D-2608-XPRT` | Current inline exports plus selective `mod.lykn` re-exports worked and produced clean JS exports. The public API is visible in `mod.lykn`, but implementation modules still require scanning declaration sites for exports. | If top-of-module export declarations are accepted for 0.6.0, implement before book API/module chapters. If not, document current inline exports plus barrel re-exports as the 0.6.0 truth. |
| `D-2608-LBND` | Normalization needed repeated sequential sibling `bind`s in `normalize-tags`, `normalize-record`, and `summarize-results`. The code is readable but visually noisy. | Keep as an implementation candidate if Duncan wants cleaner 0.6.0 examples. Otherwise teach repeated `bind`s honestly and defer grouped locals to 0.7.0 with a named re-entry. |
| `D-2608-COND` | Ordered validation in `collect-issues` required repeated statement `if`s and a nested email `if`. This is exactly the validation shape that made `cond` attractive. | Strongly consider a 0.6.0 `cond` or equivalent ordered-branch form before validation-heavy book examples. If deferred, examples should use guard clauses and avoid presenting nested `?` ladders as ideal. |
| `D-2608-SOWN` | Source package `deno.json` remains user-authored, generated output lives under `target/lykn`, and a test run generated `deno.lock`. More importantly, nested source under a feature directory was silently absent from build output. | Route a CLI/scaffold/package implementation slice before project-structure prose. At minimum, settle package source ownership and the build traversal contract. |

## 7. New Findings and Routing Recommendations

| Proposed ID | Finding | Evidence | Recommended home |
|-------------|---------|----------|------------------|
| `D-2608-BINW` | `lykn new` did not create `bin/lykn`, but the project-structure guide and this slice require `./bin/lykn` commands. | `./bin/lykn --version` exited 127 before the scratch symlink. | CLI/scaffold slice under arc16 slice03 or a small scaffold slice before book project-structure prose. |
| `D-2608-TDSL` | Fresh scaffold Lykn tests could not expand `jsr:@lykn/testing`; the package lacked macro metadata or a `mod.lykn` fallback from the resolver's perspective. | First `./bin/lykn test` exited 1 with macro module resolution error. | Package/publish/testing DSL implementation slice before the book teaches Lykn-source tests as the normal path. |
| `D-2608-BREC` | `lykn build` did not recurse into nested package source directories, contradicting feature-directory examples in guide 10. | `shared/strings.lykn` existed in source; build output omitted `shared/strings.js`; tests failed on module not found. | CLI build traversal or docs/scaffold route. This should be decided before project-structure chapters. |
| `D-2608-RIMP` | `lykn run` on a source file with relative imports broke because the temp-compiled file resolved imports from the temp directory. | `./bin/lykn run packages/record-shape-tools/main.lykn` exited 1 looking for temp `mod.js`; running the built JS worked. | CLI run implementation slice before the book recommends source-run demos with local imports. |
| no ID proposed | `./bin/lykn lint` without paths exits 2, while this slice listed it as a required command. | Exact command printed usage; path-scoped lint passed. | Fix prompt wording or add a scaffold lint task/default. This is less durable than the implementation findings above. |

## 8. Ledger Walk

| ID | Status | Evidence |
|----|--------|----------|
| F-1 | done | Section 1 lists `AGENTS.md`, `assets/ai/SKILL.md`, all required guide files, arc16 `arc-plan.md`, slice01 close/verification, and this slice's `slice-doc.md`/`ledger.md`, each with a role. |
| F-2 | done | Section 2 records the scratch project path, creation command, project shape, final layout, and confirms no scratch project files were committed here. |
| F-3 | done | Section 2 and Section 4 identify exports, `mod.lykn` entrypoint, local bindings, validation/control-flow, tagged results, arrays/objects, tests, and demo surface. |
| F-4 | done | Section 3 records build, test, lint, and run/demo command outcomes, including failures and fixes. |
| F-5 | done | Section 4 gives a B- self-grade with concrete compliance evidence and weaknesses. |
| F-6 | done | Section 6 revisits `D-2607-R4NW`, `D-2608-XPRT`, `D-2608-LBND`, `D-2608-COND`, and `D-2608-SOWN` with dogfood evidence and routing recommendations. |
| F-7 | done | Section 7 lists new findings with proposed discovery IDs or a no-ID rationale. |
| F-8 | done | Section 9 recommends the next executable work before book prose. |
| F-9 | done | Section 10 records `git diff --check`, `make check-cited-paths`, and `make test-docs` passing. |

## 9. Bubble-up to the Arc

Implementation work should happen before book/writers-guide prose. This dogfood
run did not merely validate current guidance; it exposed executable failures in
the scaffold/test/build/run path that the book would otherwise normalize as
happy-path instructions.

Recommended next work:

1. Open arc16 slice03 as an implementation-routing slice, but split the first
   executable implementation unit narrowly around CLI/scaffold/package runway
   reliability: `D-2608-BINW`, `D-2608-TDSL`, `D-2608-BREC`, `D-2608-RIMP`, and
   the `D-2608-SOWN` build/source-ownership decision.
2. Keep `D-2607-R4NW` as the book-fence gate implementation before chapter code
   edits.
3. Ask Duncan to decide whether `D-2608-XPRT`, `D-2608-LBND`, and
   `D-2608-COND` land in 0.6.0. If accepted, they need compiler/language slices
   before book language-surface chapters. If deferred, the book should teach the
   current 0.6.0 forms without implying missing syntax exists.

What remains blocked on Duncan's decision:

- Whether top-of-module exports, grouped local bindings, and a `cond`-style
  branch form are 0.6.0 implementation work or named 0.7.0+ deferrals.
- Whether `D-2608-SOWN` is a docs-only 0.6.0 compromise or a behavior change to
  scaffold/build/dist before prose.
- Whether to open the CLI/scaffold/package fixes as one slice or split them into
  separate build/test/run/scaffold slices.

Silent-drop diff: the slice delivered the requested dogfood project and report.
The only scoped item not satisfied exactly was `./bin/lykn lint` with no args;
that command is not accepted by the current CLI, so I recorded the failure and
used the path-scoped lint command as the reproducible linter check.

## 10. Verification

| Command | Result |
|---------|--------|
| `git diff --check` | exit 0; clean. |
| `make check-cited-paths` | exit 0; cited-path check passed for 607 documents on `release/0.6.x`, with 601 historical citations accepted via `scripts/cited-paths-census.tsv`. |
| `make test-docs` | exit 0; generated 22 doctest files with 476 blocks, 15 skipped; final Deno result: 476 passed, 0 failed. |
