# JSON behavior results — J2-R01

CC-attested, 2026-09-12; independent CDC reproduction and formal closure pending.

161 frozen variants: 110 native ×2, 43 package ×2, eight stress ×6 = **354 attempts**. Three additional supervisor controls and four launcher/setup/argv controls are recorded separately. All 17 families executed; zero blocked or not-run variants. Expected parse/serialize errors and four intentional interrupted-write exits are observations, not harness failures. All 153 deterministic stdout pairs match byte-for-byte. Compiler warning order, process IDs, timing and RSS are not deterministic.

The [manifest](case-manifest.md) gives predeclared invariants; [raw transcript](raw-transcript.txt) retains every attempt, stderr, emitted JavaScript, hashes, pre/post files and resource samples. [Baseline and replay](baseline-and-launch.md), [graph](dependency-graph.txt), [lock](deno.lock), [bytes](byte-evidence.md) and [authoring record](authoring-observations.md) complete the packet.

## Family observations and interpretation

| Family | Variants / attempts | Observed disposition |
| --- | --- | --- |
| J-01 | 1 / 2 | Executed, characterized. Read/edit/write/reread changed n=1 to n=2; source unchanged. Safe sibling renamed after complete write/sync/close. |
| J-02 | 6 / 12 | Executed, characterized. All six successful top-level values retained their kinds, including null and falsy values. |
| J-03 | 6 / 12 | Executed, characterized. All six malformed inputs raised SyntaxError before output replacement; destination stayed byte-identical. |
| J-04 | 9 / 18 | Executed, characterized. 2^53+1 rounded to 2^53; negative counterpart rounded too. 1e400 became Infinity then null; 1e-400 became 0; -0 serialized to 0; 1.2300 normalized to 1.23. 0.1 spelling does not establish exact decimal arithmetic. |
| J-05 | 9 / 18 | Executed, characterized. Source-aware reviver context and JSON.rawJSON are available on this runtime; all nine original token spellings survived the raw path. BigInt was constructed directly from integer tokens; BigInt(-0) is 0. |
| J-06 | 3 / 6 | Executed, characterized. All three duplicate-name fixtures collapsed to last value 2 before reviver visitation. Escaped a and literal a collide. No duplicate-rejection claim. |
| J-07 | 6 / 12 | Executed, characterized. Absent and own undefined both read undefined but own-property checks distinguish them. Null differs; nullish default preserved false, zero and empty string. |
| J-08 | 1 / 2 | Executed, characterized. All nine exact dynamic keys survived editing and serialization, including __proto__, constructor and toString. Object.fromEntries retained ordinary prototypes and own keys. |
| J-09 | 36 / 72 | Executed, characterized. undefined/function/symbol: top-level undefined, object omission, array null. NaN/±Infinity: null. BigInt and cycles: TypeError. Date: ISO string. Map/Set: empty objects. Sparse holes: null slots. These are losses/rejections, never lossless successes. |
| J-10 | 7 / 14 | Executed, characterized. Native output repeated deterministically for fixed insertion order but differed across orders at indents 0/2/10. Canonical string and byte APIs agreed across orders; nested canonical keys were 10,2,a. NaN/±Infinity rejected. |
| J-11 | 21 / 42 | Executed, characterized. Escapes, emoji split byte-by-byte and escaped lone surrogate retained decoded values. BOM removed by decoder; CRLF/final newline removed by rewrite. Invalid ff replaced with U+FFFD by replacement/stream decoding; fatal decoder rejected before parse. |
| J-12 | 3 / 6 | Executed, characterized. Pinned JSONC parser accepted comments/trailing comma; native parser rejected. No-op and n=2 rewrites removed both comments, whitespace and trailing comma; bytes measured independently. |
| J-13 | 24 / 48 | Executed, characterized. Decode + TextLineStream + JsonParseStream yielded two records across 1/7/all chunks, skipped blank lines and handled CRLF/missing final LF. Malformed middle line exposed one-record prefix then error. Raw-chunk controls errored, sometimes after one record. |
| J-14 | 9 / 18 | Executed, characterized. Concatenated stream yielded seven mixed values and two escaped-string values at every chunk size. Truncated final object exposed first record then flush SyntaxError; no false all-success. |
| J-15 | 4 / 8 | Executed, characterized. Default LF and explicit RS/LF emission had exact bytes and two records with matching framing. BAD-prefix negative controls failed with zero records. Their origin is malformed framing; observed failure is downstream JSON SyntaxError, not a dedicated framing diagnostic. |
| J-16 | 8 / 48 | Executed, characterized. All eight bounded sizes completed six times (one warm-up + five measurements), no cap stops. Includes depth 256, 8MiB string, 10,000 records; no maximum-size or constant-memory inference. |
| J-17 | 8 / 16 | Executed, characterized. Actual missing/mode/parent/rename-directory failures preserved destination; injected pre-rename failure did too. Externally interrupted raw write left one byte; interrupted safe write retained original plus completed sibling. No crash-durability/atomic-reader claim. |

