# Native match clause scope accepted

All four MC rows are accepted at task `b5c22b63) after actual CC
proposed-done and independent CDC review. Native match subject
resolution uses incoming scope, structural patterns keep their
own bindings, and only that clause's guard and ordered body see
them. A bound or tagged match still dispatches as a call.

Native 17 tests, three resolver controls, public 16 steps, full
Make and cited paths all pass independently. The exact original
failures, four emitted-module comparisons, unchanged compile
warnings and prospective probe limits are in
[independent verification](cdc-verification.md). The
[retrospective](cdc-retrospective.md) records the two refinements
and source-authoring lessons.

The previous tranche is independently validated on local release
`7b17a784`. This follow-up is accepted on the task branch.
The [backlog](../../BACKLOG.md) retains the observed public
reserved-name false binder and native consumed kernel-object
escape failures. Wider consumed lowering, I3/I4 and CV-04/CI-04
composition remain open. K stays 0/13.
