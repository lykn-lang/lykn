# CC Prompt - arc16 slice06 Book Fence Reachability

You are CC in the Lykn lang repo. CDC has opened arc16 slice06:

- `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice06-book-fence-reachability/slice-plan.md`
- `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice06-book-fence-reachability/ledger.md`

## Mission

Implement the fence-first route for `D-2607-R4NW`: make the book's `lisp`
fenced Lykn examples reachable through `lykn test --docs` via an opt-in,
repeatable fence tag flag.

Do **not** rewrite book chapter prose. Do **not** migrate book fences from
`lisp` to `lykn`. This slice establishes reachability and records the first
book-level signal.

## Required Reading

Read these before edits and list them in the closing report with one-line roles:

- `/Users/oubiwann/.agents/skills/collaboration-framework/SKILL.md`
- `/Users/oubiwann/.agents/skills/collaboration-framework/docs/PROJECT-MANAGEMENT.md`
- `/Users/oubiwann/.agents/skills/collaboration-framework/templates/LEDGER-DISCIPLINE.md`
- `/Users/oubiwann/.agents/skills/rust-guidelines/SKILL.md`
- `/Users/oubiwann/.agents/skills/javascript-deno-guidelines/SKILL.md`
- `AGENTS.md`
- `assets/ai/SKILL.md`
- `docs/guides/00-lykn-surface-forms.md`
- `docs/guides/11-documentation.md`
- `docs/guides/15-lykn-cli.md`
- `docs/guides/16-testing.md`
- `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/arc-plan.md`
- `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/design/fence-wiring-spec.md`
- `backlog/discoveries.md` row `D-2607-R4NW`
- `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice05-book-instruction-bootstrap/cdc-verification.md`
- `crates/lykn-cli/src/main.rs`
- `crates/lykn-cli/src/doctest.rs`
- `/Users/oubiwann/lab/cnbb/lykn/AGENTS.md`
- `/Users/oubiwann/lab/cnbb/lykn-writers-guide/AGENTS.md`
- `/Users/oubiwann/lab/cnbb/lykn-writers-guide/authoring-guide.md`
- `/Users/oubiwann/lab/cnbb/lykn-writers-guide/new-ch-prompt.md`

## Implementation Shape

Add a repeatable flag on `lykn test`:

```sh
lykn test --docs PATH --fence TAG
```

Required behavior:

- With no `--fence`, Markdown doctests behave as today: `lykn` fences only.
- With `--fence lisp`, Markdown `lisp` fences are extracted as Lykn blocks.
- Repeated flags compose:

```sh
lykn test --docs PATH --fence lisp --fence lykn
```

- Existing annotation grammar works for all accepted tags:
  `compile-fail`, `run`, `skip`, `fragment`, `continue`, and unknown-defaults
  behavior.
- Prefix-similar tags do not match. Accepting `lisp` must not accept
  `lisp-foo`.
- HTML `<script type="text/lykn">` extraction remains unchanged.

Likely implementation seam:

- `crates/lykn-cli/src/main.rs` parses `Test` command args and calls
  `doctest::run_doc_tests`.
- `crates/lykn-cli/src/doctest.rs` currently has `extract_blocks(source)` and
  hard-codes `lykn` fence matching. Generalize to accepted tags while keeping
  the current full-tag or tag-comma-annotation discipline.

Choose the smallest clean API. A helper such as `extract_blocks_with_fences`
plus the existing default wrapper is fine if it keeps current tests readable.

## Book-Level Demonstration

After implementation, run a reachability command from the sibling book repo.
Use the current lang binary explicitly if needed. Record the exact command and
counts in the closing report.

Example shape:

```sh
cd /Users/oubiwann/lab/cnbb/lykn
/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn test --docs src --fence lisp
```

Expected result: this may fail because the book contains stale examples. That is
acceptable only if the output proves the runner reached the book's `lisp`
blocks and the closing report routes the resulting failure inventory/count to
the next arc16 work.

Also run a mixed-tag demonstration if practical:

```sh
cd /Users/oubiwann/lab/cnbb/lykn
/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn test --docs src --fence lisp --fence lykn
```

## Docs And Sibling Instructions

Update lang docs/guides or CLI docs to describe the flag as opt-in. Do not say
`lisp` is the default.

Update sibling standing instructions after the gate lands:

- `/Users/oubiwann/lab/cnbb/lykn/AGENTS.md`
- `/Users/oubiwann/lab/cnbb/lykn-writers-guide/AGENTS.md`
- `/Users/oubiwann/lab/cnbb/lykn-writers-guide/authoring-guide.md`
- `/Users/oubiwann/lab/cnbb/lykn-writers-guide/new-ch-prompt.md`

Preserve `AGENTS.md` as canonical and `CLAUDE.md` as a symlink in both sibling
repos.

Update `backlog/discoveries.md` row `D-2607-R4NW` with the implemented
route and remaining re-entry condition. Do not leave the row as simply `open`
if the gate lands.

## Verification

Run and record:

```sh
cargo fmt --check
cargo test -p lykn-cli
./bin/lykn test --docs docs/guides/ --docs README.md --docs examples/surface/ --docs examples/kernel/
make test-docs
make check-cited-paths
git diff --check
```

Run sibling checks after any sibling edits:

```sh
git status --short --branch
git diff --check
git ls-files -s AGENTS.md CLAUDE.md
readlink CLAUDE.md
```

Run those in each sibling repo you edited. The book repo may still contain the
pre-existing untracked `_to_delete/`; do not touch it.

## Close

Before committing, update the slice ledger with evidence. Then add:

- `closing-report.md` with a row-by-row ledger walk;
- arc16/project/status bubble-up updates;
- sibling commits if sibling instructions changed.

Use scoped commits and include these trailers on assistant-authored commits:

```text
Co-authored-by: Codex <noreply@openai.com>
Co-authored-by: Billo AI <ai-engineering@billo.systems>
```

If the book-level command exposes substantial failures, do not "fix" them in
this slice by rewriting chapters. Count/classify enough to route the next slice
honestly, then stop.
