# CC Prompt — arc06 · slice02 · Mycelium re-audit (recon-only)

> **You are CC** (Claude Code, IC seat) on `~/lab/lykn/lang`, branch
> `release/0.6.x`, with `~/lab/lykn/mycelium` on the host (the downstream
> acceptance corpus). **This is a RECON slice: audit and report, do NOT fix.**
> Surface and self-stop; never work around a finding. Read `ledger.md` (8 rows)
> **and `cdc-pre-audit.md` first** — CDC has already done the *static*
> disposition (mycelium is Cowork-connected now), so **your job is the RUNTIME
> pass**: confirm the likely-fixed by running, reproduce the still-open, against
> *current* lykn. `cdc-pre-audit.md` gives you the confirmed-fixed list, the
> workaround file:line map, and the two findings below.

## Why this slice exists

arc06 makes "consume lykn as a dependency" work end-to-end and delivers
`lykn add`. Before scoping any fix, we need ground truth: the
`design/mycelium-bootstrap-issues.md` report (14 issues) is from **April 2026**,
and the 0.6.0 dive has since closed a big fraction of it (compiled-JS →
`target/` [arc01/arc11], import-macros jsr/npm [0.5.2], `.d.ts` [arc02], likely
the if-as-expression bugs [arc03/arc10]). Scoping `lykn add` and the
external-project fixes against a stale inventory would repeat the arc10 mistake
(scoping a migration against an unverified contract). **So: re-run mycelium
against current lykn and find out what actually still breaks.**

## What to do (MUST)

Produce `docs/design-v0.6.0/arc06-cross-project-dep-ergonomics/slice02-mycelium-reaudit/reaudit-findings.md`.

### Method — do these three first (see `cdc-pre-audit.md` for detail)

- **M1 — Re-point mycelium at current lykn (the version-pinning trap).**
  mycelium's `project.json` pins `jsr:@lykn/lang@0.5.2` / `@lykn/testing@0.5.2`.
  A bare `make test` audits **0.5.2**, not current 0.6.0 — worthless here. On a
  **scratch branch** in mycelium (non-destructive), re-point `lang/`+`testing/`
  at current lykn (local `../lang/packages/lang/` + `../lang/packages/testing/`,
  or a 0.6.0 prerelease). **Record how manual/awkward the re-point is — it is
  prime `lykn add` / DD-63 evidence.** Every subsequent run is against the
  re-pointed tree.
- **M2 — Separate two axes when you disposition + route.** (a) **toolchain bugs**
  — does current lykn still miscompile something mycelium worked around? Test by
  *removing the workaround* (the file:line map is in `cdc-pre-audit.md`) and
  recompiling → route to a compiler follow-up. (b) **downstream drift** —
  mycelium's Makefile/config carry pre-0.6.0 patterns (in-place `lykn compile
  -o`; build-then-test) → route to `lykn new` scaffold / a mycelium update.
- **M3 — Run the `(export (func …))` gate check FIRST.** `render.lykn:81` and
  `void-elements.lykn:7` use `(export (func …))`, which memory flags as invalid
  surface syntax the guides wrongly teach. If current lykn **rejects** it,
  mycelium won't build — a concrete arc06→arc07 link and a high-priority routing
  item; if it **compiles**, the guides are behind. Settle this before the rest.

Then the per-issue work:

1. **Rebuild first** (`cargo build --release && cp target/release/lykn bin/lykn`,
   then `./bin/lykn build`) so the audit hits *current* lykn, not a stale binary
   (staleness trap #3/#4). Record the lykn commit/SHA the audit ran against.
2. **Baseline (ledger F-6).** From mycelium, run the real build/test path against
   current lykn — `lykn build`, `lykn test`, and a publish dry-run as far as it
   gets. Record the exact commands + output (pass/fail). This is the
   acceptance-corpus starting point.
3. **Disposition all 14 issues (F-1/F-2/F-3).** For **each** issue in
   `mycelium-bootstrap-issues.md`, mark **fixed / partial / open**:
   - **fixed** → cite the 0.6.0 arc and/or commit that fixed it (something CDC
     can confirm in `lang`), and note how you confirmed (the old repro no longer
     reproduces).
   - **partial / open** → a **concrete reproduction**: the failing command and
     its actual output against current `release/0.6.x`. **Assertions are not
     evidence** — if you can't reproduce it, say so and mark it fixed/unclear.
4. **New friction (F-4).** Anything mycelium hits against current lykn that is
   *not* in the original 14 — each with a reproduction. The toolchain moved a
   lot; expect new gaps (and expect some old ones to be gone).
5. **Routing table (F-5).** Every open/partial item (original + new) → a home:
   **arc06 slice03** (`lykn add`), **arc06 slice04** (external scaffold /
   resolution hardening), **compiler follow-up** (with a *fix-in-0.6.0 vs
   post-0.6.0* recommendation — e.g. #1 `?`-suffix → invalid JS is a Principle-3
   violation worth a recommendation), **arc07** (docs-only), or **post-0.6.0**
   (with a re-entry condition). This table is the anti-silent-drop artifact
   (arc ledger A-7).
6. **`lykn add` requirements read (F-7).** From what the audit shows downstream
   actually needs: which specifier forms (`jsr:` / `npm:` / workspace), what
   `lykn add <specifier>` should write to `project.json` + the import-map,
   version pinning, Deno-cache population, interaction with the per-package
   `deno.json`. This is the DD-63 input — a requirements sketch, not a design.

## MUST NOT

- **Do not fix anything in the lykn toolchain.** No changes to `lang`'s
  `crates/`, `packages/`, the compiler, or `lykn new` to make the audit pass. A
  tempting one-line fix is **routed in the table, not landed** (F-8: the `lang`
  diff is the findings doc only). If a fix feels urgent, that is a strong
  routing signal, not a licence to break recon.
- **The M1 re-point is audit setup, not a fix** — a scratch-branch change to
  *mycelium's* `project.json` (point `lang/`/`testing/` at current lykn),
  reverted after. It does not touch `lang`. Keep it on a throwaway branch so
  mycelium's `main` (pinned to 0.5.2) is undisturbed.
- Do not draft DD-63 or plan slices 03/04 — that's CDC's, from your findings.
- Never auto-pass `--allow-dirty`/`--force`/`--no-verify`.

## Close-set

Write `closing-report.md` in the slice dir with:

1. A **per-row ledger walk** F-1…F-8 (status + evidence; 8 in, 8 out).
2. A **disposition summary** — of the 14: how many fixed / partial / open, and
   the fixed→arc mapping in one place.
3. **Bubble-up to the arc** (three questions): did slice02 deliver the
   ground-truth inventory; what it revealed that reshapes slices 03/04 or the
   arc-plan (esp. the `lykn add` requirements and any compiler bug that wants
   fixing in 0.6.0); the silent-drop diff (all 14 + new friction accounted).

Then **stop** — CDC verifies the inventory's completeness against `lang`, drafts
**DD-63** (`lykn add`) from F-7, and details slices 03/04 against the F-5 routing
table. If you hit your context ceiling mid-audit, self-stop clean and write a
handoff addendum (a recycle is not an iteration).
