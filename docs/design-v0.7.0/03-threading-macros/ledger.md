# Unit 03: threading-macros — ledger

Per `collaboration-framework/templates/LEDGER-DISCIPLINE.md`. Evidence strengths:
`asserted` < `attested` < `reproduced` < `reconciled`.

**Revised 2026-07-25 (same session).** Rows R-5..R-8 originally cited the **JS
compiler only**. lykn has two compilers, so a one-compiler check cannot settle a
question about the language. They are re-stated below as cross-compiler results,
and R-11/R-12 are new. The original scope is named rather than quietly widened —
see R-12 and `inventory.md` §6.6.

**Closer ≠ verifier.** This ledger was closed by the session that did the work,
so **no row claims better than `attested`**. Each row carries the command that
raises it to `reproduced` by an independent party. Raising R-1…R-4 is cheap
(one script run each) and is the recommended first act of any CDC pass.

| Row | Claim | Evidence | Strength |
|---|---|---|---|
| **R-1** | The ES2025 observable built-in library, clauses 19–28, contains **489** callables after excluding 215 in-clause abstract operations. | `scripts/build-catalog.py` → `data/catalog-es2025.tsv`, 489 rows. Reproduce: see `inventory.md` §9 — **note the corpus lives on `main`, not on this branch**; `--spec` must point at a `main` checkout of `docs/ecmascript-2025/function-heads.md`. | `attested` |
| **R-2** | **417 of those 489 (85%)** cannot distinguish `->` from `->>` — they are `RECEIVER-D` (274) or `UNARY` (143). | Same run, shape distribution. Corroborated behaviourally by R-6. | `attested` |
| **R-3** | Among the **48** ES2025 callables that *do* discriminate (free/static, required arity ≥ 2), the split is **37 datum-first : 2 datum-last**. The two datum-last are `BigInt.asIntN` and `BigInt.asUintN`. | Same run, discriminating-set summary. Every one of the 48 is hand-classified in `ES_HAND`; the build fails on any unclassified row. | `attested` |
| **R-4** | The host tier (`deno types`, Deno 2.9.4) contributes **214** callables, **71** discriminating, at **27 datum-first : 18 datum-last**. The 18 datum-last are exactly two families: WebCrypto configured operators and keyed sinks (`Deno.write*File*`, `Headers`/`FormData`/`URLSearchParams` `set`/`append`, `localStorage.setItem`). | Same run, tier-2 summary; families enumerated in `inventory.md` §4. | `attested` |
| **R-5** | **DD-18 §`->>` documents an expansion neither compiler produces.** DD-18 states `take(map(filter(items, even?), double), 5)`; the compiler produces `take(5, map(double, filter(isEven, items)))`. The DD's "kernel expansion" line is wrong the same way. **The code is correct; the DD is wrong.** | `data/parity-transcript.txt` case 1 — **both** compilers emit `take(5, map(double, filter(isEven, items)));`. DD text at `docs/design/06-final/0023-dd-18-…md`, §`->>` thread-last. | `attested` |
| **R-6** | `->` and `->>` emit **byte-identical** output for keyword (method) steps in **both compilers**, because DD-18.1's keyword rule fires before the position check. | `data/parity-transcript.txt` cases 3-4. Mechanism in both: `classifier.js` `Thread` case, `isKw` branches precede `node.position`; `crates/lykn-lang/src/emitter/forms.rs:886-935` `apply_threading_step`, the `SExpr::Keyword` arms precede the `first` branch. | `attested` |
| **R-7** | **`as->` does not exist in either compiler and fails silently.** `(as-> x $ (f $ 1) (g 2 $))` compiles clean to `asTo(x, $, f($, 1), g(2, $));` in both — no diagnostic, `ReferenceError` at runtime. | `data/parity-transcript.txt` case 5. Registered surface heads at `classifier.js` contain `->`, `->>`, `some->`, `some->>` and no `as->`. `asTo` derives from `MULTI_CHAR_ESCAPES` at `compiler.js:405`. | `attested` |
| **R-8** | `->>` **does** produce correct, useful output for its real domain, identically in both compilers. | `data/parity-transcript.txt` cases 6-8: `(->> rendered (Deno:write-text-file "out.html"))` → `Deno.writeTextFile("out.html", rendered);`; `(->> bytes (crypto:subtle:digest "SHA-256"))` → `crypto.subtle.digest("SHA-256", bytes);` | `attested` |
| **R-11** | **The two compilers agree byte-for-byte on threading.** 14 inputs — `->`, `->>`, `some->`, `some->>`, keyword steps, namespaced calls, bare symbols, `as->` — run through both. **14 agree, 0 disagree.** `->>` is therefore correctly implemented in *both* implementations, not just the JS one. | `data/parity-transcript.txt` (committed, machine-generated: each case diffed programmatically, not eyeballed). Regenerate with `scripts/probe-threading.js` + `scripts/probe-threading-rust.sh`. Rust built from `crates/` at `rustc 1.95.0`. | `reproduced` |
| **R-12** | **Cross-compiler threading coverage in the repo is two cases.** `crates/lykn-lang/tests/cross_compiler.rs:144-145` holds `cross_thread_first` (`(-> x f g)`) and `cross_thread_last` (`(->> x (f a) (g b))`) and nothing else — **no keyword-step parity test**, although DD-18.1 changed the keyword path in *both* emitters. This is why a JS-only check felt sufficient to the session doing the work. | Direct read of `cross_compiler.rs`; grep for `thread` in that file returns exactly those two lines. | `attested` |
| **R-9** | `docs/design-v0.7.0/` exists **only** on `release/0.7.x`. On `main` the path holds two empty untracked directories. | `git ls-tree -r --name-only <branch> -- docs/design-v0.7.0` across all local branches: empty for every branch except `release/0.7.x`. | `attested` |
| **R-10** | The four-book JS reference corpus contains **no statement of a global argument-order rule** for the standard library, and zero mentions of Ramda, data-first-vs-data-last, point-free style, or the pipeline operator. What it does supply is receiver-as-implicit-first-parameter and `bind`'s left-only partial application. | Search across `deep-js`, `eloquent-js`, `exploring-js`, `js-definitive-guide`. Positive citations with file:line in `inventory.md` §9; negative results enumerated there too. | `attested` |

## Disclosed non-delivery

Named rather than dropped, per the anti-silent-drop discipline:

| What | Why | Where it went |
|---|---|---|
| First-pass verification used one compiler | The session verified through `packages/lang` and reported implementation status as settled. lykn has two compilers. Corrected in R-11 within the same session, after the operator surfaced conflicting reports. | `inventory.md` §6.6; discovery row `D-2607-2PQR`. |
| npm-ecosystem survey (Ramda, lodash/fp) | Those libraries **are** data-last, which is the strongest available counter-argument to R3. Settling their weight needs a corpus of what lykn programs actually import; no such corpus exists. | `inventory.md` §8, first bullet — named as the principal limitation, not resolved. |
| `cc-prompt.md` | No CC assignment pending; this unit feeds a design decision, not an implementation. | Disclosed in `slice-doc.md`, "Deviation from the canonical open set". |
| Corpus count over real lykn code | The register's own trending note says running programs finds more than reading does. This unit is a reading exercise. | `inventory.md` §8, final bullet. |
| DD-18 erratum fix | Reported, not applied — this unit makes no production edits. | `discovery-rows.md`, `D-2607-8QVL`. |

## Bubble-up

There is no arc above this unit (single slice, wrapper collapsed) and no
`project-plan.md` for 0.7.0 yet — deliberately deferred per
`docs/design-v0.7.0/README.md`. Bubble-up therefore goes to the two watched
registers:

- **`docs/design-v0.7.0/BACKLOG.md`** — new entry **A7 · `as->`** (R-7 + R2 of
  the report).
- **`docs/backlog/discoveries.md`** — **six** rows, appended to the register
  itself (not left as drafts), plus a correction to `D-2607-K9RT`'s quoted
  output, an evidence-base block on that row, and two new instances under
  `D-2607-Z5KN`. `D-2607-K9RT` stays `held-for-design` — this unit supplies the
  evidence base it was missing; the language-design conversation owns the call.
- **BLOCKED on a commit, and it matters.** `docs/backlog/` is **untracked on
  every branch** (`git ls-tree` returns 0 files for `main`, `release/0.7.x` and
  `release/0.6.x`). By the register's own rule (`D-2607-8HTN`) none of these
  rows is `routed` yet, because the destination does not exist in git. This is
  the pre-existing condition `CLAUDE.md` describes, still live. `discovery-rows.md`
  is retained rather than retired for exactly this reason — see its header.
