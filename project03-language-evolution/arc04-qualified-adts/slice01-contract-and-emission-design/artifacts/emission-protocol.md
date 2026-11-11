# Qualified ADT emission protocol — iteration02 proposal

**Status:** bounded proposal for review. No candidate compiler, fixture, esbuild cell, gzip, or replay was run. QD-04 remains open; implementation readiness and operator agreement precede execution.

## Comparison boundary

Compare only qualified-case reference lowering/linkage. Both candidates use the same single physical producer module, fresh per-evaluated-owner `Symbol()` token, case functions and unit values, frozen namespace facade, representation/descriptors, initialization position, metadata schema, runtime predicates, public exports and DTS. No separately cached case/identity sidecars: separate evaluations such as `producer.js?one` and `producer.js?two` must receive separate tokens.

- **L1 — facade access:** local and imported statically resolved references read the actual namespace member. A fielded call has the semantic evaluation order of `(Label, Label.Text)(arg())`; extracted and unit cases likewise read `Label` before yielding the member/value.
- **L2 — selective linkage:** statically resolved references use local case bindings or named `__lykn_adt_v1_case_Label_Text` imports from the same producer. Keep the actual qualifier read before arguments: `(Label, importedText)(arg())`; extraction and unit values sequence `(Label, importedCase)` first. The facade remains exported and supports escapes/dynamic access. `(get Label key)` and unknown runtime objects use ordinary member access; no general object property optimization is added.

The independent variable is reference lowering, not owner encoding, namespace, or package ABI. Both layouts export the same names from the same producer: `Label`, `__lykn_adt_v1_owner_Label`, and `__lykn_adt_v1_case_Label_{MissingField,NullField,Text}`. No helper member is added to `Label`. Public namespace imports and `export *` remain banned; no compiler-owned namespace import is needed. Both layouts work for single-file `lykn(source)`/stdout compilation and compiler-produced modules. L2 selectivity applies to statically resolved Lykn source, not arbitrary handwritten JS `Label.Text` clients. Package output retains public ABI exports; application bundling may remove only unobserved code with effects preserved.

Illustrative imported reference, using Lykn's actual import syntax:

```lykn
(import "./label.js" (Label))
(Label:Text "hello")
```

```js
// L1 illustrative only
(Label, Label.Text)("hello");
// L2 illustrative only
(Label, __lykn_adt_v1_case_Label_Text)("hello");
```

Lowercase alias resolution is mandatory:

```lykn
(import "./label.js" ((alias Label label)))
label:MissingField
```

Here `label:MissingField` is a zero-field **value**, not a call.

## Fixture sources, graph, and observations

Every consumer has `entry.lykn`; imported cases also have producer files. The common public producer `label.lykn` is exactly:

```lykn
(export (type Label MissingField NullField (Text :string value)))
```

All examples are uncompiled design inputs. Fixture source bytes, interface JSON and hashes are frozen after the compiler supports this syntax. `console:log` is used for visible results; no unspecified `print` helper is assumed. For C3/C4, patterns expose result strings without relying on object-print formatting.

### C1 — unused pure producer

Graph: `entry.lykn` imports `label.lykn`; no other producer exists.

```lykn
(import "./label.js" (Label))
(console:log "ok")
```

Expected stdout: `ok`. Retain zero producer ADT contribution (owner token, cases, facade, or case-membership data attributable only to the unused ADT); account for ordinary entry wrapper separately. Compiler-owned initialization-purity provenance is prerequisite. If initialization remains effectful and the target is missed, the candidate fails; no extra baseline cell is allowed.

### C2 — one statically selected case across an import

Graph: `entry.lykn` imports the single `label.lykn` producer.

```lykn
(import "./label.js" (Label))
(func text-arg ()
  (console:log "argument")
  "hello")
(console:log
  (match (Label:Text (text-arg))
    ((Label:Text value) value)
    (_ "bad")))
```

Expected stdout lines: `argument`, `hello`. Keep Text constructor and match behavior; L2 must remove unused MissingField and NullField constructor bodies without dropping/reordering the effectful argument. L1 is measured and may fail this fixed target. Itemize retained closed-owner/case guard strings separately from constructor bodies; string absence alone does not prove body removal.

### C3 — all cases used

