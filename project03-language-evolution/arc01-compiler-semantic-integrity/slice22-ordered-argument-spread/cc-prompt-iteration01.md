# Correct native spread result oracles against actual output

Preserve exact product freeze `1abb8946` and both current native
attempts. The first did not use the required scoped DENO_DIR and
had unrelated macro-cache failures. The pinned retry passed 51 of
53. Its two reds are native assertion shape, not runtime failure.

Correct only `crates/lykn-cli/tests/semantic_roles.rs`. The actual
ordinary computed call is `(saved[key])(...items)`. Match the
printer's `])(...items)` tail after the actual `return 7` while
retaining complete generated capture and exact no-helper/import
assertions. For F3 preserve the exact frozen source and full actual
stderr including the separate existing unused-binding warning.

```text
1:7: warning: unused binding 'malformed-spread'
  suggestion: prefix with underscore: _malformed-spread
2:11: error: spread takes exactly one argument
```

All three lines end in LF. Keep exact exit 1, empty stdout, no JS
or DTS, and no execution. No product, source-fixture, public test,
or population change. Use supplied `correction01-message.txt`
and return immutable freeze. This is refinement 01 of five.
