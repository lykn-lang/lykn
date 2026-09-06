# M22 Design Call Confirmation

All 8 confirmed. Notable adjustments:

1. **Batch ordering: smallest-first** — confirmed with adjustments.
   genfn moved to batch 7, genfunc to batch 8.
2. **3-5 forms per batch** — confirmed.
3. **TDD-first paired commits** — confirmed.
4. **emit pattern: M21's dep-injection** — confirmed.
5. **Per-batch bundle-size** — confirmed.
6. **CI integration** — confirmed; existing .github/workflows/ci.yml.
7. **Special-case preflight** — adjusted: macro/import-macros not in
   surface.js. Only = and != need special-case treatment.
8. **unquote/unquote-splicing excluded** — confirmed.
