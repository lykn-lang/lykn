# Arc05 S02 — remaining native discard binding forms

Issued2026-11-13 after root source inspection and separate Sol source-readiness review.
Operator selects OpenAI gpt-6-luna/high CC, separate gpt-6.1-sol/high CDC,
Autonomous Mode. Execute S02 only through independent close/report. Root owns
architecture/planning Git/index/ledger and serial build handoffs; no S03 advance.

Source /Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering,
codex/qualified-adt-core, clean4998240927909c3abc0172dfef2b56076b19f708,
treeb18e75dc06888a771bd7f3aa92a3c2cb1a7e1dc8. Existing orphan planning is
/Users/oubiwann/lab/lykn/lang/.worktrees/planning. No new worktree or release action.

## Implementation contract

Read this slice's full plan/ledger: it contains the source-cited algorithm,
binding decisions and exact NINE source paths. Preserve native Source759 and
public499. Root has done actual source inspection; the recommendation is
producer-local preparation using existing CompletionValueId, not a global
rewrite or raw-codegen Source semantics. `_` is discard, `_value` ordinary;
expressions/schema/API/property/assignment roles retain their identity.

1. In emitter/forms.rs extend lower_discard_binding_pattern's top-level
   default/rest/spread wrappers without visiting expression RHS as a binder.
   In emit_kernel_children retain role/context emission, then prepare only
   actual raw declaration/loop binder and raw callable parameter slots. Each
   parameter is prepared independently; a parameter container is not an array
   destructuring pattern. Preserve function name slots, anonymous generator
   layout, arrow shorthand and async payload handling. Do not re-expand macros.
2. Prepare ClassMemberForm::Method.prefix's actual last parameter slot only,
   preserving property names/fields/static/async and class context. Explicit
   kernel:class/class-expr routes through existing class classification/emission.
   Source-generated Type field functions never pass through this preparation.
3. Add distinct post-emission legacy catch preparation on ordinary and direct
   try routes. Mirror the actual expression writer and selected last clauses.
   Direct array `_` reads a discarded value; declaration array `_` stays a hole.
   `(object (default _))` preserves property default. Preserve computed keys,
   defaults/rest/alias subwriter roles and foreign exceptions. Keep legacy catch8,
   S01 raw-arrow validation and unsupported catch typed-fn grammar unchanged.
4. Complete kernel_param_names and lexical_regions untyped default-path support
   for the writer's top-level spread parameter. Prove named/reserved/form-name
   binding consumers agree, including nested default values; no typed/schema/
   catch/value grammar expansion. Preserve metadata/whole+fragment finalizers.
5. Replace grouped zero-name rejection with a narrowly structural discard-only
   pattern recognizer per plan: exact shape/arity/rest position, not empty names
   => accept anything. Preserve typed-group atom restriction and named duplicates.
6. Share explicit multi-simple diagnostic between classify_func and emit_func
   for direct AST callers. Reject ANY top-level Simple default/rest when function
   clauses.len()>1, even alongside destructured params/clauses; do not require
   the whole signature to be Simple. Nested defaults/rest and single clause stay.
   Exact diagnostic is in plan. Future semantics are held for candidate S09.
7. Add native+CLI product tests and immediate docs in the allowlist. Raw
   codegen/mod.rs remains a literal supplied-IR writer; document and test this
   boundary, rather than implementing discard semantics there. No API flag,
   dependency, generic walker framework or error-type redesign.

Private factoring/names are local discretion inside these decisions. For Rust,
apply anti-pattern AP-09 AVOID (user input errors return existing diagnostics),
AP-12 AVOID (AST reconstruction retains ownership/identity; no clone to silence
borrows). Existing NameRes/private metadata and Result/fatal wrappers stay.
Challenge a source mismatch promptly; do not silently choose a different contract.

## Discriminating product proof

These are source-grounded example sketches, not author-executed probes. Use
valid grammar/current helpers and capture actual generated JS and numeric exit
on failure; do not turn guessed output into acceptance. Ordinary Rust/JS product
tests are allowed. No comments about failed attempts in product tests.

- With foreign globalThis._=99, each canonical raw callable `_` returns/yields
  source `_` as99, repeated discards compile as valid strict ESM, and `_value`
  returns7. Representative `(bind pick (kernel:=> (_ _) _))` called with7/8
  prints99; supplied argument effects happen once and in order; function length2.
  Default `_` RHS reads outer99 only when missing, rest/spread consumes all
  supplied arguments, generator body runs on advance, async returns await99.
- Raw declarations `(kernel:const _ (bump 1))`, let/var and numeric-for init
  retain effects and leave outer99. for-in/of/await-of binders keep outer99 in
  the body and iterate actual inputs. Distinguish iterable next/value/return
  counts for bare array holes, nested binding targets and legacy catch values;
  preserve wrapper rejection and early-break IteratorClose.
- Class constructor/setter/method `_` and static/async variants read outer99;
  method/property key `_`, field `_`, computed keys and callable property values
  preserve data roles. No invalid getter/setter parameter syntax is introduced.
