# arc06 — Closing Report (Cross-Project Dependency Ergonomics)

**By:** CDC · **Date:** 2026-07-22 · **Status: CLOSE-READY** — pending a host
reconcile of the CC-attested runtime rows + the operator's gate (GO). Verifier ≠
closer: CDC verified each slice and synthesizes the close here; the gate is
Duncan's.

## The capability delivered

arc06 makes **"consume lykn as a dependency" work end-to-end** — the thing the
whole 0.6.0 dive was originally in service of. A downstream project (mycelium)
now scaffolds, **adds** a dependency (`lykn add`, exact-pinned), **develops
against a local lykn checkout** without losing the pin or risking a published
local path (`lykn link`/`unlink`, dev-only overlay), and **builds + tests +
publish-dry-runs** green as a downstream. The DD-51 gap (`deno add` banned, no
replacement) is filled; the mycelium N1 acceptance gap is closed.

## Arc-ledger walk (A-1…A-7)

Class-(b) rows are **reproduced at arc scale** (the mycelium composition demo),
not inherited.

| ID | Criterion | Status | Evidence |
|----|-----------|--------|----------|
| A-1 | slice01 (lang-exports-gap) closed | **met** | Finding-D close + CDC review (round-2) |
| A-2 | slice02 (mycelium re-audit) closed | **met** (reconcile) | slice02 cdc-verification; `a2e9b00`. Ground-truth inventory: 9 fixed / 1 partial / 2 open + N1–N4 |
| A-3 | slice03 (`lykn add`) closed | **met** (reconcile) | slice03 cdc-verification; `f9f9014` |
| A-4 | slice04 (`lykn link`/`unlink`, external-path overlay) closed | **met** (reconcile) | slice04 cdc-verification; `e1c0dd7`. **Safety property architecturally guaranteed** (dist/publish read raw; link/unlink never write `project.json`) |
| A-5 | **`lykn add <spec>` adds a dependency and it resolves** (class-b) | **met** (attested) | `lykn add npm:astring` → `@1.9.0` exact, resolves; reproduced at slice scale (slice03) |
| A-6 | **mycelium builds *and tests* green as a downstream** (the composition demo, class-b) | **met** (attested) | slice05: `lykn build` ✓ · `lykn test` **43/0** · `lykn publish --jsr --dry` green; specifier-preservation (`emit_import`) + self-key verified in-repo |
| A-7 | every mycelium-bootstrap issue dispositioned — no silent drop | **met** | slice02 inventory (14) + N1–N4 all routed: **N1 closed** (slice05); N2 = `lykn add`+`link`; N3 → arc07; N4 → post-0.6.0; the 14 → 9 fixed / 1 partial (#8 thin `.d.ts`) / 2 open (#6 → **arc15, done**; #11 → post-0.6.0) / #10 no-op / #13 design |

All seven met. A-6 was the last open bar; slice05 turns it green.

## The composition demo (A-6, reproduced at arc scale)

From mycelium as a downstream of current lykn (scratch branch
`smoke/0.6-slice05-import-by-specifier`, main untouched): `lykn build` →
both packages to `target/lykn/build/`; `lykn test` → **43 passed / 0 failed**
(was `Module not found` red — N1); `lykn publish --jsr --dry-run` → "Dry run
complete", with the dev-only self-key **absent** from the staged `deno.json`
(publish-safe) and the dirty-tree gate satisfied by a real commit, **not**
`--allow-dirty`. The end-to-end "consume lykn as a dependency" path is green.

## Carry-forward (routed, not dropped)

- **arc07 (docs):** the import-by-specifier convention (seeded in `16-testing.md`);
  `(export (func …))` bless-vs-tolerate; `build --dist`→`dist` deprecation (N3);
  #13 config-naming; the **multi-package scaffold gap** (`lykn new` writes one
  self-key; multi-package needs per-member).
- **post-0.6.0 / compiler-follow-up:** #11 unused-binding false positive + N4
  (warning uses surface name); #8 richer `.d.ts` (slow-types).
- **arc15 (done):** #6 `(express x):method` silent miscompile — fixed as a hard
  compile error + hardening.
- **0.7.0 build-tool arc:** the Mix/rebar3 `~>` version DSL + `lykn update` +
  `nodejs-semver` (BACKLOG A1.1) — `lykn add` pins exact for 0.6.0 via deno-shell.

## Gate readiness

Runtime rows (A-5 `lykn add` resolve; A-6 the mycelium demo — host-only) are
**CC-attested** and reconcile on an operator/fresh-CC host re-run. Each `lang`
claim (specifier preservation, exact-pin, the overlay safety property, the
inventory) is **CDC-confirmed in-repo**. No open iteration; no silent drop.
**The gate (GO) is the operator's**, after reconcile.

## Provenance

Chain: slice02 recon (a2e9b00) → **DD-63** (promoted, odm) → slice03 `lykn add`
(f9f9014) → slice04 `lykn link` (e1c0dd7) → slice05 N1 (guide 42500a9; mycelium
e60af9d). Each slice CDC-verified (see per-slice `cdc-verification.md`). On the
gate, arc06 closes — and with it, the 0.6.0 dive's founding goal is demonstrably
met. Remaining 0.6.0: arc07 (docs), arc09 (release); arc15 slice03/04 in flight.
