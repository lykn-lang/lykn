# Authoring evaluation AE01

Prepared 2026-09-12; evaluation design only. No authoring trial, defect frequency,
operator rating or acceptance is claimed by this artifact. A02 owns the trials;
A03 owns accepted corrections; Arc04 must carry unresolved findings into library
handoff. See [matrix L-01–09](fixture-matrix.md), [B01](baseline.md), and
[RP01](research-protocol.md).

## Retained tasks and sampling frame

Use this fixed, purposive sample of five tasks, one initial attempt each before
corrections. It covers relevant boundary shapes; it is not a random sample of
all Lykn programming. Copy each task verbatim into its run packet. Archive the
full initial response and `.lykn` files before feedback or repair. Preserve
fixture variants and all later task revisions as separate attempts.

| Task ID | Original task text | Fixed input/reference anchors |
| --- | --- | --- |
| AT-01 | “Write a Lykn function that reads a JSON file, increments n, and writes the result to a separate file. Preserve all other values and exact object-key strings. Report malformed input and missing files without replacing an existing destination. Show the original and formatted source.” | J-01/03/08/17; guide 00 bindings/member access, guide 03 errors, guide 07 async, guide 14 file APIs; book chapter25/2-json |
| AT-02 | “Model decoded JSON values and expected decode failures with Lykn ADTs. Decode a config with an integer port from 0 through 65535 and an optional label. Distinguish a missing label, explicit null, and an empty string. Demonstrate rejection of a wrong nested value and state which checks are static, runtime, or absent.” | J-07; L-01–04; guide 05 ID-01–05/19/21/26–30; book chapter10/2-type and 3-match |
| AT-03 | “Read a YAML configuration, change n to 2, write a new file, and explain every other changed byte. Show a no-op rewrite first. State the schema and preserve original comments, anchor syntax, scalar spelling, and line endings in the evidence even if the chosen API cannot retain them.” | Y-01/02/05/10/11; same source guides; pinned std/yaml 1.2.0; Y-14 only after policy gate |
| AT-04 | “Split the decoder and caller into two Lykn modules. Export the public interface visibly, handle an asynchronous read failure with an explicit result, and demonstrate that imported constructors and match work across the module boundary. Keep generated files separate.” | L-02/03/05; guide 00 modules/type, skill Modules, guide 10 structure (must load before trial), guide 03/07; book chapter16/2-import and chapter17/3-async-await |
| AT-05 | “Review the pinned book JSON, type and match examples against the pinned Lykn guides and actual compiler output. Retain each original snippet and locator, reproduce discrepancies, and propose corrections. Present representative source to the operator for comments on readability and preferred forms.” | Book locators below; L-03/06/07/08; execute snippets only after completing missing context/imports in an explicitly labeled harness |

Before beginning, capture the exact book snippets as well as the task; do not
quietly repair them during extraction. A snippet requiring undeclared variables
or imports needs a separate, visible harness. “The standalone excerpt lacks
context” and “the documented form is wrong” are different findings.

## Source and reference-use packet

B01 selects source `release/0.6.x` commit
`8c66469ba8f290a4bba993157b68a9e0d7716f0d`, and book `main` commit
`6aa379d1534b3cf680bc5a0eb5c344c99f975c16` in the separate cnbbooks/lykn
repository. Re-pin any changed condition openly. Book locators:

- `src/part5/chapter25/2-json.md`: JSON parsing, serialization, Result example,
  reviver and data-convention claims; line 44 has the serialization finding.
- `src/part2/chapter10/2-type.md`: constructors, zero-field values, field checks.
- `src/part2/chapter10/3-match.md`: exhaustiveness wording, emitted examples.
- `src/part3/chapter16/2-import.md`: imported-name/module expectations.
- `src/part3/chapter17/3-async-await.md` and `4-error-handling.md`: async and
  rejection behavior. These are **trial reference targets**, not a claim that
  Slice01 fully read them.

For each reference record path or URL, repository, branch, immutable commit or
package version, SHA where needed, section/line/fence ordinal, read timestamp,
reason, and whether the run actually used it. Mark supplied-but-unread references
separately. Record guide/tool calls as they occur, not reconstructed from the
final code. Installed skills, memory, previous conversations and unplanned
searches are additional references and potential contamination, even if helpful.

Start actual Lykn authoring with the repository SKILL and guide 09, then load
topic guides selected by that task. All reference files must resolve on their
source branch. AT-04 additionally loads guides 01/02/10 for module design;
AT-02 additionally loads guide 06 for function/type boundaries. No invented
Lykn generic syntax or unverified prelude helpers. Current project no-Node/no-npm
and no-generated-output-repair instructions govern despite conflicting older
guide passages; log the conflict rather than follow it silently.

## Outcome capture and attribution

Retain initial generated source, compilation output, check/lint/format logs,
runtime results (when authorized), correction diffs and final result. Machine
success includes the task's negative cases and exact data/key requirements.
Passing a happy case or a syntax check alone is insufficient.

