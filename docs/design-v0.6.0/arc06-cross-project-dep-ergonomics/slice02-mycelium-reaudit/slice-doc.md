# arc06 · slice02 — Mycelium re-audit (recon-only)

> **Open set** (written 2026-07-21, CDC). The ground-truth pass that opens
> arc06's main work. **Recon-only — no fixes.** mycelium is now Cowork-connected,
> so **CDC did the static disposition by inspection** (`cdc-pre-audit.md`); the
> **runtime pass** — re-point at current lykn, build, test, publish-dry — is
> CC-run on the host (CDC has no toolchain in the sandbox). Its product is the
> authoritative open-blocker inventory that scopes slices 03 (`lykn add`) and 04
> (external-project path), and routes every remaining issue.

## 1. Goal

The `design/mycelium-bootstrap-issues.md` report (14 issues) is from April 2026,
and the 0.6.0 dive has since closed a large fraction of it. Before scoping any
fix, re-establish ground truth: **run mycelium against current `release/0.6.x`
and find out what actually still breaks.** This is the arc10 lesson applied at
arc scale — verify the contract against the real system before scoping the work.

Produce a **re-audit inventory** that, for each of the 14 issues, records
fixed / partial / open **with a concrete reproduction** (the command + output),
cites the 0.6.0 arc that fixed the fixed ones, catalogs any **new** friction,
and **routes** every still-open item to a home (arc06 slice03/04 / a compiler
follow-up / arc07 docs / post-0.6.0). Nothing from the 14-issue list is dropped
silently (arc ledger A-7).

## 2. Scope

### In

- **A fresh mycelium smoke-test against current `release/0.6.x`** (rebuild
  `./bin/lykn` first): scaffold/consume, `lykn build`, `lykn test`, and a
  `lykn publish --dry`-equivalent as far as each gets — recording the baseline
  (what runs, what fails, with output).
- **Per-issue disposition of all 14** `mycelium-bootstrap-issues.md` issues:
  **fixed** (cite the 0.6.0 arc/commit — e.g. #14 target-dir → arc01/arc11, #2
  import-macros → 0.5.2, #8 `.d.ts` → arc02), **partial** (what remains), or
  **open** (a concrete reproduction against current lykn). Assertions are not
  evidence — each open/partial needs the failing command + output.
- **New friction**: anything mycelium hits against current lykn that is *not* in
  the original 14 (the toolchain moved a lot; new gaps are expected).
- **The routing table** (arc ledger A-7 seed): every open/partial item → a home:
  **arc06 slice03** (`lykn add` territory), **arc06 slice04** (external scaffold
  / resolution), a **compiler follow-up** (e.g. #1 `?`-suffix invalid JS, #5/#7
  if-as-expression, #11 unused-binding FPs — with a fix-in-0.6.0-vs-post-0.6.0
  recommendation), **arc07** (a docs-only fix), or **post-0.6.0** (with re-entry).
- **A first read on `lykn add`'s shape** — what the audit reveals the command
  must do (the DD-63 input): which specifier forms downstream actually needs
  (jsr:/npm:/workspace), what `project.json` edits, version pinning, cache.

### Out

- **No fixes.** Recon-only. Any change to `crates/`, `packages/`, `lykn new`,
  or the compiler is out of scope — if a one-line fix is tempting, **record it
  in the routing table, don't land it** (it belongs in the slice it routes to,
  scoped properly). This is the recon-first discipline; jumping to fixes is how
  the audit stops being ground truth.
- DD-63 (`lykn add` design) — CDC drafts it from this slice's `lykn add` read.
- slices 03/04 detailed planning.

## 3. Verification approach

- **CDC** did the **static** disposition (mycelium is Cowork-connected — see
  `cdc-pre-audit.md`: the confirmed-fixed list, the workaround file:line map, the
  `(export (func …))` gate) but **cannot run the toolchain** in the sandbox.
  **CC** does the **runtime** pass on the host (re-point → build → test →
  publish-dry against current lykn); those dispositions are CC-attested. CDC then
  verifies the inventory's **completeness and internal consistency** (14 issues
  all dispositioned; each "fixed" cites a real 0.6.0 arc/commit CDC can check in
  `lang`; each "open" has a concrete reproduction; the routing table covers every
  open item) and reconciles on a host re-run.
- The deliverable is a **findings document** (`reaudit-findings.md` in the slice
  dir), not source changes.

## 4. Exit criteria

1. All 14 mycelium-bootstrap issues dispositioned (fixed/partial/open), each
   with evidence (fixed → arc/commit cite; open/partial → reproduction).
2. New friction cataloged; the mycelium `lykn test`/build baseline recorded.
3. Every open/partial item routed to a home (A-7 seed) — no silent drop.
4. A `lykn add` requirements read captured (the DD-63 input).
5. Recon-only: no source/toolchain changes.

## 5. Consumes / feeds

Consumes the mycelium corpus + the 0.6.0 arcs' delivered state. **Feeds DD-63 +
slice03/04** (scoped against this inventory) and the arc06 close (A-6/A-7).
Mirrors the recon-first openers of arc13 (the conformance matrix) and arc05
(the F-1 verification pass): build the ground-truth map first, then plan the
fixes against it.
