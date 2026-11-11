# AT-02 iteration01 intake and contract readback

Intake resumed 2026-11-10 19:05–19:58 America/Chicago (2026-11-11 01:05–01:58 UTC), before any extension edits. The initial answer/source at `de33d6bf8c57c2bf7e437a2dee4eba09236fdd1e` remain byte-frozen. The required-reading manifest is absent from the assigned slice and no manifest was substituted.

## Assignment and plan coverage

| Input | Revision/path | Read and use |
|---|---|---|
| Issued iteration | Planning `6bf865300c8e6027afaa41804cd00698950de222`; `slice01-json-value-and-decoder/cc-prompt-iteration01.md` | Complete. Original-first execution, allowed extension, evidence and commit rules. |
| Initial assignment | Planning at same HEAD; `cc-prompt.md` | Complete. Fixed AT-02 wording, pinned toolchain, no-run initial capture condition and scope. |
| Slice plan | Planning at same HEAD; `slice-plan.md` | Complete. Scope and stop boundary. |
| Slice ledger | Planning at same HEAD; `ledger.md` | Complete. JV-01–05 remain open; no row is accepted by this contributor. |
| Assessment | Planning at same HEAD; `artifacts/at02/assessment.md` | Complete. AT-02/L-01–04/L-06 populations and frozen assertions. |
| AE01 protocol | Planning at same HEAD; `arc01-format-runtime-evidence/slice01-baseline-and-protocol/artifacts/authoring-evaluation.md` | Complete through operator review and denominator sections. Used category definitions, fixed populations, opportunity scoring, no efficacy attribution from one trial, and pending human readability review. |
| Fixture matrix | Planning at same HEAD; `.../artifacts/fixture-matrix.md` | Complete L-01–04, L-06 and L-07 rows. Used fixed J-02/J-07/J-08 inputs and required evidence categories. |
| Planning instructions | Planning `AGENTS.md`; conversation `AGENTS.md` | Complete. Planning-only evidence, Lykn-authored research logic, exact-path `git commit --only`, both contiguous co-author trailers, persona framing. |

## Source, runtime and initial source

| Input | Verified identity |
|---|---|
| Source tree | `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`, branch `codex/completion-value-flow`, HEAD `685bbe1dbbfdaf34ecf49017c22e43f7dc8adb95`, clean. |
| Native CLI | `target/release/lykn`, SHA-256 `0cf695212c617b413f0d54fbfc1d0134da1361c33eba4bf627c13f9cb550e4a2`. |
| Deno | `/opt/homebrew/bin/deno`, 2.9.6 stable aarch64 Apple Darwin; SHA-256 `2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74`. |
| Planning checkout | `/Users/oubiwann/lab/lykn/lang/.worktrees/planning`, branch `planning`, HEAD `6bf865300c8e6027afaa41804cd00698950de222`. Clean at start; this intake and `artifacts/at02/scratch/` are the only new paths so far. |
| Initial response/source | Existing `artifacts/at02/initial/response.md` and `decoder.lykn`, committed at `de33d6bf8c57c2bf7e437a2dee4eba09236fdd1e`; scratch copy checked byte-equal with `cmp`. |

One initial pin command used an incorrect worktree prefix (`/Users/oubiwann/lab/lykn/.worktrees/contract-predicate-lowering`) and returned Git “cannot change to … No such file or directory.” The corrected canonical `/lang/.worktrees/contract-predicate-lowering` checks above succeeded. This lookup error did not change any tree or execution input.

## Required reference reads

All Lykn references below are from source branch `codex/completion-value-flow` at `685bbe1dbbfdaf34ecf49017c22e43f7dc8adb95`.

| Reference | Extent read in this resumed condition | Actual use |
|---|---|---|
| `skills/lykn/SKILL.md` | Relevant complete instruction and authoring/verification sections revisited; complete source had been loaded in the original intake at `de33d6bf`. | Surface syntax, ADTs, checks and permitted CLI forms. |
| `docs/guides/09-anti-patterns.md` | Entire remaining guide, lines 261–1117; initial receipt records lines 1–260. | Repaired the initial incomplete guide-read condition before corrections; used data-shape, immutability, surface-form, annotations and shadowing cautions. |
| `docs/guides/03-error-handling.md` | ID-02, ID-03, ID-09, ID-23, ID-29. | Expected decode failure as returned data; path-rich diagnostics; boundary validation and error ADTs. |
| `docs/guides/04-values-references.md` | ID-27. | Own-property presence for dynamic keys and missing versus present-undefined. |
| `docs/guides/05-type-discipline.md` | ID-06–08, ID-23 and ID-29–30. | Runtime checks for unknown values, arrays, integer bounds, undefined, boundary validation and assertion-strip behavior. |
| `docs/guides/15-lykn-cli.md` | Compile, fmt, check, run (including permission/lock options), lint and strip-assertions sections. | Direct command syntax and distinction between Lykn source lint and generated-JS lint. |
| Captured book `2-type.md`, `3-match.md` | Both complete captured files were reread. Their pinned provenance remains book `main` at `f55da0e86068ce1aa27581fe1199b68258e64f3f`; hashes remain those in initial `references.md`. | ADT construction and match exhaustiveness claim considered against actual runtime evidence. |
| ADT preflight | `expectations.md`, `results.md`, `probe.lykn`, and public fixture `project.json`, `deno.lock`, driver, outputs. | Separate prior control evidence; not substituted for the new decoder run. |

