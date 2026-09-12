# Byte evidence — J2-B01

Exact hex and SHA-256 below supplement every run’s stdout/stderr and pre/post file hex. Offsets are zero-based half-open ranges; EOF is the shorter length. Diffs use deterministic byte SequenceMatcher with autojunk disabled; a possible alignment is reported, not a unique edit history. Each non-equal opcode maps original[a:b] to rewritten[c:d].

Classification: numeric/duplicate/decoder/comment losses are observed fidelity costs; whitespace/key/escape normalization is not an intended semantic edit. J-01/J-08/J-12-edit intentionally change values; their other byte changes are separately visible. No unexplained byte difference is silently accepted as preservation.

## J-01-edit destination

Original: 21 bytes; SHA-256 `fca4379c363a235123200f4e738bba72fc9bd44e674177c9811454f1ef3b7b07`; hex `4f524947494e414c2044455354494e4154494f4e0a`.

Observed: 52 bytes; SHA-256 `390b361e7243fdd0e7964de6741350c30fcd7a54ea588065e461f6fa6705f8d4`; hex `7b226e616d65223a22416461222c226e223a322c22666c616773223a5b747275652c66616c73655d2c226e696c223a6e756c6c7d`.

First difference: 0. Ranges: replace [0:6] -> [0:9]; replace [7:21] -> [10:52].

## J-01-edit source versus edited output

Original: 53 bytes; SHA-256 `7dcd4a5d1d89546c8ab1ccb9c3fec9f69bfa37f75dbb3c34c5dd50158c72090a`; hex `7b226e616d65223a22416461222c226e223a312c22666c616773223a5b747275652c66616c73655d2c226e696c223a6e756c6c7d0a`.

Observed: 52 bytes; SHA-256 `390b361e7243fdd0e7964de6741350c30fcd7a54ea588065e461f6fa6705f8d4`; hex `7b226e616d65223a22416461222c226e223a322c22666c616773223a5b747275652c66616c73655d2c226e696c223a6e756c6c7d`.

First difference: 18. Ranges: replace [18:19] -> [18:19]; delete [52:53] -> [52:52].

## J-02-null

Original: 4 bytes; SHA-256 `74234e98afe7498fb5daf1f36ac2d78acc339464f950703b8c019892f982b90b`; hex `6e756c6c`.

Observed: 4 bytes; SHA-256 `74234e98afe7498fb5daf1f36ac2d78acc339464f950703b8c019892f982b90b`; hex `6e756c6c`.

First difference: none (identical). Ranges: none.

## J-02-false

Original: 5 bytes; SHA-256 `fcbcf165908dd18a9e49f7ff27810176db8e9f63b4352213741664245224f8aa`; hex `66616c7365`.

Observed: 5 bytes; SHA-256 `fcbcf165908dd18a9e49f7ff27810176db8e9f63b4352213741664245224f8aa`; hex `66616c7365`.

First difference: none (identical). Ranges: none.

## J-02-zero

Original: 1 bytes; SHA-256 `5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9`; hex `30`.

Observed: 1 bytes; SHA-256 `5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9`; hex `30`.

First difference: none (identical). Ranges: none.

## J-02-empty-string

Original: 2 bytes; SHA-256 `12ae32cb1ec02d01eda3581b127c1fee3b0dc53572ed6baf239721a03d82e126`; hex `2222`.

Observed: 2 bytes; SHA-256 `12ae32cb1ec02d01eda3581b127c1fee3b0dc53572ed6baf239721a03d82e126`; hex `2222`.

First difference: none (identical). Ranges: none.

## J-02-array

Original: 2 bytes; SHA-256 `4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945`; hex `5b5d`.

Observed: 2 bytes; SHA-256 `4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945`; hex `5b5d`.

First difference: none (identical). Ranges: none.

## J-02-object

Original: 2 bytes; SHA-256 `44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a`; hex `7b7d`.

Observed: 2 bytes; SHA-256 `44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a`; hex `7b7d`.

First difference: none (identical). Ranges: none.

## J-03-1 destination

Original: 21 bytes; SHA-256 `fca4379c363a235123200f4e738bba72fc9bd44e674177c9811454f1ef3b7b07`; hex `4f524947494e414c2044455354494e4154494f4e0a`.

Observed: 21 bytes; SHA-256 `fca4379c363a235123200f4e738bba72fc9bd44e674177c9811454f1ef3b7b07`; hex `4f524947494e414c2044455354494e4154494f4e0a`.

First difference: none (identical). Ranges: none.

## J-03-2 destination

Original: 21 bytes; SHA-256 `fca4379c363a235123200f4e738bba72fc9bd44e674177c9811454f1ef3b7b07`; hex `4f524947494e414c2044455354494e4154494f4e0a`.

Observed: 21 bytes; SHA-256 `fca4379c363a235123200f4e738bba72fc9bd44e674177c9811454f1ef3b7b07`; hex `4f524947494e414c2044455354494e4154494f4e0a`.

First difference: none (identical). Ranges: none.

## J-03-3 destination

Original: 21 bytes; SHA-256 `fca4379c363a235123200f4e738bba72fc9bd44e674177c9811454f1ef3b7b07`; hex `4f524947494e414c2044455354494e4154494f4e0a`.

Observed: 21 bytes; SHA-256 `fca4379c363a235123200f4e738bba72fc9bd44e674177c9811454f1ef3b7b07`; hex `4f524947494e414c2044455354494e4154494f4e0a`.

First difference: none (identical). Ranges: none.

## J-03-4 destination

Original: 21 bytes; SHA-256 `fca4379c363a235123200f4e738bba72fc9bd44e674177c9811454f1ef3b7b07`; hex `4f524947494e414c2044455354494e4154494f4e0a`.

Observed: 21 bytes; SHA-256 `fca4379c363a235123200f4e738bba72fc9bd44e674177c9811454f1ef3b7b07`; hex `4f524947494e414c2044455354494e4154494f4e0a`.

First difference: none (identical). Ranges: none.

## J-03-5 destination

Original: 21 bytes; SHA-256 `fca4379c363a235123200f4e738bba72fc9bd44e674177c9811454f1ef3b7b07`; hex `4f524947494e414c2044455354494e4154494f4e0a`.

Observed: 21 bytes; SHA-256 `fca4379c363a235123200f4e738bba72fc9bd44e674177c9811454f1ef3b7b07`; hex `4f524947494e414c2044455354494e4154494f4e0a`.

First difference: none (identical). Ranges: none.

## J-03-6 destination

Original: 21 bytes; SHA-256 `fca4379c363a235123200f4e738bba72fc9bd44e674177c9811454f1ef3b7b07`; hex `4f524947494e414c2044455354494e4154494f4e0a`.

Observed: 21 bytes; SHA-256 `fca4379c363a235123200f4e738bba72fc9bd44e674177c9811454f1ef3b7b07`; hex `4f524947494e414c2044455354494e4154494f4e0a`.

First difference: none (identical). Ranges: none.

## J-04-1

Original: 16 bytes; SHA-256 `f40b423c2dd95ff2b2f027e22208f438cf7242862e5e746860e697308c9add26`; hex `39303037313939323534373430393931`.

