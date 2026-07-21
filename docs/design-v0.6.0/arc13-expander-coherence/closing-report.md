# Arc 13: expander-coherence — Closing Report

**By:** CDC (Cowork) · **Date:** 2026-07-09 · **Branch:** `release/0.6.x`
**Status: CLOSED — gate GO 2026-07-09 (operator; full runbook, §5 gate
record).** All eleven slices CDC-closed; A-4/A-5 reproduced at arc
scale and reconciled; A-6 handed off to arc05 slice03 by design and
**closed there 2026-07-21** (the ID-42 re-answer — §3). Ledger fully
discharged.

## 1. The capability, restated — and the verdict

From `arc-plan.md`: *"A lexically-bound name means the binding — on both
backends, in every position… lexical bindings (params, `bind`,
destructuring, loop bindings) shadow macro/form dispatch in their scope,
identically on both compilers; JS reserved words are rejected as names
with a proper diagnostic (the ID-44 genus — no invalid output at rc=0);
and a name-binding conformance corpus pins all of it cross-compiler,
permanently."*

**Verdict: delivered.** D1 (lexical shadowing incl. user macros and
desugars, with the confirmed label exception) and D2 (empirical
reserved-word rejection at every derived binding position, `export` and
`kernel:` slots included) are implemented on Rust (resolver pass +
expander scan + `as_form_head()` + payload privacy) and JS (in-walk
resolver + `formHead()`), enforced by two static conformance checks and
a standing cross-backend corpus in `make check` with demonstrated
seeded-divergence teeth. Final matrix: **1947 cells · 53 divergent
(3%), every one documented-as-intended** (38 form-named-label shape
asymmetry; 15 `kernel:if` unbindables). No invalid output at rc=0 for
any real name class.

## 2. The slice walk (11 slices — matches the arc-plan breakdown)

