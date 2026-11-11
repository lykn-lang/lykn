# S02 consolidated draft-review corrections: dispatch and macro hygiene

Continue the original and iteration01 assignments with Luna 6 High CC,
independent Sol 6.1 High CDC, Autonomous Mode. Obvious bounded corrections are
authorized. No Python execution or Python/Ruby/Fennel/handwritten JS research
helpers, including temporary ones; new probes/drivers use Lykn. Product
compiler Rust/JS and ordinary product tests remain authorized. No merge/push,
publication, dependency addition or S03 qualified implementation.

Sol's early read-only diff review found two correctness issues. These are draft
findings, not independent runtime acceptance. Preserve them and their remedies
in the closing report. The underlying ordered recursion, native protected
guard-fallthrough reuse and kernel-mark retention otherwise appeared coherent
on that bounded inspection.

1. `compileLetPattern` catches bare PascalCase constructor atoms in the root
   simple-binding branch, making its constructor branch unreachable. Restrict
   simple binding appropriately. Verify both success and wrong-variant failure
   for bare zero-field `if-let` and `when-let` in native/public runtime, not
   only parenthesized zero patterns.
2. Generated public field names are allocated before later user macro expansion.
   Source-name reservation alone cannot prevent capture of macro-introduced
   free names. The statement path re-censuses expanded forms but only repairs
   its target name, leaving the new fields vulnerable. Value/protected and
   conditional-binding routes emit kernel before expanding their guard/body,
   so a statement-only rename patch would leave the same defect elsewhere.

Use the existing private identity/finalization mechanism rather than building
separate name-repair passes in each matcher. Inspect
`packages/lang/expander-core.js`'s `completionValueAtoms`,
`completionValueAtom`, `emittedNames`, `finalizeCompletionValueMarkers` and
`pass2ExpandAll` (~734,1077–1118,2190–2210). It already reserves the complete
expanded unit's emitted names, omits private markers from that census and
assigns fresh printed names after expansion. Generalize this bounded mechanism
to compiler-private temporary identities/prefixes, keeping existing completion
behavior and all its regressions. Each field temporary gets an opaque compiler
identity; its declaration and references share that identity. User source/macro
atoms cannot acquire it by spelling. Finish all private names after macro
expansion against the complete emitted-name census. Preserve metadata through
any relevant cloning and retain sanctioned-kernel marks.

The helper may be exported between private implementation modules, but do not
add it to the explicit public `expander.js` facade or `mod.js` exports. Avoid
new source syntax, a public identifier protocol or a general AST redesign.
For accesses based on a private atom, use compiler-owned computed-member AST
`(get privateAtom "field")` rather than string-concatenating its placeholder
`.value`; finalization must rename the actual reference. The existing known
target retargeting remains separate. Keep original simple public flat fallback
compatibility and the registered/object field-effect contract.

Add actual macro-introduced capture regressions covering direct statement,
value, protected and conditional binding routes. Use existing Lykn macro-test
precedents and strict public compilation; the old raw-name tests alone are
insufficient. Verify an outer binding remains the value read by the macro,
and pattern payload still binds correctly. Native regressions establish parity
where applicable. Recheck existing completion-name, scope and macro tests and
the repaired original witnesses. Then finish all original S02 gates and all
five PC rows at their stated strength. A structural grep or read-only Sol
finding does not replace runtime evidence or final exact-commit review.
