# Annex F (informative) Additions and Changes That Introduce Incompatibilities with Prior Editions

[6.2.5](#sec-reference-record-specification-type): In ECMAScript 2015, Function calls are not allowed to return a [Reference Record](#sec-reference-record-specification-type).

[7.1.4.1](#sec-tonumber-applied-to-the-string-type): In ECMAScript 2015, [ToNumber](#sec-tonumber) applied to a String value now recognizes and converts [BinaryIntegerLiteral](#prod-BinaryIntegerLiteral) and [OctalIntegerLiteral](#prod-OctalIntegerLiteral) numeric strings. In previous editions such strings were converted to NaN.

[9.3](#sec-code-realms): In ECMAScript 2018, Template objects are canonicalized based on [Parse Node](#sec-syntactic-grammar) (source location), instead of across all occurrences of that template literal or tagged template in a [Realm](#realm) in previous editions.

[12.2](#sec-white-space): In ECMAScript 2016, Unicode 8.0.0 or higher is mandated, as opposed to ECMAScript 2015 which mandated Unicode 5.1. In particular, this caused U+180E MONGOLIAN VOWEL SEPARATOR, which was in the `Space_Separator` (`Zs`) category and thus treated as whitespace in ECMAScript 2015, to be moved to the `Format` (`Cf`) category (as of Unicode 6.3.0). This causes whitespace-sensitive methods to behave differently. For example, `"\u180E".trim().length` was `0` in previous editions, but `1` in ECMAScript 2016 and later. Additionally, ECMAScript 2017 mandated always using the latest version of the Unicode Standard.

[12.7](#sec-names-and-keywords): In ECMAScript 2015, the valid code points for an [IdentifierName](#prod-IdentifierName) are specified in terms of the Unicode properties “ID_Start” and “ID_Continue”. In previous editions, the valid [IdentifierName](#prod-IdentifierName) or [Identifier](#prod-Identifier) code points were specified by enumerating various Unicode code point categories.

[12.10.1](#sec-rules-of-automatic-semicolon-insertion): In ECMAScript 2015, Automatic Semicolon Insertion adds a semicolon at the end of a do-while statement if the semicolon is missing. This change aligns the specification with the actual behaviour of most existing implementations.

[13.2.5.1](#sec-object-initializer-static-semantics-early-errors): In ECMAScript 2015, it is no longer an [early error](#early-error) to have duplicate property names in Object Initializers.

[13.15.1](#sec-assignment-operators-static-semantics-early-errors): In ECMAScript 2015, [strict mode code](#sec-strict-mode-code) containing an assignment to an immutable binding such as the function name of a [FunctionExpression](#prod-FunctionExpression) does not produce an [early error](#early-error). Instead it produces a runtime error.

[14.2](#sec-block): In ECMAScript 2015, a [StatementList](#prod-StatementList) beginning with the token let followed by the input elements [LineTerminator](#prod-LineTerminator) then [Identifier](#prod-Identifier) is the start of a [LexicalDeclaration](#prod-LexicalDeclaration). In previous editions, automatic semicolon insertion would always insert a semicolon before the [Identifier](#prod-Identifier) input element.

[14.5](#sec-expression-statement): In ECMAScript 2015, a [StatementListItem](#prod-StatementListItem) beginning with the token `let` followed by the token `[` is the start of a [LexicalDeclaration](#prod-LexicalDeclaration). In previous editions such a sequence would be the start of an [ExpressionStatement](#prod-ExpressionStatement).

[14.6.2](#sec-if-statement-runtime-semantics-evaluation): In ECMAScript 2015, the normal result of an [IfStatement](#prod-IfStatement) is never the value empty. If no [Statement](#prod-Statement) part is evaluated or if the evaluated [Statement](#prod-Statement) part produces a [normal completion containing](#sec-completion-record-specification-type) empty, the result of the [IfStatement](#prod-IfStatement) is undefined.

[14.7](#sec-iteration-statements): In ECMAScript 2015, if the `(` token of a for statement is immediately followed by the token sequence `let [` then the `let` is treated as the start of a [LexicalDeclaration](#prod-LexicalDeclaration). In previous editions such a token sequence would be the start of an [Expression](#prod-Expression).

[14.7](#sec-iteration-statements): In ECMAScript 2015, if the ( token of a for-in statement is immediately followed by the token sequence `let [` then the `let` is treated as the start of a [ForDeclaration](#prod-ForDeclaration). In previous editions such a token sequence would be the start of an [LeftHandSideExpression](#prod-LeftHandSideExpression).

[14.7](#sec-iteration-statements): Prior to ECMAScript 2015, an initialization expression could appear as part of the [VariableDeclaration](#prod-VariableDeclaration) that precedes the `in` [keyword](#sec-keywords-and-reserved-words). In ECMAScript 2015, the [ForBinding](#prod-ForBinding) in that same position does not allow the occurrence of such an initializer. In ECMAScript 2017, such an initializer is permitted only in [non-strict code](#non-strict-code).

[14.7](#sec-iteration-statements): In ECMAScript 2015, the result of evaluating an [IterationStatement](#prod-IterationStatement) is never a [normal completion](#sec-completion-record-specification-type) whose `[[Value]]` is empty. If the [Statement](#prod-Statement) part of an [IterationStatement](#prod-IterationStatement) is not evaluated or if the final evaluation of the [Statement](#prod-Statement) part produces a [normal completion](#sec-completion-record-specification-type) whose `[[Value]]` is empty, the result of evaluating the [IterationStatement](#prod-IterationStatement) is a [normal completion](#sec-completion-record-specification-type) whose `[[Value]]` is undefined.

[14.11.2](#sec-with-statement-runtime-semantics-evaluation): In ECMAScript 2015, the result of evaluating a [WithStatement](#prod-WithStatement) is never a [normal completion](#sec-completion-record-specification-type) whose `[[Value]]` is empty. If evaluation of the [Statement](#prod-Statement) part of a [WithStatement](#prod-WithStatement) produces a [normal completion](#sec-completion-record-specification-type) whose `[[Value]]` is empty, the result of evaluating the [WithStatement](#prod-WithStatement) is a [normal completion](#sec-completion-record-specification-type) whose `[[Value]]` is undefined.

[14.12.4](#sec-switch-statement-runtime-semantics-evaluation): In ECMAScript 2015, the result of evaluating a [SwitchStatement](#prod-SwitchStatement) is never a [normal completion](#sec-completion-record-specification-type) whose `[[Value]]` is empty. If evaluation of the [CaseBlock](#prod-CaseBlock) part of a [SwitchStatement](#prod-SwitchStatement) produces a [normal completion](#sec-completion-record-specification-type) whose `[[Value]]` is empty, the result of evaluating the [SwitchStatement](#prod-SwitchStatement) is a [normal completion](#sec-completion-record-specification-type) whose `[[Value]]` is undefined.

[14.15](#sec-try-statement): In ECMAScript 2015, it is an [early error](#early-error) for a [Catch](#prod-Catch) clause to contain a `var` declaration for the same [Identifier](#prod-Identifier) that appears as the [Catch](#prod-Catch) clause parameter. In previous editions, such a variable declaration would be instantiated in the enclosing variable environment but the declaration's [Initializer](#prod-Initializer) value would be assigned to the [Catch](#prod-Catch) parameter.

[14.15](#sec-try-statement), [19.2.1.3](#sec-evaldeclarationinstantiation): In ECMAScript 2015, a runtime SyntaxError is thrown if a [Catch](#prod-Catch) clause evaluates a non-strict direct `eval` whose eval code includes a `var` or `FunctionDeclaration` declaration that binds the same [Identifier](#prod-Identifier) that appears as the [Catch](#prod-Catch) clause parameter.

[14.15.3](#sec-try-statement-runtime-semantics-evaluation): In ECMAScript 2015, the result of a [TryStatement](#prod-TryStatement) is never the value empty. If the [Block](#prod-Block) part of a [TryStatement](#prod-TryStatement) evaluates to a [normal completion containing](#sec-completion-record-specification-type) empty, the result of the [TryStatement](#prod-TryStatement) is undefined. If the [Block](#prod-Block) part of a [TryStatement](#prod-TryStatement) evaluates to a [throw completion](#sec-completion-record-specification-type) and it has a [Catch](#prod-Catch) part that evaluates to a [normal completion containing](#sec-completion-record-specification-type) empty, the result of the [TryStatement](#prod-TryStatement) is undefined if there is no [Finally](#prod-Finally) clause or if its [Finally](#prod-Finally) clause evaluates to an empty [normal completion](#sec-completion-record-specification-type).

[15.4.5](#sec-runtime-semantics-methoddefinitionevaluation) In ECMAScript 2015, the [function objects](#function-object) that are created as the values of the `[[Get]]` or `[[Set]]` attribute of [accessor properties](#sec-object-type) in an [ObjectLiteral](#prod-ObjectLiteral) are not [constructor](#constructor) functions and they do not have a "prototype" own property. In the previous edition, they were [constructors](#constructor) and had a "prototype" property.

[20.1.2.6](#sec-object.freeze): In ECMAScript 2015, if the argument to `Object.freeze` is not an object it is treated as if it was a non-extensible [ordinary object](#ordinary-object) with no own properties. In the previous edition, a non-object argument always causes a TypeError to be thrown.

[20.1.2.8](#sec-object.getownpropertydescriptor): In ECMAScript 2015, if the argument to `Object.getOwnPropertyDescriptor` is not an object an attempt is made to coerce the argument using [ToObject](#sec-toobject). If the coercion is successful the result is used in place of the original argument value. In the previous edition, a non-object argument always causes a TypeError to be thrown.

[20.1.2.10](#sec-object.getownpropertynames): In ECMAScript 2015, if the argument to `Object.getOwnPropertyNames` is not an object an attempt is made to coerce the argument using [ToObject](#sec-toobject). If the coercion is successful the result is used in place of the original argument value. In the previous edition, a non-object argument always causes a TypeError to be thrown.

[20.1.2.12](#sec-object.getprototypeof): In ECMAScript 2015, if the argument to `Object.getPrototypeOf` is not an object an attempt is made to coerce the argument using [ToObject](#sec-toobject). If the coercion is successful the result is used in place of the original argument value. In the previous edition, a non-object argument always causes a TypeError to be thrown.

[20.1.2.16](#sec-object.isextensible): In ECMAScript 2015, if the argument to `Object.isExtensible` is not an object it is treated as if it was a non-extensible [ordinary object](#ordinary-object) with no own properties. In the previous edition, a non-object argument always causes a TypeError to be thrown.

[20.1.2.17](#sec-object.isfrozen): In ECMAScript 2015, if the argument to `Object.isFrozen` is not an object it is treated as if it was a non-extensible [ordinary object](#ordinary-object) with no own properties. In the previous edition, a non-object argument always causes a TypeError to be thrown.

[20.1.2.18](#sec-object.issealed): In ECMAScript 2015, if the argument to `Object.isSealed` is not an object it is treated as if it was a non-extensible [ordinary object](#ordinary-object) with no own properties. In the previous edition, a non-object argument always causes a TypeError to be thrown.

[20.1.2.19](#sec-object.keys): In ECMAScript 2015, if the argument to `Object.keys` is not an object an attempt is made to coerce the argument using [ToObject](#sec-toobject). If the coercion is successful the result is used in place of the original argument value. In the previous edition, a non-object argument always causes a TypeError to be thrown.

[20.1.2.20](#sec-object.preventextensions): In ECMAScript 2015, if the argument to `Object.preventExtensions` is not an object it is treated as if it was a non-extensible [ordinary object](#ordinary-object) with no own properties. In the previous edition, a non-object argument always causes a TypeError to be thrown.

[20.1.2.22](#sec-object.seal): In ECMAScript 2015, if the argument to `Object.seal` is not an object it is treated as if it was a non-extensible [ordinary object](#ordinary-object) with no own properties. In the previous edition, a non-object argument always causes a TypeError to be thrown.

[20.2.3.2](#sec-function.prototype.bind): In ECMAScript 2015, the `[[Prototype]]` internal slot of a bound function is set to the `[[GetPrototypeOf]]` value of its target function. In the previous edition, `[[Prototype]]` was always set to [%Function.prototype%](#sec-properties-of-the-function-prototype-object).

[20.2.4.1](#sec-function-instances-length): In ECMAScript 2015, the "length" property of function instances is configurable. In previous editions it was non-configurable.

[20.5.6.2](#sec-properties-of-the-nativeerror-constructors): In ECMAScript 2015, the `[[Prototype]]` internal slot of a `NativeError` [constructor](#constructor) is the Error [constructor](#constructor). In previous editions it was the [Function prototype object](#sec-properties-of-the-function-prototype-object).

[21.4.4](#sec-properties-of-the-date-prototype-object) In ECMAScript 2015, the [Date prototype object](#sec-properties-of-the-date-prototype-object) is not a Date instance. In previous editions it was a Date instance whose TimeValue was NaN.

[22.1.3.12](#sec-string.prototype.localecompare) In ECMAScript 2015, the `String.prototype.localeCompare` function must treat Strings that are canonically equivalent according to the Unicode Standard as being identical. In previous editions implementations were permitted to ignore canonical equivalence and could instead use a bit-wise comparison.

[22.1.3.28](#sec-string.prototype.tolowercase) and [22.1.3.30](#sec-string.prototype.touppercase) In ECMAScript 2015, lowercase/upper conversion processing operates on code points. In previous editions such the conversion processing was only applied to individual code units. The only affected code points are those in the Deseret block of Unicode.

[22.1.3.32](#sec-string.prototype.trim) In ECMAScript 2015, the `String.prototype.trim` method is defined to recognize white space code points that may exist outside of the Unicode BMP. However, as of Unicode 7 no such code points are defined. In previous editions such code points would not have been recognized as white space.

[22.2.4.1](#sec-regexp-pattern-flags) In ECMAScript 2015, If the `pattern` argument is a RegExp instance and the `flags` argument is not undefined, a new RegExp instance is created just like `pattern` except that `pattern`'s flags are replaced by the argument `flags`. In previous editions a TypeError exception was thrown when `pattern` was a RegExp instance and `flags` was not undefined.

[22.2.6](#sec-properties-of-the-regexp-prototype-object) In ECMAScript 2015, the [RegExp prototype object](#sec-properties-of-the-regexp-prototype-object) is not a RegExp instance. In previous editions it was a RegExp instance whose pattern is the empty String.

[22.2.6](#sec-properties-of-the-regexp-prototype-object) In ECMAScript 2015, "source", "global", "ignoreCase", and "multiline" are [accessor properties](#sec-object-type) defined on the [RegExp prototype object](#sec-properties-of-the-regexp-prototype-object). In previous editions they were [data properties](#sec-object-type) defined on RegExp instances.

[25.4.15](#sec-atomics.notify): In ECMAScript 2019, `Atomics.wake` has been renamed to `Atomics.notify` to prevent confusion with `Atomics.wait`.

[27.1.6.4](#sec-asyncfromsynciteratorcontinuation), [27.6.3.6](#sec-asyncgeneratorresume): In ECMAScript 2019, the number of [Jobs](#job) enqueued by `await` was reduced, which could create an observable difference in resolution order between a `then()` call and an `await` expression.