| Slice | Outcome |
|-------|---------|
| 01 · conformance-matrix + DD | **Delivered** — 885-cell matrix (ground truth); DD-60 drafted + operator-confirmed in full. Recon-only. |
| 02 · rust-shadowing | **Self-stopped → superseded** (the four-subsystem finding; all 5 rows deferred with homes — the arc's architecture came from this stop). No silent drops. |
| 03 · binding-walker + D2 | **Delivered** — per-backend walkers + D2 everywhere; three-way list parity; DD-60 refinement #1 surfaced. |
| 04 · walker-extension | **Delivered** — +3 positions; refinement #2 + the derive-don't-accumulate method change surfaced. |
| 05 · position-sweep | **Delivered** — derived exhaustiveness; the name-slot class found; standing coverage test; binding layer complete by construction. |
| 06 · rust-resolution | **Delivered** (`dc37ae9`) — DD-60 D1 on Rust; the `scope_plan` region model; §A6 accessor swap + static check. (First session self-stopped cleanly → fresh-context recycle.) |
| 07 · atom-privacy-recon | **Delivered** — recon-only; the two-crate blast-radius correction; the pattern-site census. |
| 08 · accessor-sweep | **Delivered** (`7d86703`+`dab4405`) — ~85 sites to accessors, byte-identical; `contains_await` blind spot found. |
| 09 · privacy-flip | **Delivered** (`4c12301`) — `Atom(AtomData)` private, single-file, E0451-proven; §A6 by-construction. |
| 10 · js-resolution | **Delivered** (`c19a1fb`) — DD-60 D1 on JS; divergence 601→56. (Second recon → fresh-context recycle, same-day delivery.) |
| 11 · conformance-corpus + dispositions | **Delivered** (`a0b24b9`) — the standing corpus; two fixes (`macro` row; `contains_await`); three documented dispositions; 56→53, zero ambiguity. |

Eleven slices in the breakdown; eleven walked. No arc-scale silent
drop. (The count grew 3→11 through tracked re-slices and refinements —
every insertion carries a Version History entry; see §4.)

## 3. The composition check — the arc ledger walked

| Row | Status | Evidence |
|-----|--------|----------|
| A-1 (slice01 closed) | done | cdc-verification (attested) |
| A-2 (slice02) | no-op | superseded by the v1.2 re-slice; rows deferred with homes |
| A-3 (slice03 closed) | done | cdc-verification (attested) |
| **A-4 (the matrix converges per DD-60, both backends)** | **evidence assembled — reproduce at arc scale (§5)** | slice11 F-7 snapshot: 1947/53, both residual classes documented-as-intended; corpus green in `make check` |
| **A-5 (no invalid output at rc=0 for any name class)** | **evidence assembled — reproduce at arc scale (§5)** | D2 everywhere (slices 03–05); slice11: only `invalid-output` cells are the `kernel:`-prefixed unbindables — never a real reserved word |
| A-6 (arc05's ID-42 re-answered from the fixed state) | **done (2026-07-21, at arc05 slice03 scoping)** | the re-answer, written from the fixed state: **no lint rule** — reserved words at binding positions are D2 compile errors (ID-44 genus dead), form-named params legally shadow via D1, so the linter says nothing about param names (operator steer: "do the right thing instead of warning broadly"). Ptr: `arc05/slice03-resolution-consumer/slice-doc.md` §1/§4 + ledger F-7; arc05 arc-plan v1.6 |
| A-7 (slice04 closed) | done | cdc-verification (attested) |
| A-8 (slice05 closed) | done | cdc-verification (attested) |
| A-9 (slice06 closed) | done | cdc-verification; `dc37ae9` |
| A-10 (slice10 closed) | done | cdc-verification; `c19a1fb` |
| A-11 (privacy pair closed) | done | both cdc-verifications; `7d86703`+`dab4405`, `4c12301` |
| A-12 (DD-60 refinements #1/#2/addendum dispositioned) | done | DD-60 refinement log + change-log entries |
| A-13 (slice07 closed) | done | cdc-verification (empty diff) |
| A-14 (slice11 closed) | done | cdc-verification; `a0b24b9` |
| A-15 (routed findings dispositioned) | done | slice11 F-3..F-6 (two fixed, three documented) |

**Composition verdict: the slices recompose into the capability.**
A-4/A-5 were reproduced at arc scale + reconciled at the gate (§5). **A-6
closed 2026-07-21** at arc05 slice03 scoping — its Verify *was* that scoping
note, now written (disposition: no lint rule; see the row above). With A-6
closed, the arc13 ledger is fully discharged.

## 4. The accumulated change log (drift made visible)

`arc-plan.md` v1.0 → v1.16, seventeen dated entries. The big movements:
the v1.2 re-slice (slice02's four-subsystem self-stop → the Resolve-Once
architecture, DD-61); three DD-60 refinements + the label-exception
footnote (each which-child-surfaced); the §A6 privacy phasing (Rust
enum-variant visibility) and its two-slice landing; two fresh-context
recycles (both delivered same-day); the corpus/arc-close un-bundling
(operator catch). Five DD-60/61 refinement-log entries total — every
one arrived by a child surfacing evidence rather than folding a change.

## 5. The operator gate — host runbook (formal close)

Run on the host, from a clean tree at `a0b24b9` or later:

1. **Ancestry sweep** (the milestone-closed ≠ landed lesson):
   `for sha in dc37ae9 7d86703 dab4405 4c12301 c19a1fb a0b24b9; do
   git merge-base --is-ancestor $sha release/0.6.x && echo "$sha ok"; done`
2. **Rebuild first:** `make build-release` (or `cargo build --release`
   + `cp` per convention) → `./bin/lykn` fresh; then `./bin/lykn build`
   (trap #4 — the import-map artifacts).
3. **The canonical bar:** `make check` — expect green incl. the
   conformance corpus (~1 s), both A6 static checks, walker coverage,
   three-way parity.
4. **A-4 reproduction:** `deno run --config project.json -A
   tools/conformance-matrix.js` — expect **1947 cells · 53 divergent**,
   the divergent set exactly {38 form-named-label, 15 `kernel:if`}
   (the slice11 closing-report tally table).
5. **A-5 spot-demos** (any/all): `(bind if 0)` → compile error both
   backends; `(func f :args (if) …)` → error both; `(label if …)` →
   error both; a bound legal-ident (`(bind array 1)(array 2)`) → plain
   call both.
6. On GO: flip arc13 **Closed** in arc-plan/README/status/project-plan;
   reconcile A-4/A-5 (and the attested slice rows) `attested → 
   reconciled`; record the gate here with date + observed numbers.

**Gate record: GO — 2026-07-09, operator (Duncan), full runbook
executed.** Observed:

1. **Ancestry sweep ✓** — all six SHAs
   (`dc37ae9 7d86703 dab4405 4c12301 c19a1fb a0b24b9`) reported "ok"
   against `release/0.6.x`.
2. **Rebuild ✓** — `make build-release` + `./bin/lykn build` (all three
   packages staged).
3. **`make check` ✓** — 100% ("passes 100%", operator-run).
4. **Matrix reproduction ✓ — EXACT:** `1947 cells · 53 divergent (3%)`;
   tallies byte-identical to the slice11 snapshot (rust 902/22/957/66 ·
   js 874/12/1010/51). CDC independently recounted the divergent set
   from the operator's transcript: **38 form-named-label** (14 surface
   names × {call-head, nested-fn} as `✓bind/✗throw` + lambda/express/
   get/assign/async as `✗macro/✗throw`) **+ 15 `kernel:if`** = 53, no
   other cell diverges — the two documented classes precisely.
5. **D2/D1 spot-demos ✓ verbatim** — `(bind if 0)`, `(func f :args
   (:any if) …)`, `(label if …)` all clean diagnostics with rename
   suggestions; `(bind array 1)(array 2)` → `const array = 1;
   array(2);` (the plain call).

**A-4 and A-5 are hereby reproduced at arc scale and reconciled** (the
matrix run + `make check` green across the workspace = the reconciled
strength); the attested slice rows (A-1, A-3, A-7…A-11, A-13, A-14)
reconcile via the ancestry sweep + workspace-green. **A-6 remains open
by design** — it closes at arc05 slice03 scoping. **ARC13 IS CLOSED.**

## 6. Bubble-up to the project

1. **Did arc13 deliver its capability as `project-plan.md` defines it
   (P-18)?** Yes, pending the gate: "the name-binding matrix converges
   on both backends per DD-60; no invalid output at rc=0 for any name
   class" — the P-18 Verify (this closing-report + the corpus run) is
   exactly §5's steps 3–5.
2. **What arc13 revealed that the project plan didn't anticipate:**
   (a) **the Resolve-Once architecture** (DD-61) — a durable structural
   asset (resolved-atom tags, per-backend walkers, the accessor doors,
   four standing CI checks) that later arcs inherit; Duncan flagged it
   a pivotal 0.6.0 feature; (b) **DD-61 and DD-60's refinement logs**
   need odm attention (DD-61 promotion pending; DD-60 canonical copy
   current through 2026-07-09); (c) **breaking-change notes for arc09**:
   D1 behavior changes (bound macro-named params now resolve — blast
   radius 0 in-tree), D2 (reserved-word names now compile errors),
   plus the slice02-era JS kernel-escape items already routed;
   (d) **arc05's slice03 scope shrinks as hoped** (the A-6 hand-off):
   with real shadowing + D2 in the compiler, the reserved-param-name
   lint question likely reduces to a much smaller rule or none —
   re-answer at scoping, per the operator's original "do the right
   thing instead of warning broadly"; (e) **a standing caution**: the
   A6 layers bound *dispatch*, not emit-time *heuristics* (the
   `contains_await` lesson — recorded in DD-61's as-built entry).
3. **Silent-drop diff at arc scale:** scope-as-specified vs delivered —
   nothing dropped. The one item the arc *chose* not to do (unifying
   JS's D2 pass placement) is a documented, probe-pinned diagnostic-
   quality asymmetry, not a capability gap.

**Project-plan changes required:** flip P-18's row on gate GO; update
the arc13 roadmap row; unpause arc05 (sequence: arc05-resume → arc06 →
arc07 → arc09). Version History entry v1.24 records this bubble-up.

## What Worked / What Recurred (cross-slice trending)

- **Recon-first + probe-first, every time.** Both fixes in slice11 and
  three DD refinements came from probes run before decisions; the two
  scope errors this arc *avoided* repeating (slice02's under-scoped
  recon; slice07's false premise) were both caught by grounding.
- **Fresh-context recycles work.** Twice (slices 06, 10): clean
  self-stop + handoff addendum → same-day delivery by a fresh session.
  Now standard practice for tail-of-session big slices.
- **Single-source components audit their own spec.** The walker found
  DD-60's list holes; the sweep found the name-slot class; the corpus
  build found the `macro`-row gap. Build the enumerator, then let it
  criticize the enumeration.
- **Recurred (systemic, now countered):** "enforced on one path ≠
  enforced" (the arc10 lesson) recurred here as "the matrix bounds
  dispatch, not heuristics" — each time, the counter was a standing
  check rather than vigilance. Four such checks now run in `make check`.