Observed: 16 bytes; SHA-256 `f40b423c2dd95ff2b2f027e22208f438cf7242862e5e746860e697308c9add26`; hex `39303037313939323534373430393931`.

First difference: none (identical). Ranges: none.

## J-04-2

Original: 16 bytes; SHA-256 `c681da39d7273a6a24c15c9cac3a75526ff2ecf8ba4ee60346a0c70c8163bdb2`; hex `39303037313939323534373430393932`.

Observed: 16 bytes; SHA-256 `c681da39d7273a6a24c15c9cac3a75526ff2ecf8ba4ee60346a0c70c8163bdb2`; hex `39303037313939323534373430393932`.

First difference: none (identical). Ranges: none.

## J-04-3

Original: 16 bytes; SHA-256 `a1c367c29158357e62a3ff5d3e800fb7698a22396439dbc0a9d4929322afd35d`; hex `39303037313939323534373430393933`.

Observed: 16 bytes; SHA-256 `c681da39d7273a6a24c15c9cac3a75526ff2ecf8ba4ee60346a0c70c8163bdb2`; hex `39303037313939323534373430393932`.

First difference: 15. Ranges: replace [15:16] -> [15:16].

## J-04-4

Original: 17 bytes; SHA-256 `7d7aaf1cc7ba0797dd856e1f40fc9f3dd00d70b497e32fb6493faaa587b90435`; hex `2d39303037313939323534373430393933`.

Observed: 17 bytes; SHA-256 `83e109bfd7fb4984b47a46f363627c18dbbd7e57e36b05a04cd162d304df72e9`; hex `2d39303037313939323534373430393932`.

First difference: 16. Ranges: replace [16:17] -> [16:17].

## J-04-5

Original: 3 bytes; SHA-256 `14be4b45f18e0d8c67b4f719b5144eee88497e413709d11d85b096d8e2346310`; hex `302e31`.

Observed: 3 bytes; SHA-256 `14be4b45f18e0d8c67b4f719b5144eee88497e413709d11d85b096d8e2346310`; hex `302e31`.

First difference: none (identical). Ranges: none.

## J-04-6

Original: 6 bytes; SHA-256 `8410f0402d0a3a770db9851714606f9803cb7833f20fc2f94dc8f2ef96d1be84`; hex `312e32333030`.

Observed: 4 bytes; SHA-256 `5dcdf9da31212582fc88326231ab1f9aadc986cc710f5e2946989d5df3afa8d0`; hex `312e3233`.

First difference: 4. Ranges: delete [4:6] -> [4:4].

## J-04-7

Original: 5 bytes; SHA-256 `f2bba4568fecd4b9729970732e571ac9373a33fb2d6a960794a41f0f2ecdbc25`; hex `3165343030`.

Observed: 4 bytes; SHA-256 `74234e98afe7498fb5daf1f36ac2d78acc339464f950703b8c019892f982b90b`; hex `6e756c6c`.

First difference: 0. Ranges: replace [0:5] -> [0:4].

## J-04-8

Original: 6 bytes; SHA-256 `d42d88695a3f56ff2ce7799a2f261ccb39a2b1a5db8ed284b74b9c452804ed16`; hex `31652d343030`.

Observed: 1 bytes; SHA-256 `5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9`; hex `30`.

First difference: 0. Ranges: delete [0:4] -> [0:0]; delete [5:6] -> [1:1].

## J-04-9

Original: 2 bytes; SHA-256 `ed79f26d03f412bde3db206601a698e0bb451bea9e3cc25289636ac17ea74b0a`; hex `2d30`.

Observed: 1 bytes; SHA-256 `5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9`; hex `30`.

First difference: 0. Ranges: delete [0:1] -> [0:0].

## J-07-absent

Original: 2 bytes; SHA-256 `44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a`; hex `7b7d`.

Observed: 2 bytes; SHA-256 `44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a`; hex `7b7d`.

First difference: none (identical). Ranges: none.

## J-07-null

Original: 10 bytes; SHA-256 `c6b8df5aba33a39cbdee46ffaf77fae93ea2aa7d99d66408162b05a42105bd71`; hex `7b2278223a6e756c6c7d`.

Observed: 10 bytes; SHA-256 `c6b8df5aba33a39cbdee46ffaf77fae93ea2aa7d99d66408162b05a42105bd71`; hex `7b2278223a6e756c6c7d`.

First difference: none (identical). Ranges: none.

## J-07-false

Original: 11 bytes; SHA-256 `45149ebe187b34909058477d83b3aa34fcab4cfe6cb106fd614595a479954085`; hex `7b2278223a66616c73657d`.

Observed: 11 bytes; SHA-256 `45149ebe187b34909058477d83b3aa34fcab4cfe6cb106fd614595a479954085`; hex `7b2278223a66616c73657d`.

First difference: none (identical). Ranges: none.

## J-07-zero

Original: 7 bytes; SHA-256 `5bff452c5ed93f2e87a23984db5a15050c6477335fdec955b70063bb2d692bf1`; hex `7b2278223a307d`.

Observed: 7 bytes; SHA-256 `5bff452c5ed93f2e87a23984db5a15050c6477335fdec955b70063bb2d692bf1`; hex `7b2278223a307d`.

First difference: none (identical). Ranges: none.

## J-07-empty

Original: 8 bytes; SHA-256 `7d73b63cce8409d230db137d8be7f40e4d49bc4d79735ef9835ebd4a9d68106d`; hex `7b2278223a22227d`.

Observed: 8 bytes; SHA-256 `7d73b63cce8409d230db137d8be7f40e4d49bc4d79735ef9835ebd4a9d68106d`; hex `7b2278223a22227d`.

First difference: none (identical). Ranges: none.

## J-07-undefined

Original: 2 bytes; SHA-256 `44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a`; hex `7b7d`.

Observed: 2 bytes; SHA-256 `44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a`; hex `7b7d`.

First difference: none (identical). Ranges: none.

## J-08-keys

Original: 100 bytes; SHA-256 `75152af5a1e46de38f65be71703d4e72bc73c6d007baf0797251ec45d1fd1f52`; hex `7b2266697273742d6e616d65223a302c2266697273744e616d65223a312c22223a322c22613a62223a332c22612f62223a342c227e223a352c225f5f70726f746f5f5f223a362c22636f6e7374727563746f72223a372c22746f537472696e67223a387d`.

Observed: 109 bytes; SHA-256 `47ab43fa97844239a8ca65336e323d81a8fbee63f784082133c63050d3e4277e`; hex `7b2266697273742d6e616d65223a31302c2266697273744e616d65223a31312c22223a31322c22613a62223a31332c22612f62223a31342c227e223a31352c225f5f70726f746f5f5f223a31362c22636f6e7374727563746f72223a31372c22746f537472696e67223a31387d`.

First difference: 14. Ranges: insert [14:14] -> [14:15]; insert [29:29] -> [30:31]; insert [33:33] -> [35:36]; insert [41:41] -> [44:45]; insert [49:49] -> [53:54]; insert [55:55] -> [60:61]; insert [69:69] -> [75:76]; insert [85:85] -> [92:93]; insert [98:98] -> [106:107].

