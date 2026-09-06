# arc15 · slice01 — Reject method-on-expression + migrate guides

> **Open set** (2026-07-22, CDC). arc15's core capability, DD-64. Couples the
> **compiler error** with the **guide migration** because the error breaks the
> ~10 guide sites that teach the trap — they land as one green step. CDC did the
> recon sweep (below); CC lands the change on the host.

## 1. Goal

Make `((express parts):join "")` and every `(<non-atom-head> :kw …)` shape a
**compile error** with a threading fix-it, and migrate the guide examples that
currently teach the trap so `make check` **and** `make test-docs` are green
together. After this slice, a user cannot compile method-call-on-an-expression;
the docs teach threading instead.

## 2. Scope

### In

- **Classifier error** (DD-64 §4): in a call form `(head arg0 …)` where `head`
  is **not an atom** (list / data literal / compound) **and** `arg0` is a
  `Keyword`, emit a compile error with the DD-64 fix-it (thread / bind / string-
  literal note). Point the span at the receiver.
- **Positive preservation** (anti-over-rejection): atom method calls
  (`(x:m a)`), threading (`(-> (express x) (:m a))`), and legitimate calls with
  a compound head but *non-keyword* first arg (IIFE `((fn (x) …) 5)`, curried
  `((make-adder 3) 4)`) must **still compile**. Tests for each.
- **Guide migration** — the ~10 sites that *teach* the trap → threading:
  - `14-no-node-boundary.md:186,187,224,389` — `(new TextEncoder):encode` /
    `(new TextDecoder):decode` → `(-> (new TextEncoder) (:encode …))` etc.
  - `03-error-handling.md:211` `(express errors):length` →
    `(-> (express errors) :length)` (property) ; `:556` `(log-request req):catch`
    → `(-> (log-request req) (:catch …))`.
  - `06-functions-closures.md:38` `(get parts 0):trim`, `:39/:642`
    `(parts:slice 1):join`, `:562` `#a(1 2 3):map`, `:988` `(/ cents 100):toFixed`.
  - `08-performance.md:71` `(- t1 t0):toFixed` ×2, `:391` `(express lines):join`.
- **Repoint the "documented-as-wrong" sites** (keep as teaching, update the
  "correct" side to threading): `01-core-idioms.md` ID-31 (1040/1257/1263) —
  rewrite so **threading is the primary fix**, intermediate bind secondary;
  `09-anti-patterns.md:335` and add the **missing ID-31 cross-reference** (the
  bootstrap issue flagged 09-anti-patterns has no entry).
- **Verify** `make check` + `make test-docs` green; re-run the CDC sweep and
  confirm every remaining `):kw` hit is a documented-as-wrong example.

### Out

- The **lint rule** (slice02) — the compiler error is the guarantee here; the
  friendly earlier catch is next.
- **Sibling traps** ID-32/ID-33 (slice03).
- Any reader-grammar change to make `):method` lex as member access — DD-64 §6
  rejected that; threading is the blessed form.

## 3. Verification approach

- **CC** lands the change on the host and attests `make check` + `make test-docs`
  green, with the error's fix-it message shown for the 3 canonical shapes
  (express / `new` / arithmetic) and the positive forms still compiling.
- **CDC** verifies against `lang`: the classifier check is where DD-64 says (call
  dispatch, non-atom head + keyword arg0); the guide diff migrates exactly the
  enumerated sites and introduces no *new* `):kw` teaching site; re-runs the
  sweep for completeness. Runtime rows reconcile on host.
- Deliverable: source (classifier + tests) + guide edits + `closing-report.md`.

## 4. Exit criteria

1. `(<non-atom-head> :kw …)` is a compile error with the DD-64 fix-it; the 3
   canonical shapes rejected (A-3).
2. Threading + atom-method + compound-head-non-keyword forms still compile;
   positive tests green (A-4).
3. The ~10 teaching sites migrated to threading; ID-31 / 09-anti-patterns
   repointed; no new teaching site (A-5).
4. `make check` + `make test-docs` green; sweep shows only documented-as-wrong
   `):kw` hits remain (A-5/A-6).
5. No existing source/test regressed (corpus was 0-hits; A-6).

## 5. Consumes / feeds

Consumes threading (`apply_threading_step`) + classifier dispatch + the CDC
sweep. Feeds slice02 (lint reuses the detection), arc15 close (A-1/A-3…A-6), and
arc07 (the broader guide pass inherits clean trap sites). Mirrors the
recon-first openers (arc13 conformance matrix, arc05 F-1, arc06 slice02): map
ground truth first (done — the sweep), then land the fix against it.
