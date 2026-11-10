# CDC retrospective — structural match and nested escapes

Luna 6 High implemented the source and Sol 6.1 High owned design,
static review and independent replay. S13 closes its five criteria
at `31893710`. The [verification](cdc-verification.md) retains
the actual first attempts and later proof.

Using the exact failed S12 witnesses exposed both frontend routes
before the fixes. Two test refinements made assertions independent
and isolated the repeated public `obj` macro without editing the
fixture. The old run and replay show the harness failure separately
from the false-binder diagnostics.

The first native source freeze still contained an Option pattern
against a direct SExpr reference. Static review missed it and the
first grouped build caught it. The one-line third refinement
preserved the original gates and oracles. For comparable work,
run the frozen grouped build as soon as the bounded source review
releases it, before spending time on other dependent checks.

The CC's read-only Python use violated the Lykn/native evidence
rule. It is retained as process evidence and excluded from product
acceptance. The first current native run also omitted explicit
Deno and evidence-directory settings. A fresh pinned run and
separate independent replay retained full module files. The first
run still has its own valid observed status. Future gate manifests
should show the exact tool and artifact directory before launch.
