# B2a correction02 independent HOLD — 595f672b

Separate Sol6.1High CDC, 2026-11-13. **B2-LX remains HOLD on R05**, the original
header-before-executable-regions requirement. R01–04 have passing focused
independent evidence at this candidate; they are not a substitute for complete
B2-LX acceptance. No full known-bad gates were run.

Source is clean at595f672b9991896754ba62a05c7c647dfaaeaa01,
treedd518b1bf339aac75e25a8459c67804f0559de72, dedicated
codex/qualified-adt-core worktree. Implementationf39bc18a changes15 authorized
paths; final595f is an empty metadata follow-up with the same tree. Independent
metadata inspection confirms f39 omitted the Co-authored-by labels and595f has
the correct contiguous Codex/Billo AI trailers. Both messages remain preserved.
No source edit or release/remote action was made. Root owns planning Git/index,
ledger/status/design. Source/build ownership returns clean after this HOLD.

## B2a-R05 — selected source headers are not validated before expansion (P1)

The governing B2a recipe requires known header layout validation before any
selected executable region, with existing classifier diagnostics. Current
lexical_regions::source_function_regions122 and function_regions181 only build
shallow paths. A malformed typed parameter can still produce a usable layout.
Pass2 expands its defaults/pre/body before the authoritative parser error is
reported. Binding collection calls the fallible parser but discards that error
with unwrap_or_default (binding.rs798); an empty binder list is not validation.

### Supported causal witness and controls

fixtures/header-order.lykn defines a supported get-null macro expression:

```lykn
(macro header-probe () (get null "header-body-was-expanded"))
(func invalid :args (:number 9) :body (header-probe))
```

Native compile exits1 with `macro expansion error: Cannot read properties of
null (reading 'header-body-was-expanded') at 0:0`. The body macro ran before
rejecting the numeric parameter name. No output module is emitted.

- header-order-control, with the malformed header and literal body41, exits1
  with `parameter name must be an atom` at1:21.
- header-registration-control defines the exact same get-null macro but uses
  malformed function body41. It exits1 with the normal parameter diagnostic
  at2:21, proving macro registration itself succeeds and the macro is not
  invoked by registration. This is the zero-body-invocation control.
- header-valid-invocation-control uses a valid typed header and invokes the
  same macro. It gives the same get-null expansion error, confirming the
  expression is a supported execution witness, unlike the earlier unsuitable
  throw-shaped probe retained in correction01.
- header-default-order uses `(default :number 9 (header-probe))`; compile exits1
  from the default macro's null property read before the malformed default
  parameter is rejected.
- anonymous-header-order uses `(fn (:number 9) (header-probe))`; compile exits1
  from the body macro's null property read before the anonymous typed-header
  diagnostic.

All command/stdout/stderr/numeric statuses are directly captured, with distinct
stems. These are diagnostic/macro-execution witnesses, not successful program
runtime claims. This is an unfulfilled B2a contract; no assertion is made that
the behavior first originated in correction02.

### Genfn structural header/body alignment

The authoritative classify_genfn parser1972–2022 consumes optional :yields
metadata and then stores body from its selected body_start. A nonkeyword
annotation payload is currently ignored as a type annotation and is not body.
The generic TypedSource layout instead walks immediately after params.

`genfn-ignored-header.lykn` defines get-null header-probe and places its call
in that consumed :yields metadata slot. Compile exits1 from
`genfn-header-was-expanded`. The exact source without that macro definition,
`genfn-ignored-header-control.lykn`, compiles0; its emitted generator contains
only `yield 41`, and actual ESM executes0 printing41. Its retained unused-stream
warning is not erased. The compiler's existing parser accepts and discards the
metadata payload; no new annotation grammar or cross-backend parity is inferred.
The lexical layout must respect the authoritative selected metadata/body slots.

## Narrow parser authority and repair facts

The full bounded caller/definition census is header-parser-census.txt.

