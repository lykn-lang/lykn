# 21 Numbers and Dates

## 21.1 Number Objects

### 21.1.1 The Number Constructor

The Number [constructor](#constructor):

- is %Number%.
- is the initial value of the "Number" property of the [global object](#sec-global-object).
- creates and initializes a new Number object when called as a [constructor](#constructor).
- performs a type conversion when called as a function rather than as a [constructor](#constructor).
- may be used as the value of an `extends` clause of a class definition. Subclass [constructors](#constructor) that intend to inherit the specified Number behaviour must include a `super` call to the Number [constructor](#constructor) to create and initialize the subclass instance with a `[[NumberData]]` internal slot.

#### 21.1.1.1 Number ( `value` )

This function performs the following steps when called:

1.  If `value` is present, then
    1.  Let `prim` be ? [ToNumeric](#sec-tonumeric)(`value`).
    2.  If `prim` [is a BigInt](#sec-ecmascript-language-types-bigint-type), let `n` be [𝔽](#𝔽)([ℝ](#ℝ)(`prim`)).
    3.  Otherwise, let `n` be `prim`.
2.  Else,
    1.  Let `n` be +0_(𝔽).
3.  If NewTarget is undefined, return `n`.
4.  Let `O` be ? [OrdinaryCreateFromConstructor](#sec-ordinarycreatefromconstructor)(NewTarget, "%Number.prototype%", « `[[NumberData]]` »).
5.  Set `O`.`[[NumberData]]` to `n`.
6.  Return `O`.

### 21.1.2 Properties of the Number Constructor

The Number [constructor](#constructor):

- has a `[[Prototype]]` internal slot whose value is [%Function.prototype%](#sec-properties-of-the-function-prototype-object).
- has the following properties:

#### 21.1.2.1 Number.EPSILON

The value of `Number.EPSILON` is the [Number value for](#number-value-for) the magnitude of the difference between 1 and the smallest value greater than 1 that is representable as a Number value, which is approximately 2.2204460492503130808472633361816 × 10\*\*⁻¹⁶.

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

#### 21.1.2.2 Number.isFinite ( `number` )

This function performs the following steps when called:

1.  If `number` [is not a Number](#sec-ecmascript-language-types-number-type), return false.
2.  If `number` is not [finite](#finite), return false.
3.  Otherwise, return true.

#### 21.1.2.3 Number.isInteger ( `number` )

This function performs the following steps when called:

1.  If `number` is an [integral Number](#integral-number), return true.
2.  Return false.

#### 21.1.2.4 Number.isNaN ( `number` )

This function performs the following steps when called:

1.  If `number` [is not a Number](#sec-ecmascript-language-types-number-type), return false.
2.  If `number` is NaN, return true.
3.  Otherwise, return false.

Note

This function differs from the global isNaN function ([19.2.3](#sec-isnan-number)) in that it does not convert its argument to a Number before determining whether it is NaN.

#### 21.1.2.5 Number.isSafeInteger ( `number` )

Note

An [integer](#integer) `n` is a "safe integer" if and only if the [Number value for](#number-value-for) `n` is not the [Number value for](#number-value-for) any other [integer](#integer).

This function performs the following steps when called:

1.  If `number` is an [integral Number](#integral-number), then
    1.  If [abs](#eqn-abs)([ℝ](#ℝ)(`number`)) ≤ 2\*\*⁵³ - 1, return true.
2.  Return false.

#### 21.1.2.6 Number.MAX_SAFE_INTEGER

Note

Due to rounding behaviour necessitated by precision limitations of [IEEE 754-2019](#sec-bibliography), the [Number value for](#number-value-for) every [integer](#integer) greater than `Number.MAX_SAFE_INTEGER` is shared with at least one other [integer](#integer). Such large-magnitude [integers](#integer) are therefore not [safe](#safe-integer), and are not guaranteed to be exactly representable as Number values or even to be distinguishable from each other. For example, both `9007199254740992` and `9007199254740993` evaluate to the Number value 9007199254740992_(𝔽).

The value of `Number.MAX_SAFE_INTEGER` is 9007199254740991_(𝔽) ([𝔽](#𝔽)(2\*\*⁵³ - 1)).

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

#### 21.1.2.7 Number.MAX_VALUE

The value of `Number.MAX_VALUE` is the largest positive [finite](#finite) value of the [Number type](#sec-ecmascript-language-types-number-type), which is approximately 1.7976931348623157 × 10\*\*³⁰⁸.

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

#### 21.1.2.8 Number.MIN_SAFE_INTEGER

Note

Due to rounding behaviour necessitated by precision limitations of [IEEE 754-2019](#sec-bibliography), the [Number value for](#number-value-for) every [integer](#integer) less than `Number.MIN_SAFE_INTEGER` is shared with at least one other [integer](#integer). Such large-magnitude [integers](#integer) are therefore not [safe](#safe-integer), and are not guaranteed to be exactly representable as Number values or even to be distinguishable from each other. For example, both `-9007199254740992` and `-9007199254740993` evaluate to the Number value -9007199254740992_(𝔽).

The value of `Number.MIN_SAFE_INTEGER` is -9007199254740991_(𝔽) ([𝔽](#𝔽)(-(2\*\*⁵³ - 1))).

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

#### 21.1.2.9 Number.MIN_VALUE

The value of `Number.MIN_VALUE` is the smallest positive value of the [Number type](#sec-ecmascript-language-types-number-type), which is approximately 5 × 10\*\*⁻³²⁴.

In the [IEEE 754-2019](#sec-bibliography) double precision binary representation, the smallest possible value is a denormalized number. If an implementation does not support denormalized values, the value of `Number.MIN_VALUE` must be the smallest non-zero positive value that can actually be represented by the implementation.

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

#### 21.1.2.10 Number.NaN

The value of `Number.NaN` is NaN.

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

#### 21.1.2.11 Number.NEGATIVE_INFINITY

The value of `Number.NEGATIVE_INFINITY` is -∞_(𝔽).

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

#### 21.1.2.12 Number.parseFloat ( `string` )

The initial value of the "parseFloat" property is [%parseFloat%](#sec-parsefloat-string).

#### 21.1.2.13 Number.parseInt ( `string`, `radix` )

The initial value of the "parseInt" property is [%parseInt%](#sec-parseint-string-radix).

#### 21.1.2.14 Number.POSITIVE_INFINITY

The value of `Number.POSITIVE_INFINITY` is +∞_(𝔽).

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

#### 21.1.2.15 Number.prototype

The initial value of `Number.prototype` is the [Number prototype object](#sec-properties-of-the-number-prototype-object).

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

### 21.1.3 Properties of the Number Prototype Object

The Number prototype object:

- is %Number.prototype%.
- is an [ordinary object](#ordinary-object).
- is itself a Number object; it has a `[[NumberData]]` internal slot with the value +0_(𝔽).
- has a `[[Prototype]]` internal slot whose value is [%Object.prototype%](#sec-properties-of-the-object-prototype-object).

Unless explicitly stated otherwise, the methods of the Number prototype object defined below are not generic and the this value passed to them must be either a Number value or an object that has a `[[NumberData]]` internal slot that has been initialized to a Number value.

The phrase “this Number value” within the specification of a method refers to the result returned by calling the abstract operation [ThisNumberValue](#sec-thisnumbervalue) with the this value of the method invocation passed as the argument.

#### 21.1.3.1 Number.prototype.constructor

The initial value of `Number.prototype.constructor` is [%Number%](#sec-number-constructor).

#### 21.1.3.2 Number.prototype.toExponential ( `fractionDigits` )

This method returns a String containing this Number value represented in decimal exponential notation with one digit before the significand's decimal point and `fractionDigits` digits after the significand's decimal point. If `fractionDigits` is undefined, it includes as many significand digits as necessary to uniquely specify the Number (just like in [ToString](#sec-tostring) except that in this case the Number is always output in exponential notation).

It performs the following steps when called:

1.  Let `x` be ? [ThisNumberValue](#sec-thisnumbervalue)(this value).
2.  Let `f` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`fractionDigits`).
3.  [Assert](#assert): If `fractionDigits` is undefined, then `f` is 0.
4.  If `x` is not [finite](#finite), return [Number::toString](#sec-numeric-types-number-tostring)(`x`, 10).
5.  If `f` \< 0 or `f` \> 100, throw a RangeError exception.
6.  Set `x` to [ℝ](#ℝ)(`x`).
7.  Let `s` be the empty String.
8.  If `x` \< 0, then
    1.  Set `s` to "-".
    2.  Set `x` to -`x`.
9.  If `x` = 0, then
    1.  Let `m` be the String value consisting of `f` + 1 occurrences of the code unit 0x0030 (DIGIT ZERO).
    2.  Let `e` be 0.
10. Else,
    1.  If `fractionDigits` is not undefined, then
        1.  Let `e` and `n` be [integers](#integer) such that 10\*\*^(`f`) ≤ `n` \< 10\*\*(^(`f` + 1)) and for which `n` × 10\*\*(^(`e` - `f`)) - `x` is as close to zero as possible. If there are two such sets of `e` and `n`, pick the `e` and `n` for which `n` × 10\*\*(^(`e` - `f`)) is larger.
    2.  Else,
        1.  Let `e`, `n`, and `ff` be [integers](#integer) such that `ff` ≥ 0, 10\*\*^(`ff`) ≤ `n` \< 10\*\*(^(`ff` + 1)), [𝔽](#𝔽)(`n` × 10\*\*(^(`e` - `ff`))) is [𝔽](#𝔽)(`x`), and `ff` is as small as possible. Note that the decimal representation of `n` has `ff` + 1 digits, `n` is not divisible by 10, and the least significant digit of `n` is not necessarily uniquely determined by these criteria.
        2.  Set `f` to `ff`.
    3.  Let `m` be the String value consisting of the digits of the decimal representation of `n` (in order, with no leading zeroes).
11. If `f` ≠ 0, then
    1.  Let `a` be the first code unit of `m`.
    2.  Let `b` be the other `f` code units of `m`.
    3.  Set `m` to the [string-concatenation](#string-concatenation) of `a`, ".", and `b`.
12. If `e` = 0, then
    1.  Let `c` be "+".
    2.  Let `d` be "0".
13. Else,
    1.  If `e` \> 0, then
        1.  Let `c` be "+".
    2.  Else,
        1.  [Assert](#assert): `e` \< 0.
        2.  Let `c` be "-".
        3.  Set `e` to -`e`.
    3.  Let `d` be the String value consisting of the digits of the decimal representation of `e` (in order, with no leading zeroes).
14. Set `m` to the [string-concatenation](#string-concatenation) of `m`, "e", `c`, and `d`.
15. Return the [string-concatenation](#string-concatenation) of `s` and `m`.

Note

For implementations that provide more accurate conversions than required by the rules above, it is recommended that the following alternative version of step [10.b.i](#step-number-proto-toexponential-intermediate-values) be used as a guideline:

1.  Let `e`, `n`, and `f` be [integers](#integer) such that `f` ≥ 0, 10\*\*^(`f`) ≤ `n` \< 10\*\*(^(`f` + 1)), [𝔽](#𝔽)(`n` × 10\*\*(^(`e` - `f`))) is [𝔽](#𝔽)(`x`), and `f` is as small as possible. If there are multiple possibilities for `n`, choose the value of `n` for which [𝔽](#𝔽)(`n` × 10\*\*(^(`e` - `f`))) is closest in value to [𝔽](#𝔽)(`x`). If there are two such possible values of `n`, choose the one that is even.

#### 21.1.3.3 Number.prototype.toFixed ( `fractionDigits` )

Note 1

This method returns a String containing this Number value represented in decimal fixed-point notation with `fractionDigits` digits after the decimal point. If `fractionDigits` is undefined, 0 is assumed.

It performs the following steps when called:

1.  Let `x` be ? [ThisNumberValue](#sec-thisnumbervalue)(this value).
2.  Let `f` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`fractionDigits`).
3.  [Assert](#assert): If `fractionDigits` is undefined, then `f` is 0.
4.  If `f` is not [finite](#finite), throw a RangeError exception.
5.  If `f` \< 0 or `f` \> 100, throw a RangeError exception.
6.  If `x` is not [finite](#finite), return [Number::toString](#sec-numeric-types-number-tostring)(`x`, 10).
7.  Set `x` to [ℝ](#ℝ)(`x`).
8.  Let `s` be the empty String.
9.  If `x` \< 0, then
    1.  Set `s` to "-".
    2.  Set `x` to -`x`.
10. If `x` ≥ 10\*\*²¹, then
    1.  Let `m` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`x`)).
11. Else,
    1.  Let `n` be an [integer](#integer) for which `n` / 10\*\*^(`f`) - `x` is as close to zero as possible. If there are two such `n`, pick the larger `n`.
    2.  If `n` = 0, let `m` be "0". Otherwise, let `m` be the String value consisting of the digits of the decimal representation of `n` (in order, with no leading zeroes).
    3.  If `f` ≠ 0, then
        1.  Let `k` be the length of `m`.
        2.  If `k` ≤ `f`, then
            1.  Let `z` be the String value consisting of `f` + 1 - `k` occurrences of the code unit 0x0030 (DIGIT ZERO).
            2.  Set `m` to the [string-concatenation](#string-concatenation) of `z` and `m`.
            3.  Set `k` to `f` + 1.
        3.  Let `a` be the first `k` - `f` code units of `m`.
        4.  Let `b` be the other `f` code units of `m`.
        5.  Set `m` to the [string-concatenation](#string-concatenation) of `a`, ".", and `b`.
12. Return the [string-concatenation](#string-concatenation) of `s` and `m`.

Note 2

The output of `toFixed` may be more precise than `toString` for some values because toString only prints enough significant digits to distinguish the number from adjacent Number values. For example,

`(1000000000000000128).toString()` returns "1000000000000000100", while  
`(1000000000000000128).toFixed(0)` returns "1000000000000000128".

#### 21.1.3.4 Number.prototype.toLocaleString ( \[ `reserved1` \[ , `reserved2` \] \] )

An ECMAScript implementation that includes the ECMA-402 Internationalization API must implement this method as specified in the ECMA-402 specification. If an ECMAScript implementation does not include the ECMA-402 API the following specification of this method is used:

This method produces a String value that represents this Number value formatted according to the conventions of the [host environment](#host-environment)'s current locale. This method is [implementation-defined](#implementation-defined), and it is permissible, but not encouraged, for it to return the same thing as `toString`.

The meanings of the optional parameters to this method are defined in the ECMA-402 specification; implementations that do not include ECMA-402 support must not use those parameter positions for anything else.

#### 21.1.3.5 Number.prototype.toPrecision ( `precision` )

This method returns a String containing this Number value represented either in decimal exponential notation with one digit before the significand's decimal point and `precision` - 1 digits after the significand's decimal point or in decimal fixed notation with `precision` significant digits. If `precision` is undefined, it calls [ToString](#sec-tostring) instead.

It performs the following steps when called:

1.  Let `x` be ? [ThisNumberValue](#sec-thisnumbervalue)(this value).
2.  If `precision` is undefined, return ! [ToString](#sec-tostring)(`x`).
3.  Let `p` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`precision`).
4.  If `x` is not [finite](#finite), return [Number::toString](#sec-numeric-types-number-tostring)(`x`, 10).
5.  If `p` \< 1 or `p` \> 100, throw a RangeError exception.
6.  Set `x` to [ℝ](#ℝ)(`x`).
7.  Let `s` be the empty String.
8.  If `x` \< 0, then
    1.  Set `s` to the code unit 0x002D (HYPHEN-MINUS).
    2.  Set `x` to -`x`.
9.  If `x` = 0, then
    1.  Let `m` be the String value consisting of `p` occurrences of the code unit 0x0030 (DIGIT ZERO).
    2.  Let `e` be 0.
10. Else,
    1.  Let `e` and `n` be [integers](#integer) such that 10\*\*(^(`p` - 1)) ≤ `n` \< 10\*\*^(`p`) and for which `n` × 10\*\*(^(`e` - `p` + 1)) - `x` is as close to zero as possible. If there are two such sets of `e` and `n`, pick the `e` and `n` for which `n` × 10\*\*(^(`e` - `p` + 1)) is larger.
    2.  Let `m` be the String value consisting of the digits of the decimal representation of `n` (in order, with no leading zeroes).
    3.  If `e` \< -6 or `e` ≥ `p`, then
        1.  [Assert](#assert): `e` ≠ 0.
        2.  If `p` ≠ 1, then
            1.  Let `a` be the first code unit of `m`.
            2.  Let `b` be the other `p` - 1 code units of `m`.
            3.  Set `m` to the [string-concatenation](#string-concatenation) of `a`, ".", and `b`.
        3.  If `e` \> 0, then
            1.  Let `c` be the code unit 0x002B (PLUS SIGN).
        4.  Else,
            1.  [Assert](#assert): `e` \< 0.
            2.  Let `c` be the code unit 0x002D (HYPHEN-MINUS).
            3.  Set `e` to -`e`.
        5.  Let `d` be the String value consisting of the digits of the decimal representation of `e` (in order, with no leading zeroes).
        6.  Return the [string-concatenation](#string-concatenation) of `s`, `m`, the code unit 0x0065 (LATIN SMALL LETTER E), `c`, and `d`.
11. If `e` = `p` - 1, return the [string-concatenation](#string-concatenation) of `s` and `m`.
12. If `e` ≥ 0, then
    1.  Set `m` to the [string-concatenation](#string-concatenation) of the first `e` + 1 code units of `m`, the code unit 0x002E (FULL STOP), and the remaining `p` - (`e` + 1) code units of `m`.
13. Else,
    1.  Set `m` to the [string-concatenation](#string-concatenation) of the code unit 0x0030 (DIGIT ZERO), the code unit 0x002E (FULL STOP), -(`e` + 1) occurrences of the code unit 0x0030 (DIGIT ZERO), and the String `m`.
14. Return the [string-concatenation](#string-concatenation) of `s` and `m`.

#### 21.1.3.6 Number.prototype.toString ( \[ `radix` \] )

Note

The optional `radix` should be an [integral Number](#integral-number) value in the [inclusive interval](#inclusive-interval) from 2_(𝔽) to 36_(𝔽). If `radix` is undefined then 10_(𝔽) is used as the value of `radix`.

This method performs the following steps when called:

1.  Let `x` be ? [ThisNumberValue](#sec-thisnumbervalue)(this value).
2.  If `radix` is undefined, let `radixMV` be 10.
3.  Else, let `radixMV` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`radix`).
4.  If `radixMV` is not in the [inclusive interval](#inclusive-interval) from 2 to 36, throw a RangeError exception.
5.  Return [Number::toString](#sec-numeric-types-number-tostring)(`x`, `radixMV`).

This method is not generic; it throws a TypeError exception if its this value [is not a Number](#sec-ecmascript-language-types-number-type) or a Number object. Therefore, it cannot be transferred to other kinds of objects for use as a method.

The "length" property of this method is 1_(𝔽).

#### 21.1.3.7 Number.prototype.valueOf ( )

1.  Return ? [ThisNumberValue](#sec-thisnumbervalue)(this value).

##### 21.1.3.7.1 ThisNumberValue ( `value` )

The abstract operation ThisNumberValue takes argument `value` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a Number or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  If `value` [is a Number](#sec-ecmascript-language-types-number-type), return `value`.
2.  If `value` [is an Object](#sec-object-type) and `value` has a `[[NumberData]]` internal slot, then
    1.  Let `n` be `value`.`[[NumberData]]`.
    2.  [Assert](#assert): `n` [is a Number](#sec-ecmascript-language-types-number-type).
    3.  Return `n`.
3.  Throw a TypeError exception.

### 21.1.4 Properties of Number Instances

Number instances are [ordinary objects](#ordinary-object) that inherit properties from the [Number prototype object](#sec-properties-of-the-number-prototype-object). Number instances also have a `[[NumberData]]` internal slot. The `[[NumberData]]` internal slot is the Number value represented by this Number object.

## 21.2 BigInt Objects

### 21.2.1 The BigInt Constructor

The BigInt [constructor](#constructor):

- is %BigInt%.
- is the initial value of the "BigInt" property of the [global object](#sec-global-object).
- performs a type conversion when called as a function rather than as a [constructor](#constructor).
- is not intended to be used with the `new` operator or to be subclassed. It may be used as the value of an `extends` clause of a class definition but a `super` call to the BigInt [constructor](#constructor) will cause an exception.

#### 21.2.1.1 BigInt ( `value` )

This function performs the following steps when called:

1.  If NewTarget is not undefined, throw a TypeError exception.
2.  Let `prim` be ? [ToPrimitive](#sec-toprimitive)(`value`, number).
3.  If `prim` [is a Number](#sec-ecmascript-language-types-number-type), return ? [NumberToBigInt](#sec-numbertobigint)(`prim`).
4.  Otherwise, return ? [ToBigInt](#sec-tobigint)(`prim`).

##### 21.2.1.1.1 NumberToBigInt ( `number` )

The abstract operation NumberToBigInt takes argument `number` (a Number) and returns either a [normal completion containing](#sec-completion-record-specification-type) a BigInt or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  If `number` is not an [integral Number](#integral-number), throw a RangeError exception.
2.  Return [ℤ](#ℤ)([ℝ](#ℝ)(`number`)).

### 21.2.2 Properties of the BigInt Constructor

The BigInt [constructor](#constructor):

- has a `[[Prototype]]` internal slot whose value is [%Function.prototype%](#sec-properties-of-the-function-prototype-object).
- has the following properties:

#### 21.2.2.1 BigInt.asIntN ( `bits`, `bigint` )

This function performs the following steps when called:

1.  Set `bits` to ? [ToIndex](#sec-toindex)(`bits`).
2.  Set `bigint` to ? [ToBigInt](#sec-tobigint)(`bigint`).
3.  Let `mod` be [ℝ](#ℝ)(`bigint`) [modulo](#eqn-modulo) 2\*\*^(`bits`).
4.  If `mod` ≥ 2\*\*(^(`bits` - 1)), return [ℤ](#ℤ)(`mod` - 2\*\*^(`bits`)); otherwise, return [ℤ](#ℤ)(`mod`).

#### 21.2.2.2 BigInt.asUintN ( `bits`, `bigint` )

This function performs the following steps when called:

1.  Set `bits` to ? [ToIndex](#sec-toindex)(`bits`).
2.  Set `bigint` to ? [ToBigInt](#sec-tobigint)(`bigint`).
3.  Return [ℤ](#ℤ)([ℝ](#ℝ)(`bigint`) [modulo](#eqn-modulo) 2\*\*^(`bits`)).

#### 21.2.2.3 BigInt.prototype

The initial value of `BigInt.prototype` is the [BigInt prototype object](#sec-properties-of-the-bigint-prototype-object).

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

### 21.2.3 Properties of the BigInt Prototype Object

The BigInt prototype object:

- is %BigInt.prototype%.
- is an [ordinary object](#ordinary-object).
- [is not a BigInt](#sec-ecmascript-language-types-bigint-type) object; it does not have a `[[BigIntData]]` internal slot.
- has a `[[Prototype]]` internal slot whose value is [%Object.prototype%](#sec-properties-of-the-object-prototype-object).

The phrase “this BigInt value” within the specification of a method refers to the result returned by calling the abstract operation [ThisBigIntValue](#sec-thisbigintvalue) with the this value of the method invocation passed as the argument.

#### 21.2.3.1 BigInt.prototype.constructor

The initial value of `BigInt.prototype.constructor` is [%BigInt%](#sec-bigint-constructor).

#### 21.2.3.2 BigInt.prototype.toLocaleString ( \[ `reserved1` \[ , `reserved2` \] \] )

An ECMAScript implementation that includes the ECMA-402 Internationalization API must implement this method as specified in the ECMA-402 specification. If an ECMAScript implementation does not include the ECMA-402 API the following specification of this method is used:

This method produces a String value that represents this BigInt value formatted according to the conventions of the [host environment](#host-environment)'s current locale. This method is [implementation-defined](#implementation-defined), and it is permissible, but not encouraged, for it to return the same thing as `toString`.

The meanings of the optional parameters to this method are defined in the ECMA-402 specification; implementations that do not include ECMA-402 support must not use those parameter positions for anything else.

#### 21.2.3.3 BigInt.prototype.toString ( \[ `radix` \] )

Note

The optional `radix` should be an [integral Number](#integral-number) value in the [inclusive interval](#inclusive-interval) from 2_(𝔽) to 36_(𝔽). If `radix` is undefined then 10_(𝔽) is used as the value of `radix`.

This method performs the following steps when called:

1.  Let `x` be ? [ThisBigIntValue](#sec-thisbigintvalue)(this value).
2.  If `radix` is undefined, let `radixMV` be 10.
3.  Else, let `radixMV` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`radix`).
4.  If `radixMV` is not in the [inclusive interval](#inclusive-interval) from 2 to 36, throw a RangeError exception.
5.  Return [BigInt::toString](#sec-numeric-types-bigint-tostring)(`x`, `radixMV`).

This method is not generic; it throws a TypeError exception if its this value [is not a BigInt](#sec-ecmascript-language-types-bigint-type) or a BigInt object. Therefore, it cannot be transferred to other kinds of objects for use as a method.

#### 21.2.3.4 BigInt.prototype.valueOf ( )

1.  Return ? [ThisBigIntValue](#sec-thisbigintvalue)(this value).

##### 21.2.3.4.1 ThisBigIntValue ( `value` )

The abstract operation ThisBigIntValue takes argument `value` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a BigInt or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  If `value` [is a BigInt](#sec-ecmascript-language-types-bigint-type), return `value`.
2.  If `value` [is an Object](#sec-object-type) and `value` has a `[[BigIntData]]` internal slot, then
    1.  [Assert](#assert): `value`.`[[BigIntData]]` [is a BigInt](#sec-ecmascript-language-types-bigint-type).
    2.  Return `value`.`[[BigIntData]]`.
3.  Throw a TypeError exception.

#### 21.2.3.5 BigInt.prototype \[ %Symbol.toStringTag% \]

The initial value of the [%Symbol.toStringTag%](#sec-well-known-symbols) property is the String value "BigInt".

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: true }.

### 21.2.4 Properties of BigInt Instances

BigInt instances are [ordinary objects](#ordinary-object) that inherit properties from the [BigInt prototype object](#sec-properties-of-the-bigint-prototype-object). BigInt instances also have a `[[BigIntData]]` internal slot. The `[[BigIntData]]` internal slot is the BigInt value represented by this BigInt object.

## 21.3 The Math Object

The Math object:

- is %Math%.
- is the initial value of the "Math" property of the [global object](#sec-global-object).
- is an [ordinary object](#ordinary-object).
- has a `[[Prototype]]` internal slot whose value is [%Object.prototype%](#sec-properties-of-the-object-prototype-object).
- is not a [function object](#function-object).
- does not have a `[[Construct]]` internal method; it cannot be used as a [constructor](#constructor) with the `new` operator.
- does not have a `[[Call]]` internal method; it cannot be invoked as a function.

Note

In this specification, the phrase “the [Number value for](#number-value-for) `x`” has a technical meaning defined in [6.1.6.1](#sec-ecmascript-language-types-number-type).

### 21.3.1 Value Properties of the Math Object

#### 21.3.1.1 Math.E

The [Number value for](#number-value-for) *e*, the base of the natural logarithms, which is approximately 2.7182818284590452354.

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

#### 21.3.1.2 Math.LN10

The [Number value for](#number-value-for) the natural logarithm of 10, which is approximately 2.302585092994046.

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

#### 21.3.1.3 Math.LN2

The [Number value for](#number-value-for) the natural logarithm of 2, which is approximately 0.6931471805599453.

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

#### 21.3.1.4 Math.LOG10E

The [Number value for](#number-value-for) the base-10 logarithm of *e*, the base of the natural logarithms; this value is approximately 0.4342944819032518.

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

Note

The value of `Math.LOG10E` is approximately the reciprocal of the value of `Math.LN10`.

#### 21.3.1.5 Math.LOG2E

The [Number value for](#number-value-for) the base-2 logarithm of *e*, the base of the natural logarithms; this value is approximately 1.4426950408889634.

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

Note

The value of `Math.LOG2E` is approximately the reciprocal of the value of `Math.LN2`.

#### 21.3.1.6 Math.PI

The [Number value for](#number-value-for) π, the ratio of the circumference of a circle to its diameter, which is approximately 3.1415926535897932.

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

#### 21.3.1.7 Math.SQRT1_2

The [Number value for](#number-value-for) the square root of ½, which is approximately 0.7071067811865476.

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

Note

The value of `Math.SQRT1_2` is approximately the reciprocal of the value of `Math.SQRT2`.

#### 21.3.1.8 Math.SQRT2

The [Number value for](#number-value-for) the square root of 2, which is approximately 1.4142135623730951.

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

#### 21.3.1.9 Math \[ %Symbol.toStringTag% \]

The initial value of the [%Symbol.toStringTag%](#sec-well-known-symbols) property is the String value "Math".

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: true }.

### 21.3.2 Function Properties of the Math Object

Note

The behaviour of the functions `acos`, `acosh`, `asin`, `asinh`, `atan`, `atanh`, `atan2`, `cbrt`, `cos`, `cosh`, `exp`, `expm1`, `hypot`, `log`, `log1p`, `log2`, `log10`, `pow`, `random`, `sin`, `sinh`, `tan`, and `tanh` is not precisely specified here except to require specific results for certain argument values that represent boundary cases of interest. For other argument values, these functions are intended to compute approximations to the results of familiar mathematical functions, but some latitude is allowed in the choice of approximation algorithms. The general intent is that an implementer should be able to use the same mathematical library for ECMAScript on a given hardware platform that is available to C programmers on that platform.

Although the choice of algorithms is left to the implementation, it is recommended (but not specified by this standard) that implementations use the approximation algorithms for [IEEE 754-2019](#sec-bibliography) arithmetic contained in `fdlibm`, the freely distributable mathematical library from Sun Microsystems (<http://www.netlib.org/fdlibm>).

#### 21.3.2.1 Math.abs ( `x` )

This function returns the absolute value of `x`; the result has the same magnitude as `x` but has positive sign.

It performs the following steps when called:

1.  Let `n` be ? [ToNumber](#sec-tonumber)(`x`).
2.  If `n` is NaN, return NaN.
3.  If `n` is -0_(𝔽), return +0_(𝔽).
4.  If `n` is -∞_(𝔽), return +∞_(𝔽).
5.  If `n` \< -0_(𝔽), return -`n`.
6.  Return `n`.

#### 21.3.2.2 Math.acos ( `x` )

This function returns the inverse cosine of `x`. The result is expressed in radians and is in the [inclusive interval](#inclusive-interval) from +0_(𝔽) to [𝔽](#𝔽)(π).

It performs the following steps when called:

1.  Let `n` be ? [ToNumber](#sec-tonumber)(`x`).
2.  If `n` is NaN, `n` \> 1_(𝔽), or `n` \< -1_(𝔽), return NaN.
3.  If `n` is 1_(𝔽), return +0_(𝔽).
4.  Return an [implementation-approximated](#implementation-approximated) Number value representing the inverse cosine of [ℝ](#ℝ)(`n`).

#### 21.3.2.3 Math.acosh ( `x` )

This function returns the inverse hyperbolic cosine of `x`.

It performs the following steps when called:

1.  Let `n` be ? [ToNumber](#sec-tonumber)(`x`).
2.  If `n` is either NaN or +∞_(𝔽), return `n`.
3.  If `n` is 1_(𝔽), return +0_(𝔽).
4.  If `n` \< 1_(𝔽), return NaN.
5.  Return an [implementation-approximated](#implementation-approximated) Number value representing the inverse hyperbolic cosine of [ℝ](#ℝ)(`n`).

#### 21.3.2.4 Math.asin ( `x` )

This function returns the inverse sine of `x`. The result is expressed in radians and is in the [inclusive interval](#inclusive-interval) from [𝔽](#𝔽)(-π / 2) to [𝔽](#𝔽)(π / 2).

It performs the following steps when called:

1.  Let `n` be ? [ToNumber](#sec-tonumber)(`x`).
2.  If `n` is one of NaN, +0_(𝔽), or -0_(𝔽), return `n`.
3.  If `n` \> 1_(𝔽) or `n` \< -1_(𝔽), return NaN.
4.  Return an [implementation-approximated](#implementation-approximated) Number value representing the inverse sine of [ℝ](#ℝ)(`n`).

#### 21.3.2.5 Math.asinh ( `x` )

This function returns the inverse hyperbolic sine of `x`.

It performs the following steps when called:

1.  Let `n` be ? [ToNumber](#sec-tonumber)(`x`).
2.  If `n` is not [finite](#finite) or `n` is either +0_(𝔽) or -0_(𝔽), return `n`.
3.  Return an [implementation-approximated](#implementation-approximated) Number value representing the inverse hyperbolic sine of [ℝ](#ℝ)(`n`).

#### 21.3.2.6 Math.atan ( `x` )

This function returns the inverse tangent of `x`. The result is expressed in radians and is in the [inclusive interval](#inclusive-interval) from [𝔽](#𝔽)(-π / 2) to [𝔽](#𝔽)(π / 2).

It performs the following steps when called:

1.  Let `n` be ? [ToNumber](#sec-tonumber)(`x`).
2.  If `n` is one of NaN, +0_(𝔽), or -0_(𝔽), return `n`.
3.  If `n` is +∞_(𝔽), return an [implementation-approximated](#implementation-approximated) Number value representing π / 2.
4.  If `n` is -∞_(𝔽), return an [implementation-approximated](#implementation-approximated) Number value representing -π / 2.
5.  Return an [implementation-approximated](#implementation-approximated) Number value representing the inverse tangent of [ℝ](#ℝ)(`n`).

#### 21.3.2.7 Math.atanh ( `x` )

This function returns the inverse hyperbolic tangent of `x`.

It performs the following steps when called:

1.  Let `n` be ? [ToNumber](#sec-tonumber)(`x`).
2.  If `n` is one of NaN, +0_(𝔽), or -0_(𝔽), return `n`.
3.  If `n` \> 1_(𝔽) or `n` \< -1_(𝔽), return NaN.
4.  If `n` is 1_(𝔽), return +∞_(𝔽).
5.  If `n` is -1_(𝔽), return -∞_(𝔽).
6.  Return an [implementation-approximated](#implementation-approximated) Number value representing the inverse hyperbolic tangent of [ℝ](#ℝ)(`n`).

#### 21.3.2.8 Math.atan2 ( `y`, `x` )

This function returns the inverse tangent of the quotient `y` / `x` of the arguments `y` and `x`, where the signs of `y` and `x` are used to determine the quadrant of the result. Note that it is intentional and traditional for the two-argument inverse tangent function that the argument named `y` be first and the argument named `x` be second. The result is expressed in radians and is in the [inclusive interval](#inclusive-interval) from -π to +π.

It performs the following steps when called:

1.  Let `ny` be ? [ToNumber](#sec-tonumber)(`y`).
2.  Let `nx` be ? [ToNumber](#sec-tonumber)(`x`).
3.  If `ny` is NaN or `nx` is NaN, return NaN.
4.  If `ny` is +∞_(𝔽), then
    1.  If `nx` is +∞_(𝔽), return an [implementation-approximated](#implementation-approximated) Number value representing π / 4.
    2.  If `nx` is -∞_(𝔽), return an [implementation-approximated](#implementation-approximated) Number value representing 3π / 4.
    3.  Return an [implementation-approximated](#implementation-approximated) Number value representing π / 2.
5.  If `ny` is -∞_(𝔽), then
    1.  If `nx` is +∞_(𝔽), return an [implementation-approximated](#implementation-approximated) Number value representing -π / 4.
    2.  If `nx` is -∞_(𝔽), return an [implementation-approximated](#implementation-approximated) Number value representing -3π / 4.
    3.  Return an [implementation-approximated](#implementation-approximated) Number value representing -π / 2.
6.  If `ny` is +0_(𝔽), then
    1.  If `nx` \> +0_(𝔽) or `nx` is +0_(𝔽), return +0_(𝔽).
    2.  Return an [implementation-approximated](#implementation-approximated) Number value representing π.
7.  If `ny` is -0_(𝔽), then
    1.  If `nx` \> +0_(𝔽) or `nx` is +0_(𝔽), return -0_(𝔽).
    2.  Return an [implementation-approximated](#implementation-approximated) Number value representing -π.
8.  [Assert](#assert): `ny` is [finite](#finite) and is neither +0_(𝔽) nor -0_(𝔽).
9.  If `ny` \> +0_(𝔽), then
    1.  If `nx` is +∞_(𝔽), return +0_(𝔽).
    2.  If `nx` is -∞_(𝔽), return an [implementation-approximated](#implementation-approximated) Number value representing π.
    3.  If `nx` is either +0_(𝔽) or -0_(𝔽), return an [implementation-approximated](#implementation-approximated) Number value representing π / 2.
10. If `ny` \< -0_(𝔽), then
    1.  If `nx` is +∞_(𝔽), return -0_(𝔽).
    2.  If `nx` is -∞_(𝔽), return an [implementation-approximated](#implementation-approximated) Number value representing -π.
    3.  If `nx` is either +0_(𝔽) or -0_(𝔽), return an [implementation-approximated](#implementation-approximated) Number value representing -π / 2.
11. [Assert](#assert): `nx` is [finite](#finite) and is neither +0_(𝔽) nor -0_(𝔽).
12. Let `r` be the inverse tangent of [abs](#eqn-abs)([ℝ](#ℝ)(`ny`) / [ℝ](#ℝ)(`nx`)).
13. If `nx` \< -0_(𝔽), then
    1.  If `ny` \> +0_(𝔽), set `r` to π - `r`.
    2.  Else, set `r` to -π + `r`.
14. Else,
    1.  If `ny` \< -0_(𝔽), set `r` to -`r`.
15. Return an [implementation-approximated](#implementation-approximated) Number value representing `r`.

#### 21.3.2.9 Math.cbrt ( `x` )

This function returns the cube root of `x`.

It performs the following steps when called:

1.  Let `n` be ? [ToNumber](#sec-tonumber)(`x`).
2.  If `n` is not [finite](#finite) or `n` is either +0_(𝔽) or -0_(𝔽), return `n`.
3.  Return an [implementation-approximated](#implementation-approximated) Number value representing the cube root of [ℝ](#ℝ)(`n`).

#### 21.3.2.10 Math.ceil ( `x` )

This function returns the smallest (closest to -∞) [integral Number](#integral-number) value that is not less than `x`. If `x` is already an [integral Number](#integral-number), the result is `x`.

It performs the following steps when called:

1.  Let `n` be ? [ToNumber](#sec-tonumber)(`x`).
2.  If `n` is not [finite](#finite) or `n` is either +0_(𝔽) or -0_(𝔽), return `n`.
3.  If `n` \< -0_(𝔽) and `n` \> -1_(𝔽), return -0_(𝔽).
4.  If `n` is an [integral Number](#integral-number), return `n`.
5.  Return the smallest (closest to -∞) [integral Number](#integral-number) value that is not less than `n`.

Note

The value of `Math.ceil(x)` is the same as the value of `-Math.floor(-x)`.

#### 21.3.2.11 Math.clz32 ( `x` )

This function performs the following steps when called:

1.  Let `n` be ? [ToUint32](#sec-touint32)(`x`).
2.  Let `p` be the number of leading zero bits in the unsigned 32-bit binary representation of `n`.
3.  Return [𝔽](#𝔽)(`p`).

Note

If `n` is either +0_(𝔽) or -0_(𝔽), this method returns 32_(𝔽). If the most significant bit of the 32-bit binary encoding of `n` is 1, this method returns +0_(𝔽).

#### 21.3.2.12 Math.cos ( `x` )

This function returns the cosine of `x`. The argument is expressed in radians.

It performs the following steps when called:

1.  Let `n` be ? [ToNumber](#sec-tonumber)(`x`).
2.  If `n` is not [finite](#finite), return NaN.
3.  If `n` is either +0_(𝔽) or -0_(𝔽), return 1_(𝔽).
4.  Return an [implementation-approximated](#implementation-approximated) Number value representing the cosine of [ℝ](#ℝ)(`n`).

#### 21.3.2.13 Math.cosh ( `x` )

This function returns the hyperbolic cosine of `x`.

It performs the following steps when called:

1.  Let `n` be ? [ToNumber](#sec-tonumber)(`x`).
2.  If `n` is NaN, return NaN.
3.  If `n` is either +∞_(𝔽) or -∞_(𝔽), return +∞_(𝔽).
4.  If `n` is either +0_(𝔽) or -0_(𝔽), return 1_(𝔽).
5.  Return an [implementation-approximated](#implementation-approximated) Number value representing the hyperbolic cosine of [ℝ](#ℝ)(`n`).

Note

The value of `Math.cosh(x)` is the same as the value of `(Math.exp(x) + Math.exp(-x)) / 2`.

#### 21.3.2.14 Math.exp ( `x` )

This function returns the exponential function of `x` (`e` raised to the power of `x`, where `e` is the base of the natural logarithms).

It performs the following steps when called:

1.  Let `n` be ? [ToNumber](#sec-tonumber)(`x`).
2.  If `n` is either NaN or +∞_(𝔽), return `n`.
3.  If `n` is either +0_(𝔽) or -0_(𝔽), return 1_(𝔽).
4.  If `n` is -∞_(𝔽), return +0_(𝔽).
5.  Return an [implementation-approximated](#implementation-approximated) Number value representing the exponential function of [ℝ](#ℝ)(`n`).

#### 21.3.2.15 Math.expm1 ( `x` )

This function returns the result of subtracting 1 from the exponential function of `x` (`e` raised to the power of `x`, where `e` is the base of the natural logarithms). The result is computed in a way that is accurate even when the value of `x` is close to 0.

It performs the following steps when called:

1.  Let `n` be ? [ToNumber](#sec-tonumber)(`x`).
2.  If `n` is one of NaN, +0_(𝔽), -0_(𝔽), or +∞_(𝔽), return `n`.
3.  If `n` is -∞_(𝔽), return -1_(𝔽).
4.  Let `exp` be the exponential function of [ℝ](#ℝ)(`n`).
5.  Return an [implementation-approximated](#implementation-approximated) Number value representing `exp` - 1.

#### 21.3.2.16 Math.floor ( `x` )

This function returns the greatest (closest to +∞) [integral Number](#integral-number) value that is not greater than `x`. If `x` is already an [integral Number](#integral-number), the result is `x`.

It performs the following steps when called:

1.  Let `n` be ? [ToNumber](#sec-tonumber)(`x`).
2.  If `n` is not [finite](#finite) or `n` is either +0_(𝔽) or -0_(𝔽), return `n`.
3.  If `n` \< 1_(𝔽) and `n` \> +0_(𝔽), return +0_(𝔽).
4.  If `n` is an [integral Number](#integral-number), return `n`.
5.  Return the greatest (closest to +∞) [integral Number](#integral-number) value that is not greater than `n`.

Note

The value of `Math.floor(x)` is the same as the value of `-Math.ceil(-x)`.

#### 21.3.2.17 Math.fround ( `x` )

This function performs the following steps when called:

1.  Let `n` be ? [ToNumber](#sec-tonumber)(`x`).
2.  If `n` is NaN, return NaN.
3.  If `n` is one of +0_(𝔽), -0_(𝔽), +∞_(𝔽), or -∞_(𝔽), return `n`.
4.  Let `n32` be the result of converting `n` to [IEEE 754-2019](#sec-bibliography) binary32 format using roundTiesToEven mode.
5.  Let `n64` be the result of converting `n32` to [IEEE 754-2019](#sec-bibliography) binary64 format.
6.  Return the ECMAScript Number value corresponding to `n64`.

#### 21.3.2.18 Math.f16round ( `x` )

This function performs the following steps when called:

1.  Let `n` be ? [ToNumber](#sec-tonumber)(`x`).
2.  If `n` is NaN, return NaN.
3.  If `n` is one of +0_(𝔽), -0_(𝔽), +∞_(𝔽), or -∞_(𝔽), return `n`.
4.  Let `n16` be the result of converting `n` to [IEEE 754-2019](#sec-bibliography) binary16 format using roundTiesToEven mode.
5.  Let `n64` be the result of converting `n16` to [IEEE 754-2019](#sec-bibliography) binary64 format.
6.  Return the ECMAScript Number value corresponding to `n64`.

Note

This operation is not the same as casting to binary32 and then to binary16 because of the possibility of double-rounding: consider the number `k` = 1.00048828125000022204_(𝔽), for example, for which Math.f16round(`k`) is 1.0009765625_(𝔽), but Math.f16round(Math.fround(`k`)) is 1_(𝔽).

Not all platforms provide native support for casting from binary64 to binary16. There are various libraries which can provide this, including the MIT-licensed [half](https://half.sourceforge.net/) library. Alternatively, it is possible to first cast from binary64 to binary32 under roundTiesToEven and then check whether the result could lead to incorrect double-rounding. The cases which could can be handled explicitly by adjusting the mantissa of the binary32 value so that it is the value which would be produced by performing the initial cast under roundTiesToOdd. Casting the adjusted value to binary16 under roundTiesToEven then produces the correct value.

#### 21.3.2.19 Math.hypot ( ...`args` )

Given zero or more arguments, this function returns the square root of the sum of squares of its arguments.

It performs the following steps when called:

1.  Let `coerced` be a new empty [List](#sec-list-and-record-specification-type).
2.  For each element `arg` of `args`, do
    1.  Let `n` be ? [ToNumber](#sec-tonumber)(`arg`).
    2.  Append `n` to `coerced`.
3.  For each element `number` of `coerced`, do
    1.  If `number` is either +∞_(𝔽) or -∞_(𝔽), return +∞_(𝔽).
4.  Let `onlyZero` be true.
5.  For each element `number` of `coerced`, do
    1.  If `number` is NaN, return NaN.
    2.  If `number` is neither +0_(𝔽) nor -0_(𝔽), set `onlyZero` to false.
6.  If `onlyZero` is true, return +0_(𝔽).
7.  Return an [implementation-approximated](#implementation-approximated) Number value representing the square root of the sum of squares of the [mathematical values](#mathematical-value) of the elements of `coerced`.

The "length" property of this function is 2_(𝔽).

Note

Implementations should take care to avoid the loss of precision from overflows and underflows that are prone to occur in naive implementations when this function is called with two or more arguments.

#### 21.3.2.20 Math.imul ( `x`, `y` )

This function performs the following steps when called:

1.  Let `a` be [ℝ](#ℝ)(? [ToUint32](#sec-touint32)(`x`)).
2.  Let `b` be [ℝ](#ℝ)(? [ToUint32](#sec-touint32)(`y`)).
3.  Let `product` be (`a` × `b`) [modulo](#eqn-modulo) 2\*\*³².
4.  If `product` ≥ 2\*\*³¹, return [𝔽](#𝔽)(`product` - 2\*\*³²); otherwise return [𝔽](#𝔽)(`product`).

#### 21.3.2.21 Math.log ( `x` )

This function returns the natural logarithm of `x`.

It performs the following steps when called:

1.  Let `n` be ? [ToNumber](#sec-tonumber)(`x`).
2.  If `n` is either NaN or +∞_(𝔽), return `n`.
3.  If `n` is 1_(𝔽), return +0_(𝔽).
4.  If `n` is either +0_(𝔽) or -0_(𝔽), return -∞_(𝔽).
5.  If `n` \< -0_(𝔽), return NaN.
6.  Return an [implementation-approximated](#implementation-approximated) Number value representing the natural logarithm of [ℝ](#ℝ)(`n`).

#### 21.3.2.22 Math.log1p ( `x` )

This function returns the natural logarithm of 1 + `x`. The result is computed in a way that is accurate even when the value of x is close to zero.

It performs the following steps when called:

1.  Let `n` be ? [ToNumber](#sec-tonumber)(`x`).
2.  If `n` is one of NaN, +0_(𝔽), -0_(𝔽), or +∞_(𝔽), return `n`.
3.  If `n` is -1_(𝔽), return -∞_(𝔽).
4.  If `n` \< -1_(𝔽), return NaN.
5.  Return an [implementation-approximated](#implementation-approximated) Number value representing the natural logarithm of 1 + [ℝ](#ℝ)(`n`).

#### 21.3.2.23 Math.log10 ( `x` )

This function returns the base 10 logarithm of `x`.

It performs the following steps when called:

1.  Let `n` be ? [ToNumber](#sec-tonumber)(`x`).
2.  If `n` is either NaN or +∞_(𝔽), return `n`.
3.  If `n` is 1_(𝔽), return +0_(𝔽).
4.  If `n` is either +0_(𝔽) or -0_(𝔽), return -∞_(𝔽).
5.  If `n` \< -0_(𝔽), return NaN.
6.  Return an [implementation-approximated](#implementation-approximated) Number value representing the base 10 logarithm of [ℝ](#ℝ)(`n`).

#### 21.3.2.24 Math.log2 ( `x` )

This function returns the base 2 logarithm of `x`.

It performs the following steps when called:

1.  Let `n` be ? [ToNumber](#sec-tonumber)(`x`).
2.  If `n` is either NaN or +∞_(𝔽), return `n`.
3.  If `n` is 1_(𝔽), return +0_(𝔽).
4.  If `n` is either +0_(𝔽) or -0_(𝔽), return -∞_(𝔽).
5.  If `n` \< -0_(𝔽), return NaN.
6.  Return an [implementation-approximated](#implementation-approximated) Number value representing the base 2 logarithm of [ℝ](#ℝ)(`n`).

#### 21.3.2.25 Math.max ( ...`args` )

Given zero or more arguments, this function calls [ToNumber](#sec-tonumber) on each of the arguments and returns the largest of the resulting values.

It performs the following steps when called:

1.  Let `coerced` be a new empty [List](#sec-list-and-record-specification-type).
2.  For each element `arg` of `args`, do
    1.  Let `n` be ? [ToNumber](#sec-tonumber)(`arg`).
    2.  Append `n` to `coerced`.
3.  Let `highest` be -∞_(𝔽).
4.  For each element `number` of `coerced`, do
    1.  If `number` is NaN, return NaN.
    2.  If `number` is +0_(𝔽) and `highest` is -0_(𝔽), set `highest` to +0_(𝔽).
    3.  If `number` \> `highest`, set `highest` to `number`.
5.  Return `highest`.

Note

The comparison of values to determine the largest value is done using the [IsLessThan](#sec-islessthan) algorithm except that +0_(𝔽) is considered to be larger than -0_(𝔽).

The "length" property of this function is 2_(𝔽).

#### 21.3.2.26 Math.min ( ...`args` )

Given zero or more arguments, this function calls [ToNumber](#sec-tonumber) on each of the arguments and returns the smallest of the resulting values.

It performs the following steps when called:

1.  Let `coerced` be a new empty [List](#sec-list-and-record-specification-type).
2.  For each element `arg` of `args`, do
    1.  Let `n` be ? [ToNumber](#sec-tonumber)(`arg`).
    2.  Append `n` to `coerced`.
3.  Let `lowest` be +∞_(𝔽).
4.  For each element `number` of `coerced`, do
    1.  If `number` is NaN, return NaN.
    2.  If `number` is -0_(𝔽) and `lowest` is +0_(𝔽), set `lowest` to -0_(𝔽).
    3.  If `number` \< `lowest`, set `lowest` to `number`.
5.  Return `lowest`.

Note

The comparison of values to determine the largest value is done using the [IsLessThan](#sec-islessthan) algorithm except that +0_(𝔽) is considered to be larger than -0_(𝔽).

The "length" property of this function is 2_(𝔽).

#### 21.3.2.27 Math.pow ( `base`, `exponent` )

This function performs the following steps when called:

1.  Set `base` to ? [ToNumber](#sec-tonumber)(`base`).
2.  Set `exponent` to ? [ToNumber](#sec-tonumber)(`exponent`).
3.  Return [Number::exponentiate](#sec-numeric-types-number-exponentiate)(`base`, `exponent`).

#### 21.3.2.28 Math.random ( )

This function returns a Number value with positive sign, greater than or equal to +0_(𝔽) but strictly less than 1_(𝔽), chosen randomly or pseudo randomly with approximately uniform distribution over that range, using an [implementation-defined](#implementation-defined) algorithm or strategy.

Each `Math.random` function created for distinct [realms](#realm) must produce a distinct sequence of values from successive calls.

#### 21.3.2.29 Math.round ( `x` )

This function returns the Number value that is closest to `x` and is integral. If two [integral Numbers](#integral-number) are equally close to `x`, then the result is the Number value that is closer to +∞. If `x` is already integral, the result is `x`.

It performs the following steps when called:

1.  Let `n` be ? [ToNumber](#sec-tonumber)(`x`).
2.  If `n` is not [finite](#finite) or `n` is an [integral Number](#integral-number), return `n`.
3.  If `n` \< 0.5_(𝔽) and `n` \> +0_(𝔽), return +0_(𝔽).
4.  If `n` \< -0_(𝔽) and `n` ≥ -0.5_(𝔽), return -0_(𝔽).
5.  Return the [integral Number](#integral-number) closest to `n`, preferring the Number closer to +∞ in the case of a tie.

Note 1

`Math.round(3.5)` returns 4, but `Math.round(-3.5)` returns -3.

Note 2

The value of `Math.round(x)` is not always the same as the value of `Math.floor(x + 0.5)`. When `x` is -0_(𝔽) or `x` is less than -0_(𝔽) but greater than or equal to -0.5_(𝔽), `Math.round(x)` returns -0_(𝔽), but `Math.floor(x + 0.5)` returns +0_(𝔽). `Math.round(x)` may also differ from the value of `Math.floor(x + 0.5)`because of internal rounding when computing `x + 0.5`.

#### 21.3.2.30 Math.sign ( `x` )

This function returns the sign of `x`, indicating whether `x` is positive, negative, or zero.

It performs the following steps when called:

1.  Let `n` be ? [ToNumber](#sec-tonumber)(`x`).
2.  If `n` is one of NaN, +0_(𝔽), or -0_(𝔽), return `n`.
3.  If `n` \< -0_(𝔽), return -1_(𝔽).
4.  Return 1_(𝔽).

#### 21.3.2.31 Math.sin ( `x` )

This function returns the sine of `x`. The argument is expressed in radians.

It performs the following steps when called:

1.  Let `n` be ? [ToNumber](#sec-tonumber)(`x`).
2.  If `n` is one of NaN, +0_(𝔽), or -0_(𝔽), return `n`.
3.  If `n` is either +∞_(𝔽) or -∞_(𝔽), return NaN.
4.  Return an [implementation-approximated](#implementation-approximated) Number value representing the sine of [ℝ](#ℝ)(`n`).

#### 21.3.2.32 Math.sinh ( `x` )

This function returns the hyperbolic sine of `x`.

It performs the following steps when called:

1.  Let `n` be ? [ToNumber](#sec-tonumber)(`x`).
2.  If `n` is not [finite](#finite) or `n` is either +0_(𝔽) or -0_(𝔽), return `n`.
3.  Return an [implementation-approximated](#implementation-approximated) Number value representing the hyperbolic sine of [ℝ](#ℝ)(`n`).

Note

The value of `Math.sinh(x)` is the same as the value of `(Math.exp(x) - Math.exp(-x)) / 2`.

#### 21.3.2.33 Math.sqrt ( `x` )

This function returns the square root of `x`.

It performs the following steps when called:

1.  Let `n` be ? [ToNumber](#sec-tonumber)(`x`).
2.  If `n` is one of NaN, +0_(𝔽), -0_(𝔽), or +∞_(𝔽), return `n`.
3.  If `n` \< -0_(𝔽), return NaN.
4.  Return [𝔽](#𝔽)(the square root of [ℝ](#ℝ)(`n`)).

#### 21.3.2.34 Math.tan ( `x` )

This function returns the tangent of `x`. The argument is expressed in radians.

It performs the following steps when called:

1.  Let `n` be ? [ToNumber](#sec-tonumber)(`x`).
2.  If `n` is one of NaN, +0_(𝔽), or -0_(𝔽), return `n`.
3.  If `n` is either +∞_(𝔽) or -∞_(𝔽), return NaN.
4.  Return an [implementation-approximated](#implementation-approximated) Number value representing the tangent of [ℝ](#ℝ)(`n`).

#### 21.3.2.35 Math.tanh ( `x` )

This function returns the hyperbolic tangent of `x`.

It performs the following steps when called:

1.  Let `n` be ? [ToNumber](#sec-tonumber)(`x`).
2.  If `n` is one of NaN, +0_(𝔽), or -0_(𝔽), return `n`.
3.  If `n` is +∞_(𝔽), return 1_(𝔽).
4.  If `n` is -∞_(𝔽), return -1_(𝔽).
5.  Return an [implementation-approximated](#implementation-approximated) Number value representing the hyperbolic tangent of [ℝ](#ℝ)(`n`).

Note

The value of `Math.tanh(x)` is the same as the value of `(Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x))`.

#### 21.3.2.36 Math.trunc ( `x` )

This function returns the integral part of the number `x`, removing any fractional digits. If `x` is already integral, the result is `x`.

It performs the following steps when called:

1.  Let `n` be ? [ToNumber](#sec-tonumber)(`x`).
2.  If `n` is not [finite](#finite) or `n` is either +0_(𝔽) or -0_(𝔽), return `n`.
3.  If `n` \< 1_(𝔽) and `n` \> +0_(𝔽), return +0_(𝔽).
4.  If `n` \< -0_(𝔽) and `n` \> -1_(𝔽), return -0_(𝔽).
5.  Return the [integral Number](#integral-number) nearest `n` in the direction of +0_(𝔽).

## 21.4 Date Objects

### 21.4.1 Overview of Date Objects and Definitions of Abstract Operations

The following [abstract operations](#sec-algorithm-conventions-abstract-operations) operate on [time values](#sec-time-values-and-time-range) (defined in [21.4.1.1](#sec-time-values-and-time-range)). Note that, in every case, if any argument to one of these functions is NaN, the result will be NaN.

#### 21.4.1.1 Time Values and Time Range

Time measurement in ECMAScript is analogous to time measurement in POSIX, in particular sharing definition in terms of the proleptic Gregorian calendar, an epoch of midnight at the beginning of 1 January 1970 UTC, and an accounting of every day as comprising exactly 86,400 seconds (each of which is 1000 milliseconds long).

An ECMAScript time value [is a Number](#sec-ecmascript-language-types-number-type), either a [finite](#finite) [integral Number](#integral-number) representing an instant in time to millisecond precision or NaN representing no specific instant. A time value that is a multiple of 24 × 60 × 60 × 1000 = 86,400,000 (i.e., is 86,400,000 × `d` for some [integer](#integer) `d`) represents the instant at the start of the UTC day that follows the [epoch](#epoch) by `d` whole UTC days (preceding the [epoch](#epoch) for negative `d`). Every other [finite](#finite) time value `t` is defined relative to the greatest preceding time value `s` that is such a multiple, and represents the instant that occurs within the same UTC day as `s` but follows it by (`t` - `s`) milliseconds.

Time values do not account for UTC leap seconds—there are no time values representing instants within positive leap seconds, and there are time values representing instants removed from the UTC timeline by negative leap seconds. However, the definition of time values nonetheless yields piecewise alignment with UTC, with discontinuities only at leap second boundaries and zero difference outside of leap seconds.

A Number can exactly represent all [integers](#integer) from -9,007,199,254,740,992 to 9,007,199,254,740,992 ([21.1.2.8](#sec-number.min_safe_integer) and [21.1.2.6](#sec-number.max_safe_integer)). A time value supports a slightly smaller range of -8,640,000,000,000,000 to 8,640,000,000,000,000 milliseconds. This yields a supported time value range of exactly -100,000,000 days to 100,000,000 days relative to midnight at the beginning of 1 January 1970 UTC.

The exact moment of midnight at the beginning of 1 January 1970 UTC is represented by the time value +0_(𝔽).

Note

In the proleptic Gregorian calendar, leap years are precisely those which are both divisible by 4 and either divisible by 400 or not divisible by 100.

The 400 year cycle of the proleptic Gregorian calendar contains 97 leap years. This yields an average of 365.2425 days per year, which is 31,556,952,000 milliseconds. Therefore, the maximum range a Number could represent exactly with millisecond precision is approximately -285,426 to 285,426 years relative to 1970. The smaller range supported by a time value as specified in this section is approximately -273,790 to 273,790 years relative to 1970.

#### 21.4.1.2 Time-related Constants

These constants are referenced by algorithms in the following sections.

HoursPerDay = 24

MinutesPerHour = 60

SecondsPerMinute = 60

msPerSecond = 1000_(𝔽)

msPerMinute = 60000_(𝔽) = [msPerSecond](#eqn-msPerSecond) × [𝔽](#𝔽)([SecondsPerMinute](#eqn-SecondsPerMinute))

msPerHour = 3600000_(𝔽) = [msPerMinute](#eqn-msPerMinute) × [𝔽](#𝔽)([MinutesPerHour](#eqn-MinutesPerHour))

msPerDay = 86400000_(𝔽) = [msPerHour](#eqn-msPerHour) × [𝔽](#𝔽)([HoursPerDay](#eqn-HoursPerDay))

#### 21.4.1.3 Day ( `t` )

The abstract operation Day takes argument `t` (a [finite](#finite) [time value](#sec-time-values-and-time-range)) and returns an [integral Number](#integral-number). It returns the day number of the day in which `t` falls. It performs the following steps when called:

1.  Return [𝔽](#𝔽)([floor](#eqn-floor)([ℝ](#ℝ)(`t` / [msPerDay](#eqn-msPerDay)))).

#### 21.4.1.4 TimeWithinDay ( `t` )

The abstract operation TimeWithinDay takes argument `t` (a [finite](#finite) [time value](#sec-time-values-and-time-range)) and returns an [integral Number](#integral-number) in the [interval](#interval) from +0_(𝔽) (inclusive) to [msPerDay](#eqn-msPerDay) (exclusive). It returns the number of milliseconds since the start of the day in which `t` falls. It performs the following steps when called:

1.  Return [𝔽](#𝔽)([ℝ](#ℝ)(`t`) [modulo](#eqn-modulo) [ℝ](#ℝ)([msPerDay](#eqn-msPerDay))).

#### 21.4.1.5 DaysInYear ( `y` )

The abstract operation DaysInYear takes argument `y` (an [integral Number](#integral-number)) and returns 365_(𝔽) or 366_(𝔽). It returns the number of days in year `y`. Leap years have 366 days; all other years have 365. It performs the following steps when called:

1.  Let `ry` be [ℝ](#ℝ)(`y`).
2.  If (`ry` [modulo](#eqn-modulo) 400) = 0, return 366_(𝔽).
3.  If (`ry` [modulo](#eqn-modulo) 100) = 0, return 365_(𝔽).
4.  If (`ry` [modulo](#eqn-modulo) 4) = 0, return 366_(𝔽).
5.  Return 365_(𝔽).

#### 21.4.1.6 DayFromYear ( `y` )

The abstract operation DayFromYear takes argument `y` (an [integral Number](#integral-number)) and returns an [integral Number](#integral-number). It returns the day number of the first day of year `y`. It performs the following steps when called:

1.  Let `ry` be [ℝ](#ℝ)(`y`).
2.  NOTE: In the following steps, `numYears1`, `numYears4`, `numYears100`, and `numYears400` represent the number of years divisible by 1, 4, 100, and 400, respectively, that occur between the [epoch](#epoch) and the start of year `y`. The number is negative if `y` is before the [epoch](#epoch).
3.  Let `numYears1` be (`ry` - 1970).
4.  Let `numYears4` be [floor](#eqn-floor)((`ry` - 1969) / 4).
5.  Let `numYears100` be [floor](#eqn-floor)((`ry` - 1901) / 100).
6.  Let `numYears400` be [floor](#eqn-floor)((`ry` - 1601) / 400).
7.  Return [𝔽](#𝔽)(365 × `numYears1` + `numYears4` - `numYears100` + `numYears400`).

#### 21.4.1.7 TimeFromYear ( `y` )

The abstract operation TimeFromYear takes argument `y` (an [integral Number](#integral-number)) and returns a [time value](#sec-time-values-and-time-range). It returns the [time value](#sec-time-values-and-time-range) of the start of year `y`. It performs the following steps when called:

1.  Return [msPerDay](#eqn-msPerDay) × [DayFromYear](#sec-dayfromyear)(`y`).

#### 21.4.1.8 YearFromTime ( `t` )

The abstract operation YearFromTime takes argument `t` (a [finite](#finite) [time value](#sec-time-values-and-time-range)) and returns an [integral Number](#integral-number). It returns the year in which `t` falls. It performs the following steps when called:

1.  Return the largest [integral Number](#integral-number) `y` (closest to +∞) such that [TimeFromYear](#sec-timefromyear)(`y`) ≤ `t`.

#### 21.4.1.9 DayWithinYear ( `t` )

The abstract operation DayWithinYear takes argument `t` (a [finite](#finite) [time value](#sec-time-values-and-time-range)) and returns an [integral Number](#integral-number) in the [inclusive interval](#inclusive-interval) from +0_(𝔽) to 365_(𝔽). It performs the following steps when called:

1.  Return [Day](#sec-day)(`t`) - [DayFromYear](#sec-dayfromyear)([YearFromTime](#sec-yearfromtime)(`t`)).

#### 21.4.1.10 InLeapYear ( `t` )

The abstract operation InLeapYear takes argument `t` (a [finite](#finite) [time value](#sec-time-values-and-time-range)) and returns +0_(𝔽) or 1_(𝔽). It returns 1_(𝔽) if `t` is within a leap year and +0_(𝔽) otherwise. It performs the following steps when called:

1.  If [DaysInYear](#sec-daysinyear)([YearFromTime](#sec-yearfromtime)(`t`)) is 366_(𝔽), return 1_(𝔽); else return +0_(𝔽).

#### 21.4.1.11 MonthFromTime ( `t` )

The abstract operation MonthFromTime takes argument `t` (a [finite](#finite) [time value](#sec-time-values-and-time-range)) and returns an [integral Number](#integral-number) in the [inclusive interval](#inclusive-interval) from +0_(𝔽) to 11_(𝔽). It returns a Number identifying the month in which `t` falls. A month value of +0_(𝔽) specifies January; 1_(𝔽) specifies February; 2_(𝔽) specifies March; 3_(𝔽) specifies April; 4_(𝔽) specifies May; 5_(𝔽) specifies June; 6_(𝔽) specifies July; 7_(𝔽) specifies August; 8_(𝔽) specifies September; 9_(𝔽) specifies October; 10_(𝔽) specifies November; and 11_(𝔽) specifies December. Note that MonthFromTime(+0_(𝔽)) = +0_(𝔽), corresponding to Thursday, 1 January 1970. It performs the following steps when called:

1.  Let `inLeapYear` be [InLeapYear](#sec-inleapyear)(`t`).
2.  Let `dayWithinYear` be [DayWithinYear](#sec-daywithinyear)(`t`).
3.  If `dayWithinYear` \< 31_(𝔽), return +0_(𝔽).
4.  If `dayWithinYear` \< 59_(𝔽) + `inLeapYear`, return 1_(𝔽).
5.  If `dayWithinYear` \< 90_(𝔽) + `inLeapYear`, return 2_(𝔽).
6.  If `dayWithinYear` \< 120_(𝔽) + `inLeapYear`, return 3_(𝔽).
7.  If `dayWithinYear` \< 151_(𝔽) + `inLeapYear`, return 4_(𝔽).
8.  If `dayWithinYear` \< 181_(𝔽) + `inLeapYear`, return 5_(𝔽).
9.  If `dayWithinYear` \< 212_(𝔽) + `inLeapYear`, return 6_(𝔽).
10. If `dayWithinYear` \< 243_(𝔽) + `inLeapYear`, return 7_(𝔽).
11. If `dayWithinYear` \< 273_(𝔽) + `inLeapYear`, return 8_(𝔽).
12. If `dayWithinYear` \< 304_(𝔽) + `inLeapYear`, return 9_(𝔽).
13. If `dayWithinYear` \< 334_(𝔽) + `inLeapYear`, return 10_(𝔽).
14. [Assert](#assert): `dayWithinYear` \< 365_(𝔽) + `inLeapYear`.
15. Return 11_(𝔽).

#### 21.4.1.12 DateFromTime ( `t` )

The abstract operation DateFromTime takes argument `t` (a [finite](#finite) [time value](#sec-time-values-and-time-range)) and returns an [integral Number](#integral-number) in the [inclusive interval](#inclusive-interval) from 1_(𝔽) to 31_(𝔽). It returns the day of the month in which `t` falls. It performs the following steps when called:

1.  Let `inLeapYear` be [InLeapYear](#sec-inleapyear)(`t`).
2.  Let `dayWithinYear` be [DayWithinYear](#sec-daywithinyear)(`t`).
3.  Let `month` be [MonthFromTime](#sec-monthfromtime)(`t`).
4.  If `month` is +0_(𝔽), return `dayWithinYear` + 1_(𝔽).
5.  If `month` is 1_(𝔽), return `dayWithinYear` - 30_(𝔽).
6.  If `month` is 2_(𝔽), return `dayWithinYear` - 58_(𝔽) - `inLeapYear`.
7.  If `month` is 3_(𝔽), return `dayWithinYear` - 89_(𝔽) - `inLeapYear`.
8.  If `month` is 4_(𝔽), return `dayWithinYear` - 119_(𝔽) - `inLeapYear`.
9.  If `month` is 5_(𝔽), return `dayWithinYear` - 150_(𝔽) - `inLeapYear`.
10. If `month` is 6_(𝔽), return `dayWithinYear` - 180_(𝔽) - `inLeapYear`.
11. If `month` is 7_(𝔽), return `dayWithinYear` - 211_(𝔽) - `inLeapYear`.
12. If `month` is 8_(𝔽), return `dayWithinYear` - 242_(𝔽) - `inLeapYear`.
13. If `month` is 9_(𝔽), return `dayWithinYear` - 272_(𝔽) - `inLeapYear`.
14. If `month` is 10_(𝔽), return `dayWithinYear` - 303_(𝔽) - `inLeapYear`.
15. [Assert](#assert): `month` is 11_(𝔽).
16. Return `dayWithinYear` - 333_(𝔽) - `inLeapYear`.

#### 21.4.1.13 WeekDay ( `t` )

The abstract operation WeekDay takes argument `t` (a [finite](#finite) [time value](#sec-time-values-and-time-range)) and returns an [integral Number](#integral-number) in the [inclusive interval](#inclusive-interval) from +0_(𝔽) to 6_(𝔽). It returns a Number identifying the day of the week in which `t` falls. A weekday value of +0_(𝔽) specifies Sunday; 1_(𝔽) specifies Monday; 2_(𝔽) specifies Tuesday; 3_(𝔽) specifies Wednesday; 4_(𝔽) specifies Thursday; 5_(𝔽) specifies Friday; and 6_(𝔽) specifies Saturday. Note that WeekDay(+0_(𝔽)) = 4_(𝔽), corresponding to Thursday, 1 January 1970. It performs the following steps when called:

1.  Return [𝔽](#𝔽)([ℝ](#ℝ)([Day](#sec-day)(`t`) + 4_(𝔽)) [modulo](#eqn-modulo) 7).

#### 21.4.1.14 HourFromTime ( `t` )

The abstract operation HourFromTime takes argument `t` (a [finite](#finite) [time value](#sec-time-values-and-time-range)) and returns an [integral Number](#integral-number) in the [inclusive interval](#inclusive-interval) from +0_(𝔽) to 23_(𝔽). It returns the hour of the day in which `t` falls. It performs the following steps when called:

1.  Return [𝔽](#𝔽)([floor](#eqn-floor)([ℝ](#ℝ)(`t` / [msPerHour](#eqn-msPerHour))) [modulo](#eqn-modulo) [HoursPerDay](#eqn-HoursPerDay)).

#### 21.4.1.15 MinFromTime ( `t` )

The abstract operation MinFromTime takes argument `t` (a [finite](#finite) [time value](#sec-time-values-and-time-range)) and returns an [integral Number](#integral-number) in the [inclusive interval](#inclusive-interval) from +0_(𝔽) to 59_(𝔽). It returns the minute of the hour in which `t` falls. It performs the following steps when called:

1.  Return [𝔽](#𝔽)([floor](#eqn-floor)([ℝ](#ℝ)(`t` / [msPerMinute](#eqn-msPerMinute))) [modulo](#eqn-modulo) [MinutesPerHour](#eqn-MinutesPerHour)).

#### 21.4.1.16 SecFromTime ( `t` )

The abstract operation SecFromTime takes argument `t` (a [finite](#finite) [time value](#sec-time-values-and-time-range)) and returns an [integral Number](#integral-number) in the [inclusive interval](#inclusive-interval) from +0_(𝔽) to 59_(𝔽). It returns the second of the minute in which `t` falls. It performs the following steps when called:

1.  Return [𝔽](#𝔽)([floor](#eqn-floor)([ℝ](#ℝ)(`t` / [msPerSecond](#eqn-msPerSecond))) [modulo](#eqn-modulo) [SecondsPerMinute](#eqn-SecondsPerMinute)).

#### 21.4.1.17 msFromTime ( `t` )

The abstract operation msFromTime takes argument `t` (a [finite](#finite) [time value](#sec-time-values-and-time-range)) and returns an [integral Number](#integral-number) in the [inclusive interval](#inclusive-interval) from +0_(𝔽) to 999_(𝔽). It returns the millisecond of the second in which `t` falls. It performs the following steps when called:

1.  Return [𝔽](#𝔽)([ℝ](#ℝ)(`t`) [modulo](#eqn-modulo) [ℝ](#ℝ)([msPerSecond](#eqn-msPerSecond))).

#### 21.4.1.18 GetUTCEpochNanoseconds ( `year`, `month`, `day`, `hour`, `minute`, `second`, `millisecond`, `microsecond`, `nanosecond` )

The abstract operation GetUTCEpochNanoseconds takes arguments `year` (an [integer](#integer)), `month` (an [integer](#integer) in the [inclusive interval](#inclusive-interval) from 1 to 12), `day` (an [integer](#integer) in the [inclusive interval](#inclusive-interval) from 1 to 31), `hour` (an [integer](#integer) in the [inclusive interval](#inclusive-interval) from 0 to 23), `minute` (an [integer](#integer) in the [inclusive interval](#inclusive-interval) from 0 to 59), `second` (an [integer](#integer) in the [inclusive interval](#inclusive-interval) from 0 to 59), `millisecond` (an [integer](#integer) in the [inclusive interval](#inclusive-interval) from 0 to 999), `microsecond` (an [integer](#integer) in the [inclusive interval](#inclusive-interval) from 0 to 999), and `nanosecond` (an [integer](#integer) in the [inclusive interval](#inclusive-interval) from 0 to 999) and returns a BigInt. The returned value represents a number of nanoseconds since the [epoch](#epoch) that corresponds to the given ISO 8601 calendar date and wall-clock time in UTC. It performs the following steps when called:

1.  Let `date` be [MakeDay](#sec-makeday)([𝔽](#𝔽)(`year`), [𝔽](#𝔽)(`month` - 1), [𝔽](#𝔽)(`day`)).
2.  Let `time` be [MakeTime](#sec-maketime)([𝔽](#𝔽)(`hour`), [𝔽](#𝔽)(`minute`), [𝔽](#𝔽)(`second`), [𝔽](#𝔽)(`millisecond`)).
3.  Let `ms` be [MakeDate](#sec-makedate)(`date`, `time`).
4.  [Assert](#assert): `ms` is an [integral Number](#integral-number).
5.  Return [ℤ](#ℤ)([ℝ](#ℝ)(`ms`) × 10\*\*⁶ + `microsecond` × 10\*\*³ + `nanosecond`).

#### 21.4.1.19 Time Zone Identifiers

Time zones in ECMAScript are represented by time zone identifiers, which are Strings composed entirely of code units in the [inclusive interval](#inclusive-interval) from 0x0000 to 0x007F. Time zones supported by an ECMAScript implementation may be available named time zones, represented by the `[[Identifier]]` field of the [Time Zone Identifier Records](#sec-time-zone-identifier-record) returned by [AvailableNamedTimeZoneIdentifiers](#sec-availablenamedtimezoneidentifiers), or offset time zones, represented by Strings for which [IsTimeZoneOffsetString](#sec-istimezoneoffsetstring) returns true.

A primary time zone identifier is the preferred identifier for an available named time zone. A non-primary time zone identifier is an identifier for an available named time zone that is not a primary time zone identifier. An available named time zone identifier is either a primary time zone identifier or a non-primary time zone identifier. Each available named time zone identifier is associated with exactly one available named time zone. Each available named time zone is associated with exactly one primary time zone identifier and zero or more non-primary time zone identifiers.

ECMAScript implementations must support an available named time zone with the identifier "UTC", which must be the primary time zone identifier for the UTC time zone. In addition, implementations may support any number of other available named time zones.

Implementations that follow the requirements for time zones as described in the ECMA-402 Internationalization API specification are called time zone aware. Time zone aware implementations must support available named time zones corresponding to the Zone and Link names of the IANA Time Zone Database, and only such names. In time zone aware implementations, a primary time zone identifier is a Zone name, and a non-primary time zone identifier is a Link name, respectively, in the IANA Time Zone Database except as specifically overridden by [AvailableNamedTimeZoneIdentifiers](#sec-availablenamedtimezoneidentifiers) as specified in the ECMA-402 specification. Implementations that do not support the entire IANA Time Zone Database are still recommended to use IANA Time Zone Database names as identifiers to represent time zones.

#### 21.4.1.20 GetNamedTimeZoneEpochNanoseconds ( `timeZoneIdentifier`, `year`, `month`, `day`, `hour`, `minute`, `second`, `millisecond`, `microsecond`, `nanosecond` )

The [implementation-defined](#implementation-defined) abstract operation GetNamedTimeZoneEpochNanoseconds takes arguments `timeZoneIdentifier` (a String), `year` (an [integer](#integer)), `month` (an [integer](#integer) in the [inclusive interval](#inclusive-interval) from 1 to 12), `day` (an [integer](#integer) in the [inclusive interval](#inclusive-interval) from 1 to 31), `hour` (an [integer](#integer) in the [inclusive interval](#inclusive-interval) from 0 to 23), `minute` (an [integer](#integer) in the [inclusive interval](#inclusive-interval) from 0 to 59), `second` (an [integer](#integer) in the [inclusive interval](#inclusive-interval) from 0 to 59), `millisecond` (an [integer](#integer) in the [inclusive interval](#inclusive-interval) from 0 to 999), `microsecond` (an [integer](#integer) in the [inclusive interval](#inclusive-interval) from 0 to 999), and `nanosecond` (an [integer](#integer) in the [inclusive interval](#inclusive-interval) from 0 to 999) and returns a [List](#sec-list-and-record-specification-type) of BigInts. Each value in the returned [List](#sec-list-and-record-specification-type) represents a number of nanoseconds since the [epoch](#epoch) that corresponds to the given ISO 8601 calendar date and wall-clock time in the named time zone identified by `timeZoneIdentifier`.

When the input represents a local time occurring more than once because of a negative time zone transition (e.g. when daylight saving time ends or the time zone offset is decreased due to a time zone rule change), the returned [List](#sec-list-and-record-specification-type) will have more than one element and will be sorted by ascending numerical value. When the input represents a local time skipped because of a positive time zone transition (e.g. when daylight saving time begins or the time zone offset is increased due to a time zone rule change), the returned [List](#sec-list-and-record-specification-type) will be empty. Otherwise, the returned [List](#sec-list-and-record-specification-type) will have one element.

The default implementation of GetNamedTimeZoneEpochNanoseconds, to be used for ECMAScript implementations that do not include local political rules for any time zones, performs the following steps when called:

1.  [Assert](#assert): `timeZoneIdentifier` is "UTC".
2.  Let `epochNanoseconds` be [GetUTCEpochNanoseconds](#sec-getutcepochnanoseconds)(`year`, `month`, `day`, `hour`, `minute`, `second`, `millisecond`, `microsecond`, `nanosecond`).
3.  Return « `epochNanoseconds` ».

Note

It is required for [time zone aware](#sec-time-zone-identifiers) implementations (and recommended for all others) to use the time zone information of the IANA Time Zone Database <https://www.iana.org/time-zones/>.

1:30 AM on 5 November 2017 in America/New_York is repeated twice, so GetNamedTimeZoneEpochNanoseconds("America/New_York", 2017, 11, 5, 1, 30, 0, 0, 0, 0) would return a [List](#sec-list-and-record-specification-type) of length 2 in which the first element represents 05:30 UTC (corresponding with 01:30 US Eastern Daylight Time at UTC offset -04:00) and the second element represents 06:30 UTC (corresponding with 01:30 US Eastern Standard Time at UTC offset -05:00).

2:30 AM on 12 March 2017 in America/New_York does not exist, so GetNamedTimeZoneEpochNanoseconds("America/New_York", 2017, 3, 12, 2, 30, 0, 0, 0, 0) would return an empty [List](#sec-list-and-record-specification-type).

#### 21.4.1.21 GetNamedTimeZoneOffsetNanoseconds ( `timeZoneIdentifier`, `epochNanoseconds` )

The [implementation-defined](#implementation-defined) abstract operation GetNamedTimeZoneOffsetNanoseconds takes arguments `timeZoneIdentifier` (a String) and `epochNanoseconds` (a BigInt) and returns an [integer](#integer).

The returned [integer](#integer) represents the offset from UTC of the named time zone identified by `timeZoneIdentifier`, at the instant corresponding with `epochNanoseconds` relative to the [epoch](#epoch), both in nanoseconds.

The default implementation of GetNamedTimeZoneOffsetNanoseconds, to be used for ECMAScript implementations that do not include local political rules for any time zones, performs the following steps when called:

1.  [Assert](#assert): `timeZoneIdentifier` is "UTC".
2.  Return 0.

Note

Time zone offset values may be positive or negative.

#### 21.4.1.22 Time Zone Identifier Record

A Time Zone Identifier Record is a [Record](#sec-list-and-record-specification-type) used to describe an [available named time zone identifier](#sec-time-zone-identifiers) and its corresponding [primary time zone identifier](#sec-time-zone-identifiers).

Time Zone Identifier Records have the fields listed in [Table 64](#table-time-zone-identifier-record-fields).

| Field Name | Value | Meaning |
|----|----|----|
| `[[Identifier]]` | a String | An [available named time zone identifier](#sec-time-zone-identifiers) that is supported by the implementation. |
| `[[PrimaryIdentifier]]` | a String | The [primary time zone identifier](#sec-time-zone-identifiers) that `[[Identifier]]` resolves to. |

Table 64: [Time Zone Identifier Record](#sec-time-zone-identifier-record) Fields

Note

If `[[Identifier]]` is a [primary time zone identifier](#sec-time-zone-identifiers), then `[[Identifier]]` is `[[PrimaryIdentifier]]`.

#### 21.4.1.23 AvailableNamedTimeZoneIdentifiers ( )

The [implementation-defined](#implementation-defined) abstract operation AvailableNamedTimeZoneIdentifiers takes no arguments and returns a [List](#sec-list-and-record-specification-type) of [Time Zone Identifier Records](#sec-time-zone-identifier-record). Its result describes all [available named time zone identifiers](#sec-time-zone-identifiers) in this implementation, as well as the [primary time zone identifier](#sec-time-zone-identifiers) corresponding to each [available named time zone identifier](#sec-time-zone-identifiers). The [List](#sec-list-and-record-specification-type) is ordered according to the `[[Identifier]]` field of each [Time Zone Identifier Record](#sec-time-zone-identifier-record).

[Time zone aware](#sec-time-zone-identifiers) implementations, including all implementations that implement the ECMA-402 Internationalization API, must implement the AvailableNamedTimeZoneIdentifiers abstract operation as specified in the ECMA-402 specification. For implementations that are not [time zone aware](#sec-time-zone-identifiers), AvailableNamedTimeZoneIdentifiers performs the following steps when called:

1.  If the implementation does not include local political rules for any time zones, then
    1.  Return « the [Time Zone Identifier Record](#sec-time-zone-identifier-record) { `[[Identifier]]`: "UTC", `[[PrimaryIdentifier]]`: "UTC" } ».
2.  Let `identifiers` be the [List](#sec-list-and-record-specification-type) of unique [available named time zone identifiers](#sec-time-zone-identifiers), sorted according to [lexicographic code unit order](#lexicographic-code-unit-order).
3.  Let `result` be a new empty [List](#sec-list-and-record-specification-type).
4.  For each element `identifier` of `identifiers`, do
    1.  Let `primary` be `identifier`.
    2.  If `identifier` is a [non-primary time zone identifier](#sec-time-zone-identifiers) in this implementation and `identifier` is not "UTC", then
        1.  Set `primary` to the [primary time zone identifier](#sec-time-zone-identifiers) associated with `identifier`.
        2.  NOTE: An implementation may need to resolve `identifier` iteratively to obtain the [primary time zone identifier](#sec-time-zone-identifiers).
    3.  Let `record` be the [Time Zone Identifier Record](#sec-time-zone-identifier-record) { `[[Identifier]]`: `identifier`, `[[PrimaryIdentifier]]`: `primary` }.
    4.  Append `record` to `result`.
5.  [Assert](#assert): `result` contains a [Time Zone Identifier Record](#sec-time-zone-identifier-record) `r` such that `r`.`[[Identifier]]` is "UTC" and `r`.`[[PrimaryIdentifier]]` is "UTC".
6.  Return `result`.

#### 21.4.1.24 SystemTimeZoneIdentifier ( )

The [implementation-defined](#implementation-defined) abstract operation SystemTimeZoneIdentifier takes no arguments and returns a String. It returns a String representing the [host environment](#host-environment)'s current time zone, which is either a String representing a UTC offset for which [IsTimeZoneOffsetString](#sec-istimezoneoffsetstring) returns true, or a [primary time zone identifier](#sec-time-zone-identifiers). It performs the following steps when called:

1.  If the implementation only supports the UTC time zone, return "UTC".
2.  Let `systemTimeZoneString` be the String representing the [host environment](#host-environment)'s current time zone, either a [primary time zone identifier](#sec-time-zone-identifiers) or an [offset time zone](#sec-time-zone-identifiers) identifier.
3.  Return `systemTimeZoneString`.

Note

To ensure the level of functionality that implementations commonly provide in the methods of the Date object, it is recommended that SystemTimeZoneIdentifier return an IANA time zone name corresponding to the [host environment](#host-environment)'s time zone setting, if such a thing exists. [GetNamedTimeZoneEpochNanoseconds](#sec-getnamedtimezoneepochnanoseconds) and [GetNamedTimeZoneOffsetNanoseconds](#sec-getnamedtimezoneoffsetnanoseconds) must reflect the local political rules for standard time and daylight saving time in that time zone, if such rules exist.

For example, if the [host environment](#host-environment) is a browser on a system where the user has chosen US Eastern Time as their time zone, SystemTimeZoneIdentifier returns "America/New_York".

#### 21.4.1.25 LocalTime ( `t` )

The abstract operation LocalTime takes argument `t` (a [finite](#finite) [time value](#sec-time-values-and-time-range)) and returns an [integral Number](#integral-number). It converts `t` from UTC to local time. The local political rules for standard time and daylight saving time in effect at `t` should be used to determine the result in the way specified in this section. It performs the following steps when called:

1.  Let `systemTimeZoneIdentifier` be [SystemTimeZoneIdentifier](#sec-systemtimezoneidentifier)().
2.  If [IsTimeZoneOffsetString](#sec-istimezoneoffsetstring)(`systemTimeZoneIdentifier`) is true, then
    1.  Let `offsetNs` be [ParseTimeZoneOffsetString](#sec-parsetimezoneoffsetstring)(`systemTimeZoneIdentifier`).
3.  Else,
    1.  Let `offsetNs` be [GetNamedTimeZoneOffsetNanoseconds](#sec-getnamedtimezoneoffsetnanoseconds)(`systemTimeZoneIdentifier`, [ℤ](#ℤ)([ℝ](#ℝ)(`t`) × 10\*\*⁶)).
4.  Let `offsetMs` be [truncate](#eqn-truncate)(`offsetNs` / 10\*\*⁶).
5.  Return `t` + [𝔽](#𝔽)(`offsetMs`).

Note 1

If political rules for the local time `t` are not available within the implementation, the result is `t` because [SystemTimeZoneIdentifier](#sec-systemtimezoneidentifier) returns "UTC" and [GetNamedTimeZoneOffsetNanoseconds](#sec-getnamedtimezoneoffsetnanoseconds) returns 0.

Note 2

It is required for [time zone aware](#sec-time-zone-identifiers) implementations (and recommended for all others) to use the time zone information of the IANA Time Zone Database <https://www.iana.org/time-zones/>.

Note 3

Two different input [time values](#sec-time-values-and-time-range) `t`_(UTC) are converted to the same local time t_(local) at a negative time zone transition when there are repeated times (e.g. the daylight saving time ends or the time zone adjustment is decreased.).

LocalTime([UTC](#sec-utc-t)(`t`_(local))) is not necessarily always equal to `t`_(local). Correspondingly, [UTC](#sec-utc-t)(LocalTime(`t`_(UTC))) is not necessarily always equal to `t`_(UTC).

#### 21.4.1.26 UTC ( `t` )

The abstract operation UTC takes argument `t` (a Number) and returns a [time value](#sec-time-values-and-time-range). It converts `t` from local time to a UTC [time value](#sec-time-values-and-time-range). The local political rules for standard time and daylight saving time in effect at `t` should be used to determine the result in the way specified in this section. It performs the following steps when called:

1.  If `t` is not [finite](#finite), return NaN.
2.  Let `systemTimeZoneIdentifier` be [SystemTimeZoneIdentifier](#sec-systemtimezoneidentifier)().
3.  If [IsTimeZoneOffsetString](#sec-istimezoneoffsetstring)(`systemTimeZoneIdentifier`) is true, then
    1.  Let `offsetNs` be [ParseTimeZoneOffsetString](#sec-parsetimezoneoffsetstring)(`systemTimeZoneIdentifier`).
4.  Else,
    1.  Let `possibleInstants` be [GetNamedTimeZoneEpochNanoseconds](#sec-getnamedtimezoneepochnanoseconds)(`systemTimeZoneIdentifier`, [ℝ](#ℝ)([YearFromTime](#sec-yearfromtime)(`t`)), [ℝ](#ℝ)([MonthFromTime](#sec-monthfromtime)(`t`)) + 1, [ℝ](#ℝ)([DateFromTime](#sec-datefromtime)(`t`)), [ℝ](#ℝ)([HourFromTime](#sec-hourfromtime)(`t`)), [ℝ](#ℝ)([MinFromTime](#sec-minfromtime)(`t`)), [ℝ](#ℝ)([SecFromTime](#sec-secfromtime)(`t`)), [ℝ](#ℝ)([msFromTime](#sec-msfromtime)(`t`)), 0, 0).
    2.  NOTE: The following steps ensure that when `t` represents local time repeating multiple times at a negative time zone transition (e.g. when the daylight saving time ends or the time zone offset is decreased due to a time zone rule change) or skipped local time at a positive time zone transition (e.g. when the daylight saving time starts or the time zone offset is increased due to a time zone rule change), `t` is interpreted using the time zone offset before the transition.
    3.  If `possibleInstants` is not empty, then
        1.  Let `disambiguatedInstant` be `possibleInstants`\[0\].
    4.  Else,
        1.  NOTE: `t` represents a local time skipped at a positive time zone transition (e.g. due to daylight saving time starting or a time zone rule change increasing the UTC offset).
        2.  Let `possibleInstantsBefore` be [GetNamedTimeZoneEpochNanoseconds](#sec-getnamedtimezoneepochnanoseconds)(`systemTimeZoneIdentifier`, [ℝ](#ℝ)([YearFromTime](#sec-yearfromtime)(`tBefore`)), [ℝ](#ℝ)([MonthFromTime](#sec-monthfromtime)(`tBefore`)) + 1, [ℝ](#ℝ)([DateFromTime](#sec-datefromtime)(`tBefore`)), [ℝ](#ℝ)([HourFromTime](#sec-hourfromtime)(`tBefore`)), [ℝ](#ℝ)([MinFromTime](#sec-minfromtime)(`tBefore`)), [ℝ](#ℝ)([SecFromTime](#sec-secfromtime)(`tBefore`)), [ℝ](#ℝ)([msFromTime](#sec-msfromtime)(`tBefore`)), 0, 0), where `tBefore` is the largest [integral Number](#integral-number) \< `t` for which `possibleInstantsBefore` is not empty (i.e., `tBefore` represents the last local time before the transition).
        3.  Let `disambiguatedInstant` be the last element of `possibleInstantsBefore`.
    5.  Let `offsetNs` be [GetNamedTimeZoneOffsetNanoseconds](#sec-getnamedtimezoneoffsetnanoseconds)(`systemTimeZoneIdentifier`, `disambiguatedInstant`).
5.  Let `offsetMs` be [truncate](#eqn-truncate)(`offsetNs` / 10\*\*⁶).
6.  Return `t` - [𝔽](#𝔽)(`offsetMs`).

Input `t` is nominally a [time value](#sec-time-values-and-time-range) but may be any Number value. The algorithm must not limit `t` to the [time value](#sec-time-values-and-time-range) range, so that inputs corresponding with a boundary of the [time value](#sec-time-values-and-time-range) range can be supported regardless of local UTC offset. For example, the maximum [time value](#sec-time-values-and-time-range) is 8.64 × 10\*\*¹⁵, corresponding with "+275760-09-13T00:00:00Z". In an environment where the local time zone offset is ahead of UTC by 1 hour at that instant, it is represented by the larger input of 8.64 × 10\*\*¹⁵ + 3.6 × 10\*\*⁶, corresponding with "+275760-09-13T01:00:00+01:00".

If political rules for the local time `t` are not available within the implementation, the result is `t` because [SystemTimeZoneIdentifier](#sec-systemtimezoneidentifier) returns "UTC" and [GetNamedTimeZoneOffsetNanoseconds](#sec-getnamedtimezoneoffsetnanoseconds) returns 0.

Note 1

It is required for [time zone aware](#sec-time-zone-identifiers) implementations (and recommended for all others) to use the time zone information of the IANA Time Zone Database <https://www.iana.org/time-zones/>.

1:30 AM on 5 November 2017 in America/New_York is repeated twice (fall backward), but it must be interpreted as 1:30 AM UTC-04 instead of 1:30 AM UTC-05. In UTC([TimeClip](#sec-timeclip)([MakeDate](#sec-makedate)([MakeDay](#sec-makeday)(2017, 10, 5), [MakeTime](#sec-maketime)(1, 30, 0, 0)))), the value of `offsetMs` is -4 × [msPerHour](#eqn-msPerHour).

2:30 AM on 12 March 2017 in America/New_York does not exist, but it must be interpreted as 2:30 AM UTC-05 (equivalent to 3:30 AM UTC-04). In UTC([TimeClip](#sec-timeclip)([MakeDate](#sec-makedate)([MakeDay](#sec-makeday)(2017, 2, 12), [MakeTime](#sec-maketime)(2, 30, 0, 0)))), the value of `offsetMs` is -5 × [msPerHour](#eqn-msPerHour).

Note 2

UTC([LocalTime](#sec-localtime)(`t`_(UTC))) is not necessarily always equal to `t`_(UTC). Correspondingly, [LocalTime](#sec-localtime)(UTC(`t`_(local))) is not necessarily always equal to `t`_(local).

#### 21.4.1.27 MakeTime ( `hour`, `min`, `sec`, `ms` )

The abstract operation MakeTime takes arguments `hour` (a Number), `min` (a Number), `sec` (a Number), and `ms` (a Number) and returns a Number. It calculates a number of milliseconds. It performs the following steps when called:

1.  If `hour` is not [finite](#finite), `min` is not [finite](#finite), `sec` is not [finite](#finite), or `ms` is not [finite](#finite), return NaN.
2.  Let `h` be [𝔽](#𝔽)(! [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`hour`)).
3.  Let `m` be [𝔽](#𝔽)(! [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`min`)).
4.  Let `s` be [𝔽](#𝔽)(! [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`sec`)).
5.  Let `milli` be [𝔽](#𝔽)(! [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`ms`)).
6.  Return ((`h` × [msPerHour](#eqn-msPerHour) + `m` × [msPerMinute](#eqn-msPerMinute)) + `s` × [msPerSecond](#eqn-msPerSecond)) + `milli`.

Note

The arithmetic in MakeTime is floating-point arithmetic, which is not associative, so the operations must be performed in the correct order.

#### 21.4.1.28 MakeDay ( `year`, `month`, `date` )

The abstract operation MakeDay takes arguments `year` (a Number), `month` (a Number), and `date` (a Number) and returns a Number. It calculates a number of days. It performs the following steps when called:

1.  If `year` is not [finite](#finite), `month` is not [finite](#finite), or `date` is not [finite](#finite), return NaN.
2.  Let `y` be [𝔽](#𝔽)(! [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`year`)).
3.  Let `m` be [𝔽](#𝔽)(! [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`month`)).
4.  Let `dt` be [𝔽](#𝔽)(! [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`date`)).
5.  Let `ym` be `y` + [𝔽](#𝔽)([floor](#eqn-floor)([ℝ](#ℝ)(`m`) / 12)).
6.  If `ym` is not [finite](#finite), return NaN.
7.  Let `mn` be [𝔽](#𝔽)([ℝ](#ℝ)(`m`) [modulo](#eqn-modulo) 12).
8.  Find a [finite](#finite) [time value](#sec-time-values-and-time-range) `t` such that [YearFromTime](#sec-yearfromtime)(`t`) is `ym`, [MonthFromTime](#sec-monthfromtime)(`t`) is `mn`, and [DateFromTime](#sec-datefromtime)(`t`) is 1_(𝔽); but if this is not possible (because some argument is out of range), return NaN.
9.  Return [Day](#sec-day)(`t`) + `dt` - 1_(𝔽).

#### 21.4.1.29 MakeDate ( `day`, `time` )

The abstract operation MakeDate takes arguments `day` (a Number) and `time` (a Number) and returns a Number. It calculates a number of milliseconds. It performs the following steps when called:

1.  If `day` is not [finite](#finite) or `time` is not [finite](#finite), return NaN.
2.  Let `tv` be `day` × [msPerDay](#eqn-msPerDay) + `time`.
3.  If `tv` is not [finite](#finite), return NaN.
4.  Return `tv`.

#### 21.4.1.30 MakeFullYear ( `year` )

The abstract operation MakeFullYear takes argument `year` (a Number) and returns an [integral Number](#integral-number) or NaN. It returns the full year associated with the [integer](#integer) part of `year`, interpreting any value in the [inclusive interval](#inclusive-interval) from 0 to 99 as a count of years since the start of 1900. For alignment with the proleptic Gregorian calendar, "full year" is defined as the signed count of complete years since the start of year 0 (1 B.C.). It performs the following steps when called:

1.  If `year` is NaN, return NaN.
2.  Let `truncated` be ! [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`year`).
3.  If `truncated` is in the [inclusive interval](#inclusive-interval) from 0 to 99, return 1900_(𝔽) + [𝔽](#𝔽)(`truncated`).
4.  Return [𝔽](#𝔽)(`truncated`).

#### 21.4.1.31 TimeClip ( `time` )

The abstract operation TimeClip takes argument `time` (a Number) and returns a Number. It calculates a number of milliseconds. It performs the following steps when called:

1.  If `time` is not [finite](#finite), return NaN.
2.  If [abs](#eqn-abs)([ℝ](#ℝ)(`time`)) \> 8.64 × 10\*\*¹⁵, return NaN.
3.  Return [𝔽](#𝔽)(! [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`time`)).

#### 21.4.1.32 Date Time String Format

ECMAScript defines a string interchange format for date-times based upon a simplification of the ISO 8601 calendar date extended format. The format is as follows: `YYYY-MM-DDTHH:mm:ss.sssZ`

Where the elements are as follows:

|  |  |
|----|----|
| `YYYY` | is the year in the proleptic Gregorian calendar as four decimal digits from 0000 to 9999, or as an [expanded year](#sec-expanded-years) of "+" or "-" followed by six decimal digits. |
| `-` | "-" (hyphen) appears literally twice in the string. |
| `MM` | is the month of the year as two decimal digits from 01 (January) to 12 (December). |
| `DD` | is the day of the month as two decimal digits from 01 to 31. |
| `T` | "T" appears literally in the string, to indicate the beginning of the time element. |
| `HH` | is the number of complete hours that have passed since midnight as two decimal digits from 00 to 24. |
| `:` | ":" (colon) appears literally twice in the string. |
| `mm` | is the number of complete minutes since the start of the hour as two decimal digits from 00 to 59. |
| `ss` | is the number of complete seconds since the start of the minute as two decimal digits from 00 to 59. |
| `.` | "." (dot) appears literally in the string. |
| `sss` | is the number of complete milliseconds since the start of the second as three decimal digits. |
| `Z` | is the UTC offset representation specified as "Z" (for UTC with no offset) or as either "+" or "-" followed by a time expression `HH:mm` (a subset of the [time zone offset string format](#sec-time-zone-offset-strings) for indicating local time ahead of or behind UTC, respectively) |

This format includes date-only forms:

    YYYY
    YYYY-MM
    YYYY-MM-DD
            

It also includes “date-time” forms that consist of one of the above date-only forms immediately followed by one of the following time forms with an optional UTC offset representation appended:

    THH:mm
    THH:mm:ss
    THH:mm:ss.sss
            

A string containing out-of-bounds or nonconforming elements is not a valid instance of this format.

Note 1

As every day both starts and ends with midnight, the two notations `00:00` and `24:00` are available to distinguish the two midnights that can be associated with one date. This means that the following two notations refer to exactly the same point in time: `1995-02-04T24:00` and `1995-02-05T00:00`. This interpretation of the latter form as "end of a calendar day" is consistent with ISO 8601, even though that specification reserves it for describing time intervals and does not permit it within representations of single points in time.

Note 2

There exists no international standard that specifies abbreviations for civil time zones like CET, EST, etc. and sometimes the same abbreviation is even used for two very different time zones. For this reason, both ISO 8601 and this format specify numeric representations of time zone offsets.

##### 21.4.1.32.1 Expanded Years

Covering the full [time value](#sec-time-values-and-time-range) range of approximately 273,790 years forward or backward from 1 January 1970 ([21.4.1.1](#sec-time-values-and-time-range)) requires representing years before 0 or after 9999. ISO 8601 permits expansion of the year representation, but only by mutual agreement of the partners in information interchange. In the simplified ECMAScript format, such an expanded year representation shall have 6 digits and is always prefixed with a + or - sign. The year 0 is considered positive and must be prefixed with a + sign. The representation of the year 0 as -000000 is invalid. Strings matching the [Date Time String Format](#sec-date-time-string-format) with expanded years representing instants in time outside the range of a [time value](#sec-time-values-and-time-range) are treated as unrecognizable by [`Date.parse`](#sec-date.parse) and cause that function to return NaN without falling back to implementation-specific behaviour or heuristics.

Note

Examples of date-time values with expanded years:

|                         |             |
|-------------------------|-------------|
| -271821-04-20T00:00:00Z | 271822 B.C. |
| -000001-01-01T00:00:00Z | 2 B.C.      |
| +000000-01-01T00:00:00Z | 1 B.C.      |
| +000001-01-01T00:00:00Z | 1 A.D.      |
| +001970-01-01T00:00:00Z | 1970 A.D.   |
| +002009-12-15T00:00:00Z | 2009 A.D.   |
| +275760-09-13T00:00:00Z | 275760 A.D. |

#### 21.4.1.33 Time Zone Offset String Format

ECMAScript defines a string interchange format for UTC offsets, derived from ISO 8601. The format is described by the following grammar.

##### Syntax

[UTCOffset](#prod-UTCOffset) ::: [ASCIISign](#prod-ASCIISign) [Hour](#prod-Hour) [ASCIISign](#prod-ASCIISign) [Hour](#prod-Hour) [HourSubcomponents](#prod-HourSubcomponents)\[+Extended\] [ASCIISign](#prod-ASCIISign) [Hour](#prod-Hour) [HourSubcomponents](#prod-HourSubcomponents)\[~Extended\] [ASCIISign](#prod-ASCIISign) ::: one of + - [Hour](#prod-Hour) ::: 0 [DecimalDigit](#prod-DecimalDigit) 1 [DecimalDigit](#prod-DecimalDigit) 20 21 22 23 [HourSubcomponents](#prod-HourSubcomponents)\[Extended\] ::: [TimeSeparator](#prod-TimeSeparator)\[?Extended\] [MinuteSecond](#prod-MinuteSecond) [TimeSeparator](#prod-TimeSeparator)\[?Extended\] [MinuteSecond](#prod-MinuteSecond) [TimeSeparator](#prod-TimeSeparator)\[?Extended\] [MinuteSecond](#prod-MinuteSecond) [TemporalDecimalFraction](#prod-TemporalDecimalFraction)opt [TimeSeparator](#prod-TimeSeparator)\[Extended\] ::: \[+Extended\] : \[~Extended\] \[empty\] [MinuteSecond](#prod-MinuteSecond) ::: 0 [DecimalDigit](#prod-DecimalDigit) 1 [DecimalDigit](#prod-DecimalDigit) 2 [DecimalDigit](#prod-DecimalDigit) 3 [DecimalDigit](#prod-DecimalDigit) 4 [DecimalDigit](#prod-DecimalDigit) 5 [DecimalDigit](#prod-DecimalDigit) [TemporalDecimalFraction](#prod-TemporalDecimalFraction) ::: [TemporalDecimalSeparator](#prod-TemporalDecimalSeparator) [DecimalDigit](#prod-DecimalDigit) [TemporalDecimalSeparator](#prod-TemporalDecimalSeparator) [DecimalDigit](#prod-DecimalDigit) [DecimalDigit](#prod-DecimalDigit) [TemporalDecimalSeparator](#prod-TemporalDecimalSeparator) [DecimalDigit](#prod-DecimalDigit) [DecimalDigit](#prod-DecimalDigit) [DecimalDigit](#prod-DecimalDigit) [TemporalDecimalSeparator](#prod-TemporalDecimalSeparator) [DecimalDigit](#prod-DecimalDigit) [DecimalDigit](#prod-DecimalDigit) [DecimalDigit](#prod-DecimalDigit) [DecimalDigit](#prod-DecimalDigit) [TemporalDecimalSeparator](#prod-TemporalDecimalSeparator) [DecimalDigit](#prod-DecimalDigit) [DecimalDigit](#prod-DecimalDigit) [DecimalDigit](#prod-DecimalDigit) [DecimalDigit](#prod-DecimalDigit) [DecimalDigit](#prod-DecimalDigit) [TemporalDecimalSeparator](#prod-TemporalDecimalSeparator) [DecimalDigit](#prod-DecimalDigit) [DecimalDigit](#prod-DecimalDigit) [DecimalDigit](#prod-DecimalDigit) [DecimalDigit](#prod-DecimalDigit) [DecimalDigit](#prod-DecimalDigit) [DecimalDigit](#prod-DecimalDigit) [TemporalDecimalSeparator](#prod-TemporalDecimalSeparator) [DecimalDigit](#prod-DecimalDigit) [DecimalDigit](#prod-DecimalDigit) [DecimalDigit](#prod-DecimalDigit) [DecimalDigit](#prod-DecimalDigit) [DecimalDigit](#prod-DecimalDigit) [DecimalDigit](#prod-DecimalDigit) [DecimalDigit](#prod-DecimalDigit) [TemporalDecimalSeparator](#prod-TemporalDecimalSeparator) [DecimalDigit](#prod-DecimalDigit) [DecimalDigit](#prod-DecimalDigit) [DecimalDigit](#prod-DecimalDigit) [DecimalDigit](#prod-DecimalDigit) [DecimalDigit](#prod-DecimalDigit) [DecimalDigit](#prod-DecimalDigit) [DecimalDigit](#prod-DecimalDigit) [DecimalDigit](#prod-DecimalDigit) [TemporalDecimalSeparator](#prod-TemporalDecimalSeparator) [DecimalDigit](#prod-DecimalDigit) [DecimalDigit](#prod-DecimalDigit) [DecimalDigit](#prod-DecimalDigit) [DecimalDigit](#prod-DecimalDigit) [DecimalDigit](#prod-DecimalDigit) [DecimalDigit](#prod-DecimalDigit) [DecimalDigit](#prod-DecimalDigit) [DecimalDigit](#prod-DecimalDigit) [DecimalDigit](#prod-DecimalDigit) [TemporalDecimalSeparator](#prod-TemporalDecimalSeparator) ::: one of . ,

##### 21.4.1.33.1 IsTimeZoneOffsetString ( `offsetString` )

The abstract operation IsTimeZoneOffsetString takes argument `offsetString` (a String) and returns a Boolean. The return value indicates whether `offsetString` conforms to the grammar given by [UTCOffset](#prod-UTCOffset). It performs the following steps when called:

1.  Let `parseResult` be [ParseText](#sec-parsetext)(`offsetString`, [UTCOffset](#prod-UTCOffset)).
2.  If `parseResult` is a [List](#sec-list-and-record-specification-type) of errors, return false.
3.  Return true.

##### 21.4.1.33.2 ParseTimeZoneOffsetString ( `offsetString` )

The abstract operation ParseTimeZoneOffsetString takes argument `offsetString` (a String) and returns an [integer](#integer). The return value is the UTC offset, as a number of nanoseconds, that corresponds to the String `offsetString`. It performs the following steps when called:

1.  Let `parseResult` be [ParseText](#sec-parsetext)(`offsetString`, [UTCOffset](#prod-UTCOffset)).
2.  [Assert](#assert): `parseResult` is not a [List](#sec-list-and-record-specification-type) of errors.
3.  [Assert](#assert): `parseResult` contains a [ASCIISign](#prod-ASCIISign) [Parse Node](#sec-syntactic-grammar).
4.  Let `parsedSign` be the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) the [ASCIISign](#prod-ASCIISign) [Parse Node](#sec-syntactic-grammar) contained within `parseResult`.
5.  If `parsedSign` is the single code point U+002D (HYPHEN-MINUS), then
    1.  Let `sign` be -1.
6.  Else,
    1.  Let `sign` be 1.
7.  NOTE: Applications of [StringToNumber](#sec-stringtonumber) below do not lose precision, since each of the parsed values is guaranteed to be a sufficiently short string of decimal digits.
8.  [Assert](#assert): `parseResult` contains an [Hour](#prod-Hour) [Parse Node](#sec-syntactic-grammar).
9.  Let `parsedHours` be the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) the [Hour](#prod-Hour) [Parse Node](#sec-syntactic-grammar) contained within `parseResult`.
10. Let `hours` be [ℝ](#ℝ)([StringToNumber](#sec-stringtonumber)([CodePointsToString](#sec-codepointstostring)(`parsedHours`))).
11. If `parseResult` does not contain a [MinuteSecond](#prod-MinuteSecond) [Parse Node](#sec-syntactic-grammar), then
    1.  Let `minutes` be 0.
12. Else,
    1.  Let `parsedMinutes` be the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) the first [MinuteSecond](#prod-MinuteSecond) [Parse Node](#sec-syntactic-grammar) contained within `parseResult`.
    2.  Let `minutes` be [ℝ](#ℝ)([StringToNumber](#sec-stringtonumber)([CodePointsToString](#sec-codepointstostring)(`parsedMinutes`))).
13. If `parseResult` does not contain two [MinuteSecond](#prod-MinuteSecond) [Parse Nodes](#sec-syntactic-grammar), then
    1.  Let `seconds` be 0.
14. Else,
    1.  Let `parsedSeconds` be the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) the second [MinuteSecond](#prod-MinuteSecond) [Parse Node](#sec-syntactic-grammar) contained within `parseResult`.
    2.  Let `seconds` be [ℝ](#ℝ)([StringToNumber](#sec-stringtonumber)([CodePointsToString](#sec-codepointstostring)(`parsedSeconds`))).
15. If `parseResult` does not contain a [TemporalDecimalFraction](#prod-TemporalDecimalFraction) [Parse Node](#sec-syntactic-grammar), then
    1.  Let `nanoseconds` be 0.
16. Else,
    1.  Let `parsedFraction` be the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) the [TemporalDecimalFraction](#prod-TemporalDecimalFraction) [Parse Node](#sec-syntactic-grammar) contained within `parseResult`.
    2.  Let `fraction` be the [string-concatenation](#string-concatenation) of [CodePointsToString](#sec-codepointstostring)(`parsedFraction`) and "000000000".
    3.  Let `nanosecondsString` be the [substring](#substring) of `fraction` from 1 to 10.
    4.  Let `nanoseconds` be [ℝ](#ℝ)([StringToNumber](#sec-stringtonumber)(`nanosecondsString`)).
17. Return `sign` × (((`hours` × 60 + `minutes`) × 60 + `seconds`) × 10\*\*⁹ + `nanoseconds`).

### 21.4.2 The Date Constructor

The Date [constructor](#constructor):

- is %Date%.
- is the initial value of the "Date" property of the [global object](#sec-global-object).
- creates and initializes a new Date when called as a [constructor](#constructor).
- returns a String representing the current time (UTC) when called as a function rather than as a [constructor](#constructor).
- is a function whose behaviour differs based upon the number and types of its arguments.
- may be used as the value of an `extends` clause of a class definition. Subclass [constructors](#constructor) that intend to inherit the specified Date behaviour must include a `super` call to the Date [constructor](#constructor) to create and initialize the subclass instance with a `[[DateValue]]` internal slot.

#### 21.4.2.1 Date ( ...`values` )

This function performs the following steps when called:

1.  If NewTarget is undefined, then
    1.  Let `now` be the [time value](#sec-time-values-and-time-range) (UTC) identifying the current time.
    2.  Return [ToDateString](#sec-todatestring)(`now`).
2.  Let `numberOfArgs` be the number of elements in `values`.
3.  If `numberOfArgs` = 0, then
    1.  Let `dv` be the [time value](#sec-time-values-and-time-range) (UTC) identifying the current time.
4.  Else if `numberOfArgs` = 1, then
    1.  Let `value` be `values`\[0\].
    2.  If `value` [is an Object](#sec-object-type) and `value` has a `[[DateValue]]` internal slot, then
        1.  Let `tv` be `value`.`[[DateValue]]`.
    3.  Else,
        1.  Let `v` be ? [ToPrimitive](#sec-toprimitive)(`value`).
        2.  If `v` [is a String](#sec-ecmascript-language-types-string-type), then
            1.  [Assert](#assert): The next step never returns an [abrupt completion](#sec-completion-record-specification-type) because `v` [is a String](#sec-ecmascript-language-types-string-type).
            2.  Let `tv` be the result of parsing `v` as a date, in exactly the same manner as for the `parse` method ([21.4.3.2](#sec-date.parse)).
        3.  Else,
            1.  Let `tv` be ? [ToNumber](#sec-tonumber)(`v`).
    4.  Let `dv` be [TimeClip](#sec-timeclip)(`tv`).
5.  Else,
    1.  [Assert](#assert): `numberOfArgs` ≥ 2.
    2.  Let `y` be ? [ToNumber](#sec-tonumber)(`values`\[0\]).
    3.  Let `m` be ? [ToNumber](#sec-tonumber)(`values`\[1\]).
    4.  If `numberOfArgs` \> 2, let `dt` be ? [ToNumber](#sec-tonumber)(`values`\[2\]); else let `dt` be 1_(𝔽).
    5.  If `numberOfArgs` \> 3, let `h` be ? [ToNumber](#sec-tonumber)(`values`\[3\]); else let `h` be +0_(𝔽).
    6.  If `numberOfArgs` \> 4, let `min` be ? [ToNumber](#sec-tonumber)(`values`\[4\]); else let `min` be +0_(𝔽).
    7.  If `numberOfArgs` \> 5, let `s` be ? [ToNumber](#sec-tonumber)(`values`\[5\]); else let `s` be +0_(𝔽).
    8.  If `numberOfArgs` \> 6, let `milli` be ? [ToNumber](#sec-tonumber)(`values`\[6\]); else let `milli` be +0_(𝔽).
    9.  Let `yr` be [MakeFullYear](#sec-makefullyear)(`y`).
    10. Let `finalDate` be [MakeDate](#sec-makedate)([MakeDay](#sec-makeday)(`yr`, `m`, `dt`), [MakeTime](#sec-maketime)(`h`, `min`, `s`, `milli`)).
    11. Let `dv` be [TimeClip](#sec-timeclip)([UTC](#sec-utc-t)(`finalDate`)).
6.  Let `O` be ? [OrdinaryCreateFromConstructor](#sec-ordinarycreatefromconstructor)(NewTarget, "%Date.prototype%", « `[[DateValue]]` »).
7.  Set `O`.`[[DateValue]]` to `dv`.
8.  Return `O`.

### 21.4.3 Properties of the Date Constructor

The Date [constructor](#constructor):

- has a `[[Prototype]]` internal slot whose value is [%Function.prototype%](#sec-properties-of-the-function-prototype-object).
- has a "length" property whose value is 7_(𝔽).
- has the following properties:

#### 21.4.3.1 Date.now ( )

This function returns the [time value](#sec-time-values-and-time-range) designating the UTC date and time of the occurrence of the call to it.

#### 21.4.3.2 Date.parse ( `string` )

This function applies the [ToString](#sec-tostring) operator to its argument. If [ToString](#sec-tostring) results in an [abrupt completion](#sec-completion-record-specification-type) the [Completion Record](#sec-completion-record-specification-type) is immediately returned. Otherwise, this function interprets the resulting String as a date and time; it returns a Number, the UTC [time value](#sec-time-values-and-time-range) corresponding to the date and time. The String may be interpreted as a local time, a UTC time, or a time in some other time zone, depending on the contents of the String. The function first attempts to parse the String according to the format described in Date Time String Format ([21.4.1.32](#sec-date-time-string-format)), including expanded years. If the String does not conform to that format the function may fall back to any implementation-specific heuristics or implementation-specific date formats. Strings that are unrecognizable or contain out-of-bounds format element values shall cause this function to return NaN.

If the String conforms to the [Date Time String Format](#sec-date-time-string-format), substitute values take the place of absent format elements. When the `MM` or `DD` elements are absent, "01" is used. When the `HH`, `mm`, or `ss` elements are absent, "00" is used. When the `sss` element is absent, "000" is used. When the UTC offset representation is absent, date-only forms are interpreted as a UTC time and date-time forms are interpreted as a local time.

If `x` is any Date whose milliseconds amount is zero within a particular implementation of ECMAScript, then all of the following expressions should produce the same numeric value in that implementation, if all the properties referenced have their initial values:

``` javascript
x.valueOf()
Date.parse(x.toString())
Date.parse(x.toUTCString())
Date.parse(x.toISOString())
```

However, the expression

``` javascript
Date.parse(x.toLocaleString())
```

is not required to produce the same Number value as the preceding three expressions and, in general, the value produced by this function is [implementation-defined](#implementation-defined) when given any String value that does not conform to the Date Time String Format ([21.4.1.32](#sec-date-time-string-format)) and that could not be produced in that implementation by the `toString` or `toUTCString` method.

#### 21.4.3.3 Date.prototype

The initial value of `Date.prototype` is the [Date prototype object](#sec-properties-of-the-date-prototype-object).

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

#### 21.4.3.4 Date.UTC ( `year` \[ , `month` \[ , `date` \[ , `hours` \[ , `minutes` \[ , `seconds` \[ , `ms` \] \] \] \] \] \] )

This function performs the following steps when called:

1.  Let `y` be ? [ToNumber](#sec-tonumber)(`year`).
2.  If `month` is present, let `m` be ? [ToNumber](#sec-tonumber)(`month`); else let `m` be +0_(𝔽).
3.  If `date` is present, let `dt` be ? [ToNumber](#sec-tonumber)(`date`); else let `dt` be 1_(𝔽).
4.  If `hours` is present, let `h` be ? [ToNumber](#sec-tonumber)(`hours`); else let `h` be +0_(𝔽).
5.  If `minutes` is present, let `min` be ? [ToNumber](#sec-tonumber)(`minutes`); else let `min` be +0_(𝔽).
6.  If `seconds` is present, let `s` be ? [ToNumber](#sec-tonumber)(`seconds`); else let `s` be +0_(𝔽).
7.  If `ms` is present, let `milli` be ? [ToNumber](#sec-tonumber)(`ms`); else let `milli` be +0_(𝔽).
8.  Let `yr` be [MakeFullYear](#sec-makefullyear)(`y`).
9.  Return [TimeClip](#sec-timeclip)([MakeDate](#sec-makedate)([MakeDay](#sec-makeday)(`yr`, `m`, `dt`), [MakeTime](#sec-maketime)(`h`, `min`, `s`, `milli`))).

The "length" property of this function is 7_(𝔽).

Note

This function differs from the Date [constructor](#constructor) in two ways: it returns a [time value](#sec-time-values-and-time-range) as a Number, rather than creating a Date, and it interprets the arguments in UTC rather than as local time.

### 21.4.4 Properties of the Date Prototype Object

The Date prototype object:

- is %Date.prototype%.
- is itself an [ordinary object](#ordinary-object).
- is not a Date instance and does not have a `[[DateValue]]` internal slot.
- has a `[[Prototype]]` internal slot whose value is [%Object.prototype%](#sec-properties-of-the-object-prototype-object).

Unless explicitly defined otherwise, the methods of the Date prototype object defined below are not generic and the this value passed to them must be an object that has a `[[DateValue]]` internal slot that has been initialized to a [time value](#sec-time-values-and-time-range).

#### 21.4.4.1 Date.prototype.constructor

The initial value of `Date.prototype.constructor` is [%Date%](#sec-date-constructor).

#### 21.4.4.2 Date.prototype.getDate ( )

This method performs the following steps when called:

1.  Let `dateObject` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`dateObject`, `[[DateValue]]`).
3.  Let `t` be `dateObject`.`[[DateValue]]`.
4.  If `t` is NaN, return NaN.
5.  Return [DateFromTime](#sec-datefromtime)([LocalTime](#sec-localtime)(`t`)).

#### 21.4.4.3 Date.prototype.getDay ( )

This method performs the following steps when called:

1.  Let `dateObject` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`dateObject`, `[[DateValue]]`).
3.  Let `t` be `dateObject`.`[[DateValue]]`.
4.  If `t` is NaN, return NaN.
5.  Return [WeekDay](#sec-weekday)([LocalTime](#sec-localtime)(`t`)).

#### 21.4.4.4 Date.prototype.getFullYear ( )

This method performs the following steps when called:

1.  Let `dateObject` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`dateObject`, `[[DateValue]]`).
3.  Let `t` be `dateObject`.`[[DateValue]]`.
4.  If `t` is NaN, return NaN.
5.  Return [YearFromTime](#sec-yearfromtime)([LocalTime](#sec-localtime)(`t`)).

#### 21.4.4.5 Date.prototype.getHours ( )

This method performs the following steps when called:

1.  Let `dateObject` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`dateObject`, `[[DateValue]]`).
3.  Let `t` be `dateObject`.`[[DateValue]]`.
4.  If `t` is NaN, return NaN.
5.  Return [HourFromTime](#sec-hourfromtime)([LocalTime](#sec-localtime)(`t`)).

#### 21.4.4.6 Date.prototype.getMilliseconds ( )

This method performs the following steps when called:

1.  Let `dateObject` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`dateObject`, `[[DateValue]]`).
3.  Let `t` be `dateObject`.`[[DateValue]]`.
4.  If `t` is NaN, return NaN.
5.  Return [msFromTime](#sec-msfromtime)([LocalTime](#sec-localtime)(`t`)).

#### 21.4.4.7 Date.prototype.getMinutes ( )

This method performs the following steps when called:

1.  Let `dateObject` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`dateObject`, `[[DateValue]]`).
3.  Let `t` be `dateObject`.`[[DateValue]]`.
4.  If `t` is NaN, return NaN.
5.  Return [MinFromTime](#sec-minfromtime)([LocalTime](#sec-localtime)(`t`)).

#### 21.4.4.8 Date.prototype.getMonth ( )

This method performs the following steps when called:

1.  Let `dateObject` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`dateObject`, `[[DateValue]]`).
3.  Let `t` be `dateObject`.`[[DateValue]]`.
4.  If `t` is NaN, return NaN.
5.  Return [MonthFromTime](#sec-monthfromtime)([LocalTime](#sec-localtime)(`t`)).

#### 21.4.4.9 Date.prototype.getSeconds ( )

This method performs the following steps when called:

1.  Let `dateObject` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`dateObject`, `[[DateValue]]`).
3.  Let `t` be `dateObject`.`[[DateValue]]`.
4.  If `t` is NaN, return NaN.
5.  Return [SecFromTime](#sec-secfromtime)([LocalTime](#sec-localtime)(`t`)).

#### 21.4.4.10 Date.prototype.getTime ( )

This method performs the following steps when called:

1.  Let `dateObject` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`dateObject`, `[[DateValue]]`).
3.  Return `dateObject`.`[[DateValue]]`.

#### 21.4.4.11 Date.prototype.getTimezoneOffset ( )

This method performs the following steps when called:

1.  Let `dateObject` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`dateObject`, `[[DateValue]]`).
3.  Let `t` be `dateObject`.`[[DateValue]]`.
4.  If `t` is NaN, return NaN.
5.  Return (`t` - [LocalTime](#sec-localtime)(`t`)) / [msPerMinute](#eqn-msPerMinute).

#### 21.4.4.12 Date.prototype.getUTCDate ( )

This method performs the following steps when called:

1.  Let `dateObject` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`dateObject`, `[[DateValue]]`).
3.  Let `t` be `dateObject`.`[[DateValue]]`.
4.  If `t` is NaN, return NaN.
5.  Return [DateFromTime](#sec-datefromtime)(`t`).

#### 21.4.4.13 Date.prototype.getUTCDay ( )

This method performs the following steps when called:

1.  Let `dateObject` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`dateObject`, `[[DateValue]]`).
3.  Let `t` be `dateObject`.`[[DateValue]]`.
4.  If `t` is NaN, return NaN.
5.  Return [WeekDay](#sec-weekday)(`t`).

#### 21.4.4.14 Date.prototype.getUTCFullYear ( )

This method performs the following steps when called:

1.  Let `dateObject` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`dateObject`, `[[DateValue]]`).
3.  Let `t` be `dateObject`.`[[DateValue]]`.
4.  If `t` is NaN, return NaN.
5.  Return [YearFromTime](#sec-yearfromtime)(`t`).

#### 21.4.4.15 Date.prototype.getUTCHours ( )

This method performs the following steps when called:

1.  Let `dateObject` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`dateObject`, `[[DateValue]]`).
3.  Let `t` be `dateObject`.`[[DateValue]]`.
4.  If `t` is NaN, return NaN.
5.  Return [HourFromTime](#sec-hourfromtime)(`t`).

#### 21.4.4.16 Date.prototype.getUTCMilliseconds ( )

This method performs the following steps when called:

1.  Let `dateObject` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`dateObject`, `[[DateValue]]`).
3.  Let `t` be `dateObject`.`[[DateValue]]`.
4.  If `t` is NaN, return NaN.
5.  Return [msFromTime](#sec-msfromtime)(`t`).

#### 21.4.4.17 Date.prototype.getUTCMinutes ( )

This method performs the following steps when called:

1.  Let `dateObject` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`dateObject`, `[[DateValue]]`).
3.  Let `t` be `dateObject`.`[[DateValue]]`.
4.  If `t` is NaN, return NaN.
5.  Return [MinFromTime](#sec-minfromtime)(`t`).

#### 21.4.4.18 Date.prototype.getUTCMonth ( )

This method performs the following steps when called:

1.  Let `dateObject` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`dateObject`, `[[DateValue]]`).
3.  Let `t` be `dateObject`.`[[DateValue]]`.
4.  If `t` is NaN, return NaN.
5.  Return [MonthFromTime](#sec-monthfromtime)(`t`).

#### 21.4.4.19 Date.prototype.getUTCSeconds ( )

This method performs the following steps when called:

1.  Let `dateObject` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`dateObject`, `[[DateValue]]`).
3.  Let `t` be `dateObject`.`[[DateValue]]`.
4.  If `t` is NaN, return NaN.
5.  Return [SecFromTime](#sec-secfromtime)(`t`).

#### 21.4.4.20 Date.prototype.setDate ( `date` )

This method performs the following steps when called:

1.  Let `dateObject` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`dateObject`, `[[DateValue]]`).
3.  Let `t` be `dateObject`.`[[DateValue]]`.
4.  Let `dt` be ? [ToNumber](#sec-tonumber)(`date`).
5.  If `t` is NaN, return NaN.
6.  Set `t` to [LocalTime](#sec-localtime)(`t`).
7.  Let `newDate` be [MakeDate](#sec-makedate)([MakeDay](#sec-makeday)([YearFromTime](#sec-yearfromtime)(`t`), [MonthFromTime](#sec-monthfromtime)(`t`), `dt`), [TimeWithinDay](#sec-timewithinday)(`t`)).
8.  Let `u` be [TimeClip](#sec-timeclip)([UTC](#sec-utc-t)(`newDate`)).
9.  Set `dateObject`.`[[DateValue]]` to `u`.
10. Return `u`.

#### 21.4.4.21 Date.prototype.setFullYear ( `year` \[ , `month` \[ , `date` \] \] )

This method performs the following steps when called:

1.  Let `dateObject` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`dateObject`, `[[DateValue]]`).
3.  Let `t` be `dateObject`.`[[DateValue]]`.
4.  Let `y` be ? [ToNumber](#sec-tonumber)(`year`).
5.  If `t` is NaN, set `t` to +0_(𝔽); otherwise, set `t` to [LocalTime](#sec-localtime)(`t`).
6.  If `month` is not present, let `m` be [MonthFromTime](#sec-monthfromtime)(`t`); otherwise, let `m` be ? [ToNumber](#sec-tonumber)(`month`).
7.  If `date` is not present, let `dt` be [DateFromTime](#sec-datefromtime)(`t`); otherwise, let `dt` be ? [ToNumber](#sec-tonumber)(`date`).
8.  Let `newDate` be [MakeDate](#sec-makedate)([MakeDay](#sec-makeday)(`y`, `m`, `dt`), [TimeWithinDay](#sec-timewithinday)(`t`)).
9.  Let `u` be [TimeClip](#sec-timeclip)([UTC](#sec-utc-t)(`newDate`)).
10. Set `dateObject`.`[[DateValue]]` to `u`.
11. Return `u`.

The "length" property of this method is 3_(𝔽).

Note

If `month` is not present, this method behaves as if `month` was present with the value `getMonth()`. If `date` is not present, it behaves as if `date` was present with the value `getDate()`.

#### 21.4.4.22 Date.prototype.setHours ( `hour` \[ , `min` \[ , `sec` \[ , `ms` \] \] \] )

This method performs the following steps when called:

1.  Let `dateObject` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`dateObject`, `[[DateValue]]`).
3.  Let `t` be `dateObject`.`[[DateValue]]`.
4.  Let `h` be ? [ToNumber](#sec-tonumber)(`hour`).
5.  If `min` is present, let `m` be ? [ToNumber](#sec-tonumber)(`min`).
6.  If `sec` is present, let `s` be ? [ToNumber](#sec-tonumber)(`sec`).
7.  If `ms` is present, let `milli` be ? [ToNumber](#sec-tonumber)(`ms`).
8.  If `t` is NaN, return NaN.
9.  Set `t` to [LocalTime](#sec-localtime)(`t`).
10. If `min` is not present, let `m` be [MinFromTime](#sec-minfromtime)(`t`).
11. If `sec` is not present, let `s` be [SecFromTime](#sec-secfromtime)(`t`).
12. If `ms` is not present, let `milli` be [msFromTime](#sec-msfromtime)(`t`).
13. Let `date` be [MakeDate](#sec-makedate)([Day](#sec-day)(`t`), [MakeTime](#sec-maketime)(`h`, `m`, `s`, `milli`)).
14. Let `u` be [TimeClip](#sec-timeclip)([UTC](#sec-utc-t)(`date`)).
15. Set `dateObject`.`[[DateValue]]` to `u`.
16. Return `u`.

The "length" property of this method is 4_(𝔽).

Note

If `min` is not present, this method behaves as if `min` was present with the value `getMinutes()`. If `sec` is not present, it behaves as if `sec` was present with the value `getSeconds()`. If `ms` is not present, it behaves as if `ms` was present with the value `getMilliseconds()`.

#### 21.4.4.23 Date.prototype.setMilliseconds ( `ms` )

This method performs the following steps when called:

1.  Let `dateObject` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`dateObject`, `[[DateValue]]`).
3.  Let `t` be `dateObject`.`[[DateValue]]`.
4.  Set `ms` to ? [ToNumber](#sec-tonumber)(`ms`).
5.  If `t` is NaN, return NaN.
6.  Set `t` to [LocalTime](#sec-localtime)(`t`).
7.  Let `time` be [MakeTime](#sec-maketime)([HourFromTime](#sec-hourfromtime)(`t`), [MinFromTime](#sec-minfromtime)(`t`), [SecFromTime](#sec-secfromtime)(`t`), `ms`).
8.  Let `u` be [TimeClip](#sec-timeclip)([UTC](#sec-utc-t)([MakeDate](#sec-makedate)([Day](#sec-day)(`t`), `time`))).
9.  Set `dateObject`.`[[DateValue]]` to `u`.
10. Return `u`.

#### 21.4.4.24 Date.prototype.setMinutes ( `min` \[ , `sec` \[ , `ms` \] \] )

This method performs the following steps when called:

1.  Let `dateObject` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`dateObject`, `[[DateValue]]`).
3.  Let `t` be `dateObject`.`[[DateValue]]`.
4.  Let `m` be ? [ToNumber](#sec-tonumber)(`min`).
5.  If `sec` is present, let `s` be ? [ToNumber](#sec-tonumber)(`sec`).
6.  If `ms` is present, let `milli` be ? [ToNumber](#sec-tonumber)(`ms`).
7.  If `t` is NaN, return NaN.
8.  Set `t` to [LocalTime](#sec-localtime)(`t`).
9.  If `sec` is not present, let `s` be [SecFromTime](#sec-secfromtime)(`t`).
10. If `ms` is not present, let `milli` be [msFromTime](#sec-msfromtime)(`t`).
11. Let `date` be [MakeDate](#sec-makedate)([Day](#sec-day)(`t`), [MakeTime](#sec-maketime)([HourFromTime](#sec-hourfromtime)(`t`), `m`, `s`, `milli`)).
12. Let `u` be [TimeClip](#sec-timeclip)([UTC](#sec-utc-t)(`date`)).
13. Set `dateObject`.`[[DateValue]]` to `u`.
14. Return `u`.

The "length" property of this method is 3_(𝔽).

Note

If `sec` is not present, this method behaves as if `sec` was present with the value `getSeconds()`. If `ms` is not present, this behaves as if `ms` was present with the value `getMilliseconds()`.

#### 21.4.4.25 Date.prototype.setMonth ( `month` \[ , `date` \] )

This method performs the following steps when called:

1.  Let `dateObject` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`dateObject`, `[[DateValue]]`).
3.  Let `t` be `dateObject`.`[[DateValue]]`.
4.  Let `m` be ? [ToNumber](#sec-tonumber)(`month`).
5.  If `date` is present, let `dt` be ? [ToNumber](#sec-tonumber)(`date`).
6.  If `t` is NaN, return NaN.
7.  Set `t` to [LocalTime](#sec-localtime)(`t`).
8.  If `date` is not present, let `dt` be [DateFromTime](#sec-datefromtime)(`t`).
9.  Let `newDate` be [MakeDate](#sec-makedate)([MakeDay](#sec-makeday)([YearFromTime](#sec-yearfromtime)(`t`), `m`, `dt`), [TimeWithinDay](#sec-timewithinday)(`t`)).
10. Let `u` be [TimeClip](#sec-timeclip)([UTC](#sec-utc-t)(`newDate`)).
11. Set `dateObject`.`[[DateValue]]` to `u`.
12. Return `u`.

The "length" property of this method is 2_(𝔽).

Note

If `date` is not present, this method behaves as if `date` was present with the value `getDate()`.

#### 21.4.4.26 Date.prototype.setSeconds ( `sec` \[ , `ms` \] )

This method performs the following steps when called:

1.  Let `dateObject` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`dateObject`, `[[DateValue]]`).
3.  Let `t` be `dateObject`.`[[DateValue]]`.
4.  Let `s` be ? [ToNumber](#sec-tonumber)(`sec`).
5.  If `ms` is present, let `milli` be ? [ToNumber](#sec-tonumber)(`ms`).
6.  If `t` is NaN, return NaN.
7.  Set `t` to [LocalTime](#sec-localtime)(`t`).
8.  If `ms` is not present, let `milli` be [msFromTime](#sec-msfromtime)(`t`).
9.  Let `date` be [MakeDate](#sec-makedate)([Day](#sec-day)(`t`), [MakeTime](#sec-maketime)([HourFromTime](#sec-hourfromtime)(`t`), [MinFromTime](#sec-minfromtime)(`t`), `s`, `milli`)).
10. Let `u` be [TimeClip](#sec-timeclip)([UTC](#sec-utc-t)(`date`)).
11. Set `dateObject`.`[[DateValue]]` to `u`.
12. Return `u`.

The "length" property of this method is 2_(𝔽).

Note

If `ms` is not present, this method behaves as if `ms` was present with the value `getMilliseconds()`.

#### 21.4.4.27 Date.prototype.setTime ( `time` )

This method performs the following steps when called:

1.  Let `dateObject` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`dateObject`, `[[DateValue]]`).
3.  Let `t` be ? [ToNumber](#sec-tonumber)(`time`).
4.  Let `v` be [TimeClip](#sec-timeclip)(`t`).
5.  Set `dateObject`.`[[DateValue]]` to `v`.
6.  Return `v`.

#### 21.4.4.28 Date.prototype.setUTCDate ( `date` )

This method performs the following steps when called:

1.  Let `dateObject` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`dateObject`, `[[DateValue]]`).
3.  Let `t` be `dateObject`.`[[DateValue]]`.
4.  Let `dt` be ? [ToNumber](#sec-tonumber)(`date`).
5.  If `t` is NaN, return NaN.
6.  Let `newDate` be [MakeDate](#sec-makedate)([MakeDay](#sec-makeday)([YearFromTime](#sec-yearfromtime)(`t`), [MonthFromTime](#sec-monthfromtime)(`t`), `dt`), [TimeWithinDay](#sec-timewithinday)(`t`)).
7.  Let `v` be [TimeClip](#sec-timeclip)(`newDate`).
8.  Set `dateObject`.`[[DateValue]]` to `v`.
9.  Return `v`.

#### 21.4.4.29 Date.prototype.setUTCFullYear ( `year` \[ , `month` \[ , `date` \] \] )

This method performs the following steps when called:

1.  Let `dateObject` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`dateObject`, `[[DateValue]]`).
3.  Let `t` be `dateObject`.`[[DateValue]]`.
4.  If `t` is NaN, set `t` to +0_(𝔽).
5.  Let `y` be ? [ToNumber](#sec-tonumber)(`year`).
6.  If `month` is not present, let `m` be [MonthFromTime](#sec-monthfromtime)(`t`); otherwise, let `m` be ? [ToNumber](#sec-tonumber)(`month`).
7.  If `date` is not present, let `dt` be [DateFromTime](#sec-datefromtime)(`t`); otherwise, let `dt` be ? [ToNumber](#sec-tonumber)(`date`).
8.  Let `newDate` be [MakeDate](#sec-makedate)([MakeDay](#sec-makeday)(`y`, `m`, `dt`), [TimeWithinDay](#sec-timewithinday)(`t`)).
9.  Let `v` be [TimeClip](#sec-timeclip)(`newDate`).
10. Set `dateObject`.`[[DateValue]]` to `v`.
11. Return `v`.

The "length" property of this method is 3_(𝔽).

Note

If `month` is not present, this method behaves as if `month` was present with the value `getUTCMonth()`. If `date` is not present, it behaves as if `date` was present with the value `getUTCDate()`.

#### 21.4.4.30 Date.prototype.setUTCHours ( `hour` \[ , `min` \[ , `sec` \[ , `ms` \] \] \] )

This method performs the following steps when called:

1.  Let `dateObject` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`dateObject`, `[[DateValue]]`).
3.  Let `t` be `dateObject`.`[[DateValue]]`.
4.  Let `h` be ? [ToNumber](#sec-tonumber)(`hour`).
5.  If `min` is present, let `m` be ? [ToNumber](#sec-tonumber)(`min`).
6.  If `sec` is present, let `s` be ? [ToNumber](#sec-tonumber)(`sec`).
7.  If `ms` is present, let `milli` be ? [ToNumber](#sec-tonumber)(`ms`).
8.  If `t` is NaN, return NaN.
9.  If `min` is not present, let `m` be [MinFromTime](#sec-minfromtime)(`t`).
10. If `sec` is not present, let `s` be [SecFromTime](#sec-secfromtime)(`t`).
11. If `ms` is not present, let `milli` be [msFromTime](#sec-msfromtime)(`t`).
12. Let `date` be [MakeDate](#sec-makedate)([Day](#sec-day)(`t`), [MakeTime](#sec-maketime)(`h`, `m`, `s`, `milli`)).
13. Let `v` be [TimeClip](#sec-timeclip)(`date`).
14. Set `dateObject`.`[[DateValue]]` to `v`.
15. Return `v`.

The "length" property of this method is 4_(𝔽).

Note

If `min` is not present, this method behaves as if `min` was present with the value `getUTCMinutes()`. If `sec` is not present, it behaves as if `sec` was present with the value `getUTCSeconds()`. If `ms` is not present, it behaves as if `ms` was present with the value `getUTCMilliseconds()`.

#### 21.4.4.31 Date.prototype.setUTCMilliseconds ( `ms` )

This method performs the following steps when called:

1.  Let `dateObject` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`dateObject`, `[[DateValue]]`).
3.  Let `t` be `dateObject`.`[[DateValue]]`.
4.  Set `ms` to ? [ToNumber](#sec-tonumber)(`ms`).
5.  If `t` is NaN, return NaN.
6.  Let `time` be [MakeTime](#sec-maketime)([HourFromTime](#sec-hourfromtime)(`t`), [MinFromTime](#sec-minfromtime)(`t`), [SecFromTime](#sec-secfromtime)(`t`), `ms`).
7.  Let `v` be [TimeClip](#sec-timeclip)([MakeDate](#sec-makedate)([Day](#sec-day)(`t`), `time`)).
8.  Set `dateObject`.`[[DateValue]]` to `v`.
9.  Return `v`.

#### 21.4.4.32 Date.prototype.setUTCMinutes ( `min` \[ , `sec` \[ , `ms` \] \] )

This method performs the following steps when called:

1.  Let `dateObject` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`dateObject`, `[[DateValue]]`).
3.  Let `t` be `dateObject`.`[[DateValue]]`.
4.  Let `m` be ? [ToNumber](#sec-tonumber)(`min`).
5.  If `sec` is present, let `s` be ? [ToNumber](#sec-tonumber)(`sec`).
6.  If `ms` is present, let `milli` be ? [ToNumber](#sec-tonumber)(`ms`).
7.  If `t` is NaN, return NaN.
8.  If `sec` is not present, let `s` be [SecFromTime](#sec-secfromtime)(`t`).
9.  If `ms` is not present, let `milli` be [msFromTime](#sec-msfromtime)(`t`).
10. Let `date` be [MakeDate](#sec-makedate)([Day](#sec-day)(`t`), [MakeTime](#sec-maketime)([HourFromTime](#sec-hourfromtime)(`t`), `m`, `s`, `milli`)).
11. Let `v` be [TimeClip](#sec-timeclip)(`date`).
12. Set `dateObject`.`[[DateValue]]` to `v`.
13. Return `v`.

The "length" property of this method is 3_(𝔽).

Note

If `sec` is not present, this method behaves as if `sec` was present with the value `getUTCSeconds()`. If `ms` is not present, it behaves as if `ms` was present with the value return by `getUTCMilliseconds()`.

#### 21.4.4.33 Date.prototype.setUTCMonth ( `month` \[ , `date` \] )

This method performs the following steps when called:

1.  Let `dateObject` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`dateObject`, `[[DateValue]]`).
3.  Let `t` be `dateObject`.`[[DateValue]]`.
4.  Let `m` be ? [ToNumber](#sec-tonumber)(`month`).
5.  If `date` is present, let `dt` be ? [ToNumber](#sec-tonumber)(`date`).
6.  If `t` is NaN, return NaN.
7.  If `date` is not present, let `dt` be [DateFromTime](#sec-datefromtime)(`t`).
8.  Let `newDate` be [MakeDate](#sec-makedate)([MakeDay](#sec-makeday)([YearFromTime](#sec-yearfromtime)(`t`), `m`, `dt`), [TimeWithinDay](#sec-timewithinday)(`t`)).
9.  Let `v` be [TimeClip](#sec-timeclip)(`newDate`).
10. Set `dateObject`.`[[DateValue]]` to `v`.
11. Return `v`.

The "length" property of this method is 2_(𝔽).

Note

If `date` is not present, this method behaves as if `date` was present with the value `getUTCDate()`.

#### 21.4.4.34 Date.prototype.setUTCSeconds ( `sec` \[ , `ms` \] )

This method performs the following steps when called:

1.  Let `dateObject` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`dateObject`, `[[DateValue]]`).
3.  Let `t` be `dateObject`.`[[DateValue]]`.
4.  Let `s` be ? [ToNumber](#sec-tonumber)(`sec`).
5.  If `ms` is present, let `milli` be ? [ToNumber](#sec-tonumber)(`ms`).
6.  If `t` is NaN, return NaN.
7.  If `ms` is not present, let `milli` be [msFromTime](#sec-msfromtime)(`t`).
8.  Let `date` be [MakeDate](#sec-makedate)([Day](#sec-day)(`t`), [MakeTime](#sec-maketime)([HourFromTime](#sec-hourfromtime)(`t`), [MinFromTime](#sec-minfromtime)(`t`), `s`, `milli`)).
9.  Let `v` be [TimeClip](#sec-timeclip)(`date`).
10. Set `dateObject`.`[[DateValue]]` to `v`.
11. Return `v`.

The "length" property of this method is 2_(𝔽).

Note

If `ms` is not present, this method behaves as if `ms` was present with the value `getUTCMilliseconds()`.

#### 21.4.4.35 Date.prototype.toDateString ( )

This method performs the following steps when called:

1.  Let `dateObject` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`dateObject`, `[[DateValue]]`).
3.  Let `tv` be `dateObject`.`[[DateValue]]`.
4.  If `tv` is NaN, return "Invalid Date".
5.  Let `t` be [LocalTime](#sec-localtime)(`tv`).
6.  Return [DateString](#sec-datestring)(`t`).

#### 21.4.4.36 Date.prototype.toISOString ( )

This method performs the following steps when called:

1.  Let `dateObject` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`dateObject`, `[[DateValue]]`).
3.  Let `tv` be `dateObject`.`[[DateValue]]`.
4.  If `tv` is NaN, throw a RangeError exception.
5.  [Assert](#assert): `tv` is an [integral Number](#integral-number).
6.  If `tv` corresponds with a year that cannot be represented in the [Date Time String Format](#sec-date-time-string-format), throw a RangeError exception.
7.  Return a String representation of `tv` in the [Date Time String Format](#sec-date-time-string-format) on the UTC time scale, including all format elements and the UTC offset representation "Z".

#### 21.4.4.37 Date.prototype.toJSON ( `key` )

This method provides a String representation of a Date for use by `JSON.stringify` ([25.5.2](#sec-json.stringify)).

It performs the following steps when called:

1.  Let `O` be ? [ToObject](#sec-toobject)(this value).
2.  Let `tv` be ? [ToPrimitive](#sec-toprimitive)(`O`, number).
3.  If `tv` [is a Number](#sec-ecmascript-language-types-number-type) and `tv` is not [finite](#finite), return null.
4.  Return ? [Invoke](#sec-invoke)(`O`, "toISOString").

Note 1

The argument is ignored.

Note 2

This method is intentionally generic; it does not require that its this value be a Date. Therefore, it can be transferred to other kinds of objects for use as a method. However, it does require that any such object have a `toISOString` method.

#### 21.4.4.38 Date.prototype.toLocaleDateString ( \[ `reserved1` \[ , `reserved2` \] \] )

An ECMAScript implementation that includes the ECMA-402 Internationalization API must implement this method as specified in the ECMA-402 specification. If an ECMAScript implementation does not include the ECMA-402 API the following specification of this method is used:

This method returns a String value. The contents of the String are [implementation-defined](#implementation-defined), but are intended to represent the “date” portion of the Date in the current time zone in a convenient, human-readable form that corresponds to the conventions of the [host environment](#host-environment)'s current locale.

The meaning of the optional parameters to this method are defined in the ECMA-402 specification; implementations that do not include ECMA-402 support must not use those parameter positions for anything else.

#### 21.4.4.39 Date.prototype.toLocaleString ( \[ `reserved1` \[ , `reserved2` \] \] )

An ECMAScript implementation that includes the ECMA-402 Internationalization API must implement this method as specified in the ECMA-402 specification. If an ECMAScript implementation does not include the ECMA-402 API the following specification of this method is used:

This method returns a String value. The contents of the String are [implementation-defined](#implementation-defined), but are intended to represent the Date in the current time zone in a convenient, human-readable form that corresponds to the conventions of the [host environment](#host-environment)'s current locale.

The meaning of the optional parameters to this method are defined in the ECMA-402 specification; implementations that do not include ECMA-402 support must not use those parameter positions for anything else.

#### 21.4.4.40 Date.prototype.toLocaleTimeString ( \[ `reserved1` \[ , `reserved2` \] \] )

An ECMAScript implementation that includes the ECMA-402 Internationalization API must implement this method as specified in the ECMA-402 specification. If an ECMAScript implementation does not include the ECMA-402 API the following specification of this method is used:

This method returns a String value. The contents of the String are [implementation-defined](#implementation-defined), but are intended to represent the “time” portion of the Date in the current time zone in a convenient, human-readable form that corresponds to the conventions of the [host environment](#host-environment)'s current locale.

The meaning of the optional parameters to this method are defined in the ECMA-402 specification; implementations that do not include ECMA-402 support must not use those parameter positions for anything else.

#### 21.4.4.41 Date.prototype.toString ( )

This method performs the following steps when called:

1.  Let `dateObject` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`dateObject`, `[[DateValue]]`).
3.  Let `tv` be `dateObject`.`[[DateValue]]`.
4.  Return [ToDateString](#sec-todatestring)(`tv`).

Note 1

For any Date `d` such that `d.``[[DateValue]]` is evenly divisible by 1000, the result of `Date.parse(d.toString())` = `d.valueOf()`. See [21.4.3.2](#sec-date.parse).

Note 2

This method is not generic; it throws a TypeError exception if its this value is not a Date. Therefore, it cannot be transferred to other kinds of objects for use as a method.

##### 21.4.4.41.1 TimeString ( `tv` )

The abstract operation TimeString takes argument `tv` (a Number, but not NaN) and returns a String. It performs the following steps when called:

1.  Let `hour` be [ToZeroPaddedDecimalString](#sec-tozeropaddeddecimalstring)([ℝ](#ℝ)([HourFromTime](#sec-hourfromtime)(`tv`)), 2).
2.  Let `minute` be [ToZeroPaddedDecimalString](#sec-tozeropaddeddecimalstring)([ℝ](#ℝ)([MinFromTime](#sec-minfromtime)(`tv`)), 2).
3.  Let `second` be [ToZeroPaddedDecimalString](#sec-tozeropaddeddecimalstring)([ℝ](#ℝ)([SecFromTime](#sec-secfromtime)(`tv`)), 2).
4.  Return the [string-concatenation](#string-concatenation) of `hour`, ":", `minute`, ":", `second`, the code unit 0x0020 (SPACE), and "GMT".

##### 21.4.4.41.2 DateString ( `tv` )

The abstract operation DateString takes argument `tv` (a Number, but not NaN) and returns a String. It performs the following steps when called:

1.  Let `weekday` be the Name of the entry in [Table 65](#sec-todatestring-day-names) with the Number [WeekDay](#sec-weekday)(`tv`).
2.  Let `month` be the Name of the entry in [Table 66](#sec-todatestring-month-names) with the Number [MonthFromTime](#sec-monthfromtime)(`tv`).
3.  Let `day` be [ToZeroPaddedDecimalString](#sec-tozeropaddeddecimalstring)([ℝ](#ℝ)([DateFromTime](#sec-datefromtime)(`tv`)), 2).
4.  Let `yv` be [YearFromTime](#sec-yearfromtime)(`tv`).
5.  If `yv` is +0_(𝔽) or `yv` \> +0_(𝔽), let `yearSign` be the empty String; otherwise, let `yearSign` be "-".
6.  Let `paddedYear` be [ToZeroPaddedDecimalString](#sec-tozeropaddeddecimalstring)([abs](#eqn-abs)([ℝ](#ℝ)(`yv`)), 4).
7.  Return the [string-concatenation](#string-concatenation) of `weekday`, the code unit 0x0020 (SPACE), `month`, the code unit 0x0020 (SPACE), `day`, the code unit 0x0020 (SPACE), `yearSign`, and `paddedYear`.

| Number | Name  |
|--------|-------|
| +0_(𝔽) | "Sun" |
| 1_(𝔽)  | "Mon" |
| 2_(𝔽)  | "Tue" |
| 3_(𝔽)  | "Wed" |
| 4_(𝔽)  | "Thu" |
| 5_(𝔽)  | "Fri" |
| 6_(𝔽)  | "Sat" |

Table 65: Names of days of the week

| Number | Name  |
|--------|-------|
| +0_(𝔽) | "Jan" |
| 1_(𝔽)  | "Feb" |
| 2_(𝔽)  | "Mar" |
| 3_(𝔽)  | "Apr" |
| 4_(𝔽)  | "May" |
| 5_(𝔽)  | "Jun" |
| 6_(𝔽)  | "Jul" |
| 7_(𝔽)  | "Aug" |
| 8_(𝔽)  | "Sep" |
| 9_(𝔽)  | "Oct" |
| 10_(𝔽) | "Nov" |
| 11_(𝔽) | "Dec" |

Table 66: Names of months of the year

##### 21.4.4.41.3 TimeZoneString ( `tv` )

The abstract operation TimeZoneString takes argument `tv` (an [integral Number](#integral-number)) and returns a String. It performs the following steps when called:

1.  Let `systemTimeZoneIdentifier` be [SystemTimeZoneIdentifier](#sec-systemtimezoneidentifier)().
2.  If [IsTimeZoneOffsetString](#sec-istimezoneoffsetstring)(`systemTimeZoneIdentifier`) is true, then
    1.  Let `offsetNs` be [ParseTimeZoneOffsetString](#sec-parsetimezoneoffsetstring)(`systemTimeZoneIdentifier`).
3.  Else,
    1.  Let `offsetNs` be [GetNamedTimeZoneOffsetNanoseconds](#sec-getnamedtimezoneoffsetnanoseconds)(`systemTimeZoneIdentifier`, [ℤ](#ℤ)([ℝ](#ℝ)(`tv`) × 10\*\*⁶)).
4.  Let `offset` be [𝔽](#𝔽)([truncate](#eqn-truncate)(`offsetNs` / 10\*\*⁶)).
5.  If `offset` is +0_(𝔽) or `offset` \> +0_(𝔽), then
    1.  Let `offsetSign` be "+".
    2.  Let `absOffset` be `offset`.
6.  Else,
    1.  Let `offsetSign` be "-".
    2.  Let `absOffset` be -`offset`.
7.  Let `offsetMin` be [ToZeroPaddedDecimalString](#sec-tozeropaddeddecimalstring)([ℝ](#ℝ)([MinFromTime](#sec-minfromtime)(`absOffset`)), 2).
8.  Let `offsetHour` be [ToZeroPaddedDecimalString](#sec-tozeropaddeddecimalstring)([ℝ](#ℝ)([HourFromTime](#sec-hourfromtime)(`absOffset`)), 2).
9.  Let `tzName` be an [implementation-defined](#implementation-defined) string that is either the empty String or the [string-concatenation](#string-concatenation) of the code unit 0x0020 (SPACE), the code unit 0x0028 (LEFT PARENTHESIS), an [implementation-defined](#implementation-defined) timezone name, and the code unit 0x0029 (RIGHT PARENTHESIS).
10. Return the [string-concatenation](#string-concatenation) of `offsetSign`, `offsetHour`, `offsetMin`, and `tzName`.

##### 21.4.4.41.4 ToDateString ( `tv` )

The abstract operation ToDateString takes argument `tv` (an [integral Number](#integral-number) or NaN) and returns a String. It performs the following steps when called:

1.  If `tv` is NaN, return "Invalid Date".
2.  Let `t` be [LocalTime](#sec-localtime)(`tv`).
3.  Return the [string-concatenation](#string-concatenation) of [DateString](#sec-datestring)(`t`), the code unit 0x0020 (SPACE), [TimeString](#sec-timestring)(`t`), and [TimeZoneString](#sec-timezoneestring)(`tv`).

#### 21.4.4.42 Date.prototype.toTimeString ( )

This method performs the following steps when called:

1.  Let `dateObject` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`dateObject`, `[[DateValue]]`).
3.  Let `tv` be `dateObject`.`[[DateValue]]`.
4.  If `tv` is NaN, return "Invalid Date".
5.  Let `t` be [LocalTime](#sec-localtime)(`tv`).
6.  Return the [string-concatenation](#string-concatenation) of [TimeString](#sec-timestring)(`t`) and [TimeZoneString](#sec-timezoneestring)(`tv`).

#### 21.4.4.43 Date.prototype.toUTCString ( )

This method returns a String value representing the instant in time corresponding to the this value. The format of the String is based upon "HTTP-date" from RFC 7231, generalized to support the full range of times supported by ECMAScript Dates.

It performs the following steps when called:

1.  Let `dateObject` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`dateObject`, `[[DateValue]]`).
3.  Let `tv` be `dateObject`.`[[DateValue]]`.
4.  If `tv` is NaN, return "Invalid Date".
5.  Let `weekday` be the Name of the entry in [Table 65](#sec-todatestring-day-names) with the Number [WeekDay](#sec-weekday)(`tv`).
6.  Let `month` be the Name of the entry in [Table 66](#sec-todatestring-month-names) with the Number [MonthFromTime](#sec-monthfromtime)(`tv`).
7.  Let `day` be [ToZeroPaddedDecimalString](#sec-tozeropaddeddecimalstring)([ℝ](#ℝ)([DateFromTime](#sec-datefromtime)(`tv`)), 2).
8.  Let `yv` be [YearFromTime](#sec-yearfromtime)(`tv`).
9.  If `yv` is +0_(𝔽) or `yv` \> +0_(𝔽), let `yearSign` be the empty String; otherwise, let `yearSign` be "-".
10. Let `paddedYear` be [ToZeroPaddedDecimalString](#sec-tozeropaddeddecimalstring)([abs](#eqn-abs)([ℝ](#ℝ)(`yv`)), 4).
11. Return the [string-concatenation](#string-concatenation) of `weekday`, ",", the code unit 0x0020 (SPACE), `day`, the code unit 0x0020 (SPACE), `month`, the code unit 0x0020 (SPACE), `yearSign`, `paddedYear`, the code unit 0x0020 (SPACE), and [TimeString](#sec-timestring)(`tv`).

#### 21.4.4.44 Date.prototype.valueOf ( )

This method performs the following steps when called:

1.  Let `dateObject` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`dateObject`, `[[DateValue]]`).
3.  Return `dateObject`.`[[DateValue]]`.

#### 21.4.4.45 Date.prototype \[ %Symbol.toPrimitive% \] ( `hint` )

This method is called by ECMAScript language operators to convert a Date to a primitive value. The allowed values for `hint` are "default", "number", and "string". Dates are unique among built-in ECMAScript object in that they treat "default" as being equivalent to "string", All other built-in ECMAScript objects treat "default" as being equivalent to "number".

It performs the following steps when called:

1.  Let `O` be the this value.
2.  If `O` [is not an Object](#sec-object-type), throw a TypeError exception.
3.  If `hint` is either "string" or "default", then
    1.  Let `tryFirst` be string.
4.  Else if `hint` is "number", then
    1.  Let `tryFirst` be number.
5.  Else,
    1.  Throw a TypeError exception.
6.  Return ? [OrdinaryToPrimitive](#sec-ordinarytoprimitive)(`O`, `tryFirst`).

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: true }.

The value of the "name" property of this method is "\[Symbol.toPrimitive\]".

### 21.4.5 Properties of Date Instances

Date instances are [ordinary objects](#ordinary-object) that inherit properties from the [Date prototype object](#sec-properties-of-the-date-prototype-object). Date instances also have a `[[DateValue]]` internal slot. The `[[DateValue]]` internal slot is the [time value](#sec-time-values-and-time-range) represented by this Date.
