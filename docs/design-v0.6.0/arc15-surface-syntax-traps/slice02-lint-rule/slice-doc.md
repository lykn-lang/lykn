# arc15 · slice02 — Lint rule for method-on-expression (+ check parity)

> **Open set** (2026-07-22, CDC). The friendly-earlier-catch layer atop slice01's
> hard compile error (DD-64). Two parts: (1) an arc05 **lint rule** that flags
> the trap in `lykn lint` with the threading fix-it, and (2) wiring slice01's
> recursive validator into `check_strict` so **`lykn check` ≡ compile** on nested
> traps. Both **reuse slice01's detector** — one source of truth, no re-derivation.

## 1. Goal

After slice01 the trap `(<non-atom-head> :kw …)` is a hard compile error on every
compile path. slice02 makes the two *other* surfaces agree and teach:
- **`lykn lint`** surfaces it as an **Error** finding with the threading fix-it
  (it runs in `make check` and in editors/CI — the earliest, friendliest catch).
- **`lykn check`** (the bare syntax check) catches it at **any nesting depth**,
  closing slice01's carry-forward (today `check_strict` uses dispatch-only, so a
  nested trap that `build` rejects can pass `check`).

## 2. Scope

### In

- **Share slice01's detector (no duplication).** Expose a single per-node
  predicate from `classifier` (the logic already in
  `forms::check_method_on_expression`) so *both* the compile pipeline pass and
  the lint rule call it. The detection semantics do **not** change — reuse
  slice01's exactly (List/Cons head **and** keyword arg0; span on the receiver;
  the thread/bind/string-literal fix-it).
- **Lint rule** (`crates/lykn-cli/src/lint/`): a new `LintRule`
  (e.g. id `no-method-on-expression`), **`Severity::Error`** (consistent with
  `no-require`/`no-eval`), whose `enter` calls the shared predicate. Registered
  in `registry()`. The lint `walk` is already recursive → nested traps are caught
  with no extra machinery. Unit tests + a snapshot (matching the arc05 pattern in
  `lint/snapshots/`).
- **`check_strict` parity** (`compile.rs`): call `validate_method_calls` in
  `check_strict` (as `compile_source_inner` already does), so `lykn check`
  rejects nested traps too. ~4 lines.
- **guide-09 classification:** ID-47 (added slice01) moves from *compiler-enforced*
  to *compiler-enforced **+ linted*** in the guide-09 rule table.

### Out

- **Sibling traps** (ID-32 `return return`, ID-33 `\uNNNN`) — slice03.
- **Any change to detection semantics** — slice02 reuses slice01's predicate
  verbatim; if a boundary tweak is tempting, it belongs in slice01's pass (one
  place), not forked into the linter.
- `.lyk` kernel files — already exempt by lint's file scoping; no work.

## 3. Verification approach

- **CC** lands the rule + parity, attests `make check` green and the rule fires
  (Error) on the trap at top-level **and** nested, and `lykn check` now rejects a
  nested trap.
- **CDC** verifies against `lang`: the lint rule **calls the shared predicate**
  (grep — no duplicated detection logic), is `Severity::Error`, is registered,
  and `check_strict` calls `validate_method_calls`; the over-rejection carve-outs
  still hold (atom method / threading / IIFE / curried produce **no** finding);
  snapshot present. Runtime rows reconcile on host.

## 4. Exit criteria

1. `lykn lint` flags `(<non-atom-head> :kw …)` as an **Error** with the threading
   fix-it, at top-level and nested (rule uses the shared predicate).
2. No over-rejection: atom-method / threading / IIFE / curried / plain calls
   produce no finding (parity with slice01's carve-outs).
3. `lykn check` rejects a nested trap (`check_strict` wired) — `check` ≡ compile.
4. One source of truth: the lint rule and the compile pass call the **same**
   detector; no duplicated logic.
5. `make check` green; rule unit tests + snapshot added; guide-09 ID-47
   reclassified.

## 5. Consumes / feeds

Consumes slice01's `check_method_on_expression`/`validate_method_calls` and the
arc05 lint framework (`LintRule`/`registry`/resolution-aware `walk`). Feeds the
arc15 close (A-2) and gives the trap a home in `lykn lint`'s report. Mirrors
arc05's own rule pattern (Error-severity disallowed-construct rules).
