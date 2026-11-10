# Direct bind completion ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DB-01 | A normally completing bind initializes its original const once | F1/F2 exact native/public control and sibling runtime, complete modules | correctness-grade | S04 I2 / S14 | open | artifacts/fixtures.md | Early return skips initialization and continuation |
| DB-02 | Loop and typed native exits preserve their targets and checks | Shared F3 and native F5 exact phases/runtime/code | correctness-grade | S04 I2 / CV-04 | open | artifacts/fixtures.md | Protected return behavior remains separate |
| DB-03 | Compiler temporaries are hygienic across actual expanded names | Shared F4 with normalized later binder and macro reference, private identity/readback | correctness-grade | S04 I2 / DD49 | open | cc-prompt.md | Resolve private markers before public output |
| DB-04 | Existing routes and actual source are independently accepted | Pinned focused/normal Make/cites, full modules/mirrors, separate CDC replay | correctness-grade | AGENTS / Arc01 | open | cc-prompt.md | Held headers and lazy values remain open |
