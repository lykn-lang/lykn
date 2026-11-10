# Isolate the restored public macro witness

S13 refinement 02/5. Same Luna 6 High CC and independent Sol 6.1
High CDC, standard Autonomous Mode. Exact test-only `28ed061d`
old baseline had native 19/22, private tagged control green and
private unknown red as expected. The public parent had 17 passed
and three failed fixture steps out of 20. All five public
negative tests passed. F1 and F3 hit expected false reserved
binders. Restored F2 had a separate harness failure from an
earlier preserved fixture registering the same `obj` macro.
Retain all old raw and exact fixture blobs.

In only `test/forms/semantic-roles.test.js`, add the existing
canonical expander's `resetMacros` import alongside resetGensym.
Call it immediately before `lykn(source)` only when fixture name
is `original-match-kernel-object`. Existing old S12 steps run
before this point and stay unchanged. This preserves the old
F2 and S12 source bytes, assertions, test denominators and strict
flags. No fixture, production or other path edits.

Use Lykn for authored research tooling and native CLI for direct
invocation. No Python execution or substitute Node/handwritten
research JS. Freeze with exact prepared
`/private/tmp/lykn-s04-i2.tBlMBxu9/s13-macro-isolation-message.txt`.
Await static release, then replay the original public parent and
five negatives with fresh named-config/path/tool receipts. Expected
old F2 green, F1/F3 still red. Original native/emitter observations
stand. No source work before CDC reconciles this result.
