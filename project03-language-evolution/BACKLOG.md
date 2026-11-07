# docs/design-v0.7.0 — Candidate Backlog (consolidated register)

> **The single watched place for everything we want to work on in 0.7.0+.**
> This is a *candidate register*, not a `project-plan.md` — the 0.7.0 project
> definition is still deliberately deferred (*plan late, plan deep*; see
> `README.md`). Its job is the one the operator named: **don't lose track.**
> Every row has a **source** and a **re-entry condition**; nothing here is
> silently dropped. Dispositions marked *(operator decides)* are the release
> boundaries — 0.7.0 vs 0.8.0+ — that are Duncan's call at 0.7.0 planning.
>
> **Consolidated 2026-07-22** from four scattered sources: the 0.6.0
> `project-plan.md` §1 "Post-0.6.0 tracked candidates"; the two research units
> already in this tree; the arc14 seed in the 0.6.0 tree; and CDC memory-only
> items. Two net-new items (full i18n, build-tooling) were added from the
> operator's 2026-07-22 direction.

## How this list stays honest

- **Source** — where the item came from, so it can be traced back.
- **Re-entry** — the condition that makes the item actionable (what has to be
  true, or what touches it next).
- **Disposition** — provisional release target. *(operator decides)* means the
  0.7.0-vs-later boundary is unset and is Duncan's at planning time.
- When **arc06 slice02** (the mycelium re-audit, host-run by CC now) closes, its
  routing table will add any new *post-0.6.0* rows here — this register is the
  named home for them (anti-silent-drop, per the arc11 buried-intent discipline).

---

## A. Big-rock candidate arcs (each likely a multi-slice arc, some version-spanning)

### A1 · Language build tooling — batteries-included *(NEW 2026-07-22; first part → 0.7.0)*

**Capability.** `lykn` is the *only* tool a lykn project needs — no separate
build tool. The bar is the best build tooling the operator has used: Clojure's
**lein**, Erlang/LFE's **rebar3**, and Rust's **cargo + rustup**.

