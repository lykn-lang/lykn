# Isolate the old match clause scope runtime witnesses

S12 refinement 01/5. Same Luna 6 High CC and independent Sol 6.1
High CDC, standard Autonomous Mode. Start from frozen test-only
`bd0813204ee8900bdb393eed263cae912eb1a7c6` and the exact unchanged
production `7b17a784`. The initial assignment, source boundary,
toolchain and evidence contracts remain active. Research helpers
must be Lykn, with native CLI for direct invocation. No Python
execution or substitute Node/handwritten JS, no dependency or
new framework, no release/K/I3/I4 action.

The original native 17 tests produced 15 passes and two runtime
failures. The three private controls found the expected wrong
guard tag, false call-operand binder and cross-clause shadow site.
The public parent produced 15/16 steps, with F2 passing. Preserve
every original raw phase and both exact input blobs.

F1 native emitted a bogus nested ordinary match call, but Deno first
hit its wrongly classified `do(...)` guard. The unchanged public
reserved-name scan treated the list headed by the pattern binder
`match` as another syntactic match and rejected `do` as a reserved
pattern binder before module creation. F2 native demonstrated
old Pass2's literalized object pattern and suppressed sibling macro
in its complete module, but its consumed explicit `kernel:object`
was unstripped and ran as `kernel.object(key(7))`. The runtime stopped
before the predicted fallback. These are genuine separate baseline
limitations, not successful runtime red discriminators yet.

Only edit the two new Lykn fixtures. In F1 insert a declared
`trace-false` helper immediately after `plus-ten`. It pushes its
argument into trace and returns false. The guard is now
`(trace-false (match 1))`. In F2 replace only the subject expression
with `(JSON:parse "{\"key\":7}")`. The [current exact fixture record](artifacts/fixtures.md)
is the copy source. Keep macro collision, first guarded binder,
same-clause bound call, nested genuine match, ordinary bound call,
all table entries, and stdout bytes unchanged.

Use exact prepared
`/private/tmp/lykn-s04-i2.tBlMBxu9/s12-isolation-test-message.txt` with normal hooks.
Freeze just these two paths and return actual body/hash/tree/fixture
bytes. Await CDC static release. Then replay just the two changed old
native tests, both as one exact filter population, and the original
public parent with fresh prospective evidence. Existing private
unit reds and other native observations remain attributed to the
prior freeze. The expected old native F1 now reaches the bogus
sibling call and fails, F2 reaches its fallback and prints
`["fallback"]\n`. Public expected all 16 steps pass. Preserve actual
results. Do not edit compiler source or either unrelated product
route. After CDC reconciles, continue the original production work.
