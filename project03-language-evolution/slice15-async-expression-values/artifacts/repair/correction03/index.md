# Correction03 raw evidence index

Source freeze: `0fe6663c49f35608927832cfc7b8bf09cf50551d` on `codex/async-expression-values`. Tool/source IDs and exact commands are in `pins.md`.

## Frozen countercontrols and correction evidence

- `class-countercontrol-before.log`: first class test body from `b315774` passed, but was weak: its method name `await` appeared under the async wrapper, which the draft scanner already treated as a function boundary.
- `class-countercontrol-corrected-before.log`: corrected method-name/deferred-method/eager-superclass control, frozen in `03325b5`, failed on the draft as intended (exit 101).
- `carrier-countercontrol-before.log`: fallthrough and current-scope return carrier control, frozen in `b8eed7c`, failed before the carrier fix as intended (exit 101).
- `wip-before-carrier-countercontrol.patch`: exact implementation WIP saved while the shared forms.rs path was temporarily restored for the carrier unit freeze; SHA-256 is recorded in `pins.md`.
- Source-guided details retained in `0fe6663`: native class scanner follows superclass/member roles; JS scanner consumes compiled ESTree and distinguishes eager class keys/heritage/static values from deferred method bodies/instance initializers; both async IIFE paths append boxed-undefined normal fallthrough and box only returns in the synthetic scope. Generated returns are not double-boxed. The fallback `if` test is included because it executes inside that IIFE.

## Fresh focused results on frozen source

- `native-await-units.log`: class, nested-function, for-await, bound-await scanner controls, 2 passed.
- `native-bound-call-unit.log`: resolved-bound call argument is emitted in value context, 1 passed.
- `native-carrier-unit.log`: boxed normal fallthrough/current-scope return controls, 1 passed.
- `native-runtime.log`: unchanged E1–E5 native fixture suite, all five runtime exits are 0 and its test result is 1 passed.
- `js-runtime.log`: unchanged E1–E5 public-JS suite, all five runtime codes are 0 and Deno reports 1 passed / 5 steps.
- Exact expected JSON remains the corrected correction02 oracle; no fixture, expected value, or test family changed in correction03.
- `native-build.log` and `native-test-build.log` retain the offline build/no-run receipts before focused runtime execution.

## Historical limits and pending review

- `implementation01/native-runtime.log` and `implementation01/js-runtime.log` predate the production source freeze and are draft observations only. A later JS edit was untested at that time. The earlier embedded-JS formatter attempt is attested in the task history, but its raw receipt is not retained; it is not claimed as current verification.
- CDC has paused full Make/citation gates for correction04 after reviewing this frozen source. The current statement-form table omits `for-await-of`, so a terminal value-do can place that loop where a value return is expected. This is pending a private-tail countercontrol and scoped fix; no workaround or source edit was made after `0fe6663`.
- CDC is also adjudicating whether the native await scan call sites should consume already-emitted kernel SExprs rather than their pre-emission lowered SExpr inputs. The source and results are preserved unchanged for that review.
- No parser observations or acceptance disposition are claimed.
