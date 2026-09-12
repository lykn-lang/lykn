# Original run-permission reproduction

Date: 2026-09-12. Strength: CC observed/attested; CDC pending.

Source worktree: `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x`,
`release/0.6.x`, clean at `2a0cabf80fcc881c47995421b579244b3b7fb19c`.
The inspected `cmd_run` contains unconditional `-A` in both its Lykn and JS
branches. The existing executable is `bin/lykn`, version `0.6.0-dev`;
its bytes reproduce the defect but do not establish historical build provenance.
B01 and its CDC drift record remain unchanged.

## Isolated child capture

A disposable directory contains `project.json` with
`{"workspace":["packages/demo"],"imports":{}}`, package `deno.json` with
`{"name":"@fixture/demo","version":"0.0.0","exports":"./main.lykn"}`,
and standalone/workspace source `(console:log "fixture")`.
`lykn compile standalone.lykn -o generated.js` supplies the JS route.
The child named `deno` is a local shell recorder, selected only through the
Lykn subprocess's PATH; no Deno program is executed under the implicit grant:

```sh
#!/bin/sh
printf '<%s>\n' "$@"
```

Each command runs with the fixture root as CWD. Captured original output:

```text
root=/private/tmp/lykn-rp-original-c3j02gl6
binary_sha256=67517631606f0588103a35bbbc0b8cdcefb4dc9c891e4c25848d3bbe7d1912c2
command: lykn run standalone.lykn -- --allow-read=./data
exit=0
<run>
<--config>
</private/tmp/lykn-rp-original-c3j02gl6/project.json>
<-A>
</private/tmp/lykn-rp-original-c3j02gl6/target/lykn/run/standalone.js>
<--allow-read=./data>


command: lykn run packages/demo/main.lykn -- --allow-read=./data
exit=0
<run>
<--config>
</private/tmp/lykn-rp-original-c3j02gl6/project.json>
<-A>
</private/tmp/lykn-rp-original-c3j02gl6/target/lykn/build/demo/main.js>
<--allow-read=./data>


command: lykn run generated.js -- --allow-read=./data
exit=0
<run>
<--config>
</private/tmp/lykn-rp-original-c3j02gl6/project.json>
<-A>
<generated.js>
<--allow-read=./data>


```

All three invocations supply no runtime permission flags. Each launches a child
with `-A` before the program. The permission-looking argument following `--`
is correctly a script argument, but the implicit grant already permits all
access. This proves the launcher defect at the actual child boundary without
running a user workload.

## Deno parsing controls informing the correction

Direct Deno 2.7.7 runs used compiler-generated `read.js` from this Lykn source:

```lykn
(console:log (Deno:read-text-file-sync (get Deno:args 0)))
```

Command shape: `deno run --no-prompt FLAGS read.js standalone.lykn`.
No dependencies or remote imports; every accessed path is in the disposable root.

| FLAGS | Exit / observation |
| --- | --- |
| none | 1, `NotCapable: Requires read access` |
| `--allow-read` | 0, fixture source printed |
| `--allow-read=` | 1, `Empty values are not allowed` |
| `--allow-read=./standalone.lykn --allow-read=./read.lykn` | 0, scopes accumulate |
| `--allow-read --allow-read=./read.lykn` | 1, standalone path denied |
| `--allow-read=./read.lykn --allow-read` | 1, standalone path denied |

An explicit empty value must not become a bare broad grant. Deno's mixed
bare/scoped repetition retains the supplied scopes, in either order. These
observations inform regression controls; they are not JSON research trials.
