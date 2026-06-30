# arc03 — Compiler Architecture Coherence — Closing Report

> Arc-level close + bubble-up, written by CDC (2026-06-28) from the
> independent end-to-end composition evidence gathered by CC (a fresh context)
> in `workbench/cc-results-design-v060/03-arc03-compileboth-evidence.md`. Per
> `collaboration-framework/docs/PROJECT-MANAGEMENT.md` Part V and
> `templates/LEDGER-DISCIPLINE.md` §B.

## Correction / update — 2026-06-28 (arc CLOSED via slice11)

The verdict below (written when the A-2 run left the corpus red on 6) is
**superseded**: slice11 took the corpus to **green — 1293 passed / 0 failed**, so
arc03 is **closed** (A-6 done). Two corrections to §3/§5, surfaced by slice11:

- **Of the 6 residuals, only the async trailing-`;` (3 failures, one root cause)
  was a real codegen divergence** — and cosmetic. It is fixed in `emit.rs`
  (`is_async_declaration`: async `function`/`function*` now emit as declarations,
  no trailing `;`).
- **F-3 (gensym) and F-4 (import-macros) were NOT compiler defects** — both were a
  *stale `target/lykn/build/` directory* running the corpus against an out-of-date
  `helpers.js` normalizer. This is a **second staleness trap** beyond the stale
  *binary* named in §5 #5. F-7 now guards both (binary vs `crates/`, build-dir vs
  `packages/`). The "0 semantic divergences" finding stands and is sharpened.

The coverage bound (~11%, form-codegen only; §3) is unchanged and remains a
documented limitation. Evidence: slice11 `closing-report.md` + `cdc-verification.md`
(CC-attested runtime; CDC code-verified; operator host re-run recommended to
reconcile). Original verdict retained below for history.

## 1. Capability restated + verdict

**Capability:** the Rust and JS compilers produce the same output for the same
surface input wherever possible, with intentional divergence documented; the
DD-58 kernel/surface separation and DD-37 JS surface compiler architecture are
landed.

**Verdict: composition demonstrated at the semantic level — 0 semantic
divergences — but the arc is NOT yet clean-closed.** The cross-compiler corpus
is currently *red* (6 non-semantic failures). Formal close is gated on a
remediation slice (slice11) that gets the corpus green. This is
**remediation-not-iteration** (LEDGER-DISCIPLINE §B): a failed cleanliness
criterion spawns a planned slice, not an in-place grind.

## 2. Slice walk

| Slice | Outcome |
|-------|---------|
| slice01 cross-compiler-hygiene (M16 + M16-2) | Delivered (closing report + CDC) |
| slice02 dd58-kernel-prefix (M17) | Delivered |
| slice03 dd58-namespace-dispatch (M18) | Delivered |
| slice04 dd58-test-migration (M19) | Delivered |
| slice05 dd58-kernel-corpus (M20) | Delivered |
| slice06 dd58-phase1-polish | Delivered |
| slice07 dd37-bundle-baseline (M21) | Delivered |
| slice08 dd37-per-form-migration (M22) | Delivered |
| slice09 cross-compiler-fast-follows | Delivered (5 grouped items) |
| slice10 icu-doctest-fences (W-4d) | Delivered (round-2 migration) |
| **slice11 cross-compiler-corpus-green** | **Planned remediation — open** (routed below) |

Slice count matches the arc-plan breakdown (slice01–11). No arc-scale silent
drop.

## 3. Composition check (the A-2 reproduction)

Run end-to-end **for the first time** by an independent context (CC), against a
**freshly built** binary (a stale `bin/lykn` is a confound — see §5):

- **146 cross-compiler `compile-both` assertions across 36 form-test files.**
- **1287 passed / 6 failed** (`LYKN_BIN=target/release/lykn lykn test`).
- **0 semantic divergences.** Every one of the 6 residual failures is
  non-semantic, classified from its actual diff:
  1. `async: wraps function declaration` — Rust appends `;` after `async function f(){…}`; JS omits. *(formatting)*
  2. `DD-49 Finding #4: return-type-check convergence` — `result__gensym5` (JS) vs `result__gensym0` (Rust) + a blank line. *(formatting)*
  3. `import-macros convergence` — Rust resolves a macro path relative to the temp file, not project root. *(harness / `--source-context-path`)*
  4. `DD-53 R-5: JSR end-to-end` — empty `lykn compile failed:` message. *(network/environment)*
  5. `for-await-of: basic` — same async trailing-`;`. *(formatting)*
  6. `async function*: basic` — same async trailing-`;`. *(formatting)*

**Root-cause grouping:** #1/#5/#6 are **one bug** — Rust codegen emits a trailing
`;` after an `async function` declaration's closing brace, and the `helpers.js`
normalizer transform #4 ("strip `;` after `}`") doesn't fire for the async case.
Fixing that single quirk clears 3 of the 6.

