# Apply the two actual Clippy question-mark corrections

Preserve exact product freeze `9f5e2562`. Its native and public
focus passed. The first broad attempts had duplicate `make`
arguments and did not reach repo targets. The corrected normal
`make check` reached Clippy and failed on two `question_mark`
diagnostics. Standalone citations passed.

An initial uncommitted edit used Python against the project and
assignment constraints. Preserve that actual diff as provenance.
Do not use it as implementation or validation evidence. Reverse
only those two owned unstaged hunks using a permitted direct patch,
then re-author the exact following substitutions through a permitted
patch and read back the resulting source. No other source change.

- `let kernel_form = head.strip_prefix("kernel:")?;`
- `let (get_head, span, receiver, key) = computed_member_call_parts(target).ok()??;`

Use exact `correction03-message.txt` and return immutable freeze.
Same arguments, predicates and behavior. Preserve all failed
receipts and no suppression. This is refinement 03 of five.
