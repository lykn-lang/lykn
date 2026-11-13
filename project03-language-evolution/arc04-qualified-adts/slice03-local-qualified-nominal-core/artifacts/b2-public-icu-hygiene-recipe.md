# B2b2 follow-through — public ICU private-name hygiene (not issued)

Root design2026-11-13, inspected public product at5554a4d6. Native iteration16
is currently with Luna; no overlapping source/build ownership is authorized.
This is a concrete next public repair within the approved B2 binding work,
not an assignment until native handback, clean-pin refresh, new numbered prompt
and readiness. Same approved Luna6High implementation/Sol6.1High independent
review. No license/publish/release/remote/dependency action.

## Observed source and boundary

packages/lang/compiler.js197–201 has ambient _icuGensymCounter, reset by each
templateIcu. kwargs compileExpr returns actual ESTree at233–243. Hoist local
at268 is the fixed normalized slot name, and plural/select at339/400 consume
ambient freshIcuVar. Recursive emitMft calls312–439 have no owner/state argument.
This has the analogous source-capture mechanism to the independently retained
native failures. Public runtime observations are not yet claimed here.

Compiler compileExpr1747–1849 returns ordinary generated ESTree; source atoms
become actual emitted Identifier names, colon roots MemberExpression objects,
and private host invocation handling returns already compiled AST. Therefore
the public allocator should reserve actual Identifier names throughout the
compiled kwargs, rather than reconstruct normalization from source text. This
also sees nested-template generated identifiers. Conservatively reserving
property Identifier keys is safe. No AST node renaming, cloning, binding
reclassification, metadata mutation or argument recompilation is needed.

The public normal module compile and compileExpr return/writer APIs stay.
Single-literal no-slot template dispatch at1325–1339 needs an empty local
allocator to call the same MFT helper. Embedded counterpart is
crates/lykn-lang/embedded/packages/lang/compiler.js, byte-identical product
copy; cold materialization must actually deliver the repaired payload.

## Binding behavior and recommended shape

Create one private local allocator in templateIcu AFTER validating all compiled
kwargs and BEFORE creating any hoist. It owns occupied names, a suffix cursor,
and a selector-preference cursor starting0. A closure factory returning
allocate(preferred) and nextSelector() is recommended; equivalent small private
object is local discretion. No ambient mutable state or public export. JS
functions/closures guide ID08 SHOULD applies: each invocation owns independent
private mutable state, shared only by its recursive branch emitters.

Reserve actual ESTree Identifier.name with a read-only traversal of compiled
kwargs. Traverse structural AST arrays/children; skip Literal payloads and
do not treat strings, object metadata or property-name strings as variables.
Ordinary compiler-produced ESTree is acyclic; a visited WeakSet may cheaply
handle shared AST objects, but must not change output or be presented as new
support for arbitrary cyclic/malformed external input. No clone, serialization,
generic public walker or new package dependency.

allocate tries preferred unchanged when safe, then checked deterministic
suffix candidates of the form preferred__lyknGeneratedN, each tested/reserved.
The prefix is not an unforgeable namespace; reserve source names that already
look like suffix candidates. nextSelector allocates _v0,_v1 preferences through
the SAME occupied set as hoists. Check safe-integer cursor exhaustion rather
than silently reusing names; throw an ordinary compiler Error on exhaustion.
No deployed runtime code or generated helper is added.

Remove _icuGensymCounter and its reset. Thread the local allocator through
emitMft/emitPluralIife/emitSelectIife and every recursive branch. Do not reset
it for branches or split hoist/selector namespaces. Independent nested template
compilations own independent state; their generated AST is scanned as part of
outer kwargs before outer names are allocated. Native remains its separately
reviewed implementation; do not adjust its accepted code merely to match names.

Preserve original kwargs Map insertion order and compilation count. Preserve
exact IIFE/control/exception boundaries, existing eager repeated-nontrivial
kwargs, once-reference branch laziness and current no-collision names where
safe. No parameter-IIFE rewrite, argument sorting, new runtime or purity claims.
Public JS anti-pattern09 ID12 SHOULD-AVOID documents the exact TDZ self-capture
mechanism; existing compiler output requires IIFEs for value expressions despite
that guide's general ESM IIFE recommendation. This is codegen, not application
module organization. Ordinary some-name/someName and typed owners remain open.

## Meaningful test and integration obligations

Create product test/forms/icu-generated-names.test.js with the six natural
groups specified in draft17; retain existing template-icu.test.js unchanged.
The new file supplies actual runtime cases for repeated-slot _n (3 3),
plural _v0 (2), select _v0 (Owner), normalized
_n!, colon-root _n:value, occupied suffix candidate, two repeated slot keys
a-b/aB with distinct nontrivial values, hoist-vs-selector overlap and nested
same-selector/plural-select. Keep positive preferred-name/concat/parser cases.
Observe once-only side-effect count and exact repeated value, propagated
exception, and a once-referenced unselected branch that must not run. Repeated
compilation/failure/recovery tests compare relevant output/results without
asserting a new cross-backend byte convention. Existing native/public ICU
cross-equivalence tests may gain equivalent cases after both repairs exist.

Use generated ESM in ordinary product tests for canonical public
lykn()/compileExpr/expandExpr adapters and browser compileLykn result consumed
as ESM. Preserve current browser run/load policy. Direct reader→compile covers
kernel writer only; do not claim it proves source macro/default handling or
embedded delivery. Existing test helpers can be extended; no handwritten JS
research/orchestration/evidence helper and no Python execution.

Actual gates: focused public/kernel+cold/native cross ICU; fresh make check
with docs once; cold M6 currently14 module byte comparisons/49 public cases
plus new cases genuinely integrated, not asserted fixed counts. Fresh HEAD
citations and browser gzip80KiB must run because compiler.js is in the normal
browser graph. Product browser-size change must be measured, not inferred.
Retain current private-host/Reflect/completion/interleaved-state controls.
No unrelated whole-file formatting, snapshot autoaccept or generated count fix.

Authorized path expectation is superseded precisely by draft17:
packages/lang/compiler.js, exact embedded counterpart,
test/forms/icu-generated-names.test.js,
crates/lykn-lang/tests/icu_cross_compiler_tests.rs and
crates/lykn-cli/tests/macro_dependencies.rs. Existing template-icu.test.js
and browser-host tests stay unchanged. The new file owns the mapped public/
browser/private cases; M6 adds that file and its six real top-level groups.
No public API or source grammar change.

Before issue root still owes final accepted-native source pin, full affected
function/caller/readiness refresh and exact existing cold/browser test homes.
No implementation gate or public failure is preclaimed by this source design.

Separate Sol read-only readiness confirms no concrete allocator/AST
contradiction. requestedHostCall uses a real CallExpression + pending
Identifier; its WeakMap anchor survives read-only scanning. Later invocation
finalization scans the complete AST including new ICU locals and avoids them.
No AST replacement/reanchoring is warranted. The current M6 harness explicitly
selects four test files at macro_dependencies.rs1124–1161; it does not run ICU
or browser-host files. A new mapped-import ICU product file should be added to
that list, with exact derived denominator updated from49 only after the actual
new top-level tests are counted. New tests must import lang/ and browser/
aliases, as lexical-regions.test.js does, so cold tests use actual materialized
lang and staged browser packages. Relative canonical imports bypass that proof.

Root refreshed actual public interfaces: lykn(source,{strict}) and
compileLykn(source,{strict}) expose no stripped option. Do not invent one;
native checked/stripped remains its native gate. Public whole source,
expandExpr/compileExpr and browser-compiled ESM are distinct real routes.
