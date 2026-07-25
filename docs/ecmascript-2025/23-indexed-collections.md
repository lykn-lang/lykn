# 23 Indexed Collections

## 23.1 Array Objects

Arrays are [exotic objects](#exotic-object) that give special treatment to a certain class of property names. See [10.4.2](#sec-array-exotic-objects) for a definition of this special treatment.

### 23.1.1 The Array Constructor

The Array [constructor](#constructor):

- is %Array%.
- is the initial value of the "Array" property of the [global object](#sec-global-object).
- creates and initializes a new Array when called as a [constructor](#constructor).
- also creates and initializes a new Array when called as a function rather than as a [constructor](#constructor). Thus the function call `Array(…)` is equivalent to the object creation expression `new Array(…)` with the same arguments.
- is a function whose behaviour differs based upon the number and types of its arguments.
- may be used as the value of an `extends` clause of a class definition. Subclass [constructors](#constructor) that intend to inherit the exotic Array behaviour must include a `super` call to the Array [constructor](#constructor) to initialize subclass instances that are [Array exotic objects](#array-exotic-object). However, most of the `Array.prototype` methods are generic methods that are not dependent upon their this value being an [Array exotic object](#array-exotic-object).

#### 23.1.1.1 Array ( ...`values` )

This function performs the following steps when called:

1.  If NewTarget is undefined, let `newTarget` be the [active function object](#active-function-object); else let `newTarget` be NewTarget.
2.  Let `proto` be ? [GetPrototypeFromConstructor](#sec-getprototypefromconstructor)(`newTarget`, "%Array.prototype%").
3.  Let `numberOfArgs` be the number of elements in `values`.
4.  If `numberOfArgs` = 0, then
    1.  Return ! [ArrayCreate](#sec-arraycreate)(0, `proto`).
5.  Else if `numberOfArgs` = 1, then
    1.  Let `len` be `values`\[0\].
    2.  Let `array` be ! [ArrayCreate](#sec-arraycreate)(0, `proto`).
    3.  If `len` [is not a Number](#sec-ecmascript-language-types-number-type), then
        1.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`array`, "0", `len`).
        2.  Let `intLen` be 1_(𝔽).
    4.  Else,
        1.  Let `intLen` be ! [ToUint32](#sec-touint32)(`len`).
        2.  If [SameValueZero](#sec-samevaluezero)(`intLen`, `len`) is false, throw a RangeError exception.
    5.  Perform ! [Set](#sec-set-o-p-v-throw)(`array`, "length", `intLen`, true).
    6.  Return `array`.
6.  Else,
    1.  [Assert](#assert): `numberOfArgs` ≥ 2.
    2.  Let `array` be ? [ArrayCreate](#sec-arraycreate)(`numberOfArgs`, `proto`).
    3.  Let `k` be 0.
    4.  Repeat, while `k` \< `numberOfArgs`,
        1.  Let `Pk` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k`)).
        2.  Let `itemK` be `values`\[`k`\].
        3.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`array`, `Pk`, `itemK`).
        4.  Set `k` to `k` + 1.
    5.  [Assert](#assert): The [mathematical value of](#mathematical-value-of) `array`'s "length" property is `numberOfArgs`.
    6.  Return `array`.

### 23.1.2 Properties of the Array Constructor

The Array [constructor](#constructor):

- has a `[[Prototype]]` internal slot whose value is [%Function.prototype%](#sec-properties-of-the-function-prototype-object).
- has a "length" property whose value is 1_(𝔽).
- has the following properties:

#### 23.1.2.1 Array.from ( `items` \[ , `mapper` \[ , `thisArg` \] \] )

This method performs the following steps when called:

1.  Let `C` be the this value.
2.  If `mapper` is undefined, then
    1.  Let `mapping` be false.
3.  Else,
    1.  If [IsCallable](#sec-iscallable)(`mapper`) is false, throw a TypeError exception.
    2.  Let `mapping` be true.
4.  Let `usingIterator` be ? [GetMethod](#sec-getmethod)(`items`, [%Symbol.iterator%](#sec-well-known-symbols)).
5.  If `usingIterator` is not undefined, then
    1.  If [IsConstructor](#sec-isconstructor)(`C`) is true, then
        1.  Let `A` be ? [Construct](#sec-construct)(`C`).
    2.  Else,
        1.  Let `A` be ! [ArrayCreate](#sec-arraycreate)(0).
    3.  Let `iteratorRecord` be ? [GetIteratorFromMethod](#sec-getiteratorfrommethod)(`items`, `usingIterator`).
    4.  Let `k` be 0.
    5.  Repeat,
        1.  If `k` ≥ 2\*\*⁵³ - 1, then
            1.  Let `error` be [ThrowCompletion](#sec-throwcompletion)(a newly created TypeError object).
            2.  Return ? [IteratorClose](#sec-iteratorclose)(`iteratorRecord`, `error`).
        2.  Let `Pk` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k`)).
        3.  Let `next` be ? [IteratorStepValue](#sec-iteratorstepvalue)(`iteratorRecord`).
        4.  If `next` is done, then
            1.  Perform ? [Set](#sec-set-o-p-v-throw)(`A`, "length", [𝔽](#𝔽)(`k`), true).
            2.  Return `A`.
        5.  If `mapping` is true, then
            1.  Let `mappedValue` be [Completion](#sec-completion-ao)([Call](#sec-call)(`mapper`, `thisArg`, « `next`, [𝔽](#𝔽)(`k`) »)).
            2.  [IfAbruptCloseIterator](#sec-ifabruptcloseiterator)(`mappedValue`, `iteratorRecord`).
        6.  Else,
            1.  Let `mappedValue` be `next`.
        7.  Let `defineStatus` be [Completion](#sec-completion-ao)([CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`A`, `Pk`, `mappedValue`)).
        8.  [IfAbruptCloseIterator](#sec-ifabruptcloseiterator)(`defineStatus`, `iteratorRecord`).
        9.  Set `k` to `k` + 1.
6.  NOTE: `items` is not [iterable](#sec-iterable-interface) so assume it is an [array-like object](#sec-lengthofarraylike).
7.  Let `arrayLike` be ! [ToObject](#sec-toobject)(`items`).
8.  Let `len` be ? [LengthOfArrayLike](#sec-lengthofarraylike)(`arrayLike`).
9.  If [IsConstructor](#sec-isconstructor)(`C`) is true, then
    1.  Let `A` be ? [Construct](#sec-construct)(`C`, « [𝔽](#𝔽)(`len`) »).
10. Else,
    1.  Let `A` be ? [ArrayCreate](#sec-arraycreate)(`len`).
11. Let `k` be 0.
12. Repeat, while `k` \< `len`,
    1.  Let `Pk` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k`)).
    2.  Let `kValue` be ? [Get](#sec-get-o-p)(`arrayLike`, `Pk`).
    3.  If `mapping` is true, then
        1.  Let `mappedValue` be ? [Call](#sec-call)(`mapper`, `thisArg`, « `kValue`, [𝔽](#𝔽)(`k`) »).
    4.  Else,
        1.  Let `mappedValue` be `kValue`.
    5.  Perform ? [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`A`, `Pk`, `mappedValue`).
    6.  Set `k` to `k` + 1.
13. Perform ? [Set](#sec-set-o-p-v-throw)(`A`, "length", [𝔽](#𝔽)(`len`), true).
14. Return `A`.

Note

This method is an intentionally generic factory method; it does not require that its this value be the Array [constructor](#constructor). Therefore it can be transferred to or inherited by any other [constructors](#constructor) that may be called with a single numeric argument.

#### 23.1.2.2 Array.isArray ( `arg` )

This function performs the following steps when called:

1.  Return ? [IsArray](#sec-isarray)(`arg`).

#### 23.1.2.3 Array.of ( ...`items` )

This method performs the following steps when called:

1.  Let `len` be the number of elements in `items`.
2.  Let `lenNumber` be [𝔽](#𝔽)(`len`).
3.  Let `C` be the this value.
4.  If [IsConstructor](#sec-isconstructor)(`C`) is true, then
    1.  Let `A` be ? [Construct](#sec-construct)(`C`, « `lenNumber` »).
5.  Else,
    1.  Let `A` be ? [ArrayCreate](#sec-arraycreate)(`len`).
6.  Let `k` be 0.
7.  Repeat, while `k` \< `len`,
    1.  Let `kValue` be `items`\[`k`\].
    2.  Let `Pk` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k`)).
    3.  Perform ? [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`A`, `Pk`, `kValue`).
    4.  Set `k` to `k` + 1.
8.  Perform ? [Set](#sec-set-o-p-v-throw)(`A`, "length", `lenNumber`, true).
9.  Return `A`.

Note

This method is an intentionally generic factory method; it does not require that its this value be the Array [constructor](#constructor). Therefore it can be transferred to or inherited by other [constructors](#constructor) that may be called with a single numeric argument.

#### 23.1.2.4 Array.prototype

The value of `Array.prototype` is the [Array prototype object](#sec-properties-of-the-array-prototype-object).

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

#### 23.1.2.5 get Array \[ %Symbol.species% \]

`Array[%Symbol.species%]` is an [accessor property](#sec-object-type) whose set accessor function is undefined. Its get accessor function performs the following steps when called:

1.  Return the this value.

The value of the "name" property of this function is "get \[Symbol.species\]".

Note

Array prototype methods normally use their this value's [constructor](#constructor) to create a derived object. However, a subclass [constructor](#constructor) may over-ride that default behaviour by redefining its [%Symbol.species%](#sec-well-known-symbols) property.

### 23.1.3 Properties of the Array Prototype Object

The Array prototype object:

- is %Array.prototype%.
- is an [Array exotic object](#array-exotic-object) and has the internal methods specified for such objects.
- has a "length" property whose initial value is +0_(𝔽) and whose attributes are { `[[Writable]]`: true, `[[Enumerable]]`: false, `[[Configurable]]`: false }.
- has a `[[Prototype]]` internal slot whose value is [%Object.prototype%](#sec-properties-of-the-object-prototype-object).

Note

The Array prototype object is specified to be an [Array exotic object](#array-exotic-object) to ensure compatibility with ECMAScript code that was created prior to the ECMAScript 2015 specification.

#### 23.1.3.1 Array.prototype.at ( `index` )

1.  Let `O` be ? [ToObject](#sec-toobject)(this value).
2.  Let `len` be ? [LengthOfArrayLike](#sec-lengthofarraylike)(`O`).
3.  Let `relativeIndex` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`index`).
4.  If `relativeIndex` ≥ 0, then
    1.  Let `k` be `relativeIndex`.
5.  Else,
    1.  Let `k` be `len` + `relativeIndex`.
6.  If `k` \< 0 or `k` ≥ `len`, return undefined.
7.  Return ? [Get](#sec-get-o-p)(`O`, ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k`))).

#### 23.1.3.2 Array.prototype.concat ( ...`items` )

This method returns an array containing the array elements of the object followed by the array elements of each argument.

It performs the following steps when called:

1.  Let `O` be ? [ToObject](#sec-toobject)(this value).
2.  Let `A` be ? [ArraySpeciesCreate](#sec-arrayspeciescreate)(`O`, 0).
3.  Let `n` be 0.
4.  Prepend `O` to `items`.
5.  For each element `E` of `items`, do
    1.  Let `spreadable` be ? [IsConcatSpreadable](#sec-isconcatspreadable)(`E`).
    2.  If `spreadable` is true, then
        1.  Let `len` be ? [LengthOfArrayLike](#sec-lengthofarraylike)(`E`).
        2.  If `n` + `len` \> 2\*\*⁵³ - 1, throw a TypeError exception.
        3.  Let `k` be 0.
        4.  Repeat, while `k` \< `len`,
            1.  Let `Pk` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k`)).
            2.  Let `exists` be ? [HasProperty](#sec-hasproperty)(`E`, `Pk`).
            3.  If `exists` is true, then
                1.  Let `subElement` be ? [Get](#sec-get-o-p)(`E`, `Pk`).
                2.  Perform ? [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`A`, ! [ToString](#sec-tostring)([𝔽](#𝔽)(`n`)), `subElement`).
            4.  Set `n` to `n` + 1.
            5.  Set `k` to `k` + 1.
    3.  Else,
        1.  NOTE: `E` is added as a single item rather than spread.
        2.  If `n` ≥ 2\*\*⁵³ - 1, throw a TypeError exception.
        3.  Perform ? [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`A`, ! [ToString](#sec-tostring)([𝔽](#𝔽)(`n`)), `E`).
        4.  Set `n` to `n` + 1.
6.  Perform ? [Set](#sec-set-o-p-v-throw)(`A`, "length", [𝔽](#𝔽)(`n`), true).
7.  Return `A`.

The "length" property of this method is 1_(𝔽).

Note 1

The explicit setting of the "length" property in step [6](#step-array-proto-concat-set-length) is intended to ensure the length is correct when the final non-empty element of `items` has trailing holes or when `A` is not a built-in Array.

Note 2

This method is intentionally generic; it does not require that its this value be an Array. Therefore it can be transferred to other kinds of objects for use as a method.

##### 23.1.3.2.1 IsConcatSpreadable ( `O` )

The abstract operation IsConcatSpreadable takes argument `O` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a Boolean or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  If `O` [is not an Object](#sec-object-type), return false.
2.  Let `spreadable` be ? [Get](#sec-get-o-p)(`O`, [%Symbol.isConcatSpreadable%](#sec-well-known-symbols)).
3.  If `spreadable` is not undefined, return [ToBoolean](#sec-toboolean)(`spreadable`).
4.  Return ? [IsArray](#sec-isarray)(`O`).

#### 23.1.3.3 Array.prototype.constructor

The initial value of `Array.prototype.constructor` is [%Array%](#sec-array-constructor).

#### 23.1.3.4 Array.prototype.copyWithin ( `target`, `start` \[ , `end` \] )

Note 1

The `end` argument is optional. If it is not provided, the length of the this value is used.

Note 2

If `target` is negative, it is treated as `length` + `target` where `length` is the length of the array. If `start` is negative, it is treated as `length` + `start`. If `end` is negative, it is treated as `length` + `end`.

This method performs the following steps when called:

1.  Let `O` be ? [ToObject](#sec-toobject)(this value).
2.  Let `len` be ? [LengthOfArrayLike](#sec-lengthofarraylike)(`O`).
3.  Let `relativeTarget` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`target`).
4.  If `relativeTarget` = -∞, let `to` be 0.
5.  Else if `relativeTarget` \< 0, let `to` be [max](#eqn-max)(`len` + `relativeTarget`, 0).
6.  Else, let `to` be [min](#eqn-min)(`relativeTarget`, `len`).
7.  Let `relativeStart` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`start`).
8.  If `relativeStart` = -∞, let `from` be 0.
9.  Else if `relativeStart` \< 0, let `from` be [max](#eqn-max)(`len` + `relativeStart`, 0).
10. Else, let `from` be [min](#eqn-min)(`relativeStart`, `len`).
11. If `end` is undefined, let `relativeEnd` be `len`; else let `relativeEnd` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`end`).
12. If `relativeEnd` = -∞, let `final` be 0.
13. Else if `relativeEnd` \< 0, let `final` be [max](#eqn-max)(`len` + `relativeEnd`, 0).
14. Else, let `final` be [min](#eqn-min)(`relativeEnd`, `len`).
15. Let `count` be [min](#eqn-min)(`final` - `from`, `len` - `to`).
16. If `from` \< `to` and `to` \< `from` + `count`, then
    1.  Let `direction` be -1.
    2.  Set `from` to `from` + `count` - 1.
    3.  Set `to` to `to` + `count` - 1.
17. Else,
    1.  Let `direction` be 1.
18. Repeat, while `count` \> 0,
    1.  Let `fromKey` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`from`)).
    2.  Let `toKey` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`to`)).
    3.  Let `fromPresent` be ? [HasProperty](#sec-hasproperty)(`O`, `fromKey`).
    4.  If `fromPresent` is true, then
        1.  Let `fromValue` be ? [Get](#sec-get-o-p)(`O`, `fromKey`).
        2.  Perform ? [Set](#sec-set-o-p-v-throw)(`O`, `toKey`, `fromValue`, true).
    5.  Else,
        1.  [Assert](#assert): `fromPresent` is false.
        2.  Perform ? [DeletePropertyOrThrow](#sec-deletepropertyorthrow)(`O`, `toKey`).
    6.  Set `from` to `from` + `direction`.
    7.  Set `to` to `to` + `direction`.
    8.  Set `count` to `count` - 1.
19. Return `O`.

Note 3

This method is intentionally generic; it does not require that its this value be an Array. Therefore it can be transferred to other kinds of objects for use as a method.

#### 23.1.3.5 Array.prototype.entries ( )

This method performs the following steps when called:

1.  Let `O` be ? [ToObject](#sec-toobject)(this value).
2.  Return [CreateArrayIterator](#sec-createarrayiterator)(`O`, key+value).

#### 23.1.3.6 Array.prototype.every ( `callback` \[ , `thisArg` \] )

Note 1

`callback` should be a function that accepts three arguments and returns a value that is coercible to a Boolean value. `every` calls `callback` once for each element present in the array, in ascending order, until it finds one where `callback` returns false. If such an element is found, `every` immediately returns false. Otherwise, `every` returns true. `callback` is called only for elements of the array which actually exist; it is not called for missing elements of the array.

If a `thisArg` parameter is provided, it will be used as the this value for each invocation of `callback`. If it is not provided, undefined is used instead.

`callback` is called with three arguments: the value of the element, the index of the element, and the object being traversed.

`every` does not directly mutate the object on which it is called but the object may be mutated by the calls to `callback`.

The range of elements processed by `every` is set before the first call to `callback`. Elements which are appended to the array after the call to `every` begins will not be visited by `callback`. If existing elements of the array are changed, their value as passed to `callback` will be the value at the time `every` visits them; elements that are deleted after the call to `every` begins and before being visited are not visited. `every` acts like the "for all" quantifier in mathematics. In particular, for an empty array, it returns true.

This method performs the following steps when called:

1.  Let `O` be ? [ToObject](#sec-toobject)(this value).
2.  Let `len` be ? [LengthOfArrayLike](#sec-lengthofarraylike)(`O`).
3.  If [IsCallable](#sec-iscallable)(`callback`) is false, throw a TypeError exception.
4.  Let `k` be 0.
5.  Repeat, while `k` \< `len`,
    1.  Let `Pk` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k`)).
    2.  Let `kPresent` be ? [HasProperty](#sec-hasproperty)(`O`, `Pk`).
    3.  If `kPresent` is true, then
        1.  Let `kValue` be ? [Get](#sec-get-o-p)(`O`, `Pk`).
        2.  Let `testResult` be [ToBoolean](#sec-toboolean)(? [Call](#sec-call)(`callback`, `thisArg`, « `kValue`, [𝔽](#𝔽)(`k`), `O` »)).
        3.  If `testResult` is false, return false.
    4.  Set `k` to `k` + 1.
6.  Return true.

Note 2

This method is intentionally generic; it does not require that its this value be an Array. Therefore it can be transferred to other kinds of objects for use as a method.

#### 23.1.3.7 Array.prototype.fill ( `value` \[ , `start` \[ , `end` \] \] )

Note 1

The `start` argument is optional. If it is not provided, +0_(𝔽) is used.

The `end` argument is optional. If it is not provided, the length of the this value is used.

Note 2

If `start` is negative, it is treated as `length` + `start` where `length` is the length of the array. If `end` is negative, it is treated as `length` + `end`.

This method performs the following steps when called:

1.  Let `O` be ? [ToObject](#sec-toobject)(this value).
2.  Let `len` be ? [LengthOfArrayLike](#sec-lengthofarraylike)(`O`).
3.  Let `relativeStart` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`start`).
4.  If `relativeStart` = -∞, let `k` be 0.
5.  Else if `relativeStart` \< 0, let `k` be [max](#eqn-max)(`len` + `relativeStart`, 0).
6.  Else, let `k` be [min](#eqn-min)(`relativeStart`, `len`).
7.  If `end` is undefined, let `relativeEnd` be `len`; else let `relativeEnd` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`end`).
8.  If `relativeEnd` = -∞, let `final` be 0.
9.  Else if `relativeEnd` \< 0, let `final` be [max](#eqn-max)(`len` + `relativeEnd`, 0).
10. Else, let `final` be [min](#eqn-min)(`relativeEnd`, `len`).
11. Repeat, while `k` \< `final`,
    1.  Let `Pk` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k`)).
    2.  Perform ? [Set](#sec-set-o-p-v-throw)(`O`, `Pk`, `value`, true).
    3.  Set `k` to `k` + 1.
12. Return `O`.

Note 3

This method is intentionally generic; it does not require that its this value be an Array. Therefore it can be transferred to other kinds of objects for use as a method.

#### 23.1.3.8 Array.prototype.filter ( `callback` \[ , `thisArg` \] )

Note 1

`callback` should be a function that accepts three arguments and returns a value that is coercible to a Boolean value. `filter` calls `callback` once for each element in the array, in ascending order, and constructs a new array of all the values for which `callback` returns true. `callback` is called only for elements of the array which actually exist; it is not called for missing elements of the array.

If a `thisArg` parameter is provided, it will be used as the this value for each invocation of `callback`. If it is not provided, undefined is used instead.

`callback` is called with three arguments: the value of the element, the index of the element, and the object being traversed.

`filter` does not directly mutate the object on which it is called but the object may be mutated by the calls to `callback`.

The range of elements processed by `filter` is set before the first call to `callback`. Elements which are appended to the array after the call to `filter` begins will not be visited by `callback`. If existing elements of the array are changed their value as passed to `callback` will be the value at the time `filter` visits them; elements that are deleted after the call to `filter` begins and before being visited are not visited.

This method performs the following steps when called:

1.  Let `O` be ? [ToObject](#sec-toobject)(this value).
2.  Let `len` be ? [LengthOfArrayLike](#sec-lengthofarraylike)(`O`).
3.  If [IsCallable](#sec-iscallable)(`callback`) is false, throw a TypeError exception.
4.  Let `A` be ? [ArraySpeciesCreate](#sec-arrayspeciescreate)(`O`, 0).
5.  Let `k` be 0.
6.  Let `to` be 0.
7.  Repeat, while `k` \< `len`,
    1.  Let `Pk` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k`)).
    2.  Let `kPresent` be ? [HasProperty](#sec-hasproperty)(`O`, `Pk`).
    3.  If `kPresent` is true, then
        1.  Let `kValue` be ? [Get](#sec-get-o-p)(`O`, `Pk`).
        2.  Let `selected` be [ToBoolean](#sec-toboolean)(? [Call](#sec-call)(`callback`, `thisArg`, « `kValue`, [𝔽](#𝔽)(`k`), `O` »)).
        3.  If `selected` is true, then
            1.  Perform ? [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`A`, ! [ToString](#sec-tostring)([𝔽](#𝔽)(`to`)), `kValue`).
            2.  Set `to` to `to` + 1.
    4.  Set `k` to `k` + 1.
8.  Return `A`.

Note 2

This method is intentionally generic; it does not require that its this value be an Array. Therefore it can be transferred to other kinds of objects for use as a method.

#### 23.1.3.9 Array.prototype.find ( `predicate` \[ , `thisArg` \] )

Note 1

This method calls `predicate` once for each element of the array, in ascending index order, until it finds one where `predicate` returns a value that coerces to true. If such an element is found, `find` immediately returns that element value. Otherwise, `find` returns undefined.

See [FindViaPredicate](#sec-findviapredicate) for additional information.

This method performs the following steps when called:

1.  Let `O` be ? [ToObject](#sec-toobject)(this value).
2.  Let `len` be ? [LengthOfArrayLike](#sec-lengthofarraylike)(`O`).
3.  Let `findRec` be ? [FindViaPredicate](#sec-findviapredicate)(`O`, `len`, ascending, `predicate`, `thisArg`).
4.  Return `findRec`.`[[Value]]`.

Note 2

This method is intentionally generic; it does not require that its this value be an Array. Therefore it can be transferred to other kinds of objects for use as a method.

#### 23.1.3.10 Array.prototype.findIndex ( `predicate` \[ , `thisArg` \] )

Note 1

This method calls `predicate` once for each element of the array, in ascending index order, until it finds one where `predicate` returns a value that coerces to true. If such an element is found, `findIndex` immediately returns the index of that element value. Otherwise, `findIndex` returns -1.

See [FindViaPredicate](#sec-findviapredicate) for additional information.

This method performs the following steps when called:

1.  Let `O` be ? [ToObject](#sec-toobject)(this value).
2.  Let `len` be ? [LengthOfArrayLike](#sec-lengthofarraylike)(`O`).
3.  Let `findRec` be ? [FindViaPredicate](#sec-findviapredicate)(`O`, `len`, ascending, `predicate`, `thisArg`).
4.  Return `findRec`.`[[Index]]`.

Note 2

This method is intentionally generic; it does not require that its this value be an Array. Therefore it can be transferred to other kinds of objects for use as a method.

#### 23.1.3.11 Array.prototype.findLast ( `predicate` \[ , `thisArg` \] )

Note 1

This method calls `predicate` once for each element of the array, in descending index order, until it finds one where `predicate` returns a value that coerces to true. If such an element is found, `findLast` immediately returns that element value. Otherwise, `findLast` returns undefined.

See [FindViaPredicate](#sec-findviapredicate) for additional information.

This method performs the following steps when called:

1.  Let `O` be ? [ToObject](#sec-toobject)(this value).
2.  Let `len` be ? [LengthOfArrayLike](#sec-lengthofarraylike)(`O`).
3.  Let `findRec` be ? [FindViaPredicate](#sec-findviapredicate)(`O`, `len`, descending, `predicate`, `thisArg`).
4.  Return `findRec`.`[[Value]]`.

Note 2

This method is intentionally generic; it does not require that its this value be an Array object. Therefore it can be transferred to other kinds of objects for use as a method.

#### 23.1.3.12 Array.prototype.findLastIndex ( `predicate` \[ , `thisArg` \] )

Note 1

This method calls `predicate` once for each element of the array, in descending index order, until it finds one where `predicate` returns a value that coerces to true. If such an element is found, `findLastIndex` immediately returns the index of that element value. Otherwise, `findLastIndex` returns -1.

See [FindViaPredicate](#sec-findviapredicate) for additional information.

This method performs the following steps when called:

1.  Let `O` be ? [ToObject](#sec-toobject)(this value).
2.  Let `len` be ? [LengthOfArrayLike](#sec-lengthofarraylike)(`O`).
3.  Let `findRec` be ? [FindViaPredicate](#sec-findviapredicate)(`O`, `len`, descending, `predicate`, `thisArg`).
4.  Return `findRec`.`[[Index]]`.

Note 2

This method is intentionally generic; it does not require that its this value be an Array object. Therefore it can be transferred to other kinds of objects for use as a method.

##### 23.1.3.12.1 FindViaPredicate ( `O`, `len`, `direction`, `predicate`, `thisArg` )

The abstract operation FindViaPredicate takes arguments `O` (an Object), `len` (a non-negative [integer](#integer)), `direction` (ascending or descending), `predicate` (an [ECMAScript language value](#sec-ecmascript-language-types)), and `thisArg` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a [Record](#sec-list-and-record-specification-type) with fields `[[Index]]` (an [integral Number](#integral-number)) and `[[Value]]` (an [ECMAScript language value](#sec-ecmascript-language-types)) or a [throw completion](#sec-completion-record-specification-type).

`O` should be an [array-like object](#sec-lengthofarraylike) or a [TypedArray](#typedarray). This operation calls `predicate` once for each element of `O`, in either ascending index order or descending index order (as indicated by `direction`), until it finds one where `predicate` returns a value that coerces to true. At that point, this operation returns a [Record](#sec-list-and-record-specification-type) that gives the index and value of the element found. If no such element is found, this operation returns a [Record](#sec-list-and-record-specification-type) that specifies -1_(𝔽) for the index and undefined for the value.

`predicate` should be a function. When called for an element of the array, it is passed three arguments: the value of the element, the index of the element, and the object being traversed. Its return value will be coerced to a Boolean value.

`thisArg` will be used as the this value for each invocation of `predicate`.

This operation does not directly mutate the object on which it is called, but the object may be mutated by the calls to `predicate`.

The range of elements processed is set before the first call to `predicate`, just before the traversal begins. Elements that are appended to the array after this will not be visited by `predicate`. If existing elements of the array are changed, their value as passed to `predicate` will be the value at the time that this operation visits them. Elements that are deleted after traversal begins and before being visited are still visited and are either looked up from the prototype or are undefined.

It performs the following steps when called:

1.  If [IsCallable](#sec-iscallable)(`predicate`) is false, throw a TypeError exception.
2.  If `direction` is ascending, then
    1.  Let `indices` be a [List](#sec-list-and-record-specification-type) of the [integers](#integer) in the [interval](#interval) from 0 (inclusive) to `len` (exclusive), in ascending order.
3.  Else,
    1.  Let `indices` be a [List](#sec-list-and-record-specification-type) of the [integers](#integer) in the [interval](#interval) from 0 (inclusive) to `len` (exclusive), in descending order.
4.  For each [integer](#integer) `k` of `indices`, do
    1.  Let `Pk` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k`)).
    2.  NOTE: If `O` is a [TypedArray](#typedarray), the following invocation of [Get](#sec-get-o-p) will return a [normal completion](#sec-completion-record-specification-type).
    3.  Let `kValue` be ? [Get](#sec-get-o-p)(`O`, `Pk`).
    4.  Let `testResult` be ? [Call](#sec-call)(`predicate`, `thisArg`, « `kValue`, [𝔽](#𝔽)(`k`), `O` »).
    5.  If [ToBoolean](#sec-toboolean)(`testResult`) is true, return the [Record](#sec-list-and-record-specification-type) { `[[Index]]`: [𝔽](#𝔽)(`k`), `[[Value]]`: `kValue` }.
5.  Return the [Record](#sec-list-and-record-specification-type) { `[[Index]]`: -1_(𝔽), `[[Value]]`: undefined }.

#### 23.1.3.13 Array.prototype.flat ( \[ `depth` \] )

This method performs the following steps when called:

1.  Let `O` be ? [ToObject](#sec-toobject)(this value).
2.  Let `sourceLen` be ? [LengthOfArrayLike](#sec-lengthofarraylike)(`O`).
3.  Let `depthNum` be 1.
4.  If `depth` is not undefined, then
    1.  Set `depthNum` to ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`depth`).
    2.  If `depthNum` \< 0, set `depthNum` to 0.
5.  Let `A` be ? [ArraySpeciesCreate](#sec-arrayspeciescreate)(`O`, 0).
6.  Perform ? [FlattenIntoArray](#sec-flattenintoarray)(`A`, `O`, `sourceLen`, 0, `depthNum`).
7.  Return `A`.

##### 23.1.3.13.1 FlattenIntoArray ( `target`, `source`, `sourceLen`, `start`, `depth` \[ , `mapperFunction` \[ , `thisArg` \] \] )

The abstract operation FlattenIntoArray takes arguments `target` (an Object), `source` (an Object), `sourceLen` (a non-negative [integer](#integer)), `start` (a non-negative [integer](#integer)), and `depth` (a non-negative [integer](#integer) or +∞) and optional arguments `mapperFunction` (a [function object](#function-object)) and `thisArg` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a non-negative [integer](#integer) or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  [Assert](#assert): If `mapperFunction` is present, then [IsCallable](#sec-iscallable)(`mapperFunction`) is true, `thisArg` is present, and `depth` is 1.
2.  Let `targetIndex` be `start`.
3.  Let `sourceIndex` be +0_(𝔽).
4.  Repeat, while [ℝ](#ℝ)(`sourceIndex`) \< `sourceLen`,
    1.  Let `P` be ! [ToString](#sec-tostring)(`sourceIndex`).
    2.  Let `exists` be ? [HasProperty](#sec-hasproperty)(`source`, `P`).
    3.  If `exists` is true, then
        1.  Let `element` be ? [Get](#sec-get-o-p)(`source`, `P`).
        2.  If `mapperFunction` is present, then
            1.  Set `element` to ? [Call](#sec-call)(`mapperFunction`, `thisArg`, « `element`, `sourceIndex`, `source` »).
        3.  Let `shouldFlatten` be false.
        4.  If `depth` \> 0, then
            1.  Set `shouldFlatten` to ? [IsArray](#sec-isarray)(`element`).
        5.  If `shouldFlatten` is true, then
            1.  If `depth` = +∞, let `newDepth` be +∞.
            2.  Else, let `newDepth` be `depth` - 1.
            3.  Let `elementLen` be ? [LengthOfArrayLike](#sec-lengthofarraylike)(`element`).
            4.  Set `targetIndex` to ? [FlattenIntoArray](#sec-flattenintoarray)(`target`, `element`, `elementLen`, `targetIndex`, `newDepth`).
        6.  Else,
            1.  If `targetIndex` ≥ 2\*\*⁵³ - 1, throw a TypeError exception.
            2.  Perform ? [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`target`, ! [ToString](#sec-tostring)([𝔽](#𝔽)(`targetIndex`)), `element`).
            3.  Set `targetIndex` to `targetIndex` + 1.
    4.  Set `sourceIndex` to `sourceIndex` + 1_(𝔽).
5.  Return `targetIndex`.

#### 23.1.3.14 Array.prototype.flatMap ( `mapperFunction` \[ , `thisArg` \] )

This method performs the following steps when called:

1.  Let `O` be ? [ToObject](#sec-toobject)(this value).
2.  Let `sourceLen` be ? [LengthOfArrayLike](#sec-lengthofarraylike)(`O`).
3.  If [IsCallable](#sec-iscallable)(`mapperFunction`) is false, throw a TypeError exception.
4.  Let `A` be ? [ArraySpeciesCreate](#sec-arrayspeciescreate)(`O`, 0).
5.  Perform ? [FlattenIntoArray](#sec-flattenintoarray)(`A`, `O`, `sourceLen`, 0, 1, `mapperFunction`, `thisArg`).
6.  Return `A`.

#### 23.1.3.15 Array.prototype.forEach ( `callback` \[ , `thisArg` \] )

Note 1

`callback` should be a function that accepts three arguments. `forEach` calls `callback` once for each element present in the array, in ascending order. `callback` is called only for elements of the array which actually exist; it is not called for missing elements of the array.

If a `thisArg` parameter is provided, it will be used as the this value for each invocation of `callback`. If it is not provided, undefined is used instead.

`callback` is called with three arguments: the value of the element, the index of the element, and the object being traversed.

`forEach` does not directly mutate the object on which it is called but the object may be mutated by the calls to `callback`.

The range of elements processed by `forEach` is set before the first call to `callback`. Elements which are appended to the array after the call to `forEach` begins will not be visited by `callback`. If existing elements of the array are changed, their value as passed to `callback` will be the value at the time `forEach` visits them; elements that are deleted after the call to `forEach` begins and before being visited are not visited.

This method performs the following steps when called:

1.  Let `O` be ? [ToObject](#sec-toobject)(this value).
2.  Let `len` be ? [LengthOfArrayLike](#sec-lengthofarraylike)(`O`).
3.  If [IsCallable](#sec-iscallable)(`callback`) is false, throw a TypeError exception.
4.  Let `k` be 0.
5.  Repeat, while `k` \< `len`,
    1.  Let `Pk` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k`)).
    2.  Let `kPresent` be ? [HasProperty](#sec-hasproperty)(`O`, `Pk`).
    3.  If `kPresent` is true, then
        1.  Let `kValue` be ? [Get](#sec-get-o-p)(`O`, `Pk`).
        2.  Perform ? [Call](#sec-call)(`callback`, `thisArg`, « `kValue`, [𝔽](#𝔽)(`k`), `O` »).
    4.  Set `k` to `k` + 1.
6.  Return undefined.

Note 2

This method is intentionally generic; it does not require that its this value be an Array. Therefore it can be transferred to other kinds of objects for use as a method.

#### 23.1.3.16 Array.prototype.includes ( `searchElement` \[ , `fromIndex` \] )

Note 1

This method compares `searchElement` to the elements of the array, in ascending order, using the [SameValueZero](#sec-samevaluezero) algorithm, and if found at any position, returns true; otherwise, it returns false.

The optional second argument `fromIndex` defaults to +0_(𝔽) (i.e. the whole array is searched). If it is greater than or equal to the length of the array, false is returned, i.e. the array will not be searched. If it is less than -0_(𝔽), it is used as the offset from the end of the array to compute `fromIndex`. If the computed index is less than or equal to +0_(𝔽), the whole array will be searched.

This method performs the following steps when called:

1.  Let `O` be ? [ToObject](#sec-toobject)(this value).
2.  Let `len` be ? [LengthOfArrayLike](#sec-lengthofarraylike)(`O`).
3.  If `len` = 0, return false.
4.  Let `n` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`fromIndex`).
5.  [Assert](#assert): If `fromIndex` is undefined, then `n` is 0.
6.  If `n` = +∞, return false.
7.  Else if `n` = -∞, set `n` to 0.
8.  If `n` ≥ 0, then
    1.  Let `k` be `n`.
9.  Else,
    1.  Let `k` be `len` + `n`.
    2.  If `k` \< 0, set `k` to 0.
10. Repeat, while `k` \< `len`,
    1.  Let `elementK` be ? [Get](#sec-get-o-p)(`O`, ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k`))).
    2.  If [SameValueZero](#sec-samevaluezero)(`searchElement`, `elementK`) is true, return true.
    3.  Set `k` to `k` + 1.
11. Return false.

Note 2

This method is intentionally generic; it does not require that its this value be an Array. Therefore it can be transferred to other kinds of objects for use as a method.

Note 3

This method intentionally differs from the similar `indexOf` method in two ways. First, it uses the [SameValueZero](#sec-samevaluezero) algorithm, instead of [IsStrictlyEqual](#sec-isstrictlyequal), allowing it to detect NaN array elements. Second, it does not skip missing array elements, instead treating them as undefined.

#### 23.1.3.17 Array.prototype.indexOf ( `searchElement` \[ , `fromIndex` \] )

This method compares `searchElement` to the elements of the array, in ascending order, using the [IsStrictlyEqual](#sec-isstrictlyequal) algorithm, and if found at one or more indices, returns the smallest such index; otherwise, it returns -1_(𝔽).

Note 1

The optional second argument `fromIndex` defaults to +0_(𝔽) (i.e. the whole array is searched). If it is greater than or equal to the length of the array, -1_(𝔽) is returned, i.e. the array will not be searched. If it is less than -0_(𝔽), it is used as the offset from the end of the array to compute `fromIndex`. If the computed index is less than or equal to +0_(𝔽), the whole array will be searched.

This method performs the following steps when called:

1.  Let `O` be ? [ToObject](#sec-toobject)(this value).
2.  Let `len` be ? [LengthOfArrayLike](#sec-lengthofarraylike)(`O`).
3.  If `len` = 0, return -1_(𝔽).
4.  Let `n` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`fromIndex`).
5.  [Assert](#assert): If `fromIndex` is undefined, then `n` is 0.
6.  If `n` = +∞, return -1_(𝔽).
7.  Else if `n` = -∞, set `n` to 0.
8.  If `n` ≥ 0, then
    1.  Let `k` be `n`.
9.  Else,
    1.  Let `k` be `len` + `n`.
    2.  If `k` \< 0, set `k` to 0.
10. Repeat, while `k` \< `len`,
    1.  Let `Pk` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k`)).
    2.  Let `kPresent` be ? [HasProperty](#sec-hasproperty)(`O`, `Pk`).
    3.  If `kPresent` is true, then
        1.  Let `elementK` be ? [Get](#sec-get-o-p)(`O`, `Pk`).
        2.  If [IsStrictlyEqual](#sec-isstrictlyequal)(`searchElement`, `elementK`) is true, return [𝔽](#𝔽)(`k`).
    4.  Set `k` to `k` + 1.
11. Return -1_(𝔽).

Note 2

This method is intentionally generic; it does not require that its this value be an Array. Therefore it can be transferred to other kinds of objects for use as a method.

#### 23.1.3.18 Array.prototype.join ( `separator` )

This method converts the elements of the array to Strings, and then concatenates these Strings, separated by occurrences of the `separator`. If no separator is provided, a single comma is used as the separator.

It performs the following steps when called:

1.  Let `O` be ? [ToObject](#sec-toobject)(this value).
2.  Let `len` be ? [LengthOfArrayLike](#sec-lengthofarraylike)(`O`).
3.  If `separator` is undefined, let `sep` be ",".
4.  Else, let `sep` be ? [ToString](#sec-tostring)(`separator`).
5.  Let `R` be the empty String.
6.  Let `k` be 0.
7.  Repeat, while `k` \< `len`,
    1.  If `k` \> 0, set `R` to the [string-concatenation](#string-concatenation) of `R` and `sep`.
    2.  Let `element` be ? [Get](#sec-get-o-p)(`O`, ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k`))).
    3.  If `element` is neither undefined nor null, then
        1.  Let `S` be ? [ToString](#sec-tostring)(`element`).
        2.  Set `R` to the [string-concatenation](#string-concatenation) of `R` and `S`.
    4.  Set `k` to `k` + 1.
8.  Return `R`.

Note

This method is intentionally generic; it does not require that its this value be an Array. Therefore, it can be transferred to other kinds of objects for use as a method.

#### 23.1.3.19 Array.prototype.keys ( )

This method performs the following steps when called:

1.  Let `O` be ? [ToObject](#sec-toobject)(this value).
2.  Return [CreateArrayIterator](#sec-createarrayiterator)(`O`, key).

#### 23.1.3.20 Array.prototype.lastIndexOf ( `searchElement` \[ , `fromIndex` \] )

Note 1

This method compares `searchElement` to the elements of the array in descending order using the [IsStrictlyEqual](#sec-isstrictlyequal) algorithm, and if found at one or more indices, returns the largest such index; otherwise, it returns -1_(𝔽).

The optional second argument `fromIndex` defaults to the array's length minus one (i.e. the whole array is searched). If it is greater than or equal to the length of the array, the whole array will be searched. If it is less than -0_(𝔽), it is used as the offset from the end of the array to compute `fromIndex`. If the computed index is less than or equal to +0_(𝔽), -1_(𝔽) is returned.

This method performs the following steps when called:

1.  Let `O` be ? [ToObject](#sec-toobject)(this value).
2.  Let `len` be ? [LengthOfArrayLike](#sec-lengthofarraylike)(`O`).
3.  If `len` = 0, return -1_(𝔽).
4.  If `fromIndex` is present, let `n` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`fromIndex`); else let `n` be `len` - 1.
5.  If `n` = -∞, return -1_(𝔽).
6.  If `n` ≥ 0, then
    1.  Let `k` be [min](#eqn-min)(`n`, `len` - 1).
7.  Else,
    1.  Let `k` be `len` + `n`.
8.  Repeat, while `k` ≥ 0,
    1.  Let `Pk` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k`)).
    2.  Let `kPresent` be ? [HasProperty](#sec-hasproperty)(`O`, `Pk`).
    3.  If `kPresent` is true, then
        1.  Let `elementK` be ? [Get](#sec-get-o-p)(`O`, `Pk`).
        2.  If [IsStrictlyEqual](#sec-isstrictlyequal)(`searchElement`, `elementK`) is true, return [𝔽](#𝔽)(`k`).
    4.  Set `k` to `k` - 1.
9.  Return -1_(𝔽).

Note 2

This method is intentionally generic; it does not require that its this value be an Array. Therefore it can be transferred to other kinds of objects for use as a method.

#### 23.1.3.21 Array.prototype.map ( `callback` \[ , `thisArg` \] )

Note 1

`callback` should be a function that accepts three arguments. `map` calls `callback` once for each element in the array, in ascending order, and constructs a new Array from the results. `callback` is called only for elements of the array which actually exist; it is not called for missing elements of the array.

If a `thisArg` parameter is provided, it will be used as the this value for each invocation of `callback`. If it is not provided, undefined is used instead.

`callback` is called with three arguments: the value of the element, the index of the element, and the object being traversed.

`map` does not directly mutate the object on which it is called but the object may be mutated by the calls to `callback`.

The range of elements processed by `map` is set before the first call to `callback`. Elements which are appended to the array after the call to `map` begins will not be visited by `callback`. If existing elements of the array are changed, their value as passed to `callback` will be the value at the time `map` visits them; elements that are deleted after the call to `map` begins and before being visited are not visited.

This method performs the following steps when called:

1.  Let `O` be ? [ToObject](#sec-toobject)(this value).
2.  Let `len` be ? [LengthOfArrayLike](#sec-lengthofarraylike)(`O`).
3.  If [IsCallable](#sec-iscallable)(`callback`) is false, throw a TypeError exception.
4.  Let `A` be ? [ArraySpeciesCreate](#sec-arrayspeciescreate)(`O`, `len`).
5.  Let `k` be 0.
6.  Repeat, while `k` \< `len`,
    1.  Let `Pk` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k`)).
    2.  Let `kPresent` be ? [HasProperty](#sec-hasproperty)(`O`, `Pk`).
    3.  If `kPresent` is true, then
        1.  Let `kValue` be ? [Get](#sec-get-o-p)(`O`, `Pk`).
        2.  Let `mappedValue` be ? [Call](#sec-call)(`callback`, `thisArg`, « `kValue`, [𝔽](#𝔽)(`k`), `O` »).
        3.  Perform ? [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`A`, `Pk`, `mappedValue`).
    4.  Set `k` to `k` + 1.
7.  Return `A`.

Note 2

This method is intentionally generic; it does not require that its this value be an Array. Therefore it can be transferred to other kinds of objects for use as a method.

#### 23.1.3.22 Array.prototype.pop ( )

Note 1

This method removes the last element of the array and returns it.

This method performs the following steps when called:

1.  Let `O` be ? [ToObject](#sec-toobject)(this value).
2.  Let `len` be ? [LengthOfArrayLike](#sec-lengthofarraylike)(`O`).
3.  If `len` = 0, then
    1.  Perform ? [Set](#sec-set-o-p-v-throw)(`O`, "length", +0_(𝔽), true).
    2.  Return undefined.
4.  Else,
    1.  [Assert](#assert): `len` \> 0.
    2.  Let `newLen` be [𝔽](#𝔽)(`len` - 1).
    3.  Let `index` be ! [ToString](#sec-tostring)(`newLen`).
    4.  Let `element` be ? [Get](#sec-get-o-p)(`O`, `index`).
    5.  Perform ? [DeletePropertyOrThrow](#sec-deletepropertyorthrow)(`O`, `index`).
    6.  Perform ? [Set](#sec-set-o-p-v-throw)(`O`, "length", `newLen`, true).
    7.  Return `element`.

Note 2

This method is intentionally generic; it does not require that its this value be an Array. Therefore it can be transferred to other kinds of objects for use as a method.

#### 23.1.3.23 Array.prototype.push ( ...`items` )

Note 1

This method appends the arguments to the end of the array, in the order in which they appear. It returns the new length of the array.

This method performs the following steps when called:

1.  Let `O` be ? [ToObject](#sec-toobject)(this value).
2.  Let `len` be ? [LengthOfArrayLike](#sec-lengthofarraylike)(`O`).
3.  Let `argCount` be the number of elements in `items`.
4.  If `len` + `argCount` \> 2\*\*⁵³ - 1, throw a TypeError exception.
5.  For each element `E` of `items`, do
    1.  Perform ? [Set](#sec-set-o-p-v-throw)(`O`, ! [ToString](#sec-tostring)([𝔽](#𝔽)(`len`)), `E`, true).
    2.  Set `len` to `len` + 1.
6.  Perform ? [Set](#sec-set-o-p-v-throw)(`O`, "length", [𝔽](#𝔽)(`len`), true).
7.  Return [𝔽](#𝔽)(`len`).

The "length" property of this method is 1_(𝔽).

Note 2

This method is intentionally generic; it does not require that its this value be an Array. Therefore it can be transferred to other kinds of objects for use as a method.

#### 23.1.3.24 Array.prototype.reduce ( `callback` \[ , `initialValue` \] )

Note 1

`callback` should be a function that takes four arguments. `reduce` calls the callback, as a function, once for each element after the first element present in the array, in ascending order.

`callback` is called with four arguments: the `previousValue` (value from the previous call to `callback`), the `currentValue` (value of the current element), the `currentIndex`, and the object being traversed. The first time that callback is called, the `previousValue` and `currentValue` can be one of two values. If an `initialValue` was supplied in the call to `reduce`, then `previousValue` will be `initialValue` and `currentValue` will be the first value in the array. If no `initialValue` was supplied, then `previousValue` will be the first value in the array and `currentValue` will be the second. It is a TypeError if the array contains no elements and `initialValue` is not provided.

`reduce` does not directly mutate the object on which it is called but the object may be mutated by the calls to `callback`.

The range of elements processed by `reduce` is set before the first call to `callback`. Elements that are appended to the array after the call to `reduce` begins will not be visited by `callback`. If existing elements of the array are changed, their value as passed to `callback` will be the value at the time `reduce` visits them; elements that are deleted after the call to `reduce` begins and before being visited are not visited.

This method performs the following steps when called:

1.  Let `O` be ? [ToObject](#sec-toobject)(this value).
2.  Let `len` be ? [LengthOfArrayLike](#sec-lengthofarraylike)(`O`).
3.  If [IsCallable](#sec-iscallable)(`callback`) is false, throw a TypeError exception.
4.  If `len` = 0 and `initialValue` is not present, throw a TypeError exception.
5.  Let `k` be 0.
6.  Let `accumulator` be undefined.
7.  If `initialValue` is present, then
    1.  Set `accumulator` to `initialValue`.
8.  Else,
    1.  Let `kPresent` be false.
    2.  Repeat, while `kPresent` is false and `k` \< `len`,
        1.  Let `Pk` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k`)).
        2.  Set `kPresent` to ? [HasProperty](#sec-hasproperty)(`O`, `Pk`).
        3.  If `kPresent` is true, then
            1.  Set `accumulator` to ? [Get](#sec-get-o-p)(`O`, `Pk`).
        4.  Set `k` to `k` + 1.
    3.  If `kPresent` is false, throw a TypeError exception.
9.  Repeat, while `k` \< `len`,
    1.  Let `Pk` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k`)).
    2.  Let `kPresent` be ? [HasProperty](#sec-hasproperty)(`O`, `Pk`).
    3.  If `kPresent` is true, then
        1.  Let `kValue` be ? [Get](#sec-get-o-p)(`O`, `Pk`).
        2.  Set `accumulator` to ? [Call](#sec-call)(`callback`, undefined, « `accumulator`, `kValue`, [𝔽](#𝔽)(`k`), `O` »).
    4.  Set `k` to `k` + 1.
10. Return `accumulator`.

Note 2

This method is intentionally generic; it does not require that its this value be an Array. Therefore it can be transferred to other kinds of objects for use as a method.

#### 23.1.3.25 Array.prototype.reduceRight ( `callback` \[ , `initialValue` \] )

Note 1

`callback` should be a function that takes four arguments. `reduceRight` calls the callback, as a function, once for each element after the first element present in the array, in descending order.

`callback` is called with four arguments: the `previousValue` (value from the previous call to `callback`), the `currentValue` (value of the current element), the `currentIndex`, and the object being traversed. The first time the function is called, the `previousValue` and `currentValue` can be one of two values. If an `initialValue` was supplied in the call to `reduceRight`, then `previousValue` will be `initialValue` and `currentValue` will be the last value in the array. If no `initialValue` was supplied, then `previousValue` will be the last value in the array and `currentValue` will be the second-to-last value. It is a TypeError if the array contains no elements and `initialValue` is not provided.

`reduceRight` does not directly mutate the object on which it is called but the object may be mutated by the calls to `callback`.

The range of elements processed by `reduceRight` is set before the first call to `callback`. Elements that are appended to the array after the call to `reduceRight` begins will not be visited by `callback`. If existing elements of the array are changed by `callback`, their value as passed to `callback` will be the value at the time `reduceRight` visits them; elements that are deleted after the call to `reduceRight` begins and before being visited are not visited.

This method performs the following steps when called:

1.  Let `O` be ? [ToObject](#sec-toobject)(this value).
2.  Let `len` be ? [LengthOfArrayLike](#sec-lengthofarraylike)(`O`).
3.  If [IsCallable](#sec-iscallable)(`callback`) is false, throw a TypeError exception.
4.  If `len` = 0 and `initialValue` is not present, throw a TypeError exception.
5.  Let `k` be `len` - 1.
6.  Let `accumulator` be undefined.
7.  If `initialValue` is present, then
    1.  Set `accumulator` to `initialValue`.
8.  Else,
    1.  Let `kPresent` be false.
    2.  Repeat, while `kPresent` is false and `k` ≥ 0,
        1.  Let `Pk` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k`)).
        2.  Set `kPresent` to ? [HasProperty](#sec-hasproperty)(`O`, `Pk`).
        3.  If `kPresent` is true, then
            1.  Set `accumulator` to ? [Get](#sec-get-o-p)(`O`, `Pk`).
        4.  Set `k` to `k` - 1.
    3.  If `kPresent` is false, throw a TypeError exception.
9.  Repeat, while `k` ≥ 0,
    1.  Let `Pk` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k`)).
    2.  Let `kPresent` be ? [HasProperty](#sec-hasproperty)(`O`, `Pk`).
    3.  If `kPresent` is true, then
        1.  Let `kValue` be ? [Get](#sec-get-o-p)(`O`, `Pk`).
        2.  Set `accumulator` to ? [Call](#sec-call)(`callback`, undefined, « `accumulator`, `kValue`, [𝔽](#𝔽)(`k`), `O` »).
    4.  Set `k` to `k` - 1.
10. Return `accumulator`.

Note 2

This method is intentionally generic; it does not require that its this value be an Array. Therefore it can be transferred to other kinds of objects for use as a method.

#### 23.1.3.26 Array.prototype.reverse ( )

Note 1

This method rearranges the elements of the array so as to reverse their order. It returns the reversed array.

This method performs the following steps when called:

1.  Let `O` be ? [ToObject](#sec-toobject)(this value).
2.  Let `len` be ? [LengthOfArrayLike](#sec-lengthofarraylike)(`O`).
3.  Let `middle` be [floor](#eqn-floor)(`len` / 2).
4.  Let `lower` be 0.
5.  Repeat, while `lower` ≠ `middle`,
    1.  Let `upper` be `len` - `lower` - 1.
    2.  Let `upperP` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`upper`)).
    3.  Let `lowerP` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`lower`)).
    4.  Let `lowerExists` be ? [HasProperty](#sec-hasproperty)(`O`, `lowerP`).
    5.  If `lowerExists` is true, then
        1.  Let `lowerValue` be ? [Get](#sec-get-o-p)(`O`, `lowerP`).
    6.  Let `upperExists` be ? [HasProperty](#sec-hasproperty)(`O`, `upperP`).
    7.  If `upperExists` is true, then
        1.  Let `upperValue` be ? [Get](#sec-get-o-p)(`O`, `upperP`).
    8.  If `lowerExists` is true and `upperExists` is true, then
        1.  Perform ? [Set](#sec-set-o-p-v-throw)(`O`, `lowerP`, `upperValue`, true).
        2.  Perform ? [Set](#sec-set-o-p-v-throw)(`O`, `upperP`, `lowerValue`, true).
    9.  Else if `lowerExists` is false and `upperExists` is true, then
        1.  Perform ? [Set](#sec-set-o-p-v-throw)(`O`, `lowerP`, `upperValue`, true).
        2.  Perform ? [DeletePropertyOrThrow](#sec-deletepropertyorthrow)(`O`, `upperP`).
    10. Else if `lowerExists` is true and `upperExists` is false, then
        1.  Perform ? [DeletePropertyOrThrow](#sec-deletepropertyorthrow)(`O`, `lowerP`).
        2.  Perform ? [Set](#sec-set-o-p-v-throw)(`O`, `upperP`, `lowerValue`, true).
    11. Else,
        1.  [Assert](#assert): `lowerExists` and `upperExists` are both false.
        2.  NOTE: No action is required.
    12. Set `lower` to `lower` + 1.
6.  Return `O`.

Note 2

This method is intentionally generic; it does not require that its this value be an Array. Therefore, it can be transferred to other kinds of objects for use as a method.

#### 23.1.3.27 Array.prototype.shift ( )

This method removes the first element of the array and returns it.

It performs the following steps when called:

1.  Let `O` be ? [ToObject](#sec-toobject)(this value).
2.  Let `len` be ? [LengthOfArrayLike](#sec-lengthofarraylike)(`O`).
3.  If `len` = 0, then
    1.  Perform ? [Set](#sec-set-o-p-v-throw)(`O`, "length", +0_(𝔽), true).
    2.  Return undefined.
4.  Let `first` be ? [Get](#sec-get-o-p)(`O`, "0").
5.  Let `k` be 1.
6.  Repeat, while `k` \< `len`,
    1.  Let `from` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k`)).
    2.  Let `to` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k` - 1)).
    3.  Let `fromPresent` be ? [HasProperty](#sec-hasproperty)(`O`, `from`).
    4.  If `fromPresent` is true, then
        1.  Let `fromValue` be ? [Get](#sec-get-o-p)(`O`, `from`).
        2.  Perform ? [Set](#sec-set-o-p-v-throw)(`O`, `to`, `fromValue`, true).
    5.  Else,
        1.  [Assert](#assert): `fromPresent` is false.
        2.  Perform ? [DeletePropertyOrThrow](#sec-deletepropertyorthrow)(`O`, `to`).
    6.  Set `k` to `k` + 1.
7.  Perform ? [DeletePropertyOrThrow](#sec-deletepropertyorthrow)(`O`, ! [ToString](#sec-tostring)([𝔽](#𝔽)(`len` - 1))).
8.  Perform ? [Set](#sec-set-o-p-v-throw)(`O`, "length", [𝔽](#𝔽)(`len` - 1), true).
9.  Return `first`.

Note

This method is intentionally generic; it does not require that its this value be an Array. Therefore it can be transferred to other kinds of objects for use as a method.

#### 23.1.3.28 Array.prototype.slice ( `start`, `end` )

This method returns an array containing the elements of the array from element `start` up to, but not including, element `end` (or through the end of the array if `end` is undefined). If `start` is negative, it is treated as `length` + `start` where `length` is the length of the array. If `end` is negative, it is treated as `length` + `end` where `length` is the length of the array.

It performs the following steps when called:

1.  Let `O` be ? [ToObject](#sec-toobject)(this value).
2.  Let `len` be ? [LengthOfArrayLike](#sec-lengthofarraylike)(`O`).
3.  Let `relativeStart` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`start`).
4.  If `relativeStart` = -∞, let `k` be 0.
5.  Else if `relativeStart` \< 0, let `k` be [max](#eqn-max)(`len` + `relativeStart`, 0).
6.  Else, let `k` be [min](#eqn-min)(`relativeStart`, `len`).
7.  If `end` is undefined, let `relativeEnd` be `len`; else let `relativeEnd` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`end`).
8.  If `relativeEnd` = -∞, let `final` be 0.
9.  Else if `relativeEnd` \< 0, let `final` be [max](#eqn-max)(`len` + `relativeEnd`, 0).
10. Else, let `final` be [min](#eqn-min)(`relativeEnd`, `len`).
11. Let `count` be [max](#eqn-max)(`final` - `k`, 0).
12. Let `A` be ? [ArraySpeciesCreate](#sec-arrayspeciescreate)(`O`, `count`).
13. Let `n` be 0.
14. Repeat, while `k` \< `final`,
    1.  Let `Pk` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k`)).
    2.  Let `kPresent` be ? [HasProperty](#sec-hasproperty)(`O`, `Pk`).
    3.  If `kPresent` is true, then
        1.  Let `kValue` be ? [Get](#sec-get-o-p)(`O`, `Pk`).
        2.  Perform ? [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`A`, ! [ToString](#sec-tostring)([𝔽](#𝔽)(`n`)), `kValue`).
    4.  Set `k` to `k` + 1.
    5.  Set `n` to `n` + 1.
15. Perform ? [Set](#sec-set-o-p-v-throw)(`A`, "length", [𝔽](#𝔽)(`n`), true).
16. Return `A`.

Note 1

The explicit setting of the "length" property in step [15](#step-array-proto-slice-set-length) is intended to ensure the length is correct even when `A` is not a built-in Array.

Note 2

This method is intentionally generic; it does not require that its this value be an Array. Therefore it can be transferred to other kinds of objects for use as a method.

#### 23.1.3.29 Array.prototype.some ( `callback` \[ , `thisArg` \] )

Note 1

`callback` should be a function that accepts three arguments and returns a value that is coercible to a Boolean value. `some` calls `callback` once for each element present in the array, in ascending order, until it finds one where `callback` returns true. If such an element is found, `some` immediately returns true. Otherwise, `some` returns false. `callback` is called only for elements of the array which actually exist; it is not called for missing elements of the array.

If a `thisArg` parameter is provided, it will be used as the this value for each invocation of `callback`. If it is not provided, undefined is used instead.

`callback` is called with three arguments: the value of the element, the index of the element, and the object being traversed.

`some` does not directly mutate the object on which it is called but the object may be mutated by the calls to `callback`.

The range of elements processed by `some` is set before the first call to `callback`. Elements that are appended to the array after the call to `some` begins will not be visited by `callback`. If existing elements of the array are changed, their value as passed to `callback` will be the value at the time that `some` visits them; elements that are deleted after the call to `some` begins and before being visited are not visited. `some` acts like the "exists" quantifier in mathematics. In particular, for an empty array, it returns false.

This method performs the following steps when called:

1.  Let `O` be ? [ToObject](#sec-toobject)(this value).
2.  Let `len` be ? [LengthOfArrayLike](#sec-lengthofarraylike)(`O`).
3.  If [IsCallable](#sec-iscallable)(`callback`) is false, throw a TypeError exception.
4.  Let `k` be 0.
5.  Repeat, while `k` \< `len`,
    1.  Let `Pk` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k`)).
    2.  Let `kPresent` be ? [HasProperty](#sec-hasproperty)(`O`, `Pk`).
    3.  If `kPresent` is true, then
        1.  Let `kValue` be ? [Get](#sec-get-o-p)(`O`, `Pk`).
        2.  Let `testResult` be [ToBoolean](#sec-toboolean)(? [Call](#sec-call)(`callback`, `thisArg`, « `kValue`, [𝔽](#𝔽)(`k`), `O` »)).
        3.  If `testResult` is true, return true.
    4.  Set `k` to `k` + 1.
6.  Return false.

Note 2

This method is intentionally generic; it does not require that its this value be an Array. Therefore it can be transferred to other kinds of objects for use as a method.

#### 23.1.3.30 Array.prototype.sort ( `comparator` )

This method sorts the elements of this array. If `comparator` is not undefined, it should be a function that accepts two arguments `x` and `y` and returns a negative Number if `x` \< `y`, a positive Number if `x` \> `y`, or a zero otherwise.

It performs the following steps when called:

1.  If `comparator` is not undefined and [IsCallable](#sec-iscallable)(`comparator`) is false, throw a TypeError exception.
2.  Let `obj` be ? [ToObject](#sec-toobject)(this value).
3.  Let `len` be ? [LengthOfArrayLike](#sec-lengthofarraylike)(`obj`).
4.  Let `SortCompare` be a new [Abstract Closure](#sec-abstract-closure) with parameters (`x`, `y`) that captures `comparator` and performs the following steps when called:
    1.  Return ? [CompareArrayElements](#sec-comparearrayelements)(`x`, `y`, `comparator`).
5.  Let `sortedList` be ? [SortIndexedProperties](#sec-sortindexedproperties)(`obj`, `len`, `SortCompare`, skip-holes).
6.  Let `itemCount` be the number of elements in `sortedList`.
7.  Let `j` be 0.
8.  Repeat, while `j` \< `itemCount`,
    1.  Perform ? [Set](#sec-set-o-p-v-throw)(`obj`, ! [ToString](#sec-tostring)([𝔽](#𝔽)(`j`)), `sortedList`\[`j`\], true).
    2.  Set `j` to `j` + 1.
9.  NOTE: The call to [SortIndexedProperties](#sec-sortindexedproperties) in step [5](#step-array-sortindexedproperties) uses skip-holes. The remaining indices are deleted to preserve the number of holes that were detected and excluded from the sort.
10. Repeat, while `j` \< `len`,
    1.  Perform ? [DeletePropertyOrThrow](#sec-deletepropertyorthrow)(`obj`, ! [ToString](#sec-tostring)([𝔽](#𝔽)(`j`))).
    2.  Set `j` to `j` + 1.
11. Return `obj`.

Note 1

Because non-existent property values always compare greater than undefined property values, and undefined always compares greater than any other value (see [CompareArrayElements](#sec-comparearrayelements)), undefined property values always sort to the end of the result, followed by non-existent property values.

Note 2

Method calls performed by the [ToString](#sec-tostring) [abstract operations](#sec-algorithm-conventions-abstract-operations) in steps [5](#step-sortcompare-tostring-x) and [6](#step-sortcompare-tostring-y) have the potential to cause `SortCompare` to not behave as a [consistent comparator](#consistent-comparator).

Note 3

This method is intentionally generic; it does not require that its this value be an Array. Therefore, it can be transferred to other kinds of objects for use as a method.

##### 23.1.3.30.1 SortIndexedProperties ( `obj`, `len`, `SortCompare`, `holes` )

The abstract operation SortIndexedProperties takes arguments `obj` (an Object), `len` (a non-negative [integer](#integer)), `SortCompare` (an [Abstract Closure](#sec-abstract-closure) with two parameters), and `holes` (skip-holes or read-through-holes) and returns either a [normal completion containing](#sec-completion-record-specification-type) a [List](#sec-list-and-record-specification-type) of [ECMAScript language values](#sec-ecmascript-language-types) or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `items` be a new empty [List](#sec-list-and-record-specification-type).
2.  Let `k` be 0.
3.  Repeat, while `k` \< `len`,
    1.  Let `Pk` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k`)).
    2.  If `holes` is skip-holes, then
        1.  Let `kRead` be ? [HasProperty](#sec-hasproperty)(`obj`, `Pk`).
    3.  Else,
        1.  [Assert](#assert): `holes` is read-through-holes.
        2.  Let `kRead` be true.
    4.  If `kRead` is true, then
        1.  Let `kValue` be ? [Get](#sec-get-o-p)(`obj`, `Pk`).
        2.  Append `kValue` to `items`.
    5.  Set `k` to `k` + 1.
4.  Sort `items` using an [implementation-defined](#implementation-defined) sequence of calls to `SortCompare`. If any such call returns an [abrupt completion](#sec-completion-record-specification-type), stop before performing any further calls to `SortCompare` and return that [Completion Record](#sec-completion-record-specification-type).
5.  Return `items`.

The sort order is the ordering of `items` after completion of step [4](#step-array-sort) of the algorithm above. The [sort order](#sort-order) is [implementation-defined](#implementation-defined) if `SortCompare` is not a [consistent comparator](#consistent-comparator) for the elements of `items`. When SortIndexedProperties is invoked by [Array.prototype.sort](#sec-array.prototype.sort) or [Array.prototype.toSorted](#sec-array.prototype.tosorted), the [sort order](#sort-order) is also [implementation-defined](#implementation-defined) if `comparator` is undefined, and all applications of [ToString](#sec-tostring), to any specific value passed as an argument to `SortCompare`, do not produce the same result.

Unless the [sort order](#sort-order) is specified to be [implementation-defined](#implementation-defined), it must satisfy all of the following conditions:

- There must be some mathematical permutation π of the non-negative [integers](#integer) less than `itemCount`, such that for every non-negative [integer](#integer) `j` less than `itemCount`, the element old\[`j`\] is exactly the same as new\[π(`j`)\].
- Then for all non-negative [integers](#integer) `j` and `k`, each less than `itemCount`, if [ℝ](#ℝ)(`SortCompare`(old\[`j`\], old\[`k`\])) \< 0, then π(`j`) \< π(`k`).
- And for all non-negative [integers](#integer) `j` and `k` such that `j` \< `k` \< `itemCount`, if [ℝ](#ℝ)(`SortCompare`(old\[`j`\], old\[`k`\])) = 0, then π(`j`) \< π(`k`); i.e., the sort is stable.

Here the notation old\[`j`\] is used to refer to `items`\[`j`\] before step [4](#step-array-sort) is executed, and the notation new\[`j`\] to refer to `items`\[`j`\] after step [4](#step-array-sort) has been executed.

An abstract closure or function `comparator` is a consistent comparator for a set of values `S` if all of the requirements below are met for all values `a`, `b`, and `c` (possibly the same value) in the set `S`: The notation `a` \<_(C) `b` means [ℝ](#ℝ)(`comparator`(`a`, `b`)) \< 0; `a` =_(C) `b` means [ℝ](#ℝ)(`comparator`(`a`, `b`)) = 0; and `a` \>_(C) `b` means [ℝ](#ℝ)(`comparator`(`a`, `b`)) \> 0.

- Calling `comparator`(`a`, `b`) always returns the same value `v` when given a specific pair of values `a` and `b` as its two arguments. Furthermore, `v` [is a Number](#sec-ecmascript-language-types-number-type), and `v` is not NaN. Note that this implies that exactly one of `a` \<_(C) `b`, `a` =_(C) `b`, and `a` \>_(C) `b` will be true for a given pair of `a` and `b`.
- Calling `comparator`(`a`, `b`) does not modify `obj` or any object on `obj`'s prototype chain.
- `a` =_(C) `a` (reflexivity)
- If `a` =_(C) `b`, then `b` =_(C) `a` (symmetry)
- If `a` =_(C) `b` and `b` =_(C) `c`, then `a` =_(C) `c` (transitivity of =_(C))
- If `a` \<_(C) `b` and `b` \<_(C) `c`, then `a` \<_(C) `c` (transitivity of \<_(C))
- If `a` \>_(C) `b` and `b` \>_(C) `c`, then `a` \>_(C) `c` (transitivity of \>_(C))

Note

The above conditions are necessary and sufficient to ensure that `comparator` divides the set `S` into equivalence classes and that these equivalence classes are totally ordered.

##### 23.1.3.30.2 CompareArrayElements ( `x`, `y`, `comparator` )

The abstract operation CompareArrayElements takes arguments `x` (an [ECMAScript language value](#sec-ecmascript-language-types)), `y` (an [ECMAScript language value](#sec-ecmascript-language-types)), and `comparator` (a [function object](#function-object) or undefined) and returns either a [normal completion containing](#sec-completion-record-specification-type) a Number or an [abrupt completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  If `x` and `y` are both undefined, return +0_(𝔽).
2.  If `x` is undefined, return 1_(𝔽).
3.  If `y` is undefined, return -1_(𝔽).
4.  If `comparator` is not undefined, then
    1.  Let `v` be ? [ToNumber](#sec-tonumber)(? [Call](#sec-call)(`comparator`, undefined, « `x`, `y` »)).
    2.  If `v` is NaN, return +0_(𝔽).
    3.  Return `v`.
5.  Let `xString` be ? [ToString](#sec-tostring)(`x`).
6.  Let `yString` be ? [ToString](#sec-tostring)(`y`).
7.  Let `xSmaller` be ! [IsLessThan](#sec-islessthan)(`xString`, `yString`, true).
8.  If `xSmaller` is true, return -1_(𝔽).
9.  Let `ySmaller` be ! [IsLessThan](#sec-islessthan)(`yString`, `xString`, true).
10. If `ySmaller` is true, return 1_(𝔽).
11. Return +0_(𝔽).

#### 23.1.3.31 Array.prototype.splice ( `start`, `deleteCount`, ...`items` )

Note 1

This method deletes the `deleteCount` elements of the array starting at [integer index](#integer-index) `start` and replaces them with the elements of `items`. It returns an Array containing the deleted elements (if any).

This method performs the following steps when called:

1.  Let `O` be ? [ToObject](#sec-toobject)(this value).
2.  Let `len` be ? [LengthOfArrayLike](#sec-lengthofarraylike)(`O`).
3.  Let `relativeStart` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`start`).
4.  If `relativeStart` = -∞, let `actualStart` be 0.
5.  Else if `relativeStart` \< 0, let `actualStart` be [max](#eqn-max)(`len` + `relativeStart`, 0).
6.  Else, let `actualStart` be [min](#eqn-min)(`relativeStart`, `len`).
7.  Let `itemCount` be the number of elements in `items`.
8.  If `start` is not present, then
    1.  Let `actualDeleteCount` be 0.
9.  Else if `deleteCount` is not present, then
    1.  Let `actualDeleteCount` be `len` - `actualStart`.
10. Else,
    1.  Let `dc` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`deleteCount`).
    2.  Let `actualDeleteCount` be the result of [clamping](#clamping) `dc` between 0 and `len` - `actualStart`.
11. If `len` + `itemCount` - `actualDeleteCount` \> 2\*\*⁵³ - 1, throw a TypeError exception.
12. Let `A` be ? [ArraySpeciesCreate](#sec-arrayspeciescreate)(`O`, `actualDeleteCount`).
13. Let `k` be 0.
14. Repeat, while `k` \< `actualDeleteCount`,
    1.  Let `from` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`actualStart` + `k`)).
    2.  If ? [HasProperty](#sec-hasproperty)(`O`, `from`) is true, then
        1.  Let `fromValue` be ? [Get](#sec-get-o-p)(`O`, `from`).
        2.  Perform ? [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`A`, ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k`)), `fromValue`).
    3.  Set `k` to `k` + 1.
15. Perform ? [Set](#sec-set-o-p-v-throw)(`A`, "length", [𝔽](#𝔽)(`actualDeleteCount`), true).
16. If `itemCount` \< `actualDeleteCount`, then
    1.  Set `k` to `actualStart`.
    2.  Repeat, while `k` \< (`len` - `actualDeleteCount`),
        1.  Let `from` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k` + `actualDeleteCount`)).
        2.  Let `to` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k` + `itemCount`)).
        3.  If ? [HasProperty](#sec-hasproperty)(`O`, `from`) is true, then
            1.  Let `fromValue` be ? [Get](#sec-get-o-p)(`O`, `from`).
            2.  Perform ? [Set](#sec-set-o-p-v-throw)(`O`, `to`, `fromValue`, true).
        4.  Else,
            1.  Perform ? [DeletePropertyOrThrow](#sec-deletepropertyorthrow)(`O`, `to`).
        5.  Set `k` to `k` + 1.
    3.  Set `k` to `len`.
    4.  Repeat, while `k` \> (`len` - `actualDeleteCount` + `itemCount`),
        1.  Perform ? [DeletePropertyOrThrow](#sec-deletepropertyorthrow)(`O`, ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k` - 1))).
        2.  Set `k` to `k` - 1.
17. Else if `itemCount` \> `actualDeleteCount`, then
    1.  Set `k` to (`len` - `actualDeleteCount`).
    2.  Repeat, while `k` \> `actualStart`,
        1.  Let `from` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k` + `actualDeleteCount` - 1)).
        2.  Let `to` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k` + `itemCount` - 1)).
        3.  If ? [HasProperty](#sec-hasproperty)(`O`, `from`) is true, then
            1.  Let `fromValue` be ? [Get](#sec-get-o-p)(`O`, `from`).
            2.  Perform ? [Set](#sec-set-o-p-v-throw)(`O`, `to`, `fromValue`, true).
        4.  Else,
            1.  Perform ? [DeletePropertyOrThrow](#sec-deletepropertyorthrow)(`O`, `to`).
        5.  Set `k` to `k` - 1.
18. Set `k` to `actualStart`.
19. For each element `E` of `items`, do
    1.  Perform ? [Set](#sec-set-o-p-v-throw)(`O`, ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k`)), `E`, true).
    2.  Set `k` to `k` + 1.
20. Perform ? [Set](#sec-set-o-p-v-throw)(`O`, "length", [𝔽](#𝔽)(`len` - `actualDeleteCount` + `itemCount`), true).
21. Return `A`.

Note 2

The explicit setting of the "length" property in steps [15](#step-array-proto-splice-set-length) and [20](#step-array-proto-splice-set-length-2) is intended to ensure the lengths are correct even when the objects are not built-in Arrays.

Note 3

This method is intentionally generic; it does not require that its this value be an Array. Therefore it can be transferred to other kinds of objects for use as a method.

#### 23.1.3.32 Array.prototype.toLocaleString ( \[ `reserved1` \[ , `reserved2` \] \] )

An ECMAScript implementation that includes the ECMA-402 Internationalization API must implement this method as specified in the ECMA-402 specification. If an ECMAScript implementation does not include the ECMA-402 API the following specification of this method is used.

Note 1

The first edition of ECMA-402 did not include a replacement specification for this method.

The meanings of the optional parameters to this method are defined in the ECMA-402 specification; implementations that do not include ECMA-402 support must not use those parameter positions for anything else.

This method performs the following steps when called:

1.  Let `array` be ? [ToObject](#sec-toobject)(this value).
2.  Let `len` be ? [LengthOfArrayLike](#sec-lengthofarraylike)(`array`).
3.  Let `separator` be the [implementation-defined](#implementation-defined) list-separator String value appropriate for the [host environment](#host-environment)'s current locale (such as ", ").
4.  Let `R` be the empty String.
5.  Let `k` be 0.
6.  Repeat, while `k` \< `len`,
    1.  If `k` \> 0, set `R` to the [string-concatenation](#string-concatenation) of `R` and `separator`.
    2.  Let `element` be ? [Get](#sec-get-o-p)(`array`, ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k`))).
    3.  If `element` is neither undefined nor null, then
        1.  Let `S` be ? [ToString](#sec-tostring)(? [Invoke](#sec-invoke)(`element`, "toLocaleString")).
        2.  Set `R` to the [string-concatenation](#string-concatenation) of `R` and `S`.
    4.  Set `k` to `k` + 1.
7.  Return `R`.

Note 2

This method converts the elements of the array to Strings using their `toLocaleString` methods, and then concatenates these Strings, separated by occurrences of an [implementation-defined](#implementation-defined) locale-sensitive separator String. This method is analogous to `toString` except that it is intended to yield a locale-sensitive result corresponding with conventions of the [host environment](#host-environment)'s current locale.

Note 3

This method is intentionally generic; it does not require that its this value be an Array. Therefore it can be transferred to other kinds of objects for use as a method.

#### 23.1.3.33 Array.prototype.toReversed ( )

This method performs the following steps when called:

1.  Let `O` be ? [ToObject](#sec-toobject)(this value).
2.  Let `len` be ? [LengthOfArrayLike](#sec-lengthofarraylike)(`O`).
3.  Let `A` be ? [ArrayCreate](#sec-arraycreate)(`len`).
4.  Let `k` be 0.
5.  Repeat, while `k` \< `len`,
    1.  Let `from` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`len` - `k` - 1)).
    2.  Let `Pk` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k`)).
    3.  Let `fromValue` be ? [Get](#sec-get-o-p)(`O`, `from`).
    4.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`A`, `Pk`, `fromValue`).
    5.  Set `k` to `k` + 1.
6.  Return `A`.

#### 23.1.3.34 Array.prototype.toSorted ( `comparator` )

This method performs the following steps when called:

1.  If `comparator` is not undefined and [IsCallable](#sec-iscallable)(`comparator`) is false, throw a TypeError exception.
2.  Let `O` be ? [ToObject](#sec-toobject)(this value).
3.  Let `len` be ? [LengthOfArrayLike](#sec-lengthofarraylike)(`O`).
4.  Let `A` be ? [ArrayCreate](#sec-arraycreate)(`len`).
5.  Let `SortCompare` be a new [Abstract Closure](#sec-abstract-closure) with parameters (`x`, `y`) that captures `comparator` and performs the following steps when called:
    1.  Return ? [CompareArrayElements](#sec-comparearrayelements)(`x`, `y`, `comparator`).
6.  Let `sortedList` be ? [SortIndexedProperties](#sec-sortindexedproperties)(`O`, `len`, `SortCompare`, read-through-holes).
7.  Let `j` be 0.
8.  Repeat, while `j` \< `len`,
    1.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`A`, ! [ToString](#sec-tostring)([𝔽](#𝔽)(`j`)), `sortedList`\[`j`\]).
    2.  Set `j` to `j` + 1.
9.  Return `A`.

#### 23.1.3.35 Array.prototype.toSpliced ( `start`, `skipCount`, ...`items` )

This method performs the following steps when called:

1.  Let `O` be ? [ToObject](#sec-toobject)(this value).
2.  Let `len` be ? [LengthOfArrayLike](#sec-lengthofarraylike)(`O`).
3.  Let `relativeStart` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`start`).
4.  If `relativeStart` = -∞, let `actualStart` be 0.
5.  Else if `relativeStart` \< 0, let `actualStart` be [max](#eqn-max)(`len` + `relativeStart`, 0).
6.  Else, let `actualStart` be [min](#eqn-min)(`relativeStart`, `len`).
7.  Let `insertCount` be the number of elements in `items`.
8.  If `start` is not present, then
    1.  Let `actualSkipCount` be 0.
9.  Else if `skipCount` is not present, then
    1.  Let `actualSkipCount` be `len` - `actualStart`.
10. Else,
    1.  Let `sc` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`skipCount`).
    2.  Let `actualSkipCount` be the result of [clamping](#clamping) `sc` between 0 and `len` - `actualStart`.
11. Let `newLen` be `len` + `insertCount` - `actualSkipCount`.
12. If `newLen` \> 2\*\*⁵³ - 1, throw a TypeError exception.
13. Let `A` be ? [ArrayCreate](#sec-arraycreate)(`newLen`).
14. Let `i` be 0.
15. Let `r` be `actualStart` + `actualSkipCount`.
16. Repeat, while `i` \< `actualStart`,
    1.  Let `Pi` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`i`)).
    2.  Let `iValue` be ? [Get](#sec-get-o-p)(`O`, `Pi`).
    3.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`A`, `Pi`, `iValue`).
    4.  Set `i` to `i` + 1.
17. For each element `E` of `items`, do
    1.  Let `Pi` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`i`)).
    2.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`A`, `Pi`, `E`).
    3.  Set `i` to `i` + 1.
18. Repeat, while `i` \< `newLen`,
    1.  Let `Pi` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`i`)).
    2.  Let `from` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`r`)).
    3.  Let `fromValue` be ? [Get](#sec-get-o-p)(`O`, `from`).
    4.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`A`, `Pi`, `fromValue`).
    5.  Set `i` to `i` + 1.
    6.  Set `r` to `r` + 1.
19. Return `A`.

#### 23.1.3.36 Array.prototype.toString ( )

This method performs the following steps when called:

1.  Let `array` be ? [ToObject](#sec-toobject)(this value).
2.  Let `func` be ? [Get](#sec-get-o-p)(`array`, "join").
3.  If [IsCallable](#sec-iscallable)(`func`) is false, set `func` to the intrinsic function %Object.prototype.toString%.
4.  Return ? [Call](#sec-call)(`func`, `array`).

Note

This method is intentionally generic; it does not require that its this value be an Array. Therefore it can be transferred to other kinds of objects for use as a method.

#### 23.1.3.37 Array.prototype.unshift ( ...`items` )

This method prepends the arguments to the start of the array, such that their order within the array is the same as the order in which they appear in the argument list.

It performs the following steps when called:

1.  Let `O` be ? [ToObject](#sec-toobject)(this value).
2.  Let `len` be ? [LengthOfArrayLike](#sec-lengthofarraylike)(`O`).
3.  Let `argCount` be the number of elements in `items`.
4.  If `argCount` \> 0, then
    1.  If `len` + `argCount` \> 2\*\*⁵³ - 1, throw a TypeError exception.
    2.  Let `k` be `len`.
    3.  Repeat, while `k` \> 0,
        1.  Let `from` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k` - 1)).
        2.  Let `to` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k` + `argCount` - 1)).
        3.  Let `fromPresent` be ? [HasProperty](#sec-hasproperty)(`O`, `from`).
        4.  If `fromPresent` is true, then
            1.  Let `fromValue` be ? [Get](#sec-get-o-p)(`O`, `from`).
            2.  Perform ? [Set](#sec-set-o-p-v-throw)(`O`, `to`, `fromValue`, true).
        5.  Else,
            1.  [Assert](#assert): `fromPresent` is false.
            2.  Perform ? [DeletePropertyOrThrow](#sec-deletepropertyorthrow)(`O`, `to`).
        6.  Set `k` to `k` - 1.
    4.  Let `j` be +0_(𝔽).
    5.  For each element `E` of `items`, do
        1.  Perform ? [Set](#sec-set-o-p-v-throw)(`O`, ! [ToString](#sec-tostring)(`j`), `E`, true).
        2.  Set `j` to `j` + 1_(𝔽).
5.  Perform ? [Set](#sec-set-o-p-v-throw)(`O`, "length", [𝔽](#𝔽)(`len` + `argCount`), true).
6.  Return [𝔽](#𝔽)(`len` + `argCount`).

The "length" property of this method is 1_(𝔽).

Note

This method is intentionally generic; it does not require that its this value be an Array. Therefore it can be transferred to other kinds of objects for use as a method.

#### 23.1.3.38 Array.prototype.values ( )

This method performs the following steps when called:

1.  Let `O` be ? [ToObject](#sec-toobject)(this value).
2.  Return [CreateArrayIterator](#sec-createarrayiterator)(`O`, value).

#### 23.1.3.39 Array.prototype.with ( `index`, `value` )

This method performs the following steps when called:

1.  Let `O` be ? [ToObject](#sec-toobject)(this value).
2.  Let `len` be ? [LengthOfArrayLike](#sec-lengthofarraylike)(`O`).
3.  Let `relativeIndex` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`index`).
4.  If `relativeIndex` ≥ 0, let `actualIndex` be `relativeIndex`.
5.  Else, let `actualIndex` be `len` + `relativeIndex`.
6.  If `actualIndex` ≥ `len` or `actualIndex` \< 0, throw a RangeError exception.
7.  Let `A` be ? [ArrayCreate](#sec-arraycreate)(`len`).
8.  Let `k` be 0.
9.  Repeat, while `k` \< `len`,
    1.  Let `Pk` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k`)).
    2.  If `k` = `actualIndex`, let `fromValue` be `value`.
    3.  Else, let `fromValue` be ? [Get](#sec-get-o-p)(`O`, `Pk`).
    4.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`A`, `Pk`, `fromValue`).
    5.  Set `k` to `k` + 1.
10. Return `A`.

#### 23.1.3.40 Array.prototype \[ %Symbol.iterator% \] ( )

The initial value of the [%Symbol.iterator%](#sec-well-known-symbols) property is %Array.prototype.values%, defined in [23.1.3.38](#sec-array.prototype.values).

#### 23.1.3.41 Array.prototype \[ %Symbol.unscopables% \]

The initial value of the [%Symbol.unscopables%](#sec-well-known-symbols) [data property](#sec-object-type) is an object created by the following steps:

1.  Let `unscopableList` be [OrdinaryObjectCreate](#sec-ordinaryobjectcreate)(null).
2.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`unscopableList`, "at", true).
3.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`unscopableList`, "copyWithin", true).
4.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`unscopableList`, "entries", true).
5.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`unscopableList`, "fill", true).
6.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`unscopableList`, "find", true).
7.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`unscopableList`, "findIndex", true).
8.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`unscopableList`, "findLast", true).
9.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`unscopableList`, "findLastIndex", true).
10. Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`unscopableList`, "flat", true).
11. Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`unscopableList`, "flatMap", true).
12. Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`unscopableList`, "includes", true).
13. Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`unscopableList`, "keys", true).
14. Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`unscopableList`, "toReversed", true).
15. Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`unscopableList`, "toSorted", true).
16. Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`unscopableList`, "toSpliced", true).
17. Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`unscopableList`, "values", true).
18. Return `unscopableList`.

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: true }.

Note

The own property names of this object are property names that were not included as standard properties of `Array.prototype` prior to the ECMAScript 2015 specification. These names are ignored for `with` statement binding purposes in order to preserve the behaviour of existing code that might use one of these names as a binding in an outer scope that is shadowed by a `with` statement whose binding object is an Array.

The reason that "with" is not included in the `unscopableList` is because it is already a [reserved word](#sec-keywords-and-reserved-words).

### 23.1.4 Properties of Array Instances

Array instances are [Array exotic objects](#array-exotic-object) and have the internal methods specified for such objects. Array instances inherit properties from the [Array prototype object](#sec-properties-of-the-array-prototype-object).

Array instances have a "length" property, and a set of enumerable properties with [array index](#array-index) names.

#### 23.1.4.1 length

The "length" property of an Array instance is a [data property](#sec-object-type) whose value is always numerically greater than the name of every configurable own property whose name is an [array index](#array-index).

The "length" property initially has the attributes { `[[Writable]]`: true, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

Note

Reducing the value of the "length" property has the side-effect of deleting own array elements whose [array index](#array-index) is between the old and new length values. However, non-configurable properties can not be deleted. Attempting to set the "length" property of an Array to a value that is numerically less than or equal to the largest numeric own [property name](#property-name) of an existing non-configurable [array-indexed](#array-index) property of the array will result in the length being set to a numeric value that is one greater than that non-configurable numeric own [property name](#property-name). See [10.4.2.1](#sec-array-exotic-objects-defineownproperty-p-desc).

### 23.1.5 Array Iterator Objects

An Array Iterator is an object that represents a specific iteration over some specific Array instance object. There is not a named [constructor](#constructor) for Array Iterator objects. Instead, Array Iterator objects are created by calling certain methods of Array instance objects.

#### 23.1.5.1 CreateArrayIterator ( `array`, `kind` )

The abstract operation CreateArrayIterator takes arguments `array` (an Object) and `kind` (key+value, key, or value) and returns a Generator. It is used to create [iterator objects](#sec-iterator-interface) for Array methods that return such [iterators](#sec-iterator-interface). It performs the following steps when called:

1.  Let `closure` be a new [Abstract Closure](#sec-abstract-closure) with no parameters that captures `kind` and `array` and performs the following steps when called:
    1.  Let `index` be 0.
    2.  Repeat,
        1.  If `array` has a `[[TypedArrayName]]` internal slot, then
            1.  Let `taRecord` be [MakeTypedArrayWithBufferWitnessRecord](#sec-maketypedarraywithbufferwitnessrecord)(`array`, seq-cst).
            2.  If [IsTypedArrayOutOfBounds](#sec-istypedarrayoutofbounds)(`taRecord`) is true, throw a TypeError exception.
            3.  Let `len` be [TypedArrayLength](#sec-typedarraylength)(`taRecord`).
        2.  Else,
            1.  Let `len` be ? [LengthOfArrayLike](#sec-lengthofarraylike)(`array`).
        3.  If `index` ≥ `len`, return [NormalCompletion](#sec-normalcompletion)(undefined).
        4.  Let `indexNumber` be [𝔽](#𝔽)(`index`).
        5.  If `kind` is key, then
            1.  Let `result` be `indexNumber`.
        6.  Else,
            1.  Let `elementKey` be ! [ToString](#sec-tostring)(`indexNumber`).
            2.  Let `elementValue` be ? [Get](#sec-get-o-p)(`array`, `elementKey`).
            3.  If `kind` is value, then
                1.  Let `result` be `elementValue`.
            4.  Else,
                1.  [Assert](#assert): `kind` is key+value.
                2.  Let `result` be [CreateArrayFromList](#sec-createarrayfromlist)(« `indexNumber`, `elementValue` »).
        7.  Perform ? [GeneratorYield](#sec-generatoryield)([CreateIteratorResultObject](#sec-createiterresultobject)(`result`, false)).
        8.  Set `index` to `index` + 1.
2.  Return [CreateIteratorFromClosure](#sec-createiteratorfromclosure)(`closure`, "%ArrayIteratorPrototype%", [%ArrayIteratorPrototype%](#sec-%arrayiteratorprototype%-object)).

#### 23.1.5.2 The %ArrayIteratorPrototype% Object

The %ArrayIteratorPrototype% object:

- has properties that are inherited by all [Array Iterator objects](#sec-array-iterator-objects).
- is an [ordinary object](#ordinary-object).
- has a `[[Prototype]]` internal slot whose value is [%Iterator.prototype%](#sec-%iterator.prototype%-object).
- has the following properties:

##### 23.1.5.2.1 %ArrayIteratorPrototype%.next ( )

1.  Return ? [GeneratorResume](#sec-generatorresume)(this value, empty, "%ArrayIteratorPrototype%").

##### 23.1.5.2.2 %ArrayIteratorPrototype% \[ %Symbol.toStringTag% \]

The initial value of the [%Symbol.toStringTag%](#sec-well-known-symbols) property is the String value "Array Iterator".

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: true }.

## 23.2 TypedArray Objects

A `TypedArray` presents an array-like view of an underlying binary data buffer ([25.1](#sec-arraybuffer-objects)). A TypedArray element type is the underlying binary scalar data type that all elements of a `TypedArray` instance have. There is a distinct `TypedArray` [constructor](#constructor), listed in [Table 73](#table-the-typedarray-constructors), for each of the supported element types. Each [constructor](#constructor) in [Table 73](#table-the-typedarray-constructors) has a corresponding distinct prototype object.

[TABLE]

Table 73: The [TypedArray](#typedarray) [Constructors](#constructor)

In the definitions below, references to `TypedArray` should be replaced with the appropriate [constructor](#constructor) name from the above table.

### 23.2.1 The %TypedArray% Intrinsic Object

The %TypedArray% intrinsic object:

- is a [constructor](#constructor) [function object](#function-object) that all of the `TypedArray` [constructor](#constructor) objects inherit from.
- along with its corresponding prototype object, provides common properties that are inherited by all `TypedArray` [constructors](#constructor) and their instances.
- does not have a global name or appear as a property of the [global object](#sec-global-object).
- acts as the abstract superclass of the various `TypedArray` [constructors](#constructor).
- will throw an error when invoked, because it is an abstract class [constructor](#constructor). The `TypedArray` [constructors](#constructor) do not perform a `super` call to it.

#### 23.2.1.1 %TypedArray% ( )

This function performs the following steps when called:

1.  Throw a TypeError exception.

The "length" property of this function is +0_(𝔽).

### 23.2.2 Properties of the %TypedArray% Intrinsic Object

The [%TypedArray%](#sec-%typedarray%-intrinsic-object) intrinsic object:

- has a `[[Prototype]]` internal slot whose value is [%Function.prototype%](#sec-properties-of-the-function-prototype-object).
- has a "name" property whose value is "TypedArray".
- has the following properties:

#### 23.2.2.1 %TypedArray%.from ( `source` \[ , `mapper` \[ , `thisArg` \] \] )

This method performs the following steps when called:

1.  Let `C` be the this value.
2.  If [IsConstructor](#sec-isconstructor)(`C`) is false, throw a TypeError exception.
3.  If `mapper` is undefined, then
    1.  Let `mapping` be false.
4.  Else,
    1.  If [IsCallable](#sec-iscallable)(`mapper`) is false, throw a TypeError exception.
    2.  Let `mapping` be true.
5.  Let `usingIterator` be ? [GetMethod](#sec-getmethod)(`source`, [%Symbol.iterator%](#sec-well-known-symbols)).
6.  If `usingIterator` is not undefined, then
    1.  Let `values` be ? [IteratorToList](#sec-iteratortolist)(? [GetIteratorFromMethod](#sec-getiteratorfrommethod)(`source`, `usingIterator`)).
    2.  Let `len` be the number of elements in `values`.
    3.  Let `targetObj` be ? [TypedArrayCreateFromConstructor](#sec-typedarraycreatefromconstructor)(`C`, « [𝔽](#𝔽)(`len`) »).
    4.  Let `k` be 0.
    5.  Repeat, while `k` \< `len`,
        1.  Let `Pk` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k`)).
        2.  Let `kValue` be the first element of `values`.
        3.  Remove the first element from `values`.
        4.  If `mapping` is true, then
            1.  Let `mappedValue` be ? [Call](#sec-call)(`mapper`, `thisArg`, « `kValue`, [𝔽](#𝔽)(`k`) »).
        5.  Else,
            1.  Let `mappedValue` be `kValue`.
        6.  Perform ? [Set](#sec-set-o-p-v-throw)(`targetObj`, `Pk`, `mappedValue`, true).
        7.  Set `k` to `k` + 1.
    6.  [Assert](#assert): `values` is now an empty [List](#sec-list-and-record-specification-type).
    7.  Return `targetObj`.
7.  NOTE: `source` is not an [iterable object](#sec-iterable-interface), so assume it is already an [array-like object](#sec-lengthofarraylike).
8.  Let `arrayLike` be ! [ToObject](#sec-toobject)(`source`).
9.  Let `len` be ? [LengthOfArrayLike](#sec-lengthofarraylike)(`arrayLike`).
10. Let `targetObj` be ? [TypedArrayCreateFromConstructor](#sec-typedarraycreatefromconstructor)(`C`, « [𝔽](#𝔽)(`len`) »).
11. Let `k` be 0.
12. Repeat, while `k` \< `len`,
    1.  Let `Pk` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k`)).
    2.  Let `kValue` be ? [Get](#sec-get-o-p)(`arrayLike`, `Pk`).
    3.  If `mapping` is true, then
        1.  Let `mappedValue` be ? [Call](#sec-call)(`mapper`, `thisArg`, « `kValue`, [𝔽](#𝔽)(`k`) »).
    4.  Else,
        1.  Let `mappedValue` be `kValue`.
    5.  Perform ? [Set](#sec-set-o-p-v-throw)(`targetObj`, `Pk`, `mappedValue`, true).
    6.  Set `k` to `k` + 1.
13. Return `targetObj`.

#### 23.2.2.2 %TypedArray%.of ( ...`items` )

This method performs the following steps when called:

1.  Let `len` be the number of elements in `items`.
2.  Let `C` be the this value.
3.  If [IsConstructor](#sec-isconstructor)(`C`) is false, throw a TypeError exception.
4.  Let `newObj` be ? [TypedArrayCreateFromConstructor](#sec-typedarraycreatefromconstructor)(`C`, « [𝔽](#𝔽)(`len`) »).
5.  Let `k` be 0.
6.  Repeat, while `k` \< `len`,
    1.  Let `kValue` be `items`\[`k`\].
    2.  Let `Pk` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k`)).
    3.  Perform ? [Set](#sec-set-o-p-v-throw)(`newObj`, `Pk`, `kValue`, true).
    4.  Set `k` to `k` + 1.
7.  Return `newObj`.

#### 23.2.2.3 %TypedArray%.prototype

The initial value of [%TypedArray%](#sec-%typedarray%-intrinsic-object)`.prototype` is the [%TypedArray% prototype object](#sec-properties-of-the-%typedarrayprototype%-object).

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

#### 23.2.2.4 get %TypedArray% \[ %Symbol.species% \]

[%TypedArray%](#sec-%typedarray%-intrinsic-object)`[%Symbol.species%]` is an [accessor property](#sec-object-type) whose set accessor function is undefined. Its get accessor function performs the following steps when called:

1.  Return the this value.

The value of the "name" property of this function is "get \[Symbol.species\]".

Note

[%TypedArray.prototype%](#sec-properties-of-the-%typedarrayprototype%-object) methods normally use their this value's [constructor](#constructor) to create a derived object. However, a subclass [constructor](#constructor) may over-ride that default behaviour by redefining its [%Symbol.species%](#sec-well-known-symbols) property.

### 23.2.3 Properties of the %TypedArray% Prototype Object

The %TypedArray% prototype object:

- has a `[[Prototype]]` internal slot whose value is [%Object.prototype%](#sec-properties-of-the-object-prototype-object).
- is %TypedArray.prototype%.
- is an [ordinary object](#ordinary-object).
- does not have a `[[ViewedArrayBuffer]]` or any other of the internal slots that are specific to `TypedArray` instance objects.

#### 23.2.3.1 %TypedArray%.prototype.at ( `index` )

1.  Let `O` be the this value.
2.  Let `taRecord` be ? [ValidateTypedArray](#sec-validatetypedarray)(`O`, seq-cst).
3.  Let `len` be [TypedArrayLength](#sec-typedarraylength)(`taRecord`).
4.  Let `relativeIndex` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`index`).
5.  If `relativeIndex` ≥ 0, then
    1.  Let `k` be `relativeIndex`.
6.  Else,
    1.  Let `k` be `len` + `relativeIndex`.
7.  If `k` \< 0 or `k` ≥ `len`, return undefined.
8.  Return ! [Get](#sec-get-o-p)(`O`, ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k`))).

#### 23.2.3.2 get %TypedArray%.prototype.buffer

[%TypedArray%](#sec-%typedarray%-intrinsic-object)`.prototype.buffer` is an [accessor property](#sec-object-type) whose set accessor function is undefined. Its get accessor function performs the following steps when called:

1.  Let `O` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`O`, `[[TypedArrayName]]`).
3.  [Assert](#assert): `O` has a `[[ViewedArrayBuffer]]` internal slot.
4.  Let `buffer` be `O`.`[[ViewedArrayBuffer]]`.
5.  Return `buffer`.

#### 23.2.3.3 get %TypedArray%.prototype.byteLength

[%TypedArray%](#sec-%typedarray%-intrinsic-object)`.prototype.byteLength` is an [accessor property](#sec-object-type) whose set accessor function is undefined. Its get accessor function performs the following steps when called:

1.  Let `O` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`O`, `[[TypedArrayName]]`).
3.  [Assert](#assert): `O` has a `[[ViewedArrayBuffer]]` internal slot.
4.  Let `taRecord` be [MakeTypedArrayWithBufferWitnessRecord](#sec-maketypedarraywithbufferwitnessrecord)(`O`, seq-cst).
5.  Let `size` be [TypedArrayByteLength](#sec-typedarraybytelength)(`taRecord`).
6.  Return [𝔽](#𝔽)(`size`).

#### 23.2.3.4 get %TypedArray%.prototype.byteOffset

[%TypedArray%](#sec-%typedarray%-intrinsic-object)`.prototype.byteOffset` is an [accessor property](#sec-object-type) whose set accessor function is undefined. Its get accessor function performs the following steps when called:

1.  Let `O` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`O`, `[[TypedArrayName]]`).
3.  [Assert](#assert): `O` has a `[[ViewedArrayBuffer]]` internal slot.
4.  Let `taRecord` be [MakeTypedArrayWithBufferWitnessRecord](#sec-maketypedarraywithbufferwitnessrecord)(`O`, seq-cst).
5.  If [IsTypedArrayOutOfBounds](#sec-istypedarrayoutofbounds)(`taRecord`) is true, return +0_(𝔽).
6.  Let `offset` be `O`.`[[ByteOffset]]`.
7.  Return [𝔽](#𝔽)(`offset`).

#### 23.2.3.5 %TypedArray%.prototype.constructor

The initial value of [%TypedArray%](#sec-%typedarray%-intrinsic-object)`.prototype.constructor` is [%TypedArray%](#sec-%typedarray%-intrinsic-object).

#### 23.2.3.6 %TypedArray%.prototype.copyWithin ( `target`, `start` \[ , `end` \] )

The interpretation and use of the arguments of this method are the same as for `Array.prototype.copyWithin` as defined in [23.1.3.4](#sec-array.prototype.copywithin).

This method performs the following steps when called:

1.  Let `O` be the this value.
2.  Let `taRecord` be ? [ValidateTypedArray](#sec-validatetypedarray)(`O`, seq-cst).
3.  Let `len` be [TypedArrayLength](#sec-typedarraylength)(`taRecord`).
4.  Let `relativeTarget` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`target`).
5.  If `relativeTarget` = -∞, let `targetIndex` be 0.
6.  Else if `relativeTarget` \< 0, let `targetIndex` be [max](#eqn-max)(`len` + `relativeTarget`, 0).
7.  Else, let `targetIndex` be [min](#eqn-min)(`relativeTarget`, `len`).
8.  Let `relativeStart` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`start`).
9.  If `relativeStart` = -∞, let `startIndex` be 0.
10. Else if `relativeStart` \< 0, let `startIndex` be [max](#eqn-max)(`len` + `relativeStart`, 0).
11. Else, let `startIndex` be [min](#eqn-min)(`relativeStart`, `len`).
12. If `end` is undefined, let `relativeEnd` be `len`; else let `relativeEnd` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`end`).
13. If `relativeEnd` = -∞, let `endIndex` be 0.
14. Else if `relativeEnd` \< 0, let `endIndex` be [max](#eqn-max)(`len` + `relativeEnd`, 0).
15. Else, let `endIndex` be [min](#eqn-min)(`relativeEnd`, `len`).
16. Let `count` be [min](#eqn-min)(`endIndex` - `startIndex`, `len` - `targetIndex`).
17. If `count` \> 0, then
    1.  NOTE: The copying must be performed in a manner that preserves the bit-level encoding of the source data.
    2.  Let `buffer` be `O`.`[[ViewedArrayBuffer]]`.
    3.  Set `taRecord` to [MakeTypedArrayWithBufferWitnessRecord](#sec-maketypedarraywithbufferwitnessrecord)(`O`, seq-cst).
    4.  If [IsTypedArrayOutOfBounds](#sec-istypedarrayoutofbounds)(`taRecord`) is true, throw a TypeError exception.
    5.  Set `len` to [TypedArrayLength](#sec-typedarraylength)(`taRecord`).
    6.  Let `elementSize` be [TypedArrayElementSize](#sec-typedarrayelementsize)(`O`).
    7.  Let `byteOffset` be `O`.`[[ByteOffset]]`.
    8.  Let `bufferByteLimit` be (`len` × `elementSize`) + `byteOffset`.
    9.  Let `toByteIndex` be (`targetIndex` × `elementSize`) + `byteOffset`.
    10. Let `fromByteIndex` be (`startIndex` × `elementSize`) + `byteOffset`.
    11. Let `countBytes` be `count` × `elementSize`.
    12. If `fromByteIndex` \< `toByteIndex` and `toByteIndex` \< `fromByteIndex` + `countBytes`, then
        1.  Let `direction` be -1.
        2.  Set `fromByteIndex` to `fromByteIndex` + `countBytes` - 1.
        3.  Set `toByteIndex` to `toByteIndex` + `countBytes` - 1.
    13. Else,
        1.  Let `direction` be 1.
    14. Repeat, while `countBytes` \> 0,
        1.  If `fromByteIndex` \< `bufferByteLimit` and `toByteIndex` \< `bufferByteLimit`, then
            1.  Let `value` be [GetValueFromBuffer](#sec-getvaluefrombuffer)(`buffer`, `fromByteIndex`, uint8, true, unordered).
            2.  Perform [SetValueInBuffer](#sec-setvalueinbuffer)(`buffer`, `toByteIndex`, uint8, `value`, true, unordered).
            3.  Set `fromByteIndex` to `fromByteIndex` + `direction`.
            4.  Set `toByteIndex` to `toByteIndex` + `direction`.
            5.  Set `countBytes` to `countBytes` - 1.
        2.  Else,
            1.  Set `countBytes` to 0.
18. Return `O`.

#### 23.2.3.7 %TypedArray%.prototype.entries ( )

This method performs the following steps when called:

1.  Let `O` be the this value.
2.  Perform ? [ValidateTypedArray](#sec-validatetypedarray)(`O`, seq-cst).
3.  Return [CreateArrayIterator](#sec-createarrayiterator)(`O`, key+value).

#### 23.2.3.8 %TypedArray%.prototype.every ( `callback` \[ , `thisArg` \] )

The interpretation and use of the arguments of this method are the same as for `Array.prototype.every` as defined in [23.1.3.6](#sec-array.prototype.every).

This method performs the following steps when called:

1.  Let `O` be the this value.
2.  Let `taRecord` be ? [ValidateTypedArray](#sec-validatetypedarray)(`O`, seq-cst).
3.  Let `len` be [TypedArrayLength](#sec-typedarraylength)(`taRecord`).
4.  If [IsCallable](#sec-iscallable)(`callback`) is false, throw a TypeError exception.
5.  Let `k` be 0.
6.  Repeat, while `k` \< `len`,
    1.  Let `Pk` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k`)).
    2.  Let `kValue` be ! [Get](#sec-get-o-p)(`O`, `Pk`).
    3.  Let `testResult` be [ToBoolean](#sec-toboolean)(? [Call](#sec-call)(`callback`, `thisArg`, « `kValue`, [𝔽](#𝔽)(`k`), `O` »)).
    4.  If `testResult` is false, return false.
    5.  Set `k` to `k` + 1.
7.  Return true.

This method is not generic. The this value must be an object with a `[[TypedArrayName]]` internal slot.

#### 23.2.3.9 %TypedArray%.prototype.fill ( `value` \[ , `start` \[ , `end` \] \] )

The interpretation and use of the arguments of this method are the same as for `Array.prototype.fill` as defined in [23.1.3.7](#sec-array.prototype.fill).

This method performs the following steps when called:

1.  Let `O` be the this value.
2.  Let `taRecord` be ? [ValidateTypedArray](#sec-validatetypedarray)(`O`, seq-cst).
3.  Let `len` be [TypedArrayLength](#sec-typedarraylength)(`taRecord`).
4.  If `O`.`[[ContentType]]` is bigint, set `value` to ? [ToBigInt](#sec-tobigint)(`value`).
5.  Otherwise, set `value` to ? [ToNumber](#sec-tonumber)(`value`).
6.  Let `relativeStart` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`start`).
7.  If `relativeStart` = -∞, let `startIndex` be 0.
8.  Else if `relativeStart` \< 0, let `startIndex` be [max](#eqn-max)(`len` + `relativeStart`, 0).
9.  Else, let `startIndex` be [min](#eqn-min)(`relativeStart`, `len`).
10. If `end` is undefined, let `relativeEnd` be `len`; else let `relativeEnd` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`end`).
11. If `relativeEnd` = -∞, let `endIndex` be 0.
12. Else if `relativeEnd` \< 0, let `endIndex` be [max](#eqn-max)(`len` + `relativeEnd`, 0).
13. Else, let `endIndex` be [min](#eqn-min)(`relativeEnd`, `len`).
14. Set `taRecord` to [MakeTypedArrayWithBufferWitnessRecord](#sec-maketypedarraywithbufferwitnessrecord)(`O`, seq-cst).
15. If [IsTypedArrayOutOfBounds](#sec-istypedarrayoutofbounds)(`taRecord`) is true, throw a TypeError exception.
16. Set `len` to [TypedArrayLength](#sec-typedarraylength)(`taRecord`).
17. Set `endIndex` to [min](#eqn-min)(`endIndex`, `len`).
18. Let `k` be `startIndex`.
19. Repeat, while `k` \< `endIndex`,
    1.  Let `Pk` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k`)).
    2.  Perform ! [Set](#sec-set-o-p-v-throw)(`O`, `Pk`, `value`, true).
    3.  Set `k` to `k` + 1.
20. Return `O`.

#### 23.2.3.10 %TypedArray%.prototype.filter ( `callback` \[ , `thisArg` \] )

The interpretation and use of the arguments of this method are the same as for `Array.prototype.filter` as defined in [23.1.3.8](#sec-array.prototype.filter).

This method performs the following steps when called:

1.  Let `O` be the this value.
2.  Let `taRecord` be ? [ValidateTypedArray](#sec-validatetypedarray)(`O`, seq-cst).
3.  Let `len` be [TypedArrayLength](#sec-typedarraylength)(`taRecord`).
4.  If [IsCallable](#sec-iscallable)(`callback`) is false, throw a TypeError exception.
5.  Let `kept` be a new empty [List](#sec-list-and-record-specification-type).
6.  Let `captured` be 0.
7.  Let `k` be 0.
8.  Repeat, while `k` \< `len`,
    1.  Let `Pk` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k`)).
    2.  Let `kValue` be ! [Get](#sec-get-o-p)(`O`, `Pk`).
    3.  Let `selected` be [ToBoolean](#sec-toboolean)(? [Call](#sec-call)(`callback`, `thisArg`, « `kValue`, [𝔽](#𝔽)(`k`), `O` »)).
    4.  If `selected` is true, then
        1.  Append `kValue` to `kept`.
        2.  Set `captured` to `captured` + 1.
    5.  Set `k` to `k` + 1.
9.  Let `A` be ? [TypedArraySpeciesCreate](#typedarray-species-create)(`O`, « [𝔽](#𝔽)(`captured`) »).
10. Let `n` be 0.
11. For each element `e` of `kept`, do
    1.  Perform ! [Set](#sec-set-o-p-v-throw)(`A`, ! [ToString](#sec-tostring)([𝔽](#𝔽)(`n`)), `e`, true).
    2.  Set `n` to `n` + 1.
12. Return `A`.

This method is not generic. The this value must be an object with a `[[TypedArrayName]]` internal slot.

#### 23.2.3.11 %TypedArray%.prototype.find ( `predicate` \[ , `thisArg` \] )

The interpretation and use of the arguments of this method are the same as for `Array.prototype.find` as defined in [23.1.3.9](#sec-array.prototype.find).

This method performs the following steps when called:

1.  Let `O` be the this value.
2.  Let `taRecord` be ? [ValidateTypedArray](#sec-validatetypedarray)(`O`, seq-cst).
3.  Let `len` be [TypedArrayLength](#sec-typedarraylength)(`taRecord`).
4.  Let `findRec` be ? [FindViaPredicate](#sec-findviapredicate)(`O`, `len`, ascending, `predicate`, `thisArg`).
5.  Return `findRec`.`[[Value]]`.

This method is not generic. The this value must be an object with a `[[TypedArrayName]]` internal slot.

#### 23.2.3.12 %TypedArray%.prototype.findIndex ( `predicate` \[ , `thisArg` \] )

The interpretation and use of the arguments of this method are the same as for `Array.prototype.findIndex` as defined in [23.1.3.10](#sec-array.prototype.findindex).

This method performs the following steps when called:

1.  Let `O` be the this value.
2.  Let `taRecord` be ? [ValidateTypedArray](#sec-validatetypedarray)(`O`, seq-cst).
3.  Let `len` be [TypedArrayLength](#sec-typedarraylength)(`taRecord`).
4.  Let `findRec` be ? [FindViaPredicate](#sec-findviapredicate)(`O`, `len`, ascending, `predicate`, `thisArg`).
5.  Return `findRec`.`[[Index]]`.

This method is not generic. The this value must be an object with a `[[TypedArrayName]]` internal slot.

#### 23.2.3.13 %TypedArray%.prototype.findLast ( `predicate` \[ , `thisArg` \] )

The interpretation and use of the arguments of this method are the same as for `Array.prototype.findLast` as defined in [23.1.3.11](#sec-array.prototype.findlast).

This method performs the following steps when called:

1.  Let `O` be the this value.
2.  Let `taRecord` be ? [ValidateTypedArray](#sec-validatetypedarray)(`O`, seq-cst).
3.  Let `len` be [TypedArrayLength](#sec-typedarraylength)(`taRecord`).
4.  Let `findRec` be ? [FindViaPredicate](#sec-findviapredicate)(`O`, `len`, descending, `predicate`, `thisArg`).
5.  Return `findRec`.`[[Value]]`.

This method is not generic. The this value must be an object with a `[[TypedArrayName]]` internal slot.

#### 23.2.3.14 %TypedArray%.prototype.findLastIndex ( `predicate` \[ , `thisArg` \] )

The interpretation and use of the arguments of this method are the same as for `Array.prototype.findLastIndex` as defined in [23.1.3.12](#sec-array.prototype.findlastindex).

This method performs the following steps when called:

1.  Let `O` be the this value.
2.  Let `taRecord` be ? [ValidateTypedArray](#sec-validatetypedarray)(`O`, seq-cst).
3.  Let `len` be [TypedArrayLength](#sec-typedarraylength)(`taRecord`).
4.  Let `findRec` be ? [FindViaPredicate](#sec-findviapredicate)(`O`, `len`, descending, `predicate`, `thisArg`).
5.  Return `findRec`.`[[Index]]`.

This method is not generic. The this value must be an object with a `[[TypedArrayName]]` internal slot.

#### 23.2.3.15 %TypedArray%.prototype.forEach ( `callback` \[ , `thisArg` \] )

The interpretation and use of the arguments of this method are the same as for `Array.prototype.forEach` as defined in [23.1.3.15](#sec-array.prototype.foreach).

This method performs the following steps when called:

1.  Let `O` be the this value.
2.  Let `taRecord` be ? [ValidateTypedArray](#sec-validatetypedarray)(`O`, seq-cst).
3.  Let `len` be [TypedArrayLength](#sec-typedarraylength)(`taRecord`).
4.  If [IsCallable](#sec-iscallable)(`callback`) is false, throw a TypeError exception.
5.  Let `k` be 0.
6.  Repeat, while `k` \< `len`,
    1.  Let `Pk` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k`)).
    2.  Let `kValue` be ! [Get](#sec-get-o-p)(`O`, `Pk`).
    3.  Perform ? [Call](#sec-call)(`callback`, `thisArg`, « `kValue`, [𝔽](#𝔽)(`k`), `O` »).
    4.  Set `k` to `k` + 1.
7.  Return undefined.

This method is not generic. The this value must be an object with a `[[TypedArrayName]]` internal slot.

#### 23.2.3.16 %TypedArray%.prototype.includes ( `searchElement` \[ , `fromIndex` \] )

The interpretation and use of the arguments of this method are the same as for `Array.prototype.includes` as defined in [23.1.3.16](#sec-array.prototype.includes).

This method performs the following steps when called:

1.  Let `O` be the this value.
2.  Let `taRecord` be ? [ValidateTypedArray](#sec-validatetypedarray)(`O`, seq-cst).
3.  Let `len` be [TypedArrayLength](#sec-typedarraylength)(`taRecord`).
4.  If `len` = 0, return false.
5.  Let `n` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`fromIndex`).
6.  [Assert](#assert): If `fromIndex` is undefined, then `n` is 0.
7.  If `n` = +∞, return false.
8.  Else if `n` = -∞, set `n` to 0.
9.  If `n` ≥ 0, then
    1.  Let `k` be `n`.
10. Else,
    1.  Let `k` be `len` + `n`.
    2.  If `k` \< 0, set `k` to 0.
11. Repeat, while `k` \< `len`,
    1.  Let `elementK` be ! [Get](#sec-get-o-p)(`O`, ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k`))).
    2.  If [SameValueZero](#sec-samevaluezero)(`searchElement`, `elementK`) is true, return true.
    3.  Set `k` to `k` + 1.
12. Return false.

This method is not generic. The this value must be an object with a `[[TypedArrayName]]` internal slot.

#### 23.2.3.17 %TypedArray%.prototype.indexOf ( `searchElement` \[ , `fromIndex` \] )

The interpretation and use of the arguments of this method are the same as for `Array.prototype.indexOf` as defined in [23.1.3.17](#sec-array.prototype.indexof).

This method performs the following steps when called:

1.  Let `O` be the this value.
2.  Let `taRecord` be ? [ValidateTypedArray](#sec-validatetypedarray)(`O`, seq-cst).
3.  Let `len` be [TypedArrayLength](#sec-typedarraylength)(`taRecord`).
4.  If `len` = 0, return -1_(𝔽).
5.  Let `n` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`fromIndex`).
6.  [Assert](#assert): If `fromIndex` is undefined, then `n` is 0.
7.  If `n` = +∞, return -1_(𝔽).
8.  Else if `n` = -∞, set `n` to 0.
9.  If `n` ≥ 0, then
    1.  Let `k` be `n`.
10. Else,
    1.  Let `k` be `len` + `n`.
    2.  If `k` \< 0, set `k` to 0.
11. Repeat, while `k` \< `len`,
    1.  Let `Pk` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k`)).
    2.  Let `kPresent` be ! [HasProperty](#sec-hasproperty)(`O`, `Pk`).
    3.  If `kPresent` is true, then
        1.  Let `elementK` be ! [Get](#sec-get-o-p)(`O`, `Pk`).
        2.  If [IsStrictlyEqual](#sec-isstrictlyequal)(`searchElement`, `elementK`) is true, return [𝔽](#𝔽)(`k`).
    4.  Set `k` to `k` + 1.
12. Return -1_(𝔽).

This method is not generic. The this value must be an object with a `[[TypedArrayName]]` internal slot.

#### 23.2.3.18 %TypedArray%.prototype.join ( `separator` )

The interpretation and use of the arguments of this method are the same as for `Array.prototype.join` as defined in [23.1.3.18](#sec-array.prototype.join).

This method performs the following steps when called:

1.  Let `O` be the this value.
2.  Let `taRecord` be ? [ValidateTypedArray](#sec-validatetypedarray)(`O`, seq-cst).
3.  Let `len` be [TypedArrayLength](#sec-typedarraylength)(`taRecord`).
4.  If `separator` is undefined, let `sep` be ",".
5.  Else, let `sep` be ? [ToString](#sec-tostring)(`separator`).
6.  Let `R` be the empty String.
7.  Let `k` be 0.
8.  Repeat, while `k` \< `len`,
    1.  If `k` \> 0, set `R` to the [string-concatenation](#string-concatenation) of `R` and `sep`.
    2.  Let `element` be ! [Get](#sec-get-o-p)(`O`, ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k`))).
    3.  If `element` is not undefined, then
        1.  Let `S` be ! [ToString](#sec-tostring)(`element`).
        2.  Set `R` to the [string-concatenation](#string-concatenation) of `R` and `S`.
    4.  Set `k` to `k` + 1.
9.  Return `R`.

This method is not generic. The this value must be an object with a `[[TypedArrayName]]` internal slot.

#### 23.2.3.19 %TypedArray%.prototype.keys ( )

This method performs the following steps when called:

1.  Let `O` be the this value.
2.  Perform ? [ValidateTypedArray](#sec-validatetypedarray)(`O`, seq-cst).
3.  Return [CreateArrayIterator](#sec-createarrayiterator)(`O`, key).

#### 23.2.3.20 %TypedArray%.prototype.lastIndexOf ( `searchElement` \[ , `fromIndex` \] )

The interpretation and use of the arguments of this method are the same as for `Array.prototype.lastIndexOf` as defined in [23.1.3.20](#sec-array.prototype.lastindexof).

This method performs the following steps when called:

1.  Let `O` be the this value.
2.  Let `taRecord` be ? [ValidateTypedArray](#sec-validatetypedarray)(`O`, seq-cst).
3.  Let `len` be [TypedArrayLength](#sec-typedarraylength)(`taRecord`).
4.  If `len` = 0, return -1_(𝔽).
5.  If `fromIndex` is present, let `n` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`fromIndex`); else let `n` be `len` - 1.
6.  If `n` = -∞, return -1_(𝔽).
7.  If `n` ≥ 0, then
    1.  Let `k` be [min](#eqn-min)(`n`, `len` - 1).
8.  Else,
    1.  Let `k` be `len` + `n`.
9.  Repeat, while `k` ≥ 0,
    1.  Let `Pk` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k`)).
    2.  Let `kPresent` be ! [HasProperty](#sec-hasproperty)(`O`, `Pk`).
    3.  If `kPresent` is true, then
        1.  Let `elementK` be ! [Get](#sec-get-o-p)(`O`, `Pk`).
        2.  If [IsStrictlyEqual](#sec-isstrictlyequal)(`searchElement`, `elementK`) is true, return [𝔽](#𝔽)(`k`).
    4.  Set `k` to `k` - 1.
10. Return -1_(𝔽).

This method is not generic. The this value must be an object with a `[[TypedArrayName]]` internal slot.

#### 23.2.3.21 get %TypedArray%.prototype.length

[%TypedArray%](#sec-%typedarray%-intrinsic-object)`.prototype.length` is an [accessor property](#sec-object-type) whose set accessor function is undefined. Its get accessor function performs the following steps when called:

1.  Let `O` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`O`, `[[TypedArrayName]]`).
3.  [Assert](#assert): `O` has `[[ViewedArrayBuffer]]` and `[[ArrayLength]]` internal slots.
4.  Let `taRecord` be [MakeTypedArrayWithBufferWitnessRecord](#sec-maketypedarraywithbufferwitnessrecord)(`O`, seq-cst).
5.  If [IsTypedArrayOutOfBounds](#sec-istypedarrayoutofbounds)(`taRecord`) is true, return +0_(𝔽).
6.  Let `length` be [TypedArrayLength](#sec-typedarraylength)(`taRecord`).
7.  Return [𝔽](#𝔽)(`length`).

This function is not generic. The this value must be an object with a `[[TypedArrayName]]` internal slot.

#### 23.2.3.22 %TypedArray%.prototype.map ( `callback` \[ , `thisArg` \] )

The interpretation and use of the arguments of this method are the same as for `Array.prototype.map` as defined in [23.1.3.21](#sec-array.prototype.map).

This method performs the following steps when called:

1.  Let `O` be the this value.
2.  Let `taRecord` be ? [ValidateTypedArray](#sec-validatetypedarray)(`O`, seq-cst).
3.  Let `len` be [TypedArrayLength](#sec-typedarraylength)(`taRecord`).
4.  If [IsCallable](#sec-iscallable)(`callback`) is false, throw a TypeError exception.
5.  Let `A` be ? [TypedArraySpeciesCreate](#typedarray-species-create)(`O`, « [𝔽](#𝔽)(`len`) »).
6.  Let `k` be 0.
7.  Repeat, while `k` \< `len`,
    1.  Let `Pk` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k`)).
    2.  Let `kValue` be ! [Get](#sec-get-o-p)(`O`, `Pk`).
    3.  Let `mappedValue` be ? [Call](#sec-call)(`callback`, `thisArg`, « `kValue`, [𝔽](#𝔽)(`k`), `O` »).
    4.  Perform ? [Set](#sec-set-o-p-v-throw)(`A`, `Pk`, `mappedValue`, true).
    5.  Set `k` to `k` + 1.
8.  Return `A`.

This method is not generic. The this value must be an object with a `[[TypedArrayName]]` internal slot.

#### 23.2.3.23 %TypedArray%.prototype.reduce ( `callback` \[ , `initialValue` \] )

The interpretation and use of the arguments of this method are the same as for `Array.prototype.reduce` as defined in [23.1.3.24](#sec-array.prototype.reduce).

This method performs the following steps when called:

1.  Let `O` be the this value.
2.  Let `taRecord` be ? [ValidateTypedArray](#sec-validatetypedarray)(`O`, seq-cst).
3.  Let `len` be [TypedArrayLength](#sec-typedarraylength)(`taRecord`).
4.  If [IsCallable](#sec-iscallable)(`callback`) is false, throw a TypeError exception.
5.  If `len` = 0 and `initialValue` is not present, throw a TypeError exception.
6.  Let `k` be 0.
7.  Let `accumulator` be undefined.
8.  If `initialValue` is present, then
    1.  Set `accumulator` to `initialValue`.
9.  Else,
    1.  Let `Pk` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k`)).
    2.  Set `accumulator` to ! [Get](#sec-get-o-p)(`O`, `Pk`).
    3.  Set `k` to `k` + 1.
10. Repeat, while `k` \< `len`,
    1.  Let `Pk` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k`)).
    2.  Let `kValue` be ! [Get](#sec-get-o-p)(`O`, `Pk`).
    3.  Set `accumulator` to ? [Call](#sec-call)(`callback`, undefined, « `accumulator`, `kValue`, [𝔽](#𝔽)(`k`), `O` »).
    4.  Set `k` to `k` + 1.
11. Return `accumulator`.

This method is not generic. The this value must be an object with a `[[TypedArrayName]]` internal slot.

#### 23.2.3.24 %TypedArray%.prototype.reduceRight ( `callback` \[ , `initialValue` \] )

The interpretation and use of the arguments of this method are the same as for `Array.prototype.reduceRight` as defined in [23.1.3.25](#sec-array.prototype.reduceright).

This method performs the following steps when called:

1.  Let `O` be the this value.
2.  Let `taRecord` be ? [ValidateTypedArray](#sec-validatetypedarray)(`O`, seq-cst).
3.  Let `len` be [TypedArrayLength](#sec-typedarraylength)(`taRecord`).
4.  If [IsCallable](#sec-iscallable)(`callback`) is false, throw a TypeError exception.
5.  If `len` = 0 and `initialValue` is not present, throw a TypeError exception.
6.  Let `k` be `len` - 1.
7.  Let `accumulator` be undefined.
8.  If `initialValue` is present, then
    1.  Set `accumulator` to `initialValue`.
9.  Else,
    1.  Let `Pk` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k`)).
    2.  Set `accumulator` to ! [Get](#sec-get-o-p)(`O`, `Pk`).
    3.  Set `k` to `k` - 1.
10. Repeat, while `k` ≥ 0,
    1.  Let `Pk` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k`)).
    2.  Let `kValue` be ! [Get](#sec-get-o-p)(`O`, `Pk`).
    3.  Set `accumulator` to ? [Call](#sec-call)(`callback`, undefined, « `accumulator`, `kValue`, [𝔽](#𝔽)(`k`), `O` »).
    4.  Set `k` to `k` - 1.
11. Return `accumulator`.

This method is not generic. The this value must be an object with a `[[TypedArrayName]]` internal slot.

#### 23.2.3.25 %TypedArray%.prototype.reverse ( )

The interpretation and use of the arguments of this method are the same as for `Array.prototype.reverse` as defined in [23.1.3.26](#sec-array.prototype.reverse).

This method performs the following steps when called:

1.  Let `O` be the this value.
2.  Let `taRecord` be ? [ValidateTypedArray](#sec-validatetypedarray)(`O`, seq-cst).
3.  Let `len` be [TypedArrayLength](#sec-typedarraylength)(`taRecord`).
4.  Let `middle` be [floor](#eqn-floor)(`len` / 2).
5.  Let `lower` be 0.
6.  Repeat, while `lower` ≠ `middle`,
    1.  Let `upper` be `len` - `lower` - 1.
    2.  Let `upperP` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`upper`)).
    3.  Let `lowerP` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`lower`)).
    4.  Let `lowerValue` be ! [Get](#sec-get-o-p)(`O`, `lowerP`).
    5.  Let `upperValue` be ! [Get](#sec-get-o-p)(`O`, `upperP`).
    6.  Perform ! [Set](#sec-set-o-p-v-throw)(`O`, `lowerP`, `upperValue`, true).
    7.  Perform ! [Set](#sec-set-o-p-v-throw)(`O`, `upperP`, `lowerValue`, true).
    8.  Set `lower` to `lower` + 1.
7.  Return `O`.

This method is not generic. The this value must be an object with a `[[TypedArrayName]]` internal slot.

#### 23.2.3.26 %TypedArray%.prototype.set ( `source` \[ , `offset` \] )

This method sets multiple values in this `TypedArray`, reading the values from `source`. The details differ based upon the type of `source`. The optional `offset` value indicates the first element index in this `TypedArray` where values are written. If omitted, it is assumed to be 0.

It performs the following steps when called:

1.  Let `target` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`target`, `[[TypedArrayName]]`).
3.  [Assert](#assert): `target` has a `[[ViewedArrayBuffer]]` internal slot.
4.  Let `targetOffset` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`offset`).
5.  If `targetOffset` \< 0, throw a RangeError exception.
6.  If `source` [is an Object](#sec-object-type) that has a `[[TypedArrayName]]` internal slot, then
    1.  Perform ? [SetTypedArrayFromTypedArray](#sec-settypedarrayfromtypedarray)(`target`, `targetOffset`, `source`).
7.  Else,
    1.  Perform ? [SetTypedArrayFromArrayLike](#sec-settypedarrayfromarraylike)(`target`, `targetOffset`, `source`).
8.  Return undefined.

This method is not generic. The this value must be an object with a `[[TypedArrayName]]` internal slot.

##### 23.2.3.26.1 SetTypedArrayFromTypedArray ( `target`, `targetOffset`, `source` )

The abstract operation SetTypedArrayFromTypedArray takes arguments `target` (a [TypedArray](#typedarray)), `targetOffset` (a non-negative [integer](#integer) or +∞), and `source` (a [TypedArray](#typedarray)) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or a [throw completion](#sec-completion-record-specification-type). It sets multiple values in `target`, starting at index `targetOffset`, reading the values from `source`. It performs the following steps when called:

1.  Let `targetBuffer` be `target`.`[[ViewedArrayBuffer]]`.
2.  Let `targetRecord` be [MakeTypedArrayWithBufferWitnessRecord](#sec-maketypedarraywithbufferwitnessrecord)(`target`, seq-cst).
3.  If [IsTypedArrayOutOfBounds](#sec-istypedarrayoutofbounds)(`targetRecord`) is true, throw a TypeError exception.
4.  Let `targetLength` be [TypedArrayLength](#sec-typedarraylength)(`targetRecord`).
5.  Let `srcBuffer` be `source`.`[[ViewedArrayBuffer]]`.
6.  Let `srcRecord` be [MakeTypedArrayWithBufferWitnessRecord](#sec-maketypedarraywithbufferwitnessrecord)(`source`, seq-cst).
7.  If [IsTypedArrayOutOfBounds](#sec-istypedarrayoutofbounds)(`srcRecord`) is true, throw a TypeError exception.
8.  Let `srcLength` be [TypedArrayLength](#sec-typedarraylength)(`srcRecord`).
9.  Let `targetType` be [TypedArrayElementType](#sec-typedarrayelementtype)(`target`).
10. Let `targetElementSize` be [TypedArrayElementSize](#sec-typedarrayelementsize)(`target`).
11. Let `targetByteOffset` be `target`.`[[ByteOffset]]`.
12. Let `srcType` be [TypedArrayElementType](#sec-typedarrayelementtype)(`source`).
13. Let `srcElementSize` be [TypedArrayElementSize](#sec-typedarrayelementsize)(`source`).
14. Let `srcByteOffset` be `source`.`[[ByteOffset]]`.
15. If `targetOffset` = +∞, throw a RangeError exception.
16. If `srcLength` + `targetOffset` \> `targetLength`, throw a RangeError exception.
17. If `target`.`[[ContentType]]` is not `source`.`[[ContentType]]`, throw a TypeError exception.
18. If [IsSharedArrayBuffer](#sec-issharedarraybuffer)(`srcBuffer`) is true, [IsSharedArrayBuffer](#sec-issharedarraybuffer)(`targetBuffer`) is true, and `srcBuffer`.`[[ArrayBufferData]]` is `targetBuffer`.`[[ArrayBufferData]]`, let `sameSharedArrayBuffer` be true; otherwise, let `sameSharedArrayBuffer` be false.
19. If [SameValue](#sec-samevalue)(`srcBuffer`, `targetBuffer`) is true or `sameSharedArrayBuffer` is true, then
    1.  Let `srcByteLength` be [TypedArrayByteLength](#sec-typedarraybytelength)(`srcRecord`).
    2.  Set `srcBuffer` to ? [CloneArrayBuffer](#sec-clonearraybuffer)(`srcBuffer`, `srcByteOffset`, `srcByteLength`).
    3.  Let `srcByteIndex` be 0.
20. Else,
    1.  Let `srcByteIndex` be `srcByteOffset`.
21. Let `targetByteIndex` be (`targetOffset` × `targetElementSize`) + `targetByteOffset`.
22. Let `limit` be `targetByteIndex` + (`targetElementSize` × `srcLength`).
23. If `srcType` is `targetType`, then
    1.  NOTE: The transfer must be performed in a manner that preserves the bit-level encoding of the source data.
    2.  Repeat, while `targetByteIndex` \< `limit`,
        1.  Let `value` be [GetValueFromBuffer](#sec-getvaluefrombuffer)(`srcBuffer`, `srcByteIndex`, uint8, true, unordered).
        2.  Perform [SetValueInBuffer](#sec-setvalueinbuffer)(`targetBuffer`, `targetByteIndex`, uint8, `value`, true, unordered).
        3.  Set `srcByteIndex` to `srcByteIndex` + 1.
        4.  Set `targetByteIndex` to `targetByteIndex` + 1.
24. Else,
    1.  Repeat, while `targetByteIndex` \< `limit`,
        1.  Let `value` be [GetValueFromBuffer](#sec-getvaluefrombuffer)(`srcBuffer`, `srcByteIndex`, `srcType`, true, unordered).
        2.  Perform [SetValueInBuffer](#sec-setvalueinbuffer)(`targetBuffer`, `targetByteIndex`, `targetType`, `value`, true, unordered).
        3.  Set `srcByteIndex` to `srcByteIndex` + `srcElementSize`.
        4.  Set `targetByteIndex` to `targetByteIndex` + `targetElementSize`.
25. Return unused.

##### 23.2.3.26.2 SetTypedArrayFromArrayLike ( `target`, `targetOffset`, `source` )

The abstract operation SetTypedArrayFromArrayLike takes arguments `target` (a [TypedArray](#typedarray)), `targetOffset` (a non-negative [integer](#integer) or +∞), and `source` (an [ECMAScript language value](#sec-ecmascript-language-types), but not a [TypedArray](#typedarray)) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or a [throw completion](#sec-completion-record-specification-type). It sets multiple values in `target`, starting at index `targetOffset`, reading the values from `source`. It performs the following steps when called:

1.  Let `targetRecord` be [MakeTypedArrayWithBufferWitnessRecord](#sec-maketypedarraywithbufferwitnessrecord)(`target`, seq-cst).
2.  If [IsTypedArrayOutOfBounds](#sec-istypedarrayoutofbounds)(`targetRecord`) is true, throw a TypeError exception.
3.  Let `targetLength` be [TypedArrayLength](#sec-typedarraylength)(`targetRecord`).
4.  Let `src` be ? [ToObject](#sec-toobject)(`source`).
5.  Let `srcLength` be ? [LengthOfArrayLike](#sec-lengthofarraylike)(`src`).
6.  If `targetOffset` = +∞, throw a RangeError exception.
7.  If `srcLength` + `targetOffset` \> `targetLength`, throw a RangeError exception.
8.  Let `k` be 0.
9.  Repeat, while `k` \< `srcLength`,
    1.  Let `Pk` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k`)).
    2.  Let `value` be ? [Get](#sec-get-o-p)(`src`, `Pk`).
    3.  Let `targetIndex` be [𝔽](#𝔽)(`targetOffset` + `k`).
    4.  Perform ? [TypedArraySetElement](#sec-typedarraysetelement)(`target`, `targetIndex`, `value`).
    5.  Set `k` to `k` + 1.
10. Return unused.

#### 23.2.3.27 %TypedArray%.prototype.slice ( `start`, `end` )

The interpretation and use of the arguments of this method are the same as for `Array.prototype.slice` as defined in [23.1.3.28](#sec-array.prototype.slice).

This method performs the following steps when called:

1.  Let `O` be the this value.
2.  Let `taRecord` be ? [ValidateTypedArray](#sec-validatetypedarray)(`O`, seq-cst).
3.  Let `srcArrayLength` be [TypedArrayLength](#sec-typedarraylength)(`taRecord`).
4.  Let `relativeStart` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`start`).
5.  If `relativeStart` = -∞, let `startIndex` be 0.
6.  Else if `relativeStart` \< 0, let `startIndex` be [max](#eqn-max)(`srcArrayLength` + `relativeStart`, 0).
7.  Else, let `startIndex` be [min](#eqn-min)(`relativeStart`, `srcArrayLength`).
8.  If `end` is undefined, let `relativeEnd` be `srcArrayLength`; else let `relativeEnd` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`end`).
9.  If `relativeEnd` = -∞, let `endIndex` be 0.
10. Else if `relativeEnd` \< 0, let `endIndex` be [max](#eqn-max)(`srcArrayLength` + `relativeEnd`, 0).
11. Else, let `endIndex` be [min](#eqn-min)(`relativeEnd`, `srcArrayLength`).
12. Let `countBytes` be [max](#eqn-max)(`endIndex` - `startIndex`, 0).
13. Let `A` be ? [TypedArraySpeciesCreate](#typedarray-species-create)(`O`, « [𝔽](#𝔽)(`countBytes`) »).
14. If `countBytes` \> 0, then
    1.  Set `taRecord` to [MakeTypedArrayWithBufferWitnessRecord](#sec-maketypedarraywithbufferwitnessrecord)(`O`, seq-cst).
    2.  If [IsTypedArrayOutOfBounds](#sec-istypedarrayoutofbounds)(`taRecord`) is true, throw a TypeError exception.
    3.  Set `endIndex` to [min](#eqn-min)(`endIndex`, [TypedArrayLength](#sec-typedarraylength)(`taRecord`)).
    4.  Set `countBytes` to [max](#eqn-max)(`endIndex` - `startIndex`, 0).
    5.  Let `srcType` be [TypedArrayElementType](#sec-typedarrayelementtype)(`O`).
    6.  Let `targetType` be [TypedArrayElementType](#sec-typedarrayelementtype)(`A`).
    7.  If `srcType` is `targetType`, then
        1.  NOTE: The transfer must be performed in a manner that preserves the bit-level encoding of the source data.
        2.  Let `srcBuffer` be `O`.`[[ViewedArrayBuffer]]`.
        3.  Let `targetBuffer` be `A`.`[[ViewedArrayBuffer]]`.
        4.  Let `elementSize` be [TypedArrayElementSize](#sec-typedarrayelementsize)(`O`).
        5.  Let `srcByteOffset` be `O`.`[[ByteOffset]]`.
        6.  Let `srcByteIndex` be (`startIndex` × `elementSize`) + `srcByteOffset`.
        7.  Let `targetByteIndex` be `A`.`[[ByteOffset]]`.
        8.  Let `endByteIndex` be `targetByteIndex` + (`countBytes` × `elementSize`).
        9.  Repeat, while `targetByteIndex` \< `endByteIndex`,
            1.  Let `value` be [GetValueFromBuffer](#sec-getvaluefrombuffer)(`srcBuffer`, `srcByteIndex`, uint8, true, unordered).
            2.  Perform [SetValueInBuffer](#sec-setvalueinbuffer)(`targetBuffer`, `targetByteIndex`, uint8, `value`, true, unordered).
            3.  Set `srcByteIndex` to `srcByteIndex` + 1.
            4.  Set `targetByteIndex` to `targetByteIndex` + 1.
    8.  Else,
        1.  Let `n` be 0.
        2.  Let `k` be `startIndex`.
        3.  Repeat, while `k` \< `endIndex`,
            1.  Let `Pk` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k`)).
            2.  Let `kValue` be ! [Get](#sec-get-o-p)(`O`, `Pk`).
            3.  Perform ! [Set](#sec-set-o-p-v-throw)(`A`, ! [ToString](#sec-tostring)([𝔽](#𝔽)(`n`)), `kValue`, true).
            4.  Set `k` to `k` + 1.
            5.  Set `n` to `n` + 1.
15. Return `A`.

This method is not generic. The this value must be an object with a `[[TypedArrayName]]` internal slot.

#### 23.2.3.28 %TypedArray%.prototype.some ( `callback` \[ , `thisArg` \] )

The interpretation and use of the arguments of this method are the same as for `Array.prototype.some` as defined in [23.1.3.29](#sec-array.prototype.some).

This method performs the following steps when called:

1.  Let `O` be the this value.
2.  Let `taRecord` be ? [ValidateTypedArray](#sec-validatetypedarray)(`O`, seq-cst).
3.  Let `len` be [TypedArrayLength](#sec-typedarraylength)(`taRecord`).
4.  If [IsCallable](#sec-iscallable)(`callback`) is false, throw a TypeError exception.
5.  Let `k` be 0.
6.  Repeat, while `k` \< `len`,
    1.  Let `Pk` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k`)).
    2.  Let `kValue` be ! [Get](#sec-get-o-p)(`O`, `Pk`).
    3.  Let `testResult` be [ToBoolean](#sec-toboolean)(? [Call](#sec-call)(`callback`, `thisArg`, « `kValue`, [𝔽](#𝔽)(`k`), `O` »)).
    4.  If `testResult` is true, return true.
    5.  Set `k` to `k` + 1.
7.  Return false.

This method is not generic. The this value must be an object with a `[[TypedArrayName]]` internal slot.

#### 23.2.3.29 %TypedArray%.prototype.sort ( `comparator` )

This is a distinct method that, except as described below, implements the same requirements as those of `Array.prototype.sort` as defined in [23.1.3.30](#sec-array.prototype.sort). The implementation of this method may be optimized with the knowledge that the this value is an object that has a fixed length and whose [integer-indexed](#integer-index) properties are not sparse.

This method is not generic. The this value must be an object with a `[[TypedArrayName]]` internal slot.

It performs the following steps when called:

1.  If `comparator` is not undefined and [IsCallable](#sec-iscallable)(`comparator`) is false, throw a TypeError exception.
2.  Let `obj` be the this value.
3.  Let `taRecord` be ? [ValidateTypedArray](#sec-validatetypedarray)(`obj`, seq-cst).
4.  Let `len` be [TypedArrayLength](#sec-typedarraylength)(`taRecord`).
5.  NOTE: The following closure performs a numeric comparison rather than the string comparison used in [23.1.3.30](#sec-array.prototype.sort).
6.  Let `SortCompare` be a new [Abstract Closure](#sec-abstract-closure) with parameters (`x`, `y`) that captures `comparator` and performs the following steps when called:
    1.  Return ? [CompareTypedArrayElements](#sec-comparetypedarrayelements)(`x`, `y`, `comparator`).
7.  Let `sortedList` be ? [SortIndexedProperties](#sec-sortindexedproperties)(`obj`, `len`, `SortCompare`, read-through-holes).
8.  Let `j` be 0.
9.  Repeat, while `j` \< `len`,
    1.  Perform ! [Set](#sec-set-o-p-v-throw)(`obj`, ! [ToString](#sec-tostring)([𝔽](#𝔽)(`j`)), `sortedList`\[`j`\], true).
    2.  Set `j` to `j` + 1.
10. Return `obj`.

Note

Because NaN always compares greater than any other value (see [CompareTypedArrayElements](#sec-comparetypedarrayelements)), NaN property values always sort to the end of the result when `comparator` is not provided.

#### 23.2.3.30 %TypedArray%.prototype.subarray ( `start`, `end` )

This method returns a new `TypedArray` whose element type is the element type of this `TypedArray` and whose ArrayBuffer is the ArrayBuffer of this `TypedArray`, referencing the elements in the [interval](#interval) from `start` (inclusive) to `end` (exclusive). If either `start` or `end` is negative, it refers to an index from the end of the array, as opposed to from the beginning.

It performs the following steps when called:

1.  Let `O` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`O`, `[[TypedArrayName]]`).
3.  [Assert](#assert): `O` has a `[[ViewedArrayBuffer]]` internal slot.
4.  Let `buffer` be `O`.`[[ViewedArrayBuffer]]`.
5.  Let `srcRecord` be [MakeTypedArrayWithBufferWitnessRecord](#sec-maketypedarraywithbufferwitnessrecord)(`O`, seq-cst).
6.  If [IsTypedArrayOutOfBounds](#sec-istypedarrayoutofbounds)(`srcRecord`) is true, then
    1.  Let `srcLength` be 0.
7.  Else,
    1.  Let `srcLength` be [TypedArrayLength](#sec-typedarraylength)(`srcRecord`).
8.  Let `relativeStart` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`start`).
9.  If `relativeStart` = -∞, let `startIndex` be 0.
10. Else if `relativeStart` \< 0, let `startIndex` be [max](#eqn-max)(`srcLength` + `relativeStart`, 0).
11. Else, let `startIndex` be [min](#eqn-min)(`relativeStart`, `srcLength`).
12. Let `elementSize` be [TypedArrayElementSize](#sec-typedarrayelementsize)(`O`).
13. Let `srcByteOffset` be `O`.`[[ByteOffset]]`.
14. Let `beginByteOffset` be `srcByteOffset` + (`startIndex` × `elementSize`).
15. If `O`.`[[ArrayLength]]` is auto and `end` is undefined, then
    1.  Let `argumentsList` be « `buffer`, [𝔽](#𝔽)(`beginByteOffset`) ».
16. Else,
    1.  If `end` is undefined, let `relativeEnd` be `srcLength`; else let `relativeEnd` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`end`).
    2.  If `relativeEnd` = -∞, let `endIndex` be 0.
    3.  Else if `relativeEnd` \< 0, let `endIndex` be [max](#eqn-max)(`srcLength` + `relativeEnd`, 0).
    4.  Else, let `endIndex` be [min](#eqn-min)(`relativeEnd`, `srcLength`).
    5.  Let `newLength` be [max](#eqn-max)(`endIndex` - `startIndex`, 0).
    6.  Let `argumentsList` be « `buffer`, [𝔽](#𝔽)(`beginByteOffset`), [𝔽](#𝔽)(`newLength`) ».
17. Return ? [TypedArraySpeciesCreate](#typedarray-species-create)(`O`, `argumentsList`).

This method is not generic. The this value must be an object with a `[[TypedArrayName]]` internal slot.

#### 23.2.3.31 %TypedArray%.prototype.toLocaleString ( \[ `reserved1` \[ , `reserved2` \] \] )

This is a distinct method that implements the same algorithm as `Array.prototype.toLocaleString` as defined in [23.1.3.32](#sec-array.prototype.tolocalestring) except that [TypedArrayLength](#sec-typedarraylength) is called in place of performing a `[[Get]]` of "length". The implementation of the algorithm may be optimized with the knowledge that the this value has a fixed length when the underlying buffer is not resizable and whose [integer-indexed](#integer-index) properties are not sparse. However, such optimization must not introduce any observable changes in the specified behaviour of the algorithm.

This method is not generic. [ValidateTypedArray](#sec-validatetypedarray) is called with the this value and seq-cst as arguments prior to evaluating the algorithm. If its result is an [abrupt completion](#sec-completion-record-specification-type) that exception is thrown instead of evaluating the algorithm.

Note

If the ECMAScript implementation includes the ECMA-402 Internationalization API this method is based upon the algorithm for `Array.prototype.toLocaleString` that is in the ECMA-402 specification.

#### 23.2.3.32 %TypedArray%.prototype.toReversed ( )

This method performs the following steps when called:

1.  Let `O` be the this value.
2.  Let `taRecord` be ? [ValidateTypedArray](#sec-validatetypedarray)(`O`, seq-cst).
3.  Let `length` be [TypedArrayLength](#sec-typedarraylength)(`taRecord`).
4.  Let `A` be ? [TypedArrayCreateSameType](#sec-typedarray-create-same-type)(`O`, « [𝔽](#𝔽)(`length`) »).
5.  Let `k` be 0.
6.  Repeat, while `k` \< `length`,
    1.  Let `from` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`length` - `k` - 1)).
    2.  Let `Pk` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k`)).
    3.  Let `fromValue` be ! [Get](#sec-get-o-p)(`O`, `from`).
    4.  Perform ! [Set](#sec-set-o-p-v-throw)(`A`, `Pk`, `fromValue`, true).
    5.  Set `k` to `k` + 1.
7.  Return `A`.

#### 23.2.3.33 %TypedArray%.prototype.toSorted ( `comparator` )

This method performs the following steps when called:

1.  If `comparator` is not undefined and [IsCallable](#sec-iscallable)(`comparator`) is false, throw a TypeError exception.
2.  Let `O` be the this value.
3.  Let `taRecord` be ? [ValidateTypedArray](#sec-validatetypedarray)(`O`, seq-cst).
4.  Let `len` be [TypedArrayLength](#sec-typedarraylength)(`taRecord`).
5.  Let `A` be ? [TypedArrayCreateSameType](#sec-typedarray-create-same-type)(`O`, « [𝔽](#𝔽)(`len`) »).
6.  NOTE: The following closure performs a numeric comparison rather than the string comparison used in [23.1.3.34](#sec-array.prototype.tosorted).
7.  Let `SortCompare` be a new [Abstract Closure](#sec-abstract-closure) with parameters (`x`, `y`) that captures `comparator` and performs the following steps when called:
    1.  Return ? [CompareTypedArrayElements](#sec-comparetypedarrayelements)(`x`, `y`, `comparator`).
8.  Let `sortedList` be ? [SortIndexedProperties](#sec-sortindexedproperties)(`O`, `len`, `SortCompare`, read-through-holes).
9.  Let `j` be 0.
10. Repeat, while `j` \< `len`,
    1.  Perform ! [Set](#sec-set-o-p-v-throw)(`A`, ! [ToString](#sec-tostring)([𝔽](#𝔽)(`j`)), `sortedList`\[`j`\], true).
    2.  Set `j` to `j` + 1.
11. Return `A`.

#### 23.2.3.34 %TypedArray%.prototype.toString ( )

The initial value of the "toString" property is %Array.prototype.toString%, defined in [23.1.3.36](#sec-array.prototype.tostring).

#### 23.2.3.35 %TypedArray%.prototype.values ( )

This method performs the following steps when called:

1.  Let `O` be the this value.
2.  Perform ? [ValidateTypedArray](#sec-validatetypedarray)(`O`, seq-cst).
3.  Return [CreateArrayIterator](#sec-createarrayiterator)(`O`, value).

#### 23.2.3.36 %TypedArray%.prototype.with ( `index`, `value` )

This method performs the following steps when called:

1.  Let `O` be the this value.
2.  Let `taRecord` be ? [ValidateTypedArray](#sec-validatetypedarray)(`O`, seq-cst).
3.  Let `len` be [TypedArrayLength](#sec-typedarraylength)(`taRecord`).
4.  Let `relativeIndex` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`index`).
5.  If `relativeIndex` ≥ 0, let `actualIndex` be `relativeIndex`.
6.  Else, let `actualIndex` be `len` + `relativeIndex`.
7.  If `O`.`[[ContentType]]` is bigint, let `numericValue` be ? [ToBigInt](#sec-tobigint)(`value`).
8.  Else, let `numericValue` be ? [ToNumber](#sec-tonumber)(`value`).
9.  If [IsValidIntegerIndex](#sec-isvalidintegerindex)(`O`, [𝔽](#𝔽)(`actualIndex`)) is false, throw a RangeError exception.
10. Let `A` be ? [TypedArrayCreateSameType](#sec-typedarray-create-same-type)(`O`, « [𝔽](#𝔽)(`len`) »).
11. Let `k` be 0.
12. Repeat, while `k` \< `len`,
    1.  Let `Pk` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k`)).
    2.  If `k` = `actualIndex`, let `fromValue` be `numericValue`.
    3.  Else, let `fromValue` be ! [Get](#sec-get-o-p)(`O`, `Pk`).
    4.  Perform ! [Set](#sec-set-o-p-v-throw)(`A`, `Pk`, `fromValue`, true).
    5.  Set `k` to `k` + 1.
13. Return `A`.

#### 23.2.3.37 %TypedArray%.prototype \[ %Symbol.iterator% \] ( )

The initial value of the [%Symbol.iterator%](#sec-well-known-symbols) property is %TypedArray.prototype.values%, defined in [23.2.3.35](#sec-%typedarray%.prototype.values).

#### 23.2.3.38 get %TypedArray%.prototype \[ %Symbol.toStringTag% \]

[%TypedArray%](#sec-%typedarray%-intrinsic-object)`.prototype[%Symbol.toStringTag%]` is an [accessor property](#sec-object-type) whose set accessor function is undefined. Its get accessor function performs the following steps when called:

1.  Let `O` be the this value.
2.  If `O` [is not an Object](#sec-object-type), return undefined.
3.  If `O` does not have a `[[TypedArrayName]]` internal slot, return undefined.
4.  Let `name` be `O`.`[[TypedArrayName]]`.
5.  [Assert](#assert): `name` [is a String](#sec-ecmascript-language-types-string-type).
6.  Return `name`.

This property has the attributes { `[[Enumerable]]`: false, `[[Configurable]]`: true }.

The initial value of the "name" property of this function is "get \[Symbol.toStringTag\]".

### 23.2.4 Abstract Operations for TypedArray Objects

#### 23.2.4.1 TypedArraySpeciesCreate ( `exemplar`, `argumentList` )

The abstract operation TypedArraySpeciesCreate takes arguments `exemplar` (a [TypedArray](#typedarray)) and `argumentList` (a [List](#sec-list-and-record-specification-type) of [ECMAScript language values](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a [TypedArray](#typedarray) or a [throw completion](#sec-completion-record-specification-type). It is used to specify the creation of a new [TypedArray](#typedarray) using a [constructor](#constructor) function that is derived from `exemplar`. Unlike [ArraySpeciesCreate](#sec-arrayspeciescreate), which can create non-Array objects through the use of [%Symbol.species%](#sec-well-known-symbols), this operation enforces that the [constructor](#constructor) function creates an actual [TypedArray](#typedarray). It performs the following steps when called:

1.  Let `defaultConstructor` be the intrinsic object associated with the [constructor](#constructor) name `exemplar`.`[[TypedArrayName]]` in [Table 73](#table-the-typedarray-constructors).
2.  Let `constructor` be ? [SpeciesConstructor](#sec-speciesconstructor)(`exemplar`, `defaultConstructor`).
3.  Let `result` be ? [TypedArrayCreateFromConstructor](#sec-typedarraycreatefromconstructor)(`constructor`, `argumentList`).
4.  [Assert](#assert): `result` has `[[TypedArrayName]]` and `[[ContentType]]` internal slots.
5.  If `result`.`[[ContentType]]` is not `exemplar`.`[[ContentType]]`, throw a TypeError exception.
6.  Return `result`.

#### 23.2.4.2 TypedArrayCreateFromConstructor ( `constructor`, `argumentList` )

The abstract operation TypedArrayCreateFromConstructor takes arguments `constructor` (a [constructor](#constructor)) and `argumentList` (a [List](#sec-list-and-record-specification-type) of [ECMAScript language values](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a [TypedArray](#typedarray) or a [throw completion](#sec-completion-record-specification-type). It is used to specify the creation of a new [TypedArray](#typedarray) using a [constructor](#constructor) function. It performs the following steps when called:

1.  Let `newTypedArray` be ? [Construct](#sec-construct)(`constructor`, `argumentList`).
2.  Let `taRecord` be ? [ValidateTypedArray](#sec-validatetypedarray)(`newTypedArray`, seq-cst).
3.  If the number of elements in `argumentList` is 1 and `argumentList`\[0\] [is a Number](#sec-ecmascript-language-types-number-type), then
    1.  If [IsTypedArrayOutOfBounds](#sec-istypedarrayoutofbounds)(`taRecord`) is true, throw a TypeError exception.
    2.  Let `length` be [TypedArrayLength](#sec-typedarraylength)(`taRecord`).
    3.  If `length` \< [ℝ](#ℝ)(`argumentList`\[0\]), throw a TypeError exception.
4.  Return `newTypedArray`.

#### 23.2.4.3 TypedArrayCreateSameType ( `exemplar`, `argumentList` )

The abstract operation TypedArrayCreateSameType takes arguments `exemplar` (a [TypedArray](#typedarray)) and `argumentList` (a [List](#sec-list-and-record-specification-type) of [ECMAScript language values](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a [TypedArray](#typedarray) or a [throw completion](#sec-completion-record-specification-type). It is used to specify the creation of a new [TypedArray](#typedarray) using a [constructor](#constructor) function that is derived from `exemplar`. Unlike [TypedArraySpeciesCreate](#typedarray-species-create), which can construct custom [TypedArray](#typedarray) subclasses through the use of [%Symbol.species%](#sec-well-known-symbols), this operation always uses one of the built-in [TypedArray](#typedarray) [constructors](#constructor). It performs the following steps when called:

1.  Let `constructor` be the intrinsic object associated with the [constructor](#constructor) name `exemplar`.`[[TypedArrayName]]` in [Table 73](#table-the-typedarray-constructors).
2.  Let `result` be ? [TypedArrayCreateFromConstructor](#sec-typedarraycreatefromconstructor)(`constructor`, `argumentList`).
3.  [Assert](#assert): `result` has `[[TypedArrayName]]` and `[[ContentType]]` internal slots.
4.  [Assert](#assert): `result`.`[[ContentType]]` is `exemplar`.`[[ContentType]]`.
5.  Return `result`.

#### 23.2.4.4 ValidateTypedArray ( `O`, `order` )

The abstract operation ValidateTypedArray takes arguments `O` (an [ECMAScript language value](#sec-ecmascript-language-types)) and `order` (seq-cst or unordered) and returns either a [normal completion containing](#sec-completion-record-specification-type) a [TypedArray With Buffer Witness Record](#sec-typedarray-with-buffer-witness-records) or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`O`, `[[TypedArrayName]]`).
2.  [Assert](#assert): `O` has a `[[ViewedArrayBuffer]]` internal slot.
3.  Let `taRecord` be [MakeTypedArrayWithBufferWitnessRecord](#sec-maketypedarraywithbufferwitnessrecord)(`O`, `order`).
4.  If [IsTypedArrayOutOfBounds](#sec-istypedarrayoutofbounds)(`taRecord`) is true, throw a TypeError exception.
5.  Return `taRecord`.

#### 23.2.4.5 TypedArrayElementSize ( `O` )

The abstract operation TypedArrayElementSize takes argument `O` (a [TypedArray](#typedarray)) and returns a non-negative [integer](#integer). It performs the following steps when called:

1.  Return the Element Size value specified in [Table 73](#table-the-typedarray-constructors) for `O`.`[[TypedArrayName]]`.

#### 23.2.4.6 TypedArrayElementType ( `O` )

The abstract operation TypedArrayElementType takes argument `O` (a [TypedArray](#typedarray)) and returns a [TypedArray element type](#sec-typedarray-objects). It performs the following steps when called:

1.  Return the Element Type value specified in [Table 73](#table-the-typedarray-constructors) for `O`.`[[TypedArrayName]]`.

#### 23.2.4.7 CompareTypedArrayElements ( `x`, `y`, `comparator` )

The abstract operation CompareTypedArrayElements takes arguments `x` (a Number or a BigInt), `y` (a Number or a BigInt), and `comparator` (a [function object](#function-object) or undefined) and returns either a [normal completion containing](#sec-completion-record-specification-type) a Number or an [abrupt completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  [Assert](#assert): `x` [is a Number](#sec-ecmascript-language-types-number-type) and `y` [is a Number](#sec-ecmascript-language-types-number-type), or `x` [is a BigInt](#sec-ecmascript-language-types-bigint-type) and `y` [is a BigInt](#sec-ecmascript-language-types-bigint-type).
2.  If `comparator` is not undefined, then
    1.  Let `v` be ? [ToNumber](#sec-tonumber)(? [Call](#sec-call)(`comparator`, undefined, « `x`, `y` »)).
    2.  If `v` is NaN, return +0_(𝔽).
    3.  Return `v`.
3.  If `x` and `y` are both NaN, return +0_(𝔽).
4.  If `x` is NaN, return 1_(𝔽).
5.  If `y` is NaN, return -1_(𝔽).
6.  If `x` \< `y`, return -1_(𝔽).
7.  If `x` \> `y`, return 1_(𝔽).
8.  If `x` is -0_(𝔽) and `y` is +0_(𝔽), return -1_(𝔽).
9.  If `x` is +0_(𝔽) and `y` is -0_(𝔽), return 1_(𝔽).
10. Return +0_(𝔽).

Note

This performs a numeric comparison rather than the string comparison used in [23.1.3.30.2](#sec-comparearrayelements).

### 23.2.5 The `TypedArray` Constructors

Each `TypedArray` [constructor](#constructor):

- is an intrinsic object that has the structure described below, differing only in the name used as the [constructor](#constructor) name instead of `TypedArray`, in [Table 73](#table-the-typedarray-constructors).
- is a function whose behaviour differs based upon the number and types of its arguments. The actual behaviour of a call of `TypedArray` depends upon the number and kind of arguments that are passed to it.
- is not intended to be called as a function and will throw an exception when called in that manner.
- may be used as the value of an `extends` clause of a class definition. Subclass [constructors](#constructor) that intend to inherit the specified `TypedArray` behaviour must include a `super` call to the `TypedArray` [constructor](#constructor) to create and initialize the subclass instance with the internal state necessary to support the [%TypedArray%](#sec-%typedarray%-intrinsic-object)`.prototype` built-in methods.

#### 23.2.5.1 `TypedArray` ( ...`args` )

Each `TypedArray` [constructor](#constructor) performs the following steps when called:

1.  If NewTarget is undefined, throw a TypeError exception.
2.  Let `constructorName` be the String value of the [Constructor](#constructor) Name value specified in [Table 73](#table-the-typedarray-constructors) for this `TypedArray` [constructor](#constructor).
3.  Let `proto` be `"%``TypedArray``.prototype%"`.
4.  Let `numberOfArgs` be the number of elements in `args`.
5.  If `numberOfArgs` = 0, then
    1.  Return ? [AllocateTypedArray](#sec-allocatetypedarray)(`constructorName`, NewTarget, `proto`, 0).
6.  Else,
    1.  Let `firstArgument` be `args`\[0\].
    2.  If `firstArgument` [is an Object](#sec-object-type), then
        1.  Let `O` be ? [AllocateTypedArray](#sec-allocatetypedarray)(`constructorName`, NewTarget, `proto`).
        2.  If `firstArgument` has a `[[TypedArrayName]]` internal slot, then
            1.  Perform ? [InitializeTypedArrayFromTypedArray](#sec-initializetypedarrayfromtypedarray)(`O`, `firstArgument`).
        3.  Else if `firstArgument` has an `[[ArrayBufferData]]` internal slot, then
            1.  If `numberOfArgs` \> 1, let `byteOffset` be `args`\[1\]; else let `byteOffset` be undefined.
            2.  If `numberOfArgs` \> 2, let `length` be `args`\[2\]; else let `length` be undefined.
            3.  Perform ? [InitializeTypedArrayFromArrayBuffer](#sec-initializetypedarrayfromarraybuffer)(`O`, `firstArgument`, `byteOffset`, `length`).
        4.  Else,
            1.  [Assert](#assert): `firstArgument` [is an Object](#sec-object-type) and `firstArgument` does not have either a `[[TypedArrayName]]` or an `[[ArrayBufferData]]` internal slot.
            2.  Let `usingIterator` be ? [GetMethod](#sec-getmethod)(`firstArgument`, [%Symbol.iterator%](#sec-well-known-symbols)).
            3.  If `usingIterator` is not undefined, then
                1.  Let `values` be ? [IteratorToList](#sec-iteratortolist)(? [GetIteratorFromMethod](#sec-getiteratorfrommethod)(`firstArgument`, `usingIterator`)).
                2.  Perform ? [InitializeTypedArrayFromList](#sec-initializetypedarrayfromlist)(`O`, `values`).
            4.  Else,
                1.  NOTE: `firstArgument` is not an [iterable object](#sec-iterable-interface), so assume it is already an [array-like object](#sec-lengthofarraylike).
                2.  Perform ? [InitializeTypedArrayFromArrayLike](#sec-initializetypedarrayfromarraylike)(`O`, `firstArgument`).
        5.  Return `O`.
    3.  Else,
        1.  [Assert](#assert): `firstArgument` [is not an Object](#sec-object-type).
        2.  Let `elementLength` be ? [ToIndex](#sec-toindex)(`firstArgument`).
        3.  Return ? [AllocateTypedArray](#sec-allocatetypedarray)(`constructorName`, NewTarget, `proto`, `elementLength`).

##### 23.2.5.1.1 AllocateTypedArray ( `constructorName`, `newTarget`, `defaultProto` \[ , `length` \] )

The abstract operation AllocateTypedArray takes arguments `constructorName` (a String which is the name of a [TypedArray](#typedarray) [constructor](#constructor) in [Table 73](#table-the-typedarray-constructors)), `newTarget` (a [constructor](#constructor)), and `defaultProto` (a String) and optional argument `length` (a non-negative [integer](#integer)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a [TypedArray](#typedarray) or a [throw completion](#sec-completion-record-specification-type). It is used to validate and create an instance of a [TypedArray](#typedarray) [constructor](#constructor). If the `length` argument is passed, an ArrayBuffer of that length is also allocated and associated with the new [TypedArray](#typedarray) instance. AllocateTypedArray provides common semantics that is used by `TypedArray`. It performs the following steps when called:

1.  Let `proto` be ? [GetPrototypeFromConstructor](#sec-getprototypefromconstructor)(`newTarget`, `defaultProto`).
2.  Let `obj` be [TypedArrayCreate](#sec-typedarraycreate)(`proto`).
3.  [Assert](#assert): `obj`.`[[ViewedArrayBuffer]]` is undefined.
4.  Set `obj`.`[[TypedArrayName]]` to `constructorName`.
5.  If `constructorName` is either "BigInt64Array" or "BigUint64Array", set `obj`.`[[ContentType]]` to bigint.
6.  Otherwise, set `obj`.`[[ContentType]]` to number.
7.  If `length` is not present, then
    1.  Set `obj`.`[[ByteLength]]` to 0.
    2.  Set `obj`.`[[ByteOffset]]` to 0.
    3.  Set `obj`.`[[ArrayLength]]` to 0.
8.  Else,
    1.  Perform ? [AllocateTypedArrayBuffer](#sec-allocatetypedarraybuffer)(`obj`, `length`).
9.  Return `obj`.

##### 23.2.5.1.2 InitializeTypedArrayFromTypedArray ( `O`, `srcArray` )

The abstract operation InitializeTypedArrayFromTypedArray takes arguments `O` (a [TypedArray](#typedarray)) and `srcArray` (a [TypedArray](#typedarray)) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `srcData` be `srcArray`.`[[ViewedArrayBuffer]]`.
2.  Let `elementType` be [TypedArrayElementType](#sec-typedarrayelementtype)(`O`).
3.  Let `elementSize` be [TypedArrayElementSize](#sec-typedarrayelementsize)(`O`).
4.  Let `srcType` be [TypedArrayElementType](#sec-typedarrayelementtype)(`srcArray`).
5.  Let `srcElementSize` be [TypedArrayElementSize](#sec-typedarrayelementsize)(`srcArray`).
6.  Let `srcByteOffset` be `srcArray`.`[[ByteOffset]]`.
7.  Let `srcRecord` be [MakeTypedArrayWithBufferWitnessRecord](#sec-maketypedarraywithbufferwitnessrecord)(`srcArray`, seq-cst).
8.  If [IsTypedArrayOutOfBounds](#sec-istypedarrayoutofbounds)(`srcRecord`) is true, throw a TypeError exception.
9.  Let `elementLength` be [TypedArrayLength](#sec-typedarraylength)(`srcRecord`).
10. Let `byteLength` be `elementSize` × `elementLength`.
11. If `elementType` is `srcType`, then
    1.  Let `data` be ? [CloneArrayBuffer](#sec-clonearraybuffer)(`srcData`, `srcByteOffset`, `byteLength`).
12. Else,
    1.  Let `data` be ? [AllocateArrayBuffer](#sec-allocatearraybuffer)([%ArrayBuffer%](#sec-arraybuffer-constructor), `byteLength`).
    2.  If `srcArray`.`[[ContentType]]` is not `O`.`[[ContentType]]`, throw a TypeError exception.
    3.  Let `srcByteIndex` be `srcByteOffset`.
    4.  Let `targetByteIndex` be 0.
    5.  Let `count` be `elementLength`.
    6.  Repeat, while `count` \> 0,
        1.  Let `value` be [GetValueFromBuffer](#sec-getvaluefrombuffer)(`srcData`, `srcByteIndex`, `srcType`, true, unordered).
        2.  Perform [SetValueInBuffer](#sec-setvalueinbuffer)(`data`, `targetByteIndex`, `elementType`, `value`, true, unordered).
        3.  Set `srcByteIndex` to `srcByteIndex` + `srcElementSize`.
        4.  Set `targetByteIndex` to `targetByteIndex` + `elementSize`.
        5.  Set `count` to `count` - 1.
13. Set `O`.`[[ViewedArrayBuffer]]` to `data`.
14. Set `O`.`[[ByteLength]]` to `byteLength`.
15. Set `O`.`[[ByteOffset]]` to 0.
16. Set `O`.`[[ArrayLength]]` to `elementLength`.
17. Return unused.

##### 23.2.5.1.3 InitializeTypedArrayFromArrayBuffer ( `O`, `buffer`, `byteOffset`, `length` )

The abstract operation InitializeTypedArrayFromArrayBuffer takes arguments `O` (a [TypedArray](#typedarray)), `buffer` (an ArrayBuffer or a SharedArrayBuffer), `byteOffset` (an [ECMAScript language value](#sec-ecmascript-language-types)), and `length` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `elementSize` be [TypedArrayElementSize](#sec-typedarrayelementsize)(`O`).
2.  Let `offset` be ? [ToIndex](#sec-toindex)(`byteOffset`).
3.  If `offset` [modulo](#eqn-modulo) `elementSize` ≠ 0, throw a RangeError exception.
4.  Let `bufferIsFixedLength` be [IsFixedLengthArrayBuffer](#sec-isfixedlengtharraybuffer)(`buffer`).
5.  If `length` is not undefined, then
    1.  Let `newLength` be ? [ToIndex](#sec-toindex)(`length`).
6.  If [IsDetachedBuffer](#sec-isdetachedbuffer)(`buffer`) is true, throw a TypeError exception.
7.  Let `bufferByteLength` be [ArrayBufferByteLength](#sec-arraybufferbytelength)(`buffer`, seq-cst).
8.  If `length` is undefined and `bufferIsFixedLength` is false, then
    1.  If `offset` \> `bufferByteLength`, throw a RangeError exception.
    2.  Set `O`.`[[ByteLength]]` to auto.
    3.  Set `O`.`[[ArrayLength]]` to auto.
9.  Else,
    1.  If `length` is undefined, then
        1.  If `bufferByteLength` [modulo](#eqn-modulo) `elementSize` ≠ 0, throw a RangeError exception.
        2.  Let `newByteLength` be `bufferByteLength` - `offset`.
        3.  If `newByteLength` \< 0, throw a RangeError exception.
    2.  Else,
        1.  Let `newByteLength` be `newLength` × `elementSize`.
        2.  If `offset` + `newByteLength` \> `bufferByteLength`, throw a RangeError exception.
    3.  Set `O`.`[[ByteLength]]` to `newByteLength`.
    4.  Set `O`.`[[ArrayLength]]` to `newByteLength` / `elementSize`.
10. Set `O`.`[[ViewedArrayBuffer]]` to `buffer`.
11. Set `O`.`[[ByteOffset]]` to `offset`.
12. Return unused.

##### 23.2.5.1.4 InitializeTypedArrayFromList ( `O`, `values` )

The abstract operation InitializeTypedArrayFromList takes arguments `O` (a [TypedArray](#typedarray)) and `values` (a [List](#sec-list-and-record-specification-type) of [ECMAScript language values](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `len` be the number of elements in `values`.
2.  Perform ? [AllocateTypedArrayBuffer](#sec-allocatetypedarraybuffer)(`O`, `len`).
3.  Let `k` be 0.
4.  Repeat, while `k` \< `len`,
    1.  Let `Pk` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k`)).
    2.  Let `kValue` be the first element of `values`.
    3.  Remove the first element from `values`.
    4.  Perform ? [Set](#sec-set-o-p-v-throw)(`O`, `Pk`, `kValue`, true).
    5.  Set `k` to `k` + 1.
5.  [Assert](#assert): `values` is now an empty [List](#sec-list-and-record-specification-type).
6.  Return unused.

##### 23.2.5.1.5 InitializeTypedArrayFromArrayLike ( `O`, `arrayLike` )

The abstract operation InitializeTypedArrayFromArrayLike takes arguments `O` (a [TypedArray](#typedarray)) and `arrayLike` (an Object, but not a [TypedArray](#typedarray) or an ArrayBuffer) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `len` be ? [LengthOfArrayLike](#sec-lengthofarraylike)(`arrayLike`).
2.  Perform ? [AllocateTypedArrayBuffer](#sec-allocatetypedarraybuffer)(`O`, `len`).
3.  Let `k` be 0.
4.  Repeat, while `k` \< `len`,
    1.  Let `Pk` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`k`)).
    2.  Let `kValue` be ? [Get](#sec-get-o-p)(`arrayLike`, `Pk`).
    3.  Perform ? [Set](#sec-set-o-p-v-throw)(`O`, `Pk`, `kValue`, true).
    4.  Set `k` to `k` + 1.
5.  Return unused.

##### 23.2.5.1.6 AllocateTypedArrayBuffer ( `O`, `length` )

The abstract operation AllocateTypedArrayBuffer takes arguments `O` (a [TypedArray](#typedarray)) and `length` (a non-negative [integer](#integer)) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or a [throw completion](#sec-completion-record-specification-type). It allocates and associates an ArrayBuffer with `O`. It performs the following steps when called:

1.  [Assert](#assert): `O`.`[[ViewedArrayBuffer]]` is undefined.
2.  Let `elementSize` be [TypedArrayElementSize](#sec-typedarrayelementsize)(`O`).
3.  Let `byteLength` be `elementSize` × `length`.
4.  Let `data` be ? [AllocateArrayBuffer](#sec-allocatearraybuffer)([%ArrayBuffer%](#sec-arraybuffer-constructor), `byteLength`).
5.  Set `O`.`[[ViewedArrayBuffer]]` to `data`.
6.  Set `O`.`[[ByteLength]]` to `byteLength`.
7.  Set `O`.`[[ByteOffset]]` to 0.
8.  Set `O`.`[[ArrayLength]]` to `length`.
9.  Return unused.

### 23.2.6 Properties of the `TypedArray` Constructors

Each `TypedArray` [constructor](#constructor):

- has a `[[Prototype]]` internal slot whose value is [%TypedArray%](#sec-%typedarray%-intrinsic-object).
- has a "length" property whose value is 3_(𝔽).
- has a "name" property whose value is the String value of the [constructor](#constructor) name specified for it in [Table 73](#table-the-typedarray-constructors).
- has the following properties:

#### 23.2.6.1 `TypedArray`.BYTES_PER_ELEMENT

The value of `TypedArray``.BYTES_PER_ELEMENT` is the Element Size value specified in [Table 73](#table-the-typedarray-constructors) for `TypedArray`.

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

#### 23.2.6.2 `TypedArray`.prototype

The initial value of `TypedArray``.prototype` is the corresponding `TypedArray` prototype intrinsic object ([23.2.7](#sec-properties-of-typedarray-prototype-objects)).

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

### 23.2.7 Properties of the `TypedArray` Prototype Objects

Each `TypedArray` prototype object:

- has a `[[Prototype]]` internal slot whose value is [%TypedArray.prototype%](#sec-properties-of-the-%typedarrayprototype%-object).
- is an [ordinary object](#ordinary-object).
- does not have a `[[ViewedArrayBuffer]]` or any other of the internal slots that are specific to `TypedArray` instance objects.

#### 23.2.7.1 `TypedArray`.prototype.BYTES_PER_ELEMENT

The value of `TypedArray``.prototype.BYTES_PER_ELEMENT` is the Element Size value specified in [Table 73](#table-the-typedarray-constructors) for `TypedArray`.

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

#### 23.2.7.2 `TypedArray`.prototype.constructor

The initial value of the "constructor" property of the prototype for a given `TypedArray` [constructor](#constructor) is the [constructor](#constructor) itself.

### 23.2.8 Properties of `TypedArray` Instances

`TypedArray` instances are [TypedArrays](#typedarray). Each `TypedArray` instance inherits properties from the corresponding `TypedArray` prototype object. Each `TypedArray` instance has the following internal slots: `[[TypedArrayName]]`, `[[ViewedArrayBuffer]]`, `[[ByteLength]]`, `[[ByteOffset]]`, and `[[ArrayLength]]`.
