# Consolidated correction 02 freeze

This source-derived freeze supersedes only the corresponding expectations and
controls recorded in `../frozen-oracles.md`. It does not rewrite that initial
freeze or the baseline evidence in `../baseline/`.

| Fixture | Exact expected JSON observation |
| --- | --- |
| E1-sync-values | `{"value":41,"falseValue":42,"typeof":"number","noElsePrefix":41,"nestedEquality":true,"prefixEffect":1}` |
| E2-async-branches | `{"sync":{"trace":["sync","after-branch","after-call"],"value":42},"await":{"trace":["await","after-call","after-branch"],"value":7},"bothAwaited":[42,7]}` |
| E3-promise-value | `{"same":true,"thenType":"function","resolved":9}` |
| E4-deferred-function | `{"constructionCalls":0,"immediateType":"function","invocationCalls":1,"result":9}` |
| E5-effects-errors | `{"trace":["selected","await-selected"],"selectedMessage":"selected boom","rejectionMessage":"await rejected","outer":"outer","scoped":"inner","asyncValueMessage":"value boom"}` |

The five shared product fixtures remain E1–E5. E1 observes the no-else `if`
through a cell effect while keeping stdout JSON-only. E2 records branch-local
completion before the caller resumes, includes both branches with awaits, and
retains an untaken-effect control. E4 constructs an async callback inside a
synchronous `make-callback` function. E5 adds a selected throwing async value
branch and a rejection catcher while retaining its earlier statement-throw,
direct rejection, and scope observations. E3 is unchanged.

Prior pre-correction fixture bodies, recorded before this correction, have
these SHA-256 identities in source commit `5b11f49`:

| File | SHA-256 |
| --- | --- |
| E1-sync-values.lykn | `8ab462af9ae3b8852cf3a6e2ece76a20a46dead69c2dfa7fafeb602fde051181` |
| E2-async-branches.lykn | `689c74758c3cf47c2e57b49456ece8379f52691410865b673d4badd9049ee4f6` |
| E3-promise-value.lykn | `bc7a7b23007b80f10b298145e36a859d0a108a70537139e85628c3986a1d21fb` |
| E4-deferred-function.lykn | `a7d458dad98c86c605869dede52f09e66c5921193bc034c8216ae104b845f57f` |
| E5-effects-errors.lykn | `6d1d3eee9703e4e7ca677909b3e2156f07a27cd9bebaec6338f0d48b7d85e974` |

No corrected expected value was inferred from runtime output.
