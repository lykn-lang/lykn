# Frozen initial AT-02 rule opportunities

Frozen after the authorized unchanged original run and before claim scoring. Population: the single initial AT-02 response/source captured in `de33d6bf`; this is a purposive task, not a guide-efficacy sample. A parse failure blocks runtime adjudication but does not erase authored omissions or unsupported claims.

| Opportunity | Source/response locator | Required witness | Initial evidence state |
|---|---|---|---|
| O1 six JSON kinds | `decoder.lykn:1-8`; `response.md` “Boundary” paragraph | null, bool, number, string, array and object represented; distinguish additional host-only undefined | Authored constructors, no native parse; execution blocked. |
| O2 expected failure ADTs | `decoder.lykn:22-29,41-51,53-80` | Expected path-bearing failures represented and actually returned | Authored branches; execution blocked. |
| O3 lower endpoint | `decoder.lykn:82-87` | Port 0 accepted | Authored example only; execution blocked. |
| O4 upper endpoint | `decoder.lykn:41-51`; response “What is checked” | Port 65535 accepted | Rule authored; no example; execution blocked. |
| O5 lower invalid bound | `decoder.lykn:47-51` | Negative integer rejected with path | Authored branch; no example; execution blocked. |
| O6 upper invalid bound | `decoder.lykn:47-51` | Integer above 65535 rejected with path | Authored branch; no example; execution blocked. |
| O7 fractional port | `decoder.lykn:47-51` | Fraction rejected with path | Authored `Number:isInteger` guard; execution blocked. |
| O8 non-number port | `decoder.lykn:99-104` | Nested boolean rejected as `server.port` | Authored demonstration; execution blocked. |
| O9 missing/null/empty label | `decoder.lykn:82-97`; response final paragraph | Three distinct results, including empty string | Authored witnesses; execution blocked. |
| O10 present false/zero label | `response.md` final paragraph; `decoder.lykn:53-62` | Both rejected rather than treated as absent | Authored claims, no input examples; execution blocked. |
| O11 own-undefined label | `response.md` boundary/last paragraph; `decoder.lykn:13-17,53-62` | Presence differs from missing; keep host value distinct from JSON | Authored `JUndefined` extension and claim; execution blocked. |
| O12 static/runtime/absent classification | `response.md` “What is checked where” | Claims align with actual compiler output and behavior | Authored claims, no compiler acceptance; execution blocked. |
| O13 nested wrong-value path | `decoder.lykn:69-80,99-104` | Failure identifies `server.port`, expected rather than throw | Authored example; execution blocked. |
| O14 native `JSON.parse` boundary and recursive validation | `response.md` boundary and absent bullets; `decoder.lykn:1-8` | Six parsed kinds, recursively checked array members, exact wrong path | Explicitly absent from initial answer. |
| O15 J-08 exact arbitrary keys/edit alias | No relevant initial source location | Full nine-key witness, safe presence, immutable nested edit and untouched sibling | Omitted from initial answer. |
| O16 compiler constructor/match controls | `decoder.lykn:1-29,41-80` | Valid/wrong constructors, forged/unrelated/missing tags, omitted/wildcard/nested matches, stripped behavior | No control matrix; execution blocked. |
| O17 guide/book use receipt | Initial `references.md` | Actual loaded extents, immutable pins and initial deviation preserved | Receipt exists; guide 09 initially only lines 1–260. |

Denominator for initial task completion remains 1 initial AT-02 task. Any completion count is 0/1 because syntax acceptance is an explicit necessary condition; executed runtime task count is 0/1 (blocked). Opportunity scores use authored evidence plus machine acceptance separately, so the parse error does not turn every explicit omission into a tool failure.