- `(try (throw 7) (catch _ (console:log _)))` prints99 through ordinary and
  direct-return function try routes. Object catch shorthand/pair keys are read
  once; legacy `(object (default array))` and `(object (entry caught))` still
  print8 with existing callable fields. Nested default RHS reads outer99 once;
  ignored handlers don't run and finally ordering survives. S01 nested raw-arrow
  positive1 and early eval/arguments negatives remain actual native controls.
- Grouped `(bind (array _ _) inputs (object _) record)` must admit/evaluate
  and leave source99; empty/nested/alias/default/rest variants retain operations.
  Literal/call/malformed/default-missing/invalid-rest-placement zero-name forms
  reject. Same-scope named_value duplicates reject; repeated_ accepted.
  In particular grouped `(object (alias :value _))` and `(object (spread _))`
  are valid discard-only patterns, with the existing keyword key and object
  copy/getter behavior preserved. Last object rest and spread are both admitted;
  object rest/spread targets must be identifiers, not a new nested-rest grammar.
- Multi default example `(func f (:args ((default :any _ 7)) :body 1)
  (:args (:string value) :body 2))` and top-level rest variants reject with the
  stated diagnostic before JS execution, checked and strip. Include mixed
  destructured+Simple signature and directly constructed analyzed Func. One
  wrapped clause, ordinary single-clause default/rest and existing fixed/nested
  multi tests run successfully; no change in dispatch semantics is inferred.
- Compiler-private candidate/colon names cannot be captured; source/body/default
  `_` remains foreign. Whole finalized JSON executes the same result; failed
  fragment then reuse remains sound. Direct raw codegen of an arrow binding `_`
  retains literal `_`/its old result7, while canonical preparation yields99.
  Existing Type schema `_` constructor field still stores/checks7 under key `_`.

New tests belong in the two remaining_discard_bindings.rs files; use existing
native tests/discard_bindings.rs and CLI integration patterns, not a new harness.
CLI proof must actually check and compile Source/kernel-escape and `.lyk`
fixtures, run emitted ESM (0/exactstdout/empty stderr), exercise checked/strip
and diagnostic negatives, and retain useful schema/property/assignment controls.
Do not satisfy this with emitted substring checks alone. Derive denominators
from real output, no invented acceptance quotas or M6 selection changes.

## Intake, validation and handback

Required-full: this prompt, S02 plan/ledger, source AGENTS.md, S01 independent
verification for the accepted baseline, source skills/lykn/SKILL.md.
Required-sections: source emitter/forms.rs actual kernel/try/class routes,
discard/prepared param helpers and private finalizer; classifier Bind admission,
Func parsing/multi emission callers; binding kernel params and projections;
lexical_regions function/class/default paths; actual codegen pattern/params/
loop/try/class/object/default/rest/alias writers; native discard test helpers
and preserved iterator/multi/schema/private/catch controls; CLI variadic_for_bodies
runtime/CLI pattern; relevant surface guide Bind/kernel/function sections.
Installed rust-guidelines actual AP-09/AP-12 and relevant core error/enum/ownership
sections; testing01/03; collaboration-framework prompt-intake/verification.
Read exact definitions/dependencies necessary to implement the recipe, recover
truncated outputs and record actual extents/readback before edits in
artifacts/cc/index.md. Do not inherit the retired S03 mega reading list.

Before source-dependent execution run make fresh-artifacts (native release
CLI + staged packages). Use existing DENO_DIR and owned
/private/tmp/lykn-arc05-s02-cc/{xdg,npm,tmp}. Capture first meaningful regression,
fix attempts/final proof with exact command/cwd/env/fixture/streams/numeric exits,
session handles and exact-owned cleanup. Artifacts/cc is the durable evidence
home; only root stages/commits planning. Keep generated output ignored in target.

Focused new native/CLI tests, existing discard/binding/lexical/emission/host
regressions and actual CLI/JSON proof first. Then one make check with docs once,
PRECREATED absolute LYKN_MACRO_DEPENDENCIES_EVIDENCE_DIR under artifacts/cc;
capture actual inner62/14. Exact NINE-path source commit --only with contiguous
Codex and Billo co-author trailers. Post-HEAD make check-cited-paths and fresh
make bundle-size-check81920 cap; no source change afterward without affected
revalidation. Preserve cache/download/warning/skip limits and all old histories.

Return clean source commit/tree/exact paths/no owned jobs, CC proposed-done
only, and closing-report.md with all9ND rows, artifact inventory and Bubble-up
to arc (delivered state/findings/scope diff). Independent Sol reviews before
root closes rows/retrospective; source/build returns to root at handback.

No Python execution or parity exception. No Python/Ruby/Fennel/handwritten JS
research/helper/evidence/orchestration/command logic; new helpers use Lykn.
Ordinary product tests and direct shell/native CLI/simple filesystem lifecycle
are allowed. No merge/push/release/publication/remote CI/new dependency/licence
or selective-emission experiment. Only S02 implementation/independent close.
