# CDC verification — JSON behavior closed

Date: 2026-09-12. Reviewer: Codex, CDC, independent of the executing CC task.
Reviewed planning commit: `1ffc8fae24e9c82fff6dd841b49afdbe407b3d9b`.
**Verdict: all seven original criteria done at reproduced strength.**

Replayed all 161 variants / 354 attempts, plus three supervisor controls and
the harness permission/argv controls. All 306 deterministic native/package
stdout records match CC byte-for-byte; all final file states match. The 48
stress attempts completed with expected sizes/counts, no unexpected stops and
no observed survivors. Four intentional file-interruption exits remain losses/
interruption observations, not successful replacement claims.

## Baseline drift and controlled replay

The source checkout was concurrently preparing the 0.6.0 release. HEAD still
named d0bb981 at first inspection, but Cargo/config/workflow inputs were dirty
and bin/lykn had SHA-256 `ebd9b79f8840a1c7010e8962770e3795a6a377042295af6c1fda13d16c326dff`,
not the pinned executable. No source file, live binary, index or release work
was reset or edited by CDC.

Exported immutable source `d0bb981dae2a4abf6c984406c4b2081a45cc92f8` using
`git archive` into `/private/tmp/lykn-p07-cdc-source.weN8lJ`, then ran
`cargo build --release --locked` there. Build succeeded. Isolated executable
SHA-256 is `78aac90c4b4d6c644ac376e99ce91f88cdae32477aff476980912e68eba0c1bb`.
This is a fresh build of the pinned source, not the historical executable's
byte identity. Deno remained 2.7.7 at `/opt/homebrew/bin/deno`, hash
`103ea70463213b1a8ea7b46852a34612f4e0afcc1ff09d1656d185ed215772d4`.

