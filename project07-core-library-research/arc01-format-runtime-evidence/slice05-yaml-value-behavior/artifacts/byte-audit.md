# YAML byte audit — YV-BY01

For each accepted serialization, compare original literal bytes with no-op and output bytes. Y-15 has no original YAML document: its empty literal is only a transport placeholder, and the constructed value is retained in results. Ranges are zero-based half-open differing positional spans over max(original length, output length), including absent positions. This is a complete positional comparison, not a minimal insertion/deletion edit script. First difference is the first range start, or null. Original bytes are never inferred from reparsed values.

## Y-01-edit

Original 46 bytes; SHA-256 7455a3204d50ad250134ecfef22bb13c8119e87411b44f64fd535a0f4d723a1b; hex `6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a`.

noop 53 bytes; SHA-256 ad86b1600574e3da7fb3282b22c439192d8ab5a8f239b2b5f8b76c7c03775d86; hex `6e616d653a204164610a276e273a20310a666c6167733a0a20202d20747275650a20202d2066616c73650a6e696c3a206e756c6c0a`.

First difference: 10; complete ranges: `[[10,53]]`.

output 53 bytes; SHA-256 5ab891101476719c0d2f64a6fb6f6349f861f103a99d89c8f1a9b90e78bb1e97; hex `6e616d653a204164610a276e273a20320a666c6167733a0a20202d20747275650a20202d2066616c73650a6e696c3a206e756c6c0a`.

First difference: 10; complete ranges: `[[10,53]]`.

## Y-02-yes-plain-failsafe

Original 7 bytes; SHA-256 84d84f6451aed562527b4ed28ee75b848e6c7e342d13392f4f9c79a04f3ef472; hex `763a207965730a`.

noop 9 bytes; SHA-256 8e577c7257db03b638db45fd430d7af19a7aae9b97e7dab53b819e731bbf1b39; hex `763a2027796573270a`.

First difference: 3; complete ranges: `[[3,9]]`.

output 9 bytes; SHA-256 8e577c7257db03b638db45fd430d7af19a7aae9b97e7dab53b819e731bbf1b39; hex `763a2027796573270a`.

First difference: 3; complete ranges: `[[3,9]]`.

## Y-02-yes-plain-json

Original 7 bytes; SHA-256 84d84f6451aed562527b4ed28ee75b848e6c7e342d13392f4f9c79a04f3ef472; hex `763a207965730a`.

noop 9 bytes; SHA-256 8e577c7257db03b638db45fd430d7af19a7aae9b97e7dab53b819e731bbf1b39; hex `763a2027796573270a`.

First difference: 3; complete ranges: `[[3,9]]`.

output 9 bytes; SHA-256 8e577c7257db03b638db45fd430d7af19a7aae9b97e7dab53b819e731bbf1b39; hex `763a2027796573270a`.

First difference: 3; complete ranges: `[[3,9]]`.

## Y-02-yes-plain-core

Original 7 bytes; SHA-256 84d84f6451aed562527b4ed28ee75b848e6c7e342d13392f4f9c79a04f3ef472; hex `763a207965730a`.

noop 9 bytes; SHA-256 8e577c7257db03b638db45fd430d7af19a7aae9b97e7dab53b819e731bbf1b39; hex `763a2027796573270a`.

First difference: 3; complete ranges: `[[3,9]]`.

output 9 bytes; SHA-256 8e577c7257db03b638db45fd430d7af19a7aae9b97e7dab53b819e731bbf1b39; hex `763a2027796573270a`.

First difference: 3; complete ranges: `[[3,9]]`.

## Y-02-yes-plain-default

Original 7 bytes; SHA-256 84d84f6451aed562527b4ed28ee75b848e6c7e342d13392f4f9c79a04f3ef472; hex `763a207965730a`.

noop 9 bytes; SHA-256 8e577c7257db03b638db45fd430d7af19a7aae9b97e7dab53b819e731bbf1b39; hex `763a2027796573270a`.

First difference: 3; complete ranges: `[[3,9]]`.

output 9 bytes; SHA-256 8e577c7257db03b638db45fd430d7af19a7aae9b97e7dab53b819e731bbf1b39; hex `763a2027796573270a`.

First difference: 3; complete ranges: `[[3,9]]`.

## Y-02-yes-plain-extended

Original 7 bytes; SHA-256 84d84f6451aed562527b4ed28ee75b848e6c7e342d13392f4f9c79a04f3ef472; hex `763a207965730a`.

noop 9 bytes; SHA-256 8e577c7257db03b638db45fd430d7af19a7aae9b97e7dab53b819e731bbf1b39; hex `763a2027796573270a`.

First difference: 3; complete ranges: `[[3,9]]`.

output 9 bytes; SHA-256 8e577c7257db03b638db45fd430d7af19a7aae9b97e7dab53b819e731bbf1b39; hex `763a2027796573270a`.

First difference: 3; complete ranges: `[[3,9]]`.

## Y-02-yes-quoted-failsafe

Original 9 bytes; SHA-256 435b5ca76d944af8203e31bf894479d8e7a667819c6a19d02291d41df3c4d8e6; hex `763a2022796573220a`.

noop 9 bytes; SHA-256 8e577c7257db03b638db45fd430d7af19a7aae9b97e7dab53b819e731bbf1b39; hex `763a2027796573270a`.

First difference: 3; complete ranges: `[[3,4],[7,8]]`.

output 9 bytes; SHA-256 8e577c7257db03b638db45fd430d7af19a7aae9b97e7dab53b819e731bbf1b39; hex `763a2027796573270a`.

First difference: 3; complete ranges: `[[3,4],[7,8]]`.

## Y-02-yes-quoted-json

Original 9 bytes; SHA-256 435b5ca76d944af8203e31bf894479d8e7a667819c6a19d02291d41df3c4d8e6; hex `763a2022796573220a`.

noop 9 bytes; SHA-256 8e577c7257db03b638db45fd430d7af19a7aae9b97e7dab53b819e731bbf1b39; hex `763a2027796573270a`.

First difference: 3; complete ranges: `[[3,4],[7,8]]`.

output 9 bytes; SHA-256 8e577c7257db03b638db45fd430d7af19a7aae9b97e7dab53b819e731bbf1b39; hex `763a2027796573270a`.

First difference: 3; complete ranges: `[[3,4],[7,8]]`.

## Y-02-yes-quoted-core

Original 9 bytes; SHA-256 435b5ca76d944af8203e31bf894479d8e7a667819c6a19d02291d41df3c4d8e6; hex `763a2022796573220a`.

noop 9 bytes; SHA-256 8e577c7257db03b638db45fd430d7af19a7aae9b97e7dab53b819e731bbf1b39; hex `763a2027796573270a`.

First difference: 3; complete ranges: `[[3,4],[7,8]]`.

output 9 bytes; SHA-256 8e577c7257db03b638db45fd430d7af19a7aae9b97e7dab53b819e731bbf1b39; hex `763a2027796573270a`.

First difference: 3; complete ranges: `[[3,4],[7,8]]`.

## Y-02-yes-quoted-default

Original 9 bytes; SHA-256 435b5ca76d944af8203e31bf894479d8e7a667819c6a19d02291d41df3c4d8e6; hex `763a2022796573220a`.

noop 9 bytes; SHA-256 8e577c7257db03b638db45fd430d7af19a7aae9b97e7dab53b819e731bbf1b39; hex `763a2027796573270a`.

First difference: 3; complete ranges: `[[3,4],[7,8]]`.

output 9 bytes; SHA-256 8e577c7257db03b638db45fd430d7af19a7aae9b97e7dab53b819e731bbf1b39; hex `763a2027796573270a`.

First difference: 3; complete ranges: `[[3,4],[7,8]]`.

## Y-02-yes-quoted-extended

Original 9 bytes; SHA-256 435b5ca76d944af8203e31bf894479d8e7a667819c6a19d02291d41df3c4d8e6; hex `763a2022796573220a`.

noop 9 bytes; SHA-256 8e577c7257db03b638db45fd430d7af19a7aae9b97e7dab53b819e731bbf1b39; hex `763a2027796573270a`.

First difference: 3; complete ranges: `[[3,4],[7,8]]`.

output 9 bytes; SHA-256 8e577c7257db03b638db45fd430d7af19a7aae9b97e7dab53b819e731bbf1b39; hex `763a2027796573270a`.

First difference: 3; complete ranges: `[[3,4],[7,8]]`.

## Y-02-on-plain-failsafe

Original 6 bytes; SHA-256 2034b0ef0b0f455b9e2bfa8eb34f6750485c97c6db16c9cd41756f73c0e49784; hex `763a206f6e0a`.

noop 8 bytes; SHA-256 da7adb1c00a86fa1d68d95f4d9ebd0f7988c779707b29c74a4179d56895861d3; hex `763a20276f6e270a`.

First difference: 3; complete ranges: `[[3,8]]`.

output 8 bytes; SHA-256 da7adb1c00a86fa1d68d95f4d9ebd0f7988c779707b29c74a4179d56895861d3; hex `763a20276f6e270a`.

First difference: 3; complete ranges: `[[3,8]]`.

## Y-02-on-plain-json

Original 6 bytes; SHA-256 2034b0ef0b0f455b9e2bfa8eb34f6750485c97c6db16c9cd41756f73c0e49784; hex `763a206f6e0a`.

noop 8 bytes; SHA-256 da7adb1c00a86fa1d68d95f4d9ebd0f7988c779707b29c74a4179d56895861d3; hex `763a20276f6e270a`.

First difference: 3; complete ranges: `[[3,8]]`.

output 8 bytes; SHA-256 da7adb1c00a86fa1d68d95f4d9ebd0f7988c779707b29c74a4179d56895861d3; hex `763a20276f6e270a`.

First difference: 3; complete ranges: `[[3,8]]`.

## Y-02-on-plain-core

Original 6 bytes; SHA-256 2034b0ef0b0f455b9e2bfa8eb34f6750485c97c6db16c9cd41756f73c0e49784; hex `763a206f6e0a`.

noop 8 bytes; SHA-256 da7adb1c00a86fa1d68d95f4d9ebd0f7988c779707b29c74a4179d56895861d3; hex `763a20276f6e270a`.

First difference: 3; complete ranges: `[[3,8]]`.

output 8 bytes; SHA-256 da7adb1c00a86fa1d68d95f4d9ebd0f7988c779707b29c74a4179d56895861d3; hex `763a20276f6e270a`.

First difference: 3; complete ranges: `[[3,8]]`.

## Y-02-on-plain-default

Original 6 bytes; SHA-256 2034b0ef0b0f455b9e2bfa8eb34f6750485c97c6db16c9cd41756f73c0e49784; hex `763a206f6e0a`.

noop 8 bytes; SHA-256 da7adb1c00a86fa1d68d95f4d9ebd0f7988c779707b29c74a4179d56895861d3; hex `763a20276f6e270a`.

First difference: 3; complete ranges: `[[3,8]]`.

output 8 bytes; SHA-256 da7adb1c00a86fa1d68d95f4d9ebd0f7988c779707b29c74a4179d56895861d3; hex `763a20276f6e270a`.

First difference: 3; complete ranges: `[[3,8]]`.

## Y-02-on-plain-extended

Original 6 bytes; SHA-256 2034b0ef0b0f455b9e2bfa8eb34f6750485c97c6db16c9cd41756f73c0e49784; hex `763a206f6e0a`.

noop 8 bytes; SHA-256 da7adb1c00a86fa1d68d95f4d9ebd0f7988c779707b29c74a4179d56895861d3; hex `763a20276f6e270a`.

First difference: 3; complete ranges: `[[3,8]]`.

output 8 bytes; SHA-256 da7adb1c00a86fa1d68d95f4d9ebd0f7988c779707b29c74a4179d56895861d3; hex `763a20276f6e270a`.

First difference: 3; complete ranges: `[[3,8]]`.

## Y-02-on-quoted-failsafe

Original 8 bytes; SHA-256 2abff4644071f74f6f64d9e1b1dbd6fc5041f1bcc7369fb1696261b425c50f39; hex `763a20226f6e220a`.

noop 8 bytes; SHA-256 da7adb1c00a86fa1d68d95f4d9ebd0f7988c779707b29c74a4179d56895861d3; hex `763a20276f6e270a`.

First difference: 3; complete ranges: `[[3,4],[6,7]]`.

output 8 bytes; SHA-256 da7adb1c00a86fa1d68d95f4d9ebd0f7988c779707b29c74a4179d56895861d3; hex `763a20276f6e270a`.

First difference: 3; complete ranges: `[[3,4],[6,7]]`.

## Y-02-on-quoted-json

Original 8 bytes; SHA-256 2abff4644071f74f6f64d9e1b1dbd6fc5041f1bcc7369fb1696261b425c50f39; hex `763a20226f6e220a`.

noop 8 bytes; SHA-256 da7adb1c00a86fa1d68d95f4d9ebd0f7988c779707b29c74a4179d56895861d3; hex `763a20276f6e270a`.

First difference: 3; complete ranges: `[[3,4],[6,7]]`.

output 8 bytes; SHA-256 da7adb1c00a86fa1d68d95f4d9ebd0f7988c779707b29c74a4179d56895861d3; hex `763a20276f6e270a`.

First difference: 3; complete ranges: `[[3,4],[6,7]]`.

## Y-02-on-quoted-core

Original 8 bytes; SHA-256 2abff4644071f74f6f64d9e1b1dbd6fc5041f1bcc7369fb1696261b425c50f39; hex `763a20226f6e220a`.

noop 8 bytes; SHA-256 da7adb1c00a86fa1d68d95f4d9ebd0f7988c779707b29c74a4179d56895861d3; hex `763a20276f6e270a`.

First difference: 3; complete ranges: `[[3,4],[6,7]]`.

output 8 bytes; SHA-256 da7adb1c00a86fa1d68d95f4d9ebd0f7988c779707b29c74a4179d56895861d3; hex `763a20276f6e270a`.

First difference: 3; complete ranges: `[[3,4],[6,7]]`.

## Y-02-on-quoted-default

Original 8 bytes; SHA-256 2abff4644071f74f6f64d9e1b1dbd6fc5041f1bcc7369fb1696261b425c50f39; hex `763a20226f6e220a`.

noop 8 bytes; SHA-256 da7adb1c00a86fa1d68d95f4d9ebd0f7988c779707b29c74a4179d56895861d3; hex `763a20276f6e270a`.

First difference: 3; complete ranges: `[[3,4],[6,7]]`.

output 8 bytes; SHA-256 da7adb1c00a86fa1d68d95f4d9ebd0f7988c779707b29c74a4179d56895861d3; hex `763a20276f6e270a`.

First difference: 3; complete ranges: `[[3,4],[6,7]]`.

## Y-02-on-quoted-extended

Original 8 bytes; SHA-256 2abff4644071f74f6f64d9e1b1dbd6fc5041f1bcc7369fb1696261b425c50f39; hex `763a20226f6e220a`.

noop 8 bytes; SHA-256 da7adb1c00a86fa1d68d95f4d9ebd0f7988c779707b29c74a4179d56895861d3; hex `763a20276f6e270a`.

First difference: 3; complete ranges: `[[3,4],[6,7]]`.

output 8 bytes; SHA-256 da7adb1c00a86fa1d68d95f4d9ebd0f7988c779707b29c74a4179d56895861d3; hex `763a20276f6e270a`.

First difference: 3; complete ranges: `[[3,4],[6,7]]`.

## Y-02-true-plain-failsafe

Original 8 bytes; SHA-256 2c1e347619472706a53d016bfe78384812ac751dae8cc935a373482f6a6b6e42; hex `763a20747275650a`.

noop 8 bytes; SHA-256 2c1e347619472706a53d016bfe78384812ac751dae8cc935a373482f6a6b6e42; hex `763a20747275650a`.

First difference: null; complete ranges: `[]`.

output 8 bytes; SHA-256 2c1e347619472706a53d016bfe78384812ac751dae8cc935a373482f6a6b6e42; hex `763a20747275650a`.

First difference: null; complete ranges: `[]`.

## Y-02-true-plain-json

Original 8 bytes; SHA-256 2c1e347619472706a53d016bfe78384812ac751dae8cc935a373482f6a6b6e42; hex `763a20747275650a`.

noop 8 bytes; SHA-256 2c1e347619472706a53d016bfe78384812ac751dae8cc935a373482f6a6b6e42; hex `763a20747275650a`.

First difference: null; complete ranges: `[]`.

output 8 bytes; SHA-256 2c1e347619472706a53d016bfe78384812ac751dae8cc935a373482f6a6b6e42; hex `763a20747275650a`.

First difference: null; complete ranges: `[]`.

## Y-02-true-plain-core

Original 8 bytes; SHA-256 2c1e347619472706a53d016bfe78384812ac751dae8cc935a373482f6a6b6e42; hex `763a20747275650a`.

noop 8 bytes; SHA-256 2c1e347619472706a53d016bfe78384812ac751dae8cc935a373482f6a6b6e42; hex `763a20747275650a`.

First difference: null; complete ranges: `[]`.

output 8 bytes; SHA-256 2c1e347619472706a53d016bfe78384812ac751dae8cc935a373482f6a6b6e42; hex `763a20747275650a`.

First difference: null; complete ranges: `[]`.

## Y-02-true-plain-default

Original 8 bytes; SHA-256 2c1e347619472706a53d016bfe78384812ac751dae8cc935a373482f6a6b6e42; hex `763a20747275650a`.

noop 8 bytes; SHA-256 2c1e347619472706a53d016bfe78384812ac751dae8cc935a373482f6a6b6e42; hex `763a20747275650a`.

First difference: null; complete ranges: `[]`.

output 8 bytes; SHA-256 2c1e347619472706a53d016bfe78384812ac751dae8cc935a373482f6a6b6e42; hex `763a20747275650a`.

First difference: null; complete ranges: `[]`.

## Y-02-true-plain-extended

Original 8 bytes; SHA-256 2c1e347619472706a53d016bfe78384812ac751dae8cc935a373482f6a6b6e42; hex `763a20747275650a`.

noop 8 bytes; SHA-256 2c1e347619472706a53d016bfe78384812ac751dae8cc935a373482f6a6b6e42; hex `763a20747275650a`.

First difference: null; complete ranges: `[]`.

output 8 bytes; SHA-256 2c1e347619472706a53d016bfe78384812ac751dae8cc935a373482f6a6b6e42; hex `763a20747275650a`.

First difference: null; complete ranges: `[]`.

## Y-02-true-quoted-failsafe

Original 10 bytes; SHA-256 710271eca5e6908c4a0d0c1bc206965882d635eb15c199d5bab1a2f2e11d38d6; hex `763a202274727565220a`.

noop 8 bytes; SHA-256 2c1e347619472706a53d016bfe78384812ac751dae8cc935a373482f6a6b6e42; hex `763a20747275650a`.

First difference: 3; complete ranges: `[[3,10]]`.

output 8 bytes; SHA-256 2c1e347619472706a53d016bfe78384812ac751dae8cc935a373482f6a6b6e42; hex `763a20747275650a`.

First difference: 3; complete ranges: `[[3,10]]`.

## Y-02-true-quoted-json

Original 10 bytes; SHA-256 710271eca5e6908c4a0d0c1bc206965882d635eb15c199d5bab1a2f2e11d38d6; hex `763a202274727565220a`.

noop 10 bytes; SHA-256 ff605fc5cf5c7049748217ee1867762980a452880d26f17f1cd73265384f68a5; hex `763a202774727565270a`.

First difference: 3; complete ranges: `[[3,4],[8,9]]`.

output 10 bytes; SHA-256 ff605fc5cf5c7049748217ee1867762980a452880d26f17f1cd73265384f68a5; hex `763a202774727565270a`.

First difference: 3; complete ranges: `[[3,4],[8,9]]`.

## Y-02-true-quoted-core

Original 10 bytes; SHA-256 710271eca5e6908c4a0d0c1bc206965882d635eb15c199d5bab1a2f2e11d38d6; hex `763a202274727565220a`.

noop 10 bytes; SHA-256 ff605fc5cf5c7049748217ee1867762980a452880d26f17f1cd73265384f68a5; hex `763a202774727565270a`.

First difference: 3; complete ranges: `[[3,4],[8,9]]`.

output 10 bytes; SHA-256 ff605fc5cf5c7049748217ee1867762980a452880d26f17f1cd73265384f68a5; hex `763a202774727565270a`.

First difference: 3; complete ranges: `[[3,4],[8,9]]`.

## Y-02-true-quoted-default

