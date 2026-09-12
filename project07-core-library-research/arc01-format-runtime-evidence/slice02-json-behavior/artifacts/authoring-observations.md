# Authoring observations — J2-A01

This is one exploratory authoring task producing two retained Lykn programs, not the full AE01/AT-01–05 experiment. Task: execute every FM01 J-01–17 variant under RP01 using the pinned Lykn launcher. Original prompt remains [cc-prompt.md](../cc-prompt.md). Model: Codex/GPT-6 as identified by session; exact backend build, sampling settings and token budget unavailable. Operator supplied authorization to use installed rust-guidelines in the earlier launcher correction; no Rust was authored in this slice. No operator has reviewed these source shapes for elegance; disposition **pending**.

## Reference log

Order: project governance/open sets and prior evidence → methodology and task-relevant source guides → pinned candidate APIs → generated output and actual runtime records. No claim of independently randomized ordering. Source guidance is from `release/0.6.x` at `d0bb981dae2a4abf6c984406c4b2081a45cc92f8`; this explicitly qualifies cross-branch paths, rather than linking an uncommitted sibling as authority.

| References actually used | Scope / purpose |
| --- | --- |
| planning AGENTS.md; Project07 project/arc/slice plans and ledgers; slice cc-prompt.md | Ownership, exact source fence, full matrix and commit/CDC contract |
| Arc01/Slice01 CDC, artifacts/baseline.md (B01), research-protocol.md (RP01), fixture-matrix.md (FM01), authoring-evaluation.md (AE01), source-register.md; Arc03/Slice01 CDC | Frozen prerequisites, all families, permission build receipt, evidence fields and later authoring evaluation boundary |
| Installed collaboration-framework, project-management SKILL; project-management guides README,02,04,05 | Expedited planning ownership, row walks and bubble-ups |
| Installed work-verification SKILL and guides01–05; scientific-methods SKILL and guides, especially06/08; testing | Attestation versus independent reproduction, bounded measurement, failure preservation and meaningful verification |
| Source assets/ai/SKILL.md, opening workflow/interop and anti-pattern references | Lykn CLI-only workflow, typed arguments, source forms, no generated-output repair |
| Source docs/guides/00-lykn-surface-forms.md modules/dynamic imports and control forms; 01-core-principles.md; 02-api-design.md opening; 03-error-handling.md opening | Explicit interop boundaries, statement/expression and async/error forms |
| Source docs/guides/07-async-programming.md opening; 09-anti-patterns.md; 10-project-structure.md opening | Await/catch/finally, immutable bindings/cells, disposable single-root configuration |
| Source guides15/12-01 launcher guidance from preceding correction; exact CLI help and Deno cache/info help | Verified launch syntax, permitted infrastructure cache route |
| @std/json1.1.0 deno.json, parse_stream.ts, concatenated_json_parse_stream.ts, stringify_stream.ts, canonicalize.ts; @std/jsonc1.0.2 parse.ts; @std/streams metadata and resolved1.1.2 text-line-stream | Pinned exports, framing, transitive edges, canonical bytes; actual execution establishes behavior separately |
| Local `deno types` Deno.Command/ChildProcess interface | Cleared environment, pipes, process status and external observation |
| backlog README and existing discoveries; MEMORY.md ownership reminder checked against live git worktree list | Preserve permanent IDs and avoid stale/source ownership assumptions |

Official package sources retrieved 2026-09-12 from `https://jsr.io/@std/<package>/<version>/<file>`; exact resolved module URLs appear in dependency-graph.txt. Browser fetch rejected those raw URLs as unsafe to open; authorized curl retrieval and Deno cache succeeded. That tool routing failure is not evidence against package availability. Downloaded source snapshots/hashes are retained in raw-transcript.txt. No Deno program was launched directly: Deno cache/info/types are infrastructure inspection only.

## Attempts and attribution

The transcript contains full initial/revised sources under named SOURCE markers, original inputs before amendment, compiled output, and separate check/lint/compile statuses. Authoring was not a controlled comparison: several source forms changed together and the author had seen prior failures.

