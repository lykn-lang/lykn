# arc15 · slice03 — Type-safe method-check (post-classification hardening)

> **Open set** (2026-07-22, CDC). Removes the `is_match_clause` / `ptr::eq`
> carve-out (slice02/B) by moving the method-on-expression check **after
> classification**. **Corrected premise (recon):** `SurfaceForm` variants hold
> raw `SExpr` children, so there is *no* fully-typed tree and a method-call is
> *not* a distinct node type — my earlier "typed-tree" framing was wrong. What
> *is* true: `classify_match` consumes `:when` into a typed
> `MatchClause { pattern, guard, body }`, so **after classification the
> `((pattern) :when …)` shape no longer exists** — the collision dissolves by
> construction. The type doing the work is `MatchClause`, not a method-call node.

## 1. Goal

Make the method-on-expression guarantee rest on **types, not a pointer-identity
convention**: run the shape-check over the **classified `SurfaceForm` forms**
(descending into their raw `SExpr` children). Because match clauses are
destructured (`:when` gone) and the walk is an **exhaustive `match`** (a missing
variant is a *compile error*), the guarantee is complete-by-construction with
**no carve-out, no `ptr::eq`, no magic keyword**.

## 2. Scope

### In

- **Post-classify pass** `validate_method_calls(forms: &[SurfaceForm]) -> Vec<Diagnostic>`:
  - Walk each `SurfaceForm` via an **exhaustive `match self { … }` — NO `_ =>`
    wildcard** (so a future variant fails to compile until handled: the
    completeness guarantee).
  - For each variant, (a) recurse into `Box<SurfaceForm>` children (`Async.inner`,
    `Export.inner`) as `SurfaceForm`; (b) run the recursive **raw-shape check**
    (`check_method_on_expression` + descent into `SExpr::List`/`Cons`) on every
    **raw `SExpr` child** — `Bind.value`, `Match.target` + each
    `MatchClause.guard`/`.body`, `FuncClause.body`, `Fn`/`Lambda`/`Genfn.body`,
    `FunctionCall.head`/`.args`, `Set`/`Reset`/`Swap`/`Conj`/`Assoc`/`Dissoc`,
    `Eq`/`And`/`Or`/`Not`, `KernelPassthrough.raw`, `IfLet`/`WhenLet`,
    class members, threading steps, etc.
  - **No `:when` carve-out, no `is_match_clause`, no `ptr::eq`** — the
    `MatchClause` destructuring means the pass never encounters the colliding
    shape (a `((pattern) :when …)` list is now a `pattern` + a `guard` expr,
    checked separately).
- **Rewire the guarantee to post-classify:** in `compile_source_inner` (and
  `check_strict`), run the new pass **after** `classify_with_options` (on the
  `Vec<SurfaceForm>`), **replacing** the pre-classify
  `validate_method_calls(&forms)` call. **Delete** the old pre-classify pass,
  `is_match_clause`, and the parent-aware `walk_method_calls`. Keep
  `check_method_on_expression` (pure shape) as the per-node predicate.
- **Preserve behaviour exactly** (parity with slice01/02/B): every trap slice01+B
  caught still errors (express/new/arith/`#a(…)`, nested, deep); match guards
  never flagged; `((expr):when x)` *outside* a match still flagged; `.lyk`/kernel
  handling unchanged.
- **Tests:** the parity set on the post-classify pass — nested traps flagged (via
  the raw children), guarded-match **not** flagged (no exemption needed —
  `MatchClause`), subject/body traps flagged, `((express p):when x)` flagged;
  a test that the walk is exhaustive (documented) ; `make check` green.

### Design decision — the lint rule's fate — **RESOLVED: RETIRE** (operator, 2026-07-22)

slice02's `no-method-on-expression` **lint rule walks raw `SExpr`** (pre-classify,
by design — lint reports on source shape). Post-hardening it would **regain the
collision** unless it keeps a structural skip. Options:
- **(rec) Retire the lint rule** — the post-classify **compiler + `lykn check`**
  hard-error is now the clean guarantee, and the rule is both the redundant
  surface *and* the last `is_match_clause`/`ptr::eq` user. Retiring it fully
  achieves the hardening (zero fragility anywhere). **Keep guide ID-47.** This
  revisits slice02's "both mechanisms" — justified by the changed landscape
  (the compiler check is now clean + `check` parity covers `lykn lint`'s window).
- **Keep it** — only with a structural skip that is *not* `ptr::eq` (span-based,
  or lint classifies — but classify-in-lint makes lint depend on classify-ability,
  a lenience regression). Retains an advisory-only exemption.

**Operator nod needed before touching the lint rule** (per §4). The core
post-classify hardening does **not** depend on this.

### Out

- Any change that makes classification fully type nested exprs (a classifier
  rewrite — not this).
- Sibling traps (ID-32/ID-33) — slice04.

## 3. Verification approach

- **CC** lands the post-classify pass + rewiring + tests, attests `make check`
  green and the parity set.
- **CDC** verifies against `lang`: the pass is an **exhaustive** match (no `_`);
  the `SExpr`-child coverage is complete (cross-check field-by-field against the
  `SurfaceForm` enum + sub-structs); `is_match_clause`/`ptr::eq`/the pre-classify
  pass are **gone**; the guarantee runs after classify in both compile + check;
  parity tests hold. Runtime rows reconcile on host.

## 4. Exit criteria

1. Method-on-expression guarantee runs **post-classification** (compile +
   `check`), via an **exhaustive** `SurfaceForm` walk — a missing variant is a
   compile error.
2. `is_match_clause`, `ptr::eq`, the `:when` carve-out, and the pre-classify
   parent-aware walk are **removed**.
3. Full parity: all prior traps flagged (incl. nested/deep); match guards not
   flagged; `((expr):when x)` outside a match flagged.
4. Lint-rule fate resolved per the operator nod (retire, or keep-with-structural-
   skip); guide ID-47 retained.
5. `make check` green; scoped diff.

## 5. Consumes / feeds

Consumes slice01/02/B (the shape predicate `check_method_on_expression`, the
tests) + the classifier's `SurfaceForm`/`MatchClause` types. Closes the arc15
trap-hardening; leaves slice04 (sibling traps) as the remaining arc15 work.
Delivers the "protect with a type" the operator asked for — realized as
`MatchClause` destructuring + an exhaustive-match completeness guarantee, not the
(false) method-call-as-a-type framing.