Original 10 bytes; SHA-256 710271eca5e6908c4a0d0c1bc206965882d635eb15c199d5bab1a2f2e11d38d6; hex `763a202274727565220a`.

noop 10 bytes; SHA-256 ff605fc5cf5c7049748217ee1867762980a452880d26f17f1cd73265384f68a5; hex `763a202774727565270a`.

First difference: 3; complete ranges: `[[3,4],[8,9]]`.

output 10 bytes; SHA-256 ff605fc5cf5c7049748217ee1867762980a452880d26f17f1cd73265384f68a5; hex `763a202774727565270a`.

First difference: 3; complete ranges: `[[3,4],[8,9]]`.

## Y-02-true-quoted-extended

Original 10 bytes; SHA-256 710271eca5e6908c4a0d0c1bc206965882d635eb15c199d5bab1a2f2e11d38d6; hex `763a202274727565220a`.

noop 10 bytes; SHA-256 ff605fc5cf5c7049748217ee1867762980a452880d26f17f1cd73265384f68a5; hex `763a202774727565270a`.

First difference: 3; complete ranges: `[[3,4],[8,9]]`.

output 10 bytes; SHA-256 ff605fc5cf5c7049748217ee1867762980a452880d26f17f1cd73265384f68a5; hex `763a202774727565270a`.

First difference: 3; complete ranges: `[[3,4],[8,9]]`.

## Y-02-null-plain-failsafe

Original 8 bytes; SHA-256 c3052bf92114314ab4569c9e4109e710e5f0faccf38ca1b0535df25ea6c1e828; hex `763a206e756c6c0a`.

noop 8 bytes; SHA-256 c3052bf92114314ab4569c9e4109e710e5f0faccf38ca1b0535df25ea6c1e828; hex `763a206e756c6c0a`.

First difference: null; complete ranges: `[]`.

output 8 bytes; SHA-256 c3052bf92114314ab4569c9e4109e710e5f0faccf38ca1b0535df25ea6c1e828; hex `763a206e756c6c0a`.

First difference: null; complete ranges: `[]`.

## Y-02-null-plain-json

Original 8 bytes; SHA-256 c3052bf92114314ab4569c9e4109e710e5f0faccf38ca1b0535df25ea6c1e828; hex `763a206e756c6c0a`.

noop 8 bytes; SHA-256 c3052bf92114314ab4569c9e4109e710e5f0faccf38ca1b0535df25ea6c1e828; hex `763a206e756c6c0a`.

First difference: null; complete ranges: `[]`.

output 8 bytes; SHA-256 c3052bf92114314ab4569c9e4109e710e5f0faccf38ca1b0535df25ea6c1e828; hex `763a206e756c6c0a`.

First difference: null; complete ranges: `[]`.

## Y-02-null-plain-core

Original 8 bytes; SHA-256 c3052bf92114314ab4569c9e4109e710e5f0faccf38ca1b0535df25ea6c1e828; hex `763a206e756c6c0a`.

noop 8 bytes; SHA-256 c3052bf92114314ab4569c9e4109e710e5f0faccf38ca1b0535df25ea6c1e828; hex `763a206e756c6c0a`.

First difference: null; complete ranges: `[]`.

output 8 bytes; SHA-256 c3052bf92114314ab4569c9e4109e710e5f0faccf38ca1b0535df25ea6c1e828; hex `763a206e756c6c0a`.

First difference: null; complete ranges: `[]`.

## Y-02-null-plain-default

Original 8 bytes; SHA-256 c3052bf92114314ab4569c9e4109e710e5f0faccf38ca1b0535df25ea6c1e828; hex `763a206e756c6c0a`.

noop 8 bytes; SHA-256 c3052bf92114314ab4569c9e4109e710e5f0faccf38ca1b0535df25ea6c1e828; hex `763a206e756c6c0a`.

First difference: null; complete ranges: `[]`.

output 8 bytes; SHA-256 c3052bf92114314ab4569c9e4109e710e5f0faccf38ca1b0535df25ea6c1e828; hex `763a206e756c6c0a`.

First difference: null; complete ranges: `[]`.

## Y-02-null-plain-extended

Original 8 bytes; SHA-256 c3052bf92114314ab4569c9e4109e710e5f0faccf38ca1b0535df25ea6c1e828; hex `763a206e756c6c0a`.

noop 8 bytes; SHA-256 c3052bf92114314ab4569c9e4109e710e5f0faccf38ca1b0535df25ea6c1e828; hex `763a206e756c6c0a`.

First difference: null; complete ranges: `[]`.

output 8 bytes; SHA-256 c3052bf92114314ab4569c9e4109e710e5f0faccf38ca1b0535df25ea6c1e828; hex `763a206e756c6c0a`.

First difference: null; complete ranges: `[]`.

## Y-02-null-quoted-failsafe

Original 10 bytes; SHA-256 a85c3c16a9fe12d0026d3bef572f96697155aaf04bf639ef92b0954bbb4d3b3b; hex `763a20226e756c6c220a`.

noop 8 bytes; SHA-256 c3052bf92114314ab4569c9e4109e710e5f0faccf38ca1b0535df25ea6c1e828; hex `763a206e756c6c0a`.

First difference: 3; complete ranges: `[[3,6],[7,10]]`.

output 8 bytes; SHA-256 c3052bf92114314ab4569c9e4109e710e5f0faccf38ca1b0535df25ea6c1e828; hex `763a206e756c6c0a`.

First difference: 3; complete ranges: `[[3,6],[7,10]]`.

## Y-02-null-quoted-json

Original 10 bytes; SHA-256 a85c3c16a9fe12d0026d3bef572f96697155aaf04bf639ef92b0954bbb4d3b3b; hex `763a20226e756c6c220a`.

noop 10 bytes; SHA-256 45750383ad3489a61e36be8108c1e99f3853c5c56a8fc84f9da273aa5650331a; hex `763a20276e756c6c270a`.

First difference: 3; complete ranges: `[[3,4],[8,9]]`.

output 10 bytes; SHA-256 45750383ad3489a61e36be8108c1e99f3853c5c56a8fc84f9da273aa5650331a; hex `763a20276e756c6c270a`.

First difference: 3; complete ranges: `[[3,4],[8,9]]`.

## Y-02-null-quoted-core

Original 10 bytes; SHA-256 a85c3c16a9fe12d0026d3bef572f96697155aaf04bf639ef92b0954bbb4d3b3b; hex `763a20226e756c6c220a`.

noop 10 bytes; SHA-256 45750383ad3489a61e36be8108c1e99f3853c5c56a8fc84f9da273aa5650331a; hex `763a20276e756c6c270a`.

First difference: 3; complete ranges: `[[3,4],[8,9]]`.

output 10 bytes; SHA-256 45750383ad3489a61e36be8108c1e99f3853c5c56a8fc84f9da273aa5650331a; hex `763a20276e756c6c270a`.

First difference: 3; complete ranges: `[[3,4],[8,9]]`.

## Y-02-null-quoted-default

Original 10 bytes; SHA-256 a85c3c16a9fe12d0026d3bef572f96697155aaf04bf639ef92b0954bbb4d3b3b; hex `763a20226e756c6c220a`.

noop 10 bytes; SHA-256 45750383ad3489a61e36be8108c1e99f3853c5c56a8fc84f9da273aa5650331a; hex `763a20276e756c6c270a`.

First difference: 3; complete ranges: `[[3,4],[8,9]]`.

output 10 bytes; SHA-256 45750383ad3489a61e36be8108c1e99f3853c5c56a8fc84f9da273aa5650331a; hex `763a20276e756c6c270a`.

First difference: 3; complete ranges: `[[3,4],[8,9]]`.

## Y-02-null-quoted-extended

Original 10 bytes; SHA-256 a85c3c16a9fe12d0026d3bef572f96697155aaf04bf639ef92b0954bbb4d3b3b; hex `763a20226e756c6c220a`.

noop 10 bytes; SHA-256 45750383ad3489a61e36be8108c1e99f3853c5c56a8fc84f9da273aa5650331a; hex `763a20276e756c6c270a`.

First difference: 3; complete ranges: `[[3,4],[8,9]]`.

output 10 bytes; SHA-256 45750383ad3489a61e36be8108c1e99f3853c5c56a8fc84f9da273aa5650331a; hex `763a20276e756c6c270a`.

First difference: 3; complete ranges: `[[3,4],[8,9]]`.

## Y-02-tilde-plain-failsafe

Original 5 bytes; SHA-256 87cae7466545451a26251f9c357be3a165c124762cf5fc09149d9aed4d20ac58; hex `763a207e0a`.

noop 5 bytes; SHA-256 87cae7466545451a26251f9c357be3a165c124762cf5fc09149d9aed4d20ac58; hex `763a207e0a`.

First difference: null; complete ranges: `[]`.

output 5 bytes; SHA-256 87cae7466545451a26251f9c357be3a165c124762cf5fc09149d9aed4d20ac58; hex `763a207e0a`.

First difference: null; complete ranges: `[]`.

## Y-02-tilde-plain-json

Original 5 bytes; SHA-256 87cae7466545451a26251f9c357be3a165c124762cf5fc09149d9aed4d20ac58; hex `763a207e0a`.

noop 8 bytes; SHA-256 c3052bf92114314ab4569c9e4109e710e5f0faccf38ca1b0535df25ea6c1e828; hex `763a206e756c6c0a`.

First difference: 3; complete ranges: `[[3,8]]`.

output 8 bytes; SHA-256 c3052bf92114314ab4569c9e4109e710e5f0faccf38ca1b0535df25ea6c1e828; hex `763a206e756c6c0a`.

First difference: 3; complete ranges: `[[3,8]]`.

## Y-02-tilde-plain-core

Original 5 bytes; SHA-256 87cae7466545451a26251f9c357be3a165c124762cf5fc09149d9aed4d20ac58; hex `763a207e0a`.

noop 8 bytes; SHA-256 c3052bf92114314ab4569c9e4109e710e5f0faccf38ca1b0535df25ea6c1e828; hex `763a206e756c6c0a`.

First difference: 3; complete ranges: `[[3,8]]`.

output 8 bytes; SHA-256 c3052bf92114314ab4569c9e4109e710e5f0faccf38ca1b0535df25ea6c1e828; hex `763a206e756c6c0a`.

First difference: 3; complete ranges: `[[3,8]]`.

## Y-02-tilde-plain-default

Original 5 bytes; SHA-256 87cae7466545451a26251f9c357be3a165c124762cf5fc09149d9aed4d20ac58; hex `763a207e0a`.

noop 8 bytes; SHA-256 c3052bf92114314ab4569c9e4109e710e5f0faccf38ca1b0535df25ea6c1e828; hex `763a206e756c6c0a`.

First difference: 3; complete ranges: `[[3,8]]`.

output 8 bytes; SHA-256 c3052bf92114314ab4569c9e4109e710e5f0faccf38ca1b0535df25ea6c1e828; hex `763a206e756c6c0a`.

First difference: 3; complete ranges: `[[3,8]]`.

## Y-02-tilde-plain-extended

Original 5 bytes; SHA-256 87cae7466545451a26251f9c357be3a165c124762cf5fc09149d9aed4d20ac58; hex `763a207e0a`.

noop 8 bytes; SHA-256 c3052bf92114314ab4569c9e4109e710e5f0faccf38ca1b0535df25ea6c1e828; hex `763a206e756c6c0a`.

First difference: 3; complete ranges: `[[3,8]]`.

output 8 bytes; SHA-256 c3052bf92114314ab4569c9e4109e710e5f0faccf38ca1b0535df25ea6c1e828; hex `763a206e756c6c0a`.

First difference: 3; complete ranges: `[[3,8]]`.

## Y-02-tilde-quoted-failsafe

Original 7 bytes; SHA-256 c398501dbf9534abb5e4adf9d2875c02758e8ebeeb71e7dff8417f00735c6626; hex `763a20227e220a`.

noop 5 bytes; SHA-256 87cae7466545451a26251f9c357be3a165c124762cf5fc09149d9aed4d20ac58; hex `763a207e0a`.

First difference: 3; complete ranges: `[[3,7]]`.

output 5 bytes; SHA-256 87cae7466545451a26251f9c357be3a165c124762cf5fc09149d9aed4d20ac58; hex `763a207e0a`.

First difference: 3; complete ranges: `[[3,7]]`.

## Y-02-tilde-quoted-json

Original 7 bytes; SHA-256 c398501dbf9534abb5e4adf9d2875c02758e8ebeeb71e7dff8417f00735c6626; hex `763a20227e220a`.

noop 7 bytes; SHA-256 562f8b55cce6748278b86249c4f450278ed2be70d8736e88b4afea90e142ae8f; hex `763a20277e270a`.

First difference: 3; complete ranges: `[[3,4],[5,6]]`.

output 7 bytes; SHA-256 562f8b55cce6748278b86249c4f450278ed2be70d8736e88b4afea90e142ae8f; hex `763a20277e270a`.

First difference: 3; complete ranges: `[[3,4],[5,6]]`.

## Y-02-tilde-quoted-core

Original 7 bytes; SHA-256 c398501dbf9534abb5e4adf9d2875c02758e8ebeeb71e7dff8417f00735c6626; hex `763a20227e220a`.

noop 7 bytes; SHA-256 562f8b55cce6748278b86249c4f450278ed2be70d8736e88b4afea90e142ae8f; hex `763a20277e270a`.

First difference: 3; complete ranges: `[[3,4],[5,6]]`.

output 7 bytes; SHA-256 562f8b55cce6748278b86249c4f450278ed2be70d8736e88b4afea90e142ae8f; hex `763a20277e270a`.

First difference: 3; complete ranges: `[[3,4],[5,6]]`.

## Y-02-tilde-quoted-default

Original 7 bytes; SHA-256 c398501dbf9534abb5e4adf9d2875c02758e8ebeeb71e7dff8417f00735c6626; hex `763a20227e220a`.

noop 7 bytes; SHA-256 562f8b55cce6748278b86249c4f450278ed2be70d8736e88b4afea90e142ae8f; hex `763a20277e270a`.

First difference: 3; complete ranges: `[[3,4],[5,6]]`.

output 7 bytes; SHA-256 562f8b55cce6748278b86249c4f450278ed2be70d8736e88b4afea90e142ae8f; hex `763a20277e270a`.

First difference: 3; complete ranges: `[[3,4],[5,6]]`.

## Y-02-tilde-quoted-extended

Original 7 bytes; SHA-256 c398501dbf9534abb5e4adf9d2875c02758e8ebeeb71e7dff8417f00735c6626; hex `763a20227e220a`.

noop 7 bytes; SHA-256 562f8b55cce6748278b86249c4f450278ed2be70d8736e88b4afea90e142ae8f; hex `763a20277e270a`.

First difference: 3; complete ranges: `[[3,4],[5,6]]`.

output 7 bytes; SHA-256 562f8b55cce6748278b86249c4f450278ed2be70d8736e88b4afea90e142ae8f; hex `763a20277e270a`.

First difference: 3; complete ranges: `[[3,4],[5,6]]`.

## Y-02-empty-plain-failsafe

Original 4 bytes; SHA-256 667d0be5dd289803fc3efe5109eeeb71c0af310b783658feaacc50dec9882f9d; hex `763a200a`.

noop: unavailable; status stringify-rejected.

output: unavailable; status stringify-rejected.

## Y-02-empty-plain-json

Original 4 bytes; SHA-256 667d0be5dd289803fc3efe5109eeeb71c0af310b783658feaacc50dec9882f9d; hex `763a200a`.

noop 8 bytes; SHA-256 c3052bf92114314ab4569c9e4109e710e5f0faccf38ca1b0535df25ea6c1e828; hex `763a206e756c6c0a`.

First difference: 3; complete ranges: `[[3,8]]`.

output 8 bytes; SHA-256 c3052bf92114314ab4569c9e4109e710e5f0faccf38ca1b0535df25ea6c1e828; hex `763a206e756c6c0a`.

First difference: 3; complete ranges: `[[3,8]]`.

## Y-02-empty-plain-core

Original 4 bytes; SHA-256 667d0be5dd289803fc3efe5109eeeb71c0af310b783658feaacc50dec9882f9d; hex `763a200a`.

noop 8 bytes; SHA-256 c3052bf92114314ab4569c9e4109e710e5f0faccf38ca1b0535df25ea6c1e828; hex `763a206e756c6c0a`.

First difference: 3; complete ranges: `[[3,8]]`.

output 8 bytes; SHA-256 c3052bf92114314ab4569c9e4109e710e5f0faccf38ca1b0535df25ea6c1e828; hex `763a206e756c6c0a`.

First difference: 3; complete ranges: `[[3,8]]`.

## Y-02-empty-plain-default

Original 4 bytes; SHA-256 667d0be5dd289803fc3efe5109eeeb71c0af310b783658feaacc50dec9882f9d; hex `763a200a`.

noop 8 bytes; SHA-256 c3052bf92114314ab4569c9e4109e710e5f0faccf38ca1b0535df25ea6c1e828; hex `763a206e756c6c0a`.

First difference: 3; complete ranges: `[[3,8]]`.

output 8 bytes; SHA-256 c3052bf92114314ab4569c9e4109e710e5f0faccf38ca1b0535df25ea6c1e828; hex `763a206e756c6c0a`.

First difference: 3; complete ranges: `[[3,8]]`.

## Y-02-empty-plain-extended

Original 4 bytes; SHA-256 667d0be5dd289803fc3efe5109eeeb71c0af310b783658feaacc50dec9882f9d; hex `763a200a`.

noop 8 bytes; SHA-256 c3052bf92114314ab4569c9e4109e710e5f0faccf38ca1b0535df25ea6c1e828; hex `763a206e756c6c0a`.

First difference: 3; complete ranges: `[[3,8]]`.

output 8 bytes; SHA-256 c3052bf92114314ab4569c9e4109e710e5f0faccf38ca1b0535df25ea6c1e828; hex `763a206e756c6c0a`.

First difference: 3; complete ranges: `[[3,8]]`.

## Y-02-empty-quoted-failsafe

Original 6 bytes; SHA-256 5cea338e0e9d07265097a3b0b13467533b31624b1cae2192b6e4edf40b20b66c; hex `763a2022220a`.

noop 6 bytes; SHA-256 5e9fe2754b0686375407d380d5d9b066cbebe98c8d7788924055789d18278a78; hex `763a2027270a`.

First difference: 3; complete ranges: `[[3,5]]`.

output 6 bytes; SHA-256 5e9fe2754b0686375407d380d5d9b066cbebe98c8d7788924055789d18278a78; hex `763a2027270a`.

First difference: 3; complete ranges: `[[3,5]]`.

## Y-02-empty-quoted-json

Original 6 bytes; SHA-256 5cea338e0e9d07265097a3b0b13467533b31624b1cae2192b6e4edf40b20b66c; hex `763a2022220a`.

noop 6 bytes; SHA-256 5e9fe2754b0686375407d380d5d9b066cbebe98c8d7788924055789d18278a78; hex `763a2027270a`.

First difference: 3; complete ranges: `[[3,5]]`.

output 6 bytes; SHA-256 5e9fe2754b0686375407d380d5d9b066cbebe98c8d7788924055789d18278a78; hex `763a2027270a`.

First difference: 3; complete ranges: `[[3,5]]`.

## Y-02-empty-quoted-core

Original 6 bytes; SHA-256 5cea338e0e9d07265097a3b0b13467533b31624b1cae2192b6e4edf40b20b66c; hex `763a2022220a`.

noop 6 bytes; SHA-256 5e9fe2754b0686375407d380d5d9b066cbebe98c8d7788924055789d18278a78; hex `763a2027270a`.

First difference: 3; complete ranges: `[[3,5]]`.

output 6 bytes; SHA-256 5e9fe2754b0686375407d380d5d9b066cbebe98c8d7788924055789d18278a78; hex `763a2027270a`.

First difference: 3; complete ranges: `[[3,5]]`.

## Y-02-empty-quoted-default

Original 6 bytes; SHA-256 5cea338e0e9d07265097a3b0b13467533b31624b1cae2192b6e4edf40b20b66c; hex `763a2022220a`.

noop 6 bytes; SHA-256 5e9fe2754b0686375407d380d5d9b066cbebe98c8d7788924055789d18278a78; hex `763a2027270a`.

First difference: 3; complete ranges: `[[3,5]]`.

output 6 bytes; SHA-256 5e9fe2754b0686375407d380d5d9b066cbebe98c8d7788924055789d18278a78; hex `763a2027270a`.

First difference: 3; complete ranges: `[[3,5]]`.

## Y-02-empty-quoted-extended