## J-10-native-0 order 1

Original: 54 bytes; SHA-256 `1e2f703bd7e303e9832064172959b23f36f2c89a305fd0134d55061bbeb16723`; hex `7b2261223a312c22c3a9223a322c22f09f9880223a332c226e6573746564223a7b2232223a322c223130223a31302c2261223a307d7d`.

Observed: 54 bytes; SHA-256 `1e2f703bd7e303e9832064172959b23f36f2c89a305fd0134d55061bbeb16723`; hex `7b2261223a312c22c3a9223a322c22f09f9880223a332c226e6573746564223a7b2232223a322c223130223a31302c2261223a307d7d`.

First difference: none (identical). Ranges: none.

## J-10-native-0 order 2

Original: 54 bytes; SHA-256 `dc8fa0aab92fce1e2318500e10e189c460a51c3e20211d3636ea4f8478804fe1`; hex `7b226e6573746564223a7b2261223a302c223130223a31302c2232223a327d2c22f09f9880223a332c22c3a9223a322c2261223a317d`.

Observed: 54 bytes; SHA-256 `d00647c2cb999e2a7acf71177a1c8d1cb98eeb3bc299b3b8d09c35db83d76a1a`; hex `7b226e6573746564223a7b2232223a322c223130223a31302c2261223a307d2c22f09f9880223a332c22c3a9223a322c2261223a317d`.

First difference: 12. Ranges: replace [12:13] -> [12:13]; replace [15:16] -> [15:16]; replace [26:27] -> [26:27]; replace [29:30] -> [29:30].

## J-10-native-2 order 1

Original: 54 bytes; SHA-256 `1e2f703bd7e303e9832064172959b23f36f2c89a305fd0134d55061bbeb16723`; hex `7b2261223a312c22c3a9223a322c22f09f9880223a332c226e6573746564223a7b2232223a322c223130223a31302c2261223a307d7d`.

Observed: 92 bytes; SHA-256 `4255637ba00f56230254783c14f9357807ae618c1230e33403eeecc99de3356d`; hex `7b0a20202261223a20312c0a202022c3a9223a20322c0a202022f09f9880223a20332c0a2020226e6573746564223a207b0a202020202232223a20322c0a20202020223130223a2031302c0a202020202261223a20300a20207d0a7d`.

First difference: 1. Ranges: insert [1:1] -> [1:4]; insert [5:5] -> [8:9]; insert [7:7] -> [11:14]; insert [12:12] -> [19:20]; insert [14:14] -> [22:25]; insert [21:21] -> [32:33]; insert [23:23] -> [35:38]; insert [32:32] -> [47:48]; insert [33:33] -> [49:54]; insert [37:37] -> [58:59]; insert [39:39] -> [61:66]; insert [44:44] -> [71:72]; insert [47:47] -> [75:80]; insert [51:51] -> [84:85]; insert [52:52] -> [86:89]; insert [53:53] -> [90:91].

## J-10-native-2 order 2

Original: 54 bytes; SHA-256 `dc8fa0aab92fce1e2318500e10e189c460a51c3e20211d3636ea4f8478804fe1`; hex `7b226e6573746564223a7b2261223a302c223130223a31302c2232223a327d2c22f09f9880223a332c22c3a9223a322c2261223a317d`.

Observed: 92 bytes; SHA-256 `1d51d5dd4bf5f543c9122281c90e56e197b13114462e6290c3dfa197e763d50e`; hex `7b0a2020226e6573746564223a207b0a202020202232223a20322c0a20202020223130223a2031302c0a202020202261223a20300a20207d2c0a202022f09f9880223a20332c0a202022c3a9223a20322c0a20202261223a20310a7d`.

First difference: 1. Ranges: insert [1:1] -> [1:4]; insert [10:10] -> [13:14]; insert [11:11] -> [15:20]; replace [12:13] -> [21:22]; replace [15:16] -> [24:26]; insert [17:17] -> [27:32]; insert [22:22] -> [37:38]; insert [25:25] -> [41:46]; replace [26:27] -> [47:48]; replace [29:30] -> [50:55]; insert [32:32] -> [57:60]; insert [39:39] -> [67:68]; insert [41:41] -> [70:73]; insert [46:46] -> [78:79]; insert [48:48] -> [81:84]; insert [52:52] -> [88:89]; insert [53:53] -> [90:91].

## J-10-native-10 order 1

Original: 54 bytes; SHA-256 `1e2f703bd7e303e9832064172959b23f36f2c89a305fd0134d55061bbeb16723`; hex `7b2261223a312c22c3a9223a322c22f09f9880223a332c226e6573746564223a7b2232223a322c223130223a31302c2261223a307d7d`.

Observed: 180 bytes; SHA-256 `6d23aa33991d7a5a5fa6777b317ead65eaf2988c61e74747f2eda2657328602f`; hex `7b0a202020202020202020202261223a20312c0a2020202020202020202022c3a9223a20322c0a2020202020202020202022f09f9880223a20332c0a20202020202020202020226e6573746564223a207b0a20202020202020202020202020202020202020202232223a20322c0a2020202020202020202020202020202020202020223130223a2031302c0a20202020202020202020202020202020202020202261223a20300a202020202020202020207d0a7d`.

First difference: 1. Ranges: insert [1:1] -> [1:12]; insert [5:5] -> [16:17]; insert [7:7] -> [19:30]; insert [12:12] -> [35:36]; insert [14:14] -> [38:49]; insert [21:21] -> [56:57]; insert [23:23] -> [59:70]; insert [32:32] -> [79:80]; insert [33:33] -> [81:102]; insert [37:37] -> [106:107]; insert [39:39] -> [109:130]; insert [44:44] -> [135:136]; insert [47:47] -> [139:160]; insert [51:51] -> [164:165]; insert [52:52] -> [166:177]; insert [53:53] -> [178:179].

## J-10-native-10 order 2

Original: 54 bytes; SHA-256 `dc8fa0aab92fce1e2318500e10e189c460a51c3e20211d3636ea4f8478804fe1`; hex `7b226e6573746564223a7b2261223a302c223130223a31302c2232223a327d2c22f09f9880223a332c22c3a9223a322c2261223a317d`.

Observed: 180 bytes; SHA-256 `e0fa3e9f8b9b634ad0a1099b752c85505598470ad1d553336eeed8ce9dc5e3af`; hex `7b0a20202020202020202020226e6573746564223a207b0a20202020202020202020202020202020202020202232223a20322c0a2020202020202020202020202020202020202020223130223a2031302c0a20202020202020202020202020202020202020202261223a20300a202020202020202020207d2c0a2020202020202020202022f09f9880223a20332c0a2020202020202020202022c3a9223a20322c0a202020202020202020202261223a20310a7d`.