## Resource measurements

All numbers below are in execution order. First is a discarded warm-up; median/range use only the following five fresh-process measurements. `operationMs` includes fixture construction, encoding, validation and output before the timer ends; record-series timing additionally includes dynamic module initialization, chunk-array allocation and streaming. It is **not isolated parser CPU time**. Each process starts fresh; warm-up warms host/cache state, not its successor’s JIT. Native runs preceded package runs; stress followed both. No alternate-order causal comparison is claimed.

Wall is supervisor-observed elapsed time including launch, ps sampling and the final process check. Darwin `/usr/bin/time -l` supplies child-reported maximum RSS in bytes; sampled tree RSS sums time/CLI/Deno processes and is a different measure. Fast cases can finish between samples. The latter is a stop threshold, not a hard cap. The supervisor itself and its cache-copy/preparation overhead are outside child limits.

| Variant | operationMs: warm-up; five measurements | Median [min, max] ms | Wall median [min,max] ms | Host peak RSS maximum of five (bytes) | Sampled tree maximum of five (KiB) |
| --- | --- | --- | --- | --- | --- |
| J-16-depth-16 | 0.249375; 0.231416, 0.222542, 0.236708, 0.218291, 0.255875 | 0.231416 [0.218291, 0.255875] | 76.191 [74.907, 78.352] | 53657600 | 2160 |
| J-16-depth-64 | 0.238958; 0.263542, 0.241959, 0.231792, 0.248625, 0.245792 | 0.245792 [0.231792, 0.263542] | 76.736 [73.386, 77.239] | 53346304 | 1456 |
| J-16-depth-256 | 0.300667; 0.299167, 0.266791, 0.290833, 0.288208, 0.289542 | 0.289542 [0.266791, 0.299167] | 75.057 [73.880, 75.833] | 53215232 | 1248 |
| J-16-string-1024 | 0.228959; 0.224334, 0.217792, 0.222792, 0.238291, 0.223500 | 0.223500 [0.217792, 0.238291] | 75.831 [74.452, 77.157] | 53231616 | 1232 |
| J-16-string-1048576 | 1.054917; 1.086209, 1.005291, 1.098750, 1.041417, 1.022833 | 1.041417 [1.005291, 1.098750] | 75.119 [72.738, 76.254] | 56819712 | 1264 |
| J-16-string-8388608 | 5.591250; 5.619125, 5.684916, 5.712667, 5.636042, 5.789208 | 5.684916 [5.619125, 5.789208] | 74.951 [73.932, 75.014] | 79069184 | 1456 |
| J-16-records-100 | 6.468292; 6.675625, 6.608166, 6.574250, 6.963916, 6.798625 | 6.675625 [6.574250, 6.963916] | 74.595 [74.069, 77.921] | 60850176 | 1264 |
| J-16-records-10000 | 51.214416; 52.013333, 50.890875, 51.326917, 51.635291, 52.355916 | 51.635291 [50.890875, 52.355916] | 128.369 [125.061, 128.528] | 85196800 | 82384 |

All wall, host RSS, sampled RSS and output values (including warm-ups) remain in the raw records. Maximum configured child budget: wall 10s, combined retained output 16MiB, sampled tree RSS 512MiB; controls deliberately lower one threshold. Sampling/kill latency means a threshold can be exceeded before termination. The timeout control stopped at 600.060417ms for a 500ms threshold; it is bounded polling, not an exact real-time deadline.

