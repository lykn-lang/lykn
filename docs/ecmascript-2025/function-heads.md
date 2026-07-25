# ECMAScript 2025 — Function / Operation Heads

Every clause heading shaped like `Name ( params )`, with the signature sentence that follows it. For the function-head consistency audit.

## `5.2.3.1` Completion ( completionRecord )
*05-notational-conventions.md*
> The abstract operation Completion takes argument completionRecord (a Completion Record) and returns a Completion Record. It is used to emphasize that a Completion Record is being returned. It performs the following steps when called:

## `6.1.4.1` StringIndexOf ( string, searchValue, fromIndex )
*06-ecmascript-data-types-and-values.md*
> The abstract operation StringIndexOf takes arguments string (a String), searchValue (a String), and fromIndex (a non-negative integer) and returns a non-negative integer or not-found. It performs the following steps when called:

## `6.1.4.2` StringLastIndexOf ( string, searchValue, fromIndex )
*06-ecmascript-data-types-and-values.md*
> The abstract operation StringLastIndexOf takes arguments string (a String), searchValue (a String), and fromIndex (a non-negative integer) and returns a non-negative integer or not-found. It performs the following steps when called:

## `6.1.6.1.1` Number::unaryMinus ( x )
*06-ecmascript-data-types-and-values.md*
> The abstract operation Number::unaryMinus takes argument x (a Number) and returns a Number. It performs the following steps when called:

## `6.1.6.1.2` Number::bitwiseNOT ( x )
*06-ecmascript-data-types-and-values.md*
> The abstract operation Number::bitwiseNOT takes argument x (a Number) and returns an integral Number. It performs the following steps when called:

## `6.1.6.1.3` Number::exponentiate ( base, exponent )
*06-ecmascript-data-types-and-values.md*
> The abstract operation Number::exponentiate takes arguments base (a Number) and exponent (a Number) and returns a Number. It returns an implementation-approximated value representing the result of raising base to the exponent power. It performs the following steps when called:

## `6.1.6.1.4` Number::multiply ( x, y )
*06-ecmascript-data-types-and-values.md*
> The abstract operation Number::multiply takes arguments x (a Number) and y (a Number) and returns a Number. It performs multiplication according to the rules of IEEE 754-2019 binary double-precision arithmetic, producing the product of x and y. It performs the following steps when called:

## `6.1.6.1.5` Number::divide ( x, y )
*06-ecmascript-data-types-and-values.md*
> The abstract operation Number::divide takes arguments x (a Number) and y (a Number) and returns a Number. It performs division according to the rules of IEEE 754-2019 binary double-precision arithmetic, producing the quotient of x and y where x is the dividend and y is the divisor. It performs the following steps when called:

## `6.1.6.1.6` Number::remainder ( n, d )
*06-ecmascript-data-types-and-values.md*
> The abstract operation Number::remainder takes arguments n (a Number) and d (a Number) and returns a Number. It yields the remainder from an implied division of its operands where n is the dividend and d is the divisor. It performs the following steps when called:

## `6.1.6.1.7` Number::add ( x, y )
*06-ecmascript-data-types-and-values.md*
> The abstract operation Number::add takes arguments x (a Number) and y (a Number) and returns a Number. It performs addition according to the rules of IEEE 754-2019 binary double-precision arithmetic, producing the sum of its arguments. It performs the following steps when called:

## `6.1.6.1.8` Number::subtract ( x, y )
*06-ecmascript-data-types-and-values.md*
> The abstract operation Number::subtract takes arguments x (a Number) and y (a Number) and returns a Number. It performs subtraction, producing the difference of its operands; x is the minuend and y is the subtrahend. It performs the following steps when called:

## `6.1.6.1.9` Number::leftShift ( x, y )
*06-ecmascript-data-types-and-values.md*
> The abstract operation Number::leftShift takes arguments x (a Number) and y (a Number) and returns an integral Number. It performs the following steps when called:

## `6.1.6.1.10` Number::signedRightShift ( x, y )
*06-ecmascript-data-types-and-values.md*
> The abstract operation Number::signedRightShift takes arguments x (a Number) and y (a Number) and returns an integral Number. It performs the following steps when called:

## `6.1.6.1.11` Number::unsignedRightShift ( x, y )
*06-ecmascript-data-types-and-values.md*
> The abstract operation Number::unsignedRightShift takes arguments x (a Number) and y (a Number) and returns an integral Number. It performs the following steps when called:

## `6.1.6.1.12` Number::lessThan ( x, y )
*06-ecmascript-data-types-and-values.md*
> The abstract operation Number::lessThan takes arguments x (a Number) and y (a Number) and returns a Boolean or undefined. It performs the following steps when called:

## `6.1.6.1.13` Number::equal ( x, y )
*06-ecmascript-data-types-and-values.md*
> The abstract operation Number::equal takes arguments x (a Number) and y (a Number) and returns a Boolean. It performs the following steps when called:

## `6.1.6.1.14` Number::sameValue ( x, y )
*06-ecmascript-data-types-and-values.md*
> The abstract operation Number::sameValue takes arguments x (a Number) and y (a Number) and returns a Boolean. It performs the following steps when called:

## `6.1.6.1.15` Number::sameValueZero ( x, y )
*06-ecmascript-data-types-and-values.md*
> The abstract operation Number::sameValueZero takes arguments x (a Number) and y (a Number) and returns a Boolean. It performs the following steps when called:

## `6.1.6.1.16` NumberBitwiseOp ( op, x, y )
*06-ecmascript-data-types-and-values.md*
> The abstract operation NumberBitwiseOp takes arguments op (&, ^, or |), x (a Number), and y (a Number) and returns an integral Number. It performs the following steps when called:

## `6.1.6.1.17` Number::bitwiseAND ( x, y )
*06-ecmascript-data-types-and-values.md*
> The abstract operation Number::bitwiseAND takes arguments x (a Number) and y (a Number) and returns an integral Number. It performs the following steps when called:

## `6.1.6.1.18` Number::bitwiseXOR ( x, y )
*06-ecmascript-data-types-and-values.md*
> The abstract operation Number::bitwiseXOR takes arguments x (a Number) and y (a Number) and returns an integral Number. It performs the following steps when called:

## `6.1.6.1.19` Number::bitwiseOR ( x, y )
*06-ecmascript-data-types-and-values.md*
> The abstract operation Number::bitwiseOR takes arguments x (a Number) and y (a Number) and returns an integral Number. It performs the following steps when called:

## `6.1.6.1.20` Number::toString ( x, radix )
*06-ecmascript-data-types-and-values.md*
> The abstract operation Number::toString takes arguments x (a Number) and radix (an integer in the inclusive interval from 2 to 36) and returns a String. It represents x as a String using a positional numeral system with radix radix. The digits used in the representation of a number using radix r are taken from the first r code units of "0123456789abcdefghijklmnopqrstuvwxyz" in order. The representation of numbers with magnitude greater than or equal to 1_(𝔽) never includes leading zeroes. It performs the following steps when called:

## `6.1.6.2.1` BigInt::unaryMinus ( x )
*06-ecmascript-data-types-and-values.md*
> The abstract operation BigInt::unaryMinus takes argument x (a BigInt) and returns a BigInt. It performs the following steps when called:

## `6.1.6.2.2` BigInt::bitwiseNOT ( x )
*06-ecmascript-data-types-and-values.md*
> The abstract operation BigInt::bitwiseNOT takes argument x (a BigInt) and returns a BigInt. It returns the one's complement of x. It performs the following steps when called:

## `6.1.6.2.3` BigInt::exponentiate ( base, exponent )
*06-ecmascript-data-types-and-values.md*
> The abstract operation BigInt::exponentiate takes arguments base (a BigInt) and exponent (a BigInt) and returns either a normal completion containing a BigInt or a throw completion. It performs the following steps when called:

## `6.1.6.2.4` BigInt::multiply ( x, y )
*06-ecmascript-data-types-and-values.md*
> The abstract operation BigInt::multiply takes arguments x (a BigInt) and y (a BigInt) and returns a BigInt. It performs the following steps when called:

## `6.1.6.2.5` BigInt::divide ( x, y )
*06-ecmascript-data-types-and-values.md*
> The abstract operation BigInt::divide takes arguments x (a BigInt) and y (a BigInt) and returns either a normal completion containing a BigInt or a throw completion. It performs the following steps when called:

## `6.1.6.2.6` BigInt::remainder ( n, d )
*06-ecmascript-data-types-and-values.md*
> The abstract operation BigInt::remainder takes arguments n (a BigInt) and d (a BigInt) and returns either a normal completion containing a BigInt or a throw completion. It performs the following steps when called:

## `6.1.6.2.7` BigInt::add ( x, y )
*06-ecmascript-data-types-and-values.md*
> The abstract operation BigInt::add takes arguments x (a BigInt) and y (a BigInt) and returns a BigInt. It performs the following steps when called:

## `6.1.6.2.8` BigInt::subtract ( x, y )
*06-ecmascript-data-types-and-values.md*
> The abstract operation BigInt::subtract takes arguments x (a BigInt) and y (a BigInt) and returns a BigInt. It performs the following steps when called:

## `6.1.6.2.9` BigInt::leftShift ( x, y )
*06-ecmascript-data-types-and-values.md*
> The abstract operation BigInt::leftShift takes arguments x (a BigInt) and y (a BigInt) and returns a BigInt. It performs the following steps when called:

## `6.1.6.2.10` BigInt::signedRightShift ( x, y )
*06-ecmascript-data-types-and-values.md*
> The abstract operation BigInt::signedRightShift takes arguments x (a BigInt) and y (a BigInt) and returns a BigInt. It performs the following steps when called:

## `6.1.6.2.11` BigInt::unsignedRightShift ( x, y )
*06-ecmascript-data-types-and-values.md*
> The abstract operation BigInt::unsignedRightShift takes arguments x (a BigInt) and y (a BigInt) and returns a throw completion. It performs the following steps when called:

## `6.1.6.2.12` BigInt::lessThan ( x, y )
*06-ecmascript-data-types-and-values.md*
> The abstract operation BigInt::lessThan takes arguments x (a BigInt) and y (a BigInt) and returns a Boolean. It performs the following steps when called:

## `6.1.6.2.13` BigInt::equal ( x, y )
*06-ecmascript-data-types-and-values.md*
> The abstract operation BigInt::equal takes arguments x (a BigInt) and y (a BigInt) and returns a Boolean. It performs the following steps when called:

## `6.1.6.2.14` BinaryAnd ( x, y )
*06-ecmascript-data-types-and-values.md*
> The abstract operation BinaryAnd takes arguments x (0 or 1) and y (0 or 1) and returns 0 or 1. It performs the following steps when called:

## `6.1.6.2.15` BinaryOr ( x, y )
*06-ecmascript-data-types-and-values.md*
> The abstract operation BinaryOr takes arguments x (0 or 1) and y (0 or 1) and returns 0 or 1. It performs the following steps when called:

## `6.1.6.2.16` BinaryXor ( x, y )
*06-ecmascript-data-types-and-values.md*
> The abstract operation BinaryXor takes arguments x (0 or 1) and y (0 or 1) and returns 0 or 1. It performs the following steps when called:

## `6.1.6.2.17` BigIntBitwiseOp ( op, x, y )
*06-ecmascript-data-types-and-values.md*
> The abstract operation BigIntBitwiseOp takes arguments op (&, ^, or |), x (a BigInt), and y (a BigInt) and returns a BigInt. It performs the following steps when called:

## `6.1.6.2.18` BigInt::bitwiseAND ( x, y )
*06-ecmascript-data-types-and-values.md*
> The abstract operation BigInt::bitwiseAND takes arguments x (a BigInt) and y (a BigInt) and returns a BigInt. It performs the following steps when called:

## `6.1.6.2.19` BigInt::bitwiseXOR ( x, y )
*06-ecmascript-data-types-and-values.md*
> The abstract operation BigInt::bitwiseXOR takes arguments x (a BigInt) and y (a BigInt) and returns a BigInt. It performs the following steps when called:

## `6.1.6.2.20` BigInt::bitwiseOR ( x, y )
*06-ecmascript-data-types-and-values.md*
> The abstract operation BigInt::bitwiseOR takes arguments x (a BigInt) and y (a BigInt) and returns a BigInt. It performs the following steps when called:

## `6.1.6.2.21` BigInt::toString ( x, radix )
*06-ecmascript-data-types-and-values.md*
> The abstract operation BigInt::toString takes arguments x (a BigInt) and radix (an integer in the inclusive interval from 2 to 36) and returns a String. It represents x as a String using a positional numeral system with radix radix. The digits used in the representation of a BigInt using radix r are taken from the first r code units of "0123456789abcdefghijklmnopqrstuvwxyz" in order. The representation of BigInts other than 0_(ℤ) never includes leading zeroes. It performs the following steps when called:

## `6.2.4.1` NormalCompletion ( value )
*06-ecmascript-data-types-and-values.md*
> The abstract operation NormalCompletion takes argument value (any value except a Completion Record) and returns a normal completion. It performs the following steps when called:

## `6.2.4.2` ThrowCompletion ( value )
*06-ecmascript-data-types-and-values.md*
> The abstract operation ThrowCompletion takes argument value (an ECMAScript language value) and returns a throw completion. It performs the following steps when called:

## `6.2.4.3` ReturnCompletion ( value )
*06-ecmascript-data-types-and-values.md*
> The abstract operation ReturnCompletion takes argument value (an ECMAScript language value) and returns a return completion. It performs the following steps when called:

## `6.2.4.4` UpdateEmpty ( completionRecord, value )
*06-ecmascript-data-types-and-values.md*
> The abstract operation UpdateEmpty takes arguments completionRecord (a Completion Record) and value (any value except a Completion Record) and returns a Completion Record. It performs the following steps when called:

## `6.2.5.1` IsPropertyReference ( V )
*06-ecmascript-data-types-and-values.md*
> The abstract operation IsPropertyReference takes argument V (a Reference Record) and returns a Boolean. It performs the following steps when called:

## `6.2.5.2` IsUnresolvableReference ( V )
*06-ecmascript-data-types-and-values.md*
> The abstract operation IsUnresolvableReference takes argument V (a Reference Record) and returns a Boolean. It performs the following steps when called:

## `6.2.5.3` IsSuperReference ( V )
*06-ecmascript-data-types-and-values.md*
> The abstract operation IsSuperReference takes argument V (a Reference Record) and returns a Boolean. It performs the following steps when called:

## `6.2.5.4` IsPrivateReference ( V )
*06-ecmascript-data-types-and-values.md*
> The abstract operation IsPrivateReference takes argument V (a Reference Record) and returns a Boolean. It performs the following steps when called:

## `6.2.5.5` GetValue ( V )
*06-ecmascript-data-types-and-values.md*
> The abstract operation GetValue takes argument V (a Reference Record or an ECMAScript language value) and returns either a normal completion containing an ECMAScript language value or an abrupt completion. It performs the following steps when called:

## `6.2.5.6` PutValue ( V, W )
*06-ecmascript-data-types-and-values.md*
> The abstract operation PutValue takes arguments V (a Reference Record or an ECMAScript language value) and W (an ECMAScript language value) and returns either a normal completion containing unused or an abrupt completion. It performs the following steps when called:

## `6.2.5.7` GetThisValue ( V )
*06-ecmascript-data-types-and-values.md*
> The abstract operation GetThisValue takes argument V (a Reference Record) and returns an ECMAScript language value. It performs the following steps when called:

## `6.2.5.8` InitializeReferencedBinding ( V, W )
*06-ecmascript-data-types-and-values.md*
> The abstract operation InitializeReferencedBinding takes arguments V (a Reference Record) and W (an ECMAScript language value) and returns either a normal completion containing unused or an abrupt completion. It performs the following steps when called:

## `6.2.5.9` MakePrivateReference ( baseValue, privateIdentifier )
*06-ecmascript-data-types-and-values.md*
> The abstract operation MakePrivateReference takes arguments baseValue (an ECMAScript language value) and privateIdentifier (a String) and returns a Reference Record. It performs the following steps when called:

## `6.2.6.1` IsAccessorDescriptor ( Desc )
*06-ecmascript-data-types-and-values.md*
> The abstract operation IsAccessorDescriptor takes argument Desc (a Property Descriptor or undefined) and returns a Boolean. It performs the following steps when called:

## `6.2.6.2` IsDataDescriptor ( Desc )
*06-ecmascript-data-types-and-values.md*
> The abstract operation IsDataDescriptor takes argument Desc (a Property Descriptor or undefined) and returns a Boolean. It performs the following steps when called:

## `6.2.6.3` IsGenericDescriptor ( Desc )
*06-ecmascript-data-types-and-values.md*
> The abstract operation IsGenericDescriptor takes argument Desc (a Property Descriptor or undefined) and returns a Boolean. It performs the following steps when called:

## `6.2.6.4` FromPropertyDescriptor ( Desc )
*06-ecmascript-data-types-and-values.md*
> The abstract operation FromPropertyDescriptor takes argument Desc (a Property Descriptor or undefined) and returns an Object or undefined. It performs the following steps when called:

## `6.2.6.5` ToPropertyDescriptor ( Obj )
*06-ecmascript-data-types-and-values.md*
> The abstract operation ToPropertyDescriptor takes argument Obj (an ECMAScript language value) and returns either a normal completion containing a Property Descriptor or a throw completion. It performs the following steps when called:

## `6.2.6.6` CompletePropertyDescriptor ( Desc )
*06-ecmascript-data-types-and-values.md*
> The abstract operation CompletePropertyDescriptor takes argument Desc (a Property Descriptor) and returns unused. It performs the following steps when called:

## `6.2.9.1` CreateByteDataBlock ( size )
*06-ecmascript-data-types-and-values.md*
> The abstract operation CreateByteDataBlock takes argument size (a non-negative integer) and returns either a normal completion containing a Data Block or a throw completion. It performs the following steps when called:

## `6.2.9.2` CreateSharedByteDataBlock ( size )
*06-ecmascript-data-types-and-values.md*
> The abstract operation CreateSharedByteDataBlock takes argument size (a non-negative integer) and returns either a normal completion containing a Shared Data Block or a throw completion. It performs the following steps when called:

## `6.2.9.3` CopyDataBlockBytes ( toBlock, toIndex, fromBlock, fromIndex, count )
*06-ecmascript-data-types-and-values.md*
> The abstract operation CopyDataBlockBytes takes arguments toBlock (a Data Block or a Shared Data Block), toIndex (a non-negative integer), fromBlock (a Data Block or a Shared Data Block), fromIndex (a non-negative integer), and count (a non-negative integer) and returns unused. It performs the following steps when called:

## `7.1.1` ToPrimitive ( input \[ , preferredType \] )
*07-abstract-operations.md*
> The abstract operation ToPrimitive takes argument input (an ECMAScript language value) and optional argument preferredType (string or number) and returns either a normal completion containing an ECMAScript language value or a throw completion. It converts its input argument to a non-Object type. If an object is capable of converting to more than one primitive type, it may use the optional hint preferredType to favour that type. It performs the following steps when called:

## `7.1.1.1` OrdinaryToPrimitive ( O, hint )
*07-abstract-operations.md*
> The abstract operation OrdinaryToPrimitive takes arguments O (an Object) and hint (string or number) and returns either a normal completion containing an ECMAScript language value or a throw completion. It performs the following steps when called:

## `7.1.2` ToBoolean ( argument )
*07-abstract-operations.md*
> The abstract operation ToBoolean takes argument argument (an ECMAScript language value) and returns a Boolean. It converts argument to a value of type Boolean. It performs the following steps when called:

## `7.1.3` ToNumeric ( value )
*07-abstract-operations.md*
> The abstract operation ToNumeric takes argument value (an ECMAScript language value) and returns either a normal completion containing either a Number or a BigInt, or a throw completion. It returns value converted to a Number or a BigInt. It performs the following steps when called:

## `7.1.4` ToNumber ( argument )
*07-abstract-operations.md*
> The abstract operation ToNumber takes argument argument (an ECMAScript language value) and returns either a normal completion containing a Number or a throw completion. It converts argument to a value of type Number. It performs the following steps when called:

## `7.1.4.1.1` StringToNumber ( str )
*07-abstract-operations.md*
> The abstract operation StringToNumber takes argument str (a String) and returns a Number. It performs the following steps when called:

## `7.1.4.1.3` RoundMVResult ( n )
*07-abstract-operations.md*
> The abstract operation RoundMVResult takes argument n (a mathematical value) and returns a Number. It converts n to a Number in an implementation-defined manner. For the purposes of this abstract operation, a digit is significant if it is not zero or there is a non-zero digit to its left and there is a non-zero digit to its right. For the purposes of this abstract operation, "the mathematical value denoted by" a representation of a mathematical value is the inverse of "the decimal representation of" a mathematical value. It performs the following steps when called:

## `7.1.5` ToIntegerOrInfinity ( argument )
*07-abstract-operations.md*
> The abstract operation ToIntegerOrInfinity takes argument argument (an ECMAScript language value) and returns either a normal completion containing either an integer, +∞, or -∞, or a throw completion. It converts argument to an integer representing its Number value with fractional part truncated, or to +∞ or -∞ when that Number value is infinite. It performs the following steps when called:

## `7.1.6` ToInt32 ( argument )
*07-abstract-operations.md*
> The abstract operation ToInt32 takes argument argument (an ECMAScript language value) and returns either a normal completion containing an integral Number or a throw completion. It converts argument to one of 2\*\*³² integral Number values in the inclusive interval from 𝔽(-2\*\*³¹) to 𝔽(2\*\*³¹ - 1). It performs the following steps when called:

## `7.1.7` ToUint32 ( argument )
*07-abstract-operations.md*
> The abstract operation ToUint32 takes argument argument (an ECMAScript language value) and returns either a normal completion containing an integral Number or a throw completion. It converts argument to one of 2\*\*³² integral Number values in the inclusive interval from +0_(𝔽) to 𝔽(2\*\*³² - 1). It performs the following steps when called:

## `7.1.8` ToInt16 ( argument )
*07-abstract-operations.md*
> The abstract operation ToInt16 takes argument argument (an ECMAScript language value) and returns either a normal completion containing an integral Number or a throw completion. It converts argument to one of 2\*\*¹⁶ integral Number values in the inclusive interval from 𝔽(-2\*\*¹⁵) to 𝔽(2\*\*¹⁵ - 1). It performs the following steps when called:

## `7.1.9` ToUint16 ( argument )
*07-abstract-operations.md*
> The abstract operation ToUint16 takes argument argument (an ECMAScript language value) and returns either a normal completion containing an integral Number or a throw completion. It converts argument to one of 2\*\*¹⁶ integral Number values in the inclusive interval from +0_(𝔽) to 𝔽(2\*\*¹⁶ - 1). It performs the following steps when called:

## `7.1.10` ToInt8 ( argument )
*07-abstract-operations.md*
> The abstract operation ToInt8 takes argument argument (an ECMAScript language value) and returns either a normal completion containing an integral Number or a throw completion. It converts argument to one of 2\*\*⁸ integral Number values in the inclusive interval from -128_(𝔽) to 127_(𝔽). It performs the following steps when called:

## `7.1.11` ToUint8 ( argument )
*07-abstract-operations.md*
> The abstract operation ToUint8 takes argument argument (an ECMAScript language value) and returns either a normal completion containing an integral Number or a throw completion. It converts argument to one of 2\*\*⁸ integral Number values in the inclusive interval from +0_(𝔽) to 255_(𝔽). It performs the following steps when called:

## `7.1.12` ToUint8Clamp ( argument )
*07-abstract-operations.md*
> The abstract operation ToUint8Clamp takes argument argument (an ECMAScript language value) and returns either a normal completion containing an integral Number or a throw completion. It clamps and rounds argument to one of 2\*\*⁸ integral Number values in the inclusive interval from +0_(𝔽) to 255_(𝔽). It performs the following steps when called:

## `7.1.13` ToBigInt ( argument )
*07-abstract-operations.md*
> The abstract operation ToBigInt takes argument argument (an ECMAScript language value) and returns either a normal completion containing a BigInt or a throw completion. It converts argument to a BigInt value, or throws if an implicit conversion from Number would be required. It performs the following steps when called:

## `7.1.14` StringToBigInt ( str )
*07-abstract-operations.md*
> The abstract operation StringToBigInt takes argument str (a String) and returns a BigInt or undefined. It performs the following steps when called:

## `7.1.15` ToBigInt64 ( argument )
*07-abstract-operations.md*
> The abstract operation ToBigInt64 takes argument argument (an ECMAScript language value) and returns either a normal completion containing a BigInt or a throw completion. It converts argument to one of 2\*\*⁶⁴ BigInt values in the inclusive interval from ℤ(-2\*\*⁶³) to ℤ(2\*\*⁶³ - 1). It performs the following steps when called:

## `7.1.16` ToBigUint64 ( argument )
*07-abstract-operations.md*
> The abstract operation ToBigUint64 takes argument argument (an ECMAScript language value) and returns either a normal completion containing a BigInt or a throw completion. It converts argument to one of 2\*\*⁶⁴ BigInt values in the inclusive interval from 0_(ℤ) to ℤ(2\*\*⁶⁴ - 1). It performs the following steps when called:

## `7.1.17` ToString ( argument )
*07-abstract-operations.md*
> The abstract operation ToString takes argument argument (an ECMAScript language value) and returns either a normal completion containing a String or a throw completion. It converts argument to a value of type String. It performs the following steps when called:

## `7.1.18` ToObject ( argument )
*07-abstract-operations.md*
> The abstract operation ToObject takes argument argument (an ECMAScript language value) and returns either a normal completion containing an Object or a throw completion. It converts argument to a value of type Object according to Table 13:

## `7.1.19` ToPropertyKey ( argument )
*07-abstract-operations.md*
> The abstract operation ToPropertyKey takes argument argument (an ECMAScript language value) and returns either a normal completion containing a property key or a throw completion. It converts argument to a value that can be used as a property key. It performs the following steps when called:

## `7.1.20` ToLength ( argument )
*07-abstract-operations.md*
> The abstract operation ToLength takes argument argument (an ECMAScript language value) and returns either a normal completion containing a non-negative integral Number or a throw completion. It clamps and truncates argument to a non-negative integral Number suitable for use as the length of an array-like object. It performs the following steps when called:

## `7.1.21` CanonicalNumericIndexString ( argument )
*07-abstract-operations.md*
> The abstract operation CanonicalNumericIndexString takes argument argument (a String) and returns a Number or undefined. If argument is either "-0" or exactly matches ToString(n) for some Number value n, it returns the respective Number value. Otherwise, it returns undefined. It performs the following steps when called:

## `7.1.22` ToIndex ( value )
*07-abstract-operations.md*
> The abstract operation ToIndex takes argument value (an ECMAScript language value) and returns either a normal completion containing a non-negative integer or a throw completion. It converts value to an integer and returns that integer if it is non-negative and corresponds with an integer index. Otherwise, it throws an exception. It performs the following steps when called:

## `7.2.1` RequireObjectCoercible ( argument )
*07-abstract-operations.md*
> The abstract operation RequireObjectCoercible takes argument argument (an ECMAScript language value) and returns either a normal completion containing an ECMAScript language value or a throw completion. It throws an error if argument is a value that cannot be converted to an Object using ToObject. It is defined by Table 14:

## `7.2.2` IsArray ( argument )
*07-abstract-operations.md*
> The abstract operation IsArray takes argument argument (an ECMAScript language value) and returns either a normal completion containing a Boolean or a throw completion. It performs the following steps when called:

## `7.2.3` IsCallable ( argument )
*07-abstract-operations.md*
> The abstract operation IsCallable takes argument argument (an ECMAScript language value) and returns a Boolean. It determines if argument is a callable function with a [[Call]] internal method. It performs the following steps when called:

## `7.2.4` IsConstructor ( argument )
*07-abstract-operations.md*
> The abstract operation IsConstructor takes argument argument (an ECMAScript language value) and returns a Boolean. It determines if argument is a function object with a [[Construct]] internal method. It performs the following steps when called:

## `7.2.5` IsExtensible ( O )
*07-abstract-operations.md*
> The abstract operation IsExtensible takes argument O (an Object) and returns either a normal completion containing a Boolean or a throw completion. It is used to determine whether additional properties can be added to O. It performs the following steps when called:

## `7.2.6` IsRegExp ( argument )
*07-abstract-operations.md*
> The abstract operation IsRegExp takes argument argument (an ECMAScript language value) and returns either a normal completion containing a Boolean or a throw completion. It performs the following steps when called:

## `7.2.7` Static Semantics: IsStringWellFormedUnicode ( string )
*07-abstract-operations.md*
> The abstract operation IsStringWellFormedUnicode takes argument string (a String) and returns a Boolean. It interprets string as a sequence of UTF-16 encoded code points, as described in 6.1.4, and determines whether it is a well formed UTF-16 sequence. It performs the following steps when called:

## `7.2.8` SameType ( x, y )
*07-abstract-operations.md*
> The abstract operation SameType takes arguments x (an ECMAScript language value) and y (an ECMAScript language value) and returns a Boolean. It determines whether or not the two arguments are the same type. It performs the following steps when called:

## `7.2.9` SameValue ( x, y )
*07-abstract-operations.md*
> The abstract operation SameValue takes arguments x (an ECMAScript language value) and y (an ECMAScript language value) and returns a Boolean. It determines whether or not the two arguments are the same value. It performs the following steps when called:

## `7.2.10` SameValueZero ( x, y )
*07-abstract-operations.md*
> The abstract operation SameValueZero takes arguments x (an ECMAScript language value) and y (an ECMAScript language value) and returns a Boolean. It determines whether or not the two arguments are the same value (ignoring the difference between +0_(𝔽) and -0_(𝔽)). It performs the following steps when called:

## `7.2.11` SameValueNonNumber ( x, y )
*07-abstract-operations.md*
> The abstract operation SameValueNonNumber takes arguments x (an ECMAScript language value, but not a Number) and y (an ECMAScript language value, but not a Number) and returns a Boolean. It performs the following steps when called:

## `7.2.12` IsLessThan ( x, y, LeftFirst )
*07-abstract-operations.md*
> The abstract operation IsLessThan takes arguments x (an ECMAScript language value), y (an ECMAScript language value), and LeftFirst (a Boolean) and returns either a normal completion containing either a Boolean or undefined, or a throw completion. It provides the semantics for the comparison x \< y, returning true, false, or undefined (which indicates that at least one operand is NaN). The LeftFirst flag is used to control the order in which operations with potentially visible side-effects are performed upon x and y. It is necessary because ECMAScript specifies left to right evaluation of expressions. If LeftFirst is true, the x parameter corresponds to an expression that occurs to the left of the y parameter's corresponding expression. If LeftFirst is false, the reverse is the case and operations must be performed upon y before x. It performs the following steps when called:

## `7.2.13` IsLooselyEqual ( x, y )
*07-abstract-operations.md*
> The abstract operation IsLooselyEqual takes arguments x (an ECMAScript language value) and y (an ECMAScript language value) and returns either a normal completion containing a Boolean or a throw completion. It provides the semantics for the == operator. It performs the following steps when called:

## `7.2.14` IsStrictlyEqual ( x, y )
*07-abstract-operations.md*
> The abstract operation IsStrictlyEqual takes arguments x (an ECMAScript language value) and y (an ECMAScript language value) and returns a Boolean. It provides the semantics for the === operator. It performs the following steps when called:

## `7.3.1` MakeBasicObject ( internalSlotsList )
*07-abstract-operations.md*
> The abstract operation MakeBasicObject takes argument internalSlotsList (a List of internal slot names) and returns an Object. It is the source of all ECMAScript objects that are created algorithmically, including both ordinary objects and exotic objects. It factors out common steps used in creating all objects, and centralizes object creation. It performs the following steps when called:

## `7.3.2` Get ( O, P )
*07-abstract-operations.md*
> The abstract operation Get takes arguments O (an Object) and P (a property key) and returns either a normal completion containing an ECMAScript language value or a throw completion. It is used to retrieve the value of a specific property of an object. It performs the following steps when called:

## `7.3.3` GetV ( V, P )
*07-abstract-operations.md*
> The abstract operation GetV takes arguments V (an ECMAScript language value) and P (a property key) and returns either a normal completion containing an ECMAScript language value or a throw completion. It is used to retrieve the value of a specific property of an ECMAScript language value. If the value is not an object, the property lookup is performed using a wrapper object appropriate for the type of the value. It performs the following steps when called:

## `7.3.4` Set ( O, P, V, Throw )
*07-abstract-operations.md*
> The abstract operation Set takes arguments O (an Object), P (a property key), V (an ECMAScript language value), and Throw (a Boolean) and returns either a normal completion containing unused or a throw completion. It is used to set the value of a specific property of an object. V is the new value for the property. It performs the following steps when called:

## `7.3.5` CreateDataProperty ( O, P, V )
*07-abstract-operations.md*
> The abstract operation CreateDataProperty takes arguments O (an Object), P (a property key), and V (an ECMAScript language value) and returns either a normal completion containing a Boolean or a throw completion. It is used to create a new own property of an object. It performs the following steps when called:

## `7.3.6` CreateDataPropertyOrThrow ( O, P, V )
*07-abstract-operations.md*
> The abstract operation CreateDataPropertyOrThrow takes arguments O (an Object), P (a property key), and V (an ECMAScript language value) and returns either a normal completion containing unused or a throw completion. It is used to create a new own property of an object. It throws a TypeError exception if the requested property update cannot be performed. It performs the following steps when called:

## `7.3.7` CreateNonEnumerableDataPropertyOrThrow ( O, P, V )
*07-abstract-operations.md*
> The abstract operation CreateNonEnumerableDataPropertyOrThrow takes arguments O (an Object), P (a property key), and V (an ECMAScript language value) and returns unused. It is used to create a new non-enumerable own property of an ordinary object. It performs the following steps when called:

## `7.3.8` DefinePropertyOrThrow ( O, P, desc )
*07-abstract-operations.md*
> The abstract operation DefinePropertyOrThrow takes arguments O (an Object), P (a property key), and desc (a Property Descriptor) and returns either a normal completion containing unused or a throw completion. It is used to call the [[DefineOwnProperty]] internal method of an object in a manner that will throw a TypeError exception if the requested property update cannot be performed. It performs the following steps when called:

## `7.3.9` DeletePropertyOrThrow ( O, P )
*07-abstract-operations.md*
> The abstract operation DeletePropertyOrThrow takes arguments O (an Object) and P (a property key) and returns either a normal completion containing unused or a throw completion. It is used to remove a specific own property of an object. It throws an exception if the property is not configurable. It performs the following steps when called:

## `7.3.10` GetMethod ( V, P )
*07-abstract-operations.md*
> The abstract operation GetMethod takes arguments V (an ECMAScript language value) and P (a property key) and returns either a normal completion containing either a function object or undefined, or a throw completion. It is used to get the value of a specific property of an ECMAScript language value when the value of the property is expected to be a function. It performs the following steps when called:

## `7.3.11` HasProperty ( O, P )
*07-abstract-operations.md*
> The abstract operation HasProperty takes arguments O (an Object) and P (a property key) and returns either a normal completion containing a Boolean or a throw completion. It is used to determine whether an object has a property with the specified property key. The property may be either own or inherited. It performs the following steps when called:

## `7.3.12` HasOwnProperty ( O, P )
*07-abstract-operations.md*
> The abstract operation HasOwnProperty takes arguments O (an Object) and P (a property key) and returns either a normal completion containing a Boolean or a throw completion. It is used to determine whether an object has an own property with the specified property key. It performs the following steps when called:

## `7.3.13` Call ( F, V \[ , argumentsList \] )
*07-abstract-operations.md*
> The abstract operation Call takes arguments F (an ECMAScript language value) and V (an ECMAScript language value) and optional argument argumentsList (a List of ECMAScript language values) and returns either a normal completion containing an ECMAScript language value or a throw completion. It is used to call the [[Call]] internal method of a function object. F is the function object, V is an ECMAScript language value that is the this value of the [[Call]], and argumentsList is the value passed to the corresponding argument of the internal method. If argumentsList is not present, a new empty List is used as its value. It performs the following steps when called:

## `7.3.14` Construct ( F \[ , argumentsList \[ , newTarget \] \] )
*07-abstract-operations.md*
> The abstract operation Construct takes argument F (a constructor) and optional arguments argumentsList (a List of ECMAScript language values) and newTarget (a constructor) and returns either a normal completion containing an Object or a throw completion. It is used to call the [[Construct]] internal method of a function object. argumentsList and newTarget are the values to be passed as the corresponding arguments of the internal method. If argumentsList is not present, a new empty List is used as its value. If newTarget is not present, F is used as its value. It performs the following steps when called:

## `7.3.15` SetIntegrityLevel ( O, level )
*07-abstract-operations.md*
> The abstract operation SetIntegrityLevel takes arguments O (an Object) and level (sealed or frozen) and returns either a normal completion containing a Boolean or a throw completion. It is used to fix the set of own properties of an object. It performs the following steps when called:

## `7.3.16` TestIntegrityLevel ( O, level )
*07-abstract-operations.md*
> The abstract operation TestIntegrityLevel takes arguments O (an Object) and level (sealed or frozen) and returns either a normal completion containing a Boolean or a throw completion. It is used to determine if the set of own properties of an object are fixed. It performs the following steps when called:

## `7.3.17` CreateArrayFromList ( elements )
*07-abstract-operations.md*
> The abstract operation CreateArrayFromList takes argument elements (a List of ECMAScript language values) and returns an Array. It is used to create an Array whose elements are provided by elements. It performs the following steps when called:

## `7.3.18` LengthOfArrayLike ( obj )
*07-abstract-operations.md*
> The abstract operation LengthOfArrayLike takes argument obj (an Object) and returns either a normal completion containing a non-negative integer or a throw completion. It returns the value of the "length" property of an array-like object. It performs the following steps when called:

## `7.3.19` CreateListFromArrayLike ( obj \[ , validElementTypes \] )
*07-abstract-operations.md*
> The abstract operation CreateListFromArrayLike takes argument obj (an ECMAScript language value) and optional argument validElementTypes (all or property-key) and returns either a normal completion containing a List of ECMAScript language values or a throw completion. It is used to create a List value whose elements are provided by the indexed properties of obj. validElementTypes indicates the types of values that are allowed as elements. It performs the following steps when called:

## `7.3.20` Invoke ( V, P \[ , argumentsList \] )
*07-abstract-operations.md*
> The abstract operation Invoke takes arguments V (an ECMAScript language value) and P (a property key) and optional argument argumentsList (a List of ECMAScript language values) and returns either a normal completion containing an ECMAScript language value or a throw completion. It is used to call a method property of an ECMAScript language value. V serves as both the lookup point for the property and the this value of the call. argumentsList is the list of arguments values passed to the method. If argumentsList is not present, a new empty List is used as its value. It performs the following steps when called:

## `7.3.21` OrdinaryHasInstance ( C, O )
*07-abstract-operations.md*
> The abstract operation OrdinaryHasInstance takes arguments C (an ECMAScript language value) and O (an ECMAScript language value) and returns either a normal completion containing a Boolean or a throw completion. It implements the default algorithm for determining if O inherits from the instance object inheritance path provided by C. It performs the following steps when called:

## `7.3.22` SpeciesConstructor ( O, defaultConstructor )
*07-abstract-operations.md*
> The abstract operation SpeciesConstructor takes arguments O (an Object) and defaultConstructor (a constructor) and returns either a normal completion containing a constructor or a throw completion. It is used to retrieve the constructor that should be used to create new objects that are derived from O. defaultConstructor is the constructor to use if a constructor %Symbol.species% property cannot be found starting from O. It performs the following steps when called:

## `7.3.23` EnumerableOwnProperties ( O, kind )
*07-abstract-operations.md*
> The abstract operation EnumerableOwnProperties takes arguments O (an Object) and kind (key, value, or key+value) and returns either a normal completion containing a List of ECMAScript language values or a throw completion. It performs the following steps when called:

## `7.3.24` GetFunctionRealm ( obj )
*07-abstract-operations.md*
> The abstract operation GetFunctionRealm takes argument obj (a function object) and returns either a normal completion containing a Realm Record or a throw completion. It performs the following steps when called:

## `7.3.25` CopyDataProperties ( target, source, excludedItems )
*07-abstract-operations.md*
> The abstract operation CopyDataProperties takes arguments target (an Object), source (an ECMAScript language value), and excludedItems (a List of property keys) and returns either a normal completion containing unused or a throw completion. It performs the following steps when called:

## `7.3.26` PrivateElementFind ( O, P )
*07-abstract-operations.md*
> The abstract operation PrivateElementFind takes arguments O (an Object) and P (a Private Name) and returns a PrivateElement or empty. It performs the following steps when called:

## `7.3.27` PrivateFieldAdd ( O, P, value )
*07-abstract-operations.md*
> The abstract operation PrivateFieldAdd takes arguments O (an Object), P (a Private Name), and value (an ECMAScript language value) and returns either a normal completion containing unused or a throw completion. It performs the following steps when called:

## `7.3.28` PrivateMethodOrAccessorAdd ( O, method )
*07-abstract-operations.md*
> The abstract operation PrivateMethodOrAccessorAdd takes arguments O (an Object) and method (a PrivateElement) and returns either a normal completion containing unused or a throw completion. It performs the following steps when called:

## `7.3.29` HostEnsureCanAddPrivateElement ( O )
*07-abstract-operations.md*
> The host-defined abstract operation HostEnsureCanAddPrivateElement takes argument O (an Object) and returns either a normal completion containing unused or a throw completion. It allows host environments to prevent the addition of private elements to particular host-defined exotic objects.

## `7.3.30` PrivateGet ( O, P )
*07-abstract-operations.md*
> The abstract operation PrivateGet takes arguments O (an Object) and P (a Private Name) and returns either a normal completion containing an ECMAScript language value or a throw completion. It performs the following steps when called:

## `7.3.31` PrivateSet ( O, P, value )
*07-abstract-operations.md*
> The abstract operation PrivateSet takes arguments O (an Object), P (a Private Name), and value (an ECMAScript language value) and returns either a normal completion containing unused or a throw completion. It performs the following steps when called:

## `7.3.32` DefineField ( receiver, fieldRecord )
*07-abstract-operations.md*
> The abstract operation DefineField takes arguments receiver (an Object) and fieldRecord (a ClassFieldDefinition Record) and returns either a normal completion containing unused or a throw completion. It performs the following steps when called:

## `7.3.33` InitializeInstanceElements ( O, constructor )
*07-abstract-operations.md*
> The abstract operation InitializeInstanceElements takes arguments O (an Object) and constructor (an ECMAScript function object) and returns either a normal completion containing unused or a throw completion. It performs the following steps when called:

## `7.3.34` AddValueToKeyedGroup ( groups, key, value )
*07-abstract-operations.md*
> The abstract operation AddValueToKeyedGroup takes arguments groups (a List of Records with fields [[Key]] (an ECMAScript language value) and [[Elements]] (a List of ECMAScript language values)), key (an ECMAScript language value), and value (an ECMAScript language value) and returns unused. It performs the following steps when called:

## `7.3.35` GroupBy ( items, callback, keyCoercion )
*07-abstract-operations.md*
> The abstract operation GroupBy takes arguments items (an ECMAScript language value), callback (an ECMAScript language value), and keyCoercion (property or collection) and returns either a normal completion containing a List of Records with fields [[Key]] (an ECMAScript language value) and [[Elements]] (a List of ECMAScript language values), or a throw completion. It performs the following steps when called:

## `7.3.36` SetterThatIgnoresPrototypeProperties ( thisValue, home, p, v )
*07-abstract-operations.md*
> The abstract operation SetterThatIgnoresPrototypeProperties takes arguments thisValue (an ECMAScript language value), home (an Object), p (a property key), and v (an ECMAScript language value) and returns either a normal completion containing unused or a throw completion. It performs the following steps when called:

## `7.4.2` GetIteratorDirect ( obj )
*07-abstract-operations.md*
> The abstract operation GetIteratorDirect takes argument obj (an Object) and returns either a normal completion containing an Iterator Record or a throw completion. It performs the following steps when called:

## `7.4.3` GetIteratorFromMethod ( obj, method )
*07-abstract-operations.md*
> The abstract operation GetIteratorFromMethod takes arguments obj (an ECMAScript language value) and method (a function object) and returns either a normal completion containing an Iterator Record or a throw completion. It performs the following steps when called:

## `7.4.4` GetIterator ( obj, kind )
*07-abstract-operations.md*
> The abstract operation GetIterator takes arguments obj (an ECMAScript language value) and kind (sync or async) and returns either a normal completion containing an Iterator Record or a throw completion. It performs the following steps when called:

## `7.4.5` GetIteratorFlattenable ( obj, primitiveHandling )
*07-abstract-operations.md*
> The abstract operation GetIteratorFlattenable takes arguments obj (an ECMAScript language value) and primitiveHandling (iterate-string-primitives or reject-primitives) and returns either a normal completion containing an Iterator Record or a throw completion. It performs the following steps when called:

## `7.4.6` IteratorNext ( iteratorRecord \[ , value \] )
*07-abstract-operations.md*
> The abstract operation IteratorNext takes argument iteratorRecord (an Iterator Record) and optional argument value (an ECMAScript language value) and returns either a normal completion containing an Object or a throw completion. It performs the following steps when called:

## `7.4.7` IteratorComplete ( iteratorResult )
*07-abstract-operations.md*
> The abstract operation IteratorComplete takes argument iteratorResult (an Object) and returns either a normal completion containing a Boolean or a throw completion. It performs the following steps when called:

## `7.4.8` IteratorValue ( iteratorResult )
*07-abstract-operations.md*
> The abstract operation IteratorValue takes argument iteratorResult (an Object) and returns either a normal completion containing an ECMAScript language value or a throw completion. It performs the following steps when called:

## `7.4.9` IteratorStep ( iteratorRecord )
*07-abstract-operations.md*
> The abstract operation IteratorStep takes argument iteratorRecord (an Iterator Record) and returns either a normal completion containing either an Object or done, or a throw completion. It requests the next value from iteratorRecord.[[Iterator]] by calling iteratorRecord.[[NextMethod]] and returns either done indicating that the iterator has reached its end or the IteratorResult object if a next value is available. It performs the following steps when called:

## `7.4.10` IteratorStepValue ( iteratorRecord )
*07-abstract-operations.md*
> The abstract operation IteratorStepValue takes argument iteratorRecord (an Iterator Record) and returns either a normal completion containing either an ECMAScript language value or done, or a throw completion. It requests the next value from iteratorRecord.[[Iterator]] by calling iteratorRecord.[[NextMethod]] and returns either done indicating that the iterator has reached its end or the value from the IteratorResult object if a next value is available. It performs the following steps when called:

## `7.4.11` IteratorClose ( iteratorRecord, completion )
*07-abstract-operations.md*
> The abstract operation IteratorClose takes arguments iteratorRecord (an Iterator Record) and completion (a Completion Record) and returns a Completion Record. It is used to notify an iterator that it should perform any actions it would normally perform when it has reached its completed state. It performs the following steps when called:

## `7.4.12` IfAbruptCloseIterator ( value, iteratorRecord )
*07-abstract-operations.md*
> IfAbruptCloseIterator is a shorthand for a sequence of algorithm steps that use an Iterator Record. An algorithm step of the form:

## `7.4.13` AsyncIteratorClose ( iteratorRecord, completion )
*07-abstract-operations.md*
> The abstract operation AsyncIteratorClose takes arguments iteratorRecord (an Iterator Record) and completion (a Completion Record) and returns a Completion Record. It is used to notify an async iterator that it should perform any actions it would normally perform when it has reached its completed state. It performs the following steps when called:

## `7.4.14` CreateIteratorResultObject ( value, done )
*07-abstract-operations.md*
> The abstract operation CreateIteratorResultObject takes arguments value (an ECMAScript language value) and done (a Boolean) and returns an Object that conforms to the IteratorResult interface. It creates an object that conforms to the IteratorResult interface. It performs the following steps when called:

## `7.4.15` CreateListIteratorRecord ( list )
*07-abstract-operations.md*
> The abstract operation CreateListIteratorRecord takes argument list (a List of ECMAScript language values) and returns an Iterator Record. It creates an Iterator Record whose [[NextMethod]] returns the successive elements of list. It performs the following steps when called:

## `7.4.16` IteratorToList ( iteratorRecord )
*07-abstract-operations.md*
> The abstract operation IteratorToList takes argument iteratorRecord (an Iterator Record) and returns either a normal completion containing a List of ECMAScript language values or a throw completion. It performs the following steps when called:

## `8.4.3` Static Semantics: IsAnonymousFunctionDefinition ( expr )
*08-syntax-directed-operations.md*
> The abstract operation IsAnonymousFunctionDefinition takes argument expr (an AssignmentExpression Parse Node, an Initializer Parse Node, or an Expression Parse Node) and returns a Boolean. It determines if its argument is a function definition that does not bind a name. It performs the following steps when called:

## `8.6.2.1` InitializeBoundName ( name, value, environment )
*08-syntax-directed-operations.md*
> The abstract operation InitializeBoundName takes arguments name (a String), value (an ECMAScript language value), and environment (an Environment Record or undefined) and returns either a normal completion containing unused or an abrupt completion. It performs the following steps when called:

## `9.1.1.1.1` HasBinding ( N )
*09-executable-code-and-execution-contexts.md*
> The HasBinding concrete method of a Declarative Environment Record envRec takes argument N (a String) and returns a normal completion containing a Boolean. It determines if the argument identifier is one of the identifiers bound by the record. It performs the following steps when called:

## `9.1.1.1.2` CreateMutableBinding ( N, D )
*09-executable-code-and-execution-contexts.md*
> The CreateMutableBinding concrete method of a Declarative Environment Record envRec takes arguments N (a String) and D (a Boolean) and returns a normal completion containing unused. It creates a new mutable binding for the name N that is uninitialized. A binding must not already exist in this Environment Record for N. If D is true, the new binding is marked as being subject to deletion. It performs the following steps when called:

## `9.1.1.1.3` CreateImmutableBinding ( N, S )
*09-executable-code-and-execution-contexts.md*
> The CreateImmutableBinding concrete method of a Declarative Environment Record envRec takes arguments N (a String) and S (a Boolean) and returns a normal completion containing unused. It creates a new immutable binding for the name N that is uninitialized. A binding must not already exist in this Environment Record for N. If S is true, the new binding is marked as a strict binding. It performs the following steps when called:

## `9.1.1.1.4` InitializeBinding ( N, V )
*09-executable-code-and-execution-contexts.md*
> The InitializeBinding concrete method of a Declarative Environment Record envRec takes arguments N (a String) and V (an ECMAScript language value) and returns a normal completion containing unused. It is used to set the bound value of the current binding of the identifier whose name is N to the value V. An uninitialized binding for N must already exist. It performs the following steps when called:

## `9.1.1.1.5` SetMutableBinding ( N, V, S )
*09-executable-code-and-execution-contexts.md*
> The SetMutableBinding concrete method of a Declarative Environment Record envRec takes arguments N (a String), V (an ECMAScript language value), and S (a Boolean) and returns either a normal completion containing unused or a throw completion. It attempts to change the bound value of the current binding of the identifier whose name is N to the value V. A binding for N normally already exists, but in rare cases it may not. If the binding is an immutable binding, a TypeError is thrown if S is true. It performs the following steps when called:

## `9.1.1.1.6` GetBindingValue ( N, S )
*09-executable-code-and-execution-contexts.md*
> The GetBindingValue concrete method of a Declarative Environment Record envRec takes arguments N (a String) and S (a Boolean) and returns either a normal completion containing an ECMAScript language value or a throw completion. It returns the value of its bound identifier whose name is N. If the binding exists but is uninitialized a ReferenceError is thrown, regardless of the value of S. It performs the following steps when called:

## `9.1.1.1.7` DeleteBinding ( N )
*09-executable-code-and-execution-contexts.md*
> The DeleteBinding concrete method of a Declarative Environment Record envRec takes argument N (a String) and returns a normal completion containing a Boolean. It can only delete bindings that have been explicitly designated as being subject to deletion. It performs the following steps when called:

## `9.1.1.1.8` HasThisBinding (  )
*09-executable-code-and-execution-contexts.md*
> The HasThisBinding concrete method of a Declarative Environment Record envRec takes no arguments and returns false. It performs the following steps when called:

## `9.1.1.1.9` HasSuperBinding (  )
*09-executable-code-and-execution-contexts.md*
> The HasSuperBinding concrete method of a Declarative Environment Record envRec takes no arguments and returns false. It performs the following steps when called:

## `9.1.1.1.10` WithBaseObject (  )
*09-executable-code-and-execution-contexts.md*
> The WithBaseObject concrete method of a Declarative Environment Record envRec takes no arguments and returns undefined. It performs the following steps when called:

## `9.1.1.2.1` HasBinding ( N )
*09-executable-code-and-execution-contexts.md*
> The HasBinding concrete method of an Object Environment Record envRec takes argument N (a String) and returns either a normal completion containing a Boolean or a throw completion. It determines if its associated binding object has a property whose name is N. It performs the following steps when called:

## `9.1.1.2.2` CreateMutableBinding ( N, D )
*09-executable-code-and-execution-contexts.md*
> The CreateMutableBinding concrete method of an Object Environment Record envRec takes arguments N (a String) and D (a Boolean) and returns either a normal completion containing unused or a throw completion. It creates in an Environment Record's associated binding object a property whose name is N and initializes it to the value undefined. If D is true, the new property's [[Configurable]] attribute is set to true; otherwise it is set to false. It performs the following steps when called:

## `9.1.1.2.3` CreateImmutableBinding ( N, S )
*09-executable-code-and-execution-contexts.md*
> The CreateImmutableBinding concrete method of an Object Environment Record is never used within this specification.

## `9.1.1.2.4` InitializeBinding ( N, V )
*09-executable-code-and-execution-contexts.md*
> The InitializeBinding concrete method of an Object Environment Record envRec takes arguments N (a String) and V (an ECMAScript language value) and returns either a normal completion containing unused or a throw completion. It is used to set the bound value of the current binding of the identifier whose name is N to the value V. It performs the following steps when called:

## `9.1.1.2.5` SetMutableBinding ( N, V, S )
*09-executable-code-and-execution-contexts.md*
> The SetMutableBinding concrete method of an Object Environment Record envRec takes arguments N (a String), V (an ECMAScript language value), and S (a Boolean) and returns either a normal completion containing unused or a throw completion. It attempts to set the value of the Environment Record's associated binding object's property whose name is N to the value V. A property named N normally already exists but if it does not or is not currently writable, error handling is determined by S. It performs the following steps when called:

## `9.1.1.2.6` GetBindingValue ( N, S )
*09-executable-code-and-execution-contexts.md*
> The GetBindingValue concrete method of an Object Environment Record envRec takes arguments N (a String) and S (a Boolean) and returns either a normal completion containing an ECMAScript language value or a throw completion. It returns the value of its associated binding object's property whose name is N. The property should already exist but if it does not the result depends upon S. It performs the following steps when called:

## `9.1.1.2.7` DeleteBinding ( N )
*09-executable-code-and-execution-contexts.md*
> The DeleteBinding concrete method of an Object Environment Record envRec takes argument N (a String) and returns either a normal completion containing a Boolean or a throw completion. It can only delete bindings that correspond to properties of the environment object whose [[Configurable]] attribute have the value true. It performs the following steps when called:

## `9.1.1.2.8` HasThisBinding (  )
*09-executable-code-and-execution-contexts.md*
> The HasThisBinding concrete method of an Object Environment Record envRec takes no arguments and returns false. It performs the following steps when called:

## `9.1.1.2.9` HasSuperBinding (  )
*09-executable-code-and-execution-contexts.md*
> The HasSuperBinding concrete method of an Object Environment Record envRec takes no arguments and returns false. It performs the following steps when called:

## `9.1.1.2.10` WithBaseObject (  )
*09-executable-code-and-execution-contexts.md*
> The WithBaseObject concrete method of an Object Environment Record envRec takes no arguments and returns an Object or undefined. It performs the following steps when called:

## `9.1.1.3.1` BindThisValue ( envRec, V )
*09-executable-code-and-execution-contexts.md*
> The abstract operation BindThisValue takes arguments envRec (a Function Environment Record) and V (an ECMAScript language value) and returns either a normal completion containing unused or a throw completion. It sets the envRec.[[ThisValue]] and records that it has been initialized. It performs the following steps when called:

## `9.1.1.3.2` HasThisBinding (  )
*09-executable-code-and-execution-contexts.md*
> The HasThisBinding concrete method of a Function Environment Record envRec takes no arguments and returns a Boolean. It performs the following steps when called:

## `9.1.1.3.3` HasSuperBinding (  )
*09-executable-code-and-execution-contexts.md*
> The HasSuperBinding concrete method of a Function Environment Record envRec takes no arguments and returns a Boolean. It performs the following steps when called:

## `9.1.1.3.4` GetThisBinding (  )
*09-executable-code-and-execution-contexts.md*
> The GetThisBinding concrete method of a Function Environment Record envRec takes no arguments and returns either a normal completion containing an ECMAScript language value or a throw completion. It performs the following steps when called:

## `9.1.1.3.5` GetSuperBase ( envRec )
*09-executable-code-and-execution-contexts.md*
> The abstract operation GetSuperBase takes argument envRec (a Function Environment Record) and returns an Object, null, or undefined. It returns the object that is the base for super property accesses bound in envRec. The value undefined indicates that such accesses will produce runtime errors. It performs the following steps when called:

## `9.1.1.4.1` HasBinding ( N )
*09-executable-code-and-execution-contexts.md*
> The HasBinding concrete method of a Global Environment Record envRec takes argument N (a String) and returns either a normal completion containing a Boolean or a throw completion. It determines if the argument identifier is one of the identifiers bound by the record. It performs the following steps when called:

## `9.1.1.4.2` CreateMutableBinding ( N, D )
*09-executable-code-and-execution-contexts.md*
> The CreateMutableBinding concrete method of a Global Environment Record envRec takes arguments N (a String) and D (a Boolean) and returns either a normal completion containing unused or a throw completion. It creates a new mutable binding for the name N that is uninitialized. The binding is created in the associated DeclarativeRecord. A binding for N must not already exist in the DeclarativeRecord. If D is true, the new binding is marked as being subject to deletion. It performs the following steps when called:

## `9.1.1.4.3` CreateImmutableBinding ( N, S )
*09-executable-code-and-execution-contexts.md*
> The CreateImmutableBinding concrete method of a Global Environment Record envRec takes arguments N (a String) and S (a Boolean) and returns either a normal completion containing unused or a throw completion. It creates a new immutable binding for the name N that is uninitialized. A binding must not already exist in this Environment Record for N. If S is true, the new binding is marked as a strict binding. It performs the following steps when called:

## `9.1.1.4.4` InitializeBinding ( N, V )
*09-executable-code-and-execution-contexts.md*
> The InitializeBinding concrete method of a Global Environment Record envRec takes arguments N (a String) and V (an ECMAScript language value) and returns either a normal completion containing unused or a throw completion. It is used to set the bound value of the current binding of the identifier whose name is N to the value V. An uninitialized binding for N must already exist. It performs the following steps when called:

## `9.1.1.4.5` SetMutableBinding ( N, V, S )
*09-executable-code-and-execution-contexts.md*
> The SetMutableBinding concrete method of a Global Environment Record envRec takes arguments N (a String), V (an ECMAScript language value), and S (a Boolean) and returns either a normal completion containing unused or a throw completion. It attempts to change the bound value of the current binding of the identifier whose name is N to the value V. If the binding is an immutable binding and S is true, a TypeError is thrown. A property named N normally already exists but if it does not or is not currently writable, error handling is determined by S. It performs the following steps when called:

## `9.1.1.4.6` GetBindingValue ( N, S )
*09-executable-code-and-execution-contexts.md*
> The GetBindingValue concrete method of a Global Environment Record envRec takes arguments N (a String) and S (a Boolean) and returns either a normal completion containing an ECMAScript language value or a throw completion. It returns the value of its bound identifier whose name is N. If the binding is an uninitialized binding throw a ReferenceError exception. A property named N normally already exists but if it does not or is not currently writable, error handling is determined by S. It performs the following steps when called:

## `9.1.1.4.7` DeleteBinding ( N )
*09-executable-code-and-execution-contexts.md*
> The DeleteBinding concrete method of a Global Environment Record envRec takes argument N (a String) and returns either a normal completion containing a Boolean or a throw completion. It can only delete bindings that have been explicitly designated as being subject to deletion. It performs the following steps when called:

## `9.1.1.4.8` HasThisBinding (  )
*09-executable-code-and-execution-contexts.md*
> The HasThisBinding concrete method of a Global Environment Record envRec takes no arguments and returns true. It performs the following steps when called:

## `9.1.1.4.9` HasSuperBinding (  )
*09-executable-code-and-execution-contexts.md*
> The HasSuperBinding concrete method of a Global Environment Record envRec takes no arguments and returns false. It performs the following steps when called:

## `9.1.1.4.10` WithBaseObject (  )
*09-executable-code-and-execution-contexts.md*
> The WithBaseObject concrete method of a Global Environment Record envRec takes no arguments and returns undefined. It performs the following steps when called:

## `9.1.1.4.11` GetThisBinding (  )
*09-executable-code-and-execution-contexts.md*
> The GetThisBinding concrete method of a Global Environment Record envRec takes no arguments and returns a normal completion containing an Object. It performs the following steps when called:

## `9.1.1.4.12` HasLexicalDeclaration ( envRec, N )
*09-executable-code-and-execution-contexts.md*
> The abstract operation HasLexicalDeclaration takes arguments envRec (a Global Environment Record) and N (a String) and returns a Boolean. It determines if the argument identifier has a binding in envRec that was created using a lexical declaration such as a LexicalDeclaration or a ClassDeclaration. It performs the following steps when called:

## `9.1.1.4.13` HasRestrictedGlobalProperty ( envRec, N )
*09-executable-code-and-execution-contexts.md*
> The abstract operation HasRestrictedGlobalProperty takes arguments envRec (a Global Environment Record) and N (a String) and returns either a normal completion containing a Boolean or a throw completion. It determines if the argument identifier is the name of a property of the global object that must not be shadowed by a global lexical binding. It performs the following steps when called:

## `9.1.1.4.14` CanDeclareGlobalVar ( envRec, N )
*09-executable-code-and-execution-contexts.md*
> The abstract operation CanDeclareGlobalVar takes arguments envRec (a Global Environment Record) and N (a String) and returns either a normal completion containing a Boolean or a throw completion. It determines if a corresponding CreateGlobalVarBinding call would succeed if called for the same argument N. Redundant var declarations and var declarations for pre-existing global object properties are allowed. It performs the following steps when called:

## `9.1.1.4.15` CanDeclareGlobalFunction ( envRec, N )
*09-executable-code-and-execution-contexts.md*
> The abstract operation CanDeclareGlobalFunction takes arguments envRec (a Global Environment Record) and N (a String) and returns either a normal completion containing a Boolean or a throw completion. It determines if a corresponding CreateGlobalFunctionBinding call would succeed if called for the same argument N. It performs the following steps when called:

## `9.1.1.4.16` CreateGlobalVarBinding ( envRec, N, D )
*09-executable-code-and-execution-contexts.md*
> The abstract operation CreateGlobalVarBinding takes arguments envRec (a Global Environment Record), N (a String), and D (a Boolean) and returns either a normal completion containing unused or a throw completion. It creates and initializes a mutable binding in the associated Object Environment Record. If a binding already exists, it is reused and assumed to be initialized. It performs the following steps when called:

## `9.1.1.4.17` CreateGlobalFunctionBinding ( envRec, N, V, D )
*09-executable-code-and-execution-contexts.md*
> The abstract operation CreateGlobalFunctionBinding takes arguments envRec (a Global Environment Record), N (a String), V (an ECMAScript language value), and D (a Boolean) and returns either a normal completion containing unused or a throw completion. It creates and initializes a mutable binding in the associated Object Environment Record. If a binding already exists, it is replaced. It performs the following steps when called:

## `9.1.1.5.1` GetBindingValue ( N, S )
*09-executable-code-and-execution-contexts.md*
> The GetBindingValue concrete method of a Module Environment Record envRec takes arguments N (a String) and S (a Boolean) and returns either a normal completion containing an ECMAScript language value or a throw completion. It returns the value of its bound identifier whose name is N. However, if the binding is an indirect binding the value of the target binding is returned. If the binding exists but is uninitialized a ReferenceError is thrown. It performs the following steps when called:

## `9.1.1.5.2` DeleteBinding ( N )
*09-executable-code-and-execution-contexts.md*
> The DeleteBinding concrete method of a Module Environment Record is never used within this specification.

## `9.1.1.5.3` HasThisBinding (  )
*09-executable-code-and-execution-contexts.md*
> The HasThisBinding concrete method of a Module Environment Record envRec takes no arguments and returns true. It performs the following steps when called:

## `9.1.1.5.4` GetThisBinding (  )
*09-executable-code-and-execution-contexts.md*
> The GetThisBinding concrete method of a Module Environment Record envRec takes no arguments and returns a normal completion containing undefined. It performs the following steps when called:

## `9.1.1.5.5` CreateImportBinding ( envRec, N, M, N2 )
*09-executable-code-and-execution-contexts.md*
> The abstract operation CreateImportBinding takes arguments envRec (a Module Environment Record), N (a String), M (a Module Record), and N2 (a String) and returns unused. It creates a new initialized immutable indirect binding for the name N. A binding must not already exist in envRec for N. N2 is the name of a binding that exists in M's Module Environment Record. Accesses to the value of the new binding will indirectly access the bound value of the target binding. It performs the following steps when called:

## `9.1.2.1` GetIdentifierReference ( env, name, strict )
*09-executable-code-and-execution-contexts.md*
> The abstract operation GetIdentifierReference takes arguments env (an Environment Record or null), name (a String), and strict (a Boolean) and returns either a normal completion containing a Reference Record or a throw completion. It performs the following steps when called:

## `9.1.2.2` NewDeclarativeEnvironment ( E )
*09-executable-code-and-execution-contexts.md*
> The abstract operation NewDeclarativeEnvironment takes argument E (an Environment Record or null) and returns a Declarative Environment Record. It performs the following steps when called:

## `9.1.2.3` NewObjectEnvironment ( O, W, E )
*09-executable-code-and-execution-contexts.md*
> The abstract operation NewObjectEnvironment takes arguments O (an Object), W (a Boolean), and E (an Environment Record or null) and returns an Object Environment Record. It performs the following steps when called:

## `9.1.2.4` NewFunctionEnvironment ( F, newTarget )
*09-executable-code-and-execution-contexts.md*
> The abstract operation NewFunctionEnvironment takes arguments F (an ECMAScript function object) and newTarget (an Object or undefined) and returns a Function Environment Record. It performs the following steps when called:

## `9.1.2.5` NewGlobalEnvironment ( G, thisValue )
*09-executable-code-and-execution-contexts.md*
> The abstract operation NewGlobalEnvironment takes arguments G (an Object) and thisValue (an Object) and returns a Global Environment Record. It performs the following steps when called:

## `9.1.2.6` NewModuleEnvironment ( E )
*09-executable-code-and-execution-contexts.md*
> The abstract operation NewModuleEnvironment takes argument E (an Environment Record) and returns a Module Environment Record. It performs the following steps when called:

## `9.2.1.1` NewPrivateEnvironment ( outerPrivateEnv )
*09-executable-code-and-execution-contexts.md*
> The abstract operation NewPrivateEnvironment takes argument outerPrivateEnv (a PrivateEnvironment Record or null) and returns a PrivateEnvironment Record. It performs the following steps when called:

## `9.2.1.2` ResolvePrivateIdentifier ( privateEnv, identifier )
*09-executable-code-and-execution-contexts.md*
> The abstract operation ResolvePrivateIdentifier takes arguments privateEnv (a PrivateEnvironment Record) and identifier (a String) and returns a Private Name. It performs the following steps when called:

## `9.3.1` InitializeHostDefinedRealm (  )
*09-executable-code-and-execution-contexts.md*
> The abstract operation InitializeHostDefinedRealm takes no arguments and returns either a normal completion containing unused or a throw completion. It performs the following steps when called:

## `9.3.2` CreateIntrinsics ( realmRec )
*09-executable-code-and-execution-contexts.md*
> The abstract operation CreateIntrinsics takes argument realmRec (a Realm Record) and returns unused. It performs the following steps when called:

## `9.3.3` SetDefaultGlobalBindings ( realmRec )
*09-executable-code-and-execution-contexts.md*
> The abstract operation SetDefaultGlobalBindings takes argument realmRec (a Realm Record) and returns either a normal completion containing unused or a throw completion. It performs the following steps when called:

## `9.4.1` GetActiveScriptOrModule (  )
*09-executable-code-and-execution-contexts.md*
> The abstract operation GetActiveScriptOrModule takes no arguments and returns a Script Record, a Module Record, or null. It is used to determine the running script or module, based on the running execution context. It performs the following steps when called:

## `9.4.2` ResolveBinding ( name \[ , env \] )
*09-executable-code-and-execution-contexts.md*
> The abstract operation ResolveBinding takes argument name (a String) and optional argument env (an Environment Record or undefined) and returns either a normal completion containing a Reference Record or a throw completion. It is used to determine the binding of name. env can be used to explicitly provide the Environment Record that is to be searched for the binding. It performs the following steps when called:

## `9.4.3` GetThisEnvironment (  )
*09-executable-code-and-execution-contexts.md*
> The abstract operation GetThisEnvironment takes no arguments and returns an Environment Record. It finds the Environment Record that currently supplies the binding of the keyword this. It performs the following steps when called:

## `9.4.4` ResolveThisBinding (  )
*09-executable-code-and-execution-contexts.md*
> The abstract operation ResolveThisBinding takes no arguments and returns either a normal completion containing an ECMAScript language value or a throw completion. It determines the binding of the keyword this using the LexicalEnvironment of the running execution context. It performs the following steps when called:

## `9.4.5` GetNewTarget (  )
*09-executable-code-and-execution-contexts.md*
> The abstract operation GetNewTarget takes no arguments and returns an Object or undefined. It determines the NewTarget value using the LexicalEnvironment of the running execution context. It performs the following steps when called:

## `9.4.6` GetGlobalObject (  )
*09-executable-code-and-execution-contexts.md*
> The abstract operation GetGlobalObject takes no arguments and returns an Object. It returns the global object used by the currently running execution context. It performs the following steps when called:

## `9.5.2` HostMakeJobCallback ( callback )
*09-executable-code-and-execution-contexts.md*
> The host-defined abstract operation HostMakeJobCallback takes argument callback (a function object) and returns a JobCallback Record.

## `9.5.3` HostCallJobCallback ( jobCallback, V, argumentsList )
*09-executable-code-and-execution-contexts.md*
> The host-defined abstract operation HostCallJobCallback takes arguments jobCallback (a JobCallback Record), V (an ECMAScript language value), and argumentsList (a List of ECMAScript language values) and returns either a normal completion containing an ECMAScript language value or a throw completion.

## `9.5.4` HostEnqueueGenericJob ( job, realm )
*09-executable-code-and-execution-contexts.md*
> The host-defined abstract operation HostEnqueueGenericJob takes arguments job (a Job Abstract Closure) and realm (a Realm Record) and returns unused. It schedules job in the realm realm in the agent signified by realm.[[AgentSignifier]] to be performed at some future time. The Abstract Closures used with this algorithm are intended to be scheduled without additional constraints, such as priority and ordering.

## `9.5.5` HostEnqueuePromiseJob ( job, realm )
*09-executable-code-and-execution-contexts.md*
> The host-defined abstract operation HostEnqueuePromiseJob takes arguments job (a Job Abstract Closure) and realm (a Realm Record or null) and returns unused. It schedules job to be performed at some future time. The Abstract Closures used with this algorithm are intended to be related to the handling of Promises, or otherwise, to be scheduled with equal priority to Promise handling operations.

## `9.5.6` HostEnqueueTimeoutJob ( timeoutJob, realm, milliseconds )
*09-executable-code-and-execution-contexts.md*
> The host-defined abstract operation HostEnqueueTimeoutJob takes arguments timeoutJob (a Job Abstract Closure), realm (a Realm Record), and milliseconds (a non-negative finite Number) and returns unused. It schedules timeoutJob in the realm realm in the agent signified by realm.[[AgentSignifier]] to be performed after at least milliseconds milliseconds.

## `9.6.1` AgentSignifier (  )
*09-executable-code-and-execution-contexts.md*
> The abstract operation AgentSignifier takes no arguments and returns an agent signifier. It performs the following steps when called:

## `9.6.2` AgentCanSuspend (  )
*09-executable-code-and-execution-contexts.md*
> The abstract operation AgentCanSuspend takes no arguments and returns a Boolean. It performs the following steps when called:

## `9.6.3` IncrementModuleAsyncEvaluationCount (  )
*09-executable-code-and-execution-contexts.md*
> The abstract operation IncrementModuleAsyncEvaluationCount takes no arguments and returns an integer. It performs the following steps when called:

## `9.9.4.1` HostEnqueueFinalizationRegistryCleanupJob ( finalizationRegistry )
*09-executable-code-and-execution-contexts.md*
> The host-defined abstract operation HostEnqueueFinalizationRegistryCleanupJob takes argument finalizationRegistry (a FinalizationRegistry) and returns unused.

## `9.10` ClearKeptObjects (  )
*09-executable-code-and-execution-contexts.md*
> The abstract operation ClearKeptObjects takes no arguments and returns unused. ECMAScript implementations are expected to call ClearKeptObjects when a synchronous sequence of ECMAScript executions completes. It performs the following steps when called:

## `9.11` AddToKeptObjects ( value )
*09-executable-code-and-execution-contexts.md*
> The abstract operation AddToKeptObjects takes argument value (an Object or a Symbol) and returns unused. It performs the following steps when called:

## `9.12` CleanupFinalizationRegistry ( finalizationRegistry )
*09-executable-code-and-execution-contexts.md*
> The abstract operation CleanupFinalizationRegistry takes argument finalizationRegistry (a FinalizationRegistry) and returns either a normal completion containing unused or a throw completion. It performs the following steps when called:

## `9.13` CanBeHeldWeakly ( v )
*09-executable-code-and-execution-contexts.md*
> The abstract operation CanBeHeldWeakly takes argument v (an ECMAScript language value) and returns a Boolean. It returns true if and only if v is suitable for use as a weak reference. Only values that are suitable for use as a weak reference may be a key of a WeakMap, an element of a WeakSet, the target of a WeakRef, or one of the targets of a FinalizationRegistry. It performs the following steps when called:

## `10.1.1` [[GetPrototypeOf]] (  )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[GetPrototypeOf]] internal method of an ordinary object O takes no arguments and returns a normal completion containing either an Object or null. It performs the following steps when called:

## `10.1.1.1` OrdinaryGetPrototypeOf ( O )
*10-ordinary-and-exotic-objects-behaviours.md*
> The abstract operation OrdinaryGetPrototypeOf takes argument O (an Object) and returns an Object or null. It performs the following steps when called:

## `10.1.2` [[SetPrototypeOf]] ( V )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[SetPrototypeOf]] internal method of an ordinary object O takes argument V (an Object or null) and returns a normal completion containing a Boolean. It performs the following steps when called:

## `10.1.2.1` OrdinarySetPrototypeOf ( O, V )
*10-ordinary-and-exotic-objects-behaviours.md*
> The abstract operation OrdinarySetPrototypeOf takes arguments O (an Object) and V (an Object or null) and returns a Boolean. It performs the following steps when called:

## `10.1.3` [[IsExtensible]] (  )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[IsExtensible]] internal method of an ordinary object O takes no arguments and returns a normal completion containing a Boolean. It performs the following steps when called:

## `10.1.3.1` OrdinaryIsExtensible ( O )
*10-ordinary-and-exotic-objects-behaviours.md*
> The abstract operation OrdinaryIsExtensible takes argument O (an Object) and returns a Boolean. It performs the following steps when called:

## `10.1.4` [[PreventExtensions]] (  )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[PreventExtensions]] internal method of an ordinary object O takes no arguments and returns a normal completion containing true. It performs the following steps when called:

## `10.1.4.1` OrdinaryPreventExtensions ( O )
*10-ordinary-and-exotic-objects-behaviours.md*
> The abstract operation OrdinaryPreventExtensions takes argument O (an Object) and returns true. It performs the following steps when called:

## `10.1.5` [[GetOwnProperty]] ( P )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[GetOwnProperty]] internal method of an ordinary object O takes argument P (a property key) and returns a normal completion containing either a Property Descriptor or undefined. It performs the following steps when called:

## `10.1.5.1` OrdinaryGetOwnProperty ( O, P )
*10-ordinary-and-exotic-objects-behaviours.md*
> The abstract operation OrdinaryGetOwnProperty takes arguments O (an Object) and P (a property key) and returns a Property Descriptor or undefined. It performs the following steps when called:

## `10.1.6` [[DefineOwnProperty]] ( P, Desc )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[DefineOwnProperty]] internal method of an ordinary object O takes arguments P (a property key) and Desc (a Property Descriptor) and returns either a normal completion containing a Boolean or a throw completion. It performs the following steps when called:

## `10.1.6.1` OrdinaryDefineOwnProperty ( O, P, Desc )
*10-ordinary-and-exotic-objects-behaviours.md*
> The abstract operation OrdinaryDefineOwnProperty takes arguments O (an Object), P (a property key), and Desc (a Property Descriptor) and returns either a normal completion containing a Boolean or a throw completion. It performs the following steps when called:

## `10.1.6.2` IsCompatiblePropertyDescriptor ( Extensible, Desc, Current )
*10-ordinary-and-exotic-objects-behaviours.md*
> The abstract operation IsCompatiblePropertyDescriptor takes arguments Extensible (a Boolean), Desc (a Property Descriptor), and Current (a Property Descriptor or undefined) and returns a Boolean. It performs the following steps when called:

## `10.1.6.3` ValidateAndApplyPropertyDescriptor ( O, P, extensible, Desc, current )
*10-ordinary-and-exotic-objects-behaviours.md*
> The abstract operation ValidateAndApplyPropertyDescriptor takes arguments O (an Object or undefined), P (a property key), extensible (a Boolean), Desc (a Property Descriptor), and current (a Property Descriptor or undefined) and returns a Boolean. It returns true if and only if Desc can be applied as the property of an object with specified extensibility and current property current while upholding invariants. When such application is possible and O is not undefined, it is performed for the property named P (which is created if necessary). It performs the following steps when called:

## `10.1.7` [[HasProperty]] ( P )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[HasProperty]] internal method of an ordinary object O takes argument P (a property key) and returns either a normal completion containing a Boolean or a throw completion. It performs the following steps when called:

## `10.1.7.1` OrdinaryHasProperty ( O, P )
*10-ordinary-and-exotic-objects-behaviours.md*
> The abstract operation OrdinaryHasProperty takes arguments O (an Object) and P (a property key) and returns either a normal completion containing a Boolean or a throw completion. It performs the following steps when called:

## `10.1.8` [[Get]] ( P, Receiver )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[Get]] internal method of an ordinary object O takes arguments P (a property key) and Receiver (an ECMAScript language value) and returns either a normal completion containing an ECMAScript language value or a throw completion. It performs the following steps when called:

## `10.1.8.1` OrdinaryGet ( O, P, Receiver )
*10-ordinary-and-exotic-objects-behaviours.md*
> The abstract operation OrdinaryGet takes arguments O (an Object), P (a property key), and Receiver (an ECMAScript language value) and returns either a normal completion containing an ECMAScript language value or a throw completion. It performs the following steps when called:

## `10.1.9` [[Set]] ( P, V, Receiver )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[Set]] internal method of an ordinary object O takes arguments P (a property key), V (an ECMAScript language value), and Receiver (an ECMAScript language value) and returns either a normal completion containing a Boolean or a throw completion. It performs the following steps when called:

## `10.1.9.1` OrdinarySet ( O, P, V, Receiver )
*10-ordinary-and-exotic-objects-behaviours.md*
> The abstract operation OrdinarySet takes arguments O (an Object), P (a property key), V (an ECMAScript language value), and Receiver (an ECMAScript language value) and returns either a normal completion containing a Boolean or a throw completion. It performs the following steps when called:

## `10.1.9.2` OrdinarySetWithOwnDescriptor ( O, P, V, Receiver, ownDesc )
*10-ordinary-and-exotic-objects-behaviours.md*
> The abstract operation OrdinarySetWithOwnDescriptor takes arguments O (an Object), P (a property key), V (an ECMAScript language value), Receiver (an ECMAScript language value), and ownDesc (a Property Descriptor or undefined) and returns either a normal completion containing a Boolean or a throw completion. It performs the following steps when called:

## `10.1.10` [[Delete]] ( P )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[Delete]] internal method of an ordinary object O takes argument P (a property key) and returns either a normal completion containing a Boolean or a throw completion. It performs the following steps when called:

## `10.1.10.1` OrdinaryDelete ( O, P )
*10-ordinary-and-exotic-objects-behaviours.md*
> The abstract operation OrdinaryDelete takes arguments O (an Object) and P (a property key) and returns either a normal completion containing a Boolean or a throw completion. It performs the following steps when called:

## `10.1.11` [[OwnPropertyKeys]] (  )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[OwnPropertyKeys]] internal method of an ordinary object O takes no arguments and returns a normal completion containing a List of property keys. It performs the following steps when called:

## `10.1.11.1` OrdinaryOwnPropertyKeys ( O )
*10-ordinary-and-exotic-objects-behaviours.md*
> The abstract operation OrdinaryOwnPropertyKeys takes argument O (an Object) and returns a List of property keys. It performs the following steps when called:

## `10.1.12` OrdinaryObjectCreate ( proto \[ , additionalInternalSlotsList \] )
*10-ordinary-and-exotic-objects-behaviours.md*
> The abstract operation OrdinaryObjectCreate takes argument proto (an Object or null) and optional argument additionalInternalSlotsList (a List of names of internal slots) and returns an Object. It is used to specify the runtime creation of new ordinary objects. additionalInternalSlotsList contains the names of additional internal slots that must be defined as part of the object, beyond [[Prototype]] and [[Extensible]]. If additionalInternalSlotsList is not provided, a new empty List is used. It performs the following steps when called:

## `10.1.13` OrdinaryCreateFromConstructor ( constructor, intrinsicDefaultProto \[ , internalSlotsList \] )
*10-ordinary-and-exotic-objects-behaviours.md*
> The abstract operation OrdinaryCreateFromConstructor takes arguments constructor (a function object) and intrinsicDefaultProto (a String) and optional argument internalSlotsList (a List of names of internal slots) and returns either a normal completion containing an Object or a throw completion. It creates an ordinary object whose [[Prototype]] value is retrieved from a constructor's "prototype" property, if it exists. Otherwise the intrinsic named by intrinsicDefaultProto is used for [[Prototype]]. internalSlotsList contains the names of additional internal slots that must be defined as part of the object. If internalSlotsList is not provided, a new empty List is used. It performs the following steps when called:

## `10.1.14` GetPrototypeFromConstructor ( constructor, intrinsicDefaultProto )
*10-ordinary-and-exotic-objects-behaviours.md*
> The abstract operation GetPrototypeFromConstructor takes arguments constructor (a function object) and intrinsicDefaultProto (a String) and returns either a normal completion containing an Object or a throw completion. It determines the [[Prototype]] value that should be used to create an object corresponding to a specific constructor. The value is retrieved from the constructor's "prototype" property, if it exists. Otherwise the intrinsic named by intrinsicDefaultProto is used for [[Prototype]]. It performs the following steps when called:

## `10.1.15` RequireInternalSlot ( O, internalSlot )
*10-ordinary-and-exotic-objects-behaviours.md*
> The abstract operation RequireInternalSlot takes arguments O (an ECMAScript language value) and internalSlot (an internal slot name) and returns either a normal completion containing unused or a throw completion. It throws an exception unless O is an Object and has the given internal slot. It performs the following steps when called:

## `10.2.1` [[Call]] ( thisArgument, argumentsList )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[Call]] internal method of an ECMAScript function object F takes arguments thisArgument (an ECMAScript language value) and argumentsList (a List of ECMAScript language values) and returns either a normal completion containing an ECMAScript language value or a throw completion. It performs the following steps when called:

## `10.2.1.1` PrepareForOrdinaryCall ( F, newTarget )
*10-ordinary-and-exotic-objects-behaviours.md*
> The abstract operation PrepareForOrdinaryCall takes arguments F (an ECMAScript function object) and newTarget (an Object or undefined) and returns an execution context. It performs the following steps when called:

## `10.2.1.2` OrdinaryCallBindThis ( F, calleeContext, thisArgument )
*10-ordinary-and-exotic-objects-behaviours.md*
> The abstract operation OrdinaryCallBindThis takes arguments F (an ECMAScript function object), calleeContext (an execution context), and thisArgument (an ECMAScript language value) and returns unused. It performs the following steps when called:

## `10.2.1.4` OrdinaryCallEvaluateBody ( F, argumentsList )
*10-ordinary-and-exotic-objects-behaviours.md*
> The abstract operation OrdinaryCallEvaluateBody takes arguments F (an ECMAScript function object) and argumentsList (a List of ECMAScript language values) and returns a return completion or a throw completion. It performs the following steps when called:

## `10.2.2` [[Construct]] ( argumentsList, newTarget )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[Construct]] internal method of an ECMAScript function object F takes arguments argumentsList (a List of ECMAScript language values) and newTarget (a constructor) and returns either a normal completion containing an Object or a throw completion. It performs the following steps when called:

## `10.2.3` OrdinaryFunctionCreate ( functionPrototype, sourceText, ParameterList, Body, thisMode, env, privateEnv )
*10-ordinary-and-exotic-objects-behaviours.md*
> The abstract operation OrdinaryFunctionCreate takes arguments functionPrototype (an Object), sourceText (a sequence of Unicode code points), ParameterList (a Parse Node), Body (a Parse Node), thisMode (lexical-this or non-lexical-this), env (an Environment Record), and privateEnv (a PrivateEnvironment Record or null) and returns an ECMAScript function object. It is used to specify the runtime creation of a new function with a default [[Call]] internal method and no [[Construct]] internal method (although one may be subsequently added by an operation such as MakeConstructor). sourceText is the source text of the syntactic definition of the function to be created. It performs the following steps when called:

## `10.2.4` AddRestrictedFunctionProperties ( F, realm )
*10-ordinary-and-exotic-objects-behaviours.md*
> The abstract operation AddRestrictedFunctionProperties takes arguments F (a function object) and realm (a Realm Record) and returns unused. It performs the following steps when called:

## `10.2.4.1` %ThrowTypeError% (  )
*10-ordinary-and-exotic-objects-behaviours.md*
> This function is the %ThrowTypeError% intrinsic object.

## `10.2.5` MakeConstructor ( F \[ , writablePrototype \[ , prototype \] \] )
*10-ordinary-and-exotic-objects-behaviours.md*
> The abstract operation MakeConstructor takes argument F (an ECMAScript function object or a built-in function object) and optional arguments writablePrototype (a Boolean) and prototype (an Object) and returns unused. It converts F into a constructor. It performs the following steps when called:

## `10.2.6` MakeClassConstructor ( F )
*10-ordinary-and-exotic-objects-behaviours.md*
> The abstract operation MakeClassConstructor takes argument F (an ECMAScript function object) and returns unused. It performs the following steps when called:

## `10.2.7` MakeMethod ( F, homeObject )
*10-ordinary-and-exotic-objects-behaviours.md*
> The abstract operation MakeMethod takes arguments F (an ECMAScript function object) and homeObject (an Object) and returns unused. It configures F as a method. It performs the following steps when called:

## `10.2.8` DefineMethodProperty ( homeObject, key, closure, enumerable )
*10-ordinary-and-exotic-objects-behaviours.md*
> The abstract operation DefineMethodProperty takes arguments homeObject (an Object), key (a property key or Private Name), closure (a function object), and enumerable (a Boolean) and returns either a normal completion containing either a PrivateElement or unused, or an abrupt completion. It performs the following steps when called:

## `10.2.9` SetFunctionName ( F, name \[ , prefix \] )
*10-ordinary-and-exotic-objects-behaviours.md*
> The abstract operation SetFunctionName takes arguments F (a function object) and name (a property key or Private Name) and optional argument prefix (a String) and returns unused. It adds a "name" property to F. It performs the following steps when called:

## `10.2.10` SetFunctionLength ( F, length )
*10-ordinary-and-exotic-objects-behaviours.md*
> The abstract operation SetFunctionLength takes arguments F (a function object) and length (a non-negative integer or +∞) and returns unused. It adds a "length" property to F. It performs the following steps when called:

## `10.2.11` FunctionDeclarationInstantiation ( func, argumentsList )
*10-ordinary-and-exotic-objects-behaviours.md*
> The abstract operation FunctionDeclarationInstantiation takes arguments func (an ECMAScript function object) and argumentsList (a List of ECMAScript language values) and returns either a normal completion containing unused or an abrupt completion. func is the function object for which the execution context is being established.

## `10.3.1` [[Call]] ( thisArgument, argumentsList )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[Call]] internal method of a built-in function object F takes arguments thisArgument (an ECMAScript language value) and argumentsList (a List of ECMAScript language values) and returns either a normal completion containing an ECMAScript language value or a throw completion. It performs the following steps when called:

## `10.3.2` [[Construct]] ( argumentsList, newTarget )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[Construct]] internal method of a built-in function object F (when the method is present) takes arguments argumentsList (a List of ECMAScript language values) and newTarget (a constructor) and returns either a normal completion containing an Object or a throw completion. It performs the following steps when called:

## `10.3.3` BuiltinCallOrConstruct ( F, thisArgument, argumentsList, newTarget )
*10-ordinary-and-exotic-objects-behaviours.md*
> The abstract operation BuiltinCallOrConstruct takes arguments F (a built-in function object), thisArgument (an ECMAScript language value or uninitialized), argumentsList (a List of ECMAScript language values), and newTarget (a constructor or undefined) and returns either a normal completion containing an ECMAScript language value or a throw completion. It performs the following steps when called:

## `10.3.4` CreateBuiltinFunction ( behaviour, length, name, additionalInternalSlotsList \[ , realm \[ , prototype \[ , prefix \] \] \] )
*10-ordinary-and-exotic-objects-behaviours.md*
> The abstract operation CreateBuiltinFunction takes arguments behaviour (an Abstract Closure, a set of algorithm steps, or some other definition of a function's behaviour provided in this specification), length (a non-negative integer or +∞), name (a property key or a Private Name), and additionalInternalSlotsList (a List of names of internal slots) and optional arguments realm (a Realm Record), prototype (an Object or null), and prefix (a String) and returns a built-in function object. additionalInternalSlotsList contains the names of additional internal slots that must be defined as part of the object. This operation creates a built-in function object. It performs the following steps when called:

## `10.4.1.1` [[Call]] ( thisArgument, argumentsList )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[Call]] internal method of a bound function exotic object F takes arguments thisArgument (an ECMAScript language value) and argumentsList (a List of ECMAScript language values) and returns either a normal completion containing an ECMAScript language value or a throw completion. It performs the following steps when called:

## `10.4.1.2` [[Construct]] ( argumentsList, newTarget )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[Construct]] internal method of a bound function exotic object F takes arguments argumentsList (a List of ECMAScript language values) and newTarget (a constructor) and returns either a normal completion containing an Object or a throw completion. It performs the following steps when called:

## `10.4.1.3` BoundFunctionCreate ( targetFunction, boundThis, boundArgs )
*10-ordinary-and-exotic-objects-behaviours.md*
> The abstract operation BoundFunctionCreate takes arguments targetFunction (a function object), boundThis (an ECMAScript language value), and boundArgs (a List of ECMAScript language values) and returns either a normal completion containing a function object or a throw completion. It is used to specify the creation of new bound function exotic objects. It performs the following steps when called:

## `10.4.2.1` [[DefineOwnProperty]] ( P, Desc )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[DefineOwnProperty]] internal method of an Array exotic object A takes arguments P (a property key) and Desc (a Property Descriptor) and returns either a normal completion containing a Boolean or a throw completion. It performs the following steps when called:

## `10.4.2.2` ArrayCreate ( length \[ , proto \] )
*10-ordinary-and-exotic-objects-behaviours.md*
> The abstract operation ArrayCreate takes argument length (a non-negative integer) and optional argument proto (an Object) and returns either a normal completion containing an Array exotic object or a throw completion. It is used to specify the creation of new Arrays. It performs the following steps when called:

## `10.4.2.3` ArraySpeciesCreate ( originalArray, length )
*10-ordinary-and-exotic-objects-behaviours.md*
> The abstract operation ArraySpeciesCreate takes arguments originalArray (an Object) and length (a non-negative integer) and returns either a normal completion containing an Object or a throw completion. It is used to specify the creation of a new Array or similar object using a constructor function that is derived from originalArray. It does not enforce that the constructor function returns an Array. It performs the following steps when called:

## `10.4.2.4` ArraySetLength ( A, Desc )
*10-ordinary-and-exotic-objects-behaviours.md*
> The abstract operation ArraySetLength takes arguments A (an Array) and Desc (a Property Descriptor) and returns either a normal completion containing a Boolean or a throw completion. It performs the following steps when called:

## `10.4.3.1` [[GetOwnProperty]] ( P )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[GetOwnProperty]] internal method of a String exotic object S takes argument P (a property key) and returns a normal completion containing either a Property Descriptor or undefined. It performs the following steps when called:

## `10.4.3.2` [[DefineOwnProperty]] ( P, Desc )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[DefineOwnProperty]] internal method of a String exotic object S takes arguments P (a property key) and Desc (a Property Descriptor) and returns a normal completion containing a Boolean. It performs the following steps when called:

## `10.4.3.3` [[OwnPropertyKeys]] (  )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[OwnPropertyKeys]] internal method of a String exotic object O takes no arguments and returns a normal completion containing a List of property keys. It performs the following steps when called:

## `10.4.3.4` StringCreate ( value, prototype )
*10-ordinary-and-exotic-objects-behaviours.md*
> The abstract operation StringCreate takes arguments value (a String) and prototype (an Object) and returns a String exotic object. It is used to specify the creation of new String exotic objects. It performs the following steps when called:

## `10.4.3.5` StringGetOwnProperty ( S, P )
*10-ordinary-and-exotic-objects-behaviours.md*
> The abstract operation StringGetOwnProperty takes arguments S (an Object that has a [[StringData]] internal slot) and P (a property key) and returns a Property Descriptor or undefined. It performs the following steps when called:

## `10.4.4.1` [[GetOwnProperty]] ( P )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[GetOwnProperty]] internal method of an arguments exotic object args takes argument P (a property key) and returns a normal completion containing either a Property Descriptor or undefined. It performs the following steps when called:

## `10.4.4.2` [[DefineOwnProperty]] ( P, Desc )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[DefineOwnProperty]] internal method of an arguments exotic object args takes arguments P (a property key) and Desc (a Property Descriptor) and returns a normal completion containing a Boolean. It performs the following steps when called:

## `10.4.4.3` [[Get]] ( P, Receiver )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[Get]] internal method of an arguments exotic object args takes arguments P (a property key) and Receiver (an ECMAScript language value) and returns either a normal completion containing an ECMAScript language value or a throw completion. It performs the following steps when called:

## `10.4.4.4` [[Set]] ( P, V, Receiver )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[Set]] internal method of an arguments exotic object args takes arguments P (a property key), V (an ECMAScript language value), and Receiver (an ECMAScript language value) and returns either a normal completion containing a Boolean or a throw completion. It performs the following steps when called:

## `10.4.4.5` [[Delete]] ( P )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[Delete]] internal method of an arguments exotic object args takes argument P (a property key) and returns either a normal completion containing a Boolean or a throw completion. It performs the following steps when called:

## `10.4.4.6` CreateUnmappedArgumentsObject ( argumentsList )
*10-ordinary-and-exotic-objects-behaviours.md*
> The abstract operation CreateUnmappedArgumentsObject takes argument argumentsList (a List of ECMAScript language values) and returns an ordinary object. It performs the following steps when called:

## `10.4.4.7` CreateMappedArgumentsObject ( func, formals, argumentsList, env )
*10-ordinary-and-exotic-objects-behaviours.md*
> The abstract operation CreateMappedArgumentsObject takes arguments func (an Object), formals (a Parse Node), argumentsList (a List of ECMAScript language values), and env (an Environment Record) and returns an arguments exotic object. It performs the following steps when called:

## `10.4.4.7.1` MakeArgGetter ( name, env )
*10-ordinary-and-exotic-objects-behaviours.md*
> The abstract operation MakeArgGetter takes arguments name (a String) and env (an Environment Record) and returns a function object. It creates a built-in function object that when executed returns the value bound for name in env. It performs the following steps when called:

## `10.4.4.7.2` MakeArgSetter ( name, env )
*10-ordinary-and-exotic-objects-behaviours.md*
> The abstract operation MakeArgSetter takes arguments name (a String) and env (an Environment Record) and returns a function object. It creates a built-in function object that when executed sets the value bound for name in env. It performs the following steps when called:

## `10.4.5.1` [[PreventExtensions]] (  )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[PreventExtensions]] internal method of a TypedArray O takes no arguments and returns a normal completion containing a Boolean. It performs the following steps when called:

## `10.4.5.2` [[GetOwnProperty]] ( P )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[GetOwnProperty]] internal method of a TypedArray O takes argument P (a property key) and returns a normal completion containing either a Property Descriptor or undefined. It performs the following steps when called:

## `10.4.5.3` [[HasProperty]] ( P )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[HasProperty]] internal method of a TypedArray O takes argument P (a property key) and returns either a normal completion containing a Boolean or a throw completion. It performs the following steps when called:

## `10.4.5.4` [[DefineOwnProperty]] ( P, Desc )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[DefineOwnProperty]] internal method of a TypedArray O takes arguments P (a property key) and Desc (a Property Descriptor) and returns either a normal completion containing a Boolean or a throw completion. It performs the following steps when called:

## `10.4.5.5` [[Get]] ( P, Receiver )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[Get]] internal method of a TypedArray O takes arguments P (a property key) and Receiver (an ECMAScript language value) and returns either a normal completion containing an ECMAScript language value or a throw completion. It performs the following steps when called:

## `10.4.5.6` [[Set]] ( P, V, Receiver )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[Set]] internal method of a TypedArray O takes arguments P (a property key), V (an ECMAScript language value), and Receiver (an ECMAScript language value) and returns either a normal completion containing a Boolean or a throw completion. It performs the following steps when called:

## `10.4.5.7` [[Delete]] ( P )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[Delete]] internal method of a TypedArray O takes argument P (a property key) and returns a normal completion containing a Boolean. It performs the following steps when called:

## `10.4.5.8` [[OwnPropertyKeys]] (  )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[OwnPropertyKeys]] internal method of a TypedArray O takes no arguments and returns a normal completion containing a List of property keys. It performs the following steps when called:

## `10.4.5.10` MakeTypedArrayWithBufferWitnessRecord ( obj, order )
*10-ordinary-and-exotic-objects-behaviours.md*
> The abstract operation MakeTypedArrayWithBufferWitnessRecord takes arguments obj (a TypedArray) and order (seq-cst or unordered) and returns a TypedArray With Buffer Witness Record. It performs the following steps when called:

## `10.4.5.11` TypedArrayCreate ( prototype )
*10-ordinary-and-exotic-objects-behaviours.md*
> The abstract operation TypedArrayCreate takes argument prototype (an Object) and returns a TypedArray. It is used to specify the creation of new TypedArrays. It performs the following steps when called:

## `10.4.5.12` TypedArrayByteLength ( taRecord )
*10-ordinary-and-exotic-objects-behaviours.md*
> The abstract operation TypedArrayByteLength takes argument taRecord (a TypedArray With Buffer Witness Record) and returns a non-negative integer. It performs the following steps when called:

## `10.4.5.13` TypedArrayLength ( taRecord )
*10-ordinary-and-exotic-objects-behaviours.md*
> The abstract operation TypedArrayLength takes argument taRecord (a TypedArray With Buffer Witness Record) and returns a non-negative integer. It performs the following steps when called:

## `10.4.5.14` IsTypedArrayOutOfBounds ( taRecord )
*10-ordinary-and-exotic-objects-behaviours.md*
> The abstract operation IsTypedArrayOutOfBounds takes argument taRecord (a TypedArray With Buffer Witness Record) and returns a Boolean. It checks if any of the object's numeric properties reference a value at an index not contained within the underlying buffer's bounds. It performs the following steps when called:

## `10.4.5.15` IsTypedArrayFixedLength ( O )
*10-ordinary-and-exotic-objects-behaviours.md*
> The abstract operation IsTypedArrayFixedLength takes argument O (a TypedArray) and returns a Boolean. It performs the following steps when called:

## `10.4.5.16` IsValidIntegerIndex ( O, index )
*10-ordinary-and-exotic-objects-behaviours.md*
> The abstract operation IsValidIntegerIndex takes arguments O (a TypedArray) and index (a Number) and returns a Boolean. It performs the following steps when called:

## `10.4.5.17` TypedArrayGetElement ( O, index )
*10-ordinary-and-exotic-objects-behaviours.md*
> The abstract operation TypedArrayGetElement takes arguments O (a TypedArray) and index (a Number) and returns a Number, a BigInt, or undefined. It performs the following steps when called:

## `10.4.5.18` TypedArraySetElement ( O, index, value )
*10-ordinary-and-exotic-objects-behaviours.md*
> The abstract operation TypedArraySetElement takes arguments O (a TypedArray), index (a Number), and value (an ECMAScript language value) and returns either a normal completion containing unused or a throw completion. It performs the following steps when called:

## `10.4.5.19` IsArrayBufferViewOutOfBounds ( O )
*10-ordinary-and-exotic-objects-behaviours.md*
> The abstract operation IsArrayBufferViewOutOfBounds takes argument O (a TypedArray or a DataView) and returns a Boolean. It checks if either any of a TypedArray's numeric properties or a DataView object's methods can reference a value at an index not contained within the underlying data block's bounds. This abstract operation exists as a convenience for upstream specifications. It performs the following steps when called:

## `10.4.6.1` [[GetPrototypeOf]] (  )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[GetPrototypeOf]] internal method of a module namespace exotic object takes no arguments and returns a normal completion containing null. It performs the following steps when called:

## `10.4.6.2` [[SetPrototypeOf]] ( V )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[SetPrototypeOf]] internal method of a module namespace exotic object O takes argument V (an Object or null) and returns a normal completion containing a Boolean. It performs the following steps when called:

## `10.4.6.3` [[IsExtensible]] (  )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[IsExtensible]] internal method of a module namespace exotic object takes no arguments and returns a normal completion containing false. It performs the following steps when called:

## `10.4.6.4` [[PreventExtensions]] (  )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[PreventExtensions]] internal method of a module namespace exotic object takes no arguments and returns a normal completion containing true. It performs the following steps when called:

## `10.4.6.5` [[GetOwnProperty]] ( P )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[GetOwnProperty]] internal method of a module namespace exotic object O takes argument P (a property key) and returns either a normal completion containing either a Property Descriptor or undefined, or a throw completion. It performs the following steps when called:

## `10.4.6.6` [[DefineOwnProperty]] ( P, Desc )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[DefineOwnProperty]] internal method of a module namespace exotic object O takes arguments P (a property key) and Desc (a Property Descriptor) and returns either a normal completion containing a Boolean or a throw completion. It performs the following steps when called:

## `10.4.6.7` [[HasProperty]] ( P )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[HasProperty]] internal method of a module namespace exotic object O takes argument P (a property key) and returns a normal completion containing a Boolean. It performs the following steps when called:

## `10.4.6.8` [[Get]] ( P, Receiver )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[Get]] internal method of a module namespace exotic object O takes arguments P (a property key) and Receiver (an ECMAScript language value) and returns either a normal completion containing an ECMAScript language value or a throw completion. It performs the following steps when called:

## `10.4.6.9` [[Set]] ( P, V, Receiver )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[Set]] internal method of a module namespace exotic object takes arguments P (a property key), V (an ECMAScript language value), and Receiver (an ECMAScript language value) and returns a normal completion containing false. It performs the following steps when called:

## `10.4.6.10` [[Delete]] ( P )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[Delete]] internal method of a module namespace exotic object O takes argument P (a property key) and returns a normal completion containing a Boolean. It performs the following steps when called:

## `10.4.6.11` [[OwnPropertyKeys]] (  )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[OwnPropertyKeys]] internal method of a module namespace exotic object O takes no arguments and returns a normal completion containing a List of property keys. It performs the following steps when called:

## `10.4.6.12` ModuleNamespaceCreate ( module, exports )
*10-ordinary-and-exotic-objects-behaviours.md*
> The abstract operation ModuleNamespaceCreate takes arguments module (a Module Record) and exports (a List of Strings) and returns a module namespace exotic object. It is used to specify the creation of new module namespace exotic objects. It performs the following steps when called:

## `10.4.7.1` [[SetPrototypeOf]] ( V )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[SetPrototypeOf]] internal method of an immutable prototype exotic object O takes argument V (an Object or null) and returns either a normal completion containing a Boolean or a throw completion. It performs the following steps when called:

## `10.4.7.2` SetImmutablePrototype ( O, V )
*10-ordinary-and-exotic-objects-behaviours.md*
> The abstract operation SetImmutablePrototype takes arguments O (an Object) and V (an Object or null) and returns either a normal completion containing a Boolean or a throw completion. It performs the following steps when called:

## `10.5.1` [[GetPrototypeOf]] (  )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[GetPrototypeOf]] internal method of a Proxy exotic object O takes no arguments and returns either a normal completion containing either an Object or null, or a throw completion. It performs the following steps when called:

## `10.5.2` [[SetPrototypeOf]] ( V )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[SetPrototypeOf]] internal method of a Proxy exotic object O takes argument V (an Object or null) and returns either a normal completion containing a Boolean or a throw completion. It performs the following steps when called:

## `10.5.3` [[IsExtensible]] (  )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[IsExtensible]] internal method of a Proxy exotic object O takes no arguments and returns either a normal completion containing a Boolean or a throw completion. It performs the following steps when called:

## `10.5.4` [[PreventExtensions]] (  )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[PreventExtensions]] internal method of a Proxy exotic object O takes no arguments and returns either a normal completion containing a Boolean or a throw completion. It performs the following steps when called:

## `10.5.5` [[GetOwnProperty]] ( P )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[GetOwnProperty]] internal method of a Proxy exotic object O takes argument P (a property key) and returns either a normal completion containing either a Property Descriptor or undefined, or a throw completion. It performs the following steps when called:

## `10.5.6` [[DefineOwnProperty]] ( P, Desc )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[DefineOwnProperty]] internal method of a Proxy exotic object O takes arguments P (a property key) and Desc (a Property Descriptor) and returns either a normal completion containing a Boolean or a throw completion. It performs the following steps when called:

## `10.5.7` [[HasProperty]] ( P )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[HasProperty]] internal method of a Proxy exotic object O takes argument P (a property key) and returns either a normal completion containing a Boolean or a throw completion. It performs the following steps when called:

## `10.5.8` [[Get]] ( P, Receiver )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[Get]] internal method of a Proxy exotic object O takes arguments P (a property key) and Receiver (an ECMAScript language value) and returns either a normal completion containing an ECMAScript language value or a throw completion. It performs the following steps when called:

## `10.5.9` [[Set]] ( P, V, Receiver )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[Set]] internal method of a Proxy exotic object O takes arguments P (a property key), V (an ECMAScript language value), and Receiver (an ECMAScript language value) and returns either a normal completion containing a Boolean or a throw completion. It performs the following steps when called:

## `10.5.10` [[Delete]] ( P )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[Delete]] internal method of a Proxy exotic object O takes argument P (a property key) and returns either a normal completion containing a Boolean or a throw completion. It performs the following steps when called:

## `10.5.11` [[OwnPropertyKeys]] (  )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[OwnPropertyKeys]] internal method of a Proxy exotic object O takes no arguments and returns either a normal completion containing a List of property keys or a throw completion. It performs the following steps when called:

## `10.5.12` [[Call]] ( thisArgument, argumentsList )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[Call]] internal method of a Proxy exotic object O takes arguments thisArgument (an ECMAScript language value) and argumentsList (a List of ECMAScript language values) and returns either a normal completion containing an ECMAScript language value or a throw completion. It performs the following steps when called:

## `10.5.13` [[Construct]] ( argumentsList, newTarget )
*10-ordinary-and-exotic-objects-behaviours.md*
> The [[Construct]] internal method of a Proxy exotic object O takes arguments argumentsList (a List of ECMAScript language values) and newTarget (a constructor) and returns either a normal completion containing an Object or a throw completion. It performs the following steps when called:

## `10.5.14` ValidateNonRevokedProxy ( proxy )
*10-ordinary-and-exotic-objects-behaviours.md*
> The abstract operation ValidateNonRevokedProxy takes argument proxy (a Proxy exotic object) and returns either a normal completion containing unused or a throw completion. It throws a TypeError exception if proxy has been revoked. It performs the following steps when called:

## `10.5.15` ProxyCreate ( target, handler )
*10-ordinary-and-exotic-objects-behaviours.md*
> The abstract operation ProxyCreate takes arguments target (an ECMAScript language value) and handler (an ECMAScript language value) and returns either a normal completion containing a Proxy exotic object or a throw completion. It is used to specify the creation of new Proxy objects. It performs the following steps when called:

## `11.1.1` Static Semantics: UTF16EncodeCodePoint ( cp )
*11-ecmascript-language-source-text.md*
> The abstract operation UTF16EncodeCodePoint takes argument cp (a Unicode code point) and returns a String. It performs the following steps when called:

## `11.1.2` Static Semantics: CodePointsToString ( text )
*11-ecmascript-language-source-text.md*
> The abstract operation CodePointsToString takes argument text (a sequence of Unicode code points) and returns a String. It converts text into a String value, as described in 6.1.4. It performs the following steps when called:

## `11.1.3` Static Semantics: UTF16SurrogatePairToCodePoint ( lead, trail )
*11-ecmascript-language-source-text.md*
> The abstract operation UTF16SurrogatePairToCodePoint takes arguments lead (a code unit) and trail (a code unit) and returns a code point. Two code units that form a UTF-16 surrogate pair are converted to a code point. It performs the following steps when called:

## `11.1.4` Static Semantics: CodePointAt ( string, position )
*11-ecmascript-language-source-text.md*
> The abstract operation CodePointAt takes arguments string (a String) and position (a non-negative integer) and returns a Record with fields [[CodePoint]] (a code point), [[CodeUnitCount]] (a positive integer), and [[IsUnpairedSurrogate]] (a Boolean). It interprets string as a sequence of UTF-16 encoded code points, as described in 6.1.4, and reads from it a single code point starting with the code unit at index position. It performs the following steps when called:

## `11.1.5` Static Semantics: StringToCodePoints ( string )
*11-ecmascript-language-source-text.md*
> The abstract operation StringToCodePoints takes argument string (a String) and returns a List of code points. It returns the sequence of Unicode code points that results from interpreting string as UTF-16 encoded Unicode text as described in 6.1.4. It performs the following steps when called:

## `11.1.6` Static Semantics: ParseText ( sourceText, goalSymbol )
*11-ecmascript-language-source-text.md*
> The abstract operation ParseText takes arguments sourceText (a String or a sequence of Unicode code points) and goalSymbol (a nonterminal in one of the ECMAScript grammars) and returns a Parse Node or a non-empty List of SyntaxError objects. It performs the following steps when called:

## `11.2.2.1` Static Semantics: IsStrict ( node )
*11-ecmascript-language-source-text.md*
> The abstract operation IsStrict takes argument node (a Parse Node) and returns a Boolean. It performs the following steps when called:

## `13.2.7.2` Static Semantics: IsValidRegularExpressionLiteral ( literal )
*13-ecmascript-language-expressions.md*
> The abstract operation IsValidRegularExpressionLiteral takes argument literal (a RegularExpressionLiteral Parse Node) and returns a Boolean. It determines if its argument is a valid regular expression literal. It performs the following steps when called:

## `13.2.8.3` Static Semantics: TemplateString ( templateToken, raw )
*13-ecmascript-language-expressions.md*
> The abstract operation TemplateString takes arguments templateToken (a NoSubstitutionTemplate Parse Node, a TemplateHead Parse Node, a TemplateMiddle Parse Node, or a TemplateTail Parse Node) and raw (a Boolean) and returns a String or undefined. It performs the following steps when called:

## `13.2.8.4` GetTemplateObject ( templateLiteral )
*13-ecmascript-language-expressions.md*
> The abstract operation GetTemplateObject takes argument templateLiteral (a Parse Node) and returns an Array. It performs the following steps when called:

## `13.3.3` EvaluatePropertyAccessWithExpressionKey ( baseValue, expression, strict )
*13-ecmascript-language-expressions.md*
> The abstract operation EvaluatePropertyAccessWithExpressionKey takes arguments baseValue (an ECMAScript language value), expression (an Expression Parse Node), and strict (a Boolean) and returns either a normal completion containing a Reference Record or an abrupt completion. It performs the following steps when called:

## `13.3.4` EvaluatePropertyAccessWithIdentifierKey ( baseValue, identifierName, strict )
*13-ecmascript-language-expressions.md*
> The abstract operation EvaluatePropertyAccessWithIdentifierKey takes arguments baseValue (an ECMAScript language value), identifierName (an IdentifierName Parse Node), and strict (a Boolean) and returns a Reference Record. It performs the following steps when called:

## `13.3.5.1.1` EvaluateNew ( constructExpr, arguments )
*13-ecmascript-language-expressions.md*
> The abstract operation EvaluateNew takes arguments constructExpr (a NewExpression Parse Node or a MemberExpression Parse Node) and arguments (empty or an Arguments Parse Node) and returns either a normal completion containing an ECMAScript language value or an abrupt completion. It performs the following steps when called:

## `13.3.6.2` EvaluateCall ( func, ref, arguments, tailPosition )
*13-ecmascript-language-expressions.md*
> The abstract operation EvaluateCall takes arguments func (an ECMAScript language value), ref (an ECMAScript language value or a Reference Record), arguments (a Parse Node), and tailPosition (a Boolean) and returns either a normal completion containing an ECMAScript language value or an abrupt completion. It performs the following steps when called:

## `13.3.7.2` GetSuperConstructor (  )
*13-ecmascript-language-expressions.md*
> The abstract operation GetSuperConstructor takes no arguments and returns an ECMAScript language value. It performs the following steps when called:

## `13.3.7.3` MakeSuperPropertyReference ( actualThis, propertyKey, strict )
*13-ecmascript-language-expressions.md*
> The abstract operation MakeSuperPropertyReference takes arguments actualThis (an ECMAScript language value), propertyKey (an ECMAScript language value), and strict (a Boolean) and returns a Super Reference Record. It performs the following steps when called:

## `13.3.10.2` EvaluateImportCall ( specifierExpression \[ , optionsExpression \] )
*13-ecmascript-language-expressions.md*
> The abstract operation EvaluateImportCall takes argument specifierExpression (a Parse Node) and optional argument optionsExpression (a Parse Node) and returns either a normal completion containing a Promise or an abrupt completion. It performs the following steps when called:

## `13.3.10.3` ContinueDynamicImport ( promiseCapability, moduleCompletion )
*13-ecmascript-language-expressions.md*
> The abstract operation ContinueDynamicImport takes arguments promiseCapability (a PromiseCapability Record) and moduleCompletion (either a normal completion containing a Module Record or a throw completion) and returns unused. It completes the process of a dynamic import originally started by an import() call, resolving or rejecting the promise returned by that call as appropriate. It performs the following steps when called:

## `13.3.12.1.1` HostGetImportMetaProperties ( moduleRecord )
*13-ecmascript-language-expressions.md*
> The host-defined abstract operation HostGetImportMetaProperties takes argument moduleRecord (a Module Record) and returns a List of Records with fields [[Key]] (a property key) and [[Value]] (an ECMAScript language value). It allows hosts to provide property keys and values for the object returned from import.meta.

## `13.3.12.1.2` HostFinalizeImportMeta ( importMeta, moduleRecord )
*13-ecmascript-language-expressions.md*
> The host-defined abstract operation HostFinalizeImportMeta takes arguments importMeta (an Object) and moduleRecord (a Module Record) and returns unused. It allows hosts to perform any extraordinary operations to prepare the object returned from import.meta.

## `13.5.6` Bitwise NOT Operator ( ~ )
*13-ecmascript-language-expressions.md*
> #### 13.5.6.1 Runtime Semantics: Evaluation

## `13.5.7` Logical NOT Operator ( ! )
*13-ecmascript-language-expressions.md*
> #### 13.5.7.1 Runtime Semantics: Evaluation

## `13.8.1` The Addition Operator ( + )
*13-ecmascript-language-expressions.md*
> Note

## `13.8.2` The Subtraction Operator ( - )
*13-ecmascript-language-expressions.md*
> Note

## `13.9.1` The Left Shift Operator ( << )
*13-ecmascript-language-expressions.md*
> Note

## `13.9.2` The Signed Right Shift Operator ( >> )
*13-ecmascript-language-expressions.md*
> Note

## `13.9.3` The Unsigned Right Shift Operator ( >>> )
*13-ecmascript-language-expressions.md*
> Note

## `13.10.2` InstanceofOperator ( V, target )
*13-ecmascript-language-expressions.md*
> The abstract operation InstanceofOperator takes arguments V (an ECMAScript language value) and target (an ECMAScript language value) and returns either a normal completion containing a Boolean or a throw completion. It implements the generic algorithm for determining if V is an instance of target either by consulting target's %Symbol.hasInstance% method or, if absent, determining whether the value of target's "prototype" property is present in V's prototype chain. It performs the following steps when called:

## `13.14` Conditional Operator ( ? : )
*13-ecmascript-language-expressions.md*
> ### Syntax

## `13.15.3` ApplyStringOrNumericBinaryOperator ( lVal, opText, rVal )
*13-ecmascript-language-expressions.md*
> The abstract operation ApplyStringOrNumericBinaryOperator takes arguments lVal (an ECMAScript language value), opText (**, *, /, %, +, -, <<, >>, >>>, &, ^, or |), and rVal (an ECMAScript language value) and returns either a normal completion containing either a String, a BigInt, or a Number, or a throw completion. It performs the following steps when called:

## `13.15.4` EvaluateStringOrNumericBinaryExpression ( leftOperand, opText, rightOperand )
*13-ecmascript-language-expressions.md*
> The abstract operation EvaluateStringOrNumericBinaryExpression takes arguments leftOperand (a Parse Node), opText (a sequence of Unicode code points), and rightOperand (a Parse Node) and returns either a normal completion containing either a String, a BigInt, or a Number, or an abrupt completion. It performs the following steps when called:

## `13.16` Comma Operator ( , )
*13-ecmascript-language-expressions.md*
> ### Syntax

## `14.2.3` BlockDeclarationInstantiation ( code, env )
*14-ecmascript-language-statements-and-declarations.md*
> The abstract operation BlockDeclarationInstantiation takes arguments code (a Parse Node) and env (a Declarative Environment Record) and returns unused. code is the Parse Node corresponding to the body of the block. env is the Environment Record in which bindings are to be created.

## `14.7.1.1` LoopContinues ( completion, labelSet )
*14-ecmascript-language-statements-and-declarations.md*
> The abstract operation LoopContinues takes arguments completion (a Completion Record) and labelSet (a List of Strings) and returns a Boolean. It performs the following steps when called:

## `14.7.4.3` ForBodyEvaluation ( test, increment, stmt, perIterationBindings, labelSet )
*14-ecmascript-language-statements-and-declarations.md*
> The abstract operation ForBodyEvaluation takes arguments test (an Expression Parse Node or empty), increment (an Expression Parse Node or empty), stmt (a Statement Parse Node), perIterationBindings (a List of Strings), and labelSet (a List of Strings) and returns either a normal completion containing an ECMAScript language value or an abrupt completion. It performs the following steps when called:

## `14.7.4.4` CreatePerIterationEnvironment ( perIterationBindings )
*14-ecmascript-language-statements-and-declarations.md*
> The abstract operation CreatePerIterationEnvironment takes argument perIterationBindings (a List of Strings) and returns either a normal completion containing unused or a throw completion. It performs the following steps when called:

## `14.7.5.6` ForIn/OfHeadEvaluation ( uninitializedBoundNames, expr, iterationKind )
*14-ecmascript-language-statements-and-declarations.md*
> The abstract operation ForIn/OfHeadEvaluation takes arguments uninitializedBoundNames (a List of Strings), expr (an Expression Parse Node or an AssignmentExpression Parse Node), and iterationKind (enumerate, iterate, or async-iterate) and returns either a normal completion containing an Iterator Record or an abrupt completion. It performs the following steps when called:

## `14.7.5.7` ForIn/OfBodyEvaluation ( lhs, stmt, iteratorRecord, iterationKind, lhsKind, labelSet \[ , iteratorKind \] )
*14-ecmascript-language-statements-and-declarations.md*
> The abstract operation ForIn/OfBodyEvaluation takes arguments lhs (a Parse Node), stmt (a Statement Parse Node), iteratorRecord (an Iterator Record), iterationKind (enumerate or iterate), lhsKind (assignment, var-binding, or lexical-binding), and labelSet (a List of Strings) and optional argument iteratorKind (sync or async) and returns either a normal completion containing an ECMAScript language value or an abrupt completion. It performs the following steps when called:

## `14.7.5.9` EnumerateObjectProperties ( O )
*14-ecmascript-language-statements-and-declarations.md*
> The abstract operation EnumerateObjectProperties takes argument O (an Object) and returns an iterator object. It performs the following steps when called:

## `14.7.5.10.1` CreateForInIterator ( object )
*14-ecmascript-language-statements-and-declarations.md*
> The abstract operation CreateForInIterator takes argument object (an Object) and returns a For-In Iterator. It is used to create a For-In Iterator object which iterates over the own and inherited enumerable string properties of object in a specific order. It performs the following steps when called:

## `14.7.5.10.2.1` %ForInIteratorPrototype%.next (  )
*14-ecmascript-language-statements-and-declarations.md*
> 1.  Let O be the this value.

## `14.12.3` CaseClauseIsSelected ( C, input )
*14-ecmascript-language-statements-and-declarations.md*
> The abstract operation CaseClauseIsSelected takes arguments C (a CaseClause Parse Node) and input (an ECMAScript language value) and returns either a normal completion containing a Boolean or an abrupt completion. It determines whether C matches input. It performs the following steps when called:

## `14.13.2` Static Semantics: IsLabelledFunction ( stmt )
*14-ecmascript-language-statements-and-declarations.md*
> The abstract operation IsLabelledFunction takes argument stmt (a Statement Parse Node) and returns a Boolean. It performs the following steps when called:

## `15.10.1` Static Semantics: IsInTailPosition ( call )
*15-ecmascript-language-functions-and-classes.md*
> The abstract operation IsInTailPosition takes argument call (a CallExpression Parse Node, a MemberExpression Parse Node, or an OptionalChain Parse Node) and returns a Boolean. It performs the following steps when called:

## `15.10.3` PrepareForTailCall (  )
*15-ecmascript-language-functions-and-classes.md*
> The abstract operation PrepareForTailCall takes no arguments and returns unused. It performs the following steps when called:

## `16.1.5` ParseScript ( sourceText, realm, hostDefined )
*16-ecmascript-language-scripts-and-modules.md*
> The abstract operation ParseScript takes arguments sourceText (ECMAScript source text), realm (a Realm Record), and hostDefined (anything) and returns a Script Record or a non-empty List of SyntaxError objects. It creates a Script Record based upon the result of parsing sourceText as a Script. It performs the following steps when called:

## `16.1.6` ScriptEvaluation ( scriptRecord )
*16-ecmascript-language-scripts-and-modules.md*
> The abstract operation ScriptEvaluation takes argument scriptRecord (a Script Record) and returns either a normal completion containing an ECMAScript language value or an abrupt completion. It performs the following steps when called:

## `16.1.7` GlobalDeclarationInstantiation ( script, env )
*16-ecmascript-language-scripts-and-modules.md*
> The abstract operation GlobalDeclarationInstantiation takes arguments script (a Script Parse Node) and env (a Global Environment Record) and returns either a normal completion containing unused or a throw completion. script is the Script for which the execution context is being established. env is the global environment in which bindings are to be created.

## `16.2.1.2` Static Semantics: ImportedLocalNames ( importEntries )
*16-ecmascript-language-scripts-and-modules.md*
> The abstract operation ImportedLocalNames takes argument importEntries (a List of ImportEntry Records) and returns a List of Strings. It creates a List of all of the local name bindings defined by importEntries. It performs the following steps when called:

## `16.2.1.3.1` ModuleRequestsEqual ( left, right )
*16-ecmascript-language-scripts-and-modules.md*
> The abstract operation ModuleRequestsEqual takes arguments left (a ModuleRequest Record or a LoadedModuleRequest Record) and right (a ModuleRequest Record or a LoadedModuleRequest Record) and returns a Boolean. It performs the following steps when called:

## `16.2.1.6.1.1` LoadRequestedModules ( \[ hostDefined \] )
*16-ecmascript-language-scripts-and-modules.md*
> The LoadRequestedModules concrete method of a Cyclic Module Record module takes optional argument hostDefined (anything) and returns a Promise. It populates the [[LoadedModules]] of all the Module Records in the dependency graph of module (most of the work is done by the auxiliary function InnerModuleLoading). It takes an optional hostDefined parameter that is passed to the HostLoadImportedModule hook. It performs the following steps when called:

## `16.2.1.6.1.1.1` InnerModuleLoading ( state, module )
*16-ecmascript-language-scripts-and-modules.md*
> The abstract operation InnerModuleLoading takes arguments state (a GraphLoadingState Record) and module (a Module Record) and returns unused. It is used by LoadRequestedModules to recursively perform the actual loading process for module's dependency graph. It performs the following steps when called:

## `16.2.1.6.1.1.2` ContinueModuleLoading ( state, moduleCompletion )
*16-ecmascript-language-scripts-and-modules.md*
> The abstract operation ContinueModuleLoading takes arguments state (a GraphLoadingState Record) and moduleCompletion (either a normal completion containing a Module Record or a throw completion) and returns unused. It is used to re-enter the loading process after a call to HostLoadImportedModule. It performs the following steps when called:

## `16.2.1.6.1.2` Link (  )
*16-ecmascript-language-scripts-and-modules.md*
> The Link concrete method of a Cyclic Module Record module takes no arguments and returns either a normal completion containing unused or a throw completion. On success, Link transitions this module's [[Status]] from unlinked to linked. On failure, an exception is thrown and this module's [[Status]] remains unlinked. (Most of the work is done by the auxiliary function InnerModuleLinking.) It performs the following steps when called:

## `16.2.1.6.1.2.1` InnerModuleLinking ( module, stack, index )
*16-ecmascript-language-scripts-and-modules.md*
> The abstract operation InnerModuleLinking takes arguments module (a Module Record), stack (a List of Cyclic Module Records), and index (a non-negative integer) and returns either a normal completion containing a non-negative integer or a throw completion. It is used by Link to perform the actual linking process for module, as well as recursively on all other modules in the dependency graph. The stack and index parameters, as well as a module's [[DFSIndex]] and [[DFSAncestorIndex]] fields, keep track of the depth-first search (DFS) traversal. In particular, [[DFSAncestorIndex]] is used to discover strongly connected components (SCCs), such that all modules in an SCC transition to linked together. It performs the following steps when called:

## `16.2.1.6.1.3` Evaluate (  )
*16-ecmascript-language-scripts-and-modules.md*
> The Evaluate concrete method of a Cyclic Module Record module takes no arguments and returns a Promise. Evaluate transitions this module's [[Status]] from linked to either evaluating-async or evaluated. The first time it is called on a module in a given strongly connected component, Evaluate creates and returns a Promise which resolves when the module has finished evaluating. This Promise is stored in the [[TopLevelCapability]] field of the [[CycleRoot]] for the component. Future invocations of Evaluate on any module in the component return the same Promise. (Most of the work is done by the auxiliary function InnerModuleEvaluation.) It performs the following steps when called:

## `16.2.1.6.1.3.1` InnerModuleEvaluation ( module, stack, index )
*16-ecmascript-language-scripts-and-modules.md*
> The abstract operation InnerModuleEvaluation takes arguments module (a Module Record), stack (a List of Cyclic Module Records), and index (a non-negative integer) and returns either a normal completion containing a non-negative integer or a throw completion. It is used by Evaluate to perform the actual evaluation process for module, as well as recursively on all other modules in the dependency graph. The stack and index parameters, as well as module's [[DFSIndex]] and [[DFSAncestorIndex]] fields, are used the same way as in InnerModuleLinking. It performs the following steps when called:

## `16.2.1.6.1.3.2` ExecuteAsyncModule ( module )
*16-ecmascript-language-scripts-and-modules.md*
> The abstract operation ExecuteAsyncModule takes argument module (a Cyclic Module Record) and returns unused. It performs the following steps when called:

## `16.2.1.6.1.3.3` GatherAvailableAncestors ( module, execList )
*16-ecmascript-language-scripts-and-modules.md*
> The abstract operation GatherAvailableAncestors takes arguments module (a Cyclic Module Record) and execList (a List of Cyclic Module Records) and returns unused. It performs the following steps when called:

## `16.2.1.6.1.3.4` AsyncModuleExecutionFulfilled ( module )
*16-ecmascript-language-scripts-and-modules.md*
> The abstract operation AsyncModuleExecutionFulfilled takes argument module (a Cyclic Module Record) and returns unused. It performs the following steps when called:

## `16.2.1.6.1.3.5` AsyncModuleExecutionRejected ( module, error )
*16-ecmascript-language-scripts-and-modules.md*
> The abstract operation AsyncModuleExecutionRejected takes arguments module (a Cyclic Module Record) and error (an ECMAScript language value) and returns unused. It performs the following steps when called:

## `16.2.1.7.1` ParseModule ( sourceText, realm, hostDefined )
*16-ecmascript-language-scripts-and-modules.md*
> The abstract operation ParseModule takes arguments sourceText (ECMAScript source text), realm (a Realm Record), and hostDefined (anything) and returns a Source Text Module Record or a non-empty List of SyntaxError objects. It creates a Source Text Module Record based upon the result of parsing sourceText as a Module. It performs the following steps when called:

## `16.2.1.7.2.1` GetExportedNames ( \[ exportStarSet \] )
*16-ecmascript-language-scripts-and-modules.md*
> The GetExportedNames concrete method of a Source Text Module Record module takes optional argument exportStarSet (a List of Source Text Module Records) and returns a List of Strings. It performs the following steps when called:

## `16.2.1.7.2.2` ResolveExport ( exportName \[ , resolveSet \] )
*16-ecmascript-language-scripts-and-modules.md*
> The ResolveExport concrete method of a Source Text Module Record module takes argument exportName (a String) and optional argument resolveSet (a List of Records with fields [[Module]] (a Module Record) and [[ExportName]] (a String)) and returns a ResolvedBinding Record, null, or ambiguous.

## `16.2.1.7.3.1` InitializeEnvironment (  )
*16-ecmascript-language-scripts-and-modules.md*
> The InitializeEnvironment concrete method of a Source Text Module Record module takes no arguments and returns either a normal completion containing unused or a throw completion. It performs the following steps when called:

## `16.2.1.7.3.2` ExecuteModule ( \[ capability \] )
*16-ecmascript-language-scripts-and-modules.md*
> The ExecuteModule concrete method of a Source Text Module Record module takes optional argument capability (a PromiseCapability Record) and returns either a normal completion containing unused or a throw completion. It performs the following steps when called:

## `16.2.1.8.1` CreateDefaultExportSyntheticModule ( defaultExport )
*16-ecmascript-language-scripts-and-modules.md*
> The abstract operation CreateDefaultExportSyntheticModule takes argument defaultExport (an ECMAScript language value) and returns a Synthetic Module Record. It creates a Synthetic Module Record whose default export is defaultExport. It performs the following steps when called:

## `16.2.1.8.2` ParseJSONModule ( source )
*16-ecmascript-language-scripts-and-modules.md*
> The abstract operation ParseJSONModule takes argument source (a String) and returns either a normal completion containing a Synthetic Module Record, or a throw completion. It performs the following steps when called:

## `16.2.1.8.3` SetSyntheticModuleExport ( module, exportName, exportValue )
*16-ecmascript-language-scripts-and-modules.md*
> The abstract operation SetSyntheticModuleExport takes arguments module (a Synthetic Module Record), exportName (a String), and exportValue (an ECMAScript language value) and returns unused. It can be used to set or change the exported value for an existing export of a Synthetic Module Record. It performs the following steps when called:

## `16.2.1.8.4.1` LoadRequestedModules (  )
*16-ecmascript-language-scripts-and-modules.md*
> The LoadRequestedModules concrete method of a Synthetic Module Record module takes no arguments and returns a Promise. It performs the following steps when called:

## `16.2.1.8.4.2` GetExportedNames (  )
*16-ecmascript-language-scripts-and-modules.md*
> The GetExportedNames concrete method of a Synthetic Module Record module takes no arguments and returns a List of Strings. It performs the following steps when called:

## `16.2.1.8.4.3` ResolveExport ( exportName )
*16-ecmascript-language-scripts-and-modules.md*
> The ResolveExport concrete method of a Synthetic Module Record module takes argument exportName (a String) and returns a ResolvedBinding Record or null. It performs the following steps when called:

## `16.2.1.8.4.4` Link (  )
*16-ecmascript-language-scripts-and-modules.md*
> The Link concrete method of a Synthetic Module Record module takes no arguments and returns a normal completion containing unused. It performs the following steps when called:

## `16.2.1.8.4.5` Evaluate (  )
*16-ecmascript-language-scripts-and-modules.md*
> The Evaluate concrete method of a Synthetic Module Record module takes no arguments and returns a Promise. It performs the following steps when called:

## `16.2.1.9` GetImportedModule ( referrer, request )
*16-ecmascript-language-scripts-and-modules.md*
> The abstract operation GetImportedModule takes arguments referrer (a Cyclic Module Record) and request (a ModuleRequest Record) and returns a Module Record. It performs the following steps when called:

## `16.2.1.10` HostLoadImportedModule ( referrer, moduleRequest, hostDefined, payload )
*16-ecmascript-language-scripts-and-modules.md*
> The host-defined abstract operation HostLoadImportedModule takes arguments referrer (a Script Record, a Cyclic Module Record, or a Realm Record), moduleRequest (a ModuleRequest Record), hostDefined (anything), and payload (a GraphLoadingState Record or a PromiseCapability Record) and returns unused.

## `16.2.1.11` FinishLoadingImportedModule ( referrer, moduleRequest, payload, result )
*16-ecmascript-language-scripts-and-modules.md*
> The abstract operation FinishLoadingImportedModule takes arguments referrer (a Script Record, a Cyclic Module Record, or a Realm Record), moduleRequest (a ModuleRequest Record), payload (a GraphLoadingState Record or a PromiseCapability Record), and result (either a normal completion containing a Module Record or a throw completion) and returns unused. It performs the following steps when called:

## `16.2.1.12` AllImportAttributesSupported ( attributes )
*16-ecmascript-language-scripts-and-modules.md*
> The abstract operation AllImportAttributesSupported takes argument attributes (a List of ImportAttribute Records) and returns a Boolean. It performs the following steps when called:

## `16.2.1.12.1` HostGetSupportedImportAttributes (  )
*16-ecmascript-language-scripts-and-modules.md*
> The host-defined abstract operation HostGetSupportedImportAttributes takes no arguments and returns a List of Strings. It allows host environments to specify which import attributes they support. Only attributes with supported keys will be provided to the host.

## `16.2.1.13` GetModuleNamespace ( module )
*16-ecmascript-language-scripts-and-modules.md*
> The abstract operation GetModuleNamespace takes argument module (an instance of a concrete subclass of Module Record) and returns a Module Namespace Object. It retrieves the Module Namespace Object representing module's exports, lazily creating it the first time it was requested, and storing it in module.[[Namespace]] for future retrieval. It performs the following steps when called:

## `19.2.1` eval ( x )
*19-the-global-object.md*
> This function is the %eval% intrinsic object.

## `19.2.1.1` PerformEval ( x, strictCaller, direct )
*19-the-global-object.md*
> The abstract operation PerformEval takes arguments x (an ECMAScript language value), strictCaller (a Boolean), and direct (a Boolean) and returns either a normal completion containing an ECMAScript language value or a throw completion. It performs the following steps when called:

## `19.2.1.2` HostEnsureCanCompileStrings ( calleeRealm, parameterStrings, bodyString, direct )
*19-the-global-object.md*
> The host-defined abstract operation HostEnsureCanCompileStrings takes arguments calleeRealm (a Realm Record), parameterStrings (a List of Strings), bodyString (a String), and direct (a Boolean) and returns either a normal completion containing unused or a throw completion. It allows host environments to block certain ECMAScript functions which allow developers to interpret and evaluate strings as ECMAScript code.

## `19.2.1.3` EvalDeclarationInstantiation ( body, varEnv, lexEnv, privateEnv, strict )
*19-the-global-object.md*
> The abstract operation EvalDeclarationInstantiation takes arguments body (a ScriptBody Parse Node), varEnv (an Environment Record), lexEnv (a Declarative Environment Record), privateEnv (a PrivateEnvironment Record or null), and strict (a Boolean) and returns either a normal completion containing unused or a throw completion. It performs the following steps when called:

## `19.2.2` isFinite ( number )
*19-the-global-object.md*
> This function is the %isFinite% intrinsic object.

## `19.2.3` isNaN ( number )
*19-the-global-object.md*
> This function is the %isNaN% intrinsic object.

## `19.2.4` parseFloat ( string )
*19-the-global-object.md*
> This function produces a Number value dictated by interpretation of the contents of the string argument as a decimal literal.

## `19.2.5` parseInt ( string, radix )
*19-the-global-object.md*
> This function produces an integral Number dictated by interpretation of the contents of string according to the specified radix. Leading white space in string is ignored. If radix coerces to 0 (such as when it is undefined), it is assumed to be 10 except when the number representation begins with "0x" or "0X", in which case it is assumed to be 16. If radix is 16, the number representation may optionally begin with "0x" or "0X".

## `19.2.6.1` decodeURI ( encodedURI )
*19-the-global-object.md*
> This function computes a new version of a URI in which each escape sequence and UTF-8 encoding of the sort that might be introduced by the encodeURI function is replaced with the UTF-16 encoding of the code point that it represents. Escape sequences that could not have been introduced by encodeURI are not replaced.

## `19.2.6.2` decodeURIComponent ( encodedURIComponent )
*19-the-global-object.md*
> This function computes a new version of a URI in which each escape sequence and UTF-8 encoding of the sort that might be introduced by the encodeURIComponent function is replaced with the UTF-16 encoding of the code point that it represents.

## `19.2.6.3` encodeURI ( uri )
*19-the-global-object.md*
> This function computes a new version of a UTF-16 encoded (6.1.4) URI in which each instance of certain code points is replaced by one, two, three, or four escape sequences representing the UTF-8 encoding of the code point.

## `19.2.6.4` encodeURIComponent ( uriComponent )
*19-the-global-object.md*
> This function computes a new version of a UTF-16 encoded (6.1.4) URI in which each instance of certain code points is replaced by one, two, three, or four escape sequences representing the UTF-8 encoding of the code point.

## `19.2.6.5` Encode ( string, extraUnescaped )
*19-the-global-object.md*
> The abstract operation Encode takes arguments string (a String) and extraUnescaped (a String) and returns either a normal completion containing a String or a throw completion. It performs URI encoding and escaping, interpreting string as a sequence of UTF-16 encoded code points as described in 6.1.4. If a character is identified as unreserved in RFC 2396 or appears in extraUnescaped, it is not escaped. It performs the following steps when called:

## `19.2.6.6` Decode ( string, preserveEscapeSet )
*19-the-global-object.md*
> The abstract operation Decode takes arguments string (a String) and preserveEscapeSet (a String) and returns either a normal completion containing a String or a throw completion. It performs URI unescaping and decoding, preserving any escape sequences that correspond to Basic Latin characters in preserveEscapeSet. It performs the following steps when called:

## `19.2.6.7` ParseHexOctet ( string, position )
*19-the-global-object.md*
> The abstract operation ParseHexOctet takes arguments string (a String) and position (a non-negative integer) and returns either a non-negative integer or a non-empty List of SyntaxError objects. It parses a sequence of two hexadecimal characters at the specified position in string into an unsigned 8-bit integer. It performs the following steps when called:

## `19.3.1` AggregateError ( . . . )
*19-the-global-object.md*
> See 20.5.7.1.

## `19.3.2` Array ( . . . )
*19-the-global-object.md*
> See 23.1.1.

## `19.3.3` ArrayBuffer ( . . . )
*19-the-global-object.md*
> See 25.1.4.

## `19.3.4` BigInt ( . . . )
*19-the-global-object.md*
> See 21.2.1.

## `19.3.5` BigInt64Array ( . . . )
*19-the-global-object.md*
> See 23.2.5.

## `19.3.6` BigUint64Array ( . . . )
*19-the-global-object.md*
> See 23.2.5.

## `19.3.7` Boolean ( . . . )
*19-the-global-object.md*
> See 20.3.1.

## `19.3.8` DataView ( . . . )
*19-the-global-object.md*
> See 25.3.2.

## `19.3.9` Date ( . . . )
*19-the-global-object.md*
> See 21.4.2.

## `19.3.10` Error ( . . . )
*19-the-global-object.md*
> See 20.5.1.

## `19.3.11` EvalError ( . . . )
*19-the-global-object.md*
> See 20.5.5.1.

## `19.3.12` FinalizationRegistry ( . . . )
*19-the-global-object.md*
> See 26.2.1.

## `19.3.13` Float16Array ( . . . )
*19-the-global-object.md*
> See 23.2.5.

## `19.3.14` Float32Array ( . . . )
*19-the-global-object.md*
> See 23.2.5.

## `19.3.15` Float64Array ( . . . )
*19-the-global-object.md*
> See 23.2.5.

## `19.3.16` Function ( . . . )
*19-the-global-object.md*
> See 20.2.1.

## `19.3.17` Int8Array ( . . . )
*19-the-global-object.md*
> See 23.2.5.

## `19.3.18` Int16Array ( . . . )
*19-the-global-object.md*
> See 23.2.5.

## `19.3.19` Int32Array ( . . . )
*19-the-global-object.md*
> See 23.2.5.

## `19.3.20` Iterator ( . . . )
*19-the-global-object.md*
> See 27.1.3.1.

## `19.3.21` Map ( . . . )
*19-the-global-object.md*
> See 24.1.1.

## `19.3.22` Number ( . . . )
*19-the-global-object.md*
> See 21.1.1.

## `19.3.23` Object ( . . . )
*19-the-global-object.md*
> See 20.1.1.

## `19.3.24` Promise ( . . . )
*19-the-global-object.md*
> See 27.2.3.

## `19.3.25` Proxy ( . . . )
*19-the-global-object.md*
> See 28.2.1.

## `19.3.26` RangeError ( . . . )
*19-the-global-object.md*
> See 20.5.5.2.

## `19.3.27` ReferenceError ( . . . )
*19-the-global-object.md*
> See 20.5.5.3.

## `19.3.28` RegExp ( . . . )
*19-the-global-object.md*
> See 22.2.4.

## `19.3.29` Set ( . . . )
*19-the-global-object.md*
> See 24.2.2.

## `19.3.30` SharedArrayBuffer ( . . . )
*19-the-global-object.md*
> See 25.2.3.

## `19.3.31` String ( . . . )
*19-the-global-object.md*
> See 22.1.1.

## `19.3.32` Symbol ( . . . )
*19-the-global-object.md*
> See 20.4.1.

## `19.3.33` SyntaxError ( . . . )
*19-the-global-object.md*
> See 20.5.5.4.

## `19.3.34` TypeError ( . . . )
*19-the-global-object.md*
> See 20.5.5.5.

## `19.3.35` Uint8Array ( . . . )
*19-the-global-object.md*
> See 23.2.5.

## `19.3.36` Uint8ClampedArray ( . . . )
*19-the-global-object.md*
> See 23.2.5.

## `19.3.37` Uint16Array ( . . . )
*19-the-global-object.md*
> See 23.2.5.

## `19.3.38` Uint32Array ( . . . )
*19-the-global-object.md*
> See 23.2.5.

## `19.3.39` URIError ( . . . )
*19-the-global-object.md*
> See 20.5.5.6.

## `19.3.40` WeakMap ( . . . )
*19-the-global-object.md*
> See 24.3.1.

## `19.3.41` WeakRef ( . . . )
*19-the-global-object.md*
> See 26.1.1.

## `19.3.42` WeakSet ( . . . )
*19-the-global-object.md*
> See 24.4.

## `20.1.1.1` Object ( \[ value \] )
*20-fundamental-objects.md*
> This function performs the following steps when called:

## `20.1.2.1` Object.assign ( target, ...sources )
*20-fundamental-objects.md*
> This function copies the values of all of the enumerable own properties from one or more source objects to a target object.

## `20.1.2.2` Object.create ( O, Properties )
*20-fundamental-objects.md*
> This function creates a new object with a specified prototype.

## `20.1.2.3` Object.defineProperties ( O, Properties )
*20-fundamental-objects.md*
> This function adds own properties and/or updates the attributes of existing own properties of an object.

## `20.1.2.3.1` ObjectDefineProperties ( O, Properties )
*20-fundamental-objects.md*
> The abstract operation ObjectDefineProperties takes arguments O (an Object) and Properties (an ECMAScript language value) and returns either a normal completion containing an Object or a throw completion. It performs the following steps when called:

## `20.1.2.4` Object.defineProperty ( O, P, Attributes )
*20-fundamental-objects.md*
> This function adds an own property and/or updates the attributes of an existing own property of an object.

## `20.1.2.5` Object.entries ( O )
*20-fundamental-objects.md*
> This function performs the following steps when called:

## `20.1.2.6` Object.freeze ( O )
*20-fundamental-objects.md*
> This function performs the following steps when called:

## `20.1.2.7` Object.fromEntries ( iterable )
*20-fundamental-objects.md*
> This function performs the following steps when called:

## `20.1.2.8` Object.getOwnPropertyDescriptor ( O, P )
*20-fundamental-objects.md*
> This function performs the following steps when called:

## `20.1.2.9` Object.getOwnPropertyDescriptors ( O )
*20-fundamental-objects.md*
> This function performs the following steps when called:

## `20.1.2.10` Object.getOwnPropertyNames ( O )
*20-fundamental-objects.md*
> This function performs the following steps when called:

## `20.1.2.11` Object.getOwnPropertySymbols ( O )
*20-fundamental-objects.md*
> This function performs the following steps when called:

## `20.1.2.11.1` GetOwnPropertyKeys ( O, type )
*20-fundamental-objects.md*
> The abstract operation GetOwnPropertyKeys takes arguments O (an ECMAScript language value) and type (string or symbol) and returns either a normal completion containing a List of property keys or a throw completion. It performs the following steps when called:

## `20.1.2.12` Object.getPrototypeOf ( O )
*20-fundamental-objects.md*
> This function performs the following steps when called:

## `20.1.2.13` Object.groupBy ( items, callback )
*20-fundamental-objects.md*
> Note

## `20.1.2.14` Object.hasOwn ( O, P )
*20-fundamental-objects.md*
> This function performs the following steps when called:

## `20.1.2.15` Object.is ( value1, value2 )
*20-fundamental-objects.md*
> This function performs the following steps when called:

## `20.1.2.16` Object.isExtensible ( O )
*20-fundamental-objects.md*
> This function performs the following steps when called:

## `20.1.2.17` Object.isFrozen ( O )
*20-fundamental-objects.md*
> This function performs the following steps when called:

## `20.1.2.18` Object.isSealed ( O )
*20-fundamental-objects.md*
> This function performs the following steps when called:

## `20.1.2.19` Object.keys ( O )
*20-fundamental-objects.md*
> This function performs the following steps when called:

## `20.1.2.20` Object.preventExtensions ( O )
*20-fundamental-objects.md*
> This function performs the following steps when called:

## `20.1.2.22` Object.seal ( O )
*20-fundamental-objects.md*
> This function performs the following steps when called:

## `20.1.2.23` Object.setPrototypeOf ( O, proto )
*20-fundamental-objects.md*
> This function performs the following steps when called:

## `20.1.2.24` Object.values ( O )
*20-fundamental-objects.md*
> This function performs the following steps when called:

## `20.1.3.2` Object.prototype.hasOwnProperty ( V )
*20-fundamental-objects.md*
> This method performs the following steps when called:

## `20.1.3.3` Object.prototype.isPrototypeOf ( V )
*20-fundamental-objects.md*
> This method performs the following steps when called:

## `20.1.3.4` Object.prototype.propertyIsEnumerable ( V )
*20-fundamental-objects.md*
> This method performs the following steps when called:

## `20.1.3.5` Object.prototype.toLocaleString ( \[ reserved1 \[ , reserved2 \] \] )
*20-fundamental-objects.md*
> This method performs the following steps when called:

## `20.1.3.6` Object.prototype.toString (  )
*20-fundamental-objects.md*
> This method performs the following steps when called:

## `20.1.3.7` Object.prototype.valueOf (  )
*20-fundamental-objects.md*
> This method performs the following steps when called:

## `20.1.3.9.1` Object.prototype.\_\_defineGetter\_\_ ( P, getter )
*20-fundamental-objects.md*
> This method performs the following steps when called:

## `20.1.3.9.2` Object.prototype.\_\_defineSetter\_\_ ( P, setter )
*20-fundamental-objects.md*
> This method performs the following steps when called:

## `20.1.3.9.3` Object.prototype.\_\_lookupGetter\_\_ ( P )
*20-fundamental-objects.md*
> This method performs the following steps when called:

## `20.1.3.9.4` Object.prototype.\_\_lookupSetter\_\_ ( P )
*20-fundamental-objects.md*
> This method performs the following steps when called:

## `20.2.1.1` Function ( ...parameterArgs, bodyArg )
*20-fundamental-objects.md*
> The last argument (if any) specifies the body (executable code) of a function; any preceding arguments specify formal parameters.

## `20.2.1.1.1` CreateDynamicFunction ( constructor, newTarget, kind, parameterArgs, bodyArg )
*20-fundamental-objects.md*
> The abstract operation CreateDynamicFunction takes arguments constructor (a constructor), newTarget (a constructor or undefined), kind (normal, generator, async, or async-generator), parameterArgs (a List of ECMAScript language values), and bodyArg (an ECMAScript language value) and returns either a normal completion containing an ECMAScript function object or a throw completion. constructor is the constructor function that is performing this action. newTarget is the constructor that new was initially applied to. parameterArgs and bodyArg reflect the argument values that were passed to constructor. It performs the following steps when called:

## `20.2.3.1` Function.prototype.apply ( thisArg, argArray )
*20-fundamental-objects.md*
> This method performs the following steps when called:

## `20.2.3.2` Function.prototype.bind ( thisArg, ...args )
*20-fundamental-objects.md*
> This method performs the following steps when called:

## `20.2.3.3` Function.prototype.call ( thisArg, ...args )
*20-fundamental-objects.md*
> This method performs the following steps when called:

## `20.2.3.5` Function.prototype.toString (  )
*20-fundamental-objects.md*
> This method performs the following steps when called:

## `20.2.3.6` Function.prototype \[ %Symbol.hasInstance% \] ( V )
*20-fundamental-objects.md*
> This method performs the following steps when called:

## `20.2.5` HostHasSourceTextAvailable ( func )
*20-fundamental-objects.md*
> The host-defined abstract operation HostHasSourceTextAvailable takes argument func (a function object) and returns a Boolean. It allows host environments to prevent the source text from being provided for func.

## `20.3.1.1` Boolean ( value )
*20-fundamental-objects.md*
> This function performs the following steps when called:

## `20.3.3.2` Boolean.prototype.toString (  )
*20-fundamental-objects.md*
> This method performs the following steps when called:

## `20.3.3.3` Boolean.prototype.valueOf (  )
*20-fundamental-objects.md*
> This method performs the following steps when called:

## `20.3.3.3.1` ThisBooleanValue ( value )
*20-fundamental-objects.md*
> The abstract operation ThisBooleanValue takes argument value (an ECMAScript language value) and returns either a normal completion containing a Boolean or a throw completion. It performs the following steps when called:

## `20.4.1.1` Symbol ( \[ description \] )
*20-fundamental-objects.md*
> This function performs the following steps when called:

## `20.4.2.2` Symbol.for ( key )
*20-fundamental-objects.md*
> This function performs the following steps when called:

## `20.4.2.6` Symbol.keyFor ( sym )
*20-fundamental-objects.md*
> This function performs the following steps when called:

## `20.4.3.3` Symbol.prototype.toString (  )
*20-fundamental-objects.md*
> This method performs the following steps when called:

## `20.4.3.3.1` SymbolDescriptiveString ( sym )
*20-fundamental-objects.md*
> The abstract operation SymbolDescriptiveString takes argument sym (a Symbol) and returns a String. It performs the following steps when called:

## `20.4.3.4` Symbol.prototype.valueOf (  )
*20-fundamental-objects.md*
> This method performs the following steps when called:

## `20.4.3.4.1` ThisSymbolValue ( value )
*20-fundamental-objects.md*
> The abstract operation ThisSymbolValue takes argument value (an ECMAScript language value) and returns either a normal completion containing a Symbol or a throw completion. It performs the following steps when called:

## `20.4.3.5` Symbol.prototype \[ %Symbol.toPrimitive% \] ( hint )
*20-fundamental-objects.md*
> This method is called by ECMAScript language operators to convert a Symbol object to a primitive value.

## `20.4.5.1` KeyForSymbol ( sym )
*20-fundamental-objects.md*
> The abstract operation KeyForSymbol takes argument sym (a Symbol) and returns a String or undefined. If sym is in the GlobalSymbolRegistry List, the String used to register sym will be returned. It performs the following steps when called:

## `20.5.1.1` Error ( message \[ , options \] )
*20-fundamental-objects.md*
> This function performs the following steps when called:

## `20.5.3.4` Error.prototype.toString (  )
*20-fundamental-objects.md*
> This method performs the following steps when called:

## `20.5.6.1.1` NativeError ( message \[ , options \] )
*20-fundamental-objects.md*
> Each NativeError function performs the following steps when called:

## `20.5.7.1.1` AggregateError ( errors, message \[ , options \] )
*20-fundamental-objects.md*
> This function performs the following steps when called:

## `20.5.8.1` InstallErrorCause ( O, options )
*20-fundamental-objects.md*
> The abstract operation InstallErrorCause takes arguments O (an Object) and options (an ECMAScript language value) and returns either a normal completion containing unused or a throw completion. It is used to create a "cause" property on O when a "cause" property is present on options. It performs the following steps when called:

## `21.1.1.1` Number ( value )
*21-numbers-and-dates.md*
> This function performs the following steps when called:

## `21.1.2.2` Number.isFinite ( number )
*21-numbers-and-dates.md*
> This function performs the following steps when called:

## `21.1.2.3` Number.isInteger ( number )
*21-numbers-and-dates.md*
> This function performs the following steps when called:

## `21.1.2.4` Number.isNaN ( number )
*21-numbers-and-dates.md*
> This function performs the following steps when called:

## `21.1.2.5` Number.isSafeInteger ( number )
*21-numbers-and-dates.md*
> Note

## `21.1.2.12` Number.parseFloat ( string )
*21-numbers-and-dates.md*
> The initial value of the "parseFloat" property is %parseFloat%.

## `21.1.2.13` Number.parseInt ( string, radix )
*21-numbers-and-dates.md*
> The initial value of the "parseInt" property is %parseInt%.

## `21.1.3.2` Number.prototype.toExponential ( fractionDigits )
*21-numbers-and-dates.md*
> This method returns a String containing this Number value represented in decimal exponential notation with one digit before the significand's decimal point and fractionDigits digits after the significand's decimal point. If fractionDigits is undefined, it includes as many significand digits as necessary to uniquely specify the Number (just like in ToString except that in this case the Number is always output in exponential notation).

## `21.1.3.3` Number.prototype.toFixed ( fractionDigits )
*21-numbers-and-dates.md*
> Note 1

## `21.1.3.4` Number.prototype.toLocaleString ( \[ reserved1 \[ , reserved2 \] \] )
*21-numbers-and-dates.md*
> An ECMAScript implementation that includes the ECMA-402 Internationalization API must implement this method as specified in the ECMA-402 specification. If an ECMAScript implementation does not include the ECMA-402 API the following specification of this method is used:

## `21.1.3.5` Number.prototype.toPrecision ( precision )
*21-numbers-and-dates.md*
> This method returns a String containing this Number value represented either in decimal exponential notation with one digit before the significand's decimal point and precision - 1 digits after the significand's decimal point or in decimal fixed notation with precision significant digits. If precision is undefined, it calls ToString instead.

## `21.1.3.6` Number.prototype.toString ( \[ radix \] )
*21-numbers-and-dates.md*
> Note

## `21.1.3.7` Number.prototype.valueOf (  )
*21-numbers-and-dates.md*
> 1.  Return ? ThisNumberValue(this value).

## `21.1.3.7.1` ThisNumberValue ( value )
*21-numbers-and-dates.md*
> The abstract operation ThisNumberValue takes argument value (an ECMAScript language value) and returns either a normal completion containing a Number or a throw completion. It performs the following steps when called:

## `21.2.1.1` BigInt ( value )
*21-numbers-and-dates.md*
> This function performs the following steps when called:

## `21.2.1.1.1` NumberToBigInt ( number )
*21-numbers-and-dates.md*
> The abstract operation NumberToBigInt takes argument number (a Number) and returns either a normal completion containing a BigInt or a throw completion. It performs the following steps when called:

## `21.2.2.1` BigInt.asIntN ( bits, bigint )
*21-numbers-and-dates.md*
> This function performs the following steps when called:

## `21.2.2.2` BigInt.asUintN ( bits, bigint )
*21-numbers-and-dates.md*
> This function performs the following steps when called:

## `21.2.3.2` BigInt.prototype.toLocaleString ( \[ reserved1 \[ , reserved2 \] \] )
*21-numbers-and-dates.md*
> An ECMAScript implementation that includes the ECMA-402 Internationalization API must implement this method as specified in the ECMA-402 specification. If an ECMAScript implementation does not include the ECMA-402 API the following specification of this method is used:

## `21.2.3.3` BigInt.prototype.toString ( \[ radix \] )
*21-numbers-and-dates.md*
> Note

## `21.2.3.4` BigInt.prototype.valueOf (  )
*21-numbers-and-dates.md*
> 1.  Return ? ThisBigIntValue(this value).

## `21.2.3.4.1` ThisBigIntValue ( value )
*21-numbers-and-dates.md*
> The abstract operation ThisBigIntValue takes argument value (an ECMAScript language value) and returns either a normal completion containing a BigInt or a throw completion. It performs the following steps when called:

## `21.3.2.1` Math.abs ( x )
*21-numbers-and-dates.md*
> This function returns the absolute value of x; the result has the same magnitude as x but has positive sign.

## `21.3.2.2` Math.acos ( x )
*21-numbers-and-dates.md*
> This function returns the inverse cosine of x. The result is expressed in radians and is in the inclusive interval from +0_(𝔽) to 𝔽(π).

## `21.3.2.3` Math.acosh ( x )
*21-numbers-and-dates.md*
> This function returns the inverse hyperbolic cosine of x.

## `21.3.2.4` Math.asin ( x )
*21-numbers-and-dates.md*
> This function returns the inverse sine of x. The result is expressed in radians and is in the inclusive interval from 𝔽(-π / 2) to 𝔽(π / 2).

## `21.3.2.5` Math.asinh ( x )
*21-numbers-and-dates.md*
> This function returns the inverse hyperbolic sine of x.

## `21.3.2.6` Math.atan ( x )
*21-numbers-and-dates.md*
> This function returns the inverse tangent of x. The result is expressed in radians and is in the inclusive interval from 𝔽(-π / 2) to 𝔽(π / 2).

## `21.3.2.7` Math.atanh ( x )
*21-numbers-and-dates.md*
> This function returns the inverse hyperbolic tangent of x.

## `21.3.2.8` Math.atan2 ( y, x )
*21-numbers-and-dates.md*
> This function returns the inverse tangent of the quotient y / x of the arguments y and x, where the signs of y and x are used to determine the quadrant of the result. Note that it is intentional and traditional for the two-argument inverse tangent function that the argument named y be first and the argument named x be second. The result is expressed in radians and is in the inclusive interval from -π to +π.

## `21.3.2.9` Math.cbrt ( x )
*21-numbers-and-dates.md*
> This function returns the cube root of x.

## `21.3.2.10` Math.ceil ( x )
*21-numbers-and-dates.md*
> This function returns the smallest (closest to -∞) integral Number value that is not less than x. If x is already an integral Number, the result is x.

## `21.3.2.11` Math.clz32 ( x )
*21-numbers-and-dates.md*
> This function performs the following steps when called:

## `21.3.2.12` Math.cos ( x )
*21-numbers-and-dates.md*
> This function returns the cosine of x. The argument is expressed in radians.

## `21.3.2.13` Math.cosh ( x )
*21-numbers-and-dates.md*
> This function returns the hyperbolic cosine of x.

## `21.3.2.14` Math.exp ( x )
*21-numbers-and-dates.md*
> This function returns the exponential function of x (e raised to the power of x, where e is the base of the natural logarithms).

## `21.3.2.15` Math.expm1 ( x )
*21-numbers-and-dates.md*
> This function returns the result of subtracting 1 from the exponential function of x (e raised to the power of x, where e is the base of the natural logarithms). The result is computed in a way that is accurate even when the value of x is close to 0.

## `21.3.2.16` Math.floor ( x )
*21-numbers-and-dates.md*
> This function returns the greatest (closest to +∞) integral Number value that is not greater than x. If x is already an integral Number, the result is x.

## `21.3.2.17` Math.fround ( x )
*21-numbers-and-dates.md*
> This function performs the following steps when called:

## `21.3.2.18` Math.f16round ( x )
*21-numbers-and-dates.md*
> This function performs the following steps when called:

## `21.3.2.19` Math.hypot ( ...args )
*21-numbers-and-dates.md*
> Given zero or more arguments, this function returns the square root of the sum of squares of its arguments.

## `21.3.2.20` Math.imul ( x, y )
*21-numbers-and-dates.md*
> This function performs the following steps when called:

## `21.3.2.21` Math.log ( x )
*21-numbers-and-dates.md*
> This function returns the natural logarithm of x.

## `21.3.2.22` Math.log1p ( x )
*21-numbers-and-dates.md*
> This function returns the natural logarithm of 1 + x. The result is computed in a way that is accurate even when the value of x is close to zero.

## `21.3.2.23` Math.log10 ( x )
*21-numbers-and-dates.md*
> This function returns the base 10 logarithm of x.

## `21.3.2.24` Math.log2 ( x )
*21-numbers-and-dates.md*
> This function returns the base 2 logarithm of x.

## `21.3.2.25` Math.max ( ...args )
*21-numbers-and-dates.md*
> Given zero or more arguments, this function calls ToNumber on each of the arguments and returns the largest of the resulting values.

## `21.3.2.26` Math.min ( ...args )
*21-numbers-and-dates.md*
> Given zero or more arguments, this function calls ToNumber on each of the arguments and returns the smallest of the resulting values.

## `21.3.2.27` Math.pow ( base, exponent )
*21-numbers-and-dates.md*
> This function performs the following steps when called:

## `21.3.2.28` Math.random (  )
*21-numbers-and-dates.md*
> This function returns a Number value with positive sign, greater than or equal to +0_(𝔽) but strictly less than 1_(𝔽), chosen randomly or pseudo randomly with approximately uniform distribution over that range, using an implementation-defined algorithm or strategy.

## `21.3.2.29` Math.round ( x )
*21-numbers-and-dates.md*
> This function returns the Number value that is closest to x and is integral. If two integral Numbers are equally close to x, then the result is the Number value that is closer to +∞. If x is already integral, the result is x.

## `21.3.2.30` Math.sign ( x )
*21-numbers-and-dates.md*
> This function returns the sign of x, indicating whether x is positive, negative, or zero.

## `21.3.2.31` Math.sin ( x )
*21-numbers-and-dates.md*
> This function returns the sine of x. The argument is expressed in radians.

## `21.3.2.32` Math.sinh ( x )
*21-numbers-and-dates.md*
> This function returns the hyperbolic sine of x.

## `21.3.2.33` Math.sqrt ( x )
*21-numbers-and-dates.md*
> This function returns the square root of x.

## `21.3.2.34` Math.tan ( x )
*21-numbers-and-dates.md*
> This function returns the tangent of x. The argument is expressed in radians.

## `21.3.2.35` Math.tanh ( x )
*21-numbers-and-dates.md*
> This function returns the hyperbolic tangent of x.

## `21.3.2.36` Math.trunc ( x )
*21-numbers-and-dates.md*
> This function returns the integral part of the number x, removing any fractional digits. If x is already integral, the result is x.

## `21.4.1.3` Day ( t )
*21-numbers-and-dates.md*
> The abstract operation Day takes argument t (a finite time value) and returns an integral Number. It returns the day number of the day in which t falls. It performs the following steps when called:

## `21.4.1.4` TimeWithinDay ( t )
*21-numbers-and-dates.md*
> The abstract operation TimeWithinDay takes argument t (a finite time value) and returns an integral Number in the interval from +0_(𝔽) (inclusive) to msPerDay (exclusive). It returns the number of milliseconds since the start of the day in which t falls. It performs the following steps when called:

## `21.4.1.5` DaysInYear ( y )
*21-numbers-and-dates.md*
> The abstract operation DaysInYear takes argument y (an integral Number) and returns 365_(𝔽) or 366_(𝔽). It returns the number of days in year y. Leap years have 366 days; all other years have 365. It performs the following steps when called:

## `21.4.1.6` DayFromYear ( y )
*21-numbers-and-dates.md*
> The abstract operation DayFromYear takes argument y (an integral Number) and returns an integral Number. It returns the day number of the first day of year y. It performs the following steps when called:

## `21.4.1.7` TimeFromYear ( y )
*21-numbers-and-dates.md*
> The abstract operation TimeFromYear takes argument y (an integral Number) and returns a time value. It returns the time value of the start of year y. It performs the following steps when called:

## `21.4.1.8` YearFromTime ( t )
*21-numbers-and-dates.md*
> The abstract operation YearFromTime takes argument t (a finite time value) and returns an integral Number. It returns the year in which t falls. It performs the following steps when called:

## `21.4.1.9` DayWithinYear ( t )
*21-numbers-and-dates.md*
> The abstract operation DayWithinYear takes argument t (a finite time value) and returns an integral Number in the inclusive interval from +0_(𝔽) to 365_(𝔽). It performs the following steps when called:

## `21.4.1.10` InLeapYear ( t )
*21-numbers-and-dates.md*
> The abstract operation InLeapYear takes argument t (a finite time value) and returns +0_(𝔽) or 1_(𝔽). It returns 1_(𝔽) if t is within a leap year and +0_(𝔽) otherwise. It performs the following steps when called:

## `21.4.1.11` MonthFromTime ( t )
*21-numbers-and-dates.md*
> The abstract operation MonthFromTime takes argument t (a finite time value) and returns an integral Number in the inclusive interval from +0_(𝔽) to 11_(𝔽). It returns a Number identifying the month in which t falls. A month value of +0_(𝔽) specifies January; 1_(𝔽) specifies February; 2_(𝔽) specifies March; 3_(𝔽) specifies April; 4_(𝔽) specifies May; 5_(𝔽) specifies June; 6_(𝔽) specifies July; 7_(𝔽) specifies August; 8_(𝔽) specifies September; 9_(𝔽) specifies October; 10_(𝔽) specifies November; and 11_(𝔽) specifies December. Note that MonthFromTime(+0_(𝔽)) = +0_(𝔽), corresponding to Thursday, 1 January 1970. It performs the following steps when called:

## `21.4.1.12` DateFromTime ( t )
*21-numbers-and-dates.md*
> The abstract operation DateFromTime takes argument t (a finite time value) and returns an integral Number in the inclusive interval from 1_(𝔽) to 31_(𝔽). It returns the day of the month in which t falls. It performs the following steps when called:

## `21.4.1.13` WeekDay ( t )
*21-numbers-and-dates.md*
> The abstract operation WeekDay takes argument t (a finite time value) and returns an integral Number in the inclusive interval from +0_(𝔽) to 6_(𝔽). It returns a Number identifying the day of the week in which t falls. A weekday value of +0_(𝔽) specifies Sunday; 1_(𝔽) specifies Monday; 2_(𝔽) specifies Tuesday; 3_(𝔽) specifies Wednesday; 4_(𝔽) specifies Thursday; 5_(𝔽) specifies Friday; and 6_(𝔽) specifies Saturday. Note that WeekDay(+0_(𝔽)) = 4_(𝔽), corresponding to Thursday, 1 January 1970. It performs the following steps when called:

## `21.4.1.14` HourFromTime ( t )
*21-numbers-and-dates.md*
> The abstract operation HourFromTime takes argument t (a finite time value) and returns an integral Number in the inclusive interval from +0_(𝔽) to 23_(𝔽). It returns the hour of the day in which t falls. It performs the following steps when called:

## `21.4.1.15` MinFromTime ( t )
*21-numbers-and-dates.md*
> The abstract operation MinFromTime takes argument t (a finite time value) and returns an integral Number in the inclusive interval from +0_(𝔽) to 59_(𝔽). It returns the minute of the hour in which t falls. It performs the following steps when called:

## `21.4.1.16` SecFromTime ( t )
*21-numbers-and-dates.md*
> The abstract operation SecFromTime takes argument t (a finite time value) and returns an integral Number in the inclusive interval from +0_(𝔽) to 59_(𝔽). It returns the second of the minute in which t falls. It performs the following steps when called:

## `21.4.1.17` msFromTime ( t )
*21-numbers-and-dates.md*
> The abstract operation msFromTime takes argument t (a finite time value) and returns an integral Number in the inclusive interval from +0_(𝔽) to 999_(𝔽). It returns the millisecond of the second in which t falls. It performs the following steps when called:

## `21.4.1.18` GetUTCEpochNanoseconds ( year, month, day, hour, minute, second, millisecond, microsecond, nanosecond )
*21-numbers-and-dates.md*
> The abstract operation GetUTCEpochNanoseconds takes arguments year (an integer), month (an integer in the inclusive interval from 1 to 12), day (an integer in the inclusive interval from 1 to 31), hour (an integer in the inclusive interval from 0 to 23), minute (an integer in the inclusive interval from 0 to 59), second (an integer in the inclusive interval from 0 to 59), millisecond (an integer in the inclusive interval from 0 to 999), microsecond (an integer in the inclusive interval from 0 to 999), and nanosecond (an integer in the inclusive interval from 0 to 999) and returns a BigInt. The returned value represents a number of nanoseconds since the epoch that corresponds to the given ISO 8601 calendar date and wall-clock time in UTC. It performs the following steps when called:

## `21.4.1.20` GetNamedTimeZoneEpochNanoseconds ( timeZoneIdentifier, year, month, day, hour, minute, second, millisecond, microsecond, nanosecond )
*21-numbers-and-dates.md*
> The implementation-defined abstract operation GetNamedTimeZoneEpochNanoseconds takes arguments timeZoneIdentifier (a String), year (an integer), month (an integer in the inclusive interval from 1 to 12), day (an integer in the inclusive interval from 1 to 31), hour (an integer in the inclusive interval from 0 to 23), minute (an integer in the inclusive interval from 0 to 59), second (an integer in the inclusive interval from 0 to 59), millisecond (an integer in the inclusive interval from 0 to 999), microsecond (an integer in the inclusive interval from 0 to 999), and nanosecond (an integer in the inclusive interval from 0 to 999) and returns a List of BigInts. Each value in the returned List represents a number of nanoseconds since the epoch that corresponds to the given ISO 8601 calendar date and wall-clock time in the named time zone identified by timeZoneIdentifier.

## `21.4.1.21` GetNamedTimeZoneOffsetNanoseconds ( timeZoneIdentifier, epochNanoseconds )
*21-numbers-and-dates.md*
> The implementation-defined abstract operation GetNamedTimeZoneOffsetNanoseconds takes arguments timeZoneIdentifier (a String) and epochNanoseconds (a BigInt) and returns an integer.

## `21.4.1.23` AvailableNamedTimeZoneIdentifiers (  )
*21-numbers-and-dates.md*
> The implementation-defined abstract operation AvailableNamedTimeZoneIdentifiers takes no arguments and returns a List of Time Zone Identifier Records. Its result describes all available named time zone identifiers in this implementation, as well as the primary time zone identifier corresponding to each available named time zone identifier. The List is ordered according to the [[Identifier]] field of each Time Zone Identifier Record.

## `21.4.1.24` SystemTimeZoneIdentifier (  )
*21-numbers-and-dates.md*
> The implementation-defined abstract operation SystemTimeZoneIdentifier takes no arguments and returns a String. It returns a String representing the host environment's current time zone, which is either a String representing a UTC offset for which IsTimeZoneOffsetString returns true, or a primary time zone identifier. It performs the following steps when called:

## `21.4.1.25` LocalTime ( t )
*21-numbers-and-dates.md*
> The abstract operation LocalTime takes argument t (a finite time value) and returns an integral Number. It converts t from UTC to local time. The local political rules for standard time and daylight saving time in effect at t should be used to determine the result in the way specified in this section. It performs the following steps when called:

## `21.4.1.26` UTC ( t )
*21-numbers-and-dates.md*
> The abstract operation UTC takes argument t (a Number) and returns a time value. It converts t from local time to a UTC time value. The local political rules for standard time and daylight saving time in effect at t should be used to determine the result in the way specified in this section. It performs the following steps when called:

## `21.4.1.27` MakeTime ( hour, min, sec, ms )
*21-numbers-and-dates.md*
> The abstract operation MakeTime takes arguments hour (a Number), min (a Number), sec (a Number), and ms (a Number) and returns a Number. It calculates a number of milliseconds. It performs the following steps when called:

## `21.4.1.28` MakeDay ( year, month, date )
*21-numbers-and-dates.md*
> The abstract operation MakeDay takes arguments year (a Number), month (a Number), and date (a Number) and returns a Number. It calculates a number of days. It performs the following steps when called:

## `21.4.1.29` MakeDate ( day, time )
*21-numbers-and-dates.md*
> The abstract operation MakeDate takes arguments day (a Number) and time (a Number) and returns a Number. It calculates a number of milliseconds. It performs the following steps when called:

## `21.4.1.30` MakeFullYear ( year )
*21-numbers-and-dates.md*
> The abstract operation MakeFullYear takes argument year (a Number) and returns an integral Number or NaN. It returns the full year associated with the integer part of year, interpreting any value in the inclusive interval from 0 to 99 as a count of years since the start of 1900. For alignment with the proleptic Gregorian calendar, "full year" is defined as the signed count of complete years since the start of year 0 (1 B.C.). It performs the following steps when called:

## `21.4.1.31` TimeClip ( time )
*21-numbers-and-dates.md*
> The abstract operation TimeClip takes argument time (a Number) and returns a Number. It calculates a number of milliseconds. It performs the following steps when called:

## `21.4.1.33.1` IsTimeZoneOffsetString ( offsetString )
*21-numbers-and-dates.md*
> The abstract operation IsTimeZoneOffsetString takes argument offsetString (a String) and returns a Boolean. The return value indicates whether offsetString conforms to the grammar given by UTCOffset. It performs the following steps when called:

## `21.4.1.33.2` ParseTimeZoneOffsetString ( offsetString )
*21-numbers-and-dates.md*
> The abstract operation ParseTimeZoneOffsetString takes argument offsetString (a String) and returns an integer. The return value is the UTC offset, as a number of nanoseconds, that corresponds to the String offsetString. It performs the following steps when called:

## `21.4.2.1` Date ( ...values )
*21-numbers-and-dates.md*
> This function performs the following steps when called:

## `21.4.3.1` Date.now (  )
*21-numbers-and-dates.md*
> This function returns the time value designating the UTC date and time of the occurrence of the call to it.

## `21.4.3.2` Date.parse ( string )
*21-numbers-and-dates.md*
> This function applies the ToString operator to its argument. If ToString results in an abrupt completion the Completion Record is immediately returned. Otherwise, this function interprets the resulting String as a date and time; it returns a Number, the UTC time value corresponding to the date and time. The String may be interpreted as a local time, a UTC time, or a time in some other time zone, depending on the contents of the String. The function first attempts to parse the String according to the format described in Date Time String Format (21.4.1.32), including expanded years. If the String does not conform to that format the function may fall back to any implementation-specific heuristics or implementation-specific date formats. Strings that are unrecognizable or contain out-of-bounds format element values shall cause this function to return NaN.

## `21.4.3.4` Date.UTC ( year \[ , month \[ , date \[ , hours \[ , minutes \[ , seconds \[ , ms \] \] \] \] \] \] )
*21-numbers-and-dates.md*
> This function performs the following steps when called:

## `21.4.4.2` Date.prototype.getDate (  )
*21-numbers-and-dates.md*
> This method performs the following steps when called:

## `21.4.4.3` Date.prototype.getDay (  )
*21-numbers-and-dates.md*
> This method performs the following steps when called:

## `21.4.4.4` Date.prototype.getFullYear (  )
*21-numbers-and-dates.md*
> This method performs the following steps when called:

## `21.4.4.5` Date.prototype.getHours (  )
*21-numbers-and-dates.md*
> This method performs the following steps when called:

## `21.4.4.6` Date.prototype.getMilliseconds (  )
*21-numbers-and-dates.md*
> This method performs the following steps when called:

## `21.4.4.7` Date.prototype.getMinutes (  )
*21-numbers-and-dates.md*
> This method performs the following steps when called:

## `21.4.4.8` Date.prototype.getMonth (  )
*21-numbers-and-dates.md*
> This method performs the following steps when called:

## `21.4.4.9` Date.prototype.getSeconds (  )
*21-numbers-and-dates.md*
> This method performs the following steps when called:

## `21.4.4.10` Date.prototype.getTime (  )
*21-numbers-and-dates.md*
> This method performs the following steps when called:

## `21.4.4.11` Date.prototype.getTimezoneOffset (  )
*21-numbers-and-dates.md*
> This method performs the following steps when called:

## `21.4.4.12` Date.prototype.getUTCDate (  )
*21-numbers-and-dates.md*
> This method performs the following steps when called:

## `21.4.4.13` Date.prototype.getUTCDay (  )
*21-numbers-and-dates.md*
> This method performs the following steps when called:

## `21.4.4.14` Date.prototype.getUTCFullYear (  )
*21-numbers-and-dates.md*
> This method performs the following steps when called:

## `21.4.4.15` Date.prototype.getUTCHours (  )
*21-numbers-and-dates.md*
> This method performs the following steps when called:

## `21.4.4.16` Date.prototype.getUTCMilliseconds (  )
*21-numbers-and-dates.md*
> This method performs the following steps when called:

## `21.4.4.17` Date.prototype.getUTCMinutes (  )
*21-numbers-and-dates.md*
> This method performs the following steps when called:

## `21.4.4.18` Date.prototype.getUTCMonth (  )
*21-numbers-and-dates.md*
> This method performs the following steps when called:

## `21.4.4.19` Date.prototype.getUTCSeconds (  )
*21-numbers-and-dates.md*
> This method performs the following steps when called:

## `21.4.4.20` Date.prototype.setDate ( date )
*21-numbers-and-dates.md*
> This method performs the following steps when called:

## `21.4.4.21` Date.prototype.setFullYear ( year \[ , month \[ , date \] \] )
*21-numbers-and-dates.md*
> This method performs the following steps when called:

## `21.4.4.22` Date.prototype.setHours ( hour \[ , min \[ , sec \[ , ms \] \] \] )
*21-numbers-and-dates.md*
> This method performs the following steps when called:

## `21.4.4.23` Date.prototype.setMilliseconds ( ms )
*21-numbers-and-dates.md*
> This method performs the following steps when called:

## `21.4.4.24` Date.prototype.setMinutes ( min \[ , sec \[ , ms \] \] )
*21-numbers-and-dates.md*
> This method performs the following steps when called:

## `21.4.4.25` Date.prototype.setMonth ( month \[ , date \] )
*21-numbers-and-dates.md*
> This method performs the following steps when called:

## `21.4.4.26` Date.prototype.setSeconds ( sec \[ , ms \] )
*21-numbers-and-dates.md*
> This method performs the following steps when called:

## `21.4.4.27` Date.prototype.setTime ( time )
*21-numbers-and-dates.md*
> This method performs the following steps when called:

## `21.4.4.28` Date.prototype.setUTCDate ( date )
*21-numbers-and-dates.md*
> This method performs the following steps when called:

## `21.4.4.29` Date.prototype.setUTCFullYear ( year \[ , month \[ , date \] \] )
*21-numbers-and-dates.md*
> This method performs the following steps when called:

## `21.4.4.30` Date.prototype.setUTCHours ( hour \[ , min \[ , sec \[ , ms \] \] \] )
*21-numbers-and-dates.md*
> This method performs the following steps when called:

## `21.4.4.31` Date.prototype.setUTCMilliseconds ( ms )
*21-numbers-and-dates.md*
> This method performs the following steps when called:

## `21.4.4.32` Date.prototype.setUTCMinutes ( min \[ , sec \[ , ms \] \] )
*21-numbers-and-dates.md*
> This method performs the following steps when called:

## `21.4.4.33` Date.prototype.setUTCMonth ( month \[ , date \] )
*21-numbers-and-dates.md*
> This method performs the following steps when called:

## `21.4.4.34` Date.prototype.setUTCSeconds ( sec \[ , ms \] )
*21-numbers-and-dates.md*
> This method performs the following steps when called:

## `21.4.4.35` Date.prototype.toDateString (  )
*21-numbers-and-dates.md*
> This method performs the following steps when called:

## `21.4.4.36` Date.prototype.toISOString (  )
*21-numbers-and-dates.md*
> This method performs the following steps when called:

## `21.4.4.37` Date.prototype.toJSON ( key )
*21-numbers-and-dates.md*
> This method provides a String representation of a Date for use by JSON.stringify (25.5.2).

## `21.4.4.38` Date.prototype.toLocaleDateString ( \[ reserved1 \[ , reserved2 \] \] )
*21-numbers-and-dates.md*
> An ECMAScript implementation that includes the ECMA-402 Internationalization API must implement this method as specified in the ECMA-402 specification. If an ECMAScript implementation does not include the ECMA-402 API the following specification of this method is used:

## `21.4.4.39` Date.prototype.toLocaleString ( \[ reserved1 \[ , reserved2 \] \] )
*21-numbers-and-dates.md*
> An ECMAScript implementation that includes the ECMA-402 Internationalization API must implement this method as specified in the ECMA-402 specification. If an ECMAScript implementation does not include the ECMA-402 API the following specification of this method is used:

## `21.4.4.40` Date.prototype.toLocaleTimeString ( \[ reserved1 \[ , reserved2 \] \] )
*21-numbers-and-dates.md*
> An ECMAScript implementation that includes the ECMA-402 Internationalization API must implement this method as specified in the ECMA-402 specification. If an ECMAScript implementation does not include the ECMA-402 API the following specification of this method is used:

## `21.4.4.41` Date.prototype.toString (  )
*21-numbers-and-dates.md*
> This method performs the following steps when called:

## `21.4.4.41.1` TimeString ( tv )
*21-numbers-and-dates.md*
> The abstract operation TimeString takes argument tv (a Number, but not NaN) and returns a String. It performs the following steps when called:

## `21.4.4.41.2` DateString ( tv )
*21-numbers-and-dates.md*
> The abstract operation DateString takes argument tv (a Number, but not NaN) and returns a String. It performs the following steps when called:

## `21.4.4.41.3` TimeZoneString ( tv )
*21-numbers-and-dates.md*
> The abstract operation TimeZoneString takes argument tv (an integral Number) and returns a String. It performs the following steps when called:

## `21.4.4.41.4` ToDateString ( tv )
*21-numbers-and-dates.md*
> The abstract operation ToDateString takes argument tv (an integral Number or NaN) and returns a String. It performs the following steps when called:

## `21.4.4.42` Date.prototype.toTimeString (  )
*21-numbers-and-dates.md*
> This method performs the following steps when called:

## `21.4.4.43` Date.prototype.toUTCString (  )
*21-numbers-and-dates.md*
> This method returns a String value representing the instant in time corresponding to the this value. The format of the String is based upon "HTTP-date" from RFC 7231, generalized to support the full range of times supported by ECMAScript Dates.

## `21.4.4.44` Date.prototype.valueOf (  )
*21-numbers-and-dates.md*
> This method performs the following steps when called:

## `21.4.4.45` Date.prototype \[ %Symbol.toPrimitive% \] ( hint )
*21-numbers-and-dates.md*
> This method is called by ECMAScript language operators to convert a Date to a primitive value. The allowed values for hint are "default", "number", and "string". Dates are unique among built-in ECMAScript object in that they treat "default" as being equivalent to "string", All other built-in ECMAScript objects treat "default" as being equivalent to "number".

## `22.1.1.1` String ( value )
*22-text-processing.md*
> This function performs the following steps when called:

## `22.1.2.1` String.fromCharCode ( ...codeUnits )
*22-text-processing.md*
> This function may be called with any number of arguments which form the rest parameter codeUnits.

## `22.1.2.2` String.fromCodePoint ( ...codePoints )
*22-text-processing.md*
> This function may be called with any number of arguments which form the rest parameter codePoints.

## `22.1.2.4` String.raw ( template, ...substitutions )
*22-text-processing.md*
> This function may be called with a variable number of arguments. The first argument is template and the remainder of the arguments form the List substitutions.

## `22.1.3.1` String.prototype.at ( index )
*22-text-processing.md*
> 1.  Let O be ? RequireObjectCoercible(this value).

## `22.1.3.2` String.prototype.charAt ( pos )
*22-text-processing.md*
> Note 1

## `22.1.3.3` String.prototype.charCodeAt ( pos )
*22-text-processing.md*
> Note 1

## `22.1.3.4` String.prototype.codePointAt ( pos )
*22-text-processing.md*
> Note 1

## `22.1.3.5` String.prototype.concat ( ...args )
*22-text-processing.md*
> Note 1

## `22.1.3.7` String.prototype.endsWith ( searchString \[ , endPosition \] )
*22-text-processing.md*
> This method performs the following steps when called:

## `22.1.3.8` String.prototype.includes ( searchString \[ , position \] )
*22-text-processing.md*
> This method performs the following steps when called:

## `22.1.3.9` String.prototype.indexOf ( searchString \[ , position \] )
*22-text-processing.md*
> Note 1

## `22.1.3.10` String.prototype.isWellFormed (  )
*22-text-processing.md*
> This method performs the following steps when called:

## `22.1.3.11` String.prototype.lastIndexOf ( searchString \[ , position \] )
*22-text-processing.md*
> Note 1

## `22.1.3.12` String.prototype.localeCompare ( that \[ , reserved1 \[ , reserved2 \] \] )
*22-text-processing.md*
> An ECMAScript implementation that includes the ECMA-402 Internationalization API must implement this method as specified in the ECMA-402 specification. If an ECMAScript implementation does not include the ECMA-402 API the following specification of this method is used:

## `22.1.3.13` String.prototype.match ( regexp )
*22-text-processing.md*
> This method performs the following steps when called:

## `22.1.3.14` String.prototype.matchAll ( regexp )
*22-text-processing.md*
> This method performs a regular expression match of the String representing the this value against regexp and returns an iterator that yields match results. Each match result is an Array containing the matched portion of the String as the first element, followed by the portions matched by any capturing groups. If the regular expression never matches, the returned iterator does not yield any match results.

## `22.1.3.15` String.prototype.normalize ( \[ form \] )
*22-text-processing.md*
> This method performs the following steps when called:

## `22.1.3.16` String.prototype.padEnd ( maxLength \[ , fillString \] )
*22-text-processing.md*
> This method performs the following steps when called:

## `22.1.3.17` String.prototype.padStart ( maxLength \[ , fillString \] )
*22-text-processing.md*
> This method performs the following steps when called:

## `22.1.3.17.1` StringPaddingBuiltinsImpl ( O, maxLength, fillString, placement )
*22-text-processing.md*
> The abstract operation StringPaddingBuiltinsImpl takes arguments O (an ECMAScript language value), maxLength (an ECMAScript language value), fillString (an ECMAScript language value), and placement (start or end) and returns either a normal completion containing a String or a throw completion. It performs the following steps when called:

## `22.1.3.17.2` StringPad ( S, maxLength, fillString, placement )
*22-text-processing.md*
> The abstract operation StringPad takes arguments S (a String), maxLength (a non-negative integer), fillString (a String), and placement (start or end) and returns a String. It performs the following steps when called:

## `22.1.3.17.3` ToZeroPaddedDecimalString ( n, minLength )
*22-text-processing.md*
> The abstract operation ToZeroPaddedDecimalString takes arguments n (a non-negative integer) and minLength (a non-negative integer) and returns a String. It performs the following steps when called:

## `22.1.3.18` String.prototype.repeat ( count )
*22-text-processing.md*
> This method performs the following steps when called:

## `22.1.3.19` String.prototype.replace ( searchValue, replaceValue )
*22-text-processing.md*
> This method performs the following steps when called:

## `22.1.3.19.1` GetSubstitution ( matched, str, position, captures, namedCaptures, replacementTemplate )
*22-text-processing.md*
> The abstract operation GetSubstitution takes arguments matched (a String), str (a String), position (a non-negative integer), captures (a List of either Strings or undefined), namedCaptures (an Object or undefined), and replacementTemplate (a String) and returns either a normal completion containing a String or a throw completion. For the purposes of this abstract operation, a *decimal digit* is a code unit in the inclusive interval from 0x0030 (DIGIT ZERO) to 0x0039 (DIGIT NINE). It performs the following steps when called:

## `22.1.3.20` String.prototype.replaceAll ( searchValue, replaceValue )
*22-text-processing.md*
> This method performs the following steps when called:

## `22.1.3.21` String.prototype.search ( regexp )
*22-text-processing.md*
> This method performs the following steps when called:

## `22.1.3.22` String.prototype.slice ( start, end )
*22-text-processing.md*
> This method returns a substring of the result of converting this object to a String, starting from index start and running to, but not including, index end (or through the end of the String if end is undefined). If start is negative, it is treated as sourceLength + start where sourceLength is the length of the String. If end is negative, it is treated as sourceLength + end where sourceLength is the length of the String. The result is a String value, not a String object.

## `22.1.3.23` String.prototype.split ( separator, limit )
*22-text-processing.md*
> This method returns an Array into which substrings of the result of converting this object to a String have been stored. The substrings are determined by searching from left to right for occurrences of separator; these occurrences are not part of any String in the returned array, but serve to divide up the String value. The value of separator may be a String of any length or it may be an object, such as a RegExp, that has a %Symbol.split% method.

## `22.1.3.24` String.prototype.startsWith ( searchString \[ , position \] )
*22-text-processing.md*
> This method performs the following steps when called:

## `22.1.3.25` String.prototype.substring ( start, end )
*22-text-processing.md*
> This method returns a substring of the result of converting this object to a String, starting from index start and running to, but not including, index end of the String (or through the end of the String if end is undefined). The result is a String value, not a String object.

## `22.1.3.26` String.prototype.toLocaleLowerCase ( \[ reserved1 \[ , reserved2 \] \] )
*22-text-processing.md*
> An ECMAScript implementation that includes the ECMA-402 Internationalization API must implement this method as specified in the ECMA-402 specification. If an ECMAScript implementation does not include the ECMA-402 API the following specification of this method is used:

## `22.1.3.27` String.prototype.toLocaleUpperCase ( \[ reserved1 \[ , reserved2 \] \] )
*22-text-processing.md*
> An ECMAScript implementation that includes the ECMA-402 Internationalization API must implement this method as specified in the ECMA-402 specification. If an ECMAScript implementation does not include the ECMA-402 API the following specification of this method is used:

## `22.1.3.28` String.prototype.toLowerCase (  )
*22-text-processing.md*
> This method interprets a String value as a sequence of UTF-16 encoded code points, as described in 6.1.4.

## `22.1.3.29` String.prototype.toString (  )
*22-text-processing.md*
> This method performs the following steps when called:

## `22.1.3.30` String.prototype.toUpperCase (  )
*22-text-processing.md*
> This method interprets a String value as a sequence of UTF-16 encoded code points, as described in 6.1.4.

## `22.1.3.31` String.prototype.toWellFormed (  )
*22-text-processing.md*
> This method returns a String representation of this object with all leading surrogates and trailing surrogates that are not part of a surrogate pair replaced with U+FFFD (REPLACEMENT CHARACTER).

## `22.1.3.32` String.prototype.trim (  )
*22-text-processing.md*
> This method interprets a String value as a sequence of UTF-16 encoded code points, as described in 6.1.4.

## `22.1.3.32.1` TrimString ( string, where )
*22-text-processing.md*
> The abstract operation TrimString takes arguments string (an ECMAScript language value) and where (start, end, or start+end) and returns either a normal completion containing a String or a throw completion. It interprets string as a sequence of UTF-16 encoded code points, as described in 6.1.4. It performs the following steps when called:

## `22.1.3.33` String.prototype.trimEnd (  )
*22-text-processing.md*
> This method interprets a String value as a sequence of UTF-16 encoded code points, as described in 6.1.4.

## `22.1.3.34` String.prototype.trimStart (  )
*22-text-processing.md*
> This method interprets a String value as a sequence of UTF-16 encoded code points, as described in 6.1.4.

## `22.1.3.35` String.prototype.valueOf (  )
*22-text-processing.md*
> This method performs the following steps when called:

## `22.1.3.35.1` ThisStringValue ( value )
*22-text-processing.md*
> The abstract operation ThisStringValue takes argument value (an ECMAScript language value) and returns either a normal completion containing a String or a throw completion. It performs the following steps when called:

## `22.1.3.36` String.prototype \[ %Symbol.iterator% \] (  )
*22-text-processing.md*
> This method returns an iterator object that iterates over the code points of a String value, returning each code point as a String value.

## `22.1.5.1.1` %StringIteratorPrototype%.next (  )
*22-text-processing.md*
> 1.  Return ? GeneratorResume(this value, empty, "%StringIteratorPrototype%").

## `22.2.1.2` Static Semantics: CountLeftCapturingParensWithin ( node )
*22-text-processing.md*
> The abstract operation CountLeftCapturingParensWithin takes argument node (a Parse Node) and returns a non-negative integer. It returns the number of left-capturing parentheses in node. A left-capturing parenthesis is any ( pattern character that is matched by the ( terminal of the Atom :: ( GroupSpecifieropt Disjunction ) production.

## `22.2.1.3` Static Semantics: CountLeftCapturingParensBefore ( node )
*22-text-processing.md*
> The abstract operation CountLeftCapturingParensBefore takes argument node (a Parse Node) and returns a non-negative integer. It returns the number of left-capturing parentheses within the enclosing pattern that occur to the left of node.

## `22.2.1.4` Static Semantics: MightBothParticipate ( x, y )
*22-text-processing.md*
> The abstract operation MightBothParticipate takes arguments x (a Parse Node) and y (a Parse Node) and returns a Boolean. It performs the following steps when called:

## `22.2.1.9` Static Semantics: GroupSpecifiersThatMatch ( thisGroupName )
*22-text-processing.md*
> The abstract operation GroupSpecifiersThatMatch takes argument thisGroupName (a GroupName Parse Node) and returns a List of GroupSpecifier Parse Nodes. It performs the following steps when called:

## `22.2.2.3.1` RepeatMatcher ( m, min, max, greedy, x, c, parenIndex, parenCount )
*22-text-processing.md*
> The abstract operation RepeatMatcher takes arguments m (a Matcher), min (a non-negative integer), max (a non-negative integer or +∞), greedy (a Boolean), x (a MatchState), c (a MatcherContinuation), parenIndex (a non-negative integer), and parenCount (a non-negative integer) and returns either a MatchState or failure. It performs the following steps when called:

## `22.2.2.3.2` EmptyMatcher (  )
*22-text-processing.md*
> The abstract operation EmptyMatcher takes no arguments and returns a Matcher. It performs the following steps when called:

## `22.2.2.3.3` MatchTwoAlternatives ( m1, m2 )
*22-text-processing.md*
> The abstract operation MatchTwoAlternatives takes arguments m1 (a Matcher) and m2 (a Matcher) and returns a Matcher. It performs the following steps when called:

## `22.2.2.3.4` MatchSequence ( m1, m2, direction )
*22-text-processing.md*
> The abstract operation MatchSequence takes arguments m1 (a Matcher), m2 (a Matcher), and direction (forward or backward) and returns a Matcher. It performs the following steps when called:

## `22.2.2.4.1` IsWordChar ( rer, Input, e )
*22-text-processing.md*
> The abstract operation IsWordChar takes arguments rer (a RegExp Record), Input (a List of characters), and e (an integer) and returns a Boolean. It performs the following steps when called:

## `22.2.2.7.1` CharacterSetMatcher ( rer, A, invert, direction )
*22-text-processing.md*
> The abstract operation CharacterSetMatcher takes arguments rer (a RegExp Record), A (a CharSet), invert (a Boolean), and direction (forward or backward) and returns a Matcher. It performs the following steps when called:

## `22.2.2.7.2` BackreferenceMatcher ( rer, ns, direction )
*22-text-processing.md*
> The abstract operation BackreferenceMatcher takes arguments rer (a RegExp Record), ns (a List of positive integers), and direction (forward or backward) and returns a Matcher. It performs the following steps when called:

## `22.2.2.7.3` Canonicalize ( rer, ch )
*22-text-processing.md*
> The abstract operation Canonicalize takes arguments rer (a RegExp Record) and ch (a character) and returns a character. It performs the following steps when called:

## `22.2.2.7.4` UpdateModifiers ( rer, add, remove )
*22-text-processing.md*
> The abstract operation UpdateModifiers takes arguments rer (a RegExp Record), add (a String), and remove (a String) and returns a RegExp Record. It performs the following steps when called:

## `22.2.2.9.1` CharacterRange ( A, B )
*22-text-processing.md*
> The abstract operation CharacterRange takes arguments A (a CharSet) and B (a CharSet) and returns a CharSet. It performs the following steps when called:

## `22.2.2.9.2` HasEitherUnicodeFlag ( rer )
*22-text-processing.md*
> The abstract operation HasEitherUnicodeFlag takes argument rer (a RegExp Record) and returns a Boolean. It performs the following steps when called:

## `22.2.2.9.3` WordCharacters ( rer )
*22-text-processing.md*
> The abstract operation WordCharacters takes argument rer (a RegExp Record) and returns a CharSet. Returns a CharSet containing the characters considered "word characters" for the purposes of \b, \B, \w, and \W It performs the following steps when called:

## `22.2.2.9.4` AllCharacters ( rer )
*22-text-processing.md*
> The abstract operation AllCharacters takes argument rer (a RegExp Record) and returns a CharSet. Returns the set of “all characters” according to the regular expression flags. It performs the following steps when called:

## `22.2.2.9.5` MaybeSimpleCaseFolding ( rer, A )
*22-text-processing.md*
> The abstract operation MaybeSimpleCaseFolding takes arguments rer (a RegExp Record) and A (a CharSet) and returns a CharSet. If rer.[[UnicodeSets]] is false or rer.[[IgnoreCase]] is false, it returns A. Otherwise, it uses the Simple Case Folding (scf(cp)) definitions in the file CaseFolding.txt of the Unicode Character Database (each of which maps a single code point to another single code point) to map each CharSetElement of A character-by-character into a canonical form and returns the resulting CharSet. It performs the following steps when called:

## `22.2.2.9.6` CharacterComplement ( rer, S )
*22-text-processing.md*
> The abstract operation CharacterComplement takes arguments rer (a RegExp Record) and S (a CharSet) and returns a CharSet. It performs the following steps when called:

## `22.2.2.9.7` UnicodeMatchProperty ( rer, p )
*22-text-processing.md*
> The abstract operation UnicodeMatchProperty takes arguments rer (a RegExp Record) and p (ECMAScript source text) and returns a Unicode property name. It performs the following steps when called:

## `22.2.2.9.8` UnicodeMatchPropertyValue ( p, v )
*22-text-processing.md*
> The abstract operation UnicodeMatchPropertyValue takes arguments p (ECMAScript source text) and v (ECMAScript source text) and returns a Unicode property value. It performs the following steps when called:

## `22.2.3.1` RegExpCreate ( P, F )
*22-text-processing.md*
> The abstract operation RegExpCreate takes arguments P (an ECMAScript language value) and F (a String or undefined) and returns either a normal completion containing an Object or a throw completion. It performs the following steps when called:

## `22.2.3.2` RegExpAlloc ( newTarget )
*22-text-processing.md*
> The abstract operation RegExpAlloc takes argument newTarget (a constructor) and returns either a normal completion containing an Object or a throw completion. It performs the following steps when called:

## `22.2.3.3` RegExpInitialize ( obj, pattern, flags )
*22-text-processing.md*
> The abstract operation RegExpInitialize takes arguments obj (an Object), pattern (an ECMAScript language value), and flags (an ECMAScript language value) and returns either a normal completion containing an Object or a throw completion. It performs the following steps when called:

## `22.2.3.4` Static Semantics: ParsePattern ( patternText, u, v )
*22-text-processing.md*
> The abstract operation ParsePattern takes arguments patternText (a sequence of Unicode code points), u (a Boolean), and v (a Boolean) and returns a Parse Node or a non-empty List of SyntaxError objects.

## `22.2.4.1` RegExp ( pattern, flags )
*22-text-processing.md*
> This function performs the following steps when called:

## `22.2.5.1` RegExp.escape ( S )
*22-text-processing.md*
> This function returns a copy of S in which characters that are potentially special in a regular expression Pattern have been replaced by equivalent escape sequences.

## `22.2.5.1.1` EncodeForRegExpEscape ( cp )
*22-text-processing.md*
> The abstract operation EncodeForRegExpEscape takes argument cp (a code point) and returns a String. It returns a String representing a Pattern for matching cp. If cp is white space or an ASCII punctuator, the returned value is an escape sequence. Otherwise, the returned value is a String representation of cp itself. It performs the following steps when called:

## `22.2.6.2` RegExp.prototype.exec ( string )
*22-text-processing.md*
> This method searches string for an occurrence of the regular expression pattern and returns an Array containing the results of the match, or null if string did not match.

## `22.2.6.4.1` RegExpHasFlag ( R, codeUnit )
*22-text-processing.md*
> The abstract operation RegExpHasFlag takes arguments R (an ECMAScript language value) and codeUnit (a code unit) and returns either a normal completion containing either a Boolean or undefined, or a throw completion. It performs the following steps when called:

## `22.2.6.8` RegExp.prototype \[ %Symbol.match% \] ( string )
*22-text-processing.md*
> This method performs the following steps when called:

## `22.2.6.9` RegExp.prototype \[ %Symbol.matchAll% \] ( string )
*22-text-processing.md*
> This method performs the following steps when called:

## `22.2.6.11` RegExp.prototype \[ %Symbol.replace% \] ( string, replaceValue )
*22-text-processing.md*
> This method performs the following steps when called:

## `22.2.6.12` RegExp.prototype \[ %Symbol.search% \] ( string )
*22-text-processing.md*
> This method performs the following steps when called:

## `22.2.6.13.1` EscapeRegExpPattern ( P, F )
*22-text-processing.md*
> The abstract operation EscapeRegExpPattern takes arguments P (a String) and F (a String) and returns a String. It performs the following steps when called:

## `22.2.6.14` RegExp.prototype \[ %Symbol.split% \] ( string, limit )
*22-text-processing.md*
> Note 1

## `22.2.6.16` RegExp.prototype.test ( S )
*22-text-processing.md*
> This method performs the following steps when called:

## `22.2.6.17` RegExp.prototype.toString (  )
*22-text-processing.md*
> 1.  Let R be the this value.

## `22.2.7.1` RegExpExec ( R, S )
*22-text-processing.md*
> The abstract operation RegExpExec takes arguments R (an Object) and S (a String) and returns either a normal completion containing either an Object or null, or a throw completion. It performs the following steps when called:

## `22.2.7.2` RegExpBuiltinExec ( R, S )
*22-text-processing.md*
> The abstract operation RegExpBuiltinExec takes arguments R (an initialized RegExp instance) and S (a String) and returns either a normal completion containing either an Array exotic object or null, or a throw completion. It performs the following steps when called:

## `22.2.7.3` AdvanceStringIndex ( S, index, unicode )
*22-text-processing.md*
> The abstract operation AdvanceStringIndex takes arguments S (a String), index (a non-negative integer), and unicode (a Boolean) and returns an integer. It performs the following steps when called:

## `22.2.7.4` GetStringIndex ( S, codePointIndex )
*22-text-processing.md*
> The abstract operation GetStringIndex takes arguments S (a String) and codePointIndex (a non-negative integer) and returns a non-negative integer. It interprets S as a sequence of UTF-16 encoded code points, as described in 6.1.4, and returns the code unit index corresponding to code point index codePointIndex when such an index exists. Otherwise, it returns the length of S. It performs the following steps when called:

## `22.2.7.6` GetMatchString ( S, match )
*22-text-processing.md*
> The abstract operation GetMatchString takes arguments S (a String) and match (a Match Record) and returns a String. It performs the following steps when called:

## `22.2.7.7` GetMatchIndexPair ( S, match )
*22-text-processing.md*
> The abstract operation GetMatchIndexPair takes arguments S (a String) and match (a Match Record) and returns an Array. It performs the following steps when called:

## `22.2.7.8` MakeMatchIndicesIndexPairArray ( S, indices, groupNames, hasGroups )
*22-text-processing.md*
> The abstract operation MakeMatchIndicesIndexPairArray takes arguments S (a String), indices (a List of either Match Records or undefined), groupNames (a List of either Strings or undefined), and hasGroups (a Boolean) and returns an Array. It performs the following steps when called:

## `22.2.9.1` CreateRegExpStringIterator ( R, S, global, fullUnicode )
*22-text-processing.md*
> The abstract operation CreateRegExpStringIterator takes arguments R (an Object), S (a String), global (a Boolean), and fullUnicode (a Boolean) and returns a Generator. It performs the following steps when called:

## `22.2.9.2.1` %RegExpStringIteratorPrototype%.next (  )
*22-text-processing.md*
> 1.  Return ? GeneratorResume(this value, empty, "%RegExpStringIteratorPrototype%").

## `23.1.1.1` Array ( ...values )
*23-indexed-collections.md*
> This function performs the following steps when called:

## `23.1.2.1` Array.from ( items \[ , mapper \[ , thisArg \] \] )
*23-indexed-collections.md*
> This method performs the following steps when called:

## `23.1.2.2` Array.isArray ( arg )
*23-indexed-collections.md*
> This function performs the following steps when called:

## `23.1.2.3` Array.of ( ...items )
*23-indexed-collections.md*
> This method performs the following steps when called:

## `23.1.3.1` Array.prototype.at ( index )
*23-indexed-collections.md*
> 1.  Let O be ? ToObject(this value).

## `23.1.3.2` Array.prototype.concat ( ...items )
*23-indexed-collections.md*
> This method returns an array containing the array elements of the object followed by the array elements of each argument.

## `23.1.3.2.1` IsConcatSpreadable ( O )
*23-indexed-collections.md*
> The abstract operation IsConcatSpreadable takes argument O (an ECMAScript language value) and returns either a normal completion containing a Boolean or a throw completion. It performs the following steps when called:

## `23.1.3.4` Array.prototype.copyWithin ( target, start \[ , end \] )
*23-indexed-collections.md*
> Note 1

## `23.1.3.5` Array.prototype.entries (  )
*23-indexed-collections.md*
> This method performs the following steps when called:

## `23.1.3.6` Array.prototype.every ( callback \[ , thisArg \] )
*23-indexed-collections.md*
> Note 1

## `23.1.3.7` Array.prototype.fill ( value \[ , start \[ , end \] \] )
*23-indexed-collections.md*
> Note 1

## `23.1.3.8` Array.prototype.filter ( callback \[ , thisArg \] )
*23-indexed-collections.md*
> Note 1

## `23.1.3.9` Array.prototype.find ( predicate \[ , thisArg \] )
*23-indexed-collections.md*
> Note 1

## `23.1.3.10` Array.prototype.findIndex ( predicate \[ , thisArg \] )
*23-indexed-collections.md*
> Note 1

## `23.1.3.11` Array.prototype.findLast ( predicate \[ , thisArg \] )
*23-indexed-collections.md*
> Note 1

## `23.1.3.12` Array.prototype.findLastIndex ( predicate \[ , thisArg \] )
*23-indexed-collections.md*
> Note 1

## `23.1.3.12.1` FindViaPredicate ( O, len, direction, predicate, thisArg )
*23-indexed-collections.md*
> The abstract operation FindViaPredicate takes arguments O (an Object), len (a non-negative integer), direction (ascending or descending), predicate (an ECMAScript language value), and thisArg (an ECMAScript language value) and returns either a normal completion containing a Record with fields [[Index]] (an integral Number) and [[Value]] (an ECMAScript language value) or a throw completion.

## `23.1.3.13` Array.prototype.flat ( \[ depth \] )
*23-indexed-collections.md*
> This method performs the following steps when called:

## `23.1.3.13.1` FlattenIntoArray ( target, source, sourceLen, start, depth \[ , mapperFunction \[ , thisArg \] \] )
*23-indexed-collections.md*
> The abstract operation FlattenIntoArray takes arguments target (an Object), source (an Object), sourceLen (a non-negative integer), start (a non-negative integer), and depth (a non-negative integer or +∞) and optional arguments mapperFunction (a function object) and thisArg (an ECMAScript language value) and returns either a normal completion containing a non-negative integer or a throw completion. It performs the following steps when called:

## `23.1.3.14` Array.prototype.flatMap ( mapperFunction \[ , thisArg \] )
*23-indexed-collections.md*
> This method performs the following steps when called:

## `23.1.3.15` Array.prototype.forEach ( callback \[ , thisArg \] )
*23-indexed-collections.md*
> Note 1

## `23.1.3.16` Array.prototype.includes ( searchElement \[ , fromIndex \] )
*23-indexed-collections.md*
> Note 1

## `23.1.3.17` Array.prototype.indexOf ( searchElement \[ , fromIndex \] )
*23-indexed-collections.md*
> This method compares searchElement to the elements of the array, in ascending order, using the IsStrictlyEqual algorithm, and if found at one or more indices, returns the smallest such index; otherwise, it returns -1_(𝔽).

## `23.1.3.18` Array.prototype.join ( separator )
*23-indexed-collections.md*
> This method converts the elements of the array to Strings, and then concatenates these Strings, separated by occurrences of the separator. If no separator is provided, a single comma is used as the separator.

## `23.1.3.19` Array.prototype.keys (  )
*23-indexed-collections.md*
> This method performs the following steps when called:

## `23.1.3.20` Array.prototype.lastIndexOf ( searchElement \[ , fromIndex \] )
*23-indexed-collections.md*
> Note 1

## `23.1.3.21` Array.prototype.map ( callback \[ , thisArg \] )
*23-indexed-collections.md*
> Note 1

## `23.1.3.22` Array.prototype.pop (  )
*23-indexed-collections.md*
> Note 1

## `23.1.3.23` Array.prototype.push ( ...items )
*23-indexed-collections.md*
> Note 1

## `23.1.3.24` Array.prototype.reduce ( callback \[ , initialValue \] )
*23-indexed-collections.md*
> Note 1

## `23.1.3.25` Array.prototype.reduceRight ( callback \[ , initialValue \] )
*23-indexed-collections.md*
> Note 1

## `23.1.3.26` Array.prototype.reverse (  )
*23-indexed-collections.md*
> Note 1

## `23.1.3.27` Array.prototype.shift (  )
*23-indexed-collections.md*
> This method removes the first element of the array and returns it.

## `23.1.3.28` Array.prototype.slice ( start, end )
*23-indexed-collections.md*
> This method returns an array containing the elements of the array from element start up to, but not including, element end (or through the end of the array if end is undefined). If start is negative, it is treated as length + start where length is the length of the array. If end is negative, it is treated as length + end where length is the length of the array.

## `23.1.3.29` Array.prototype.some ( callback \[ , thisArg \] )
*23-indexed-collections.md*
> Note 1

## `23.1.3.30` Array.prototype.sort ( comparator )
*23-indexed-collections.md*
> This method sorts the elements of this array. If comparator is not undefined, it should be a function that accepts two arguments x and y and returns a negative Number if x \< y, a positive Number if x \> y, or a zero otherwise.

## `23.1.3.30.1` SortIndexedProperties ( obj, len, SortCompare, holes )
*23-indexed-collections.md*
> The abstract operation SortIndexedProperties takes arguments obj (an Object), len (a non-negative integer), SortCompare (an Abstract Closure with two parameters), and holes (skip-holes or read-through-holes) and returns either a normal completion containing a List of ECMAScript language values or a throw completion. It performs the following steps when called:

## `23.1.3.30.2` CompareArrayElements ( x, y, comparator )
*23-indexed-collections.md*
> The abstract operation CompareArrayElements takes arguments x (an ECMAScript language value), y (an ECMAScript language value), and comparator (a function object or undefined) and returns either a normal completion containing a Number or an abrupt completion. It performs the following steps when called:

## `23.1.3.31` Array.prototype.splice ( start, deleteCount, ...items )
*23-indexed-collections.md*
> Note 1

## `23.1.3.32` Array.prototype.toLocaleString ( \[ reserved1 \[ , reserved2 \] \] )
*23-indexed-collections.md*
> An ECMAScript implementation that includes the ECMA-402 Internationalization API must implement this method as specified in the ECMA-402 specification. If an ECMAScript implementation does not include the ECMA-402 API the following specification of this method is used.

## `23.1.3.33` Array.prototype.toReversed (  )
*23-indexed-collections.md*
> This method performs the following steps when called:

## `23.1.3.34` Array.prototype.toSorted ( comparator )
*23-indexed-collections.md*
> This method performs the following steps when called:

## `23.1.3.35` Array.prototype.toSpliced ( start, skipCount, ...items )
*23-indexed-collections.md*
> This method performs the following steps when called:

## `23.1.3.36` Array.prototype.toString (  )
*23-indexed-collections.md*
> This method performs the following steps when called:

## `23.1.3.37` Array.prototype.unshift ( ...items )
*23-indexed-collections.md*
> This method prepends the arguments to the start of the array, such that their order within the array is the same as the order in which they appear in the argument list.

## `23.1.3.38` Array.prototype.values (  )
*23-indexed-collections.md*
> This method performs the following steps when called:

## `23.1.3.39` Array.prototype.with ( index, value )
*23-indexed-collections.md*
> This method performs the following steps when called:

## `23.1.3.40` Array.prototype \[ %Symbol.iterator% \] (  )
*23-indexed-collections.md*
> The initial value of the %Symbol.iterator% property is %Array.prototype.values%, defined in 23.1.3.38.

## `23.1.5.1` CreateArrayIterator ( array, kind )
*23-indexed-collections.md*
> The abstract operation CreateArrayIterator takes arguments array (an Object) and kind (key+value, key, or value) and returns a Generator. It is used to create iterator objects for Array methods that return such iterators. It performs the following steps when called:

## `23.1.5.2.1` %ArrayIteratorPrototype%.next (  )
*23-indexed-collections.md*
> 1.  Return ? GeneratorResume(this value, empty, "%ArrayIteratorPrototype%").

## `23.2.1.1` %TypedArray% (  )
*23-indexed-collections.md*
> This function performs the following steps when called:

## `23.2.2.1` %TypedArray%.from ( source \[ , mapper \[ , thisArg \] \] )
*23-indexed-collections.md*
> This method performs the following steps when called:

## `23.2.2.2` %TypedArray%.of ( ...items )
*23-indexed-collections.md*
> This method performs the following steps when called:

## `23.2.3.1` %TypedArray%.prototype.at ( index )
*23-indexed-collections.md*
> 1.  Let O be the this value.

## `23.2.3.6` %TypedArray%.prototype.copyWithin ( target, start \[ , end \] )
*23-indexed-collections.md*
> The interpretation and use of the arguments of this method are the same as for Array.prototype.copyWithin as defined in 23.1.3.4.

## `23.2.3.7` %TypedArray%.prototype.entries (  )
*23-indexed-collections.md*
> This method performs the following steps when called:

## `23.2.3.8` %TypedArray%.prototype.every ( callback \[ , thisArg \] )
*23-indexed-collections.md*
> The interpretation and use of the arguments of this method are the same as for Array.prototype.every as defined in 23.1.3.6.

## `23.2.3.9` %TypedArray%.prototype.fill ( value \[ , start \[ , end \] \] )
*23-indexed-collections.md*
> The interpretation and use of the arguments of this method are the same as for Array.prototype.fill as defined in 23.1.3.7.

## `23.2.3.10` %TypedArray%.prototype.filter ( callback \[ , thisArg \] )
*23-indexed-collections.md*
> The interpretation and use of the arguments of this method are the same as for Array.prototype.filter as defined in 23.1.3.8.

## `23.2.3.11` %TypedArray%.prototype.find ( predicate \[ , thisArg \] )
*23-indexed-collections.md*
> The interpretation and use of the arguments of this method are the same as for Array.prototype.find as defined in 23.1.3.9.

## `23.2.3.12` %TypedArray%.prototype.findIndex ( predicate \[ , thisArg \] )
*23-indexed-collections.md*
> The interpretation and use of the arguments of this method are the same as for Array.prototype.findIndex as defined in 23.1.3.10.

## `23.2.3.13` %TypedArray%.prototype.findLast ( predicate \[ , thisArg \] )
*23-indexed-collections.md*
> The interpretation and use of the arguments of this method are the same as for Array.prototype.findLast as defined in 23.1.3.11.

## `23.2.3.14` %TypedArray%.prototype.findLastIndex ( predicate \[ , thisArg \] )
*23-indexed-collections.md*
> The interpretation and use of the arguments of this method are the same as for Array.prototype.findLastIndex as defined in 23.1.3.12.

## `23.2.3.15` %TypedArray%.prototype.forEach ( callback \[ , thisArg \] )
*23-indexed-collections.md*
> The interpretation and use of the arguments of this method are the same as for Array.prototype.forEach as defined in 23.1.3.15.

## `23.2.3.16` %TypedArray%.prototype.includes ( searchElement \[ , fromIndex \] )
*23-indexed-collections.md*
> The interpretation and use of the arguments of this method are the same as for Array.prototype.includes as defined in 23.1.3.16.

## `23.2.3.17` %TypedArray%.prototype.indexOf ( searchElement \[ , fromIndex \] )
*23-indexed-collections.md*
> The interpretation and use of the arguments of this method are the same as for Array.prototype.indexOf as defined in 23.1.3.17.

## `23.2.3.18` %TypedArray%.prototype.join ( separator )
*23-indexed-collections.md*
> The interpretation and use of the arguments of this method are the same as for Array.prototype.join as defined in 23.1.3.18.

## `23.2.3.19` %TypedArray%.prototype.keys (  )
*23-indexed-collections.md*
> This method performs the following steps when called:

## `23.2.3.20` %TypedArray%.prototype.lastIndexOf ( searchElement \[ , fromIndex \] )
*23-indexed-collections.md*
> The interpretation and use of the arguments of this method are the same as for Array.prototype.lastIndexOf as defined in 23.1.3.20.

## `23.2.3.22` %TypedArray%.prototype.map ( callback \[ , thisArg \] )
*23-indexed-collections.md*
> The interpretation and use of the arguments of this method are the same as for Array.prototype.map as defined in 23.1.3.21.

## `23.2.3.23` %TypedArray%.prototype.reduce ( callback \[ , initialValue \] )
*23-indexed-collections.md*
> The interpretation and use of the arguments of this method are the same as for Array.prototype.reduce as defined in 23.1.3.24.

## `23.2.3.24` %TypedArray%.prototype.reduceRight ( callback \[ , initialValue \] )
*23-indexed-collections.md*
> The interpretation and use of the arguments of this method are the same as for Array.prototype.reduceRight as defined in 23.1.3.25.

## `23.2.3.25` %TypedArray%.prototype.reverse (  )
*23-indexed-collections.md*
> The interpretation and use of the arguments of this method are the same as for Array.prototype.reverse as defined in 23.1.3.26.

## `23.2.3.26` %TypedArray%.prototype.set ( source \[ , offset \] )
*23-indexed-collections.md*
> This method sets multiple values in this TypedArray, reading the values from source. The details differ based upon the type of source. The optional offset value indicates the first element index in this TypedArray where values are written. If omitted, it is assumed to be 0.

## `23.2.3.26.1` SetTypedArrayFromTypedArray ( target, targetOffset, source )
*23-indexed-collections.md*
> The abstract operation SetTypedArrayFromTypedArray takes arguments target (a TypedArray), targetOffset (a non-negative integer or +∞), and source (a TypedArray) and returns either a normal completion containing unused or a throw completion. It sets multiple values in target, starting at index targetOffset, reading the values from source. It performs the following steps when called:

## `23.2.3.26.2` SetTypedArrayFromArrayLike ( target, targetOffset, source )
*23-indexed-collections.md*
> The abstract operation SetTypedArrayFromArrayLike takes arguments target (a TypedArray), targetOffset (a non-negative integer or +∞), and source (an ECMAScript language value, but not a TypedArray) and returns either a normal completion containing unused or a throw completion. It sets multiple values in target, starting at index targetOffset, reading the values from source. It performs the following steps when called:

## `23.2.3.27` %TypedArray%.prototype.slice ( start, end )
*23-indexed-collections.md*
> The interpretation and use of the arguments of this method are the same as for Array.prototype.slice as defined in 23.1.3.28.

## `23.2.3.28` %TypedArray%.prototype.some ( callback \[ , thisArg \] )
*23-indexed-collections.md*
> The interpretation and use of the arguments of this method are the same as for Array.prototype.some as defined in 23.1.3.29.

## `23.2.3.29` %TypedArray%.prototype.sort ( comparator )
*23-indexed-collections.md*
> This is a distinct method that, except as described below, implements the same requirements as those of Array.prototype.sort as defined in 23.1.3.30. The implementation of this method may be optimized with the knowledge that the this value is an object that has a fixed length and whose integer-indexed properties are not sparse.

## `23.2.3.30` %TypedArray%.prototype.subarray ( start, end )
*23-indexed-collections.md*
> This method returns a new TypedArray whose element type is the element type of this TypedArray and whose ArrayBuffer is the ArrayBuffer of this TypedArray, referencing the elements in the interval from start (inclusive) to end (exclusive). If either start or end is negative, it refers to an index from the end of the array, as opposed to from the beginning.

## `23.2.3.31` %TypedArray%.prototype.toLocaleString ( \[ reserved1 \[ , reserved2 \] \] )
*23-indexed-collections.md*
> This is a distinct method that implements the same algorithm as Array.prototype.toLocaleString as defined in 23.1.3.32 except that TypedArrayLength is called in place of performing a [[Get]] of "length". The implementation of the algorithm may be optimized with the knowledge that the this value has a fixed length when the underlying buffer is not resizable and whose integer-indexed properties are not sparse. However, such optimization must not introduce any observable changes in the specified behaviour of the algorithm.

## `23.2.3.32` %TypedArray%.prototype.toReversed (  )
*23-indexed-collections.md*
> This method performs the following steps when called:

## `23.2.3.33` %TypedArray%.prototype.toSorted ( comparator )
*23-indexed-collections.md*
> This method performs the following steps when called:

## `23.2.3.34` %TypedArray%.prototype.toString (  )
*23-indexed-collections.md*
> The initial value of the "toString" property is %Array.prototype.toString%, defined in 23.1.3.36.

## `23.2.3.35` %TypedArray%.prototype.values (  )
*23-indexed-collections.md*
> This method performs the following steps when called:

## `23.2.3.36` %TypedArray%.prototype.with ( index, value )
*23-indexed-collections.md*
> This method performs the following steps when called:

## `23.2.3.37` %TypedArray%.prototype \[ %Symbol.iterator% \] (  )
*23-indexed-collections.md*
> The initial value of the %Symbol.iterator% property is %TypedArray.prototype.values%, defined in 23.2.3.35.

## `23.2.4.1` TypedArraySpeciesCreate ( exemplar, argumentList )
*23-indexed-collections.md*
> The abstract operation TypedArraySpeciesCreate takes arguments exemplar (a TypedArray) and argumentList (a List of ECMAScript language values) and returns either a normal completion containing a TypedArray or a throw completion. It is used to specify the creation of a new TypedArray using a constructor function that is derived from exemplar. Unlike ArraySpeciesCreate, which can create non-Array objects through the use of %Symbol.species%, this operation enforces that the constructor function creates an actual TypedArray. It performs the following steps when called:

## `23.2.4.2` TypedArrayCreateFromConstructor ( constructor, argumentList )
*23-indexed-collections.md*
> The abstract operation TypedArrayCreateFromConstructor takes arguments constructor (a constructor) and argumentList (a List of ECMAScript language values) and returns either a normal completion containing a TypedArray or a throw completion. It is used to specify the creation of a new TypedArray using a constructor function. It performs the following steps when called:

## `23.2.4.3` TypedArrayCreateSameType ( exemplar, argumentList )
*23-indexed-collections.md*
> The abstract operation TypedArrayCreateSameType takes arguments exemplar (a TypedArray) and argumentList (a List of ECMAScript language values) and returns either a normal completion containing a TypedArray or a throw completion. It is used to specify the creation of a new TypedArray using a constructor function that is derived from exemplar. Unlike TypedArraySpeciesCreate, which can construct custom TypedArray subclasses through the use of %Symbol.species%, this operation always uses one of the built-in TypedArray constructors. It performs the following steps when called:

## `23.2.4.4` ValidateTypedArray ( O, order )
*23-indexed-collections.md*
> The abstract operation ValidateTypedArray takes arguments O (an ECMAScript language value) and order (seq-cst or unordered) and returns either a normal completion containing a TypedArray With Buffer Witness Record or a throw completion. It performs the following steps when called:

## `23.2.4.5` TypedArrayElementSize ( O )
*23-indexed-collections.md*
> The abstract operation TypedArrayElementSize takes argument O (a TypedArray) and returns a non-negative integer. It performs the following steps when called:

## `23.2.4.6` TypedArrayElementType ( O )
*23-indexed-collections.md*
> The abstract operation TypedArrayElementType takes argument O (a TypedArray) and returns a TypedArray element type. It performs the following steps when called:

## `23.2.4.7` CompareTypedArrayElements ( x, y, comparator )
*23-indexed-collections.md*
> The abstract operation CompareTypedArrayElements takes arguments x (a Number or a BigInt), y (a Number or a BigInt), and comparator (a function object or undefined) and returns either a normal completion containing a Number or an abrupt completion. It performs the following steps when called:

## `23.2.5.1` TypedArray ( ...args )
*23-indexed-collections.md*
> Each TypedArray constructor performs the following steps when called:

## `23.2.5.1.1` AllocateTypedArray ( constructorName, newTarget, defaultProto \[ , length \] )
*23-indexed-collections.md*
> The abstract operation AllocateTypedArray takes arguments constructorName (a String which is the name of a TypedArray constructor in Table 73), newTarget (a constructor), and defaultProto (a String) and optional argument length (a non-negative integer) and returns either a normal completion containing a TypedArray or a throw completion. It is used to validate and create an instance of a TypedArray constructor. If the length argument is passed, an ArrayBuffer of that length is also allocated and associated with the new TypedArray instance. AllocateTypedArray provides common semantics that is used by TypedArray. It performs the following steps when called:

## `23.2.5.1.2` InitializeTypedArrayFromTypedArray ( O, srcArray )
*23-indexed-collections.md*
> The abstract operation InitializeTypedArrayFromTypedArray takes arguments O (a TypedArray) and srcArray (a TypedArray) and returns either a normal completion containing unused or a throw completion. It performs the following steps when called:

## `23.2.5.1.3` InitializeTypedArrayFromArrayBuffer ( O, buffer, byteOffset, length )
*23-indexed-collections.md*
> The abstract operation InitializeTypedArrayFromArrayBuffer takes arguments O (a TypedArray), buffer (an ArrayBuffer or a SharedArrayBuffer), byteOffset (an ECMAScript language value), and length (an ECMAScript language value) and returns either a normal completion containing unused or a throw completion. It performs the following steps when called:

## `23.2.5.1.4` InitializeTypedArrayFromList ( O, values )
*23-indexed-collections.md*
> The abstract operation InitializeTypedArrayFromList takes arguments O (a TypedArray) and values (a List of ECMAScript language values) and returns either a normal completion containing unused or a throw completion. It performs the following steps when called:

## `23.2.5.1.5` InitializeTypedArrayFromArrayLike ( O, arrayLike )
*23-indexed-collections.md*
> The abstract operation InitializeTypedArrayFromArrayLike takes arguments O (a TypedArray) and arrayLike (an Object, but not a TypedArray or an ArrayBuffer) and returns either a normal completion containing unused or a throw completion. It performs the following steps when called:

## `23.2.5.1.6` AllocateTypedArrayBuffer ( O, length )
*23-indexed-collections.md*
> The abstract operation AllocateTypedArrayBuffer takes arguments O (a TypedArray) and length (a non-negative integer) and returns either a normal completion containing unused or a throw completion. It allocates and associates an ArrayBuffer with O. It performs the following steps when called:

## `24.1.1.1` Map ( \[ iterable \] )
*24-keyed-collections.md*
> This function performs the following steps when called:

## `24.1.1.2` AddEntriesFromIterable ( target, iterable, adder )
*24-keyed-collections.md*
> The abstract operation AddEntriesFromIterable takes arguments target (an Object), iterable (an ECMAScript language value, but not undefined or null), and adder (a function object) and returns either a normal completion containing an ECMAScript language value or a throw completion. adder will be invoked, with target as the receiver. It performs the following steps when called:

## `24.1.2.1` Map.groupBy ( items, callback )
*24-keyed-collections.md*
> Note

## `24.1.3.1` Map.prototype.clear (  )
*24-keyed-collections.md*
> This method performs the following steps when called:

## `24.1.3.3` Map.prototype.delete ( key )
*24-keyed-collections.md*
> This method performs the following steps when called:

## `24.1.3.4` Map.prototype.entries (  )
*24-keyed-collections.md*
> This method performs the following steps when called:

## `24.1.3.5` Map.prototype.forEach ( callback \[ , thisArg \] )
*24-keyed-collections.md*
> This method performs the following steps when called:

## `24.1.3.6` Map.prototype.get ( key )
*24-keyed-collections.md*
> This method performs the following steps when called:

## `24.1.3.7` Map.prototype.has ( key )
*24-keyed-collections.md*
> This method performs the following steps when called:

## `24.1.3.8` Map.prototype.keys (  )
*24-keyed-collections.md*
> This method performs the following steps when called:

## `24.1.3.9` Map.prototype.set ( key, value )
*24-keyed-collections.md*
> This method performs the following steps when called:

## `24.1.3.11` Map.prototype.values (  )
*24-keyed-collections.md*
> This method performs the following steps when called:

## `24.1.3.12` Map.prototype \[ %Symbol.iterator% \] (  )
*24-keyed-collections.md*
> The initial value of the %Symbol.iterator% property is %Map.prototype.entries%, defined in 24.1.3.4.

## `24.1.5.1` CreateMapIterator ( map, kind )
*24-keyed-collections.md*
> The abstract operation CreateMapIterator takes arguments map (an ECMAScript language value) and kind (key+value, key, or value) and returns either a normal completion containing a Generator or a throw completion. It is used to create iterator objects for Map methods that return such iterators. It performs the following steps when called:

## `24.1.5.2.1` %MapIteratorPrototype%.next (  )
*24-keyed-collections.md*
> 1.  Return ? GeneratorResume(this value, empty, "%MapIteratorPrototype%").

## `24.2.1.2` GetSetRecord ( obj )
*24-keyed-collections.md*
> The abstract operation GetSetRecord takes argument obj (an ECMAScript language value) and returns either a normal completion containing a Set Record or a throw completion. It performs the following steps when called:

## `24.2.1.3` SetDataHas ( setData, value )
*24-keyed-collections.md*
> The abstract operation SetDataHas takes arguments setData (a List of either ECMAScript language values or empty) and value (an ECMAScript language value) and returns a Boolean. It performs the following steps when called:

## `24.2.1.4` SetDataIndex ( setData, value )
*24-keyed-collections.md*
> The abstract operation SetDataIndex takes arguments setData (a List of either ECMAScript language values or empty) and value (an ECMAScript language value) and returns a non-negative integer or not-found. It performs the following steps when called:

## `24.2.1.5` SetDataSize ( setData )
*24-keyed-collections.md*
> The abstract operation SetDataSize takes argument setData (a List of either ECMAScript language values or empty) and returns a non-negative integer. It performs the following steps when called:

## `24.2.2.1` Set ( \[ iterable \] )
*24-keyed-collections.md*
> This function performs the following steps when called:

## `24.2.4.1` Set.prototype.add ( value )
*24-keyed-collections.md*
> This method performs the following steps when called:

## `24.2.4.2` Set.prototype.clear (  )
*24-keyed-collections.md*
> This method performs the following steps when called:

## `24.2.4.4` Set.prototype.delete ( value )
*24-keyed-collections.md*
> This method performs the following steps when called:

## `24.2.4.5` Set.prototype.difference ( other )
*24-keyed-collections.md*
> This method performs the following steps when called:

## `24.2.4.6` Set.prototype.entries (  )
*24-keyed-collections.md*
> This method performs the following steps when called:

## `24.2.4.7` Set.prototype.forEach ( callback \[ , thisArg \] )
*24-keyed-collections.md*
> This method performs the following steps when called:

## `24.2.4.8` Set.prototype.has ( value )
*24-keyed-collections.md*
> This method performs the following steps when called:

## `24.2.4.9` Set.prototype.intersection ( other )
*24-keyed-collections.md*
> This method performs the following steps when called:

## `24.2.4.10` Set.prototype.isDisjointFrom ( other )
*24-keyed-collections.md*
> This method performs the following steps when called:

## `24.2.4.11` Set.prototype.isSubsetOf ( other )
*24-keyed-collections.md*
> This method performs the following steps when called:

## `24.2.4.12` Set.prototype.isSupersetOf ( other )
*24-keyed-collections.md*
> This method performs the following steps when called:

## `24.2.4.13` Set.prototype.keys (  )
*24-keyed-collections.md*
> The initial value of the "keys" property is %Set.prototype.values%, defined in 24.2.4.17.

## `24.2.4.15` Set.prototype.symmetricDifference ( other )
*24-keyed-collections.md*
> This method performs the following steps when called:

## `24.2.4.16` Set.prototype.union ( other )
*24-keyed-collections.md*
> This method performs the following steps when called:

## `24.2.4.17` Set.prototype.values (  )
*24-keyed-collections.md*
> This method performs the following steps when called:

## `24.2.4.18` Set.prototype \[ %Symbol.iterator% \] (  )
*24-keyed-collections.md*
> The initial value of the %Symbol.iterator% property is %Set.prototype.values%, defined in 24.2.4.17.

## `24.2.6.1` CreateSetIterator ( set, kind )
*24-keyed-collections.md*
> The abstract operation CreateSetIterator takes arguments set (an ECMAScript language value) and kind (key+value or value) and returns either a normal completion containing a Generator or a throw completion. It is used to create iterator objects for Set methods that return such iterators. It performs the following steps when called:

## `24.2.6.2.1` %SetIteratorPrototype%.next (  )
*24-keyed-collections.md*
> 1.  Return ? GeneratorResume(this value, empty, "%SetIteratorPrototype%").

## `24.3.1.1` WeakMap ( \[ iterable \] )
*24-keyed-collections.md*
> This function performs the following steps when called:

## `24.3.3.2` WeakMap.prototype.delete ( key )
*24-keyed-collections.md*
> This method performs the following steps when called:

## `24.3.3.3` WeakMap.prototype.get ( key )
*24-keyed-collections.md*
> This method performs the following steps when called:

## `24.3.3.4` WeakMap.prototype.has ( key )
*24-keyed-collections.md*
> This method performs the following steps when called:

## `24.3.3.5` WeakMap.prototype.set ( key, value )
*24-keyed-collections.md*
> This method performs the following steps when called:

## `24.4.1.1` WeakSet ( \[ iterable \] )
*24-keyed-collections.md*
> This function performs the following steps when called:

## `24.4.3.1` WeakSet.prototype.add ( value )
*24-keyed-collections.md*
> This method performs the following steps when called:

## `24.4.3.3` WeakSet.prototype.delete ( value )
*24-keyed-collections.md*
> This method performs the following steps when called:

## `24.4.3.4` WeakSet.prototype.has ( value )
*24-keyed-collections.md*
> This method performs the following steps when called:

## `24.5.1` CanonicalizeKeyedCollectionKey ( key )
*24-keyed-collections.md*
> The abstract operation CanonicalizeKeyedCollectionKey takes argument key (an ECMAScript language value) and returns an ECMAScript language value. It performs the following steps when called:

## `25.1.3.1` AllocateArrayBuffer ( constructor, byteLength \[ , maxByteLength \] )
*25-structured-data.md*
> The abstract operation AllocateArrayBuffer takes arguments constructor (a constructor) and byteLength (a non-negative integer) and optional argument maxByteLength (a non-negative integer or empty) and returns either a normal completion containing an ArrayBuffer or a throw completion. It is used to create an ArrayBuffer. It performs the following steps when called:

## `25.1.3.2` ArrayBufferByteLength ( arrayBuffer, order )
*25-structured-data.md*
> The abstract operation ArrayBufferByteLength takes arguments arrayBuffer (an ArrayBuffer or SharedArrayBuffer) and order (seq-cst or unordered) and returns a non-negative integer. It performs the following steps when called:

## `25.1.3.3` ArrayBufferCopyAndDetach ( arrayBuffer, newLength, preserveResizability )
*25-structured-data.md*
> The abstract operation ArrayBufferCopyAndDetach takes arguments arrayBuffer (an ECMAScript language value), newLength (an ECMAScript language value), and preserveResizability (preserve-resizability or fixed-length) and returns either a normal completion containing an ArrayBuffer or a throw completion. It performs the following steps when called:

## `25.1.3.4` IsDetachedBuffer ( arrayBuffer )
*25-structured-data.md*
> The abstract operation IsDetachedBuffer takes argument arrayBuffer (an ArrayBuffer or a SharedArrayBuffer) and returns a Boolean. It performs the following steps when called:

## `25.1.3.5` DetachArrayBuffer ( arrayBuffer \[ , key \] )
*25-structured-data.md*
> The abstract operation DetachArrayBuffer takes argument arrayBuffer (an ArrayBuffer) and optional argument key (anything) and returns either a normal completion containing unused or a throw completion. It performs the following steps when called:

## `25.1.3.6` CloneArrayBuffer ( srcBuffer, srcByteOffset, srcLength )
*25-structured-data.md*
> The abstract operation CloneArrayBuffer takes arguments srcBuffer (an ArrayBuffer or a SharedArrayBuffer), srcByteOffset (a non-negative integer), and srcLength (a non-negative integer) and returns either a normal completion containing an ArrayBuffer or a throw completion. It creates a new ArrayBuffer whose data is a copy of srcBuffer's data over the range starting at srcByteOffset and continuing for srcLength bytes. It performs the following steps when called:

## `25.1.3.7` GetArrayBufferMaxByteLengthOption ( options )
*25-structured-data.md*
> The abstract operation GetArrayBufferMaxByteLengthOption takes argument options (an ECMAScript language value) and returns either a normal completion containing either a non-negative integer or empty, or a throw completion. It performs the following steps when called:

## `25.1.3.8` HostResizeArrayBuffer ( buffer, newByteLength )
*25-structured-data.md*
> The host-defined abstract operation HostResizeArrayBuffer takes arguments buffer (an ArrayBuffer) and newByteLength (a non-negative integer) and returns either a normal completion containing either handled or unhandled, or a throw completion. It gives the host an opportunity to perform implementation-defined resizing of buffer. If the host chooses not to handle resizing of buffer, it may return unhandled for the default behaviour.

## `25.1.3.9` IsFixedLengthArrayBuffer ( arrayBuffer )
*25-structured-data.md*
> The abstract operation IsFixedLengthArrayBuffer takes argument arrayBuffer (an ArrayBuffer or a SharedArrayBuffer) and returns a Boolean. It performs the following steps when called:

## `25.1.3.10` IsUnsignedElementType ( type )
*25-structured-data.md*
> The abstract operation IsUnsignedElementType takes argument type (a TypedArray element type) and returns a Boolean. It verifies if the argument type is an unsigned TypedArray element type. It performs the following steps when called:

## `25.1.3.11` IsUnclampedIntegerElementType ( type )
*25-structured-data.md*
> The abstract operation IsUnclampedIntegerElementType takes argument type (a TypedArray element type) and returns a Boolean. It verifies if the argument type is an Integer TypedArray element type not including uint8clamped. It performs the following steps when called:

## `25.1.3.12` IsBigIntElementType ( type )
*25-structured-data.md*
> The abstract operation IsBigIntElementType takes argument type (a TypedArray element type) and returns a Boolean. It verifies if the argument type is a BigInt TypedArray element type. It performs the following steps when called:

## `25.1.3.13` IsNoTearConfiguration ( type, order )
*25-structured-data.md*
> The abstract operation IsNoTearConfiguration takes arguments type (a TypedArray element type) and order (seq-cst, unordered, or init) and returns a Boolean. It performs the following steps when called:

## `25.1.3.14` RawBytesToNumeric ( type, rawBytes, isLittleEndian )
*25-structured-data.md*
> The abstract operation RawBytesToNumeric takes arguments type (a TypedArray element type), rawBytes (a List of byte values), and isLittleEndian (a Boolean) and returns a Number or a BigInt. It performs the following steps when called:

## `25.1.3.15` GetRawBytesFromSharedBlock ( block, byteIndex, type, isTypedArray, order )
*25-structured-data.md*
> The abstract operation GetRawBytesFromSharedBlock takes arguments block (a Shared Data Block), byteIndex (a non-negative integer), type (a TypedArray element type), isTypedArray (a Boolean), and order (seq-cst or unordered) and returns a List of byte values. It performs the following steps when called:

## `25.1.3.16` GetValueFromBuffer ( arrayBuffer, byteIndex, type, isTypedArray, order \[ , isLittleEndian \] )
*25-structured-data.md*
> The abstract operation GetValueFromBuffer takes arguments arrayBuffer (an ArrayBuffer or SharedArrayBuffer), byteIndex (a non-negative integer), type (a TypedArray element type), isTypedArray (a Boolean), and order (seq-cst or unordered) and optional argument isLittleEndian (a Boolean) and returns a Number or a BigInt. It performs the following steps when called:

## `25.1.3.17` NumericToRawBytes ( type, value, isLittleEndian )
*25-structured-data.md*
> The abstract operation NumericToRawBytes takes arguments type (a TypedArray element type), value (a Number or a BigInt), and isLittleEndian (a Boolean) and returns a List of byte values. It performs the following steps when called:

## `25.1.3.18` SetValueInBuffer ( arrayBuffer, byteIndex, type, value, isTypedArray, order \[ , isLittleEndian \] )
*25-structured-data.md*
> The abstract operation SetValueInBuffer takes arguments arrayBuffer (an ArrayBuffer or SharedArrayBuffer), byteIndex (a non-negative integer), type (a TypedArray element type), value (a Number or a BigInt), isTypedArray (a Boolean), and order (seq-cst, unordered, or init) and optional argument isLittleEndian (a Boolean) and returns unused. It performs the following steps when called:

## `25.1.3.19` GetModifySetValueInBuffer ( arrayBuffer, byteIndex, type, value, op )
*25-structured-data.md*
> The abstract operation GetModifySetValueInBuffer takes arguments arrayBuffer (an ArrayBuffer or a SharedArrayBuffer), byteIndex (a non-negative integer), type (a TypedArray element type), value (a Number or a BigInt), and op (a read-modify-write modification function) and returns a Number or a BigInt. It performs the following steps when called:

## `25.1.4.1` ArrayBuffer ( length \[ , options \] )
*25-structured-data.md*
> This function performs the following steps when called:

## `25.1.5.1` ArrayBuffer.isView ( arg )
*25-structured-data.md*
> This function performs the following steps when called:

## `25.1.6.6` ArrayBuffer.prototype.resize ( newLength )
*25-structured-data.md*
> This method performs the following steps when called:

## `25.1.6.7` ArrayBuffer.prototype.slice ( start, end )
*25-structured-data.md*
> This method performs the following steps when called:

## `25.1.6.8` ArrayBuffer.prototype.transfer ( \[ newLength \] )
*25-structured-data.md*
> This method performs the following steps when called:

## `25.1.6.9` ArrayBuffer.prototype.transferToFixedLength ( \[ newLength \] )
*25-structured-data.md*
> This method performs the following steps when called:

## `25.2.2.1` AllocateSharedArrayBuffer ( constructor, byteLength \[ , maxByteLength \] )
*25-structured-data.md*
> The abstract operation AllocateSharedArrayBuffer takes arguments constructor (a constructor) and byteLength (a non-negative integer) and optional argument maxByteLength (a non-negative integer or empty) and returns either a normal completion containing a SharedArrayBuffer or a throw completion. It is used to create a SharedArrayBuffer. It performs the following steps when called:

## `25.2.2.2` IsSharedArrayBuffer ( obj )
*25-structured-data.md*
> The abstract operation IsSharedArrayBuffer takes argument obj (an ArrayBuffer or a SharedArrayBuffer) and returns a Boolean. It tests whether an object is an ArrayBuffer, a SharedArrayBuffer, or a subtype of either. It performs the following steps when called:

## `25.2.2.3` HostGrowSharedArrayBuffer ( buffer, newByteLength )
*25-structured-data.md*
> The host-defined abstract operation HostGrowSharedArrayBuffer takes arguments buffer (a SharedArrayBuffer) and newByteLength (a non-negative integer) and returns either a normal completion containing either handled or unhandled, or a throw completion. It gives the host an opportunity to perform implementation-defined growing of buffer. If the host chooses not to handle growing of buffer, it may return unhandled for the default behaviour.

## `25.2.3.1` SharedArrayBuffer ( length \[ , options \] )
*25-structured-data.md*
> This function performs the following steps when called:

## `25.2.5.3` SharedArrayBuffer.prototype.grow ( newLength )
*25-structured-data.md*
> This method performs the following steps when called:

## `25.2.5.6` SharedArrayBuffer.prototype.slice ( start, end )
*25-structured-data.md*
> This method performs the following steps when called:

## `25.3.1.2` MakeDataViewWithBufferWitnessRecord ( obj, order )
*25-structured-data.md*
> The abstract operation MakeDataViewWithBufferWitnessRecord takes arguments obj (a DataView) and order (seq-cst or unordered) and returns a DataView With Buffer Witness Record. It performs the following steps when called:

## `25.3.1.3` GetViewByteLength ( viewRecord )
*25-structured-data.md*
> The abstract operation GetViewByteLength takes argument viewRecord (a DataView With Buffer Witness Record) and returns a non-negative integer. It performs the following steps when called:

## `25.3.1.4` IsViewOutOfBounds ( viewRecord )
*25-structured-data.md*
> The abstract operation IsViewOutOfBounds takes argument viewRecord (a DataView With Buffer Witness Record) and returns a Boolean. It performs the following steps when called:

## `25.3.1.5` GetViewValue ( view, requestIndex, isLittleEndian, type )
*25-structured-data.md*
> The abstract operation GetViewValue takes arguments view (an ECMAScript language value), requestIndex (an ECMAScript language value), isLittleEndian (an ECMAScript language value), and type (a TypedArray element type) and returns either a normal completion containing either a Number or a BigInt, or a throw completion. It is used by functions on DataView instances to retrieve values from the view's buffer. It performs the following steps when called:

## `25.3.1.6` SetViewValue ( view, requestIndex, isLittleEndian, type, value )
*25-structured-data.md*
> The abstract operation SetViewValue takes arguments view (an ECMAScript language value), requestIndex (an ECMAScript language value), isLittleEndian (an ECMAScript language value), type (a TypedArray element type), and value (an ECMAScript language value) and returns either a normal completion containing undefined or a throw completion. It is used by functions on DataView instances to store values into the view's buffer. It performs the following steps when called:

## `25.3.2.1` DataView ( buffer \[ , byteOffset \[ , byteLength \] \] )
*25-structured-data.md*
> This function performs the following steps when called:

## `25.3.4.5` DataView.prototype.getBigInt64 ( byteOffset \[ , littleEndian \] )
*25-structured-data.md*
> This method performs the following steps when called:

## `25.3.4.6` DataView.prototype.getBigUint64 ( byteOffset \[ , littleEndian \] )
*25-structured-data.md*
> This method performs the following steps when called:

## `25.3.4.7` DataView.prototype.getFloat16 ( byteOffset \[ , littleEndian \] )
*25-structured-data.md*
> This method performs the following steps when called:

## `25.3.4.8` DataView.prototype.getFloat32 ( byteOffset \[ , littleEndian \] )
*25-structured-data.md*
> This method performs the following steps when called:

## `25.3.4.9` DataView.prototype.getFloat64 ( byteOffset \[ , littleEndian \] )
*25-structured-data.md*
> This method performs the following steps when called:

## `25.3.4.10` DataView.prototype.getInt8 ( byteOffset )
*25-structured-data.md*
> This method performs the following steps when called:

## `25.3.4.11` DataView.prototype.getInt16 ( byteOffset \[ , littleEndian \] )
*25-structured-data.md*
> This method performs the following steps when called:

## `25.3.4.12` DataView.prototype.getInt32 ( byteOffset \[ , littleEndian \] )
*25-structured-data.md*
> This method performs the following steps when called:

## `25.3.4.13` DataView.prototype.getUint8 ( byteOffset )
*25-structured-data.md*
> This method performs the following steps when called:

## `25.3.4.14` DataView.prototype.getUint16 ( byteOffset \[ , littleEndian \] )
*25-structured-data.md*
> This method performs the following steps when called:

## `25.3.4.15` DataView.prototype.getUint32 ( byteOffset \[ , littleEndian \] )
*25-structured-data.md*
> This method performs the following steps when called:

## `25.3.4.16` DataView.prototype.setBigInt64 ( byteOffset, value \[ , littleEndian \] )
*25-structured-data.md*
> This method performs the following steps when called:

## `25.3.4.17` DataView.prototype.setBigUint64 ( byteOffset, value \[ , littleEndian \] )
*25-structured-data.md*
> This method performs the following steps when called:

## `25.3.4.18` DataView.prototype.setFloat16 ( byteOffset, value \[ , littleEndian \] )
*25-structured-data.md*
> This method performs the following steps when called:

## `25.3.4.19` DataView.prototype.setFloat32 ( byteOffset, value \[ , littleEndian \] )
*25-structured-data.md*
> This method performs the following steps when called:

## `25.3.4.20` DataView.prototype.setFloat64 ( byteOffset, value \[ , littleEndian \] )
*25-structured-data.md*
> This method performs the following steps when called:

## `25.3.4.21` DataView.prototype.setInt8 ( byteOffset, value )
*25-structured-data.md*
> This method performs the following steps when called:

## `25.3.4.22` DataView.prototype.setInt16 ( byteOffset, value \[ , littleEndian \] )
*25-structured-data.md*
> This method performs the following steps when called:

## `25.3.4.23` DataView.prototype.setInt32 ( byteOffset, value \[ , littleEndian \] )
*25-structured-data.md*
> This method performs the following steps when called:

## `25.3.4.24` DataView.prototype.setUint8 ( byteOffset, value )
*25-structured-data.md*
> This method performs the following steps when called:

## `25.3.4.25` DataView.prototype.setUint16 ( byteOffset, value \[ , littleEndian \] )
*25-structured-data.md*
> This method performs the following steps when called:

## `25.3.4.26` DataView.prototype.setUint32 ( byteOffset, value \[ , littleEndian \] )
*25-structured-data.md*
> This method performs the following steps when called:

## `25.4.3.1` ValidateIntegerTypedArray ( typedArray, waitable )
*25-structured-data.md*
> The abstract operation ValidateIntegerTypedArray takes arguments typedArray (an ECMAScript language value) and waitable (a Boolean) and returns either a normal completion containing a TypedArray With Buffer Witness Record, or a throw completion. It performs the following steps when called:

## `25.4.3.2` ValidateAtomicAccess ( taRecord, requestIndex )
*25-structured-data.md*
> The abstract operation ValidateAtomicAccess takes arguments taRecord (a TypedArray With Buffer Witness Record) and requestIndex (an ECMAScript language value) and returns either a normal completion containing an integer or a throw completion. It performs the following steps when called:

## `25.4.3.3` ValidateAtomicAccessOnIntegerTypedArray ( typedArray, requestIndex \[ , waitable \] )
*25-structured-data.md*
> The abstract operation ValidateAtomicAccessOnIntegerTypedArray takes arguments typedArray (an ECMAScript language value) and requestIndex (an ECMAScript language value) and optional argument waitable (a Boolean) and returns either a normal completion containing an integer or a throw completion. It performs the following steps when called:

## `25.4.3.4` RevalidateAtomicAccess ( typedArray, byteIndexInBuffer )
*25-structured-data.md*
> The abstract operation RevalidateAtomicAccess takes arguments typedArray (a TypedArray) and byteIndexInBuffer (an integer) and returns either a normal completion containing unused or a throw completion. This operation revalidates the index within the backing buffer for atomic operations after all argument coercions are performed in Atomics methods, as argument coercions can have arbitrary side effects, which could cause the buffer to become out of bounds. This operation does not throw when typedArray's backing buffer is a SharedArrayBuffer. It performs the following steps when called:

## `25.4.3.5` GetWaiterList ( block, i )
*25-structured-data.md*
> The abstract operation GetWaiterList takes arguments block (a Shared Data Block) and i (a non-negative integer that is evenly divisible by 4) and returns a WaiterList Record. It performs the following steps when called:

## `25.4.3.6` EnterCriticalSection ( WL )
*25-structured-data.md*
> The abstract operation EnterCriticalSection takes argument WL (a WaiterList Record) and returns unused. It performs the following steps when called:

## `25.4.3.7` LeaveCriticalSection ( WL )
*25-structured-data.md*
> The abstract operation LeaveCriticalSection takes argument WL (a WaiterList Record) and returns unused. It performs the following steps when called:

## `25.4.3.8` AddWaiter ( WL, waiterRecord )
*25-structured-data.md*
> The abstract operation AddWaiter takes arguments WL (a WaiterList Record) and waiterRecord (a Waiter Record) and returns unused. It performs the following steps when called:

## `25.4.3.9` RemoveWaiter ( WL, waiterRecord )
*25-structured-data.md*
> The abstract operation RemoveWaiter takes arguments WL (a WaiterList Record) and waiterRecord (a Waiter Record) and returns unused. It performs the following steps when called:

## `25.4.3.10` RemoveWaiters ( WL, c )
*25-structured-data.md*
> The abstract operation RemoveWaiters takes arguments WL (a WaiterList Record) and c (a non-negative integer or +∞) and returns a List of Waiter Records. It performs the following steps when called:

## `25.4.3.11` SuspendThisAgent ( WL, waiterRecord )
*25-structured-data.md*
> The abstract operation SuspendThisAgent takes arguments WL (a WaiterList Record) and waiterRecord (a Waiter Record) and returns unused. It performs the following steps when called:

## `25.4.3.12` NotifyWaiter ( WL, waiterRecord )
*25-structured-data.md*
> The abstract operation NotifyWaiter takes arguments WL (a WaiterList Record) and waiterRecord (a Waiter Record) and returns unused. It performs the following steps when called:

## `25.4.3.13` EnqueueResolveInAgentJob ( agentSignifier, promiseCapability, resolution )
*25-structured-data.md*
> The abstract operation EnqueueResolveInAgentJob takes arguments agentSignifier (an agent signifier), promiseCapability (a PromiseCapability Record), and resolution ("ok" or "timed-out") and returns unused. It performs the following steps when called:

## `25.4.3.14` DoWait ( mode, typedArray, index, value, timeout )
*25-structured-data.md*
> The abstract operation DoWait takes arguments mode (sync or async), typedArray (an ECMAScript language value), index (an ECMAScript language value), value (an ECMAScript language value), and timeout (an ECMAScript language value) and returns either a normal completion containing either an Object, "not-equal", "timed-out", or "ok", or a throw completion. It performs the following steps when called:

## `25.4.3.15` EnqueueAtomicsWaitAsyncTimeoutJob ( WL, waiterRecord )
*25-structured-data.md*
> The abstract operation EnqueueAtomicsWaitAsyncTimeoutJob takes arguments WL (a WaiterList Record) and waiterRecord (a Waiter Record) and returns unused. It performs the following steps when called:

## `25.4.3.16` AtomicCompareExchangeInSharedBlock ( block, byteIndexInBuffer, elementSize, expectedBytes, replacementBytes )
*25-structured-data.md*
> The abstract operation AtomicCompareExchangeInSharedBlock takes arguments block (a Shared Data Block), byteIndexInBuffer (an integer), elementSize (a non-negative integer), expectedBytes (a List of byte values), and replacementBytes (a List of byte values) and returns a List of byte values. It performs the following steps when called:

## `25.4.3.17` AtomicReadModifyWrite ( typedArray, index, value, op )
*25-structured-data.md*
> The abstract operation AtomicReadModifyWrite takes arguments typedArray (an ECMAScript language value), index (an ECMAScript language value), value (an ECMAScript language value), and op (a read-modify-write modification function) and returns either a normal completion containing either a Number or a BigInt, or a throw completion. op takes two List of byte values arguments and returns a List of byte values. This operation atomically loads a value, combines it with another value, and stores the combination. It returns the loaded value. It performs the following steps when called:

## `25.4.3.18` ByteListBitwiseOp ( op, xBytes, yBytes )
*25-structured-data.md*
> The abstract operation ByteListBitwiseOp takes arguments op (&, ^, or |), xBytes (a List of byte values), and yBytes (a List of byte values) and returns a List of byte values. The operation atomically performs a bitwise operation on all byte values of the arguments and returns a List of byte values. It performs the following steps when called:

## `25.4.3.19` ByteListEqual ( xBytes, yBytes )
*25-structured-data.md*
> The abstract operation ByteListEqual takes arguments xBytes (a List of byte values) and yBytes (a List of byte values) and returns a Boolean. It performs the following steps when called:

## `25.4.4` Atomics.add ( typedArray, index, value )
*25-structured-data.md*
> This function performs the following steps when called:

## `25.4.5` Atomics.and ( typedArray, index, value )
*25-structured-data.md*
> This function performs the following steps when called:

## `25.4.6` Atomics.compareExchange ( typedArray, index, expectedValue, replacementValue )
*25-structured-data.md*
> This function performs the following steps when called:

## `25.4.7` Atomics.exchange ( typedArray, index, value )
*25-structured-data.md*
> This function performs the following steps when called:

## `25.4.8` Atomics.isLockFree ( size )
*25-structured-data.md*
> This function performs the following steps when called:

## `25.4.9` Atomics.load ( typedArray, index )
*25-structured-data.md*
> This function performs the following steps when called:

## `25.4.10` Atomics.or ( typedArray, index, value )
*25-structured-data.md*
> This function performs the following steps when called:

## `25.4.11` Atomics.store ( typedArray, index, value )
*25-structured-data.md*
> This function performs the following steps when called:

## `25.4.12` Atomics.sub ( typedArray, index, value )
*25-structured-data.md*
> This function performs the following steps when called:

## `25.4.13` Atomics.wait ( typedArray, index, value, timeout )
*25-structured-data.md*
> This function puts the surrounding agent in a wait queue and suspends it until notified or until the wait times out, returning a String differentiating those cases.

## `25.4.14` Atomics.waitAsync ( typedArray, index, value, timeout )
*25-structured-data.md*
> This function returns a Promise that is resolved when the calling agent is notified or the timeout is reached.

## `25.4.15` Atomics.notify ( typedArray, index, count )
*25-structured-data.md*
> This function notifies some agents that are sleeping in the wait queue.

## `25.4.16` Atomics.xor ( typedArray, index, value )
*25-structured-data.md*
> This function performs the following steps when called:

## `25.5.1` JSON.parse ( text \[ , reviver \] )
*25-structured-data.md*
> This function parses a JSON text (a JSON-formatted String) and produces an ECMAScript language value. The JSON format represents literals, arrays, and objects with a syntax similar to the syntax for ECMAScript literals, Array Initializers, and Object Initializers. After parsing, JSON objects are realized as ECMAScript objects. JSON arrays are realized as ECMAScript Array instances. JSON strings, numbers, booleans, and null are realized as ECMAScript Strings, Numbers, Booleans, and null.

## `25.5.1.1` ParseJSON ( text )
*25-structured-data.md*
> The abstract operation ParseJSON takes argument text (a String) and returns either a normal completion containing an ECMAScript language value or a throw completion. It performs the following steps when called:

## `25.5.1.2` InternalizeJSONProperty ( holder, name, reviver )
*25-structured-data.md*
> The abstract operation InternalizeJSONProperty takes arguments holder (an Object), name (a String), and reviver (a function object) and returns either a normal completion containing an ECMAScript language value or a throw completion.

## `25.5.2` JSON.stringify ( value \[ , replacer \[ , space \] \] )
*25-structured-data.md*
> This function returns a String in UTF-16 encoded JSON format representing an ECMAScript language value, or undefined. It can take three parameters. The value parameter is an ECMAScript language value, which is usually an object or array, although it can also be a String, Boolean, Number or null. The optional replacer parameter is either a function that alters the way objects and arrays are stringified, or an array of Strings and Numbers that acts as an inclusion list for selecting the object properties that will be stringified. The optional space parameter is a String or Number that allows the result to have white space injected into it to improve human readability.

## `25.5.2.2` SerializeJSONProperty ( state, key, holder )
*25-structured-data.md*
> The abstract operation SerializeJSONProperty takes arguments state (a JSON Serialization Record), key (a String), and holder (an Object) and returns either a normal completion containing either a String or undefined, or a throw completion. It performs the following steps when called:

## `25.5.2.3` QuoteJSONString ( value )
*25-structured-data.md*
> The abstract operation QuoteJSONString takes argument value (a String) and returns a String. It wraps value in 0x0022 (QUOTATION MARK) code units and escapes certain other code units within it. This operation interprets value as a sequence of UTF-16 encoded code points, as described in 6.1.4. It performs the following steps when called:

## `25.5.2.4` UnicodeEscape ( C )
*25-structured-data.md*
> The abstract operation UnicodeEscape takes argument C (a code unit) and returns a String. It represents C as a Unicode escape sequence. It performs the following steps when called:

## `25.5.2.5` SerializeJSONObject ( state, value )
*25-structured-data.md*
> The abstract operation SerializeJSONObject takes arguments state (a JSON Serialization Record) and value (an Object) and returns either a normal completion containing a String or a throw completion. It serializes an object. It performs the following steps when called:

## `25.5.2.6` SerializeJSONArray ( state, value )
*25-structured-data.md*
> The abstract operation SerializeJSONArray takes arguments state (a JSON Serialization Record) and value (an ECMAScript language value) and returns either a normal completion containing a String or a throw completion. It serializes an array. It performs the following steps when called:

## `26.1.1.1` WeakRef ( target )
*26-managing-memory.md*
> This function performs the following steps when called:

## `26.1.3.2` WeakRef.prototype.deref (  )
*26-managing-memory.md*
> This method performs the following steps when called:

## `26.1.4.1` WeakRefDeref ( weakRef )
*26-managing-memory.md*
> The abstract operation WeakRefDeref takes argument weakRef (a WeakRef) and returns an ECMAScript language value. It performs the following steps when called:

## `26.2.1.1` FinalizationRegistry ( cleanupCallback )
*26-managing-memory.md*
> This function performs the following steps when called:

## `26.2.3.2` FinalizationRegistry.prototype.register ( target, heldValue \[ , unregisterToken \] )
*26-managing-memory.md*
> This method performs the following steps when called:

## `26.2.3.3` FinalizationRegistry.prototype.unregister ( unregisterToken )
*26-managing-memory.md*
> This method performs the following steps when called:

## `27.1.2.1.1` %IteratorHelperPrototype%.next (  )
*27-control-abstraction-objects.md*
> 1.  Return ? GeneratorResume(this value, undefined, "Iterator Helper").

## `27.1.2.1.2` %IteratorHelperPrototype%.return (  )
*27-control-abstraction-objects.md*
> 1.  Let O be this value.

## `27.1.3.1.1` Iterator (  )
*27-control-abstraction-objects.md*
> This function performs the following steps when called:

## `27.1.3.2.1` Iterator.from ( O )
*27-control-abstraction-objects.md*
> 1.  Let iteratorRecord be ? GetIteratorFlattenable(O, iterate-string-primitives).

## `27.1.3.2.1.1.1` %WrapForValidIteratorPrototype%.next (  )
*27-control-abstraction-objects.md*
> 1.  Let O be this value.

## `27.1.3.2.1.1.2` %WrapForValidIteratorPrototype%.return (  )
*27-control-abstraction-objects.md*
> 1.  Let O be this value.

## `27.1.4.2` Iterator.prototype.drop ( limit )
*27-control-abstraction-objects.md*
> This method performs the following steps when called:

## `27.1.4.3` Iterator.prototype.every ( predicate )
*27-control-abstraction-objects.md*
> This method performs the following steps when called:

## `27.1.4.4` Iterator.prototype.filter ( predicate )
*27-control-abstraction-objects.md*
> This method performs the following steps when called:

## `27.1.4.5` Iterator.prototype.find ( predicate )
*27-control-abstraction-objects.md*
> This method performs the following steps when called:

## `27.1.4.6` Iterator.prototype.flatMap ( mapper )
*27-control-abstraction-objects.md*
> This method performs the following steps when called:

## `27.1.4.7` Iterator.prototype.forEach ( procedure )
*27-control-abstraction-objects.md*
> This method performs the following steps when called:

## `27.1.4.8` Iterator.prototype.map ( mapper )
*27-control-abstraction-objects.md*
> This method performs the following steps when called:

## `27.1.4.9` Iterator.prototype.reduce ( reducer \[ , initialValue \] )
*27-control-abstraction-objects.md*
> This method performs the following steps when called:

## `27.1.4.10` Iterator.prototype.some ( predicate )
*27-control-abstraction-objects.md*
> This method performs the following steps when called:

## `27.1.4.11` Iterator.prototype.take ( limit )
*27-control-abstraction-objects.md*
> This method performs the following steps when called:

## `27.1.4.12` Iterator.prototype.toArray (  )
*27-control-abstraction-objects.md*
> This method performs the following steps when called:

## `27.1.4.13` Iterator.prototype \[ %Symbol.iterator% \] (  )
*27-control-abstraction-objects.md*
> This function performs the following steps when called:

## `27.1.5.1` %AsyncIteratorPrototype% \[ %Symbol.asyncIterator% \] (  )
*27-control-abstraction-objects.md*
> This function performs the following steps when called:

## `27.1.6.1` CreateAsyncFromSyncIterator ( syncIteratorRecord )
*27-control-abstraction-objects.md*
> The abstract operation CreateAsyncFromSyncIterator takes argument syncIteratorRecord (an Iterator Record) and returns an Iterator Record. It is used to create an async Iterator Record from a synchronous Iterator Record. It performs the following steps when called:

## `27.1.6.2.1` %AsyncFromSyncIteratorPrototype%.next ( \[ value \] )
*27-control-abstraction-objects.md*
> 1.  Let O be the this value.

## `27.1.6.2.2` %AsyncFromSyncIteratorPrototype%.return ( \[ value \] )
*27-control-abstraction-objects.md*
> 1.  Let O be the this value.

## `27.1.6.2.3` %AsyncFromSyncIteratorPrototype%.throw ( \[ value \] )
*27-control-abstraction-objects.md*
> Note

## `27.1.6.4` AsyncFromSyncIteratorContinuation ( result, promiseCapability, syncIteratorRecord, closeOnRejection )
*27-control-abstraction-objects.md*
> The abstract operation AsyncFromSyncIteratorContinuation takes arguments result (an Object), promiseCapability (a PromiseCapability Record for an intrinsic %Promise%), syncIteratorRecord (an Iterator Record), and closeOnRejection (a Boolean) and returns a Promise. It performs the following steps when called:

## `27.2.1.1.1` IfAbruptRejectPromise ( value, capability )
*27-control-abstraction-objects.md*
> IfAbruptRejectPromise is a shorthand for a sequence of algorithm steps that use a PromiseCapability Record. An algorithm step of the form:

## `27.2.1.3` CreateResolvingFunctions ( promise )
*27-control-abstraction-objects.md*
> The abstract operation CreateResolvingFunctions takes argument promise (a Promise) and returns a Record with fields [[Resolve]] (a function object) and [[Reject]] (a function object). It performs the following steps when called:

## `27.2.1.4` FulfillPromise ( promise, value )
*27-control-abstraction-objects.md*
> The abstract operation FulfillPromise takes arguments promise (a Promise) and value (an ECMAScript language value) and returns unused. It performs the following steps when called:

## `27.2.1.5` NewPromiseCapability ( C )
*27-control-abstraction-objects.md*
> The abstract operation NewPromiseCapability takes argument C (an ECMAScript language value) and returns either a normal completion containing a PromiseCapability Record or a throw completion. It attempts to use C as a constructor in the fashion of the built-in Promise constructor to create a promise and extract its resolve and reject functions. The promise plus the resolve and reject functions are used to initialize a new PromiseCapability Record. It performs the following steps when called:

## `27.2.1.6` IsPromise ( x )
*27-control-abstraction-objects.md*
> The abstract operation IsPromise takes argument x (an ECMAScript language value) and returns a Boolean. It checks for the promise brand on an object. It performs the following steps when called:

## `27.2.1.7` RejectPromise ( promise, reason )
*27-control-abstraction-objects.md*
> The abstract operation RejectPromise takes arguments promise (a Promise) and reason (an ECMAScript language value) and returns unused. It performs the following steps when called:

## `27.2.1.8` TriggerPromiseReactions ( reactions, argument )
*27-control-abstraction-objects.md*
> The abstract operation TriggerPromiseReactions takes arguments reactions (a List of PromiseReaction Records) and argument (an ECMAScript language value) and returns unused. It enqueues a new Job for each record in reactions. Each such Job processes the [[Type]] and [[Handler]] of the PromiseReaction Record, and if the [[Handler]] is not empty, calls it passing the given argument. If the [[Handler]] is empty, the behaviour is determined by the [[Type]]. It performs the following steps when called:

## `27.2.1.9` HostPromiseRejectionTracker ( promise, operation )
*27-control-abstraction-objects.md*
> The host-defined abstract operation HostPromiseRejectionTracker takes arguments promise (a Promise) and operation ("reject" or "handle") and returns unused. It allows host environments to track promise rejections.

## `27.2.2.1` NewPromiseReactionJob ( reaction, argument )
*27-control-abstraction-objects.md*
> The abstract operation NewPromiseReactionJob takes arguments reaction (a PromiseReaction Record) and argument (an ECMAScript language value) and returns a Record with fields [[Job]] (a Job Abstract Closure) and [[Realm]] (a Realm Record or null). It returns a new Job Abstract Closure that applies the appropriate handler to the incoming value, and uses the handler's return value to resolve or reject the derived promise associated with that handler. It performs the following steps when called:

## `27.2.2.2` NewPromiseResolveThenableJob ( promiseToResolve, thenable, then )
*27-control-abstraction-objects.md*
> The abstract operation NewPromiseResolveThenableJob takes arguments promiseToResolve (a Promise), thenable (an Object), and then (a JobCallback Record) and returns a Record with fields [[Job]] (a Job Abstract Closure) and [[Realm]] (a Realm Record). It performs the following steps when called:

## `27.2.3.1` Promise ( executor )
*27-control-abstraction-objects.md*
> This function performs the following steps when called:

## `27.2.4.1` Promise.all ( iterable )
*27-control-abstraction-objects.md*
> This function returns a new promise which is fulfilled with an array of fulfillment values for the passed promises, or rejects with the reason of the first passed promise that rejects. It resolves all elements of the passed iterable to promises as it runs this algorithm.

## `27.2.4.1.1` GetPromiseResolve ( promiseConstructor )
*27-control-abstraction-objects.md*
> The abstract operation GetPromiseResolve takes argument promiseConstructor (a constructor) and returns either a normal completion containing a function object or a throw completion. It performs the following steps when called:

## `27.2.4.1.2` PerformPromiseAll ( iteratorRecord, constructor, resultCapability, promiseResolve )
*27-control-abstraction-objects.md*
> The abstract operation PerformPromiseAll takes arguments iteratorRecord (an Iterator Record), constructor (a constructor), resultCapability (a PromiseCapability Record), and promiseResolve (a function object) and returns either a normal completion containing an ECMAScript language value or a throw completion. It performs the following steps when called:

## `27.2.4.2` Promise.allSettled ( iterable )
*27-control-abstraction-objects.md*
> This function returns a promise that is fulfilled with an array of promise state snapshots, but only after all the original promises have settled, i.e. become either fulfilled or rejected. It resolves all elements of the passed iterable to promises as it runs this algorithm.

## `27.2.4.2.1` PerformPromiseAllSettled ( iteratorRecord, constructor, resultCapability, promiseResolve )
*27-control-abstraction-objects.md*
> The abstract operation PerformPromiseAllSettled takes arguments iteratorRecord (an Iterator Record), constructor (a constructor), resultCapability (a PromiseCapability Record), and promiseResolve (a function object) and returns either a normal completion containing an ECMAScript language value or a throw completion. It performs the following steps when called:

## `27.2.4.3` Promise.any ( iterable )
*27-control-abstraction-objects.md*
> This function returns a promise that is fulfilled by the first given promise to be fulfilled, or rejected with an AggregateError holding the rejection reasons if all of the given promises are rejected. It resolves all elements of the passed iterable to promises as it runs this algorithm.

## `27.2.4.3.1` PerformPromiseAny ( iteratorRecord, constructor, resultCapability, promiseResolve )
*27-control-abstraction-objects.md*
> The abstract operation PerformPromiseAny takes arguments iteratorRecord (an Iterator Record), constructor (a constructor), resultCapability (a PromiseCapability Record), and promiseResolve (a function object) and returns either a normal completion containing an ECMAScript language value or a throw completion. It performs the following steps when called:

## `27.2.4.5` Promise.race ( iterable )
*27-control-abstraction-objects.md*
> This function returns a new promise which is settled in the same way as the first passed promise to settle. It resolves all elements of the passed iterable to promises as it runs this algorithm.

## `27.2.4.5.1` PerformPromiseRace ( iteratorRecord, constructor, resultCapability, promiseResolve )
*27-control-abstraction-objects.md*
> The abstract operation PerformPromiseRace takes arguments iteratorRecord (an Iterator Record), constructor (a constructor), resultCapability (a PromiseCapability Record), and promiseResolve (a function object) and returns either a normal completion containing an ECMAScript language value or a throw completion. It performs the following steps when called:

## `27.2.4.6` Promise.reject ( r )
*27-control-abstraction-objects.md*
> This function returns a new promise rejected with the passed argument.

## `27.2.4.7` Promise.resolve ( x )
*27-control-abstraction-objects.md*
> This function returns either a new promise resolved with the passed argument, or the argument itself if the argument is a promise produced by this constructor.

## `27.2.4.7.1` PromiseResolve ( C, x )
*27-control-abstraction-objects.md*
> The abstract operation PromiseResolve takes arguments C (an Object) and x (an ECMAScript language value) and returns either a normal completion containing an ECMAScript language value or a throw completion. It returns a new promise resolved with x. It performs the following steps when called:

## `27.2.4.8` Promise.try ( callback, ...args )
*27-control-abstraction-objects.md*
> This function performs the following steps when called:

## `27.2.4.9` Promise.withResolvers (  )
*27-control-abstraction-objects.md*
> This function returns an object with three properties: a new promise together with the resolve and reject functions associated with it.

## `27.2.5.1` Promise.prototype.catch ( onRejected )
*27-control-abstraction-objects.md*
> This method performs the following steps when called:

## `27.2.5.3` Promise.prototype.finally ( onFinally )
*27-control-abstraction-objects.md*
> This method performs the following steps when called:

## `27.2.5.4` Promise.prototype.then ( onFulfilled, onRejected )
*27-control-abstraction-objects.md*
> This method performs the following steps when called:

## `27.2.5.4.1` PerformPromiseThen ( promise, onFulfilled, onRejected \[ , resultCapability \] )
*27-control-abstraction-objects.md*
> The abstract operation PerformPromiseThen takes arguments promise (a Promise), onFulfilled (an ECMAScript language value), and onRejected (an ECMAScript language value) and optional argument resultCapability (a PromiseCapability Record) and returns an ECMAScript language value. It performs the “then” operation on promise using onFulfilled and onRejected as its settlement actions. If resultCapability is passed, the result is stored by updating resultCapability's promise. If it is not passed, then PerformPromiseThen is being called by a specification-internal operation where the result does not matter. It performs the following steps when called:

## `27.3.1.1` GeneratorFunction ( ...parameterArgs, bodyArg )
*27-control-abstraction-objects.md*
> The last argument (if any) specifies the body (executable code) of a generator function; any preceding arguments specify formal parameters.

## `27.4.1.1` AsyncGeneratorFunction ( ...parameterArgs, bodyArg )
*27-control-abstraction-objects.md*
> The last argument (if any) specifies the body (executable code) of an async generator function; any preceding arguments specify formal parameters.

## `27.5.1.2` %GeneratorPrototype%.next ( value )
*27-control-abstraction-objects.md*
> 1.  Return ? GeneratorResume(this value, value, empty).

## `27.5.1.3` %GeneratorPrototype%.return ( value )
*27-control-abstraction-objects.md*
> This method performs the following steps when called:

## `27.5.1.4` %GeneratorPrototype%.throw ( exception )
*27-control-abstraction-objects.md*
> This method performs the following steps when called:

## `27.5.3.1` GeneratorStart ( generator, generatorBody )
*27-control-abstraction-objects.md*
> The abstract operation GeneratorStart takes arguments generator (a Generator) and generatorBody (a FunctionBody Parse Node or an Abstract Closure with no parameters) and returns unused. It performs the following steps when called:

## `27.5.3.2` GeneratorValidate ( generator, generatorBrand )
*27-control-abstraction-objects.md*
> The abstract operation GeneratorValidate takes arguments generator (an ECMAScript language value) and generatorBrand (a String or empty) and returns either a normal completion containing one of suspended-start, suspended-yield, or completed, or a throw completion. It performs the following steps when called:

## `27.5.3.3` GeneratorResume ( generator, value, generatorBrand )
*27-control-abstraction-objects.md*
> The abstract operation GeneratorResume takes arguments generator (an ECMAScript language value), value (an ECMAScript language value or empty), and generatorBrand (a String or empty) and returns either a normal completion containing an ECMAScript language value or a throw completion. It performs the following steps when called:

## `27.5.3.4` GeneratorResumeAbrupt ( generator, abruptCompletion, generatorBrand )
*27-control-abstraction-objects.md*
> The abstract operation GeneratorResumeAbrupt takes arguments generator (an ECMAScript language value), abruptCompletion (a return completion or a throw completion), and generatorBrand (a String or empty) and returns either a normal completion containing an ECMAScript language value or a throw completion. It performs the following steps when called:

## `27.5.3.5` GetGeneratorKind (  )
*27-control-abstraction-objects.md*
> The abstract operation GetGeneratorKind takes no arguments and returns non-generator, sync, or async. It performs the following steps when called:

## `27.5.3.6` GeneratorYield ( iteratorResult )
*27-control-abstraction-objects.md*
> The abstract operation GeneratorYield takes argument iteratorResult (an Object that conforms to the IteratorResult interface) and returns either a normal completion containing an ECMAScript language value or an abrupt completion. It performs the following steps when called:

## `27.5.3.7` Yield ( value )
*27-control-abstraction-objects.md*
> The abstract operation Yield takes argument value (an ECMAScript language value) and returns either a normal completion containing an ECMAScript language value or an abrupt completion. It performs the following steps when called:

## `27.5.3.8` CreateIteratorFromClosure ( closure, generatorBrand, generatorPrototype \[ , extraSlots \] )
*27-control-abstraction-objects.md*
> The abstract operation CreateIteratorFromClosure takes arguments closure (an Abstract Closure with no parameters), generatorBrand (a String or empty), and generatorPrototype (an Object) and optional argument extraSlots (a List of names of internal slots) and returns a Generator. It performs the following steps when called:

## `27.6.1.2` %AsyncGeneratorPrototype%.next ( value )
*27-control-abstraction-objects.md*
> 1.  Let generator be the this value.

## `27.6.1.3` %AsyncGeneratorPrototype%.return ( value )
*27-control-abstraction-objects.md*
> 1.  Let generator be the this value.

## `27.6.1.4` %AsyncGeneratorPrototype%.throw ( exception )
*27-control-abstraction-objects.md*
> 1.  Let generator be the this value.

## `27.6.3.2` AsyncGeneratorStart ( generator, generatorBody )
*27-control-abstraction-objects.md*
> The abstract operation AsyncGeneratorStart takes arguments generator (an AsyncGenerator) and generatorBody (a FunctionBody Parse Node or an Abstract Closure with no parameters) and returns unused. It performs the following steps when called:

## `27.6.3.3` AsyncGeneratorValidate ( generator, generatorBrand )
*27-control-abstraction-objects.md*
> The abstract operation AsyncGeneratorValidate takes arguments generator (an ECMAScript language value) and generatorBrand (a String or empty) and returns either a normal completion containing unused or a throw completion. It performs the following steps when called:

## `27.6.3.4` AsyncGeneratorEnqueue ( generator, completion, promiseCapability )
*27-control-abstraction-objects.md*
> The abstract operation AsyncGeneratorEnqueue takes arguments generator (an AsyncGenerator), completion (a Completion Record), and promiseCapability (a PromiseCapability Record) and returns unused. It performs the following steps when called:

## `27.6.3.5` AsyncGeneratorCompleteStep ( generator, completion, done \[ , realm \] )
*27-control-abstraction-objects.md*
> The abstract operation AsyncGeneratorCompleteStep takes arguments generator (an AsyncGenerator), completion (a Completion Record), and done (a Boolean) and optional argument realm (a Realm Record) and returns unused. It performs the following steps when called:

## `27.6.3.6` AsyncGeneratorResume ( generator, completion )
*27-control-abstraction-objects.md*
> The abstract operation AsyncGeneratorResume takes arguments generator (an AsyncGenerator) and completion (a Completion Record) and returns unused. It performs the following steps when called:

## `27.6.3.7` AsyncGeneratorUnwrapYieldResumption ( resumptionValue )
*27-control-abstraction-objects.md*
> The abstract operation AsyncGeneratorUnwrapYieldResumption takes argument resumptionValue (a Completion Record) and returns either a normal completion containing an ECMAScript language value or an abrupt completion. It performs the following steps when called:

## `27.6.3.8` AsyncGeneratorYield ( value )
*27-control-abstraction-objects.md*
> The abstract operation AsyncGeneratorYield takes argument value (an ECMAScript language value) and returns either a normal completion containing an ECMAScript language value or an abrupt completion. It performs the following steps when called:

## `27.6.3.9` AsyncGeneratorAwaitReturn ( generator )
*27-control-abstraction-objects.md*
> The abstract operation AsyncGeneratorAwaitReturn takes argument generator (an AsyncGenerator) and returns unused. It performs the following steps when called:

## `27.6.3.10` AsyncGeneratorDrainQueue ( generator )
*27-control-abstraction-objects.md*
> The abstract operation AsyncGeneratorDrainQueue takes argument generator (an AsyncGenerator) and returns unused. It drains the generator's AsyncGeneratorQueue until it encounters an AsyncGeneratorRequest which holds a return completion. It performs the following steps when called:

## `27.6.3.11` CreateAsyncIteratorFromClosure ( closure, generatorBrand, generatorPrototype )
*27-control-abstraction-objects.md*
> The abstract operation CreateAsyncIteratorFromClosure takes arguments closure (an Abstract Closure with no parameters), generatorBrand (a String or empty), and generatorPrototype (an Object) and returns an AsyncGenerator. It performs the following steps when called:

## `27.7.1.1` AsyncFunction ( ...parameterArgs, bodyArg )
*27-control-abstraction-objects.md*
> The last argument (if any) specifies the body (executable code) of an async function. Any preceding arguments specify formal parameters.

## `27.7.5.1` AsyncFunctionStart ( promiseCapability, asyncFunctionBody )
*27-control-abstraction-objects.md*
> The abstract operation AsyncFunctionStart takes arguments promiseCapability (a PromiseCapability Record) and asyncFunctionBody (a FunctionBody Parse Node, an ExpressionBody Parse Node, or an Abstract Closure with no parameters) and returns unused. It performs the following steps when called:

## `27.7.5.2` AsyncBlockStart ( promiseCapability, asyncBody, asyncContext )
*27-control-abstraction-objects.md*
> The abstract operation AsyncBlockStart takes arguments promiseCapability (a PromiseCapability Record), asyncBody (a Parse Node or an Abstract Closure with no parameters), and asyncContext (an execution context) and returns unused. It performs the following steps when called:

## `27.7.5.3` Await ( value )
*27-control-abstraction-objects.md*
> The abstract operation Await takes argument value (an ECMAScript language value) and returns either a normal completion containing either an ECMAScript language value or empty, or a throw completion. It performs the following steps when called:

## `28.1.1` Reflect.apply ( target, thisArgument, argumentsList )
*28-reflection.md*
> This function performs the following steps when called:

## `28.1.2` Reflect.construct ( target, argumentsList \[ , newTarget \] )
*28-reflection.md*
> This function performs the following steps when called:

## `28.1.3` Reflect.defineProperty ( target, propertyKey, attributes )
*28-reflection.md*
> This function performs the following steps when called:

## `28.1.4` Reflect.deleteProperty ( target, propertyKey )
*28-reflection.md*
> This function performs the following steps when called:

## `28.1.5` Reflect.get ( target, propertyKey \[ , receiver \] )
*28-reflection.md*
> This function performs the following steps when called:

## `28.1.6` Reflect.getOwnPropertyDescriptor ( target, propertyKey )
*28-reflection.md*
> This function performs the following steps when called:

## `28.1.7` Reflect.getPrototypeOf ( target )
*28-reflection.md*
> This function performs the following steps when called:

## `28.1.8` Reflect.has ( target, propertyKey )
*28-reflection.md*
> This function performs the following steps when called:

## `28.1.9` Reflect.isExtensible ( target )
*28-reflection.md*
> This function performs the following steps when called:

## `28.1.10` Reflect.ownKeys ( target )
*28-reflection.md*
> This function performs the following steps when called:

## `28.1.11` Reflect.preventExtensions ( target )
*28-reflection.md*
> This function performs the following steps when called:

## `28.1.12` Reflect.set ( target, propertyKey, V \[ , receiver \] )
*28-reflection.md*
> This function performs the following steps when called:

## `28.1.13` Reflect.setPrototypeOf ( target, proto )
*28-reflection.md*
> This function performs the following steps when called:

## `28.2.1.1` Proxy ( target, handler )
*28-reflection.md*
> This function performs the following steps when called:

## `28.2.2.1` Proxy.revocable ( target, handler )
*28-reflection.md*
> This function creates a revocable Proxy object.

## `29.5.1` EventSet ( execution )
*29-memory-model.md*
> The abstract operation EventSet takes argument execution (a candidate execution) and returns a Set of events. It performs the following steps when called:

## `29.5.2` SharedDataBlockEventSet ( execution )
*29-memory-model.md*
> The abstract operation SharedDataBlockEventSet takes argument execution (a candidate execution) and returns a Set of events. It performs the following steps when called:

## `29.5.3` HostEventSet ( execution )
*29-memory-model.md*
> The abstract operation HostEventSet takes argument execution (a candidate execution) and returns a Set of events. It performs the following steps when called:

## `29.5.4` ComposeWriteEventBytes ( execution, byteIndex, Ws )
*29-memory-model.md*
> The abstract operation ComposeWriteEventBytes takes arguments execution (a candidate execution), byteIndex (a non-negative integer), and Ws (a List of either WriteSharedMemory or ReadModifyWriteSharedMemory events) and returns a List of byte values. It performs the following steps when called:

## `29.5.5` ValueOfReadEvent ( execution, R )
*29-memory-model.md*
> The abstract operation ValueOfReadEvent takes arguments execution (a candidate execution) and R (a ReadSharedMemory or ReadModifyWriteSharedMemory event) and returns a List of byte values. It performs the following steps when called:

## `B.1.2.8.1` CharacterRangeOrUnion ( rer, A, B )
*annex-b-additional-ecmascript-features-for-web-browsers.md*
> The abstract operation CharacterRangeOrUnion takes arguments rer (a RegExp Record), A (a CharSet), and B (a CharSet) and returns a CharSet. It performs the following steps when called:

## `B.1.2.9` Static Semantics: ParsePattern ( patternText, u, v )
*annex-b-additional-ecmascript-features-for-web-browsers.md*
> The semantics of 22.2.3.4 is extended as follows:

## `B.2.1.1` escape ( string )
*annex-b-additional-ecmascript-features-for-web-browsers.md*
> This function is a property of the global object. It computes a new version of a String value in which certain code units have been replaced by a hexadecimal escape sequence.

## `B.2.1.2` unescape ( string )
*annex-b-additional-ecmascript-features-for-web-browsers.md*
> This function is a property of the global object. It computes a new version of a String value in which each escape sequence of the sort that might be introduced by the escape function is replaced with the code unit that it represents.

## `B.2.2.1` String.prototype.substr ( start, length )
*annex-b-additional-ecmascript-features-for-web-browsers.md*
> This method returns a substring of the result of converting the this value to a String, starting from index start and running for length code units (or through the end of the String if length is undefined). If start is negative, it is treated as sourceLength + start where sourceLength is the length of the String. The result is a String value, not a String object.

## `B.2.2.2` String.prototype.anchor ( name )
*annex-b-additional-ecmascript-features-for-web-browsers.md*
> This method performs the following steps when called:

## `B.2.2.2.1` CreateHTML ( string, tag, attribute, value )
*annex-b-additional-ecmascript-features-for-web-browsers.md*
> The abstract operation CreateHTML takes arguments string (an ECMAScript language value), tag (a String), attribute (a String), and value (an ECMAScript language value) and returns either a normal completion containing a String or a throw completion. It performs the following steps when called:

## `B.2.2.3` String.prototype.big (  )
*annex-b-additional-ecmascript-features-for-web-browsers.md*
> This method performs the following steps when called:

## `B.2.2.4` String.prototype.blink (  )
*annex-b-additional-ecmascript-features-for-web-browsers.md*
> This method performs the following steps when called:

## `B.2.2.5` String.prototype.bold (  )
*annex-b-additional-ecmascript-features-for-web-browsers.md*
> This method performs the following steps when called:

## `B.2.2.6` String.prototype.fixed (  )
*annex-b-additional-ecmascript-features-for-web-browsers.md*
> This method performs the following steps when called:

## `B.2.2.7` String.prototype.fontcolor ( colour )
*annex-b-additional-ecmascript-features-for-web-browsers.md*
> This method performs the following steps when called:

## `B.2.2.8` String.prototype.fontsize ( size )
*annex-b-additional-ecmascript-features-for-web-browsers.md*
> This method performs the following steps when called:

## `B.2.2.9` String.prototype.italics (  )
*annex-b-additional-ecmascript-features-for-web-browsers.md*
> This method performs the following steps when called:

## `B.2.2.10` String.prototype.link ( url )
*annex-b-additional-ecmascript-features-for-web-browsers.md*
> This method performs the following steps when called:

## `B.2.2.11` String.prototype.small (  )
*annex-b-additional-ecmascript-features-for-web-browsers.md*
> This method performs the following steps when called:

## `B.2.2.12` String.prototype.strike (  )
*annex-b-additional-ecmascript-features-for-web-browsers.md*
> This method performs the following steps when called:

## `B.2.2.13` String.prototype.sub (  )
*annex-b-additional-ecmascript-features-for-web-browsers.md*
> This method performs the following steps when called:

## `B.2.2.14` String.prototype.sup (  )
*annex-b-additional-ecmascript-features-for-web-browsers.md*
> This method performs the following steps when called:

## `B.2.2.15` String.prototype.trimLeft (  )
*annex-b-additional-ecmascript-features-for-web-browsers.md*
> Note

## `B.2.2.16` String.prototype.trimRight (  )
*annex-b-additional-ecmascript-features-for-web-browsers.md*
> Note

## `B.2.3.1` Date.prototype.getYear (  )
*annex-b-additional-ecmascript-features-for-web-browsers.md*
> Note

## `B.2.3.2` Date.prototype.setYear ( year )
*annex-b-additional-ecmascript-features-for-web-browsers.md*
> Note

## `B.2.3.3` Date.prototype.toGMTString (  )
*annex-b-additional-ecmascript-features-for-web-browsers.md*
> Note

## `B.2.4.1` RegExp.prototype.compile ( pattern, flags )
*annex-b-additional-ecmascript-features-for-web-browsers.md*
> This method performs the following steps when called:

