# arc15 · slice01 — Closing Report (Reject method-on-expression + migrate guides)

**By:** CC (Claude Code) · **Date:** 2026-07-22 · **Branch:** `release/0.6.x`
**Verdict: delivered.** `((express parts):join "")` and every parenthesized-
receiver method call is now a **compile error** with a threading fix-it, at any
nesting depth; the ~14 guide sites that taught the trap are migrated to
threading; `make check` + `make test-docs` are green together. Source touched:
classifier + the compile pipeline; docs: the six enumerated guides.

## Per-row ledger walk (7 in, 7 out)

| Row | Status | Evidence |
|-----|--------|----------|
| **S-1** — classifier errors on `(<non-atom-head> :kw …)` with the DD-64 fix-it, span on the receiver | **done** | `classifier::forms::{check_method_on_expression, validate_method_calls}` + wired in `compile.rs` (step 2c). The 3 canonical shapes (`express`/`new`/arithmetic) compile → rc=1 with "method call on a parenthesized expression is not supported"; span at the receiver (col 2 in the probe). Tests: `dd64_rejects_the_three_canonical_shapes`, `dd64_span_points_at_the_receiver`. |
| **S-2** — no over-rejection | **done** | atom method `(x:m a)`, threading `(-> (e) (:m a))`, bare-keyword prop `(-> (e) :length)`, IIFE `((fn …) 5)`, curried `((make-adder 3) 4)`, plain calls — all rc=0. Test `dd64_does_not_over_reject` (8 shapes). |
| **S-3** — ~10 teaching sites migrated to threading | **done** | 14-no-node-boundary (×4), 03-error-handling (×2), 06-functions-closures (×5), 08-performance (×2 lines, 3 occurrences) → threading. Migration table below. |
| **S-4** — ID-31 threading-primary; 09-anti-patterns cross-ref added | **done** | `01-core-idioms` **ID-31** (`express`) + **ID-41** (`get`) rewritten threading-primary, bind secondary, bad example commented; `09-anti-patterns` gains **ID-47** (method-on-expression, Status **Compiler-enforced**) + summary-table row + tally bump (6→7 compiler-enforced). |
| **S-5** — `make test-docs` green | **done** (CC-attested) | `make test-docs` **476/0**; sweep now shows only documented-as-wrong `):kw` (comments/prose). |
| **S-6** — `make check` green, no source/test regressed | **done** (CC-attested) | `make check` ✓ (build + lint + test; docs 476/0). Corpus was 0-hits, confirmed no regression. |
| **S-7** — scoped diff (classifier + tests + guides only) | **done** | `git status`: `compile.rs`, `classifier/{forms,mod}.rs`, and 6 guide files. No unrelated drive-bys. |

## Guide-migration diff summary

**Teaching sites → threading** (each verified compiling under `make test-docs`):

| Site | Was | Now |
|------|-----|-----|
| 14-no-node-boundary:186–187 | `((new TextEncoder):encode "hello")` / `((new TextDecoder):decode bytes)` | `(-> (new TextEncoder) (:encode "hello"))` / `(-> (new TextDecoder) (:decode bytes))` |
| 14:224 | `((new TextDecoder):decode output:stdout)` | `(-> (new TextDecoder) (:decode output:stdout))` |
| 14:389 (table) | `((new TextEncoder):encode str)` | `(-> (new TextEncoder) (:encode str))` |
| 03-error-handling:211 | `(express errors):length` | `(-> (express errors) :length)` |
| 03:556 | `((log-request req):catch (fn …))` | `(-> (log-request req) (:catch (fn …)))` |
| 06-functions-closures:38/39 | `((get parts 0):trim)` / `((parts:slice 1):join "=")` | `(-> (get parts 0) (:trim))` / `(-> (parts:slice 1) (:join "="))` |
| 06:562 | `(#a(1 2 3):map double)` | `(-> #a(1 2 3) (:map double))` |
| 06:642 | `((parts:slice 1):join "=")` | `(-> (parts:slice 1) (:join "="))` |
| 06:988 | `((/ cents 100):toFixed 2)` | `(-> (/ cents 100) (:toFixed 2))` |
| 08-performance:71 | `((- t1 t0):toFixed 2)` ×2 | `(-> (- t1 t0) (:toFixed 2))` ×2 |
| 08:391 | `((express lines):join "\n")` | `(-> (express lines) (:join "\n"))` |
| **09-anti-patterns:405** ⚠ | `((log-request req):catch (fn …))` | `(-> (log-request req) (:catch (fn …)))` |

