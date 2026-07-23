# CC Prompt — arc15 · slice01 · Reject method-on-expression + migrate guides

> **You are CC** (Claude Code, IC seat) on `~/lab/lykn/lang`, branch
> `release/0.6.x`. This slice lands a **compile error** (DD-64) and migrates the
> guide sites that teach the trap it rejects. Read
> `design/dd-64-method-on-expression-DRAFT.md`, `slice-doc.md`, and `ledger.md`
> (7 rows) first. Surface and self-stop; never work around a finding.

## Why this slice exists

`((express parts):join "")` compiles **silently wrong** to `parts.value("join",
"")` — a function call with the method name as a string, because `x:method`
sugar is atom-only and a parenthesized receiver detaches the `:method` into a
keyword arg (which stringifies). Operator decision (reversing an earlier defer):
fix it in **0.6.0** as a **compile error** with a threading fix-it. The correct
form is threading — `(-> (express parts) (:join ""))` — which already compiles
correctly (`apply_threading_step` → `(. acc method args)`).

**CDC already did the recon sweep** (recon-first): **0 hits in source/tests, 0 in
mycelium** (the error breaks no existing code), but **~13 guide sites** — ~10
*teach the trap*, ~3 *document it as wrong*. Those ~10 must migrate or
`make test-docs` breaks. The exact sites are enumerated below.

## What to do (MUST)

### 1 — The compiler error (the guarantee)

- In the classifier's **call dispatch**, detect a call form `(head arg0 …)` where
  `head` is **not an atom** (a `List` / data literal / compound expr) **and**
  `arg0` is a `Keyword`. Emit a **compile error** (not a warning), span on the
  receiver, with this fix-it:
  ```
  error: method call on a parenthesized expression is not supported
    ((express parts):join "")
     ^^^^^^^^^^^^^^^^ receiver is an expression, not a name
    help: thread the method call:  (-> (express parts) (:join ""))
          or bind first:           (bind v (express parts)) (v:join "")
    note: to pass a keyword string argument to a computed function, use a
          string literal:  ((express parts) "join" "")
  ```
- **Do NOT over-reject.** These MUST still compile (add positive tests):
  - atom method call `(x:m a)` → `x.m(a)`
  - threading `(-> (express x) (:m a))`, `(-> (new T) (:m a))`
  - compound head + **non-keyword** first arg: IIFE `((fn (x) …) 5)`, curried
    `((make-adder 3) 4)`
- **Negative tests** for the 3 canonical shapes: `((express p):join "")`,
  `((new TextEncoder):encode s)`, `((/ c 100):toFixed 2)` → each errors with the
  fix-it.

### 2 — Migrate the guide sites that TEACH the trap → threading

Convert each to the threading form (verify each compiles under `make test-docs`):

- `docs/guides/14-no-node-boundary.md` — L186 `((new TextEncoder):encode "hello")`,
  L187 `((new TextDecoder):decode bytes)`, L224 `((new TextDecoder):decode
  output:stdout)`, L389 (table) `((new TextEncoder):encode str)`
  → `(-> (new TextEncoder) (:encode "hello"))`, etc.
- `docs/guides/03-error-handling.md` — L211 `(express errors):length` →
  `(-> (express errors) :length)` (bare-keyword property step); L556
  `((log-request req):catch (fn …))` → `(-> (log-request req) (:catch (fn …)))`.
- `docs/guides/06-functions-closures.md` — L38 `((get parts 0):trim)`, L39/L642
  `((parts:slice 1):join "=")`, L562 `(#a(1 2 3):map double)`, L988
  `((/ cents 100):toFixed 2)` → threading each.
- `docs/guides/08-performance.md` — L71 `((- t1 t0):toFixed 2)` and
  `((- t2 t1):toFixed 2)`, L391 `((express lines):join "\n")` → threading.

### 3 — Repoint the "documented-as-wrong" sites (keep them, fix the *correct* side)

- `docs/guides/01-core-idioms.md` **ID-31** (L1040/1257/1263): rewrite so
  **threading is the primary correct pattern** and intermediate `bind` is
  secondary. Keep the "Bad" example as the *don't*.
- `docs/guides/09-anti-patterns.md`: L335 keep as a "wrong" note; **add the
  missing ID-31 cross-reference entry** (the arc06 bootstrap issue flagged that
  09-anti-patterns has no express/method-chain entry). Point it at threading.

### 4 — Verify

- `make check` green (S-6 — corpus was 0-hits, so this confirms no regression).
- `make test-docs` green (S-5 — every migrated block compiles/runs).
- Re-run the sweep and confirm only *documented-as-wrong* sites remain:
  `grep -rnE '\):[a-zA-Z]' docs/guides/` → hits only in ID-31 / 09-anti-patterns
  "don't" examples.

## MUST NOT

- **No warning-instead-of-error** — the operator decision is a hard error (S-1).
- **No reader-grammar change** to make `):method` lex as member access (DD-64 §6
  rejected it; threading is the one blessed form).
- **No over-rejection** of atom-method / threading / compound-head-non-keyword
  calls (S-2) — if a positive case would break, **self-stop and surface it**
  (the detection boundary may need refining, which is a CDC/operator call).
- **No unrelated drive-bys** — classifier + tests + the enumerated guide sites
  only (S-7). If you spot another trap (ID-32/ID-33), **route it to arc15
  slice03, don't land it here.**
- Never auto-pass `--allow-dirty`/`--force`/`--no-verify`.

## Close-set

Write `closing-report.md` in the slice dir with:

1. A **per-row ledger walk** S-1…S-7 (status + evidence).
2. The **guide-migration diff summary** — each enumerated site → its threading
   form, and confirmation the sweep now shows only documented-as-wrong hits.
3. **Bubble-up to the arc** (three questions): did slice01 deliver the guarantee
   + docs correctness; what (if anything) the detection boundary revealed
   (over-rejection near-misses, `#a(…)` literal handling); the silent-drop diff
   (all ~13 guide sites accounted — migrated or kept-as-documentation).

Then **stop** — CDC verifies the classifier-check location + guide diff against
`lang`, re-runs the sweep, and checks A-3…A-6. Runtime rows reconcile on host.
If you hit your context ceiling mid-slice, self-stop clean with a handoff
addendum (a recycle is not an iteration).
