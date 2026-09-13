# YAML value findings — YV-F01

These are same-author observations under the pinned condition, awaiting CDC.
[Results](results.md) retain every case's typed facts and ordered warnings;
[byte audit](byte-audit.md) retains original/no-op/output hashes and complete
positional differences. An equal represented round trip can conceal losses
already incurred by parsing. No dependency choice follows automatically.

## Value and representation boundaries

- Y-02: all 110 implicit scalar variants parsed. All quoted variants remained
  strings. The failsafe empty value became null, then its no-op serialization
  failed with TypeError. Thus even one schema's accepted input domain and
  serializable value domain differ. Schema labels alone are not fidelity policy.
- Y-03: 17 of 50 explicit-tag variants completed and 33 were rejected at parse.
  `!!int "12"` was rejected in all five schema conditions. Timestamp and binary
  succeeded in default/extended; binary yielded bytes 4869 and remains an
  explicitly unstable package feature. `!!js/regexp` succeeded only in extended.
  The top-level extended `!!js/undefined ~` returned null, whereas Y-12's own
  undefined property survived extended serialization and reparse. The published
  parse.ts returns `document ?? null`, consistent with that top-level collapse.
  No blanket tag-support or semantic-fidelity promise is justified.
- Y-04: default duplicate rejection and explicit last-wins behavior were observed.
  Numeric key 1 and quoted string key "1" collided: rejection without permission,
  string value retained when duplicates were allowed. A mapping key became the
  string `[object Object]`; original YAML domains remain in the manifest.
  Represented JavaScript own keys cannot recover the original key domain.
- Y-05/Y-06: alias identity and propagation of a.x=9 to b.x were observed, and
  alias/cycle serialization and reparse succeeded. Anchors were renamed to ref_0
  and flow layout changed. Reparse identity is evidence for these small graphs,
  not document preservation or resource safety. Unresolved aliases were rejected.
- Y-07: default merge produced item.x=1 and item.y=3; rewriting expanded the merge
  into ordinary properties and removed its anchor/merge presentation. All five
  schema results are retained separately; schema-independent merging is not assumed.
- Y-08: parseAll preserved document order and the empty middle document. It rejected
  an invalid later document, retaining its warning and error. The single-document
  parser rejected all three multi-document inputs. Serializing the returned array
  is an array-valued document, not an original stream-preservation workflow.

## Files, diagnostics and source bytes

Y-01 used actual file-first parsing and changed only n from 1 to 2 in the checked
value tree. It completed sibling write, sync/close, replacement and reread. Y-09's
malformed-flow and bad-indentation inputs left ORIGINAL+LF untouched. Duplicate
anchors were accepted (a=1, b=2, c=2), as was the tab fixture: the latter became
separate a=null and b=1 properties, and both accepted cases replaced the destination.
These are exact observed dispositions, not a claim of conformance to a broader
YAML grammar. Strict application validation needs a separately chosen policy.

The tab result contradicted an audit-author assumption, not the frozen matrix's
characterization question. Its failed audit remains in the packet. No destination
preservation check was relaxed for rejected parses. Four warning events across
final attempts (Y-08 invalid parseAll and Y-09 malformed, twice each) retain name,
message, stage, line, column, offset and snippet in sequence, including warnings
preceding errors. A rejected document is never reported as a partial all-success.

Y-10 loses title/inline comments, the blank line, scalar quoting and 01 spelling;
flow sequence layout becomes block layout. Y-11 separates semantic content from
source trivia: literal `one\n\n` and folded `one two` survive as values while
presentation, directive/BOM, CRLF and final-LF choices change. Every original,
no-op and applicable output is independently byte-compared. Slice07 still owns
actual document-fidelity work behind Slice04's compatible-route gate.

## Numeric, presence and runtime-value boundaries

Y-12 default parsing converts original 9007199254740993 to 9007199254740992,
1e400 to Infinity, 1e-400 to 0 and original -0 to positive 0. The original lexemes
remain independent evidence; they are never reconstructed from rounded Numbers.
The signed-zero inspector control correctly distinguishes a constructed negative
zero, so the observed YAML sign loss is separate from known Lykn literal NZRO.
False, zero and empty-string defaults survive; absent, null and own undefined
are distinct before rewriting. All nine exact dynamic keys survive the declared
add-10 edit and reparse, with the object's prototype unchanged by the edit.

| Constructed Y-15 kind | skipInvalid false | skipInvalid true | Fidelity classification |
| --- | --- | --- | --- |
| Date at UTC midnight | Timestamp serialized/reparsed | Same | Accepted for this instant |
| Map with string/numeric 1 keys | `{}` plus LF | Same | Coerced to empty object; entries dropped |
| Set with numeric/string 1 values | `{}` plus LF | Same | Coerced to empty object; members dropped |
| Top-level undefined | TypeError | Empty output, reparses null | Rejected versus dropped/coerced |
| Function returning 1 | TypeError | Empty output, reparses null | Rejected versus dropped/coerced |
| Own self-cycle | Anchor/reference output | Same | Accepted small graph; identity retained |

The accepted-value status must not be used as a lossless-domain contract. Full
family tables and raw events expose these distinctions rather than counting
all successful process exits as faithful results.

## Authoring and remaining owners

Known D-2609-JSCF recurred in the audit's while-body conditional forms despite
successful source gates; explicit ternaries produced valid emitted output.
D-2609-UNUS warnings recur for visibly used helpers. D-2609-NZRO, LINT/NPMB/JSER
and YNOD remain in their established records; this slice makes no source repair
or closure claim. The warning-capture omission was this harness author's mistake:
Error.message is not supplied by enumerable-property inspection. A complete new
518-attempt confirmation corrected it; old/new comparison checks every prior
value/error/byte/file fact, allowing only the added warning fields.

These findings are retained research boundaries, not newly adjudicated violations
of an accepted library contract. No new permanent discovery is asserted. Arc02
must carry the exact source forms and operator readability review; Arc03 owns
accepted compiler/guide/book corrections. Slice06 retains all 62 resource/file
variants, Slice04 runtime/provenance/concurrency policy, and Slice07 all 28 gated
document variants. No resource recipe or @eemeli runtime was executed here.