**Documented-as-wrong sites** (kept, repointed to threading):
- `01-core-idioms` **ID-31** / **ID-41** — threading is now the primary correct
  pattern; the bad example is a commented line (documents the compile error).
- `09-anti-patterns` **ID-47** (new) — the express/method-chain entry the arc06
  bootstrap issue flagged as missing; Status **Compiler-enforced**, cross-refs
  ID-31/ID-41.
- `09-anti-patterns:335` (`;; #a(10 9 2):sort`) — a comment illustrating sort
  order; untouched (not a method call, not compiled).

**Sweep after:** `grep -rnE '\):[a-zA-Z]' docs/guides/` → 9 hits, **all**
comments (`;;`) or prose/inline-code in ID-31/ID-41/ID-47 explanations. **Zero
live code teaches the trap.**

## Bubble-up to the arc (three questions)

**1. Did slice01 deliver the guarantee + docs correctness?** Yes. The compiler
rejects the trap at any depth with a threading fix-it; the docs no longer teach
it (they teach threading), and `make check`/`make test-docs` are green together.

**2. What the detection boundary revealed:**

- **Classifier-dispatch alone was insufficient — the trap is usually nested.**
  DD-64 §4 / the cc-prompt located the check in the classifier's call dispatch.
  Implemented there, it caught only *top-level* `((express p):join "")` — but
  `classify_form` classifies one top-level form at a time, and nested
  expressions (a `bind` value, a call argument — the common trap sites) are
  emitted lazily by the emitter as computed-head calls **without** re-running
  `classify_form`. So the classifier check let `(bind r ((express p):join ""))`
  through. **Resolution:** a recursive validation pass
  (`classifier::validate_method_calls`) that walks every form to any depth,
  wired into the compile pipeline next to D2's `validate_reserved_names` — the
  actual "cannot compile the wrong way" guarantee. The per-`classify_form` check
  is retained as fast `lykn check`-time feedback for top-level traps. **This is
  worth carrying to arc15 slice02/03: a "surface-syntax trap" that appears
  nested needs a tree-walk validator, not just a classify-dispatch branch.**
- **The general boundary is exactly as safe as DD-64 predicted — no
  over-rejection near-misses.** The rule "head is a `List`/`Cons` **and** arg0 is
  a `Keyword`" cleanly excludes threading steps (keyword head), IIFE/curried
  (non-keyword arg0), and atom methods. `#a(…)` literal receivers need no special
  case — `#a(1 2 3):map` reads as `((array 1 2 3) :map …)`, a List head, caught
  by the same rule (DD-64 §6 confirmed; test `dd64_array_literal_receiver_is_rejected`).

**3. Silent-drop diff (all sweep hits accounted):** the pre-change sweep had 18
`):kw` hits. **14 were live code that taught the trap → migrated** (the 13
enumerated + **09-anti-patterns:405**, which the cc-prompt/DD-64 enumeration
*missed* — the ID-20 fire-and-forget "Fix" `((log-request req):catch …)` in a
compiled fence; surfaced and migrated here). The cc-prompt's "ID-31
(1040/1257/1263)" spanned **two** entries — ID-31 (`express`) *and* ID-41
(`get`); both had uncommented bad examples that would now error, both rewritten.
The remaining hits are comments/prose kept as documentation, plus the new ID-47.
Nothing dropped.

## Discipline notes

- **Source:** `crates/lykn-lang/src/classifier/forms.rs` (the check, the
  recursive validator, 4 unit tests), `crates/lykn-lang/src/classifier/mod.rs`
  (re-export), `crates/lykn-cli/src/compile.rs` (pipeline step 2c). **Docs:** the
  6 enumerated guides. No warning-instead-of-error (hard error, S-1); no
  reader-grammar change (DD-64 §6); no over-rejection; no unrelated drive-bys
  (S-7). Sibling traps (ID-32 `return return`, ID-33 `\uNNNN`) **not** touched —
  they belong to arc15 slice03.
- **Codesigning note (host):** re-copying `bin/lykn` with a bare `cp` over the
  running binary invalidates its ad-hoc signature on Apple Silicon → `Killed: 9`
  on the next exec. Use `rm -f bin/lykn && cp …` (what `make build-release`
  does). Cost one confusing round of SIGKILLs mid-slice.
- Runtime rows (`make check`/`make test-docs`) CC-attested; reconcile on a host
  re-run. Closing report + ledger untracked at hand-off; source + guides land as
  a green increment.
