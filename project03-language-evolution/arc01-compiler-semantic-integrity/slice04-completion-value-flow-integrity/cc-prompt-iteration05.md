# S04 iteration 05 — update the exact conditional printing assertion

Same Luna 6 High CC and Sol 6.1 High CDC in standard Autonomous Mode.
Source refinement 04/5. The first normal Make at clean `487c9551`
exited 2 after 13 CLI temp-file errors from unprepared roots. Keep that
attempt. The fresh precreated-root replay completed the Rust gates and
failed exactly one compiled Lykn test. It reported 1479 passes, 31
passing steps and one failure. Neither attempt is a full green result.

In `test/surface/equality_test.lykn`, keep the existing "or: inside if"
test name and source `(if (or a b) (console:log 1))`. Replace only its
expected string with the exact trimmed braced output actually observed.

```lykn
"if (a || b) {\n  console.log(1);\n}"
```

The full-gate raw assertion is in
`/private/tmp/lykn-d736-release-cdc.Gdv7dxje/i1-current/make-retry1/stdout.raw`.
The assertion still checks the same condition, call and equality of the
complete compiled text. This is the only new source path. Keep all
frozen integration fixtures, production implementation and predicates.

Use the exact supplied message
`/private/tmp/lykn-d736-release-cdc.Gdv7dxje/i1-printing-test-message.txt`, normal Git/hooks
and only the named path. Freeze and return source for independent
static check. Then rerun the original unfiltered Make from precreated
fresh configfree roots with actual prospective receipts, and standalone
cites if green. Preserve earlier exact focused results with their
original source ID. Both mirrors, final producer pins, actual CC
handoff and separate independent current gates remain required.
