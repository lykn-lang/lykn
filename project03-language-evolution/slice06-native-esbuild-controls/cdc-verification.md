# Slice06 CDC verification

## In-progress source review — 2026-11-05

CDC Sol 6.1 High, independent of CC Luna 6 High. Initial source freezes 9ced73a,
input correction 8fd1f4d, observer syntax repairs ebfc219/0818be3; active initial
assignment cc-prompt.md. Native tools and 15 modules reported built/compiled,
observer now syntax-compiles, run-03 dist stages successfully. No bundle/runtime
has run. These current build/compile claims remain CC attested until final replay.

**Verdict: return bounded observer/C5 correction before C4 execution.** Syntax
success does not establish host API correctness, complete observation or API
coverage. Current follow-up is cc-prompt-iteration01.md. This is first substantive
refinement; earlier delimiter/input source commits and all failed states remain.

Inspected complete committed driver 0818be3, C5, source package configs and current
results, without writing implementation. Confirmed these contract defects:

1. Driver alias/argument builders call String:slice, String:lower-case and
   Array:push. These emit nonexistent String.slice/String.lowerCase/Array.push.
   Receiver methods are required; task's ECMAScript 2025 corpus places slice at
   String.prototype (22.1.3.22), toLowerCase at String.prototype (22.1.3.28), and
   push at Array.prototype (23.1.3.23). Lykn guide Modules/Colon Syntax and
   anti-pattern 47 establish receiver syntax; skill mutation guidance recommends
   functional builders or cell+conj. This is an LLM-authored host-API mistake,
   not evidence of a compiler defect. No failing runtime was deliberately run.
2. Driver bundles/runs but never parses or records actual metafile observations,
   and does not implement the declared graph/contribution/public-byte checks.
   Existing manual C4 code inspection remains necessary, but cannot substitute
   for the approved Lykn observer's finite JSON observation/oracles.
3. Both C5 unbundled observations save to C5-source-run.json: final run would
   overwrite initial data. No overwrite has happened because runtimes are unrun.
   Give before/after distinct immutable receipt labels before execution.
4. C5 labels fileRoot/documentRoot as root observations while importing those
   names from the subpaths twice. JSON root currently imports only parse-value;
   the root's read-text/document-label named exports are untested. Import/call
   them from @probe/json root and retain corresponding subpath calls. This
   changes only C5; output prediction and five-stimulus/nine-key scope stay fixed.

A guessed installed Deno lib.es5.d.ts path was absent during reviewer lookup;
no inference used it. The actual repo ECMAScript corpus sections above were
loaded directly. No new probe program, compiler change or broad inquiry was
commissioned. Domain guidance was read; receipt alone does not prove application.

Evidence applicability: retain native tool source/build receipts, pinned compiler,
unchanged library/config/data source states and 14 unaffected module compiles at
run-03 as attested pending final independent replay. C5 and observer must recompile;
C5 staging must update and byte equality/config checks remain required. No need
repeat the 14 solely for observer fixes. Preserve runs 01/02 parse failures and
run-03 success/staging observations. Tool proofs will be independently checked
at final acceptance; nothing is prematurely promoted. All seven NE rows remain
open; all five bundles/runtimes remain unrun. Prior F/Project07 obligations unchanged.
