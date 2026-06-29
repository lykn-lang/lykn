# Slice: move-function-core (arc04 / slice01) — Ledger

Canonical ledger, lifted from the cc-prompt's embedded §8 ledger + §11
acceptance criteria. TDD-first paired commits (test-only commit, then fix-only
commit). Per `collaboration-framework/templates/LEDGER-DISCIPLINE.md`. Evidence
reaches at least `reproduced` (CDC re-runs the Verify) for `done`.

**The non-negotiable invariant (F-3):** parse only to locate; copy raw bytes;
never regenerate. The moved declaration's bytes must be strict-string-identical
to the source bytes — that byte-identity is what makes the move verifiable.

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| F-1 | `scripts/move-function.js` scaffold: CLI args (`--from/--to/--name/--dry-run/--verify-cmd`), `import.meta.main` guard, invocation comment; first failing `locateDeclaration` test | `deno test -A scripts/move-function.test.js` (red→green pair) | correctness | T1a-1 | **done** | TDD pair `c7d050c` (test, red: module missing) → `db7c45e` (fix, green). Scaffold + parseArgs + minimal locateDeclaration | **attested** |
| F-2 | `locateDeclaration` handles all declaration shapes + leading-comment extension | Layer-1 locate tests green | correctness | T1a-2 | **done** | TDD pair `ff634c8` (test, 3 red) → `f7f828c` (fix, green). function/function*/const-arrow + `leadingCommentStart` | **attested** |
| F-3 | `removeDeclaration` + `insertDeclaration` — verbatim slice; **byte-identity invariant holds** | Layer-1 + §2 invariant test green (moved bytes === source bytes) | serious | T1a-3 | **done** | TDD pair `cb51531` (test) → `b31e81d` (fix). §2 test "moved declaration bytes === source bytes" green; no astring/regeneration. Also Layer-4 byte-identity (F-7) | **attested**; the non-negotiable invariant holds |
| F-4 | `addNamedImport` + `stripReExport` | Layer-1 import/re-export tests green | correctness | T1a-4 | **done** | TDD pair `018da3d` (test) → `9e3798e` (fix). Merge/insert import; drop name from re-export, delete when empty, keep others | **attested**; fixed an invalid-JS test fixture (duplicate export) in the pair |
| F-5 | `moveFunction` orchestration (single name, two files) + Layer-2 temp-fixture tests + abort conditions | Layer-2 + abort tests green | serious | T1a-5 | **done** | TDD pair `664461c` (test) → `7c2ca58` (fix). e2e move (back-import + byte-identity in TO + exported-once); aborts on not-found / collision / ambiguous, writing nothing | **attested** |
| F-6 | Verify gate + auto-revert + dry-run; **no skip-gate flags, no silent `--no-verify`** | Layer-3 verify/dry-run tests green | serious | T1a-6 | **done** | TDD pair `0465cb8` (test) → `d9b2d5a` (fix). Failing verify reverts both files byte-exactly + throws; dry-run writes nothing; `runVerifyCommand` runs the command verbatim (no injected skip flags) | **attested**; CLAUDE.md safety-gate ethos honored |
| F-7 | Acceptance: scratch-branch move of a **zero-external-consumer** helper keeps `deno test -A test/` green; scratch discarded (no real extraction lands) | `deno test -A test/` green on scratch; helper + zero-consumer grep recorded | serious | T1a-7 | **done** | Helper: `parseRestParam` (non-exported, surface.js:611, used :644). Zero-consumer grep: `grep -rl parseRestParam packages/ test/ \| grep -v surface.js` → none. Moved to a scratch `surface-helpers.js`; byte-identical: true; gained `export`; surface.js gained back-import. **After `lykn build`, `deno test --config project.json -A test/` → 657 passed / 0 failed.** Scratch branch deleted; surface.js restored (declares it again), no surface-helpers.js — no extraction landed | **attested**; reproduced at slice scale |
| F-8 | `deno lint scripts/` clean; closing notes | `deno lint scripts/` exits 0 | correctness | T1a-8 | **done** | `deno lint scripts/` → "Checked 2 files", exit 0. (Pinned `npm:acorn@^8` for `no-unversioned-import`.) | **attested** |
| F-9 | no regressions | `deno test --config project.json -A test/` green | serious | §11 | **done** | `deno test --config project.json -A test/` → `657 passed | 0 failed`; `deno test -A scripts/move-function.test.js` → `26 passed | 0 failed` | **attested** |

## What Worked

- **TDD-first paired commits held throughout** — every row is a visible red→green
  SHA boundary in `git log` (test commit then fix commit), no test+fix blends.
- **The byte-identity invariant fell out of the design** — `locateDeclaration`
  returns offsets, the move is `sourceText.slice(...)`, and no code generator is
  ever in the path. The §2 unit test and the Layer-4 real-corpus move both
  confirm `moved bytes === source bytes`.
- **Pure core / thin IO split** made Layer-2/3 testable without subprocesses:
  `planMove` is pure (string→string), `moveFunction` does IO + the injectable
  verify gate, so the revert path was tested with a fake failing verify.

## Closure

Closed on 2026-06-28. Verified by: CC (attested, all 9 rows); awaiting CDC
reproduction → `cdc-verification.md`.
Rows: 9. Done: 9. Deferred: 0. No-op: 0.

TDD pairs (test→fix): F-1 `c7d050c`→`db7c45e` · F-2 `ff634c8`→`f7f828c` ·
F-3 `cb51531`→`b31e81d` · F-4 `018da3d`→`9e3798e` · F-5 `664461c`→`7c2ca58` ·
F-6 `0465cb8`→`d9b2d5a`. Step 0 (cargo fmt drive-by): `401e2bd`. F-7 acceptance
ran on a discarded scratch branch (no commit). F-8/F-9 + this close: final commit.

> **Iteration budget:** the cc-prompt invokes the standing override — genuine
> engineering over count (progress, not compliance theatre). CDC review judges
> substance.

> **Iteration budget:** the cc-prompt invokes the standing override — genuine
> engineering over count (progress, not compliance theatre). CDC review judges
> substance.