Original 6 bytes; SHA-256 5cea338e0e9d07265097a3b0b13467533b31624b1cae2192b6e4edf40b20b66c; hex `763a2022220a`.

noop 6 bytes; SHA-256 5e9fe2754b0686375407d380d5d9b066cbebe98c8d7788924055789d18278a78; hex `763a2027270a`.

First difference: 3; complete ranges: `[[3,5]]`.

output 6 bytes; SHA-256 5e9fe2754b0686375407d380d5d9b066cbebe98c8d7788924055789d18278a78; hex `763a2027270a`.

First difference: 3; complete ranges: `[[3,5]]`.

## Y-02-012-plain-failsafe

Original 7 bytes; SHA-256 06b9dfb343e3374e91a1ec918f1428e2703dc322e0092c895bac14c847930add; hex `763a203031320a`.

noop 7 bytes; SHA-256 06b9dfb343e3374e91a1ec918f1428e2703dc322e0092c895bac14c847930add; hex `763a203031320a`.

First difference: null; complete ranges: `[]`.

output 7 bytes; SHA-256 06b9dfb343e3374e91a1ec918f1428e2703dc322e0092c895bac14c847930add; hex `763a203031320a`.

First difference: null; complete ranges: `[]`.

## Y-02-012-plain-json

Original 7 bytes; SHA-256 06b9dfb343e3374e91a1ec918f1428e2703dc322e0092c895bac14c847930add; hex `763a203031320a`.

noop 6 bytes; SHA-256 8f948552e02cd8f4dc3356c7ce26789618b720c1c1685055381c1964fbbe8b5f; hex `763a2031300a`.

First difference: 3; complete ranges: `[[3,7]]`.

output 6 bytes; SHA-256 8f948552e02cd8f4dc3356c7ce26789618b720c1c1685055381c1964fbbe8b5f; hex `763a2031300a`.

First difference: 3; complete ranges: `[[3,7]]`.

## Y-02-012-plain-core

Original 7 bytes; SHA-256 06b9dfb343e3374e91a1ec918f1428e2703dc322e0092c895bac14c847930add; hex `763a203031320a`.

noop 6 bytes; SHA-256 8f948552e02cd8f4dc3356c7ce26789618b720c1c1685055381c1964fbbe8b5f; hex `763a2031300a`.

First difference: 3; complete ranges: `[[3,7]]`.

output 6 bytes; SHA-256 8f948552e02cd8f4dc3356c7ce26789618b720c1c1685055381c1964fbbe8b5f; hex `763a2031300a`.

First difference: 3; complete ranges: `[[3,7]]`.

## Y-02-012-plain-default

Original 7 bytes; SHA-256 06b9dfb343e3374e91a1ec918f1428e2703dc322e0092c895bac14c847930add; hex `763a203031320a`.

noop 6 bytes; SHA-256 8f948552e02cd8f4dc3356c7ce26789618b720c1c1685055381c1964fbbe8b5f; hex `763a2031300a`.

First difference: 3; complete ranges: `[[3,7]]`.

output 6 bytes; SHA-256 8f948552e02cd8f4dc3356c7ce26789618b720c1c1685055381c1964fbbe8b5f; hex `763a2031300a`.

First difference: 3; complete ranges: `[[3,7]]`.

## Y-02-012-plain-extended

Original 7 bytes; SHA-256 06b9dfb343e3374e91a1ec918f1428e2703dc322e0092c895bac14c847930add; hex `763a203031320a`.

noop 6 bytes; SHA-256 8f948552e02cd8f4dc3356c7ce26789618b720c1c1685055381c1964fbbe8b5f; hex `763a2031300a`.

First difference: 3; complete ranges: `[[3,7]]`.

output 6 bytes; SHA-256 8f948552e02cd8f4dc3356c7ce26789618b720c1c1685055381c1964fbbe8b5f; hex `763a2031300a`.

First difference: 3; complete ranges: `[[3,7]]`.

## Y-02-012-quoted-failsafe

Original 9 bytes; SHA-256 216ab3509f0121e91343221a44b4dfaf7f0ed52e17576749f0a346307ef17185; hex `763a2022303132220a`.

noop 7 bytes; SHA-256 06b9dfb343e3374e91a1ec918f1428e2703dc322e0092c895bac14c847930add; hex `763a203031320a`.

First difference: 3; complete ranges: `[[3,9]]`.

output 7 bytes; SHA-256 06b9dfb343e3374e91a1ec918f1428e2703dc322e0092c895bac14c847930add; hex `763a203031320a`.

First difference: 3; complete ranges: `[[3,9]]`.

## Y-02-012-quoted-json

Original 9 bytes; SHA-256 216ab3509f0121e91343221a44b4dfaf7f0ed52e17576749f0a346307ef17185; hex `763a2022303132220a`.

noop 9 bytes; SHA-256 1c82afc5b0fd310aad4e8f58df1afaa2f2bf4e37c8e19f7a993f79ee8993557f; hex `763a2027303132270a`.

First difference: 3; complete ranges: `[[3,4],[7,8]]`.

output 9 bytes; SHA-256 1c82afc5b0fd310aad4e8f58df1afaa2f2bf4e37c8e19f7a993f79ee8993557f; hex `763a2027303132270a`.

First difference: 3; complete ranges: `[[3,4],[7,8]]`.

## Y-02-012-quoted-core

Original 9 bytes; SHA-256 216ab3509f0121e91343221a44b4dfaf7f0ed52e17576749f0a346307ef17185; hex `763a2022303132220a`.

noop 9 bytes; SHA-256 1c82afc5b0fd310aad4e8f58df1afaa2f2bf4e37c8e19f7a993f79ee8993557f; hex `763a2027303132270a`.

First difference: 3; complete ranges: `[[3,4],[7,8]]`.

output 9 bytes; SHA-256 1c82afc5b0fd310aad4e8f58df1afaa2f2bf4e37c8e19f7a993f79ee8993557f; hex `763a2027303132270a`.

First difference: 3; complete ranges: `[[3,4],[7,8]]`.

## Y-02-012-quoted-default

Original 9 bytes; SHA-256 216ab3509f0121e91343221a44b4dfaf7f0ed52e17576749f0a346307ef17185; hex `763a2022303132220a`.

noop 9 bytes; SHA-256 1c82afc5b0fd310aad4e8f58df1afaa2f2bf4e37c8e19f7a993f79ee8993557f; hex `763a2027303132270a`.

First difference: 3; complete ranges: `[[3,4],[7,8]]`.

output 9 bytes; SHA-256 1c82afc5b0fd310aad4e8f58df1afaa2f2bf4e37c8e19f7a993f79ee8993557f; hex `763a2027303132270a`.

First difference: 3; complete ranges: `[[3,4],[7,8]]`.

## Y-02-012-quoted-extended

Original 9 bytes; SHA-256 216ab3509f0121e91343221a44b4dfaf7f0ed52e17576749f0a346307ef17185; hex `763a2022303132220a`.

noop 9 bytes; SHA-256 1c82afc5b0fd310aad4e8f58df1afaa2f2bf4e37c8e19f7a993f79ee8993557f; hex `763a2027303132270a`.

First difference: 3; complete ranges: `[[3,4],[7,8]]`.

output 9 bytes; SHA-256 1c82afc5b0fd310aad4e8f58df1afaa2f2bf4e37c8e19f7a993f79ee8993557f; hex `763a2027303132270a`.

First difference: 3; complete ranges: `[[3,4],[7,8]]`.

## Y-02-0o12-plain-failsafe

Original 8 bytes; SHA-256 a13f332af0fcb2ec37885484944f3383b980b3b0cb811bdd5523bd32aa1563bd; hex `763a20306f31320a`.

noop 8 bytes; SHA-256 a13f332af0fcb2ec37885484944f3383b980b3b0cb811bdd5523bd32aa1563bd; hex `763a20306f31320a`.

First difference: null; complete ranges: `[]`.

output 8 bytes; SHA-256 a13f332af0fcb2ec37885484944f3383b980b3b0cb811bdd5523bd32aa1563bd; hex `763a20306f31320a`.

First difference: null; complete ranges: `[]`.

## Y-02-0o12-plain-json

Original 8 bytes; SHA-256 a13f332af0fcb2ec37885484944f3383b980b3b0cb811bdd5523bd32aa1563bd; hex `763a20306f31320a`.

noop 8 bytes; SHA-256 a13f332af0fcb2ec37885484944f3383b980b3b0cb811bdd5523bd32aa1563bd; hex `763a20306f31320a`.

First difference: null; complete ranges: `[]`.

output 8 bytes; SHA-256 a13f332af0fcb2ec37885484944f3383b980b3b0cb811bdd5523bd32aa1563bd; hex `763a20306f31320a`.

First difference: null; complete ranges: `[]`.

## Y-02-0o12-plain-core

Original 8 bytes; SHA-256 a13f332af0fcb2ec37885484944f3383b980b3b0cb811bdd5523bd32aa1563bd; hex `763a20306f31320a`.

noop 8 bytes; SHA-256 a13f332af0fcb2ec37885484944f3383b980b3b0cb811bdd5523bd32aa1563bd; hex `763a20306f31320a`.

First difference: null; complete ranges: `[]`.

output 8 bytes; SHA-256 a13f332af0fcb2ec37885484944f3383b980b3b0cb811bdd5523bd32aa1563bd; hex `763a20306f31320a`.

First difference: null; complete ranges: `[]`.

## Y-02-0o12-plain-default

Original 8 bytes; SHA-256 a13f332af0fcb2ec37885484944f3383b980b3b0cb811bdd5523bd32aa1563bd; hex `763a20306f31320a`.

noop 8 bytes; SHA-256 a13f332af0fcb2ec37885484944f3383b980b3b0cb811bdd5523bd32aa1563bd; hex `763a20306f31320a`.

First difference: null; complete ranges: `[]`.

output 8 bytes; SHA-256 a13f332af0fcb2ec37885484944f3383b980b3b0cb811bdd5523bd32aa1563bd; hex `763a20306f31320a`.

First difference: null; complete ranges: `[]`.

## Y-02-0o12-plain-extended

Original 8 bytes; SHA-256 a13f332af0fcb2ec37885484944f3383b980b3b0cb811bdd5523bd32aa1563bd; hex `763a20306f31320a`.

noop 8 bytes; SHA-256 a13f332af0fcb2ec37885484944f3383b980b3b0cb811bdd5523bd32aa1563bd; hex `763a20306f31320a`.

First difference: null; complete ranges: `[]`.

output 8 bytes; SHA-256 a13f332af0fcb2ec37885484944f3383b980b3b0cb811bdd5523bd32aa1563bd; hex `763a20306f31320a`.

First difference: null; complete ranges: `[]`.

## Y-02-0o12-quoted-failsafe

Original 10 bytes; SHA-256 ff76ad24c7048e2406053af2a708bb9fd60039fea26b347d0c8b3892c2589d89; hex `763a2022306f3132220a`.

noop 8 bytes; SHA-256 a13f332af0fcb2ec37885484944f3383b980b3b0cb811bdd5523bd32aa1563bd; hex `763a20306f31320a`.

First difference: 3; complete ranges: `[[3,10]]`.

output 8 bytes; SHA-256 a13f332af0fcb2ec37885484944f3383b980b3b0cb811bdd5523bd32aa1563bd; hex `763a20306f31320a`.

First difference: 3; complete ranges: `[[3,10]]`.

## Y-02-0o12-quoted-json

Original 10 bytes; SHA-256 ff76ad24c7048e2406053af2a708bb9fd60039fea26b347d0c8b3892c2589d89; hex `763a2022306f3132220a`.

noop 8 bytes; SHA-256 a13f332af0fcb2ec37885484944f3383b980b3b0cb811bdd5523bd32aa1563bd; hex `763a20306f31320a`.

First difference: 3; complete ranges: `[[3,10]]`.

output 8 bytes; SHA-256 a13f332af0fcb2ec37885484944f3383b980b3b0cb811bdd5523bd32aa1563bd; hex `763a20306f31320a`.

First difference: 3; complete ranges: `[[3,10]]`.

## Y-02-0o12-quoted-core

Original 10 bytes; SHA-256 ff76ad24c7048e2406053af2a708bb9fd60039fea26b347d0c8b3892c2589d89; hex `763a2022306f3132220a`.

noop 8 bytes; SHA-256 a13f332af0fcb2ec37885484944f3383b980b3b0cb811bdd5523bd32aa1563bd; hex `763a20306f31320a`.

First difference: 3; complete ranges: `[[3,10]]`.

output 8 bytes; SHA-256 a13f332af0fcb2ec37885484944f3383b980b3b0cb811bdd5523bd32aa1563bd; hex `763a20306f31320a`.

First difference: 3; complete ranges: `[[3,10]]`.

## Y-02-0o12-quoted-default

Original 10 bytes; SHA-256 ff76ad24c7048e2406053af2a708bb9fd60039fea26b347d0c8b3892c2589d89; hex `763a2022306f3132220a`.

noop 8 bytes; SHA-256 a13f332af0fcb2ec37885484944f3383b980b3b0cb811bdd5523bd32aa1563bd; hex `763a20306f31320a`.

First difference: 3; complete ranges: `[[3,10]]`.

output 8 bytes; SHA-256 a13f332af0fcb2ec37885484944f3383b980b3b0cb811bdd5523bd32aa1563bd; hex `763a20306f31320a`.

First difference: 3; complete ranges: `[[3,10]]`.

## Y-02-0o12-quoted-extended

Original 10 bytes; SHA-256 ff76ad24c7048e2406053af2a708bb9fd60039fea26b347d0c8b3892c2589d89; hex `763a2022306f3132220a`.

noop 8 bytes; SHA-256 a13f332af0fcb2ec37885484944f3383b980b3b0cb811bdd5523bd32aa1563bd; hex `763a20306f31320a`.

First difference: 3; complete ranges: `[[3,10]]`.

output 8 bytes; SHA-256 a13f332af0fcb2ec37885484944f3383b980b3b0cb811bdd5523bd32aa1563bd; hex `763a20306f31320a`.

First difference: 3; complete ranges: `[[3,10]]`.

## Y-02-.nan-plain-failsafe

Original 8 bytes; SHA-256 100dc2be0b7f7ac8516598ffbf1a93f68e3781cc11b6c50e872786e96630a331; hex `763a202e6e616e0a`.

noop 8 bytes; SHA-256 100dc2be0b7f7ac8516598ffbf1a93f68e3781cc11b6c50e872786e96630a331; hex `763a202e6e616e0a`.

First difference: null; complete ranges: `[]`.

output 8 bytes; SHA-256 100dc2be0b7f7ac8516598ffbf1a93f68e3781cc11b6c50e872786e96630a331; hex `763a202e6e616e0a`.

First difference: null; complete ranges: `[]`.

## Y-02-.nan-plain-json

Original 8 bytes; SHA-256 100dc2be0b7f7ac8516598ffbf1a93f68e3781cc11b6c50e872786e96630a331; hex `763a202e6e616e0a`.

noop 8 bytes; SHA-256 100dc2be0b7f7ac8516598ffbf1a93f68e3781cc11b6c50e872786e96630a331; hex `763a202e6e616e0a`.

First difference: null; complete ranges: `[]`.

output 8 bytes; SHA-256 100dc2be0b7f7ac8516598ffbf1a93f68e3781cc11b6c50e872786e96630a331; hex `763a202e6e616e0a`.

First difference: null; complete ranges: `[]`.

## Y-02-.nan-plain-core

Original 8 bytes; SHA-256 100dc2be0b7f7ac8516598ffbf1a93f68e3781cc11b6c50e872786e96630a331; hex `763a202e6e616e0a`.

noop 8 bytes; SHA-256 100dc2be0b7f7ac8516598ffbf1a93f68e3781cc11b6c50e872786e96630a331; hex `763a202e6e616e0a`.

First difference: null; complete ranges: `[]`.

output 8 bytes; SHA-256 100dc2be0b7f7ac8516598ffbf1a93f68e3781cc11b6c50e872786e96630a331; hex `763a202e6e616e0a`.

First difference: null; complete ranges: `[]`.

## Y-02-.nan-plain-default

Original 8 bytes; SHA-256 100dc2be0b7f7ac8516598ffbf1a93f68e3781cc11b6c50e872786e96630a331; hex `763a202e6e616e0a`.

noop 8 bytes; SHA-256 100dc2be0b7f7ac8516598ffbf1a93f68e3781cc11b6c50e872786e96630a331; hex `763a202e6e616e0a`.

First difference: null; complete ranges: `[]`.

output 8 bytes; SHA-256 100dc2be0b7f7ac8516598ffbf1a93f68e3781cc11b6c50e872786e96630a331; hex `763a202e6e616e0a`.

First difference: null; complete ranges: `[]`.

## Y-02-.nan-plain-extended

Original 8 bytes; SHA-256 100dc2be0b7f7ac8516598ffbf1a93f68e3781cc11b6c50e872786e96630a331; hex `763a202e6e616e0a`.

noop 8 bytes; SHA-256 100dc2be0b7f7ac8516598ffbf1a93f68e3781cc11b6c50e872786e96630a331; hex `763a202e6e616e0a`.

First difference: null; complete ranges: `[]`.

output 8 bytes; SHA-256 100dc2be0b7f7ac8516598ffbf1a93f68e3781cc11b6c50e872786e96630a331; hex `763a202e6e616e0a`.

First difference: null; complete ranges: `[]`.

## Y-02-.nan-quoted-failsafe

Original 10 bytes; SHA-256 d890677f9ec88dfeab0009b8743b134c1025c5378ecf53311e340d187c7d2027; hex `763a20222e6e616e220a`.

noop 8 bytes; SHA-256 100dc2be0b7f7ac8516598ffbf1a93f68e3781cc11b6c50e872786e96630a331; hex `763a202e6e616e0a`.

First difference: 3; complete ranges: `[[3,10]]`.

output 8 bytes; SHA-256 100dc2be0b7f7ac8516598ffbf1a93f68e3781cc11b6c50e872786e96630a331; hex `763a202e6e616e0a`.

First difference: 3; complete ranges: `[[3,10]]`.

## Y-02-.nan-quoted-json

Original 10 bytes; SHA-256 d890677f9ec88dfeab0009b8743b134c1025c5378ecf53311e340d187c7d2027; hex `763a20222e6e616e220a`.

noop 10 bytes; SHA-256 b2993325b2d318c61bbdc34ba479e83ef3459d05e2447e65874ac0b90c975fcf; hex `763a20272e6e616e270a`.

First difference: 3; complete ranges: `[[3,4],[8,9]]`.

output 10 bytes; SHA-256 b2993325b2d318c61bbdc34ba479e83ef3459d05e2447e65874ac0b90c975fcf; hex `763a20272e6e616e270a`.

First difference: 3; complete ranges: `[[3,4],[8,9]]`.

## Y-02-.nan-quoted-core

Original 10 bytes; SHA-256 d890677f9ec88dfeab0009b8743b134c1025c5378ecf53311e340d187c7d2027; hex `763a20222e6e616e220a`.

noop 10 bytes; SHA-256 b2993325b2d318c61bbdc34ba479e83ef3459d05e2447e65874ac0b90c975fcf; hex `763a20272e6e616e270a`.

First difference: 3; complete ranges: `[[3,4],[8,9]]`.

output 10 bytes; SHA-256 b2993325b2d318c61bbdc34ba479e83ef3459d05e2447e65874ac0b90c975fcf; hex `763a20272e6e616e270a`.

First difference: 3; complete ranges: `[[3,4],[8,9]]`.

## Y-02-.nan-quoted-default

Original 10 bytes; SHA-256 d890677f9ec88dfeab0009b8743b134c1025c5378ecf53311e340d187c7d2027; hex `763a20222e6e616e220a`.

noop 10 bytes; SHA-256 b2993325b2d318c61bbdc34ba479e83ef3459d05e2447e65874ac0b90c975fcf; hex `763a20272e6e616e270a`.

First difference: 3; complete ranges: `[[3,4],[8,9]]`.

output 10 bytes; SHA-256 b2993325b2d318c61bbdc34ba479e83ef3459d05e2447e65874ac0b90c975fcf; hex `763a20272e6e616e270a`.

First difference: 3; complete ranges: `[[3,4],[8,9]]`.

## Y-02-.nan-quoted-extended

Original 10 bytes; SHA-256 d890677f9ec88dfeab0009b8743b134c1025c5378ecf53311e340d187c7d2027; hex `763a20222e6e616e220a`.

