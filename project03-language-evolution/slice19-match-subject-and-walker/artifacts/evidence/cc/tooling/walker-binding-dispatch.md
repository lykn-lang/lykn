# Frozen EW-R3 source locator before Slice19 walker edit

The source under review is the accepted immutable
`b828c2a1b2f4d408508e5697d9a458f7b20538e9` tooling body. Its Git blob is
`20965b50ccd07f05b52a5506011219f592ac6330`; SHA256 is
`6976a853a9fea81bcf47e47d634fa5bcd568e9f3b72e6f36c4f58be2bd48d1c6`.

The inherited EW-R3 instruction in
`project03-language-evolution/slice17-estree-walker-capability/cc-prompt-iteration02.md`
requires: “Dispatch BindingRole through pattern handling including
Property.value; binding identifiers are not reads. AssignmentPattern visits
left binding/right evaluated but must not add an extra generic destructuring
reason (K04 is4, not5).”

The concrete path is:

- `visit-pattern` ObjectPattern calls `visit-list` for `properties` with
  `BindingRole` (source lines 274–277).
- `visit-list` forwards its typed `FieldRole` argument to `visit-node`
  (lines 220–236).
- The `visit-node` Property arm ignores its `role`; at lines 499–506 it visits
  `Property.value` with `ReferenceRole` unconditionally. Consequently K04's
  `ObjectPattern.properties[0]` leaves the binding path and its
  `AssignmentPattern` reaches the ordinary node dispatcher instead of
  `visit-pattern`.

At this record, the walker file remained byte-identical to the frozen b828
source. Only scanner and observer files had uncommitted edits; no walker edit
or dependent check had occurred.
