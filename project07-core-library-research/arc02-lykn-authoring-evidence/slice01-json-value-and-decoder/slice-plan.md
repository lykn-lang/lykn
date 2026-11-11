---
project: project07-core-library-research
arc: arc02-lykn-authoring-evidence
slice: slice01-json-value-and-decoder
status: active
---

# JSON value and decoder

The [ADT preflight](artifacts/adt-preflight/results.md) ran nine
observations on the actual `685bbe1d` compiler. Use it to inform
validation design. Run the original AT-02 assignment from the
[evaluation protocol](../../arc01-format-runtime-evidence/slice01-baseline-and-protocol/artifacts/authoring-evaluation.md)
with a fresh authoring context, captured references, and the original
first-attempt and correction record.

Use a JSON-domain decoder as the practical test. Build six tagged
value cases from the native parse boundary. Validate recursive
members, carry a path to the wrong nested value, and preserve
arbitrary object keys as data. Use the original integer port bounds
and distinguish a missing label, explicit null, and the empty string.
Exercise a deliberate unmatched variant and constructor, annotation,
and forged-tag negatives. Record where checks actually occur and how
assertion stripping affects them. Compare native and public paths
where both routes accept the source.

Keep the original, formatted and corrected source, actual runtime
and emitted JavaScript, and relevant book/guide locators. Check
formatting idempotence and behavior. Present representative source
for operator review after technical evidence. The package API,
dependency and publication decisions belong to the later library
handoff.

## 2026-11-10 restart and assignment

Resume the authorized S01 trial in the established Autonomous Mode roles:
OpenAI Codex GPT-6 Luna High for CC, GPT-6.1 Sol High for independent
reproduction, with the main context coordinating. Reuse the clean
`codex/completion-value-flow` source worktree at `685bbe1d` as a read-only
input. The planning worktree is the sole durable write home. Source and
book worktrees, package licensing, and release and publication actions are
outside this assignment.

[Initial assignment](cc-prompt.md) captures one original AT-02 answer
before compiler feedback. The two book chapters were copied byte-for-byte
at the pinned book revision before capture. Keep the preflight and
[assessment population](artifacts/at02/assessment.md) out of the fresh
author's context until the original answer is committed. The independent
review checks both the first attempt and the completed matrix. User
readability feedback is recorded separately under the AE01 protocol.

The initial capture is `de33d6bf`. Current assignment
[iteration01](cc-prompt-iteration01.md) executes the retained answer and
completes the matrix. The initial reference receipt reports an incomplete
read of guide 09. Preserve that deviation in the initial condition and
complete the reading for the correction condition.
