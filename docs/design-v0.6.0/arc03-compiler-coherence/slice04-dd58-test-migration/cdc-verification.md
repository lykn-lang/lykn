# M19 Closing Report — CDC Review

**Reviewer:** Cowork Claude (CDC role, cdc/compiler-coherence thread)
**Reviewed artifact:** `workbench/2026-05-17-M19-closing-report.md`
**Reviewed at:** 2026-05-17
**Disposition:** **Accepted with two methodology callouts.** Substantive
work is correct and complete; the audit's key finding is independently
verified; the runner change is in place and behaves as specified;
backward-compat is preserved. Two methodology learnings (TDD-first
adaptation and single-commit M19-4) are noted as non-blocking
observations. Iteration count: 1 of 5.

The closing report itself surfaces the most important substantive
finding of the entire DD-58 Phase 1 sequence: **the test corpus
contains zero source-level kernel-only forms because all kernel-form
exercise happens inside `(compile "...")` strings, which the strict
classifier does not see.** This is both good news (no migration
needed) and a substantive coverage gap that motivates the next
milestone.

---

## Protocol checklist

| Requirement | Status | Notes |
|---|---|---|
| Item count: 8 → 8 walked | ✓ | All ledger rows addressed |
| Every done item: evidence reproducible | ✓ (with callouts) | Verified independently below |
| No silent drops | ✓ | M19-3 explicitly dispositioned as no-op with rationale |
| Spec-softening check | ⚠ (see methodology callouts) | TDD-first was adapted rather than strict; substantive intent was met but methodology shape was loose |
| Partial-adoption check | ✓ | Strict-mode validation applies uniformly to all `.lykn` test files |
| Backward-compat invariant | ✓ | Production code paths unchanged; verified by reading runner code |
| TDD-first discipline | ⚠ | See M19-4 callout below |
| Substrate-rule compliance section | ✓ | Six rules addressed |
| Fast-follow findings logged | ✓ | One finding logged; substantive (motivates M20) |

---

## Per-row verification (independent reproduction)

### M19-1 — Baseline ✓

`workbench/verify/m19/baseline.txt` exists; captures Rust (1022),
forms (670), surface (292), plus the bare-kernel-form occurrence
counts. Five sections present (≥4 required by verify command).
Independent read confirms baseline is well-structured and honest
about strict-mode being dormant pre-M19.

### M19-2 — Audit ✓ (independently verified)

`workbench/verify/m19/test-migration-audit.md` exists with the
complete inventory.

**Key finding (zero bare kernel-only forms at source level) —
INDEPENDENTLY VERIFIED.** I ran:

```
Grep pattern: ^\(const |^\(let |^\(var |^\(function |^\(function\* |^\(quote |^\(quasiquote 
Scope: .worktrees/compiler-coherence/test/**/*.lykn
Result: 0 matches across 48 .lykn test files.
```

CC's grep result is correct. The audit's claim is substantive.

