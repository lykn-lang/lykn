# S09 pre-freeze protected-exit preservation

Same Luna 6 High CC and Sol 6.1 High CDC, standard Autonomous Mode.
This is a pre-production scope precision for the initial assignment.
The five test drafts were uncommitted and no gate was launched.
Keep those fixture bytes and add the sixth exact F6 in
[fixture specification](artifacts/fixtures.md). Current native total
is 15 including the prior four negative positions inside their one test.
Public total is one parent/14 steps. Both old F6 routes are predicted
to pass the same checked tail and post-effect oracle.

Keep direct transparency within unprotected paths. In Rust, retain the
existing statement matcher as a private legacy path. Add only a private
`pub(super)` field in `emitter/context.rs` default false. Scope that
flag during actual protected bodies, save/restore on each return to
the caller. For single-clause func use active `:post` or non-any,
non-void typed return while assertions are enabled. For native
multi-clause func the actual existing exit protection is its enabled
post clause; preserve that body. A protected subtree conservatively
inherits the legacy flag for this tranche. `emit_match` uses the old
Statement algorithm when the flag is active, the new Statement
algorithm otherwise, and keeps the existing consumed arm. No checked
exit rewrite. Current valid unprotected behavior and normal context
return remain exact.

Public classify-generated Func output uses Legacy nested match when
its actual existing builder protects result/post. Use the existing
`parseKeywordClauses` and the same single/multi clause shape as the
classifier (one keyword stream versus first list starting with keyword).
Single-clause actual active post or typed non-any/non-void return
protects; multi-clause currently protects post-bearing clauses, so
conservatively keep the whole generated multi function Legacy if any
clause has actual post. Parameter and pre checks alone do not make an
outgoing result guard. Preserve actual output and default macro
dispatch. Public Cond/other legacy rule remains.

Allow `crates/lykn-lang/src/emitter/context.rs` plus the original
production paths and the exact sixth fixture. First freeze all six
tests only using the original fixed test message. Preserve actual F6
post guard/return type in complete generated modules and exact runtime.
Then the same baseline, source freeze, full gates and separate
independent review. S04 CV-04 and I4 remain open.