Each finding record contains: issue ID, task/run/attempt, exact offending source,
claimed rule and locator, observed failure, minimal reproduction, severity,
alternative explanations, taxonomy, correction, retest and disposition.

| Attribution | Required evidence | Avoid this misclassification |
| --- | --- | --- |
| Guide error | Specific guide claim contradicts primary spec or reproduced intended behavior; locate both | Do not blame a guide because a run ignored its correct instruction |
| Ambiguity | Two plausible readings/conflicting passages, with the actual interpretation recorded | No proof of implementation defect from vague wording alone |
| Omission | Task requires a choice the defined reference set does not address; record searched scope | “I did not read it” is not omission |
| Agent noncompliance | Applicable correct instruction was available/loaded, but generated code violated it | Distinguish unavailable or contradictory instruction from disregard |
| Implementation defect | Reproducible behavior contradicts the accepted language/tool contract at an identified revision | A desired future feature is not automatically a defect |
| Unresolved cause | Evidence cannot distinguish categories, including source/binary drift or missing snippet context | Never force every failure into a causal label |

Book content uses the same claim-level taxonomy with `source_kind: book`;
it is not silently counted as an LLM guide. More than one contributing cause
may be recorded, but one primary category per issue is used for category counts.
Severity: correctness-grade (wrong data/output/permission behavior), serious
(material usability or misleading guarantee), polish (localized presentation
without behavioral effect). These are working judgments with evidence, not
operator aesthetic scores. An unchanged original reproduction remains attached
to every later correction.

## Denominators, declared before results

Report raw fractions with the actual denominator, never a free-standing rate:

- Initial task completion: number satisfying **all declared criteria / 5**
  assigned tasks, with blocked and unsupported counts separately listed.
  Also show successful / executed tasks; do not hide blocked work by changing
  only the denominator.
- First-attempt guide violation incidence: tasks with ≥1 confirmed violation /
  tasks actually authored under the specified guide condition. Multiple defects
  in one task do not increase the task numerator.
- Rule-specific adherence: compliant opportunities / all pre-enumerated applicable
  opportunities for that rule, attached to source locations. Freeze the
  opportunity list before scoring; new opportunities receive an amendment.
- Attribution distribution: unique confirmed issues by primary category / total
  adjudicated issues; unresolved issues reported as their own count. Recurrences
  and repeated attempts have separate counters, not new root defects.
- Correction success: original failures now resolved / original failures retested;
  relevant regression failures / predeclared regression cases executed.
- Reference use: actually loaded required references / task-required references;
  unread, unavailable and extra references separately counted.
- Human review coverage: samples explicitly reviewed / samples presented.
  Requested revisions implemented / explicitly requested revisions, with pending
  requests retained. This does not substitute for operator acceptance.

No numerical findings exist yet. Do not infer guide “accuracy percentage,”
model capability, or population failure rates from these five purposive tasks.
Track compilation/runtime errors, manual interventions and correction attempts
as effort observations, not synonyms for poor code quality.

## Controlled corrections and comparison

For a guide-only comparison, hold task text, input bytes, compiler/runtime,
package versions, allowed tools/permissions, output format, evaluation rubric,
model/reasoning settings (where known) and stop rules fixed; vary only the
specified guide revision. Use independent fresh sessions without the other
condition's outputs, previous corrections or remembered conclusions. The
executing run must disclose unavoidable injected instructions/memory.
Alternate A/B order over tasks if possible and record actual order. Do not
instruct a run that the revised guide is expected to win.

For a compiler-only change, preserve original Lykn source and guides and compare
emitted output plus successful/invalid behavior. For formatter change, retain
byte diffs and rerun behavior, not just formatting idempotence. For book change,
preserve the original snippet and verify the corrected snippet against both
compilers when applicable. A combined guide/compiler/book update is a bundle
comparison; do not assign improvement to one component without further trials.
Record unknown model identifiers/settings as unavailable. A changed model,
context, toolchain or evaluator is a disclosed confound, not “same conditions.”

## Operator review record

For AT-01–04 present the original and corrected Lykn source side by side, with
task/input identity and separate machine outcome. Show emitted JS only when it
helps explain a form; keep source readability central. Ask about concrete forms:
ADT/error shape, nesting, collection updates, names, imports and whether the
operator would enjoy maintaining this code. Do not lead with a claim of elegance.

Retain verbatim comments, liked/disliked snippets with line locators, requested
changes, revised source hash and explicit disposition (accepted, rejected,
revise, pending). Keep “correct output,” “preferred code,” and “accepted language
direction” as separate fields. No response means **pending**. The assistant may
propose a readability interpretation but cannot supply a human rating.

At A02 close, reconcile every observation against the discovery register and
real correction destinations. A03 must retest original defects and get renewed
human review where requested. Coordinate book corrections with the existing
[Project02 Book arc](../../../../project02-language-toolchain-alignment/arc16-book-0.6.0-edition/arc-plan.md),
without changing its scope or acceptance status here.