First difference: 1. Ranges: insert [1:1] -> [1:12]; insert [10:10] -> [21:22]; insert [11:11] -> [23:44]; replace [12:13] -> [45:46]; replace [15:16] -> [48:50]; insert [17:17] -> [51:72]; insert [22:22] -> [77:78]; insert [25:25] -> [81:102]; replace [26:27] -> [103:104]; replace [29:30] -> [106:119]; insert [32:32] -> [121:132]; insert [39:39] -> [139:140]; insert [41:41] -> [142:153]; insert [46:46] -> [158:159]; insert [48:48] -> [161:172]; insert [52:52] -> [176:177]; insert [53:53] -> [178:179].

## J-10-canonical first input

Original: 54 bytes; SHA-256 `1e2f703bd7e303e9832064172959b23f36f2c89a305fd0134d55061bbeb16723`; hex `7b2261223a312c22c3a9223a322c22f09f9880223a332c226e6573746564223a7b2232223a322c223130223a31302c2261223a307d7d`.

Observed: 54 bytes; SHA-256 `950e185b12c867e45d6772dc090c2385aa6b24ed2f3d367ce4c90d70f2d65b3e`; hex `7b2261223a312c226e6573746564223a7b223130223a31302c2232223a322c2261223a307d2c22c3a9223a322c22f09f9880223a337d`.

First difference: 8. Ranges: insert [6:6] -> [6:37]; delete [22:52] -> [53:53]; delete [53:54] -> [54:54].

## J-10-canonical second input

Original: 54 bytes; SHA-256 `dc8fa0aab92fce1e2318500e10e189c460a51c3e20211d3636ea4f8478804fe1`; hex `7b226e6573746564223a7b2261223a302c223130223a31302c2232223a327d2c22f09f9880223a332c22c3a9223a322c2261223a317d`.

Observed: 54 bytes; SHA-256 `950e185b12c867e45d6772dc090c2385aa6b24ed2f3d367ce4c90d70f2d65b3e`; hex `7b2261223a312c226e6573746564223a7b223130223a31302c2232223a322c2261223a307d2c22c3a9223a322c22f09f9880223a337d`.

First difference: 2. Ranges: insert [1:1] -> [1:7]; delete [11:17] -> [17:17]; insert [30:30] -> [30:36]; insert [31:31] -> [37:44]; delete [40:53] -> [53:53].

## J-11-escapes-replace

Original: 53 bytes; SHA-256 `4dd5c0d7a53452d21655b50c826d82c278d2b1792d2ee95f0bfca0a365113cfa`; hex `2271756f74653a205c22206261636b736c6173683a205c5c20636f6e74726f6c3a205c7530303031206e65776c696e653a205c6e22`.

Observed: 53 bytes; SHA-256 `4dd5c0d7a53452d21655b50c826d82c278d2b1792d2ee95f0bfca0a365113cfa`; hex `2271756f74653a205c22206261636b736c6173683a205c5c20636f6e74726f6c3a205c7530303031206e65776c696e653a205c6e22`.

First difference: none (identical). Ranges: none.

## J-11-escapes-fatal

Original: 53 bytes; SHA-256 `4dd5c0d7a53452d21655b50c826d82c278d2b1792d2ee95f0bfca0a365113cfa`; hex `2271756f74653a205c22206261636b736c6173683a205c5c20636f6e74726f6c3a205c7530303031206e65776c696e653a205c6e22`.

Observed: 53 bytes; SHA-256 `4dd5c0d7a53452d21655b50c826d82c278d2b1792d2ee95f0bfca0a365113cfa`; hex `2271756f74653a205c22206261636b736c6173683a205c5c20636f6e74726f6c3a205c7530303031206e65776c696e653a205c6e22`.

First difference: none (identical). Ranges: none.

## J-11-escapes-stream-1

Original: 53 bytes; SHA-256 `4dd5c0d7a53452d21655b50c826d82c278d2b1792d2ee95f0bfca0a365113cfa`; hex `2271756f74653a205c22206261636b736c6173683a205c5c20636f6e74726f6c3a205c7530303031206e65776c696e653a205c6e22`.

Observed: 53 bytes; SHA-256 `4dd5c0d7a53452d21655b50c826d82c278d2b1792d2ee95f0bfca0a365113cfa`; hex `2271756f74653a205c22206261636b736c6173683a205c5c20636f6e74726f6c3a205c7530303031206e65776c696e653a205c6e22`.

First difference: none (identical). Ranges: none.

## J-11-emoji-replace

Original: 6 bytes; SHA-256 `7a0c50b92434b015545fe93ab723db2d4b2cdd14a441405624a9ce8be29f1d5a`; hex `22f09f988022`.

Observed: 6 bytes; SHA-256 `7a0c50b92434b015545fe93ab723db2d4b2cdd14a441405624a9ce8be29f1d5a`; hex `22f09f988022`.

First difference: none (identical). Ranges: none.

## J-11-emoji-fatal

Original: 6 bytes; SHA-256 `7a0c50b92434b015545fe93ab723db2d4b2cdd14a441405624a9ce8be29f1d5a`; hex `22f09f988022`.

Observed: 6 bytes; SHA-256 `7a0c50b92434b015545fe93ab723db2d4b2cdd14a441405624a9ce8be29f1d5a`; hex `22f09f988022`.

First difference: none (identical). Ranges: none.

## J-11-emoji-stream-1

Original: 6 bytes; SHA-256 `7a0c50b92434b015545fe93ab723db2d4b2cdd14a441405624a9ce8be29f1d5a`; hex `22f09f988022`.

Observed: 6 bytes; SHA-256 `7a0c50b92434b015545fe93ab723db2d4b2cdd14a441405624a9ce8be29f1d5a`; hex `22f09f988022`.

First difference: none (identical). Ranges: none.

## J-11-surrogate-replace

Original: 8 bytes; SHA-256 `8c0c59dd0d275aadcd462a5fe12eb352cbdfeaf961eae4f85a4660521df7d2f5`; hex `225c756438303022`.

Observed: 8 bytes; SHA-256 `8c0c59dd0d275aadcd462a5fe12eb352cbdfeaf961eae4f85a4660521df7d2f5`; hex `225c756438303022`.

First difference: none (identical). Ranges: none.

## J-11-surrogate-fatal

Original: 8 bytes; SHA-256 `8c0c59dd0d275aadcd462a5fe12eb352cbdfeaf961eae4f85a4660521df7d2f5`; hex `225c756438303022`.

Observed: 8 bytes; SHA-256 `8c0c59dd0d275aadcd462a5fe12eb352cbdfeaf961eae4f85a4660521df7d2f5`; hex `225c756438303022`.

First difference: none (identical). Ranges: none.

## J-11-surrogate-stream-1

Original: 8 bytes; SHA-256 `8c0c59dd0d275aadcd462a5fe12eb352cbdfeaf961eae4f85a4660521df7d2f5`; hex `225c756438303022`.

Observed: 8 bytes; SHA-256 `8c0c59dd0d275aadcd462a5fe12eb352cbdfeaf961eae4f85a4660521df7d2f5`; hex `225c756438303022`.

First difference: none (identical). Ranges: none.

## J-11-bom-replace