noop 10 bytes; SHA-256 b2993325b2d318c61bbdc34ba479e83ef3459d05e2447e65874ac0b90c975fcf; hex `763a20272e6e616e270a`.

First difference: 3; complete ranges: `[[3,4],[8,9]]`.

output 10 bytes; SHA-256 b2993325b2d318c61bbdc34ba479e83ef3459d05e2447e65874ac0b90c975fcf; hex `763a20272e6e616e270a`.

First difference: 3; complete ranges: `[[3,4],[8,9]]`.

## Y-02-.inf-plain-failsafe

Original 8 bytes; SHA-256 82210492b8e83c5791e5a8c86fb0e3570e3dcfbca89d1f0b8a8261d37fc06be4; hex `763a202e696e660a`.

noop 8 bytes; SHA-256 82210492b8e83c5791e5a8c86fb0e3570e3dcfbca89d1f0b8a8261d37fc06be4; hex `763a202e696e660a`.

First difference: null; complete ranges: `[]`.

output 8 bytes; SHA-256 82210492b8e83c5791e5a8c86fb0e3570e3dcfbca89d1f0b8a8261d37fc06be4; hex `763a202e696e660a`.

First difference: null; complete ranges: `[]`.

## Y-02-.inf-plain-json

Original 8 bytes; SHA-256 82210492b8e83c5791e5a8c86fb0e3570e3dcfbca89d1f0b8a8261d37fc06be4; hex `763a202e696e660a`.

noop 8 bytes; SHA-256 82210492b8e83c5791e5a8c86fb0e3570e3dcfbca89d1f0b8a8261d37fc06be4; hex `763a202e696e660a`.

First difference: null; complete ranges: `[]`.

output 8 bytes; SHA-256 82210492b8e83c5791e5a8c86fb0e3570e3dcfbca89d1f0b8a8261d37fc06be4; hex `763a202e696e660a`.

First difference: null; complete ranges: `[]`.

## Y-02-.inf-plain-core

Original 8 bytes; SHA-256 82210492b8e83c5791e5a8c86fb0e3570e3dcfbca89d1f0b8a8261d37fc06be4; hex `763a202e696e660a`.

noop 8 bytes; SHA-256 82210492b8e83c5791e5a8c86fb0e3570e3dcfbca89d1f0b8a8261d37fc06be4; hex `763a202e696e660a`.

First difference: null; complete ranges: `[]`.

output 8 bytes; SHA-256 82210492b8e83c5791e5a8c86fb0e3570e3dcfbca89d1f0b8a8261d37fc06be4; hex `763a202e696e660a`.

First difference: null; complete ranges: `[]`.

## Y-02-.inf-plain-default

Original 8 bytes; SHA-256 82210492b8e83c5791e5a8c86fb0e3570e3dcfbca89d1f0b8a8261d37fc06be4; hex `763a202e696e660a`.

noop 8 bytes; SHA-256 82210492b8e83c5791e5a8c86fb0e3570e3dcfbca89d1f0b8a8261d37fc06be4; hex `763a202e696e660a`.

First difference: null; complete ranges: `[]`.

output 8 bytes; SHA-256 82210492b8e83c5791e5a8c86fb0e3570e3dcfbca89d1f0b8a8261d37fc06be4; hex `763a202e696e660a`.

First difference: null; complete ranges: `[]`.

## Y-02-.inf-plain-extended

Original 8 bytes; SHA-256 82210492b8e83c5791e5a8c86fb0e3570e3dcfbca89d1f0b8a8261d37fc06be4; hex `763a202e696e660a`.

noop 8 bytes; SHA-256 82210492b8e83c5791e5a8c86fb0e3570e3dcfbca89d1f0b8a8261d37fc06be4; hex `763a202e696e660a`.

First difference: null; complete ranges: `[]`.

output 8 bytes; SHA-256 82210492b8e83c5791e5a8c86fb0e3570e3dcfbca89d1f0b8a8261d37fc06be4; hex `763a202e696e660a`.

First difference: null; complete ranges: `[]`.

## Y-02-.inf-quoted-failsafe

Original 10 bytes; SHA-256 65dbc9f1ad6adfdbc951948d855e078048fcee75ab5bd357c0090846195f063a; hex `763a20222e696e66220a`.

noop 8 bytes; SHA-256 82210492b8e83c5791e5a8c86fb0e3570e3dcfbca89d1f0b8a8261d37fc06be4; hex `763a202e696e660a`.

First difference: 3; complete ranges: `[[3,10]]`.

output 8 bytes; SHA-256 82210492b8e83c5791e5a8c86fb0e3570e3dcfbca89d1f0b8a8261d37fc06be4; hex `763a202e696e660a`.

First difference: 3; complete ranges: `[[3,10]]`.

## Y-02-.inf-quoted-json

Original 10 bytes; SHA-256 65dbc9f1ad6adfdbc951948d855e078048fcee75ab5bd357c0090846195f063a; hex `763a20222e696e66220a`.

noop 10 bytes; SHA-256 32591506859cb6ec8101e2a2a76956bfff6a78412548ab815e8da2f918b5c04c; hex `763a20272e696e66270a`.

First difference: 3; complete ranges: `[[3,4],[8,9]]`.

output 10 bytes; SHA-256 32591506859cb6ec8101e2a2a76956bfff6a78412548ab815e8da2f918b5c04c; hex `763a20272e696e66270a`.

First difference: 3; complete ranges: `[[3,4],[8,9]]`.

## Y-02-.inf-quoted-core

Original 10 bytes; SHA-256 65dbc9f1ad6adfdbc951948d855e078048fcee75ab5bd357c0090846195f063a; hex `763a20222e696e66220a`.

noop 10 bytes; SHA-256 32591506859cb6ec8101e2a2a76956bfff6a78412548ab815e8da2f918b5c04c; hex `763a20272e696e66270a`.

First difference: 3; complete ranges: `[[3,4],[8,9]]`.

output 10 bytes; SHA-256 32591506859cb6ec8101e2a2a76956bfff6a78412548ab815e8da2f918b5c04c; hex `763a20272e696e66270a`.

First difference: 3; complete ranges: `[[3,4],[8,9]]`.

## Y-02-.inf-quoted-default

Original 10 bytes; SHA-256 65dbc9f1ad6adfdbc951948d855e078048fcee75ab5bd357c0090846195f063a; hex `763a20222e696e66220a`.

noop 10 bytes; SHA-256 32591506859cb6ec8101e2a2a76956bfff6a78412548ab815e8da2f918b5c04c; hex `763a20272e696e66270a`.

First difference: 3; complete ranges: `[[3,4],[8,9]]`.

output 10 bytes; SHA-256 32591506859cb6ec8101e2a2a76956bfff6a78412548ab815e8da2f918b5c04c; hex `763a20272e696e66270a`.

First difference: 3; complete ranges: `[[3,4],[8,9]]`.

## Y-02-.inf-quoted-extended

Original 10 bytes; SHA-256 65dbc9f1ad6adfdbc951948d855e078048fcee75ab5bd357c0090846195f063a; hex `763a20222e696e66220a`.

noop 10 bytes; SHA-256 32591506859cb6ec8101e2a2a76956bfff6a78412548ab815e8da2f918b5c04c; hex `763a20272e696e66270a`.

First difference: 3; complete ranges: `[[3,4],[8,9]]`.

output 10 bytes; SHA-256 32591506859cb6ec8101e2a2a76956bfff6a78412548ab815e8da2f918b5c04c; hex `763a20272e696e66270a`.

First difference: 3; complete ranges: `[[3,4],[8,9]]`.

## Y-02-2026-09-12-plain-failsafe

Original 14 bytes; SHA-256 f40cad452b5d6d5512222893289026daed8e32558f14b29444e44318d920515c; hex `763a20323032362d30392d31320a`.

noop 14 bytes; SHA-256 f40cad452b5d6d5512222893289026daed8e32558f14b29444e44318d920515c; hex `763a20323032362d30392d31320a`.

First difference: null; complete ranges: `[]`.

output 14 bytes; SHA-256 f40cad452b5d6d5512222893289026daed8e32558f14b29444e44318d920515c; hex `763a20323032362d30392d31320a`.

First difference: null; complete ranges: `[]`.

## Y-02-2026-09-12-plain-json

Original 14 bytes; SHA-256 f40cad452b5d6d5512222893289026daed8e32558f14b29444e44318d920515c; hex `763a20323032362d30392d31320a`.

noop 14 bytes; SHA-256 f40cad452b5d6d5512222893289026daed8e32558f14b29444e44318d920515c; hex `763a20323032362d30392d31320a`.

First difference: null; complete ranges: `[]`.

output 14 bytes; SHA-256 f40cad452b5d6d5512222893289026daed8e32558f14b29444e44318d920515c; hex `763a20323032362d30392d31320a`.

First difference: null; complete ranges: `[]`.

## Y-02-2026-09-12-plain-core

Original 14 bytes; SHA-256 f40cad452b5d6d5512222893289026daed8e32558f14b29444e44318d920515c; hex `763a20323032362d30392d31320a`.

noop 14 bytes; SHA-256 f40cad452b5d6d5512222893289026daed8e32558f14b29444e44318d920515c; hex `763a20323032362d30392d31320a`.

First difference: null; complete ranges: `[]`.

output 14 bytes; SHA-256 f40cad452b5d6d5512222893289026daed8e32558f14b29444e44318d920515c; hex `763a20323032362d30392d31320a`.

First difference: null; complete ranges: `[]`.

## Y-02-2026-09-12-plain-default

Original 14 bytes; SHA-256 f40cad452b5d6d5512222893289026daed8e32558f14b29444e44318d920515c; hex `763a20323032362d30392d31320a`.

noop 28 bytes; SHA-256 218a911ea4b2dc687cfec111532f0111247646ea65129ce3cd866823f0cee26a; hex `763a20323032362d30392d31325430303a30303a30302e3030305a0a`.

First difference: 13; complete ranges: `[[13,28]]`.

output 28 bytes; SHA-256 218a911ea4b2dc687cfec111532f0111247646ea65129ce3cd866823f0cee26a; hex `763a20323032362d30392d31325430303a30303a30302e3030305a0a`.

First difference: 13; complete ranges: `[[13,28]]`.

## Y-02-2026-09-12-plain-extended

Original 14 bytes; SHA-256 f40cad452b5d6d5512222893289026daed8e32558f14b29444e44318d920515c; hex `763a20323032362d30392d31320a`.

noop 28 bytes; SHA-256 218a911ea4b2dc687cfec111532f0111247646ea65129ce3cd866823f0cee26a; hex `763a20323032362d30392d31325430303a30303a30302e3030305a0a`.

First difference: 13; complete ranges: `[[13,28]]`.

output 28 bytes; SHA-256 218a911ea4b2dc687cfec111532f0111247646ea65129ce3cd866823f0cee26a; hex `763a20323032362d30392d31325430303a30303a30302e3030305a0a`.

First difference: 13; complete ranges: `[[13,28]]`.

## Y-02-2026-09-12-quoted-failsafe

Original 16 bytes; SHA-256 ff66318427c0039ceaf4357020d4cf809ab6c803a6323d7b7b66f91699101098; hex `763a2022323032362d30392d3132220a`.

noop 14 bytes; SHA-256 f40cad452b5d6d5512222893289026daed8e32558f14b29444e44318d920515c; hex `763a20323032362d30392d31320a`.

First difference: 3; complete ranges: `[[3,16]]`.

output 14 bytes; SHA-256 f40cad452b5d6d5512222893289026daed8e32558f14b29444e44318d920515c; hex `763a20323032362d30392d31320a`.

First difference: 3; complete ranges: `[[3,16]]`.

## Y-02-2026-09-12-quoted-json

Original 16 bytes; SHA-256 ff66318427c0039ceaf4357020d4cf809ab6c803a6323d7b7b66f91699101098; hex `763a2022323032362d30392d3132220a`.

noop 14 bytes; SHA-256 f40cad452b5d6d5512222893289026daed8e32558f14b29444e44318d920515c; hex `763a20323032362d30392d31320a`.

First difference: 3; complete ranges: `[[3,16]]`.

output 14 bytes; SHA-256 f40cad452b5d6d5512222893289026daed8e32558f14b29444e44318d920515c; hex `763a20323032362d30392d31320a`.

First difference: 3; complete ranges: `[[3,16]]`.

## Y-02-2026-09-12-quoted-core

Original 16 bytes; SHA-256 ff66318427c0039ceaf4357020d4cf809ab6c803a6323d7b7b66f91699101098; hex `763a2022323032362d30392d3132220a`.

noop 14 bytes; SHA-256 f40cad452b5d6d5512222893289026daed8e32558f14b29444e44318d920515c; hex `763a20323032362d30392d31320a`.

First difference: 3; complete ranges: `[[3,16]]`.

output 14 bytes; SHA-256 f40cad452b5d6d5512222893289026daed8e32558f14b29444e44318d920515c; hex `763a20323032362d30392d31320a`.

First difference: 3; complete ranges: `[[3,16]]`.

## Y-02-2026-09-12-quoted-default

Original 16 bytes; SHA-256 ff66318427c0039ceaf4357020d4cf809ab6c803a6323d7b7b66f91699101098; hex `763a2022323032362d30392d3132220a`.

noop 16 bytes; SHA-256 eec4d6783bfddd635be6a798cbc564d96df7d6b37d10667adfca2164724a8d5d; hex `763a2027323032362d30392d3132270a`.

First difference: 3; complete ranges: `[[3,4],[14,15]]`.

output 16 bytes; SHA-256 eec4d6783bfddd635be6a798cbc564d96df7d6b37d10667adfca2164724a8d5d; hex `763a2027323032362d30392d3132270a`.

First difference: 3; complete ranges: `[[3,4],[14,15]]`.

## Y-02-2026-09-12-quoted-extended

Original 16 bytes; SHA-256 ff66318427c0039ceaf4357020d4cf809ab6c803a6323d7b7b66f91699101098; hex `763a2022323032362d30392d3132220a`.

noop 16 bytes; SHA-256 eec4d6783bfddd635be6a798cbc564d96df7d6b37d10667adfca2164724a8d5d; hex `763a2027323032362d30392d3132270a`.

First difference: 3; complete ranges: `[[3,4],[14,15]]`.

output 16 bytes; SHA-256 eec4d6783bfddd635be6a798cbc564d96df7d6b37d10667adfca2164724a8d5d; hex `763a2027323032362d30392d3132270a`.

First difference: 3; complete ranges: `[[3,4],[14,15]]`.

## Y-03-tag0-failsafe

Original 9 bytes; SHA-256 83c28858df0bf89792d44064fb97a0d16c5aebce8190228263de59b67ac26150; hex `21217374722031320a`.

noop 3 bytes; SHA-256 a1fb50e6c86fae1679ef3351296fd6713411a08cf8dd1790a4fd05fae8688164; hex `31320a`.

First difference: 0; complete ranges: `[[0,9]]`.

output 3 bytes; SHA-256 a1fb50e6c86fae1679ef3351296fd6713411a08cf8dd1790a4fd05fae8688164; hex `31320a`.

First difference: 0; complete ranges: `[[0,9]]`.

## Y-03-tag0-json

Original 9 bytes; SHA-256 83c28858df0bf89792d44064fb97a0d16c5aebce8190228263de59b67ac26150; hex `21217374722031320a`.

noop 5 bytes; SHA-256 cb1c20d1b10e442276927df4dda308b11e8d5c383bba5ad9403924f551a6c518; hex `273132270a`.

First difference: 0; complete ranges: `[[0,9]]`.

output 5 bytes; SHA-256 cb1c20d1b10e442276927df4dda308b11e8d5c383bba5ad9403924f551a6c518; hex `273132270a`.

First difference: 0; complete ranges: `[[0,9]]`.

## Y-03-tag0-core

Original 9 bytes; SHA-256 83c28858df0bf89792d44064fb97a0d16c5aebce8190228263de59b67ac26150; hex `21217374722031320a`.

noop 5 bytes; SHA-256 cb1c20d1b10e442276927df4dda308b11e8d5c383bba5ad9403924f551a6c518; hex `273132270a`.

First difference: 0; complete ranges: `[[0,9]]`.

output 5 bytes; SHA-256 cb1c20d1b10e442276927df4dda308b11e8d5c383bba5ad9403924f551a6c518; hex `273132270a`.

First difference: 0; complete ranges: `[[0,9]]`.

## Y-03-tag0-default

Original 9 bytes; SHA-256 83c28858df0bf89792d44064fb97a0d16c5aebce8190228263de59b67ac26150; hex `21217374722031320a`.

noop 5 bytes; SHA-256 cb1c20d1b10e442276927df4dda308b11e8d5c383bba5ad9403924f551a6c518; hex `273132270a`.

First difference: 0; complete ranges: `[[0,9]]`.

output 5 bytes; SHA-256 cb1c20d1b10e442276927df4dda308b11e8d5c383bba5ad9403924f551a6c518; hex `273132270a`.

First difference: 0; complete ranges: `[[0,9]]`.

## Y-03-tag0-extended

Original 9 bytes; SHA-256 83c28858df0bf89792d44064fb97a0d16c5aebce8190228263de59b67ac26150; hex `21217374722031320a`.

noop 5 bytes; SHA-256 cb1c20d1b10e442276927df4dda308b11e8d5c383bba5ad9403924f551a6c518; hex `273132270a`.

First difference: 0; complete ranges: `[[0,9]]`.

output 5 bytes; SHA-256 cb1c20d1b10e442276927df4dda308b11e8d5c383bba5ad9403924f551a6c518; hex `273132270a`.

First difference: 0; complete ranges: `[[0,9]]`.

## Y-03-tag1-failsafe

Original 11 bytes; SHA-256 e4dd9e5d42cc46efeb7795a73a4ea9d3da0a78bf6250c14c156f8932efedf2b3; hex `2121696e7420223132220a`.

noop: unavailable; status parse-rejected.

output: unavailable; status parse-rejected.

## Y-03-tag1-json

Original 11 bytes; SHA-256 e4dd9e5d42cc46efeb7795a73a4ea9d3da0a78bf6250c14c156f8932efedf2b3; hex `2121696e7420223132220a`.

noop: unavailable; status parse-rejected.

output: unavailable; status parse-rejected.

## Y-03-tag1-core

Original 11 bytes; SHA-256 e4dd9e5d42cc46efeb7795a73a4ea9d3da0a78bf6250c14c156f8932efedf2b3; hex `2121696e7420223132220a`.

noop: unavailable; status parse-rejected.

output: unavailable; status parse-rejected.

## Y-03-tag1-default

Original 11 bytes; SHA-256 e4dd9e5d42cc46efeb7795a73a4ea9d3da0a78bf6250c14c156f8932efedf2b3; hex `2121696e7420223132220a`.

noop: unavailable; status parse-rejected.

output: unavailable; status parse-rejected.

## Y-03-tag1-extended

Original 11 bytes; SHA-256 e4dd9e5d42cc46efeb7795a73a4ea9d3da0a78bf6250c14c156f8932efedf2b3; hex `2121696e7420223132220a`.

noop: unavailable; status parse-rejected.

output: unavailable; status parse-rejected.

## Y-03-tag2-failsafe

Original 23 bytes; SHA-256 b796bbd58ae1b10852fc09ceb76d1a399f72598b072db5a599e91289ac3e7195; hex `212174696d657374616d7020323032362d30392d31320a`.

noop: unavailable; status parse-rejected.

output: unavailable; status parse-rejected.

## Y-03-tag2-json

Original 23 bytes; SHA-256 b796bbd58ae1b10852fc09ceb76d1a399f72598b072db5a599e91289ac3e7195; hex `212174696d657374616d7020323032362d30392d31320a`.

noop: unavailable; status parse-rejected.

output: unavailable; status parse-rejected.

## Y-03-tag2-core

Original 23 bytes; SHA-256 b796bbd58ae1b10852fc09ceb76d1a399f72598b072db5a599e91289ac3e7195; hex `212174696d657374616d7020323032362d30392d31320a`.

noop: unavailable; status parse-rejected.

output: unavailable; status parse-rejected.

## Y-03-tag2-default

Original 23 bytes; SHA-256 b796bbd58ae1b10852fc09ceb76d1a399f72598b072db5a599e91289ac3e7195; hex `212174696d657374616d7020323032362d30392d31320a`.

noop 25 bytes; SHA-256 141bb38e60eb2632920826d667cefe799f62b5afd6e828d9852eb53aad61abad; hex `323032362d30392d31325430303a30303a30302e3030305a0a`.

First difference: 0; complete ranges: `[[0,17],[18,25]]`.

