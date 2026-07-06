# Slice 03: binding-walker + d2-validation — Closing Report

**By:** CC (Claude Code) · **Date:** 2026-07-06 · **Branch:** `release/0.6.x`
**Verdict: delivered.** DD-61 §A2's binding-position walker exists on both
backends (the single per-backend "what binds" component), the D2 reserved-word
validator rides it (all binding positions + `export` + `kernel:` name slot),
three-way list parity is enforced in `make check`, and the matrix re-probe shows
**only D2 rows moved** (→ rejects-cleanly, both backends). `make check` green;
suites 1387/0 (+19). Resolution-independent — no scope, no tags, no dispatch
changes (those are slices 04/05).

---

## Per-row ledger walk (5 rows)

**F-1 — Rust walker — MET.** `crates/lykn-lang/src/binding.rs`: `walk_bindings`
(recursive enumeration) + `bindings_introduced` (per-form; the D1 hook). Visits
every DD-60 binding position — `func`/`genfunc`/`fn`/`lambda`/`genfn` params
(reusing the classifier's `ParamShape` parsing so the typed/destructured/rest/
default grammar is never re-derived), `bind`, destructuring patterns, loop
bindings, class-method params, and `kernel:` declaration name slots — yielding
`(name, kind, span)`. 14 unit tests, one per position kind + nesting + negatives.
No behavior change.

**F-2 — JS walker + shared fixtures — MET.** `packages/lang/binding.js`, same
contract. **Shape-parity is pinned by shared fixtures**
(`test/expander/binding-walker-parity.test.js`, 16 cases): a reserved word in
each binding position must be rejected by **both** backends; the same word in a
non-binding position accepted by both — so the two walkers cannot disagree about
what binds without a red test. All 16 pass.

**F-3 — D2 both backends — MET.** Reserved word at any binding position →
compile error, DD-58-voice diagnostic (`'if' is a JavaScript reserved word and
cannot be used as a lykn <position>; rename it (e.g. \`if_\`)`). Covers `export`
(`(export (bind if 0))`) and the `kernel:` slot (`(kernel:const if 0)`) — both
reject on both backends. `deno check` confirms the previously-emitted `const if`
never reaches output. Placement (design sub-question 3): the `kernel:` check
lives in the **walker** at the binding-position level, not at escape-resolution
or emission — validity is not a macro concern (operator-confirmed), and the
span points precisely at the offending name.

**F-4 — three-way list parity — MET.** `test/expander/reserved-words-parity.test.js`
(A-7 precedent, three-way): Rust `RESERVED_WORDS` (parsed from `binding.rs`) ≡ JS
`RESERVED_WORDS` (imported) exactly; every listed word empirically fails
`const <name> = 0;` (no false entries); legal look-alikes (`async`/`await`/
`yield`/`get`/`of`/…) confirmed legal by the probe. **Seeded-drift demo:**
injecting `"widget"` into the JS list failed all three legs (Rust≢JS; "widget"
is legal; "widget" is a sentinel) — restored, green. List *completeness* is
covered by F-5 (a missed word leaves its D2 cell at invalid-output).

**F-5 — matrix re-probe + green bar — MET.** Re-probe vs the slice01 baseline:
**every reserved-word binding cell moved `✗inval` → `✗throw` (rejects-cleanly) on
both backends; every non-reserved cell is byte-identical** (surface forms,
controls, kernel-head legal-idents untouched — verified: the non-reserved-row
diff is empty). Backend disagreement dropped 312 → 208; the remaining 208 are
the **D1** cells (surface/kernel-form shadowing) that slices 04/05 own — no scope
leak from this slice. `make check` ✓ (~1m03s); `lykn test` **1387/0** (+19: 14
Rust walker + 16 walker-parity + 3 list-parity, minus overlap in counting).

---

## The re-probe delta (D2 only)

