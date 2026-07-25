# 29 Memory Model

The memory consistency model, or memory model, specifies the possible orderings of [Shared Data Block events](#sec-memory-model-fundamentals), arising via accessing [TypedArray](#typedarray) instances backed by a SharedArrayBuffer and via methods on the Atomics object. When the program has no data races (defined below), the ordering of events appears as sequentially consistent, i.e., as an interleaving of actions from each [agent](#agent). When the program has data races, shared memory operations may appear sequentially inconsistent. For example, programs may exhibit causality-violating behaviour and other astonishments. These astonishments arise from compiler transforms and the design of CPUs (e.g., out-of-order execution and speculation). The memory model defines both the precise conditions under which a program exhibits sequentially consistent behaviour as well as the possible values read from data races. To wit, there is no undefined behaviour.

The memory model is defined as relational constraints on events introduced by [abstract operations](#sec-algorithm-conventions-abstract-operations) on SharedArrayBuffer or by methods on the Atomics object during an evaluation.

Note

This section provides an axiomatic model on events introduced by the [abstract operations](#sec-algorithm-conventions-abstract-operations) on SharedArrayBuffers. It bears stressing that the model is not expressible algorithmically, unlike the rest of this specification. The nondeterministic introduction of events by [abstract operations](#sec-algorithm-conventions-abstract-operations) is the interface between the operational semantics of ECMAScript evaluation and the axiomatic semantics of the memory model. The semantics of these events is defined by considering graphs of all events in an evaluation. These are neither Static Semantics nor Runtime Semantics. There is no demonstrated algorithmic implementation, but instead a set of constraints that determine if a particular event graph is allowed or disallowed.

## 29.1 Memory Model Fundamentals

Shared memory accesses (reads and writes) are divided into two groups, atomic accesses and data accesses, defined below. Atomic accesses are sequentially consistent, i.e., there is a strict total ordering of events agreed upon by all [agents](#agent) in an [agent cluster](#sec-agent-clusters). Non-atomic accesses do not have a strict total ordering agreed upon by all [agents](#agent), i.e., unordered.

Note 1

No orderings weaker than sequentially consistent and stronger than unordered, such as release-acquire, are supported.

A Shared Data Block event is either a ReadSharedMemory, WriteSharedMemory, or ReadModifyWriteSharedMemory [Record](#sec-list-and-record-specification-type).

| Field Name | Value | Meaning |
|----|----|----|
| `[[Order]]` | seq-cst or unordered | The weakest ordering guaranteed by the [memory model](#sec-memory-model) for the event. |
| `[[NoTear]]` | a Boolean | Whether this event is allowed to read from multiple write events with equal range as this event. |
| `[[Block]]` | a [Shared Data Block](#sec-data-blocks) | The block the event operates on. |
| `[[ByteIndex]]` | a non-negative [integer](#integer) | The byte address of the read in `[[Block]]`. |
| `[[ElementSize]]` | a non-negative [integer](#integer) | The size of the read. |

Table 94: [ReadSharedMemory](#sec-memory-model-fundamentals) Event Fields

| Field Name | Value | Meaning |
|----|----|----|
| `[[Order]]` | seq-cst, unordered, or init | The weakest ordering guaranteed by the [memory model](#sec-memory-model) for the event. |
| `[[NoTear]]` | a Boolean | Whether this event is allowed to be read from multiple read events with equal range as this event. |
| `[[Block]]` | a [Shared Data Block](#sec-data-blocks) | The block the event operates on. |
| `[[ByteIndex]]` | a non-negative [integer](#integer) | The byte address of the write in `[[Block]]`. |
| `[[ElementSize]]` | a non-negative [integer](#integer) | The size of the write. |
| `[[Payload]]` | a [List](#sec-list-and-record-specification-type) of [byte values](#sec-data-blocks) | The [List](#sec-list-and-record-specification-type) of [byte values](#sec-data-blocks) to be read by other events. |

Table 95: [WriteSharedMemory](#sec-memory-model-fundamentals) Event Fields

| Field Name | Value | Meaning |
|----|----|----|
| `[[Order]]` | seq-cst | Read-modify-write events are always sequentially consistent. |
| `[[NoTear]]` | true | Read-modify-write events cannot tear. |
| `[[Block]]` | a [Shared Data Block](#sec-data-blocks) | The block the event operates on. |
| `[[ByteIndex]]` | a non-negative [integer](#integer) | The byte address of the read-modify-write in `[[Block]]`. |
| `[[ElementSize]]` | a non-negative [integer](#integer) | The size of the read-modify-write. |
| `[[Payload]]` | a [List](#sec-list-and-record-specification-type) of [byte values](#sec-data-blocks) | The [List](#sec-list-and-record-specification-type) of [byte values](#sec-data-blocks) to be passed to `[[ModifyOp]]`. |
| `[[ModifyOp]]` | a [read-modify-write modification function](#sec-arraybuffer-notation) | An abstract closure that returns a modified [List](#sec-list-and-record-specification-type) of [byte values](#sec-data-blocks) from a read [List](#sec-list-and-record-specification-type) of [byte values](#sec-data-blocks) and `[[Payload]]`. |

Table 96: [ReadModifyWriteSharedMemory](#sec-memory-model-fundamentals) Event Fields

These events are introduced by [abstract operations](#sec-algorithm-conventions-abstract-operations) or by methods on the Atomics object.

Some operations may also introduce Synchronize events. A Synchronize event has no fields, and exists purely to directly constrain the permitted orderings of other events.

In addition to [Shared Data Block](#sec-data-blocks) and Synchronize events, there are [host](#host)-specific events.

Let the range of a ReadSharedMemory, WriteSharedMemory, or ReadModifyWriteSharedMemory event be the Set of contiguous [integers](#integer) from its `[[ByteIndex]]` to `[[ByteIndex]]` + `[[ElementSize]]` - 1. Two events' ranges are equal when the events have the same `[[Block]]`, and the ranges are element-wise equal. Two events' ranges are overlapping when the events have the same `[[Block]]`, the ranges are not equal and their intersection is non-empty. Two events' ranges are disjoint when the events do not have the same `[[Block]]` or their ranges are neither equal nor overlapping.

Note 2

Examples of [host](#host)-specific synchronizing events that should be accounted for are: sending a SharedArrayBuffer from one [agent](#agent) to another (e.g., by `postMessage` in a browser), starting and stopping [agents](#agent), and communicating within the [agent cluster](#sec-agent-clusters) via channels other than shared memory. For a particular execution `execution`, those events are provided by the [host](#host) via the [host-synchronizes-with](#sec-host-synchronizes-with) [strict partial order](#sec-set-and-relation-specification-type). Additionally, [hosts](#host) can add [host](#host)-specific synchronizing events to `execution`.`[[EventList]]` so as to participate in the [is-agent-order-before](#sec-agent-order) [Relation](#sec-set-and-relation-specification-type).

Events are ordered within [candidate executions](#sec-candidate-executions) by the relations defined below.

## 29.2 Agent Events Records

An Agent Events Record is a [Record](#sec-list-and-record-specification-type) with the following fields.

| Field Name | Value | Meaning |
|----|----|----|
| `[[AgentSignifier]]` | an [agent signifier](#sec-agents) | The [agent](#agent) whose evaluation resulted in this ordering. |
| `[[EventList]]` | a [List](#sec-list-and-record-specification-type) of events | Events are appended to the list during evaluation. |
| `[[AgentSynchronizesWith]]` | a [List](#sec-list-and-record-specification-type) of pairs of [Synchronize events](#sec-memory-model-fundamentals) | [Synchronize](#sec-memory-model-fundamentals) relationships introduced by the operational semantics. |

Table 97: [Agent Events Record](#sec-agent-event-records) Fields

## 29.3 Chosen Value Records

A Chosen Value Record is a [Record](#sec-list-and-record-specification-type) with the following fields.

| Field Name | Value | Meaning |
|----|----|----|
| `[[Event]]` | a [Shared Data Block event](#sec-memory-model-fundamentals) | The [ReadSharedMemory](#sec-memory-model-fundamentals) or [ReadModifyWriteSharedMemory](#sec-memory-model-fundamentals) event that was introduced for this chosen value. |
| `[[ChosenValue]]` | a [List](#sec-list-and-record-specification-type) of [byte values](#sec-data-blocks) | The bytes that were nondeterministically chosen during evaluation. |

Table 98: [Chosen Value Record](#sec-chosen-value-records) Fields

## 29.4 Candidate Executions

A candidate execution of the evaluation of an [agent cluster](#sec-agent-clusters) is a [Record](#sec-list-and-record-specification-type) with the following fields.

| Field Name | Value | Meaning |
|----|----|----|
| `[[EventsRecords]]` | a [List](#sec-list-and-record-specification-type) of [Agent Events Records](#sec-agent-event-records) | Maps an [agent](#agent) to [Lists](#sec-list-and-record-specification-type) of events appended during the evaluation. |
| `[[ChosenValues]]` | a [List](#sec-list-and-record-specification-type) of [Chosen Value Records](#sec-chosen-value-records) | Maps [ReadSharedMemory](#sec-memory-model-fundamentals) or [ReadModifyWriteSharedMemory](#sec-memory-model-fundamentals) events to the [List](#sec-list-and-record-specification-type) of [byte values](#sec-data-blocks) chosen during the evaluation. |

Table 99: Candidate Execution [Record](#sec-list-and-record-specification-type) Fields

An empty candidate execution is a candidate execution [Record](#sec-list-and-record-specification-type) whose fields are empty [Lists](#sec-list-and-record-specification-type).

## 29.5 Abstract Operations for the Memory Model

### 29.5.1 EventSet ( `execution` )

The abstract operation EventSet takes argument `execution` (a [candidate execution](#sec-candidate-executions)) and returns a Set of events. It performs the following steps when called:

1.  Let `events` be an empty Set.
2.  For each [Agent Events Record](#sec-agent-event-records) `aer` of `execution`.`[[EventsRecords]]`, do
    1.  For each event `E` of `aer`.`[[EventList]]`, do
        1.  Add `E` to `events`.
3.  Return `events`.

### 29.5.2 SharedDataBlockEventSet ( `execution` )

The abstract operation SharedDataBlockEventSet takes argument `execution` (a [candidate execution](#sec-candidate-executions)) and returns a Set of events. It performs the following steps when called:

1.  Let `events` be an empty Set.
2.  For each event `E` of [EventSet](#sec-event-set)(`execution`), do
    1.  If `E` is a [ReadSharedMemory](#sec-memory-model-fundamentals), [WriteSharedMemory](#sec-memory-model-fundamentals), or [ReadModifyWriteSharedMemory](#sec-memory-model-fundamentals) event, add `E` to `events`.
3.  Return `events`.

### 29.5.3 HostEventSet ( `execution` )

The abstract operation HostEventSet takes argument `execution` (a [candidate execution](#sec-candidate-executions)) and returns a Set of events. It performs the following steps when called:

1.  Let `events` be an empty Set.
2.  For each event `E` of [EventSet](#sec-event-set)(`execution`), do
    1.  If `E` is not in [SharedDataBlockEventSet](#sec-sharedatablockeventset)(`execution`), add `E` to `events`.
3.  Return `events`.

### 29.5.4 ComposeWriteEventBytes ( `execution`, `byteIndex`, `Ws` )

The abstract operation ComposeWriteEventBytes takes arguments `execution` (a [candidate execution](#sec-candidate-executions)), `byteIndex` (a non-negative [integer](#integer)), and `Ws` (a [List](#sec-list-and-record-specification-type) of either [WriteSharedMemory](#sec-memory-model-fundamentals) or [ReadModifyWriteSharedMemory](#sec-memory-model-fundamentals) events) and returns a [List](#sec-list-and-record-specification-type) of [byte values](#sec-data-blocks). It performs the following steps when called:

1.  Let `byteLocation` be `byteIndex`.
2.  Let `bytesRead` be a new empty [List](#sec-list-and-record-specification-type).
3.  For each element `W` of `Ws`, do
    1.  [Assert](#assert): `W` has `byteLocation` in its range.
    2.  Let `payloadIndex` be `byteLocation` - `W`.`[[ByteIndex]]`.
    3.  If `W` is a [WriteSharedMemory](#sec-memory-model-fundamentals) event, then
        1.  Let `byte` be `W`.`[[Payload]]`\[`payloadIndex`\].
    4.  Else,
        1.  [Assert](#assert): `W` is a [ReadModifyWriteSharedMemory](#sec-memory-model-fundamentals) event.
        2.  Let `bytes` be [ValueOfReadEvent](#sec-valueofreadevent)(`execution`, `W`).
        3.  Let `bytesModified` be `W`.`[[ModifyOp]]`(`bytes`, `W`.`[[Payload]]`).
        4.  Let `byte` be `bytesModified`\[`payloadIndex`\].
    5.  Append `byte` to `bytesRead`.
    6.  Set `byteLocation` to `byteLocation` + 1.
4.  Return `bytesRead`.

Note 1

The read-modify-write modification `[[ModifyOp]]` is given by the function properties on the Atomics object that introduce [ReadModifyWriteSharedMemory](#sec-memory-model-fundamentals) events.

Note 2

This abstract operation composes a [List](#sec-list-and-record-specification-type) of write events into a [List](#sec-list-and-record-specification-type) of [byte values](#sec-data-blocks). It is used in the event semantics of [ReadSharedMemory](#sec-memory-model-fundamentals) and [ReadModifyWriteSharedMemory](#sec-memory-model-fundamentals) events.

### 29.5.5 ValueOfReadEvent ( `execution`, `R` )

The abstract operation ValueOfReadEvent takes arguments `execution` (a [candidate execution](#sec-candidate-executions)) and `R` (a [ReadSharedMemory](#sec-memory-model-fundamentals) or [ReadModifyWriteSharedMemory](#sec-memory-model-fundamentals) event) and returns a [List](#sec-list-and-record-specification-type) of [byte values](#sec-data-blocks). It performs the following steps when called:

1.  Let `Ws` be [reads-bytes-from](#sec-reads-bytes-from)(`R`) in `execution`.
2.  [Assert](#assert): `Ws` is a [List](#sec-list-and-record-specification-type) of [WriteSharedMemory](#sec-memory-model-fundamentals) or [ReadModifyWriteSharedMemory](#sec-memory-model-fundamentals) events with length equal to `R`.`[[ElementSize]]`.
3.  Return [ComposeWriteEventBytes](#sec-composewriteeventbytes)(`execution`, `R`.`[[ByteIndex]]`, `Ws`).

## 29.6 Relations of Candidate Executions

The following relations and mathematical functions are parameterized over a particular [candidate execution](#sec-candidate-executions) and order its events.

### 29.6.1 is-agent-order-before

For a [candidate execution](#sec-candidate-executions) `execution`, its is-agent-order-before [Relation](#sec-set-and-relation-specification-type) is the [least Relation](#least-relation) on events that satisfies the following.

- For events `E` and `D`, `E` is-agent-order-before `D` in `execution` if there is some [Agent Events Record](#sec-agent-event-records) `aer` in `execution`.`[[EventsRecords]]` such that `aer`.`[[EventList]]` contains both `E` and `D` and `E` is before `D` in [List](#sec-list-and-record-specification-type) order of `aer`.`[[EventList]]`.

Note

Each [agent](#agent) introduces events in a per-[agent](#agent) [strict total order](#sec-set-and-relation-specification-type) during the evaluation. This is the union of those [strict total orders](#sec-set-and-relation-specification-type).

### 29.6.2 reads-bytes-from

For a [candidate execution](#sec-candidate-executions) `execution`, its *reads-bytes-from* function is a mathematical function mapping events in [SharedDataBlockEventSet](#sec-sharedatablockeventset)(`execution`) to [Lists](#sec-list-and-record-specification-type) of events in [SharedDataBlockEventSet](#sec-sharedatablockeventset)(`execution`) that satisfies the following conditions.

- For each [ReadSharedMemory](#sec-memory-model-fundamentals) or [ReadModifyWriteSharedMemory](#sec-memory-model-fundamentals) event `R` in [SharedDataBlockEventSet](#sec-sharedatablockeventset)(`execution`), reads-bytes-from(`R`) in `execution` is a [List](#sec-list-and-record-specification-type) of length `R`.`[[ElementSize]]` whose elements are [WriteSharedMemory](#sec-memory-model-fundamentals) or [ReadModifyWriteSharedMemory](#sec-memory-model-fundamentals) events `Ws` such that all of the following are true.

  - Each event `W` with index `i` in `Ws` has `R`.`[[ByteIndex]]` + `i` in its range.
  - `R` is not in `Ws`.

A [candidate execution](#sec-candidate-executions) always admits a reads-bytes-from function.

### 29.6.3 reads-from

For a [candidate execution](#sec-candidate-executions) `execution`, its reads-from [Relation](#sec-set-and-relation-specification-type) is the [least Relation](#least-relation) on events that satisfies the following.

- For events `R` and `W`, `R` reads-from `W` in `execution` if [SharedDataBlockEventSet](#sec-sharedatablockeventset)(`execution`) contains both `R` and `W`, and [reads-bytes-from](#sec-reads-bytes-from)(`R`) in `execution` contains `W`.

### 29.6.4 host-synchronizes-with

For a [candidate execution](#sec-candidate-executions) `execution`, its host-synchronizes-with [Relation](#sec-set-and-relation-specification-type) is a [host](#host)-provided [strict partial order](#sec-set-and-relation-specification-type) on [host](#host)-specific events that satisfies at least the following.

- If `E` host-synchronizes-with `D` in `execution`, [HostEventSet](#sec-hosteventset)(`execution`) contains `E` and `D`.
- There is no cycle in the union of host-synchronizes-with and [is-agent-order-before](#sec-agent-order) in `execution`.

Note 1

For two [host](#host)-specific events `E` and `D` in a [candidate execution](#sec-candidate-executions) `execution`, `E` host-synchronizes-with `D` in `execution` implies `E` [happens-before](#sec-happens-before) `D` in `execution`.

Note 2

This [Relation](#sec-set-and-relation-specification-type) allows the [host](#host) to provide additional synchronization mechanisms, such as `postMessage` between HTML workers.

### 29.6.5 synchronizes-with

For a [candidate execution](#sec-candidate-executions) `execution`, its synchronizes-with [Relation](#sec-set-and-relation-specification-type) is the [least Relation](#least-relation) on events that satisfies the following.

- For events `R` and `W`, `W` synchronizes-with `R` in `execution` if `R` [reads-from](#sec-reads-from) `W` in `execution`, `R`.`[[Order]]` is seq-cst, `W`.`[[Order]]` is seq-cst, and `R` and `W` have equal ranges.
- For each element `eventsRecord` of `execution`.`[[EventsRecords]]`, the following is true.
  - For events `S` and `Sw`, `S` synchronizes-with `Sw` in `execution` if `eventsRecord`.`[[AgentSynchronizesWith]]` contains (`S`, `Sw`).
- For events `E` and `D`, `E` synchronizes-with `D` in `execution` if `execution`.`[[HostSynchronizesWith]]` contains (`E`, `D`).

Note 1

Owing to convention in [memory model](#sec-memory-model) literature, in a [candidate execution](#sec-candidate-executions) `execution`, write events synchronizes-with read events, instead of read events synchronizes-with write events.

Note 2

In a [candidate execution](#sec-candidate-executions) `execution`, init events do not participate in this [Relation](#sec-set-and-relation-specification-type) and are instead constrained directly by [happens-before](#sec-happens-before).

Note 3

In a [candidate execution](#sec-candidate-executions) `execution`, not all seq-cst events related by [reads-from](#sec-reads-from) are related by synchronizes-with. Only events that also have equal ranges are related by synchronizes-with.

Note 4

For [Shared Data Block events](#sec-memory-model-fundamentals) `R` and `W` in a [candidate execution](#sec-candidate-executions) `execution` such that `W` synchronizes-with `R`, `R` may [reads-from](#sec-reads-from) other writes than `W`.

### 29.6.6 happens-before

For a [candidate execution](#sec-candidate-executions) `execution`, its happens-before [Relation](#sec-set-and-relation-specification-type) is the [least Relation](#least-relation) on events that satisfies the following.

- For events `E` and `D`, `E` happens-before `D` in `execution` if any of the following conditions are true.

  - `E` [is-agent-order-before](#sec-agent-order) `D` in `execution`.
  - `E` [synchronizes-with](#sec-synchronizes-with) `D` in `execution`.
  - [SharedDataBlockEventSet](#sec-sharedatablockeventset)(`execution`) contains both `E` and `D`, `E`.`[[Order]]` is init, and `E` and `D` have overlapping ranges.
  - There is an event `F` such that `E` happens-before `F` and `F` happens-before `D` in `execution`.

Note

Because happens-before is a superset of [agent](#agent)-order, a [candidate execution](#sec-candidate-executions) is consistent with the single-thread evaluation semantics of ECMAScript.

## 29.7 Properties of Valid Executions

### 29.7.1 Valid Chosen Reads

A [candidate execution](#sec-candidate-executions) `execution` has valid chosen reads if the following algorithm returns true.

1.  For each [ReadSharedMemory](#sec-memory-model-fundamentals) or [ReadModifyWriteSharedMemory](#sec-memory-model-fundamentals) event `R` of [SharedDataBlockEventSet](#sec-sharedatablockeventset)(`execution`), do
    1.  Let `chosenValueRecord` be the element of `execution`.`[[ChosenValues]]` whose `[[Event]]` field is `R`.
    2.  Let `chosenValue` be `chosenValueRecord`.`[[ChosenValue]]`.
    3.  Let `readValue` be [ValueOfReadEvent](#sec-valueofreadevent)(`execution`, `R`).
    4.  Let `chosenLen` be the number of elements in `chosenValue`.
    5.  Let `readLen` be the number of elements in `readValue`.
    6.  If `chosenLen` ≠ `readLen`, then
        1.  Return false.
    7.  If `chosenValue`\[`i`\] ≠ `readValue`\[`i`\] for some [integer](#integer) `i` in the [interval](#interval) from 0 (inclusive) to `chosenLen` (exclusive), then
        1.  Return false.
2.  Return true.

### 29.7.2 Coherent Reads

A [candidate execution](#sec-candidate-executions) `execution` has coherent reads if the following algorithm returns true.

1.  For each [ReadSharedMemory](#sec-memory-model-fundamentals) or [ReadModifyWriteSharedMemory](#sec-memory-model-fundamentals) event `R` of [SharedDataBlockEventSet](#sec-sharedatablockeventset)(`execution`), do
    1.  Let `Ws` be [reads-bytes-from](#sec-reads-bytes-from)(`R`) in `execution`.
    2.  Let `byteLocation` be `R`.`[[ByteIndex]]`.
    3.  For each element `W` of `Ws`, do
        1.  If `R` [happens-before](#sec-happens-before) `W` in `execution`, then
            1.  Return false.
        2.  If there exists a [WriteSharedMemory](#sec-memory-model-fundamentals) or [ReadModifyWriteSharedMemory](#sec-memory-model-fundamentals) event `V` that has `byteLocation` in its range such that `W` [happens-before](#sec-happens-before) `V` in `execution` and `V` [happens-before](#sec-happens-before) `R` in `execution`, then
            1.  Return false.
        3.  Set `byteLocation` to `byteLocation` + 1.
2.  Return true.

### 29.7.3 Tear Free Reads

A [candidate execution](#sec-candidate-executions) `execution` has tear free reads if the following algorithm returns true.

1.  For each [ReadSharedMemory](#sec-memory-model-fundamentals) or [ReadModifyWriteSharedMemory](#sec-memory-model-fundamentals) event `R` of [SharedDataBlockEventSet](#sec-sharedatablockeventset)(`execution`), do
    1.  If `R`.`[[NoTear]]` is true, then
        1.  [Assert](#assert): The remainder of dividing `R`.`[[ByteIndex]]` by `R`.`[[ElementSize]]` is 0.
        2.  For each event `W` such that `R` [reads-from](#sec-reads-from) `W` in `execution` and `W`.`[[NoTear]]` is true, do
            1.  If `R` and `W` have equal ranges and there exists an event `V` such that `V` and `W` have equal ranges, `V`.`[[NoTear]]` is true, `W` and `V` are not the same [Shared Data Block event](#sec-memory-model-fundamentals), and `R` [reads-from](#sec-reads-from) `V` in `execution`, then
                1.  Return false.
2.  Return true.

Note

An event's `[[NoTear]]` field is true when that event was introduced via accessing an [integer](#integer) [TypedArray](#typedarray), and false when introduced via accessing a floating point [TypedArray](#typedarray) or DataView.

Intuitively, this requirement says when a memory range is accessed in an aligned fashion via an [integer](#integer) [TypedArray](#typedarray), a single write event on that range must "win" when in a [data race](#sec-data-races) with other write events with equal ranges. More precisely, this requirement says an aligned read event cannot read a value composed of bytes from multiple, different write events all with equal ranges. It is possible, however, for an aligned read event to read from multiple write events with overlapping ranges.

### 29.7.4 Sequentially Consistent Atomics

For a [candidate execution](#sec-candidate-executions) `execution`, is-memory-order-before is a [strict total order](#sec-set-and-relation-specification-type) of all events in [EventSet](#sec-event-set)(`execution`) that satisfies the following.

- For events `E` and `D`, `E` is-memory-order-before `D` in `execution` if `E` [happens-before](#sec-happens-before) `D` in `execution`.

- For events `R` and `W` such that `R` [reads-from](#sec-reads-from) `W` in `execution`, there is no [WriteSharedMemory](#sec-memory-model-fundamentals) or [ReadModifyWriteSharedMemory](#sec-memory-model-fundamentals) event `V` in [SharedDataBlockEventSet](#sec-sharedatablockeventset)(`execution`) such that `V`.`[[Order]]` is seq-cst, `W` is-memory-order-before `V` in `execution`, `V` is-memory-order-before `R` in `execution`, and any of the following conditions are true.

  - `W` [synchronizes-with](#sec-synchronizes-with) `R` in `execution`, and `V` and `R` have equal ranges.
  - `W` [happens-before](#sec-happens-before) `R` and `V` [happens-before](#sec-happens-before) `R` in `execution`, `W`.`[[Order]]` is seq-cst, and `W` and `V` have equal ranges.
  - `W` [happens-before](#sec-happens-before) `R` and `W` [happens-before](#sec-happens-before) `V` in `execution`, `R`.`[[Order]]` is seq-cst, and `V` and `R` have equal ranges.

  Note 1

  This clause additionally constrains seq-cst events on equal ranges.

- For each [WriteSharedMemory](#sec-memory-model-fundamentals) or [ReadModifyWriteSharedMemory](#sec-memory-model-fundamentals) event `W` in [SharedDataBlockEventSet](#sec-sharedatablockeventset)(`execution`), if `W`.`[[Order]]` is seq-cst, then it is not the case that there is an infinite number of [ReadSharedMemory](#sec-memory-model-fundamentals) or [ReadModifyWriteSharedMemory](#sec-memory-model-fundamentals) events in [SharedDataBlockEventSet](#sec-sharedatablockeventset)(`execution`) with equal range that is memory-order before `W`.

  Note 2

  This clause together with the forward progress guarantee on [agents](#agent) ensure the liveness condition that seq-cst writes become visible to seq-cst reads with equal range in [finite](#finite) time.

A [candidate execution](#sec-candidate-executions) has sequentially consistent atomics if it admits an is-memory-order-before [Relation](#sec-set-and-relation-specification-type).

Note 3

While is-memory-order-before includes all events in [EventSet](#sec-event-set)(`execution`), those that are not constrained by [happens-before](#sec-happens-before) or [synchronizes-with](#sec-synchronizes-with) in `execution` are allowed to occur anywhere in the order.

### 29.7.5 Valid Executions

A [candidate execution](#sec-candidate-executions) `execution` is a valid execution (or simply an execution) if all of the following are true.

- The [host](#host) provides a [host-synchronizes-with](#sec-host-synchronizes-with) [Relation](#sec-set-and-relation-specification-type) for `execution`.
- `execution` admits a [happens-before](#sec-happens-before) [Relation](#sec-set-and-relation-specification-type) that is a [strict partial order](#sec-set-and-relation-specification-type).
- `execution` has valid chosen reads.
- `execution` has coherent reads.
- `execution` has tear free reads.
- `execution` has sequentially consistent atomics.

All programs have at least one valid execution.

## 29.8 Races

For an execution `execution` and events `E` and `D` that are contained in [SharedDataBlockEventSet](#sec-sharedatablockeventset)(`execution`), `E` and `D` are in a *race* if the following algorithm returns true.

1.  If `E` and `D` are not the same [Shared Data Block event](#sec-memory-model-fundamentals), then
    1.  If it is not the case that both `E` [happens-before](#sec-happens-before) `D` in `execution` and `D` [happens-before](#sec-happens-before) `E` in `execution`, then
        1.  If `E` and `D` are both [WriteSharedMemory](#sec-memory-model-fundamentals) or [ReadModifyWriteSharedMemory](#sec-memory-model-fundamentals) events and `E` and `D` do not have disjoint ranges, then
            1.  Return true.
        2.  If `E` [reads-from](#sec-reads-from) `D` in `execution` or `D` [reads-from](#sec-reads-from) `E` in `execution`, then
            1.  Return true.
2.  Return false.

## 29.9 Data Races

For an execution `execution` and events `E` and `D` that are contained in [SharedDataBlockEventSet](#sec-sharedatablockeventset)(`execution`), `E` and `D` are in a data race if the following algorithm returns true.

1.  If `E` and `D` are in a [race](#sec-races) in `execution`, then
    1.  If `E`.`[[Order]]` is not seq-cst or `D`.`[[Order]]` is not seq-cst, then
        1.  Return true.
    2.  If `E` and `D` have overlapping ranges, then
        1.  Return true.
2.  Return false.

## 29.10 Data Race Freedom

An execution `execution` is data race free if there are no two events in [SharedDataBlockEventSet](#sec-sharedatablockeventset)(`execution`) that are in a [data race](#sec-data-races).

A program is data race free if all its executions are data race free.

The [memory model](#sec-memory-model) guarantees sequential consistency of all events for data race free programs.

## 29.11 Shared Memory Guidelines

Note 1

The following are guidelines for ECMAScript programmers working with shared memory.

We recommend programs be kept [data race free](#sec-data-race-freedom), i.e., make it so that it is impossible for there to be concurrent non-atomic operations on the same memory location. [Data race free](#sec-data-race-freedom) programs have interleaving semantics where each step in the evaluation semantics of each [agent](#agent) are interleaved with each other. For [data race free](#sec-data-race-freedom) programs, it is not necessary to understand the details of the [memory model](#sec-memory-model). The details are unlikely to build intuition that will help one to better write ECMAScript.

More generally, even if a program is not [data race free](#sec-data-race-freedom) it may have predictable behaviour, so long as atomic operations are not involved in any data races and the operations that race all have the same access size. The simplest way to arrange for atomics not to be involved in races is to ensure that different memory cells are used by atomic and non-atomic operations and that atomic accesses of different sizes are not used to access the same cells at the same time. Effectively, the program should treat shared memory as strongly typed as much as possible. One still cannot depend on the ordering and timing of non-atomic accesses that race, but if memory is treated as strongly typed the racing accesses will not "tear" (bits of their values will not be mixed).

Note 2

The following are guidelines for ECMAScript implementers writing compiler transformations for programs using shared memory.

It is desirable to allow most program transformations that are valid in a single-[agent](#agent) setting in a multi-[agent](#agent) setting, to ensure that the performance of each [agent](#agent) in a multi-[agent](#agent) program is as good as it would be in a single-[agent](#agent) setting. Frequently these transformations are hard to judge. We outline some rules about program transformations that are intended to be taken as normative (in that they are implied by the [memory model](#sec-memory-model) or stronger than what the [memory model](#sec-memory-model) implies) but which are likely not exhaustive. These rules are intended to apply to program transformations that precede the introductions of the events that make up the [is-agent-order-before](#sec-agent-order) [Relation](#sec-set-and-relation-specification-type).

Let an agent-order slice be the subset of the [is-agent-order-before](#sec-agent-order) [Relation](#sec-set-and-relation-specification-type) pertaining to a single [agent](#agent).

Let possible read values of a read event be the set of all values of [ValueOfReadEvent](#sec-valueofreadevent) for that event across all valid executions.

Any transformation of an agent-order slice that is valid in the absence of shared memory is valid in the presence of shared memory, with the following exceptions.

- *Atomics are carved in stone*: Program transformations must not cause the seq-cst events in an agent-order slice to be reordered with its unordered operations, nor its seq-cst operations to be reordered with each other, nor may a program transformation remove a seq-cst operation from the [is-agent-order-before](#sec-agent-order) [Relation](#sec-set-and-relation-specification-type).

  (In practice, the prohibition on reorderings forces a compiler to assume that every seq-cst operation is a synchronization and included in the final [is-memory-order-before](#sec-memory-order) [Relation](#sec-set-and-relation-specification-type), which it would usually have to assume anyway in the absence of inter-[agent](#agent) program analysis. It also forces the compiler to assume that every call where the callee's effects on the memory-order are unknown may contain seq-cst operations.)

- *Reads must be stable*: Any given shared memory read must only observe a single value in an execution.

  (For example, if what is semantically a single read in the program is executed multiple times then the program is subsequently allowed to observe only one of the values read. A transformation known as rematerialization can violate this rule.)

- *Writes must be stable*: All observable writes to shared memory must follow from program semantics in an execution.

  (For example, a transformation may not introduce certain observable writes, such as by using read-modify-write operations on a larger location to write a smaller datum, writing a value to memory that the program could not have written, or writing a just-read value back to the location it was read from, if that location could have been overwritten by another [agent](#agent) after the read.)

- *Possible read values must be non-empty*: Program transformations cannot cause the possible read values of a shared memory read to become empty.

  (Counterintuitively, this rule in effect restricts transformations on writes, because writes have force in [memory model](#sec-memory-model) insofar as to be read by read events. For example, writes may be moved and coalesced and sometimes reordered between two seq-cst operations, but the transformation may not remove every write that updates a location; some write must be preserved.)

Examples of transformations that remain valid are: merging multiple non-atomic reads from the same location, reordering non-atomic reads, introducing speculative non-atomic reads, merging multiple non-atomic writes to the same location, reordering non-atomic writes to different locations, and hoisting non-atomic reads out of loops even if that affects termination. Note in general that aliased [TypedArrays](#typedarray) make it hard to prove that locations are different.

Note 3

The following are guidelines for ECMAScript implementers generating machine code for shared memory accesses.

For architectures with memory models no weaker than those of ARM or Power, non-atomic stores and loads may be compiled to bare stores and loads on the target architecture. Atomic stores and loads may be compiled down to instructions that guarantee sequential consistency. If no such instructions exist, memory barriers are to be employed, such as placing barriers on both sides of a bare store or load. Read-modify-write operations may be compiled to read-modify-write instructions on the target architecture, such as `LOCK`- prefixed instructions on x86, load-exclusive/store-exclusive instructions on ARM, and load-link/store-conditional instructions on Power.

Specifically, the [memory model](#sec-memory-model) is intended to allow code generation as follows.

- Every atomic operation in the program is assumed to be necessary.
- Atomic operations are never rearranged with each other or with non-atomic operations.
- Functions are always assumed to perform atomic operations.
- Atomic operations are never implemented as read-modify-write operations on larger data, but as non-lock-free atomics if the platform does not have atomic operations of the appropriate size. (We already assume that every platform has normal memory access operations of every interesting size.)

Naive code generation uses these patterns:

- Regular loads and stores compile to single load and store instructions.
- Lock-free atomic loads and stores compile to a full (sequentially consistent) fence, a regular load or store, and a full fence.
- Lock-free atomic read-modify-write accesses compile to a full fence, an atomic read-modify-write instruction sequence, and a full fence.
- Non-lock-free atomics compile to a spinlock acquire, a full fence, a series of non-atomic load and store instructions, a full fence, and a spinlock release.

That mapping is correct so long as an atomic operation on an address range does not race with a non-atomic write or with an atomic operation of different size. However, that is all we need: the [memory model](#sec-memory-model) effectively demotes the atomic operations involved in a race to non-atomic status. On the other hand, the naive mapping is quite strong: it allows atomic operations to be used as sequentially consistent fences, which the [memory model](#sec-memory-model) does not actually guarantee.

Local improvements to those basic patterns are also allowed, subject to the constraints of the [memory model](#sec-memory-model). For example:

- There are obvious platform-dependent improvements that remove redundant fences. For example, on x86 the fences around lock-free atomic loads and stores can always be omitted except for the fence following a store, and no fence is needed for lock-free read-modify-write instructions, as these all use `LOCK`- prefixed instructions. On many platforms there are fences of several strengths, and weaker fences can be used in certain contexts without destroying sequential consistency.
- Most modern platforms support lock-free atomics for all the data sizes required by ECMAScript atomics. Should non-lock-free atomics be needed, the fences surrounding the body of the atomic operation can usually be folded into the lock and unlock steps. The simplest solution for non-lock-free atomics is to have a single lock word per SharedArrayBuffer.
- There are also more complicated platform-dependent local improvements, requiring some code analysis. For example, two back-to-back fences often have the same effect as a single fence, so if code is generated for two atomic operations in sequence, only a single fence need separate them. On x86, even a single fence separating atomic stores can be omitted, as the fence following a store is only needed to separate the store from a subsequent load.
