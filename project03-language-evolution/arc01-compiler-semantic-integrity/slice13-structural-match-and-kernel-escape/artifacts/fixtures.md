# S13 frozen source and expected observations

In `test/fixtures/semantic-roles/`, restore the exact original source
from test-only `bd081320` under new filenames. Keep all existing S12
fixtures. Use direct Git blob extraction and verify actual SHA-256.

| Case | Original Git path and new filename | SHA-256 | Final stdout |
| --- | --- | --- | --- |
| F1 | `test/fixtures/semantic-roles/match-clause-scope.lykn` → `original-match-reserved-role.lykn` | `5625a991b9657181e2649b85a57fce8460f0f66a884cc024ce6a62f9f40e1ee7` | `[11,22,14]\n` |
| F2 | `test/fixtures/semantic-roles/match-structural-pattern-macros.lykn` → `original-match-kernel-object.lykn` | `6f8364abfb771dc8eb5cad1a3005a20de786e1e6a1c2ef3befca59c82788b61d` | `[7]\n` |

Old at `b5c22b63`, F1 public rejects the false `do` pattern binder,
native should now pass after S12. F2 native emits `kernel.object`
and fails its strict runtime, public should pass unchanged.
Record actual phases and exact complete output.

## F3 — bound-match-conditional-operand.lykn

```lykn
(func choose :args (:any match) :returns :any :body (match 0 (if false 7 8)))
(bind match (fn (:any target :any value) value))
(console:log (JSON:stringify (array (match 0 (if true 7 8)) (choose match))))
```

Exact final `[7,8]\n`. One call uses the following-sibling
declaration and one uses the earlier function's parameter scope.
Both consume a real if expression rather than declaring a pattern
named if. Old public preflight is predicted to reject. Old native
should already pass.

## F4 — nested-kernel-object-roles.lykn

```lykn
(bind payload (kernel:object
  (key 5)
  (if (kernel:if true 7 8))
  ((computed (if true "dynamic" "other")) (if false 0 9))
  (spread (obj :extra 6))))
(bind assigned (kernel:= (get payload "key") (if false 10 11)))
(console:log (JSON:stringify
  (array assigned (get payload "key") (get payload "if")
         (get payload "dynamic") (get payload "extra"))))
```

Exact final `[11,11,7,9,6]\n`. The normal key, overlapping atom key,
computed key, value and spread retain their actual roles. Assignment
returns 11 and changes key to 11. Old native is predicted to reject
the overlapping key as a consumed no-else if. Public should pass.
If the actual old result differs, retain it and reconcile before
source. Both final routes require child exit 0 and empty stderr,
with actual absent native DTS. Files F3/F4 are exact UTF-8 with LF.

## Exact negative controls

Use existing D2 wording and these four public sources. Error text
for the actual first reserved site is

```text
'if' is a JavaScript reserved word and cannot be used as a lykn <kind>; rename it (e.g. `if_`)
```

| Source | Expected kind |
| --- | --- |
| `(match 0 (if 1) (_ 0))` | pattern binding |
| `(match 0 (_ :when (do (bind if 0) true) 1))` | binding name |
| `(match 0 (_ (bind if 0) 1))` | binding name |
| `(match (do (bind for 0) 0) (if 1) (_ 0))` | pattern binding first |

Unknown nested escape in both actual compile paths:
`(bind result (kernel:objec (key 7)))` with trailing LF. The existing
diagnostic message is
`unknown kernel form 'objec' in (kernel:objec ...); did you mean 'object'?`.
Use native parsed span 1:14, Error, suggestion `kernel:object`
in the checked library control. The native real strict compile
must exit 1 with this diagnostic and emit neither JS nor DTS. Public
compile throws the same message. Native check remains its existing
pre-emission gate and is not used to assert nested diagnostic parity.
Old native compile is predicted to emit a raw call and exit 0.
Never execute its old generated module.
