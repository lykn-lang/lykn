# arc06 · slice02 — Closing Report (Mycelium re-audit, recon-only)

**By:** CC (Claude Code) · **Date:** 2026-07-22 · **Branch:** `release/0.6.x`
**Deliverable:** `reaudit-findings.md` (this dir). **Recon-only — zero toolchain
changes.** Audit target: `lang` @ **`486f2eb`**; corpus: `~/lab/lykn/mycelium`.
**Verdict: ground-truth inventory delivered.** Of the 14 April-2026
mycelium-bootstrap issues, **9 are fixed, 1 partial, 2 open, 1 not-a-lykn-bug,
1 design/docs** — each fixed cited to an arc, each open/partial reproduced
against current lykn. Four new frictions surfaced (N1–N4); one, N1, is the arc's
central acceptance gap. A `lykn add` requirements read is captured for DD-63.

## Per-row ledger walk (8 in, 8 out)

| Row | Status | Evidence |
|-----|--------|----------|
| **F-1** — all 14 dispositioned (fixed/partial/open) | **done** | `reaudit-findings.md` §Per-issue: 14 issues, each with a verdict. Summary: 9 fixed / 1 partial (#8) / 2 open (#6, #11) / 1 no-op (#10) / 1 design (#13). |
| **F-2** — every *fixed* cites the arc/commit | **done** | #1/#5/#7→arc03/arc10; #2→0.5.2/V-08; #8(.d.ts)→arc02; #14/#3-gitignore→arc01/arc11; #9/#3-license/#4/#12→CLI. Each confirmed by the old repro no longer reproducing (probe outputs in the findings). |
| **F-3** — every *open/partial* has a concrete reproduction | **done** | #6 `((express parts):join "")` → `parts.value("join","")` (rc=0, wrong); #11 `VOID-ELEMENTS` used in func body → `warning: unused binding`; #8 JSR dry-run slow-types warning + thin `mod.d.ts` (26 B). Commands + actual output in the findings. |
| **F-4** — new friction cataloged with reproductions | **done** | N1 (`lykn test` relative `../render.js` fails under `target/` — baseline repro), N2 (manual re-point), N3 (`build --dist`→`dist` deprecation), N4 (warning uses surface name). |
| **F-5** — routing table, every open/partial/new → a home | **done** | `reaudit-findings.md` §Routing: 12 rows (originals + N1–N4 + M3 settlement), each → compiler-follow-up / arc06 slice03 / slice04 / arc02-followup / arc07 / post-0.6.0, with fix-in-0.6.0-vs-post. |
| **F-6** — mycelium baseline recorded | **done** | `lykn build` rc=0 (both packages → `target/`); `lykn test` rc=1 (N1: relative `.js` import unresolved under `target/`). Commands + output in §Baseline. |
| **F-7** — `lykn add` requirements read captured | **done** | §`lykn add` requirements: specifier forms (jsr:/npm:/local), version-pinning, bare+slash pair from `exports`, local build-dir resolution, cache population, per-package interaction, the macro axis. `lykn add` confirmed **not to exist** (baseline). |
| **F-8** — recon-only; diff is findings doc only | **done** (CC-attested) | No changes to `crates/`/`packages/`/compiler/`lykn new`. `git status`: only the untracked `reaudit-findings.md` + `closing-report.md` (this dir) are mine. mycelium re-point was on throwaway branch `audit/0.6.0-reaudit`; `smoke`/`main` restored pristine. |

## Disposition summary — the 14, in one place

| # | Issue | Verdict | Fixed-by / reproduction |
|---|-------|---------|-------------------------|
| 1 | `?`-suffix → invalid JS | **fixed** | arc-era identifier mapping (DD-49): `void-element?` → `isVoidElement` |
| 2 | import-macros `jsr:` | **fixed** | 0.5.2/V-08: `(import-macros "jsr:@lykn/testing@0.5.2" …)` expands, rc=0 |
| 3 | `lykn new` license + gitignore for JSR | **fixed** | `target/` model (gitignore) + `lykn dist` copies LICENSE; JSR dry-run no missing-license |
| 4 | `package.json`/`jsr.json` generated | **fixed** (was discoverability) | `lykn dist` stages deno.json+package.json+LICENSE+mod.d.ts |
| 5 | nested `if` in `func` return | **fixed** | arc03/arc10: clean ternary chain |
| 6 | `(express x):method` chaining | **open** | still `parts.value("join","")` — compiler-follow-up |
| 7 | `if` in binding position | **fixed** | arc03/arc10: `const x = cond ? a : b;` |
| 8 | `.d.ts` / `--allow-slow-types` | **partial** | `.d.ts` generated (arc02), publish no longer hard-fails; residual slow-types warning (thin `.d.ts`) |
| 9 | `lykn test` `lang/` imports outside monorepo | **fixed** (caveat: unpinned) | `lykn new` generates `lang/`+`testing/`; resolves when mapped |
| 10 | npm EOTP | **not-a-lykn-bug** | npm token config; report agreed no toolchain change |
| 11 | unused-binding false positive | **open** | `VOID-ELEMENTS:has` in func body still flagged unused — compiler-follow-up |
| 12 | Makefile raw npm/deno publish | **fixed** (downstream drift) | `lykn publish` wraps + enforces git gate; mycelium Makefile not migrated |
| 13 | `project.json` vs `deno.json` naming | **design/docs** | unchanged; not a bug — post-0.6.0 (arc07 guide contrast) |
| 14 | compiled `.js` pollutes source | **fixed** | arc01/arc11 `target/` model; three-tier `packages/`→`target/`→`dist/` shipped |

## Bubble-up to the arc (three questions)

**1. Did slice02 deliver the ground-truth inventory?** Yes. All 14 dispositioned
against *current* lykn with reproductions (not recall); 4 new frictions; a
routing table with no silent drops; the `lykn add` requirements read for DD-63.
The headline: **the toolchain moved a lot — 9 of 14 are genuinely fixed** (the
whole "invalid-JS-from-surface-forms" class #1/#5/#7, the `target/` model #14,
import-macros #2, `.d.ts`/publish #8/#3/#4, the scaffold imports #9). Scoping
`lykn add` against the *old* inventory would indeed have repeated the arc10
mistake.

**2. What it revealed that reshapes slices 03/04:**

- **N1 is arc06's real acceptance gap, and it's not `lykn add`.** A downstream
  can `lykn build` but not `lykn test` end-to-end, because test files import the
  package via a **relative `../render.js`** that doesn't resolve under the arc11
  `target/` model. This is a **resolution** problem (slice04), and it's the arc
  ledger's A-6 (mycelium builds+tests as a downstream). **Recommend slice04 own
  "how does a downstream test import its own built package," and that A-6's
  bar be `lykn test` green from mycelium** — today it is red for this reason.
- **`lykn add`'s hardest requirement is the registry⇄local switch (N2), not the
  registry-add.** Adding `jsr:@lykn/foo` is easy; the pain the audit actually hit
  was pointing a dep at a **local checkout** for dev — and getting the
  **build-dir path** (`target/lykn/build/<pkg>/`, not `packages/`) and the
  **bare+slash `exports` pair** right. DD-63 should make local-vs-registry a
  first-class `lykn add` mode, and **pin versions** (the scaffold currently
  writes *unpinned* `jsr:@lykn/lang/`).
- **A compiler bug worth a 0.6.0 recommendation:** #6 `(express x):method` emits
  *silently wrong* output (`parts.value("join","")`). It's documented (ID-31) but
  it's a quiet-miscompile hazard; **recommend evaluating a 0.6.0 fix or at least a
  compile-time warning** (routed to compiler-follow-up). #11 (unused-binding FP)
  is noise, not wrong output — fine for post-0.6.0.
- **One arc06→arc07 link the pre-audit predicted resolved differently:**
  `(export (func …))` **compiles** on current lykn (gate cleared), so it does
  *not* block the build — but the memory/guide note calling it invalid is now
  contradicted by the compiler. That's an arc07 reconcile, not a blocker.

**3. Silent-drop diff (all accounted):** 14 original + 4 new (N1–N4) + the M3
`(export (func …))` settlement = 19 items, every one in the routing table.
Nothing from the original list was skipped; nothing new was left unrouted.

## Handoff

Recon complete. **CDC** verifies the inventory's completeness against `lang` (the
"fixed→arc" cites are all confirmable in-repo — CDC cannot see mycelium), drafts
**DD-63** (`lykn add`) from F-7, and details **slices 03/04** against the F-5
routing table — with the recommendation that **slice04 adopt N1 (downstream
`lykn test` green) as A-6's concrete bar**. mycelium is restored to
`smoke/0.5.2-registry-pinned`; the re-point lives on `audit/0.6.0-reaudit`
(throwaway). Runtime rows are CC-attested at `486f2eb`; reconcile on a host
re-run. Closing report + findings untracked at hand-off per LEDGER-DISCIPLINE
(recon slice: empty source diff).
