# W-4d Implementation Prompt — ICU Error Block Fence Annotations

**Workstream:** W-4d (from `workbench/phase-3-synthesis-plan-2026-05-14.md`)
**Closes:** D-3 (Phase 1a Class B) — six of the 14 post-rebase doctest failures.
**Protocol weight:** Lightweight. Single-turn, no diagnosis-then-pause; the work is mechanical and bounded.

---

## Context

`docs/guides/17-template-and-i18n.md` contains six code blocks that intentionally demonstrate ICU template errors. Each block has a `;; ERROR: …` prose comment showing the diagnostic the compiler emits. Under the current bare ` ```lykn ` fence, the doctest framework runs each block under its default `Compile` annotation — i.e., asserts the block compiles cleanly. The compiler — correctly — refuses to compile the invalid templates, so all six blocks fail their generated tests.

The doctest framework already supports a `CompileFail` annotation (see `crates/lykn-cli/src/doctest.rs:18-31` — the `Annotation` enum), activated by the fence syntax ` ```lykn,compile-fail `. Under that annotation, the test passes iff compilation fails (and fails if compilation succeeds — symmetric guard).

The fix is a six-line doc-only edit. Zero compiler change. Zero framework change.

---

## The six targets

All in `docs/guides/17-template-and-i18n.md`. Find them via:

```sh
grep -n "^;; ERROR:" docs/guides/17-template-and-i18n.md
```

For each `;; ERROR:` hit, walk upward to the immediately-preceding ` ```lykn ` fence — that fence is the target to change. There should be exactly six.

Approximate locations (verify before editing; line numbers may shift):

| Target block | Approx fence line | Block teaches |
|---|---|---|
| Missing keyword argument | ~144 | `(template "Hello, {name}!")` — missing binding |
| Unused keyword argument | ~152 | `:extra v` unused |
| Duplicate keyword argument | ~160 | `:a x :a y` duplicate |
| Plural missing `other` | ~167 | `{n, plural, one {x}}` |
| Plural overlapping branches | ~174 | `=1` and `one` overlap |
| Non-English plural category | ~182 | `zero` not valid under English CLDR |

---

## Deliverables

### D-1. Six fence edits

Change each target fence from:

````
```lykn
````

to:

````
```lykn,compile-fail
````

Nothing else in any of those blocks should change. The block contents, the `;; ERROR:` comments, the surrounding prose — all stay as-is.

### D-2. Empirical verification

Run before and after the edits:

```sh
make test-docs-guides 2>&1 | tee /tmp/w-4d-results.txt
```

The failure count should drop by exactly 6. Pre-edit baseline is 14 failures (per Phase 1a triage); post-edit expected is 8 failures.

The remaining 8 failures are the Phase 1a Class A1 (6 factory-pattern failures, closed by W-1) and Class A2 (2 try-as-expression failures, closed by W-2). They are NOT in scope for W-4d — leaving them is correct.

### D-3. Closing note

Brief closing note (~20 lines) in `workbench/w-4d-closing-2026-05-14.md` covering:

1. The six fences edited, with their final line numbers post-edit.
2. Pre-edit failure count and post-edit failure count from `make test-docs-guides`, copied verbatim from the run output.
3. Confirmation that the remaining 8 failures are A1 (factory pattern) + A2 (try-as-expression) — no surprises in the residual.
4. Any unexpected behavior. If the count drops by anything other than 6, STOP and surface — don't silently absorb a discrepancy.

---

## Acceptance gate

`make test-docs-guides` shows exactly 6 fewer failures than the pre-edit baseline, and the residual 8 failures are exclusively the A1 and A2 patterns documented in Phase 1a.

No other deliverable. This workstream is intentionally small and does not require the full DD-protocol weight.

---

## Forbidden patterns

- **Do NOT** edit the block contents (the `(template …)` forms, the `;; ERROR:` comments, the surrounding prose). The fence is the only change.
- **Do NOT** add `compile-fail` to fences that are NOT one of the six intentional-error blocks. Other ` ```lykn ` fences in this file (or anywhere else) are correct as bare — they're supposed to compile cleanly.
- **Do NOT** touch the doctest framework or any compiler source. The framework already supports `compile-fail`; the compiler already correctly rejects the broken templates. Both are right; only the fences are wrong.
- **Do NOT** silently absorb a wrong post-edit failure count. If it's not exactly -6, surface the discrepancy.

---

## Required reading

- `workbench/phase-3-synthesis-plan-2026-05-14.md` §W-4d (this workstream's full scope context).
- `workbench/phase-2-divergence-catalog-2026-05-14.md` D-3 section (the framework-already-supports-it analysis).
- `crates/lykn-cli/src/doctest.rs:18-56` (the `Annotation` enum and `parse_annotation` — confirms the framework support).

Total prompt scope: a single doc-only commit. Estimated CC time: under 15 minutes including verification.