- Pure source-header boundaries are classify_func1654 ->
  parse_func_clause_from_args1740 -> parse_typed_params_with_capture2526;
  genfunc1815/1900; genfn1972; fn2283; lambda2307. They validate header syntax,
  select last-wins groups and retain raw body/default SExpr; they do not invoke
  macros or recursively classify executable bodies.
- Whole declaration/all clause headers must validate before first selected
  default/pre/body. Ignored overwritten groups remain inert. Actual unsupported
  multi-genfunc diagnostic remains its existing selected-form policy.
- Preflight belongs after actual lexical/macro root dispatch selects a source
  function boundary. Do not preflight raw arguments to a user macro named func,
  turn bound calls into forms, expand raw arguments early, or add a macro phase.
- Preserve the existing Diagnostic message/span via LyknError::Classify. No new
  error enum is needed. Whole-program classify_with_options would run extra
  protected-host/body-related policy and is not the required pure boundary.
- Class classification3069+ retains raw member prefix/body and checks only
  limited shapes. Kernel classify_kernel_escape46 validates whitelist, not a
  complete parameter grammar. BindingPattern enumeration is not a validator;
  emit_params678/emit_pattern377 are writer-time consumers. Source typed-header
  preflight cannot honestly claim to validate all class/kernel header grammar.
  Preserve their valid/default controls and explicit existing parser limits;
  do not invent a broader class/kernel parameter grammar for R05.

Root retains consequential correction03 design. These are source-grounded
readiness facts, not approval of an unissued final implementation packet.

## Passing focused evidence and actual scope

Initial intake, source readback and environment were recorded before validation
(initial-intake-index.md is retained). Read issuediteration11, governing recipe,
prior HOLDs, actualCCindex and all root correction02 clarifications: formHead
relocation, native/public source-only pass1, kernel:import projection and staged
browser import map. Reviewed actual15-path source delta, parser/layout consumers
and final metadata. Prior Rust/JS/testing guidance remains applicable.

- Native b2a_native integration selector:7passed,0failed,6filtered, exit0.
  Its real CLI/ESM controls replay original R01–04, genuine1000 macro-chain
  limit, own-name recursion, actual normal/async/default export slots,
  bound-call non-hoisting, kernel import and pass1 shadow behavior. Per-case
  command/source/generated/runtime streams/statuses are under native-focused/.
- Canonical current-source public focused suite:82passed,0failed, exit0,
  across nine named files. It includes lexical17, quote/quasiquote/resolution,
  host-reference/private-fragment/protected-host policy, strict binding/type
  isolation and browser-compiled ESM controls. It verifies relocated formHead
  identity plus binding/host-reference exclusion, class-default macro count,
  constructor/static/member scopes and shared-source occurrence behavior.
- Fresh native release build:exit0. Owned XDG/npm/TMP paths were created under
  /private/tmp before first invocation; no user cache was modified.
- No setup or selector failures occurred in this independent run. The new
  header witnesses fail for their recorded substantive reason; the paired
  control has its expected classifier diagnostic or successful ESM result.

These focused passes establish the exercised R01–04 paths; no full native1195,
product1553/67steps, docs482, coldM6 fourteen/45, copiedCLI/fresh-staged browser,
full private/Reflect/completion census, committed citations or gzip gate was
independently rerun after R05. The full/cold evidence directories remain empty.
CC's reported values remain CC evidence, with its chronology, environment,
failed attempts and metadata misattestation preserved. No prior broad green is
converted into independent acceptance. No golden source file changed in the
15-path candidate inventory.

## Reproduction and evidence

Common environment is receipts/environment.txt. Caches and fixtures use
/private/tmp/lykn-b2a-c2-cdc/{xdg,npm,tmp}, outside every repo/config ancestor;
DENO_DIR is the existing /Users/oubiwann/Library/Caches/deno. Command records
were written before their calls (native-build is the explicit cargo build
command retained in the tool trace). Placeholder absolute-CDC in human-readable
command records names this exact canonical directory; source cwd is the task
worktree. Streams and immediate numeric statuses were captured directly to
absolute paths from first attempts. No missing output/status was reconstructed.

