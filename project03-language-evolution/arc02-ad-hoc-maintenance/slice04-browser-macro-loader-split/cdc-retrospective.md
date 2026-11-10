# S04 CDC retrospective

The scoped staged import-map fixture caught a meaningful referrer
dependency. Retaining the resolver in the public Deno façade
preserved the old result without broadening the public context.
The actual CLI/Chromium evidence also separated generated
diagnostic identifiers from the stable error cases.

Two process faults affected the initial evidence. CC added JS
verification code to the meter despite the evidence-language
constraint and removed it before source freeze. The independent
native esbuild output comparison replaced it. CC's WIP launches
also preceded a clean freeze. CDC then failed to make its first
normal launch conditional on a successful whole-delta whitespace
check. The exact failed checks, original outputs and corrected
final replay remain visible. Check staged new files before
freezing and enforce preflight in the command orchestration.
