# S04 iteration 07 — correct the frozen prerequisite tests

Same Luna 6 High CC and Sol 6.1 High CDC, standard Autonomous Mode.
Normal source refinement 05/5. Keep exact test-only freeze
`3f3c036d6d7e27185964db432ac158af00675f1d`. Static review found two
test construction errors before any baseline or build.

- The restored original F3 is now tested on accepted I1 and keeps the
  exact `[7,9,[0,2],4]\n` success oracle in both native and public
  tables. Correct both restored entries, which currently carry the
  historical dangling-else output with 901. The old trace remains in
  prior raw evidence.
- In the new private resolver test helper, `SExpr::Atom` is a tuple with
  private payload. Test each node's actual public `expr.span()` for the
  default, then recur into List values and Cons children, with true for
  leaves. The actual `SExpr` PartialEq already ignores tags while
  comparing structure and spans. Use `assert_eq!(resolved, forms, ...)`
  for that invariant and remove the reconstruction helper.
  Keep all exact tag, projection and failed-parse assertions.

Only the same three test paths may change. Use the supplied fixed
`/private/tmp/lykn-d736-release-cdc.Gdv7dxje/c14-test-correction-message.txt`,
normal hooks and exact paths. Freeze and return exact delta for brief
static review. Then [iteration 06](cc-prompt-iteration06.md) resumes
unchanged, with original and literal fixture bytes, same real baseline,
production scope and full independent validation.
