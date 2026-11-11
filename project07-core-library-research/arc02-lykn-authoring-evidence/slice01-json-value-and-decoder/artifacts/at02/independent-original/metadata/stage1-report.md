# Independent Stage 1: unchanged original AT-02

Original task outcome: **not complete**. The original initial file was independently extracted from de33d6bf8c57c2bf7e437a2dee4eba09236fdd1e unchanged (SHA-256 e5254ac8d685434372849f3c4359882ba49b0c6f6f9be7a892f88807485216d7). Planning/source repositories were read-only. No canonical planning files or Git state were changed. The source worktree is /Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering, branch codex/completion-value-flow, immutable commit 685bbe1dbbfdaf34ecf49017c22e43f7dc8adb95 throughout this review.

## Raw observations

All paths below are relative to /private/tmp/lykn-at02-cdc-original.Hycvxeck. Exact common environment, cwd and argv are in metadata/launches.txt. Source/CLI hashes are in metadata/inputs.sha256. Original source is case/decoder.lykn. Each executed cell retains stdout.raw, stderr.raw and exit-status.txt; each skipped runtime has skip.md.

| Cell | Exit | Observation |
| --- | --- | --- |
| check | 1 | decoder.lykn: error: unterminated list at 64:1 |
| lint | 2 | decoder.lykn: cannot lint (parse error): unterminated list at 64:1; this is NOT a clean lint or a style-finding count |
| compile-default | 1 | unterminated list at 64:1; no emitted output |
| compile-stripped | 1 | same; no emitted output |
| run-default | unrun | compile rejection, explicit skip |
| run-stripped | unrun | compile rejection, explicit skip |
| public-driver-compile | 0 | unchanged retained compile-probe.lykn compiled natively |
| public-compile | 0 | public lykn(source) accepts the exact malformed source and emits JavaScript |
| public-run | 0 | zero-byte stdout AND stderr; none of the four original demo observations occurs |

Public source was copied byte-for-byte as public/probe.lykn for the retained driver. packages/lang was exported independently with git archive from the source pin. The preflight project.json, deno.lock and compile-probe.lykn were copied unchanged. Public compile used --cached-only --frozen --no-prompt --allow-read=probe.lykn and public runtime used --cached-only --frozen --no-prompt with no grants. DENO_DIR=/Users/oubiwann/Library/Caches/deno. No dependency fetch or output repair occurred. Public generated output is retained unchanged as public-compile/stdout.raw and identical public/target/public-output.js.

The public emitter puts the four demo calls inside decodeConfig, after its match. No top-level call invokes that function. Empty successful runtime therefore proves neither any positive decoder result nor the required wrong-value rejection. Public emitted output additionally contains unbound n/text/serverEntries in nested-pattern code and constructor functions for parenthesized zero-field variants; those emitted observations are retained, but this unchanged-original run does not reach them and supplies no runtime verdict on them.

## Findings and attribution

1. AT02-I01 — correctness-grade authored syntax failure. Original decoder.lykn:64-104 leaves the decode-config list unterminated. Native check and both compiles reject it at 64:1. The original response.md:13 and :21 claim demonstrations that cannot execute natively. Primary taxonomy: agent noncompliance with the initial prompt's runnable-source delivery requirement; this is not a guide omission or a compiler defect in the native rejection. Corrective work must remain a separate attempt. No repair or original-source rewrite was made here.

2. AT02-I02 — correctness-grade public reader defect. packages/lang/reader.js:166-221 at 685bbe1d permits readList to reach EOF and returns a list; line 210 advances only when input remains and never requires the close delimiter. Native rejects exact initial input; public lykn accepts it and changes original demo placement into an uncalled function. Primary taxonomy: implementation defect. Source-only conclusion is backed by the actual pinned public compile/runtime, not inferred from documentation alone.