**Evidence strength:** *reproduced at arc scale* by an independent context (CC),
`attested` pending operator re-run via the documented reproduce steps (§ end).
Consistent with the documented known-divergence backlog at
`packages/testing/helpers.js:104-109` (generators, some async wrapping).

**Coverage bound (honest limit):** the 146 cross-compiler assertions are ~11% of
the full ~1293-assertion corpus, and ~78% of form-test files. They cover
**surface/kernel form codegen** — the DD-58/DD-37 heart of this arc — and are
**silent on reader / expander / surface-macro / integration cross-compiler
parity** (those suites are JS-only or Rust-only). A-2 is strong for form-codegen
coherence and bounded there.

## 4. Composition silent-drop diff (arc-capability specified vs delivered)

- **Specified:** same input → same output wherever possible (form codegen) — **delivered** (0 semantic divergence).
- **Specified:** DD-58 kernel/surface separation — **delivered** (slices 02–06).
- **Specified:** DD-37 JS surface compiler architecture — **delivered** (slices 07–08).
- **Specified:** intentional divergence documented — **partially**: the async
  trailing-`;` class is a *newly characterized* divergence not previously in the
  backlog; it is documented here and routed to slice11 (fix preferred over
  skip-listing). No capability silently dropped.

## 5. Findings bubbled up (dispositions)

1. **Async trailing-`;` codegen quirk (3 failures, one root cause)** → **routed
   to slice11** (remediation): fix in Rust codegen or extend normalizer
   transform #4 to the async case. Preference: fix the codegen.
2. **`import-macros` temp-dir path resolution (#3)** → already the migrated
   `slice09/fast-follows/compileboth-source-context-path` item; **routed to
   slice11** to confirm fixed or formally mark a harness limitation.
3. **JSR/network end-to-end (#4)** → environment-dependent; **disposition:
   no-op** for arc close (not a coherence defect); note as a flaky/network test.
4. **gensym-counter + blank-line (#2)** → cosmetic; **routed to slice11**
   (normalizer canonicalization or accept as documented).
5. **Stale-`bin/lykn` trap** → process finding: `lykn test` / `make` silently run
   against whatever binary was last built; a stale binary produced **16 false
   failures**. **Routed to slice11** (and surfaced to project level): the A-2
   check must `make build-release` first, or the harness should guard binary
   freshness.
6. **Cross-compiler coverage is form-codegen only (~11%)** → **disposition:
   documented limitation**; candidate future work to extend `compile-both` to
   reader/expander/integration. Noted at project level, not blocking 0.6.0.

## 6. Bubble-up to the project

1. **Did arc03 deliver its capability as `project-plan.md` defined it?** Yes for
   form-codegen coherence (0 semantic divergence) + DD-58/DD-37; the arc's
   *clean close* is pending slice11 (red corpus). Project-ledger **P-3 stays
   open** until slice11 closes; **P-9 (compileBoth) moves to reproduced /
   0-semantic-divergence with 6 residuals tracked**.
2. **What did this arc reveal the project plan didn't anticipate?** (a) the
   stale-binary trap is a project-wide reproduction hazard for any A-2-style
   demo (affects P-7/P-9); (b) `make check` is **red on `release/0.6.x`** —
   `cargo fmt --check` fails on 5 committed files (pre-existing, independent of
   coherence) — which blocks the P-7/P-8 clean-toolchain demos and must be
   cleaned before arc09; (c) cross-compiler coverage beyond form codegen is a
   latent gap. All three recorded in project-plan Version History.
3. **Silent-drop diff at arc scale, rolled up:** none. The roadmap expected
   compiler coherence from arc03; it is delivered (form codegen) with the
   residual cleanliness routed to slice11, not dropped.

## 7. Check (independence)

Composition evidence produced by CC (fresh context, not the migration author).
CDC (this report) assembled the arc ledger and verdict. **Operator re-run
recommended** to lift A-2 from *attested* to *reconciled*:

```sh
cd /Users/oubiwann/lab/lykn/lang
cargo build --release
export LYKN_BIN="$(pwd)/target/release/lykn"   # avoid stale/unsigned bin/lykn
"$LYKN_BIN" test                                # expect: 1287 passed | 6 failed
```

## 8. What worked / what recurred

- **What worked:** `compile-both` as the gating harness; the M16-2 conversion
  that lifted cross-compiler coverage from ~4 to 146 assertions.
- **What recurred (cross-slice trend):** formatting-class divergences (trailing
  `;`, gensym counters, blank lines) recur across async/generator forms — an
  arc-level signal that the normalizer's canonicalization set is the right place
  to harden, addressed once in slice11 rather than form-by-form.
