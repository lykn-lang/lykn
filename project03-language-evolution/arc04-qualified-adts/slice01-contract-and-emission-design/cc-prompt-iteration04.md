# S01 iteration04 — narrow declaration and source-idiom correction

Correct candidate 28f540d4 using independent review 0ee6496e, RV-14/15 only.
Luna 6 High CC and separate Sol 6.1 High review continue. Source stays
read-only at 685bbe1dbbfdaf34ecf49017c22e43f7dc8adb95. No execution.

Required-full: this prompt, current slice plan/ledger and planning AGENTS.md.
Required-section: cdc-verification.md's iteration03 review and RV-14/15;
contract's barrel declaration sketch and its nominal-alias explanation;
protocol's complete C5 observer and expected output; source
skills/lykn/SKILL.md :599 and guide00 `if / ?` section :911–946. Root read
these actual rules. Record actual read extents and a brief contract readback
in the existing closing report. Prior architectural decisions, all six
consumers/24 cells, runtime observation counts and source pins remain binding.

1. Remove the redundant `export type Renamed = import("./label.js").Label;`
   from the barrel DTS sketch. The following single selective reexport of
   merged Label as Renamed already carries its type and runtime value while
   retaining the original brand. Keep token/case ABI aliases and surrounding
   explanation coherent. Do not rebuild the nominal type or invent a new
   declaration key. This makes the sketch unambiguous without TypeScript
   execution; actual type-consumer validation remains a later source gate.

2. Change exactly the five observer bind-value conditional forms from `if`
   to `?`, preserving conditions, true/false arms, descriptor short-circuit
   behavior and exact output. Source guide treats these as semantically
   equivalent, but the Lykn skill requires ? in LLM-authored value position.
   The final top-level conditional that performs observation is a statement
   and keeps `if`. Do not claim a runtime bug was reproduced. This corrects
   the coordinator's earlier if-shaped advice as well as the draft.

Keep supported RV-01–13 decisions/oracles unchanged. Append a labelled
iteration04 return to closing-report.md with the two fixes, actual source/
assignment identity, changed paths, unrun gates and five-row proposed status.
Inspect the actual diff for semantic drift and Markdown whitespace. No new
validators, prototypes, compiler/type/parser/runtime/bundle/gzip runs or
artifacts. Write only the two existing artifacts and closing-report.md.
All authored research/helper logic must be Lykn: no Python execution/parity
exception, Ruby, Fennel, handwritten JS/Node helper, substitute scripting,
new Node/npm input, generated-output repair, network/acquisition, source
changes, merge/push/publication. Native read-only commands/Git and simple
file lifecycle only. Commit --only those three paths with both contiguous
AGENTS trailers. Return exact commit and Git ownership. Leave all QD rows
for independent disposition; reviewer may retain unchanged evidence under
the explicit correction-review rule rather than repeat the whole census.
