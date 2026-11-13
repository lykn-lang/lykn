# Public ICU follow-through — independent design readiness

Sol6.1High,2026-11-13. **Source-ready as an unissued next recipe**, with the
explicit candidate-pin/test-home refresh below still required before issue.
No concrete contradiction found in compiled-Identifier reservation, local
allocator sharing, nested templates or private invocation AST handling. This
is not implementation/software acceptance; Luna exclusively owns current
native source/build. No build/tests/source/Git/index/ledger changes were made.
Root owns design/planning and the eventual numbered implementation assignment.

Read full artifacts/b2-public-icu-hygiene-recipe.md. Source references are
immutable5554a4d6bd0aa66bbca3cedfd91a41e0f1cf86cb/treef632c415b833e796e6843abdc5220d6492595fc0
in /Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering,
branchcodex/qualified-adt-core. Actual read-only git diff confirms the public
compiler/mirror/template test/browser compiler/cold harness still match5554
at review time; this does not claim the active native candidate is unchanged.

## Source-grounded readiness

- compiler.js196–299 has ambient selector state/reset, compileExpr exactly once
  per kwarg at233, Map validation before hoisting, and fixed normalized locals
  at268. Creating the allocator after all compiled-kwarg validation retains
  diagnostic order and nested-compilation/effect count. Preserve Map order.
- compiler.js1743–1850 returns actual ESTree Identifiers after normalization,
  MemberExpression roots/properties for colon names and ordinary child AST for
  nested templates. A borrowed/read-only structural Identifier census sees
  source _n!, colon roots and nested generated locals without reconstructing
  source normalization. Conservative noncomputed property Identifier reservation
  is safe; Literal payloads/metadata strings are not binding spellings. Current
  code-generated AST is acyclic but shares objects (selector vId and overrides),
  so a visited WeakSet is compatible without granting malformed-input support.
- Complete helper/caller census: emitMft301–334 calls plural/select323/327;
  plural336–395 recurses362/374/383; select398–438 recurses418/425;
  templateIcu280 and literal-only dispatcher1338 are the only other emitMft
  callers. countSlotReferences448–461 and makeSlotOverride464–468 preserve
  current reference counts/shared Identifier use. Explicitly threading one
  allocator through these doors closes both hoist/selector families without
  changing IIFE/return/exception placement. Independent nested templates first
  produce AST that the outer census then scans; no ambient selector reset is
  needed. Conservative nested-name reservation may rename an outer safe-in-
  principle preference, which the recipe expressly allows for freshness.
- Private AST interaction is compatible: host-invocation.js52–65 compiles a
  requested call into ordinary CallExpression/Identifier/argument AST and keys
  that SAME call object in PROVISIONAL WeakMap. The proposed scan must retain
  object identities and not compile arguments again. finalizeHostInvocations
  at68–98 later walks the complete AST, sees generated ICU names, chooses a
  noncolliding helper and replaces pending callee only; scan's reservation of
  the pending Identifier is conservative. No private metadata copying/new trust
  is required. Complete compile lowers host refs before compileExpr, then
  finalizes invocations before generate (compiler.js final compile body).
  Fragment compileExpr still rejects unfinished owned host refs at1745–1747;
  allocator work must not turn fragment compilation into a full-unit adapter.
- Preserve eager repeated nontrivial kwargs at260–297 and once-referenced
  unselected-branch laziness. Public isTrivial is actual Identifier/Literal;
  native uses SExpr Atom (including colon access) and is not rewritten here.
  Do not silently introduce cross-backend getter-evaluation parity while adding
  cross tests. Existing safe output/parser/concat paths remain controls.

## Required pre-issue test-home/pin refresh

The design correctly leaves these explicit rather than claiming runtime proof:

1. Refresh final independently accepted native pin/diff and affected public
   function/caller inventory. Authorize each actual modified test/harness path
   in the numbered prompt; source scope must not be inherited from a filename.
2. test/forms/template-icu.test.js imports lang/reader/compiler and local lykn()
   is raw read→compile. Its existing evalLykn/new Function tests are writer
   proof, not source expansion, canonical module or ESM delivery. packages/lang/
   mod.js public lykn is read→expand→compile; compileExpr returns ESTree, and
   expandExpr is a separate expansion/host-finalization adapter. Product tests
   must name/consume each actual output contract, not treat all as JS strings.
3. Current M6 macro_dependencies.rs1061–1161 compares14modules including compiler
   but executes ONLY embedded-adt-pattern, surface-type-context,
   reserved-binding-output and lexical-regions (derived49cases). Adding tests
   solely to template-icu does not add cold runtime coverage. Either enumerate
   an authorized cold harness update or place mapped-import ICU runtime controls
   in a current materialized test home; derive actual new counts. A byte match
   alone is delivery evidence, not execution of repaired ICU behavior.
