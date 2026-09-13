# Frozen YAML value matrix — YV-M01

Original YP-M01 rows are retained verbatim in each original field. All 349 YAML IDs and owners survive; 259 run here twice, with 5 harness controls twice and 3 supervisor controls separately. Expected questions are not replaced by observations.

Operational additions: complete exact spec dispatch; file-first read and real replacement for Y-01/Y-09; no-op and edited serialization/reparse for all accepted values; declared alias/n/key edits only; ordered warnings; constructor bytes and original key domains in inputs.json. Y-15 constructors use Date at UTC midnight, Map string 1 then numeric 1, Set numeric 1 then string 1, top-level undefined, function returning 1, own self-cycle. Y-12 own undefined is enumerable beside an absent control. No Y-13/Y-14/Y-16 execution.

| ID | Phase | Full owner | Original operation | Original question |
| --- | --- | --- | --- | --- |
| Y-01-edit | matrix | slice05-yaml-value-behavior | edit-file | Only n becomes2; input unchanged; output rereads expected tree |
| Y-02-yes-plain-failsafe | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-yes-plain-json | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-yes-plain-core | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-yes-plain-default | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-yes-plain-extended | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-yes-quoted-failsafe | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-yes-quoted-json | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-yes-quoted-core | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-yes-quoted-default | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-yes-quoted-extended | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-on-plain-failsafe | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-on-plain-json | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-on-plain-core | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-on-plain-default | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-on-plain-extended | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-on-quoted-failsafe | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-on-quoted-json | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-on-quoted-core | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-on-quoted-default | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-on-quoted-extended | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-true-plain-failsafe | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-true-plain-json | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-true-plain-core | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-true-plain-default | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-true-plain-extended | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-true-quoted-failsafe | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-true-quoted-json | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-true-quoted-core | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-true-quoted-default | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-true-quoted-extended | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-null-plain-failsafe | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-null-plain-json | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-null-plain-core | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-null-plain-default | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-null-plain-extended | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-null-quoted-failsafe | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-null-quoted-json | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-null-quoted-core | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-null-quoted-default | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-null-quoted-extended | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-tilde-plain-failsafe | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-tilde-plain-json | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-tilde-plain-core | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-tilde-plain-default | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-tilde-plain-extended | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-tilde-quoted-failsafe | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-tilde-quoted-json | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-tilde-quoted-core | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-tilde-quoted-default | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-tilde-quoted-extended | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-empty-plain-failsafe | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-empty-plain-json | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-empty-plain-core | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-empty-plain-default | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-empty-plain-extended | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-empty-quoted-failsafe | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-empty-quoted-json | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-empty-quoted-core | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-empty-quoted-default | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-empty-quoted-extended | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-012-plain-failsafe | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-012-plain-json | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-012-plain-core | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-012-plain-default | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-012-plain-extended | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-012-quoted-failsafe | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-012-quoted-json | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-012-quoted-core | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-012-quoted-default | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-012-quoted-extended | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-0o12-plain-failsafe | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-0o12-plain-json | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-0o12-plain-core | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-0o12-plain-default | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-0o12-plain-extended | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-0o12-quoted-failsafe | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-0o12-quoted-json | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-0o12-quoted-core | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-0o12-quoted-default | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-0o12-quoted-extended | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-.nan-plain-failsafe | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-.nan-plain-json | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-.nan-plain-core | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-.nan-plain-default | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-.nan-plain-extended | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-.nan-quoted-failsafe | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-.nan-quoted-json | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-.nan-quoted-core | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-.nan-quoted-default | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-.nan-quoted-extended | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-.inf-plain-failsafe | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-.inf-plain-json | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-.inf-plain-core | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-.inf-plain-default | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-.inf-plain-extended | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-.inf-quoted-failsafe | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-.inf-quoted-json | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-.inf-quoted-core | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-.inf-quoted-default | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-.inf-quoted-extended | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-2026-09-12-plain-failsafe | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-2026-09-12-plain-json | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-2026-09-12-plain-core | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-2026-09-12-plain-default | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-2026-09-12-plain-extended | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-2026-09-12-quoted-failsafe | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-2026-09-12-quoted-json | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-2026-09-12-quoted-core | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-2026-09-12-quoted-default | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-02-2026-09-12-quoted-extended | matrix | slice05-yaml-value-behavior | parse | Record exact original lexeme beside represented kind/value; schema-dependent outcome unknown; quoted values are strings |
| Y-03-tag0-failsafe | matrix | slice05-yaml-value-behavior | parse | Characterize tag support/rejection and represented kind; binary unstable; custom type construction not installed |
| Y-03-tag0-json | matrix | slice05-yaml-value-behavior | parse | Characterize tag support/rejection and represented kind; binary unstable; custom type construction not installed |
| Y-03-tag0-core | matrix | slice05-yaml-value-behavior | parse | Characterize tag support/rejection and represented kind; binary unstable; custom type construction not installed |
| Y-03-tag0-default | matrix | slice05-yaml-value-behavior | parse | Characterize tag support/rejection and represented kind; binary unstable; custom type construction not installed |
| Y-03-tag0-extended | matrix | slice05-yaml-value-behavior | parse | Characterize tag support/rejection and represented kind; binary unstable; custom type construction not installed |
| Y-03-tag1-failsafe | matrix | slice05-yaml-value-behavior | parse | Characterize tag support/rejection and represented kind; binary unstable; custom type construction not installed |
| Y-03-tag1-json | matrix | slice05-yaml-value-behavior | parse | Characterize tag support/rejection and represented kind; binary unstable; custom type construction not installed |
| Y-03-tag1-core | matrix | slice05-yaml-value-behavior | parse | Characterize tag support/rejection and represented kind; binary unstable; custom type construction not installed |
| Y-03-tag1-default | matrix | slice05-yaml-value-behavior | parse | Characterize tag support/rejection and represented kind; binary unstable; custom type construction not installed |
| Y-03-tag1-extended | matrix | slice05-yaml-value-behavior | parse | Characterize tag support/rejection and represented kind; binary unstable; custom type construction not installed |
| Y-03-tag2-failsafe | matrix | slice05-yaml-value-behavior | parse | Characterize tag support/rejection and represented kind; binary unstable; custom type construction not installed |
| Y-03-tag2-json | matrix | slice05-yaml-value-behavior | parse | Characterize tag support/rejection and represented kind; binary unstable; custom type construction not installed |
| Y-03-tag2-core | matrix | slice05-yaml-value-behavior | parse | Characterize tag support/rejection and represented kind; binary unstable; custom type construction not installed |
| Y-03-tag2-default | matrix | slice05-yaml-value-behavior | parse | Characterize tag support/rejection and represented kind; binary unstable; custom type construction not installed |
| Y-03-tag2-extended | matrix | slice05-yaml-value-behavior | parse | Characterize tag support/rejection and represented kind; binary unstable; custom type construction not installed |
| Y-03-tag3-failsafe | matrix | slice05-yaml-value-behavior | parse | Characterize tag support/rejection and represented kind; binary unstable; custom type construction not installed |
| Y-03-tag3-json | matrix | slice05-yaml-value-behavior | parse | Characterize tag support/rejection and represented kind; binary unstable; custom type construction not installed |
| Y-03-tag3-core | matrix | slice05-yaml-value-behavior | parse | Characterize tag support/rejection and represented kind; binary unstable; custom type construction not installed |
| Y-03-tag3-default | matrix | slice05-yaml-value-behavior | parse | Characterize tag support/rejection and represented kind; binary unstable; custom type construction not installed |
| Y-03-tag3-extended | matrix | slice05-yaml-value-behavior | parse | Characterize tag support/rejection and represented kind; binary unstable; custom type construction not installed |
| Y-03-tag4-failsafe | matrix | slice05-yaml-value-behavior | parse | Characterize tag support/rejection and represented kind; binary unstable; custom type construction not installed |
| Y-03-tag4-json | matrix | slice05-yaml-value-behavior | parse | Characterize tag support/rejection and represented kind; binary unstable; custom type construction not installed |
| Y-03-tag4-core | matrix | slice05-yaml-value-behavior | parse | Characterize tag support/rejection and represented kind; binary unstable; custom type construction not installed |
| Y-03-tag4-default | matrix | slice05-yaml-value-behavior | parse | Characterize tag support/rejection and represented kind; binary unstable; custom type construction not installed |
| Y-03-tag4-extended | matrix | slice05-yaml-value-behavior | parse | Characterize tag support/rejection and represented kind; binary unstable; custom type construction not installed |
| Y-03-tag5-failsafe | matrix | slice05-yaml-value-behavior | parse | Characterize tag support/rejection and represented kind; binary unstable; custom type construction not installed |
| Y-03-tag5-json | matrix | slice05-yaml-value-behavior | parse | Characterize tag support/rejection and represented kind; binary unstable; custom type construction not installed |
| Y-03-tag5-core | matrix | slice05-yaml-value-behavior | parse | Characterize tag support/rejection and represented kind; binary unstable; custom type construction not installed |
| Y-03-tag5-default | matrix | slice05-yaml-value-behavior | parse | Characterize tag support/rejection and represented kind; binary unstable; custom type construction not installed |
| Y-03-tag5-extended | matrix | slice05-yaml-value-behavior | parse | Characterize tag support/rejection and represented kind; binary unstable; custom type construction not installed |
| Y-03-tag6-failsafe | matrix | slice05-yaml-value-behavior | parse | Characterize tag support/rejection and represented kind; binary unstable; custom type construction not installed |
| Y-03-tag6-json | matrix | slice05-yaml-value-behavior | parse | Characterize tag support/rejection and represented kind; binary unstable; custom type construction not installed |
| Y-03-tag6-core | matrix | slice05-yaml-value-behavior | parse | Characterize tag support/rejection and represented kind; binary unstable; custom type construction not installed |
| Y-03-tag6-default | matrix | slice05-yaml-value-behavior | parse | Characterize tag support/rejection and represented kind; binary unstable; custom type construction not installed |
| Y-03-tag6-extended | matrix | slice05-yaml-value-behavior | parse | Characterize tag support/rejection and represented kind; binary unstable; custom type construction not installed |
| Y-03-tag7-failsafe | matrix | slice05-yaml-value-behavior | parse | Characterize tag support/rejection and represented kind; binary unstable; custom type construction not installed |
| Y-03-tag7-json | matrix | slice05-yaml-value-behavior | parse | Characterize tag support/rejection and represented kind; binary unstable; custom type construction not installed |
| Y-03-tag7-core | matrix | slice05-yaml-value-behavior | parse | Characterize tag support/rejection and represented kind; binary unstable; custom type construction not installed |
| Y-03-tag7-default | matrix | slice05-yaml-value-behavior | parse | Characterize tag support/rejection and represented kind; binary unstable; custom type construction not installed |
| Y-03-tag7-extended | matrix | slice05-yaml-value-behavior | parse | Characterize tag support/rejection and represented kind; binary unstable; custom type construction not installed |
| Y-03-tag8-failsafe | matrix | slice05-yaml-value-behavior | parse | Characterize tag support/rejection and represented kind; binary unstable; custom type construction not installed |
| Y-03-tag8-json | matrix | slice05-yaml-value-behavior | parse | Characterize tag support/rejection and represented kind; binary unstable; custom type construction not installed |
| Y-03-tag8-core | matrix | slice05-yaml-value-behavior | parse | Characterize tag support/rejection and represented kind; binary unstable; custom type construction not installed |
| Y-03-tag8-default | matrix | slice05-yaml-value-behavior | parse | Characterize tag support/rejection and represented kind; binary unstable; custom type construction not installed |
| Y-03-tag8-extended | matrix | slice05-yaml-value-behavior | parse | Characterize tag support/rejection and represented kind; binary unstable; custom type construction not installed |
| Y-03-tag9-failsafe | matrix | slice05-yaml-value-behavior | parse | Characterize tag support/rejection and represented kind; binary unstable; custom type construction not installed |
| Y-03-tag9-json | matrix | slice05-yaml-value-behavior | parse | Characterize tag support/rejection and represented kind; binary unstable; custom type construction not installed |
| Y-03-tag9-core | matrix | slice05-yaml-value-behavior | parse | Characterize tag support/rejection and represented kind; binary unstable; custom type construction not installed |
| Y-03-tag9-default | matrix | slice05-yaml-value-behavior | parse | Characterize tag support/rejection and represented kind; binary unstable; custom type construction not installed |
| Y-03-tag9-extended | matrix | slice05-yaml-value-behavior | parse | Characterize tag support/rejection and represented kind; binary unstable; custom type construction not installed |
| Y-04-duplicate-reject | matrix | slice05-yaml-value-behavior | parse | YamlSyntaxError before output write |
| Y-04-duplicate-allow | matrix | slice05-yaml-value-behavior | parse | Last key wins when explicitly allowed; retain original duplicate bytes |
| Y-04-key0-allowfalse | matrix | slice05-yaml-value-behavior | parse | Compare original YAML key kinds with represented own property keys; coercion/collision is loss |
| Y-04-key0-allowtrue | matrix | slice05-yaml-value-behavior | parse | Compare original YAML key kinds with represented own property keys; coercion/collision is loss |
| Y-04-key1-allowfalse | matrix | slice05-yaml-value-behavior | parse | Compare original YAML key kinds with represented own property keys; coercion/collision is loss |
| Y-04-key1-allowtrue | matrix | slice05-yaml-value-behavior | parse | Compare original YAML key kinds with represented own property keys; coercion/collision is loss |
| Y-04-key2-allowfalse | matrix | slice05-yaml-value-behavior | parse | Compare original YAML key kinds with represented own property keys; coercion/collision is loss |
| Y-04-key2-allowtrue | matrix | slice05-yaml-value-behavior | parse | Compare original YAML key kinds with represented own property keys; coercion/collision is loss |
| Y-05-alias | matrix | slice05-yaml-value-behavior | alias | Report a===b before edit and b.x after a.x=9 |
| Y-06-cycle | matrix | slice05-yaml-value-behavior | cycle | Inspector terminates and reports repeated identity; parser outcome characterized |
| Y-06-unresolved | matrix | slice05-yaml-value-behavior | parse | Unresolved alias rejected with positioned error |
| Y-07-merge-failsafe | matrix | slice05-yaml-value-behavior | rewrite | Characterize merge resolution, overrides and loss/retention of merge/anchor presentation |
| Y-07-merge-json | matrix | slice05-yaml-value-behavior | rewrite | Characterize merge resolution, overrides and loss/retention of merge/anchor presentation |
| Y-07-merge-core | matrix | slice05-yaml-value-behavior | rewrite | Characterize merge resolution, overrides and loss/retention of merge/anchor presentation |
| Y-07-merge-default | matrix | slice05-yaml-value-behavior | rewrite | Characterize merge resolution, overrides and loss/retention of merge/anchor presentation |
| Y-07-merge-extended | matrix | slice05-yaml-value-behavior | rewrite | Characterize merge resolution, overrides and loss/retention of merge/anchor presentation |
| Y-08-two-parse | matrix | slice05-yaml-value-behavior | parse | Single parse rejects multiple docs; parseAll preserves order/empty docs or returns attributable error; no false all-success |
| Y-08-two-parseAll | matrix | slice05-yaml-value-behavior | parseAll | Single parse rejects multiple docs; parseAll preserves order/empty docs or returns attributable error; no false all-success |
| Y-08-empty-parse | matrix | slice05-yaml-value-behavior | parse | Single parse rejects multiple docs; parseAll preserves order/empty docs or returns attributable error; no false all-success |
| Y-08-empty-parseAll | matrix | slice05-yaml-value-behavior | parseAll | Single parse rejects multiple docs; parseAll preserves order/empty docs or returns attributable error; no false all-success |
| Y-08-invalid-parse | matrix | slice05-yaml-value-behavior | parse | Single parse rejects multiple docs; parseAll preserves order/empty docs or returns attributable error; no false all-success |
| Y-08-invalid-parseAll | matrix | slice05-yaml-value-behavior | parseAll | Single parse rejects multiple docs; parseAll preserves order/empty docs or returns attributable error; no false all-success |
| Y-09-malformed | matrix | slice05-yaml-value-behavior | parse | Record errors/warnings with exact positions; duplicate-anchor outcome unknown; rejected parse must not replace destination |
| Y-09-indent | matrix | slice05-yaml-value-behavior | parse | Record errors/warnings with exact positions; duplicate-anchor outcome unknown; rejected parse must not replace destination |
| Y-09-anchor | matrix | slice05-yaml-value-behavior | parse | Record errors/warnings with exact positions; duplicate-anchor outcome unknown; rejected parse must not replace destination |
| Y-09-tab | matrix | slice05-yaml-value-behavior | parse | Record errors/warnings with exact positions; duplicate-anchor outcome unknown; rejected parse must not replace destination |
| Y-10-noop | matrix | slice05-yaml-value-behavior | rewrite | Retain original/noop/edited bytes; presentation loss characterized independently of semantic edit |
| Y-10-edit | matrix | slice05-yaml-value-behavior | rewrite | Retain original/noop/edited bytes; presentation loss characterized independently of semantic edit |
| Y-11-literal | matrix | slice05-yaml-value-behavior | rewrite | Scalar semantic newlines and document presentation are separate; retain all byte changes |
| Y-11-folded | matrix | slice05-yaml-value-behavior | rewrite | Scalar semantic newlines and document presentation are separate; retain all byte changes |
| Y-11-directive | matrix | slice05-yaml-value-behavior | rewrite | Scalar semantic newlines and document presentation are separate; retain all byte changes |
| Y-11-bom | matrix | slice05-yaml-value-behavior | rewrite | Scalar semantic newlines and document presentation are separate; retain all byte changes |
| Y-11-crlf | matrix | slice05-yaml-value-behavior | rewrite | Scalar semantic newlines and document presentation are separate; retain all byte changes |
| Y-11-no-lf | matrix | slice05-yaml-value-behavior | rewrite | Scalar semantic newlines and document presentation are separate; retain all byte changes |
| Y-12-number-9007199254740991-failsafe | matrix | slice05-yaml-value-behavior | parse | Original numeric token retained; represented Number loss cannot be hidden by roundtrip |
| Y-12-number-9007199254740991-json | matrix | slice05-yaml-value-behavior | parse | Original numeric token retained; represented Number loss cannot be hidden by roundtrip |
| Y-12-number-9007199254740991-core | matrix | slice05-yaml-value-behavior | parse | Original numeric token retained; represented Number loss cannot be hidden by roundtrip |
| Y-12-number-9007199254740991-default | matrix | slice05-yaml-value-behavior | parse | Original numeric token retained; represented Number loss cannot be hidden by roundtrip |
| Y-12-number-9007199254740991-extended | matrix | slice05-yaml-value-behavior | parse | Original numeric token retained; represented Number loss cannot be hidden by roundtrip |
| Y-12-number-9007199254740992-failsafe | matrix | slice05-yaml-value-behavior | parse | Original numeric token retained; represented Number loss cannot be hidden by roundtrip |
| Y-12-number-9007199254740992-json | matrix | slice05-yaml-value-behavior | parse | Original numeric token retained; represented Number loss cannot be hidden by roundtrip |
| Y-12-number-9007199254740992-core | matrix | slice05-yaml-value-behavior | parse | Original numeric token retained; represented Number loss cannot be hidden by roundtrip |
| Y-12-number-9007199254740992-default | matrix | slice05-yaml-value-behavior | parse | Original numeric token retained; represented Number loss cannot be hidden by roundtrip |
| Y-12-number-9007199254740992-extended | matrix | slice05-yaml-value-behavior | parse | Original numeric token retained; represented Number loss cannot be hidden by roundtrip |
| Y-12-number-9007199254740993-failsafe | matrix | slice05-yaml-value-behavior | parse | Original numeric token retained; represented Number loss cannot be hidden by roundtrip |
| Y-12-number-9007199254740993-json | matrix | slice05-yaml-value-behavior | parse | Original numeric token retained; represented Number loss cannot be hidden by roundtrip |
| Y-12-number-9007199254740993-core | matrix | slice05-yaml-value-behavior | parse | Original numeric token retained; represented Number loss cannot be hidden by roundtrip |
| Y-12-number-9007199254740993-default | matrix | slice05-yaml-value-behavior | parse | Original numeric token retained; represented Number loss cannot be hidden by roundtrip |
| Y-12-number-9007199254740993-extended | matrix | slice05-yaml-value-behavior | parse | Original numeric token retained; represented Number loss cannot be hidden by roundtrip |
| Y-12-number--9007199254740993-failsafe | matrix | slice05-yaml-value-behavior | parse | Original numeric token retained; represented Number loss cannot be hidden by roundtrip |
| Y-12-number--9007199254740993-json | matrix | slice05-yaml-value-behavior | parse | Original numeric token retained; represented Number loss cannot be hidden by roundtrip |
| Y-12-number--9007199254740993-core | matrix | slice05-yaml-value-behavior | parse | Original numeric token retained; represented Number loss cannot be hidden by roundtrip |
| Y-12-number--9007199254740993-default | matrix | slice05-yaml-value-behavior | parse | Original numeric token retained; represented Number loss cannot be hidden by roundtrip |
| Y-12-number--9007199254740993-extended | matrix | slice05-yaml-value-behavior | parse | Original numeric token retained; represented Number loss cannot be hidden by roundtrip |
| Y-12-number-0.1-failsafe | matrix | slice05-yaml-value-behavior | parse | Original numeric token retained; represented Number loss cannot be hidden by roundtrip |
| Y-12-number-0.1-json | matrix | slice05-yaml-value-behavior | parse | Original numeric token retained; represented Number loss cannot be hidden by roundtrip |
| Y-12-number-0.1-core | matrix | slice05-yaml-value-behavior | parse | Original numeric token retained; represented Number loss cannot be hidden by roundtrip |
| Y-12-number-0.1-default | matrix | slice05-yaml-value-behavior | parse | Original numeric token retained; represented Number loss cannot be hidden by roundtrip |
| Y-12-number-0.1-extended | matrix | slice05-yaml-value-behavior | parse | Original numeric token retained; represented Number loss cannot be hidden by roundtrip |
| Y-12-number-1.2300-failsafe | matrix | slice05-yaml-value-behavior | parse | Original numeric token retained; represented Number loss cannot be hidden by roundtrip |
| Y-12-number-1.2300-json | matrix | slice05-yaml-value-behavior | parse | Original numeric token retained; represented Number loss cannot be hidden by roundtrip |
| Y-12-number-1.2300-core | matrix | slice05-yaml-value-behavior | parse | Original numeric token retained; represented Number loss cannot be hidden by roundtrip |
| Y-12-number-1.2300-default | matrix | slice05-yaml-value-behavior | parse | Original numeric token retained; represented Number loss cannot be hidden by roundtrip |
| Y-12-number-1.2300-extended | matrix | slice05-yaml-value-behavior | parse | Original numeric token retained; represented Number loss cannot be hidden by roundtrip |
| Y-12-number-1e400-failsafe | matrix | slice05-yaml-value-behavior | parse | Original numeric token retained; represented Number loss cannot be hidden by roundtrip |
| Y-12-number-1e400-json | matrix | slice05-yaml-value-behavior | parse | Original numeric token retained; represented Number loss cannot be hidden by roundtrip |
| Y-12-number-1e400-core | matrix | slice05-yaml-value-behavior | parse | Original numeric token retained; represented Number loss cannot be hidden by roundtrip |
| Y-12-number-1e400-default | matrix | slice05-yaml-value-behavior | parse | Original numeric token retained; represented Number loss cannot be hidden by roundtrip |
| Y-12-number-1e400-extended | matrix | slice05-yaml-value-behavior | parse | Original numeric token retained; represented Number loss cannot be hidden by roundtrip |
| Y-12-number-1e-400-failsafe | matrix | slice05-yaml-value-behavior | parse | Original numeric token retained; represented Number loss cannot be hidden by roundtrip |
| Y-12-number-1e-400-json | matrix | slice05-yaml-value-behavior | parse | Original numeric token retained; represented Number loss cannot be hidden by roundtrip |
| Y-12-number-1e-400-core | matrix | slice05-yaml-value-behavior | parse | Original numeric token retained; represented Number loss cannot be hidden by roundtrip |
| Y-12-number-1e-400-default | matrix | slice05-yaml-value-behavior | parse | Original numeric token retained; represented Number loss cannot be hidden by roundtrip |
| Y-12-number-1e-400-extended | matrix | slice05-yaml-value-behavior | parse | Original numeric token retained; represented Number loss cannot be hidden by roundtrip |
| Y-12-number--0-failsafe | matrix | slice05-yaml-value-behavior | parse | Original numeric token retained; represented Number loss cannot be hidden by roundtrip |
| Y-12-number--0-json | matrix | slice05-yaml-value-behavior | parse | Original numeric token retained; represented Number loss cannot be hidden by roundtrip |
| Y-12-number--0-core | matrix | slice05-yaml-value-behavior | parse | Original numeric token retained; represented Number loss cannot be hidden by roundtrip |
| Y-12-number--0-default | matrix | slice05-yaml-value-behavior | parse | Original numeric token retained; represented Number loss cannot be hidden by roundtrip |
| Y-12-number--0-extended | matrix | slice05-yaml-value-behavior | parse | Original numeric token retained; represented Number loss cannot be hidden by roundtrip |
| Y-12-presence-0 | matrix | slice05-yaml-value-behavior | parse | Distinguish own presence/null/falsy and preserve false/zero/empty defaults |
| Y-12-presence-1 | matrix | slice05-yaml-value-behavior | parse | Distinguish own presence/null/falsy and preserve false/zero/empty defaults |
| Y-12-presence-2 | matrix | slice05-yaml-value-behavior | parse | Distinguish own presence/null/falsy and preserve false/zero/empty defaults |
| Y-12-presence-3 | matrix | slice05-yaml-value-behavior | parse | Distinguish own presence/null/falsy and preserve false/zero/empty defaults |
| Y-12-presence-4 | matrix | slice05-yaml-value-behavior | parse | Distinguish own presence/null/falsy and preserve false/zero/empty defaults |
| Y-12-own-undefined | matrix | slice05-yaml-value-behavior | runtime-presence | Construct own x=undefined, distinguish absence and report serializer effect |
| Y-12-exact-keys | matrix | slice05-yaml-value-behavior | keys | Exact dynamic keys, own properties and prototype unchanged after value edit |
| Y-13-depth-16-default-parse | future | slice06-yaml-resource-and-files | resource | One warmup+5; supervisor10s/16MiB/512MiB sampled; stop larger family on cap; absent API/bound is unsupported, not silently simulated |
| Y-13-depth-16-default-toJS | future | slice06-yaml-resource-and-files | resource | One warmup+5; supervisor10s/16MiB/512MiB sampled; stop larger family on cap; absent API/bound is unsupported, not silently simulated |
| Y-13-depth-16-default-stringify | future | slice06-yaml-resource-and-files | resource | One warmup+5; supervisor10s/16MiB/512MiB sampled; stop larger family on cap; absent API/bound is unsupported, not silently simulated |
| Y-13-depth-16-explicit-parse | future | slice06-yaml-resource-and-files | resource | One warmup+5; supervisor10s/16MiB/512MiB sampled; stop larger family on cap; absent API/bound is unsupported, not silently simulated |
| Y-13-depth-16-explicit-toJS | future | slice06-yaml-resource-and-files | resource | One warmup+5; supervisor10s/16MiB/512MiB sampled; stop larger family on cap; absent API/bound is unsupported, not silently simulated |
| Y-13-depth-16-explicit-stringify | future | slice06-yaml-resource-and-files | resource | One warmup+5; supervisor10s/16MiB/512MiB sampled; stop larger family on cap; absent API/bound is unsupported, not silently simulated |
| Y-13-depth-64-default-parse | future | slice06-yaml-resource-and-files | resource | One warmup+5; supervisor10s/16MiB/512MiB sampled; stop larger family on cap; absent API/bound is unsupported, not silently simulated |
| Y-13-depth-64-default-toJS | future | slice06-yaml-resource-and-files | resource | One warmup+5; supervisor10s/16MiB/512MiB sampled; stop larger family on cap; absent API/bound is unsupported, not silently simulated |
| Y-13-depth-64-default-stringify | future | slice06-yaml-resource-and-files | resource | One warmup+5; supervisor10s/16MiB/512MiB sampled; stop larger family on cap; absent API/bound is unsupported, not silently simulated |
| Y-13-depth-64-explicit-parse | future | slice06-yaml-resource-and-files | resource | One warmup+5; supervisor10s/16MiB/512MiB sampled; stop larger family on cap; absent API/bound is unsupported, not silently simulated |
| Y-13-depth-64-explicit-toJS | future | slice06-yaml-resource-and-files | resource | One warmup+5; supervisor10s/16MiB/512MiB sampled; stop larger family on cap; absent API/bound is unsupported, not silently simulated |
| Y-13-depth-64-explicit-stringify | future | slice06-yaml-resource-and-files | resource | One warmup+5; supervisor10s/16MiB/512MiB sampled; stop larger family on cap; absent API/bound is unsupported, not silently simulated |
| Y-13-depth-256-default-parse | future | slice06-yaml-resource-and-files | resource | One warmup+5; supervisor10s/16MiB/512MiB sampled; stop larger family on cap; absent API/bound is unsupported, not silently simulated |
| Y-13-depth-256-default-toJS | future | slice06-yaml-resource-and-files | resource | One warmup+5; supervisor10s/16MiB/512MiB sampled; stop larger family on cap; absent API/bound is unsupported, not silently simulated |
| Y-13-depth-256-default-stringify | future | slice06-yaml-resource-and-files | resource | One warmup+5; supervisor10s/16MiB/512MiB sampled; stop larger family on cap; absent API/bound is unsupported, not silently simulated |
| Y-13-depth-256-explicit-parse | future | slice06-yaml-resource-and-files | resource | One warmup+5; supervisor10s/16MiB/512MiB sampled; stop larger family on cap; absent API/bound is unsupported, not silently simulated |
| Y-13-depth-256-explicit-toJS | future | slice06-yaml-resource-and-files | resource | One warmup+5; supervisor10s/16MiB/512MiB sampled; stop larger family on cap; absent API/bound is unsupported, not silently simulated |
| Y-13-depth-256-explicit-stringify | future | slice06-yaml-resource-and-files | resource | One warmup+5; supervisor10s/16MiB/512MiB sampled; stop larger family on cap; absent API/bound is unsupported, not silently simulated |
| Y-13-string-1024-default-parse | future | slice06-yaml-resource-and-files | resource | One warmup+5; supervisor10s/16MiB/512MiB sampled; stop larger family on cap; absent API/bound is unsupported, not silently simulated |
| Y-13-string-1024-default-toJS | future | slice06-yaml-resource-and-files | resource | One warmup+5; supervisor10s/16MiB/512MiB sampled; stop larger family on cap; absent API/bound is unsupported, not silently simulated |
| Y-13-string-1024-default-stringify | future | slice06-yaml-resource-and-files | resource | One warmup+5; supervisor10s/16MiB/512MiB sampled; stop larger family on cap; absent API/bound is unsupported, not silently simulated |
| Y-13-string-1024-explicit-parse | future | slice06-yaml-resource-and-files | resource | One warmup+5; supervisor10s/16MiB/512MiB sampled; stop larger family on cap; absent API/bound is unsupported, not silently simulated |
| Y-13-string-1024-explicit-toJS | future | slice06-yaml-resource-and-files | resource | One warmup+5; supervisor10s/16MiB/512MiB sampled; stop larger family on cap; absent API/bound is unsupported, not silently simulated |
| Y-13-string-1024-explicit-stringify | future | slice06-yaml-resource-and-files | resource | One warmup+5; supervisor10s/16MiB/512MiB sampled; stop larger family on cap; absent API/bound is unsupported, not silently simulated |
| Y-13-string-1048576-default-parse | future | slice06-yaml-resource-and-files | resource | One warmup+5; supervisor10s/16MiB/512MiB sampled; stop larger family on cap; absent API/bound is unsupported, not silently simulated |
| Y-13-string-1048576-default-toJS | future | slice06-yaml-resource-and-files | resource | One warmup+5; supervisor10s/16MiB/512MiB sampled; stop larger family on cap; absent API/bound is unsupported, not silently simulated |
| Y-13-string-1048576-default-stringify | future | slice06-yaml-resource-and-files | resource | One warmup+5; supervisor10s/16MiB/512MiB sampled; stop larger family on cap; absent API/bound is unsupported, not silently simulated |
| Y-13-string-1048576-explicit-parse | future | slice06-yaml-resource-and-files | resource | One warmup+5; supervisor10s/16MiB/512MiB sampled; stop larger family on cap; absent API/bound is unsupported, not silently simulated |
| Y-13-string-1048576-explicit-toJS | future | slice06-yaml-resource-and-files | resource | One warmup+5; supervisor10s/16MiB/512MiB sampled; stop larger family on cap; absent API/bound is unsupported, not silently simulated |
| Y-13-string-1048576-explicit-stringify | future | slice06-yaml-resource-and-files | resource | One warmup+5; supervisor10s/16MiB/512MiB sampled; stop larger family on cap; absent API/bound is unsupported, not silently simulated |
| Y-13-string-8388608-default-parse | future | slice06-yaml-resource-and-files | resource | One warmup+5; supervisor10s/16MiB/512MiB sampled; stop larger family on cap; absent API/bound is unsupported, not silently simulated |
| Y-13-string-8388608-default-toJS | future | slice06-yaml-resource-and-files | resource | One warmup+5; supervisor10s/16MiB/512MiB sampled; stop larger family on cap; absent API/bound is unsupported, not silently simulated |
| Y-13-string-8388608-default-stringify | future | slice06-yaml-resource-and-files | resource | One warmup+5; supervisor10s/16MiB/512MiB sampled; stop larger family on cap; absent API/bound is unsupported, not silently simulated |
| Y-13-string-8388608-explicit-parse | future | slice06-yaml-resource-and-files | resource | One warmup+5; supervisor10s/16MiB/512MiB sampled; stop larger family on cap; absent API/bound is unsupported, not silently simulated |
| Y-13-string-8388608-explicit-toJS | future | slice06-yaml-resource-and-files | resource | One warmup+5; supervisor10s/16MiB/512MiB sampled; stop larger family on cap; absent API/bound is unsupported, not silently simulated |
| Y-13-string-8388608-explicit-stringify | future | slice06-yaml-resource-and-files | resource | One warmup+5; supervisor10s/16MiB/512MiB sampled; stop larger family on cap; absent API/bound is unsupported, not silently simulated |
| Y-13-alias-dag-4-default-parse | future | slice06-yaml-resource-and-files | resource | One warmup+5; supervisor10s/16MiB/512MiB sampled; stop larger family on cap; absent API/bound is unsupported, not silently simulated |
| Y-13-alias-dag-4-default-toJS | future | slice06-yaml-resource-and-files | resource | One warmup+5; supervisor10s/16MiB/512MiB sampled; stop larger family on cap; absent API/bound is unsupported, not silently simulated |
| Y-13-alias-dag-4-default-stringify | future | slice06-yaml-resource-and-files | resource | One warmup+5; supervisor10s/16MiB/512MiB sampled; stop larger family on cap; absent API/bound is unsupported, not silently simulated |
| Y-13-alias-dag-4-explicit-parse | future | slice06-yaml-resource-and-files | resource | One warmup+5; supervisor10s/16MiB/512MiB sampled; stop larger family on cap; absent API/bound is unsupported, not silently simulated |
| Y-13-alias-dag-4-explicit-toJS | future | slice06-yaml-resource-and-files | resource | One warmup+5; supervisor10s/16MiB/512MiB sampled; stop larger family on cap; absent API/bound is unsupported, not silently simulated |
| Y-13-alias-dag-4-explicit-stringify | future | slice06-yaml-resource-and-files | resource | One warmup+5; supervisor10s/16MiB/512MiB sampled; stop larger family on cap; absent API/bound is unsupported, not silently simulated |
| Y-13-alias-dag-8-default-parse | future | slice06-yaml-resource-and-files | resource | One warmup+5; supervisor10s/16MiB/512MiB sampled; stop larger family on cap; absent API/bound is unsupported, not silently simulated |
| Y-13-alias-dag-8-default-toJS | future | slice06-yaml-resource-and-files | resource | One warmup+5; supervisor10s/16MiB/512MiB sampled; stop larger family on cap; absent API/bound is unsupported, not silently simulated |
| Y-13-alias-dag-8-default-stringify | future | slice06-yaml-resource-and-files | resource | One warmup+5; supervisor10s/16MiB/512MiB sampled; stop larger family on cap; absent API/bound is unsupported, not silently simulated |
| Y-13-alias-dag-8-explicit-parse | future | slice06-yaml-resource-and-files | resource | One warmup+5; supervisor10s/16MiB/512MiB sampled; stop larger family on cap; absent API/bound is unsupported, not silently simulated |
| Y-13-alias-dag-8-explicit-toJS | future | slice06-yaml-resource-and-files | resource | One warmup+5; supervisor10s/16MiB/512MiB sampled; stop larger family on cap; absent API/bound is unsupported, not silently simulated |
| Y-13-alias-dag-8-explicit-stringify | future | slice06-yaml-resource-and-files | resource | One warmup+5; supervisor10s/16MiB/512MiB sampled; stop larger family on cap; absent API/bound is unsupported, not silently simulated |
| Y-13-alias-dag-12-default-parse | future | slice06-yaml-resource-and-files | resource | One warmup+5; supervisor10s/16MiB/512MiB sampled; stop larger family on cap; absent API/bound is unsupported, not silently simulated |
| Y-13-alias-dag-12-default-toJS | future | slice06-yaml-resource-and-files | resource | One warmup+5; supervisor10s/16MiB/512MiB sampled; stop larger family on cap; absent API/bound is unsupported, not silently simulated |
| Y-13-alias-dag-12-default-stringify | future | slice06-yaml-resource-and-files | resource | One warmup+5; supervisor10s/16MiB/512MiB sampled; stop larger family on cap; absent API/bound is unsupported, not silently simulated |
| Y-13-alias-dag-12-explicit-parse | future | slice06-yaml-resource-and-files | resource | One warmup+5; supervisor10s/16MiB/512MiB sampled; stop larger family on cap; absent API/bound is unsupported, not silently simulated |
| Y-13-alias-dag-12-explicit-toJS | future | slice06-yaml-resource-and-files | resource | One warmup+5; supervisor10s/16MiB/512MiB sampled; stop larger family on cap; absent API/bound is unsupported, not silently simulated |
| Y-13-alias-dag-12-explicit-stringify | future | slice06-yaml-resource-and-files | resource | One warmup+5; supervisor10s/16MiB/512MiB sampled; stop larger family on cap; absent API/bound is unsupported, not silently simulated |
| Y-14-doc0-tokensfalse-none | future | slice07-yaml-document-fidelity | document | GATED: Document.setIn/toString, node comments and keepSourceTokens comparison; preserve semantic intent and every unrelated byte change |
| Y-14-doc0-tokensfalse-n=2 | future | slice07-yaml-document-fidelity | document | GATED: Document.setIn/toString, node comments and keepSourceTokens comparison; preserve semantic intent and every unrelated byte change |
| Y-14-doc0-tokenstrue-none | future | slice07-yaml-document-fidelity | document | GATED: Document.setIn/toString, node comments and keepSourceTokens comparison; preserve semantic intent and every unrelated byte change |
| Y-14-doc0-tokenstrue-n=2 | future | slice07-yaml-document-fidelity | document | GATED: Document.setIn/toString, node comments and keepSourceTokens comparison; preserve semantic intent and every unrelated byte change |
| Y-14-doc1-tokensfalse-none | future | slice07-yaml-document-fidelity | document | GATED: Document.setIn/toString, node comments and keepSourceTokens comparison; preserve semantic intent and every unrelated byte change |
| Y-14-doc1-tokensfalse-n=2 | future | slice07-yaml-document-fidelity | document | GATED: Document.setIn/toString, node comments and keepSourceTokens comparison; preserve semantic intent and every unrelated byte change |
| Y-14-doc1-tokenstrue-none | future | slice07-yaml-document-fidelity | document | GATED: Document.setIn/toString, node comments and keepSourceTokens comparison; preserve semantic intent and every unrelated byte change |
| Y-14-doc1-tokenstrue-n=2 | future | slice07-yaml-document-fidelity | document | GATED: Document.setIn/toString, node comments and keepSourceTokens comparison; preserve semantic intent and every unrelated byte change |
| Y-14-doc2-tokensfalse-none | future | slice07-yaml-document-fidelity | document | GATED: Document.setIn/toString, node comments and keepSourceTokens comparison; preserve semantic intent and every unrelated byte change |
| Y-14-doc2-tokensfalse-n=2 | future | slice07-yaml-document-fidelity | document | GATED: Document.setIn/toString, node comments and keepSourceTokens comparison; preserve semantic intent and every unrelated byte change |
| Y-14-doc2-tokenstrue-none | future | slice07-yaml-document-fidelity | document | GATED: Document.setIn/toString, node comments and keepSourceTokens comparison; preserve semantic intent and every unrelated byte change |
| Y-14-doc2-tokenstrue-n=2 | future | slice07-yaml-document-fidelity | document | GATED: Document.setIn/toString, node comments and keepSourceTokens comparison; preserve semantic intent and every unrelated byte change |
| Y-14-doc3-tokensfalse-none | future | slice07-yaml-document-fidelity | document | GATED: Document.setIn/toString, node comments and keepSourceTokens comparison; preserve semantic intent and every unrelated byte change |
| Y-14-doc3-tokensfalse-n=2 | future | slice07-yaml-document-fidelity | document | GATED: Document.setIn/toString, node comments and keepSourceTokens comparison; preserve semantic intent and every unrelated byte change |
| Y-14-doc3-tokenstrue-none | future | slice07-yaml-document-fidelity | document | GATED: Document.setIn/toString, node comments and keepSourceTokens comparison; preserve semantic intent and every unrelated byte change |
| Y-14-doc3-tokenstrue-n=2 | future | slice07-yaml-document-fidelity | document | GATED: Document.setIn/toString, node comments and keepSourceTokens comparison; preserve semantic intent and every unrelated byte change |
| Y-14-doc4-tokensfalse-none | future | slice07-yaml-document-fidelity | document | GATED: Document.setIn/toString, node comments and keepSourceTokens comparison; preserve semantic intent and every unrelated byte change |
| Y-14-doc4-tokensfalse-n=2 | future | slice07-yaml-document-fidelity | document | GATED: Document.setIn/toString, node comments and keepSourceTokens comparison; preserve semantic intent and every unrelated byte change |
| Y-14-doc4-tokenstrue-none | future | slice07-yaml-document-fidelity | document | GATED: Document.setIn/toString, node comments and keepSourceTokens comparison; preserve semantic intent and every unrelated byte change |
| Y-14-doc4-tokenstrue-n=2 | future | slice07-yaml-document-fidelity | document | GATED: Document.setIn/toString, node comments and keepSourceTokens comparison; preserve semantic intent and every unrelated byte change |
| Y-14-doc5-tokensfalse-none | future | slice07-yaml-document-fidelity | document | GATED: Document.setIn/toString, node comments and keepSourceTokens comparison; preserve semantic intent and every unrelated byte change |
| Y-14-doc5-tokensfalse-n=2 | future | slice07-yaml-document-fidelity | document | GATED: Document.setIn/toString, node comments and keepSourceTokens comparison; preserve semantic intent and every unrelated byte change |
| Y-14-doc5-tokenstrue-none | future | slice07-yaml-document-fidelity | document | GATED: Document.setIn/toString, node comments and keepSourceTokens comparison; preserve semantic intent and every unrelated byte change |
| Y-14-doc5-tokenstrue-n=2 | future | slice07-yaml-document-fidelity | document | GATED: Document.setIn/toString, node comments and keepSourceTokens comparison; preserve semantic intent and every unrelated byte change |
| Y-14-doc6-tokensfalse-none | future | slice07-yaml-document-fidelity | document | GATED: Document.setIn/toString, node comments and keepSourceTokens comparison; preserve semantic intent and every unrelated byte change |
| Y-14-doc6-tokensfalse-n=2 | future | slice07-yaml-document-fidelity | document | GATED: Document.setIn/toString, node comments and keepSourceTokens comparison; preserve semantic intent and every unrelated byte change |
| Y-14-doc6-tokenstrue-none | future | slice07-yaml-document-fidelity | document | GATED: Document.setIn/toString, node comments and keepSourceTokens comparison; preserve semantic intent and every unrelated byte change |
| Y-14-doc6-tokenstrue-n=2 | future | slice07-yaml-document-fidelity | document | GATED: Document.setIn/toString, node comments and keepSourceTokens comparison; preserve semantic intent and every unrelated byte change |
| Y-15-Date-skipfalse | matrix | slice05-yaml-value-behavior | runtime | Characterize accepted/rejected/coerced/dropped; skipInvalid never means fidelity |
| Y-15-Date-skiptrue | matrix | slice05-yaml-value-behavior | runtime | Characterize accepted/rejected/coerced/dropped; skipInvalid never means fidelity |
| Y-15-Map-skipfalse | matrix | slice05-yaml-value-behavior | runtime | Characterize accepted/rejected/coerced/dropped; skipInvalid never means fidelity |
| Y-15-Map-skiptrue | matrix | slice05-yaml-value-behavior | runtime | Characterize accepted/rejected/coerced/dropped; skipInvalid never means fidelity |
| Y-15-Set-skipfalse | matrix | slice05-yaml-value-behavior | runtime | Characterize accepted/rejected/coerced/dropped; skipInvalid never means fidelity |
| Y-15-Set-skiptrue | matrix | slice05-yaml-value-behavior | runtime | Characterize accepted/rejected/coerced/dropped; skipInvalid never means fidelity |
| Y-15-undefined-skipfalse | matrix | slice05-yaml-value-behavior | runtime | Characterize accepted/rejected/coerced/dropped; skipInvalid never means fidelity |
| Y-15-undefined-skiptrue | matrix | slice05-yaml-value-behavior | runtime | Characterize accepted/rejected/coerced/dropped; skipInvalid never means fidelity |
| Y-15-function-skipfalse | matrix | slice05-yaml-value-behavior | runtime | Characterize accepted/rejected/coerced/dropped; skipInvalid never means fidelity |
| Y-15-function-skiptrue | matrix | slice05-yaml-value-behavior | runtime | Characterize accepted/rejected/coerced/dropped; skipInvalid never means fidelity |
| Y-15-cycle-skipfalse | matrix | slice05-yaml-value-behavior | runtime | Characterize accepted/rejected/coerced/dropped; skipInvalid never means fidelity |
| Y-15-cycle-skiptrue | matrix | slice05-yaml-value-behavior | runtime | Characterize accepted/rejected/coerced/dropped; skipInvalid never means fidelity |
| Y-16-missing | future | slice06-yaml-resource-and-files | file-failure | Preserve source and safe destination on failure; raw truncation separate; modes/path failures versus injected failure explicit |
| Y-16-unreadable | future | slice06-yaml-resource-and-files | file-failure | Preserve source and safe destination on failure; raw truncation separate; modes/path failures versus injected failure explicit |
| Y-16-missing-parent | future | slice06-yaml-resource-and-files | file-failure | Preserve source and safe destination on failure; raw truncation separate; modes/path failures versus injected failure explicit |
| Y-16-unwritable | future | slice06-yaml-resource-and-files | file-failure | Preserve source and safe destination on failure; raw truncation separate; modes/path failures versus injected failure explicit |
| Y-16-raw-interrupt | future | slice06-yaml-resource-and-files | file-failure | Preserve source and safe destination on failure; raw truncation separate; modes/path failures versus injected failure explicit |
| Y-16-safe-interrupt | future | slice06-yaml-resource-and-files | file-failure | Preserve source and safe destination on failure; raw truncation separate; modes/path failures versus injected failure explicit |
| Y-16-rename-injected | future | slice06-yaml-resource-and-files | file-failure | Preserve source and safe destination on failure; raw truncation separate; modes/path failures versus injected failure explicit |
| Y-16-rename-directory | future | slice06-yaml-resource-and-files | file-failure | Preserve source and safe destination on failure; raw truncation separate; modes/path failures versus injected failure explicit |
| HP-inspector-control | harness | slice05-yaml-value-behavior | inspector-control | Tagged inspector bounds or explicit unknown dispatch rejection |
| HP-unknown-operation | harness | slice05-yaml-value-behavior | unknown-operation | Tagged inspector bounds or explicit unknown dispatch rejection |
| HP-unknown-case | harness | slice05-yaml-value-behavior | probe | Tagged inspector bounds or explicit unknown dispatch rejection |
| HP-unknown-pair | harness | slice05-yaml-value-behavior | probe | Tagged inspector bounds or explicit unknown dispatch rejection |
| HP-unknown-schema | harness | slice05-yaml-value-behavior | probe | Tagged inspector bounds or explicit unknown dispatch rejection |
