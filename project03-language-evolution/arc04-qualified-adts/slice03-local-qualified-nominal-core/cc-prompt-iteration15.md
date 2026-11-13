# S03 iteration15 — B2b1 privacy-oracle correction01

Issued2026-11-13 after separate Sol source-readiness/clean handback againstcf4326224ccfd992cf9abf6f9f943375c5305fb0,
tree27419cb322612374e036e14ea7e469243cf75eeb. Same Luna6High CC and separate
Sol6.1High CDC, standard Autonomous authority. Root owns planning/design/Git;
source/build transfers only on explicit issue after Sol's clean handback.
Source home `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`,
codex/qualified-adt-core; canonical planning is the existing planning worktree.
No release/remote/dependency action. B2b1's first formal correction; B2a history
and every S03 criterion remain. No source naming or owner implementation here.

## Defect, exact repair and invariants

Separate Sol found actual AnalyzedUnit fields/accessors correctly private and
immutable. However its Rustdoc compile_fail uses `AnalyzedUnit {}`; that also
fails from missing fields if fields become public. It cannot discriminate the
claimed construction restriction. This is a test-oracle defect, not a runtime
or canonical API defect. Retain the review/first full results without labeling
the old empty literal a successful privacy proof.

Only edit the existing construction compile_fail example in
`crates/lykn-lang/src/analysis/mod.rs` to supply ALL actual fields with valid
values and imports:

```rust
use lykn_lang::analysis::{AnalyzedUnit, type_registry::TypeRegistry};
let _forged = AnalyzedUnit {
    forms: Vec::new(),
    type_registry: TypeRegistry::default(),
    diagnostics: Vec::new(),
};
```

At this baseline there are exactly those three fields. Their types infer both
Vec values. TypeRegistry/default and AnalyzedUnit imports exist. The example
must fail because fields are private; with public fields this full literal
would compile. Explain that invariant in the adjacent example prose if useful.
No production tokens/signature/behavior, extra API, public field, algorithm,
test golden or other source file changes. Keep the old emitter-arity negative
and normal unit examples intact. Do not fake success by using an unavailable
type/import or leaving a required field unspecified.

## Intake, gates and return

Read-full this issued prompt, source AGENTS.md and correction HOLD/index;
read-section iteration14 native API/gates, current slice ledger/plan. Inspect
actual three fields/types/import paths and all rustdoc examples. Use installed
Rust/testing guidance (opaque invariant TD02–03, actual negative discriminator).
Before edit write actual read/query coverage and concise source-cited readback
in absolute canonical artifacts/increment-b2b1/correction01/cc/index.md under
the owning S03 slice. Root owns planning staging/ledger.

No Python execution or Python/Ruby/Fennel/handwritten JS research/evidence/
command/orchestration helpers; no parity exception. New helpers use Lykn;
ordinary Rust product/doc tests and direct shell/CLI/simple lifecycle allowed.
Use existing DENO_DIR plus owned XDG/npm/TMP under
`/private/tmp/lykn-b2b1-correction01-cc/` outside every repo ancestor; preserve
exact cwd/command/env/raw streams/numeric status. No caches in evidence.

Run actual cargo test -p lykn-lang --doc and relevant Rust formatting/source
diff checks. Corrected negative must be selected and pass, normal examples
must still compile; record actual population. Do not edit product fields for a
mutation test or introduce a new validator/harness. The reviewer determines
applicability of its already-run cf432622 full/runtime/CLI/cold/size evidence:
a strict doctest-only diff invalidates the privacy example proof and final HEAD
provenance, not unchanged compiled product behavior. No full/docs repetition
solely for a new commit name; any production change requires a fresh scope/
validation disposition before work. Independent Sol must run corrected rustdoc
and inspect the actual rejection reason/source privacy after final commit.
Run final HEAD cited paths; unchanged JS size evidence may be retained if Sol
verifies identical inputs. Preserve earlier raw gates and all limitations.

Commit --only the one authorized source file with inspected contiguous literal
and Git-parsed Codex/Billo co-author trailers. No amend/reset/blanket staging.
Return clean committed source/build pin/tree, exact comment-only diff, raw doc
population/status and CC index. No B2-UNIT or broader acceptance by CC.

Root readiness: baseline fields and public TypeRegistry path directly inspected;
complete literal fixes the identified alternate failure cause. This follows
the testing discriminator requirement without changing any public behavior.
Separate Sol read the full draft and verified the three fields/imports/types;
clean source/build handback and original HOLD packet are frozen at SHA256
0864bc473e988c6d9c2cbe6c2cf490249d8a8aea5f524b880ba1ba1f5c1b660d.
Root verified that digest and issues the one-file correction under existing
Autonomous authority. No behavioral scope or gate is reduced.
