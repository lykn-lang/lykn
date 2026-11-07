# Frozen Slice17 predictions

These are copied from the accepted Slice11 §5 / original Slice12 fixed
controls. Inputs remain inert bytes; no source text or AST is executed. The
original control file is byte-identical at its pinned SHA. Supervisor pass means
all 13 child verdicts match; it does not turn a scanner's expected incomplete
status or exit 2 into a successful scan.

| ID | Expected terminal | Direct parents | Reasons | Other exact oracle |
|---|---|---:|---:|---|
| K11 | `parser_artifact_identity_mismatch`; aggregate `incomplete`; exit 2 | N/A: one required reference row is `not_processed` | 0 | 64 zero expected parser hash; actual pinned Acorn hash retained; no input read, parser import, parse, AST, or fallback. |
| K01 | `complete_with_findings` or `complete_no_findings` per implementation report; aggregate complete; exit 0 | 0 | 0 | `Program`, two body statements, range `[0,66]`, end `5:0`; function body call path `Program.body[0].body.body[0].expression` at `2:2`, range `[20,30]` deferred; arrow body deferred. |
| K02 | complete; exit 0 | 2 | 3 | Declaration and expression parents. Outer IIFE `CallExpression` at `1:14`; `run` `CallExpression` plus `Identifier` at `2:0`; no IIFE-body reason. |
| K03 | complete; exit 0 | 1 | 2 | Declaration. At `Program.body[0].declarations[0].init`, `MemberExpression` and object `Identifier` both `1:14`; static property `field` is a name, not a read. |
| K04 | complete; exit 0 | 1 | 4 | Destructuring at `Program.body[0].declarations[0].id` `1:6`; fallback call and identifier at `id.properties[0].value.right` `1:16`; source identifier at `declarations[0].init` `1:31`. |
| K05 | complete; exit 0 | 2 | 4 | Spread at `body[0].declarations[0].init.properties[0]` `1:16`; source identifier `1:19`; template coercion at `body[1].declarations[0].init` `2:13`; substitution identifier `2:17`. |
| K06 | complete; exit 0 | 1 | 9 | Heritage validation + `Base` read at `superClass` `1:18`; computed key call + `key` read + key coercion at `ClassBody.body[0].key` `2:3`; static initializer call + `init` read `3:17`; static-block `start` call + `start` identifier both `4:11`. Method body `run` and instance initializer `later` deferred. |
| K07 | complete; exit 0 | 1 | 3 | `IfStatement`; `ready` read at `body[0].test` `1:4`; nested `ThrowStatement` at `body[0].consequent.body[0]` `2:2`; `issue` read at its argument `2:8`. |
| K08 | complete; exit 0 | 1 | 3 | Two dependency edges, first is also `bare_import`; `AwaitExpression` at `body[2].expression` `3:0`; call and `load` identifier at `3:6`; Program range `[0,67]`, end `4:0`; await range `[53,65]`, call range `[59,65]`. |
| K09 | `parse_error`; aggregate `incomplete`; exit 2 | 0 | 0 | Actual parser diagnostic retained; `pos=14`, location `1:14`; no AST. |
| K10a | `source_missing`; aggregate `incomplete`; exit 2 | 0 | 0 | Exact absent `missing-control.js` read is granted, making `NotFound` observable; distinct key; no AST. |
| K10b | `source_unreadable`; aggregate `incomplete`; exit 2 | 0 | 0 | Staged existing `unreadable-control.js` is hash-receipted by observer, but exact file read is omitted from child grant; distinguish `NotCapable`; distinct key; no AST. |
| K12 | `unsupported_ast`; synthetic unit exit 2 | N/A: file/parser counts are not applicable | N/A | Direct walker injection reports `ExperimentalNode` at `Program.body[0]`; absent location/range retained as null; no parser import or file/source count. |

Expected child distribution: 8 complete scanner cases (K01–K08), five
expected incomplete/unit outcomes (K09, K10a, K10b, K11, K12), with the last
synthetic and outside parser/file counts. Across scanner calls: 12 selected file
condition rows including K11's gated K01 reference; 8 parsed and completely
walked, one each parse error/missing/unreadable/not-processed. K01–K08 aggregate
9 direct parents and 28 nested reasons; per-condition counts are not summed as
a distinct-source population. No full-corpus or future-node claim follows.

## Module prerequisites fixed before runtime

- `parser-core.js` and `estree-walker.js` with zero args: actual module load,
  exit 0, empty stdout/stderr.
- `scanner.js` with zero args: exit 2, stdout exactly
  `{"status":"scanner_usage_error","expectedArgs":1,"actualArgs":0}\n`,
  empty stderr; guard before IO or parser import.
- `capability-observer.js` with zero args: exit 2, stdout exactly
  `{"status":"observer_usage_error","expectedArgs":8,"actualArgs":0}\n`,
  empty stderr; guard before IO or child launch.

Those four guard runs are preconditions, not extra capability observations.
