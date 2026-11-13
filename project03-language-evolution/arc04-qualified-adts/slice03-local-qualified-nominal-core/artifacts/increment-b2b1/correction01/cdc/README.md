# B2b1 correction01 independent intake

Sol6.1High,2026-11-13. Exclusive source/build at clean
5554a4d6bd0aa66bbca3cedfd91a41e0f1cf86cb,
treef632c415b833e796e6843abdc5220d6492595fc0, codex/qualified-adt-core.
Read full issued15/CC index and actual parent diff before product invocation.
Exactly one file/one existing Rustdoc negative+adjacent prose changes; all added/
removed lines are doc comments. All three actual fields are now specified using
existing public imports and valid inferred types. Old emitter-arity negative and
normal examples untouched; production fields/signatures/algorithm unchanged.
Literal contiguous trailers inspected, independent parsed record due at handoff.

Previous independent cf packet0864bc...b660d remains immutable. No acceptance
until corrected Rustdoc is rerun and actual privacy-only rejection inspected.
Retained cf compiled-code/runtime/CLI/full/cold/size evidence is applicable to
the unchanged implementation/test inputs, subject final source/provenance check.
No repeated full/docs/product gate solely for new comment commit. Only B2-UNIT
may close; name hygiene/owner/LC02–08/S03 remain open. No source edits/index/
ledger mutation, forbidden helper/dependency/release/remote action. Root owns
planning Git/status/design. Existing Rust/testing guidance remains applicable.

## Final disposition — B2-UNIT accepted, U01 resolved

Independent corrected Rustdoc, source/API/privacy review and provenance are green
at **5554a4d6bd0aa66bbca3cedfd91a41e0f1cf86cb**, tree
**f632c415b833e796e6843abdc5220d6492595fc0**. Only B2-UNIT closes. The prior
cf432622 HOLD/index/archive remain unchanged and explain the original oracle
weakness; this successor resolves it rather than rewriting that disposition.

The complete literal supplies exactly the real private fields at
crates/lykn-lang/src/analysis/mod.rs50–54: forms, type_registry and diagnostics.
The TypeRegistry import is public (analysis/mod.rs7), its Default implementation
exists (analysis/type_registry.rs36–37), and Vec element types infer from the
actual fields. Independent Rustdoc stderr reports **one E0451 and no other
error for this example**, naming all three private fields. No missing-field,
import or type error is present. The separate old-call negative produces E0061
(expected &AnalyzedUnit, extra registry argument); these are distinct controls.
The four examples pass:2normal and2compile-fail,0failed. No production mutation
was used to manufacture the privacy proof.

| Current-HEAD gate | Actual result / receipt |
| --- | --- |
| Corrected Rustdoc | cargo test -p lykn-lang --doc -- --nocapture exits0;2normal+2compile-fail. rustdoc.stdout/stderr/status.txt preserve actual diagnostics. |
| Format | cargo fmt --all -- --check exits0; no output/source edits. |
| Committed citations | make check-cited-paths exits0;64documents,601historical citations. |
| Final provenance | Empty source porcelain; exact HEAD/tree above; one-file8insertions/2deletions; all changed lines are doc comments. Literal and Git-parsed contiguous Codex/Billo co-author trailers match. provenance.* preserves commands/full diff/metadata. |

## Actual API and retained semantic findings

Current APIs match the reviewed implementation: analyze consumes Vec<SurfaceForm>
and returns Result<AnalyzedUnit,AnalysisFailure> (analysis/mod.rs126). The unit
owns the original forms, their resulting TypeRegistry and ordered diagnostics;
public forms()/diagnostics() borrow immutable slices, registry access is
crate-private (lines58–68). There is no public constructor/parts/mutator/Clone/
Deserialize escape. Canonical emitter::emit(&AnalyzedUnit,bool), emit_json with
the same unit, and emitter::dts::emit_dts_module(&AnalyzedUnit,&str) obtain the
matched forms/registry from that unit. Raw fragment/leaf DTS/kernel-codegen
interfaces retain their separate contracts; they are not newly owner-safe.

