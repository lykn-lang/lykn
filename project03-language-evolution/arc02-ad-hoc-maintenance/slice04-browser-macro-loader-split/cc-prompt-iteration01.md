# S04 Deno loader end-of-file correction

Independent committed-source diff check at `098d7c21` found a new
blank EOF line in `packages/lang/macro-imports-deno.js` and its
embedded mirror. Remove only that blank line in both files, keep
a single terminal LF, preserve exact mirror bytes, and commit
the two paths using the supplied `s04-eof-message.txt`.

Read actual full staged/candidate source whitespace results,
`git diff --check b0c97f4e HEAD`, and the exact two-path diff.
Preserve the original source freeze. Resume source ownership
only after CDC confirms its in-flight original Make finished.
Return exact clean source commit and tree immediately. CDC
will execute the independent final product and budget gates.