output 25 bytes; SHA-256 141bb38e60eb2632920826d667cefe799f62b5afd6e828d9852eb53aad61abad; hex `323032362d30392d31325430303a30303a30302e3030305a0a`.

First difference: 0; complete ranges: `[[0,17],[18,25]]`.

## Y-03-tag2-extended

Original 23 bytes; SHA-256 b796bbd58ae1b10852fc09ceb76d1a399f72598b072db5a599e91289ac3e7195; hex `212174696d657374616d7020323032362d30392d31320a`.

noop 25 bytes; SHA-256 141bb38e60eb2632920826d667cefe799f62b5afd6e828d9852eb53aad61abad; hex `323032362d30392d31325430303a30303a30302e3030305a0a`.

First difference: 0; complete ranges: `[[0,17],[18,25]]`.

output 25 bytes; SHA-256 141bb38e60eb2632920826d667cefe799f62b5afd6e828d9852eb53aad61abad; hex `323032362d30392d31325430303a30303a30302e3030305a0a`.

First difference: 0; complete ranges: `[[0,17],[18,25]]`.

## Y-03-tag3-failsafe

Original 14 bytes; SHA-256 891fef67dc3736db9b549b9733afc786abf255c43716a84479b8c17fc6f79bbf; hex `212162696e6172792053476b3d0a`.

noop: unavailable; status parse-rejected.

output: unavailable; status parse-rejected.

## Y-03-tag3-json

Original 14 bytes; SHA-256 891fef67dc3736db9b549b9733afc786abf255c43716a84479b8c17fc6f79bbf; hex `212162696e6172792053476b3d0a`.

noop: unavailable; status parse-rejected.

output: unavailable; status parse-rejected.

## Y-03-tag3-core

Original 14 bytes; SHA-256 891fef67dc3736db9b549b9733afc786abf255c43716a84479b8c17fc6f79bbf; hex `212162696e6172792053476b3d0a`.

noop: unavailable; status parse-rejected.

output: unavailable; status parse-rejected.

## Y-03-tag3-default

Original 14 bytes; SHA-256 891fef67dc3736db9b549b9733afc786abf255c43716a84479b8c17fc6f79bbf; hex `212162696e6172792053476b3d0a`.

noop 33 bytes; SHA-256 d0495c30a68e6e9a9135def808e0b331c8b965f725434e653fec5bd44637b353; hex `213c7461673a79616d6c2e6f72672c323030323a62696e6172793e2053476b3d0a`.

First difference: 1; complete ranges: `[[1,33]]`.

output 33 bytes; SHA-256 d0495c30a68e6e9a9135def808e0b331c8b965f725434e653fec5bd44637b353; hex `213c7461673a79616d6c2e6f72672c323030323a62696e6172793e2053476b3d0a`.

First difference: 1; complete ranges: `[[1,33]]`.

## Y-03-tag3-extended

Original 14 bytes; SHA-256 891fef67dc3736db9b549b9733afc786abf255c43716a84479b8c17fc6f79bbf; hex `212162696e6172792053476b3d0a`.

noop 33 bytes; SHA-256 d0495c30a68e6e9a9135def808e0b331c8b965f725434e653fec5bd44637b353; hex `213c7461673a79616d6c2e6f72672c323030323a62696e6172793e2053476b3d0a`.

First difference: 1; complete ranges: `[[1,33]]`.

output 33 bytes; SHA-256 d0495c30a68e6e9a9135def808e0b331c8b965f725434e653fec5bd44637b353; hex `213c7461673a79616d6c2e6f72672c323030323a62696e6172793e2053476b3d0a`.

First difference: 1; complete ranges: `[[1,33]]`.

## Y-03-tag4-failsafe

Original 16 bytes; SHA-256 9f8ada703d0b3623a7d2aa988ebf6ea89fa3d77e85224cb2fbca6a614969f355; hex `2121736574207b613a206e756c6c7d0a`.

noop: unavailable; status parse-rejected.

output: unavailable; status parse-rejected.

## Y-03-tag4-json

Original 16 bytes; SHA-256 9f8ada703d0b3623a7d2aa988ebf6ea89fa3d77e85224cb2fbca6a614969f355; hex `2121736574207b613a206e756c6c7d0a`.

noop: unavailable; status parse-rejected.

output: unavailable; status parse-rejected.

## Y-03-tag4-core

Original 16 bytes; SHA-256 9f8ada703d0b3623a7d2aa988ebf6ea89fa3d77e85224cb2fbca6a614969f355; hex `2121736574207b613a206e756c6c7d0a`.

noop: unavailable; status parse-rejected.

output: unavailable; status parse-rejected.

## Y-03-tag4-default

Original 16 bytes; SHA-256 9f8ada703d0b3623a7d2aa988ebf6ea89fa3d77e85224cb2fbca6a614969f355; hex `2121736574207b613a206e756c6c7d0a`.

noop 8 bytes; SHA-256 1993ef786683a4339c6bfc85a0dde04652834eb7111bbb54b0e594ef57990e99; hex `613a206e756c6c0a`.

First difference: 0; complete ranges: `[[0,16]]`.

output 8 bytes; SHA-256 1993ef786683a4339c6bfc85a0dde04652834eb7111bbb54b0e594ef57990e99; hex `613a206e756c6c0a`.

First difference: 0; complete ranges: `[[0,16]]`.

## Y-03-tag4-extended

Original 16 bytes; SHA-256 9f8ada703d0b3623a7d2aa988ebf6ea89fa3d77e85224cb2fbca6a614969f355; hex `2121736574207b613a206e756c6c7d0a`.

noop 8 bytes; SHA-256 1993ef786683a4339c6bfc85a0dde04652834eb7111bbb54b0e594ef57990e99; hex `613a206e756c6c0a`.

First difference: 0; complete ranges: `[[0,16]]`.

output 8 bytes; SHA-256 1993ef786683a4339c6bfc85a0dde04652834eb7111bbb54b0e594ef57990e99; hex `613a206e756c6c0a`.

First difference: 0; complete ranges: `[[0,16]]`.

## Y-03-tag5-failsafe

Original 14 bytes; SHA-256 3eca6c6cb8f9a91d84e60b06ec5a82f2302797231339ca0d59ef8bb4b9e64a5c; hex `21216f6d6170205b613a20315d0a`.

noop: unavailable; status parse-rejected.

output: unavailable; status parse-rejected.

## Y-03-tag5-json

Original 14 bytes; SHA-256 3eca6c6cb8f9a91d84e60b06ec5a82f2302797231339ca0d59ef8bb4b9e64a5c; hex `21216f6d6170205b613a20315d0a`.

noop: unavailable; status parse-rejected.

output: unavailable; status parse-rejected.

## Y-03-tag5-core

Original 14 bytes; SHA-256 3eca6c6cb8f9a91d84e60b06ec5a82f2302797231339ca0d59ef8bb4b9e64a5c; hex `21216f6d6170205b613a20315d0a`.

noop: unavailable; status parse-rejected.

output: unavailable; status parse-rejected.

## Y-03-tag5-default

Original 14 bytes; SHA-256 3eca6c6cb8f9a91d84e60b06ec5a82f2302797231339ca0d59ef8bb4b9e64a5c; hex `21216f6d6170205b613a20315d0a`.

noop 7 bytes; SHA-256 70d58c1ec2f1dc2fba979f8a85ca2531b7b6d42e005993a6af9fa4deca3f9c42; hex `2d20613a20310a`.

First difference: 0; complete ranges: `[[0,14]]`.

output 7 bytes; SHA-256 70d58c1ec2f1dc2fba979f8a85ca2531b7b6d42e005993a6af9fa4deca3f9c42; hex `2d20613a20310a`.

First difference: 0; complete ranges: `[[0,14]]`.

## Y-03-tag5-extended

Original 14 bytes; SHA-256 3eca6c6cb8f9a91d84e60b06ec5a82f2302797231339ca0d59ef8bb4b9e64a5c; hex `21216f6d6170205b613a20315d0a`.

noop 7 bytes; SHA-256 70d58c1ec2f1dc2fba979f8a85ca2531b7b6d42e005993a6af9fa4deca3f9c42; hex `2d20613a20310a`.

First difference: 0; complete ranges: `[[0,14]]`.

output 7 bytes; SHA-256 70d58c1ec2f1dc2fba979f8a85ca2531b7b6d42e005993a6af9fa4deca3f9c42; hex `2d20613a20310a`.

First difference: 0; complete ranges: `[[0,14]]`.

## Y-03-tag6-failsafe

Original 15 bytes; SHA-256 0b007fe492ff76a33302aea39c41eddcdcd43444bd95481b7060f5610e10d963; hex `21217061697273205b613a20315d0a`.

noop: unavailable; status parse-rejected.

output: unavailable; status parse-rejected.

## Y-03-tag6-json

Original 15 bytes; SHA-256 0b007fe492ff76a33302aea39c41eddcdcd43444bd95481b7060f5610e10d963; hex `21217061697273205b613a20315d0a`.

noop: unavailable; status parse-rejected.

output: unavailable; status parse-rejected.

## Y-03-tag6-core

Original 15 bytes; SHA-256 0b007fe492ff76a33302aea39c41eddcdcd43444bd95481b7060f5610e10d963; hex `21217061697273205b613a20315d0a`.

noop: unavailable; status parse-rejected.

output: unavailable; status parse-rejected.

## Y-03-tag6-default

Original 15 bytes; SHA-256 0b007fe492ff76a33302aea39c41eddcdcd43444bd95481b7060f5610e10d963; hex `21217061697273205b613a20315d0a`.

noop 12 bytes; SHA-256 3708ea0b4caa19162d0c5cb02a1a3a5eb0554ef5ebba8062d45a614f1e140cae; hex `2d202d20610a20202d20310a`.

First difference: 0; complete ranges: `[[0,7],[8,15]]`.

output 12 bytes; SHA-256 3708ea0b4caa19162d0c5cb02a1a3a5eb0554ef5ebba8062d45a614f1e140cae; hex `2d202d20610a20202d20310a`.

First difference: 0; complete ranges: `[[0,7],[8,15]]`.

## Y-03-tag6-extended

Original 15 bytes; SHA-256 0b007fe492ff76a33302aea39c41eddcdcd43444bd95481b7060f5610e10d963; hex `21217061697273205b613a20315d0a`.

noop 12 bytes; SHA-256 3708ea0b4caa19162d0c5cb02a1a3a5eb0554ef5ebba8062d45a614f1e140cae; hex `2d202d20610a20202d20310a`.

First difference: 0; complete ranges: `[[0,7],[8,15]]`.

output 12 bytes; SHA-256 3708ea0b4caa19162d0c5cb02a1a3a5eb0554ef5ebba8062d45a614f1e140cae; hex `2d202d20610a20202d20310a`.

First difference: 0; complete ranges: `[[0,7],[8,15]]`.

## Y-03-tag7-failsafe

Original 17 bytes; SHA-256 4a534c2a3c45ea06abcd053be9cde7ad736a47c5b8b3c2961e30ac7a703e2530; hex `21216a732f726567657870202f782f690a`.

noop: unavailable; status parse-rejected.

output: unavailable; status parse-rejected.

## Y-03-tag7-json

Original 17 bytes; SHA-256 4a534c2a3c45ea06abcd053be9cde7ad736a47c5b8b3c2961e30ac7a703e2530; hex `21216a732f726567657870202f782f690a`.

noop: unavailable; status parse-rejected.

output: unavailable; status parse-rejected.

## Y-03-tag7-core

Original 17 bytes; SHA-256 4a534c2a3c45ea06abcd053be9cde7ad736a47c5b8b3c2961e30ac7a703e2530; hex `21216a732f726567657870202f782f690a`.

noop: unavailable; status parse-rejected.

output: unavailable; status parse-rejected.

## Y-03-tag7-default

Original 17 bytes; SHA-256 4a534c2a3c45ea06abcd053be9cde7ad736a47c5b8b3c2961e30ac7a703e2530; hex `21216a732f726567657870202f782f690a`.

noop: unavailable; status parse-rejected.

output: unavailable; status parse-rejected.

## Y-03-tag7-extended

Original 17 bytes; SHA-256 4a534c2a3c45ea06abcd053be9cde7ad736a47c5b8b3c2961e30ac7a703e2530; hex `21216a732f726567657870202f782f690a`.

noop 36 bytes; SHA-256 e4d8965050b3d7721987766053de08247944cf25ab90be2d229206d4754bb797; hex `213c7461673a79616d6c2e6f72672c323030323a6a732f7265676578703e202f782f690a`.

First difference: 1; complete ranges: `[[1,36]]`.

output 36 bytes; SHA-256 e4d8965050b3d7721987766053de08247944cf25ab90be2d229206d4754bb797; hex `213c7461673a79616d6c2e6f72672c323030323a6a732f7265676578703e202f782f690a`.

First difference: 1; complete ranges: `[[1,36]]`.

## Y-03-tag8-failsafe

Original 17 bytes; SHA-256 c6321c6a58d7bc99754130d9b57da7e5c4055a807e50db5330b3338ee8ae9936; hex `21216a732f756e646566696e6564207e0a`.

noop: unavailable; status parse-rejected.

output: unavailable; status parse-rejected.

## Y-03-tag8-json

Original 17 bytes; SHA-256 c6321c6a58d7bc99754130d9b57da7e5c4055a807e50db5330b3338ee8ae9936; hex `21216a732f756e646566696e6564207e0a`.

noop: unavailable; status parse-rejected.

output: unavailable; status parse-rejected.

## Y-03-tag8-core

Original 17 bytes; SHA-256 c6321c6a58d7bc99754130d9b57da7e5c4055a807e50db5330b3338ee8ae9936; hex `21216a732f756e646566696e6564207e0a`.

noop: unavailable; status parse-rejected.

output: unavailable; status parse-rejected.

## Y-03-tag8-default

Original 17 bytes; SHA-256 c6321c6a58d7bc99754130d9b57da7e5c4055a807e50db5330b3338ee8ae9936; hex `21216a732f756e646566696e6564207e0a`.

noop: unavailable; status parse-rejected.

output: unavailable; status parse-rejected.

## Y-03-tag8-extended

Original 17 bytes; SHA-256 c6321c6a58d7bc99754130d9b57da7e5c4055a807e50db5330b3338ee8ae9936; hex `21216a732f756e646566696e6564207e0a`.

noop 5 bytes; SHA-256 38e0b9de817f645c4bec37c0d4a3e58baecccb040f5718dc069a72c7385a0bed; hex `6e756c6c0a`.

First difference: 0; complete ranges: `[[0,17]]`.

output 5 bytes; SHA-256 38e0b9de817f645c4bec37c0d4a3e58baecccb040f5718dc069a72c7385a0bed; hex `6e756c6c0a`.

First difference: 0; complete ranges: `[[0,17]]`.

## Y-03-tag9-failsafe

Original 10 bytes; SHA-256 266585788d6098179e04f313d2e7379d53ce5e6b7c507dd69cf11afdd75bbbf2; hex `21637573746f6d20780a`.

noop: unavailable; status parse-rejected.

output: unavailable; status parse-rejected.

## Y-03-tag9-json

Original 10 bytes; SHA-256 266585788d6098179e04f313d2e7379d53ce5e6b7c507dd69cf11afdd75bbbf2; hex `21637573746f6d20780a`.

noop: unavailable; status parse-rejected.

output: unavailable; status parse-rejected.

## Y-03-tag9-core

Original 10 bytes; SHA-256 266585788d6098179e04f313d2e7379d53ce5e6b7c507dd69cf11afdd75bbbf2; hex `21637573746f6d20780a`.

noop: unavailable; status parse-rejected.

output: unavailable; status parse-rejected.

## Y-03-tag9-default

Original 10 bytes; SHA-256 266585788d6098179e04f313d2e7379d53ce5e6b7c507dd69cf11afdd75bbbf2; hex `21637573746f6d20780a`.

noop: unavailable; status parse-rejected.

output: unavailable; status parse-rejected.

## Y-03-tag9-extended

Original 10 bytes; SHA-256 266585788d6098179e04f313d2e7379d53ce5e6b7c507dd69cf11afdd75bbbf2; hex `21637573746f6d20780a`.

noop: unavailable; status parse-rejected.

output: unavailable; status parse-rejected.

## Y-04-duplicate-reject

Original 10 bytes; SHA-256 db2e99c8225d56560ecdf70a39e6d1e7623b17e52679454c71914b7341d31045; hex `613a20310a613a20320a`.

noop: unavailable; status parse-rejected.

output: unavailable; status parse-rejected.

## Y-04-duplicate-allow

Original 10 bytes; SHA-256 db2e99c8225d56560ecdf70a39e6d1e7623b17e52679454c71914b7341d31045; hex `613a20310a613a20320a`.

noop 5 bytes; SHA-256 3a55d721fdd6a21fc7793a07ad20c6ad037c302ad003f552d5913039777eaec0; hex `613a20320a`.

First difference: 3; complete ranges: `[[3,4],[5,10]]`.

output 5 bytes; SHA-256 3a55d721fdd6a21fc7793a07ad20c6ad037c302ad003f552d5913039777eaec0; hex `613a20320a`.

First difference: 3; complete ranges: `[[3,4],[5,10]]`.

## Y-04-key0-allowfalse

Original 33 bytes; SHA-256 4605be5ddcf74c50560de388605a069a5f2c395a280fe65d001a1987e7d40728; hex `747275653a20626f6f6c0a313a206e756d6265720a2231223a20737472696e670a`.

noop: unavailable; status parse-rejected.

output: unavailable; status parse-rejected.

## Y-04-key0-allowtrue

Original 33 bytes; SHA-256 4605be5ddcf74c50560de388605a069a5f2c395a280fe65d001a1987e7d40728; hex `747275653a20626f6f6c0a313a206e756d6265720a2231223a20737472696e670a`.

noop 25 bytes; SHA-256 55ffbbb00519889087319708453cc5cef8b7922c52e901a7f06ee47fe3c229e8; hex `2731273a20737472696e670a2774727565273a20626f6f6c0a`.

First difference: 0; complete ranges: `[[0,15],[16,33]]`.

output 25 bytes; SHA-256 55ffbbb00519889087319708453cc5cef8b7922c52e901a7f06ee47fe3c229e8; hex `2731273a20737472696e670a2774727565273a20626f6f6c0a`.

First difference: 0; complete ranges: `[[0,15],[16,33]]`.

## Y-04-key1-allowfalse

Original 19 bytes; SHA-256 8dac5a51c22ceb780abef7ac1c4ff6a9095d5535860e2787e7a6d68affddd2d6; hex `3f205b612c625d0a3a2073657175656e63650a`.

noop 16 bytes; SHA-256 044c22de4696ce1dcd4e59eaa4ae445ec9a13fd3198e0fa531906a06e86a62fc; hex `27612c62273a2073657175656e63650a`.

First difference: 0; complete ranges: `[[0,11],[12,14],[15,19]]`.

output 16 bytes; SHA-256 044c22de4696ce1dcd4e59eaa4ae445ec9a13fd3198e0fa531906a06e86a62fc; hex `27612c62273a2073657175656e63650a`.

First difference: 0; complete ranges: `[[0,11],[12,14],[15,19]]`.

## Y-04-key1-allowtrue

Original 19 bytes; SHA-256 8dac5a51c22ceb780abef7ac1c4ff6a9095d5535860e2787e7a6d68affddd2d6; hex `3f205b612c625d0a3a2073657175656e63650a`.

noop 16 bytes; SHA-256 044c22de4696ce1dcd4e59eaa4ae445ec9a13fd3198e0fa531906a06e86a62fc; hex `27612c62273a2073657175656e63650a`.

First difference: 0; complete ranges: `[[0,11],[12,14],[15,19]]`.

output 16 bytes; SHA-256 044c22de4696ce1dcd4e59eaa4ae445ec9a13fd3198e0fa531906a06e86a62fc; hex `27612c62273a2073657175656e63650a`.

First difference: 0; complete ranges: `[[0,11],[12,14],[15,19]]`.

## Y-04-key2-allowfalse

Original 19 bytes; SHA-256 3210d664a52a942a675e6038a192624084f9e7778e103e450b2f93a4ab47efc6; hex `3f207b613a20627d0a3a206d617070696e670a`.

noop 27 bytes; SHA-256 18b382f745e9834940fae41907b47cc2a26711bdb84a1778415fdcb00698d5ae; hex `275b6f626a656374204f626a6563745d273a206d617070696e670a`.

First difference: 0; complete ranges: `[[0,27]]`.

