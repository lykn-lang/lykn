# Qualified ADT emission protocol — iteration03 proposal

**Status:** CC protocol proposal for independent review. QD-04 remains open. No fixture was compiled and no esbuild, Deno observer, runtime, gzip, or replay command was executed. Operator agreement and source-ready candidates are prerequisites.

## Fixed candidate comparison

Compare only qualified-case reference lowering/linkage. Both candidates use the same single physical producer module; fresh `Symbol()` per evaluated owner; identical case functions/unit values, namespace facade, runtime representation/descriptors, declaration-position initialization, interface graph, owner/case guards, runtime ABI exports and DTS. No separate owner/case sidecars. Distinct loader module identities remain distinct even for identical bytes and allocate different tokens.

- **L1 — facade access:** a statically resolved local/imported reference uses the actual namespace case member. Calls, extraction, and unit-value lookup evaluate/read the actual qualifier before arguments/result.
- **L2 — selective case linkage:** statically resolved references use a local case binding or the case ABI named export from the same actual producer module. Preserve the actual qualifier read before arguments: equivalent to `(Label, importedText)(argument())`. Patterns keep owner-token imports from the actual boundary and read their source qualifier when each clause is tried. Facade remains for escape/export/dynamic use. Dynamic `(get Label key)` and unknown objects remain ordinary operations.

The independent variable is reference lowering, not identity, namespace shape or public ABI. Both candidates export the same producer names (`Label`, owner token and every case) from the same module. L2 benefits statically resolved Lykn; no equal pruning claim is made for arbitrary handwritten JS namespace access or dynamic gets. Public namespace imports and `export *` remain banned.

## Fixture source and file graphs

The shared producer source `label.lykn` is:

```lykn
(export (type Label MissingField NullField (Text :string value)))
```

C4 has two producer files with identical declaration bytes at distinct module identities:

```lykn
;; left.lykn
(export (type Label MissingField NullField (Text :string value)))

;; right.lykn (same source bytes; a different module identity)
(export (type Label MissingField NullField (Text :string value)))
```

Each consumer has its own `entry.lykn`. Generate its `.js` modules through the normal candidate compiler/module graph. The snippets are exact proposed source, uncompiled. Compile C2/C5 zero-argument functions with keyword `:args ()`/`:body` syntax so their bodies are not misread as parameter lists. All observations use visible `console:log` or the separate Lykn observer below; no unexplained helper is assumed.

### C1 — unused pure ADT

Graph: `entry.lykn` imports `label.lykn` and does not use the binding.

```lykn
(import "./label.js" (Label))
(console:log "ok")
```

Expected consumer stdout: `ok`. Fixed retention target: zero producer ADT contribution, including token, cases, namespace and ADT-only membership data; account for ordinary consumer/wrapper code separately. This is conditional on the compiler-owned, verified initialization-purity prerequisite. A missed target is a candidate failure, not a reason to relabel the fixture.

### C2 — one selected imported case, ordered effect

Graph: `entry.lykn` imports the single `label.lykn` producer.

```lykn
(import "./label.js" (Label))
(func text-arg
  :args ()
  :returns :string
  :body (console:log "argument") "hello")
(console:log
  (match (Label:Text (text-arg))
    ((Label:Text value) value)
    (_ "bad")))
```

Expected bundle stdout, exactly: `argument\nhello\n`. C2 verifies that L2's imported static case selection removes MissingField/NullField constructor bodies without dropping or reordering the argument effect. L1 is measured and may fail this fixed retention target. Closed owner/case guard strings are itemized separately from constructor bodies; name absence alone is not proof.

### C3 — all cases

Graph: `entry.lykn` imports `label.lykn`.

```lykn
(import "./label.js" (Label))
(console:log
  (match Label:MissingField
    (Label:MissingField "missing")
    (_ "bad")))
(console:log
  (match Label:NullField
    (Label:NullField "null")
    (_ "bad")))
(console:log
  (match (Label:Text "hello")
    ((Label:Text value) value)
    (_ "bad")))
```

Expected bundle stdout, exactly: `missing\nnull\nhello\n`. All three public cases and needed owner/match behavior remain. `Label:MissingField` and `Label:NullField` in expression position are zero-case values; the bare case forms in their match clauses are patterns.

### C4 — distinct owners, positive and negative controls

Graph: `left.lykn` and `right.lykn` above; `entry.lykn` imports both. Every match below has only one constructor owner at its root.

