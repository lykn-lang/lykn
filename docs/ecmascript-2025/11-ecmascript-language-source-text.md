# 11 ECMAScript Language: Source Text

## 11.1 Source Text

### Syntax

[SourceCharacter](#prod-SourceCharacter) :: any Unicode code point

ECMAScript source text is a sequence of Unicode code points. All Unicode code point values from U+0000 to U+10FFFF, including surrogate code points, may occur in ECMAScript source text where permitted by the ECMAScript grammars. The actual encodings used to store and interchange ECMAScript source text is not relevant to this specification. Regardless of the external source text encoding, a conforming ECMAScript implementation processes the source text as if it was an equivalent sequence of [SourceCharacter](#prod-SourceCharacter) values, each [SourceCharacter](#prod-SourceCharacter) being a Unicode code point. Conforming ECMAScript implementations are not required to perform any normalization of source text, or behave as though they were performing normalization of source text.

The components of a combining character sequence are treated as individual Unicode code points even though a user might think of the whole sequence as a single character.

Note

In string literals, regular expression literals, template literals and identifiers, any Unicode code point may also be expressed using Unicode escape sequences that explicitly express a code point's numeric value. Within a comment, such an escape sequence is effectively ignored as part of the comment.

ECMAScript differs from the Java programming language in the behaviour of Unicode escape sequences. In a Java program, if the Unicode escape sequence `\u000A`, for example, occurs within a single-line comment, it is interpreted as a line terminator (Unicode code point U+000A is LINE FEED (LF)) and therefore the next code point is not part of the comment. Similarly, if the Unicode escape sequence `\u000A` occurs within a string literal in a Java program, it is likewise interpreted as a line terminator, which is not allowed within a string literal—one must write `\n` instead of `\u000A` to cause a LINE FEED (LF) to be part of the value of a string literal. In an ECMAScript program, a Unicode escape sequence occurring within a comment is never interpreted and therefore cannot contribute to termination of the comment. Similarly, a Unicode escape sequence occurring within a string literal in an ECMAScript program always contributes to the literal and is never interpreted as a line terminator or as a code point that might terminate the string literal.

### 11.1.1 Static Semantics: UTF16EncodeCodePoint ( `cp` )

The abstract operation UTF16EncodeCodePoint takes argument `cp` (a Unicode code point) and returns a String. It performs the following steps when called:

1.  [Assert](#assert): 0 ≤ `cp` ≤ 0x10FFFF.
2.  If `cp` ≤ 0xFFFF, return the String value consisting of the code unit whose numeric value is `cp`.
3.  Let `cu1` be the code unit whose numeric value is [floor](#eqn-floor)((`cp` - 0x10000) / 0x400) + 0xD800.
4.  Let `cu2` be the code unit whose numeric value is ((`cp` - 0x10000) [modulo](#eqn-modulo) 0x400) + 0xDC00.
5.  Return the [string-concatenation](#string-concatenation) of `cu1` and `cu2`.

### 11.1.2 Static Semantics: CodePointsToString ( `text` )

The abstract operation CodePointsToString takes argument `text` (a sequence of Unicode code points) and returns a String. It converts `text` into a String value, as described in [6.1.4](#sec-ecmascript-language-types-string-type). It performs the following steps when called:

1.  Let `result` be the empty String.
2.  For each code point `cp` of `text`, do
    1.  Set `result` to the [string-concatenation](#string-concatenation) of `result` and [UTF16EncodeCodePoint](#sec-utf16encodecodepoint)(`cp`).
3.  Return `result`.

### 11.1.3 Static Semantics: UTF16SurrogatePairToCodePoint ( `lead`, `trail` )

The abstract operation UTF16SurrogatePairToCodePoint takes arguments `lead` (a code unit) and `trail` (a code unit) and returns a code point. Two code units that form a UTF-16 [surrogate pair](#surrogate-pair) are converted to a code point. It performs the following steps when called:

1.  [Assert](#assert): `lead` is a [leading surrogate](#leading-surrogate) and `trail` is a [trailing surrogate](#trailing-surrogate).
2.  Let `cp` be (`lead` - 0xD800) × 0x400 + (`trail` - 0xDC00) + 0x10000.
3.  Return the code point `cp`.

### 11.1.4 Static Semantics: CodePointAt ( `string`, `position` )

The abstract operation CodePointAt takes arguments `string` (a String) and `position` (a non-negative [integer](#integer)) and returns a [Record](#sec-list-and-record-specification-type) with fields `[[CodePoint]]` (a code point), `[[CodeUnitCount]]` (a positive [integer](#integer)), and `[[IsUnpairedSurrogate]]` (a Boolean). It interprets `string` as a sequence of UTF-16 encoded code points, as described in [6.1.4](#sec-ecmascript-language-types-string-type), and reads from it a single code point starting with the code unit at index `position`. It performs the following steps when called:

1.  Let `size` be the length of `string`.
2.  [Assert](#assert): `position` ≥ 0 and `position` \< `size`.
3.  Let `first` be the code unit at index `position` within `string`.
4.  Let `cp` be the code point whose numeric value is the numeric value of `first`.
5.  If `first` is neither a [leading surrogate](#leading-surrogate) nor a [trailing surrogate](#trailing-surrogate), then
    1.  Return the [Record](#sec-list-and-record-specification-type) { `[[CodePoint]]`: `cp`, `[[CodeUnitCount]]`: 1, `[[IsUnpairedSurrogate]]`: false }.
6.  If `first` is a [trailing surrogate](#trailing-surrogate) or `position` + 1 = `size`, then
    1.  Return the [Record](#sec-list-and-record-specification-type) { `[[CodePoint]]`: `cp`, `[[CodeUnitCount]]`: 1, `[[IsUnpairedSurrogate]]`: true }.
7.  Let `second` be the code unit at index `position` + 1 within `string`.
8.  If `second` is not a [trailing surrogate](#trailing-surrogate), then
    1.  Return the [Record](#sec-list-and-record-specification-type) { `[[CodePoint]]`: `cp`, `[[CodeUnitCount]]`: 1, `[[IsUnpairedSurrogate]]`: true }.
9.  Set `cp` to [UTF16SurrogatePairToCodePoint](#sec-utf16decodesurrogatepair)(`first`, `second`).
10. Return the [Record](#sec-list-and-record-specification-type) { `[[CodePoint]]`: `cp`, `[[CodeUnitCount]]`: 2, `[[IsUnpairedSurrogate]]`: false }.

### 11.1.5 Static Semantics: StringToCodePoints ( `string` )

The abstract operation StringToCodePoints takes argument `string` (a String) and returns a [List](#sec-list-and-record-specification-type) of code points. It returns the sequence of Unicode code points that results from interpreting `string` as UTF-16 encoded Unicode text as described in [6.1.4](#sec-ecmascript-language-types-string-type). It performs the following steps when called:

1.  Let `codePoints` be a new empty [List](#sec-list-and-record-specification-type).
2.  Let `size` be the length of `string`.
3.  Let `position` be 0.
4.  Repeat, while `position` \< `size`,
    1.  Let `cp` be [CodePointAt](#sec-codepointat)(`string`, `position`).
    2.  Append `cp`.`[[CodePoint]]` to `codePoints`.
    3.  Set `position` to `position` + `cp`.`[[CodeUnitCount]]`.
5.  Return `codePoints`.

### 11.1.6 Static Semantics: ParseText ( `sourceText`, `goalSymbol` )

The abstract operation ParseText takes arguments `sourceText` (a String or a sequence of Unicode code points) and `goalSymbol` (a nonterminal in one of the ECMAScript grammars) and returns a [Parse Node](#sec-syntactic-grammar) or a non-empty [List](#sec-list-and-record-specification-type) of SyntaxError objects. It performs the following steps when called:

1.  If `sourceText` [is a String](#sec-ecmascript-language-types-string-type), set `sourceText` to [StringToCodePoints](#sec-stringtocodepoints)(`sourceText`).
2.  Attempt to parse `sourceText` using `goalSymbol` as the [goal symbol](#sec-context-free-grammars), and analyse the parse result for any [early error](#early-error) conditions. Parsing and [early error](#early-error) detection may be interleaved in an [implementation-defined](#implementation-defined) manner.
3.  If the parse succeeded and no [early errors](#early-error) were found, return the [Parse Node](#sec-syntactic-grammar) (an instance of `goalSymbol`) at the root of the parse tree resulting from the parse.
4.  Otherwise, return a [List](#sec-list-and-record-specification-type) of one or more SyntaxError objects representing the parsing errors and/or [early errors](#early-error). If more than one parsing error or [early error](#early-error) is present, the number and ordering of error objects in the list is [implementation-defined](#implementation-defined), but at least one must be present.

Note 1

Consider a text that has an [early error](#early-error) at a particular point, and also a syntax error at a later point. An implementation that does a parse pass followed by an [early errors](#early-error) pass might report the syntax error and not proceed to the [early errors](#early-error) pass. An implementation that interleaves the two activities might report the [early error](#early-error) and not proceed to find the syntax error. A third implementation might report both errors. All of these behaviours are conformant.

Note 2

See also clause [17](#sec-error-handling-and-language-extensions).

## 11.2 Types of Source Code

There are four types of ECMAScript code:

- Global code is source text that is treated as an ECMAScript [Script](#prod-Script). The global code of a particular [Script](#prod-Script) does not include any source text that is parsed as part of a [FunctionDeclaration](#prod-FunctionDeclaration), [FunctionExpression](#prod-FunctionExpression), [GeneratorDeclaration](#prod-GeneratorDeclaration), [GeneratorExpression](#prod-GeneratorExpression), [AsyncFunctionDeclaration](#prod-AsyncFunctionDeclaration), [AsyncFunctionExpression](#prod-AsyncFunctionExpression), [AsyncGeneratorDeclaration](#prod-AsyncGeneratorDeclaration), [AsyncGeneratorExpression](#prod-AsyncGeneratorExpression), [MethodDefinition](#prod-MethodDefinition), [ArrowFunction](#prod-ArrowFunction), [AsyncArrowFunction](#prod-AsyncArrowFunction), [ClassDeclaration](#prod-ClassDeclaration), or [ClassExpression](#prod-ClassExpression).

- Eval code is the source text supplied to the built-in `eval` function. More precisely, if the parameter to the built-in `eval` function [is a String](#sec-ecmascript-language-types-string-type), it is treated as an ECMAScript [Script](#prod-Script). The eval code for a particular invocation of `eval` is the global code portion of that [Script](#prod-Script).

- Function code is source text that is parsed to supply the value of the `[[ECMAScriptCode]]` and `[[FormalParameters]]` internal slots (see [10.2](#sec-ecmascript-function-objects)) of an ECMAScript [function object](#function-object). The function code of a particular ECMAScript function does not include any source text that is parsed as the function code of a nested [FunctionDeclaration](#prod-FunctionDeclaration), [FunctionExpression](#prod-FunctionExpression), [GeneratorDeclaration](#prod-GeneratorDeclaration), [GeneratorExpression](#prod-GeneratorExpression), [AsyncFunctionDeclaration](#prod-AsyncFunctionDeclaration), [AsyncFunctionExpression](#prod-AsyncFunctionExpression), [AsyncGeneratorDeclaration](#prod-AsyncGeneratorDeclaration), [AsyncGeneratorExpression](#prod-AsyncGeneratorExpression), [MethodDefinition](#prod-MethodDefinition), [ArrowFunction](#prod-ArrowFunction), [AsyncArrowFunction](#prod-AsyncArrowFunction), [ClassDeclaration](#prod-ClassDeclaration), or [ClassExpression](#prod-ClassExpression).

  In addition, if the source text referred to above is parsed as:

  - the [FormalParameters](#prod-FormalParameters) and [FunctionBody](#prod-FunctionBody) of a [FunctionDeclaration](#prod-FunctionDeclaration) or [FunctionExpression](#prod-FunctionExpression),
  - the [FormalParameters](#prod-FormalParameters) and [GeneratorBody](#prod-GeneratorBody) of a [GeneratorDeclaration](#prod-GeneratorDeclaration) or [GeneratorExpression](#prod-GeneratorExpression),
  - the [FormalParameters](#prod-FormalParameters) and [AsyncFunctionBody](#prod-AsyncFunctionBody) of an [AsyncFunctionDeclaration](#prod-AsyncFunctionDeclaration) or [AsyncFunctionExpression](#prod-AsyncFunctionExpression), or
  - the [FormalParameters](#prod-FormalParameters) and [AsyncGeneratorBody](#prod-AsyncGeneratorBody) of an [AsyncGeneratorDeclaration](#prod-AsyncGeneratorDeclaration) or [AsyncGeneratorExpression](#prod-AsyncGeneratorExpression),

  then the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) the [BindingIdentifier](#prod-BindingIdentifier) (if any) of that declaration or expression is also included in the function code of the corresponding function.

- Module code is source text that is code that is provided as a [ModuleBody](#prod-ModuleBody). It is the code that is directly evaluated when a module is initialized. The module code of a particular module does not include any source text that is parsed as part of a nested [FunctionDeclaration](#prod-FunctionDeclaration), [FunctionExpression](#prod-FunctionExpression), [GeneratorDeclaration](#prod-GeneratorDeclaration), [GeneratorExpression](#prod-GeneratorExpression), [AsyncFunctionDeclaration](#prod-AsyncFunctionDeclaration), [AsyncFunctionExpression](#prod-AsyncFunctionExpression), [AsyncGeneratorDeclaration](#prod-AsyncGeneratorDeclaration), [AsyncGeneratorExpression](#prod-AsyncGeneratorExpression), [MethodDefinition](#prod-MethodDefinition), [ArrowFunction](#prod-ArrowFunction), [AsyncArrowFunction](#prod-AsyncArrowFunction), [ClassDeclaration](#prod-ClassDeclaration), or [ClassExpression](#prod-ClassExpression).

Note 1

Function code is generally provided as the bodies of Function Definitions ([15.2](#sec-function-definitions)), Arrow Function Definitions ([15.3](#sec-arrow-function-definitions)), Method Definitions ([15.4](#sec-method-definitions)), Generator Function Definitions ([15.5](#sec-generator-function-definitions)), Async Function Definitions ([15.8](#sec-async-function-definitions)), Async Generator Function Definitions ([15.6](#sec-async-generator-function-definitions)), and Async Arrow Functions ([15.9](#sec-async-arrow-function-definitions)). Function code is also derived from the arguments to the Function [constructor](#constructor) ([20.2.1.1](#sec-function-p1-p2-pn-body)), the GeneratorFunction [constructor](#constructor) ([27.3.1.1](#sec-generatorfunction)), and the AsyncFunction [constructor](#constructor) ([27.7.1.1](#sec-async-function-constructor-arguments)).

Note 2

The practical effect of including the [BindingIdentifier](#prod-BindingIdentifier) in function code is that the Early Errors for [strict mode code](#sec-strict-mode-code) are applied to a [BindingIdentifier](#prod-BindingIdentifier) that is the name of a function whose body contains a "use strict" directive, even if the surrounding code is not [strict mode code](#sec-strict-mode-code).

### 11.2.1 Directive Prologues and the Use Strict Directive

A Directive Prologue is the longest sequence of [ExpressionStatement](#prod-ExpressionStatement)s occurring as the initial [StatementListItem](#prod-StatementListItem)s or [ModuleItem](#prod-ModuleItem)s of a [FunctionBody](#prod-FunctionBody), a [ScriptBody](#prod-ScriptBody), or a [ModuleBody](#prod-ModuleBody) and where each [ExpressionStatement](#prod-ExpressionStatement) in the sequence consists entirely of a [StringLiteral](#prod-StringLiteral) token followed by a semicolon. The semicolon may appear explicitly or may be inserted by automatic semicolon insertion ([12.10](#sec-automatic-semicolon-insertion)). A [Directive Prologue](#directive-prologue) may be an empty sequence.

A Use Strict Directive is an [ExpressionStatement](#prod-ExpressionStatement) in a [Directive Prologue](#directive-prologue) whose [StringLiteral](#prod-StringLiteral) is either of the exact code point sequences `"use strict"` or `'use strict'`. A [Use Strict Directive](#use-strict-directive) may not contain an [EscapeSequence](#prod-EscapeSequence) or [LineContinuation](#prod-LineContinuation).

A [Directive Prologue](#directive-prologue) may contain more than one [Use Strict Directive](#use-strict-directive). However, an implementation may issue a warning if this occurs.

Note

The [ExpressionStatement](#prod-ExpressionStatement)s of a [Directive Prologue](#directive-prologue) are evaluated normally during evaluation of the containing production. Implementations may define implementation specific meanings for [ExpressionStatement](#prod-ExpressionStatement)s which are not a [Use Strict Directive](#use-strict-directive) and which occur in a [Directive Prologue](#directive-prologue). If an appropriate notification mechanism exists, an implementation should issue a warning if it encounters in a [Directive Prologue](#directive-prologue) an [ExpressionStatement](#prod-ExpressionStatement) that is not a [Use Strict Directive](#use-strict-directive) and which does not have a meaning defined by the implementation.

### 11.2.2 Strict Mode Code

An ECMAScript syntactic unit may be processed using either unrestricted or strict mode syntax and semantics ([4.3.2](#sec-strict-variant-of-ecmascript)). Code is interpreted as strict mode code in the following situations:

- [Global code](#sec-types-of-source-code) is strict mode code if it begins with a [Directive Prologue](#directive-prologue) that contains a [Use Strict Directive](#use-strict-directive).
- [Module code](#sec-types-of-source-code) is always strict mode code.
- All parts of a [ClassDeclaration](#prod-ClassDeclaration) or a [ClassExpression](#prod-ClassExpression) are strict mode code.
- [Eval code](#sec-types-of-source-code) is strict mode code if it begins with a [Directive Prologue](#directive-prologue) that contains a [Use Strict Directive](#use-strict-directive) or if the call to `eval` is a [direct eval](#sec-function-calls-runtime-semantics-evaluation) that is contained in strict mode code.
- [Function code](#sec-types-of-source-code) is strict mode code if the associated [FunctionDeclaration](#prod-FunctionDeclaration), [FunctionExpression](#prod-FunctionExpression), [GeneratorDeclaration](#prod-GeneratorDeclaration), [GeneratorExpression](#prod-GeneratorExpression), [AsyncFunctionDeclaration](#prod-AsyncFunctionDeclaration), [AsyncFunctionExpression](#prod-AsyncFunctionExpression), [AsyncGeneratorDeclaration](#prod-AsyncGeneratorDeclaration), [AsyncGeneratorExpression](#prod-AsyncGeneratorExpression), [MethodDefinition](#prod-MethodDefinition), [ArrowFunction](#prod-ArrowFunction), or [AsyncArrowFunction](#prod-AsyncArrowFunction) is contained in strict mode code or if the code that produces the value of the function's `[[ECMAScriptCode]]` internal slot begins with a [Directive Prologue](#directive-prologue) that contains a [Use Strict Directive](#use-strict-directive).
- [Function code](#sec-types-of-source-code) that is supplied as the arguments to the built-in Function, Generator, AsyncFunction, and AsyncGenerator [constructors](#constructor) is strict mode code if the last argument [is a String](#sec-ecmascript-language-types-string-type) that when processed is a [FunctionBody](#prod-FunctionBody) that begins with a [Directive Prologue](#directive-prologue) that contains a [Use Strict Directive](#use-strict-directive).

ECMAScript code that is not strict mode code is called non-strict code.

#### 11.2.2.1 Static Semantics: IsStrict ( `node` )

The abstract operation IsStrict takes argument `node` (a [Parse Node](#sec-syntactic-grammar)) and returns a Boolean. It performs the following steps when called:

1.  If the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) `node` is [strict mode code](#sec-strict-mode-code), return true; else return false.

### 11.2.3 Non-ECMAScript Functions

An ECMAScript implementation may support the evaluation of function [exotic objects](#exotic-object) whose evaluative behaviour is expressed in some [host-defined](#host-defined) form of executable code other than [ECMAScript source text](#sec-source-text). Whether a [function object](#function-object) is defined within ECMAScript code or is a built-in function is not observable from the perspective of ECMAScript code that calls or is called by such a [function object](#function-object).
