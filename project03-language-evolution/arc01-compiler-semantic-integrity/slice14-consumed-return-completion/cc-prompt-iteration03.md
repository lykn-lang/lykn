# Preserve diagnostics and statement results in direct tails

S14 refinement 03/5. Same Luna 6 High CC and separate Sol 6.1
High CDC in standard Autonomous Mode. Exact clean
`6e406654` grouped no-run, native 26/26, public 24/24 steps
and all five prior negatives passed. The eight complete modules
retain source control. Preserve these actual runs. Full gates
were held for the following bounded static findings.

1. In canonical expander.js, keep a consumed no-else `if` in
   its original Value route and mark its expanded node as a
   return operand value. The existing compiler must still emit
   the exact no-else diagnostic even if nested as a do or match
   tail. Do not silently turn it into a statement with bare
   return. Add only one independent public negative to the
   existing semantic-role runner for
   `(func bad :returns :any :body (return (do (if true 1))))`.
   Assert the exact original compiler error message:
   `if in expression position requires an else branch — add an else branch, or restructure as a statement`.
   No runtime child for this invalid input.
2. Use resolution-checked `formHead` at the direct return
   and if/do hooks after actual macro dispatch. Use one
   result materializer for real transfer, marked direct block,
   ordinary value and normally completing statement result.
   A list of expanded statements such as a grouped bind is
   a lexical block followed by bare return, not an array
   embedded under return. Preserve nested block boundaries.
   Use existing statement grammar support plus actual kernel
   `for-await-of` and real transfer roles. Keep marked pure if
   on its existing expression route. Preserve ordinary legacy
   fallback for unsupported return arity, without expanding
   any operand twice. Keep canonical and embedded copies exact.
3. In native emitter/forms.rs, use the existing checked escape
   normalization for known `kernel:if`, `kernel:return`,
   `kernel:throw`, `kernel:break` and `kernel:continue` result
   roots, then recurse once on the actual stripped root. They
   must keep their real branch or abrupt role in direct tails.
   A leaf that lowers to an actual declaration or other
   statement (for example, surface bind inside a consumed do)
   emits that statement and a bare return on normal completion.
   It never becomes a return of a statement node. Reuse actual
   classification and kernel statement roles. Keep pure values,
   genuine terminal transfers, ordinary function tails and
   old wrapper contexts unchanged.
4. In Guide 00 reconcile the affected if/do/match text with the
   already documented ordinary named function scope. Pure
   conditional values keep ternary, transfer-bearing direct
   results can use lexical regions, other existing value wrapper
   routes remain. No unrelated doc changes.

Scope only native emitter/forms.rs, canonical and embedded
expander.js, Guide 00 and the one named public test. Four
frozen runtime fixtures and all earlier predicates unchanged.
Focused denominators now native 26, public 24 steps under the
same parent, plus six independent negatives (five old and one new).
Owned Rust formatting, exact allowed paths, prepared commit body
`/private/tmp/lykn-s13-release-cdc.ovKWFaY3/s14-direct-preservation-message.txt`.
Freeze and hold for independent static release. Then fresh
focused gates, full normal Make and standalone cited paths,
materialized comparison and exclusive clean ownership return
as originally assigned. Preserve all earlier attempts.
