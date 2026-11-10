---
project: project03-language-evolution
arc: arc01-compiler-semantic-integrity
slice: slice20-anonymous-value-names
status: in-progress
depends-on: [slice19-ordered-computed-calls]
---

# S20 — anonymous value names in private completion storage

Luna 6 High CC implements with separate Sol 6.1 High CDC
in standard Autonomous Mode. Start exact `c729a0df` after
independent [computed-call acceptance](../slice19-ordered-computed-calls/cdc-verification.md)
in the same task checkout and branch. Release stays read-only.

The preliminary root public compiler observation on exact e9eeee3d
and native compiler observation on c729a0df both return
`["","completionValue__gensym2","completionValue__gensym4"]`
from the same actual source. A private saved earlier argument
uses a const initializer and a private completion result uses
identifier assignment. JS infers a name from the generated
identifier in each case. An ordinary anonymous argument stays
empty. These are read-only actual probes and remain preliminary
to the frozen baseline. [Public source and generated evidence](artifacts/evidence/preliminary-public).

Preserve anonymity at those actual compiler-private storage
sites, including the saved computed receiver. Preserve existing
ordinary source binding inference and explicitly named values.
Classify the real normalized anonymous arrow/function/generator/
async/class kernel shapes. Keep only a small expression barrier
on those inputs, with no new function, helper, import, public
interface or change to ordinary source declarations.

One shared source regression exercises original empty and
generated private names plus the real source binding name.
Actual native/public focused gates, full normal Make, standalone
cites and independent replay close only this issue. Assignment,
spread/iterator and special references remain I3. I4, K and
release propagation stay outside this delivery. S20 starts
with zero refinements.

The [native source and generated evidence](artifacts/evidence/preliminary-native)
uses the accepted task CLI with SHA-256
`9f602bcb664c7114d702380fd454885647c483d6b526b1a17ea8cf4a12b4c0b8`.
Both preliminary source files have SHA-256
`2b57d907e4a5bc09c442d2272bbef6655a815e2e05fc5f5a599ff14f4e3fa916`.
The original native warning is retained separately from runtime stderr.