Original: 11 bytes; SHA-256 `70c01bfd50dc7776f130295c7a48f9a2b3d97ae480c433ffe5457dde03bb8511`; hex `efbbbf7b2278223a317d0a`.

Observed: 7 bytes; SHA-256 `5041bf1f713df204784353e82f6a4a535931cb64f1f4b4a5aeaffcb720918b22`; hex `7b2278223a317d`.

First difference: 0. Ranges: delete [0:3] -> [0:0]; delete [10:11] -> [7:7].

## J-11-bom-fatal

Original: 11 bytes; SHA-256 `70c01bfd50dc7776f130295c7a48f9a2b3d97ae480c433ffe5457dde03bb8511`; hex `efbbbf7b2278223a317d0a`.

Observed: 7 bytes; SHA-256 `5041bf1f713df204784353e82f6a4a535931cb64f1f4b4a5aeaffcb720918b22`; hex `7b2278223a317d`.

First difference: 0. Ranges: delete [0:3] -> [0:0]; delete [10:11] -> [7:7].

## J-11-bom-stream-1

Original: 11 bytes; SHA-256 `70c01bfd50dc7776f130295c7a48f9a2b3d97ae480c433ffe5457dde03bb8511`; hex `efbbbf7b2278223a317d0a`.

Observed: 7 bytes; SHA-256 `5041bf1f713df204784353e82f6a4a535931cb64f1f4b4a5aeaffcb720918b22`; hex `7b2278223a317d`.

First difference: 0. Ranges: delete [0:3] -> [0:0]; delete [10:11] -> [7:7].

## J-11-crlf-replace

Original: 13 bytes; SHA-256 `f2031c9843f3c68069aedd816c39dcfa9c31ebcda8d91c9f6980cc862400f5e4`; hex `7b0d0a2278223a310d0a7d0d0a`.

Observed: 7 bytes; SHA-256 `5041bf1f713df204784353e82f6a4a535931cb64f1f4b4a5aeaffcb720918b22`; hex `7b2278223a317d`.

First difference: 1. Ranges: delete [1:3] -> [1:1]; delete [8:10] -> [6:6]; delete [11:13] -> [7:7].

## J-11-crlf-fatal

Original: 13 bytes; SHA-256 `f2031c9843f3c68069aedd816c39dcfa9c31ebcda8d91c9f6980cc862400f5e4`; hex `7b0d0a2278223a310d0a7d0d0a`.

Observed: 7 bytes; SHA-256 `5041bf1f713df204784353e82f6a4a535931cb64f1f4b4a5aeaffcb720918b22`; hex `7b2278223a317d`.

First difference: 1. Ranges: delete [1:3] -> [1:1]; delete [8:10] -> [6:6]; delete [11:13] -> [7:7].

## J-11-crlf-stream-1

Original: 13 bytes; SHA-256 `f2031c9843f3c68069aedd816c39dcfa9c31ebcda8d91c9f6980cc862400f5e4`; hex `7b0d0a2278223a310d0a7d0d0a`.

Observed: 7 bytes; SHA-256 `5041bf1f713df204784353e82f6a4a535931cb64f1f4b4a5aeaffcb720918b22`; hex `7b2278223a317d`.

First difference: 1. Ranges: delete [1:3] -> [1:1]; delete [8:10] -> [6:6]; delete [11:13] -> [7:7].

## J-11-no-lf-replace

Original: 7 bytes; SHA-256 `5041bf1f713df204784353e82f6a4a535931cb64f1f4b4a5aeaffcb720918b22`; hex `7b2278223a317d`.

Observed: 7 bytes; SHA-256 `5041bf1f713df204784353e82f6a4a535931cb64f1f4b4a5aeaffcb720918b22`; hex `7b2278223a317d`.

First difference: none (identical). Ranges: none.

## J-11-no-lf-fatal

Original: 7 bytes; SHA-256 `5041bf1f713df204784353e82f6a4a535931cb64f1f4b4a5aeaffcb720918b22`; hex `7b2278223a317d`.

Observed: 7 bytes; SHA-256 `5041bf1f713df204784353e82f6a4a535931cb64f1f4b4a5aeaffcb720918b22`; hex `7b2278223a317d`.

First difference: none (identical). Ranges: none.

## J-11-no-lf-stream-1

Original: 7 bytes; SHA-256 `5041bf1f713df204784353e82f6a4a535931cb64f1f4b4a5aeaffcb720918b22`; hex `7b2278223a317d`.

Observed: 7 bytes; SHA-256 `5041bf1f713df204784353e82f6a4a535931cb64f1f4b4a5aeaffcb720918b22`; hex `7b2278223a317d`.

First difference: none (identical). Ranges: none.

## J-11-invalid-replace

Original: 3 bytes; SHA-256 `2c1ba6ac713bfc21e74f3429be952fca3e7a796734394fd18a48eb6713880d89`; hex `22ff22`.

Observed: 5 bytes; SHA-256 `568601070314e0f4489c9944b3c151d5251d379330008293bb7e1a826a22a845`; hex `22efbfbd22`.

First difference: 1. Ranges: replace [1:2] -> [1:4].

## J-11-invalid-stream-1

Original: 3 bytes; SHA-256 `2c1ba6ac713bfc21e74f3429be952fca3e7a796734394fd18a48eb6713880d89`; hex `22ff22`.

Observed: 5 bytes; SHA-256 `568601070314e0f4489c9944b3c151d5251d379330008293bb7e1a826a22a845`; hex `22efbfbd22`.

First difference: 1. Ranges: replace [1:2] -> [1:4].

## J-12-noop

Original: 32 bytes; SHA-256 `45eccbebc56ba82f922f8453d7702e4582499895e2cce3f4695cbffd7232369f`; hex `2f2f206265666f72650a7b226e223a312c202f2a20696e6c696e65202a2f7d0a`.

Observed: 7 bytes; SHA-256 `2bfd14f43d17fc7cea24e0917a8879b4b2f880b8baeec1b9d90fbaad655e71bd`; hex `7b226e223a317d`.

First difference: 0. Ranges: delete [0:10] -> [0:0]; delete [16:30] -> [6:6]; delete [31:32] -> [7:7].

## J-12-edit

Original: 32 bytes; SHA-256 `45eccbebc56ba82f922f8453d7702e4582499895e2cce3f4695cbffd7232369f`; hex `2f2f206265666f72650a7b226e223a312c202f2a20696e6c696e65202a2f7d0a`.

Observed: 7 bytes; SHA-256 `363379742f80b51bdb9206579af7754911543079b9399cb3fc315fb199f476e8`; hex `7b226e223a327d`.

First difference: 0. Ranges: delete [0:10] -> [0:0]; replace [15:30] -> [5:6]; delete [31:32] -> [7:7].

## J-13-blank-1-lines

Input 17 bytes, SHA-256 `8cc63509a02bd6f9b67c92cdfaac6bd6d59dadaf1e7eb4c47399032442e0ea9d`, hex `7b226e223a317d0a0a7b226e223a327d0a`; chunk size 1 (0=whole). Output is the retained ordered tagged record stream, not a rewritten source document. First byte difference: not applicable; no text serializer executed.

