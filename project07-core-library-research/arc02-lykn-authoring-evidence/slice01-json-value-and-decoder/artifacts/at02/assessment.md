# Frozen assessment for AT-02 and L-01–04

The first answer gets the original task once. Evaluate its claims and code
as they stand, including missing demonstrations. Later stages complete the
slice matrix as a separately marked extension. One trial cannot measure
guide accuracy or compare models. Use the AE01 rule-opportunity and issue
taxonomies, with exact source locators and observed outcomes.

| Population | Discriminating evidence |
| --- | --- |
| AT-02 initial task | Tagged JSON and decode result, legal port endpoints, distinguish missing/null/empty label, reject wrong nested value with path, classify actual static/runtime/absent checks. Score all criteria together for initial-task completion. |
| L-01 JSON domain | Native parse of all six J-02 top-level shapes and the full J-01 nested fixture. Record a recursive wrong-type case injected at an array member, since valid JSON text cannot encode undefined. Demonstrate the precise path and compare with a valid sibling. |
| L-02 configuration | Port 0 and 65535 accepted, -1, 65536, fraction, string, missing and null rejected. Label missing/null/empty/nonempty distinct where applicable, false/0/own-undefined checked as present wrong types. Include wrong/null/missing nested field on the declared input shape. |
| L-03 compiler controls | Valid scalar constructor, zero-field constant, wrong scalar, wrong outer array, wrong nested member, unrelated tagged annotation, missing tag, forged known tag, omitted arm, wildcard and nested match. Compare native default and stripped and public default. Check emitted JS against each conclusion. Public `lykn` exposes strict mode but no strip option. |
| L-04 exact keys and updates | Full J-08 key set, with both first-name and firstName and prototype-like keys intact. Include array/object nesting and mixed value tags. Edit one nested value by exact path, show before/after including original alias and an untouched sibling. No lexical fidelity claim. |
| L-06 formatter and assertions | Check and lint original and final sources. Format the completed candidate twice and compare exact bytes, emit and run each compiled condition. Compare behavior rather than assuming codegen byte identity when formatting changes. Observe valid and invalid inputs under native stripped; explicit boundary validation must survive stripping. |

Freeze the concrete variant IDs, inputs, expected observations and
opportunities for each scored rule before running each matrix. Distinguish
an authored omission from a claim contradicted by execution. Use the
pinned CLI in an isolated fixture with a real `project.json`. Reuse
the accepted public compiler fixture, pinned tree and frozen lock only
after initial capture. Use cached-only, no prompts and no runtime grants
except the driver's single input-file read. Preserve all command exits,
stdout, stderr, emitted bytes or lack thereof, and original source.
Use Lykn for authored logic and leave compiler/build inputs intact.

The recorded compiler preflight already demonstrates assertion
boundaries for simple inputs. The completed trial must exercise the new
decoder and distinguish explicit domain checks from generated shallow
guards. Runtime JSON host limitations established by Arc01 stay visible:
parse cannot recover duplicate entries or lost number lexemes, and an
ADT value edit makes no document-byte preservation promise.
