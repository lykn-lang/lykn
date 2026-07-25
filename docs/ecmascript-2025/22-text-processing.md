# 22 Text Processing

## 22.1 String Objects

### 22.1.1 The String Constructor

The String [constructor](#constructor):

- is %String%.
- is the initial value of the "String" property of the [global object](#sec-global-object).
- creates and initializes a new String object when called as a [constructor](#constructor).
- performs a type conversion when called as a function rather than as a [constructor](#constructor).
- may be used as the value of an `extends` clause of a class definition. Subclass [constructors](#constructor) that intend to inherit the specified String behaviour must include a `super` call to the String [constructor](#constructor) to create and initialize the subclass instance with a `[[StringData]]` internal slot.

#### 22.1.1.1 String ( `value` )

This function performs the following steps when called:

1.  If `value` is not present, then
    1.  Let `s` be the empty String.
2.  Else,
    1.  If NewTarget is undefined and `value` [is a Symbol](#sec-ecmascript-language-types-symbol-type), return [SymbolDescriptiveString](#sec-symboldescriptivestring)(`value`).
    2.  Let `s` be ? [ToString](#sec-tostring)(`value`).
3.  If NewTarget is undefined, return `s`.
4.  Return [StringCreate](#sec-stringcreate)(`s`, ? [GetPrototypeFromConstructor](#sec-getprototypefromconstructor)(NewTarget, "%String.prototype%")).

### 22.1.2 Properties of the String Constructor

The String [constructor](#constructor):

- has a `[[Prototype]]` internal slot whose value is [%Function.prototype%](#sec-properties-of-the-function-prototype-object).
- has the following properties:

#### 22.1.2.1 String.fromCharCode ( ...`codeUnits` )

This function may be called with any number of arguments which form the rest parameter `codeUnits`.

It performs the following steps when called:

1.  Let `result` be the empty String.
2.  For each element `next` of `codeUnits`, do
    1.  Let `nextCU` be the code unit whose numeric value is [ℝ](#ℝ)(? [ToUint16](#sec-touint16)(`next`)).
    2.  Set `result` to the [string-concatenation](#string-concatenation) of `result` and `nextCU`.
3.  Return `result`.

The "length" property of this function is 1_(𝔽).

#### 22.1.2.2 String.fromCodePoint ( ...`codePoints` )

This function may be called with any number of arguments which form the rest parameter `codePoints`.

It performs the following steps when called:

1.  Let `result` be the empty String.
2.  For each element `next` of `codePoints`, do
    1.  Let `nextCP` be ? [ToNumber](#sec-tonumber)(`next`).
    2.  If `nextCP` is not an [integral Number](#integral-number), throw a RangeError exception.
    3.  If [ℝ](#ℝ)(`nextCP`) \< 0 or [ℝ](#ℝ)(`nextCP`) \> 0x10FFFF, throw a RangeError exception.
    4.  Set `result` to the [string-concatenation](#string-concatenation) of `result` and [UTF16EncodeCodePoint](#sec-utf16encodecodepoint)([ℝ](#ℝ)(`nextCP`)).
3.  [Assert](#assert): If `codePoints` is empty, then `result` is the empty String.
4.  Return `result`.

The "length" property of this function is 1_(𝔽).

#### 22.1.2.3 String.prototype

The initial value of `String.prototype` is the [String prototype object](#sec-properties-of-the-string-prototype-object).

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

#### 22.1.2.4 String.raw ( `template`, ...`substitutions` )

This function may be called with a variable number of arguments. The first argument is `template` and the remainder of the arguments form the [List](#sec-list-and-record-specification-type) `substitutions`.

It performs the following steps when called:

1.  Let `substitutionCount` be the number of elements in `substitutions`.
2.  Let `cooked` be ? [ToObject](#sec-toobject)(`template`).
3.  Let `literals` be ? [ToObject](#sec-toobject)(? [Get](#sec-get-o-p)(`cooked`, "raw")).
4.  Let `literalCount` be ? [LengthOfArrayLike](#sec-lengthofarraylike)(`literals`).
5.  If `literalCount` ≤ 0, return the empty String.
6.  Let `R` be the empty String.
7.  Let `nextIndex` be 0.
8.  Repeat,
    1.  Let `nextLiteralVal` be ? [Get](#sec-get-o-p)(`literals`, ! [ToString](#sec-tostring)([𝔽](#𝔽)(`nextIndex`))).
    2.  Let `nextLiteral` be ? [ToString](#sec-tostring)(`nextLiteralVal`).
    3.  Set `R` to the [string-concatenation](#string-concatenation) of `R` and `nextLiteral`.
    4.  If `nextIndex` + 1 = `literalCount`, return `R`.
    5.  If `nextIndex` \< `substitutionCount`, then
        1.  Let `nextSubVal` be `substitutions`\[`nextIndex`\].
        2.  Let `nextSub` be ? [ToString](#sec-tostring)(`nextSubVal`).
        3.  Set `R` to the [string-concatenation](#string-concatenation) of `R` and `nextSub`.
    6.  Set `nextIndex` to `nextIndex` + 1.

Note

This function is intended for use as a tag function of a Tagged Template ([13.3.11](#sec-tagged-templates)). When called as such, the first argument will be a well formed template object and the rest parameter will contain the substitution values.

### 22.1.3 Properties of the String Prototype Object

The String prototype object:

- is %String.prototype%.
- [is a String](#sec-ecmascript-language-types-string-type) [exotic object](#exotic-object) and has the internal methods specified for such objects.
- has a `[[StringData]]` internal slot whose value is the empty String.
- has a "length" property whose initial value is +0_(𝔽) and whose attributes are { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.
- has a `[[Prototype]]` internal slot whose value is [%Object.prototype%](#sec-properties-of-the-object-prototype-object).

Unless explicitly stated otherwise, the methods of the String prototype object defined below are not generic and the this value passed to them must be either a String value or an object that has a `[[StringData]]` internal slot that has been initialized to a String value.

#### 22.1.3.1 String.prototype.at ( `index` )

1.  Let `O` be ? [RequireObjectCoercible](#sec-requireobjectcoercible)(this value).
2.  Let `S` be ? [ToString](#sec-tostring)(`O`).
3.  Let `len` be the length of `S`.
4.  Let `relativeIndex` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`index`).
5.  If `relativeIndex` ≥ 0, then
    1.  Let `k` be `relativeIndex`.
6.  Else,
    1.  Let `k` be `len` + `relativeIndex`.
7.  If `k` \< 0 or `k` ≥ `len`, return undefined.
8.  Return the [substring](#substring) of `S` from `k` to `k` + 1.

#### 22.1.3.2 String.prototype.charAt ( `pos` )

Note 1

This method returns a single element String containing the code unit at index `pos` within the String value resulting from converting this object to a String. If there is no element at that index, the result is the empty String. The result [is a String](#sec-ecmascript-language-types-string-type) value, not a String object.

If `pos` is an [integral Number](#integral-number), then the result of `x.charAt(pos)` is equivalent to the result of `x.substring(pos, pos + 1)`.

This method performs the following steps when called:

1.  Let `O` be ? [RequireObjectCoercible](#sec-requireobjectcoercible)(this value).
2.  Let `S` be ? [ToString](#sec-tostring)(`O`).
3.  Let `position` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`pos`).
4.  Let `size` be the length of `S`.
5.  If `position` \< 0 or `position` ≥ `size`, return the empty String.
6.  Return the [substring](#substring) of `S` from `position` to `position` + 1.

Note 2

This method is intentionally generic; it does not require that its this value be a String object. Therefore, it can be transferred to other kinds of objects for use as a method.

#### 22.1.3.3 String.prototype.charCodeAt ( `pos` )

Note 1

This method returns a Number (a non-negative [integral Number](#integral-number) less than 2\*\*¹⁶) that is the numeric value of the code unit at index `pos` within the String resulting from converting this object to a String. If there is no element at that index, the result is NaN.

This method performs the following steps when called:

1.  Let `O` be ? [RequireObjectCoercible](#sec-requireobjectcoercible)(this value).
2.  Let `S` be ? [ToString](#sec-tostring)(`O`).
3.  Let `position` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`pos`).
4.  Let `size` be the length of `S`.
5.  If `position` \< 0 or `position` ≥ `size`, return NaN.
6.  Return the [Number value for](#number-value-for) the numeric value of the code unit at index `position` within the String `S`.

Note 2

This method is intentionally generic; it does not require that its this value be a String object. Therefore it can be transferred to other kinds of objects for use as a method.

#### 22.1.3.4 String.prototype.codePointAt ( `pos` )

Note 1

This method returns a non-negative [integral Number](#integral-number) less than or equal to 0x10FFFF_(𝔽) that is the numeric value of the UTF-16 encoded code point ([6.1.4](#sec-ecmascript-language-types-string-type)) starting at the string element at index `pos` within the String resulting from converting this object to a String. If there is no element at that index, the result is undefined. If a valid UTF-16 [surrogate pair](#surrogate-pair) does not begin at `pos`, the result is the code unit at `pos`.

This method performs the following steps when called:

1.  Let `O` be ? [RequireObjectCoercible](#sec-requireobjectcoercible)(this value).
2.  Let `S` be ? [ToString](#sec-tostring)(`O`).
3.  Let `position` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`pos`).
4.  Let `size` be the length of `S`.
5.  If `position` \< 0 or `position` ≥ `size`, return undefined.
6.  Let `cp` be [CodePointAt](#sec-codepointat)(`S`, `position`).
7.  Return [𝔽](#𝔽)(`cp`.`[[CodePoint]]`).

Note 2

This method is intentionally generic; it does not require that its this value be a String object. Therefore it can be transferred to other kinds of objects for use as a method.

#### 22.1.3.5 String.prototype.concat ( ...`args` )

Note 1

When this method is called it returns the String value consisting of the code units of the this value (converted to a String) followed by the code units of each of the arguments converted to a String. The result [is a String](#sec-ecmascript-language-types-string-type) value, not a String object.

This method performs the following steps when called:

1.  Let `O` be ? [RequireObjectCoercible](#sec-requireobjectcoercible)(this value).
2.  Let `S` be ? [ToString](#sec-tostring)(`O`).
3.  Let `R` be `S`.
4.  For each element `next` of `args`, do
    1.  Let `nextString` be ? [ToString](#sec-tostring)(`next`).
    2.  Set `R` to the [string-concatenation](#string-concatenation) of `R` and `nextString`.
5.  Return `R`.

The "length" property of this method is 1_(𝔽).

Note 2

This method is intentionally generic; it does not require that its this value be a String object. Therefore it can be transferred to other kinds of objects for use as a method.

#### 22.1.3.6 String.prototype.constructor

The initial value of `String.prototype.constructor` is [%String%](#sec-string-constructor).

#### 22.1.3.7 String.prototype.endsWith ( `searchString` \[ , `endPosition` \] )

This method performs the following steps when called:

1.  Let `O` be ? [RequireObjectCoercible](#sec-requireobjectcoercible)(this value).
2.  Let `S` be ? [ToString](#sec-tostring)(`O`).
3.  Let `isRegExp` be ? [IsRegExp](#sec-isregexp)(`searchString`).
4.  If `isRegExp` is true, throw a TypeError exception.
5.  Let `searchStr` be ? [ToString](#sec-tostring)(`searchString`).
6.  Let `len` be the length of `S`.
7.  If `endPosition` is undefined, let `pos` be `len`; else let `pos` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`endPosition`).
8.  Let `end` be the result of [clamping](#clamping) `pos` between 0 and `len`.
9.  Let `searchLength` be the length of `searchStr`.
10. If `searchLength` = 0, return true.
11. Let `start` be `end` - `searchLength`.
12. If `start` \< 0, return false.
13. Let `substring` be the [substring](#substring) of `S` from `start` to `end`.
14. If `substring` is `searchStr`, return true.
15. Return false.

Note 1

This method returns true if the sequence of code units of `searchString` converted to a String is the same as the corresponding code units of this object (converted to a String) starting at `endPosition` - length(this). Otherwise it returns false.

Note 2

Throwing an exception if the first argument is a RegExp is specified in order to allow future editions to define extensions that allow such argument values.

Note 3

This method is intentionally generic; it does not require that its this value be a String object. Therefore, it can be transferred to other kinds of objects for use as a method.

#### 22.1.3.8 String.prototype.includes ( `searchString` \[ , `position` \] )

This method performs the following steps when called:

1.  Let `O` be ? [RequireObjectCoercible](#sec-requireobjectcoercible)(this value).
2.  Let `S` be ? [ToString](#sec-tostring)(`O`).
3.  Let `isRegExp` be ? [IsRegExp](#sec-isregexp)(`searchString`).
4.  If `isRegExp` is true, throw a TypeError exception.
5.  Let `searchStr` be ? [ToString](#sec-tostring)(`searchString`).
6.  Let `pos` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`position`).
7.  [Assert](#assert): If `position` is undefined, then `pos` is 0.
8.  Let `len` be the length of `S`.
9.  Let `start` be the result of [clamping](#clamping) `pos` between 0 and `len`.
10. Let `index` be [StringIndexOf](#sec-stringindexof)(`S`, `searchStr`, `start`).
11. If `index` is not-found, return false.
12. Return true.

Note 1

If `searchString` appears as a substring of the result of converting this object to a String, at one or more indices that are greater than or equal to `position`, this function returns true; otherwise, it returns false. If `position` is undefined, 0 is assumed, so as to search all of the String.

Note 2

Throwing an exception if the first argument is a RegExp is specified in order to allow future editions to define extensions that allow such argument values.

Note 3

This method is intentionally generic; it does not require that its this value be a String object. Therefore, it can be transferred to other kinds of objects for use as a method.

#### 22.1.3.9 String.prototype.indexOf ( `searchString` \[ , `position` \] )

Note 1

If `searchString` appears as a substring of the result of converting this object to a String, at one or more indices that are greater than or equal to `position`, then the smallest such index is returned; otherwise, -1_(𝔽) is returned. If `position` is undefined, +0_(𝔽) is assumed, so as to search all of the String.

This method performs the following steps when called:

1.  Let `O` be ? [RequireObjectCoercible](#sec-requireobjectcoercible)(this value).
2.  Let `S` be ? [ToString](#sec-tostring)(`O`).
3.  Let `searchStr` be ? [ToString](#sec-tostring)(`searchString`).
4.  Let `pos` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`position`).
5.  [Assert](#assert): If `position` is undefined, then `pos` is 0.
6.  Let `len` be the length of `S`.
7.  Let `start` be the result of [clamping](#clamping) `pos` between 0 and `len`.
8.  Let `result` be [StringIndexOf](#sec-stringindexof)(`S`, `searchStr`, `start`).
9.  If `result` is not-found, return -1_(𝔽).
10. Return [𝔽](#𝔽)(`result`).

Note 2

This method is intentionally generic; it does not require that its this value be a String object. Therefore, it can be transferred to other kinds of objects for use as a method.

#### 22.1.3.10 String.prototype.isWellFormed ( )

This method performs the following steps when called:

1.  Let `O` be ? [RequireObjectCoercible](#sec-requireobjectcoercible)(this value).
2.  Let `S` be ? [ToString](#sec-tostring)(`O`).
3.  Return [IsStringWellFormedUnicode](#sec-isstringwellformedunicode)(`S`).

#### 22.1.3.11 String.prototype.lastIndexOf ( `searchString` \[ , `position` \] )

Note 1

If `searchString` appears as a substring of the result of converting this object to a String at one or more indices that are smaller than or equal to `position`, then the greatest such index is returned; otherwise, -1_(𝔽) is returned. If `position` is undefined, the length of the String value is assumed, so as to search all of the String.

This method performs the following steps when called:

1.  Let `O` be ? [RequireObjectCoercible](#sec-requireobjectcoercible)(this value).
2.  Let `S` be ? [ToString](#sec-tostring)(`O`).
3.  Let `searchStr` be ? [ToString](#sec-tostring)(`searchString`).
4.  Let `numPos` be ? [ToNumber](#sec-tonumber)(`position`).
5.  [Assert](#assert): If `position` is undefined, then `numPos` is NaN.
6.  If `numPos` is NaN, let `pos` be +∞; otherwise, let `pos` be ! [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`numPos`).
7.  Let `len` be the length of `S`.
8.  Let `searchLen` be the length of `searchStr`.
9.  Let `start` be the result of [clamping](#clamping) `pos` between 0 and `len` - `searchLen`.
10. Let `result` be [StringLastIndexOf](#sec-stringlastindexof)(`S`, `searchStr`, `start`).
11. If `result` is not-found, return -1_(𝔽).
12. Return [𝔽](#𝔽)(`result`).

Note 2

This method is intentionally generic; it does not require that its this value be a String object. Therefore, it can be transferred to other kinds of objects for use as a method.

#### 22.1.3.12 String.prototype.localeCompare ( `that` \[ , `reserved1` \[ , `reserved2` \] \] )

An ECMAScript implementation that includes the ECMA-402 Internationalization API must implement this method as specified in the ECMA-402 specification. If an ECMAScript implementation does not include the ECMA-402 API the following specification of this method is used:

This method returns a Number other than NaN representing the result of an [implementation-defined](#implementation-defined) locale-sensitive String comparison of the this value (converted to a String `S`) with `that` (converted to a String `thatValue`). The result is intended to correspond with a [sort order](#sort-order) of String values according to conventions of the [host environment](#host-environment)'s current locale, and will be negative when `S` is ordered before `thatValue`, positive when `S` is ordered after `thatValue`, and zero in all other cases (representing no relative ordering between `S` and `thatValue`).

Before performing the comparisons, this method performs the following steps to prepare the Strings:

1.  Let `O` be ? [RequireObjectCoercible](#sec-requireobjectcoercible)(this value).
2.  Let `S` be ? [ToString](#sec-tostring)(`O`).
3.  Let `thatValue` be ? [ToString](#sec-tostring)(`that`).

The meaning of the optional second and third parameters to this method are defined in the ECMA-402 specification; implementations that do not include ECMA-402 support must not assign any other interpretation to those parameter positions.

The actual return values are [implementation-defined](#implementation-defined) to permit encoding additional information in them, but this method, when considered as a method of two arguments, is required to be a [consistent comparator](#consistent-comparator) defining a total ordering on the set of all Strings. This method is also required to recognize and honour canonical equivalence according to the Unicode Standard, including returning +0_(𝔽) when comparing distinguishable Strings that are canonically equivalent.

Note 1

This method itself is not directly suitable as an argument to `Array.prototype.sort` because the latter requires a function of two arguments.

Note 2

This method may rely on whatever language- and/or locale-sensitive comparison functionality is available to the ECMAScript environment from the [host environment](#host-environment), and is intended to compare according to the conventions of the [host environment](#host-environment)'s current locale. However, regardless of comparison capabilities, this method must recognize and honour canonical equivalence according to the Unicode Standard—for example, the following comparisons must all return +0_(𝔽):

``` javascript
// Å ANGSTROM SIGN vs.
// Å LATIN CAPITAL LETTER A + COMBINING RING ABOVE
"\u212B".localeCompare("A\u030A")

// Ω OHM SIGN vs.
// Ω GREEK CAPITAL LETTER OMEGA
"\u2126".localeCompare("\u03A9")

// ṩ LATIN SMALL LETTER S WITH DOT BELOW AND DOT ABOVE vs.
// ṩ LATIN SMALL LETTER S + COMBINING DOT ABOVE + COMBINING DOT BELOW
"\u1E69".localeCompare("s\u0307\u0323")

// ḍ̇ LATIN SMALL LETTER D WITH DOT ABOVE + COMBINING DOT BELOW vs.
// ḍ̇ LATIN SMALL LETTER D WITH DOT BELOW + COMBINING DOT ABOVE
"\u1E0B\u0323".localeCompare("\u1E0D\u0307")

// 가 HANGUL CHOSEONG KIYEOK + HANGUL JUNGSEONG A vs.
// 가 HANGUL SYLLABLE GA
"\u1100\u1161".localeCompare("\uAC00")
```

For a definition and discussion of canonical equivalence see the Unicode Standard, chapters 2 and 3, as well as [Unicode Standard Annex \#15, Unicode Normalization Forms](https://unicode.org/reports/tr15/) and [Unicode Technical Note \#5, Canonical Equivalence in Applications](https://unicode.org/notes/tn5/). Also see [Unicode Technical Standard \#10, Unicode Collation Algorithm](https://unicode.org/reports/tr10/).

It is recommended that this method should not honour Unicode compatibility equivalents or compatibility decompositions as defined in the Unicode Standard, chapter 3, section 3.7.

Note 3

This method is intentionally generic; it does not require that its this value be a String object. Therefore, it can be transferred to other kinds of objects for use as a method.

#### 22.1.3.13 String.prototype.match ( `regexp` )

This method performs the following steps when called:

1.  Let `O` be ? [RequireObjectCoercible](#sec-requireobjectcoercible)(this value).
2.  If `regexp` is neither undefined nor null, then
    1.  Let `matcher` be ? [GetMethod](#sec-getmethod)(`regexp`, [%Symbol.match%](#sec-well-known-symbols)).
    2.  If `matcher` is not undefined, then
        1.  Return ? [Call](#sec-call)(`matcher`, `regexp`, « `O` »).
3.  Let `S` be ? [ToString](#sec-tostring)(`O`).
4.  Let `rx` be ? [RegExpCreate](#sec-regexpcreate)(`regexp`, undefined).
5.  Return ? [Invoke](#sec-invoke)(`rx`, [%Symbol.match%](#sec-well-known-symbols), « `S` »).

Note

This method is intentionally generic; it does not require that its this value be a String object. Therefore, it can be transferred to other kinds of objects for use as a method.

#### 22.1.3.14 String.prototype.matchAll ( `regexp` )

This method performs a regular expression match of the String representing the this value against `regexp` and returns an [iterator](#sec-iterator-interface) that yields match results. Each match result is an Array containing the matched portion of the String as the first element, followed by the portions matched by any capturing groups. If the regular expression never matches, the returned [iterator](#sec-iterator-interface) does not yield any match results.

It performs the following steps when called:

1.  Let `O` be ? [RequireObjectCoercible](#sec-requireobjectcoercible)(this value).
2.  If `regexp` is neither undefined nor null, then
    1.  Let `isRegExp` be ? [IsRegExp](#sec-isregexp)(`regexp`).
    2.  If `isRegExp` is true, then
        1.  Let `flags` be ? [Get](#sec-get-o-p)(`regexp`, "flags").
        2.  Perform ? [RequireObjectCoercible](#sec-requireobjectcoercible)(`flags`).
        3.  If ? [ToString](#sec-tostring)(`flags`) does not contain "g", throw a TypeError exception.
    3.  Let `matcher` be ? [GetMethod](#sec-getmethod)(`regexp`, [%Symbol.matchAll%](#sec-well-known-symbols)).
    4.  If `matcher` is not undefined, then
        1.  Return ? [Call](#sec-call)(`matcher`, `regexp`, « `O` »).
3.  Let `S` be ? [ToString](#sec-tostring)(`O`).
4.  Let `rx` be ? [RegExpCreate](#sec-regexpcreate)(`regexp`, "g").
5.  Return ? [Invoke](#sec-invoke)(`rx`, [%Symbol.matchAll%](#sec-well-known-symbols), « `S` »).

Note 1

This method is intentionally generic, it does not require that its this value be a String object. Therefore, it can be transferred to other kinds of objects for use as a method.

Note 2

Similarly to `String.prototype.split`, `String.prototype.matchAll` is designed to typically act without mutating its inputs.

#### 22.1.3.15 String.prototype.normalize ( \[ `form` \] )

This method performs the following steps when called:

1.  Let `O` be ? [RequireObjectCoercible](#sec-requireobjectcoercible)(this value).
2.  Let `S` be ? [ToString](#sec-tostring)(`O`).
3.  If `form` is undefined, let `f` be "NFC".
4.  Else, let `f` be ? [ToString](#sec-tostring)(`form`).
5.  If `f` is not one of "NFC", "NFD", "NFKC", or "NFKD", throw a RangeError exception.
6.  Let `ns` be the String value that is the result of normalizing `S` into the normalization form named by `f` as specified in [the latest Unicode Standard, Normalization Forms](https://www.unicode.org/versions/latest/ch03.pdf).
7.  Return `ns`.

Note

This method is intentionally generic; it does not require that its this value be a String object. Therefore it can be transferred to other kinds of objects for use as a method.

#### 22.1.3.16 String.prototype.padEnd ( `maxLength` \[ , `fillString` \] )

This method performs the following steps when called:

1.  Let `O` be ? [RequireObjectCoercible](#sec-requireobjectcoercible)(this value).
2.  Return ? [StringPaddingBuiltinsImpl](#sec-stringpaddingbuiltinsimpl)(`O`, `maxLength`, `fillString`, end).

#### 22.1.3.17 String.prototype.padStart ( `maxLength` \[ , `fillString` \] )

This method performs the following steps when called:

1.  Let `O` be ? [RequireObjectCoercible](#sec-requireobjectcoercible)(this value).
2.  Return ? [StringPaddingBuiltinsImpl](#sec-stringpaddingbuiltinsimpl)(`O`, `maxLength`, `fillString`, start).

##### 22.1.3.17.1 StringPaddingBuiltinsImpl ( `O`, `maxLength`, `fillString`, `placement` )

The abstract operation StringPaddingBuiltinsImpl takes arguments `O` (an [ECMAScript language value](#sec-ecmascript-language-types)), `maxLength` (an [ECMAScript language value](#sec-ecmascript-language-types)), `fillString` (an [ECMAScript language value](#sec-ecmascript-language-types)), and `placement` (start or end) and returns either a [normal completion containing](#sec-completion-record-specification-type) a String or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `S` be ? [ToString](#sec-tostring)(`O`).
2.  Let `intMaxLength` be [ℝ](#ℝ)(? [ToLength](#sec-tolength)(`maxLength`)).
3.  Let `stringLength` be the length of `S`.
4.  If `intMaxLength` ≤ `stringLength`, return `S`.
5.  If `fillString` is undefined, set `fillString` to the String value consisting solely of the code unit 0x0020 (SPACE).
6.  Else, set `fillString` to ? [ToString](#sec-tostring)(`fillString`).
7.  Return [StringPad](#sec-stringpad)(`S`, `intMaxLength`, `fillString`, `placement`).

##### 22.1.3.17.2 StringPad ( `S`, `maxLength`, `fillString`, `placement` )

The abstract operation StringPad takes arguments `S` (a String), `maxLength` (a non-negative [integer](#integer)), `fillString` (a String), and `placement` (start or end) and returns a String. It performs the following steps when called:

1.  Let `stringLength` be the length of `S`.
2.  If `maxLength` ≤ `stringLength`, return `S`.
3.  If `fillString` is the empty String, return `S`.
4.  Let `fillLen` be `maxLength` - `stringLength`.
5.  Let `truncatedStringFiller` be the String value consisting of repeated concatenations of `fillString` truncated to length `fillLen`.
6.  If `placement` is start, return the [string-concatenation](#string-concatenation) of `truncatedStringFiller` and `S`.
7.  Else, return the [string-concatenation](#string-concatenation) of `S` and `truncatedStringFiller`.

Note 1

The argument `maxLength` will be clamped such that it can be no smaller than the length of `S`.

Note 2

The argument `fillString` defaults to " " (the String value consisting of the code unit 0x0020 SPACE).

##### 22.1.3.17.3 ToZeroPaddedDecimalString ( `n`, `minLength` )

The abstract operation ToZeroPaddedDecimalString takes arguments `n` (a non-negative [integer](#integer)) and `minLength` (a non-negative [integer](#integer)) and returns a String. It performs the following steps when called:

1.  Let `S` be the String representation of `n`, formatted as a decimal number.
2.  Return [StringPad](#sec-stringpad)(`S`, `minLength`, "0", start).

#### 22.1.3.18 String.prototype.repeat ( `count` )

This method performs the following steps when called:

1.  Let `O` be ? [RequireObjectCoercible](#sec-requireobjectcoercible)(this value).
2.  Let `S` be ? [ToString](#sec-tostring)(`O`).
3.  Let `n` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`count`).
4.  If `n` \< 0 or `n` = +∞, throw a RangeError exception.
5.  If `n` = 0, return the empty String.
6.  Return the String value that is made from `n` copies of `S` appended together.

Note 1

This method creates the String value consisting of the code units of the this value (converted to String) repeated `count` times.

Note 2

This method is intentionally generic; it does not require that its this value be a String object. Therefore, it can be transferred to other kinds of objects for use as a method.

#### 22.1.3.19 String.prototype.replace ( `searchValue`, `replaceValue` )

This method performs the following steps when called:

1.  Let `O` be ? [RequireObjectCoercible](#sec-requireobjectcoercible)(this value).
2.  If `searchValue` is neither undefined nor null, then
    1.  Let `replacer` be ? [GetMethod](#sec-getmethod)(`searchValue`, [%Symbol.replace%](#sec-well-known-symbols)).
    2.  If `replacer` is not undefined, then
        1.  Return ? [Call](#sec-call)(`replacer`, `searchValue`, « `O`, `replaceValue` »).
3.  Let `string` be ? [ToString](#sec-tostring)(`O`).
4.  Let `searchString` be ? [ToString](#sec-tostring)(`searchValue`).
5.  Let `functionalReplace` be [IsCallable](#sec-iscallable)(`replaceValue`).
6.  If `functionalReplace` is false, then
    1.  Set `replaceValue` to ? [ToString](#sec-tostring)(`replaceValue`).
7.  Let `searchLength` be the length of `searchString`.
8.  Let `position` be [StringIndexOf](#sec-stringindexof)(`string`, `searchString`, 0).
9.  If `position` is not-found, return `string`.
10. Let `preceding` be the [substring](#substring) of `string` from 0 to `position`.
11. Let `following` be the [substring](#substring) of `string` from `position` + `searchLength`.
12. If `functionalReplace` is true, then
    1.  Let `replacement` be ? [ToString](#sec-tostring)(? [Call](#sec-call)(`replaceValue`, undefined, « `searchString`, [𝔽](#𝔽)(`position`), `string` »)).
13. Else,
    1.  [Assert](#assert): `replaceValue` [is a String](#sec-ecmascript-language-types-string-type).
    2.  Let `captures` be a new empty [List](#sec-list-and-record-specification-type).
    3.  Let `replacement` be ! [GetSubstitution](#sec-getsubstitution)(`searchString`, `string`, `position`, `captures`, undefined, `replaceValue`).
14. Return the [string-concatenation](#string-concatenation) of `preceding`, `replacement`, and `following`.

Note

This method is intentionally generic; it does not require that its this value be a String object. Therefore, it can be transferred to other kinds of objects for use as a method.

##### 22.1.3.19.1 GetSubstitution ( `matched`, `str`, `position`, `captures`, `namedCaptures`, `replacementTemplate` )

The abstract operation GetSubstitution takes arguments `matched` (a String), `str` (a String), `position` (a non-negative [integer](#integer)), `captures` (a [List](#sec-list-and-record-specification-type) of either Strings or undefined), `namedCaptures` (an Object or undefined), and `replacementTemplate` (a String) and returns either a [normal completion containing](#sec-completion-record-specification-type) a String or a [throw completion](#sec-completion-record-specification-type). For the purposes of this abstract operation, a *decimal digit* is a code unit in the [inclusive interval](#inclusive-interval) from 0x0030 (DIGIT ZERO) to 0x0039 (DIGIT NINE). It performs the following steps when called:

1.  Let `stringLength` be the length of `str`.
2.  [Assert](#assert): `position` ≤ `stringLength`.
3.  Let `result` be the empty String.
4.  Let `templateRemainder` be `replacementTemplate`.
5.  Repeat, while `templateRemainder` is not the empty String,
    1.  NOTE: The following steps isolate `ref` (a prefix of `templateRemainder`), determine `refReplacement` (its replacement), and then append that replacement to `result`.
    2.  If `templateRemainder` starts with "\$\$", then
        1.  Let `ref` be "\$\$".
        2.  Let `refReplacement` be "\$".
    3.  Else if `templateRemainder` starts with "\$\`", then
        1.  Let `ref` be "\$\`".
        2.  Let `refReplacement` be the [substring](#substring) of `str` from 0 to `position`.
    4.  Else if `templateRemainder` starts with "\$&", then
        1.  Let `ref` be "\$&".
        2.  Let `refReplacement` be `matched`.
    5.  Else if `templateRemainder` starts with "\$'" (0x0024 (DOLLAR SIGN) followed by 0x0027 (APOSTROPHE)), then
        1.  Let `ref` be "\$'".
        2.  Let `matchLength` be the length of `matched`.
        3.  Let `tailPos` be `position` + `matchLength`.
        4.  Let `refReplacement` be the [substring](#substring) of `str` from [min](#eqn-min)(`tailPos`, `stringLength`).
        5.  NOTE: `tailPos` can exceed `stringLength` only if this abstract operation was invoked by a call to the intrinsic [%Symbol.replace%](#sec-well-known-symbols) method of [%RegExp.prototype%](#sec-properties-of-the-regexp-prototype-object) on an object whose "exec" property is not the intrinsic %RegExp.prototype.exec%.
    6.  Else if `templateRemainder` starts with "\$" followed by 1 or more decimal digits, then
        1.  If `templateRemainder` starts with "\$" followed by 2 or more decimal digits, let `digitCount` be 2. Otherwise, let `digitCount` be 1.
        2.  Let `digits` be the [substring](#substring) of `templateRemainder` from 1 to 1 + `digitCount`.
        3.  Let `index` be [ℝ](#ℝ)([StringToNumber](#sec-stringtonumber)(`digits`)).
        4.  [Assert](#assert): 0 ≤ `index` ≤ 99.
        5.  Let `captureLen` be the number of elements in `captures`.
        6.  If `index` \> `captureLen` and `digitCount` = 2, then
            1.  NOTE: When a two-digit replacement pattern specifies an index exceeding the count of capturing groups, it is treated as a one-digit replacement pattern followed by a literal digit.
            2.  Set `digitCount` to 1.
            3.  Set `digits` to the [substring](#substring) of `digits` from 0 to 1.
            4.  Set `index` to [ℝ](#ℝ)([StringToNumber](#sec-stringtonumber)(`digits`)).
        7.  Let `ref` be the [substring](#substring) of `templateRemainder` from 0 to 1 + `digitCount`.
        8.  If 1 ≤ `index` ≤ `captureLen`, then
            1.  Let `capture` be `captures`\[`index` - 1\].
            2.  If `capture` is undefined, then
                1.  Let `refReplacement` be the empty String.
            3.  Else,
                1.  Let `refReplacement` be `capture`.
        9.  Else,
            1.  Let `refReplacement` be `ref`.
    7.  Else if `templateRemainder` starts with "\$\<", then
        1.  Let `gtPos` be [StringIndexOf](#sec-stringindexof)(`templateRemainder`, "\>", 0).
        2.  If `gtPos` is not-found or `namedCaptures` is undefined, then
            1.  Let `ref` be "\$\<".
            2.  Let `refReplacement` be `ref`.
        3.  Else,
            1.  Let `ref` be the [substring](#substring) of `templateRemainder` from 0 to `gtPos` + 1.
            2.  Let `groupName` be the [substring](#substring) of `templateRemainder` from 2 to `gtPos`.
            3.  [Assert](#assert): `namedCaptures` [is an Object](#sec-object-type).
            4.  Let `capture` be ? [Get](#sec-get-o-p)(`namedCaptures`, `groupName`).
            5.  If `capture` is undefined, then
                1.  Let `refReplacement` be the empty String.
            6.  Else,
                1.  Let `refReplacement` be ? [ToString](#sec-tostring)(`capture`).
    8.  Else,
        1.  Let `ref` be the [substring](#substring) of `templateRemainder` from 0 to 1.
        2.  Let `refReplacement` be `ref`.
    9.  Let `refLength` be the length of `ref`.
    10. Set `templateRemainder` to the [substring](#substring) of `templateRemainder` from `refLength`.
    11. Set `result` to the [string-concatenation](#string-concatenation) of `result` and `refReplacement`.
6.  Return `result`.

#### 22.1.3.20 String.prototype.replaceAll ( `searchValue`, `replaceValue` )

This method performs the following steps when called:

1.  Let `O` be ? [RequireObjectCoercible](#sec-requireobjectcoercible)(this value).
2.  If `searchValue` is neither undefined nor null, then
    1.  Let `isRegExp` be ? [IsRegExp](#sec-isregexp)(`searchValue`).
    2.  If `isRegExp` is true, then
        1.  Let `flags` be ? [Get](#sec-get-o-p)(`searchValue`, "flags").
        2.  Perform ? [RequireObjectCoercible](#sec-requireobjectcoercible)(`flags`).
        3.  If ? [ToString](#sec-tostring)(`flags`) does not contain "g", throw a TypeError exception.
    3.  Let `replacer` be ? [GetMethod](#sec-getmethod)(`searchValue`, [%Symbol.replace%](#sec-well-known-symbols)).
    4.  If `replacer` is not undefined, then
        1.  Return ? [Call](#sec-call)(`replacer`, `searchValue`, « `O`, `replaceValue` »).
3.  Let `string` be ? [ToString](#sec-tostring)(`O`).
4.  Let `searchString` be ? [ToString](#sec-tostring)(`searchValue`).
5.  Let `functionalReplace` be [IsCallable](#sec-iscallable)(`replaceValue`).
6.  If `functionalReplace` is false, then
    1.  Set `replaceValue` to ? [ToString](#sec-tostring)(`replaceValue`).
7.  Let `searchLength` be the length of `searchString`.
8.  Let `advanceBy` be [max](#eqn-max)(1, `searchLength`).
9.  Let `matchPositions` be a new empty [List](#sec-list-and-record-specification-type).
10. Let `position` be [StringIndexOf](#sec-stringindexof)(`string`, `searchString`, 0).
11. Repeat, while `position` is not not-found,
    1.  Append `position` to `matchPositions`.
    2.  Set `position` to [StringIndexOf](#sec-stringindexof)(`string`, `searchString`, `position` + `advanceBy`).
12. Let `endOfLastMatch` be 0.
13. Let `result` be the empty String.
14. For each element `p` of `matchPositions`, do
    1.  Let `preserved` be the [substring](#substring) of `string` from `endOfLastMatch` to `p`.
    2.  If `functionalReplace` is true, then
        1.  Let `replacement` be ? [ToString](#sec-tostring)(? [Call](#sec-call)(`replaceValue`, undefined, « `searchString`, [𝔽](#𝔽)(`p`), `string` »)).
    3.  Else,
        1.  [Assert](#assert): `replaceValue` [is a String](#sec-ecmascript-language-types-string-type).
        2.  Let `captures` be a new empty [List](#sec-list-and-record-specification-type).
        3.  Let `replacement` be ! [GetSubstitution](#sec-getsubstitution)(`searchString`, `string`, `p`, `captures`, undefined, `replaceValue`).
    4.  Set `result` to the [string-concatenation](#string-concatenation) of `result`, `preserved`, and `replacement`.
    5.  Set `endOfLastMatch` to `p` + `searchLength`.
15. If `endOfLastMatch` \< the length of `string`, then
    1.  Set `result` to the [string-concatenation](#string-concatenation) of `result` and the [substring](#substring) of `string` from `endOfLastMatch`.
16. Return `result`.

#### 22.1.3.21 String.prototype.search ( `regexp` )

This method performs the following steps when called:

1.  Let `O` be ? [RequireObjectCoercible](#sec-requireobjectcoercible)(this value).
2.  If `regexp` is neither undefined nor null, then
    1.  Let `searcher` be ? [GetMethod](#sec-getmethod)(`regexp`, [%Symbol.search%](#sec-well-known-symbols)).
    2.  If `searcher` is not undefined, then
        1.  Return ? [Call](#sec-call)(`searcher`, `regexp`, « `O` »).
3.  Let `string` be ? [ToString](#sec-tostring)(`O`).
4.  Let `rx` be ? [RegExpCreate](#sec-regexpcreate)(`regexp`, undefined).
5.  Return ? [Invoke](#sec-invoke)(`rx`, [%Symbol.search%](#sec-well-known-symbols), « `string` »).

Note

This method is intentionally generic; it does not require that its this value be a String object. Therefore, it can be transferred to other kinds of objects for use as a method.

#### 22.1.3.22 String.prototype.slice ( `start`, `end` )

This method returns a substring of the result of converting this object to a String, starting from index `start` and running to, but not including, index `end` (or through the end of the String if `end` is undefined). If `start` is negative, it is treated as `sourceLength` + `start` where `sourceLength` is the length of the String. If `end` is negative, it is treated as `sourceLength` + `end` where `sourceLength` is the length of the String. The result [is a String](#sec-ecmascript-language-types-string-type) value, not a String object.

It performs the following steps when called:

1.  Let `O` be ? [RequireObjectCoercible](#sec-requireobjectcoercible)(this value).
2.  Let `S` be ? [ToString](#sec-tostring)(`O`).
3.  Let `len` be the length of `S`.
4.  Let `intStart` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`start`).
5.  If `intStart` = -∞, let `from` be 0.
6.  Else if `intStart` \< 0, let `from` be [max](#eqn-max)(`len` + `intStart`, 0).
7.  Else, let `from` be [min](#eqn-min)(`intStart`, `len`).
8.  If `end` is undefined, let `intEnd` be `len`; else let `intEnd` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`end`).
9.  If `intEnd` = -∞, let `to` be 0.
10. Else if `intEnd` \< 0, let `to` be [max](#eqn-max)(`len` + `intEnd`, 0).
11. Else, let `to` be [min](#eqn-min)(`intEnd`, `len`).
12. If `from` ≥ `to`, return the empty String.
13. Return the [substring](#substring) of `S` from `from` to `to`.

Note

This method is intentionally generic; it does not require that its this value be a String object. Therefore it can be transferred to other kinds of objects for use as a method.

#### 22.1.3.23 String.prototype.split ( `separator`, `limit` )

This method returns an Array into which substrings of the result of converting this object to a String have been stored. The substrings are determined by searching from left to right for occurrences of `separator`; these occurrences are not part of any String in the returned array, but serve to divide up the String value. The value of `separator` may be a String of any length or it may be an object, such as a RegExp, that has a [%Symbol.split%](#sec-well-known-symbols) method.

It performs the following steps when called:

1.  Let `O` be ? [RequireObjectCoercible](#sec-requireobjectcoercible)(this value).
2.  If `separator` is neither undefined nor null, then
    1.  Let `splitter` be ? [GetMethod](#sec-getmethod)(`separator`, [%Symbol.split%](#sec-well-known-symbols)).
    2.  If `splitter` is not undefined, then
        1.  Return ? [Call](#sec-call)(`splitter`, `separator`, « `O`, `limit` »).
3.  Let `S` be ? [ToString](#sec-tostring)(`O`).
4.  If `limit` is undefined, let `lim` be 2\*\*³² - 1; else let `lim` be [ℝ](#ℝ)(? [ToUint32](#sec-touint32)(`limit`)).
5.  Let `R` be ? [ToString](#sec-tostring)(`separator`).
6.  If `lim` = 0, then
    1.  Return [CreateArrayFromList](#sec-createarrayfromlist)(« »).
7.  If `separator` is undefined, then
    1.  Return [CreateArrayFromList](#sec-createarrayfromlist)(« `S` »).
8.  Let `separatorLength` be the length of `R`.
9.  If `separatorLength` = 0, then
    1.  Let `strLen` be the length of `S`.
    2.  Let `outLen` be the result of [clamping](#clamping) `lim` between 0 and `strLen`.
    3.  Let `head` be the [substring](#substring) of `S` from 0 to `outLen`.
    4.  Let `codeUnits` be a [List](#sec-list-and-record-specification-type) consisting of the sequence of code units that are the elements of `head`.
    5.  Return [CreateArrayFromList](#sec-createarrayfromlist)(`codeUnits`).
10. If `S` is the empty String, return [CreateArrayFromList](#sec-createarrayfromlist)(« `S` »).
11. Let `substrings` be a new empty [List](#sec-list-and-record-specification-type).
12. Let `i` be 0.
13. Let `j` be [StringIndexOf](#sec-stringindexof)(`S`, `R`, 0).
14. Repeat, while `j` is not not-found,
    1.  Let `T` be the [substring](#substring) of `S` from `i` to `j`.
    2.  Append `T` to `substrings`.
    3.  If the number of elements in `substrings` is `lim`, return [CreateArrayFromList](#sec-createarrayfromlist)(`substrings`).
    4.  Set `i` to `j` + `separatorLength`.
    5.  Set `j` to [StringIndexOf](#sec-stringindexof)(`S`, `R`, `i`).
15. Let `T` be the [substring](#substring) of `S` from `i`.
16. Append `T` to `substrings`.
17. Return [CreateArrayFromList](#sec-createarrayfromlist)(`substrings`).

Note 1

The value of `separator` may be an empty String. In this case, `separator` does not match the empty substring at the beginning or end of the input String, nor does it match the empty substring at the end of the previous separator match. If `separator` is the empty String, the String is split up into individual code unit elements; the length of the result array equals the length of the String, and each substring contains one code unit.

If the this value is (or converts to) the empty String, the result depends on whether `separator` can match the empty String. If it can, the result array contains no elements. Otherwise, the result array contains one element, which is the empty String.

If `separator` is undefined, then the result array contains just one String, which is the this value (converted to a String). If `limit` is not undefined, then the output array is truncated so that it contains no more than `limit` elements.

Note 2

This method is intentionally generic; it does not require that its this value be a String object. Therefore, it can be transferred to other kinds of objects for use as a method.

#### 22.1.3.24 String.prototype.startsWith ( `searchString` \[ , `position` \] )

This method performs the following steps when called:

1.  Let `O` be ? [RequireObjectCoercible](#sec-requireobjectcoercible)(this value).
2.  Let `S` be ? [ToString](#sec-tostring)(`O`).
3.  Let `isRegExp` be ? [IsRegExp](#sec-isregexp)(`searchString`).
4.  If `isRegExp` is true, throw a TypeError exception.
5.  Let `searchStr` be ? [ToString](#sec-tostring)(`searchString`).
6.  Let `len` be the length of `S`.
7.  If `position` is undefined, let `pos` be 0; else let `pos` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`position`).
8.  Let `start` be the result of [clamping](#clamping) `pos` between 0 and `len`.
9.  Let `searchLength` be the length of `searchStr`.
10. If `searchLength` = 0, return true.
11. Let `end` be `start` + `searchLength`.
12. If `end` \> `len`, return false.
13. Let `substring` be the [substring](#substring) of `S` from `start` to `end`.
14. If `substring` is `searchStr`, return true.
15. Return false.

Note 1

This method returns true if the sequence of code units of `searchString` converted to a String is the same as the corresponding code units of this object (converted to a String) starting at index `position`. Otherwise it returns false.

Note 2

Throwing an exception if the first argument is a RegExp is specified in order to allow future editions to define extensions that allow such argument values.

Note 3

This method is intentionally generic; it does not require that its this value be a String object. Therefore, it can be transferred to other kinds of objects for use as a method.

#### 22.1.3.25 String.prototype.substring ( `start`, `end` )

This method returns a substring of the result of converting this object to a String, starting from index `start` and running to, but not including, index `end` of the String (or through the end of the String if `end` is undefined). The result [is a String](#sec-ecmascript-language-types-string-type) value, not a String object.

If either argument is NaN or negative, it is replaced with zero; if either argument is strictly greater than the length of the String, it is replaced with the length of the String.

If `start` is strictly greater than `end`, they are swapped.

It performs the following steps when called:

1.  Let `O` be ? [RequireObjectCoercible](#sec-requireobjectcoercible)(this value).
2.  Let `S` be ? [ToString](#sec-tostring)(`O`).
3.  Let `len` be the length of `S`.
4.  Let `intStart` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`start`).
5.  If `end` is undefined, let `intEnd` be `len`; else let `intEnd` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`end`).
6.  Let `finalStart` be the result of [clamping](#clamping) `intStart` between 0 and `len`.
7.  Let `finalEnd` be the result of [clamping](#clamping) `intEnd` between 0 and `len`.
8.  Let `from` be [min](#eqn-min)(`finalStart`, `finalEnd`).
9.  Let `to` be [max](#eqn-max)(`finalStart`, `finalEnd`).
10. Return the [substring](#substring) of `S` from `from` to `to`.

Note

This method is intentionally generic; it does not require that its this value be a String object. Therefore, it can be transferred to other kinds of objects for use as a method.

#### 22.1.3.26 String.prototype.toLocaleLowerCase ( \[ `reserved1` \[ , `reserved2` \] \] )

An ECMAScript implementation that includes the ECMA-402 Internationalization API must implement this method as specified in the ECMA-402 specification. If an ECMAScript implementation does not include the ECMA-402 API the following specification of this method is used:

This method interprets a String value as a sequence of UTF-16 encoded code points, as described in [6.1.4](#sec-ecmascript-language-types-string-type).

It works exactly the same as `toLowerCase` except that it is intended to yield a locale-sensitive result corresponding with conventions of the [host environment](#host-environment)'s current locale. There will only be a difference in the few cases (such as Turkish) where the rules for that language conflict with the regular Unicode case mappings.

The meaning of the optional parameters to this method are defined in the ECMA-402 specification; implementations that do not include ECMA-402 support must not use those parameter positions for anything else.

Note

This method is intentionally generic; it does not require that its this value be a String object. Therefore, it can be transferred to other kinds of objects for use as a method.

#### 22.1.3.27 String.prototype.toLocaleUpperCase ( \[ `reserved1` \[ , `reserved2` \] \] )

An ECMAScript implementation that includes the ECMA-402 Internationalization API must implement this method as specified in the ECMA-402 specification. If an ECMAScript implementation does not include the ECMA-402 API the following specification of this method is used:

This method interprets a String value as a sequence of UTF-16 encoded code points, as described in [6.1.4](#sec-ecmascript-language-types-string-type).

It works exactly the same as `toUpperCase` except that it is intended to yield a locale-sensitive result corresponding with conventions of the [host environment](#host-environment)'s current locale. There will only be a difference in the few cases (such as Turkish) where the rules for that language conflict with the regular Unicode case mappings.

The meaning of the optional parameters to this method are defined in the ECMA-402 specification; implementations that do not include ECMA-402 support must not use those parameter positions for anything else.

Note

This method is intentionally generic; it does not require that its this value be a String object. Therefore, it can be transferred to other kinds of objects for use as a method.

#### 22.1.3.28 String.prototype.toLowerCase ( )

This method interprets a String value as a sequence of UTF-16 encoded code points, as described in [6.1.4](#sec-ecmascript-language-types-string-type).

It performs the following steps when called:

1.  Let `O` be ? [RequireObjectCoercible](#sec-requireobjectcoercible)(this value).
2.  Let `S` be ? [ToString](#sec-tostring)(`O`).
3.  Let `sText` be [StringToCodePoints](#sec-stringtocodepoints)(`S`).
4.  Let `lowerText` be toLowercase(`sText`), according to the Unicode Default Case Conversion algorithm.
5.  Let `L` be [CodePointsToString](#sec-codepointstostring)(`lowerText`).
6.  Return `L`.

The result must be derived according to the locale-insensitive case mappings in the Unicode Character Database (this explicitly includes not only the file [`UnicodeData.txt`](https://unicode.org/Public/UCD/latest/ucd/UnicodeData.txt), but also all locale-insensitive mappings in the file [`SpecialCasing.txt`](https://unicode.org/Public/UCD/latest/ucd/SpecialCasing.txt) that accompanies it).

Note 1

The case mapping of some code points may produce multiple code points. In this case the result String may not be the same length as the source String. Because both `toUpperCase` and `toLowerCase` have context-sensitive behaviour, the methods are not symmetrical. In other words, `s.toUpperCase().toLowerCase()` is not necessarily equal to `s.toLowerCase()`.

Note 2

This method is intentionally generic; it does not require that its this value be a String object. Therefore, it can be transferred to other kinds of objects for use as a method.

#### 22.1.3.29 String.prototype.toString ( )

This method performs the following steps when called:

1.  Return ? [ThisStringValue](#sec-thisstringvalue)(this value).

Note

For a String object, this method happens to return the same thing as the `valueOf` method.

#### 22.1.3.30 String.prototype.toUpperCase ( )

This method interprets a String value as a sequence of UTF-16 encoded code points, as described in [6.1.4](#sec-ecmascript-language-types-string-type).

It behaves in exactly the same way as `String.prototype.toLowerCase`, except that the String is mapped using the toUppercase algorithm of the Unicode Default Case Conversion.

Note

This method is intentionally generic; it does not require that its this value be a String object. Therefore, it can be transferred to other kinds of objects for use as a method.

#### 22.1.3.31 String.prototype.toWellFormed ( )

This method returns a String representation of this object with all [leading surrogates](#leading-surrogate) and [trailing surrogates](#trailing-surrogate) that are not part of a [surrogate pair](#surrogate-pair) replaced with U+FFFD (REPLACEMENT CHARACTER).

It performs the following steps when called:

1.  Let `O` be ? [RequireObjectCoercible](#sec-requireobjectcoercible)(this value).
2.  Let `S` be ? [ToString](#sec-tostring)(`O`).
3.  Let `strLen` be the length of `S`.
4.  Let `k` be 0.
5.  Let `result` be the empty String.
6.  Repeat, while `k` \< `strLen`,
    1.  Let `cp` be [CodePointAt](#sec-codepointat)(`S`, `k`).
    2.  If `cp`.`[[IsUnpairedSurrogate]]` is true, then
        1.  Set `result` to the [string-concatenation](#string-concatenation) of `result` and 0xFFFD (REPLACEMENT CHARACTER).
    3.  Else,
        1.  Set `result` to the [string-concatenation](#string-concatenation) of `result` and [UTF16EncodeCodePoint](#sec-utf16encodecodepoint)(`cp`.`[[CodePoint]]`).
    4.  Set `k` to `k` + `cp`.`[[CodeUnitCount]]`.
7.  Return `result`.

#### 22.1.3.32 String.prototype.trim ( )

This method interprets a String value as a sequence of UTF-16 encoded code points, as described in [6.1.4](#sec-ecmascript-language-types-string-type).

It performs the following steps when called:

1.  Let `S` be the this value.
2.  Return ? [TrimString](#sec-trimstring)(`S`, start+end).

Note

This method is intentionally generic; it does not require that its this value be a String object. Therefore, it can be transferred to other kinds of objects for use as a method.

##### 22.1.3.32.1 TrimString ( `string`, `where` )

The abstract operation TrimString takes arguments `string` (an [ECMAScript language value](#sec-ecmascript-language-types)) and `where` (start, end, or start+end) and returns either a [normal completion containing](#sec-completion-record-specification-type) a String or a [throw completion](#sec-completion-record-specification-type). It interprets `string` as a sequence of UTF-16 encoded code points, as described in [6.1.4](#sec-ecmascript-language-types-string-type). It performs the following steps when called:

1.  Let `str` be ? [RequireObjectCoercible](#sec-requireobjectcoercible)(`string`).
2.  Let `S` be ? [ToString](#sec-tostring)(`str`).
3.  If `where` is start, then
    1.  Let `T` be the String value that is a copy of `S` with leading white space removed.
4.  Else if `where` is end, then
    1.  Let `T` be the String value that is a copy of `S` with trailing white space removed.
5.  Else,
    1.  [Assert](#assert): `where` is start+end.
    2.  Let `T` be the String value that is a copy of `S` with both leading and trailing white space removed.
6.  Return `T`.

The definition of white space is the union of [WhiteSpace](#prod-WhiteSpace) and [LineTerminator](#prod-LineTerminator). When determining whether a Unicode code point is in Unicode general category “Space_Separator” (“Zs”), code unit sequences are interpreted as UTF-16 encoded code point sequences as specified in [6.1.4](#sec-ecmascript-language-types-string-type).

#### 22.1.3.33 String.prototype.trimEnd ( )

This method interprets a String value as a sequence of UTF-16 encoded code points, as described in [6.1.4](#sec-ecmascript-language-types-string-type).

It performs the following steps when called:

1.  Let `S` be the this value.
2.  Return ? [TrimString](#sec-trimstring)(`S`, end).

Note

This method is intentionally generic; it does not require that its this value be a String object. Therefore, it can be transferred to other kinds of objects for use as a method.

#### 22.1.3.34 String.prototype.trimStart ( )

This method interprets a String value as a sequence of UTF-16 encoded code points, as described in [6.1.4](#sec-ecmascript-language-types-string-type).

It performs the following steps when called:

1.  Let `S` be the this value.
2.  Return ? [TrimString](#sec-trimstring)(`S`, start).

Note

This method is intentionally generic; it does not require that its this value be a String object. Therefore, it can be transferred to other kinds of objects for use as a method.

#### 22.1.3.35 String.prototype.valueOf ( )

This method performs the following steps when called:

1.  Return ? [ThisStringValue](#sec-thisstringvalue)(this value).

##### 22.1.3.35.1 ThisStringValue ( `value` )

The abstract operation ThisStringValue takes argument `value` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a String or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  If `value` [is a String](#sec-ecmascript-language-types-string-type), return `value`.
2.  If `value` [is an Object](#sec-object-type) and `value` has a `[[StringData]]` internal slot, then
    1.  Let `s` be `value`.`[[StringData]]`.
    2.  [Assert](#assert): `s` [is a String](#sec-ecmascript-language-types-string-type).
    3.  Return `s`.
3.  Throw a TypeError exception.

#### 22.1.3.36 String.prototype \[ %Symbol.iterator% \] ( )

This method returns an [iterator object](#sec-iterator-interface) that iterates over the code points of a String value, returning each code point as a String value.

It performs the following steps when called:

1.  Let `O` be ? [RequireObjectCoercible](#sec-requireobjectcoercible)(this value).
2.  Let `s` be ? [ToString](#sec-tostring)(`O`).
3.  Let `closure` be a new [Abstract Closure](#sec-abstract-closure) with no parameters that captures `s` and performs the following steps when called:
    1.  Let `len` be the length of `s`.
    2.  Let `position` be 0.
    3.  Repeat, while `position` \< `len`,
        1.  Let `cp` be [CodePointAt](#sec-codepointat)(`s`, `position`).
        2.  Let `nextIndex` be `position` + `cp`.`[[CodeUnitCount]]`.
        3.  Let `resultString` be the [substring](#substring) of `s` from `position` to `nextIndex`.
        4.  Set `position` to `nextIndex`.
        5.  Perform ? [GeneratorYield](#sec-generatoryield)([CreateIteratorResultObject](#sec-createiterresultobject)(`resultString`, false)).
    4.  Return undefined.
4.  Return [CreateIteratorFromClosure](#sec-createiteratorfromclosure)(`closure`, "%StringIteratorPrototype%", [%StringIteratorPrototype%](#sec-%stringiteratorprototype%-object)).

The value of the "name" property of this method is "\[Symbol.iterator\]".

### 22.1.4 Properties of String Instances

String instances are [String exotic objects](#string-exotic-object) and have the internal methods specified for such objects. String instances inherit properties from the [String prototype object](#sec-properties-of-the-string-prototype-object). String instances also have a `[[StringData]]` internal slot. The `[[StringData]]` internal slot is the String value represented by this String object.

String instances have a "length" property, and a set of enumerable properties with [integer-indexed](#integer-index) names.

#### 22.1.4.1 length

The number of elements in the String value represented by this String object.

Once a String object is initialized, this property is unchanging. It has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

### 22.1.5 String Iterator Objects

A String Iterator is an object that represents a specific iteration over some specific String instance object. There is not a named [constructor](#constructor) for String Iterator objects. Instead, String Iterator objects are created by calling certain methods of String instance objects.

#### 22.1.5.1 The %StringIteratorPrototype% Object

The %StringIteratorPrototype% object:

- has properties that are inherited by all [String Iterator objects](#sec-string-iterator-objects).
- is an [ordinary object](#ordinary-object).
- has a `[[Prototype]]` internal slot whose value is [%Iterator.prototype%](#sec-%iterator.prototype%-object).
- has the following properties:

##### 22.1.5.1.1 %StringIteratorPrototype%.next ( )

1.  Return ? [GeneratorResume](#sec-generatorresume)(this value, empty, "%StringIteratorPrototype%").

##### 22.1.5.1.2 %StringIteratorPrototype% \[ %Symbol.toStringTag% \]

The initial value of the [%Symbol.toStringTag%](#sec-well-known-symbols) property is the String value "String Iterator".

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: true }.

## 22.2 RegExp (Regular Expression) Objects

A RegExp object contains a regular expression and the associated flags.

Note

The form and functionality of regular expressions is modelled after the regular expression facility in the Perl 5 programming language.

### 22.2.1 Patterns

The RegExp [constructor](#constructor) applies the following grammar to the input pattern String. An error occurs if the grammar cannot interpret the String as an expansion of [Pattern](#prod-Pattern).

#### Syntax

[Pattern](#prod-Pattern)\[UnicodeMode, UnicodeSetsMode, NamedCaptureGroups\] :: [Disjunction](#prod-Disjunction)\[?UnicodeMode, ?UnicodeSetsMode, ?NamedCaptureGroups\] [Disjunction](#prod-Disjunction)\[UnicodeMode, UnicodeSetsMode, NamedCaptureGroups\] :: [Alternative](#prod-Alternative)\[?UnicodeMode, ?UnicodeSetsMode, ?NamedCaptureGroups\] [Alternative](#prod-Alternative)\[?UnicodeMode, ?UnicodeSetsMode, ?NamedCaptureGroups\] \| [Disjunction](#prod-Disjunction)\[?UnicodeMode, ?UnicodeSetsMode, ?NamedCaptureGroups\] [Alternative](#prod-Alternative)\[UnicodeMode, UnicodeSetsMode, NamedCaptureGroups\] :: \[empty\] [Alternative](#prod-Alternative)\[?UnicodeMode, ?UnicodeSetsMode, ?NamedCaptureGroups\] [Term](#prod-Term)\[?UnicodeMode, ?UnicodeSetsMode, ?NamedCaptureGroups\] [Term](#prod-Term)\[UnicodeMode, UnicodeSetsMode, NamedCaptureGroups\] :: [Assertion](#prod-Assertion)\[?UnicodeMode, ?UnicodeSetsMode, ?NamedCaptureGroups\] [Atom](#prod-Atom)\[?UnicodeMode, ?UnicodeSetsMode, ?NamedCaptureGroups\] [Atom](#prod-Atom)\[?UnicodeMode, ?UnicodeSetsMode, ?NamedCaptureGroups\] [Quantifier](#prod-Quantifier) [Assertion](#prod-Assertion)\[UnicodeMode, UnicodeSetsMode, NamedCaptureGroups\] :: ^ \$ \b \B (?= [Disjunction](#prod-Disjunction)\[?UnicodeMode, ?UnicodeSetsMode, ?NamedCaptureGroups\] ) (?! [Disjunction](#prod-Disjunction)\[?UnicodeMode, ?UnicodeSetsMode, ?NamedCaptureGroups\] ) (?\<= [Disjunction](#prod-Disjunction)\[?UnicodeMode, ?UnicodeSetsMode, ?NamedCaptureGroups\] ) (?\<! [Disjunction](#prod-Disjunction)\[?UnicodeMode, ?UnicodeSetsMode, ?NamedCaptureGroups\] ) [Quantifier](#prod-Quantifier) :: [QuantifierPrefix](#prod-QuantifierPrefix) [QuantifierPrefix](#prod-QuantifierPrefix) ? [QuantifierPrefix](#prod-QuantifierPrefix) :: \* + ? { [DecimalDigits](#prod-DecimalDigits)\[~Sep\] } { [DecimalDigits](#prod-DecimalDigits)\[~Sep\] ,} { [DecimalDigits](#prod-DecimalDigits)\[~Sep\] , [DecimalDigits](#prod-DecimalDigits)\[~Sep\] } [Atom](#prod-Atom)\[UnicodeMode, UnicodeSetsMode, NamedCaptureGroups\] :: [PatternCharacter](#prod-PatternCharacter) . \\ [AtomEscape](#prod-AtomEscape)\[?UnicodeMode, ?NamedCaptureGroups\] [CharacterClass](#prod-CharacterClass)\[?UnicodeMode, ?UnicodeSetsMode\] ( [GroupSpecifier](#prod-GroupSpecifier)\[?UnicodeMode\]opt [Disjunction](#prod-Disjunction)\[?UnicodeMode, ?UnicodeSetsMode, ?NamedCaptureGroups\] ) (? [RegularExpressionModifiers](#prod-RegularExpressionModifiers) : [Disjunction](#prod-Disjunction)\[?UnicodeMode, ?UnicodeSetsMode, ?NamedCaptureGroups\] ) (? [RegularExpressionModifiers](#prod-RegularExpressionModifiers) - [RegularExpressionModifiers](#prod-RegularExpressionModifiers) : [Disjunction](#prod-Disjunction)\[?UnicodeMode, ?UnicodeSetsMode, ?NamedCaptureGroups\] ) [RegularExpressionModifiers](#prod-RegularExpressionModifiers) :: \[empty\] [RegularExpressionModifiers](#prod-RegularExpressionModifiers) [RegularExpressionModifier](#prod-RegularExpressionModifier) [RegularExpressionModifier](#prod-RegularExpressionModifier) :: one of i m s [SyntaxCharacter](#prod-SyntaxCharacter) :: one of ^ \$ \\ . \* + ? ( ) \[ \] { } \| [PatternCharacter](#prod-PatternCharacter) :: [SourceCharacter](#prod-SourceCharacter) but not [SyntaxCharacter](#prod-SyntaxCharacter) [AtomEscape](#prod-AtomEscape)\[UnicodeMode, NamedCaptureGroups\] :: [DecimalEscape](#prod-DecimalEscape) [CharacterClassEscape](#prod-CharacterClassEscape)\[?UnicodeMode\] [CharacterEscape](#prod-CharacterEscape)\[?UnicodeMode\] \[+NamedCaptureGroups\] k [GroupName](#prod-GroupName)\[?UnicodeMode\] [CharacterEscape](#prod-CharacterEscape)\[UnicodeMode\] :: [ControlEscape](#prod-ControlEscape) c [AsciiLetter](#prod-AsciiLetter) 0 \[lookahead ∉ [DecimalDigit](#prod-DecimalDigit)\] [HexEscapeSequence](#prod-HexEscapeSequence) [RegExpUnicodeEscapeSequence](#prod-RegExpUnicodeEscapeSequence)\[?UnicodeMode\] [IdentityEscape](#prod-IdentityEscape)\[?UnicodeMode\] [ControlEscape](#prod-ControlEscape) :: one of f n r t v [GroupSpecifier](#prod-GroupSpecifier)\[UnicodeMode\] :: ? [GroupName](#prod-GroupName)\[?UnicodeMode\] [GroupName](#prod-GroupName)\[UnicodeMode\] :: \< [RegExpIdentifierName](#prod-RegExpIdentifierName)\[?UnicodeMode\] \> [RegExpIdentifierName](#prod-RegExpIdentifierName)\[UnicodeMode\] :: [RegExpIdentifierStart](#prod-RegExpIdentifierStart)\[?UnicodeMode\] [RegExpIdentifierName](#prod-RegExpIdentifierName)\[?UnicodeMode\] [RegExpIdentifierPart](#prod-RegExpIdentifierPart)\[?UnicodeMode\] [RegExpIdentifierStart](#prod-RegExpIdentifierStart)\[UnicodeMode\] :: [IdentifierStartChar](#prod-IdentifierStartChar) \\ [RegExpUnicodeEscapeSequence](#prod-RegExpUnicodeEscapeSequence)\[+UnicodeMode\] \[~UnicodeMode\] [UnicodeLeadSurrogate](#prod-UnicodeLeadSurrogate) [UnicodeTrailSurrogate](#prod-UnicodeTrailSurrogate) [RegExpIdentifierPart](#prod-RegExpIdentifierPart)\[UnicodeMode\] :: [IdentifierPartChar](#prod-IdentifierPartChar) \\ [RegExpUnicodeEscapeSequence](#prod-RegExpUnicodeEscapeSequence)\[+UnicodeMode\] \[~UnicodeMode\] [UnicodeLeadSurrogate](#prod-UnicodeLeadSurrogate) [UnicodeTrailSurrogate](#prod-UnicodeTrailSurrogate) [RegExpUnicodeEscapeSequence](#prod-RegExpUnicodeEscapeSequence)\[UnicodeMode\] :: \[+UnicodeMode\] u [HexLeadSurrogate](#prod-HexLeadSurrogate) \u [HexTrailSurrogate](#prod-HexTrailSurrogate) \[+UnicodeMode\] u [HexLeadSurrogate](#prod-HexLeadSurrogate) \[+UnicodeMode\] u [HexTrailSurrogate](#prod-HexTrailSurrogate) \[+UnicodeMode\] u [HexNonSurrogate](#prod-HexNonSurrogate) \[~UnicodeMode\] u [Hex4Digits](#prod-Hex4Digits) \[+UnicodeMode\] u{ [CodePoint](#prod-CodePoint) } [UnicodeLeadSurrogate](#prod-UnicodeLeadSurrogate) :: any Unicode code point in the inclusive interval from U+D800 to U+DBFF [UnicodeTrailSurrogate](#prod-UnicodeTrailSurrogate) :: any Unicode code point in the inclusive interval from U+DC00 to U+DFFF

Each `\u` [HexTrailSurrogate](#prod-HexTrailSurrogate) for which the choice of associated `u` [HexLeadSurrogate](#prod-HexLeadSurrogate) is ambiguous shall be associated with the nearest possible `u` [HexLeadSurrogate](#prod-HexLeadSurrogate) that would otherwise have no corresponding `\u` [HexTrailSurrogate](#prod-HexTrailSurrogate).

[HexLeadSurrogate](#prod-HexLeadSurrogate) :: [Hex4Digits](#prod-Hex4Digits) but only if the MV of [Hex4Digits](#prod-Hex4Digits) is in the [inclusive interval](#inclusive-interval) from 0xD800 to 0xDBFF [HexTrailSurrogate](#prod-HexTrailSurrogate) :: [Hex4Digits](#prod-Hex4Digits) but only if the MV of [Hex4Digits](#prod-Hex4Digits) is in the [inclusive interval](#inclusive-interval) from 0xDC00 to 0xDFFF [HexNonSurrogate](#prod-HexNonSurrogate) :: [Hex4Digits](#prod-Hex4Digits) but only if the MV of [Hex4Digits](#prod-Hex4Digits) is not in the [inclusive interval](#inclusive-interval) from 0xD800 to 0xDFFF [IdentityEscape](#prod-IdentityEscape)\[UnicodeMode\] :: \[+UnicodeMode\] [SyntaxCharacter](#prod-SyntaxCharacter) \[+UnicodeMode\] / \[~UnicodeMode\] [SourceCharacter](#prod-SourceCharacter) but not [UnicodeIDContinue](#prod-UnicodeIDContinue) [DecimalEscape](#prod-DecimalEscape) :: [NonZeroDigit](#prod-NonZeroDigit) [DecimalDigits](#prod-DecimalDigits)\[~Sep\]opt \[lookahead ∉ [DecimalDigit](#prod-DecimalDigit)\] [CharacterClassEscape](#prod-CharacterClassEscape)\[UnicodeMode\] :: d D s S w W \[+UnicodeMode\] p{ [UnicodePropertyValueExpression](#prod-UnicodePropertyValueExpression) } \[+UnicodeMode\] P{ [UnicodePropertyValueExpression](#prod-UnicodePropertyValueExpression) } [UnicodePropertyValueExpression](#prod-UnicodePropertyValueExpression) :: [UnicodePropertyName](#prod-UnicodePropertyName) = [UnicodePropertyValue](#prod-UnicodePropertyValue) [LoneUnicodePropertyNameOrValue](#prod-LoneUnicodePropertyNameOrValue) [UnicodePropertyName](#prod-UnicodePropertyName) :: [UnicodePropertyNameCharacters](#prod-UnicodePropertyNameCharacters) [UnicodePropertyNameCharacters](#prod-UnicodePropertyNameCharacters) :: [UnicodePropertyNameCharacter](#prod-UnicodePropertyNameCharacter) [UnicodePropertyNameCharacters](#prod-UnicodePropertyNameCharacters)opt [UnicodePropertyValue](#prod-UnicodePropertyValue) :: [UnicodePropertyValueCharacters](#prod-UnicodePropertyValueCharacters) [LoneUnicodePropertyNameOrValue](#prod-LoneUnicodePropertyNameOrValue) :: [UnicodePropertyValueCharacters](#prod-UnicodePropertyValueCharacters) [UnicodePropertyValueCharacters](#prod-UnicodePropertyValueCharacters) :: [UnicodePropertyValueCharacter](#prod-UnicodePropertyValueCharacter) [UnicodePropertyValueCharacters](#prod-UnicodePropertyValueCharacters)opt [UnicodePropertyValueCharacter](#prod-UnicodePropertyValueCharacter) :: [UnicodePropertyNameCharacter](#prod-UnicodePropertyNameCharacter) [DecimalDigit](#prod-DecimalDigit) [UnicodePropertyNameCharacter](#prod-UnicodePropertyNameCharacter) :: [AsciiLetter](#prod-AsciiLetter) \_ [CharacterClass](#prod-CharacterClass)\[UnicodeMode, UnicodeSetsMode\] :: \[ \[lookahead ≠ ^\] [ClassContents](#prod-ClassContents)\[?UnicodeMode, ?UnicodeSetsMode\] \] \[^ [ClassContents](#prod-ClassContents)\[?UnicodeMode, ?UnicodeSetsMode\] \] [ClassContents](#prod-ClassContents)\[UnicodeMode, UnicodeSetsMode\] :: \[empty\] \[~UnicodeSetsMode\] [NonemptyClassRanges](#prod-NonemptyClassRanges)\[?UnicodeMode\] \[+UnicodeSetsMode\] [ClassSetExpression](#prod-ClassSetExpression) [NonemptyClassRanges](#prod-NonemptyClassRanges)\[UnicodeMode\] :: [ClassAtom](#prod-ClassAtom)\[?UnicodeMode\] [ClassAtom](#prod-ClassAtom)\[?UnicodeMode\] [NonemptyClassRangesNoDash](#prod-NonemptyClassRangesNoDash)\[?UnicodeMode\] [ClassAtom](#prod-ClassAtom)\[?UnicodeMode\] - [ClassAtom](#prod-ClassAtom)\[?UnicodeMode\] [ClassContents](#prod-ClassContents)\[?UnicodeMode, ~UnicodeSetsMode\] [NonemptyClassRangesNoDash](#prod-NonemptyClassRangesNoDash)\[UnicodeMode\] :: [ClassAtom](#prod-ClassAtom)\[?UnicodeMode\] [ClassAtomNoDash](#prod-ClassAtomNoDash)\[?UnicodeMode\] [NonemptyClassRangesNoDash](#prod-NonemptyClassRangesNoDash)\[?UnicodeMode\] [ClassAtomNoDash](#prod-ClassAtomNoDash)\[?UnicodeMode\] - [ClassAtom](#prod-ClassAtom)\[?UnicodeMode\] [ClassContents](#prod-ClassContents)\[?UnicodeMode, ~UnicodeSetsMode\] [ClassAtom](#prod-ClassAtom)\[UnicodeMode\] :: - [ClassAtomNoDash](#prod-ClassAtomNoDash)\[?UnicodeMode\] [ClassAtomNoDash](#prod-ClassAtomNoDash)\[UnicodeMode\] :: [SourceCharacter](#prod-SourceCharacter) but not one of \\ or \] or - \\ [ClassEscape](#prod-ClassEscape)\[?UnicodeMode\] [ClassEscape](#prod-ClassEscape)\[UnicodeMode\] :: b \[+UnicodeMode\] - [CharacterClassEscape](#prod-CharacterClassEscape)\[?UnicodeMode\] [CharacterEscape](#prod-CharacterEscape)\[?UnicodeMode\] [ClassSetExpression](#prod-ClassSetExpression) :: [ClassUnion](#prod-ClassUnion) [ClassIntersection](#prod-ClassIntersection) [ClassSubtraction](#prod-ClassSubtraction) [ClassUnion](#prod-ClassUnion) :: [ClassSetRange](#prod-ClassSetRange) [ClassUnion](#prod-ClassUnion)opt [ClassSetOperand](#prod-ClassSetOperand) [ClassUnion](#prod-ClassUnion)opt [ClassIntersection](#prod-ClassIntersection) :: [ClassSetOperand](#prod-ClassSetOperand) && \[lookahead ≠ &\] [ClassSetOperand](#prod-ClassSetOperand) [ClassIntersection](#prod-ClassIntersection) && \[lookahead ≠ &\] [ClassSetOperand](#prod-ClassSetOperand) [ClassSubtraction](#prod-ClassSubtraction) :: [ClassSetOperand](#prod-ClassSetOperand) -- [ClassSetOperand](#prod-ClassSetOperand) [ClassSubtraction](#prod-ClassSubtraction) -- [ClassSetOperand](#prod-ClassSetOperand) [ClassSetRange](#prod-ClassSetRange) :: [ClassSetCharacter](#prod-ClassSetCharacter) - [ClassSetCharacter](#prod-ClassSetCharacter) [ClassSetOperand](#prod-ClassSetOperand) :: [NestedClass](#prod-NestedClass) [ClassStringDisjunction](#prod-ClassStringDisjunction) [ClassSetCharacter](#prod-ClassSetCharacter) [NestedClass](#prod-NestedClass) :: \[ \[lookahead ≠ ^\] [ClassContents](#prod-ClassContents)\[+UnicodeMode, +UnicodeSetsMode\] \] \[^ [ClassContents](#prod-ClassContents)\[+UnicodeMode, +UnicodeSetsMode\] \] \\ [CharacterClassEscape](#prod-CharacterClassEscape)\[+UnicodeMode\] Note 1

The first two lines here are equivalent to CharacterClass.

[ClassStringDisjunction](#prod-ClassStringDisjunction) :: \q{ [ClassStringDisjunctionContents](#prod-ClassStringDisjunctionContents) } [ClassStringDisjunctionContents](#prod-ClassStringDisjunctionContents) :: [ClassString](#prod-ClassString) [ClassString](#prod-ClassString) \| [ClassStringDisjunctionContents](#prod-ClassStringDisjunctionContents) [ClassString](#prod-ClassString) :: \[empty\] [NonEmptyClassString](#prod-NonEmptyClassString) [NonEmptyClassString](#prod-NonEmptyClassString) :: [ClassSetCharacter](#prod-ClassSetCharacter) [NonEmptyClassString](#prod-NonEmptyClassString)opt [ClassSetCharacter](#prod-ClassSetCharacter) :: \[lookahead ∉ [ClassSetReservedDoublePunctuator](#prod-ClassSetReservedDoublePunctuator)\] [SourceCharacter](#prod-SourceCharacter) but not [ClassSetSyntaxCharacter](#prod-ClassSetSyntaxCharacter) \\ [CharacterEscape](#prod-CharacterEscape)\[+UnicodeMode\] \\ [ClassSetReservedPunctuator](#prod-ClassSetReservedPunctuator) \b [ClassSetReservedDoublePunctuator](#prod-ClassSetReservedDoublePunctuator) :: one of && !! \## \$\$ %% \*\* ++ ,, .. :: ;; \<\< == \>\> ?? @@ ^^ \`\` \~~ [ClassSetSyntaxCharacter](#prod-ClassSetSyntaxCharacter) :: one of ( ) \[ \] { } / - \\ \| [ClassSetReservedPunctuator](#prod-ClassSetReservedPunctuator) :: one of & - ! \# % , : ; \< = \> @ \` ~ Note 2

A number of productions in this section are given alternative definitions in section [B.1.2](#sec-regular-expressions-patterns).

#### 22.2.1.1 Static Semantics: Early Errors

Note

This section is amended in [B.1.2.1](#sec-patterns-static-semantics-early-errors-annexb).

[Pattern](#prod-Pattern) :: [Disjunction](#prod-Disjunction)

- It is a Syntax Error if [CountLeftCapturingParensWithin](#sec-countleftcapturingparenswithin)([Pattern](#prod-Pattern)) ≥ 2\*\*³² - 1.
- It is a Syntax Error if [Pattern](#prod-Pattern) contains two distinct [GroupSpecifier](#prod-GroupSpecifier)s `x` and `y` such that the [CapturingGroupName](#sec-static-semantics-capturinggroupname) of `x` is the [CapturingGroupName](#sec-static-semantics-capturinggroupname) of `y` and such that [MightBothParticipate](#sec-mightbothparticipate)(`x`, `y`) is true.

[QuantifierPrefix](#prod-QuantifierPrefix) :: { [DecimalDigits](#prod-DecimalDigits) , [DecimalDigits](#prod-DecimalDigits) }

- It is a Syntax Error if the MV of the first [DecimalDigits](#prod-DecimalDigits) is strictly greater than the MV of the second [DecimalDigits](#prod-DecimalDigits).

[Atom](#prod-Atom) :: (? [RegularExpressionModifiers](#prod-RegularExpressionModifiers) : [Disjunction](#prod-Disjunction) )

- It is a Syntax Error if the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) [RegularExpressionModifiers](#prod-RegularExpressionModifiers) contains the same code point more than once.

[Atom](#prod-Atom) :: (? [RegularExpressionModifiers](#prod-RegularExpressionModifiers) - [RegularExpressionModifiers](#prod-RegularExpressionModifiers) : [Disjunction](#prod-Disjunction) )

- It is a Syntax Error if the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) the first [RegularExpressionModifiers](#prod-RegularExpressionModifiers) and the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) the second [RegularExpressionModifiers](#prod-RegularExpressionModifiers) are both empty.
- It is a Syntax Error if the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) the first [RegularExpressionModifiers](#prod-RegularExpressionModifiers) contains the same code point more than once.
- It is a Syntax Error if the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) the second [RegularExpressionModifiers](#prod-RegularExpressionModifiers) contains the same code point more than once.
- It is a Syntax Error if any code point in the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) the first [RegularExpressionModifiers](#prod-RegularExpressionModifiers) is also contained in the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) the second [RegularExpressionModifiers](#prod-RegularExpressionModifiers).

[AtomEscape](#prod-AtomEscape) :: k [GroupName](#prod-GroupName)

- It is a Syntax Error if [GroupSpecifiersThatMatch](#sec-groupspecifiersthatmatch)([GroupName](#prod-GroupName)) is empty.

[AtomEscape](#prod-AtomEscape) :: [DecimalEscape](#prod-DecimalEscape)

- It is a Syntax Error if the [CapturingGroupNumber](#sec-patterns-static-semantics-capturing-group-number) of [DecimalEscape](#prod-DecimalEscape) is strictly greater than [CountLeftCapturingParensWithin](#sec-countleftcapturingparenswithin)(the [Pattern](#prod-Pattern) containing [AtomEscape](#prod-AtomEscape)).

[NonemptyClassRanges](#prod-NonemptyClassRanges) :: [ClassAtom](#prod-ClassAtom) - [ClassAtom](#prod-ClassAtom) [ClassContents](#prod-ClassContents)

- It is a Syntax Error if [IsCharacterClass](#sec-patterns-static-semantics-is-character-class) of the first [ClassAtom](#prod-ClassAtom) is true or [IsCharacterClass](#sec-patterns-static-semantics-is-character-class) of the second [ClassAtom](#prod-ClassAtom) is true.
- It is a Syntax Error if [IsCharacterClass](#sec-patterns-static-semantics-is-character-class) of the first [ClassAtom](#prod-ClassAtom) is false, [IsCharacterClass](#sec-patterns-static-semantics-is-character-class) of the second [ClassAtom](#prod-ClassAtom) is false, and the [CharacterValue](#sec-patterns-static-semantics-character-value) of the first [ClassAtom](#prod-ClassAtom) is strictly greater than the [CharacterValue](#sec-patterns-static-semantics-character-value) of the second [ClassAtom](#prod-ClassAtom).

[NonemptyClassRangesNoDash](#prod-NonemptyClassRangesNoDash) :: [ClassAtomNoDash](#prod-ClassAtomNoDash) - [ClassAtom](#prod-ClassAtom) [ClassContents](#prod-ClassContents)

- It is a Syntax Error if [IsCharacterClass](#sec-patterns-static-semantics-is-character-class) of [ClassAtomNoDash](#prod-ClassAtomNoDash) is true or [IsCharacterClass](#sec-patterns-static-semantics-is-character-class) of [ClassAtom](#prod-ClassAtom) is true.
- It is a Syntax Error if [IsCharacterClass](#sec-patterns-static-semantics-is-character-class) of [ClassAtomNoDash](#prod-ClassAtomNoDash) is false, [IsCharacterClass](#sec-patterns-static-semantics-is-character-class) of [ClassAtom](#prod-ClassAtom) is false, and the [CharacterValue](#sec-patterns-static-semantics-character-value) of [ClassAtomNoDash](#prod-ClassAtomNoDash) is strictly greater than the [CharacterValue](#sec-patterns-static-semantics-character-value) of [ClassAtom](#prod-ClassAtom).

[RegExpIdentifierStart](#prod-RegExpIdentifierStart) :: \\ [RegExpUnicodeEscapeSequence](#prod-RegExpUnicodeEscapeSequence)

- It is a Syntax Error if the [CharacterValue](#sec-patterns-static-semantics-character-value) of [RegExpUnicodeEscapeSequence](#prod-RegExpUnicodeEscapeSequence) is not the numeric value of some code point matched by the [IdentifierStartChar](#prod-IdentifierStartChar) lexical grammar production.

[RegExpIdentifierStart](#prod-RegExpIdentifierStart) :: [UnicodeLeadSurrogate](#prod-UnicodeLeadSurrogate) [UnicodeTrailSurrogate](#prod-UnicodeTrailSurrogate)

- It is a Syntax Error if the [RegExpIdentifierCodePoint](#sec-regexpidentifiercodepoint) of [RegExpIdentifierStart](#prod-RegExpIdentifierStart) is not matched by the [UnicodeIDStart](#prod-UnicodeIDStart) lexical grammar production.

[RegExpIdentifierPart](#prod-RegExpIdentifierPart) :: \\ [RegExpUnicodeEscapeSequence](#prod-RegExpUnicodeEscapeSequence)

- It is a Syntax Error if the [CharacterValue](#sec-patterns-static-semantics-character-value) of [RegExpUnicodeEscapeSequence](#prod-RegExpUnicodeEscapeSequence) is not the numeric value of some code point matched by the [IdentifierPartChar](#prod-IdentifierPartChar) lexical grammar production.

[RegExpIdentifierPart](#prod-RegExpIdentifierPart) :: [UnicodeLeadSurrogate](#prod-UnicodeLeadSurrogate) [UnicodeTrailSurrogate](#prod-UnicodeTrailSurrogate)

- It is a Syntax Error if the [RegExpIdentifierCodePoint](#sec-regexpidentifiercodepoint) of [RegExpIdentifierPart](#prod-RegExpIdentifierPart) is not matched by the [UnicodeIDContinue](#prod-UnicodeIDContinue) lexical grammar production.

[UnicodePropertyValueExpression](#prod-UnicodePropertyValueExpression) :: [UnicodePropertyName](#prod-UnicodePropertyName) = [UnicodePropertyValue](#prod-UnicodePropertyValue)

- It is a Syntax Error if the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) [UnicodePropertyName](#prod-UnicodePropertyName) is not a Unicode [property name](#property-name) or property alias listed in the “[Property name](#property-name) and aliases” column of [Table 69](#table-nonbinary-unicode-properties).
- It is a Syntax Error if the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) [UnicodePropertyValue](#prod-UnicodePropertyValue) is not a property value or property value alias for the Unicode property or property alias given by the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) [UnicodePropertyName](#prod-UnicodePropertyName) listed in [`PropertyValueAliases.txt`](https://unicode.org/Public/UCD/latest/ucd/PropertyValueAliases.txt).

[UnicodePropertyValueExpression](#prod-UnicodePropertyValueExpression) :: [LoneUnicodePropertyNameOrValue](#prod-LoneUnicodePropertyNameOrValue)

- It is a Syntax Error if the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) [LoneUnicodePropertyNameOrValue](#prod-LoneUnicodePropertyNameOrValue) is not a Unicode property value or property value alias for the General_Category (gc) property listed in [`PropertyValueAliases.txt`](https://unicode.org/Public/UCD/latest/ucd/PropertyValueAliases.txt), nor a binary property or binary property alias listed in the “[Property name](#property-name) and aliases” column of [Table 70](#table-binary-unicode-properties), nor a binary property of strings listed in the “[Property name](#property-name)” column of [Table 71](#table-binary-unicode-properties-of-strings).
- It is a Syntax Error if the enclosing [Pattern](#prod-Pattern) does not have a _(\[UnicodeSetsMode\]) parameter and the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) [LoneUnicodePropertyNameOrValue](#prod-LoneUnicodePropertyNameOrValue) is a binary property of strings listed in the “[Property name](#property-name)” column of [Table 71](#table-binary-unicode-properties-of-strings).

[CharacterClassEscape](#prod-CharacterClassEscape) :: P{ [UnicodePropertyValueExpression](#prod-UnicodePropertyValueExpression) }

- It is a Syntax Error if [MayContainStrings](#sec-static-semantics-maycontainstrings) of the [UnicodePropertyValueExpression](#prod-UnicodePropertyValueExpression) is true.

[CharacterClass](#prod-CharacterClass) :: \[^ [ClassContents](#prod-ClassContents) \]

- It is a Syntax Error if [MayContainStrings](#sec-static-semantics-maycontainstrings) of the [ClassContents](#prod-ClassContents) is true.

[NestedClass](#prod-NestedClass) :: \[^ [ClassContents](#prod-ClassContents) \]

- It is a Syntax Error if [MayContainStrings](#sec-static-semantics-maycontainstrings) of the [ClassContents](#prod-ClassContents) is true.

[ClassSetRange](#prod-ClassSetRange) :: [ClassSetCharacter](#prod-ClassSetCharacter) - [ClassSetCharacter](#prod-ClassSetCharacter)

- It is a Syntax Error if the [CharacterValue](#sec-patterns-static-semantics-character-value) of the first [ClassSetCharacter](#prod-ClassSetCharacter) is strictly greater than the [CharacterValue](#sec-patterns-static-semantics-character-value) of the second [ClassSetCharacter](#prod-ClassSetCharacter).

#### 22.2.1.2 Static Semantics: CountLeftCapturingParensWithin ( `node` )

The abstract operation CountLeftCapturingParensWithin takes argument `node` (a [Parse Node](#sec-syntactic-grammar)) and returns a non-negative [integer](#integer). It returns the number of left-capturing parentheses in `node`. A left-capturing parenthesis is any `(` pattern character that is matched by the `(` terminal of the [Atom](#prod-Atom) :: ( [GroupSpecifier](#prod-GroupSpecifier)opt [Disjunction](#prod-Disjunction) ) production.

Note

This section is amended in [B.1.2.2](#sec-countleftcapturingparens-annexb).

It performs the following steps when called:

1.  [Assert](#assert): `node` is an instance of a production in [the RegExp Pattern grammar](#sec-patterns).
2.  Return the number of [Atom](#prod-Atom) :: ( [GroupSpecifier](#prod-GroupSpecifier)opt [Disjunction](#prod-Disjunction) ) [Parse Nodes](#sec-syntactic-grammar) contained within `node`.

#### 22.2.1.3 Static Semantics: CountLeftCapturingParensBefore ( `node` )

The abstract operation CountLeftCapturingParensBefore takes argument `node` (a [Parse Node](#sec-syntactic-grammar)) and returns a non-negative [integer](#integer). It returns the number of [left-capturing parentheses](#sec-countleftcapturingparenswithin) within the enclosing pattern that occur to the left of `node`.

Note

This section is amended in [B.1.2.2](#sec-countleftcapturingparens-annexb).

It performs the following steps when called:

1.  [Assert](#assert): `node` is an instance of a production in [the RegExp Pattern grammar](#sec-patterns).
2.  Let `pattern` be the [Pattern](#prod-Pattern) containing `node`.
3.  Return the number of [Atom](#prod-Atom) :: ( [GroupSpecifier](#prod-GroupSpecifier)opt [Disjunction](#prod-Disjunction) ) [Parse Nodes](#sec-syntactic-grammar) contained within `pattern` that either occur before `node` or contain `node`.

#### 22.2.1.4 Static Semantics: MightBothParticipate ( `x`, `y` )

The abstract operation MightBothParticipate takes arguments `x` (a [Parse Node](#sec-syntactic-grammar)) and `y` (a [Parse Node](#sec-syntactic-grammar)) and returns a Boolean. It performs the following steps when called:

1.  [Assert](#assert): `x` and `y` have the same enclosing [Pattern](#prod-Pattern).
2.  If the enclosing [Pattern](#prod-Pattern) contains a [Disjunction](#prod-Disjunction) :: [Alternative](#prod-Alternative) \| [Disjunction](#prod-Disjunction) [Parse Node](#sec-syntactic-grammar) such that either `x` is contained within the [Alternative](#prod-Alternative) and `y` is contained within the derived [Disjunction](#prod-Disjunction), or `x` is contained within the derived [Disjunction](#prod-Disjunction) and `y` is contained within the [Alternative](#prod-Alternative), return false.
3.  Return true.

#### 22.2.1.5 Static Semantics: CapturingGroupNumber

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) CapturingGroupNumber takes no arguments and returns a positive [integer](#integer).

Note

This section is amended in [B.1.2.1](#sec-patterns-static-semantics-early-errors-annexb).

It is defined piecewise over the following productions:

[DecimalEscape](#prod-DecimalEscape) :: [NonZeroDigit](#prod-NonZeroDigit)

1.  Return the MV of [NonZeroDigit](#prod-NonZeroDigit).

[DecimalEscape](#prod-DecimalEscape) :: [NonZeroDigit](#prod-NonZeroDigit) [DecimalDigits](#prod-DecimalDigits)

1.  Let `n` be the number of code points in [DecimalDigits](#prod-DecimalDigits).
2.  Return (the MV of [NonZeroDigit](#prod-NonZeroDigit) × 10\*\*^(`n`) plus the MV of [DecimalDigits](#prod-DecimalDigits)).

The definitions of “the MV of [NonZeroDigit](#prod-NonZeroDigit)” and “the MV of [DecimalDigits](#prod-DecimalDigits)” are in [12.9.3](#sec-literals-numeric-literals).

#### 22.2.1.6 Static Semantics: IsCharacterClass

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) IsCharacterClass takes no arguments and returns a Boolean.

Note

This section is amended in [B.1.2.3](#sec-patterns-static-semantics-is-character-class-annexb).

It is defined piecewise over the following productions:

[ClassAtom](#prod-ClassAtom) :: - [ClassAtomNoDash](#prod-ClassAtomNoDash) :: [SourceCharacter](#prod-SourceCharacter) but not one of \\ or \] or - [ClassEscape](#prod-ClassEscape) :: b - [CharacterEscape](#prod-CharacterEscape)

1.  Return false.

[ClassEscape](#prod-ClassEscape) :: [CharacterClassEscape](#prod-CharacterClassEscape)

1.  Return true.

#### 22.2.1.7 Static Semantics: CharacterValue

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) CharacterValue takes no arguments and returns a non-negative [integer](#integer).

Note 1

This section is amended in [B.1.2.4](#sec-patterns-static-semantics-character-value-annexb).

It is defined piecewise over the following productions:

[ClassAtom](#prod-ClassAtom) :: -

1.  Return the numeric value of U+002D (HYPHEN-MINUS).

[ClassAtomNoDash](#prod-ClassAtomNoDash) :: [SourceCharacter](#prod-SourceCharacter) but not one of \\ or \] or -

1.  Let `ch` be the code point matched by [SourceCharacter](#prod-SourceCharacter).
2.  Return the numeric value of `ch`.

[ClassEscape](#prod-ClassEscape) :: b

1.  Return the numeric value of U+0008 (BACKSPACE).

[ClassEscape](#prod-ClassEscape) :: -

1.  Return the numeric value of U+002D (HYPHEN-MINUS).

[CharacterEscape](#prod-CharacterEscape) :: [ControlEscape](#prod-ControlEscape)

1.  Return the numeric value according to [Table 67](#table-controlescape-code-point-values).

| ControlEscape | Numeric Value | Code Point | Unicode Name         | Symbol |
|---------------|---------------|------------|----------------------|--------|
| `t`           | 9             | `U+0009`   | CHARACTER TABULATION | \<HT\> |
| `n`           | 10            | `U+000A`   | LINE FEED (LF)       | \<LF\> |
| `v`           | 11            | `U+000B`   | LINE TABULATION      | \<VT\> |
| `f`           | 12            | `U+000C`   | FORM FEED (FF)       | \<FF\> |
| `r`           | 13            | `U+000D`   | CARRIAGE RETURN (CR) | \<CR\> |

Table 67: ControlEscape Code Point Values

[CharacterEscape](#prod-CharacterEscape) :: c [AsciiLetter](#prod-AsciiLetter)

1.  Let `ch` be the code point matched by [AsciiLetter](#prod-AsciiLetter).
2.  Let `i` be the numeric value of `ch`.
3.  Return the remainder of dividing `i` by 32.

[CharacterEscape](#prod-CharacterEscape) :: 0 \[lookahead ∉ [DecimalDigit](#prod-DecimalDigit)\]

1.  Return the numeric value of U+0000 (NULL).

Note 2

`\0` represents the \<NUL\> character and cannot be followed by a decimal digit.

[CharacterEscape](#prod-CharacterEscape) :: [HexEscapeSequence](#prod-HexEscapeSequence)

1.  Return the MV of [HexEscapeSequence](#prod-HexEscapeSequence).

[RegExpUnicodeEscapeSequence](#prod-RegExpUnicodeEscapeSequence) :: u [HexLeadSurrogate](#prod-HexLeadSurrogate) \u [HexTrailSurrogate](#prod-HexTrailSurrogate)

1.  Let `lead` be the [CharacterValue](#sec-patterns-static-semantics-character-value) of [HexLeadSurrogate](#prod-HexLeadSurrogate).
2.  Let `trail` be the [CharacterValue](#sec-patterns-static-semantics-character-value) of [HexTrailSurrogate](#prod-HexTrailSurrogate).
3.  Let `cp` be [UTF16SurrogatePairToCodePoint](#sec-utf16decodesurrogatepair)(`lead`, `trail`).
4.  Return the numeric value of `cp`.

[RegExpUnicodeEscapeSequence](#prod-RegExpUnicodeEscapeSequence) :: u [Hex4Digits](#prod-Hex4Digits)

1.  Return the MV of [Hex4Digits](#prod-Hex4Digits).

[RegExpUnicodeEscapeSequence](#prod-RegExpUnicodeEscapeSequence) :: u{ [CodePoint](#prod-CodePoint) }

1.  Return the MV of [CodePoint](#prod-CodePoint).

[HexLeadSurrogate](#prod-HexLeadSurrogate) :: [Hex4Digits](#prod-Hex4Digits) [HexTrailSurrogate](#prod-HexTrailSurrogate) :: [Hex4Digits](#prod-Hex4Digits) [HexNonSurrogate](#prod-HexNonSurrogate) :: [Hex4Digits](#prod-Hex4Digits)

1.  Return the MV of [Hex4Digits](#prod-Hex4Digits).

[CharacterEscape](#prod-CharacterEscape) :: [IdentityEscape](#prod-IdentityEscape)

1.  Let `ch` be the code point matched by [IdentityEscape](#prod-IdentityEscape).
2.  Return the numeric value of `ch`.

[ClassSetCharacter](#prod-ClassSetCharacter) :: [SourceCharacter](#prod-SourceCharacter) but not [ClassSetSyntaxCharacter](#prod-ClassSetSyntaxCharacter)

1.  Let `ch` be the code point matched by [SourceCharacter](#prod-SourceCharacter).
2.  Return the numeric value of `ch`.

[ClassSetCharacter](#prod-ClassSetCharacter) :: \\ [ClassSetReservedPunctuator](#prod-ClassSetReservedPunctuator)

1.  Let `ch` be the code point matched by [ClassSetReservedPunctuator](#prod-ClassSetReservedPunctuator).
2.  Return the numeric value of `ch`.

[ClassSetCharacter](#prod-ClassSetCharacter) :: \b

1.  Return the numeric value of U+0008 (BACKSPACE).

#### 22.2.1.8 Static Semantics: MayContainStrings

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) MayContainStrings takes no arguments and returns a Boolean. It is defined piecewise over the following productions:

[CharacterClassEscape](#prod-CharacterClassEscape) :: d D s S w W P{ [UnicodePropertyValueExpression](#prod-UnicodePropertyValueExpression) } [UnicodePropertyValueExpression](#prod-UnicodePropertyValueExpression) :: [UnicodePropertyName](#prod-UnicodePropertyName) = [UnicodePropertyValue](#prod-UnicodePropertyValue) [NestedClass](#prod-NestedClass) :: \[^ [ClassContents](#prod-ClassContents) \] [ClassContents](#prod-ClassContents) :: \[empty\] [NonemptyClassRanges](#prod-NonemptyClassRanges) [ClassSetOperand](#prod-ClassSetOperand) :: [ClassSetCharacter](#prod-ClassSetCharacter)

1.  Return false.

[UnicodePropertyValueExpression](#prod-UnicodePropertyValueExpression) :: [LoneUnicodePropertyNameOrValue](#prod-LoneUnicodePropertyNameOrValue)

1.  If the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) [LoneUnicodePropertyNameOrValue](#prod-LoneUnicodePropertyNameOrValue) is a binary property of strings listed in the “[Property name](#property-name)” column of [Table 71](#table-binary-unicode-properties-of-strings), return true.
2.  Return false.

[ClassUnion](#prod-ClassUnion) :: [ClassSetRange](#prod-ClassSetRange) [ClassUnion](#prod-ClassUnion)opt

1.  If the [ClassUnion](#prod-ClassUnion) is present, return [MayContainStrings](#sec-static-semantics-maycontainstrings) of the [ClassUnion](#prod-ClassUnion).
2.  Return false.

[ClassUnion](#prod-ClassUnion) :: [ClassSetOperand](#prod-ClassSetOperand) [ClassUnion](#prod-ClassUnion)opt

1.  If [MayContainStrings](#sec-static-semantics-maycontainstrings) of the [ClassSetOperand](#prod-ClassSetOperand) is true, return true.
2.  If [ClassUnion](#prod-ClassUnion) is present, return [MayContainStrings](#sec-static-semantics-maycontainstrings) of the [ClassUnion](#prod-ClassUnion).
3.  Return false.

[ClassIntersection](#prod-ClassIntersection) :: [ClassSetOperand](#prod-ClassSetOperand) && [ClassSetOperand](#prod-ClassSetOperand)

1.  If [MayContainStrings](#sec-static-semantics-maycontainstrings) of the first [ClassSetOperand](#prod-ClassSetOperand) is false, return false.
2.  If [MayContainStrings](#sec-static-semantics-maycontainstrings) of the second [ClassSetOperand](#prod-ClassSetOperand) is false, return false.
3.  Return true.

[ClassIntersection](#prod-ClassIntersection) :: [ClassIntersection](#prod-ClassIntersection) && [ClassSetOperand](#prod-ClassSetOperand)

1.  If [MayContainStrings](#sec-static-semantics-maycontainstrings) of the [ClassIntersection](#prod-ClassIntersection) is false, return false.
2.  If [MayContainStrings](#sec-static-semantics-maycontainstrings) of the [ClassSetOperand](#prod-ClassSetOperand) is false, return false.
3.  Return true.

[ClassSubtraction](#prod-ClassSubtraction) :: [ClassSetOperand](#prod-ClassSetOperand) -- [ClassSetOperand](#prod-ClassSetOperand)

1.  Return [MayContainStrings](#sec-static-semantics-maycontainstrings) of the first [ClassSetOperand](#prod-ClassSetOperand).

[ClassSubtraction](#prod-ClassSubtraction) :: [ClassSubtraction](#prod-ClassSubtraction) -- [ClassSetOperand](#prod-ClassSetOperand)

1.  Return [MayContainStrings](#sec-static-semantics-maycontainstrings) of the [ClassSubtraction](#prod-ClassSubtraction).

[ClassStringDisjunctionContents](#prod-ClassStringDisjunctionContents) :: [ClassString](#prod-ClassString) \| [ClassStringDisjunctionContents](#prod-ClassStringDisjunctionContents)

1.  If [MayContainStrings](#sec-static-semantics-maycontainstrings) of the [ClassString](#prod-ClassString) is true, return true.
2.  Return [MayContainStrings](#sec-static-semantics-maycontainstrings) of the [ClassStringDisjunctionContents](#prod-ClassStringDisjunctionContents).

[ClassString](#prod-ClassString) :: \[empty\]

1.  Return true.

[ClassString](#prod-ClassString) :: [NonEmptyClassString](#prod-NonEmptyClassString)

1.  Return [MayContainStrings](#sec-static-semantics-maycontainstrings) of the [NonEmptyClassString](#prod-NonEmptyClassString).

[NonEmptyClassString](#prod-NonEmptyClassString) :: [ClassSetCharacter](#prod-ClassSetCharacter) [NonEmptyClassString](#prod-NonEmptyClassString)opt

1.  If [NonEmptyClassString](#prod-NonEmptyClassString) is present, return true.
2.  Return false.

#### 22.2.1.9 Static Semantics: GroupSpecifiersThatMatch ( `thisGroupName` )

The abstract operation GroupSpecifiersThatMatch takes argument `thisGroupName` (a [GroupName](#prod-GroupName) [Parse Node](#sec-syntactic-grammar)) and returns a [List](#sec-list-and-record-specification-type) of [GroupSpecifier](#prod-GroupSpecifier) [Parse Nodes](#sec-syntactic-grammar). It performs the following steps when called:

1.  Let `name` be the [CapturingGroupName](#sec-static-semantics-capturinggroupname) of `thisGroupName`.
2.  Let `pattern` be the [Pattern](#prod-Pattern) containing `thisGroupName`.
3.  Let `result` be a new empty [List](#sec-list-and-record-specification-type).
4.  For each [GroupSpecifier](#prod-GroupSpecifier) `gs` that `pattern` contains, do
    1.  If the [CapturingGroupName](#sec-static-semantics-capturinggroupname) of `gs` is `name`, then
        1.  Append `gs` to `result`.
5.  Return `result`.

#### 22.2.1.10 Static Semantics: CapturingGroupName

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) CapturingGroupName takes no arguments and returns a String. It is defined piecewise over the following productions:

[GroupName](#prod-GroupName) :: \< [RegExpIdentifierName](#prod-RegExpIdentifierName) \>

1.  Let `idTextUnescaped` be the [RegExpIdentifierCodePoints](#sec-regexpidentifiercodepoints) of [RegExpIdentifierName](#prod-RegExpIdentifierName).
2.  Return [CodePointsToString](#sec-codepointstostring)(`idTextUnescaped`).

#### 22.2.1.11 Static Semantics: RegExpIdentifierCodePoints

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) RegExpIdentifierCodePoints takes no arguments and returns a [List](#sec-list-and-record-specification-type) of code points. It is defined piecewise over the following productions:

[RegExpIdentifierName](#prod-RegExpIdentifierName) :: [RegExpIdentifierStart](#prod-RegExpIdentifierStart)

1.  Let `cp` be the [RegExpIdentifierCodePoint](#sec-regexpidentifiercodepoint) of [RegExpIdentifierStart](#prod-RegExpIdentifierStart).
2.  Return « `cp` ».

[RegExpIdentifierName](#prod-RegExpIdentifierName) :: [RegExpIdentifierName](#prod-RegExpIdentifierName) [RegExpIdentifierPart](#prod-RegExpIdentifierPart)

1.  Let `cps` be the [RegExpIdentifierCodePoints](#sec-regexpidentifiercodepoints) of the derived [RegExpIdentifierName](#prod-RegExpIdentifierName).
2.  Let `cp` be the [RegExpIdentifierCodePoint](#sec-regexpidentifiercodepoint) of [RegExpIdentifierPart](#prod-RegExpIdentifierPart).
3.  Return the [list-concatenation](#list-concatenation) of `cps` and « `cp` ».

#### 22.2.1.12 Static Semantics: RegExpIdentifierCodePoint

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) RegExpIdentifierCodePoint takes no arguments and returns a code point. It is defined piecewise over the following productions:

[RegExpIdentifierStart](#prod-RegExpIdentifierStart) :: [IdentifierStartChar](#prod-IdentifierStartChar)

1.  Return the code point matched by [IdentifierStartChar](#prod-IdentifierStartChar).

[RegExpIdentifierPart](#prod-RegExpIdentifierPart) :: [IdentifierPartChar](#prod-IdentifierPartChar)

1.  Return the code point matched by [IdentifierPartChar](#prod-IdentifierPartChar).

[RegExpIdentifierStart](#prod-RegExpIdentifierStart) :: \\ [RegExpUnicodeEscapeSequence](#prod-RegExpUnicodeEscapeSequence) [RegExpIdentifierPart](#prod-RegExpIdentifierPart) :: \\ [RegExpUnicodeEscapeSequence](#prod-RegExpUnicodeEscapeSequence)

1.  Return the code point whose numeric value is the [CharacterValue](#sec-patterns-static-semantics-character-value) of [RegExpUnicodeEscapeSequence](#prod-RegExpUnicodeEscapeSequence).

[RegExpIdentifierStart](#prod-RegExpIdentifierStart) :: [UnicodeLeadSurrogate](#prod-UnicodeLeadSurrogate) [UnicodeTrailSurrogate](#prod-UnicodeTrailSurrogate) [RegExpIdentifierPart](#prod-RegExpIdentifierPart) :: [UnicodeLeadSurrogate](#prod-UnicodeLeadSurrogate) [UnicodeTrailSurrogate](#prod-UnicodeTrailSurrogate)

1.  Let `lead` be the code unit whose numeric value is the numeric value of the code point matched by [UnicodeLeadSurrogate](#prod-UnicodeLeadSurrogate).
2.  Let `trail` be the code unit whose numeric value is the numeric value of the code point matched by [UnicodeTrailSurrogate](#prod-UnicodeTrailSurrogate).
3.  Return [UTF16SurrogatePairToCodePoint](#sec-utf16decodesurrogatepair)(`lead`, `trail`).

### 22.2.2 Pattern Semantics

A regular expression pattern is converted into an [Abstract Closure](#sec-abstract-closure) using the process described below. An implementation is encouraged to use more efficient algorithms than the ones listed below, as long as the results are the same. The [Abstract Closure](#sec-abstract-closure) is used as the value of a RegExp object's `[[RegExpMatcher]]` internal slot.

A [Pattern](#prod-Pattern) is a BMP pattern if its associated flags contain neither a `u` nor a `v`. Otherwise, it is a Unicode pattern. A BMP pattern matches against a String interpreted as consisting of a sequence of 16-bit values that are Unicode code points in the range of the Basic Multilingual Plane. A Unicode pattern matches against a String interpreted as consisting of Unicode code points encoded using UTF-16. In the context of describing the behaviour of a BMP pattern “character” means a single 16-bit Unicode BMP code point. In the context of describing the behaviour of a Unicode pattern “character” means a UTF-16 encoded code point ([6.1.4](#sec-ecmascript-language-types-string-type)). In either context, “character value” means the numeric value of the corresponding non-encoded code point.

The syntax and semantics of [Pattern](#prod-Pattern) is defined as if the source text for the [Pattern](#prod-Pattern) was a [List](#sec-list-and-record-specification-type) of [SourceCharacter](#prod-SourceCharacter) values where each [SourceCharacter](#prod-SourceCharacter) corresponds to a Unicode code point. If a BMP pattern contains a non-BMP [SourceCharacter](#prod-SourceCharacter) the entire pattern is encoded using UTF-16 and the individual code units of that encoding are used as the elements of the [List](#sec-list-and-record-specification-type).

Note

For example, consider a pattern expressed in source text as the single non-BMP character U+1D11E (MUSICAL SYMBOL G CLEF). Interpreted as a Unicode pattern, it would be a single element (character) [List](#sec-list-and-record-specification-type) consisting of the single code point U+1D11E. However, interpreted as a BMP pattern, it is first UTF-16 encoded to produce a two element [List](#sec-list-and-record-specification-type) consisting of the code units 0xD834 and 0xDD1E.

Patterns are passed to the RegExp [constructor](#constructor) as ECMAScript String values in which non-BMP characters are UTF-16 encoded. For example, the single character MUSICAL SYMBOL G CLEF pattern, expressed as a String value, [is a String](#sec-ecmascript-language-types-string-type) of length 2 whose elements were the code units 0xD834 and 0xDD1E. So no further translation of the string would be necessary to process it as a BMP pattern consisting of two pattern characters. However, to process it as a Unicode pattern [UTF16SurrogatePairToCodePoint](#sec-utf16decodesurrogatepair) must be used in producing a [List](#sec-list-and-record-specification-type) whose sole element is a single pattern character, the code point U+1D11E.

An implementation may not actually perform such translations to or from UTF-16, but the semantics of this specification requires that the result of pattern matching be as if such translations were performed.

#### 22.2.2.1 Notation

The descriptions below use the following internal data structures:

- A CharSetElement is one of the two following entities:
  - If `rer`.`[[UnicodeSets]]` is false, then a CharSetElement is a character in the sense of the Pattern Semantics above.
  - If `rer`.`[[UnicodeSets]]` is true, then a CharSetElement is a sequence whose elements are characters in the sense of the Pattern Semantics above. This includes the empty sequence, sequences of one character, and sequences of more than one character. For convenience, when working with CharSetElements of this kind, an individual character is treated interchangeably with a sequence of one character.
- A CharSet is a mathematical set of CharSetElements.
- A CaptureRange is a [Record](#sec-list-and-record-specification-type) { `[[StartIndex]]`, `[[EndIndex]]` } that represents the range of characters included in a capture, where `[[StartIndex]]` is an [integer](#integer) representing the start index (inclusive) of the range within `Input`, and `[[EndIndex]]` is an [integer](#integer) representing the end index (exclusive) of the range within `Input`. For any [CaptureRange](#pattern-capturerange), these indices must satisfy the invariant that `[[StartIndex]]` ≤ `[[EndIndex]]`.
- A MatchState is a [Record](#sec-list-and-record-specification-type) { `[[Input]]`, `[[EndIndex]]`, `[[Captures]]` } where `[[Input]]` is a [List](#sec-list-and-record-specification-type) of characters representing the String being matched, `[[EndIndex]]` is an [integer](#integer), and `[[Captures]]` is a [List](#sec-list-and-record-specification-type) of values, one for each [left-capturing parenthesis](#sec-countleftcapturingparenswithin) in the pattern. [MatchStates](#pattern-matchstate) are used to represent partial match states in the regular expression matching algorithms. The `[[EndIndex]]` is one plus the index of the last input character matched so far by the pattern, while `[[Captures]]` holds the results of capturing parentheses. The `n`^(th) element of `[[Captures]]` is either a [CaptureRange](#pattern-capturerange) representing the range of characters captured by the `n`^(th) set of capturing parentheses, or undefined if the `n`^(th) set of capturing parentheses hasn't been reached yet. Due to backtracking, many [MatchStates](#pattern-matchstate) may be in use at any time during the matching process.
- A MatcherContinuation is an [Abstract Closure](#sec-abstract-closure) that takes one [MatchState](#pattern-matchstate) argument and returns either a [MatchState](#pattern-matchstate) or failure. The [MatcherContinuation](#pattern-matchercontinuation) attempts to match the remaining portion (specified by the closure's captured values) of the pattern against `Input`, starting at the intermediate state given by its [MatchState](#pattern-matchstate) argument. If the match succeeds, the [MatcherContinuation](#pattern-matchercontinuation) returns the final [MatchState](#pattern-matchstate) that it reached; if the match fails, the [MatcherContinuation](#pattern-matchercontinuation) returns failure.
- A Matcher is an [Abstract Closure](#sec-abstract-closure) that takes two arguments—a [MatchState](#pattern-matchstate) and a [MatcherContinuation](#pattern-matchercontinuation)—and returns either a [MatchState](#pattern-matchstate) or failure. A [Matcher](#pattern-matcher) attempts to match a middle subpattern (specified by the closure's captured values) of the pattern against the [MatchState](#pattern-matchstate)'s `[[Input]]`, starting at the intermediate state given by its [MatchState](#pattern-matchstate) argument. The [MatcherContinuation](#pattern-matchercontinuation) argument should be a closure that matches the rest of the pattern. After matching the subpattern of a pattern to obtain a new [MatchState](#pattern-matchstate), the [Matcher](#pattern-matcher) then calls [MatcherContinuation](#pattern-matchercontinuation) on that new [MatchState](#pattern-matchstate) to test if the rest of the pattern can match as well. If it can, the [Matcher](#pattern-matcher) returns the [MatchState](#pattern-matchstate) returned by [MatcherContinuation](#pattern-matchercontinuation); if not, the [Matcher](#pattern-matcher) may try different choices at its choice points, repeatedly calling [MatcherContinuation](#pattern-matchercontinuation) until it either succeeds or all possibilities have been exhausted.

##### 22.2.2.1.1 RegExp Records

A RegExp Record is a [Record](#sec-list-and-record-specification-type) value used to store information about a RegExp that is needed during compilation and possibly during matching.

It has the following fields:

| Field Name | Value | Meaning |
|----|----|----|
| `[[IgnoreCase]]` | a Boolean | indicates whether "i" appears in the RegExp's flags |
| `[[Multiline]]` | a Boolean | indicates whether "m" appears in the RegExp's flags |
| `[[DotAll]]` | a Boolean | indicates whether "s" appears in the RegExp's flags |
| `[[Unicode]]` | a Boolean | indicates whether "u" appears in the RegExp's flags |
| `[[UnicodeSets]]` | a Boolean | indicates whether "v" appears in the RegExp's flags |
| `[[CapturingGroupsCount]]` | a non-negative [integer](#integer) | the number of [left-capturing parentheses](#sec-countleftcapturingparenswithin) in the RegExp's pattern |

Table 68: [RegExp Record](#sec-regexp-records) Fields

#### 22.2.2.2 Runtime Semantics: CompilePattern

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) CompilePattern takes argument `rer` (a [RegExp Record](#sec-regexp-records)) and returns an [Abstract Closure](#sec-abstract-closure) that takes a [List](#sec-list-and-record-specification-type) of characters and a non-negative [integer](#integer) and returns either a [MatchState](#pattern-matchstate) or failure. It is defined piecewise over the following productions:

[Pattern](#prod-Pattern) :: [Disjunction](#prod-Disjunction)

1.  Let `m` be [CompileSubpattern](#sec-compilesubpattern) of [Disjunction](#prod-Disjunction) with arguments `rer` and forward.
2.  Return a new [Abstract Closure](#sec-abstract-closure) with parameters (`Input`, `index`) that captures `rer` and `m` and performs the following steps when called:
    1.  [Assert](#assert): `Input` is a [List](#sec-list-and-record-specification-type) of characters.
    2.  [Assert](#assert): 0 ≤ `index` ≤ the number of elements in `Input`.
    3.  Let `c` be a new [MatcherContinuation](#pattern-matchercontinuation) with parameters (`y`) that captures nothing and performs the following steps when called:
        1.  [Assert](#assert): `y` is a [MatchState](#pattern-matchstate).
        2.  Return `y`.
    4.  Let `cap` be a [List](#sec-list-and-record-specification-type) of `rer`.`[[CapturingGroupsCount]]` undefined values, indexed 1 through `rer`.`[[CapturingGroupsCount]]`.
    5.  Let `x` be the [MatchState](#pattern-matchstate) { `[[Input]]`: `Input`, `[[EndIndex]]`: `index`, `[[Captures]]`: `cap` }.
    6.  Return `m`(`x`, `c`).

Note

A Pattern compiles to an [Abstract Closure](#sec-abstract-closure) value. [RegExpBuiltinExec](#sec-regexpbuiltinexec) can then apply this procedure to a [List](#sec-list-and-record-specification-type) of characters and an offset within that [List](#sec-list-and-record-specification-type) to determine whether the pattern would match starting at exactly that offset within the [List](#sec-list-and-record-specification-type), and, if it does match, what the values of the capturing parentheses would be. The algorithms in [22.2.2](#sec-pattern-semantics) are designed so that compiling a pattern may throw a SyntaxError exception; on the other hand, once the pattern is successfully compiled, applying the resulting [Abstract Closure](#sec-abstract-closure) to find a match in a [List](#sec-list-and-record-specification-type) of characters cannot throw an exception (except for any [implementation-defined](#implementation-defined) exceptions that can occur anywhere such as out-of-memory).

#### 22.2.2.3 Runtime Semantics: CompileSubpattern

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) CompileSubpattern takes arguments `rer` (a [RegExp Record](#sec-regexp-records)) and `direction` (forward or backward) and returns a [Matcher](#pattern-matcher).

Note 1

This section is amended in [B.1.2.5](#sec-compilesubpattern-annexb).

It is defined piecewise over the following productions:

[Disjunction](#prod-Disjunction) :: [Alternative](#prod-Alternative) \| [Disjunction](#prod-Disjunction)

1.  Let `m1` be [CompileSubpattern](#sec-compilesubpattern) of [Alternative](#prod-Alternative) with arguments `rer` and `direction`.
2.  Let `m2` be [CompileSubpattern](#sec-compilesubpattern) of [Disjunction](#prod-Disjunction) with arguments `rer` and `direction`.
3.  Return [MatchTwoAlternatives](#sec-matchtwoalternatives)(`m1`, `m2`).

Note 2

The `|` regular expression operator separates two alternatives. The pattern first tries to match the left [Alternative](#prod-Alternative) (followed by the sequel of the regular expression); if it fails, it tries to match the right [Disjunction](#prod-Disjunction) (followed by the sequel of the regular expression). If the left [Alternative](#prod-Alternative), the right [Disjunction](#prod-Disjunction), and the sequel all have choice points, all choices in the sequel are tried before moving on to the next choice in the left [Alternative](#prod-Alternative). If choices in the left [Alternative](#prod-Alternative) are exhausted, the right [Disjunction](#prod-Disjunction) is tried instead of the left [Alternative](#prod-Alternative). Any capturing parentheses inside a portion of the pattern skipped by `|` produce undefined values instead of Strings. Thus, for example,

``` javascript
/a|ab/.exec("abc")
```

returns the result "a" and not "ab". Moreover,

``` javascript
/((a)|(ab))((c)|(bc))/.exec("abc")
```

returns the array

``` javascript
["abc", "a", "a", undefined, "bc", undefined, "bc"]
```

and not

``` javascript
["abc", "ab", undefined, "ab", "c", "c", undefined]
```

The order in which the two alternatives are tried is independent of the value of `direction`.

[Alternative](#prod-Alternative) :: \[empty\]

1.  Return [EmptyMatcher](#sec-emptymatcher)().

[Alternative](#prod-Alternative) :: [Alternative](#prod-Alternative) [Term](#prod-Term)

1.  Let `m1` be [CompileSubpattern](#sec-compilesubpattern) of [Alternative](#prod-Alternative) with arguments `rer` and `direction`.
2.  Let `m2` be [CompileSubpattern](#sec-compilesubpattern) of [Term](#prod-Term) with arguments `rer` and `direction`.
3.  Return [MatchSequence](#sec-matchsequence)(`m1`, `m2`, `direction`).

Note 3

Consecutive [Term](#prod-Term)s try to simultaneously match consecutive portions of `Input`. When `direction` is forward, if the left [Alternative](#prod-Alternative), the right [Term](#prod-Term), and the sequel of the regular expression all have choice points, all choices in the sequel are tried before moving on to the next choice in the right [Term](#prod-Term), and all choices in the right [Term](#prod-Term) are tried before moving on to the next choice in the left [Alternative](#prod-Alternative). When `direction` is backward, the evaluation order of [Alternative](#prod-Alternative) and [Term](#prod-Term) are reversed.

[Term](#prod-Term) :: [Assertion](#prod-Assertion)

1.  Return [CompileAssertion](#sec-compileassertion) of [Assertion](#prod-Assertion) with argument `rer`.

Note 4

The resulting [Matcher](#pattern-matcher) is independent of `direction`.

[Term](#prod-Term) :: [Atom](#prod-Atom)

1.  Return [CompileAtom](#sec-compileatom) of [Atom](#prod-Atom) with arguments `rer` and `direction`.

[Term](#prod-Term) :: [Atom](#prod-Atom) [Quantifier](#prod-Quantifier)

1.  Let `m` be [CompileAtom](#sec-compileatom) of [Atom](#prod-Atom) with arguments `rer` and `direction`.
2.  Let `q` be [CompileQuantifier](#sec-compilequantifier) of [Quantifier](#prod-Quantifier).
3.  [Assert](#assert): `q`.`[[Min]]` ≤ `q`.`[[Max]]`.
4.  Let `parenIndex` be [CountLeftCapturingParensBefore](#sec-countleftcapturingparensbefore)([Term](#prod-Term)).
5.  Let `parenCount` be [CountLeftCapturingParensWithin](#sec-countleftcapturingparenswithin)([Atom](#prod-Atom)).
6.  Return a new [Matcher](#pattern-matcher) with parameters (`x`, `c`) that captures `m`, `q`, `parenIndex`, and `parenCount` and performs the following steps when called:
    1.  [Assert](#assert): `x` is a [MatchState](#pattern-matchstate).
    2.  [Assert](#assert): `c` is a [MatcherContinuation](#pattern-matchercontinuation).
    3.  Return [RepeatMatcher](#sec-runtime-semantics-repeatmatcher-abstract-operation)(`m`, `q`.`[[Min]]`, `q`.`[[Max]]`, `q`.`[[Greedy]]`, `x`, `c`, `parenIndex`, `parenCount`).

##### 22.2.2.3.1 RepeatMatcher ( `m`, `min`, `max`, `greedy`, `x`, `c`, `parenIndex`, `parenCount` )

The abstract operation RepeatMatcher takes arguments `m` (a [Matcher](#pattern-matcher)), `min` (a non-negative [integer](#integer)), `max` (a non-negative [integer](#integer) or +∞), `greedy` (a Boolean), `x` (a [MatchState](#pattern-matchstate)), `c` (a [MatcherContinuation](#pattern-matchercontinuation)), `parenIndex` (a non-negative [integer](#integer)), and `parenCount` (a non-negative [integer](#integer)) and returns either a [MatchState](#pattern-matchstate) or failure. It performs the following steps when called:

1.  If `max` = 0, return `c`(`x`).
2.  Let `d` be a new [MatcherContinuation](#pattern-matchercontinuation) with parameters (`y`) that captures `m`, `min`, `max`, `greedy`, `x`, `c`, `parenIndex`, and `parenCount` and performs the following steps when called:
    1.  [Assert](#assert): `y` is a [MatchState](#pattern-matchstate).
    2.  If `min` = 0 and `y`.`[[EndIndex]]` = `x`.`[[EndIndex]]`, return failure.
    3.  If `min` = 0, let `min2` be 0; otherwise let `min2` be `min` - 1.
    4.  If `max` = +∞, let `max2` be +∞; otherwise let `max2` be `max` - 1.
    5.  Return [RepeatMatcher](#sec-runtime-semantics-repeatmatcher-abstract-operation)(`m`, `min2`, `max2`, `greedy`, `y`, `c`, `parenIndex`, `parenCount`).
3.  Let `cap` be a copy of `x`.`[[Captures]]`.
4.  For each [integer](#integer) `k` in the [inclusive interval](#inclusive-interval) from `parenIndex` + 1 to `parenIndex` + `parenCount`, set `cap`\[`k`\] to undefined.
5.  Let `Input` be `x`.`[[Input]]`.
6.  Let `e` be `x`.`[[EndIndex]]`.
7.  Let `xr` be the [MatchState](#pattern-matchstate) { `[[Input]]`: `Input`, `[[EndIndex]]`: `e`, `[[Captures]]`: `cap` }.
8.  If `min` ≠ 0, return `m`(`xr`, `d`).
9.  If `greedy` is false, then
    1.  Let `z` be `c`(`x`).
    2.  If `z` is not failure, return `z`.
    3.  Return `m`(`xr`, `d`).
10. Let `z` be `m`(`xr`, `d`).
11. If `z` is not failure, return `z`.
12. Return `c`(`x`).

Note 1

An [Atom](#prod-Atom) followed by a [Quantifier](#prod-Quantifier) is repeated the number of times specified by the [Quantifier](#prod-Quantifier). A [Quantifier](#prod-Quantifier) can be non-greedy, in which case the [Atom](#prod-Atom) pattern is repeated as few times as possible while still matching the sequel, or it can be greedy, in which case the [Atom](#prod-Atom) pattern is repeated as many times as possible while still matching the sequel. The [Atom](#prod-Atom) pattern is repeated rather than the input character sequence that it matches, so different repetitions of the [Atom](#prod-Atom) can match different input substrings.

Note 2

If the [Atom](#prod-Atom) and the sequel of the regular expression all have choice points, the [Atom](#prod-Atom) is first matched as many (or as few, if non-greedy) times as possible. All choices in the sequel are tried before moving on to the next choice in the last repetition of [Atom](#prod-Atom). All choices in the last (n^(th)) repetition of [Atom](#prod-Atom) are tried before moving on to the next choice in the next-to-last (n - 1)^(st) repetition of [Atom](#prod-Atom); at which point it may turn out that more or fewer repetitions of [Atom](#prod-Atom) are now possible; these are exhausted (again, starting with either as few or as many as possible) before moving on to the next choice in the (n - 1)^(st) repetition of [Atom](#prod-Atom) and so on.

Compare

``` javascript
/a[a-z]{2,4}/.exec("abcdefghi")
```

which returns "abcde" with

``` javascript
/a[a-z]{2,4}?/.exec("abcdefghi")
```

which returns "abc".

Consider also

``` javascript
/(aa|aabaac|ba|b|c)*/.exec("aabaac")
```

which, by the choice point ordering above, returns the array

``` javascript
["aaba", "ba"]
```

and not any of:

``` javascript
["aabaac", "aabaac"]
["aabaac", "c"]
```

The above ordering of choice points can be used to write a regular expression that calculates the greatest common divisor of two numbers (represented in unary notation). The following example calculates the gcd of 10 and 15:

``` javascript
"aaaaaaaaaa,aaaaaaaaaaaaaaa".replace(/^(a+)\1*,\1+$/, "$1")
```

which returns the gcd in unary notation "aaaaa".

Note 3

Step [4](#step-repeatmatcher-clear-captures) of the RepeatMatcher clears [Atom](#prod-Atom)'s captures each time [Atom](#prod-Atom) is repeated. We can see its behaviour in the regular expression

``` javascript
/(z)((a+)?(b+)?(c))*/.exec("zaacbbbcac")
```

which returns the array

``` javascript
["zaacbbbcac", "z", "ac", "a", undefined, "c"]
```

and not

``` javascript
["zaacbbbcac", "z", "ac", "a", "bbb", "c"]
```

because each iteration of the outermost `*` clears all captured Strings contained in the quantified [Atom](#prod-Atom), which in this case includes capture Strings numbered 2, 3, 4, and 5.

Note 4

Step [2.b](#step-repeatmatcher-done) of the RepeatMatcher states that once the minimum number of repetitions has been satisfied, any more expansions of [Atom](#prod-Atom) that match the empty character sequence are not considered for further repetitions. This prevents the regular expression engine from falling into an infinite loop on patterns such as:

``` javascript
/(a*)*/.exec("b")
```

or the slightly more complicated:

``` javascript
/(a*)b\1+/.exec("baaaac")
```

which returns the array

``` javascript
["b", ""]
```

##### 22.2.2.3.2 EmptyMatcher ( )

The abstract operation EmptyMatcher takes no arguments and returns a [Matcher](#pattern-matcher). It performs the following steps when called:

1.  Return a new [Matcher](#pattern-matcher) with parameters (`x`, `c`) that captures nothing and performs the following steps when called:
    1.  [Assert](#assert): `x` is a [MatchState](#pattern-matchstate).
    2.  [Assert](#assert): `c` is a [MatcherContinuation](#pattern-matchercontinuation).
    3.  Return `c`(`x`).

##### 22.2.2.3.3 MatchTwoAlternatives ( `m1`, `m2` )

The abstract operation MatchTwoAlternatives takes arguments `m1` (a [Matcher](#pattern-matcher)) and `m2` (a [Matcher](#pattern-matcher)) and returns a [Matcher](#pattern-matcher). It performs the following steps when called:

1.  Return a new [Matcher](#pattern-matcher) with parameters (`x`, `c`) that captures `m1` and `m2` and performs the following steps when called:
    1.  [Assert](#assert): `x` is a [MatchState](#pattern-matchstate).
    2.  [Assert](#assert): `c` is a [MatcherContinuation](#pattern-matchercontinuation).
    3.  Let `r` be `m1`(`x`, `c`).
    4.  If `r` is not failure, return `r`.
    5.  Return `m2`(`x`, `c`).

##### 22.2.2.3.4 MatchSequence ( `m1`, `m2`, `direction` )

The abstract operation MatchSequence takes arguments `m1` (a [Matcher](#pattern-matcher)), `m2` (a [Matcher](#pattern-matcher)), and `direction` (forward or backward) and returns a [Matcher](#pattern-matcher). It performs the following steps when called:

1.  If `direction` is forward, then
    1.  Return a new [Matcher](#pattern-matcher) with parameters (`x`, `c`) that captures `m1` and `m2` and performs the following steps when called:
        1.  [Assert](#assert): `x` is a [MatchState](#pattern-matchstate).
        2.  [Assert](#assert): `c` is a [MatcherContinuation](#pattern-matchercontinuation).
        3.  Let `d` be a new [MatcherContinuation](#pattern-matchercontinuation) with parameters (`y`) that captures `c` and `m2` and performs the following steps when called:
            1.  [Assert](#assert): `y` is a [MatchState](#pattern-matchstate).
            2.  Return `m2`(`y`, `c`).
        4.  Return `m1`(`x`, `d`).
2.  Else,
    1.  [Assert](#assert): `direction` is backward.
    2.  Return a new [Matcher](#pattern-matcher) with parameters (`x`, `c`) that captures `m1` and `m2` and performs the following steps when called:
        1.  [Assert](#assert): `x` is a [MatchState](#pattern-matchstate).
        2.  [Assert](#assert): `c` is a [MatcherContinuation](#pattern-matchercontinuation).
        3.  Let `d` be a new [MatcherContinuation](#pattern-matchercontinuation) with parameters (`y`) that captures `c` and `m1` and performs the following steps when called:
            1.  [Assert](#assert): `y` is a [MatchState](#pattern-matchstate).
            2.  Return `m1`(`y`, `c`).
        4.  Return `m2`(`x`, `d`).

#### 22.2.2.4 Runtime Semantics: CompileAssertion

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) CompileAssertion takes argument `rer` (a [RegExp Record](#sec-regexp-records)) and returns a [Matcher](#pattern-matcher).

Note 1

This section is amended in [B.1.2.6](#sec-compileassertion-annexb).

It is defined piecewise over the following productions:

[Assertion](#prod-Assertion) :: ^

1.  Return a new [Matcher](#pattern-matcher) with parameters (`x`, `c`) that captures `rer` and performs the following steps when called:
    1.  [Assert](#assert): `x` is a [MatchState](#pattern-matchstate).
    2.  [Assert](#assert): `c` is a [MatcherContinuation](#pattern-matchercontinuation).
    3.  Let `Input` be `x`.`[[Input]]`.
    4.  Let `e` be `x`.`[[EndIndex]]`.
    5.  If `e` = 0, or if `rer`.`[[Multiline]]` is true and the character `Input`\[`e` - 1\] is matched by [LineTerminator](#prod-LineTerminator), then
        1.  Return `c`(`x`).
    6.  Return failure.

Note 2

Even when the `y` flag is used with a pattern, `^` always matches only at the beginning of `Input`, or (if `rer`.`[[Multiline]]` is true) at the beginning of a line.

[Assertion](#prod-Assertion) :: \$

1.  Return a new [Matcher](#pattern-matcher) with parameters (`x`, `c`) that captures `rer` and performs the following steps when called:
    1.  [Assert](#assert): `x` is a [MatchState](#pattern-matchstate).
    2.  [Assert](#assert): `c` is a [MatcherContinuation](#pattern-matchercontinuation).
    3.  Let `Input` be `x`.`[[Input]]`.
    4.  Let `e` be `x`.`[[EndIndex]]`.
    5.  Let `InputLength` be the number of elements in `Input`.
    6.  If `e` = `InputLength`, or if `rer`.`[[Multiline]]` is true and the character `Input`\[`e`\] is matched by [LineTerminator](#prod-LineTerminator), then
        1.  Return `c`(`x`).
    7.  Return failure.

[Assertion](#prod-Assertion) :: \b

1.  Return a new [Matcher](#pattern-matcher) with parameters (`x`, `c`) that captures `rer` and performs the following steps when called:
    1.  [Assert](#assert): `x` is a [MatchState](#pattern-matchstate).
    2.  [Assert](#assert): `c` is a [MatcherContinuation](#pattern-matchercontinuation).
    3.  Let `Input` be `x`.`[[Input]]`.
    4.  Let `e` be `x`.`[[EndIndex]]`.
    5.  Let `a` be [IsWordChar](#sec-runtime-semantics-iswordchar-abstract-operation)(`rer`, `Input`, `e` - 1).
    6.  Let `b` be [IsWordChar](#sec-runtime-semantics-iswordchar-abstract-operation)(`rer`, `Input`, `e`).
    7.  If `a` is true and `b` is false, or if `a` is false and `b` is true, return `c`(`x`).
    8.  Return failure.

[Assertion](#prod-Assertion) :: \B

1.  Return a new [Matcher](#pattern-matcher) with parameters (`x`, `c`) that captures `rer` and performs the following steps when called:
    1.  [Assert](#assert): `x` is a [MatchState](#pattern-matchstate).
    2.  [Assert](#assert): `c` is a [MatcherContinuation](#pattern-matchercontinuation).
    3.  Let `Input` be `x`.`[[Input]]`.
    4.  Let `e` be `x`.`[[EndIndex]]`.
    5.  Let `a` be [IsWordChar](#sec-runtime-semantics-iswordchar-abstract-operation)(`rer`, `Input`, `e` - 1).
    6.  Let `b` be [IsWordChar](#sec-runtime-semantics-iswordchar-abstract-operation)(`rer`, `Input`, `e`).
    7.  If `a` is true and `b` is true, or if `a` is false and `b` is false, return `c`(`x`).
    8.  Return failure.

[Assertion](#prod-Assertion) :: (?= [Disjunction](#prod-Disjunction) )

1.  Let `m` be [CompileSubpattern](#sec-compilesubpattern) of [Disjunction](#prod-Disjunction) with arguments `rer` and forward.
2.  Return a new [Matcher](#pattern-matcher) with parameters (`x`, `c`) that captures `m` and performs the following steps when called:
    1.  [Assert](#assert): `x` is a [MatchState](#pattern-matchstate).
    2.  [Assert](#assert): `c` is a [MatcherContinuation](#pattern-matchercontinuation).
    3.  Let `d` be a new [MatcherContinuation](#pattern-matchercontinuation) with parameters (`y`) that captures nothing and performs the following steps when called:
        1.  [Assert](#assert): `y` is a [MatchState](#pattern-matchstate).
        2.  Return `y`.
    4.  Let `r` be `m`(`x`, `d`).
    5.  If `r` is failure, return failure.
    6.  [Assert](#assert): `r` is a [MatchState](#pattern-matchstate).
    7.  Let `cap` be `r`.`[[Captures]]`.
    8.  Let `Input` be `x`.`[[Input]]`.
    9.  Let `xe` be `x`.`[[EndIndex]]`.
    10. Let `z` be the [MatchState](#pattern-matchstate) { `[[Input]]`: `Input`, `[[EndIndex]]`: `xe`, `[[Captures]]`: `cap` }.
    11. Return `c`(`z`).

Note 3

The form `(?=` [Disjunction](#prod-Disjunction) `)` specifies a zero-width positive lookahead. In order for it to succeed, the pattern inside [Disjunction](#prod-Disjunction) must match at the current position, but the current position is not advanced before matching the sequel. If [Disjunction](#prod-Disjunction) can match at the current position in several ways, only the first one is tried. Unlike other regular expression operators, there is no backtracking into a `(?=` form (this unusual behaviour is inherited from Perl). This only matters when the [Disjunction](#prod-Disjunction) contains capturing parentheses and the sequel of the pattern contains backreferences to those captures.

For example,

``` javascript
/(?=(a+))/.exec("baaabac")
```

matches the empty String immediately after the first `b` and therefore returns the array:

``` javascript
["", "aaa"]
```

To illustrate the lack of backtracking into the lookahead, consider:

``` javascript
/(?=(a+))a*b\1/.exec("baaabac")
```

This expression returns

``` javascript
["aba", "a"]
```

and not:

``` javascript
["aaaba", "a"]
```

[Assertion](#prod-Assertion) :: (?! [Disjunction](#prod-Disjunction) )

1.  Let `m` be [CompileSubpattern](#sec-compilesubpattern) of [Disjunction](#prod-Disjunction) with arguments `rer` and forward.
2.  Return a new [Matcher](#pattern-matcher) with parameters (`x`, `c`) that captures `m` and performs the following steps when called:
    1.  [Assert](#assert): `x` is a [MatchState](#pattern-matchstate).
    2.  [Assert](#assert): `c` is a [MatcherContinuation](#pattern-matchercontinuation).
    3.  Let `d` be a new [MatcherContinuation](#pattern-matchercontinuation) with parameters (`y`) that captures nothing and performs the following steps when called:
        1.  [Assert](#assert): `y` is a [MatchState](#pattern-matchstate).
        2.  Return `y`.
    4.  Let `r` be `m`(`x`, `d`).
    5.  If `r` is not failure, return failure.
    6.  Return `c`(`x`).

Note 4

The form `(?!` [Disjunction](#prod-Disjunction) `)` specifies a zero-width negative lookahead. In order for it to succeed, the pattern inside [Disjunction](#prod-Disjunction) must fail to match at the current position. The current position is not advanced before matching the sequel. [Disjunction](#prod-Disjunction) can contain capturing parentheses, but backreferences to them only make sense from within [Disjunction](#prod-Disjunction) itself. Backreferences to these capturing parentheses from elsewhere in the pattern always return undefined because the negative lookahead must fail for the pattern to succeed. For example,

``` javascript
/(.*?)a(?!(a+)b\2c)\2(.*)/.exec("baaabaac")
```

looks for an `a` not immediately followed by some positive number n of `a`'s, a `b`, another n `a`'s (specified by the first `\2`) and a `c`. The second `\2` is outside the negative lookahead, so it matches against undefined and therefore always succeeds. The whole expression returns the array:

``` javascript
["baaabaac", "ba", undefined, "abaac"]
```

[Assertion](#prod-Assertion) :: (?\<= [Disjunction](#prod-Disjunction) )

1.  Let `m` be [CompileSubpattern](#sec-compilesubpattern) of [Disjunction](#prod-Disjunction) with arguments `rer` and backward.
2.  Return a new [Matcher](#pattern-matcher) with parameters (`x`, `c`) that captures `m` and performs the following steps when called:
    1.  [Assert](#assert): `x` is a [MatchState](#pattern-matchstate).
    2.  [Assert](#assert): `c` is a [MatcherContinuation](#pattern-matchercontinuation).
    3.  Let `d` be a new [MatcherContinuation](#pattern-matchercontinuation) with parameters (`y`) that captures nothing and performs the following steps when called:
        1.  [Assert](#assert): `y` is a [MatchState](#pattern-matchstate).
        2.  Return `y`.
    4.  Let `r` be `m`(`x`, `d`).
    5.  If `r` is failure, return failure.
    6.  [Assert](#assert): `r` is a [MatchState](#pattern-matchstate).
    7.  Let `cap` be `r`.`[[Captures]]`.
    8.  Let `Input` be `x`.`[[Input]]`.
    9.  Let `xe` be `x`.`[[EndIndex]]`.
    10. Let `z` be the [MatchState](#pattern-matchstate) { `[[Input]]`: `Input`, `[[EndIndex]]`: `xe`, `[[Captures]]`: `cap` }.
    11. Return `c`(`z`).

[Assertion](#prod-Assertion) :: (?\<! [Disjunction](#prod-Disjunction) )

1.  Let `m` be [CompileSubpattern](#sec-compilesubpattern) of [Disjunction](#prod-Disjunction) with arguments `rer` and backward.
2.  Return a new [Matcher](#pattern-matcher) with parameters (`x`, `c`) that captures `m` and performs the following steps when called:
    1.  [Assert](#assert): `x` is a [MatchState](#pattern-matchstate).
    2.  [Assert](#assert): `c` is a [MatcherContinuation](#pattern-matchercontinuation).
    3.  Let `d` be a new [MatcherContinuation](#pattern-matchercontinuation) with parameters (`y`) that captures nothing and performs the following steps when called:
        1.  [Assert](#assert): `y` is a [MatchState](#pattern-matchstate).
        2.  Return `y`.
    4.  Let `r` be `m`(`x`, `d`).
    5.  If `r` is not failure, return failure.
    6.  Return `c`(`x`).

##### 22.2.2.4.1 IsWordChar ( `rer`, `Input`, `e` )

The abstract operation IsWordChar takes arguments `rer` (a [RegExp Record](#sec-regexp-records)), `Input` (a [List](#sec-list-and-record-specification-type) of characters), and `e` (an [integer](#integer)) and returns a Boolean. It performs the following steps when called:

1.  Let `InputLength` be the number of elements in `Input`.
2.  If `e` = -1 or `e` = `InputLength`, return false.
3.  Let `c` be the character `Input`\[`e`\].
4.  If [WordCharacters](#sec-wordcharacters)(`rer`) contains `c`, return true.
5.  Return false.

#### 22.2.2.5 Runtime Semantics: CompileQuantifier

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) CompileQuantifier takes no arguments and returns a [Record](#sec-list-and-record-specification-type) with fields `[[Min]]` (a non-negative [integer](#integer)), `[[Max]]` (a non-negative [integer](#integer) or +∞), and `[[Greedy]]` (a Boolean). It is defined piecewise over the following productions:

[Quantifier](#prod-Quantifier) :: [QuantifierPrefix](#prod-QuantifierPrefix)

1.  Let `qp` be [CompileQuantifierPrefix](#sec-compilequantifierprefix) of [QuantifierPrefix](#prod-QuantifierPrefix).
2.  Return the [Record](#sec-list-and-record-specification-type) { `[[Min]]`: `qp`.`[[Min]]`, `[[Max]]`: `qp`.`[[Max]]`, `[[Greedy]]`: true }.

[Quantifier](#prod-Quantifier) :: [QuantifierPrefix](#prod-QuantifierPrefix) ?

1.  Let `qp` be [CompileQuantifierPrefix](#sec-compilequantifierprefix) of [QuantifierPrefix](#prod-QuantifierPrefix).
2.  Return the [Record](#sec-list-and-record-specification-type) { `[[Min]]`: `qp`.`[[Min]]`, `[[Max]]`: `qp`.`[[Max]]`, `[[Greedy]]`: false }.

#### 22.2.2.6 Runtime Semantics: CompileQuantifierPrefix

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) CompileQuantifierPrefix takes no arguments and returns a [Record](#sec-list-and-record-specification-type) with fields `[[Min]]` (a non-negative [integer](#integer)) and `[[Max]]` (a non-negative [integer](#integer) or +∞). It is defined piecewise over the following productions:

[QuantifierPrefix](#prod-QuantifierPrefix) :: \*

1.  Return the [Record](#sec-list-and-record-specification-type) { `[[Min]]`: 0, `[[Max]]`: +∞ }.

[QuantifierPrefix](#prod-QuantifierPrefix) :: +

1.  Return the [Record](#sec-list-and-record-specification-type) { `[[Min]]`: 1, `[[Max]]`: +∞ }.

[QuantifierPrefix](#prod-QuantifierPrefix) :: ?

1.  Return the [Record](#sec-list-and-record-specification-type) { `[[Min]]`: 0, `[[Max]]`: 1 }.

[QuantifierPrefix](#prod-QuantifierPrefix) :: { [DecimalDigits](#prod-DecimalDigits) }

1.  Let `i` be the MV of [DecimalDigits](#prod-DecimalDigits) (see [12.9.3](#sec-literals-numeric-literals)).
2.  Return the [Record](#sec-list-and-record-specification-type) { `[[Min]]`: `i`, `[[Max]]`: `i` }.

[QuantifierPrefix](#prod-QuantifierPrefix) :: { [DecimalDigits](#prod-DecimalDigits) ,}

1.  Let `i` be the MV of [DecimalDigits](#prod-DecimalDigits).
2.  Return the [Record](#sec-list-and-record-specification-type) { `[[Min]]`: `i`, `[[Max]]`: +∞ }.

[QuantifierPrefix](#prod-QuantifierPrefix) :: { [DecimalDigits](#prod-DecimalDigits) , [DecimalDigits](#prod-DecimalDigits) }

1.  Let `i` be the MV of the first [DecimalDigits](#prod-DecimalDigits).
2.  Let `j` be the MV of the second [DecimalDigits](#prod-DecimalDigits).
3.  Return the [Record](#sec-list-and-record-specification-type) { `[[Min]]`: `i`, `[[Max]]`: `j` }.

#### 22.2.2.7 Runtime Semantics: CompileAtom

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) CompileAtom takes arguments `rer` (a [RegExp Record](#sec-regexp-records)) and `direction` (forward or backward) and returns a [Matcher](#pattern-matcher).

Note 1

This section is amended in [B.1.2.7](#sec-compileatom-annexb).

It is defined piecewise over the following productions:

[Atom](#prod-Atom) :: [PatternCharacter](#prod-PatternCharacter)

1.  Let `ch` be the character matched by [PatternCharacter](#prod-PatternCharacter).
2.  Let `A` be a one-element [CharSet](#pattern-charset) containing the character `ch`.
3.  Return [CharacterSetMatcher](#sec-runtime-semantics-charactersetmatcher-abstract-operation)(`rer`, `A`, false, `direction`).

[Atom](#prod-Atom) :: .

1.  Let `A` be [AllCharacters](#sec-allcharacters)(`rer`).
2.  If `rer`.`[[DotAll]]` is not true, then
    1.  Remove from `A` all characters corresponding to a code point on the right-hand side of the [LineTerminator](#prod-LineTerminator) production.
3.  Return [CharacterSetMatcher](#sec-runtime-semantics-charactersetmatcher-abstract-operation)(`rer`, `A`, false, `direction`).

[Atom](#prod-Atom) :: [CharacterClass](#prod-CharacterClass)

1.  Let `cc` be [CompileCharacterClass](#sec-compilecharacterclass) of [CharacterClass](#prod-CharacterClass) with argument `rer`.
2.  Let `cs` be `cc`.`[[CharSet]]`.
3.  If `rer`.`[[UnicodeSets]]` is false, or if every [CharSetElement](#sec-pattern-notation) of `cs` consists of a single character (including if `cs` is empty), return [CharacterSetMatcher](#sec-runtime-semantics-charactersetmatcher-abstract-operation)(`rer`, `cs`, `cc`.`[[Invert]]`, `direction`).
4.  [Assert](#assert): `cc`.`[[Invert]]` is false.
5.  Let `lm` be an empty [List](#sec-list-and-record-specification-type) of [Matchers](#pattern-matcher).
6.  For each [CharSetElement](#sec-pattern-notation) `s` in `cs` containing more than 1 character, iterating in descending order of length, do
    1.  Let `cs2` be a one-element [CharSet](#pattern-charset) containing the last code point of `s`.
    2.  Let `m2` be [CharacterSetMatcher](#sec-runtime-semantics-charactersetmatcher-abstract-operation)(`rer`, `cs2`, false, `direction`).
    3.  For each code point `c1` in `s`, iterating backwards from its second-to-last code point, do
        1.  Let `cs1` be a one-element [CharSet](#pattern-charset) containing `c1`.
        2.  Let `m1` be [CharacterSetMatcher](#sec-runtime-semantics-charactersetmatcher-abstract-operation)(`rer`, `cs1`, false, `direction`).
        3.  Set `m2` to [MatchSequence](#sec-matchsequence)(`m1`, `m2`, `direction`).
    4.  Append `m2` to `lm`.
7.  Let `singles` be the [CharSet](#pattern-charset) containing every [CharSetElement](#sec-pattern-notation) of `cs` that consists of a single character.
8.  Append [CharacterSetMatcher](#sec-runtime-semantics-charactersetmatcher-abstract-operation)(`rer`, `singles`, false, `direction`) to `lm`.
9.  If `cs` contains the empty sequence of characters, append [EmptyMatcher](#sec-emptymatcher)() to `lm`.
10. Let `m2` be the last [Matcher](#pattern-matcher) in `lm`.
11. For each [Matcher](#pattern-matcher) `m1` of `lm`, iterating backwards from its second-to-last element, do
    1.  Set `m2` to [MatchTwoAlternatives](#sec-matchtwoalternatives)(`m1`, `m2`).
12. Return `m2`.

[Atom](#prod-Atom) :: ( [GroupSpecifier](#prod-GroupSpecifier)opt [Disjunction](#prod-Disjunction) )

1.  Let `m` be [CompileSubpattern](#sec-compilesubpattern) of [Disjunction](#prod-Disjunction) with arguments `rer` and `direction`.
2.  Let `parenIndex` be [CountLeftCapturingParensBefore](#sec-countleftcapturingparensbefore)([Atom](#prod-Atom)).
3.  Return a new [Matcher](#pattern-matcher) with parameters (`x`, `c`) that captures `direction`, `m`, and `parenIndex` and performs the following steps when called:
    1.  [Assert](#assert): `x` is a [MatchState](#pattern-matchstate).
    2.  [Assert](#assert): `c` is a [MatcherContinuation](#pattern-matchercontinuation).
    3.  Let `d` be a new [MatcherContinuation](#pattern-matchercontinuation) with parameters (`y`) that captures `x`, `c`, `direction`, and `parenIndex` and performs the following steps when called:
        1.  [Assert](#assert): `y` is a [MatchState](#pattern-matchstate).
        2.  Let `cap` be a copy of `y`.`[[Captures]]`.
        3.  Let `Input` be `x`.`[[Input]]`.
        4.  Let `xe` be `x`.`[[EndIndex]]`.
        5.  Let `ye` be `y`.`[[EndIndex]]`.
        6.  If `direction` is forward, then
            1.  [Assert](#assert): `xe` ≤ `ye`.
            2.  Let `r` be the [CaptureRange](#pattern-capturerange) { `[[StartIndex]]`: `xe`, `[[EndIndex]]`: `ye` }.
        7.  Else,
            1.  [Assert](#assert): `direction` is backward.
            2.  [Assert](#assert): `ye` ≤ `xe`.
            3.  Let `r` be the [CaptureRange](#pattern-capturerange) { `[[StartIndex]]`: `ye`, `[[EndIndex]]`: `xe` }.
        8.  Set `cap`\[`parenIndex` + 1\] to `r`.
        9.  Let `z` be the [MatchState](#pattern-matchstate) { `[[Input]]`: `Input`, `[[EndIndex]]`: `ye`, `[[Captures]]`: `cap` }.
        10. Return `c`(`z`).
    4.  Return `m`(`x`, `d`).

Note 2

Parentheses of the form `(` [Disjunction](#prod-Disjunction) `)` serve both to group the components of the [Disjunction](#prod-Disjunction) pattern together and to save the result of the match. The result can be used either in a backreference (`\` followed by a non-zero decimal number), referenced in a replace String, or returned as part of an array from the regular expression matching [Abstract Closure](#sec-abstract-closure). To inhibit the capturing behaviour of parentheses, use the form `(?:` [Disjunction](#prod-Disjunction) `)` instead.

[Atom](#prod-Atom) :: (? [RegularExpressionModifiers](#prod-RegularExpressionModifiers) : [Disjunction](#prod-Disjunction) )

1.  Let `addModifiers` be the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) [RegularExpressionModifiers](#prod-RegularExpressionModifiers).
2.  Let `removeModifiers` be the empty String.
3.  Let `modifiedRer` be [UpdateModifiers](#sec-updatemodifiers)(`rer`, [CodePointsToString](#sec-codepointstostring)(`addModifiers`), `removeModifiers`).
4.  Return [CompileSubpattern](#sec-compilesubpattern) of [Disjunction](#prod-Disjunction) with arguments `modifiedRer` and `direction`.

[Atom](#prod-Atom) :: (? [RegularExpressionModifiers](#prod-RegularExpressionModifiers) - [RegularExpressionModifiers](#prod-RegularExpressionModifiers) : [Disjunction](#prod-Disjunction) )

1.  Let `addModifiers` be the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) the first [RegularExpressionModifiers](#prod-RegularExpressionModifiers).
2.  Let `removeModifiers` be the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) the second [RegularExpressionModifiers](#prod-RegularExpressionModifiers).
3.  Let `modifiedRer` be [UpdateModifiers](#sec-updatemodifiers)(`rer`, [CodePointsToString](#sec-codepointstostring)(`addModifiers`), [CodePointsToString](#sec-codepointstostring)(`removeModifiers`)).
4.  Return [CompileSubpattern](#sec-compilesubpattern) of [Disjunction](#prod-Disjunction) with arguments `modifiedRer` and `direction`.

[AtomEscape](#prod-AtomEscape) :: [DecimalEscape](#prod-DecimalEscape)

1.  Let `n` be the [CapturingGroupNumber](#sec-patterns-static-semantics-capturing-group-number) of [DecimalEscape](#prod-DecimalEscape).
2.  [Assert](#assert): `n` ≤ `rer`.`[[CapturingGroupsCount]]`.
3.  Return [BackreferenceMatcher](#sec-backreference-matcher)(`rer`, « `n` », `direction`).

Note 3

An escape sequence of the form `\` followed by a non-zero decimal number `n` matches the result of the `n`^(th) set of capturing parentheses ([22.2.2.1](#sec-pattern-notation)). It is an error if the regular expression has fewer than `n` capturing parentheses. If the regular expression has `n` or more capturing parentheses but the `n`^(th) one is undefined because it has not captured anything, then the backreference always succeeds.

[AtomEscape](#prod-AtomEscape) :: [CharacterEscape](#prod-CharacterEscape)

1.  Let `cv` be the [CharacterValue](#sec-patterns-static-semantics-character-value) of [CharacterEscape](#prod-CharacterEscape).
2.  Let `ch` be the character whose character value is `cv`.
3.  Let `A` be a one-element [CharSet](#pattern-charset) containing the character `ch`.
4.  Return [CharacterSetMatcher](#sec-runtime-semantics-charactersetmatcher-abstract-operation)(`rer`, `A`, false, `direction`).

[AtomEscape](#prod-AtomEscape) :: [CharacterClassEscape](#prod-CharacterClassEscape)

1.  Let `cs` be [CompileToCharSet](#sec-compiletocharset) of [CharacterClassEscape](#prod-CharacterClassEscape) with argument `rer`.
2.  If `rer`.`[[UnicodeSets]]` is false, or if every [CharSetElement](#sec-pattern-notation) of `cs` consists of a single character (including if `cs` is empty), return [CharacterSetMatcher](#sec-runtime-semantics-charactersetmatcher-abstract-operation)(`rer`, `cs`, false, `direction`).
3.  Let `lm` be an empty [List](#sec-list-and-record-specification-type) of [Matchers](#pattern-matcher).
4.  For each [CharSetElement](#sec-pattern-notation) `s` in `cs` containing more than 1 character, iterating in descending order of length, do
    1.  Let `cs2` be a one-element [CharSet](#pattern-charset) containing the last code point of `s`.
    2.  Let `m2` be [CharacterSetMatcher](#sec-runtime-semantics-charactersetmatcher-abstract-operation)(`rer`, `cs2`, false, `direction`).
    3.  For each code point `c1` in `s`, iterating backwards from its second-to-last code point, do
        1.  Let `cs1` be a one-element [CharSet](#pattern-charset) containing `c1`.
        2.  Let `m1` be [CharacterSetMatcher](#sec-runtime-semantics-charactersetmatcher-abstract-operation)(`rer`, `cs1`, false, `direction`).
        3.  Set `m2` to [MatchSequence](#sec-matchsequence)(`m1`, `m2`, `direction`).
    4.  Append `m2` to `lm`.
5.  Let `singles` be the [CharSet](#pattern-charset) containing every [CharSetElement](#sec-pattern-notation) of `cs` that consists of a single character.
6.  Append [CharacterSetMatcher](#sec-runtime-semantics-charactersetmatcher-abstract-operation)(`rer`, `singles`, false, `direction`) to `lm`.
7.  If `cs` contains the empty sequence of characters, append [EmptyMatcher](#sec-emptymatcher)() to `lm`.
8.  Let `m2` be the last [Matcher](#pattern-matcher) in `lm`.
9.  For each [Matcher](#pattern-matcher) `m1` of `lm`, iterating backwards from its second-to-last element, do
    1.  Set `m2` to [MatchTwoAlternatives](#sec-matchtwoalternatives)(`m1`, `m2`).
10. Return `m2`.

[AtomEscape](#prod-AtomEscape) :: k [GroupName](#prod-GroupName)

1.  Let `matchingGroupSpecifiers` be [GroupSpecifiersThatMatch](#sec-groupspecifiersthatmatch)([GroupName](#prod-GroupName)).
2.  Let `parenIndices` be a new empty [List](#sec-list-and-record-specification-type).
3.  For each [GroupSpecifier](#prod-GroupSpecifier) `groupSpecifier` of `matchingGroupSpecifiers`, do
    1.  Let `parenIndex` be [CountLeftCapturingParensBefore](#sec-countleftcapturingparensbefore)(`groupSpecifier`).
    2.  Append `parenIndex` to `parenIndices`.
4.  Return [BackreferenceMatcher](#sec-backreference-matcher)(`rer`, `parenIndices`, `direction`).

##### 22.2.2.7.1 CharacterSetMatcher ( `rer`, `A`, `invert`, `direction` )

The abstract operation CharacterSetMatcher takes arguments `rer` (a [RegExp Record](#sec-regexp-records)), `A` (a [CharSet](#pattern-charset)), `invert` (a Boolean), and `direction` (forward or backward) and returns a [Matcher](#pattern-matcher). It performs the following steps when called:

1.  If `rer`.`[[UnicodeSets]]` is true, then
    1.  [Assert](#assert): `invert` is false.
    2.  [Assert](#assert): Every [CharSetElement](#sec-pattern-notation) of `A` consists of a single character.
2.  Return a new [Matcher](#pattern-matcher) with parameters (`x`, `c`) that captures `rer`, `A`, `invert`, and `direction` and performs the following steps when called:
    1.  [Assert](#assert): `x` is a [MatchState](#pattern-matchstate).
    2.  [Assert](#assert): `c` is a [MatcherContinuation](#pattern-matchercontinuation).
    3.  Let `Input` be `x`.`[[Input]]`.
    4.  Let `e` be `x`.`[[EndIndex]]`.
    5.  If `direction` is forward, let `f` be `e` + 1.
    6.  Else, let `f` be `e` - 1.
    7.  Let `InputLength` be the number of elements in `Input`.
    8.  If `f` \< 0 or `f` \> `InputLength`, return failure.
    9.  Let `index` be [min](#eqn-min)(`e`, `f`).
    10. Let `ch` be the character `Input`\[`index`\].
    11. Let `cc` be [Canonicalize](#sec-runtime-semantics-canonicalize-ch)(`rer`, `ch`).
    12. If there exists a [CharSetElement](#sec-pattern-notation) in `A` containing exactly one character `a` such that [Canonicalize](#sec-runtime-semantics-canonicalize-ch)(`rer`, `a`) is `cc`, let `found` be true. Otherwise, let `found` be false.
    13. If `invert` is false and `found` is false, return failure.
    14. If `invert` is true and `found` is true, return failure.
    15. Let `cap` be `x`.`[[Captures]]`.
    16. Let `y` be the [MatchState](#pattern-matchstate) { `[[Input]]`: `Input`, `[[EndIndex]]`: `f`, `[[Captures]]`: `cap` }.
    17. Return `c`(`y`).

##### 22.2.2.7.2 BackreferenceMatcher ( `rer`, `ns`, `direction` )

The abstract operation BackreferenceMatcher takes arguments `rer` (a [RegExp Record](#sec-regexp-records)), `ns` (a [List](#sec-list-and-record-specification-type) of positive [integers](#integer)), and `direction` (forward or backward) and returns a [Matcher](#pattern-matcher). It performs the following steps when called:

1.  Return a new [Matcher](#pattern-matcher) with parameters (`x`, `c`) that captures `rer`, `ns`, and `direction` and performs the following steps when called:
    1.  [Assert](#assert): `x` is a [MatchState](#pattern-matchstate).
    2.  [Assert](#assert): `c` is a [MatcherContinuation](#pattern-matchercontinuation).
    3.  Let `Input` be `x`.`[[Input]]`.
    4.  Let `cap` be `x`.`[[Captures]]`.
    5.  Let `r` be undefined.
    6.  For each [integer](#integer) `n` of `ns`, do
        1.  If `cap`\[`n`\] is not undefined, then
            1.  [Assert](#assert): `r` is undefined.
            2.  Set `r` to `cap`\[`n`\].
    7.  If `r` is undefined, return `c`(`x`).
    8.  Let `e` be `x`.`[[EndIndex]]`.
    9.  Let `rs` be `r`.`[[StartIndex]]`.
    10. Let `re` be `r`.`[[EndIndex]]`.
    11. Let `len` be `re` - `rs`.
    12. If `direction` is forward, let `f` be `e` + `len`.
    13. Else, let `f` be `e` - `len`.
    14. Let `InputLength` be the number of elements in `Input`.
    15. If `f` \< 0 or `f` \> `InputLength`, return failure.
    16. Let `g` be [min](#eqn-min)(`e`, `f`).
    17. If there exists an [integer](#integer) `i` in the [interval](#interval) from 0 (inclusive) to `len` (exclusive) such that [Canonicalize](#sec-runtime-semantics-canonicalize-ch)(`rer`, `Input`\[`rs` + `i`\]) is not [Canonicalize](#sec-runtime-semantics-canonicalize-ch)(`rer`, `Input`\[`g` + `i`\]), return failure.
    18. Let `y` be the [MatchState](#pattern-matchstate) { `[[Input]]`: `Input`, `[[EndIndex]]`: `f`, `[[Captures]]`: `cap` }.
    19. Return `c`(`y`).

##### 22.2.2.7.3 Canonicalize ( `rer`, `ch` )

The abstract operation Canonicalize takes arguments `rer` (a [RegExp Record](#sec-regexp-records)) and `ch` (a character) and returns a character. It performs the following steps when called:

1.  If [HasEitherUnicodeFlag](#sec-runtime-semantics-haseitherunicodeflag-abstract-operation)(`rer`) is true and `rer`.`[[IgnoreCase]]` is true, then
    1.  If the file [`CaseFolding.txt`](https://unicode.org/Public/UCD/latest/ucd/CaseFolding.txt) of the Unicode Character Database provides a simple or common case folding mapping for `ch`, return the result of applying that mapping to `ch`.
    2.  Return `ch`.
2.  If `rer`.`[[IgnoreCase]]` is false, return `ch`.
3.  [Assert](#assert): `ch` is a UTF-16 code unit.
4.  Let `cp` be the code point whose numeric value is the numeric value of `ch`.
5.  Let `u` be toUppercase(« `cp` »), according to the Unicode Default Case Conversion algorithm.
6.  Let `uStr` be [CodePointsToString](#sec-codepointstostring)(`u`).
7.  If the length of `uStr` ≠ 1, return `ch`.
8.  Let `cu` be `uStr`'s single code unit element.
9.  If the numeric value of `ch` ≥ 128 and the numeric value of `cu` \< 128, return `ch`.
10. Return `cu`.

Note

In case-insignificant matches when [HasEitherUnicodeFlag](#sec-runtime-semantics-haseitherunicodeflag-abstract-operation)(`rer`) is true, all characters are implicitly case-folded using the simple mapping provided by the Unicode Standard immediately before they are compared. The simple mapping always maps to a single code point, so it does not map, for example, `ß` (U+00DF LATIN SMALL LETTER SHARP S) to `ss` or `SS`. It may however map code points outside the Basic Latin block to code points within it—for example, `ſ` (U+017F LATIN SMALL LETTER LONG S) case-folds to `s` (U+0073 LATIN SMALL LETTER S) and `K` (U+212A KELVIN SIGN) case-folds to `k` (U+006B LATIN SMALL LETTER K). Strings containing those code points are matched by regular expressions such as `/[a-z]/ui`.

In case-insignificant matches when [HasEitherUnicodeFlag](#sec-runtime-semantics-haseitherunicodeflag-abstract-operation)(`rer`) is false, the mapping is based on Unicode Default Case Conversion algorithm toUppercase rather than toCasefold, which results in some subtle differences. For example, `Ω` (U+2126 OHM SIGN) is mapped by toUppercase to itself but by toCasefold to `ω` (U+03C9 GREEK SMALL LETTER OMEGA) along with `Ω` (U+03A9 GREEK CAPITAL LETTER OMEGA), so "\u2126" is matched by `/[ω]/ui` and `/[\u03A9]/ui` but not by `/[ω]/i` or `/[\u03A9]/i`. Also, no code point outside the Basic Latin block is mapped to a code point within it, so strings such as "\u017F ſ" and "\u212A K" are not matched by `/[a-z]/i`.

##### 22.2.2.7.4 UpdateModifiers ( `rer`, `add`, `remove` )

The abstract operation UpdateModifiers takes arguments `rer` (a [RegExp Record](#sec-regexp-records)), `add` (a String), and `remove` (a String) and returns a [RegExp Record](#sec-regexp-records). It performs the following steps when called:

1.  [Assert](#assert): `add` and `remove` have no elements in common.
2.  Let `ignoreCase` be `rer`.`[[IgnoreCase]]`.
3.  Let `multiline` be `rer`.`[[Multiline]]`.
4.  Let `dotAll` be `rer`.`[[DotAll]]`.
5.  Let `unicode` be `rer`.`[[Unicode]]`.
6.  Let `unicodeSets` be `rer`.`[[UnicodeSets]]`.
7.  Let `capturingGroupsCount` be `rer`.`[[CapturingGroupsCount]]`.
8.  If `remove` contains "i", set `ignoreCase` to false.
9.  Else if `add` contains "i", set `ignoreCase` to true.
10. If `remove` contains "m", set `multiline` to false.
11. Else if `add` contains "m", set `multiline` to true.
12. If `remove` contains "s", set `dotAll` to false.
13. Else if `add` contains "s", set `dotAll` to true.
14. Return the [RegExp Record](#sec-regexp-records) { `[[IgnoreCase]]`: `ignoreCase`, `[[Multiline]]`: `multiline`, `[[DotAll]]`: `dotAll`, `[[Unicode]]`: `unicode`, `[[UnicodeSets]]`: `unicodeSets`, `[[CapturingGroupsCount]]`: `capturingGroupsCount` }.

#### 22.2.2.8 Runtime Semantics: CompileCharacterClass

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) CompileCharacterClass takes argument `rer` (a [RegExp Record](#sec-regexp-records)) and returns a [Record](#sec-list-and-record-specification-type) with fields `[[CharSet]]` (a [CharSet](#pattern-charset)) and `[[Invert]]` (a Boolean). It is defined piecewise over the following productions:

[CharacterClass](#prod-CharacterClass) :: \[ [ClassContents](#prod-ClassContents) \]

1.  Let `A` be [CompileToCharSet](#sec-compiletocharset) of [ClassContents](#prod-ClassContents) with argument `rer`.
2.  Return the [Record](#sec-list-and-record-specification-type) { `[[CharSet]]`: `A`, `[[Invert]]`: false }.

[CharacterClass](#prod-CharacterClass) :: \[^ [ClassContents](#prod-ClassContents) \]

1.  Let `A` be [CompileToCharSet](#sec-compiletocharset) of [ClassContents](#prod-ClassContents) with argument `rer`.
2.  If `rer`.`[[UnicodeSets]]` is true, then
    1.  Return the [Record](#sec-list-and-record-specification-type) { `[[CharSet]]`: [CharacterComplement](#sec-charactercomplement)(`rer`, `A`), `[[Invert]]`: false }.
3.  Return the [Record](#sec-list-and-record-specification-type) { `[[CharSet]]`: `A`, `[[Invert]]`: true }.

#### 22.2.2.9 Runtime Semantics: CompileToCharSet

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) CompileToCharSet takes argument `rer` (a [RegExp Record](#sec-regexp-records)) and returns a [CharSet](#pattern-charset).

Note 1

This section is amended in [B.1.2.8](#sec-compiletocharset-annexb).

It is defined piecewise over the following productions:

[ClassContents](#prod-ClassContents) :: \[empty\]

1.  Return the empty [CharSet](#pattern-charset).

[NonemptyClassRanges](#prod-NonemptyClassRanges) :: [ClassAtom](#prod-ClassAtom) [NonemptyClassRangesNoDash](#prod-NonemptyClassRangesNoDash)

1.  Let `A` be [CompileToCharSet](#sec-compiletocharset) of [ClassAtom](#prod-ClassAtom) with argument `rer`.
2.  Let `B` be [CompileToCharSet](#sec-compiletocharset) of [NonemptyClassRangesNoDash](#prod-NonemptyClassRangesNoDash) with argument `rer`.
3.  Return the union of [CharSets](#pattern-charset) `A` and `B`.

[NonemptyClassRanges](#prod-NonemptyClassRanges) :: [ClassAtom](#prod-ClassAtom) - [ClassAtom](#prod-ClassAtom) [ClassContents](#prod-ClassContents)

1.  Let `A` be [CompileToCharSet](#sec-compiletocharset) of the first [ClassAtom](#prod-ClassAtom) with argument `rer`.
2.  Let `B` be [CompileToCharSet](#sec-compiletocharset) of the second [ClassAtom](#prod-ClassAtom) with argument `rer`.
3.  Let `C` be [CompileToCharSet](#sec-compiletocharset) of [ClassContents](#prod-ClassContents) with argument `rer`.
4.  Let `D` be [CharacterRange](#sec-runtime-semantics-characterrange-abstract-operation)(`A`, `B`).
5.  Return the union of `D` and `C`.

[NonemptyClassRangesNoDash](#prod-NonemptyClassRangesNoDash) :: [ClassAtomNoDash](#prod-ClassAtomNoDash) [NonemptyClassRangesNoDash](#prod-NonemptyClassRangesNoDash)

1.  Let `A` be [CompileToCharSet](#sec-compiletocharset) of [ClassAtomNoDash](#prod-ClassAtomNoDash) with argument `rer`.
2.  Let `B` be [CompileToCharSet](#sec-compiletocharset) of [NonemptyClassRangesNoDash](#prod-NonemptyClassRangesNoDash) with argument `rer`.
3.  Return the union of [CharSets](#pattern-charset) `A` and `B`.

[NonemptyClassRangesNoDash](#prod-NonemptyClassRangesNoDash) :: [ClassAtomNoDash](#prod-ClassAtomNoDash) - [ClassAtom](#prod-ClassAtom) [ClassContents](#prod-ClassContents)

1.  Let `A` be [CompileToCharSet](#sec-compiletocharset) of [ClassAtomNoDash](#prod-ClassAtomNoDash) with argument `rer`.
2.  Let `B` be [CompileToCharSet](#sec-compiletocharset) of [ClassAtom](#prod-ClassAtom) with argument `rer`.
3.  Let `C` be [CompileToCharSet](#sec-compiletocharset) of [ClassContents](#prod-ClassContents) with argument `rer`.
4.  Let `D` be [CharacterRange](#sec-runtime-semantics-characterrange-abstract-operation)(`A`, `B`).
5.  Return the union of `D` and `C`.

Note 2

[ClassContents](#prod-ClassContents) can expand into a single [ClassAtom](#prod-ClassAtom) and/or ranges of two [ClassAtom](#prod-ClassAtom) separated by dashes. In the latter case the [ClassContents](#prod-ClassContents) includes all characters between the first [ClassAtom](#prod-ClassAtom) and the second [ClassAtom](#prod-ClassAtom), inclusive; an error occurs if either [ClassAtom](#prod-ClassAtom) does not represent a single character (for example, if one is \w) or if the first [ClassAtom](#prod-ClassAtom)'s character value is strictly greater than the second [ClassAtom](#prod-ClassAtom)'s character value.

Note 3

Even if the pattern ignores case, the case of the two ends of a range is significant in determining which characters belong to the range. Thus, for example, the pattern `/[E-F]/i` matches only the letters `E`, `F`, `e`, and `f`, while the pattern `/[E-f]/i` matches all uppercase and lowercase letters in the Unicode Basic Latin block as well as the symbols `[`, `\`, `]`, `^`, `_`, and `` ` ``.

Note 4

A `-` character can be treated literally or it can denote a range. It is treated literally if it is the first or last character of [ClassContents](#prod-ClassContents), the beginning or end limit of a range specification, or immediately follows a range specification.

[ClassAtom](#prod-ClassAtom) :: -

1.  Return the [CharSet](#pattern-charset) containing the single character `-` U+002D (HYPHEN-MINUS).

[ClassAtomNoDash](#prod-ClassAtomNoDash) :: [SourceCharacter](#prod-SourceCharacter) but not one of \\ or \] or -

1.  Return the [CharSet](#pattern-charset) containing the character matched by [SourceCharacter](#prod-SourceCharacter).

[ClassEscape](#prod-ClassEscape) :: b - [CharacterEscape](#prod-CharacterEscape)

1.  Let `cv` be the [CharacterValue](#sec-patterns-static-semantics-character-value) of this [ClassEscape](#prod-ClassEscape).
2.  Let `c` be the character whose character value is `cv`.
3.  Return the [CharSet](#pattern-charset) containing the single character `c`.

Note 5

A [ClassAtom](#prod-ClassAtom) can use any of the escape sequences that are allowed in the rest of the regular expression except for `\b`, `\B`, and backreferences. Inside a [CharacterClass](#prod-CharacterClass), `\b` means the backspace character, while `\B` and backreferences raise errors. Using a backreference inside a [ClassAtom](#prod-ClassAtom) causes an error.

[CharacterClassEscape](#prod-CharacterClassEscape) :: d

1.  Return the ten-element [CharSet](#pattern-charset) containing the characters `0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, and `9`.

[CharacterClassEscape](#prod-CharacterClassEscape) :: D

1.  Let `S` be the [CharSet](#pattern-charset) returned by [CharacterClassEscape](#prod-CharacterClassEscape) :: d .
2.  Return [CharacterComplement](#sec-charactercomplement)(`rer`, `S`).

[CharacterClassEscape](#prod-CharacterClassEscape) :: s

1.  Return the [CharSet](#pattern-charset) containing all characters corresponding to a code point on the right-hand side of the [WhiteSpace](#prod-WhiteSpace) or [LineTerminator](#prod-LineTerminator) productions.

[CharacterClassEscape](#prod-CharacterClassEscape) :: S

1.  Let `S` be the [CharSet](#pattern-charset) returned by [CharacterClassEscape](#prod-CharacterClassEscape) :: s .
2.  Return [CharacterComplement](#sec-charactercomplement)(`rer`, `S`).

[CharacterClassEscape](#prod-CharacterClassEscape) :: w

1.  Return [MaybeSimpleCaseFolding](#sec-maybesimplecasefolding)(`rer`, [WordCharacters](#sec-wordcharacters)(`rer`)).

[CharacterClassEscape](#prod-CharacterClassEscape) :: W

1.  Let `S` be the [CharSet](#pattern-charset) returned by [CharacterClassEscape](#prod-CharacterClassEscape) :: w .
2.  Return [CharacterComplement](#sec-charactercomplement)(`rer`, `S`).

[CharacterClassEscape](#prod-CharacterClassEscape) :: p{ [UnicodePropertyValueExpression](#prod-UnicodePropertyValueExpression) }

1.  Return [CompileToCharSet](#sec-compiletocharset) of [UnicodePropertyValueExpression](#prod-UnicodePropertyValueExpression) with argument `rer`.

[CharacterClassEscape](#prod-CharacterClassEscape) :: P{ [UnicodePropertyValueExpression](#prod-UnicodePropertyValueExpression) }

1.  Let `S` be [CompileToCharSet](#sec-compiletocharset) of [UnicodePropertyValueExpression](#prod-UnicodePropertyValueExpression) with argument `rer`.
2.  [Assert](#assert): `S` contains only single code points.
3.  Return [CharacterComplement](#sec-charactercomplement)(`rer`, `S`).

[UnicodePropertyValueExpression](#prod-UnicodePropertyValueExpression) :: [UnicodePropertyName](#prod-UnicodePropertyName) = [UnicodePropertyValue](#prod-UnicodePropertyValue)

1.  Let `ps` be the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) [UnicodePropertyName](#prod-UnicodePropertyName).
2.  Let `p` be [UnicodeMatchProperty](#sec-runtime-semantics-unicodematchproperty-p)(`rer`, `ps`).
3.  [Assert](#assert): `p` is a Unicode [property name](#property-name) or property alias listed in the “[Property name](#property-name) and aliases” column of [Table 69](#table-nonbinary-unicode-properties).
4.  Let `vs` be the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) [UnicodePropertyValue](#prod-UnicodePropertyValue).
5.  Let `v` be [UnicodeMatchPropertyValue](#sec-runtime-semantics-unicodematchpropertyvalue-p-v)(`p`, `vs`).
6.  Let `A` be the [CharSet](#pattern-charset) containing all Unicode code points whose character database definition includes the property `p` with value `v`.
7.  Return [MaybeSimpleCaseFolding](#sec-maybesimplecasefolding)(`rer`, `A`).

[UnicodePropertyValueExpression](#prod-UnicodePropertyValueExpression) :: [LoneUnicodePropertyNameOrValue](#prod-LoneUnicodePropertyNameOrValue)

1.  Let `s` be the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) [LoneUnicodePropertyNameOrValue](#prod-LoneUnicodePropertyNameOrValue).
2.  If [UnicodeMatchPropertyValue](#sec-runtime-semantics-unicodematchpropertyvalue-p-v)(`General_Category`, `s`) is a Unicode property value or property value alias for the General_Category (gc) property listed in [`PropertyValueAliases.txt`](https://unicode.org/Public/UCD/latest/ucd/PropertyValueAliases.txt), then
    1.  Return the [CharSet](#pattern-charset) containing all Unicode code points whose character database definition includes the property “General_Category” with value `s`.
3.  Let `p` be [UnicodeMatchProperty](#sec-runtime-semantics-unicodematchproperty-p)(`rer`, `s`).
4.  [Assert](#assert): `p` is a binary Unicode property or binary property alias listed in the “Property name and aliases” column of [Table 70](#table-binary-unicode-properties), or a binary Unicode property of strings listed in the “Property name” column of [Table 71](#table-binary-unicode-properties-of-strings).
5.  Let `A` be the [CharSet](#pattern-charset) containing all CharSetElements whose character database definition includes the property `p` with value “True”.
6.  Return [MaybeSimpleCaseFolding](#sec-maybesimplecasefolding)(`rer`, `A`).

[ClassUnion](#prod-ClassUnion) :: [ClassSetRange](#prod-ClassSetRange) [ClassUnion](#prod-ClassUnion)opt

1.  Let `A` be [CompileToCharSet](#sec-compiletocharset) of [ClassSetRange](#prod-ClassSetRange) with argument `rer`.
2.  If [ClassUnion](#prod-ClassUnion) is present, then
    1.  Let `B` be [CompileToCharSet](#sec-compiletocharset) of [ClassUnion](#prod-ClassUnion) with argument `rer`.
    2.  Return the union of [CharSets](#pattern-charset) `A` and `B`.
3.  Return `A`.

[ClassUnion](#prod-ClassUnion) :: [ClassSetOperand](#prod-ClassSetOperand) [ClassUnion](#prod-ClassUnion)opt

1.  Let `A` be [CompileToCharSet](#sec-compiletocharset) of [ClassSetOperand](#prod-ClassSetOperand) with argument `rer`.
2.  If [ClassUnion](#prod-ClassUnion) is present, then
    1.  Let `B` be [CompileToCharSet](#sec-compiletocharset) of [ClassUnion](#prod-ClassUnion) with argument `rer`.
    2.  Return the union of [CharSets](#pattern-charset) `A` and `B`.
3.  Return `A`.

[ClassIntersection](#prod-ClassIntersection) :: [ClassSetOperand](#prod-ClassSetOperand) && [ClassSetOperand](#prod-ClassSetOperand)

1.  Let `A` be [CompileToCharSet](#sec-compiletocharset) of the first [ClassSetOperand](#prod-ClassSetOperand) with argument `rer`.
2.  Let `B` be [CompileToCharSet](#sec-compiletocharset) of the second [ClassSetOperand](#prod-ClassSetOperand) with argument `rer`.
3.  Return the intersection of [CharSets](#pattern-charset) `A` and `B`.

[ClassIntersection](#prod-ClassIntersection) :: [ClassIntersection](#prod-ClassIntersection) && [ClassSetOperand](#prod-ClassSetOperand)

1.  Let `A` be [CompileToCharSet](#sec-compiletocharset) of the [ClassIntersection](#prod-ClassIntersection) with argument `rer`.
2.  Let `B` be [CompileToCharSet](#sec-compiletocharset) of the [ClassSetOperand](#prod-ClassSetOperand) with argument `rer`.
3.  Return the intersection of [CharSets](#pattern-charset) `A` and `B`.

[ClassSubtraction](#prod-ClassSubtraction) :: [ClassSetOperand](#prod-ClassSetOperand) -- [ClassSetOperand](#prod-ClassSetOperand)

1.  Let `A` be [CompileToCharSet](#sec-compiletocharset) of the first [ClassSetOperand](#prod-ClassSetOperand) with argument `rer`.
2.  Let `B` be [CompileToCharSet](#sec-compiletocharset) of the second [ClassSetOperand](#prod-ClassSetOperand) with argument `rer`.
3.  Return the [CharSet](#pattern-charset) containing the CharSetElements of `A` which are not also CharSetElements of `B`.

[ClassSubtraction](#prod-ClassSubtraction) :: [ClassSubtraction](#prod-ClassSubtraction) -- [ClassSetOperand](#prod-ClassSetOperand)

1.  Let `A` be [CompileToCharSet](#sec-compiletocharset) of the [ClassSubtraction](#prod-ClassSubtraction) with argument `rer`.
2.  Let `B` be [CompileToCharSet](#sec-compiletocharset) of the [ClassSetOperand](#prod-ClassSetOperand) with argument `rer`.
3.  Return the [CharSet](#pattern-charset) containing the CharSetElements of `A` which are not also CharSetElements of `B`.

[ClassSetRange](#prod-ClassSetRange) :: [ClassSetCharacter](#prod-ClassSetCharacter) - [ClassSetCharacter](#prod-ClassSetCharacter)

1.  Let `A` be [CompileToCharSet](#sec-compiletocharset) of the first [ClassSetCharacter](#prod-ClassSetCharacter) with argument `rer`.
2.  Let `B` be [CompileToCharSet](#sec-compiletocharset) of the second [ClassSetCharacter](#prod-ClassSetCharacter) with argument `rer`.
3.  Return [MaybeSimpleCaseFolding](#sec-maybesimplecasefolding)(`rer`, [CharacterRange](#sec-runtime-semantics-characterrange-abstract-operation)(`A`, `B`)).

Note 6

The result will often consist of two or more ranges. When UnicodeSets is true and IgnoreCase is true, then [MaybeSimpleCaseFolding](#sec-maybesimplecasefolding)(`rer`, \[Ā-č\]) will include only the odd-numbered code points of that range.

[ClassSetOperand](#prod-ClassSetOperand) :: [ClassSetCharacter](#prod-ClassSetCharacter)

1.  Let `A` be [CompileToCharSet](#sec-compiletocharset) of [ClassSetCharacter](#prod-ClassSetCharacter) with argument `rer`.
2.  Return [MaybeSimpleCaseFolding](#sec-maybesimplecasefolding)(`rer`, `A`).

[ClassSetOperand](#prod-ClassSetOperand) :: [ClassStringDisjunction](#prod-ClassStringDisjunction)

1.  Let `A` be [CompileToCharSet](#sec-compiletocharset) of [ClassStringDisjunction](#prod-ClassStringDisjunction) with argument `rer`.
2.  Return [MaybeSimpleCaseFolding](#sec-maybesimplecasefolding)(`rer`, `A`).

[ClassSetOperand](#prod-ClassSetOperand) :: [NestedClass](#prod-NestedClass)

1.  Return [CompileToCharSet](#sec-compiletocharset) of [NestedClass](#prod-NestedClass) with argument `rer`.

[NestedClass](#prod-NestedClass) :: \[ [ClassContents](#prod-ClassContents) \]

1.  Return [CompileToCharSet](#sec-compiletocharset) of [ClassContents](#prod-ClassContents) with argument `rer`.

[NestedClass](#prod-NestedClass) :: \[^ [ClassContents](#prod-ClassContents) \]

1.  Let `A` be [CompileToCharSet](#sec-compiletocharset) of [ClassContents](#prod-ClassContents) with argument `rer`.
2.  Return [CharacterComplement](#sec-charactercomplement)(`rer`, `A`).

[NestedClass](#prod-NestedClass) :: \\ [CharacterClassEscape](#prod-CharacterClassEscape)

1.  Return [CompileToCharSet](#sec-compiletocharset) of [CharacterClassEscape](#prod-CharacterClassEscape) with argument `rer`.

[ClassStringDisjunction](#prod-ClassStringDisjunction) :: \q{ [ClassStringDisjunctionContents](#prod-ClassStringDisjunctionContents) }

1.  Return [CompileToCharSet](#sec-compiletocharset) of [ClassStringDisjunctionContents](#prod-ClassStringDisjunctionContents) with argument `rer`.

[ClassStringDisjunctionContents](#prod-ClassStringDisjunctionContents) :: [ClassString](#prod-ClassString)

1.  Let `s` be [CompileClassSetString](#sec-compileclasssetstring) of [ClassString](#prod-ClassString) with argument `rer`.
2.  Return the [CharSet](#pattern-charset) containing the one string `s`.

[ClassStringDisjunctionContents](#prod-ClassStringDisjunctionContents) :: [ClassString](#prod-ClassString) \| [ClassStringDisjunctionContents](#prod-ClassStringDisjunctionContents)

1.  Let `s` be [CompileClassSetString](#sec-compileclasssetstring) of [ClassString](#prod-ClassString) with argument `rer`.
2.  Let `A` be the [CharSet](#pattern-charset) containing the one string `s`.
3.  Let `B` be [CompileToCharSet](#sec-compiletocharset) of [ClassStringDisjunctionContents](#prod-ClassStringDisjunctionContents) with argument `rer`.
4.  Return the union of [CharSets](#pattern-charset) `A` and `B`.

[ClassSetCharacter](#prod-ClassSetCharacter) :: [SourceCharacter](#prod-SourceCharacter) but not [ClassSetSyntaxCharacter](#prod-ClassSetSyntaxCharacter) \\ [CharacterEscape](#prod-CharacterEscape) \\ [ClassSetReservedPunctuator](#prod-ClassSetReservedPunctuator)

1.  Let `cv` be the [CharacterValue](#sec-patterns-static-semantics-character-value) of this [ClassSetCharacter](#prod-ClassSetCharacter).
2.  Let `c` be the character whose character value is `cv`.
3.  Return the [CharSet](#pattern-charset) containing the single character `c`.

[ClassSetCharacter](#prod-ClassSetCharacter) :: \b

1.  Return the [CharSet](#pattern-charset) containing the single character U+0008 (BACKSPACE).

##### 22.2.2.9.1 CharacterRange ( `A`, `B` )

The abstract operation CharacterRange takes arguments `A` (a [CharSet](#pattern-charset)) and `B` (a [CharSet](#pattern-charset)) and returns a [CharSet](#pattern-charset). It performs the following steps when called:

1.  [Assert](#assert): `A` and `B` each contain exactly one character.
2.  Let `a` be the one character in [CharSet](#pattern-charset) `A`.
3.  Let `b` be the one character in [CharSet](#pattern-charset) `B`.
4.  Let `i` be the character value of character `a`.
5.  Let `j` be the character value of character `b`.
6.  [Assert](#assert): `i` ≤ `j`.
7.  Return the [CharSet](#pattern-charset) containing all characters with a character value in the [inclusive interval](#inclusive-interval) from `i` to `j`.

##### 22.2.2.9.2 HasEitherUnicodeFlag ( `rer` )

The abstract operation HasEitherUnicodeFlag takes argument `rer` (a [RegExp Record](#sec-regexp-records)) and returns a Boolean. It performs the following steps when called:

1.  If `rer`.`[[Unicode]]` is true or `rer`.`[[UnicodeSets]]` is true, then
    1.  Return true.
2.  Return false.

##### 22.2.2.9.3 WordCharacters ( `rer` )

The abstract operation WordCharacters takes argument `rer` (a [RegExp Record](#sec-regexp-records)) and returns a [CharSet](#pattern-charset). Returns a [CharSet](#pattern-charset) containing the characters considered "word characters" for the purposes of `\b`, `\B`, `\w`, and `\W` It performs the following steps when called:

1.  Let `basicWordChars` be the [CharSet](#pattern-charset) containing every character in [the ASCII word characters](#ASCII-word-characters).
2.  Let `extraWordChars` be the [CharSet](#pattern-charset) containing all characters `c` such that `c` is not in `basicWordChars` but [Canonicalize](#sec-runtime-semantics-canonicalize-ch)(`rer`, `c`) is in `basicWordChars`.
3.  [Assert](#assert): `extraWordChars` is empty unless [HasEitherUnicodeFlag](#sec-runtime-semantics-haseitherunicodeflag-abstract-operation)(`rer`) is true and `rer`.`[[IgnoreCase]]` is true.
4.  Return the union of `basicWordChars` and `extraWordChars`.

##### 22.2.2.9.4 AllCharacters ( `rer` )

The abstract operation AllCharacters takes argument `rer` (a [RegExp Record](#sec-regexp-records)) and returns a [CharSet](#pattern-charset). Returns the set of “all characters” according to the regular expression flags. It performs the following steps when called:

1.  If `rer`.`[[UnicodeSets]]` is true and `rer`.`[[IgnoreCase]]` is true, then
    1.  Return the [CharSet](#pattern-charset) containing all Unicode code points `c` that do not have a [Simple Case Folding](https://www.unicode.org/reports/tr44/#Simple_Case_Folding) mapping (that is, [scf](#eqn-scf)(`c`)=`c`).
2.  Else if [HasEitherUnicodeFlag](#sec-runtime-semantics-haseitherunicodeflag-abstract-operation)(`rer`) is true, then
    1.  Return the [CharSet](#pattern-charset) containing all code point values.
3.  Else,
    1.  Return the [CharSet](#pattern-charset) containing all code unit values.

##### 22.2.2.9.5 MaybeSimpleCaseFolding ( `rer`, `A` )

The abstract operation MaybeSimpleCaseFolding takes arguments `rer` (a [RegExp Record](#sec-regexp-records)) and `A` (a [CharSet](#pattern-charset)) and returns a [CharSet](#pattern-charset). If `rer`.`[[UnicodeSets]]` is false or `rer`.`[[IgnoreCase]]` is false, it returns `A`. Otherwise, it uses the [Simple Case Folding](https://www.unicode.org/reports/tr44/#Simple_Case_Folding) (scf(`cp`)) definitions in the file [`CaseFolding.txt`](https://unicode.org/Public/UCD/latest/ucd/CaseFolding.txt) of the Unicode Character Database (each of which maps a single code point to another single code point) to map each [CharSetElement](#sec-pattern-notation) of `A` character-by-character into a canonical form and returns the resulting [CharSet](#pattern-charset). It performs the following steps when called:

1.  If `rer`.`[[UnicodeSets]]` is false or `rer`.`[[IgnoreCase]]` is false, return `A`.
2.  Let `B` be a new empty [CharSet](#pattern-charset).
3.  For each [CharSetElement](#sec-pattern-notation) `s` of `A`, do
    1.  Let `t` be an empty sequence of characters.
    2.  For each single code point `cp` in `s`, do
        1.  Append [scf](#eqn-scf)(`cp`) to `t`.
    3.  Add `t` to `B`.
4.  Return `B`.

##### 22.2.2.9.6 CharacterComplement ( `rer`, `S` )

The abstract operation CharacterComplement takes arguments `rer` (a [RegExp Record](#sec-regexp-records)) and `S` (a [CharSet](#pattern-charset)) and returns a [CharSet](#pattern-charset). It performs the following steps when called:

1.  Let `A` be [AllCharacters](#sec-allcharacters)(`rer`).
2.  Return the [CharSet](#pattern-charset) containing the CharSetElements of `A` which are not also CharSetElements of `S`.

##### 22.2.2.9.7 UnicodeMatchProperty ( `rer`, `p` )

The abstract operation UnicodeMatchProperty takes arguments `rer` (a [RegExp Record](#sec-regexp-records)) and `p` ([ECMAScript source text](#sec-source-text)) and returns a Unicode [property name](#property-name). It performs the following steps when called:

1.  If `rer`.`[[UnicodeSets]]` is true and `p` is a Unicode property name listed in the “Property name” column of [Table 71](#table-binary-unicode-properties-of-strings), then
    1.  Return the [List](#sec-list-and-record-specification-type) of Unicode code points `p`.
2.  [Assert](#assert): `p` is a Unicode property name or property alias listed in the “Property name and aliases” column of [Table 69](#table-nonbinary-unicode-properties) or [Table 70](#table-binary-unicode-properties).
3.  Let `c` be the canonical property name of `p` as given in the “Canonical property name” column of the corresponding row.
4.  Return the [List](#sec-list-and-record-specification-type) of Unicode code points `c`.

Implementations must support the Unicode property names and aliases listed in [Table 69](#table-nonbinary-unicode-properties), [Table 70](#table-binary-unicode-properties), and [Table 71](#table-binary-unicode-properties-of-strings). To ensure interoperability, implementations must not support any other property names or aliases.

Note 1

For example, `Script_Extensions` ([property name](#property-name)) and `scx` (property alias) are valid, but `script_extensions` or `Scx` aren't.

Note 2

The listed properties form a superset of what [UTS18 RL1.2](https://unicode.org/reports/tr18/#RL1.2) requires.

Note 3

The spellings of entries in these tables (including casing) match the spellings used in the file [`PropertyAliases.txt`](https://unicode.org/Public/UCD/latest/ucd/PropertyAliases.txt) in the Unicode Character Database. The precise spellings in that file are [guaranteed to be stable](https://www.unicode.org/policies/stability_policy.html#Alias_Stability).

[TABLE]

Table 69: Non-binary Unicode property aliases and their canonical property names

[TABLE]

Table 70: Binary Unicode property aliases and their canonical property names

| [Property name](#property-name) |
|---------------------------------|
| `Basic_Emoji`                   |
| `Emoji_Keycap_Sequence`         |
| `RGI_Emoji_Modifier_Sequence`   |
| `RGI_Emoji_Flag_Sequence`       |
| `RGI_Emoji_Tag_Sequence`        |
| `RGI_Emoji_ZWJ_Sequence`        |
| `RGI_Emoji`                     |

Table 71: Binary Unicode properties of strings

##### 22.2.2.9.8 UnicodeMatchPropertyValue ( `p`, `v` )

The abstract operation UnicodeMatchPropertyValue takes arguments `p` ([ECMAScript source text](#sec-source-text)) and `v` ([ECMAScript source text](#sec-source-text)) and returns a Unicode property value. It performs the following steps when called:

1.  [Assert](#assert): `p` is a canonical, unaliased Unicode [property name](#property-name) listed in the “Canonical [property name](#property-name)” column of [Table 69](#table-nonbinary-unicode-properties).
2.  [Assert](#assert): `v` is a property value or property value alias for the Unicode property `p` listed in [`PropertyValueAliases.txt`](https://unicode.org/Public/UCD/latest/ucd/PropertyValueAliases.txt).
3.  Let `value` be the canonical property value of `v` as given in the “Canonical property value” column of the corresponding row.
4.  Return the [List](#sec-list-and-record-specification-type) of Unicode code points `value`.

Implementations must support the Unicode property values and property value aliases listed in [`PropertyValueAliases.txt`](https://unicode.org/Public/UCD/latest/ucd/PropertyValueAliases.txt) for the properties listed in [Table 69](#table-nonbinary-unicode-properties). To ensure interoperability, implementations must not support any other property values or property value aliases.

Note 1

For example, `Xpeo` and `Old_Persian` are valid `Script_Extensions` values, but `xpeo` and `Old Persian` aren't.

Note 2

This algorithm differs from [the matching rules for symbolic values listed in UAX44](https://unicode.org/reports/tr44/#Matching_Symbolic): case, [white space](#sec-white-space), U+002D (HYPHEN-MINUS), and U+005F (LOW LINE) are not ignored, and the `Is` prefix is not supported.

#### 22.2.2.10 Runtime Semantics: CompileClassSetString

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) CompileClassSetString takes argument `rer` (a [RegExp Record](#sec-regexp-records)) and returns a sequence of characters. It is defined piecewise over the following productions:

[ClassString](#prod-ClassString) :: \[empty\]

1.  Return an empty sequence of characters.

[ClassString](#prod-ClassString) :: [NonEmptyClassString](#prod-NonEmptyClassString)

1.  Return [CompileClassSetString](#sec-compileclasssetstring) of [NonEmptyClassString](#prod-NonEmptyClassString) with argument `rer`.

[NonEmptyClassString](#prod-NonEmptyClassString) :: [ClassSetCharacter](#prod-ClassSetCharacter) [NonEmptyClassString](#prod-NonEmptyClassString)opt

1.  Let `cs` be [CompileToCharSet](#sec-compiletocharset) of [ClassSetCharacter](#prod-ClassSetCharacter) with argument `rer`.
2.  Let `s1` be the sequence of characters that is the single [CharSetElement](#sec-pattern-notation) of `cs`.
3.  If [NonEmptyClassString](#prod-NonEmptyClassString) is present, then
    1.  Let `s2` be [CompileClassSetString](#sec-compileclasssetstring) of [NonEmptyClassString](#prod-NonEmptyClassString) with argument `rer`.
    2.  Return the concatenation of `s1` and `s2`.
4.  Return `s1`.

### 22.2.3 Abstract Operations for RegExp Creation

#### 22.2.3.1 RegExpCreate ( `P`, `F` )

The abstract operation RegExpCreate takes arguments `P` (an [ECMAScript language value](#sec-ecmascript-language-types)) and `F` (a String or undefined) and returns either a [normal completion containing](#sec-completion-record-specification-type) an Object or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `obj` be ! [RegExpAlloc](#sec-regexpalloc)([%RegExp%](#sec-regexp-constructor)).
2.  Return ? [RegExpInitialize](#sec-regexpinitialize)(`obj`, `P`, `F`).

#### 22.2.3.2 RegExpAlloc ( `newTarget` )

The abstract operation RegExpAlloc takes argument `newTarget` (a [constructor](#constructor)) and returns either a [normal completion containing](#sec-completion-record-specification-type) an Object or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `obj` be ? [OrdinaryCreateFromConstructor](#sec-ordinarycreatefromconstructor)(`newTarget`, "%RegExp.prototype%", « `[[OriginalSource]]`, `[[OriginalFlags]]`, `[[RegExpRecord]]`, `[[RegExpMatcher]]` »).
2.  Perform ! [DefinePropertyOrThrow](#sec-definepropertyorthrow)(`obj`, "lastIndex", PropertyDescriptor { `[[Writable]]`: true, `[[Enumerable]]`: false, `[[Configurable]]`: false }).
3.  Return `obj`.

#### 22.2.3.3 RegExpInitialize ( `obj`, `pattern`, `flags` )

The abstract operation RegExpInitialize takes arguments `obj` (an Object), `pattern` (an [ECMAScript language value](#sec-ecmascript-language-types)), and `flags` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) an Object or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  If `pattern` is undefined, let `P` be the empty String.
2.  Else, let `P` be ? [ToString](#sec-tostring)(`pattern`).
3.  If `flags` is undefined, let `F` be the empty String.
4.  Else, let `F` be ? [ToString](#sec-tostring)(`flags`).
5.  If `F` contains any code unit other than "d", "g", "i", "m", "s", "u", "v", or "y", or if `F` contains any code unit more than once, throw a SyntaxError exception.
6.  If `F` contains "i", let `i` be true; else let `i` be false.
7.  If `F` contains "m", let `m` be true; else let `m` be false.
8.  If `F` contains "s", let `s` be true; else let `s` be false.
9.  If `F` contains "u", let `u` be true; else let `u` be false.
10. If `F` contains "v", let `v` be true; else let `v` be false.
11. If `u` is true or `v` is true, then
    1.  Let `patternText` be [StringToCodePoints](#sec-stringtocodepoints)(`P`).
12. Else,
    1.  Let `patternText` be the result of interpreting each of `P`'s 16-bit elements as a Unicode BMP code point. UTF-16 decoding is not applied to the elements.
13. Let `parseResult` be [ParsePattern](#sec-parsepattern)(`patternText`, `u`, `v`).
14. If `parseResult` is a non-empty [List](#sec-list-and-record-specification-type) of SyntaxError objects, throw a SyntaxError exception.
15. [Assert](#assert): `parseResult` is a [Pattern](#prod-Pattern) [Parse Node](#sec-syntactic-grammar).
16. Set `obj`.`[[OriginalSource]]` to `P`.
17. Set `obj`.`[[OriginalFlags]]` to `F`.
18. Let `capturingGroupsCount` be [CountLeftCapturingParensWithin](#sec-countleftcapturingparenswithin)(`parseResult`).
19. Let `rer` be the [RegExp Record](#sec-regexp-records) { `[[IgnoreCase]]`: `i`, `[[Multiline]]`: `m`, `[[DotAll]]`: `s`, `[[Unicode]]`: `u`, `[[UnicodeSets]]`: `v`, `[[CapturingGroupsCount]]`: `capturingGroupsCount` }.
20. Set `obj`.`[[RegExpRecord]]` to `rer`.
21. Set `obj`.`[[RegExpMatcher]]` to [CompilePattern](#sec-compilepattern) of `parseResult` with argument `rer`.
22. Perform ? [Set](#sec-set-o-p-v-throw)(`obj`, "lastIndex", +0_(𝔽), true).
23. Return `obj`.

#### 22.2.3.4 Static Semantics: ParsePattern ( `patternText`, `u`, `v` )

The abstract operation ParsePattern takes arguments `patternText` (a sequence of Unicode code points), `u` (a Boolean), and `v` (a Boolean) and returns a [Parse Node](#sec-syntactic-grammar) or a non-empty [List](#sec-list-and-record-specification-type) of SyntaxError objects.

Note

This section is amended in [B.1.2.9](#sec-parsepattern-annexb).

It performs the following steps when called:

1.  If `v` is true and `u` is true, then
    1.  Let `parseResult` be a [List](#sec-list-and-record-specification-type) containing one or more SyntaxError objects.
2.  Else if `v` is true, then
    1.  Let `parseResult` be [ParseText](#sec-parsetext)(`patternText`, [Pattern](#prod-Pattern)\[+UnicodeMode, +UnicodeSetsMode, +NamedCaptureGroups\]).
3.  Else if `u` is true, then
    1.  Let `parseResult` be [ParseText](#sec-parsetext)(`patternText`, [Pattern](#prod-Pattern)\[+UnicodeMode, ~UnicodeSetsMode, +NamedCaptureGroups\]).
4.  Else,
    1.  Let `parseResult` be [ParseText](#sec-parsetext)(`patternText`, [Pattern](#prod-Pattern)\[~UnicodeMode, ~UnicodeSetsMode, +NamedCaptureGroups\]).
5.  Return `parseResult`.

### 22.2.4 The RegExp Constructor

The RegExp [constructor](#constructor):

- is %RegExp%.
- is the initial value of the "RegExp" property of the [global object](#sec-global-object).
- creates and initializes a new RegExp object when called as a [constructor](#constructor).
- when called as a function rather than as a [constructor](#constructor), returns either a new RegExp object, or the argument itself if the only argument is a RegExp object.
- may be used as the value of an `extends` clause of a class definition. Subclass [constructors](#constructor) that intend to inherit the specified RegExp behaviour must include a `super` call to the RegExp [constructor](#constructor) to create and initialize subclass instances with the necessary internal slots.

#### 22.2.4.1 RegExp ( `pattern`, `flags` )

This function performs the following steps when called:

1.  Let `patternIsRegExp` be ? [IsRegExp](#sec-isregexp)(`pattern`).
2.  If NewTarget is undefined, then
    1.  Let `newTarget` be the [active function object](#active-function-object).
    2.  If `patternIsRegExp` is true and `flags` is undefined, then
        1.  Let `patternConstructor` be ? [Get](#sec-get-o-p)(`pattern`, "constructor").
        2.  If [SameValue](#sec-samevalue)(`newTarget`, `patternConstructor`) is true, return `pattern`.
3.  Else,
    1.  Let `newTarget` be NewTarget.
4.  If `pattern` [is an Object](#sec-object-type) and `pattern` has a `[[RegExpMatcher]]` internal slot, then
    1.  Let `P` be `pattern`.`[[OriginalSource]]`.
    2.  If `flags` is undefined, let `F` be `pattern`.`[[OriginalFlags]]`.
    3.  Else, let `F` be `flags`.
5.  Else if `patternIsRegExp` is true, then
    1.  Let `P` be ? [Get](#sec-get-o-p)(`pattern`, "source").
    2.  If `flags` is undefined, then
        1.  Let `F` be ? [Get](#sec-get-o-p)(`pattern`, "flags").
    3.  Else,
        1.  Let `F` be `flags`.
6.  Else,
    1.  Let `P` be `pattern`.
    2.  Let `F` be `flags`.
7.  Let `O` be ? [RegExpAlloc](#sec-regexpalloc)(`newTarget`).
8.  Return ? [RegExpInitialize](#sec-regexpinitialize)(`O`, `P`, `F`).

Note

If pattern is supplied using a [StringLiteral](#prod-StringLiteral), the usual escape sequence substitutions are performed before the String is processed by this function. If pattern must contain an escape sequence to be recognized by this function, any U+005C (REVERSE SOLIDUS) code points must be escaped within the [StringLiteral](#prod-StringLiteral) to prevent them being removed when the contents of the [StringLiteral](#prod-StringLiteral) are formed.

### 22.2.5 Properties of the RegExp Constructor

The RegExp [constructor](#constructor):

- has a `[[Prototype]]` internal slot whose value is [%Function.prototype%](#sec-properties-of-the-function-prototype-object).
- has the following properties:

#### 22.2.5.1 RegExp.escape ( `S` )

This function returns a copy of `S` in which characters that are potentially special in a regular expression [Pattern](#prod-Pattern) have been replaced by equivalent escape sequences.

It performs the following steps when called:

1.  If `S` [is not a String](#sec-ecmascript-language-types-string-type), throw a TypeError exception.
2.  Let `escaped` be the empty String.
3.  Let `cpList` be [StringToCodePoints](#sec-stringtocodepoints)(`S`).
4.  For each code point `cp` of `cpList`, do
    1.  If `escaped` is the empty String and `cp` is matched by either [DecimalDigit](#prod-DecimalDigit) or [AsciiLetter](#prod-AsciiLetter), then
        1.  NOTE: Escaping a leading digit ensures that output corresponds with pattern text which may be used after a `\0` character escape or a [DecimalEscape](#prod-DecimalEscape) such as `\1` and still match `S` rather than be interpreted as an extension of the preceding escape sequence. Escaping a leading ASCII letter does the same for the context after `\c`.
        2.  Let `numericValue` be the numeric value of `cp`.
        3.  Let `hex` be [Number::toString](#sec-numeric-types-number-tostring)([𝔽](#𝔽)(`numericValue`), 16).
        4.  [Assert](#assert): The length of `hex` is 2.
        5.  Set `escaped` to the [string-concatenation](#string-concatenation) of the code unit 0x005C (REVERSE SOLIDUS), "x", and `hex`.
    2.  Else,
        1.  Set `escaped` to the [string-concatenation](#string-concatenation) of `escaped` and [EncodeForRegExpEscape](#sec-encodeforregexpescape)(`cp`).
5.  Return `escaped`.

Note

Despite having similar names, [EscapeRegExpPattern](#sec-escaperegexppattern) and `RegExp.escape` do not perform similar actions. The former escapes a pattern for representation as a string, while this function escapes a string for representation inside a pattern.

##### 22.2.5.1.1 EncodeForRegExpEscape ( `cp` )

The abstract operation EncodeForRegExpEscape takes argument `cp` (a code point) and returns a String. It returns a String representing a [Pattern](#prod-Pattern) for matching `cp`. If `cp` is white space or an ASCII punctuator, the returned value is an escape sequence. Otherwise, the returned value [is a String](#sec-ecmascript-language-types-string-type) representation of `cp` itself. It performs the following steps when called:

1.  If `cp` is matched by [SyntaxCharacter](#prod-SyntaxCharacter) or `cp` is U+002F (SOLIDUS), then
    1.  Return the [string-concatenation](#string-concatenation) of 0x005C (REVERSE SOLIDUS) and [UTF16EncodeCodePoint](#sec-utf16encodecodepoint)(`cp`).
2.  Else if `cp` is a code point listed in the “Code Point” column of [Table 67](#table-controlescape-code-point-values), then
    1.  Return the [string-concatenation](#string-concatenation) of 0x005C (REVERSE SOLIDUS) and the string in the “ControlEscape” column of the row whose “Code Point” column contains `cp`.
3.  Let `otherPunctuators` be the [string-concatenation](#string-concatenation) of ",-=\<\>#&!%:;@~'\`" and the code unit 0x0022 (QUOTATION MARK).
4.  Let `toEscape` be [StringToCodePoints](#sec-stringtocodepoints)(`otherPunctuators`).
5.  If `toEscape` contains `cp`, `cp` is matched by either [WhiteSpace](#prod-WhiteSpace) or [LineTerminator](#prod-LineTerminator), or `cp` has the same numeric value as a [leading surrogate](#leading-surrogate) or [trailing surrogate](#trailing-surrogate), then
    1.  Let `cpNum` be the numeric value of `cp`.
    2.  If `cpNum` ≤ 0xFF, then
        1.  Let `hex` be [Number::toString](#sec-numeric-types-number-tostring)([𝔽](#𝔽)(`cpNum`), 16).
        2.  Return the [string-concatenation](#string-concatenation) of the code unit 0x005C (REVERSE SOLIDUS), "x", and [StringPad](#sec-stringpad)(`hex`, 2, "0", start).
    3.  Let `escaped` be the empty String.
    4.  Let `codeUnits` be [UTF16EncodeCodePoint](#sec-utf16encodecodepoint)(`cp`).
    5.  For each code unit `cu` of `codeUnits`, do
        1.  Set `escaped` to the [string-concatenation](#string-concatenation) of `escaped` and [UnicodeEscape](#sec-unicodeescape)(`cu`).
    6.  Return `escaped`.
6.  Return [UTF16EncodeCodePoint](#sec-utf16encodecodepoint)(`cp`).

#### 22.2.5.2 RegExp.prototype

The initial value of `RegExp.prototype` is the [RegExp prototype object](#sec-properties-of-the-regexp-prototype-object).

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

#### 22.2.5.3 get RegExp \[ %Symbol.species% \]

`RegExp[%Symbol.species%]` is an [accessor property](#sec-object-type) whose set accessor function is undefined. Its get accessor function performs the following steps when called:

1.  Return the this value.

The value of the "name" property of this function is "get \[Symbol.species\]".

Note

RegExp prototype methods normally use their this value's [constructor](#constructor) to create a derived object. However, a subclass [constructor](#constructor) may over-ride that default behaviour by redefining its [%Symbol.species%](#sec-well-known-symbols) property.

### 22.2.6 Properties of the RegExp Prototype Object

The RegExp prototype object:

- is %RegExp.prototype%.
- is an [ordinary object](#ordinary-object).
- is not a RegExp instance and does not have a `[[RegExpMatcher]]` internal slot or any of the other internal slots of RegExp instance objects.
- has a `[[Prototype]]` internal slot whose value is [%Object.prototype%](#sec-properties-of-the-object-prototype-object).

Note

The RegExp prototype object does not have a "valueOf" property of its own; however, it inherits the "valueOf" property from the [Object prototype object](#sec-properties-of-the-object-prototype-object).

#### 22.2.6.1 RegExp.prototype.constructor

The initial value of `RegExp.prototype.constructor` is [%RegExp%](#sec-regexp-constructor).

#### 22.2.6.2 RegExp.prototype.exec ( `string` )

This method searches `string` for an occurrence of the regular expression pattern and returns an Array containing the results of the match, or null if `string` did not match.

It performs the following steps when called:

1.  Let `R` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`R`, `[[RegExpMatcher]]`).
3.  Let `S` be ? [ToString](#sec-tostring)(`string`).
4.  Return ? [RegExpBuiltinExec](#sec-regexpbuiltinexec)(`R`, `S`).

#### 22.2.6.3 get RegExp.prototype.dotAll

`RegExp.prototype.dotAll` is an [accessor property](#sec-object-type) whose set accessor function is undefined. Its get accessor function performs the following steps when called:

1.  Let `R` be the this value.
2.  Let `cu` be the code unit 0x0073 (LATIN SMALL LETTER S).
3.  Return ? [RegExpHasFlag](#sec-regexphasflag)(`R`, `cu`).

#### 22.2.6.4 get RegExp.prototype.flags

`RegExp.prototype.flags` is an [accessor property](#sec-object-type) whose set accessor function is undefined. Its get accessor function performs the following steps when called:

1.  Let `R` be the this value.
2.  If `R` [is not an Object](#sec-object-type), throw a TypeError exception.
3.  Let `codeUnits` be a new empty [List](#sec-list-and-record-specification-type).
4.  Let `hasIndices` be [ToBoolean](#sec-toboolean)(? [Get](#sec-get-o-p)(`R`, "hasIndices")).
5.  If `hasIndices` is true, append the code unit 0x0064 (LATIN SMALL LETTER D) to `codeUnits`.
6.  Let `global` be [ToBoolean](#sec-toboolean)(? [Get](#sec-get-o-p)(`R`, "global")).
7.  If `global` is true, append the code unit 0x0067 (LATIN SMALL LETTER G) to `codeUnits`.
8.  Let `ignoreCase` be [ToBoolean](#sec-toboolean)(? [Get](#sec-get-o-p)(`R`, "ignoreCase")).
9.  If `ignoreCase` is true, append the code unit 0x0069 (LATIN SMALL LETTER I) to `codeUnits`.
10. Let `multiline` be [ToBoolean](#sec-toboolean)(? [Get](#sec-get-o-p)(`R`, "multiline")).
11. If `multiline` is true, append the code unit 0x006D (LATIN SMALL LETTER M) to `codeUnits`.
12. Let `dotAll` be [ToBoolean](#sec-toboolean)(? [Get](#sec-get-o-p)(`R`, "dotAll")).
13. If `dotAll` is true, append the code unit 0x0073 (LATIN SMALL LETTER S) to `codeUnits`.
14. Let `unicode` be [ToBoolean](#sec-toboolean)(? [Get](#sec-get-o-p)(`R`, "unicode")).
15. If `unicode` is true, append the code unit 0x0075 (LATIN SMALL LETTER U) to `codeUnits`.
16. Let `unicodeSets` be [ToBoolean](#sec-toboolean)(? [Get](#sec-get-o-p)(`R`, "unicodeSets")).
17. If `unicodeSets` is true, append the code unit 0x0076 (LATIN SMALL LETTER V) to `codeUnits`.
18. Let `sticky` be [ToBoolean](#sec-toboolean)(? [Get](#sec-get-o-p)(`R`, "sticky")).
19. If `sticky` is true, append the code unit 0x0079 (LATIN SMALL LETTER Y) to `codeUnits`.
20. Return the String value whose code units are the elements of the [List](#sec-list-and-record-specification-type) `codeUnits`. If `codeUnits` has no elements, the empty String is returned.

##### 22.2.6.4.1 RegExpHasFlag ( `R`, `codeUnit` )

The abstract operation RegExpHasFlag takes arguments `R` (an [ECMAScript language value](#sec-ecmascript-language-types)) and `codeUnit` (a code unit) and returns either a [normal completion containing](#sec-completion-record-specification-type) either a Boolean or undefined, or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  If `R` [is not an Object](#sec-object-type), throw a TypeError exception.
2.  If `R` does not have an `[[OriginalFlags]]` internal slot, then
    1.  If [SameValue](#sec-samevalue)(`R`, [%RegExp.prototype%](#sec-properties-of-the-regexp-prototype-object)) is true, return undefined.
    2.  Otherwise, throw a TypeError exception.
3.  Let `flags` be `R`.`[[OriginalFlags]]`.
4.  If `flags` contains `codeUnit`, return true.
5.  Return false.

#### 22.2.6.5 get RegExp.prototype.global

`RegExp.prototype.global` is an [accessor property](#sec-object-type) whose set accessor function is undefined. Its get accessor function performs the following steps when called:

1.  Let `R` be the this value.
2.  Let `cu` be the code unit 0x0067 (LATIN SMALL LETTER G).
3.  Return ? [RegExpHasFlag](#sec-regexphasflag)(`R`, `cu`).

#### 22.2.6.6 get RegExp.prototype.hasIndices

`RegExp.prototype.hasIndices` is an [accessor property](#sec-object-type) whose set accessor function is undefined. Its get accessor function performs the following steps when called:

1.  Let `R` be the this value.
2.  Let `cu` be the code unit 0x0064 (LATIN SMALL LETTER D).
3.  Return ? [RegExpHasFlag](#sec-regexphasflag)(`R`, `cu`).

#### 22.2.6.7 get RegExp.prototype.ignoreCase

`RegExp.prototype.ignoreCase` is an [accessor property](#sec-object-type) whose set accessor function is undefined. Its get accessor function performs the following steps when called:

1.  Let `R` be the this value.
2.  Let `cu` be the code unit 0x0069 (LATIN SMALL LETTER I).
3.  Return ? [RegExpHasFlag](#sec-regexphasflag)(`R`, `cu`).

#### 22.2.6.8 RegExp.prototype \[ %Symbol.match% \] ( `string` )

This method performs the following steps when called:

1.  Let `rx` be the this value.
2.  If `rx` [is not an Object](#sec-object-type), throw a TypeError exception.
3.  Let `S` be ? [ToString](#sec-tostring)(`string`).
4.  Let `flags` be ? [ToString](#sec-tostring)(? [Get](#sec-get-o-p)(`rx`, "flags")).
5.  If `flags` does not contain "g", then
    1.  Return ? [RegExpExec](#sec-regexpexec)(`rx`, `S`).
6.  Else,
    1.  If `flags` contains "u" or `flags` contains "v", let `fullUnicode` be true. Otherwise, let `fullUnicode` be false.
    2.  Perform ? [Set](#sec-set-o-p-v-throw)(`rx`, "lastIndex", +0_(𝔽), true).
    3.  Let `A` be ! [ArrayCreate](#sec-arraycreate)(0).
    4.  Let `n` be 0.
    5.  Repeat,
        1.  Let `result` be ? [RegExpExec](#sec-regexpexec)(`rx`, `S`).
        2.  If `result` is null, then
            1.  If `n` = 0, return null.
            2.  Return `A`.
        3.  Else,
            1.  Let `matchStr` be ? [ToString](#sec-tostring)(? [Get](#sec-get-o-p)(`result`, "0")).
            2.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`A`, ! [ToString](#sec-tostring)([𝔽](#𝔽)(`n`)), `matchStr`).
            3.  If `matchStr` is the empty String, then
                1.  Let `thisIndex` be [ℝ](#ℝ)(? [ToLength](#sec-tolength)(? [Get](#sec-get-o-p)(`rx`, "lastIndex"))).
                2.  Let `nextIndex` be [AdvanceStringIndex](#sec-advancestringindex)(`S`, `thisIndex`, `fullUnicode`).
                3.  Perform ? [Set](#sec-set-o-p-v-throw)(`rx`, "lastIndex", [𝔽](#𝔽)(`nextIndex`), true).
            4.  Set `n` to `n` + 1.

The value of the "name" property of this method is "\[Symbol.match\]".

Note

The [%Symbol.match%](#sec-well-known-symbols) property is used by the [IsRegExp](#sec-isregexp) abstract operation to identify objects that have the basic behaviour of regular expressions. The absence of a [%Symbol.match%](#sec-well-known-symbols) property or the existence of such a property whose value does not Boolean coerce to true indicates that the object is not intended to be used as a regular expression object.

#### 22.2.6.9 RegExp.prototype \[ %Symbol.matchAll% \] ( `string` )

This method performs the following steps when called:

1.  Let `R` be the this value.
2.  If `R` [is not an Object](#sec-object-type), throw a TypeError exception.
3.  Let `S` be ? [ToString](#sec-tostring)(`string`).
4.  Let `C` be ? [SpeciesConstructor](#sec-speciesconstructor)(`R`, [%RegExp%](#sec-regexp-constructor)).
5.  Let `flags` be ? [ToString](#sec-tostring)(? [Get](#sec-get-o-p)(`R`, "flags")).
6.  Let `matcher` be ? [Construct](#sec-construct)(`C`, « `R`, `flags` »).
7.  Let `lastIndex` be ? [ToLength](#sec-tolength)(? [Get](#sec-get-o-p)(`R`, "lastIndex")).
8.  Perform ? [Set](#sec-set-o-p-v-throw)(`matcher`, "lastIndex", `lastIndex`, true).
9.  If `flags` contains "g", let `global` be true.
10. Else, let `global` be false.
11. If `flags` contains "u" or `flags` contains "v", let `fullUnicode` be true.
12. Else, let `fullUnicode` be false.
13. Return [CreateRegExpStringIterator](#sec-createregexpstringiterator)(`matcher`, `S`, `global`, `fullUnicode`).

The value of the "name" property of this method is "\[Symbol.matchAll\]".

#### 22.2.6.10 get RegExp.prototype.multiline

`RegExp.prototype.multiline` is an [accessor property](#sec-object-type) whose set accessor function is undefined. Its get accessor function performs the following steps when called:

1.  Let `R` be the this value.
2.  Let `cu` be the code unit 0x006D (LATIN SMALL LETTER M).
3.  Return ? [RegExpHasFlag](#sec-regexphasflag)(`R`, `cu`).

#### 22.2.6.11 RegExp.prototype \[ %Symbol.replace% \] ( `string`, `replaceValue` )

This method performs the following steps when called:

1.  Let `rx` be the this value.
2.  If `rx` [is not an Object](#sec-object-type), throw a TypeError exception.
3.  Let `S` be ? [ToString](#sec-tostring)(`string`).
4.  Let `lengthS` be the length of `S`.
5.  Let `functionalReplace` be [IsCallable](#sec-iscallable)(`replaceValue`).
6.  If `functionalReplace` is false, then
    1.  Set `replaceValue` to ? [ToString](#sec-tostring)(`replaceValue`).
7.  Let `flags` be ? [ToString](#sec-tostring)(? [Get](#sec-get-o-p)(`rx`, "flags")).
8.  If `flags` contains "g", let `global` be true. Otherwise, let `global` be false.
9.  If `global` is true, then
    1.  Perform ? [Set](#sec-set-o-p-v-throw)(`rx`, "lastIndex", +0_(𝔽), true).
10. Let `results` be a new empty [List](#sec-list-and-record-specification-type).
11. Let `done` be false.
12. Repeat, while `done` is false,
    1.  Let `result` be ? [RegExpExec](#sec-regexpexec)(`rx`, `S`).
    2.  If `result` is null, then
        1.  Set `done` to true.
    3.  Else,
        1.  Append `result` to `results`.
        2.  If `global` is false, then
            1.  Set `done` to true.
        3.  Else,
            1.  Let `matchStr` be ? [ToString](#sec-tostring)(? [Get](#sec-get-o-p)(`result`, "0")).
            2.  If `matchStr` is the empty String, then
                1.  Let `thisIndex` be [ℝ](#ℝ)(? [ToLength](#sec-tolength)(? [Get](#sec-get-o-p)(`rx`, "lastIndex"))).
                2.  If `flags` contains "u" or `flags` contains "v", let `fullUnicode` be true. Otherwise, let `fullUnicode` be false.
                3.  Let `nextIndex` be [AdvanceStringIndex](#sec-advancestringindex)(`S`, `thisIndex`, `fullUnicode`).
                4.  Perform ? [Set](#sec-set-o-p-v-throw)(`rx`, "lastIndex", [𝔽](#𝔽)(`nextIndex`), true).
13. Let `accumulatedResult` be the empty String.
14. Let `nextSourcePosition` be 0.
15. For each element `result` of `results`, do
    1.  Let `resultLength` be ? [LengthOfArrayLike](#sec-lengthofarraylike)(`result`).
    2.  Let `nCaptures` be [max](#eqn-max)(`resultLength` - 1, 0).
    3.  Let `matched` be ? [ToString](#sec-tostring)(? [Get](#sec-get-o-p)(`result`, "0")).
    4.  Let `matchLength` be the length of `matched`.
    5.  Let `position` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(? [Get](#sec-get-o-p)(`result`, "index")).
    6.  Set `position` to the result of [clamping](#clamping) `position` between 0 and `lengthS`.
    7.  Let `captures` be a new empty [List](#sec-list-and-record-specification-type).
    8.  Let `n` be 1.
    9.  Repeat, while `n` ≤ `nCaptures`,
        1.  Let `capN` be ? [Get](#sec-get-o-p)(`result`, ! [ToString](#sec-tostring)([𝔽](#𝔽)(`n`))).
        2.  If `capN` is not undefined, then
            1.  Set `capN` to ? [ToString](#sec-tostring)(`capN`).
        3.  Append `capN` to `captures`.
        4.  NOTE: When `n` = 1, the preceding step puts the first element into `captures` (at index 0). More generally, the `n`^(th) capture (the characters captured by the `n`^(th) set of capturing parentheses) is at `captures`\[`n` - 1\].
        5.  Set `n` to `n` + 1.
    10. Let `namedCaptures` be ? [Get](#sec-get-o-p)(`result`, "groups").
    11. If `functionalReplace` is true, then
        1.  Let `replacerArgs` be the [list-concatenation](#list-concatenation) of « `matched` », `captures`, and « [𝔽](#𝔽)(`position`), `S` ».
        2.  If `namedCaptures` is not undefined, then
            1.  Append `namedCaptures` to `replacerArgs`.
        3.  Let `replacementValue` be ? [Call](#sec-call)(`replaceValue`, undefined, `replacerArgs`).
        4.  Let `replacementString` be ? [ToString](#sec-tostring)(`replacementValue`).
    12. Else,
        1.  If `namedCaptures` is not undefined, then
            1.  Set `namedCaptures` to ? [ToObject](#sec-toobject)(`namedCaptures`).
        2.  Let `replacementString` be ? [GetSubstitution](#sec-getsubstitution)(`matched`, `S`, `position`, `captures`, `namedCaptures`, `replaceValue`).
    13. If `position` ≥ `nextSourcePosition`, then
        1.  NOTE: `position` should not normally move backwards. If it does, it is an indication of an ill-behaving RegExp subclass or use of an access triggered side-effect to change the global flag or other characteristics of `rx`. In such cases, the corresponding substitution is ignored.
        2.  Set `accumulatedResult` to the [string-concatenation](#string-concatenation) of `accumulatedResult`, the [substring](#substring) of `S` from `nextSourcePosition` to `position`, and `replacementString`.
        3.  Set `nextSourcePosition` to `position` + `matchLength`.
16. If `nextSourcePosition` ≥ `lengthS`, return `accumulatedResult`.
17. Return the [string-concatenation](#string-concatenation) of `accumulatedResult` and the [substring](#substring) of `S` from `nextSourcePosition`.

The value of the "name" property of this method is "\[Symbol.replace\]".

#### 22.2.6.12 RegExp.prototype \[ %Symbol.search% \] ( `string` )

This method performs the following steps when called:

1.  Let `rx` be the this value.
2.  If `rx` [is not an Object](#sec-object-type), throw a TypeError exception.
3.  Let `S` be ? [ToString](#sec-tostring)(`string`).
4.  Let `previousLastIndex` be ? [Get](#sec-get-o-p)(`rx`, "lastIndex").
5.  If `previousLastIndex` is not +0_(𝔽), then
    1.  Perform ? [Set](#sec-set-o-p-v-throw)(`rx`, "lastIndex", +0_(𝔽), true).
6.  Let `result` be ? [RegExpExec](#sec-regexpexec)(`rx`, `S`).
7.  Let `currentLastIndex` be ? [Get](#sec-get-o-p)(`rx`, "lastIndex").
8.  If [SameValue](#sec-samevalue)(`currentLastIndex`, `previousLastIndex`) is false, then
    1.  Perform ? [Set](#sec-set-o-p-v-throw)(`rx`, "lastIndex", `previousLastIndex`, true).
9.  If `result` is null, return -1_(𝔽).
10. Return ? [Get](#sec-get-o-p)(`result`, "index").

The value of the "name" property of this method is "\[Symbol.search\]".

Note

The "lastIndex" and "global" properties of this RegExp object are ignored when performing the search. The "lastIndex" property is left unchanged.

#### 22.2.6.13 get RegExp.prototype.source

`RegExp.prototype.source` is an [accessor property](#sec-object-type) whose set accessor function is undefined. Its get accessor function performs the following steps when called:

1.  Let `R` be the this value.
2.  If `R` [is not an Object](#sec-object-type), throw a TypeError exception.
3.  If `R` does not have an `[[OriginalSource]]` internal slot, then
    1.  If [SameValue](#sec-samevalue)(`R`, [%RegExp.prototype%](#sec-properties-of-the-regexp-prototype-object)) is true, return "(?:)".
    2.  Otherwise, throw a TypeError exception.
4.  [Assert](#assert): `R` has an `[[OriginalFlags]]` internal slot.
5.  Let `src` be `R`.`[[OriginalSource]]`.
6.  Let `flags` be `R`.`[[OriginalFlags]]`.
7.  Return [EscapeRegExpPattern](#sec-escaperegexppattern)(`src`, `flags`).

##### 22.2.6.13.1 EscapeRegExpPattern ( `P`, `F` )

The abstract operation EscapeRegExpPattern takes arguments `P` (a String) and `F` (a String) and returns a String. It performs the following steps when called:

1.  If `F` contains "v", then
    1.  Let `patternSymbol` be [Pattern](#prod-Pattern)\[+UnicodeMode, +UnicodeSetsMode\].
2.  Else if `F` contains "u", then
    1.  Let `patternSymbol` be [Pattern](#prod-Pattern)\[+UnicodeMode, ~UnicodeSetsMode\].
3.  Else,
    1.  Let `patternSymbol` be [Pattern](#prod-Pattern)\[~UnicodeMode, ~UnicodeSetsMode\].
4.  Let `S` be a String in the form of a `patternSymbol` equivalent to `P` interpreted as UTF-16 encoded Unicode code points ([6.1.4](#sec-ecmascript-language-types-string-type)), in which certain code points are escaped as described below. `S` may or may not differ from `P`; however, the [Abstract Closure](#sec-abstract-closure) that would result from evaluating `S` as a `patternSymbol` must behave identically to the [Abstract Closure](#sec-abstract-closure) given by the constructed object's `[[RegExpMatcher]]` internal slot. Multiple calls to this abstract operation using the same values for `P` and `F` must produce identical results.
5.  The code points `/` or any [LineTerminator](#prod-LineTerminator) occurring in the pattern shall be escaped in `S` as necessary to ensure that the [string-concatenation](#string-concatenation) of "/", `S`, "/", and `F` can be parsed (in an appropriate lexical context) as a [RegularExpressionLiteral](#prod-RegularExpressionLiteral) that behaves identically to the constructed regular expression. For example, if `P` is "/", then `S` could be "\\" or "\u002F", among other possibilities, but not "/", because `///` followed by `F` would be parsed as a [SingleLineComment](#prod-SingleLineComment) rather than a [RegularExpressionLiteral](#prod-RegularExpressionLiteral). If `P` is the empty String, this specification can be met by letting `S` be "(?:)".
6.  Return `S`.

Note

Despite having similar names, `RegExp.escape` and EscapeRegExpPattern do not perform similar actions. The former escapes a string for representation inside a pattern, while this function escapes a pattern for representation as a string.

#### 22.2.6.14 RegExp.prototype \[ %Symbol.split% \] ( `string`, `limit` )

Note 1

This method returns an Array into which substrings of the result of converting `string` to a String have been stored. The substrings are determined by searching from left to right for matches of the this value regular expression; these occurrences are not part of any String in the returned array, but serve to divide up the String value.

The this value may be an empty regular expression or a regular expression that can match an empty String. In this case, the regular expression does not match the empty substring at the beginning or end of the input String, nor does it match the empty substring at the end of the previous separator match. (For example, if the regular expression matches the empty String, the String is split up into individual code unit elements; the length of the result array equals the length of the String, and each substring contains one code unit.) Only the first match at a given index of the String is considered, even if backtracking could yield a non-empty substring match at that index. (For example, `/a*?/[Symbol.split]("ab")` evaluates to the array `["a", "b"]`, while `/a*/[Symbol.split]("ab")` evaluates to the array `["","b"]`.)

If `string` is (or converts to) the empty String, the result depends on whether the regular expression can match the empty String. If it can, the result array contains no elements. Otherwise, the result array contains one element, which is the empty String.

If the regular expression contains capturing parentheses, then each time `separator` is matched the results (including any undefined results) of the capturing parentheses are spliced into the output array. For example,

``` javascript
/<(\/)?([^<>]+)>/[Symbol.split]("A<B>bold</B>and<CODE>coded</CODE>")
```

evaluates to the array

``` javascript
["A", undefined, "B", "bold", "/", "B", "and", undefined, "CODE", "coded", "/", "CODE", ""]
```

If `limit` is not undefined, then the output array is truncated so that it contains no more than `limit` elements.

This method performs the following steps when called:

1.  Let `rx` be the this value.
2.  If `rx` [is not an Object](#sec-object-type), throw a TypeError exception.
3.  Let `S` be ? [ToString](#sec-tostring)(`string`).
4.  Let `C` be ? [SpeciesConstructor](#sec-speciesconstructor)(`rx`, [%RegExp%](#sec-regexp-constructor)).
5.  Let `flags` be ? [ToString](#sec-tostring)(? [Get](#sec-get-o-p)(`rx`, "flags")).
6.  If `flags` contains "u" or `flags` contains "v", let `unicodeMatching` be true.
7.  Else, let `unicodeMatching` be false.
8.  If `flags` contains "y", let `newFlags` be `flags`.
9.  Else, let `newFlags` be the [string-concatenation](#string-concatenation) of `flags` and "y".
10. Let `splitter` be ? [Construct](#sec-construct)(`C`, « `rx`, `newFlags` »).
11. Let `A` be ! [ArrayCreate](#sec-arraycreate)(0).
12. Let `lengthA` be 0.
13. If `limit` is undefined, let `lim` be 2\*\*³² - 1; else let `lim` be [ℝ](#ℝ)(? [ToUint32](#sec-touint32)(`limit`)).
14. If `lim` = 0, return `A`.
15. If `S` is the empty String, then
    1.  Let `z` be ? [RegExpExec](#sec-regexpexec)(`splitter`, `S`).
    2.  If `z` is not null, return `A`.
    3.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`A`, "0", `S`).
    4.  Return `A`.
16. Let `size` be the length of `S`.
17. Let `p` be 0.
18. Let `q` be `p`.
19. Repeat, while `q` \< `size`,
    1.  Perform ? [Set](#sec-set-o-p-v-throw)(`splitter`, "lastIndex", [𝔽](#𝔽)(`q`), true).
    2.  Let `z` be ? [RegExpExec](#sec-regexpexec)(`splitter`, `S`).
    3.  If `z` is null, then
        1.  Set `q` to [AdvanceStringIndex](#sec-advancestringindex)(`S`, `q`, `unicodeMatching`).
    4.  Else,
        1.  Let `e` be [ℝ](#ℝ)(? [ToLength](#sec-tolength)(? [Get](#sec-get-o-p)(`splitter`, "lastIndex"))).
        2.  Set `e` to [min](#eqn-min)(`e`, `size`).
        3.  If `e` = `p`, then
            1.  Set `q` to [AdvanceStringIndex](#sec-advancestringindex)(`S`, `q`, `unicodeMatching`).
        4.  Else,
            1.  Let `T` be the [substring](#substring) of `S` from `p` to `q`.
            2.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`A`, ! [ToString](#sec-tostring)([𝔽](#𝔽)(`lengthA`)), `T`).
            3.  Set `lengthA` to `lengthA` + 1.
            4.  If `lengthA` = `lim`, return `A`.
            5.  Set `p` to `e`.
            6.  Let `numberOfCaptures` be ? [LengthOfArrayLike](#sec-lengthofarraylike)(`z`).
            7.  Set `numberOfCaptures` to [max](#eqn-max)(`numberOfCaptures` - 1, 0).
            8.  Let `i` be 1.
            9.  Repeat, while `i` ≤ `numberOfCaptures`,
                1.  Let `nextCapture` be ? [Get](#sec-get-o-p)(`z`, ! [ToString](#sec-tostring)([𝔽](#𝔽)(`i`))).
                2.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`A`, ! [ToString](#sec-tostring)([𝔽](#𝔽)(`lengthA`)), `nextCapture`).
                3.  Set `i` to `i` + 1.
                4.  Set `lengthA` to `lengthA` + 1.
                5.  If `lengthA` = `lim`, return `A`.
            10. Set `q` to `p`.
20. Let `T` be the [substring](#substring) of `S` from `p` to `size`.
21. Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`A`, ! [ToString](#sec-tostring)([𝔽](#𝔽)(`lengthA`)), `T`).
22. Return `A`.

The value of the "name" property of this method is "\[Symbol.split\]".

Note 2

This method ignores the value of the "global" and "sticky" properties of this RegExp object.

#### 22.2.6.15 get RegExp.prototype.sticky

`RegExp.prototype.sticky` is an [accessor property](#sec-object-type) whose set accessor function is undefined. Its get accessor function performs the following steps when called:

1.  Let `R` be the this value.
2.  Let `cu` be the code unit 0x0079 (LATIN SMALL LETTER Y).
3.  Return ? [RegExpHasFlag](#sec-regexphasflag)(`R`, `cu`).

#### 22.2.6.16 RegExp.prototype.test ( `S` )

This method performs the following steps when called:

1.  Let `R` be the this value.
2.  If `R` [is not an Object](#sec-object-type), throw a TypeError exception.
3.  Let `string` be ? [ToString](#sec-tostring)(`S`).
4.  Let `match` be ? [RegExpExec](#sec-regexpexec)(`R`, `string`).
5.  If `match` is not null, return true; else return false.

#### 22.2.6.17 RegExp.prototype.toString ( )

1.  Let `R` be the this value.
2.  If `R` [is not an Object](#sec-object-type), throw a TypeError exception.
3.  Let `pattern` be ? [ToString](#sec-tostring)(? [Get](#sec-get-o-p)(`R`, "source")).
4.  Let `flags` be ? [ToString](#sec-tostring)(? [Get](#sec-get-o-p)(`R`, "flags")).
5.  Let `result` be the [string-concatenation](#string-concatenation) of "/", `pattern`, "/", and `flags`.
6.  Return `result`.

Note

The returned String has the form of a [RegularExpressionLiteral](#prod-RegularExpressionLiteral) that evaluates to another RegExp object with the same behaviour as this object.

#### 22.2.6.18 get RegExp.prototype.unicode

`RegExp.prototype.unicode` is an [accessor property](#sec-object-type) whose set accessor function is undefined. Its get accessor function performs the following steps when called:

1.  Let `R` be the this value.
2.  Let `cu` be the code unit 0x0075 (LATIN SMALL LETTER U).
3.  Return ? [RegExpHasFlag](#sec-regexphasflag)(`R`, `cu`).

#### 22.2.6.19 get RegExp.prototype.unicodeSets

`RegExp.prototype.unicodeSets` is an [accessor property](#sec-object-type) whose set accessor function is undefined. Its get accessor function performs the following steps when called:

1.  Let `R` be the this value.
2.  Let `cu` be the code unit 0x0076 (LATIN SMALL LETTER V).
3.  Return ? [RegExpHasFlag](#sec-regexphasflag)(`R`, `cu`).

### 22.2.7 Abstract Operations for RegExp Matching

#### 22.2.7.1 RegExpExec ( `R`, `S` )

The abstract operation RegExpExec takes arguments `R` (an Object) and `S` (a String) and returns either a [normal completion containing](#sec-completion-record-specification-type) either an Object or null, or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `exec` be ? [Get](#sec-get-o-p)(`R`, "exec").
2.  If [IsCallable](#sec-iscallable)(`exec`) is true, then
    1.  Let `result` be ? [Call](#sec-call)(`exec`, `R`, « `S` »).
    2.  If `result` [is not an Object](#sec-object-type) and `result` is not null, throw a TypeError exception.
    3.  Return `result`.
3.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`R`, `[[RegExpMatcher]]`).
4.  Return ? [RegExpBuiltinExec](#sec-regexpbuiltinexec)(`R`, `S`).

Note

If a callable "exec" property is not found this algorithm falls back to attempting to use the built-in RegExp matching algorithm. This provides compatible behaviour for code written for prior editions where most built-in algorithms that use regular expressions did not perform a dynamic property lookup of "exec".

#### 22.2.7.2 RegExpBuiltinExec ( `R`, `S` )

The abstract operation RegExpBuiltinExec takes arguments `R` (an initialized RegExp instance) and `S` (a String) and returns either a [normal completion containing](#sec-completion-record-specification-type) either an [Array exotic object](#array-exotic-object) or null, or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `length` be the length of `S`.
2.  Let `lastIndex` be [ℝ](#ℝ)(? [ToLength](#sec-tolength)(? [Get](#sec-get-o-p)(`R`, "lastIndex"))).
3.  Let `flags` be `R`.`[[OriginalFlags]]`.
4.  If `flags` contains "g", let `global` be true; else let `global` be false.
5.  If `flags` contains "y", let `sticky` be true; else let `sticky` be false.
6.  If `flags` contains "d", let `hasIndices` be true; else let `hasIndices` be false.
7.  If `global` is false and `sticky` is false, set `lastIndex` to 0.
8.  Let `matcher` be `R`.`[[RegExpMatcher]]`.
9.  If `flags` contains "u" or `flags` contains "v", let `fullUnicode` be true; else let `fullUnicode` be false.
10. Let `matchSucceeded` be false.
11. If `fullUnicode` is true, let `input` be [StringToCodePoints](#sec-stringtocodepoints)(`S`). Otherwise, let `input` be a [List](#sec-list-and-record-specification-type) whose elements are the code units that are the elements of `S`.
12. NOTE: Each element of `input` is considered to be a character.
13. Repeat, while `matchSucceeded` is false,
    1.  If `lastIndex` \> `length`, then
        1.  If `global` is true or `sticky` is true, then
            1.  Perform ? [Set](#sec-set-o-p-v-throw)(`R`, "lastIndex", +0_(𝔽), true).
        2.  Return null.
    2.  Let `inputIndex` be the index into `input` of the character that was obtained from element `lastIndex` of `S`.
    3.  Let `r` be `matcher`(`input`, `inputIndex`).
    4.  If `r` is failure, then
        1.  If `sticky` is true, then
            1.  Perform ? [Set](#sec-set-o-p-v-throw)(`R`, "lastIndex", +0_(𝔽), true).
            2.  Return null.
        2.  Set `lastIndex` to [AdvanceStringIndex](#sec-advancestringindex)(`S`, `lastIndex`, `fullUnicode`).
    5.  Else,
        1.  [Assert](#assert): `r` is a [MatchState](#pattern-matchstate).
        2.  Set `matchSucceeded` to true.
14. Let `e` be `r`.`[[EndIndex]]`.
15. If `fullUnicode` is true, set `e` to [GetStringIndex](#sec-getstringindex)(`S`, `e`).
16. If `global` is true or `sticky` is true, then
    1.  Perform ? [Set](#sec-set-o-p-v-throw)(`R`, "lastIndex", [𝔽](#𝔽)(`e`), true).
17. Let `n` be the number of elements in `r`.`[[Captures]]`.
18. [Assert](#assert): `n` = `R`.`[[RegExpRecord]]`.`[[CapturingGroupsCount]]`.
19. [Assert](#assert): `n` \< 2\*\*³² - 1.
20. Let `A` be ! [ArrayCreate](#sec-arraycreate)(`n` + 1).
21. [Assert](#assert): The [mathematical value of](#mathematical-value-of) `A`'s "length" property is `n` + 1.
22. Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`A`, "index", [𝔽](#𝔽)(`lastIndex`)).
23. Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`A`, "input", `S`).
24. Let `match` be the [Match Record](#sec-match-records) { `[[StartIndex]]`: `lastIndex`, `[[EndIndex]]`: `e` }.
25. Let `indices` be a new empty [List](#sec-list-and-record-specification-type).
26. Let `groupNames` be a new empty [List](#sec-list-and-record-specification-type).
27. Append `match` to `indices`.
28. Let `matchedSubstr` be [GetMatchString](#sec-getmatchstring)(`S`, `match`).
29. Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`A`, "0", `matchedSubstr`).
30. If `R` contains any [GroupName](#prod-GroupName), then
    1.  Let `groups` be [OrdinaryObjectCreate](#sec-ordinaryobjectcreate)(null).
    2.  Let `hasGroups` be true.
31. Else,
    1.  Let `groups` be undefined.
    2.  Let `hasGroups` be false.
32. Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`A`, "groups", `groups`).
33. Let `matchedGroupNames` be a new empty [List](#sec-list-and-record-specification-type).
34. For each [integer](#integer) `i` such that 1 ≤ `i` ≤ `n`, in ascending order, do
    1.  Let `captureI` be `i`^(th) element of `r`.`[[Captures]]`.
    2.  If `captureI` is undefined, then
        1.  Let `capturedValue` be undefined.
        2.  Append undefined to `indices`.
    3.  Else,
        1.  Let `captureStart` be `captureI`.`[[StartIndex]]`.
        2.  Let `captureEnd` be `captureI`.`[[EndIndex]]`.
        3.  If `fullUnicode` is true, then
            1.  Set `captureStart` to [GetStringIndex](#sec-getstringindex)(`S`, `captureStart`).
            2.  Set `captureEnd` to [GetStringIndex](#sec-getstringindex)(`S`, `captureEnd`).
        4.  Let `capture` be the [Match Record](#sec-match-records) { `[[StartIndex]]`: `captureStart`, `[[EndIndex]]`: `captureEnd` }.
        5.  Let `capturedValue` be [GetMatchString](#sec-getmatchstring)(`S`, `capture`).
        6.  Append `capture` to `indices`.
    4.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`A`, ! [ToString](#sec-tostring)([𝔽](#𝔽)(`i`)), `capturedValue`).
    5.  If the `i`^(th) capture of `R` was defined with a [GroupName](#prod-GroupName), then
        1.  Let `s` be the [CapturingGroupName](#sec-static-semantics-capturinggroupname) of that [GroupName](#prod-GroupName).
        2.  If `matchedGroupNames` contains `s`, then
            1.  [Assert](#assert): `capturedValue` is undefined.
            2.  Append undefined to `groupNames`.
        3.  Else,
            1.  If `capturedValue` is not undefined, append `s` to `matchedGroupNames`.
            2.  NOTE: If there are multiple groups named `s`, `groups` may already have an `s` property at this point. However, because `groups` is an [ordinary object](#ordinary-object) whose properties are all writable [data properties](#sec-object-type), the call to [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow) is nevertheless guaranteed to succeed.
            3.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`groups`, `s`, `capturedValue`).
            4.  Append `s` to `groupNames`.
    6.  Else,
        1.  Append undefined to `groupNames`.
35. If `hasIndices` is true, then
    1.  Let `indicesArray` be [MakeMatchIndicesIndexPairArray](#sec-makematchindicesindexpairarray)(`S`, `indices`, `groupNames`, `hasGroups`).
    2.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`A`, "indices", `indicesArray`).
36. Return `A`.

#### 22.2.7.3 AdvanceStringIndex ( `S`, `index`, `unicode` )

The abstract operation AdvanceStringIndex takes arguments `S` (a String), `index` (a non-negative [integer](#integer)), and `unicode` (a Boolean) and returns an [integer](#integer). It performs the following steps when called:

1.  [Assert](#assert): `index` ≤ 2\*\*⁵³ - 1.
2.  If `unicode` is false, return `index` + 1.
3.  Let `length` be the length of `S`.
4.  If `index` + 1 ≥ `length`, return `index` + 1.
5.  Let `cp` be [CodePointAt](#sec-codepointat)(`S`, `index`).
6.  Return `index` + `cp`.`[[CodeUnitCount]]`.

#### 22.2.7.4 GetStringIndex ( `S`, `codePointIndex` )

The abstract operation GetStringIndex takes arguments `S` (a String) and `codePointIndex` (a non-negative [integer](#integer)) and returns a non-negative [integer](#integer). It interprets `S` as a sequence of UTF-16 encoded code points, as described in [6.1.4](#sec-ecmascript-language-types-string-type), and returns the code unit index corresponding to code point index `codePointIndex` when such an index exists. Otherwise, it returns the length of `S`. It performs the following steps when called:

1.  If `S` is the empty String, return 0.
2.  Let `len` be the length of `S`.
3.  Let `codeUnitCount` be 0.
4.  Let `codePointCount` be 0.
5.  Repeat, while `codeUnitCount` \< `len`,
    1.  If `codePointCount` = `codePointIndex`, return `codeUnitCount`.
    2.  Let `cp` be [CodePointAt](#sec-codepointat)(`S`, `codeUnitCount`).
    3.  Set `codeUnitCount` to `codeUnitCount` + `cp`.`[[CodeUnitCount]]`.
    4.  Set `codePointCount` to `codePointCount` + 1.
6.  Return `len`.

#### 22.2.7.5 Match Records

A Match Record is a [Record](#sec-list-and-record-specification-type) value used to encapsulate the start and end indices of a regular expression match or capture.

Match Records have the fields listed in [Table 72](#table-match-record).

| Field Name | Value | Meaning |
|----|----|----|
| `[[StartIndex]]` | a non-negative [integer](#integer) | The number of code units from the start of a string at which the match begins (inclusive). |
| `[[EndIndex]]` | an [integer](#integer) ≥ `[[StartIndex]]` | The number of code units from the start of a string at which the match ends (exclusive). |

Table 72: [Match Record](#sec-match-records) Fields

#### 22.2.7.6 GetMatchString ( `S`, `match` )

The abstract operation GetMatchString takes arguments `S` (a String) and `match` (a [Match Record](#sec-match-records)) and returns a String. It performs the following steps when called:

1.  [Assert](#assert): `match`.`[[StartIndex]]` ≤ `match`.`[[EndIndex]]` ≤ the length of `S`.
2.  Return the [substring](#substring) of `S` from `match`.`[[StartIndex]]` to `match`.`[[EndIndex]]`.

#### 22.2.7.7 GetMatchIndexPair ( `S`, `match` )

The abstract operation GetMatchIndexPair takes arguments `S` (a String) and `match` (a [Match Record](#sec-match-records)) and returns an Array. It performs the following steps when called:

1.  [Assert](#assert): `match`.`[[StartIndex]]` ≤ `match`.`[[EndIndex]]` ≤ the length of `S`.
2.  Return [CreateArrayFromList](#sec-createarrayfromlist)(« [𝔽](#𝔽)(`match`.`[[StartIndex]]`), [𝔽](#𝔽)(`match`.`[[EndIndex]]`) »).

#### 22.2.7.8 MakeMatchIndicesIndexPairArray ( `S`, `indices`, `groupNames`, `hasGroups` )

The abstract operation MakeMatchIndicesIndexPairArray takes arguments `S` (a String), `indices` (a [List](#sec-list-and-record-specification-type) of either [Match Records](#sec-match-records) or undefined), `groupNames` (a [List](#sec-list-and-record-specification-type) of either Strings or undefined), and `hasGroups` (a Boolean) and returns an Array. It performs the following steps when called:

1.  Let `n` be the number of elements in `indices`.
2.  [Assert](#assert): `n` \< 2\*\*³² - 1.
3.  [Assert](#assert): `groupNames` has `n` - 1 elements.
4.  NOTE: The `groupNames` [List](#sec-list-and-record-specification-type) contains elements aligned with the `indices` [List](#sec-list-and-record-specification-type) starting at `indices`\[1\].
5.  Let `A` be ! [ArrayCreate](#sec-arraycreate)(`n`).
6.  If `hasGroups` is true, then
    1.  Let `groups` be [OrdinaryObjectCreate](#sec-ordinaryobjectcreate)(null).
7.  Else,
    1.  Let `groups` be undefined.
8.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`A`, "groups", `groups`).
9.  For each [integer](#integer) `i` such that 0 ≤ `i` \< `n`, in ascending order, do
    1.  Let `matchIndices` be `indices`\[`i`\].
    2.  If `matchIndices` is not undefined, then
        1.  Let `matchIndexPair` be [GetMatchIndexPair](#sec-getmatchindexpair)(`S`, `matchIndices`).
    3.  Else,
        1.  Let `matchIndexPair` be undefined.
    4.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`A`, ! [ToString](#sec-tostring)([𝔽](#𝔽)(`i`)), `matchIndexPair`).
    5.  If `i` \> 0, then
        1.  Let `s` be `groupNames`\[`i` - 1\].
        2.  If `s` is not undefined, then
            1.  [Assert](#assert): `groups` is not undefined.
            2.  NOTE: If there are multiple groups named `s`, `groups` may already have an `s` property at this point. However, because `groups` is an [ordinary object](#ordinary-object) whose properties are all writable [data properties](#sec-object-type), the call to [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow) is nevertheless guaranteed to succeed.
            3.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`groups`, `s`, `matchIndexPair`).
10. Return `A`.

### 22.2.8 Properties of RegExp Instances

RegExp instances are [ordinary objects](#ordinary-object) that inherit properties from the [RegExp prototype object](#sec-properties-of-the-regexp-prototype-object). RegExp instances have internal slots `[[OriginalSource]]`, `[[OriginalFlags]]`, `[[RegExpRecord]]`, and `[[RegExpMatcher]]`. The value of the `[[RegExpMatcher]]` internal slot is an [Abstract Closure](#sec-abstract-closure) representation of the [Pattern](#prod-Pattern) of the RegExp object.

Note

Prior to ECMAScript 2015, RegExp instances were specified as having the own [data properties](#sec-object-type) "source", "global", "ignoreCase", and "multiline". Those properties are now specified as [accessor properties](#sec-object-type) of `RegExp.prototype`.

RegExp instances also have the following property:

#### 22.2.8.1 lastIndex

The value of the "lastIndex" property specifies the String index at which to start the next match. It is coerced to an [integral Number](#integral-number) when used (see [22.2.7.2](#sec-regexpbuiltinexec)). This property shall have the attributes { `[[Writable]]`: true, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

### 22.2.9 RegExp String Iterator Objects

A RegExp String Iterator is an object that represents a specific iteration over some specific String instance object, matching against some specific RegExp instance object. There is not a named [constructor](#constructor) for RegExp String Iterator objects. Instead, RegExp String Iterator objects are created by calling certain methods of RegExp instance objects.

#### 22.2.9.1 CreateRegExpStringIterator ( `R`, `S`, `global`, `fullUnicode` )

The abstract operation CreateRegExpStringIterator takes arguments `R` (an Object), `S` (a String), `global` (a Boolean), and `fullUnicode` (a Boolean) and returns a Generator. It performs the following steps when called:

1.  Let `closure` be a new [Abstract Closure](#sec-abstract-closure) with no parameters that captures `R`, `S`, `global`, and `fullUnicode` and performs the following steps when called:
    1.  Repeat,
        1.  Let `match` be ? [RegExpExec](#sec-regexpexec)(`R`, `S`).
        2.  If `match` is null, return undefined.
        3.  If `global` is false, then
            1.  Perform ? [GeneratorYield](#sec-generatoryield)([CreateIteratorResultObject](#sec-createiterresultobject)(`match`, false)).
            2.  Return undefined.
        4.  Let `matchStr` be ? [ToString](#sec-tostring)(? [Get](#sec-get-o-p)(`match`, "0")).
        5.  If `matchStr` is the empty String, then
            1.  Let `thisIndex` be [ℝ](#ℝ)(? [ToLength](#sec-tolength)(? [Get](#sec-get-o-p)(`R`, "lastIndex"))).
            2.  Let `nextIndex` be [AdvanceStringIndex](#sec-advancestringindex)(`S`, `thisIndex`, `fullUnicode`).
            3.  Perform ? [Set](#sec-set-o-p-v-throw)(`R`, "lastIndex", [𝔽](#𝔽)(`nextIndex`), true).
        6.  Perform ? [GeneratorYield](#sec-generatoryield)([CreateIteratorResultObject](#sec-createiterresultobject)(`match`, false)).
2.  Return [CreateIteratorFromClosure](#sec-createiteratorfromclosure)(`closure`, "%RegExpStringIteratorPrototype%", [%RegExpStringIteratorPrototype%](#sec-%regexpstringiteratorprototype%-object)).

#### 22.2.9.2 The %RegExpStringIteratorPrototype% Object

The %RegExpStringIteratorPrototype% object:

- has properties that are inherited by all [RegExp String Iterator objects](#sec-regexp-string-iterator-objects).
- is an [ordinary object](#ordinary-object).
- has a `[[Prototype]]` internal slot whose value is [%Iterator.prototype%](#sec-%iterator.prototype%-object).
- has the following properties:

##### 22.2.9.2.1 %RegExpStringIteratorPrototype%.next ( )

1.  Return ? [GeneratorResume](#sec-generatorresume)(this value, empty, "%RegExpStringIteratorPrototype%").

##### 22.2.9.2.2 %RegExpStringIteratorPrototype% \[ %Symbol.toStringTag% \]

The initial value of the [%Symbol.toStringTag%](#sec-well-known-symbols) property is the String value "RegExp String Iterator".

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: true }.
