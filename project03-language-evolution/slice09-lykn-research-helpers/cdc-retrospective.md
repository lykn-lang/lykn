# CDC retrospective — Slice09, 2026-11-06

The delivered capability is concrete: reusable Lykn export/hash validation and
sequential command/copy/compare tooling, exact recorded positive parity, twelve
independently passing controls, five retired Python body files and explicit
seven-home policy. The consumed oracle ran once; independent Lykn replay used
its saved output and the immutable earlier baseline. History was preserved
through Git locators and diagnostic/outcome records rather than current-tree
copies of the removed programs. No compiler or production-library change was
needed to deliver this slice.

The most serious process failure was tool provenance. Intake verified the
correct binary hash, but subsequent CLI calls used a different global binary.
That generated a false current-compiler blocker, which root and I initially
treated as plausible. I should have checked actual executable argv before
accepting the inference. The pinned recompile disproved it immediately, and
the user-facing claim was retracted. Iteration01 bound every actual invocation
and R0 action to the absolute accepted tool and correct cwd. Hashing a tool in
one place does not establish that another command used it. The accidental
publishing-fixture config supplied a second context confound.

Source authoring and observer defects also mattered: delimiter/function-body
errors, a missing digest helper, an invented V5 error message, and an unstaged
fixture outside the read grant. Syntax/lint/compile success did not establish
observer correctness. Point-of-use tests caught the missing function and wrong
assertion; the V5 correction preserved meaningful error-class/path checks.
V1 required a subtler oracle: property reordering preserves map semantics while
changing the public manifest's byte hash. Review caught the mistaken full-output
equality requirement before execution. R1's invalid UTF-8 and fail-stop receipts
eventually supplied the needed real evidence, beyond a standalone child.

The first evolving failed source body was overwritten before preservation;
only its hash/diagnostic survived. This is an evidence loss, not something
later success repairs. Unique pre-operation source snapshots were adopted for
later attempts. A child also ran before source freeze; it remains an additional
actual attempt, not retroactive R1 coverage. The intended early R1 observer
check was not implemented as the first real fixed case; the driver ran V cases
first. Future author readiness should place the chosen early case in the actual
driver order and execute the whole receipt path. This is a local recommendation,
not an unmeasured claim that a new framework rule improves outcomes.

Inventory needed entrypoints and inline text, not only .py filenames. A retained
Slice07 here-doc was found after the initial Slice08 inventory. Its recorded
positive prefix matched the new validator, and it was removed with the other
verified bodies. Unrelated historical scripts were deliberately left alone.
The new no-Python rule is explicit in all seven AGENTS files and every new
prompt; the sole authorized original-oracle exception ended after parity.
No new Python program or substitute scripting implementation was authored here.

Method follow-through had mixed results. Prior advice to retain failed attempts
helped later reconstruction, but the first-body loss and stale generated-hash
receipt show that compliance was incomplete. The reused compile5 hash was caught
before launch and corrected without repeating unaffected gates. Native direct
copying was sufficient for evidence lifecycle; all substantive helper logic
stayed in Lykn. Independent full replay established current behavior, while
README-only cleanup preserved those source/product identities and avoided
unnecessary retesting. The misplaced CC close report was mechanically moved to
the canonical root with its original commit/path retained.

The actual typed-final-return output and unused-binding warnings are distinct
source-backed follow-ups in NE-C05/06; invalid quoted-key dissoc was a source
contract error. They were not silently fixed or confused with the stale-tool
blocker. No comparative model-effectiveness, token/time improvement or overhead
proportion was measured. These observations support concrete prompt/receipt
practices, not a model verdict or an automatic host-framework policy change.

All seven slice rows are independently disposed. Original F1–F12, remaining
compiler/cache/guide candidates and Project07 synthesis/library/licence/
bootstrap/ADT/book/human gates retain their owners. The authorized endpoint is
complete; no next implementation, merge, push, publication or release follows.
