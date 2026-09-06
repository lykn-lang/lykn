# Slice 03: binding-walker + d2-validation

> The re-slice's first implementation unit (DD-61 · Resolve-Once, operator-confirmed
> 2026-07-06): build **the binding-position walker** on each backend — the
> single per-backend component that knows *what binds* — and ship the **D2
> reserved-word validator** riding it. Resolution-independent (no scope, no
> tags, no dispatch changes), so it lands while slices 04/05 implement D1
> on the chassis this slice builds.

## Goal

One walker per backend enumerating every binding position (params of
`func`/`fn`/`genfunc`/`genfn`/`lambda`, `bind`, destructuring patterns,
loop bindings, class-method params — DD-60's list); the D2 validator as its
first client: a JS reserved word in any binding position — **including
`export`ed names and the `kernel:` escape's name slot** — is a compile
error with a proper diagnostic, on **both** backends. The matrix's D2 rows
flip to `rejects-cleanly`; every other cell is untouched.

## Grounding

- The four-site finding (slice02 self-stop) means D2 must NOT be built into
  any one dispatch site — the walker is a *new, single* component that both
  D2 (validate at binding positions) and D1 (extend the env at binding
  positions — slices 04/05) consume. Its per-backend duplication is the
  irreducible two-implementation minimum; its *shape knowledge* must match
  across backends — pin with shared fixtures.
- Rust precedent: the `check_loop_binding` guard (arc05/slice02) — same
  pattern, generalized. CC's validated EmitterContext notes (slice02
  hand-off) inform where walking is cheap.
- Reserved-word list: DD-60 D2's authority is **empirical** (`const <name>
  = 0` parse test). The embedded lists (one per backend) parity-test
  against `tools/conformance-matrix.js`'s legality function — and against
  *each other* (three-way: Rust list = JS list = probe).
- JS wrinkle from the matrix: JS currently throws from the binding site for
  macro-named params — that's dispatch-into-binding-positions, which is
  slice05's fix. This slice's walker must *identify* binding positions
  without changing their expansion behavior yet (validator-only).

## Scope (in)

1. **F-1** — the walker, Rust (`crates/`): visits every DD-60 binding
   position, yielding (name, position-kind, span); no behavior change.
2. **F-2** — the walker, JS (`packages/lang/`): same contract; shared
   fixture corpus pins shape-knowledge equality across backends.
3. **F-3** — D2 validator on both backends: reserved word at any binding
   position → compile error (diagnostic names the word + the fix; DD-58
   voice); covers `export` and `kernel:` name slots.
4. **F-4** — three-way list parity test (Rust list ≡ JS list ≡ probe
   legality), in `make check`; seeded-drift demo.
5. **F-5** — matrix re-probe: **only** D2 rows move (→ `rejects-cleanly`
   both backends); all other columns byte-identical to baseline.

## Scope (out)

- Any scope/env/tag work (slices 04/05); any dispatch-site change.
- Guide updates beyond diagnostics (arc05 resume / arc07).

## Verification approach

Rebuild-first; `make check` ✓; suites at baseline (+ validator tests);
matrix re-probe diff shows exactly the D2 delta; snapshots reviewed;
`./bin/lykn` everywhere.

## Exit criteria

D2 rows converged on both backends; walker APIs in place with shared
fixtures proving shape-parity; three-way list parity in `make check`;
baseline elsewhere untouched. Bubble-up: walker API notes for slices 04/05
(the env-extension hook points), and the arc09 breaking note (reserved-word
names now error — they previously produced invalid JS at rc=0).
