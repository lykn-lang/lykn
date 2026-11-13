# Iteration16 draft — independent source readiness

Sol6.1High,2026-11-13. **Source-ready for the bounded native-only recipe.**
No concrete contradiction found. Read the complete draft16 against clean
5554a4d6bd0aa66bbca3cedfd91a41e0f1cf86cb,
treef632c415b833e796e6843abdc5220d6492595fc0, branchcodex/qualified-adt-core,
source home /Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering.
This is readiness, not software/B2-ICU-N acceptance. Root retains source/build
and design ownership; no build/test/source/Git/index/ledger mutation occurred.

Source references below are that immutable source pin. Baseline README, all3
Lykn fixtures/generated ESM and failure/control runtime streams/status were
read: _n and _v0 TDZ both1; noncollision0/exact3 3 newline. These remain root
runtime evidence using explicitly cf-built binary; not independently replayed
in this read-only review. Current slice tail/ledger preserve B2-UNIT acceptance,
open B2-ICU-N and all LC02–08/name/owner/S03 obligations.

- codegen/names.rs49–181 normalizes actual emitted identifiers;208–237 emits
  colon members with only first segment as the lexical root. Reserving borrowed
  as_atom roots through List/Cons matches this behavior; strings/keywords are
  data. _n! normalizes to _n. ast/sexpr.rs123–154/372–377 provide all node variants
  and the non-dispatch raw-name accessor; scanning needs no clone or tag rewrite.
- codegen/icu.rs510–597 is the complete dispatch/hoist boundary. The allocator
  must borrow every validated kwarg before the existing HashMap is consumed;
  scanning only generated placeholders misses source dependencies. Current
  hoists at573 and selectors at493/790/846 need one occupied set. All emit_mft
  calls are contained in icu.rs:529/584/593, selector recursion806/819/831/
  867/874, and test helper1095–1099. No external MFT caller was found by whole
  crates/packages/test caller query. emit.rs1297–1320 is the sole production
  ICU dispatcher, including concat fallthrough. Checked arithmetic/error
  propagation fits existing Result<_,LyknError>; no new error enum is needed.
- One allocator per actual nested template is sufficient: a complete recursive
  outer scan includes nested-template source dependencies; nested declarations
  stay in their own existing IIFEs. Within a single MFT, sharing is necessary
  across repeated hoists and every plural/select branch, including selector
  override placeholders from make_slot_override at773–781. The recipe preserves
  those boundaries and does not require global state or cross-template IDs.
- Canonical native completion names are finalized before invocation/host lowering
  (emitter/mod.rs43–61; forms.rs352–403); host references become ordinary atoms
  in host_references.rs185–216. Thus their actual emitted references inside
  kwargs are visible to the proposed scan. Current raw private writer aliases
  lyknIntrinsic*, lyknHostReflectApply* and completionValue__gensym* also cannot
  equal this ICU family's _-prefixed stems/suffixes. This is a bounded current-
  family fact, not generic future allocator support for unseen private metadata.
  Preserve private cloning/writer contracts; no broader raw-ICU/private-address
  transport claim is inferred from a source-name scan.
- Existing icu_cross_compiler_tests.rs24–27 invokes reader→native kernel writer,
  not canonical analysis. eval_js checks subprocess success at75–89; two older
  side-effect helpers omit that check. New native tests must check it explicitly
  as the draft requires. e2e_tests.rs22–27 produces analyzed kernel JSON but
  does not exercise native JS ICU; actual CLI checked/stripped runtime is needed.
  compile.rs163–220 reaches expand→resolve→validate→classify→owned analyze→emit→
  native codegen; the draft's canonical controls discriminate this route.

Two preservation clarifications for implementation/readback:

1. Current HashMap kwarg consumption (icu.rs566) has unspecified order. Preserve
   that consumption; do not assert source keyword order or byte-identical whole
   output across repeated compilations. A safe single-hoist preferred-name
   fixture can establish unchanged preferred output without imposing new order.
2. Current repeated nontrivial kwargs hoist eagerly outside MFT branches
   (561–595). An unselected-branch laziness control must use a once-referenced
   kwarg; repeated-kwarg effect/exception controls must retain existing eager
   once-only behavior. No new demand that repeated branch-only kwargs be lazy.

ICU slot grammar313–325 admits both a-b and aB; their preferred locals normalize
identically. Including this two-slot runtime collision among the proof fixtures
would directly discriminate immediate reservation of each generated name, in
addition to source-suffix/normalization/root and hoist/selector controls already
specified. New fixtures are designs only until actual runtime evidence exists.

Read extents: full source AGENTS/draft/baseline README+fixtures/generated outputs;
full names.rs and ICU cross tests; ICU production493–889, parser slot313–325,
all MFT helper/test callsites; SExpr1–260/258–315/320–390; canonical emitter/CLI
and host/completion relevant bodies; current planning acceptance/open-row tail.
Initial combined names+ICU output was truncated, then full affected ICU region
recovered with numbered reads. Two lookup commands used nonexistent paths
(planning-relative source path and obsolete commands/compile.rs); corrected to
actual source home/compile.rs before conclusions. No runtime/gate was invoked.
Existing collaboration/testing guidance applies; Rust TD02–03/OB02–03 and
behavior/gate guidance refreshed; source Lykn skill+template guide consulted.

Native-only scope is coherent: public JS ICU analogous gap, ordinary source
binding allocation, typed owner/case graph/nominal activation/check semantic join
and original LC02–08 remain future work. Accepted A/B1/IC/B2-LX/B2-UNIT and their
recorded limits remain unchanged. No new acceptance or release authority.

Final draft refresh: root added the exact eager-repeated/once-referenced
unselected-branch distinction at proof5 and explicitly states preserved HashMap
consumption without deterministic-full-output claim in its author readback.
Those clarifications resolve the two implementation-readback caveats above.
Final source porcelain is empty; HEAD5554a4d6/treef632c415 unchanged. Clean
read-only handback to root; source/build never transferred in readiness.
