# Materialize grouped statement results at the real tail boundary

S14 refinement 04/5. Same Luna 6 High CC and separate Sol 6.1
High CDC, standard Autonomous Mode. Preserve exact held freeze
`1e5203b7`, tree `02fdde81`. Its diagnostic/no-else mark,
normalized abrupt native handling, new negative and guide
changes stand. No executable gate consumed that freeze.

The public statement-list portion of iteration03 was not
implemented in the actual freeze. `BindGroup` returns a JS
array of expanded kernel statements. In a consumed `do`
tail, `directResultStatements` currently puts that raw array
under a return. The generic array branch at the end of
`expandReturnOperand` is unreachable because only if/do call
it. Complete only this concrete defect.

- In `directResultStatements`, recognize arrays as emitted
  statement sequences. Retain their statements and append
  bare return on normal completion. Preserve an actual final
  transfer. Keep each existing direct lexical block intact.
- In actual one-operand return, splice the marked block
  unchanged. For an expanded statement sequence or ordinary
  statement, materialize a direct block with the same
  conversion. Otherwise keep the actual return of the value.
- Expand conditional arms once with ReturnOperand, accepting
  an array into the same statement conversion. Neither a
  marked block nor an array is a pure value arm. Keep the
  marked no-else value on its exact diagnostic route.
- Use the existing statement-only grammar helper where safe
  after `formHead` and preserve actual `for-await-of`, abrupt
  and `if` roles. Remove the unreachable generic array
  conversion so there is only one actual materializer.
- Add one narrowly necessary public compile-shape regression
  in the existing runner. Compile
  `(func grouped :returns :any :body (return (do (bind x 1 y 2))))`.
  Assert the generated function contains declarations
  `const x = 1;`, `const y = 2;` in that order and a later
  bare `return;`. Use existing assertions and no new child
  or runner. The four runtime fixtures and all existing
  assertions remain exact.

Only canonical/embedded expander.js and the one named public
test may change. Mirrors byte-identical. Freeze with the
prepared commit body
`/private/tmp/lykn-s13-release-cdc.ovKWFaY3/s14-statement-sequence-message.txt`
and hold for exact static release. Then original focused and
full gates, with seven independent public controls (five old,
no-else and grouped materialization), unchanged 24 fixture steps
and native 26. Preserve all earlier runs and actual limits.
