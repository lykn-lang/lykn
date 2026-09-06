# Verification evidence

## Independently reproduced

Separate context reproduce_migration ran the verifier with --local-hardware at
planning ac536cb908eb73f2db74014b5404beb3cbe2afd2, exit 0, zero errors:
631 original and move blobs/destinations; ancestry; complete planning path
coverage; source-tree equality and retained docs; six metadata blocks;
governance; no newly broken links; local hardware hashes. The original
unresolved/future link findings number 60 and remain explicitly reported in
independent-verification.json; they are not new migration exemptions.

The same context reproduced all three source citation gates, each exit 0:
62 source documents, unchanged frozen census (601 historical citations).
Both source branch comparisons exited 0 with no diff. The 0.6 guides and
ECMAScript reference corpus retain their original paths AND bytes.

The Discovery Register contains exactly the same 48 non-placeholder permanent
IDs as the original 0.6 record. Including the literal format-example ID gives
49 on both sides; no IDs added or removed.

Three git log --follow probes reach pre-migration commits:

- project01 DD-50.5 prompt: c57a6091a4597beeb70f59c006a10c18f9dc3307.
- project02 arc16 slice06 ledger: a61ca4ae42459290bdb6d07e8689071ec4819473.
- project05 hardware arc01 slice01 ledger: 696f12893c20d7aa4e72f549c83daee362826c29.

All sixteen extracted project02 arc-ledger sections were compared against
182aeabb78d395cd256dec82d60f440e698a268a. Each original section occurs verbatim
exactly once in the current sibling ledger, including headings and trailing
whitespace; zero mismatches. Hardware embedded ledgers retain authority via
dedicated entrypoints, preserving the current uncommitted bench work.

## Doer-run checks

- make test-docs on 0.6.x: 482 passed, zero failed. The other source trees are
  identical, so the runtime suite was not repeated there.
- Deno check of the three adjusted JS helpers: exit 0.
- Threading probe from the 0.7 source worktree through its relocated path:
  exit 0; compiler import resolves to the source worktree.
- Tree-shake walker and bundle helpers: two-file fixture smoke passed, default
  evidence paths resolve inside the planning slice, and unused fixture export
  is removed. Temporary evidence output was removed after the check.
- git diff --check: no introduced whitespace errors.

The separate reproduction checks mechanical claims. It is not an independent
review of the planner's approximate historical classification or an operator
decision that the reconstructed project boundaries are final.
