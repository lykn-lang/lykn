# Slice 02: shape-rule-corpus — Closing Report

**By:** CC (Claude Code) · **Date:** 2026-07-06 · **Branch:** `release/0.6.x`
**Verdict: delivered, with one recon-gated STOP (F-4) as designed.** The shape
tier is complete — 12 new rules (10 tier-1 + 2 path-scoped conventions), all
both-direction tested. The ID-44 compiler bug is fixed on **both** backends
(the recon found the JS backend shared the latent bug). ID-03 severity is
measured (0/10 FP). The ID-42 disallow **self-stopped** on a large,
cross-backend-divergent radius — recon table shipped, lint-warn fallback
recommended for the operator. Real dogfood: 5 findings → 3 fixed (a rule bug
the dogfood exposed) + 2 acknowledged. `make check` green.

---

## Per-row ledger walk (6 rows, no silent drops)

**F-1 — the 12 rules — MET.** In `rules.rs`, registered in `mod.rs`. Tier-1:
`no-eval` (error), `no-new-wrappers`, `global-isnan`, `no-arguments`, `no-iife`,
`no-delete-on-array`, `no-json-deep-copy`, `prefer-surface-operators`,
`or-for-defaults`, `for-in-on-arrays` (warn). Conventions (error, path-scoped to
`*_test.lykn`/`*.test.lykn`/`.lyk`): `no-relative-source-imports`,
`no-dirname-fixtures`. 24 both-direction assertion tests + a 12-rule corpus
snapshot (reviewed). `for-in-on-arrays` is **conservative** — only an array
*literal* iterable (`#a(…)` → `(array …)`) is flagged; bare bindings and object
literals are silent (prefer misses over false positives, per the design
sub-question). `no-arguments` matches the bare atom in any position (flagging a
param literally named `arguments` is correct — the guide says it shouldn't
exist).

**F-2 — ID-03 severity measured — MET.** Table below. 0 hits, **0/10** false
positives on real `(or …)` usage. Proposal: **warn** (from the data).

**F-3 — ID-44 compiler fix — MET, both backends.** The recon (mandated JS-first
check) found the JS backend had the **same latent bug**, masked for the guide's
one example by an arg-count coincidence. Fixed both: a `check_loop_binding`
guard rejects `const`/`let`/`var`-wrapped loop bindings on Rust
(`emit.rs`, all three loop forms) and JS (`compiler.js`, `makeForOf` + `for-in`).
Rust regression test + JS cross-compiler corpus rows; both still compile bare
and destructuring bindings. Stayed within a validator guard (no emitter
rewrite → no re-slice).

**F-4 — ID-42 reserved-param — SELF-STOPPED (large), recon delivered.** The
recon (table below) shows the "simple disallow" is neither simple nor safe: the
guide's reserved set is inaccurate, the truly-dangerous set collides with
reasonable param names, and — decisively — **the two backends disagree** on
what a macro-named param even means. Root cause is an expander shadowing
divergence (out of scope). Per the self-stop clause: STOPed the compile-time
disallow, shipped the recon table, recommend the lint-warn fallback for the
operator to re-decide. Blast radius in-repo: **0**.

**F-5 — real dogfood — MET.** `lykn lint test/ examples/ packages/` → 5 findings.
3 were a **rule bug the dogfood exposed** (`!=` is already the surface spelling)
— fixed. 2 are intentional kernel-form uses in `kernel-in-surface_test.lykn` —
acknowledged. End state: exit 1, fully acknowledged. Triage table below.

**F-6 — green bar — MET.** `make check` ✓ (build + lint + test, ~1m07s). JS/lykn
suite **1368 / 0** (was 1365; +3 ID-44 corpus rows). Rust lint tests 36/0; Rust
workspace green (incl. the ID-44 emit regression). Snapshots reviewed, never
auto-accepted.

---

## F-2 — ID-03 (or-for-defaults) severity by measurement

