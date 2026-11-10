# Complete direct-return materialization in both backends

S14 refinement 02/5. Same Luna 6 High CC and Sol 6.1 High CDC,
standard Autonomous Mode. Preserve exact first source freeze
`75d286e2`, tree `9ec2a0ca`, held on static review. No compiler
or test execution consumed it. Fixture/test frozen source
`40c37d3d` and all current oracles remain unchanged.

## Native

In `emit_func_single`, when `direct_return` already produced the
body, restore its scoped context and append that body directly
to the actual function. Do not run it through the old implicit
return wrapper again. A final emitted `if` with real returns
must remain a statement. Keep the original function-tail role
test and the separate consumed sequence tail. Preserve early
returns with normal bare values and no-else Statement tails.
Keep direct context out of the legacy and unselected bodies
already identified. Retain typed/classification errors and the
shared checked kernel escape route. Run owned Rust formatting
before the next source freeze; preserve exact allowed paths.

## Public expansion

Complete the private adapter inside existing pass2. A true
named `Func` selects new function-entry use only for a single
ordinary clause, no post, and no return annotation or `:any`.
Use existing `parseKeywordClauses` and actual multi-clause
shape. Preserve prior void, multi, typed and legacy paths.
Have kernel function-entry assign direct statement use to its
body. Other raw/genuine function-family bodies retain old
roles at their own boundary. Do not repeat raw child-name
scope gates across each generic sequence.

After existing resolution, prefix normalization and macro
dispatch, a genuine direct-statement `return` with an operand
expands it exactly once as ReturnOperand. If the result is a
compiler-owned direct result block, splice the actual block
in place of return. Preserve bare return. Otherwise emit the
original return of the expanded value. Use a private WeakSet
for the in-phase direct block identity if needed. Consume its
meaning inside pass2. Public expand returns only ordinary
kernel nodes, with no custom marker contract for compile.

Implement both actual ReturnOperand forms in the same hook:
- `if` normalizes test once in existing Value use and each
  arm as ReturnOperand. Preserve exact old no-else error.
  Pure expanded values remain ordinary kernel if for the
  existing ternary builder. Otherwise emit marked direct block
  containing braced if with arm results converted to direct
  source statements. Untaken branches remain lazy.
- `do` makes a marked direct lexical block, retaining
  DirectStatement prefixes and a ReturnOperand tail. A normal
  value gets a real return, known terminal source transfer is
  kept, and a normally completing statement tail gets a bare
  return. Empty do returns undefined by bare return.
- Match ReturnOperand calls the established ordered candidate
  builder with this same body-tail conversion. Mark its result
  as a direct lexical block and splice it. DirectStatement
  Match retains the old statement body outcome while carrying
  direct statement use through its executable body.

Use one shared prefix sequencer or optional tail use so the
selected do/match tail sees actual preceding sibling bindings.
Do not expand a child twice to decide its role. Use the same
tail materializer for conditional arms, do, match and the
actual return splice, distinguishing private direct blocks,
real abrupt controls and ordinary values/statements. Preserve
the prior condition use for all Legacy/Protected paths.
Forward DirectStatement through existing genuine statement
adapters for conditional arms, loop/label/block bodies,
switch clauses and try/catch/finally. Structural slots and
ordinary expression leaves keep their prior roles. A compiler
transport wrapper keeps its existing Legacy ownership.

Do not change unrelated source, shape or runtime oracles.
Guide 00's new statement should match the actual bounded
named-function contract. Recopy the exact canonical expander
to its embedded mirror. Freeze corrected five-path ownership
with the supplied commit body
`/private/tmp/lykn-s13-release-cdc.ovKWFaY3/s14-direct-materialization-message.txt`.
Await independent static release. Original focused/full gates
remain binding and the source build will follow release.
