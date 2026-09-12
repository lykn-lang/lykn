# Fixture matrix — protocol FM01

**No cases executed in Slice01.** Every row below is a future case family.
Suffix variants `a`, `b`, etc. identify each enumerated input/condition; every
actual run receives its own record. Freeze expanded cases before execution.
The named owner is accountable for every variant, including blocked/unsupported
ones. S02/S03/S04 mean Arc01 Slices02/03/04; A02/A03 mean Project07 Arcs02/03.
Those future units are roadmap owners, not claimed Git routing destinations.

Notation: quoted fixtures show literal text; `\n`, `\r`, `\t`, `\uXXXX` are
explicit escape notation for the bytes/characters described (materialize a
manifest before a run; do not silently double-decode JSON escapes). Default is
UTF-8 without BOM, LF, final newline. A row overriding this wins.

Every row requires packet E: original task, exact fixture bytes and SHA-256,
Lykn source, compiler output, baseline/permissions/options, stdout, stderr,
exit/signal, duration, observation versus interpretation. **V** adds a typed
value-tree comparison (including own-key presence); **B** adds raw input/output
bytes, hash and first differing byte; **G** adds alias identity/cycle traversal
with bounds; **F** adds pre/post filesystem state. Unknown means characterization,
not permission to choose a convenient expected result after the run.

## JSON — native path first, then isolated extension candidates

| ID | Question and concrete inputs/action | Predeclared invariant or unknown outcome | Evidence | Owner |
| --- | --- | --- | --- | --- |
| J-01 | Read `{"name":"Ada","n":1,"flags":[true,false],"nil":null}`, set n=2, serialize, write, reread | Only n changes in value tree; source remains untouched; rewritten bytes reported separately | E,V,B,F | S02 |
| J-02 | Top-level `null`, `false`, `0`, `""`, `[]`, `{}` | Preserve kind/value; successful null is distinct from parse failure | E,V | S02 |
| J-03 | `{"x":`, `{"x":1,}`, `//x\n{}`, `[01]`, empty text, valid value plus junk | Strict native parse rejects; no destination replaced; error stage and position recorded without assuming message stability | E,F | S02 |
| J-04 | Number tokens 9007199254740991, 9007199254740992, 9007199254740993, -9007199254740993, 0.1, 1.2300, 1e400, 1e-400, -0 | Retain token spelling beside Number result; test collisions, finite checks, Object.is(-0). Exact token/value preservation is separate from native behavior | E,V,B | S02 |
| J-05 | Same J-04 values represented as original number-token strings and BigInt for integers; probe source-aware reviver context and rawJSON availability | Unknown optional API availability on B01; never derive exact integer from already rounded Number; no automatic decimal/BigInt library adoption | E,V | S02 |
| J-06 | `{"x":1,"x":2}`, nested duplicate and escaped equivalent key `{"a":1,"\u0061":2}` | Native last value expected per spec; count lexical keys before loss if claiming duplicate rejection. Reviver alone must not be assumed to recover duplicates | E,V,B | S02 |
| J-07 | `{}`, `{"x":null}`, `{"x":false}`, `{"x":0}`, `{"x":""}`; runtime own x=undefined | Missing, null and own undefined distinguished by presence and kind; defaults preserve false/0/empty string | E,V | S02 |
| J-08 | Keys `"first-name"`, `"firstName"`, `""`, `"a:b"`, `"a/b"`, `"~"`, `"__proto__"`, `"constructor"`, `"toString"` | Preserve exact key text through Lykn edit; no keyword camel-casing or prototype mutation. Explicit own-property checks | E,V,B | S02 |
| J-09 | Runtime undefined/function/symbol at top level, object property and array slot; NaN/±Infinity; 1n; cycle; Date; Map; Set; sparse array | Record omission/null/throw/toJSON behaviors separately. Unsupported values never count as successful lossless round trips; BigInt and cycle rejection expected by native spec | E,V | S02 |
| J-10 | Same object keys in two insertion orders; nested keys `2`, `10`, `a`, accented and supplementary Unicode; pretty indent 0/2/10 | Native determinism for same value/order differs from canonical order invariance. Compare canonicalize and canonicalizeToBytes separately; reject non-finite canonical inputs | E,V,B | S02 |
| J-11 | Escaped quote/backslash/control/newline, emoji split within UTF-8 sequence, escaped lone surrogate; BOM; CRLF; no final newline; invalid UTF-8 byte 0xff | Preserve decoded string where representable; record decoder replacement/rejection. Byte equality never inferred from value equality | E,V,B | S02 |
| J-12 | JSONC `// before\n{"n":1, /* inline */}\n`; no-op parse/rewrite then n=2 | @std/jsonc parse succeeds per source; native parse rejects; stringify is native value rewrite with comment loss explicitly measured | E,V,B | S02 |
| J-13 | NDJSON `{"n":1}\n\n{"n":2}\n`, CRLF variant, missing final LF, malformed middle line; 1-byte/7-byte/whole-file chunks | Decode then frame lines before JsonParseStream; record blank-line handling, successful prefix and first error; raw chunk parse is a negative control | E,V,B | S02 |
| J-14 | Concatenated `{"a":1}[2]true null "x" 12 34`; escaped braces inside string; truncated last value; chunk sizes 1/7/all | Order/count and scalar boundary behavior characterized; never assume arbitrary chunk = complete value. Observe incomplete flush/error behavior | E,V | S02 |
| J-15 | Stringify two values with defaults and prefix U+001E/suffix LF; parse via matching text-sequence framing | Exact delimiters/count; no merged records; framing errors kept separate from syntax errors | E,V,B | S02 |
| J-16 | Depth 16/64/256 nested arrays; string payload 1KiB/1MiB/8MiB; 100/10,000 NDJSON records | Characterize time/RSS/output and cancellation under protocol limits; unknown maximum supported input; streaming not constant-memory by assumption | E,V plus resource log | S02 (bounds controls S04) |
| J-17 | J-01 via missing input, unreadable input, absent output parent, unwritable output dir, interrupted write, replacement failure | No false success; original bytes remain on failure for proposed safe replacement route. Raw write truncation separately characterized | E,B,F | S02 (OS/atomicity S04) |

