# Phase A frozen predictions

These expectations are frozen before runtime. K01/K08/K09 are parser-only
observations; none exercises a walker or executes the JavaScript text. K11 is
the required pre-import negative control.

| Order | ID | Expected observation |
|---:|---|---|
| 1 | K11 | With expected SHA-256 equal to 64 zero hex digits, the selected artifact's actual SHA remains `1cbcbf252a5800e496dc505c706f309a9dd4e1789392e12963c77ae9497ff6f7`; emit `parser_artifact_identity_mismatch`, exit 2, and do not import Acorn or produce an AST. |
| 2 | K01 | Exact input is `function lazy() {\n  runLater();\n}\nconst later = () => runLater();\n`. Parse succeeds as `Program`, `sourceType=module`, two body statements, range `[0,66]`, end location `5:0`. Function-body call path `body[0].body.body[0].expression` is at `2:2`, range `[20,30]`; arrow-body call is deferred parser data and is not executed. |
| 3 | K08 | Exact input is `import "./dep.js";\nexport { value } from "./dep.js";\nawait load();\n`. Parse succeeds as `Program`, `sourceType=module`, three body statements, range `[0,67]`, end location `4:0`. `body[2].expression` is `AwaitExpression` at `3:0`, range `[53,65]`; nested `CallExpression` is at `3:6`, range `[59,65]`. Static imports/re-exports remain parser data only. |
| 4 | K09 | Exact input is `const value = ;\n`. Acorn throws an actual `SyntaxError` with `pos=14`, `loc={line:1,column:14}`. Emit `parse_error`, preserve Acorn's actual message, no AST, exit 2. |

Ranges and locations above are source-derived, not measured: accepted Slice11
contract §5 fixes the literal LF inputs; Acorn's cached `parseTopLevel` and
`finishNode` source (`dist/acorn.mjs:862–879,3939`) establishes Program and
expression range/loc construction. Acorn `loc.line` is one-based, columns are
zero-based, and range offsets are UTF-16 code units. A disagreement is a stop;
do not alter this file to fit an observed result.
