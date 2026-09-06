# M20 Design Call Confirmation

All seven design calls acknowledged. No substantive dissent.

1. **`.lyk` classifier mode: kernel-only post-expansion.** Confirmed.
   Post-expansion top-level forms validated against `is_kernel_form()`.
   Surface forms rejected with diagnostic.

2. **Test directory: `test/kernel/`.** Confirmed. Mirrors test/forms/.

3. **Single-form-per-file shape.** Confirmed. `<form>_test.lyk` naming.

4. **compileBoth for kernel forms.** Confirmed where both compilers
   implement the form.

5. **Compile-string audit: additive, not migration.** Confirmed.
   Dispositions recorded; no string migrations.

6. **Flavor (b) passthrough coverage: representative.** Confirmed.
   ~6 tests covering representative sample.

7. **M19-4 negative-direction test folded into M20-9.** Confirmed.
   TDD-first paired commits for the .lykn strict rejection test.

**Classifier mode shape:** Confirmed (α) — add `kernel_only: bool`
to `ClassifierOptions`. Symmetric with M18's `strict: bool`.
