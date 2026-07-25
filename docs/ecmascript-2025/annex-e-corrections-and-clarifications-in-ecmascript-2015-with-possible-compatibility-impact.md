# Annex E (informative) Corrections and Clarifications in ECMAScript 2015 with Possible Compatibility Impact

[9.1.1.4.14](#sec-candeclareglobalvar)-[9.1.1.4.17](#sec-createglobalfunctionbinding) Edition 5 and 5.1 used a property existence test to determine whether a [global object](#sec-global-object) property corresponding to a new global declaration already existed. ECMAScript 2015 uses an own property existence test. This corresponds to what has been most commonly implemented by web browsers.

[10.4.2.1](#sec-array-exotic-objects-defineownproperty-p-desc): The 5^(th) Edition moved the capture of the current array length prior to the [integer](#integer) conversion of the [array index](#array-index) or new length value. However, the captured length value could become invalid if the conversion process has the side-effect of changing the array length. ECMAScript 2015 specifies that the current array length must be captured after the possible occurrence of such side-effects.

[21.4.1.31](#sec-timeclip): Previous editions permitted the [TimeClip](#sec-timeclip) abstract operation to return either +0_(𝔽) or -0_(𝔽) as the representation of a 0 [time value](#sec-time-values-and-time-range). ECMAScript 2015 specifies that +0_(𝔽) always returned. This means that for ECMAScript 2015 the [time value](#sec-time-values-and-time-range) of a Date is never observably -0_(𝔽) and methods that return [time values](#sec-time-values-and-time-range) never return -0_(𝔽).

[21.4.1.32](#sec-date-time-string-format): If a UTC offset representation is not present, the local time zone is used. Edition 5.1 incorrectly stated that a missing time zone should be interpreted as "z".

[21.4.4.36](#sec-date.prototype.toisostring): If the year cannot be represented using the Date Time String Format specified in [21.4.1.32](#sec-date-time-string-format) a RangeError exception is thrown. Previous editions did not specify the behaviour for that case.

[21.4.4.41](#sec-date.prototype.tostring): Previous editions did not specify the value returned by `Date.prototype.toString` when the [time value](#sec-time-values-and-time-range) is NaN. ECMAScript 2015 specifies the result to be the String value "Invalid Date".

[22.2.4.1](#sec-regexp-pattern-flags), [22.2.6.13.1](#sec-escaperegexppattern): Any LineTerminator code points in the value of the "source" property of a RegExp instance must be expressed using an escape sequence. Edition 5.1 only required the escaping of `/`.

[22.2.6.8](#sec-regexp.prototype-%symbol.match%), [22.2.6.11](#sec-regexp.prototype-%symbol.replace%): In previous editions, the specifications for `String.prototype.match` and `String.prototype.replace` was incorrect for cases where the pattern argument was a RegExp value whose `global` flag is set. The previous specifications stated that for each attempt to match the pattern, if `lastIndex` did not change, it should be incremented by 1. The correct behaviour is that `lastIndex` should be incremented by 1 only if the pattern matched the empty String.

[23.1.3.30](#sec-array.prototype.sort): Previous editions did not specify how a NaN value returned by a `comparator` was interpreted by `Array.prototype.sort`. ECMAScript 2015 specifies that such as value is treated as if +0_(𝔽) was returned from the `comparator`. ECMAScript 2015 also specifies that [ToNumber](#sec-tonumber) is applied to the result returned by a `comparator`. In previous editions, the effect of a `comparator` result that [is not a Number](#sec-ecmascript-language-types-number-type) value was [implementation-defined](#implementation-defined). In practice, implementations call [ToNumber](#sec-tonumber).