4. test/forms/browser-host-reference-compile.test.js uses relative canonical
   ../../packages/browser/compiler.js, so it does not itself prove freshly
   staged browser delivery. test/expander/lexical-regions.test.js imports
   browser/compiler.js and lang/mod.js via aliases; project.json maps both to
   target/lykn/build, while M6 overrides lang to materialized and browser to
   fresh target/lykn/build/browser. Enumerate this actual mapped route (or
   equally explicit refreshed home), compileLykn→generated ESM, and retain
   existing browser run/load policy. packages/browser/compiler.js itself is
   read→expand→compile, not a separate ICU implementation.
5. Compiler.js changes are browser graph changes: measure fresh gzip80KiB and
   committed citations; no retained-size inference. Existing private-host,
   lazy-Reflect, completion/state and current native/public ICU tests remain
   relevant preservation controls alongside the new causal runtime population.

Reads: complete proposed recipe; immutable compiler ICU/concat helpers165–468,
all literal dispatch1314–1353, compileExpr1743–1855 and final compile body;
full host-invocation.js; lowerHostReferences1–86; public/barrel/browser APIs;
existing template-icu helpers and regression/effect/error tests, browser/host/
lazy-invocation/lexical test setups and immutable M6 comparison/config/test
population. Failed lookup attempts for guessed obsolete script/test paths were
corrected through actual file/caller queries; no test invocation occurred.

Root's native-only checkpoint remains separate; this unissued follow-through
prepares public parity without accepting broader source binding hygiene,
OwnerRef/CaseRef/typed owner/nominal/purity/check semantic join or LC02–08/S03.
Accepted A/B1/IC/B2-LX/B2-UNIT and recorded fragment/browser/DTS/S06/human limits
remain. Source/build ownership stays with Luna for native iteration16; no
candidate acceptance, source mutation, new helper/dependency or release action.

## Draft iteration17 follow-up — read-only,2026-11-13

Read complete UNISSUED cc-prompt-iteration17.md plus recipe source/test-home
refresh against immutable5554 public source/private APIs. **Conditionally
source-ready pending final native accepted pin and the one scope wording
reconciliation reported to root below.** Native focused green attestation is
not independent native acceptance; no native software disposition was made.
No build/tests/source/planning Git/index/ledger changes; Luna owns native
source/build throughout this follow-up.

Six proposed top-level groups are natural behavior populations: source capture;
selector/generated collision; once-only effects/errors; eager-vs-lazy branch
contract; fragment/state; actual browser plus private-API integration. Internal
fixture loops need no nested steps or no-op cases. Actual existing top-level
queries give5embedded-adt+6surface-type+17reserved+21lexical=49. Adding the six
real tests to M6's explicit public_tests makes the planned denominator55,
not a claim that55 tests already exist/pass. Preserve14 comparisons including
compiler.js; test count changes do not imply module population changes.

Mapped lang/mod.js/lang/compiler.js/lang/host-invocation.js use the SAME
materialized package/module identities under M6. browser/compiler.js maps to
fresh staged browser and imports lang aliases; no relative canonical fallback
is necessary. Draft's exact new test path plus macro_dependencies.rs list/count
change resolves the earlier delivery-home gap. Future execution must retain
real output/status and derived denominator, not just assert the string55.

The actual raw saved-call fixture is source-ready:

- `(saved receiver _n)` is exactly a list of3stable atom references and satisfies
  host-invocation-shared.js4–20 validateAnchor. Register THAT original reader
  node and compile the SAME forms (host-invocation.js21–45); no expansion,
  serialization/cloning or source marker forgery is involved.
- receiver.base10, argv array4 and ordinary function saved(value) using dynamic
  this give Reflect.apply(saved,receiver,[4])=14; pushing this.base records[10].
  The repeated ICU n slot requires one hoist/call, so14 14 plus[10] distinguishes
  callee receiver/argument preservation, one evaluation and actual _n capture.
  Old fixed hoist const _n captures the argv reference and fails before success.
- PROVISIONAL keys the produced CallExpression; scanning Identifier children
  read-only retains that identity. Finalizer68–98 collects it, changes pending
  callee and sees new ICU names. A module Reflect binding is explicitly found
  by hasModuleReflectBinding183–216 and selects inline apply import at98–109.
  Both normal/fallback runtime and absence of pending callee are meaningful;
  this raw private producer remains distinct from browser source compilation.

Fragment group honestly distinguishes returned compileExpr ESTree from executed
whole compile, and uses existing expandExpr contract rather than exporting a
new writer. Public lykn/compileLykn accept strict only (mod.js26 and browser/
compiler.js14); draft correctly adds no stripped API. Existing canonical/raw
parser, effect, private host, completion, browser policies and native/public
colon-triviality differences remain. Pure-value cross cases are coherent after
both repairs, but do not prove a new getter-evaluation equivalence.

One exact scope contradiction was sent to root: draft17 says execute recipe
'in full' but recipe's earlier test section still says extend existing
forms/template-icu.test.js, while draft17's exact5authorized paths instead
create icu-generated-names.test.js and omit the old file. The appended recipe
refresh names the new home but does not explicitly supersede the old directive.
Root should state new six-group file supersedes old expected test-home edits;
old template tests stay regression inputs unchanged. No product-design change
or alternate architecture is needed. Final accepted-native pin/readback remains
intentionally pending, and the final issued prompt must carry that pin.
