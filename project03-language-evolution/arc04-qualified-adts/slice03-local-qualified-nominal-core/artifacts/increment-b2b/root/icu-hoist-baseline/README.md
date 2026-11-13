# Native ICU generated-local capture baseline

Root production-check preparation on 2026-11-13, within accepted B2-ID-NAME
implementation authority. Source5554a4d6, treef632c415; ICU product code is
unchanged from cf432622. The executable is the retained cf build, not a newly
built5554 binary:

`/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/bin/lykn`
SHA256 `0ff85708c7c8a51672e1891cad8cffe0215243586b945aa5c07ed9b60dce34f3`.

Each command ran from `/private/tmp/lykn-b2b-author`, with
DENO_DIR=/Users/oubiwann/Library/Caches/deno,
XDG_CACHE_HOME=/private/tmp/lykn-b2b-author/xdg,
NPM_CONFIG_CACHE=/private/tmp/lykn-b2b-author/npm,
TMPDIR=/private/tmp/lykn-b2b-author/tmp. These existed outside all repo/config
ancestors. No helper program or Python ran.

Direct invocations (absolute fixture home is this directory):

```text
env <the four variables above> <binary above> compile <fixture.lykn> -o /private/tmp/lykn-b2b-author/<output>.mjs
env <the four variables above> deno run --no-config --cached-only --no-npm --no-remote --deny-net --no-prompt /private/tmp/lykn-b2b-author/<output>.mjs
```

| Fixture | Output | Compile | Runtime | Observed |
| --- | --- | --- | --- | --- |
| source.lykn | icu-hoist.mjs | 0 | 1 | const _n = _n + 1; ReferenceError TDZ |
| control.lykn | control.mjs | 0 | 0 | exact stdout 3 3 newline |
| plural.lykn | plural.mjs | 0 | 1 | const _v0 = _v0; ReferenceError TDZ |

Raw stdout/stderr/numeric statuses and copied generated ESM are adjacent.
The source fixture uses unprefixed compile/runtime/generated filenames; the
other two use control-/plural- prefixes. Numeric status files were written
from the actual tool results immediately after invocation. This explanatory
command record was written afterwards; original exact invocations survive in
the root tool trace. It is not a prewritten execution receipt.

Both failures are generated-name capture, distinct from source binding lookup.
A native-only allocator repair must not claim public JS or ordinary user-name
hygiene acceptance. The positive control distinguishes a syntax/setup error.
