# Actual public baseline at 82f1b65b

2026-11-14. Source codex/qualified-adt-core in the named task worktree remains
82f1b65b/tree4bb6bfc9. Native release bin/lykn at the same source pin compiles
the tiny public-compile.lykn client. That client imports the ACTUAL JavaScript
reader, browser expansion adapter, shared expander reset APIs and compiler from
the absolute task source. It is not a native compiler behavioral proxy. No
import macros occur; browser adapter avoids adding a Node companion dependency.

Three direct invocations, task cwd, each source argument below, were:

    /Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn run --allow-read=/Users/oubiwann/lab/lykn,/private/tmp --no-prompt --cached-only --frozen <absolute-baseline>/public-compile.lykn -- <absolute-baseline>/<name>.lykn

Each compilation exit0, empty stderr. Compiled text was redirected to ignored
task target/lykn/arc05-s06-root/<name>.mjs. Each actual runtime invocation:

    deno run --no-config --no-prompt --no-npm --cached-only target/lykn/arc05-s06-root/<name>.mjs

| name | compile exit | runtime exit | stdout | actual failure/opposition | repaired oracle |
| --- | --- | --- | --- | --- | --- |
| typed | 0 | 1 | empty | duplicate result__gensym0 SyntaxError | exit0,7 newline |
| thread | 0 | 0 | 14 newline | outer99 captured by generated t0=7 | exit0,106 newline |
| icu | 0 | 1 | empty | _v0 selector initializer TDZ ReferenceError | exit0,5 items newline |

Adjacent original .lykn inputs, *.generated.txt (exact emitted code, retained as
evidence text), stderr and thread.stdout are the actual bytes copied from those
completed commands. Root inspected all. No expected-success SyntaxError oracle.
No product source changes or extra experiment framework. Existing shared warm
DENO_DIR/default project.json pinned compiler inputs were used; no cold-cache,
network-free availability, macro import or new dependency claim follows.
