# arc06 — Closing Report (Cross-Project Dependency Ergonomics)

> **RE-ISSUED 2026-07-24.** This supersedes the report of the same name written
> when arc06's last slice was slice05 (superseded version preserved in git at
> `90c8b53^`). That report was marked *superseded in part* rather than edited,
> because two slices landed after it: **slice06 · version-consolidation** and
> **slice07 · link-registry-specifier**, the second of which went through an
> iteration. Its A-1…A-7 walk stood; its slice walk, composition check and
> verdict did not. This document is the arc's actual close.

**By:** CDC · **Date:** 2026-07-24 · **Branch:** `release/0.6.x`

## 1. The capability, and the verdict

From `arc-plan.md`: *make the consume-lykn-as-a-dependency path work end-to-end
— external-project scaffold, cross-project resolution, `lykn test`/publish from
outside the monorepo — and deliver `lykn add`, the ergonomic dependency-addition
command DD-51 left missing.*

**Verdict: delivered.** This is 0.6.0's founding goal. A downstream project now
scaffolds, adds an exact-pinned registry dependency, develops against a local
lykn checkout without losing the pin or risking a published local path, imports
its own package by specifier, builds, tests and publish-dry-runs green. The
acceptance corpus is mycelium, and mycelium does all of it.

**One bound, stated up front:** `lykn link` on a *literal registry specifier*
covers **macro modules**. A runtime import of a linked specifier errors rather
than resolving to the published package — loudly, not silently — and the full
runtime override is routed to 0.7.0. The capability statement above is met; this
is a boundary inside slice07's addition, not a gap in the arc.

## 2. Slice walk (7 slices)

| Slice | Outcome | Evidence |
|-------|---------|----------|
| **01 · lang-exports-gap** | **Closed** 2026-05-12 | Finding D — `packages/lang/deno.json` exports missing `./mod.js`; closing-report + CDC review |
| **02 · mycelium re-audit** | **Closed**, CDC-verified | `a2e9b00` — recon-only ground truth: 9 fixed / 1 partial / 2 open of the 14 bootstrap issues, plus N1–N4. Produced the inventory slices 03–05 were scoped against |
| **03 · `lykn add`** | **Closed**, CDC-verified | `f9f9014` — DD-63 (promoted, odm): exact-version pin via deno-shell, bare+slash pair from `exports`, format-preserving write, `PackageKind` macro axis |
| **04 · `lykn link`/`unlink`** | **Closed**, CDC-verified | `e1c0dd7` — git-ignored `project.local.json` overlay; safety property **architecturally guaranteed** (dist/publish read raw; link/unlink never write `project.json`) |
| **05 · N1 external-test resolution** | **Closed**, CDC-verified | `54c9099`, guide `42500a9` — the compiler preserves import specifiers verbatim (`emit_import`), so N1 was pure convention: **zero `lang` change** |
| **06 · version-consolidation** | **Closed**, CDC-verified 2026-07-24 | `caeb2e4`/`1139c42` — one workspace version, `0.6.0-dev` across Rust + JS, registry pins and scaffold template deliberately untouched |
| **07 · link-registry-specifier** | **Closed**, CDC-verified 2026-07-24 after **iteration 1** | `58e22e8`/`be72c37` + `72a1cfd`/`70666d0` — resolver Tier-0 exact override; six review findings resolved |

**Slice count reconciles with `arc-plan.md` v1.3 (7).** It did not before v1.3 —
slices 06 and 07 were committed while absent from the breakdown, which is
recorded as `D-2607-QZ62` and is the honest headline of this arc's process
story (§5).

## 3. Composition check

Arc ledger A-1…A-9, all **met**. The class-(b) composition rows:

- **A-5** — `lykn add <specifier>` adds a dependency and it resolves. Met;
  CC-attested (`lykn add npm:astring` → `@1.9.0` exact, resolves).
- **A-6** — **mycelium builds *and tests* green as a downstream.** Met;
  CC-attested: `lykn build` ✓ · `lykn test` **43/0** · `lykn publish --jsr --dry`
  green, with the dev-only self-key absent from the staged config. This was the
  arc's concrete bar and it was RED at arc open (N1: a test's relative
  `../render.js` dangling under `target/`).
