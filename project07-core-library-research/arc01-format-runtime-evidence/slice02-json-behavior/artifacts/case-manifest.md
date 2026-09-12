# Frozen JSON case manifest — J2-M01

Frozen before runtime execution, 2026-09-12. RP01/FM01 govern. Each row in
inputs.json is an independent variant; arguments are literal Unicode strings
with retained UTF-8 SHA-256. File inputs use explicit hex bytes. No fixture
is parsed as its own expected-value oracle. Zero chunk size means whole input.
Native and package deterministic variants run twice in fresh child processes;
stress variants use one warm-up followed by five measured fresh processes.
Unknown outcomes are characterization, not presumed fidelity passes.

Supervisor budgets: 10s wall, 16MiB combined output, 512MiB sampled process-tree
RSS; payload <=8MiB, encoded input <=9MiB, nesting <=256. Controls intentionally
use a 500ms wall bound, 4096-byte output bound, and 1KiB sampled RSS threshold
against a benign child. Stress and interrupted-write routes wait for verified
process-tree termination and RSS observation. Non-stress malformed data is
expected failure; a harness/compiler failure is not a format result.

Native first. Package execution waits for the exact graph and frozen lock;
selected streams 1.1.2 satisfies std/json's ^1.1.0 edge and is pinned explicitly.
No Node/npm edges are permitted. Inputs/outputs/cache/compiled files live under
the per-batch disposable root, with a fresh subdirectory per attempt. Parser
cases have no application grants; file scopes are explicit in inputs.json.

All existing J-01–17 families are retained. J-17 distinguishes actual mode/path
failures, external interruption, and a declared injected rename failure. The
safe route writes a unique sibling, completes writes, syncs/closes, and renames;
raw write truncation is a separate condition. No durability claim is predeclared.