The audit's secondary claim ("all ~20 occurrences are inside
`(compile "...")` strings") is reasonable; I did not exhaustively
verify each occurrence (the approximate count is sufficient for
the audit's purpose — the substantive finding is "all are in
compile strings", not the exact count).

### M19-3 — Migrations: no-op ✓

Disposition is honest. Zero bare kernel-only forms at the source
level means zero migrations needed. The "no-op" designation
follows LEDGER_DISCIPLINE's no-silent-rewrite rule cleanly: the
row was walked, the rationale was named, the disposition stands.

### M19-4 — Test runner strict validation ✓ (with methodology callout)

**Code change verified at `crates/lykn-cli/src/main.rs:585-612`:**

```rust
// DD-58 M19-4: strict-mode validation for .lykn test files.
// Parse and classify with strict mode ON before JS compilation.
// Rejects kernel-only forms (const, let, var, function, etc.)
// at the test-file source level without the kernel: prefix.
if let Ok(source) = std::fs::read_to_string(lykn_path) {
    if let Ok(forms) = lykn_lang::reader::read(&source) {
        ...
        if let Ok(expanded) =
            lykn_lang::expander::expand(forms, Some(lykn_path.as_path()), imports.as_ref())
        {
            let opts = lykn_lang::classifier::ClassifierOptions { strict: true };
            if let Err(diags) =
                lykn_lang::classifier::classify_with_options(&expanded, opts)
            {
                for d in &diags {
                    eprintln!("{d}");
                }
                eprintln!(
                    "error: {} failed DD-58 strict-mode validation",
                    lykn_path.display()
                );
                process::exit(1);
            }
        }
    }
}
```

This is the right shape: parse → expand → classify-with-strict-on
before JS compilation; exit with diagnostic + path on rejection.
Strict mode is local to `compile_lykn_test_files` and does not
propagate to `cmd_compile` (production path) — verified by reading
the surrounding code.

**Verify command satisfied:** `grep -E "strict.*true|ClassifierOptions"`
returns the `ClassifierOptions { strict: true }` occurrence at
main.rs:597. ✓

**Methodology callout A — TDD-first was adapted, not strict.**

CC's closing report explicitly notes: "The TDD pattern here is
adapted: the 'failing test' is the implicit assertion that
compilation succeeds with strict on — if a kernel-only form were
introduced at the source level, the strict validation would fail
the compilation."

That's not TDD-first. The strict pattern for this milestone would
have been:

1. Write a test fixture with a bare `(const x 1)` at top level
   (or similar bare kernel form).
2. Write a test that asserts the runner REJECTS this fixture
   under strict mode (i.e., compilation should fail with the
   expected diagnostic).
3. Commit the failing test (it would pass-without-rejection
   pre-fix because the runner uses lax classification).
4. Implement the runner change.
5. Commit the fix.
6. Test now passes (the fixture is correctly rejected).

What CC built instead is the **positive-direction** test
(`dd-58-strict-mode-enforcement_test.lykn` — a surface-only test
that confirms strict mode doesn't break valid tests). That's
necessary but not sufficient: it doesn't prove the strict gate
actually rejects bare kernel forms. The substantive proof of
rejection is left implicit — "if any test file ever introduces a
bare kernel form, compilation will fail" — but no regression test
asserts this directly.

This is a real methodology gap. **Mitigation suggestion (not
blocking M19 closure):** add a single fixture test that
demonstrates the rejection. Could be done as a fast-follow item.

**Methodology callout B — Single-commit M19-4 vs. paired-commit
requirement.**

The M19 ledger's verify command for M19-8 says: "For M19-4 (runner
change) the test commit precedes the fix commit." CC's closing
report cites `3988e82` as "runner change + test" — single commit.

The grep-based verify command for M19-4 is satisfied (the strict-mode
code is present). But the methodology intent (TDD-first paired-commit
discipline) was not followed at the commit boundary either. The two
callouts (A and B) are related: the test-commit-first discipline
would have produced two commits AND a meaningfully-failing-then-
passing test. CC's approach skipped both.

Disposition: not blocking, but worth canonicalizing for future
milestones — the TDD-first MUST should specify "separate
test-only commit followed by fix-only commit" explicitly, since
"adapted TDD" can otherwise smuggle in single-commit + positive-
direction-only patterns that don't catch the regressions TDD-first
is designed to prevent.

### M19-5 — All tests pass under strict ✓

- `make test-lykn`: 292 surface tests pass. ✓
- `./bin/lykn test test/forms/`: 671 forms tests pass (670 baseline + 1
  new — the M19-4 enforcement test). ✓
- Pass counts strictly ≥ baseline. ✓

Note: forms test count of 671 includes the new
`dd-58-strict-mode-enforcement_test.lykn`. If you remove that one
contributed test from the count, you get 670 = baseline exactly.
The +1 is the M19-4 test artifact, not migration-induced.

### M19-6 — Backward-compat for non-test paths ✓ (independently verified)

`cargo test -p lykn-lang` reports 1022 (≥1021 baseline). ✓
`cargo test -p lykn-cli` reports 83. ✓

**Independent verification of strict-OFF default for production:** I
read `compile_lykn_test_files` (the runner) and confirmed strict
mode is local to that function. `cmd_compile` is not in the same
code path and uses the default `classify()` (lax). Production
`lykn compile` is unaffected. ✓

### M19-7 — Closing report substrate-rule compliance ✓

Six rules addressed in the closing report's "Substrate-rule
compliance" section. The TDD-first claim "adapted for migration
milestone — the pre-existing passing test suite IS the regression
net" is the same methodology shape called out in M19-4 — see
methodology callout A. The verify command (`grep -cE "^## Substrate-
rule compliance"` returns 1) is satisfied.

### M19-8 — Single coherent commit chain ⚠

`3988e82` is cited as "runner change + test" (single commit). Verify
command says "for M19-4 (runner change) the test commit precedes
the fix commit" — i.e., two commits expected, test-first. Only one
commit produced. See methodology callout B.

**Grep-level verify is satisfied** (`git log --grep="M19\|test.
migration\|strict.*test\|DD-58"` finds `3988e82`), but the
methodology intent (paired commits) was not.

---

## Aggregate criteria — independent verification

- **AG-1:** All 8 ledger rows addressed. ✓
- **AG-2:** Tests pass (1022 Rust, 671 forms, 292 surface).
  Strictly ≥ post-polish baseline (1022 ≥ 1022, 671 ≥ 670, 292 ≥ 292). ✓
- **AG-3:** No regressions. ✓
- **AG-4:** Backward-compat preserved. ✓
- **AG-5:** Methodology compliance — see callouts.

---

## Substrate-rule compliance — independent verification

CC's six-rule section is correct on substance:

1. **AGENTS.md safety gates** — no bypass flags injected. ✓
2. **LEDGER_DISCIPLINE no-silent-rewrite** — all 8 rows addressed,
   M19-3 explicitly dispositioned. ✓
3. **philosophy.md Principle 1** — no structural source-tree
   changes. ✓
4. **philosophy.md Principle 3** — strict validation produces
   actionable diagnostics. ✓ (verified by reading the error
   message format in main.rs:604).
5. **Backward-compat invariant** — production paths unchanged. ✓
6. **TDD-first discipline** — see methodology callout A; the
   self-reported "adapted" shape is honest but flags that strict
   TDD-first was not followed.

---

## Methodology observations

### Methodology-positive behaviours

1. **Iteration 1 closure with honest audit.** CC produced the
   complete audit, ran it, surfaced the "zero migrations needed"
   finding clearly, and did not artificially inflate work to
   appear busy. The simpler-than-expected finding was reported
   without hedging.

2. **No-op disposition for M19-3 was correctly named.** Per
   LEDGER_DISCIPLINE.md, "no-op with rationale" is a legitimate
   close. CC named the rationale (zero bare kernel-only forms at
   source level) and did not silently drop the row.

3. **The substantive finding ("compile-string contents bypass
   strict") was surfaced cleanly in the fast-follow section.** This
   is exactly the kind of substantive observation CDC is supposed
   to act on. The audit doc is structured well enough that future
   reviewers can re-derive the finding without re-doing the grep.

4. **Backward-compat was verified explicitly** by reading the
   runner code, not just by trusting that other tests pass. CC
   confirmed that strict mode is local to `compile_lykn_test_files`.

### Methodology-learning candidates

1. **TDD-first "adapted" patterns are easy to miss.** When the
   milestone is "behavior-change of the test runner", strict
   TDD-first requires a negative-direction test that demonstrates
   the new rejection behaviour, not just positive-direction tests
   that confirm existing-valid-cases still pass. The adapted
   pattern CC used (positive-only) is necessary but not sufficient.
   **Worth canonicalizing in future MUSTs:** "for behaviour-change
   milestones, the failing test must demonstrate the new rejection
   path, not just continued success of pre-existing valid cases."

2. **Paired-commit discipline at the SHA level.** The M19 ledger's
   verify command for M19-8 said "test commit precedes fix commit"
   — but CC produced one combined commit. The grep-level verify
   was satisfied but the intent was not. **Worth canonicalizing:**
   either the verify command should be tighter (e.g., "git log
   shows two commits, the earlier one adds tests, the later one
   adds the implementation"), or the MUST should make the SHA-
   boundary requirement explicit.

3. **The compile-string finding is substantive enough to be its
   own milestone driver.** CC's finding "kernel-only forms in
   compile strings bypass strict" is the same gap Duncan
   independently observed in conversation ("we need .lyk test
   coverage"). Two paths to the same finding: CC found it
   empirically during the M19 audit; Duncan recognized it
   strategically from the absence of `.lyk` tests. **This
   convergence is methodology-positive — both the empirical and
   the strategic lens surfaced the same gap.**

---

## Substantive finding flagged for milestone-level action

**CC's M19-2 audit established:** the strict-mode regression net
only sees source-level forms in `.lykn` test files. ~20 kernel-only
form occurrences inside `(compile "...")` strings are NOT subject
to strict validation. And there are zero `.lyk` (kernel-extension)
test files in the corpus — only `.lyk` example files in
`examples/kernel/`.

**Net effect:** kernel-layer semantics are tested transitively
(through surface tests that compile to kernel forms) and via
runtime-compile strings, but there is **no first-class source-level
kernel test corpus**. The kernel layer IS the substrate of the
language; DD-58 made it an intentional sub-namespace; it deserves
the same test discipline as the surface layer.

**Recommendation:** open M20 to address this. Scope: kernel test
corpus at `test/kernel/` (per-form `.lyk` test files), runner
extension to classify `.lyk` files in kernel mode, audit of
`(compile "...")` strings to decide migration-vs-leave-as-is,
DD-58 enumeration becomes the coverage spec.

---

## Recommendations

1. **Accept M19 closure.** Substantive work is correct; methodology
   callouts are non-blocking learnings.

2. **Optional fast-follow: add a negative-direction enforcement
   test.** A fixture `.lykn` file with a bare `(const x 1)` at top
   level and a test that asserts the runner rejects it with the
   expected diagnostic. Small scope; could be done as part of M20
   or as a standalone drive-by. CDC recommendation: bundle into M20
   since the kernel-test infrastructure work is the natural home.

3. **Canonicalize the TDD-first paired-commit MUST** in future
   ledger drafts. Make the SHA-boundary requirement explicit; spell
   out that "behaviour-change milestones" require negative-direction
   tests (the failing test must demonstrate the new rejection),
   not just positive-direction tests.

4. **Open M20 immediately.** The convergence between Duncan's
   strategic observation and CC's empirical finding is unusually
   clean — the gap is real, the scope is bounded, and DD-58's
   enumeration gives the coverage spec for free.

---

## Open inputs for Duncan

1. **Accept M19 closure?** CDC recommendation: yes.
2. **M20 scope — fold negative-direction enforcement test into M20?**
   CDC recommendation: yes (natural home).
3. **M20 priority vs. closest_kernel_form drive-by.** The kernel-
   test gap is substantively larger; the drive-by is cleanup.
   CDC recommendation: M20 first, drive-by can run in parallel
   on a different CC thread if you want both moving.
4. **DD-58 Phase 1 — declare complete?** With M19 accepted, Phase 1
   (M17 + M18 + polish + M19) is substantively done. M20 is Phase
   1.5 / coverage-completion work, not Phase 2 (Phase 2 is M20+
   per DD-58's original phase mapping). Want me to draft an
   explicit "Phase 1 closure" note before scoping M20?
