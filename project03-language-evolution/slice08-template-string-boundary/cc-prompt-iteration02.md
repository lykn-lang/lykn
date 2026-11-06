# CC iteration02 — repository JS-test filename correction

Continue all implementation/validation instructions in iteration01, with this
single source-path correction. CDC prescribed `_test.js` from the host default,
but repository .gitignore5–8 explicitly reserves that suffix for generated Lykn
output and identifies handwritten JS tests as `*.test.js`. This author-readiness
miss is CDC's; no language/test oracle, case population or acceptance bar changes.

Keep source test-only commit920012afa4fd182e4619393e20a7af0a53e0382f and all
actual expected-red outputs made before the pause. Do not amend/rewrite them.
The original exact path was force-added; no ignore policy was changed and no
validation was bypassed. Correct its classification by a new explicit rename:

- old: test/forms/template-string-boundary_test.js
- new: test/forms/template-string-boundary.test.js

Both names are authorized solely for that rename. The final baseline diff still
has the thirteen iteration01 paths with the new name replacing the old one.
Leave its CONTENT byte-identical to the test-only commit; verify the old Git
blob against the renamed file. No `.gitignore` edit or further forced add.
Commit the rename with actual multiline trailers and retain raw-body evidence.

Native expected-red proof/fixtures are unaffected. Retain the JS red proof at
the old filename as observations from that exact body/baseline; run the focused
JS test once at the new filename before the production patch to verify discovery
and collect unique red receipts. An unselected or setup-failed run is not compiler
red. Then proceed directly with iteration01's narrow encoding repair and full
validation. No new inquiry, payload, helper, observer or pilot run.

CC again owns the same source/planning index and output allowlist, including
uncommitted raw attempts already present. CDC/root read-only after dispatch.
Return the same complete repair evidence/ownership before pilot. This is the
second refinement prompt within the existing five-iteration limit, not a reset.