output 27 bytes; SHA-256 18b382f745e9834940fae41907b47cc2a26711bdb84a1778415fdcb00698d5ae; hex `275b6f626a656374204f626a6563745d273a206d617070696e670a`.

First difference: 0; complete ranges: `[[0,27]]`.

## Y-04-key2-allowtrue

Original 19 bytes; SHA-256 3210d664a52a942a675e6038a192624084f9e7778e103e450b2f93a4ab47efc6; hex `3f207b613a20627d0a3a206d617070696e670a`.

noop 27 bytes; SHA-256 18b382f745e9834940fae41907b47cc2a26711bdb84a1778415fdcb00698d5ae; hex `275b6f626a656374204f626a6563745d273a206d617070696e670a`.

First difference: 0; complete ranges: `[[0,27]]`.

output 27 bytes; SHA-256 18b382f745e9834940fae41907b47cc2a26711bdb84a1778415fdcb00698d5ae; hex `275b6f626a656374204f626a6563745d273a206d617070696e670a`.

First difference: 0; complete ranges: `[[0,27]]`.

## Y-05-alias

Original 25 bytes; SHA-256 b270003f4edabf68c2e6643b7927c6f15599b4d8f36b319e99241ee20fc236ef; hex `613a202662617365207b783a20317d0a623a202a626173650a`.

noop 27 bytes; SHA-256 15d634073e4148eb12955d63fb160677ffdc45a3b0201f9321a02f6ad62c4a54; hex `613a20267265665f300a2020783a20310a623a202a7265665f300a`.

First difference: 4; complete ranges: `[[4,27]]`.

output 27 bytes; SHA-256 7054b4afbb2a803f5ce285507903f88d167e2adc89bf9e2cccdb583c92418280; hex `613a20267265665f300a2020783a20390a623a202a7265665f300a`.

First difference: 4; complete ranges: `[[4,27]]`.

## Y-06-cycle

Original 11 bytes; SHA-256 5e5ce97435816a372a8f9b601f4216cad50c88884f963ed41206a664e1ac0307; hex `613a202661205b2a615d0a`.

noop 21 bytes; SHA-256 8fe85d58a046558591f03a64be50f11b54722177116848b947b354648f855fea; hex `613a20267265665f300a20202d202a7265665f300a`.

First difference: 4; complete ranges: `[[4,21]]`.

output 21 bytes; SHA-256 8fe85d58a046558591f03a64be50f11b54722177116848b947b354648f855fea; hex `613a20267265665f300a20202d202a7265665f300a`.

First difference: 4; complete ranges: `[[4,21]]`.

## Y-06-unresolved

Original 12 bytes; SHA-256 6c4f3a79e1db4895deb21c13c619684c03c3aa47fd06d2c8788bd06dec1e1f7e; hex `613a202a6d697373696e670a`.

noop: unavailable; status parse-rejected.

output: unavailable; status parse-rejected.

## Y-07-merge-failsafe

Original 43 bytes; SHA-256 5d367def78629fec1f1c962fdcb9a386bbadd49391afd5db752e4cf9b15ddcf6; hex `626173653a202662207b783a20312c20793a20327d0a6974656d3a207b3c3c3a202a622c20793a20337d0a`.

noop 57 bytes; SHA-256 2652f162801ad82fd99761e8fddfc7eef0746ac804726dd916235c748dda91e9; hex `626173653a20267265665f300a2020783a20310a20202779273a20320a6974656d3a0a20203c3c3a202a7265665f300a20202779273a20330a`.

First difference: 7; complete ranges: `[[7,36],[37,57]]`.

output 57 bytes; SHA-256 2652f162801ad82fd99761e8fddfc7eef0746ac804726dd916235c748dda91e9; hex `626173653a20267265665f300a2020783a20310a20202779273a20320a6974656d3a0a20203c3c3a202a7265665f300a20202779273a20330a`.

First difference: 7; complete ranges: `[[7,36],[37,57]]`.

## Y-07-merge-json

Original 43 bytes; SHA-256 5d367def78629fec1f1c962fdcb9a386bbadd49391afd5db752e4cf9b15ddcf6; hex `626173653a202662207b783a20312c20793a20327d0a6974656d3a207b3c3c3a202a622c20793a20337d0a`.

noop 57 bytes; SHA-256 2652f162801ad82fd99761e8fddfc7eef0746ac804726dd916235c748dda91e9; hex `626173653a20267265665f300a2020783a20310a20202779273a20320a6974656d3a0a20203c3c3a202a7265665f300a20202779273a20330a`.

First difference: 7; complete ranges: `[[7,36],[37,57]]`.

output 57 bytes; SHA-256 2652f162801ad82fd99761e8fddfc7eef0746ac804726dd916235c748dda91e9; hex `626173653a20267265665f300a2020783a20310a20202779273a20320a6974656d3a0a20203c3c3a202a7265665f300a20202779273a20330a`.

First difference: 7; complete ranges: `[[7,36],[37,57]]`.

## Y-07-merge-core

Original 43 bytes; SHA-256 5d367def78629fec1f1c962fdcb9a386bbadd49391afd5db752e4cf9b15ddcf6; hex `626173653a202662207b783a20312c20793a20327d0a6974656d3a207b3c3c3a202a622c20793a20337d0a`.

noop 57 bytes; SHA-256 2652f162801ad82fd99761e8fddfc7eef0746ac804726dd916235c748dda91e9; hex `626173653a20267265665f300a2020783a20310a20202779273a20320a6974656d3a0a20203c3c3a202a7265665f300a20202779273a20330a`.

First difference: 7; complete ranges: `[[7,36],[37,57]]`.

output 57 bytes; SHA-256 2652f162801ad82fd99761e8fddfc7eef0746ac804726dd916235c748dda91e9; hex `626173653a20267265665f300a2020783a20310a20202779273a20320a6974656d3a0a20203c3c3a202a7265665f300a20202779273a20330a`.

First difference: 7; complete ranges: `[[7,36],[37,57]]`.

## Y-07-merge-default

Original 43 bytes; SHA-256 5d367def78629fec1f1c962fdcb9a386bbadd49391afd5db752e4cf9b15ddcf6; hex `626173653a202662207b783a20312c20793a20327d0a6974656d3a207b3c3c3a202a622c20793a20337d0a`.

noop 44 bytes; SHA-256 829d079a14c858b08225bfd08150f0edad92e3a8ae345e7226363ffcb13ecc7d; hex `626173653a0a2020783a20310a20202779273a20320a6974656d3a0a2020783a20310a20202779273a20330a`.

First difference: 5; complete ranges: `[[5,16],[17,21],[27,31],[33,36],[37,44]]`.

output 44 bytes; SHA-256 829d079a14c858b08225bfd08150f0edad92e3a8ae345e7226363ffcb13ecc7d; hex `626173653a0a2020783a20310a20202779273a20320a6974656d3a0a2020783a20310a20202779273a20330a`.

First difference: 5; complete ranges: `[[5,16],[17,21],[27,31],[33,36],[37,44]]`.

## Y-07-merge-extended

Original 43 bytes; SHA-256 5d367def78629fec1f1c962fdcb9a386bbadd49391afd5db752e4cf9b15ddcf6; hex `626173653a202662207b783a20312c20793a20327d0a6974656d3a207b3c3c3a202a622c20793a20337d0a`.

noop 44 bytes; SHA-256 829d079a14c858b08225bfd08150f0edad92e3a8ae345e7226363ffcb13ecc7d; hex `626173653a0a2020783a20310a20202779273a20320a6974656d3a0a2020783a20310a20202779273a20330a`.

First difference: 5; complete ranges: `[[5,16],[17,21],[27,31],[33,36],[37,44]]`.

output 44 bytes; SHA-256 829d079a14c858b08225bfd08150f0edad92e3a8ae345e7226363ffcb13ecc7d; hex `626173653a0a2020783a20310a20202779273a20320a6974656d3a0a2020783a20310a20202779273a20330a`.

First difference: 5; complete ranges: `[[5,16],[17,21],[27,31],[33,36],[37,44]]`.

## Y-08-two-parse

Original 22 bytes; SHA-256 86ba982e6bad8ee6500c0409d0746157d5ce2b0c0733b1bb2e5fe92508b61aa3; hex `2d2d2d0a613a20310a2e2e2e0a2d2d2d0a623a20320a`.

noop: unavailable; status parse-rejected.

output: unavailable; status parse-rejected.

## Y-08-two-parseAll

Original 22 bytes; SHA-256 86ba982e6bad8ee6500c0409d0746157d5ce2b0c0733b1bb2e5fe92508b61aa3; hex `2d2d2d0a613a20310a2e2e2e0a2d2d2d0a623a20320a`.

noop 14 bytes; SHA-256 678a3f4e6138a44965aa9b5fc6fa844b0f9e54d3ec1972b56aee95ed220fdcc4; hex `2d20613a20310a2d20623a20320a`.

First difference: 1; complete ranges: `[[1,22]]`.

output 14 bytes; SHA-256 678a3f4e6138a44965aa9b5fc6fa844b0f9e54d3ec1972b56aee95ed220fdcc4; hex `2d20613a20310a2d20623a20320a`.

First difference: 1; complete ranges: `[[1,22]]`.

## Y-08-empty-parse

Original 22 bytes; SHA-256 d604c5f5a865a18476eafbe85439efa3bd33589a04292503988892a02bec6380; hex `2d2d2d0a613a20310a2d2d2d0a2d2d2d0a623a20320a`.

noop: unavailable; status parse-rejected.

output: unavailable; status parse-rejected.

## Y-08-empty-parseAll

Original 22 bytes; SHA-256 d604c5f5a865a18476eafbe85439efa3bd33589a04292503988892a02bec6380; hex `2d2d2d0a613a20310a2d2d2d0a2d2d2d0a623a20320a`.

noop 21 bytes; SHA-256 bcfd7302b7957ee34d51d1f658b77fb166e9da4262df3f01ee0bc8ff6f4267ad; hex `2d20613a20310a2d206e756c6c0a2d20623a20320a`.

First difference: 1; complete ranges: `[[1,14],[15,22]]`.

output 21 bytes; SHA-256 bcfd7302b7957ee34d51d1f658b77fb166e9da4262df3f01ee0bc8ff6f4267ad; hex `2d20613a20310a2d206e756c6c0a2d20623a20320a`.

First difference: 1; complete ranges: `[[1,14],[15,22]]`.

## Y-08-invalid-parse

Original 18 bytes; SHA-256 ad724e14595516dfcaa10e786314e16a9bfd1a8b930d2ada5e7a387694615b64; hex `2d2d2d0a613a20310a2d2d2d0a623a205b0a`.

noop: unavailable; status parse-rejected.

output: unavailable; status parse-rejected.

## Y-08-invalid-parseAll

Original 18 bytes; SHA-256 ad724e14595516dfcaa10e786314e16a9bfd1a8b930d2ada5e7a387694615b64; hex `2d2d2d0a613a20310a2d2d2d0a623a205b0a`.

noop: unavailable; status parse-rejected.

output: unavailable; status parse-rejected.

## Y-09-malformed

Original 7 bytes; SHA-256 e6ae1228d54ecc7770ddd8b0e9827c1b6e7c8ac45cdd7277d64af2cb44cd1328; hex `613a205b312c0a`.

noop: unavailable; status parse-rejected.

output: unavailable; status parse-rejected.

## Y-09-indent

Original 16 bytes; SHA-256 d8dab2a5934da10ab8c224541b48236b66f19aff8b1b874b407e7394796a9007; hex `613a0a2020623a20310a20633a20320a`.

noop: unavailable; status parse-rejected.

output: unavailable; status parse-rejected.

## Y-09-anchor

Original 22 bytes; SHA-256 a77da264fd2b909d39079c4321360c63e9f8fa1cde95e781e38e2f25b63ac77e; hex `613a20267820310a623a20267820320a633a202a780a`.

noop 15 bytes; SHA-256 4258beecafd4e3ef66fca605542677ad4284f3d11f5bfa9b6e250bf4dd8696f6; hex `613a20310a623a20320a633a20320a`.

First difference: 3; complete ranges: `[[3,22]]`.

output 15 bytes; SHA-256 4258beecafd4e3ef66fca605542677ad4284f3d11f5bfa9b6e250bf4dd8696f6; hex `613a20310a623a20320a633a20320a`.

First difference: 3; complete ranges: `[[3,22]]`.

## Y-09-tab

Original 9 bytes; SHA-256 ec0f1f0a93fddb989d1de6059a369aa820b41d51c1cb6d32f1143e85e4c700c1; hex `613a0a09623a20310a`.

noop 13 bytes; SHA-256 ce0e14cfd437cf3757a886fbbece2553aad4d9210451a55255c2d618cd6d96d4; hex `613a206e756c6c0a623a20310a`.

First difference: 2; complete ranges: `[[2,13]]`.

output 13 bytes; SHA-256 ce0e14cfd437cf3757a886fbbece2553aad4d9210451a55255c2d618cd6d96d4; hex `613a206e756c6c0a623a20310a`.

First difference: 2; complete ranges: `[[2,13]]`.

## Y-10-noop

Original 48 bytes; SHA-256 59398266d4bf64051c0bf259d48937d51014dd0d7bca79ac2d9178b9aeedf656; hex `23207469746c650a6e3a2030312023206e6f74650a746578743a202768656c6c6f270a0a7365713a205b612c20625d0a`.

noop 36 bytes; SHA-256 e17aa6f4c32cb0bb06f5d5b6e0a5a09f5310012e80eaa21abd9140aa5d2e170d; hex `276e273a20310a746578743a2068656c6c6f0a7365713a0a20202d20610a20202d20620a`.

First difference: 0; complete ranges: `[[0,17],[18,35],[36,48]]`.

output 36 bytes; SHA-256 e17aa6f4c32cb0bb06f5d5b6e0a5a09f5310012e80eaa21abd9140aa5d2e170d; hex `276e273a20310a746578743a2068656c6c6f0a7365713a0a20202d20610a20202d20620a`.

First difference: 0; complete ranges: `[[0,17],[18,35],[36,48]]`.

## Y-10-edit

Original 48 bytes; SHA-256 59398266d4bf64051c0bf259d48937d51014dd0d7bca79ac2d9178b9aeedf656; hex `23207469746c650a6e3a2030312023206e6f74650a746578743a202768656c6c6f270a0a7365713a205b612c20625d0a`.

noop 36 bytes; SHA-256 e17aa6f4c32cb0bb06f5d5b6e0a5a09f5310012e80eaa21abd9140aa5d2e170d; hex `276e273a20310a746578743a2068656c6c6f0a7365713a0a20202d20610a20202d20620a`.

First difference: 0; complete ranges: `[[0,17],[18,35],[36,48]]`.

output 36 bytes; SHA-256 1d4d5bba60bb71097a812c28318ae2cdcbe92afb1547b166cf7c7b8f0dc62ca8; hex `276e273a20320a746578743a2068656c6c6f0a7365713a0a20202d20610a20202d20620a`.

First difference: 0; complete ranges: `[[0,17],[18,35],[36,48]]`.

## Y-11-literal

Original 16 bytes; SHA-256 bcccb00c7a79748a20fc644bd4ec6c7ed89e71d950a29fd3c81cd25bdbd561f1; hex `746578743a207c2b0a20206f6e650a0a`.

noop 16 bytes; SHA-256 bcccb00c7a79748a20fc644bd4ec6c7ed89e71d950a29fd3c81cd25bdbd561f1; hex `746578743a207c2b0a20206f6e650a0a`.

First difference: null; complete ranges: `[]`.

output 16 bytes; SHA-256 bcccb00c7a79748a20fc644bd4ec6c7ed89e71d950a29fd3c81cd25bdbd561f1; hex `746578743a207c2b0a20206f6e650a0a`.

First difference: null; complete ranges: `[]`.

## Y-11-folded

Original 21 bytes; SHA-256 027ed36abd558c51fe41660e69572cf2ec88368570c916abe8154f34e28eb709; hex `746578743a203e2d0a20206f6e650a202074776f0a`.

noop 14 bytes; SHA-256 f116cc3d9d1fcce24d4b4792fed21e09e73646a41c1320700e81bba25bda2b31; hex `746578743a206f6e652074776f0a`.

First difference: 6; complete ranges: `[[6,9],[10,21]]`.

output 14 bytes; SHA-256 f116cc3d9d1fcce24d4b4792fed21e09e73646a41c1320700e81bba25bda2b31; hex `746578743a206f6e652074776f0a`.

First difference: 6; complete ranges: `[[6,9],[10,21]]`.

## Y-11-directive

Original 19 bytes; SHA-256 931c3d273295860bf47391ff986eeda4c0b4ad2982b76e19554577005739d960; hex `2559414d4c20312e320a2d2d2d0a6e3a20310a`.

noop 7 bytes; SHA-256 759cc2316ae8f3f710d4cf8ac8bc4fc8174fca5e78b1b35bb126fe18665ba899; hex `276e273a20310a`.

First difference: 0; complete ranges: `[[0,19]]`.

output 7 bytes; SHA-256 759cc2316ae8f3f710d4cf8ac8bc4fc8174fca5e78b1b35bb126fe18665ba899; hex `276e273a20310a`.

First difference: 0; complete ranges: `[[0,19]]`.

## Y-11-bom

Original 8 bytes; SHA-256 c878c9a8492e9d2096ab4446d1e29d84f9c7e2429d12d464822953fb3819859a; hex `efbbbf6e3a20310a`.

noop 7 bytes; SHA-256 759cc2316ae8f3f710d4cf8ac8bc4fc8174fca5e78b1b35bb126fe18665ba899; hex `276e273a20310a`.

First difference: 0; complete ranges: `[[0,8]]`.

output 7 bytes; SHA-256 759cc2316ae8f3f710d4cf8ac8bc4fc8174fca5e78b1b35bb126fe18665ba899; hex `276e273a20310a`.

First difference: 0; complete ranges: `[[0,8]]`.

## Y-11-crlf

Original 19 bytes; SHA-256 dddb99b2c40b8fec830a4555d029e247bbd562c2cd35d4c6a4461cd6edb4e655; hex `6e3a20310d0a746578743a2068656c6c6f0d0a`.

noop 19 bytes; SHA-256 e5ad54532bb5f186bf761e3818d9df7a064fcd3bf21377beebacbfae834c9431; hex `276e273a20310a746578743a2068656c6c6f0a`.

First difference: 0; complete ranges: `[[0,15],[16,18]]`.

output 19 bytes; SHA-256 e5ad54532bb5f186bf761e3818d9df7a064fcd3bf21377beebacbfae834c9431; hex `276e273a20310a746578743a2068656c6c6f0a`.

First difference: 0; complete ranges: `[[0,15],[16,18]]`.

## Y-11-no-lf

Original 4 bytes; SHA-256 344cbf368066aaee27a03ee23ffe8a210034529e05a4d9d6b8181cfa68521a69; hex `6e3a2031`.

noop 7 bytes; SHA-256 759cc2316ae8f3f710d4cf8ac8bc4fc8174fca5e78b1b35bb126fe18665ba899; hex `276e273a20310a`.

First difference: 0; complete ranges: `[[0,7]]`.

output 7 bytes; SHA-256 759cc2316ae8f3f710d4cf8ac8bc4fc8174fca5e78b1b35bb126fe18665ba899; hex `276e273a20310a`.

First difference: 0; complete ranges: `[[0,7]]`.

## Y-12-number-9007199254740991-failsafe

Original 20 bytes; SHA-256 df952da3c4335a7bf20879af672a350edd5b310e69b85a5d2ffc4ae7eeb4596f; hex `783a20393030373139393235343734303939310a`.

noop 20 bytes; SHA-256 df952da3c4335a7bf20879af672a350edd5b310e69b85a5d2ffc4ae7eeb4596f; hex `783a20393030373139393235343734303939310a`.

First difference: null; complete ranges: `[]`.

output 20 bytes; SHA-256 df952da3c4335a7bf20879af672a350edd5b310e69b85a5d2ffc4ae7eeb4596f; hex `783a20393030373139393235343734303939310a`.

First difference: null; complete ranges: `[]`.

## Y-12-number-9007199254740991-json

Original 20 bytes; SHA-256 df952da3c4335a7bf20879af672a350edd5b310e69b85a5d2ffc4ae7eeb4596f; hex `783a20393030373139393235343734303939310a`.

noop 20 bytes; SHA-256 df952da3c4335a7bf20879af672a350edd5b310e69b85a5d2ffc4ae7eeb4596f; hex `783a20393030373139393235343734303939310a`.

First difference: null; complete ranges: `[]`.