Native focused: cargo test -p lykn-cli --test macro_dependencies b2a_native
-- --nocapture, with precreated absolute LYKN_MACRO_DEPENDENCIES_EVIDENCE_DIR.
Public focused: deno test --no-prompt --config fixtures/canonical-public.json -A
with the nine exact test files listed in public-focused.command.txt; config
maps lang/browser/testing to current canonical source, not stale target output.

Each header fixture uses target/release/lykn compile <absolute fixture> -o
<absolute runtime module>, with environment.txt values. The genfn control ESM
uses deno run --no-config --no-prompt --cached-only. All helper/fixture logic is
Lykn; no Python/Ruby/Fennel/handwritten JS helper was authored. Runtime mjs is
compiler output. Source/binary identity and metadata are in receipts/.

## Final disposition

B2-LX HOLD on R05. Original R01–04 passing focused results remain distinct from
closure. All earlier HOLD archives remain unchanged. A/B1/IC accepted scope is
unchanged; B2b, pendingB2-ID-NAME, LC-02–08 and S03 stay open. No source edits,
release integration or remote action. Source/build ownership returns clean to
root; no active build/test process remains. Correction03 needs its own final
source-ready recipe and independent software review after implementation.

## R05 bounded genfn D2 addendum and draft readiness

After the first archive was frozen, root requested the exact inert binding
payload control. `genfn-inert-binding-payload.lykn` contains:

```lykn
(bind factory (genfn () :yields (bind eval 1) (yield 41)))
(bind stream (factory))
(console:log (get (stream:next) :value))
```

Native compile exits1 at1:39 with the strict-mode forbidden binding diagnostic.
Public canonical compiler likewise exits1 in validateReservedNames
(binding.js907), before producing ESM. Both D2 walks wrongly visit the consumed,
ignored nonkeyword metadata payload. The paired exact source changing only the
inert binder to `ignored` compiles0 on both backends; both actual generated ESM
programs execute0 and print41. Native retains its unused-stream warning.
These receipts independently ground the genfn role defect in native/public D2;
they do not assert that every typed-header diagnostic is identical by backend.
The driver is Lykn compiled by the native CLI and calls the actual canonical
packages/lang/mod.js; emitted runtime mjs is compiler output.

The first public legal-name control tool call had a misspelled nonexistent
planning cwd (`project03-languagevolution`). No process started and no product
status file existed. The retry record preserves that setup failure explicitly;
corrected retry01 compile and actual ESM execution both exit0. Thus the earlier
statement that there were no setup failures describes the first archived run;
this later addendum has one disclosed tool setup failure, not a product failure.
No missing status or raw output was reconstructed.

Read the complete draft iteration12 and inspected the pertinent native parser,
pass2 terminal ScopePlan boundary, resolver plan routing and public classifier/
lexical source. No concrete source-readiness contradiction remains in the
proposed R05 recipe: reuse existing pure typed-source parsers, validate every
selected clause before effects including None layouts, preserve actual dispatch
and exact Diagnostic, and share the genfn slot selection with each backend's
actual classifier/lowerer. Existing args.len>=3/yields/len>=4 guard, ignored
nonkeyword payload, short bare-yields behavior and backend error priority must
stay as written. Raw kernel/class writer grammar is explicitly outside that
preflight claim. This is recipe readiness only, not software acceptance.

The first archive and digest remain byte-preserved. The supplemental archive
contains this cumulative index plus all current receipts/fixtures/runtime;
archive hashes are separate files to avoid self-reference. No full gates were
run after the known-bad finding. B2-LX remains HOLD R05. Source/build ownership
returns clean, with no running test/build job, to root for correction03 issue.
