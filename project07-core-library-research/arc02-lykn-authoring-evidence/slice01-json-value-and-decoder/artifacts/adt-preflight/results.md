# JSON ADT preflight

On 2026-11-10 the native CLI and public ESM compiler both produced the
same nine observations with the default checks. Source
`685bbe1dbbfdaf34ecf49017c22e43f7dc8adb95`, tree
`f53a818928d752b842f8af2c3933aad4d82f9117`, task CLI SHA-256
`0cf695212c617b413f0d54fbfc1d0134da1361c33eba4bf627c13f9cb550e4a2`,
Deno 2.9.6 aarch64 macOS SHA-256
`2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74`.
The [original Lykn source](probe.lykn) and [predictions](expectations.md)
were frozen before compiling.

| Observation | Default | Stripped native |
| --- | --- | --- |
| Six JSON shapes and exact string key | Represented as tagged objects and entry values | Same |
| Wrong scalar and wrong outer array shape | Both throw TypeError at construction | Both accepted |
| Wrong array member | Accepted inside the checked outer array | Same |
| Unrelated tagged value at a JsonValue field | Accepted | Same |
| Forged JsonNumber tag and wrong payload | Tag check and match accept the payload | Same |
| Object without a tag | Function argument throws TypeError | Accepted |
| Omitted match arm | Compiles, then throws at runtime | Same |

The native `JsonValue` guard checks object shape and presence of
`tag`. The match checks the selected tag and takes the named payload.
This turns the narrow source observation in
[NE-T02](../../../../../project03-language-evolution/BACKLOG.md#ne-t02--user-type-annotation-guard-is-only-tagged-object-shaped)
into an executed witness on the current compiler. A JSON decoder will
need explicit recursive checks and an error path. Constructor checks
alone leave nested and tagged-object cases open.

The native formatter produced identical bytes on its second pass.
`lykn check` passed and the formatted source produced identical JS and
stdout. The first native launch lacked the required project.json.
The public fixture's copied lock also needed a local workspace link
record. The original failed streams are retained. The successful
public comparison uses the resulting frozen lock and cached astring.

Reproduce from this directory in an isolated copy with the pinned CLI
and Deno on PATH. Put the exact `685bbe1d` `packages/lang` tree in
`public/packages/lang` and use an owned temporary and XDG cache.
Use the same local `DENO_DIR` when the public package needs its pinned
compiler dependency. Native compile and default, stripped and formatted
runtime outputs are in this packet.

```sh
mkdir -p output
lykn compile probe.lykn -o output/default.js
lykn run --cached-only --no-prompt output/default.js
lykn compile --strip-assertions probe.lykn -o output/stripped.js
lykn run --cached-only --no-prompt output/stripped.js
lykn fmt probe.lykn > formatted.lykn
lykn fmt formatted.lykn > formatted-again.lykn
cmp formatted.lykn formatted-again.lykn
lykn check formatted.lykn
lykn compile formatted.lykn -o output/formatted.js
cmp output/default.js output/formatted.js
lykn run --cached-only --no-prompt output/formatted.js
cd public
cp ../probe.lykn probe.lykn
lykn compile compile-probe.lykn -o compile-probe.js
lykn run --cached-only --frozen --no-prompt --allow-read=probe.lykn compile-probe.js > public-output.js
lykn run --cached-only --frozen --no-prompt public-output.js
```

References consulted included the Lykn skill and type/match guides
`00` and `05` at the source pin, plus the book at
`f55da0e86068ce1aa27581fe1199b68258e64f3f`. Book
`src/part2/chapter10/3-match.md:3` promises coverage of every possible
value, while the omitted-arm witness reaches the runtime fallback.
Carry that wording and the existing JSON serialization finding
at `src/part5/chapter25/2-json.md:44` into AT-05. Native compilation
also warns that the three type declaration names are unused.
The scope and cause of those warnings need review.

This exploratory control ran before the formal AT-02 assignment.
AT-02, recursive JSON decoding, the full guide evaluation and the
operator's code-shape review are open.

The independent native replay reproduced all nine observations in
each condition, all six emitted JavaScript and declaration files, and
both formatter passes. Runtime stderr was empty. Two compile runs
emitted the same three unused-binding warnings in a different order.
The native replay's [runtime outputs](replay/) retain that evidence
alongside the original outputs.
