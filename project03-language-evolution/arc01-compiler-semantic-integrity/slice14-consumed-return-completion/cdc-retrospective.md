# CDC retrospective — direct consumed return

Luna 6 High implemented S14 and Sol 6.1 High designed and independently
verified it. The [verification](cdc-verification.md) separates four
source refinements, the behavioral proof and launch setup attempts.

The original macro fixture conflated typed string preservation with
return targeting. Using unquote kept the same typed strings, exact
runtime and real macro region. The old generated wrapper still
distinguished the desired source path. The original native and public
macro failures remain separate backlog evidence.

The first source freeze named internal uses without materializing
their output. The next frozen candidate passed the original focused
cases. Further static review retained the previously required no-else
diagnostic and found a statement-array conversion that was promised
but absent in its first correction. The final exact checks exercised
both. For the next delivery, review producer and consumers of each
private result shape together before freezing code.

The first green CC Make lacked the intended cache setting. The next
used an empty evidence variable, which the runner treats as present.
A correctly unset launch then passed, and the independent run used its
own prospectively checked cache and environment. Future launch
manifests should distinguish unset, empty and explicit environment
values before execution. None of these attempts changed source.
