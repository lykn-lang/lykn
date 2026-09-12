# Source register — B01

Access date for all entries: **2026-09-12 UTC**. These are CC-attested
source/document inspections. No entry is a Lykn runtime result or dependency
adoption decision. [Starting evidence](starting-evidence.md) remains unchanged.
“Confirmed” below means supported at the evidence kind stated, not independently
verified completion. Current documentation can move; pinned package source and
source commits are the replay anchors.

## Seed reconciliation

| Claim | Disposition and evidence kind | Primary source / version | Remaining question and owner |
| --- | --- | --- | --- |
| SE-01 | Confirmed at specification/API level: native JSON value conversion and Deno text-file operations supply the ordinary primitives | [ECMAScript 2025 §25.5](https://tc39.es/ecma262/2025/multipage/structured-data.html#sec-json-object); [Deno file APIs](https://docs.deno.com/api/deno/file-system/) accessed against local Deno 2.7.7 identity | End-to-end Lykn read/edit/write, errors and replacement: Arc01/Slice02; permission launch prerequisite applies |
| SE-02 | Confirmed policy need. Number conversion may lose lexical precision; duplicate names overwrite earlier values; serialization changes source representation and cannot encode every JS value | Same spec §25.5.1.1 Note 2; §25.5.2.2 and object/array serialization algorithms | Exact-number representation, duplicate detection before loss, null/absence and rejection policy: Slice02; no wrapper repair inferred after information is discarded |
| SE-03 | Confirmed exports, **qualified framing**: JsonParseStream parses an already framed string chunk; concatenated parser is distinct. Stringify stream defaults to LF suffix. Canonicalization APIs exist; this is not arbitrary-document incremental editing | [json 1.1.0 config](https://jsr.io/@std/json/1.1.0/deno.json), [parse stream](https://jsr.io/@std/json/1.1.0/parse_stream.ts), [concatenated parser](https://jsr.io/@std/json/1.1.0/concatenated_json_parse_stream.ts), [stringify stream](https://jsr.io/@std/json/1.1.0/stringify_stream.ts), [canonicalize](https://jsr.io/@std/json/1.1.0/canonicalize.ts) | Chunk boundaries, scalar framing, errors and memory: Slice02; resolved @std/streams dependency: Slice04 |
| SE-04 | Confirmed source/API: parse export accepts comments and trailing commas; package explicitly lacks serialization. No preservation API demonstrated | [jsonc 1.0.2 module](https://jsr.io/@std/jsonc/1.0.2/mod.ts), [parser](https://jsr.io/@std/jsonc/1.0.2/parse.ts), [config](https://jsr.io/@std/jsonc/1.0.2/deno.json) | Comment/trivia loss through value rewriting; malformed cases: Slice02 |
| SE-05 | Confirmed, with separate unstable subpaths: stable parse/parseAll, stringify, types including YamlSyntaxError. Stable parse options include schema, allowDuplicateKeys (default false), onWarning. Unstable parse adds extraTypes | [yaml 1.2.0 config](https://jsr.io/@std/yaml/1.2.0/deno.json), [parse](https://jsr.io/@std/yaml/1.2.0/parse.ts), [types](https://jsr.io/@std/yaml/1.2.0/types.ts), [unstable parse](https://jsr.io/@std/yaml/1.2.0/unstable_parse.ts), [unstable stringify](https://jsr.io/@std/yaml/1.2.0/unstable_stringify.ts) | No unstable API adopted; options/diagnostics and graph behavior: Slices03/04 |
| SE-06 | Confirmed implementation details: core includes JSON schema without new types; default adds timestamp/merge implicitly and binary/omap/pairs/set explicitly; extended adds regexp/undefined. Default schema is package-specific, not a YAML standard schema | [yaml 1.2.0 _schema.ts](https://jsr.io/@std/yaml/1.2.0/_schema.ts), constants and getSchema; [loader](https://jsr.io/@std/yaml/1.2.0/_loader_state.ts) uses DEFAULT_SCHEMA fallback | Do not equate this implementation's core/json equivalence with normative YAML schema equivalence; scalar/tag/non-string-key/graph trials: Slice03 |
| SE-07 | Confirmed **API-shape inference only**: stable parse returns values (unknown/unknown[]), stringify accepts data and style options; no original source document is returned. Original byte preservation is not an API promise | [yaml parse](https://jsr.io/@std/yaml/1.2.0/parse.ts), [stringify](https://jsr.io/@std/yaml/1.2.0/stringify.ts), 1.2.0 | Quantify changed/lost comments, anchors, layout, spelling and bytes in no-op and edit trials: Slice03 |
| SE-08 | Confirmed document/node/CST capability; **Node-free interpretation contradicted** by live node:process imports (D-2609-YNOD). Source has Document.setIn/toString and node comment fields; no arbitrary byte-identity promise | [published metadata](https://jsr.io/@eemeli/yaml/2.9.1_meta.json), [jsr.jsonc](https://jsr.io/@eemeli/yaml/2.9.1/jsr.jsonc), [index](https://jsr.io/@eemeli/yaml/2.9.1/src/index.ts), [Document](https://jsr.io/@eemeli/yaml/2.9.1/src/doc/Document.ts), [Node](https://jsr.io/@eemeli/yaml/2.9.1/src/nodes/Node.ts), [maintainer docs](https://eemeli.org/yaml/) | Execution/adoption gated by current policy. Same upstream project publishes to npm; see complete static scan below. Slice03 retains document comparison; Slice04 owns alternatives/policy disposition |
| SE-09 | Confirmed existing exception and ancestry, without vulnerability/adoption inference | [Lykn project.json at 8c66469](https://github.com/lykn-lang/lykn/blob/8c66469ba8f290a4bba993157b68a9e0d7716f0d/project.json#L11) maps astring to npm; [yaml 1.2.0 module](https://jsr.io/@std/yaml/1.2.0/mod.ts) identifies port from js-yaml v3.13.1 commit 665aadda42349dcae869f12040d9b10ef18d12da | Compiler tooling dependency is distinct from generated program dependencies. Existing use grants no exception to new libraries; runtime graph and ancestry decisions: Slice04/Arc04 |
| SE-10 | Confirmed as **documentation claim**, not actual capability: type/match and boundary checks are documented; guide 05 ID-19 explicitly leaves parametric types to a future version. :array/:object and :any do not establish recursive collection validation | [skill at 8c66469](https://github.com/lykn-lang/lykn/blob/8c66469ba8f290a4bba993157b68a9e0d7716f0d/assets/ai/SKILL.md), [surface guide](https://github.com/lykn-lang/lykn/blob/8c66469ba8f290a4bba993157b68a9e0d7716f0d/docs/guides/00-lykn-surface-forms.md), [type guide](https://github.com/lykn-lang/lykn/blob/8c66469ba8f290a4bba993157b68a9e0d7716f0d/docs/guides/05-type-discipline.md) | Arc02 must distinguish constructor checks, static rejection, runtime fallback, forged tags, recursive validation and stripped assertions; guide wording conflicts tracked in findings |

## Package identity and import boundaries

Pins are research candidates, not “latest” requirements. No adoption or lock
resolution occurred. Stable means the published export lacks an unstable label;
it does not independently certify compatibility or correctness.

| Candidate | Inspected export surface | Dependency evidence and limits |
| --- | --- | --- |
| @std/json 1.1.0 | `.`, types, concatenated-json-parse-stream, parse-stream, stringify-stream, canonicalize; canonicalize and canonicalizeToBytes | Concatenated parser has a live import `jsr:@std/streams@^1.1.0/to-transform-stream`; types/local helpers also imported. @std/assert, @std/encoding and TextLineStream imports in examples are not all runtime edges of the package. The proposed TextLineStream fixture itself will add a real streams edge. Metadata currently reports streams 1.1.2; Slice04 must lock and record actual resolution |
| @std/jsonc 1.0.2 | `.`, parse | Parser imports JsonValue from `jsr:@std/json@^1.0.2/types` as **type-only**. It is a resolution/type-check graph edge, not executed parser code. Example @std/assert is documentation-only |
| @std/yaml 1.2.0 | `.`, parse, stringify, types; unstable-parse and unstable-stringify | Inspected entrypoints/schema/loader/dumper use internal modules. Published-source scan supplement below; full resolved graph, cache and offline validation remain Slice04. Example assertions do not create runtime dependencies |
| @eemeli/yaml 2.9.1 | `.` → src/index.ts; util → src/util.ts | Published JSR config excludes src/cli.ts, but the complete scan found live node:process imports in parser/composer/logging (details below). Upstream npm package.json at v2.9.1 has no dependencies field, but has Node engine >=14.6, CommonJS/browser distribution and npm-based dev tooling. Runtime Node API dependence and upstream development ecosystem are separately evidenced |

The inspected upstream [package.json at v2.9.1](https://github.com/eemeli/yaml/blob/v2.9.1/package.json)
lists Jest, Rollup, TypeScript, Babel and ESLint among development dependencies.
The JSR manifest contains source rather than that npm distribution. Treat
registry, source ancestry, maintainer/build ecosystem, executable runtime imports,
and transitive resolution as five separately recorded facts.

YAML 1.2.2 [chapter 3](https://yaml.org/spec/1.2.2/#chapter-3-processes-and-models)
and [chapter 10](https://yaml.org/spec/1.2.2/#chapter-10-recommended-schemas)
provide the representation/presentation and schema distinctions for the matrix.
Neither a package's “safe to parse” text nor its schema names prove memory or
alias bounds. @eemeli Document.toJS source defaults maxAliasCount to 100;
actual conversion and parser resource behavior need separate trials.

## Retrieval and replay

Browser retrieval of JSR raw files failed with “not safe to open”; sandboxed
curl failed with `Could not resolve host: jsr.io` (exit 6). Authorized network
retry via curl succeeded. No package code was executed. Source files were
inspected in disposable `/private/tmp/lykn-p07-s01-sources`; this directory is
not durable evidence. Replay from published URLs and hashes below.

Guessed @eemeli/yaml/2.9.1/deno.json and package.json URLs returned HTTP 404.
The version metadata correctly located `jsr.jsonc`; upstream package.json was
read separately at v2.9.1. The mutable scope metadata reported latest 2.9.1,
created 2026-09-11T20:28:42.962145Z; the prerelease 3.0.0-2 was not selected.

```sh
curl -fLsS 'https://jsr.io/@std/json/1.1.0/deno.json'
curl -fLsS 'https://jsr.io/@std/jsonc/1.0.2/deno.json'
curl -fLsS 'https://jsr.io/@std/yaml/1.2.0/deno.json'
curl -fLsS 'https://jsr.io/@eemeli/yaml/2.9.1/jsr.jsonc'
curl -fLsS 'https://jsr.io/@std/yaml/1.2.0_meta.json'
curl -fLsS 'https://jsr.io/@eemeli/yaml/2.9.1_meta.json'
```

Fetch each linked implementation file using the same curl command. Metadata's
`manifest` maps published paths to byte sizes/checksums; `exports` names entry
points. Read the relevant function, not just the doc comment. For a source
commit citation, use `git show COMMIT:path` in its named repository.

| Retrieved identity file | SHA-256 of fetched bytes |
| --- | --- |
| @std/json/1.1.0/deno.json | `668be64caf1096ef6a01925fd4d55190d12df687349a3ef9e60a4ba25a975713` |
| @std/jsonc/1.0.2/deno.json | `01804798e6f1ee6c537efea5e39e156ede60959325e2782f4a740b9cc87383f4` |
| @std/yaml/1.2.0/deno.json | `b107f80ba8bef57ad43f2755fde8e0dd0e9f05838b812ab5c6d3bb14476074db` |
| @eemeli/yaml/2.9.1/jsr.jsonc | `d4ccc76ce46f26f49866f74dd4adfc6150401665eaccd0f4e2f1d32535d9cf87` |
| @std/json/1.1.0_meta.json | `93330d3ed4054d6b1ffe54b075432c80a5f671be77277b978931e018014cb1cc` |
| @std/jsonc/1.0.2_meta.json | `909605dae3af22bd75b1cbda8d64a32cf1fd2cf6efa3f9e224aba6d22c0f44c7` |
| @std/yaml/1.2.0_meta.json | `20beb41e4983ba3437dbefac62b14061ab058e8a187596f19d28ff9035f6e6cf` |
| @eemeli/yaml/2.9.1_meta.json | `8987c5ee76629274c14b610d5eb0b6f71d08eafe0dd8b9d233aec69bbf9e705d` |
| upstream eemeli/yaml v2.9.1/package.json | `1c6441703d8204a23ded0d37ddf57c3b69d821dc392f20852d1f605bb9b8861c` |

Mutable documentation is supplementary. ECMAScript **2025** is the bounded
specification used here; later runtime extensions such as source-aware reviver
context or raw JSON must be feature-tested against Deno 2.7.7 before being used
as exact-number alternatives. No compatibility floor is inferred from the
installed TypeScript version.

## Complete published YAML TypeScript scan — material qualification

Fetched all `.ts` paths in each pinned metadata manifest: **30/30** for
@std/yaml 1.2.0 and **77/77** for @eemeli/yaml 2.9.1. This static scan includes
files outside entrypoint reachability (such as std tests); it is not a Deno
resolved graph or runtime verification.

- @std/yaml: external imports found in `parse_test.ts` (@std/assert ^1.0.19,
  @std/testing ^1.0.20/mock), `types_test.ts` (@std/assert ^1.0.19), and
  `stringify_test.ts` (@std/assert ^1.0.19, @std/semver ^1.0.8). No external
  import specifier found in the other published TS files. Source ancestry
  remains js-yaml, including separate js-yaml-js-types references for regexp
  and undefined. This is positive static evidence, not final policy acceptance.
- @eemeli/yaml: **live `node:process` imports** in
  [composer.ts:1](https://jsr.io/@eemeli/yaml/2.9.1/src/compose/composer.ts),
  [parser.ts:1](https://jsr.io/@eemeli/yaml/2.9.1/src/parse/parser.ts), and
  [log.ts:1](https://jsr.io/@eemeli/yaml/2.9.1/src/log.ts).
  index.ts exports Composer and Parser directly; their node imports are not
  merely development dependencies. Composer reads env.LOG_STREAM; Parser reads
  env.LOG_TOKENS; logging imports emitWarning. A Node executable requirement is
  not inferred, but Node compatibility API dependence is confirmed in source.

This qualifies SE-08: the document API exists, **but this pinned candidate
violates the requested Node-API exclusion as published**. It must not be
adopted or executed in these research programs under the current boundary.
Retain Y-14 as a gated source comparison until Arc01/Slice04 records a compatible
alternative or the operator explicitly changes the relevant boundary.
D-2609-YNOD records this finding. No fork, shim, npm substitution or policy
exception is silently selected.

Scan replay after fetching each metadata-listed `.ts` path into `PKGDIR`:

```sh
rg -n "from ['\"](node:|npm:|jsr:|https:)|import\\(['\"](node:|npm:|jsr:|https:)" "$PKGDIR"
```

Inspect multiline imports and distinguish comments/test files. An import scan
alone cannot detect every dynamically constructed dependency or package side
effect. Slice04 still owns resolved graph closure and runtime permissions.

Full retrieval/checksum replay (Bash, curl, jq and shasum; reads public files,
never imports or executes them):

```sh
source_tmp=$(mktemp -d /private/tmp/lykn-p07-sources.XXXXXX)
for pkg in std/yaml/1.2.0 eemeli/yaml/2.9.1; do
  pkg_dir="$source_tmp/$pkg"
  mkdir -p "$pkg_dir"
  curl -fLsS "https://jsr.io/@${pkg}_meta.json" -o "$pkg_dir/meta.json" || exit 1
  checked=0
  failed=0
  while IFS=$'\t' read -r path expected; do
    mkdir -p "$pkg_dir/$(dirname "$path")"
    curl -fLsS "https://jsr.io/@$pkg$path" -o "$pkg_dir$path" || exit 1
    actual=$(shasum -a 256 "$pkg_dir$path" | cut -d ' ' -f1)
    checked=$((checked+1))
    if [ "sha256-$actual" != "$expected" ]; then
      failed=$((failed+1))
      printf 'MISMATCH %s\n' "$path"
    fi
  done < <(jq -r '.manifest | to_entries[] | select(.key | endswith(".ts")) | [.key, .value.checksum] | @tsv' "$pkg_dir/meta.json")
  printf '%s checked=%s mismatches=%s\n' "$pkg" "$checked" "$failed"
  test "$failed" -eq 0 || exit 1
  case "$pkg" in std/yaml/1.2.0) expected_count=30 ;; eemeli/yaml/2.9.1) expected_count=77 ;; esac
  test "$checked" -eq "$expected_count" || exit 1
done
```

Observed equivalent local checksum walk: `std_yaml_1.2.0 checked=30
mismatches=0`; `eemeli_yaml_2.9.1 checked=77 mismatches=0` (exit 0). Pin/check the
metadata hash itself against the identity table before trusting its manifest.
These hashes establish byte integrity against the registry, not independent
upstream authenticity or runtime compatibility.
