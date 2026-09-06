# CC Prompt — arc05 · slice03 · Linter resolution-consumer + context rules

> **You are CC** (Claude Code, IC seat) on `~/lab/lykn/lang`, branch
> `release/0.6.x`. Implement this slice against its `ledger.md` (read it
> first — its rows are the contract). Ground every change in the actual
> code; **surface and self-stop, do not decide silently** — this framework's
> self-stop has caught real CDC scoping errors (bootstrap §7). Commit
> **source only**; leave `docs/design-v0.6.0/**` to CDC.

## Context you need

arc13 (expander-coherence) closed 2026-07-09. It landed **Resolve-Once**
(DD-61): every atom carries a resolution tag, and a lexically-bound head is
no longer dispatchable. The compiler's dispatch sites already consume this.
**The linter does not yet** — and it is a mandatory consumer (DD-61 §A6
tooling accounting). That is this slice's spine.

Key facts (verified by CDC, but re-verify — rebuild first):

- `lykn_lang::resolver::resolve(&forms) -> Vec<SExpr>` is `pub`, structural,
  and idempotent; it tags atoms `BindingDef`/`BindingRef`/`Unresolved` by
  walking surface binding forms. `crates/lykn-cli/src/compile.rs` already
  calls it (3 sites). It does **not** require expansion to have run.
- `SExpr::as_form_head() -> Option<&str>` returns the name **only** for an
  `Unresolved` atom; `None` for a resolved def/ref (DD-61 §A6, `ast/sexpr.rs`).
- The linter (`crates/lykn-cli/src/lint/`) walks the **pre-expansion**
  reader SExpr. `atom_call` in `lint/rules.rs` is the shared helper every
  head-matching rule funnels through; it currently reads the head via
  `atom_parts()`. Two rules read a bare atom instead of a call head:
  `no-arguments` and `no-dirname-fixtures`.
- `LintContext` (`lint/mod.rs`) already carries `ancestors`/`source`/
  `parent()` as slice01-disclosed forward-API for the shadowing rule
  (currently `#[allow(dead_code)]`).
- `crate::binding::bindings_introduced(form)` is `pub`; the resolver's
  scoping helpers (`scope_plan`, `hoisted_names`, `ScopePlan`) are
  `pub(crate)`.

## What to do (MUST)

### 1. Make `lykn lint` a resolution consumer (ledger F-1, F-2, F-3)

1. In `lint_source` (or the walk), **resolve the reader forms** with
   `resolver::resolve` before running rules, so every atom carries its tag.
2. Route `atom_call`'s **head** through `as_form_head()` (not
   `atom_parts()`), so a bound head returns `None` and every head-matching
   rule falls through silently. Keep `atom_parts()` for **arg** inspection
   and spans (those are non-dispatch reads).
3. Fix the two atom-position rules (`no-arguments`, `no-dirname-fixtures`)
   to honour resolution: a bound atom of that name must not fire. Use the
   node's resolution tag (a bound atom is `BindingDef`/`BindingRef`).
4. **MUST-verify (surface if false):** confirm `resolve()` behaves
   correctly on **pre-expansion** input for lint's purposes — a user-macro
   call head stays `Unresolved` (lint still sees it), while `func`/`fn`/
   `bind`/`for-of`/pattern binders tag their refs. If `resolve()` assumes
   post-expansion structure anywhere that changes lint results, **stop and
   report** — do not paper over it.
5. Add **resolution fixtures** (both directions) per F-2/F-3: for each
   head-matching trigger, a bound-name fixture that lints silent and an
   unbound one that still fires.

### 2. The shadowing rule — ID-12, warn (ledger F-4, F-5, F-6)

6. Add a `Shadowing` rule flagging a lexical binding whose name is already
   bound in an **enclosing lexical scope** (nested param/`bind` reusing an
   outer name). Span → the shadowing def-site. Register it in `registry()`.
7. **MUST reuse the resolver's scope model — do not build a second scope
   decider in `lint/`.** This is the arc13 lesson turned on itself (N
   deciders diverge). Two acceptable routes — **pick one and record why**
   in the closing report:
   - (a) consume the **resolved tree** (`BindingDef` whose name is already
     active in the enclosing scope, tracked via the resolver's regions); or
   - (b) if that needs it, **expose a minimal `pub` helper from
     `lykn-lang`** that is the *same* scoping `resolver.rs` uses (e.g.
     promote `scope_plan`/`hoisted_names`, or a small scope-walk utility) —
     never a hand-rolled copy.
   If neither is clean without a larger `lykn-lang` change than a lint slice
   should carry, **stop and surface** — that is a re-slice signal, not a
   thing to force.
8. F-5 is load-bearing: the rule **must stay silent** on a param shadowing
   a **built-in form** (`array`, `cell`, …) — DD-60 D1 made that correct.
   Fixture it explicitly.

### 3. ID-42 re-answer — closes arc13 A-6 (ledger F-7)

9. **Do not add a reserved/form-named-param lint rule.** Write the
   disposition (a short DD-59 addendum note in the slice, and the one-line
   rationale for the closing report): reserved words at binding positions
   are **D2 compile errors** already; form-named params **legally shadow**
   via D1. The linter says nothing here. (CDC flips arc13 A-6 → done,
   pointing at this.) If, dogfooding, you find a *concrete* case where
   silence is actively harmful, **surface it** — but the default is no rule.

### 4. Dogfood — closes arc05 A-5 (ledger F-8)

10. `./bin/lykn build`, then run the resolution-aware `lykn lint` over
    `test/`, `examples/`, `packages/**` `.lykn` sources. Fix every finding
    that is a real defect; **acknowledge** the rest in a triage table (rule,
    site, why-benign) in the closing report. No code suppression mechanism
    this slice (that is slice04) — the triage table is the acknowledgement.

## Standing rules (MUST)

- **Rebuild first, every channel** (bootstrap traps #3, #4): `./bin/lykn
  build` before any deno/lint/matrix probe; the `lang/` import map resolves
  to `target/lykn/build/lang/`.
- **`./bin/lykn`, never bare `lykn`.**
- Never auto-pass `--allow-dirty`/`--force`/`--no-verify`; satisfy the gate.
- This slice should touch **no guide/doc**; if that changes, add
  `make test-docs` to your bar.
- **`make check` must be green** at close.

## Close-set (what to hand back)

Write `closing-report.md` in this slice dir with:

1. **A per-row ledger walk** — F-1…F-9, each with final status
   (`done`/`deferred`/`no-op`) and evidence (commit SHA + the Verify
   output). No prose summary in place of the walk; no silent drops (9 rows
   in, 9 out).
2. The **dogfood triage table** (F-8).
3. The **route you took for F-6/F-7** (scope-model reuse; ID-42 rationale).
4. **Bubble-up to the arc** (three questions): did slice03 deliver its
   assigned piece of arc05; what it revealed the arc-plan didn't anticipate
   (esp. anything that reshapes slice04 — suppression, `make lint`,
   guide-09, P-11); and the silent-drop diff (scope-as-specified vs
   delivered).

Then **stop** — CDC verifies, closes, and does the planning-doc + arc13
A-6 edits. If you hit your context ceiling mid-slice, self-stop cleanly
(tree green or reverted, nothing half-landed), write a handoff addendum
here, and hand back — a clean recycle is not an iteration (bootstrap §7.12).
