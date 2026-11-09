# S02 independent verification

## Eligible-module delivery — 2026-11-09

Sol 6.1 High CDC independently accepts the finite eligible-module delivery at
`801fcd83f7a79dd945ac109c55d636dd512e8b64`, tree
`1f714d151b82087a2a4abc7f853a265aad28315b`, on
`codex/lazy-protected-invocation`. Luna 6 High CC authored the
[closing report](closing-report.md) and returned source, index, build and raw
ownership clean before CDC execution. The implemented assignment is
[initial scope](cc-prompt.md) through [refinement 04](cc-prompt-iteration04.md),
with four of five normal refinements spent. HI-05 remains blocked. Local
`release/0.6.x` remains clean at accepted S01 `e7b44c1`.

| Row | CDC disposition | Evidence and limit |
| --- | --- | --- |
| HI-01 | Done, eligible modules | Reviewed both private whole-unit adapters, exact identity and complete consumption, ordered stable operands, directive placement, unchanged no-request bytes, and failure/recovery tests. Independent Rust [5/5](artifacts/evidence/cdc/native/stdout.raw) and public [4/4](artifacts/evidence/cdc/public/stdout.raw). The internal request is not a new package export, source form or AST tag. |
| HI-02 | Done, eligible modules | Actual generated provider selects `lyknHostReflectApply2`, preserving the normalized collision and free reference for 0 and 1. Nested Reflect/globalThis and external names retain their fixture meanings. True module Reflect bindings yield private unavailability, while no-request controls retain ordinary compilation. This is finite static-name hygiene, with no claim about arbitrary eval strings observing compiler-generated names. |
| HI-03 | Done, exact proof | CDC generated fresh inputs for both backends, produced eight native-esbuild bundles and metafiles and independently ran ten strict Deno invocations. Exact stdout matched across backends, all exits were 0 and all stderr streams empty. The observer is a separate deliberately mutated host condition. |
| HI-04 | Done, eligible candidate | Accepted S01 is the ancestor. Exact 16-path source delta, canonical/embedded compiler and private JS module byte matches, clean source diff check, current tool pins, focused execution, normal unfiltered Make and standalone citations reproduced. |
| HI-05 | Blocked | Checked internal unavailability for module-scope Reflect on requested units is containment. [The remaining design gate](#hi-05-design-disposition) governs full S02 acceptance. |
| HI-06 | Done, bounded handoff | Actual CC report, independent reconciliation and [CDC retrospective](cdc-retrospective.md) retained. S07/S08 own the eventual real integration-range API/guide/LLM/book audit. No S04 production consumer or release composition is claimed. |

The exact optimizer outcomes were as follows for both backends.

| Case | Complete optimized code and metafile | Strict Deno |
| --- | --- | --- |
| Absent | Ordinary byte-equivalence tests pass. The bundle has no invocation helper or lookup and includes only the absent entry. | `absent` |
| Shaken | Provider and entry both contribute bytes. The provider effect and used marker survive. The unused invocation and its helper/lookup disappear. | `provider`, `use:provider` |
| Retained | `invoke` and `marker` are retained exports. The sole lookup is inside the invocation helper. | Ordinary load prints `provider`. The separate observer prints `provider`, `0`, `1`, with the last read deliberately triggered. |
| Live | Provider and live entry contribute bytes. Original getter and saved receiver/list reach the helper. Own callable .call/.apply are poisoned and a later argument replaces the method. | Getter → spread → argument → original call, receiver with 7/8, unchanged local/free/property results. Getter and argument throws each truncate the trace before call. |

Evidence is under [CC originals](artifacts/evidence/cc/) and
[CDC replay](artifacts/evidence/cdc/). The independent [generated inputs](artifacts/evidence/cdc/generated/),
[bundles and metafiles](artifacts/evidence/cdc/bundles/) and
[prelaunch artifact digests](artifacts/evidence/cdc/bundle-and-observer.sha256)
contain the complete bytes. The `bundle-*` and `run-*` directories retain
exact commands, prospective ancestor-name probes, raw streams and statuses.
The independent build and public runner exits use the actual `status`
filename instead of the prospective `exit-status.txt`. Product test config
is explicit; strict generated runs have `--no-config --cached-only --no-npm
--no-remote --deny-net --no-prompt` in their isolated bundle roots.

Both [normal Make](artifacts/evidence/cdc/make/exit-status.txt) and
[standalone citations](artifacts/evidence/cdc/cites/exit-status.txt) exited
0. Make includes build, Clippy, formatting, all Rust suites (1,157 library
tests), 1,480 Deno tests with 28 steps, and 482 doc tests. The separate
citation result is 64 documents and 601 historical citations. The
[tool pins](artifacts/evidence/cdc/producer-pins.txt) are Rust/Cargo 1.97.0,
Deno 2.9.6 and accepted native esbuild 0.25.5. The [original provenance readback](artifacts/evidence/cdc/tool-preflight.txt)
pins esbuild's clean adjacent source and the independent
[post-Make hashes](artifacts/evidence/cdc/post-make-producers.sha256) pin
the actual task checkout's generated CLI executables.

The CC record's HI-05 phrase “Eligible-module lowering returns ... unavailable”
refers to the **ineligible** module-shadowed cases. HI-03's actual CC
optimizer bytes and metafiles are under the focused native/public evidence
trees named in its optimizer manifests. Raw copies preserve original
absolute locators. Temporary caches are omitted. The first `c945bca8`
freeze used the disclosed per-command hook override and was retained without
rewrite. The later normal commits and no-active-override readback do not
make that command compliant. The initial wrong Deno runner discovered zero
tests, the subsequent `b7dde69c` product run passed 2/4, and the first eight
successful strict invocations omitted required ancestor probes. The fresh
CC ten-run replay and CDC replay add actual prospective evidence. The CC
standalone cited-path command ran twice against the same locators, so only
its second stdout/stderr and exit record are retained. CDC's separate
standalone run had fresh locators.

The staged planning diff check exited 2 on untouched raw output (runner
spacing and blank EOF lines), the raw initial Git object, and two Markdown
line breaks in the preserved CC report. The CDC prose and plan diff check
exited 0. The independent product source diff check also exited 0.

## HI-05 design disposition

The Operator authorized planning and direct implementation when the next
step is source-ready. The bounded source pass after the independent gates
found that the remaining case requires a contract decision. No extra test,
source edit or correction assignment was made.

The current helper uses ordinary lexical resolution of bare `Reflect`.
In a module containing an import, declaration or hoisted var named Reflect,
moving the helper among same-module sibling functions does not change that
binding. A rename changes the environment seen by dynamically supplied
code in the existing `(js:eval code)` escape hatch (source Guide 00 §JS
Interop, `docs/guides/00-lykn-surface-forms.md:1226`; native
`crates/lykn-lang/src/emitter/forms.rs:884–890`). Guide 09 ID-31 discourages
eval but still documents the escape hatch. A discriminating source model
is a module that imports `current` as `Reflect`, runs `(js:eval code)`
twice with the dynamically supplied text `Reflect`, and calls an exporter
operation that changes `current` between the two reads. The imported
binding supplies the old value and then the new one. Renaming the binding
leaves those strings referring to the host slot. Capturing a snapshot
under the original name instead fails the second read. This is a static
semantic argument, with no specimen run or changed oracle.
Moving source into a block likewise cannot keep a real top-level import
or export inside that block. Reading `globalThis.Reflect` changes the
protected-operation recipe and is unsound with the approved replaceable
globalThis alias and permitted local shadowing.

Two viable directions need distinct authority.

1. Preserve unbundled direct eval's binding behavior and authorize a
   compiler-generated, feature-local ESM helper import only in affected
   modules. The helper has a separate lexical environment and could keep
   the protected-property access inside its function. This changes the
   unbundled no-import output contract, including potential CSP/loader
   implications. Pinned esbuild source supports static JavaScript data
   imports (`internal/resolver/resolver.go:465–477`,
   `internal/bundler/bundler.go:1203–1217`), but the exact helper/Deno
   behavior and elimination proof are unexecuted. The same esbuild version
   explicitly disclaims preservation of top-level ESM names through direct
   eval in bundle mode (`internal/js_parser/js_parser.go:1190–1238`).
   Verify language semantics on the unbundled output separately from the
   optimizer proof.
2. Keep single-module output and define an explicit source-name policy for
   direct eval when the facility must rename a module binding. This changes
   language interop, so it needs an approved user-facing contract before
   implementation. Verify actual read/update behavior, import/export
   liveness and external names, normalized scopes and identical no-request
   output. A public unsupported-case diagnostic would also be a policy
   change if chosen in place of full support.

Recommend exploring the first direction only if the Operator accepts the
new output boundary. It preserves the source's existing lexical contract
and limits the output change to affected feature users. No source-level
diagnostic, broader trusted host operation or changed eval policy is
approved by the current outcome.

## Bubble-up

PHI-04's exact eligible-module artifact/effect proof is done. PHI-03,
PHI-05 and PHI-06 remain open at arc scale. P-HI, CI-04 and the S04 CV
rows retain their full criteria. S04 I3 still needs an independently
accepted facility for its ordered-reference consumer. No release merge,
push, publication or original K/tooling activity occurred.
