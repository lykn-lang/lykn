# CC Prompt — arc15 · slice02 · Lint rule for method-on-expression (+ check parity)

> **You are CC** (Claude Code, IC seat) on `~/lab/lykn/lang`, branch
> `release/0.6.x`. slice01 made the method-on-expression trap a **hard compile
> error** via the recursive `validate_method_calls` pass. slice02 gives the two
> other surfaces parity: a **`lykn lint` rule** and **`lykn check`** — both
> **reusing slice01's detector**, no duplication. Read `slice-doc.md` +
> `ledger.md` (7 rows) first. Surface and self-stop.

## Why this slice exists

The trap can't *compile* (slice01). But `lykn lint` (runs in `make check` / CI /
editors — the earliest catch) doesn't flag it yet, and `lykn check`
(`check_strict`) uses **dispatch-only** detection so a *nested* trap that `build`
rejects can slip past `check`. slice02 closes both, so all four surfaces —
compile, check, lint, guides — agree. The lint framework's `walk` is already
recursive, so nested coverage is free; the only rule is *don't fork the
detection*.

## What to do (MUST)

### 1 — Expose slice01's detector as the single source of truth

`crates/lykn-lang/src/classifier/forms.rs` has `check_method_on_expression`
(per-node) and `validate_method_calls`/`walk_method_calls` (recursive). Expose a
**per-node predicate** the lint rule can call (e.g. make
`check_method_on_expression` reachable via `classifier::`, or a thin
`method_on_expression_diagnostic(node) -> Option<Diagnostic>` wrapper). The lint
rule and the compile pass MUST share this — **do not reimplement the detection.**

### 2 — The lint rule

In `crates/lykn-cli/src/lint/`:
- New `LintRule` (suggested id **`no-method-on-expression`**), **`Severity::Error`**
  (consistent with `NoRequire`/`NoEval`). Its `enter` calls the shared predicate
  on the node and, on a hit, emits the diagnostic (the DD-64 thread/bind/string
  fix-it — reuse slice01's message).
- Register it in `registry()`.
- The lint `walk` already fires `enter` on every node → **nested traps caught
  automatically**; no per-rule recursion needed.
- Tests: express / `new` / arithmetic / `#a(…)` receivers → 1 Error each;
  **a nested case** (`(bind r ((express p):join ""))`) → 1 Error; negatives
  (atom method `(x:m a)`, threading `(-> (e) (:m a))`, IIFE `((fn (x) …) 5)`,
  curried `((add 3) 4)`) → **no** finding. Add a **snapshot** (arc05 pattern in
  `lint/snapshots/`).

### 3 — `lykn check` parity

In `crates/lykn-cli/src/compile.rs`, `check_strict`: call
`lykn_lang::classifier::validate_method_calls(&forms)` after `resolve` (as
`compile_source_inner` already does) and return its diagnostics as an error, so
a nested trap fails `lykn check` too. ~4 lines mirroring the existing block.

### 4 — guide-09 reclassification

`docs/guides/09-anti-patterns.md`: ID-47 (added slice01) → mark
**compiler-enforced + linted** in the rule-classification table (it now has a
lint rule, not only the compiler error).

### 5 — Verify

`make check` green (rule tests + snapshot pass; nothing regressed). Confirm the
rule fires on the nested case and `lykn check` rejects it.

## MUST NOT

- **Do not reimplement or fork the detection** — reuse slice01's predicate (S-1).
  If the boundary needs a tweak, that's a slice01-pass change (one place), not a
  divergent lint copy.
- **Do not change detection semantics** (the carve-outs are slice01's; keep
  parity). No over-rejection of atom-method / threading / IIFE / curried (S-3).
- **Do not touch the sibling traps** (ID-32/ID-33) — slice03.
- Never auto-pass `--allow-dirty`/`--force`/`--no-verify`.

## Close-set

Write `closing-report.md` with:

1. A **per-row ledger walk** S-1…S-7 (status + evidence).
2. A **one-liner** confirming the lint rule and compile pass call the *same*
   predicate (paste the call sites).
3. **Bubble-up to the arc** (three questions): did slice02 give lint + check
   parity with compile; anything the framework revealed (e.g. resolution-aware
   `walk` interactions, snapshot churn); the silent-drop check (all four surfaces
   — compile/check/lint/guides — now agree).

Then **stop** — CDC verifies the shared-predicate reuse, severity, registration,
`check_strict` wiring, and snapshot against `lang`. Runtime rows reconcile on
host. If you hit your context ceiling, self-stop clean with a handoff addendum.

## Host note (from slice01)

On Apple Silicon, re-copy the binary with `rm -f bin/lykn && cp …` — a bare `cp`
over the running binary invalidates its signature (`Killed: 9`).
