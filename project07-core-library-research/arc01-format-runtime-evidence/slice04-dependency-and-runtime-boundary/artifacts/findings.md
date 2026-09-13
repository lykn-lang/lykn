# Slice04 preparation finding

**D-2609-DARG — pinned Lykn run cannot select its script on Deno 2.9.6.**
The immutable d0bb981 CLI inserts a pre-script `--`. On the operator-upgraded
runtime, two minimal no-import launches exit 1 and request a script/task; two
explicit `--allow-all` controls do the same. Correct emitted source never prints
its marker. Actual NUL-delimited argv and pinned upstream parser source identify
the separator/script positional interaction. The tested facts are local CC
observations; upstream cause attribution is source-backed analysis, not an
independently tested upstream patch.

Owner and real routing destination:
[Arc03/Slice06](../../../arc03-findings-and-integration/slice06-deno-launch-compatibility/slice-plan.md).
Re-entry: independently verified launch correction, preserved permission and
argument safety, traceable new compiler pin and fresh Slice04 preparation.
Do not silently remove path safety, install an old Deno, patch the immutable
research source, use a PATH rewrite shim, or replace the runtime matrix with
direct Deno execution. The operator-suggested eval route is an explicit exception
for native Lykn-authored evidence tooling, retaining its implicit-all permissions.

The existing D-2609-PERM repair remains historically CDC verified under its
original condition. This is new compatibility work, not a claim that its
permission repair was never effective. Test-runner implicit grants, NPMB/LINT,
JSCF/UNUS/NZRO, JSER and document-candidate YNOD retain their original owners.

No R-02–09 runtime conclusion, library adoption, document-route selection,
power-loss guarantee, complexity bound, guide/book repair, recursive ADT contract
or operator aesthetic acceptance follows from this interrupted preparation.