| Stage | Observation | Attribution and disposition |
| --- | --- | --- |
| cases attempt1→2, before first compile | Bound expression receivers and explicit increment callbacks; reviewed optional reviver context | Agent self-correction, not compiler or guide failure evidence |
| cases attempt2 | Extra closing parenthesis at99:78; check1/lint2/compile1 | Agent syntax error; removed extra parentheses at two locations in attempt3 |
| fixture amendment J2-M01.1 | Escaped-quote fixture was double-escaped while authoring manifest | Agent fixture error; original bytes retained and corrected before any format execution; not silently accepted malformed substitute |
| cases attempt3 | Check/lint/compile all 0, but emitted return-while, return-try, return-throw and new-await forms; no format run interpreted | Generated-output defect evidence. Statement/expression composition must emit valid code or reject. Related prior D-2608-W2HF; broader shapes recorded D-2609-JSCF. No root-cause equivalence asserted |
| cases attempt3 | Lykn literal -0 became JS0 inside Object.is(value,0) | D-2609-NZRO: wrong observation would mask/flip sign detection. Retained source/emitted bytes establish code generation, not full compiler-path diagnosis |
| attempt3 inspection | swap! passed conj as function, though conj is a macro; inspector :number rejects NaN by contract | Agent misuse; wrapped conj in append-item function and used explicit :any observation boundary. Do not blame guidance for enforcing its documented contract |
| cases attempt4 | Statement dispatch, bound dynamic constructor, reader cursor loop, explicit negative-zero construction from string | Final source checked/linted/compiled; all 354 format attempts use this one source hash. Revised several factors; not evidence of a compiler repair |
| supervisor attempt1 | Extra closing parenthesis173:95; check1/lint2/compile1. Inspection also found await in synchronous callback | Agent syntax/async authoring error; corrected before runtime |
| supervisor revision1 | All three source gates0; exact expected control reasons checked | Final source retained; no generated JS repair |
| supervisor initial launch | Host sandbox refused ps with OS error1; no completed control record | Environment/tool boundary. Host observation rerun authorized, same application scopes. All three controls then passed before any format case |
| all successful compiles | Unused-binding warnings include referenced CLI/encoder/dispatch arguments; warning order varies | D-2609-UNUS. Candidate diagnostic-analysis defect; leave warnings intact, do not add underscore workarounds |

Correction budget: three failed code-validation/inspection rounds corrected (cases parse, cases emitted output, supervisor parse/async). Including the pre-compile source cleanup and fixture amendment gives five authoring interventions. No format-result-driven correction occurred and no sixth correction was attempted. Sandbox retry changed execution permission at the host boundary, not source or expected invariants. The task occupied more than one context; retrospective note for future openings: separate harness preflight from matrix execution to preserve headroom. No family was removed or deferred here.

## Representative source shapes for later operator review

Successful dynamic-key edit, retained in cases.lykn:

```lisp
(bind edited (Object:from-entries
  (-> (Object:keys value)
    (:map (fn (:string key) #a(key (+ (get value key) 10)))))))
```

Before/after negative-zero observer:

```lisp
;; Original emitted Object.is(value, 0), losing intended sign comparison.
(? (Object:is value -0) "-0" (String value))
;; Final research-only spelling; compiler remains unchanged.
(? (Object:is value (Number "-0")) "-0" (String value))
```

The final supervisor uses cells for changing cursor/state, named async functions for pipe collection and process watching, and explicit narrow Deno.Command capabilities. Its substantial boilerplate is available for qualitative review; successful execution supplies no aesthetic score. :any is restricted to JS/JSON/stream observation interfaces and is not a proof of recursive ADT validation. Full tagged ADTs, Result/Option/domain decoding, two-module behavior, formatter parity and human review remain Arc02 L-01–08/AE01. Book J-09 evidence joins D-2609-JSER; it does not repair the book or rerun every book example.

Raw-log aggregation and byte arithmetic used Python as artifact tooling, not a replacement JSON implementation: it decoded tagged observation transport, counted records, compared bytes/hashes and aggregated host measurements. All research runtime behavior, including fixture materialization, parser/serializer calls, streams and supervision, ran from retained Lykn through the selected CLI.
