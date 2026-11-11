# JSON ADT boundary preflight

Source 685bbe1dbbfdaf34ecf49017c22e43f7dc8adb95. Ordinary Deno 2.9.6.
One exploratory L-01/L-03 control, with nine observations. AE01 AT-02 retains its full assignment.

- All six constructors can represent a value shape in the same program.
- A field with an exact dynamic string key and a tagged value is representable.
- A wrong scalar and a wrong outer collection exercise constructor checks.
- A mixed nested array tests whether the outer array check validates its contents.
- A foreign variant tests whether a user-type annotation requires declared membership.
- A forged known tag and wrong scalar test whether matching revalidates fields.
- An object with no tag is the negative annotation control.
- A known but omitted variant exercises the no-match fallback.
- The stripped build may alter runtime constructor/annotation checks. Inspect emitted code and record actual outcomes without attributing stripped behavior to default builds.