## YAML — explicit schema and value/document distinctions

| ID | Question and concrete inputs/action | Predeclared invariant or unknown outcome | Evidence | Owner |
| --- | --- | --- | --- | --- |
| Y-01 | `name: Ada\nn: 1\nflags: [true, false]\nnil: null\n`; set n=2, rewrite/reread | Only n changes in accepted value domain; bytes assessed separately | E,V,B,F | S03 |
| Y-02 | Scalars `yes`, `on`, `true`, `null`, `~`, empty value, `012`, `0o12`, `.nan`, `.inf`, `2026-09-12`, and each quoted variant | Cross product with failsafe/json/core/default/extended at @std/yaml 1.2.0; record kinds and lexemes, no inferred YAML 1.1 behavior | E,V,B | S03 |
| Y-03 | `!!str 12`, `!!int "12"`, `!!timestamp 2026-09-12`, `!!binary SGk=`, `!!set {a: null}`, `!!omap [a: 1]`, `!!pairs [a: 1]`, `!!js/regexp /x/i`, `!!js/undefined ~`, `!custom x` | Schema acceptance/rejection and JS representation explicit; binary unstable caveat retained; no custom tag construction executed without explicit case declaration | E,V | S03 |
| Y-04 | `a: 1\na: 2\n`; keys true/1/"1", sequence `[a,b]`, mapping `{a: b}` | Duplicate default rejection vs allowDuplicateKeys true; distinguish native YAML key identities from string coercion/collision in JS objects | E,V,B | S03 |
| Y-05 | `a: &base {x: 1}\nb: *base\n`; modify a.x | Record a===b and whether edit changes b; structural equality is insufficient | E,V,G,B | S03 |
| Y-06 | `a: &a [*a]\n`; unresolved `a: *missing` | Cycle handling/serialization unknown; bounded graph inspector must terminate; unresolved alias error recorded | E,G,B | S03 |
| Y-07 | `base: &b {x: 1, y: 2}\nitem: {<<: *b, y: 3}\n` | Schema-dependent merge result, override order, and retention of merge/anchor syntax reported | E,V,G,B | S03 |
| Y-08 | `---\na: 1\n...\n---\nb: 2\n`; empty document between separators; invalid second document | parse rejects multi-doc per source; parseAll returns ordered values or reports error; no dropped empty docs or false all-success claim | E,V,B | S03 |
| Y-09 | `a: [1,\n`, bad indentation `a:\n  b: 1\n c: 2\n`, duplicate anchor, tab indentation | Capture YamlSyntaxError name/message/location and warnings separately; no output replacement after rejected parse | E,F | S03 |
| Y-10 | `# title\nn: 01 # note\ntext: 'hello'\n\nseq: [a, b]\n` no-op, then n=2 | Value rewrite expected to lose presentation; exact changed bytes/comments/quotes/blank lines counted, not merely “round-trip supported” | E,V,B | S03 |
| Y-11 | Literal `text: \|+\n  one\n\n`, folded `text: >-\n  one\n  two\n`; `%YAML 1.2` directive, BOM, CRLF and no-final-LF variants | Distinguish scalar semantic newlines from presentation. Preserve original bytes for cost/fidelity comparison | E,V,B | S03 |
| Y-12 | Same numeric tokens as J-04, null/missing/falsy as J-07, arbitrary string keys as J-08 | Cross-format fidelity loss is explicit; schema/value conversion never silently narrows exact integer or key domain | E,V,B | S03 |
| Y-13 | Depth 16/64/256; 1KiB/1MiB/8MiB scalar; alias DAG fanout 2 at depth 4/8/12, generated from base `[x,x]` anchors | Record parse vs toJS vs stringify resources independently; enforce timeout and output bounds; no unlimited alias expansion; defaults vs explicit bound compared | E,G plus resource log | S03 (controls S04) |
| Y-14 | Same Y-10/Y-11 original bytes and edit using @eemeli Document.setIn/toString, node comments, keepSourceTokens on/off | **Execution gated by D-2609-YNOD**. Static API comparison allowed. If compatible route later approved, preserve semantic edit and measure every unrelated byte/trivia change; no perfect-preservation promise | E,V,B plus policy disposition | S03, prerequisite S04 |
| Y-15 | Date/Map/Set/undefined/function/cycle runtime values; stringify default vs skipInvalid true | Explicit accepted/rejected/coerced/dropped classification. No silent skip accepted as fidelity | E,V,G | S03 |
| Y-16 | Y-01 with J-17 filesystem faults | Same failure contract; byte evidence and errors survive; no real configs edited | E,B,F | S03 (replacement S04) |

