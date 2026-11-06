# Accepted-tool final-return candidate — 2026-11-06

This is a retained observation for NE-C05, not a new probe or compiler repair.
CC compiled the actual evolving full helper source with the absolute accepted
task compiler SHA544041ecf2ff61a9b1b3338ed08728a12db549a69dbcadfa644a30d39bfb908a
(code baseline a061c214, current task branch bc83b43). Compile exited0. CDC
inspected the exact source/generated pair; no reduced program/runtime was run.

- Full source snapshot: task `target/slice09/empty/attempts/iteration01/check-helpers-compile1.lykn`,
  SHA330ff2c4ac7d70d740e2a7671cedb3102a746c0ea5f72706c1ac00173d33a923.
- Full generated snapshot: sibling `check-helpers-accepted-compile1.js`,
  SHA04567627f36b6e77c4723d8b43874a4013b046fa52e2419c72e5201826a0b67e.
- Source function `same-lines-except-one` has `:returns :boolean`, a final
  explicit return of its boolean `and` predicate, and is properly closed before
  the next async function. It is not the earlier unclosed-function candidate.
- The corresponding emitted initializer is syntactically invalid JavaScript:

```js
const result__gensym1 = return (((beforeLines.length === afterLines.length && differences.value === 1) && changedCount.value === 1) && changedLine.value.endsWith(changedSuffix)) && changedLine.value === expectedLine;
```

The delivered helper uses the ordinary implicit final-value form, preserves
the required behavior and independently passes all controls. That is not proof
that every explicit-return form works. Project03 CDC owns the focused source/
semantic regression disposition before repair; this slice performs no compiler
change and does not generalize from the earlier wrong-global-compiler output.
