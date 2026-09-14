# FF01 results

Both primary and fresh conditions completed **37/37 process audits**, five
negative audit families and the physical/source/config/lock crosswalk. No
runtime attempt failed unexpectedly, was unavailable or remained unrun. These
are CC measurements and replay, not independent CDC closure.

| Group | Attempts per condition | Observed disposition |
| --- | --- | --- |
| External wall/output/RSS/parent-exit/observation controls | 5 | Correct intended stops; bounded drain and no owned survivors |
| New/existing/symlink/mode replacement | 8 | Complete regular destination, 0600 mode; symlink target retained; original 0640 mode case distinguished |
| Actual cross-filesystem rename | 2 | Error: Cross-device link (os error 18), rename stage; original destination and complete temp retained |
| Injected open/write/flush/rename faults | 8 | Exact declared injection/stage; original retained; no orphan / empty orphan / complete orphan / complete orphan respectively |
| Actual rename over directory | 2 | IsADirectory (os error 21); original directory/sentinel and complete temp retained |
| Source-read-denied controls | 2 | Actual NotCapable at rename, naming exact source temp read access; original and complete temp retained |
| Reader / two writers / partial observer | 6 | Readiness and in-window old/new observations; deliberate 32768-byte partial detection; complete final candidate |
| Before/after cancellation | 4 | Independently checked 65537-byte checkpoint before kill; before preserves original plus orphan, after preserves complete new destination |
| Total | 37 | All semantic audits passed |

The reviewed decomposition is 12 fault trials + 23 control/regression attempts
+ two denial controls = 37. Across primary and fresh: 74 process attempts and
10 negative audit copies; these are separate populations. The 21 manifest IDs
preserve original R/HP/SH identity, with `FF-source-read-denied` explicitly added.

Actual cross-device error text in the first primary trial:

```text
Cross-device link (os error 18): rename '/Volumes/Games01/lykn-p07-ff.J4VEAG/primary/R-07-cross-filesystem-1.tmp' -> 'outputs/destination.txt'
```

Both primary and fresh repeats satisfied the frozen OS-error branch. Success
was an alternative declared before trials but was not observed on these devices.
Distinct device IDs alone were not accepted as proof; actual error/stage, bytes,
metadata and permissions were checked. The source-read-denied controls instead
reported NotCapable and were audited against their separate denial predicate.
No denial was counted as an OS fault.

Candidate A is 65,536 `A` characters plus LF (65,537 bytes), SHA-256
`6d3c6afe6375fa8f5160e91f0e7e1886bcfd823d462fa99d2e7dba8923efbe38`.
Exact original, candidate, partial, sentinel, empty/absent and orphan evidence
is in every record and its actual retained fixture files. Cross-source files
were copied before removal; timestamped cleanup receipts verify absence after
live audit. The eight new temps were removed; the original Slice04 orphan was
not touched. No mount, installation, package evaluation or source edit occurred.

| Verification | Primary | Fresh | Fresh packet extraction |
| --- | --- | --- | --- |
| Complete semantic report | 37 attempts; 1,630 checks | 37 attempts; 1,630 checks | Rechecked by crosswalk |
| Five negative families | 114 checks | 114 checks | 114 each; results reproduce byte-for-byte |
| Physical/source/config/lock crosswalk | 2,319 checks; 146 fixtures; 4 source copies | Same counts | 2,319 each; both pass |
| Packet integrity | 1,307 files / 3,921 checks at packing | Same sealed population | 1,307 files / 3,921 checks |

Negative families: missing observation, checkpoint bytes, denial class, survivor,
lock mismatch. Each uses an eligible passing FF record, changes only a labeled
copy and fails for its intended reason. Positive markers require the correct
subset count and manifest hash; no inherited full-DB marker was fabricated.

Limits: this is one host, compiler/runtime pair and device pair with two repeats
per research variant per condition. Sampling does not prove peak RSS or universal
race freedom; observed complete replacement is not crash durability. The
cross-device success branch remains unobserved. Extracted bytes and original
live metadata are distinct evidence. Three pre-runtime authoring failures remain
in the packet, all within the five-failure ceiling. No FF, DB, arc/project,
dependency-policy or operator-acceptance row is independently closed here.