## Deno, dependency and filesystem boundary

| ID | Question and concrete inputs/action | Predeclared invariant or unknown outcome | Evidence | Owner |
| --- | --- | --- | --- | --- |
| R-01 | B01 identity/help/hash refresh; selected CLI minimal no-import program | Detect drift before execution; compiler binary and source commit remain distinct; runtime launch blocked until PERM disposition | E | S04 prerequisite at S02 opening |
| R-02 | Imports at exact std/json 1.1.0, jsonc 1.0.2, yaml 1.2.0; streams resolution; qualified eemeli source inspection | Inventory full runtime/type/dev/example graph, URLs, checksums and licenses/ancestry. Node/npm edges disqualify under current policy; no lock silently floated | E plus resolved graph/lock | S04, S02/03 preserve per-run graph |
| R-03 | Narrow import map, alias mismatch, missing package/subpath, corrupt scratch lock copy | Exact mapping proven; missing/corrupt resolution fails without rewriting frozen lock; avoid real cache damage | E plus config/lock diff | S04 |
| R-04 | New dedicated cache online prefetch; repeat cached-only; empty cache offline | Warm succeeds if complete; cold fails with attributable dependency error; no successful offline claim based only on no application fetch | E plus cache/network conditions | S04 |
| R-05 | Parser-only with no grants; read-only input; write-only output; deny each, deny env/net/run | Prove effective permissions and denied operation. Current run -A path unsuitable; do not append Deno flags after script and assume enforcement | E plus effective argv/denial record | S04 prerequisite at S02 opening |
| R-06 | Write temp file beside destination, flush/close, rename; preexisting file, symlink, mode bits, concurrent reader and two writers | Observe replacement/no partial read; atomic visibility ≠ durability. Conflicting writers need explicit policy; symlink target must not escape isolated root | E,B,F | S04; S02/03 basic failures |
| R-07 | Different-filesystem rename where an isolated second filesystem already exists; injected open/write/flush/rename errors; cancellation before/after rename | Unknown OS behavior; no disk-filling or mount creation. If no second filesystem, mark variant unexecuted with re-entry condition. Fault simulation is distinct from actual OS evidence | E,B,F | S04 |
| R-08 | J-16/Y-13 with measured CPU/wall/RSS and output cap | Bounded harness terminates run; no inferred asymptotic complexity or universal safe maximum from this case series | E resource log | S04 |
| R-09 | Current B01 vs another already available supported Deno/CLI pair, only after identity proof | No installation authorized here. Missing comparison version is unavailable, not pass; disclose model/toolchain/platform changes | E and comparison packet | S04 |