## J-13-blank-1-raw

Input 17 bytes, SHA-256 `8cc63509a02bd6f9b67c92cdfaac6bd6d59dadaf1e7eb4c47399032442e0ea9d`, hex `7b226e223a317d0a0a7b226e223a327d0a`; chunk size 1 (0=whole). Output is the retained ordered tagged record stream, not a rewritten source document. First byte difference: not applicable; no text serializer executed.

## J-13-blank-7-lines

Input 17 bytes, SHA-256 `8cc63509a02bd6f9b67c92cdfaac6bd6d59dadaf1e7eb4c47399032442e0ea9d`, hex `7b226e223a317d0a0a7b226e223a327d0a`; chunk size 7 (0=whole). Output is the retained ordered tagged record stream, not a rewritten source document. First byte difference: not applicable; no text serializer executed.

## J-13-blank-7-raw

Input 17 bytes, SHA-256 `8cc63509a02bd6f9b67c92cdfaac6bd6d59dadaf1e7eb4c47399032442e0ea9d`, hex `7b226e223a317d0a0a7b226e223a327d0a`; chunk size 7 (0=whole). Output is the retained ordered tagged record stream, not a rewritten source document. First byte difference: not applicable; no text serializer executed.

## J-13-blank-0-lines

Input 17 bytes, SHA-256 `8cc63509a02bd6f9b67c92cdfaac6bd6d59dadaf1e7eb4c47399032442e0ea9d`, hex `7b226e223a317d0a0a7b226e223a327d0a`; chunk size 0 (0=whole). Output is the retained ordered tagged record stream, not a rewritten source document. First byte difference: not applicable; no text serializer executed.

## J-13-blank-0-raw

Input 17 bytes, SHA-256 `8cc63509a02bd6f9b67c92cdfaac6bd6d59dadaf1e7eb4c47399032442e0ea9d`, hex `7b226e223a317d0a0a7b226e223a327d0a`; chunk size 0 (0=whole). Output is the retained ordered tagged record stream, not a rewritten source document. First byte difference: not applicable; no text serializer executed.

## J-13-crlf-1-lines

Input 18 bytes, SHA-256 `5ee82f33cdb4a5b4cdd2071c99b748141cd6b7a5bc887aeff5eaa7bd21aa8b19`, hex `7b226e223a317d0d0a7b226e223a327d0d0a`; chunk size 1 (0=whole). Output is the retained ordered tagged record stream, not a rewritten source document. First byte difference: not applicable; no text serializer executed.

## J-13-crlf-1-raw

Input 18 bytes, SHA-256 `5ee82f33cdb4a5b4cdd2071c99b748141cd6b7a5bc887aeff5eaa7bd21aa8b19`, hex `7b226e223a317d0d0a7b226e223a327d0d0a`; chunk size 1 (0=whole). Output is the retained ordered tagged record stream, not a rewritten source document. First byte difference: not applicable; no text serializer executed.

## J-13-crlf-7-lines

Input 18 bytes, SHA-256 `5ee82f33cdb4a5b4cdd2071c99b748141cd6b7a5bc887aeff5eaa7bd21aa8b19`, hex `7b226e223a317d0d0a7b226e223a327d0d0a`; chunk size 7 (0=whole). Output is the retained ordered tagged record stream, not a rewritten source document. First byte difference: not applicable; no text serializer executed.

## J-13-crlf-7-raw

Input 18 bytes, SHA-256 `5ee82f33cdb4a5b4cdd2071c99b748141cd6b7a5bc887aeff5eaa7bd21aa8b19`, hex `7b226e223a317d0d0a7b226e223a327d0d0a`; chunk size 7 (0=whole). Output is the retained ordered tagged record stream, not a rewritten source document. First byte difference: not applicable; no text serializer executed.

## J-13-crlf-0-lines

Input 18 bytes, SHA-256 `5ee82f33cdb4a5b4cdd2071c99b748141cd6b7a5bc887aeff5eaa7bd21aa8b19`, hex `7b226e223a317d0d0a7b226e223a327d0d0a`; chunk size 0 (0=whole). Output is the retained ordered tagged record stream, not a rewritten source document. First byte difference: not applicable; no text serializer executed.

## J-13-crlf-0-raw

Input 18 bytes, SHA-256 `5ee82f33cdb4a5b4cdd2071c99b748141cd6b7a5bc887aeff5eaa7bd21aa8b19`, hex `7b226e223a317d0d0a7b226e223a327d0d0a`; chunk size 0 (0=whole). Output is the retained ordered tagged record stream, not a rewritten source document. First byte difference: not applicable; no text serializer executed.

## J-13-no-lf-1-lines

Input 15 bytes, SHA-256 `9b436fe1b316bb4ca2aea0448c9933ff3ade1d043e5fbe5d8475190637014780`, hex `7b226e223a317d0a7b226e223a327d`; chunk size 1 (0=whole). Output is the retained ordered tagged record stream, not a rewritten source document. First byte difference: not applicable; no text serializer executed.

## J-13-no-lf-1-raw

Input 15 bytes, SHA-256 `9b436fe1b316bb4ca2aea0448c9933ff3ade1d043e5fbe5d8475190637014780`, hex `7b226e223a317d0a7b226e223a327d`; chunk size 1 (0=whole). Output is the retained ordered tagged record stream, not a rewritten source document. First byte difference: not applicable; no text serializer executed.

## J-13-no-lf-7-lines

Input 15 bytes, SHA-256 `9b436fe1b316bb4ca2aea0448c9933ff3ade1d043e5fbe5d8475190637014780`, hex `7b226e223a317d0a7b226e223a327d`; chunk size 7 (0=whole). Output is the retained ordered tagged record stream, not a rewritten source document. First byte difference: not applicable; no text serializer executed.

## J-13-no-lf-7-raw

Input 15 bytes, SHA-256 `9b436fe1b316bb4ca2aea0448c9933ff3ade1d043e5fbe5d8475190637014780`, hex `7b226e223a317d0a7b226e223a327d`; chunk size 7 (0=whole). Output is the retained ordered tagged record stream, not a rewritten source document. First byte difference: not applicable; no text serializer executed.

## J-13-no-lf-0-lines

Input 15 bytes, SHA-256 `9b436fe1b316bb4ca2aea0448c9933ff3ade1d043e5fbe5d8475190637014780`, hex `7b226e223a317d0a7b226e223a327d`; chunk size 0 (0=whole). Output is the retained ordered tagged record stream, not a rewritten source document. First byte difference: not applicable; no text serializer executed.

## J-13-no-lf-0-raw

Input 15 bytes, SHA-256 `9b436fe1b316bb4ca2aea0448c9933ff3ade1d043e5fbe5d8475190637014780`, hex `7b226e223a317d0a7b226e223a327d`; chunk size 0 (0=whole). Output is the retained ordered tagged record stream, not a rewritten source document. First byte difference: not applicable; no text serializer executed.

## J-13-malformed-1-lines

