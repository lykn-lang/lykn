# 20 Fundamental Objects

## 20.1 Object Objects

### 20.1.1 The Object Constructor

The Object [constructor](#constructor):

- is %Object%.
- is the initial value of the "Object" property of the [global object](#sec-global-object).
- creates a new [ordinary object](#ordinary-object) when called as a [constructor](#constructor).
- performs a type conversion when called as a function rather than as a [constructor](#constructor).
- may be used as the value of an `extends` clause of a class definition.

#### 20.1.1.1 Object ( \[ `value` \] )

This function performs the following steps when called:

1.  If NewTarget is neither undefined nor the [active function object](#active-function-object), then
    1.  Return ? [OrdinaryCreateFromConstructor](#sec-ordinarycreatefromconstructor)(NewTarget, "%Object.prototype%").
2.  If `value` is either undefined or null, return [OrdinaryObjectCreate](#sec-ordinaryobjectcreate)([%Object.prototype%](#sec-properties-of-the-object-prototype-object)).
3.  Return ! [ToObject](#sec-toobject)(`value`).

### 20.1.2 Properties of the Object Constructor

The Object [constructor](#constructor):

- has a `[[Prototype]]` internal slot whose value is [%Function.prototype%](#sec-properties-of-the-function-prototype-object).
- has a "length" property whose value is 1_(𝔽).
- has the following additional properties:

#### 20.1.2.1 Object.assign ( `target`, ...`sources` )

This function copies the values of all of the enumerable own properties from one or more source objects to a `target` object.

It performs the following steps when called:

1.  Let `to` be ? [ToObject](#sec-toobject)(`target`).
2.  If only one argument was passed, return `to`.
3.  For each element `nextSource` of `sources`, do
    1.  If `nextSource` is neither undefined nor null, then
        1.  Let `from` be ! [ToObject](#sec-toobject)(`nextSource`).
        2.  Let `keys` be ? `from`.`[[OwnPropertyKeys]]`().
        3.  For each element `nextKey` of `keys`, do
            1.  Let `desc` be ? `from`.`[[GetOwnProperty]]`(`nextKey`).
            2.  If `desc` is not undefined and `desc`.`[[Enumerable]]` is true, then
                1.  Let `propValue` be ? [Get](#sec-get-o-p)(`from`, `nextKey`).
                2.  Perform ? [Set](#sec-set-o-p-v-throw)(`to`, `nextKey`, `propValue`, true).
4.  Return `to`.

The "length" property of this function is 2_(𝔽).

#### 20.1.2.2 Object.create ( `O`, `Properties` )

This function creates a new object with a specified prototype.

It performs the following steps when called:

1.  If `O` [is not an Object](#sec-object-type) and `O` is not null, throw a TypeError exception.
2.  Let `obj` be [OrdinaryObjectCreate](#sec-ordinaryobjectcreate)(`O`).
3.  If `Properties` is not undefined, then
    1.  Return ? [ObjectDefineProperties](#sec-objectdefineproperties)(`obj`, `Properties`).
4.  Return `obj`.

#### 20.1.2.3 Object.defineProperties ( `O`, `Properties` )

This function adds own properties and/or updates the attributes of existing own properties of an object.

It performs the following steps when called:

1.  If `O` [is not an Object](#sec-object-type), throw a TypeError exception.
2.  Return ? [ObjectDefineProperties](#sec-objectdefineproperties)(`O`, `Properties`).

##### 20.1.2.3.1 ObjectDefineProperties ( `O`, `Properties` )

The abstract operation ObjectDefineProperties takes arguments `O` (an Object) and `Properties` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) an Object or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `props` be ? [ToObject](#sec-toobject)(`Properties`).
2.  Let `keys` be ? `props`.`[[OwnPropertyKeys]]`().
3.  Let `descriptors` be a new empty [List](#sec-list-and-record-specification-type).
4.  For each element `nextKey` of `keys`, do
    1.  Let `propDesc` be ? `props`.`[[GetOwnProperty]]`(`nextKey`).
    2.  If `propDesc` is not undefined and `propDesc`.`[[Enumerable]]` is true, then
        1.  Let `descObj` be ? [Get](#sec-get-o-p)(`props`, `nextKey`).
        2.  Let `desc` be ? [ToPropertyDescriptor](#sec-topropertydescriptor)(`descObj`).
        3.  Append the [Record](#sec-list-and-record-specification-type) { `[[Key]]`: `nextKey`, `[[Descriptor]]`: `desc` } to `descriptors`.
5.  For each element `property` of `descriptors`, do
    1.  Perform ? [DefinePropertyOrThrow](#sec-definepropertyorthrow)(`O`, `property`.`[[Key]]`, `property`.`[[Descriptor]]`).
6.  Return `O`.

#### 20.1.2.4 Object.defineProperty ( `O`, `P`, `Attributes` )

This function adds an own property and/or updates the attributes of an existing own property of an object.

It performs the following steps when called:

1.  If `O` [is not an Object](#sec-object-type), throw a TypeError exception.
2.  Let `key` be ? [ToPropertyKey](#sec-topropertykey)(`P`).
3.  Let `desc` be ? [ToPropertyDescriptor](#sec-topropertydescriptor)(`Attributes`).
4.  Perform ? [DefinePropertyOrThrow](#sec-definepropertyorthrow)(`O`, `key`, `desc`).
5.  Return `O`.

#### 20.1.2.5 Object.entries ( `O` )

This function performs the following steps when called:

1.  Let `obj` be ? [ToObject](#sec-toobject)(`O`).
2.  Let `entryList` be ? [EnumerableOwnProperties](#sec-enumerableownproperties)(`obj`, key+value).
3.  Return [CreateArrayFromList](#sec-createarrayfromlist)(`entryList`).

#### 20.1.2.6 Object.freeze ( `O` )

This function performs the following steps when called:

1.  If `O` [is not an Object](#sec-object-type), return `O`.
2.  Let `status` be ? [SetIntegrityLevel](#sec-setintegritylevel)(`O`, frozen).
3.  If `status` is false, throw a TypeError exception.
4.  Return `O`.

#### 20.1.2.7 Object.fromEntries ( `iterable` )

This function performs the following steps when called:

1.  Perform ? [RequireObjectCoercible](#sec-requireobjectcoercible)(`iterable`).
2.  Let `obj` be [OrdinaryObjectCreate](#sec-ordinaryobjectcreate)([%Object.prototype%](#sec-properties-of-the-object-prototype-object)).
3.  [Assert](#assert): `obj` is an extensible [ordinary object](#ordinary-object) with no own properties.
4.  Let `closure` be a new [Abstract Closure](#sec-abstract-closure) with parameters (`key`, `value`) that captures `obj` and performs the following steps when called:
    1.  Let `propertyKey` be ? [ToPropertyKey](#sec-topropertykey)(`key`).
    2.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`obj`, `propertyKey`, `value`).
    3.  Return undefined.
5.  Let `adder` be [CreateBuiltinFunction](#sec-createbuiltinfunction)(`closure`, 2, "", « »).
6.  Return ? [AddEntriesFromIterable](#sec-add-entries-from-iterable)(`obj`, `iterable`, `adder`).

Note

The function created for `adder` is never directly accessible to ECMAScript code.

#### 20.1.2.8 Object.getOwnPropertyDescriptor ( `O`, `P` )

This function performs the following steps when called:

1.  Let `obj` be ? [ToObject](#sec-toobject)(`O`).
2.  Let `key` be ? [ToPropertyKey](#sec-topropertykey)(`P`).
3.  Let `desc` be ? `obj`.`[[GetOwnProperty]]`(`key`).
4.  Return [FromPropertyDescriptor](#sec-frompropertydescriptor)(`desc`).

#### 20.1.2.9 Object.getOwnPropertyDescriptors ( `O` )

This function performs the following steps when called:

1.  Let `obj` be ? [ToObject](#sec-toobject)(`O`).
2.  Let `ownKeys` be ? `obj`.`[[OwnPropertyKeys]]`().
3.  Let `descriptors` be [OrdinaryObjectCreate](#sec-ordinaryobjectcreate)([%Object.prototype%](#sec-properties-of-the-object-prototype-object)).
4.  For each element `key` of `ownKeys`, do
    1.  Let `desc` be ? `obj`.`[[GetOwnProperty]]`(`key`).
    2.  Let `descriptor` be [FromPropertyDescriptor](#sec-frompropertydescriptor)(`desc`).
    3.  If `descriptor` is not undefined, perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`descriptors`, `key`, `descriptor`).
5.  Return `descriptors`.

#### 20.1.2.10 Object.getOwnPropertyNames ( `O` )

This function performs the following steps when called:

1.  Return [CreateArrayFromList](#sec-createarrayfromlist)(? [GetOwnPropertyKeys](#sec-getownpropertykeys)(`O`, string)).

#### 20.1.2.11 Object.getOwnPropertySymbols ( `O` )

This function performs the following steps when called:

1.  Return [CreateArrayFromList](#sec-createarrayfromlist)(? [GetOwnPropertyKeys](#sec-getownpropertykeys)(`O`, symbol)).

##### 20.1.2.11.1 GetOwnPropertyKeys ( `O`, `type` )

The abstract operation GetOwnPropertyKeys takes arguments `O` (an [ECMAScript language value](#sec-ecmascript-language-types)) and `type` (string or symbol) and returns either a [normal completion containing](#sec-completion-record-specification-type) a [List](#sec-list-and-record-specification-type) of [property keys](#property-key) or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `obj` be ? [ToObject](#sec-toobject)(`O`).
2.  Let `keys` be ? `obj`.`[[OwnPropertyKeys]]`().
3.  Let `nameList` be a new empty [List](#sec-list-and-record-specification-type).
4.  For each element `nextKey` of `keys`, do
    1.  If `nextKey` [is a Symbol](#sec-ecmascript-language-types-symbol-type) and `type` is symbol, or if `nextKey` [is a String](#sec-ecmascript-language-types-string-type) and `type` is string, then
        1.  Append `nextKey` to `nameList`.
5.  Return `nameList`.

#### 20.1.2.12 Object.getPrototypeOf ( `O` )

This function performs the following steps when called:

1.  Let `obj` be ? [ToObject](#sec-toobject)(`O`).
2.  Return ? `obj`.`[[GetPrototypeOf]]`().

#### 20.1.2.13 Object.groupBy ( `items`, `callback` )

Note

`callback` should be a function that accepts two arguments. `groupBy` calls `callback` once for each element in `items`, in ascending order, and constructs a new object. Each value returned by `callback` is coerced to a [property key](#property-key). For each such [property key](#property-key), the result object has a property whose key is that [property key](#property-key) and whose value is an array containing all the elements for which the `callback` return value coerced to that key.

`callback` is called with two arguments: the value of the element and the index of the element.

The return value of `groupBy` is an object that does not inherit from [%Object.prototype%](#sec-properties-of-the-object-prototype-object).

This function performs the following steps when called:

1.  Let `groups` be ? [GroupBy](#sec-groupby)(`items`, `callback`, property).
2.  Let `obj` be [OrdinaryObjectCreate](#sec-ordinaryobjectcreate)(null).
3.  For each [Record](#sec-list-and-record-specification-type) { `[[Key]]`, `[[Elements]]` } `g` of `groups`, do
    1.  Let `elements` be [CreateArrayFromList](#sec-createarrayfromlist)(`g`.`[[Elements]]`).
    2.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`obj`, `g`.`[[Key]]`, `elements`).
4.  Return `obj`.

#### 20.1.2.14 Object.hasOwn ( `O`, `P` )

This function performs the following steps when called:

1.  Let `obj` be ? [ToObject](#sec-toobject)(`O`).
2.  Let `key` be ? [ToPropertyKey](#sec-topropertykey)(`P`).
3.  Return ? [HasOwnProperty](#sec-hasownproperty)(`obj`, `key`).

#### 20.1.2.15 Object.is ( `value1`, `value2` )

This function performs the following steps when called:

1.  Return [SameValue](#sec-samevalue)(`value1`, `value2`).

#### 20.1.2.16 Object.isExtensible ( `O` )

This function performs the following steps when called:

1.  If `O` [is not an Object](#sec-object-type), return false.
2.  Return ? [IsExtensible](#sec-isextensible-o)(`O`).

#### 20.1.2.17 Object.isFrozen ( `O` )

This function performs the following steps when called:

1.  If `O` [is not an Object](#sec-object-type), return true.
2.  Return ? [TestIntegrityLevel](#sec-testintegritylevel)(`O`, frozen).

#### 20.1.2.18 Object.isSealed ( `O` )

This function performs the following steps when called:

1.  If `O` [is not an Object](#sec-object-type), return true.
2.  Return ? [TestIntegrityLevel](#sec-testintegritylevel)(`O`, sealed).

#### 20.1.2.19 Object.keys ( `O` )

This function performs the following steps when called:

1.  Let `obj` be ? [ToObject](#sec-toobject)(`O`).
2.  Let `keyList` be ? [EnumerableOwnProperties](#sec-enumerableownproperties)(`obj`, key).
3.  Return [CreateArrayFromList](#sec-createarrayfromlist)(`keyList`).

#### 20.1.2.20 Object.preventExtensions ( `O` )

This function performs the following steps when called:

1.  If `O` [is not an Object](#sec-object-type), return `O`.
2.  Let `status` be ? `O`.`[[PreventExtensions]]`().
3.  If `status` is false, throw a TypeError exception.
4.  Return `O`.

#### 20.1.2.21 Object.prototype

The initial value of `Object.prototype` is the [Object prototype object](#sec-properties-of-the-object-prototype-object).

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

#### 20.1.2.22 Object.seal ( `O` )

This function performs the following steps when called:

1.  If `O` [is not an Object](#sec-object-type), return `O`.
2.  Let `status` be ? [SetIntegrityLevel](#sec-setintegritylevel)(`O`, sealed).
3.  If `status` is false, throw a TypeError exception.
4.  Return `O`.

#### 20.1.2.23 Object.setPrototypeOf ( `O`, `proto` )

This function performs the following steps when called:

1.  Set `O` to ? [RequireObjectCoercible](#sec-requireobjectcoercible)(`O`).
2.  If `proto` [is not an Object](#sec-object-type) and `proto` is not null, throw a TypeError exception.
3.  If `O` [is not an Object](#sec-object-type), return `O`.
4.  Let `status` be ? `O`.`[[SetPrototypeOf]]`(`proto`).
5.  If `status` is false, throw a TypeError exception.
6.  Return `O`.

#### 20.1.2.24 Object.values ( `O` )

This function performs the following steps when called:

1.  Let `obj` be ? [ToObject](#sec-toobject)(`O`).
2.  Let `valueList` be ? [EnumerableOwnProperties](#sec-enumerableownproperties)(`obj`, value).
3.  Return [CreateArrayFromList](#sec-createarrayfromlist)(`valueList`).

### 20.1.3 Properties of the Object Prototype Object

The Object prototype object:

- is %Object.prototype%.
- has an `[[Extensible]]` internal slot whose value is true.
- has the internal methods defined for [ordinary objects](#ordinary-object), except for the `[[SetPrototypeOf]]` method, which is as defined in [10.4.7.1](#sec-immutable-prototype-exotic-objects-setprototypeof-v). (Thus, it is an [immutable prototype exotic object](#immutable-prototype-exotic-object).)
- has a `[[Prototype]]` internal slot whose value is null.

#### 20.1.3.1 Object.prototype.constructor

The initial value of `Object.prototype.constructor` is [%Object%](#sec-object-constructor).

#### 20.1.3.2 Object.prototype.hasOwnProperty ( `V` )

This method performs the following steps when called:

1.  Let `P` be ? [ToPropertyKey](#sec-topropertykey)(`V`).
2.  Let `O` be ? [ToObject](#sec-toobject)(this value).
3.  Return ? [HasOwnProperty](#sec-hasownproperty)(`O`, `P`).

Note

The ordering of steps [1](#step-hasownproperty-topropertykey) and [2](#step-hasownproperty-toobject) is chosen to ensure that any exception that would have been thrown by step [1](#step-hasownproperty-topropertykey) in previous editions of this specification will continue to be thrown even if the this value is undefined or null.

#### 20.1.3.3 Object.prototype.isPrototypeOf ( `V` )

This method performs the following steps when called:

1.  If `V` [is not an Object](#sec-object-type), return false.
2.  Let `O` be ? [ToObject](#sec-toobject)(this value).
3.  Repeat,
    1.  Set `V` to ? `V`.`[[GetPrototypeOf]]`().
    2.  If `V` is null, return false.
    3.  If [SameValue](#sec-samevalue)(`O`, `V`) is true, return true.

Note

The ordering of steps [1](#step-isprototypeof-check-object) and [2](#step-isprototypeof-toobject) preserves the behaviour specified by previous editions of this specification for the case where `V` is not an object and the this value is undefined or null.

#### 20.1.3.4 Object.prototype.propertyIsEnumerable ( `V` )

This method performs the following steps when called:

1.  Let `P` be ? [ToPropertyKey](#sec-topropertykey)(`V`).
2.  Let `O` be ? [ToObject](#sec-toobject)(this value).
3.  Let `desc` be ? `O`.`[[GetOwnProperty]]`(`P`).
4.  If `desc` is undefined, return false.
5.  Return `desc`.`[[Enumerable]]`.

Note 1

This method does not consider objects in the prototype chain.

Note 2

The ordering of steps [1](#step-propertyisenumerable-topropertykey) and [2](#step-propertyisenumerable-toobject) is chosen to ensure that any exception that would have been thrown by step [1](#step-propertyisenumerable-topropertykey) in previous editions of this specification will continue to be thrown even if the this value is undefined or null.

#### 20.1.3.5 Object.prototype.toLocaleString ( \[ `reserved1` \[ , `reserved2` \] \] )

This method performs the following steps when called:

1.  Let `O` be the this value.
2.  Return ? [Invoke](#sec-invoke)(`O`, "toString").

The optional parameters to this method are not used but are intended to correspond to the parameter pattern used by ECMA-402 `toLocaleString` methods. Implementations that do not include ECMA-402 support must not use those parameter positions for other purposes.

Note 1

This method provides a generic `toLocaleString` implementation for objects that have no locale-sensitive `toString` behaviour. `Array`, `Number`, `Date`, and [%TypedArray%](#sec-%typedarray%-intrinsic-object) provide their own locale-sensitive `toLocaleString` methods.

Note 2

ECMA-402 intentionally does not provide an alternative to this default implementation.

#### 20.1.3.6 Object.prototype.toString ( )

This method performs the following steps when called:

1.  If the this value is undefined, return "\[object Undefined\]".
2.  If the this value is null, return "\[object Null\]".
3.  Let `O` be ! [ToObject](#sec-toobject)(this value).
4.  Let `isArray` be ? [IsArray](#sec-isarray)(`O`).
5.  If `isArray` is true, let `builtinTag` be "Array".
6.  Else if `O` has a `[[ParameterMap]]` internal slot, let `builtinTag` be "Arguments".
7.  Else if `O` has a `[[Call]]` internal method, let `builtinTag` be "Function".
8.  Else if `O` has an `[[ErrorData]]` internal slot, let `builtinTag` be "Error".
9.  Else if `O` has a `[[BooleanData]]` internal slot, let `builtinTag` be "Boolean".
10. Else if `O` has a `[[NumberData]]` internal slot, let `builtinTag` be "Number".
11. Else if `O` has a `[[StringData]]` internal slot, let `builtinTag` be "String".
12. Else if `O` has a `[[DateValue]]` internal slot, let `builtinTag` be "Date".
13. Else if `O` has a `[[RegExpMatcher]]` internal slot, let `builtinTag` be "RegExp".
14. Else, let `builtinTag` be "Object".
15. Let `tag` be ? [Get](#sec-get-o-p)(`O`, [%Symbol.toStringTag%](#sec-well-known-symbols)).
16. If `tag` [is not a String](#sec-ecmascript-language-types-string-type), set `tag` to `builtinTag`.
17. Return the [string-concatenation](#string-concatenation) of "\[object ", `tag`, and "\]".

Note

Historically, this method was occasionally used to access the String value of the `[[Class]]` internal slot that was used in previous editions of this specification as a nominal type tag for various built-in objects. The above definition of `toString` preserves compatibility for legacy code that uses `toString` as a test for those specific kinds of built-in objects. It does not provide a reliable type testing mechanism for other kinds of built-in or program defined objects. In addition, programs can use [%Symbol.toStringTag%](#sec-well-known-symbols) in ways that will invalidate the reliability of such legacy type tests.

#### 20.1.3.7 Object.prototype.valueOf ( )

This method performs the following steps when called:

1.  Return ? [ToObject](#sec-toobject)(this value).

[Normative Optional](#sec-conformance), [Legacy](#sec-conformance)

#### 20.1.3.8 Object.prototype.\_\_proto\_\_

`Object.prototype.__proto__` is an [accessor property](#sec-object-type) with attributes { `[[Enumerable]]`: false, `[[Configurable]]`: true }. The `[[Get]]` and `[[Set]]` attributes are defined as follows:

##### 20.1.3.8.1 get Object.prototype.\_\_proto\_\_

The value of the `[[Get]]` attribute is a built-in function that requires no arguments. It performs the following steps when called:

1.  Let `O` be ? [ToObject](#sec-toobject)(this value).
2.  Return ? `O`.`[[GetPrototypeOf]]`().

##### 20.1.3.8.2 set Object.prototype.\_\_proto\_\_

The value of the `[[Set]]` attribute is a built-in function that takes an argument `proto`. It performs the following steps when called:

1.  Let `O` be ? [RequireObjectCoercible](#sec-requireobjectcoercible)(this value).
2.  If `proto` [is not an Object](#sec-object-type) and `proto` is not null, return undefined.
3.  If `O` [is not an Object](#sec-object-type), return undefined.
4.  Let `status` be ? `O`.`[[SetPrototypeOf]]`(`proto`).
5.  If `status` is false, throw a TypeError exception.
6.  Return undefined.

[Normative Optional](#sec-conformance), [Legacy](#sec-conformance)

#### 20.1.3.9 Legacy Object.prototype Accessor Methods

##### 20.1.3.9.1 Object.prototype.\_\_defineGetter\_\_ ( `P`, `getter` )

This method performs the following steps when called:

1.  Let `O` be ? [ToObject](#sec-toobject)(this value).
2.  If [IsCallable](#sec-iscallable)(`getter`) is false, throw a TypeError exception.
3.  Let `desc` be PropertyDescriptor { `[[Get]]`: `getter`, `[[Enumerable]]`: true, `[[Configurable]]`: true }.
4.  Let `key` be ? [ToPropertyKey](#sec-topropertykey)(`P`).
5.  Perform ? [DefinePropertyOrThrow](#sec-definepropertyorthrow)(`O`, `key`, `desc`).
6.  Return undefined.

##### 20.1.3.9.2 Object.prototype.\_\_defineSetter\_\_ ( `P`, `setter` )

This method performs the following steps when called:

1.  Let `O` be ? [ToObject](#sec-toobject)(this value).
2.  If [IsCallable](#sec-iscallable)(`setter`) is false, throw a TypeError exception.
3.  Let `desc` be PropertyDescriptor { `[[Set]]`: `setter`, `[[Enumerable]]`: true, `[[Configurable]]`: true }.
4.  Let `key` be ? [ToPropertyKey](#sec-topropertykey)(`P`).
5.  Perform ? [DefinePropertyOrThrow](#sec-definepropertyorthrow)(`O`, `key`, `desc`).
6.  Return undefined.

##### 20.1.3.9.3 Object.prototype.\_\_lookupGetter\_\_ ( `P` )

This method performs the following steps when called:

1.  Let `O` be ? [ToObject](#sec-toobject)(this value).
2.  Let `key` be ? [ToPropertyKey](#sec-topropertykey)(`P`).
3.  Repeat,
    1.  Let `desc` be ? `O`.`[[GetOwnProperty]]`(`key`).
    2.  If `desc` is not undefined, then
        1.  If [IsAccessorDescriptor](#sec-isaccessordescriptor)(`desc`) is true, return `desc`.`[[Get]]`.
        2.  Return undefined.
    3.  Set `O` to ? `O`.`[[GetPrototypeOf]]`().
    4.  If `O` is null, return undefined.

##### 20.1.3.9.4 Object.prototype.\_\_lookupSetter\_\_ ( `P` )

This method performs the following steps when called:

1.  Let `O` be ? [ToObject](#sec-toobject)(this value).
2.  Let `key` be ? [ToPropertyKey](#sec-topropertykey)(`P`).
3.  Repeat,
    1.  Let `desc` be ? `O`.`[[GetOwnProperty]]`(`key`).
    2.  If `desc` is not undefined, then
        1.  If [IsAccessorDescriptor](#sec-isaccessordescriptor)(`desc`) is true, return `desc`.`[[Set]]`.
        2.  Return undefined.
    3.  Set `O` to ? `O`.`[[GetPrototypeOf]]`().
    4.  If `O` is null, return undefined.

### 20.1.4 Properties of Object Instances

Object instances have no special properties beyond those inherited from the [Object prototype object](#sec-properties-of-the-object-prototype-object).

## 20.2 Function Objects

### 20.2.1 The Function Constructor

The Function [constructor](#constructor):

- is %Function%.
- is the initial value of the "Function" property of the [global object](#sec-global-object).
- creates and initializes a new [function object](#function-object) when called as a function rather than as a [constructor](#constructor). Thus the function call `Function(…)` is equivalent to the object creation expression `new Function(…)` with the same arguments.
- may be used as the value of an `extends` clause of a class definition. Subclass [constructors](#constructor) that intend to inherit the specified Function behaviour must include a `super` call to the Function [constructor](#constructor) to create and initialize a subclass instance with the internal slots necessary for built-in function behaviour. All ECMAScript syntactic forms for defining [function objects](#function-object) create instances of Function. There is no syntactic means to create instances of Function subclasses except for the built-in GeneratorFunction, AsyncFunction, and AsyncGeneratorFunction subclasses.

#### 20.2.1.1 Function ( ...`parameterArgs`, `bodyArg` )

The last argument (if any) specifies the body (executable code) of a function; any preceding arguments specify formal parameters.

This function performs the following steps when called:

1.  Let `C` be the [active function object](#active-function-object).
2.  If `bodyArg` is not present, set `bodyArg` to the empty String.
3.  Return ? [CreateDynamicFunction](#sec-createdynamicfunction)(`C`, NewTarget, normal, `parameterArgs`, `bodyArg`).

Note

It is permissible but not necessary to have one argument for each formal parameter to be specified. For example, all three of the following expressions produce the same result:

``` javascript
new Function("a", "b", "c", "return a+b+c")
new Function("a, b, c", "return a+b+c")
new Function("a,b", "c", "return a+b+c")
```

##### 20.2.1.1.1 CreateDynamicFunction ( `constructor`, `newTarget`, `kind`, `parameterArgs`, `bodyArg` )

The abstract operation CreateDynamicFunction takes arguments `constructor` (a [constructor](#constructor)), `newTarget` (a [constructor](#constructor) or undefined), `kind` (normal, generator, async, or async-generator), `parameterArgs` (a [List](#sec-list-and-record-specification-type) of [ECMAScript language values](#sec-ecmascript-language-types)), and `bodyArg` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) an ECMAScript [function object](#function-object) or a [throw completion](#sec-completion-record-specification-type). `constructor` is the [constructor](#constructor) function that is performing this action. `newTarget` is the [constructor](#constructor) that `new` was initially applied to. `parameterArgs` and `bodyArg` reflect the argument values that were passed to `constructor`. It performs the following steps when called:

1.  If `newTarget` is undefined, set `newTarget` to `constructor`.
2.  If `kind` is normal, then
    1.  Let `prefix` be "function".
    2.  Let `exprSym` be the grammar symbol [FunctionExpression](#prod-FunctionExpression).
    3.  Let `bodySym` be the grammar symbol [FunctionBody](#prod-FunctionBody)\[~Yield, ~Await\].
    4.  Let `parameterSym` be the grammar symbol [FormalParameters](#prod-FormalParameters)\[~Yield, ~Await\].
    5.  Let `fallbackProto` be "%Function.prototype%".
3.  Else if `kind` is generator, then
    1.  Let `prefix` be "function\*".
    2.  Let `exprSym` be the grammar symbol [GeneratorExpression](#prod-GeneratorExpression).
    3.  Let `bodySym` be the grammar symbol [GeneratorBody](#prod-GeneratorBody).
    4.  Let `parameterSym` be the grammar symbol [FormalParameters](#prod-FormalParameters)\[+Yield, ~Await\].
    5.  Let `fallbackProto` be "%GeneratorFunction.prototype%".
4.  Else if `kind` is async, then
    1.  Let `prefix` be "async function".
    2.  Let `exprSym` be the grammar symbol [AsyncFunctionExpression](#prod-AsyncFunctionExpression).
    3.  Let `bodySym` be the grammar symbol [AsyncFunctionBody](#prod-AsyncFunctionBody).
    4.  Let `parameterSym` be the grammar symbol [FormalParameters](#prod-FormalParameters)\[~Yield, +Await\].
    5.  Let `fallbackProto` be "%AsyncFunction.prototype%".
5.  Else,
    1.  [Assert](#assert): `kind` is async-generator.
    2.  Let `prefix` be "async function\*".
    3.  Let `exprSym` be the grammar symbol [AsyncGeneratorExpression](#prod-AsyncGeneratorExpression).
    4.  Let `bodySym` be the grammar symbol [AsyncGeneratorBody](#prod-AsyncGeneratorBody).
    5.  Let `parameterSym` be the grammar symbol [FormalParameters](#prod-FormalParameters)\[+Yield, +Await\].
    6.  Let `fallbackProto` be "%AsyncGeneratorFunction.prototype%".
6.  Let `argCount` be the number of elements in `parameterArgs`.
7.  Let `parameterStrings` be a new empty [List](#sec-list-and-record-specification-type).
8.  For each element `arg` of `parameterArgs`, do
    1.  Append ? [ToString](#sec-tostring)(`arg`) to `parameterStrings`.
9.  Let `bodyString` be ? [ToString](#sec-tostring)(`bodyArg`).
10. Let `currentRealm` be [the current Realm Record](#current-realm).
11. Perform ? [HostEnsureCanCompileStrings](#sec-hostensurecancompilestrings)(`currentRealm`, `parameterStrings`, `bodyString`, false).
12. Let `P` be the empty String.
13. If `argCount` \> 0, then
    1.  Set `P` to `parameterStrings`\[0\].
    2.  Let `k` be 1.
    3.  Repeat, while `k` \< `argCount`,
        1.  Let `nextArgString` be `parameterStrings`\[`k`\].
        2.  Set `P` to the [string-concatenation](#string-concatenation) of `P`, "," (a comma), and `nextArgString`.
        3.  Set `k` to `k` + 1.
14. Let `bodyParseString` be the [string-concatenation](#string-concatenation) of 0x000A (LINE FEED), `bodyString`, and 0x000A (LINE FEED).
15. Let `sourceString` be the [string-concatenation](#string-concatenation) of `prefix`, " anonymous(", `P`, 0x000A (LINE FEED), ") {", `bodyParseString`, and "}".
16. Let `sourceText` be [StringToCodePoints](#sec-stringtocodepoints)(`sourceString`).
17. Let `parameters` be [ParseText](#sec-parsetext)(`P`, `parameterSym`).
18. If `parameters` is a [List](#sec-list-and-record-specification-type) of errors, throw a SyntaxError exception.
19. Let `body` be [ParseText](#sec-parsetext)(`bodyParseString`, `bodySym`).
20. If `body` is a [List](#sec-list-and-record-specification-type) of errors, throw a SyntaxError exception.
21. NOTE: The parameters and body are parsed separately to ensure that each is valid alone. For example, `new Function("/*", "*/ ) {")` does not evaluate to a function.
22. NOTE: If this step is reached, `sourceText` must have the syntax of `exprSym` (although the reverse implication does not hold). The purpose of the next two steps is to enforce any Early Error rules which apply to `exprSym` directly.
23. Let `expr` be [ParseText](#sec-parsetext)(`sourceText`, `exprSym`).
24. If `expr` is a [List](#sec-list-and-record-specification-type) of errors, throw a SyntaxError exception.
25. Let `proto` be ? [GetPrototypeFromConstructor](#sec-getprototypefromconstructor)(`newTarget`, `fallbackProto`).
26. Let `env` be `currentRealm`.`[[GlobalEnv]]`.
27. Let `privateEnv` be null.
28. Let `F` be [OrdinaryFunctionCreate](#sec-ordinaryfunctioncreate)(`proto`, `sourceText`, `parameters`, `body`, non-lexical-this, `env`, `privateEnv`).
29. Perform [SetFunctionName](#sec-setfunctionname)(`F`, "anonymous").
30. If `kind` is generator, then
    1.  Let `prototype` be [OrdinaryObjectCreate](#sec-ordinaryobjectcreate)([%GeneratorPrototype%](#sec-properties-of-generator-prototype)).
    2.  Perform ! [DefinePropertyOrThrow](#sec-definepropertyorthrow)(`F`, "prototype", PropertyDescriptor { `[[Value]]`: `prototype`, `[[Writable]]`: true, `[[Enumerable]]`: false, `[[Configurable]]`: false }).
31. Else if `kind` is async-generator, then
    1.  Let `prototype` be [OrdinaryObjectCreate](#sec-ordinaryobjectcreate)([%AsyncGeneratorPrototype%](#sec-properties-of-asyncgenerator-prototype)).
    2.  Perform ! [DefinePropertyOrThrow](#sec-definepropertyorthrow)(`F`, "prototype", PropertyDescriptor { `[[Value]]`: `prototype`, `[[Writable]]`: true, `[[Enumerable]]`: false, `[[Configurable]]`: false }).
32. Else if `kind` is normal, then
    1.  Perform [MakeConstructor](#sec-makeconstructor)(`F`).
33. NOTE: Functions whose `kind` is async are not constructable and do not have a `[[Construct]]` internal method or a "prototype" property.
34. Return `F`.

Note

CreateDynamicFunction defines a "prototype" property on any function it creates whose `kind` is not async to provide for the possibility that the function will be used as a [constructor](#constructor).

### 20.2.2 Properties of the Function Constructor

The Function [constructor](#constructor):

- is itself a built-in [function object](#function-object).
- has a `[[Prototype]]` internal slot whose value is [%Function.prototype%](#sec-properties-of-the-function-prototype-object).
- has a "length" property whose value is 1_(𝔽).
- has the following properties:

#### 20.2.2.1 Function.prototype

The value of `Function.prototype` is the [Function prototype object](#sec-properties-of-the-function-prototype-object).

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

### 20.2.3 Properties of the Function Prototype Object

The Function prototype object:

- is %Function.prototype%.
- is itself a built-in [function object](#function-object).
- accepts any arguments and returns undefined when invoked.
- does not have a `[[Construct]]` internal method; it cannot be used as a [constructor](#constructor) with the `new` operator.
- has a `[[Prototype]]` internal slot whose value is [%Object.prototype%](#sec-properties-of-the-object-prototype-object).
- does not have a "prototype" property.
- has a "length" property whose value is +0_(𝔽).
- has a "name" property whose value is the empty String.

Note

The Function prototype object is specified to be a [function object](#function-object) to ensure compatibility with ECMAScript code that was created prior to the ECMAScript 2015 specification.

#### 20.2.3.1 Function.prototype.apply ( `thisArg`, `argArray` )

This method performs the following steps when called:

1.  Let `func` be the this value.
2.  If [IsCallable](#sec-iscallable)(`func`) is false, throw a TypeError exception.
3.  If `argArray` is either undefined or null, then
    1.  Perform [PrepareForTailCall](#sec-preparefortailcall)().
    2.  Return ? [Call](#sec-call)(`func`, `thisArg`).
4.  Let `argList` be ? [CreateListFromArrayLike](#sec-createlistfromarraylike)(`argArray`).
5.  Perform [PrepareForTailCall](#sec-preparefortailcall)().
6.  Return ? [Call](#sec-call)(`func`, `thisArg`, `argList`).

Note 1

The `thisArg` value is passed without modification as the this value. This is a change from Edition 3, where an undefined or null `thisArg` is replaced with the [global object](#sec-global-object) and [ToObject](#sec-toobject) is applied to all other values and that result is passed as the this value. Even though the `thisArg` is passed without modification, [non-strict functions](#non-strict-function) still perform these transformations upon entry to the function.

Note 2

If `func` is either an arrow function or a [bound function exotic object](#bound-function-exotic-object), then the `thisArg` will be ignored by the function `[[Call]]` in step [6](#step-function-proto-apply-call).

#### 20.2.3.2 Function.prototype.bind ( `thisArg`, ...`args` )

This method performs the following steps when called:

1.  Let `Target` be the this value.
2.  If [IsCallable](#sec-iscallable)(`Target`) is false, throw a TypeError exception.
3.  Let `F` be ? [BoundFunctionCreate](#sec-boundfunctioncreate)(`Target`, `thisArg`, `args`).
4.  Let `L` be 0.
5.  Let `targetHasLength` be ? [HasOwnProperty](#sec-hasownproperty)(`Target`, "length").
6.  If `targetHasLength` is true, then
    1.  Let `targetLen` be ? [Get](#sec-get-o-p)(`Target`, "length").
    2.  If `targetLen` [is a Number](#sec-ecmascript-language-types-number-type), then
        1.  If `targetLen` is +∞_(𝔽), then
            1.  Set `L` to +∞.
        2.  Else if `targetLen` is -∞_(𝔽), then
            1.  Set `L` to 0.
        3.  Else,
            1.  Let `targetLenAsInt` be ! [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`targetLen`).
            2.  [Assert](#assert): `targetLenAsInt` is [finite](#finite).
            3.  Let `argCount` be the number of elements in `args`.
            4.  Set `L` to [max](#eqn-max)(`targetLenAsInt` - `argCount`, 0).
7.  Perform [SetFunctionLength](#sec-setfunctionlength)(`F`, `L`).
8.  Let `targetName` be ? [Get](#sec-get-o-p)(`Target`, "name").
9.  If `targetName` [is not a String](#sec-ecmascript-language-types-string-type), set `targetName` to the empty String.
10. Perform [SetFunctionName](#sec-setfunctionname)(`F`, `targetName`, "bound").
11. Return `F`.

Note 1

[Function objects](#function-object) created using `Function.prototype.bind` are [exotic objects](#exotic-object). They also do not have a "prototype" property.

Note 2

If `Target` is either an arrow function or a [bound function exotic object](#bound-function-exotic-object), then the `thisArg` passed to this method will not be used by subsequent calls to `F`.

#### 20.2.3.3 Function.prototype.call ( `thisArg`, ...`args` )

This method performs the following steps when called:

1.  Let `func` be the this value.
2.  If [IsCallable](#sec-iscallable)(`func`) is false, throw a TypeError exception.
3.  Perform [PrepareForTailCall](#sec-preparefortailcall)().
4.  Return ? [Call](#sec-call)(`func`, `thisArg`, `args`).

Note 1

The `thisArg` value is passed without modification as the this value. This is a change from Edition 3, where an undefined or null `thisArg` is replaced with the [global object](#sec-global-object) and [ToObject](#sec-toobject) is applied to all other values and that result is passed as the this value. Even though the `thisArg` is passed without modification, [non-strict functions](#non-strict-function) still perform these transformations upon entry to the function.

Note 2

If `func` is either an arrow function or a [bound function exotic object](#bound-function-exotic-object), then the `thisArg` will be ignored by the function `[[Call]]` in step [4](#step-function-proto-call-call).

#### 20.2.3.4 Function.prototype.constructor

The initial value of `Function.prototype.constructor` is [%Function%](#sec-function-constructor).

#### 20.2.3.5 Function.prototype.toString ( )

This method performs the following steps when called:

1.  Let `func` be the this value.
2.  If `func` [is an Object](#sec-object-type), `func` has a `[[SourceText]]` internal slot, `func`.`[[SourceText]]` is a sequence of Unicode code points, and [HostHasSourceTextAvailable](#sec-hosthassourcetextavailable)(`func`) is true, then
    1.  Return [CodePointsToString](#sec-codepointstostring)(`func`.`[[SourceText]]`).
3.  If `func` is a [built-in function object](#sec-built-in-function-objects), return an [implementation-defined](#implementation-defined) String source code representation of `func`. The representation must have the syntax of a [NativeFunction](#prod-NativeFunction). Additionally, if `func` has an `[[InitialName]]` internal slot and `func`.`[[InitialName]]` [is a String](#sec-ecmascript-language-types-string-type), the portion of the returned String that would be matched by [NativeFunctionAccessor](#prod-NativeFunctionAccessor)opt [PropertyName](#prod-PropertyName) must be the value of `func`.`[[InitialName]]`.
4.  If `func` [is an Object](#sec-object-type) and [IsCallable](#sec-iscallable)(`func`) is true, return an [implementation-defined](#implementation-defined) String source code representation of `func`. The representation must have the syntax of a [NativeFunction](#prod-NativeFunction).
5.  Throw a TypeError exception.

[NativeFunction](#prod-NativeFunction) : function [NativeFunctionAccessor](#prod-NativeFunctionAccessor)opt [PropertyName](#prod-PropertyName)\[~Yield, ~Await\]opt ( [FormalParameters](#prod-FormalParameters)\[~Yield, ~Await\] ) { \[ native code \] } [NativeFunctionAccessor](#prod-NativeFunctionAccessor) : get set

#### 20.2.3.6 Function.prototype \[ %Symbol.hasInstance% \] ( `V` )

This method performs the following steps when called:

1.  Let `F` be the this value.
2.  Return ? [OrdinaryHasInstance](#sec-ordinaryhasinstance)(`F`, `V`).

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

Note

This is the default implementation of `%Symbol.hasInstance%` that most functions inherit. `%Symbol.hasInstance%` is called by the `instanceof` operator to determine whether a value is an instance of a specific [constructor](#constructor). An expression such as

``` javascript
v instanceof F
```

evaluates as

``` javascript
F[%Symbol.hasInstance%](v)
```

A [constructor](#constructor) function can control which objects are recognized as its instances by `instanceof` by exposing a different `%Symbol.hasInstance%` method on the function.

This property is non-writable and non-configurable to prevent tampering that could be used to globally expose the target function of a bound function.

The value of the "name" property of this method is "\[Symbol.hasInstance\]".

### 20.2.4 Function Instances

Every Function instance is an ECMAScript [function object](#function-object) and has the internal slots listed in [Table 30](#table-internal-slots-of-ecmascript-function-objects). [Function objects](#function-object) created using the `Function.prototype.bind` method ([20.2.3.2](#sec-function.prototype.bind)) have the internal slots listed in [Table 31](#table-internal-slots-of-bound-function-exotic-objects).

Function instances have the following properties:

#### 20.2.4.1 length

The value of the "length" property is an [integral Number](#integral-number) that indicates the typical number of arguments expected by the function. However, the language permits the function to be invoked with some other number of arguments. The behaviour of a function when invoked on a number of arguments other than the number specified by its "length" property depends on the function. This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: true }.

#### 20.2.4.2 name

The value of the "name" property [is a String](#sec-ecmascript-language-types-string-type) that is descriptive of the function. The name has no semantic significance but is typically a variable or [property name](#property-name) that is used to refer to the function at its point of definition in [ECMAScript source text](#sec-source-text). This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: true }.

Anonymous functions objects that do not have a contextual name associated with them by this specification use the empty String as the value of the "name" property.

#### 20.2.4.3 prototype

Function instances that can be used as a [constructor](#constructor) have a "prototype" property. Whenever such a Function instance is created another [ordinary object](#ordinary-object) is also created and is the initial value of the function's "prototype" property. Unless otherwise specified, the value of the "prototype" property is used to initialize the `[[Prototype]]` internal slot of the object created when that function is invoked as a [constructor](#constructor).

This property has the attributes { `[[Writable]]`: true, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

Note

[Function objects](#function-object) created using `Function.prototype.bind`, or by evaluating a [MethodDefinition](#prod-MethodDefinition) (that is not a [GeneratorMethod](#prod-GeneratorMethod) or [AsyncGeneratorMethod](#prod-AsyncGeneratorMethod)) or an [ArrowFunction](#prod-ArrowFunction) do not have a "prototype" property.

### 20.2.5 HostHasSourceTextAvailable ( `func` )

The [host-defined](#host-defined) abstract operation HostHasSourceTextAvailable takes argument `func` (a [function object](#function-object)) and returns a Boolean. It allows [host environments](#host-environment) to prevent the source text from being provided for `func`.

An implementation of HostHasSourceTextAvailable must conform to the following requirements:

- It must be deterministic with respect to its parameters. Each time it is called with a specific `func` as its argument, it must return the same result.

The default implementation of HostHasSourceTextAvailable is to return true.

## 20.3 Boolean Objects

### 20.3.1 The Boolean Constructor

The Boolean [constructor](#constructor):

- is %Boolean%.
- is the initial value of the "Boolean" property of the [global object](#sec-global-object).
- creates and initializes a new Boolean object when called as a [constructor](#constructor).
- performs a type conversion when called as a function rather than as a [constructor](#constructor).
- may be used as the value of an `extends` clause of a class definition. Subclass [constructors](#constructor) that intend to inherit the specified Boolean behaviour must include a `super` call to the Boolean [constructor](#constructor) to create and initialize the subclass instance with a `[[BooleanData]]` internal slot.

#### 20.3.1.1 Boolean ( `value` )

This function performs the following steps when called:

1.  Let `b` be [ToBoolean](#sec-toboolean)(`value`).
2.  If NewTarget is undefined, return `b`.
3.  Let `O` be ? [OrdinaryCreateFromConstructor](#sec-ordinarycreatefromconstructor)(NewTarget, "%Boolean.prototype%", « `[[BooleanData]]` »).
4.  Set `O`.`[[BooleanData]]` to `b`.
5.  Return `O`.

### 20.3.2 Properties of the Boolean Constructor

The Boolean [constructor](#constructor):

- has a `[[Prototype]]` internal slot whose value is [%Function.prototype%](#sec-properties-of-the-function-prototype-object).
- has the following properties:

#### 20.3.2.1 Boolean.prototype

The initial value of `Boolean.prototype` is the [Boolean prototype object](#sec-properties-of-the-boolean-prototype-object).

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

### 20.3.3 Properties of the Boolean Prototype Object

The Boolean prototype object:

- is %Boolean.prototype%.
- is an [ordinary object](#ordinary-object).
- is itself a Boolean object; it has a `[[BooleanData]]` internal slot with the value false.
- has a `[[Prototype]]` internal slot whose value is [%Object.prototype%](#sec-properties-of-the-object-prototype-object).

#### 20.3.3.1 Boolean.prototype.constructor

The initial value of `Boolean.prototype.constructor` is [%Boolean%](#sec-boolean-constructor).

#### 20.3.3.2 Boolean.prototype.toString ( )

This method performs the following steps when called:

1.  Let `b` be ? [ThisBooleanValue](#sec-thisbooleanvalue)(this value).
2.  If `b` is true, return "true"; else return "false".

#### 20.3.3.3 Boolean.prototype.valueOf ( )

This method performs the following steps when called:

1.  Return ? [ThisBooleanValue](#sec-thisbooleanvalue)(this value).

##### 20.3.3.3.1 ThisBooleanValue ( `value` )

The abstract operation ThisBooleanValue takes argument `value` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a Boolean or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  If `value` [is a Boolean](#sec-ecmascript-language-types-boolean-type), return `value`.
2.  If `value` [is an Object](#sec-object-type) and `value` has a `[[BooleanData]]` internal slot, then
    1.  Let `b` be `value`.`[[BooleanData]]`.
    2.  [Assert](#assert): `b` [is a Boolean](#sec-ecmascript-language-types-boolean-type).
    3.  Return `b`.
3.  Throw a TypeError exception.

### 20.3.4 Properties of Boolean Instances

Boolean instances are [ordinary objects](#ordinary-object) that inherit properties from the [Boolean prototype object](#sec-properties-of-the-boolean-prototype-object). Boolean instances have a `[[BooleanData]]` internal slot. The `[[BooleanData]]` internal slot is the Boolean value represented by this Boolean object.

## 20.4 Symbol Objects

### 20.4.1 The Symbol Constructor

The Symbol [constructor](#constructor):

- is %Symbol%.
- is the initial value of the "Symbol" property of the [global object](#sec-global-object).
- returns a new Symbol value when called as a function.
- is not intended to be used with the `new` operator.
- is not intended to be subclassed.
- may be used as the value of an `extends` clause of a class definition but a `super` call to it will cause an exception.

#### 20.4.1.1 Symbol ( \[ `description` \] )

This function performs the following steps when called:

1.  If NewTarget is not undefined, throw a TypeError exception.
2.  If `description` is undefined, let `descString` be undefined.
3.  Else, let `descString` be ? [ToString](#sec-tostring)(`description`).
4.  Return a new Symbol whose `[[Description]]` is `descString`.

### 20.4.2 Properties of the Symbol Constructor

The Symbol [constructor](#constructor):

- has a `[[Prototype]]` internal slot whose value is [%Function.prototype%](#sec-properties-of-the-function-prototype-object).
- has the following properties:

#### 20.4.2.1 Symbol.asyncIterator

The initial value of `Symbol.asyncIterator` is the well-known symbol [%Symbol.asyncIterator%](#sec-well-known-symbols) ([Table 1](#table-well-known-symbols)).

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

#### 20.4.2.2 Symbol.for ( `key` )

This function performs the following steps when called:

1.  Let `stringKey` be ? [ToString](#sec-tostring)(`key`).
2.  For each element `e` of the [GlobalSymbolRegistry List](#sec-symbol.for), do
    1.  If `e`.`[[Key]]` is `stringKey`, return `e`.`[[Symbol]]`.
3.  [Assert](#assert): The [GlobalSymbolRegistry List](#sec-symbol.for) does not currently contain an entry for `stringKey`.
4.  Let `newSymbol` be a new Symbol whose `[[Description]]` is `stringKey`.
5.  Append the GlobalSymbolRegistry [Record](#sec-list-and-record-specification-type) { `[[Key]]`: `stringKey`, `[[Symbol]]`: `newSymbol` } to the [GlobalSymbolRegistry List](#sec-symbol.for).
6.  Return `newSymbol`.

The GlobalSymbolRegistry List is an append-only [List](#sec-list-and-record-specification-type) that is globally available. It is shared by all [realms](#realm). Prior to the evaluation of any ECMAScript code, it is initialized as a new empty [List](#sec-list-and-record-specification-type). Elements of the GlobalSymbolRegistry List are [Records](#sec-list-and-record-specification-type) with the structure defined in [Table 63](#table-globalsymbolregistry-record-fields).

| Field Name | Value | Usage |
|----|----|----|
| `[[Key]]` | a String | A string key used to globally identify a Symbol. |
| `[[Symbol]]` | a Symbol | A symbol that can be retrieved from any [realm](#realm). |

Table 63: GlobalSymbolRegistry [Record](#sec-list-and-record-specification-type) Fields

#### 20.4.2.3 Symbol.hasInstance

The initial value of `Symbol.hasInstance` is the well-known symbol [%Symbol.hasInstance%](#sec-well-known-symbols) ([Table 1](#table-well-known-symbols)).

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

#### 20.4.2.4 Symbol.isConcatSpreadable

The initial value of `Symbol.isConcatSpreadable` is the well-known symbol [%Symbol.isConcatSpreadable%](#sec-well-known-symbols) ([Table 1](#table-well-known-symbols)).

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

#### 20.4.2.5 Symbol.iterator

The initial value of `Symbol.iterator` is the well-known symbol [%Symbol.iterator%](#sec-well-known-symbols) ([Table 1](#table-well-known-symbols)).

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

#### 20.4.2.6 Symbol.keyFor ( `sym` )

This function performs the following steps when called:

1.  If `sym` [is not a Symbol](#sec-ecmascript-language-types-symbol-type), throw a TypeError exception.
2.  Return [KeyForSymbol](#sec-keyforsymbol)(`sym`).

#### 20.4.2.7 Symbol.match

The initial value of `Symbol.match` is the well-known symbol [%Symbol.match%](#sec-well-known-symbols) ([Table 1](#table-well-known-symbols)).

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

#### 20.4.2.8 Symbol.matchAll

The initial value of `Symbol.matchAll` is the well-known symbol [%Symbol.matchAll%](#sec-well-known-symbols) ([Table 1](#table-well-known-symbols)).

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

#### 20.4.2.9 Symbol.prototype

The initial value of `Symbol.prototype` is the [Symbol prototype object](#sec-properties-of-the-symbol-prototype-object).

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

#### 20.4.2.10 Symbol.replace

The initial value of `Symbol.replace` is the well-known symbol [%Symbol.replace%](#sec-well-known-symbols) ([Table 1](#table-well-known-symbols)).

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

#### 20.4.2.11 Symbol.search

The initial value of `Symbol.search` is the well-known symbol [%Symbol.search%](#sec-well-known-symbols) ([Table 1](#table-well-known-symbols)).

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

#### 20.4.2.12 Symbol.species

The initial value of `Symbol.species` is the well-known symbol [%Symbol.species%](#sec-well-known-symbols) ([Table 1](#table-well-known-symbols)).

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

#### 20.4.2.13 Symbol.split

The initial value of `Symbol.split` is the well-known symbol [%Symbol.split%](#sec-well-known-symbols) ([Table 1](#table-well-known-symbols)).

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

#### 20.4.2.14 Symbol.toPrimitive

The initial value of `Symbol.toPrimitive` is the well-known symbol [%Symbol.toPrimitive%](#sec-well-known-symbols) ([Table 1](#table-well-known-symbols)).

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

#### 20.4.2.15 Symbol.toStringTag

The initial value of `Symbol.toStringTag` is the well-known symbol [%Symbol.toStringTag%](#sec-well-known-symbols) ([Table 1](#table-well-known-symbols)).

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

#### 20.4.2.16 Symbol.unscopables

The initial value of `Symbol.unscopables` is the well-known symbol [%Symbol.unscopables%](#sec-well-known-symbols) ([Table 1](#table-well-known-symbols)).

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

### 20.4.3 Properties of the Symbol Prototype Object

The Symbol prototype object:

- is %Symbol.prototype%.
- is an [ordinary object](#ordinary-object).
- [is not a Symbol](#sec-ecmascript-language-types-symbol-type) instance and does not have a `[[SymbolData]]` internal slot.
- has a `[[Prototype]]` internal slot whose value is [%Object.prototype%](#sec-properties-of-the-object-prototype-object).

#### 20.4.3.1 Symbol.prototype.constructor

The initial value of `Symbol.prototype.constructor` is [%Symbol%](#sec-symbol-constructor).

#### 20.4.3.2 get Symbol.prototype.description

`Symbol.prototype.description` is an [accessor property](#sec-object-type) whose set accessor function is undefined. Its get accessor function performs the following steps when called:

1.  Let `s` be the this value.
2.  Let `sym` be ? [ThisSymbolValue](#sec-thissymbolvalue)(`s`).
3.  Return `sym`.`[[Description]]`.

#### 20.4.3.3 Symbol.prototype.toString ( )

This method performs the following steps when called:

1.  Let `sym` be ? [ThisSymbolValue](#sec-thissymbolvalue)(this value).
2.  Return [SymbolDescriptiveString](#sec-symboldescriptivestring)(`sym`).

##### 20.4.3.3.1 SymbolDescriptiveString ( `sym` )

The abstract operation SymbolDescriptiveString takes argument `sym` (a Symbol) and returns a String. It performs the following steps when called:

1.  Let `desc` be `sym`'s `[[Description]]` value.
2.  If `desc` is undefined, set `desc` to the empty String.
3.  [Assert](#assert): `desc` [is a String](#sec-ecmascript-language-types-string-type).
4.  Return the [string-concatenation](#string-concatenation) of "Symbol(", `desc`, and ")".

#### 20.4.3.4 Symbol.prototype.valueOf ( )

This method performs the following steps when called:

1.  Return ? [ThisSymbolValue](#sec-thissymbolvalue)(this value).

##### 20.4.3.4.1 ThisSymbolValue ( `value` )

The abstract operation ThisSymbolValue takes argument `value` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a Symbol or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  If `value` [is a Symbol](#sec-ecmascript-language-types-symbol-type), return `value`.
2.  If `value` [is an Object](#sec-object-type) and `value` has a `[[SymbolData]]` internal slot, then
    1.  Let `s` be `value`.`[[SymbolData]]`.
    2.  [Assert](#assert): `s` [is a Symbol](#sec-ecmascript-language-types-symbol-type).
    3.  Return `s`.
3.  Throw a TypeError exception.

#### 20.4.3.5 Symbol.prototype \[ %Symbol.toPrimitive% \] ( `hint` )

This method is called by ECMAScript language operators to convert a Symbol object to a primitive value.

It performs the following steps when called:

1.  Return ? [ThisSymbolValue](#sec-thissymbolvalue)(this value).

Note

The argument is ignored.

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: true }.

The value of the "name" property of this method is "\[Symbol.toPrimitive\]".

#### 20.4.3.6 Symbol.prototype \[ %Symbol.toStringTag% \]

The initial value of the [%Symbol.toStringTag%](#sec-well-known-symbols) property is the String value "Symbol".

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: true }.

### 20.4.4 Properties of Symbol Instances

Symbol instances are [ordinary objects](#ordinary-object) that inherit properties from the [Symbol prototype object](#sec-properties-of-the-symbol-prototype-object). Symbol instances have a `[[SymbolData]]` internal slot. The `[[SymbolData]]` internal slot is the Symbol value represented by this Symbol object.

### 20.4.5 Abstract Operations for Symbols

#### 20.4.5.1 KeyForSymbol ( `sym` )

The abstract operation KeyForSymbol takes argument `sym` (a Symbol) and returns a String or undefined. If `sym` is in the [GlobalSymbolRegistry List](#sec-symbol.for), the String used to register `sym` will be returned. It performs the following steps when called:

1.  For each element `e` of the [GlobalSymbolRegistry List](#sec-symbol.for), do
    1.  If [SameValue](#sec-samevalue)(`e`.`[[Symbol]]`, `sym`) is true, return `e`.`[[Key]]`.
2.  [Assert](#assert): The [GlobalSymbolRegistry List](#sec-symbol.for) does not currently contain an entry for `sym`.
3.  Return undefined.

## 20.5 Error Objects

Instances of Error objects are thrown as exceptions when runtime errors occur. The Error objects may also serve as base objects for user-defined exception classes.

When an ECMAScript implementation detects a runtime error, it throws a new instance of one of the `NativeError` objects defined in [20.5.5](#sec-native-error-types-used-in-this-standard) or a new instance of the AggregateError object defined in [20.5.7](#sec-aggregate-error-objects).

### 20.5.1 The Error Constructor

The Error [constructor](#constructor):

- is %Error%.
- is the initial value of the "Error" property of the [global object](#sec-global-object).
- creates and initializes a new Error object when called as a function rather than as a [constructor](#constructor). Thus the function call `Error(…)` is equivalent to the object creation expression `new Error(…)` with the same arguments.
- may be used as the value of an `extends` clause of a class definition. Subclass [constructors](#constructor) that intend to inherit the specified Error behaviour must include a `super` call to the Error [constructor](#constructor) to create and initialize subclass instances with an `[[ErrorData]]` internal slot.

#### 20.5.1.1 Error ( `message` \[ , `options` \] )

This function performs the following steps when called:

1.  If NewTarget is undefined, let `newTarget` be the [active function object](#active-function-object); else let `newTarget` be NewTarget.
2.  Let `O` be ? [OrdinaryCreateFromConstructor](#sec-ordinarycreatefromconstructor)(`newTarget`, "%Error.prototype%", « `[[ErrorData]]` »).
3.  If `message` is not undefined, then
    1.  Let `msg` be ? [ToString](#sec-tostring)(`message`).
    2.  Perform [CreateNonEnumerableDataPropertyOrThrow](#sec-createnonenumerabledatapropertyorthrow)(`O`, "message", `msg`).
4.  Perform ? [InstallErrorCause](#sec-installerrorcause)(`O`, `options`).
5.  Return `O`.

### 20.5.2 Properties of the Error Constructor

The Error [constructor](#constructor):

- has a `[[Prototype]]` internal slot whose value is [%Function.prototype%](#sec-properties-of-the-function-prototype-object).
- has the following properties:

#### 20.5.2.1 Error.prototype

The initial value of `Error.prototype` is the [Error prototype object](#sec-properties-of-the-error-prototype-object).

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

### 20.5.3 Properties of the Error Prototype Object

The Error prototype object:

- is %Error.prototype%.
- is an [ordinary object](#ordinary-object).
- is not an Error instance and does not have an `[[ErrorData]]` internal slot.
- has a `[[Prototype]]` internal slot whose value is [%Object.prototype%](#sec-properties-of-the-object-prototype-object).

#### 20.5.3.1 Error.prototype.constructor

The initial value of `Error.prototype.constructor` is [%Error%](#sec-error-constructor).

#### 20.5.3.2 Error.prototype.message

The initial value of `Error.prototype.message` is the empty String.

#### 20.5.3.3 Error.prototype.name

The initial value of `Error.prototype.name` is "Error".

#### 20.5.3.4 Error.prototype.toString ( )

This method performs the following steps when called:

1.  Let `O` be the this value.
2.  If `O` [is not an Object](#sec-object-type), throw a TypeError exception.
3.  Let `name` be ? [Get](#sec-get-o-p)(`O`, "name").
4.  If `name` is undefined, set `name` to "Error"; otherwise set `name` to ? [ToString](#sec-tostring)(`name`).
5.  Let `msg` be ? [Get](#sec-get-o-p)(`O`, "message").
6.  If `msg` is undefined, set `msg` to the empty String; otherwise set `msg` to ? [ToString](#sec-tostring)(`msg`).
7.  If `name` is the empty String, return `msg`.
8.  If `msg` is the empty String, return `name`.
9.  Return the [string-concatenation](#string-concatenation) of `name`, the code unit 0x003A (COLON), the code unit 0x0020 (SPACE), and `msg`.

### 20.5.4 Properties of Error Instances

Error instances are [ordinary objects](#ordinary-object) that inherit properties from the [Error prototype object](#sec-properties-of-the-error-prototype-object) and have an `[[ErrorData]]` internal slot whose value is undefined. The only specified uses of `[[ErrorData]]` is to identify Error, AggregateError, and `NativeError` instances as Error objects within `Object.prototype.toString`.

### 20.5.5 Native Error Types Used in This Standard

A new instance of one of the `NativeError` objects below or of the AggregateError object is thrown when a runtime error is detected. All `NativeError` objects share the same structure, as described in [20.5.6](#sec-nativeerror-object-structure).

#### 20.5.5.1 EvalError

The EvalError [constructor](#constructor) is %EvalError%.

This exception is not currently used within this specification. This object remains for compatibility with previous editions of this specification.

#### 20.5.5.2 RangeError

The RangeError [constructor](#constructor) is %RangeError%.

Indicates a value that is not in the set or range of allowable values.

#### 20.5.5.3 ReferenceError

The ReferenceError [constructor](#constructor) is %ReferenceError%.

Indicate that an invalid reference has been detected.

#### 20.5.5.4 SyntaxError

The SyntaxError [constructor](#constructor) is %SyntaxError%.

Indicates that a parsing error has occurred.

#### 20.5.5.5 TypeError

The TypeError [constructor](#constructor) is %TypeError%.

TypeError is used to indicate an unsuccessful operation when none of the other `NativeError` objects are an appropriate indication of the failure cause.

#### 20.5.5.6 URIError

The URIError [constructor](#constructor) is %URIError%.

Indicates that one of the global URI handling functions was used in a way that is incompatible with its definition.

### 20.5.6 `NativeError` Object Structure

Each of these objects has the structure described below, differing only in the name used as the [constructor](#constructor) name and in the "name" property of the prototype object.

For each error object, references to `NativeError` in the definition should be replaced with the appropriate error object name from [20.5.5](#sec-native-error-types-used-in-this-standard).

#### 20.5.6.1 The `NativeError` Constructors

Each `NativeError` [constructor](#constructor):

- creates and initializes a new `NativeError` object when called as a function rather than as a [constructor](#constructor). A call of the object as a function is equivalent to calling it as a [constructor](#constructor) with the same arguments. Thus the function call `NativeError``(…)` is equivalent to the object creation expression `new ``NativeError``(…)` with the same arguments.
- may be used as the value of an `extends` clause of a class definition. Subclass [constructors](#constructor) that intend to inherit the specified `NativeError` behaviour must include a `super` call to the `NativeError` [constructor](#constructor) to create and initialize subclass instances with an `[[ErrorData]]` internal slot.

##### 20.5.6.1.1 `NativeError` ( `message` \[ , `options` \] )

Each `NativeError` function performs the following steps when called:

1.  If NewTarget is undefined, let `newTarget` be the [active function object](#active-function-object); else let `newTarget` be NewTarget.
2.  Let `O` be ? [OrdinaryCreateFromConstructor](#sec-ordinarycreatefromconstructor)(`newTarget`, `"%``NativeError``.prototype%"`, « `[[ErrorData]]` »).
3.  If `message` is not undefined, then
    1.  Let `msg` be ? [ToString](#sec-tostring)(`message`).
    2.  Perform [CreateNonEnumerableDataPropertyOrThrow](#sec-createnonenumerabledatapropertyorthrow)(`O`, "message", `msg`).
4.  Perform ? [InstallErrorCause](#sec-installerrorcause)(`O`, `options`).
5.  Return `O`.

The actual value of the string passed in step [2](#step-nativeerror-ordinarycreatefromconstructor) is either "%EvalError.prototype%", "%RangeError.prototype%", "%ReferenceError.prototype%", "%SyntaxError.prototype%", "%TypeError.prototype%", or "%URIError.prototype%" corresponding to which `NativeError` [constructor](#constructor) is being defined.

#### 20.5.6.2 Properties of the `NativeError` Constructors

Each `NativeError` [constructor](#constructor):

- has a `[[Prototype]]` internal slot whose value is [%Error%](#sec-error-constructor).
- has a "name" property whose value is the String value "`NativeError`".
- has the following properties:

##### 20.5.6.2.1 `NativeError`.prototype

The initial value of `NativeError``.prototype` is a `NativeError` prototype object ([20.5.6.3](#sec-properties-of-the-nativeerror-prototype-objects)). Each `NativeError` [constructor](#constructor) has a distinct prototype object.

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

#### 20.5.6.3 Properties of the `NativeError` Prototype Objects

Each `NativeError` prototype object:

- is an [ordinary object](#ordinary-object).
- is not an Error instance and does not have an `[[ErrorData]]` internal slot.
- has a `[[Prototype]]` internal slot whose value is [%Error.prototype%](#sec-properties-of-the-error-prototype-object).

##### 20.5.6.3.1 `NativeError`.prototype.constructor

The initial value of the "constructor" property of the prototype for a given `NativeError` [constructor](#constructor) is the [constructor](#constructor) itself.

##### 20.5.6.3.2 `NativeError`.prototype.message

The initial value of the "message" property of the prototype for a given `NativeError` [constructor](#constructor) is the empty String.

##### 20.5.6.3.3 `NativeError`.prototype.name

The initial value of the "name" property of the prototype for a given `NativeError` [constructor](#constructor) is the String value consisting of the name of the [constructor](#constructor) (the name used instead of `NativeError`).

#### 20.5.6.4 Properties of `NativeError` Instances

`NativeError` instances are [ordinary objects](#ordinary-object) that inherit properties from their `NativeError` prototype object and have an `[[ErrorData]]` internal slot whose value is undefined. The only specified use of `[[ErrorData]]` is by `Object.prototype.toString` ([20.1.3.6](#sec-object.prototype.tostring)) to identify Error, AggregateError, or `NativeError` instances.

### 20.5.7 AggregateError Objects

#### 20.5.7.1 The AggregateError Constructor

The AggregateError [constructor](#constructor):

- is %AggregateError%.
- is the initial value of the "AggregateError" property of the [global object](#sec-global-object).
- creates and initializes a new AggregateError object when called as a function rather than as a [constructor](#constructor). Thus the function call `AggregateError(…)` is equivalent to the object creation expression `new AggregateError(…)` with the same arguments.
- may be used as the value of an `extends` clause of a class definition. Subclass [constructors](#constructor) that intend to inherit the specified AggregateError behaviour must include a `super` call to the AggregateError [constructor](#constructor) to create and initialize subclass instances with an `[[ErrorData]]` internal slot.

##### 20.5.7.1.1 AggregateError ( `errors`, `message` \[ , `options` \] )

This function performs the following steps when called:

1.  If NewTarget is undefined, let `newTarget` be the [active function object](#active-function-object); else let `newTarget` be NewTarget.
2.  Let `O` be ? [OrdinaryCreateFromConstructor](#sec-ordinarycreatefromconstructor)(`newTarget`, "%AggregateError.prototype%", « `[[ErrorData]]` »).
3.  If `message` is not undefined, then
    1.  Let `msg` be ? [ToString](#sec-tostring)(`message`).
    2.  Perform [CreateNonEnumerableDataPropertyOrThrow](#sec-createnonenumerabledatapropertyorthrow)(`O`, "message", `msg`).
4.  Perform ? [InstallErrorCause](#sec-installerrorcause)(`O`, `options`).
5.  Let `errorsList` be ? [IteratorToList](#sec-iteratortolist)(? [GetIterator](#sec-getiterator)(`errors`, sync)).
6.  Perform ! [DefinePropertyOrThrow](#sec-definepropertyorthrow)(`O`, "errors", PropertyDescriptor { `[[Configurable]]`: true, `[[Enumerable]]`: false, `[[Writable]]`: true, `[[Value]]`: [CreateArrayFromList](#sec-createarrayfromlist)(`errorsList`) }).
7.  Return `O`.

#### 20.5.7.2 Properties of the AggregateError Constructor

The AggregateError [constructor](#constructor):

- has a `[[Prototype]]` internal slot whose value is [%Error%](#sec-error-constructor).
- has the following properties:

##### 20.5.7.2.1 AggregateError.prototype

The initial value of `AggregateError.prototype` is [%AggregateError.prototype%](#sec-properties-of-the-aggregate-error-prototype-objects).

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

#### 20.5.7.3 Properties of the AggregateError Prototype Object

The AggregateError prototype object:

- is %AggregateError.prototype%.
- is an [ordinary object](#ordinary-object).
- is not an Error instance or an AggregateError instance and does not have an `[[ErrorData]]` internal slot.
- has a `[[Prototype]]` internal slot whose value is [%Error.prototype%](#sec-properties-of-the-error-prototype-object).

##### 20.5.7.3.1 AggregateError.prototype.constructor

The initial value of `AggregateError.prototype.constructor` is [%AggregateError%](#sec-aggregate-error-constructor).

##### 20.5.7.3.2 AggregateError.prototype.message

The initial value of `AggregateError.prototype.message` is the empty String.

##### 20.5.7.3.3 AggregateError.prototype.name

The initial value of `AggregateError.prototype.name` is "AggregateError".

#### 20.5.7.4 Properties of AggregateError Instances

AggregateError instances are [ordinary objects](#ordinary-object) that inherit properties from their [AggregateError prototype object](#sec-properties-of-the-aggregate-error-prototype-objects) and have an `[[ErrorData]]` internal slot whose value is undefined. The only specified use of `[[ErrorData]]` is by `Object.prototype.toString` ([20.1.3.6](#sec-object.prototype.tostring)) to identify Error, AggregateError, or `NativeError` instances.

### 20.5.8 Abstract Operations for Error Objects

#### 20.5.8.1 InstallErrorCause ( `O`, `options` )

The abstract operation InstallErrorCause takes arguments `O` (an Object) and `options` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or a [throw completion](#sec-completion-record-specification-type). It is used to create a "cause" property on `O` when a "cause" property is present on `options`. It performs the following steps when called:

1.  If `options` [is an Object](#sec-object-type) and ? [HasProperty](#sec-hasproperty)(`options`, "cause") is true, then
    1.  Let `cause` be ? [Get](#sec-get-o-p)(`options`, "cause").
    2.  Perform [CreateNonEnumerableDataPropertyOrThrow](#sec-createnonenumerabledatapropertyorthrow)(`O`, "cause", `cause`).
2.  Return unused.
