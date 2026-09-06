# Slice 01: doctest-drift-fix (CI green) — Closing Report

**By:** CC (Claude Code) · **Date:** 2026-06-30 · **Branch:** `release/0.6.x`
**Verdict: delivered — docs-only.** The 8 stale guide doctest blocks now compile
under DD-50.6; `make test-docs` and `make check` are green. No compiler change.
This closes the red-CI item the CI report (run 28421983093) surfaced.

---

## What failed and why

The first CI run on `release/0.6.x` failed on **8 guide doctest blocks**, each
containing a function that declares `:returns :TYPE` but whose body ends in a
**statement-only form** — `try`, or a bare `fn`. DD-50.6's return-type check
(`isStatementOnlyForm` on the last body form, `classifier.js:423,479` /
`surface-helpers.js:25` `STATEMENT_ONLY_HEADS`) correctly rejects these: a
statement-only tail cannot produce the declared value. The compiler is right;
the guides had drifted. `return` is **not** in `STATEMENT_ONLY_HEADS`, and the
check inspects only the *last body form's head* — so a fix must make the body's
tail a value-producing form (or drop `:returns`).

Baseline (rebuild-first): `lykn test --docs docs/guides/` → **464 passed, 8
failed**. The 8: `03` blocks 4 & 13; `06` blocks 22 & 34; `07` block 31; `08`
blocks 23 & 24; `11` block 10.

---

## Per-row walk

### F-1 — the 2 `try` cases (`03-error-handling.md`) — **done**

- **`load-config` (block 4).** Dropped `:returns :object`; made the success path
  an explicit `(return (JSON:parse raw))`. The catch already re-throws with
  `Error:cause`, so both exits are explicit — the block's teaching point
  (ID-04, error chaining) is untouched, and it still yields the parsed object.
- **`valid-json?` (block 13).** Dropped `:returns :boolean`; the try success
  path is `(block (JSON:parse s) (return true))` and the bindingless catch is
  `(catch (return false))`. The block's teaching point (ID-12, *omit the catch
  binding*) is preserved — the catch still omits its error param.
  The sibling `try-parse-json` in the same block is `:returns :any`, which the
  check skips (`returnsType.value !== "any"`), so it was already clean.

**Mechanism choice (F-1):** I chose *drop `:returns` + explicit `return`* over
the error message's option (a) (*add a return-typed expression after the form*).
For a `try` tail, option (a) means appending an unreachable literal after the
try — awkward in a style guide. Neither block is *about* its return type
(they teach `Error:cause` and bindingless catch), so dropping `:returns` is the
cleaner, intent-preserving fix. Both compile to idiomatic JS (`try { … return
… } catch { … }`).

### F-2 / F-3 — the `fn`-closure cases (`06`, `07`, `08`, `11`) — **done**

All fixed by **bind-then-return**: bind the inner `fn` to a name and end the
factory body in that name (a value-producing expression). Every offending
function in each block was fixed, not only the named ones (F-3):

| Guide | Block | Functions fixed | Bound name |
|-------|-------|-----------------|-----------|
| `06-functions-closures.md` | 22 | `create-logger`, **`create-multiplier`** (sibling) | `logger`, `multiplier` |
| `06-functions-closures.md` | 34 | `create-filter` | `filterer` |
| `07-async-concurrency.md` | 31 | `debounce`, **`throttle`** (sibling) | `debounced`, `throttled` |
| `08-performance.md` | 23 | `memoize` | `memoized` |
| `08-performance.md` | 24 | `memoize-lru` | `memoized` |
| `11-documentation.md` | 10 | `debounce` | `debounced` |

**Mechanism choice (F-2): bind-then-return uniformly, not `=>`.** Every one of
these closures has **typed inner params** (`:string message`, `:number x`,
`:any arg`, `:array items`, `:any args`) that carry teaching weight — these are
the *functions-&-closures*, *performance*, and *async* guides, where the typed
closure is the point. `=>` is the value-producing arrow but **untyped**
(strips the param checks), so it would have quietly deleted teaching content.
Bind-then-return keeps `:returns :function` (still runtime-checked) *and* the
inner typed params. Verified: `create-logger` compiles to a `createLogger` that
returns `logger`, with the inner `message` type-check intact; the `:returns
:function` check (`typeof … === "function"`) is retained. `=>` was left as the
documented alternative for genuinely-untyped closures (F-7 note), not used here.

### F-4 — `make test-docs` green — **done**

`make test-docs` → guides **472 passed / 0 failed** (was 464/8), README 1/0,
examples 2/0. All three doc surfaces green.

### F-5 — no regressions — **done** (see verification below)

### F-6 — CI green — the two previously-red jobs (`make test`, `make
test-docs`) pass; asserted here, to be **reproduced** by CDC on the CI re-run.

### F-7 — preventive note — **done**

Added a short note to `06-functions-closures.md`'s closure-factory section
(after the `create-logger`/`create-multiplier` block): *to return a closure, end
the factory body in a value-producing form — bind the `fn` and return it by name
(keeps typed params), or use `=>` (untyped); a bare `fn`/`lambda` is
statement-only and a `:returns :function` ending in one is a compile error.*

---

## Verification (rebuild-first)

```sh
cd /Users/oubiwann/lab/lykn/lang
cargo build --release && export LYKN_BIN="$(pwd)/target/release/lykn"
"$LYKN_BIN" test --docs docs/guides/      # 472 | 0  (was 464 | 8)
make test-docs                            # guides 472|0, README 1|0, examples 2|0 — green (F-4)
make check                                # build + lint + all tests incl. docs — green (F-5)
"$LYKN_BIN" build && "$LYKN_BIN" test      # 1345 | 0  (code suite unaffected)
deno test --config project.json -A test/  # 658 | 0   (code suite unaffected)
```

**Observed (2026-06-30, rebuild-first):** `lykn test --docs docs/guides/`
→ `472 | 0`; `make test-docs` → guides `472|0`, README `1|0`, examples `2|0`;
`make check` → **`✓ All checks passed (build + lint + test)`** (exit 0);
`lykn test` → `1345 | 0`; `deno test --config project.json -A test/` → `658 | 0`.

---

## Discipline notes

- **Docs-only.** Only `docs/guides/*.md` touched (03, 06, 07, 08, 11) — the 8
  blocks + the F-7 preventive note. No compiler/code change; the `fn`-value-
  position tweak was declined upstream and not revisited.
- **Process gap this closes.** The drift was invisible to the standing slice
  green-bar (`lykn test` + `deno test test/`); it took `make test-docs` to catch
  it. Doc-touching slices must run `make test-docs` — carried as the arc07
  lesson. (Arc04's byte-identical moves didn't cause this; the blocks were stale
  before the branch was ever CI'd.)
- **`docs/design-v0.6.0/**` left to CDC** except this closing report.

Handed back for CDC `cdc-verification.md`.
