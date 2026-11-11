# Independent final evidence preservation

The assigned independent reviewer copied this packet directly from
`/private/tmp/lykn-at02-cdc-final.XeqVk0cQ` after replay and structured-value
verification. Source, helper attempts, every specimen command launch/environment,
exits, raw stdout/stderr, helper compile/run diagnostics, hashes and generated
bytes are retained unchanged. The copied CLI, exported packages/lang tree and
scratch caches are excluded. They are reconstructible from the recorded pins.

Generated paths are stored with this explicit mapping:

| Executed scratch path | Durable packet path |
| --- | --- |
| `case/target/*` | `case/output/*` |
| `public/target/*` | `public/output/*` |

Original launch JSON, hashes and reports keep the actual scratch paths and
`target/` names. No stream, generated output or historical report was edited to
replace them. Recreate those execution paths in owned scratch when replaying;
`case/replay.lykn` records the precise command construction. It is authored in
Lykn. `case/audit.lykn` is the structured-value oracle. Its first failed helper
source, first diagnostics and corrected successful versions are preserved.
One earlier filesystem path mistake and resulting missing-helper compile are
also preserved in the metadata receipts.

Three checksum/itemized dry runs verified this copy: root files with the stated
exclusions, native target-to-output, and public target-to-output. Their status
files under `metadata/preservation-*` each contain 0. Native/public streams
are empty. The root dry run reports only `.d..t.... metadata/`, because writing
the preservation receipts changes that destination directory's timestamp;
it reports no file-content difference. Exact direct invocations were:

```sh
rsync -acni --exclude=lykn --exclude=packages --exclude=target --exclude=tmp --exclude=xdg --exclude=npm /private/tmp/lykn-at02-cdc-final.XeqVk0cQ/ artifacts/at02/independent-final/
rsync -acni /private/tmp/lykn-at02-cdc-final.XeqVk0cQ/case/target/ artifacts/at02/independent-final/case/output/
rsync -acni /private/tmp/lykn-at02-cdc-final.XeqVk0cQ/public/target/ artifacts/at02/independent-final/public/output/
```

The retained `metadata/review-report.md` is the reviewer's earlier checkpoint:
it predates the candidate's canonical documentation correction and mistakenly
includes human review among JV05's remaining duties. The canonical slice-root
`cdc-verification.md` reconciles the final committed packet and supersedes those
pending-checkpoint statements. The actual JV05 technical preservation criterion
is accepted; the human source-shape judgment remains separately pending at
Arc02 AE05. No historical report was rewritten to erase that distinction.

The unfiltered raw-whitespace result is recorded by the canonical verification
record. Compiler stdout and its identical generated-JS copies retain generator
final blank lines, and launch JSON retains its actual no-final-newline bytes.
These are payload observations, not permission to reformat the evidence.
The raw check exits 2 with 12 final-blank-line notices; the authored Markdown
check exits 0. Exact output is under `metadata/*whitespace*`.

The later canonical link check is retained as `case/links.lykn`, its emitted
`case/output/links.js`, and `metadata/links*`. It confirms 29 local targets in
the current verification, ledger and root closing report exist and are tracked
in the Git index. This read-only metadata check is separate from the earlier
49 specimen commands and does not change their denominator.