## Lykn authoring and correction

| ID | Retained task/input | Success criterion or characterization | Evidence | Owner |
| --- | --- | --- | --- | --- |
| L-01 | Define tagged JSON values (null/bool/number/string/array/object); decode J-01 and reject nested wrong element | Separate representability from recursively enforced type safety; any :any boundary explicit | E,V plus attribution | A02 |
| L-02 | Result/Option decoder for J-07, domain port integer 0–65535, wrong/null/missing nested field | Error path identifies location; no conflation of absent/null; expected failure handled with ADTs | E,V | A02 |
| L-03 | type constructors with valid/wrong field; zero-field constant; missing variant, wildcard and forged tag; nested match | Distinguish compile rejection, runtime throw, structural dispatch and unchecked forged data; verify both compilers where available | E plus emitted JS/diagnostics | A02 |
| L-04 | Array/Map object-key preservation J-08; mixed elements; recursive depth; immutable nested edit | Dynamic keys preserved; update alias/mutation effects visible; generic syntax claims require evidence | E,V,G | A02 |
| L-05 | Two modules, imported ADTs, top-level await read/write, caught rejection and cleanup | ESM imports and constructor registry survive module boundary; output correct under narrow authorized permissions | E,F | A02 |
| L-06 | Original Lykn tasks L-01–05: format twice, check/lint, compile with assertions on and off | Formatting idempotent and behavior unchanged; assertion stripping changes only documented checks; valid/invalid outcome retained | E plus byte diffs | A02 |
| L-07 | Guide-driven JSON edit and YAML rewrite tasks in authoring-evaluation.md; book JSON/type/match snippets at pinned locators | Original task/code/reference log retained; guide taxonomy and denominators applied; book-vs-guide-vs-runtime disagreements separate | E plus review packet | A02 |
| L-08 | Show operator the exact successful/failed/revised source samples | Record actual likes/dislikes and requested changes; pending until explicit reply; correctness does not imply elegance acceptance | E plus operator record | A02 |
| L-09 | Repeat original failing task after each accepted guide/compiler/tooling/book correction | Fixed original defect and relevant regressions with controlled change; preserve old/new code and locators | E plus paired comparison | A03 |

## Coverage crosswalk

Project JSON scope → J-01–17; YAML → Y-01–16 (schemas/tags Y-02/03,
keys/graphs Y-04–07, documents Y-08/10/11/14); runtime and provenance → R-01–09;
ADT/type/collection/errors/modules/async → L-01–05; formatter/compiler/diagnostics
→ L-03/06; guide/book/operator and corrections → L-07–09. Streaming J-13–16,
resource Y-13/R-08 and failure J-17/Y-16/R-06–07 are explicit rather than
inherited from happy cases. Bounded case families may require a documented
slice split; preserve all IDs, variants and owners when doing so.
