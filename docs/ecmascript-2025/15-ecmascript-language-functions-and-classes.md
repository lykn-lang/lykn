# 15 ECMAScript Language: Functions and Classes

Note

Various ECMAScript language elements cause the creation of ECMAScript [function objects](#function-object) ([10.2](#sec-ecmascript-function-objects)). [Evaluation](#sec-evaluation) of such functions starts with the execution of their `[[Call]]` internal method ([10.2.1](#sec-ecmascript-function-objects-call-thisargument-argumentslist)).

## 15.1 Parameter Lists

### Syntax

[UniqueFormalParameters](#prod-UniqueFormalParameters)\[Yield, Await\] : [FormalParameters](#prod-FormalParameters)\[?Yield, ?Await\] [FormalParameters](#prod-FormalParameters)\[Yield, Await\] : \[empty\] [FunctionRestParameter](#prod-FunctionRestParameter)\[?Yield, ?Await\] [FormalParameterList](#prod-FormalParameterList)\[?Yield, ?Await\] [FormalParameterList](#prod-FormalParameterList)\[?Yield, ?Await\] , [FormalParameterList](#prod-FormalParameterList)\[?Yield, ?Await\] , [FunctionRestParameter](#prod-FunctionRestParameter)\[?Yield, ?Await\] [FormalParameterList](#prod-FormalParameterList)\[Yield, Await\] : [FormalParameter](#prod-FormalParameter)\[?Yield, ?Await\] [FormalParameterList](#prod-FormalParameterList)\[?Yield, ?Await\] , [FormalParameter](#prod-FormalParameter)\[?Yield, ?Await\] [FunctionRestParameter](#prod-FunctionRestParameter)\[Yield, Await\] : [BindingRestElement](#prod-BindingRestElement)\[?Yield, ?Await\] [FormalParameter](#prod-FormalParameter)\[Yield, Await\] : [BindingElement](#prod-BindingElement)\[?Yield, ?Await\]

### 15.1.1 Static Semantics: Early Errors

[UniqueFormalParameters](#prod-UniqueFormalParameters) : [FormalParameters](#prod-FormalParameters)

- It is a Syntax Error if the [BoundNames](#sec-static-semantics-boundnames) of [FormalParameters](#prod-FormalParameters) contains any duplicate elements.

[FormalParameters](#prod-FormalParameters) : [FormalParameterList](#prod-FormalParameterList)

- It is a Syntax Error if [IsSimpleParameterList](#sec-static-semantics-issimpleparameterlist) of [FormalParameterList](#prod-FormalParameterList) is false and the [BoundNames](#sec-static-semantics-boundnames) of [FormalParameterList](#prod-FormalParameterList) contains any duplicate elements.

Note

Multiple occurrences of the same [BindingIdentifier](#prod-BindingIdentifier) in a [FormalParameterList](#prod-FormalParameterList) is only allowed for functions which have simple parameter lists and which are not defined in [strict mode code](#sec-strict-mode-code).

### 15.1.2 Static Semantics: ContainsExpression

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) ContainsExpression takes no arguments and returns a Boolean. It is defined piecewise over the following productions:

[ObjectBindingPattern](#prod-ObjectBindingPattern) : { } { [BindingRestProperty](#prod-BindingRestProperty) }

1.  Return false.

[ObjectBindingPattern](#prod-ObjectBindingPattern) : { [BindingPropertyList](#prod-BindingPropertyList) , [BindingRestProperty](#prod-BindingRestProperty) }

1.  Return [ContainsExpression](#sec-static-semantics-containsexpression) of [BindingPropertyList](#prod-BindingPropertyList).

[ArrayBindingPattern](#prod-ArrayBindingPattern) : \[ [Elision](#prod-Elision)opt \]

1.  Return false.

[ArrayBindingPattern](#prod-ArrayBindingPattern) : \[ [Elision](#prod-Elision)opt [BindingRestElement](#prod-BindingRestElement) \]

1.  Return [ContainsExpression](#sec-static-semantics-containsexpression) of [BindingRestElement](#prod-BindingRestElement).

[ArrayBindingPattern](#prod-ArrayBindingPattern) : \[ [BindingElementList](#prod-BindingElementList) , [Elision](#prod-Elision)opt \]

1.  Return [ContainsExpression](#sec-static-semantics-containsexpression) of [BindingElementList](#prod-BindingElementList).

[ArrayBindingPattern](#prod-ArrayBindingPattern) : \[ [BindingElementList](#prod-BindingElementList) , [Elision](#prod-Elision)opt [BindingRestElement](#prod-BindingRestElement) \]

1.  Let `has` be [ContainsExpression](#sec-static-semantics-containsexpression) of [BindingElementList](#prod-BindingElementList).
2.  If `has` is true, return true.
3.  Return [ContainsExpression](#sec-static-semantics-containsexpression) of [BindingRestElement](#prod-BindingRestElement).

[BindingPropertyList](#prod-BindingPropertyList) : [BindingPropertyList](#prod-BindingPropertyList) , [BindingProperty](#prod-BindingProperty)

1.  Let `has` be [ContainsExpression](#sec-static-semantics-containsexpression) of [BindingPropertyList](#prod-BindingPropertyList).
2.  If `has` is true, return true.
3.  Return [ContainsExpression](#sec-static-semantics-containsexpression) of [BindingProperty](#prod-BindingProperty).

[BindingElementList](#prod-BindingElementList) : [BindingElementList](#prod-BindingElementList) , [BindingElisionElement](#prod-BindingElisionElement)

1.  Let `has` be [ContainsExpression](#sec-static-semantics-containsexpression) of [BindingElementList](#prod-BindingElementList).
2.  If `has` is true, return true.
3.  Return [ContainsExpression](#sec-static-semantics-containsexpression) of [BindingElisionElement](#prod-BindingElisionElement).

[BindingElisionElement](#prod-BindingElisionElement) : [Elision](#prod-Elision)opt [BindingElement](#prod-BindingElement)

1.  Return [ContainsExpression](#sec-static-semantics-containsexpression) of [BindingElement](#prod-BindingElement).

[BindingProperty](#prod-BindingProperty) : [PropertyName](#prod-PropertyName) : [BindingElement](#prod-BindingElement)

1.  Let `has` be [IsComputedPropertyKey](#sec-static-semantics-iscomputedpropertykey) of [PropertyName](#prod-PropertyName).
2.  If `has` is true, return true.
3.  Return [ContainsExpression](#sec-static-semantics-containsexpression) of [BindingElement](#prod-BindingElement).

[BindingElement](#prod-BindingElement) : [BindingPattern](#prod-BindingPattern) [Initializer](#prod-Initializer)

1.  Return true.

[SingleNameBinding](#prod-SingleNameBinding) : [BindingIdentifier](#prod-BindingIdentifier)

1.  Return false.

[SingleNameBinding](#prod-SingleNameBinding) : [BindingIdentifier](#prod-BindingIdentifier) [Initializer](#prod-Initializer)

1.  Return true.

[BindingRestElement](#prod-BindingRestElement) : ... [BindingIdentifier](#prod-BindingIdentifier)

1.  Return false.

[BindingRestElement](#prod-BindingRestElement) : ... [BindingPattern](#prod-BindingPattern)

1.  Return [ContainsExpression](#sec-static-semantics-containsexpression) of [BindingPattern](#prod-BindingPattern).

[FormalParameters](#prod-FormalParameters) : \[empty\]

1.  Return false.

[FormalParameters](#prod-FormalParameters) : [FormalParameterList](#prod-FormalParameterList) , [FunctionRestParameter](#prod-FunctionRestParameter)

1.  If [ContainsExpression](#sec-static-semantics-containsexpression) of [FormalParameterList](#prod-FormalParameterList) is true, return true.
2.  Return [ContainsExpression](#sec-static-semantics-containsexpression) of [FunctionRestParameter](#prod-FunctionRestParameter).

[FormalParameterList](#prod-FormalParameterList) : [FormalParameterList](#prod-FormalParameterList) , [FormalParameter](#prod-FormalParameter)

1.  If [ContainsExpression](#sec-static-semantics-containsexpression) of [FormalParameterList](#prod-FormalParameterList) is true, return true.
2.  Return [ContainsExpression](#sec-static-semantics-containsexpression) of [FormalParameter](#prod-FormalParameter).

[ArrowParameters](#prod-ArrowParameters) : [BindingIdentifier](#prod-BindingIdentifier)

1.  Return false.

[ArrowParameters](#prod-ArrowParameters) : [CoverParenthesizedExpressionAndArrowParameterList](#prod-CoverParenthesizedExpressionAndArrowParameterList)

1.  Let `formals` be the [ArrowFormalParameters](#prod-ArrowFormalParameters) that is [covered](#sec-syntactic-grammar) by [CoverParenthesizedExpressionAndArrowParameterList](#prod-CoverParenthesizedExpressionAndArrowParameterList).
2.  Return [ContainsExpression](#sec-static-semantics-containsexpression) of `formals`.

[AsyncArrowBindingIdentifier](#prod-AsyncArrowBindingIdentifier) : [BindingIdentifier](#prod-BindingIdentifier)

1.  Return false.

### 15.1.3 Static Semantics: IsSimpleParameterList

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) IsSimpleParameterList takes no arguments and returns a Boolean. It is defined piecewise over the following productions:

[BindingElement](#prod-BindingElement) : [BindingPattern](#prod-BindingPattern)

1.  Return false.

[BindingElement](#prod-BindingElement) : [BindingPattern](#prod-BindingPattern) [Initializer](#prod-Initializer)

1.  Return false.

[SingleNameBinding](#prod-SingleNameBinding) : [BindingIdentifier](#prod-BindingIdentifier)

1.  Return true.

[SingleNameBinding](#prod-SingleNameBinding) : [BindingIdentifier](#prod-BindingIdentifier) [Initializer](#prod-Initializer)

1.  Return false.

[FormalParameters](#prod-FormalParameters) : \[empty\]

1.  Return true.

[FormalParameters](#prod-FormalParameters) : [FunctionRestParameter](#prod-FunctionRestParameter)

1.  Return false.

[FormalParameters](#prod-FormalParameters) : [FormalParameterList](#prod-FormalParameterList) , [FunctionRestParameter](#prod-FunctionRestParameter)

1.  Return false.

[FormalParameterList](#prod-FormalParameterList) : [FormalParameterList](#prod-FormalParameterList) , [FormalParameter](#prod-FormalParameter)

1.  If [IsSimpleParameterList](#sec-static-semantics-issimpleparameterlist) of [FormalParameterList](#prod-FormalParameterList) is false, return false.
2.  Return [IsSimpleParameterList](#sec-static-semantics-issimpleparameterlist) of [FormalParameter](#prod-FormalParameter).

[FormalParameter](#prod-FormalParameter) : [BindingElement](#prod-BindingElement)

1.  Return [IsSimpleParameterList](#sec-static-semantics-issimpleparameterlist) of [BindingElement](#prod-BindingElement).

[ArrowParameters](#prod-ArrowParameters) : [BindingIdentifier](#prod-BindingIdentifier)

1.  Return true.

[ArrowParameters](#prod-ArrowParameters) : [CoverParenthesizedExpressionAndArrowParameterList](#prod-CoverParenthesizedExpressionAndArrowParameterList)

1.  Let `formals` be the [ArrowFormalParameters](#prod-ArrowFormalParameters) that is [covered](#sec-syntactic-grammar) by [CoverParenthesizedExpressionAndArrowParameterList](#prod-CoverParenthesizedExpressionAndArrowParameterList).
2.  Return [IsSimpleParameterList](#sec-static-semantics-issimpleparameterlist) of `formals`.

[AsyncArrowBindingIdentifier](#prod-AsyncArrowBindingIdentifier) : [BindingIdentifier](#prod-BindingIdentifier)

1.  Return true.

[CoverCallExpressionAndAsyncArrowHead](#prod-CoverCallExpressionAndAsyncArrowHead) : [MemberExpression](#prod-MemberExpression) [Arguments](#prod-Arguments)

1.  Let `head` be the [AsyncArrowHead](#prod-AsyncArrowHead) that is [covered](#sec-syntactic-grammar) by [CoverCallExpressionAndAsyncArrowHead](#prod-CoverCallExpressionAndAsyncArrowHead).
2.  Return [IsSimpleParameterList](#sec-static-semantics-issimpleparameterlist) of `head`.

### 15.1.4 Static Semantics: HasInitializer

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) HasInitializer takes no arguments and returns a Boolean. It is defined piecewise over the following productions:

[BindingElement](#prod-BindingElement) : [BindingPattern](#prod-BindingPattern)

1.  Return false.

[BindingElement](#prod-BindingElement) : [BindingPattern](#prod-BindingPattern) [Initializer](#prod-Initializer)

1.  Return true.

[SingleNameBinding](#prod-SingleNameBinding) : [BindingIdentifier](#prod-BindingIdentifier)

1.  Return false.

[SingleNameBinding](#prod-SingleNameBinding) : [BindingIdentifier](#prod-BindingIdentifier) [Initializer](#prod-Initializer)

1.  Return true.

[FormalParameterList](#prod-FormalParameterList) : [FormalParameterList](#prod-FormalParameterList) , [FormalParameter](#prod-FormalParameter)

1.  If [HasInitializer](#sec-static-semantics-hasinitializer) of [FormalParameterList](#prod-FormalParameterList) is true, return true.
2.  Return [HasInitializer](#sec-static-semantics-hasinitializer) of [FormalParameter](#prod-FormalParameter).

### 15.1.5 Static Semantics: ExpectedArgumentCount

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) ExpectedArgumentCount takes no arguments and returns a non-negative [integer](#integer). It is defined piecewise over the following productions:

[FormalParameters](#prod-FormalParameters) : \[empty\] [FunctionRestParameter](#prod-FunctionRestParameter)

1.  Return 0.

[FormalParameters](#prod-FormalParameters) : [FormalParameterList](#prod-FormalParameterList) , [FunctionRestParameter](#prod-FunctionRestParameter)

1.  Return the [ExpectedArgumentCount](#sec-static-semantics-expectedargumentcount) of [FormalParameterList](#prod-FormalParameterList).

Note

The ExpectedArgumentCount of a [FormalParameterList](#prod-FormalParameterList) is the number of [FormalParameters](#prod-FormalParameters) to the left of either the rest parameter or the first [FormalParameter](#prod-FormalParameter) with an Initializer. A [FormalParameter](#prod-FormalParameter) without an initializer is allowed after the first parameter with an initializer but such parameters are considered to be optional with undefined as their default value.

[FormalParameterList](#prod-FormalParameterList) : [FormalParameter](#prod-FormalParameter)

1.  If [HasInitializer](#sec-static-semantics-hasinitializer) of [FormalParameter](#prod-FormalParameter) is true, return 0.
2.  Return 1.

[FormalParameterList](#prod-FormalParameterList) : [FormalParameterList](#prod-FormalParameterList) , [FormalParameter](#prod-FormalParameter)

1.  Let `count` be the [ExpectedArgumentCount](#sec-static-semantics-expectedargumentcount) of [FormalParameterList](#prod-FormalParameterList).
2.  If [HasInitializer](#sec-static-semantics-hasinitializer) of [FormalParameterList](#prod-FormalParameterList) is true or [HasInitializer](#sec-static-semantics-hasinitializer) of [FormalParameter](#prod-FormalParameter) is true, return `count`.
3.  Return `count` + 1.

[ArrowParameters](#prod-ArrowParameters) : [BindingIdentifier](#prod-BindingIdentifier)

1.  Return 1.

[ArrowParameters](#prod-ArrowParameters) : [CoverParenthesizedExpressionAndArrowParameterList](#prod-CoverParenthesizedExpressionAndArrowParameterList)

1.  Let `formals` be the [ArrowFormalParameters](#prod-ArrowFormalParameters) that is [covered](#sec-syntactic-grammar) by [CoverParenthesizedExpressionAndArrowParameterList](#prod-CoverParenthesizedExpressionAndArrowParameterList).
2.  Return the [ExpectedArgumentCount](#sec-static-semantics-expectedargumentcount) of `formals`.

[PropertySetParameterList](#prod-PropertySetParameterList) : [FormalParameter](#prod-FormalParameter)

1.  If [HasInitializer](#sec-static-semantics-hasinitializer) of [FormalParameter](#prod-FormalParameter) is true, return 0.
2.  Return 1.

[AsyncArrowBindingIdentifier](#prod-AsyncArrowBindingIdentifier) : [BindingIdentifier](#prod-BindingIdentifier)

1.  Return 1.

## 15.2 Function Definitions

### Syntax

[FunctionDeclaration](#prod-FunctionDeclaration)\[Yield, Await, Default\] : function [BindingIdentifier](#prod-BindingIdentifier)\[?Yield, ?Await\] ( [FormalParameters](#prod-FormalParameters)\[~Yield, ~Await\] ) { [FunctionBody](#prod-FunctionBody)\[~Yield, ~Await\] } \[+Default\] function ( [FormalParameters](#prod-FormalParameters)\[~Yield, ~Await\] ) { [FunctionBody](#prod-FunctionBody)\[~Yield, ~Await\] } [FunctionExpression](#prod-FunctionExpression) : function [BindingIdentifier](#prod-BindingIdentifier)\[~Yield, ~Await\]opt ( [FormalParameters](#prod-FormalParameters)\[~Yield, ~Await\] ) { [FunctionBody](#prod-FunctionBody)\[~Yield, ~Await\] } [FunctionBody](#prod-FunctionBody)\[Yield, Await\] : [FunctionStatementList](#prod-FunctionStatementList)\[?Yield, ?Await\] [FunctionStatementList](#prod-FunctionStatementList)\[Yield, Await\] : [StatementList](#prod-StatementList)\[?Yield, ?Await, +Return\]opt

### 15.2.1 Static Semantics: Early Errors

[FunctionDeclaration](#prod-FunctionDeclaration) : function [BindingIdentifier](#prod-BindingIdentifier) ( [FormalParameters](#prod-FormalParameters) ) { [FunctionBody](#prod-FunctionBody) } function ( [FormalParameters](#prod-FormalParameters) ) { [FunctionBody](#prod-FunctionBody) } [FunctionExpression](#prod-FunctionExpression) : function [BindingIdentifier](#prod-BindingIdentifier)opt ( [FormalParameters](#prod-FormalParameters) ) { [FunctionBody](#prod-FunctionBody) }

- If [IsStrict](#sec-isstrict)([FormalParameters](#prod-FormalParameters)) is true, the Early Error rules for [UniqueFormalParameters](#prod-UniqueFormalParameters) : [FormalParameters](#prod-FormalParameters) are applied.
- If [BindingIdentifier](#prod-BindingIdentifier) is present and [IsStrict](#sec-isstrict)([BindingIdentifier](#prod-BindingIdentifier)) is true, it is a Syntax Error if the [StringValue](#sec-static-semantics-stringvalue) of [BindingIdentifier](#prod-BindingIdentifier) is either "eval" or "arguments".
- It is a Syntax Error if [FunctionBodyContainsUseStrict](#sec-static-semantics-functionbodycontainsusestrict) of [FunctionBody](#prod-FunctionBody) is true and [IsSimpleParameterList](#sec-static-semantics-issimpleparameterlist) of [FormalParameters](#prod-FormalParameters) is false.
- It is a Syntax Error if any element of the [BoundNames](#sec-static-semantics-boundnames) of [FormalParameters](#prod-FormalParameters) also occurs in the [LexicallyDeclaredNames](#sec-static-semantics-lexicallydeclarednames) of [FunctionBody](#prod-FunctionBody).
- It is a Syntax Error if [FormalParameters](#prod-FormalParameters) [Contains](#sec-static-semantics-contains) [SuperProperty](#prod-SuperProperty) is true.
- It is a Syntax Error if [FunctionBody](#prod-FunctionBody) [Contains](#sec-static-semantics-contains) [SuperProperty](#prod-SuperProperty) is true.
- It is a Syntax Error if [FormalParameters](#prod-FormalParameters) [Contains](#sec-static-semantics-contains) [SuperCall](#prod-SuperCall) is true.
- It is a Syntax Error if [FunctionBody](#prod-FunctionBody) [Contains](#sec-static-semantics-contains) [SuperCall](#prod-SuperCall) is true.

Note

The [LexicallyDeclaredNames](#sec-static-semantics-lexicallydeclarednames) of a [FunctionBody](#prod-FunctionBody) does not include identifiers bound using var or function declarations.

[FunctionBody](#prod-FunctionBody) : [FunctionStatementList](#prod-FunctionStatementList)

- It is a Syntax Error if the [LexicallyDeclaredNames](#sec-static-semantics-lexicallydeclarednames) of [FunctionStatementList](#prod-FunctionStatementList) contains any duplicate entries.
- It is a Syntax Error if any element of the [LexicallyDeclaredNames](#sec-static-semantics-lexicallydeclarednames) of [FunctionStatementList](#prod-FunctionStatementList) also occurs in the [VarDeclaredNames](#sec-static-semantics-vardeclarednames) of [FunctionStatementList](#prod-FunctionStatementList).
- It is a Syntax Error if [ContainsDuplicateLabels](#sec-static-semantics-containsduplicatelabels) of [FunctionStatementList](#prod-FunctionStatementList) with argument « » is true.
- It is a Syntax Error if [ContainsUndefinedBreakTarget](#sec-static-semantics-containsundefinedbreaktarget) of [FunctionStatementList](#prod-FunctionStatementList) with argument « » is true.
- It is a Syntax Error if [ContainsUndefinedContinueTarget](#sec-static-semantics-containsundefinedcontinuetarget) of [FunctionStatementList](#prod-FunctionStatementList) with arguments « » and « » is true.

### 15.2.2 Static Semantics: FunctionBodyContainsUseStrict

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) FunctionBodyContainsUseStrict takes no arguments and returns a Boolean. It is defined piecewise over the following productions:

[FunctionBody](#prod-FunctionBody) : [FunctionStatementList](#prod-FunctionStatementList)

1.  If the [Directive Prologue](#directive-prologue) of [FunctionBody](#prod-FunctionBody) contains a [Use Strict Directive](#use-strict-directive), return true; otherwise, return false.

### 15.2.3 Runtime Semantics: EvaluateFunctionBody

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) EvaluateFunctionBody takes arguments `functionObject` (an ECMAScript [function object](#function-object)) and `argumentsList` (a [List](#sec-list-and-record-specification-type) of [ECMAScript language values](#sec-ecmascript-language-types)) and returns a [return completion](#sec-completion-record-specification-type) or a [throw completion](#sec-completion-record-specification-type). It is defined piecewise over the following productions:

[FunctionBody](#prod-FunctionBody) : [FunctionStatementList](#prod-FunctionStatementList)

1.  Perform ? [FunctionDeclarationInstantiation](#sec-functiondeclarationinstantiation)(`functionObject`, `argumentsList`).
2.  Perform ? [Evaluation](#sec-evaluation) of [FunctionStatementList](#prod-FunctionStatementList).
3.  NOTE: If the previous step resulted in a [normal completion](#sec-completion-record-specification-type), then evaluation finished by proceeding past the end of the [FunctionStatementList](#prod-FunctionStatementList).
4.  Return [ReturnCompletion](#sec-returncompletion)(undefined).

### 15.2.4 Runtime Semantics: InstantiateOrdinaryFunctionObject

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) InstantiateOrdinaryFunctionObject takes arguments `env` (an [Environment Record](#sec-environment-records)) and `privateEnv` (a [PrivateEnvironment Record](#privateenvironment-record) or null) and returns an ECMAScript [function object](#function-object). It is defined piecewise over the following productions:

[FunctionDeclaration](#prod-FunctionDeclaration) : function [BindingIdentifier](#prod-BindingIdentifier) ( [FormalParameters](#prod-FormalParameters) ) { [FunctionBody](#prod-FunctionBody) }

1.  Let `name` be the [StringValue](#sec-static-semantics-stringvalue) of [BindingIdentifier](#prod-BindingIdentifier).
2.  Let `sourceText` be the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) [FunctionDeclaration](#prod-FunctionDeclaration).
3.  Let `F` be [OrdinaryFunctionCreate](#sec-ordinaryfunctioncreate)([%Function.prototype%](#sec-properties-of-the-function-prototype-object), `sourceText`, [FormalParameters](#prod-FormalParameters), [FunctionBody](#prod-FunctionBody), non-lexical-this, `env`, `privateEnv`).
4.  Perform [SetFunctionName](#sec-setfunctionname)(`F`, `name`).
5.  Perform [MakeConstructor](#sec-makeconstructor)(`F`).
6.  Return `F`.

[FunctionDeclaration](#prod-FunctionDeclaration) : function ( [FormalParameters](#prod-FormalParameters) ) { [FunctionBody](#prod-FunctionBody) }

1.  Let `sourceText` be the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) [FunctionDeclaration](#prod-FunctionDeclaration).
2.  Let `F` be [OrdinaryFunctionCreate](#sec-ordinaryfunctioncreate)([%Function.prototype%](#sec-properties-of-the-function-prototype-object), `sourceText`, [FormalParameters](#prod-FormalParameters), [FunctionBody](#prod-FunctionBody), non-lexical-this, `env`, `privateEnv`).
3.  Perform [SetFunctionName](#sec-setfunctionname)(`F`, "default").
4.  Perform [MakeConstructor](#sec-makeconstructor)(`F`).
5.  Return `F`.

Note

An anonymous [FunctionDeclaration](#prod-FunctionDeclaration) can only occur as part of an `export default` declaration, and its function code is therefore always [strict mode code](#sec-strict-mode-code).

### 15.2.5 Runtime Semantics: InstantiateOrdinaryFunctionExpression

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) InstantiateOrdinaryFunctionExpression takes optional argument `name` (a [property key](#property-key) or a [Private Name](#sec-private-names)) and returns an ECMAScript [function object](#function-object). It is defined piecewise over the following productions:

[FunctionExpression](#prod-FunctionExpression) : function ( [FormalParameters](#prod-FormalParameters) ) { [FunctionBody](#prod-FunctionBody) }

1.  If `name` is not present, set `name` to "".
2.  Let `env` be the LexicalEnvironment of the [running execution context](#running-execution-context).
3.  Let `privateEnv` be the [running execution context](#running-execution-context)'s PrivateEnvironment.
4.  Let `sourceText` be the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) [FunctionExpression](#prod-FunctionExpression).
5.  Let `closure` be [OrdinaryFunctionCreate](#sec-ordinaryfunctioncreate)([%Function.prototype%](#sec-properties-of-the-function-prototype-object), `sourceText`, [FormalParameters](#prod-FormalParameters), [FunctionBody](#prod-FunctionBody), non-lexical-this, `env`, `privateEnv`).
6.  Perform [SetFunctionName](#sec-setfunctionname)(`closure`, `name`).
7.  Perform [MakeConstructor](#sec-makeconstructor)(`closure`).
8.  Return `closure`.

[FunctionExpression](#prod-FunctionExpression) : function [BindingIdentifier](#prod-BindingIdentifier) ( [FormalParameters](#prod-FormalParameters) ) { [FunctionBody](#prod-FunctionBody) }

1.  [Assert](#assert): `name` is not present.
2.  Set `name` to the [StringValue](#sec-static-semantics-stringvalue) of [BindingIdentifier](#prod-BindingIdentifier).
3.  Let `outerEnv` be the [running execution context](#running-execution-context)'s LexicalEnvironment.
4.  Let `funcEnv` be [NewDeclarativeEnvironment](#sec-newdeclarativeenvironment)(`outerEnv`).
5.  Perform ! `funcEnv`.CreateImmutableBinding(`name`, false).
6.  Let `privateEnv` be the [running execution context](#running-execution-context)'s PrivateEnvironment.
7.  Let `sourceText` be the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) [FunctionExpression](#prod-FunctionExpression).
8.  Let `closure` be [OrdinaryFunctionCreate](#sec-ordinaryfunctioncreate)([%Function.prototype%](#sec-properties-of-the-function-prototype-object), `sourceText`, [FormalParameters](#prod-FormalParameters), [FunctionBody](#prod-FunctionBody), non-lexical-this, `funcEnv`, `privateEnv`).
9.  Perform [SetFunctionName](#sec-setfunctionname)(`closure`, `name`).
10. Perform [MakeConstructor](#sec-makeconstructor)(`closure`).
11. Perform ! `funcEnv`.InitializeBinding(`name`, `closure`).
12. Return `closure`.

Note

The [BindingIdentifier](#prod-BindingIdentifier) in a [FunctionExpression](#prod-FunctionExpression) can be referenced from inside the [FunctionExpression](#prod-FunctionExpression)'s [FunctionBody](#prod-FunctionBody) to allow the function to call itself recursively. However, unlike in a [FunctionDeclaration](#prod-FunctionDeclaration), the [BindingIdentifier](#prod-BindingIdentifier) in a [FunctionExpression](#prod-FunctionExpression) cannot be referenced from and does not affect the scope enclosing the [FunctionExpression](#prod-FunctionExpression).

### 15.2.6 Runtime Semantics: Evaluation

[FunctionDeclaration](#prod-FunctionDeclaration) : function [BindingIdentifier](#prod-BindingIdentifier) ( [FormalParameters](#prod-FormalParameters) ) { [FunctionBody](#prod-FunctionBody) }

1.  Return empty.

Note 1

An alternative semantics is provided in [B.3.2](#sec-block-level-function-declarations-web-legacy-compatibility-semantics).

[FunctionDeclaration](#prod-FunctionDeclaration) : function ( [FormalParameters](#prod-FormalParameters) ) { [FunctionBody](#prod-FunctionBody) }

1.  Return empty.

[FunctionExpression](#prod-FunctionExpression) : function [BindingIdentifier](#prod-BindingIdentifier)opt ( [FormalParameters](#prod-FormalParameters) ) { [FunctionBody](#prod-FunctionBody) }

1.  Return [InstantiateOrdinaryFunctionExpression](#sec-runtime-semantics-instantiateordinaryfunctionexpression) of [FunctionExpression](#prod-FunctionExpression).

Note 2

A "prototype" property is automatically created for every function defined using a [FunctionDeclaration](#prod-FunctionDeclaration) or [FunctionExpression](#prod-FunctionExpression), to allow for the possibility that the function will be used as a [constructor](#constructor).

[FunctionStatementList](#prod-FunctionStatementList) : \[empty\]

1.  Return undefined.

## 15.3 Arrow Function Definitions

### Syntax

[ArrowFunction](#prod-ArrowFunction)\[In, Yield, Await\] : [ArrowParameters](#prod-ArrowParameters)\[?Yield, ?Await\] \[no [LineTerminator](#prod-LineTerminator) here\] =\> [ConciseBody](#prod-ConciseBody)\[?In\] [ArrowParameters](#prod-ArrowParameters)\[Yield, Await\] : [BindingIdentifier](#prod-BindingIdentifier)\[?Yield, ?Await\] [CoverParenthesizedExpressionAndArrowParameterList](#prod-CoverParenthesizedExpressionAndArrowParameterList)\[?Yield, ?Await\] [ConciseBody](#prod-ConciseBody)\[In\] : \[lookahead ≠ {\] [ExpressionBody](#prod-ExpressionBody)\[?In, ~Await\] { [FunctionBody](#prod-FunctionBody)\[~Yield, ~Await\] } [ExpressionBody](#prod-ExpressionBody)\[In, Await\] : [AssignmentExpression](#prod-AssignmentExpression)\[?In, ~Yield, ?Await\]

### Supplemental Syntax

When processing an instance of the production  
[ArrowParameters](#prod-ArrowParameters)\[Yield, Await\] : [CoverParenthesizedExpressionAndArrowParameterList](#prod-CoverParenthesizedExpressionAndArrowParameterList)\[?Yield, ?Await\]  
the interpretation of [CoverParenthesizedExpressionAndArrowParameterList](#prod-CoverParenthesizedExpressionAndArrowParameterList) is refined using the following grammar:

[ArrowFormalParameters](#prod-ArrowFormalParameters)\[Yield, Await\] : ( [UniqueFormalParameters](#prod-UniqueFormalParameters)\[?Yield, ?Await\] )

### 15.3.1 Static Semantics: Early Errors

[ArrowFunction](#prod-ArrowFunction) : [ArrowParameters](#prod-ArrowParameters) =\> [ConciseBody](#prod-ConciseBody)

- It is a Syntax Error if [ArrowParameters](#prod-ArrowParameters) [Contains](#sec-static-semantics-contains) [YieldExpression](#prod-YieldExpression) is true.
- It is a Syntax Error if [ArrowParameters](#prod-ArrowParameters) [Contains](#sec-static-semantics-contains) [AwaitExpression](#prod-AwaitExpression) is true.
- It is a Syntax Error if [ConciseBodyContainsUseStrict](#sec-static-semantics-concisebodycontainsusestrict) of [ConciseBody](#prod-ConciseBody) is true and [IsSimpleParameterList](#sec-static-semantics-issimpleparameterlist) of [ArrowParameters](#prod-ArrowParameters) is false.
- It is a Syntax Error if any element of the [BoundNames](#sec-static-semantics-boundnames) of [ArrowParameters](#prod-ArrowParameters) also occurs in the [LexicallyDeclaredNames](#sec-static-semantics-lexicallydeclarednames) of [ConciseBody](#prod-ConciseBody).

[ArrowParameters](#prod-ArrowParameters) : [CoverParenthesizedExpressionAndArrowParameterList](#prod-CoverParenthesizedExpressionAndArrowParameterList)

- [CoverParenthesizedExpressionAndArrowParameterList](#prod-CoverParenthesizedExpressionAndArrowParameterList) [must cover](#must-cover) an [ArrowFormalParameters](#prod-ArrowFormalParameters).

### 15.3.2 Static Semantics: ConciseBodyContainsUseStrict

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) ConciseBodyContainsUseStrict takes no arguments and returns a Boolean. It is defined piecewise over the following productions:

[ConciseBody](#prod-ConciseBody) : [ExpressionBody](#prod-ExpressionBody)

1.  Return false.

[ConciseBody](#prod-ConciseBody) : { [FunctionBody](#prod-FunctionBody) }

1.  Return [FunctionBodyContainsUseStrict](#sec-static-semantics-functionbodycontainsusestrict) of [FunctionBody](#prod-FunctionBody).

### 15.3.3 Runtime Semantics: EvaluateConciseBody

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) EvaluateConciseBody takes arguments `functionObject` (an ECMAScript [function object](#function-object)) and `argumentsList` (a [List](#sec-list-and-record-specification-type) of [ECMAScript language values](#sec-ecmascript-language-types)) and returns a [return completion](#sec-completion-record-specification-type) or a [throw completion](#sec-completion-record-specification-type). It is defined piecewise over the following productions:

[ConciseBody](#prod-ConciseBody) : [ExpressionBody](#prod-ExpressionBody)

1.  Perform ? [FunctionDeclarationInstantiation](#sec-functiondeclarationinstantiation)(`functionObject`, `argumentsList`).
2.  Return ? [Evaluation](#sec-evaluation) of [ExpressionBody](#prod-ExpressionBody).

### 15.3.4 Runtime Semantics: InstantiateArrowFunctionExpression

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) InstantiateArrowFunctionExpression takes optional argument `name` (a [property key](#property-key) or a [Private Name](#sec-private-names)) and returns an ECMAScript [function object](#function-object). It is defined piecewise over the following productions:

[ArrowFunction](#prod-ArrowFunction) : [ArrowParameters](#prod-ArrowParameters) =\> [ConciseBody](#prod-ConciseBody)

1.  If `name` is not present, set `name` to "".
2.  Let `env` be the LexicalEnvironment of the [running execution context](#running-execution-context).
3.  Let `privateEnv` be the [running execution context](#running-execution-context)'s PrivateEnvironment.
4.  Let `sourceText` be the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) [ArrowFunction](#prod-ArrowFunction).
5.  Let `closure` be [OrdinaryFunctionCreate](#sec-ordinaryfunctioncreate)([%Function.prototype%](#sec-properties-of-the-function-prototype-object), `sourceText`, [ArrowParameters](#prod-ArrowParameters), [ConciseBody](#prod-ConciseBody), lexical-this, `env`, `privateEnv`).
6.  Perform [SetFunctionName](#sec-setfunctionname)(`closure`, `name`).
7.  Return `closure`.

Note

An [ArrowFunction](#prod-ArrowFunction) does not define local bindings for `arguments`, `super`, `this`, or `new.target`. Any reference to `arguments`, `super`, `this`, or `new.target` within an [ArrowFunction](#prod-ArrowFunction) must resolve to a binding in a lexically enclosing environment. Typically this will be the Function Environment of an immediately enclosing function. Even though an [ArrowFunction](#prod-ArrowFunction) may contain references to `super`, the [function object](#function-object) created in step [5](#step-arrowfunction-evaluation-functioncreate) is not made into a method by performing [MakeMethod](#sec-makemethod). An [ArrowFunction](#prod-ArrowFunction) that references `super` is always contained within a non-[ArrowFunction](#prod-ArrowFunction) and the necessary state to implement `super` is accessible via the `env` that is captured by the [function object](#function-object) of the [ArrowFunction](#prod-ArrowFunction).

### 15.3.5 Runtime Semantics: Evaluation

[ArrowFunction](#prod-ArrowFunction) : [ArrowParameters](#prod-ArrowParameters) =\> [ConciseBody](#prod-ConciseBody)

1.  Return [InstantiateArrowFunctionExpression](#sec-runtime-semantics-instantiatearrowfunctionexpression) of [ArrowFunction](#prod-ArrowFunction).

[ExpressionBody](#prod-ExpressionBody) : [AssignmentExpression](#prod-AssignmentExpression)

1.  Let `exprRef` be ? [Evaluation](#sec-evaluation) of [AssignmentExpression](#prod-AssignmentExpression).
2.  Let `exprValue` be ? [GetValue](#sec-getvalue)(`exprRef`).
3.  Return [ReturnCompletion](#sec-returncompletion)(`exprValue`).

## 15.4 Method Definitions

### Syntax

[MethodDefinition](#prod-MethodDefinition)\[Yield, Await\] : [ClassElementName](#prod-ClassElementName)\[?Yield, ?Await\] ( [UniqueFormalParameters](#prod-UniqueFormalParameters)\[~Yield, ~Await\] ) { [FunctionBody](#prod-FunctionBody)\[~Yield, ~Await\] } [GeneratorMethod](#prod-GeneratorMethod)\[?Yield, ?Await\] [AsyncMethod](#prod-AsyncMethod)\[?Yield, ?Await\] [AsyncGeneratorMethod](#prod-AsyncGeneratorMethod)\[?Yield, ?Await\] get [ClassElementName](#prod-ClassElementName)\[?Yield, ?Await\] ( ) { [FunctionBody](#prod-FunctionBody)\[~Yield, ~Await\] } set [ClassElementName](#prod-ClassElementName)\[?Yield, ?Await\] ( [PropertySetParameterList](#prod-PropertySetParameterList) ) { [FunctionBody](#prod-FunctionBody)\[~Yield, ~Await\] } [PropertySetParameterList](#prod-PropertySetParameterList) : [FormalParameter](#prod-FormalParameter)\[~Yield, ~Await\]

### 15.4.1 Static Semantics: Early Errors

[MethodDefinition](#prod-MethodDefinition) : [ClassElementName](#prod-ClassElementName) ( [UniqueFormalParameters](#prod-UniqueFormalParameters) ) { [FunctionBody](#prod-FunctionBody) }

- It is a Syntax Error if [FunctionBodyContainsUseStrict](#sec-static-semantics-functionbodycontainsusestrict) of [FunctionBody](#prod-FunctionBody) is true and [IsSimpleParameterList](#sec-static-semantics-issimpleparameterlist) of [UniqueFormalParameters](#prod-UniqueFormalParameters) is false.
- It is a Syntax Error if any element of the [BoundNames](#sec-static-semantics-boundnames) of [UniqueFormalParameters](#prod-UniqueFormalParameters) also occurs in the [LexicallyDeclaredNames](#sec-static-semantics-lexicallydeclarednames) of [FunctionBody](#prod-FunctionBody).

[MethodDefinition](#prod-MethodDefinition) : set [ClassElementName](#prod-ClassElementName) ( [PropertySetParameterList](#prod-PropertySetParameterList) ) { [FunctionBody](#prod-FunctionBody) }

- It is a Syntax Error if the [BoundNames](#sec-static-semantics-boundnames) of [PropertySetParameterList](#prod-PropertySetParameterList) contains any duplicate elements.
- It is a Syntax Error if [FunctionBodyContainsUseStrict](#sec-static-semantics-functionbodycontainsusestrict) of [FunctionBody](#prod-FunctionBody) is true and [IsSimpleParameterList](#sec-static-semantics-issimpleparameterlist) of [PropertySetParameterList](#prod-PropertySetParameterList) is false.
- It is a Syntax Error if any element of the [BoundNames](#sec-static-semantics-boundnames) of [PropertySetParameterList](#prod-PropertySetParameterList) also occurs in the [LexicallyDeclaredNames](#sec-static-semantics-lexicallydeclarednames) of [FunctionBody](#prod-FunctionBody).

### 15.4.2 Static Semantics: HasDirectSuper

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) HasDirectSuper takes no arguments and returns a Boolean. It is defined piecewise over the following productions:

[MethodDefinition](#prod-MethodDefinition) : [ClassElementName](#prod-ClassElementName) ( [UniqueFormalParameters](#prod-UniqueFormalParameters) ) { [FunctionBody](#prod-FunctionBody) }

1.  If [UniqueFormalParameters](#prod-UniqueFormalParameters) [Contains](#sec-static-semantics-contains) [SuperCall](#prod-SuperCall) is true, return true.
2.  Return [FunctionBody](#prod-FunctionBody) [Contains](#sec-static-semantics-contains) [SuperCall](#prod-SuperCall).

[MethodDefinition](#prod-MethodDefinition) : get [ClassElementName](#prod-ClassElementName) ( ) { [FunctionBody](#prod-FunctionBody) }

1.  Return [FunctionBody](#prod-FunctionBody) [Contains](#sec-static-semantics-contains) [SuperCall](#prod-SuperCall).

[MethodDefinition](#prod-MethodDefinition) : set [ClassElementName](#prod-ClassElementName) ( [PropertySetParameterList](#prod-PropertySetParameterList) ) { [FunctionBody](#prod-FunctionBody) }

1.  If [PropertySetParameterList](#prod-PropertySetParameterList) [Contains](#sec-static-semantics-contains) [SuperCall](#prod-SuperCall) is true, return true.
2.  Return [FunctionBody](#prod-FunctionBody) [Contains](#sec-static-semantics-contains) [SuperCall](#prod-SuperCall).

[GeneratorMethod](#prod-GeneratorMethod) : \* [ClassElementName](#prod-ClassElementName) ( [UniqueFormalParameters](#prod-UniqueFormalParameters) ) { [GeneratorBody](#prod-GeneratorBody) }

1.  If [UniqueFormalParameters](#prod-UniqueFormalParameters) [Contains](#sec-static-semantics-contains) [SuperCall](#prod-SuperCall) is true, return true.
2.  Return [GeneratorBody](#prod-GeneratorBody) [Contains](#sec-static-semantics-contains) [SuperCall](#prod-SuperCall).

[AsyncGeneratorMethod](#prod-AsyncGeneratorMethod) : async \* [ClassElementName](#prod-ClassElementName) ( [UniqueFormalParameters](#prod-UniqueFormalParameters) ) { [AsyncGeneratorBody](#prod-AsyncGeneratorBody) }

1.  If [UniqueFormalParameters](#prod-UniqueFormalParameters) [Contains](#sec-static-semantics-contains) [SuperCall](#prod-SuperCall) is true, return true.
2.  Return [AsyncGeneratorBody](#prod-AsyncGeneratorBody) [Contains](#sec-static-semantics-contains) [SuperCall](#prod-SuperCall).

[AsyncMethod](#prod-AsyncMethod) : async [ClassElementName](#prod-ClassElementName) ( [UniqueFormalParameters](#prod-UniqueFormalParameters) ) { [AsyncFunctionBody](#prod-AsyncFunctionBody) }

1.  If [UniqueFormalParameters](#prod-UniqueFormalParameters) [Contains](#sec-static-semantics-contains) [SuperCall](#prod-SuperCall) is true, return true.
2.  Return [AsyncFunctionBody](#prod-AsyncFunctionBody) [Contains](#sec-static-semantics-contains) [SuperCall](#prod-SuperCall).

### 15.4.3 Static Semantics: SpecialMethod

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) SpecialMethod takes no arguments and returns a Boolean. It is defined piecewise over the following productions:

[MethodDefinition](#prod-MethodDefinition) : [ClassElementName](#prod-ClassElementName) ( [UniqueFormalParameters](#prod-UniqueFormalParameters) ) { [FunctionBody](#prod-FunctionBody) }

1.  Return false.

[MethodDefinition](#prod-MethodDefinition) : [GeneratorMethod](#prod-GeneratorMethod) [AsyncMethod](#prod-AsyncMethod) [AsyncGeneratorMethod](#prod-AsyncGeneratorMethod) get [ClassElementName](#prod-ClassElementName) ( ) { [FunctionBody](#prod-FunctionBody) } set [ClassElementName](#prod-ClassElementName) ( [PropertySetParameterList](#prod-PropertySetParameterList) ) { [FunctionBody](#prod-FunctionBody) }

1.  Return true.

### 15.4.4 Runtime Semantics: DefineMethod

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) DefineMethod takes argument `object` (an Object) and optional argument `functionPrototype` (an Object) and returns either a [normal completion containing](#sec-completion-record-specification-type) a [Record](#sec-list-and-record-specification-type) with fields `[[Key]]` (a [property key](#property-key)) and `[[Closure]]` (an ECMAScript [function object](#function-object)) or an [abrupt completion](#sec-completion-record-specification-type). It is defined piecewise over the following productions:

[MethodDefinition](#prod-MethodDefinition) : [ClassElementName](#prod-ClassElementName) ( [UniqueFormalParameters](#prod-UniqueFormalParameters) ) { [FunctionBody](#prod-FunctionBody) }

1.  Let `propKey` be ? [Evaluation](#sec-evaluation) of [ClassElementName](#prod-ClassElementName).
2.  Let `env` be the [running execution context](#running-execution-context)'s LexicalEnvironment.
3.  Let `privateEnv` be the [running execution context](#running-execution-context)'s PrivateEnvironment.
4.  If `functionPrototype` is present, then
    1.  Let `prototype` be `functionPrototype`.
5.  Else,
    1.  Let `prototype` be [%Function.prototype%](#sec-properties-of-the-function-prototype-object).
6.  Let `sourceText` be the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) [MethodDefinition](#prod-MethodDefinition).
7.  Let `closure` be [OrdinaryFunctionCreate](#sec-ordinaryfunctioncreate)(`prototype`, `sourceText`, [UniqueFormalParameters](#prod-UniqueFormalParameters), [FunctionBody](#prod-FunctionBody), non-lexical-this, `env`, `privateEnv`).
8.  Perform [MakeMethod](#sec-makemethod)(`closure`, `object`).
9.  Return the [Record](#sec-list-and-record-specification-type) { `[[Key]]`: `propKey`, `[[Closure]]`: `closure` }.

### 15.4.5 Runtime Semantics: MethodDefinitionEvaluation

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) MethodDefinitionEvaluation takes arguments `object` (an Object) and `enumerable` (a Boolean) and returns either a [normal completion containing](#sec-completion-record-specification-type) either a [PrivateElement](#sec-privateelement-specification-type) or unused, or an [abrupt completion](#sec-completion-record-specification-type). It is defined piecewise over the following productions:

[MethodDefinition](#prod-MethodDefinition) : [ClassElementName](#prod-ClassElementName) ( [UniqueFormalParameters](#prod-UniqueFormalParameters) ) { [FunctionBody](#prod-FunctionBody) }

1.  Let `methodDef` be ? [DefineMethod](#sec-runtime-semantics-definemethod) of [MethodDefinition](#prod-MethodDefinition) with argument `object`.
2.  Perform [SetFunctionName](#sec-setfunctionname)(`methodDef`.`[[Closure]]`, `methodDef`.`[[Key]]`).
3.  Return ? [DefineMethodProperty](#sec-definemethodproperty)(`object`, `methodDef`.`[[Key]]`, `methodDef`.`[[Closure]]`, `enumerable`).

[MethodDefinition](#prod-MethodDefinition) : get [ClassElementName](#prod-ClassElementName) ( ) { [FunctionBody](#prod-FunctionBody) }

1.  Let `propKey` be ? [Evaluation](#sec-evaluation) of [ClassElementName](#prod-ClassElementName).
2.  Let `env` be the [running execution context](#running-execution-context)'s LexicalEnvironment.
3.  Let `privateEnv` be the [running execution context](#running-execution-context)'s PrivateEnvironment.
4.  Let `sourceText` be the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) [MethodDefinition](#prod-MethodDefinition).
5.  Let `formalParameterList` be an instance of the production [FormalParameters](#prod-FormalParameters) : \[empty\] .
6.  Let `closure` be [OrdinaryFunctionCreate](#sec-ordinaryfunctioncreate)([%Function.prototype%](#sec-properties-of-the-function-prototype-object), `sourceText`, `formalParameterList`, [FunctionBody](#prod-FunctionBody), non-lexical-this, `env`, `privateEnv`).
7.  Perform [MakeMethod](#sec-makemethod)(`closure`, `object`).
8.  Perform [SetFunctionName](#sec-setfunctionname)(`closure`, `propKey`, "get").
9.  If `propKey` is a [Private Name](#sec-private-names), then
    1.  Return [PrivateElement](#sec-privateelement-specification-type) { `[[Key]]`: `propKey`, `[[Kind]]`: accessor, `[[Get]]`: `closure`, `[[Set]]`: undefined }.
10. Else,
    1.  Let `desc` be the PropertyDescriptor { `[[Get]]`: `closure`, `[[Enumerable]]`: `enumerable`, `[[Configurable]]`: true }.
    2.  Perform ? [DefinePropertyOrThrow](#sec-definepropertyorthrow)(`object`, `propKey`, `desc`).
    3.  Return unused.

[MethodDefinition](#prod-MethodDefinition) : set [ClassElementName](#prod-ClassElementName) ( [PropertySetParameterList](#prod-PropertySetParameterList) ) { [FunctionBody](#prod-FunctionBody) }

1.  Let `propKey` be ? [Evaluation](#sec-evaluation) of [ClassElementName](#prod-ClassElementName).
2.  Let `env` be the [running execution context](#running-execution-context)'s LexicalEnvironment.
3.  Let `privateEnv` be the [running execution context](#running-execution-context)'s PrivateEnvironment.
4.  Let `sourceText` be the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) [MethodDefinition](#prod-MethodDefinition).
5.  Let `closure` be [OrdinaryFunctionCreate](#sec-ordinaryfunctioncreate)([%Function.prototype%](#sec-properties-of-the-function-prototype-object), `sourceText`, [PropertySetParameterList](#prod-PropertySetParameterList), [FunctionBody](#prod-FunctionBody), non-lexical-this, `env`, `privateEnv`).
6.  Perform [MakeMethod](#sec-makemethod)(`closure`, `object`).
7.  Perform [SetFunctionName](#sec-setfunctionname)(`closure`, `propKey`, "set").
8.  If `propKey` is a [Private Name](#sec-private-names), then
    1.  Return [PrivateElement](#sec-privateelement-specification-type) { `[[Key]]`: `propKey`, `[[Kind]]`: accessor, `[[Get]]`: undefined, `[[Set]]`: `closure` }.
9.  Else,
    1.  Let `desc` be the PropertyDescriptor { `[[Set]]`: `closure`, `[[Enumerable]]`: `enumerable`, `[[Configurable]]`: true }.
    2.  Perform ? [DefinePropertyOrThrow](#sec-definepropertyorthrow)(`object`, `propKey`, `desc`).
    3.  Return unused.

[GeneratorMethod](#prod-GeneratorMethod) : \* [ClassElementName](#prod-ClassElementName) ( [UniqueFormalParameters](#prod-UniqueFormalParameters) ) { [GeneratorBody](#prod-GeneratorBody) }

1.  Let `propKey` be ? [Evaluation](#sec-evaluation) of [ClassElementName](#prod-ClassElementName).
2.  Let `env` be the [running execution context](#running-execution-context)'s LexicalEnvironment.
3.  Let `privateEnv` be the [running execution context](#running-execution-context)'s PrivateEnvironment.
4.  Let `sourceText` be the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) [GeneratorMethod](#prod-GeneratorMethod).
5.  Let `closure` be [OrdinaryFunctionCreate](#sec-ordinaryfunctioncreate)([%GeneratorFunction.prototype%](#sec-properties-of-the-generatorfunction-prototype-object), `sourceText`, [UniqueFormalParameters](#prod-UniqueFormalParameters), [GeneratorBody](#prod-GeneratorBody), non-lexical-this, `env`, `privateEnv`).
6.  Perform [MakeMethod](#sec-makemethod)(`closure`, `object`).
7.  Perform [SetFunctionName](#sec-setfunctionname)(`closure`, `propKey`).
8.  Let `prototype` be [OrdinaryObjectCreate](#sec-ordinaryobjectcreate)([%GeneratorPrototype%](#sec-properties-of-generator-prototype)).
9.  Perform ! [DefinePropertyOrThrow](#sec-definepropertyorthrow)(`closure`, "prototype", PropertyDescriptor { `[[Value]]`: `prototype`, `[[Writable]]`: true, `[[Enumerable]]`: false, `[[Configurable]]`: false }).
10. Return ? [DefineMethodProperty](#sec-definemethodproperty)(`object`, `propKey`, `closure`, `enumerable`).

[AsyncGeneratorMethod](#prod-AsyncGeneratorMethod) : async \* [ClassElementName](#prod-ClassElementName) ( [UniqueFormalParameters](#prod-UniqueFormalParameters) ) { [AsyncGeneratorBody](#prod-AsyncGeneratorBody) }

1.  Let `propKey` be ? [Evaluation](#sec-evaluation) of [ClassElementName](#prod-ClassElementName).
2.  Let `env` be the [running execution context](#running-execution-context)'s LexicalEnvironment.
3.  Let `privateEnv` be the [running execution context](#running-execution-context)'s PrivateEnvironment.
4.  Let `sourceText` be the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) [AsyncGeneratorMethod](#prod-AsyncGeneratorMethod).
5.  Let `closure` be [OrdinaryFunctionCreate](#sec-ordinaryfunctioncreate)([%AsyncGeneratorFunction.prototype%](#sec-properties-of-asyncgeneratorfunction-prototype), `sourceText`, [UniqueFormalParameters](#prod-UniqueFormalParameters), [AsyncGeneratorBody](#prod-AsyncGeneratorBody), non-lexical-this, `env`, `privateEnv`).
6.  Perform [MakeMethod](#sec-makemethod)(`closure`, `object`).
7.  Perform [SetFunctionName](#sec-setfunctionname)(`closure`, `propKey`).
8.  Let `prototype` be [OrdinaryObjectCreate](#sec-ordinaryobjectcreate)([%AsyncGeneratorPrototype%](#sec-properties-of-asyncgenerator-prototype)).
9.  Perform ! [DefinePropertyOrThrow](#sec-definepropertyorthrow)(`closure`, "prototype", PropertyDescriptor { `[[Value]]`: `prototype`, `[[Writable]]`: true, `[[Enumerable]]`: false, `[[Configurable]]`: false }).
10. Return ? [DefineMethodProperty](#sec-definemethodproperty)(`object`, `propKey`, `closure`, `enumerable`).

[AsyncMethod](#prod-AsyncMethod) : async [ClassElementName](#prod-ClassElementName) ( [UniqueFormalParameters](#prod-UniqueFormalParameters) ) { [AsyncFunctionBody](#prod-AsyncFunctionBody) }

1.  Let `propKey` be ? [Evaluation](#sec-evaluation) of [ClassElementName](#prod-ClassElementName).
2.  Let `env` be the LexicalEnvironment of the [running execution context](#running-execution-context).
3.  Let `privateEnv` be the [running execution context](#running-execution-context)'s PrivateEnvironment.
4.  Let `sourceText` be the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) [AsyncMethod](#prod-AsyncMethod).
5.  Let `closure` be [OrdinaryFunctionCreate](#sec-ordinaryfunctioncreate)([%AsyncFunction.prototype%](#sec-async-function-prototype-properties), `sourceText`, [UniqueFormalParameters](#prod-UniqueFormalParameters), [AsyncFunctionBody](#prod-AsyncFunctionBody), non-lexical-this, `env`, `privateEnv`).
6.  Perform [MakeMethod](#sec-makemethod)(`closure`, `object`).
7.  Perform [SetFunctionName](#sec-setfunctionname)(`closure`, `propKey`).
8.  Return ? [DefineMethodProperty](#sec-definemethodproperty)(`object`, `propKey`, `closure`, `enumerable`).

## 15.5 Generator Function Definitions

### Syntax

[GeneratorDeclaration](#prod-GeneratorDeclaration)\[Yield, Await, Default\] : function \* [BindingIdentifier](#prod-BindingIdentifier)\[?Yield, ?Await\] ( [FormalParameters](#prod-FormalParameters)\[+Yield, ~Await\] ) { [GeneratorBody](#prod-GeneratorBody) } \[+Default\] function \* ( [FormalParameters](#prod-FormalParameters)\[+Yield, ~Await\] ) { [GeneratorBody](#prod-GeneratorBody) } [GeneratorExpression](#prod-GeneratorExpression) : function \* [BindingIdentifier](#prod-BindingIdentifier)\[+Yield, ~Await\]opt ( [FormalParameters](#prod-FormalParameters)\[+Yield, ~Await\] ) { [GeneratorBody](#prod-GeneratorBody) } [GeneratorMethod](#prod-GeneratorMethod)\[Yield, Await\] : \* [ClassElementName](#prod-ClassElementName)\[?Yield, ?Await\] ( [UniqueFormalParameters](#prod-UniqueFormalParameters)\[+Yield, ~Await\] ) { [GeneratorBody](#prod-GeneratorBody) } [GeneratorBody](#prod-GeneratorBody) : [FunctionBody](#prod-FunctionBody)\[+Yield, ~Await\] [YieldExpression](#prod-YieldExpression)\[In, Await\] : yield yield \[no [LineTerminator](#prod-LineTerminator) here\] [AssignmentExpression](#prod-AssignmentExpression)\[?In, +Yield, ?Await\] yield \[no [LineTerminator](#prod-LineTerminator) here\] \* [AssignmentExpression](#prod-AssignmentExpression)\[?In, +Yield, ?Await\] Note 1

The syntactic context immediately following `yield` requires use of the [InputElementRegExpOrTemplateTail](#prod-InputElementRegExpOrTemplateTail) lexical goal.

Note 2

[YieldExpression](#prod-YieldExpression) cannot be used within the [FormalParameters](#prod-FormalParameters) of a generator function because any expressions that are part of [FormalParameters](#prod-FormalParameters) are evaluated before the resulting Generator is in a resumable state.

Note 3

[Abstract operations](#sec-algorithm-conventions-abstract-operations) relating to Generators are defined in [27.5.3](#sec-generator-abstract-operations).

### 15.5.1 Static Semantics: Early Errors

[GeneratorMethod](#prod-GeneratorMethod) : \* [ClassElementName](#prod-ClassElementName) ( [UniqueFormalParameters](#prod-UniqueFormalParameters) ) { [GeneratorBody](#prod-GeneratorBody) }

- It is a Syntax Error if [HasDirectSuper](#sec-static-semantics-hasdirectsuper) of [GeneratorMethod](#prod-GeneratorMethod) is true.
- It is a Syntax Error if [UniqueFormalParameters](#prod-UniqueFormalParameters) [Contains](#sec-static-semantics-contains) [YieldExpression](#prod-YieldExpression) is true.
- It is a Syntax Error if [FunctionBodyContainsUseStrict](#sec-static-semantics-functionbodycontainsusestrict) of [GeneratorBody](#prod-GeneratorBody) is true and [IsSimpleParameterList](#sec-static-semantics-issimpleparameterlist) of [UniqueFormalParameters](#prod-UniqueFormalParameters) is false.
- It is a Syntax Error if any element of the [BoundNames](#sec-static-semantics-boundnames) of [UniqueFormalParameters](#prod-UniqueFormalParameters) also occurs in the [LexicallyDeclaredNames](#sec-static-semantics-lexicallydeclarednames) of [GeneratorBody](#prod-GeneratorBody).

[GeneratorDeclaration](#prod-GeneratorDeclaration) : function \* [BindingIdentifier](#prod-BindingIdentifier) ( [FormalParameters](#prod-FormalParameters) ) { [GeneratorBody](#prod-GeneratorBody) } function \* ( [FormalParameters](#prod-FormalParameters) ) { [GeneratorBody](#prod-GeneratorBody) } [GeneratorExpression](#prod-GeneratorExpression) : function \* [BindingIdentifier](#prod-BindingIdentifier)opt ( [FormalParameters](#prod-FormalParameters) ) { [GeneratorBody](#prod-GeneratorBody) }

- If [IsStrict](#sec-isstrict)([FormalParameters](#prod-FormalParameters)) is true, the Early Error rules for [UniqueFormalParameters](#prod-UniqueFormalParameters) : [FormalParameters](#prod-FormalParameters) are applied.
- If [BindingIdentifier](#prod-BindingIdentifier) is present and [IsStrict](#sec-isstrict)([BindingIdentifier](#prod-BindingIdentifier)) is true, it is a Syntax Error if the [StringValue](#sec-static-semantics-stringvalue) of [BindingIdentifier](#prod-BindingIdentifier) is either "eval" or "arguments".
- It is a Syntax Error if [FunctionBodyContainsUseStrict](#sec-static-semantics-functionbodycontainsusestrict) of [GeneratorBody](#prod-GeneratorBody) is true and [IsSimpleParameterList](#sec-static-semantics-issimpleparameterlist) of [FormalParameters](#prod-FormalParameters) is false.
- It is a Syntax Error if any element of the [BoundNames](#sec-static-semantics-boundnames) of [FormalParameters](#prod-FormalParameters) also occurs in the [LexicallyDeclaredNames](#sec-static-semantics-lexicallydeclarednames) of [GeneratorBody](#prod-GeneratorBody).
- It is a Syntax Error if [FormalParameters](#prod-FormalParameters) [Contains](#sec-static-semantics-contains) [YieldExpression](#prod-YieldExpression) is true.
- It is a Syntax Error if [FormalParameters](#prod-FormalParameters) [Contains](#sec-static-semantics-contains) [SuperProperty](#prod-SuperProperty) is true.
- It is a Syntax Error if [GeneratorBody](#prod-GeneratorBody) [Contains](#sec-static-semantics-contains) [SuperProperty](#prod-SuperProperty) is true.
- It is a Syntax Error if [FormalParameters](#prod-FormalParameters) [Contains](#sec-static-semantics-contains) [SuperCall](#prod-SuperCall) is true.
- It is a Syntax Error if [GeneratorBody](#prod-GeneratorBody) [Contains](#sec-static-semantics-contains) [SuperCall](#prod-SuperCall) is true.

### 15.5.2 Runtime Semantics: EvaluateGeneratorBody

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) EvaluateGeneratorBody takes arguments `functionObject` (an ECMAScript [function object](#function-object)) and `argumentsList` (a [List](#sec-list-and-record-specification-type) of [ECMAScript language values](#sec-ecmascript-language-types)) and returns a [throw completion](#sec-completion-record-specification-type) or a [return completion](#sec-completion-record-specification-type). It is defined piecewise over the following productions:

[GeneratorBody](#prod-GeneratorBody) : [FunctionBody](#prod-FunctionBody)

1.  Perform ? [FunctionDeclarationInstantiation](#sec-functiondeclarationinstantiation)(`functionObject`, `argumentsList`).
2.  Let `G` be ? [OrdinaryCreateFromConstructor](#sec-ordinarycreatefromconstructor)(`functionObject`, "%GeneratorPrototype%", « `[[GeneratorState]]`, `[[GeneratorContext]]`, `[[GeneratorBrand]]` »).
3.  Set `G`.`[[GeneratorBrand]]` to empty.
4.  Set `G`.`[[GeneratorState]]` to suspended-start.
5.  Perform [GeneratorStart](#sec-generatorstart)(`G`, [FunctionBody](#prod-FunctionBody)).
6.  Return [ReturnCompletion](#sec-returncompletion)(`G`).

### 15.5.3 Runtime Semantics: InstantiateGeneratorFunctionObject

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) InstantiateGeneratorFunctionObject takes arguments `env` (an [Environment Record](#sec-environment-records)) and `privateEnv` (a [PrivateEnvironment Record](#privateenvironment-record) or null) and returns an ECMAScript [function object](#function-object). It is defined piecewise over the following productions:

[GeneratorDeclaration](#prod-GeneratorDeclaration) : function \* [BindingIdentifier](#prod-BindingIdentifier) ( [FormalParameters](#prod-FormalParameters) ) { [GeneratorBody](#prod-GeneratorBody) }

1.  Let `name` be the [StringValue](#sec-static-semantics-stringvalue) of [BindingIdentifier](#prod-BindingIdentifier).
2.  Let `sourceText` be the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) [GeneratorDeclaration](#prod-GeneratorDeclaration).
3.  Let `F` be [OrdinaryFunctionCreate](#sec-ordinaryfunctioncreate)([%GeneratorFunction.prototype%](#sec-properties-of-the-generatorfunction-prototype-object), `sourceText`, [FormalParameters](#prod-FormalParameters), [GeneratorBody](#prod-GeneratorBody), non-lexical-this, `env`, `privateEnv`).
4.  Perform [SetFunctionName](#sec-setfunctionname)(`F`, `name`).
5.  Let `prototype` be [OrdinaryObjectCreate](#sec-ordinaryobjectcreate)([%GeneratorPrototype%](#sec-properties-of-generator-prototype)).
6.  Perform ! [DefinePropertyOrThrow](#sec-definepropertyorthrow)(`F`, "prototype", PropertyDescriptor { `[[Value]]`: `prototype`, `[[Writable]]`: true, `[[Enumerable]]`: false, `[[Configurable]]`: false }).
7.  Return `F`.

[GeneratorDeclaration](#prod-GeneratorDeclaration) : function \* ( [FormalParameters](#prod-FormalParameters) ) { [GeneratorBody](#prod-GeneratorBody) }

1.  Let `sourceText` be the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) [GeneratorDeclaration](#prod-GeneratorDeclaration).
2.  Let `F` be [OrdinaryFunctionCreate](#sec-ordinaryfunctioncreate)([%GeneratorFunction.prototype%](#sec-properties-of-the-generatorfunction-prototype-object), `sourceText`, [FormalParameters](#prod-FormalParameters), [GeneratorBody](#prod-GeneratorBody), non-lexical-this, `env`, `privateEnv`).
3.  Perform [SetFunctionName](#sec-setfunctionname)(`F`, "default").
4.  Let `prototype` be [OrdinaryObjectCreate](#sec-ordinaryobjectcreate)([%GeneratorPrototype%](#sec-properties-of-generator-prototype)).
5.  Perform ! [DefinePropertyOrThrow](#sec-definepropertyorthrow)(`F`, "prototype", PropertyDescriptor { `[[Value]]`: `prototype`, `[[Writable]]`: true, `[[Enumerable]]`: false, `[[Configurable]]`: false }).
6.  Return `F`.

Note

An anonymous [GeneratorDeclaration](#prod-GeneratorDeclaration) can only occur as part of an `export default` declaration, and its function code is therefore always [strict mode code](#sec-strict-mode-code).

### 15.5.4 Runtime Semantics: InstantiateGeneratorFunctionExpression

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) InstantiateGeneratorFunctionExpression takes optional argument `name` (a [property key](#property-key) or a [Private Name](#sec-private-names)) and returns an ECMAScript [function object](#function-object). It is defined piecewise over the following productions:

[GeneratorExpression](#prod-GeneratorExpression) : function \* ( [FormalParameters](#prod-FormalParameters) ) { [GeneratorBody](#prod-GeneratorBody) }

1.  If `name` is not present, set `name` to "".
2.  Let `env` be the LexicalEnvironment of the [running execution context](#running-execution-context).
3.  Let `privateEnv` be the [running execution context](#running-execution-context)'s PrivateEnvironment.
4.  Let `sourceText` be the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) [GeneratorExpression](#prod-GeneratorExpression).
5.  Let `closure` be [OrdinaryFunctionCreate](#sec-ordinaryfunctioncreate)([%GeneratorFunction.prototype%](#sec-properties-of-the-generatorfunction-prototype-object), `sourceText`, [FormalParameters](#prod-FormalParameters), [GeneratorBody](#prod-GeneratorBody), non-lexical-this, `env`, `privateEnv`).
6.  Perform [SetFunctionName](#sec-setfunctionname)(`closure`, `name`).
7.  Let `prototype` be [OrdinaryObjectCreate](#sec-ordinaryobjectcreate)([%GeneratorPrototype%](#sec-properties-of-generator-prototype)).
8.  Perform ! [DefinePropertyOrThrow](#sec-definepropertyorthrow)(`closure`, "prototype", PropertyDescriptor { `[[Value]]`: `prototype`, `[[Writable]]`: true, `[[Enumerable]]`: false, `[[Configurable]]`: false }).
9.  Return `closure`.

[GeneratorExpression](#prod-GeneratorExpression) : function \* [BindingIdentifier](#prod-BindingIdentifier) ( [FormalParameters](#prod-FormalParameters) ) { [GeneratorBody](#prod-GeneratorBody) }

1.  [Assert](#assert): `name` is not present.
2.  Set `name` to the [StringValue](#sec-static-semantics-stringvalue) of [BindingIdentifier](#prod-BindingIdentifier).
3.  Let `outerEnv` be the [running execution context](#running-execution-context)'s LexicalEnvironment.
4.  Let `funcEnv` be [NewDeclarativeEnvironment](#sec-newdeclarativeenvironment)(`outerEnv`).
5.  Perform ! `funcEnv`.CreateImmutableBinding(`name`, false).
6.  Let `privateEnv` be the [running execution context](#running-execution-context)'s PrivateEnvironment.
7.  Let `sourceText` be the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) [GeneratorExpression](#prod-GeneratorExpression).
8.  Let `closure` be [OrdinaryFunctionCreate](#sec-ordinaryfunctioncreate)([%GeneratorFunction.prototype%](#sec-properties-of-the-generatorfunction-prototype-object), `sourceText`, [FormalParameters](#prod-FormalParameters), [GeneratorBody](#prod-GeneratorBody), non-lexical-this, `funcEnv`, `privateEnv`).
9.  Perform [SetFunctionName](#sec-setfunctionname)(`closure`, `name`).
10. Let `prototype` be [OrdinaryObjectCreate](#sec-ordinaryobjectcreate)([%GeneratorPrototype%](#sec-properties-of-generator-prototype)).
11. Perform ! [DefinePropertyOrThrow](#sec-definepropertyorthrow)(`closure`, "prototype", PropertyDescriptor { `[[Value]]`: `prototype`, `[[Writable]]`: true, `[[Enumerable]]`: false, `[[Configurable]]`: false }).
12. Perform ! `funcEnv`.InitializeBinding(`name`, `closure`).
13. Return `closure`.

Note

The [BindingIdentifier](#prod-BindingIdentifier) in a [GeneratorExpression](#prod-GeneratorExpression) can be referenced from inside the [GeneratorExpression](#prod-GeneratorExpression)'s [FunctionBody](#prod-FunctionBody) to allow the generator code to call itself recursively. However, unlike in a [GeneratorDeclaration](#prod-GeneratorDeclaration), the [BindingIdentifier](#prod-BindingIdentifier) in a [GeneratorExpression](#prod-GeneratorExpression) cannot be referenced from and does not affect the scope enclosing the [GeneratorExpression](#prod-GeneratorExpression).

### 15.5.5 Runtime Semantics: Evaluation

[GeneratorExpression](#prod-GeneratorExpression) : function \* [BindingIdentifier](#prod-BindingIdentifier)opt ( [FormalParameters](#prod-FormalParameters) ) { [GeneratorBody](#prod-GeneratorBody) }

1.  Return [InstantiateGeneratorFunctionExpression](#sec-runtime-semantics-instantiategeneratorfunctionexpression) of [GeneratorExpression](#prod-GeneratorExpression).

[YieldExpression](#prod-YieldExpression) : yield

1.  Return ? [Yield](#sec-yield)(undefined).

[YieldExpression](#prod-YieldExpression) : yield [AssignmentExpression](#prod-AssignmentExpression)

1.  Let `exprRef` be ? [Evaluation](#sec-evaluation) of [AssignmentExpression](#prod-AssignmentExpression).
2.  Let `value` be ? [GetValue](#sec-getvalue)(`exprRef`).
3.  Return ? [Yield](#sec-yield)(`value`).

[YieldExpression](#prod-YieldExpression) : yield \* [AssignmentExpression](#prod-AssignmentExpression)

1.  Let `generatorKind` be [GetGeneratorKind](#sec-getgeneratorkind)().
2.  [Assert](#assert): `generatorKind` is either sync or async.
3.  Let `exprRef` be ? [Evaluation](#sec-evaluation) of [AssignmentExpression](#prod-AssignmentExpression).
4.  Let `value` be ? [GetValue](#sec-getvalue)(`exprRef`).
5.  Let `iteratorRecord` be ? [GetIterator](#sec-getiterator)(`value`, `generatorKind`).
6.  Let `iterator` be `iteratorRecord`.`[[Iterator]]`.
7.  Let `received` be [NormalCompletion](#sec-normalcompletion)(undefined).
8.  Repeat,
    1.  If `received` is a [normal completion](#sec-completion-record-specification-type), then
        1.  Let `innerResult` be ? [Call](#sec-call)(`iteratorRecord`.`[[NextMethod]]`, `iteratorRecord`.`[[Iterator]]`, « `received`.`[[Value]]` »).
        2.  If `generatorKind` is async, set `innerResult` to ? [Await](#await)(`innerResult`).
        3.  If `innerResult` [is not an Object](#sec-object-type), throw a TypeError exception.
        4.  Let `done` be ? [IteratorComplete](#sec-iteratorcomplete)(`innerResult`).
        5.  If `done` is true, then
            1.  Return ? [IteratorValue](#sec-iteratorvalue)(`innerResult`).
        6.  If `generatorKind` is async, set `received` to [Completion](#sec-completion-ao)([AsyncGeneratorYield](#sec-asyncgeneratoryield)(? [IteratorValue](#sec-iteratorvalue)(`innerResult`))).
        7.  Else, set `received` to [Completion](#sec-completion-ao)([GeneratorYield](#sec-generatoryield)(`innerResult`)).
    2.  Else if `received` is a [throw completion](#sec-completion-record-specification-type), then
        1.  Let `throw` be ? [GetMethod](#sec-getmethod)(`iterator`, "throw").
        2.  If `throw` is not undefined, then
            1.  Let `innerResult` be ? [Call](#sec-call)(`throw`, `iterator`, « `received`.`[[Value]]` »).
            2.  If `generatorKind` is async, set `innerResult` to ? [Await](#await)(`innerResult`).
            3.  NOTE: Exceptions from the inner [iterator](#sec-iterator-interface) `throw` method are propagated. [Normal completions](#sec-completion-record-specification-type) from an inner `throw` method are processed similarly to an inner `next`.
            4.  If `innerResult` [is not an Object](#sec-object-type), throw a TypeError exception.
            5.  Let `done` be ? [IteratorComplete](#sec-iteratorcomplete)(`innerResult`).
            6.  If `done` is true, then
                1.  Return ? [IteratorValue](#sec-iteratorvalue)(`innerResult`).
            7.  If `generatorKind` is async, set `received` to [Completion](#sec-completion-ao)([AsyncGeneratorYield](#sec-asyncgeneratoryield)(? [IteratorValue](#sec-iteratorvalue)(`innerResult`))).
            8.  Else, set `received` to [Completion](#sec-completion-ao)([GeneratorYield](#sec-generatoryield)(`innerResult`)).
        3.  Else,
            1.  NOTE: If `iterator` does not have a `throw` method, this throw is going to terminate the `yield*` loop. But first we need to give `iterator` a chance to clean up.
            2.  Let `closeCompletion` be [NormalCompletion](#sec-normalcompletion)(empty).
            3.  If `generatorKind` is async, perform ? [AsyncIteratorClose](#sec-asynciteratorclose)(`iteratorRecord`, `closeCompletion`).
            4.  Else, perform ? [IteratorClose](#sec-iteratorclose)(`iteratorRecord`, `closeCompletion`).
            5.  NOTE: The next step throws a TypeError to indicate that there was a `yield*` protocol violation: `iterator` does not have a `throw` method.
            6.  Throw a TypeError exception.
    3.  Else,
        1.  [Assert](#assert): `received` is a [return completion](#sec-completion-record-specification-type).
        2.  Let `return` be ? [GetMethod](#sec-getmethod)(`iterator`, "return").
        3.  If `return` is undefined, then
            1.  Set `value` to `received`.`[[Value]]`.
            2.  If `generatorKind` is async, then
                1.  Set `value` to ? [Await](#await)(`value`).
            3.  Return [ReturnCompletion](#sec-returncompletion)(`value`).
        4.  Let `innerReturnResult` be ? [Call](#sec-call)(`return`, `iterator`, « `received`.`[[Value]]` »).
        5.  If `generatorKind` is async, set `innerReturnResult` to ? [Await](#await)(`innerReturnResult`).
        6.  If `innerReturnResult` [is not an Object](#sec-object-type), throw a TypeError exception.
        7.  Let `done` be ? [IteratorComplete](#sec-iteratorcomplete)(`innerReturnResult`).
        8.  If `done` is true, then
            1.  Set `value` to ? [IteratorValue](#sec-iteratorvalue)(`innerReturnResult`).
            2.  Return [ReturnCompletion](#sec-returncompletion)(`value`).
        9.  If `generatorKind` is async, set `received` to [Completion](#sec-completion-ao)([AsyncGeneratorYield](#sec-asyncgeneratoryield)(? [IteratorValue](#sec-iteratorvalue)(`innerReturnResult`))).
        10. Else, set `received` to [Completion](#sec-completion-ao)([GeneratorYield](#sec-generatoryield)(`innerReturnResult`)).

## 15.6 Async Generator Function Definitions

### Syntax

[AsyncGeneratorDeclaration](#prod-AsyncGeneratorDeclaration)\[Yield, Await, Default\] : async \[no [LineTerminator](#prod-LineTerminator) here\] function \* [BindingIdentifier](#prod-BindingIdentifier)\[?Yield, ?Await\] ( [FormalParameters](#prod-FormalParameters)\[+Yield, +Await\] ) { [AsyncGeneratorBody](#prod-AsyncGeneratorBody) } \[+Default\] async \[no [LineTerminator](#prod-LineTerminator) here\] function \* ( [FormalParameters](#prod-FormalParameters)\[+Yield, +Await\] ) { [AsyncGeneratorBody](#prod-AsyncGeneratorBody) } [AsyncGeneratorExpression](#prod-AsyncGeneratorExpression) : async \[no [LineTerminator](#prod-LineTerminator) here\] function \* [BindingIdentifier](#prod-BindingIdentifier)\[+Yield, +Await\]opt ( [FormalParameters](#prod-FormalParameters)\[+Yield, +Await\] ) { [AsyncGeneratorBody](#prod-AsyncGeneratorBody) } [AsyncGeneratorMethod](#prod-AsyncGeneratorMethod)\[Yield, Await\] : async \[no [LineTerminator](#prod-LineTerminator) here\] \* [ClassElementName](#prod-ClassElementName)\[?Yield, ?Await\] ( [UniqueFormalParameters](#prod-UniqueFormalParameters)\[+Yield, +Await\] ) { [AsyncGeneratorBody](#prod-AsyncGeneratorBody) } [AsyncGeneratorBody](#prod-AsyncGeneratorBody) : [FunctionBody](#prod-FunctionBody)\[+Yield, +Await\] Note 1

[YieldExpression](#prod-YieldExpression) and [AwaitExpression](#prod-AwaitExpression) cannot be used within the [FormalParameters](#prod-FormalParameters) of an async generator function because any expressions that are part of [FormalParameters](#prod-FormalParameters) are evaluated before the resulting AsyncGenerator is in a resumable state.

Note 2

[Abstract operations](#sec-algorithm-conventions-abstract-operations) relating to AsyncGenerators are defined in [27.6.3](#sec-asyncgenerator-abstract-operations).

### 15.6.1 Static Semantics: Early Errors

[AsyncGeneratorMethod](#prod-AsyncGeneratorMethod) : async \* [ClassElementName](#prod-ClassElementName) ( [UniqueFormalParameters](#prod-UniqueFormalParameters) ) { [AsyncGeneratorBody](#prod-AsyncGeneratorBody) }

- It is a Syntax Error if [HasDirectSuper](#sec-static-semantics-hasdirectsuper) of [AsyncGeneratorMethod](#prod-AsyncGeneratorMethod) is true.
- It is a Syntax Error if [UniqueFormalParameters](#prod-UniqueFormalParameters) [Contains](#sec-static-semantics-contains) [YieldExpression](#prod-YieldExpression) is true.
- It is a Syntax Error if [UniqueFormalParameters](#prod-UniqueFormalParameters) [Contains](#sec-static-semantics-contains) [AwaitExpression](#prod-AwaitExpression) is true.
- It is a Syntax Error if [FunctionBodyContainsUseStrict](#sec-static-semantics-functionbodycontainsusestrict) of [AsyncGeneratorBody](#prod-AsyncGeneratorBody) is true and [IsSimpleParameterList](#sec-static-semantics-issimpleparameterlist) of [UniqueFormalParameters](#prod-UniqueFormalParameters) is false.
- It is a Syntax Error if any element of the [BoundNames](#sec-static-semantics-boundnames) of [UniqueFormalParameters](#prod-UniqueFormalParameters) also occurs in the [LexicallyDeclaredNames](#sec-static-semantics-lexicallydeclarednames) of [AsyncGeneratorBody](#prod-AsyncGeneratorBody).

[AsyncGeneratorDeclaration](#prod-AsyncGeneratorDeclaration) : async function \* [BindingIdentifier](#prod-BindingIdentifier) ( [FormalParameters](#prod-FormalParameters) ) { [AsyncGeneratorBody](#prod-AsyncGeneratorBody) } async function \* ( [FormalParameters](#prod-FormalParameters) ) { [AsyncGeneratorBody](#prod-AsyncGeneratorBody) } [AsyncGeneratorExpression](#prod-AsyncGeneratorExpression) : async function \* [BindingIdentifier](#prod-BindingIdentifier)opt ( [FormalParameters](#prod-FormalParameters) ) { [AsyncGeneratorBody](#prod-AsyncGeneratorBody) }

- If [IsStrict](#sec-isstrict)([FormalParameters](#prod-FormalParameters)) is true, the Early Error rules for [UniqueFormalParameters](#prod-UniqueFormalParameters) : [FormalParameters](#prod-FormalParameters) are applied.
- If [BindingIdentifier](#prod-BindingIdentifier) is present and [IsStrict](#sec-isstrict)([BindingIdentifier](#prod-BindingIdentifier)) is true, it is a Syntax Error if the [StringValue](#sec-static-semantics-stringvalue) of [BindingIdentifier](#prod-BindingIdentifier) is either "eval" or "arguments".
- It is a Syntax Error if [FunctionBodyContainsUseStrict](#sec-static-semantics-functionbodycontainsusestrict) of [AsyncGeneratorBody](#prod-AsyncGeneratorBody) is true and [IsSimpleParameterList](#sec-static-semantics-issimpleparameterlist) of [FormalParameters](#prod-FormalParameters) is false.
- It is a Syntax Error if any element of the [BoundNames](#sec-static-semantics-boundnames) of [FormalParameters](#prod-FormalParameters) also occurs in the [LexicallyDeclaredNames](#sec-static-semantics-lexicallydeclarednames) of [AsyncGeneratorBody](#prod-AsyncGeneratorBody).
- It is a Syntax Error if [FormalParameters](#prod-FormalParameters) [Contains](#sec-static-semantics-contains) [YieldExpression](#prod-YieldExpression) is true.
- It is a Syntax Error if [FormalParameters](#prod-FormalParameters) [Contains](#sec-static-semantics-contains) [AwaitExpression](#prod-AwaitExpression) is true.
- It is a Syntax Error if [FormalParameters](#prod-FormalParameters) [Contains](#sec-static-semantics-contains) [SuperProperty](#prod-SuperProperty) is true.
- It is a Syntax Error if [AsyncGeneratorBody](#prod-AsyncGeneratorBody) [Contains](#sec-static-semantics-contains) [SuperProperty](#prod-SuperProperty) is true.
- It is a Syntax Error if [FormalParameters](#prod-FormalParameters) [Contains](#sec-static-semantics-contains) [SuperCall](#prod-SuperCall) is true.
- It is a Syntax Error if [AsyncGeneratorBody](#prod-AsyncGeneratorBody) [Contains](#sec-static-semantics-contains) [SuperCall](#prod-SuperCall) is true.

### 15.6.2 Runtime Semantics: EvaluateAsyncGeneratorBody

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) EvaluateAsyncGeneratorBody takes arguments `functionObject` (an ECMAScript [function object](#function-object)) and `argumentsList` (a [List](#sec-list-and-record-specification-type) of [ECMAScript language values](#sec-ecmascript-language-types)) and returns a [throw completion](#sec-completion-record-specification-type) or a [return completion](#sec-completion-record-specification-type). It is defined piecewise over the following productions:

[AsyncGeneratorBody](#prod-AsyncGeneratorBody) : [FunctionBody](#prod-FunctionBody)

1.  Perform ? [FunctionDeclarationInstantiation](#sec-functiondeclarationinstantiation)(`functionObject`, `argumentsList`).
2.  Let `generator` be ? [OrdinaryCreateFromConstructor](#sec-ordinarycreatefromconstructor)(`functionObject`, "%AsyncGeneratorPrototype%", « `[[AsyncGeneratorState]]`, `[[AsyncGeneratorContext]]`, `[[AsyncGeneratorQueue]]`, `[[GeneratorBrand]]` »).
3.  Set `generator`.`[[GeneratorBrand]]` to empty.
4.  Set `generator`.`[[AsyncGeneratorState]]` to suspended-start.
5.  Perform [AsyncGeneratorStart](#sec-asyncgeneratorstart)(`generator`, [FunctionBody](#prod-FunctionBody)).
6.  Return [ReturnCompletion](#sec-returncompletion)(`generator`).

### 15.6.3 Runtime Semantics: InstantiateAsyncGeneratorFunctionObject

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) InstantiateAsyncGeneratorFunctionObject takes arguments `env` (an [Environment Record](#sec-environment-records)) and `privateEnv` (a [PrivateEnvironment Record](#privateenvironment-record) or null) and returns an ECMAScript [function object](#function-object). It is defined piecewise over the following productions:

[AsyncGeneratorDeclaration](#prod-AsyncGeneratorDeclaration) : async function \* [BindingIdentifier](#prod-BindingIdentifier) ( [FormalParameters](#prod-FormalParameters) ) { [AsyncGeneratorBody](#prod-AsyncGeneratorBody) }

1.  Let `name` be the [StringValue](#sec-static-semantics-stringvalue) of [BindingIdentifier](#prod-BindingIdentifier).
2.  Let `sourceText` be the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) [AsyncGeneratorDeclaration](#prod-AsyncGeneratorDeclaration).
3.  Let `F` be [OrdinaryFunctionCreate](#sec-ordinaryfunctioncreate)([%AsyncGeneratorFunction.prototype%](#sec-properties-of-asyncgeneratorfunction-prototype), `sourceText`, [FormalParameters](#prod-FormalParameters), [AsyncGeneratorBody](#prod-AsyncGeneratorBody), non-lexical-this, `env`, `privateEnv`).
4.  Perform [SetFunctionName](#sec-setfunctionname)(`F`, `name`).
5.  Let `prototype` be [OrdinaryObjectCreate](#sec-ordinaryobjectcreate)([%AsyncGeneratorPrototype%](#sec-properties-of-asyncgenerator-prototype)).
6.  Perform ! [DefinePropertyOrThrow](#sec-definepropertyorthrow)(`F`, "prototype", PropertyDescriptor { `[[Value]]`: `prototype`, `[[Writable]]`: true, `[[Enumerable]]`: false, `[[Configurable]]`: false }).
7.  Return `F`.

[AsyncGeneratorDeclaration](#prod-AsyncGeneratorDeclaration) : async function \* ( [FormalParameters](#prod-FormalParameters) ) { [AsyncGeneratorBody](#prod-AsyncGeneratorBody) }

1.  Let `sourceText` be the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) [AsyncGeneratorDeclaration](#prod-AsyncGeneratorDeclaration).
2.  Let `F` be [OrdinaryFunctionCreate](#sec-ordinaryfunctioncreate)([%AsyncGeneratorFunction.prototype%](#sec-properties-of-asyncgeneratorfunction-prototype), `sourceText`, [FormalParameters](#prod-FormalParameters), [AsyncGeneratorBody](#prod-AsyncGeneratorBody), non-lexical-this, `env`, `privateEnv`).
3.  Perform [SetFunctionName](#sec-setfunctionname)(`F`, "default").
4.  Let `prototype` be [OrdinaryObjectCreate](#sec-ordinaryobjectcreate)([%AsyncGeneratorPrototype%](#sec-properties-of-asyncgenerator-prototype)).
5.  Perform ! [DefinePropertyOrThrow](#sec-definepropertyorthrow)(`F`, "prototype", PropertyDescriptor { `[[Value]]`: `prototype`, `[[Writable]]`: true, `[[Enumerable]]`: false, `[[Configurable]]`: false }).
6.  Return `F`.

Note

An anonymous [AsyncGeneratorDeclaration](#prod-AsyncGeneratorDeclaration) can only occur as part of an `export default` declaration.

### 15.6.4 Runtime Semantics: InstantiateAsyncGeneratorFunctionExpression

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) InstantiateAsyncGeneratorFunctionExpression takes optional argument `name` (a [property key](#property-key) or a [Private Name](#sec-private-names)) and returns an ECMAScript [function object](#function-object). It is defined piecewise over the following productions:

[AsyncGeneratorExpression](#prod-AsyncGeneratorExpression) : async function \* ( [FormalParameters](#prod-FormalParameters) ) { [AsyncGeneratorBody](#prod-AsyncGeneratorBody) }

1.  If `name` is not present, set `name` to "".
2.  Let `env` be the LexicalEnvironment of the [running execution context](#running-execution-context).
3.  Let `privateEnv` be the [running execution context](#running-execution-context)'s PrivateEnvironment.
4.  Let `sourceText` be the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) [AsyncGeneratorExpression](#prod-AsyncGeneratorExpression).
5.  Let `closure` be [OrdinaryFunctionCreate](#sec-ordinaryfunctioncreate)([%AsyncGeneratorFunction.prototype%](#sec-properties-of-asyncgeneratorfunction-prototype), `sourceText`, [FormalParameters](#prod-FormalParameters), [AsyncGeneratorBody](#prod-AsyncGeneratorBody), non-lexical-this, `env`, `privateEnv`).
6.  Perform [SetFunctionName](#sec-setfunctionname)(`closure`, `name`).
7.  Let `prototype` be [OrdinaryObjectCreate](#sec-ordinaryobjectcreate)([%AsyncGeneratorPrototype%](#sec-properties-of-asyncgenerator-prototype)).
8.  Perform ! [DefinePropertyOrThrow](#sec-definepropertyorthrow)(`closure`, "prototype", PropertyDescriptor { `[[Value]]`: `prototype`, `[[Writable]]`: true, `[[Enumerable]]`: false, `[[Configurable]]`: false }).
9.  Return `closure`.

[AsyncGeneratorExpression](#prod-AsyncGeneratorExpression) : async function \* [BindingIdentifier](#prod-BindingIdentifier) ( [FormalParameters](#prod-FormalParameters) ) { [AsyncGeneratorBody](#prod-AsyncGeneratorBody) }

1.  [Assert](#assert): `name` is not present.
2.  Set `name` to the [StringValue](#sec-static-semantics-stringvalue) of [BindingIdentifier](#prod-BindingIdentifier).
3.  Let `outerEnv` be the [running execution context](#running-execution-context)'s LexicalEnvironment.
4.  Let `funcEnv` be [NewDeclarativeEnvironment](#sec-newdeclarativeenvironment)(`outerEnv`).
5.  Perform ! `funcEnv`.CreateImmutableBinding(`name`, false).
6.  Let `privateEnv` be the [running execution context](#running-execution-context)'s PrivateEnvironment.
7.  Let `sourceText` be the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) [AsyncGeneratorExpression](#prod-AsyncGeneratorExpression).
8.  Let `closure` be [OrdinaryFunctionCreate](#sec-ordinaryfunctioncreate)([%AsyncGeneratorFunction.prototype%](#sec-properties-of-asyncgeneratorfunction-prototype), `sourceText`, [FormalParameters](#prod-FormalParameters), [AsyncGeneratorBody](#prod-AsyncGeneratorBody), non-lexical-this, `funcEnv`, `privateEnv`).
9.  Perform [SetFunctionName](#sec-setfunctionname)(`closure`, `name`).
10. Let `prototype` be [OrdinaryObjectCreate](#sec-ordinaryobjectcreate)([%AsyncGeneratorPrototype%](#sec-properties-of-asyncgenerator-prototype)).
11. Perform ! [DefinePropertyOrThrow](#sec-definepropertyorthrow)(`closure`, "prototype", PropertyDescriptor { `[[Value]]`: `prototype`, `[[Writable]]`: true, `[[Enumerable]]`: false, `[[Configurable]]`: false }).
12. Perform ! `funcEnv`.InitializeBinding(`name`, `closure`).
13. Return `closure`.

Note

The [BindingIdentifier](#prod-BindingIdentifier) in an [AsyncGeneratorExpression](#prod-AsyncGeneratorExpression) can be referenced from inside the [AsyncGeneratorExpression](#prod-AsyncGeneratorExpression)'s [AsyncGeneratorBody](#prod-AsyncGeneratorBody) to allow the generator code to call itself recursively. However, unlike in an [AsyncGeneratorDeclaration](#prod-AsyncGeneratorDeclaration), the [BindingIdentifier](#prod-BindingIdentifier) in an [AsyncGeneratorExpression](#prod-AsyncGeneratorExpression) cannot be referenced from and does not affect the scope enclosing the [AsyncGeneratorExpression](#prod-AsyncGeneratorExpression).

### 15.6.5 Runtime Semantics: Evaluation

[AsyncGeneratorExpression](#prod-AsyncGeneratorExpression) : async function \* [BindingIdentifier](#prod-BindingIdentifier)opt ( [FormalParameters](#prod-FormalParameters) ) { [AsyncGeneratorBody](#prod-AsyncGeneratorBody) }

1.  Return [InstantiateAsyncGeneratorFunctionExpression](#sec-runtime-semantics-instantiateasyncgeneratorfunctionexpression) of [AsyncGeneratorExpression](#prod-AsyncGeneratorExpression).

## 15.7 Class Definitions

### Syntax

[ClassDeclaration](#prod-ClassDeclaration)\[Yield, Await, Default\] : class [BindingIdentifier](#prod-BindingIdentifier)\[?Yield, ?Await\] [ClassTail](#prod-ClassTail)\[?Yield, ?Await\] \[+Default\] class [ClassTail](#prod-ClassTail)\[?Yield, ?Await\] [ClassExpression](#prod-ClassExpression)\[Yield, Await\] : class [BindingIdentifier](#prod-BindingIdentifier)\[?Yield, ?Await\]opt [ClassTail](#prod-ClassTail)\[?Yield, ?Await\] [ClassTail](#prod-ClassTail)\[Yield, Await\] : [ClassHeritage](#prod-ClassHeritage)\[?Yield, ?Await\]opt { [ClassBody](#prod-ClassBody)\[?Yield, ?Await\]opt } [ClassHeritage](#prod-ClassHeritage)\[Yield, Await\] : extends [LeftHandSideExpression](#prod-LeftHandSideExpression)\[?Yield, ?Await\] [ClassBody](#prod-ClassBody)\[Yield, Await\] : [ClassElementList](#prod-ClassElementList)\[?Yield, ?Await\] [ClassElementList](#prod-ClassElementList)\[Yield, Await\] : [ClassElement](#prod-ClassElement)\[?Yield, ?Await\] [ClassElementList](#prod-ClassElementList)\[?Yield, ?Await\] [ClassElement](#prod-ClassElement)\[?Yield, ?Await\] [ClassElement](#prod-ClassElement)\[Yield, Await\] : [MethodDefinition](#prod-MethodDefinition)\[?Yield, ?Await\] static [MethodDefinition](#prod-MethodDefinition)\[?Yield, ?Await\] [FieldDefinition](#prod-FieldDefinition)\[?Yield, ?Await\] ; static [FieldDefinition](#prod-FieldDefinition)\[?Yield, ?Await\] ; [ClassStaticBlock](#prod-ClassStaticBlock) ; [FieldDefinition](#prod-FieldDefinition)\[Yield, Await\] : [ClassElementName](#prod-ClassElementName)\[?Yield, ?Await\] [Initializer](#prod-Initializer)\[+In, ?Yield, ?Await\]opt [ClassElementName](#prod-ClassElementName)\[Yield, Await\] : [PropertyName](#prod-PropertyName)\[?Yield, ?Await\] [PrivateIdentifier](#prod-PrivateIdentifier) [ClassStaticBlock](#prod-ClassStaticBlock) : static { [ClassStaticBlockBody](#prod-ClassStaticBlockBody) } [ClassStaticBlockBody](#prod-ClassStaticBlockBody) : [ClassStaticBlockStatementList](#prod-ClassStaticBlockStatementList) [ClassStaticBlockStatementList](#prod-ClassStaticBlockStatementList) : [StatementList](#prod-StatementList)\[~Yield, +Await, ~Return\]opt Note

A class definition is always [strict mode code](#sec-strict-mode-code).

### 15.7.1 Static Semantics: Early Errors

[ClassTail](#prod-ClassTail) : [ClassHeritage](#prod-ClassHeritage)opt { [ClassBody](#prod-ClassBody) }

- It is a Syntax Error if [ClassHeritage](#prod-ClassHeritage) is not present and the following algorithm returns true:

  1.  Let `constructor` be the [ConstructorMethod](#sec-static-semantics-constructormethod) of [ClassBody](#prod-ClassBody).
  2.  If `constructor` is empty, return false.
  3.  Return [HasDirectSuper](#sec-static-semantics-hasdirectsuper) of `constructor`.

[ClassBody](#prod-ClassBody) : [ClassElementList](#prod-ClassElementList)

- It is a Syntax Error if the [PrototypePropertyNameList](#sec-static-semantics-prototypepropertynamelist) of [ClassElementList](#prod-ClassElementList) contains more than one occurrence of "constructor".
- It is a Syntax Error if the [PrivateBoundIdentifiers](#sec-static-semantics-privateboundidentifiers) of [ClassElementList](#prod-ClassElementList) contains any duplicate entries, unless the name is used once for a getter and once for a setter and in no other entries, and the getter and setter are either both static or both non-static.

[ClassElement](#prod-ClassElement) : [MethodDefinition](#prod-MethodDefinition)

- It is a Syntax Error if the [PropName](#sec-static-semantics-propname) of [MethodDefinition](#prod-MethodDefinition) is not "constructor" and [HasDirectSuper](#sec-static-semantics-hasdirectsuper) of [MethodDefinition](#prod-MethodDefinition) is true.
- It is a Syntax Error if the [PropName](#sec-static-semantics-propname) of [MethodDefinition](#prod-MethodDefinition) is "constructor" and [SpecialMethod](#sec-static-semantics-specialmethod) of [MethodDefinition](#prod-MethodDefinition) is true.

[ClassElement](#prod-ClassElement) : static [MethodDefinition](#prod-MethodDefinition)

- It is a Syntax Error if [HasDirectSuper](#sec-static-semantics-hasdirectsuper) of [MethodDefinition](#prod-MethodDefinition) is true.
- It is a Syntax Error if the [PropName](#sec-static-semantics-propname) of [MethodDefinition](#prod-MethodDefinition) is "prototype".

[ClassElement](#prod-ClassElement) : [FieldDefinition](#prod-FieldDefinition) ;

- It is a Syntax Error if the [PropName](#sec-static-semantics-propname) of [FieldDefinition](#prod-FieldDefinition) is "constructor".

[ClassElement](#prod-ClassElement) : static [FieldDefinition](#prod-FieldDefinition) ;

- It is a Syntax Error if the [PropName](#sec-static-semantics-propname) of [FieldDefinition](#prod-FieldDefinition) is either "prototype" or "constructor".

[FieldDefinition](#prod-FieldDefinition) : [ClassElementName](#prod-ClassElementName) [Initializer](#prod-Initializer)opt

- It is a Syntax Error if [Initializer](#prod-Initializer) is present and [ContainsArguments](#sec-static-semantics-containsarguments) of [Initializer](#prod-Initializer) is true.
- It is a Syntax Error if [Initializer](#prod-Initializer) is present and [Initializer](#prod-Initializer) [Contains](#sec-static-semantics-contains) [SuperCall](#prod-SuperCall) is true.

[ClassElementName](#prod-ClassElementName) : [PrivateIdentifier](#prod-PrivateIdentifier)

- It is a Syntax Error if the [StringValue](#sec-static-semantics-stringvalue) of [PrivateIdentifier](#prod-PrivateIdentifier) is "#constructor".

[ClassStaticBlockBody](#prod-ClassStaticBlockBody) : [ClassStaticBlockStatementList](#prod-ClassStaticBlockStatementList)

- It is a Syntax Error if the [LexicallyDeclaredNames](#sec-static-semantics-lexicallydeclarednames) of [ClassStaticBlockStatementList](#prod-ClassStaticBlockStatementList) contains any duplicate entries.
- It is a Syntax Error if any element of the [LexicallyDeclaredNames](#sec-static-semantics-lexicallydeclarednames) of [ClassStaticBlockStatementList](#prod-ClassStaticBlockStatementList) also occurs in the [VarDeclaredNames](#sec-static-semantics-vardeclarednames) of [ClassStaticBlockStatementList](#prod-ClassStaticBlockStatementList).
- It is a Syntax Error if [ContainsDuplicateLabels](#sec-static-semantics-containsduplicatelabels) of [ClassStaticBlockStatementList](#prod-ClassStaticBlockStatementList) with argument « » is true.
- It is a Syntax Error if [ContainsUndefinedBreakTarget](#sec-static-semantics-containsundefinedbreaktarget) of [ClassStaticBlockStatementList](#prod-ClassStaticBlockStatementList) with argument « » is true.
- It is a Syntax Error if [ContainsUndefinedContinueTarget](#sec-static-semantics-containsundefinedcontinuetarget) of [ClassStaticBlockStatementList](#prod-ClassStaticBlockStatementList) with arguments « » and « » is true.
- It is a Syntax Error if [ContainsArguments](#sec-static-semantics-containsarguments) of [ClassStaticBlockStatementList](#prod-ClassStaticBlockStatementList) is true.
- It is a Syntax Error if [ClassStaticBlockStatementList](#prod-ClassStaticBlockStatementList) [Contains](#sec-static-semantics-contains) [SuperCall](#prod-SuperCall) is true.
- It is a Syntax Error if [ClassStaticBlockStatementList](#prod-ClassStaticBlockStatementList) [Contains](#sec-static-semantics-contains) `await` is true.

### 15.7.2 Static Semantics: ClassElementKind

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) ClassElementKind takes no arguments and returns constructor-method, non-constructor-method, or empty. It is defined piecewise over the following productions:

[ClassElement](#prod-ClassElement) : [MethodDefinition](#prod-MethodDefinition)

1.  If the [PropName](#sec-static-semantics-propname) of [MethodDefinition](#prod-MethodDefinition) is "constructor", return constructor-method.
2.  Return non-constructor-method.

[ClassElement](#prod-ClassElement) : static [MethodDefinition](#prod-MethodDefinition) [FieldDefinition](#prod-FieldDefinition) ; static [FieldDefinition](#prod-FieldDefinition) ;

1.  Return non-constructor-method.

[ClassElement](#prod-ClassElement) : [ClassStaticBlock](#prod-ClassStaticBlock)

1.  Return non-constructor-method.

[ClassElement](#prod-ClassElement) : ;

1.  Return empty.

### 15.7.3 Static Semantics: ConstructorMethod

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) ConstructorMethod takes no arguments and returns a [ClassElement](#prod-ClassElement) [Parse Node](#sec-syntactic-grammar) or empty. It is defined piecewise over the following productions:

[ClassElementList](#prod-ClassElementList) : [ClassElement](#prod-ClassElement)

1.  If the [ClassElementKind](#sec-static-semantics-classelementkind) of [ClassElement](#prod-ClassElement) is constructor-method, return [ClassElement](#prod-ClassElement).
2.  Return empty.

[ClassElementList](#prod-ClassElementList) : [ClassElementList](#prod-ClassElementList) [ClassElement](#prod-ClassElement)

1.  Let `head` be the [ConstructorMethod](#sec-static-semantics-constructormethod) of [ClassElementList](#prod-ClassElementList).
2.  If `head` is not empty, return `head`.
3.  If the [ClassElementKind](#sec-static-semantics-classelementkind) of [ClassElement](#prod-ClassElement) is constructor-method, return [ClassElement](#prod-ClassElement).
4.  Return empty.

Note

Early Error rules ensure that there is only one method definition named "constructor" and that it is not an [accessor property](#sec-object-type) or generator definition.

### 15.7.4 Static Semantics: IsStatic

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) IsStatic takes no arguments and returns a Boolean. It is defined piecewise over the following productions:

[ClassElement](#prod-ClassElement) : [MethodDefinition](#prod-MethodDefinition)

1.  Return false.

[ClassElement](#prod-ClassElement) : static [MethodDefinition](#prod-MethodDefinition)

1.  Return true.

[ClassElement](#prod-ClassElement) : [FieldDefinition](#prod-FieldDefinition) ;

1.  Return false.

[ClassElement](#prod-ClassElement) : static [FieldDefinition](#prod-FieldDefinition) ;

1.  Return true.

[ClassElement](#prod-ClassElement) : [ClassStaticBlock](#prod-ClassStaticBlock)

1.  Return true.

[ClassElement](#prod-ClassElement) : ;

1.  Return false.

### 15.7.5 Static Semantics: NonConstructorElements

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) NonConstructorElements takes no arguments and returns a [List](#sec-list-and-record-specification-type) of [ClassElement](#prod-ClassElement) [Parse Nodes](#sec-syntactic-grammar). It is defined piecewise over the following productions:

[ClassElementList](#prod-ClassElementList) : [ClassElement](#prod-ClassElement)

1.  If the [ClassElementKind](#sec-static-semantics-classelementkind) of [ClassElement](#prod-ClassElement) is non-constructor-method, then
    1.  Return « [ClassElement](#prod-ClassElement) ».
2.  Return a new empty [List](#sec-list-and-record-specification-type).

[ClassElementList](#prod-ClassElementList) : [ClassElementList](#prod-ClassElementList) [ClassElement](#prod-ClassElement)

1.  Let `list` be the [NonConstructorElements](#sec-static-semantics-nonconstructorelements) of [ClassElementList](#prod-ClassElementList).
2.  If the [ClassElementKind](#sec-static-semantics-classelementkind) of [ClassElement](#prod-ClassElement) is non-constructor-method, then
    1.  Append [ClassElement](#prod-ClassElement) to the end of `list`.
3.  Return `list`.

### 15.7.6 Static Semantics: PrototypePropertyNameList

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) PrototypePropertyNameList takes no arguments and returns a [List](#sec-list-and-record-specification-type) of [property keys](#property-key). It is defined piecewise over the following productions:

[ClassElementList](#prod-ClassElementList) : [ClassElement](#prod-ClassElement)

1.  Let `propName` be the [PropName](#sec-static-semantics-propname) of [ClassElement](#prod-ClassElement).
2.  If `propName` is empty, return a new empty [List](#sec-list-and-record-specification-type).
3.  If [IsStatic](#sec-static-semantics-isstatic) of [ClassElement](#prod-ClassElement) is true, return a new empty [List](#sec-list-and-record-specification-type).
4.  Return « `propName` ».

[ClassElementList](#prod-ClassElementList) : [ClassElementList](#prod-ClassElementList) [ClassElement](#prod-ClassElement)

1.  Let `list` be the [PrototypePropertyNameList](#sec-static-semantics-prototypepropertynamelist) of [ClassElementList](#prod-ClassElementList).
2.  Let `propName` be the [PropName](#sec-static-semantics-propname) of [ClassElement](#prod-ClassElement).
3.  If `propName` is empty, return `list`.
4.  If [IsStatic](#sec-static-semantics-isstatic) of [ClassElement](#prod-ClassElement) is true, return `list`.
5.  Return the [list-concatenation](#list-concatenation) of `list` and « `propName` ».

### 15.7.7 Static Semantics: AllPrivateIdentifiersValid

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) AllPrivateIdentifiersValid takes argument `names` (a [List](#sec-list-and-record-specification-type) of Strings) and returns a Boolean.

Every grammar production alternative in this specification which is not listed below implicitly has the following default definition of AllPrivateIdentifiersValid:

1.  For each child node `child` of this [Parse Node](#sec-syntactic-grammar), do
    1.  If `child` is an instance of a nonterminal, then
        1.  If [AllPrivateIdentifiersValid](#sec-static-semantics-allprivateidentifiersvalid) of `child` with argument `names` is false, return false.
2.  Return true.

[MemberExpression](#prod-MemberExpression) : [MemberExpression](#prod-MemberExpression) . [PrivateIdentifier](#prod-PrivateIdentifier)

1.  If `names` contains the [StringValue](#sec-static-semantics-stringvalue) of [PrivateIdentifier](#prod-PrivateIdentifier), then
    1.  Return [AllPrivateIdentifiersValid](#sec-static-semantics-allprivateidentifiersvalid) of [MemberExpression](#prod-MemberExpression) with argument `names`.
2.  Return false.

[CallExpression](#prod-CallExpression) : [CallExpression](#prod-CallExpression) . [PrivateIdentifier](#prod-PrivateIdentifier)

1.  If `names` contains the [StringValue](#sec-static-semantics-stringvalue) of [PrivateIdentifier](#prod-PrivateIdentifier), then
    1.  Return [AllPrivateIdentifiersValid](#sec-static-semantics-allprivateidentifiersvalid) of [CallExpression](#prod-CallExpression) with argument `names`.
2.  Return false.

[OptionalChain](#prod-OptionalChain) : ?. [PrivateIdentifier](#prod-PrivateIdentifier)

1.  If `names` contains the [StringValue](#sec-static-semantics-stringvalue) of [PrivateIdentifier](#prod-PrivateIdentifier), return true.
2.  Return false.

[OptionalChain](#prod-OptionalChain) : [OptionalChain](#prod-OptionalChain) . [PrivateIdentifier](#prod-PrivateIdentifier)

1.  If `names` contains the [StringValue](#sec-static-semantics-stringvalue) of [PrivateIdentifier](#prod-PrivateIdentifier), then
    1.  Return [AllPrivateIdentifiersValid](#sec-static-semantics-allprivateidentifiersvalid) of [OptionalChain](#prod-OptionalChain) with argument `names`.
2.  Return false.

[ClassBody](#prod-ClassBody) : [ClassElementList](#prod-ClassElementList)

1.  Let `newNames` be the [list-concatenation](#list-concatenation) of `names` and the [PrivateBoundIdentifiers](#sec-static-semantics-privateboundidentifiers) of [ClassBody](#prod-ClassBody).
2.  Return [AllPrivateIdentifiersValid](#sec-static-semantics-allprivateidentifiersvalid) of [ClassElementList](#prod-ClassElementList) with argument `newNames`.

[RelationalExpression](#prod-RelationalExpression) : [PrivateIdentifier](#prod-PrivateIdentifier) in [ShiftExpression](#prod-ShiftExpression)

1.  If `names` contains the [StringValue](#sec-static-semantics-stringvalue) of [PrivateIdentifier](#prod-PrivateIdentifier), then
    1.  Return [AllPrivateIdentifiersValid](#sec-static-semantics-allprivateidentifiersvalid) of [ShiftExpression](#prod-ShiftExpression) with argument `names`.
2.  Return false.

### 15.7.8 Static Semantics: PrivateBoundIdentifiers

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) PrivateBoundIdentifiers takes no arguments and returns a [List](#sec-list-and-record-specification-type) of Strings. It is defined piecewise over the following productions:

[FieldDefinition](#prod-FieldDefinition) : [ClassElementName](#prod-ClassElementName) [Initializer](#prod-Initializer)opt

1.  Return the [PrivateBoundIdentifiers](#sec-static-semantics-privateboundidentifiers) of [ClassElementName](#prod-ClassElementName).

[ClassElementName](#prod-ClassElementName) : [PrivateIdentifier](#prod-PrivateIdentifier)

1.  Return a [List](#sec-list-and-record-specification-type) whose sole element is the [StringValue](#sec-static-semantics-stringvalue) of [PrivateIdentifier](#prod-PrivateIdentifier).

[ClassElementName](#prod-ClassElementName) : [PropertyName](#prod-PropertyName) [ClassElement](#prod-ClassElement) : [ClassStaticBlock](#prod-ClassStaticBlock) ;

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[ClassElementList](#prod-ClassElementList) : [ClassElementList](#prod-ClassElementList) [ClassElement](#prod-ClassElement)

1.  Let `names1` be the [PrivateBoundIdentifiers](#sec-static-semantics-privateboundidentifiers) of [ClassElementList](#prod-ClassElementList).
2.  Let `names2` be the [PrivateBoundIdentifiers](#sec-static-semantics-privateboundidentifiers) of [ClassElement](#prod-ClassElement).
3.  Return the [list-concatenation](#list-concatenation) of `names1` and `names2`.

[MethodDefinition](#prod-MethodDefinition) : [ClassElementName](#prod-ClassElementName) ( [UniqueFormalParameters](#prod-UniqueFormalParameters) ) { [FunctionBody](#prod-FunctionBody) } get [ClassElementName](#prod-ClassElementName) ( ) { [FunctionBody](#prod-FunctionBody) } set [ClassElementName](#prod-ClassElementName) ( [PropertySetParameterList](#prod-PropertySetParameterList) ) { [FunctionBody](#prod-FunctionBody) } [GeneratorMethod](#prod-GeneratorMethod) : \* [ClassElementName](#prod-ClassElementName) ( [UniqueFormalParameters](#prod-UniqueFormalParameters) ) { [GeneratorBody](#prod-GeneratorBody) } [AsyncMethod](#prod-AsyncMethod) : async [ClassElementName](#prod-ClassElementName) ( [UniqueFormalParameters](#prod-UniqueFormalParameters) ) { [AsyncFunctionBody](#prod-AsyncFunctionBody) } [AsyncGeneratorMethod](#prod-AsyncGeneratorMethod) : async \* [ClassElementName](#prod-ClassElementName) ( [UniqueFormalParameters](#prod-UniqueFormalParameters) ) { [AsyncGeneratorBody](#prod-AsyncGeneratorBody) }

1.  Return the [PrivateBoundIdentifiers](#sec-static-semantics-privateboundidentifiers) of [ClassElementName](#prod-ClassElementName).

### 15.7.9 Static Semantics: ContainsArguments

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) ContainsArguments takes no arguments and returns a Boolean.

Every grammar production alternative in this specification which is not listed below implicitly has the following default definition of ContainsArguments:

1.  For each child node `child` of this [Parse Node](#sec-syntactic-grammar), do
    1.  If `child` is an instance of a nonterminal, then
        1.  If [ContainsArguments](#sec-static-semantics-containsarguments) of `child` is true, return true.
2.  Return false.

[IdentifierReference](#prod-IdentifierReference) : [Identifier](#prod-Identifier)

1.  If the [StringValue](#sec-static-semantics-stringvalue) of [Identifier](#prod-Identifier) is "arguments", return true.
2.  Return false.

[FunctionDeclaration](#prod-FunctionDeclaration) : function [BindingIdentifier](#prod-BindingIdentifier) ( [FormalParameters](#prod-FormalParameters) ) { [FunctionBody](#prod-FunctionBody) } function ( [FormalParameters](#prod-FormalParameters) ) { [FunctionBody](#prod-FunctionBody) } [FunctionExpression](#prod-FunctionExpression) : function [BindingIdentifier](#prod-BindingIdentifier)opt ( [FormalParameters](#prod-FormalParameters) ) { [FunctionBody](#prod-FunctionBody) } [GeneratorDeclaration](#prod-GeneratorDeclaration) : function \* [BindingIdentifier](#prod-BindingIdentifier) ( [FormalParameters](#prod-FormalParameters) ) { [GeneratorBody](#prod-GeneratorBody) } function \* ( [FormalParameters](#prod-FormalParameters) ) { [GeneratorBody](#prod-GeneratorBody) } [GeneratorExpression](#prod-GeneratorExpression) : function \* [BindingIdentifier](#prod-BindingIdentifier)opt ( [FormalParameters](#prod-FormalParameters) ) { [GeneratorBody](#prod-GeneratorBody) } [AsyncGeneratorDeclaration](#prod-AsyncGeneratorDeclaration) : async function \* [BindingIdentifier](#prod-BindingIdentifier) ( [FormalParameters](#prod-FormalParameters) ) { [AsyncGeneratorBody](#prod-AsyncGeneratorBody) } async function \* ( [FormalParameters](#prod-FormalParameters) ) { [AsyncGeneratorBody](#prod-AsyncGeneratorBody) } [AsyncGeneratorExpression](#prod-AsyncGeneratorExpression) : async function \* [BindingIdentifier](#prod-BindingIdentifier)opt ( [FormalParameters](#prod-FormalParameters) ) { [AsyncGeneratorBody](#prod-AsyncGeneratorBody) } [AsyncFunctionDeclaration](#prod-AsyncFunctionDeclaration) : async function [BindingIdentifier](#prod-BindingIdentifier) ( [FormalParameters](#prod-FormalParameters) ) { [AsyncFunctionBody](#prod-AsyncFunctionBody) } async function ( [FormalParameters](#prod-FormalParameters) ) { [AsyncFunctionBody](#prod-AsyncFunctionBody) } [AsyncFunctionExpression](#prod-AsyncFunctionExpression) : async function [BindingIdentifier](#prod-BindingIdentifier)opt ( [FormalParameters](#prod-FormalParameters) ) { [AsyncFunctionBody](#prod-AsyncFunctionBody) }

1.  Return false.

[MethodDefinition](#prod-MethodDefinition) : [ClassElementName](#prod-ClassElementName) ( [UniqueFormalParameters](#prod-UniqueFormalParameters) ) { [FunctionBody](#prod-FunctionBody) } get [ClassElementName](#prod-ClassElementName) ( ) { [FunctionBody](#prod-FunctionBody) } set [ClassElementName](#prod-ClassElementName) ( [PropertySetParameterList](#prod-PropertySetParameterList) ) { [FunctionBody](#prod-FunctionBody) } [GeneratorMethod](#prod-GeneratorMethod) : \* [ClassElementName](#prod-ClassElementName) ( [UniqueFormalParameters](#prod-UniqueFormalParameters) ) { [GeneratorBody](#prod-GeneratorBody) } [AsyncGeneratorMethod](#prod-AsyncGeneratorMethod) : async \* [ClassElementName](#prod-ClassElementName) ( [UniqueFormalParameters](#prod-UniqueFormalParameters) ) { [AsyncGeneratorBody](#prod-AsyncGeneratorBody) } [AsyncMethod](#prod-AsyncMethod) : async [ClassElementName](#prod-ClassElementName) ( [UniqueFormalParameters](#prod-UniqueFormalParameters) ) { [AsyncFunctionBody](#prod-AsyncFunctionBody) }

1.  Return [ContainsArguments](#sec-static-semantics-containsarguments) of [ClassElementName](#prod-ClassElementName).

### 15.7.10 Runtime Semantics: ClassFieldDefinitionEvaluation

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) ClassFieldDefinitionEvaluation takes argument `homeObject` (an Object) and returns either a [normal completion containing](#sec-completion-record-specification-type) a [ClassFieldDefinition Record](#sec-classfielddefinition-record-specification-type) or an [abrupt completion](#sec-completion-record-specification-type). It is defined piecewise over the following productions:

[FieldDefinition](#prod-FieldDefinition) : [ClassElementName](#prod-ClassElementName) [Initializer](#prod-Initializer)opt

1.  Let `name` be ? [Evaluation](#sec-evaluation) of [ClassElementName](#prod-ClassElementName).
2.  If [Initializer](#prod-Initializer) is present, then
    1.  Let `formalParameterList` be an instance of the production [FormalParameters](#prod-FormalParameters) : \[empty\] .
    2.  Let `env` be the LexicalEnvironment of the [running execution context](#running-execution-context).
    3.  Let `privateEnv` be the [running execution context](#running-execution-context)'s PrivateEnvironment.
    4.  Let `sourceText` be the empty sequence of Unicode code points.
    5.  Let `initializer` be [OrdinaryFunctionCreate](#sec-ordinaryfunctioncreate)([%Function.prototype%](#sec-properties-of-the-function-prototype-object), `sourceText`, `formalParameterList`, [Initializer](#prod-Initializer), non-lexical-this, `env`, `privateEnv`).
    6.  Perform [MakeMethod](#sec-makemethod)(`initializer`, `homeObject`).
    7.  Set `initializer`.`[[ClassFieldInitializerName]]` to `name`.
3.  Else,
    1.  Let `initializer` be empty.
4.  Return the [ClassFieldDefinition Record](#sec-classfielddefinition-record-specification-type) { `[[Name]]`: `name`, `[[Initializer]]`: `initializer` }.

Note

The function created for `initializer` is never directly accessible to ECMAScript code.

### 15.7.11 Runtime Semantics: ClassStaticBlockDefinitionEvaluation

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) ClassStaticBlockDefinitionEvaluation takes argument `homeObject` (an Object) and returns a [ClassStaticBlockDefinition Record](#sec-classstaticblockdefinition-record-specification-type). It is defined piecewise over the following productions:

[ClassStaticBlock](#prod-ClassStaticBlock) : static { [ClassStaticBlockBody](#prod-ClassStaticBlockBody) }

1.  Let `lex` be the [running execution context](#running-execution-context)'s LexicalEnvironment.
2.  Let `privateEnv` be the [running execution context](#running-execution-context)'s PrivateEnvironment.
3.  Let `sourceText` be the empty sequence of Unicode code points.
4.  Let `formalParameters` be an instance of the production [FormalParameters](#prod-FormalParameters) : \[empty\] .
5.  Let `bodyFunction` be [OrdinaryFunctionCreate](#sec-ordinaryfunctioncreate)([%Function.prototype%](#sec-properties-of-the-function-prototype-object), `sourceText`, `formalParameters`, [ClassStaticBlockBody](#prod-ClassStaticBlockBody), non-lexical-this, `lex`, `privateEnv`).
6.  Perform [MakeMethod](#sec-makemethod)(`bodyFunction`, `homeObject`).
7.  Return the [ClassStaticBlockDefinition Record](#sec-classstaticblockdefinition-record-specification-type) { `[[BodyFunction]]`: `bodyFunction` }.

Note

The function `bodyFunction` is never directly accessible to ECMAScript code.

### 15.7.12 Runtime Semantics: EvaluateClassStaticBlockBody

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) EvaluateClassStaticBlockBody takes argument `functionObject` (an ECMAScript [function object](#function-object)) and returns a [return completion](#sec-completion-record-specification-type) or a [throw completion](#sec-completion-record-specification-type). It is defined piecewise over the following productions:

[ClassStaticBlockBody](#prod-ClassStaticBlockBody) : [ClassStaticBlockStatementList](#prod-ClassStaticBlockStatementList)

1.  [Assert](#assert): `functionObject` is a synthetic function created by [ClassStaticBlockDefinitionEvaluation](#sec-runtime-semantics-classstaticblockdefinitionevaluation) step [5](#step-synthetic-class-static-block-fn).
2.  Perform ! [FunctionDeclarationInstantiation](#sec-functiondeclarationinstantiation)(`functionObject`, « »).
3.  Perform ? [Evaluation](#sec-evaluation) of [ClassStaticBlockStatementList](#prod-ClassStaticBlockStatementList).
4.  Return [ReturnCompletion](#sec-returncompletion)(undefined).

### 15.7.13 Runtime Semantics: ClassElementEvaluation

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) ClassElementEvaluation takes argument `object` (an Object) and returns either a [normal completion containing](#sec-completion-record-specification-type) either a [ClassFieldDefinition Record](#sec-classfielddefinition-record-specification-type), a [ClassStaticBlockDefinition Record](#sec-classstaticblockdefinition-record-specification-type), a [PrivateElement](#sec-privateelement-specification-type), or unused, or an [abrupt completion](#sec-completion-record-specification-type). It is defined piecewise over the following productions:

[ClassElement](#prod-ClassElement) : [FieldDefinition](#prod-FieldDefinition) ; static [FieldDefinition](#prod-FieldDefinition) ;

1.  Return ? [ClassFieldDefinitionEvaluation](#sec-runtime-semantics-classfielddefinitionevaluation) of [FieldDefinition](#prod-FieldDefinition) with argument `object`.

[ClassElement](#prod-ClassElement) : [MethodDefinition](#prod-MethodDefinition) static [MethodDefinition](#prod-MethodDefinition)

1.  Return ? [MethodDefinitionEvaluation](#sec-runtime-semantics-methoddefinitionevaluation) of [MethodDefinition](#prod-MethodDefinition) with arguments `object` and false.

[ClassElement](#prod-ClassElement) : [ClassStaticBlock](#prod-ClassStaticBlock)

1.  Return the [ClassStaticBlockDefinitionEvaluation](#sec-runtime-semantics-classstaticblockdefinitionevaluation) of [ClassStaticBlock](#prod-ClassStaticBlock) with argument `object`.

[ClassElement](#prod-ClassElement) : ;

1.  Return unused.

### 15.7.14 Runtime Semantics: ClassDefinitionEvaluation

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) ClassDefinitionEvaluation takes arguments `classBinding` (a String or undefined) and `className` (a [property key](#property-key) or a [Private Name](#sec-private-names)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a [function object](#function-object) or an [abrupt completion](#sec-completion-record-specification-type).

Note

For ease of specification, private methods and accessors are included alongside private fields in the `[[PrivateElements]]` slot of class instances. However, any given object has either all or none of the private methods and accessors defined by a given class. This feature has been designed so that implementations may choose to implement private methods and accessors using a strategy which does not require tracking each method or accessor individually.

For example, an implementation could directly associate instance private methods with their corresponding [Private Name](#sec-private-names) and track, for each object, which class [constructors](#constructor) have run with that object as their `this` value. Looking up an instance private method on an object then consists of checking that the class [constructor](#constructor) which defines the method has been used to initialize the object, then returning the method associated with the [Private Name](#sec-private-names).

This differs from private fields: because field initializers can throw during class instantiation, an individual object may have some proper subset of the private fields of a given class, and so private fields must in general be tracked individually.

It is defined piecewise over the following productions:

[ClassTail](#prod-ClassTail) : [ClassHeritage](#prod-ClassHeritage)opt { [ClassBody](#prod-ClassBody)opt }

1.  Let `env` be the LexicalEnvironment of the [running execution context](#running-execution-context).
2.  Let `classEnv` be [NewDeclarativeEnvironment](#sec-newdeclarativeenvironment)(`env`).
3.  If `classBinding` is not undefined, then
    1.  Perform ! `classEnv`.CreateImmutableBinding(`classBinding`, true).
4.  Let `outerPrivateEnvironment` be the [running execution context](#running-execution-context)'s PrivateEnvironment.
5.  Let `classPrivateEnvironment` be [NewPrivateEnvironment](#sec-newprivateenvironment)(`outerPrivateEnvironment`).
6.  If [ClassBody](#prod-ClassBody) is present, then
    1.  For each String `dn` of the [PrivateBoundIdentifiers](#sec-static-semantics-privateboundidentifiers) of [ClassBody](#prod-ClassBody), do
        1.  If `classPrivateEnvironment`.`[[Names]]` contains a [Private Name](#sec-private-names) `pn` such that `pn`.`[[Description]]` is `dn`, then
            1.  [Assert](#assert): This is only possible for getter/setter pairs.
        2.  Else,
            1.  Let `name` be a new [Private Name](#sec-private-names) whose `[[Description]]` is `dn`.
            2.  Append `name` to `classPrivateEnvironment`.`[[Names]]`.
7.  If [ClassHeritage](#prod-ClassHeritage) is not present, then
    1.  Let `protoParent` be [%Object.prototype%](#sec-properties-of-the-object-prototype-object).
    2.  Let `constructorParent` be [%Function.prototype%](#sec-properties-of-the-function-prototype-object).
8.  Else,
    1.  Set the [running execution context](#running-execution-context)'s LexicalEnvironment to `classEnv`.
    2.  NOTE: The [running execution context](#running-execution-context)'s PrivateEnvironment is `outerPrivateEnvironment` when evaluating [ClassHeritage](#prod-ClassHeritage).
    3.  Let `superclassRef` be [Completion](#sec-completion-ao)([Evaluation](#sec-evaluation) of [ClassHeritage](#prod-ClassHeritage)).
    4.  Set the [running execution context](#running-execution-context)'s LexicalEnvironment to `env`.
    5.  Let `superclass` be ? [GetValue](#sec-getvalue)(? `superclassRef`).
    6.  If `superclass` is null, then
        1.  Let `protoParent` be null.
        2.  Let `constructorParent` be [%Function.prototype%](#sec-properties-of-the-function-prototype-object).
    7.  Else if [IsConstructor](#sec-isconstructor)(`superclass`) is false, then
        1.  Throw a TypeError exception.
    8.  Else,
        1.  Let `protoParent` be ? [Get](#sec-get-o-p)(`superclass`, "prototype").
        2.  If `protoParent` [is not an Object](#sec-object-type) and `protoParent` is not null, throw a TypeError exception.
        3.  Let `constructorParent` be `superclass`.
9.  Let `proto` be [OrdinaryObjectCreate](#sec-ordinaryobjectcreate)(`protoParent`).
10. If [ClassBody](#prod-ClassBody) is not present, let `constructor` be empty.
11. Else, let `constructor` be the [ConstructorMethod](#sec-static-semantics-constructormethod) of [ClassBody](#prod-ClassBody).
12. Set the [running execution context](#running-execution-context)'s LexicalEnvironment to `classEnv`.
13. Set the [running execution context](#running-execution-context)'s PrivateEnvironment to `classPrivateEnvironment`.
14. If `constructor` is empty, then
    1.  Let `defaultConstructor` be a new [Abstract Closure](#sec-abstract-closure) with no parameters that captures nothing and performs the following steps when called:
        1.  Let `args` be the [List](#sec-list-and-record-specification-type) of arguments that was passed to this function by `[[Call]]` or `[[Construct]]`.
        2.  If NewTarget is undefined, throw a TypeError exception.
        3.  Let `F` be the [active function object](#active-function-object).
        4.  If `F`.`[[ConstructorKind]]` is derived, then
            1.  NOTE: This branch behaves similarly to `constructor(...args) { super(...args); }`. The most notable distinction is that while the aforementioned [ECMAScript source text](#sec-source-text) observably calls the [%Symbol.iterator%](#sec-well-known-symbols) method on `%Array.prototype%`, this function does not.
            2.  Let `func` be ! `F`.`[[GetPrototypeOf]]`().
            3.  If [IsConstructor](#sec-isconstructor)(`func`) is false, throw a TypeError exception.
            4.  Let `result` be ? [Construct](#sec-construct)(`func`, `args`, NewTarget).
        5.  Else,
            1.  NOTE: This branch behaves similarly to `constructor() {}`.
            2.  Let `result` be ? [OrdinaryCreateFromConstructor](#sec-ordinarycreatefromconstructor)(NewTarget, "%Object.prototype%").
        6.  Perform ? [InitializeInstanceElements](#sec-initializeinstanceelements)(`result`, `F`).
        7.  Return `result`.
    2.  Let `F` be [CreateBuiltinFunction](#sec-createbuiltinfunction)(`defaultConstructor`, 0, `className`, « `[[ConstructorKind]]`, `[[SourceText]]` », [the current Realm Record](#current-realm), `constructorParent`).
15. Else,
    1.  Let `constructorInfo` be ! [DefineMethod](#sec-runtime-semantics-definemethod) of `constructor` with arguments `proto` and `constructorParent`.
    2.  Let `F` be `constructorInfo`.`[[Closure]]`.
    3.  Perform [MakeClassConstructor](#sec-makeclassconstructor)(`F`).
    4.  Perform [SetFunctionName](#sec-setfunctionname)(`F`, `className`).
16. Perform [MakeConstructor](#sec-makeconstructor)(`F`, false, `proto`).
17. If [ClassHeritage](#prod-ClassHeritage) is present, set `F`.`[[ConstructorKind]]` to derived.
18. Perform ! [DefineMethodProperty](#sec-definemethodproperty)(`proto`, "constructor", `F`, false).
19. If [ClassBody](#prod-ClassBody) is not present, let `elements` be a new empty [List](#sec-list-and-record-specification-type).
20. Else, let `elements` be the [NonConstructorElements](#sec-static-semantics-nonconstructorelements) of [ClassBody](#prod-ClassBody).
21. Let `instancePrivateMethods` be a new empty [List](#sec-list-and-record-specification-type).
22. Let `staticPrivateMethods` be a new empty [List](#sec-list-and-record-specification-type).
23. Let `instanceFields` be a new empty [List](#sec-list-and-record-specification-type).
24. Let `staticElements` be a new empty [List](#sec-list-and-record-specification-type).
25. For each [ClassElement](#prod-ClassElement) `e` of `elements`, do
    1.  If [IsStatic](#sec-static-semantics-isstatic) of `e` is false, then
        1.  Let `element` be [Completion](#sec-completion-ao)([ClassElementEvaluation](#sec-static-semantics-classelementevaluation) of `e` with argument `proto`).
    2.  Else,
        1.  Let `element` be [Completion](#sec-completion-ao)([ClassElementEvaluation](#sec-static-semantics-classelementevaluation) of `e` with argument `F`).
    3.  If `element` is an [abrupt completion](#sec-completion-record-specification-type), then
        1.  Set the [running execution context](#running-execution-context)'s LexicalEnvironment to `env`.
        2.  Set the [running execution context](#running-execution-context)'s PrivateEnvironment to `outerPrivateEnvironment`.
        3.  Return ? `element`.
    4.  Set `element` to ! `element`.
    5.  If `element` is a [PrivateElement](#sec-privateelement-specification-type), then
        1.  [Assert](#assert): `element`.`[[Kind]]` is either method or accessor.
        2.  If [IsStatic](#sec-static-semantics-isstatic) of `e` is false, let `container` be `instancePrivateMethods`.
        3.  Else, let `container` be `staticPrivateMethods`.
        4.  If `container` contains a [PrivateElement](#sec-privateelement-specification-type) `pe` such that `pe`.`[[Key]]` is `element`.`[[Key]]`, then
            1.  [Assert](#assert): `element`.`[[Kind]]` and `pe`.`[[Kind]]` are both accessor.
            2.  If `element`.`[[Get]]` is undefined, then
                1.  Let `combined` be [PrivateElement](#sec-privateelement-specification-type) { `[[Key]]`: `element`.`[[Key]]`, `[[Kind]]`: accessor, `[[Get]]`: `pe`.`[[Get]]`, `[[Set]]`: `element`.`[[Set]]` }.
            3.  Else,
                1.  Let `combined` be [PrivateElement](#sec-privateelement-specification-type) { `[[Key]]`: `element`.`[[Key]]`, `[[Kind]]`: accessor, `[[Get]]`: `element`.`[[Get]]`, `[[Set]]`: `pe`.`[[Set]]` }.
            4.  Replace `pe` in `container` with `combined`.
        5.  Else,
            1.  Append `element` to `container`.
    6.  Else if `element` is a [ClassFieldDefinition Record](#sec-classfielddefinition-record-specification-type), then
        1.  If [IsStatic](#sec-static-semantics-isstatic) of `e` is false, append `element` to `instanceFields`.
        2.  Else, append `element` to `staticElements`.
    7.  Else if `element` is a [ClassStaticBlockDefinition Record](#sec-classstaticblockdefinition-record-specification-type), then
        1.  Append `element` to `staticElements`.
26. Set the [running execution context](#running-execution-context)'s LexicalEnvironment to `env`.
27. If `classBinding` is not undefined, then
    1.  Perform ! `classEnv`.InitializeBinding(`classBinding`, `F`).
28. Set `F`.`[[PrivateMethods]]` to `instancePrivateMethods`.
29. Set `F`.`[[Fields]]` to `instanceFields`.
30. For each [PrivateElement](#sec-privateelement-specification-type) `method` of `staticPrivateMethods`, do
    1.  Perform ! [PrivateMethodOrAccessorAdd](#sec-privatemethodoraccessoradd)(`F`, `method`).
31. For each element `elementRecord` of `staticElements`, do
    1.  If `elementRecord` is a [ClassFieldDefinition Record](#sec-classfielddefinition-record-specification-type), then
        1.  Let `result` be [Completion](#sec-completion-ao)([DefineField](#sec-definefield)(`F`, `elementRecord`)).
    2.  Else,
        1.  [Assert](#assert): `elementRecord` is a [ClassStaticBlockDefinition Record](#sec-classstaticblockdefinition-record-specification-type).
        2.  Let `result` be [Completion](#sec-completion-ao)([Call](#sec-call)(`elementRecord`.`[[BodyFunction]]`, `F`)).
    3.  If `result` is an [abrupt completion](#sec-completion-record-specification-type), then
        1.  Set the [running execution context](#running-execution-context)'s PrivateEnvironment to `outerPrivateEnvironment`.
        2.  Return ? `result`.
32. Set the [running execution context](#running-execution-context)'s PrivateEnvironment to `outerPrivateEnvironment`.
33. Return `F`.

### 15.7.15 Runtime Semantics: BindingClassDeclarationEvaluation

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) BindingClassDeclarationEvaluation takes no arguments and returns either a [normal completion containing](#sec-completion-record-specification-type) a [function object](#function-object) or an [abrupt completion](#sec-completion-record-specification-type). It is defined piecewise over the following productions:

[ClassDeclaration](#prod-ClassDeclaration) : class [BindingIdentifier](#prod-BindingIdentifier) [ClassTail](#prod-ClassTail)

1.  Let `className` be the [StringValue](#sec-static-semantics-stringvalue) of [BindingIdentifier](#prod-BindingIdentifier).
2.  Let `value` be ? [ClassDefinitionEvaluation](#sec-runtime-semantics-classdefinitionevaluation) of [ClassTail](#prod-ClassTail) with arguments `className` and `className`.
3.  Set `value`.`[[SourceText]]` to the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) [ClassDeclaration](#prod-ClassDeclaration).
4.  Let `env` be the [running execution context](#running-execution-context)'s LexicalEnvironment.
5.  Perform ? [InitializeBoundName](#sec-initializeboundname)(`className`, `value`, `env`).
6.  Return `value`.

[ClassDeclaration](#prod-ClassDeclaration) : class [ClassTail](#prod-ClassTail)

1.  Let `value` be ? [ClassDefinitionEvaluation](#sec-runtime-semantics-classdefinitionevaluation) of [ClassTail](#prod-ClassTail) with arguments undefined and "default".
2.  Set `value`.`[[SourceText]]` to the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) [ClassDeclaration](#prod-ClassDeclaration).
3.  Return `value`.

Note

[ClassDeclaration](#prod-ClassDeclaration) : class [ClassTail](#prod-ClassTail) only occurs as part of an [ExportDeclaration](#prod-ExportDeclaration) and establishing its binding is handled as part of the evaluation action for that production. See [16.2.3.7](#sec-exports-runtime-semantics-evaluation).

### 15.7.16 Runtime Semantics: Evaluation

[ClassDeclaration](#prod-ClassDeclaration) : class [BindingIdentifier](#prod-BindingIdentifier) [ClassTail](#prod-ClassTail)

1.  Perform ? [BindingClassDeclarationEvaluation](#sec-runtime-semantics-bindingclassdeclarationevaluation) of this [ClassDeclaration](#prod-ClassDeclaration).
2.  Return empty.

Note

[ClassDeclaration](#prod-ClassDeclaration) : class [ClassTail](#prod-ClassTail) only occurs as part of an [ExportDeclaration](#prod-ExportDeclaration) and is never directly evaluated.

[ClassExpression](#prod-ClassExpression) : class [ClassTail](#prod-ClassTail)

1.  Let `value` be ? [ClassDefinitionEvaluation](#sec-runtime-semantics-classdefinitionevaluation) of [ClassTail](#prod-ClassTail) with arguments undefined and "".
2.  Set `value`.`[[SourceText]]` to the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) [ClassExpression](#prod-ClassExpression).
3.  Return `value`.

[ClassExpression](#prod-ClassExpression) : class [BindingIdentifier](#prod-BindingIdentifier) [ClassTail](#prod-ClassTail)

1.  Let `className` be the [StringValue](#sec-static-semantics-stringvalue) of [BindingIdentifier](#prod-BindingIdentifier).
2.  Let `value` be ? [ClassDefinitionEvaluation](#sec-runtime-semantics-classdefinitionevaluation) of [ClassTail](#prod-ClassTail) with arguments `className` and `className`.
3.  Set `value`.`[[SourceText]]` to the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) [ClassExpression](#prod-ClassExpression).
4.  Return `value`.

[ClassElementName](#prod-ClassElementName) : [PrivateIdentifier](#prod-PrivateIdentifier)

1.  Let `privateIdentifier` be the [StringValue](#sec-static-semantics-stringvalue) of [PrivateIdentifier](#prod-PrivateIdentifier).
2.  Let `privateEnvRec` be the [running execution context](#running-execution-context)'s PrivateEnvironment.
3.  Let `names` be `privateEnvRec`.`[[Names]]`.
4.  [Assert](#assert): Exactly one element of `names` is a [Private Name](#sec-private-names) whose `[[Description]]` is `privateIdentifier`.
5.  Let `privateName` be the [Private Name](#sec-private-names) in `names` whose `[[Description]]` is `privateIdentifier`.
6.  Return `privateName`.

[ClassStaticBlockStatementList](#prod-ClassStaticBlockStatementList) : \[empty\]

1.  Return undefined.

## 15.8 Async Function Definitions

### Syntax

[AsyncFunctionDeclaration](#prod-AsyncFunctionDeclaration)\[Yield, Await, Default\] : async \[no [LineTerminator](#prod-LineTerminator) here\] function [BindingIdentifier](#prod-BindingIdentifier)\[?Yield, ?Await\] ( [FormalParameters](#prod-FormalParameters)\[~Yield, +Await\] ) { [AsyncFunctionBody](#prod-AsyncFunctionBody) } \[+Default\] async \[no [LineTerminator](#prod-LineTerminator) here\] function ( [FormalParameters](#prod-FormalParameters)\[~Yield, +Await\] ) { [AsyncFunctionBody](#prod-AsyncFunctionBody) } [AsyncFunctionExpression](#prod-AsyncFunctionExpression) : async \[no [LineTerminator](#prod-LineTerminator) here\] function [BindingIdentifier](#prod-BindingIdentifier)\[~Yield, +Await\]opt ( [FormalParameters](#prod-FormalParameters)\[~Yield, +Await\] ) { [AsyncFunctionBody](#prod-AsyncFunctionBody) } [AsyncMethod](#prod-AsyncMethod)\[Yield, Await\] : async \[no [LineTerminator](#prod-LineTerminator) here\] [ClassElementName](#prod-ClassElementName)\[?Yield, ?Await\] ( [UniqueFormalParameters](#prod-UniqueFormalParameters)\[~Yield, +Await\] ) { [AsyncFunctionBody](#prod-AsyncFunctionBody) } [AsyncFunctionBody](#prod-AsyncFunctionBody) : [FunctionBody](#prod-FunctionBody)\[~Yield, +Await\] [AwaitExpression](#prod-AwaitExpression)\[Yield\] : await [UnaryExpression](#prod-UnaryExpression)\[?Yield, +Await\] Note 1

`await` is parsed as a [keyword](#sec-keywords-and-reserved-words) of an [AwaitExpression](#prod-AwaitExpression) when the _(\[Await\]) parameter is present. The _(\[Await\]) parameter is present in the top level of the following contexts, although the parameter may be absent in some contexts depending on the nonterminals, such as [FunctionBody](#prod-FunctionBody):

- In an [AsyncFunctionBody](#prod-AsyncFunctionBody).
- In the [FormalParameters](#prod-FormalParameters) of an [AsyncFunctionDeclaration](#prod-AsyncFunctionDeclaration), [AsyncFunctionExpression](#prod-AsyncFunctionExpression), [AsyncGeneratorDeclaration](#prod-AsyncGeneratorDeclaration), or [AsyncGeneratorExpression](#prod-AsyncGeneratorExpression). [AwaitExpression](#prod-AwaitExpression) in this position is a Syntax error via [static semantics](#sec-static-semantic-rules).
- In a [Module](#prod-Module).

When [Script](#prod-Script) is the syntactic [goal symbol](#sec-context-free-grammars), `await` may be parsed as an identifier when the _(\[Await\]) parameter is absent. This includes the following contexts:

- Anywhere outside of an [AsyncFunctionBody](#prod-AsyncFunctionBody) or [FormalParameters](#prod-FormalParameters) of an [AsyncFunctionDeclaration](#prod-AsyncFunctionDeclaration), [AsyncFunctionExpression](#prod-AsyncFunctionExpression), [AsyncGeneratorDeclaration](#prod-AsyncGeneratorDeclaration), or [AsyncGeneratorExpression](#prod-AsyncGeneratorExpression).
- In the [BindingIdentifier](#prod-BindingIdentifier) of a [FunctionExpression](#prod-FunctionExpression), [GeneratorExpression](#prod-GeneratorExpression), or [AsyncGeneratorExpression](#prod-AsyncGeneratorExpression).

Note 2

Unlike [YieldExpression](#prod-YieldExpression), it is a Syntax Error to omit the operand of an [AwaitExpression](#prod-AwaitExpression). You must await something.

### 15.8.1 Static Semantics: Early Errors

[AsyncMethod](#prod-AsyncMethod) : async [ClassElementName](#prod-ClassElementName) ( [UniqueFormalParameters](#prod-UniqueFormalParameters) ) { [AsyncFunctionBody](#prod-AsyncFunctionBody) }

- It is a Syntax Error if [FunctionBodyContainsUseStrict](#sec-static-semantics-functionbodycontainsusestrict) of [AsyncFunctionBody](#prod-AsyncFunctionBody) is true and [IsSimpleParameterList](#sec-static-semantics-issimpleparameterlist) of [UniqueFormalParameters](#prod-UniqueFormalParameters) is false.
- It is a Syntax Error if [HasDirectSuper](#sec-static-semantics-hasdirectsuper) of [AsyncMethod](#prod-AsyncMethod) is true.
- It is a Syntax Error if [UniqueFormalParameters](#prod-UniqueFormalParameters) [Contains](#sec-static-semantics-contains) [AwaitExpression](#prod-AwaitExpression) is true.
- It is a Syntax Error if any element of the [BoundNames](#sec-static-semantics-boundnames) of [UniqueFormalParameters](#prod-UniqueFormalParameters) also occurs in the [LexicallyDeclaredNames](#sec-static-semantics-lexicallydeclarednames) of [AsyncFunctionBody](#prod-AsyncFunctionBody).

[AsyncFunctionDeclaration](#prod-AsyncFunctionDeclaration) : async function [BindingIdentifier](#prod-BindingIdentifier) ( [FormalParameters](#prod-FormalParameters) ) { [AsyncFunctionBody](#prod-AsyncFunctionBody) } async function ( [FormalParameters](#prod-FormalParameters) ) { [AsyncFunctionBody](#prod-AsyncFunctionBody) } [AsyncFunctionExpression](#prod-AsyncFunctionExpression) : async function [BindingIdentifier](#prod-BindingIdentifier)opt ( [FormalParameters](#prod-FormalParameters) ) { [AsyncFunctionBody](#prod-AsyncFunctionBody) }

- It is a Syntax Error if [FunctionBodyContainsUseStrict](#sec-static-semantics-functionbodycontainsusestrict) of [AsyncFunctionBody](#prod-AsyncFunctionBody) is true and [IsSimpleParameterList](#sec-static-semantics-issimpleparameterlist) of [FormalParameters](#prod-FormalParameters) is false.
- It is a Syntax Error if [FormalParameters](#prod-FormalParameters) [Contains](#sec-static-semantics-contains) [AwaitExpression](#prod-AwaitExpression) is true.
- If [IsStrict](#sec-isstrict)([FormalParameters](#prod-FormalParameters)) is true, the Early Error rules for [UniqueFormalParameters](#prod-UniqueFormalParameters) : [FormalParameters](#prod-FormalParameters) are applied.
- If [BindingIdentifier](#prod-BindingIdentifier) is present and [IsStrict](#sec-isstrict)([BindingIdentifier](#prod-BindingIdentifier)) is true, it is a Syntax Error if the [StringValue](#sec-static-semantics-stringvalue) of [BindingIdentifier](#prod-BindingIdentifier) is either "eval" or "arguments".
- It is a Syntax Error if any element of the [BoundNames](#sec-static-semantics-boundnames) of [FormalParameters](#prod-FormalParameters) also occurs in the [LexicallyDeclaredNames](#sec-static-semantics-lexicallydeclarednames) of [AsyncFunctionBody](#prod-AsyncFunctionBody).
- It is a Syntax Error if [FormalParameters](#prod-FormalParameters) [Contains](#sec-static-semantics-contains) [SuperProperty](#prod-SuperProperty) is true.
- It is a Syntax Error if [AsyncFunctionBody](#prod-AsyncFunctionBody) [Contains](#sec-static-semantics-contains) [SuperProperty](#prod-SuperProperty) is true.
- It is a Syntax Error if [FormalParameters](#prod-FormalParameters) [Contains](#sec-static-semantics-contains) [SuperCall](#prod-SuperCall) is true.
- It is a Syntax Error if [AsyncFunctionBody](#prod-AsyncFunctionBody) [Contains](#sec-static-semantics-contains) [SuperCall](#prod-SuperCall) is true.

### 15.8.2 Runtime Semantics: InstantiateAsyncFunctionObject

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) InstantiateAsyncFunctionObject takes arguments `env` (an [Environment Record](#sec-environment-records)) and `privateEnv` (a [PrivateEnvironment Record](#privateenvironment-record) or null) and returns an ECMAScript [function object](#function-object). It is defined piecewise over the following productions:

[AsyncFunctionDeclaration](#prod-AsyncFunctionDeclaration) : async function [BindingIdentifier](#prod-BindingIdentifier) ( [FormalParameters](#prod-FormalParameters) ) { [AsyncFunctionBody](#prod-AsyncFunctionBody) }

1.  Let `name` be the [StringValue](#sec-static-semantics-stringvalue) of [BindingIdentifier](#prod-BindingIdentifier).
2.  Let `sourceText` be the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) [AsyncFunctionDeclaration](#prod-AsyncFunctionDeclaration).
3.  Let `F` be [OrdinaryFunctionCreate](#sec-ordinaryfunctioncreate)([%AsyncFunction.prototype%](#sec-async-function-prototype-properties), `sourceText`, [FormalParameters](#prod-FormalParameters), [AsyncFunctionBody](#prod-AsyncFunctionBody), non-lexical-this, `env`, `privateEnv`).
4.  Perform [SetFunctionName](#sec-setfunctionname)(`F`, `name`).
5.  Return `F`.

[AsyncFunctionDeclaration](#prod-AsyncFunctionDeclaration) : async function ( [FormalParameters](#prod-FormalParameters) ) { [AsyncFunctionBody](#prod-AsyncFunctionBody) }

1.  Let `sourceText` be the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) [AsyncFunctionDeclaration](#prod-AsyncFunctionDeclaration).
2.  Let `F` be [OrdinaryFunctionCreate](#sec-ordinaryfunctioncreate)([%AsyncFunction.prototype%](#sec-async-function-prototype-properties), `sourceText`, [FormalParameters](#prod-FormalParameters), [AsyncFunctionBody](#prod-AsyncFunctionBody), non-lexical-this, `env`, `privateEnv`).
3.  Perform [SetFunctionName](#sec-setfunctionname)(`F`, "default").
4.  Return `F`.

### 15.8.3 Runtime Semantics: InstantiateAsyncFunctionExpression

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) InstantiateAsyncFunctionExpression takes optional argument `name` (a [property key](#property-key) or a [Private Name](#sec-private-names)) and returns an ECMAScript [function object](#function-object). It is defined piecewise over the following productions:

[AsyncFunctionExpression](#prod-AsyncFunctionExpression) : async function ( [FormalParameters](#prod-FormalParameters) ) { [AsyncFunctionBody](#prod-AsyncFunctionBody) }

1.  If `name` is not present, set `name` to "".
2.  Let `env` be the LexicalEnvironment of the [running execution context](#running-execution-context).
3.  Let `privateEnv` be the [running execution context](#running-execution-context)'s PrivateEnvironment.
4.  Let `sourceText` be the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) [AsyncFunctionExpression](#prod-AsyncFunctionExpression).
5.  Let `closure` be [OrdinaryFunctionCreate](#sec-ordinaryfunctioncreate)([%AsyncFunction.prototype%](#sec-async-function-prototype-properties), `sourceText`, [FormalParameters](#prod-FormalParameters), [AsyncFunctionBody](#prod-AsyncFunctionBody), non-lexical-this, `env`, `privateEnv`).
6.  Perform [SetFunctionName](#sec-setfunctionname)(`closure`, `name`).
7.  Return `closure`.

[AsyncFunctionExpression](#prod-AsyncFunctionExpression) : async function [BindingIdentifier](#prod-BindingIdentifier) ( [FormalParameters](#prod-FormalParameters) ) { [AsyncFunctionBody](#prod-AsyncFunctionBody) }

1.  [Assert](#assert): `name` is not present.
2.  Set `name` to the [StringValue](#sec-static-semantics-stringvalue) of [BindingIdentifier](#prod-BindingIdentifier).
3.  Let `outerEnv` be the LexicalEnvironment of the [running execution context](#running-execution-context).
4.  Let `funcEnv` be [NewDeclarativeEnvironment](#sec-newdeclarativeenvironment)(`outerEnv`).
5.  Perform ! `funcEnv`.CreateImmutableBinding(`name`, false).
6.  Let `privateEnv` be the [running execution context](#running-execution-context)'s PrivateEnvironment.
7.  Let `sourceText` be the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) [AsyncFunctionExpression](#prod-AsyncFunctionExpression).
8.  Let `closure` be [OrdinaryFunctionCreate](#sec-ordinaryfunctioncreate)([%AsyncFunction.prototype%](#sec-async-function-prototype-properties), `sourceText`, [FormalParameters](#prod-FormalParameters), [AsyncFunctionBody](#prod-AsyncFunctionBody), non-lexical-this, `funcEnv`, `privateEnv`).
9.  Perform [SetFunctionName](#sec-setfunctionname)(`closure`, `name`).
10. Perform ! `funcEnv`.InitializeBinding(`name`, `closure`).
11. Return `closure`.

Note

The [BindingIdentifier](#prod-BindingIdentifier) in an [AsyncFunctionExpression](#prod-AsyncFunctionExpression) can be referenced from inside the [AsyncFunctionExpression](#prod-AsyncFunctionExpression)'s [AsyncFunctionBody](#prod-AsyncFunctionBody) to allow the function to call itself recursively. However, unlike in a [FunctionDeclaration](#prod-FunctionDeclaration), the [BindingIdentifier](#prod-BindingIdentifier) in a [AsyncFunctionExpression](#prod-AsyncFunctionExpression) cannot be referenced from and does not affect the scope enclosing the [AsyncFunctionExpression](#prod-AsyncFunctionExpression).

### 15.8.4 Runtime Semantics: EvaluateAsyncFunctionBody

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) EvaluateAsyncFunctionBody takes arguments `functionObject` (an ECMAScript [function object](#function-object)) and `argumentsList` (a [List](#sec-list-and-record-specification-type) of [ECMAScript language values](#sec-ecmascript-language-types)) and returns a [return completion](#sec-completion-record-specification-type). It is defined piecewise over the following productions:

[AsyncFunctionBody](#prod-AsyncFunctionBody) : [FunctionBody](#prod-FunctionBody)

1.  Let `promiseCapability` be ! [NewPromiseCapability](#sec-newpromisecapability)([%Promise%](#sec-promise-constructor)).
2.  Let `completion` be [Completion](#sec-completion-ao)([FunctionDeclarationInstantiation](#sec-functiondeclarationinstantiation)(`functionObject`, `argumentsList`)).
3.  If `completion` is an [abrupt completion](#sec-completion-record-specification-type), then
    1.  Perform ! [Call](#sec-call)(`promiseCapability`.`[[Reject]]`, undefined, « `completion`.`[[Value]]` »).
4.  Else,
    1.  Perform [AsyncFunctionStart](#sec-async-functions-abstract-operations-async-function-start)(`promiseCapability`, [FunctionBody](#prod-FunctionBody)).
5.  Return [ReturnCompletion](#sec-returncompletion)(`promiseCapability`.`[[Promise]]`).

### 15.8.5 Runtime Semantics: Evaluation

[AsyncFunctionExpression](#prod-AsyncFunctionExpression) : async function [BindingIdentifier](#prod-BindingIdentifier)opt ( [FormalParameters](#prod-FormalParameters) ) { [AsyncFunctionBody](#prod-AsyncFunctionBody) }

1.  Return [InstantiateAsyncFunctionExpression](#sec-runtime-semantics-instantiateasyncfunctionexpression) of [AsyncFunctionExpression](#prod-AsyncFunctionExpression).

[AwaitExpression](#prod-AwaitExpression) : await [UnaryExpression](#prod-UnaryExpression)

1.  Let `exprRef` be ? [Evaluation](#sec-evaluation) of [UnaryExpression](#prod-UnaryExpression).
2.  Let `value` be ? [GetValue](#sec-getvalue)(`exprRef`).
3.  Return ? [Await](#await)(`value`).

## 15.9 Async Arrow Function Definitions

### Syntax

[AsyncArrowFunction](#prod-AsyncArrowFunction)\[In, Yield, Await\] : async \[no [LineTerminator](#prod-LineTerminator) here\] [AsyncArrowBindingIdentifier](#prod-AsyncArrowBindingIdentifier)\[?Yield\] \[no [LineTerminator](#prod-LineTerminator) here\] =\> [AsyncConciseBody](#prod-AsyncConciseBody)\[?In\] [CoverCallExpressionAndAsyncArrowHead](#prod-CoverCallExpressionAndAsyncArrowHead)\[?Yield, ?Await\] \[no [LineTerminator](#prod-LineTerminator) here\] =\> [AsyncConciseBody](#prod-AsyncConciseBody)\[?In\] [AsyncConciseBody](#prod-AsyncConciseBody)\[In\] : \[lookahead ≠ {\] [ExpressionBody](#prod-ExpressionBody)\[?In, +Await\] { [AsyncFunctionBody](#prod-AsyncFunctionBody) } [AsyncArrowBindingIdentifier](#prod-AsyncArrowBindingIdentifier)\[Yield\] : [BindingIdentifier](#prod-BindingIdentifier)\[?Yield, +Await\] [CoverCallExpressionAndAsyncArrowHead](#prod-CoverCallExpressionAndAsyncArrowHead)\[Yield, Await\] : [MemberExpression](#prod-MemberExpression)\[?Yield, ?Await\] [Arguments](#prod-Arguments)\[?Yield, ?Await\]

### Supplemental Syntax

When processing an instance of the production  
[AsyncArrowFunction](#prod-AsyncArrowFunction) : [CoverCallExpressionAndAsyncArrowHead](#prod-CoverCallExpressionAndAsyncArrowHead) =\> [AsyncConciseBody](#prod-AsyncConciseBody)  
the interpretation of [CoverCallExpressionAndAsyncArrowHead](#prod-CoverCallExpressionAndAsyncArrowHead) is refined using the following grammar:

[AsyncArrowHead](#prod-AsyncArrowHead) : async \[no [LineTerminator](#prod-LineTerminator) here\] [ArrowFormalParameters](#prod-ArrowFormalParameters)\[~Yield, +Await\]

### 15.9.1 Static Semantics: Early Errors

[AsyncArrowFunction](#prod-AsyncArrowFunction) : async [AsyncArrowBindingIdentifier](#prod-AsyncArrowBindingIdentifier) =\> [AsyncConciseBody](#prod-AsyncConciseBody)

- It is a Syntax Error if any element of the [BoundNames](#sec-static-semantics-boundnames) of [AsyncArrowBindingIdentifier](#prod-AsyncArrowBindingIdentifier) also occurs in the [LexicallyDeclaredNames](#sec-static-semantics-lexicallydeclarednames) of [AsyncConciseBody](#prod-AsyncConciseBody).

[AsyncArrowFunction](#prod-AsyncArrowFunction) : [CoverCallExpressionAndAsyncArrowHead](#prod-CoverCallExpressionAndAsyncArrowHead) =\> [AsyncConciseBody](#prod-AsyncConciseBody)

- [CoverCallExpressionAndAsyncArrowHead](#prod-CoverCallExpressionAndAsyncArrowHead) [must cover](#must-cover) an [AsyncArrowHead](#prod-AsyncArrowHead).
- It is a Syntax Error if [CoverCallExpressionAndAsyncArrowHead](#prod-CoverCallExpressionAndAsyncArrowHead) [Contains](#sec-static-semantics-contains) [YieldExpression](#prod-YieldExpression) is true.
- It is a Syntax Error if [CoverCallExpressionAndAsyncArrowHead](#prod-CoverCallExpressionAndAsyncArrowHead) [Contains](#sec-static-semantics-contains) [AwaitExpression](#prod-AwaitExpression) is true.
- It is a Syntax Error if any element of the [BoundNames](#sec-static-semantics-boundnames) of [CoverCallExpressionAndAsyncArrowHead](#prod-CoverCallExpressionAndAsyncArrowHead) also occurs in the [LexicallyDeclaredNames](#sec-static-semantics-lexicallydeclarednames) of [AsyncConciseBody](#prod-AsyncConciseBody).
- It is a Syntax Error if [AsyncConciseBodyContainsUseStrict](#sec-static-semantics-asyncconcisebodycontainsusestrict) of [AsyncConciseBody](#prod-AsyncConciseBody) is true and [IsSimpleParameterList](#sec-static-semantics-issimpleparameterlist) of [CoverCallExpressionAndAsyncArrowHead](#prod-CoverCallExpressionAndAsyncArrowHead) is false.

### 15.9.2 Static Semantics: AsyncConciseBodyContainsUseStrict

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) AsyncConciseBodyContainsUseStrict takes no arguments and returns a Boolean. It is defined piecewise over the following productions:

[AsyncConciseBody](#prod-AsyncConciseBody) : [ExpressionBody](#prod-ExpressionBody)

1.  Return false.

[AsyncConciseBody](#prod-AsyncConciseBody) : { [AsyncFunctionBody](#prod-AsyncFunctionBody) }

1.  Return [FunctionBodyContainsUseStrict](#sec-static-semantics-functionbodycontainsusestrict) of [AsyncFunctionBody](#prod-AsyncFunctionBody).

### 15.9.3 Runtime Semantics: EvaluateAsyncConciseBody

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) EvaluateAsyncConciseBody takes arguments `functionObject` (an ECMAScript [function object](#function-object)) and `argumentsList` (a [List](#sec-list-and-record-specification-type) of [ECMAScript language values](#sec-ecmascript-language-types)) and returns a [return completion](#sec-completion-record-specification-type). It is defined piecewise over the following productions:

[AsyncConciseBody](#prod-AsyncConciseBody) : [ExpressionBody](#prod-ExpressionBody)

1.  Let `promiseCapability` be ! [NewPromiseCapability](#sec-newpromisecapability)([%Promise%](#sec-promise-constructor)).
2.  Let `completion` be [Completion](#sec-completion-ao)([FunctionDeclarationInstantiation](#sec-functiondeclarationinstantiation)(`functionObject`, `argumentsList`)).
3.  If `completion` is an [abrupt completion](#sec-completion-record-specification-type), then
    1.  Perform ! [Call](#sec-call)(`promiseCapability`.`[[Reject]]`, undefined, « `completion`.`[[Value]]` »).
4.  Else,
    1.  Perform [AsyncFunctionStart](#sec-async-functions-abstract-operations-async-function-start)(`promiseCapability`, [ExpressionBody](#prod-ExpressionBody)).
5.  Return [ReturnCompletion](#sec-returncompletion)(`promiseCapability`.`[[Promise]]`).

### 15.9.4 Runtime Semantics: InstantiateAsyncArrowFunctionExpression

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) InstantiateAsyncArrowFunctionExpression takes optional argument `name` (a [property key](#property-key) or a [Private Name](#sec-private-names)) and returns an ECMAScript [function object](#function-object). It is defined piecewise over the following productions:

[AsyncArrowFunction](#prod-AsyncArrowFunction) : async [AsyncArrowBindingIdentifier](#prod-AsyncArrowBindingIdentifier) =\> [AsyncConciseBody](#prod-AsyncConciseBody)

1.  If `name` is not present, set `name` to "".
2.  Let `env` be the LexicalEnvironment of the [running execution context](#running-execution-context).
3.  Let `privateEnv` be the [running execution context](#running-execution-context)'s PrivateEnvironment.
4.  Let `sourceText` be the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) [AsyncArrowFunction](#prod-AsyncArrowFunction).
5.  Let `parameters` be [AsyncArrowBindingIdentifier](#prod-AsyncArrowBindingIdentifier).
6.  Let `closure` be [OrdinaryFunctionCreate](#sec-ordinaryfunctioncreate)([%AsyncFunction.prototype%](#sec-async-function-prototype-properties), `sourceText`, `parameters`, [AsyncConciseBody](#prod-AsyncConciseBody), lexical-this, `env`, `privateEnv`).
7.  Perform [SetFunctionName](#sec-setfunctionname)(`closure`, `name`).
8.  Return `closure`.

[AsyncArrowFunction](#prod-AsyncArrowFunction) : [CoverCallExpressionAndAsyncArrowHead](#prod-CoverCallExpressionAndAsyncArrowHead) =\> [AsyncConciseBody](#prod-AsyncConciseBody)

1.  If `name` is not present, set `name` to "".
2.  Let `env` be the LexicalEnvironment of the [running execution context](#running-execution-context).
3.  Let `privateEnv` be the [running execution context](#running-execution-context)'s PrivateEnvironment.
4.  Let `sourceText` be the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) [AsyncArrowFunction](#prod-AsyncArrowFunction).
5.  Let `head` be the [AsyncArrowHead](#prod-AsyncArrowHead) that is [covered](#sec-syntactic-grammar) by [CoverCallExpressionAndAsyncArrowHead](#prod-CoverCallExpressionAndAsyncArrowHead).
6.  Let `parameters` be the [ArrowFormalParameters](#prod-ArrowFormalParameters) of `head`.
7.  Let `closure` be [OrdinaryFunctionCreate](#sec-ordinaryfunctioncreate)([%AsyncFunction.prototype%](#sec-async-function-prototype-properties), `sourceText`, `parameters`, [AsyncConciseBody](#prod-AsyncConciseBody), lexical-this, `env`, `privateEnv`).
8.  Perform [SetFunctionName](#sec-setfunctionname)(`closure`, `name`).
9.  Return `closure`.

### 15.9.5 Runtime Semantics: Evaluation

[AsyncArrowFunction](#prod-AsyncArrowFunction) : async [AsyncArrowBindingIdentifier](#prod-AsyncArrowBindingIdentifier) =\> [AsyncConciseBody](#prod-AsyncConciseBody) [CoverCallExpressionAndAsyncArrowHead](#prod-CoverCallExpressionAndAsyncArrowHead) =\> [AsyncConciseBody](#prod-AsyncConciseBody)

1.  Return [InstantiateAsyncArrowFunctionExpression](#sec-runtime-semantics-instantiateasyncarrowfunctionexpression) of [AsyncArrowFunction](#prod-AsyncArrowFunction).

## 15.10 Tail Position Calls

### 15.10.1 Static Semantics: IsInTailPosition ( `call` )

The abstract operation IsInTailPosition takes argument `call` (a [CallExpression](#prod-CallExpression) [Parse Node](#sec-syntactic-grammar), a [MemberExpression](#prod-MemberExpression) [Parse Node](#sec-syntactic-grammar), or an [OptionalChain](#prod-OptionalChain) [Parse Node](#sec-syntactic-grammar)) and returns a Boolean. It performs the following steps when called:

1.  If [IsStrict](#sec-isstrict)(`call`) is false, return false.
2.  If `call` is not contained within a [FunctionBody](#prod-FunctionBody), a [ConciseBody](#prod-ConciseBody), or an [AsyncConciseBody](#prod-AsyncConciseBody), return false.
3.  Let `body` be the [FunctionBody](#prod-FunctionBody), [ConciseBody](#prod-ConciseBody), or [AsyncConciseBody](#prod-AsyncConciseBody) that most closely contains `call`.
4.  If `body` is the [FunctionBody](#prod-FunctionBody) of a [GeneratorBody](#prod-GeneratorBody), return false.
5.  If `body` is the [FunctionBody](#prod-FunctionBody) of an [AsyncFunctionBody](#prod-AsyncFunctionBody), return false.
6.  If `body` is the [FunctionBody](#prod-FunctionBody) of an [AsyncGeneratorBody](#prod-AsyncGeneratorBody), return false.
7.  If `body` is an [AsyncConciseBody](#prod-AsyncConciseBody), return false.
8.  Return the result of [HasCallInTailPosition](#sec-static-semantics-hascallintailposition) of `body` with argument `call`.

Note

Tail Position calls are only defined in [strict mode code](#sec-strict-mode-code) because of a common non-standard language extension (see [10.2.4](#sec-addrestrictedfunctionproperties)) that enables observation of the chain of caller contexts.

### 15.10.2 Static Semantics: HasCallInTailPosition

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) HasCallInTailPosition takes argument `call` (a [CallExpression](#prod-CallExpression) [Parse Node](#sec-syntactic-grammar), a [MemberExpression](#prod-MemberExpression) [Parse Node](#sec-syntactic-grammar), or an [OptionalChain](#prod-OptionalChain) [Parse Node](#sec-syntactic-grammar)) and returns a Boolean.

Note 1

`call` is a [Parse Node](#sec-syntactic-grammar) that represents a specific range of source text. When the following algorithms compare `call` to another [Parse Node](#sec-syntactic-grammar), it is a test of whether they represent the same source text.

Note 2

A potential tail position call that is immediately followed by return [GetValue](#sec-getvalue) of the call result is also a possible tail position call. A function call cannot return a [Reference Record](#sec-reference-record-specification-type), so such a [GetValue](#sec-getvalue) operation will always return the same value as the actual function call result.

It is defined piecewise over the following productions:

[StatementList](#prod-StatementList) : [StatementList](#prod-StatementList) [StatementListItem](#prod-StatementListItem)

1.  Let `has` be [HasCallInTailPosition](#sec-static-semantics-hascallintailposition) of [StatementList](#prod-StatementList) with argument `call`.
2.  If `has` is true, return true.
3.  Return [HasCallInTailPosition](#sec-static-semantics-hascallintailposition) of [StatementListItem](#prod-StatementListItem) with argument `call`.

[FunctionStatementList](#prod-FunctionStatementList) : \[empty\] [StatementListItem](#prod-StatementListItem) : [Declaration](#prod-Declaration) [Statement](#prod-Statement) : [VariableStatement](#prod-VariableStatement) [EmptyStatement](#prod-EmptyStatement) [ExpressionStatement](#prod-ExpressionStatement) [ContinueStatement](#prod-ContinueStatement) [BreakStatement](#prod-BreakStatement) [ThrowStatement](#prod-ThrowStatement) [DebuggerStatement](#prod-DebuggerStatement) [Block](#prod-Block) : { } [ReturnStatement](#prod-ReturnStatement) : return ; [LabelledItem](#prod-LabelledItem) : [FunctionDeclaration](#prod-FunctionDeclaration) [ForInOfStatement](#prod-ForInOfStatement) : for ( [LeftHandSideExpression](#prod-LeftHandSideExpression) of [AssignmentExpression](#prod-AssignmentExpression) ) [Statement](#prod-Statement) for ( var [ForBinding](#prod-ForBinding) of [AssignmentExpression](#prod-AssignmentExpression) ) [Statement](#prod-Statement) for ( [ForDeclaration](#prod-ForDeclaration) of [AssignmentExpression](#prod-AssignmentExpression) ) [Statement](#prod-Statement) [CaseBlock](#prod-CaseBlock) : { }

1.  Return false.

[IfStatement](#prod-IfStatement) : if ( [Expression](#prod-Expression) ) [Statement](#prod-Statement) else [Statement](#prod-Statement)

1.  Let `has` be [HasCallInTailPosition](#sec-static-semantics-hascallintailposition) of the first [Statement](#prod-Statement) with argument `call`.
2.  If `has` is true, return true.
3.  Return [HasCallInTailPosition](#sec-static-semantics-hascallintailposition) of the second [Statement](#prod-Statement) with argument `call`.

[IfStatement](#prod-IfStatement) : if ( [Expression](#prod-Expression) ) [Statement](#prod-Statement) [DoWhileStatement](#prod-DoWhileStatement) : do [Statement](#prod-Statement) while ( [Expression](#prod-Expression) ) ; [WhileStatement](#prod-WhileStatement) : while ( [Expression](#prod-Expression) ) [Statement](#prod-Statement) [ForStatement](#prod-ForStatement) : for ( [Expression](#prod-Expression)opt ; [Expression](#prod-Expression)opt ; [Expression](#prod-Expression)opt ) [Statement](#prod-Statement) for ( var [VariableDeclarationList](#prod-VariableDeclarationList) ; [Expression](#prod-Expression)opt ; [Expression](#prod-Expression)opt ) [Statement](#prod-Statement) for ( [LexicalDeclaration](#prod-LexicalDeclaration) [Expression](#prod-Expression)opt ; [Expression](#prod-Expression)opt ) [Statement](#prod-Statement) [ForInOfStatement](#prod-ForInOfStatement) : for ( [LeftHandSideExpression](#prod-LeftHandSideExpression) in [Expression](#prod-Expression) ) [Statement](#prod-Statement) for ( var [ForBinding](#prod-ForBinding) in [Expression](#prod-Expression) ) [Statement](#prod-Statement) for ( [ForDeclaration](#prod-ForDeclaration) in [Expression](#prod-Expression) ) [Statement](#prod-Statement) [WithStatement](#prod-WithStatement) : with ( [Expression](#prod-Expression) ) [Statement](#prod-Statement)

1.  Return [HasCallInTailPosition](#sec-static-semantics-hascallintailposition) of [Statement](#prod-Statement) with argument `call`.

[LabelledStatement](#prod-LabelledStatement) : [LabelIdentifier](#prod-LabelIdentifier) : [LabelledItem](#prod-LabelledItem)

1.  Return [HasCallInTailPosition](#sec-static-semantics-hascallintailposition) of [LabelledItem](#prod-LabelledItem) with argument `call`.

[ReturnStatement](#prod-ReturnStatement) : return [Expression](#prod-Expression) ;

1.  Return [HasCallInTailPosition](#sec-static-semantics-hascallintailposition) of [Expression](#prod-Expression) with argument `call`.

[SwitchStatement](#prod-SwitchStatement) : switch ( [Expression](#prod-Expression) ) [CaseBlock](#prod-CaseBlock)

1.  Return [HasCallInTailPosition](#sec-static-semantics-hascallintailposition) of [CaseBlock](#prod-CaseBlock) with argument `call`.

[CaseBlock](#prod-CaseBlock) : { [CaseClauses](#prod-CaseClauses)opt [DefaultClause](#prod-DefaultClause) [CaseClauses](#prod-CaseClauses)opt }

1.  Let `has` be false.
2.  If the first [CaseClauses](#prod-CaseClauses) is present, set `has` to [HasCallInTailPosition](#sec-static-semantics-hascallintailposition) of the first [CaseClauses](#prod-CaseClauses) with argument `call`.
3.  If `has` is true, return true.
4.  Set `has` to [HasCallInTailPosition](#sec-static-semantics-hascallintailposition) of [DefaultClause](#prod-DefaultClause) with argument `call`.
5.  If `has` is true, return true.
6.  If the second [CaseClauses](#prod-CaseClauses) is present, set `has` to [HasCallInTailPosition](#sec-static-semantics-hascallintailposition) of the second [CaseClauses](#prod-CaseClauses) with argument `call`.
7.  Return `has`.

[CaseClauses](#prod-CaseClauses) : [CaseClauses](#prod-CaseClauses) [CaseClause](#prod-CaseClause)

1.  Let `has` be [HasCallInTailPosition](#sec-static-semantics-hascallintailposition) of [CaseClauses](#prod-CaseClauses) with argument `call`.
2.  If `has` is true, return true.
3.  Return [HasCallInTailPosition](#sec-static-semantics-hascallintailposition) of [CaseClause](#prod-CaseClause) with argument `call`.

[CaseClause](#prod-CaseClause) : case [Expression](#prod-Expression) : [StatementList](#prod-StatementList)opt [DefaultClause](#prod-DefaultClause) : default : [StatementList](#prod-StatementList)opt

1.  If [StatementList](#prod-StatementList) is present, return [HasCallInTailPosition](#sec-static-semantics-hascallintailposition) of [StatementList](#prod-StatementList) with argument `call`.
2.  Return false.

[TryStatement](#prod-TryStatement) : try [Block](#prod-Block) [Catch](#prod-Catch)

1.  Return [HasCallInTailPosition](#sec-static-semantics-hascallintailposition) of [Catch](#prod-Catch) with argument `call`.

[TryStatement](#prod-TryStatement) : try [Block](#prod-Block) [Finally](#prod-Finally) try [Block](#prod-Block) [Catch](#prod-Catch) [Finally](#prod-Finally)

1.  Return [HasCallInTailPosition](#sec-static-semantics-hascallintailposition) of [Finally](#prod-Finally) with argument `call`.

[Catch](#prod-Catch) : catch ( [CatchParameter](#prod-CatchParameter) ) [Block](#prod-Block)

1.  Return [HasCallInTailPosition](#sec-static-semantics-hascallintailposition) of [Block](#prod-Block) with argument `call`.

[AssignmentExpression](#prod-AssignmentExpression) : [YieldExpression](#prod-YieldExpression) [ArrowFunction](#prod-ArrowFunction) [AsyncArrowFunction](#prod-AsyncArrowFunction) [LeftHandSideExpression](#prod-LeftHandSideExpression) = [AssignmentExpression](#prod-AssignmentExpression) [LeftHandSideExpression](#prod-LeftHandSideExpression) [AssignmentOperator](#prod-AssignmentOperator) [AssignmentExpression](#prod-AssignmentExpression) [LeftHandSideExpression](#prod-LeftHandSideExpression) &&= [AssignmentExpression](#prod-AssignmentExpression) [LeftHandSideExpression](#prod-LeftHandSideExpression) \|\|= [AssignmentExpression](#prod-AssignmentExpression) [LeftHandSideExpression](#prod-LeftHandSideExpression) ??= [AssignmentExpression](#prod-AssignmentExpression) [BitwiseANDExpression](#prod-BitwiseANDExpression) : [BitwiseANDExpression](#prod-BitwiseANDExpression) & [EqualityExpression](#prod-EqualityExpression) [BitwiseXORExpression](#prod-BitwiseXORExpression) : [BitwiseXORExpression](#prod-BitwiseXORExpression) ^ [BitwiseANDExpression](#prod-BitwiseANDExpression) [BitwiseORExpression](#prod-BitwiseORExpression) : [BitwiseORExpression](#prod-BitwiseORExpression) \| [BitwiseXORExpression](#prod-BitwiseXORExpression) [EqualityExpression](#prod-EqualityExpression) : [EqualityExpression](#prod-EqualityExpression) == [RelationalExpression](#prod-RelationalExpression) [EqualityExpression](#prod-EqualityExpression) != [RelationalExpression](#prod-RelationalExpression) [EqualityExpression](#prod-EqualityExpression) === [RelationalExpression](#prod-RelationalExpression) [EqualityExpression](#prod-EqualityExpression) !== [RelationalExpression](#prod-RelationalExpression) [RelationalExpression](#prod-RelationalExpression) : [RelationalExpression](#prod-RelationalExpression) \< [ShiftExpression](#prod-ShiftExpression) [RelationalExpression](#prod-RelationalExpression) \> [ShiftExpression](#prod-ShiftExpression) [RelationalExpression](#prod-RelationalExpression) \<= [ShiftExpression](#prod-ShiftExpression) [RelationalExpression](#prod-RelationalExpression) \>= [ShiftExpression](#prod-ShiftExpression) [RelationalExpression](#prod-RelationalExpression) instanceof [ShiftExpression](#prod-ShiftExpression) [RelationalExpression](#prod-RelationalExpression) in [ShiftExpression](#prod-ShiftExpression) [PrivateIdentifier](#prod-PrivateIdentifier) in [ShiftExpression](#prod-ShiftExpression) [ShiftExpression](#prod-ShiftExpression) : [ShiftExpression](#prod-ShiftExpression) \<\< [AdditiveExpression](#prod-AdditiveExpression) [ShiftExpression](#prod-ShiftExpression) \>\> [AdditiveExpression](#prod-AdditiveExpression) [ShiftExpression](#prod-ShiftExpression) \>\>\> [AdditiveExpression](#prod-AdditiveExpression) [AdditiveExpression](#prod-AdditiveExpression) : [AdditiveExpression](#prod-AdditiveExpression) + [MultiplicativeExpression](#prod-MultiplicativeExpression) [AdditiveExpression](#prod-AdditiveExpression) - [MultiplicativeExpression](#prod-MultiplicativeExpression) [MultiplicativeExpression](#prod-MultiplicativeExpression) : [MultiplicativeExpression](#prod-MultiplicativeExpression) [MultiplicativeOperator](#prod-MultiplicativeOperator) [ExponentiationExpression](#prod-ExponentiationExpression) [ExponentiationExpression](#prod-ExponentiationExpression) : [UpdateExpression](#prod-UpdateExpression) \*\* [ExponentiationExpression](#prod-ExponentiationExpression) [UpdateExpression](#prod-UpdateExpression) : [LeftHandSideExpression](#prod-LeftHandSideExpression) ++ [LeftHandSideExpression](#prod-LeftHandSideExpression) -- ++ [UnaryExpression](#prod-UnaryExpression) -- [UnaryExpression](#prod-UnaryExpression) [UnaryExpression](#prod-UnaryExpression) : delete [UnaryExpression](#prod-UnaryExpression) void [UnaryExpression](#prod-UnaryExpression) typeof [UnaryExpression](#prod-UnaryExpression) + [UnaryExpression](#prod-UnaryExpression) - [UnaryExpression](#prod-UnaryExpression) ~ [UnaryExpression](#prod-UnaryExpression) ! [UnaryExpression](#prod-UnaryExpression) [AwaitExpression](#prod-AwaitExpression) [CallExpression](#prod-CallExpression) : [SuperCall](#prod-SuperCall) [ImportCall](#prod-ImportCall) [CallExpression](#prod-CallExpression) \[ [Expression](#prod-Expression) \] [CallExpression](#prod-CallExpression) . [IdentifierName](#prod-IdentifierName) [CallExpression](#prod-CallExpression) . [PrivateIdentifier](#prod-PrivateIdentifier) [NewExpression](#prod-NewExpression) : new [NewExpression](#prod-NewExpression) [MemberExpression](#prod-MemberExpression) : [MemberExpression](#prod-MemberExpression) \[ [Expression](#prod-Expression) \] [MemberExpression](#prod-MemberExpression) . [IdentifierName](#prod-IdentifierName) [SuperProperty](#prod-SuperProperty) [MetaProperty](#prod-MetaProperty) new [MemberExpression](#prod-MemberExpression) [Arguments](#prod-Arguments) [MemberExpression](#prod-MemberExpression) . [PrivateIdentifier](#prod-PrivateIdentifier) [PrimaryExpression](#prod-PrimaryExpression) : this [IdentifierReference](#prod-IdentifierReference) [Literal](#prod-Literal) [ArrayLiteral](#prod-ArrayLiteral) [ObjectLiteral](#prod-ObjectLiteral) [FunctionExpression](#prod-FunctionExpression) [ClassExpression](#prod-ClassExpression) [GeneratorExpression](#prod-GeneratorExpression) [AsyncFunctionExpression](#prod-AsyncFunctionExpression) [AsyncGeneratorExpression](#prod-AsyncGeneratorExpression) [RegularExpressionLiteral](#prod-RegularExpressionLiteral) [TemplateLiteral](#prod-TemplateLiteral)

1.  Return false.

[Expression](#prod-Expression) : [AssignmentExpression](#prod-AssignmentExpression) [Expression](#prod-Expression) , [AssignmentExpression](#prod-AssignmentExpression)

1.  Return [HasCallInTailPosition](#sec-static-semantics-hascallintailposition) of [AssignmentExpression](#prod-AssignmentExpression) with argument `call`.

[ConditionalExpression](#prod-ConditionalExpression) : [ShortCircuitExpression](#prod-ShortCircuitExpression) ? [AssignmentExpression](#prod-AssignmentExpression) : [AssignmentExpression](#prod-AssignmentExpression)

1.  Let `has` be [HasCallInTailPosition](#sec-static-semantics-hascallintailposition) of the first [AssignmentExpression](#prod-AssignmentExpression) with argument `call`.
2.  If `has` is true, return true.
3.  Return [HasCallInTailPosition](#sec-static-semantics-hascallintailposition) of the second [AssignmentExpression](#prod-AssignmentExpression) with argument `call`.

[LogicalANDExpression](#prod-LogicalANDExpression) : [LogicalANDExpression](#prod-LogicalANDExpression) && [BitwiseORExpression](#prod-BitwiseORExpression)

1.  Return [HasCallInTailPosition](#sec-static-semantics-hascallintailposition) of [BitwiseORExpression](#prod-BitwiseORExpression) with argument `call`.

[LogicalORExpression](#prod-LogicalORExpression) : [LogicalORExpression](#prod-LogicalORExpression) \|\| [LogicalANDExpression](#prod-LogicalANDExpression)

1.  Return [HasCallInTailPosition](#sec-static-semantics-hascallintailposition) of [LogicalANDExpression](#prod-LogicalANDExpression) with argument `call`.

[CoalesceExpression](#prod-CoalesceExpression) : [CoalesceExpressionHead](#prod-CoalesceExpressionHead) ?? [BitwiseORExpression](#prod-BitwiseORExpression)

1.  Return [HasCallInTailPosition](#sec-static-semantics-hascallintailposition) of [BitwiseORExpression](#prod-BitwiseORExpression) with argument `call`.

[CallExpression](#prod-CallExpression) : [CoverCallExpressionAndAsyncArrowHead](#prod-CoverCallExpressionAndAsyncArrowHead) [CallExpression](#prod-CallExpression) [Arguments](#prod-Arguments) [CallExpression](#prod-CallExpression) [TemplateLiteral](#prod-TemplateLiteral)

1.  If this [CallExpression](#prod-CallExpression) is `call`, return true.
2.  Return false.

[OptionalExpression](#prod-OptionalExpression) : [MemberExpression](#prod-MemberExpression) [OptionalChain](#prod-OptionalChain) [CallExpression](#prod-CallExpression) [OptionalChain](#prod-OptionalChain) [OptionalExpression](#prod-OptionalExpression) [OptionalChain](#prod-OptionalChain)

1.  Return [HasCallInTailPosition](#sec-static-semantics-hascallintailposition) of [OptionalChain](#prod-OptionalChain) with argument `call`.

[OptionalChain](#prod-OptionalChain) : ?. \[ [Expression](#prod-Expression) \] ?. [IdentifierName](#prod-IdentifierName) ?. [PrivateIdentifier](#prod-PrivateIdentifier) [OptionalChain](#prod-OptionalChain) \[ [Expression](#prod-Expression) \] [OptionalChain](#prod-OptionalChain) . [IdentifierName](#prod-IdentifierName) [OptionalChain](#prod-OptionalChain) . [PrivateIdentifier](#prod-PrivateIdentifier)

1.  Return false.

[OptionalChain](#prod-OptionalChain) : ?. [Arguments](#prod-Arguments) [OptionalChain](#prod-OptionalChain) [Arguments](#prod-Arguments)

1.  If this [OptionalChain](#prod-OptionalChain) is `call`, return true.
2.  Return false.

[MemberExpression](#prod-MemberExpression) : [MemberExpression](#prod-MemberExpression) [TemplateLiteral](#prod-TemplateLiteral)

1.  If this [MemberExpression](#prod-MemberExpression) is `call`, return true.
2.  Return false.

[PrimaryExpression](#prod-PrimaryExpression) : [CoverParenthesizedExpressionAndArrowParameterList](#prod-CoverParenthesizedExpressionAndArrowParameterList)

1.  Let `expr` be the [ParenthesizedExpression](#prod-ParenthesizedExpression) that is [covered](#sec-syntactic-grammar) by [CoverParenthesizedExpressionAndArrowParameterList](#prod-CoverParenthesizedExpressionAndArrowParameterList).
2.  Return [HasCallInTailPosition](#sec-static-semantics-hascallintailposition) of `expr` with argument `call`.

[ParenthesizedExpression](#prod-ParenthesizedExpression) : ( [Expression](#prod-Expression) )

1.  Return [HasCallInTailPosition](#sec-static-semantics-hascallintailposition) of [Expression](#prod-Expression) with argument `call`.

### 15.10.3 PrepareForTailCall ( )

The abstract operation PrepareForTailCall takes no arguments and returns unused. It performs the following steps when called:

1.  [Assert](#assert): The current [execution context](#sec-execution-contexts) will not subsequently be used for the evaluation of any ECMAScript code or built-in functions. The invocation of Call subsequent to the invocation of this abstract operation will create and push a new [execution context](#sec-execution-contexts) before performing any such evaluation.
2.  Discard all resources associated with the current [execution context](#sec-execution-contexts).
3.  Return unused.

A tail position call must either release any transient internal resources associated with the currently executing function [execution context](#sec-execution-contexts) before invoking the target function or reuse those resources in support of the target function.

Note

For example, a tail position call should only grow an implementation's activation record stack by the amount that the size of the target function's activation record exceeds the size of the calling function's activation record. If the target function's activation record is smaller, then the total size of the stack should decrease.