- **A-7** — every mycelium-bootstrap issue dispositioned, no silent drops. Met:
  the 14 → 9 fixed / 1 partial (#8 thin `.d.ts`) / 2 open (#6 → arc15, done;
  #11 → post-0.6.0) / #10 no-op / #13 design; N1 closed by slice05, N2 by
  `lykn add`+`link`, N3 → arc07, N4 → post-0.6.0.

**Do the slices recompose into the capability?** Yes, and the chain is legible:
slice02's recon produced the inventory → DD-63 → slice03 `add` → slice04 `link`
→ slice05 closed the last red bar → slice07 extended `link` to the literal
specifiers that macro imports actually use. Nothing the arc-plan promised went
undelivered.

**Evidence-strength honesty.** Every structural claim above is
*reproduced-by-inspection* against `lang` at HEAD. **A-5 and A-6 are
CC-attested, not operator-reproduced.** Arc-scale reproduction is the operator's
host run — `host-reconcile-runsheet.md`, Part C — and that is precisely what the
gate is for. This report does not claim a run it did not witness.

## 4. Accumulated arc-plan change log

`arc-plan.md` moved v1.2 → v1.3 during this arc:

- **v1.3 (2026-07-24)** — slices 06 and 07 added to a breakdown that had gone
  stale at slice02; slice04 `Detailed`→`Closed`, slice05 `Shaped`→`Closed`;
  A-6/A-7 flipped to met (they were still `open` in the plan while the prior
  closing-report recorded them met); **A-8** and **A-9** added; a dangling
  fragment from an earlier partial overwrite removed. Surfaced by slice07's CDC
  review and the operator's runsheet pass.
- **This close** amends A-8 and A-9 to met, and rewrites A-9's scope line to
  carry the macro-module boundary so the arc ledger does not inherit slice07's
  pre-iteration overclaim.

## 5. What this arc revealed about the process

Two findings, both logged in the discovery register, both worth more than any
single defect they produced.

**The plan-of-record went stale while the work was healthy** (`D-2607-QZ62`).
Every slice after 02 was scoped against recon output rather than against the
arc-plan — which is *correct* under recon-first, and is exactly why nobody
re-read the plan. The closing-report carried the truth for weeks while the
arc-plan still said "slice02 is the next work." The lesson is now in `arc-plan.md`
§2: under recon-first scoping, the arc-plan must be re-reconciled **at each
slice close**, not only at arc close.

**Two ways for green to mean nothing** (`D-2607-H4TC`, `D-2607-B8SY`). slice07's
review found a blocking regression in a function that had just been rewritten
three ways with **zero test coverage** — no coverage → rewrite → silent defect,
an exact causal chain — and a test whose *name* claimed to cover the guard while
its body asserted the opposite case, so the ledger row, the commit message and
the closing report all inherited a guarantee nothing checked. A test that
overclaims is worse than a missing test: it converts absence-of-evidence into
apparent-evidence at three documentation levels simultaneously. Both fixed in
iteration 1; the second is a sibling of `D-2607-3VXM` and probably one systemic
root.

**What worked:** recon-first (slice07's premise held where slice03's cracked,
because it was tested first); CC's self-stops; and the review itself — which was
also wrong once, in the useful direction. My F4 concern that a linked runtime
import might *silently* resolve to the published package was reasoned from
import-map semantics and flagged as needing a host check rather than asserted.
The check disarmed it. Raising it was right; asserting it would not have been.

## 6. Bubble-up to the project

**Did arc06 deliver its capability as `project-plan.md` defined it?** Yes —
*"`lykn add` and ergonomic cross-project dependency handling (DD-51
follow-ons)."* Delivered, with the macro-module boundary on the
literal-specifier link disclosed above and in the roadmap row.

**What arc06 revealed that the project plan did not anticipate:**

1. **Two unplanned slices arrived from the operator's host-reconcile pass** —
   both real, neither in any plan. Host-reconcile is not just verification; it
   is a *discovery surface*. Worth expecting a slice or two from it on future
   arcs rather than treating it as a formality.
2. **A release-prep precondition for arc09:** `dist/` is stale at `0.5.2` while
   the tree is `0.6.0-dev`. Gitignored, so harmless today — but
   `lykn publish --no-build` exists specifically to publish an already-staged
   `dist/`, so a publish that skips the build would ship 0.5.2 metadata from a
   0.6.0 tree. Routed to arc09 as a precondition, surfaced by slice06's
   verification sweep.
3. **arc07 is unblocked.** The guide pass could not truthfully document the
   dependency, external-test and publish workflows until they worked. They work.

**Silent-drop diff at arc scale:** nothing the roadmap expected from arc06 failed
to land. Two items routed forward with named homes and re-entry conditions —
full runtime override of a linked specifier (0.7.0), and the drop-workspace
scoped assumption (0.7.x backlog, trigger: *first multi-package downstream that
links*).

**Project-plan change required?** No structural change. `P-6` flips
`open (ACTIVE)` → **done** on the operator's gate. The roadmap's remaining
sequence is unchanged: **arc15 slice04 + close → arc07 (docs) + arc16 (book) →
arc09 (release).**

## 7. Gate

**arc06 is CLOSE-READY.** All seven slices closed and CDC-verified; A-1…A-9 met;
this report re-issued to cover the full walk.

**The gate (GO / adjust / kill) is the operator's**, after the host reconcile in
`host-reconcile-runsheet.md` — Part C is the A-6 bar and the one that matters.
On GO, 0.6.0's founding goal is met and `P-6` closes.