Input 20 bytes, SHA-256 `4c55b68661d5a55d44cda9916c3b90fa4b590d229f4b4c4a7c6b5c5b182e9924`, hex `7b226e223a317d0a4241440a7b226e223a327d0a`; chunk size 1 (0=whole). Output is the retained ordered tagged record stream, not a rewritten source document. First byte difference: not applicable; no text serializer executed.

## J-13-malformed-1-raw

Input 20 bytes, SHA-256 `4c55b68661d5a55d44cda9916c3b90fa4b590d229f4b4c4a7c6b5c5b182e9924`, hex `7b226e223a317d0a4241440a7b226e223a327d0a`; chunk size 1 (0=whole). Output is the retained ordered tagged record stream, not a rewritten source document. First byte difference: not applicable; no text serializer executed.

## J-13-malformed-7-lines

Input 20 bytes, SHA-256 `4c55b68661d5a55d44cda9916c3b90fa4b590d229f4b4c4a7c6b5c5b182e9924`, hex `7b226e223a317d0a4241440a7b226e223a327d0a`; chunk size 7 (0=whole). Output is the retained ordered tagged record stream, not a rewritten source document. First byte difference: not applicable; no text serializer executed.

## J-13-malformed-7-raw

Input 20 bytes, SHA-256 `4c55b68661d5a55d44cda9916c3b90fa4b590d229f4b4c4a7c6b5c5b182e9924`, hex `7b226e223a317d0a4241440a7b226e223a327d0a`; chunk size 7 (0=whole). Output is the retained ordered tagged record stream, not a rewritten source document. First byte difference: not applicable; no text serializer executed.

## J-13-malformed-0-lines

Input 20 bytes, SHA-256 `4c55b68661d5a55d44cda9916c3b90fa4b590d229f4b4c4a7c6b5c5b182e9924`, hex `7b226e223a317d0a4241440a7b226e223a327d0a`; chunk size 0 (0=whole). Output is the retained ordered tagged record stream, not a rewritten source document. First byte difference: not applicable; no text serializer executed.

## J-13-malformed-0-raw

Input 20 bytes, SHA-256 `4c55b68661d5a55d44cda9916c3b90fa4b590d229f4b4c4a7c6b5c5b182e9924`, hex `7b226e223a317d0a4241440a7b226e223a327d0a`; chunk size 0 (0=whole). Output is the retained ordered tagged record stream, not a rewritten source document. First byte difference: not applicable; no text serializer executed.

## J-14-mixed-1

Input 29 bytes, SHA-256 `999baed07819e7e34618ec9ed2e18864fd098a837822be438a444d34660dd40a`, hex `7b2261223a317d5b325d74727565206e756c6c20227822203132203334`; chunk size 1 (0=whole). Output is the retained ordered tagged record stream, not a rewritten source document. First byte difference: not applicable; no text serializer executed.

## J-14-mixed-7

Input 29 bytes, SHA-256 `999baed07819e7e34618ec9ed2e18864fd098a837822be438a444d34660dd40a`, hex `7b2261223a317d5b325d74727565206e756c6c20227822203132203334`; chunk size 7 (0=whole). Output is the retained ordered tagged record stream, not a rewritten source document. First byte difference: not applicable; no text serializer executed.

## J-14-mixed-0

Input 29 bytes, SHA-256 `999baed07819e7e34618ec9ed2e18864fd098a837822be438a444d34660dd40a`, hex `7b2261223a317d5b325d74727565206e756c6c20227822203132203334`; chunk size 0 (0=whole). Output is the retained ordered tagged record stream, not a rewritten source document. First byte difference: not applicable; no text serializer executed.

## J-14-escaped-1

Input 17 bytes, SHA-256 `b674a51fee0f2ea575d9e0a7bcb0e75e74993d2f925858ddddd7b3742f60c394`, hex `7b2273223a227d205b205c22227d5b325d`; chunk size 1 (0=whole). Output is the retained ordered tagged record stream, not a rewritten source document. First byte difference: not applicable; no text serializer executed.

## J-14-escaped-7

Input 17 bytes, SHA-256 `b674a51fee0f2ea575d9e0a7bcb0e75e74993d2f925858ddddd7b3742f60c394`, hex `7b2273223a227d205b205c22227d5b325d`; chunk size 7 (0=whole). Output is the retained ordered tagged record stream, not a rewritten source document. First byte difference: not applicable; no text serializer executed.

## J-14-escaped-0

Input 17 bytes, SHA-256 `b674a51fee0f2ea575d9e0a7bcb0e75e74993d2f925858ddddd7b3742f60c394`, hex `7b2273223a227d205b205c22227d5b325d`; chunk size 0 (0=whole). Output is the retained ordered tagged record stream, not a rewritten source document. First byte difference: not applicable; no text serializer executed.

## J-14-truncated-1

Input 12 bytes, SHA-256 `4088d20a502e9978afddfeab633b61655c9722c5e8a772b2fd90dc173f8abcd5`, hex `7b2261223a317d7b2262223a`; chunk size 1 (0=whole). Output is the retained ordered tagged record stream, not a rewritten source document. First byte difference: not applicable; no text serializer executed.

## J-14-truncated-7

Input 12 bytes, SHA-256 `4088d20a502e9978afddfeab633b61655c9722c5e8a772b2fd90dc173f8abcd5`, hex `7b2261223a317d7b2262223a`; chunk size 7 (0=whole). Output is the retained ordered tagged record stream, not a rewritten source document. First byte difference: not applicable; no text serializer executed.

## J-14-truncated-0

Input 12 bytes, SHA-256 `4088d20a502e9978afddfeab633b61655c9722c5e8a772b2fd90dc173f8abcd5`, hex `7b2261223a317d7b2262223a`; chunk size 0 (0=whole). Output is the retained ordered tagged record stream, not a rewritten source document. First byte difference: not applicable; no text serializer executed.

## J-15-lines-valid declared delimiters versus observed

Original: 16 bytes; SHA-256 `bffaac563f091c61dc28d2f37cd74d0b19be0c45e3b1e32ced6a93eed7725862`; hex `7b226e223a317d0a7b226e223a327d0a`.

Observed: 16 bytes; SHA-256 `bffaac563f091c61dc28d2f37cd74d0b19be0c45e3b1e32ced6a93eed7725862`; hex `7b226e223a317d0a7b226e223a327d0a`.

First difference: none (identical). Ranges: none.

## J-15-lines-wrong-framing declared delimiters versus observed

Original: 16 bytes; SHA-256 `bffaac563f091c61dc28d2f37cd74d0b19be0c45e3b1e32ced6a93eed7725862`; hex `7b226e223a317d0a7b226e223a327d0a`.

Observed: 16 bytes; SHA-256 `bffaac563f091c61dc28d2f37cd74d0b19be0c45e3b1e32ced6a93eed7725862`; hex `7b226e223a317d0a7b226e223a327d0a`.

First difference: none (identical). Ranges: none.

## J-15-rs-valid declared delimiters versus observed

Original: 18 bytes; SHA-256 `56b158d9c06dc45a0b68da1e890257759206d8ff14f2e980edb3182e0380750f`; hex `1e7b226e223a317d0a1e7b226e223a327d0a`.

