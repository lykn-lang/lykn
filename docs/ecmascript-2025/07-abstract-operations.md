# 7 Abstract Operations

These operations are not a part of the ECMAScript language; they are defined here solely to aid the specification of the semantics of the ECMAScript language. Other, more specialized [abstract operations](#sec-algorithm-conventions-abstract-operations) are defined throughout this specification.

## 7.1 Type Conversion

The ECMAScript language implicitly performs automatic type conversion as needed. To clarify the semantics of certain constructs it is useful to define a set of conversion [abstract operations](#sec-algorithm-conventions-abstract-operations). The conversion [abstract operations](#sec-algorithm-conventions-abstract-operations) are polymorphic; they can accept a value of any [ECMAScript language type](#sec-ecmascript-language-types). But no other specification types are used with these operations.

The [BigInt type](#sec-ecmascript-language-types-bigint-type) has no implicit conversions in the ECMAScript language; programmers must call BigInt explicitly to convert values from other types.

### 7.1.1 ToPrimitive ( `input` \[ , `preferredType` \] )

The abstract operation ToPrimitive takes argument `input` (an [ECMAScript language value](#sec-ecmascript-language-types)) and optional argument `preferredType` (string or number) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [ECMAScript language value](#sec-ecmascript-language-types) or a [throw completion](#sec-completion-record-specification-type). It converts its `input` argument to a non-[Object type](#sec-object-type). If an object is capable of converting to more than one primitive type, it may use the optional hint `preferredType` to favour that type. It performs the following steps when called:

1.  If `input` [is an Object](#sec-object-type), then
    1.  Let `exoticToPrim` be ? [GetMethod](#sec-getmethod)(`input`, [%Symbol.toPrimitive%](#sec-well-known-symbols)).
    2.  If `exoticToPrim` is not undefined, then
        1.  If `preferredType` is not present, then
            1.  Let `hint` be "default".
        2.  Else if `preferredType` is string, then
            1.  Let `hint` be "string".
        3.  Else,
            1.  [Assert](#assert): `preferredType` is number.
            2.  Let `hint` be "number".
        4.  Let `result` be ? [Call](#sec-call)(`exoticToPrim`, `input`, « `hint` »).
        5.  If `result` [is not an Object](#sec-object-type), return `result`.
        6.  Throw a TypeError exception.
    3.  If `preferredType` is not present, let `preferredType` be number.
    4.  Return ? [OrdinaryToPrimitive](#sec-ordinarytoprimitive)(`input`, `preferredType`).
2.  Return `input`.

Note

When ToPrimitive is called without a hint, then it generally behaves as if the hint were number. However, objects may over-ride this behaviour by defining a [%Symbol.toPrimitive%](#sec-well-known-symbols) method. Of the objects defined in this specification only Dates (see [21.4.4.45](#sec-date.prototype-%symbol.toprimitive%)) and Symbol objects (see [20.4.3.5](#sec-symbol.prototype-%symbol.toprimitive%)) over-ride the default ToPrimitive behaviour. Dates treat the absence of a hint as if the hint were string.

#### 7.1.1.1 OrdinaryToPrimitive ( `O`, `hint` )

The abstract operation OrdinaryToPrimitive takes arguments `O` (an Object) and `hint` (string or number) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [ECMAScript language value](#sec-ecmascript-language-types) or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  If `hint` is string, then
    1.  Let `methodNames` be « "toString", "valueOf" ».
2.  Else,
    1.  Let `methodNames` be « "valueOf", "toString" ».
3.  For each element `name` of `methodNames`, do
    1.  Let `method` be ? [Get](#sec-get-o-p)(`O`, `name`).
    2.  If [IsCallable](#sec-iscallable)(`method`) is true, then
        1.  Let `result` be ? [Call](#sec-call)(`method`, `O`).
        2.  If `result` [is not an Object](#sec-object-type), return `result`.
4.  Throw a TypeError exception.

### 7.1.2 ToBoolean ( `argument` )

The abstract operation ToBoolean takes argument `argument` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns a Boolean. It converts `argument` to a value of type Boolean. It performs the following steps when called:

1.  If `argument` [is a Boolean](#sec-ecmascript-language-types-boolean-type), return `argument`.
2.  If `argument` is one of undefined, null, +0_(𝔽), -0_(𝔽), NaN, 0_(ℤ), or the empty String, return false.
3.  NOTE: This step is replaced in section [B.3.6.1](#sec-IsHTMLDDA-internal-slot-to-boolean).
4.  Return true.

### 7.1.3 ToNumeric ( `value` )

The abstract operation ToNumeric takes argument `value` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) either a Number or a BigInt, or a [throw completion](#sec-completion-record-specification-type). It returns `value` converted to a Number or a BigInt. It performs the following steps when called:

1.  Let `primValue` be ? [ToPrimitive](#sec-toprimitive)(`value`, number).
2.  If `primValue` [is a BigInt](#sec-ecmascript-language-types-bigint-type), return `primValue`.
3.  Return ? [ToNumber](#sec-tonumber)(`primValue`).

### 7.1.4 ToNumber ( `argument` )

The abstract operation ToNumber takes argument `argument` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a Number or a [throw completion](#sec-completion-record-specification-type). It converts `argument` to a value of type Number. It performs the following steps when called:

1.  If `argument` [is a Number](#sec-ecmascript-language-types-number-type), return `argument`.
2.  If `argument` is either a Symbol or a BigInt, throw a TypeError exception.
3.  If `argument` is undefined, return NaN.
4.  If `argument` is either null or false, return +0_(𝔽).
5.  If `argument` is true, return 1_(𝔽).
6.  If `argument` [is a String](#sec-ecmascript-language-types-string-type), return [StringToNumber](#sec-stringtonumber)(`argument`).
7.  [Assert](#assert): `argument` [is an Object](#sec-object-type).
8.  Let `primValue` be ? [ToPrimitive](#sec-toprimitive)(`argument`, number).
9.  [Assert](#assert): `primValue` [is not an Object](#sec-object-type).
10. Return ? [ToNumber](#sec-tonumber)(`primValue`).

#### 7.1.4.1 ToNumber Applied to the String Type

The abstract operation [StringToNumber](#sec-stringtonumber) specifies how to convert a String value to a Number value, using the following grammar.

##### Syntax

[StringNumericLiteral](#prod-StringNumericLiteral) ::: [StrWhiteSpace](#prod-StrWhiteSpace)opt [StrWhiteSpace](#prod-StrWhiteSpace)opt [StrNumericLiteral](#prod-StrNumericLiteral) [StrWhiteSpace](#prod-StrWhiteSpace)opt [StrWhiteSpace](#prod-StrWhiteSpace) ::: [StrWhiteSpaceChar](#prod-StrWhiteSpaceChar) [StrWhiteSpace](#prod-StrWhiteSpace)opt [StrWhiteSpaceChar](#prod-StrWhiteSpaceChar) ::: [WhiteSpace](#prod-WhiteSpace) [LineTerminator](#prod-LineTerminator) [StrNumericLiteral](#prod-StrNumericLiteral) ::: [StrDecimalLiteral](#prod-StrDecimalLiteral) [NonDecimalIntegerLiteral](#prod-NonDecimalIntegerLiteral)\[~Sep\] [StrDecimalLiteral](#prod-StrDecimalLiteral) ::: [StrUnsignedDecimalLiteral](#prod-StrUnsignedDecimalLiteral) + [StrUnsignedDecimalLiteral](#prod-StrUnsignedDecimalLiteral) - [StrUnsignedDecimalLiteral](#prod-StrUnsignedDecimalLiteral) [StrUnsignedDecimalLiteral](#prod-StrUnsignedDecimalLiteral) ::: Infinity [DecimalDigits](#prod-DecimalDigits)\[~Sep\] . [DecimalDigits](#prod-DecimalDigits)\[~Sep\]opt [ExponentPart](#prod-ExponentPart)\[~Sep\]opt . [DecimalDigits](#prod-DecimalDigits)\[~Sep\] [ExponentPart](#prod-ExponentPart)\[~Sep\]opt [DecimalDigits](#prod-DecimalDigits)\[~Sep\] [ExponentPart](#prod-ExponentPart)\[~Sep\]opt

All grammar symbols not explicitly defined above have the definitions used in the Lexical Grammar for numeric literals ([12.9.3](#sec-literals-numeric-literals))

Note

Some differences should be noted between the syntax of a [StringNumericLiteral](#prod-StringNumericLiteral) and a [NumericLiteral](#prod-NumericLiteral):

- A [StringNumericLiteral](#prod-StringNumericLiteral) may include leading and/or trailing white space and/or line terminators.
- A [StringNumericLiteral](#prod-StringNumericLiteral) that is decimal may have any number of leading `0` digits.
- A [StringNumericLiteral](#prod-StringNumericLiteral) that is decimal may include a `+` or `-` to indicate its sign.
- A [StringNumericLiteral](#prod-StringNumericLiteral) that is empty or contains only white space is converted to +0_(𝔽).
- `Infinity` and `-Infinity` are recognized as a [StringNumericLiteral](#prod-StringNumericLiteral) but not as a [NumericLiteral](#prod-NumericLiteral).
- A [StringNumericLiteral](#prod-StringNumericLiteral) cannot include a [BigIntLiteralSuffix](#prod-BigIntLiteralSuffix).
- A [StringNumericLiteral](#prod-StringNumericLiteral) cannot include a [NumericLiteralSeparator](#prod-NumericLiteralSeparator).

##### 7.1.4.1.1 StringToNumber ( `str` )

The abstract operation StringToNumber takes argument `str` (a String) and returns a Number. It performs the following steps when called:

1.  Let `literal` be [ParseText](#sec-parsetext)(`str`, [StringNumericLiteral](#prod-StringNumericLiteral)).
2.  If `literal` is a [List](#sec-list-and-record-specification-type) of errors, return NaN.
3.  Return the [StringNumericValue](#sec-runtime-semantics-stringnumericvalue) of `literal`.

##### 7.1.4.1.2 Runtime Semantics: StringNumericValue

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) StringNumericValue takes no arguments and returns a Number.

Note

The conversion of a [StringNumericLiteral](#prod-StringNumericLiteral) to a Number value is similar overall to the determination of the [NumericValue](#sec-numericvalue) of a [NumericLiteral](#prod-NumericLiteral) (see [12.9.3](#sec-literals-numeric-literals)), but some of the details are different.

It is defined piecewise over the following productions:

[StringNumericLiteral](#prod-StringNumericLiteral) ::: [StrWhiteSpace](#prod-StrWhiteSpace)opt

1.  Return +0_(𝔽).

[StringNumericLiteral](#prod-StringNumericLiteral) ::: [StrWhiteSpace](#prod-StrWhiteSpace)opt [StrNumericLiteral](#prod-StrNumericLiteral) [StrWhiteSpace](#prod-StrWhiteSpace)opt

1.  Return the [StringNumericValue](#sec-runtime-semantics-stringnumericvalue) of [StrNumericLiteral](#prod-StrNumericLiteral).

[StrNumericLiteral](#prod-StrNumericLiteral) ::: [NonDecimalIntegerLiteral](#prod-NonDecimalIntegerLiteral)

1.  Return [𝔽](#𝔽)(MV of [NonDecimalIntegerLiteral](#prod-NonDecimalIntegerLiteral)).

[StrDecimalLiteral](#prod-StrDecimalLiteral) ::: - [StrUnsignedDecimalLiteral](#prod-StrUnsignedDecimalLiteral)

1.  Let `a` be the [StringNumericValue](#sec-runtime-semantics-stringnumericvalue) of [StrUnsignedDecimalLiteral](#prod-StrUnsignedDecimalLiteral).
2.  If `a` is +0_(𝔽), return -0_(𝔽).
3.  Return -`a`.

[StrUnsignedDecimalLiteral](#prod-StrUnsignedDecimalLiteral) ::: Infinity

1.  Return +∞_(𝔽).

[StrUnsignedDecimalLiteral](#prod-StrUnsignedDecimalLiteral) ::: [DecimalDigits](#prod-DecimalDigits) . [DecimalDigits](#prod-DecimalDigits)opt [ExponentPart](#prod-ExponentPart)opt

1.  Let `a` be the MV of the first [DecimalDigits](#prod-DecimalDigits).
2.  If the second [DecimalDigits](#prod-DecimalDigits) is present, then
    1.  Let `b` be the MV of the second [DecimalDigits](#prod-DecimalDigits).
    2.  Let `n` be the number of code points in the second [DecimalDigits](#prod-DecimalDigits).
3.  Else,
    1.  Let `b` be 0.
    2.  Let `n` be 0.
4.  If [ExponentPart](#prod-ExponentPart) is present, let `e` be the MV of [ExponentPart](#prod-ExponentPart). Otherwise, let `e` be 0.
5.  Return [RoundMVResult](#sec-roundmvresult)((`a` + (`b` × 10\*\*^(-`n`))) × 10\*\*^(`e`)).

[StrUnsignedDecimalLiteral](#prod-StrUnsignedDecimalLiteral) ::: . [DecimalDigits](#prod-DecimalDigits) [ExponentPart](#prod-ExponentPart)opt

1.  Let `b` be the MV of [DecimalDigits](#prod-DecimalDigits).
2.  If [ExponentPart](#prod-ExponentPart) is present, let `e` be the MV of [ExponentPart](#prod-ExponentPart). Otherwise, let `e` be 0.
3.  Let `n` be the number of code points in [DecimalDigits](#prod-DecimalDigits).
4.  Return [RoundMVResult](#sec-roundmvresult)(`b` × 10\*\*(^(`e` - `n`))).

[StrUnsignedDecimalLiteral](#prod-StrUnsignedDecimalLiteral) ::: [DecimalDigits](#prod-DecimalDigits) [ExponentPart](#prod-ExponentPart)opt

1.  Let `a` be the MV of [DecimalDigits](#prod-DecimalDigits).
2.  If [ExponentPart](#prod-ExponentPart) is present, let `e` be the MV of [ExponentPart](#prod-ExponentPart). Otherwise, let `e` be 0.
3.  Return [RoundMVResult](#sec-roundmvresult)(`a` × 10\*\*^(`e`)).

##### 7.1.4.1.3 RoundMVResult ( `n` )

The abstract operation RoundMVResult takes argument `n` (a [mathematical value](#mathematical-value)) and returns a Number. It converts `n` to a Number in an [implementation-defined](#implementation-defined) manner. For the purposes of this abstract operation, a digit is significant if it is not zero or there is a non-zero digit to its left and there is a non-zero digit to its right. For the purposes of this abstract operation, "the [mathematical value](#mathematical-value) denoted by" a representation of a [mathematical value](#mathematical-value) is the inverse of "the decimal representation of" a [mathematical value](#mathematical-value). It performs the following steps when called:

1.  If the decimal representation of `n` has 20 or fewer significant digits, return [𝔽](#𝔽)(`n`).
2.  Let `option1` be the [mathematical value](#mathematical-value) denoted by the result of replacing each significant digit in the decimal representation of `n` after the 20th with a 0 digit.
3.  Let `option2` be the [mathematical value](#mathematical-value) denoted by the result of replacing each significant digit in the decimal representation of `n` after the 20th with a 0 digit and then incrementing it at the 20th position (with carrying as necessary).
4.  Let `chosen` be an [implementation-defined](#implementation-defined) choice of either `option1` or `option2`.
5.  Return [𝔽](#𝔽)(`chosen`).

### 7.1.5 ToIntegerOrInfinity ( `argument` )

The abstract operation ToIntegerOrInfinity takes argument `argument` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) either an [integer](#integer), +∞, or -∞, or a [throw completion](#sec-completion-record-specification-type). It converts `argument` to an [integer](#integer) representing its Number value with fractional part truncated, or to +∞ or -∞ when that Number value is infinite. It performs the following steps when called:

1.  Let `number` be ? [ToNumber](#sec-tonumber)(`argument`).
2.  If `number` is one of NaN, +0_(𝔽), or -0_(𝔽), return 0.
3.  If `number` is +∞_(𝔽), return +∞.
4.  If `number` is -∞_(𝔽), return -∞.
5.  Return [truncate](#eqn-truncate)([ℝ](#ℝ)(`number`)).

Note

[𝔽](#𝔽)(ToIntegerOrInfinity(`x`)) never returns -0_(𝔽) for any value of `x`. The truncation of the fractional part is performed after converting `x` to a [mathematical value](#mathematical-value).

### 7.1.6 ToInt32 ( `argument` )

The abstract operation ToInt32 takes argument `argument` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [integral Number](#integral-number) or a [throw completion](#sec-completion-record-specification-type). It converts `argument` to one of 2\*\*³² [integral Number](#integral-number) values in the [inclusive interval](#inclusive-interval) from [𝔽](#𝔽)(-2\*\*³¹) to [𝔽](#𝔽)(2\*\*³¹ - 1). It performs the following steps when called:

1.  Let `number` be ? [ToNumber](#sec-tonumber)(`argument`).
2.  If `number` is not [finite](#finite) or `number` is either +0_(𝔽) or -0_(𝔽), return +0_(𝔽).
3.  Let `int` be [truncate](#eqn-truncate)([ℝ](#ℝ)(`number`)).
4.  Let `int32bit` be `int` [modulo](#eqn-modulo) 2\*\*³².
5.  If `int32bit` ≥ 2\*\*³¹, return [𝔽](#𝔽)(`int32bit` - 2\*\*³²); otherwise return [𝔽](#𝔽)(`int32bit`).

Note

Given the above definition of ToInt32:

- The ToInt32 abstract operation is idempotent: if applied to a result that it produced, the second application leaves that value unchanged.
- ToInt32([ToUint32](#sec-touint32)(`x`)) is the same value as ToInt32(`x`) for all values of `x`. (It is to preserve this latter property that +∞_(𝔽) and -∞_(𝔽) are mapped to +0_(𝔽).)
- ToInt32 maps -0_(𝔽) to +0_(𝔽).

### 7.1.7 ToUint32 ( `argument` )

The abstract operation ToUint32 takes argument `argument` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [integral Number](#integral-number) or a [throw completion](#sec-completion-record-specification-type). It converts `argument` to one of 2\*\*³² [integral Number](#integral-number) values in the [inclusive interval](#inclusive-interval) from +0_(𝔽) to [𝔽](#𝔽)(2\*\*³² - 1). It performs the following steps when called:

1.  Let `number` be ? [ToNumber](#sec-tonumber)(`argument`).
2.  If `number` is not [finite](#finite) or `number` is either +0_(𝔽) or -0_(𝔽), return +0_(𝔽).
3.  Let `int` be [truncate](#eqn-truncate)([ℝ](#ℝ)(`number`)).
4.  Let `int32bit` be `int` [modulo](#eqn-modulo) 2\*\*³².
5.  Return [𝔽](#𝔽)(`int32bit`).

Note

Given the above definition of ToUint32:

- Step [5](#step-touint32-return) is the only difference between ToUint32 and [ToInt32](#sec-toint32).
- The ToUint32 abstract operation is idempotent: if applied to a result that it produced, the second application leaves that value unchanged.
- ToUint32([ToInt32](#sec-toint32)(`x`)) is the same value as ToUint32(`x`) for all values of `x`. (It is to preserve this latter property that +∞_(𝔽) and -∞_(𝔽) are mapped to +0_(𝔽).)
- ToUint32 maps -0_(𝔽) to +0_(𝔽).

### 7.1.8 ToInt16 ( `argument` )

The abstract operation ToInt16 takes argument `argument` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [integral Number](#integral-number) or a [throw completion](#sec-completion-record-specification-type). It converts `argument` to one of 2\*\*¹⁶ [integral Number](#integral-number) values in the [inclusive interval](#inclusive-interval) from [𝔽](#𝔽)(-2\*\*¹⁵) to [𝔽](#𝔽)(2\*\*¹⁵ - 1). It performs the following steps when called:

1.  Let `number` be ? [ToNumber](#sec-tonumber)(`argument`).
2.  If `number` is not [finite](#finite) or `number` is either +0_(𝔽) or -0_(𝔽), return +0_(𝔽).
3.  Let `int` be [truncate](#eqn-truncate)([ℝ](#ℝ)(`number`)).
4.  Let `int16bit` be `int` [modulo](#eqn-modulo) 2\*\*¹⁶.
5.  If `int16bit` ≥ 2\*\*¹⁵, return [𝔽](#𝔽)(`int16bit` - 2\*\*¹⁶); otherwise return [𝔽](#𝔽)(`int16bit`).

### 7.1.9 ToUint16 ( `argument` )

The abstract operation ToUint16 takes argument `argument` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [integral Number](#integral-number) or a [throw completion](#sec-completion-record-specification-type). It converts `argument` to one of 2\*\*¹⁶ [integral Number](#integral-number) values in the [inclusive interval](#inclusive-interval) from +0_(𝔽) to [𝔽](#𝔽)(2\*\*¹⁶ - 1). It performs the following steps when called:

1.  Let `number` be ? [ToNumber](#sec-tonumber)(`argument`).
2.  If `number` is not [finite](#finite) or `number` is either +0_(𝔽) or -0_(𝔽), return +0_(𝔽).
3.  Let `int` be [truncate](#eqn-truncate)([ℝ](#ℝ)(`number`)).
4.  Let `int16bit` be `int` [modulo](#eqn-modulo) 2\*\*¹⁶.
5.  Return [𝔽](#𝔽)(`int16bit`).

Note

Given the above definition of ToUint16:

- The substitution of 2\*\*¹⁶ for 2\*\*³² in step [4](#step-touint16-mod) is the only difference between [ToUint32](#sec-touint32) and ToUint16.
- ToUint16 maps -0_(𝔽) to +0_(𝔽).

### 7.1.10 ToInt8 ( `argument` )

The abstract operation ToInt8 takes argument `argument` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [integral Number](#integral-number) or a [throw completion](#sec-completion-record-specification-type). It converts `argument` to one of 2\*\*⁸ [integral Number](#integral-number) values in the [inclusive interval](#inclusive-interval) from -128_(𝔽) to 127_(𝔽). It performs the following steps when called:

1.  Let `number` be ? [ToNumber](#sec-tonumber)(`argument`).
2.  If `number` is not [finite](#finite) or `number` is either +0_(𝔽) or -0_(𝔽), return +0_(𝔽).
3.  Let `int` be [truncate](#eqn-truncate)([ℝ](#ℝ)(`number`)).
4.  Let `int8bit` be `int` [modulo](#eqn-modulo) 2\*\*⁸.
5.  If `int8bit` ≥ 2\*\*⁷, return [𝔽](#𝔽)(`int8bit` - 2\*\*⁸); otherwise return [𝔽](#𝔽)(`int8bit`).

### 7.1.11 ToUint8 ( `argument` )

The abstract operation ToUint8 takes argument `argument` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [integral Number](#integral-number) or a [throw completion](#sec-completion-record-specification-type). It converts `argument` to one of 2\*\*⁸ [integral Number](#integral-number) values in the [inclusive interval](#inclusive-interval) from +0_(𝔽) to 255_(𝔽). It performs the following steps when called:

1.  Let `number` be ? [ToNumber](#sec-tonumber)(`argument`).
2.  If `number` is not [finite](#finite) or `number` is either +0_(𝔽) or -0_(𝔽), return +0_(𝔽).
3.  Let `int` be [truncate](#eqn-truncate)([ℝ](#ℝ)(`number`)).
4.  Let `int8bit` be `int` [modulo](#eqn-modulo) 2\*\*⁸.
5.  Return [𝔽](#𝔽)(`int8bit`).

### 7.1.12 ToUint8Clamp ( `argument` )

The abstract operation ToUint8Clamp takes argument `argument` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [integral Number](#integral-number) or a [throw completion](#sec-completion-record-specification-type). It clamps and rounds `argument` to one of 2\*\*⁸ [integral Number](#integral-number) values in the [inclusive interval](#inclusive-interval) from +0_(𝔽) to 255_(𝔽). It performs the following steps when called:

1.  Let `number` be ? [ToNumber](#sec-tonumber)(`argument`).
2.  If `number` is NaN, return +0_(𝔽).
3.  Let `mv` be the [extended mathematical value of](#extended-mathematical-value-of) `number`.
4.  Let `clamped` be the result of [clamping](#clamping) `mv` between 0 and 255.
5.  Let `f` be [floor](#eqn-floor)(`clamped`).
6.  If `clamped` \< `f` + 0.5, return [𝔽](#𝔽)(`f`).
7.  If `clamped` \> `f` + 0.5, return [𝔽](#𝔽)(`f` + 1).
8.  If `f` is even, return [𝔽](#𝔽)(`f`). Otherwise, return [𝔽](#𝔽)(`f` + 1).

Note

Unlike most other ECMAScript [integer](#integer) conversion operations, ToUint8Clamp rounds rather than truncates non-integral values. It also uses “round half to even” tie-breaking, which differs from the “round half up” tie-breaking of [`Math.round`](#sec-math.round).

### 7.1.13 ToBigInt ( `argument` )

The abstract operation ToBigInt takes argument `argument` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a BigInt or a [throw completion](#sec-completion-record-specification-type). It converts `argument` to a BigInt value, or throws if an implicit conversion from Number would be required. It performs the following steps when called:

1.  Let `prim` be ? [ToPrimitive](#sec-toprimitive)(`argument`, number).
2.  Return the value that `prim` corresponds to in [Table 12](#table-tobigint).

[TABLE]

Table 12: BigInt Conversions

### 7.1.14 StringToBigInt ( `str` )

The abstract operation StringToBigInt takes argument `str` (a String) and returns a BigInt or undefined. It performs the following steps when called:

1.  Let `literal` be [ParseText](#sec-parsetext)(`str`, [StringIntegerLiteral](#prod-StringIntegerLiteral)).
2.  If `literal` is a [List](#sec-list-and-record-specification-type) of errors, return undefined.
3.  Let `mv` be the MV of `literal`.
4.  [Assert](#assert): `mv` is an [integer](#integer).
5.  Return [ℤ](#ℤ)(`mv`).

#### 7.1.14.1 StringIntegerLiteral Grammar

[StringToBigInt](#sec-stringtobigint) uses the following grammar.

##### Syntax

[StringIntegerLiteral](#prod-StringIntegerLiteral) ::: [StrWhiteSpace](#prod-StrWhiteSpace)opt [StrWhiteSpace](#prod-StrWhiteSpace)opt [StrIntegerLiteral](#prod-StrIntegerLiteral) [StrWhiteSpace](#prod-StrWhiteSpace)opt [StrIntegerLiteral](#prod-StrIntegerLiteral) ::: [SignedInteger](#prod-SignedInteger)\[~Sep\] [NonDecimalIntegerLiteral](#prod-NonDecimalIntegerLiteral)\[~Sep\]

#### 7.1.14.2 Runtime Semantics: MV

- The MV of [StringIntegerLiteral](#prod-StringIntegerLiteral) ::: [StrWhiteSpace](#prod-StrWhiteSpace)opt is 0.
- The MV of [StringIntegerLiteral](#prod-StringIntegerLiteral) ::: [StrWhiteSpace](#prod-StrWhiteSpace)opt [StrIntegerLiteral](#prod-StrIntegerLiteral) [StrWhiteSpace](#prod-StrWhiteSpace)opt is the MV of [StrIntegerLiteral](#prod-StrIntegerLiteral).

### 7.1.15 ToBigInt64 ( `argument` )

The abstract operation ToBigInt64 takes argument `argument` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a BigInt or a [throw completion](#sec-completion-record-specification-type). It converts `argument` to one of 2\*\*⁶⁴ BigInt values in the [inclusive interval](#inclusive-interval) from [ℤ](#ℤ)(-2\*\*⁶³) to [ℤ](#ℤ)(2\*\*⁶³ - 1). It performs the following steps when called:

1.  Let `n` be ? [ToBigInt](#sec-tobigint)(`argument`).
2.  Let `int64bit` be [ℝ](#ℝ)(`n`) [modulo](#eqn-modulo) 2\*\*⁶⁴.
3.  If `int64bit` ≥ 2\*\*⁶³, return [ℤ](#ℤ)(`int64bit` - 2\*\*⁶⁴); otherwise return [ℤ](#ℤ)(`int64bit`).

### 7.1.16 ToBigUint64 ( `argument` )

The abstract operation ToBigUint64 takes argument `argument` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a BigInt or a [throw completion](#sec-completion-record-specification-type). It converts `argument` to one of 2\*\*⁶⁴ BigInt values in the [inclusive interval](#inclusive-interval) from 0_(ℤ) to [ℤ](#ℤ)(2\*\*⁶⁴ - 1). It performs the following steps when called:

1.  Let `n` be ? [ToBigInt](#sec-tobigint)(`argument`).
2.  Let `int64bit` be [ℝ](#ℝ)(`n`) [modulo](#eqn-modulo) 2\*\*⁶⁴.
3.  Return [ℤ](#ℤ)(`int64bit`).

### 7.1.17 ToString ( `argument` )

The abstract operation ToString takes argument `argument` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a String or a [throw completion](#sec-completion-record-specification-type). It converts `argument` to a value of type String. It performs the following steps when called:

1.  If `argument` [is a String](#sec-ecmascript-language-types-string-type), return `argument`.
2.  If `argument` [is a Symbol](#sec-ecmascript-language-types-symbol-type), throw a TypeError exception.
3.  If `argument` is undefined, return "undefined".
4.  If `argument` is null, return "null".
5.  If `argument` is true, return "true".
6.  If `argument` is false, return "false".
7.  If `argument` [is a Number](#sec-ecmascript-language-types-number-type), return [Number::toString](#sec-numeric-types-number-tostring)(`argument`, 10).
8.  If `argument` [is a BigInt](#sec-ecmascript-language-types-bigint-type), return [BigInt::toString](#sec-numeric-types-bigint-tostring)(`argument`, 10).
9.  [Assert](#assert): `argument` [is an Object](#sec-object-type).
10. Let `primValue` be ? [ToPrimitive](#sec-toprimitive)(`argument`, string).
11. [Assert](#assert): `primValue` [is not an Object](#sec-object-type).
12. Return ? [ToString](#sec-tostring)(`primValue`).

### 7.1.18 ToObject ( `argument` )

The abstract operation ToObject takes argument `argument` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) an Object or a [throw completion](#sec-completion-record-specification-type). It converts `argument` to a value of type Object according to [Table 13](#table-toobject-conversions):

| Argument Type | Result |
|----|----|
| Undefined | Throw a TypeError exception. |
| Null | Throw a TypeError exception. |
| Boolean | Return a new Boolean object whose `[[BooleanData]]` internal slot is set to `argument`. See [20.3](#sec-boolean-objects) for a description of Boolean objects. |
| Number | Return a new Number object whose `[[NumberData]]` internal slot is set to `argument`. See [21.1](#sec-number-objects) for a description of Number objects. |
| String | Return a new String object whose `[[StringData]]` internal slot is set to `argument`. See [22.1](#sec-string-objects) for a description of String objects. |
| Symbol | Return a new Symbol object whose `[[SymbolData]]` internal slot is set to `argument`. See [20.4](#sec-symbol-objects) for a description of Symbol objects. |
| BigInt | Return a new BigInt object whose `[[BigIntData]]` internal slot is set to `argument`. See [21.2](#sec-bigint-objects) for a description of BigInt objects. |
| Object | Return `argument`. |

Table 13: [ToObject](#sec-toobject) Conversions

### 7.1.19 ToPropertyKey ( `argument` )

The abstract operation ToPropertyKey takes argument `argument` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a [property key](#property-key) or a [throw completion](#sec-completion-record-specification-type). It converts `argument` to a value that can be used as a [property key](#property-key). It performs the following steps when called:

1.  Let `key` be ? [ToPrimitive](#sec-toprimitive)(`argument`, string).
2.  If `key` [is a Symbol](#sec-ecmascript-language-types-symbol-type), then
    1.  Return `key`.
3.  Return ! [ToString](#sec-tostring)(`key`).

### 7.1.20 ToLength ( `argument` )

The abstract operation ToLength takes argument `argument` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a non-negative [integral Number](#integral-number) or a [throw completion](#sec-completion-record-specification-type). It clamps and truncates `argument` to a non-negative [integral Number](#integral-number) suitable for use as the length of an [array-like object](#sec-lengthofarraylike). It performs the following steps when called:

1.  Let `len` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`argument`).
2.  If `len` ≤ 0, return +0_(𝔽).
3.  Return [𝔽](#𝔽)([min](#eqn-min)(`len`, 2\*\*⁵³ - 1)).

### 7.1.21 CanonicalNumericIndexString ( `argument` )

The abstract operation CanonicalNumericIndexString takes argument `argument` (a String) and returns a Number or undefined. If `argument` is either "-0" or exactly matches [ToString](#sec-tostring)(`n`) for some Number value `n`, it returns the respective Number value. Otherwise, it returns undefined. It performs the following steps when called:

1.  If `argument` is "-0", return -0_(𝔽).
2.  Let `n` be ! [ToNumber](#sec-tonumber)(`argument`).
3.  If ! [ToString](#sec-tostring)(`n`) is `argument`, return `n`.
4.  Return undefined.

A canonical numeric string is any String value for which the CanonicalNumericIndexString abstract operation does not return undefined.

### 7.1.22 ToIndex ( `value` )

The abstract operation ToIndex takes argument `value` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a non-negative [integer](#integer) or a [throw completion](#sec-completion-record-specification-type). It converts `value` to an [integer](#integer) and returns that [integer](#integer) if it is non-negative and corresponds with an [integer index](#integer-index). Otherwise, it throws an exception. It performs the following steps when called:

1.  Let `integer` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`value`).
2.  If `integer` is not in the [inclusive interval](#inclusive-interval) from 0 to 2\*\*⁵³ - 1, throw a RangeError exception.
3.  Return `integer`.

## 7.2 Testing and Comparison Operations

### 7.2.1 RequireObjectCoercible ( `argument` )

The abstract operation RequireObjectCoercible takes argument `argument` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [ECMAScript language value](#sec-ecmascript-language-types) or a [throw completion](#sec-completion-record-specification-type). It throws an error if `argument` is a value that cannot be converted to an Object using [ToObject](#sec-toobject). It is defined by [Table 14](#table-requireobjectcoercible-results):

| Argument Type | Result                       |
|---------------|------------------------------|
| Undefined     | Throw a TypeError exception. |
| Null          | Throw a TypeError exception. |
| Boolean       | Return `argument`.           |
| Number        | Return `argument`.           |
| String        | Return `argument`.           |
| Symbol        | Return `argument`.           |
| BigInt        | Return `argument`.           |
| Object        | Return `argument`.           |

Table 14: [RequireObjectCoercible](#sec-requireobjectcoercible) Results

### 7.2.2 IsArray ( `argument` )

The abstract operation IsArray takes argument `argument` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a Boolean or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  If `argument` [is not an Object](#sec-object-type), return false.
2.  If `argument` is an [Array exotic object](#array-exotic-object), return true.
3.  If `argument` is a [Proxy exotic object](#proxy-exotic-object), then
    1.  Perform ? [ValidateNonRevokedProxy](#sec-validatenonrevokedproxy)(`argument`).
    2.  Let `proxyTarget` be `argument`.`[[ProxyTarget]]`.
    3.  Return ? [IsArray](#sec-isarray)(`proxyTarget`).
4.  Return false.

### 7.2.3 IsCallable ( `argument` )

The abstract operation IsCallable takes argument `argument` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns a Boolean. It determines if `argument` is a callable function with a `[[Call]]` internal method. It performs the following steps when called:

1.  If `argument` [is not an Object](#sec-object-type), return false.
2.  If `argument` has a `[[Call]]` internal method, return true.
3.  Return false.

### 7.2.4 IsConstructor ( `argument` )

The abstract operation IsConstructor takes argument `argument` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns a Boolean. It determines if `argument` is a [function object](#function-object) with a `[[Construct]]` internal method. It performs the following steps when called:

1.  If `argument` [is not an Object](#sec-object-type), return false.
2.  If `argument` has a `[[Construct]]` internal method, return true.
3.  Return false.

### 7.2.5 IsExtensible ( `O` )

The abstract operation IsExtensible takes argument `O` (an Object) and returns either a [normal completion containing](#sec-completion-record-specification-type) a Boolean or a [throw completion](#sec-completion-record-specification-type). It is used to determine whether additional properties can be added to `O`. It performs the following steps when called:

1.  Return ? `O`.`[[IsExtensible]]`().

### 7.2.6 IsRegExp ( `argument` )

The abstract operation IsRegExp takes argument `argument` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a Boolean or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  If `argument` [is not an Object](#sec-object-type), return false.
2.  Let `matcher` be ? [Get](#sec-get-o-p)(`argument`, [%Symbol.match%](#sec-well-known-symbols)).
3.  If `matcher` is not undefined, return [ToBoolean](#sec-toboolean)(`matcher`).
4.  If `argument` has a `[[RegExpMatcher]]` internal slot, return true.
5.  Return false.

### 7.2.7 Static Semantics: IsStringWellFormedUnicode ( `string` )

The abstract operation IsStringWellFormedUnicode takes argument `string` (a String) and returns a Boolean. It interprets `string` as a sequence of UTF-16 encoded code points, as described in [6.1.4](#sec-ecmascript-language-types-string-type), and determines whether it is a [well formed](http://www.unicode.org/glossary/#well_formed_code_unit_sequence) UTF-16 sequence. It performs the following steps when called:

1.  Let `len` be the length of `string`.
2.  Let `k` be 0.
3.  Repeat, while `k` \< `len`,
    1.  Let `cp` be [CodePointAt](#sec-codepointat)(`string`, `k`).
    2.  If `cp`.`[[IsUnpairedSurrogate]]` is true, return false.
    3.  Set `k` to `k` + `cp`.`[[CodeUnitCount]]`.
4.  Return true.

### 7.2.8 SameType ( `x`, `y` )

The abstract operation SameType takes arguments `x` (an [ECMAScript language value](#sec-ecmascript-language-types)) and `y` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns a Boolean. It determines whether or not the two arguments are the same type. It performs the following steps when called:

1.  If `x` is undefined and `y` is undefined, return true.
2.  If `x` is null and `y` is null, return true.
3.  If `x` [is a Boolean](#sec-ecmascript-language-types-boolean-type) and `y` [is a Boolean](#sec-ecmascript-language-types-boolean-type), return true.
4.  If `x` [is a Number](#sec-ecmascript-language-types-number-type) and `y` [is a Number](#sec-ecmascript-language-types-number-type), return true.
5.  If `x` [is a BigInt](#sec-ecmascript-language-types-bigint-type) and `y` [is a BigInt](#sec-ecmascript-language-types-bigint-type), return true.
6.  If `x` [is a Symbol](#sec-ecmascript-language-types-symbol-type) and `y` [is a Symbol](#sec-ecmascript-language-types-symbol-type), return true.
7.  If `x` [is a String](#sec-ecmascript-language-types-string-type) and `y` [is a String](#sec-ecmascript-language-types-string-type), return true.
8.  If `x` [is an Object](#sec-object-type) and `y` [is an Object](#sec-object-type), return true.
9.  Return false.

### 7.2.9 SameValue ( `x`, `y` )

The abstract operation SameValue takes arguments `x` (an [ECMAScript language value](#sec-ecmascript-language-types)) and `y` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns a Boolean. It determines whether or not the two arguments are the same value. It performs the following steps when called:

1.  If [SameType](#sec-sametype)(`x`, `y`) is false, return false.
2.  If `x` [is a Number](#sec-ecmascript-language-types-number-type), then
    1.  Return [Number::sameValue](#sec-numeric-types-number-sameValue)(`x`, `y`).
3.  Return [SameValueNonNumber](#sec-samevaluenonnumber)(`x`, `y`).

Note

This algorithm differs from the [IsStrictlyEqual](#sec-isstrictlyequal) Algorithm by treating all NaN values as equivalent and by differentiating +0_(𝔽) from -0_(𝔽).

### 7.2.10 SameValueZero ( `x`, `y` )

The abstract operation SameValueZero takes arguments `x` (an [ECMAScript language value](#sec-ecmascript-language-types)) and `y` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns a Boolean. It determines whether or not the two arguments are the same value (ignoring the difference between +0_(𝔽) and -0_(𝔽)). It performs the following steps when called:

1.  If [SameType](#sec-sametype)(`x`, `y`) is false, return false.
2.  If `x` [is a Number](#sec-ecmascript-language-types-number-type), then
    1.  Return [Number::sameValueZero](#sec-numeric-types-number-sameValueZero)(`x`, `y`).
3.  Return [SameValueNonNumber](#sec-samevaluenonnumber)(`x`, `y`).

Note

SameValueZero differs from [SameValue](#sec-samevalue) only in that it treats +0_(𝔽) and -0_(𝔽) as equivalent.

### 7.2.11 SameValueNonNumber ( `x`, `y` )

The abstract operation SameValueNonNumber takes arguments `x` (an [ECMAScript language value](#sec-ecmascript-language-types), but not a Number) and `y` (an [ECMAScript language value](#sec-ecmascript-language-types), but not a Number) and returns a Boolean. It performs the following steps when called:

1.  [Assert](#assert): [SameType](#sec-sametype)(`x`, `y`) is true.
2.  If `x` is either null or undefined, return true.
3.  If `x` [is a BigInt](#sec-ecmascript-language-types-bigint-type), then
    1.  Return [BigInt::equal](#sec-numeric-types-bigint-equal)(`x`, `y`).
4.  If `x` [is a String](#sec-ecmascript-language-types-string-type), then
    1.  If `x` and `y` have the same length and the same code units in the same positions, return true; otherwise, return false.
5.  If `x` [is a Boolean](#sec-ecmascript-language-types-boolean-type), then
    1.  If `x` and `y` are both true or both false, return true; otherwise, return false.
6.  NOTE: All other [ECMAScript language values](#sec-ecmascript-language-types) are compared by identity.
7.  If `x` is `y`, return true; otherwise, return false.

Note 1

For expository purposes, some cases are handled separately within this algorithm even if it is unnecessary to do so.

Note 2

The specifics of what "`x` is `y`" means are detailed in [5.2.7](#sec-identity).

### 7.2.12 IsLessThan ( `x`, `y`, `LeftFirst` )

The abstract operation IsLessThan takes arguments `x` (an [ECMAScript language value](#sec-ecmascript-language-types)), `y` (an [ECMAScript language value](#sec-ecmascript-language-types)), and `LeftFirst` (a Boolean) and returns either a [normal completion containing](#sec-completion-record-specification-type) either a Boolean or undefined, or a [throw completion](#sec-completion-record-specification-type). It provides the semantics for the comparison `x` \< `y`, returning true, false, or undefined (which indicates that at least one operand is NaN). The `LeftFirst` flag is used to control the order in which operations with potentially visible side-effects are performed upon `x` and `y`. It is necessary because ECMAScript specifies left to right evaluation of expressions. If `LeftFirst` is true, the `x` parameter corresponds to an expression that occurs to the left of the `y` parameter's corresponding expression. If `LeftFirst` is false, the reverse is the case and operations must be performed upon `y` before `x`. It performs the following steps when called:

1.  If `LeftFirst` is true, then
    1.  Let `px` be ? [ToPrimitive](#sec-toprimitive)(`x`, number).
    2.  Let `py` be ? [ToPrimitive](#sec-toprimitive)(`y`, number).
2.  Else,
    1.  NOTE: The order of evaluation needs to be reversed to preserve left to right evaluation.
    2.  Let `py` be ? [ToPrimitive](#sec-toprimitive)(`y`, number).
    3.  Let `px` be ? [ToPrimitive](#sec-toprimitive)(`x`, number).
3.  If `px` [is a String](#sec-ecmascript-language-types-string-type) and `py` [is a String](#sec-ecmascript-language-types-string-type), then
    1.  Let `lx` be the length of `px`.
    2.  Let `ly` be the length of `py`.
    3.  For each [integer](#integer) `i` such that 0 ≤ `i` \< [min](#eqn-min)(`lx`, `ly`), in ascending order, do
        1.  Let `cx` be the numeric value of the code unit at index `i` within `px`.
        2.  Let `cy` be the numeric value of the code unit at index `i` within `py`.
        3.  If `cx` \< `cy`, return true.
        4.  If `cx` \> `cy`, return false.
    4.  If `lx` \< `ly`, return true. Otherwise, return false.
4.  Else,
    1.  If `px` [is a BigInt](#sec-ecmascript-language-types-bigint-type) and `py` [is a String](#sec-ecmascript-language-types-string-type), then
        1.  Let `ny` be [StringToBigInt](#sec-stringtobigint)(`py`).
        2.  If `ny` is undefined, return undefined.
        3.  Return [BigInt::lessThan](#sec-numeric-types-bigint-lessThan)(`px`, `ny`).
    2.  If `px` [is a String](#sec-ecmascript-language-types-string-type) and `py` [is a BigInt](#sec-ecmascript-language-types-bigint-type), then
        1.  Let `nx` be [StringToBigInt](#sec-stringtobigint)(`px`).
        2.  If `nx` is undefined, return undefined.
        3.  Return [BigInt::lessThan](#sec-numeric-types-bigint-lessThan)(`nx`, `py`).
    3.  NOTE: Because `px` and `py` are primitive values, evaluation order is not important.
    4.  Let `nx` be ? [ToNumeric](#sec-tonumeric)(`px`).
    5.  Let `ny` be ? [ToNumeric](#sec-tonumeric)(`py`).
    6.  If [SameType](#sec-sametype)(`nx`, `ny`) is true, then
        1.  If `nx` [is a Number](#sec-ecmascript-language-types-number-type), then
            1.  Return [Number::lessThan](#sec-numeric-types-number-lessThan)(`nx`, `ny`).
        2.  Else,
            1.  [Assert](#assert): `nx` [is a BigInt](#sec-ecmascript-language-types-bigint-type).
            2.  Return [BigInt::lessThan](#sec-numeric-types-bigint-lessThan)(`nx`, `ny`).
    7.  [Assert](#assert): `nx` [is a BigInt](#sec-ecmascript-language-types-bigint-type) and `ny` [is a Number](#sec-ecmascript-language-types-number-type), or `nx` [is a Number](#sec-ecmascript-language-types-number-type) and `ny` [is a BigInt](#sec-ecmascript-language-types-bigint-type).
    8.  If `nx` or `ny` is NaN, return undefined.
    9.  If `nx` is -∞_(𝔽) or `ny` is +∞_(𝔽), return true.
    10. If `nx` is +∞_(𝔽) or `ny` is -∞_(𝔽), return false.
    11. If [ℝ](#ℝ)(`nx`) \< [ℝ](#ℝ)(`ny`), return true; otherwise return false.

Note 1

Step [3](#step-arc-string-check) differs from step [1.c](#step-binary-op-string-check) in the algorithm that handles the addition operator `+` ([13.15.3](#sec-applystringornumericbinaryoperator)) by using the logical-and operation instead of the logical-or operation.

Note 2

The comparison of Strings uses a simple lexicographic ordering on sequences of UTF-16 code unit values. There is no attempt to use the more complex, semantically oriented definitions of character or string equality and collating order defined in the Unicode specification. Therefore String values that are canonically equal according to the Unicode Standard but not in the same normalization form could test as unequal. Also note that lexicographic ordering by *code unit* differs from ordering by *code point* for Strings containing [surrogate pairs](#surrogate-pair).

### 7.2.13 IsLooselyEqual ( `x`, `y` )

The abstract operation IsLooselyEqual takes arguments `x` (an [ECMAScript language value](#sec-ecmascript-language-types)) and `y` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a Boolean or a [throw completion](#sec-completion-record-specification-type). It provides the semantics for the `==` operator. It performs the following steps when called:

1.  If [SameType](#sec-sametype)(`x`, `y`) is true, then
    1.  Return [IsStrictlyEqual](#sec-isstrictlyequal)(`x`, `y`).
2.  If `x` is null and `y` is undefined, return true.
3.  If `x` is undefined and `y` is null, return true.
4.  NOTE: This step is replaced in section [B.3.6.2](#sec-IsHTMLDDA-internal-slot-aec).
5.  If `x` [is a Number](#sec-ecmascript-language-types-number-type) and `y` [is a String](#sec-ecmascript-language-types-string-type), return ! [IsLooselyEqual](#sec-islooselyequal)(`x`, ! [ToNumber](#sec-tonumber)(`y`)).
6.  If `x` [is a String](#sec-ecmascript-language-types-string-type) and `y` [is a Number](#sec-ecmascript-language-types-number-type), return ! [IsLooselyEqual](#sec-islooselyequal)(! [ToNumber](#sec-tonumber)(`x`), `y`).
7.  If `x` [is a BigInt](#sec-ecmascript-language-types-bigint-type) and `y` [is a String](#sec-ecmascript-language-types-string-type), then
    1.  Let `n` be [StringToBigInt](#sec-stringtobigint)(`y`).
    2.  If `n` is undefined, return false.
    3.  Return ! [IsLooselyEqual](#sec-islooselyequal)(`x`, `n`).
8.  If `x` [is a String](#sec-ecmascript-language-types-string-type) and `y` [is a BigInt](#sec-ecmascript-language-types-bigint-type), return ! [IsLooselyEqual](#sec-islooselyequal)(`y`, `x`).
9.  If `x` [is a Boolean](#sec-ecmascript-language-types-boolean-type), return ! [IsLooselyEqual](#sec-islooselyequal)(! [ToNumber](#sec-tonumber)(`x`), `y`).
10. If `y` [is a Boolean](#sec-ecmascript-language-types-boolean-type), return ! [IsLooselyEqual](#sec-islooselyequal)(`x`, ! [ToNumber](#sec-tonumber)(`y`)).
11. If `x` is either a String, a Number, a BigInt, or a Symbol and `y` [is an Object](#sec-object-type), return ! [IsLooselyEqual](#sec-islooselyequal)(`x`, ? [ToPrimitive](#sec-toprimitive)(`y`)).
12. If `x` [is an Object](#sec-object-type) and `y` is either a String, a Number, a BigInt, or a Symbol, return ! [IsLooselyEqual](#sec-islooselyequal)(? [ToPrimitive](#sec-toprimitive)(`x`), `y`).
13. If `x` [is a BigInt](#sec-ecmascript-language-types-bigint-type) and `y` [is a Number](#sec-ecmascript-language-types-number-type), or if `x` [is a Number](#sec-ecmascript-language-types-number-type) and `y` [is a BigInt](#sec-ecmascript-language-types-bigint-type), then
    1.  If `x` is not [finite](#finite) or `y` is not [finite](#finite), return false.
    2.  If [ℝ](#ℝ)(`x`) = [ℝ](#ℝ)(`y`), return true; otherwise return false.
14. Return false.

### 7.2.14 IsStrictlyEqual ( `x`, `y` )

The abstract operation IsStrictlyEqual takes arguments `x` (an [ECMAScript language value](#sec-ecmascript-language-types)) and `y` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns a Boolean. It provides the semantics for the `===` operator. It performs the following steps when called:

1.  If [SameType](#sec-sametype)(`x`, `y`) is false, return false.
2.  If `x` [is a Number](#sec-ecmascript-language-types-number-type), then
    1.  Return [Number::equal](#sec-numeric-types-number-equal)(`x`, `y`).
3.  Return [SameValueNonNumber](#sec-samevaluenonnumber)(`x`, `y`).

Note

This algorithm differs from the [SameValue](#sec-samevalue) Algorithm in its treatment of signed zeroes and NaNs.

## 7.3 Operations on Objects

### 7.3.1 MakeBasicObject ( `internalSlotsList` )

The abstract operation MakeBasicObject takes argument `internalSlotsList` (a [List](#sec-list-and-record-specification-type) of internal slot names) and returns an Object. It is the source of all ECMAScript objects that are created algorithmically, including both [ordinary objects](#ordinary-object) and [exotic objects](#exotic-object). It factors out common steps used in creating all objects, and centralizes object creation. It performs the following steps when called:

1.  Set `internalSlotsList` to the [list-concatenation](#list-concatenation) of `internalSlotsList` and « `[[PrivateElements]]` ».
2.  Let `obj` be a newly created object with an internal slot for each name in `internalSlotsList`.
3.  NOTE: As described in [Object Internal Methods and Internal Slots](#sec-object-internal-methods-and-internal-slots), the initial value of each such internal slot is undefined unless specified otherwise.
4.  Set `obj`.`[[PrivateElements]]` to a new empty [List](#sec-list-and-record-specification-type).
5.  Set `obj`'s essential internal methods to the default [ordinary object](#ordinary-object) definitions specified in [10.1](#sec-ordinary-object-internal-methods-and-internal-slots).
6.  [Assert](#assert): If the caller will not be overriding both `obj`'s `[[GetPrototypeOf]]` and `[[SetPrototypeOf]]` essential internal methods, then `internalSlotsList` contains `[[Prototype]]`.
7.  [Assert](#assert): If the caller will not be overriding all of `obj`'s `[[SetPrototypeOf]]`, `[[IsExtensible]]`, and `[[PreventExtensions]]` essential internal methods, then `internalSlotsList` contains `[[Extensible]]`.
8.  If `internalSlotsList` contains `[[Extensible]]`, set `obj`.`[[Extensible]]` to true.
9.  Return `obj`.

Note

Within this specification, [exotic objects](#exotic-object) are created in [abstract operations](#sec-algorithm-conventions-abstract-operations) such as [ArrayCreate](#sec-arraycreate) and [BoundFunctionCreate](#sec-boundfunctioncreate) by first calling MakeBasicObject to obtain a basic, foundational object, and then overriding some or all of that object's internal methods. In order to encapsulate [exotic object](#exotic-object) creation, the object's essential internal methods are never modified outside those operations.

### 7.3.2 Get ( `O`, `P` )

The abstract operation Get takes arguments `O` (an Object) and `P` (a [property key](#property-key)) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [ECMAScript language value](#sec-ecmascript-language-types) or a [throw completion](#sec-completion-record-specification-type). It is used to retrieve the value of a specific property of an object. It performs the following steps when called:

1.  Return ? `O`.`[[Get]]`(`P`, `O`).

### 7.3.3 GetV ( `V`, `P` )

The abstract operation GetV takes arguments `V` (an [ECMAScript language value](#sec-ecmascript-language-types)) and `P` (a [property key](#property-key)) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [ECMAScript language value](#sec-ecmascript-language-types) or a [throw completion](#sec-completion-record-specification-type). It is used to retrieve the value of a specific property of an [ECMAScript language value](#sec-ecmascript-language-types). If the value is not an object, the property lookup is performed using a wrapper object appropriate for the type of the value. It performs the following steps when called:

1.  Let `O` be ? [ToObject](#sec-toobject)(`V`).
2.  Return ? `O`.`[[Get]]`(`P`, `V`).

### 7.3.4 Set ( `O`, `P`, `V`, `Throw` )

The abstract operation Set takes arguments `O` (an Object), `P` (a [property key](#property-key)), `V` (an [ECMAScript language value](#sec-ecmascript-language-types)), and `Throw` (a Boolean) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or a [throw completion](#sec-completion-record-specification-type). It is used to set the value of a specific property of an object. `V` is the new value for the property. It performs the following steps when called:

1.  Let `success` be ? `O`.`[[Set]]`(`P`, `V`, `O`).
2.  If `success` is false and `Throw` is true, throw a TypeError exception.
3.  Return unused.

### 7.3.5 CreateDataProperty ( `O`, `P`, `V` )

The abstract operation CreateDataProperty takes arguments `O` (an Object), `P` (a [property key](#property-key)), and `V` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a Boolean or a [throw completion](#sec-completion-record-specification-type). It is used to create a new own property of an object. It performs the following steps when called:

1.  Let `newDesc` be the PropertyDescriptor { `[[Value]]`: `V`, `[[Writable]]`: true, `[[Enumerable]]`: true, `[[Configurable]]`: true }.
2.  Return ? `O`.`[[DefineOwnProperty]]`(`P`, `newDesc`).

Note

This abstract operation creates a property whose attributes are set to the same defaults used for properties created by the ECMAScript language assignment operator. Normally, the property will not already exist. If it does exist and is not configurable or if `O` is not extensible, `[[DefineOwnProperty]]` will return false.

### 7.3.6 CreateDataPropertyOrThrow ( `O`, `P`, `V` )

The abstract operation CreateDataPropertyOrThrow takes arguments `O` (an Object), `P` (a [property key](#property-key)), and `V` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or a [throw completion](#sec-completion-record-specification-type). It is used to create a new own property of an object. It throws a TypeError exception if the requested property update cannot be performed. It performs the following steps when called:

1.  Let `success` be ? [CreateDataProperty](#sec-createdataproperty)(`O`, `P`, `V`).
2.  If `success` is false, throw a TypeError exception.
3.  Return unused.

Note

This abstract operation creates a property whose attributes are set to the same defaults used for properties created by the ECMAScript language assignment operator. Normally, the property will not already exist. If it does exist and is not configurable or if `O` is not extensible, `[[DefineOwnProperty]]` will return false causing this operation to throw a TypeError exception.

### 7.3.7 CreateNonEnumerableDataPropertyOrThrow ( `O`, `P`, `V` )

The abstract operation CreateNonEnumerableDataPropertyOrThrow takes arguments `O` (an Object), `P` (a [property key](#property-key)), and `V` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns unused. It is used to create a new non-enumerable own property of an [ordinary object](#ordinary-object). It performs the following steps when called:

1.  [Assert](#assert): `O` is an ordinary, extensible object with no non-configurable properties.
2.  Let `newDesc` be the PropertyDescriptor { `[[Value]]`: `V`, `[[Writable]]`: true, `[[Enumerable]]`: false, `[[Configurable]]`: true }.
3.  Perform ! [DefinePropertyOrThrow](#sec-definepropertyorthrow)(`O`, `P`, `newDesc`).
4.  Return unused.

Note

This abstract operation creates a property whose attributes are set to the same defaults used for properties created by the ECMAScript language assignment operator except it is not enumerable. Normally, the property will not already exist. If it does exist, [DefinePropertyOrThrow](#sec-definepropertyorthrow) is guaranteed to complete normally.

### 7.3.8 DefinePropertyOrThrow ( `O`, `P`, `desc` )

The abstract operation DefinePropertyOrThrow takes arguments `O` (an Object), `P` (a [property key](#property-key)), and `desc` (a [Property Descriptor](#sec-property-descriptor-specification-type)) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or a [throw completion](#sec-completion-record-specification-type). It is used to call the `[[DefineOwnProperty]]` internal method of an object in a manner that will throw a TypeError exception if the requested property update cannot be performed. It performs the following steps when called:

1.  Let `success` be ? `O`.`[[DefineOwnProperty]]`(`P`, `desc`).
2.  If `success` is false, throw a TypeError exception.
3.  Return unused.

### 7.3.9 DeletePropertyOrThrow ( `O`, `P` )

The abstract operation DeletePropertyOrThrow takes arguments `O` (an Object) and `P` (a [property key](#property-key)) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or a [throw completion](#sec-completion-record-specification-type). It is used to remove a specific own property of an object. It throws an exception if the property is not configurable. It performs the following steps when called:

1.  Let `success` be ? `O`.`[[Delete]]`(`P`).
2.  If `success` is false, throw a TypeError exception.
3.  Return unused.

### 7.3.10 GetMethod ( `V`, `P` )

The abstract operation GetMethod takes arguments `V` (an [ECMAScript language value](#sec-ecmascript-language-types)) and `P` (a [property key](#property-key)) and returns either a [normal completion containing](#sec-completion-record-specification-type) either a [function object](#function-object) or undefined, or a [throw completion](#sec-completion-record-specification-type). It is used to get the value of a specific property of an [ECMAScript language value](#sec-ecmascript-language-types) when the value of the property is expected to be a function. It performs the following steps when called:

1.  Let `func` be ? [GetV](#sec-getv)(`V`, `P`).
2.  If `func` is either undefined or null, return undefined.
3.  If [IsCallable](#sec-iscallable)(`func`) is false, throw a TypeError exception.
4.  Return `func`.

### 7.3.11 HasProperty ( `O`, `P` )

The abstract operation HasProperty takes arguments `O` (an Object) and `P` (a [property key](#property-key)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a Boolean or a [throw completion](#sec-completion-record-specification-type). It is used to determine whether an object has a property with the specified [property key](#property-key). The property may be either own or inherited. It performs the following steps when called:

1.  Return ? `O`.`[[HasProperty]]`(`P`).

### 7.3.12 HasOwnProperty ( `O`, `P` )

The abstract operation HasOwnProperty takes arguments `O` (an Object) and `P` (a [property key](#property-key)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a Boolean or a [throw completion](#sec-completion-record-specification-type). It is used to determine whether an object has an own property with the specified [property key](#property-key). It performs the following steps when called:

1.  Let `desc` be ? `O`.`[[GetOwnProperty]]`(`P`).
2.  If `desc` is undefined, return false.
3.  Return true.

### 7.3.13 Call ( `F`, `V` \[ , `argumentsList` \] )

The abstract operation Call takes arguments `F` (an [ECMAScript language value](#sec-ecmascript-language-types)) and `V` (an [ECMAScript language value](#sec-ecmascript-language-types)) and optional argument `argumentsList` (a [List](#sec-list-and-record-specification-type) of [ECMAScript language values](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [ECMAScript language value](#sec-ecmascript-language-types) or a [throw completion](#sec-completion-record-specification-type). It is used to call the `[[Call]]` internal method of a [function object](#function-object). `F` is the [function object](#function-object), `V` is an [ECMAScript language value](#sec-ecmascript-language-types) that is the this value of the `[[Call]]`, and `argumentsList` is the value passed to the corresponding argument of the internal method. If `argumentsList` is not present, a new empty [List](#sec-list-and-record-specification-type) is used as its value. It performs the following steps when called:

1.  If `argumentsList` is not present, set `argumentsList` to a new empty [List](#sec-list-and-record-specification-type).
2.  If [IsCallable](#sec-iscallable)(`F`) is false, throw a TypeError exception.
3.  Return ? `F`.`[[Call]]`(`V`, `argumentsList`).

### 7.3.14 Construct ( `F` \[ , `argumentsList` \[ , `newTarget` \] \] )

The abstract operation Construct takes argument `F` (a [constructor](#constructor)) and optional arguments `argumentsList` (a [List](#sec-list-and-record-specification-type) of [ECMAScript language values](#sec-ecmascript-language-types)) and `newTarget` (a [constructor](#constructor)) and returns either a [normal completion containing](#sec-completion-record-specification-type) an Object or a [throw completion](#sec-completion-record-specification-type). It is used to call the `[[Construct]]` internal method of a [function object](#function-object). `argumentsList` and `newTarget` are the values to be passed as the corresponding arguments of the internal method. If `argumentsList` is not present, a new empty [List](#sec-list-and-record-specification-type) is used as its value. If `newTarget` is not present, `F` is used as its value. It performs the following steps when called:

1.  If `newTarget` is not present, set `newTarget` to `F`.
2.  If `argumentsList` is not present, set `argumentsList` to a new empty [List](#sec-list-and-record-specification-type).
3.  Return ? `F`.`[[Construct]]`(`argumentsList`, `newTarget`).

Note

If `newTarget` is not present, this operation is equivalent to: `new F(...argumentsList)`

### 7.3.15 SetIntegrityLevel ( `O`, `level` )

The abstract operation SetIntegrityLevel takes arguments `O` (an Object) and `level` (sealed or frozen) and returns either a [normal completion containing](#sec-completion-record-specification-type) a Boolean or a [throw completion](#sec-completion-record-specification-type). It is used to fix the set of own properties of an object. It performs the following steps when called:

1.  Let `status` be ? `O`.`[[PreventExtensions]]`().
2.  If `status` is false, return false.
3.  Let `keys` be ? `O`.`[[OwnPropertyKeys]]`().
4.  If `level` is sealed, then
    1.  For each element `k` of `keys`, do
        1.  Perform ? [DefinePropertyOrThrow](#sec-definepropertyorthrow)(`O`, `k`, PropertyDescriptor { `[[Configurable]]`: false }).
5.  Else,
    1.  [Assert](#assert): `level` is frozen.
    2.  For each element `k` of `keys`, do
        1.  Let `currentDesc` be ? `O`.`[[GetOwnProperty]]`(`k`).
        2.  If `currentDesc` is not undefined, then
            1.  If [IsAccessorDescriptor](#sec-isaccessordescriptor)(`currentDesc`) is true, then
                1.  Let `desc` be the PropertyDescriptor { `[[Configurable]]`: false }.
            2.  Else,
                1.  Let `desc` be the PropertyDescriptor { `[[Configurable]]`: false, `[[Writable]]`: false }.
            3.  Perform ? [DefinePropertyOrThrow](#sec-definepropertyorthrow)(`O`, `k`, `desc`).
6.  Return true.

### 7.3.16 TestIntegrityLevel ( `O`, `level` )

The abstract operation TestIntegrityLevel takes arguments `O` (an Object) and `level` (sealed or frozen) and returns either a [normal completion containing](#sec-completion-record-specification-type) a Boolean or a [throw completion](#sec-completion-record-specification-type). It is used to determine if the set of own properties of an object are fixed. It performs the following steps when called:

1.  Let `extensible` be ? [IsExtensible](#sec-isextensible-o)(`O`).
2.  If `extensible` is true, return false.
3.  NOTE: If the object is extensible, none of its properties are examined.
4.  Let `keys` be ? `O`.`[[OwnPropertyKeys]]`().
5.  For each element `k` of `keys`, do
    1.  Let `currentDesc` be ? `O`.`[[GetOwnProperty]]`(`k`).
    2.  If `currentDesc` is not undefined, then
        1.  If `currentDesc`.`[[Configurable]]` is true, return false.
        2.  If `level` is frozen and [IsDataDescriptor](#sec-isdatadescriptor)(`currentDesc`) is true, then
            1.  If `currentDesc`.`[[Writable]]` is true, return false.
6.  Return true.

### 7.3.17 CreateArrayFromList ( `elements` )

The abstract operation CreateArrayFromList takes argument `elements` (a [List](#sec-list-and-record-specification-type) of [ECMAScript language values](#sec-ecmascript-language-types)) and returns an Array. It is used to create an Array whose elements are provided by `elements`. It performs the following steps when called:

1.  Let `array` be ! [ArrayCreate](#sec-arraycreate)(0).
2.  Let `n` be 0.
3.  For each element `e` of `elements`, do
    1.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`array`, ! [ToString](#sec-tostring)([𝔽](#𝔽)(`n`)), `e`).
    2.  Set `n` to `n` + 1.
4.  Return `array`.

### 7.3.18 LengthOfArrayLike ( `obj` )

The abstract operation LengthOfArrayLike takes argument `obj` (an Object) and returns either a [normal completion containing](#sec-completion-record-specification-type) a non-negative [integer](#integer) or a [throw completion](#sec-completion-record-specification-type). It returns the value of the "length" property of an array-like object. It performs the following steps when called:

1.  Return [ℝ](#ℝ)(? [ToLength](#sec-tolength)(? [Get](#sec-get-o-p)(`obj`, "length"))).

An array-like object is any object for which this operation returns a [normal completion](#sec-completion-record-specification-type).

Note 1

Typically, an array-like object would also have some properties with [integer index](#integer-index) names. However, that is not a requirement of this definition.

Note 2

Arrays and String objects are examples of array-like objects.

### 7.3.19 CreateListFromArrayLike ( `obj` \[ , `validElementTypes` \] )

The abstract operation CreateListFromArrayLike takes argument `obj` (an [ECMAScript language value](#sec-ecmascript-language-types)) and optional argument `validElementTypes` (all or property-key) and returns either a [normal completion containing](#sec-completion-record-specification-type) a [List](#sec-list-and-record-specification-type) of [ECMAScript language values](#sec-ecmascript-language-types) or a [throw completion](#sec-completion-record-specification-type). It is used to create a [List](#sec-list-and-record-specification-type) value whose elements are provided by the indexed properties of `obj`. `validElementTypes` indicates the types of values that are allowed as elements. It performs the following steps when called:

1.  If `validElementTypes` is not present, set `validElementTypes` to all.
2.  If `obj` [is not an Object](#sec-object-type), throw a TypeError exception.
3.  Let `len` be ? [LengthOfArrayLike](#sec-lengthofarraylike)(`obj`).
4.  Let `list` be a new empty [List](#sec-list-and-record-specification-type).
5.  Let `index` be 0.
6.  Repeat, while `index` \< `len`,
    1.  Let `indexName` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`index`)).
    2.  Let `next` be ? [Get](#sec-get-o-p)(`obj`, `indexName`).
    3.  If `validElementTypes` is property-key and `next` is not a [property key](#property-key), throw a TypeError exception.
    4.  Append `next` to `list`.
    5.  Set `index` to `index` + 1.
7.  Return `list`.

### 7.3.20 Invoke ( `V`, `P` \[ , `argumentsList` \] )

The abstract operation Invoke takes arguments `V` (an [ECMAScript language value](#sec-ecmascript-language-types)) and `P` (a [property key](#property-key)) and optional argument `argumentsList` (a [List](#sec-list-and-record-specification-type) of [ECMAScript language values](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [ECMAScript language value](#sec-ecmascript-language-types) or a [throw completion](#sec-completion-record-specification-type). It is used to call a method property of an [ECMAScript language value](#sec-ecmascript-language-types). `V` serves as both the lookup point for the property and the this value of the call. `argumentsList` is the list of arguments values passed to the method. If `argumentsList` is not present, a new empty [List](#sec-list-and-record-specification-type) is used as its value. It performs the following steps when called:

1.  If `argumentsList` is not present, set `argumentsList` to a new empty [List](#sec-list-and-record-specification-type).
2.  Let `func` be ? [GetV](#sec-getv)(`V`, `P`).
3.  Return ? [Call](#sec-call)(`func`, `V`, `argumentsList`).

### 7.3.21 OrdinaryHasInstance ( `C`, `O` )

The abstract operation OrdinaryHasInstance takes arguments `C` (an [ECMAScript language value](#sec-ecmascript-language-types)) and `O` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a Boolean or a [throw completion](#sec-completion-record-specification-type). It implements the default algorithm for determining if `O` inherits from the instance object inheritance path provided by `C`. It performs the following steps when called:

1.  If [IsCallable](#sec-iscallable)(`C`) is false, return false.
2.  If `C` has a `[[BoundTargetFunction]]` internal slot, then
    1.  Let `BC` be `C`.`[[BoundTargetFunction]]`.
    2.  Return ? [InstanceofOperator](#sec-instanceofoperator)(`O`, `BC`).
3.  If `O` [is not an Object](#sec-object-type), return false.
4.  Let `P` be ? [Get](#sec-get-o-p)(`C`, "prototype").
5.  If `P` [is not an Object](#sec-object-type), throw a TypeError exception.
6.  Repeat,
    1.  Set `O` to ? `O`.`[[GetPrototypeOf]]`().
    2.  If `O` is null, return false.
    3.  If [SameValue](#sec-samevalue)(`P`, `O`) is true, return true.

### 7.3.22 SpeciesConstructor ( `O`, `defaultConstructor` )

The abstract operation SpeciesConstructor takes arguments `O` (an Object) and `defaultConstructor` (a [constructor](#constructor)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a [constructor](#constructor) or a [throw completion](#sec-completion-record-specification-type). It is used to retrieve the [constructor](#constructor) that should be used to create new objects that are derived from `O`. `defaultConstructor` is the [constructor](#constructor) to use if a [constructor](#constructor) [%Symbol.species%](#sec-well-known-symbols) property cannot be found starting from `O`. It performs the following steps when called:

1.  Let `C` be ? [Get](#sec-get-o-p)(`O`, "constructor").
2.  If `C` is undefined, return `defaultConstructor`.
3.  If `C` [is not an Object](#sec-object-type), throw a TypeError exception.
4.  Let `S` be ? [Get](#sec-get-o-p)(`C`, [%Symbol.species%](#sec-well-known-symbols)).
5.  If `S` is either undefined or null, return `defaultConstructor`.
6.  If [IsConstructor](#sec-isconstructor)(`S`) is true, return `S`.
7.  Throw a TypeError exception.

### 7.3.23 EnumerableOwnProperties ( `O`, `kind` )

The abstract operation EnumerableOwnProperties takes arguments `O` (an Object) and `kind` (key, value, or key+value) and returns either a [normal completion containing](#sec-completion-record-specification-type) a [List](#sec-list-and-record-specification-type) of [ECMAScript language values](#sec-ecmascript-language-types) or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `ownKeys` be ? `O`.`[[OwnPropertyKeys]]`().
2.  Let `results` be a new empty [List](#sec-list-and-record-specification-type).
3.  For each element `key` of `ownKeys`, do
    1.  If `key` [is a String](#sec-ecmascript-language-types-string-type), then
        1.  Let `desc` be ? `O`.`[[GetOwnProperty]]`(`key`).
        2.  If `desc` is not undefined and `desc`.`[[Enumerable]]` is true, then
            1.  If `kind` is key, then
                1.  Append `key` to `results`.
            2.  Else,
                1.  Let `value` be ? [Get](#sec-get-o-p)(`O`, `key`).
                2.  If `kind` is value, then
                    1.  Append `value` to `results`.
                3.  Else,
                    1.  [Assert](#assert): `kind` is key+value.
                    2.  Let `entry` be [CreateArrayFromList](#sec-createarrayfromlist)(« `key`, `value` »).
                    3.  Append `entry` to `results`.
4.  Return `results`.

### 7.3.24 GetFunctionRealm ( `obj` )

The abstract operation GetFunctionRealm takes argument `obj` (a [function object](#function-object)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a [Realm Record](#realm-record) or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  If `obj` has a `[[Realm]]` internal slot, then
    1.  Return `obj`.`[[Realm]]`.
2.  If `obj` is a [bound function exotic object](#bound-function-exotic-object), then
    1.  Let `boundTargetFunction` be `obj`.`[[BoundTargetFunction]]`.
    2.  Return ? [GetFunctionRealm](#sec-getfunctionrealm)(`boundTargetFunction`).
3.  If `obj` is a [Proxy exotic object](#proxy-exotic-object), then
    1.  Perform ? [ValidateNonRevokedProxy](#sec-validatenonrevokedproxy)(`obj`).
    2.  Let `proxyTarget` be `obj`.`[[ProxyTarget]]`.
    3.  [Assert](#assert): `proxyTarget` is a [function object](#function-object).
    4.  Return ? [GetFunctionRealm](#sec-getfunctionrealm)(`proxyTarget`).
4.  Return [the current Realm Record](#current-realm).

Note

Step [4](#step-getfunctionrealm-default-return) will only be reached if `obj` is a non-standard function [exotic object](#exotic-object) that does not have a `[[Realm]]` internal slot.

### 7.3.25 CopyDataProperties ( `target`, `source`, `excludedItems` )

The abstract operation CopyDataProperties takes arguments `target` (an Object), `source` (an [ECMAScript language value](#sec-ecmascript-language-types)), and `excludedItems` (a [List](#sec-list-and-record-specification-type) of [property keys](#property-key)) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  If `source` is either undefined or null, return unused.
2.  Let `from` be ! [ToObject](#sec-toobject)(`source`).
3.  Let `keys` be ? `from`.`[[OwnPropertyKeys]]`().
4.  For each element `nextKey` of `keys`, do
    1.  Let `excluded` be false.
    2.  For each element `e` of `excludedItems`, do
        1.  If [SameValue](#sec-samevalue)(`e`, `nextKey`) is true, then
            1.  Set `excluded` to true.
    3.  If `excluded` is false, then
        1.  Let `desc` be ? `from`.`[[GetOwnProperty]]`(`nextKey`).
        2.  If `desc` is not undefined and `desc`.`[[Enumerable]]` is true, then
            1.  Let `propValue` be ? [Get](#sec-get-o-p)(`from`, `nextKey`).
            2.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`target`, `nextKey`, `propValue`).
5.  Return unused.

Note

The target passed in here is always a newly created object which is not directly accessible in case of an error being thrown.

### 7.3.26 PrivateElementFind ( `O`, `P` )

The abstract operation PrivateElementFind takes arguments `O` (an Object) and `P` (a [Private Name](#sec-private-names)) and returns a [PrivateElement](#sec-privateelement-specification-type) or empty. It performs the following steps when called:

1.  If `O`.`[[PrivateElements]]` contains a [PrivateElement](#sec-privateelement-specification-type) `pe` such that `pe`.`[[Key]]` is `P`, then
    1.  Return `pe`.
2.  Return empty.

### 7.3.27 PrivateFieldAdd ( `O`, `P`, `value` )

The abstract operation PrivateFieldAdd takes arguments `O` (an Object), `P` (a [Private Name](#sec-private-names)), and `value` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  If the [host](#host) is a web browser, then
    1.  Perform ? [HostEnsureCanAddPrivateElement](#sec-hostensurecanaddprivateelement)(`O`).
2.  Let `entry` be [PrivateElementFind](#sec-privateelementfind)(`O`, `P`).
3.  If `entry` is not empty, throw a TypeError exception.
4.  Append [PrivateElement](#sec-privateelement-specification-type) { `[[Key]]`: `P`, `[[Kind]]`: field, `[[Value]]`: `value` } to `O`.`[[PrivateElements]]`.
5.  Return unused.

### 7.3.28 PrivateMethodOrAccessorAdd ( `O`, `method` )

The abstract operation PrivateMethodOrAccessorAdd takes arguments `O` (an Object) and `method` (a [PrivateElement](#sec-privateelement-specification-type)) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  [Assert](#assert): `method`.`[[Kind]]` is either method or accessor.
2.  If the [host](#host) is a web browser, then
    1.  Perform ? [HostEnsureCanAddPrivateElement](#sec-hostensurecanaddprivateelement)(`O`).
3.  Let `entry` be [PrivateElementFind](#sec-privateelementfind)(`O`, `method`.`[[Key]]`).
4.  If `entry` is not empty, throw a TypeError exception.
5.  Append `method` to `O`.`[[PrivateElements]]`.
6.  Return unused.

Note

The values for private methods and accessors are shared across instances. This operation does not create a new copy of the method or accessor.

### 7.3.29 HostEnsureCanAddPrivateElement ( `O` )

The [host-defined](#host-defined) abstract operation HostEnsureCanAddPrivateElement takes argument `O` (an Object) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or a [throw completion](#sec-completion-record-specification-type). It allows [host environments](#host-environment) to prevent the addition of private elements to particular [host-defined](#host-defined) [exotic objects](#exotic-object).

An implementation of HostEnsureCanAddPrivateElement must conform to the following requirements:

- If `O` is not a [host-defined](#host-defined) [exotic object](#exotic-object), this abstract operation must return [NormalCompletion](#sec-normalcompletion)(unused) and perform no other steps.
- Any two calls of this abstract operation with the same argument must return the same kind of [Completion Record](#sec-completion-record-specification-type).

The default implementation of HostEnsureCanAddPrivateElement is to return [NormalCompletion](#sec-normalcompletion)(unused).

This abstract operation is only invoked by ECMAScript [hosts](#host) that are web browsers.

### 7.3.30 PrivateGet ( `O`, `P` )

The abstract operation PrivateGet takes arguments `O` (an Object) and `P` (a [Private Name](#sec-private-names)) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [ECMAScript language value](#sec-ecmascript-language-types) or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `entry` be [PrivateElementFind](#sec-privateelementfind)(`O`, `P`).
2.  If `entry` is empty, throw a TypeError exception.
3.  If `entry`.`[[Kind]]` is either field or method, then
    1.  Return `entry`.`[[Value]]`.
4.  [Assert](#assert): `entry`.`[[Kind]]` is accessor.
5.  If `entry`.`[[Get]]` is undefined, throw a TypeError exception.
6.  Let `getter` be `entry`.`[[Get]]`.
7.  Return ? [Call](#sec-call)(`getter`, `O`).

### 7.3.31 PrivateSet ( `O`, `P`, `value` )

The abstract operation PrivateSet takes arguments `O` (an Object), `P` (a [Private Name](#sec-private-names)), and `value` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `entry` be [PrivateElementFind](#sec-privateelementfind)(`O`, `P`).
2.  If `entry` is empty, throw a TypeError exception.
3.  If `entry`.`[[Kind]]` is field, then
    1.  Set `entry`.`[[Value]]` to `value`.
4.  Else if `entry`.`[[Kind]]` is method, then
    1.  Throw a TypeError exception.
5.  Else,
    1.  [Assert](#assert): `entry`.`[[Kind]]` is accessor.
    2.  If `entry`.`[[Set]]` is undefined, throw a TypeError exception.
    3.  Let `setter` be `entry`.`[[Set]]`.
    4.  Perform ? [Call](#sec-call)(`setter`, `O`, « `value` »).
6.  Return unused.

### 7.3.32 DefineField ( `receiver`, `fieldRecord` )

The abstract operation DefineField takes arguments `receiver` (an Object) and `fieldRecord` (a [ClassFieldDefinition Record](#sec-classfielddefinition-record-specification-type)) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `fieldName` be `fieldRecord`.`[[Name]]`.
2.  Let `initializer` be `fieldRecord`.`[[Initializer]]`.
3.  If `initializer` is not empty, then
    1.  Let `initValue` be ? [Call](#sec-call)(`initializer`, `receiver`).
4.  Else,
    1.  Let `initValue` be undefined.
5.  If `fieldName` is a [Private Name](#sec-private-names), then
    1.  Perform ? [PrivateFieldAdd](#sec-privatefieldadd)(`receiver`, `fieldName`, `initValue`).
6.  Else,
    1.  [Assert](#assert): `fieldName` is a [property key](#property-key).
    2.  Perform ? [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`receiver`, `fieldName`, `initValue`).
7.  Return unused.

### 7.3.33 InitializeInstanceElements ( `O`, `constructor` )

The abstract operation InitializeInstanceElements takes arguments `O` (an Object) and `constructor` (an ECMAScript [function object](#function-object)) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `methods` be the value of `constructor`.`[[PrivateMethods]]`.
2.  For each [PrivateElement](#sec-privateelement-specification-type) `method` of `methods`, do
    1.  Perform ? [PrivateMethodOrAccessorAdd](#sec-privatemethodoraccessoradd)(`O`, `method`).
3.  Let `fields` be the value of `constructor`.`[[Fields]]`.
4.  For each element `fieldRecord` of `fields`, do
    1.  Perform ? [DefineField](#sec-definefield)(`O`, `fieldRecord`).
5.  Return unused.

### 7.3.34 AddValueToKeyedGroup ( `groups`, `key`, `value` )

The abstract operation AddValueToKeyedGroup takes arguments `groups` (a [List](#sec-list-and-record-specification-type) of [Records](#sec-list-and-record-specification-type) with fields `[[Key]]` (an [ECMAScript language value](#sec-ecmascript-language-types)) and `[[Elements]]` (a [List](#sec-list-and-record-specification-type) of [ECMAScript language values](#sec-ecmascript-language-types))), `key` (an [ECMAScript language value](#sec-ecmascript-language-types)), and `value` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns unused. It performs the following steps when called:

1.  For each [Record](#sec-list-and-record-specification-type) { `[[Key]]`, `[[Elements]]` } `g` of `groups`, do
    1.  If [SameValue](#sec-samevalue)(`g`.`[[Key]]`, `key`) is true, then
        1.  [Assert](#assert): Exactly one element of `groups` meets this criterion.
        2.  Append `value` to `g`.`[[Elements]]`.
        3.  Return unused.
2.  Let `group` be the [Record](#sec-list-and-record-specification-type) { `[[Key]]`: `key`, `[[Elements]]`: « `value` » }.
3.  Append `group` to `groups`.
4.  Return unused.

### 7.3.35 GroupBy ( `items`, `callback`, `keyCoercion` )

The abstract operation GroupBy takes arguments `items` (an [ECMAScript language value](#sec-ecmascript-language-types)), `callback` (an [ECMAScript language value](#sec-ecmascript-language-types)), and `keyCoercion` (property or collection) and returns either a [normal completion containing](#sec-completion-record-specification-type) a [List](#sec-list-and-record-specification-type) of [Records](#sec-list-and-record-specification-type) with fields `[[Key]]` (an [ECMAScript language value](#sec-ecmascript-language-types)) and `[[Elements]]` (a [List](#sec-list-and-record-specification-type) of [ECMAScript language values](#sec-ecmascript-language-types)), or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Perform ? [RequireObjectCoercible](#sec-requireobjectcoercible)(`items`).
2.  If [IsCallable](#sec-iscallable)(`callback`) is false, throw a TypeError exception.
3.  Let `groups` be a new empty [List](#sec-list-and-record-specification-type).
4.  Let `iteratorRecord` be ? [GetIterator](#sec-getiterator)(`items`, sync).
5.  Let `k` be 0.
6.  Repeat,
    1.  If `k` ≥ 2\*\*⁵³ - 1, then
        1.  Let `error` be [ThrowCompletion](#sec-throwcompletion)(a newly created TypeError object).
        2.  Return ? [IteratorClose](#sec-iteratorclose)(`iteratorRecord`, `error`).
    2.  Let `next` be ? [IteratorStepValue](#sec-iteratorstepvalue)(`iteratorRecord`).
    3.  If `next` is done, then
        1.  Return `groups`.
    4.  Let `value` be `next`.
    5.  Let `key` be [Completion](#sec-completion-ao)([Call](#sec-call)(`callback`, undefined, « `value`, [𝔽](#𝔽)(`k`) »)).
    6.  [IfAbruptCloseIterator](#sec-ifabruptcloseiterator)(`key`, `iteratorRecord`).
    7.  If `keyCoercion` is property, then
        1.  Set `key` to [Completion](#sec-completion-ao)([ToPropertyKey](#sec-topropertykey)(`key`)).
        2.  [IfAbruptCloseIterator](#sec-ifabruptcloseiterator)(`key`, `iteratorRecord`).
    8.  Else,
        1.  [Assert](#assert): `keyCoercion` is collection.
        2.  Set `key` to [CanonicalizeKeyedCollectionKey](#sec-canonicalizekeyedcollectionkey)(`key`).
    9.  Perform [AddValueToKeyedGroup](#sec-add-value-to-keyed-group)(`groups`, `key`, `value`).
    10. Set `k` to `k` + 1.

### 7.3.36 SetterThatIgnoresPrototypeProperties ( `thisValue`, `home`, `p`, `v` )

The abstract operation SetterThatIgnoresPrototypeProperties takes arguments `thisValue` (an [ECMAScript language value](#sec-ecmascript-language-types)), `home` (an Object), `p` (a [property key](#property-key)), and `v` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  If `thisValue` [is not an Object](#sec-object-type), then
    1.  Throw a TypeError exception.
2.  If [SameValue](#sec-samevalue)(`thisValue`, `home`) is true, then
    1.  NOTE: Throwing here emulates assignment to a non-writable [data property](#sec-object-type) on the `home` object in [strict mode code](#sec-strict-mode-code).
    2.  Throw a TypeError exception.
3.  Let `desc` be ? `thisValue`.`[[GetOwnProperty]]`(`p`).
4.  If `desc` is undefined, then
    1.  Perform ? [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`thisValue`, `p`, `v`).
5.  Else,
    1.  Perform ? [Set](#sec-set-o-p-v-throw)(`thisValue`, `p`, `v`, true).
6.  Return unused.

## 7.4 Operations on Iterator Objects

See Common Iteration Interfaces ([27.1](#sec-iteration)).

### 7.4.1 Iterator Records

An Iterator Record is a [Record](#sec-list-and-record-specification-type) value used to encapsulate an [iterator](#sec-iterator-interface) or [async iterator](#sec-asynciterator-interface) along with the `next` method.

Iterator Records have the fields listed in [Table 15](#table-iterator-record-fields).

| Field Name | Value | Meaning |
|----|----|----|
| `[[Iterator]]` | an Object | An object that conforms to the [iterator interface](#sec-iterator-interface) or the [async iterator interface](#sec-asynciterator-interface). |
| `[[NextMethod]]` | an [ECMAScript language value](#sec-ecmascript-language-types) | The `next` method of the `[[Iterator]]` object. |
| `[[Done]]` | a Boolean | Whether the [iterator](#sec-iterator-interface) has completed or been closed. |

Table 15: [Iterator Record](#sec-iterator-records) Fields

### 7.4.2 GetIteratorDirect ( `obj` )

The abstract operation GetIteratorDirect takes argument `obj` (an Object) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [Iterator Record](#sec-iterator-records) or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `nextMethod` be ? [Get](#sec-get-o-p)(`obj`, "next").
2.  Let `iteratorRecord` be the [Iterator Record](#sec-iterator-records) { `[[Iterator]]`: `obj`, `[[NextMethod]]`: `nextMethod`, `[[Done]]`: false }.
3.  Return `iteratorRecord`.

### 7.4.3 GetIteratorFromMethod ( `obj`, `method` )

The abstract operation GetIteratorFromMethod takes arguments `obj` (an [ECMAScript language value](#sec-ecmascript-language-types)) and `method` (a [function object](#function-object)) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [Iterator Record](#sec-iterator-records) or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `iterator` be ? [Call](#sec-call)(`method`, `obj`).
2.  If `iterator` [is not an Object](#sec-object-type), throw a TypeError exception.
3.  Return ? [GetIteratorDirect](#sec-getiteratordirect)(`iterator`).

### 7.4.4 GetIterator ( `obj`, `kind` )

The abstract operation GetIterator takes arguments `obj` (an [ECMAScript language value](#sec-ecmascript-language-types)) and `kind` (sync or async) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [Iterator Record](#sec-iterator-records) or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  If `kind` is async, then
    1.  Let `method` be ? [GetMethod](#sec-getmethod)(`obj`, [%Symbol.asyncIterator%](#sec-well-known-symbols)).
    2.  If `method` is undefined, then
        1.  Let `syncMethod` be ? [GetMethod](#sec-getmethod)(`obj`, [%Symbol.iterator%](#sec-well-known-symbols)).
        2.  If `syncMethod` is undefined, throw a TypeError exception.
        3.  Let `syncIteratorRecord` be ? [GetIteratorFromMethod](#sec-getiteratorfrommethod)(`obj`, `syncMethod`).
        4.  Return [CreateAsyncFromSyncIterator](#sec-createasyncfromsynciterator)(`syncIteratorRecord`).
2.  Else,
    1.  Let `method` be ? [GetMethod](#sec-getmethod)(`obj`, [%Symbol.iterator%](#sec-well-known-symbols)).
3.  If `method` is undefined, throw a TypeError exception.
4.  Return ? [GetIteratorFromMethod](#sec-getiteratorfrommethod)(`obj`, `method`).

### 7.4.5 GetIteratorFlattenable ( `obj`, `primitiveHandling` )

The abstract operation GetIteratorFlattenable takes arguments `obj` (an [ECMAScript language value](#sec-ecmascript-language-types)) and `primitiveHandling` (iterate-string-primitives or reject-primitives) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [Iterator Record](#sec-iterator-records) or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  If `obj` [is not an Object](#sec-object-type), then
    1.  If `primitiveHandling` is reject-primitives, throw a TypeError exception.
    2.  [Assert](#assert): `primitiveHandling` is iterate-string-primitives.
    3.  If `obj` [is not a String](#sec-ecmascript-language-types-string-type), throw a TypeError exception.
2.  Let `method` be ? [GetMethod](#sec-getmethod)(`obj`, [%Symbol.iterator%](#sec-well-known-symbols)).
3.  If `method` is undefined, then
    1.  Let `iterator` be `obj`.
4.  Else,
    1.  Let `iterator` be ? [Call](#sec-call)(`method`, `obj`).
5.  If `iterator` [is not an Object](#sec-object-type), throw a TypeError exception.
6.  Return ? [GetIteratorDirect](#sec-getiteratordirect)(`iterator`).

### 7.4.6 IteratorNext ( `iteratorRecord` \[ , `value` \] )

The abstract operation IteratorNext takes argument `iteratorRecord` (an [Iterator Record](#sec-iterator-records)) and optional argument `value` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) an Object or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  If `value` is not present, then
    1.  Let `result` be [Completion](#sec-completion-ao)([Call](#sec-call)(`iteratorRecord`.`[[NextMethod]]`, `iteratorRecord`.`[[Iterator]]`)).
2.  Else,
    1.  Let `result` be [Completion](#sec-completion-ao)([Call](#sec-call)(`iteratorRecord`.`[[NextMethod]]`, `iteratorRecord`.`[[Iterator]]`, « `value` »)).
3.  If `result` is a [throw completion](#sec-completion-record-specification-type), then
    1.  Set `iteratorRecord`.`[[Done]]` to true.
    2.  Return ? `result`.
4.  Set `result` to ! `result`.
5.  If `result` [is not an Object](#sec-object-type), then
    1.  Set `iteratorRecord`.`[[Done]]` to true.
    2.  Throw a TypeError exception.
6.  Return `result`.

### 7.4.7 IteratorComplete ( `iteratorResult` )

The abstract operation IteratorComplete takes argument `iteratorResult` (an Object) and returns either a [normal completion containing](#sec-completion-record-specification-type) a Boolean or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Return [ToBoolean](#sec-toboolean)(? [Get](#sec-get-o-p)(`iteratorResult`, "done")).

### 7.4.8 IteratorValue ( `iteratorResult` )

The abstract operation IteratorValue takes argument `iteratorResult` (an Object) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [ECMAScript language value](#sec-ecmascript-language-types) or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Return ? [Get](#sec-get-o-p)(`iteratorResult`, "value").

### 7.4.9 IteratorStep ( `iteratorRecord` )

The abstract operation IteratorStep takes argument `iteratorRecord` (an [Iterator Record](#sec-iterator-records)) and returns either a [normal completion containing](#sec-completion-record-specification-type) either an Object or done, or a [throw completion](#sec-completion-record-specification-type). It requests the next value from `iteratorRecord`.`[[Iterator]]` by calling `iteratorRecord`.`[[NextMethod]]` and returns either done indicating that the [iterator](#sec-iterator-interface) has reached its end or the [IteratorResult object](#sec-iteratorresult-interface) if a next value is available. It performs the following steps when called:

1.  Let `result` be ? [IteratorNext](#sec-iteratornext)(`iteratorRecord`).
2.  Let `done` be [Completion](#sec-completion-ao)([IteratorComplete](#sec-iteratorcomplete)(`result`)).
3.  If `done` is a [throw completion](#sec-completion-record-specification-type), then
    1.  Set `iteratorRecord`.`[[Done]]` to true.
    2.  Return ? `done`.
4.  Set `done` to ! `done`.
5.  If `done` is true, then
    1.  Set `iteratorRecord`.`[[Done]]` to true.
    2.  Return done.
6.  Return `result`.

### 7.4.10 IteratorStepValue ( `iteratorRecord` )

The abstract operation IteratorStepValue takes argument `iteratorRecord` (an [Iterator Record](#sec-iterator-records)) and returns either a [normal completion containing](#sec-completion-record-specification-type) either an [ECMAScript language value](#sec-ecmascript-language-types) or done, or a [throw completion](#sec-completion-record-specification-type). It requests the next value from `iteratorRecord`.`[[Iterator]]` by calling `iteratorRecord`.`[[NextMethod]]` and returns either done indicating that the [iterator](#sec-iterator-interface) has reached its end or the value from the [IteratorResult object](#sec-iteratorresult-interface) if a next value is available. It performs the following steps when called:

1.  Let `result` be ? [IteratorStep](#sec-iteratorstep)(`iteratorRecord`).
2.  If `result` is done, then
    1.  Return done.
3.  Let `value` be [Completion](#sec-completion-ao)([IteratorValue](#sec-iteratorvalue)(`result`)).
4.  If `value` is a [throw completion](#sec-completion-record-specification-type), then
    1.  Set `iteratorRecord`.`[[Done]]` to true.
5.  Return ? `value`.

### 7.4.11 IteratorClose ( `iteratorRecord`, `completion` )

The abstract operation IteratorClose takes arguments `iteratorRecord` (an [Iterator Record](#sec-iterator-records)) and `completion` (a [Completion Record](#sec-completion-record-specification-type)) and returns a [Completion Record](#sec-completion-record-specification-type). It is used to notify an [iterator](#sec-iterator-interface) that it should perform any actions it would normally perform when it has reached its completed state. It performs the following steps when called:

1.  [Assert](#assert): `iteratorRecord`.`[[Iterator]]` [is an Object](#sec-object-type).
2.  Let `iterator` be `iteratorRecord`.`[[Iterator]]`.
3.  Let `innerResult` be [Completion](#sec-completion-ao)([GetMethod](#sec-getmethod)(`iterator`, "return")).
4.  If `innerResult` is a [normal completion](#sec-completion-record-specification-type), then
    1.  Let `return` be `innerResult`.`[[Value]]`.
    2.  If `return` is undefined, return ? `completion`.
    3.  Set `innerResult` to [Completion](#sec-completion-ao)([Call](#sec-call)(`return`, `iterator`)).
5.  If `completion` is a [throw completion](#sec-completion-record-specification-type), return ? `completion`.
6.  If `innerResult` is a [throw completion](#sec-completion-record-specification-type), return ? `innerResult`.
7.  If `innerResult`.`[[Value]]` [is not an Object](#sec-object-type), throw a TypeError exception.
8.  Return ? `completion`.

### 7.4.12 IfAbruptCloseIterator ( `value`, `iteratorRecord` )

IfAbruptCloseIterator is a shorthand for a sequence of algorithm steps that use an [Iterator Record](#sec-iterator-records). An algorithm step of the form:

1.  [IfAbruptCloseIterator](#sec-ifabruptcloseiterator)(`value`, `iteratorRecord`).

means the same thing as:

1.  [Assert](#assert): `value` is a [Completion Record](#sec-completion-record-specification-type).
2.  If `value` is an [abrupt completion](#sec-completion-record-specification-type), return ? [IteratorClose](#sec-iteratorclose)(`iteratorRecord`, `value`).
3.  Else, set `value` to ! `value`.

### 7.4.13 AsyncIteratorClose ( `iteratorRecord`, `completion` )

The abstract operation AsyncIteratorClose takes arguments `iteratorRecord` (an [Iterator Record](#sec-iterator-records)) and `completion` (a [Completion Record](#sec-completion-record-specification-type)) and returns a [Completion Record](#sec-completion-record-specification-type). It is used to notify an [async iterator](#sec-asynciterator-interface) that it should perform any actions it would normally perform when it has reached its completed state. It performs the following steps when called:

1.  [Assert](#assert): `iteratorRecord`.`[[Iterator]]` [is an Object](#sec-object-type).
2.  Let `iterator` be `iteratorRecord`.`[[Iterator]]`.
3.  Let `innerResult` be [Completion](#sec-completion-ao)([GetMethod](#sec-getmethod)(`iterator`, "return")).
4.  If `innerResult` is a [normal completion](#sec-completion-record-specification-type), then
    1.  Let `return` be `innerResult`.`[[Value]]`.
    2.  If `return` is undefined, return ? `completion`.
    3.  Set `innerResult` to [Completion](#sec-completion-ao)([Call](#sec-call)(`return`, `iterator`)).
    4.  If `innerResult` is a [normal completion](#sec-completion-record-specification-type), set `innerResult` to [Completion](#sec-completion-ao)([Await](#await)(`innerResult`.`[[Value]]`)).
5.  If `completion` is a [throw completion](#sec-completion-record-specification-type), return ? `completion`.
6.  If `innerResult` is a [throw completion](#sec-completion-record-specification-type), return ? `innerResult`.
7.  If `innerResult`.`[[Value]]` [is not an Object](#sec-object-type), throw a TypeError exception.
8.  Return ? `completion`.

### 7.4.14 CreateIteratorResultObject ( `value`, `done` )

The abstract operation CreateIteratorResultObject takes arguments `value` (an [ECMAScript language value](#sec-ecmascript-language-types)) and `done` (a Boolean) and returns an Object that conforms to the [IteratorResult interface](#sec-iteratorresult-interface). It creates an object that conforms to the [IteratorResult interface](#sec-iteratorresult-interface). It performs the following steps when called:

1.  Let `obj` be [OrdinaryObjectCreate](#sec-ordinaryobjectcreate)([%Object.prototype%](#sec-properties-of-the-object-prototype-object)).
2.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`obj`, "value", `value`).
3.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`obj`, "done", `done`).
4.  Return `obj`.

### 7.4.15 CreateListIteratorRecord ( `list` )

The abstract operation CreateListIteratorRecord takes argument `list` (a [List](#sec-list-and-record-specification-type) of [ECMAScript language values](#sec-ecmascript-language-types)) and returns an [Iterator Record](#sec-iterator-records). It creates an [Iterator Record](#sec-iterator-records) whose `[[NextMethod]]` returns the successive elements of `list`. It performs the following steps when called:

1.  Let `closure` be a new [Abstract Closure](#sec-abstract-closure) with no parameters that captures `list` and performs the following steps when called:
    1.  For each element `E` of `list`, do
        1.  Perform ? [GeneratorYield](#sec-generatoryield)([CreateIteratorResultObject](#sec-createiterresultobject)(`E`, false)).
    2.  Return [NormalCompletion](#sec-normalcompletion)(undefined).
2.  Let `iterator` be [CreateIteratorFromClosure](#sec-createiteratorfromclosure)(`closure`, empty, [%Iterator.prototype%](#sec-%iterator.prototype%-object)).
3.  Return the [Iterator Record](#sec-iterator-records) { `[[Iterator]]`: `iterator`, `[[NextMethod]]`: %GeneratorPrototype.next%, `[[Done]]`: false }.

Note

The list [iterator object](#sec-iterator-interface) is never directly accessible to ECMAScript code.

### 7.4.16 IteratorToList ( `iteratorRecord` )

The abstract operation IteratorToList takes argument `iteratorRecord` (an [Iterator Record](#sec-iterator-records)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a [List](#sec-list-and-record-specification-type) of [ECMAScript language values](#sec-ecmascript-language-types) or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `values` be a new empty [List](#sec-list-and-record-specification-type).
2.  Repeat,
    1.  Let `next` be ? [IteratorStepValue](#sec-iteratorstepvalue)(`iteratorRecord`).
    2.  If `next` is done, then
        1.  Return `values`.
    3.  Append `next` to `values`.
