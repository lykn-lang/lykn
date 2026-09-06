# arc05 · slice03 — Linter resolution-consumer + context rules

> **Open set** (written 2026-07-21, CDC). The resume of arc05 after the
> arc13 detour. This is the **code-correctness** half of the old
> "slice03 = context-rules + docs" bundle; the productionization + docs +
> arc-close half is **slice04** (suppression mechanism, `make lint`
> wiring, guide-09/15 reclassification, SKILL note, the P-11 demo, arc
> close). The 1→2 split is recorded in `arc-plan.md` v1.6 with the
> which-child rationale.

## 1. Goal

Make the linter **semantically correct on true lexical scoping** — the
consequence arc13 was run to enable — and answer the two rule questions
that were parked pending the fixed compiler state:

1. **`lykn lint` consumes resolution** (DD-61 §A6's tooling accounting:
   the linter is a mandatory consumer). Its head-matching rules run over
   the *pre-expansion* reader SExpr, where a bound name (a param named
   `parseInt`, a `bind` named `require`) would false-positive against the
   rule's literal head string. After this slice, a lexically-bound head is
   treated as a call to the binding — no rule fires on it — exactly as
   every compiler dispatch site now behaves.
2. **The shadowing rule (guide ID-12)** lands, riding arc13's resolution
   machinery rather than the never-built `analysis/scope.rs` sketch —
   flagging a lexical binding that shadows an **outer lexical binding**
   (the confusing-reuse case), *not* a binding that shadows a built-in
   form (which arc13 made correct-by-design, DD-60 D1).
3. **The ID-42 question is re-answered from the fixed state** — closing
   **arc13 A-6** (the one arc13 ledger row left open by design, whose
   Verify *is* this scoping note). Reserved words at binding positions are
   already D2 compile errors; form-named params legally shadow via D1. The
   disposition is **no lint rule** (rationale in §4 / the ledger).
4. **The linter is dogfooded** on the repo's own `.lykn` sources with the
   resolution-aware finding set — closing arc05 **A-5**.

## 2. Scope

### In

- **Resolution-awareness (the §A6 consumer obligation).** Resolve the
  linter's pre-expansion forms with the existing `lykn_lang::resolver`
  and route the rules' shared head accessor through the resolution tag so
  bound heads are never matched. Ground: `resolver::resolve` is `pub`,
  structural (tags surface binding forms without requiring expansion),
  already called at three sites in `crates/lykn-cli/src/compile.rs`;
  `SExpr::as_form_head()` already returns `None` for a resolved
  binding-ref/def. The single change point is `atom_call` in `lint/rules.rs`
  (every head-matching rule funnels through it) plus the two
  atom-position rules (`no-arguments`, `no-dirname-fixtures`) that read a
  bare atom rather than a call head.
- **The shadowing rule (ID-12), warn**, reusing the resolver's scope
  model. **MUST NOT** introduce a second, divergent scope decider — that
  is the exact failure arc13 exists to kill. Reuse `resolver`'s scoping
  (expose a minimal helper from `lykn-lang` if the current `pub(crate)`
  surface is insufficient) or consume the resolved tree's
  `BindingDef`/`BindingRef` tags directly.
- **The ID-42 re-answer** as a written disposition that closes arc13 A-6.
- **Dogfood pass (A-5)**: run the resolution-aware `lykn lint` over
  `test/`, `examples/`, `packages/**` `.lykn` sources; every finding
  fixed or acknowledged in a triage table with rationale.

### Out (→ slice04, named not dropped)

- **Lint-suppression mechanism** (comment/directive-based disable) — its
  own feature; depends on the reader preserving comments; sized in slice04.
  Dogfood acknowledgement in this slice uses a triage table, not code
  suppression.
- **`make lint` / `make check` wiring** of `lykn lint` (the `make lint`
  target exists but runs clippy/fmt/JS-lint + `lykn check`, not the source
  linter). Deferred so a red dogfood cannot break `make check` mid-arc.
- **guide-09 reclassification** (arc05 A-6 label pass), guide-15 CLI docs,
  SKILL note.
- **The P-11 demo** (arc05 A-4) and the **arc close**.

## 3. Verification approach

- **Rust unit + fixtures** in `crates/lykn-cli/src/lint/` (the existing
  `#[cfg(test)]` harness): per-rule both-directions fixtures, plus new
  **resolution fixtures** proving bound heads don't fire (a param/`bind`
  named after each head-matching rule's trigger → silent) and unbound
  heads still fire.
- **`insta` snapshots** for the shadowing rule's text + JSON output
  (never auto-accepted).
- **Standing `make check`** green (the canonical bar); **`make test-docs`**
  only if a guide/doc is touched (this slice should touch none — docs are
  slice04).
- **CDC verification** is git-ancestry + code-review + grep (sandbox has
  no toolchain, bootstrap §3); the runtime rows (`make check`, dogfood
  run) are **CC-attested**, reconciled by an operator host re-run.

## 4. Exit criteria

1. `lykn lint` resolves before matching; no head-matching rule fires on a
   lexically-bound head; the two atom-position rules honour resolution
   too. Resolution fixtures green.
2. The shadowing rule (ID-12) flags outer-lexical shadowing, stays silent
   on form-shadowing (D1) and on non-shadowing rebinds; it reuses the
   resolver's scope model (no parallel decider — grep proves one scoping
   source).
3. arc13 **A-6 closed**: the ID-42 re-answer is written with rationale
   (disposition: no rule, D1/D2 cover it).
4. arc05 **A-5 closed**: dogfood run clean or fully triaged.
5. `make check` green; the diff is source-only (planning edits are CDC's
   separate commit).

## 5. Consumes / feeds

Consumes arc13's Resolve-Once machinery (DD-61: `resolver::resolve`,
`SExpr::as_form_head`, `crate::binding::bindings_introduced`) and arc10's
corpus division. Feeds **slice04** (which closes A-4/A-6 and the arc) and,
through it, **P-11**. Sequence unchanged: arc05 → arc06 → arc07 → arc09.