| Name class | Rust before → after | JS before → after |
|---|---|---|
| reserved words (`if`,`const`,`new`,`return`,`while`,`for`,`class`,…) | `✗inval` → **`✗throw`** | `✗inval`/`✗throw` → **`✗throw`** |
| surface forms (`fn`,`cell`,`obj`,…) | unchanged | unchanged |
| kernel-head legal-ident (`array`,`await`,`get`,…) | unchanged | unchanged |
| controls (`x`,`widget`,`result`) | unchanged | unchanged |

The D2 rows now **agree** across backends (both reject cleanly). The 30 Rust / 24
JS residual `invalid-output` are the degenerate `kernel:const`/`kernel:if`-as-a-
*name* probe cells — not real code and not D2 targets (you cannot write
`kernel:const` as an identifier).

---

## Walker hook-point notes (for slices 04/05)

The walker is **the** single source of what-binds per backend — D1 must consume
it, not re-derive position knowledge:

- **Rust D1 (slice04):** `binding::bindings_introduced(form) -> Vec<BindingSite>`
  is the env-extension hook — "entering this form, extend the resolver env with
  these names." Per DD-61 §A3 the classifier hosts the env and the expander gets
  a light binding-scan; both call this one function. It operates on raw `SExpr`,
  so the pre-classification expander-scan can use it directly.
- **JS D1 (slice05):** `bindingsIntroduced(form)` in `binding.js`, same contract,
  for threading through `expandExpr`. NB: the JS D2 runs at `expand()` entry on
  **surface** forms (the JS expander *lowers* surface→kernel during expansion, so
  params must be read before lowering); slice05's resolver threads through the
  same walk.

---

## Bubble-up to arc13

- **DD-60 binding-position list is INCOMPLETE — surfaced, not silently
  extended (evidence attached).** `if-let` and `when-let` bind pattern variables
  and are **not** in DD-60's enumerated list. They leak the ID-44 genus today:
  `(if-let (if x) …)` and `(when-let (for x) …)` compile at **rc=0** to invalid
  JS (`const if …`). `match` clause patterns are the same class (its bad example
  hit a different error first, but pattern vars bind identically). **Recommend a
  DD-60 refinement** adding `if-let`/`when-let`/`match` (all carry a `Pattern`)
  to the binding-position list; the walker addition is small and closes a real
  Principle-3 hole. Held out of this slice because the confirmed DD-60 list is
  explicit and I don't reinterpret it — operator confirms the refinement, then it
  folds into slice04/05 (or a fast-follow) and its D2 cells get pinned.
- **D2 timing asymmetry (parity of *lists*, not of *pass placement*).** Rust runs
  D2 post-expand (still surface); JS runs it at `expand()` entry (pre-lowering).
  Both validate surface forms, so user-written reserved names are caught
  identically. The edge: a *user macro that emits a reserved binding name* — Rust
  (post-expand) would catch it, JS (pre-expand) would not. Auto-gensym names
  can't be reserved, so the practical risk is nil; slice05's `expandExpr`-threaded
  resolver is the place to unify the timing if ever needed.
- **arc09 breaking note:** reserved-word names in binding positions now **error**
  (previously: invalid JS at rc=0 — never actually ran). No currently-*working*
  code breaks.
- **The walker is D1's chassis** — slices 04/05 hang the env on
  `bindings_introduced`/`bindingsIntroduced`; the matrix re-probe remains the
  A-4 convergence gate (208 D1 cells left to converge).

## Discipline notes

- Resolution-independent: no scope, no tags, no dispatch changes — only D2
  validation rides the new walker.
- Surfaced (not decided): the `kernel:` check placement, the DD-60 list
  incompleteness (if-let/when-let/match), the D2 timing asymmetry.
- Closing report untracked; `docs/design-v0.6.0/**` is CDC's. Source only.

Handed back for CDC verification → slice04 (rust-resolution) scopes against the
walker hook points.
