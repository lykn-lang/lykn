# 27 Control Abstraction Objects

## 27.1 Iteration

### 27.1.1 Common Iteration Interfaces

An interface is a set of [property keys](#property-key) whose associated values match a specific specification. Any object that provides all the properties as described by an interface's specification *conforms* to that interface. An interface is not represented by a distinct object. There may be many separately implemented objects that conform to any interface. An individual object may conform to multiple interfaces.

#### 27.1.1.1 The Iterable Interface

The iterable interface includes the property described in [Table 80](#table-iterable-interface-required-properties):

| Property | Value | Requirements |
|----|----|----|
| `%Symbol.iterator%` | a function that returns an [iterator object](#sec-iterator-interface) | The returned object must conform to the [iterator interface](#sec-iterator-interface). |

Table 80: [Iterable](#sec-iterable-interface) Interface Required Properties

#### 27.1.1.2 The Iterator Interface

An object that implements the iterator interface must include the property in [Table 81](#table-iterator-interface-required-properties). Such objects may also implement the properties in [Table 82](#table-iterator-interface-optional-properties).

| Property | Value | Requirements |
|----|----|----|
| "next" | a function that returns an [IteratorResult object](#sec-iteratorresult-interface) | The returned object must conform to the [IteratorResult interface](#sec-iteratorresult-interface). If a previous call to the `next` method of an [iterator](#sec-iterator-interface) has returned an [IteratorResult object](#sec-iteratorresult-interface) whose "done" property is true, then all subsequent calls to the `next` method of that object should also return an [IteratorResult object](#sec-iteratorresult-interface) whose "done" property is true. However, this requirement is not enforced. |

Table 81: [Iterator](#sec-iterator-interface) Interface Required Properties

Note 1

Arguments may be passed to the `next` function but their interpretation and validity is dependent upon the target iterator. The for-of statement and other common users of iterators do not pass any arguments, so iterator objects that expect to be used in such a manner must be prepared to deal with being called with no arguments.

| Property | Value | Requirements |
|----|----|----|
| "return" | a function that returns an [IteratorResult object](#sec-iteratorresult-interface) | The returned object must conform to the [IteratorResult interface](#sec-iteratorresult-interface). Invoking this method notifies the [iterator object](#sec-iterator-interface) that the caller does not intend to make any more `next` method calls to the [iterator](#sec-iterator-interface). The returned [IteratorResult object](#sec-iteratorresult-interface) will typically have a "done" property whose value is true, and a "value" property with the value passed as the argument of the `return` method. However, this requirement is not enforced. |
| "throw" | a function that returns an [IteratorResult object](#sec-iteratorresult-interface) | The returned object must conform to the [IteratorResult interface](#sec-iteratorresult-interface). Invoking this method notifies the [iterator object](#sec-iterator-interface) that the caller has detected an error condition. The argument may be used to identify the error condition and typically will be an exception object. A typical response is to `throw` the value passed as the argument. If the method does not `throw`, the returned [IteratorResult object](#sec-iteratorresult-interface) will typically have a "done" property whose value is true. |

Table 82: [Iterator](#sec-iterator-interface) Interface Optional Properties

Note 2

Typically callers of these methods should check for their existence before invoking them. Certain ECMAScript language features including `for`-`of`, `yield*`, and array destructuring call these methods after performing an existence check. Most ECMAScript library functions that accept [iterable objects](#sec-iterable-interface) as arguments also conditionally call them.

#### 27.1.1.3 The Async Iterable Interface

The async iterable interface includes the properties described in [Table 83](#table-async-iterable):

| Property | Value | Requirements |
|----|----|----|
| `%Symbol.asyncIterator%` | a function that returns an [async iterator object](#sec-asynciterator-interface) | The returned object must conform to the [async iterator interface](#sec-asynciterator-interface). |

Table 83: Async [Iterable](#sec-iterable-interface) Interface Required Properties

#### 27.1.1.4 The Async Iterator Interface

An object that implements the async iterator interface must include the properties in [Table 84](#table-async-iterator-required). Such objects may also implement the properties in [Table 85](#table-async-iterator-optional).

[TABLE]

Table 84: Async [Iterator](#sec-iterator-interface) Interface Required Properties

Note 1

Arguments may be passed to the `next` function but their interpretation and validity is dependent upon the target async iterator. The `for`-`await`-`of` statement and other common users of async iterators do not pass any arguments, so async iterator objects that expect to be used in such a manner must be prepared to deal with being called with no arguments.

[TABLE]

Table 85: Async [Iterator](#sec-iterator-interface) Interface Optional Properties

Note 2

Typically callers of these methods should check for their existence before invoking them. Certain ECMAScript language features including `for`-`await`-`of` and `yield*` call these methods after performing an existence check.

#### 27.1.1.5 The IteratorResult Interface

The IteratorResult interface includes the properties listed in [Table 86](#table-iteratorresult-interface-properties):

| Property | Value | Requirements |
|----|----|----|
| "done" | a Boolean | This is the result status of an [iterator](#sec-iterator-interface) `next` method call. If the end of the [iterator](#sec-iterator-interface) was reached "done" is true. If the end was not reached "done" is false and a value is available. If a "done" property (either own or inherited) does not exist, it is considered to have the value false. |
| "value" | an [ECMAScript language value](#sec-ecmascript-language-types) | If done is false, this is the current iteration element value. If done is true, this is the return value of the [iterator](#sec-iterator-interface), if it supplied one. If the [iterator](#sec-iterator-interface) does not have a return value, "value" is undefined. In that case, the "value" property may be absent from the conforming object if it does not inherit an explicit "value" property. |

Table 86: IteratorResult Interface Properties

### 27.1.2 Iterator Helper Objects

An Iterator Helper object is an [ordinary object](#ordinary-object) that represents a lazy transformation of some specific source [iterator object](#sec-iterator-interface). There is not a named [constructor](#constructor) for Iterator Helper objects. Instead, Iterator Helper objects are created by calling certain methods of [Iterator](#sec-iterator-interface) instance objects.

#### 27.1.2.1 The %IteratorHelperPrototype% Object

The %IteratorHelperPrototype% object:

- has properties that are inherited by all [Iterator Helper objects](#sec-iterator-helper-objects).
- is an [ordinary object](#ordinary-object).
- has a `[[Prototype]]` internal slot whose value is [%Iterator.prototype%](#sec-%iterator.prototype%-object).
- has the following properties:

##### 27.1.2.1.1 %IteratorHelperPrototype%.next ( )

1.  Return ? [GeneratorResume](#sec-generatorresume)(this value, undefined, "Iterator Helper").

##### 27.1.2.1.2 %IteratorHelperPrototype%.return ( )

1.  Let `O` be this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`O`, `[[UnderlyingIterator]]`).
3.  [Assert](#assert): `O` has a `[[GeneratorState]]` internal slot.
4.  If `O`.`[[GeneratorState]]` is suspended-start, then
    1.  Set `O`.`[[GeneratorState]]` to completed.
    2.  NOTE: Once a generator enters the completed state it never leaves it and its associated [execution context](#sec-execution-contexts) is never resumed. Any execution state associated with `O` can be discarded at this point.
    3.  Perform ? [IteratorClose](#sec-iteratorclose)(`O`.`[[UnderlyingIterator]]`, [NormalCompletion](#sec-normalcompletion)(unused)).
    4.  Return [CreateIteratorResultObject](#sec-createiterresultobject)(undefined, true).
5.  Let `C` be [ReturnCompletion](#sec-returncompletion)(undefined).
6.  Return ? [GeneratorResumeAbrupt](#sec-generatorresumeabrupt)(`O`, `C`, "Iterator Helper").

##### 27.1.2.1.3 %IteratorHelperPrototype% \[ %Symbol.toStringTag% \]

The initial value of the [%Symbol.toStringTag%](#sec-well-known-symbols) property is the String value "Iterator Helper".

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: true }.

### 27.1.3 Iterator Objects

#### 27.1.3.1 The Iterator Constructor

The Iterator [constructor](#constructor):

- is %Iterator%.
- is the initial value of the "Iterator" property of the [global object](#sec-global-object).
- is designed to be subclassable. It may be used as the value of an extends clause of a class definition.

##### 27.1.3.1.1 Iterator ( )

This function performs the following steps when called:

1.  If NewTarget is either undefined or the [active function object](#active-function-object), throw a TypeError exception.
2.  Return ? [OrdinaryCreateFromConstructor](#sec-ordinarycreatefromconstructor)(NewTarget, "%Iterator.prototype%").

#### 27.1.3.2 Properties of the Iterator Constructor

The [Iterator](#sec-iterator-interface) [constructor](#constructor):

- has a `[[Prototype]]` internal slot whose value is [%Function.prototype%](#sec-properties-of-the-function-prototype-object).
- has the following properties:

##### 27.1.3.2.1 Iterator.from ( `O` )

1.  Let `iteratorRecord` be ? [GetIteratorFlattenable](#sec-getiteratorflattenable)(`O`, iterate-string-primitives).
2.  Let `hasInstance` be ? [OrdinaryHasInstance](#sec-ordinaryhasinstance)([%Iterator%](#sec-iterator-constructor), `iteratorRecord`.`[[Iterator]]`).
3.  If `hasInstance` is true, then
    1.  Return `iteratorRecord`.`[[Iterator]]`.
4.  Let `wrapper` be [OrdinaryObjectCreate](#sec-ordinaryobjectcreate)([%WrapForValidIteratorPrototype%](#sec-%wrapforvaliditeratorprototype%-object), « `[[Iterated]]` »).
5.  Set `wrapper`.`[[Iterated]]` to `iteratorRecord`.
6.  Return `wrapper`.

###### 27.1.3.2.1.1 The %WrapForValidIteratorPrototype% Object

The %WrapForValidIteratorPrototype% object:

- is an [ordinary object](#ordinary-object).
- has a `[[Prototype]]` internal slot whose value is [%Iterator.prototype%](#sec-%iterator.prototype%-object).

###### 27.1.3.2.1.1.1 %WrapForValidIteratorPrototype%.next ( )

1.  Let `O` be this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`O`, `[[Iterated]]`).
3.  Let `iteratorRecord` be `O`.`[[Iterated]]`.
4.  Return ? [Call](#sec-call)(`iteratorRecord`.`[[NextMethod]]`, `iteratorRecord`.`[[Iterator]]`).

###### 27.1.3.2.1.1.2 %WrapForValidIteratorPrototype%.return ( )

1.  Let `O` be this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`O`, `[[Iterated]]`).
3.  Let `iterator` be `O`.`[[Iterated]]`.`[[Iterator]]`.
4.  [Assert](#assert): `iterator` [is an Object](#sec-object-type).
5.  Let `returnMethod` be ? [GetMethod](#sec-getmethod)(`iterator`, "return").
6.  If `returnMethod` is undefined, then
    1.  Return [CreateIteratorResultObject](#sec-createiterresultobject)(undefined, true).
7.  Return ? [Call](#sec-call)(`returnMethod`, `iterator`).

##### 27.1.3.2.2 Iterator.prototype

The initial value of Iterator.prototype is [%Iterator.prototype%](#sec-%iterator.prototype%-object).

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

### 27.1.4 The %Iterator.prototype% Object

The %Iterator.prototype% object:

- has a `[[Prototype]]` internal slot whose value is [%Object.prototype%](#sec-properties-of-the-object-prototype-object).
- is an [ordinary object](#ordinary-object).

Note

All objects defined in this specification that implement the [iterator interface](#sec-iterator-interface) also inherit from %Iterator.prototype%. ECMAScript code may also define objects that inherit from %Iterator.prototype%. The %Iterator.prototype% object provides a place where additional methods that are applicable to all [iterator objects](#sec-iterator-interface) may be added.

The following expression is one way that ECMAScript code can access the %Iterator.prototype% object:

``` javascript
Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]()))
```

#### 27.1.4.1 Iterator.prototype.constructor

`Iterator.prototype.constructor` is an [accessor property](#sec-object-type) with attributes { `[[Enumerable]]`: false, `[[Configurable]]`: true }. The `[[Get]]` and `[[Set]]` attributes are defined as follows:

##### 27.1.4.1.1 get Iterator.prototype.constructor

The value of the `[[Get]]` attribute is a built-in function that requires no arguments. It performs the following steps when called:

1.  Return [%Iterator%](#sec-iterator-constructor).

##### 27.1.4.1.2 set Iterator.prototype.constructor

The value of the `[[Set]]` attribute is a built-in function that takes an argument `v`. It performs the following steps when called:

1.  Perform ? [SetterThatIgnoresPrototypeProperties](#sec-SetterThatIgnoresPrototypeProperties)(this value, [%Iterator.prototype%](#sec-%iterator.prototype%-object), "constructor", `v`).
2.  Return undefined.

Note

Unlike the "constructor" property on most built-in prototypes, for web-compatibility reasons this property must be an accessor.

#### 27.1.4.2 Iterator.prototype.drop ( `limit` )

This method performs the following steps when called:

1.  Let `O` be the this value.
2.  If `O` [is not an Object](#sec-object-type), throw a TypeError exception.
3.  Let `iterated` be the [Iterator Record](#sec-iterator-records) { `[[Iterator]]`: `O`, `[[NextMethod]]`: undefined, `[[Done]]`: false }.
4.  Let `numLimit` be [Completion](#sec-completion-ao)([ToNumber](#sec-tonumber)(`limit`)).
5.  [IfAbruptCloseIterator](#sec-ifabruptcloseiterator)(`numLimit`, `iterated`).
6.  If `numLimit` is NaN, then
    1.  Let `error` be [ThrowCompletion](#sec-throwcompletion)(a newly created RangeError object).
    2.  Return ? [IteratorClose](#sec-iteratorclose)(`iterated`, `error`).
7.  Let `integerLimit` be ! [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`numLimit`).
8.  If `integerLimit` \< 0, then
    1.  Let `error` be [ThrowCompletion](#sec-throwcompletion)(a newly created RangeError object).
    2.  Return ? [IteratorClose](#sec-iteratorclose)(`iterated`, `error`).
9.  Set `iterated` to ? [GetIteratorDirect](#sec-getiteratordirect)(`O`).
10. Let `closure` be a new [Abstract Closure](#sec-abstract-closure) with no parameters that captures `iterated` and `integerLimit` and performs the following steps when called:
    1.  Let `remaining` be `integerLimit`.
    2.  Repeat, while `remaining` \> 0,
        1.  If `remaining` ≠ +∞, then
            1.  Set `remaining` to `remaining` - 1.
        2.  Let `next` be ? [IteratorStep](#sec-iteratorstep)(`iterated`).
        3.  If `next` is done, return [ReturnCompletion](#sec-returncompletion)(undefined).
    3.  Repeat,
        1.  Let `value` be ? [IteratorStepValue](#sec-iteratorstepvalue)(`iterated`).
        2.  If `value` is done, return [ReturnCompletion](#sec-returncompletion)(undefined).
        3.  Let `completion` be [Completion](#sec-completion-ao)([Yield](#sec-yield)(`value`)).
        4.  [IfAbruptCloseIterator](#sec-ifabruptcloseiterator)(`completion`, `iterated`).
11. Let `result` be [CreateIteratorFromClosure](#sec-createiteratorfromclosure)(`closure`, "Iterator Helper", [%IteratorHelperPrototype%](#sec-%iteratorhelperprototype%-object), « `[[UnderlyingIterator]]` »).
12. Set `result`.`[[UnderlyingIterator]]` to `iterated`.
13. Return `result`.

#### 27.1.4.3 Iterator.prototype.every ( `predicate` )

This method performs the following steps when called:

1.  Let `O` be the this value.
2.  If `O` [is not an Object](#sec-object-type), throw a TypeError exception.
3.  Let `iterated` be the [Iterator Record](#sec-iterator-records) { `[[Iterator]]`: `O`, `[[NextMethod]]`: undefined, `[[Done]]`: false }.
4.  If [IsCallable](#sec-iscallable)(`predicate`) is false, then
    1.  Let `error` be [ThrowCompletion](#sec-throwcompletion)(a newly created TypeError object).
    2.  Return ? [IteratorClose](#sec-iteratorclose)(`iterated`, `error`).
5.  Set `iterated` to ? [GetIteratorDirect](#sec-getiteratordirect)(`O`).
6.  Let `counter` be 0.
7.  Repeat,
    1.  Let `value` be ? [IteratorStepValue](#sec-iteratorstepvalue)(`iterated`).
    2.  If `value` is done, return true.
    3.  Let `result` be [Completion](#sec-completion-ao)([Call](#sec-call)(`predicate`, undefined, « `value`, [𝔽](#𝔽)(`counter`) »)).
    4.  [IfAbruptCloseIterator](#sec-ifabruptcloseiterator)(`result`, `iterated`).
    5.  If [ToBoolean](#sec-toboolean)(`result`) is false, return ? [IteratorClose](#sec-iteratorclose)(`iterated`, [NormalCompletion](#sec-normalcompletion)(false)).
    6.  Set `counter` to `counter` + 1.

#### 27.1.4.4 Iterator.prototype.filter ( `predicate` )

This method performs the following steps when called:

1.  Let `O` be the this value.
2.  If `O` [is not an Object](#sec-object-type), throw a TypeError exception.
3.  Let `iterated` be the [Iterator Record](#sec-iterator-records) { `[[Iterator]]`: `O`, `[[NextMethod]]`: undefined, `[[Done]]`: false }.
4.  If [IsCallable](#sec-iscallable)(`predicate`) is false, then
    1.  Let `error` be [ThrowCompletion](#sec-throwcompletion)(a newly created TypeError object).
    2.  Return ? [IteratorClose](#sec-iteratorclose)(`iterated`, `error`).
5.  Set `iterated` to ? [GetIteratorDirect](#sec-getiteratordirect)(`O`).
6.  Let `closure` be a new [Abstract Closure](#sec-abstract-closure) with no parameters that captures `iterated` and `predicate` and performs the following steps when called:
    1.  Let `counter` be 0.
    2.  Repeat,
        1.  Let `value` be ? [IteratorStepValue](#sec-iteratorstepvalue)(`iterated`).
        2.  If `value` is done, return [ReturnCompletion](#sec-returncompletion)(undefined).
        3.  Let `selected` be [Completion](#sec-completion-ao)([Call](#sec-call)(`predicate`, undefined, « `value`, [𝔽](#𝔽)(`counter`) »)).
        4.  [IfAbruptCloseIterator](#sec-ifabruptcloseiterator)(`selected`, `iterated`).
        5.  If [ToBoolean](#sec-toboolean)(`selected`) is true, then
            1.  Let `completion` be [Completion](#sec-completion-ao)([Yield](#sec-yield)(`value`)).
            2.  [IfAbruptCloseIterator](#sec-ifabruptcloseiterator)(`completion`, `iterated`).
        6.  Set `counter` to `counter` + 1.
7.  Let `result` be [CreateIteratorFromClosure](#sec-createiteratorfromclosure)(`closure`, "Iterator Helper", [%IteratorHelperPrototype%](#sec-%iteratorhelperprototype%-object), « `[[UnderlyingIterator]]` »).
8.  Set `result`.`[[UnderlyingIterator]]` to `iterated`.
9.  Return `result`.

#### 27.1.4.5 Iterator.prototype.find ( `predicate` )

This method performs the following steps when called:

1.  Let `O` be the this value.
2.  If `O` [is not an Object](#sec-object-type), throw a TypeError exception.
3.  Let `iterated` be the [Iterator Record](#sec-iterator-records) { `[[Iterator]]`: `O`, `[[NextMethod]]`: undefined, `[[Done]]`: false }.
4.  If [IsCallable](#sec-iscallable)(`predicate`) is false, then
    1.  Let `error` be [ThrowCompletion](#sec-throwcompletion)(a newly created TypeError object).
    2.  Return ? [IteratorClose](#sec-iteratorclose)(`iterated`, `error`).
5.  Set `iterated` to ? [GetIteratorDirect](#sec-getiteratordirect)(`O`).
6.  Let `counter` be 0.
7.  Repeat,
    1.  Let `value` be ? [IteratorStepValue](#sec-iteratorstepvalue)(`iterated`).
    2.  If `value` is done, return undefined.
    3.  Let `result` be [Completion](#sec-completion-ao)([Call](#sec-call)(`predicate`, undefined, « `value`, [𝔽](#𝔽)(`counter`) »)).
    4.  [IfAbruptCloseIterator](#sec-ifabruptcloseiterator)(`result`, `iterated`).
    5.  If [ToBoolean](#sec-toboolean)(`result`) is true, return ? [IteratorClose](#sec-iteratorclose)(`iterated`, [NormalCompletion](#sec-normalcompletion)(`value`)).
    6.  Set `counter` to `counter` + 1.

#### 27.1.4.6 Iterator.prototype.flatMap ( `mapper` )

This method performs the following steps when called:

1.  Let `O` be the this value.
2.  If `O` [is not an Object](#sec-object-type), throw a TypeError exception.
3.  Let `iterated` be the [Iterator Record](#sec-iterator-records) { `[[Iterator]]`: `O`, `[[NextMethod]]`: undefined, `[[Done]]`: false }.
4.  If [IsCallable](#sec-iscallable)(`mapper`) is false, then
    1.  Let `error` be [ThrowCompletion](#sec-throwcompletion)(a newly created TypeError object).
    2.  Return ? [IteratorClose](#sec-iteratorclose)(`iterated`, `error`).
5.  Set `iterated` to ? [GetIteratorDirect](#sec-getiteratordirect)(`O`).
6.  Let `closure` be a new [Abstract Closure](#sec-abstract-closure) with no parameters that captures `iterated` and `mapper` and performs the following steps when called:
    1.  Let `counter` be 0.
    2.  Repeat,
        1.  Let `value` be ? [IteratorStepValue](#sec-iteratorstepvalue)(`iterated`).
        2.  If `value` is done, return [ReturnCompletion](#sec-returncompletion)(undefined).
        3.  Let `mapped` be [Completion](#sec-completion-ao)([Call](#sec-call)(`mapper`, undefined, « `value`, [𝔽](#𝔽)(`counter`) »)).
        4.  [IfAbruptCloseIterator](#sec-ifabruptcloseiterator)(`mapped`, `iterated`).
        5.  Let `innerIterator` be [Completion](#sec-completion-ao)([GetIteratorFlattenable](#sec-getiteratorflattenable)(`mapped`, reject-primitives)).
        6.  [IfAbruptCloseIterator](#sec-ifabruptcloseiterator)(`innerIterator`, `iterated`).
        7.  Let `innerAlive` be true.
        8.  Repeat, while `innerAlive` is true,
            1.  Let `innerValue` be [Completion](#sec-completion-ao)([IteratorStepValue](#sec-iteratorstepvalue)(`innerIterator`)).
            2.  [IfAbruptCloseIterator](#sec-ifabruptcloseiterator)(`innerValue`, `iterated`).
            3.  If `innerValue` is done, then
                1.  Set `innerAlive` to false.
            4.  Else,
                1.  Let `completion` be [Completion](#sec-completion-ao)([Yield](#sec-yield)(`innerValue`)).
                2.  If `completion` is an [abrupt completion](#sec-completion-record-specification-type), then
                    1.  Let `backupCompletion` be [Completion](#sec-completion-ao)([IteratorClose](#sec-iteratorclose)(`innerIterator`, `completion`)).
                    2.  [IfAbruptCloseIterator](#sec-ifabruptcloseiterator)(`backupCompletion`, `iterated`).
                    3.  Return ? [IteratorClose](#sec-iteratorclose)(`iterated`, `completion`).
        9.  Set `counter` to `counter` + 1.
7.  Let `result` be [CreateIteratorFromClosure](#sec-createiteratorfromclosure)(`closure`, "Iterator Helper", [%IteratorHelperPrototype%](#sec-%iteratorhelperprototype%-object), « `[[UnderlyingIterator]]` »).
8.  Set `result`.`[[UnderlyingIterator]]` to `iterated`.
9.  Return `result`.

#### 27.1.4.7 Iterator.prototype.forEach ( `procedure` )

This method performs the following steps when called:

1.  Let `O` be the this value.
2.  If `O` [is not an Object](#sec-object-type), throw a TypeError exception.
3.  Let `iterated` be the [Iterator Record](#sec-iterator-records) { `[[Iterator]]`: `O`, `[[NextMethod]]`: undefined, `[[Done]]`: false }.
4.  If [IsCallable](#sec-iscallable)(`procedure`) is false, then
    1.  Let `error` be [ThrowCompletion](#sec-throwcompletion)(a newly created TypeError object).
    2.  Return ? [IteratorClose](#sec-iteratorclose)(`iterated`, `error`).
5.  Set `iterated` to ? [GetIteratorDirect](#sec-getiteratordirect)(`O`).
6.  Let `counter` be 0.
7.  Repeat,
    1.  Let `value` be ? [IteratorStepValue](#sec-iteratorstepvalue)(`iterated`).
    2.  If `value` is done, return undefined.
    3.  Let `result` be [Completion](#sec-completion-ao)([Call](#sec-call)(`procedure`, undefined, « `value`, [𝔽](#𝔽)(`counter`) »)).
    4.  [IfAbruptCloseIterator](#sec-ifabruptcloseiterator)(`result`, `iterated`).
    5.  Set `counter` to `counter` + 1.

#### 27.1.4.8 Iterator.prototype.map ( `mapper` )

This method performs the following steps when called:

1.  Let `O` be the this value.
2.  If `O` [is not an Object](#sec-object-type), throw a TypeError exception.
3.  Let `iterated` be the [Iterator Record](#sec-iterator-records) { `[[Iterator]]`: `O`, `[[NextMethod]]`: undefined, `[[Done]]`: false }.
4.  If [IsCallable](#sec-iscallable)(`mapper`) is false, then
    1.  Let `error` be [ThrowCompletion](#sec-throwcompletion)(a newly created TypeError object).
    2.  Return ? [IteratorClose](#sec-iteratorclose)(`iterated`, `error`).
5.  Set `iterated` to ? [GetIteratorDirect](#sec-getiteratordirect)(`O`).
6.  Let `closure` be a new [Abstract Closure](#sec-abstract-closure) with no parameters that captures `iterated` and `mapper` and performs the following steps when called:
    1.  Let `counter` be 0.
    2.  Repeat,
        1.  Let `value` be ? [IteratorStepValue](#sec-iteratorstepvalue)(`iterated`).
        2.  If `value` is done, return [ReturnCompletion](#sec-returncompletion)(undefined).
        3.  Let `mapped` be [Completion](#sec-completion-ao)([Call](#sec-call)(`mapper`, undefined, « `value`, [𝔽](#𝔽)(`counter`) »)).
        4.  [IfAbruptCloseIterator](#sec-ifabruptcloseiterator)(`mapped`, `iterated`).
        5.  Let `completion` be [Completion](#sec-completion-ao)([Yield](#sec-yield)(`mapped`)).
        6.  [IfAbruptCloseIterator](#sec-ifabruptcloseiterator)(`completion`, `iterated`).
        7.  Set `counter` to `counter` + 1.
7.  Let `result` be [CreateIteratorFromClosure](#sec-createiteratorfromclosure)(`closure`, "Iterator Helper", [%IteratorHelperPrototype%](#sec-%iteratorhelperprototype%-object), « `[[UnderlyingIterator]]` »).
8.  Set `result`.`[[UnderlyingIterator]]` to `iterated`.
9.  Return `result`.

#### 27.1.4.9 Iterator.prototype.reduce ( `reducer` \[ , `initialValue` \] )

This method performs the following steps when called:

1.  Let `O` be the this value.
2.  If `O` [is not an Object](#sec-object-type), throw a TypeError exception.
3.  Let `iterated` be the [Iterator Record](#sec-iterator-records) { `[[Iterator]]`: `O`, `[[NextMethod]]`: undefined, `[[Done]]`: false }.
4.  If [IsCallable](#sec-iscallable)(`reducer`) is false, then
    1.  Let `error` be [ThrowCompletion](#sec-throwcompletion)(a newly created TypeError object).
    2.  Return ? [IteratorClose](#sec-iteratorclose)(`iterated`, `error`).
5.  Set `iterated` to ? [GetIteratorDirect](#sec-getiteratordirect)(`O`).
6.  If `initialValue` is not present, then
    1.  Let `accumulator` be ? [IteratorStepValue](#sec-iteratorstepvalue)(`iterated`).
    2.  If `accumulator` is done, throw a TypeError exception.
    3.  Let `counter` be 1.
7.  Else,
    1.  Let `accumulator` be `initialValue`.
    2.  Let `counter` be 0.
8.  Repeat,
    1.  Let `value` be ? [IteratorStepValue](#sec-iteratorstepvalue)(`iterated`).
    2.  If `value` is done, return `accumulator`.
    3.  Let `result` be [Completion](#sec-completion-ao)([Call](#sec-call)(`reducer`, undefined, « `accumulator`, `value`, [𝔽](#𝔽)(`counter`) »)).
    4.  [IfAbruptCloseIterator](#sec-ifabruptcloseiterator)(`result`, `iterated`).
    5.  Set `accumulator` to `result`.
    6.  Set `counter` to `counter` + 1.

#### 27.1.4.10 Iterator.prototype.some ( `predicate` )

This method performs the following steps when called:

1.  Let `O` be the this value.
2.  If `O` [is not an Object](#sec-object-type), throw a TypeError exception.
3.  Let `iterated` be the [Iterator Record](#sec-iterator-records) { `[[Iterator]]`: `O`, `[[NextMethod]]`: undefined, `[[Done]]`: false }.
4.  If [IsCallable](#sec-iscallable)(`predicate`) is false, then
    1.  Let `error` be [ThrowCompletion](#sec-throwcompletion)(a newly created TypeError object).
    2.  Return ? [IteratorClose](#sec-iteratorclose)(`iterated`, `error`).
5.  Set `iterated` to ? [GetIteratorDirect](#sec-getiteratordirect)(`O`).
6.  Let `counter` be 0.
7.  Repeat,
    1.  Let `value` be ? [IteratorStepValue](#sec-iteratorstepvalue)(`iterated`).
    2.  If `value` is done, return false.
    3.  Let `result` be [Completion](#sec-completion-ao)([Call](#sec-call)(`predicate`, undefined, « `value`, [𝔽](#𝔽)(`counter`) »)).
    4.  [IfAbruptCloseIterator](#sec-ifabruptcloseiterator)(`result`, `iterated`).
    5.  If [ToBoolean](#sec-toboolean)(`result`) is true, return ? [IteratorClose](#sec-iteratorclose)(`iterated`, [NormalCompletion](#sec-normalcompletion)(true)).
    6.  Set `counter` to `counter` + 1.

#### 27.1.4.11 Iterator.prototype.take ( `limit` )

This method performs the following steps when called:

1.  Let `O` be the this value.
2.  If `O` [is not an Object](#sec-object-type), throw a TypeError exception.
3.  Let `iterated` be the [Iterator Record](#sec-iterator-records) { `[[Iterator]]`: `O`, `[[NextMethod]]`: undefined, `[[Done]]`: false }.
4.  Let `numLimit` be [Completion](#sec-completion-ao)([ToNumber](#sec-tonumber)(`limit`)).
5.  [IfAbruptCloseIterator](#sec-ifabruptcloseiterator)(`numLimit`, `iterated`).
6.  If `numLimit` is NaN, then
    1.  Let `error` be [ThrowCompletion](#sec-throwcompletion)(a newly created RangeError object).
    2.  Return ? [IteratorClose](#sec-iteratorclose)(`iterated`, `error`).
7.  Let `integerLimit` be ! [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`numLimit`).
8.  If `integerLimit` \< 0, then
    1.  Let `error` be [ThrowCompletion](#sec-throwcompletion)(a newly created RangeError object).
    2.  Return ? [IteratorClose](#sec-iteratorclose)(`iterated`, `error`).
9.  Set `iterated` to ? [GetIteratorDirect](#sec-getiteratordirect)(`O`).
10. Let `closure` be a new [Abstract Closure](#sec-abstract-closure) with no parameters that captures `iterated` and `integerLimit` and performs the following steps when called:
    1.  Let `remaining` be `integerLimit`.
    2.  Repeat,
        1.  If `remaining` = 0, then
            1.  Return ? [IteratorClose](#sec-iteratorclose)(`iterated`, [ReturnCompletion](#sec-returncompletion)(undefined)).
        2.  If `remaining` ≠ +∞, then
            1.  Set `remaining` to `remaining` - 1.
        3.  Let `value` be ? [IteratorStepValue](#sec-iteratorstepvalue)(`iterated`).
        4.  If `value` is done, return [ReturnCompletion](#sec-returncompletion)(undefined).
        5.  Let `completion` be [Completion](#sec-completion-ao)([Yield](#sec-yield)(`value`)).
        6.  [IfAbruptCloseIterator](#sec-ifabruptcloseiterator)(`completion`, `iterated`).
11. Let `result` be [CreateIteratorFromClosure](#sec-createiteratorfromclosure)(`closure`, "Iterator Helper", [%IteratorHelperPrototype%](#sec-%iteratorhelperprototype%-object), « `[[UnderlyingIterator]]` »).
12. Set `result`.`[[UnderlyingIterator]]` to `iterated`.
13. Return `result`.

#### 27.1.4.12 Iterator.prototype.toArray ( )

This method performs the following steps when called:

1.  Let `O` be the this value.
2.  If `O` [is not an Object](#sec-object-type), throw a TypeError exception.
3.  Let `iterated` be ? [GetIteratorDirect](#sec-getiteratordirect)(`O`).
4.  Let `items` be a new empty [List](#sec-list-and-record-specification-type).
5.  Repeat,
    1.  Let `value` be ? [IteratorStepValue](#sec-iteratorstepvalue)(`iterated`).
    2.  If `value` is done, return [CreateArrayFromList](#sec-createarrayfromlist)(`items`).
    3.  Append `value` to `items`.

#### 27.1.4.13 Iterator.prototype \[ %Symbol.iterator% \] ( )

This function performs the following steps when called:

1.  Return the this value.

The value of the "name" property of this function is "\[Symbol.iterator\]".

#### 27.1.4.14 Iterator.prototype \[ %Symbol.toStringTag% \]

`Iterator.prototype[%Symbol.toStringTag%]` is an [accessor property](#sec-object-type) with attributes { `[[Enumerable]]`: false, `[[Configurable]]`: true }. The `[[Get]]` and `[[Set]]` attributes are defined as follows:

##### 27.1.4.14.1 get Iterator.prototype \[ %Symbol.toStringTag% \]

The value of the `[[Get]]` attribute is a built-in function that requires no arguments. It performs the following steps when called:

1.  Return "Iterator".

##### 27.1.4.14.2 set Iterator.prototype \[ %Symbol.toStringTag% \]

The value of the `[[Set]]` attribute is a built-in function that takes an argument `v`. It performs the following steps when called:

1.  Perform ? [SetterThatIgnoresPrototypeProperties](#sec-SetterThatIgnoresPrototypeProperties)(this value, [%Iterator.prototype%](#sec-%iterator.prototype%-object), [%Symbol.toStringTag%](#sec-well-known-symbols), `v`).
2.  Return undefined.

Note

Unlike the [%Symbol.toStringTag%](#sec-well-known-symbols) property on most built-in prototypes, for web-compatibility reasons this property must be an accessor.

### 27.1.5 The %AsyncIteratorPrototype% Object

The %AsyncIteratorPrototype% object:

- has a `[[Prototype]]` internal slot whose value is [%Object.prototype%](#sec-properties-of-the-object-prototype-object).
- is an [ordinary object](#ordinary-object).

Note

All objects defined in this specification that implement the [async iterator interface](#sec-asynciterator-interface) also inherit from %AsyncIteratorPrototype%. ECMAScript code may also define objects that inherit from %AsyncIteratorPrototype%. The %AsyncIteratorPrototype% object provides a place where additional methods that are applicable to all [async iterator objects](#sec-asynciterator-interface) may be added.

#### 27.1.5.1 %AsyncIteratorPrototype% \[ %Symbol.asyncIterator% \] ( )

This function performs the following steps when called:

1.  Return the this value.

The value of the "name" property of this function is "\[Symbol.asyncIterator\]".

### 27.1.6 Async-from-Sync Iterator Objects

An Async-from-Sync Iterator object is an [async iterator](#sec-asynciterator-interface) that adapts a specific synchronous [iterator](#sec-iterator-interface). Async-from-Sync Iterator objects are never directly accessible to ECMAScript code. There is not a named [constructor](#constructor) for Async-from-Sync Iterator objects. Instead, Async-from-Sync Iterator objects are created by the [CreateAsyncFromSyncIterator](#sec-createasyncfromsynciterator) abstract operation as needed.

#### 27.1.6.1 CreateAsyncFromSyncIterator ( `syncIteratorRecord` )

The abstract operation CreateAsyncFromSyncIterator takes argument `syncIteratorRecord` (an [Iterator Record](#sec-iterator-records)) and returns an [Iterator Record](#sec-iterator-records). It is used to create an async [Iterator Record](#sec-iterator-records) from a synchronous [Iterator Record](#sec-iterator-records). It performs the following steps when called:

1.  Let `asyncIterator` be [OrdinaryObjectCreate](#sec-ordinaryobjectcreate)([%AsyncFromSyncIteratorPrototype%](#sec-%asyncfromsynciteratorprototype%-object), « `[[SyncIteratorRecord]]` »).
2.  Set `asyncIterator`.`[[SyncIteratorRecord]]` to `syncIteratorRecord`.
3.  Let `nextMethod` be ! [Get](#sec-get-o-p)(`asyncIterator`, "next").
4.  Let `iteratorRecord` be the [Iterator Record](#sec-iterator-records) { `[[Iterator]]`: `asyncIterator`, `[[NextMethod]]`: `nextMethod`, `[[Done]]`: false }.
5.  Return `iteratorRecord`.

#### 27.1.6.2 The %AsyncFromSyncIteratorPrototype% Object

The %AsyncFromSyncIteratorPrototype% object:

- has properties that are inherited by all [Async-from-Sync Iterator objects](#sec-async-from-sync-iterator-objects).
- is an [ordinary object](#ordinary-object).
- has a `[[Prototype]]` internal slot whose value is [%AsyncIteratorPrototype%](#sec-asynciteratorprototype).
- is never directly accessible to ECMAScript code.
- has the following properties:

##### 27.1.6.2.1 %AsyncFromSyncIteratorPrototype%.next ( \[ `value` \] )

1.  Let `O` be the this value.
2.  [Assert](#assert): `O` [is an Object](#sec-object-type) that has a `[[SyncIteratorRecord]]` internal slot.
3.  Let `promiseCapability` be ! [NewPromiseCapability](#sec-newpromisecapability)([%Promise%](#sec-promise-constructor)).
4.  Let `syncIteratorRecord` be `O`.`[[SyncIteratorRecord]]`.
5.  If `value` is present, then
    1.  Let `result` be [Completion](#sec-completion-ao)([IteratorNext](#sec-iteratornext)(`syncIteratorRecord`, `value`)).
6.  Else,
    1.  Let `result` be [Completion](#sec-completion-ao)([IteratorNext](#sec-iteratornext)(`syncIteratorRecord`)).
7.  [IfAbruptRejectPromise](#sec-ifabruptrejectpromise)(`result`, `promiseCapability`).
8.  Return [AsyncFromSyncIteratorContinuation](#sec-asyncfromsynciteratorcontinuation)(`result`, `promiseCapability`, `syncIteratorRecord`, true).

##### 27.1.6.2.2 %AsyncFromSyncIteratorPrototype%.return ( \[ `value` \] )

1.  Let `O` be the this value.
2.  [Assert](#assert): `O` [is an Object](#sec-object-type) that has a `[[SyncIteratorRecord]]` internal slot.
3.  Let `promiseCapability` be ! [NewPromiseCapability](#sec-newpromisecapability)([%Promise%](#sec-promise-constructor)).
4.  Let `syncIteratorRecord` be `O`.`[[SyncIteratorRecord]]`.
5.  Let `syncIterator` be `syncIteratorRecord`.`[[Iterator]]`.
6.  Let `return` be [Completion](#sec-completion-ao)([GetMethod](#sec-getmethod)(`syncIterator`, "return")).
7.  [IfAbruptRejectPromise](#sec-ifabruptrejectpromise)(`return`, `promiseCapability`).
8.  If `return` is undefined, then
    1.  Let `iteratorResult` be [CreateIteratorResultObject](#sec-createiterresultobject)(`value`, true).
    2.  Perform ! Call(`promiseCapability`.`[[Resolve]]`, undefined, « `iteratorResult` »).
    3.  Return `promiseCapability`.`[[Promise]]`.
9.  If `value` is present, then
    1.  Let `result` be [Completion](#sec-completion-ao)([Call](#sec-call)(`return`, `syncIterator`, « `value` »)).
10. Else,
    1.  Let `result` be [Completion](#sec-completion-ao)([Call](#sec-call)(`return`, `syncIterator`)).
11. [IfAbruptRejectPromise](#sec-ifabruptrejectpromise)(`result`, `promiseCapability`).
12. If `result` [is not an Object](#sec-object-type), then
    1.  Perform ! [Call](#sec-call)(`promiseCapability`.`[[Reject]]`, undefined, « a newly created TypeError object »).
    2.  Return `promiseCapability`.`[[Promise]]`.
13. Return [AsyncFromSyncIteratorContinuation](#sec-asyncfromsynciteratorcontinuation)(`result`, `promiseCapability`, `syncIteratorRecord`, false).

##### 27.1.6.2.3 %AsyncFromSyncIteratorPrototype%.throw ( \[ `value` \] )

Note

In this specification, `value` is always provided, but is left optional for consistency with [%AsyncFromSyncIteratorPrototype%.return ( \[ `value` \] )](#sec-%asyncfromsynciteratorprototype%.return).

1.  Let `O` be the this value.
2.  [Assert](#assert): `O` [is an Object](#sec-object-type) that has a `[[SyncIteratorRecord]]` internal slot.
3.  Let `promiseCapability` be ! [NewPromiseCapability](#sec-newpromisecapability)([%Promise%](#sec-promise-constructor)).
4.  Let `syncIteratorRecord` be `O`.`[[SyncIteratorRecord]]`.
5.  Let `syncIterator` be `syncIteratorRecord`.`[[Iterator]]`.
6.  Let `throw` be [Completion](#sec-completion-ao)([GetMethod](#sec-getmethod)(`syncIterator`, "throw")).
7.  [IfAbruptRejectPromise](#sec-ifabruptrejectpromise)(`throw`, `promiseCapability`).
8.  If `throw` is undefined, then
    1.  NOTE: If `syncIterator` does not have a `throw` method, close it to give it a chance to clean up before we reject the capability.
    2.  Let `closeCompletion` be [NormalCompletion](#sec-normalcompletion)(empty).
    3.  Let `result` be [Completion](#sec-completion-ao)([IteratorClose](#sec-iteratorclose)(`syncIteratorRecord`, `closeCompletion`)).
    4.  [IfAbruptRejectPromise](#sec-ifabruptrejectpromise)(`result`, `promiseCapability`).
    5.  NOTE: The next step throws a TypeError to indicate that there was a protocol violation: `syncIterator` does not have a `throw` method.
    6.  NOTE: If closing `syncIterator` does not throw then the result of that operation is ignored, even if it yields a rejected promise.
    7.  Perform ! [Call](#sec-call)(`promiseCapability`.`[[Reject]]`, undefined, « a newly created TypeError object »).
    8.  Return `promiseCapability`.`[[Promise]]`.
9.  If `value` is present, then
    1.  Let `result` be [Completion](#sec-completion-ao)([Call](#sec-call)(`throw`, `syncIterator`, « `value` »)).
10. Else,
    1.  Let `result` be [Completion](#sec-completion-ao)([Call](#sec-call)(`throw`, `syncIterator`)).
11. [IfAbruptRejectPromise](#sec-ifabruptrejectpromise)(`result`, `promiseCapability`).
12. If `result` [is not an Object](#sec-object-type), then
    1.  Perform ! [Call](#sec-call)(`promiseCapability`.`[[Reject]]`, undefined, « a newly created TypeError object »).
    2.  Return `promiseCapability`.`[[Promise]]`.
13. Return [AsyncFromSyncIteratorContinuation](#sec-asyncfromsynciteratorcontinuation)(`result`, `promiseCapability`, `syncIteratorRecord`, true).

#### 27.1.6.3 Properties of Async-from-Sync Iterator Instances

Async-from-Sync [Iterator](#sec-iterator-interface) instances are [ordinary objects](#ordinary-object) that inherit properties from the [%AsyncFromSyncIteratorPrototype%](#sec-%asyncfromsynciteratorprototype%-object) intrinsic object. Async-from-Sync [Iterator](#sec-iterator-interface) instances are initially created with the internal slots listed in [Table 87](#table-async-from-sync-iterator-internal-slots).

| Internal Slot | Type | Description |
|----|----|----|
| `[[SyncIteratorRecord]]` | an [Iterator Record](#sec-iterator-records) | Represents the original synchronous [iterator](#sec-iterator-interface) which is being adapted. |

Table 87: Internal Slots of Async-from-Sync [Iterator](#sec-iterator-interface) Instances

#### 27.1.6.4 AsyncFromSyncIteratorContinuation ( `result`, `promiseCapability`, `syncIteratorRecord`, `closeOnRejection` )

The abstract operation AsyncFromSyncIteratorContinuation takes arguments `result` (an Object), `promiseCapability` (a [PromiseCapability Record](#sec-promisecapability-records) for an intrinsic [%Promise%](#sec-promise-constructor)), `syncIteratorRecord` (an [Iterator Record](#sec-iterator-records)), and `closeOnRejection` (a Boolean) and returns a Promise. It performs the following steps when called:

1.  NOTE: Because `promiseCapability` is derived from the intrinsic [%Promise%](#sec-promise-constructor), the calls to `promiseCapability`.`[[Reject]]` entailed by the use [IfAbruptRejectPromise](#sec-ifabruptrejectpromise) below are guaranteed not to throw.
2.  Let `done` be [Completion](#sec-completion-ao)([IteratorComplete](#sec-iteratorcomplete)(`result`)).
3.  [IfAbruptRejectPromise](#sec-ifabruptrejectpromise)(`done`, `promiseCapability`).
4.  Let `value` be [Completion](#sec-completion-ao)([IteratorValue](#sec-iteratorvalue)(`result`)).
5.  [IfAbruptRejectPromise](#sec-ifabruptrejectpromise)(`value`, `promiseCapability`).
6.  Let `valueWrapper` be [Completion](#sec-completion-ao)([PromiseResolve](#sec-promise-resolve)([%Promise%](#sec-promise-constructor), `value`)).
7.  If `valueWrapper` is an [abrupt completion](#sec-completion-record-specification-type), `done` is false, and `closeOnRejection` is true, then
    1.  Set `valueWrapper` to [Completion](#sec-completion-ao)([IteratorClose](#sec-iteratorclose)(`syncIteratorRecord`, `valueWrapper`)).
8.  [IfAbruptRejectPromise](#sec-ifabruptrejectpromise)(`valueWrapper`, `promiseCapability`).
9.  Let `unwrap` be a new [Abstract Closure](#sec-abstract-closure) with parameters (`v`) that captures `done` and performs the following steps when called:
    1.  Return [CreateIteratorResultObject](#sec-createiterresultobject)(`v`, `done`).
10. Let `onFulfilled` be [CreateBuiltinFunction](#sec-createbuiltinfunction)(`unwrap`, 1, "", « »).
11. NOTE: `onFulfilled` is used when processing the "value" property of an [IteratorResult object](#sec-iteratorresult-interface) in order to wait for its value if it is a promise and re-package the result in a new "unwrapped" [IteratorResult object](#sec-iteratorresult-interface).
12. If `done` is true, or if `closeOnRejection` is false, then
    1.  Let `onRejected` be undefined.
13. Else,
    1.  Let `closeIterator` be a new [Abstract Closure](#sec-abstract-closure) with parameters (`error`) that captures `syncIteratorRecord` and performs the following steps when called:
        1.  Return ? [IteratorClose](#sec-iteratorclose)(`syncIteratorRecord`, [ThrowCompletion](#sec-throwcompletion)(`error`)).
    2.  Let `onRejected` be [CreateBuiltinFunction](#sec-createbuiltinfunction)(`closeIterator`, 1, "", « »).
    3.  NOTE: `onRejected` is used to close the [Iterator](#sec-iterator-interface) when the "value" property of an [IteratorResult object](#sec-iteratorresult-interface) it yields is a rejected promise.
14. Perform [PerformPromiseThen](#sec-performpromisethen)(`valueWrapper`, `onFulfilled`, `onRejected`, `promiseCapability`).
15. Return `promiseCapability`.`[[Promise]]`.

## 27.2 Promise Objects

A Promise is an object that is used as a placeholder for the eventual results of a deferred (and possibly asynchronous) computation.

Any Promise is in one of three mutually exclusive states: *fulfilled*, *rejected*, and *pending*:

- A promise `p` is fulfilled if `p.then(f, r)` will immediately enqueue a [Job](#job) to call the function `f`.
- A promise `p` is rejected if `p.then(f, r)` will immediately enqueue a [Job](#job) to call the function `r`.
- A promise is pending if it is neither fulfilled nor rejected.

A promise is said to be *settled* if it is not pending, i.e. if it is either fulfilled or rejected.

A promise is *resolved* if it is settled or if it has been “locked in” to match the state of another promise. Attempting to resolve or reject a resolved promise has no effect. A promise is *unresolved* if it is not resolved. An unresolved promise is always in the pending state. A resolved promise may be pending, fulfilled or rejected.

### 27.2.1 Promise Abstract Operations

#### 27.2.1.1 PromiseCapability Records

A PromiseCapability Record is a [Record](#sec-list-and-record-specification-type) value used to encapsulate a Promise or promise-like object along with the functions that are capable of resolving or rejecting that promise. PromiseCapability Records are produced by the [NewPromiseCapability](#sec-newpromisecapability) abstract operation.

PromiseCapability Records have the fields listed in [Table 88](#table-promisecapability-record-fields).

| Field Name | Value | Meaning |
|----|----|----|
| `[[Promise]]` | an Object | An object that is usable as a promise. |
| `[[Resolve]]` | a [function object](#function-object) | The function that is used to resolve the given promise. |
| `[[Reject]]` | a [function object](#function-object) | The function that is used to reject the given promise. |

Table 88: [PromiseCapability Record](#sec-promisecapability-records) Fields

##### 27.2.1.1.1 IfAbruptRejectPromise ( `value`, `capability` )

IfAbruptRejectPromise is a shorthand for a sequence of algorithm steps that use a [PromiseCapability Record](#sec-promisecapability-records). An algorithm step of the form:

1.  [IfAbruptRejectPromise](#sec-ifabruptrejectpromise)(`value`, `capability`).

means the same thing as:

1.  [Assert](#assert): `value` is a [Completion Record](#sec-completion-record-specification-type).
2.  If `value` is an [abrupt completion](#sec-completion-record-specification-type), then
    1.  Perform ? [Call](#sec-call)(`capability`.`[[Reject]]`, undefined, « `value`.`[[Value]]` »).
    2.  Return `capability`.`[[Promise]]`.
3.  Else,
    1.  Set `value` to ! `value`.

#### 27.2.1.2 PromiseReaction Records

A PromiseReaction Record is a [Record](#sec-list-and-record-specification-type) value used to store information about how a promise should react when it becomes resolved or rejected with a given value. PromiseReaction Records are created by the [PerformPromiseThen](#sec-performpromisethen) abstract operation, and are used by the [Abstract Closure](#sec-abstract-closure) returned by [NewPromiseReactionJob](#sec-newpromisereactionjob).

PromiseReaction Records have the fields listed in [Table 89](#table-promisereaction-record-fields).

| Field Name | Value | Meaning |
|----|----|----|
| `[[Capability]]` | a [PromiseCapability Record](#sec-promisecapability-records) or undefined | The capabilities of the promise for which this record provides a reaction handler. |
| `[[Type]]` | fulfill or reject | The `[[Type]]` is used when `[[Handler]]` is empty to allow for behaviour specific to the settlement type. |
| `[[Handler]]` | a [JobCallback Record](#sec-jobcallback-records) or empty | The function that should be applied to the incoming value, and whose return value will govern what happens to the derived promise. If `[[Handler]]` is empty, a function that depends on the value of `[[Type]]` will be used instead. |

Table 89: [PromiseReaction Record](#sec-promisereaction-records) Fields

#### 27.2.1.3 CreateResolvingFunctions ( `promise` )

The abstract operation CreateResolvingFunctions takes argument `promise` (a Promise) and returns a [Record](#sec-list-and-record-specification-type) with fields `[[Resolve]]` (a [function object](#function-object)) and `[[Reject]]` (a [function object](#function-object)). It performs the following steps when called:

1.  Let `alreadyResolved` be the [Record](#sec-list-and-record-specification-type) { `[[Value]]`: false }.
2.  Let `stepsResolve` be the algorithm steps defined in [Promise Resolve Functions](#sec-promise-resolve-functions).
3.  Let `lengthResolve` be the number of non-optional parameters of the function definition in [Promise Resolve Functions](#sec-promise-resolve-functions).
4.  Let `resolve` be [CreateBuiltinFunction](#sec-createbuiltinfunction)(`stepsResolve`, `lengthResolve`, "", « `[[Promise]]`, `[[AlreadyResolved]]` »).
5.  Set `resolve`.`[[Promise]]` to `promise`.
6.  Set `resolve`.`[[AlreadyResolved]]` to `alreadyResolved`.
7.  Let `stepsReject` be the algorithm steps defined in [Promise Reject Functions](#sec-promise-reject-functions).
8.  Let `lengthReject` be the number of non-optional parameters of the function definition in [Promise Reject Functions](#sec-promise-reject-functions).
9.  Let `reject` be [CreateBuiltinFunction](#sec-createbuiltinfunction)(`stepsReject`, `lengthReject`, "", « `[[Promise]]`, `[[AlreadyResolved]]` »).
10. Set `reject`.`[[Promise]]` to `promise`.
11. Set `reject`.`[[AlreadyResolved]]` to `alreadyResolved`.
12. Return the [Record](#sec-list-and-record-specification-type) { `[[Resolve]]`: `resolve`, `[[Reject]]`: `reject` }.

##### 27.2.1.3.1 Promise Reject Functions

A promise reject function is an anonymous built-in function that has `[[Promise]]` and `[[AlreadyResolved]]` internal slots.

When a promise reject function is called with argument `reason`, the following steps are taken:

1.  Let `F` be the [active function object](#active-function-object).
2.  [Assert](#assert): `F` has a `[[Promise]]` internal slot whose value [is an Object](#sec-object-type).
3.  Let `promise` be `F`.`[[Promise]]`.
4.  Let `alreadyResolved` be `F`.`[[AlreadyResolved]]`.
5.  If `alreadyResolved`.`[[Value]]` is true, return undefined.
6.  Set `alreadyResolved`.`[[Value]]` to true.
7.  Perform [RejectPromise](#sec-rejectpromise)(`promise`, `reason`).
8.  Return undefined.

The "length" property of a promise reject function is 1_(𝔽).

##### 27.2.1.3.2 Promise Resolve Functions

A promise resolve function is an anonymous built-in function that has `[[Promise]]` and `[[AlreadyResolved]]` internal slots.

When a promise resolve function is called with argument `resolution`, the following steps are taken:

1.  Let `F` be the [active function object](#active-function-object).
2.  [Assert](#assert): `F` has a `[[Promise]]` internal slot whose value [is an Object](#sec-object-type).
3.  Let `promise` be `F`.`[[Promise]]`.
4.  Let `alreadyResolved` be `F`.`[[AlreadyResolved]]`.
5.  If `alreadyResolved`.`[[Value]]` is true, return undefined.
6.  Set `alreadyResolved`.`[[Value]]` to true.
7.  If [SameValue](#sec-samevalue)(`resolution`, `promise`) is true, then
    1.  Let `selfResolutionError` be a newly created TypeError object.
    2.  Perform [RejectPromise](#sec-rejectpromise)(`promise`, `selfResolutionError`).
    3.  Return undefined.
8.  If `resolution` [is not an Object](#sec-object-type), then
    1.  Perform [FulfillPromise](#sec-fulfillpromise)(`promise`, `resolution`).
    2.  Return undefined.
9.  Let `then` be [Completion](#sec-completion-ao)([Get](#sec-get-o-p)(`resolution`, "then")).
10. If `then` is an [abrupt completion](#sec-completion-record-specification-type), then
    1.  Perform [RejectPromise](#sec-rejectpromise)(`promise`, `then`.`[[Value]]`).
    2.  Return undefined.
11. Let `thenAction` be `then`.`[[Value]]`.
12. If [IsCallable](#sec-iscallable)(`thenAction`) is false, then
    1.  Perform [FulfillPromise](#sec-fulfillpromise)(`promise`, `resolution`).
    2.  Return undefined.
13. Let `thenJobCallback` be [HostMakeJobCallback](#sec-hostmakejobcallback)(`thenAction`).
14. Let `job` be [NewPromiseResolveThenableJob](#sec-newpromiseresolvethenablejob)(`promise`, `resolution`, `thenJobCallback`).
15. Perform [HostEnqueuePromiseJob](#sec-hostenqueuepromisejob)(`job`.`[[Job]]`, `job`.`[[Realm]]`).
16. Return undefined.

The "length" property of a promise resolve function is 1_(𝔽).

#### 27.2.1.4 FulfillPromise ( `promise`, `value` )

The abstract operation FulfillPromise takes arguments `promise` (a Promise) and `value` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns unused. It performs the following steps when called:

1.  [Assert](#assert): The value of `promise`.`[[PromiseState]]` is pending.
2.  Let `reactions` be `promise`.`[[PromiseFulfillReactions]]`.
3.  Set `promise`.`[[PromiseResult]]` to `value`.
4.  Set `promise`.`[[PromiseFulfillReactions]]` to undefined.
5.  Set `promise`.`[[PromiseRejectReactions]]` to undefined.
6.  Set `promise`.`[[PromiseState]]` to fulfilled.
7.  Perform [TriggerPromiseReactions](#sec-triggerpromisereactions)(`reactions`, `value`).
8.  Return unused.

#### 27.2.1.5 NewPromiseCapability ( `C` )

The abstract operation NewPromiseCapability takes argument `C` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a [PromiseCapability Record](#sec-promisecapability-records) or a [throw completion](#sec-completion-record-specification-type). It attempts to use `C` as a [constructor](#constructor) in the fashion of the built-in Promise [constructor](#constructor) to create a promise and extract its `resolve` and `reject` functions. The promise plus the `resolve` and `reject` functions are used to initialize a new [PromiseCapability Record](#sec-promisecapability-records). It performs the following steps when called:

1.  If [IsConstructor](#sec-isconstructor)(`C`) is false, throw a TypeError exception.
2.  NOTE: `C` is assumed to be a [constructor](#constructor) function that supports the parameter conventions of the Promise [constructor](#constructor) (see [27.2.3.1](#sec-promise-executor)).
3.  Let `resolvingFunctions` be the [Record](#sec-list-and-record-specification-type) { `[[Resolve]]`: undefined, `[[Reject]]`: undefined }.
4.  Let `executorClosure` be a new [Abstract Closure](#sec-abstract-closure) with parameters (`resolve`, `reject`) that captures `resolvingFunctions` and performs the following steps when called:
    1.  If `resolvingFunctions`.`[[Resolve]]` is not undefined, throw a TypeError exception.
    2.  If `resolvingFunctions`.`[[Reject]]` is not undefined, throw a TypeError exception.
    3.  Set `resolvingFunctions`.`[[Resolve]]` to `resolve`.
    4.  Set `resolvingFunctions`.`[[Reject]]` to `reject`.
    5.  Return undefined.
5.  Let `executor` be [CreateBuiltinFunction](#sec-createbuiltinfunction)(`executorClosure`, 2, "", « »).
6.  Let `promise` be ? [Construct](#sec-construct)(`C`, « `executor` »).
7.  If [IsCallable](#sec-iscallable)(`resolvingFunctions`.`[[Resolve]]`) is false, throw a TypeError exception.
8.  If [IsCallable](#sec-iscallable)(`resolvingFunctions`.`[[Reject]]`) is false, throw a TypeError exception.
9.  Return the [PromiseCapability Record](#sec-promisecapability-records) { `[[Promise]]`: `promise`, `[[Resolve]]`: `resolvingFunctions`.`[[Resolve]]`, `[[Reject]]`: `resolvingFunctions`.`[[Reject]]` }.

Note

This abstract operation supports Promise subclassing, as it is generic on any [constructor](#constructor) that calls a passed executor function argument in the same way as the Promise [constructor](#constructor). It is used to generalize static methods of the Promise [constructor](#constructor) to any subclass.

#### 27.2.1.6 IsPromise ( `x` )

The abstract operation IsPromise takes argument `x` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns a Boolean. It checks for the promise brand on an object. It performs the following steps when called:

1.  If `x` [is not an Object](#sec-object-type), return false.
2.  If `x` does not have a `[[PromiseState]]` internal slot, return false.
3.  Return true.

#### 27.2.1.7 RejectPromise ( `promise`, `reason` )

The abstract operation RejectPromise takes arguments `promise` (a Promise) and `reason` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns unused. It performs the following steps when called:

1.  [Assert](#assert): The value of `promise`.`[[PromiseState]]` is pending.
2.  Let `reactions` be `promise`.`[[PromiseRejectReactions]]`.
3.  Set `promise`.`[[PromiseResult]]` to `reason`.
4.  Set `promise`.`[[PromiseFulfillReactions]]` to undefined.
5.  Set `promise`.`[[PromiseRejectReactions]]` to undefined.
6.  Set `promise`.`[[PromiseState]]` to rejected.
7.  If `promise`.`[[PromiseIsHandled]]` is false, perform [HostPromiseRejectionTracker](#sec-host-promise-rejection-tracker)(`promise`, "reject").
8.  Perform [TriggerPromiseReactions](#sec-triggerpromisereactions)(`reactions`, `reason`).
9.  Return unused.

#### 27.2.1.8 TriggerPromiseReactions ( `reactions`, `argument` )

The abstract operation TriggerPromiseReactions takes arguments `reactions` (a [List](#sec-list-and-record-specification-type) of [PromiseReaction Records](#sec-promisereaction-records)) and `argument` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns unused. It enqueues a new [Job](#job) for each record in `reactions`. Each such [Job](#job) processes the `[[Type]]` and `[[Handler]]` of the [PromiseReaction Record](#sec-promisereaction-records), and if the `[[Handler]]` is not empty, calls it passing the given argument. If the `[[Handler]]` is empty, the behaviour is determined by the `[[Type]]`. It performs the following steps when called:

1.  For each element `reaction` of `reactions`, do
    1.  Let `job` be [NewPromiseReactionJob](#sec-newpromisereactionjob)(`reaction`, `argument`).
    2.  Perform [HostEnqueuePromiseJob](#sec-hostenqueuepromisejob)(`job`.`[[Job]]`, `job`.`[[Realm]]`).
2.  Return unused.

#### 27.2.1.9 HostPromiseRejectionTracker ( `promise`, `operation` )

The [host-defined](#host-defined) abstract operation HostPromiseRejectionTracker takes arguments `promise` (a Promise) and `operation` ("reject" or "handle") and returns unused. It allows [host environments](#host-environment) to track promise rejections.

The default implementation of HostPromiseRejectionTracker is to return unused.

Note 1

HostPromiseRejectionTracker is called in two scenarios:

- When a promise is rejected without any handlers, it is called with its `operation` argument set to "reject".
- When a handler is added to a rejected promise for the first time, it is called with its `operation` argument set to "handle".

A typical implementation of HostPromiseRejectionTracker might try to notify developers of unhandled rejections, while also being careful to notify them if such previous notifications are later invalidated by new handlers being attached.

Note 2

If `operation` is "handle", an implementation should not hold a reference to `promise` in a way that would interfere with garbage collection. An implementation may hold a reference to `promise` if `operation` is "reject", since it is expected that rejections will be rare and not on hot code paths.

### 27.2.2 Promise Jobs

#### 27.2.2.1 NewPromiseReactionJob ( `reaction`, `argument` )

The abstract operation NewPromiseReactionJob takes arguments `reaction` (a [PromiseReaction Record](#sec-promisereaction-records)) and `argument` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns a [Record](#sec-list-and-record-specification-type) with fields `[[Job]]` (a [Job](#job) [Abstract Closure](#sec-abstract-closure)) and `[[Realm]]` (a [Realm Record](#realm-record) or null). It returns a new [Job](#job) [Abstract Closure](#sec-abstract-closure) that applies the appropriate handler to the incoming value, and uses the handler's return value to resolve or reject the derived promise associated with that handler. It performs the following steps when called:

1.  Let `job` be a new [Job](#job) [Abstract Closure](#sec-abstract-closure) with no parameters that captures `reaction` and `argument` and performs the following steps when called:
    1.  Let `promiseCapability` be `reaction`.`[[Capability]]`.
    2.  Let `type` be `reaction`.`[[Type]]`.
    3.  Let `handler` be `reaction`.`[[Handler]]`.
    4.  If `handler` is empty, then
        1.  If `type` is fulfill, then
            1.  Let `handlerResult` be [NormalCompletion](#sec-normalcompletion)(`argument`).
        2.  Else,
            1.  [Assert](#assert): `type` is reject.
            2.  Let `handlerResult` be [ThrowCompletion](#sec-throwcompletion)(`argument`).
    5.  Else,
        1.  Let `handlerResult` be [Completion](#sec-completion-ao)([HostCallJobCallback](#sec-hostcalljobcallback)(`handler`, undefined, « `argument` »)).
    6.  If `promiseCapability` is undefined, then
        1.  [Assert](#assert): `handlerResult` is not an [abrupt completion](#sec-completion-record-specification-type).
        2.  Return empty.
    7.  [Assert](#assert): `promiseCapability` is a [PromiseCapability Record](#sec-promisecapability-records).
    8.  If `handlerResult` is an [abrupt completion](#sec-completion-record-specification-type), then
        1.  Return ? [Call](#sec-call)(`promiseCapability`.`[[Reject]]`, undefined, « `handlerResult`.`[[Value]]` »).
    9.  Else,
        1.  Return ? [Call](#sec-call)(`promiseCapability`.`[[Resolve]]`, undefined, « `handlerResult`.`[[Value]]` »).
2.  Let `handlerRealm` be null.
3.  If `reaction`.`[[Handler]]` is not empty, then
    1.  Let `getHandlerRealmResult` be [Completion](#sec-completion-ao)([GetFunctionRealm](#sec-getfunctionrealm)(`reaction`.`[[Handler]]`.`[[Callback]]`)).
    2.  If `getHandlerRealmResult` is a [normal completion](#sec-completion-record-specification-type), set `handlerRealm` to `getHandlerRealmResult`.`[[Value]]`.
    3.  Else, set `handlerRealm` to [the current Realm Record](#current-realm).
    4.  NOTE: `handlerRealm` is never null unless the handler is undefined. When the handler is a revoked Proxy and no ECMAScript code runs, `handlerRealm` is used to create error objects.
4.  Return the [Record](#sec-list-and-record-specification-type) { `[[Job]]`: `job`, `[[Realm]]`: `handlerRealm` }.

#### 27.2.2.2 NewPromiseResolveThenableJob ( `promiseToResolve`, `thenable`, `then` )

The abstract operation NewPromiseResolveThenableJob takes arguments `promiseToResolve` (a Promise), `thenable` (an Object), and `then` (a [JobCallback Record](#sec-jobcallback-records)) and returns a [Record](#sec-list-and-record-specification-type) with fields `[[Job]]` (a [Job](#job) [Abstract Closure](#sec-abstract-closure)) and `[[Realm]]` (a [Realm Record](#realm-record)). It performs the following steps when called:

1.  Let `job` be a new [Job](#job) [Abstract Closure](#sec-abstract-closure) with no parameters that captures `promiseToResolve`, `thenable`, and `then` and performs the following steps when called:
    1.  Let `resolvingFunctions` be [CreateResolvingFunctions](#sec-createresolvingfunctions)(`promiseToResolve`).
    2.  Let `thenCallResult` be [Completion](#sec-completion-ao)([HostCallJobCallback](#sec-hostcalljobcallback)(`then`, `thenable`, « `resolvingFunctions`.`[[Resolve]]`, `resolvingFunctions`.`[[Reject]]` »)).
    3.  If `thenCallResult` is an [abrupt completion](#sec-completion-record-specification-type), then
        1.  Return ? [Call](#sec-call)(`resolvingFunctions`.`[[Reject]]`, undefined, « `thenCallResult`.`[[Value]]` »).
    4.  Return ? `thenCallResult`.
2.  Let `getThenRealmResult` be [Completion](#sec-completion-ao)([GetFunctionRealm](#sec-getfunctionrealm)(`then`.`[[Callback]]`)).
3.  If `getThenRealmResult` is a [normal completion](#sec-completion-record-specification-type), let `thenRealm` be `getThenRealmResult`.`[[Value]]`.
4.  Else, let `thenRealm` be [the current Realm Record](#current-realm).
5.  NOTE: `thenRealm` is never null. When `then`.`[[Callback]]` is a revoked Proxy and no code runs, `thenRealm` is used to create error objects.
6.  Return the [Record](#sec-list-and-record-specification-type) { `[[Job]]`: `job`, `[[Realm]]`: `thenRealm` }.

Note

This [Job](#job) uses the supplied thenable and its `then` method to resolve the given promise. This process must take place as a [Job](#job) to ensure that the evaluation of the `then` method occurs after evaluation of any surrounding code has completed.

### 27.2.3 The Promise Constructor

The Promise [constructor](#constructor):

- is %Promise%.
- is the initial value of the "Promise" property of the [global object](#sec-global-object).
- creates and initializes a new Promise when called as a [constructor](#constructor).
- is not intended to be called as a function and will throw an exception when called in that manner.
- may be used as the value in an `extends` clause of a class definition. Subclass [constructors](#constructor) that intend to inherit the specified Promise behaviour must include a `super` call to the Promise [constructor](#constructor) to create and initialize the subclass instance with the internal state necessary to support the `Promise` and `Promise.prototype` built-in methods.

#### 27.2.3.1 Promise ( `executor` )

This function performs the following steps when called:

1.  If NewTarget is undefined, throw a TypeError exception.
2.  If [IsCallable](#sec-iscallable)(`executor`) is false, throw a TypeError exception.
3.  Let `promise` be ? [OrdinaryCreateFromConstructor](#sec-ordinarycreatefromconstructor)(NewTarget, "%Promise.prototype%", « `[[PromiseState]]`, `[[PromiseResult]]`, `[[PromiseFulfillReactions]]`, `[[PromiseRejectReactions]]`, `[[PromiseIsHandled]]` »).
4.  Set `promise`.`[[PromiseState]]` to pending.
5.  Set `promise`.`[[PromiseResult]]` to empty.
6.  Set `promise`.`[[PromiseFulfillReactions]]` to a new empty [List](#sec-list-and-record-specification-type).
7.  Set `promise`.`[[PromiseRejectReactions]]` to a new empty [List](#sec-list-and-record-specification-type).
8.  Set `promise`.`[[PromiseIsHandled]]` to false.
9.  Let `resolvingFunctions` be [CreateResolvingFunctions](#sec-createresolvingfunctions)(`promise`).
10. Let `completion` be [Completion](#sec-completion-ao)([Call](#sec-call)(`executor`, undefined, « `resolvingFunctions`.`[[Resolve]]`, `resolvingFunctions`.`[[Reject]]` »)).
11. If `completion` is an [abrupt completion](#sec-completion-record-specification-type), then
    1.  Perform ? [Call](#sec-call)(`resolvingFunctions`.`[[Reject]]`, undefined, « `completion`.`[[Value]]` »).
12. Return `promise`.

Note

The `executor` argument must be a [function object](#function-object). It is called for initiating and reporting completion of the possibly deferred action represented by this Promise. The executor is called with two arguments: `resolve` and `reject`. These are functions that may be used by the `executor` function to report eventual completion or failure of the deferred computation. Returning from the executor function does not mean that the deferred action has been completed but only that the request to eventually perform the deferred action has been accepted.

The `resolve` function that is passed to an `executor` function accepts a single argument. The `executor` code may eventually call the `resolve` function to indicate that it wishes to resolve the associated Promise. The argument passed to the `resolve` function represents the eventual value of the deferred action and can be either the actual fulfillment value or another promise which will provide the value if it is fulfilled.

The `reject` function that is passed to an `executor` function accepts a single argument. The `executor` code may eventually call the `reject` function to indicate that the associated Promise is rejected and will never be fulfilled. The argument passed to the `reject` function is used as the rejection value of the promise. Typically it will be an Error object.

The resolve and reject functions passed to an `executor` function by the Promise [constructor](#constructor) have the capability to actually resolve and reject the associated promise. Subclasses may have different [constructor](#constructor) behaviour that passes in customized values for resolve and reject.

### 27.2.4 Properties of the Promise Constructor

The Promise [constructor](#constructor):

- has a `[[Prototype]]` internal slot whose value is [%Function.prototype%](#sec-properties-of-the-function-prototype-object).
- has the following properties:

#### 27.2.4.1 Promise.all ( `iterable` )

This function returns a new promise which is fulfilled with an array of fulfillment values for the passed promises, or rejects with the reason of the first passed promise that rejects. It resolves all elements of the passed [iterable](#sec-iterable-interface) to promises as it runs this algorithm.

1.  Let `C` be the this value.
2.  Let `promiseCapability` be ? [NewPromiseCapability](#sec-newpromisecapability)(`C`).
3.  Let `promiseResolve` be [Completion](#sec-completion-ao)([GetPromiseResolve](#sec-getpromiseresolve)(`C`)).
4.  [IfAbruptRejectPromise](#sec-ifabruptrejectpromise)(`promiseResolve`, `promiseCapability`).
5.  Let `iteratorRecord` be [Completion](#sec-completion-ao)([GetIterator](#sec-getiterator)(`iterable`, sync)).
6.  [IfAbruptRejectPromise](#sec-ifabruptrejectpromise)(`iteratorRecord`, `promiseCapability`).
7.  Let `result` be [Completion](#sec-completion-ao)([PerformPromiseAll](#sec-performpromiseall)(`iteratorRecord`, `C`, `promiseCapability`, `promiseResolve`)).
8.  If `result` is an [abrupt completion](#sec-completion-record-specification-type), then
    1.  If `iteratorRecord`.`[[Done]]` is false, set `result` to [Completion](#sec-completion-ao)([IteratorClose](#sec-iteratorclose)(`iteratorRecord`, `result`)).
    2.  [IfAbruptRejectPromise](#sec-ifabruptrejectpromise)(`result`, `promiseCapability`).
9.  Return ? `result`.

Note

This function requires its this value to be a [constructor](#constructor) function that supports the parameter conventions of the Promise [constructor](#constructor).

##### 27.2.4.1.1 GetPromiseResolve ( `promiseConstructor` )

The abstract operation GetPromiseResolve takes argument `promiseConstructor` (a [constructor](#constructor)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a [function object](#function-object) or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `promiseResolve` be ? [Get](#sec-get-o-p)(`promiseConstructor`, "resolve").
2.  If [IsCallable](#sec-iscallable)(`promiseResolve`) is false, throw a TypeError exception.
3.  Return `promiseResolve`.

##### 27.2.4.1.2 PerformPromiseAll ( `iteratorRecord`, `constructor`, `resultCapability`, `promiseResolve` )

The abstract operation PerformPromiseAll takes arguments `iteratorRecord` (an [Iterator Record](#sec-iterator-records)), `constructor` (a [constructor](#constructor)), `resultCapability` (a [PromiseCapability Record](#sec-promisecapability-records)), and `promiseResolve` (a [function object](#function-object)) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [ECMAScript language value](#sec-ecmascript-language-types) or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `values` be a new empty [List](#sec-list-and-record-specification-type).
2.  Let `remainingElementsCount` be the [Record](#sec-list-and-record-specification-type) { `[[Value]]`: 1 }.
3.  Let `index` be 0.
4.  Repeat,
    1.  Let `next` be ? [IteratorStepValue](#sec-iteratorstepvalue)(`iteratorRecord`).
    2.  If `next` is done, then
        1.  Set `remainingElementsCount`.`[[Value]]` to `remainingElementsCount`.`[[Value]]` - 1.
        2.  If `remainingElementsCount`.`[[Value]]` = 0, then
            1.  Let `valuesArray` be [CreateArrayFromList](#sec-createarrayfromlist)(`values`).
            2.  Perform ? [Call](#sec-call)(`resultCapability`.`[[Resolve]]`, undefined, « `valuesArray` »).
        3.  Return `resultCapability`.`[[Promise]]`.
    3.  Append undefined to `values`.
    4.  Let `nextPromise` be ? [Call](#sec-call)(`promiseResolve`, `constructor`, « `next` »).
    5.  Let `steps` be the algorithm steps defined in [`Promise.all` Resolve Element Functions](#sec-promise.all-resolve-element-functions).
    6.  Let `length` be the number of non-optional parameters of the function definition in [`Promise.all` Resolve Element Functions](#sec-promise.all-resolve-element-functions).
    7.  Let `onFulfilled` be [CreateBuiltinFunction](#sec-createbuiltinfunction)(`steps`, `length`, "", « `[[AlreadyCalled]]`, `[[Index]]`, `[[Values]]`, `[[Capability]]`, `[[RemainingElements]]` »).
    8.  Set `onFulfilled`.`[[AlreadyCalled]]` to false.
    9.  Set `onFulfilled`.`[[Index]]` to `index`.
    10. Set `onFulfilled`.`[[Values]]` to `values`.
    11. Set `onFulfilled`.`[[Capability]]` to `resultCapability`.
    12. Set `onFulfilled`.`[[RemainingElements]]` to `remainingElementsCount`.
    13. Set `remainingElementsCount`.`[[Value]]` to `remainingElementsCount`.`[[Value]]` + 1.
    14. Perform ? [Invoke](#sec-invoke)(`nextPromise`, "then", « `onFulfilled`, `resultCapability`.`[[Reject]]` »).
    15. Set `index` to `index` + 1.

##### 27.2.4.1.3 `Promise.all` Resolve Element Functions

A `Promise.all` resolve element function is an anonymous built-in function that is used to resolve a specific `Promise.all` element. Each `Promise.all` resolve element function has `[[Index]]`, `[[Values]]`, `[[Capability]]`, `[[RemainingElements]]`, and `[[AlreadyCalled]]` internal slots.

When a `Promise.all` resolve element function is called with argument `x`, the following steps are taken:

1.  Let `F` be the [active function object](#active-function-object).
2.  If `F`.`[[AlreadyCalled]]` is true, return undefined.
3.  Set `F`.`[[AlreadyCalled]]` to true.
4.  Let `index` be `F`.`[[Index]]`.
5.  Let `values` be `F`.`[[Values]]`.
6.  Let `promiseCapability` be `F`.`[[Capability]]`.
7.  Let `remainingElementsCount` be `F`.`[[RemainingElements]]`.
8.  Set `values`\[`index`\] to `x`.
9.  Set `remainingElementsCount`.`[[Value]]` to `remainingElementsCount`.`[[Value]]` - 1.
10. If `remainingElementsCount`.`[[Value]]` = 0, then
    1.  Let `valuesArray` be [CreateArrayFromList](#sec-createarrayfromlist)(`values`).
    2.  Return ? [Call](#sec-call)(`promiseCapability`.`[[Resolve]]`, undefined, « `valuesArray` »).
11. Return undefined.

The "length" property of a `Promise.all` resolve element function is 1_(𝔽).

#### 27.2.4.2 Promise.allSettled ( `iterable` )

This function returns a promise that is fulfilled with an array of promise state snapshots, but only after all the original promises have settled, i.e. become either fulfilled or rejected. It resolves all elements of the passed [iterable](#sec-iterable-interface) to promises as it runs this algorithm.

1.  Let `C` be the this value.
2.  Let `promiseCapability` be ? [NewPromiseCapability](#sec-newpromisecapability)(`C`).
3.  Let `promiseResolve` be [Completion](#sec-completion-ao)([GetPromiseResolve](#sec-getpromiseresolve)(`C`)).
4.  [IfAbruptRejectPromise](#sec-ifabruptrejectpromise)(`promiseResolve`, `promiseCapability`).
5.  Let `iteratorRecord` be [Completion](#sec-completion-ao)([GetIterator](#sec-getiterator)(`iterable`, sync)).
6.  [IfAbruptRejectPromise](#sec-ifabruptrejectpromise)(`iteratorRecord`, `promiseCapability`).
7.  Let `result` be [Completion](#sec-completion-ao)([PerformPromiseAllSettled](#sec-performpromiseallsettled)(`iteratorRecord`, `C`, `promiseCapability`, `promiseResolve`)).
8.  If `result` is an [abrupt completion](#sec-completion-record-specification-type), then
    1.  If `iteratorRecord`.`[[Done]]` is false, set `result` to [Completion](#sec-completion-ao)([IteratorClose](#sec-iteratorclose)(`iteratorRecord`, `result`)).
    2.  [IfAbruptRejectPromise](#sec-ifabruptrejectpromise)(`result`, `promiseCapability`).
9.  Return ? `result`.

Note

This function requires its this value to be a [constructor](#constructor) function that supports the parameter conventions of the Promise [constructor](#constructor).

##### 27.2.4.2.1 PerformPromiseAllSettled ( `iteratorRecord`, `constructor`, `resultCapability`, `promiseResolve` )

The abstract operation PerformPromiseAllSettled takes arguments `iteratorRecord` (an [Iterator Record](#sec-iterator-records)), `constructor` (a [constructor](#constructor)), `resultCapability` (a [PromiseCapability Record](#sec-promisecapability-records)), and `promiseResolve` (a [function object](#function-object)) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [ECMAScript language value](#sec-ecmascript-language-types) or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `values` be a new empty [List](#sec-list-and-record-specification-type).
2.  Let `remainingElementsCount` be the [Record](#sec-list-and-record-specification-type) { `[[Value]]`: 1 }.
3.  Let `index` be 0.
4.  Repeat,
    1.  Let `next` be ? [IteratorStepValue](#sec-iteratorstepvalue)(`iteratorRecord`).
    2.  If `next` is done, then
        1.  Set `remainingElementsCount`.`[[Value]]` to `remainingElementsCount`.`[[Value]]` - 1.
        2.  If `remainingElementsCount`.`[[Value]]` = 0, then
            1.  Let `valuesArray` be [CreateArrayFromList](#sec-createarrayfromlist)(`values`).
            2.  Perform ? [Call](#sec-call)(`resultCapability`.`[[Resolve]]`, undefined, « `valuesArray` »).
        3.  Return `resultCapability`.`[[Promise]]`.
    3.  Append undefined to `values`.
    4.  Let `nextPromise` be ? [Call](#sec-call)(`promiseResolve`, `constructor`, « `next` »).
    5.  Let `stepsFulfilled` be the algorithm steps defined in [`Promise.allSettled` Resolve Element Functions](#sec-promise.allsettled-resolve-element-functions).
    6.  Let `lengthFulfilled` be the number of non-optional parameters of the function definition in [`Promise.allSettled` Resolve Element Functions](#sec-promise.allsettled-resolve-element-functions).
    7.  Let `onFulfilled` be [CreateBuiltinFunction](#sec-createbuiltinfunction)(`stepsFulfilled`, `lengthFulfilled`, "", « `[[AlreadyCalled]]`, `[[Index]]`, `[[Values]]`, `[[Capability]]`, `[[RemainingElements]]` »).
    8.  Let `alreadyCalled` be the [Record](#sec-list-and-record-specification-type) { `[[Value]]`: false }.
    9.  Set `onFulfilled`.`[[AlreadyCalled]]` to `alreadyCalled`.
    10. Set `onFulfilled`.`[[Index]]` to `index`.
    11. Set `onFulfilled`.`[[Values]]` to `values`.
    12. Set `onFulfilled`.`[[Capability]]` to `resultCapability`.
    13. Set `onFulfilled`.`[[RemainingElements]]` to `remainingElementsCount`.
    14. Let `stepsRejected` be the algorithm steps defined in [`Promise.allSettled` Reject Element Functions](#sec-promise.allsettled-reject-element-functions).
    15. Let `lengthRejected` be the number of non-optional parameters of the function definition in [`Promise.allSettled` Reject Element Functions](#sec-promise.allsettled-reject-element-functions).
    16. Let `onRejected` be [CreateBuiltinFunction](#sec-createbuiltinfunction)(`stepsRejected`, `lengthRejected`, "", « `[[AlreadyCalled]]`, `[[Index]]`, `[[Values]]`, `[[Capability]]`, `[[RemainingElements]]` »).
    17. Set `onRejected`.`[[AlreadyCalled]]` to `alreadyCalled`.
    18. Set `onRejected`.`[[Index]]` to `index`.
    19. Set `onRejected`.`[[Values]]` to `values`.
    20. Set `onRejected`.`[[Capability]]` to `resultCapability`.
    21. Set `onRejected`.`[[RemainingElements]]` to `remainingElementsCount`.
    22. Set `remainingElementsCount`.`[[Value]]` to `remainingElementsCount`.`[[Value]]` + 1.
    23. Perform ? [Invoke](#sec-invoke)(`nextPromise`, "then", « `onFulfilled`, `onRejected` »).
    24. Set `index` to `index` + 1.

##### 27.2.4.2.2 `Promise.allSettled` Resolve Element Functions

A `Promise.allSettled` resolve element function is an anonymous built-in function that is used to resolve a specific `Promise.allSettled` element. Each `Promise.allSettled` resolve element function has `[[Index]]`, `[[Values]]`, `[[Capability]]`, `[[RemainingElements]]`, and `[[AlreadyCalled]]` internal slots.

When a `Promise.allSettled` resolve element function is called with argument `x`, the following steps are taken:

1.  Let `F` be the [active function object](#active-function-object).
2.  Let `alreadyCalled` be `F`.`[[AlreadyCalled]]`.
3.  If `alreadyCalled`.`[[Value]]` is true, return undefined.
4.  Set `alreadyCalled`.`[[Value]]` to true.
5.  Let `index` be `F`.`[[Index]]`.
6.  Let `values` be `F`.`[[Values]]`.
7.  Let `promiseCapability` be `F`.`[[Capability]]`.
8.  Let `remainingElementsCount` be `F`.`[[RemainingElements]]`.
9.  Let `obj` be [OrdinaryObjectCreate](#sec-ordinaryobjectcreate)([%Object.prototype%](#sec-properties-of-the-object-prototype-object)).
10. Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`obj`, "status", "fulfilled").
11. Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`obj`, "value", `x`).
12. Set `values`\[`index`\] to `obj`.
13. Set `remainingElementsCount`.`[[Value]]` to `remainingElementsCount`.`[[Value]]` - 1.
14. If `remainingElementsCount`.`[[Value]]` = 0, then
    1.  Let `valuesArray` be [CreateArrayFromList](#sec-createarrayfromlist)(`values`).
    2.  Return ? [Call](#sec-call)(`promiseCapability`.`[[Resolve]]`, undefined, « `valuesArray` »).
15. Return undefined.

The "length" property of a `Promise.allSettled` resolve element function is 1_(𝔽).

##### 27.2.4.2.3 `Promise.allSettled` Reject Element Functions

A `Promise.allSettled` reject element function is an anonymous built-in function that is used to reject a specific `Promise.allSettled` element. Each `Promise.allSettled` reject element function has `[[Index]]`, `[[Values]]`, `[[Capability]]`, `[[RemainingElements]]`, and `[[AlreadyCalled]]` internal slots.

When a `Promise.allSettled` reject element function is called with argument `x`, the following steps are taken:

1.  Let `F` be the [active function object](#active-function-object).
2.  Let `alreadyCalled` be `F`.`[[AlreadyCalled]]`.
3.  If `alreadyCalled`.`[[Value]]` is true, return undefined.
4.  Set `alreadyCalled`.`[[Value]]` to true.
5.  Let `index` be `F`.`[[Index]]`.
6.  Let `values` be `F`.`[[Values]]`.
7.  Let `promiseCapability` be `F`.`[[Capability]]`.
8.  Let `remainingElementsCount` be `F`.`[[RemainingElements]]`.
9.  Let `obj` be [OrdinaryObjectCreate](#sec-ordinaryobjectcreate)([%Object.prototype%](#sec-properties-of-the-object-prototype-object)).
10. Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`obj`, "status", "rejected").
11. Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`obj`, "reason", `x`).
12. Set `values`\[`index`\] to `obj`.
13. Set `remainingElementsCount`.`[[Value]]` to `remainingElementsCount`.`[[Value]]` - 1.
14. If `remainingElementsCount`.`[[Value]]` = 0, then
    1.  Let `valuesArray` be [CreateArrayFromList](#sec-createarrayfromlist)(`values`).
    2.  Return ? [Call](#sec-call)(`promiseCapability`.`[[Resolve]]`, undefined, « `valuesArray` »).
15. Return undefined.

The "length" property of a `Promise.allSettled` reject element function is 1_(𝔽).

#### 27.2.4.3 Promise.any ( `iterable` )

This function returns a promise that is fulfilled by the first given promise to be fulfilled, or rejected with an `AggregateError` holding the rejection reasons if all of the given promises are rejected. It resolves all elements of the passed [iterable](#sec-iterable-interface) to promises as it runs this algorithm.

1.  Let `C` be the this value.
2.  Let `promiseCapability` be ? [NewPromiseCapability](#sec-newpromisecapability)(`C`).
3.  Let `promiseResolve` be [Completion](#sec-completion-ao)([GetPromiseResolve](#sec-getpromiseresolve)(`C`)).
4.  [IfAbruptRejectPromise](#sec-ifabruptrejectpromise)(`promiseResolve`, `promiseCapability`).
5.  Let `iteratorRecord` be [Completion](#sec-completion-ao)([GetIterator](#sec-getiterator)(`iterable`, sync)).
6.  [IfAbruptRejectPromise](#sec-ifabruptrejectpromise)(`iteratorRecord`, `promiseCapability`).
7.  Let `result` be [Completion](#sec-completion-ao)([PerformPromiseAny](#sec-performpromiseany)(`iteratorRecord`, `C`, `promiseCapability`, `promiseResolve`)).
8.  If `result` is an [abrupt completion](#sec-completion-record-specification-type), then
    1.  If `iteratorRecord`.`[[Done]]` is false, set `result` to [Completion](#sec-completion-ao)([IteratorClose](#sec-iteratorclose)(`iteratorRecord`, `result`)).
    2.  [IfAbruptRejectPromise](#sec-ifabruptrejectpromise)(`result`, `promiseCapability`).
9.  Return ? `result`.

Note

This function requires its this value to be a [constructor](#constructor) function that supports the parameter conventions of the `Promise` [constructor](#constructor).

##### 27.2.4.3.1 PerformPromiseAny ( `iteratorRecord`, `constructor`, `resultCapability`, `promiseResolve` )

The abstract operation PerformPromiseAny takes arguments `iteratorRecord` (an [Iterator Record](#sec-iterator-records)), `constructor` (a [constructor](#constructor)), `resultCapability` (a [PromiseCapability Record](#sec-promisecapability-records)), and `promiseResolve` (a [function object](#function-object)) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [ECMAScript language value](#sec-ecmascript-language-types) or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `errors` be a new empty [List](#sec-list-and-record-specification-type).
2.  Let `remainingElementsCount` be the [Record](#sec-list-and-record-specification-type) { `[[Value]]`: 1 }.
3.  Let `index` be 0.
4.  Repeat,
    1.  Let `next` be ? [IteratorStepValue](#sec-iteratorstepvalue)(`iteratorRecord`).
    2.  If `next` is done, then
        1.  Set `remainingElementsCount`.`[[Value]]` to `remainingElementsCount`.`[[Value]]` - 1.
        2.  If `remainingElementsCount`.`[[Value]]` = 0, then
            1.  Let `error` be a newly created AggregateError object.
            2.  Perform ! [DefinePropertyOrThrow](#sec-definepropertyorthrow)(`error`, "errors", PropertyDescriptor { `[[Configurable]]`: true, `[[Enumerable]]`: false, `[[Writable]]`: true, `[[Value]]`: [CreateArrayFromList](#sec-createarrayfromlist)(`errors`) }).
            3.  Return [ThrowCompletion](#sec-throwcompletion)(`error`).
        3.  Return `resultCapability`.`[[Promise]]`.
    3.  Append undefined to `errors`.
    4.  Let `nextPromise` be ? [Call](#sec-call)(`promiseResolve`, `constructor`, « `next` »).
    5.  Let `stepsRejected` be the algorithm steps defined in [`Promise.any` Reject Element Functions](#sec-promise.any-reject-element-functions).
    6.  Let `lengthRejected` be the number of non-optional parameters of the function definition in [`Promise.any` Reject Element Functions](#sec-promise.any-reject-element-functions).
    7.  Let `onRejected` be [CreateBuiltinFunction](#sec-createbuiltinfunction)(`stepsRejected`, `lengthRejected`, "", « `[[AlreadyCalled]]`, `[[Index]]`, `[[Errors]]`, `[[Capability]]`, `[[RemainingElements]]` »).
    8.  Set `onRejected`.`[[AlreadyCalled]]` to false.
    9.  Set `onRejected`.`[[Index]]` to `index`.
    10. Set `onRejected`.`[[Errors]]` to `errors`.
    11. Set `onRejected`.`[[Capability]]` to `resultCapability`.
    12. Set `onRejected`.`[[RemainingElements]]` to `remainingElementsCount`.
    13. Set `remainingElementsCount`.`[[Value]]` to `remainingElementsCount`.`[[Value]]` + 1.
    14. Perform ? [Invoke](#sec-invoke)(`nextPromise`, "then", « `resultCapability`.`[[Resolve]]`, `onRejected` »).
    15. Set `index` to `index` + 1.

##### 27.2.4.3.2 `Promise.any` Reject Element Functions

A `Promise.any` reject element function is an anonymous built-in function that is used to reject a specific `Promise.any` element. Each `Promise.any` reject element function has `[[Index]]`, `[[Errors]]`, `[[Capability]]`, `[[RemainingElements]]`, and `[[AlreadyCalled]]` internal slots.

When a `Promise.any` reject element function is called with argument `x`, the following steps are taken:

1.  Let `F` be the [active function object](#active-function-object).
2.  If `F`.`[[AlreadyCalled]]` is true, return undefined.
3.  Set `F`.`[[AlreadyCalled]]` to true.
4.  Let `index` be `F`.`[[Index]]`.
5.  Let `errors` be `F`.`[[Errors]]`.
6.  Let `promiseCapability` be `F`.`[[Capability]]`.
7.  Let `remainingElementsCount` be `F`.`[[RemainingElements]]`.
8.  Set `errors`\[`index`\] to `x`.
9.  Set `remainingElementsCount`.`[[Value]]` to `remainingElementsCount`.`[[Value]]` - 1.
10. If `remainingElementsCount`.`[[Value]]` = 0, then
    1.  Let `error` be a newly created AggregateError object.
    2.  Perform ! [DefinePropertyOrThrow](#sec-definepropertyorthrow)(`error`, "errors", PropertyDescriptor { `[[Configurable]]`: true, `[[Enumerable]]`: false, `[[Writable]]`: true, `[[Value]]`: [CreateArrayFromList](#sec-createarrayfromlist)(`errors`) }).
    3.  Return ? [Call](#sec-call)(`promiseCapability`.`[[Reject]]`, undefined, « `error` »).
11. Return undefined.

The "length" property of a `Promise.any` reject element function is 1_(𝔽).

#### 27.2.4.4 Promise.prototype

The initial value of `Promise.prototype` is the [Promise prototype object](#sec-properties-of-the-promise-prototype-object).

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

#### 27.2.4.5 Promise.race ( `iterable` )

This function returns a new promise which is settled in the same way as the first passed promise to settle. It resolves all elements of the passed `iterable` to promises as it runs this algorithm.

1.  Let `C` be the this value.
2.  Let `promiseCapability` be ? [NewPromiseCapability](#sec-newpromisecapability)(`C`).
3.  Let `promiseResolve` be [Completion](#sec-completion-ao)([GetPromiseResolve](#sec-getpromiseresolve)(`C`)).
4.  [IfAbruptRejectPromise](#sec-ifabruptrejectpromise)(`promiseResolve`, `promiseCapability`).
5.  Let `iteratorRecord` be [Completion](#sec-completion-ao)([GetIterator](#sec-getiterator)(`iterable`, sync)).
6.  [IfAbruptRejectPromise](#sec-ifabruptrejectpromise)(`iteratorRecord`, `promiseCapability`).
7.  Let `result` be [Completion](#sec-completion-ao)([PerformPromiseRace](#sec-performpromiserace)(`iteratorRecord`, `C`, `promiseCapability`, `promiseResolve`)).
8.  If `result` is an [abrupt completion](#sec-completion-record-specification-type), then
    1.  If `iteratorRecord`.`[[Done]]` is false, set `result` to [Completion](#sec-completion-ao)([IteratorClose](#sec-iteratorclose)(`iteratorRecord`, `result`)).
    2.  [IfAbruptRejectPromise](#sec-ifabruptrejectpromise)(`result`, `promiseCapability`).
9.  Return ? `result`.

Note 1

If the `iterable` argument yields no values or if none of the promises yielded by `iterable` ever settle, then the pending promise returned by this method will never be settled.

Note 2

This function expects its this value to be a [constructor](#constructor) function that supports the parameter conventions of the Promise [constructor](#constructor). It also expects that its this value provides a `resolve` method.

##### 27.2.4.5.1 PerformPromiseRace ( `iteratorRecord`, `constructor`, `resultCapability`, `promiseResolve` )

The abstract operation PerformPromiseRace takes arguments `iteratorRecord` (an [Iterator Record](#sec-iterator-records)), `constructor` (a [constructor](#constructor)), `resultCapability` (a [PromiseCapability Record](#sec-promisecapability-records)), and `promiseResolve` (a [function object](#function-object)) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [ECMAScript language value](#sec-ecmascript-language-types) or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Repeat,
    1.  Let `next` be ? [IteratorStepValue](#sec-iteratorstepvalue)(`iteratorRecord`).
    2.  If `next` is done, then
        1.  Return `resultCapability`.`[[Promise]]`.
    3.  Let `nextPromise` be ? [Call](#sec-call)(`promiseResolve`, `constructor`, « `next` »).
    4.  Perform ? [Invoke](#sec-invoke)(`nextPromise`, "then", « `resultCapability`.`[[Resolve]]`, `resultCapability`.`[[Reject]]` »).

#### 27.2.4.6 Promise.reject ( `r` )

This function returns a new promise rejected with the passed argument.

1.  Let `C` be the this value.
2.  Let `promiseCapability` be ? [NewPromiseCapability](#sec-newpromisecapability)(`C`).
3.  Perform ? [Call](#sec-call)(`promiseCapability`.`[[Reject]]`, undefined, « `r` »).
4.  Return `promiseCapability`.`[[Promise]]`.

Note

This function expects its this value to be a [constructor](#constructor) function that supports the parameter conventions of the Promise [constructor](#constructor).

#### 27.2.4.7 Promise.resolve ( `x` )

This function returns either a new promise resolved with the passed argument, or the argument itself if the argument is a promise produced by this [constructor](#constructor).

1.  Let `C` be the this value.
2.  If `C` [is not an Object](#sec-object-type), throw a TypeError exception.
3.  Return ? [PromiseResolve](#sec-promise-resolve)(`C`, `x`).

Note

This function expects its this value to be a [constructor](#constructor) function that supports the parameter conventions of the Promise [constructor](#constructor).

##### 27.2.4.7.1 PromiseResolve ( `C`, `x` )

The abstract operation PromiseResolve takes arguments `C` (an Object) and `x` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [ECMAScript language value](#sec-ecmascript-language-types) or a [throw completion](#sec-completion-record-specification-type). It returns a new promise resolved with `x`. It performs the following steps when called:

1.  If [IsPromise](#sec-ispromise)(`x`) is true, then
    1.  Let `xConstructor` be ? [Get](#sec-get-o-p)(`x`, "constructor").
    2.  If [SameValue](#sec-samevalue)(`xConstructor`, `C`) is true, return `x`.
2.  Let `promiseCapability` be ? [NewPromiseCapability](#sec-newpromisecapability)(`C`).
3.  Perform ? [Call](#sec-call)(`promiseCapability`.`[[Resolve]]`, undefined, « `x` »).
4.  Return `promiseCapability`.`[[Promise]]`.

#### 27.2.4.8 Promise.try ( `callback`, ...`args` )

This function performs the following steps when called:

1.  Let `C` be the this value.
2.  If `C` [is not an Object](#sec-object-type), throw a TypeError exception.
3.  Let `promiseCapability` be ? [NewPromiseCapability](#sec-newpromisecapability)(`C`).
4.  Let `status` be [Completion](#sec-completion-ao)([Call](#sec-call)(`callback`, undefined, `args`)).
5.  If `status` is an [abrupt completion](#sec-completion-record-specification-type), then
    1.  Perform ? [Call](#sec-call)(`promiseCapability`.`[[Reject]]`, undefined, « `status`.`[[Value]]` »).
6.  Else,
    1.  Perform ? [Call](#sec-call)(`promiseCapability`.`[[Resolve]]`, undefined, « `status`.`[[Value]]` »).
7.  Return `promiseCapability`.`[[Promise]]`.

Note

This function expects its this value to be a [constructor](#constructor) function that supports the parameter conventions of the Promise [constructor](#constructor).

#### 27.2.4.9 Promise.withResolvers ( )

This function returns an object with three properties: a new promise together with the `resolve` and `reject` functions associated with it.

1.  Let `C` be the this value.
2.  Let `promiseCapability` be ? [NewPromiseCapability](#sec-newpromisecapability)(`C`).
3.  Let `obj` be [OrdinaryObjectCreate](#sec-ordinaryobjectcreate)([%Object.prototype%](#sec-properties-of-the-object-prototype-object)).
4.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`obj`, "promise", `promiseCapability`.`[[Promise]]`).
5.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`obj`, "resolve", `promiseCapability`.`[[Resolve]]`).
6.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`obj`, "reject", `promiseCapability`.`[[Reject]]`).
7.  Return `obj`.

#### 27.2.4.10 get Promise \[ %Symbol.species% \]

`Promise[%Symbol.species%]` is an [accessor property](#sec-object-type) whose set accessor function is undefined. Its get accessor function performs the following steps when called:

1.  Return the this value.

The value of the "name" property of this function is "get \[Symbol.species\]".

Note

Promise prototype methods normally use their this value's [constructor](#constructor) to create a derived object. However, a subclass [constructor](#constructor) may over-ride that default behaviour by redefining its [%Symbol.species%](#sec-well-known-symbols) property.

### 27.2.5 Properties of the Promise Prototype Object

The Promise prototype object:

- is %Promise.prototype%.
- has a `[[Prototype]]` internal slot whose value is [%Object.prototype%](#sec-properties-of-the-object-prototype-object).
- is an [ordinary object](#ordinary-object).
- does not have a `[[PromiseState]]` internal slot or any of the other internal slots of Promise instances.

#### 27.2.5.1 Promise.prototype.catch ( `onRejected` )

This method performs the following steps when called:

1.  Let `promise` be the this value.
2.  Return ? [Invoke](#sec-invoke)(`promise`, "then", « undefined, `onRejected` »).

#### 27.2.5.2 Promise.prototype.constructor

The initial value of `Promise.prototype.constructor` is [%Promise%](#sec-promise-constructor).

#### 27.2.5.3 Promise.prototype.finally ( `onFinally` )

This method performs the following steps when called:

1.  Let `promise` be the this value.
2.  If `promise` [is not an Object](#sec-object-type), throw a TypeError exception.
3.  Let `C` be ? [SpeciesConstructor](#sec-speciesconstructor)(`promise`, [%Promise%](#sec-promise-constructor)).
4.  [Assert](#assert): [IsConstructor](#sec-isconstructor)(`C`) is true.
5.  If [IsCallable](#sec-iscallable)(`onFinally`) is false, then
    1.  Let `thenFinally` be `onFinally`.
    2.  Let `catchFinally` be `onFinally`.
6.  Else,
    1.  Let `thenFinallyClosure` be a new [Abstract Closure](#sec-abstract-closure) with parameters (`value`) that captures `onFinally` and `C` and performs the following steps when called:
        1.  Let `result` be ? [Call](#sec-call)(`onFinally`, undefined).
        2.  Let `p` be ? [PromiseResolve](#sec-promise-resolve)(`C`, `result`).
        3.  Let `returnValue` be a new [Abstract Closure](#sec-abstract-closure) with no parameters that captures `value` and performs the following steps when called:
            1.  Return `value`.
        4.  Let `valueThunk` be [CreateBuiltinFunction](#sec-createbuiltinfunction)(`returnValue`, 0, "", « »).
        5.  Return ? [Invoke](#sec-invoke)(`p`, "then", « `valueThunk` »).
    2.  Let `thenFinally` be [CreateBuiltinFunction](#sec-createbuiltinfunction)(`thenFinallyClosure`, 1, "", « »).
    3.  Let `catchFinallyClosure` be a new [Abstract Closure](#sec-abstract-closure) with parameters (`reason`) that captures `onFinally` and `C` and performs the following steps when called:
        1.  Let `result` be ? [Call](#sec-call)(`onFinally`, undefined).
        2.  Let `p` be ? [PromiseResolve](#sec-promise-resolve)(`C`, `result`).
        3.  Let `throwReason` be a new [Abstract Closure](#sec-abstract-closure) with no parameters that captures `reason` and performs the following steps when called:
            1.  Return [ThrowCompletion](#sec-throwcompletion)(`reason`).
        4.  Let `thrower` be [CreateBuiltinFunction](#sec-createbuiltinfunction)(`throwReason`, 0, "", « »).
        5.  Return ? [Invoke](#sec-invoke)(`p`, "then", « `thrower` »).
    4.  Let `catchFinally` be [CreateBuiltinFunction](#sec-createbuiltinfunction)(`catchFinallyClosure`, 1, "", « »).
7.  Return ? [Invoke](#sec-invoke)(`promise`, "then", « `thenFinally`, `catchFinally` »).

#### 27.2.5.4 Promise.prototype.then ( `onFulfilled`, `onRejected` )

This method performs the following steps when called:

1.  Let `promise` be the this value.
2.  If [IsPromise](#sec-ispromise)(`promise`) is false, throw a TypeError exception.
3.  Let `C` be ? [SpeciesConstructor](#sec-speciesconstructor)(`promise`, [%Promise%](#sec-promise-constructor)).
4.  Let `resultCapability` be ? [NewPromiseCapability](#sec-newpromisecapability)(`C`).
5.  Return [PerformPromiseThen](#sec-performpromisethen)(`promise`, `onFulfilled`, `onRejected`, `resultCapability`).

##### 27.2.5.4.1 PerformPromiseThen ( `promise`, `onFulfilled`, `onRejected` \[ , `resultCapability` \] )

The abstract operation PerformPromiseThen takes arguments `promise` (a Promise), `onFulfilled` (an [ECMAScript language value](#sec-ecmascript-language-types)), and `onRejected` (an [ECMAScript language value](#sec-ecmascript-language-types)) and optional argument `resultCapability` (a [PromiseCapability Record](#sec-promisecapability-records)) and returns an [ECMAScript language value](#sec-ecmascript-language-types). It performs the “then” operation on `promise` using `onFulfilled` and `onRejected` as its settlement actions. If `resultCapability` is passed, the result is stored by updating `resultCapability`'s promise. If it is not passed, then PerformPromiseThen is being called by a specification-internal operation where the result does not matter. It performs the following steps when called:

1.  [Assert](#assert): [IsPromise](#sec-ispromise)(`promise`) is true.
2.  If `resultCapability` is not present, then
    1.  Set `resultCapability` to undefined.
3.  If [IsCallable](#sec-iscallable)(`onFulfilled`) is false, then
    1.  Let `onFulfilledJobCallback` be empty.
4.  Else,
    1.  Let `onFulfilledJobCallback` be [HostMakeJobCallback](#sec-hostmakejobcallback)(`onFulfilled`).
5.  If [IsCallable](#sec-iscallable)(`onRejected`) is false, then
    1.  Let `onRejectedJobCallback` be empty.
6.  Else,
    1.  Let `onRejectedJobCallback` be [HostMakeJobCallback](#sec-hostmakejobcallback)(`onRejected`).
7.  Let `fulfillReaction` be the [PromiseReaction Record](#sec-promisereaction-records) { `[[Capability]]`: `resultCapability`, `[[Type]]`: fulfill, `[[Handler]]`: `onFulfilledJobCallback` }.
8.  Let `rejectReaction` be the [PromiseReaction Record](#sec-promisereaction-records) { `[[Capability]]`: `resultCapability`, `[[Type]]`: reject, `[[Handler]]`: `onRejectedJobCallback` }.
9.  If `promise`.`[[PromiseState]]` is pending, then
    1.  Append `fulfillReaction` to `promise`.`[[PromiseFulfillReactions]]`.
    2.  Append `rejectReaction` to `promise`.`[[PromiseRejectReactions]]`.
10. Else if `promise`.`[[PromiseState]]` is fulfilled, then
    1.  Let `value` be `promise`.`[[PromiseResult]]`.
    2.  Let `fulfillJob` be [NewPromiseReactionJob](#sec-newpromisereactionjob)(`fulfillReaction`, `value`).
    3.  Perform [HostEnqueuePromiseJob](#sec-hostenqueuepromisejob)(`fulfillJob`.`[[Job]]`, `fulfillJob`.`[[Realm]]`).
11. Else,
    1.  [Assert](#assert): The value of `promise`.`[[PromiseState]]` is rejected.
    2.  Let `reason` be `promise`.`[[PromiseResult]]`.
    3.  If `promise`.`[[PromiseIsHandled]]` is false, perform [HostPromiseRejectionTracker](#sec-host-promise-rejection-tracker)(`promise`, "handle").
    4.  Let `rejectJob` be [NewPromiseReactionJob](#sec-newpromisereactionjob)(`rejectReaction`, `reason`).
    5.  Perform [HostEnqueuePromiseJob](#sec-hostenqueuepromisejob)(`rejectJob`.`[[Job]]`, `rejectJob`.`[[Realm]]`).
12. Set `promise`.`[[PromiseIsHandled]]` to true.
13. If `resultCapability` is undefined, then
    1.  Return undefined.
14. Else,
    1.  Return `resultCapability`.`[[Promise]]`.

#### 27.2.5.5 Promise.prototype \[ %Symbol.toStringTag% \]

The initial value of the [%Symbol.toStringTag%](#sec-well-known-symbols) property is the String value "Promise".

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: true }.

### 27.2.6 Properties of Promise Instances

Promise instances are [ordinary objects](#ordinary-object) that inherit properties from the [Promise prototype object](#sec-properties-of-the-promise-prototype-object) (the intrinsic, [%Promise.prototype%](#sec-properties-of-the-promise-prototype-object)). Promise instances are initially created with the internal slots described in [Table 90](#table-internal-slots-of-promise-instances).

| Internal Slot | Type | Description |
|----|----|----|
| `[[PromiseState]]` | pending, fulfilled, or rejected | Governs how a promise will react to incoming calls to its `then` method. |
| `[[PromiseResult]]` | an [ECMAScript language value](#sec-ecmascript-language-types) or empty | The value with which the promise has been fulfilled or rejected, if any. empty if and only if the `[[PromiseState]]` is pending. |
| `[[PromiseFulfillReactions]]` | a [List](#sec-list-and-record-specification-type) of [PromiseReaction Records](#sec-promisereaction-records) | [Records](#sec-list-and-record-specification-type) to be processed when/if the promise transitions from the pending state to the fulfilled state. |
| `[[PromiseRejectReactions]]` | a [List](#sec-list-and-record-specification-type) of [PromiseReaction Records](#sec-promisereaction-records) | [Records](#sec-list-and-record-specification-type) to be processed when/if the promise transitions from the pending state to the rejected state. |
| `[[PromiseIsHandled]]` | a Boolean | Indicates whether the promise has ever had a fulfillment or rejection handler; used in unhandled rejection tracking. |

Table 90: Internal Slots of Promise Instances

## 27.3 GeneratorFunction Objects

GeneratorFunctions are functions that are usually created by evaluating [GeneratorDeclaration](#prod-GeneratorDeclaration)s, [GeneratorExpression](#prod-GeneratorExpression)s, and [GeneratorMethod](#prod-GeneratorMethod)s. They may also be created by calling the [%GeneratorFunction%](#sec-generatorfunction-constructor) intrinsic.

![A staggering variety of boxes and arrows.](img/figure-2.svg)

Figure 6 (Informative): Generator Objects Relationships

### 27.3.1 The GeneratorFunction Constructor

The GeneratorFunction [constructor](#constructor):

- is %GeneratorFunction%.
- is a subclass of `Function`.
- creates and initializes a new GeneratorFunction when called as a function rather than as a [constructor](#constructor). Thus the function call `GeneratorFunction (…)` is equivalent to the object creation expression `new GeneratorFunction (…)` with the same arguments.
- may be used as the value of an `extends` clause of a class definition. Subclass [constructors](#constructor) that intend to inherit the specified GeneratorFunction behaviour must include a `super` call to the GeneratorFunction [constructor](#constructor) to create and initialize subclass instances with the internal slots necessary for built-in GeneratorFunction behaviour. All ECMAScript syntactic forms for defining generator [function objects](#function-object) create direct instances of GeneratorFunction. There is no syntactic means to create instances of GeneratorFunction subclasses.

#### 27.3.1.1 GeneratorFunction ( ...`parameterArgs`, `bodyArg` )

The last argument (if any) specifies the body (executable code) of a generator function; any preceding arguments specify formal parameters.

This function performs the following steps when called:

1.  Let `C` be the [active function object](#active-function-object).
2.  If `bodyArg` is not present, set `bodyArg` to the empty String.
3.  Return ? [CreateDynamicFunction](#sec-createdynamicfunction)(`C`, NewTarget, generator, `parameterArgs`, `bodyArg`).

Note

See NOTE for [20.2.1.1](#sec-function-p1-p2-pn-body).

### 27.3.2 Properties of the GeneratorFunction Constructor

The GeneratorFunction [constructor](#constructor):

- is a standard built-in [function object](#function-object) that inherits from the Function [constructor](#constructor).
- has a `[[Prototype]]` internal slot whose value is [%Function%](#sec-function-constructor).
- has a "length" property whose value is 1_(𝔽).
- has a "name" property whose value is "GeneratorFunction".
- has the following properties:

#### 27.3.2.1 GeneratorFunction.prototype

The initial value of `GeneratorFunction.prototype` is the [GeneratorFunction prototype object](#sec-properties-of-the-generatorfunction-prototype-object).

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

### 27.3.3 Properties of the GeneratorFunction Prototype Object

The GeneratorFunction prototype object:

- is %GeneratorFunction.prototype% (see [Figure 6](#figure-2)).
- is an [ordinary object](#ordinary-object).
- is not a [function object](#function-object) and does not have an `[[ECMAScriptCode]]` internal slot or any other of the internal slots listed in [Table 30](#table-internal-slots-of-ecmascript-function-objects) or [Table 91](#table-internal-slots-of-generator-instances).
- has a `[[Prototype]]` internal slot whose value is [%Function.prototype%](#sec-properties-of-the-function-prototype-object).

#### 27.3.3.1 GeneratorFunction.prototype.constructor

The initial value of `GeneratorFunction.prototype.constructor` is [%GeneratorFunction%](#sec-generatorfunction-constructor).

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: true }.

#### 27.3.3.2 GeneratorFunction.prototype.prototype

The initial value of `GeneratorFunction.prototype.prototype` is [%GeneratorPrototype%](#sec-properties-of-generator-prototype).

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: true }.

#### 27.3.3.3 GeneratorFunction.prototype \[ %Symbol.toStringTag% \]

The initial value of the [%Symbol.toStringTag%](#sec-well-known-symbols) property is the String value "GeneratorFunction".

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: true }.

### 27.3.4 GeneratorFunction Instances

Every GeneratorFunction instance is an ECMAScript [function object](#function-object) and has the internal slots listed in [Table 30](#table-internal-slots-of-ecmascript-function-objects). The value of the `[[IsClassConstructor]]` internal slot for all such instances is false.

Each GeneratorFunction instance has the following own properties:

#### 27.3.4.1 length

The specification for the "length" property of Function instances given in [20.2.4.1](#sec-function-instances-length) also applies to GeneratorFunction instances.

#### 27.3.4.2 name

The specification for the "name" property of Function instances given in [20.2.4.2](#sec-function-instances-name) also applies to GeneratorFunction instances.

#### 27.3.4.3 prototype

Whenever a GeneratorFunction instance is created another [ordinary object](#ordinary-object) is also created and is the initial value of the generator function's "prototype" property. The value of the prototype property is used to initialize the `[[Prototype]]` internal slot of a newly created Generator when the generator [function object](#function-object) is invoked using `[[Call]]`.

This property has the attributes { `[[Writable]]`: true, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

Note

Unlike Function instances, the object that is the value of a GeneratorFunction's "prototype" property does not have a "constructor" property whose value is the GeneratorFunction instance.

## 27.4 AsyncGeneratorFunction Objects

AsyncGeneratorFunctions are functions that are usually created by evaluating [AsyncGeneratorDeclaration](#prod-AsyncGeneratorDeclaration), [AsyncGeneratorExpression](#prod-AsyncGeneratorExpression), and [AsyncGeneratorMethod](#prod-AsyncGeneratorMethod) syntactic productions. They may also be created by calling the [%AsyncGeneratorFunction%](#sec-asyncgeneratorfunction-constructor) intrinsic.

### 27.4.1 The AsyncGeneratorFunction Constructor

The AsyncGeneratorFunction [constructor](#constructor):

- is %AsyncGeneratorFunction%.
- is a subclass of `Function`.
- creates and initializes a new AsyncGeneratorFunction when called as a function rather than as a [constructor](#constructor). Thus the function call `AsyncGeneratorFunction (...)` is equivalent to the object creation expression `new AsyncGeneratorFunction (...)` with the same arguments.
- may be used as the value of an `extends` clause of a class definition. Subclass [constructors](#constructor) that intend to inherit the specified AsyncGeneratorFunction behaviour must include a `super` call to the AsyncGeneratorFunction [constructor](#constructor) to create and initialize subclass instances with the internal slots necessary for built-in AsyncGeneratorFunction behaviour. All ECMAScript syntactic forms for defining async generator [function objects](#function-object) create direct instances of AsyncGeneratorFunction. There is no syntactic means to create instances of AsyncGeneratorFunction subclasses.

#### 27.4.1.1 AsyncGeneratorFunction ( ...`parameterArgs`, `bodyArg` )

The last argument (if any) specifies the body (executable code) of an async generator function; any preceding arguments specify formal parameters.

This function performs the following steps when called:

1.  Let `C` be the [active function object](#active-function-object).
2.  If `bodyArg` is not present, set `bodyArg` to the empty String.
3.  Return ? [CreateDynamicFunction](#sec-createdynamicfunction)(`C`, NewTarget, async-generator, `parameterArgs`, `bodyArg`).

Note

See NOTE for [20.2.1.1](#sec-function-p1-p2-pn-body).

### 27.4.2 Properties of the AsyncGeneratorFunction Constructor

The AsyncGeneratorFunction [constructor](#constructor):

- is a standard built-in [function object](#function-object) that inherits from the Function [constructor](#constructor).
- has a `[[Prototype]]` internal slot whose value is [%Function%](#sec-function-constructor).
- has a "length" property whose value is 1_(𝔽).
- has a "name" property whose value is "AsyncGeneratorFunction".
- has the following properties:

#### 27.4.2.1 AsyncGeneratorFunction.prototype

The initial value of `AsyncGeneratorFunction.prototype` is the [AsyncGeneratorFunction prototype object](#sec-properties-of-asyncgeneratorfunction-prototype).

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

### 27.4.3 Properties of the AsyncGeneratorFunction Prototype Object

The AsyncGeneratorFunction prototype object:

- is %AsyncGeneratorFunction.prototype%.
- is an [ordinary object](#ordinary-object).
- is not a [function object](#function-object) and does not have an `[[ECMAScriptCode]]` internal slot or any other of the internal slots listed in [Table 30](#table-internal-slots-of-ecmascript-function-objects) or [Table 92](#table-internal-slots-of-asyncgenerator-instances).
- has a `[[Prototype]]` internal slot whose value is [%Function.prototype%](#sec-properties-of-the-function-prototype-object).

#### 27.4.3.1 AsyncGeneratorFunction.prototype.constructor

The initial value of `AsyncGeneratorFunction.prototype.constructor` is [%AsyncGeneratorFunction%](#sec-asyncgeneratorfunction-constructor).

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: true }.

#### 27.4.3.2 AsyncGeneratorFunction.prototype.prototype

The initial value of `AsyncGeneratorFunction.prototype.prototype` is [%AsyncGeneratorPrototype%](#sec-properties-of-asyncgenerator-prototype).

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: true }.

#### 27.4.3.3 AsyncGeneratorFunction.prototype \[ %Symbol.toStringTag% \]

The initial value of the [%Symbol.toStringTag%](#sec-well-known-symbols) property is the String value "AsyncGeneratorFunction".

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: true }.

### 27.4.4 AsyncGeneratorFunction Instances

Every AsyncGeneratorFunction instance is an ECMAScript [function object](#function-object) and has the internal slots listed in [Table 30](#table-internal-slots-of-ecmascript-function-objects). The value of the `[[IsClassConstructor]]` internal slot for all such instances is false.

Each AsyncGeneratorFunction instance has the following own properties:

#### 27.4.4.1 length

The value of the "length" property is an [integral Number](#integral-number) that indicates the typical number of arguments expected by the AsyncGeneratorFunction. However, the language permits the function to be invoked with some other number of arguments. The behaviour of an AsyncGeneratorFunction when invoked on a number of arguments other than the number specified by its "length" property depends on the function.

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: true }.

#### 27.4.4.2 name

The specification for the "name" property of Function instances given in [20.2.4.2](#sec-function-instances-name) also applies to AsyncGeneratorFunction instances.

#### 27.4.4.3 prototype

Whenever an AsyncGeneratorFunction instance is created, another [ordinary object](#ordinary-object) is also created and is the initial value of the async generator function's "prototype" property. The value of the prototype property is used to initialize the `[[Prototype]]` internal slot of a newly created AsyncGenerator when the generator [function object](#function-object) is invoked using `[[Call]]`.

This property has the attributes { `[[Writable]]`: true, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

Note

Unlike function instances, the object that is the value of an AsyncGeneratorFunction's "prototype" property does not have a "constructor" property whose value is the AsyncGeneratorFunction instance.

## 27.5 Generator Objects

A Generator is created by calling a generator function and conforms to both the [iterator interface](#sec-iterator-interface) and the [iterable interface](#sec-iterable-interface).

Generator instances directly inherit properties from the initial value of the "prototype" property of the generator function that created the instance. Generator instances indirectly inherit properties from [%GeneratorPrototype%](#sec-properties-of-generator-prototype).

### 27.5.1 The %GeneratorPrototype% Object

The %GeneratorPrototype% object:

- is %GeneratorFunction.prototype.prototype%.
- is an [ordinary object](#ordinary-object).
- is not a Generator instance and does not have a `[[GeneratorState]]` internal slot.
- has a `[[Prototype]]` internal slot whose value is [%Iterator.prototype%](#sec-%iterator.prototype%-object).
- has properties that are indirectly inherited by all Generator instances.

#### 27.5.1.1 %GeneratorPrototype%.constructor

The initial value of [%GeneratorPrototype%](#sec-properties-of-generator-prototype)`.constructor` is [%GeneratorFunction.prototype%](#sec-properties-of-the-generatorfunction-prototype-object).

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: true }.

#### 27.5.1.2 %GeneratorPrototype%.next ( `value` )

1.  Return ? [GeneratorResume](#sec-generatorresume)(this value, `value`, empty).

#### 27.5.1.3 %GeneratorPrototype%.return ( `value` )

This method performs the following steps when called:

1.  Let `g` be the this value.
2.  Let `C` be [ReturnCompletion](#sec-returncompletion)(`value`).
3.  Return ? [GeneratorResumeAbrupt](#sec-generatorresumeabrupt)(`g`, `C`, empty).

#### 27.5.1.4 %GeneratorPrototype%.throw ( `exception` )

This method performs the following steps when called:

1.  Let `g` be the this value.
2.  Let `C` be [ThrowCompletion](#sec-throwcompletion)(`exception`).
3.  Return ? [GeneratorResumeAbrupt](#sec-generatorresumeabrupt)(`g`, `C`, empty).

#### 27.5.1.5 %GeneratorPrototype% \[ %Symbol.toStringTag% \]

The initial value of the [%Symbol.toStringTag%](#sec-well-known-symbols) property is the String value "Generator".

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: true }.

### 27.5.2 Properties of Generator Instances

Generator instances are initially created with the internal slots described in [Table 91](#table-internal-slots-of-generator-instances).

| Internal Slot | Type | Description |
|----|----|----|
| `[[GeneratorState]]` | suspended-start, suspended-yield, executing, or completed | The current execution state of the generator. |
| `[[GeneratorContext]]` | an [execution context](#sec-execution-contexts) | The [execution context](#sec-execution-contexts) that is used when executing the code of this generator. |
| `[[GeneratorBrand]]` | a String or empty | A brand used to distinguish different kinds of generators. The `[[GeneratorBrand]]` of generators declared by [ECMAScript source text](#sec-source-text) is always empty. |

Table 91: Internal Slots of Generator Instances

### 27.5.3 Generator Abstract Operations

#### 27.5.3.1 GeneratorStart ( `generator`, `generatorBody` )

The abstract operation GeneratorStart takes arguments `generator` (a Generator) and `generatorBody` (a [FunctionBody](#prod-FunctionBody) [Parse Node](#sec-syntactic-grammar) or an [Abstract Closure](#sec-abstract-closure) with no parameters) and returns unused. It performs the following steps when called:

1.  [Assert](#assert): The value of `generator`.`[[GeneratorState]]` is suspended-start.
2.  Let `genContext` be the [running execution context](#running-execution-context).
3.  Set the Generator component of `genContext` to `generator`.
4.  Let `closure` be a new [Abstract Closure](#sec-abstract-closure) with no parameters that captures `generatorBody` and performs the following steps when called:
    1.  Let `acGenContext` be the [running execution context](#running-execution-context).
    2.  Let `acGenerator` be the Generator component of `acGenContext`.
    3.  If `generatorBody` is a [Parse Node](#sec-syntactic-grammar), then
        1.  Let `result` be [Completion](#sec-completion-ao)([Evaluation](#sec-evaluation) of `generatorBody`).
    4.  Else,
        1.  [Assert](#assert): `generatorBody` is an [Abstract Closure](#sec-abstract-closure) with no parameters.
        2.  Let `result` be `generatorBody`().
    5.  [Assert](#assert): If we return here, the generator either threw an exception or performed either an implicit or explicit return.
    6.  Remove `acGenContext` from the [execution context stack](#execution-context-stack) and restore the [execution context](#sec-execution-contexts) that is at the top of the [execution context stack](#execution-context-stack) as the [running execution context](#running-execution-context).
    7.  Set `acGenerator`.`[[GeneratorState]]` to completed.
    8.  NOTE: Once a generator enters the completed state it never leaves it and its associated [execution context](#sec-execution-contexts) is never resumed. Any execution state associated with `acGenerator` can be discarded at this point.
    9.  If `result` is a [normal completion](#sec-completion-record-specification-type), then
        1.  Let `resultValue` be undefined.
    10. Else if `result` is a [return completion](#sec-completion-record-specification-type), then
        1.  Let `resultValue` be `result`.`[[Value]]`.
    11. Else,
        1.  [Assert](#assert): `result` is a [throw completion](#sec-completion-record-specification-type).
        2.  Return ? `result`.
    12. Return [CreateIteratorResultObject](#sec-createiterresultobject)(`resultValue`, true).
5.  Set the code evaluation state of `genContext` such that when evaluation is resumed for that [execution context](#sec-execution-contexts), `closure` will be called with no arguments.
6.  Set `generator`.`[[GeneratorContext]]` to `genContext`.
7.  Return unused.

#### 27.5.3.2 GeneratorValidate ( `generator`, `generatorBrand` )

The abstract operation GeneratorValidate takes arguments `generator` (an [ECMAScript language value](#sec-ecmascript-language-types)) and `generatorBrand` (a String or empty) and returns either a [normal completion containing](#sec-completion-record-specification-type) one of suspended-start, suspended-yield, or completed, or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`generator`, `[[GeneratorState]]`).
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`generator`, `[[GeneratorBrand]]`).
3.  If `generator`.`[[GeneratorBrand]]` is not `generatorBrand`, throw a TypeError exception.
4.  [Assert](#assert): `generator` also has a `[[GeneratorContext]]` internal slot.
5.  Let `state` be `generator`.`[[GeneratorState]]`.
6.  If `state` is executing, throw a TypeError exception.
7.  Return `state`.

#### 27.5.3.3 GeneratorResume ( `generator`, `value`, `generatorBrand` )

The abstract operation GeneratorResume takes arguments `generator` (an [ECMAScript language value](#sec-ecmascript-language-types)), `value` (an [ECMAScript language value](#sec-ecmascript-language-types) or empty), and `generatorBrand` (a String or empty) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [ECMAScript language value](#sec-ecmascript-language-types) or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `state` be ? [GeneratorValidate](#sec-generatorvalidate)(`generator`, `generatorBrand`).
2.  If `state` is completed, return [CreateIteratorResultObject](#sec-createiterresultobject)(undefined, true).
3.  [Assert](#assert): `state` is either suspended-start or suspended-yield.
4.  Let `genContext` be `generator`.`[[GeneratorContext]]`.
5.  Let `methodContext` be the [running execution context](#running-execution-context).
6.  Suspend `methodContext`.
7.  Set `generator`.`[[GeneratorState]]` to executing.
8.  Push `genContext` onto the [execution context stack](#execution-context-stack); `genContext` is now the [running execution context](#running-execution-context).
9.  Resume the suspended evaluation of `genContext` using [NormalCompletion](#sec-normalcompletion)(`value`) as the result of the operation that suspended it. Let `result` be the value returned by the resumed computation.
10. [Assert](#assert): When we return here, `genContext` has already been removed from the [execution context stack](#execution-context-stack) and `methodContext` is the currently [running execution context](#running-execution-context).
11. Return ? `result`.

#### 27.5.3.4 GeneratorResumeAbrupt ( `generator`, `abruptCompletion`, `generatorBrand` )

The abstract operation GeneratorResumeAbrupt takes arguments `generator` (an [ECMAScript language value](#sec-ecmascript-language-types)), `abruptCompletion` (a [return completion](#sec-completion-record-specification-type) or a [throw completion](#sec-completion-record-specification-type)), and `generatorBrand` (a String or empty) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [ECMAScript language value](#sec-ecmascript-language-types) or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `state` be ? [GeneratorValidate](#sec-generatorvalidate)(`generator`, `generatorBrand`).
2.  If `state` is suspended-start, then
    1.  Set `generator`.`[[GeneratorState]]` to completed.
    2.  NOTE: Once a generator enters the completed state it never leaves it and its associated [execution context](#sec-execution-contexts) is never resumed. Any execution state associated with `generator` can be discarded at this point.
    3.  Set `state` to completed.
3.  If `state` is completed, then
    1.  If `abruptCompletion` is a [return completion](#sec-completion-record-specification-type), then
        1.  Return [CreateIteratorResultObject](#sec-createiterresultobject)(`abruptCompletion`.`[[Value]]`, true).
    2.  Return ? `abruptCompletion`.
4.  [Assert](#assert): `state` is suspended-yield.
5.  Let `genContext` be `generator`.`[[GeneratorContext]]`.
6.  Let `methodContext` be the [running execution context](#running-execution-context).
7.  Suspend `methodContext`.
8.  Set `generator`.`[[GeneratorState]]` to executing.
9.  Push `genContext` onto the [execution context stack](#execution-context-stack); `genContext` is now the [running execution context](#running-execution-context).
10. Resume the suspended evaluation of `genContext` using `abruptCompletion` as the result of the operation that suspended it. Let `result` be the [Completion Record](#sec-completion-record-specification-type) returned by the resumed computation.
11. [Assert](#assert): When we return here, `genContext` has already been removed from the [execution context stack](#execution-context-stack) and `methodContext` is the currently [running execution context](#running-execution-context).
12. Return ? `result`.

#### 27.5.3.5 GetGeneratorKind ( )

The abstract operation GetGeneratorKind takes no arguments and returns non-generator, sync, or async. It performs the following steps when called:

1.  Let `genContext` be the [running execution context](#running-execution-context).
2.  If `genContext` does not have a Generator component, return non-generator.
3.  Let `generator` be the Generator component of `genContext`.
4.  If `generator` has an `[[AsyncGeneratorState]]` internal slot, return async.
5.  Else, return sync.

#### 27.5.3.6 GeneratorYield ( `iteratorResult` )

The abstract operation GeneratorYield takes argument `iteratorResult` (an Object that conforms to the [IteratorResult interface](#sec-iteratorresult-interface)) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [ECMAScript language value](#sec-ecmascript-language-types) or an [abrupt completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `genContext` be the [running execution context](#running-execution-context).
2.  [Assert](#assert): `genContext` is the [execution context](#sec-execution-contexts) of a generator.
3.  Let `generator` be the value of the Generator component of `genContext`.
4.  [Assert](#assert): [GetGeneratorKind](#sec-getgeneratorkind)() is sync.
5.  Set `generator`.`[[GeneratorState]]` to suspended-yield.
6.  Remove `genContext` from the [execution context stack](#execution-context-stack) and restore the [execution context](#sec-execution-contexts) that is at the top of the [execution context stack](#execution-context-stack) as the [running execution context](#running-execution-context).
7.  Let `callerContext` be the [running execution context](#running-execution-context).
8.  Resume `callerContext` passing [NormalCompletion](#sec-normalcompletion)(`iteratorResult`). If `genContext` is ever resumed again, let `resumptionValue` be the [Completion Record](#sec-completion-record-specification-type) with which it is resumed.
9.  [Assert](#assert): If control reaches here, then `genContext` is the [running execution context](#running-execution-context) again.
10. Return `resumptionValue`.

#### 27.5.3.7 Yield ( `value` )

The abstract operation Yield takes argument `value` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [ECMAScript language value](#sec-ecmascript-language-types) or an [abrupt completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `generatorKind` be [GetGeneratorKind](#sec-getgeneratorkind)().
2.  If `generatorKind` is async, return ? [AsyncGeneratorYield](#sec-asyncgeneratoryield)(? [Await](#await)(`value`)).
3.  Otherwise, return ? [GeneratorYield](#sec-generatoryield)([CreateIteratorResultObject](#sec-createiterresultobject)(`value`, false)).

#### 27.5.3.8 CreateIteratorFromClosure ( `closure`, `generatorBrand`, `generatorPrototype` \[ , `extraSlots` \] )

The abstract operation CreateIteratorFromClosure takes arguments `closure` (an [Abstract Closure](#sec-abstract-closure) with no parameters), `generatorBrand` (a String or empty), and `generatorPrototype` (an Object) and optional argument `extraSlots` (a [List](#sec-list-and-record-specification-type) of names of internal slots) and returns a Generator. It performs the following steps when called:

1.  NOTE: `closure` can contain uses of the [Yield](#sec-yield) operation to yield an [IteratorResult object](#sec-iteratorresult-interface).
2.  If `extraSlots` is not present, set `extraSlots` to a new empty [List](#sec-list-and-record-specification-type).
3.  Let `internalSlotsList` be the [list-concatenation](#list-concatenation) of `extraSlots` and « `[[GeneratorState]]`, `[[GeneratorContext]]`, `[[GeneratorBrand]]` ».
4.  Let `generator` be [OrdinaryObjectCreate](#sec-ordinaryobjectcreate)(`generatorPrototype`, `internalSlotsList`).
5.  Set `generator`.`[[GeneratorBrand]]` to `generatorBrand`.
6.  Set `generator`.`[[GeneratorState]]` to suspended-start.
7.  Let `callerContext` be the [running execution context](#running-execution-context).
8.  Let `calleeContext` be a new [execution context](#sec-execution-contexts).
9.  Set the Function of `calleeContext` to null.
10. Set the [Realm](#realm) of `calleeContext` to [the current Realm Record](#current-realm).
11. Set the ScriptOrModule of `calleeContext` to `callerContext`'s ScriptOrModule.
12. If `callerContext` is not already suspended, suspend `callerContext`.
13. Push `calleeContext` onto the [execution context stack](#execution-context-stack); `calleeContext` is now the [running execution context](#running-execution-context).
14. Perform [GeneratorStart](#sec-generatorstart)(`generator`, `closure`).
15. Remove `calleeContext` from the [execution context stack](#execution-context-stack) and restore `callerContext` as the [running execution context](#running-execution-context).
16. Return `generator`.

## 27.6 AsyncGenerator Objects

An AsyncGenerator is created by calling an async generator function and conforms to both the [async iterator interface](#sec-asynciterator-interface) and the [async iterable interface](#sec-asynciterable-interface).

AsyncGenerator instances directly inherit properties from the initial value of the "prototype" property of the async generator function that created the instance. AsyncGenerator instances indirectly inherit properties from [%AsyncGeneratorPrototype%](#sec-properties-of-asyncgenerator-prototype).

### 27.6.1 The %AsyncGeneratorPrototype% Object

The %AsyncGeneratorPrototype% object:

- is %AsyncGeneratorFunction.prototype.prototype%.
- is an [ordinary object](#ordinary-object).
- is not an AsyncGenerator instance and does not have an `[[AsyncGeneratorState]]` internal slot.
- has a `[[Prototype]]` internal slot whose value is [%AsyncIteratorPrototype%](#sec-asynciteratorprototype).
- has properties that are indirectly inherited by all AsyncGenerator instances.

#### 27.6.1.1 %AsyncGeneratorPrototype%.constructor

The initial value of [%AsyncGeneratorPrototype%](#sec-properties-of-asyncgenerator-prototype)`.constructor` is [%AsyncGeneratorFunction.prototype%](#sec-properties-of-asyncgeneratorfunction-prototype).

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: true }.

#### 27.6.1.2 %AsyncGeneratorPrototype%.next ( `value` )

1.  Let `generator` be the this value.
2.  Let `promiseCapability` be ! [NewPromiseCapability](#sec-newpromisecapability)([%Promise%](#sec-promise-constructor)).
3.  Let `result` be [Completion](#sec-completion-ao)([AsyncGeneratorValidate](#sec-asyncgeneratorvalidate)(`generator`, empty)).
4.  [IfAbruptRejectPromise](#sec-ifabruptrejectpromise)(`result`, `promiseCapability`).
5.  Let `state` be `generator`.`[[AsyncGeneratorState]]`.
6.  If `state` is completed, then
    1.  Let `iteratorResult` be [CreateIteratorResultObject](#sec-createiterresultobject)(undefined, true).
    2.  Perform ! Call(`promiseCapability`.`[[Resolve]]`, undefined, « `iteratorResult` »).
    3.  Return `promiseCapability`.`[[Promise]]`.
7.  Let `completion` be [NormalCompletion](#sec-normalcompletion)(`value`).
8.  Perform [AsyncGeneratorEnqueue](#sec-asyncgeneratorenqueue)(`generator`, `completion`, `promiseCapability`).
9.  If `state` is either suspended-start or suspended-yield, then
    1.  Perform [AsyncGeneratorResume](#sec-asyncgeneratorresume)(`generator`, `completion`).
10. Else,
    1.  [Assert](#assert): `state` is either executing or draining-queue.
11. Return `promiseCapability`.`[[Promise]]`.

#### 27.6.1.3 %AsyncGeneratorPrototype%.return ( `value` )

1.  Let `generator` be the this value.
2.  Let `promiseCapability` be ! [NewPromiseCapability](#sec-newpromisecapability)([%Promise%](#sec-promise-constructor)).
3.  Let `result` be [Completion](#sec-completion-ao)([AsyncGeneratorValidate](#sec-asyncgeneratorvalidate)(`generator`, empty)).
4.  [IfAbruptRejectPromise](#sec-ifabruptrejectpromise)(`result`, `promiseCapability`).
5.  Let `completion` be [ReturnCompletion](#sec-returncompletion)(`value`).
6.  Perform [AsyncGeneratorEnqueue](#sec-asyncgeneratorenqueue)(`generator`, `completion`, `promiseCapability`).
7.  Let `state` be `generator`.`[[AsyncGeneratorState]]`.
8.  If `state` is either suspended-start or completed, then
    1.  Set `generator`.`[[AsyncGeneratorState]]` to draining-queue.
    2.  Perform [AsyncGeneratorAwaitReturn](#sec-asyncgeneratorawaitreturn)(`generator`).
9.  Else if `state` is suspended-yield, then
    1.  Perform [AsyncGeneratorResume](#sec-asyncgeneratorresume)(`generator`, `completion`).
10. Else,
    1.  [Assert](#assert): `state` is either executing or draining-queue.
11. Return `promiseCapability`.`[[Promise]]`.

#### 27.6.1.4 %AsyncGeneratorPrototype%.throw ( `exception` )

1.  Let `generator` be the this value.
2.  Let `promiseCapability` be ! [NewPromiseCapability](#sec-newpromisecapability)([%Promise%](#sec-promise-constructor)).
3.  Let `result` be [Completion](#sec-completion-ao)([AsyncGeneratorValidate](#sec-asyncgeneratorvalidate)(`generator`, empty)).
4.  [IfAbruptRejectPromise](#sec-ifabruptrejectpromise)(`result`, `promiseCapability`).
5.  Let `state` be `generator`.`[[AsyncGeneratorState]]`.
6.  If `state` is suspended-start, then
    1.  Set `generator`.`[[AsyncGeneratorState]]` to completed.
    2.  Set `state` to completed.
7.  If `state` is completed, then
    1.  Perform ! [Call](#sec-call)(`promiseCapability`.`[[Reject]]`, undefined, « `exception` »).
    2.  Return `promiseCapability`.`[[Promise]]`.
8.  Let `completion` be [ThrowCompletion](#sec-throwcompletion)(`exception`).
9.  Perform [AsyncGeneratorEnqueue](#sec-asyncgeneratorenqueue)(`generator`, `completion`, `promiseCapability`).
10. If `state` is suspended-yield, then
    1.  Perform [AsyncGeneratorResume](#sec-asyncgeneratorresume)(`generator`, `completion`).
11. Else,
    1.  [Assert](#assert): `state` is either executing or draining-queue.
12. Return `promiseCapability`.`[[Promise]]`.

#### 27.6.1.5 %AsyncGeneratorPrototype% \[ %Symbol.toStringTag% \]

The initial value of the [%Symbol.toStringTag%](#sec-well-known-symbols) property is the String value "AsyncGenerator".

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: true }.

### 27.6.2 Properties of AsyncGenerator Instances

AsyncGenerator instances are initially created with the internal slots described below:

| Internal Slot | Type | Description |
|----|----|----|
| `[[AsyncGeneratorState]]` | suspended-start, suspended-yield, executing, draining-queue, or completed | The current execution state of the async generator. |
| `[[AsyncGeneratorContext]]` | an [execution context](#sec-execution-contexts) | The [execution context](#sec-execution-contexts) that is used when executing the code of this async generator. |
| `[[AsyncGeneratorQueue]]` | a [List](#sec-list-and-record-specification-type) of [AsyncGeneratorRequest](#sec-asyncgeneratorrequest-records) [Records](#sec-list-and-record-specification-type) | [Records](#sec-list-and-record-specification-type) which represent requests to resume the async generator. Except during state transitions, it is non-empty if and only if `[[AsyncGeneratorState]]` is either executing or draining-queue. |
| `[[GeneratorBrand]]` | a String or empty | A brand used to distinguish different kinds of async generators. The `[[GeneratorBrand]]` of async generators declared by [ECMAScript source text](#sec-source-text) is always empty. |

Table 92: Internal Slots of AsyncGenerator Instances

### 27.6.3 AsyncGenerator Abstract Operations

#### 27.6.3.1 AsyncGeneratorRequest Records

An AsyncGeneratorRequest is a [Record](#sec-list-and-record-specification-type) value used to store information about how an async generator should be resumed and contains capabilities for fulfilling or rejecting the corresponding promise.

They have the following fields:

| Field Name | Value | Meaning |
|----|----|----|
| `[[Completion]]` | a [Completion Record](#sec-completion-record-specification-type) | The [Completion Record](#sec-completion-record-specification-type) which should be used to resume the async generator. |
| `[[Capability]]` | a [PromiseCapability Record](#sec-promisecapability-records) | The promise capabilities associated with this request. |

Table 93: AsyncGeneratorRequest [Record](#sec-list-and-record-specification-type) Fields

#### 27.6.3.2 AsyncGeneratorStart ( `generator`, `generatorBody` )

The abstract operation AsyncGeneratorStart takes arguments `generator` (an AsyncGenerator) and `generatorBody` (a [FunctionBody](#prod-FunctionBody) [Parse Node](#sec-syntactic-grammar) or an [Abstract Closure](#sec-abstract-closure) with no parameters) and returns unused. It performs the following steps when called:

1.  [Assert](#assert): `generator`.`[[AsyncGeneratorState]]` is suspended-start.
2.  Let `genContext` be the [running execution context](#running-execution-context).
3.  Set the Generator component of `genContext` to `generator`.
4.  Let `closure` be a new [Abstract Closure](#sec-abstract-closure) with no parameters that captures `generatorBody` and performs the following steps when called:
    1.  Let `acGenContext` be the [running execution context](#running-execution-context).
    2.  Let `acGenerator` be the Generator component of `acGenContext`.
    3.  If `generatorBody` is a [Parse Node](#sec-syntactic-grammar), then
        1.  Let `result` be [Completion](#sec-completion-ao)([Evaluation](#sec-evaluation) of `generatorBody`).
    4.  Else,
        1.  [Assert](#assert): `generatorBody` is an [Abstract Closure](#sec-abstract-closure) with no parameters.
        2.  Let `result` be [Completion](#sec-completion-ao)(`generatorBody`()).
    5.  [Assert](#assert): If we return here, the async generator either threw an exception or performed either an implicit or explicit return.
    6.  Remove `acGenContext` from the [execution context stack](#execution-context-stack) and restore the [execution context](#sec-execution-contexts) that is at the top of the [execution context stack](#execution-context-stack) as the [running execution context](#running-execution-context).
    7.  Set `acGenerator`.`[[AsyncGeneratorState]]` to draining-queue.
    8.  If `result` is a [normal completion](#sec-completion-record-specification-type), set `result` to [NormalCompletion](#sec-normalcompletion)(undefined).
    9.  If `result` is a [return completion](#sec-completion-record-specification-type), set `result` to [NormalCompletion](#sec-normalcompletion)(`result`.`[[Value]]`).
    10. Perform [AsyncGeneratorCompleteStep](#sec-asyncgeneratorcompletestep)(`acGenerator`, `result`, true).
    11. Perform [AsyncGeneratorDrainQueue](#sec-asyncgeneratordrainqueue)(`acGenerator`).
    12. Return undefined.
5.  Set the code evaluation state of `genContext` such that when evaluation is resumed for that [execution context](#sec-execution-contexts), `closure` will be called with no arguments.
6.  Set `generator`.`[[AsyncGeneratorContext]]` to `genContext`.
7.  Set `generator`.`[[AsyncGeneratorQueue]]` to a new empty [List](#sec-list-and-record-specification-type).
8.  Return unused.

#### 27.6.3.3 AsyncGeneratorValidate ( `generator`, `generatorBrand` )

The abstract operation AsyncGeneratorValidate takes arguments `generator` (an [ECMAScript language value](#sec-ecmascript-language-types)) and `generatorBrand` (a String or empty) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`generator`, `[[AsyncGeneratorContext]]`).
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`generator`, `[[AsyncGeneratorState]]`).
3.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`generator`, `[[AsyncGeneratorQueue]]`).
4.  If `generator`.`[[GeneratorBrand]]` is not `generatorBrand`, throw a TypeError exception.
5.  Return unused.

#### 27.6.3.4 AsyncGeneratorEnqueue ( `generator`, `completion`, `promiseCapability` )

The abstract operation AsyncGeneratorEnqueue takes arguments `generator` (an AsyncGenerator), `completion` (a [Completion Record](#sec-completion-record-specification-type)), and `promiseCapability` (a [PromiseCapability Record](#sec-promisecapability-records)) and returns unused. It performs the following steps when called:

1.  Let `request` be [AsyncGeneratorRequest](#sec-asyncgeneratorrequest-records) { `[[Completion]]`: `completion`, `[[Capability]]`: `promiseCapability` }.
2.  Append `request` to `generator`.`[[AsyncGeneratorQueue]]`.
3.  Return unused.

#### 27.6.3.5 AsyncGeneratorCompleteStep ( `generator`, `completion`, `done` \[ , `realm` \] )

The abstract operation AsyncGeneratorCompleteStep takes arguments `generator` (an AsyncGenerator), `completion` (a [Completion Record](#sec-completion-record-specification-type)), and `done` (a Boolean) and optional argument `realm` (a [Realm Record](#realm-record)) and returns unused. It performs the following steps when called:

1.  [Assert](#assert): `generator`.`[[AsyncGeneratorQueue]]` is not empty.
2.  Let `next` be the first element of `generator`.`[[AsyncGeneratorQueue]]`.
3.  Remove the first element from `generator`.`[[AsyncGeneratorQueue]]`.
4.  Let `promiseCapability` be `next`.`[[Capability]]`.
5.  Let `value` be `completion`.`[[Value]]`.
6.  If `completion` is a [throw completion](#sec-completion-record-specification-type), then
    1.  Perform ! [Call](#sec-call)(`promiseCapability`.`[[Reject]]`, undefined, « `value` »).
7.  Else,
    1.  [Assert](#assert): `completion` is a [normal completion](#sec-completion-record-specification-type).
    2.  If `realm` is present, then
        1.  Let `oldRealm` be the [running execution context](#running-execution-context)'s [Realm](#realm).
        2.  Set the [running execution context](#running-execution-context)'s [Realm](#realm) to `realm`.
        3.  Let `iteratorResult` be [CreateIteratorResultObject](#sec-createiterresultobject)(`value`, `done`).
        4.  Set the [running execution context](#running-execution-context)'s [Realm](#realm) to `oldRealm`.
    3.  Else,
        1.  Let `iteratorResult` be [CreateIteratorResultObject](#sec-createiterresultobject)(`value`, `done`).
    4.  Perform ! Call(`promiseCapability`.`[[Resolve]]`, undefined, « `iteratorResult` »).
8.  Return unused.

#### 27.6.3.6 AsyncGeneratorResume ( `generator`, `completion` )

The abstract operation AsyncGeneratorResume takes arguments `generator` (an AsyncGenerator) and `completion` (a [Completion Record](#sec-completion-record-specification-type)) and returns unused. It performs the following steps when called:

1.  [Assert](#assert): `generator`.`[[AsyncGeneratorState]]` is either suspended-start or suspended-yield.
2.  Let `genContext` be `generator`.`[[AsyncGeneratorContext]]`.
3.  Let `callerContext` be the [running execution context](#running-execution-context).
4.  Suspend `callerContext`.
5.  Set `generator`.`[[AsyncGeneratorState]]` to executing.
6.  Push `genContext` onto the [execution context stack](#execution-context-stack); `genContext` is now the [running execution context](#running-execution-context).
7.  Resume the suspended evaluation of `genContext` using `completion` as the result of the operation that suspended it. Let `result` be the [Completion Record](#sec-completion-record-specification-type) returned by the resumed computation.
8.  [Assert](#assert): `result` is never an [abrupt completion](#sec-completion-record-specification-type).
9.  [Assert](#assert): When we return here, `genContext` has already been removed from the [execution context stack](#execution-context-stack) and `callerContext` is the currently [running execution context](#running-execution-context).
10. Return unused.

#### 27.6.3.7 AsyncGeneratorUnwrapYieldResumption ( `resumptionValue` )

The abstract operation AsyncGeneratorUnwrapYieldResumption takes argument `resumptionValue` (a [Completion Record](#sec-completion-record-specification-type)) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [ECMAScript language value](#sec-ecmascript-language-types) or an [abrupt completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  If `resumptionValue` is not a [return completion](#sec-completion-record-specification-type), return ? `resumptionValue`.
2.  Let `awaited` be [Completion](#sec-completion-ao)([Await](#await)(`resumptionValue`.`[[Value]]`)).
3.  If `awaited` is a [throw completion](#sec-completion-record-specification-type), return ? `awaited`.
4.  [Assert](#assert): `awaited` is a [normal completion](#sec-completion-record-specification-type).
5.  Return [ReturnCompletion](#sec-returncompletion)(`awaited`.`[[Value]]`).

#### 27.6.3.8 AsyncGeneratorYield ( `value` )

The abstract operation AsyncGeneratorYield takes argument `value` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [ECMAScript language value](#sec-ecmascript-language-types) or an [abrupt completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `genContext` be the [running execution context](#running-execution-context).
2.  [Assert](#assert): `genContext` is the [execution context](#sec-execution-contexts) of a generator.
3.  Let `generator` be the value of the Generator component of `genContext`.
4.  [Assert](#assert): [GetGeneratorKind](#sec-getgeneratorkind)() is async.
5.  Let `completion` be [NormalCompletion](#sec-normalcompletion)(`value`).
6.  [Assert](#assert): The [execution context stack](#execution-context-stack) has at least two elements.
7.  Let `previousContext` be the second to top element of the [execution context stack](#execution-context-stack).
8.  Let `previousRealm` be `previousContext`'s [Realm](#realm).
9.  Perform [AsyncGeneratorCompleteStep](#sec-asyncgeneratorcompletestep)(`generator`, `completion`, false, `previousRealm`).
10. Let `queue` be `generator`.`[[AsyncGeneratorQueue]]`.
11. If `queue` is not empty, then
    1.  NOTE: Execution continues without suspending the generator.
    2.  Let `toYield` be the first element of `queue`.
    3.  Let `resumptionValue` be [Completion](#sec-completion-ao)(`toYield`.`[[Completion]]`).
    4.  Return ? [AsyncGeneratorUnwrapYieldResumption](#sec-asyncgeneratorunwrapyieldresumption)(`resumptionValue`).
12. Else,
    1.  Set `generator`.`[[AsyncGeneratorState]]` to suspended-yield.
    2.  Remove `genContext` from the [execution context stack](#execution-context-stack) and restore the [execution context](#sec-execution-contexts) that is at the top of the [execution context stack](#execution-context-stack) as the [running execution context](#running-execution-context).
    3.  Let `callerContext` be the [running execution context](#running-execution-context).
    4.  Resume `callerContext` passing undefined. If `genContext` is ever resumed again, let `resumptionValue` be the [Completion Record](#sec-completion-record-specification-type) with which it is resumed.
    5.  [Assert](#assert): If control reaches here, then `genContext` is the [running execution context](#running-execution-context) again.
    6.  Return ? [AsyncGeneratorUnwrapYieldResumption](#sec-asyncgeneratorunwrapyieldresumption)(`resumptionValue`).

#### 27.6.3.9 AsyncGeneratorAwaitReturn ( `generator` )

The abstract operation AsyncGeneratorAwaitReturn takes argument `generator` (an AsyncGenerator) and returns unused. It performs the following steps when called:

1.  [Assert](#assert): `generator`.`[[AsyncGeneratorState]]` is draining-queue.
2.  Let `queue` be `generator`.`[[AsyncGeneratorQueue]]`.
3.  [Assert](#assert): `queue` is not empty.
4.  Let `next` be the first element of `queue`.
5.  Let `completion` be [Completion](#sec-completion-ao)(`next`.`[[Completion]]`).
6.  [Assert](#assert): `completion` is a [return completion](#sec-completion-record-specification-type).
7.  Let `promiseCompletion` be [Completion](#sec-completion-ao)([PromiseResolve](#sec-promise-resolve)([%Promise%](#sec-promise-constructor), `completion`.`[[Value]]`)).
8.  If `promiseCompletion` is an [abrupt completion](#sec-completion-record-specification-type), then
    1.  Perform [AsyncGeneratorCompleteStep](#sec-asyncgeneratorcompletestep)(`generator`, `promiseCompletion`, true).
    2.  Perform [AsyncGeneratorDrainQueue](#sec-asyncgeneratordrainqueue)(`generator`).
    3.  Return unused.
9.  [Assert](#assert): `promiseCompletion` is a [normal completion](#sec-completion-record-specification-type).
10. Let `promise` be `promiseCompletion`.`[[Value]]`.
11. Let `fulfilledClosure` be a new [Abstract Closure](#sec-abstract-closure) with parameters (`value`) that captures `generator` and performs the following steps when called:
    1.  [Assert](#assert): `generator`.`[[AsyncGeneratorState]]` is draining-queue.
    2.  Let `result` be [NormalCompletion](#sec-normalcompletion)(`value`).
    3.  Perform [AsyncGeneratorCompleteStep](#sec-asyncgeneratorcompletestep)(`generator`, `result`, true).
    4.  Perform [AsyncGeneratorDrainQueue](#sec-asyncgeneratordrainqueue)(`generator`).
    5.  Return undefined.
12. Let `onFulfilled` be [CreateBuiltinFunction](#sec-createbuiltinfunction)(`fulfilledClosure`, 1, "", « »).
13. Let `rejectedClosure` be a new [Abstract Closure](#sec-abstract-closure) with parameters (`reason`) that captures `generator` and performs the following steps when called:
    1.  [Assert](#assert): `generator`.`[[AsyncGeneratorState]]` is draining-queue.
    2.  Let `result` be [ThrowCompletion](#sec-throwcompletion)(`reason`).
    3.  Perform [AsyncGeneratorCompleteStep](#sec-asyncgeneratorcompletestep)(`generator`, `result`, true).
    4.  Perform [AsyncGeneratorDrainQueue](#sec-asyncgeneratordrainqueue)(`generator`).
    5.  Return undefined.
14. Let `onRejected` be [CreateBuiltinFunction](#sec-createbuiltinfunction)(`rejectedClosure`, 1, "", « »).
15. Perform [PerformPromiseThen](#sec-performpromisethen)(`promise`, `onFulfilled`, `onRejected`).
16. Return unused.

#### 27.6.3.10 AsyncGeneratorDrainQueue ( `generator` )

The abstract operation AsyncGeneratorDrainQueue takes argument `generator` (an AsyncGenerator) and returns unused. It drains the generator's AsyncGeneratorQueue until it encounters an [AsyncGeneratorRequest](#sec-asyncgeneratorrequest-records) which holds a [return completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  [Assert](#assert): `generator`.`[[AsyncGeneratorState]]` is draining-queue.
2.  Let `queue` be `generator`.`[[AsyncGeneratorQueue]]`.
3.  Repeat, while `queue` is not empty,
    1.  Let `next` be the first element of `queue`.
    2.  Let `completion` be [Completion](#sec-completion-ao)(`next`.`[[Completion]]`).
    3.  If `completion` is a [return completion](#sec-completion-record-specification-type), then
        1.  Perform [AsyncGeneratorAwaitReturn](#sec-asyncgeneratorawaitreturn)(`generator`).
        2.  Return unused.
    4.  Else,
        1.  If `completion` is a [normal completion](#sec-completion-record-specification-type), then
            1.  Set `completion` to [NormalCompletion](#sec-normalcompletion)(undefined).
        2.  Perform [AsyncGeneratorCompleteStep](#sec-asyncgeneratorcompletestep)(`generator`, `completion`, true).
4.  Set `generator`.`[[AsyncGeneratorState]]` to completed.
5.  Return unused.

#### 27.6.3.11 CreateAsyncIteratorFromClosure ( `closure`, `generatorBrand`, `generatorPrototype` )

The abstract operation CreateAsyncIteratorFromClosure takes arguments `closure` (an [Abstract Closure](#sec-abstract-closure) with no parameters), `generatorBrand` (a String or empty), and `generatorPrototype` (an Object) and returns an AsyncGenerator. It performs the following steps when called:

1.  NOTE: `closure` can contain uses of the [Await](#await) operation and uses of the [Yield](#sec-yield) operation to yield an [IteratorResult object](#sec-iteratorresult-interface).
2.  Let `internalSlotsList` be « `[[AsyncGeneratorState]]`, `[[AsyncGeneratorContext]]`, `[[AsyncGeneratorQueue]]`, `[[GeneratorBrand]]` ».
3.  Let `generator` be [OrdinaryObjectCreate](#sec-ordinaryobjectcreate)(`generatorPrototype`, `internalSlotsList`).
4.  Set `generator`.`[[GeneratorBrand]]` to `generatorBrand`.
5.  Set `generator`.`[[AsyncGeneratorState]]` to suspended-start.
6.  Let `callerContext` be the [running execution context](#running-execution-context).
7.  Let `calleeContext` be a new [execution context](#sec-execution-contexts).
8.  Set the Function of `calleeContext` to null.
9.  Set the [Realm](#realm) of `calleeContext` to [the current Realm Record](#current-realm).
10. Set the ScriptOrModule of `calleeContext` to `callerContext`'s ScriptOrModule.
11. If `callerContext` is not already suspended, suspend `callerContext`.
12. Push `calleeContext` onto the [execution context stack](#execution-context-stack); `calleeContext` is now the [running execution context](#running-execution-context).
13. Perform [AsyncGeneratorStart](#sec-asyncgeneratorstart)(`generator`, `closure`).
14. Remove `calleeContext` from the [execution context stack](#execution-context-stack) and restore `callerContext` as the [running execution context](#running-execution-context).
15. Return `generator`.

## 27.7 AsyncFunction Objects

AsyncFunctions are functions that are usually created by evaluating [AsyncFunctionDeclaration](#prod-AsyncFunctionDeclaration)s, [AsyncFunctionExpression](#prod-AsyncFunctionExpression)s, [AsyncMethod](#prod-AsyncMethod)s, and [AsyncArrowFunction](#prod-AsyncArrowFunction)s. They may also be created by calling the [%AsyncFunction%](#sec-async-function-constructor) intrinsic.

### 27.7.1 The AsyncFunction Constructor

The AsyncFunction [constructor](#constructor):

- is %AsyncFunction%.
- is a subclass of `Function`.
- creates and initializes a new AsyncFunction when called as a function rather than as a [constructor](#constructor). Thus the function call `AsyncFunction(…)` is equivalent to the object creation expression `new AsyncFunction(…)` with the same arguments.
- may be used as the value of an `extends` clause of a class definition. Subclass [constructors](#constructor) that intend to inherit the specified AsyncFunction behaviour must include a `super` call to the AsyncFunction [constructor](#constructor) to create and initialize a subclass instance with the internal slots necessary for built-in async function behaviour. All ECMAScript syntactic forms for defining async [function objects](#function-object) create direct instances of AsyncFunction. There is no syntactic means to create instances of AsyncFunction subclasses.

#### 27.7.1.1 AsyncFunction ( ...`parameterArgs`, `bodyArg` )

The last argument (if any) specifies the body (executable code) of an async function. Any preceding arguments specify formal parameters.

This function performs the following steps when called:

1.  Let `C` be the [active function object](#active-function-object).
2.  If `bodyArg` is not present, set `bodyArg` to the empty String.
3.  Return ? [CreateDynamicFunction](#sec-createdynamicfunction)(`C`, NewTarget, async, `parameterArgs`, `bodyArg`).

Note

See NOTE for [20.2.1.1](#sec-function-p1-p2-pn-body).

### 27.7.2 Properties of the AsyncFunction Constructor

The AsyncFunction [constructor](#constructor):

- is a standard built-in [function object](#function-object) that inherits from the Function [constructor](#constructor).
- has a `[[Prototype]]` internal slot whose value is [%Function%](#sec-function-constructor).
- has a "length" property whose value is 1_(𝔽).
- has a "name" property whose value is "AsyncFunction".
- has the following properties:

#### 27.7.2.1 AsyncFunction.prototype

The initial value of `AsyncFunction.prototype` is the [AsyncFunction prototype object](#sec-async-function-prototype-properties).

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

### 27.7.3 Properties of the AsyncFunction Prototype Object

The AsyncFunction prototype object:

- is %AsyncFunction.prototype%.
- is an [ordinary object](#ordinary-object).
- is not a [function object](#function-object) and does not have an `[[ECMAScriptCode]]` internal slot or any other of the internal slots listed in [Table 30](#table-internal-slots-of-ecmascript-function-objects).
- has a `[[Prototype]]` internal slot whose value is [%Function.prototype%](#sec-properties-of-the-function-prototype-object).

#### 27.7.3.1 AsyncFunction.prototype.constructor

The initial value of `AsyncFunction.prototype.constructor` is [%AsyncFunction%](#sec-async-function-constructor).

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: true }.

#### 27.7.3.2 AsyncFunction.prototype \[ %Symbol.toStringTag% \]

The initial value of the [%Symbol.toStringTag%](#sec-well-known-symbols) property is the String value "AsyncFunction".

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: true }.

### 27.7.4 AsyncFunction Instances

Every AsyncFunction instance is an ECMAScript [function object](#function-object) and has the internal slots listed in [Table 30](#table-internal-slots-of-ecmascript-function-objects). The value of the `[[IsClassConstructor]]` internal slot for all such instances is false. AsyncFunction instances are not [constructors](#constructor) and do not have a `[[Construct]]` internal method. AsyncFunction instances do not have a prototype property as they are not constructable.

Each AsyncFunction instance has the following own properties:

#### 27.7.4.1 length

The specification for the "length" property of Function instances given in [20.2.4.1](#sec-function-instances-length) also applies to AsyncFunction instances.

#### 27.7.4.2 name

The specification for the "name" property of Function instances given in [20.2.4.2](#sec-function-instances-name) also applies to AsyncFunction instances.

### 27.7.5 Async Functions Abstract Operations

#### 27.7.5.1 AsyncFunctionStart ( `promiseCapability`, `asyncFunctionBody` )

The abstract operation AsyncFunctionStart takes arguments `promiseCapability` (a [PromiseCapability Record](#sec-promisecapability-records)) and `asyncFunctionBody` (a [FunctionBody](#prod-FunctionBody) [Parse Node](#sec-syntactic-grammar), an [ExpressionBody](#prod-ExpressionBody) [Parse Node](#sec-syntactic-grammar), or an [Abstract Closure](#sec-abstract-closure) with no parameters) and returns unused. It performs the following steps when called:

1.  Let `runningContext` be the [running execution context](#running-execution-context).
2.  Let `asyncContext` be a copy of `runningContext`.
3.  NOTE: Copying the execution state is required for [AsyncBlockStart](#sec-asyncblockstart) to resume its execution. It is ill-defined to resume a currently executing context.
4.  Perform [AsyncBlockStart](#sec-asyncblockstart)(`promiseCapability`, `asyncFunctionBody`, `asyncContext`).
5.  Return unused.

#### 27.7.5.2 AsyncBlockStart ( `promiseCapability`, `asyncBody`, `asyncContext` )

The abstract operation AsyncBlockStart takes arguments `promiseCapability` (a [PromiseCapability Record](#sec-promisecapability-records)), `asyncBody` (a [Parse Node](#sec-syntactic-grammar) or an [Abstract Closure](#sec-abstract-closure) with no parameters), and `asyncContext` (an [execution context](#sec-execution-contexts)) and returns unused. It performs the following steps when called:

1.  Let `runningContext` be the [running execution context](#running-execution-context).
2.  Let `closure` be a new [Abstract Closure](#sec-abstract-closure) with no parameters that captures `promiseCapability` and `asyncBody` and performs the following steps when called:
    1.  Let `acAsyncContext` be the [running execution context](#running-execution-context).
    2.  If `asyncBody` is a [Parse Node](#sec-syntactic-grammar), then
        1.  Let `result` be [Completion](#sec-completion-ao)([Evaluation](#sec-evaluation) of `asyncBody`).
    3.  Else,
        1.  [Assert](#assert): `asyncBody` is an [Abstract Closure](#sec-abstract-closure) with no parameters.
        2.  Let `result` be `asyncBody`().
    4.  [Assert](#assert): If we return here, the async function either threw an exception or performed an implicit or explicit return; all awaiting is done.
    5.  Remove `acAsyncContext` from the [execution context stack](#execution-context-stack) and restore the [execution context](#sec-execution-contexts) that is at the top of the [execution context stack](#execution-context-stack) as the [running execution context](#running-execution-context).
    6.  If `result` is a [normal completion](#sec-completion-record-specification-type), then
        1.  Perform ! [Call](#sec-call)(`promiseCapability`.`[[Resolve]]`, undefined, « undefined »).
    7.  Else if `result` is a [return completion](#sec-completion-record-specification-type), then
        1.  Perform ! Call(`promiseCapability`.`[[Resolve]]`, undefined, « `result`.`[[Value]]` »).
    8.  Else,
        1.  [Assert](#assert): `result` is a [throw completion](#sec-completion-record-specification-type).
        2.  Perform ! [Call](#sec-call)(`promiseCapability`.`[[Reject]]`, undefined, « `result`.`[[Value]]` »).
    9.  Return unused.
3.  Set the code evaluation state of `asyncContext` such that when evaluation is resumed for that [execution context](#sec-execution-contexts), `closure` will be called with no arguments.
4.  Push `asyncContext` onto the [execution context stack](#execution-context-stack); `asyncContext` is now the [running execution context](#running-execution-context).
5.  Resume the suspended evaluation of `asyncContext`. Let `result` be the value returned by the resumed computation.
6.  [Assert](#assert): When we return here, `asyncContext` has already been removed from the [execution context stack](#execution-context-stack) and `runningContext` is the currently [running execution context](#running-execution-context).
7.  [Assert](#assert): `result` is a [normal completion](#sec-completion-record-specification-type) with a value of unused. The possible sources of this value are [Await](#await) or, if the async function doesn't await anything, step [2.i](#step-asyncblockstart-return-undefined) above.
8.  Return unused.

#### 27.7.5.3 Await ( `value` )

The abstract operation Await takes argument `value` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) either an [ECMAScript language value](#sec-ecmascript-language-types) or empty, or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `asyncContext` be the [running execution context](#running-execution-context).
2.  Let `promise` be ? [PromiseResolve](#sec-promise-resolve)([%Promise%](#sec-promise-constructor), `value`).
3.  Let `fulfilledClosure` be a new [Abstract Closure](#sec-abstract-closure) with parameters (`v`) that captures `asyncContext` and performs the following steps when called:
    1.  Let `prevContext` be the [running execution context](#running-execution-context).
    2.  Suspend `prevContext`.
    3.  Push `asyncContext` onto the [execution context stack](#execution-context-stack); `asyncContext` is now the [running execution context](#running-execution-context).
    4.  Resume the suspended evaluation of `asyncContext` using [NormalCompletion](#sec-normalcompletion)(`v`) as the result of the operation that suspended it.
    5.  [Assert](#assert): When we reach this step, `asyncContext` has already been removed from the [execution context stack](#execution-context-stack) and `prevContext` is the currently [running execution context](#running-execution-context).
    6.  Return undefined.
4.  Let `onFulfilled` be [CreateBuiltinFunction](#sec-createbuiltinfunction)(`fulfilledClosure`, 1, "", « »).
5.  Let `rejectedClosure` be a new [Abstract Closure](#sec-abstract-closure) with parameters (`reason`) that captures `asyncContext` and performs the following steps when called:
    1.  Let `prevContext` be the [running execution context](#running-execution-context).
    2.  Suspend `prevContext`.
    3.  Push `asyncContext` onto the [execution context stack](#execution-context-stack); `asyncContext` is now the [running execution context](#running-execution-context).
    4.  Resume the suspended evaluation of `asyncContext` using [ThrowCompletion](#sec-throwcompletion)(`reason`) as the result of the operation that suspended it.
    5.  [Assert](#assert): When we reach this step, `asyncContext` has already been removed from the [execution context stack](#execution-context-stack) and `prevContext` is the currently [running execution context](#running-execution-context).
    6.  Return undefined.
6.  Let `onRejected` be [CreateBuiltinFunction](#sec-createbuiltinfunction)(`rejectedClosure`, 1, "", « »).
7.  Perform [PerformPromiseThen](#sec-performpromisethen)(`promise`, `onFulfilled`, `onRejected`).
8.  Remove `asyncContext` from the [execution context stack](#execution-context-stack) and restore the [execution context](#sec-execution-contexts) that is at the top of the [execution context stack](#execution-context-stack) as the [running execution context](#running-execution-context).
9.  Let `callerContext` be the [running execution context](#running-execution-context).
10. Resume `callerContext` passing empty. If `asyncContext` is ever resumed again, let `completion` be the [Completion Record](#sec-completion-record-specification-type) with which it is resumed.
11. [Assert](#assert): If control reaches here, then `asyncContext` is the [running execution context](#running-execution-context) again.
12. Return `completion`.
