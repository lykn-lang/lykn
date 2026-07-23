# arc06 · slice02 — CDC Verification (Mycelium re-audit, recon-only)

**By:** CDC · **Date:** 2026-07-22 · **Verifies:** CC's `reaudit-findings.md` +
`closing-report.md` + `ledger.md` @ commit `a2e9b00` (audit target `486f2eb`).
**Verifier ≠ closer:** CC authored the audit; CDC independently checks its
**completeness and internal consistency against `lang`** (CDC cannot see
mycelium, so runtime rows stay CC-attested until a host reconcile).

## Verdict — VERIFIED

The ground-truth inventory is **complete, internally consistent, and its `lang`
cites are confirmable in-repo.** All 14 issues + 4 new frictions + the M3
settlement (19 items) are dispositioned and routed with no silent drops. The
recon boundary held (zero toolchain changes). Ledger F-1…F-8 all stand.
Runtime rows are CC-attested; they reconcile on an operator/fresh-CC host re-run
at `486f2eb`+.

## Independent CDC checks (against `lang` source, not the paste)

| Claim | CDC check | Result | Strength |
|-------|-----------|--------|----------|
| **Recon-only; diff is docs only** | `git show --stat a2e9b00` | 3 files, all under `slice02-mycelium-reaudit/` (`reaudit-findings`, `closing-report`, `ledger`); **zero `crates/`/`packages/`/Makefile** | **reproduced** |
| **Audit ran at `486f2eb`** | `git merge-base --is-ancestor 486f2eb HEAD` | `486f2eb` is an ancestor of HEAD (`chore(ci): pin toolchain 1.97.0`); real, in history | **reproduced** |
| **M3: `(export (func …))` compiles** | read `classifier/forms.rs::classify_export` | Recursively classifies the inner form when its head `is_surface_form` (incl. `func`) → `SurfaceForm::Export` → `export function`. **CC is right; the memory note was wrong.** | **reproduced** |
| **F-7: scaffold writes *unpinned* specifiers** | read `main.rs::project_json_template` | `"lang/": "jsr:@lykn/lang/"`, `"testing": "jsr:@lykn/testing"` — no `@version`; `{name}/` → `./target/lykn/build/{name}/` | **reproduced** |
| **#1 `?`-suffix → `isVoidElement`/`isEmpty`** | read `codegen/names.rs` (predicate `?` → `is`-prefix camelCase; unit tests `rule1_*_question`) | `void-element?` → `isVoidElement`, `empty?` → `isEmpty` follow the rule exactly | **reproduced** |
| **#6 open, cites ID-31** | grep guides + bootstrap-issues | `guides/01-core-idioms.md:1031` = "Intermediate `bind` When Chaining on `express`"; `mycelium-bootstrap-issues.md:184` pins #6 to ID-31 | **reproduced** (trap real & documented) |
| **Runtime probes** (`lykn build`/`test`/`publish --dry`, the compile snippets, #6/#11 outputs) | host-only; CDC cannot run the toolchain | plausible + consistent with the source paths above; **not independently reproduced** | **attested (CC)** → reconcile on host |

## Completeness — no silent drops (arc ledger A-7)

14 original (9 fixed / 1 partial #8 / 2 open #6,#11 / 1 no-op #10 / 1 design #13)
+ 4 new (N1–N4) + M3 settlement = **19 items, every one in the F-5 routing
table.** F-1…F-8 verified: each *fixed* names an arc CDC can confirm in-repo;
each *open/partial* carries a reproduction; every open item has a home. Confirmed.

## What this reshapes — CDC concurrence + operator decisions

**1. A-6's bar → "downstream `lykn test` green from mycelium" (CDC concurs).**
CC's N1 is the arc's real acceptance gap and it is *not* `lykn add`: it's a
**resolution** problem (test files import the package via a relative
`../render.js` that dangles under the arc11 `target/` model). A downstream can
`lykn build` but not `lykn test` end-to-end. → **route to slice04** (external
resolution); **A-6 restated** as "mycelium builds *and tests* as a downstream,"
which is red today for this specific reason. I will update `arc-plan.md` A-6 to
this concrete bar when detailing the slices.

**2. `lykn add`'s hardest requirement is the registry⇄local switch (N2), not the
registry add.** The M1 re-point pain — knowing the build-dir path
(`target/lykn/build/<pkg>/`, not `packages/`), the `mod.js` entry, and the
bare+slash `exports` pair — is the DD-63 core, plus version-pinning (the scaffold
writes unpinned, confirmed). This is the F-7 read; DD-63 will make local-vs-
registry a first-class `lykn add` mode.

**3. #6 `(express x):method` — silent miscompile. OPERATOR DECISION.** CC
recommends a 0.6.0 fix *or* a compile-time warning. **CDC assessment:** a
*silently wrong* output (`parts.value("join","")` for a method call) is a
**Principle-3 hazard** (compiler-owned output quality — the compiler should not
emit confidently-wrong JS). It is documented (ID-31) with a known workaround, so
it is not a release *blocker*, but "documented quiet-miscompile" sits
uncomfortably against the philosophy. **CDC recommendation:** at minimum a
**compile-time warning** in 0.6.0 (detect `(express x)` in method-head position);
a full fix is a sizing/scope call that is **Duncan's**. Routed to
compiler-follow-up either way — flagging it up because "route it" shouldn't bury
a Principle-3 tension.

**4. arc07 doc reconciles (three, all 0.6.0-era docs, non-blocking):** the
`(export (func …))` memory/guide-vs-compiler reconcile (compiler blesses it —
memory note **already corrected** by CDC); N3 `build --dist`→`dist` deprecation
in guides/SKILL + the mycelium Makefile; #13 config-naming guide contrast.

## Memory correction applied

`lykn_export_surface_syntax.md` **rewritten** — the old "invalid" claim is
superseded; `(export (func …))` compiles (source-verified). Flagged as an arc07
doc reconcile (bless-vs-tolerate is the remaining doc question, not a compiler
question).

## Next CDC actions (CC's handoff, accepted)

1. **Draft DD-63 (`lykn add`)** from F-7 — specifier forms (jsr:/npm:/local),
   the registry⇄local mode, version-pinning, bare+slash `exports` emission,
   build-dir resolution, cache population, per-package `deno.json` interaction,
   the macro axis, and the N1 corollary (how a test imports its own built
   package). odm promotion = Duncan.
2. **Detail slices 03/04** against the F-5 routing table: slice03 = `lykn add`
   (DD-63-backed, N2 + #9 version-pinning); slice04 = external-project path +
   **N1 resolution** (A-6's green bar).
3. **arc-plan.md:** mark A-2 (slice02) done pending host reconcile; restate A-6
   to the downstream-`lykn test`-green bar; A-7 seeded by the F-5 routing table.

## Close status

slice02 recon **verified by CDC**; **not yet closed** — closer≠verifier and the
runtime rows want a host reconcile. The `arc-plan.md` A-2 row moves to
done-pending-reconcile; the ledger's `<CDC-fills>` close-commit is Duncan's when
he commits this verification. No iteration burn (recon slice, first pass clean).
