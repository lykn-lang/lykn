# 6 ECMAScript Data Types and Values

Algorithms within this specification manipulate values each of which has an associated type. The possible value types are exactly those defined in this clause. Types are further classified into [ECMAScript language types](#sec-ecmascript-language-types) and specification types.

## 6.1 ECMAScript Language Types

An ECMAScript language type corresponds to values that are directly manipulated by an ECMAScript programmer using the ECMAScript language. The ECMAScript language types are Undefined, Null, Boolean, String, Symbol, Number, BigInt, and Object. An ECMAScript language value is a value that is characterized by an ECMAScript language type.

### 6.1.1 The Undefined Type

The Undefined type has exactly one value, called undefined. Any variable that has not been assigned a value has the value undefined.

### 6.1.2 The Null Type

The Null type has exactly one value, called null.

### 6.1.3 The Boolean Type

The Boolean type represents a logical entity having two values, called true and false.

### 6.1.4 The String Type

The String type is the set of all ordered sequences of zero or more 16-bit unsigned [integer](#integer) values (“elements”) up to a maximum length of 2\*\*⁵³ - 1 elements. The String type is generally used to represent textual data in a running ECMAScript program, in which case each element in the String is treated as a UTF-16 code unit value. Each element is regarded as occupying a position within the sequence. These positions are indexed with non-negative [integers](#integer). The first element (if any) is at index 0, the next element (if any) at index 1, and so on. The length of a String is the number of elements (i.e., 16-bit values) within it. The empty String has length zero and therefore contains no elements.

ECMAScript operations that do not interpret String contents apply no further semantics. Operations that do interpret String values treat each element as a single UTF-16 code unit. However, ECMAScript does not restrict the value of or relationships between these code units, so operations that further interpret String contents as sequences of Unicode code points encoded in UTF-16 must account for ill-formed subsequences. Such operations apply special treatment to every code unit with a numeric value in the [inclusive interval](#inclusive-interval) from 0xD800 to 0xDBFF (defined by the Unicode Standard as a leading surrogate, or more formally as a high-surrogate code unit) and every code unit with a numeric value in the [inclusive interval](#inclusive-interval) from 0xDC00 to 0xDFFF (defined as a trailing surrogate, or more formally as a low-surrogate code unit) using the following rules:

- A code unit that is not a [leading surrogate](#leading-surrogate) and not a [trailing surrogate](#trailing-surrogate) is interpreted as a code point with the same value.
- A sequence of two code units, where the first code unit `c1` is a [leading surrogate](#leading-surrogate) and the second code unit `c2` a [trailing surrogate](#trailing-surrogate), is a surrogate pair and is interpreted as a code point with the value (`c1` - 0xD800) × 0x400 + (`c2` - 0xDC00) + 0x10000. (See [11.1.3](#sec-utf16decodesurrogatepair))
- A code unit that is a [leading surrogate](#leading-surrogate) or [trailing surrogate](#trailing-surrogate), but is not part of a [surrogate pair](#surrogate-pair), is interpreted as a code point with the same value.

The function `String.prototype.normalize` (see [22.1.3.15](#sec-string.prototype.normalize)) can be used to explicitly normalize a String value. `String.prototype.localeCompare` (see [22.1.3.12](#sec-string.prototype.localecompare)) internally normalizes String values, but no other operations implicitly normalize the strings upon which they operate. Operation results are not language- and/or locale-sensitive unless stated otherwise.

Note

The rationale behind this design was to keep the implementation of Strings as simple and high-performing as possible. If [ECMAScript source text](#sec-source-text) is in Normalized Form C, string literals are guaranteed to also be normalized, as long as they do not contain any Unicode escape sequences.

In this specification, the phrase "the string-concatenation of `A`, `B`, ..." (where each argument is a String value, a code unit, or a sequence of code units) denotes the String value whose sequence of code units is the concatenation of the code units (in order) of each of the arguments (in order).

The phrase "the substring of `S` from `inclusiveStart` to `exclusiveEnd`" (where `S` is a String value or a sequence of code units and `inclusiveStart` and `exclusiveEnd` are [integers](#integer)) denotes the String value consisting of the consecutive code units of `S` beginning at index `inclusiveStart` and ending immediately before index `exclusiveEnd` (which is the empty String when `inclusiveStart` = `exclusiveEnd`). If the "to" suffix is omitted, the length of `S` is used as the value of `exclusiveEnd`.

The phrase "the ASCII word characters" denotes the following String value, which consists solely of every letter and number in the Unicode Basic Latin block along with U+005F (LOW LINE):  
"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789\_".  
For historical reasons, it has significance to various algorithms.

#### 6.1.4.1 StringIndexOf ( `string`, `searchValue`, `fromIndex` )

The abstract operation StringIndexOf takes arguments `string` (a String), `searchValue` (a String), and `fromIndex` (a non-negative [integer](#integer)) and returns a non-negative [integer](#integer) or not-found. It performs the following steps when called:

1.  Let `len` be the length of `string`.
2.  If `searchValue` is the empty String and `fromIndex` ≤ `len`, return `fromIndex`.
3.  Let `searchLen` be the length of `searchValue`.
4.  For each [integer](#integer) `i` such that `fromIndex` ≤ `i` ≤ `len` - `searchLen`, in ascending order, do
    1.  Let `candidate` be the [substring](#substring) of `string` from `i` to `i` + `searchLen`.
    2.  If `candidate` is `searchValue`, return `i`.
5.  Return not-found.

Note 1

If `searchValue` is the empty String and `fromIndex` ≤ the length of `string`, this algorithm returns `fromIndex`. The empty String is effectively found at every position within a string, including after the last code unit.

Note 2

This algorithm always returns not-found if `fromIndex` + the length of `searchValue` \> the length of `string`.

#### 6.1.4.2 StringLastIndexOf ( `string`, `searchValue`, `fromIndex` )

The abstract operation StringLastIndexOf takes arguments `string` (a String), `searchValue` (a String), and `fromIndex` (a non-negative [integer](#integer)) and returns a non-negative [integer](#integer) or not-found. It performs the following steps when called:

1.  Let `len` be the length of `string`.
2.  Let `searchLen` be the length of `searchValue`.
3.  [Assert](#assert): `fromIndex` + `searchLen` ≤ `len`.
4.  For each [integer](#integer) `i` such that 0 ≤ `i` ≤ `fromIndex`, in descending order, do
    1.  Let `candidate` be the [substring](#substring) of `string` from `i` to `i` + `searchLen`.
    2.  If `candidate` is `searchValue`, return `i`.
5.  Return not-found.

Note

If `searchValue` is the empty String, this algorithm returns `fromIndex`. The empty String is effectively found at every position within a string, including after the last code unit.

### 6.1.5 The Symbol Type

The Symbol type is the set of all non-String values that may be used as the key of an Object property ([6.1.7](#sec-object-type)).

Each possible Symbol value is unique and immutable.

Each Symbol value immutably holds an associated value called `[[Description]]` that is either undefined or a String value.

#### 6.1.5.1 Well-Known Symbols

Well-known symbols are built-in Symbol values that are explicitly referenced by algorithms of this specification. They are typically used as the keys of properties whose values serve as extension points of a specification algorithm. Unless otherwise specified, well-known symbols values are shared by all [realms](#realm) ([9.3](#sec-code-realms)).

Within this specification a well-known symbol is referred to using the standard [intrinsic notation](#sec-well-known-intrinsic-objects) where the intrinsic is one of the values listed in [Table 1](#table-well-known-symbols).

Note

Previous editions of this specification used a notation of the form @@name, where the current edition would use `%Symbol.name%`. In particular, the following names were used: @@asyncIterator, @@hasInstance, @@isConcatSpreadable, @@iterator, @@match, @@matchAll, @@replace, @@search, @@species, @@split, @@toPrimitive, @@toStringTag, and @@unscopables.

| Specification Name | `[[Description]]` | Value and Purpose |
|----|----|----|
| %Symbol.asyncIterator% | "Symbol.asyncIterator" | A method that returns the default [async iterator](#sec-asynciterator-interface) for an object. Called by the semantics of the `for`-`await`-`of` statement. |
| %Symbol.hasInstance% | "Symbol.hasInstance" | A method that determines if a [constructor](#constructor) object recognizes an object as one of the [constructor](#constructor)'s instances. Called by the semantics of the `instanceof` operator. |
| %Symbol.isConcatSpreadable% | "Symbol.isConcatSpreadable" | A Boolean valued property that if true indicates that an object should be flattened to its array elements by [`Array.prototype.concat`](#sec-array.prototype.concat). |
| %Symbol.iterator% | "Symbol.iterator" | A method that returns the default [iterator](#sec-iterator-interface) for an object. Called by the semantics of the for-of statement. |
| %Symbol.match% | "Symbol.match" | A regular expression method that matches the regular expression against a string. Called by the [`String.prototype.match`](#sec-string.prototype.match) method. |
| %Symbol.matchAll% | "Symbol.matchAll" | A regular expression method that returns an [iterator](#sec-iterator-interface) that yields matches of the regular expression against a string. Called by the [`String.prototype.matchAll`](#sec-string.prototype.matchall) method. |
| %Symbol.replace% | "Symbol.replace" | A regular expression method that replaces matched substrings of a string. Called by the [`String.prototype.replace`](#sec-string.prototype.replace) method. |
| %Symbol.search% | "Symbol.search" | A regular expression method that returns the index within a string that matches the regular expression. Called by the [`String.prototype.search`](#sec-string.prototype.search) method. |
| %Symbol.species% | "Symbol.species" | A function valued property that is the [constructor](#constructor) function that is used to create derived objects. |
| %Symbol.split% | "Symbol.split" | A regular expression method that splits a string at the indices that match the regular expression. Called by the [`String.prototype.split`](#sec-string.prototype.split) method. |
| %Symbol.toPrimitive% | "Symbol.toPrimitive" | A method that converts an object to a corresponding primitive value. Called by the [ToPrimitive](#sec-toprimitive) abstract operation. |
| %Symbol.toStringTag% | "Symbol.toStringTag" | A String valued property that is used in the creation of the default string description of an object. Accessed by the built-in method [`Object.prototype.toString`](#sec-object.prototype.tostring). |
| %Symbol.unscopables% | "Symbol.unscopables" | An object valued property whose own and inherited property names are property names that are excluded from the `with` environment bindings of the associated object. |

Table 1: Well-known Symbols

### 6.1.6 Numeric Types

ECMAScript has two built-in numeric types: Number and BigInt. The following [abstract operations](#sec-algorithm-conventions-abstract-operations) are defined over these numeric types. The "Result" column shows the return type, along with an indication if it is possible for some invocations of the operation to return an [abrupt completion](#sec-completion-record-specification-type).

[TABLE]

Table 2: Numeric Type Operations

Because the numeric types are in general not convertible without loss of precision or truncation, the ECMAScript language provides no implicit conversion among these types. Programmers must explicitly call `Number` and `BigInt` functions to convert among types when calling a function which requires another type.

Note

The first and subsequent editions of ECMAScript have provided, for certain operators, implicit numeric conversions that could lose precision or [truncate](#eqn-truncate). These legacy implicit conversions are maintained for backward compatibility, but not provided for BigInt in order to minimize opportunity for programmer error, and to leave open the option of generalized *value types* in a future edition.

#### 6.1.6.1 The Number Type

The Number type has exactly 18,437,736,874,454,810,627 (that is, 2\*\*⁶⁴ - 2\*\*⁵³ + 3) values, representing the double-precision floating point [IEEE 754-2019](#sec-bibliography) binary64 values as specified in the IEEE Standard for Binary Floating-Point Arithmetic, except that the 9,007,199,254,740,990 (that is, 2\*\*⁵³ - 2) distinct NaN values of the IEEE Standard are represented in ECMAScript as a single special NaN value. (Note that the NaN value is produced by the program expression `NaN`.) In some implementations, external code might be able to detect a difference between various NaN values, but such behaviour is [implementation-defined](#implementation-defined); to ECMAScript code, all NaN values are indistinguishable from each other.

Note

The bit pattern that might be observed in an ArrayBuffer (see [25.1](#sec-arraybuffer-objects)) or a SharedArrayBuffer (see [25.2](#sec-sharedarraybuffer-objects)) after a Number value has been stored into it is not necessarily the same as the internal representation of that Number value used by the ECMAScript implementation.

There are two other special values, called positive Infinity and negative Infinity. For brevity, these values are also referred to for expository purposes by the symbols +∞_(𝔽) and -∞_(𝔽), respectively. (Note that these two infinite Number values are produced by the program expressions `+Infinity` (or simply `Infinity`) and `-Infinity`.)

The other 18,437,736,874,454,810,624 (that is, 2\*\*⁶⁴ - 2\*\*⁵³) values are called the finite numbers. Half of these are positive numbers and half are negative numbers; for every [finite](#finite) positive Number value there is a corresponding negative value having the same magnitude.

Note that there is both a positive zero and a negative zero. For brevity, these values are also referred to for expository purposes by the symbols +0_(𝔽) and -0_(𝔽), respectively. (Note that these two different zero Number values are produced by the program expressions `+0` (or simply `0`) and `-0`.)

The 18,437,736,874,454,810,622 (that is, 2\*\*⁶⁴ - 2\*\*⁵³ - 2) [finite](#finite) non-zero values are of two kinds:

18,428,729,675,200,069,632 (that is, 2\*\*⁶⁴ - 2\*\*⁵⁴) of them are normalized, having the form

`s` × `m` × 2\*\*^(`e`)

where `s` is 1 or -1, `m` is an [integer](#integer) in the [interval](#interval) from 2\*\*⁵² (inclusive) to 2\*\*⁵³ (exclusive), and `e` is an [integer](#integer) in the [inclusive interval](#inclusive-interval) from -1074 to 971.

The remaining 9,007,199,254,740,990 (that is, 2\*\*⁵³ - 2) values are denormalized, having the form

`s` × `m` × 2\*\*^(`e`)

where `s` is 1 or -1, `m` is an [integer](#integer) in the [interval](#interval) from 0 (exclusive) to 2\*\*⁵² (exclusive), and `e` is -1074.

Note that all the positive and negative [integers](#integer) whose magnitude is no greater than 2\*\*⁵³ are representable in the Number type. The [integer](#integer) 0 has two representations in the Number type: +0_(𝔽) and -0_(𝔽).

A [finite](#finite) number has an *odd significand* if it is non-zero and the [integer](#integer) `m` used to express it (in one of the two forms shown above) is odd. Otherwise, it has an *even significand*.

In this specification, the phrase “the Number value for `x`” where `x` represents an exact real mathematical quantity (which might even be an irrational number such as π) means a Number value chosen in the following manner. Consider the set of all [finite](#finite) values of the Number type, with -0_(𝔽) removed and with two additional values added to it that are not representable in the Number type, namely 2\*\*¹⁰²⁴ (which is +1 × 2\*\*⁵³ × 2\*\*⁹⁷¹) and -2\*\*¹⁰²⁴ (which is -1 × 2\*\*⁵³ × 2\*\*⁹⁷¹). Choose the member of this set that is closest in value to `x`. If two values of the set are equally close, then the one with an even significand is chosen; for this purpose, the two extra values 2\*\*¹⁰²⁴ and -2\*\*¹⁰²⁴ are considered to have even significands. Finally, if 2\*\*¹⁰²⁴ was chosen, replace it with +∞_(𝔽); if -2\*\*¹⁰²⁴ was chosen, replace it with -∞_(𝔽); if +0_(𝔽) was chosen, replace it with -0_(𝔽) if and only if `x` \< 0; any other chosen value is used unchanged. The result is the [Number value for](#number-value-for) `x`. (This procedure corresponds exactly to the behaviour of the [IEEE 754-2019](#sec-bibliography) roundTiesToEven mode.)

The [Number value for](#number-value-for) +∞ is +∞_(𝔽), and the [Number value for](#number-value-for) -∞ is -∞_(𝔽).

Some ECMAScript operators deal only with [integers](#integer) in specific ranges such as the [inclusive interval](#inclusive-interval) from -2\*\*³¹ to 2\*\*³¹ - 1 or the [inclusive interval](#inclusive-interval) from 0 to 2\*\*¹⁶ - 1. These operators accept any value of the Number type but first convert each such value to an [integer](#integer) value in the expected range. See the descriptions of the numeric conversion operations in [7.1](#sec-type-conversion).

##### 6.1.6.1.1 Number::unaryMinus ( `x` )

The abstract operation Number::unaryMinus takes argument `x` (a Number) and returns a Number. It performs the following steps when called:

1.  If `x` is NaN, return NaN.
2.  Return the negation of `x`; that is, compute a Number with the same magnitude but opposite sign.

##### 6.1.6.1.2 Number::bitwiseNOT ( `x` )

The abstract operation Number::bitwiseNOT takes argument `x` (a Number) and returns an [integral Number](#integral-number). It performs the following steps when called:

1.  Let `oldValue` be ! [ToInt32](#sec-toint32)(`x`).
2.  Return the bitwise complement of `oldValue`. The [mathematical value of](#mathematical-value-of) the result is exactly representable as a 32-bit two's complement bit string.

##### 6.1.6.1.3 Number::exponentiate ( `base`, `exponent` )

The abstract operation Number::exponentiate takes arguments `base` (a Number) and `exponent` (a Number) and returns a Number. It returns an [implementation-approximated](#implementation-approximated) value representing the result of raising `base` to the `exponent` power. It performs the following steps when called:

1.  If `exponent` is NaN, return NaN.
2.  If `exponent` is either +0_(𝔽) or -0_(𝔽), return 1_(𝔽).
3.  If `base` is NaN, return NaN.
4.  If `base` is +∞_(𝔽), then
    1.  If `exponent` \> +0_(𝔽), return +∞_(𝔽). Otherwise, return +0_(𝔽).
5.  If `base` is -∞_(𝔽), then
    1.  If `exponent` \> +0_(𝔽), then
        1.  If `exponent` is an odd [integral Number](#integral-number), return -∞_(𝔽). Otherwise, return +∞_(𝔽).
    2.  Else,
        1.  If `exponent` is an odd [integral Number](#integral-number), return -0_(𝔽). Otherwise, return +0_(𝔽).
6.  If `base` is +0_(𝔽), then
    1.  If `exponent` \> +0_(𝔽), return +0_(𝔽). Otherwise, return +∞_(𝔽).
7.  If `base` is -0_(𝔽), then
    1.  If `exponent` \> +0_(𝔽), then
        1.  If `exponent` is an odd [integral Number](#integral-number), return -0_(𝔽). Otherwise, return +0_(𝔽).
    2.  Else,
        1.  If `exponent` is an odd [integral Number](#integral-number), return -∞_(𝔽). Otherwise, return +∞_(𝔽).
8.  [Assert](#assert): `base` is [finite](#finite) and is neither +0_(𝔽) nor -0_(𝔽).
9.  If `exponent` is +∞_(𝔽), then
    1.  If [abs](#eqn-abs)([ℝ](#ℝ)(`base`)) \> 1, return +∞_(𝔽).
    2.  If [abs](#eqn-abs)([ℝ](#ℝ)(`base`)) = 1, return NaN.
    3.  If [abs](#eqn-abs)([ℝ](#ℝ)(`base`)) \< 1, return +0_(𝔽).
10. If `exponent` is -∞_(𝔽), then
    1.  If [abs](#eqn-abs)([ℝ](#ℝ)(`base`)) \> 1, return +0_(𝔽).
    2.  If [abs](#eqn-abs)([ℝ](#ℝ)(`base`)) = 1, return NaN.
    3.  If [abs](#eqn-abs)([ℝ](#ℝ)(`base`)) \< 1, return +∞_(𝔽).
11. [Assert](#assert): `exponent` is [finite](#finite) and is neither +0_(𝔽) nor -0_(𝔽).
12. If `base` \< -0_(𝔽) and `exponent` is not an [integral Number](#integral-number), return NaN.
13. Return an [implementation-approximated](#implementation-approximated) Number value representing the result of raising [ℝ](#ℝ)(`base`) to the [ℝ](#ℝ)(`exponent`) power.

Note

The result of `base` `**` `exponent` when `base` is 1_(𝔽) or -1_(𝔽) and `exponent` is +∞_(𝔽) or -∞_(𝔽), or when `base` is 1_(𝔽) and `exponent` is NaN, differs from [IEEE 754-2019](#sec-bibliography). The first edition of ECMAScript specified a result of NaN for this operation, whereas later revisions of IEEE 754 specified 1_(𝔽). The historical ECMAScript behaviour is preserved for compatibility reasons.

##### 6.1.6.1.4 Number::multiply ( `x`, `y` )

The abstract operation Number::multiply takes arguments `x` (a Number) and `y` (a Number) and returns a Number. It performs multiplication according to the rules of [IEEE 754-2019](#sec-bibliography) binary double-precision arithmetic, producing the product of `x` and `y`. It performs the following steps when called:

1.  If `x` is NaN or `y` is NaN, return NaN.
2.  If `x` is either +∞_(𝔽) or -∞_(𝔽), then
    1.  If `y` is either +0_(𝔽) or -0_(𝔽), return NaN.
    2.  If `y` \> +0_(𝔽), return `x`.
    3.  Return -`x`.
3.  If `y` is either +∞_(𝔽) or -∞_(𝔽), then
    1.  If `x` is either +0_(𝔽) or -0_(𝔽), return NaN.
    2.  If `x` \> +0_(𝔽), return `y`.
    3.  Return -`y`.
4.  If `x` is -0_(𝔽), then
    1.  If `y` is -0_(𝔽) or `y` \< -0_(𝔽), return +0_(𝔽).
    2.  Else, return -0_(𝔽).
5.  If `y` is -0_(𝔽), then
    1.  If `x` \< -0_(𝔽), return +0_(𝔽).
    2.  Else, return -0_(𝔽).
6.  Return [𝔽](#𝔽)([ℝ](#ℝ)(`x`) × [ℝ](#ℝ)(`y`)).

Note

[Finite](#finite)-precision multiplication is commutative, but not always associative.

##### 6.1.6.1.5 Number::divide ( `x`, `y` )

The abstract operation Number::divide takes arguments `x` (a Number) and `y` (a Number) and returns a Number. It performs division according to the rules of [IEEE 754-2019](#sec-bibliography) binary double-precision arithmetic, producing the quotient of `x` and `y` where `x` is the dividend and `y` is the divisor. It performs the following steps when called:

1.  If `x` is NaN or `y` is NaN, return NaN.
2.  If `x` is either +∞_(𝔽) or -∞_(𝔽), then
    1.  If `y` is either +∞_(𝔽) or -∞_(𝔽), return NaN.
    2.  If `y` is +0_(𝔽) or `y` \> +0_(𝔽), return `x`.
    3.  Return -`x`.
3.  If `y` is +∞_(𝔽), then
    1.  If `x` is +0_(𝔽) or `x` \> +0_(𝔽), return +0_(𝔽). Otherwise, return -0_(𝔽).
4.  If `y` is -∞_(𝔽), then
    1.  If `x` is +0_(𝔽) or `x` \> +0_(𝔽), return -0_(𝔽). Otherwise, return +0_(𝔽).
5.  If `x` is either +0_(𝔽) or -0_(𝔽), then
    1.  If `y` is either +0_(𝔽) or -0_(𝔽), return NaN.
    2.  If `y` \> +0_(𝔽), return `x`.
    3.  Return -`x`.
6.  If `y` is +0_(𝔽), then
    1.  If `x` \> +0_(𝔽), return +∞_(𝔽). Otherwise, return -∞_(𝔽).
7.  If `y` is -0_(𝔽), then
    1.  If `x` \> +0_(𝔽), return -∞_(𝔽). Otherwise, return +∞_(𝔽).
8.  Return [𝔽](#𝔽)([ℝ](#ℝ)(`x`) / [ℝ](#ℝ)(`y`)).

##### 6.1.6.1.6 Number::remainder ( `n`, `d` )

The abstract operation Number::remainder takes arguments `n` (a Number) and `d` (a Number) and returns a Number. It yields the remainder from an implied division of its operands where `n` is the dividend and `d` is the divisor. It performs the following steps when called:

1.  If `n` is NaN or `d` is NaN, return NaN.
2.  If `n` is either +∞_(𝔽) or -∞_(𝔽), return NaN.
3.  If `d` is either +∞_(𝔽) or -∞_(𝔽), return `n`.
4.  If `d` is either +0_(𝔽) or -0_(𝔽), return NaN.
5.  If `n` is either +0_(𝔽) or -0_(𝔽), return `n`.
6.  [Assert](#assert): `n` and `d` are [finite](#finite) and non-zero.
7.  Let `quotient` be [ℝ](#ℝ)(`n`) / [ℝ](#ℝ)(`d`).
8.  Let `q` be [truncate](#eqn-truncate)(`quotient`).
9.  Let `r` be [ℝ](#ℝ)(`n`) - ([ℝ](#ℝ)(`d`) × `q`).
10. If `r` = 0 and `n` \< -0_(𝔽), return -0_(𝔽).
11. Return [𝔽](#𝔽)(`r`).

Note 1

In C and C++, the remainder operator accepts only integral operands; in ECMAScript, it also accepts floating-point operands.

Note 2

The result of a floating-point remainder operation as computed by the `%` operator is not the same as the “remainder” operation defined by [IEEE 754-2019](#sec-bibliography). The [IEEE 754-2019](#sec-bibliography) “remainder” operation computes the remainder from a rounding division, not a truncating division, and so its behaviour is not analogous to that of the usual integer remainder operator. Instead the ECMAScript language defines `%` on floating-point operations to behave in a manner analogous to that of the Java integer remainder operator; this may be compared with the C library function fmod.

##### 6.1.6.1.7 Number::add ( `x`, `y` )

The abstract operation Number::add takes arguments `x` (a Number) and `y` (a Number) and returns a Number. It performs addition according to the rules of [IEEE 754-2019](#sec-bibliography) binary double-precision arithmetic, producing the sum of its arguments. It performs the following steps when called:

1.  If `x` is NaN or `y` is NaN, return NaN.
2.  If `x` is +∞_(𝔽) and `y` is -∞_(𝔽), return NaN.
3.  If `x` is -∞_(𝔽) and `y` is +∞_(𝔽), return NaN.
4.  If `x` is either +∞_(𝔽) or -∞_(𝔽), return `x`.
5.  If `y` is either +∞_(𝔽) or -∞_(𝔽), return `y`.
6.  [Assert](#assert): `x` and `y` are both [finite](#finite).
7.  If `x` is -0_(𝔽) and `y` is -0_(𝔽), return -0_(𝔽).
8.  Return [𝔽](#𝔽)([ℝ](#ℝ)(`x`) + [ℝ](#ℝ)(`y`)).

Note

[Finite](#finite)-precision addition is commutative, but not always associative.

##### 6.1.6.1.8 Number::subtract ( `x`, `y` )

The abstract operation Number::subtract takes arguments `x` (a Number) and `y` (a Number) and returns a Number. It performs subtraction, producing the difference of its operands; `x` is the minuend and `y` is the subtrahend. It performs the following steps when called:

1.  Return [Number::add](#sec-numeric-types-number-add)(`x`, [Number::unaryMinus](#sec-numeric-types-number-unaryMinus)(`y`)).

Note

It is always the case that `x - y` produces the same result as `x + (-y)`.

##### 6.1.6.1.9 Number::leftShift ( `x`, `y` )

The abstract operation Number::leftShift takes arguments `x` (a Number) and `y` (a Number) and returns an [integral Number](#integral-number). It performs the following steps when called:

1.  Let `lNum` be ! [ToInt32](#sec-toint32)(`x`).
2.  Let `rNum` be ! [ToUint32](#sec-touint32)(`y`).
3.  Let `shiftCount` be [ℝ](#ℝ)(`rNum`) [modulo](#eqn-modulo) 32.
4.  Return the result of left shifting `lNum` by `shiftCount` bits. The [mathematical value of](#mathematical-value-of) the result is exactly representable as a 32-bit two's complement bit string.

##### 6.1.6.1.10 Number::signedRightShift ( `x`, `y` )

The abstract operation Number::signedRightShift takes arguments `x` (a Number) and `y` (a Number) and returns an [integral Number](#integral-number). It performs the following steps when called:

1.  Let `lNum` be ! [ToInt32](#sec-toint32)(`x`).
2.  Let `rNum` be ! [ToUint32](#sec-touint32)(`y`).
3.  Let `shiftCount` be [ℝ](#ℝ)(`rNum`) [modulo](#eqn-modulo) 32.
4.  Return the result of performing a sign-extending right shift of `lNum` by `shiftCount` bits. The most significant bit is propagated. The [mathematical value of](#mathematical-value-of) the result is exactly representable as a 32-bit two's complement bit string.

##### 6.1.6.1.11 Number::unsignedRightShift ( `x`, `y` )

The abstract operation Number::unsignedRightShift takes arguments `x` (a Number) and `y` (a Number) and returns an [integral Number](#integral-number). It performs the following steps when called:

1.  Let `lNum` be ! [ToUint32](#sec-touint32)(`x`).
2.  Let `rNum` be ! [ToUint32](#sec-touint32)(`y`).
3.  Let `shiftCount` be [ℝ](#ℝ)(`rNum`) [modulo](#eqn-modulo) 32.
4.  Return the result of performing a zero-filling right shift of `lNum` by `shiftCount` bits. Vacated bits are filled with zero. The [mathematical value of](#mathematical-value-of) the result is exactly representable as a 32-bit unsigned bit string.

##### 6.1.6.1.12 Number::lessThan ( `x`, `y` )

The abstract operation Number::lessThan takes arguments `x` (a Number) and `y` (a Number) and returns a Boolean or undefined. It performs the following steps when called:

1.  If `x` is NaN, return undefined.
2.  If `y` is NaN, return undefined.
3.  If `x` is `y`, return false.
4.  If `x` is +0_(𝔽) and `y` is -0_(𝔽), return false.
5.  If `x` is -0_(𝔽) and `y` is +0_(𝔽), return false.
6.  If `x` is +∞_(𝔽), return false.
7.  If `y` is +∞_(𝔽), return true.
8.  If `y` is -∞_(𝔽), return false.
9.  If `x` is -∞_(𝔽), return true.
10. [Assert](#assert): `x` and `y` are [finite](#finite).
11. If [ℝ](#ℝ)(`x`) \< [ℝ](#ℝ)(`y`), return true. Otherwise, return false.

##### 6.1.6.1.13 Number::equal ( `x`, `y` )

The abstract operation Number::equal takes arguments `x` (a Number) and `y` (a Number) and returns a Boolean. It performs the following steps when called:

1.  If `x` is NaN, return false.
2.  If `y` is NaN, return false.
3.  If `x` is `y`, return true.
4.  If `x` is +0_(𝔽) and `y` is -0_(𝔽), return true.
5.  If `x` is -0_(𝔽) and `y` is +0_(𝔽), return true.
6.  Return false.

##### 6.1.6.1.14 Number::sameValue ( `x`, `y` )

The abstract operation Number::sameValue takes arguments `x` (a Number) and `y` (a Number) and returns a Boolean. It performs the following steps when called:

1.  If `x` is NaN and `y` is NaN, return true.
2.  If `x` is +0_(𝔽) and `y` is -0_(𝔽), return false.
3.  If `x` is -0_(𝔽) and `y` is +0_(𝔽), return false.
4.  If `x` is `y`, return true.
5.  Return false.

##### 6.1.6.1.15 Number::sameValueZero ( `x`, `y` )

The abstract operation Number::sameValueZero takes arguments `x` (a Number) and `y` (a Number) and returns a Boolean. It performs the following steps when called:

1.  If `x` is NaN and `y` is NaN, return true.
2.  If `x` is +0_(𝔽) and `y` is -0_(𝔽), return true.
3.  If `x` is -0_(𝔽) and `y` is +0_(𝔽), return true.
4.  If `x` is `y`, return true.
5.  Return false.

##### 6.1.6.1.16 NumberBitwiseOp ( `op`, `x`, `y` )

The abstract operation NumberBitwiseOp takes arguments `op` (`&`, `^`, or `|`), `x` (a Number), and `y` (a Number) and returns an [integral Number](#integral-number). It performs the following steps when called:

1.  Let `lNum` be ! [ToInt32](#sec-toint32)(`x`).
2.  Let `rNum` be ! [ToInt32](#sec-toint32)(`y`).
3.  Let `lBits` be the 32-bit two's complement bit string representing [ℝ](#ℝ)(`lNum`).
4.  Let `rBits` be the 32-bit two's complement bit string representing [ℝ](#ℝ)(`rNum`).
5.  If `op` is `&`, then
    1.  Let `result` be the result of applying the bitwise AND operation to `lBits` and `rBits`.
6.  Else if `op` is `^`, then
    1.  Let `result` be the result of applying the bitwise exclusive OR (XOR) operation to `lBits` and `rBits`.
7.  Else,
    1.  [Assert](#assert): `op` is `|`.
    2.  Let `result` be the result of applying the bitwise inclusive OR operation to `lBits` and `rBits`.
8.  Return the [Number value for](#number-value-for) the [integer](#integer) represented by the 32-bit two's complement bit string `result`.

##### 6.1.6.1.17 Number::bitwiseAND ( `x`, `y` )

The abstract operation Number::bitwiseAND takes arguments `x` (a Number) and `y` (a Number) and returns an [integral Number](#integral-number). It performs the following steps when called:

1.  Return [NumberBitwiseOp](#sec-numberbitwiseop)(`&`, `x`, `y`).

##### 6.1.6.1.18 Number::bitwiseXOR ( `x`, `y` )

The abstract operation Number::bitwiseXOR takes arguments `x` (a Number) and `y` (a Number) and returns an [integral Number](#integral-number). It performs the following steps when called:

1.  Return [NumberBitwiseOp](#sec-numberbitwiseop)(`^`, `x`, `y`).

##### 6.1.6.1.19 Number::bitwiseOR ( `x`, `y` )

The abstract operation Number::bitwiseOR takes arguments `x` (a Number) and `y` (a Number) and returns an [integral Number](#integral-number). It performs the following steps when called:

1.  Return [NumberBitwiseOp](#sec-numberbitwiseop)(`|`, `x`, `y`).

##### 6.1.6.1.20 Number::toString ( `x`, `radix` )

The abstract operation Number::toString takes arguments `x` (a Number) and `radix` (an [integer](#integer) in the [inclusive interval](#inclusive-interval) from 2 to 36) and returns a String. It represents `x` as a String using a positional numeral system with radix `radix`. The digits used in the representation of a number using radix `r` are taken from the first `r` code units of "0123456789abcdefghijklmnopqrstuvwxyz" in order. The representation of numbers with magnitude greater than or equal to 1_(𝔽) never includes leading zeroes. It performs the following steps when called:

1.  If `x` is NaN, return "NaN".
2.  If `x` is either +0_(𝔽) or -0_(𝔽), return "0".
3.  If `x` \< -0_(𝔽), return the [string-concatenation](#string-concatenation) of "-" and [Number::toString](#sec-numeric-types-number-tostring)(-`x`, `radix`).
4.  If `x` is +∞_(𝔽), return "Infinity".
5.  Let `n`, `k`, and `s` be [integers](#integer) such that `k` ≥ 1, `radix`\*\*(^(`k` - 1)) ≤ `s` \< `radix`\*\*^(`k`), [𝔽](#𝔽)(`s` × `radix`\*\*(^(`n` - `k`))) is `x`, and `k` is as small as possible. Note that `k` is the number of digits in the representation of `s` using radix `radix`, that `s` is not divisible by `radix`, and that the least significant digit of `s` is not necessarily uniquely determined by these criteria.
6.  If `radix` ≠ 10 or `n` is in the [inclusive interval](#inclusive-interval) from -5 to 21, then
    1.  If `n` ≥ `k`, then
        1.  Return the [string-concatenation](#string-concatenation) of:
            - the code units of the `k` digits of the representation of `s` using radix `radix`
            - `n` - `k` occurrences of the code unit 0x0030 (DIGIT ZERO)
    2.  Else if `n` \> 0, then
        1.  Return the [string-concatenation](#string-concatenation) of:
            - the code units of the most significant `n` digits of the representation of `s` using radix `radix`
            - the code unit 0x002E (FULL STOP)
            - the code units of the remaining `k` - `n` digits of the representation of `s` using radix `radix`
    3.  Else,
        1.  [Assert](#assert): `n` ≤ 0.
        2.  Return the [string-concatenation](#string-concatenation) of:
            - the code unit 0x0030 (DIGIT ZERO)
            - the code unit 0x002E (FULL STOP)
            - \-`n` occurrences of the code unit 0x0030 (DIGIT ZERO)
            - the code units of the `k` digits of the representation of `s` using radix `radix`
7.  NOTE: In this case, the input will be represented using scientific E notation, such as `1.2e+3`.
8.  [Assert](#assert): `radix` is 10.
9.  If `n` \< 0, then
    1.  Let `exponentSign` be the code unit 0x002D (HYPHEN-MINUS).
10. Else,
    1.  Let `exponentSign` be the code unit 0x002B (PLUS SIGN).
11. If `k` = 1, then
    1.  Return the [string-concatenation](#string-concatenation) of:
        - the code unit of the single digit of `s`
        - the code unit 0x0065 (LATIN SMALL LETTER E)
        - `exponentSign`
        - the code units of the decimal representation of [abs](#eqn-abs)(`n` - 1)
12. Return the [string-concatenation](#string-concatenation) of:
    - the code unit of the most significant digit of the decimal representation of `s`
    - the code unit 0x002E (FULL STOP)
    - the code units of the remaining `k` - 1 digits of the decimal representation of `s`
    - the code unit 0x0065 (LATIN SMALL LETTER E)
    - `exponentSign`
    - the code units of the decimal representation of [abs](#eqn-abs)(`n` - 1)

Note 1

The following observations may be useful as guidelines for implementations, but are not part of the normative requirements of this Standard:

- If x is any Number value other than -0_(𝔽), then [ToNumber](#sec-tonumber)([ToString](#sec-tostring)(x)) is x.
- The least significant digit of s is not always uniquely determined by the requirements listed in step [5](#step-number-tostring-intermediate-values).

Note 2

For implementations that provide more accurate conversions than required by the rules above, it is recommended that the following alternative version of step [5](#step-number-tostring-intermediate-values) be used as a guideline:

5.  Let `n`, `k`, and `s` be [integers](#integer) such that `k` ≥ 1, `radix`\*\*(^(`k` - 1)) ≤ `s` \< `radix`\*\*^(`k`), [𝔽](#𝔽)(`s` × `radix`\*\*(^(`n` - `k`))) is `x`, and `k` is as small as possible. If there are multiple possibilities for `s`, choose the value of `s` for which `s` × `radix`\*\*(^(`n` - `k`)) is closest in value to [ℝ](#ℝ)(`x`). If there are two such possible values of `s`, choose the one that is even. Note that `k` is the number of digits in the representation of `s` using radix `radix` and that `s` is not divisible by `radix`.

Note 3

Implementers of ECMAScript may find useful the paper and code written by David M. Gay for binary-to-decimal conversion of floating-point numbers:

Gay, David M. Correctly Rounded Binary-Decimal and Decimal-Binary Conversions. Numerical Analysis, Manuscript 90-10. AT&T Bell Laboratories (Murray Hill, New Jersey). 30 November 1990. Available as  
<https://ampl.com/_archive/first-website/REFS/rounding.pdf>. Associated code available as  
<http://netlib.sandia.gov/fp/dtoa.c> and as  
<http://netlib.sandia.gov/fp/g_fmt.c> and may also be found at the various `netlib` mirror sites.

#### 6.1.6.2 The BigInt Type

The BigInt type represents an [integer](#integer) value. The value may be any size and is not limited to a particular bit-width. Generally, where not otherwise noted, operations are designed to return exact mathematically-based answers. For binary operations, BigInts act as two's complement binary strings, with negative numbers treated as having bits set infinitely to the left.

##### 6.1.6.2.1 BigInt::unaryMinus ( `x` )

The abstract operation BigInt::unaryMinus takes argument `x` (a BigInt) and returns a BigInt. It performs the following steps when called:

1.  If `x` = 0_(ℤ), return 0_(ℤ).
2.  Return -`x`.

##### 6.1.6.2.2 BigInt::bitwiseNOT ( `x` )

The abstract operation BigInt::bitwiseNOT takes argument `x` (a BigInt) and returns a BigInt. It returns the one's complement of `x`. It performs the following steps when called:

1.  Return -`x` - 1_(ℤ).

##### 6.1.6.2.3 BigInt::exponentiate ( `base`, `exponent` )

The abstract operation BigInt::exponentiate takes arguments `base` (a BigInt) and `exponent` (a BigInt) and returns either a [normal completion containing](#sec-completion-record-specification-type) a BigInt or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  If `exponent` \< 0_(ℤ), throw a RangeError exception.
2.  If `base` = 0_(ℤ) and `exponent` = 0_(ℤ), return 1_(ℤ).
3.  Return `base` raised to the power `exponent`.

##### 6.1.6.2.4 BigInt::multiply ( `x`, `y` )

The abstract operation BigInt::multiply takes arguments `x` (a BigInt) and `y` (a BigInt) and returns a BigInt. It performs the following steps when called:

1.  Return `x` × `y`.

Note

Even if the result has a much larger bit width than the input, the exact mathematical answer is given.

##### 6.1.6.2.5 BigInt::divide ( `x`, `y` )

The abstract operation BigInt::divide takes arguments `x` (a BigInt) and `y` (a BigInt) and returns either a [normal completion containing](#sec-completion-record-specification-type) a BigInt or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  If `y` = 0_(ℤ), throw a RangeError exception.
2.  Let `quotient` be [ℝ](#ℝ)(`x`) / [ℝ](#ℝ)(`y`).
3.  Return [ℤ](#ℤ)([truncate](#eqn-truncate)(`quotient`)).

##### 6.1.6.2.6 BigInt::remainder ( `n`, `d` )

The abstract operation BigInt::remainder takes arguments `n` (a BigInt) and `d` (a BigInt) and returns either a [normal completion containing](#sec-completion-record-specification-type) a BigInt or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  If `d` = 0_(ℤ), throw a RangeError exception.
2.  If `n` = 0_(ℤ), return 0_(ℤ).
3.  Let `quotient` be [ℝ](#ℝ)(`n`) / [ℝ](#ℝ)(`d`).
4.  Let `q` be [ℤ](#ℤ)([truncate](#eqn-truncate)(`quotient`)).
5.  Return `n` - (`d` × `q`).

Note

The sign of the result is the sign of the dividend.

##### 6.1.6.2.7 BigInt::add ( `x`, `y` )

The abstract operation BigInt::add takes arguments `x` (a BigInt) and `y` (a BigInt) and returns a BigInt. It performs the following steps when called:

1.  Return `x` + `y`.

##### 6.1.6.2.8 BigInt::subtract ( `x`, `y` )

The abstract operation BigInt::subtract takes arguments `x` (a BigInt) and `y` (a BigInt) and returns a BigInt. It performs the following steps when called:

1.  Return `x` - `y`.

##### 6.1.6.2.9 BigInt::leftShift ( `x`, `y` )

The abstract operation BigInt::leftShift takes arguments `x` (a BigInt) and `y` (a BigInt) and returns a BigInt. It performs the following steps when called:

1.  If `y` \< 0_(ℤ), then
    1.  Return [ℤ](#ℤ)([floor](#eqn-floor)([ℝ](#ℝ)(`x`) / 2\*\*(^(-[ℝ](#ℝ)(`y`))))).
2.  Return `x` × 2_(ℤ)\*\*^(`y`).

Note

Semantics here should be equivalent to a bitwise shift, treating the BigInt as an infinite length string of binary two's complement digits.

##### 6.1.6.2.10 BigInt::signedRightShift ( `x`, `y` )

The abstract operation BigInt::signedRightShift takes arguments `x` (a BigInt) and `y` (a BigInt) and returns a BigInt. It performs the following steps when called:

1.  Return [BigInt::leftShift](#sec-numeric-types-bigint-leftShift)(`x`, -`y`).

##### 6.1.6.2.11 BigInt::unsignedRightShift ( `x`, `y` )

The abstract operation BigInt::unsignedRightShift takes arguments `x` (a BigInt) and `y` (a BigInt) and returns a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Throw a TypeError exception.

##### 6.1.6.2.12 BigInt::lessThan ( `x`, `y` )

The abstract operation BigInt::lessThan takes arguments `x` (a BigInt) and `y` (a BigInt) and returns a Boolean. It performs the following steps when called:

1.  If [ℝ](#ℝ)(`x`) \< [ℝ](#ℝ)(`y`), return true; otherwise return false.

##### 6.1.6.2.13 BigInt::equal ( `x`, `y` )

The abstract operation BigInt::equal takes arguments `x` (a BigInt) and `y` (a BigInt) and returns a Boolean. It performs the following steps when called:

1.  If [ℝ](#ℝ)(`x`) = [ℝ](#ℝ)(`y`), return true; otherwise return false.

##### 6.1.6.2.14 BinaryAnd ( `x`, `y` )

The abstract operation BinaryAnd takes arguments `x` (0 or 1) and `y` (0 or 1) and returns 0 or 1. It performs the following steps when called:

1.  If `x` = 1 and `y` = 1, return 1.
2.  Else, return 0.

##### 6.1.6.2.15 BinaryOr ( `x`, `y` )

The abstract operation BinaryOr takes arguments `x` (0 or 1) and `y` (0 or 1) and returns 0 or 1. It performs the following steps when called:

1.  If `x` = 1 or `y` = 1, return 1.
2.  Else, return 0.

##### 6.1.6.2.16 BinaryXor ( `x`, `y` )

The abstract operation BinaryXor takes arguments `x` (0 or 1) and `y` (0 or 1) and returns 0 or 1. It performs the following steps when called:

1.  If `x` = 1 and `y` = 0, return 1.
2.  Else if `x` = 0 and `y` = 1, return 1.
3.  Else, return 0.

##### 6.1.6.2.17 BigIntBitwiseOp ( `op`, `x`, `y` )

The abstract operation BigIntBitwiseOp takes arguments `op` (`&`, `^`, or `|`), `x` (a BigInt), and `y` (a BigInt) and returns a BigInt. It performs the following steps when called:

1.  Set `x` to [ℝ](#ℝ)(`x`).
2.  Set `y` to [ℝ](#ℝ)(`y`).
3.  Let `result` be 0.
4.  Let `shift` be 0.
5.  Repeat, until (`x` = 0 or `x` = -1) and (`y` = 0 or `y` = -1),
    1.  Let `xDigit` be `x` [modulo](#eqn-modulo) 2.
    2.  Let `yDigit` be `y` [modulo](#eqn-modulo) 2.
    3.  If `op` is `&`, then
        1.  Set `result` to `result` + 2\*\*^(`shift`) × [BinaryAnd](#sec-binaryand)(`xDigit`, `yDigit`).
    4.  Else if `op` is `|`, then
        1.  Set `result` to `result` + 2\*\*^(`shift`) × [BinaryOr](#sec-binaryor)(`xDigit`, `yDigit`).
    5.  Else,
        1.  [Assert](#assert): `op` is `^`.
        2.  Set `result` to `result` + 2\*\*^(`shift`) × [BinaryXor](#sec-binaryxor)(`xDigit`, `yDigit`).
    6.  Set `shift` to `shift` + 1.
    7.  Set `x` to (`x` - `xDigit`) / 2.
    8.  Set `y` to (`y` - `yDigit`) / 2.
6.  If `op` is `&`, then
    1.  Let `tmp` be [BinaryAnd](#sec-binaryand)(`x` [modulo](#eqn-modulo) 2, `y` [modulo](#eqn-modulo) 2).
7.  Else if `op` is `|`, then
    1.  Let `tmp` be [BinaryOr](#sec-binaryor)(`x` [modulo](#eqn-modulo) 2, `y` [modulo](#eqn-modulo) 2).
8.  Else,
    1.  [Assert](#assert): `op` is `^`.
    2.  Let `tmp` be [BinaryXor](#sec-binaryxor)(`x` [modulo](#eqn-modulo) 2, `y` [modulo](#eqn-modulo) 2).
9.  If `tmp` ≠ 0, then
    1.  Set `result` to `result` - 2\*\*^(`shift`).
    2.  NOTE: This extends the sign.
10. Return the [BigInt value for](#bigint-value-for) `result`.

##### 6.1.6.2.18 BigInt::bitwiseAND ( `x`, `y` )

The abstract operation BigInt::bitwiseAND takes arguments `x` (a BigInt) and `y` (a BigInt) and returns a BigInt. It performs the following steps when called:

1.  Return [BigIntBitwiseOp](#sec-bigintbitwiseop)(`&`, `x`, `y`).

##### 6.1.6.2.19 BigInt::bitwiseXOR ( `x`, `y` )

The abstract operation BigInt::bitwiseXOR takes arguments `x` (a BigInt) and `y` (a BigInt) and returns a BigInt. It performs the following steps when called:

1.  Return [BigIntBitwiseOp](#sec-bigintbitwiseop)(`^`, `x`, `y`).

##### 6.1.6.2.20 BigInt::bitwiseOR ( `x`, `y` )

The abstract operation BigInt::bitwiseOR takes arguments `x` (a BigInt) and `y` (a BigInt) and returns a BigInt. It performs the following steps when called:

1.  Return [BigIntBitwiseOp](#sec-bigintbitwiseop)(`|`, `x`, `y`).

##### 6.1.6.2.21 BigInt::toString ( `x`, `radix` )

The abstract operation BigInt::toString takes arguments `x` (a BigInt) and `radix` (an [integer](#integer) in the [inclusive interval](#inclusive-interval) from 2 to 36) and returns a String. It represents `x` as a String using a positional numeral system with radix `radix`. The digits used in the representation of a BigInt using radix `r` are taken from the first `r` code units of "0123456789abcdefghijklmnopqrstuvwxyz" in order. The representation of BigInts other than 0_(ℤ) never includes leading zeroes. It performs the following steps when called:

1.  If `x` \< 0_(ℤ), return the [string-concatenation](#string-concatenation) of "-" and [BigInt::toString](#sec-numeric-types-bigint-tostring)(-`x`, `radix`).
2.  Return the String value consisting of the representation of `x` using radix `radix`.

### 6.1.7 The Object Type

Each instance of the Object type, also referred to simply as “an Object”, represents a collection of properties. Each property is either a data property, or an accessor property:

- A data property associates a key value with an [ECMAScript language value](#sec-ecmascript-language-types) and a set of Boolean attributes.
- An accessor property associates a key value with one or two accessor functions, and a set of Boolean attributes. The accessor functions are used to store or retrieve an [ECMAScript language value](#sec-ecmascript-language-types) that is associated with the property.

The properties of an object are uniquely identified using [property keys](#property-key). A property key is either a String or a Symbol. All Strings and Symbols, including the empty String, are valid as [property keys](#property-key). A property name is a [property key](#property-key) that [is a String](#sec-ecmascript-language-types-string-type).

An integer index is a [property name](#property-name) `n` such that [CanonicalNumericIndexString](#sec-canonicalnumericindexstring)(`n`) returns an [integral Number](#integral-number) in the [inclusive interval](#inclusive-interval) from +0_(𝔽) to [𝔽](#𝔽)(2\*\*⁵³ - 1). An array index is an [integer index](#integer-index) `n` such that [CanonicalNumericIndexString](#sec-canonicalnumericindexstring)(`n`) returns an [integral Number](#integral-number) in the [inclusive interval](#inclusive-interval) from +0_(𝔽) to [𝔽](#𝔽)(2\*\*³² - 2).

Note

Every non-negative [safe integer](#safe-integer) has a corresponding [integer index](#integer-index). Every 32-bit unsigned [integer](#integer) except 2\*\*³² - 1 has a corresponding [array index](#array-index). "-0" is neither an [integer index](#integer-index) nor an [array index](#array-index).

[Property keys](#property-key) are used to access properties and their values. There are two kinds of access for properties: *get* and *set*, corresponding to value retrieval and assignment, respectively. The properties accessible via get and set access includes both *own properties* that are a direct part of an object and *inherited properties* which are provided by another associated object via a property inheritance relationship. Inherited properties may be either own or inherited properties of the associated object. Each own property of an object must each have a key value that is distinct from the key values of the other own properties of that object.

All objects are logically collections of properties, but there are multiple forms of objects that differ in their semantics for accessing and manipulating their properties. Please see [6.1.7.2](#sec-object-internal-methods-and-internal-slots) for definitions of the multiple forms of objects.

In addition, some objects are callable; these are referred to as functions or [function objects](#function-object) and are described further below. All functions in ECMAScript are members of the Object type.

#### 6.1.7.1 Property Attributes

Attributes are used in this specification to define and explain the state of Object properties as described in [Table 3](#table-object-property-attributes). Unless specified explicitly, the initial value of each attribute is its Default Value.

| Attribute Name | Types of property for which it is present | Value Domain | Default Value | Description |
|----|----|----|----|----|
| `[[Value]]` | [data property](#sec-object-type) | an [ECMAScript language value](#sec-ecmascript-language-types) | undefined | The value retrieved by a get access of the property. |
| `[[Writable]]` | [data property](#sec-object-type) | a Boolean | false | If false, attempts by ECMAScript code to change the property's `[[Value]]` attribute using `[[Set]]` will not succeed. |
| `[[Get]]` | [accessor property](#sec-object-type) | an Object or undefined | undefined | If the value [is an Object](#sec-object-type) it must be a [function object](#function-object). The function's `[[Call]]` internal method ([Table 5](#table-additional-essential-internal-methods-of-function-objects)) is called with an empty arguments list to retrieve the property value each time a get access of the property is performed. |
| `[[Set]]` | [accessor property](#sec-object-type) | an Object or undefined | undefined | If the value [is an Object](#sec-object-type) it must be a [function object](#function-object). The function's `[[Call]]` internal method ([Table 5](#table-additional-essential-internal-methods-of-function-objects)) is called with an arguments list containing the assigned value as its sole argument each time a set access of the property is performed. The effect of a property's `[[Set]]` internal method may, but is not required to, have an effect on the value returned by subsequent calls to the property's `[[Get]]` internal method. |
| `[[Enumerable]]` | [data property](#sec-object-type) or [accessor property](#sec-object-type) | a Boolean | false | If true, the property will be enumerated by a for-in enumeration (see [14.7.5](#sec-for-in-and-for-of-statements)). Otherwise, the property is said to be non-enumerable. |
| `[[Configurable]]` | [data property](#sec-object-type) or [accessor property](#sec-object-type) | a Boolean | false | If false, attempts to delete the property, change it from a [data property](#sec-object-type) to an [accessor property](#sec-object-type) or from an [accessor property](#sec-object-type) to a [data property](#sec-object-type), or make any changes to its attributes (other than replacing an existing `[[Value]]` or setting `[[Writable]]` to false) will fail. |

Table 3: Attributes of an Object property

#### 6.1.7.2 Object Internal Methods and Internal Slots

The actual semantics of objects, in ECMAScript, are specified via algorithms called *internal methods*. Each object in an ECMAScript engine is associated with a set of internal methods that defines its runtime behaviour. These internal methods are not part of the ECMAScript language. They are defined by this specification purely for expository purposes. However, each object within an implementation of ECMAScript must behave as specified by the internal methods associated with it. The exact manner in which this is accomplished is determined by the implementation.

Internal method names are polymorphic. This means that different object values may perform different algorithms when a common internal method name is invoked upon them. That actual object upon which an internal method is invoked is the “target” of the invocation. If, at runtime, the implementation of an algorithm attempts to use an internal method of an object that the object does not support, a TypeError exception is thrown.

Internal slots correspond to internal state that is associated with objects and used by various ECMAScript specification algorithms. Internal slots are not object properties and they are not inherited. Depending upon the specific internal slot specification, such state may consist of values of any [ECMAScript language type](#sec-ecmascript-language-types) or of specific ECMAScript specification type values. Unless explicitly specified otherwise, internal slots are allocated as part of the process of creating an object and may not be dynamically added to an object. Unless specified otherwise, the initial value of an internal slot is the value undefined. Various algorithms within this specification create objects that have internal slots. However, the ECMAScript language provides no direct way to associate internal slots with an object.

All objects have an internal slot named `[[PrivateElements]]`, which is a [List](#sec-list-and-record-specification-type) of [PrivateElements](#sec-privateelement-specification-type). This [List](#sec-list-and-record-specification-type) represents the values of the private fields, methods, and accessors for the object. Initially, it is an empty [List](#sec-list-and-record-specification-type).

Internal methods and internal slots are identified within this specification using names enclosed in double square brackets \[\[ \]\].

[Table 4](#table-essential-internal-methods) summarizes the *essential internal methods* used by this specification that are applicable to all objects created or manipulated by ECMAScript code. Every object must have algorithms for all of the essential internal methods. However, all objects do not necessarily use the same algorithms for those methods.

An ordinary object is an object that satisfies all of the following criteria:

- For the internal methods listed in [Table 4](#table-essential-internal-methods), the object uses those defined in [10.1](#sec-ordinary-object-internal-methods-and-internal-slots).
- If the object has a `[[Call]]` internal method, it uses either the one defined in [10.2.1](#sec-ecmascript-function-objects-call-thisargument-argumentslist) or the one defined in [10.3.1](#sec-built-in-function-objects-call-thisargument-argumentslist).
- If the object has a `[[Construct]]` internal method, it uses either the one defined in [10.2.2](#sec-ecmascript-function-objects-construct-argumentslist-newtarget) or the one defined in [10.3.2](#sec-built-in-function-objects-construct-argumentslist-newtarget).

An exotic object is an object that is not an [ordinary object](#ordinary-object).

This specification recognizes different kinds of [exotic objects](#exotic-object) by those objects' internal methods. An object that is behaviourally equivalent to a particular kind of [exotic object](#exotic-object) (such as an [Array exotic object](#array-exotic-object) or a [bound function exotic object](#bound-function-exotic-object)), but does not have the same collection of internal methods specified for that kind, is not recognized as that kind of [exotic object](#exotic-object).

The “Signature” column of [Table 4](#table-essential-internal-methods) and other similar tables describes the invocation pattern for each internal method. The invocation pattern always includes a parenthesized list of descriptive parameter names. If a parameter name is the same as an ECMAScript type name then the name describes the required type of the parameter value. If an internal method explicitly returns a value, its parameter list is followed by the symbol “→” and the type name of the returned value. The type names used in signatures refer to the types defined in clause [6](#sec-ecmascript-data-types-and-values) augmented by the following additional names. “*any*” means the value may be any [ECMAScript language type](#sec-ecmascript-language-types).

In addition to its parameters, an internal method always has access to the object that is the target of the method invocation.

An internal method implicitly returns a [Completion Record](#sec-completion-record-specification-type), either a [normal completion](#sec-completion-record-specification-type) that wraps a value of the return type shown in its invocation pattern, or a [throw completion](#sec-completion-record-specification-type).

| Internal Method | Signature | Description |
|----|----|----|
| `[[GetPrototypeOf]]` | ( ) **→** Object \| Null | Determine the object that provides inherited properties for this object. A null value indicates that there are no inherited properties. |
| `[[SetPrototypeOf]]` | (Object \| Null) **→** Boolean | Associate this object with another object that provides inherited properties. Passing null indicates that there are no inherited properties. Returns true indicating that the operation was completed successfully or false indicating that the operation was not successful. |
| `[[IsExtensible]]` | ( ) **→** Boolean | Determine whether it is permitted to add additional properties to this object. |
| `[[PreventExtensions]]` | ( ) **→** Boolean | Control whether new properties may be added to this object. Returns true if the operation was successful or false if the operation was unsuccessful. |
| `[[GetOwnProperty]]` | (`propertyKey`) **→** Undefined \| [Property Descriptor](#sec-property-descriptor-specification-type) | Return a [Property Descriptor](#sec-property-descriptor-specification-type) for the own property of this object whose key is `propertyKey`, or undefined if no such property exists. |
| `[[DefineOwnProperty]]` | (`propertyKey`, `PropertyDescriptor`) **→** Boolean | Create or alter the own property, whose key is `propertyKey`, to have the state described by `PropertyDescriptor`. Return true if that property was successfully created/updated or false if the property could not be created or updated. |
| `[[HasProperty]]` | (`propertyKey`) **→** Boolean | Return a Boolean value indicating whether this object already has either an own or inherited property whose key is `propertyKey`. |
| `[[Get]]` | (`propertyKey`, `Receiver`) **→** *any* | Return the value of the property whose key is `propertyKey` from this object. If any ECMAScript code must be executed to retrieve the property value, `Receiver` is used as the this value when evaluating the code. |
| `[[Set]]` | (`propertyKey`, `value`, `Receiver`) **→** Boolean | Set the value of the property whose key is `propertyKey` to `value`. If any ECMAScript code must be executed to set the property value, `Receiver` is used as the this value when evaluating the code. Returns true if the property value was set or false if it could not be set. |
| `[[Delete]]` | (`propertyKey`) **→** Boolean | Remove the own property whose key is `propertyKey` from this object. Return false if the property was not deleted and is still present. Return true if the property was deleted or is not present. |
| `[[OwnPropertyKeys]]` | ( ) **→** [List](#sec-list-and-record-specification-type) of [property keys](#property-key) | Return a [List](#sec-list-and-record-specification-type) whose elements are all of the own [property keys](#property-key) for the object. |

Table 4: Essential Internal Methods

[Table 5](#table-additional-essential-internal-methods-of-function-objects) summarizes additional essential internal methods that are supported by objects that may be called as functions. A function object is an object that supports the `[[Call]]` internal method. A constructor is an object that supports the `[[Construct]]` internal method. Every object that supports `[[Construct]]` must support `[[Call]]`; that is, every [constructor](#constructor) must be a [function object](#function-object). Therefore, a [constructor](#constructor) may also be referred to as a *[constructor](#constructor) function* or *[constructor](#constructor) [function object](#function-object)*.

| Internal Method | Signature | Description |
|----|----|----|
| `[[Call]]` | (*any*, a [List](#sec-list-and-record-specification-type) of *any*) **→** *any* | Executes code associated with this object. Invoked via a function call expression. The arguments to the internal method are a this value and a [List](#sec-list-and-record-specification-type) whose elements are the arguments passed to the function by a call expression. Objects that implement this internal method are *callable*. |
| `[[Construct]]` | (a [List](#sec-list-and-record-specification-type) of *any*, Object) **→** Object | Creates an object. Invoked via the `new` operator or a `super` call. The first argument to the internal method is a [List](#sec-list-and-record-specification-type) whose elements are the arguments of the [constructor](#constructor) invocation or the `super` call. The second argument is the object to which the `new` operator was initially applied. Objects that implement this internal method are called *[constructors](#constructor)*. A [function object](#function-object) is not necessarily a [constructor](#constructor) and such non-[constructor](#constructor) [function objects](#function-object) do not have a `[[Construct]]` internal method. |

Table 5: Additional Essential Internal Methods of Function Objects

The semantics of the essential internal methods for [ordinary objects](#ordinary-object) and standard [exotic objects](#exotic-object) are specified in clause [10](#sec-ordinary-and-exotic-objects-behaviours). If any specified use of an internal method of an [exotic object](#exotic-object) is not supported by an implementation, that usage must throw a TypeError exception when attempted.

#### 6.1.7.3 Invariants of the Essential Internal Methods

The Internal Methods of Objects of an ECMAScript engine must conform to the list of invariants specified below. Ordinary ECMAScript Objects as well as all standard [exotic objects](#exotic-object) in this specification maintain these invariants. ECMAScript Proxy objects maintain these invariants by means of runtime checks on the result of traps invoked on the `[[ProxyHandler]]` object.

Any implementation provided [exotic objects](#exotic-object) must also maintain these invariants for those objects. Violation of these invariants may cause ECMAScript code to have unpredictable behaviour and create security issues. However, violation of these invariants must never compromise the memory safety of an implementation.

An implementation must not allow these invariants to be circumvented in any manner such as by providing alternative interfaces that implement the functionality of the essential internal methods without enforcing their invariants.

##### Definitions:

- The *target* of an internal method is the object upon which the internal method is called.
- A target is *non-extensible* if it has been observed to return false from its `[[IsExtensible]]` internal method, or true from its `[[PreventExtensions]]` internal method.
- A *non-existent* property is a property that does not exist as an own property on a non-extensible target.
- All references to *[SameValue](#sec-samevalue)* are according to the definition of the [SameValue](#sec-samevalue) algorithm.

##### Return value:

The value returned by any internal method must be a [Completion Record](#sec-completion-record-specification-type) with either:

- `[[Type]]` = normal, `[[Target]]` = empty, and `[[Value]]` = a value of the "normal return type" shown below for that internal method, or
- `[[Type]]` = throw, `[[Target]]` = empty, and `[[Value]]` = any [ECMAScript language value](#sec-ecmascript-language-types).

Note 1

An internal method must not return a [continue completion](#sec-completion-record-specification-type), a [break completion](#sec-completion-record-specification-type), or a [return completion](#sec-completion-record-specification-type).

##### `[[GetPrototypeOf]]` ( )

- The normal return type is either Object or Null.
- If target is non-extensible, and `[[GetPrototypeOf]]` returns a value `V`, then any future calls to `[[GetPrototypeOf]]` should return the [SameValue](#sec-samevalue) as `V`.

Note 2

An object's prototype chain should have [finite](#finite) length (that is, starting from any object, recursively applying the `[[GetPrototypeOf]]` internal method to its result should eventually lead to the value null). However, this requirement is not enforceable as an object level invariant if the prototype chain includes any [exotic objects](#exotic-object) that do not use the [ordinary object](#ordinary-object) definition of `[[GetPrototypeOf]]`. Such a circular prototype chain may result in infinite loops when accessing object properties.

##### `[[SetPrototypeOf]]` ( `V` )

- The normal return type is Boolean.
- If target is non-extensible, `[[SetPrototypeOf]]` must return false, unless `V` is the [SameValue](#sec-samevalue) as the target's observed `[[GetPrototypeOf]]` value.

##### `[[IsExtensible]]` ( )

- The normal return type is Boolean.
- If `[[IsExtensible]]` returns false, all future calls to `[[IsExtensible]]` on the target must return false.

##### `[[PreventExtensions]]` ( )

- The normal return type is Boolean.
- If `[[PreventExtensions]]` returns true, all future calls to `[[IsExtensible]]` on the target must return false and the target is now considered non-extensible.

##### `[[GetOwnProperty]]` ( `P` )

- The normal return type is either [Property Descriptor](#sec-property-descriptor-specification-type) or Undefined.
- If the return value is a [Property Descriptor](#sec-property-descriptor-specification-type), it must be a [fully populated Property Descriptor](#sec-property-descriptor-specification-type).
- If `P` is described as a non-configurable, non-writable own [data property](#sec-object-type), all future calls to `[[GetOwnProperty]]` ( `P` ) must return [Property Descriptor](#sec-property-descriptor-specification-type) whose `[[Value]]` is [SameValue](#sec-samevalue) as `P`'s `[[Value]]` attribute.
- If `P`'s attributes other than `[[Writable]]` and `[[Value]]` may change over time, or if the property might be deleted, then `P`'s `[[Configurable]]` attribute must be true.
- If the `[[Writable]]` attribute may change from false to true, then the `[[Configurable]]` attribute must be true.
- If the target is non-extensible and `P` is non-existent, then all future calls to `[[GetOwnProperty]]` (`P`) on the target must describe `P` as non-existent (i.e. `[[GetOwnProperty]]` (`P`) must return undefined).

Note 3

As a consequence of the third invariant, if a property is described as a [data property](#sec-object-type) and it may return different values over time, then either or both of the `[[Writable]]` and `[[Configurable]]` attributes must be true even if no mechanism to change the value is exposed via the other essential internal methods.

##### `[[DefineOwnProperty]]` ( `P`, `Desc` )

- The normal return type is Boolean.
- `[[DefineOwnProperty]]` must return false if `P` has previously been observed as a non-configurable own property of the target, unless either:
  1.  `P` is a writable [data property](#sec-object-type). A non-configurable writable [data property](#sec-object-type) can be changed into a non-configurable non-writable [data property](#sec-object-type).
  2.  All attributes of `Desc` are the [SameValue](#sec-samevalue) as `P`'s attributes.
- `[[DefineOwnProperty]]` (`P`, `Desc`) must return false if target is non-extensible and `P` is a non-existent own property. That is, a non-extensible target object cannot be extended with new properties.

##### `[[HasProperty]]` ( `P` )

- The normal return type is Boolean.
- If `P` was previously observed as a non-configurable own data or [accessor property](#sec-object-type) of the target, `[[HasProperty]]` must return true.

##### `[[Get]]` ( `P`, `Receiver` )

- The normal return type is any [ECMAScript language type](#sec-ecmascript-language-types).
- If `P` was previously observed as a non-configurable, non-writable own [data property](#sec-object-type) of the target with value `V`, then `[[Get]]` must return the [SameValue](#sec-samevalue) as `V`.
- If `P` was previously observed as a non-configurable own [accessor property](#sec-object-type) of the target whose `[[Get]]` attribute is undefined, the `[[Get]]` operation must return undefined.

##### `[[Set]]` ( `P`, `V`, `Receiver` )

- The normal return type is Boolean.
- If `P` was previously observed as a non-configurable, non-writable own [data property](#sec-object-type) of the target, then `[[Set]]` must return false unless `V` is the [SameValue](#sec-samevalue) as `P`'s `[[Value]]` attribute.
- If `P` was previously observed as a non-configurable own [accessor property](#sec-object-type) of the target whose `[[Set]]` attribute is undefined, the `[[Set]]` operation must return false.

##### `[[Delete]]` ( `P` )

- The normal return type is Boolean.
- If `P` was previously observed as a non-configurable own data or [accessor property](#sec-object-type) of the target, `[[Delete]]` must return false.

##### `[[OwnPropertyKeys]]` ( )

- The normal return type is [List](#sec-list-and-record-specification-type).
- The returned [List](#sec-list-and-record-specification-type) must not contain any duplicate entries.
- Each element of the returned [List](#sec-list-and-record-specification-type) must be a [property key](#property-key).
- The returned [List](#sec-list-and-record-specification-type) must contain at least the keys of all non-configurable own properties that have previously been observed.
- If the target is non-extensible, the returned [List](#sec-list-and-record-specification-type) must contain only the keys of all own properties of the target that are observable using `[[GetOwnProperty]]`.

##### `[[Call]]` ( )

- The normal return type is any [ECMAScript language type](#sec-ecmascript-language-types).

##### `[[Construct]]` ( )

- The normal return type is Object.
- The target must also have a `[[Call]]` internal method.

#### 6.1.7.4 Well-Known Intrinsic Objects

Well-known intrinsics are built-in objects that are explicitly referenced by the algorithms of this specification and which usually have [realm](#realm)- specific identities. Unless otherwise specified each intrinsic object actually corresponds to a set of similar objects, one per [realm](#realm).

Within this specification a reference such as %name% means the intrinsic object, associated with the current [realm](#realm), corresponding to the name. A reference such as %name.a.b% means, as if the "b" property of the value of the "a" property of the intrinsic object %name% was accessed prior to any ECMAScript code being evaluated. Determination of the current [realm](#realm) and its intrinsics is described in [9.4](#sec-execution-contexts). The well-known intrinsics are listed in [Table 6](#table-well-known-intrinsic-objects).

| Intrinsic Name | Global Name | ECMAScript Language Association |
|----|----|----|
| [%AggregateError%](#sec-aggregate-error-constructor) | `AggregateError` | The `AggregateError` [constructor](#constructor) ([20.5.7.1](#sec-aggregate-error-constructor)) |
| [%Array%](#sec-array-constructor) | `Array` | The Array [constructor](#constructor) ([23.1.1](#sec-array-constructor)) |
| [%ArrayBuffer%](#sec-arraybuffer-constructor) | `ArrayBuffer` | The ArrayBuffer [constructor](#constructor) ([25.1.4](#sec-arraybuffer-constructor)) |
| [%ArrayIteratorPrototype%](#sec-%arrayiteratorprototype%-object) |  | The prototype of [Array Iterator objects](#sec-array-iterator-objects) ([23.1.5](#sec-array-iterator-objects)) |
| [%AsyncFromSyncIteratorPrototype%](#sec-%asyncfromsynciteratorprototype%-object) |  | The prototype of [Async-from-Sync Iterator objects](#sec-async-from-sync-iterator-objects) ([27.1.6](#sec-async-from-sync-iterator-objects)) |
| [%AsyncFunction%](#sec-async-function-constructor) |  | The [constructor](#constructor) of async [function objects](#function-object) ([27.7.1](#sec-async-function-constructor)) |
| [%AsyncGeneratorFunction%](#sec-asyncgeneratorfunction-constructor) |  | The [constructor](#constructor) of async generator [function objects](#function-object) ([27.4.1](#sec-asyncgeneratorfunction-constructor)) |
| [%AsyncGeneratorPrototype%](#sec-properties-of-asyncgenerator-prototype) |  | The prototype of async generator objects ([27.6](#sec-asyncgenerator-objects)) |
| [%AsyncIteratorPrototype%](#sec-asynciteratorprototype) |  | An object that all standard built-in [async iterator objects](#sec-asynciterator-interface) indirectly inherit from |
| [%Atomics%](#sec-atomics-object) | `Atomics` | The `Atomics` object ([25.4](#sec-atomics-object)) |
| [%BigInt%](#sec-bigint-constructor) | `BigInt` | The BigInt [constructor](#constructor) ([21.2.1](#sec-bigint-constructor)) |
| [%BigInt64Array%](#sec-typedarray-objects) | `BigInt64Array` | The BigInt64Array [constructor](#constructor) ([23.2](#sec-typedarray-objects)) |
| [%BigUint64Array%](#sec-typedarray-objects) | `BigUint64Array` | The BigUint64Array [constructor](#constructor) ([23.2](#sec-typedarray-objects)) |
| [%Boolean%](#sec-boolean-constructor) | `Boolean` | The Boolean [constructor](#constructor) ([20.3.1](#sec-boolean-constructor)) |
| [%DataView%](#sec-dataview-constructor) | `DataView` | The DataView [constructor](#constructor) ([25.3.2](#sec-dataview-constructor)) |
| [%Date%](#sec-date-constructor) | `Date` | The Date [constructor](#constructor) ([21.4.2](#sec-date-constructor)) |
| [%decodeURI%](#sec-decodeuri-encodeduri) | `decodeURI` | The `decodeURI` function ([19.2.6.1](#sec-decodeuri-encodeduri)) |
| [%decodeURIComponent%](#sec-decodeuricomponent-encodeduricomponent) | `decodeURIComponent` | The `decodeURIComponent` function ([19.2.6.2](#sec-decodeuricomponent-encodeduricomponent)) |
| [%encodeURI%](#sec-encodeuri-uri) | `encodeURI` | The `encodeURI` function ([19.2.6.3](#sec-encodeuri-uri)) |
| [%encodeURIComponent%](#sec-encodeuricomponent-uricomponent) | `encodeURIComponent` | The `encodeURIComponent` function ([19.2.6.4](#sec-encodeuricomponent-uricomponent)) |
| [%Error%](#sec-error-constructor) | `Error` | The Error [constructor](#constructor) ([20.5.1](#sec-error-constructor)) |
| [%eval%](#sec-eval-x) | `eval` | The `eval` function ([19.2.1](#sec-eval-x)) |
| [%EvalError%](#sec-native-error-types-used-in-this-standard-evalerror) | `EvalError` | The EvalError [constructor](#constructor) ([20.5.5.1](#sec-native-error-types-used-in-this-standard-evalerror)) |
| [%FinalizationRegistry%](#sec-finalization-registry-constructor) | `FinalizationRegistry` | The [FinalizationRegistry](#sec-finalization-registry-constructor) [constructor](#constructor) ([26.2.1](#sec-finalization-registry-constructor)) |
| [%Float16Array%](#sec-typedarray-objects) | `Float16Array` | The Float16Array [constructor](#constructor) ([23.2](#sec-typedarray-objects)) |
| [%Float32Array%](#sec-typedarray-objects) | `Float32Array` | The Float32Array [constructor](#constructor) ([23.2](#sec-typedarray-objects)) |
| [%Float64Array%](#sec-typedarray-objects) | `Float64Array` | The Float64Array [constructor](#constructor) ([23.2](#sec-typedarray-objects)) |
| [%ForInIteratorPrototype%](#sec-%foriniteratorprototype%-object) |  | The prototype of [For-In Iterator objects](#sec-for-in-iterator-objects) ([14.7.5.10](#sec-for-in-iterator-objects)) |
| [%Function%](#sec-function-constructor) | `Function` | The Function [constructor](#constructor) ([20.2.1](#sec-function-constructor)) |
| [%GeneratorFunction%](#sec-generatorfunction-constructor) |  | The [constructor](#constructor) of generator [function objects](#function-object) ([27.3.1](#sec-generatorfunction-constructor)) |
| [%GeneratorPrototype%](#sec-properties-of-generator-prototype) |  | The prototype of generator objects ([27.5](#sec-generator-objects)) |
| [%Int8Array%](#sec-typedarray-objects) | `Int8Array` | The Int8Array [constructor](#constructor) ([23.2](#sec-typedarray-objects)) |
| [%Int16Array%](#sec-typedarray-objects) | `Int16Array` | The Int16Array [constructor](#constructor) ([23.2](#sec-typedarray-objects)) |
| [%Int32Array%](#sec-typedarray-objects) | `Int32Array` | The Int32Array [constructor](#constructor) ([23.2](#sec-typedarray-objects)) |
| [%isFinite%](#sec-isfinite-number) | `isFinite` | The `isFinite` function ([19.2.2](#sec-isfinite-number)) |
| [%isNaN%](#sec-isnan-number) | `isNaN` | The `isNaN` function ([19.2.3](#sec-isnan-number)) |
| [%Iterator%](#sec-iterator-constructor) | `Iterator` | The `Iterator` [constructor](#constructor) ([27.1.3.1](#sec-iterator-constructor)) |
| [%IteratorHelperPrototype%](#sec-%iteratorhelperprototype%-object) |  | The prototype of [Iterator Helper objects](#sec-iterator-helper-objects) ([27.1.2.1](#sec-%iteratorhelperprototype%-object)) |
| [%JSON%](#sec-json-object) | `JSON` | The `JSON` object ([25.5](#sec-json-object)) |
| [%Map%](#sec-map-constructor) | `Map` | The Map [constructor](#constructor) ([24.1.1](#sec-map-constructor)) |
| [%MapIteratorPrototype%](#sec-%mapiteratorprototype%-object) |  | The prototype of [Map Iterator objects](#sec-map-iterator-objects) ([24.1.5](#sec-map-iterator-objects)) |
| [%Math%](#sec-math-object) | `Math` | The `Math` object ([21.3](#sec-math-object)) |
| [%Number%](#sec-number-constructor) | `Number` | The Number [constructor](#constructor) ([21.1.1](#sec-number-constructor)) |
| [%Object%](#sec-object-constructor) | `Object` | The Object [constructor](#constructor) ([20.1.1](#sec-object-constructor)) |
| [%parseFloat%](#sec-parsefloat-string) | `parseFloat` | The `parseFloat` function ([19.2.4](#sec-parsefloat-string)) |
| [%parseInt%](#sec-parseint-string-radix) | `parseInt` | The `parseInt` function ([19.2.5](#sec-parseint-string-radix)) |
| [%Promise%](#sec-promise-constructor) | `Promise` | The Promise [constructor](#constructor) ([27.2.3](#sec-promise-constructor)) |
| [%Proxy%](#sec-proxy-constructor) | `Proxy` | The Proxy [constructor](#constructor) ([28.2.1](#sec-proxy-constructor)) |
| [%RangeError%](#sec-native-error-types-used-in-this-standard-rangeerror) | `RangeError` | The RangeError [constructor](#constructor) ([20.5.5.2](#sec-native-error-types-used-in-this-standard-rangeerror)) |
| [%ReferenceError%](#sec-native-error-types-used-in-this-standard-referenceerror) | `ReferenceError` | The ReferenceError [constructor](#constructor) ([20.5.5.3](#sec-native-error-types-used-in-this-standard-referenceerror)) |
| [%Reflect%](#sec-reflect-object) | `Reflect` | The `Reflect` object ([28.1](#sec-reflect-object)) |
| [%RegExp%](#sec-regexp-constructor) | `RegExp` | The RegExp [constructor](#constructor) ([22.2.4](#sec-regexp-constructor)) |
| [%RegExpStringIteratorPrototype%](#sec-%regexpstringiteratorprototype%-object) |  | The prototype of [RegExp String Iterator objects](#sec-regexp-string-iterator-objects) ([22.2.9](#sec-regexp-string-iterator-objects)) |
| [%Set%](#sec-set-constructor) | `Set` | The Set [constructor](#constructor) ([24.2.2](#sec-set-constructor)) |
| [%SetIteratorPrototype%](#sec-%setiteratorprototype%-object) |  | The prototype of [Set Iterator objects](#sec-set-iterator-objects) ([24.2.6](#sec-set-iterator-objects)) |
| [%SharedArrayBuffer%](#sec-sharedarraybuffer-constructor) | `SharedArrayBuffer` | The SharedArrayBuffer [constructor](#constructor) ([25.2.3](#sec-sharedarraybuffer-constructor)) |
| [%String%](#sec-string-constructor) | `String` | The String [constructor](#constructor) ([22.1.1](#sec-string-constructor)) |
| [%StringIteratorPrototype%](#sec-%stringiteratorprototype%-object) |  | The prototype of [String Iterator objects](#sec-string-iterator-objects) ([22.1.5](#sec-string-iterator-objects)) |
| [%Symbol%](#sec-symbol-constructor) | `Symbol` | The Symbol [constructor](#constructor) ([20.4.1](#sec-symbol-constructor)) |
| [%SyntaxError%](#sec-native-error-types-used-in-this-standard-syntaxerror) | `SyntaxError` | The SyntaxError [constructor](#constructor) ([20.5.5.4](#sec-native-error-types-used-in-this-standard-syntaxerror)) |
| [%ThrowTypeError%](#sec-%throwtypeerror%) |  | A [function object](#function-object) that unconditionally throws a new instance of [%TypeError%](#sec-native-error-types-used-in-this-standard-typeerror) |
| [%TypedArray%](#sec-%typedarray%-intrinsic-object) |  | The super class of all typed Array [constructors](#constructor) ([23.2.1](#sec-%typedarray%-intrinsic-object)) |
| [%TypeError%](#sec-native-error-types-used-in-this-standard-typeerror) | `TypeError` | The TypeError [constructor](#constructor) ([20.5.5.5](#sec-native-error-types-used-in-this-standard-typeerror)) |
| [%Uint8Array%](#sec-typedarray-objects) | `Uint8Array` | The Uint8Array [constructor](#constructor) ([23.2](#sec-typedarray-objects)) |
| [%Uint8ClampedArray%](#sec-typedarray-objects) | `Uint8ClampedArray` | The Uint8ClampedArray [constructor](#constructor) ([23.2](#sec-typedarray-objects)) |
| [%Uint16Array%](#sec-typedarray-objects) | `Uint16Array` | The Uint16Array [constructor](#constructor) ([23.2](#sec-typedarray-objects)) |
| [%Uint32Array%](#sec-typedarray-objects) | `Uint32Array` | The Uint32Array [constructor](#constructor) ([23.2](#sec-typedarray-objects)) |
| [%URIError%](#sec-native-error-types-used-in-this-standard-urierror) | `URIError` | The URIError [constructor](#constructor) ([20.5.5.6](#sec-native-error-types-used-in-this-standard-urierror)) |
| [%WeakMap%](#sec-weakmap-constructor) | `WeakMap` | The WeakMap [constructor](#constructor) ([24.3.1](#sec-weakmap-constructor)) |
| [%WeakRef%](#sec-weak-ref-constructor) | `WeakRef` | The [WeakRef](#sec-weak-ref-constructor) [constructor](#constructor) ([26.1.1](#sec-weak-ref-constructor)) |
| [%WeakSet%](#sec-weakset-constructor) | `WeakSet` | The WeakSet [constructor](#constructor) ([24.4.1](#sec-weakset-constructor)) |
| [%WrapForValidIteratorPrototype%](#sec-%wrapforvaliditeratorprototype%-object) |  | The prototype of wrapped [iterator objects](#sec-iterator-interface) returned by Iterator.from ([27.1.3.2.1.1](#sec-%wrapforvaliditeratorprototype%-object)) |

Table 6: Well-Known Intrinsic Objects

Note

Additional entries in [Table 100](#table-additional-well-known-intrinsic-objects).

## 6.2 ECMAScript Specification Types

A specification type corresponds to meta-values that are used within algorithms to describe the semantics of ECMAScript language constructs and [ECMAScript language types](#sec-ecmascript-language-types). The specification types include [Reference Record](#sec-reference-record-specification-type), [List](#sec-list-and-record-specification-type), [Completion Record](#sec-completion-record-specification-type), [Property Descriptor](#sec-property-descriptor-specification-type), [Environment Record](#sec-environment-records), [Abstract Closure](#sec-abstract-closure), and [Data Block](#sec-data-blocks). Specification type values are specification artefacts that do not necessarily correspond to any specific entity within an ECMAScript implementation. Specification type values may be used to describe intermediate results of ECMAScript expression evaluation but such values cannot be stored as properties of objects or values of ECMAScript language variables.

### 6.2.1 The Enum Specification Type

Enums are values which are internal to the specification and not directly observable from ECMAScript code. Enums are denoted using a sans-serif typeface. For instance, a [Completion Record](#sec-completion-record-specification-type)'s `[[Type]]` field takes on values like normal, return, or throw. Enums have no characteristics other than their name. The name of an enum serves no purpose other than to distinguish it from other enums, and implies nothing about its usage or meaning in context.

### 6.2.2 The List and Record Specification Types

The List type is used to explain the evaluation of argument lists (see [13.3.8](#sec-argument-lists)) in `new` expressions, in function calls, and in other algorithms where a simple ordered list of values is needed. Values of the List type are simply ordered sequences of list elements containing the individual values. These sequences may be of any length. The elements of a list may be randomly accessed using 0-origin indices. For notational convenience an array-like syntax can be used to access List elements. For example, `arguments`\[2\] is shorthand for saying the 3^(rd) element of the List `arguments`.

When an algorithm iterates over the elements of a List without specifying an order, the order used is the order of the elements in the List.

For notational convenience within this specification, a literal syntax can be used to express a new List value. For example, « 1, 2 » defines a List value that has two elements each of which is initialized to a specific value. A new empty List can be expressed as « ».

In this specification, the phrase "the list-concatenation of `A`, `B`, ..." (where each argument is a possibly empty List) denotes a new List value whose elements are the concatenation of the elements (in order) of each of the arguments (in order).

As applied to a List of Strings, the phrase "sorted according to lexicographic code unit order" means sorting by the numeric value of each code unit up to the length of the shorter string, and sorting the shorter string before the longer string if all are equal, as described in the abstract operation [IsLessThan](#sec-islessthan).

The Record type is used to describe data aggregations within the algorithms of this specification. A Record type value consists of one or more named fields. The value of each field is an [ECMAScript language value](#sec-ecmascript-language-types) or specification value. Field names are always enclosed in double brackets, for example `[[Value]]`.

For notational convenience within this specification, an object literal-like syntax can be used to express a Record value. For example, { `[[Field1]]`: 42, `[[Field2]]`: false, `[[Field3]]`: empty } defines a Record value that has three fields, each of which is initialized to a specific value. Field name order is not significant. Any fields that are not explicitly listed are considered to be absent.

In specification text and algorithms, dot notation may be used to refer to a specific field of a Record value. For example, if R is the record shown in the previous paragraph then R.`[[Field2]]` is shorthand for “the field of R named `[[Field2]]`”.

Schema for commonly used Record field combinations may be named, and that name may be used as a prefix to a literal Record value to identify the specific kind of aggregations that is being described. For example: PropertyDescriptor { `[[Value]]`: 42, `[[Writable]]`: false, `[[Configurable]]`: true }.

### 6.2.3 The Set and Relation Specification Types

The *Set* type is used to explain a collection of unordered elements for use in the [memory model](#sec-memory-model). It is distinct from the ECMAScript collection type of the same name. To disambiguate, instances of the ECMAScript collection are consistently referred to as "Set objects" within this specification. Values of the Set type are simple collections of elements, where no element appears more than once. Elements may be added to and removed from Sets. Sets may be unioned, intersected, or subtracted from each other.

The Relation type is used to explain constraints on Sets. Values of the Relation type are Sets of ordered pairs of values from its value domain. For example, a Relation on events is a set of ordered pairs of events. For a Relation `R` and two values `a` and `b` in the value domain of `R`, `a` `R` `b` is shorthand for saying the ordered pair (`a`, `b`) is a member of `R`. A Relation is the least Relation with respect to some conditions when it is the smallest Relation that satisfies those conditions.

A strict partial order is a Relation value `R` that satisfies the following.

- For all `a`, `b`, and `c` in `R`'s domain:

  - It is not the case that `a` `R` `a`, and
  - If `a` `R` `b` and `b` `R` `c`, then `a` `R` `c`.

Note 1

The two properties above are called irreflexivity and transitivity, respectively.

A strict total order is a Relation value `R` that satisfies the following.

- For all `a`, `b`, and `c` in `R`'s domain:

  - `a` is `b` or `a` `R` `b` or `b` `R` `a`, and
  - It is not the case that `a` `R` `a`, and
  - If `a` `R` `b` and `b` `R` `c`, then `a` `R` `c`.

Note 2

The three properties above are called totality, irreflexivity, and transitivity, respectively.

### 6.2.4 The Completion Record Specification Type

The Completion Record specification type is used to explain the runtime propagation of values and control flow such as the behaviour of statements (`break`, `continue`, `return` and `throw`) that perform nonlocal transfers of control.

Completion Records have the fields defined in [Table 7](#table-completion-record-fields).

| Field Name | Value | Meaning |
|----|----|----|
| `[[Type]]` | normal, break, continue, return, or throw | The type of completion that occurred. |
| `[[Value]]` | any value except a [Completion Record](#sec-completion-record-specification-type) | The value that was produced. |
| `[[Target]]` | a String or empty | The target label for directed control transfers. |

Table 7: [Completion Record](#sec-completion-record-specification-type) Fields

The following shorthand terms are sometimes used to refer to Completion Records.

- normal completion refers to any Completion Record with a `[[Type]]` value of normal.
- break completion refers to any Completion Record with a `[[Type]]` value of break.
- continue completion refers to any Completion Record with a `[[Type]]` value of continue.
- return completion refers to any Completion Record with a `[[Type]]` value of return.
- throw completion refers to any Completion Record with a `[[Type]]` value of throw.
- abrupt completion refers to any Completion Record with a `[[Type]]` value other than normal.
- a normal completion containing some type of value refers to a normal completion that has a value of that type in its `[[Value]]` field.

Callable objects that are defined in this specification only return a normal completion or a throw completion. Returning any other kind of Completion Record is considered an editorial error.

[Implementation-defined](#implementation-defined) callable objects must return either a normal completion or a throw completion.

#### 6.2.4.1 NormalCompletion ( `value` )

The abstract operation NormalCompletion takes argument `value` (any value except a [Completion Record](#sec-completion-record-specification-type)) and returns a [normal completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Return [Completion Record](#sec-completion-record-specification-type) { `[[Type]]`: normal, `[[Value]]`: `value`, `[[Target]]`: empty }.

#### 6.2.4.2 ThrowCompletion ( `value` )

The abstract operation ThrowCompletion takes argument `value` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Return [Completion Record](#sec-completion-record-specification-type) { `[[Type]]`: throw, `[[Value]]`: `value`, `[[Target]]`: empty }.

#### 6.2.4.3 ReturnCompletion ( `value` )

The abstract operation ReturnCompletion takes argument `value` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns a [return completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Return [Completion Record](#sec-completion-record-specification-type) { `[[Type]]`: return, `[[Value]]`: `value`, `[[Target]]`: empty }.

#### 6.2.4.4 UpdateEmpty ( `completionRecord`, `value` )

The abstract operation UpdateEmpty takes arguments `completionRecord` (a [Completion Record](#sec-completion-record-specification-type)) and `value` (any value except a [Completion Record](#sec-completion-record-specification-type)) and returns a [Completion Record](#sec-completion-record-specification-type). It performs the following steps when called:

1.  [Assert](#assert): If `completionRecord` is either a [return completion](#sec-completion-record-specification-type) or a [throw completion](#sec-completion-record-specification-type), then `completionRecord`.`[[Value]]` is not empty.
2.  If `completionRecord`.`[[Value]]` is not empty, return ? `completionRecord`.
3.  Return [Completion Record](#sec-completion-record-specification-type) { `[[Type]]`: `completionRecord`.`[[Type]]`, `[[Value]]`: `value`, `[[Target]]`: `completionRecord`.`[[Target]]` }.

### 6.2.5 The Reference Record Specification Type

The Reference Record type is used to explain the behaviour of such operators as `delete`, `typeof`, the assignment operators, the `super` [keyword](#sec-keywords-and-reserved-words) and other language features. For example, the left-hand operand of an assignment is expected to produce a Reference Record.

A Reference Record is a resolved name or (possibly not-yet-resolved) property binding; its fields are defined by [Table 8](#table-reference-record-fields).

| Field Name | Value | Meaning |
|----|----|----|
| `[[Base]]` | an [ECMAScript language value](#sec-ecmascript-language-types), an [Environment Record](#sec-environment-records), or unresolvable | The value or [Environment Record](#sec-environment-records) which holds the binding. A `[[Base]]` of unresolvable indicates that the binding could not be resolved. |
| `[[ReferencedName]]` | an [ECMAScript language value](#sec-ecmascript-language-types) or a [Private Name](#sec-private-names) | The name of the binding. Always a String if `[[Base]]` value is an [Environment Record](#sec-environment-records). Otherwise, may be an [ECMAScript language value](#sec-ecmascript-language-types) other than a String or a Symbol until [ToPropertyKey](#sec-topropertykey) is performed. |
| `[[Strict]]` | a Boolean | true if the [Reference Record](#sec-reference-record-specification-type) originated in [strict mode code](#sec-strict-mode-code), false otherwise. |
| `[[ThisValue]]` | an [ECMAScript language value](#sec-ecmascript-language-types) or empty | If not empty, the [Reference Record](#sec-reference-record-specification-type) represents a property binding that was expressed using the `super` [keyword](#sec-keywords-and-reserved-words); it is called a Super Reference Record and its `[[Base]]` value will never be an [Environment Record](#sec-environment-records). In that case, the `[[ThisValue]]` field holds the this value at the time the [Reference Record](#sec-reference-record-specification-type) was created. |

Table 8: [Reference Record](#sec-reference-record-specification-type) Fields

The following [abstract operations](#sec-algorithm-conventions-abstract-operations) are used in this specification to operate upon Reference Records:

#### 6.2.5.1 IsPropertyReference ( `V` )

The abstract operation IsPropertyReference takes argument `V` (a [Reference Record](#sec-reference-record-specification-type)) and returns a Boolean. It performs the following steps when called:

1.  If `V`.`[[Base]]` is unresolvable, return false.
2.  If `V`.`[[Base]]` is an [Environment Record](#sec-environment-records), return false; otherwise return true.

#### 6.2.5.2 IsUnresolvableReference ( `V` )

The abstract operation IsUnresolvableReference takes argument `V` (a [Reference Record](#sec-reference-record-specification-type)) and returns a Boolean. It performs the following steps when called:

1.  If `V`.`[[Base]]` is unresolvable, return true; otherwise return false.

#### 6.2.5.3 IsSuperReference ( `V` )

The abstract operation IsSuperReference takes argument `V` (a [Reference Record](#sec-reference-record-specification-type)) and returns a Boolean. It performs the following steps when called:

1.  If `V`.`[[ThisValue]]` is not empty, return true; otherwise return false.

#### 6.2.5.4 IsPrivateReference ( `V` )

The abstract operation IsPrivateReference takes argument `V` (a [Reference Record](#sec-reference-record-specification-type)) and returns a Boolean. It performs the following steps when called:

1.  If `V`.`[[ReferencedName]]` is a [Private Name](#sec-private-names), return true; otherwise return false.

#### 6.2.5.5 GetValue ( `V` )

The abstract operation GetValue takes argument `V` (a [Reference Record](#sec-reference-record-specification-type) or an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [ECMAScript language value](#sec-ecmascript-language-types) or an [abrupt completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  If `V` is not a [Reference Record](#sec-reference-record-specification-type), return `V`.
2.  If [IsUnresolvableReference](#sec-isunresolvablereference)(`V`) is true, throw a ReferenceError exception.
3.  If [IsPropertyReference](#sec-ispropertyreference)(`V`) is true, then
    1.  Let `baseObj` be ? [ToObject](#sec-toobject)(`V`.`[[Base]]`).
    2.  If [IsPrivateReference](#sec-isprivatereference)(`V`) is true, then
        1.  Return ? [PrivateGet](#sec-privateget)(`baseObj`, `V`.`[[ReferencedName]]`).
    3.  If `V`.`[[ReferencedName]]` is not a [property key](#property-key), then
        1.  Set `V`.`[[ReferencedName]]` to ? [ToPropertyKey](#sec-topropertykey)(`V`.`[[ReferencedName]]`).
    4.  Return ? `baseObj`.`[[Get]]`(`V`.`[[ReferencedName]]`, [GetThisValue](#sec-getthisvalue)(`V`)).
4.  Else,
    1.  Let `base` be `V`.`[[Base]]`.
    2.  [Assert](#assert): `base` is an [Environment Record](#sec-environment-records).
    3.  Return ? `base`.GetBindingValue(`V`.`[[ReferencedName]]`, `V`.`[[Strict]]`) (see [9.1](#sec-environment-records)).

Note

The object that may be created in step [3.a](#step-getvalue-toobject) is not accessible outside of the above abstract operation and the [ordinary object](#ordinary-object) `[[Get]]` internal method. An implementation might choose to avoid the actual creation of the object.

#### 6.2.5.6 PutValue ( `V`, `W` )

The abstract operation PutValue takes arguments `V` (a [Reference Record](#sec-reference-record-specification-type) or an [ECMAScript language value](#sec-ecmascript-language-types)) and `W` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or an [abrupt completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  If `V` is not a [Reference Record](#sec-reference-record-specification-type), throw a ReferenceError exception.
2.  If [IsUnresolvableReference](#sec-isunresolvablereference)(`V`) is true, then
    1.  If `V`.`[[Strict]]` is true, throw a ReferenceError exception.
    2.  Let `globalObj` be [GetGlobalObject](#sec-getglobalobject)().
    3.  Perform ? [Set](#sec-set-o-p-v-throw)(`globalObj`, `V`.`[[ReferencedName]]`, `W`, false).
    4.  Return unused.
3.  If [IsPropertyReference](#sec-ispropertyreference)(`V`) is true, then
    1.  Let `baseObj` be ? [ToObject](#sec-toobject)(`V`.`[[Base]]`).
    2.  If [IsPrivateReference](#sec-isprivatereference)(`V`) is true, then
        1.  Return ? [PrivateSet](#sec-privateset)(`baseObj`, `V`.`[[ReferencedName]]`, `W`).
    3.  If `V`.`[[ReferencedName]]` is not a [property key](#property-key), then
        1.  Set `V`.`[[ReferencedName]]` to ? [ToPropertyKey](#sec-topropertykey)(`V`.`[[ReferencedName]]`).
    4.  Let `succeeded` be ? `baseObj`.`[[Set]]`(`V`.`[[ReferencedName]]`, `W`, [GetThisValue](#sec-getthisvalue)(`V`)).
    5.  If `succeeded` is false and `V`.`[[Strict]]` is true, throw a TypeError exception.
    6.  Return unused.
4.  Else,
    1.  Let `base` be `V`.`[[Base]]`.
    2.  [Assert](#assert): `base` is an [Environment Record](#sec-environment-records).
    3.  Return ? `base`.SetMutableBinding(`V`.`[[ReferencedName]]`, `W`, `V`.`[[Strict]]`) (see [9.1](#sec-environment-records)).

Note

The object that may be created in step [3.a](#step-putvalue-toobject) is not accessible outside of the above abstract operation and the [ordinary object](#ordinary-object) `[[Set]]` internal method. An implementation might choose to avoid the actual creation of that object.

#### 6.2.5.7 GetThisValue ( `V` )

The abstract operation GetThisValue takes argument `V` (a [Reference Record](#sec-reference-record-specification-type)) and returns an [ECMAScript language value](#sec-ecmascript-language-types). It performs the following steps when called:

1.  [Assert](#assert): [IsPropertyReference](#sec-ispropertyreference)(`V`) is true.
2.  If [IsSuperReference](#sec-issuperreference)(`V`) is true, return `V`.`[[ThisValue]]`; otherwise return `V`.`[[Base]]`.

#### 6.2.5.8 InitializeReferencedBinding ( `V`, `W` )

The abstract operation InitializeReferencedBinding takes arguments `V` (a [Reference Record](#sec-reference-record-specification-type)) and `W` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or an [abrupt completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  [Assert](#assert): [IsUnresolvableReference](#sec-isunresolvablereference)(`V`) is false.
2.  Let `base` be `V`.`[[Base]]`.
3.  [Assert](#assert): `base` is an [Environment Record](#sec-environment-records).
4.  Return ? `base`.InitializeBinding(`V`.`[[ReferencedName]]`, `W`).

#### 6.2.5.9 MakePrivateReference ( `baseValue`, `privateIdentifier` )

The abstract operation MakePrivateReference takes arguments `baseValue` (an [ECMAScript language value](#sec-ecmascript-language-types)) and `privateIdentifier` (a String) and returns a [Reference Record](#sec-reference-record-specification-type). It performs the following steps when called:

1.  Let `privateEnv` be the [running execution context](#running-execution-context)'s PrivateEnvironment.
2.  [Assert](#assert): `privateEnv` is not null.
3.  Let `privateName` be [ResolvePrivateIdentifier](#sec-resolve-private-identifier)(`privateEnv`, `privateIdentifier`).
4.  Return the [Reference Record](#sec-reference-record-specification-type) { `[[Base]]`: `baseValue`, `[[ReferencedName]]`: `privateName`, `[[Strict]]`: true, `[[ThisValue]]`: empty }.

### 6.2.6 The Property Descriptor Specification Type

The Property Descriptor type is used to explain the manipulation and reification of Object property attributes. A Property Descriptor is a [Record](#sec-list-and-record-specification-type) with zero or more fields, where each field's name is an attribute name and its value is a corresponding attribute value as specified in [6.1.7.1](#sec-property-attributes). The schema name used within this specification to tag literal descriptions of Property Descriptor records is “PropertyDescriptor”.

Property Descriptor values may be further classified as data Property Descriptors and accessor Property Descriptors based upon the existence or use of certain fields. A data Property Descriptor is one that includes any fields named either `[[Value]]` or `[[Writable]]`. An accessor Property Descriptor is one that includes any fields named either `[[Get]]` or `[[Set]]`. Any Property Descriptor may have fields named `[[Enumerable]]` and `[[Configurable]]`. A Property Descriptor value may not be both a data Property Descriptor and an accessor Property Descriptor; however, it may be neither (in which case it is a generic Property Descriptor). A fully populated Property Descriptor is one that is either an accessor Property Descriptor or a data Property Descriptor and that has all of the corresponding fields defined in [Table 3](#table-object-property-attributes).

The following [abstract operations](#sec-algorithm-conventions-abstract-operations) are used in this specification to operate upon Property Descriptor values:

#### 6.2.6.1 IsAccessorDescriptor ( `Desc` )

The abstract operation IsAccessorDescriptor takes argument `Desc` (a [Property Descriptor](#sec-property-descriptor-specification-type) or undefined) and returns a Boolean. It performs the following steps when called:

1.  If `Desc` is undefined, return false.
2.  If `Desc` has a `[[Get]]` field, return true.
3.  If `Desc` has a `[[Set]]` field, return true.
4.  Return false.

#### 6.2.6.2 IsDataDescriptor ( `Desc` )

The abstract operation IsDataDescriptor takes argument `Desc` (a [Property Descriptor](#sec-property-descriptor-specification-type) or undefined) and returns a Boolean. It performs the following steps when called:

1.  If `Desc` is undefined, return false.
2.  If `Desc` has a `[[Value]]` field, return true.
3.  If `Desc` has a `[[Writable]]` field, return true.
4.  Return false.

#### 6.2.6.3 IsGenericDescriptor ( `Desc` )

The abstract operation IsGenericDescriptor takes argument `Desc` (a [Property Descriptor](#sec-property-descriptor-specification-type) or undefined) and returns a Boolean. It performs the following steps when called:

1.  If `Desc` is undefined, return false.
2.  If [IsAccessorDescriptor](#sec-isaccessordescriptor)(`Desc`) is true, return false.
3.  If [IsDataDescriptor](#sec-isdatadescriptor)(`Desc`) is true, return false.
4.  Return true.

#### 6.2.6.4 FromPropertyDescriptor ( `Desc` )

The abstract operation FromPropertyDescriptor takes argument `Desc` (a [Property Descriptor](#sec-property-descriptor-specification-type) or undefined) and returns an Object or undefined. It performs the following steps when called:

1.  If `Desc` is undefined, return undefined.
2.  Let `obj` be [OrdinaryObjectCreate](#sec-ordinaryobjectcreate)([%Object.prototype%](#sec-properties-of-the-object-prototype-object)).
3.  [Assert](#assert): `obj` is an extensible [ordinary object](#ordinary-object) with no own properties.
4.  If `Desc` has a `[[Value]]` field, then
    1.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`obj`, "value", `Desc`.`[[Value]]`).
5.  If `Desc` has a `[[Writable]]` field, then
    1.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`obj`, "writable", `Desc`.`[[Writable]]`).
6.  If `Desc` has a `[[Get]]` field, then
    1.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`obj`, "get", `Desc`.`[[Get]]`).
7.  If `Desc` has a `[[Set]]` field, then
    1.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`obj`, "set", `Desc`.`[[Set]]`).
8.  If `Desc` has an `[[Enumerable]]` field, then
    1.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`obj`, "enumerable", `Desc`.`[[Enumerable]]`).
9.  If `Desc` has a `[[Configurable]]` field, then
    1.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`obj`, "configurable", `Desc`.`[[Configurable]]`).
10. Return `obj`.

#### 6.2.6.5 ToPropertyDescriptor ( `Obj` )

The abstract operation ToPropertyDescriptor takes argument `Obj` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a [Property Descriptor](#sec-property-descriptor-specification-type) or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  If `Obj` [is not an Object](#sec-object-type), throw a TypeError exception.
2.  Let `desc` be a new [Property Descriptor](#sec-property-descriptor-specification-type) that initially has no fields.
3.  Let `hasEnumerable` be ? [HasProperty](#sec-hasproperty)(`Obj`, "enumerable").
4.  If `hasEnumerable` is true, then
    1.  Let `enumerable` be [ToBoolean](#sec-toboolean)(? [Get](#sec-get-o-p)(`Obj`, "enumerable")).
    2.  Set `desc`.`[[Enumerable]]` to `enumerable`.
5.  Let `hasConfigurable` be ? [HasProperty](#sec-hasproperty)(`Obj`, "configurable").
6.  If `hasConfigurable` is true, then
    1.  Let `configurable` be [ToBoolean](#sec-toboolean)(? [Get](#sec-get-o-p)(`Obj`, "configurable")).
    2.  Set `desc`.`[[Configurable]]` to `configurable`.
7.  Let `hasValue` be ? [HasProperty](#sec-hasproperty)(`Obj`, "value").
8.  If `hasValue` is true, then
    1.  Let `value` be ? [Get](#sec-get-o-p)(`Obj`, "value").
    2.  Set `desc`.`[[Value]]` to `value`.
9.  Let `hasWritable` be ? [HasProperty](#sec-hasproperty)(`Obj`, "writable").
10. If `hasWritable` is true, then
    1.  Let `writable` be [ToBoolean](#sec-toboolean)(? [Get](#sec-get-o-p)(`Obj`, "writable")).
    2.  Set `desc`.`[[Writable]]` to `writable`.
11. Let `hasGet` be ? [HasProperty](#sec-hasproperty)(`Obj`, "get").
12. If `hasGet` is true, then
    1.  Let `getter` be ? [Get](#sec-get-o-p)(`Obj`, "get").
    2.  If [IsCallable](#sec-iscallable)(`getter`) is false and `getter` is not undefined, throw a TypeError exception.
    3.  Set `desc`.`[[Get]]` to `getter`.
13. Let `hasSet` be ? [HasProperty](#sec-hasproperty)(`Obj`, "set").
14. If `hasSet` is true, then
    1.  Let `setter` be ? [Get](#sec-get-o-p)(`Obj`, "set").
    2.  If [IsCallable](#sec-iscallable)(`setter`) is false and `setter` is not undefined, throw a TypeError exception.
    3.  Set `desc`.`[[Set]]` to `setter`.
15. If `desc` has a `[[Get]]` field or `desc` has a `[[Set]]` field, then
    1.  If `desc` has a `[[Value]]` field or `desc` has a `[[Writable]]` field, throw a TypeError exception.
16. Return `desc`.

#### 6.2.6.6 CompletePropertyDescriptor ( `Desc` )

The abstract operation CompletePropertyDescriptor takes argument `Desc` (a [Property Descriptor](#sec-property-descriptor-specification-type)) and returns unused. It performs the following steps when called:

1.  Let `like` be the [Record](#sec-list-and-record-specification-type) { `[[Value]]`: undefined, `[[Writable]]`: false, `[[Get]]`: undefined, `[[Set]]`: undefined, `[[Enumerable]]`: false, `[[Configurable]]`: false }.
2.  If [IsGenericDescriptor](#sec-isgenericdescriptor)(`Desc`) is true or [IsDataDescriptor](#sec-isdatadescriptor)(`Desc`) is true, then
    1.  If `Desc` does not have a `[[Value]]` field, set `Desc`.`[[Value]]` to `like`.`[[Value]]`.
    2.  If `Desc` does not have a `[[Writable]]` field, set `Desc`.`[[Writable]]` to `like`.`[[Writable]]`.
3.  Else,
    1.  If `Desc` does not have a `[[Get]]` field, set `Desc`.`[[Get]]` to `like`.`[[Get]]`.
    2.  If `Desc` does not have a `[[Set]]` field, set `Desc`.`[[Set]]` to `like`.`[[Set]]`.
4.  If `Desc` does not have an `[[Enumerable]]` field, set `Desc`.`[[Enumerable]]` to `like`.`[[Enumerable]]`.
5.  If `Desc` does not have a `[[Configurable]]` field, set `Desc`.`[[Configurable]]` to `like`.`[[Configurable]]`.
6.  Return unused.

### 6.2.7 The Environment Record Specification Type

The [Environment Record](#sec-environment-records) type is used to explain the behaviour of name resolution in nested functions and blocks. This type and the operations upon it are defined in [9.1](#sec-environment-records).

### 6.2.8 The Abstract Closure Specification Type

The Abstract Closure specification type is used to refer to algorithm steps together with a collection of values. Abstract Closures are meta-values and are invoked using function application style such as `closure`(`arg1`, `arg2`). Like [abstract operations](#sec-algorithm-conventions-abstract-operations), invocations perform the algorithm steps described by the Abstract Closure.

In algorithm steps that create an Abstract Closure, values are captured with the verb "capture" followed by a list of aliases. When an Abstract Closure is created, it captures the value that is associated with each alias at that time. In steps that specify the algorithm to be performed when an Abstract Closure is called, each captured value is referred to by the alias that was used to capture the value.

If an Abstract Closure returns a [Completion Record](#sec-completion-record-specification-type), that [Completion Record](#sec-completion-record-specification-type) must be either a [normal completion](#sec-completion-record-specification-type) or a [throw completion](#sec-completion-record-specification-type).

Abstract Closures are created inline as part of other algorithms, shown in the following example.

1.  Let `addend` be 41.
2.  Let `closure` be a new [Abstract Closure](#sec-abstract-closure) with parameters (`x`) that captures `addend` and performs the following steps when called:
    1.  Return `x` + `addend`.
3.  Let `val` be `closure`(1).
4.  [Assert](#assert): `val` is 42.

### 6.2.9 Data Blocks

The Data Block specification type is used to describe a distinct and mutable sequence of byte-sized (8 bit) numeric values. A byte value is an [integer](#integer) in the [inclusive interval](#inclusive-interval) from 0 to 255. A Data Block value is created with a fixed number of bytes that each have the initial value 0.

For notational convenience within this specification, an array-like syntax can be used to access the individual bytes of a Data Block value. This notation presents a Data Block value as a 0-based integer-indexed sequence of bytes. For example, if `db` is a 5 byte Data Block value then `db`\[2\] can be used to access its 3^(rd) byte.

A data block that resides in memory that can be referenced from multiple [agents](#agent) concurrently is designated a Shared Data Block. A Shared Data Block has an identity (for the purposes of equality testing Shared Data Block values) that is *address-free*: it is tied not to the virtual addresses the block is mapped to in any process, but to the set of locations in memory that the block represents. Two data blocks are equal only if the sets of the locations they contain are equal; otherwise, they are not equal and the intersection of the sets of locations they contain is empty. Finally, Shared Data Blocks can be distinguished from Data Blocks.

The semantics of Shared Data Blocks is defined using [Shared Data Block events](#sec-memory-model-fundamentals) by the [memory model](#sec-memory-model). [Abstract operations](#sec-algorithm-conventions-abstract-operations) below introduce [Shared Data Block events](#sec-memory-model-fundamentals) and act as the interface between evaluation semantics and the event semantics of the [memory model](#sec-memory-model). The events form a [candidate execution](#sec-candidate-executions), on which the [memory model](#sec-memory-model) acts as a filter. Please consult the [memory model](#sec-memory-model) for full semantics.

[Shared Data Block events](#sec-memory-model-fundamentals) are modelled by [Records](#sec-list-and-record-specification-type), defined in the [memory model](#sec-memory-model).

The following [abstract operations](#sec-algorithm-conventions-abstract-operations) are used in this specification to operate upon Data Block values:

#### 6.2.9.1 CreateByteDataBlock ( `size` )

The abstract operation CreateByteDataBlock takes argument `size` (a non-negative [integer](#integer)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a [Data Block](#sec-data-blocks) or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  If `size` \> 2\*\*⁵³ - 1, throw a RangeError exception.
2.  Let `db` be a new [Data Block](#sec-data-blocks) value consisting of `size` bytes. If it is impossible to create such a [Data Block](#sec-data-blocks), throw a RangeError exception.
3.  Set all of the bytes of `db` to 0.
4.  Return `db`.

#### 6.2.9.2 CreateSharedByteDataBlock ( `size` )

The abstract operation CreateSharedByteDataBlock takes argument `size` (a non-negative [integer](#integer)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a [Shared Data Block](#sec-data-blocks) or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `db` be a new [Shared Data Block](#sec-data-blocks) value consisting of `size` bytes. If it is impossible to create such a [Shared Data Block](#sec-data-blocks), throw a RangeError exception.
2.  Let `execution` be the `[[CandidateExecution]]` field of the [surrounding agent](#surrounding-agent)'s [Agent Record](#agent-record).
3.  Let `eventsRecord` be the [Agent Events Record](#sec-agent-event-records) of `execution`.`[[EventsRecords]]` whose `[[AgentSignifier]]` is [AgentSignifier](#sec-agentsignifier)().
4.  Let `zero` be « 0 ».
5.  For each index `i` of `db`, do
    1.  Append [WriteSharedMemory](#sec-memory-model-fundamentals) { `[[Order]]`: init, `[[NoTear]]`: true, `[[Block]]`: `db`, `[[ByteIndex]]`: `i`, `[[ElementSize]]`: 1, `[[Payload]]`: `zero` } to `eventsRecord`.`[[EventList]]`.
6.  Return `db`.

#### 6.2.9.3 CopyDataBlockBytes ( `toBlock`, `toIndex`, `fromBlock`, `fromIndex`, `count` )

The abstract operation CopyDataBlockBytes takes arguments `toBlock` (a [Data Block](#sec-data-blocks) or a [Shared Data Block](#sec-data-blocks)), `toIndex` (a non-negative [integer](#integer)), `fromBlock` (a [Data Block](#sec-data-blocks) or a [Shared Data Block](#sec-data-blocks)), `fromIndex` (a non-negative [integer](#integer)), and `count` (a non-negative [integer](#integer)) and returns unused. It performs the following steps when called:

1.  [Assert](#assert): `fromBlock` and `toBlock` are distinct values.
2.  Let `fromSize` be the number of bytes in `fromBlock`.
3.  [Assert](#assert): `fromIndex` + `count` ≤ `fromSize`.
4.  Let `toSize` be the number of bytes in `toBlock`.
5.  [Assert](#assert): `toIndex` + `count` ≤ `toSize`.
6.  Repeat, while `count` \> 0,
    1.  If `fromBlock` is a [Shared Data Block](#sec-data-blocks), then
        1.  Let `execution` be the `[[CandidateExecution]]` field of the [surrounding agent](#surrounding-agent)'s [Agent Record](#agent-record).
        2.  Let `eventsRecord` be the [Agent Events Record](#sec-agent-event-records) of `execution`.`[[EventsRecords]]` whose `[[AgentSignifier]]` is [AgentSignifier](#sec-agentsignifier)().
        3.  Let `bytes` be a [List](#sec-list-and-record-specification-type) whose sole element is a nondeterministically chosen [byte value](#sec-data-blocks).
        4.  NOTE: In implementations, `bytes` is the result of a non-atomic read instruction on the underlying hardware. The nondeterminism is a semantic prescription of the [memory model](#sec-memory-model) to describe observable behaviour of hardware with weak consistency.
        5.  Let `readEvent` be [ReadSharedMemory](#sec-memory-model-fundamentals) { `[[Order]]`: unordered, `[[NoTear]]`: true, `[[Block]]`: `fromBlock`, `[[ByteIndex]]`: `fromIndex`, `[[ElementSize]]`: 1 }.
        6.  Append `readEvent` to `eventsRecord`.`[[EventList]]`.
        7.  Append [Chosen Value Record](#sec-chosen-value-records) { `[[Event]]`: `readEvent`, `[[ChosenValue]]`: `bytes` } to `execution`.`[[ChosenValues]]`.
        8.  If `toBlock` is a [Shared Data Block](#sec-data-blocks), then
            1.  Append [WriteSharedMemory](#sec-memory-model-fundamentals) { `[[Order]]`: unordered, `[[NoTear]]`: true, `[[Block]]`: `toBlock`, `[[ByteIndex]]`: `toIndex`, `[[ElementSize]]`: 1, `[[Payload]]`: `bytes` } to `eventsRecord`.`[[EventList]]`.
        9.  Else,
            1.  Set `toBlock`\[`toIndex`\] to `bytes`\[0\].
    2.  Else,
        1.  [Assert](#assert): `toBlock` is not a [Shared Data Block](#sec-data-blocks).
        2.  Set `toBlock`\[`toIndex`\] to `fromBlock`\[`fromIndex`\].
    3.  Set `toIndex` to `toIndex` + 1.
    4.  Set `fromIndex` to `fromIndex` + 1.
    5.  Set `count` to `count` - 1.
7.  Return unused.

### 6.2.10 The PrivateElement Specification Type

The PrivateElement type is a [Record](#sec-list-and-record-specification-type) used in the specification of private class fields, methods, and accessors. Although [Property Descriptors](#sec-property-descriptor-specification-type) are not used for private elements, private fields behave similarly to non-configurable, non-enumerable, writable [data properties](#sec-object-type), private methods behave similarly to non-configurable, non-enumerable, non-writable [data properties](#sec-object-type), and private accessors behave similarly to non-configurable, non-enumerable [accessor properties](#sec-object-type).

Values of the PrivateElement type are [Record](#sec-list-and-record-specification-type) values whose fields are defined by [Table 9](#table-privateelement-fields). Such values are referred to as PrivateElements.

| Field Name | Values of the `[[Kind]]` field for which it is present | Value | Meaning |
|----|----|----|----|
| `[[Key]]` | All | a [Private Name](#sec-private-names) | The name of the field, method, or accessor. |
| `[[Kind]]` | All | field, method, or accessor | The kind of the element. |
| `[[Value]]` | field and method | an [ECMAScript language value](#sec-ecmascript-language-types) | The value of the field. |
| `[[Get]]` | accessor | a [function object](#function-object) or undefined | The getter for a private accessor. |
| `[[Set]]` | accessor | a [function object](#function-object) or undefined | The setter for a private accessor. |

Table 9: [PrivateElement](#sec-privateelement-specification-type) Fields

### 6.2.11 The ClassFieldDefinition Record Specification Type

The ClassFieldDefinition type is a [Record](#sec-list-and-record-specification-type) used in the specification of class fields.

Values of the ClassFieldDefinition type are [Record](#sec-list-and-record-specification-type) values whose fields are defined by [Table 10](#table-classfielddefinition-fields). Such values are referred to as ClassFieldDefinition Records.

| Field Name | Value | Meaning |
|----|----|----|
| `[[Name]]` | a [Private Name](#sec-private-names), a String, or a Symbol | The name of the field. |
| `[[Initializer]]` | an ECMAScript [function object](#function-object) or empty | The initializer of the field, if any. |

Table 10: [ClassFieldDefinition Record](#sec-classfielddefinition-record-specification-type) Fields

### 6.2.12 Private Names

The Private Name specification type is used to describe a globally unique value (one which differs from any other Private Name, even if they are otherwise indistinguishable) which represents the key of a private class element (field, method, or accessor). Each Private Name has an associated immutable `[[Description]]` which [is a String](#sec-ecmascript-language-types-string-type) value. A Private Name may be installed on any ECMAScript object with [PrivateFieldAdd](#sec-privatefieldadd) or [PrivateMethodOrAccessorAdd](#sec-privatemethodoraccessoradd), and then read or written using [PrivateGet](#sec-privateget) and [PrivateSet](#sec-privateset).

### 6.2.13 The ClassStaticBlockDefinition Record Specification Type

A ClassStaticBlockDefinition Record is a [Record](#sec-list-and-record-specification-type) value used to encapsulate the executable code for a class static initialization block.

ClassStaticBlockDefinition Records have the fields listed in [Table 11](#table-classstaticblockdefinition-record-fields).

| Field Name | Value | Meaning |
|----|----|----|
| `[[BodyFunction]]` | an ECMAScript [function object](#function-object) | The [function object](#function-object) to be called during static initialization of a class. |

Table 11: [ClassStaticBlockDefinition Record](#sec-classstaticblockdefinition-record-specification-type) Fields