Corpus: all tracked `.lykn` (test/ 109, examples/ 8, packages/ 1).
`or-for-defaults` hits: **0**. All 10 `(or …)` occurrences are legitimate:

| Site(s) | Form | Flagged? | Why not |
|---|---|---|---|
| dd-50, dd-37, equality (7 sites) | `(or …)` inside string test inputs | no | String node, not parsed as a call |
| nested-if-…:14,16 | `(or (= …) (js:eq …))` | no | 2nd operand is a call, not a literal |
| equality_test :39,41 | `(or x y)`, `(or a b c d)` | no | non-literal / variadic |

**FP rate 0/10.** The 2-arg-**literal** shape excludes boolean logic cleanly.
**Proposal (operator confirms): warn** — FP-safe on the corpus; the anti-pattern
is genuine (swallows `0`/`""`/`false`) but a literal default is sometimes
intentional, so advisory not error. Drop to **info** only if future dogfood
shows noise.

## F-3 — ID-44 recon + fix (the JS backend shared the bug)

| Input | Rust (before) | JS (before) |
|---|---|---|
| `(for-of (const (array i v) (items:entries)) …)` (guide's example) | rc=0, `for (const const … of …)` — unparseable | **threw** (incidental — arg-count collapse) |
| `(for-of (const x) items body)` (3-arg, binding-only wrap) | rc=0, `for (const const x; of …)` | **rc=0, `for (const const x; of …)`** — same garbage, no throw |

The JS throw on the guide example was a coincidence; the general case exposed
that **both** backends emit unparseable JS. Fix: a targeted binding-validator on
each backend (rejects `const`/`let`/`var`-wrapped bindings across for-of/for-in/
for-await-of). Guide-09's "Throws" claim is now true on both. **arc09 breaking
note:** code that "compiled" to unparseable JS at rc=0 now errors — it was never
valid output.

## F-4 — ID-42 reserved-param recon (STOP: large + cross-backend divergent)

Probe `(func probe :args (:function NAME) :body (NAME 1))`, both backends:

| NAME class | Rust | JS |
|---|---|---|
| fn, func, type, match, obj, assoc, conj, and, or, bind, when, cond, … | **calls param** (correct) | **throws** (macro fires) |
| cell, express, get, not, lambda | macro fires → **wrong code** | **throws** |
| template, new | macro fires → **wrong code** | **wrong code** (agree) |
| if, while (JS reserved words) | `typeof if` — **invalid JS** | invalid — separate bug class |

Findings: (1) the guide's reserved set is largely wrong — most of those names
work as params on Rust; (2) the **backends disagree** — the same source compiles
on Rust and throws on JS (an expander shadowing-resolution divergence, the real
root cause, out of scope); (3) the truly-dangerous set (`lambda`/`cell`/
`express`/`not`/`template`/`new`/`get`) overlaps reasonable param names, so a ban
breaks working code. **Blast radius: 0** params named from the dangerous set in
repo/guides/examples.

**Recommendation (operator re-decides):** STOP the compile-time disallow (unsafe
+ needs coordinated expander changes on both backends = re-slice). Fallback: a
lint-warn `reserved-param-name` rule (set = macro names that diverge/intercept;
conservative because the cross-backend split makes *any* macro-named param
unsafe) — **recommended, not implemented** (the set is an operator judgment).
Root-cause the expander divergence separately (arc03/arc10 family).

## F-5 — dogfood triage

| # | Finding | Disposition |
|---|---|---|
| 1–3 | `!=` prefer-surface-operators (auto-gensym, contracts, pkg-macro fixture) | **FIXED (rule bug)** |
| 4–5 | `===` in kernel-in-surface_test.lykn:211,216 | **ACKNOWLEDGED** |

The `!=` findings exposed a rule bug: `(!= a b)` compiles to `a !== b` — `!=`
already **is** the surface spelling (the slice-doc contract mistakenly listed
it), so flagging it produced "spell `!=` as `!=`". Removed `!=` from the operator
set (kept `===`/`!==`/`&&`/`||`/`==`) + regression test. The `===` findings are
intentional kernel-operator coverage inside a `Stack` class the kernel-in-surface
test compiles — changing them would delete the test's purpose; acknowledged
pending a future inline lint-ignore mechanism. **Final: exit 1, fully
acknowledged.**

---

## Design-call rationales (surfaced)

1. **`prefer-surface-operators` set corrected by dogfood.** `!=` dropped (it's
   already surface). This is a **contract correction** — the slice-doc's operator
   list included `!=` in error; measured compilation says otherwise. `==` kept
   with a loose-vs-strict caveat in the suggestion.
2. **Conventions path-scope = filename suffix.** `is_test_file` matches
   `*_test.lykn`/`*.test.lykn` (+ `.lyk`) per `test/CONVENTIONS.md`. Confirmed
   against the match set; the two conventions rules are silent everywhere else
   (verified: same relative import flags in a `_test.lykn` file, silent in a
   `.lykn` source).
3. **`for-in-on-arrays` conservative.** Array literals only. An "obvious array
   binding" heuristic would need type/dataflow the linter doesn't have; deferred.
4. **ID-44 guard covers all three loop forms**, not just for-of — they share the
   exact emitter flaw; fixing only for-of would leave for-in/for-await-of
   emitting garbage.
5. **`file` now read → narrowed `allow(dead_code)`** to just `ancestors`/
   `source`/`parent()` (still slice03 forward-API).

## Bubble-up to arc05

- **Corpus state for slice03:** 15 rules live (3 pilots + 12). Remaining arc
  work: `shadowing` (needs `analysis/scope.rs`; the `enter`/`exit` `&mut self` +
  ancestry API are ready), guide-09 relabeling (incl. making ID-42's/ID-44's
  entries accurate), `make lint` wiring, P-11 demo. **Recommended new rule:**
  `reserved-param-name` (F-4 fallback) — operator to confirm the set.
- **DD-59 addendum (CDC):** corpus **19 → 18 lintable** (ID-39 out, slice01) →
  **15 implemented** here + ID-03 severity = **warn** (measured). Two
  compiler-enforcement promotions landed: **ID-44 now a compile error on both
  backends** (was the F-1 "silent invalid output" bug). **ID-42 promotion
  declined** (recon STOP) — recorded as a lint-warn candidate + an expander-
  coherence bug, not a compiler disallow.
- **Compiler-coherence bug surfaced (serious, for a DD/arc):** the Rust and JS
  **expanders resolve param-vs-macro shadowing differently** — a param named
  after a surface macro compiles as a call on Rust but throws on JS. ID-42 is
  the visible symptom; the divergence is the disease. Independent of the lint.
- **Separate compiler bug (filed):** params named after JS reserved words
  (`if`, `while`, …) emit invalid JS (`typeof if`) on Rust. Different class from
  ID-42.
- **Lint-suppression mechanism wanted:** the 2 acknowledged dogfood findings
  (intentional kernel forms in a test) motivate an inline lint-ignore comment —
  arc05 slice03 or a fast-follow.

## Discipline notes

- **Recon gated both compiler fixes.** F-3: JS-first check found the shared bug.
  F-4: recon found large/divergent radius → self-stopped, no unsafe disallow, no
  unilateral 13th rule with a guessed set.
- **Breaking-change notes for arc09:** ID-44 rejection (both backends). ID-42 not
  implemented (no break).
- **Scope held:** no shadowing rule, no guide relabeling, no `make lint`, no
  `--fix`, no config. Source only.
- **Dogfood handled honestly:** a rule bug it exposed was fixed, not
  rationalized; intentional findings acknowledged, not silenced.
- `./bin/lykn` in all transcripts; rebuild-first throughout.

Handed back for CDC `cdc-verification.md`. This closing report is left
**untracked** for the staging pass (per the restored convention). → slice03
(shadowing + guide alignment + `make lint` decision + P-11 demo prep).
