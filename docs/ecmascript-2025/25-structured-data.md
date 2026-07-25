# 25 Structured Data

## 25.1 ArrayBuffer Objects

### 25.1.1 Notation

The descriptions below in this section, [25.4](#sec-atomics-object), and [29](#sec-memory-model) use the read-modify-write modification function internal data structure.

A read-modify-write modification function is a mathematical function that is represented as an abstract closure that takes two [Lists](#sec-list-and-record-specification-type) of [byte values](#sec-data-blocks) as arguments and returns a [List](#sec-list-and-record-specification-type) of [byte values](#sec-data-blocks). These abstract closures satisfy all of the following properties:

- They perform all their algorithm steps atomically.
- Their individual algorithm steps are not observable.

Note

To aid verifying that a read-modify-write modification function's algorithm steps constitute a pure, mathematical function, the following editorial conventions are recommended:

- They do not access, directly or transitively via invoked [abstract operations](#sec-algorithm-conventions-abstract-operations) and abstract closures, any language or specification values except their parameters and captured values.
- They do not invoke, directly or transitively, [abstract operations](#sec-algorithm-conventions-abstract-operations) and abstract closures that return [Completion Records](#sec-completion-record-specification-type).
- They do not return [Completion Records](#sec-completion-record-specification-type).

### 25.1.2 Fixed-length and Resizable ArrayBuffer Objects

A fixed-length ArrayBuffer is an ArrayBuffer whose byte length cannot change after creation.

A resizable ArrayBuffer is an ArrayBuffer whose byte length may change after creation via calls to [ArrayBuffer.prototype.resize ( `newLength` )](#sec-arraybuffer.prototype.resize).

The kind of ArrayBuffer object that is created depends on the arguments passed to [ArrayBuffer ( `length` \[ , `options` \] )](#sec-arraybuffer-length).

### 25.1.3 Abstract Operations For ArrayBuffer Objects

#### 25.1.3.1 AllocateArrayBuffer ( `constructor`, `byteLength` \[ , `maxByteLength` \] )

The abstract operation AllocateArrayBuffer takes arguments `constructor` (a [constructor](#constructor)) and `byteLength` (a non-negative [integer](#integer)) and optional argument `maxByteLength` (a non-negative [integer](#integer) or empty) and returns either a [normal completion containing](#sec-completion-record-specification-type) an ArrayBuffer or a [throw completion](#sec-completion-record-specification-type). It is used to create an ArrayBuffer. It performs the following steps when called:

1.  Let `slots` be « `[[ArrayBufferData]]`, `[[ArrayBufferByteLength]]`, `[[ArrayBufferDetachKey]]` ».
2.  If `maxByteLength` is present and `maxByteLength` is not empty, let `allocatingResizableBuffer` be true; otherwise let `allocatingResizableBuffer` be false.
3.  If `allocatingResizableBuffer` is true, then
    1.  If `byteLength` \> `maxByteLength`, throw a RangeError exception.
    2.  Append `[[ArrayBufferMaxByteLength]]` to `slots`.
4.  Let `obj` be ? [OrdinaryCreateFromConstructor](#sec-ordinarycreatefromconstructor)(`constructor`, "%ArrayBuffer.prototype%", `slots`).
5.  Let `block` be ? [CreateByteDataBlock](#sec-createbytedatablock)(`byteLength`).
6.  Set `obj`.`[[ArrayBufferData]]` to `block`.
7.  Set `obj`.`[[ArrayBufferByteLength]]` to `byteLength`.
8.  If `allocatingResizableBuffer` is true, then
    1.  If it is not possible to create a [Data Block](#sec-data-blocks) `block` consisting of `maxByteLength` bytes, throw a RangeError exception.
    2.  NOTE: Resizable ArrayBuffers are designed to be implementable with in-place growth. Implementations may throw if, for example, virtual memory cannot be reserved up front.
    3.  Set `obj`.`[[ArrayBufferMaxByteLength]]` to `maxByteLength`.
9.  Return `obj`.

#### 25.1.3.2 ArrayBufferByteLength ( `arrayBuffer`, `order` )

The abstract operation ArrayBufferByteLength takes arguments `arrayBuffer` (an ArrayBuffer or SharedArrayBuffer) and `order` (seq-cst or unordered) and returns a non-negative [integer](#integer). It performs the following steps when called:

1.  If [IsSharedArrayBuffer](#sec-issharedarraybuffer)(`arrayBuffer`) is true and `arrayBuffer` has an `[[ArrayBufferByteLengthData]]` internal slot, then
    1.  Let `bufferByteLengthBlock` be `arrayBuffer`.`[[ArrayBufferByteLengthData]]`.
    2.  Let `rawLength` be [GetRawBytesFromSharedBlock](#sec-getrawbytesfromsharedblock)(`bufferByteLengthBlock`, 0, biguint64, true, `order`).
    3.  Let `isLittleEndian` be the value of the `[[LittleEndian]]` field of the [surrounding agent](#surrounding-agent)'s [Agent Record](#agent-record).
    4.  Return [ℝ](#ℝ)([RawBytesToNumeric](#sec-rawbytestonumeric)(biguint64, `rawLength`, `isLittleEndian`)).
2.  [Assert](#assert): [IsDetachedBuffer](#sec-isdetachedbuffer)(`arrayBuffer`) is false.
3.  Return `arrayBuffer`.`[[ArrayBufferByteLength]]`.

#### 25.1.3.3 ArrayBufferCopyAndDetach ( `arrayBuffer`, `newLength`, `preserveResizability` )

The abstract operation ArrayBufferCopyAndDetach takes arguments `arrayBuffer` (an [ECMAScript language value](#sec-ecmascript-language-types)), `newLength` (an [ECMAScript language value](#sec-ecmascript-language-types)), and `preserveResizability` (preserve-resizability or fixed-length) and returns either a [normal completion containing](#sec-completion-record-specification-type) an ArrayBuffer or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`arrayBuffer`, `[[ArrayBufferData]]`).
2.  If [IsSharedArrayBuffer](#sec-issharedarraybuffer)(`arrayBuffer`) is true, throw a TypeError exception.
3.  If `newLength` is undefined, then
    1.  Let `newByteLength` be `arrayBuffer`.`[[ArrayBufferByteLength]]`.
4.  Else,
    1.  Let `newByteLength` be ? [ToIndex](#sec-toindex)(`newLength`).
5.  If [IsDetachedBuffer](#sec-isdetachedbuffer)(`arrayBuffer`) is true, throw a TypeError exception.
6.  If `preserveResizability` is preserve-resizability and [IsFixedLengthArrayBuffer](#sec-isfixedlengtharraybuffer)(`arrayBuffer`) is false, then
    1.  Let `newMaxByteLength` be `arrayBuffer`.`[[ArrayBufferMaxByteLength]]`.
7.  Else,
    1.  Let `newMaxByteLength` be empty.
8.  If `arrayBuffer`.`[[ArrayBufferDetachKey]]` is not undefined, throw a TypeError exception.
9.  Let `newBuffer` be ? [AllocateArrayBuffer](#sec-allocatearraybuffer)([%ArrayBuffer%](#sec-arraybuffer-constructor), `newByteLength`, `newMaxByteLength`).
10. Let `copyLength` be [min](#eqn-min)(`newByteLength`, `arrayBuffer`.`[[ArrayBufferByteLength]]`).
11. Let `fromBlock` be `arrayBuffer`.`[[ArrayBufferData]]`.
12. Let `toBlock` be `newBuffer`.`[[ArrayBufferData]]`.
13. Perform [CopyDataBlockBytes](#sec-copydatablockbytes)(`toBlock`, 0, `fromBlock`, 0, `copyLength`).
14. NOTE: Neither creation of the new [Data Block](#sec-data-blocks) nor copying from the old [Data Block](#sec-data-blocks) are observable. Implementations may implement this method as a zero-copy move or a `realloc`.
15. Perform ! [DetachArrayBuffer](#sec-detacharraybuffer)(`arrayBuffer`).
16. Return `newBuffer`.

#### 25.1.3.4 IsDetachedBuffer ( `arrayBuffer` )

The abstract operation IsDetachedBuffer takes argument `arrayBuffer` (an ArrayBuffer or a SharedArrayBuffer) and returns a Boolean. It performs the following steps when called:

1.  If `arrayBuffer`.`[[ArrayBufferData]]` is null, return true.
2.  Return false.

#### 25.1.3.5 DetachArrayBuffer ( `arrayBuffer` \[ , `key` \] )

The abstract operation DetachArrayBuffer takes argument `arrayBuffer` (an ArrayBuffer) and optional argument `key` (anything) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  [Assert](#assert): [IsSharedArrayBuffer](#sec-issharedarraybuffer)(`arrayBuffer`) is false.
2.  If `key` is not present, set `key` to undefined.
3.  If `arrayBuffer`.`[[ArrayBufferDetachKey]]` is not `key`, throw a TypeError exception.
4.  Set `arrayBuffer`.`[[ArrayBufferData]]` to null.
5.  Set `arrayBuffer`.`[[ArrayBufferByteLength]]` to 0.
6.  Return unused.

Note

Detaching an ArrayBuffer instance disassociates the [Data Block](#sec-data-blocks) used as its backing store from the instance and sets the byte length of the buffer to 0.

#### 25.1.3.6 CloneArrayBuffer ( `srcBuffer`, `srcByteOffset`, `srcLength` )

The abstract operation CloneArrayBuffer takes arguments `srcBuffer` (an ArrayBuffer or a SharedArrayBuffer), `srcByteOffset` (a non-negative [integer](#integer)), and `srcLength` (a non-negative [integer](#integer)) and returns either a [normal completion containing](#sec-completion-record-specification-type) an ArrayBuffer or a [throw completion](#sec-completion-record-specification-type). It creates a new ArrayBuffer whose data is a copy of `srcBuffer`'s data over the range starting at `srcByteOffset` and continuing for `srcLength` bytes. It performs the following steps when called:

1.  [Assert](#assert): [IsDetachedBuffer](#sec-isdetachedbuffer)(`srcBuffer`) is false.
2.  Let `targetBuffer` be ? [AllocateArrayBuffer](#sec-allocatearraybuffer)([%ArrayBuffer%](#sec-arraybuffer-constructor), `srcLength`).
3.  Let `srcBlock` be `srcBuffer`.`[[ArrayBufferData]]`.
4.  Let `targetBlock` be `targetBuffer`.`[[ArrayBufferData]]`.
5.  Perform [CopyDataBlockBytes](#sec-copydatablockbytes)(`targetBlock`, 0, `srcBlock`, `srcByteOffset`, `srcLength`).
6.  Return `targetBuffer`.

#### 25.1.3.7 GetArrayBufferMaxByteLengthOption ( `options` )

The abstract operation GetArrayBufferMaxByteLengthOption takes argument `options` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) either a non-negative [integer](#integer) or empty, or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  If `options` [is not an Object](#sec-object-type), return empty.
2.  Let `maxByteLength` be ? [Get](#sec-get-o-p)(`options`, "maxByteLength").
3.  If `maxByteLength` is undefined, return empty.
4.  Return ? [ToIndex](#sec-toindex)(`maxByteLength`).

#### 25.1.3.8 HostResizeArrayBuffer ( `buffer`, `newByteLength` )

The [host-defined](#host-defined) abstract operation HostResizeArrayBuffer takes arguments `buffer` (an ArrayBuffer) and `newByteLength` (a non-negative [integer](#integer)) and returns either a [normal completion containing](#sec-completion-record-specification-type) either handled or unhandled, or a [throw completion](#sec-completion-record-specification-type). It gives the [host](#host) an opportunity to perform [implementation-defined](#implementation-defined) resizing of `buffer`. If the [host](#host) chooses not to handle resizing of `buffer`, it may return unhandled for the default behaviour.

The implementation of HostResizeArrayBuffer must conform to the following requirements:

- The abstract operation does not detach `buffer`.
- If the abstract operation completes normally with handled, `buffer`.`[[ArrayBufferByteLength]]` is `newByteLength`.

The default implementation of HostResizeArrayBuffer is to return [NormalCompletion](#sec-normalcompletion)(unhandled).

#### 25.1.3.9 IsFixedLengthArrayBuffer ( `arrayBuffer` )

The abstract operation IsFixedLengthArrayBuffer takes argument `arrayBuffer` (an ArrayBuffer or a SharedArrayBuffer) and returns a Boolean. It performs the following steps when called:

1.  If `arrayBuffer` has an `[[ArrayBufferMaxByteLength]]` internal slot, return false.
2.  Return true.

#### 25.1.3.10 IsUnsignedElementType ( `type` )

The abstract operation IsUnsignedElementType takes argument `type` (a [TypedArray element type](#sec-typedarray-objects)) and returns a Boolean. It verifies if the argument `type` is an unsigned [TypedArray element type](#sec-typedarray-objects). It performs the following steps when called:

1.  If `type` is one of uint8, uint8clamped, uint16, uint32, or biguint64, return true.
2.  Return false.

#### 25.1.3.11 IsUnclampedIntegerElementType ( `type` )

The abstract operation IsUnclampedIntegerElementType takes argument `type` (a [TypedArray element type](#sec-typedarray-objects)) and returns a Boolean. It verifies if the argument `type` is an [Integer](#integer) [TypedArray element type](#sec-typedarray-objects) not including uint8clamped. It performs the following steps when called:

1.  If `type` is one of int8, uint8, int16, uint16, int32, or uint32, return true.
2.  Return false.

#### 25.1.3.12 IsBigIntElementType ( `type` )

The abstract operation IsBigIntElementType takes argument `type` (a [TypedArray element type](#sec-typedarray-objects)) and returns a Boolean. It verifies if the argument `type` [is a BigInt](#sec-ecmascript-language-types-bigint-type) [TypedArray element type](#sec-typedarray-objects). It performs the following steps when called:

1.  If `type` is either biguint64 or bigint64, return true.
2.  Return false.

#### 25.1.3.13 IsNoTearConfiguration ( `type`, `order` )

The abstract operation IsNoTearConfiguration takes arguments `type` (a [TypedArray element type](#sec-typedarray-objects)) and `order` (seq-cst, unordered, or init) and returns a Boolean. It performs the following steps when called:

1.  If [IsUnclampedIntegerElementType](#sec-isunclampedintegerelementtype)(`type`) is true, return true.
2.  If [IsBigIntElementType](#sec-isbigintelementtype)(`type`) is true and `order` is neither init nor unordered, return true.
3.  Return false.

#### 25.1.3.14 RawBytesToNumeric ( `type`, `rawBytes`, `isLittleEndian` )

The abstract operation RawBytesToNumeric takes arguments `type` (a [TypedArray element type](#sec-typedarray-objects)), `rawBytes` (a [List](#sec-list-and-record-specification-type) of [byte values](#sec-data-blocks)), and `isLittleEndian` (a Boolean) and returns a Number or a BigInt. It performs the following steps when called:

1.  Let `elementSize` be the Element Size value specified in [Table 73](#table-the-typedarray-constructors) for Element Type `type`.
2.  If `isLittleEndian` is false, reverse the order of the elements of `rawBytes`.
3.  If `type` is float16, then
    1.  Let `value` be the byte elements of `rawBytes` concatenated and interpreted as a little-endian bit string encoding of an [IEEE 754-2019](#sec-bibliography) binary16 value.
    2.  If `value` is a NaN, return NaN.
    3.  Return the Number value that corresponds to `value`.
4.  If `type` is float32, then
    1.  Let `value` be the byte elements of `rawBytes` concatenated and interpreted as a little-endian bit string encoding of an [IEEE 754-2019](#sec-bibliography) binary32 value.
    2.  If `value` is a NaN, return NaN.
    3.  Return the Number value that corresponds to `value`.
5.  If `type` is float64, then
    1.  Let `value` be the byte elements of `rawBytes` concatenated and interpreted as a little-endian bit string encoding of an [IEEE 754-2019](#sec-bibliography) binary64 value.
    2.  If `value` is a NaN, return NaN.
    3.  Return the Number value that corresponds to `value`.
6.  If [IsUnsignedElementType](#sec-isunsignedelementtype)(`type`) is true, then
    1.  Let `intValue` be the byte elements of `rawBytes` concatenated and interpreted as a bit string encoding of an unsigned little-endian binary number.
7.  Else,
    1.  Let `intValue` be the byte elements of `rawBytes` concatenated and interpreted as a bit string encoding of a binary little-endian two's complement number of bit length `elementSize` × 8.
8.  If [IsBigIntElementType](#sec-isbigintelementtype)(`type`) is true, return the BigInt value that corresponds to `intValue`.
9.  Otherwise, return the Number value that corresponds to `intValue`.

#### 25.1.3.15 GetRawBytesFromSharedBlock ( `block`, `byteIndex`, `type`, `isTypedArray`, `order` )

The abstract operation GetRawBytesFromSharedBlock takes arguments `block` (a [Shared Data Block](#sec-data-blocks)), `byteIndex` (a non-negative [integer](#integer)), `type` (a [TypedArray element type](#sec-typedarray-objects)), `isTypedArray` (a Boolean), and `order` (seq-cst or unordered) and returns a [List](#sec-list-and-record-specification-type) of [byte values](#sec-data-blocks). It performs the following steps when called:

1.  Let `elementSize` be the Element Size value specified in [Table 73](#table-the-typedarray-constructors) for Element Type `type`.
2.  Let `execution` be the `[[CandidateExecution]]` field of the [surrounding agent](#surrounding-agent)'s [Agent Record](#agent-record).
3.  Let `eventsRecord` be the [Agent Events Record](#sec-agent-event-records) of `execution`.`[[EventsRecords]]` whose `[[AgentSignifier]]` is [AgentSignifier](#sec-agentsignifier)().
4.  If `isTypedArray` is true and [IsNoTearConfiguration](#sec-isnotearconfiguration)(`type`, `order`) is true, let `noTear` be true; otherwise let `noTear` be false.
5.  Let `rawValue` be a [List](#sec-list-and-record-specification-type) of length `elementSize` whose elements are nondeterministically chosen [byte values](#sec-data-blocks).
6.  NOTE: In implementations, `rawValue` is the result of a non-atomic or atomic read instruction on the underlying hardware. The nondeterminism is a semantic prescription of the [memory model](#sec-memory-model) to describe observable behaviour of hardware with weak consistency.
7.  Let `readEvent` be [ReadSharedMemory](#sec-memory-model-fundamentals) { `[[Order]]`: `order`, `[[NoTear]]`: `noTear`, `[[Block]]`: `block`, `[[ByteIndex]]`: `byteIndex`, `[[ElementSize]]`: `elementSize` }.
8.  Append `readEvent` to `eventsRecord`.`[[EventList]]`.
9.  Append [Chosen Value Record](#sec-chosen-value-records) { `[[Event]]`: `readEvent`, `[[ChosenValue]]`: `rawValue` } to `execution`.`[[ChosenValues]]`.
10. Return `rawValue`.

#### 25.1.3.16 GetValueFromBuffer ( `arrayBuffer`, `byteIndex`, `type`, `isTypedArray`, `order` \[ , `isLittleEndian` \] )

The abstract operation GetValueFromBuffer takes arguments `arrayBuffer` (an ArrayBuffer or SharedArrayBuffer), `byteIndex` (a non-negative [integer](#integer)), `type` (a [TypedArray element type](#sec-typedarray-objects)), `isTypedArray` (a Boolean), and `order` (seq-cst or unordered) and optional argument `isLittleEndian` (a Boolean) and returns a Number or a BigInt. It performs the following steps when called:

1.  [Assert](#assert): [IsDetachedBuffer](#sec-isdetachedbuffer)(`arrayBuffer`) is false.
2.  [Assert](#assert): There are sufficient bytes in `arrayBuffer` starting at `byteIndex` to represent a value of `type`.
3.  Let `block` be `arrayBuffer`.`[[ArrayBufferData]]`.
4.  Let `elementSize` be the Element Size value specified in [Table 73](#table-the-typedarray-constructors) for Element Type `type`.
5.  If [IsSharedArrayBuffer](#sec-issharedarraybuffer)(`arrayBuffer`) is true, then
    1.  [Assert](#assert): `block` is a [Shared Data Block](#sec-data-blocks).
    2.  Let `rawValue` be [GetRawBytesFromSharedBlock](#sec-getrawbytesfromsharedblock)(`block`, `byteIndex`, `type`, `isTypedArray`, `order`).
6.  Else,
    1.  Let `rawValue` be a [List](#sec-list-and-record-specification-type) whose elements are bytes from `block` at indices in the [interval](#interval) from `byteIndex` (inclusive) to `byteIndex` + `elementSize` (exclusive).
7.  [Assert](#assert): The number of elements in `rawValue` is `elementSize`.
8.  If `isLittleEndian` is not present, set `isLittleEndian` to the value of the `[[LittleEndian]]` field of the [surrounding agent](#surrounding-agent)'s [Agent Record](#agent-record).
9.  Return [RawBytesToNumeric](#sec-rawbytestonumeric)(`type`, `rawValue`, `isLittleEndian`).

#### 25.1.3.17 NumericToRawBytes ( `type`, `value`, `isLittleEndian` )

The abstract operation NumericToRawBytes takes arguments `type` (a [TypedArray element type](#sec-typedarray-objects)), `value` (a Number or a BigInt), and `isLittleEndian` (a Boolean) and returns a [List](#sec-list-and-record-specification-type) of [byte values](#sec-data-blocks). It performs the following steps when called:

1.  If `type` is float16, then
    1.  Let `rawBytes` be a [List](#sec-list-and-record-specification-type) whose elements are the 2 bytes that are the result of converting `value` to [IEEE 754-2019](#sec-bibliography) binary16 format using roundTiesToEven mode. The bytes are arranged in little endian order. If `value` is NaN, `rawBytes` may be set to any implementation chosen [IEEE 754-2019](#sec-bibliography) binary16 format NaN encoding. An implementation must always choose the same encoding for each implementation distinguishable NaN value.
2.  Else if `type` is float32, then
    1.  Let `rawBytes` be a [List](#sec-list-and-record-specification-type) whose elements are the 4 bytes that are the result of converting `value` to [IEEE 754-2019](#sec-bibliography) binary32 format using roundTiesToEven mode. The bytes are arranged in little endian order. If `value` is NaN, `rawBytes` may be set to any implementation chosen [IEEE 754-2019](#sec-bibliography) binary32 format NaN encoding. An implementation must always choose the same encoding for each implementation distinguishable NaN value.
3.  Else if `type` is float64, then
    1.  Let `rawBytes` be a [List](#sec-list-and-record-specification-type) whose elements are the 8 bytes that are the [IEEE 754-2019](#sec-bibliography) binary64 format encoding of `value`. The bytes are arranged in little endian order. If `value` is NaN, `rawBytes` may be set to any implementation chosen [IEEE 754-2019](#sec-bibliography) binary64 format NaN encoding. An implementation must always choose the same encoding for each implementation distinguishable NaN value.
4.  Else,
    1.  Let `n` be the Element Size value specified in [Table 73](#table-the-typedarray-constructors) for Element Type `type`.
    2.  Let `conversionOperation` be the abstract operation named in the Conversion Operation column in [Table 73](#table-the-typedarray-constructors) for Element Type `type`.
    3.  Let `intValue` be [ℝ](#ℝ)(`conversionOperation`(`value`)).
    4.  If `intValue` ≥ 0, then
        1.  Let `rawBytes` be a [List](#sec-list-and-record-specification-type) whose elements are the `n`-byte binary encoding of `intValue`. The bytes are ordered in little endian order.
    5.  Else,
        1.  Let `rawBytes` be a [List](#sec-list-and-record-specification-type) whose elements are the `n`-byte binary two's complement encoding of `intValue`. The bytes are ordered in little endian order.
5.  If `isLittleEndian` is false, reverse the order of the elements of `rawBytes`.
6.  Return `rawBytes`.

#### 25.1.3.18 SetValueInBuffer ( `arrayBuffer`, `byteIndex`, `type`, `value`, `isTypedArray`, `order` \[ , `isLittleEndian` \] )

The abstract operation SetValueInBuffer takes arguments `arrayBuffer` (an ArrayBuffer or SharedArrayBuffer), `byteIndex` (a non-negative [integer](#integer)), `type` (a [TypedArray element type](#sec-typedarray-objects)), `value` (a Number or a BigInt), `isTypedArray` (a Boolean), and `order` (seq-cst, unordered, or init) and optional argument `isLittleEndian` (a Boolean) and returns unused. It performs the following steps when called:

1.  [Assert](#assert): [IsDetachedBuffer](#sec-isdetachedbuffer)(`arrayBuffer`) is false.
2.  [Assert](#assert): There are sufficient bytes in `arrayBuffer` starting at `byteIndex` to represent a value of `type`.
3.  [Assert](#assert): `value` [is a BigInt](#sec-ecmascript-language-types-bigint-type) if [IsBigIntElementType](#sec-isbigintelementtype)(`type`) is true; otherwise, `value` [is a Number](#sec-ecmascript-language-types-number-type).
4.  Let `block` be `arrayBuffer`.`[[ArrayBufferData]]`.
5.  Let `elementSize` be the Element Size value specified in [Table 73](#table-the-typedarray-constructors) for Element Type `type`.
6.  If `isLittleEndian` is not present, set `isLittleEndian` to the value of the `[[LittleEndian]]` field of the [surrounding agent](#surrounding-agent)'s [Agent Record](#agent-record).
7.  Let `rawBytes` be [NumericToRawBytes](#sec-numerictorawbytes)(`type`, `value`, `isLittleEndian`).
8.  If [IsSharedArrayBuffer](#sec-issharedarraybuffer)(`arrayBuffer`) is true, then
    1.  Let `execution` be the `[[CandidateExecution]]` field of the [surrounding agent](#surrounding-agent)'s [Agent Record](#agent-record).
    2.  Let `eventsRecord` be the [Agent Events Record](#sec-agent-event-records) of `execution`.`[[EventsRecords]]` whose `[[AgentSignifier]]` is [AgentSignifier](#sec-agentsignifier)().
    3.  If `isTypedArray` is true and [IsNoTearConfiguration](#sec-isnotearconfiguration)(`type`, `order`) is true, let `noTear` be true; otherwise let `noTear` be false.
    4.  Append [WriteSharedMemory](#sec-memory-model-fundamentals) { `[[Order]]`: `order`, `[[NoTear]]`: `noTear`, `[[Block]]`: `block`, `[[ByteIndex]]`: `byteIndex`, `[[ElementSize]]`: `elementSize`, `[[Payload]]`: `rawBytes` } to `eventsRecord`.`[[EventList]]`.
9.  Else,
    1.  Store the individual bytes of `rawBytes` into `block`, starting at `block`\[`byteIndex`\].
10. Return unused.

#### 25.1.3.19 GetModifySetValueInBuffer ( `arrayBuffer`, `byteIndex`, `type`, `value`, `op` )

The abstract operation GetModifySetValueInBuffer takes arguments `arrayBuffer` (an ArrayBuffer or a SharedArrayBuffer), `byteIndex` (a non-negative [integer](#integer)), `type` (a [TypedArray element type](#sec-typedarray-objects)), `value` (a Number or a BigInt), and `op` (a [read-modify-write modification function](#sec-arraybuffer-notation)) and returns a Number or a BigInt. It performs the following steps when called:

1.  [Assert](#assert): [IsDetachedBuffer](#sec-isdetachedbuffer)(`arrayBuffer`) is false.
2.  [Assert](#assert): There are sufficient bytes in `arrayBuffer` starting at `byteIndex` to represent a value of `type`.
3.  [Assert](#assert): `value` [is a BigInt](#sec-ecmascript-language-types-bigint-type) if [IsBigIntElementType](#sec-isbigintelementtype)(`type`) is true; otherwise, `value` [is a Number](#sec-ecmascript-language-types-number-type).
4.  Let `block` be `arrayBuffer`.`[[ArrayBufferData]]`.
5.  Let `elementSize` be the Element Size value specified in [Table 73](#table-the-typedarray-constructors) for Element Type `type`.
6.  Let `isLittleEndian` be the value of the `[[LittleEndian]]` field of the [surrounding agent](#surrounding-agent)'s [Agent Record](#agent-record).
7.  Let `rawBytes` be [NumericToRawBytes](#sec-numerictorawbytes)(`type`, `value`, `isLittleEndian`).
8.  If [IsSharedArrayBuffer](#sec-issharedarraybuffer)(`arrayBuffer`) is true, then
    1.  Let `execution` be the `[[CandidateExecution]]` field of the [surrounding agent](#surrounding-agent)'s [Agent Record](#agent-record).
    2.  Let `eventsRecord` be the [Agent Events Record](#sec-agent-event-records) of `execution`.`[[EventsRecords]]` whose `[[AgentSignifier]]` is [AgentSignifier](#sec-agentsignifier)().
    3.  Let `rawBytesRead` be a [List](#sec-list-and-record-specification-type) of length `elementSize` whose elements are nondeterministically chosen [byte values](#sec-data-blocks).
    4.  NOTE: In implementations, `rawBytesRead` is the result of a load-link, of a load-exclusive, or of an operand of a read-modify-write instruction on the underlying hardware. The nondeterminism is a semantic prescription of the [memory model](#sec-memory-model) to describe observable behaviour of hardware with weak consistency.
    5.  Let `rmwEvent` be [ReadModifyWriteSharedMemory](#sec-memory-model-fundamentals) { `[[Order]]`: seq-cst, `[[NoTear]]`: true, `[[Block]]`: `block`, `[[ByteIndex]]`: `byteIndex`, `[[ElementSize]]`: `elementSize`, `[[Payload]]`: `rawBytes`, `[[ModifyOp]]`: `op` }.
    6.  Append `rmwEvent` to `eventsRecord`.`[[EventList]]`.
    7.  Append [Chosen Value Record](#sec-chosen-value-records) { `[[Event]]`: `rmwEvent`, `[[ChosenValue]]`: `rawBytesRead` } to `execution`.`[[ChosenValues]]`.
9.  Else,
    1.  Let `rawBytesRead` be a [List](#sec-list-and-record-specification-type) of length `elementSize` whose elements are the sequence of `elementSize` bytes starting with `block`\[`byteIndex`\].
    2.  Let `rawBytesModified` be `op`(`rawBytesRead`, `rawBytes`).
    3.  Store the individual bytes of `rawBytesModified` into `block`, starting at `block`\[`byteIndex`\].
10. Return [RawBytesToNumeric](#sec-rawbytestonumeric)(`type`, `rawBytesRead`, `isLittleEndian`).

### 25.1.4 The ArrayBuffer Constructor

The ArrayBuffer [constructor](#constructor):

- is %ArrayBuffer%.
- is the initial value of the "ArrayBuffer" property of the [global object](#sec-global-object).
- creates and initializes a new ArrayBuffer when called as a [constructor](#constructor).
- is not intended to be called as a function and will throw an exception when called in that manner.
- may be used as the value of an `extends` clause of a class definition. Subclass [constructors](#constructor) that intend to inherit the specified ArrayBuffer behaviour must include a `super` call to the ArrayBuffer [constructor](#constructor) to create and initialize subclass instances with the internal state necessary to support the `ArrayBuffer.prototype` built-in methods.

#### 25.1.4.1 ArrayBuffer ( `length` \[ , `options` \] )

This function performs the following steps when called:

1.  If NewTarget is undefined, throw a TypeError exception.
2.  Let `byteLength` be ? [ToIndex](#sec-toindex)(`length`).
3.  Let `requestedMaxByteLength` be ? [GetArrayBufferMaxByteLengthOption](#sec-getarraybuffermaxbytelengthoption)(`options`).
4.  Return ? [AllocateArrayBuffer](#sec-allocatearraybuffer)(NewTarget, `byteLength`, `requestedMaxByteLength`).

### 25.1.5 Properties of the ArrayBuffer Constructor

The ArrayBuffer [constructor](#constructor):

- has a `[[Prototype]]` internal slot whose value is [%Function.prototype%](#sec-properties-of-the-function-prototype-object).
- has the following properties:

#### 25.1.5.1 ArrayBuffer.isView ( `arg` )

This function performs the following steps when called:

1.  If `arg` [is not an Object](#sec-object-type), return false.
2.  If `arg` has a `[[ViewedArrayBuffer]]` internal slot, return true.
3.  Return false.

#### 25.1.5.2 ArrayBuffer.prototype

The initial value of `ArrayBuffer.prototype` is the [ArrayBuffer prototype object](#sec-properties-of-the-arraybuffer-prototype-object).

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

#### 25.1.5.3 get ArrayBuffer \[ %Symbol.species% \]

`ArrayBuffer[%Symbol.species%]` is an [accessor property](#sec-object-type) whose set accessor function is undefined. Its get accessor function performs the following steps when called:

1.  Return the this value.

The value of the "name" property of this function is "get \[Symbol.species\]".

Note

[ArrayBuffer.prototype.slice ( `start`, `end` )](#sec-arraybuffer.prototype.slice) normally uses its this value's [constructor](#constructor) to create a derived object. However, a subclass [constructor](#constructor) may over-ride that default behaviour for the [ArrayBuffer.prototype.slice ( `start`, `end` )](#sec-arraybuffer.prototype.slice) method by redefining its [%Symbol.species%](#sec-well-known-symbols) property.

### 25.1.6 Properties of the ArrayBuffer Prototype Object

The ArrayBuffer prototype object:

- is %ArrayBuffer.prototype%.
- has a `[[Prototype]]` internal slot whose value is [%Object.prototype%](#sec-properties-of-the-object-prototype-object).
- is an [ordinary object](#ordinary-object).
- does not have an `[[ArrayBufferData]]` or `[[ArrayBufferByteLength]]` internal slot.

#### 25.1.6.1 get ArrayBuffer.prototype.byteLength

`ArrayBuffer.prototype.byteLength` is an [accessor property](#sec-object-type) whose set accessor function is undefined. Its get accessor function performs the following steps when called:

1.  Let `O` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`O`, `[[ArrayBufferData]]`).
3.  If [IsSharedArrayBuffer](#sec-issharedarraybuffer)(`O`) is true, throw a TypeError exception.
4.  If [IsDetachedBuffer](#sec-isdetachedbuffer)(`O`) is true, return +0_(𝔽).
5.  Let `length` be `O`.`[[ArrayBufferByteLength]]`.
6.  Return [𝔽](#𝔽)(`length`).

#### 25.1.6.2 ArrayBuffer.prototype.constructor

The initial value of `ArrayBuffer.prototype.constructor` is [%ArrayBuffer%](#sec-arraybuffer-constructor).

#### 25.1.6.3 get ArrayBuffer.prototype.detached

`ArrayBuffer.prototype.detached` is an [accessor property](#sec-object-type) whose set accessor function is undefined. Its get accessor function performs the following steps when called:

1.  Let `O` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`O`, `[[ArrayBufferData]]`).
3.  If [IsSharedArrayBuffer](#sec-issharedarraybuffer)(`O`) is true, throw a TypeError exception.
4.  Return [IsDetachedBuffer](#sec-isdetachedbuffer)(`O`).

#### 25.1.6.4 get ArrayBuffer.prototype.maxByteLength

`ArrayBuffer.prototype.maxByteLength` is an [accessor property](#sec-object-type) whose set accessor function is undefined. Its get accessor function performs the following steps when called:

1.  Let `O` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`O`, `[[ArrayBufferData]]`).
3.  If [IsSharedArrayBuffer](#sec-issharedarraybuffer)(`O`) is true, throw a TypeError exception.
4.  If [IsDetachedBuffer](#sec-isdetachedbuffer)(`O`) is true, return +0_(𝔽).
5.  If [IsFixedLengthArrayBuffer](#sec-isfixedlengtharraybuffer)(`O`) is true, then
    1.  Let `length` be `O`.`[[ArrayBufferByteLength]]`.
6.  Else,
    1.  Let `length` be `O`.`[[ArrayBufferMaxByteLength]]`.
7.  Return [𝔽](#𝔽)(`length`).

#### 25.1.6.5 get ArrayBuffer.prototype.resizable

`ArrayBuffer.prototype.resizable` is an [accessor property](#sec-object-type) whose set accessor function is undefined. Its get accessor function performs the following steps when called:

1.  Let `O` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`O`, `[[ArrayBufferData]]`).
3.  If [IsSharedArrayBuffer](#sec-issharedarraybuffer)(`O`) is true, throw a TypeError exception.
4.  If [IsFixedLengthArrayBuffer](#sec-isfixedlengtharraybuffer)(`O`) is false, return true; otherwise return false.

#### 25.1.6.6 ArrayBuffer.prototype.resize ( `newLength` )

This method performs the following steps when called:

1.  Let `O` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`O`, `[[ArrayBufferMaxByteLength]]`).
3.  If [IsSharedArrayBuffer](#sec-issharedarraybuffer)(`O`) is true, throw a TypeError exception.
4.  Let `newByteLength` be ? [ToIndex](#sec-toindex)(`newLength`).
5.  If [IsDetachedBuffer](#sec-isdetachedbuffer)(`O`) is true, throw a TypeError exception.
6.  If `newByteLength` \> `O`.`[[ArrayBufferMaxByteLength]]`, throw a RangeError exception.
7.  Let `hostHandled` be ? [HostResizeArrayBuffer](#sec-hostresizearraybuffer)(`O`, `newByteLength`).
8.  If `hostHandled` is handled, return undefined.
9.  Let `oldBlock` be `O`.`[[ArrayBufferData]]`.
10. Let `newBlock` be ? [CreateByteDataBlock](#sec-createbytedatablock)(`newByteLength`).
11. Let `copyLength` be [min](#eqn-min)(`newByteLength`, `O`.`[[ArrayBufferByteLength]]`).
12. Perform [CopyDataBlockBytes](#sec-copydatablockbytes)(`newBlock`, 0, `oldBlock`, 0, `copyLength`).
13. NOTE: Neither creation of the new [Data Block](#sec-data-blocks) nor copying from the old [Data Block](#sec-data-blocks) are observable. Implementations may implement this method as in-place growth or shrinkage.
14. Set `O`.`[[ArrayBufferData]]` to `newBlock`.
15. Set `O`.`[[ArrayBufferByteLength]]` to `newByteLength`.
16. Return undefined.

#### 25.1.6.7 ArrayBuffer.prototype.slice ( `start`, `end` )

This method performs the following steps when called:

1.  Let `O` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`O`, `[[ArrayBufferData]]`).
3.  If [IsSharedArrayBuffer](#sec-issharedarraybuffer)(`O`) is true, throw a TypeError exception.
4.  If [IsDetachedBuffer](#sec-isdetachedbuffer)(`O`) is true, throw a TypeError exception.
5.  Let `len` be `O`.`[[ArrayBufferByteLength]]`.
6.  Let `relativeStart` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`start`).
7.  If `relativeStart` = -∞, let `first` be 0.
8.  Else if `relativeStart` \< 0, let `first` be [max](#eqn-max)(`len` + `relativeStart`, 0).
9.  Else, let `first` be [min](#eqn-min)(`relativeStart`, `len`).
10. If `end` is undefined, let `relativeEnd` be `len`; else let `relativeEnd` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`end`).
11. If `relativeEnd` = -∞, let `final` be 0.
12. Else if `relativeEnd` \< 0, let `final` be [max](#eqn-max)(`len` + `relativeEnd`, 0).
13. Else, let `final` be [min](#eqn-min)(`relativeEnd`, `len`).
14. Let `newLen` be [max](#eqn-max)(`final` - `first`, 0).
15. Let `ctor` be ? [SpeciesConstructor](#sec-speciesconstructor)(`O`, [%ArrayBuffer%](#sec-arraybuffer-constructor)).
16. Let `new` be ? [Construct](#sec-construct)(`ctor`, « [𝔽](#𝔽)(`newLen`) »).
17. Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`new`, `[[ArrayBufferData]]`).
18. If [IsSharedArrayBuffer](#sec-issharedarraybuffer)(`new`) is true, throw a TypeError exception.
19. If [IsDetachedBuffer](#sec-isdetachedbuffer)(`new`) is true, throw a TypeError exception.
20. If [SameValue](#sec-samevalue)(`new`, `O`) is true, throw a TypeError exception.
21. If `new`.`[[ArrayBufferByteLength]]` \< `newLen`, throw a TypeError exception.
22. NOTE: Side-effects of the above steps may have detached or resized `O`.
23. If [IsDetachedBuffer](#sec-isdetachedbuffer)(`O`) is true, throw a TypeError exception.
24. Let `fromBuf` be `O`.`[[ArrayBufferData]]`.
25. Let `toBuf` be `new`.`[[ArrayBufferData]]`.
26. Let `currentLen` be `O`.`[[ArrayBufferByteLength]]`.
27. If `first` \< `currentLen`, then
    1.  Let `count` be [min](#eqn-min)(`newLen`, `currentLen` - `first`).
    2.  Perform [CopyDataBlockBytes](#sec-copydatablockbytes)(`toBuf`, 0, `fromBuf`, `first`, `count`).
28. Return `new`.

#### 25.1.6.8 ArrayBuffer.prototype.transfer ( \[ `newLength` \] )

This method performs the following steps when called:

1.  Let `O` be the this value.
2.  Return ? [ArrayBufferCopyAndDetach](#sec-arraybuffercopyanddetach)(`O`, `newLength`, preserve-resizability).

#### 25.1.6.9 ArrayBuffer.prototype.transferToFixedLength ( \[ `newLength` \] )

This method performs the following steps when called:

1.  Let `O` be the this value.
2.  Return ? [ArrayBufferCopyAndDetach](#sec-arraybuffercopyanddetach)(`O`, `newLength`, fixed-length).

#### 25.1.6.10 ArrayBuffer.prototype \[ %Symbol.toStringTag% \]

The initial value of the [%Symbol.toStringTag%](#sec-well-known-symbols) property is the String value "ArrayBuffer".

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: true }.

### 25.1.7 Properties of ArrayBuffer Instances

ArrayBuffer instances inherit properties from the [ArrayBuffer prototype object](#sec-properties-of-the-arraybuffer-prototype-object). ArrayBuffer instances each have an `[[ArrayBufferData]]` internal slot, an `[[ArrayBufferByteLength]]` internal slot, and an `[[ArrayBufferDetachKey]]` internal slot. ArrayBuffer instances which are resizable each have an `[[ArrayBufferMaxByteLength]]` internal slot.

ArrayBuffer instances whose `[[ArrayBufferData]]` is null are considered to be detached and all operators to access or modify data contained in the ArrayBuffer instance will fail.

ArrayBuffer instances whose `[[ArrayBufferDetachKey]]` is set to a value other than undefined need to have all [DetachArrayBuffer](#sec-detacharraybuffer) calls passing that same "detach key" as an argument, otherwise a TypeError will result. This internal slot is only ever set by certain embedding environments, not by algorithms in this specification.

### 25.1.8 Resizable ArrayBuffer Guidelines

Note 1

The following are guidelines for ECMAScript programmers working with [resizable ArrayBuffer](#sec-fixed-length-and-resizable-arraybuffer-objects).

We recommend that programs be tested in their deployment environments where possible. The amount of available physical memory differs greatly between hardware devices. Similarly, virtual memory subsystems also differ greatly between hardware devices as well as operating systems. An application that runs without out-of-memory errors on a 64-bit desktop web browser could run out of memory on a 32-bit mobile web browser.

When choosing a value for the "maxByteLength" option for [resizable ArrayBuffer](#sec-fixed-length-and-resizable-arraybuffer-objects), we recommend that the smallest possible size for the application be chosen. We recommend that "maxByteLength" does not exceed 1,073,741,824 (2\*\*³⁰ bytes or 1GiB).

Please note that successfully constructing a [resizable ArrayBuffer](#sec-fixed-length-and-resizable-arraybuffer-objects) for a particular maximum size does not guarantee that future resizes will succeed.

Note 2

The following are guidelines for ECMAScript implementers implementing [resizable ArrayBuffer](#sec-fixed-length-and-resizable-arraybuffer-objects).

[Resizable ArrayBuffer](#sec-fixed-length-and-resizable-arraybuffer-objects) can be implemented as copying upon resize, as in-place growth via reserving virtual memory up front, or as a combination of both for different values of the [constructor](#constructor)'s "maxByteLength" option.

If a [host](#host) is multi-tenanted (i.e. it runs many ECMAScript applications simultaneously), such as a web browser, and its implementations choose to implement in-place growth by reserving virtual memory, we recommend that both 32-bit and 64-bit implementations throw for values of "maxByteLength" ≥ 1GiB to 1.5GiB. This is to reduce the likelihood a single application can exhaust the virtual memory address space and to reduce interoperability risk.

If a [host](#host) does not have virtual memory, such as those running on embedded devices without an MMU, or if a [host](#host) only implements resizing by copying, it may accept any Number value for the "maxByteLength" option. However, we recommend a RangeError be thrown if a memory block of the requested size can never be allocated. For example, if the requested size is greater than the maximum amount of usable memory on the device.

## 25.2 SharedArrayBuffer Objects

### 25.2.1 Fixed-length and Growable SharedArrayBuffer Objects

A fixed-length SharedArrayBuffer is a SharedArrayBuffer whose byte length cannot change after creation.

A growable SharedArrayBuffer is a SharedArrayBuffer whose byte length may increase after creation via calls to [SharedArrayBuffer.prototype.grow ( `newLength` )](#sec-sharedarraybuffer.prototype.grow).

The kind of SharedArrayBuffer object that is created depends on the arguments passed to [SharedArrayBuffer ( `length` \[ , `options` \] )](#sec-sharedarraybuffer-length).

### 25.2.2 Abstract Operations for SharedArrayBuffer Objects

#### 25.2.2.1 AllocateSharedArrayBuffer ( `constructor`, `byteLength` \[ , `maxByteLength` \] )

The abstract operation AllocateSharedArrayBuffer takes arguments `constructor` (a [constructor](#constructor)) and `byteLength` (a non-negative [integer](#integer)) and optional argument `maxByteLength` (a non-negative [integer](#integer) or empty) and returns either a [normal completion containing](#sec-completion-record-specification-type) a SharedArrayBuffer or a [throw completion](#sec-completion-record-specification-type). It is used to create a SharedArrayBuffer. It performs the following steps when called:

1.  Let `slots` be « `[[ArrayBufferData]]` ».
2.  If `maxByteLength` is present and `maxByteLength` is not empty, let `allocatingGrowableBuffer` be true; otherwise let `allocatingGrowableBuffer` be false.
3.  If `allocatingGrowableBuffer` is true, then
    1.  If `byteLength` \> `maxByteLength`, throw a RangeError exception.
    2.  Append `[[ArrayBufferByteLengthData]]` and `[[ArrayBufferMaxByteLength]]` to `slots`.
4.  Else,
    1.  Append `[[ArrayBufferByteLength]]` to `slots`.
5.  Let `obj` be ? [OrdinaryCreateFromConstructor](#sec-ordinarycreatefromconstructor)(`constructor`, "%SharedArrayBuffer.prototype%", `slots`).
6.  If `allocatingGrowableBuffer` is true, let `allocLength` be `maxByteLength`; otherwise let `allocLength` be `byteLength`.
7.  Let `block` be ? [CreateSharedByteDataBlock](#sec-createsharedbytedatablock)(`allocLength`).
8.  Set `obj`.`[[ArrayBufferData]]` to `block`.
9.  If `allocatingGrowableBuffer` is true, then
    1.  [Assert](#assert): `byteLength` ≤ `maxByteLength`.
    2.  Let `byteLengthBlock` be ? [CreateSharedByteDataBlock](#sec-createsharedbytedatablock)(8).
    3.  Perform [SetValueInBuffer](#sec-setvalueinbuffer)(`byteLengthBlock`, 0, biguint64, [ℤ](#ℤ)(`byteLength`), true, seq-cst).
    4.  Set `obj`.`[[ArrayBufferByteLengthData]]` to `byteLengthBlock`.
    5.  Set `obj`.`[[ArrayBufferMaxByteLength]]` to `maxByteLength`.
10. Else,
    1.  Set `obj`.`[[ArrayBufferByteLength]]` to `byteLength`.
11. Return `obj`.

#### 25.2.2.2 IsSharedArrayBuffer ( `obj` )

The abstract operation IsSharedArrayBuffer takes argument `obj` (an ArrayBuffer or a SharedArrayBuffer) and returns a Boolean. It tests whether an object is an ArrayBuffer, a SharedArrayBuffer, or a subtype of either. It performs the following steps when called:

1.  Let `bufferData` be `obj`.`[[ArrayBufferData]]`.
2.  If `bufferData` is null, return false.
3.  If `bufferData` is a [Data Block](#sec-data-blocks), return false.
4.  [Assert](#assert): `bufferData` is a [Shared Data Block](#sec-data-blocks).
5.  Return true.

#### 25.2.2.3 HostGrowSharedArrayBuffer ( `buffer`, `newByteLength` )

The [host-defined](#host-defined) abstract operation HostGrowSharedArrayBuffer takes arguments `buffer` (a SharedArrayBuffer) and `newByteLength` (a non-negative [integer](#integer)) and returns either a [normal completion containing](#sec-completion-record-specification-type) either handled or unhandled, or a [throw completion](#sec-completion-record-specification-type). It gives the [host](#host) an opportunity to perform [implementation-defined](#implementation-defined) growing of `buffer`. If the [host](#host) chooses not to handle growing of `buffer`, it may return unhandled for the default behaviour.

The implementation of HostGrowSharedArrayBuffer must conform to the following requirements:

- If the abstract operation does not complete normally with unhandled, and `newByteLength` \< the current byte length of the `buffer` or `newByteLength` \> `buffer`.`[[ArrayBufferMaxByteLength]]`, throw a RangeError exception.
- Let `isLittleEndian` be the value of the `[[LittleEndian]]` field of the [surrounding agent](#surrounding-agent)'s [Agent Record](#agent-record). If the abstract operation completes normally with handled, a [WriteSharedMemory](#sec-memory-model-fundamentals) or [ReadModifyWriteSharedMemory](#sec-memory-model-fundamentals) event whose `[[Order]]` is seq-cst, `[[Payload]]` is [NumericToRawBytes](#sec-numerictorawbytes)(biguint64, `newByteLength`, `isLittleEndian`), `[[Block]]` is `buffer`.`[[ArrayBufferByteLengthData]]`, `[[ByteIndex]]` is 0, and `[[ElementSize]]` is 8 is added to the [surrounding agent](#surrounding-agent)'s [candidate execution](#sec-candidate-executions) such that racing calls to `SharedArrayBuffer.prototype.grow` are not "lost", i.e. silently do nothing.

Note

The second requirement above is intentionally vague about how or when the current byte length of `buffer` is read. Because the byte length must be updated via an atomic read-modify-write operation on the underlying hardware, architectures that use load-link/store-conditional or load-exclusive/store-exclusive instruction pairs may wish to keep the paired instructions close in the instruction stream. As such, SharedArrayBuffer.prototype.grow itself does not perform bounds checking on `newByteLength` before calling HostGrowSharedArrayBuffer, nor is there a requirement on when the current byte length is read.

This is in contrast with [HostResizeArrayBuffer](#sec-hostresizearraybuffer), which is guaranteed that the value of `newByteLength` is ≥ 0 and ≤ `buffer`.`[[ArrayBufferMaxByteLength]]`.

The default implementation of HostGrowSharedArrayBuffer is to return [NormalCompletion](#sec-normalcompletion)(unhandled).

### 25.2.3 The SharedArrayBuffer Constructor

The SharedArrayBuffer [constructor](#constructor):

- is %SharedArrayBuffer%.
- is the initial value of the "SharedArrayBuffer" property of the [global object](#sec-global-object), if that property is present (see below).
- creates and initializes a new SharedArrayBuffer when called as a [constructor](#constructor).
- is not intended to be called as a function and will throw an exception when called in that manner.
- may be used as the value of an `extends` clause of a class definition. Subclass [constructors](#constructor) that intend to inherit the specified SharedArrayBuffer behaviour must include a `super` call to the SharedArrayBuffer [constructor](#constructor) to create and initialize subclass instances with the internal state necessary to support the `SharedArrayBuffer.prototype` built-in methods.

Whenever a [host](#host) does not provide concurrent access to SharedArrayBuffers it may omit the "SharedArrayBuffer" property of the [global object](#sec-global-object).

Note

Unlike an `ArrayBuffer`, a `SharedArrayBuffer` cannot become detached, and its internal `[[ArrayBufferData]]` slot is never null.

#### 25.2.3.1 SharedArrayBuffer ( `length` \[ , `options` \] )

This function performs the following steps when called:

1.  If NewTarget is undefined, throw a TypeError exception.
2.  Let `byteLength` be ? [ToIndex](#sec-toindex)(`length`).
3.  Let `requestedMaxByteLength` be ? [GetArrayBufferMaxByteLengthOption](#sec-getarraybuffermaxbytelengthoption)(`options`).
4.  Return ? [AllocateSharedArrayBuffer](#sec-allocatesharedarraybuffer)(NewTarget, `byteLength`, `requestedMaxByteLength`).

### 25.2.4 Properties of the SharedArrayBuffer Constructor

The SharedArrayBuffer [constructor](#constructor):

- has a `[[Prototype]]` internal slot whose value is [%Function.prototype%](#sec-properties-of-the-function-prototype-object).
- has the following properties:

#### 25.2.4.1 SharedArrayBuffer.prototype

The initial value of `SharedArrayBuffer.prototype` is the [SharedArrayBuffer prototype object](#sec-properties-of-the-sharedarraybuffer-prototype-object).

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

#### 25.2.4.2 get SharedArrayBuffer \[ %Symbol.species% \]

`SharedArrayBuffer[%Symbol.species%]` is an [accessor property](#sec-object-type) whose set accessor function is undefined. Its get accessor function performs the following steps when called:

1.  Return the this value.

The value of the "name" property of this function is "get \[Symbol.species\]".

### 25.2.5 Properties of the SharedArrayBuffer Prototype Object

The SharedArrayBuffer prototype object:

- is %SharedArrayBuffer.prototype%.
- has a `[[Prototype]]` internal slot whose value is [%Object.prototype%](#sec-properties-of-the-object-prototype-object).
- is an [ordinary object](#ordinary-object).
- does not have an `[[ArrayBufferData]]` or `[[ArrayBufferByteLength]]` internal slot.

#### 25.2.5.1 get SharedArrayBuffer.prototype.byteLength

`SharedArrayBuffer.prototype.byteLength` is an [accessor property](#sec-object-type) whose set accessor function is undefined. Its get accessor function performs the following steps when called:

1.  Let `O` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`O`, `[[ArrayBufferData]]`).
3.  If [IsSharedArrayBuffer](#sec-issharedarraybuffer)(`O`) is false, throw a TypeError exception.
4.  Let `length` be [ArrayBufferByteLength](#sec-arraybufferbytelength)(`O`, seq-cst).
5.  Return [𝔽](#𝔽)(`length`).

#### 25.2.5.2 SharedArrayBuffer.prototype.constructor

The initial value of `SharedArrayBuffer.prototype.constructor` is [%SharedArrayBuffer%](#sec-sharedarraybuffer-constructor).

#### 25.2.5.3 SharedArrayBuffer.prototype.grow ( `newLength` )

This method performs the following steps when called:

1.  Let `O` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`O`, `[[ArrayBufferMaxByteLength]]`).
3.  If [IsSharedArrayBuffer](#sec-issharedarraybuffer)(`O`) is false, throw a TypeError exception.
4.  Let `newByteLength` be ? [ToIndex](#sec-toindex)(`newLength`).
5.  Let `hostHandled` be ? [HostGrowSharedArrayBuffer](#sec-hostgrowsharedarraybuffer)(`O`, `newByteLength`).
6.  If `hostHandled` is handled, return undefined.
7.  Let `isLittleEndian` be the value of the `[[LittleEndian]]` field of the [surrounding agent](#surrounding-agent)'s [Agent Record](#agent-record).
8.  Let `byteLengthBlock` be `O`.`[[ArrayBufferByteLengthData]]`.
9.  Let `currentByteLengthRawBytes` be [GetRawBytesFromSharedBlock](#sec-getrawbytesfromsharedblock)(`byteLengthBlock`, 0, biguint64, true, seq-cst).
10. Let `newByteLengthRawBytes` be [NumericToRawBytes](#sec-numerictorawbytes)(biguint64, [ℤ](#ℤ)(`newByteLength`), `isLittleEndian`).
11. Repeat,
    1.  NOTE: This is a compare-and-exchange loop to ensure that parallel, racing grows of the same buffer are totally ordered, are not lost, and do not silently do nothing. The loop exits if it was able to attempt to grow uncontended.
    2.  Let `currentByteLength` be [ℝ](#ℝ)([RawBytesToNumeric](#sec-rawbytestonumeric)(biguint64, `currentByteLengthRawBytes`, `isLittleEndian`)).
    3.  If `newByteLength` = `currentByteLength`, return undefined.
    4.  If `newByteLength` \< `currentByteLength` or `newByteLength` \> `O`.`[[ArrayBufferMaxByteLength]]`, throw a RangeError exception.
    5.  Let `byteLengthDelta` be `newByteLength` - `currentByteLength`.
    6.  If it is impossible to create a new [Shared Data Block](#sec-data-blocks) value consisting of `byteLengthDelta` bytes, throw a RangeError exception.
    7.  NOTE: No new [Shared Data Block](#sec-data-blocks) is constructed and used here. The observable behaviour of growable SharedArrayBuffers is specified by allocating a [max](#eqn-max)-sized [Shared Data Block](#sec-data-blocks) at construction time, and this step captures the requirement that implementations that run out of memory must throw a RangeError.
    8.  Let `readByteLengthRawBytes` be [AtomicCompareExchangeInSharedBlock](#sec-atomiccompareexchangeinsharedblock)(`byteLengthBlock`, 0, 8, `currentByteLengthRawBytes`, `newByteLengthRawBytes`).
    9.  If [ByteListEqual](#sec-bytelistequal)(`readByteLengthRawBytes`, `currentByteLengthRawBytes`) is true, return undefined.
    10. Set `currentByteLengthRawBytes` to `readByteLengthRawBytes`.

Note

Spurious failures of the compare-exchange to update the length are prohibited. If the bounds checking for the new length passes and the implementation is not out of memory, a [ReadModifyWriteSharedMemory](#sec-memory-model-fundamentals) event (i.e. a successful compare-exchange) is always added into the [candidate execution](#sec-candidate-executions).

Parallel calls to SharedArrayBuffer.prototype.grow are totally ordered. For example, consider two racing calls: `sab.grow(10)` and `sab.grow(20)`. One of the two calls is guaranteed to win the race. The call to `sab.grow(10)` will never shrink `sab` even if `sab.grow(20)` happened first; in that case it will instead throw a RangeError.

#### 25.2.5.4 get SharedArrayBuffer.prototype.growable

`SharedArrayBuffer.prototype.growable` is an [accessor property](#sec-object-type) whose set accessor function is undefined. Its get accessor function performs the following steps when called:

1.  Let `O` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`O`, `[[ArrayBufferData]]`).
3.  If [IsSharedArrayBuffer](#sec-issharedarraybuffer)(`O`) is false, throw a TypeError exception.
4.  If [IsFixedLengthArrayBuffer](#sec-isfixedlengtharraybuffer)(`O`) is false, return true; otherwise return false.

#### 25.2.5.5 get SharedArrayBuffer.prototype.maxByteLength

`SharedArrayBuffer.prototype.maxByteLength` is an [accessor property](#sec-object-type) whose set accessor function is undefined. Its get accessor function performs the following steps when called:

1.  Let `O` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`O`, `[[ArrayBufferData]]`).
3.  If [IsSharedArrayBuffer](#sec-issharedarraybuffer)(`O`) is false, throw a TypeError exception.
4.  If [IsFixedLengthArrayBuffer](#sec-isfixedlengtharraybuffer)(`O`) is true, then
    1.  Let `length` be `O`.`[[ArrayBufferByteLength]]`.
5.  Else,
    1.  Let `length` be `O`.`[[ArrayBufferMaxByteLength]]`.
6.  Return [𝔽](#𝔽)(`length`).

#### 25.2.5.6 SharedArrayBuffer.prototype.slice ( `start`, `end` )

This method performs the following steps when called:

1.  Let `O` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`O`, `[[ArrayBufferData]]`).
3.  If [IsSharedArrayBuffer](#sec-issharedarraybuffer)(`O`) is false, throw a TypeError exception.
4.  Let `len` be [ArrayBufferByteLength](#sec-arraybufferbytelength)(`O`, seq-cst).
5.  Let `relativeStart` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`start`).
6.  If `relativeStart` = -∞, let `first` be 0.
7.  Else if `relativeStart` \< 0, let `first` be [max](#eqn-max)(`len` + `relativeStart`, 0).
8.  Else, let `first` be [min](#eqn-min)(`relativeStart`, `len`).
9.  If `end` is undefined, let `relativeEnd` be `len`; else let `relativeEnd` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`end`).
10. If `relativeEnd` = -∞, let `final` be 0.
11. Else if `relativeEnd` \< 0, let `final` be [max](#eqn-max)(`len` + `relativeEnd`, 0).
12. Else, let `final` be [min](#eqn-min)(`relativeEnd`, `len`).
13. Let `newLen` be [max](#eqn-max)(`final` - `first`, 0).
14. Let `ctor` be ? [SpeciesConstructor](#sec-speciesconstructor)(`O`, [%SharedArrayBuffer%](#sec-sharedarraybuffer-constructor)).
15. Let `new` be ? [Construct](#sec-construct)(`ctor`, « [𝔽](#𝔽)(`newLen`) »).
16. Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`new`, `[[ArrayBufferData]]`).
17. If [IsSharedArrayBuffer](#sec-issharedarraybuffer)(`new`) is false, throw a TypeError exception.
18. If `new`.`[[ArrayBufferData]]` is `O`.`[[ArrayBufferData]]`, throw a TypeError exception.
19. If [ArrayBufferByteLength](#sec-arraybufferbytelength)(`new`, seq-cst) \< `newLen`, throw a TypeError exception.
20. Let `fromBuf` be `O`.`[[ArrayBufferData]]`.
21. Let `toBuf` be `new`.`[[ArrayBufferData]]`.
22. Perform [CopyDataBlockBytes](#sec-copydatablockbytes)(`toBuf`, 0, `fromBuf`, `first`, `newLen`).
23. Return `new`.

#### 25.2.5.7 SharedArrayBuffer.prototype \[ %Symbol.toStringTag% \]

The initial value of the [%Symbol.toStringTag%](#sec-well-known-symbols) property is the String value "SharedArrayBuffer".

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: true }.

### 25.2.6 Properties of SharedArrayBuffer Instances

SharedArrayBuffer instances inherit properties from the [SharedArrayBuffer prototype object](#sec-properties-of-the-sharedarraybuffer-prototype-object). SharedArrayBuffer instances each have an `[[ArrayBufferData]]` internal slot. SharedArrayBuffer instances which are not growable each have an `[[ArrayBufferByteLength]]` internal slot. SharedArrayBuffer instances which are growable each have an `[[ArrayBufferByteLengthData]]` internal slot and an `[[ArrayBufferMaxByteLength]]` internal slot.

Note

SharedArrayBuffer instances, unlike ArrayBuffer instances, are never detached.

### 25.2.7 Growable SharedArrayBuffer Guidelines

Note 1

The following are guidelines for ECMAScript programmers working with [growable SharedArrayBuffer](#sec-fixed-length-and-growable-sharedarraybuffer-objects).

We recommend that programs be tested in their deployment environments where possible. The amount of available physical memory differ greatly between hardware devices. Similarly, virtual memory subsystems also differ greatly between hardware devices as well as operating systems. An application that runs without out-of-memory errors on a 64-bit desktop web browser could run out of memory on a 32-bit mobile web browser.

When choosing a value for the "maxByteLength" option for [growable SharedArrayBuffer](#sec-fixed-length-and-growable-sharedarraybuffer-objects), we recommend that the smallest possible size for the application be chosen. We recommend that "maxByteLength" does not exceed 1073741824, or 1GiB.

Please note that successfully constructing a [growable SharedArrayBuffer](#sec-fixed-length-and-growable-sharedarraybuffer-objects) for a particular maximum size does not guarantee that future grows will succeed.

Not all loads of a [growable SharedArrayBuffer](#sec-fixed-length-and-growable-sharedarraybuffer-objects)'s length are synchronizing seq-cst loads. Loads of the length that are for bounds-checking of an [integer-indexed](#integer-index) property access, e.g. `u8[idx]`, are not synchronizing. In general, in the absence of explicit synchronization, one property access being in-bound does not imply a subsequent property access in the same [agent](#agent) is also in-bound. In contrast, explicit loads of the length via the `length` and `byteLength` getters on SharedArrayBuffer, [%TypedArray%](#sec-%typedarray%-intrinsic-object).prototype, and DataView.prototype are synchronizing. Loads of the length that are performed by built-in methods to check if a [TypedArray](#typedarray) is entirely out-of-bounds are also synchronizing.

Note 2

The following are guidelines for ECMAScript implementers implementing [growable SharedArrayBuffer](#sec-fixed-length-and-growable-sharedarraybuffer-objects).

We recommend [growable SharedArrayBuffer](#sec-fixed-length-and-growable-sharedarraybuffer-objects) be implemented as in-place growth via reserving virtual memory up front.

Because grow operations can happen in parallel with memory accesses on a [growable SharedArrayBuffer](#sec-fixed-length-and-growable-sharedarraybuffer-objects), the constraints of the [memory model](#sec-memory-model) require that even unordered accesses do not "tear" (bits of their values will not be mixed). In practice, this means the underlying data block of a [growable SharedArrayBuffer](#sec-fixed-length-and-growable-sharedarraybuffer-objects) cannot be grown by being copied without stopping the world. We do not recommend stopping the world as an implementation strategy because it introduces a serialization point and is slow.

Grown memory must appear zeroed from the moment of its creation, including to any racy accesses in parallel. This can be accomplished via zero-filled-on-demand virtual memory pages, or careful synchronization if manually zeroing memory.

[Integer-indexed](#integer-index) property access on [TypedArray](#typedarray) views of growable SharedArrayBuffers is intended to be optimizable similarly to access on [TypedArray](#typedarray) views of non-growable SharedArrayBuffers, because [integer-indexed](#integer-index) property loads on are not synchronizing on the underlying buffer's length (see programmer guidelines above). For example, bounds checks for property accesses may still be hoisted out of loops.

In practice it is difficult to implement [growable SharedArrayBuffer](#sec-fixed-length-and-growable-sharedarraybuffer-objects) by copying on [hosts](#host) that do not have virtual memory, such as those running on embedded devices without an MMU. Memory usage behaviour of growable SharedArrayBuffers on such [hosts](#host) may significantly differ from that of [hosts](#host) with virtual memory. Such [hosts](#host) should clearly communicate memory usage expectations to users.

## 25.3 DataView Objects

### 25.3.1 Abstract Operations For DataView Objects

#### 25.3.1.1 DataView With Buffer Witness Records

A DataView With Buffer Witness Record is a [Record](#sec-list-and-record-specification-type) value used to encapsulate a DataView along with a cached byte length of the viewed buffer. It is used to help ensure there is a single shared memory read event of the byte length data block when the viewed buffer is a growable SharedArrayBuffers.

DataView With Buffer Witness Records have the fields listed in [Table 75](#table-dataview-with-buffer-witness-record-fields).

| Field Name | Value | Meaning |
|----|----|----|
| `[[Object]]` | a DataView | The DataView object whose buffer's byte length is loaded. |
| `[[CachedBufferByteLength]]` | a non-negative [integer](#integer) or detached | The byte length of the object's `[[ViewedArrayBuffer]]` when the [Record](#sec-list-and-record-specification-type) was created. |

Table 75: [DataView With Buffer Witness Record](#sec-dataview-with-buffer-witness-records) Fields

#### 25.3.1.2 MakeDataViewWithBufferWitnessRecord ( `obj`, `order` )

The abstract operation MakeDataViewWithBufferWitnessRecord takes arguments `obj` (a DataView) and `order` (seq-cst or unordered) and returns a [DataView With Buffer Witness Record](#sec-dataview-with-buffer-witness-records). It performs the following steps when called:

1.  Let `buffer` be `obj`.`[[ViewedArrayBuffer]]`.
2.  If [IsDetachedBuffer](#sec-isdetachedbuffer)(`buffer`) is true, then
    1.  Let `byteLength` be detached.
3.  Else,
    1.  Let `byteLength` be [ArrayBufferByteLength](#sec-arraybufferbytelength)(`buffer`, `order`).
4.  Return the [DataView With Buffer Witness Record](#sec-dataview-with-buffer-witness-records) { `[[Object]]`: `obj`, `[[CachedBufferByteLength]]`: `byteLength` }.

#### 25.3.1.3 GetViewByteLength ( `viewRecord` )

The abstract operation GetViewByteLength takes argument `viewRecord` (a [DataView With Buffer Witness Record](#sec-dataview-with-buffer-witness-records)) and returns a non-negative [integer](#integer). It performs the following steps when called:

1.  [Assert](#assert): [IsViewOutOfBounds](#sec-isviewoutofbounds)(`viewRecord`) is false.
2.  Let `view` be `viewRecord`.`[[Object]]`.
3.  If `view`.`[[ByteLength]]` is not auto, return `view`.`[[ByteLength]]`.
4.  [Assert](#assert): [IsFixedLengthArrayBuffer](#sec-isfixedlengtharraybuffer)(`view`.`[[ViewedArrayBuffer]]`) is false.
5.  Let `byteOffset` be `view`.`[[ByteOffset]]`.
6.  Let `byteLength` be `viewRecord`.`[[CachedBufferByteLength]]`.
7.  [Assert](#assert): `byteLength` is not detached.
8.  Return `byteLength` - `byteOffset`.

#### 25.3.1.4 IsViewOutOfBounds ( `viewRecord` )

The abstract operation IsViewOutOfBounds takes argument `viewRecord` (a [DataView With Buffer Witness Record](#sec-dataview-with-buffer-witness-records)) and returns a Boolean. It performs the following steps when called:

1.  Let `view` be `viewRecord`.`[[Object]]`.
2.  Let `bufferByteLength` be `viewRecord`.`[[CachedBufferByteLength]]`.
3.  [Assert](#assert): [IsDetachedBuffer](#sec-isdetachedbuffer)(`view`.`[[ViewedArrayBuffer]]`) is true if and only if `bufferByteLength` is detached.
4.  If `bufferByteLength` is detached, return true.
5.  Let `byteOffsetStart` be `view`.`[[ByteOffset]]`.
6.  If `view`.`[[ByteLength]]` is auto, then
    1.  Let `byteOffsetEnd` be `bufferByteLength`.
7.  Else,
    1.  Let `byteOffsetEnd` be `byteOffsetStart` + `view`.`[[ByteLength]]`.
8.  If `byteOffsetStart` \> `bufferByteLength` or `byteOffsetEnd` \> `bufferByteLength`, return true.
9.  NOTE: 0-length DataViews are not considered out-of-bounds.
10. Return false.

#### 25.3.1.5 GetViewValue ( `view`, `requestIndex`, `isLittleEndian`, `type` )

The abstract operation GetViewValue takes arguments `view` (an [ECMAScript language value](#sec-ecmascript-language-types)), `requestIndex` (an [ECMAScript language value](#sec-ecmascript-language-types)), `isLittleEndian` (an [ECMAScript language value](#sec-ecmascript-language-types)), and `type` (a [TypedArray element type](#sec-typedarray-objects)) and returns either a [normal completion containing](#sec-completion-record-specification-type) either a Number or a BigInt, or a [throw completion](#sec-completion-record-specification-type). It is used by functions on DataView instances to retrieve values from the view's buffer. It performs the following steps when called:

1.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`view`, `[[DataView]]`).
2.  [Assert](#assert): `view` has a `[[ViewedArrayBuffer]]` internal slot.
3.  Let `getIndex` be ? [ToIndex](#sec-toindex)(`requestIndex`).
4.  Set `isLittleEndian` to [ToBoolean](#sec-toboolean)(`isLittleEndian`).
5.  Let `viewOffset` be `view`.`[[ByteOffset]]`.
6.  Let `viewRecord` be [MakeDataViewWithBufferWitnessRecord](#sec-makedataviewwithbufferwitnessrecord)(`view`, unordered).
7.  NOTE: Bounds checking is not a synchronizing operation when `view`'s backing buffer is a [growable SharedArrayBuffer](#sec-fixed-length-and-growable-sharedarraybuffer-objects).
8.  If [IsViewOutOfBounds](#sec-isviewoutofbounds)(`viewRecord`) is true, throw a TypeError exception.
9.  Let `viewSize` be [GetViewByteLength](#sec-getviewbytelength)(`viewRecord`).
10. Let `elementSize` be the Element Size value specified in [Table 73](#table-the-typedarray-constructors) for Element Type `type`.
11. If `getIndex` + `elementSize` \> `viewSize`, throw a RangeError exception.
12. Let `bufferIndex` be `getIndex` + `viewOffset`.
13. Return [GetValueFromBuffer](#sec-getvaluefrombuffer)(`view`.`[[ViewedArrayBuffer]]`, `bufferIndex`, `type`, false, unordered, `isLittleEndian`).

#### 25.3.1.6 SetViewValue ( `view`, `requestIndex`, `isLittleEndian`, `type`, `value` )

The abstract operation SetViewValue takes arguments `view` (an [ECMAScript language value](#sec-ecmascript-language-types)), `requestIndex` (an [ECMAScript language value](#sec-ecmascript-language-types)), `isLittleEndian` (an [ECMAScript language value](#sec-ecmascript-language-types)), `type` (a [TypedArray element type](#sec-typedarray-objects)), and `value` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) undefined or a [throw completion](#sec-completion-record-specification-type). It is used by functions on DataView instances to store values into the view's buffer. It performs the following steps when called:

1.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`view`, `[[DataView]]`).
2.  [Assert](#assert): `view` has a `[[ViewedArrayBuffer]]` internal slot.
3.  Let `getIndex` be ? [ToIndex](#sec-toindex)(`requestIndex`).
4.  If [IsBigIntElementType](#sec-isbigintelementtype)(`type`) is true, let `numberValue` be ? [ToBigInt](#sec-tobigint)(`value`).
5.  Otherwise, let `numberValue` be ? [ToNumber](#sec-tonumber)(`value`).
6.  Set `isLittleEndian` to [ToBoolean](#sec-toboolean)(`isLittleEndian`).
7.  Let `viewOffset` be `view`.`[[ByteOffset]]`.
8.  Let `viewRecord` be [MakeDataViewWithBufferWitnessRecord](#sec-makedataviewwithbufferwitnessrecord)(`view`, unordered).
9.  NOTE: Bounds checking is not a synchronizing operation when `view`'s backing buffer is a [growable SharedArrayBuffer](#sec-fixed-length-and-growable-sharedarraybuffer-objects).
10. If [IsViewOutOfBounds](#sec-isviewoutofbounds)(`viewRecord`) is true, throw a TypeError exception.
11. Let `viewSize` be [GetViewByteLength](#sec-getviewbytelength)(`viewRecord`).
12. Let `elementSize` be the Element Size value specified in [Table 73](#table-the-typedarray-constructors) for Element Type `type`.
13. If `getIndex` + `elementSize` \> `viewSize`, throw a RangeError exception.
14. Let `bufferIndex` be `getIndex` + `viewOffset`.
15. Perform [SetValueInBuffer](#sec-setvalueinbuffer)(`view`.`[[ViewedArrayBuffer]]`, `bufferIndex`, `type`, `numberValue`, false, unordered, `isLittleEndian`).
16. Return undefined.

### 25.3.2 The DataView Constructor

The DataView [constructor](#constructor):

- is %DataView%.
- is the initial value of the "DataView" property of the [global object](#sec-global-object).
- creates and initializes a new DataView when called as a [constructor](#constructor).
- is not intended to be called as a function and will throw an exception when called in that manner.
- may be used as the value of an `extends` clause of a class definition. Subclass [constructors](#constructor) that intend to inherit the specified DataView behaviour must include a `super` call to the DataView [constructor](#constructor) to create and initialize subclass instances with the internal state necessary to support the `DataView.prototype` built-in methods.

#### 25.3.2.1 DataView ( `buffer` \[ , `byteOffset` \[ , `byteLength` \] \] )

This function performs the following steps when called:

1.  If NewTarget is undefined, throw a TypeError exception.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`buffer`, `[[ArrayBufferData]]`).
3.  Let `offset` be ? [ToIndex](#sec-toindex)(`byteOffset`).
4.  If [IsDetachedBuffer](#sec-isdetachedbuffer)(`buffer`) is true, throw a TypeError exception.
5.  Let `bufferByteLength` be [ArrayBufferByteLength](#sec-arraybufferbytelength)(`buffer`, seq-cst).
6.  If `offset` \> `bufferByteLength`, throw a RangeError exception.
7.  Let `bufferIsFixedLength` be [IsFixedLengthArrayBuffer](#sec-isfixedlengtharraybuffer)(`buffer`).
8.  If `byteLength` is undefined, then
    1.  If `bufferIsFixedLength` is true, then
        1.  Let `viewByteLength` be `bufferByteLength` - `offset`.
    2.  Else,
        1.  Let `viewByteLength` be auto.
9.  Else,
    1.  Let `viewByteLength` be ? [ToIndex](#sec-toindex)(`byteLength`).
    2.  If `offset` + `viewByteLength` \> `bufferByteLength`, throw a RangeError exception.
10. Let `O` be ? [OrdinaryCreateFromConstructor](#sec-ordinarycreatefromconstructor)(NewTarget, "%DataView.prototype%", « `[[DataView]]`, `[[ViewedArrayBuffer]]`, `[[ByteLength]]`, `[[ByteOffset]]` »).
11. If [IsDetachedBuffer](#sec-isdetachedbuffer)(`buffer`) is true, throw a TypeError exception.
12. Set `bufferByteLength` to [ArrayBufferByteLength](#sec-arraybufferbytelength)(`buffer`, seq-cst).
13. If `offset` \> `bufferByteLength`, throw a RangeError exception.
14. If `byteLength` is not undefined, then
    1.  If `offset` + `viewByteLength` \> `bufferByteLength`, throw a RangeError exception.
15. Set `O`.`[[ViewedArrayBuffer]]` to `buffer`.
16. Set `O`.`[[ByteLength]]` to `viewByteLength`.
17. Set `O`.`[[ByteOffset]]` to `offset`.
18. Return `O`.

### 25.3.3 Properties of the DataView Constructor

The DataView [constructor](#constructor):

- has a `[[Prototype]]` internal slot whose value is [%Function.prototype%](#sec-properties-of-the-function-prototype-object).
- has the following properties:

#### 25.3.3.1 DataView.prototype

The initial value of `DataView.prototype` is the [DataView prototype object](#sec-properties-of-the-dataview-prototype-object).

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

### 25.3.4 Properties of the DataView Prototype Object

The DataView prototype object:

- is %DataView.prototype%.
- has a `[[Prototype]]` internal slot whose value is [%Object.prototype%](#sec-properties-of-the-object-prototype-object).
- is an [ordinary object](#ordinary-object).
- does not have a `[[DataView]]`, `[[ViewedArrayBuffer]]`, `[[ByteLength]]`, or `[[ByteOffset]]` internal slot.

#### 25.3.4.1 get DataView.prototype.buffer

`DataView.prototype.buffer` is an [accessor property](#sec-object-type) whose set accessor function is undefined. Its get accessor function performs the following steps when called:

1.  Let `O` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`O`, `[[DataView]]`).
3.  [Assert](#assert): `O` has a `[[ViewedArrayBuffer]]` internal slot.
4.  Let `buffer` be `O`.`[[ViewedArrayBuffer]]`.
5.  Return `buffer`.

#### 25.3.4.2 get DataView.prototype.byteLength

`DataView.prototype.byteLength` is an [accessor property](#sec-object-type) whose set accessor function is undefined. Its get accessor function performs the following steps when called:

1.  Let `O` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`O`, `[[DataView]]`).
3.  [Assert](#assert): `O` has a `[[ViewedArrayBuffer]]` internal slot.
4.  Let `viewRecord` be [MakeDataViewWithBufferWitnessRecord](#sec-makedataviewwithbufferwitnessrecord)(`O`, seq-cst).
5.  If [IsViewOutOfBounds](#sec-isviewoutofbounds)(`viewRecord`) is true, throw a TypeError exception.
6.  Let `size` be [GetViewByteLength](#sec-getviewbytelength)(`viewRecord`).
7.  Return [𝔽](#𝔽)(`size`).

#### 25.3.4.3 get DataView.prototype.byteOffset

`DataView.prototype.byteOffset` is an [accessor property](#sec-object-type) whose set accessor function is undefined. Its get accessor function performs the following steps when called:

1.  Let `O` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`O`, `[[DataView]]`).
3.  [Assert](#assert): `O` has a `[[ViewedArrayBuffer]]` internal slot.
4.  Let `viewRecord` be [MakeDataViewWithBufferWitnessRecord](#sec-makedataviewwithbufferwitnessrecord)(`O`, seq-cst).
5.  If [IsViewOutOfBounds](#sec-isviewoutofbounds)(`viewRecord`) is true, throw a TypeError exception.
6.  Let `offset` be `O`.`[[ByteOffset]]`.
7.  Return [𝔽](#𝔽)(`offset`).

#### 25.3.4.4 DataView.prototype.constructor

The initial value of `DataView.prototype.constructor` is [%DataView%](#sec-dataview-constructor).

#### 25.3.4.5 DataView.prototype.getBigInt64 ( `byteOffset` \[ , `littleEndian` \] )

This method performs the following steps when called:

1.  Let `view` be the this value.
2.  Return ? [GetViewValue](#sec-getviewvalue)(`view`, `byteOffset`, `littleEndian`, bigint64).

#### 25.3.4.6 DataView.prototype.getBigUint64 ( `byteOffset` \[ , `littleEndian` \] )

This method performs the following steps when called:

1.  Let `view` be the this value.
2.  Return ? [GetViewValue](#sec-getviewvalue)(`view`, `byteOffset`, `littleEndian`, biguint64).

#### 25.3.4.7 DataView.prototype.getFloat16 ( `byteOffset` \[ , `littleEndian` \] )

This method performs the following steps when called:

1.  Let `view` be the this value.
2.  If `littleEndian` is not present, set `littleEndian` to false.
3.  Return ? [GetViewValue](#sec-getviewvalue)(`view`, `byteOffset`, `littleEndian`, float16).

#### 25.3.4.8 DataView.prototype.getFloat32 ( `byteOffset` \[ , `littleEndian` \] )

This method performs the following steps when called:

1.  Let `view` be the this value.
2.  If `littleEndian` is not present, set `littleEndian` to false.
3.  Return ? [GetViewValue](#sec-getviewvalue)(`view`, `byteOffset`, `littleEndian`, float32).

#### 25.3.4.9 DataView.prototype.getFloat64 ( `byteOffset` \[ , `littleEndian` \] )

This method performs the following steps when called:

1.  Let `view` be the this value.
2.  If `littleEndian` is not present, set `littleEndian` to false.
3.  Return ? [GetViewValue](#sec-getviewvalue)(`view`, `byteOffset`, `littleEndian`, float64).

#### 25.3.4.10 DataView.prototype.getInt8 ( `byteOffset` )

This method performs the following steps when called:

1.  Let `view` be the this value.
2.  Return ? [GetViewValue](#sec-getviewvalue)(`view`, `byteOffset`, true, int8).

#### 25.3.4.11 DataView.prototype.getInt16 ( `byteOffset` \[ , `littleEndian` \] )

This method performs the following steps when called:

1.  Let `view` be the this value.
2.  If `littleEndian` is not present, set `littleEndian` to false.
3.  Return ? [GetViewValue](#sec-getviewvalue)(`view`, `byteOffset`, `littleEndian`, int16).

#### 25.3.4.12 DataView.prototype.getInt32 ( `byteOffset` \[ , `littleEndian` \] )

This method performs the following steps when called:

1.  Let `view` be the this value.
2.  If `littleEndian` is not present, set `littleEndian` to false.
3.  Return ? [GetViewValue](#sec-getviewvalue)(`view`, `byteOffset`, `littleEndian`, int32).

#### 25.3.4.13 DataView.prototype.getUint8 ( `byteOffset` )

This method performs the following steps when called:

1.  Let `view` be the this value.
2.  Return ? [GetViewValue](#sec-getviewvalue)(`view`, `byteOffset`, true, uint8).

#### 25.3.4.14 DataView.prototype.getUint16 ( `byteOffset` \[ , `littleEndian` \] )

This method performs the following steps when called:

1.  Let `view` be the this value.
2.  If `littleEndian` is not present, set `littleEndian` to false.
3.  Return ? [GetViewValue](#sec-getviewvalue)(`view`, `byteOffset`, `littleEndian`, uint16).

#### 25.3.4.15 DataView.prototype.getUint32 ( `byteOffset` \[ , `littleEndian` \] )

This method performs the following steps when called:

1.  Let `view` be the this value.
2.  If `littleEndian` is not present, set `littleEndian` to false.
3.  Return ? [GetViewValue](#sec-getviewvalue)(`view`, `byteOffset`, `littleEndian`, uint32).

#### 25.3.4.16 DataView.prototype.setBigInt64 ( `byteOffset`, `value` \[ , `littleEndian` \] )

This method performs the following steps when called:

1.  Let `view` be the this value.
2.  Return ? [SetViewValue](#sec-setviewvalue)(`view`, `byteOffset`, `littleEndian`, bigint64, `value`).

#### 25.3.4.17 DataView.prototype.setBigUint64 ( `byteOffset`, `value` \[ , `littleEndian` \] )

This method performs the following steps when called:

1.  Let `view` be the this value.
2.  Return ? [SetViewValue](#sec-setviewvalue)(`view`, `byteOffset`, `littleEndian`, biguint64, `value`).

#### 25.3.4.18 DataView.prototype.setFloat16 ( `byteOffset`, `value` \[ , `littleEndian` \] )

This method performs the following steps when called:

1.  Let `view` be the this value.
2.  If `littleEndian` is not present, set `littleEndian` to false.
3.  Return ? [SetViewValue](#sec-setviewvalue)(`view`, `byteOffset`, `littleEndian`, float16, `value`).

#### 25.3.4.19 DataView.prototype.setFloat32 ( `byteOffset`, `value` \[ , `littleEndian` \] )

This method performs the following steps when called:

1.  Let `view` be the this value.
2.  If `littleEndian` is not present, set `littleEndian` to false.
3.  Return ? [SetViewValue](#sec-setviewvalue)(`view`, `byteOffset`, `littleEndian`, float32, `value`).

#### 25.3.4.20 DataView.prototype.setFloat64 ( `byteOffset`, `value` \[ , `littleEndian` \] )

This method performs the following steps when called:

1.  Let `view` be the this value.
2.  If `littleEndian` is not present, set `littleEndian` to false.
3.  Return ? [SetViewValue](#sec-setviewvalue)(`view`, `byteOffset`, `littleEndian`, float64, `value`).

#### 25.3.4.21 DataView.prototype.setInt8 ( `byteOffset`, `value` )

This method performs the following steps when called:

1.  Let `view` be the this value.
2.  Return ? [SetViewValue](#sec-setviewvalue)(`view`, `byteOffset`, true, int8, `value`).

#### 25.3.4.22 DataView.prototype.setInt16 ( `byteOffset`, `value` \[ , `littleEndian` \] )

This method performs the following steps when called:

1.  Let `view` be the this value.
2.  If `littleEndian` is not present, set `littleEndian` to false.
3.  Return ? [SetViewValue](#sec-setviewvalue)(`view`, `byteOffset`, `littleEndian`, int16, `value`).

#### 25.3.4.23 DataView.prototype.setInt32 ( `byteOffset`, `value` \[ , `littleEndian` \] )

This method performs the following steps when called:

1.  Let `view` be the this value.
2.  If `littleEndian` is not present, set `littleEndian` to false.
3.  Return ? [SetViewValue](#sec-setviewvalue)(`view`, `byteOffset`, `littleEndian`, int32, `value`).

#### 25.3.4.24 DataView.prototype.setUint8 ( `byteOffset`, `value` )

This method performs the following steps when called:

1.  Let `view` be the this value.
2.  Return ? [SetViewValue](#sec-setviewvalue)(`view`, `byteOffset`, true, uint8, `value`).

#### 25.3.4.25 DataView.prototype.setUint16 ( `byteOffset`, `value` \[ , `littleEndian` \] )

This method performs the following steps when called:

1.  Let `view` be the this value.
2.  If `littleEndian` is not present, set `littleEndian` to false.
3.  Return ? [SetViewValue](#sec-setviewvalue)(`view`, `byteOffset`, `littleEndian`, uint16, `value`).

#### 25.3.4.26 DataView.prototype.setUint32 ( `byteOffset`, `value` \[ , `littleEndian` \] )

This method performs the following steps when called:

1.  Let `view` be the this value.
2.  If `littleEndian` is not present, set `littleEndian` to false.
3.  Return ? [SetViewValue](#sec-setviewvalue)(`view`, `byteOffset`, `littleEndian`, uint32, `value`).

#### 25.3.4.27 DataView.prototype \[ %Symbol.toStringTag% \]

The initial value of the [%Symbol.toStringTag%](#sec-well-known-symbols) property is the String value "DataView".

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: true }.

### 25.3.5 Properties of DataView Instances

DataView instances are [ordinary objects](#ordinary-object) that inherit properties from the [DataView prototype object](#sec-properties-of-the-dataview-prototype-object). DataView instances each have `[[DataView]]`, `[[ViewedArrayBuffer]]`, `[[ByteLength]]`, and `[[ByteOffset]]` internal slots.

Note

The value of the `[[DataView]]` internal slot is not used within this specification. The simple presence of that internal slot is used within the specification to identify objects created using the DataView [constructor](#constructor).

## 25.4 The Atomics Object

The Atomics object:

- is %Atomics%.
- is the initial value of the "Atomics" property of the [global object](#sec-global-object).
- is an [ordinary object](#ordinary-object).
- has a `[[Prototype]]` internal slot whose value is [%Object.prototype%](#sec-properties-of-the-object-prototype-object).
- does not have a `[[Construct]]` internal method; it cannot be used as a [constructor](#constructor) with the `new` operator.
- does not have a `[[Call]]` internal method; it cannot be invoked as a function.

The Atomics object provides functions that operate indivisibly (atomically) on shared memory array cells as well as functions that let [agents](#agent) wait for and dispatch primitive events. When used with discipline, the Atomics functions allow multi-[agent](#agent) programs that communicate through shared memory to execute in a well-understood order even on parallel CPUs. The rules that govern shared-memory communication are provided by the [memory model](#sec-memory-model), defined below.

Note

For informative guidelines for programming and implementing shared memory in ECMAScript, please see the notes at the end of the [memory model](#sec-memory-model) section.

### 25.4.1 Waiter Record

A Waiter Record is a [Record](#sec-list-and-record-specification-type) value used to denote a particular call to `Atomics.wait` or `Atomics.waitAsync`.

A Waiter Record has fields listed in [Table 76](#table-waiterrecord).

| Field Name | Value | Meaning |
|----|----|----|
| `[[AgentSignifier]]` | an [agent signifier](#sec-agents) | The [agent](#agent) that called `Atomics.wait` or `Atomics.waitAsync`. |
| `[[PromiseCapability]]` | a [PromiseCapability Record](#sec-promisecapability-records) or blocking | If denoting a call to `Atomics.waitAsync`, the resulting promise, otherwise blocking. |
| `[[TimeoutTime]]` | a non-negative [extended mathematical value](#extended-mathematical-value) | The earliest time by which timeout may be triggered; computed using [time values](#sec-time-values-and-time-range). |
| `[[Result]]` | "ok" or "timed-out" | The return value of the call. |

Table 76: [Waiter Record](#sec-waiter-record) Fields

### 25.4.2 WaiterList Records

A WaiterList Record is used to explain waiting and notification of [agents](#agent) via `Atomics.wait`, `Atomics.waitAsync`, and `Atomics.notify`.

A WaiterList Record has fields listed in [Table 77](#table-waiterlistrecord).

| Field Name | Value | Meaning |
|----|----|----|
| `[[Waiters]]` | a [List](#sec-list-and-record-specification-type) of [Waiter Records](#sec-waiter-record) | The calls to `Atomics.wait` or `Atomics.waitAsync` that are waiting on the location with which this WaiterList is associated. |
| `[[MostRecentLeaveEvent]]` | a [Synchronize event](#sec-memory-model-fundamentals) or empty | The event of the most recent leaving of its [critical section](#sec-waiterlist-records), or empty if its [critical section](#sec-waiterlist-records) has never been entered. |

Table 77: [WaiterList Record](#sec-waiterlist-records) Fields

There can be multiple [Waiter Records](#sec-waiter-record) in a WaiterList with the same [agent signifier](#sec-agents).

The [agent cluster](#sec-agent-clusters) has a store of WaiterList Records; the store is indexed by (`block`, `i`), where `block` is a [Shared Data Block](#sec-data-blocks) and `i` a byte offset into the memory of `block`. WaiterList Records are [agent](#agent)-independent: a lookup in the store of WaiterList Records by (`block`, `i`) will result in the same WaiterList Record in any [agent](#agent) in the [agent cluster](#sec-agent-clusters).

Each WaiterList Record has a critical section that controls exclusive access to that WaiterList Record during evaluation. Only a single [agent](#agent) may enter a WaiterList Record's critical section at one time. Entering and leaving a WaiterList Record's critical section is controlled by the [abstract operations](#sec-algorithm-conventions-abstract-operations) [EnterCriticalSection](#sec-entercriticalsection) and [LeaveCriticalSection](#sec-leavecriticalsection). Operations on a WaiterList Record—adding and removing waiting [agents](#agent), traversing the list of [agents](#agent), suspending and notifying [agents](#agent) on the list, setting and retrieving the [Synchronize event](#sec-memory-model-fundamentals)—may only be performed by [agents](#agent) that have entered the WaiterList Record's critical section.

### 25.4.3 Abstract Operations for Atomics

#### 25.4.3.1 ValidateIntegerTypedArray ( `typedArray`, `waitable` )

The abstract operation ValidateIntegerTypedArray takes arguments `typedArray` (an [ECMAScript language value](#sec-ecmascript-language-types)) and `waitable` (a Boolean) and returns either a [normal completion containing](#sec-completion-record-specification-type) a [TypedArray With Buffer Witness Record](#sec-typedarray-with-buffer-witness-records), or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `taRecord` be ? [ValidateTypedArray](#sec-validatetypedarray)(`typedArray`, unordered).
2.  NOTE: Bounds checking is not a synchronizing operation when `typedArray`'s backing buffer is a [growable SharedArrayBuffer](#sec-fixed-length-and-growable-sharedarraybuffer-objects).
3.  If `waitable` is true, then
    1.  If `typedArray`.`[[TypedArrayName]]` is neither "Int32Array" nor "BigInt64Array", throw a TypeError exception.
4.  Else,
    1.  Let `type` be [TypedArrayElementType](#sec-typedarrayelementtype)(`typedArray`).
    2.  If [IsUnclampedIntegerElementType](#sec-isunclampedintegerelementtype)(`type`) is false and [IsBigIntElementType](#sec-isbigintelementtype)(`type`) is false, throw a TypeError exception.
5.  Return `taRecord`.

#### 25.4.3.2 ValidateAtomicAccess ( `taRecord`, `requestIndex` )

The abstract operation ValidateAtomicAccess takes arguments `taRecord` (a [TypedArray With Buffer Witness Record](#sec-typedarray-with-buffer-witness-records)) and `requestIndex` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [integer](#integer) or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `length` be [TypedArrayLength](#sec-typedarraylength)(`taRecord`).
2.  Let `accessIndex` be ? [ToIndex](#sec-toindex)(`requestIndex`).
3.  [Assert](#assert): `accessIndex` ≥ 0.
4.  If `accessIndex` ≥ `length`, throw a RangeError exception.
5.  Let `typedArray` be `taRecord`.`[[Object]]`.
6.  Let `elementSize` be [TypedArrayElementSize](#sec-typedarrayelementsize)(`typedArray`).
7.  Let `offset` be `typedArray`.`[[ByteOffset]]`.
8.  Return (`accessIndex` × `elementSize`) + `offset`.

#### 25.4.3.3 ValidateAtomicAccessOnIntegerTypedArray ( `typedArray`, `requestIndex` \[ , `waitable` \] )

The abstract operation ValidateAtomicAccessOnIntegerTypedArray takes arguments `typedArray` (an [ECMAScript language value](#sec-ecmascript-language-types)) and `requestIndex` (an [ECMAScript language value](#sec-ecmascript-language-types)) and optional argument `waitable` (a Boolean) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [integer](#integer) or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  If `waitable` is not present, set `waitable` to false.
2.  Let `taRecord` be ? [ValidateIntegerTypedArray](#sec-validateintegertypedarray)(`typedArray`, `waitable`).
3.  Return ? [ValidateAtomicAccess](#sec-validateatomicaccess)(`taRecord`, `requestIndex`).

#### 25.4.3.4 RevalidateAtomicAccess ( `typedArray`, `byteIndexInBuffer` )

The abstract operation RevalidateAtomicAccess takes arguments `typedArray` (a [TypedArray](#typedarray)) and `byteIndexInBuffer` (an [integer](#integer)) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or a [throw completion](#sec-completion-record-specification-type). This operation revalidates the index within the backing buffer for atomic operations after all argument coercions are performed in Atomics methods, as argument coercions can have arbitrary side effects, which could cause the buffer to become out of bounds. This operation does not throw when `typedArray`'s backing buffer is a SharedArrayBuffer. It performs the following steps when called:

1.  Let `taRecord` be [MakeTypedArrayWithBufferWitnessRecord](#sec-maketypedarraywithbufferwitnessrecord)(`typedArray`, unordered).
2.  NOTE: Bounds checking is not a synchronizing operation when `typedArray`'s backing buffer is a [growable SharedArrayBuffer](#sec-fixed-length-and-growable-sharedarraybuffer-objects).
3.  If [IsTypedArrayOutOfBounds](#sec-istypedarrayoutofbounds)(`taRecord`) is true, throw a TypeError exception.
4.  [Assert](#assert): `byteIndexInBuffer` ≥ `typedArray`.`[[ByteOffset]]`.
5.  If `byteIndexInBuffer` ≥ `taRecord`.`[[CachedBufferByteLength]]`, throw a RangeError exception.
6.  Return unused.

#### 25.4.3.5 GetWaiterList ( `block`, `i` )

The abstract operation GetWaiterList takes arguments `block` (a [Shared Data Block](#sec-data-blocks)) and `i` (a non-negative [integer](#integer) that is evenly divisible by 4) and returns a [WaiterList Record](#sec-waiterlist-records). It performs the following steps when called:

1.  [Assert](#assert): `i` and `i` + 3 are valid byte offsets within the memory of `block`.
2.  Return the [WaiterList Record](#sec-waiterlist-records) that is referenced by the pair (`block`, `i`).

#### 25.4.3.6 EnterCriticalSection ( `WL` )

The abstract operation EnterCriticalSection takes argument `WL` (a [WaiterList Record](#sec-waiterlist-records)) and returns unused. It performs the following steps when called:

1.  [Assert](#assert): The [surrounding agent](#surrounding-agent) is not in the [critical section](#sec-waiterlist-records) for any [WaiterList Record](#sec-waiterlist-records).
2.  Wait until no [agent](#agent) is in the [critical section](#sec-waiterlist-records) for `WL`, then enter the [critical section](#sec-waiterlist-records) for `WL` (without allowing any other [agent](#agent) to enter).
3.  If `WL`.`[[MostRecentLeaveEvent]]` is not empty, then
    1.  NOTE: A `WL` whose [critical section](#sec-waiterlist-records) has been entered at least once has a [Synchronize event](#sec-memory-model-fundamentals) set by [LeaveCriticalSection](#sec-leavecriticalsection).
    2.  Let `execution` be the `[[CandidateExecution]]` field of the [surrounding agent](#surrounding-agent)'s [Agent Record](#agent-record).
    3.  Let `eventsRecord` be the [Agent Events Record](#sec-agent-event-records) of `execution`.`[[EventsRecords]]` whose `[[AgentSignifier]]` is [AgentSignifier](#sec-agentsignifier)().
    4.  Let `enterEvent` be a new [Synchronize event](#sec-memory-model-fundamentals).
    5.  Append `enterEvent` to `eventsRecord`.`[[EventList]]`.
    6.  Append (`WL`.`[[MostRecentLeaveEvent]]`, `enterEvent`) to `eventsRecord`.`[[AgentSynchronizesWith]]`.
4.  Return unused.

EnterCriticalSection has contention when an [agent](#agent) attempting to enter the [critical section](#sec-waiterlist-records) must wait for another [agent](#agent) to leave it. When there is no contention, FIFO order of EnterCriticalSection calls is observable. When there is contention, an implementation may choose an arbitrary order but may not cause an [agent](#agent) to wait indefinitely.

#### 25.4.3.7 LeaveCriticalSection ( `WL` )

The abstract operation LeaveCriticalSection takes argument `WL` (a [WaiterList Record](#sec-waiterlist-records)) and returns unused. It performs the following steps when called:

1.  [Assert](#assert): The [surrounding agent](#surrounding-agent) is in the [critical section](#sec-waiterlist-records) for `WL`.
2.  Let `execution` be the `[[CandidateExecution]]` field of the [surrounding agent](#surrounding-agent)'s [Agent Record](#agent-record).
3.  Let `eventsRecord` be the [Agent Events Record](#sec-agent-event-records) of `execution`.`[[EventsRecords]]` whose `[[AgentSignifier]]` is [AgentSignifier](#sec-agentsignifier)().
4.  Let `leaveEvent` be a new [Synchronize event](#sec-memory-model-fundamentals).
5.  Append `leaveEvent` to `eventsRecord`.`[[EventList]]`.
6.  Set `WL`.`[[MostRecentLeaveEvent]]` to `leaveEvent`.
7.  Leave the [critical section](#sec-waiterlist-records) for `WL`.
8.  Return unused.

#### 25.4.3.8 AddWaiter ( `WL`, `waiterRecord` )

The abstract operation AddWaiter takes arguments `WL` (a [WaiterList Record](#sec-waiterlist-records)) and `waiterRecord` (a [Waiter Record](#sec-waiter-record)) and returns unused. It performs the following steps when called:

1.  [Assert](#assert): The [surrounding agent](#surrounding-agent) is in the [critical section](#sec-waiterlist-records) for `WL`.
2.  [Assert](#assert): There is no [Waiter Record](#sec-waiter-record) in `WL`.`[[Waiters]]` whose `[[PromiseCapability]]` field is `waiterRecord`.`[[PromiseCapability]]` and whose `[[AgentSignifier]]` field is `waiterRecord`.`[[AgentSignifier]]`.
3.  Append `waiterRecord` to `WL`.`[[Waiters]]`.
4.  Return unused.

#### 25.4.3.9 RemoveWaiter ( `WL`, `waiterRecord` )

The abstract operation RemoveWaiter takes arguments `WL` (a [WaiterList Record](#sec-waiterlist-records)) and `waiterRecord` (a [Waiter Record](#sec-waiter-record)) and returns unused. It performs the following steps when called:

1.  [Assert](#assert): The [surrounding agent](#surrounding-agent) is in the [critical section](#sec-waiterlist-records) for `WL`.
2.  [Assert](#assert): `WL`.`[[Waiters]]` contains `waiterRecord`.
3.  Remove `waiterRecord` from `WL`.`[[Waiters]]`.
4.  Return unused.

#### 25.4.3.10 RemoveWaiters ( `WL`, `c` )

The abstract operation RemoveWaiters takes arguments `WL` (a [WaiterList Record](#sec-waiterlist-records)) and `c` (a non-negative [integer](#integer) or +∞) and returns a [List](#sec-list-and-record-specification-type) of [Waiter Records](#sec-waiter-record). It performs the following steps when called:

1.  [Assert](#assert): The [surrounding agent](#surrounding-agent) is in the [critical section](#sec-waiterlist-records) for `WL`.
2.  Let `len` be the number of elements in `WL`.`[[Waiters]]`.
3.  Let `n` be [min](#eqn-min)(`c`, `len`).
4.  Let `L` be a [List](#sec-list-and-record-specification-type) whose elements are the first `n` elements of `WL`.`[[Waiters]]`.
5.  Remove the first `n` elements of `WL`.`[[Waiters]]`.
6.  Return `L`.

#### 25.4.3.11 SuspendThisAgent ( `WL`, `waiterRecord` )

The abstract operation SuspendThisAgent takes arguments `WL` (a [WaiterList Record](#sec-waiterlist-records)) and `waiterRecord` (a [Waiter Record](#sec-waiter-record)) and returns unused. It performs the following steps when called:

1.  [Assert](#assert): The [surrounding agent](#surrounding-agent) is in the [critical section](#sec-waiterlist-records) for `WL`.
2.  [Assert](#assert): `WL`.`[[Waiters]]` contains `waiterRecord`.
3.  Let `thisAgent` be [AgentSignifier](#sec-agentsignifier)().
4.  [Assert](#assert): `waiterRecord`.`[[AgentSignifier]]` is `thisAgent`.
5.  [Assert](#assert): `waiterRecord`.`[[PromiseCapability]]` is blocking.
6.  [Assert](#assert): [AgentCanSuspend](#sec-agentcansuspend)() is true.
7.  Perform [LeaveCriticalSection](#sec-leavecriticalsection)(`WL`) and suspend the [surrounding agent](#surrounding-agent) until the time is `waiterRecord`.`[[TimeoutTime]]`, performing the combined operation in such a way that a notification that arrives after the [critical section](#sec-waiterlist-records) is exited but before the suspension takes effect is not lost. The [surrounding agent](#surrounding-agent) can only wake from suspension due to a timeout or due to another [agent](#agent) calling [NotifyWaiter](#sec-notifywaiter) with arguments `WL` and `thisAgent` (i.e. via a call to `Atomics.notify`).
8.  Perform [EnterCriticalSection](#sec-entercriticalsection)(`WL`).
9.  Return unused.

#### 25.4.3.12 NotifyWaiter ( `WL`, `waiterRecord` )

The abstract operation NotifyWaiter takes arguments `WL` (a [WaiterList Record](#sec-waiterlist-records)) and `waiterRecord` (a [Waiter Record](#sec-waiter-record)) and returns unused. It performs the following steps when called:

1.  [Assert](#assert): The [surrounding agent](#surrounding-agent) is in the [critical section](#sec-waiterlist-records) for `WL`.
2.  If `waiterRecord`.`[[PromiseCapability]]` is blocking, then
    1.  Wake the [agent](#agent) whose signifier is `waiterRecord`.`[[AgentSignifier]]` from suspension.
    2.  NOTE: This causes the [agent](#agent) to resume execution in [SuspendThisAgent](#sec-suspendthisagent).
3.  Else if [AgentSignifier](#sec-agentsignifier)() is `waiterRecord`.`[[AgentSignifier]]`, then
    1.  Let `promiseCapability` be `waiterRecord`.`[[PromiseCapability]]`.
    2.  Perform ! [Call](#sec-call)(`promiseCapability`.`[[Resolve]]`, undefined, « `waiterRecord`.`[[Result]]` »).
4.  Else,
    1.  Perform [EnqueueResolveInAgentJob](#sec-enqueueresolveinagentjob)(`waiterRecord`.`[[AgentSignifier]]`, `waiterRecord`.`[[PromiseCapability]]`, `waiterRecord`.`[[Result]]`).
5.  Return unused.

Note

An [agent](#agent) must not access another [agent](#agent)'s promise capability in any capacity beyond passing it to the [host](#host).

#### 25.4.3.13 EnqueueResolveInAgentJob ( `agentSignifier`, `promiseCapability`, `resolution` )

The abstract operation EnqueueResolveInAgentJob takes arguments `agentSignifier` (an [agent signifier](#sec-agents)), `promiseCapability` (a [PromiseCapability Record](#sec-promisecapability-records)), and `resolution` ("ok" or "timed-out") and returns unused. It performs the following steps when called:

1.  Let `resolveJob` be a new [Job](#job) [Abstract Closure](#sec-abstract-closure) with no parameters that captures `agentSignifier`, `promiseCapability`, and `resolution` and performs the following steps when called:
    1.  [Assert](#assert): [AgentSignifier](#sec-agentsignifier)() is `agentSignifier`.
    2.  Perform ! [Call](#sec-call)(`promiseCapability`.`[[Resolve]]`, undefined, « `resolution` »).
    3.  Return unused.
2.  Let `realmInTargetAgent` be ! [GetFunctionRealm](#sec-getfunctionrealm)(`promiseCapability`.`[[Resolve]]`).
3.  [Assert](#assert): `agentSignifier` is `realmInTargetAgent`.`[[AgentSignifier]]`.
4.  Perform [HostEnqueueGenericJob](#sec-hostenqueuegenericjob)(`resolveJob`, `realmInTargetAgent`).
5.  Return unused.

#### 25.4.3.14 DoWait ( `mode`, `typedArray`, `index`, `value`, `timeout` )

The abstract operation DoWait takes arguments `mode` (sync or async), `typedArray` (an [ECMAScript language value](#sec-ecmascript-language-types)), `index` (an [ECMAScript language value](#sec-ecmascript-language-types)), `value` (an [ECMAScript language value](#sec-ecmascript-language-types)), and `timeout` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) either an Object, "not-equal", "timed-out", or "ok", or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `taRecord` be ? [ValidateIntegerTypedArray](#sec-validateintegertypedarray)(`typedArray`, true).
2.  Let `buffer` be `taRecord`.`[[Object]]`.`[[ViewedArrayBuffer]]`.
3.  If [IsSharedArrayBuffer](#sec-issharedarraybuffer)(`buffer`) is false, throw a TypeError exception.
4.  Let `i` be ? [ValidateAtomicAccess](#sec-validateatomicaccess)(`taRecord`, `index`).
5.  Let `arrayTypeName` be `typedArray`.`[[TypedArrayName]]`.
6.  If `arrayTypeName` is "BigInt64Array", let `v` be ? [ToBigInt64](#sec-tobigint64)(`value`).
7.  Else, let `v` be ? [ToInt32](#sec-toint32)(`value`).
8.  Let `q` be ? [ToNumber](#sec-tonumber)(`timeout`).
9.  If `q` is either NaN or +∞_(𝔽), let `t` be +∞; else if `q` is -∞_(𝔽), let `t` be 0; else let `t` be [max](#eqn-max)([ℝ](#ℝ)(`q`), 0).
10. If `mode` is sync and [AgentCanSuspend](#sec-agentcansuspend)() is false, throw a TypeError exception.
11. Let `block` be `buffer`.`[[ArrayBufferData]]`.
12. Let `offset` be `typedArray`.`[[ByteOffset]]`.
13. Let `byteIndexInBuffer` be (`i` × 4) + `offset`.
14. Let `WL` be [GetWaiterList](#sec-getwaiterlist)(`block`, `byteIndexInBuffer`).
15. If `mode` is sync, then
    1.  Let `promiseCapability` be blocking.
    2.  Let `resultObject` be undefined.
16. Else,
    1.  Let `promiseCapability` be ! [NewPromiseCapability](#sec-newpromisecapability)([%Promise%](#sec-promise-constructor)).
    2.  Let `resultObject` be [OrdinaryObjectCreate](#sec-ordinaryobjectcreate)([%Object.prototype%](#sec-properties-of-the-object-prototype-object)).
17. Perform [EnterCriticalSection](#sec-entercriticalsection)(`WL`).
18. Let `elementType` be [TypedArrayElementType](#sec-typedarrayelementtype)(`typedArray`).
19. Let `w` be [GetValueFromBuffer](#sec-getvaluefrombuffer)(`buffer`, `byteIndexInBuffer`, `elementType`, true, seq-cst).
20. If `v` ≠ `w`, then
    1.  Perform [LeaveCriticalSection](#sec-leavecriticalsection)(`WL`).
    2.  If `mode` is sync, return "not-equal".
    3.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`resultObject`, "async", false).
    4.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`resultObject`, "value", "not-equal").
    5.  Return `resultObject`.
21. If `t` = 0 and `mode` is async, then
    1.  NOTE: There is no special handling of synchronous immediate timeouts. Asynchronous immediate timeouts have special handling in order to fail fast and avoid unnecessary Promise jobs.
    2.  Perform [LeaveCriticalSection](#sec-leavecriticalsection)(`WL`).
    3.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`resultObject`, "async", false).
    4.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`resultObject`, "value", "timed-out").
    5.  Return `resultObject`.
22. Let `thisAgent` be [AgentSignifier](#sec-agentsignifier)().
23. Let `now` be the [time value](#sec-time-values-and-time-range) (UTC) identifying the current time.
24. Let `additionalTimeout` be an [implementation-defined](#implementation-defined) non-negative [mathematical value](#mathematical-value).
25. Let `timeoutTime` be [ℝ](#ℝ)(`now`) + `t` + `additionalTimeout`.
26. NOTE: When `t` is +∞, `timeoutTime` is also +∞.
27. Let `waiterRecord` be a new [Waiter Record](#sec-waiter-record) { `[[AgentSignifier]]`: `thisAgent`, `[[PromiseCapability]]`: `promiseCapability`, `[[TimeoutTime]]`: `timeoutTime`, `[[Result]]`: "ok" }.
28. Perform [AddWaiter](#sec-addwaiter)(`WL`, `waiterRecord`).
29. If `mode` is sync, then
    1.  Perform [SuspendThisAgent](#sec-suspendthisagent)(`WL`, `waiterRecord`).
30. Else if `timeoutTime` is [finite](#finite), then
    1.  Perform [EnqueueAtomicsWaitAsyncTimeoutJob](#sec-enqueueatomicswaitasynctimeoutjob)(`WL`, `waiterRecord`).
31. Perform [LeaveCriticalSection](#sec-leavecriticalsection)(`WL`).
32. If `mode` is sync, return `waiterRecord`.`[[Result]]`.
33. Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`resultObject`, "async", true).
34. Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`resultObject`, "value", `promiseCapability`.`[[Promise]]`).
35. Return `resultObject`.

Note

`additionalTimeout` allows implementations to pad timeouts as necessary, such as for reducing power consumption or coarsening timer resolution to mitigate timing attacks. This value may differ from call to call of DoWait.

#### 25.4.3.15 EnqueueAtomicsWaitAsyncTimeoutJob ( `WL`, `waiterRecord` )

The abstract operation EnqueueAtomicsWaitAsyncTimeoutJob takes arguments `WL` (a [WaiterList Record](#sec-waiterlist-records)) and `waiterRecord` (a [Waiter Record](#sec-waiter-record)) and returns unused. It performs the following steps when called:

1.  Let `timeoutJob` be a new [Job](#job) [Abstract Closure](#sec-abstract-closure) with no parameters that captures `WL` and `waiterRecord` and performs the following steps when called:
    1.  Perform [EnterCriticalSection](#sec-entercriticalsection)(`WL`).
    2.  If `WL`.`[[Waiters]]` contains `waiterRecord`, then
        1.  Let `timeOfJobExecution` be the [time value](#sec-time-values-and-time-range) (UTC) identifying the current time.
        2.  [Assert](#assert): [ℝ](#ℝ)(`timeOfJobExecution`) ≥ `waiterRecord`.`[[TimeoutTime]]` (ignoring potential non-monotonicity of [time values](#sec-time-values-and-time-range)).
        3.  Set `waiterRecord`.`[[Result]]` to "timed-out".
        4.  Perform [RemoveWaiter](#sec-removewaiter)(`WL`, `waiterRecord`).
        5.  Perform [NotifyWaiter](#sec-notifywaiter)(`WL`, `waiterRecord`).
    3.  Perform [LeaveCriticalSection](#sec-leavecriticalsection)(`WL`).
    4.  Return unused.
2.  Let `now` be the [time value](#sec-time-values-and-time-range) (UTC) identifying the current time.
3.  Let `currentRealm` be [the current Realm Record](#current-realm).
4.  Perform [HostEnqueueTimeoutJob](#sec-hostenqueuetimeoutjob)(`timeoutJob`, `currentRealm`, [𝔽](#𝔽)(`waiterRecord`.`[[TimeoutTime]]`) - `now`).
5.  Return unused.

#### 25.4.3.16 AtomicCompareExchangeInSharedBlock ( `block`, `byteIndexInBuffer`, `elementSize`, `expectedBytes`, `replacementBytes` )

The abstract operation AtomicCompareExchangeInSharedBlock takes arguments `block` (a [Shared Data Block](#sec-data-blocks)), `byteIndexInBuffer` (an [integer](#integer)), `elementSize` (a non-negative [integer](#integer)), `expectedBytes` (a [List](#sec-list-and-record-specification-type) of [byte values](#sec-data-blocks)), and `replacementBytes` (a [List](#sec-list-and-record-specification-type) of [byte values](#sec-data-blocks)) and returns a [List](#sec-list-and-record-specification-type) of [byte values](#sec-data-blocks). It performs the following steps when called:

1.  Let `execution` be the `[[CandidateExecution]]` field of the [surrounding agent](#surrounding-agent)'s [Agent Record](#agent-record).
2.  Let `eventsRecord` be the [Agent Events Record](#sec-agent-event-records) of `execution`.`[[EventsRecords]]` whose `[[AgentSignifier]]` is [AgentSignifier](#sec-agentsignifier)().
3.  Let `rawBytesRead` be a [List](#sec-list-and-record-specification-type) of length `elementSize` whose elements are nondeterministically chosen [byte values](#sec-data-blocks).
4.  NOTE: In implementations, `rawBytesRead` is the result of a load-link, of a load-exclusive, or of an operand of a read-modify-write instruction on the underlying hardware. The nondeterminism is a semantic prescription of the [memory model](#sec-memory-model) to describe observable behaviour of hardware with weak consistency.
5.  NOTE: The comparison of the expected value and the read value is performed outside of the [read-modify-write modification function](#sec-arraybuffer-notation) to avoid needlessly strong synchronization when the expected value is not equal to the read value.
6.  If [ByteListEqual](#sec-bytelistequal)(`rawBytesRead`, `expectedBytes`) is true, then
    1.  Let `second` be a new [read-modify-write modification function](#sec-arraybuffer-notation) with parameters (`oldBytes`, `newBytes`) that captures nothing and performs the following steps atomically when called:
        1.  Return `newBytes`.
    2.  Let `event` be [ReadModifyWriteSharedMemory](#sec-memory-model-fundamentals) { `[[Order]]`: seq-cst, `[[NoTear]]`: true, `[[Block]]`: `block`, `[[ByteIndex]]`: `byteIndexInBuffer`, `[[ElementSize]]`: `elementSize`, `[[Payload]]`: `replacementBytes`, `[[ModifyOp]]`: `second` }.
7.  Else,
    1.  Let `event` be [ReadSharedMemory](#sec-memory-model-fundamentals) { `[[Order]]`: seq-cst, `[[NoTear]]`: true, `[[Block]]`: `block`, `[[ByteIndex]]`: `byteIndexInBuffer`, `[[ElementSize]]`: `elementSize` }.
8.  Append `event` to `eventsRecord`.`[[EventList]]`.
9.  Append [Chosen Value Record](#sec-chosen-value-records) { `[[Event]]`: `event`, `[[ChosenValue]]`: `rawBytesRead` } to `execution`.`[[ChosenValues]]`.
10. Return `rawBytesRead`.

#### 25.4.3.17 AtomicReadModifyWrite ( `typedArray`, `index`, `value`, `op` )

The abstract operation AtomicReadModifyWrite takes arguments `typedArray` (an [ECMAScript language value](#sec-ecmascript-language-types)), `index` (an [ECMAScript language value](#sec-ecmascript-language-types)), `value` (an [ECMAScript language value](#sec-ecmascript-language-types)), and `op` (a [read-modify-write modification function](#sec-arraybuffer-notation)) and returns either a [normal completion containing](#sec-completion-record-specification-type) either a Number or a BigInt, or a [throw completion](#sec-completion-record-specification-type). `op` takes two [List](#sec-list-and-record-specification-type) of [byte values](#sec-data-blocks) arguments and returns a [List](#sec-list-and-record-specification-type) of [byte values](#sec-data-blocks). This operation atomically loads a value, combines it with another value, and stores the combination. It returns the loaded value. It performs the following steps when called:

1.  Let `byteIndexInBuffer` be ? [ValidateAtomicAccessOnIntegerTypedArray](#sec-validateatomicaccessonintegertypedarray)(`typedArray`, `index`).
2.  If `typedArray`.`[[ContentType]]` is bigint, let `v` be ? [ToBigInt](#sec-tobigint)(`value`).
3.  Otherwise, let `v` be [𝔽](#𝔽)(? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`value`)).
4.  Perform ? [RevalidateAtomicAccess](#sec-revalidateatomicaccess)(`typedArray`, `byteIndexInBuffer`).
5.  Let `buffer` be `typedArray`.`[[ViewedArrayBuffer]]`.
6.  Let `elementType` be [TypedArrayElementType](#sec-typedarrayelementtype)(`typedArray`).
7.  Return [GetModifySetValueInBuffer](#sec-getmodifysetvalueinbuffer)(`buffer`, `byteIndexInBuffer`, `elementType`, `v`, `op`).

#### 25.4.3.18 ByteListBitwiseOp ( `op`, `xBytes`, `yBytes` )

The abstract operation ByteListBitwiseOp takes arguments `op` (`&`, `^`, or `|`), `xBytes` (a [List](#sec-list-and-record-specification-type) of [byte values](#sec-data-blocks)), and `yBytes` (a [List](#sec-list-and-record-specification-type) of [byte values](#sec-data-blocks)) and returns a [List](#sec-list-and-record-specification-type) of [byte values](#sec-data-blocks). The operation atomically performs a bitwise operation on all [byte values](#sec-data-blocks) of the arguments and returns a [List](#sec-list-and-record-specification-type) of [byte values](#sec-data-blocks). It performs the following steps when called:

1.  [Assert](#assert): `xBytes` and `yBytes` have the same number of elements.
2.  Let `result` be a new empty [List](#sec-list-and-record-specification-type).
3.  Let `i` be 0.
4.  For each element `xByte` of `xBytes`, do
    1.  Let `yByte` be `yBytes`\[`i`\].
    2.  If `op` is `&`, then
        1.  Let `resultByte` be the result of applying the bitwise AND operation to `xByte` and `yByte`.
    3.  Else if `op` is `^`, then
        1.  Let `resultByte` be the result of applying the bitwise exclusive OR (XOR) operation to `xByte` and `yByte`.
    4.  Else,
        1.  [Assert](#assert): `op` is `|`.
        2.  Let `resultByte` be the result of applying the bitwise inclusive OR operation to `xByte` and `yByte`.
    5.  Set `i` to `i` + 1.
    6.  Append `resultByte` to `result`.
5.  Return `result`.

#### 25.4.3.19 ByteListEqual ( `xBytes`, `yBytes` )

The abstract operation ByteListEqual takes arguments `xBytes` (a [List](#sec-list-and-record-specification-type) of [byte values](#sec-data-blocks)) and `yBytes` (a [List](#sec-list-and-record-specification-type) of [byte values](#sec-data-blocks)) and returns a Boolean. It performs the following steps when called:

1.  If `xBytes` and `yBytes` do not have the same number of elements, return false.
2.  Let `i` be 0.
3.  For each element `xByte` of `xBytes`, do
    1.  Let `yByte` be `yBytes`\[`i`\].
    2.  If `xByte` ≠ `yByte`, return false.
    3.  Set `i` to `i` + 1.
4.  Return true.

### 25.4.4 Atomics.add ( `typedArray`, `index`, `value` )

This function performs the following steps when called:

1.  Let `add` be a new [read-modify-write modification function](#sec-arraybuffer-notation) with parameters (`xBytes`, `yBytes`) that captures `typedArray` and performs the following steps atomically when called:
    1.  Let `type` be [TypedArrayElementType](#sec-typedarrayelementtype)(`typedArray`).
    2.  Let `isLittleEndian` be the value of the `[[LittleEndian]]` field of the [surrounding agent](#surrounding-agent)'s [Agent Record](#agent-record).
    3.  Let `x` be [RawBytesToNumeric](#sec-rawbytestonumeric)(`type`, `xBytes`, `isLittleEndian`).
    4.  Let `y` be [RawBytesToNumeric](#sec-rawbytestonumeric)(`type`, `yBytes`, `isLittleEndian`).
    5.  If `x` [is a Number](#sec-ecmascript-language-types-number-type), then
        1.  Let `sum` be [Number::add](#sec-numeric-types-number-add)(`x`, `y`).
    6.  Else,
        1.  [Assert](#assert): `x` [is a BigInt](#sec-ecmascript-language-types-bigint-type).
        2.  Let `sum` be [BigInt::add](#sec-numeric-types-bigint-add)(`x`, `y`).
    7.  Let `sumBytes` be [NumericToRawBytes](#sec-numerictorawbytes)(`type`, `sum`, `isLittleEndian`).
    8.  [Assert](#assert): `sumBytes`, `xBytes`, and `yBytes` have the same number of elements.
    9.  Return `sumBytes`.
2.  Return ? [AtomicReadModifyWrite](#sec-atomicreadmodifywrite)(`typedArray`, `index`, `value`, `add`).

### 25.4.5 Atomics.and ( `typedArray`, `index`, `value` )

This function performs the following steps when called:

1.  Let `and` be a new [read-modify-write modification function](#sec-arraybuffer-notation) with parameters (`xBytes`, `yBytes`) that captures nothing and performs the following steps atomically when called:
    1.  Return [ByteListBitwiseOp](#sec-bytelistbitwiseop)(`&`, `xBytes`, `yBytes`).
2.  Return ? [AtomicReadModifyWrite](#sec-atomicreadmodifywrite)(`typedArray`, `index`, `value`, `and`).

### 25.4.6 Atomics.compareExchange ( `typedArray`, `index`, `expectedValue`, `replacementValue` )

This function performs the following steps when called:

1.  Let `byteIndexInBuffer` be ? [ValidateAtomicAccessOnIntegerTypedArray](#sec-validateatomicaccessonintegertypedarray)(`typedArray`, `index`).
2.  Let `buffer` be `typedArray`.`[[ViewedArrayBuffer]]`.
3.  Let `block` be `buffer`.`[[ArrayBufferData]]`.
4.  If `typedArray`.`[[ContentType]]` is bigint, then
    1.  Let `expected` be ? [ToBigInt](#sec-tobigint)(`expectedValue`).
    2.  Let `replacement` be ? [ToBigInt](#sec-tobigint)(`replacementValue`).
5.  Else,
    1.  Let `expected` be [𝔽](#𝔽)(? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`expectedValue`)).
    2.  Let `replacement` be [𝔽](#𝔽)(? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`replacementValue`)).
6.  Perform ? [RevalidateAtomicAccess](#sec-revalidateatomicaccess)(`typedArray`, `byteIndexInBuffer`).
7.  Let `elementType` be [TypedArrayElementType](#sec-typedarrayelementtype)(`typedArray`).
8.  Let `elementSize` be [TypedArrayElementSize](#sec-typedarrayelementsize)(`typedArray`).
9.  Let `isLittleEndian` be the value of the `[[LittleEndian]]` field of the [surrounding agent](#surrounding-agent)'s [Agent Record](#agent-record).
10. Let `expectedBytes` be [NumericToRawBytes](#sec-numerictorawbytes)(`elementType`, `expected`, `isLittleEndian`).
11. Let `replacementBytes` be [NumericToRawBytes](#sec-numerictorawbytes)(`elementType`, `replacement`, `isLittleEndian`).
12. If [IsSharedArrayBuffer](#sec-issharedarraybuffer)(`buffer`) is true, then
    1.  Let `rawBytesRead` be [AtomicCompareExchangeInSharedBlock](#sec-atomiccompareexchangeinsharedblock)(`block`, `byteIndexInBuffer`, `elementSize`, `expectedBytes`, `replacementBytes`).
13. Else,
    1.  Let `rawBytesRead` be a [List](#sec-list-and-record-specification-type) of length `elementSize` whose elements are the sequence of `elementSize` bytes starting with `block`\[`byteIndexInBuffer`\].
    2.  If [ByteListEqual](#sec-bytelistequal)(`rawBytesRead`, `expectedBytes`) is true, then
        1.  Store the individual bytes of `replacementBytes` into `block`, starting at `block`\[`byteIndexInBuffer`\].
14. Return [RawBytesToNumeric](#sec-rawbytestonumeric)(`elementType`, `rawBytesRead`, `isLittleEndian`).

### 25.4.7 Atomics.exchange ( `typedArray`, `index`, `value` )

This function performs the following steps when called:

1.  Let `second` be a new [read-modify-write modification function](#sec-arraybuffer-notation) with parameters (`oldBytes`, `newBytes`) that captures nothing and performs the following steps atomically when called:
    1.  Return `newBytes`.
2.  Return ? [AtomicReadModifyWrite](#sec-atomicreadmodifywrite)(`typedArray`, `index`, `value`, `second`).

### 25.4.8 Atomics.isLockFree ( `size` )

This function performs the following steps when called:

1.  Let `n` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`size`).
2.  Let `AR` be the [Agent Record](#agent-record) of the [surrounding agent](#surrounding-agent).
3.  If `n` = 1, return `AR`.`[[IsLockFree1]]`.
4.  If `n` = 2, return `AR`.`[[IsLockFree2]]`.
5.  If `n` = 4, return true.
6.  If `n` = 8, return `AR`.`[[IsLockFree8]]`.
7.  Return false.

Note

This function is an optimization primitive. The intuition is that if the atomic step of an atomic primitive (`compareExchange`, `load`, `store`, `add`, `sub`, `and`, `or`, `xor`, or `exchange`) on a datum of size `n` bytes will be performed without the [surrounding agent](#surrounding-agent) acquiring a lock outside the `n` bytes comprising the datum, then `Atomics.isLockFree`(`n`) will return true. High-performance algorithms will use this function to determine whether to use locks or atomic operations in [critical sections](#sec-waiterlist-records). If an atomic primitive is not lock-free then it is often more efficient for an algorithm to provide its own locking.

`Atomics.isLockFree`(4) always returns true as that can be supported on all known relevant hardware. Being able to assume this will generally simplify programs.

Regardless of the value returned by this function, all atomic operations are guaranteed to be atomic. For example, they will never have a visible operation take place in the middle of the operation (e.g., "tearing").

### 25.4.9 Atomics.load ( `typedArray`, `index` )

This function performs the following steps when called:

1.  Let `byteIndexInBuffer` be ? [ValidateAtomicAccessOnIntegerTypedArray](#sec-validateatomicaccessonintegertypedarray)(`typedArray`, `index`).
2.  Perform ? [RevalidateAtomicAccess](#sec-revalidateatomicaccess)(`typedArray`, `byteIndexInBuffer`).
3.  Let `buffer` be `typedArray`.`[[ViewedArrayBuffer]]`.
4.  Let `elementType` be [TypedArrayElementType](#sec-typedarrayelementtype)(`typedArray`).
5.  Return [GetValueFromBuffer](#sec-getvaluefrombuffer)(`buffer`, `byteIndexInBuffer`, `elementType`, true, seq-cst).

### 25.4.10 Atomics.or ( `typedArray`, `index`, `value` )

This function performs the following steps when called:

1.  Let `or` be a new [read-modify-write modification function](#sec-arraybuffer-notation) with parameters (`xBytes`, `yBytes`) that captures nothing and performs the following steps atomically when called:
    1.  Return [ByteListBitwiseOp](#sec-bytelistbitwiseop)(`|`, `xBytes`, `yBytes`).
2.  Return ? [AtomicReadModifyWrite](#sec-atomicreadmodifywrite)(`typedArray`, `index`, `value`, `or`).

### 25.4.11 Atomics.store ( `typedArray`, `index`, `value` )

This function performs the following steps when called:

1.  Let `byteIndexInBuffer` be ? [ValidateAtomicAccessOnIntegerTypedArray](#sec-validateatomicaccessonintegertypedarray)(`typedArray`, `index`).
2.  If `typedArray`.`[[ContentType]]` is bigint, let `v` be ? [ToBigInt](#sec-tobigint)(`value`).
3.  Otherwise, let `v` be [𝔽](#𝔽)(? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`value`)).
4.  Perform ? [RevalidateAtomicAccess](#sec-revalidateatomicaccess)(`typedArray`, `byteIndexInBuffer`).
5.  Let `buffer` be `typedArray`.`[[ViewedArrayBuffer]]`.
6.  Let `elementType` be [TypedArrayElementType](#sec-typedarrayelementtype)(`typedArray`).
7.  Perform [SetValueInBuffer](#sec-setvalueinbuffer)(`buffer`, `byteIndexInBuffer`, `elementType`, `v`, true, seq-cst).
8.  Return `v`.

### 25.4.12 Atomics.sub ( `typedArray`, `index`, `value` )

This function performs the following steps when called:

1.  Let `subtract` be a new [read-modify-write modification function](#sec-arraybuffer-notation) with parameters (`xBytes`, `yBytes`) that captures `typedArray` and performs the following steps atomically when called:
    1.  Let `type` be [TypedArrayElementType](#sec-typedarrayelementtype)(`typedArray`).
    2.  Let `isLittleEndian` be the value of the `[[LittleEndian]]` field of the [surrounding agent](#surrounding-agent)'s [Agent Record](#agent-record).
    3.  Let `x` be [RawBytesToNumeric](#sec-rawbytestonumeric)(`type`, `xBytes`, `isLittleEndian`).
    4.  Let `y` be [RawBytesToNumeric](#sec-rawbytestonumeric)(`type`, `yBytes`, `isLittleEndian`).
    5.  If `x` [is a Number](#sec-ecmascript-language-types-number-type), then
        1.  Let `difference` be [Number::subtract](#sec-numeric-types-number-subtract)(`x`, `y`).
    6.  Else,
        1.  [Assert](#assert): `x` [is a BigInt](#sec-ecmascript-language-types-bigint-type).
        2.  Let `difference` be [BigInt::subtract](#sec-numeric-types-bigint-subtract)(`x`, `y`).
    7.  Let `differenceBytes` be [NumericToRawBytes](#sec-numerictorawbytes)(`type`, `difference`, `isLittleEndian`).
    8.  [Assert](#assert): `differenceBytes`, `xBytes`, and `yBytes` have the same number of elements.
    9.  Return `differenceBytes`.
2.  Return ? [AtomicReadModifyWrite](#sec-atomicreadmodifywrite)(`typedArray`, `index`, `value`, `subtract`).

### 25.4.13 Atomics.wait ( `typedArray`, `index`, `value`, `timeout` )

This function puts the [surrounding agent](#surrounding-agent) in a wait queue and suspends it until notified or until the wait times out, returning a String differentiating those cases.

It performs the following steps when called:

1.  Return ? [DoWait](#sec-dowait)(sync, `typedArray`, `index`, `value`, `timeout`).

### 25.4.14 Atomics.waitAsync ( `typedArray`, `index`, `value`, `timeout` )

This function returns a Promise that is resolved when the calling [agent](#agent) is notified or the timeout is reached.

It performs the following steps when called:

1.  Return ? [DoWait](#sec-dowait)(async, `typedArray`, `index`, `value`, `timeout`).

### 25.4.15 Atomics.notify ( `typedArray`, `index`, `count` )

This function notifies some [agents](#agent) that are sleeping in the wait queue.

It performs the following steps when called:

1.  Let `byteIndexInBuffer` be ? [ValidateAtomicAccessOnIntegerTypedArray](#sec-validateatomicaccessonintegertypedarray)(`typedArray`, `index`, true).
2.  If `count` is undefined, then
    1.  Let `c` be +∞.
3.  Else,
    1.  Let `intCount` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`count`).
    2.  Let `c` be [max](#eqn-max)(`intCount`, 0).
4.  Let `buffer` be `typedArray`.`[[ViewedArrayBuffer]]`.
5.  Let `block` be `buffer`.`[[ArrayBufferData]]`.
6.  If [IsSharedArrayBuffer](#sec-issharedarraybuffer)(`buffer`) is false, return +0_(𝔽).
7.  Let `WL` be [GetWaiterList](#sec-getwaiterlist)(`block`, `byteIndexInBuffer`).
8.  Perform [EnterCriticalSection](#sec-entercriticalsection)(`WL`).
9.  Let `S` be [RemoveWaiters](#sec-removewaiters)(`WL`, `c`).
10. For each element `W` of `S`, do
    1.  Perform [NotifyWaiter](#sec-notifywaiter)(`WL`, `W`).
11. Perform [LeaveCriticalSection](#sec-leavecriticalsection)(`WL`).
12. Let `n` be the number of elements in `S`.
13. Return [𝔽](#𝔽)(`n`).

### 25.4.16 Atomics.xor ( `typedArray`, `index`, `value` )

This function performs the following steps when called:

1.  Let `xor` be a new [read-modify-write modification function](#sec-arraybuffer-notation) with parameters (`xBytes`, `yBytes`) that captures nothing and performs the following steps atomically when called:
    1.  Return [ByteListBitwiseOp](#sec-bytelistbitwiseop)(`^`, `xBytes`, `yBytes`).
2.  Return ? [AtomicReadModifyWrite](#sec-atomicreadmodifywrite)(`typedArray`, `index`, `value`, `xor`).

### 25.4.17 Atomics \[ %Symbol.toStringTag% \]

The initial value of the [%Symbol.toStringTag%](#sec-well-known-symbols) property is the String value "Atomics".

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: true }.

## 25.5 The JSON Object

The JSON object:

- is %JSON%.
- is the initial value of the "JSON" property of the [global object](#sec-global-object).
- is an [ordinary object](#ordinary-object).
- contains two functions, `parse` and `stringify`, that are used to parse and construct JSON texts.
- has a `[[Prototype]]` internal slot whose value is [%Object.prototype%](#sec-properties-of-the-object-prototype-object).
- does not have a `[[Construct]]` internal method; it cannot be used as a [constructor](#constructor) with the `new` operator.
- does not have a `[[Call]]` internal method; it cannot be invoked as a function.

The JSON Data Interchange Format is defined in ECMA-404. The JSON interchange format used in this specification is exactly that described by ECMA-404. Conforming implementations of `JSON.parse` and `JSON.stringify` must support the exact interchange format described in the ECMA-404 specification without any deletions or extensions to the format.

### 25.5.1 JSON.parse ( `text` \[ , `reviver` \] )

This function parses a JSON text (a JSON-formatted String) and produces an [ECMAScript language value](#sec-ecmascript-language-types). The JSON format represents literals, arrays, and objects with a syntax similar to the syntax for ECMAScript literals, Array Initializers, and Object Initializers. After parsing, JSON objects are realized as ECMAScript objects. JSON arrays are realized as ECMAScript Array instances. JSON strings, numbers, booleans, and null are realized as ECMAScript Strings, Numbers, Booleans, and null.

The optional `reviver` parameter is a function that takes two parameters, `key` and `value`. It can filter and transform the results. It is called with each of the `key`/`value` pairs produced by the parse, and its return value is used instead of the original value. If it returns what it received, the structure is not modified. If it returns undefined then the property is deleted from the result.

1.  Let `jsonString` be ? [ToString](#sec-tostring)(`text`).
2.  Let `unfiltered` be ? [ParseJSON](#sec-ParseJSON)(`jsonString`).
3.  If [IsCallable](#sec-iscallable)(`reviver`) is true, then
    1.  Let `root` be [OrdinaryObjectCreate](#sec-ordinaryobjectcreate)([%Object.prototype%](#sec-properties-of-the-object-prototype-object)).
    2.  Let `rootName` be the empty String.
    3.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`root`, `rootName`, `unfiltered`).
    4.  Return ? [InternalizeJSONProperty](#sec-internalizejsonproperty)(`root`, `rootName`, `reviver`).
4.  Else,
    1.  Return `unfiltered`.

The "length" property of this function is 2_(𝔽).

#### 25.5.1.1 ParseJSON ( `text` )

The abstract operation ParseJSON takes argument `text` (a String) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [ECMAScript language value](#sec-ecmascript-language-types) or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  If [StringToCodePoints](#sec-stringtocodepoints)(`text`) is not a valid JSON text as specified in ECMA-404, throw a SyntaxError exception.
2.  Let `scriptString` be the [string-concatenation](#string-concatenation) of "(", `text`, and ");".
3.  Let `script` be [ParseText](#sec-parsetext)(`scriptString`, [Script](#prod-Script)).
4.  NOTE: The [early error](#early-error) rules defined in [13.2.5.1](#sec-object-initializer-static-semantics-early-errors) have special handling for the above invocation of [ParseText](#sec-parsetext).
5.  [Assert](#assert): `script` is a [Parse Node](#sec-syntactic-grammar).
6.  Let `result` be ! [Evaluation](#sec-evaluation) of `script`.
7.  NOTE: The [PropertyDefinitionEvaluation](#sec-runtime-semantics-propertydefinitionevaluation) semantics defined in [13.2.5.5](#sec-runtime-semantics-propertydefinitionevaluation) have special handling for the above evaluation.
8.  [Assert](#assert): `result` is either a String, a Number, a Boolean, an Object that is defined by either an [ArrayLiteral](#prod-ArrayLiteral) or an [ObjectLiteral](#prod-ObjectLiteral), or null.
9.  Return `result`.

It is not permitted for a conforming implementation of `JSON.parse` to extend the JSON grammars. If an implementation wishes to support a modified or extended JSON interchange format it must do so by defining a different parse function.

Note 1

Valid JSON text is a subset of the ECMAScript [PrimaryExpression](#prod-PrimaryExpression) syntax. Step [1](#step-json-parse-validate) verifies that `jsonString` conforms to that subset, and step [8](#step-json-parse-assert-type) asserts that evaluation returns a value of an appropriate type.

However, because [13.2.5.5](#sec-runtime-semantics-propertydefinitionevaluation) behaves differently during ParseJSON, the same source text can produce different results when evaluated as a [PrimaryExpression](#prod-PrimaryExpression) rather than as JSON. Furthermore, the Early Error for duplicate "\_\_proto\_\_" properties in object literals, which likewise does not apply during ParseJSON, means that not all texts accepted by ParseJSON are valid as a [PrimaryExpression](#prod-PrimaryExpression), despite matching the grammar.

Note 2

In the case where there are duplicate name Strings within an object, lexically preceding values for the same key shall be overwritten.

#### 25.5.1.2 InternalizeJSONProperty ( `holder`, `name`, `reviver` )

The abstract operation InternalizeJSONProperty takes arguments `holder` (an Object), `name` (a String), and `reviver` (a [function object](#function-object)) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [ECMAScript language value](#sec-ecmascript-language-types) or a [throw completion](#sec-completion-record-specification-type).

Note

This algorithm intentionally does not throw an exception if either `[[Delete]]` or [CreateDataProperty](#sec-createdataproperty) return false.

It performs the following steps when called:

1.  Let `val` be ? [Get](#sec-get-o-p)(`holder`, `name`).
2.  If `val` [is an Object](#sec-object-type), then
    1.  Let `isArray` be ? [IsArray](#sec-isarray)(`val`).
    2.  If `isArray` is true, then
        1.  Let `len` be ? [LengthOfArrayLike](#sec-lengthofarraylike)(`val`).
        2.  Let `I` be 0.
        3.  Repeat, while `I` \< `len`,
            1.  Let `prop` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`I`)).
            2.  Let `newElement` be ? [InternalizeJSONProperty](#sec-internalizejsonproperty)(`val`, `prop`, `reviver`).
            3.  If `newElement` is undefined, then
                1.  Perform ? `val`.`[[Delete]]`(`prop`).
            4.  Else,
                1.  Perform ? [CreateDataProperty](#sec-createdataproperty)(`val`, `prop`, `newElement`).
            5.  Set `I` to `I` + 1.
    3.  Else,
        1.  Let `keys` be ? [EnumerableOwnProperties](#sec-enumerableownproperties)(`val`, key).
        2.  For each String `P` of `keys`, do
            1.  Let `newElement` be ? [InternalizeJSONProperty](#sec-internalizejsonproperty)(`val`, `P`, `reviver`).
            2.  If `newElement` is undefined, then
                1.  Perform ? `val`.`[[Delete]]`(`P`).
            3.  Else,
                1.  Perform ? [CreateDataProperty](#sec-createdataproperty)(`val`, `P`, `newElement`).
3.  Return ? [Call](#sec-call)(`reviver`, `holder`, « `name`, `val` »).

### 25.5.2 JSON.stringify ( `value` \[ , `replacer` \[ , `space` \] \] )

This function returns a String in UTF-16 encoded JSON format representing an [ECMAScript language value](#sec-ecmascript-language-types), or undefined. It can take three parameters. The `value` parameter is an [ECMAScript language value](#sec-ecmascript-language-types), which is usually an object or array, although it can also be a String, Boolean, Number or null. The optional `replacer` parameter is either a function that alters the way objects and arrays are stringified, or an array of Strings and Numbers that acts as an inclusion list for selecting the object properties that will be stringified. The optional `space` parameter [is a String](#sec-ecmascript-language-types-string-type) or Number that allows the result to have white space injected into it to improve human readability.

It performs the following steps when called:

1.  Let `stack` be a new empty [List](#sec-list-and-record-specification-type).
2.  Let `indent` be the empty String.
3.  Let `PropertyList` be undefined.
4.  Let `ReplacerFunction` be undefined.
5.  If `replacer` [is an Object](#sec-object-type), then
    1.  If [IsCallable](#sec-iscallable)(`replacer`) is true, then
        1.  Set `ReplacerFunction` to `replacer`.
    2.  Else,
        1.  Let `isArray` be ? [IsArray](#sec-isarray)(`replacer`).
        2.  If `isArray` is true, then
            1.  Set `PropertyList` to a new empty [List](#sec-list-and-record-specification-type).
            2.  Let `len` be ? [LengthOfArrayLike](#sec-lengthofarraylike)(`replacer`).
            3.  Let `k` be 0.
            4.  Repeat, while `k` \< `len`,
                1.  Let `prop` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k`)).
                2.  Let `v` be ? [Get](#sec-get-o-p)(`replacer`, `prop`).
                3.  Let `item` be undefined.
                4.  If `v` [is a String](#sec-ecmascript-language-types-string-type), then
                    1.  Set `item` to `v`.
                5.  Else if `v` [is a Number](#sec-ecmascript-language-types-number-type), then
                    1.  Set `item` to ! [ToString](#sec-tostring)(`v`).
                6.  Else if `v` [is an Object](#sec-object-type), then
                    1.  If `v` has a `[[StringData]]` or `[[NumberData]]` internal slot, set `item` to ? [ToString](#sec-tostring)(`v`).
                7.  If `item` is not undefined and `PropertyList` does not contain `item`, then
                    1.  Append `item` to `PropertyList`.
                8.  Set `k` to `k` + 1.
6.  If `space` [is an Object](#sec-object-type), then
    1.  If `space` has a `[[NumberData]]` internal slot, then
        1.  Set `space` to ? [ToNumber](#sec-tonumber)(`space`).
    2.  Else if `space` has a `[[StringData]]` internal slot, then
        1.  Set `space` to ? [ToString](#sec-tostring)(`space`).
7.  If `space` [is a Number](#sec-ecmascript-language-types-number-type), then
    1.  Let `spaceMV` be ! [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`space`).
    2.  Set `spaceMV` to [min](#eqn-min)(10, `spaceMV`).
    3.  If `spaceMV` \< 1, let `gap` be the empty String; otherwise let `gap` be the String value containing `spaceMV` occurrences of the code unit 0x0020 (SPACE).
8.  Else if `space` [is a String](#sec-ecmascript-language-types-string-type), then
    1.  If the length of `space` ≤ 10, let `gap` be `space`; otherwise let `gap` be the [substring](#substring) of `space` from 0 to 10.
9.  Else,
    1.  Let `gap` be the empty String.
10. Let `wrapper` be [OrdinaryObjectCreate](#sec-ordinaryobjectcreate)([%Object.prototype%](#sec-properties-of-the-object-prototype-object)).
11. Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`wrapper`, the empty String, `value`).
12. Let `state` be the [JSON Serialization Record](#sec-json-serialization-record) { `[[ReplacerFunction]]`: `ReplacerFunction`, `[[Stack]]`: `stack`, `[[Indent]]`: `indent`, `[[Gap]]`: `gap`, `[[PropertyList]]`: `PropertyList` }.
13. Return ? [SerializeJSONProperty](#sec-serializejsonproperty)(`state`, the empty String, `wrapper`).

The "length" property of this function is 3_(𝔽).

Note 1

JSON structures are allowed to be nested to any depth, but they must be acyclic. If `value` is or contains a cyclic structure, then this function must throw a TypeError exception. This is an example of a value that cannot be stringified:

``` javascript
a = [];
a[0] = a;
my_text = JSON.stringify(a); // This must throw a TypeError.
```

Note 2

Symbolic primitive values are rendered as follows:

- The null value is rendered in JSON text as the String value "null".
- The undefined value is not rendered.
- The true value is rendered in JSON text as the String value "true".
- The false value is rendered in JSON text as the String value "false".

Note 3

String values are wrapped in QUOTATION MARK (`"`) code units. The code units `"` and `\` are escaped with `\` prefixes. Control characters code units are replaced with escape sequences `\u`HHHH, or with the shorter forms, `\b` (BACKSPACE), `\f` (FORM FEED), `\n` (LINE FEED), `\r` (CARRIAGE RETURN), `\t` (CHARACTER TABULATION).

Note 4

[Finite](#finite) numbers are stringified as if by calling [ToString](#sec-tostring)(`number`). NaN and Infinity regardless of sign are represented as the String value "null".

Note 5

Values that do not have a JSON representation (such as undefined and functions) do not produce a String. Instead they produce the undefined value. In arrays these values are represented as the String value "null". In objects an unrepresentable value causes the property to be excluded from stringification.

Note 6

An object is rendered as U+007B (LEFT CURLY BRACKET) followed by zero or more properties, separated with a U+002C (COMMA), closed with a U+007D (RIGHT CURLY BRACKET). A property is a quoted String representing the [property name](#property-name), a U+003A (COLON), and then the stringified property value. An array is rendered as an opening U+005B (LEFT SQUARE BRACKET) followed by zero or more values, separated with a U+002C (COMMA), closed with a U+005D (RIGHT SQUARE BRACKET).

#### 25.5.2.1 JSON Serialization Record

A JSON Serialization Record is a [Record](#sec-list-and-record-specification-type) value used to enable serialization to the JSON format.

JSON Serialization Records have the fields listed in [Table 78](#table-json-serialization-record).

| Field Name | Value | Meaning |
|----|----|----|
| `[[ReplacerFunction]]` | a [function object](#function-object) or undefined | A function that can supply replacement values for object properties (from JSON.stringify's `replacer` parameter). |
| `[[PropertyList]]` | either a [List](#sec-list-and-record-specification-type) of Strings or undefined | The names of properties to include when serializing a non-array object (from JSON.stringify's `replacer` parameter). |
| `[[Gap]]` | a String | The unit of indentation (from JSON.stringify's `space` parameter). |
| `[[Stack]]` | a [List](#sec-list-and-record-specification-type) of Objects | The set of nested objects that are in the process of being serialized. Used to detect cyclic structures. |
| `[[Indent]]` | a String | The current indentation. |

Table 78: [JSON Serialization Record](#sec-json-serialization-record) Fields

#### 25.5.2.2 SerializeJSONProperty ( `state`, `key`, `holder` )

The abstract operation SerializeJSONProperty takes arguments `state` (a [JSON Serialization Record](#sec-json-serialization-record)), `key` (a String), and `holder` (an Object) and returns either a [normal completion containing](#sec-completion-record-specification-type) either a String or undefined, or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `value` be ? [Get](#sec-get-o-p)(`holder`, `key`).
2.  If `value` [is an Object](#sec-object-type) or `value` [is a BigInt](#sec-ecmascript-language-types-bigint-type), then
    1.  Let `toJSON` be ? [GetV](#sec-getv)(`value`, "toJSON").
    2.  If [IsCallable](#sec-iscallable)(`toJSON`) is true, then
        1.  Set `value` to ? [Call](#sec-call)(`toJSON`, `value`, « `key` »).
3.  If `state`.`[[ReplacerFunction]]` is not undefined, then
    1.  Set `value` to ? [Call](#sec-call)(`state`.`[[ReplacerFunction]]`, `holder`, « `key`, `value` »).
4.  If `value` [is an Object](#sec-object-type), then
    1.  If `value` has a `[[NumberData]]` internal slot, then
        1.  Set `value` to ? [ToNumber](#sec-tonumber)(`value`).
    2.  Else if `value` has a `[[StringData]]` internal slot, then
        1.  Set `value` to ? [ToString](#sec-tostring)(`value`).
    3.  Else if `value` has a `[[BooleanData]]` internal slot, then
        1.  Set `value` to `value`.`[[BooleanData]]`.
    4.  Else if `value` has a `[[BigIntData]]` internal slot, then
        1.  Set `value` to `value`.`[[BigIntData]]`.
5.  If `value` is null, return "null".
6.  If `value` is true, return "true".
7.  If `value` is false, return "false".
8.  If `value` [is a String](#sec-ecmascript-language-types-string-type), return [QuoteJSONString](#sec-quotejsonstring)(`value`).
9.  If `value` [is a Number](#sec-ecmascript-language-types-number-type), then
    1.  If `value` is [finite](#finite), return ! [ToString](#sec-tostring)(`value`).
    2.  Return "null".
10. If `value` [is a BigInt](#sec-ecmascript-language-types-bigint-type), throw a TypeError exception.
11. If `value` [is an Object](#sec-object-type) and [IsCallable](#sec-iscallable)(`value`) is false, then
    1.  Let `isArray` be ? [IsArray](#sec-isarray)(`value`).
    2.  If `isArray` is true, return ? [SerializeJSONArray](#sec-serializejsonarray)(`state`, `value`).
    3.  Return ? [SerializeJSONObject](#sec-serializejsonobject)(`state`, `value`).
12. Return undefined.

#### 25.5.2.3 QuoteJSONString ( `value` )

The abstract operation QuoteJSONString takes argument `value` (a String) and returns a String. It wraps `value` in 0x0022 (QUOTATION MARK) code units and escapes certain other code units within it. This operation interprets `value` as a sequence of UTF-16 encoded code points, as described in [6.1.4](#sec-ecmascript-language-types-string-type). It performs the following steps when called:

1.  Let `product` be the String value consisting solely of the code unit 0x0022 (QUOTATION MARK).
2.  For each code point `C` of [StringToCodePoints](#sec-stringtocodepoints)(`value`), do
    1.  If `C` is listed in the “Code Point” column of [Table 79](#table-json-single-character-escapes), then
        1.  Set `product` to the [string-concatenation](#string-concatenation) of `product` and the escape sequence for `C` as specified in the “Escape Sequence” column of the corresponding row.
    2.  Else if `C` has a numeric value less than 0x0020 (SPACE) or `C` has the same numeric value as a [leading surrogate](#leading-surrogate) or [trailing surrogate](#trailing-surrogate), then
        1.  Let `unit` be the code unit whose numeric value is the numeric value of `C`.
        2.  Set `product` to the [string-concatenation](#string-concatenation) of `product` and [UnicodeEscape](#sec-unicodeescape)(`unit`).
    3.  Else,
        1.  Set `product` to the [string-concatenation](#string-concatenation) of `product` and [UTF16EncodeCodePoint](#sec-utf16encodecodepoint)(`C`).
3.  Set `product` to the [string-concatenation](#string-concatenation) of `product` and the code unit 0x0022 (QUOTATION MARK).
4.  Return `product`.

| Code Point | Unicode Character Name | Escape Sequence |
|------------|------------------------|-----------------|
| U+0008     | BACKSPACE              | `\b`            |
| U+0009     | CHARACTER TABULATION   | `\t`            |
| U+000A     | LINE FEED (LF)         | `\n`            |
| U+000C     | FORM FEED (FF)         | `\f`            |
| U+000D     | CARRIAGE RETURN (CR)   | `\r`            |
| U+0022     | QUOTATION MARK         | `\"`            |
| U+005C     | REVERSE SOLIDUS        | `\\`            |

Table 79: JSON Single Character Escape Sequences

#### 25.5.2.4 UnicodeEscape ( `C` )

The abstract operation UnicodeEscape takes argument `C` (a code unit) and returns a String. It represents `C` as a Unicode escape sequence. It performs the following steps when called:

1.  Let `n` be the numeric value of `C`.
2.  [Assert](#assert): `n` ≤ 0xFFFF.
3.  Let `hex` be the String representation of `n`, formatted as a lowercase hexadecimal number.
4.  Return the [string-concatenation](#string-concatenation) of the code unit 0x005C (REVERSE SOLIDUS), "u", and [StringPad](#sec-stringpad)(`hex`, 4, "0", start).

#### 25.5.2.5 SerializeJSONObject ( `state`, `value` )

The abstract operation SerializeJSONObject takes arguments `state` (a [JSON Serialization Record](#sec-json-serialization-record)) and `value` (an Object) and returns either a [normal completion containing](#sec-completion-record-specification-type) a String or a [throw completion](#sec-completion-record-specification-type). It serializes an object. It performs the following steps when called:

1.  If `state`.`[[Stack]]` contains `value`, throw a TypeError exception because the structure is cyclical.
2.  Append `value` to `state`.`[[Stack]]`.
3.  Let `stepBack` be `state`.`[[Indent]]`.
4.  Set `state`.`[[Indent]]` to the [string-concatenation](#string-concatenation) of `state`.`[[Indent]]` and `state`.`[[Gap]]`.
5.  If `state`.`[[PropertyList]]` is not undefined, then
    1.  Let `K` be `state`.`[[PropertyList]]`.
6.  Else,
    1.  Let `K` be ? [EnumerableOwnProperties](#sec-enumerableownproperties)(`value`, key).
7.  Let `partial` be a new empty [List](#sec-list-and-record-specification-type).
8.  For each element `P` of `K`, do
    1.  Let `strP` be ? [SerializeJSONProperty](#sec-serializejsonproperty)(`state`, `P`, `value`).
    2.  If `strP` is not undefined, then
        1.  Let `member` be [QuoteJSONString](#sec-quotejsonstring)(`P`).
        2.  Set `member` to the [string-concatenation](#string-concatenation) of `member` and ":".
        3.  If `state`.`[[Gap]]` is not the empty String, then
            1.  Set `member` to the [string-concatenation](#string-concatenation) of `member` and the code unit 0x0020 (SPACE).
        4.  Set `member` to the [string-concatenation](#string-concatenation) of `member` and `strP`.
        5.  Append `member` to `partial`.
9.  If `partial` is empty, then
    1.  Let `final` be "{}".
10. Else,
    1.  If `state`.`[[Gap]]` is the empty String, then
        1.  Let `properties` be the String value formed by concatenating all the element Strings of `partial` with each adjacent pair of Strings separated with the code unit 0x002C (COMMA). A comma is not inserted either before the first String or after the last String.
        2.  Let `final` be the [string-concatenation](#string-concatenation) of "{", `properties`, and "}".
    2.  Else,
        1.  Let `separator` be the [string-concatenation](#string-concatenation) of the code unit 0x002C (COMMA), the code unit 0x000A (LINE FEED), and `state`.`[[Indent]]`.
        2.  Let `properties` be the String value formed by concatenating all the element Strings of `partial` with each adjacent pair of Strings separated with `separator`. The `separator` String is not inserted either before the first String or after the last String.
        3.  Let `final` be the [string-concatenation](#string-concatenation) of "{", the code unit 0x000A (LINE FEED), `state`.`[[Indent]]`, `properties`, the code unit 0x000A (LINE FEED), `stepBack`, and "}".
11. Remove the last element of `state`.`[[Stack]]`.
12. Set `state`.`[[Indent]]` to `stepBack`.
13. Return `final`.

#### 25.5.2.6 SerializeJSONArray ( `state`, `value` )

The abstract operation SerializeJSONArray takes arguments `state` (a [JSON Serialization Record](#sec-json-serialization-record)) and `value` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a String or a [throw completion](#sec-completion-record-specification-type). It serializes an array. It performs the following steps when called:

1.  If `state`.`[[Stack]]` contains `value`, throw a TypeError exception because the structure is cyclical.
2.  Append `value` to `state`.`[[Stack]]`.
3.  Let `stepBack` be `state`.`[[Indent]]`.
4.  Set `state`.`[[Indent]]` to the [string-concatenation](#string-concatenation) of `state`.`[[Indent]]` and `state`.`[[Gap]]`.
5.  Let `partial` be a new empty [List](#sec-list-and-record-specification-type).
6.  Let `len` be ? [LengthOfArrayLike](#sec-lengthofarraylike)(`value`).
7.  Let `index` be 0.
8.  Repeat, while `index` \< `len`,
    1.  Let `strP` be ? [SerializeJSONProperty](#sec-serializejsonproperty)(`state`, ! [ToString](#sec-tostring)([𝔽](#𝔽)(`index`)), `value`).
    2.  If `strP` is undefined, then
        1.  Append "null" to `partial`.
    3.  Else,
        1.  Append `strP` to `partial`.
    4.  Set `index` to `index` + 1.
9.  If `partial` is empty, then
    1.  Let `final` be "\[\]".
10. Else,
    1.  If `state`.`[[Gap]]` is the empty String, then
        1.  Let `properties` be the String value formed by concatenating all the element Strings of `partial` with each adjacent pair of Strings separated with the code unit 0x002C (COMMA). A comma is not inserted either before the first String or after the last String.
        2.  Let `final` be the [string-concatenation](#string-concatenation) of "\[", `properties`, and "\]".
    2.  Else,
        1.  Let `separator` be the [string-concatenation](#string-concatenation) of the code unit 0x002C (COMMA), the code unit 0x000A (LINE FEED), and `state`.`[[Indent]]`.
        2.  Let `properties` be the String value formed by concatenating all the element Strings of `partial` with each adjacent pair of Strings separated with `separator`. The `separator` String is not inserted either before the first String or after the last String.
        3.  Let `final` be the [string-concatenation](#string-concatenation) of "\[", the code unit 0x000A (LINE FEED), `state`.`[[Indent]]`, `properties`, the code unit 0x000A (LINE FEED), `stepBack`, and "\]".
11. Remove the last element of `state`.`[[Stack]]`.
12. Set `state`.`[[Indent]]` to `stepBack`.
13. Return `final`.

Note

The representation of arrays includes only the elements in the [interval](#interval) from +0_(𝔽) (inclusive) to `array.length` (exclusive). Properties whose keys are not [array indices](#array-index) are excluded from the stringification. An array is stringified as an opening LEFT SQUARE BRACKET, elements separated by COMMA, and a closing RIGHT SQUARE BRACKET.

### 25.5.3 JSON \[ %Symbol.toStringTag% \]

The initial value of the [%Symbol.toStringTag%](#sec-well-known-symbols) property is the String value "JSON".

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: true }.