Observed: 18 bytes; SHA-256 `56b158d9c06dc45a0b68da1e890257759206d8ff14f2e980edb3182e0380750f`; hex `1e7b226e223a317d0a1e7b226e223a327d0a`.

First difference: none (identical). Ranges: none.

## J-15-rs-wrong-framing declared delimiters versus observed

Original: 18 bytes; SHA-256 `56b158d9c06dc45a0b68da1e890257759206d8ff14f2e980edb3182e0380750f`; hex `1e7b226e223a317d0a1e7b226e223a327d0a`.

Observed: 18 bytes; SHA-256 `56b158d9c06dc45a0b68da1e890257759206d8ff14f2e980edb3182e0380750f`; hex `1e7b226e223a317d0a1e7b226e223a327d0a`.

First difference: none (identical). Ranges: none.

## J-17-missing destination

Original: 21 bytes; SHA-256 `fca4379c363a235123200f4e738bba72fc9bd44e674177c9811454f1ef3b7b07`; hex `4f524947494e414c2044455354494e4154494f4e0a`.

Observed: 21 bytes; SHA-256 `fca4379c363a235123200f4e738bba72fc9bd44e674177c9811454f1ef3b7b07`; hex `4f524947494e414c2044455354494e4154494f4e0a`.

First difference: none (identical). Ranges: none.

## J-17-unreadable destination

Original: 21 bytes; SHA-256 `fca4379c363a235123200f4e738bba72fc9bd44e674177c9811454f1ef3b7b07`; hex `4f524947494e414c2044455354494e4154494f4e0a`.

Observed: 21 bytes; SHA-256 `fca4379c363a235123200f4e738bba72fc9bd44e674177c9811454f1ef3b7b07`; hex `4f524947494e414c2044455354494e4154494f4e0a`.

First difference: none (identical). Ranges: none.

## J-17-missing-parent destination

Original: 21 bytes; SHA-256 `fca4379c363a235123200f4e738bba72fc9bd44e674177c9811454f1ef3b7b07`; hex `4f524947494e414c2044455354494e4154494f4e0a`.

Observed: 21 bytes; SHA-256 `fca4379c363a235123200f4e738bba72fc9bd44e674177c9811454f1ef3b7b07`; hex `4f524947494e414c2044455354494e4154494f4e0a`.

First difference: none (identical). Ranges: none.

## J-17-unwritable destination

Original: 21 bytes; SHA-256 `fca4379c363a235123200f4e738bba72fc9bd44e674177c9811454f1ef3b7b07`; hex `4f524947494e414c2044455354494e4154494f4e0a`.

Observed: 21 bytes; SHA-256 `fca4379c363a235123200f4e738bba72fc9bd44e674177c9811454f1ef3b7b07`; hex `4f524947494e414c2044455354494e4154494f4e0a`.

First difference: none (identical). Ranges: none.

## J-17-raw-interrupt destination

Original: 21 bytes; SHA-256 `fca4379c363a235123200f4e738bba72fc9bd44e674177c9811454f1ef3b7b07`; hex `4f524947494e414c2044455354494e4154494f4e0a`.

Observed: 1 bytes; SHA-256 `021fb596db81e6d02bf3d2586ee3981fe519f275c0ac9ca76bbcf2ebb4097d96`; hex `7b`.

First difference: 0. Ranges: replace [0:21] -> [0:1].

## J-17-safe-interrupt destination

Original: 21 bytes; SHA-256 `fca4379c363a235123200f4e738bba72fc9bd44e674177c9811454f1ef3b7b07`; hex `4f524947494e414c2044455354494e4154494f4e0a`.

Observed: 21 bytes; SHA-256 `fca4379c363a235123200f4e738bba72fc9bd44e674177c9811454f1ef3b7b07`; hex `4f524947494e414c2044455354494e4154494f4e0a`.

First difference: none (identical). Ranges: none.

Retained sibling hex `7b226e616d65223a22416461222c226e223a322c22666c616773223a5b747275652c66616c73655d2c226e696c223a6e756c6c7d`; SHA-256 `390b361e7243fdd0e7964de6741350c30fcd7a54ea588065e461f6fa6705f8d4`.

## J-17-rename-injected destination

Original: 21 bytes; SHA-256 `fca4379c363a235123200f4e738bba72fc9bd44e674177c9811454f1ef3b7b07`; hex `4f524947494e414c2044455354494e4154494f4e0a`.

Observed: 21 bytes; SHA-256 `fca4379c363a235123200f4e738bba72fc9bd44e674177c9811454f1ef3b7b07`; hex `4f524947494e414c2044455354494e4154494f4e0a`.

First difference: none (identical). Ranges: none.

## J-17-rename-directory destination

Original: 21 bytes; SHA-256 `fca4379c363a235123200f4e738bba72fc9bd44e674177c9811454f1ef3b7b07`; hex `4f524947494e414c2044455354494e4154494f4e0a`.

Observed: 21 bytes; SHA-256 `fca4379c363a235123200f4e738bba72fc9bd44e674177c9811454f1ef3b7b07`; hex `4f524947494e414c2044455354494e4154494f4e0a`.

First difference: none (identical). Ranges: none.

## Stress input recipes and hashes

These bytes are specified by the retained Lykn generators. Hashes below are post-run byte-only calculations from the declared recipes, not independently captured runtime-input hashes. Runtime confirms byte lengths for depth/string and record count for NDJSON. This distinction matters if changing the generator.

| Variant | Exact recipe | Encoded bytes | SHA-256 |
| --- | --- | --- | --- |

| J-16-depth-16 | 5b repeated N, 30, 5d repeated N | 33 | `f955de38ce972b6a49fa8fae45dd8e2eede435f0d684f7eddec46135e473d6c2` |

| J-16-depth-64 | 5b repeated N, 30, 5d repeated N | 129 | `f0244ae1938270f711155b0a26a4307cde7050495140dd858a88a1cfc378cf40` |

| J-16-depth-256 | 5b repeated N, 30, 5d repeated N | 513 | `9cd13e3d387f21922247827f547ec757907ddbd9abedaf6c5efa817381626d0b` |

| J-16-string-1024 | 22, 78 repeated N, 22 | 1026 | `fb3149c554be5ec00d1bea9729dc8e88e779150c7b152ab7c7f875d5d5215237` |

| J-16-string-1048576 | 22, 78 repeated N, 22 | 1048578 | `358693a0511d9f58f23d2e3c6835be4bcfe3d5d95382503a96c28aa08adf8678` |

| J-16-string-8388608 | 22, 78 repeated N, 22 | 8388610 | `8b8a183f3cf99035717c6b5808a5c1cc56a8a6cf9df46a4305a0f08906ff596d` |

| J-16-records-100 | 7b226e223a317d0a repeated N | 800 | `c09417416c658badb192ddb7e9a04505df79e11aac8be34f4b36240b4ca3966e` |

| J-16-records-10000 | 7b226e223a317d0a repeated N | 80000 | `2f61fc59014fe05a03caeafdee7076d66a5511c1212ffddc15d66905358df678` |