| Variant | Operation / phase | Predeclared invariant or question |
| --- | --- | --- |
| J-01-edit | file / native | Only n becomes 2; input unchanged; destination matches independent expected tree |
| J-02-null | parse / native | Parse success with exact original kind/value; successful null is not error |
| J-02-false | parse / native | Parse success with exact original kind/value; successful null is not error |
| J-02-zero | parse / native | Parse success with exact original kind/value; successful null is not error |
| J-02-empty-string | parse / native | Parse success with exact original kind/value; successful null is not error |
| J-02-array | parse / native | Parse success with exact original kind/value; successful null is not error |
| J-02-object | parse / native | Parse success with exact original kind/value; successful null is not error |
| J-03-1 | reject-file / native | SyntaxError before destination replacement; destination bytes unchanged |
| J-03-2 | reject-file / native | SyntaxError before destination replacement; destination bytes unchanged |
| J-03-3 | reject-file / native | SyntaxError before destination replacement; destination bytes unchanged |
| J-03-4 | reject-file / native | SyntaxError before destination replacement; destination bytes unchanged |
| J-03-5 | reject-file / native | SyntaxError before destination replacement; destination bytes unchanged |
| J-03-6 | reject-file / native | SyntaxError before destination replacement; destination bytes unchanged |
| J-04-1 | number / native | Retain lexeme; independently expected Number spelling 9007199254740991; serialized normalization/loss reported |
| J-05-1 | exact / native | Retain original string; BigInt directly from integral token; characterize source reviver/rawJSON availability and bytes |
| J-04-2 | number / native | Retain lexeme; independently expected Number spelling 9007199254740992; serialized normalization/loss reported |
| J-05-2 | exact / native | Retain original string; BigInt directly from integral token; characterize source reviver/rawJSON availability and bytes |
| J-04-3 | number / native | Retain lexeme; independently expected Number spelling 9007199254740992; serialized normalization/loss reported |
| J-05-3 | exact / native | Retain original string; BigInt directly from integral token; characterize source reviver/rawJSON availability and bytes |
| J-04-4 | number / native | Retain lexeme; independently expected Number spelling -9007199254740992; serialized normalization/loss reported |
| J-05-4 | exact / native | Retain original string; BigInt directly from integral token; characterize source reviver/rawJSON availability and bytes |
| J-04-5 | number / native | Retain lexeme; independently expected Number spelling 0.1; serialized normalization/loss reported |
| J-05-5 | exact / native | Retain original string; BigInt directly from integral token; characterize source reviver/rawJSON availability and bytes |
| J-04-6 | number / native | Retain lexeme; independently expected Number spelling 1.23; serialized normalization/loss reported |
| J-05-6 | exact / native | Retain original string; BigInt directly from integral token; characterize source reviver/rawJSON availability and bytes |
| J-04-7 | number / native | Retain lexeme; independently expected Number spelling Infinity; serialized normalization/loss reported |
| J-05-7 | exact / native | Retain original string; BigInt directly from integral token; characterize source reviver/rawJSON availability and bytes |
| J-04-8 | number / native | Retain lexeme; independently expected Number spelling 0; serialized normalization/loss reported |
| J-05-8 | exact / native | Retain original string; BigInt directly from integral token; characterize source reviver/rawJSON availability and bytes |
| J-04-9 | number / native | Retain lexeme; independently expected Number spelling -0; serialized normalization/loss reported |
| J-05-9 | exact / native | Retain original string; BigInt directly from integral token; characterize source reviver/rawJSON availability and bytes |
| J-06-top | duplicates / native | Last value 2; fixture contains two equal decoded names; reviver visits surviving key only |
| J-06-nested | duplicates / native | Last value 2; fixture contains two equal decoded names; reviver visits surviving key only |
| J-06-escaped | duplicates / native | Last value 2; fixture contains two equal decoded names; reviver visits surviving key only |
| J-07-absent | presence / native | Distinguish own presence, undefined and null; nullish defaults preserve false/0/empty |
| J-07-null | presence / native | Distinguish own presence, undefined and null; nullish defaults preserve false/0/empty |
| J-07-false | presence / native | Distinguish own presence, undefined and null; nullish defaults preserve false/0/empty |
| J-07-zero | presence / native | Distinguish own presence, undefined and null; nullish defaults preserve false/0/empty |
| J-07-empty | presence / native | Distinguish own presence, undefined and null; nullish defaults preserve false/0/empty |
| J-07-undefined | presence / native | Distinguish own presence, undefined and null; nullish defaults preserve false/0/empty |
| J-08-keys | keys / native | Exact nine own keys; each value increments by 10; input prototype and default object prototype unchanged |
| J-09-undefined-top | unsupported / native | Characterize tagged original vs omission/null/throw/toJSON/coercion; BigInt and cycles throw |
| J-09-undefined-object | unsupported / native | Characterize tagged original vs omission/null/throw/toJSON/coercion; BigInt and cycles throw |
| J-09-undefined-array | unsupported / native | Characterize tagged original vs omission/null/throw/toJSON/coercion; BigInt and cycles throw |
| J-09-function-top | unsupported / native | Characterize tagged original vs omission/null/throw/toJSON/coercion; BigInt and cycles throw |
| J-09-function-object | unsupported / native | Characterize tagged original vs omission/null/throw/toJSON/coercion; BigInt and cycles throw |
| J-09-function-array | unsupported / native | Characterize tagged original vs omission/null/throw/toJSON/coercion; BigInt and cycles throw |
| J-09-symbol-top | unsupported / native | Characterize tagged original vs omission/null/throw/toJSON/coercion; BigInt and cycles throw |
| J-09-symbol-object | unsupported / native | Characterize tagged original vs omission/null/throw/toJSON/coercion; BigInt and cycles throw |
| J-09-symbol-array | unsupported / native | Characterize tagged original vs omission/null/throw/toJSON/coercion; BigInt and cycles throw |
| J-09-nan-top | unsupported / native | Characterize tagged original vs omission/null/throw/toJSON/coercion; BigInt and cycles throw |
| J-09-nan-object | unsupported / native | Characterize tagged original vs omission/null/throw/toJSON/coercion; BigInt and cycles throw |
| J-09-nan-array | unsupported / native | Characterize tagged original vs omission/null/throw/toJSON/coercion; BigInt and cycles throw |
| J-09-infinity-top | unsupported / native | Characterize tagged original vs omission/null/throw/toJSON/coercion; BigInt and cycles throw |
| J-09-infinity-object | unsupported / native | Characterize tagged original vs omission/null/throw/toJSON/coercion; BigInt and cycles throw |
| J-09-infinity-array | unsupported / native | Characterize tagged original vs omission/null/throw/toJSON/coercion; BigInt and cycles throw |
| J-09-minus-infinity-top | unsupported / native | Characterize tagged original vs omission/null/throw/toJSON/coercion; BigInt and cycles throw |
| J-09-minus-infinity-object | unsupported / native | Characterize tagged original vs omission/null/throw/toJSON/coercion; BigInt and cycles throw |
| J-09-minus-infinity-array | unsupported / native | Characterize tagged original vs omission/null/throw/toJSON/coercion; BigInt and cycles throw |
| J-09-bigint-top | unsupported / native | Characterize tagged original vs omission/null/throw/toJSON/coercion; BigInt and cycles throw |
| J-09-bigint-object | unsupported / native | Characterize tagged original vs omission/null/throw/toJSON/coercion; BigInt and cycles throw |
| J-09-bigint-array | unsupported / native | Characterize tagged original vs omission/null/throw/toJSON/coercion; BigInt and cycles throw |
| J-09-cycle-top | unsupported / native | Characterize tagged original vs omission/null/throw/toJSON/coercion; BigInt and cycles throw |
| J-09-cycle-object | unsupported / native | Characterize tagged original vs omission/null/throw/toJSON/coercion; BigInt and cycles throw |
| J-09-cycle-array | unsupported / native | Characterize tagged original vs omission/null/throw/toJSON/coercion; BigInt and cycles throw |
| J-09-date-top | unsupported / native | Characterize tagged original vs omission/null/throw/toJSON/coercion; BigInt and cycles throw |
| J-09-date-object | unsupported / native | Characterize tagged original vs omission/null/throw/toJSON/coercion; BigInt and cycles throw |
| J-09-date-array | unsupported / native | Characterize tagged original vs omission/null/throw/toJSON/coercion; BigInt and cycles throw |
| J-09-map-top | unsupported / native | Characterize tagged original vs omission/null/throw/toJSON/coercion; BigInt and cycles throw |
| J-09-map-object | unsupported / native | Characterize tagged original vs omission/null/throw/toJSON/coercion; BigInt and cycles throw |
| J-09-map-array | unsupported / native | Characterize tagged original vs omission/null/throw/toJSON/coercion; BigInt and cycles throw |
| J-09-set-top | unsupported / native | Characterize tagged original vs omission/null/throw/toJSON/coercion; BigInt and cycles throw |
| J-09-set-object | unsupported / native | Characterize tagged original vs omission/null/throw/toJSON/coercion; BigInt and cycles throw |
| J-09-set-array | unsupported / native | Characterize tagged original vs omission/null/throw/toJSON/coercion; BigInt and cycles throw |
| J-09-sparse-top | unsupported / native | Characterize tagged original vs omission/null/throw/toJSON/coercion; BigInt and cycles throw |
| J-09-sparse-object | unsupported / native | Characterize tagged original vs omission/null/throw/toJSON/coercion; BigInt and cycles throw |
| J-09-sparse-array | unsupported / native | Characterize tagged original vs omission/null/throw/toJSON/coercion; BigInt and cycles throw |
| J-10-native-0 | order / native | Same insertion-order value serializes deterministically; alternate insertion order need not match |
| J-10-native-2 | order / native | Same insertion-order value serializes deterministically; alternate insertion order need not match |
| J-10-native-10 | order / native | Same insertion-order value serializes deterministically; alternate insertion order need not match |
| J-10-canonical | canonical / package | Both canonical APIs give equal output across insertion orders and equal UTF-8 bytes |
| J-10-canonical-nan | canonical-reject / package | Canonicalization rejects nonfinite input with TypeError |
| J-10-canonical-infinity | canonical-reject / package | Canonicalization rejects nonfinite input with TypeError |
| J-10-canonical-minus-infinity | canonical-reject / package | Canonicalization rejects nonfinite input with TypeError |
| J-11-escapes-replace | decode / native | Preserve raw bytes and decoded string; characterize BOM/invalid decoding and serialization; fatal decoder rejects invalid UTF-8 |
| J-11-escapes-fatal | decode / native | Preserve raw bytes and decoded string; characterize BOM/invalid decoding and serialization; fatal decoder rejects invalid UTF-8 |
| J-11-escapes-stream-1 | decode / native | Preserve raw bytes and decoded string; characterize BOM/invalid decoding and serialization; fatal decoder rejects invalid UTF-8 |
| J-11-emoji-replace | decode / native | Preserve raw bytes and decoded string; characterize BOM/invalid decoding and serialization; fatal decoder rejects invalid UTF-8 |
| J-11-emoji-fatal | decode / native | Preserve raw bytes and decoded string; characterize BOM/invalid decoding and serialization; fatal decoder rejects invalid UTF-8 |
| J-11-emoji-stream-1 | decode / native | Preserve raw bytes and decoded string; characterize BOM/invalid decoding and serialization; fatal decoder rejects invalid UTF-8 |
| J-11-surrogate-replace | decode / native | Preserve raw bytes and decoded string; characterize BOM/invalid decoding and serialization; fatal decoder rejects invalid UTF-8 |
| J-11-surrogate-fatal | decode / native | Preserve raw bytes and decoded string; characterize BOM/invalid decoding and serialization; fatal decoder rejects invalid UTF-8 |
| J-11-surrogate-stream-1 | decode / native | Preserve raw bytes and decoded string; characterize BOM/invalid decoding and serialization; fatal decoder rejects invalid UTF-8 |
| J-11-bom-replace | decode / native | Preserve raw bytes and decoded string; characterize BOM/invalid decoding and serialization; fatal decoder rejects invalid UTF-8 |
| J-11-bom-fatal | decode / native | Preserve raw bytes and decoded string; characterize BOM/invalid decoding and serialization; fatal decoder rejects invalid UTF-8 |
| J-11-bom-stream-1 | decode / native | Preserve raw bytes and decoded string; characterize BOM/invalid decoding and serialization; fatal decoder rejects invalid UTF-8 |
| J-11-crlf-replace | decode / native | Preserve raw bytes and decoded string; characterize BOM/invalid decoding and serialization; fatal decoder rejects invalid UTF-8 |
| J-11-crlf-fatal | decode / native | Preserve raw bytes and decoded string; characterize BOM/invalid decoding and serialization; fatal decoder rejects invalid UTF-8 |
| J-11-crlf-stream-1 | decode / native | Preserve raw bytes and decoded string; characterize BOM/invalid decoding and serialization; fatal decoder rejects invalid UTF-8 |
| J-11-no-lf-replace | decode / native | Preserve raw bytes and decoded string; characterize BOM/invalid decoding and serialization; fatal decoder rejects invalid UTF-8 |
| J-11-no-lf-fatal | decode / native | Preserve raw bytes and decoded string; characterize BOM/invalid decoding and serialization; fatal decoder rejects invalid UTF-8 |
| J-11-no-lf-stream-1 | decode / native | Preserve raw bytes and decoded string; characterize BOM/invalid decoding and serialization; fatal decoder rejects invalid UTF-8 |
| J-11-invalid-replace | decode / native | Preserve raw bytes and decoded string; characterize BOM/invalid decoding and serialization; fatal decoder rejects invalid UTF-8 |
| J-11-invalid-fatal | decode / native | Preserve raw bytes and decoded string; characterize BOM/invalid decoding and serialization; fatal decoder rejects invalid UTF-8 |
| J-11-invalid-stream-1 | decode / native | Preserve raw bytes and decoded string; characterize BOM/invalid decoding and serialization; fatal decoder rejects invalid UTF-8 |
| J-12-native | parse / native | Native JSON rejects comments/trailing comma |
| J-12-noop | jsonc / package | JSONC accepts; native rewrite loses comments; edit only changes n value to 2 |
| J-12-edit | jsonc / package | JSONC accepts; native rewrite loses comments; edit only changes n value to 2 |
| J-13-blank-1-lines | ndjson / package | Line framing: preserve two records (malformed: prefix 1 then syntax error); raw chunks are negative controls |
| J-13-blank-1-raw | ndjson / package | Line framing: preserve two records (malformed: prefix 1 then syntax error); raw chunks are negative controls |
| J-13-blank-7-lines | ndjson / package | Line framing: preserve two records (malformed: prefix 1 then syntax error); raw chunks are negative controls |
| J-13-blank-7-raw | ndjson / package | Line framing: preserve two records (malformed: prefix 1 then syntax error); raw chunks are negative controls |
| J-13-blank-0-lines | ndjson / package | Line framing: preserve two records (malformed: prefix 1 then syntax error); raw chunks are negative controls |
| J-13-blank-0-raw | ndjson / package | Line framing: preserve two records (malformed: prefix 1 then syntax error); raw chunks are negative controls |
| J-13-crlf-1-lines | ndjson / package | Line framing: preserve two records (malformed: prefix 1 then syntax error); raw chunks are negative controls |
| J-13-crlf-1-raw | ndjson / package | Line framing: preserve two records (malformed: prefix 1 then syntax error); raw chunks are negative controls |
| J-13-crlf-7-lines | ndjson / package | Line framing: preserve two records (malformed: prefix 1 then syntax error); raw chunks are negative controls |
| J-13-crlf-7-raw | ndjson / package | Line framing: preserve two records (malformed: prefix 1 then syntax error); raw chunks are negative controls |
| J-13-crlf-0-lines | ndjson / package | Line framing: preserve two records (malformed: prefix 1 then syntax error); raw chunks are negative controls |
| J-13-crlf-0-raw | ndjson / package | Line framing: preserve two records (malformed: prefix 1 then syntax error); raw chunks are negative controls |
| J-13-no-lf-1-lines | ndjson / package | Line framing: preserve two records (malformed: prefix 1 then syntax error); raw chunks are negative controls |
| J-13-no-lf-1-raw | ndjson / package | Line framing: preserve two records (malformed: prefix 1 then syntax error); raw chunks are negative controls |
| J-13-no-lf-7-lines | ndjson / package | Line framing: preserve two records (malformed: prefix 1 then syntax error); raw chunks are negative controls |
| J-13-no-lf-7-raw | ndjson / package | Line framing: preserve two records (malformed: prefix 1 then syntax error); raw chunks are negative controls |
| J-13-no-lf-0-lines | ndjson / package | Line framing: preserve two records (malformed: prefix 1 then syntax error); raw chunks are negative controls |
| J-13-no-lf-0-raw | ndjson / package | Line framing: preserve two records (malformed: prefix 1 then syntax error); raw chunks are negative controls |
| J-13-malformed-1-lines | ndjson / package | Line framing: preserve two records (malformed: prefix 1 then syntax error); raw chunks are negative controls |
| J-13-malformed-1-raw | ndjson / package | Line framing: preserve two records (malformed: prefix 1 then syntax error); raw chunks are negative controls |
| J-13-malformed-7-lines | ndjson / package | Line framing: preserve two records (malformed: prefix 1 then syntax error); raw chunks are negative controls |
| J-13-malformed-7-raw | ndjson / package | Line framing: preserve two records (malformed: prefix 1 then syntax error); raw chunks are negative controls |
| J-13-malformed-0-lines | ndjson / package | Line framing: preserve two records (malformed: prefix 1 then syntax error); raw chunks are negative controls |
| J-13-malformed-0-raw | ndjson / package | Line framing: preserve two records (malformed: prefix 1 then syntax error); raw chunks are negative controls |
| J-14-mixed-1 | concat / package | Characterize ordered values, scalar boundaries and incomplete final value; no arbitrary-chunk assumption |
| J-14-mixed-7 | concat / package | Characterize ordered values, scalar boundaries and incomplete final value; no arbitrary-chunk assumption |
| J-14-mixed-0 | concat / package | Characterize ordered values, scalar boundaries and incomplete final value; no arbitrary-chunk assumption |
| J-14-escaped-1 | concat / package | Characterize ordered values, scalar boundaries and incomplete final value; no arbitrary-chunk assumption |
| J-14-escaped-7 | concat / package | Characterize ordered values, scalar boundaries and incomplete final value; no arbitrary-chunk assumption |
| J-14-escaped-0 | concat / package | Characterize ordered values, scalar boundaries and incomplete final value; no arbitrary-chunk assumption |
| J-14-truncated-1 | concat / package | Characterize ordered values, scalar boundaries and incomplete final value; no arbitrary-chunk assumption |
| J-14-truncated-7 | concat / package | Characterize ordered values, scalar boundaries and incomplete final value; no arbitrary-chunk assumption |
| J-14-truncated-0 | concat / package | Characterize ordered values, scalar boundaries and incomplete final value; no arbitrary-chunk assumption |
| J-15-lines-valid | stringify / package | Exact prefix/suffix bytes; matching framing yields two records, mismatched framing separately rejected/characterized |
| J-15-lines-wrong-framing | stringify / package | Exact prefix/suffix bytes; matching framing yields two records, mismatched framing separately rejected/characterized |
| J-15-rs-valid | stringify / package | Exact prefix/suffix bytes; matching framing yields two records, mismatched framing separately rejected/characterized |
| J-15-rs-wrong-framing | stringify / package | Exact prefix/suffix bytes; matching framing yields two records, mismatched framing separately rejected/characterized |
| J-16-depth-16 | stress / stress | Parsed nested array depth equals declared depth; under supervisor budgets |
| J-16-depth-64 | stress / stress | Parsed nested array depth equals declared depth; under supervisor budgets |
| J-16-depth-256 | stress / stress | Parsed nested array depth equals declared depth; under supervisor budgets |
| J-16-string-1024 | stress / stress | Parsed string length equals payload; under supervisor budgets |
| J-16-string-1048576 | stress / stress | Parsed string length equals payload; under supervisor budgets |
| J-16-string-8388608 | stress / stress | Parsed string length equals payload; under supervisor budgets |
| J-16-records-100 | stress / stress | Framed stream yields exact record count; no constant-memory inference |
| J-16-records-10000 | stress / stress | Framed stream yields exact record count; no constant-memory inference |
| J-17-missing | file / native | Failure is explicit; safe replacement preserves original destination; raw interrupted write may truncate, reported separately |
| J-17-unreadable | file / native | Failure is explicit; safe replacement preserves original destination; raw interrupted write may truncate, reported separately |
| J-17-missing-parent | file / native | Failure is explicit; safe replacement preserves original destination; raw interrupted write may truncate, reported separately |
| J-17-unwritable | file / native | Failure is explicit; safe replacement preserves original destination; raw interrupted write may truncate, reported separately |
| J-17-raw-interrupt | file / native | Failure is explicit; safe replacement preserves original destination; raw interrupted write may truncate, reported separately |
| J-17-safe-interrupt | file / native | Failure is explicit; safe replacement preserves original destination; raw interrupted write may truncate, reported separately |
| J-17-rename-injected | file / native | Failure is explicit; safe replacement preserves original destination; raw interrupted write may truncate, reported separately |
| J-17-rename-directory | file / native | Failure is explicit; safe replacement preserves original destination; raw interrupted write may truncate, reported separately |

Total: 161 variants across 17 families. Original input manifest SHA-256: `37a61ee952c563271f1bdaedb4bdd14e4a973675d904bb408e9e691602523bcb`.

Pre-execution amendment J2-M01.1: corrected escaped-quote fixture construction to single JSON escapes. No variant removed or invariant changed. Original inputs retained in raw transcript. Current inputs SHA-256: `37a61ee952c563271f1bdaedb4bdd14e4a973675d904bb408e9e691602523bcb`.
