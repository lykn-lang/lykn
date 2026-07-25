# 19 The Global Object

The global object:

- is created before control enters any [execution context](#sec-execution-contexts).
- does not have a `[[Construct]]` internal method; it cannot be used as a [constructor](#constructor) with the `new` operator.
- does not have a `[[Call]]` internal method; it cannot be invoked as a function.
- has a `[[Prototype]]` internal slot whose value is [host-defined](#host-defined).
- may have [host-defined](#host-defined) properties in addition to the properties defined in this specification. This may include a property whose value is the global object itself.

## 19.1 Value Properties of the Global Object

### 19.1.1 globalThis

The initial value of the "globalThis" property of the [global object](#sec-global-object) in a [Realm Record](#realm-record) `realm` is `realm`.`[[GlobalEnv]]`.`[[GlobalThisValue]]`.

This property has the attributes { `[[Writable]]`: true, `[[Enumerable]]`: false, `[[Configurable]]`: true }.

### 19.1.2 Infinity

The value of `Infinity` is +∞_(𝔽) (see [6.1.6.1](#sec-ecmascript-language-types-number-type)). This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

### 19.1.3 NaN

The value of `NaN` is NaN (see [6.1.6.1](#sec-ecmascript-language-types-number-type)). This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

### 19.1.4 undefined

The value of `undefined` is undefined (see [6.1.1](#sec-ecmascript-language-types-undefined-type)). This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

## 19.2 Function Properties of the Global Object

### 19.2.1 eval ( `x` )

This function is the %eval% intrinsic object.

It performs the following steps when called:

1.  Return ? [PerformEval](#sec-performeval)(`x`, false, false).

#### 19.2.1.1 PerformEval ( `x`, `strictCaller`, `direct` )

The abstract operation PerformEval takes arguments `x` (an [ECMAScript language value](#sec-ecmascript-language-types)), `strictCaller` (a Boolean), and `direct` (a Boolean) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [ECMAScript language value](#sec-ecmascript-language-types) or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  [Assert](#assert): If `direct` is false, then `strictCaller` is also false.
2.  If `x` [is not a String](#sec-ecmascript-language-types-string-type), return `x`.
3.  Let `evalRealm` be [the current Realm Record](#current-realm).
4.  NOTE: In the case of a [direct eval](#sec-function-calls-runtime-semantics-evaluation), `evalRealm` is the [realm](#realm) of both the caller of `eval` and of the `eval` function itself.
5.  Perform ? [HostEnsureCanCompileStrings](#sec-hostensurecancompilestrings)(`evalRealm`, « », `x`, `direct`).
6.  Let `inFunction` be false.
7.  Let `inMethod` be false.
8.  Let `inDerivedConstructor` be false.
9.  Let `inClassFieldInitializer` be false.
10. If `direct` is true, then
    1.  Let `thisEnvRec` be [GetThisEnvironment](#sec-getthisenvironment)().
    2.  If `thisEnvRec` is a [Function Environment Record](#sec-function-environment-records), then
        1.  Let `F` be `thisEnvRec`.`[[FunctionObject]]`.
        2.  Set `inFunction` to true.
        3.  Set `inMethod` to `thisEnvRec`.HasSuperBinding().
        4.  If `F`.`[[ConstructorKind]]` is derived, set `inDerivedConstructor` to true.
        5.  Let `classFieldInitializerName` be `F`.`[[ClassFieldInitializerName]]`.
        6.  If `classFieldInitializerName` is not empty, set `inClassFieldInitializer` to true.
11. Perform the following substeps in an [implementation-defined](#implementation-defined) order, possibly interleaving parsing and error detection:
    1.  Let `script` be [ParseText](#sec-parsetext)(`x`, [Script](#prod-Script)).
    2.  If `script` is a [List](#sec-list-and-record-specification-type) of errors, throw a SyntaxError exception.
    3.  If `script` [Contains](#sec-static-semantics-contains) [ScriptBody](#prod-ScriptBody) is false, return undefined.
    4.  Let `body` be the [ScriptBody](#prod-ScriptBody) of `script`.
    5.  If `inFunction` is false and `body` [Contains](#sec-static-semantics-contains) [NewTarget](#prod-NewTarget), throw a SyntaxError exception.
    6.  If `inMethod` is false and `body` [Contains](#sec-static-semantics-contains) [SuperProperty](#prod-SuperProperty), throw a SyntaxError exception.
    7.  If `inDerivedConstructor` is false and `body` [Contains](#sec-static-semantics-contains) [SuperCall](#prod-SuperCall), throw a SyntaxError exception.
    8.  If `inClassFieldInitializer` is true and [ContainsArguments](#sec-static-semantics-containsarguments) of `body` is true, throw a SyntaxError exception.
12. If `strictCaller` is true, let `strictEval` be true.
13. Else, let `strictEval` be [ScriptIsStrict](#sec-scriptisstrict) of `script`.
14. Let `runningContext` be the [running execution context](#running-execution-context).
15. NOTE: If `direct` is true, `runningContext` will be the [execution context](#sec-execution-contexts) that performed the [direct eval](#sec-function-calls-runtime-semantics-evaluation). If `direct` is false, `runningContext` will be the [execution context](#sec-execution-contexts) for the invocation of the `eval` function.
16. If `direct` is true, then
    1.  Let `lexEnv` be [NewDeclarativeEnvironment](#sec-newdeclarativeenvironment)(`runningContext`'s LexicalEnvironment).
    2.  Let `varEnv` be `runningContext`'s VariableEnvironment.
    3.  Let `privateEnv` be `runningContext`'s PrivateEnvironment.
17. Else,
    1.  Let `lexEnv` be [NewDeclarativeEnvironment](#sec-newdeclarativeenvironment)(`evalRealm`.`[[GlobalEnv]]`).
    2.  Let `varEnv` be `evalRealm`.`[[GlobalEnv]]`.
    3.  Let `privateEnv` be null.
18. If `strictEval` is true, set `varEnv` to `lexEnv`.
19. If `runningContext` is not already suspended, suspend `runningContext`.
20. Let `evalContext` be a new [ECMAScript code execution context](#ecmascript-code-execution-context).
21. Set `evalContext`'s Function to null.
22. Set `evalContext`'s [Realm](#realm) to `evalRealm`.
23. Set `evalContext`'s ScriptOrModule to `runningContext`'s ScriptOrModule.
24. Set `evalContext`'s VariableEnvironment to `varEnv`.
25. Set `evalContext`'s LexicalEnvironment to `lexEnv`.
26. Set `evalContext`'s PrivateEnvironment to `privateEnv`.
27. Push `evalContext` onto the [execution context stack](#execution-context-stack); `evalContext` is now the [running execution context](#running-execution-context).
28. Let `result` be [Completion](#sec-completion-ao)([EvalDeclarationInstantiation](#sec-evaldeclarationinstantiation)(`body`, `varEnv`, `lexEnv`, `privateEnv`, `strictEval`)).
29. If `result` is a [normal completion](#sec-completion-record-specification-type), then
    1.  Set `result` to [Completion](#sec-completion-ao)([Evaluation](#sec-evaluation) of `body`).
30. If `result` is a [normal completion](#sec-completion-record-specification-type) and `result`.`[[Value]]` is empty, then
    1.  Set `result` to [NormalCompletion](#sec-normalcompletion)(undefined).
31. Suspend `evalContext` and remove it from the [execution context stack](#execution-context-stack).
32. Resume the context that is now on the top of the [execution context stack](#execution-context-stack) as the [running execution context](#running-execution-context).
33. Return ? `result`.

Note

The eval code cannot instantiate variable or function bindings in the variable environment of the calling context that invoked the eval if either the code of the calling context or the eval code is [strict mode code](#sec-strict-mode-code). Instead such bindings are instantiated in a new VariableEnvironment that is only accessible to the eval code. Bindings introduced by `let`, `const`, or `class` declarations are always instantiated in a new LexicalEnvironment.

#### 19.2.1.2 HostEnsureCanCompileStrings ( `calleeRealm`, `parameterStrings`, `bodyString`, `direct` )

The [host-defined](#host-defined) abstract operation HostEnsureCanCompileStrings takes arguments `calleeRealm` (a [Realm Record](#realm-record)), `parameterStrings` (a [List](#sec-list-and-record-specification-type) of Strings), `bodyString` (a String), and `direct` (a Boolean) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or a [throw completion](#sec-completion-record-specification-type). It allows [host environments](#host-environment) to block certain ECMAScript functions which allow developers to interpret and evaluate strings as ECMAScript code.

`parameterStrings` represents the strings that, when using one of the function [constructors](#constructor), will be concatenated together to build the parameters list. `bodyString` represents the function body or the string passed to an `eval` call. `direct` signifies whether the evaluation is a [direct eval](#sec-function-calls-runtime-semantics-evaluation).

The default implementation of HostEnsureCanCompileStrings is to return [NormalCompletion](#sec-normalcompletion)(unused).

#### 19.2.1.3 EvalDeclarationInstantiation ( `body`, `varEnv`, `lexEnv`, `privateEnv`, `strict` )

The abstract operation EvalDeclarationInstantiation takes arguments `body` (a [ScriptBody](#prod-ScriptBody) [Parse Node](#sec-syntactic-grammar)), `varEnv` (an [Environment Record](#sec-environment-records)), `lexEnv` (a [Declarative Environment Record](#sec-declarative-environment-records)), `privateEnv` (a [PrivateEnvironment Record](#privateenvironment-record) or null), and `strict` (a Boolean) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `varNames` be the [VarDeclaredNames](#sec-static-semantics-vardeclarednames) of `body`.
2.  Let `varDeclarations` be the [VarScopedDeclarations](#sec-static-semantics-varscopeddeclarations) of `body`.
3.  If `strict` is false, then
    1.  If `varEnv` is a [Global Environment Record](#sec-global-environment-records), then
        1.  For each element `name` of `varNames`, do
            1.  If [HasLexicalDeclaration](#sec-haslexicaldeclaration)(`varEnv`, `name`) is true, throw a SyntaxError exception.
            2.  NOTE: `eval` will not create a global var declaration that would be shadowed by a global lexical declaration.
    2.  Let `thisEnv` be `lexEnv`.
    3.  [Assert](#assert): The following loop will terminate.
    4.  Repeat, while `thisEnv` and `varEnv` are not the same [Environment Record](#sec-environment-records),
        1.  If `thisEnv` [is not an Object](#sec-object-type) [Environment Record](#sec-environment-records), then
            1.  NOTE: The environment of with statements cannot contain any lexical declaration so it doesn't need to be checked for var/let hoisting conflicts.
            2.  For each element `name` of `varNames`, do
                1.  If ! `thisEnv`.HasBinding(`name`) is true, then
                    1.  Throw a SyntaxError exception.
                    2.  NOTE: Annex [B.3.4](#sec-variablestatements-in-catch-blocks) defines alternate semantics for the above step.
                2.  NOTE: A [direct eval](#sec-function-calls-runtime-semantics-evaluation) will not hoist var declaration over a like-named lexical declaration.
        2.  Set `thisEnv` to `thisEnv`.`[[OuterEnv]]`.
4.  Let `privateIdentifiers` be a new empty [List](#sec-list-and-record-specification-type).
5.  Let `pointer` be `privateEnv`.
6.  Repeat, while `pointer` is not null,
    1.  For each [Private Name](#sec-private-names) `binding` of `pointer`.`[[Names]]`, do
        1.  If `privateIdentifiers` does not contain `binding`.`[[Description]]`, append `binding`.`[[Description]]` to `privateIdentifiers`.
    2.  Set `pointer` to `pointer`.`[[OuterPrivateEnvironment]]`.
7.  If [AllPrivateIdentifiersValid](#sec-static-semantics-allprivateidentifiersvalid) of `body` with argument `privateIdentifiers` is false, throw a SyntaxError exception.
8.  Let `functionsToInitialize` be a new empty [List](#sec-list-and-record-specification-type).
9.  Let `declaredFunctionNames` be a new empty [List](#sec-list-and-record-specification-type).
10. For each element `d` of `varDeclarations`, in reverse [List](#sec-list-and-record-specification-type) order, do
    1.  If `d` is not either a [VariableDeclaration](#prod-VariableDeclaration), a [ForBinding](#prod-ForBinding), or a [BindingIdentifier](#prod-BindingIdentifier), then
        1.  [Assert](#assert): `d` is either a [FunctionDeclaration](#prod-FunctionDeclaration), a [GeneratorDeclaration](#prod-GeneratorDeclaration), an [AsyncFunctionDeclaration](#prod-AsyncFunctionDeclaration), or an [AsyncGeneratorDeclaration](#prod-AsyncGeneratorDeclaration).
        2.  NOTE: If there are multiple function declarations for the same name, the last declaration is used.
        3.  Let `fn` be the sole element of the [BoundNames](#sec-static-semantics-boundnames) of `d`.
        4.  If `declaredFunctionNames` does not contain `fn`, then
            1.  If `varEnv` is a [Global Environment Record](#sec-global-environment-records), then
                1.  Let `fnDefinable` be ? [CanDeclareGlobalFunction](#sec-candeclareglobalfunction)(`varEnv`, `fn`).
                2.  If `fnDefinable` is false, throw a TypeError exception.
            2.  Append `fn` to `declaredFunctionNames`.
            3.  Insert `d` as the first element of `functionsToInitialize`.
11. Let `declaredVarNames` be a new empty [List](#sec-list-and-record-specification-type).
12. For each element `d` of `varDeclarations`, do
    1.  If `d` is either a [VariableDeclaration](#prod-VariableDeclaration), a [ForBinding](#prod-ForBinding), or a [BindingIdentifier](#prod-BindingIdentifier), then
        1.  For each String `vn` of the [BoundNames](#sec-static-semantics-boundnames) of `d`, do
            1.  If `declaredFunctionNames` does not contain `vn`, then
                1.  If `varEnv` is a [Global Environment Record](#sec-global-environment-records), then
                    1.  Let `vnDefinable` be ? [CanDeclareGlobalVar](#sec-candeclareglobalvar)(`varEnv`, `vn`).
                    2.  If `vnDefinable` is false, throw a TypeError exception.
                2.  If `declaredVarNames` does not contain `vn`, then
                    1.  Append `vn` to `declaredVarNames`.
13. NOTE: Annex [B.3.2.3](#sec-web-compat-evaldeclarationinstantiation) adds additional steps at this point.
14. NOTE: No abnormal terminations occur after this algorithm step unless `varEnv` is a [Global Environment Record](#sec-global-environment-records) and the [global object](#sec-global-object) is a [Proxy exotic object](#proxy-exotic-object).
15. Let `lexDeclarations` be the [LexicallyScopedDeclarations](#sec-static-semantics-lexicallyscopeddeclarations) of `body`.
16. For each element `d` of `lexDeclarations`, do
    1.  NOTE: Lexically declared names are only instantiated here but not initialized.
    2.  For each element `dn` of the [BoundNames](#sec-static-semantics-boundnames) of `d`, do
        1.  If [IsConstantDeclaration](#sec-static-semantics-isconstantdeclaration) of `d` is true, then
            1.  Perform ? `lexEnv`.CreateImmutableBinding(`dn`, true).
        2.  Else,
            1.  Perform ? `lexEnv`.CreateMutableBinding(`dn`, false).
17. For each [Parse Node](#sec-syntactic-grammar) `f` of `functionsToInitialize`, do
    1.  Let `fn` be the sole element of the [BoundNames](#sec-static-semantics-boundnames) of `f`.
    2.  Let `fo` be [InstantiateFunctionObject](#sec-runtime-semantics-instantiatefunctionobject) of `f` with arguments `lexEnv` and `privateEnv`.
    3.  If `varEnv` is a [Global Environment Record](#sec-global-environment-records), then
        1.  Perform ? [CreateGlobalFunctionBinding](#sec-createglobalfunctionbinding)(`varEnv`, `fn`, `fo`, true).
    4.  Else,
        1.  Let `bindingExists` be ! `varEnv`.HasBinding(`fn`).
        2.  If `bindingExists` is false, then
            1.  NOTE: The following invocation cannot return an [abrupt completion](#sec-completion-record-specification-type) because of the validation preceding step [14](#step-evaldeclarationinstantiation-post-validation).
            2.  Perform ! `varEnv`.CreateMutableBinding(`fn`, true).
            3.  Perform ! `varEnv`.InitializeBinding(`fn`, `fo`).
        3.  Else,
            1.  Perform ! `varEnv`.SetMutableBinding(`fn`, `fo`, false).
18. For each String `vn` of `declaredVarNames`, do
    1.  If `varEnv` is a [Global Environment Record](#sec-global-environment-records), then
        1.  Perform ? [CreateGlobalVarBinding](#sec-createglobalvarbinding)(`varEnv`, `vn`, true).
    2.  Else,
        1.  Let `bindingExists` be ! `varEnv`.HasBinding(`vn`).
        2.  If `bindingExists` is false, then
            1.  NOTE: The following invocation cannot return an [abrupt completion](#sec-completion-record-specification-type) because of the validation preceding step [14](#step-evaldeclarationinstantiation-post-validation).
            2.  Perform ! `varEnv`.CreateMutableBinding(`vn`, true).
            3.  Perform ! `varEnv`.InitializeBinding(`vn`, undefined).
19. Return unused.

Note

An alternative version of this algorithm is described in [B.3.4](#sec-variablestatements-in-catch-blocks).

### 19.2.2 isFinite ( `number` )

This function is the %isFinite% intrinsic object.

It performs the following steps when called:

1.  Let `num` be ? [ToNumber](#sec-tonumber)(`number`).
2.  If `num` is not [finite](#finite), return false.
3.  Otherwise, return true.

### 19.2.3 isNaN ( `number` )

This function is the %isNaN% intrinsic object.

It performs the following steps when called:

1.  Let `num` be ? [ToNumber](#sec-tonumber)(`number`).
2.  If `num` is NaN, return true.
3.  Otherwise, return false.

Note

A reliable way for ECMAScript code to test if a value `X` is NaN is an expression of the form `X !== X`. The result will be true if and only if `X` is NaN.

### 19.2.4 parseFloat ( `string` )

This function produces a Number value dictated by interpretation of the contents of the `string` argument as a decimal literal.

It is the %parseFloat% intrinsic object.

It performs the following steps when called:

1.  Let `inputString` be ? [ToString](#sec-tostring)(`string`).
2.  Let `trimmedString` be ! [TrimString](#sec-trimstring)(`inputString`, start).
3.  Let `trimmed` be [StringToCodePoints](#sec-stringtocodepoints)(`trimmedString`).
4.  Let `trimmedPrefix` be the longest prefix of `trimmed` that satisfies the syntax of a [StrDecimalLiteral](#prod-StrDecimalLiteral), which might be `trimmed` itself. If there is no such prefix, return NaN.
5.  Let `parsedNumber` be [ParseText](#sec-parsetext)(`trimmedPrefix`, [StrDecimalLiteral](#prod-StrDecimalLiteral)).
6.  [Assert](#assert): `parsedNumber` is a [Parse Node](#sec-syntactic-grammar).
7.  Return the [StringNumericValue](#sec-runtime-semantics-stringnumericvalue) of `parsedNumber`.

Note

This function may interpret only a leading portion of `string` as a Number value; it ignores any code units that cannot be interpreted as part of the notation of a decimal literal, and no indication is given that any such code units were ignored.

### 19.2.5 parseInt ( `string`, `radix` )

This function produces an [integral Number](#integral-number) dictated by interpretation of the contents of `string` according to the specified `radix`. Leading white space in `string` is ignored. If `radix` coerces to 0 (such as when it is undefined), it is assumed to be 10 except when the number representation begins with "0x" or "0X", in which case it is assumed to be 16. If `radix` is 16, the number representation may optionally begin with "0x" or "0X".

It is the %parseInt% intrinsic object.

It performs the following steps when called:

1.  Let `inputString` be ? [ToString](#sec-tostring)(`string`).
2.  Let `S` be ! [TrimString](#sec-trimstring)(`inputString`, start).
3.  Let `sign` be 1.
4.  If `S` is not empty and the first code unit of `S` is the code unit 0x002D (HYPHEN-MINUS), set `sign` to -1.
5.  If `S` is not empty and the first code unit of `S` is either the code unit 0x002B (PLUS SIGN) or the code unit 0x002D (HYPHEN-MINUS), set `S` to the [substring](#substring) of `S` from index 1.
6.  Let `R` be [ℝ](#ℝ)(? [ToInt32](#sec-toint32)(`radix`)).
7.  Let `stripPrefix` be true.
8.  If `R` ≠ 0, then
    1.  If `R` \< 2 or `R` \> 36, return NaN.
    2.  If `R` ≠ 16, set `stripPrefix` to false.
9.  Else,
    1.  Set `R` to 10.
10. If `stripPrefix` is true, then
    1.  If the length of `S` is at least 2 and the first two code units of `S` are either "0x" or "0X", then
        1.  Set `S` to the [substring](#substring) of `S` from index 2.
        2.  Set `R` to 16.
11. If `S` contains a code unit that is not a radix-`R` digit, let `end` be the index within `S` of the first such code unit; otherwise, let `end` be the length of `S`.
12. Let `Z` be the [substring](#substring) of `S` from 0 to `end`.
13. If `Z` is empty, return NaN.
14. Let `mathInt` be the [integer](#integer) value that is represented by `Z` in radix-`R` notation, using the letters **A** through **Z** and **a** through **z** for digits with values 10 through 35. (However, if `R` = 10 and `Z` contains more than 20 significant digits, every significant digit after the 20th may be replaced by a 0 digit, at the option of the implementation; and if `R` is not one of 2, 4, 8, 10, 16, or 32, then `mathInt` may be an [implementation-approximated](#implementation-approximated) [integer](#integer) representing the [integer](#integer) value denoted by `Z` in radix-`R` notation.)
15. If `mathInt` = 0, then
    1.  If `sign` = -1, return -0_(𝔽).
    2.  Return +0_(𝔽).
16. Return [𝔽](#𝔽)(`sign` × `mathInt`).

Note

This function may interpret only a leading portion of `string` as an [integer](#integer) value; it ignores any code units that cannot be interpreted as part of the notation of an [integer](#integer), and no indication is given that any such code units were ignored.

### 19.2.6 URI Handling Functions

Uniform Resource Identifiers, or URIs, are Strings that identify resources (e.g. web pages or files) and transport protocols by which to access them (e.g. HTTP or FTP) on the Internet. The ECMAScript language itself does not provide any support for using URIs except for functions that encode and decode URIs as described in this section. `encodeURI` and `decodeURI` are intended to work with complete URIs; they assume that any reserved characters are intended to have special meaning (e.g., as delimiters) and so are not encoded. `encodeURIComponent` and `decodeURIComponent` are intended to work with the individual components of a URI; they assume that any reserved characters represent text and must be encoded to avoid special meaning when the component is part of a complete URI.

Note 1

The set of reserved characters is based upon RFC 2396 and does not reflect changes introduced by the more recent RFC 3986.

Note 2

Many implementations of ECMAScript provide additional functions and methods that manipulate web pages; these functions are beyond the scope of this standard.

#### 19.2.6.1 decodeURI ( `encodedURI` )

This function computes a new version of a URI in which each escape sequence and UTF-8 encoding of the sort that might be introduced by the `encodeURI` function is replaced with the UTF-16 encoding of the code point that it represents. Escape sequences that could not have been introduced by `encodeURI` are not replaced.

It is the %decodeURI% intrinsic object.

It performs the following steps when called:

1.  Let `uriString` be ? [ToString](#sec-tostring)(`encodedURI`).
2.  Let `preserveEscapeSet` be ";/?:@&=+\$,#".
3.  Return ? [Decode](#sec-decode)(`uriString`, `preserveEscapeSet`).

#### 19.2.6.2 decodeURIComponent ( `encodedURIComponent` )

This function computes a new version of a URI in which each escape sequence and UTF-8 encoding of the sort that might be introduced by the `encodeURIComponent` function is replaced with the UTF-16 encoding of the code point that it represents.

It is the %decodeURIComponent% intrinsic object.

It performs the following steps when called:

1.  Let `componentString` be ? [ToString](#sec-tostring)(`encodedURIComponent`).
2.  Let `preserveEscapeSet` be the empty String.
3.  Return ? [Decode](#sec-decode)(`componentString`, `preserveEscapeSet`).

#### 19.2.6.3 encodeURI ( `uri` )

This function computes a new version of a UTF-16 encoded ([6.1.4](#sec-ecmascript-language-types-string-type)) URI in which each instance of certain code points is replaced by one, two, three, or four escape sequences representing the UTF-8 encoding of the code point.

It is the %encodeURI% intrinsic object.

It performs the following steps when called:

1.  Let `uriString` be ? [ToString](#sec-tostring)(`uri`).
2.  Let `extraUnescaped` be ";/?:@&=+\$,#".
3.  Return ? [Encode](#sec-encode)(`uriString`, `extraUnescaped`).

#### 19.2.6.4 encodeURIComponent ( `uriComponent` )

This function computes a new version of a UTF-16 encoded ([6.1.4](#sec-ecmascript-language-types-string-type)) URI in which each instance of certain code points is replaced by one, two, three, or four escape sequences representing the UTF-8 encoding of the code point.

It is the %encodeURIComponent% intrinsic object.

It performs the following steps when called:

1.  Let `componentString` be ? [ToString](#sec-tostring)(`uriComponent`).
2.  Let `extraUnescaped` be the empty String.
3.  Return ? [Encode](#sec-encode)(`componentString`, `extraUnescaped`).

#### 19.2.6.5 Encode ( `string`, `extraUnescaped` )

The abstract operation Encode takes arguments `string` (a String) and `extraUnescaped` (a String) and returns either a [normal completion containing](#sec-completion-record-specification-type) a String or a [throw completion](#sec-completion-record-specification-type). It performs URI encoding and escaping, interpreting `string` as a sequence of UTF-16 encoded code points as described in [6.1.4](#sec-ecmascript-language-types-string-type). If a character is identified as unreserved in RFC 2396 or appears in `extraUnescaped`, it is not escaped. It performs the following steps when called:

1.  Let `len` be the length of `string`.
2.  Let `R` be the empty String.
3.  Let `alwaysUnescaped` be the [string-concatenation](#string-concatenation) of [the ASCII word characters](#ASCII-word-characters) and "-.!~\*'()".
4.  Let `unescapedSet` be the [string-concatenation](#string-concatenation) of `alwaysUnescaped` and `extraUnescaped`.
5.  Let `k` be 0.
6.  Repeat, while `k` \< `len`,
    1.  Let `C` be the code unit at index `k` within `string`.
    2.  If `unescapedSet` contains `C`, then
        1.  Set `k` to `k` + 1.
        2.  Set `R` to the [string-concatenation](#string-concatenation) of `R` and `C`.
    3.  Else,
        1.  Let `cp` be [CodePointAt](#sec-codepointat)(`string`, `k`).
        2.  If `cp`.`[[IsUnpairedSurrogate]]` is true, throw a URIError exception.
        3.  Set `k` to `k` + `cp`.`[[CodeUnitCount]]`.
        4.  Let `Octets` be the [List](#sec-list-and-record-specification-type) of octets resulting by applying the UTF-8 transformation to `cp`.`[[CodePoint]]`.
        5.  For each element `octet` of `Octets`, do
            1.  Let `hex` be the String representation of `octet`, formatted as an uppercase hexadecimal number.
            2.  Set `R` to the [string-concatenation](#string-concatenation) of `R`, "%", and [StringPad](#sec-stringpad)(`hex`, 2, "0", start).
7.  Return `R`.

Note

Because percent-encoding is used to represent individual octets, a single code point may be expressed as multiple consecutive escape sequences (one for each of its 8-bit UTF-8 code units).

#### 19.2.6.6 Decode ( `string`, `preserveEscapeSet` )

The abstract operation Decode takes arguments `string` (a String) and `preserveEscapeSet` (a String) and returns either a [normal completion containing](#sec-completion-record-specification-type) a String or a [throw completion](#sec-completion-record-specification-type). It performs URI unescaping and decoding, preserving any escape sequences that correspond to Basic Latin characters in `preserveEscapeSet`. It performs the following steps when called:

1.  Let `len` be the length of `string`.
2.  Let `R` be the empty String.
3.  Let `k` be 0.
4.  Repeat, while `k` \< `len`,
    1.  Let `C` be the code unit at index `k` within `string`.
    2.  Let `S` be `C`.
    3.  If `C` is the code unit 0x0025 (PERCENT SIGN), then
        1.  If `k` + 3 \> `len`, throw a URIError exception.
        2.  Let `escape` be the [substring](#substring) of `string` from `k` to `k` + 3.
        3.  Let `B` be [ParseHexOctet](#sec-parsehexoctet)(`string`, `k` + 1).
        4.  If `B` is not an [integer](#integer), throw a URIError exception.
        5.  Set `k` to `k` + 2.
        6.  Let `n` be the number of leading 1 bits in `B`.
        7.  If `n` = 0, then
            1.  Let `asciiChar` be the code unit whose numeric value is `B`.
            2.  If `preserveEscapeSet` contains `asciiChar`, set `S` to `escape`. Otherwise, set `S` to `asciiChar`.
        8.  Else,
            1.  If `n` = 1 or `n` \> 4, throw a URIError exception.
            2.  Let `Octets` be « `B` ».
            3.  Let `j` be 1.
            4.  Repeat, while `j` \< `n`,
                1.  Set `k` to `k` + 1.
                2.  If `k` + 3 \> `len`, throw a URIError exception.
                3.  If the code unit at index `k` within `string` is not the code unit 0x0025 (PERCENT SIGN), throw a URIError exception.
                4.  Let `continuationByte` be [ParseHexOctet](#sec-parsehexoctet)(`string`, `k` + 1).
                5.  If `continuationByte` is not an [integer](#integer), throw a URIError exception.
                6.  Append `continuationByte` to `Octets`.
                7.  Set `k` to `k` + 2.
                8.  Set `j` to `j` + 1.
            5.  [Assert](#assert): The length of `Octets` is `n`.
            6.  If `Octets` does not contain a valid UTF-8 encoding of a Unicode code point, throw a URIError exception.
            7.  Let `V` be the code point obtained by applying the UTF-8 transformation to `Octets`, that is, from a [List](#sec-list-and-record-specification-type) of octets into a 21-bit value.
            8.  Set `S` to [UTF16EncodeCodePoint](#sec-utf16encodecodepoint)(`V`).
    4.  Set `R` to the [string-concatenation](#string-concatenation) of `R` and `S`.
    5.  Set `k` to `k` + 1.
5.  Return `R`.

Note

RFC 3629 prohibits the decoding of invalid UTF-8 octet sequences. For example, the invalid sequence 0xC0 0x80 must not decode into the code unit 0x0000. Implementations of the Decode algorithm are required to throw a URIError when encountering such invalid sequences.

#### 19.2.6.7 ParseHexOctet ( `string`, `position` )

The abstract operation ParseHexOctet takes arguments `string` (a String) and `position` (a non-negative [integer](#integer)) and returns either a non-negative [integer](#integer) or a non-empty [List](#sec-list-and-record-specification-type) of SyntaxError objects. It parses a sequence of two hexadecimal characters at the specified `position` in `string` into an unsigned 8-bit [integer](#integer). It performs the following steps when called:

1.  Let `len` be the length of `string`.
2.  [Assert](#assert): `position` + 2 ≤ `len`.
3.  Let `hexDigits` be the [substring](#substring) of `string` from `position` to `position` + 2.
4.  Let `parseResult` be [ParseText](#sec-parsetext)(`hexDigits`, [HexDigits](#prod-HexDigits)\[~Sep\]).
5.  If `parseResult` is not a [Parse Node](#sec-syntactic-grammar), return `parseResult`.
6.  Let `n` be the MV of `parseResult`.
7.  [Assert](#assert): `n` is in the [inclusive interval](#inclusive-interval) from 0 to 255.
8.  Return `n`.

## 19.3 Constructor Properties of the Global Object

### 19.3.1 AggregateError ( . . . )

See [20.5.7.1](#sec-aggregate-error-constructor).

### 19.3.2 Array ( . . . )

See [23.1.1](#sec-array-constructor).

### 19.3.3 ArrayBuffer ( . . . )

See [25.1.4](#sec-arraybuffer-constructor).

### 19.3.4 BigInt ( . . . )

See [21.2.1](#sec-bigint-constructor).

### 19.3.5 BigInt64Array ( . . . )

See [23.2.5](#sec-typedarray-constructors).

### 19.3.6 BigUint64Array ( . . . )

See [23.2.5](#sec-typedarray-constructors).

### 19.3.7 Boolean ( . . . )

See [20.3.1](#sec-boolean-constructor).

### 19.3.8 DataView ( . . . )

See [25.3.2](#sec-dataview-constructor).

### 19.3.9 Date ( . . . )

See [21.4.2](#sec-date-constructor).

### 19.3.10 Error ( . . . )

See [20.5.1](#sec-error-constructor).

### 19.3.11 EvalError ( . . . )

See [20.5.5.1](#sec-native-error-types-used-in-this-standard-evalerror).

### 19.3.12 FinalizationRegistry ( . . . )

See [26.2.1](#sec-finalization-registry-constructor).

### 19.3.13 Float16Array ( . . . )

See [23.2.5](#sec-typedarray-constructors).

### 19.3.14 Float32Array ( . . . )

See [23.2.5](#sec-typedarray-constructors).

### 19.3.15 Float64Array ( . . . )

See [23.2.5](#sec-typedarray-constructors).

### 19.3.16 Function ( . . . )

See [20.2.1](#sec-function-constructor).

### 19.3.17 Int8Array ( . . . )

See [23.2.5](#sec-typedarray-constructors).

### 19.3.18 Int16Array ( . . . )

See [23.2.5](#sec-typedarray-constructors).

### 19.3.19 Int32Array ( . . . )

See [23.2.5](#sec-typedarray-constructors).

### 19.3.20 Iterator ( . . . )

See [27.1.3.1](#sec-iterator-constructor).

### 19.3.21 Map ( . . . )

See [24.1.1](#sec-map-constructor).

### 19.3.22 Number ( . . . )

See [21.1.1](#sec-number-constructor).

### 19.3.23 Object ( . . . )

See [20.1.1](#sec-object-constructor).

### 19.3.24 Promise ( . . . )

See [27.2.3](#sec-promise-constructor).

### 19.3.25 Proxy ( . . . )

See [28.2.1](#sec-proxy-constructor).

### 19.3.26 RangeError ( . . . )

See [20.5.5.2](#sec-native-error-types-used-in-this-standard-rangeerror).

### 19.3.27 ReferenceError ( . . . )

See [20.5.5.3](#sec-native-error-types-used-in-this-standard-referenceerror).

### 19.3.28 RegExp ( . . . )

See [22.2.4](#sec-regexp-constructor).

### 19.3.29 Set ( . . . )

See [24.2.2](#sec-set-constructor).

### 19.3.30 SharedArrayBuffer ( . . . )

See [25.2.3](#sec-sharedarraybuffer-constructor).

### 19.3.31 String ( . . . )

See [22.1.1](#sec-string-constructor).

### 19.3.32 Symbol ( . . . )

See [20.4.1](#sec-symbol-constructor).

### 19.3.33 SyntaxError ( . . . )

See [20.5.5.4](#sec-native-error-types-used-in-this-standard-syntaxerror).

### 19.3.34 TypeError ( . . . )

See [20.5.5.5](#sec-native-error-types-used-in-this-standard-typeerror).

### 19.3.35 Uint8Array ( . . . )

See [23.2.5](#sec-typedarray-constructors).

### 19.3.36 Uint8ClampedArray ( . . . )

See [23.2.5](#sec-typedarray-constructors).

### 19.3.37 Uint16Array ( . . . )

See [23.2.5](#sec-typedarray-constructors).

### 19.3.38 Uint32Array ( . . . )

See [23.2.5](#sec-typedarray-constructors).

### 19.3.39 URIError ( . . . )

See [20.5.5.6](#sec-native-error-types-used-in-this-standard-urierror).

### 19.3.40 WeakMap ( . . . )

See [24.3.1](#sec-weakmap-constructor).

### 19.3.41 WeakRef ( . . . )

See [26.1.1](#sec-weak-ref-constructor).

### 19.3.42 WeakSet ( . . . )

See [24.4](#sec-weakset-objects).

## 19.4 Other Properties of the Global Object

### 19.4.1 Atomics

See [25.4](#sec-atomics-object).

### 19.4.2 JSON

See [25.5](#sec-json-object).

### 19.4.3 Math

See [21.3](#sec-math-object).

### 19.4.4 Reflect

See [28.1](#sec-reflect-object).