Replay root: `/private/tmp/lykn-p07-cdc-replay.CZ7r2d`. The copied supervisor's
CLI constant alone was changed to the isolated executable; permissions stayed
the same and allow-run named that executable. Its compiled output differs
only in that constant (plus the transcript wrapper's terminal blank line).
The unchanged cases.lykn produces **exactly the original cases.js bytes**,
SHA-256 `a528ce3038f0e1989f66ddaf49b6154e4e226e2a25866dc30d2166176de446f2`.
All 354 child records carry that compiled hash and the original source hash.
This constrains the build-path confound without claiming binary reproducibility.

## Checks and results

Read both programs, the manifest and original FM01 crosswalk, all family
interpretations, byte records, graph/lock, authoring history, discoveries,
original prompt/ledger and ancestor diff. The commit has 22 authorized paths
and passes whitespace verification; original thirteen artifacts are present.

- Both retained programs: check, lint and compile passed; misleading unused
  warnings remain evidence. No generated JavaScript was edited.
- Real control-read: no grant exits 1 with NotCapable; scoped read prints
  CONTROL. Fake-child argv puts grants before `--`/program, and trailing
  `--allow-all` remains script data.
- Supervisor controls: wall/output/RSS reasons, exit 137 and no survivors
  reproduced. Wall control took 615.448ms for its 500ms polling threshold;
  output retained 4096 bytes. Nonzero samples establish observation, not a
  hard memory cap or an exact deadline. Host process observation used the
  approved execution route; Deno grants were not widened.
- Native: 220 records. Fresh frozen package cache/graph: 13 ESM modules,
  three JSR packages, zero npm entries or Node edges. Remote module graph
  matches the retained graph after excluding local cache paths; lock unchanged.
- Package: 86 records. Stress: 48 records. All expected stops and file effects
  reproduce; timing/RSS are observations, not equal-output assertions.
  All 134 per-attempt package/stress lock copies match the retained lock bytes.
- Independent [Lykn audit](artifacts/cdc-audit.lykn): **5,170 checks passed**,
  including IDs/repeats, exit/termination, no survivors, source/emitted hashes,
  stdout/stderr and output-file byte hashes, input immutability, final states,
  deterministic output, selected independent semantic expectations, stress
  sizes, and all 144 length/hash records in the byte table. This is a check
  count over 354 attempts, not 5,170 independent experiments.

Full independent process records are [cdc-replay.jsonl](artifacts/cdc-replay.jsonl)
(357 rows including controls), SHA-256
`45d1469a354e2ba795dce8433830b1e9b7ec50427f351f32d5833950fa254700`.
Audit source SHA-256:
`1fa0ac4e8315633f13cf6c11f1f93c09e67c4b276ed7dd08e7bfbaf820c56dd4`.
No source regression Make gate is claimed for this planning/research-only change.

## Reproducing this review

Follow [J2-L01](artifacts/baseline-and-launch.md#replay-from-retained-inputs),
using a fresh exported d0bb981 build when the live binary pin has drifted.
Record build hash and replace only the copied supervisor's CLI literal and
corresponding allow-run path. Run preparation and controls before native,
inspect fresh frozen cache/graph before package, then run stress. Each completed
group gets a fresh attempt directory; never rerun it over previous fixtures.

Copy cdc-audit.lykn and byte-evidence.md into that replay root. Extract the
original native/package/stress JSONL sections from raw-transcript.txt between
their `ARTIFACT GROUP.jsonl` and `END ARTIFACT` lines into `cc-GROUP.jsonl`.
The new supervisor outputs are `GROUP.jsonl` and `controls.jsonl`. Alternatively,
for an audit of the retained CDC records, split cdc-replay.jsonl by its phase
field into those files (`control` maps to controls.jsonl). Keep inputs.json
from the original artifacts. Run the audit with the isolated CLI:

```sh
"$research_cli" run --no-prompt --allow-read="$trial_dir" cdc-audit.lykn
```

Use J2-L01's cleared environment and disposable CWD. Audit output:
`{"checks":5170,"attempts":354,"variants":161,"byteRecords":144,"result":"pass"}`.
The audit checks exact bytes/states and selected semantics; it does not certify
SequenceMatcher's particular diff alignment, all parser implementations or
the source-to-human aesthetic judgment.

## Authoring and findings

Recompiled retained cases attempt3 at d0bb981: compile succeeded and again
emitted Object.is(value,0), new-await and return-while/try/throw forms. Final
source warnings again mark referenced bindings unused. NZRO/JSCF/UNUS are
independently reproduced observations; root causes and repairs remain open.
The final research source avoids those forms without repairing emitted JS.
All six BigInt/cycle position checks and the broader unsupported-value table
support the retained JSER finding; no current-book repair is inferred.

CC disclosed Python aggregation without an established Lykn gap. That deviates
from the project's Lykn-first workflow; calling it artifact tooling does not
create an exception. CDC replaced the independent aggregation/checking route
with retained Lykn. Future packets explicitly include evidence tooling in that
workflow. This does not erase the deviation or invalidate otherwise reproduced
runtime observations. The full controlled guide/authoring evaluation remains
Arc02, where this attribution must survive.

CDC's audit had one source correction before running: an expression receiver
`((facts ...):get field)` was rejected with the compiler's bind-or-thread
diagnostic; it was replaced with a named binding. A property-length threading
mistake found during that inspection was also corrected. These are reviewer
authoring mistakes, not new compiler findings. Audit lint and execution pass;
unused-binding warnings are retained, and no aesthetic acceptance is claimed.

## Seven-row verdict and bubble-up

| Row | Status / strength | Basis |
| --- | --- | --- |
| J2-01 | done / reproduced | Fresh own-harness denial/scoped success and argv boundary |
| J2-02 | done / reproduced | 17 FM01 families, 161 IDs, complete frozen repeat counts; amendment preserved |
| J2-03 | done / reproduced | 220 native attempts; byte/value/error/file results and independent checks |
| J2-04 | done / reproduced | Identical remote graph, frozen lock, 86 package attempts and framing negatives |
| J2-05 | done / reproduced | Three controls, 48 stress attempts, four intended file stops; limits explicit |
| J2-06 | done / reproduced | Original/revised source, three reproduced findings, guide/book/human follow-up retained |
| J2-07 | done / reproduced | Full replay, retained independent audit/raw records, scope and bubble-up review |

Seven rows opened and closed; no deferrals/no-ops. Close Arc01 A-02 only;
arc/project composition remains open. Native precision/duplicate/presentation
loss, source-aware API availability, framing prefixes and interruption effects
are characterized for this condition; no library architecture is accepted.

**Plan change:** the originally monolithic YAML roadmap is split before its
opening into Slice03 preflight, Slice05 values, Slice06 resources/files and
Slice07 document fidelity. Existing Slice04 runtime/policy identity is preserved.
Run 03 → 05 → 06 → 04 → 07, with Slice04 resolving the Node-candidate route
before document execution. Arc composition checks the selected route against
the final document evidence. All Y-01–16 cases remain owned; Y-14 is never
silently discarded or permitted to use Node. Only Slice03 gets its detailed
open set now. This follows the observed authoring/context pressure and keeps
preparation separate from a large execution matrix.

## What worked

Final handoff checks: 170 project-local Markdown links resolve, status JSON
parses, all seven original criterion/verification/significance/origin fields
are unchanged, and every Y-01–16 family has an explicit owner. Exact scoped
staging and whitespace checks precede the CDC commit. Only planning and
disposable review directories were changed; concurrent release work is preserved.

Pinning emitted bytes allowed independent replay despite concurrent release
work. Negative controls and file snapshots exposed loss that successful exit
codes alone would hide. Lykn was sufficient for the independent evidence audit;
its own authoring mistake and compiler warnings stayed visible.
