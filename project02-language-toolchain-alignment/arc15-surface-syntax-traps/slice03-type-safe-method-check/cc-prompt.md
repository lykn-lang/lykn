# CC Prompt — arc15 · slice03 · Type-safe post-classification method-check

> **You are CC** on `~/lab/lykn/lang`, `release/0.6.x`. This hardens slice01/02/B:
> move the method-on-expression guarantee **after classification**, removing the
> `is_match_clause`/`ptr::eq`/`:when` carve-out entirely. Read the slice02
> `cdc-verification-followup-B.md` + this slice's `slice-doc.md`/`ledger.md`
> (7 rows) first. Surface and self-stop.

## Why (the corrected premise — read carefully)

The carve-out exists because the check runs **pre-classification**, on raw forms,
where a guarded match clause `((Some v) :when …)` and the trap `((express p):join …)`
are the **same shape**. But `classify_match` **consumes `:when` into a typed
`MatchClause { pattern, guard: Option<SExpr>, body: Vec<SExpr> }`** — so **after
classification the `((pattern) :when …)` shape does not exist**. Running the check
on the classified `SurfaceForm` tree therefore needs **no exemption**: the
`MatchClause` type dissolves the collision. (Note: `SurfaceForm` variants hold
raw `SExpr` children — there is no fully-typed tree and a method-call is *not* a
distinct node type; the walk still descends into raw `SExpr` children. The type
protection is `MatchClause` + an **exhaustive match**, not a method-call node.)

## What to do (MUST)

### 1 — The post-classify pass
- Add `validate_method_calls(forms: &[SurfaceForm]) -> Vec<Diagnostic>` (replaces
  the raw-forms version). Walk each `SurfaceForm` with an **exhaustive
  `match form { … }` — NO `_ =>` wildcard** (S-2: a new variant must fail to
  compile until handled).
- Per variant:
  - Recurse into `Box<SurfaceForm>` children (`Async.inner`, `Export.inner`) via
    the same pass.
  - Run the recursive **raw-shape check** (`check_method_on_expression` + descent
    through `SExpr::List`/`Cons`) on **every raw `SExpr` child**. Cover them all —
    `Bind.value`, `Match.target` + every `MatchClause.guard`/`.body`,
    `Func`/`Genfunc` clause bodies, `Fn`/`Lambda`/`Genfn.body`,
    `FunctionCall.head`+`.args`, `Cell`/`Express`/`Set`/`Reset`/`Swap`/`Conj`/
    `Assoc`/`Dissoc`, `Eq`/`NotEq`/`And`/`Or`/`Not`, `IfLet`/`WhenLet`,
    `Class`/`ClassExpr` members, `Obj`/`Type` sub-exprs, threading `steps`,
    `MacroDef`/`ImportMacros.raw`, **`KernelPassthrough.raw`** (preserve current
    behaviour). **A skipped `SExpr` field = a missed trap (S-3).**
- **`check_method_on_expression` stays the pure per-node shape predicate** (List/
  Cons head + keyword arg0). **Delete** `is_match_clause`, `ptr::eq`, the `:when`
  special-case, and the pre-classify parent-aware `walk_method_calls`.

### 2 — Rewire the guarantee to post-classify
- In `compile_source_inner`: run the new pass **after** `classify_with_options`
  (on the resulting `Vec<SurfaceForm>`), **removing** the pre-classify
  `validate_method_calls(&forms)` block. Same in `check_strict` (classify, then
  the pass) — so `lykn check` ≡ compile still holds.

### 3 — Retire the lint rule (operator-confirmed 2026-07-22)
- **Delete** the `no-method-on-expression` lint rule: remove the
  `NoMethodOnExpression` struct (`lint/rules.rs`) and its `registry()` entry
  (`lint/mod.rs`). Remove/adjust the rule's snapshot + unit tests.
- **Keep guide ID-47** — the trap stays a hard compile+check error; the docs
  entry stands (it's compiler-enforced, no longer also-linted).
- With the rule gone and the compile/check pass now post-classify,
  **`is_match_clause` has no remaining caller — delete it (with `ptr::eq`)**,
  completing the fragility removal (S-4). **Grep first** to confirm no other
  caller before deleting.

### 4 — Tests + verify
- Parity set on the new pass: express/new/arith/`#a(…)` + **nested** (`bind`
  value) + **deep** (arg) flagged; guarded match `(match x ((Some v) :when (> v 0)
  "p") (_ "n"))` **not** flagged (no exemption); trap in match **subject** and in
  a clause **body** flagged; `((express p):when arg)` **outside** a match flagged.
- `make check` green.

## MUST NOT

- **No `_ =>` wildcard** in the `SurfaceForm` walk (S-2 — completeness must be
  compile-enforced).
- **No `is_match_clause` / `ptr::eq` / `:when` special-case** anywhere (S-4 — the
  whole point).
- **No classifier rewrite** to type nested exprs — descend into raw `SExpr`
  children; that's expected.
- **Retire** the lint rule (operator-confirmed) — don't keep a structural skip.
- Never auto-pass `--allow-dirty`/`--force`/`--no-verify`.

## Close-set

Write `closing-report.md`: the 7-row ledger walk (paste the exhaustive `match`
arms proving full `SExpr`-child coverage; the removed `is_match_clause`/`ptr::eq`;
the parity results); a one-liner confirming the pass runs after classify in both
compile + check; and a bubble-up — did the post-classify move remove the fragility
with full parity; the lint-rule fate as applied; anything the `SExpr`-child
enumeration surfaced (a variant whose children were easy to miss).

Then **stop** — CDC field-by-field cross-checks the `SExpr`-child coverage +
exhaustiveness against `lang`, confirms the carve-out is gone, and verifies
parity. Runtime reconciles on host.

## Host note

Apple Silicon: `rm -f bin/lykn && cp …` (bare `cp` over the running binary →
`Killed: 9`).
