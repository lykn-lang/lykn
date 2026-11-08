# Pre-launch metadata — final executable path observation

- Source HEAD/tree: `ca982a598e4e4e0a5adf4943e737a517db50cea3` / `764d831708f6a793e9ffc92059d25815e1fff6bd`.
- CWD: `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`.
- Argv: `ls -l target/debug/lykn target/release/lykn target/debug/deps/lykn_lang-660f810f98f77866 target/debug/deps/semantic_roles-cb18f482652d85e9 target/debug/deps/match_clause_validation-7d8f7aa58e91c201 target/debug/deps/variadic_for_bodies-dc06f81c033262f2 target/debug/deps/async_expression_values-ca9664e9a5eacb46 target/debug/deps/async_exports-c55362a2e44ad97d target/debug/deps/contract_predicate_lowering-5224edfea80a9408 target/debug/deps/emission_failures-ee1302ddd95a417d target/debug/deps/compile_validation_parity-ed5da4aecd278839 target/debug/deps/template_string_boundary-7a0f5808c52261b8`.
- Purpose: inspect exact producer/test executable paths emitted by the completed no-run/fresh-artifacts steps before hashing/pinning them.