output 20 bytes; SHA-256 df952da3c4335a7bf20879af672a350edd5b310e69b85a5d2ffc4ae7eeb4596f; hex `783a20393030373139393235343734303939310a`.

First difference: null; complete ranges: `[]`.

## Y-12-number-9007199254740991-core

Original 20 bytes; SHA-256 df952da3c4335a7bf20879af672a350edd5b310e69b85a5d2ffc4ae7eeb4596f; hex `783a20393030373139393235343734303939310a`.

noop 20 bytes; SHA-256 df952da3c4335a7bf20879af672a350edd5b310e69b85a5d2ffc4ae7eeb4596f; hex `783a20393030373139393235343734303939310a`.

First difference: null; complete ranges: `[]`.

output 20 bytes; SHA-256 df952da3c4335a7bf20879af672a350edd5b310e69b85a5d2ffc4ae7eeb4596f; hex `783a20393030373139393235343734303939310a`.

First difference: null; complete ranges: `[]`.

## Y-12-number-9007199254740991-default

Original 20 bytes; SHA-256 df952da3c4335a7bf20879af672a350edd5b310e69b85a5d2ffc4ae7eeb4596f; hex `783a20393030373139393235343734303939310a`.

noop 20 bytes; SHA-256 df952da3c4335a7bf20879af672a350edd5b310e69b85a5d2ffc4ae7eeb4596f; hex `783a20393030373139393235343734303939310a`.

First difference: null; complete ranges: `[]`.

output 20 bytes; SHA-256 df952da3c4335a7bf20879af672a350edd5b310e69b85a5d2ffc4ae7eeb4596f; hex `783a20393030373139393235343734303939310a`.

First difference: null; complete ranges: `[]`.

## Y-12-number-9007199254740991-extended

Original 20 bytes; SHA-256 df952da3c4335a7bf20879af672a350edd5b310e69b85a5d2ffc4ae7eeb4596f; hex `783a20393030373139393235343734303939310a`.

noop 20 bytes; SHA-256 df952da3c4335a7bf20879af672a350edd5b310e69b85a5d2ffc4ae7eeb4596f; hex `783a20393030373139393235343734303939310a`.

First difference: null; complete ranges: `[]`.

output 20 bytes; SHA-256 df952da3c4335a7bf20879af672a350edd5b310e69b85a5d2ffc4ae7eeb4596f; hex `783a20393030373139393235343734303939310a`.

First difference: null; complete ranges: `[]`.

## Y-12-number-9007199254740992-failsafe

Original 20 bytes; SHA-256 7e9a32708b981477f11c8e853c0fcc7499505199ec6e85d86773e8330a608ac4; hex `783a20393030373139393235343734303939320a`.

noop 20 bytes; SHA-256 7e9a32708b981477f11c8e853c0fcc7499505199ec6e85d86773e8330a608ac4; hex `783a20393030373139393235343734303939320a`.

First difference: null; complete ranges: `[]`.

output 20 bytes; SHA-256 7e9a32708b981477f11c8e853c0fcc7499505199ec6e85d86773e8330a608ac4; hex `783a20393030373139393235343734303939320a`.

First difference: null; complete ranges: `[]`.

## Y-12-number-9007199254740992-json

Original 20 bytes; SHA-256 7e9a32708b981477f11c8e853c0fcc7499505199ec6e85d86773e8330a608ac4; hex `783a20393030373139393235343734303939320a`.

noop 20 bytes; SHA-256 7e9a32708b981477f11c8e853c0fcc7499505199ec6e85d86773e8330a608ac4; hex `783a20393030373139393235343734303939320a`.

First difference: null; complete ranges: `[]`.

output 20 bytes; SHA-256 7e9a32708b981477f11c8e853c0fcc7499505199ec6e85d86773e8330a608ac4; hex `783a20393030373139393235343734303939320a`.

First difference: null; complete ranges: `[]`.

## Y-12-number-9007199254740992-core

Original 20 bytes; SHA-256 7e9a32708b981477f11c8e853c0fcc7499505199ec6e85d86773e8330a608ac4; hex `783a20393030373139393235343734303939320a`.

noop 20 bytes; SHA-256 7e9a32708b981477f11c8e853c0fcc7499505199ec6e85d86773e8330a608ac4; hex `783a20393030373139393235343734303939320a`.

First difference: null; complete ranges: `[]`.

output 20 bytes; SHA-256 7e9a32708b981477f11c8e853c0fcc7499505199ec6e85d86773e8330a608ac4; hex `783a20393030373139393235343734303939320a`.

First difference: null; complete ranges: `[]`.

## Y-12-number-9007199254740992-default

Original 20 bytes; SHA-256 7e9a32708b981477f11c8e853c0fcc7499505199ec6e85d86773e8330a608ac4; hex `783a20393030373139393235343734303939320a`.

noop 20 bytes; SHA-256 7e9a32708b981477f11c8e853c0fcc7499505199ec6e85d86773e8330a608ac4; hex `783a20393030373139393235343734303939320a`.

First difference: null; complete ranges: `[]`.

output 20 bytes; SHA-256 7e9a32708b981477f11c8e853c0fcc7499505199ec6e85d86773e8330a608ac4; hex `783a20393030373139393235343734303939320a`.

First difference: null; complete ranges: `[]`.

## Y-12-number-9007199254740992-extended

Original 20 bytes; SHA-256 7e9a32708b981477f11c8e853c0fcc7499505199ec6e85d86773e8330a608ac4; hex `783a20393030373139393235343734303939320a`.

noop 20 bytes; SHA-256 7e9a32708b981477f11c8e853c0fcc7499505199ec6e85d86773e8330a608ac4; hex `783a20393030373139393235343734303939320a`.

First difference: null; complete ranges: `[]`.

output 20 bytes; SHA-256 7e9a32708b981477f11c8e853c0fcc7499505199ec6e85d86773e8330a608ac4; hex `783a20393030373139393235343734303939320a`.

First difference: null; complete ranges: `[]`.

## Y-12-number-9007199254740993-failsafe

Original 20 bytes; SHA-256 d20ddf1b6008090900405e131a55756da4d0ee00deeb02dc8b37e221d8ca60f8; hex `783a20393030373139393235343734303939330a`.

noop 20 bytes; SHA-256 d20ddf1b6008090900405e131a55756da4d0ee00deeb02dc8b37e221d8ca60f8; hex `783a20393030373139393235343734303939330a`.

First difference: null; complete ranges: `[]`.

output 20 bytes; SHA-256 d20ddf1b6008090900405e131a55756da4d0ee00deeb02dc8b37e221d8ca60f8; hex `783a20393030373139393235343734303939330a`.

First difference: null; complete ranges: `[]`.

## Y-12-number-9007199254740993-json

Original 20 bytes; SHA-256 d20ddf1b6008090900405e131a55756da4d0ee00deeb02dc8b37e221d8ca60f8; hex `783a20393030373139393235343734303939330a`.

noop 20 bytes; SHA-256 7e9a32708b981477f11c8e853c0fcc7499505199ec6e85d86773e8330a608ac4; hex `783a20393030373139393235343734303939320a`.

First difference: 18; complete ranges: `[[18,19]]`.

output 20 bytes; SHA-256 7e9a32708b981477f11c8e853c0fcc7499505199ec6e85d86773e8330a608ac4; hex `783a20393030373139393235343734303939320a`.

First difference: 18; complete ranges: `[[18,19]]`.

## Y-12-number-9007199254740993-core

Original 20 bytes; SHA-256 d20ddf1b6008090900405e131a55756da4d0ee00deeb02dc8b37e221d8ca60f8; hex `783a20393030373139393235343734303939330a`.

noop 20 bytes; SHA-256 7e9a32708b981477f11c8e853c0fcc7499505199ec6e85d86773e8330a608ac4; hex `783a20393030373139393235343734303939320a`.

First difference: 18; complete ranges: `[[18,19]]`.

output 20 bytes; SHA-256 7e9a32708b981477f11c8e853c0fcc7499505199ec6e85d86773e8330a608ac4; hex `783a20393030373139393235343734303939320a`.

First difference: 18; complete ranges: `[[18,19]]`.

## Y-12-number-9007199254740993-default

Original 20 bytes; SHA-256 d20ddf1b6008090900405e131a55756da4d0ee00deeb02dc8b37e221d8ca60f8; hex `783a20393030373139393235343734303939330a`.

noop 20 bytes; SHA-256 7e9a32708b981477f11c8e853c0fcc7499505199ec6e85d86773e8330a608ac4; hex `783a20393030373139393235343734303939320a`.

First difference: 18; complete ranges: `[[18,19]]`.

output 20 bytes; SHA-256 7e9a32708b981477f11c8e853c0fcc7499505199ec6e85d86773e8330a608ac4; hex `783a20393030373139393235343734303939320a`.

First difference: 18; complete ranges: `[[18,19]]`.

## Y-12-number-9007199254740993-extended

Original 20 bytes; SHA-256 d20ddf1b6008090900405e131a55756da4d0ee00deeb02dc8b37e221d8ca60f8; hex `783a20393030373139393235343734303939330a`.

noop 20 bytes; SHA-256 7e9a32708b981477f11c8e853c0fcc7499505199ec6e85d86773e8330a608ac4; hex `783a20393030373139393235343734303939320a`.

First difference: 18; complete ranges: `[[18,19]]`.

output 20 bytes; SHA-256 7e9a32708b981477f11c8e853c0fcc7499505199ec6e85d86773e8330a608ac4; hex `783a20393030373139393235343734303939320a`.

First difference: 18; complete ranges: `[[18,19]]`.

## Y-12-number--9007199254740993-failsafe

Original 21 bytes; SHA-256 1d55e8080e97bfe56d25683ed61e8ebec7152d2c9091806d42cb0abd721c050d; hex `783a202d393030373139393235343734303939330a`.

noop 23 bytes; SHA-256 5c3896ecee5f512d7277b66609afff1ce6452fb136452989a7b6b5476fbc2426; hex `783a20272d39303037313939323534373430393933270a`.

First difference: 3; complete ranges: `[[3,6],[7,10],[11,18],[19,23]]`.

output 23 bytes; SHA-256 5c3896ecee5f512d7277b66609afff1ce6452fb136452989a7b6b5476fbc2426; hex `783a20272d39303037313939323534373430393933270a`.

First difference: 3; complete ranges: `[[3,6],[7,10],[11,18],[19,23]]`.

## Y-12-number--9007199254740993-json

Original 21 bytes; SHA-256 1d55e8080e97bfe56d25683ed61e8ebec7152d2c9091806d42cb0abd721c050d; hex `783a202d393030373139393235343734303939330a`.

noop 21 bytes; SHA-256 7e8cd5f7a39ff50969bfbf6934aa7adee9bbd250ad435cf1e75d58b36b13066e; hex `783a202d393030373139393235343734303939320a`.

First difference: 19; complete ranges: `[[19,20]]`.

output 21 bytes; SHA-256 7e8cd5f7a39ff50969bfbf6934aa7adee9bbd250ad435cf1e75d58b36b13066e; hex `783a202d393030373139393235343734303939320a`.

First difference: 19; complete ranges: `[[19,20]]`.

## Y-12-number--9007199254740993-core

Original 21 bytes; SHA-256 1d55e8080e97bfe56d25683ed61e8ebec7152d2c9091806d42cb0abd721c050d; hex `783a202d393030373139393235343734303939330a`.

noop 21 bytes; SHA-256 7e8cd5f7a39ff50969bfbf6934aa7adee9bbd250ad435cf1e75d58b36b13066e; hex `783a202d393030373139393235343734303939320a`.

First difference: 19; complete ranges: `[[19,20]]`.

output 21 bytes; SHA-256 7e8cd5f7a39ff50969bfbf6934aa7adee9bbd250ad435cf1e75d58b36b13066e; hex `783a202d393030373139393235343734303939320a`.

First difference: 19; complete ranges: `[[19,20]]`.

## Y-12-number--9007199254740993-default

Original 21 bytes; SHA-256 1d55e8080e97bfe56d25683ed61e8ebec7152d2c9091806d42cb0abd721c050d; hex `783a202d393030373139393235343734303939330a`.

noop 21 bytes; SHA-256 7e8cd5f7a39ff50969bfbf6934aa7adee9bbd250ad435cf1e75d58b36b13066e; hex `783a202d393030373139393235343734303939320a`.

First difference: 19; complete ranges: `[[19,20]]`.

output 21 bytes; SHA-256 7e8cd5f7a39ff50969bfbf6934aa7adee9bbd250ad435cf1e75d58b36b13066e; hex `783a202d393030373139393235343734303939320a`.

First difference: 19; complete ranges: `[[19,20]]`.

## Y-12-number--9007199254740993-extended

Original 21 bytes; SHA-256 1d55e8080e97bfe56d25683ed61e8ebec7152d2c9091806d42cb0abd721c050d; hex `783a202d393030373139393235343734303939330a`.

noop 21 bytes; SHA-256 7e8cd5f7a39ff50969bfbf6934aa7adee9bbd250ad435cf1e75d58b36b13066e; hex `783a202d393030373139393235343734303939320a`.

First difference: 19; complete ranges: `[[19,20]]`.

output 21 bytes; SHA-256 7e8cd5f7a39ff50969bfbf6934aa7adee9bbd250ad435cf1e75d58b36b13066e; hex `783a202d393030373139393235343734303939320a`.

First difference: 19; complete ranges: `[[19,20]]`.

## Y-12-number-0.1-failsafe

Original 7 bytes; SHA-256 20d5630ab2149c509ab6da34d9ba4c29af2ad4cb8a969cf0ac0efc48d831cf43; hex `783a20302e310a`.

noop 7 bytes; SHA-256 20d5630ab2149c509ab6da34d9ba4c29af2ad4cb8a969cf0ac0efc48d831cf43; hex `783a20302e310a`.

First difference: null; complete ranges: `[]`.

output 7 bytes; SHA-256 20d5630ab2149c509ab6da34d9ba4c29af2ad4cb8a969cf0ac0efc48d831cf43; hex `783a20302e310a`.

First difference: null; complete ranges: `[]`.

## Y-12-number-0.1-json

Original 7 bytes; SHA-256 20d5630ab2149c509ab6da34d9ba4c29af2ad4cb8a969cf0ac0efc48d831cf43; hex `783a20302e310a`.

noop 7 bytes; SHA-256 20d5630ab2149c509ab6da34d9ba4c29af2ad4cb8a969cf0ac0efc48d831cf43; hex `783a20302e310a`.

First difference: null; complete ranges: `[]`.

output 7 bytes; SHA-256 20d5630ab2149c509ab6da34d9ba4c29af2ad4cb8a969cf0ac0efc48d831cf43; hex `783a20302e310a`.

First difference: null; complete ranges: `[]`.

## Y-12-number-0.1-core

Original 7 bytes; SHA-256 20d5630ab2149c509ab6da34d9ba4c29af2ad4cb8a969cf0ac0efc48d831cf43; hex `783a20302e310a`.

noop 7 bytes; SHA-256 20d5630ab2149c509ab6da34d9ba4c29af2ad4cb8a969cf0ac0efc48d831cf43; hex `783a20302e310a`.

First difference: null; complete ranges: `[]`.

output 7 bytes; SHA-256 20d5630ab2149c509ab6da34d9ba4c29af2ad4cb8a969cf0ac0efc48d831cf43; hex `783a20302e310a`.

First difference: null; complete ranges: `[]`.

## Y-12-number-0.1-default

Original 7 bytes; SHA-256 20d5630ab2149c509ab6da34d9ba4c29af2ad4cb8a969cf0ac0efc48d831cf43; hex `783a20302e310a`.

noop 7 bytes; SHA-256 20d5630ab2149c509ab6da34d9ba4c29af2ad4cb8a969cf0ac0efc48d831cf43; hex `783a20302e310a`.

First difference: null; complete ranges: `[]`.

output 7 bytes; SHA-256 20d5630ab2149c509ab6da34d9ba4c29af2ad4cb8a969cf0ac0efc48d831cf43; hex `783a20302e310a`.

First difference: null; complete ranges: `[]`.

## Y-12-number-0.1-extended

Original 7 bytes; SHA-256 20d5630ab2149c509ab6da34d9ba4c29af2ad4cb8a969cf0ac0efc48d831cf43; hex `783a20302e310a`.

noop 7 bytes; SHA-256 20d5630ab2149c509ab6da34d9ba4c29af2ad4cb8a969cf0ac0efc48d831cf43; hex `783a20302e310a`.

First difference: null; complete ranges: `[]`.

output 7 bytes; SHA-256 20d5630ab2149c509ab6da34d9ba4c29af2ad4cb8a969cf0ac0efc48d831cf43; hex `783a20302e310a`.

First difference: null; complete ranges: `[]`.

## Y-12-number-1.2300-failsafe

Original 10 bytes; SHA-256 e855dd94487627d5552b28ef3e4106580201be90a9b4d6a0ff74621645d6cf1f; hex `783a20312e323330300a`.

noop 10 bytes; SHA-256 e855dd94487627d5552b28ef3e4106580201be90a9b4d6a0ff74621645d6cf1f; hex `783a20312e323330300a`.

First difference: null; complete ranges: `[]`.

output 10 bytes; SHA-256 e855dd94487627d5552b28ef3e4106580201be90a9b4d6a0ff74621645d6cf1f; hex `783a20312e323330300a`.

First difference: null; complete ranges: `[]`.

## Y-12-number-1.2300-json

Original 10 bytes; SHA-256 e855dd94487627d5552b28ef3e4106580201be90a9b4d6a0ff74621645d6cf1f; hex `783a20312e323330300a`.

noop 8 bytes; SHA-256 b290c63aca35e776e8a6cad2c4e29354a847effb484234cb31b62f9fc2ce547c; hex `783a20312e32330a`.

First difference: 7; complete ranges: `[[7,10]]`.

output 8 bytes; SHA-256 b290c63aca35e776e8a6cad2c4e29354a847effb484234cb31b62f9fc2ce547c; hex `783a20312e32330a`.

First difference: 7; complete ranges: `[[7,10]]`.

## Y-12-number-1.2300-core

Original 10 bytes; SHA-256 e855dd94487627d5552b28ef3e4106580201be90a9b4d6a0ff74621645d6cf1f; hex `783a20312e323330300a`.

noop 8 bytes; SHA-256 b290c63aca35e776e8a6cad2c4e29354a847effb484234cb31b62f9fc2ce547c; hex `783a20312e32330a`.

First difference: 7; complete ranges: `[[7,10]]`.

output 8 bytes; SHA-256 b290c63aca35e776e8a6cad2c4e29354a847effb484234cb31b62f9fc2ce547c; hex `783a20312e32330a`.

First difference: 7; complete ranges: `[[7,10]]`.

## Y-12-number-1.2300-default

Original 10 bytes; SHA-256 e855dd94487627d5552b28ef3e4106580201be90a9b4d6a0ff74621645d6cf1f; hex `783a20312e323330300a`.

noop 8 bytes; SHA-256 b290c63aca35e776e8a6cad2c4e29354a847effb484234cb31b62f9fc2ce547c; hex `783a20312e32330a`.

First difference: 7; complete ranges: `[[7,10]]`.

output 8 bytes; SHA-256 b290c63aca35e776e8a6cad2c4e29354a847effb484234cb31b62f9fc2ce547c; hex `783a20312e32330a`.

First difference: 7; complete ranges: `[[7,10]]`.

## Y-12-number-1.2300-extended

Original 10 bytes; SHA-256 e855dd94487627d5552b28ef3e4106580201be90a9b4d6a0ff74621645d6cf1f; hex `783a20312e323330300a`.

noop 8 bytes; SHA-256 b290c63aca35e776e8a6cad2c4e29354a847effb484234cb31b62f9fc2ce547c; hex `783a20312e32330a`.

First difference: 7; complete ranges: `[[7,10]]`.

output 8 bytes; SHA-256 b290c63aca35e776e8a6cad2c4e29354a847effb484234cb31b62f9fc2ce547c; hex `783a20312e32330a`.

First difference: 7; complete ranges: `[[7,10]]`.

## Y-12-number-1e400-failsafe

Original 9 bytes; SHA-256 17e37f3a21f66f7b36c44763d0056b9198d97dc6491df8dc0922e9151fda2021; hex `783a2031653430300a`.

noop 9 bytes; SHA-256 17e37f3a21f66f7b36c44763d0056b9198d97dc6491df8dc0922e9151fda2021; hex `783a2031653430300a`.

First difference: null; complete ranges: `[]`.

