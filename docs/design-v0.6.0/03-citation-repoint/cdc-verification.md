# CDC verification - `03-citation-repoint`

**Verified:** 2026-08-08. **Branch:** `release/0.6.x`.

## Verdict

CDC verification passes, with a seat-separation caveat: this Codex Desktop
session performed both the mechanical close work and the local verification.
The evidence below is reproduced from the current checkout, but it is not a
fresh-context verifier pass by a separate session.

## Checks reproduced

```text
make check-cited-paths
```

Passed:

```text
Cited-path check passed (567 documents on release/0.6.x; 601 historical citations accepted via scripts/cited-paths-census.tsv)
```

```text
deno test --config project.json -A test/integration/cited-paths.test.js
```

Passed:

```text
22 passed | 0 failed
```

```text
git diff --check
```

Passed with no output.

```text
git status --short
```

Passed with no output after the close commit.

## Review notes

- The path gate is now green at committed HEAD, which is the contract that
  matters for this checker because it resolves cited paths against git.
- The census shrank in place and did not grow: 631 accepted pairs before the
  slice, 601 after close.
- The four already-decided artifact homes are tracked at HEAD.
- The R-3 "reason column" wording could not be implemented literally without
  changing the census format. The close preserves the existing exact-pair TSV
  mechanism and records residual reasons in `closing-report.md` and the named
  discovery rows instead.

## Project effect

`03-citation-repoint` is closed. `P-21` should remain open only for the
`02-artifact-homes` close-discipline question: the mechanism exists, the path
gate is green, and the residual check is whether durable artifact homes are
structurally protected and independently verified.
