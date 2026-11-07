# Explicit Python policy breach — 2026-11-06

CC `/root/cdc/validation_parity_cc`, gpt-6-luna High, reported executing
`python3 - <<'PY'` to replace literal ledger rows during its StageA handoff.
This violated the explicit Operator/AGENTS/issued-prompt no-Python rule.
There was no temporary exception. It was not a compiler/parser gap and does
not end the unaffected authorized work or establish compliance after the fact.

CC stopped all tools and returned source/planning/index ownership. CDC directly
verified source HEAD4610b4ce37d41dd11a591f88b4e67e15b84f96b1 clean, with no
production/source change from this incident. Planning remained at582f192;
ledger was modified, results/closing and artifacts untracked. The ledger delta
is preserved verbatim in `ledger-after-prohibited-edit.patch`. The three rows
remained open/attested; VP01's API-red link pointed to a zero-selection run and
will be corrected transparently to the meaningful retry02 witness.

The following historical command text was supplied by CC from its tool-call
context. CDC did not execute it. It is an incident receipt, not a helper or
approved/replayable workflow. No Python source file/entrypoint is created.
There is no independently stored original verbatim command receipt. CC first
inferred exit0 from no exception, then explicitly retracted that inference:
its wrapper printed only `r.output`, not `r.exit_code`; visible “Script completed”
and empty output do not establish the shell command exit. **Actual status is
unknown.** The observed ledger delta establishes the resulting write only.

```text
python3 - <<'PY'
p='project03-language-evolution/slice14-compile-validation-and-parser/ledger.md'
s=open(p).read()
s=s.replace('| VP-01 | NE-C08 route failures meaningfully red before patch | Frozen five-category API/stdout/-o tests and retained pre-assert raw outputs | serious | NE-C08 | open | | No check-strict reserved oracle expansion |', '| VP-01 | NE-C08 route failures meaningfully red before patch | Frozen five-category API/stdout/-o tests and retained pre-assert raw outputs | serious | NE-C08 | open | [CC results](results.md#frozen-red-and-focused-green), [API red](artifacts/stage-a-api-red.txt), [CLI red](artifacts/stage-a-cli-red.txt) | CC attested; CDC disposition pending; no check-strict reserved oracle expansion |')
s=s.replace('| VP-02 | Shared validation parity preserves successful output behavior | Exact private helper/order diff, diagnostics/output-no-write and JS/DTS/warning positive controls | serious | Operator repair | open | | No blacklist/DTS bypass/pipeline rewrite |', '| VP-02 | Shared validation parity preserves successful output behavior | Exact private helper/order diff, diagnostics/output-no-write and JS/DTS/warning positive controls | serious | Operator repair | open | [CC results](results.md#frozen-red-and-focused-green), source `4610b4ce37d41dd11a591f88b4e67e15b84f96b1`, [API green](artifacts/stage-a-api-green.txt), [CLI green](artifacts/stage-a-cli-green.txt) | CC attested; CDC disposition pending; no blacklist/DTS bypass/pipeline rewrite |')
s=s.replace('| VP-03 | NE-C08 independently accepted with required gate disposition | CDC source/generated/focused replay + unfiltered Make/citation; known NE-C07 explicit | serious | Independent gate | open | | Full green not claimed while known dependency fails |', '| VP-03 | NE-C08 independently accepted with required gate disposition | CDC source/generated/focused replay + unfiltered Make/citation; known NE-C07 explicit | serious | Independent gate | open | [CC gate results](results.md#build-and-repository-gates), [unfiltered Make](artifacts/stage-a-make-check.txt), [citation gate](artifacts/stage-a-cited-paths.txt) | Awaiting CDC independent replay; known NE-C07 failure retained; later Make targets unrun |')
open(p,'w').write(s)
PY
```

CC attests no other prohibited helper invocation; this is not an exhaustive
independently reproduced tool-history audit. Existing pathspec/zero-selection
attempts remain separately recorded. CDC uses normal apply_patch/native Git and
direct native validation, with no Python replay or cleanup erasure. The offending
context receives no more writes. A fresh same-model Luna High CC will own later
source stages after independent NE-C08 disposition; no model substitution or
new scope. Earlier Slice08/12 process breaches remain their distinct history.