```lykn
(import "./left.js" ((alias Label Left)))
(import "./right.js" ((alias Label Right)))
(bind left (Left:Text "left"))
(bind right (Right:Text "right"))
(console:log
  (match left
    ((Left:Text value) value)
    (_ "left-fallback")))
(console:log
  (match right
    ((Right:Text value) value)
    (_ "right-fallback")))
(console:log
  (match left
    ((Right:Text _) "wrong-owner")
    (_ "left-is-not-right")))
(console:log
  (match right
    ((Left:Text _) "wrong-owner")
    (_ "right-is-not-left")))
```

Expected stdout, exactly: `left\nright\nleft-is-not-right\nright-is-not-left\n`. A tag-only matcher emits `wrong-owner` in one/both negative controls and fails. Do not combine owners in a single match or put a correct-owner arm before the negative control. This preserves the existing mixed-root-owner diagnostic. Distinct module identities/tokens and both constructors are retained.

### C5 — escaped namespace, dynamic selection and observable descriptors

Bundle graph: `entry.lykn` imports `label.lykn`, exports the local escaped namespace and observed dynamic value.

```lykn
(import "./label.js" (Label))
(func text-key
  :args ()
  :returns :string
  :body (console:log "key-effect") "Text")
(bind case-function (get Label (text-key)))
(bind observed (case-function "hello"))
(bind escaped Label)
(exports escaped observed)
```

The bundle itself emits only `key-effect\n`; its dynamic value and namespace are inspected by an external Lykn observer compiled once using the accepted common compiler and kept OUTSIDE every bundled graph. `Deno:args` contains the bundle file URL then family name. Each process imports the bundle once with `(await (dynamic-import target))`. For C1–C4 and C6, it imports the entry and emits no observer output. For C5, the observer reads `loaded:escaped` and `loaded:observed`, makes a control with `(escaped:Text "control")`, checks scalar properties, and emits exactly:

```text
key-effect
members MissingField,NullField,Text
namespace-frozen true
missing-frozen true
null-frozen true
observed-tag Text
observed-value hello
brand-descriptor true
brand-same-owner true
tag-descriptor true
payload-descriptor true
```

The effectful key runs exactly once. The full Lykn observer source is:

```lykn
(async (func inspect-c5
  :args (:any loaded)
  :returns :void
  :body
  (bind escaped loaded:escaped)
  (bind observed loaded:observed)
  (bind control (escaped:Text "control"))
  (bind missing-unit escaped:MissingField)
  (bind null-unit escaped:NullField)
  (bind brand-key (Symbol:for "lykn.adt.owner.v1"))
  (bind observed-brand (get observed brand-key))
  (bind control-brand (get control brand-key))
  (bind same-owner
    (and (= (typeof observed-brand) "symbol")
      (= observed-brand control-brand)))
  (bind brand-desc (Object:getOwnPropertyDescriptor observed brand-key))
  (bind tag-desc (Object:getOwnPropertyDescriptor observed "tag"))
  (bind payload-desc (Object:getOwnPropertyDescriptor observed "value"))
  (bind members (Object:getOwnPropertyNames escaped))
  (members:sort)
  (bind member-list (members:join ","))
  (bind brand-ok
    (? brand-desc
      (and same-owner
        (= brand-desc:value observed-brand)
        (= brand-desc:enumerable false)
        (= brand-desc:writable false)
        (= brand-desc:configurable false))
      false))
  (bind tag-ok
    (? tag-desc
      (and (= tag-desc:value "Text")
        (= tag-desc:enumerable true)
        (= tag-desc:writable false)
        (= tag-desc:configurable false))
      false))
  (bind payload-ok
    (? payload-desc
      (and (= payload-desc:value "hello")
        (= payload-desc:enumerable true)
        (= payload-desc:writable true)
        (= payload-desc:configurable true))
      false))
  (bind missing-ok
    (? missing-unit
      (and (= (typeof missing-unit) "object")
        (!= missing-unit null)
        (= missing-unit:tag "MissingField")
        (= (typeof observed-brand) "symbol")
        (= (get missing-unit brand-key) observed-brand)
        (Object:isFrozen missing-unit))
      false))
  (bind null-ok
    (? null-unit
      (and (= (typeof null-unit) "object")
        (!= null-unit null)
        (= null-unit:tag "NullField")
        (= (typeof observed-brand) "symbol")
        (= (get null-unit brand-key) observed-brand)
        (Object:isFrozen null-unit))
      false))
  (console:log "members" member-list)
  (console:log "namespace-frozen" (Object:isFrozen escaped))
  (console:log "missing-frozen" missing-ok)
  (console:log "null-frozen" null-ok)
  (console:log "observed-tag" observed:tag)
  (console:log "observed-value" observed:value)
  (console:log "brand-descriptor" brand-ok)
  (console:log "brand-same-owner" same-owner)
  (console:log "tag-descriptor" tag-ok)
  (console:log "payload-descriptor" payload-ok)))
(bind args Deno:args)
(bind target (get args "0"))
(bind family (get args "1"))
(bind loaded (await (dynamic-import target)))
(if (= family "C5")
  (await (inspect-c5 loaded))
  null)
```

