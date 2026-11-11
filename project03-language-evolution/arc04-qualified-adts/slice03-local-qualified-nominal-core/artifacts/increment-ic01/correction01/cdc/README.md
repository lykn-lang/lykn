# Independent IC-01 correction01 verification — HOLD

Candidate `b8a1fa17cf9543c22a52228d17f0dd19e3fcf0a1`, tree
`d3e604b206cfedac1ec97a5932ba8b1bb5fca61f`, clean on
`codex/qualified-adt-core`. Reviewed the eleven-path delta from
`5bdbfe3c27c58bdcbf93471d1c469c53ef2eaabe`, issued iteration07 and correction
design. No source/index changes were made. `git diff --check` passes.

[Raw receipts](receipts-b8a1fa17.tar.gz), SHA-256:
`26d6d7c93e21bd8830ff36dc5c59de668f0e142a3c74d64f740120856244d380`.
The archive contains Lykn-authored drivers and their compiled output, actual
probe sources/generated modules, environment/argv/status/stdout/stderr receipts,
and summaries. npm/XDG/tmp caches are excluded. The original scratch home was
`/private/tmp/lykn-s03-ic01-cdc-b8a1fa17`.

## Findings requiring correction

### IC-R06 — real binding-pattern aliases are read as typed parameters

This supported loop is accepted by native checked and stripped compile and by
native check (all exit 0), and by public direct validation, complete compilation
and expandExpr. Both backends emit an actual reserved binding; executing the
generated `.mjs` exits 1 with strict-mode SyntaxError at `package`:

```lisp
(for-of (object (alias :value package))
  (array (obj :value 1))
  (console:log 1))
```

The source-bind counterpart has the same native escape:

```lisp
(bind (object (alias :value package)) (obj :value 1))
(console:log 1)
```

Public direct validation misses that bind too, but public final compilation and
expandExpr reject it after lowering. Source-inspected cause: `loop_names` and
`catch_names` in native binding.rs:956/989 call the default source projector;
public binding.js:424–450 also defaults loop/catch pattern projection to source.
The source-bind projection/default callers use the same inappropriate grammar
for these binding patterns. Typed nested aliases instead treat their keyword
slot as type metadata, so a keyword alone cannot determine grammar.

Crucially, the matching safe-local loop and bind each pass native checked and
stripped compile/check and public compilation, and their actual emitted modules
print exactly `1\n` with empty stderr. This establishes supported grammar.
The catch variant is retained as a confounded observation only: its safe-local
counterpart also fails older native/public lowering, so no catch runtime repair
is inferred here.

Receipts: `receipts/loop-catch-census/`, `loop-catch-results.json`,
`receipts/bind-census/`, `bind-results.json`; sources `probes/{loop,bind}-keyword-key*.lykn`.

### IC-R07 — public function defaults are traversed twice

The direct `walkBindings` walk of this kernel function returns
`[example,value,local,inner,local,inner]`:

```lisp
(function example
  ((default value (do (bind local (fn (:any inner) inner)) local)))
  (return value))
```

The analogous typed fn and kernel arrow each return
`[value,local,inner,local,inner]`. Class-member and kernel-declaration controls
visit their same nested defaults once, returning `[Example,value,local,inner]`
and `[value,local,inner]`. Public binding.js:179–184 explicitly traverses
parameter defaults, then its generic scope-plan traversal at 186–211 visits the
parameter header again. The new declaration-only exact-count regression does
not establish function-header separation.

Receipts: `extra-roles.lykn`, `extra-role-results.json`, `receipts/extra-roles/`.
This is an occurrence/traversal-contract finding, not a claim that compilation
executes the user's default twice. Parser function and clause-key Set reexport
identity controls both return true in the same probe.

### IC-R08 — malformed source function headers panic natively

Each standalone `(func)` and `(genfunc)` exits **101** through native checked
compile, stripped compile and check. stderr identifies binding.rs:538:21:
`range start index 1 out of range for slice of length 0`. The new
`walk_source_function` takes `&args[1..]` before the existing classifier can
produce its ordinary missing-name/body diagnostic. Public compilation still
reports a normal diagnostic. Preserve diagnostic handling instead of panicking.

Receipts: `receipts/replay-census/`, `census-results.json`,
`replay-summary.json`, `probes/{func-empty,genfunc-empty}.lykn`.

## Reproduced correction behavior and passing populations

Old concrete IC-R01–05 witnesses are replayed at the candidate: late body,
computed callee, kernel/class/declaration/nested-alias defaults, and a supported
macro-produced typed fn all receive reserved-binding diagnostics through the
applicable native/public gates. Both public body/post textual orders compile
and their actual modules print `true\n`. Native body-before-post also executes
`true\n` in checked/stripped modes and passes check; the explicitly retained
native post-before-body ordering limit rejects `eval` as expected. That limit
is not relabelled repaired.

Positive actual modules include a supported safe macro (`0\n`), a typed nested
alias whose external key is `package` (`local-value\n`), repeated body groups
honouring last-wins (`1\n`), and a class method's locally bound `bind` call
(`function\n`). The macro definition alone is not an expandExpr unit; that
driver's first-form expandExpr rejection is retained, not promoted to a failure.

Focused product checks:

| Independent check | Actual result |
| --- | --- |
| canonical-mapped reserved-word parity + output tests | 17/17 (3 parity + 14 role) |
| native binding units | 30/30; 1,154 filtered |
| permanent native compile/check/stripped macro oracle | 1/1; 181 filtered |
| changed/new canonical–embedded module comparisons | 7/7 equal |

`canonical.json` maps lang/ directly to current packages/lang; no stale target
mapping was used. Both existing DENO_DIR and owned npm/XDG/tmp were set from
the first focused launch. Rust/Cargo 1.97.0, Deno 2.9.6. Current bin/lykn and
target/release/lykn have identical SHA-256
`ff84481bb13c29da730bde2fb1cdc937d85713907d19f3ad2e65ca192a2a9935`.
These are the handed-off candidate binaries used for bounded native probes,
not a newly independently rebuilt/cold-copied release proof.

The DD49 extraction comparison matches the old algorithm after removal of the
known added blank line; no converter change is claimed. CC's missing historical
Clippy raw log remains explicitly transcript-only; no raw history was invented.
Intermediate 284ad97 gate attestations remain distinct from final b8 evidence.

After substantive failures, no fresh full make check/docs, committed-citation
gate, browser size gate, actual cold M6 twelve-file/25-case delivery or copied
fresh release CLI proof was started. Those final acceptance gates are unrun,
not passed by inheriting CC results. No IC-01 acceptance. Accepted A/B1 remain
unchanged; LC02–08/S03/B2 and documented D1/native-ordering carryovers stay open;
release0829 is unchanged. Source/build and CDC record/evidence ownership return
to root for correction. No next implementation authority follows.