**Method (the operator's brief).** A full feature-set survey of all four
tools → assemble the **superset** of their capabilities → for each superset
feature, identify (a) anything **lein / rebar3** have that **cargo** lacks, and
(b) whether lykn should **implement** it natively or **wrap** an existing tool.
Cargo is the primary model; the point of surveying lein/rebar3 is to catch what
cargo *doesn't* cover. From the superset + implement/wrap calls, stand up a
**version-spanning `build-tool` project** and split it across releases (what
lands in 0.7.0, what pushes to 0.8.0, …).

**Re-entry.** Open a step-1 research unit **`03-build-tooling-survey/`** in this
tree (mirrors `01-treeshake-audit` / `02-packaging-strategy`): the survey +
superset + implement-vs-wrap matrix is its deliverable, and it feeds the
version-spanning project definition. **This register captures the intent; the
survey unit is the next thing to scope** (CDC can draft its slice-doc +
cc-prompt on request).

**Disposition.** First part **0.7.0** (operator); the full build-tool project
spans 0.7.0 → 0.8.0+ *(operator decides the split, informed by the survey)*.

**Adjacency.** `02-packaging-strategy` (distribution) and `01-treeshake-audit`
(build output) are downstream of a batteries-included build tool; `lykn add`
(arc06, 0.6.0) is its first dependency-management primitive.

#### A1.1 · Dependency version management — Mix/rebar3-style `~>` *(research + decision, 2026-07-22)*

**Origin.** The DD-63 (`lykn add`) version-pinning question. Operator prefers the
Elixir/Mix–Hex `~>` version scheme that rebar3 adopted (most of the LFE
community moved to it); wanted to know if Rust gives it "for free."

**Decision — the split (operator-approved 2026-07-22):**
- **0.6.0 / DD-63 (`lykn add`):** resolve the package and **pin an exact
  version** in the specifier (`jsr:@lykn/lang@0.6.0`). That alone closes the
  unpinned-scaffold hole (the scaffold writes `jsr:@lykn/lang/` — no version).
  Minimal, correct, unblocks downstream. Use the npm-semver engine (below) so
  it is already npm-correct.
- **0.7.0 / build-tool arc:** the **`~>` requirement DSL + `lykn update` +
  lykn-owned version management** — the deep tooling work. This is where the
  Mix/rebar3 ergonomics land, informed by the survey.

**Why the deep work belongs here (the constraint that shapes it).** lykn deps
are `jsr:`/`npm:` specifiers **resolved by Deno**, and Deno's version semantics
are **npm's, not cargo's**. Consequences:
- *"Cargo directly" is out* — cargo only resolves crates.io via its own
  resolver; it cannot touch JSR/npm.
- *Cargo's `semver` crate is the **wrong** free lunch* — excellent, but cargo's
  range/pre-release semantics differ subtly from npm's; lykn computing "latest
  matching" with cargo semantics could disagree with what Deno resolves at build
  time. The correct free engine is an **npm-semantics Rust crate**:
  [`nodejs-semver`](https://crates.io/crates/nodejs-semver) (node-semver
  compliant) or [`node-semver`](https://docs.rs/node-semver). Those give the
  edge-case-heavy engine — parse, precedence, pre-release ordering, "does X
  satisfy R", "latest of {published} satisfying R" — matching Deno's world.
- *Deno's **specifier** range support is partial/evolving*
  ([denoland/deno#28852](https://github.com/denoland/deno/issues/28852)): `>=`,
  multi-major spans, and `||` are rejected in specifiers today (caret-within-a-
  major works — mycelium's `npm:astring@^1.9.0` resolves). This pushes toward
  **resolve-the-requirement-and-store-exact** (Deno always accepts an exact
  version) rather than storing a live range Deno might reject.

**What's free vs. what lykn builds:**
- **Free (npm-semver Rust crate):** the whole comparison/satisfaction engine —
  the "excellent code + wide tests" part. Adopt, don't write.
- **Custom (small, but the wide-tests piece):** the `~>` → range translation.
  Hex/Mix rules ([Elixir `Version`](https://hexdocs.pm/elixir/Version.html)):
  `~> 2.1.3` = `>= 2.1.3 and < 2.2.0` (patch only); `~> 2.1` = `>= 2.1.0 and
  < 3.0.0` (minor+patch) — the dot-part count sets the ceiling. No mainstream
  Rust crate implements Hex ranges, so this thin layer is lykn-owned and is
  exactly where the edge-case test suite goes.

**Architecture (target).** Mix `~>` as the `lykn add`/manifest surface →
translate to a resolved **exact** version for the Deno-facing specifier + lock →
`lykn update` re-resolves against the recorded `~>` requirement. lykn **owns the
version story** (the rebar3 model — the build tool owns dependency version
management rather than deferring to the runtime resolver), which is coherent
with DD-51 (lykn owns the workflow; projects don't reach around to Deno) and
immune to Deno's range-support gaps (you always hand Deno an exact version).

**Feeds:** DD-63 (0.6.0 pin-exact decision recorded); the `03-build-tooling-
survey` unit (dependency version management is a first-class survey axis —
compare lein/rebar3-Hex/cargo/npm version schemes); the build-tool arc's own
version-management slice. Engine pick (`nodejs-semver`) is a survey validation
item, not yet locked.

### A2 · Full i18n / Unicode source support *(NEW 2026-07-22)*

**Capability.** First-class non-ASCII in lykn — Chinese, Cyrillic, and beyond:
Unicode **identifiers** (reader + the codegen name-mangler, which today assumes
ASCII → JS-identifier rules), string/format handling, and whatever the surface
and both backends need to treat non-ASCII source as a first-class citizen.

**Source / first step.** The 0.6.0 `template` → ICU MessageFormat work
(**arc08 / DD-55**) was step one — MessageFormat i18n in the `template` macro.
"Full i18n" is the broader effort that step pointed at.

**Re-entry.** Wants a design/research unit to scope the surface: which Unicode
identifier rules (e.g. UAX-31), how the `codegen/names.rs` mangler maps
non-ASCII → valid JS identifiers, reader lexing, and test corpus. Not yet
scoped.

**Disposition.** *(operator decides)* — candidate for 0.7.0.

### A3 · Comment retention & provenance — **arc14 / DD-62** *(release boundary 0.7.0, operator-decided 2026-07-21)*

**Capability.** The compiler retains comments through the pipeline instead of
dropping them at the reader. Three DD-62 commitments: (1) opt-in reader
retention on both backends; (2) surface→kernel **provenance** tagging
(surface-authored comments flagged as possibly-stale beside transformed code);
(3) strip-or-preserve **only** at JS emission (default strip; opt-in preserve
with provenance annotation). Flagship payoff: honest, readable JS. Immediate
payoff: **inline `lykn lint` suppression** (arc05's deferred mechanism).

**Source.** arc05/slice04 deferred the lint-suppression mechanism here; seeded
as arc14 in the 0.6.0 tree; release boundary 0.7.0.

**Re-entry.** Already seeded (`project02-language-toolchain-alignment/arc14-comment-retention/`,
`design/dd-62-comment-retention-DRAFT.md`). Activate + slice-plan when 0.7.0
opens; the open DD-62 §5 question (comment attach model) resolves first.
Consumes arc13's node-metadata pattern.

**Disposition.** **0.7.0** (decided). *When 0.7.0 planning starts, arc14's home
should migrate from the 0.6.0 tree into this one.*

### A4 · Tree-shakeable compiled output — **`01-treeshake-audit`** (research open)

**Capability (candidate).** App bundling / tree-shaken output — making
compiled lykn dead-code-eliminate cleanly under esbuild/rollup.

**Source / status.** Step-1 research unit already in this tree: diagnostic
audit of tree-shakeability across both emission paths (Rust codegen vs
`bridge.rs` → JS compiler), fixtures, an esbuild experiment, and dist metadata.
Memory flags `sideEffects` absent from `dist.rs`. **Open.**

**2026-11-05 current direction.** The operator approved `lang/lib/`, opt-in
`@lykn/*` JSR packages, selective entrypoints, zero standard-library payload
when unused, safe application tree shaking and preserved public package APIs.
[Slice04](slice04-library-baseline-refresh/slice-plan.md) independently closed
the bounded compiler/Deno/policy refresh and proposed audit method; its findings
are static evidence and a protocol, not executed tree-shake proof. All original Slice01
F-1–F-12 criteria remain open; old npm tooling is not approved for execution.

**Re-entry.** Slice04 independent closure and explicit resolution of any changed
evidence contract precede a new Slice01 assignment. The eventual complete audit
report defines the implementation candidate arc's scope.
**Disposition.** *(operator decides)* — informed by the audit.

#### Native pilot compiler follow-up NE-C01

**Original observation, 2026-11-05; task-branch repair accepted below.** [Slice06 independent review](slice06-native-esbuild-controls/cdc-verification.md#final-independent-review--2026-11-05)
delivered a pinned native esbuild 0.25.5 without Node/npm and reproduced the
C4 code/metafile attribution gate. It stopped at the first C5 source runtime:
1/5 bundles completed, 1/11 runtime attempts failed before evaluation, four
bundles and ten runtime invocations unrun. All original F rows remain open.

**NE-C01 — documented equality in :pre emits invalid JavaScript.** At pinned
74a90d5, the tiny research YAML stub's `(= text "answer: 42")` precondition
is accepted by default native compile but emits `if (!text = "answer: 42")`.
Deno 2.9.6 rejects that module before evaluation. Pinned guide Equality/DD-22
defines `=` as strict equality; Functions documents :pre. Exact
[source](slice06-native-esbuild-controls/artifacts/evidence/runtime/run-10/yaml-value.lykn),
[generated JS](slice06-native-esbuild-controls/artifacts/evidence/runtime/run-10/yaml-value.js)
and [independent failed runtime](slice06-native-esbuild-controls/artifacts/evidence/cdc-review/C5-source-before.json)
are preserved. This specific contract mismatch is reproduced; cause and wider
impact are not established. No compiler fix or source escape was attempted.

2026-11-05 re-entry: Operator approved repair and the same five controls, later
confirmed “keep going”. [Slice07](slice07-contract-predicate-lowering/slice-plan.md)
now owns the bounded shared native predicate-lowering repair on dedicated task
branch9be0c301 (code baseline74a), its strict regressions/native gates, independent
acceptance and frozen pilot re-run. No result/closure is inferred at opening;
the original stop and counts above remain unchanged. Cleanup's GC-D01 guide
finding has a separate Project07 roadmap owner and is not repaired here.

**Original owner/re-entry contract (preserved).** CDC prepares a separate bounded compiler diagnosis/repair
assignment after Operator authorization; future CC implements it and an
independent reviewer verifies the actual fix and relevant regressions. Then
authorize a fresh complete five-control/eleven-invocation attempt with pinned
identities revalidated and predictions retained/amended explicitly before runs.
Do not drop :pre, substitute kernel equality, strip assertions or reorder the
remaining controls to manufacture success. NE-04/05/06 stay deferred until their
full original oracles pass. Release priority remains the Operator's decision.

Related observer diagnostic/emission witnesses (catch sentinel accepted by
compile/check, strict-reserved binding, await in a synchronous IIFE) remain in
Slice06's source history, raw launch failures and retrospective. Any future
investigation must classify invalid authoring separately from compiler contract
violations; these observations do not authorize a broad compiler rewrite.

**2026-11-05 current disposition.** NE-C01 is independently repaired on dedicated
`codex/contract-predicate-lowering@86d116db5c096d0fff7ec555d388343946114e4d`;
[Slice07 review](slice07-contract-predicate-lowering/cdc-verification.md) records
17/17 strict runtime regressions and independent full repository gates. No
release integration/propagation occurred. The frozen pilot re-entry reached
C5 child exit0 but stopped at a distinct observer template oracle mismatch,
owned by NE-C03 below. Its four bundles/ten calls remain unrun. Neither this
repair nor its C4 gate closes original F rows or historical NE-04/05/06.

**2026-11-06 integration.** Operator authorized the local release/0.6.x merge;
it is complete at `b841f71b30eb2c3e340a651ae1d57de04fec3d79` with actual
unfiltered release `make check` passing. [Receipt](slice07-contract-predicate-lowering/artifacts/release-integration.md).
Other release propagation, push/publication remain unapproved. NE-C03 still
owns the separately stopped oracle/template boundary, with no changed pilot
counts or implied acceptance of its deferred rows.

#### NE-C02 — accepted branch-local binding emits invalid statement JavaScript

**Open observation, 2026-11-05; no repair authorized here.** During Slice07's
test authoring, default strict native compile accepted the existing witness
`(if true (bind following-statement 99))`, then emitted
`if (true) const followingStatement = 99;`. Deno rejected it with
`SyntaxError: Expression expected`. Exact source is test commit
`d936c18bf9cf5b2e21c6e548eb1a157d7cfde040`, integration test line70 on
`codex/contract-predicate-lowering`; actual emitted line64 is retained in task
`target/slice07/native-red-corrected-baseline.log` and the
[Slice07 results](slice07-contract-predicate-lowering/artifacts/results.md#phase-a-cc-return).
This confounded context witness was replaced with a supported bind-then-if;
it is not NE-C01 red evidence or proof that the original authoring is promised
by the language. The accepted source/emission/diagnostic boundary needs a
separate validity/expected-behavior decision before any compiler or guide fix.
Full original generated module was not retained; the actual failing line,
runtime result and committed Lykn source are retained.

**Owner/re-entry.** Project03 CDC scopes that decision against conditional/
binding documentation and native emission, retaining this source/output witness.
No extra executed probe or unrelated correction was added to Slice07. Its
repair/control endpoint remains unchanged; this row stays open.

#### NE-C03 — surface-string/template expected-output boundary

**Open candidate, 2026-11-05.** After accepted NE-C01 repair, the unchanged
five-control pilot stopped at its first C5-source-before oracle. CC and CDC
independently reproduced child exit0/empty stderr/all expected values, followed
by outer assertion exit1. The frozen observer's `template` segments at source
driver624–629 contain escaped inner quotes; generated driver362–364 puts them
into a JS template literal whose runtime escapes differ from the intended
serialized-JSON bytes. Exact independent
[Lykn source](slice07-contract-predicate-lowering/artifacts/evidence/cdc-stop/source/driver.lykn),
[generated JS](slice07-contract-predicate-lowering/artifacts/evidence/cdc-stop/source/driver.js),
[actual child output](slice07-contract-predicate-lowering/artifacts/evidence/cdc-stop/out/C5-source-before.json)
and [review](slice07-contract-predicate-lowering/cdc-verification.md#phase-b--independently-reproduced-bounded-stop-2026-11-05)
are in Git. No extra probe/repair or observer correction was made. The retained
prior run10 generated observer byte-compares identical to the newly compiled
observer, supporting a latent boundary issue rather than an NE-C01 regression.

**Owner/re-entry.** Project03 CDC scopes a surface-guide/reader/template-emission
contract diagnosis before any correction. Current codegen emit.rs178–194 and
1267–1286 intentionally passes template backslashes through; existing kernel
tests2276–2304 protect that behavior. Do not infer a blanket escaping fix or
erase those tests. Source validity, decoded string intent and kernel input
semantics require separate disposition. A new accepted source/compiler or
explicit observer-condition change must retain predictions and reopen the same
five controls/eleven calls from the beginning. CP-04/05 stay deferred; old
Slice06 failed condition, all original F rows and Project07 gates remain intact.
No next slice, implementation or release action is opened by this routing.

**2026-11-06 authorized re-entry.** Operator explicitly asked to move on to
NE-C03 after the accepted local release/0.6.x merge. Existing canonical
[Slice08](slice08-template-string-boundary/slice-plan.md) now owns that bounded
diagnosis/conditional repair/frozen-pilot increment. Initial assignment is
source-contract diagnosis with finite native value/countercontrols and existing
kernel cases; no production patch or observer change before independent
disposition. Normative core guide ID-33 (MUST cooked strings) is inspected
alongside historical C6b/D2 passthrough expectations, not silently subordinated
to them. Genuine language choice still returns to Operator. All older partial
counts and obligations remain intact; NE-C02 is not included.

**2026-11-06 independent disposition: repaired, bounded re-entry complete.**
Slice08 reconciles normative ID-33 with historical passthrough expectations.
Accepted task source `a061c2149792178ba037d17a31220545e34b4ac1` encodes decoded
values for template source in native and public JS/mirror paths. Native/JS22
runtime values and the full repository gate pass independently. The unchanged
five-control/eleven-call pilot now passes completely in CC and CDC replications;
exact code/metafile/public-API evidence is in [final review](slice08-template-string-boundary/cdc-verification.md#frozen-pilot-accepted--2026-11-06).
No frozen observer/source/data was changed. Earlier Slice06/07 failed conditions
and deferred rows are retained, not relabelled successful. The template fix
remains on `codex/template-string-boundary`; only the earlier predicate repair
is integrated at release/0.6.x b841f71b. No further merge/push/publication is
implied. NE-C02/NE-C04/NE-D01 and all full-audit/Project07 obligations remain open.

**2026-11-06 local release integration accepted.** Following separate explicit
Operator approval, [Slice10](slice10-template-release-integration/cdc-verification.md)
independently verifies merge f70565566088f5d55129edda6bd73a4691e5a58d into
release/0.6.x: exact accepted 13-path repair/tree, full release Make, focused
native values, committed citations and fresh embedded-byte materialization.
Earlier task-only integration statements above remain their dated history.
No other release propagation, push/publication or subsequent unit is implied;
all listed separate candidates and audit/Project07 obligations remain open.

#### NE-C04 — same-version embedded package cache may retain prior compiler text

**Source-backed packaging candidate, 2026-11-06.** During Slice08 preparation,
`expander/embedded.rs::materialize_packages` at b841f71b was inspected: its warm
hit checks CARGO_PKG_VERSION sentinel plus directory existence, not embedded
content. A changed same-version binary can therefore reuse prior package text.
No new warm-cache experiment or global-cache mutation was performed. The JS
compiler has a compile-time mirror under crates/lykn-lang/embedded/packages/lang;
Slice08 must sync it and verify normal macro materialization in a fresh owned
XDG cache while retaining the accepted existing Deno dependency cache.

**Owner/re-entry.** Existing Project03 A5 packaging candidate owns cache identity/
invalidation disposition before a same-version deployment claim. This is separate
from decoded template-value correction, not permission for a cache rewrite or
version bump in Slice08. Its proof uses a fresh cache and explicitly does not
claim existing warm global caches are migrated. [Current review](slice08-template-string-boundary/cdc-verification.md).

#### NE-C05 — explicit final return with a typed result emits invalid initializer

**Open source-backed candidate, 2026-11-06.** Slice09's actual accepted-tool
helper compile exited0 but a properly closed `func` with `:returns :boolean`
and explicit final return emitted `const result__gensym1 = return ...`.
The paired full-source/output hashes and exact emitted line are retained in
[the witness](slice09-lykn-research-helpers/artifacts/evidence/return-lowering-witness.md).
Evidence is CC accepted-tool observation plus CDC inspection of the exact pair;
no reduced repro or runtime was added. This is separate from the disproved
stale-global-compiler statement-context claim. The delivered helper uses its
normal implicit final value and passes independently, so migration is complete.

**Owner/re-entry.** Project03 CDC owns focused semantic/source triage and a
meaningful typed explicit-return regression on the accepted native pipeline,
including the applicable guide contract, before a repair is scoped. Preserve
the local full snapshots before any future scratch/worktree disposal. No
compiler patch, general return-form correctness claim or integration follows.

#### NE-C06 — native diagnostic fidelity candidates

**Open diagnostic follow-up, 2026-11-06.** Slice09's accepted compiler reports
unused bindings that are used in the actual output. The smallest retained
observation is child `mode`: [source](slice09-lykn-research-helpers/artifacts/tooling/child-fixture.lykn)
uses it for dispatch, [compile stderr](slice09-lykn-research-helpers/artifacts/evidence/cdc-review/child-fixture.compile.stderr)
warns unused, and the independent R0/R1 paths exhibit distinct successful/raw-
failure behavior. Other helper member-reference/function warnings are retained
in the same review evidence; lint reports zero findings. No warning was hidden.

There is also a static-only nested-diagnostic concern: native
`emitter/forms.rs::emit_expr` retains the raw expression after a nested
classifier error. The observed quoted-string `dissoc` call violated its
keyword-only contract, and its then-generated output used the wrong global
compiler; it is NOT accepted-runtime proof of this concern. Keep the source
fact/limitation distinct from the independently observed warning mismatch.

**Owner/re-entry.** Project03 CDC owns future diagnostic triage with the actual
compiler identity and relevant classifier/analyzer paths. Separate the warning
and error-propagation questions when scoping tests; no suppression, broad
diagnostic rewrite or implementation is opened by this register entry.

#### NE-C07 — native check rejects documented async named exports

**Independently reproduced validation gap, 2026-11-06.** Slice12's frozen
parser-core6c4faee uses preferred `(exports load-parser verify-parser)` with
module-level `(async (func ...))`, the exact composition taught by current
source SKILL Modules/Async and guide00 Modules. Pinned release/0.6.x f705655
compiler SHA57a49f55 rejects both names as unknown top-level bindings at1:10
and1:22. CC and CDC repeated the same source check from separate config-free
cwd; [exact source](slice12-offline-walker-capability/artifacts/tooling/parser-core.lykn),
[independent raw diagnostic](slice12-offline-walker-capability/artifacts/evidence/cdc/check.stderr)
and [review](slice12-offline-walker-capability/cdc-verification.md) are retained.
This is check/validation evidence, not a compile/codegen or parser-runtime result.

Source classifier/forms.rs184–209 collects top-level names via a nonrecursive
binding walker and unwraps only outer export; binding.rs181–218 has no async
wrapper branch. This explains the observed mismatch with documented async
function exports without adding a new program or asserting untested emitters.
Original delimiter authoring failures and CDC's separate incorrect export
instruction/retraction remain history, distinct from this valid-source gap.

**Owner/re-entry.** Project03 CDC owns a separately authorized, narrowly scoped
validation/compiler disposition with meaningful documented async-export native
check/compile regression and relevant wrapper/binding consumers considered.
Do not switch to older kernel exports, bind wrappers, single-file rewrites or
skipped gates merely to bypass it. After an accepted disposition/repair and new
source/compiler pin, resume Slice12's same four parser observations before
walker investment; all four and K01–K12 remain unrun. No repair, source
integration, acquisition, full audit or next unit is opened by this record.

**2026-11-06 Slice13 attempted repair, stopped.** The explicitly authorized
repair/re-entry unit established meaningful red tests, then independently
confirmed a different compile-with-output validation gap, NE-C08 below.
NE-C07 remains unfixed/unaccepted. Dedicated task codex/async-export-binding
at2bf7a10929dc870acbd37709d5851cfd109f0082 retains red tests; the 14-line
production candidate is [saved, unvalidated](slice13-async-export-repair/artifacts/unvalidated-candidate/provenance.md)
and its live uncommitted edit was restored. No post-patch gates or parser
observations occurred. Future accepted NE-C08 disposition precedes resumed
NE-C07 independent validation and the unchanged four observations.

**2026-11-06 accepted task repair, Slice14.** At
3b65d09a1a8997f8c9680a34f43fd2c2e0aa8c4e, the private top-level export collector
recognizes exact async named func/genfunc wrappers, retaining nonrecursive global
binding discovery and scope guards. Independent8unit/2CLI tests prove actual
check/strict stdout/-o/import-await42 behavior; complete normal-env Make and
citations pass. [Review](slice14-compile-validation-and-parser/cdc-verification.md#stage-b-ne-c07--accepted-2026-11-06).
The exact old parser sources now pass check, but re-entry stops at unrelated
NE-C09 below. NE-C07 is accepted on the task branch only; release f705655 and
historical Slice12/13 statuses remain unchanged. Parser still0/4.

#### NE-C08 — compile-with-output omits reserved-binding validation

**Independently confirmed, 2026-11-06.** Slice13's intermediate negative
regression at bdad42216c235a18d51609474f32f6ae9ce84a95 observed unexpected
success for `(func default :args () :body 42)` then `(exports default)` through
`compile -o`. The failing test dropped its original temporary output, which
was not recovered. CDC separately froze the SAME source/command prediction at
planning2d677c43b3f61e64e969a3c266c93a5f4fa5fc99, then reproduced exit0 with
absolute release compiler57a49f55/sourcef705655 from a config-free cwd. Full
[command](slice13-async-export-repair/artifacts/evidence/cdc-output-route/command.txt),
[raw JS](slice13-async-export-repair/artifacts/evidence/cdc-output-route/result.js)
and [independent review](slice13-async-export-repair/cdc-verification.md) are retained.
Output uses literal `function default()` and `export {default}`, with no escaping.

Guide09 lines829–841 at f705655 requires compile-time JS reserved-binding
rejection. The stdout compiler invokes `validate_reserved_names` in
crates/lykn-cli/src/compile.rs201–213; `compile_source_with_dts` at311+ does not.
The actual result contradicts the existing contract; narrowing a test to
stdout is not disposition of this route. No extra variant matrix or syntax
runtime was needed to establish the bounded gap.

**Owner/re-entry.** Project03 CDC owns a separately authorized narrow
output-route validation parity/shared-frontend disposition: compare existing
validator sequences and relevant route contracts before proposing repair,
rather than blacklist only `default`. Preserve the original failed test and
fresh receipt as distinct evidence. After accepted disposition, resume NE-C07
with retained red tests/candidate and new source/compiler pins, then only the
same four parser observations. NE-C07 remains unaccepted, parser0/4; no current
compiler fix, release integration, new unit or full audit is opened here.

**2026-11-06 accepted task repair, Slice14.** Source4610b4ce37d41dd11a591f88b4e67e15b84f96b1
extracts stdout's reserved/method/nested-fn/no-else-if/exports validator sequence
and shares it with compile-with-DTS, preserving order/diagnostics and successful
JS/DTS/warnings. Independent40API/3CLI tests plus later complete normal-env Make
on combined3b65d09 pass; check_strict's subset is unchanged. [Review](slice14-compile-validation-and-parser/cdc-verification.md#stage-a-ne-c08--accepted-narrowly-2026-11-06).
This is not a default-only blacklist or skipped DTS. No release integration;
earlier exact success/invalid-output receipts and lost-temp-output limit remain.

#### NE-C09 — async expression IIFE loses context and branch value flow

**Independently confirmed blocking syntax, 2026-11-06.** Slice14's canonical-
format-only complete core is frozen at13fd27feed2c3e6b4c0de37835f9edab602cee47,
[source](slice14-compile-validation-and-parser/artifacts/stage-c/tooling/parser-core.lykn),
SHA6ca1afe83d6d9a47f7eb1fea7f0aa3872ae626cc4f39d5b3ed017aab38308bf7.
Native compiler748cd999/source3b65d09 accepts check/strict compile0 but emits
`return (() => {... const parser = await import(parserUrl); ...})()` inside
async loadParser. CDC independently compiles the SAME complete source from a
new config-free cwd and obtains byte-identical generated JS SHA
3e5b22d1d959b68e244c1ea3cf11ad6aaec29a8b81a5e6e6c7faa166ef44fefb.
[Full raw module](slice14-compile-validation-and-parser/artifacts/cdc-stage-c/parser-core.js),
[commands/limits](slice14-compile-validation-and-parser/artifacts/cdc-stage-c/commands.txt).

Pinned Deno check returns0/empty output; it does **not** establish JS syntax
validity. A pinned offline no-permission module-load attempt of that SAME core,
without inputs or calling an entry function, exits1 with actual SyntaxError at
26:24 `await import` before module evaluation. No Acorn import/AST/control ran:
parser0/4. Guide00 do final-value/expression-IIFE and if-expression equivalence,
plus async/await MUST rules, establish the supported composition. The guide's
strong LLM preference for `?` is a style issue, not permission to emit invalid
JS for supported `if` or to rewrite around this stop.

**Static limits and relationship.** The inner version-mismatch/ready objects
also lack returned value flow; that is generated-source inspection, not tested
runtime behavior. CC retained malformed nested-if observer output as another
unexecuted static witness. NE-C02 instead concerns a statement-position bind;
they share a position-sensitive emission concern, not an established root cause.
Do not merge findings or infer all branch behavior was evaluated.

**Owner/re-entry.** Project03 CDC owns separately authorized source-guided
async-aware expression-IIFE syntax **and correct branch-value propagation**
disposition, preserving the full witness and later meaningful runtime controls.
Do not mark all IIFEs async or change the helpers as an unreviewed workaround.
After independently accepted disposition/new compiler pin, resume the same four
parser observations with genuine JS module-validity proof; DenoCheck0 alone is
insufficient. Original helpers/data/oracles and all failed conditions remain.
No current repair, new unit, source integration or full audit follows.

**Slice15 pending decision,2026-11-06.** Authorized candidate802bb22/product54608a7
resolves the SAME core module-parse witness and passes finite native/public5,
but is **not accepted**: full Make exposes a regression in the unchanged
`test_emit_bind_group_in_function_body_stays_sibling_scoped` (forms.rs3375),
independently reproduced exit101/block instead of sibling const. New
emit_function_body bypasses old Statement-body multi-form expansion. This belongs
to the current NE-C09 candidate, not a separate unrelated compiler finding.
[Pending review/proposed bounded correction](slice15-async-expression-values/cdc-verification.md).
Five correction passes are exhausted; Operator re-scope/override decision is
required before another correction. Parser0/4, no sixth pass or integration;
accepted3b65d09 and releasef705655 remain untouched.

**Authorized correction6 return:** final3f8f6df fixes grouped-bind statement
expansion, but is still unaccepted after two newly failing existing DD50 switch-
case tests. Full normal Make1466passed/2failed; CDC repeats both exact failures.
Source-guided mechanism is the new generic forced-Value recursion treating a
structural case list as a computed call, despite switch Statement-body roles.
[Current pending verdict/proposal](slice15-async-expression-values/cdc-verification.md)
owns a bounded role-aware switch-clause correction for further Operator decision.
The one extra cycle is spent; no seventh pass, source acceptance or parser run.

**Subsequent explicit override7 / source acceptance:** Operator authorized one
further switch-role correction; source5408abd432b8789ae474a3895436f68818c4e482 is
now independently accepted task-only, including normal full Make0/all Rust,
JS1468(11steps), docs482/citations63+601. Exact grouped/switch regressions pass;
same complete core genuinely loads and finite value/Promise/effect controls pass.
Actual release compiler SHA b0a5649791ec6dfdd774619cc7c01c4c6c4f1138a5db7e368916416a9600b873.
No release integration or universal compiler-correctness claim. Original same-four
parser continuation begins only after this acceptance;0/4 at handoff, no walker.

**Slice15 final disposition,2026-11-07:** NE-C09 repair is independently accepted
on task5408 only. Original three helper bodies/data/oracles stay unchanged and
pass independent native/generated/real-module gates. Original four observations
K11,K01,K08,K09 each pass in separate CC and CDC runs (4/4 in each, no errors/unrun).
Exact cached unmodified npm-distributed Acorn8.17.0/hash1cbcbf is verified before
import and unchanged after use. First observer launch's omitted own-input reads
caused a preserved outer setup failure after K11; original-authority exact three
input-read restoration precedes the successful fresh conditions. It is not an
extra source correction or retroactive first-run success. [Final review](slice15-async-expression-values/cdc-verification.md)
and [raw independent witnesses](slice15-async-expression-values/artifacts/parser-reentry/cdc/replay.md).
No release propagation, universal async/compiler proof, walker/full corpus or
F-1–F-12 completion follows. NE-C02/04/05/NE-T01 and Project07 gates remain separate.

**Subsequent explicit local integration,2026-11-07:** Slice16 independently
accepts the complete NE-C07/NE-C08/NE-C09 stack on release/0.6.x at
5408abd432b8789ae474a3895436f68818c4e482, tree39bc56b73897e568ff81ce60a2feef28a2310ea8.
Normal ff-only fromf705 preserves24commits/exact16paths. Fresh independent full
Make, six native regressions and citations pass; release/bin85d6d3 and actual
fresh embedded mirror1c1e7e8 verified. [Integration review](slice16-compiler-stack-release-integration/cdc-verification.md).
This supersedes the earlier task-only integration state for these three repairs,
not their historical observations/limits. Other releases/main remain untouched;
no push/publication/type/cache repair/walker/corpus or next unit follows.

#### NE-C10 — match clause statements rejected by no-else validation

**2026-11-07 current accepted task disposition:** Slice19 independently accepts
combined NE-C10/NE-C11 source at8ed869f after freshfullnormalMake/focused1+5/
citations and SAME740 realJSON+DTS proof. Fn/lambda yields-header concern is now
actually counter-tested/repaired; genfn positive preserved. Taskrelease/bin aa31947…
is selected compiler; release5408 remains unchanged. Old Slice18 unaccepted state
and limits remain historical. Original tool completion/same13 stillowed/unrun.

**2026-11-07 Slice18 stop:** candidate4304eb280a4198eb75355956b166923883ceecbe is
unaccepted/task-only. CC's three metadata counters green/CLI validation+DTS partial
passes do not replace full source gates. NE-C11 below stops actual positive runtime
before evaluation; no fullMake/citations/old walker re-entry/K. Additional SOURCE-
ONLY untested candidate concern: walk_fn_like_args recognizes :yields metadata for
fn/lambda, but classify_fn/lambda retain args1 onward as body and only classify_genfn
owns that header. It could skip ordinary fn body validation. Disposition/negative
regression before candidate acceptance is owned by Project03 CDC; no probe or fix
after the stop. Outer2spent/oldtooling3spent+2remaining carried, no reset/next unit.

**2026-11-07 authorized active re-entry:** Operator explicitly approved narrow
repair, independent full source validation, then completing partial tooling and
unchanged13-row gate, stopping at another real gap. Canonical Slice18 now owns
this work; source remains unaccepted until new independent gates. Existing raw
evidence/old deferred statuses and two remaining tooling corrections stay intact.

**Independently reproduced blocker,2026-11-07.** Slice17 exact walker source at
planningbd3e4c730a60184e13a2426ffd61318f1c5b9770, SHA
6976a853a9fea81bcf47e47d634fa5bcd568e9f3b72e6f36c4f58be2bd48d1c6,
fails native check on absolute release/0.6.x5408 CLI85d6d3d5. CC native-0007 and
fresh CDC same-source replay both exit1 with seven no-else-if diagnostics. Actual
ClassDeclaration clause's nonfinal if410 is followed by visit-one, a clean
statement-position witness. Raw: slice17-estree-walker-capability/artifacts/evidence/
cdc/bd3-gap and its review. No generated/runtime/Acorn/control execution occurred.

At source5408 classifier/forms.rs370–487, walk_no_else_if_expression has cond/
switch roles but no match roles, so literal-headed clauses fall through Value
recursion. classify_match1871–1918 and unit4006 accept multiple body forms;
emitter/forms.rs2234–2237/2322–2325 explicitly lower clause bodies as Statement
sequences. Guide00:849–854 permits no-else statement if. Seven observed diagnostics
do not establish seven independent defects. NE-C05 typed explicit-return finding
is separate; A6 hybrid/raw-child classification research is related context,
not a required architectural rewrite or authorized implementation scope.

**Owner/re-entry:** Project03 CDC owns a separately authorized bounded validator
context diagnosis/repair with meaningful exact positive/negative regression,
normal required source gates and independent review. Do not add else/do or alter
the frozen helper/oracle to evade this valid condition. Then revalidate unfinished
walker/scanner/observer and all unchanged13 capability rows; no full-corpus/F6
claim. Slice17 closes at0/13, one rowdone/fivedeferred. No current compiler fix,
fourth correction, next unit or release propagation is opened.

#### NE-C11 — unconsumed match subject inherits Statement during codegen

**2026-11-07 current accepted task disposition:** Slice198ed869f fixes only the
unconsumed target Value emission via existing context-save helper; exact original
740source now compiles/runs independently with originalJSON/DTS, complete JS both
targets as values. Fresh fullsource/focused/citation gates passed. See Slice19
cdc-verification. No release propagation or broad emitter claim; tooling/K remain.

**2026-11-07 authorized re-entry:** Slice19 owns explicit narrow repair, independent
validation of BOTH source fixes (including NE-C10 fn/header concern), then original
tool completion/same13 under next-real-gap stop. Candidate4304 is baseline, not
accepted source. Outer2spent/continuation3 and oldtooling3spent/tworemaining carried.

**Independently reproduced,2026-11-07.** Source task4304, complete frozen740-byte
positive in its CLI test. CC strict check/bothcompile/DTS pass, Deno parse fails.
Fresh CDC SAME source SHAceaaf162892e964a76f317558ad35cfcdf82bd6731fcebe0eabb21de2d953058
with actual current debugCLI9b71ca938f5f61c17cb3bee8b024a2e3f3c656c5f8178eac7cdb2272507d7f85
strict -o0 produces JS111a1fae5475e18c1179c5b530b94a734312e0aafcedc1cc18afac75c197ccf2.
Full readable module shows consumed match target is ternary, second UNCONSUMED
match initializer instead `const target__gensym1 = if (isBox) Box(ready);` followed
by else statement. Pinned Deno2.9.6/2ad84 strict offline run1, SyntaxError42:29
before evaluation. Source/tool/output hashes stable after replay. Raw/readable
source/JS/DTS/commands: slice18-match-validation-and-walker/artifacts/evidence/cdc/nec11.
CC earlier debug pinb6 differs handoff9b; original producer identity is limited,
not relabeled as fresh replay. Source style preference for ? is distinct from the
documented supported functional if/ternary equivalence; don't change the frozen
source to evade the gap.

At unchanged emitter/forms.rs::emit_match_statement, target const initializer
uses emit_expr(target,ctx) under Statement context instead of explicit Value.
Actual unconsumed-target case only is established; no broader guard/async/method/
lambda proof. **Owner/re-entry:** Project03 CDC owns separately authorized narrow
target-Value codegen repair with exact same positive regression, negative/context
preservation, normal full required gates and independent acceptance. Then resume
still-unaccepted NE-C10 (including fn-header source concern), remaining tooling
completion and unchanged13 controls only under authorized continuation. No current
emitter fix/source propagation/next unit opened; release5408 stays unchanged.

#### NE-C12 — variadic numeric-for body loses Statement context after first slot

**Independently reproduced printed-output failure,2026-11-07.** Slice19 final
walker9122473, source033762a58aa1a9a3104c097641666fc2dc794f08115ce913de2009f78be688c7,
on accepted task8ed nativeCLIaa31947… passes nativecheck/defaultstrictcompile0.
Fresh CDC same full source/configfree replay produces byte-identical JS
43976d8d3aef17210b6ed9dea609ef66b4bc3dfd4d0bb50bf02ee9e5661b3583, with THREE
COMPILE_ERROR throws at101/630/646 inside numeric for bodies. First source
flag-unlisted162–178 has bind item followed by a no-else statement if; generated
flagUnlisted95–105 replaces the if with unconditional TypeError placeholder.
All complete actual source/JS/DTS/stdout/stderr/exits/hashes retained in Slice19
artifacts/evidence/cdc/nec12 and CC correction08. No runtime/guard/K occurred;
the three instructions were not observed executing. Tools remain unaccepted.

**Source basis at8ed (no tested fix).** Guide00 statement-if849–854/Cfor905,
classifier/forms.rs463–475 first3Value/allremainingStatement and printer
codegen/emit.rs734–747 body args[3..] support variadic statement bodies. Emitter
forms.rs3271 instead fixed Positional([V,V,V,S]); context_for3234–3246 defaults
beyond that array to Value. This explains the actual source/output boundary;
not an authored missing else, no proof about while/other loops or shared cause
with NE-C02/NE-C05, and no required typed-AST architecture rewrite.

**Owner/re-entry:** Project03 compiler CDC owns separate authorized narrow
numeric-for header/body-context parity with exact valid-source regression,
preserved invalid Value/header diagnostics, full normal source gates and independent
acceptance. Then provenance-only refresh to ACTUAL accepted compiler/core artifact
pins and same frozen helper/control13 re-entry. Do not add else/ternary/helper
rewrite, patch generated JS, weaken or change controls to evade the gap. Eight
tooling corrections remain spent, not reset by prerequisite. No current source
fix/newunit/integration/F6/fullcorpus work is opened. Source8ed NE-C10/11 acceptance
and release5408 unchanged; all Project07/future package/type/human duties persist.

#### NE-T02 — user-type annotation guard is only tagged-object shaped

**Source-only observation,2026-11-07.** At source5408,
emitter/type_checks.rs104–117 user-defined fallback checks non-null object with a
tag property, not exact membership in the declared variant set. Slice17's private
FieldRole annotation therefore does not alone prove closed-role membership;
exhaustive match dispatch remains relevant. Guide05:628–637 documents match's
automatic unmatched fallback. No runtime probe/bug or new type fix is claimed.
Project03 CDC owns annotation/ADT guarantee clarification before future PL/guide/
book assertions, with Project07 authoring/human duties retained. This is distinct
from NE-T01 async declaration-sidecar coverage and is not the capability stop.

#### NE-D02 — zero-field ADT guide example calls a constant

**Source-only guide contradiction,2026-11-07.** Source5408 guide05:548–552 defines
zero-field None and calls `(None)` in find-config. Same guide480–494 uses bare
Info; guide00 zero-field constant rule and emitter/forms.rs1396–1407 emit a tagged
constant for zero-field variants. Bare FieldRole values in Slice17 follow that
reference; no change to constructor calls is warranted. No runtime error/probe
or causal claim about authoring failures. Project03 CDC guide/book owner should
reconcile this example before teaching/publication, retaining Project07 ADT/guide/
book/human acceptance. No current guide edit, extra K case or compiler gap claim.

#### NE-T01 — async declaration-sidecar coverage limitation

**Owned current limitation, 2026-11-06.** Accepted Slice14 async module/consumer
compile produces no .d.ts paths; absence is explicitly retained in both actual
CLI logs. At3b65d09, emitter/dts.rs208–301 handles exported Func declarations but
not the Async wrapper. Philosophy describes compiled JS “and possibly .d.ts”;
no universal async-sidecar promise was established, so this is not the new-gap
stop or an authorized type repair. Project03 CDC owns type-distribution coverage
disposition before future JSR/package/type-availability claims; Project07's
public API/authoring/human gates stay open. Preserve the current native runtime
success separately from declaration availability.

#### NE-D01 — template dispatch prose contradicts its single-literal table row

**Open guide follow-up, 2026-11-06.** At b841f71b/a061c214,
docs/guides/17-template-and-i18n.md123–137 correctly lists `(template "hello")`
as ICU, then says ICU is “only activated” by literal-string-then-keyword.
The inspected native/JS dispatch and Slice08's actual single-literal programs
confirm the table's no-keyword case. This is a source-cited prose inconsistency,
not a newly ambiguous runtime policy or a reason to change the frozen programs.

**Owner/re-entry.** Project03 CDC owns the next focused source-guide wording
correction, reconciling that sentence and its adjacent compatibility assertion
against the table/current dispatch before teaching/publication claims. Related
Project07 guide/book/human obligations stay open; no ownership transfer or
unperformed correction is implied. Slice08 records the issue here rather than
only in a retrospective. No compiler inquiry or additional case is opened.

### A5 · Packaging & distribution — **`02-packaging-strategy`** (research open)

**Capability (candidate).** Release engineering: Homebrew (custom tap) and
Debian (self-hosted APT repo) packaging, given lykn's Rust build + Deno runtime
dependency.

**Source / status.** Step-1 research unit already in this tree. **Open.**
**Re-entry.** The strategy report defines the candidate arc's scope.
**Disposition.** *(operator decides)* — pairs naturally with arc09 release work
and with A1 (build tooling).

### A6 · Fully-typed classification — recursive typed AST *(NEW 2026-07-22; research; origin arc15 slice03)*

**Capability (candidate).** Make `classify` produce a **fully-typed recursive
tree** — every nested expression a classified node with its own type — instead
of the current hybrid where `SurfaceForm` variants hold **raw `SExpr` children**
(`Bind.value`, `Match.target`, `MatchClause.guard`/`.body`, `FuncClause.body`,
`FunctionCall.head`/`.args`, … are `SExpr`, lowered lazily by the emitter).
Analysis passes would then match on **types**, not on raw surface shape.

**Origin — the constraint that forces it (arc15 slice03).** The method-on-
expression trap (`((express p):join "")` → silent miscompile) is a **raw-shape
collision**: a guarded match clause `((Some v) :when …)` and the trap have the
**identical** raw shape (List/Cons head + Keyword arg0). `classify_match`
dissolves the collision by consuming `:when` into a typed
`MatchClause { pattern, guard, body }` — **but only for top-level matches.**
A match nested in `Bind.value` or a `FuncClause.body` stays **raw `SExpr`**, so
its clauses keep the trap shape (proven against `data-types.lykn:54–59` +
a minimal repro that compiles clean today). **Match-awareness is therefore
irreducible without typing the nested exprs** — which is exactly this arc.
slice03 landed **Option B** (recursive raw-shape walk with a parent-aware
`is_match_clause`/`ptr::eq` skip) as the verified-correct 0.6.0 guarantee; the
`ptr::eq` borrow-identity check is a maintainability sharp-edge, not a bug.
**This entry is slice03's deferred Option C.**

**Research question.** What does it cost, and what does it buy, to make
classification recursive and total — so that a nested `match` (or any nested
form) is a **typed node** at classification time rather than raw `SExpr` the
emitter lowers later? The deliverable is a **cost/benefit + architecture-
direction report**, not an implementation.

**Impact — what it dissolves and enables (benefit).**
- **Retires the whole raw-shape-collision class**, not just the one trap:
  method-on-expression, `:when` disambiguation, and any future analysis that
  today must special-case surface shape all become **exhaustive `match` on
  typed variants** — completeness compiler-enforced (no `_ =>`), no
  `ptr::eq`/parent-identity carve-outs anywhere.
- **Type-safe analysis passes** generally: lint checks, future optimizations,
  and provenance/metadata passes operate on a stable typed tree instead of
  re-deriving structure from `SExpr` heuristics.
- **Removes the slice03 B sharp-edge** (the `ptr::eq` borrow invariant) at the
  root rather than fencing it.

**Cost / risk.**
- **Large, central rewrite.** Every `SurfaceForm` variant that currently holds
  `SExpr` children gains typed children; the classifier grows recursive-descent
  for all nested positions (this is the bulk of the work and the wide-test
  surface).
- **Emitter + analyzer adaptation.** The emitter currently **lowers raw `SExpr`
  lazily**; it would consume typed nodes instead — a coordinated change across
  codegen (Rust) and the analyzer, with the JS compiler (`packages/lang`) to
  keep in parity.
- **High blast radius, high regression risk.** Touches the pipeline core
  (reader → expander → resolver → **classifier** → analyzer → emitter →
  codegen); needs a full-corpus parity gate. **Likely 0.8.0+**, not a single
  0.7.0 slice — a version-spanning effort in its own right.

**Compiler/checker future directions to settle in the research.**
- **Scope of typing** — type *all* nested exprs, or only the collision-prone
  positions (matches, method receivers)? Full typing is cleaner but larger;
  targeted typing is cheaper but keeps a raw/typed boundary.
- **Two-compiler parity** — does the JS `packages/lang` classifier mirror the
  Rust one, or does one lead? (DD-era divergence risk.)
- **Interaction with A3 (arc14 comment retention / node-metadata)** and A1
  (build tooling) — a typed tree is the natural carrier for provenance metadata;
  sequencing matters.
- **Migration path** — incremental (variant-by-variant, raw-fallback during
  transition) vs. big-bang; how the parity corpus gates each step.

**Re-entry.** Open a research unit (mirrors `01-treeshake-audit` /
`02-packaging-strategy`) — **`04-typed-classification/`** — whose deliverable is
the impact + cost/benefit + implement-plan report. CDC can draft its slice-doc +
cc-prompt on request. **Cross-ref: `docs/design-v0.6.0/arc15-surface-syntax-
traps/` slice03 (DEFERRED — Option B retained for 0.6.0; this is its Option C).**

**Disposition.** *(operator decides)* — research is a 0.7.0 candidate; the
implementation is **likely 0.8.0+** (version-spanning), informed by the report.

---

### A7 · `as->` — the general threading form *(NEW 2026-07-25; origin `03-threading-macros`)*

**Capability.** Add `as->` (and, for symmetry, consider `some-as->`): a
threading macro that binds the threaded value to a **named placeholder** so each
step can put it in *any* position.

```lisp
(as-> data $
  (crypto:subtle:digest "SHA-256" $)     ;; datum last
  (Reflect:set target :digest $)         ;; datum in the MIDDLE — no spelling today
  (Deno:write-text-file "out.bin" $))    ;; datum last
```

**Why this, and why now.** The `03-threading-macros` survey censused the entire
observable ECMAScript 2025 built-in library (489 callables) plus the host surface
(214 more) and classified every one by where its primary datum sits. Results:

- **48** ES2025 callables actually discriminate between `->` and `->>`
  (required arity ≥ 2). The split is **37 datum-first : 2 datum-last** — and the
  two datum-last are `BigInt.asIntN` / `asUintN`.
- The host tier adds **71** discriminating callables at **27 : 18**, where the
  datum-last set is two coherent families (WebCrypto configured operators; keyed
  sinks like `Deno.writeTextFile`, `Headers.set`, `localStorage.setItem`).
- **6** host signatures are datum-**middle** (`SubtleCrypto.importKey`,
  `wrapKey`, `unwrapKey`, `deriveKey`, `deriveBits`) and **17** are callback-last.
  **None of these has any spelling in lykn today.**

So the surface budget argument is: a second *dedicated* macro (`->>`) serves 2
core built-ins, while **one general form serves datum-last, datum-middle, and
operator-receiver together** — and gives the reader an escape hatch for every
signature the survey classified `PEER`, `D-MID` or `F-LAST`.

**It also currently mis-compiles, silently.** `(as-> x $ (f $ 1) (g 2 $))`
compiles clean — no diagnostic — to `asTo(x, $, f($, 1), g(2, $));`, a call to an
undefined `asTo` (the `->` → `To` rule at `compiler.js:405` rewriting an
unrecognised head), plus an undefined `$`. `ReferenceError` at runtime. So the
choice is not *add a feature* vs *do nothing*; it is *add it* vs *leave a
Clojure-shaped trap that compiles*.

**Scope sketch.** Additive, both compilers, mirrors the DD-18 / DD-18.1 pattern:
a `classifier.js` head + `AsThread` surface node, expansion to nested `const`
bindings (or an IIFE, as `some->` already does), the parallel Rust
`emitter/forms.rs` arm, cross-compiler tests, and a guides section. DD-18.1's
keyword-step rule should apply unchanged, so `(:method …)` steps keep working.
Interaction to decide: whether the placeholder is user-named (Clojure) or a
fixed sigil.

**Source:** `project03-language-evolution/slice03-threading-macros/` — `inventory.md` §5–§7
(recommendation R2), ledger rows R-7 and R-8. Discovery row `D-2607-3KTP`.

**Re-entry:** the pending language-design conversation on threading macros — the
same one that owns `D-2607-K9RT`'s disposition. `as->` and the
collection-prelude question should be decided together, since the survey's
recommendation is *ship `as->`, don't ship a datum-last prelude* and the two
arguments share a premise.

**Disposition:** *(operator decides)* — the survey argues 0.7.0; it is small,
additive, and closes a silent trap.

---

## B. Routed items from the 0.6.0 buried-intent audit (project-plan §1)

Each was surfaced and dispositioned by the arc11 buried-intent audit; carried
here so "routed" never becomes "re-buried."

| Item | What / why | Source | Re-entry | Disposition |
|------|-----------|--------|----------|-------------|
| **`set-symbol!` deprecation** | Breaking. Live surface form — the only spelling for computed-key assignment (1 guide + 2 tests). Deprecate per original intent, or keep? | arc11/slice02 F-4 | Decide at 0.7.0 planning | *(operator decides)* |
| **`genfunc` multi-clause** | Rust emitter silently emits only the first clause (matches JS). A compiler feature. | arc11/slice02 N1 | When multi-clause generators are needed | 0.7.x |
| **ICU error-position → Span** | ICU error positions not attributed to source Spans (`icu.rs:696`). | arc11/slice02 #2 | When ICU/i18n area is next touched — **folds into A2** | with A2 |
| **Reader block-comment stub cleanup** | `parser.rs:308–310` stub. | arc11/slice02 N2 | When comment handling is touched — **folds into A3 (arc14)** | with A3 |
| **Doctest nested-fence scanner** | `doctest.rs:1138`. | arc11/slice02 N3 | When doctest is next touched | *(operator decides)* |
| **Nested-destructure completeness** | `emitter/forms.rs:2074`. | arc11/slice02 N4 | When destructuring is extended | *(operator decides)* |
| **Downstream mycelium DD-58 migration** | Bare kernel forms in mycelium break under a strict consumer. | arc10 | **arc06 slice02 re-audit will re-confirm/route this** (host-run now) | 0.7.0 candidate |
| **Batch-compile the test corpus** | `compile_lykn_test_files` spawns ~97 per-file `deno eval`s; batching into one Deno process is the next big verification speed win. | arc12/slice01 | When verification perf is next prioritized | 0.7.x |
| **Toolchain hardening trio** | (a) stray-sibling double-run guard (`lykn test` runs `test/`'s hand-written `*.test.js` explicitly + corpus only from `target/`); (b) freshness-guard scoped to `src/` (newer `tests/*.rs` false-positives); (c) `--compile-only`+`--docs` honored by `run_doc_tests`. | arc12/slice01 | When the CLI is next touched — **relevant to A1** | 0.7.x |

---

## C. Memory-only items now promoted into this register

These lived only in CDC memory (the "lose track" risk the operator named).

| Item | What | Source (memory) | Re-entry | Disposition |
|------|------|-----------------|----------|-------------|
| **GitHub Linguist submission** | Register lykn with GitHub Linguist so `.lykn` highlights and lykn code blocks use ` ```lykn ` instead of ` ```lisp `. | `lykn_linguist_deferred.md` | Needs a stable public grammar + enough public lykn on GitHub | 0.7.0+ |
| **Subprocess in-memory module loading** | Phase-3 alternative to DD-54's disk-materialization: rewrite the `env.rs` subprocess to import via `data:` / Blob URLs. Perf/cleanliness of the macro-expansion subprocess. | `subprocess_inmemory_loading.md` | When macro-subprocess perf or the DD-54 approach is revisited | *(operator decides)* |
| **Lykn Book multi-edition versioning** | Permanent `/vX.Y/` URLs, shared images, "Book Versions" ToC. **Lives in the `~/lab/cnbb/lykn` repo — tracked as its own project, not a lang arc.** | `lykn_book_versioning.md` | Cross-reference only; owned by the Book project | external (cross-ref) |

---

## D. Provenance & maintenance

- **Not a `project-plan.md`.** When the 0.7.0 project is defined, write
  `project-plan.md` from this register + the research-unit reports; arc14
  migrates in from the 0.6.0 tree at that point.
- **Feeders still open:** arc06 slice02 (mycelium re-audit, host-run) will add
  routed post-0.6.0 rows; arc07 (0.6.0 docs) may surface guide-drift items that
  belong here.
- **Owner of dispositions:** the *(operator decides)* release boundaries are
  Duncan's at 0.7.0 planning; CDC's role is to keep the list complete and each
  row traceable, not to set the boundaries.