The actual one-file diff contains no algorithm, signature, field or caller
token change. Prior independent algorithm/order/error/warning observations
therefore remain applicable: original collect/check/track/export/diagnostic
order; success retains warnings/info, failure retains all diagnostics but
Display renders ordered Errors with existing spans/suggestions. Compile prints
successful analysis Warnings; dist retains its existing NO-analysis-warning
behavior and DTS warnings, path-wrapped Io/InvalidData analysis errors. The unit
asserts analysis success, not total nested classification/codegen success.
check_strict/dev preliminary classify-only join remains explicitly deferred.

## Retained independent cf432622 evidence and exact limits

The complete actual diff is solely the corrected existing Rustdoc and adjacent
explanation in analysis/mod.rs. All production Rust tokens, integration/product
fixtures, canonical public/embedded compiler modules, staged-browser inputs,
build scripts, CLI paths and compression inputs are unchanged. Under root's
explicit conditional retention direction, the following independent cf evidence
is applicable to this identical implementation. No full/product/M6/CLI/size
rerun was performed solely for the new documentation commit; new Rustdoc and
final-HEAD citations/provenance above were independently executed.

| Retained cf gate | Exact prior independent result |
| --- | --- |
| Focused native/API |22analysis;22cross-compiler+18e2e+9emission;53CLI compile+3validation-parity tests pass. |
| Matched registry/CLI |Interleaved equal-Entry/different-field units use registry-dependent MATCH projection; checked/stripped and JSON→actual public compiler→ESM give3/three (6runtimes), each DTS has its own field/type. Analysis failure/suggestion then recovery, compile/dist warning asymmetry and dist filename preserved. |
| Public/private/completion |54cases/43steps across6canonical files pass; host/private fragments/lazy Reflect/type state/lexical/completion/browser compile ESM covered. |
| Single final-source full |make check0 at cf:1199native library units,1557product/67steps,482docs once;22generated files/482blocks/15skipped. Includes final registry-dependent match test. |
| Cold delivery |Full's captured M6:14byte comparisons,49materialized cases (5+6+17+21), fresh staged browser, actual materialized mapping, absent owned compiler-XDG/copied CLI/no canonical cwd. Separate absent-XDG copied CLI macro→Entry MATCH runtime3+own DTS. |
| Browser size |46600gzip bytes<81920;35320headroom,27630baseline,18970delta; raw361569/min172901. Identical current compression inputs, retained measurement pinned cf. |

The cf archive is
../../cdc/receipts-cf432622.tar.gz, SHA256
0864bc473e988c6d9c2cbe6c2cf490249d8a8aea5f524b880ba1ba1f5c1b660d.
The retained copied binary SHA0ff85708c7c8a51672e1891cad8cffe0215243586b945aa5c07ed9b60dce34f3
is specifically the cf build; no claim is made that a post-doc build has that
binary hash. Prior cited-path and old weak privacy-example results are history;
current corrected privacy/citations above supply the required successor proof.

A/B1/IC/B2-LX remain accepted within their recorded limits. Source-name policy
is resolved, but the recorded some-name/someName runtime2 is still an
unimplemented hygiene baseline, not new name acceptance or a B2-UNIT defect.
Name allocation/identity, OwnerRef/CaseRef/field TypeRef/nominal activation,
private public requests/nested transport/purity, check_strict/dev join, final
DTS/API/S06/consumer/book/human and LC02–08/S03 remain open. Fixed-nine layout,
I4, legacy fallback, sentinel warm cache, catch-emitter, backend multi-clause
default differences, nested alias/annotation/runtime-emitter and browser
indirect-eval run/load/CSP limits persist. Browser proof is compile-to-ESM.

No independent author/setup/product failure in this correction run. Both expected
compile-fail diagnostics are preserved, not counted as gate failures. All own
tmp/XDG/npm directories existed before invocation outside repos/config ancestors;
existing DENO_DIR reused. No caches, source edits, source Git/index mutation,
ledger/status edit, forbidden helper/dependency/release/integration/remote action.
All commands completed; no build/test remains active. Source/build returns
clean at the exact HEAD/tree above; root owns planning Git and next activation.
