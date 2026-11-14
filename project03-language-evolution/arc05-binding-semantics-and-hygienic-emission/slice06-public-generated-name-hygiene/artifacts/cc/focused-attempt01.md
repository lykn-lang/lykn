# Focused attempt 01

2026-11-14. `make fresh-artifacts` completed first with exit 0. The assigned
focused command then exited 1: `FAILED | 28 passed | 7 failed`.

All six pre-existing focused suites other than the DD-37 one-test pilot passed:
ICU 6/6, lazy invocation 4/4, discard bindings 8/8, host-reference lowering
7/7, browser host-reference 1/1; existing DD-37 failed 1/1. The new S06 file
reported one pass (physical-key allocator) and six failures. No skipped tests.

Observed causes and original fixture forms:

- Product bug: direct `emitSurfaceForm` evaluated `h.gensym ?? gensym` while a
  same-scope `const gensym` was still in its TDZ. This also broke the existing
  DD-37 Not pilot, whose helper intentionally omits `gensym`. The local producer
  alias is now `nextName`; a focused rerun is required.
- Public object fixtures incorrectly used kernel `(object :key value)` syntax
  in Source, e.g. `(bind record (object :keep 7 :drop 99))` and
  `(bind _v0 (object :child 5))`. They failed with the compiler's genuine
  `object: each element must be an atom (shorthand) or a list (key value)` error.
  Source fixtures now use `(obj ...)`; raw kernel `(object (base 10))` stays as
  the admitted raw invocation fixture.
- Yield assertions used `iterator:next:value`, which reads a property of the
  method rather than advancing it. The runtime fixture now invokes
  `(iterator:next)` and reads its `value`; it still checks lazy yields 99 then 7.
- `:args` default object fixture remains a nested destructured/default input;
  only its default initializer changed from invalid kernel object syntax to
  actual Source `(obj :value 7)`.

Full original stdout/stderr were returned by the focused command in the session;
the above records its complete summary and each failure cause. The first failed
source/test state remains in the initial command observation and is not called
green or acceptance evidence.

## Append-only count correction

The summary above mistakenly says the new file had one pass/six failures; its
actual output was **two passed and six failed**. The other focused suites
contributed 26 passed and one failed, so the real aggregate is 28 passed/7
failed, exactly as the opening paragraph and tool output report. The mistaken
sub-count is retained here as history rather than silently edited.

The attempt01 raw stdout/stderr were not redirected to files; only the
tool-returned output and this summary remain. I do not claim durable exact
streams or a full source snapshot for the then-untracked new test file. The
attempt02 raw stdout, stderr and exit are durably saved separately.
