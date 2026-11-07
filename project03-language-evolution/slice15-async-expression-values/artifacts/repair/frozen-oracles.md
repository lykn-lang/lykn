# NE-C09 five-fixture freeze

Frozen before baseline execution. Stimulus files are the five named shared
fixtures under `test/fixtures/async-expression-values/`; Rust and public JS
regressions load the same files. These are predicted observations derived from
the approved source contracts, not from a compiler run.

| Fixture | Exact expected JSON observation |
| --- | --- |
| E1-sync-values | `{"value":41,"falseValue":42,"typeof":"number","noElsePrefix":41,"nestedEquality":true}` |
| E2-async-branches | `{"sync":{"trace":["sync","after-call","after-await"],"value":42},"await":{"trace":["await","after-call","after-await"],"value":7}}` |
| E3-promise-value | `{"same":true,"thenType":"function","resolved":9}` |
| E4-deferred-function | `{"constructionCalls":0,"immediateType":"function","invocationCalls":1,"result":9}` |
| E5-effects-errors | `{"trace":["selected"],"selectedMessage":"selected boom","rejectionMessage":"await rejected","outer":"outer","scoped":"inner"}` |

The finite discriminators are: sync typed/post conditional and branch-local
sequence values, no-else statement prefix and equality operand; both selected
async branch results with an untaken-effect control and explicit call/await
trace; preservation of the identity and thenability of a Promise-valued tail
after an earlier await; deferred function creation versus invocation; and
selected throw/rejection messages, effect order, and local shadow scope.

No expected value was established by running the baseline. A fixture's values
remain unestablished if compilation or module execution fails.