The initial `references.md` remains the exact record of the first author's narrower guide use. That first condition read only anti-patterns lines 1–260; the later full read is a distinct correction-condition reference use and does not retroactively erase the initial deviation.

## Command/readback

Executed identity/read commands: `git rev-parse`, `git status`, `shasum -a 256`, `deno --version`, and `command -v deno`. The original frozen decoder was copied to an owned scratch project with the preflight's minimal native `{}` config. `lykn check`, `lykn lint`, native default compile, and native `--strip-assertions` compile were attempted; raw stdout/stderr and status files are retained under `scratch/initial/`. Check and compile returned 1 with `unterminated list at 64:1`; lint returned 2 with `cannot lint (parse error): unterminated list at 64:1`. The source was not repaired. Runtime and public compilation are therefore skipped as specified for an unaccepted source.

Contract readback: original answer execution precedes all extension edits; the first answer remains frozen. The extension keeps `{ server: { port }, label? }`, distinguishes missing, `null`, empty and own-`undefined` label cases, treats `JUndefined` as outside JSON's six kinds, and explicitly rejects it in the strict JSON specimen. Expected decode failures must be values with exact paths. A raw boundary is required to inject an unsupported nested value while the main inputs remain those returned by `JSON:parse`. No claim is planned for arbitrary host objects, cycles, resource limits or lossless token fidelity. No Python or substitute handwritten logic, no new dependency, network access, source-worktree edit, generated-output repair, or public API decision is authorized. Parent independently confirmed the public fixture preflight; the public decoder path remains pending this contributor's accepted source.

Available model identification/settings are inherited Codex GPT-6 Luna High per the restart assignment; no additional runtime model metadata is exposed. Read extents and this readback were recorded before extension edits.

## 2026-11-10 replacement-context coverage correction

The preceding resumed-context read table was written before the coordinator's intake correction. Its statement that some source material had been loaded by the original author is inherited provenance, not evidence that this replacement context had read it. The original `initial/references.md` is not changed and remains the first author's receipt. The iteration01 original decoder commands and results above occurred before this correction, under the then-issued iteration01; they are preserved as required. No extension source was edited before completing this correction.

| Reference | Actual contiguous extent loaded in this replacement context | Use |
|---|---|---|
| Corrective assignment | Planning `52abf691`; `cc-prompt-iteration02.md`, complete file | Required full same-context reference intake before extension edits; all iteration01 obligations continue unchanged. |
| `skills/lykn/SKILL.md` | Complete 808 lines, recovered as contiguous reads 1–280, 281–560, 561–808. | Surface forms, types/matches, checks, CLI and toolchain boundaries. |
| `docs/guides/09-anti-patterns.md` | Complete 1–1117; contiguous reads 1–260 and 261–560, 561–860, 861–1117. | Corrects the inherited prior-initial read gap for this context; captures value handling, type checking, keys and anti-pattern enforcement. |
| `docs/guides/00-lykn-surface-forms.md` | Full assigned ranges, contiguous: Syntax Fundamentals 25–77; Bindings & Mutation 78–203; Functions 204–494; Types & Pattern Matching 495–652; Objects & Immutable Updates 653–740. | Data constructors, presence handling, function/match syntax and immutable updates. |
| `docs/guides/05-type-discipline.md` | ID-01–05 (18–207), ID-06–08 (208–277), ID-19 (503–522), ID-21 (537–563), ID-23 (586–601), ID-26–30 (638–754). | Type/contract boundaries, result ADTs, undefined/null, dynamic collections and stripping. |
| `docs/guides/06-functions-closures.md` | ID-01–02 (14–79), ID-11–13 (606–655), ID-20–24 (743–865), ID-28–29 (973–1033). | Function and callback types, array search/transforms, functional updates and side-effect boundary. |
| Iteration01 additions | `03-error-handling.md` ID-02/03/09/23/29; `04-values-references.md` ID-27; `05-type-discipline.md` ID-06–08/23/29–30; `15-lykn-cli.md` compile, fmt, check, run, lint and strip sections. | Complete reads in this context; details are listed in the earlier table. |
| Captured book snapshots | `artifacts/at02/references/2-type.md` and `3-match.md`, both complete. | Rechecked constructor validation and match promises against the executed control plan. |

This supersedes only the same-context coverage characterization for iteration01. It does not rewrite the initial author's narrower `references.md`, does not claim the first attempt used later reads, and does not alter any original response, source, stdout, stderr or exit status. The iteration02 coordinator receipt is at planning commit `52abf691`; execution remains bounded by iteration01 and adds no decoder feature.
