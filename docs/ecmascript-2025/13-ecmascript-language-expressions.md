# 13 ECMAScript Language: Expressions

## 13.1 Identifiers

### Syntax

[IdentifierReference](#prod-IdentifierReference)\[Yield, Await\] : [Identifier](#prod-Identifier) \[~Yield\] yield \[~Await\] await [BindingIdentifier](#prod-BindingIdentifier)\[Yield, Await\] : [Identifier](#prod-Identifier) yield await [LabelIdentifier](#prod-LabelIdentifier)\[Yield, Await\] : [Identifier](#prod-Identifier) \[~Yield\] yield \[~Await\] await [Identifier](#prod-Identifier) : [IdentifierName](#prod-IdentifierName) but not [ReservedWord](#prod-ReservedWord) Note

`yield` and `await` are permitted as [BindingIdentifier](#prod-BindingIdentifier) in the grammar, and prohibited with [static semantics](#sec-static-semantic-rules) below, to prohibit automatic semicolon insertion in cases such as

``` javascript
let
await 0;
```

### 13.1.1 Static Semantics: Early Errors

[BindingIdentifier](#prod-BindingIdentifier) : [Identifier](#prod-Identifier)

- It is a Syntax Error if [IsStrict](#sec-isstrict)(this production) is true and the [StringValue](#sec-static-semantics-stringvalue) of [Identifier](#prod-Identifier) is either "arguments" or "eval".

[IdentifierReference](#prod-IdentifierReference) : yield [BindingIdentifier](#prod-BindingIdentifier) : yield [LabelIdentifier](#prod-LabelIdentifier) : yield

- It is a Syntax Error if [IsStrict](#sec-isstrict)(this production) is true.

[IdentifierReference](#prod-IdentifierReference) : await [BindingIdentifier](#prod-BindingIdentifier) : await [LabelIdentifier](#prod-LabelIdentifier) : await

- It is a Syntax Error if the [goal symbol](#sec-context-free-grammars) of the syntactic grammar is [Module](#prod-Module).

[BindingIdentifier](#prod-BindingIdentifier)\[Yield, Await\] : yield

- It is a Syntax Error if this production has a _(\[Yield\]) parameter.

[BindingIdentifier](#prod-BindingIdentifier)\[Yield, Await\] : await

- It is a Syntax Error if this production has an _(\[Await\]) parameter.

[IdentifierReference](#prod-IdentifierReference)\[Yield, Await\] : [Identifier](#prod-Identifier) [BindingIdentifier](#prod-BindingIdentifier)\[Yield, Await\] : [Identifier](#prod-Identifier) [LabelIdentifier](#prod-LabelIdentifier)\[Yield, Await\] : [Identifier](#prod-Identifier)

- It is a Syntax Error if this production has a _(\[Yield\]) parameter and the [StringValue](#sec-static-semantics-stringvalue) of [Identifier](#prod-Identifier) is "yield".
- It is a Syntax Error if this production has an _(\[Await\]) parameter and the [StringValue](#sec-static-semantics-stringvalue) of [Identifier](#prod-Identifier) is "await".

[Identifier](#prod-Identifier) : [IdentifierName](#prod-IdentifierName) but not [ReservedWord](#prod-ReservedWord)

- It is a Syntax Error if [IsStrict](#sec-isstrict)(this phrase) is true and the [StringValue](#sec-static-semantics-stringvalue) of [IdentifierName](#prod-IdentifierName) is one of "implements", "interface", "let", "package", "private", "protected", "public", "static", or "yield".
- It is a Syntax Error if the [goal symbol](#sec-context-free-grammars) of the syntactic grammar is [Module](#prod-Module) and the [StringValue](#sec-static-semantics-stringvalue) of [IdentifierName](#prod-IdentifierName) is "await".
- It is a Syntax Error if the [StringValue](#sec-static-semantics-stringvalue) of [IdentifierName](#prod-IdentifierName) is the [StringValue](#sec-static-semantics-stringvalue) of any [ReservedWord](#prod-ReservedWord) except for `yield` or `await`.

Note

The [StringValue](#sec-static-semantics-stringvalue) of [IdentifierName](#prod-IdentifierName) normalizes any Unicode escape sequences in [IdentifierName](#prod-IdentifierName) hence such escapes cannot be used to write an [Identifier](#prod-Identifier) whose code point sequence is the same as a [ReservedWord](#prod-ReservedWord).

### 13.1.2 Static Semantics: StringValue

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) StringValue takes no arguments and returns a String. It is defined piecewise over the following productions:

[IdentifierName](#prod-IdentifierName) :: [IdentifierStart](#prod-IdentifierStart) [IdentifierName](#prod-IdentifierName) [IdentifierPart](#prod-IdentifierPart)

1.  Let `idTextUnescaped` be the [IdentifierCodePoints](#sec-identifiercodepoints) of [IdentifierName](#prod-IdentifierName).
2.  Return [CodePointsToString](#sec-codepointstostring)(`idTextUnescaped`).

[IdentifierReference](#prod-IdentifierReference) : yield [BindingIdentifier](#prod-BindingIdentifier) : yield [LabelIdentifier](#prod-LabelIdentifier) : yield

1.  Return "yield".

[IdentifierReference](#prod-IdentifierReference) : await [BindingIdentifier](#prod-BindingIdentifier) : await [LabelIdentifier](#prod-LabelIdentifier) : await

1.  Return "await".

[Identifier](#prod-Identifier) : [IdentifierName](#prod-IdentifierName) but not [ReservedWord](#prod-ReservedWord)

1.  Return the [StringValue](#sec-static-semantics-stringvalue) of [IdentifierName](#prod-IdentifierName).

[PrivateIdentifier](#prod-PrivateIdentifier) :: \# [IdentifierName](#prod-IdentifierName)

1.  Return the [string-concatenation](#string-concatenation) of 0x0023 (NUMBER SIGN) and the [StringValue](#sec-static-semantics-stringvalue) of [IdentifierName](#prod-IdentifierName).

[ModuleExportName](#prod-ModuleExportName) : [StringLiteral](#prod-StringLiteral)

1.  Return the [SV](#sec-static-semantics-sv) of [StringLiteral](#prod-StringLiteral).

### 13.1.3 Runtime Semantics: Evaluation

[IdentifierReference](#prod-IdentifierReference) : [Identifier](#prod-Identifier)

1.  Return ? [ResolveBinding](#sec-resolvebinding)([StringValue](#sec-static-semantics-stringvalue) of [Identifier](#prod-Identifier)).

[IdentifierReference](#prod-IdentifierReference) : yield

1.  Return ? [ResolveBinding](#sec-resolvebinding)("yield").

[IdentifierReference](#prod-IdentifierReference) : await

1.  Return ? [ResolveBinding](#sec-resolvebinding)("await").

Note 1

The result of evaluating an [IdentifierReference](#prod-IdentifierReference) is always a value of type Reference.

Note 2

In [non-strict code](#non-strict-code), the [keyword](#sec-keywords-and-reserved-words) `yield` may be used as an identifier. Evaluating the [IdentifierReference](#prod-IdentifierReference) resolves the binding of `yield` as if it was an [Identifier](#prod-Identifier). Early Error restriction ensures that such an evaluation only can occur for [non-strict code](#non-strict-code).

## 13.2 Primary Expression

### Syntax

[PrimaryExpression](#prod-PrimaryExpression)\[Yield, Await\] : this [IdentifierReference](#prod-IdentifierReference)\[?Yield, ?Await\] [Literal](#prod-Literal) [ArrayLiteral](#prod-ArrayLiteral)\[?Yield, ?Await\] [ObjectLiteral](#prod-ObjectLiteral)\[?Yield, ?Await\] [FunctionExpression](#prod-FunctionExpression) [ClassExpression](#prod-ClassExpression)\[?Yield, ?Await\] [GeneratorExpression](#prod-GeneratorExpression) [AsyncFunctionExpression](#prod-AsyncFunctionExpression) [AsyncGeneratorExpression](#prod-AsyncGeneratorExpression) [RegularExpressionLiteral](#prod-RegularExpressionLiteral) [TemplateLiteral](#prod-TemplateLiteral)\[?Yield, ?Await, ~Tagged\] [CoverParenthesizedExpressionAndArrowParameterList](#prod-CoverParenthesizedExpressionAndArrowParameterList)\[?Yield, ?Await\] [CoverParenthesizedExpressionAndArrowParameterList](#prod-CoverParenthesizedExpressionAndArrowParameterList)\[Yield, Await\] : ( [Expression](#prod-Expression)\[+In, ?Yield, ?Await\] ) ( [Expression](#prod-Expression)\[+In, ?Yield, ?Await\] , ) ( ) ( ... [BindingIdentifier](#prod-BindingIdentifier)\[?Yield, ?Await\] ) ( ... [BindingPattern](#prod-BindingPattern)\[?Yield, ?Await\] ) ( [Expression](#prod-Expression)\[+In, ?Yield, ?Await\] , ... [BindingIdentifier](#prod-BindingIdentifier)\[?Yield, ?Await\] ) ( [Expression](#prod-Expression)\[+In, ?Yield, ?Await\] , ... [BindingPattern](#prod-BindingPattern)\[?Yield, ?Await\] )

### Supplemental Syntax

When processing an instance of the production  
[PrimaryExpression](#prod-PrimaryExpression)\[Yield, Await\] : [CoverParenthesizedExpressionAndArrowParameterList](#prod-CoverParenthesizedExpressionAndArrowParameterList)\[?Yield, ?Await\]  
the interpretation of [CoverParenthesizedExpressionAndArrowParameterList](#prod-CoverParenthesizedExpressionAndArrowParameterList) is refined using the following grammar:

[ParenthesizedExpression](#prod-ParenthesizedExpression)\[Yield, Await\] : ( [Expression](#prod-Expression)\[+In, ?Yield, ?Await\] )

### 13.2.1 The `this` Keyword

#### 13.2.1.1 Runtime Semantics: Evaluation

[PrimaryExpression](#prod-PrimaryExpression) : this

1.  Return ? [ResolveThisBinding](#sec-resolvethisbinding)().

### 13.2.2 Identifier Reference

See [13.1](#sec-identifiers) for [IdentifierReference](#prod-IdentifierReference).

### 13.2.3 Literals

#### Syntax

[Literal](#prod-Literal) : [NullLiteral](#prod-NullLiteral) [BooleanLiteral](#prod-BooleanLiteral) [NumericLiteral](#prod-NumericLiteral) [StringLiteral](#prod-StringLiteral)

#### 13.2.3.1 Runtime Semantics: Evaluation

[Literal](#prod-Literal) : [NullLiteral](#prod-NullLiteral)

1.  Return null.

[Literal](#prod-Literal) : [BooleanLiteral](#prod-BooleanLiteral)

1.  If [BooleanLiteral](#prod-BooleanLiteral) is the token `false`, return false.
2.  If [BooleanLiteral](#prod-BooleanLiteral) is the token `true`, return true.

[Literal](#prod-Literal) : [NumericLiteral](#prod-NumericLiteral)

1.  Return the [NumericValue](#sec-numericvalue) of [NumericLiteral](#prod-NumericLiteral) as defined in [12.9.3](#sec-literals-numeric-literals).

[Literal](#prod-Literal) : [StringLiteral](#prod-StringLiteral)

1.  Return the [SV](#sec-static-semantics-sv) of [StringLiteral](#prod-StringLiteral) as defined in [12.9.4.2](#sec-static-semantics-sv).

### 13.2.4 Array Initializer

Note

An [ArrayLiteral](#prod-ArrayLiteral) is an expression describing the initialization of an Array, using a list, of zero or more expressions each of which represents an array element, enclosed in square brackets. The elements need not be literals; they are evaluated each time the array initializer is evaluated.

Array elements may be elided at the beginning, middle or end of the element list. Whenever a comma in the element list is not preceded by an [AssignmentExpression](#prod-AssignmentExpression) (i.e., a comma at the beginning or after another comma), the missing array element contributes to the length of the Array and increases the index of subsequent elements. Elided array elements are not defined. If an element is elided at the end of an array, that element does not contribute to the length of the Array.

#### Syntax

[ArrayLiteral](#prod-ArrayLiteral)\[Yield, Await\] : \[ [Elision](#prod-Elision)opt \] \[ [ElementList](#prod-ElementList)\[?Yield, ?Await\] \] \[ [ElementList](#prod-ElementList)\[?Yield, ?Await\] , [Elision](#prod-Elision)opt \] [ElementList](#prod-ElementList)\[Yield, Await\] : [Elision](#prod-Elision)opt [AssignmentExpression](#prod-AssignmentExpression)\[+In, ?Yield, ?Await\] [Elision](#prod-Elision)opt [SpreadElement](#prod-SpreadElement)\[?Yield, ?Await\] [ElementList](#prod-ElementList)\[?Yield, ?Await\] , [Elision](#prod-Elision)opt [AssignmentExpression](#prod-AssignmentExpression)\[+In, ?Yield, ?Await\] [ElementList](#prod-ElementList)\[?Yield, ?Await\] , [Elision](#prod-Elision)opt [SpreadElement](#prod-SpreadElement)\[?Yield, ?Await\] [Elision](#prod-Elision) : , [Elision](#prod-Elision) , [SpreadElement](#prod-SpreadElement)\[Yield, Await\] : ... [AssignmentExpression](#prod-AssignmentExpression)\[+In, ?Yield, ?Await\]

#### 13.2.4.1 Runtime Semantics: ArrayAccumulation

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) ArrayAccumulation takes arguments `array` (an Array) and `nextIndex` (an [integer](#integer)) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [integer](#integer) or an [abrupt completion](#sec-completion-record-specification-type). It is defined piecewise over the following productions:

[Elision](#prod-Elision) : ,

1.  Let `len` be `nextIndex` + 1.
2.  Perform ? [Set](#sec-set-o-p-v-throw)(`array`, "length", [𝔽](#𝔽)(`len`), true).
3.  NOTE: The above step throws if `len` exceeds 2\*\*³² - 1.
4.  Return `len`.

[Elision](#prod-Elision) : [Elision](#prod-Elision) ,

1.  Return ? [ArrayAccumulation](#sec-runtime-semantics-arrayaccumulation) of [Elision](#prod-Elision) with arguments `array` and (`nextIndex` + 1).

[ElementList](#prod-ElementList) : [Elision](#prod-Elision)opt [AssignmentExpression](#prod-AssignmentExpression)

1.  If [Elision](#prod-Elision) is present, then
    1.  Set `nextIndex` to ? [ArrayAccumulation](#sec-runtime-semantics-arrayaccumulation) of [Elision](#prod-Elision) with arguments `array` and `nextIndex`.
2.  Let `initResult` be ? [Evaluation](#sec-evaluation) of [AssignmentExpression](#prod-AssignmentExpression).
3.  Let `initValue` be ? [GetValue](#sec-getvalue)(`initResult`).
4.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`array`, ! [ToString](#sec-tostring)([𝔽](#𝔽)(`nextIndex`)), `initValue`).
5.  Return `nextIndex` + 1.

[ElementList](#prod-ElementList) : [Elision](#prod-Elision)opt [SpreadElement](#prod-SpreadElement)

1.  If [Elision](#prod-Elision) is present, then
    1.  Set `nextIndex` to ? [ArrayAccumulation](#sec-runtime-semantics-arrayaccumulation) of [Elision](#prod-Elision) with arguments `array` and `nextIndex`.
2.  Return ? [ArrayAccumulation](#sec-runtime-semantics-arrayaccumulation) of [SpreadElement](#prod-SpreadElement) with arguments `array` and `nextIndex`.

[ElementList](#prod-ElementList) : [ElementList](#prod-ElementList) , [Elision](#prod-Elision)opt [AssignmentExpression](#prod-AssignmentExpression)

1.  Set `nextIndex` to ? [ArrayAccumulation](#sec-runtime-semantics-arrayaccumulation) of [ElementList](#prod-ElementList) with arguments `array` and `nextIndex`.
2.  If [Elision](#prod-Elision) is present, then
    1.  Set `nextIndex` to ? [ArrayAccumulation](#sec-runtime-semantics-arrayaccumulation) of [Elision](#prod-Elision) with arguments `array` and `nextIndex`.
3.  Let `initResult` be ? [Evaluation](#sec-evaluation) of [AssignmentExpression](#prod-AssignmentExpression).
4.  Let `initValue` be ? [GetValue](#sec-getvalue)(`initResult`).
5.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`array`, ! [ToString](#sec-tostring)([𝔽](#𝔽)(`nextIndex`)), `initValue`).
6.  Return `nextIndex` + 1.

[ElementList](#prod-ElementList) : [ElementList](#prod-ElementList) , [Elision](#prod-Elision)opt [SpreadElement](#prod-SpreadElement)

1.  Set `nextIndex` to ? [ArrayAccumulation](#sec-runtime-semantics-arrayaccumulation) of [ElementList](#prod-ElementList) with arguments `array` and `nextIndex`.
2.  If [Elision](#prod-Elision) is present, then
    1.  Set `nextIndex` to ? [ArrayAccumulation](#sec-runtime-semantics-arrayaccumulation) of [Elision](#prod-Elision) with arguments `array` and `nextIndex`.
3.  Return ? [ArrayAccumulation](#sec-runtime-semantics-arrayaccumulation) of [SpreadElement](#prod-SpreadElement) with arguments `array` and `nextIndex`.

[SpreadElement](#prod-SpreadElement) : ... [AssignmentExpression](#prod-AssignmentExpression)

1.  Let `spreadRef` be ? [Evaluation](#sec-evaluation) of [AssignmentExpression](#prod-AssignmentExpression).
2.  Let `spreadObj` be ? [GetValue](#sec-getvalue)(`spreadRef`).
3.  Let `iteratorRecord` be ? [GetIterator](#sec-getiterator)(`spreadObj`, sync).
4.  Repeat,
    1.  Let `next` be ? [IteratorStepValue](#sec-iteratorstepvalue)(`iteratorRecord`).
    2.  If `next` is done, return `nextIndex`.
    3.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`array`, ! [ToString](#sec-tostring)([𝔽](#𝔽)(`nextIndex`)), `next`).
    4.  Set `nextIndex` to `nextIndex` + 1.

Note

[CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow) is used to ensure that own properties are defined for the array even if the standard built-in [Array prototype object](#sec-properties-of-the-array-prototype-object) has been modified in a manner that would preclude the creation of new own properties using `[[Set]]`.

#### 13.2.4.2 Runtime Semantics: Evaluation

[ArrayLiteral](#prod-ArrayLiteral) : \[ [Elision](#prod-Elision)opt \]

1.  Let `array` be ! [ArrayCreate](#sec-arraycreate)(0).
2.  If [Elision](#prod-Elision) is present, then
    1.  Perform ? [ArrayAccumulation](#sec-runtime-semantics-arrayaccumulation) of [Elision](#prod-Elision) with arguments `array` and 0.
3.  Return `array`.

[ArrayLiteral](#prod-ArrayLiteral) : \[ [ElementList](#prod-ElementList) \]

1.  Let `array` be ! [ArrayCreate](#sec-arraycreate)(0).
2.  Perform ? [ArrayAccumulation](#sec-runtime-semantics-arrayaccumulation) of [ElementList](#prod-ElementList) with arguments `array` and 0.
3.  Return `array`.

[ArrayLiteral](#prod-ArrayLiteral) : \[ [ElementList](#prod-ElementList) , [Elision](#prod-Elision)opt \]

1.  Let `array` be ! [ArrayCreate](#sec-arraycreate)(0).
2.  Let `nextIndex` be ? [ArrayAccumulation](#sec-runtime-semantics-arrayaccumulation) of [ElementList](#prod-ElementList) with arguments `array` and 0.
3.  If [Elision](#prod-Elision) is present, then
    1.  Perform ? [ArrayAccumulation](#sec-runtime-semantics-arrayaccumulation) of [Elision](#prod-Elision) with arguments `array` and `nextIndex`.
4.  Return `array`.

### 13.2.5 Object Initializer

Note 1

An object initializer is an expression describing the initialization of an Object, written in a form resembling a literal. It is a list of zero or more pairs of [property keys](#property-key) and associated values, enclosed in curly brackets. The values need not be literals; they are evaluated each time the object initializer is evaluated.

#### Syntax

[ObjectLiteral](#prod-ObjectLiteral)\[Yield, Await\] : { } { [PropertyDefinitionList](#prod-PropertyDefinitionList)\[?Yield, ?Await\] } { [PropertyDefinitionList](#prod-PropertyDefinitionList)\[?Yield, ?Await\] , } [PropertyDefinitionList](#prod-PropertyDefinitionList)\[Yield, Await\] : [PropertyDefinition](#prod-PropertyDefinition)\[?Yield, ?Await\] [PropertyDefinitionList](#prod-PropertyDefinitionList)\[?Yield, ?Await\] , [PropertyDefinition](#prod-PropertyDefinition)\[?Yield, ?Await\] [PropertyDefinition](#prod-PropertyDefinition)\[Yield, Await\] : [IdentifierReference](#prod-IdentifierReference)\[?Yield, ?Await\] [CoverInitializedName](#prod-CoverInitializedName)\[?Yield, ?Await\] [PropertyName](#prod-PropertyName)\[?Yield, ?Await\] : [AssignmentExpression](#prod-AssignmentExpression)\[+In, ?Yield, ?Await\] [MethodDefinition](#prod-MethodDefinition)\[?Yield, ?Await\] ... [AssignmentExpression](#prod-AssignmentExpression)\[+In, ?Yield, ?Await\] [PropertyName](#prod-PropertyName)\[Yield, Await\] : [LiteralPropertyName](#prod-LiteralPropertyName) [ComputedPropertyName](#prod-ComputedPropertyName)\[?Yield, ?Await\] [LiteralPropertyName](#prod-LiteralPropertyName) : [IdentifierName](#prod-IdentifierName) [StringLiteral](#prod-StringLiteral) [NumericLiteral](#prod-NumericLiteral) [ComputedPropertyName](#prod-ComputedPropertyName)\[Yield, Await\] : \[ [AssignmentExpression](#prod-AssignmentExpression)\[+In, ?Yield, ?Await\] \] [CoverInitializedName](#prod-CoverInitializedName)\[Yield, Await\] : [IdentifierReference](#prod-IdentifierReference)\[?Yield, ?Await\] [Initializer](#prod-Initializer)\[+In, ?Yield, ?Await\] [Initializer](#prod-Initializer)\[In, Yield, Await\] : = [AssignmentExpression](#prod-AssignmentExpression)\[?In, ?Yield, ?Await\] Note 2

[MethodDefinition](#prod-MethodDefinition) is defined in [15.4](#sec-method-definitions).

Note 3

In certain contexts, [ObjectLiteral](#prod-ObjectLiteral) is used as a cover grammar for a more restricted secondary grammar. The [CoverInitializedName](#prod-CoverInitializedName) production is necessary to fully cover these secondary grammars. However, use of this production results in an early Syntax Error in normal contexts where an actual [ObjectLiteral](#prod-ObjectLiteral) is expected.

#### 13.2.5.1 Static Semantics: Early Errors

[PropertyDefinition](#prod-PropertyDefinition) : [MethodDefinition](#prod-MethodDefinition)

- It is a Syntax Error if [HasDirectSuper](#sec-static-semantics-hasdirectsuper) of [MethodDefinition](#prod-MethodDefinition) is true.
- It is a Syntax Error if the [PrivateBoundIdentifiers](#sec-static-semantics-privateboundidentifiers) of [MethodDefinition](#prod-MethodDefinition) is not empty.

In addition to describing an actual object initializer the [ObjectLiteral](#prod-ObjectLiteral) productions are also used as a cover grammar for [ObjectAssignmentPattern](#prod-ObjectAssignmentPattern) and may be recognized as part of a [CoverParenthesizedExpressionAndArrowParameterList](#prod-CoverParenthesizedExpressionAndArrowParameterList). When [ObjectLiteral](#prod-ObjectLiteral) appears in a context where [ObjectAssignmentPattern](#prod-ObjectAssignmentPattern) is required the following Early Error rules are **not** applied. In addition, they are not applied when initially parsing a [CoverParenthesizedExpressionAndArrowParameterList](#prod-CoverParenthesizedExpressionAndArrowParameterList) or [CoverCallExpressionAndAsyncArrowHead](#prod-CoverCallExpressionAndAsyncArrowHead).

[PropertyDefinition](#prod-PropertyDefinition) : [CoverInitializedName](#prod-CoverInitializedName)

- It is a Syntax Error if any source text is matched by this production.

Note 1

This production exists so that [ObjectLiteral](#prod-ObjectLiteral) can serve as a cover grammar for [ObjectAssignmentPattern](#prod-ObjectAssignmentPattern). It cannot occur in an actual object initializer.

[ObjectLiteral](#prod-ObjectLiteral) : { [PropertyDefinitionList](#prod-PropertyDefinitionList) } { [PropertyDefinitionList](#prod-PropertyDefinitionList) , }

- It is a Syntax Error if the [PropertyNameList](#sec-static-semantics-propertynamelist) of [PropertyDefinitionList](#prod-PropertyDefinitionList) contains any duplicate entries for "\_\_proto\_\_" and at least two of those entries were obtained from productions of the form [PropertyDefinition](#prod-PropertyDefinition) : [PropertyName](#prod-PropertyName) : [AssignmentExpression](#prod-AssignmentExpression) . This rule is not applied if this [ObjectLiteral](#prod-ObjectLiteral) is contained within a [Script](#prod-Script) that is being parsed for [ParseJSON](#sec-ParseJSON) (see step [3](#step-json-parse-parse) of [ParseJSON](#sec-ParseJSON)).

Note 2

The [List](#sec-list-and-record-specification-type) returned by [PropertyNameList](#sec-static-semantics-propertynamelist) does not include property names defined using a [ComputedPropertyName](#prod-ComputedPropertyName).

#### 13.2.5.2 Static Semantics: IsComputedPropertyKey

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) IsComputedPropertyKey takes no arguments and returns a Boolean. It is defined piecewise over the following productions:

[PropertyName](#prod-PropertyName) : [LiteralPropertyName](#prod-LiteralPropertyName)

1.  Return false.

[PropertyName](#prod-PropertyName) : [ComputedPropertyName](#prod-ComputedPropertyName)

1.  Return true.

#### 13.2.5.3 Static Semantics: PropertyNameList

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) PropertyNameList takes no arguments and returns a [List](#sec-list-and-record-specification-type) of Strings. It is defined piecewise over the following productions:

[PropertyDefinitionList](#prod-PropertyDefinitionList) : [PropertyDefinition](#prod-PropertyDefinition)

1.  Let `propName` be the [PropName](#sec-static-semantics-propname) of [PropertyDefinition](#prod-PropertyDefinition).
2.  If `propName` is empty, return a new empty [List](#sec-list-and-record-specification-type).
3.  Return « `propName` ».

[PropertyDefinitionList](#prod-PropertyDefinitionList) : [PropertyDefinitionList](#prod-PropertyDefinitionList) , [PropertyDefinition](#prod-PropertyDefinition)

1.  Let `list` be the [PropertyNameList](#sec-static-semantics-propertynamelist) of [PropertyDefinitionList](#prod-PropertyDefinitionList).
2.  Let `propName` be the [PropName](#sec-static-semantics-propname) of [PropertyDefinition](#prod-PropertyDefinition).
3.  If `propName` is empty, return `list`.
4.  Return the [list-concatenation](#list-concatenation) of `list` and « `propName` ».

#### 13.2.5.4 Runtime Semantics: Evaluation

[ObjectLiteral](#prod-ObjectLiteral) : { }

1.  Return [OrdinaryObjectCreate](#sec-ordinaryobjectcreate)([%Object.prototype%](#sec-properties-of-the-object-prototype-object)).

[ObjectLiteral](#prod-ObjectLiteral) : { [PropertyDefinitionList](#prod-PropertyDefinitionList) } { [PropertyDefinitionList](#prod-PropertyDefinitionList) , }

1.  Let `obj` be [OrdinaryObjectCreate](#sec-ordinaryobjectcreate)([%Object.prototype%](#sec-properties-of-the-object-prototype-object)).
2.  Perform ? [PropertyDefinitionEvaluation](#sec-runtime-semantics-propertydefinitionevaluation) of [PropertyDefinitionList](#prod-PropertyDefinitionList) with argument `obj`.
3.  Return `obj`.

[LiteralPropertyName](#prod-LiteralPropertyName) : [IdentifierName](#prod-IdentifierName)

1.  Return the [StringValue](#sec-static-semantics-stringvalue) of [IdentifierName](#prod-IdentifierName).

[LiteralPropertyName](#prod-LiteralPropertyName) : [StringLiteral](#prod-StringLiteral)

1.  Return the [SV](#sec-static-semantics-sv) of [StringLiteral](#prod-StringLiteral).

[LiteralPropertyName](#prod-LiteralPropertyName) : [NumericLiteral](#prod-NumericLiteral)

1.  Let `nbr` be the [NumericValue](#sec-numericvalue) of [NumericLiteral](#prod-NumericLiteral).
2.  Return ! [ToString](#sec-tostring)(`nbr`).

[ComputedPropertyName](#prod-ComputedPropertyName) : \[ [AssignmentExpression](#prod-AssignmentExpression) \]

1.  Let `exprValue` be ? [Evaluation](#sec-evaluation) of [AssignmentExpression](#prod-AssignmentExpression).
2.  Let `propName` be ? [GetValue](#sec-getvalue)(`exprValue`).
3.  Return ? [ToPropertyKey](#sec-topropertykey)(`propName`).

#### 13.2.5.5 Runtime Semantics: PropertyDefinitionEvaluation

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) PropertyDefinitionEvaluation takes argument `object` (an Object) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or an [abrupt completion](#sec-completion-record-specification-type). It is defined piecewise over the following productions:

[PropertyDefinitionList](#prod-PropertyDefinitionList) : [PropertyDefinitionList](#prod-PropertyDefinitionList) , [PropertyDefinition](#prod-PropertyDefinition)

1.  Perform ? [PropertyDefinitionEvaluation](#sec-runtime-semantics-propertydefinitionevaluation) of [PropertyDefinitionList](#prod-PropertyDefinitionList) with argument `object`.
2.  Perform ? [PropertyDefinitionEvaluation](#sec-runtime-semantics-propertydefinitionevaluation) of [PropertyDefinition](#prod-PropertyDefinition) with argument `object`.
3.  Return unused.

[PropertyDefinition](#prod-PropertyDefinition) : ... [AssignmentExpression](#prod-AssignmentExpression)

1.  Let `exprValue` be ? [Evaluation](#sec-evaluation) of [AssignmentExpression](#prod-AssignmentExpression).
2.  Let `fromValue` be ? [GetValue](#sec-getvalue)(`exprValue`).
3.  Let `excludedNames` be a new empty [List](#sec-list-and-record-specification-type).
4.  Perform ? [CopyDataProperties](#sec-copydataproperties)(`object`, `fromValue`, `excludedNames`).
5.  Return unused.

[PropertyDefinition](#prod-PropertyDefinition) : [IdentifierReference](#prod-IdentifierReference)

1.  Let `propName` be the [StringValue](#sec-static-semantics-stringvalue) of [IdentifierReference](#prod-IdentifierReference).
2.  Let `exprValue` be ? [Evaluation](#sec-evaluation) of [IdentifierReference](#prod-IdentifierReference).
3.  Let `propValue` be ? [GetValue](#sec-getvalue)(`exprValue`).
4.  [Assert](#assert): `object` is an ordinary, extensible object with no non-configurable properties.
5.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`object`, `propName`, `propValue`).
6.  Return unused.

[PropertyDefinition](#prod-PropertyDefinition) : [PropertyName](#prod-PropertyName) : [AssignmentExpression](#prod-AssignmentExpression)

1.  Let `propKey` be ? [Evaluation](#sec-evaluation) of [PropertyName](#prod-PropertyName).
2.  If this [PropertyDefinition](#prod-PropertyDefinition) is contained within a [Script](#prod-Script) that is being evaluated for [ParseJSON](#sec-ParseJSON) (see step [6](#step-json-parse-eval) of [ParseJSON](#sec-ParseJSON)), then
    1.  Let `isProtoSetter` be false.
3.  Else if `propKey` is "\_\_proto\_\_" and [IsComputedPropertyKey](#sec-static-semantics-iscomputedpropertykey) of [PropertyName](#prod-PropertyName) is false, then
    1.  Let `isProtoSetter` be true.
4.  Else,
    1.  Let `isProtoSetter` be false.
5.  If [IsAnonymousFunctionDefinition](#sec-isanonymousfunctiondefinition)([AssignmentExpression](#prod-AssignmentExpression)) is true and `isProtoSetter` is false, then
    1.  Let `propValue` be ? [NamedEvaluation](#sec-runtime-semantics-namedevaluation) of [AssignmentExpression](#prod-AssignmentExpression) with argument `propKey`.
6.  Else,
    1.  Let `exprValueRef` be ? [Evaluation](#sec-evaluation) of [AssignmentExpression](#prod-AssignmentExpression).
    2.  Let `propValue` be ? [GetValue](#sec-getvalue)(`exprValueRef`).
7.  If `isProtoSetter` is true, then
    1.  If `propValue` [is an Object](#sec-object-type) or `propValue` is null, then
        1.  Perform ! `object`.`[[SetPrototypeOf]]`(`propValue`).
    2.  Return unused.
8.  [Assert](#assert): `object` is an ordinary, extensible object with no non-configurable properties.
9.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`object`, `propKey`, `propValue`).
10. Return unused.

[PropertyDefinition](#prod-PropertyDefinition) : [MethodDefinition](#prod-MethodDefinition)

1.  Perform ? [MethodDefinitionEvaluation](#sec-runtime-semantics-methoddefinitionevaluation) of [MethodDefinition](#prod-MethodDefinition) with arguments `object` and true.
2.  Return unused.

### 13.2.6 Function Defining Expressions

See [15.2](#sec-function-definitions) for [PrimaryExpression](#prod-PrimaryExpression) : [FunctionExpression](#prod-FunctionExpression) .

See [15.5](#sec-generator-function-definitions) for [PrimaryExpression](#prod-PrimaryExpression) : [GeneratorExpression](#prod-GeneratorExpression) .

See [15.7](#sec-class-definitions) for [PrimaryExpression](#prod-PrimaryExpression) : [ClassExpression](#prod-ClassExpression) .

See [15.8](#sec-async-function-definitions) for [PrimaryExpression](#prod-PrimaryExpression) : [AsyncFunctionExpression](#prod-AsyncFunctionExpression) .

See [15.6](#sec-async-generator-function-definitions) for [PrimaryExpression](#prod-PrimaryExpression) : [AsyncGeneratorExpression](#prod-AsyncGeneratorExpression) .

### 13.2.7 Regular Expression Literals

#### Syntax

See [12.9.5](#sec-literals-regular-expression-literals).

#### 13.2.7.1 Static Semantics: Early Errors

[PrimaryExpression](#prod-PrimaryExpression) : [RegularExpressionLiteral](#prod-RegularExpressionLiteral)

- It is a Syntax Error if [IsValidRegularExpressionLiteral](#sec-isvalidregularexpressionliteral)([RegularExpressionLiteral](#prod-RegularExpressionLiteral)) is false.

#### 13.2.7.2 Static Semantics: IsValidRegularExpressionLiteral ( `literal` )

The abstract operation IsValidRegularExpressionLiteral takes argument `literal` (a [RegularExpressionLiteral](#prod-RegularExpressionLiteral) [Parse Node](#sec-syntactic-grammar)) and returns a Boolean. It determines if its argument is a valid regular expression literal. It performs the following steps when called:

1.  Let `flags` be the [FlagText](#sec-static-semantics-flagtext) of `literal`.
2.  If `flags` contains any code points other than `d`, `g`, `i`, `m`, `s`, `u`, `v`, or `y`, or if `flags` contains any code point more than once, return false.
3.  If `flags` contains `u`, let `u` be true; else let `u` be false.
4.  If `flags` contains `v`, let `v` be true; else let `v` be false.
5.  Let `patternText` be the [BodyText](#sec-static-semantics-bodytext) of `literal`.
6.  If `u` is false and `v` is false, then
    1.  Let `stringValue` be [CodePointsToString](#sec-codepointstostring)(`patternText`).
    2.  Set `patternText` to the sequence of code points resulting from interpreting each of the 16-bit elements of `stringValue` as a Unicode BMP code point. UTF-16 decoding is not applied to the elements.
7.  Let `parseResult` be [ParsePattern](#sec-parsepattern)(`patternText`, `u`, `v`).
8.  If `parseResult` is a [Parse Node](#sec-syntactic-grammar), return true; else return false.

#### 13.2.7.3 Runtime Semantics: Evaluation

[PrimaryExpression](#prod-PrimaryExpression) : [RegularExpressionLiteral](#prod-RegularExpressionLiteral)

1.  Let `pattern` be [CodePointsToString](#sec-codepointstostring)([BodyText](#sec-static-semantics-bodytext) of [RegularExpressionLiteral](#prod-RegularExpressionLiteral)).
2.  Let `flags` be [CodePointsToString](#sec-codepointstostring)([FlagText](#sec-static-semantics-flagtext) of [RegularExpressionLiteral](#prod-RegularExpressionLiteral)).
3.  Return ! [RegExpCreate](#sec-regexpcreate)(`pattern`, `flags`).

### 13.2.8 Template Literals

#### Syntax

[TemplateLiteral](#prod-TemplateLiteral)\[Yield, Await, Tagged\] : [NoSubstitutionTemplate](#prod-NoSubstitutionTemplate) [SubstitutionTemplate](#prod-SubstitutionTemplate)\[?Yield, ?Await, ?Tagged\] [SubstitutionTemplate](#prod-SubstitutionTemplate)\[Yield, Await, Tagged\] : [TemplateHead](#prod-TemplateHead) [Expression](#prod-Expression)\[+In, ?Yield, ?Await\] [TemplateSpans](#prod-TemplateSpans)\[?Yield, ?Await, ?Tagged\] [TemplateSpans](#prod-TemplateSpans)\[Yield, Await, Tagged\] : [TemplateTail](#prod-TemplateTail) [TemplateMiddleList](#prod-TemplateMiddleList)\[?Yield, ?Await, ?Tagged\] [TemplateTail](#prod-TemplateTail) [TemplateMiddleList](#prod-TemplateMiddleList)\[Yield, Await, Tagged\] : [TemplateMiddle](#prod-TemplateMiddle) [Expression](#prod-Expression)\[+In, ?Yield, ?Await\] [TemplateMiddleList](#prod-TemplateMiddleList)\[?Yield, ?Await, ?Tagged\] [TemplateMiddle](#prod-TemplateMiddle) [Expression](#prod-Expression)\[+In, ?Yield, ?Await\]

#### 13.2.8.1 Static Semantics: Early Errors

[TemplateLiteral](#prod-TemplateLiteral)\[Yield, Await, Tagged\] : [NoSubstitutionTemplate](#prod-NoSubstitutionTemplate)

- It is a Syntax Error if the _(\[Tagged\]) parameter was not set and [NoSubstitutionTemplate](#prod-NoSubstitutionTemplate) [Contains](#sec-static-semantics-contains) [NotEscapeSequence](#prod-NotEscapeSequence).

[TemplateLiteral](#prod-TemplateLiteral)\[Yield, Await, Tagged\] : [SubstitutionTemplate](#prod-SubstitutionTemplate)\[?Yield, ?Await, ?Tagged\]

- It is a Syntax Error if the number of elements in the [TemplateStrings](#sec-static-semantics-templatestrings) of [TemplateLiteral](#prod-TemplateLiteral) with argument false is greater than or equal to 2\*\*³².

[SubstitutionTemplate](#prod-SubstitutionTemplate)\[Yield, Await, Tagged\] : [TemplateHead](#prod-TemplateHead) [Expression](#prod-Expression)\[+In, ?Yield, ?Await\] [TemplateSpans](#prod-TemplateSpans)\[?Yield, ?Await, ?Tagged\]

- It is a Syntax Error if the _(\[Tagged\]) parameter was not set and [TemplateHead](#prod-TemplateHead) [Contains](#sec-static-semantics-contains) [NotEscapeSequence](#prod-NotEscapeSequence).

[TemplateSpans](#prod-TemplateSpans)\[Yield, Await, Tagged\] : [TemplateTail](#prod-TemplateTail)

- It is a Syntax Error if the _(\[Tagged\]) parameter was not set and [TemplateTail](#prod-TemplateTail) [Contains](#sec-static-semantics-contains) [NotEscapeSequence](#prod-NotEscapeSequence).

[TemplateMiddleList](#prod-TemplateMiddleList)\[Yield, Await, Tagged\] : [TemplateMiddle](#prod-TemplateMiddle) [Expression](#prod-Expression)\[+In, ?Yield, ?Await\] [TemplateMiddleList](#prod-TemplateMiddleList)\[?Yield, ?Await, ?Tagged\] [TemplateMiddle](#prod-TemplateMiddle) [Expression](#prod-Expression)\[+In, ?Yield, ?Await\]

- It is a Syntax Error if the _(\[Tagged\]) parameter was not set and [TemplateMiddle](#prod-TemplateMiddle) [Contains](#sec-static-semantics-contains) [NotEscapeSequence](#prod-NotEscapeSequence).

#### 13.2.8.2 Static Semantics: TemplateStrings

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) TemplateStrings takes argument `raw` (a Boolean) and returns a [List](#sec-list-and-record-specification-type) of either Strings or undefined. It is defined piecewise over the following productions:

[TemplateLiteral](#prod-TemplateLiteral) : [NoSubstitutionTemplate](#prod-NoSubstitutionTemplate)

1.  Return « [TemplateString](#sec-templatestring)([NoSubstitutionTemplate](#prod-NoSubstitutionTemplate), `raw`) ».

[SubstitutionTemplate](#prod-SubstitutionTemplate) : [TemplateHead](#prod-TemplateHead) [Expression](#prod-Expression) [TemplateSpans](#prod-TemplateSpans)

1.  Let `head` be « [TemplateString](#sec-templatestring)([TemplateHead](#prod-TemplateHead), `raw`) ».
2.  Let `tail` be the [TemplateStrings](#sec-static-semantics-templatestrings) of [TemplateSpans](#prod-TemplateSpans) with argument `raw`.
3.  Return the [list-concatenation](#list-concatenation) of `head` and `tail`.

[TemplateSpans](#prod-TemplateSpans) : [TemplateTail](#prod-TemplateTail)

1.  Return « [TemplateString](#sec-templatestring)([TemplateTail](#prod-TemplateTail), `raw`) ».

[TemplateSpans](#prod-TemplateSpans) : [TemplateMiddleList](#prod-TemplateMiddleList) [TemplateTail](#prod-TemplateTail)

1.  Let `middle` be the [TemplateStrings](#sec-static-semantics-templatestrings) of [TemplateMiddleList](#prod-TemplateMiddleList) with argument `raw`.
2.  Let `tail` be « [TemplateString](#sec-templatestring)([TemplateTail](#prod-TemplateTail), `raw`) ».
3.  Return the [list-concatenation](#list-concatenation) of `middle` and `tail`.

[TemplateMiddleList](#prod-TemplateMiddleList) : [TemplateMiddle](#prod-TemplateMiddle) [Expression](#prod-Expression)

1.  Return « [TemplateString](#sec-templatestring)([TemplateMiddle](#prod-TemplateMiddle), `raw`) ».

[TemplateMiddleList](#prod-TemplateMiddleList) : [TemplateMiddleList](#prod-TemplateMiddleList) [TemplateMiddle](#prod-TemplateMiddle) [Expression](#prod-Expression)

1.  Let `front` be the [TemplateStrings](#sec-static-semantics-templatestrings) of [TemplateMiddleList](#prod-TemplateMiddleList) with argument `raw`.
2.  Let `last` be « [TemplateString](#sec-templatestring)([TemplateMiddle](#prod-TemplateMiddle), `raw`) ».
3.  Return the [list-concatenation](#list-concatenation) of `front` and `last`.

#### 13.2.8.3 Static Semantics: TemplateString ( `templateToken`, `raw` )

The abstract operation TemplateString takes arguments `templateToken` (a [NoSubstitutionTemplate](#prod-NoSubstitutionTemplate) [Parse Node](#sec-syntactic-grammar), a [TemplateHead](#prod-TemplateHead) [Parse Node](#sec-syntactic-grammar), a [TemplateMiddle](#prod-TemplateMiddle) [Parse Node](#sec-syntactic-grammar), or a [TemplateTail](#prod-TemplateTail) [Parse Node](#sec-syntactic-grammar)) and `raw` (a Boolean) and returns a String or undefined. It performs the following steps when called:

1.  If `raw` is true, then
    1.  Let `string` be the [TRV](#sec-static-semantics-trv) of `templateToken`.
2.  Else,
    1.  Let `string` be the [TV](#sec-static-semantics-tv) of `templateToken`.
3.  Return `string`.

Note

This operation returns undefined if `raw` is false and `templateToken` contains a [NotEscapeSequence](#prod-NotEscapeSequence). In all other cases, it returns a String.

#### 13.2.8.4 GetTemplateObject ( `templateLiteral` )

The abstract operation GetTemplateObject takes argument `templateLiteral` (a [Parse Node](#sec-syntactic-grammar)) and returns an Array. It performs the following steps when called:

1.  Let `realm` be [the current Realm Record](#current-realm).
2.  Let `templateRegistry` be `realm`.`[[TemplateMap]]`.
3.  For each element `e` of `templateRegistry`, do
    1.  If `e`.`[[Site]]` is [the same Parse Node](#sec-syntactic-grammar) as `templateLiteral`, then
        1.  Return `e`.`[[Array]]`.
4.  Let `rawStrings` be the [TemplateStrings](#sec-static-semantics-templatestrings) of `templateLiteral` with argument true.
5.  [Assert](#assert): `rawStrings` is a [List](#sec-list-and-record-specification-type) of Strings.
6.  Let `cookedStrings` be the [TemplateStrings](#sec-static-semantics-templatestrings) of `templateLiteral` with argument false.
7.  Let `count` be the number of elements in the [List](#sec-list-and-record-specification-type) `cookedStrings`.
8.  [Assert](#assert): `count` ≤ 2\*\*³² - 1.
9.  Let `template` be ! [ArrayCreate](#sec-arraycreate)(`count`).
10. Let `rawObj` be ! [ArrayCreate](#sec-arraycreate)(`count`).
11. Let `index` be 0.
12. Repeat, while `index` \< `count`,
    1.  Let `prop` be ! [ToString](#sec-tostring)([𝔽](#𝔽)(`index`)).
    2.  Let `cookedValue` be `cookedStrings`\[`index`\].
    3.  Perform ! [DefinePropertyOrThrow](#sec-definepropertyorthrow)(`template`, `prop`, PropertyDescriptor { `[[Value]]`: `cookedValue`, `[[Writable]]`: false, `[[Enumerable]]`: true, `[[Configurable]]`: false }).
    4.  Let `rawValue` be the String value `rawStrings`\[`index`\].
    5.  Perform ! [DefinePropertyOrThrow](#sec-definepropertyorthrow)(`rawObj`, `prop`, PropertyDescriptor { `[[Value]]`: `rawValue`, `[[Writable]]`: false, `[[Enumerable]]`: true, `[[Configurable]]`: false }).
    6.  Set `index` to `index` + 1.
13. Perform ! [SetIntegrityLevel](#sec-setintegritylevel)(`rawObj`, frozen).
14. Perform ! [DefinePropertyOrThrow](#sec-definepropertyorthrow)(`template`, "raw", PropertyDescriptor { `[[Value]]`: `rawObj`, `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }).
15. Perform ! [SetIntegrityLevel](#sec-setintegritylevel)(`template`, frozen).
16. Append the [Record](#sec-list-and-record-specification-type) { `[[Site]]`: `templateLiteral`, `[[Array]]`: `template` } to `realm`.`[[TemplateMap]]`.
17. Return `template`.

Note 1

The creation of a template object cannot result in an [abrupt completion](#sec-completion-record-specification-type).

Note 2

Each [TemplateLiteral](#prod-TemplateLiteral) in the program code of a [realm](#realm) is associated with a unique template object that is used in the evaluation of tagged Templates ([13.2.8.6](#sec-template-literals-runtime-semantics-evaluation)). The template objects are frozen and the same template object is used each time a specific tagged Template is evaluated. Whether template objects are created lazily upon first evaluation of the [TemplateLiteral](#prod-TemplateLiteral) or eagerly prior to first evaluation is an implementation choice that is not observable to ECMAScript code.

Note 3

Future editions of this specification may define additional non-enumerable properties of template objects.

#### 13.2.8.5 Runtime Semantics: SubstitutionEvaluation

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) SubstitutionEvaluation takes no arguments and returns either a [normal completion containing](#sec-completion-record-specification-type) a [List](#sec-list-and-record-specification-type) of [ECMAScript language values](#sec-ecmascript-language-types) or an [abrupt completion](#sec-completion-record-specification-type). It is defined piecewise over the following productions:

[TemplateSpans](#prod-TemplateSpans) : [TemplateTail](#prod-TemplateTail)

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[TemplateSpans](#prod-TemplateSpans) : [TemplateMiddleList](#prod-TemplateMiddleList) [TemplateTail](#prod-TemplateTail)

1.  Return ? [SubstitutionEvaluation](#sec-runtime-semantics-substitutionevaluation) of [TemplateMiddleList](#prod-TemplateMiddleList).

[TemplateMiddleList](#prod-TemplateMiddleList) : [TemplateMiddle](#prod-TemplateMiddle) [Expression](#prod-Expression)

1.  Let `subRef` be ? [Evaluation](#sec-evaluation) of [Expression](#prod-Expression).
2.  Let `sub` be ? [GetValue](#sec-getvalue)(`subRef`).
3.  Return « `sub` ».

[TemplateMiddleList](#prod-TemplateMiddleList) : [TemplateMiddleList](#prod-TemplateMiddleList) [TemplateMiddle](#prod-TemplateMiddle) [Expression](#prod-Expression)

1.  Let `preceding` be ? [SubstitutionEvaluation](#sec-runtime-semantics-substitutionevaluation) of [TemplateMiddleList](#prod-TemplateMiddleList).
2.  Let `nextRef` be ? [Evaluation](#sec-evaluation) of [Expression](#prod-Expression).
3.  Let `next` be ? [GetValue](#sec-getvalue)(`nextRef`).
4.  Return the [list-concatenation](#list-concatenation) of `preceding` and « `next` ».

#### 13.2.8.6 Runtime Semantics: Evaluation

[TemplateLiteral](#prod-TemplateLiteral) : [NoSubstitutionTemplate](#prod-NoSubstitutionTemplate)

1.  Return the [TV](#sec-static-semantics-tv) of [NoSubstitutionTemplate](#prod-NoSubstitutionTemplate) as defined in [12.9.6](#sec-template-literal-lexical-components).

[SubstitutionTemplate](#prod-SubstitutionTemplate) : [TemplateHead](#prod-TemplateHead) [Expression](#prod-Expression) [TemplateSpans](#prod-TemplateSpans)

1.  Let `head` be the [TV](#sec-static-semantics-tv) of [TemplateHead](#prod-TemplateHead) as defined in [12.9.6](#sec-template-literal-lexical-components).
2.  Let `subRef` be ? [Evaluation](#sec-evaluation) of [Expression](#prod-Expression).
3.  Let `sub` be ? [GetValue](#sec-getvalue)(`subRef`).
4.  Let `middle` be ? [ToString](#sec-tostring)(`sub`).
5.  Let `tail` be ? [Evaluation](#sec-evaluation) of [TemplateSpans](#prod-TemplateSpans).
6.  Return the [string-concatenation](#string-concatenation) of `head`, `middle`, and `tail`.

Note 1

The string conversion semantics applied to the [Expression](#prod-Expression) value are like `String.prototype.concat` rather than the `+` operator.

[TemplateSpans](#prod-TemplateSpans) : [TemplateTail](#prod-TemplateTail)

1.  Return the [TV](#sec-static-semantics-tv) of [TemplateTail](#prod-TemplateTail) as defined in [12.9.6](#sec-template-literal-lexical-components).

[TemplateSpans](#prod-TemplateSpans) : [TemplateMiddleList](#prod-TemplateMiddleList) [TemplateTail](#prod-TemplateTail)

1.  Let `head` be ? [Evaluation](#sec-evaluation) of [TemplateMiddleList](#prod-TemplateMiddleList).
2.  Let `tail` be the [TV](#sec-static-semantics-tv) of [TemplateTail](#prod-TemplateTail) as defined in [12.9.6](#sec-template-literal-lexical-components).
3.  Return the [string-concatenation](#string-concatenation) of `head` and `tail`.

[TemplateMiddleList](#prod-TemplateMiddleList) : [TemplateMiddle](#prod-TemplateMiddle) [Expression](#prod-Expression)

1.  Let `head` be the [TV](#sec-static-semantics-tv) of [TemplateMiddle](#prod-TemplateMiddle) as defined in [12.9.6](#sec-template-literal-lexical-components).
2.  Let `subRef` be ? [Evaluation](#sec-evaluation) of [Expression](#prod-Expression).
3.  Let `sub` be ? [GetValue](#sec-getvalue)(`subRef`).
4.  Let `middle` be ? [ToString](#sec-tostring)(`sub`).
5.  Return the [string-concatenation](#string-concatenation) of `head` and `middle`.

Note 2

The string conversion semantics applied to the [Expression](#prod-Expression) value are like `String.prototype.concat` rather than the `+` operator.

[TemplateMiddleList](#prod-TemplateMiddleList) : [TemplateMiddleList](#prod-TemplateMiddleList) [TemplateMiddle](#prod-TemplateMiddle) [Expression](#prod-Expression)

1.  Let `rest` be ? [Evaluation](#sec-evaluation) of [TemplateMiddleList](#prod-TemplateMiddleList).
2.  Let `middle` be the [TV](#sec-static-semantics-tv) of [TemplateMiddle](#prod-TemplateMiddle) as defined in [12.9.6](#sec-template-literal-lexical-components).
3.  Let `subRef` be ? [Evaluation](#sec-evaluation) of [Expression](#prod-Expression).
4.  Let `sub` be ? [GetValue](#sec-getvalue)(`subRef`).
5.  Let `last` be ? [ToString](#sec-tostring)(`sub`).
6.  Return the [string-concatenation](#string-concatenation) of `rest`, `middle`, and `last`.

Note 3

The string conversion semantics applied to the [Expression](#prod-Expression) value are like `String.prototype.concat` rather than the `+` operator.

### 13.2.9 The Grouping Operator

#### 13.2.9.1 Static Semantics: Early Errors

[PrimaryExpression](#prod-PrimaryExpression) : [CoverParenthesizedExpressionAndArrowParameterList](#prod-CoverParenthesizedExpressionAndArrowParameterList)

- [CoverParenthesizedExpressionAndArrowParameterList](#prod-CoverParenthesizedExpressionAndArrowParameterList) [must cover](#must-cover) a [ParenthesizedExpression](#prod-ParenthesizedExpression).

#### 13.2.9.2 Runtime Semantics: Evaluation

[PrimaryExpression](#prod-PrimaryExpression) : [CoverParenthesizedExpressionAndArrowParameterList](#prod-CoverParenthesizedExpressionAndArrowParameterList)

1.  Let `expr` be the [ParenthesizedExpression](#prod-ParenthesizedExpression) that is [covered](#sec-syntactic-grammar) by [CoverParenthesizedExpressionAndArrowParameterList](#prod-CoverParenthesizedExpressionAndArrowParameterList).
2.  Return ? [Evaluation](#sec-evaluation) of `expr`.

[ParenthesizedExpression](#prod-ParenthesizedExpression) : ( [Expression](#prod-Expression) )

1.  Return ? [Evaluation](#sec-evaluation) of [Expression](#prod-Expression). This may be of type Reference.

Note

This algorithm does not apply [GetValue](#sec-getvalue) to [Evaluation](#sec-evaluation) of [Expression](#prod-Expression). The principal motivation for this is so that operators such as `delete` and `typeof` may be applied to parenthesized expressions.

## 13.3 Left-Hand-Side Expressions

### Syntax

[MemberExpression](#prod-MemberExpression)\[Yield, Await\] : [PrimaryExpression](#prod-PrimaryExpression)\[?Yield, ?Await\] [MemberExpression](#prod-MemberExpression)\[?Yield, ?Await\] \[ [Expression](#prod-Expression)\[+In, ?Yield, ?Await\] \] [MemberExpression](#prod-MemberExpression)\[?Yield, ?Await\] . [IdentifierName](#prod-IdentifierName) [MemberExpression](#prod-MemberExpression)\[?Yield, ?Await\] [TemplateLiteral](#prod-TemplateLiteral)\[?Yield, ?Await, +Tagged\] [SuperProperty](#prod-SuperProperty)\[?Yield, ?Await\] [MetaProperty](#prod-MetaProperty) new [MemberExpression](#prod-MemberExpression)\[?Yield, ?Await\] [Arguments](#prod-Arguments)\[?Yield, ?Await\] [MemberExpression](#prod-MemberExpression)\[?Yield, ?Await\] . [PrivateIdentifier](#prod-PrivateIdentifier) [SuperProperty](#prod-SuperProperty)\[Yield, Await\] : super \[ [Expression](#prod-Expression)\[+In, ?Yield, ?Await\] \] super . [IdentifierName](#prod-IdentifierName) [MetaProperty](#prod-MetaProperty) : [NewTarget](#prod-NewTarget) [ImportMeta](#prod-ImportMeta) [NewTarget](#prod-NewTarget) : new . target [ImportMeta](#prod-ImportMeta) : import . meta [NewExpression](#prod-NewExpression)\[Yield, Await\] : [MemberExpression](#prod-MemberExpression)\[?Yield, ?Await\] new [NewExpression](#prod-NewExpression)\[?Yield, ?Await\] [CallExpression](#prod-CallExpression)\[Yield, Await\] : [CoverCallExpressionAndAsyncArrowHead](#prod-CoverCallExpressionAndAsyncArrowHead)\[?Yield, ?Await\] [SuperCall](#prod-SuperCall)\[?Yield, ?Await\] [ImportCall](#prod-ImportCall)\[?Yield, ?Await\] [CallExpression](#prod-CallExpression)\[?Yield, ?Await\] [Arguments](#prod-Arguments)\[?Yield, ?Await\] [CallExpression](#prod-CallExpression)\[?Yield, ?Await\] \[ [Expression](#prod-Expression)\[+In, ?Yield, ?Await\] \] [CallExpression](#prod-CallExpression)\[?Yield, ?Await\] . [IdentifierName](#prod-IdentifierName) [CallExpression](#prod-CallExpression)\[?Yield, ?Await\] [TemplateLiteral](#prod-TemplateLiteral)\[?Yield, ?Await, +Tagged\] [CallExpression](#prod-CallExpression)\[?Yield, ?Await\] . [PrivateIdentifier](#prod-PrivateIdentifier) [SuperCall](#prod-SuperCall)\[Yield, Await\] : super [Arguments](#prod-Arguments)\[?Yield, ?Await\] [ImportCall](#prod-ImportCall)\[Yield, Await\] : import ( [AssignmentExpression](#prod-AssignmentExpression)\[+In, ?Yield, ?Await\] ,opt ) import ( [AssignmentExpression](#prod-AssignmentExpression)\[+In, ?Yield, ?Await\] , [AssignmentExpression](#prod-AssignmentExpression)\[+In, ?Yield, ?Await\] ,opt ) [Arguments](#prod-Arguments)\[Yield, Await\] : ( ) ( [ArgumentList](#prod-ArgumentList)\[?Yield, ?Await\] ) ( [ArgumentList](#prod-ArgumentList)\[?Yield, ?Await\] , ) [ArgumentList](#prod-ArgumentList)\[Yield, Await\] : [AssignmentExpression](#prod-AssignmentExpression)\[+In, ?Yield, ?Await\] ... [AssignmentExpression](#prod-AssignmentExpression)\[+In, ?Yield, ?Await\] [ArgumentList](#prod-ArgumentList)\[?Yield, ?Await\] , [AssignmentExpression](#prod-AssignmentExpression)\[+In, ?Yield, ?Await\] [ArgumentList](#prod-ArgumentList)\[?Yield, ?Await\] , ... [AssignmentExpression](#prod-AssignmentExpression)\[+In, ?Yield, ?Await\] [OptionalExpression](#prod-OptionalExpression)\[Yield, Await\] : [MemberExpression](#prod-MemberExpression)\[?Yield, ?Await\] [OptionalChain](#prod-OptionalChain)\[?Yield, ?Await\] [CallExpression](#prod-CallExpression)\[?Yield, ?Await\] [OptionalChain](#prod-OptionalChain)\[?Yield, ?Await\] [OptionalExpression](#prod-OptionalExpression)\[?Yield, ?Await\] [OptionalChain](#prod-OptionalChain)\[?Yield, ?Await\] [OptionalChain](#prod-OptionalChain)\[Yield, Await\] : ?. [Arguments](#prod-Arguments)\[?Yield, ?Await\] ?. \[ [Expression](#prod-Expression)\[+In, ?Yield, ?Await\] \] ?. [IdentifierName](#prod-IdentifierName) ?. [TemplateLiteral](#prod-TemplateLiteral)\[?Yield, ?Await, +Tagged\] ?. [PrivateIdentifier](#prod-PrivateIdentifier) [OptionalChain](#prod-OptionalChain)\[?Yield, ?Await\] [Arguments](#prod-Arguments)\[?Yield, ?Await\] [OptionalChain](#prod-OptionalChain)\[?Yield, ?Await\] \[ [Expression](#prod-Expression)\[+In, ?Yield, ?Await\] \] [OptionalChain](#prod-OptionalChain)\[?Yield, ?Await\] . [IdentifierName](#prod-IdentifierName) [OptionalChain](#prod-OptionalChain)\[?Yield, ?Await\] [TemplateLiteral](#prod-TemplateLiteral)\[?Yield, ?Await, +Tagged\] [OptionalChain](#prod-OptionalChain)\[?Yield, ?Await\] . [PrivateIdentifier](#prod-PrivateIdentifier) [LeftHandSideExpression](#prod-LeftHandSideExpression)\[Yield, Await\] : [NewExpression](#prod-NewExpression)\[?Yield, ?Await\] [CallExpression](#prod-CallExpression)\[?Yield, ?Await\] [OptionalExpression](#prod-OptionalExpression)\[?Yield, ?Await\]

### Supplemental Syntax

When processing an instance of the production  
[CallExpression](#prod-CallExpression) : [CoverCallExpressionAndAsyncArrowHead](#prod-CoverCallExpressionAndAsyncArrowHead)  
the interpretation of [CoverCallExpressionAndAsyncArrowHead](#prod-CoverCallExpressionAndAsyncArrowHead) is refined using the following grammar:

[CallMemberExpression](#prod-CallMemberExpression)\[Yield, Await\] : [MemberExpression](#prod-MemberExpression)\[?Yield, ?Await\] [Arguments](#prod-Arguments)\[?Yield, ?Await\]

### 13.3.1 Static Semantics

#### 13.3.1.1 Static Semantics: Early Errors

[OptionalChain](#prod-OptionalChain) : ?. [TemplateLiteral](#prod-TemplateLiteral) [OptionalChain](#prod-OptionalChain) [TemplateLiteral](#prod-TemplateLiteral)

- It is a Syntax Error if any source text is matched by this production.

Note

This production exists in order to prevent automatic semicolon insertion rules ([12.10](#sec-automatic-semicolon-insertion)) from being applied to the following code:

``` javascript
a?.b
`c`
```

so that it would be interpreted as two valid statements. The purpose is to maintain consistency with similar code without optional chaining:

``` javascript
a.b
`c`
```

which is a valid statement and where automatic semicolon insertion does not apply.

[ImportMeta](#prod-ImportMeta) : import . meta

- It is a Syntax Error if the syntactic [goal symbol](#sec-context-free-grammars) is not [Module](#prod-Module).

### 13.3.2 Property Accessors

Note

Properties are accessed by name, using either the dot notation:

[MemberExpression](#prod-MemberExpression) `.` [IdentifierName](#prod-IdentifierName)  
[CallExpression](#prod-CallExpression) `.` [IdentifierName](#prod-IdentifierName)

or the bracket notation:

[MemberExpression](#prod-MemberExpression) `[` [Expression](#prod-Expression) `]`  
[CallExpression](#prod-CallExpression) `[` [Expression](#prod-Expression) `]`

The dot notation is explained by the following syntactic conversion:

[MemberExpression](#prod-MemberExpression) `.` [IdentifierName](#prod-IdentifierName)

is identical in its behaviour to

[MemberExpression](#prod-MemberExpression) `[` \<*identifier-name-string*\> `]`

and similarly

[CallExpression](#prod-CallExpression) `.` [IdentifierName](#prod-IdentifierName)

is identical in its behaviour to

[CallExpression](#prod-CallExpression) `[` \<*identifier-name-string*\> `]`

where \<*identifier-name-string*\> is the [StringValue](#sec-static-semantics-stringvalue) of [IdentifierName](#prod-IdentifierName).

#### 13.3.2.1 Runtime Semantics: Evaluation

[MemberExpression](#prod-MemberExpression) : [MemberExpression](#prod-MemberExpression) \[ [Expression](#prod-Expression) \]

1.  Let `baseReference` be ? [Evaluation](#sec-evaluation) of [MemberExpression](#prod-MemberExpression).
2.  Let `baseValue` be ? [GetValue](#sec-getvalue)(`baseReference`).
3.  Let `strict` be [IsStrict](#sec-isstrict)(this [MemberExpression](#prod-MemberExpression)).
4.  Return ? [EvaluatePropertyAccessWithExpressionKey](#sec-evaluate-property-access-with-expression-key)(`baseValue`, [Expression](#prod-Expression), `strict`).

[MemberExpression](#prod-MemberExpression) : [MemberExpression](#prod-MemberExpression) . [IdentifierName](#prod-IdentifierName)

1.  Let `baseReference` be ? [Evaluation](#sec-evaluation) of [MemberExpression](#prod-MemberExpression).
2.  Let `baseValue` be ? [GetValue](#sec-getvalue)(`baseReference`).
3.  Let `strict` be [IsStrict](#sec-isstrict)(this [MemberExpression](#prod-MemberExpression)).
4.  Return [EvaluatePropertyAccessWithIdentifierKey](#sec-evaluate-property-access-with-identifier-key)(`baseValue`, [IdentifierName](#prod-IdentifierName), `strict`).

[MemberExpression](#prod-MemberExpression) : [MemberExpression](#prod-MemberExpression) . [PrivateIdentifier](#prod-PrivateIdentifier)

1.  Let `baseReference` be ? [Evaluation](#sec-evaluation) of [MemberExpression](#prod-MemberExpression).
2.  Let `baseValue` be ? [GetValue](#sec-getvalue)(`baseReference`).
3.  Let `fieldNameString` be the [StringValue](#sec-static-semantics-stringvalue) of [PrivateIdentifier](#prod-PrivateIdentifier).
4.  Return [MakePrivateReference](#sec-makeprivatereference)(`baseValue`, `fieldNameString`).

[CallExpression](#prod-CallExpression) : [CallExpression](#prod-CallExpression) \[ [Expression](#prod-Expression) \]

1.  Let `baseReference` be ? [Evaluation](#sec-evaluation) of [CallExpression](#prod-CallExpression).
2.  Let `baseValue` be ? [GetValue](#sec-getvalue)(`baseReference`).
3.  Let `strict` be [IsStrict](#sec-isstrict)(this [CallExpression](#prod-CallExpression)).
4.  Return ? [EvaluatePropertyAccessWithExpressionKey](#sec-evaluate-property-access-with-expression-key)(`baseValue`, [Expression](#prod-Expression), `strict`).

[CallExpression](#prod-CallExpression) : [CallExpression](#prod-CallExpression) . [IdentifierName](#prod-IdentifierName)

1.  Let `baseReference` be ? [Evaluation](#sec-evaluation) of [CallExpression](#prod-CallExpression).
2.  Let `baseValue` be ? [GetValue](#sec-getvalue)(`baseReference`).
3.  Let `strict` be [IsStrict](#sec-isstrict)(this [CallExpression](#prod-CallExpression)).
4.  Return [EvaluatePropertyAccessWithIdentifierKey](#sec-evaluate-property-access-with-identifier-key)(`baseValue`, [IdentifierName](#prod-IdentifierName), `strict`).

[CallExpression](#prod-CallExpression) : [CallExpression](#prod-CallExpression) . [PrivateIdentifier](#prod-PrivateIdentifier)

1.  Let `baseReference` be ? [Evaluation](#sec-evaluation) of [CallExpression](#prod-CallExpression).
2.  Let `baseValue` be ? [GetValue](#sec-getvalue)(`baseReference`).
3.  Let `fieldNameString` be the [StringValue](#sec-static-semantics-stringvalue) of [PrivateIdentifier](#prod-PrivateIdentifier).
4.  Return [MakePrivateReference](#sec-makeprivatereference)(`baseValue`, `fieldNameString`).

### 13.3.3 EvaluatePropertyAccessWithExpressionKey ( `baseValue`, `expression`, `strict` )

The abstract operation EvaluatePropertyAccessWithExpressionKey takes arguments `baseValue` (an [ECMAScript language value](#sec-ecmascript-language-types)), `expression` (an [Expression](#prod-Expression) [Parse Node](#sec-syntactic-grammar)), and `strict` (a Boolean) and returns either a [normal completion containing](#sec-completion-record-specification-type) a [Reference Record](#sec-reference-record-specification-type) or an [abrupt completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `propertyNameReference` be ? [Evaluation](#sec-evaluation) of `expression`.
2.  Let `propertyNameValue` be ? [GetValue](#sec-getvalue)(`propertyNameReference`).
3.  NOTE: In most cases, [ToPropertyKey](#sec-topropertykey) will be performed on `propertyNameValue` immediately after this step. However, in the case of `a[b] = c`, it will not be performed until after evaluation of `c`.
4.  Return the [Reference Record](#sec-reference-record-specification-type) { `[[Base]]`: `baseValue`, `[[ReferencedName]]`: `propertyNameValue`, `[[Strict]]`: `strict`, `[[ThisValue]]`: empty }.

### 13.3.4 EvaluatePropertyAccessWithIdentifierKey ( `baseValue`, `identifierName`, `strict` )

The abstract operation EvaluatePropertyAccessWithIdentifierKey takes arguments `baseValue` (an [ECMAScript language value](#sec-ecmascript-language-types)), `identifierName` (an [IdentifierName](#prod-IdentifierName) [Parse Node](#sec-syntactic-grammar)), and `strict` (a Boolean) and returns a [Reference Record](#sec-reference-record-specification-type). It performs the following steps when called:

1.  Let `propertyNameString` be the [StringValue](#sec-static-semantics-stringvalue) of `identifierName`.
2.  Return the [Reference Record](#sec-reference-record-specification-type) { `[[Base]]`: `baseValue`, `[[ReferencedName]]`: `propertyNameString`, `[[Strict]]`: `strict`, `[[ThisValue]]`: empty }.

### 13.3.5 The `new` Operator

#### 13.3.5.1 Runtime Semantics: Evaluation

[NewExpression](#prod-NewExpression) : new [NewExpression](#prod-NewExpression)

1.  Return ? [EvaluateNew](#sec-evaluatenew)([NewExpression](#prod-NewExpression), empty).

[MemberExpression](#prod-MemberExpression) : new [MemberExpression](#prod-MemberExpression) [Arguments](#prod-Arguments)

1.  Return ? [EvaluateNew](#sec-evaluatenew)([MemberExpression](#prod-MemberExpression), [Arguments](#prod-Arguments)).

##### 13.3.5.1.1 EvaluateNew ( `constructExpr`, `arguments` )

The abstract operation EvaluateNew takes arguments `constructExpr` (a [NewExpression](#prod-NewExpression) [Parse Node](#sec-syntactic-grammar) or a [MemberExpression](#prod-MemberExpression) [Parse Node](#sec-syntactic-grammar)) and `arguments` (empty or an [Arguments](#prod-Arguments) [Parse Node](#sec-syntactic-grammar)) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [ECMAScript language value](#sec-ecmascript-language-types) or an [abrupt completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `ref` be ? [Evaluation](#sec-evaluation) of `constructExpr`.
2.  Let `constructor` be ? [GetValue](#sec-getvalue)(`ref`).
3.  If `arguments` is empty, then
    1.  Let `argList` be a new empty [List](#sec-list-and-record-specification-type).
4.  Else,
    1.  Let `argList` be ? [ArgumentListEvaluation](#sec-runtime-semantics-argumentlistevaluation) of `arguments`.
5.  If [IsConstructor](#sec-isconstructor)(`constructor`) is false, throw a TypeError exception.
6.  Return ? [Construct](#sec-construct)(`constructor`, `argList`).

### 13.3.6 Function Calls

#### 13.3.6.1 Runtime Semantics: Evaluation

[CallExpression](#prod-CallExpression) : [CoverCallExpressionAndAsyncArrowHead](#prod-CoverCallExpressionAndAsyncArrowHead)

1.  Let `expr` be the [CallMemberExpression](#prod-CallMemberExpression) that is [covered](#sec-syntactic-grammar) by [CoverCallExpressionAndAsyncArrowHead](#prod-CoverCallExpressionAndAsyncArrowHead).
2.  Let `memberExpr` be the [MemberExpression](#prod-MemberExpression) of `expr`.
3.  Let `arguments` be the [Arguments](#prod-Arguments) of `expr`.
4.  Let `ref` be ? [Evaluation](#sec-evaluation) of `memberExpr`.
5.  Let `func` be ? [GetValue](#sec-getvalue)(`ref`).
6.  If `ref` is a [Reference Record](#sec-reference-record-specification-type), [IsPropertyReference](#sec-ispropertyreference)(`ref`) is false, and `ref`.`[[ReferencedName]]` is "eval", then
    1.  If [SameValue](#sec-samevalue)(`func`, [%eval%](#sec-eval-x)) is true, then
        1.  Let `argList` be ? [ArgumentListEvaluation](#sec-runtime-semantics-argumentlistevaluation) of `arguments`.
        2.  If `argList` has no elements, return undefined.
        3.  Let `evalArg` be the first element of `argList`.
        4.  If [IsStrict](#sec-isstrict)(this [CallExpression](#prod-CallExpression)) is true, let `strictCaller` be true. Otherwise let `strictCaller` be false.
        5.  Return ? [PerformEval](#sec-performeval)(`evalArg`, `strictCaller`, true).
7.  Let `thisCall` be this [CallExpression](#prod-CallExpression).
8.  Let `tailCall` be [IsInTailPosition](#sec-isintailposition)(`thisCall`).
9.  Return ? [EvaluateCall](#sec-evaluatecall)(`func`, `ref`, `arguments`, `tailCall`).

A [CallExpression](#prod-CallExpression) evaluation that executes step [6.a.v](#step-callexpression-evaluation-direct-eval) is a direct eval.

[CallExpression](#prod-CallExpression) : [CallExpression](#prod-CallExpression) [Arguments](#prod-Arguments)

1.  Let `ref` be ? [Evaluation](#sec-evaluation) of [CallExpression](#prod-CallExpression).
2.  Let `func` be ? [GetValue](#sec-getvalue)(`ref`).
3.  Let `thisCall` be this [CallExpression](#prod-CallExpression).
4.  Let `tailCall` be [IsInTailPosition](#sec-isintailposition)(`thisCall`).
5.  Return ? [EvaluateCall](#sec-evaluatecall)(`func`, `ref`, [Arguments](#prod-Arguments), `tailCall`).

#### 13.3.6.2 EvaluateCall ( `func`, `ref`, `arguments`, `tailPosition` )

The abstract operation EvaluateCall takes arguments `func` (an [ECMAScript language value](#sec-ecmascript-language-types)), `ref` (an [ECMAScript language value](#sec-ecmascript-language-types) or a [Reference Record](#sec-reference-record-specification-type)), `arguments` (a [Parse Node](#sec-syntactic-grammar)), and `tailPosition` (a Boolean) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [ECMAScript language value](#sec-ecmascript-language-types) or an [abrupt completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  If `ref` is a [Reference Record](#sec-reference-record-specification-type), then
    1.  If [IsPropertyReference](#sec-ispropertyreference)(`ref`) is true, then
        1.  Let `thisValue` be [GetThisValue](#sec-getthisvalue)(`ref`).
    2.  Else,
        1.  Let `refEnv` be `ref`.`[[Base]]`.
        2.  [Assert](#assert): `refEnv` is an [Environment Record](#sec-environment-records).
        3.  Let `thisValue` be `refEnv`.WithBaseObject().
2.  Else,
    1.  Let `thisValue` be undefined.
3.  Let `argList` be ? [ArgumentListEvaluation](#sec-runtime-semantics-argumentlistevaluation) of `arguments`.
4.  If `func` [is not an Object](#sec-object-type), throw a TypeError exception.
5.  If [IsCallable](#sec-iscallable)(`func`) is false, throw a TypeError exception.
6.  If `tailPosition` is true, perform [PrepareForTailCall](#sec-preparefortailcall)().
7.  Return ? [Call](#sec-call)(`func`, `thisValue`, `argList`).

### 13.3.7 The `super` Keyword

#### 13.3.7.1 Runtime Semantics: Evaluation

[SuperProperty](#prod-SuperProperty) : super \[ [Expression](#prod-Expression) \]

1.  Let `env` be [GetThisEnvironment](#sec-getthisenvironment)().
2.  Let `actualThis` be ? `env`.GetThisBinding().
3.  Let `propertyNameReference` be ? [Evaluation](#sec-evaluation) of [Expression](#prod-Expression).
4.  Let `propertyNameValue` be ? [GetValue](#sec-getvalue)(`propertyNameReference`).
5.  Let `strict` be [IsStrict](#sec-isstrict)(this [SuperProperty](#prod-SuperProperty)).
6.  NOTE: In most cases, [ToPropertyKey](#sec-topropertykey) will be performed on `propertyNameValue` immediately after this step. However, in the case of `super[b] = c`, it will not be performed until after evaluation of `c`.
7.  Return [MakeSuperPropertyReference](#sec-makesuperpropertyreference)(`actualThis`, `propertyNameValue`, `strict`).

[SuperProperty](#prod-SuperProperty) : super . [IdentifierName](#prod-IdentifierName)

1.  Let `env` be [GetThisEnvironment](#sec-getthisenvironment)().
2.  Let `actualThis` be ? `env`.GetThisBinding().
3.  Let `propertyKey` be the [StringValue](#sec-static-semantics-stringvalue) of [IdentifierName](#prod-IdentifierName).
4.  Let `strict` be [IsStrict](#sec-isstrict)(this [SuperProperty](#prod-SuperProperty)).
5.  Return [MakeSuperPropertyReference](#sec-makesuperpropertyreference)(`actualThis`, `propertyKey`, `strict`).

[SuperCall](#prod-SuperCall) : super [Arguments](#prod-Arguments)

1.  Let `newTarget` be [GetNewTarget](#sec-getnewtarget)().
2.  [Assert](#assert): `newTarget` is a [constructor](#constructor).
3.  Let `func` be [GetSuperConstructor](#sec-getsuperconstructor)().
4.  Let `argList` be ? [ArgumentListEvaluation](#sec-runtime-semantics-argumentlistevaluation) of [Arguments](#prod-Arguments).
5.  If [IsConstructor](#sec-isconstructor)(`func`) is false, throw a TypeError exception.
6.  Let `result` be ? [Construct](#sec-construct)(`func`, `argList`, `newTarget`).
7.  Let `thisER` be [GetThisEnvironment](#sec-getthisenvironment)().
8.  [Assert](#assert): `thisER` is a [Function Environment Record](#sec-function-environment-records).
9.  Perform ? [BindThisValue](#sec-bindthisvalue)(`thisER`, `result`).
10. Let `F` be `thisER`.`[[FunctionObject]]`.
11. [Assert](#assert): `F` is an ECMAScript [function object](#function-object).
12. Perform ? [InitializeInstanceElements](#sec-initializeinstanceelements)(`result`, `F`).
13. Return `result`.

#### 13.3.7.2 GetSuperConstructor ( )

The abstract operation GetSuperConstructor takes no arguments and returns an [ECMAScript language value](#sec-ecmascript-language-types). It performs the following steps when called:

1.  Let `envRec` be [GetThisEnvironment](#sec-getthisenvironment)().
2.  [Assert](#assert): `envRec` is a [Function Environment Record](#sec-function-environment-records).
3.  Let `activeFunction` be `envRec`.`[[FunctionObject]]`.
4.  [Assert](#assert): `activeFunction` is an ECMAScript [function object](#function-object).
5.  Let `superConstructor` be ! `activeFunction`.`[[GetPrototypeOf]]`().
6.  Return `superConstructor`.

#### 13.3.7.3 MakeSuperPropertyReference ( `actualThis`, `propertyKey`, `strict` )

The abstract operation MakeSuperPropertyReference takes arguments `actualThis` (an [ECMAScript language value](#sec-ecmascript-language-types)), `propertyKey` (an [ECMAScript language value](#sec-ecmascript-language-types)), and `strict` (a Boolean) and returns a [Super Reference Record](#super-reference-record). It performs the following steps when called:

1.  Let `env` be [GetThisEnvironment](#sec-getthisenvironment)().
2.  [Assert](#assert): `env`.HasSuperBinding() is true.
3.  [Assert](#assert): `env` is a [Function Environment Record](#sec-function-environment-records).
4.  Let `baseValue` be [GetSuperBase](#sec-getsuperbase)(`env`).
5.  Return the [Reference Record](#sec-reference-record-specification-type) { `[[Base]]`: `baseValue`, `[[ReferencedName]]`: `propertyKey`, `[[Strict]]`: `strict`, `[[ThisValue]]`: `actualThis` }.

### 13.3.8 Argument Lists

Note

The evaluation of an argument list produces a [List](#sec-list-and-record-specification-type) of values.

#### 13.3.8.1 Runtime Semantics: ArgumentListEvaluation

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) ArgumentListEvaluation takes no arguments and returns either a [normal completion containing](#sec-completion-record-specification-type) a [List](#sec-list-and-record-specification-type) of [ECMAScript language values](#sec-ecmascript-language-types) or an [abrupt completion](#sec-completion-record-specification-type). It is defined piecewise over the following productions:

[Arguments](#prod-Arguments) : ( )

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[ArgumentList](#prod-ArgumentList) : [AssignmentExpression](#prod-AssignmentExpression)

1.  Let `ref` be ? [Evaluation](#sec-evaluation) of [AssignmentExpression](#prod-AssignmentExpression).
2.  Let `arg` be ? [GetValue](#sec-getvalue)(`ref`).
3.  Return « `arg` ».

[ArgumentList](#prod-ArgumentList) : ... [AssignmentExpression](#prod-AssignmentExpression)

1.  Let `list` be a new empty [List](#sec-list-and-record-specification-type).
2.  Let `spreadRef` be ? [Evaluation](#sec-evaluation) of [AssignmentExpression](#prod-AssignmentExpression).
3.  Let `spreadObj` be ? [GetValue](#sec-getvalue)(`spreadRef`).
4.  Let `iteratorRecord` be ? [GetIterator](#sec-getiterator)(`spreadObj`, sync).
5.  Repeat,
    1.  Let `next` be ? [IteratorStepValue](#sec-iteratorstepvalue)(`iteratorRecord`).
    2.  If `next` is done, return `list`.
    3.  Append `next` to `list`.

[ArgumentList](#prod-ArgumentList) : [ArgumentList](#prod-ArgumentList) , [AssignmentExpression](#prod-AssignmentExpression)

1.  Let `precedingArgs` be ? [ArgumentListEvaluation](#sec-runtime-semantics-argumentlistevaluation) of [ArgumentList](#prod-ArgumentList).
2.  Let `ref` be ? [Evaluation](#sec-evaluation) of [AssignmentExpression](#prod-AssignmentExpression).
3.  Let `arg` be ? [GetValue](#sec-getvalue)(`ref`).
4.  Return the [list-concatenation](#list-concatenation) of `precedingArgs` and « `arg` ».

[ArgumentList](#prod-ArgumentList) : [ArgumentList](#prod-ArgumentList) , ... [AssignmentExpression](#prod-AssignmentExpression)

1.  Let `precedingArgs` be ? [ArgumentListEvaluation](#sec-runtime-semantics-argumentlistevaluation) of [ArgumentList](#prod-ArgumentList).
2.  Let `spreadRef` be ? [Evaluation](#sec-evaluation) of [AssignmentExpression](#prod-AssignmentExpression).
3.  Let `iteratorRecord` be ? [GetIterator](#sec-getiterator)(? [GetValue](#sec-getvalue)(`spreadRef`), sync).
4.  Repeat,
    1.  Let `next` be ? [IteratorStepValue](#sec-iteratorstepvalue)(`iteratorRecord`).
    2.  If `next` is done, return `precedingArgs`.
    3.  Append `next` to `precedingArgs`.

[TemplateLiteral](#prod-TemplateLiteral) : [NoSubstitutionTemplate](#prod-NoSubstitutionTemplate)

1.  Let `templateLiteral` be this [TemplateLiteral](#prod-TemplateLiteral).
2.  Let `siteObj` be [GetTemplateObject](#sec-gettemplateobject)(`templateLiteral`).
3.  Return « `siteObj` ».

[TemplateLiteral](#prod-TemplateLiteral) : [SubstitutionTemplate](#prod-SubstitutionTemplate)

1.  Let `templateLiteral` be this [TemplateLiteral](#prod-TemplateLiteral).
2.  Let `siteObj` be [GetTemplateObject](#sec-gettemplateobject)(`templateLiteral`).
3.  Let `remaining` be ? [ArgumentListEvaluation](#sec-runtime-semantics-argumentlistevaluation) of [SubstitutionTemplate](#prod-SubstitutionTemplate).
4.  Return the [list-concatenation](#list-concatenation) of « `siteObj` » and `remaining`.

[SubstitutionTemplate](#prod-SubstitutionTemplate) : [TemplateHead](#prod-TemplateHead) [Expression](#prod-Expression) [TemplateSpans](#prod-TemplateSpans)

1.  Let `firstSubRef` be ? [Evaluation](#sec-evaluation) of [Expression](#prod-Expression).
2.  Let `firstSub` be ? [GetValue](#sec-getvalue)(`firstSubRef`).
3.  Let `restSub` be ? [SubstitutionEvaluation](#sec-runtime-semantics-substitutionevaluation) of [TemplateSpans](#prod-TemplateSpans).
4.  [Assert](#assert): `restSub` is a possibly empty [List](#sec-list-and-record-specification-type).
5.  Return the [list-concatenation](#list-concatenation) of « `firstSub` » and `restSub`.

### 13.3.9 Optional Chains

Note

An optional chain is a chain of one or more property accesses and function calls, the first of which begins with the token `?.`.

#### 13.3.9.1 Runtime Semantics: Evaluation

[OptionalExpression](#prod-OptionalExpression) : [MemberExpression](#prod-MemberExpression) [OptionalChain](#prod-OptionalChain)

1.  Let `baseReference` be ? [Evaluation](#sec-evaluation) of [MemberExpression](#prod-MemberExpression).
2.  Let `baseValue` be ? [GetValue](#sec-getvalue)(`baseReference`).
3.  If `baseValue` is either undefined or null, then
    1.  Return undefined.
4.  Return ? [ChainEvaluation](#sec-optional-chaining-chain-evaluation) of [OptionalChain](#prod-OptionalChain) with arguments `baseValue` and `baseReference`.

[OptionalExpression](#prod-OptionalExpression) : [CallExpression](#prod-CallExpression) [OptionalChain](#prod-OptionalChain)

1.  Let `baseReference` be ? [Evaluation](#sec-evaluation) of [CallExpression](#prod-CallExpression).
2.  Let `baseValue` be ? [GetValue](#sec-getvalue)(`baseReference`).
3.  If `baseValue` is either undefined or null, then
    1.  Return undefined.
4.  Return ? [ChainEvaluation](#sec-optional-chaining-chain-evaluation) of [OptionalChain](#prod-OptionalChain) with arguments `baseValue` and `baseReference`.

[OptionalExpression](#prod-OptionalExpression) : [OptionalExpression](#prod-OptionalExpression) [OptionalChain](#prod-OptionalChain)

1.  Let `baseReference` be ? [Evaluation](#sec-evaluation) of [OptionalExpression](#prod-OptionalExpression).
2.  Let `baseValue` be ? [GetValue](#sec-getvalue)(`baseReference`).
3.  If `baseValue` is either undefined or null, then
    1.  Return undefined.
4.  Return ? [ChainEvaluation](#sec-optional-chaining-chain-evaluation) of [OptionalChain](#prod-OptionalChain) with arguments `baseValue` and `baseReference`.

#### 13.3.9.2 Runtime Semantics: ChainEvaluation

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) ChainEvaluation takes arguments `baseValue` (an [ECMAScript language value](#sec-ecmascript-language-types)) and `baseReference` (an [ECMAScript language value](#sec-ecmascript-language-types) or a [Reference Record](#sec-reference-record-specification-type)) and returns either a [normal completion containing](#sec-completion-record-specification-type) either an [ECMAScript language value](#sec-ecmascript-language-types) or a [Reference Record](#sec-reference-record-specification-type), or an [abrupt completion](#sec-completion-record-specification-type). It is defined piecewise over the following productions:

[OptionalChain](#prod-OptionalChain) : ?. [Arguments](#prod-Arguments)

1.  Let `thisChain` be this [OptionalChain](#prod-OptionalChain).
2.  Let `tailCall` be [IsInTailPosition](#sec-isintailposition)(`thisChain`).
3.  Return ? [EvaluateCall](#sec-evaluatecall)(`baseValue`, `baseReference`, [Arguments](#prod-Arguments), `tailCall`).

[OptionalChain](#prod-OptionalChain) : ?. \[ [Expression](#prod-Expression) \]

1.  Let `strict` be [IsStrict](#sec-isstrict)(this [OptionalChain](#prod-OptionalChain)).
2.  Return ? [EvaluatePropertyAccessWithExpressionKey](#sec-evaluate-property-access-with-expression-key)(`baseValue`, [Expression](#prod-Expression), `strict`).

[OptionalChain](#prod-OptionalChain) : ?. [IdentifierName](#prod-IdentifierName)

1.  Let `strict` be [IsStrict](#sec-isstrict)(this [OptionalChain](#prod-OptionalChain)).
2.  Return [EvaluatePropertyAccessWithIdentifierKey](#sec-evaluate-property-access-with-identifier-key)(`baseValue`, [IdentifierName](#prod-IdentifierName), `strict`).

[OptionalChain](#prod-OptionalChain) : ?. [PrivateIdentifier](#prod-PrivateIdentifier)

1.  Let `fieldNameString` be the [StringValue](#sec-static-semantics-stringvalue) of [PrivateIdentifier](#prod-PrivateIdentifier).
2.  Return [MakePrivateReference](#sec-makeprivatereference)(`baseValue`, `fieldNameString`).

[OptionalChain](#prod-OptionalChain) : [OptionalChain](#prod-OptionalChain) [Arguments](#prod-Arguments)

1.  Let `optionalChain` be [OptionalChain](#prod-OptionalChain).
2.  Let `newReference` be ? [ChainEvaluation](#sec-optional-chaining-chain-evaluation) of `optionalChain` with arguments `baseValue` and `baseReference`.
3.  Let `newValue` be ? [GetValue](#sec-getvalue)(`newReference`).
4.  Let `thisChain` be this [OptionalChain](#prod-OptionalChain).
5.  Let `tailCall` be [IsInTailPosition](#sec-isintailposition)(`thisChain`).
6.  Return ? [EvaluateCall](#sec-evaluatecall)(`newValue`, `newReference`, [Arguments](#prod-Arguments), `tailCall`).

[OptionalChain](#prod-OptionalChain) : [OptionalChain](#prod-OptionalChain) \[ [Expression](#prod-Expression) \]

1.  Let `optionalChain` be [OptionalChain](#prod-OptionalChain).
2.  Let `newReference` be ? [ChainEvaluation](#sec-optional-chaining-chain-evaluation) of `optionalChain` with arguments `baseValue` and `baseReference`.
3.  Let `newValue` be ? [GetValue](#sec-getvalue)(`newReference`).
4.  Let `strict` be [IsStrict](#sec-isstrict)(this [OptionalChain](#prod-OptionalChain)).
5.  Return ? [EvaluatePropertyAccessWithExpressionKey](#sec-evaluate-property-access-with-expression-key)(`newValue`, [Expression](#prod-Expression), `strict`).

[OptionalChain](#prod-OptionalChain) : [OptionalChain](#prod-OptionalChain) . [IdentifierName](#prod-IdentifierName)

1.  Let `optionalChain` be [OptionalChain](#prod-OptionalChain).
2.  Let `newReference` be ? [ChainEvaluation](#sec-optional-chaining-chain-evaluation) of `optionalChain` with arguments `baseValue` and `baseReference`.
3.  Let `newValue` be ? [GetValue](#sec-getvalue)(`newReference`).
4.  Let `strict` be [IsStrict](#sec-isstrict)(this [OptionalChain](#prod-OptionalChain)).
5.  Return [EvaluatePropertyAccessWithIdentifierKey](#sec-evaluate-property-access-with-identifier-key)(`newValue`, [IdentifierName](#prod-IdentifierName), `strict`).

[OptionalChain](#prod-OptionalChain) : [OptionalChain](#prod-OptionalChain) . [PrivateIdentifier](#prod-PrivateIdentifier)

1.  Let `optionalChain` be [OptionalChain](#prod-OptionalChain).
2.  Let `newReference` be ? [ChainEvaluation](#sec-optional-chaining-chain-evaluation) of `optionalChain` with arguments `baseValue` and `baseReference`.
3.  Let `newValue` be ? [GetValue](#sec-getvalue)(`newReference`).
4.  Let `fieldNameString` be the [StringValue](#sec-static-semantics-stringvalue) of [PrivateIdentifier](#prod-PrivateIdentifier).
5.  Return [MakePrivateReference](#sec-makeprivatereference)(`newValue`, `fieldNameString`).

### 13.3.10 Import Calls

#### 13.3.10.1 Runtime Semantics: Evaluation

[ImportCall](#prod-ImportCall) : import ( [AssignmentExpression](#prod-AssignmentExpression) ,opt )

1.  Return ? [EvaluateImportCall](#sec-evaluate-import-call)([AssignmentExpression](#prod-AssignmentExpression)).

[ImportCall](#prod-ImportCall) : import ( [AssignmentExpression](#prod-AssignmentExpression) , [AssignmentExpression](#prod-AssignmentExpression) ,opt )

1.  Return ? [EvaluateImportCall](#sec-evaluate-import-call)(the first [AssignmentExpression](#prod-AssignmentExpression), the second [AssignmentExpression](#prod-AssignmentExpression)).

#### 13.3.10.2 EvaluateImportCall ( `specifierExpression` \[ , `optionsExpression` \] )

The abstract operation EvaluateImportCall takes argument `specifierExpression` (a [Parse Node](#sec-syntactic-grammar)) and optional argument `optionsExpression` (a [Parse Node](#sec-syntactic-grammar)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a Promise or an [abrupt completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `referrer` be [GetActiveScriptOrModule](#sec-getactivescriptormodule)().
2.  If `referrer` is null, set `referrer` to [the current Realm Record](#current-realm).
3.  Let `specifierRef` be ? [Evaluation](#sec-evaluation) of `specifierExpression`.
4.  Let `specifier` be ? [GetValue](#sec-getvalue)(`specifierRef`).
5.  If `optionsExpression` is present, then
    1.  Let `optionsRef` be ? [Evaluation](#sec-evaluation) of `optionsExpression`.
    2.  Let `options` be ? [GetValue](#sec-getvalue)(`optionsRef`).
6.  Else,
    1.  Let `options` be undefined.
7.  Let `promiseCapability` be ! [NewPromiseCapability](#sec-newpromisecapability)([%Promise%](#sec-promise-constructor)).
8.  Let `specifierString` be [Completion](#sec-completion-ao)([ToString](#sec-tostring)(`specifier`)).
9.  [IfAbruptRejectPromise](#sec-ifabruptrejectpromise)(`specifierString`, `promiseCapability`).
10. Let `attributes` be a new empty [List](#sec-list-and-record-specification-type).
11. If `options` is not undefined, then
    1.  If `options` [is not an Object](#sec-object-type), then
        1.  Perform ! [Call](#sec-call)(`promiseCapability`.`[[Reject]]`, undefined, « a newly created TypeError object »).
        2.  Return `promiseCapability`.`[[Promise]]`.
    2.  Let `attributesObj` be [Completion](#sec-completion-ao)([Get](#sec-get-o-p)(`options`, "with")).
    3.  [IfAbruptRejectPromise](#sec-ifabruptrejectpromise)(`attributesObj`, `promiseCapability`).
    4.  If `attributesObj` is not undefined, then
        1.  If `attributesObj` [is not an Object](#sec-object-type), then
            1.  Perform ! [Call](#sec-call)(`promiseCapability`.`[[Reject]]`, undefined, « a newly created TypeError object »).
            2.  Return `promiseCapability`.`[[Promise]]`.
        2.  Let `entries` be [Completion](#sec-completion-ao)([EnumerableOwnProperties](#sec-enumerableownproperties)(`attributesObj`, key+value)).
        3.  [IfAbruptRejectPromise](#sec-ifabruptrejectpromise)(`entries`, `promiseCapability`).
        4.  For each element `entry` of `entries`, do
            1.  Let `key` be ! [Get](#sec-get-o-p)(`entry`, "0").
            2.  Let `value` be ! [Get](#sec-get-o-p)(`entry`, "1").
            3.  If `key` [is a String](#sec-ecmascript-language-types-string-type), then
                1.  If `value` [is not a String](#sec-ecmascript-language-types-string-type), then
                    1.  Perform ! [Call](#sec-call)(`promiseCapability`.`[[Reject]]`, undefined, « a newly created TypeError object »).
                    2.  Return `promiseCapability`.`[[Promise]]`.
                2.  Append the [ImportAttribute Record](#importattribute-record) { `[[Key]]`: `key`, `[[Value]]`: `value` } to `attributes`.
    5.  If [AllImportAttributesSupported](#sec-AllImportAttributesSupported)(`attributes`) is false, then
        1.  Perform ! [Call](#sec-call)(`promiseCapability`.`[[Reject]]`, undefined, « a newly created TypeError object »).
        2.  Return `promiseCapability`.`[[Promise]]`.
    6.  Sort `attributes` according to the lexicographic order of their `[[Key]]` field, treating the value of each such field as a sequence of UTF-16 code unit values. NOTE: This sorting is observable only in that [hosts](#host) are prohibited from changing behaviour based on the order in which attributes are enumerated.
12. Let `moduleRequest` be a new [ModuleRequest Record](#modulerequest-record) { `[[Specifier]]`: `specifierString`, `[[Attributes]]`: `attributes` }.
13. Perform [HostLoadImportedModule](#sec-HostLoadImportedModule)(`referrer`, `moduleRequest`, empty, `promiseCapability`).
14. Return `promiseCapability`.`[[Promise]]`.

#### 13.3.10.3 ContinueDynamicImport ( `promiseCapability`, `moduleCompletion` )

The abstract operation ContinueDynamicImport takes arguments `promiseCapability` (a [PromiseCapability Record](#sec-promisecapability-records)) and `moduleCompletion` (either a [normal completion containing](#sec-completion-record-specification-type) a [Module Record](#sec-abstract-module-records) or a [throw completion](#sec-completion-record-specification-type)) and returns unused. It completes the process of a dynamic import originally started by an [`import()`](#sec-import-calls) call, resolving or rejecting the promise returned by that call as appropriate. It performs the following steps when called:

1.  If `moduleCompletion` is an [abrupt completion](#sec-completion-record-specification-type), then
    1.  Perform ! [Call](#sec-call)(`promiseCapability`.`[[Reject]]`, undefined, « `moduleCompletion`.`[[Value]]` »).
    2.  Return unused.
2.  Let `module` be `moduleCompletion`.`[[Value]]`.
3.  Let `loadPromise` be `module`.LoadRequestedModules().
4.  Let `rejectedClosure` be a new [Abstract Closure](#sec-abstract-closure) with parameters (`reason`) that captures `promiseCapability` and performs the following steps when called:
    1.  Perform ! [Call](#sec-call)(`promiseCapability`.`[[Reject]]`, undefined, « `reason` »).
    2.  Return unused.
5.  Let `onRejected` be [CreateBuiltinFunction](#sec-createbuiltinfunction)(`rejectedClosure`, 1, "", « »).
6.  Let `linkAndEvaluateClosure` be a new [Abstract Closure](#sec-abstract-closure) with no parameters that captures `module`, `promiseCapability`, and `onRejected` and performs the following steps when called:
    1.  Let `link` be [Completion](#sec-completion-ao)(`module`.Link()).
    2.  If `link` is an [abrupt completion](#sec-completion-record-specification-type), then
        1.  Perform ! [Call](#sec-call)(`promiseCapability`.`[[Reject]]`, undefined, « `link`.`[[Value]]` »).
        2.  Return unused.
    3.  Let `evaluatePromise` be `module`.Evaluate().
    4.  Let `fulfilledClosure` be a new [Abstract Closure](#sec-abstract-closure) with no parameters that captures `module` and `promiseCapability` and performs the following steps when called:
        1.  Let `namespace` be [GetModuleNamespace](#sec-getmodulenamespace)(`module`).
        2.  Perform ! Call(`promiseCapability`.`[[Resolve]]`, undefined, « `namespace` »).
        3.  Return unused.
    5.  Let `onFulfilled` be [CreateBuiltinFunction](#sec-createbuiltinfunction)(`fulfilledClosure`, 0, "", « »).
    6.  Perform [PerformPromiseThen](#sec-performpromisethen)(`evaluatePromise`, `onFulfilled`, `onRejected`).
    7.  Return unused.
7.  Let `linkAndEvaluate` be [CreateBuiltinFunction](#sec-createbuiltinfunction)(`linkAndEvaluateClosure`, 0, "", « »).
8.  Perform [PerformPromiseThen](#sec-performpromisethen)(`loadPromise`, `linkAndEvaluate`, `onRejected`).
9.  Return unused.

### 13.3.11 Tagged Templates

Note

A tagged template is a function call where the arguments of the call are derived from a [TemplateLiteral](#prod-TemplateLiteral) ([13.2.8](#sec-template-literals)). The actual arguments include a template object ([13.2.8.4](#sec-gettemplateobject)) and the values produced by evaluating the expressions embedded within the [TemplateLiteral](#prod-TemplateLiteral).

#### 13.3.11.1 Runtime Semantics: Evaluation

[MemberExpression](#prod-MemberExpression) : [MemberExpression](#prod-MemberExpression) [TemplateLiteral](#prod-TemplateLiteral)

1.  Let `tagRef` be ? [Evaluation](#sec-evaluation) of [MemberExpression](#prod-MemberExpression).
2.  Let `tagFunc` be ? [GetValue](#sec-getvalue)(`tagRef`).
3.  Let `thisCall` be this [MemberExpression](#prod-MemberExpression).
4.  Let `tailCall` be [IsInTailPosition](#sec-isintailposition)(`thisCall`).
5.  Return ? [EvaluateCall](#sec-evaluatecall)(`tagFunc`, `tagRef`, [TemplateLiteral](#prod-TemplateLiteral), `tailCall`).

[CallExpression](#prod-CallExpression) : [CallExpression](#prod-CallExpression) [TemplateLiteral](#prod-TemplateLiteral)

1.  Let `tagRef` be ? [Evaluation](#sec-evaluation) of [CallExpression](#prod-CallExpression).
2.  Let `tagFunc` be ? [GetValue](#sec-getvalue)(`tagRef`).
3.  Let `thisCall` be this [CallExpression](#prod-CallExpression).
4.  Let `tailCall` be [IsInTailPosition](#sec-isintailposition)(`thisCall`).
5.  Return ? [EvaluateCall](#sec-evaluatecall)(`tagFunc`, `tagRef`, [TemplateLiteral](#prod-TemplateLiteral), `tailCall`).

### 13.3.12 Meta Properties

#### 13.3.12.1 Runtime Semantics: Evaluation

[NewTarget](#prod-NewTarget) : new . target

1.  Return [GetNewTarget](#sec-getnewtarget)().

[ImportMeta](#prod-ImportMeta) : import . meta

1.  Let `module` be [GetActiveScriptOrModule](#sec-getactivescriptormodule)().
2.  [Assert](#assert): `module` is a [Source Text Module Record](#sourctextmodule-record).
3.  Let `importMeta` be `module`.`[[ImportMeta]]`.
4.  If `importMeta` is empty, then
    1.  Set `importMeta` to [OrdinaryObjectCreate](#sec-ordinaryobjectcreate)(null).
    2.  Let `importMetaValues` be [HostGetImportMetaProperties](#sec-hostgetimportmetaproperties)(`module`).
    3.  For each [Record](#sec-list-and-record-specification-type) { `[[Key]]`, `[[Value]]` } `p` of `importMetaValues`, do
        1.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`importMeta`, `p`.`[[Key]]`, `p`.`[[Value]]`).
    4.  Perform [HostFinalizeImportMeta](#sec-hostfinalizeimportmeta)(`importMeta`, `module`).
    5.  Set `module`.`[[ImportMeta]]` to `importMeta`.
    6.  Return `importMeta`.
5.  Else,
    1.  [Assert](#assert): `importMeta` [is an Object](#sec-object-type).
    2.  Return `importMeta`.

##### 13.3.12.1.1 HostGetImportMetaProperties ( `moduleRecord` )

The [host-defined](#host-defined) abstract operation HostGetImportMetaProperties takes argument `moduleRecord` (a [Module Record](#sec-abstract-module-records)) and returns a [List](#sec-list-and-record-specification-type) of [Records](#sec-list-and-record-specification-type) with fields `[[Key]]` (a [property key](#property-key)) and `[[Value]]` (an [ECMAScript language value](#sec-ecmascript-language-types)). It allows [hosts](#host) to provide [property keys](#property-key) and values for the object returned from `import.meta`.

The default implementation of HostGetImportMetaProperties is to return a new empty [List](#sec-list-and-record-specification-type).

##### 13.3.12.1.2 HostFinalizeImportMeta ( `importMeta`, `moduleRecord` )

The [host-defined](#host-defined) abstract operation HostFinalizeImportMeta takes arguments `importMeta` (an Object) and `moduleRecord` (a [Module Record](#sec-abstract-module-records)) and returns unused. It allows [hosts](#host) to perform any extraordinary operations to prepare the object returned from `import.meta`.

Most [hosts](#host) will be able to simply define [HostGetImportMetaProperties](#sec-hostgetimportmetaproperties), and leave HostFinalizeImportMeta with its default behaviour. However, HostFinalizeImportMeta provides an "escape hatch" for [hosts](#host) which need to directly manipulate the object before it is exposed to ECMAScript code.

The default implementation of HostFinalizeImportMeta is to return unused.

## 13.4 Update Expressions

### Syntax

[UpdateExpression](#prod-UpdateExpression)\[Yield, Await\] : [LeftHandSideExpression](#prod-LeftHandSideExpression)\[?Yield, ?Await\] [LeftHandSideExpression](#prod-LeftHandSideExpression)\[?Yield, ?Await\] \[no [LineTerminator](#prod-LineTerminator) here\] ++ [LeftHandSideExpression](#prod-LeftHandSideExpression)\[?Yield, ?Await\] \[no [LineTerminator](#prod-LineTerminator) here\] -- ++ [UnaryExpression](#prod-UnaryExpression)\[?Yield, ?Await\] -- [UnaryExpression](#prod-UnaryExpression)\[?Yield, ?Await\]

### 13.4.1 Static Semantics: Early Errors

[UpdateExpression](#prod-UpdateExpression) : [LeftHandSideExpression](#prod-LeftHandSideExpression) ++ [LeftHandSideExpression](#prod-LeftHandSideExpression) --

- It is an early Syntax Error if the [AssignmentTargetType](#sec-static-semantics-assignmenttargettype) of [LeftHandSideExpression](#prod-LeftHandSideExpression) is not simple.

[UpdateExpression](#prod-UpdateExpression) : ++ [UnaryExpression](#prod-UnaryExpression) -- [UnaryExpression](#prod-UnaryExpression)

- It is an early Syntax Error if the [AssignmentTargetType](#sec-static-semantics-assignmenttargettype) of [UnaryExpression](#prod-UnaryExpression) is not simple.

### 13.4.2 Postfix Increment Operator

#### 13.4.2.1 Runtime Semantics: Evaluation

[UpdateExpression](#prod-UpdateExpression) : [LeftHandSideExpression](#prod-LeftHandSideExpression) ++

1.  Let `lhs` be ? [Evaluation](#sec-evaluation) of [LeftHandSideExpression](#prod-LeftHandSideExpression).
2.  Let `oldValue` be ? [ToNumeric](#sec-tonumeric)(? [GetValue](#sec-getvalue)(`lhs`)).
3.  If `oldValue` [is a Number](#sec-ecmascript-language-types-number-type), then
    1.  Let `newValue` be [Number::add](#sec-numeric-types-number-add)(`oldValue`, 1_(𝔽)).
4.  Else,
    1.  [Assert](#assert): `oldValue` [is a BigInt](#sec-ecmascript-language-types-bigint-type).
    2.  Let `newValue` be [BigInt::add](#sec-numeric-types-bigint-add)(`oldValue`, 1_(ℤ)).
5.  Perform ? [PutValue](#sec-putvalue)(`lhs`, `newValue`).
6.  Return `oldValue`.

### 13.4.3 Postfix Decrement Operator

#### 13.4.3.1 Runtime Semantics: Evaluation

[UpdateExpression](#prod-UpdateExpression) : [LeftHandSideExpression](#prod-LeftHandSideExpression) --

1.  Let `lhs` be ? [Evaluation](#sec-evaluation) of [LeftHandSideExpression](#prod-LeftHandSideExpression).
2.  Let `oldValue` be ? [ToNumeric](#sec-tonumeric)(? [GetValue](#sec-getvalue)(`lhs`)).
3.  If `oldValue` [is a Number](#sec-ecmascript-language-types-number-type), then
    1.  Let `newValue` be [Number::subtract](#sec-numeric-types-number-subtract)(`oldValue`, 1_(𝔽)).
4.  Else,
    1.  [Assert](#assert): `oldValue` [is a BigInt](#sec-ecmascript-language-types-bigint-type).
    2.  Let `newValue` be [BigInt::subtract](#sec-numeric-types-bigint-subtract)(`oldValue`, 1_(ℤ)).
5.  Perform ? [PutValue](#sec-putvalue)(`lhs`, `newValue`).
6.  Return `oldValue`.

### 13.4.4 Prefix Increment Operator

#### 13.4.4.1 Runtime Semantics: Evaluation

[UpdateExpression](#prod-UpdateExpression) : ++ [UnaryExpression](#prod-UnaryExpression)

1.  Let `expr` be ? [Evaluation](#sec-evaluation) of [UnaryExpression](#prod-UnaryExpression).
2.  Let `oldValue` be ? [ToNumeric](#sec-tonumeric)(? [GetValue](#sec-getvalue)(`expr`)).
3.  If `oldValue` [is a Number](#sec-ecmascript-language-types-number-type), then
    1.  Let `newValue` be [Number::add](#sec-numeric-types-number-add)(`oldValue`, 1_(𝔽)).
4.  Else,
    1.  [Assert](#assert): `oldValue` [is a BigInt](#sec-ecmascript-language-types-bigint-type).
    2.  Let `newValue` be [BigInt::add](#sec-numeric-types-bigint-add)(`oldValue`, 1_(ℤ)).
5.  Perform ? [PutValue](#sec-putvalue)(`expr`, `newValue`).
6.  Return `newValue`.

### 13.4.5 Prefix Decrement Operator

#### 13.4.5.1 Runtime Semantics: Evaluation

[UpdateExpression](#prod-UpdateExpression) : -- [UnaryExpression](#prod-UnaryExpression)

1.  Let `expr` be ? [Evaluation](#sec-evaluation) of [UnaryExpression](#prod-UnaryExpression).
2.  Let `oldValue` be ? [ToNumeric](#sec-tonumeric)(? [GetValue](#sec-getvalue)(`expr`)).
3.  If `oldValue` [is a Number](#sec-ecmascript-language-types-number-type), then
    1.  Let `newValue` be [Number::subtract](#sec-numeric-types-number-subtract)(`oldValue`, 1_(𝔽)).
4.  Else,
    1.  [Assert](#assert): `oldValue` [is a BigInt](#sec-ecmascript-language-types-bigint-type).
    2.  Let `newValue` be [BigInt::subtract](#sec-numeric-types-bigint-subtract)(`oldValue`, 1_(ℤ)).
5.  Perform ? [PutValue](#sec-putvalue)(`expr`, `newValue`).
6.  Return `newValue`.

## 13.5 Unary Operators

### Syntax

[UnaryExpression](#prod-UnaryExpression)\[Yield, Await\] : [UpdateExpression](#prod-UpdateExpression)\[?Yield, ?Await\] delete [UnaryExpression](#prod-UnaryExpression)\[?Yield, ?Await\] void [UnaryExpression](#prod-UnaryExpression)\[?Yield, ?Await\] typeof [UnaryExpression](#prod-UnaryExpression)\[?Yield, ?Await\] + [UnaryExpression](#prod-UnaryExpression)\[?Yield, ?Await\] - [UnaryExpression](#prod-UnaryExpression)\[?Yield, ?Await\] ~ [UnaryExpression](#prod-UnaryExpression)\[?Yield, ?Await\] ! [UnaryExpression](#prod-UnaryExpression)\[?Yield, ?Await\] \[+Await\] [AwaitExpression](#prod-AwaitExpression)\[?Yield\]

### 13.5.1 The `delete` Operator

#### 13.5.1.1 Static Semantics: Early Errors

[UnaryExpression](#prod-UnaryExpression) : delete [UnaryExpression](#prod-UnaryExpression)

- It is a Syntax Error if [IsStrict](#sec-isstrict)(the [UnaryExpression](#prod-UnaryExpression)) is true and the derived [UnaryExpression](#prod-UnaryExpression) is [PrimaryExpression](#prod-PrimaryExpression) : [IdentifierReference](#prod-IdentifierReference) , [MemberExpression](#prod-MemberExpression) : [MemberExpression](#prod-MemberExpression) . [PrivateIdentifier](#prod-PrivateIdentifier) , [CallExpression](#prod-CallExpression) : [CallExpression](#prod-CallExpression) . [PrivateIdentifier](#prod-PrivateIdentifier) , [OptionalChain](#prod-OptionalChain) : ?. [PrivateIdentifier](#prod-PrivateIdentifier) , or [OptionalChain](#prod-OptionalChain) : [OptionalChain](#prod-OptionalChain) . [PrivateIdentifier](#prod-PrivateIdentifier) .

- It is a Syntax Error if the derived [UnaryExpression](#prod-UnaryExpression) is  
  [PrimaryExpression](#prod-PrimaryExpression) : [CoverParenthesizedExpressionAndArrowParameterList](#prod-CoverParenthesizedExpressionAndArrowParameterList)  
  and [CoverParenthesizedExpressionAndArrowParameterList](#prod-CoverParenthesizedExpressionAndArrowParameterList) ultimately derives a phrase that, if used in place of [UnaryExpression](#prod-UnaryExpression), would produce a Syntax Error according to these rules. This rule is recursively applied.

Note

The last rule means that expressions such as `delete (((foo)))` produce [early errors](#early-error) because of recursive application of the first rule.

#### 13.5.1.2 Runtime Semantics: Evaluation

[UnaryExpression](#prod-UnaryExpression) : delete [UnaryExpression](#prod-UnaryExpression)

1.  Let `ref` be ? [Evaluation](#sec-evaluation) of [UnaryExpression](#prod-UnaryExpression).
2.  If `ref` is not a [Reference Record](#sec-reference-record-specification-type), return true.
3.  If [IsUnresolvableReference](#sec-isunresolvablereference)(`ref`) is true, then
    1.  [Assert](#assert): `ref`.`[[Strict]]` is false.
    2.  Return true.
4.  If [IsPropertyReference](#sec-ispropertyreference)(`ref`) is true, then
    1.  [Assert](#assert): [IsPrivateReference](#sec-isprivatereference)(`ref`) is false.
    2.  If [IsSuperReference](#sec-issuperreference)(`ref`) is true, throw a ReferenceError exception.
    3.  Let `baseObj` be ? [ToObject](#sec-toobject)(`ref`.`[[Base]]`).
    4.  If `ref`.`[[ReferencedName]]` is not a [property key](#property-key), then
        1.  Set `ref`.`[[ReferencedName]]` to ? [ToPropertyKey](#sec-topropertykey)(`ref`.`[[ReferencedName]]`).
    5.  Let `deleteStatus` be ? `baseObj`.`[[Delete]]`(`ref`.`[[ReferencedName]]`).
    6.  If `deleteStatus` is false and `ref`.`[[Strict]]` is true, throw a TypeError exception.
    7.  Return `deleteStatus`.
5.  Else,
    1.  Let `base` be `ref`.`[[Base]]`.
    2.  [Assert](#assert): `base` is an [Environment Record](#sec-environment-records).
    3.  Return ? `base`.DeleteBinding(`ref`.`[[ReferencedName]]`).

Note 1

When a `delete` operator occurs within [strict mode code](#sec-strict-mode-code), a SyntaxError exception is thrown if its [UnaryExpression](#prod-UnaryExpression) is a direct reference to a variable, function argument, or function name. In addition, if a `delete` operator occurs within [strict mode code](#sec-strict-mode-code) and the property to be deleted has the attribute { `[[Configurable]]`: false } (or otherwise cannot be deleted), a TypeError exception is thrown.

Note 2

The object that may be created in step [4.c](#step-delete-operator-toobject) is not accessible outside of the above abstract operation and the [ordinary object](#ordinary-object) `[[Delete]]` internal method. An implementation might choose to avoid the actual creation of that object.

### 13.5.2 The `void` Operator

#### 13.5.2.1 Runtime Semantics: Evaluation

[UnaryExpression](#prod-UnaryExpression) : void [UnaryExpression](#prod-UnaryExpression)

1.  Let `expr` be ? [Evaluation](#sec-evaluation) of [UnaryExpression](#prod-UnaryExpression).
2.  Perform ? [GetValue](#sec-getvalue)(`expr`).
3.  Return undefined.

Note

[GetValue](#sec-getvalue) must be called even though its value is not used because it may have observable side-effects.

### 13.5.3 The `typeof` Operator

#### 13.5.3.1 Runtime Semantics: Evaluation

[UnaryExpression](#prod-UnaryExpression) : typeof [UnaryExpression](#prod-UnaryExpression)

1.  Let `val` be ? [Evaluation](#sec-evaluation) of [UnaryExpression](#prod-UnaryExpression).
2.  If `val` is a [Reference Record](#sec-reference-record-specification-type), then
    1.  If [IsUnresolvableReference](#sec-isunresolvablereference)(`val`) is true, return "undefined".
3.  Set `val` to ? [GetValue](#sec-getvalue)(`val`).
4.  If `val` is undefined, return "undefined".
5.  If `val` is null, return "object".
6.  If `val` [is a String](#sec-ecmascript-language-types-string-type), return "string".
7.  If `val` [is a Symbol](#sec-ecmascript-language-types-symbol-type), return "symbol".
8.  If `val` [is a Boolean](#sec-ecmascript-language-types-boolean-type), return "boolean".
9.  If `val` [is a Number](#sec-ecmascript-language-types-number-type), return "number".
10. If `val` [is a BigInt](#sec-ecmascript-language-types-bigint-type), return "bigint".
11. [Assert](#assert): `val` [is an Object](#sec-object-type).
12. NOTE: This step is replaced in section [B.3.6.3](#sec-IsHTMLDDA-internal-slot-typeof).
13. If `val` has a `[[Call]]` internal slot, return "function".
14. Return "object".

### 13.5.4 Unary `+` Operator

Note

The unary + operator converts its operand to [Number type](#sec-ecmascript-language-types-number-type).

#### 13.5.4.1 Runtime Semantics: Evaluation

[UnaryExpression](#prod-UnaryExpression) : + [UnaryExpression](#prod-UnaryExpression)

1.  Let `expr` be ? [Evaluation](#sec-evaluation) of [UnaryExpression](#prod-UnaryExpression).
2.  Return ? [ToNumber](#sec-tonumber)(? [GetValue](#sec-getvalue)(`expr`)).

### 13.5.5 Unary `-` Operator

Note

The unary `-` operator converts its operand to a numeric value and then negates it. Negating +0_(𝔽) produces -0_(𝔽), and negating -0_(𝔽) produces +0_(𝔽).

#### 13.5.5.1 Runtime Semantics: Evaluation

[UnaryExpression](#prod-UnaryExpression) : - [UnaryExpression](#prod-UnaryExpression)

1.  Let `expr` be ? [Evaluation](#sec-evaluation) of [UnaryExpression](#prod-UnaryExpression).
2.  Let `oldValue` be ? [ToNumeric](#sec-tonumeric)(? [GetValue](#sec-getvalue)(`expr`)).
3.  If `oldValue` [is a Number](#sec-ecmascript-language-types-number-type), then
    1.  Return [Number::unaryMinus](#sec-numeric-types-number-unaryMinus)(`oldValue`).
4.  Else,
    1.  [Assert](#assert): `oldValue` [is a BigInt](#sec-ecmascript-language-types-bigint-type).
    2.  Return [BigInt::unaryMinus](#sec-numeric-types-bigint-unaryMinus)(`oldValue`).

### 13.5.6 Bitwise NOT Operator ( `~` )

#### 13.5.6.1 Runtime Semantics: Evaluation

[UnaryExpression](#prod-UnaryExpression) : ~ [UnaryExpression](#prod-UnaryExpression)

1.  Let `expr` be ? [Evaluation](#sec-evaluation) of [UnaryExpression](#prod-UnaryExpression).
2.  Let `oldValue` be ? [ToNumeric](#sec-tonumeric)(? [GetValue](#sec-getvalue)(`expr`)).
3.  If `oldValue` [is a Number](#sec-ecmascript-language-types-number-type), then
    1.  Return [Number::bitwiseNOT](#sec-numeric-types-number-bitwiseNOT)(`oldValue`).
4.  Else,
    1.  [Assert](#assert): `oldValue` [is a BigInt](#sec-ecmascript-language-types-bigint-type).
    2.  Return [BigInt::bitwiseNOT](#sec-numeric-types-bigint-bitwiseNOT)(`oldValue`).

### 13.5.7 Logical NOT Operator ( `!` )

#### 13.5.7.1 Runtime Semantics: Evaluation

[UnaryExpression](#prod-UnaryExpression) : ! [UnaryExpression](#prod-UnaryExpression)

1.  Let `expr` be ? [Evaluation](#sec-evaluation) of [UnaryExpression](#prod-UnaryExpression).
2.  Let `oldValue` be [ToBoolean](#sec-toboolean)(? [GetValue](#sec-getvalue)(`expr`)).
3.  If `oldValue` is true, return false.
4.  Return true.

## 13.6 Exponentiation Operator

### Syntax

[ExponentiationExpression](#prod-ExponentiationExpression)\[Yield, Await\] : [UnaryExpression](#prod-UnaryExpression)\[?Yield, ?Await\] [UpdateExpression](#prod-UpdateExpression)\[?Yield, ?Await\] \*\* [ExponentiationExpression](#prod-ExponentiationExpression)\[?Yield, ?Await\]

### 13.6.1 Runtime Semantics: Evaluation

[ExponentiationExpression](#prod-ExponentiationExpression) : [UpdateExpression](#prod-UpdateExpression) \*\* [ExponentiationExpression](#prod-ExponentiationExpression)

1.  Return ? [EvaluateStringOrNumericBinaryExpression](#sec-evaluatestringornumericbinaryexpression)([UpdateExpression](#prod-UpdateExpression), `**`, [ExponentiationExpression](#prod-ExponentiationExpression)).

## 13.7 Multiplicative Operators

### Syntax

[MultiplicativeExpression](#prod-MultiplicativeExpression)\[Yield, Await\] : [ExponentiationExpression](#prod-ExponentiationExpression)\[?Yield, ?Await\] [MultiplicativeExpression](#prod-MultiplicativeExpression)\[?Yield, ?Await\] [MultiplicativeOperator](#prod-MultiplicativeOperator) [ExponentiationExpression](#prod-ExponentiationExpression)\[?Yield, ?Await\] [MultiplicativeOperator](#prod-MultiplicativeOperator) : one of \* / % Note

- The `*` operator performs multiplication, producing the product of its operands.
- The `/` operator performs division, producing the quotient of its operands.
- The `%` operator yields the remainder of its operands from an implied division.

### 13.7.1 Runtime Semantics: Evaluation

[MultiplicativeExpression](#prod-MultiplicativeExpression) : [MultiplicativeExpression](#prod-MultiplicativeExpression) [MultiplicativeOperator](#prod-MultiplicativeOperator) [ExponentiationExpression](#prod-ExponentiationExpression)

1.  Let `opText` be the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) [MultiplicativeOperator](#prod-MultiplicativeOperator).
2.  Return ? [EvaluateStringOrNumericBinaryExpression](#sec-evaluatestringornumericbinaryexpression)([MultiplicativeExpression](#prod-MultiplicativeExpression), `opText`, [ExponentiationExpression](#prod-ExponentiationExpression)).

## 13.8 Additive Operators

### Syntax

[AdditiveExpression](#prod-AdditiveExpression)\[Yield, Await\] : [MultiplicativeExpression](#prod-MultiplicativeExpression)\[?Yield, ?Await\] [AdditiveExpression](#prod-AdditiveExpression)\[?Yield, ?Await\] + [MultiplicativeExpression](#prod-MultiplicativeExpression)\[?Yield, ?Await\] [AdditiveExpression](#prod-AdditiveExpression)\[?Yield, ?Await\] - [MultiplicativeExpression](#prod-MultiplicativeExpression)\[?Yield, ?Await\]

### 13.8.1 The Addition Operator ( `+` )

Note

The addition operator either performs string concatenation or numeric addition.

#### 13.8.1.1 Runtime Semantics: Evaluation

[AdditiveExpression](#prod-AdditiveExpression) : [AdditiveExpression](#prod-AdditiveExpression) + [MultiplicativeExpression](#prod-MultiplicativeExpression)

1.  Return ? [EvaluateStringOrNumericBinaryExpression](#sec-evaluatestringornumericbinaryexpression)([AdditiveExpression](#prod-AdditiveExpression), `+`, [MultiplicativeExpression](#prod-MultiplicativeExpression)).

### 13.8.2 The Subtraction Operator ( `-` )

Note

The `-` operator performs subtraction, producing the difference of its operands.

#### 13.8.2.1 Runtime Semantics: Evaluation

[AdditiveExpression](#prod-AdditiveExpression) : [AdditiveExpression](#prod-AdditiveExpression) - [MultiplicativeExpression](#prod-MultiplicativeExpression)

1.  Return ? [EvaluateStringOrNumericBinaryExpression](#sec-evaluatestringornumericbinaryexpression)([AdditiveExpression](#prod-AdditiveExpression), `-`, [MultiplicativeExpression](#prod-MultiplicativeExpression)).

## 13.9 Bitwise Shift Operators

### Syntax

[ShiftExpression](#prod-ShiftExpression)\[Yield, Await\] : [AdditiveExpression](#prod-AdditiveExpression)\[?Yield, ?Await\] [ShiftExpression](#prod-ShiftExpression)\[?Yield, ?Await\] \<\< [AdditiveExpression](#prod-AdditiveExpression)\[?Yield, ?Await\] [ShiftExpression](#prod-ShiftExpression)\[?Yield, ?Await\] \>\> [AdditiveExpression](#prod-AdditiveExpression)\[?Yield, ?Await\] [ShiftExpression](#prod-ShiftExpression)\[?Yield, ?Await\] \>\>\> [AdditiveExpression](#prod-AdditiveExpression)\[?Yield, ?Await\]

### 13.9.1 The Left Shift Operator ( `<<` )

Note

Performs a bitwise left shift operation on the left operand by the amount specified by the right operand.

#### 13.9.1.1 Runtime Semantics: Evaluation

[ShiftExpression](#prod-ShiftExpression) : [ShiftExpression](#prod-ShiftExpression) \<\< [AdditiveExpression](#prod-AdditiveExpression)

1.  Return ? [EvaluateStringOrNumericBinaryExpression](#sec-evaluatestringornumericbinaryexpression)([ShiftExpression](#prod-ShiftExpression), `<<`, [AdditiveExpression](#prod-AdditiveExpression)).

### 13.9.2 The Signed Right Shift Operator ( `>>` )

Note

Performs a sign-filling bitwise right shift operation on the left operand by the amount specified by the right operand.

#### 13.9.2.1 Runtime Semantics: Evaluation

[ShiftExpression](#prod-ShiftExpression) : [ShiftExpression](#prod-ShiftExpression) \>\> [AdditiveExpression](#prod-AdditiveExpression)

1.  Return ? [EvaluateStringOrNumericBinaryExpression](#sec-evaluatestringornumericbinaryexpression)([ShiftExpression](#prod-ShiftExpression), `>>`, [AdditiveExpression](#prod-AdditiveExpression)).

### 13.9.3 The Unsigned Right Shift Operator ( `>>>` )

Note

Performs a zero-filling bitwise right shift operation on the left operand by the amount specified by the right operand.

#### 13.9.3.1 Runtime Semantics: Evaluation

[ShiftExpression](#prod-ShiftExpression) : [ShiftExpression](#prod-ShiftExpression) \>\>\> [AdditiveExpression](#prod-AdditiveExpression)

1.  Return ? [EvaluateStringOrNumericBinaryExpression](#sec-evaluatestringornumericbinaryexpression)([ShiftExpression](#prod-ShiftExpression), `>>>`, [AdditiveExpression](#prod-AdditiveExpression)).

## 13.10 Relational Operators

Note 1

The result of evaluating a relational operator is always of type Boolean, reflecting whether the relationship named by the operator holds between its two operands.

### Syntax

[RelationalExpression](#prod-RelationalExpression)\[In, Yield, Await\] : [ShiftExpression](#prod-ShiftExpression)\[?Yield, ?Await\] [RelationalExpression](#prod-RelationalExpression)\[?In, ?Yield, ?Await\] \< [ShiftExpression](#prod-ShiftExpression)\[?Yield, ?Await\] [RelationalExpression](#prod-RelationalExpression)\[?In, ?Yield, ?Await\] \> [ShiftExpression](#prod-ShiftExpression)\[?Yield, ?Await\] [RelationalExpression](#prod-RelationalExpression)\[?In, ?Yield, ?Await\] \<= [ShiftExpression](#prod-ShiftExpression)\[?Yield, ?Await\] [RelationalExpression](#prod-RelationalExpression)\[?In, ?Yield, ?Await\] \>= [ShiftExpression](#prod-ShiftExpression)\[?Yield, ?Await\] [RelationalExpression](#prod-RelationalExpression)\[?In, ?Yield, ?Await\] instanceof [ShiftExpression](#prod-ShiftExpression)\[?Yield, ?Await\] \[+In\] [RelationalExpression](#prod-RelationalExpression)\[+In, ?Yield, ?Await\] in [ShiftExpression](#prod-ShiftExpression)\[?Yield, ?Await\] \[+In\] [PrivateIdentifier](#prod-PrivateIdentifier) in [ShiftExpression](#prod-ShiftExpression)\[?Yield, ?Await\] Note 2

The _(\[In\]) grammar parameter is needed to avoid confusing the `in` operator in a relational expression with the `in` operator in a `for` statement.

### 13.10.1 Runtime Semantics: Evaluation

[RelationalExpression](#prod-RelationalExpression) : [RelationalExpression](#prod-RelationalExpression) \< [ShiftExpression](#prod-ShiftExpression)

1.  Let `lRef` be ? [Evaluation](#sec-evaluation) of [RelationalExpression](#prod-RelationalExpression).
2.  Let `lVal` be ? [GetValue](#sec-getvalue)(`lRef`).
3.  Let `rRef` be ? [Evaluation](#sec-evaluation) of [ShiftExpression](#prod-ShiftExpression).
4.  Let `rVal` be ? [GetValue](#sec-getvalue)(`rRef`).
5.  Let `r` be ? [IsLessThan](#sec-islessthan)(`lVal`, `rVal`, true).
6.  If `r` is undefined, return false. Otherwise, return `r`.

[RelationalExpression](#prod-RelationalExpression) : [RelationalExpression](#prod-RelationalExpression) \> [ShiftExpression](#prod-ShiftExpression)

1.  Let `lRef` be ? [Evaluation](#sec-evaluation) of [RelationalExpression](#prod-RelationalExpression).
2.  Let `lVal` be ? [GetValue](#sec-getvalue)(`lRef`).
3.  Let `rRef` be ? [Evaluation](#sec-evaluation) of [ShiftExpression](#prod-ShiftExpression).
4.  Let `rVal` be ? [GetValue](#sec-getvalue)(`rRef`).
5.  Let `r` be ? [IsLessThan](#sec-islessthan)(`rVal`, `lVal`, false).
6.  If `r` is undefined, return false. Otherwise, return `r`.

[RelationalExpression](#prod-RelationalExpression) : [RelationalExpression](#prod-RelationalExpression) \<= [ShiftExpression](#prod-ShiftExpression)

1.  Let `lRef` be ? [Evaluation](#sec-evaluation) of [RelationalExpression](#prod-RelationalExpression).
2.  Let `lVal` be ? [GetValue](#sec-getvalue)(`lRef`).
3.  Let `rRef` be ? [Evaluation](#sec-evaluation) of [ShiftExpression](#prod-ShiftExpression).
4.  Let `rVal` be ? [GetValue](#sec-getvalue)(`rRef`).
5.  Let `r` be ? [IsLessThan](#sec-islessthan)(`rVal`, `lVal`, false).
6.  If `r` is either true or undefined, return false. Otherwise, return true.

[RelationalExpression](#prod-RelationalExpression) : [RelationalExpression](#prod-RelationalExpression) \>= [ShiftExpression](#prod-ShiftExpression)

1.  Let `lRef` be ? [Evaluation](#sec-evaluation) of [RelationalExpression](#prod-RelationalExpression).
2.  Let `lVal` be ? [GetValue](#sec-getvalue)(`lRef`).
3.  Let `rRef` be ? [Evaluation](#sec-evaluation) of [ShiftExpression](#prod-ShiftExpression).
4.  Let `rVal` be ? [GetValue](#sec-getvalue)(`rRef`).
5.  Let `r` be ? [IsLessThan](#sec-islessthan)(`lVal`, `rVal`, true).
6.  If `r` is either true or undefined, return false. Otherwise, return true.

[RelationalExpression](#prod-RelationalExpression) : [RelationalExpression](#prod-RelationalExpression) instanceof [ShiftExpression](#prod-ShiftExpression)

1.  Let `lRef` be ? [Evaluation](#sec-evaluation) of [RelationalExpression](#prod-RelationalExpression).
2.  Let `lVal` be ? [GetValue](#sec-getvalue)(`lRef`).
3.  Let `rRef` be ? [Evaluation](#sec-evaluation) of [ShiftExpression](#prod-ShiftExpression).
4.  Let `rVal` be ? [GetValue](#sec-getvalue)(`rRef`).
5.  Return ? [InstanceofOperator](#sec-instanceofoperator)(`lVal`, `rVal`).

[RelationalExpression](#prod-RelationalExpression) : [RelationalExpression](#prod-RelationalExpression) in [ShiftExpression](#prod-ShiftExpression)

1.  Let `lRef` be ? [Evaluation](#sec-evaluation) of [RelationalExpression](#prod-RelationalExpression).
2.  Let `lVal` be ? [GetValue](#sec-getvalue)(`lRef`).
3.  Let `rRef` be ? [Evaluation](#sec-evaluation) of [ShiftExpression](#prod-ShiftExpression).
4.  Let `rVal` be ? [GetValue](#sec-getvalue)(`rRef`).
5.  If `rVal` [is not an Object](#sec-object-type), throw a TypeError exception.
6.  Return ? [HasProperty](#sec-hasproperty)(`rVal`, ? [ToPropertyKey](#sec-topropertykey)(`lVal`)).

[RelationalExpression](#prod-RelationalExpression) : [PrivateIdentifier](#prod-PrivateIdentifier) in [ShiftExpression](#prod-ShiftExpression)

1.  Let `privateIdentifier` be the [StringValue](#sec-static-semantics-stringvalue) of [PrivateIdentifier](#prod-PrivateIdentifier).
2.  Let `rRef` be ? [Evaluation](#sec-evaluation) of [ShiftExpression](#prod-ShiftExpression).
3.  Let `rVal` be ? [GetValue](#sec-getvalue)(`rRef`).
4.  If `rVal` [is not an Object](#sec-object-type), throw a TypeError exception.
5.  Let `privateEnv` be the [running execution context](#running-execution-context)'s PrivateEnvironment.
6.  [Assert](#assert): `privateEnv` is not null.
7.  Let `privateName` be [ResolvePrivateIdentifier](#sec-resolve-private-identifier)(`privateEnv`, `privateIdentifier`).
8.  If [PrivateElementFind](#sec-privateelementfind)(`rVal`, `privateName`) is not empty, return true.
9.  Return false.

### 13.10.2 InstanceofOperator ( `V`, `target` )

The abstract operation InstanceofOperator takes arguments `V` (an [ECMAScript language value](#sec-ecmascript-language-types)) and `target` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a Boolean or a [throw completion](#sec-completion-record-specification-type). It implements the generic algorithm for determining if `V` is an instance of `target` either by consulting `target`'s [%Symbol.hasInstance%](#sec-well-known-symbols) method or, if absent, determining whether the value of `target`'s "prototype" property is present in `V`'s prototype chain. It performs the following steps when called:

1.  If `target` [is not an Object](#sec-object-type), throw a TypeError exception.
2.  Let `instOfHandler` be ? [GetMethod](#sec-getmethod)(`target`, [%Symbol.hasInstance%](#sec-well-known-symbols)).
3.  If `instOfHandler` is not undefined, then
    1.  Return [ToBoolean](#sec-toboolean)(? [Call](#sec-call)(`instOfHandler`, `target`, « `V` »)).
4.  If [IsCallable](#sec-iscallable)(`target`) is false, throw a TypeError exception.
5.  Return ? [OrdinaryHasInstance](#sec-ordinaryhasinstance)(`target`, `V`).

Note

Steps [4](#step-instanceof-check-function) and [5](#step-instanceof-fallback) provide compatibility with previous editions of ECMAScript that did not use a [%Symbol.hasInstance%](#sec-well-known-symbols) method to define the `instanceof` operator semantics. If an object does not define or inherit [%Symbol.hasInstance%](#sec-well-known-symbols) it uses the default `instanceof` semantics.

## 13.11 Equality Operators

Note

The result of evaluating an equality operator is always of type Boolean, reflecting whether the relationship named by the operator holds between its two operands.

### Syntax

[EqualityExpression](#prod-EqualityExpression)\[In, Yield, Await\] : [RelationalExpression](#prod-RelationalExpression)\[?In, ?Yield, ?Await\] [EqualityExpression](#prod-EqualityExpression)\[?In, ?Yield, ?Await\] == [RelationalExpression](#prod-RelationalExpression)\[?In, ?Yield, ?Await\] [EqualityExpression](#prod-EqualityExpression)\[?In, ?Yield, ?Await\] != [RelationalExpression](#prod-RelationalExpression)\[?In, ?Yield, ?Await\] [EqualityExpression](#prod-EqualityExpression)\[?In, ?Yield, ?Await\] === [RelationalExpression](#prod-RelationalExpression)\[?In, ?Yield, ?Await\] [EqualityExpression](#prod-EqualityExpression)\[?In, ?Yield, ?Await\] !== [RelationalExpression](#prod-RelationalExpression)\[?In, ?Yield, ?Await\]

### 13.11.1 Runtime Semantics: Evaluation

[EqualityExpression](#prod-EqualityExpression) : [EqualityExpression](#prod-EqualityExpression) == [RelationalExpression](#prod-RelationalExpression)

1.  Let `lRef` be ? [Evaluation](#sec-evaluation) of [EqualityExpression](#prod-EqualityExpression).
2.  Let `lVal` be ? [GetValue](#sec-getvalue)(`lRef`).
3.  Let `rRef` be ? [Evaluation](#sec-evaluation) of [RelationalExpression](#prod-RelationalExpression).
4.  Let `rVal` be ? [GetValue](#sec-getvalue)(`rRef`).
5.  Return ? [IsLooselyEqual](#sec-islooselyequal)(`rVal`, `lVal`).

[EqualityExpression](#prod-EqualityExpression) : [EqualityExpression](#prod-EqualityExpression) != [RelationalExpression](#prod-RelationalExpression)

1.  Let `lRef` be ? [Evaluation](#sec-evaluation) of [EqualityExpression](#prod-EqualityExpression).
2.  Let `lVal` be ? [GetValue](#sec-getvalue)(`lRef`).
3.  Let `rRef` be ? [Evaluation](#sec-evaluation) of [RelationalExpression](#prod-RelationalExpression).
4.  Let `rVal` be ? [GetValue](#sec-getvalue)(`rRef`).
5.  Let `r` be ? [IsLooselyEqual](#sec-islooselyequal)(`rVal`, `lVal`).
6.  If `r` is true, return false. Otherwise, return true.

[EqualityExpression](#prod-EqualityExpression) : [EqualityExpression](#prod-EqualityExpression) === [RelationalExpression](#prod-RelationalExpression)

1.  Let `lRef` be ? [Evaluation](#sec-evaluation) of [EqualityExpression](#prod-EqualityExpression).
2.  Let `lVal` be ? [GetValue](#sec-getvalue)(`lRef`).
3.  Let `rRef` be ? [Evaluation](#sec-evaluation) of [RelationalExpression](#prod-RelationalExpression).
4.  Let `rVal` be ? [GetValue](#sec-getvalue)(`rRef`).
5.  Return [IsStrictlyEqual](#sec-isstrictlyequal)(`rVal`, `lVal`).

[EqualityExpression](#prod-EqualityExpression) : [EqualityExpression](#prod-EqualityExpression) !== [RelationalExpression](#prod-RelationalExpression)

1.  Let `lRef` be ? [Evaluation](#sec-evaluation) of [EqualityExpression](#prod-EqualityExpression).
2.  Let `lVal` be ? [GetValue](#sec-getvalue)(`lRef`).
3.  Let `rRef` be ? [Evaluation](#sec-evaluation) of [RelationalExpression](#prod-RelationalExpression).
4.  Let `rVal` be ? [GetValue](#sec-getvalue)(`rRef`).
5.  Let `r` be [IsStrictlyEqual](#sec-isstrictlyequal)(`rVal`, `lVal`).
6.  If `r` is true, return false. Otherwise, return true.

Note 1

Given the above definition of equality:

- String comparison can be forced by: `` `${a}` == `${b}` ``.
- Numeric comparison can be forced by: `+a == +b`.
- Boolean comparison can be forced by: `!a == !b`.

Note 2

The equality operators maintain the following invariants:

- `A != B` is equivalent to `!(A == B)`.
- `A == B` is equivalent to `B == A`, except in the order of evaluation of `A` and `B`.

Note 3

The equality operator is not always transitive. For example, there might be two distinct String objects, each representing the same String value; each String object would be considered equal to the String value by the `==` operator, but the two String objects would not be equal to each other. For example:

- `new String("a") == "a"` and `"a" == new String("a")` are both true.
- `new String("a") == new String("a")` is false.

Note 4

Comparison of Strings uses a simple equality test on sequences of code unit values. There is no attempt to use the more complex, semantically oriented definitions of character or string equality and collating order defined in the Unicode specification. Therefore Strings values that are canonically equal according to the Unicode Standard could test as unequal. In effect this algorithm assumes that both Strings are already in normalized form.

## 13.12 Binary Bitwise Operators

### Syntax

[BitwiseANDExpression](#prod-BitwiseANDExpression)\[In, Yield, Await\] : [EqualityExpression](#prod-EqualityExpression)\[?In, ?Yield, ?Await\] [BitwiseANDExpression](#prod-BitwiseANDExpression)\[?In, ?Yield, ?Await\] & [EqualityExpression](#prod-EqualityExpression)\[?In, ?Yield, ?Await\] [BitwiseXORExpression](#prod-BitwiseXORExpression)\[In, Yield, Await\] : [BitwiseANDExpression](#prod-BitwiseANDExpression)\[?In, ?Yield, ?Await\] [BitwiseXORExpression](#prod-BitwiseXORExpression)\[?In, ?Yield, ?Await\] ^ [BitwiseANDExpression](#prod-BitwiseANDExpression)\[?In, ?Yield, ?Await\] [BitwiseORExpression](#prod-BitwiseORExpression)\[In, Yield, Await\] : [BitwiseXORExpression](#prod-BitwiseXORExpression)\[?In, ?Yield, ?Await\] [BitwiseORExpression](#prod-BitwiseORExpression)\[?In, ?Yield, ?Await\] \| [BitwiseXORExpression](#prod-BitwiseXORExpression)\[?In, ?Yield, ?Await\]

### 13.12.1 Runtime Semantics: Evaluation

[BitwiseANDExpression](#prod-BitwiseANDExpression) : [BitwiseANDExpression](#prod-BitwiseANDExpression) & [EqualityExpression](#prod-EqualityExpression)

1.  Return ? [EvaluateStringOrNumericBinaryExpression](#sec-evaluatestringornumericbinaryexpression)([BitwiseANDExpression](#prod-BitwiseANDExpression), `&`, [EqualityExpression](#prod-EqualityExpression)).

[BitwiseXORExpression](#prod-BitwiseXORExpression) : [BitwiseXORExpression](#prod-BitwiseXORExpression) ^ [BitwiseANDExpression](#prod-BitwiseANDExpression)

1.  Return ? [EvaluateStringOrNumericBinaryExpression](#sec-evaluatestringornumericbinaryexpression)([BitwiseXORExpression](#prod-BitwiseXORExpression), `^`, [BitwiseANDExpression](#prod-BitwiseANDExpression)).

[BitwiseORExpression](#prod-BitwiseORExpression) : [BitwiseORExpression](#prod-BitwiseORExpression) \| [BitwiseXORExpression](#prod-BitwiseXORExpression)

1.  Return ? [EvaluateStringOrNumericBinaryExpression](#sec-evaluatestringornumericbinaryexpression)([BitwiseORExpression](#prod-BitwiseORExpression), `|`, [BitwiseXORExpression](#prod-BitwiseXORExpression)).

## 13.13 Binary Logical Operators

### Syntax

[LogicalANDExpression](#prod-LogicalANDExpression)\[In, Yield, Await\] : [BitwiseORExpression](#prod-BitwiseORExpression)\[?In, ?Yield, ?Await\] [LogicalANDExpression](#prod-LogicalANDExpression)\[?In, ?Yield, ?Await\] && [BitwiseORExpression](#prod-BitwiseORExpression)\[?In, ?Yield, ?Await\] [LogicalORExpression](#prod-LogicalORExpression)\[In, Yield, Await\] : [LogicalANDExpression](#prod-LogicalANDExpression)\[?In, ?Yield, ?Await\] [LogicalORExpression](#prod-LogicalORExpression)\[?In, ?Yield, ?Await\] \|\| [LogicalANDExpression](#prod-LogicalANDExpression)\[?In, ?Yield, ?Await\] [CoalesceExpression](#prod-CoalesceExpression)\[In, Yield, Await\] : [CoalesceExpressionHead](#prod-CoalesceExpressionHead)\[?In, ?Yield, ?Await\] ?? [BitwiseORExpression](#prod-BitwiseORExpression)\[?In, ?Yield, ?Await\] [CoalesceExpressionHead](#prod-CoalesceExpressionHead)\[In, Yield, Await\] : [CoalesceExpression](#prod-CoalesceExpression)\[?In, ?Yield, ?Await\] [BitwiseORExpression](#prod-BitwiseORExpression)\[?In, ?Yield, ?Await\] [ShortCircuitExpression](#prod-ShortCircuitExpression)\[In, Yield, Await\] : [LogicalORExpression](#prod-LogicalORExpression)\[?In, ?Yield, ?Await\] [CoalesceExpression](#prod-CoalesceExpression)\[?In, ?Yield, ?Await\] Note

The value produced by a `&&` or `||` operator is not necessarily of type Boolean. The value produced will always be the value of one of the two operand expressions.

### 13.13.1 Runtime Semantics: Evaluation

[LogicalANDExpression](#prod-LogicalANDExpression) : [LogicalANDExpression](#prod-LogicalANDExpression) && [BitwiseORExpression](#prod-BitwiseORExpression)

1.  Let `lRef` be ? [Evaluation](#sec-evaluation) of [LogicalANDExpression](#prod-LogicalANDExpression).
2.  Let `lVal` be ? [GetValue](#sec-getvalue)(`lRef`).
3.  If [ToBoolean](#sec-toboolean)(`lVal`) is false, return `lVal`.
4.  Let `rRef` be ? [Evaluation](#sec-evaluation) of [BitwiseORExpression](#prod-BitwiseORExpression).
5.  Return ? [GetValue](#sec-getvalue)(`rRef`).

[LogicalORExpression](#prod-LogicalORExpression) : [LogicalORExpression](#prod-LogicalORExpression) \|\| [LogicalANDExpression](#prod-LogicalANDExpression)

1.  Let `lRef` be ? [Evaluation](#sec-evaluation) of [LogicalORExpression](#prod-LogicalORExpression).
2.  Let `lVal` be ? [GetValue](#sec-getvalue)(`lRef`).
3.  If [ToBoolean](#sec-toboolean)(`lVal`) is true, return `lVal`.
4.  Let `rRef` be ? [Evaluation](#sec-evaluation) of [LogicalANDExpression](#prod-LogicalANDExpression).
5.  Return ? [GetValue](#sec-getvalue)(`rRef`).

[CoalesceExpression](#prod-CoalesceExpression) : [CoalesceExpressionHead](#prod-CoalesceExpressionHead) ?? [BitwiseORExpression](#prod-BitwiseORExpression)

1.  Let `lRef` be ? [Evaluation](#sec-evaluation) of [CoalesceExpressionHead](#prod-CoalesceExpressionHead).
2.  Let `lVal` be ? [GetValue](#sec-getvalue)(`lRef`).
3.  If `lVal` is either undefined or null, then
    1.  Let `rRef` be ? [Evaluation](#sec-evaluation) of [BitwiseORExpression](#prod-BitwiseORExpression).
    2.  Return ? [GetValue](#sec-getvalue)(`rRef`).
4.  Else,
    1.  Return `lVal`.

## 13.14 Conditional Operator ( `? :` )

### Syntax

[ConditionalExpression](#prod-ConditionalExpression)\[In, Yield, Await\] : [ShortCircuitExpression](#prod-ShortCircuitExpression)\[?In, ?Yield, ?Await\] [ShortCircuitExpression](#prod-ShortCircuitExpression)\[?In, ?Yield, ?Await\] ? [AssignmentExpression](#prod-AssignmentExpression)\[+In, ?Yield, ?Await\] : [AssignmentExpression](#prod-AssignmentExpression)\[?In, ?Yield, ?Await\] Note

The grammar for a [ConditionalExpression](#prod-ConditionalExpression) in ECMAScript is slightly different from that in C and Java, which each allow the second subexpression to be an [Expression](#prod-Expression) but restrict the third expression to be a [ConditionalExpression](#prod-ConditionalExpression). The motivation for this difference in ECMAScript is to allow an assignment expression to be governed by either arm of a conditional and to eliminate the confusing and fairly useless case of a comma expression as the centre expression.

### 13.14.1 Runtime Semantics: Evaluation

[ConditionalExpression](#prod-ConditionalExpression) : [ShortCircuitExpression](#prod-ShortCircuitExpression) ? [AssignmentExpression](#prod-AssignmentExpression) : [AssignmentExpression](#prod-AssignmentExpression)

1.  Let `lRef` be ? [Evaluation](#sec-evaluation) of [ShortCircuitExpression](#prod-ShortCircuitExpression).
2.  Let `lVal` be [ToBoolean](#sec-toboolean)(? [GetValue](#sec-getvalue)(`lRef`)).
3.  If `lVal` is true, then
    1.  Let `trueRef` be ? [Evaluation](#sec-evaluation) of the first [AssignmentExpression](#prod-AssignmentExpression).
    2.  Return ? [GetValue](#sec-getvalue)(`trueRef`).
4.  Else,
    1.  Let `falseRef` be ? [Evaluation](#sec-evaluation) of the second [AssignmentExpression](#prod-AssignmentExpression).
    2.  Return ? [GetValue](#sec-getvalue)(`falseRef`).

## 13.15 Assignment Operators

### Syntax

[AssignmentExpression](#prod-AssignmentExpression)\[In, Yield, Await\] : [ConditionalExpression](#prod-ConditionalExpression)\[?In, ?Yield, ?Await\] \[+Yield\] [YieldExpression](#prod-YieldExpression)\[?In, ?Await\] [ArrowFunction](#prod-ArrowFunction)\[?In, ?Yield, ?Await\] [AsyncArrowFunction](#prod-AsyncArrowFunction)\[?In, ?Yield, ?Await\] [LeftHandSideExpression](#prod-LeftHandSideExpression)\[?Yield, ?Await\] = [AssignmentExpression](#prod-AssignmentExpression)\[?In, ?Yield, ?Await\] [LeftHandSideExpression](#prod-LeftHandSideExpression)\[?Yield, ?Await\] [AssignmentOperator](#prod-AssignmentOperator) [AssignmentExpression](#prod-AssignmentExpression)\[?In, ?Yield, ?Await\] [LeftHandSideExpression](#prod-LeftHandSideExpression)\[?Yield, ?Await\] &&= [AssignmentExpression](#prod-AssignmentExpression)\[?In, ?Yield, ?Await\] [LeftHandSideExpression](#prod-LeftHandSideExpression)\[?Yield, ?Await\] \|\|= [AssignmentExpression](#prod-AssignmentExpression)\[?In, ?Yield, ?Await\] [LeftHandSideExpression](#prod-LeftHandSideExpression)\[?Yield, ?Await\] ??= [AssignmentExpression](#prod-AssignmentExpression)\[?In, ?Yield, ?Await\] [AssignmentOperator](#prod-AssignmentOperator) : one of \*= /= %= += -= \<\<= \>\>= \>\>\>= &= ^= \|= \*\*=

### 13.15.1 Static Semantics: Early Errors

[AssignmentExpression](#prod-AssignmentExpression) : [LeftHandSideExpression](#prod-LeftHandSideExpression) = [AssignmentExpression](#prod-AssignmentExpression)

- If [LeftHandSideExpression](#prod-LeftHandSideExpression) is either an [ObjectLiteral](#prod-ObjectLiteral) or an [ArrayLiteral](#prod-ArrayLiteral), [LeftHandSideExpression](#prod-LeftHandSideExpression) [must cover](#must-cover) an [AssignmentPattern](#prod-AssignmentPattern).
- If [LeftHandSideExpression](#prod-LeftHandSideExpression) is neither an [ObjectLiteral](#prod-ObjectLiteral) nor an [ArrayLiteral](#prod-ArrayLiteral), it is a Syntax Error if the [AssignmentTargetType](#sec-static-semantics-assignmenttargettype) of [LeftHandSideExpression](#prod-LeftHandSideExpression) is not simple.

[AssignmentExpression](#prod-AssignmentExpression) : [LeftHandSideExpression](#prod-LeftHandSideExpression) [AssignmentOperator](#prod-AssignmentOperator) [AssignmentExpression](#prod-AssignmentExpression) [LeftHandSideExpression](#prod-LeftHandSideExpression) &&= [AssignmentExpression](#prod-AssignmentExpression) [LeftHandSideExpression](#prod-LeftHandSideExpression) \|\|= [AssignmentExpression](#prod-AssignmentExpression) [LeftHandSideExpression](#prod-LeftHandSideExpression) ??= [AssignmentExpression](#prod-AssignmentExpression)

- It is a Syntax Error if the [AssignmentTargetType](#sec-static-semantics-assignmenttargettype) of [LeftHandSideExpression](#prod-LeftHandSideExpression) is not simple.

### 13.15.2 Runtime Semantics: Evaluation

[AssignmentExpression](#prod-AssignmentExpression) : [LeftHandSideExpression](#prod-LeftHandSideExpression) = [AssignmentExpression](#prod-AssignmentExpression)

1.  If [LeftHandSideExpression](#prod-LeftHandSideExpression) is neither an [ObjectLiteral](#prod-ObjectLiteral) nor an [ArrayLiteral](#prod-ArrayLiteral), then
    1.  Let `lRef` be ? [Evaluation](#sec-evaluation) of [LeftHandSideExpression](#prod-LeftHandSideExpression).
    2.  If [IsAnonymousFunctionDefinition](#sec-isanonymousfunctiondefinition)([AssignmentExpression](#prod-AssignmentExpression)) is true and [IsIdentifierRef](#sec-static-semantics-isidentifierref) of [LeftHandSideExpression](#prod-LeftHandSideExpression) is true, then
        1.  Let `lhs` be the [StringValue](#sec-static-semantics-stringvalue) of [LeftHandSideExpression](#prod-LeftHandSideExpression).
        2.  Let `rVal` be ? [NamedEvaluation](#sec-runtime-semantics-namedevaluation) of [AssignmentExpression](#prod-AssignmentExpression) with argument `lhs`.
    3.  Else,
        1.  Let `rRef` be ? [Evaluation](#sec-evaluation) of [AssignmentExpression](#prod-AssignmentExpression).
        2.  Let `rVal` be ? [GetValue](#sec-getvalue)(`rRef`).
    4.  Perform ? [PutValue](#sec-putvalue)(`lRef`, `rVal`).
    5.  Return `rVal`.
2.  Let `assignmentPattern` be the [AssignmentPattern](#prod-AssignmentPattern) that is [covered](#sec-syntactic-grammar) by [LeftHandSideExpression](#prod-LeftHandSideExpression).
3.  Let `rRef` be ? [Evaluation](#sec-evaluation) of [AssignmentExpression](#prod-AssignmentExpression).
4.  Let `rVal` be ? [GetValue](#sec-getvalue)(`rRef`).
5.  Perform ? [DestructuringAssignmentEvaluation](#sec-runtime-semantics-destructuringassignmentevaluation) of `assignmentPattern` with argument `rVal`.
6.  Return `rVal`.

[AssignmentExpression](#prod-AssignmentExpression) : [LeftHandSideExpression](#prod-LeftHandSideExpression) [AssignmentOperator](#prod-AssignmentOperator) [AssignmentExpression](#prod-AssignmentExpression)

1.  Let `lRef` be ? [Evaluation](#sec-evaluation) of [LeftHandSideExpression](#prod-LeftHandSideExpression).
2.  Let `lVal` be ? [GetValue](#sec-getvalue)(`lRef`).
3.  Let `rRef` be ? [Evaluation](#sec-evaluation) of [AssignmentExpression](#prod-AssignmentExpression).
4.  Let `rVal` be ? [GetValue](#sec-getvalue)(`rRef`).
5.  Let `assignmentOpText` be the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) [AssignmentOperator](#prod-AssignmentOperator).
6.  Let `opText` be the sequence of Unicode code points associated with `assignmentOpText` in the following table:
    | `assignmentOpText` | `opText` |
    |--------------------|----------|
    | `**=`              | `**`     |
    | `*=`               | `*`      |
    | `/=`               | `/`      |
    | `%=`               | `%`      |
    | `+=`               | `+`      |
    | `-=`               | `-`      |
    | `<<=`              | `<<`     |
    | `>>=`              | `>>`     |
    | `>>>=`             | `>>>`    |
    | `&=`               | `&`      |
    | `^=`               | `^`      |
    | `|=`               | `|`      |
7.  Let `r` be ? [ApplyStringOrNumericBinaryOperator](#sec-applystringornumericbinaryoperator)(`lVal`, `opText`, `rVal`).
8.  Perform ? [PutValue](#sec-putvalue)(`lRef`, `r`).
9.  Return `r`.

[AssignmentExpression](#prod-AssignmentExpression) : [LeftHandSideExpression](#prod-LeftHandSideExpression) &&= [AssignmentExpression](#prod-AssignmentExpression)

1.  Let `lRef` be ? [Evaluation](#sec-evaluation) of [LeftHandSideExpression](#prod-LeftHandSideExpression).
2.  Let `lVal` be ? [GetValue](#sec-getvalue)(`lRef`).
3.  If [ToBoolean](#sec-toboolean)(`lVal`) is false, return `lVal`.
4.  If [IsAnonymousFunctionDefinition](#sec-isanonymousfunctiondefinition)([AssignmentExpression](#prod-AssignmentExpression)) is true and [IsIdentifierRef](#sec-static-semantics-isidentifierref) of [LeftHandSideExpression](#prod-LeftHandSideExpression) is true, then
    1.  Let `lhs` be the [StringValue](#sec-static-semantics-stringvalue) of [LeftHandSideExpression](#prod-LeftHandSideExpression).
    2.  Let `rVal` be ? [NamedEvaluation](#sec-runtime-semantics-namedevaluation) of [AssignmentExpression](#prod-AssignmentExpression) with argument `lhs`.
5.  Else,
    1.  Let `rRef` be ? [Evaluation](#sec-evaluation) of [AssignmentExpression](#prod-AssignmentExpression).
    2.  Let `rVal` be ? [GetValue](#sec-getvalue)(`rRef`).
6.  Perform ? [PutValue](#sec-putvalue)(`lRef`, `rVal`).
7.  Return `rVal`.

[AssignmentExpression](#prod-AssignmentExpression) : [LeftHandSideExpression](#prod-LeftHandSideExpression) \|\|= [AssignmentExpression](#prod-AssignmentExpression)

1.  Let `lRef` be ? [Evaluation](#sec-evaluation) of [LeftHandSideExpression](#prod-LeftHandSideExpression).
2.  Let `lVal` be ? [GetValue](#sec-getvalue)(`lRef`).
3.  If [ToBoolean](#sec-toboolean)(`lVal`) is true, return `lVal`.
4.  If [IsAnonymousFunctionDefinition](#sec-isanonymousfunctiondefinition)([AssignmentExpression](#prod-AssignmentExpression)) is true and [IsIdentifierRef](#sec-static-semantics-isidentifierref) of [LeftHandSideExpression](#prod-LeftHandSideExpression) is true, then
    1.  Let `lhs` be the [StringValue](#sec-static-semantics-stringvalue) of [LeftHandSideExpression](#prod-LeftHandSideExpression).
    2.  Let `rVal` be ? [NamedEvaluation](#sec-runtime-semantics-namedevaluation) of [AssignmentExpression](#prod-AssignmentExpression) with argument `lhs`.
5.  Else,
    1.  Let `rRef` be ? [Evaluation](#sec-evaluation) of [AssignmentExpression](#prod-AssignmentExpression).
    2.  Let `rVal` be ? [GetValue](#sec-getvalue)(`rRef`).
6.  Perform ? [PutValue](#sec-putvalue)(`lRef`, `rVal`).
7.  Return `rVal`.

[AssignmentExpression](#prod-AssignmentExpression) : [LeftHandSideExpression](#prod-LeftHandSideExpression) ??= [AssignmentExpression](#prod-AssignmentExpression)

1.  Let `lRef` be ? [Evaluation](#sec-evaluation) of [LeftHandSideExpression](#prod-LeftHandSideExpression).
2.  Let `lVal` be ? [GetValue](#sec-getvalue)(`lRef`).
3.  If `lVal` is neither undefined nor null, return `lVal`.
4.  If [IsAnonymousFunctionDefinition](#sec-isanonymousfunctiondefinition)([AssignmentExpression](#prod-AssignmentExpression)) is true and [IsIdentifierRef](#sec-static-semantics-isidentifierref) of [LeftHandSideExpression](#prod-LeftHandSideExpression) is true, then
    1.  Let `lhs` be the [StringValue](#sec-static-semantics-stringvalue) of [LeftHandSideExpression](#prod-LeftHandSideExpression).
    2.  Let `rVal` be ? [NamedEvaluation](#sec-runtime-semantics-namedevaluation) of [AssignmentExpression](#prod-AssignmentExpression) with argument `lhs`.
5.  Else,
    1.  Let `rRef` be ? [Evaluation](#sec-evaluation) of [AssignmentExpression](#prod-AssignmentExpression).
    2.  Let `rVal` be ? [GetValue](#sec-getvalue)(`rRef`).
6.  Perform ? [PutValue](#sec-putvalue)(`lRef`, `rVal`).
7.  Return `rVal`.

Note

When this expression occurs within [strict mode code](#sec-strict-mode-code), it is a runtime error if `lRef` in step [1.d](#step-assignmentexpression-evaluation-simple-putvalue), [2](#step-assignmentexpression-evaluation-compound-getvalue), [2](#step-assignmentexpression-evaluation-lgcl-and-getvalue), [2](#step-assignmentexpression-evaluation-lgcl-or-getvalue), [2](#step-assignmentexpression-evaluation-lgcl-nullish-getvalue) is an unresolvable reference. If it is, a ReferenceError exception is thrown. Additionally, it is a runtime error if the `lRef` in step [8](#step-assignmentexpression-evaluation-compound-putvalue), [6](#step-assignmentexpression-evaluation-lgcl-and-putvalue), [6](#step-assignmentexpression-evaluation-lgcl-or-putvalue), [6](#step-assignmentexpression-evaluation-lgcl-nullish-putvalue) is a reference to a [data property](#sec-object-type) with the attribute value { `[[Writable]]`: false }, to an [accessor property](#sec-object-type) with the attribute value { `[[Set]]`: undefined }, or to a non-existent property of an object for which the [IsExtensible](#sec-isextensible-o) predicate returns the value false. In these cases a TypeError exception is thrown.

### 13.15.3 ApplyStringOrNumericBinaryOperator ( `lVal`, `opText`, `rVal` )

The abstract operation ApplyStringOrNumericBinaryOperator takes arguments `lVal` (an [ECMAScript language value](#sec-ecmascript-language-types)), `opText` (`**`, `*`, `/`, `%`, `+`, `-`, `<<`, `>>`, `>>>`, `&`, `^`, or `|`), and `rVal` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) either a String, a BigInt, or a Number, or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  If `opText` is `+`, then
    1.  Let `lPrim` be ? [ToPrimitive](#sec-toprimitive)(`lVal`).
    2.  Let `rPrim` be ? [ToPrimitive](#sec-toprimitive)(`rVal`).
    3.  If `lPrim` [is a String](#sec-ecmascript-language-types-string-type) or `rPrim` [is a String](#sec-ecmascript-language-types-string-type), then
        1.  Let `lStr` be ? [ToString](#sec-tostring)(`lPrim`).
        2.  Let `rStr` be ? [ToString](#sec-tostring)(`rPrim`).
        3.  Return the [string-concatenation](#string-concatenation) of `lStr` and `rStr`.
    4.  Set `lVal` to `lPrim`.
    5.  Set `rVal` to `rPrim`.
2.  NOTE: At this point, it must be a numeric operation.
3.  Let `lNum` be ? [ToNumeric](#sec-tonumeric)(`lVal`).
4.  Let `rNum` be ? [ToNumeric](#sec-tonumeric)(`rVal`).
5.  If [SameType](#sec-sametype)(`lNum`, `rNum`) is false, throw a TypeError exception.
6.  If `lNum` [is a BigInt](#sec-ecmascript-language-types-bigint-type), then
    1.  If `opText` is `**`, return ? [BigInt::exponentiate](#sec-numeric-types-bigint-exponentiate)(`lNum`, `rNum`).
    2.  If `opText` is `/`, return ? [BigInt::divide](#sec-numeric-types-bigint-divide)(`lNum`, `rNum`).
    3.  If `opText` is `%`, return ? [BigInt::remainder](#sec-numeric-types-bigint-remainder)(`lNum`, `rNum`).
    4.  If `opText` is `>>>`, return ? [BigInt::unsignedRightShift](#sec-numeric-types-bigint-unsignedRightShift)(`lNum`, `rNum`).
    5.  Let `operation` be the abstract operation associated with `opText` in the following table:
        | `opText` | `operation` |
        |----|----|
        | `*` | [BigInt::multiply](#sec-numeric-types-bigint-multiply) |
        | `+` | [BigInt::add](#sec-numeric-types-bigint-add) |
        | `-` | [BigInt::subtract](#sec-numeric-types-bigint-subtract) |
        | `<<` | [BigInt::leftShift](#sec-numeric-types-bigint-leftShift) |
        | `>>` | [BigInt::signedRightShift](#sec-numeric-types-bigint-signedRightShift) |
        | `&` | [BigInt::bitwiseAND](#sec-numeric-types-bigint-bitwiseAND) |
        | `^` | [BigInt::bitwiseXOR](#sec-numeric-types-bigint-bitwiseXOR) |
        | `|` | [BigInt::bitwiseOR](#sec-numeric-types-bigint-bitwiseOR) |
7.  Else,
    1.  [Assert](#assert): `lNum` [is a Number](#sec-ecmascript-language-types-number-type).
    2.  Let `operation` be the abstract operation associated with `opText` in the following table:
        | `opText` | `operation` |
        |----|----|
        | `**` | [Number::exponentiate](#sec-numeric-types-number-exponentiate) |
        | `*` | [Number::multiply](#sec-numeric-types-number-multiply) |
        | `/` | [Number::divide](#sec-numeric-types-number-divide) |
        | `%` | [Number::remainder](#sec-numeric-types-number-remainder) |
        | `+` | [Number::add](#sec-numeric-types-number-add) |
        | `-` | [Number::subtract](#sec-numeric-types-number-subtract) |
        | `<<` | [Number::leftShift](#sec-numeric-types-number-leftShift) |
        | `>>` | [Number::signedRightShift](#sec-numeric-types-number-signedRightShift) |
        | `>>>` | [Number::unsignedRightShift](#sec-numeric-types-number-unsignedRightShift) |
        | `&` | [Number::bitwiseAND](#sec-numeric-types-number-bitwiseAND) |
        | `^` | [Number::bitwiseXOR](#sec-numeric-types-number-bitwiseXOR) |
        | `|` | [Number::bitwiseOR](#sec-numeric-types-number-bitwiseOR) |
8.  Return `operation`(`lNum`, `rNum`).

Note 1

No hint is provided in the calls to [ToPrimitive](#sec-toprimitive) in steps [1.a](#step-binary-op-toprimitive-lval) and [1.b](#step-binary-op-toprimitive-rval). All standard objects except Dates handle the absence of a hint as if number were given; Dates handle the absence of a hint as if string were given. [Exotic objects](#exotic-object) may handle the absence of a hint in some other manner.

Note 2

Step [1.c](#step-binary-op-string-check) differs from step [3](#step-arc-string-check) of the [IsLessThan](#sec-islessthan) algorithm, by using the logical-or operation instead of the logical-and operation.

### 13.15.4 EvaluateStringOrNumericBinaryExpression ( `leftOperand`, `opText`, `rightOperand` )

The abstract operation EvaluateStringOrNumericBinaryExpression takes arguments `leftOperand` (a [Parse Node](#sec-syntactic-grammar)), `opText` (a sequence of Unicode code points), and `rightOperand` (a [Parse Node](#sec-syntactic-grammar)) and returns either a [normal completion containing](#sec-completion-record-specification-type) either a String, a BigInt, or a Number, or an [abrupt completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `lRef` be ? [Evaluation](#sec-evaluation) of `leftOperand`.
2.  Let `lVal` be ? [GetValue](#sec-getvalue)(`lRef`).
3.  Let `rRef` be ? [Evaluation](#sec-evaluation) of `rightOperand`.
4.  Let `rVal` be ? [GetValue](#sec-getvalue)(`rRef`).
5.  Return ? [ApplyStringOrNumericBinaryOperator](#sec-applystringornumericbinaryoperator)(`lVal`, `opText`, `rVal`).

### 13.15.5 Destructuring Assignment

#### Supplemental Syntax

In certain circumstances when processing an instance of the production  
[AssignmentExpression](#prod-AssignmentExpression) : [LeftHandSideExpression](#prod-LeftHandSideExpression) = [AssignmentExpression](#prod-AssignmentExpression)  
the interpretation of [LeftHandSideExpression](#prod-LeftHandSideExpression) is refined using the following grammar:

[AssignmentPattern](#prod-AssignmentPattern)\[Yield, Await\] : [ObjectAssignmentPattern](#prod-ObjectAssignmentPattern)\[?Yield, ?Await\] [ArrayAssignmentPattern](#prod-ArrayAssignmentPattern)\[?Yield, ?Await\] [ObjectAssignmentPattern](#prod-ObjectAssignmentPattern)\[Yield, Await\] : { } { [AssignmentRestProperty](#prod-AssignmentRestProperty)\[?Yield, ?Await\] } { [AssignmentPropertyList](#prod-AssignmentPropertyList)\[?Yield, ?Await\] } { [AssignmentPropertyList](#prod-AssignmentPropertyList)\[?Yield, ?Await\] , [AssignmentRestProperty](#prod-AssignmentRestProperty)\[?Yield, ?Await\]opt } [ArrayAssignmentPattern](#prod-ArrayAssignmentPattern)\[Yield, Await\] : \[ [Elision](#prod-Elision)opt [AssignmentRestElement](#prod-AssignmentRestElement)\[?Yield, ?Await\]opt \] \[ [AssignmentElementList](#prod-AssignmentElementList)\[?Yield, ?Await\] \] \[ [AssignmentElementList](#prod-AssignmentElementList)\[?Yield, ?Await\] , [Elision](#prod-Elision)opt [AssignmentRestElement](#prod-AssignmentRestElement)\[?Yield, ?Await\]opt \] [AssignmentRestProperty](#prod-AssignmentRestProperty)\[Yield, Await\] : ... [DestructuringAssignmentTarget](#prod-DestructuringAssignmentTarget)\[?Yield, ?Await\] [AssignmentPropertyList](#prod-AssignmentPropertyList)\[Yield, Await\] : [AssignmentProperty](#prod-AssignmentProperty)\[?Yield, ?Await\] [AssignmentPropertyList](#prod-AssignmentPropertyList)\[?Yield, ?Await\] , [AssignmentProperty](#prod-AssignmentProperty)\[?Yield, ?Await\] [AssignmentElementList](#prod-AssignmentElementList)\[Yield, Await\] : [AssignmentElisionElement](#prod-AssignmentElisionElement)\[?Yield, ?Await\] [AssignmentElementList](#prod-AssignmentElementList)\[?Yield, ?Await\] , [AssignmentElisionElement](#prod-AssignmentElisionElement)\[?Yield, ?Await\] [AssignmentElisionElement](#prod-AssignmentElisionElement)\[Yield, Await\] : [Elision](#prod-Elision)opt [AssignmentElement](#prod-AssignmentElement)\[?Yield, ?Await\] [AssignmentProperty](#prod-AssignmentProperty)\[Yield, Await\] : [IdentifierReference](#prod-IdentifierReference)\[?Yield, ?Await\] [Initializer](#prod-Initializer)\[+In, ?Yield, ?Await\]opt [PropertyName](#prod-PropertyName)\[?Yield, ?Await\] : [AssignmentElement](#prod-AssignmentElement)\[?Yield, ?Await\] [AssignmentElement](#prod-AssignmentElement)\[Yield, Await\] : [DestructuringAssignmentTarget](#prod-DestructuringAssignmentTarget)\[?Yield, ?Await\] [Initializer](#prod-Initializer)\[+In, ?Yield, ?Await\]opt [AssignmentRestElement](#prod-AssignmentRestElement)\[Yield, Await\] : ... [DestructuringAssignmentTarget](#prod-DestructuringAssignmentTarget)\[?Yield, ?Await\] [DestructuringAssignmentTarget](#prod-DestructuringAssignmentTarget)\[Yield, Await\] : [LeftHandSideExpression](#prod-LeftHandSideExpression)\[?Yield, ?Await\]

#### 13.15.5.1 Static Semantics: Early Errors

[AssignmentProperty](#prod-AssignmentProperty) : [IdentifierReference](#prod-IdentifierReference) [Initializer](#prod-Initializer)opt

- It is a Syntax Error if the [AssignmentTargetType](#sec-static-semantics-assignmenttargettype) of [IdentifierReference](#prod-IdentifierReference) is not simple.

[AssignmentRestProperty](#prod-AssignmentRestProperty) : ... [DestructuringAssignmentTarget](#prod-DestructuringAssignmentTarget)

- It is a Syntax Error if [DestructuringAssignmentTarget](#prod-DestructuringAssignmentTarget) is either an [ArrayLiteral](#prod-ArrayLiteral) or an [ObjectLiteral](#prod-ObjectLiteral).

[DestructuringAssignmentTarget](#prod-DestructuringAssignmentTarget) : [LeftHandSideExpression](#prod-LeftHandSideExpression)

- If [LeftHandSideExpression](#prod-LeftHandSideExpression) is either an [ObjectLiteral](#prod-ObjectLiteral) or an [ArrayLiteral](#prod-ArrayLiteral), [LeftHandSideExpression](#prod-LeftHandSideExpression) [must cover](#must-cover) an [AssignmentPattern](#prod-AssignmentPattern).
- If [LeftHandSideExpression](#prod-LeftHandSideExpression) is neither an [ObjectLiteral](#prod-ObjectLiteral) nor an [ArrayLiteral](#prod-ArrayLiteral), it is a Syntax Error if the [AssignmentTargetType](#sec-static-semantics-assignmenttargettype) of [LeftHandSideExpression](#prod-LeftHandSideExpression) is not simple.

#### 13.15.5.2 Runtime Semantics: DestructuringAssignmentEvaluation

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) DestructuringAssignmentEvaluation takes argument `value` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or an [abrupt completion](#sec-completion-record-specification-type). It is defined piecewise over the following productions:

[ObjectAssignmentPattern](#prod-ObjectAssignmentPattern) : { }

1.  Perform ? [RequireObjectCoercible](#sec-requireobjectcoercible)(`value`).
2.  Return unused.

[ObjectAssignmentPattern](#prod-ObjectAssignmentPattern) : { [AssignmentPropertyList](#prod-AssignmentPropertyList) } { [AssignmentPropertyList](#prod-AssignmentPropertyList) , }

1.  Perform ? [RequireObjectCoercible](#sec-requireobjectcoercible)(`value`).
2.  Perform ? [PropertyDestructuringAssignmentEvaluation](#sec-runtime-semantics-propertydestructuringassignmentevaluation) of [AssignmentPropertyList](#prod-AssignmentPropertyList) with argument `value`.
3.  Return unused.

[ObjectAssignmentPattern](#prod-ObjectAssignmentPattern) : { [AssignmentRestProperty](#prod-AssignmentRestProperty) }

1.  Perform ? [RequireObjectCoercible](#sec-requireobjectcoercible)(`value`).
2.  Let `excludedNames` be a new empty [List](#sec-list-and-record-specification-type).
3.  Return ? [RestDestructuringAssignmentEvaluation](#sec-runtime-semantics-restdestructuringassignmentevaluation) of [AssignmentRestProperty](#prod-AssignmentRestProperty) with arguments `value` and `excludedNames`.

[ObjectAssignmentPattern](#prod-ObjectAssignmentPattern) : { [AssignmentPropertyList](#prod-AssignmentPropertyList) , [AssignmentRestProperty](#prod-AssignmentRestProperty) }

1.  Perform ? [RequireObjectCoercible](#sec-requireobjectcoercible)(`value`).
2.  Let `excludedNames` be ? [PropertyDestructuringAssignmentEvaluation](#sec-runtime-semantics-propertydestructuringassignmentevaluation) of [AssignmentPropertyList](#prod-AssignmentPropertyList) with argument `value`.
3.  Return ? [RestDestructuringAssignmentEvaluation](#sec-runtime-semantics-restdestructuringassignmentevaluation) of [AssignmentRestProperty](#prod-AssignmentRestProperty) with arguments `value` and `excludedNames`.

[ArrayAssignmentPattern](#prod-ArrayAssignmentPattern) : \[ \]

1.  Let `iteratorRecord` be ? [GetIterator](#sec-getiterator)(`value`, sync).
2.  Return ? [IteratorClose](#sec-iteratorclose)(`iteratorRecord`, [NormalCompletion](#sec-normalcompletion)(unused)).

[ArrayAssignmentPattern](#prod-ArrayAssignmentPattern) : \[ [Elision](#prod-Elision) \]

1.  Let `iteratorRecord` be ? [GetIterator](#sec-getiterator)(`value`, sync).
2.  Let `result` be [Completion](#sec-completion-ao)([IteratorDestructuringAssignmentEvaluation](#sec-runtime-semantics-iteratordestructuringassignmentevaluation) of [Elision](#prod-Elision) with argument `iteratorRecord`).
3.  If `iteratorRecord`.`[[Done]]` is false, return ? [IteratorClose](#sec-iteratorclose)(`iteratorRecord`, `result`).
4.  Return `result`.

[ArrayAssignmentPattern](#prod-ArrayAssignmentPattern) : \[ [Elision](#prod-Elision)opt [AssignmentRestElement](#prod-AssignmentRestElement) \]

1.  Let `iteratorRecord` be ? [GetIterator](#sec-getiterator)(`value`, sync).
2.  If [Elision](#prod-Elision) is present, then
    1.  Let `status` be [Completion](#sec-completion-ao)([IteratorDestructuringAssignmentEvaluation](#sec-runtime-semantics-iteratordestructuringassignmentevaluation) of [Elision](#prod-Elision) with argument `iteratorRecord`).
    2.  If `status` is an [abrupt completion](#sec-completion-record-specification-type), then
        1.  [Assert](#assert): `iteratorRecord`.`[[Done]]` is true.
        2.  Return ? `status`.
3.  Let `result` be [Completion](#sec-completion-ao)([IteratorDestructuringAssignmentEvaluation](#sec-runtime-semantics-iteratordestructuringassignmentevaluation) of [AssignmentRestElement](#prod-AssignmentRestElement) with argument `iteratorRecord`).
4.  If `iteratorRecord`.`[[Done]]` is false, return ? [IteratorClose](#sec-iteratorclose)(`iteratorRecord`, `result`).
5.  Return `result`.

[ArrayAssignmentPattern](#prod-ArrayAssignmentPattern) : \[ [AssignmentElementList](#prod-AssignmentElementList) \]

1.  Let `iteratorRecord` be ? [GetIterator](#sec-getiterator)(`value`, sync).
2.  Let `result` be [Completion](#sec-completion-ao)([IteratorDestructuringAssignmentEvaluation](#sec-runtime-semantics-iteratordestructuringassignmentevaluation) of [AssignmentElementList](#prod-AssignmentElementList) with argument `iteratorRecord`).
3.  If `iteratorRecord`.`[[Done]]` is false, return ? [IteratorClose](#sec-iteratorclose)(`iteratorRecord`, `result`).
4.  Return `result`.

[ArrayAssignmentPattern](#prod-ArrayAssignmentPattern) : \[ [AssignmentElementList](#prod-AssignmentElementList) , [Elision](#prod-Elision)opt [AssignmentRestElement](#prod-AssignmentRestElement)opt \]

1.  Let `iteratorRecord` be ? [GetIterator](#sec-getiterator)(`value`, sync).
2.  Let `status` be [Completion](#sec-completion-ao)([IteratorDestructuringAssignmentEvaluation](#sec-runtime-semantics-iteratordestructuringassignmentevaluation) of [AssignmentElementList](#prod-AssignmentElementList) with argument `iteratorRecord`).
3.  If `status` is an [abrupt completion](#sec-completion-record-specification-type), then
    1.  If `iteratorRecord`.`[[Done]]` is false, return ? [IteratorClose](#sec-iteratorclose)(`iteratorRecord`, `status`).
    2.  Return ? `status`.
4.  If [Elision](#prod-Elision) is present, then
    1.  Set `status` to [Completion](#sec-completion-ao)([IteratorDestructuringAssignmentEvaluation](#sec-runtime-semantics-iteratordestructuringassignmentevaluation) of [Elision](#prod-Elision) with argument `iteratorRecord`).
    2.  If `status` is an [abrupt completion](#sec-completion-record-specification-type), then
        1.  [Assert](#assert): `iteratorRecord`.`[[Done]]` is true.
        2.  Return ? `status`.
5.  If [AssignmentRestElement](#prod-AssignmentRestElement) is present, then
    1.  Set `status` to [Completion](#sec-completion-ao)([IteratorDestructuringAssignmentEvaluation](#sec-runtime-semantics-iteratordestructuringassignmentevaluation) of [AssignmentRestElement](#prod-AssignmentRestElement) with argument `iteratorRecord`).
6.  If `iteratorRecord`.`[[Done]]` is false, return ? [IteratorClose](#sec-iteratorclose)(`iteratorRecord`, `status`).
7.  Return ? `status`.

#### 13.15.5.3 Runtime Semantics: PropertyDestructuringAssignmentEvaluation

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) PropertyDestructuringAssignmentEvaluation takes argument `value` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a [List](#sec-list-and-record-specification-type) of [property keys](#property-key) or an [abrupt completion](#sec-completion-record-specification-type). It collects a list of all destructured [property keys](#property-key). It is defined piecewise over the following productions:

[AssignmentPropertyList](#prod-AssignmentPropertyList) : [AssignmentPropertyList](#prod-AssignmentPropertyList) , [AssignmentProperty](#prod-AssignmentProperty)

1.  Let `propertyNames` be ? [PropertyDestructuringAssignmentEvaluation](#sec-runtime-semantics-propertydestructuringassignmentevaluation) of [AssignmentPropertyList](#prod-AssignmentPropertyList) with argument `value`.
2.  Let `nextNames` be ? [PropertyDestructuringAssignmentEvaluation](#sec-runtime-semantics-propertydestructuringassignmentevaluation) of [AssignmentProperty](#prod-AssignmentProperty) with argument `value`.
3.  Return the [list-concatenation](#list-concatenation) of `propertyNames` and `nextNames`.

[AssignmentProperty](#prod-AssignmentProperty) : [IdentifierReference](#prod-IdentifierReference) [Initializer](#prod-Initializer)opt

1.  Let `P` be the [StringValue](#sec-static-semantics-stringvalue) of [IdentifierReference](#prod-IdentifierReference).
2.  Let `lRef` be ? [ResolveBinding](#sec-resolvebinding)(`P`).
3.  Let `v` be ? [GetV](#sec-getv)(`value`, `P`).
4.  If [Initializer](#prod-Initializer) is present and `v` is undefined, then
    1.  If [IsAnonymousFunctionDefinition](#sec-isanonymousfunctiondefinition)([Initializer](#prod-Initializer)) is true, then
        1.  Set `v` to ? [NamedEvaluation](#sec-runtime-semantics-namedevaluation) of [Initializer](#prod-Initializer) with argument `P`.
    2.  Else,
        1.  Let `defaultValue` be ? [Evaluation](#sec-evaluation) of [Initializer](#prod-Initializer).
        2.  Set `v` to ? [GetValue](#sec-getvalue)(`defaultValue`).
5.  Perform ? [PutValue](#sec-putvalue)(`lRef`, `v`).
6.  Return « `P` ».

[AssignmentProperty](#prod-AssignmentProperty) : [PropertyName](#prod-PropertyName) : [AssignmentElement](#prod-AssignmentElement)

1.  Let `name` be ? [Evaluation](#sec-evaluation) of [PropertyName](#prod-PropertyName).
2.  Perform ? [KeyedDestructuringAssignmentEvaluation](#sec-runtime-semantics-keyeddestructuringassignmentevaluation) of [AssignmentElement](#prod-AssignmentElement) with arguments `value` and `name`.
3.  Return « `name` ».

#### 13.15.5.4 Runtime Semantics: RestDestructuringAssignmentEvaluation

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) RestDestructuringAssignmentEvaluation takes arguments `value` (an [ECMAScript language value](#sec-ecmascript-language-types)) and `excludedNames` (a [List](#sec-list-and-record-specification-type) of [property keys](#property-key)) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or an [abrupt completion](#sec-completion-record-specification-type). It is defined piecewise over the following productions:

[AssignmentRestProperty](#prod-AssignmentRestProperty) : ... [DestructuringAssignmentTarget](#prod-DestructuringAssignmentTarget)

1.  Let `lRef` be ? [Evaluation](#sec-evaluation) of [DestructuringAssignmentTarget](#prod-DestructuringAssignmentTarget).
2.  Let `restObj` be [OrdinaryObjectCreate](#sec-ordinaryobjectcreate)([%Object.prototype%](#sec-properties-of-the-object-prototype-object)).
3.  Perform ? [CopyDataProperties](#sec-copydataproperties)(`restObj`, `value`, `excludedNames`).
4.  Return ? [PutValue](#sec-putvalue)(`lRef`, `restObj`).

#### 13.15.5.5 Runtime Semantics: IteratorDestructuringAssignmentEvaluation

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) IteratorDestructuringAssignmentEvaluation takes argument `iteratorRecord` (an [Iterator Record](#sec-iterator-records)) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or an [abrupt completion](#sec-completion-record-specification-type). It is defined piecewise over the following productions:

[AssignmentElementList](#prod-AssignmentElementList) : [AssignmentElisionElement](#prod-AssignmentElisionElement)

1.  Return ? [IteratorDestructuringAssignmentEvaluation](#sec-runtime-semantics-iteratordestructuringassignmentevaluation) of [AssignmentElisionElement](#prod-AssignmentElisionElement) with argument `iteratorRecord`.

[AssignmentElementList](#prod-AssignmentElementList) : [AssignmentElementList](#prod-AssignmentElementList) , [AssignmentElisionElement](#prod-AssignmentElisionElement)

1.  Perform ? [IteratorDestructuringAssignmentEvaluation](#sec-runtime-semantics-iteratordestructuringassignmentevaluation) of [AssignmentElementList](#prod-AssignmentElementList) with argument `iteratorRecord`.
2.  Return ? [IteratorDestructuringAssignmentEvaluation](#sec-runtime-semantics-iteratordestructuringassignmentevaluation) of [AssignmentElisionElement](#prod-AssignmentElisionElement) with argument `iteratorRecord`.

[AssignmentElisionElement](#prod-AssignmentElisionElement) : [AssignmentElement](#prod-AssignmentElement)

1.  Return ? [IteratorDestructuringAssignmentEvaluation](#sec-runtime-semantics-iteratordestructuringassignmentevaluation) of [AssignmentElement](#prod-AssignmentElement) with argument `iteratorRecord`.

[AssignmentElisionElement](#prod-AssignmentElisionElement) : [Elision](#prod-Elision) [AssignmentElement](#prod-AssignmentElement)

1.  Perform ? [IteratorDestructuringAssignmentEvaluation](#sec-runtime-semantics-iteratordestructuringassignmentevaluation) of [Elision](#prod-Elision) with argument `iteratorRecord`.
2.  Return ? [IteratorDestructuringAssignmentEvaluation](#sec-runtime-semantics-iteratordestructuringassignmentevaluation) of [AssignmentElement](#prod-AssignmentElement) with argument `iteratorRecord`.

[Elision](#prod-Elision) : ,

1.  If `iteratorRecord`.`[[Done]]` is false, then
    1.  Perform ? [IteratorStep](#sec-iteratorstep)(`iteratorRecord`).
2.  Return unused.

[Elision](#prod-Elision) : [Elision](#prod-Elision) ,

1.  Perform ? [IteratorDestructuringAssignmentEvaluation](#sec-runtime-semantics-iteratordestructuringassignmentevaluation) of [Elision](#prod-Elision) with argument `iteratorRecord`.
2.  If `iteratorRecord`.`[[Done]]` is false, then
    1.  Perform ? [IteratorStep](#sec-iteratorstep)(`iteratorRecord`).
3.  Return unused.

[AssignmentElement](#prod-AssignmentElement) : [DestructuringAssignmentTarget](#prod-DestructuringAssignmentTarget) [Initializer](#prod-Initializer)opt

1.  If [DestructuringAssignmentTarget](#prod-DestructuringAssignmentTarget) is neither an [ObjectLiteral](#prod-ObjectLiteral) nor an [ArrayLiteral](#prod-ArrayLiteral), then
    1.  Let `lRef` be ? [Evaluation](#sec-evaluation) of [DestructuringAssignmentTarget](#prod-DestructuringAssignmentTarget).
2.  Let `value` be undefined.
3.  If `iteratorRecord`.`[[Done]]` is false, then
    1.  Let `next` be ? [IteratorStepValue](#sec-iteratorstepvalue)(`iteratorRecord`).
    2.  If `next` is not done, then
        1.  Set `value` to `next`.
4.  If [Initializer](#prod-Initializer) is present and `value` is undefined, then
    1.  If [IsAnonymousFunctionDefinition](#sec-isanonymousfunctiondefinition)([Initializer](#prod-Initializer)) is true and [IsIdentifierRef](#sec-static-semantics-isidentifierref) of [DestructuringAssignmentTarget](#prod-DestructuringAssignmentTarget) is true, then
        1.  Let `target` be the [StringValue](#sec-static-semantics-stringvalue) of [DestructuringAssignmentTarget](#prod-DestructuringAssignmentTarget).
        2.  Let `v` be ? [NamedEvaluation](#sec-runtime-semantics-namedevaluation) of [Initializer](#prod-Initializer) with argument `target`.
    2.  Else,
        1.  Let `defaultValue` be ? [Evaluation](#sec-evaluation) of [Initializer](#prod-Initializer).
        2.  Let `v` be ? [GetValue](#sec-getvalue)(`defaultValue`).
5.  Else,
    1.  Let `v` be `value`.
6.  If [DestructuringAssignmentTarget](#prod-DestructuringAssignmentTarget) is either an [ObjectLiteral](#prod-ObjectLiteral) or an [ArrayLiteral](#prod-ArrayLiteral), then
    1.  Let `nestedAssignmentPattern` be the [AssignmentPattern](#prod-AssignmentPattern) that is [covered](#sec-syntactic-grammar) by [DestructuringAssignmentTarget](#prod-DestructuringAssignmentTarget).
    2.  Return ? [DestructuringAssignmentEvaluation](#sec-runtime-semantics-destructuringassignmentevaluation) of `nestedAssignmentPattern` with argument `v`.
7.  Return ? [PutValue](#sec-putvalue)(`lRef`, `v`).

Note

Left to right evaluation order is maintained by evaluating a [DestructuringAssignmentTarget](#prod-DestructuringAssignmentTarget) that is not a destructuring pattern prior to accessing the [iterator](#sec-iterator-interface) or evaluating the [Initializer](#prod-Initializer).

[AssignmentRestElement](#prod-AssignmentRestElement) : ... [DestructuringAssignmentTarget](#prod-DestructuringAssignmentTarget)

1.  If [DestructuringAssignmentTarget](#prod-DestructuringAssignmentTarget) is neither an [ObjectLiteral](#prod-ObjectLiteral) nor an [ArrayLiteral](#prod-ArrayLiteral), then
    1.  Let `lRef` be ? [Evaluation](#sec-evaluation) of [DestructuringAssignmentTarget](#prod-DestructuringAssignmentTarget).
2.  Let `A` be ! [ArrayCreate](#sec-arraycreate)(0).
3.  Let `n` be 0.
4.  Repeat, while `iteratorRecord`.`[[Done]]` is false,
    1.  Let `next` be ? [IteratorStepValue](#sec-iteratorstepvalue)(`iteratorRecord`).
    2.  If `next` is not done, then
        1.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`A`, ! [ToString](#sec-tostring)([𝔽](#𝔽)(`n`)), `next`).
        2.  Set `n` to `n` + 1.
5.  If [DestructuringAssignmentTarget](#prod-DestructuringAssignmentTarget) is neither an [ObjectLiteral](#prod-ObjectLiteral) nor an [ArrayLiteral](#prod-ArrayLiteral), then
    1.  Return ? [PutValue](#sec-putvalue)(`lRef`, `A`).
6.  Let `nestedAssignmentPattern` be the [AssignmentPattern](#prod-AssignmentPattern) that is [covered](#sec-syntactic-grammar) by [DestructuringAssignmentTarget](#prod-DestructuringAssignmentTarget).
7.  Return ? [DestructuringAssignmentEvaluation](#sec-runtime-semantics-destructuringassignmentevaluation) of `nestedAssignmentPattern` with argument `A`.

#### 13.15.5.6 Runtime Semantics: KeyedDestructuringAssignmentEvaluation

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) KeyedDestructuringAssignmentEvaluation takes arguments `value` (an [ECMAScript language value](#sec-ecmascript-language-types)) and `propertyName` (a [property key](#property-key)) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or an [abrupt completion](#sec-completion-record-specification-type). It is defined piecewise over the following productions:

[AssignmentElement](#prod-AssignmentElement) : [DestructuringAssignmentTarget](#prod-DestructuringAssignmentTarget) [Initializer](#prod-Initializer)opt

1.  If [DestructuringAssignmentTarget](#prod-DestructuringAssignmentTarget) is neither an [ObjectLiteral](#prod-ObjectLiteral) nor an [ArrayLiteral](#prod-ArrayLiteral), then
    1.  Let `lRef` be ? [Evaluation](#sec-evaluation) of [DestructuringAssignmentTarget](#prod-DestructuringAssignmentTarget).
2.  Let `v` be ? [GetV](#sec-getv)(`value`, `propertyName`).
3.  If [Initializer](#prod-Initializer) is present and `v` is undefined, then
    1.  If [IsAnonymousFunctionDefinition](#sec-isanonymousfunctiondefinition)([Initializer](#prod-Initializer)) is true and [IsIdentifierRef](#sec-static-semantics-isidentifierref) of [DestructuringAssignmentTarget](#prod-DestructuringAssignmentTarget) is true, then
        1.  Let `target` be the [StringValue](#sec-static-semantics-stringvalue) of [DestructuringAssignmentTarget](#prod-DestructuringAssignmentTarget).
        2.  Let `rhsValue` be ? [NamedEvaluation](#sec-runtime-semantics-namedevaluation) of [Initializer](#prod-Initializer) with argument `target`.
    2.  Else,
        1.  Let `defaultValue` be ? [Evaluation](#sec-evaluation) of [Initializer](#prod-Initializer).
        2.  Let `rhsValue` be ? [GetValue](#sec-getvalue)(`defaultValue`).
4.  Else,
    1.  Let `rhsValue` be `v`.
5.  If [DestructuringAssignmentTarget](#prod-DestructuringAssignmentTarget) is either an [ObjectLiteral](#prod-ObjectLiteral) or an [ArrayLiteral](#prod-ArrayLiteral), then
    1.  Let `assignmentPattern` be the [AssignmentPattern](#prod-AssignmentPattern) that is [covered](#sec-syntactic-grammar) by [DestructuringAssignmentTarget](#prod-DestructuringAssignmentTarget).
    2.  Return ? [DestructuringAssignmentEvaluation](#sec-runtime-semantics-destructuringassignmentevaluation) of `assignmentPattern` with argument `rhsValue`.
6.  Return ? [PutValue](#sec-putvalue)(`lRef`, `rhsValue`).

## 13.16 Comma Operator ( `,` )

### Syntax

[Expression](#prod-Expression)\[In, Yield, Await\] : [AssignmentExpression](#prod-AssignmentExpression)\[?In, ?Yield, ?Await\] [Expression](#prod-Expression)\[?In, ?Yield, ?Await\] , [AssignmentExpression](#prod-AssignmentExpression)\[?In, ?Yield, ?Await\]

### 13.16.1 Runtime Semantics: Evaluation

[Expression](#prod-Expression) : [Expression](#prod-Expression) , [AssignmentExpression](#prod-AssignmentExpression)

1.  Let `lRef` be ? [Evaluation](#sec-evaluation) of [Expression](#prod-Expression).
2.  Perform ? [GetValue](#sec-getvalue)(`lRef`).
3.  Let `rRef` be ? [Evaluation](#sec-evaluation) of [AssignmentExpression](#prod-AssignmentExpression).
4.  Return ? [GetValue](#sec-getvalue)(`rRef`).

Note

[GetValue](#sec-getvalue) must be called even though its value is not used because it may have observable side-effects.
