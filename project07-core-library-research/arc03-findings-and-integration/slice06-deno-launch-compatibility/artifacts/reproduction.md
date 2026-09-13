# LC-R01 — Launcher reproduction and correction

2026-09-13, CC observation. Before source: release/0.6.x
`50608c443c452107b138cc30deda4a09ab5c7642`, clean; tree
`11c9bccbcd4e35a8543ee62f9d731174d9164543`. Planning started clean at
`45b0b45`. Deno 2.9.6 identity is in [LC-B01](build-receipt.md).

The existing `cargo test -p lykn-cli --test run_permissions` reproduced four
runtime failures, with seven tests passing. A fresh minimal Lykn program,
`(console:log "LC-MINIMAL")`, compiled to `console.log("LC-MINIMAL");`,
then exited 1 through `lykn run --no-prompt --cached-only --frozen=true`.
Its stdout requested SCRIPT_ARG or a task; the marker was absent. Stdin was
closed. The original debug binary's hash, source, emitted file, stdout/stderr,
exit and NUL-delimited fake-child argv are retained in the raw packet.
This fresh reproduction uses current source, separately from Slice04's d0bb981
condition; the original Slice04 packets and failed sources were not changed.

The actual command boundary contained `run`, `--config`, the discovered config,
the requested controls, `--`, then the absolute compiled script path. The fake
recorder establishes argument boundaries only. The actual Deno failure and
the prior CDC parser review establish why this requires correction.

Source correction `4dded883bbd321d19635e6fce233343f33803f9e` removes the inserted
pre-script separator. It prefixes only option-like local entries with `./`;
the exact `-` remains stdin. There is no canonicalization, string-lossy
conversion, eval substitution, permission injection or change to trailing
argument handling. The existing `.lykn`/`.lyk` compile-route detection remains
unchanged; this does not add remote Lykn-source compilation.

The new tests exercise four routes (standalone, workspace, JS and no-project),
spaces, a filename resembling an all-permission option, symlinked files and
directories, relative/absolute paths, file URLs, stdin and overlays. Fake argv
tests retain https/jsr/npm/data specifier spelling without evaluating packages
or asserting new protocol support. Runtime tests compare symlink imports with
direct Deno; on this runtime a symlinked entry file keeps the link location as
its relative-import base. Canonicalizing it would have changed that behavior.

The final release binary runs the original minimal program successfully. Eight
retained fresh captures also demonstrate specific NotCapable read/write denials,
scoped access, explicit all-grants, argument preservation and exit 23 through
both a compiled source route and stdin. They are separate from the 16-test
regression suite and the full source gates.

## Replay

Build the before or corrected immutable source in a fresh directory. For the
before condition, run the minimal source with `{}` project.json, a cleared
environment, private HOME/TMPDIR/DENO_DIR, null stdin, and the flags above.
The raw packet's `before/trial` retains all exact inputs and streams.

For corrected runtime captures, extract the packet as described in
[validation](validation.md), then run its infrastructure script:

```sh
bash after/replay.sh "$lc_cli" "$lc_fresh_trial"
```

Use the absolute verified corrected CLI and a new empty trial directory.
The script records check/lint/compile results and eight individual invocation
streams/exits; its exit alone is not a validation result. Inspect or compare
each result against `tooling/verify.lykn`. The script uses normal deno run;
the argv recorder is used only for its separate final capture.

The full independent replay requires the committed Rust integration tests,
canonical source gates and binary reconciliation, not just these eight captures.
