# M21 Design Call Confirmation

All 10 design calls acknowledged. No dissent.

1. **Bundler: esbuild** — confirmed. Using npm:esbuild via Deno.
2. **Pilot form: `not`** — confirmed. Simplest unary operator.
3. **Bundle target: packages/browser/mod.js** — confirmed.
4. **Three measurements** — confirmed (raw, minified, gzipped).
5. **Bundle output: tmp/bundle/** — using ephemeral output via
   esbuild's write:false + in-memory measurement. No artifact on disk.
6. **CI invocation: `make bundle-size`** — confirmed. Script at
   scripts/bundle-size.js with threshold checking via BASELINE_GZIPPED env.
7. **Baseline in DD-37 refinement log** — confirmed.
8. **Pilot pipeline: DD-37 steps 1+2+3 for `not`** — confirmed.
9. **TDD-first paired commits** — confirmed.
10. **Extrapolation: ~20 forms** — confirmed.