Graph: `entry.lykn` imports `label.lykn`.

```lykn
(import "./label.js" (Label))
(console:log
  (match Label:MissingField
    ((Label:MissingField) "missing") (_ "bad")))
(console:log
  (match Label:NullField
    ((Label:NullField) "null") (_ "bad")))
(console:log
  (match (Label:Text "hello")
    ((Label:Text value) value) (_ "bad")))
```

Expected stdout lines: `missing`, `null`, `hello`. All case behavior and required owner/match support remain. The zero-field construction expressions are values.

### C4 — same spelling, distinct owners

Graph: `left.lykn`, `right.lykn` each declare/export their own `Label`; `entry.lykn` imports both.

```lykn
(import "./left.js" ((alias Label Left)))
(import "./right.js" ((alias Label Right)))
(bind left (Left:Text "left"))
(bind right (Right:Text "right"))
(console:log
  (match left
    ((Left:Text value) value)
    ((Right:Text _) "wrong-owner")
    (_ "no-match")))
(console:log
  (match right
    ((Right:Text value) value)
    ((Left:Text _) "wrong-owner")
    (_ "no-match")))
(console:log "separate")
```

Expected stdout lines: `left`, `right`, `separate`; no cross-owner arm fires. The negative control is inside this consumer, not another cell. Both tokens and consumed cases remain.

### C5 — escaped and dynamic namespace with effects

Graph: `entry.lykn` imports `label.lykn`; the entry exports the namespace and performs an effectful key computation.

```lykn
(import "./label.js" (Label))
(func effectfulKey ()
  (console:log "key-effect")
  "Text")
(exports Label)
(bind dynamicCase (get Label (effectfulKey)))
(bind dynamicValue (dynamicCase "hello"))
(console:log
  (match dynamicValue
    ((Label:Text value) value) (_ "bad")))
```

Expected stdout lines: `key-effect`, `hello`; the effectful key computation runs exactly once. Invoking the dynamically obtained fielded case yields a Label Text value with `tag` Text and `value` hello; the exported Label facade can still reveal all three declared members. The harness records the actual generated value/own properties and effects without assuming default console object formatting. Preserve ordering and all escaped/dynamic members. This is compiler-produced Lykn, not an extra handwritten-JS cell.

### C6 — two aliases, including lowercase

Graph: `entry.lykn` imports the same `label.lykn` owner twice under different local names.

```lykn
(import "./label.js" ((alias Label label)))
(import "./label.js" ((alias Label Renamed)))
(bind first (label:Text "same-owner"))
(console:log
  (match first
    ((Renamed:Text value) value)
    (_ "wrong-owner")))
```

Expected stdout: `same-owner`; the second alias matches the first alias's value because both retain the same `OwnerRef` and runtime token. L1 uses each facade; L2 uses the same named case ABI imports while preserving each actual qualifier read.

The separate semantic-regression population must cover alias TDZ before argument effects, raw/null/primitive subjects, stripped dispatch, foreign getters, normalization/reserved-name collisions, serialization/reconstruction and repeated-call isolation. Those cases do not increase the bundle denominator. Package export and DTS checks are also separately scoped, not hidden bundle cells.

## Frozen population: exactly 24 unique cells

`2 layouts × 6 consumers × 2 settings = 24 bundle cells per contributor`, one esbuild invocation per key. The full manifest keys are:

| Layout | Unminified keys | Minified keys |
| --- | --- | --- |
| L1 | L1-C1-unminified, L1-C2-unminified, L1-C3-unminified, L1-C4-unminified, L1-C5-unminified, L1-C6-unminified | L1-C1-minified, L1-C2-minified, L1-C3-minified, L1-C4-minified, L1-C5-minified, L1-C6-minified |
| L2 | L2-C1-unminified, L2-C2-unminified, L2-C3-unminified, L2-C4-unminified, L2-C5-unminified, L2-C6-unminified | L2-C1-minified, L2-C2-minified, L2-C3-minified, L2-C4-minified, L2-C5-minified, L2-C6-minified |

Independent replay is reported separately. No extra baseline or hidden negative-control bundle is added. Zero unused ADT code and unused statically unselected case-body removal are fixed pass targets; a miss remains a miss. C5's escaped/dynamic members and application effects must remain observable.

