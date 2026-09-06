# W-4d Closing Note — ICU Error Block Fence Annotations

## Fences edited

Six fences in `docs/guides/17-template-and-i18n.md` changed from ` ```lykn ` to ` ```lykn,compile-fail `:

| Block | Fence line (post-edit) | Error demonstrated |
|-------|------------------------|-------------------|
| Missing keyword argument | 144 | `no binding for slot {name}` |
| Unused keyword argument | 152 | `unused keyword argument :extra` |
| Duplicate keyword argument | 160 | `duplicate keyword argument :a` |
| Missing `other` branch | 167 | `plural block missing required 'other' branch` |
| Overlapping branches | 174 | `overlapping branches: '=1' and 'one'` |
| Non-English plural category | 182 | `'zero' not valid under English plural rules` |

## Test results

Pre-edit:  `FAILED | 458 passed | 14 failed`
Post-edit: `FAILED | 464 passed |  8 failed`

Delta: exactly -6 failures, +6 passes.

## Residual failures (8)

All 8 remaining failures are the expected A1 + A2 patterns:
- **A1 — factory/fn pattern (6):** 06-functions-closures blocks 22, 34; 07-async-concurrency block 31; 08-performance blocks 23, 24; 11-documentation block 10
- **A2 — try-as-expression (2):** 03-error-handling blocks 4, 13

No surprises in the residual. These are closed by W-1 (remove `fn` from JS `STATEMENT_ONLY_HEADS`) and W-2 (doc pattern updates for try/block), respectively.

## Unexpected behavior

None.
