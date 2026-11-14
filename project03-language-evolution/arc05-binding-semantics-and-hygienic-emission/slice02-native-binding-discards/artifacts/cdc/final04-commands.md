# Independent final04 commands and artifact index

Reviewer: OpenAI gpt-6.1-sol/high `/root/arc05_s02_cdc`.
Source: `9e6fb1270c3efcbaa0f6ddb9f0fbfd3b2c1c825a`, tree
`6d64692fde0c367e73deeda1ec1aca19e49d6b93`.
All source commands ran in
`/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`.

Explicit environment for execution:

```text
DENO_DIR=/Users/oubiwann/Library/Caches/deno
XDG_CACHE_HOME=/private/tmp/lykn-arc05-s02-cdc/xdg
NPM_CONFIG_CACHE=/private/tmp/lykn-arc05-s02-cdc/npm
TMPDIR=/private/tmp/lykn-arc05-s02-cdc/tmp
```

The full gate additionally used the precreated absolute
`LYKN_MACRO_DEPENDENCIES_EVIDENCE_DIR=/Users/oubiwann/lab/lykn/lang/.worktrees/planning/project03-language-evolution/arc05-binding-semantics-and-hygienic-emission/slice02-native-binding-discards/artifacts/cdc/m6-final04`.
It is distinct from the earlier interrupted gate's evidence directory.

| Actual command | Receipt stem | Exit/observation |
| --- | --- | --- |
| `make fresh-artifacts` | final04-fresh-artifacts | 0; precedes staged consumers |
| `cargo test -p lykn-lang --test remaining_discard_bindings --test discard_bindings -- --nocapture` | final04-focused-native | 0; 24 new and23 legacy |
| `cargo test -p lykn-cli --test remaining_discard_bindings --test variadic_for_bodies -- --nocapture` | final04-focused-cli | 0; 2 new and2 variadic |
| `make check` | final04-make-check | 0; full/docs once at final source |
| `make check-cited-paths` | final04-cited-paths | 0; final HEAD64 docs/601 historical citations |
| `make bundle-size-check` | final04-bundle-size | 0; fresh gzip47747 below81920 |

Each stem has exact stdout/stderr/exit files. Native focused session23985 and
full gate session13670 completed naturally0; other final commands completed
within their initial tool calls. No owned session remains running.

Pure Lykn static-role consumer source was written before execution as
`final04-static-pipe-roles.lykn`; expected output was independently declared in
`final04-static-pipe-roles.expected.stdout`. With the environment above:

```sh
target/release/lykn compile /Users/oubiwann/lab/lykn/lang/.worktrees/planning/project03-language-evolution/arc05-binding-semantics-and-hygienic-emission/slice02-native-binding-discards/artifacts/cdc/final04-static-pipe-roles.lykn -o target/arc05-s02-cdc/final04-static-pipe-roles.mjs
deno run --config project.json target/arc05-s02-cdc/final04-static-pipe-roles.mjs
```

Compile/runtime stems `final04-static-pipe-{compile,runtime}` each have raw
triplets, both exit0. The generated module is preserved as
`final04-static-pipe-roles.generated.mjs`. `diff -u` against the expected file
passed, runtime stderr is0 bytes; stdout is `99 3` plus newline. This proves
Atom/Keyword/literal String pipe-key getter reads through an actual native CLI
consumer, with all logic authored in Lykn.

Two balanced member-expression inputs copied before execution are
`final04-colon-key.lykn` and `final04-dotted-key.lykn`. For each, actual commands
were `target/release/lykn check <absolute input>`,
`target/release/lykn compile <absolute input> -o <destination>`, and
`target/release/lykn compile --strip-assertions <absolute input> -o <destination>`.
Destinations under `target/arc05-s02-cdc/` were `rejected-colon.mjs`,
`rejected-colon-strip.mjs`, `rejected-dotted.mjs`, `rejected-dotted-strip.mjs`.
The six raw receipt stems are `colon-{check,checked,strip}` and
`dotted-{check,checked,strip}`. All statuses are1, stdout empty, stderr carries
the early `bind group name must be an atom or destructuring pattern` diagnostic
at1:7, and all four JS destinations were verified absent. The shell's final
copy returned0; that outer status is not substituted for individual statuses.

`m6-final04/` holds actual standalone embedded command/source/generated/status/
streams, strict public command/config/status/streams and14 per-module comparison
records. Both child statuses are0, strict output62/0, every comparison records
canonical_equals_embedded=true and canonical_equals_materialized=true. Captured
config maps lang to fresh materialized embedded bytes and browser to staged
browser output. Test selection and command permissions are repository-owned;
no selection or permission broadening was authored by the reviewer.

Final pin/status/commit/delivery diff are `final04-source-{pin,status,commit}.txt`
and `final04-delivery.diff`. Source status file is empty. The retained malformed
08ba commit object's hash was independently recomputed read-only as
`08ba3743440aaccdbfd1a999ca47fe296a92c720`; this does not claim its original
trailer was valid. Earlier reviewer/CC failures and unexecuted specimens remain.

Limits: JSR end-to-end self-skipped because jsr.io was unreachable; full product
reported1570/67steps, docs482/0 with15 no-block entries. Bundle gate fetched
existing esbuild registry data and emitted four astring condition-order warnings.
Warm shared Deno and fresh owned M6 XDG are distinct; no entirely-offline claim.