output 9 bytes; SHA-256 17e37f3a21f66f7b36c44763d0056b9198d97dc6491df8dc0922e9151fda2021; hex `783a2031653430300a`.

First difference: null; complete ranges: `[]`.

## Y-12-number-1e400-json

Original 9 bytes; SHA-256 17e37f3a21f66f7b36c44763d0056b9198d97dc6491df8dc0922e9151fda2021; hex `783a2031653430300a`.

noop 8 bytes; SHA-256 3d4ab7b7cdb5640f747e4bee8e2a45225f992b649e8ebd99ece67493d29c47ea; hex `783a202e696e660a`.

First difference: 3; complete ranges: `[[3,9]]`.

output 8 bytes; SHA-256 3d4ab7b7cdb5640f747e4bee8e2a45225f992b649e8ebd99ece67493d29c47ea; hex `783a202e696e660a`.

First difference: 3; complete ranges: `[[3,9]]`.

## Y-12-number-1e400-core

Original 9 bytes; SHA-256 17e37f3a21f66f7b36c44763d0056b9198d97dc6491df8dc0922e9151fda2021; hex `783a2031653430300a`.

noop 8 bytes; SHA-256 3d4ab7b7cdb5640f747e4bee8e2a45225f992b649e8ebd99ece67493d29c47ea; hex `783a202e696e660a`.

First difference: 3; complete ranges: `[[3,9]]`.

output 8 bytes; SHA-256 3d4ab7b7cdb5640f747e4bee8e2a45225f992b649e8ebd99ece67493d29c47ea; hex `783a202e696e660a`.

First difference: 3; complete ranges: `[[3,9]]`.

## Y-12-number-1e400-default

Original 9 bytes; SHA-256 17e37f3a21f66f7b36c44763d0056b9198d97dc6491df8dc0922e9151fda2021; hex `783a2031653430300a`.

noop 8 bytes; SHA-256 3d4ab7b7cdb5640f747e4bee8e2a45225f992b649e8ebd99ece67493d29c47ea; hex `783a202e696e660a`.

First difference: 3; complete ranges: `[[3,9]]`.

output 8 bytes; SHA-256 3d4ab7b7cdb5640f747e4bee8e2a45225f992b649e8ebd99ece67493d29c47ea; hex `783a202e696e660a`.

First difference: 3; complete ranges: `[[3,9]]`.

## Y-12-number-1e400-extended

Original 9 bytes; SHA-256 17e37f3a21f66f7b36c44763d0056b9198d97dc6491df8dc0922e9151fda2021; hex `783a2031653430300a`.

noop 8 bytes; SHA-256 3d4ab7b7cdb5640f747e4bee8e2a45225f992b649e8ebd99ece67493d29c47ea; hex `783a202e696e660a`.

First difference: 3; complete ranges: `[[3,9]]`.

output 8 bytes; SHA-256 3d4ab7b7cdb5640f747e4bee8e2a45225f992b649e8ebd99ece67493d29c47ea; hex `783a202e696e660a`.

First difference: 3; complete ranges: `[[3,9]]`.

## Y-12-number-1e-400-failsafe

Original 10 bytes; SHA-256 a260938845cc38dc67dc672e45ae222c0ca2412d6c13dd36072999297ea8c9ef; hex `783a2031652d3430300a`.

noop 10 bytes; SHA-256 a260938845cc38dc67dc672e45ae222c0ca2412d6c13dd36072999297ea8c9ef; hex `783a2031652d3430300a`.

First difference: null; complete ranges: `[]`.

output 10 bytes; SHA-256 a260938845cc38dc67dc672e45ae222c0ca2412d6c13dd36072999297ea8c9ef; hex `783a2031652d3430300a`.

First difference: null; complete ranges: `[]`.

## Y-12-number-1e-400-json

Original 10 bytes; SHA-256 a260938845cc38dc67dc672e45ae222c0ca2412d6c13dd36072999297ea8c9ef; hex `783a2031652d3430300a`.

noop 5 bytes; SHA-256 1153fa703ad6f4edc78e6458de443a0414614ee2bb3b04dffb6acec3eb5e09ef; hex `783a20300a`.

First difference: 3; complete ranges: `[[3,10]]`.

output 5 bytes; SHA-256 1153fa703ad6f4edc78e6458de443a0414614ee2bb3b04dffb6acec3eb5e09ef; hex `783a20300a`.

First difference: 3; complete ranges: `[[3,10]]`.

## Y-12-number-1e-400-core

Original 10 bytes; SHA-256 a260938845cc38dc67dc672e45ae222c0ca2412d6c13dd36072999297ea8c9ef; hex `783a2031652d3430300a`.

noop 5 bytes; SHA-256 1153fa703ad6f4edc78e6458de443a0414614ee2bb3b04dffb6acec3eb5e09ef; hex `783a20300a`.

First difference: 3; complete ranges: `[[3,10]]`.

output 5 bytes; SHA-256 1153fa703ad6f4edc78e6458de443a0414614ee2bb3b04dffb6acec3eb5e09ef; hex `783a20300a`.

First difference: 3; complete ranges: `[[3,10]]`.

## Y-12-number-1e-400-default

Original 10 bytes; SHA-256 a260938845cc38dc67dc672e45ae222c0ca2412d6c13dd36072999297ea8c9ef; hex `783a2031652d3430300a`.

noop 5 bytes; SHA-256 1153fa703ad6f4edc78e6458de443a0414614ee2bb3b04dffb6acec3eb5e09ef; hex `783a20300a`.

First difference: 3; complete ranges: `[[3,10]]`.

output 5 bytes; SHA-256 1153fa703ad6f4edc78e6458de443a0414614ee2bb3b04dffb6acec3eb5e09ef; hex `783a20300a`.

First difference: 3; complete ranges: `[[3,10]]`.

## Y-12-number-1e-400-extended

Original 10 bytes; SHA-256 a260938845cc38dc67dc672e45ae222c0ca2412d6c13dd36072999297ea8c9ef; hex `783a2031652d3430300a`.

noop 5 bytes; SHA-256 1153fa703ad6f4edc78e6458de443a0414614ee2bb3b04dffb6acec3eb5e09ef; hex `783a20300a`.

First difference: 3; complete ranges: `[[3,10]]`.

output 5 bytes; SHA-256 1153fa703ad6f4edc78e6458de443a0414614ee2bb3b04dffb6acec3eb5e09ef; hex `783a20300a`.

First difference: 3; complete ranges: `[[3,10]]`.

## Y-12-number--0-failsafe

Original 6 bytes; SHA-256 cb5fde2f3c4a671db1d0d0f2f727a62595b03b96f241c473f89f92a875556f7b; hex `783a202d300a`.

noop 8 bytes; SHA-256 624a580d718b7871e7199936b9a3cb0302c33811c1896196b877a60cd484c34f; hex `783a20272d30270a`.

First difference: 3; complete ranges: `[[3,8]]`.

output 8 bytes; SHA-256 624a580d718b7871e7199936b9a3cb0302c33811c1896196b877a60cd484c34f; hex `783a20272d30270a`.

First difference: 3; complete ranges: `[[3,8]]`.

## Y-12-number--0-json

Original 6 bytes; SHA-256 cb5fde2f3c4a671db1d0d0f2f727a62595b03b96f241c473f89f92a875556f7b; hex `783a202d300a`.

noop 5 bytes; SHA-256 1153fa703ad6f4edc78e6458de443a0414614ee2bb3b04dffb6acec3eb5e09ef; hex `783a20300a`.

First difference: 3; complete ranges: `[[3,6]]`.

output 5 bytes; SHA-256 1153fa703ad6f4edc78e6458de443a0414614ee2bb3b04dffb6acec3eb5e09ef; hex `783a20300a`.

First difference: 3; complete ranges: `[[3,6]]`.

## Y-12-number--0-core

Original 6 bytes; SHA-256 cb5fde2f3c4a671db1d0d0f2f727a62595b03b96f241c473f89f92a875556f7b; hex `783a202d300a`.

noop 5 bytes; SHA-256 1153fa703ad6f4edc78e6458de443a0414614ee2bb3b04dffb6acec3eb5e09ef; hex `783a20300a`.

First difference: 3; complete ranges: `[[3,6]]`.

output 5 bytes; SHA-256 1153fa703ad6f4edc78e6458de443a0414614ee2bb3b04dffb6acec3eb5e09ef; hex `783a20300a`.

First difference: 3; complete ranges: `[[3,6]]`.

## Y-12-number--0-default

Original 6 bytes; SHA-256 cb5fde2f3c4a671db1d0d0f2f727a62595b03b96f241c473f89f92a875556f7b; hex `783a202d300a`.

noop 5 bytes; SHA-256 1153fa703ad6f4edc78e6458de443a0414614ee2bb3b04dffb6acec3eb5e09ef; hex `783a20300a`.

First difference: 3; complete ranges: `[[3,6]]`.

output 5 bytes; SHA-256 1153fa703ad6f4edc78e6458de443a0414614ee2bb3b04dffb6acec3eb5e09ef; hex `783a20300a`.

First difference: 3; complete ranges: `[[3,6]]`.

## Y-12-number--0-extended

Original 6 bytes; SHA-256 cb5fde2f3c4a671db1d0d0f2f727a62595b03b96f241c473f89f92a875556f7b; hex `783a202d300a`.

noop 5 bytes; SHA-256 1153fa703ad6f4edc78e6458de443a0414614ee2bb3b04dffb6acec3eb5e09ef; hex `783a20300a`.

First difference: 3; complete ranges: `[[3,6]]`.

output 5 bytes; SHA-256 1153fa703ad6f4edc78e6458de443a0414614ee2bb3b04dffb6acec3eb5e09ef; hex `783a20300a`.

First difference: 3; complete ranges: `[[3,6]]`.

## Y-12-presence-0

Original 3 bytes; SHA-256 ca3d163bab055381827226140568f3bef7eaac187cebd76878e0b63e9e442356; hex `7b7d0a`.

noop 3 bytes; SHA-256 ca3d163bab055381827226140568f3bef7eaac187cebd76878e0b63e9e442356; hex `7b7d0a`.

First difference: null; complete ranges: `[]`.

output 3 bytes; SHA-256 ca3d163bab055381827226140568f3bef7eaac187cebd76878e0b63e9e442356; hex `7b7d0a`.

First difference: null; complete ranges: `[]`.

## Y-12-presence-1

Original 8 bytes; SHA-256 50fe8bf6d5dc88190ba468250cd1b71d1904307c263a7e2b9b7643b623151c43; hex `783a206e756c6c0a`.

noop 8 bytes; SHA-256 50fe8bf6d5dc88190ba468250cd1b71d1904307c263a7e2b9b7643b623151c43; hex `783a206e756c6c0a`.

First difference: null; complete ranges: `[]`.

output 8 bytes; SHA-256 50fe8bf6d5dc88190ba468250cd1b71d1904307c263a7e2b9b7643b623151c43; hex `783a206e756c6c0a`.

First difference: null; complete ranges: `[]`.

## Y-12-presence-2

Original 9 bytes; SHA-256 f919c7b41a18ce28e45f2fd1559c61ed363a36a968de27dda28ecc4db3859262; hex `783a2066616c73650a`.

noop 9 bytes; SHA-256 f919c7b41a18ce28e45f2fd1559c61ed363a36a968de27dda28ecc4db3859262; hex `783a2066616c73650a`.

First difference: null; complete ranges: `[]`.

output 9 bytes; SHA-256 f919c7b41a18ce28e45f2fd1559c61ed363a36a968de27dda28ecc4db3859262; hex `783a2066616c73650a`.

First difference: null; complete ranges: `[]`.

## Y-12-presence-3

Original 5 bytes; SHA-256 1153fa703ad6f4edc78e6458de443a0414614ee2bb3b04dffb6acec3eb5e09ef; hex `783a20300a`.

noop 5 bytes; SHA-256 1153fa703ad6f4edc78e6458de443a0414614ee2bb3b04dffb6acec3eb5e09ef; hex `783a20300a`.

First difference: null; complete ranges: `[]`.

output 5 bytes; SHA-256 1153fa703ad6f4edc78e6458de443a0414614ee2bb3b04dffb6acec3eb5e09ef; hex `783a20300a`.

First difference: null; complete ranges: `[]`.

## Y-12-presence-4

Original 6 bytes; SHA-256 7108a8e66c6c22a10ad0f0d79fcc62ec550866a90e69e2de4a49c782c9ef96b1; hex `783a2022220a`.

noop 6 bytes; SHA-256 9160b15b92db2a6344f9c094ade9f1d74082dceb449ba26afd3087eae092eca8; hex `783a2027270a`.

First difference: 3; complete ranges: `[[3,5]]`.

output 6 bytes; SHA-256 9160b15b92db2a6344f9c094ade9f1d74082dceb449ba26afd3087eae092eca8; hex `783a2027270a`.

First difference: 3; complete ranges: `[[3,5]]`.

## Y-12-own-undefined

Original 3 bytes; SHA-256 ca3d163bab055381827226140568f3bef7eaac187cebd76878e0b63e9e442356; hex `7b7d0a`.

noop 40 bytes; SHA-256 4ff83a728422430e52a5b97813821d967fe29613adb519da55a0d3d02a96c70e; hex `783a20213c7461673a79616d6c2e6f72672c323030323a6a732f756e646566696e65643e2027270a`.

First difference: 0; complete ranges: `[[0,40]]`.

output 40 bytes; SHA-256 4ff83a728422430e52a5b97813821d967fe29613adb519da55a0d3d02a96c70e; hex `783a20213c7461673a79616d6c2e6f72672c323030323a6a732f756e646566696e65643e2027270a`.

First difference: 0; complete ranges: `[[0,40]]`.

## Y-12-exact-keys

Original 96 bytes; SHA-256 2bee2c947fe75ef4006254fcab25e46fa862ce0ed4d0ddcba3da1651a721025c; hex `66697273742d6e616d653a20300a66697273744e616d653a20310a22223a20320a22613a62223a20330a612f623a20340a227e223a20350a5f5f70726f746f5f5f3a20360a636f6e7374727563746f723a20370a746f537472696e673a20380a`.

noop 96 bytes; SHA-256 7be9be7c19f2c95a29b764a75620761f4a8afcf4aa04fb1114404b81c7186c43; hex `66697273742d6e616d653a20300a66697273744e616d653a20310a27273a20320a27613a62273a20330a612f623a20340a277e273a20350a5f5f70726f746f5f5f3a20360a636f6e7374727563746f723a20370a746f537472696e673a20380a`.

First difference: 27; complete ranges: `[[27,29],[33,34],[37,38],[49,50],[51,52]]`.

output 105 bytes; SHA-256 9fb5bc289f66d435cf778e4ce74145bd302ff3ebd038152252d7dc890cf3c544; hex `66697273742d6e616d653a2031300a66697273744e616d653a2031310a27273a2031320a27613a62273a2031330a612f623a2031340a277e273a2031350a5f5f70726f746f5f5f3a2031360a636f6e7374727563746f723a2031370a746f537472696e673a2031380a`.

First difference: 12; complete ranges: `[[12,38],[39,63],[64,76],[77,84],[86,105]]`.

## Y-15-Date-skipfalse

Original 0 bytes; SHA-256 e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; hex ``.

noop 25 bytes; SHA-256 141bb38e60eb2632920826d667cefe799f62b5afd6e828d9852eb53aad61abad; hex `323032362d30392d31325430303a30303a30302e3030305a0a`.

First difference: 0; complete ranges: `[[0,25]]`.

output 25 bytes; SHA-256 141bb38e60eb2632920826d667cefe799f62b5afd6e828d9852eb53aad61abad; hex `323032362d30392d31325430303a30303a30302e3030305a0a`.

First difference: 0; complete ranges: `[[0,25]]`.

## Y-15-Date-skiptrue

Original 0 bytes; SHA-256 e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; hex ``.

noop 25 bytes; SHA-256 141bb38e60eb2632920826d667cefe799f62b5afd6e828d9852eb53aad61abad; hex `323032362d30392d31325430303a30303a30302e3030305a0a`.

First difference: 0; complete ranges: `[[0,25]]`.

output 25 bytes; SHA-256 141bb38e60eb2632920826d667cefe799f62b5afd6e828d9852eb53aad61abad; hex `323032362d30392d31325430303a30303a30302e3030305a0a`.

First difference: 0; complete ranges: `[[0,25]]`.

## Y-15-Map-skipfalse

Original 0 bytes; SHA-256 e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; hex ``.

noop 3 bytes; SHA-256 ca3d163bab055381827226140568f3bef7eaac187cebd76878e0b63e9e442356; hex `7b7d0a`.

First difference: 0; complete ranges: `[[0,3]]`.

output 3 bytes; SHA-256 ca3d163bab055381827226140568f3bef7eaac187cebd76878e0b63e9e442356; hex `7b7d0a`.

First difference: 0; complete ranges: `[[0,3]]`.

## Y-15-Map-skiptrue

Original 0 bytes; SHA-256 e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; hex ``.

noop 3 bytes; SHA-256 ca3d163bab055381827226140568f3bef7eaac187cebd76878e0b63e9e442356; hex `7b7d0a`.

First difference: 0; complete ranges: `[[0,3]]`.

output 3 bytes; SHA-256 ca3d163bab055381827226140568f3bef7eaac187cebd76878e0b63e9e442356; hex `7b7d0a`.

First difference: 0; complete ranges: `[[0,3]]`.

## Y-15-Set-skipfalse

Original 0 bytes; SHA-256 e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; hex ``.

noop 3 bytes; SHA-256 ca3d163bab055381827226140568f3bef7eaac187cebd76878e0b63e9e442356; hex `7b7d0a`.

First difference: 0; complete ranges: `[[0,3]]`.

output 3 bytes; SHA-256 ca3d163bab055381827226140568f3bef7eaac187cebd76878e0b63e9e442356; hex `7b7d0a`.

First difference: 0; complete ranges: `[[0,3]]`.

## Y-15-Set-skiptrue

Original 0 bytes; SHA-256 e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; hex ``.

noop 3 bytes; SHA-256 ca3d163bab055381827226140568f3bef7eaac187cebd76878e0b63e9e442356; hex `7b7d0a`.

First difference: 0; complete ranges: `[[0,3]]`.

output 3 bytes; SHA-256 ca3d163bab055381827226140568f3bef7eaac187cebd76878e0b63e9e442356; hex `7b7d0a`.

First difference: 0; complete ranges: `[[0,3]]`.

## Y-15-undefined-skipfalse

Original 0 bytes; SHA-256 e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; hex ``.

noop: unavailable; status stringify-rejected.

output: unavailable; status stringify-rejected.

## Y-15-undefined-skiptrue

Original 0 bytes; SHA-256 e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; hex ``.

noop 0 bytes; SHA-256 e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; hex ``.

First difference: null; complete ranges: `[]`.

output 0 bytes; SHA-256 e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; hex ``.

First difference: null; complete ranges: `[]`.

## Y-15-function-skipfalse

Original 0 bytes; SHA-256 e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; hex ``.

noop: unavailable; status stringify-rejected.

output: unavailable; status stringify-rejected.

## Y-15-function-skiptrue

Original 0 bytes; SHA-256 e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; hex ``.

noop 0 bytes; SHA-256 e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; hex ``.

First difference: null; complete ranges: `[]`.

output 0 bytes; SHA-256 e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; hex ``.

First difference: null; complete ranges: `[]`.

## Y-15-cycle-skipfalse

Original 0 bytes; SHA-256 e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; hex ``.

noop 20 bytes; SHA-256 1338a3e8ae64a269ee59fa316a6f17589887bf7141a422f1e72050c84fa696a4; hex `267265665f300a73656c663a202a7265665f300a`.

First difference: 0; complete ranges: `[[0,20]]`.

output 20 bytes; SHA-256 1338a3e8ae64a269ee59fa316a6f17589887bf7141a422f1e72050c84fa696a4; hex `267265665f300a73656c663a202a7265665f300a`.

First difference: 0; complete ranges: `[[0,20]]`.

## Y-15-cycle-skiptrue

Original 0 bytes; SHA-256 e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; hex ``.

noop 20 bytes; SHA-256 1338a3e8ae64a269ee59fa316a6f17589887bf7141a422f1e72050c84fa696a4; hex `267265665f300a73656c663a202a7265665f300a`.

First difference: 0; complete ranges: `[[0,20]]`.

output 20 bytes; SHA-256 1338a3e8ae64a269ee59fa316a6f17589887bf7141a422f1e72050c84fa696a4; hex `267265665f300a73656c663a202a7265665f300a`.

First difference: 0; complete ranges: `[[0,20]]`.
