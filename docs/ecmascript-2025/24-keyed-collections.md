# 24 Keyed Collections

## 24.1 Map Objects

Maps are collections of key/value pairs where both the keys and values may be arbitrary [ECMAScript language values](#sec-ecmascript-language-types). A distinct key value may only occur in one key/value pair within the Map's collection. Distinct key values are discriminated using the semantics of the [SameValueZero](#sec-samevaluezero) comparison algorithm.

Maps must be implemented using either hash tables or other mechanisms that, on average, provide access times that are sublinear on the number of elements in the collection. The data structure used in this specification is only intended to describe the required observable semantics of Maps. It is not intended to be a viable implementation model.

### 24.1.1 The Map Constructor

The Map [constructor](#constructor):

- is %Map%.
- is the initial value of the "Map" property of the [global object](#sec-global-object).
- creates and initializes a new Map when called as a [constructor](#constructor).
- is not intended to be called as a function and will throw an exception when called in that manner.
- may be used as the value in an `extends` clause of a class definition. Subclass [constructors](#constructor) that intend to inherit the specified Map behaviour must include a `super` call to the Map [constructor](#constructor) to create and initialize the subclass instance with the internal state necessary to support the `Map.prototype` built-in methods.

#### 24.1.1.1 Map ( \[ `iterable` \] )

This function performs the following steps when called:

1.  If NewTarget is undefined, throw a TypeError exception.
2.  Let `map` be ? [OrdinaryCreateFromConstructor](#sec-ordinarycreatefromconstructor)(NewTarget, "%Map.prototype%", « `[[MapData]]` »).
3.  Set `map`.`[[MapData]]` to a new empty [List](#sec-list-and-record-specification-type).
4.  If `iterable` is either undefined or null, return `map`.
5.  Let `adder` be ? [Get](#sec-get-o-p)(`map`, "set").
6.  If [IsCallable](#sec-iscallable)(`adder`) is false, throw a TypeError exception.
7.  Return ? [AddEntriesFromIterable](#sec-add-entries-from-iterable)(`map`, `iterable`, `adder`).

Note

If the parameter `iterable` is present, it is expected to be an object that implements a [%Symbol.iterator%](#sec-well-known-symbols) method that returns an [iterator object](#sec-iterator-interface) that produces a two element [array-like object](#sec-lengthofarraylike) whose first element is a value that will be used as a Map key and whose second element is the value to associate with that key.

#### 24.1.1.2 AddEntriesFromIterable ( `target`, `iterable`, `adder` )

The abstract operation AddEntriesFromIterable takes arguments `target` (an Object), `iterable` (an [ECMAScript language value](#sec-ecmascript-language-types), but not undefined or null), and `adder` (a [function object](#function-object)) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [ECMAScript language value](#sec-ecmascript-language-types) or a [throw completion](#sec-completion-record-specification-type). `adder` will be invoked, with `target` as the receiver. It performs the following steps when called:

1.  Let `iteratorRecord` be ? [GetIterator](#sec-getiterator)(`iterable`, sync).
2.  Repeat,
    1.  Let `next` be ? [IteratorStepValue](#sec-iteratorstepvalue)(`iteratorRecord`).
    2.  If `next` is done, return `target`.
    3.  If `next` [is not an Object](#sec-object-type), then
        1.  Let `error` be [ThrowCompletion](#sec-throwcompletion)(a newly created TypeError object).
        2.  Return ? [IteratorClose](#sec-iteratorclose)(`iteratorRecord`, `error`).
    4.  Let `k` be [Completion](#sec-completion-ao)([Get](#sec-get-o-p)(`next`, "0")).
    5.  [IfAbruptCloseIterator](#sec-ifabruptcloseiterator)(`k`, `iteratorRecord`).
    6.  Let `v` be [Completion](#sec-completion-ao)([Get](#sec-get-o-p)(`next`, "1")).
    7.  [IfAbruptCloseIterator](#sec-ifabruptcloseiterator)(`v`, `iteratorRecord`).
    8.  Let `status` be [Completion](#sec-completion-ao)([Call](#sec-call)(`adder`, `target`, « `k`, `v` »)).
    9.  [IfAbruptCloseIterator](#sec-ifabruptcloseiterator)(`status`, `iteratorRecord`).

Note

The parameter `iterable` is expected to be an object that implements a [%Symbol.iterator%](#sec-well-known-symbols) method that returns an [iterator object](#sec-iterator-interface) that produces a two element [array-like object](#sec-lengthofarraylike) whose first element is a value that will be used as a Map key and whose second element is the value to associate with that key.

### 24.1.2 Properties of the Map Constructor

The Map [constructor](#constructor):

- has a `[[Prototype]]` internal slot whose value is [%Function.prototype%](#sec-properties-of-the-function-prototype-object).
- has the following properties:

#### 24.1.2.1 Map.groupBy ( `items`, `callback` )

Note

`callback` should be a function that accepts two arguments. `groupBy` calls `callback` once for each element in `items`, in ascending order, and constructs a new Map. Each value returned by `callback` is used as a key in the Map. For each such key, the result Map has an entry whose key is that key and whose value is an array containing all the elements for which `callback` returned that key.

`callback` is called with two arguments: the value of the element and the index of the element.

The return value of `groupBy` is a Map.

This function performs the following steps when called:

1.  Let `groups` be ? [GroupBy](#sec-groupby)(`items`, `callback`, collection).
2.  Let `map` be ! [Construct](#sec-construct)([%Map%](#sec-map-constructor)).
3.  For each [Record](#sec-list-and-record-specification-type) { `[[Key]]`, `[[Elements]]` } `g` of `groups`, do
    1.  Let `elements` be [CreateArrayFromList](#sec-createarrayfromlist)(`g`.`[[Elements]]`).
    2.  Let `entry` be the [Record](#sec-list-and-record-specification-type) { `[[Key]]`: `g`.`[[Key]]`, `[[Value]]`: `elements` }.
    3.  Append `entry` to `map`.`[[MapData]]`.
4.  Return `map`.

#### 24.1.2.2 Map.prototype

The initial value of `Map.prototype` is the [Map prototype object](#sec-properties-of-the-map-prototype-object).

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

#### 24.1.2.3 get Map \[ %Symbol.species% \]

`Map[%Symbol.species%]` is an [accessor property](#sec-object-type) whose set accessor function is undefined. Its get accessor function performs the following steps when called:

1.  Return the this value.

The value of the "name" property of this function is "get \[Symbol.species\]".

Note

Methods that create derived collection objects should call [%Symbol.species%](#sec-well-known-symbols) to determine the [constructor](#constructor) to use to create the derived objects. Subclass [constructor](#constructor) may over-ride [%Symbol.species%](#sec-well-known-symbols) to change the default [constructor](#constructor) assignment.

### 24.1.3 Properties of the Map Prototype Object

The Map prototype object:

- is %Map.prototype%.
- has a `[[Prototype]]` internal slot whose value is [%Object.prototype%](#sec-properties-of-the-object-prototype-object).
- is an [ordinary object](#ordinary-object).
- does not have a `[[MapData]]` internal slot.

#### 24.1.3.1 Map.prototype.clear ( )

This method performs the following steps when called:

1.  Let `M` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`M`, `[[MapData]]`).
3.  For each [Record](#sec-list-and-record-specification-type) { `[[Key]]`, `[[Value]]` } `p` of `M`.`[[MapData]]`, do
    1.  Set `p`.`[[Key]]` to empty.
    2.  Set `p`.`[[Value]]` to empty.
4.  Return undefined.

Note

The existing `[[MapData]]` [List](#sec-list-and-record-specification-type) is preserved because there may be existing [Map Iterator objects](#sec-map-iterator-objects) that are suspended midway through iterating over that [List](#sec-list-and-record-specification-type).

#### 24.1.3.2 Map.prototype.constructor

The initial value of `Map.prototype.constructor` is [%Map%](#sec-map-constructor).

#### 24.1.3.3 Map.prototype.delete ( `key` )

This method performs the following steps when called:

1.  Let `M` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`M`, `[[MapData]]`).
3.  Set `key` to [CanonicalizeKeyedCollectionKey](#sec-canonicalizekeyedcollectionkey)(`key`).
4.  For each [Record](#sec-list-and-record-specification-type) { `[[Key]]`, `[[Value]]` } `p` of `M`.`[[MapData]]`, do
    1.  If `p`.`[[Key]]` is not empty and [SameValue](#sec-samevalue)(`p`.`[[Key]]`, `key`) is true, then
        1.  Set `p`.`[[Key]]` to empty.
        2.  Set `p`.`[[Value]]` to empty.
        3.  Return true.
5.  Return false.

Note

The value empty is used as a specification device to indicate that an entry has been deleted. Actual implementations may take other actions such as physically removing the entry from internal data structures.

#### 24.1.3.4 Map.prototype.entries ( )

This method performs the following steps when called:

1.  Let `M` be the this value.
2.  Return ? [CreateMapIterator](#sec-createmapiterator)(`M`, key+value).

#### 24.1.3.5 Map.prototype.forEach ( `callback` \[ , `thisArg` \] )

This method performs the following steps when called:

1.  Let `M` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`M`, `[[MapData]]`).
3.  If [IsCallable](#sec-iscallable)(`callback`) is false, throw a TypeError exception.
4.  Let `entries` be `M`.`[[MapData]]`.
5.  Let `numEntries` be the number of elements in `entries`.
6.  Let `index` be 0.
7.  Repeat, while `index` \< `numEntries`,
    1.  Let `e` be `entries`\[`index`\].
    2.  Set `index` to `index` + 1.
    3.  If `e`.`[[Key]]` is not empty, then
        1.  Perform ? [Call](#sec-call)(`callback`, `thisArg`, « `e`.`[[Value]]`, `e`.`[[Key]]`, `M` »).
        2.  NOTE: The number of elements in `entries` may have increased during execution of `callback`.
        3.  Set `numEntries` to the number of elements in `entries`.
8.  Return undefined.

Note

`callback` should be a function that accepts three arguments. `forEach` calls `callback` once for each key/value pair present in the Map, in key insertion order. `callback` is called only for keys of the Map which actually exist; it is not called for keys that have been deleted from the Map.

If a `thisArg` parameter is provided, it will be used as the this value for each invocation of `callback`. If it is not provided, undefined is used instead.

`callback` is called with three arguments: the value of the item, the key of the item, and the Map being traversed.

`forEach` does not directly mutate the object on which it is called but the object may be mutated by the calls to `callback`. Each entry of a map's `[[MapData]]` is only visited once. New keys added after the call to `forEach` begins are visited. A key will be revisited if it is deleted after it has been visited and then re-added before the `forEach` call completes. Keys that are deleted after the call to `forEach` begins and before being visited are not visited unless the key is added again before the `forEach` call completes.

#### 24.1.3.6 Map.prototype.get ( `key` )

This method performs the following steps when called:

1.  Let `M` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`M`, `[[MapData]]`).
3.  Set `key` to [CanonicalizeKeyedCollectionKey](#sec-canonicalizekeyedcollectionkey)(`key`).
4.  For each [Record](#sec-list-and-record-specification-type) { `[[Key]]`, `[[Value]]` } `p` of `M`.`[[MapData]]`, do
    1.  If `p`.`[[Key]]` is not empty and [SameValue](#sec-samevalue)(`p`.`[[Key]]`, `key`) is true, return `p`.`[[Value]]`.
5.  Return undefined.

#### 24.1.3.7 Map.prototype.has ( `key` )

This method performs the following steps when called:

1.  Let `M` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`M`, `[[MapData]]`).
3.  Set `key` to [CanonicalizeKeyedCollectionKey](#sec-canonicalizekeyedcollectionkey)(`key`).
4.  For each [Record](#sec-list-and-record-specification-type) { `[[Key]]`, `[[Value]]` } `p` of `M`.`[[MapData]]`, do
    1.  If `p`.`[[Key]]` is not empty and [SameValue](#sec-samevalue)(`p`.`[[Key]]`, `key`) is true, return true.
5.  Return false.

#### 24.1.3.8 Map.prototype.keys ( )

This method performs the following steps when called:

1.  Let `M` be the this value.
2.  Return ? [CreateMapIterator](#sec-createmapiterator)(`M`, key).

#### 24.1.3.9 Map.prototype.set ( `key`, `value` )

This method performs the following steps when called:

1.  Let `M` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`M`, `[[MapData]]`).
3.  Set `key` to [CanonicalizeKeyedCollectionKey](#sec-canonicalizekeyedcollectionkey)(`key`).
4.  For each [Record](#sec-list-and-record-specification-type) { `[[Key]]`, `[[Value]]` } `p` of `M`.`[[MapData]]`, do
    1.  If `p`.`[[Key]]` is not empty and [SameValue](#sec-samevalue)(`p`.`[[Key]]`, `key`) is true, then
        1.  Set `p`.`[[Value]]` to `value`.
        2.  Return `M`.
5.  Let `p` be the [Record](#sec-list-and-record-specification-type) { `[[Key]]`: `key`, `[[Value]]`: `value` }.
6.  Append `p` to `M`.`[[MapData]]`.
7.  Return `M`.

#### 24.1.3.10 get Map.prototype.size

`Map.prototype.size` is an [accessor property](#sec-object-type) whose set accessor function is undefined. Its get accessor function performs the following steps when called:

1.  Let `M` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`M`, `[[MapData]]`).
3.  Let `count` be 0.
4.  For each [Record](#sec-list-and-record-specification-type) { `[[Key]]`, `[[Value]]` } `p` of `M`.`[[MapData]]`, do
    1.  If `p`.`[[Key]]` is not empty, set `count` to `count` + 1.
5.  Return [𝔽](#𝔽)(`count`).

#### 24.1.3.11 Map.prototype.values ( )

This method performs the following steps when called:

1.  Let `M` be the this value.
2.  Return ? [CreateMapIterator](#sec-createmapiterator)(`M`, value).

#### 24.1.3.12 Map.prototype \[ %Symbol.iterator% \] ( )

The initial value of the [%Symbol.iterator%](#sec-well-known-symbols) property is %Map.prototype.entries%, defined in [24.1.3.4](#sec-map.prototype.entries).

#### 24.1.3.13 Map.prototype \[ %Symbol.toStringTag% \]

The initial value of the [%Symbol.toStringTag%](#sec-well-known-symbols) property is the String value "Map".

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: true }.

### 24.1.4 Properties of Map Instances

Map instances are [ordinary objects](#ordinary-object) that inherit properties from the Map prototype. Map instances also have a `[[MapData]]` internal slot.

### 24.1.5 Map Iterator Objects

A Map Iterator is an object that represents a specific iteration over some specific Map instance object. There is not a named [constructor](#constructor) for Map Iterator objects. Instead, Map Iterator objects are created by calling certain methods of Map instance objects.

#### 24.1.5.1 CreateMapIterator ( `map`, `kind` )

The abstract operation CreateMapIterator takes arguments `map` (an [ECMAScript language value](#sec-ecmascript-language-types)) and `kind` (key+value, key, or value) and returns either a [normal completion containing](#sec-completion-record-specification-type) a Generator or a [throw completion](#sec-completion-record-specification-type). It is used to create [iterator objects](#sec-iterator-interface) for Map methods that return such [iterators](#sec-iterator-interface). It performs the following steps when called:

1.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`map`, `[[MapData]]`).
2.  Let `closure` be a new [Abstract Closure](#sec-abstract-closure) with no parameters that captures `map` and `kind` and performs the following steps when called:
    1.  Let `entries` be `map`.`[[MapData]]`.
    2.  Let `index` be 0.
    3.  Let `numEntries` be the number of elements in `entries`.
    4.  Repeat, while `index` \< `numEntries`,
        1.  Let `e` be `entries`\[`index`\].
        2.  Set `index` to `index` + 1.
        3.  If `e`.`[[Key]]` is not empty, then
            1.  If `kind` is key, then
                1.  Let `result` be `e`.`[[Key]]`.
            2.  Else if `kind` is value, then
                1.  Let `result` be `e`.`[[Value]]`.
            3.  Else,
                1.  [Assert](#assert): `kind` is key+value.
                2.  Let `result` be [CreateArrayFromList](#sec-createarrayfromlist)(« `e`.`[[Key]]`, `e`.`[[Value]]` »).
            4.  Perform ? [GeneratorYield](#sec-generatoryield)([CreateIteratorResultObject](#sec-createiterresultobject)(`result`, false)).
            5.  NOTE: The number of elements in `entries` may have increased while execution of this abstract operation was paused by [GeneratorYield](#sec-generatoryield).
            6.  Set `numEntries` to the number of elements in `entries`.
    5.  Return undefined.
3.  Return [CreateIteratorFromClosure](#sec-createiteratorfromclosure)(`closure`, "%MapIteratorPrototype%", [%MapIteratorPrototype%](#sec-%mapiteratorprototype%-object)).

#### 24.1.5.2 The %MapIteratorPrototype% Object

The %MapIteratorPrototype% object:

- has properties that are inherited by all [Map Iterator objects](#sec-map-iterator-objects).
- is an [ordinary object](#ordinary-object).
- has a `[[Prototype]]` internal slot whose value is [%Iterator.prototype%](#sec-%iterator.prototype%-object).
- has the following properties:

##### 24.1.5.2.1 %MapIteratorPrototype%.next ( )

1.  Return ? [GeneratorResume](#sec-generatorresume)(this value, empty, "%MapIteratorPrototype%").

##### 24.1.5.2.2 %MapIteratorPrototype% \[ %Symbol.toStringTag% \]

The initial value of the [%Symbol.toStringTag%](#sec-well-known-symbols) property is the String value "Map Iterator".

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: true }.

## 24.2 Set Objects

Set objects are collections of [ECMAScript language values](#sec-ecmascript-language-types). A distinct value may only occur once as an element of a Set's collection. Distinct values are discriminated using the semantics of the [SameValueZero](#sec-samevaluezero) comparison algorithm.

Set objects must be implemented using either hash tables or other mechanisms that, on average, provide access times that are sublinear on the number of elements in the collection. The data structure used in this specification is only intended to describe the required observable semantics of Set objects. It is not intended to be a viable implementation model.

### 24.2.1 Abstract Operations For Set Objects

#### 24.2.1.1 Set Records

A Set Record is a [Record](#sec-list-and-record-specification-type) value used to encapsulate the interface of a Set or similar object.

Set Records have the fields listed in [Table 74](#table-set-record-fields).

|  |  |  |
|----|----|----|
| Field Name | Value | Meaning |
| `[[SetObject]]` | an Object | the Set or similar object. |
| `[[Size]]` | a non-negative [integer](#integer) or +∞ | The reported size of the object. |
| `[[Has]]` | a [function object](#function-object) | The `has` method of the object. |
| `[[Keys]]` | a [function object](#function-object) | The `keys` method of the object. |

Table 74: [Set Record](#sec-set-records) Fields

#### 24.2.1.2 GetSetRecord ( `obj` )

The abstract operation GetSetRecord takes argument `obj` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a [Set Record](#sec-set-records) or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  If `obj` [is not an Object](#sec-object-type), throw a TypeError exception.
2.  Let `rawSize` be ? [Get](#sec-get-o-p)(`obj`, "size").
3.  Let `numSize` be ? [ToNumber](#sec-tonumber)(`rawSize`).
4.  NOTE: If `rawSize` is undefined, then `numSize` will be NaN.
5.  If `numSize` is NaN, throw a TypeError exception.
6.  Let `intSize` be ! [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`numSize`).
7.  If `intSize` \< 0, throw a RangeError exception.
8.  Let `has` be ? [Get](#sec-get-o-p)(`obj`, "has").
9.  If [IsCallable](#sec-iscallable)(`has`) is false, throw a TypeError exception.
10. Let `keys` be ? [Get](#sec-get-o-p)(`obj`, "keys").
11. If [IsCallable](#sec-iscallable)(`keys`) is false, throw a TypeError exception.
12. Return a new [Set Record](#sec-set-records) { `[[SetObject]]`: `obj`, `[[Size]]`: `intSize`, `[[Has]]`: `has`, `[[Keys]]`: `keys` }.

#### 24.2.1.3 SetDataHas ( `setData`, `value` )

The abstract operation SetDataHas takes arguments `setData` (a [List](#sec-list-and-record-specification-type) of either [ECMAScript language values](#sec-ecmascript-language-types) or empty) and `value` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns a Boolean. It performs the following steps when called:

1.  If [SetDataIndex](#sec-setdataindex)(`setData`, `value`) is not-found, return false.
2.  Return true.

#### 24.2.1.4 SetDataIndex ( `setData`, `value` )

The abstract operation SetDataIndex takes arguments `setData` (a [List](#sec-list-and-record-specification-type) of either [ECMAScript language values](#sec-ecmascript-language-types) or empty) and `value` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns a non-negative [integer](#integer) or not-found. It performs the following steps when called:

1.  Set `value` to [CanonicalizeKeyedCollectionKey](#sec-canonicalizekeyedcollectionkey)(`value`).
2.  Let `size` be the number of elements in `setData`.
3.  Let `index` be 0.
4.  Repeat, while `index` \< `size`,
    1.  Let `e` be `setData`\[`index`\].
    2.  If `e` is not empty and `e` is `value`, then
        1.  Return `index`.
    3.  Set `index` to `index` + 1.
5.  Return not-found.

#### 24.2.1.5 SetDataSize ( `setData` )

The abstract operation SetDataSize takes argument `setData` (a [List](#sec-list-and-record-specification-type) of either [ECMAScript language values](#sec-ecmascript-language-types) or empty) and returns a non-negative [integer](#integer). It performs the following steps when called:

1.  Let `count` be 0.
2.  For each element `e` of `setData`, do
    1.  If `e` is not empty, set `count` to `count` + 1.
3.  Return `count`.

### 24.2.2 The Set Constructor

The Set [constructor](#constructor):

- is %Set%.
- is the initial value of the "Set" property of the [global object](#sec-global-object).
- creates and initializes a new Set object when called as a [constructor](#constructor).
- is not intended to be called as a function and will throw an exception when called in that manner.
- may be used as the value in an `extends` clause of a class definition. Subclass [constructors](#constructor) that intend to inherit the specified Set behaviour must include a `super` call to the Set [constructor](#constructor) to create and initialize the subclass instance with the internal state necessary to support the `Set.prototype` built-in methods.

#### 24.2.2.1 Set ( \[ `iterable` \] )

This function performs the following steps when called:

1.  If NewTarget is undefined, throw a TypeError exception.
2.  Let `set` be ? [OrdinaryCreateFromConstructor](#sec-ordinarycreatefromconstructor)(NewTarget, "%Set.prototype%", « `[[SetData]]` »).
3.  Set `set`.`[[SetData]]` to a new empty [List](#sec-list-and-record-specification-type).
4.  If `iterable` is either undefined or null, return `set`.
5.  Let `adder` be ? [Get](#sec-get-o-p)(`set`, "add").
6.  If [IsCallable](#sec-iscallable)(`adder`) is false, throw a TypeError exception.
7.  Let `iteratorRecord` be ? [GetIterator](#sec-getiterator)(`iterable`, sync).
8.  Repeat,
    1.  Let `next` be ? [IteratorStepValue](#sec-iteratorstepvalue)(`iteratorRecord`).
    2.  If `next` is done, return `set`.
    3.  Let `status` be [Completion](#sec-completion-ao)([Call](#sec-call)(`adder`, `set`, « `next` »)).
    4.  [IfAbruptCloseIterator](#sec-ifabruptcloseiterator)(`status`, `iteratorRecord`).

### 24.2.3 Properties of the Set Constructor

The Set [constructor](#constructor):

- has a `[[Prototype]]` internal slot whose value is [%Function.prototype%](#sec-properties-of-the-function-prototype-object).
- has the following properties:

#### 24.2.3.1 Set.prototype

The initial value of `Set.prototype` is the [Set prototype object](#sec-properties-of-the-set-prototype-object).

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

#### 24.2.3.2 get Set \[ %Symbol.species% \]

`Set[%Symbol.species%]` is an [accessor property](#sec-object-type) whose set accessor function is undefined. Its get accessor function performs the following steps when called:

1.  Return the this value.

The value of the "name" property of this function is "get \[Symbol.species\]".

Note

Methods that create derived collection objects should call [%Symbol.species%](#sec-well-known-symbols) to determine the [constructor](#constructor) to use to create the derived objects. Subclass [constructor](#constructor) may over-ride [%Symbol.species%](#sec-well-known-symbols) to change the default [constructor](#constructor) assignment.

### 24.2.4 Properties of the Set Prototype Object

The Set prototype object:

- is %Set.prototype%.
- has a `[[Prototype]]` internal slot whose value is [%Object.prototype%](#sec-properties-of-the-object-prototype-object).
- is an [ordinary object](#ordinary-object).
- does not have a `[[SetData]]` internal slot.

#### 24.2.4.1 Set.prototype.add ( `value` )

This method performs the following steps when called:

1.  Let `S` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`S`, `[[SetData]]`).
3.  Set `value` to [CanonicalizeKeyedCollectionKey](#sec-canonicalizekeyedcollectionkey)(`value`).
4.  For each element `e` of `S`.`[[SetData]]`, do
    1.  If `e` is not empty and [SameValue](#sec-samevalue)(`e`, `value`) is true, then
        1.  Return `S`.
5.  Append `value` to `S`.`[[SetData]]`.
6.  Return `S`.

#### 24.2.4.2 Set.prototype.clear ( )

This method performs the following steps when called:

1.  Let `S` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`S`, `[[SetData]]`).
3.  For each element `e` of `S`.`[[SetData]]`, do
    1.  Replace the element of `S`.`[[SetData]]` whose value is `e` with an element whose value is empty.
4.  Return undefined.

Note

The existing `[[SetData]]` [List](#sec-list-and-record-specification-type) is preserved because there may be existing [Set Iterator objects](#sec-set-iterator-objects) that are suspended midway through iterating over that [List](#sec-list-and-record-specification-type).

#### 24.2.4.3 Set.prototype.constructor

The initial value of `Set.prototype.constructor` is [%Set%](#sec-set-constructor).

#### 24.2.4.4 Set.prototype.delete ( `value` )

This method performs the following steps when called:

1.  Let `S` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`S`, `[[SetData]]`).
3.  Set `value` to [CanonicalizeKeyedCollectionKey](#sec-canonicalizekeyedcollectionkey)(`value`).
4.  For each element `e` of `S`.`[[SetData]]`, do
    1.  If `e` is not empty and [SameValue](#sec-samevalue)(`e`, `value`) is true, then
        1.  Replace the element of `S`.`[[SetData]]` whose value is `e` with an element whose value is empty.
        2.  Return true.
5.  Return false.

Note

The value empty is used as a specification device to indicate that an entry has been deleted. Actual implementations may take other actions such as physically removing the entry from internal data structures.

#### 24.2.4.5 Set.prototype.difference ( `other` )

This method performs the following steps when called:

1.  Let `O` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`O`, `[[SetData]]`).
3.  Let `otherRec` be ? [GetSetRecord](#sec-getsetrecord)(`other`).
4.  Let `resultSetData` be a copy of `O`.`[[SetData]]`.
5.  If [SetDataSize](#sec-setdatasize)(`O`.`[[SetData]]`) ≤ `otherRec`.`[[Size]]`, then
    1.  Let `thisSize` be the number of elements in `O`.`[[SetData]]`.
    2.  Let `index` be 0.
    3.  Repeat, while `index` \< `thisSize`,
        1.  Let `e` be `resultSetData`\[`index`\].
        2.  If `e` is not empty, then
            1.  Let `inOther` be [ToBoolean](#sec-toboolean)(? [Call](#sec-call)(`otherRec`.`[[Has]]`, `otherRec`.`[[SetObject]]`, « `e` »)).
            2.  If `inOther` is true, then
                1.  Set `resultSetData`\[`index`\] to empty.
        3.  Set `index` to `index` + 1.
6.  Else,
    1.  Let `keysIter` be ? [GetIteratorFromMethod](#sec-getiteratorfrommethod)(`otherRec`.`[[SetObject]]`, `otherRec`.`[[Keys]]`).
    2.  Let `next` be not-started.
    3.  Repeat, while `next` is not done,
        1.  Set `next` to ? [IteratorStepValue](#sec-iteratorstepvalue)(`keysIter`).
        2.  If `next` is not done, then
            1.  Set `next` to [CanonicalizeKeyedCollectionKey](#sec-canonicalizekeyedcollectionkey)(`next`).
            2.  Let `valueIndex` be [SetDataIndex](#sec-setdataindex)(`resultSetData`, `next`).
            3.  If `valueIndex` is not not-found, then
                1.  Set `resultSetData`\[`valueIndex`\] to empty.
7.  Let `result` be [OrdinaryObjectCreate](#sec-ordinaryobjectcreate)([%Set.prototype%](#sec-properties-of-the-set-prototype-object), « `[[SetData]]` »).
8.  Set `result`.`[[SetData]]` to `resultSetData`.
9.  Return `result`.

#### 24.2.4.6 Set.prototype.entries ( )

This method performs the following steps when called:

1.  Let `S` be the this value.
2.  Return ? [CreateSetIterator](#sec-createsetiterator)(`S`, key+value).

Note

For iteration purposes, a Set appears similar to a Map where each entry has the same value for its key and value.

#### 24.2.4.7 Set.prototype.forEach ( `callback` \[ , `thisArg` \] )

This method performs the following steps when called:

1.  Let `S` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`S`, `[[SetData]]`).
3.  If [IsCallable](#sec-iscallable)(`callback`) is false, throw a TypeError exception.
4.  Let `entries` be `S`.`[[SetData]]`.
5.  Let `numEntries` be the number of elements in `entries`.
6.  Let `index` be 0.
7.  Repeat, while `index` \< `numEntries`,
    1.  Let `e` be `entries`\[`index`\].
    2.  Set `index` to `index` + 1.
    3.  If `e` is not empty, then
        1.  Perform ? [Call](#sec-call)(`callback`, `thisArg`, « `e`, `e`, `S` »).
        2.  NOTE: The number of elements in `entries` may have increased during execution of `callback`.
        3.  Set `numEntries` to the number of elements in `entries`.
8.  Return undefined.

Note

`callback` should be a function that accepts three arguments. `forEach` calls `callback` once for each value present in the Set object, in value insertion order. `callback` is called only for values of the Set which actually exist; it is not called for keys that have been deleted from the set.

If a `thisArg` parameter is provided, it will be used as the this value for each invocation of `callback`. If it is not provided, undefined is used instead.

`callback` is called with three arguments: the first two arguments are a value contained in the Set. The same value is passed for both arguments. The Set object being traversed is passed as the third argument.

The `callback` is called with three arguments to be consistent with the call back functions used by `forEach` methods for Map and Array. For Sets, each item value is considered to be both the key and the value.

`forEach` does not directly mutate the object on which it is called but the object may be mutated by the calls to `callback`.

Each value is normally visited only once. However, a value will be revisited if it is deleted after it has been visited and then re-added before the `forEach` call completes. Values that are deleted after the call to `forEach` begins and before being visited are not visited unless the value is added again before the `forEach` call completes. New values added after the call to `forEach` begins are visited.

#### 24.2.4.8 Set.prototype.has ( `value` )

This method performs the following steps when called:

1.  Let `S` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`S`, `[[SetData]]`).
3.  Set `value` to [CanonicalizeKeyedCollectionKey](#sec-canonicalizekeyedcollectionkey)(`value`).
4.  For each element `e` of `S`.`[[SetData]]`, do
    1.  If `e` is not empty and [SameValue](#sec-samevalue)(`e`, `value`) is true, return true.
5.  Return false.

#### 24.2.4.9 Set.prototype.intersection ( `other` )

This method performs the following steps when called:

1.  Let `O` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`O`, `[[SetData]]`).
3.  Let `otherRec` be ? [GetSetRecord](#sec-getsetrecord)(`other`).
4.  Let `resultSetData` be a new empty [List](#sec-list-and-record-specification-type).
5.  If [SetDataSize](#sec-setdatasize)(`O`.`[[SetData]]`) ≤ `otherRec`.`[[Size]]`, then
    1.  Let `thisSize` be the number of elements in `O`.`[[SetData]]`.
    2.  Let `index` be 0.
    3.  Repeat, while `index` \< `thisSize`,
        1.  Let `e` be `O`.`[[SetData]]`\[`index`\].
        2.  Set `index` to `index` + 1.
        3.  If `e` is not empty, then
            1.  Let `inOther` be [ToBoolean](#sec-toboolean)(? [Call](#sec-call)(`otherRec`.`[[Has]]`, `otherRec`.`[[SetObject]]`, « `e` »)).
            2.  If `inOther` is true, then
                1.  NOTE: It is possible for earlier calls to `otherRec`.`[[Has]]` to remove and re-add an element of `O`.`[[SetData]]`, which can cause the same element to be visited twice during this iteration.
                2.  If [SetDataHas](#sec-setdatahas)(`resultSetData`, `e`) is false, then
                    1.  Append `e` to `resultSetData`.
            3.  NOTE: The number of elements in `O`.`[[SetData]]` may have increased during execution of `otherRec`.`[[Has]]`.
            4.  Set `thisSize` to the number of elements in `O`.`[[SetData]]`.
6.  Else,
    1.  Let `keysIter` be ? [GetIteratorFromMethod](#sec-getiteratorfrommethod)(`otherRec`.`[[SetObject]]`, `otherRec`.`[[Keys]]`).
    2.  Let `next` be not-started.
    3.  Repeat, while `next` is not done,
        1.  Set `next` to ? [IteratorStepValue](#sec-iteratorstepvalue)(`keysIter`).
        2.  If `next` is not done, then
            1.  Set `next` to [CanonicalizeKeyedCollectionKey](#sec-canonicalizekeyedcollectionkey)(`next`).
            2.  Let `inThis` be [SetDataHas](#sec-setdatahas)(`O`.`[[SetData]]`, `next`).
            3.  If `inThis` is true, then
                1.  NOTE: Because `other` is an arbitrary object, it is possible for its "keys" [iterator](#sec-iterator-interface) to produce the same value more than once.
                2.  If [SetDataHas](#sec-setdatahas)(`resultSetData`, `next`) is false, then
                    1.  Append `next` to `resultSetData`.
7.  Let `result` be [OrdinaryObjectCreate](#sec-ordinaryobjectcreate)([%Set.prototype%](#sec-properties-of-the-set-prototype-object), « `[[SetData]]` »).
8.  Set `result`.`[[SetData]]` to `resultSetData`.
9.  Return `result`.

#### 24.2.4.10 Set.prototype.isDisjointFrom ( `other` )

This method performs the following steps when called:

1.  Let `O` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`O`, `[[SetData]]`).
3.  Let `otherRec` be ? [GetSetRecord](#sec-getsetrecord)(`other`).
4.  If [SetDataSize](#sec-setdatasize)(`O`.`[[SetData]]`) ≤ `otherRec`.`[[Size]]`, then
    1.  Let `thisSize` be the number of elements in `O`.`[[SetData]]`.
    2.  Let `index` be 0.
    3.  Repeat, while `index` \< `thisSize`,
        1.  Let `e` be `O`.`[[SetData]]`\[`index`\].
        2.  Set `index` to `index` + 1.
        3.  If `e` is not empty, then
            1.  Let `inOther` be [ToBoolean](#sec-toboolean)(? [Call](#sec-call)(`otherRec`.`[[Has]]`, `otherRec`.`[[SetObject]]`, « `e` »)).
            2.  If `inOther` is true, return false.
            3.  NOTE: The number of elements in `O`.`[[SetData]]` may have increased during execution of `otherRec`.`[[Has]]`.
            4.  Set `thisSize` to the number of elements in `O`.`[[SetData]]`.
5.  Else,
    1.  Let `keysIter` be ? [GetIteratorFromMethod](#sec-getiteratorfrommethod)(`otherRec`.`[[SetObject]]`, `otherRec`.`[[Keys]]`).
    2.  Let `next` be not-started.
    3.  Repeat, while `next` is not done,
        1.  Set `next` to ? [IteratorStepValue](#sec-iteratorstepvalue)(`keysIter`).
        2.  If `next` is not done, then
            1.  If [SetDataHas](#sec-setdatahas)(`O`.`[[SetData]]`, `next`) is true, then
                1.  Perform ? [IteratorClose](#sec-iteratorclose)(`keysIter`, [NormalCompletion](#sec-normalcompletion)(unused)).
                2.  Return false.
6.  Return true.

#### 24.2.4.11 Set.prototype.isSubsetOf ( `other` )

This method performs the following steps when called:

1.  Let `O` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`O`, `[[SetData]]`).
3.  Let `otherRec` be ? [GetSetRecord](#sec-getsetrecord)(`other`).
4.  If [SetDataSize](#sec-setdatasize)(`O`.`[[SetData]]`) \> `otherRec`.`[[Size]]`, return false.
5.  Let `thisSize` be the number of elements in `O`.`[[SetData]]`.
6.  Let `index` be 0.
7.  Repeat, while `index` \< `thisSize`,
    1.  Let `e` be `O`.`[[SetData]]`\[`index`\].
    2.  Set `index` to `index` + 1.
    3.  If `e` is not empty, then
        1.  Let `inOther` be [ToBoolean](#sec-toboolean)(? [Call](#sec-call)(`otherRec`.`[[Has]]`, `otherRec`.`[[SetObject]]`, « `e` »)).
        2.  If `inOther` is false, return false.
        3.  NOTE: The number of elements in `O`.`[[SetData]]` may have increased during execution of `otherRec`.`[[Has]]`.
        4.  Set `thisSize` to the number of elements in `O`.`[[SetData]]`.
8.  Return true.

#### 24.2.4.12 Set.prototype.isSupersetOf ( `other` )

This method performs the following steps when called:

1.  Let `O` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`O`, `[[SetData]]`).
3.  Let `otherRec` be ? [GetSetRecord](#sec-getsetrecord)(`other`).
4.  If [SetDataSize](#sec-setdatasize)(`O`.`[[SetData]]`) \< `otherRec`.`[[Size]]`, return false.
5.  Let `keysIter` be ? [GetIteratorFromMethod](#sec-getiteratorfrommethod)(`otherRec`.`[[SetObject]]`, `otherRec`.`[[Keys]]`).
6.  Let `next` be not-started.
7.  Repeat, while `next` is not done,
    1.  Set `next` to ? [IteratorStepValue](#sec-iteratorstepvalue)(`keysIter`).
    2.  If `next` is not done, then
        1.  If [SetDataHas](#sec-setdatahas)(`O`.`[[SetData]]`, `next`) is false, then
            1.  Perform ? [IteratorClose](#sec-iteratorclose)(`keysIter`, [NormalCompletion](#sec-normalcompletion)(unused)).
            2.  Return false.
8.  Return true.

#### 24.2.4.13 Set.prototype.keys ( )

The initial value of the "keys" property is %Set.prototype.values%, defined in [24.2.4.17](#sec-set.prototype.values).

Note

For iteration purposes, a Set appears similar to a Map where each entry has the same value for its key and value.

#### 24.2.4.14 get Set.prototype.size

`Set.prototype.size` is an [accessor property](#sec-object-type) whose set accessor function is undefined. Its get accessor function performs the following steps when called:

1.  Let `S` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`S`, `[[SetData]]`).
3.  Let `size` be [SetDataSize](#sec-setdatasize)(`S`.`[[SetData]]`).
4.  Return [𝔽](#𝔽)(`size`).

#### 24.2.4.15 Set.prototype.symmetricDifference ( `other` )

This method performs the following steps when called:

1.  Let `O` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`O`, `[[SetData]]`).
3.  Let `otherRec` be ? [GetSetRecord](#sec-getsetrecord)(`other`).
4.  Let `keysIter` be ? [GetIteratorFromMethod](#sec-getiteratorfrommethod)(`otherRec`.`[[SetObject]]`, `otherRec`.`[[Keys]]`).
5.  Let `resultSetData` be a copy of `O`.`[[SetData]]`.
6.  Let `next` be not-started.
7.  Repeat, while `next` is not done,
    1.  Set `next` to ? [IteratorStepValue](#sec-iteratorstepvalue)(`keysIter`).
    2.  If `next` is not done, then
        1.  Set `next` to [CanonicalizeKeyedCollectionKey](#sec-canonicalizekeyedcollectionkey)(`next`).
        2.  Let `resultIndex` be [SetDataIndex](#sec-setdataindex)(`resultSetData`, `next`).
        3.  If `resultIndex` is not-found, let `alreadyInResult` be false. Otherwise let `alreadyInResult` be true.
        4.  If [SetDataHas](#sec-setdatahas)(`O`.`[[SetData]]`, `next`) is true, then
            1.  If `alreadyInResult` is true, set `resultSetData`\[`resultIndex`\] to empty.
        5.  Else,
            1.  If `alreadyInResult` is false, append `next` to `resultSetData`.
8.  Let `result` be [OrdinaryObjectCreate](#sec-ordinaryobjectcreate)([%Set.prototype%](#sec-properties-of-the-set-prototype-object), « `[[SetData]]` »).
9.  Set `result`.`[[SetData]]` to `resultSetData`.
10. Return `result`.

#### 24.2.4.16 Set.prototype.union ( `other` )

This method performs the following steps when called:

1.  Let `O` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`O`, `[[SetData]]`).
3.  Let `otherRec` be ? [GetSetRecord](#sec-getsetrecord)(`other`).
4.  Let `keysIter` be ? [GetIteratorFromMethod](#sec-getiteratorfrommethod)(`otherRec`.`[[SetObject]]`, `otherRec`.`[[Keys]]`).
5.  Let `resultSetData` be a copy of `O`.`[[SetData]]`.
6.  Let `next` be not-started.
7.  Repeat, while `next` is not done,
    1.  Set `next` to ? [IteratorStepValue](#sec-iteratorstepvalue)(`keysIter`).
    2.  If `next` is not done, then
        1.  Set `next` to [CanonicalizeKeyedCollectionKey](#sec-canonicalizekeyedcollectionkey)(`next`).
        2.  If [SetDataHas](#sec-setdatahas)(`resultSetData`, `next`) is false, then
            1.  Append `next` to `resultSetData`.
8.  Let `result` be [OrdinaryObjectCreate](#sec-ordinaryobjectcreate)([%Set.prototype%](#sec-properties-of-the-set-prototype-object), « `[[SetData]]` »).
9.  Set `result`.`[[SetData]]` to `resultSetData`.
10. Return `result`.

#### 24.2.4.17 Set.prototype.values ( )

This method performs the following steps when called:

1.  Let `S` be the this value.
2.  Return ? [CreateSetIterator](#sec-createsetiterator)(`S`, value).

#### 24.2.4.18 Set.prototype \[ %Symbol.iterator% \] ( )

The initial value of the [%Symbol.iterator%](#sec-well-known-symbols) property is %Set.prototype.values%, defined in [24.2.4.17](#sec-set.prototype.values).

#### 24.2.4.19 Set.prototype \[ %Symbol.toStringTag% \]

The initial value of the [%Symbol.toStringTag%](#sec-well-known-symbols) property is the String value "Set".

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: true }.

### 24.2.5 Properties of Set Instances

Set instances are [ordinary objects](#ordinary-object) that inherit properties from the Set prototype. Set instances also have a `[[SetData]]` internal slot.

### 24.2.6 Set Iterator Objects

A Set Iterator is an [ordinary object](#ordinary-object), with the structure defined below, that represents a specific iteration over some specific Set instance object. There is not a named [constructor](#constructor) for Set Iterator objects. Instead, Set Iterator objects are created by calling certain methods of Set instance objects.

#### 24.2.6.1 CreateSetIterator ( `set`, `kind` )

The abstract operation CreateSetIterator takes arguments `set` (an [ECMAScript language value](#sec-ecmascript-language-types)) and `kind` (key+value or value) and returns either a [normal completion containing](#sec-completion-record-specification-type) a Generator or a [throw completion](#sec-completion-record-specification-type). It is used to create [iterator objects](#sec-iterator-interface) for Set methods that return such [iterators](#sec-iterator-interface). It performs the following steps when called:

1.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`set`, `[[SetData]]`).
2.  Let `closure` be a new [Abstract Closure](#sec-abstract-closure) with no parameters that captures `set` and `kind` and performs the following steps when called:
    1.  Let `index` be 0.
    2.  Let `entries` be `set`.`[[SetData]]`.
    3.  Let `numEntries` be the number of elements in `entries`.
    4.  Repeat, while `index` \< `numEntries`,
        1.  Let `e` be `entries`\[`index`\].
        2.  Set `index` to `index` + 1.
        3.  If `e` is not empty, then
            1.  If `kind` is key+value, then
                1.  Let `result` be [CreateArrayFromList](#sec-createarrayfromlist)(« `e`, `e` »).
                2.  Perform ? [GeneratorYield](#sec-generatoryield)([CreateIteratorResultObject](#sec-createiterresultobject)(`result`, false)).
            2.  Else,
                1.  [Assert](#assert): `kind` is value.
                2.  Perform ? [GeneratorYield](#sec-generatoryield)([CreateIteratorResultObject](#sec-createiterresultobject)(`e`, false)).
            3.  NOTE: The number of elements in `entries` may have increased while execution of this abstract operation was paused by [GeneratorYield](#sec-generatoryield).
            4.  Set `numEntries` to the number of elements in `entries`.
    5.  Return undefined.
3.  Return [CreateIteratorFromClosure](#sec-createiteratorfromclosure)(`closure`, "%SetIteratorPrototype%", [%SetIteratorPrototype%](#sec-%setiteratorprototype%-object)).

#### 24.2.6.2 The %SetIteratorPrototype% Object

The %SetIteratorPrototype% object:

- has properties that are inherited by all [Set Iterator objects](#sec-set-iterator-objects).
- is an [ordinary object](#ordinary-object).
- has a `[[Prototype]]` internal slot whose value is [%Iterator.prototype%](#sec-%iterator.prototype%-object).
- has the following properties:

##### 24.2.6.2.1 %SetIteratorPrototype%.next ( )

1.  Return ? [GeneratorResume](#sec-generatorresume)(this value, empty, "%SetIteratorPrototype%").

##### 24.2.6.2.2 %SetIteratorPrototype% \[ %Symbol.toStringTag% \]

The initial value of the [%Symbol.toStringTag%](#sec-well-known-symbols) property is the String value "Set Iterator".

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: true }.

## 24.3 WeakMap Objects

WeakMaps are collections of key/value pairs where the keys are objects and/or symbols and values may be arbitrary [ECMAScript language values](#sec-ecmascript-language-types). A WeakMap may be queried to see if it contains a key/value pair with a specific key, but no mechanism is provided for enumerating the values it holds as keys. In certain conditions, values which are not [live](#sec-liveness) are removed as WeakMap keys, as described in [9.9.3](#sec-weakref-execution).

An implementation may impose an arbitrarily determined latency between the time a key/value pair of a WeakMap becomes inaccessible and the time when the key/value pair is removed from the WeakMap. If this latency was observable to ECMAScript program, it would be a source of indeterminacy that could impact program execution. For that reason, an ECMAScript implementation must not provide any means to observe a key of a WeakMap that does not require the observer to present the observed key.

WeakMaps must be implemented using either hash tables or other mechanisms that, on average, provide access times that are sublinear on the number of key/value pairs in the collection. The data structure used in this specification is only intended to describe the required observable semantics of WeakMaps. It is not intended to be a viable implementation model.

Note

WeakMap and WeakSet are intended to provide mechanisms for dynamically associating state with an object or symbol in a manner that does not “leak” memory resources if, in the absence of the WeakMap or WeakSet instance, the object or symbol otherwise became inaccessible and subject to resource reclamation by the implementation's garbage collection mechanisms. This characteristic can be achieved by using an inverted per-object/symbol mapping of WeakMap or WeakSet instances to keys. Alternatively, each WeakMap or WeakSet instance may internally store its key and value data, but this approach requires coordination between the WeakMap or WeakSet implementation and the garbage collector. The following references describe mechanism that may be useful to implementations of WeakMap and WeakSet:

Barry Hayes. 1997. Ephemerons: a new finalization mechanism. In *Proceedings of the 12th ACM SIGPLAN conference on Object-oriented programming, systems, languages, and applications (OOPSLA '97)*, A. Michael Berman (Ed.). ACM, New York, NY, USA, 176-183, <http://doi.acm.org/10.1145/263698.263733>.

Alexandra Barros, Roberto Ierusalimschy, Eliminating Cycles in Weak Tables. Journal of Universal Computer Science - J.UCS, vol. 14, no. 21, pp. 3481-3497, 2008, <http://www.jucs.org/jucs_14_21/eliminating_cycles_in_weak>

### 24.3.1 The WeakMap Constructor

The WeakMap [constructor](#constructor):

- is %WeakMap%.
- is the initial value of the "WeakMap" property of the [global object](#sec-global-object).
- creates and initializes a new WeakMap when called as a [constructor](#constructor).
- is not intended to be called as a function and will throw an exception when called in that manner.
- may be used as the value in an `extends` clause of a class definition. Subclass [constructors](#constructor) that intend to inherit the specified WeakMap behaviour must include a `super` call to the WeakMap [constructor](#constructor) to create and initialize the subclass instance with the internal state necessary to support the `WeakMap.prototype` built-in methods.

#### 24.3.1.1 WeakMap ( \[ `iterable` \] )

This function performs the following steps when called:

1.  If NewTarget is undefined, throw a TypeError exception.
2.  Let `map` be ? [OrdinaryCreateFromConstructor](#sec-ordinarycreatefromconstructor)(NewTarget, "%WeakMap.prototype%", « `[[WeakMapData]]` »).
3.  Set `map`.`[[WeakMapData]]` to a new empty [List](#sec-list-and-record-specification-type).
4.  If `iterable` is either undefined or null, return `map`.
5.  Let `adder` be ? [Get](#sec-get-o-p)(`map`, "set").
6.  If [IsCallable](#sec-iscallable)(`adder`) is false, throw a TypeError exception.
7.  Return ? [AddEntriesFromIterable](#sec-add-entries-from-iterable)(`map`, `iterable`, `adder`).

Note

If the parameter `iterable` is present, it is expected to be an object that implements a [%Symbol.iterator%](#sec-well-known-symbols) method that returns an [iterator object](#sec-iterator-interface) that produces a two element [array-like object](#sec-lengthofarraylike) whose first element is a value that will be used as a WeakMap key and whose second element is the value to associate with that key.

### 24.3.2 Properties of the WeakMap Constructor

The WeakMap [constructor](#constructor):

- has a `[[Prototype]]` internal slot whose value is [%Function.prototype%](#sec-properties-of-the-function-prototype-object).
- has the following properties:

#### 24.3.2.1 WeakMap.prototype

The initial value of `WeakMap.prototype` is the [WeakMap prototype object](#sec-properties-of-the-weakmap-prototype-object).

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

### 24.3.3 Properties of the WeakMap Prototype Object

The WeakMap prototype object:

- is %WeakMap.prototype%.
- has a `[[Prototype]]` internal slot whose value is [%Object.prototype%](#sec-properties-of-the-object-prototype-object).
- is an [ordinary object](#ordinary-object).
- does not have a `[[WeakMapData]]` internal slot.

#### 24.3.3.1 WeakMap.prototype.constructor

The initial value of `WeakMap.prototype.constructor` is [%WeakMap%](#sec-weakmap-constructor).

#### 24.3.3.2 WeakMap.prototype.delete ( `key` )

This method performs the following steps when called:

1.  Let `M` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`M`, `[[WeakMapData]]`).
3.  If [CanBeHeldWeakly](#sec-canbeheldweakly)(`key`) is false, return false.
4.  For each [Record](#sec-list-and-record-specification-type) { `[[Key]]`, `[[Value]]` } `p` of `M`.`[[WeakMapData]]`, do
    1.  If `p`.`[[Key]]` is not empty and [SameValue](#sec-samevalue)(`p`.`[[Key]]`, `key`) is true, then
        1.  Set `p`.`[[Key]]` to empty.
        2.  Set `p`.`[[Value]]` to empty.
        3.  Return true.
5.  Return false.

Note

The value empty is used as a specification device to indicate that an entry has been deleted. Actual implementations may take other actions such as physically removing the entry from internal data structures.

#### 24.3.3.3 WeakMap.prototype.get ( `key` )

This method performs the following steps when called:

1.  Let `M` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`M`, `[[WeakMapData]]`).
3.  If [CanBeHeldWeakly](#sec-canbeheldweakly)(`key`) is false, return undefined.
4.  For each [Record](#sec-list-and-record-specification-type) { `[[Key]]`, `[[Value]]` } `p` of `M`.`[[WeakMapData]]`, do
    1.  If `p`.`[[Key]]` is not empty and [SameValue](#sec-samevalue)(`p`.`[[Key]]`, `key`) is true, return `p`.`[[Value]]`.
5.  Return undefined.

#### 24.3.3.4 WeakMap.prototype.has ( `key` )

This method performs the following steps when called:

1.  Let `M` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`M`, `[[WeakMapData]]`).
3.  If [CanBeHeldWeakly](#sec-canbeheldweakly)(`key`) is false, return false.
4.  For each [Record](#sec-list-and-record-specification-type) { `[[Key]]`, `[[Value]]` } `p` of `M`.`[[WeakMapData]]`, do
    1.  If `p`.`[[Key]]` is not empty and [SameValue](#sec-samevalue)(`p`.`[[Key]]`, `key`) is true, return true.
5.  Return false.

#### 24.3.3.5 WeakMap.prototype.set ( `key`, `value` )

This method performs the following steps when called:

1.  Let `M` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`M`, `[[WeakMapData]]`).
3.  If [CanBeHeldWeakly](#sec-canbeheldweakly)(`key`) is false, throw a TypeError exception.
4.  For each [Record](#sec-list-and-record-specification-type) { `[[Key]]`, `[[Value]]` } `p` of `M`.`[[WeakMapData]]`, do
    1.  If `p`.`[[Key]]` is not empty and [SameValue](#sec-samevalue)(`p`.`[[Key]]`, `key`) is true, then
        1.  Set `p`.`[[Value]]` to `value`.
        2.  Return `M`.
5.  Let `p` be the [Record](#sec-list-and-record-specification-type) { `[[Key]]`: `key`, `[[Value]]`: `value` }.
6.  Append `p` to `M`.`[[WeakMapData]]`.
7.  Return `M`.

#### 24.3.3.6 WeakMap.prototype \[ %Symbol.toStringTag% \]

The initial value of the [%Symbol.toStringTag%](#sec-well-known-symbols) property is the String value "WeakMap".

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: true }.

### 24.3.4 Properties of WeakMap Instances

WeakMap instances are [ordinary objects](#ordinary-object) that inherit properties from the WeakMap prototype. WeakMap instances also have a `[[WeakMapData]]` internal slot.

## 24.4 WeakSet Objects

WeakSets are collections of objects and/or symbols. A distinct object or symbol may only occur once as an element of a WeakSet's collection. A WeakSet may be queried to see if it contains a specific value, but no mechanism is provided for enumerating the values it holds. In certain conditions, values which are not [live](#sec-liveness) are removed as WeakSet elements, as described in [9.9.3](#sec-weakref-execution).

An implementation may impose an arbitrarily determined latency between the time a value contained in a WeakSet becomes inaccessible and the time when the value is removed from the WeakSet. If this latency was observable to ECMAScript program, it would be a source of indeterminacy that could impact program execution. For that reason, an ECMAScript implementation must not provide any means to determine if a WeakSet contains a particular value that does not require the observer to present the observed value.

WeakSets must be implemented using either hash tables or other mechanisms that, on average, provide access times that are sublinear on the number of elements in the collection. The data structure used in this specification is only intended to describe the required observable semantics of WeakSets. It is not intended to be a viable implementation model.

Note

See the NOTE in [24.3](#sec-weakmap-objects).

### 24.4.1 The WeakSet Constructor

The WeakSet [constructor](#constructor):

- is %WeakSet%.
- is the initial value of the "WeakSet" property of the [global object](#sec-global-object).
- creates and initializes a new WeakSet when called as a [constructor](#constructor).
- is not intended to be called as a function and will throw an exception when called in that manner.
- may be used as the value in an `extends` clause of a class definition. Subclass [constructors](#constructor) that intend to inherit the specified WeakSet behaviour must include a `super` call to the WeakSet [constructor](#constructor) to create and initialize the subclass instance with the internal state necessary to support the `WeakSet.prototype` built-in methods.

#### 24.4.1.1 WeakSet ( \[ `iterable` \] )

This function performs the following steps when called:

1.  If NewTarget is undefined, throw a TypeError exception.
2.  Let `set` be ? [OrdinaryCreateFromConstructor](#sec-ordinarycreatefromconstructor)(NewTarget, "%WeakSet.prototype%", « `[[WeakSetData]]` »).
3.  Set `set`.`[[WeakSetData]]` to a new empty [List](#sec-list-and-record-specification-type).
4.  If `iterable` is either undefined or null, return `set`.
5.  Let `adder` be ? [Get](#sec-get-o-p)(`set`, "add").
6.  If [IsCallable](#sec-iscallable)(`adder`) is false, throw a TypeError exception.
7.  Let `iteratorRecord` be ? [GetIterator](#sec-getiterator)(`iterable`, sync).
8.  Repeat,
    1.  Let `next` be ? [IteratorStepValue](#sec-iteratorstepvalue)(`iteratorRecord`).
    2.  If `next` is done, return `set`.
    3.  Let `status` be [Completion](#sec-completion-ao)([Call](#sec-call)(`adder`, `set`, « `next` »)).
    4.  [IfAbruptCloseIterator](#sec-ifabruptcloseiterator)(`status`, `iteratorRecord`).

### 24.4.2 Properties of the WeakSet Constructor

The WeakSet [constructor](#constructor):

- has a `[[Prototype]]` internal slot whose value is [%Function.prototype%](#sec-properties-of-the-function-prototype-object).
- has the following properties:

#### 24.4.2.1 WeakSet.prototype

The initial value of `WeakSet.prototype` is the [WeakSet prototype object](#sec-properties-of-the-weakset-prototype-object).

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

### 24.4.3 Properties of the WeakSet Prototype Object

The WeakSet prototype object:

- is %WeakSet.prototype%.
- has a `[[Prototype]]` internal slot whose value is [%Object.prototype%](#sec-properties-of-the-object-prototype-object).
- is an [ordinary object](#ordinary-object).
- does not have a `[[WeakSetData]]` internal slot.

#### 24.4.3.1 WeakSet.prototype.add ( `value` )

This method performs the following steps when called:

1.  Let `S` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`S`, `[[WeakSetData]]`).
3.  If [CanBeHeldWeakly](#sec-canbeheldweakly)(`value`) is false, throw a TypeError exception.
4.  For each element `e` of `S`.`[[WeakSetData]]`, do
    1.  If `e` is not empty and [SameValue](#sec-samevalue)(`e`, `value`) is true, then
        1.  Return `S`.
5.  Append `value` to `S`.`[[WeakSetData]]`.
6.  Return `S`.

#### 24.4.3.2 WeakSet.prototype.constructor

The initial value of `WeakSet.prototype.constructor` is [%WeakSet%](#sec-weakset-constructor).

#### 24.4.3.3 WeakSet.prototype.delete ( `value` )

This method performs the following steps when called:

1.  Let `S` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`S`, `[[WeakSetData]]`).
3.  If [CanBeHeldWeakly](#sec-canbeheldweakly)(`value`) is false, return false.
4.  For each element `e` of `S`.`[[WeakSetData]]`, do
    1.  If `e` is not empty and [SameValue](#sec-samevalue)(`e`, `value`) is true, then
        1.  Replace the element of `S`.`[[WeakSetData]]` whose value is `e` with an element whose value is empty.
        2.  Return true.
5.  Return false.

Note

The value empty is used as a specification device to indicate that an entry has been deleted. Actual implementations may take other actions such as physically removing the entry from internal data structures.

#### 24.4.3.4 WeakSet.prototype.has ( `value` )

This method performs the following steps when called:

1.  Let `S` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`S`, `[[WeakSetData]]`).
3.  If [CanBeHeldWeakly](#sec-canbeheldweakly)(`value`) is false, return false.
4.  For each element `e` of `S`.`[[WeakSetData]]`, do
    1.  If `e` is not empty and [SameValue](#sec-samevalue)(`e`, `value`) is true, return true.
5.  Return false.

#### 24.4.3.5 WeakSet.prototype \[ %Symbol.toStringTag% \]

The initial value of the [%Symbol.toStringTag%](#sec-well-known-symbols) property is the String value "WeakSet".

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: true }.

### 24.4.4 Properties of WeakSet Instances

WeakSet instances are [ordinary objects](#ordinary-object) that inherit properties from the WeakSet prototype. WeakSet instances also have a `[[WeakSetData]]` internal slot.

## 24.5 Abstract Operations for Keyed Collections

### 24.5.1 CanonicalizeKeyedCollectionKey ( `key` )

The abstract operation CanonicalizeKeyedCollectionKey takes argument `key` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns an [ECMAScript language value](#sec-ecmascript-language-types). It performs the following steps when called:

1.  If `key` is -0_(𝔽), return +0_(𝔽).
2.  Return `key`.
