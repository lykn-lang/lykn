---
project: project07-core-library-research
arc: arc02-lykn-authoring-evidence
slice: slice01-json-value-and-decoder
status: preparation
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
