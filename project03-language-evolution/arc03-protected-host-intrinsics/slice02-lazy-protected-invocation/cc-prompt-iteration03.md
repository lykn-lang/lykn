# S02 source refinement 03 — focused oracle and lint corrections

Continue the [original assignment](cc-prompt.md) from clean format
freeze `b7dde69c9c120bf0606fb8aaccf5552ecc3678b7`. Native no-run
and the five selected native tests exited 0. The first public launch
used the wrong package config and strict runtime flags, exited 1
before discovery, and is retained. The corrected actual product
command `deno test --config project.json -A` ran four tests, two passed
and two failed. Preserve all actual raw and both materialized outputs.
No esbuild or runtime has run. Correct the bounded test issues while
keeping the complete reviewed provider, live and observer inputs unchanged.

- Remove the unused Rust HashSet import and unused writer accessor
  from codegen/format.rs. No runtime or request-shape change.
- In the public nested-operand assertion require the actual correct
  "stable atom references" error. For two anchors, require one helper
  declaration plus the two exact call expressions. Do not count the
  declaration as one of the calls. Check the generator fixture by its
  actual astring spelling `function* () {` or a spacing-independent
  structural predicate. Use repository-cwd fixture paths. Keep exact
  no-request/role/directive and error checks. Add the already prescribed
  rejected-callback-finalization control by calling actual compileExpr
  within the wrong callback and asserting that provisional output is
  not returned. Include original orphan/unconsumed and normalized
  module-name cases where absent.
- Keep optional actual evidence output, with the same source/path
  roots and generated files. Use existing temporary cleanup for normal
  no-evidence execution. Do not change runtime trace/output or fixture
  operands. No new dependency, flags, source scope or trial family.

Fixed normal -F body:
`/private/tmp/lykn-s02-cdc.gadeVma9/s02-refinement03-source-message.txt`.
Return immutable candidate; use normal formatter if needed. The
original effective product runner and native no-run/direct gate,
actual four cases per backend and retained observers, full normal Make
and cited paths all remain. No further serial hold once prereleased
conditions are satisfied. HI-05 remains held.