## Variant index

Each ID locates two or six JSON-line records within `ARTIFACT native.jsonl`, `package.jsonl` or `stress.jsonl` in the transcript. Full stdout values are tagged so NaN, negative zero, undefined and cycle identity cannot be lost through record transport. Map/Set contents are declared in source, while the generic inspector only records their kind and enumerable keys; it is not a general Map/Set value oracle.

| Variant | Attempts | Case disposition |
| --- | --- | --- |
| J-01-edit | 2 | completed |
| J-02-null | 2 | serialized string; value/loss table above |
| J-02-false | 2 | serialized string; value/loss table above |
| J-02-zero | 2 | serialized string; value/loss table above |
| J-02-empty-string | 2 | serialized string; value/loss table above |
| J-02-array | 2 | serialized string; value/loss table above |
| J-02-object | 2 | serialized string; value/loss table above |
| J-03-1 | 2 | parse: SyntaxError (characterized) |
| J-03-2 | 2 | parse: SyntaxError (characterized) |
| J-03-3 | 2 | parse: SyntaxError (characterized) |
| J-03-4 | 2 | parse: SyntaxError (characterized) |
| J-03-5 | 2 | parse: SyntaxError (characterized) |
| J-03-6 | 2 | parse: SyntaxError (characterized) |
| J-04-1 | 2 | serialized string; value/loss table above |
| J-05-1 | 2 | completed |
| J-04-2 | 2 | serialized string; value/loss table above |
| J-05-2 | 2 | completed |
| J-04-3 | 2 | serialized string; value/loss table above |
| J-05-3 | 2 | completed |
| J-04-4 | 2 | serialized string; value/loss table above |
| J-05-4 | 2 | completed |
| J-04-5 | 2 | serialized string; value/loss table above |
| J-05-5 | 2 | completed |
| J-04-6 | 2 | serialized string; value/loss table above |
| J-05-6 | 2 | completed |
| J-04-7 | 2 | serialized string; value/loss table above |
| J-05-7 | 2 | completed |
| J-04-8 | 2 | serialized string; value/loss table above |
| J-05-8 | 2 | completed |
| J-04-9 | 2 | serialized string; value/loss table above |
| J-05-9 | 2 | completed |
| J-06-top | 2 | serialized string; value/loss table above |
| J-06-nested | 2 | serialized string; value/loss table above |
| J-06-escaped | 2 | serialized string; value/loss table above |
| J-07-absent | 2 | serialized string; value/loss table above |
| J-07-null | 2 | serialized string; value/loss table above |
| J-07-false | 2 | serialized string; value/loss table above |
| J-07-zero | 2 | serialized string; value/loss table above |
| J-07-empty | 2 | serialized string; value/loss table above |
| J-07-undefined | 2 | serialized string; value/loss table above |
| J-08-keys | 2 | serialized string; value/loss table above |
| J-09-undefined-top | 2 | serialized undefined; value/loss table above |
| J-09-undefined-object | 2 | serialized string; value/loss table above |
| J-09-undefined-array | 2 | serialized string; value/loss table above |
| J-09-function-top | 2 | serialized undefined; value/loss table above |
| J-09-function-object | 2 | serialized string; value/loss table above |
| J-09-function-array | 2 | serialized string; value/loss table above |
| J-09-symbol-top | 2 | serialized undefined; value/loss table above |
| J-09-symbol-object | 2 | serialized string; value/loss table above |
| J-09-symbol-array | 2 | serialized string; value/loss table above |
| J-09-nan-top | 2 | serialized string; value/loss table above |
| J-09-nan-object | 2 | serialized string; value/loss table above |
| J-09-nan-array | 2 | serialized string; value/loss table above |
| J-09-infinity-top | 2 | serialized string; value/loss table above |
| J-09-infinity-object | 2 | serialized string; value/loss table above |
| J-09-infinity-array | 2 | serialized string; value/loss table above |
| J-09-minus-infinity-top | 2 | serialized string; value/loss table above |
| J-09-minus-infinity-object | 2 | serialized string; value/loss table above |
| J-09-minus-infinity-array | 2 | serialized string; value/loss table above |
| J-09-bigint-top | 2 | stringify: TypeError (characterized) |
| J-09-bigint-object | 2 | stringify: TypeError (characterized) |
| J-09-bigint-array | 2 | stringify: TypeError (characterized) |
| J-09-cycle-top | 2 | stringify: TypeError (characterized) |
| J-09-cycle-object | 2 | stringify: TypeError (characterized) |
| J-09-cycle-array | 2 | stringify: TypeError (characterized) |
| J-09-date-top | 2 | serialized string; value/loss table above |
| J-09-date-object | 2 | serialized string; value/loss table above |
| J-09-date-array | 2 | serialized string; value/loss table above |
| J-09-map-top | 2 | serialized string; value/loss table above |
| J-09-map-object | 2 | serialized string; value/loss table above |
| J-09-map-array | 2 | serialized string; value/loss table above |
| J-09-set-top | 2 | serialized string; value/loss table above |
| J-09-set-object | 2 | serialized string; value/loss table above |
| J-09-set-array | 2 | serialized string; value/loss table above |
| J-09-sparse-top | 2 | serialized string; value/loss table above |
| J-09-sparse-object | 2 | serialized string; value/loss table above |
| J-09-sparse-array | 2 | serialized string; value/loss table above |
| J-10-native-0 | 2 | completed |
| J-10-native-2 | 2 | completed |
| J-10-native-10 | 2 | completed |
| J-10-canonical | 2 | completed |
| J-10-canonical-nan | 2 | canonicalize: TypeError (characterized) |
| J-10-canonical-infinity | 2 | canonicalize: TypeError (characterized) |
| J-10-canonical-minus-infinity | 2 | canonicalize: TypeError (characterized) |
| J-11-escapes-replace | 2 | serialized string; value/loss table above |
| J-11-escapes-fatal | 2 | serialized string; value/loss table above |
| J-11-escapes-stream-1 | 2 | serialized string; value/loss table above |
| J-11-emoji-replace | 2 | serialized string; value/loss table above |
| J-11-emoji-fatal | 2 | serialized string; value/loss table above |
| J-11-emoji-stream-1 | 2 | serialized string; value/loss table above |
| J-11-surrogate-replace | 2 | serialized string; value/loss table above |
| J-11-surrogate-fatal | 2 | serialized string; value/loss table above |
| J-11-surrogate-stream-1 | 2 | serialized string; value/loss table above |
| J-11-bom-replace | 2 | serialized string; value/loss table above |
| J-11-bom-fatal | 2 | serialized string; value/loss table above |
| J-11-bom-stream-1 | 2 | serialized string; value/loss table above |
| J-11-crlf-replace | 2 | serialized string; value/loss table above |
| J-11-crlf-fatal | 2 | serialized string; value/loss table above |
| J-11-crlf-stream-1 | 2 | serialized string; value/loss table above |
| J-11-no-lf-replace | 2 | serialized string; value/loss table above |
| J-11-no-lf-fatal | 2 | serialized string; value/loss table above |
| J-11-no-lf-stream-1 | 2 | serialized string; value/loss table above |
| J-11-invalid-replace | 2 | serialized string; value/loss table above |
| J-11-invalid-fatal | 2 | decode: TypeError (characterized) |
| J-11-invalid-stream-1 | 2 | serialized string; value/loss table above |
| J-12-native | 2 | parse: SyntaxError (characterized) |
| J-12-noop | 2 | serialized string; value/loss table above |
| J-12-edit | 2 | serialized string; value/loss table above |
| J-13-blank-1-lines | 2 | complete; 2 records |
| J-13-blank-1-raw | 2 | stream: SyntaxError (characterized) |
| J-13-blank-7-lines | 2 | complete; 2 records |
| J-13-blank-7-raw | 2 | stream: SyntaxError (characterized) |
| J-13-blank-0-lines | 2 | complete; 2 records |
| J-13-blank-0-raw | 2 | stream: SyntaxError (characterized) |
| J-13-crlf-1-lines | 2 | complete; 2 records |
| J-13-crlf-1-raw | 2 | stream: SyntaxError (characterized) |
| J-13-crlf-7-lines | 2 | complete; 2 records |
| J-13-crlf-7-raw | 2 | stream: SyntaxError (characterized) |
| J-13-crlf-0-lines | 2 | complete; 2 records |
| J-13-crlf-0-raw | 2 | stream: SyntaxError (characterized) |
| J-13-no-lf-1-lines | 2 | complete; 2 records |
| J-13-no-lf-1-raw | 2 | stream: SyntaxError (characterized) |
| J-13-no-lf-7-lines | 2 | complete; 2 records |
| J-13-no-lf-7-raw | 2 | stream: SyntaxError (characterized) |
| J-13-no-lf-0-lines | 2 | complete; 2 records |
| J-13-no-lf-0-raw | 2 | stream: SyntaxError (characterized) |
| J-13-malformed-1-lines | 2 | stream: SyntaxError (characterized) |
| J-13-malformed-1-raw | 2 | stream: SyntaxError (characterized) |
| J-13-malformed-7-lines | 2 | stream: SyntaxError (characterized) |
| J-13-malformed-7-raw | 2 | stream: SyntaxError (characterized) |
| J-13-malformed-0-lines | 2 | stream: SyntaxError (characterized) |
| J-13-malformed-0-raw | 2 | stream: SyntaxError (characterized) |
| J-14-mixed-1 | 2 | complete; 7 records |
| J-14-mixed-7 | 2 | complete; 7 records |
| J-14-mixed-0 | 2 | complete; 7 records |
| J-14-escaped-1 | 2 | complete; 2 records |
| J-14-escaped-7 | 2 | complete; 2 records |
| J-14-escaped-0 | 2 | complete; 2 records |
| J-14-truncated-1 | 2 | stream: SyntaxError (characterized) |
| J-14-truncated-7 | 2 | stream: SyntaxError (characterized) |
| J-14-truncated-0 | 2 | stream: SyntaxError (characterized) |
| J-15-lines-valid | 2 | complete; 2 records |
| J-15-lines-wrong-framing | 2 | stream: SyntaxError (characterized) |
| J-15-rs-valid | 2 | complete; 2 records |
| J-15-rs-wrong-framing | 2 | stream: SyntaxError (characterized) |
| J-16-depth-16 | 6 | completed |
| J-16-depth-64 | 6 | completed |
| J-16-depth-256 | 6 | completed |
| J-16-string-1024 | 6 | completed |
| J-16-string-1048576 | 6 | completed |
| J-16-string-8388608 | 6 | completed |
| J-16-records-100 | 6 | complete; 100 records |
| J-16-records-10000 | 6 | complete; 10000 records |
| J-17-missing | 2 | read: NotFound (characterized) |
| J-17-unreadable | 2 | read: PermissionDenied (characterized) |
| J-17-missing-parent | 2 | write: NotFound (characterized) |
| J-17-unwritable | 2 | write: PermissionDenied (characterized) |
| J-17-raw-interrupt | 2 | expected external wall stop at retained checkpoint |
| J-17-safe-interrupt | 2 | expected external wall stop at retained checkpoint |
| J-17-rename-injected | 2 | rename: Error (characterized) |
| J-17-rename-directory | 2 | rename: IsADirectory (characterized) |

## Limits and decision use

The observed native path suffices for explicitly bounded JSON values, but cannot promise exact numeric tokens, duplicate rejection or presentation preservation. Source-aware/raw APIs are a version-specific candidate, not an accepted library design. Canonicalization is a separate output policy, not document preservation. All package conclusions apply to the retained runtime graph; licenses, ancestry, type/dev/example graphs, cold offline failures and full adoption policy remain Slice04.

J-15 tests known matching frames and a declared BAD-prefix corruption. Its simple matching decoder strips a known RS and is not a general RFC text-sequence validator; absence/recovery/security rules need a later library contract. J-17 uses a fixed sibling name inside a fresh private directory with createNew, not a concurrent multiwriter protocol. Power loss, directory fsync, symlinks, reader atomicity and cross-filesystem behavior remain Slice04.

No format expectation was relaxed after observations. Source corrections occurred before the 354 format attempts; their limitations and noncomparable authoring history are retained separately. All evidence checks are same-author attestation; none substitutes for CDC, full AE01 trials or operator aesthetic acceptance.