## Tools, routes, command template, and evidence

Read-only receipts available from earlier preparation: pinned native esbuild 0.25.5 executable `/Users/oubiwann/lab/lykn/lang/.worktrees/native-esbuild-controls/target/lykn/tools/esbuild-0.25.5/bin/esbuild`, source commit `ea453bf687c8e5cf3c5f11aae372c5ca33be0c98`, executable SHA-256 `b26c07a69bc734c1661ee3180bc2a8b71ee860826a866393e94c519cda46fe1f`; `/usr/bin/gzip` was available. Deno 2.9.6 was `/opt/homebrew/bin/deno`, SHA-256 `2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74`. Slice plan's native CLI digest is `0cf695212c617b413f0d54fbfc1d0134da1361c33eba4bf627c13f9cb550e4a2`. These are provenance/availability receipts, not gate execution. Reconfirm tool identity and freeze both implemented candidate commits/binary hashes before execution.

Compile each source through the ordinary route `lykn compile <absolute fixture input> -o <absolute generated output>`; `main.rs` accepts the input path immediately after `compile` and `-o` output, without a preceding separator. Use normal `lykn build` for the graph build and `lykn dist` for package staging. Do not invent a launcher option. Use the accepted run-02 Deno 2.9.6 command shape: `env -i PATH=/opt/homebrew/bin:/usr/bin:/bin DENO_DIR=<frozen-cache> DENO_NO_UPDATE_CHECK=1 NO_COLOR=1 /opt/homebrew/bin/deno run --no-config --cached-only --no-npm --no-remote --deny-net --no-prompt --allow-read=<workspace>,<out> --allow-write=<out> --allow-run=<absolute-esbuild>,/usr/bin/gzip,/opt/homebrew/bin/deno <workspace>/target/lykn/build/driver.js <workspace> <out> <absolute-esbuild> /usr/bin/gzip /opt/homebrew/bin/deno gate`. This uses the accepted invocation profile with gzip explicitly added because the harness derives gzip. Freeze the actual cache path and argv. Candidate CLI compilation occurs before the driver and therefore does not need a driver run permission; the driver captures child code/stdout/stderr before assertions. This remains an unexecuted template.

For every generated entry and output setting, the future esbuild argv is:

```text
<absolute-esbuild> --bundle --tree-shaking=true --format=esm --platform=neutral --target=es2022 --metafile=<absolute-out>/<key>.meta.json --outfile=<absolute-out>/<key>.js <absolute-workspace>/<entry.js>
```

The paired minified invocation adds only `--minify`, with distinct output/metafile paths. Freeze argv, cwd and environment. Capture tool identity, candidate pins, fixture/interface hashes, input/module sizes, exit/stdout/stderr, emitted bytes/hash, full metafile and runtime/effect/export oracles. Derive gzip from minified bytes only: `/usr/bin/gzip -n -9 -c < /absolute/path/to/minified.js > /absolute/path/to/minified.js.gz`; record exit and gzip hash. Report unminified bytes, minified bytes, and gzip-of-minified bytes.

At a pre-execution checkpoint freeze actual candidate revisions/binaries, complete fixture and interface bytes/hashes, all 24 keys, tools/full hashes, exact argv/cwd/permissions, expected values/effects/exports, source-body classification and independent oracles. Operator agreement precedes execution. Keep full unminified output, source bodies, metafile and runtime/effect/export evidence. A byte count or absent minified name is insufficient. Account for guard case-name strings separately from constructor bodies. Both public ABI exports and DTS are checked at their later package conformance boundary.

## Increment sequencing recommendation

Recommend seven arc increments for root's disposition: S01 this design; S02 existing NPAT/ZVAR repairs; S03 local qualified nominal core, host-contract and compiler-owned purity foundation, per-unit state and native/public single-file parity; S04 imported interface graph/ABI plus the two same-module emitters and agreed 24-cell gate; S05 actual build/package plus repinned JSON-decoder composition; S06 full API/docs audit; S07 conditional documentation implementation. The current source has no PURE/PureCall facility: S03 must add and verify typed/private purity provenance rather than hand comments or a public purity form. Root owns arc-plan updates. This sequence is not itself a plan edit or permission to execute the gate.