`Object:getOwnPropertyDescriptor` returns an absent descriptor rather than causing an observer-side property read. Each descriptor oracle is an explicit conditional and returns false if its descriptor is missing. The sorted own-name list checks all and only the three public string case members. The brand oracle checks an own brand descriptor, requires its value to have type `symbol`, compares the observed value's owner token with a control from the escaped namespace, and checks all required descriptor flags. Unit checks require a real non-null object, the exact unit tag, the same owner brand, and frozen status; `Object:isFrozen(undefined/null)` alone would be insufficient. Namespace and both unit values are checked frozen; tag and payload descriptors check their exact values and flags. The observer does not use handwritten JS/Python/Ruby or a runtime helper.

Observer child invocation per bundle cell (fresh Deno process; `target` is a `file:` URL for that cell's `<key>.js`):

```text
env -i PATH=/opt/homebrew/bin:/usr/bin:/bin DENO_DIR=<frozen-cache> DENO_NO_UPDATE_CHECK=1 NO_COLOR=1 /opt/homebrew/bin/deno run --no-config --cached-only --no-npm --no-remote --deny-net --no-prompt --allow-read=<workspace>,<out> <workspace>/target/lykn/build/adt-observer.js <file-url-for-key-js> <C1|C2|C3|C4|C5|C6>
```

Compile this observer once before the gate using the accepted common compiler's normal `lykn compile <absolute-file> -o <absolute-file>` route. Launch one observer process for each of the 24 bundle outputs: 24 bundle observations are reported separately from 24 esbuild invocations. Observer stdout is captured with that cell's runtime transcript; candidate compiler diagnostics/warnings/stderr remain separate from runtime stderr. It runs no subprocess and needs read access only to the workspace/outputs. For C1–C4/C6 it imports once and adds no output; their consumer stdout remains visible. For C5 the bundle writes `key-effect` and the observer then writes the descriptor projection above.

### C6 — two aliases, including lowercase

Graph: one `label.lykn` producer; entry imports the same boundary twice.

```lykn
(import "./label.js" ((alias Label label)))
(import "./label.js" ((alias Label Renamed)))
(bind first (label:Text "same-owner"))
(console:log
  (match first
    ((Renamed:Text value) value)
    (_ "wrong-owner")))
```

Expected bundle stdout exactly `same-owner\n`. Both aliases resolve to the same OwnerRef/token. L1 uses their facade accesses; L2 uses the same-producer named case ABI while preserving each source qualifier read.

## Exact 24-cell population and tooling

The unique bundle denominator remains exactly `2 layouts × 6 consumers × 2 settings = 24 esbuild invocations per contributor`. Full keys:

| Layout | Unminified | Minified |
| --- | --- | --- |
| L1 | L1-C1-unminified, L1-C2-unminified, L1-C3-unminified, L1-C4-unminified, L1-C5-unminified, L1-C6-unminified | L1-C1-minified, L1-C2-minified, L1-C3-minified, L1-C4-minified, L1-C5-minified, L1-C6-minified |
| L2 | L2-C1-unminified, L2-C2-unminified, L2-C3-unminified, L2-C4-unminified, L2-C5-unminified, L2-C6-unminified | L2-C1-minified, L2-C2-minified, L2-C3-minified, L2-C4-minified, L2-C5-minified, L2-C6-minified |

Independent replay is separate and does not increase the unique-cell count. Known read-only receipts: native esbuild 0.25.5 at `/Users/oubiwann/lab/lykn/lang/.worktrees/native-esbuild-controls/target/lykn/tools/esbuild-0.25.5/bin/esbuild`, source `ea453bf687c8e5cf3c5f11aae372c5ca33be0c98`, executable SHA-256 `b26c07a69bc734c1661ee3180bc2a8b71ee860826a866393e94c519cda46fe1f`; `/usr/bin/gzip`; Deno 2.9.6 `/opt/homebrew/bin/deno`, SHA-256 `2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74`; native CLI digest in the slice plan `0cf695212c617b413f0d54fbfc1d0134da1361c33eba4bf627c13f9cb550e4a2`. These are not gate executions. Candidate source/binary identities and complete fixture hashes do not exist until implementation.

Generate each module and the Lykn observer before the gate through the normal native CLI route `lykn compile <absolute source> -o <absolute output>`; use `lykn build` for the module graph and `lykn dist` for package staging. Deno invocation profile is the accepted 2.9.6 run-02 shape with `--no-config --cached-only --no-npm --no-remote --deny-net --no-prompt`; input source path is before any script args, with no pre-script `--`. The future Lykn driver runs only the esbuild/gzip/runtime-observer children with explicit executable, cwd, stdin null and piped output; preserve raw exit/stdout/stderr before assertions. Grant run permission only to those exact pinned executable paths. Compilation is a pre-driver CLI action, so no CLI run permission is needed by the driver. The observer itself receives no run or write permission.

Each bundle invocation uses:

```text
<absolute-esbuild> --bundle --tree-shaking=true --format=esm --platform=neutral --target=es2022 --metafile=<absolute-out>/<key>.meta.json --outfile=<absolute-out>/<key>.js <absolute-workspace>/<entry.js>
```

Minified partner adds only `--minify`, with distinct paths. Freeze argv, cwd and environment. Capture complete candidate/source/fixture/interface hashes, module/input sizes, exact exits/stdout/stderr, output bytes/hash, metafile, source-body classification, runtime/effect/export projection, and observer transcript. Derive gzip solely from minified bytes using `/usr/bin/gzip -n -9 -c < /absolute/path/to/minified.js > /absolute/path/to/minified.js.gz`; capture exit/hash. Report unminified bytes, minified bytes and gzip of minified bytes. Case-name strings retained for closed membership checks are accounted separately from constructor bodies. A size, resolved input, or missing minified name alone is not proof.

## Freeze, failure, re-entry and eligibility

Before any launch, freeze source-ready candidate commits and binaries, all exact fixture/interface/observer source bytes and hashes, 24 unique keys, actual exports/reexports, tool identities/full hashes, full argv/cwd/permissions, and independent expected value/effect/export/descriptor oracles. Obtain operator agreement on that concrete checkpoint. No result or winner is implied here.

- Missing agreement, valid pins/fixtures, ABI, compiled observer, or tool identity blocks launch; retain the reason and planned-but-unlaunched count.
- An expected L1 retention-target miss (e.g. unused member retained) records that candidate failure; remaining already frozen cells may run to characterize both strategies.
- Unexpected fixture parse/source compile, graph/build, runtime/behavior/effect/export/descriptor, metafile/evidence-capture, or observer failure stops the affected continuation. Preserve raw receipts, outputs and failure. Report planned, launched, failed, completed and unrun counts against the original 24-key population.
- Never overwrite a cell. Retry/re-entry records cause, correction, new candidate/source hashes, exact affected keys and separate retry receipts; it does not inflate the original unique-key count. A changed experiment or budget requires its own prior operator agreement.
- Ordinary semantic regression repairs are separately named from frozen bundle runs. An expected comparative miss is not permission to ignore an unexpected semantic/tool failure.

Production eligibility requires all semantic/effect/export/descriptor oracles plus C1 zero-unused and C2 unused-case-body targets. If exactly one strategy satisfies them, it is eligible. If both satisfy them, CDC compares unminified, minified and gzip bytes plus implementation cost and records tradeoffs without invented aggregate statistics. If neither satisfies them, no winner is named; return the gap for bounded follow-up. Complete unminified output, code/source bodies, metafile and runtime/effect/export/descriptor evidence remain binding. Package staging must preserve public ABI exports; application bundling may remove only unobserved code with effects preserved.

## Dependency sequencing recommendation

The arc's updated seven-increment sequence separates local qualified semantics/host/purity, interface graph and two emitters, experiment, build/JSON composition, API/docs audit, and conditional docs. For this S01 proposal: S03 supplies local nominal core, fresh per-unit state, host and typed-purity foundations plus native/public single-file parity; S04 supplies resolved graph ABI, both same-module lowerings and the agreed gate; S05 composes actual package/build and repinned JSON-decoder evidence. S06 and S07 retain their API/docs audit and conditional docs obligations. No PURE/PureCall facility exists today. Root owns plan/status changes; this document does not edit the arc plan or authorize execution.
