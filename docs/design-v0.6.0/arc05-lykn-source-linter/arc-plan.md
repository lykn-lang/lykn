# arc05 — Lykn-Source Linter (`lykn lint`)

> **Status: Open — not started.** Planned at capability depth only, per *plan
> late, plan deep*: no slice breakdown until the arc becomes active. The
> originating thread is preserved at `design/kickoff-thread.md` (was tracked as
> M12, "the most substantive Phase 2 open milestone").

## 1. Capability

`lykn lint` lints **Lykn source** (`.lykn` files) for stylistic and semantic
patterns — anti-patterns, idiom, style — **not** compiled JS (that was Deno's
`deno lint`, now removed from the user surface per philosophy commitment #2,
Option A) and **not** mere syntax errors (`lykn check` already covers those).
The rule-set seed is `docs/guides/09-anti-patterns.md` plus the surface-forms
reference.

**Corpus division (settled by arc10, 2026-07-05):** the **compiler** owns the
closed declaration-form namespace — the 5 kernel-only heads are compile
errors on both compilers, incl. via macros (DD-58 strict + the macro-boundary
sweep) — so the linter owns **idiom/style only**: the operator/expression
anti-patterns (`==`/`===`-vs-`=`, `&&`/`||`-vs-`and`/`or`, `require`→invalid
ESM, IIFE, `or`-vs-`??`, `:sort`, `for-in`, boolean params, catch-and-log,
`cell`-when-pure, `js:`-overuse, …). `09-anti-patterns.md` needs the
"ELIMINATED" reclassification per the CC audit + slice01's ID-38 reframe.

**Seed additions from arc11/slice02 (2026-07-05, buried-intent audit):**
repo-test-suite conventions the compiler can't enforce (`test/CONVENTIONS.md`
is the spec):
- reject **relative source imports** in `.lykn` test files (require bare
  import-map specifiers) — the April-fossil failure class;
- reject **`import.meta.dirname`-anchored fixture paths** in test files
  (require `Deno.cwd()`-anchored) — the location-dependence class slice01
  fixed 5 instances of.

**Explicitly out of scope** (from the thread): `deno lint` integration;
`lykn fmt` (separate command); typechecking/inference (Rust analysis layer
already handles it); LSP server work (Phase 3+).

## 2. Slice breakdown

_Not yet planned._ The thread estimates 3–5 iterations of substantial new work.
When this arc becomes active, break it into slices (e.g.: lint-pass
infrastructure over the reader AST → an initial rule corpus from
`09-anti-patterns.md` → `lykn lint` CLI wiring + "not implemented yet" surface
removal → rule expansion) and write each slice's open set then. Apply the
sizing judgment (PROJECT-MANAGEMENT.md Part I) per slice.

## 3. Dependencies

Consumes: arc03's coherent surface + canonical-form discipline (lint rules
reason about surface forms). Independent of arc04. Feeds project-ledger row
P-11.

## 4. Arc ledger

_Opens when the arc-plan is detailed._ The class-(b) composition row will be
"`lykn lint` flags seeded anti-patterns in a fixture and stays silent on clean
idiomatic source," reproduced at arc scale.

## 5. Version History

### v1.1 — 2026-07-05 (corpus division settled; arc11 seed additions)
Recorded the arc10-settled corpus division (compiler owns the closed 5-form
namespace everywhere incl. the macro boundary; linter owns idiom/style) and
added two rule candidates from arc11/slice02's buried-intent audit
(relative-source-imports and `import.meta.dirname` fixture anchoring in test
files — enforcing `test/CONVENTIONS.md`). Surfaced by: arc10 close + arc11
slice02 bubble-up.

### v1.0 — 2026-06-28 (reconstructed)
Capability statement recovered from the linter kickoff thread; arc seeded, not
slice-planned.
