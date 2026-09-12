# Findings and handoff — J2-F01

Same-author attestation, 2026-09-12. All discoveries remain open unless independently dispositioned elsewhere. The [results](results.md), [raw evidence](raw-transcript.txt), [bytes](byte-evidence.md) and [authoring history](authoring-observations.md) are the evidence homes; source version is explicitly pinned in [baseline](baseline-and-launch.md). No production source or book correction is part of this slice.

| Finding | Evidence and significance | Owner / re-entry |
| --- | --- | --- |
| D-2609-NZRO | cases attempt3 emits Object.is(value,0) from -0; threatens numeric boundary measurements. Final harness constructs negative zero from the original string | Open; proposed Arc03 compiler correction, with original source and sign-sensitive regression at a pinned compiler. No correction slice yet exists |
| D-2609-JSCF | Successful compilation emits return-while/try/throw and new-await in composed forms. Existing D-2608-W2HF is related but narrower | Open; proposed Arc03 compiler correction. Reduce retained cases attempt3 without altering observed failure, then test rejection or valid runtime code and both implementations as applicable |
| D-2609-UNUS | Final compiles warn that referenced bindings are unused; case stderr varies in warning order while stdout pairs match | Open; proposed Arc03 diagnostics correction; preserve source/reference evidence and reproduce before changing traversal. Root cause unresolved |
| D-2609-JSER, existing | J-09 BigInt top/object/array all TypeError; cycle also throws; other unsupported values have distinct omission/null/toJSON behavior | Existing book discrepancy receives runtime support. Arc02/Arc03 must check current book revision and original cited passage; no book closure inferred |
| Native JSON fidelity boundary | J-04 precision/lexical loss; J-06 duplicates disappear; J-07 absence differs from own undefined; J-08 exact keys preserved | Arc02 domain/ADT trials and Arc04 JSON design must carry these cases; no silent lossless claim |
| Package/framing boundary | JSONC rewrite loses comments; native order differs from canonical order; raw chunks are not records; J-15 BAD-frame errors occur downstream in JSON parser | Arc01/Slice04 adoption/runtime policy and later library contract; full framing validator not implemented here |
| Filesystem/resource boundary | Raw interruption truncates; safe sibling preserves original but leaves sibling on kill. Sampling observes resource behavior, not hard memory or durability guarantees | Slice04 R-06–08 retains concurrency, symlink, durability and resource-policy obligations |

The permanent register is [backlog/discoveries.md](../../../../backlog/discoveries.md). New compiler findings are registered as open, not routed: a named future correction owner is not an existing committed correction destination. Ancestor arc/project plans retain the findings and source-shape obligations. Existing LINT/NPMB/YNOD findings and YAML Y-14 gate remain unchanged.

No deferral of a J-family is requested. Unknown API availability became observed availability for this pinned runtime. All normal and stress cases executed; the broader policy, full authoring experiment, and operator judgments were already owned by later slices/arcs. CDC must still review coverage and these interpretation boundaries before formal closure.