3. AT02-I03 — serious static/runtime guidance ambiguity and misleading answer classification. Original response.md:17 places function parameters, return annotations and ADT constructor fields under static/compile-time checks. guide05 ID-02:67-68 promises compile-time return checking, while :90-93 says an inserted check catches wrong return values; guide05:3-11 and :41-57 describe runtime checking. A separate coordinator-authorized witness, classification/typed-return.lykn:4-7, deliberately returns the literal string "wrong" with :returns :number. Both native compiles exit 0. Default generated JS:2-5 checks the return at runtime; default run exits 1 with TypeError. Stripped JS has no check and runtime exits 0 printing wrong. Primary taxonomy: ambiguity for the conflicting guide statements, with a demonstrably misleading classification in the answer. No claim is made that every literal mismatch is accepted: typed bindings may have different static checks. This witness is separate from the original decoder and does not rescue its failure.

4. AT02-I04 — polish rule violation. Original decoder.lykn:37-39 uses if as the returned expression in lookup. The actually supplied Lykn skill:599 calls ? in expression position a hard LLM rule. Public emitted JS returns a ternary here, confirming expression context. Primary taxonomy: agent noncompliance; 0/1 frozen opportunities adheres to this specific style rule. It is not the syntax failure's cause.

5. AT02-I05 — serious initial-condition reference deviation. Initial references.md:34 explicitly records guide09 lines1-260 only and says the rest was not needed, although cc-prompt.md assigns the whole guide and says to recover truncation. Later guide09 sections were therefore supplied but unread; not unavailable and not a guide omission. Primary taxonomy: agent noncompliance. This is a condition-fidelity issue, not evidence that omitted reading caused any particular source defect. Skill-read receipt also reports truncation and excerpt recovery; its complete-file read cannot be independently certified from that receipt alone.

These are five distinct provisional Stage1 issue records by primary taxonomy: 3 agent noncompliance, 1 implementation defect, 1 ambiguity / 5 adjudicated observations. The latter two concern the tool/reference surfaces, not new initial authoring failures. Keep any correction recurrences separate. The detailed canonical record can refine IDs and ownership during the later handoff without erasing this observation packet.

## Frozen denominators and limits

Original demonstrated outputs: 0/4 verified against expected outputs. Native executions 0/2 (both blocked by source rejection); public runtime 1/1 executed, with 0/4 expected observations. Original task completion 0/1 executed authoring tasks; overall fixed population remains 0/5 currently completed, with four other tasks unrun here. Do not convert this into a guide-accuracy percentage or model comparison.

Rule opportunities frozen before execution in metadata/pre-execution.md: typed function boundaries 5/5 syntactically annotated; strict surface equality forms 2/2; expression-conditional style 0/1. Native lint was blocked, so no mechanical lint-clean claim follows. First-attempt confirmed guide-rule violation incidence is 1/1 authored task reviewed, with the incomplete-guide condition disclosed. Initial capture and all four demos remain attached to correction work unchanged.

Initial reference receipts name 9 required input files: 8 reported fully loaded plus 1 partially loaded guide09, 0 unavailable; report this as receipt-based, not an independent confirmation of all text consumption. Guide09 is 1-260 actually reported, rather than 1 whole guide loaded. User operator review remains pending, with 0 samples reviewed here. No human readability or language-direction acceptance is supplied.

The input boundary is explicitly hand-built JsonValue ADTs; omission of JSON.parse, full recursive validation, exact J-08 key/update witnesses and expanded matrix controls is openly described or belongs to the later extension. Their absence does not become a fabricated initial promise. Initial JUndefined acceptance is a declared host-value policy distinct from six-kind JSON, and later strict-JSON correction must preserve that policy change in its record.

No original runtime behavior beyond public no-output success is established. No formatting or repair occurred. No source/public package implementation changes, license/publication decisions, network actions, Git mutations or canonical planning writes occurred. The replacement-CC reference continuity correction reported by the coordinator belongs to subsequent iteration review; it is not evidence from this original trial and is not adjudicated in this Stage1 record.
