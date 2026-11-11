# Independent IC-01 review — HOLD

Candidate `5bdbfe3c27c58bdcbf93471d1c469c53ef2eaabe`, tree
`e0a95d7452f3a33529fb7bd7a75ab46289d7349e`, remains clean on
`codex/qualified-adt-core` in the named task worktree. Source/index were not
changed. Root owns correction decisions and planning Git/index.

[Raw archive](receipts-5bdbfe3c.tar.gz), SHA-256
`f8a6a9fc81cf5ac0a72d79853c9816a6eb40ca5e2a70e395c6e84ae513eeceeb`.
Working originals: `/private/tmp/lykn-s03-ic01-cdc-5bdbfe3c`.
The final archive includes the separately requested ordering/baseline comparison;
an earlier draft archive digest predates that addition. No raw experiment was
removed. Owned npm/XDG/tmp caches are excluded.

## Confirmed findings and reproducible inputs

All source inputs and actual generated modules are under `probes/`. Commands
and raw streams/statuses are in `receipts/`; `run.lykn` records selected
environment, argv, cwd and actual source pin. `census.lykn` invokes the real
CLI, public compiler and expandExpr, preserving each output. No handwritten JS
research helper was authored.

| Finding | Source / result |
| --- | --- |
| IC-R01 — function body groups | `function-tail.lykn`: native checked/stripped compile and check return zero; generated modules contain `const package = 2` and strict parsing fails. Both direct binding validators omit the tail; public final compile/expandExpr recover and reject it. |
| IC-R02 — computed callee | `computed-callee.lykn`: native checked/stripped compile and check return zero; actual emitted modules fail strict parsing at `const package = 1`. Public routes reject correctly. |
| IC-R03 — executable defaults | `kernel-default.lykn` and `declaration-default.lykn` escape native checked/stripped compile/check. `class-default.lykn` also escapes public validation, lykn and expandExpr. Every emitted module for these primary cases fails at a real `const package` declaration. |
| IC-R04 — new public post-scope rejection | Both `post-before-body.lykn` and `body-before-post.lykn` run successfully through immutable B1 public compilation, printing true. Candidate public compilation rejects both at eval. Native candidate accepts/runs only body-before-post; baseline native post-before-body already emitted invalid predicate syntax, a distinct older limit. |
| IC-R05 — macro test oracle gap | Product fixtures emit unsupported anonymous plain-function shape `(function (package) value)`. The supported `macro-fn.lykn` passes its typed parameter AST as an argument, emits a real fn and is correctly rejected with a package parameter diagnostic on candidate native/public routes. Supplement the product oracle with supported grammar. |

Primary function-tail reproduction:

```lisp
(func example :args () :body 1 (bind package 2) 3)
```

Primary public/native member-default reproduction:

```lisp
(class Example ()
  (method ((default value (do (bind package 1) 2)))
    (return value)))
```

The first five prohibited-region inputs were each compiled in native checked
and stripped modes and checked via the real CLI; all incorrectly succeeded.
Their actual emitted modules failed strict parsing. These observations are
distinct from the public paths that correctly rejected some of them.

`alias-default.lykn` is an additional direct-validator miss: neither direct
validator visits a nested alias-local default. Candidate public final lowering
does reject it. The native emitted artifact retains unlowered do/bind syntax,
so its parse failure is confounded by an older default-lowering limitation;
it is not promoted to an independent reserved-declaration runtime oracle.

`class-body-call.lykn` is a positive control: native checked/stripped and public
generated modules actually call the method and print `function\n`, with empty
stderr. The first census only parsed this class; the second adds the actual
method invocation. Both raw census transcripts remain. The first macro probe
embedded a typed keyword directly in a quasiquote and failed at parameter
shape; `macro-fn-first.lykn` retains it. The final supported macro probe passes
the existing parameter AST through unquote and gives the intended diagnostic.

## Ordering comparison

`receipts/ordering` and `census-results.json` describe candidate observations.
`receipts/ordering-baseline`, `ordering-baseline-results.json`, immutable
`baseline/packages/lang/`, and generated `*-baseline-*.mjs` retain the requested
comparison. Baseline source was git-archived from accepted B1 `3f197340`.
Native baseline uses the actually retained B1 copied release CLI, SHA-256
`091c78283a3fda26ef106dda04bff109adc32a50138d11c175ff460d82f1e87c`;
no baseline build or source checkout mutation occurred.

| Route | Post before body | Body before post |
| --- | --- | --- |
| B1 public | Compiles/runs true, empty stderr | Compiles/runs true, empty stderr |
| Candidate public | Rejects eval as binder | Rejects eval as binder |
| B1 native | Compile/check zero; runtime parse fails at `if (!const eval = 1;` | Compile/check zero; runtime true |
| Candidate native | Checked/stripped compile/check reject eval | Checked/stripped compile/check zero; both runtimes true |

The older native order-sensitive resolution/lowering defect is preserved as
such. It is not relabelled a newly introduced IC-01 regression or implicitly
assigned for repair by this reviewer.

## Checks, pins and limits

- Canonical source mapping in `canonical.json` avoids stale staged build output.
- Existing focused public/parity tests pass 14/14; binding units 29/29 (1,154
  filtered); narrow kernel resolver controls 2/2 (1,181 filtered).
- DD-49 converter/tables compare identically to B1 after removing blank lines;
  byte comparison differs by one added blank line. Public import/reexport and
  all five canonical/embedded changed module byte comparisons were inspected.
- Guide diff changes only the three authorized public → public-user tokens;
  expected output is unchanged. No independent docs gate was run separately.
- Candidate release and bin/lykn both SHA-256
  `83b9b783d9e541c5dbcff90ac65b1ae2216f97122a381bb3ee24d7c7f358f60a`.
  Rust/Cargo 1.97.0, Deno 2.9.6. Both explicit existing DENO_DIR and owned
  npm/XDG/tmp were used throughout focused execution.
- One inventory helper compile initially used method syntax on a parenthesized
  array expression and was correctly rejected. Its source/log and the corrected
  passing helper remain. Existing unused-binding warnings remain in raw logs.

No fresh full make check, committed citations, size gate, actual M6/cold delivery
or broad host-suite rerun was started after the substantive failure. CC's
reported full/M6/size/citation results retain their attested strength and old
logs; they are not independent acceptance. Prior missing raw launch logs were
not reconstructed. A/B1 acceptance, source Func/class aggregate B2 carryovers,
I4, warm-cache and browser run/load limits remain unchanged. IC-01 is held;
LC-02–08/S03 stay open and release remains 0829e892.
