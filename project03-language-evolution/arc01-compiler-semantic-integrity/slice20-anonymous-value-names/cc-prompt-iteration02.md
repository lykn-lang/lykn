# Correct the anonymous name fixture before repeating old focus

Same S20 scope, Luna 6 High CC with separate Sol 6.1 High CDC in
standard Autonomous Mode. Retain clean test-only `329fa585` and all
first actual old receipts under `old-focus`. Actual native no-run and
CLI build passed. Native focused suite passed its 45 controls, then the
new fixture failed in strict Deno before the name oracle. The surface
alias `(lambda () (return 1))` generated invalid `() => return 1`.
This is a separate pre-existing direct single-body arrow shape issue.
S20 needs the documented alias as an anonymous value. Change only
that fixture body to `(lambda () 1)`, with the same oracle. Include
the fixture name in the existing native `--kernel-json` capture list
to obtain its previously missing kernel artifact. No product edit.

Freeze using the exact supplied `correction02-message.txt`, return
the immutable revision for static review, then actual original old
focus with fresh raw roots. Do not run the superseded public population
if it has not already started. Preserve actual outcomes if it did.
This is refinement 02 of five.
