# Arc03 S01 refinement 03 of 5 — public W8 numeric macro literal repair

Operator authorizes bounded W8 diagnosis and repair, independent validation,
and the original pre-policy Arc03 baseline. Same Luna6 High CC and Sol6.1
High CDC in Autonomous Mode. Stop at the first further substantive failure
or real evidence gap. This is source refinement 03 of 5. All other budgets,
fixtures, and prior stopped evidence remain recorded. V1 and typed dist
production wiring are outside this assignment.

Read this assignment, [iteration02](cc-prompt-iteration02.md), current
plan/ledger and [actual W8 stop](cdc-verification.md#correction02-public-baseline-stop).
Read the complete relevant macro compilation and expansion sections in
`packages/lang/expander.js` and its embedded mirror, `compiler.js` kernel
object construction and number emission, `expander/env.rs` typed and raw
number decoder, `test/expander/macro-basic.test.js`, and `Makefile`
`fresh-artifacts`/`check` targets. Reuse existing AGENTS and guide intake.
Apply JavaScript/Deno test ID01 and existing exact assertions. Retain the
same Deno/native source pins, scopes and no substitute-script policy.
Read the actual supplied [tests](artifacts/commit-messages/w8-tests.txt),
[repair](artifacts/commit-messages/w8-repair.txt) and
[composition](artifacts/commit-messages/w8-composition.txt) messages.

## Actual trace and bounded implementation

The unchanged W8 template `(macro stomp () \`(set! Reflect:apply 0)) (stomp)`
produced `generated: null` and `expandExpr: unexpected node type 'undefined'`
in the public baseline. Source trace: compiled quasiquote preserves a number
reader node until compiler codegen emits primitive `0`. The resulting macro
call constructs `$array($sym("set!"), $sym("Reflect:apply"), 0)`. Its public
array API preserves the raw numeric child and recursive expansion rejects
that child for lacking a node type. Native's JSON decoder converts primitive
numbers recursively to `SExpr::Number`; its three W8 routes succeeded.

Keep Arc03 on clean `a71536496ab8ee858cafdc319deea2e0d483077f` while validating
the prerequisite. After exclusive handoff, create local branch
`codex/public-macro-numeric-literals` at accepted
`f2cd813908649d5b58253c75d0eda61b029fc6ff` in the same task checkout.
It avoids the intentional pre-policy red tests during the repair's full gate.
Confirm branch absence, clean refs, no exact untracked/ignored path collision,
and normal hooks. Keep release `62e9531e` protected.

Only three tracked paths may change:

- `test/expander/macro-basic.test.js`
- `packages/lang/expander.js`
- `crates/lykn-lang/embedded/packages/lang/expander.js`

First freeze only a discriminating regression change in the existing test
file. Add two normal Deno tests for the two numeric positions in this same
macro literal path. Use the public compiler through the canonical
`../../packages/lang/mod.js` (aliased to avoid the existing local helper),
with the file's existing reset helpers and exact output assertions.
Nested case is `(macro emit-zero () \`(console:log 0)) (emit-zero)` and
expects `console.log(0);` after trim. Direct template case is
`(macro literal-zero () \`0) (literal-zero)` and expects `0;` after trim.
Both compile only. Existing seven tests stay untouched. The permanent
regressions use harmless sources so future v1 policy can reject W8 without
conflicting with these tests. The original protected-host W8 remains exact.

After CDC static release refresh `make fresh-artifacts` for the file's
existing `lang/` mapped imports. Run the whole existing macro-basic target
with the repository's normal `deno test --config project.json -A
test/expander/macro-basic.test.js` command. Expect the seven existing tests
green and the two new cases red with the same unexpected-node error.
Return actual red observations for CDC release before the production edit.

The production repair is one private numeric strategy hook. In the compiled
strategy emit the existing kernel object form
`(object (type "number") (value <number>))`, using existing `array`,
`sym`, and a string node. It produces a typed number AST object at macro
execution. The ordinary expansion strategy returns the input number node.
Use this hook in the number case of both `walkQuasiquote` and
`walkQQElement`. Leave string/keyword/other literal handling, unquote,
splice, public AST APIs, native decoder and Rust untouched. Apply the same
source change byte-for-byte to both expander copies. Confirm mirror equality.

Freeze each exact source stage with the supplied fixed message, normal
exact-path `git commit --only -F`, complete immutable diff/raw message/digest
and clean status. CDC static HOLD precedes every new dependent build or test.
No semantic edits after a substantive stop.

## Validation, composition and original baseline

After the accepted implementation freeze, refresh artifacts for the focused
macro-basic target and require nine passes. Use that same harmless
`emit-zero` source for the native cross-path control. Retain its exact
source in a fresh config-free owned fixture, compile it with the actual
post-refresh pinned absolute `bin/lykn`, and require exact generated
`console.log(0);\n`, exit 0, empty stderr. The ordinary strict Deno child
must then exit 0 with exact `0\n` and empty stderr. Use a fresh scoped XDG
root for this native compile and compare the actual materialized expander
bytes against the canonical and embedded copies. This exercises the changed
typed-number wire form through native macro pass1/pass2 using the same
regression source. No new specimen family.

Run normal unfiltered
`make check` and standalone `make check-cited-paths` on the isolated
prerequisite branch. Keep default gate flags and current source pins. Retain
post-build identities. Then return clean ownership for separate CDC
source/focused/native/full gates and acceptance. No full Make claim on the
pre-policy Arc03 composite.

Only after independent prerequisite acceptance, the authorized local
re-entry composes that exact accepted commit into clean
`codex/protected-host-contract@a7153649` in this checkout. Use the supplied
message with normal `git merge --no-ff --no-edit -F`. Verify common base
`f2cd8139`, disjoint exact paths and both histories, then independently
review the exact union before baseline. Stop on any conflict.

After composed-tree release, run the original [iteration02](cc-prompt-iteration02.md)
baseline with no fixture or oracle changes. Native must reach the 15
predicate controls, all 29 legacy exit-0 routes, legal4 and dist success
with JS/DTS overwrite. Public must generate all nine bad modules and
execute only the four legal modules with before/after pairs and exact
outputs. Preserve runner aggregate and captured step statuses separately.
No protected-write module runs. Separate CDC reproduction follows clean
handoff only when these exact baseline dispositions hold. The pre-existing
native Homebrew fallback stays out of this repair and remains a future
normal Arc03 suite issue. Baseline retains the explicit pinned override.

For each actual execution retain scoped absolute TMPDIR/XDG/npm and
evidence roots, prospective exact named ancestor checks and readback
prelaunch argv/cwd/scoped env/source and tool pins. Preserve full raw
streams, statuses, actual generated artifacts and phase pairs. Deno
`/opt/homebrew/bin/deno` version 2.9.6, SHA-256
`2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74`,
fixed approved DENO_DIR. Same source-cwd Rust 1.97.0, builds before actual
CLI/test-executable pins. No Python or exceptions, substitute scripts,
new dependencies, gate bypasses, fixture edits, v1/dist implementation,
release integration, push or publication.
