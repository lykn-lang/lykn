# 14 ECMAScript Language: Statements and Declarations

## Syntax

[Statement](#prod-Statement)\[Yield, Await, Return\] : [BlockStatement](#prod-BlockStatement)\[?Yield, ?Await, ?Return\] [VariableStatement](#prod-VariableStatement)\[?Yield, ?Await\] [EmptyStatement](#prod-EmptyStatement) [ExpressionStatement](#prod-ExpressionStatement)\[?Yield, ?Await\] [IfStatement](#prod-IfStatement)\[?Yield, ?Await, ?Return\] [BreakableStatement](#prod-BreakableStatement)\[?Yield, ?Await, ?Return\] [ContinueStatement](#prod-ContinueStatement)\[?Yield, ?Await\] [BreakStatement](#prod-BreakStatement)\[?Yield, ?Await\] \[+Return\] [ReturnStatement](#prod-ReturnStatement)\[?Yield, ?Await\] [WithStatement](#prod-WithStatement)\[?Yield, ?Await, ?Return\] [LabelledStatement](#prod-LabelledStatement)\[?Yield, ?Await, ?Return\] [ThrowStatement](#prod-ThrowStatement)\[?Yield, ?Await\] [TryStatement](#prod-TryStatement)\[?Yield, ?Await, ?Return\] [DebuggerStatement](#prod-DebuggerStatement) [Declaration](#prod-Declaration)\[Yield, Await\] : [HoistableDeclaration](#prod-HoistableDeclaration)\[?Yield, ?Await, ~Default\] [ClassDeclaration](#prod-ClassDeclaration)\[?Yield, ?Await, ~Default\] [LexicalDeclaration](#prod-LexicalDeclaration)\[+In, ?Yield, ?Await\] [HoistableDeclaration](#prod-HoistableDeclaration)\[Yield, Await, Default\] : [FunctionDeclaration](#prod-FunctionDeclaration)\[?Yield, ?Await, ?Default\] [GeneratorDeclaration](#prod-GeneratorDeclaration)\[?Yield, ?Await, ?Default\] [AsyncFunctionDeclaration](#prod-AsyncFunctionDeclaration)\[?Yield, ?Await, ?Default\] [AsyncGeneratorDeclaration](#prod-AsyncGeneratorDeclaration)\[?Yield, ?Await, ?Default\] [BreakableStatement](#prod-BreakableStatement)\[Yield, Await, Return\] : [IterationStatement](#prod-IterationStatement)\[?Yield, ?Await, ?Return\] [SwitchStatement](#prod-SwitchStatement)\[?Yield, ?Await, ?Return\]

## 14.1 Statement Semantics

### 14.1.1 Runtime Semantics: Evaluation

[HoistableDeclaration](#prod-HoistableDeclaration) : [GeneratorDeclaration](#prod-GeneratorDeclaration) [AsyncFunctionDeclaration](#prod-AsyncFunctionDeclaration) [AsyncGeneratorDeclaration](#prod-AsyncGeneratorDeclaration)

1.  Return empty.

[HoistableDeclaration](#prod-HoistableDeclaration) : [FunctionDeclaration](#prod-FunctionDeclaration)

1.  Return ? [Evaluation](#sec-evaluation) of [FunctionDeclaration](#prod-FunctionDeclaration).

[BreakableStatement](#prod-BreakableStatement) : [IterationStatement](#prod-IterationStatement) [SwitchStatement](#prod-SwitchStatement)

1.  Let `newLabelSet` be a new empty [List](#sec-list-and-record-specification-type).
2.  Return ? [LabelledEvaluation](#sec-runtime-semantics-labelledevaluation) of this [BreakableStatement](#prod-BreakableStatement) with argument `newLabelSet`.

## 14.2 Block

### Syntax

[BlockStatement](#prod-BlockStatement)\[Yield, Await, Return\] : [Block](#prod-Block)\[?Yield, ?Await, ?Return\] [Block](#prod-Block)\[Yield, Await, Return\] : { [StatementList](#prod-StatementList)\[?Yield, ?Await, ?Return\]opt } [StatementList](#prod-StatementList)\[Yield, Await, Return\] : [StatementListItem](#prod-StatementListItem)\[?Yield, ?Await, ?Return\] [StatementList](#prod-StatementList)\[?Yield, ?Await, ?Return\] [StatementListItem](#prod-StatementListItem)\[?Yield, ?Await, ?Return\] [StatementListItem](#prod-StatementListItem)\[Yield, Await, Return\] : [Statement](#prod-Statement)\[?Yield, ?Await, ?Return\] [Declaration](#prod-Declaration)\[?Yield, ?Await\]

### 14.2.1 Static Semantics: Early Errors

[Block](#prod-Block) : { [StatementList](#prod-StatementList) }

- It is a Syntax Error if the [LexicallyDeclaredNames](#sec-static-semantics-lexicallydeclarednames) of [StatementList](#prod-StatementList) contains any duplicate entries.
- It is a Syntax Error if any element of the [LexicallyDeclaredNames](#sec-static-semantics-lexicallydeclarednames) of [StatementList](#prod-StatementList) also occurs in the [VarDeclaredNames](#sec-static-semantics-vardeclarednames) of [StatementList](#prod-StatementList).

### 14.2.2 Runtime Semantics: Evaluation

[Block](#prod-Block) : { }

1.  Return empty.

[Block](#prod-Block) : { [StatementList](#prod-StatementList) }

1.  Let `oldEnv` be the [running execution context](#running-execution-context)'s LexicalEnvironment.
2.  Let `blockEnv` be [NewDeclarativeEnvironment](#sec-newdeclarativeenvironment)(`oldEnv`).
3.  Perform [BlockDeclarationInstantiation](#sec-blockdeclarationinstantiation)([StatementList](#prod-StatementList), `blockEnv`).
4.  Set the [running execution context](#running-execution-context)'s LexicalEnvironment to `blockEnv`.
5.  Let `blockValue` be [Completion](#sec-completion-ao)([Evaluation](#sec-evaluation) of [StatementList](#prod-StatementList)).
6.  Set the [running execution context](#running-execution-context)'s LexicalEnvironment to `oldEnv`.
7.  Return ? `blockValue`.

Note 1

No matter how control leaves the [Block](#prod-Block) the LexicalEnvironment is always restored to its former state.

[StatementList](#prod-StatementList) : [StatementList](#prod-StatementList) [StatementListItem](#prod-StatementListItem)

1.  Let `sl` be ? [Evaluation](#sec-evaluation) of [StatementList](#prod-StatementList).
2.  Let `s` be [Completion](#sec-completion-ao)([Evaluation](#sec-evaluation) of [StatementListItem](#prod-StatementListItem)).
3.  Return ? [UpdateEmpty](#sec-updateempty)(`s`, `sl`).

Note 2

The value of a [StatementList](#prod-StatementList) is the value of the last value-producing item in the [StatementList](#prod-StatementList). For example, the following calls to the `eval` function all return the value 1:

``` javascript
eval("1;;;;;")
eval("1;{}")
eval("1;var a;")
```

### 14.2.3 BlockDeclarationInstantiation ( `code`, `env` )

The abstract operation BlockDeclarationInstantiation takes arguments `code` (a [Parse Node](#sec-syntactic-grammar)) and `env` (a [Declarative Environment Record](#sec-declarative-environment-records)) and returns unused. `code` is the [Parse Node](#sec-syntactic-grammar) corresponding to the body of the block. `env` is the [Environment Record](#sec-environment-records) in which bindings are to be created.

Note

When a [Block](#prod-Block) or [CaseBlock](#prod-CaseBlock) is evaluated a new [Declarative Environment Record](#sec-declarative-environment-records) is created and bindings for each block scoped variable, constant, function, or class declared in the block are instantiated in the [Environment Record](#sec-environment-records).

It performs the following steps when called:

1.  Let `declarations` be the [LexicallyScopedDeclarations](#sec-static-semantics-lexicallyscopeddeclarations) of `code`.
2.  Let `privateEnv` be the [running execution context](#running-execution-context)'s PrivateEnvironment.
3.  For each element `d` of `declarations`, do
    1.  For each element `dn` of the [BoundNames](#sec-static-semantics-boundnames) of `d`, do
        1.  If [IsConstantDeclaration](#sec-static-semantics-isconstantdeclaration) of `d` is true, then
            1.  Perform ! `env`.CreateImmutableBinding(`dn`, true).
        2.  Else,
            1.  Perform ! `env`.CreateMutableBinding(`dn`, false). NOTE: This step is replaced in section [B.3.2.6](#sec-web-compat-blockdeclarationinstantiation).
    2.  If `d` is either a [FunctionDeclaration](#prod-FunctionDeclaration), a [GeneratorDeclaration](#prod-GeneratorDeclaration), an [AsyncFunctionDeclaration](#prod-AsyncFunctionDeclaration), or an [AsyncGeneratorDeclaration](#prod-AsyncGeneratorDeclaration), then
        1.  Let `fn` be the sole element of the [BoundNames](#sec-static-semantics-boundnames) of `d`.
        2.  Let `fo` be [InstantiateFunctionObject](#sec-runtime-semantics-instantiatefunctionobject) of `d` with arguments `env` and `privateEnv`.
        3.  Perform ! `env`.InitializeBinding(`fn`, `fo`). NOTE: This step is replaced in section [B.3.2.6](#sec-web-compat-blockdeclarationinstantiation).
4.  Return unused.

## 14.3 Declarations and the Variable Statement

### 14.3.1 Let and Const Declarations

Note

`let` and `const` declarations define variables that are scoped to the [running execution context](#running-execution-context)'s LexicalEnvironment. The variables are created when their containing [Environment Record](#sec-environment-records) is instantiated but may not be accessed in any way until the variable's [LexicalBinding](#prod-LexicalBinding) is evaluated. A variable defined by a [LexicalBinding](#prod-LexicalBinding) with an [Initializer](#prod-Initializer) is assigned the value of its [Initializer](#prod-Initializer)'s [AssignmentExpression](#prod-AssignmentExpression) when the [LexicalBinding](#prod-LexicalBinding) is evaluated, not when the variable is created. If a [LexicalBinding](#prod-LexicalBinding) in a `let` declaration does not have an [Initializer](#prod-Initializer) the variable is assigned the value undefined when the [LexicalBinding](#prod-LexicalBinding) is evaluated.

#### Syntax

[LexicalDeclaration](#prod-LexicalDeclaration)\[In, Yield, Await\] : [LetOrConst](#prod-LetOrConst) [BindingList](#prod-BindingList)\[?In, ?Yield, ?Await\] ; [LetOrConst](#prod-LetOrConst) : let const [BindingList](#prod-BindingList)\[In, Yield, Await\] : [LexicalBinding](#prod-LexicalBinding)\[?In, ?Yield, ?Await\] [BindingList](#prod-BindingList)\[?In, ?Yield, ?Await\] , [LexicalBinding](#prod-LexicalBinding)\[?In, ?Yield, ?Await\] [LexicalBinding](#prod-LexicalBinding)\[In, Yield, Await\] : [BindingIdentifier](#prod-BindingIdentifier)\[?Yield, ?Await\] [Initializer](#prod-Initializer)\[?In, ?Yield, ?Await\]opt [BindingPattern](#prod-BindingPattern)\[?Yield, ?Await\] [Initializer](#prod-Initializer)\[?In, ?Yield, ?Await\]

#### 14.3.1.1 Static Semantics: Early Errors

[LexicalDeclaration](#prod-LexicalDeclaration) : [LetOrConst](#prod-LetOrConst) [BindingList](#prod-BindingList) ;

- It is a Syntax Error if the [BoundNames](#sec-static-semantics-boundnames) of [BindingList](#prod-BindingList) contains "let".
- It is a Syntax Error if the [BoundNames](#sec-static-semantics-boundnames) of [BindingList](#prod-BindingList) contains any duplicate entries.

[LexicalBinding](#prod-LexicalBinding) : [BindingIdentifier](#prod-BindingIdentifier) [Initializer](#prod-Initializer)opt

- It is a Syntax Error if [Initializer](#prod-Initializer) is not present and [IsConstantDeclaration](#sec-static-semantics-isconstantdeclaration) of the [LexicalDeclaration](#prod-LexicalDeclaration) containing this [LexicalBinding](#prod-LexicalBinding) is true.

#### 14.3.1.2 Runtime Semantics: Evaluation

[LexicalDeclaration](#prod-LexicalDeclaration) : [LetOrConst](#prod-LetOrConst) [BindingList](#prod-BindingList) ;

1.  Perform ? [Evaluation](#sec-evaluation) of [BindingList](#prod-BindingList).
2.  Return empty.

[BindingList](#prod-BindingList) : [BindingList](#prod-BindingList) , [LexicalBinding](#prod-LexicalBinding)

1.  Perform ? [Evaluation](#sec-evaluation) of [BindingList](#prod-BindingList).
2.  Return ? [Evaluation](#sec-evaluation) of [LexicalBinding](#prod-LexicalBinding).

[LexicalBinding](#prod-LexicalBinding) : [BindingIdentifier](#prod-BindingIdentifier)

1.  Let `lhs` be ! [ResolveBinding](#sec-resolvebinding)([StringValue](#sec-static-semantics-stringvalue) of [BindingIdentifier](#prod-BindingIdentifier)).
2.  Perform ! [InitializeReferencedBinding](#sec-initializereferencedbinding)(`lhs`, undefined).
3.  Return empty.

Note

A [static semantics](#sec-static-semantic-rules) rule ensures that this form of [LexicalBinding](#prod-LexicalBinding) never occurs in a `const` declaration.

[LexicalBinding](#prod-LexicalBinding) : [BindingIdentifier](#prod-BindingIdentifier) [Initializer](#prod-Initializer)

1.  Let `bindingId` be the [StringValue](#sec-static-semantics-stringvalue) of [BindingIdentifier](#prod-BindingIdentifier).
2.  Let `lhs` be ! [ResolveBinding](#sec-resolvebinding)(`bindingId`).
3.  If [IsAnonymousFunctionDefinition](#sec-isanonymousfunctiondefinition)([Initializer](#prod-Initializer)) is true, then
    1.  Let `value` be ? [NamedEvaluation](#sec-runtime-semantics-namedevaluation) of [Initializer](#prod-Initializer) with argument `bindingId`.
4.  Else,
    1.  Let `rhs` be ? [Evaluation](#sec-evaluation) of [Initializer](#prod-Initializer).
    2.  Let `value` be ? [GetValue](#sec-getvalue)(`rhs`).
5.  Perform ! [InitializeReferencedBinding](#sec-initializereferencedbinding)(`lhs`, `value`).
6.  Return empty.

[LexicalBinding](#prod-LexicalBinding) : [BindingPattern](#prod-BindingPattern) [Initializer](#prod-Initializer)

1.  Let `rhs` be ? [Evaluation](#sec-evaluation) of [Initializer](#prod-Initializer).
2.  Let `value` be ? [GetValue](#sec-getvalue)(`rhs`).
3.  Let `env` be the [running execution context](#running-execution-context)'s LexicalEnvironment.
4.  Return ? [BindingInitialization](#sec-runtime-semantics-bindinginitialization) of [BindingPattern](#prod-BindingPattern) with arguments `value` and `env`.

### 14.3.2 Variable Statement

Note

A `var` statement declares variables that are scoped to the [running execution context](#running-execution-context)'s VariableEnvironment. Var variables are created when their containing [Environment Record](#sec-environment-records) is instantiated and are initialized to undefined when created. Within the scope of any VariableEnvironment a common [BindingIdentifier](#prod-BindingIdentifier) may appear in more than one [VariableDeclaration](#prod-VariableDeclaration) but those declarations collectively define only one variable. A variable defined by a [VariableDeclaration](#prod-VariableDeclaration) with an [Initializer](#prod-Initializer) is assigned the value of its [Initializer](#prod-Initializer)'s [AssignmentExpression](#prod-AssignmentExpression) when the [VariableDeclaration](#prod-VariableDeclaration) is executed, not when the variable is created.

#### Syntax

[VariableStatement](#prod-VariableStatement)\[Yield, Await\] : var [VariableDeclarationList](#prod-VariableDeclarationList)\[+In, ?Yield, ?Await\] ; [VariableDeclarationList](#prod-VariableDeclarationList)\[In, Yield, Await\] : [VariableDeclaration](#prod-VariableDeclaration)\[?In, ?Yield, ?Await\] [VariableDeclarationList](#prod-VariableDeclarationList)\[?In, ?Yield, ?Await\] , [VariableDeclaration](#prod-VariableDeclaration)\[?In, ?Yield, ?Await\] [VariableDeclaration](#prod-VariableDeclaration)\[In, Yield, Await\] : [BindingIdentifier](#prod-BindingIdentifier)\[?Yield, ?Await\] [Initializer](#prod-Initializer)\[?In, ?Yield, ?Await\]opt [BindingPattern](#prod-BindingPattern)\[?Yield, ?Await\] [Initializer](#prod-Initializer)\[?In, ?Yield, ?Await\]

#### 14.3.2.1 Runtime Semantics: Evaluation

[VariableStatement](#prod-VariableStatement) : var [VariableDeclarationList](#prod-VariableDeclarationList) ;

1.  Perform ? [Evaluation](#sec-evaluation) of [VariableDeclarationList](#prod-VariableDeclarationList).
2.  Return empty.

[VariableDeclarationList](#prod-VariableDeclarationList) : [VariableDeclarationList](#prod-VariableDeclarationList) , [VariableDeclaration](#prod-VariableDeclaration)

1.  Perform ? [Evaluation](#sec-evaluation) of [VariableDeclarationList](#prod-VariableDeclarationList).
2.  Return ? [Evaluation](#sec-evaluation) of [VariableDeclaration](#prod-VariableDeclaration).

[VariableDeclaration](#prod-VariableDeclaration) : [BindingIdentifier](#prod-BindingIdentifier)

1.  Return empty.

[VariableDeclaration](#prod-VariableDeclaration) : [BindingIdentifier](#prod-BindingIdentifier) [Initializer](#prod-Initializer)

1.  Let `bindingId` be the [StringValue](#sec-static-semantics-stringvalue) of [BindingIdentifier](#prod-BindingIdentifier).
2.  Let `lhs` be ? [ResolveBinding](#sec-resolvebinding)(`bindingId`).
3.  If [IsAnonymousFunctionDefinition](#sec-isanonymousfunctiondefinition)([Initializer](#prod-Initializer)) is true, then
    1.  Let `value` be ? [NamedEvaluation](#sec-runtime-semantics-namedevaluation) of [Initializer](#prod-Initializer) with argument `bindingId`.
4.  Else,
    1.  Let `rhs` be ? [Evaluation](#sec-evaluation) of [Initializer](#prod-Initializer).
    2.  Let `value` be ? [GetValue](#sec-getvalue)(`rhs`).
5.  Perform ? [PutValue](#sec-putvalue)(`lhs`, `value`).
6.  Return empty.

Note

If a [VariableDeclaration](#prod-VariableDeclaration) is nested within a with statement and the [BindingIdentifier](#prod-BindingIdentifier) in the [VariableDeclaration](#prod-VariableDeclaration) is the same as a [property name](#property-name) of the binding object of the with statement's [Object Environment Record](#sec-object-environment-records), then step [5](#step-vardecllist-evaluation-putvalue) will assign `value` to the property instead of assigning to the VariableEnvironment binding of the [Identifier](#prod-Identifier).

[VariableDeclaration](#prod-VariableDeclaration) : [BindingPattern](#prod-BindingPattern) [Initializer](#prod-Initializer)

1.  Let `rhs` be ? [Evaluation](#sec-evaluation) of [Initializer](#prod-Initializer).
2.  Let `rVal` be ? [GetValue](#sec-getvalue)(`rhs`).
3.  Return ? [BindingInitialization](#sec-runtime-semantics-bindinginitialization) of [BindingPattern](#prod-BindingPattern) with arguments `rVal` and undefined.

### 14.3.3 Destructuring Binding Patterns

#### Syntax

[BindingPattern](#prod-BindingPattern)\[Yield, Await\] : [ObjectBindingPattern](#prod-ObjectBindingPattern)\[?Yield, ?Await\] [ArrayBindingPattern](#prod-ArrayBindingPattern)\[?Yield, ?Await\] [ObjectBindingPattern](#prod-ObjectBindingPattern)\[Yield, Await\] : { } { [BindingRestProperty](#prod-BindingRestProperty)\[?Yield, ?Await\] } { [BindingPropertyList](#prod-BindingPropertyList)\[?Yield, ?Await\] } { [BindingPropertyList](#prod-BindingPropertyList)\[?Yield, ?Await\] , [BindingRestProperty](#prod-BindingRestProperty)\[?Yield, ?Await\]opt } [ArrayBindingPattern](#prod-ArrayBindingPattern)\[Yield, Await\] : \[ [Elision](#prod-Elision)opt [BindingRestElement](#prod-BindingRestElement)\[?Yield, ?Await\]opt \] \[ [BindingElementList](#prod-BindingElementList)\[?Yield, ?Await\] \] \[ [BindingElementList](#prod-BindingElementList)\[?Yield, ?Await\] , [Elision](#prod-Elision)opt [BindingRestElement](#prod-BindingRestElement)\[?Yield, ?Await\]opt \] [BindingRestProperty](#prod-BindingRestProperty)\[Yield, Await\] : ... [BindingIdentifier](#prod-BindingIdentifier)\[?Yield, ?Await\] [BindingPropertyList](#prod-BindingPropertyList)\[Yield, Await\] : [BindingProperty](#prod-BindingProperty)\[?Yield, ?Await\] [BindingPropertyList](#prod-BindingPropertyList)\[?Yield, ?Await\] , [BindingProperty](#prod-BindingProperty)\[?Yield, ?Await\] [BindingElementList](#prod-BindingElementList)\[Yield, Await\] : [BindingElisionElement](#prod-BindingElisionElement)\[?Yield, ?Await\] [BindingElementList](#prod-BindingElementList)\[?Yield, ?Await\] , [BindingElisionElement](#prod-BindingElisionElement)\[?Yield, ?Await\] [BindingElisionElement](#prod-BindingElisionElement)\[Yield, Await\] : [Elision](#prod-Elision)opt [BindingElement](#prod-BindingElement)\[?Yield, ?Await\] [BindingProperty](#prod-BindingProperty)\[Yield, Await\] : [SingleNameBinding](#prod-SingleNameBinding)\[?Yield, ?Await\] [PropertyName](#prod-PropertyName)\[?Yield, ?Await\] : [BindingElement](#prod-BindingElement)\[?Yield, ?Await\] [BindingElement](#prod-BindingElement)\[Yield, Await\] : [SingleNameBinding](#prod-SingleNameBinding)\[?Yield, ?Await\] [BindingPattern](#prod-BindingPattern)\[?Yield, ?Await\] [Initializer](#prod-Initializer)\[+In, ?Yield, ?Await\]opt [SingleNameBinding](#prod-SingleNameBinding)\[Yield, Await\] : [BindingIdentifier](#prod-BindingIdentifier)\[?Yield, ?Await\] [Initializer](#prod-Initializer)\[+In, ?Yield, ?Await\]opt [BindingRestElement](#prod-BindingRestElement)\[Yield, Await\] : ... [BindingIdentifier](#prod-BindingIdentifier)\[?Yield, ?Await\] ... [BindingPattern](#prod-BindingPattern)\[?Yield, ?Await\]

#### 14.3.3.1 Runtime Semantics: PropertyBindingInitialization

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) PropertyBindingInitialization takes arguments `value` (an [ECMAScript language value](#sec-ecmascript-language-types)) and `environment` (an [Environment Record](#sec-environment-records) or undefined) and returns either a [normal completion containing](#sec-completion-record-specification-type) a [List](#sec-list-and-record-specification-type) of [property keys](#property-key) or an [abrupt completion](#sec-completion-record-specification-type). It collects a list of all bound property names. It is defined piecewise over the following productions:

[BindingPropertyList](#prod-BindingPropertyList) : [BindingPropertyList](#prod-BindingPropertyList) , [BindingProperty](#prod-BindingProperty)

1.  Let `boundNames` be ? [PropertyBindingInitialization](#sec-destructuring-binding-patterns-runtime-semantics-propertybindinginitialization) of [BindingPropertyList](#prod-BindingPropertyList) with arguments `value` and `environment`.
2.  Let `nextNames` be ? [PropertyBindingInitialization](#sec-destructuring-binding-patterns-runtime-semantics-propertybindinginitialization) of [BindingProperty](#prod-BindingProperty) with arguments `value` and `environment`.
3.  Return the [list-concatenation](#list-concatenation) of `boundNames` and `nextNames`.

[BindingProperty](#prod-BindingProperty) : [SingleNameBinding](#prod-SingleNameBinding)

1.  Let `name` be the sole element of the [BoundNames](#sec-static-semantics-boundnames) of [SingleNameBinding](#prod-SingleNameBinding).
2.  Perform ? [KeyedBindingInitialization](#sec-runtime-semantics-keyedbindinginitialization) of [SingleNameBinding](#prod-SingleNameBinding) with arguments `value`, `environment`, and `name`.
3.  Return « `name` ».

[BindingProperty](#prod-BindingProperty) : [PropertyName](#prod-PropertyName) : [BindingElement](#prod-BindingElement)

1.  Let `P` be ? [Evaluation](#sec-evaluation) of [PropertyName](#prod-PropertyName).
2.  Perform ? [KeyedBindingInitialization](#sec-runtime-semantics-keyedbindinginitialization) of [BindingElement](#prod-BindingElement) with arguments `value`, `environment`, and `P`.
3.  Return « `P` ».

#### 14.3.3.2 Runtime Semantics: RestBindingInitialization

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) RestBindingInitialization takes arguments `value` (an [ECMAScript language value](#sec-ecmascript-language-types)), `environment` (an [Environment Record](#sec-environment-records) or undefined), and `excludedNames` (a [List](#sec-list-and-record-specification-type) of [property keys](#property-key)) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or an [abrupt completion](#sec-completion-record-specification-type). It is defined piecewise over the following productions:

[BindingRestProperty](#prod-BindingRestProperty) : ... [BindingIdentifier](#prod-BindingIdentifier)

1.  Let `lhs` be ? [ResolveBinding](#sec-resolvebinding)([StringValue](#sec-static-semantics-stringvalue) of [BindingIdentifier](#prod-BindingIdentifier), `environment`).
2.  Let `restObj` be [OrdinaryObjectCreate](#sec-ordinaryobjectcreate)([%Object.prototype%](#sec-properties-of-the-object-prototype-object)).
3.  Perform ? [CopyDataProperties](#sec-copydataproperties)(`restObj`, `value`, `excludedNames`).
4.  If `environment` is undefined, return ? [PutValue](#sec-putvalue)(`lhs`, `restObj`).
5.  Return ? [InitializeReferencedBinding](#sec-initializereferencedbinding)(`lhs`, `restObj`).

#### 14.3.3.3 Runtime Semantics: KeyedBindingInitialization

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) KeyedBindingInitialization takes arguments `value` (an [ECMAScript language value](#sec-ecmascript-language-types)), `environment` (an [Environment Record](#sec-environment-records) or undefined), and `propertyName` (a [property key](#property-key)) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or an [abrupt completion](#sec-completion-record-specification-type).

Note

When undefined is passed for `environment` it indicates that a [PutValue](#sec-putvalue) operation should be used to assign the initialization value. This is the case for formal parameter lists of [non-strict functions](#non-strict-function). In that case the formal parameter bindings are preinitialized in order to deal with the possibility of multiple parameters with the same name.

It is defined piecewise over the following productions:

[BindingElement](#prod-BindingElement) : [BindingPattern](#prod-BindingPattern) [Initializer](#prod-Initializer)opt

1.  Let `v` be ? [GetV](#sec-getv)(`value`, `propertyName`).
2.  If [Initializer](#prod-Initializer) is present and `v` is undefined, then
    1.  Let `defaultValue` be ? [Evaluation](#sec-evaluation) of [Initializer](#prod-Initializer).
    2.  Set `v` to ? [GetValue](#sec-getvalue)(`defaultValue`).
3.  Return ? [BindingInitialization](#sec-runtime-semantics-bindinginitialization) of [BindingPattern](#prod-BindingPattern) with arguments `v` and `environment`.

[SingleNameBinding](#prod-SingleNameBinding) : [BindingIdentifier](#prod-BindingIdentifier) [Initializer](#prod-Initializer)opt

1.  Let `bindingId` be the [StringValue](#sec-static-semantics-stringvalue) of [BindingIdentifier](#prod-BindingIdentifier).
2.  Let `lhs` be ? [ResolveBinding](#sec-resolvebinding)(`bindingId`, `environment`).
3.  Let `v` be ? [GetV](#sec-getv)(`value`, `propertyName`).
4.  If [Initializer](#prod-Initializer) is present and `v` is undefined, then
    1.  If [IsAnonymousFunctionDefinition](#sec-isanonymousfunctiondefinition)([Initializer](#prod-Initializer)) is true, then
        1.  Set `v` to ? [NamedEvaluation](#sec-runtime-semantics-namedevaluation) of [Initializer](#prod-Initializer) with argument `bindingId`.
    2.  Else,
        1.  Let `defaultValue` be ? [Evaluation](#sec-evaluation) of [Initializer](#prod-Initializer).
        2.  Set `v` to ? [GetValue](#sec-getvalue)(`defaultValue`).
5.  If `environment` is undefined, return ? [PutValue](#sec-putvalue)(`lhs`, `v`).
6.  Return ? [InitializeReferencedBinding](#sec-initializereferencedbinding)(`lhs`, `v`).

## 14.4 Empty Statement

### Syntax

[EmptyStatement](#prod-EmptyStatement) : ;

### 14.4.1 Runtime Semantics: Evaluation

[EmptyStatement](#prod-EmptyStatement) : ;

1.  Return empty.

## 14.5 Expression Statement

### Syntax

[ExpressionStatement](#prod-ExpressionStatement)\[Yield, Await\] : \[lookahead ∉ { {, function, async \[no [LineTerminator](#prod-LineTerminator) here\] function, class, let \[ }\] [Expression](#prod-Expression)\[+In, ?Yield, ?Await\] ; Note

An [ExpressionStatement](#prod-ExpressionStatement) cannot start with a U+007B (LEFT CURLY BRACKET) because that might make it ambiguous with a [Block](#prod-Block). An [ExpressionStatement](#prod-ExpressionStatement) cannot start with the `function` or `class` [keywords](#sec-keywords-and-reserved-words) because that would make it ambiguous with a [FunctionDeclaration](#prod-FunctionDeclaration), a [GeneratorDeclaration](#prod-GeneratorDeclaration), or a [ClassDeclaration](#prod-ClassDeclaration). An [ExpressionStatement](#prod-ExpressionStatement) cannot start with `async function` because that would make it ambiguous with an [AsyncFunctionDeclaration](#prod-AsyncFunctionDeclaration) or a [AsyncGeneratorDeclaration](#prod-AsyncGeneratorDeclaration). An [ExpressionStatement](#prod-ExpressionStatement) cannot start with the two token sequence `let [` because that would make it ambiguous with a `let` [LexicalDeclaration](#prod-LexicalDeclaration) whose first [LexicalBinding](#prod-LexicalBinding) was an [ArrayBindingPattern](#prod-ArrayBindingPattern).

### 14.5.1 Runtime Semantics: Evaluation

[ExpressionStatement](#prod-ExpressionStatement) : [Expression](#prod-Expression) ;

1.  Let `exprRef` be ? [Evaluation](#sec-evaluation) of [Expression](#prod-Expression).
2.  Return ? [GetValue](#sec-getvalue)(`exprRef`).

## 14.6 The `if` Statement

### Syntax

[IfStatement](#prod-IfStatement)\[Yield, Await, Return\] : if ( [Expression](#prod-Expression)\[+In, ?Yield, ?Await\] ) [Statement](#prod-Statement)\[?Yield, ?Await, ?Return\] else [Statement](#prod-Statement)\[?Yield, ?Await, ?Return\] if ( [Expression](#prod-Expression)\[+In, ?Yield, ?Await\] ) [Statement](#prod-Statement)\[?Yield, ?Await, ?Return\] \[lookahead ≠ else\] Note

The lookahead-restriction \[lookahead ≠ `else`\] resolves the classic "dangling else" problem in the usual way. That is, when the choice of associated `if` is otherwise ambiguous, the `else` is associated with the nearest (innermost) of the candidate `if`s

### 14.6.1 Static Semantics: Early Errors

[IfStatement](#prod-IfStatement) : if ( [Expression](#prod-Expression) ) [Statement](#prod-Statement) else [Statement](#prod-Statement)

- It is a Syntax Error if [IsLabelledFunction](#sec-islabelledfunction)(the first [Statement](#prod-Statement)) is true.
- It is a Syntax Error if [IsLabelledFunction](#sec-islabelledfunction)(the second [Statement](#prod-Statement)) is true.

[IfStatement](#prod-IfStatement) : if ( [Expression](#prod-Expression) ) [Statement](#prod-Statement)

- It is a Syntax Error if [IsLabelledFunction](#sec-islabelledfunction)([Statement](#prod-Statement)) is true.

Note

It is only necessary to apply this rule if the extension specified in [B.3.1](#sec-labelled-function-declarations) is implemented.

### 14.6.2 Runtime Semantics: Evaluation

[IfStatement](#prod-IfStatement) : if ( [Expression](#prod-Expression) ) [Statement](#prod-Statement) else [Statement](#prod-Statement)

1.  Let `exprRef` be ? [Evaluation](#sec-evaluation) of [Expression](#prod-Expression).
2.  Let `exprValue` be [ToBoolean](#sec-toboolean)(? [GetValue](#sec-getvalue)(`exprRef`)).
3.  If `exprValue` is true, then
    1.  Let `stmtCompletion` be [Completion](#sec-completion-ao)([Evaluation](#sec-evaluation) of the first [Statement](#prod-Statement)).
4.  Else,
    1.  Let `stmtCompletion` be [Completion](#sec-completion-ao)([Evaluation](#sec-evaluation) of the second [Statement](#prod-Statement)).
5.  Return ? [UpdateEmpty](#sec-updateempty)(`stmtCompletion`, undefined).

[IfStatement](#prod-IfStatement) : if ( [Expression](#prod-Expression) ) [Statement](#prod-Statement)

1.  Let `exprRef` be ? [Evaluation](#sec-evaluation) of [Expression](#prod-Expression).
2.  Let `exprValue` be [ToBoolean](#sec-toboolean)(? [GetValue](#sec-getvalue)(`exprRef`)).
3.  If `exprValue` is false, then
    1.  Return undefined.
4.  Else,
    1.  Let `stmtCompletion` be [Completion](#sec-completion-ao)([Evaluation](#sec-evaluation) of [Statement](#prod-Statement)).
    2.  Return ? [UpdateEmpty](#sec-updateempty)(`stmtCompletion`, undefined).

## 14.7 Iteration Statements

### Syntax

[IterationStatement](#prod-IterationStatement)\[Yield, Await, Return\] : [DoWhileStatement](#prod-DoWhileStatement)\[?Yield, ?Await, ?Return\] [WhileStatement](#prod-WhileStatement)\[?Yield, ?Await, ?Return\] [ForStatement](#prod-ForStatement)\[?Yield, ?Await, ?Return\] [ForInOfStatement](#prod-ForInOfStatement)\[?Yield, ?Await, ?Return\]

### 14.7.1 Semantics

#### 14.7.1.1 LoopContinues ( `completion`, `labelSet` )

The abstract operation LoopContinues takes arguments `completion` (a [Completion Record](#sec-completion-record-specification-type)) and `labelSet` (a [List](#sec-list-and-record-specification-type) of Strings) and returns a Boolean. It performs the following steps when called:

1.  If `completion` is a [normal completion](#sec-completion-record-specification-type), return true.
2.  If `completion` is not a [continue completion](#sec-completion-record-specification-type), return false.
3.  If `completion`.`[[Target]]` is empty, return true.
4.  If `labelSet` contains `completion`.`[[Target]]`, return true.
5.  Return false.

Note

Within the [Statement](#prod-Statement) part of an [IterationStatement](#prod-IterationStatement) a [ContinueStatement](#prod-ContinueStatement) may be used to begin a new iteration.

#### 14.7.1.2 Runtime Semantics: LoopEvaluation

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) LoopEvaluation takes argument `labelSet` (a [List](#sec-list-and-record-specification-type) of Strings) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [ECMAScript language value](#sec-ecmascript-language-types) or an [abrupt completion](#sec-completion-record-specification-type). It is defined piecewise over the following productions:

[IterationStatement](#prod-IterationStatement) : [DoWhileStatement](#prod-DoWhileStatement)

1.  Return ? [DoWhileLoopEvaluation](#sec-runtime-semantics-dowhileloopevaluation) of [DoWhileStatement](#prod-DoWhileStatement) with argument `labelSet`.

[IterationStatement](#prod-IterationStatement) : [WhileStatement](#prod-WhileStatement)

1.  Return ? [WhileLoopEvaluation](#sec-runtime-semantics-whileloopevaluation) of [WhileStatement](#prod-WhileStatement) with argument `labelSet`.

[IterationStatement](#prod-IterationStatement) : [ForStatement](#prod-ForStatement)

1.  Return ? [ForLoopEvaluation](#sec-runtime-semantics-forloopevaluation) of [ForStatement](#prod-ForStatement) with argument `labelSet`.

[IterationStatement](#prod-IterationStatement) : [ForInOfStatement](#prod-ForInOfStatement)

1.  Return ? [ForInOfLoopEvaluation](#sec-runtime-semantics-forinofloopevaluation) of [ForInOfStatement](#prod-ForInOfStatement) with argument `labelSet`.

### 14.7.2 The `do`-`while` Statement

#### Syntax

[DoWhileStatement](#prod-DoWhileStatement)\[Yield, Await, Return\] : do [Statement](#prod-Statement)\[?Yield, ?Await, ?Return\] while ( [Expression](#prod-Expression)\[+In, ?Yield, ?Await\] ) ;

#### 14.7.2.1 Static Semantics: Early Errors

[DoWhileStatement](#prod-DoWhileStatement) : do [Statement](#prod-Statement) while ( [Expression](#prod-Expression) ) ;

- It is a Syntax Error if [IsLabelledFunction](#sec-islabelledfunction)([Statement](#prod-Statement)) is true.

Note

It is only necessary to apply this rule if the extension specified in [B.3.1](#sec-labelled-function-declarations) is implemented.

#### 14.7.2.2 Runtime Semantics: DoWhileLoopEvaluation

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) DoWhileLoopEvaluation takes argument `labelSet` (a [List](#sec-list-and-record-specification-type) of Strings) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [ECMAScript language value](#sec-ecmascript-language-types) or an [abrupt completion](#sec-completion-record-specification-type). It is defined piecewise over the following productions:

[DoWhileStatement](#prod-DoWhileStatement) : do [Statement](#prod-Statement) while ( [Expression](#prod-Expression) ) ;

1.  Let `V` be undefined.
2.  Repeat,
    1.  Let `stmtResult` be [Completion](#sec-completion-ao)([Evaluation](#sec-evaluation) of [Statement](#prod-Statement)).
    2.  If [LoopContinues](#sec-loopcontinues)(`stmtResult`, `labelSet`) is false, return ? [UpdateEmpty](#sec-updateempty)(`stmtResult`, `V`).
    3.  If `stmtResult`.`[[Value]]` is not empty, set `V` to `stmtResult`.`[[Value]]`.
    4.  Let `exprRef` be ? [Evaluation](#sec-evaluation) of [Expression](#prod-Expression).
    5.  Let `exprValue` be ? [GetValue](#sec-getvalue)(`exprRef`).
    6.  If [ToBoolean](#sec-toboolean)(`exprValue`) is false, return `V`.

### 14.7.3 The `while` Statement

#### Syntax

[WhileStatement](#prod-WhileStatement)\[Yield, Await, Return\] : while ( [Expression](#prod-Expression)\[+In, ?Yield, ?Await\] ) [Statement](#prod-Statement)\[?Yield, ?Await, ?Return\]

#### 14.7.3.1 Static Semantics: Early Errors

[WhileStatement](#prod-WhileStatement) : while ( [Expression](#prod-Expression) ) [Statement](#prod-Statement)

- It is a Syntax Error if [IsLabelledFunction](#sec-islabelledfunction)([Statement](#prod-Statement)) is true.

Note

It is only necessary to apply this rule if the extension specified in [B.3.1](#sec-labelled-function-declarations) is implemented.

#### 14.7.3.2 Runtime Semantics: WhileLoopEvaluation

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) WhileLoopEvaluation takes argument `labelSet` (a [List](#sec-list-and-record-specification-type) of Strings) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [ECMAScript language value](#sec-ecmascript-language-types) or an [abrupt completion](#sec-completion-record-specification-type). It is defined piecewise over the following productions:

[WhileStatement](#prod-WhileStatement) : while ( [Expression](#prod-Expression) ) [Statement](#prod-Statement)

1.  Let `V` be undefined.
2.  Repeat,
    1.  Let `exprRef` be ? [Evaluation](#sec-evaluation) of [Expression](#prod-Expression).
    2.  Let `exprValue` be ? [GetValue](#sec-getvalue)(`exprRef`).
    3.  If [ToBoolean](#sec-toboolean)(`exprValue`) is false, return `V`.
    4.  Let `stmtResult` be [Completion](#sec-completion-ao)([Evaluation](#sec-evaluation) of [Statement](#prod-Statement)).
    5.  If [LoopContinues](#sec-loopcontinues)(`stmtResult`, `labelSet`) is false, return ? [UpdateEmpty](#sec-updateempty)(`stmtResult`, `V`).
    6.  If `stmtResult`.`[[Value]]` is not empty, set `V` to `stmtResult`.`[[Value]]`.

### 14.7.4 The `for` Statement

#### Syntax

[ForStatement](#prod-ForStatement)\[Yield, Await, Return\] : for ( \[lookahead ≠ let \[\] [Expression](#prod-Expression)\[~In, ?Yield, ?Await\]opt ; [Expression](#prod-Expression)\[+In, ?Yield, ?Await\]opt ; [Expression](#prod-Expression)\[+In, ?Yield, ?Await\]opt ) [Statement](#prod-Statement)\[?Yield, ?Await, ?Return\] for ( var [VariableDeclarationList](#prod-VariableDeclarationList)\[~In, ?Yield, ?Await\] ; [Expression](#prod-Expression)\[+In, ?Yield, ?Await\]opt ; [Expression](#prod-Expression)\[+In, ?Yield, ?Await\]opt ) [Statement](#prod-Statement)\[?Yield, ?Await, ?Return\] for ( [LexicalDeclaration](#prod-LexicalDeclaration)\[~In, ?Yield, ?Await\] [Expression](#prod-Expression)\[+In, ?Yield, ?Await\]opt ; [Expression](#prod-Expression)\[+In, ?Yield, ?Await\]opt ) [Statement](#prod-Statement)\[?Yield, ?Await, ?Return\]

#### 14.7.4.1 Static Semantics: Early Errors

[ForStatement](#prod-ForStatement) : for ( [Expression](#prod-Expression)opt ; [Expression](#prod-Expression)opt ; [Expression](#prod-Expression)opt ) [Statement](#prod-Statement) for ( var [VariableDeclarationList](#prod-VariableDeclarationList) ; [Expression](#prod-Expression)opt ; [Expression](#prod-Expression)opt ) [Statement](#prod-Statement) for ( [LexicalDeclaration](#prod-LexicalDeclaration) [Expression](#prod-Expression)opt ; [Expression](#prod-Expression)opt ) [Statement](#prod-Statement)

- It is a Syntax Error if [IsLabelledFunction](#sec-islabelledfunction)([Statement](#prod-Statement)) is true.

Note

It is only necessary to apply this rule if the extension specified in [B.3.1](#sec-labelled-function-declarations) is implemented.

[ForStatement](#prod-ForStatement) : for ( [LexicalDeclaration](#prod-LexicalDeclaration) [Expression](#prod-Expression)opt ; [Expression](#prod-Expression)opt ) [Statement](#prod-Statement)

- It is a Syntax Error if any element of the [BoundNames](#sec-static-semantics-boundnames) of [LexicalDeclaration](#prod-LexicalDeclaration) also occurs in the [VarDeclaredNames](#sec-static-semantics-vardeclarednames) of [Statement](#prod-Statement).

#### 14.7.4.2 Runtime Semantics: ForLoopEvaluation

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) ForLoopEvaluation takes argument `labelSet` (a [List](#sec-list-and-record-specification-type) of Strings) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [ECMAScript language value](#sec-ecmascript-language-types) or an [abrupt completion](#sec-completion-record-specification-type). It is defined piecewise over the following productions:

[ForStatement](#prod-ForStatement) : for ( [Expression](#prod-Expression)opt ; [Expression](#prod-Expression)opt ; [Expression](#prod-Expression)opt ) [Statement](#prod-Statement)

1.  If the first [Expression](#prod-Expression) is present, then
    1.  Let `exprRef` be ? [Evaluation](#sec-evaluation) of the first [Expression](#prod-Expression).
    2.  Perform ? [GetValue](#sec-getvalue)(`exprRef`).
2.  If the second [Expression](#prod-Expression) is present, let `test` be the second [Expression](#prod-Expression); otherwise, let `test` be empty.
3.  If the third [Expression](#prod-Expression) is present, let `increment` be the third [Expression](#prod-Expression); otherwise, let `increment` be empty.
4.  Return ? [ForBodyEvaluation](#sec-forbodyevaluation)(`test`, `increment`, [Statement](#prod-Statement), « », `labelSet`).

[ForStatement](#prod-ForStatement) : for ( var [VariableDeclarationList](#prod-VariableDeclarationList) ; [Expression](#prod-Expression)opt ; [Expression](#prod-Expression)opt ) [Statement](#prod-Statement)

1.  Perform ? [Evaluation](#sec-evaluation) of [VariableDeclarationList](#prod-VariableDeclarationList).
2.  If the first [Expression](#prod-Expression) is present, let `test` be the first [Expression](#prod-Expression); otherwise, let `test` be empty.
3.  If the second [Expression](#prod-Expression) is present, let `increment` be the second [Expression](#prod-Expression); otherwise, let `increment` be empty.
4.  Return ? [ForBodyEvaluation](#sec-forbodyevaluation)(`test`, `increment`, [Statement](#prod-Statement), « », `labelSet`).

[ForStatement](#prod-ForStatement) : for ( [LexicalDeclaration](#prod-LexicalDeclaration) [Expression](#prod-Expression)opt ; [Expression](#prod-Expression)opt ) [Statement](#prod-Statement)

1.  Let `oldEnv` be the [running execution context](#running-execution-context)'s LexicalEnvironment.
2.  Let `loopEnv` be [NewDeclarativeEnvironment](#sec-newdeclarativeenvironment)(`oldEnv`).
3.  Let `isConst` be [IsConstantDeclaration](#sec-static-semantics-isconstantdeclaration) of [LexicalDeclaration](#prod-LexicalDeclaration).
4.  Let `boundNames` be the [BoundNames](#sec-static-semantics-boundnames) of [LexicalDeclaration](#prod-LexicalDeclaration).
5.  For each element `dn` of `boundNames`, do
    1.  If `isConst` is true, then
        1.  Perform ! `loopEnv`.CreateImmutableBinding(`dn`, true).
    2.  Else,
        1.  Perform ! `loopEnv`.CreateMutableBinding(`dn`, false).
6.  Set the [running execution context](#running-execution-context)'s LexicalEnvironment to `loopEnv`.
7.  Let `forDcl` be [Completion](#sec-completion-ao)([Evaluation](#sec-evaluation) of [LexicalDeclaration](#prod-LexicalDeclaration)).
8.  If `forDcl` is an [abrupt completion](#sec-completion-record-specification-type), then
    1.  Set the [running execution context](#running-execution-context)'s LexicalEnvironment to `oldEnv`.
    2.  Return ? `forDcl`.
9.  If `isConst` is false, let `perIterationLets` be `boundNames`; otherwise let `perIterationLets` be a new empty [List](#sec-list-and-record-specification-type).
10. If the first [Expression](#prod-Expression) is present, let `test` be the first [Expression](#prod-Expression); otherwise, let `test` be empty.
11. If the second [Expression](#prod-Expression) is present, let `increment` be the second [Expression](#prod-Expression); otherwise, let `increment` be empty.
12. Let `bodyResult` be [Completion](#sec-completion-ao)([ForBodyEvaluation](#sec-forbodyevaluation)(`test`, `increment`, [Statement](#prod-Statement), `perIterationLets`, `labelSet`)).
13. Set the [running execution context](#running-execution-context)'s LexicalEnvironment to `oldEnv`.
14. Return ? `bodyResult`.

#### 14.7.4.3 ForBodyEvaluation ( `test`, `increment`, `stmt`, `perIterationBindings`, `labelSet` )

The abstract operation ForBodyEvaluation takes arguments `test` (an [Expression](#prod-Expression) [Parse Node](#sec-syntactic-grammar) or empty), `increment` (an [Expression](#prod-Expression) [Parse Node](#sec-syntactic-grammar) or empty), `stmt` (a [Statement](#prod-Statement) [Parse Node](#sec-syntactic-grammar)), `perIterationBindings` (a [List](#sec-list-and-record-specification-type) of Strings), and `labelSet` (a [List](#sec-list-and-record-specification-type) of Strings) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [ECMAScript language value](#sec-ecmascript-language-types) or an [abrupt completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `V` be undefined.
2.  Perform ? [CreatePerIterationEnvironment](#sec-createperiterationenvironment)(`perIterationBindings`).
3.  Repeat,
    1.  If `test` is not empty, then
        1.  Let `testRef` be ? [Evaluation](#sec-evaluation) of `test`.
        2.  Let `testValue` be ? [GetValue](#sec-getvalue)(`testRef`).
        3.  If [ToBoolean](#sec-toboolean)(`testValue`) is false, return `V`.
    2.  Let `result` be [Completion](#sec-completion-ao)([Evaluation](#sec-evaluation) of `stmt`).
    3.  If [LoopContinues](#sec-loopcontinues)(`result`, `labelSet`) is false, return ? [UpdateEmpty](#sec-updateempty)(`result`, `V`).
    4.  If `result`.`[[Value]]` is not empty, set `V` to `result`.`[[Value]]`.
    5.  Perform ? [CreatePerIterationEnvironment](#sec-createperiterationenvironment)(`perIterationBindings`).
    6.  If `increment` is not empty, then
        1.  Let `incRef` be ? [Evaluation](#sec-evaluation) of `increment`.
        2.  Perform ? [GetValue](#sec-getvalue)(`incRef`).

#### 14.7.4.4 CreatePerIterationEnvironment ( `perIterationBindings` )

The abstract operation CreatePerIterationEnvironment takes argument `perIterationBindings` (a [List](#sec-list-and-record-specification-type) of Strings) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  If `perIterationBindings` has any elements, then
    1.  Let `lastIterationEnv` be the [running execution context](#running-execution-context)'s LexicalEnvironment.
    2.  Let `outer` be `lastIterationEnv`.`[[OuterEnv]]`.
    3.  [Assert](#assert): `outer` is not null.
    4.  Let `thisIterationEnv` be [NewDeclarativeEnvironment](#sec-newdeclarativeenvironment)(`outer`).
    5.  For each element `bn` of `perIterationBindings`, do
        1.  Perform ! `thisIterationEnv`.CreateMutableBinding(`bn`, false).
        2.  Let `lastValue` be ? `lastIterationEnv`.GetBindingValue(`bn`, true).
        3.  Perform ! `thisIterationEnv`.InitializeBinding(`bn`, `lastValue`).
    6.  Set the [running execution context](#running-execution-context)'s LexicalEnvironment to `thisIterationEnv`.
2.  Return unused.

### 14.7.5 The `for`-`in`, `for`-`of`, and `for`-`await`-`of` Statements

#### Syntax

[ForInOfStatement](#prod-ForInOfStatement)\[Yield, Await, Return\] : for ( \[lookahead ≠ let \[\] [LeftHandSideExpression](#prod-LeftHandSideExpression)\[?Yield, ?Await\] in [Expression](#prod-Expression)\[+In, ?Yield, ?Await\] ) [Statement](#prod-Statement)\[?Yield, ?Await, ?Return\] for ( var [ForBinding](#prod-ForBinding)\[?Yield, ?Await\] in [Expression](#prod-Expression)\[+In, ?Yield, ?Await\] ) [Statement](#prod-Statement)\[?Yield, ?Await, ?Return\] for ( [ForDeclaration](#prod-ForDeclaration)\[?Yield, ?Await\] in [Expression](#prod-Expression)\[+In, ?Yield, ?Await\] ) [Statement](#prod-Statement)\[?Yield, ?Await, ?Return\] for ( \[lookahead ∉ { let, async of }\] [LeftHandSideExpression](#prod-LeftHandSideExpression)\[?Yield, ?Await\] of [AssignmentExpression](#prod-AssignmentExpression)\[+In, ?Yield, ?Await\] ) [Statement](#prod-Statement)\[?Yield, ?Await, ?Return\] for ( var [ForBinding](#prod-ForBinding)\[?Yield, ?Await\] of [AssignmentExpression](#prod-AssignmentExpression)\[+In, ?Yield, ?Await\] ) [Statement](#prod-Statement)\[?Yield, ?Await, ?Return\] for ( [ForDeclaration](#prod-ForDeclaration)\[?Yield, ?Await\] of [AssignmentExpression](#prod-AssignmentExpression)\[+In, ?Yield, ?Await\] ) [Statement](#prod-Statement)\[?Yield, ?Await, ?Return\] \[+Await\] for await ( \[lookahead ≠ let\] [LeftHandSideExpression](#prod-LeftHandSideExpression)\[?Yield, ?Await\] of [AssignmentExpression](#prod-AssignmentExpression)\[+In, ?Yield, ?Await\] ) [Statement](#prod-Statement)\[?Yield, ?Await, ?Return\] \[+Await\] for await ( var [ForBinding](#prod-ForBinding)\[?Yield, ?Await\] of [AssignmentExpression](#prod-AssignmentExpression)\[+In, ?Yield, ?Await\] ) [Statement](#prod-Statement)\[?Yield, ?Await, ?Return\] \[+Await\] for await ( [ForDeclaration](#prod-ForDeclaration)\[?Yield, ?Await\] of [AssignmentExpression](#prod-AssignmentExpression)\[+In, ?Yield, ?Await\] ) [Statement](#prod-Statement)\[?Yield, ?Await, ?Return\] [ForDeclaration](#prod-ForDeclaration)\[Yield, Await\] : [LetOrConst](#prod-LetOrConst) [ForBinding](#prod-ForBinding)\[?Yield, ?Await\] [ForBinding](#prod-ForBinding)\[Yield, Await\] : [BindingIdentifier](#prod-BindingIdentifier)\[?Yield, ?Await\] [BindingPattern](#prod-BindingPattern)\[?Yield, ?Await\] Note

This section is extended by Annex [B.3.5](#sec-initializers-in-forin-statement-heads).

#### 14.7.5.1 Static Semantics: Early Errors

[ForInOfStatement](#prod-ForInOfStatement) : for ( [LeftHandSideExpression](#prod-LeftHandSideExpression) in [Expression](#prod-Expression) ) [Statement](#prod-Statement) for ( var [ForBinding](#prod-ForBinding) in [Expression](#prod-Expression) ) [Statement](#prod-Statement) for ( [ForDeclaration](#prod-ForDeclaration) in [Expression](#prod-Expression) ) [Statement](#prod-Statement) for ( [LeftHandSideExpression](#prod-LeftHandSideExpression) of [AssignmentExpression](#prod-AssignmentExpression) ) [Statement](#prod-Statement) for ( var [ForBinding](#prod-ForBinding) of [AssignmentExpression](#prod-AssignmentExpression) ) [Statement](#prod-Statement) for ( [ForDeclaration](#prod-ForDeclaration) of [AssignmentExpression](#prod-AssignmentExpression) ) [Statement](#prod-Statement) for await ( [LeftHandSideExpression](#prod-LeftHandSideExpression) of [AssignmentExpression](#prod-AssignmentExpression) ) [Statement](#prod-Statement) for await ( var [ForBinding](#prod-ForBinding) of [AssignmentExpression](#prod-AssignmentExpression) ) [Statement](#prod-Statement) for await ( [ForDeclaration](#prod-ForDeclaration) of [AssignmentExpression](#prod-AssignmentExpression) ) [Statement](#prod-Statement)

- It is a Syntax Error if [IsLabelledFunction](#sec-islabelledfunction)([Statement](#prod-Statement)) is true.

Note

It is only necessary to apply this rule if the extension specified in [B.3.1](#sec-labelled-function-declarations) is implemented.

[ForInOfStatement](#prod-ForInOfStatement) : for ( [LeftHandSideExpression](#prod-LeftHandSideExpression) in [Expression](#prod-Expression) ) [Statement](#prod-Statement) for ( [LeftHandSideExpression](#prod-LeftHandSideExpression) of [AssignmentExpression](#prod-AssignmentExpression) ) [Statement](#prod-Statement) for await ( [LeftHandSideExpression](#prod-LeftHandSideExpression) of [AssignmentExpression](#prod-AssignmentExpression) ) [Statement](#prod-Statement)

- If [LeftHandSideExpression](#prod-LeftHandSideExpression) is either an [ObjectLiteral](#prod-ObjectLiteral) or an [ArrayLiteral](#prod-ArrayLiteral), [LeftHandSideExpression](#prod-LeftHandSideExpression) [must cover](#must-cover) an [AssignmentPattern](#prod-AssignmentPattern).
- If [LeftHandSideExpression](#prod-LeftHandSideExpression) is neither an [ObjectLiteral](#prod-ObjectLiteral) nor an [ArrayLiteral](#prod-ArrayLiteral), it is a Syntax Error if the [AssignmentTargetType](#sec-static-semantics-assignmenttargettype) of [LeftHandSideExpression](#prod-LeftHandSideExpression) is not simple.

[ForInOfStatement](#prod-ForInOfStatement) : for ( [ForDeclaration](#prod-ForDeclaration) in [Expression](#prod-Expression) ) [Statement](#prod-Statement) for ( [ForDeclaration](#prod-ForDeclaration) of [AssignmentExpression](#prod-AssignmentExpression) ) [Statement](#prod-Statement) for await ( [ForDeclaration](#prod-ForDeclaration) of [AssignmentExpression](#prod-AssignmentExpression) ) [Statement](#prod-Statement)

- It is a Syntax Error if the [BoundNames](#sec-static-semantics-boundnames) of [ForDeclaration](#prod-ForDeclaration) contains "let".
- It is a Syntax Error if any element of the [BoundNames](#sec-static-semantics-boundnames) of [ForDeclaration](#prod-ForDeclaration) also occurs in the [VarDeclaredNames](#sec-static-semantics-vardeclarednames) of [Statement](#prod-Statement).
- It is a Syntax Error if the [BoundNames](#sec-static-semantics-boundnames) of [ForDeclaration](#prod-ForDeclaration) contains any duplicate entries.

#### 14.7.5.2 Static Semantics: IsDestructuring

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) IsDestructuring takes no arguments and returns a Boolean. It is defined piecewise over the following productions:

[MemberExpression](#prod-MemberExpression) : [PrimaryExpression](#prod-PrimaryExpression)

1.  If [PrimaryExpression](#prod-PrimaryExpression) is either an [ObjectLiteral](#prod-ObjectLiteral) or an [ArrayLiteral](#prod-ArrayLiteral), return true.
2.  Return false.

[MemberExpression](#prod-MemberExpression) : [MemberExpression](#prod-MemberExpression) \[ [Expression](#prod-Expression) \] [MemberExpression](#prod-MemberExpression) . [IdentifierName](#prod-IdentifierName) [MemberExpression](#prod-MemberExpression) [TemplateLiteral](#prod-TemplateLiteral) [SuperProperty](#prod-SuperProperty) [MetaProperty](#prod-MetaProperty) new [MemberExpression](#prod-MemberExpression) [Arguments](#prod-Arguments) [MemberExpression](#prod-MemberExpression) . [PrivateIdentifier](#prod-PrivateIdentifier) [NewExpression](#prod-NewExpression) : new [NewExpression](#prod-NewExpression) [LeftHandSideExpression](#prod-LeftHandSideExpression) : [CallExpression](#prod-CallExpression) [OptionalExpression](#prod-OptionalExpression)

1.  Return false.

[ForDeclaration](#prod-ForDeclaration) : [LetOrConst](#prod-LetOrConst) [ForBinding](#prod-ForBinding)

1.  Return [IsDestructuring](#sec-static-semantics-isdestructuring) of [ForBinding](#prod-ForBinding).

[ForBinding](#prod-ForBinding) : [BindingIdentifier](#prod-BindingIdentifier)

1.  Return false.

[ForBinding](#prod-ForBinding) : [BindingPattern](#prod-BindingPattern)

1.  Return true.

Note

This section is extended by Annex [B.3.5](#sec-initializers-in-forin-statement-heads).

#### 14.7.5.3 Runtime Semantics: ForDeclarationBindingInitialization

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) ForDeclarationBindingInitialization takes arguments `value` (an [ECMAScript language value](#sec-ecmascript-language-types)) and `environment` (an [Environment Record](#sec-environment-records) or undefined) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or an [abrupt completion](#sec-completion-record-specification-type).

Note

undefined is passed for `environment` to indicate that a [PutValue](#sec-putvalue) operation should be used to assign the initialization value. This is the case for `var` statements and the formal parameter lists of some [non-strict functions](#non-strict-function) (see [10.2.11](#sec-functiondeclarationinstantiation)). In those cases a lexical binding is hoisted and preinitialized prior to evaluation of its initializer.

It is defined piecewise over the following productions:

[ForDeclaration](#prod-ForDeclaration) : [LetOrConst](#prod-LetOrConst) [ForBinding](#prod-ForBinding)

1.  Return ? [BindingInitialization](#sec-runtime-semantics-bindinginitialization) of [ForBinding](#prod-ForBinding) with arguments `value` and `environment`.

#### 14.7.5.4 Runtime Semantics: ForDeclarationBindingInstantiation

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) ForDeclarationBindingInstantiation takes argument `environment` (a [Declarative Environment Record](#sec-declarative-environment-records)) and returns unused. It is defined piecewise over the following productions:

[ForDeclaration](#prod-ForDeclaration) : [LetOrConst](#prod-LetOrConst) [ForBinding](#prod-ForBinding)

1.  For each element `name` of the [BoundNames](#sec-static-semantics-boundnames) of [ForBinding](#prod-ForBinding), do
    1.  If [IsConstantDeclaration](#sec-static-semantics-isconstantdeclaration) of [LetOrConst](#prod-LetOrConst) is true, then
        1.  Perform ! `environment`.CreateImmutableBinding(`name`, true).
    2.  Else,
        1.  Perform ! `environment`.CreateMutableBinding(`name`, false).
2.  Return unused.

#### 14.7.5.5 Runtime Semantics: ForInOfLoopEvaluation

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) ForInOfLoopEvaluation takes argument `labelSet` (a [List](#sec-list-and-record-specification-type) of Strings) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [ECMAScript language value](#sec-ecmascript-language-types) or an [abrupt completion](#sec-completion-record-specification-type). It is defined piecewise over the following productions:

[ForInOfStatement](#prod-ForInOfStatement) : for ( [LeftHandSideExpression](#prod-LeftHandSideExpression) in [Expression](#prod-Expression) ) [Statement](#prod-Statement)

1.  Let `keyResult` be ? [ForIn/OfHeadEvaluation](#sec-runtime-semantics-forinofheadevaluation)(« », [Expression](#prod-Expression), enumerate).
2.  Return ? [ForIn/OfBodyEvaluation](#sec-runtime-semantics-forin-div-ofbodyevaluation-lhs-stmt-iterator-lhskind-labelset)([LeftHandSideExpression](#prod-LeftHandSideExpression), [Statement](#prod-Statement), `keyResult`, enumerate, assignment, `labelSet`).

[ForInOfStatement](#prod-ForInOfStatement) : for ( var [ForBinding](#prod-ForBinding) in [Expression](#prod-Expression) ) [Statement](#prod-Statement)

1.  Let `keyResult` be ? [ForIn/OfHeadEvaluation](#sec-runtime-semantics-forinofheadevaluation)(« », [Expression](#prod-Expression), enumerate).
2.  Return ? [ForIn/OfBodyEvaluation](#sec-runtime-semantics-forin-div-ofbodyevaluation-lhs-stmt-iterator-lhskind-labelset)([ForBinding](#prod-ForBinding), [Statement](#prod-Statement), `keyResult`, enumerate, var-binding, `labelSet`).

[ForInOfStatement](#prod-ForInOfStatement) : for ( [ForDeclaration](#prod-ForDeclaration) in [Expression](#prod-Expression) ) [Statement](#prod-Statement)

1.  Let `keyResult` be ? [ForIn/OfHeadEvaluation](#sec-runtime-semantics-forinofheadevaluation)([BoundNames](#sec-static-semantics-boundnames) of [ForDeclaration](#prod-ForDeclaration), [Expression](#prod-Expression), enumerate).
2.  Return ? [ForIn/OfBodyEvaluation](#sec-runtime-semantics-forin-div-ofbodyevaluation-lhs-stmt-iterator-lhskind-labelset)([ForDeclaration](#prod-ForDeclaration), [Statement](#prod-Statement), `keyResult`, enumerate, lexical-binding, `labelSet`).

[ForInOfStatement](#prod-ForInOfStatement) : for ( [LeftHandSideExpression](#prod-LeftHandSideExpression) of [AssignmentExpression](#prod-AssignmentExpression) ) [Statement](#prod-Statement)

1.  Let `keyResult` be ? [ForIn/OfHeadEvaluation](#sec-runtime-semantics-forinofheadevaluation)(« », [AssignmentExpression](#prod-AssignmentExpression), iterate).
2.  Return ? [ForIn/OfBodyEvaluation](#sec-runtime-semantics-forin-div-ofbodyevaluation-lhs-stmt-iterator-lhskind-labelset)([LeftHandSideExpression](#prod-LeftHandSideExpression), [Statement](#prod-Statement), `keyResult`, iterate, assignment, `labelSet`).

[ForInOfStatement](#prod-ForInOfStatement) : for ( var [ForBinding](#prod-ForBinding) of [AssignmentExpression](#prod-AssignmentExpression) ) [Statement](#prod-Statement)

1.  Let `keyResult` be ? [ForIn/OfHeadEvaluation](#sec-runtime-semantics-forinofheadevaluation)(« », [AssignmentExpression](#prod-AssignmentExpression), iterate).
2.  Return ? [ForIn/OfBodyEvaluation](#sec-runtime-semantics-forin-div-ofbodyevaluation-lhs-stmt-iterator-lhskind-labelset)([ForBinding](#prod-ForBinding), [Statement](#prod-Statement), `keyResult`, iterate, var-binding, `labelSet`).

[ForInOfStatement](#prod-ForInOfStatement) : for ( [ForDeclaration](#prod-ForDeclaration) of [AssignmentExpression](#prod-AssignmentExpression) ) [Statement](#prod-Statement)

1.  Let `keyResult` be ? [ForIn/OfHeadEvaluation](#sec-runtime-semantics-forinofheadevaluation)([BoundNames](#sec-static-semantics-boundnames) of [ForDeclaration](#prod-ForDeclaration), [AssignmentExpression](#prod-AssignmentExpression), iterate).
2.  Return ? [ForIn/OfBodyEvaluation](#sec-runtime-semantics-forin-div-ofbodyevaluation-lhs-stmt-iterator-lhskind-labelset)([ForDeclaration](#prod-ForDeclaration), [Statement](#prod-Statement), `keyResult`, iterate, lexical-binding, `labelSet`).

[ForInOfStatement](#prod-ForInOfStatement) : for await ( [LeftHandSideExpression](#prod-LeftHandSideExpression) of [AssignmentExpression](#prod-AssignmentExpression) ) [Statement](#prod-Statement)

1.  Let `keyResult` be ? [ForIn/OfHeadEvaluation](#sec-runtime-semantics-forinofheadevaluation)(« », [AssignmentExpression](#prod-AssignmentExpression), async-iterate).
2.  Return ? [ForIn/OfBodyEvaluation](#sec-runtime-semantics-forin-div-ofbodyevaluation-lhs-stmt-iterator-lhskind-labelset)([LeftHandSideExpression](#prod-LeftHandSideExpression), [Statement](#prod-Statement), `keyResult`, iterate, assignment, `labelSet`, async).

[ForInOfStatement](#prod-ForInOfStatement) : for await ( var [ForBinding](#prod-ForBinding) of [AssignmentExpression](#prod-AssignmentExpression) ) [Statement](#prod-Statement)

1.  Let `keyResult` be ? [ForIn/OfHeadEvaluation](#sec-runtime-semantics-forinofheadevaluation)(« », [AssignmentExpression](#prod-AssignmentExpression), async-iterate).
2.  Return ? [ForIn/OfBodyEvaluation](#sec-runtime-semantics-forin-div-ofbodyevaluation-lhs-stmt-iterator-lhskind-labelset)([ForBinding](#prod-ForBinding), [Statement](#prod-Statement), `keyResult`, iterate, var-binding, `labelSet`, async).

[ForInOfStatement](#prod-ForInOfStatement) : for await ( [ForDeclaration](#prod-ForDeclaration) of [AssignmentExpression](#prod-AssignmentExpression) ) [Statement](#prod-Statement)

1.  Let `keyResult` be ? [ForIn/OfHeadEvaluation](#sec-runtime-semantics-forinofheadevaluation)([BoundNames](#sec-static-semantics-boundnames) of [ForDeclaration](#prod-ForDeclaration), [AssignmentExpression](#prod-AssignmentExpression), async-iterate).
2.  Return ? [ForIn/OfBodyEvaluation](#sec-runtime-semantics-forin-div-ofbodyevaluation-lhs-stmt-iterator-lhskind-labelset)([ForDeclaration](#prod-ForDeclaration), [Statement](#prod-Statement), `keyResult`, iterate, lexical-binding, `labelSet`, async).

Note

This section is extended by Annex [B.3.5](#sec-initializers-in-forin-statement-heads).

#### 14.7.5.6 ForIn/OfHeadEvaluation ( `uninitializedBoundNames`, `expr`, `iterationKind` )

The abstract operation ForIn/OfHeadEvaluation takes arguments `uninitializedBoundNames` (a [List](#sec-list-and-record-specification-type) of Strings), `expr` (an [Expression](#prod-Expression) [Parse Node](#sec-syntactic-grammar) or an [AssignmentExpression](#prod-AssignmentExpression) [Parse Node](#sec-syntactic-grammar)), and `iterationKind` (enumerate, iterate, or async-iterate) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [Iterator Record](#sec-iterator-records) or an [abrupt completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `oldEnv` be the [running execution context](#running-execution-context)'s LexicalEnvironment.
2.  If `uninitializedBoundNames` is not empty, then
    1.  [Assert](#assert): `uninitializedBoundNames` has no duplicate entries.
    2.  Let `newEnv` be [NewDeclarativeEnvironment](#sec-newdeclarativeenvironment)(`oldEnv`).
    3.  For each String `name` of `uninitializedBoundNames`, do
        1.  Perform ! `newEnv`.CreateMutableBinding(`name`, false).
    4.  Set the [running execution context](#running-execution-context)'s LexicalEnvironment to `newEnv`.
3.  Let `exprRef` be [Completion](#sec-completion-ao)([Evaluation](#sec-evaluation) of `expr`).
4.  Set the [running execution context](#running-execution-context)'s LexicalEnvironment to `oldEnv`.
5.  Let `exprValue` be ? [GetValue](#sec-getvalue)(? `exprRef`).
6.  If `iterationKind` is enumerate, then
    1.  If `exprValue` is either undefined or null, then
        1.  Return [Completion Record](#sec-completion-record-specification-type) { `[[Type]]`: break, `[[Value]]`: empty, `[[Target]]`: empty }.
    2.  Let `obj` be ! [ToObject](#sec-toobject)(`exprValue`).
    3.  Let `iterator` be [EnumerateObjectProperties](#sec-enumerate-object-properties)(`obj`).
    4.  Let `nextMethod` be ! [GetV](#sec-getv)(`iterator`, "next").
    5.  Return the [Iterator Record](#sec-iterator-records) { `[[Iterator]]`: `iterator`, `[[NextMethod]]`: `nextMethod`, `[[Done]]`: false }.
7.  Else,
    1.  [Assert](#assert): `iterationKind` is either iterate or async-iterate.
    2.  If `iterationKind` is async-iterate, let `iteratorKind` be async.
    3.  Else, let `iteratorKind` be sync.
    4.  Return ? [GetIterator](#sec-getiterator)(`exprValue`, `iteratorKind`).

#### 14.7.5.7 ForIn/OfBodyEvaluation ( `lhs`, `stmt`, `iteratorRecord`, `iterationKind`, `lhsKind`, `labelSet` \[ , `iteratorKind` \] )

The abstract operation ForIn/OfBodyEvaluation takes arguments `lhs` (a [Parse Node](#sec-syntactic-grammar)), `stmt` (a [Statement](#prod-Statement) [Parse Node](#sec-syntactic-grammar)), `iteratorRecord` (an [Iterator Record](#sec-iterator-records)), `iterationKind` (enumerate or iterate), `lhsKind` (assignment, var-binding, or lexical-binding), and `labelSet` (a [List](#sec-list-and-record-specification-type) of Strings) and optional argument `iteratorKind` (sync or async) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [ECMAScript language value](#sec-ecmascript-language-types) or an [abrupt completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  If `iteratorKind` is not present, set `iteratorKind` to sync.
2.  Let `oldEnv` be the [running execution context](#running-execution-context)'s LexicalEnvironment.
3.  Let `V` be undefined.
4.  Let `destructuring` be [IsDestructuring](#sec-static-semantics-isdestructuring) of `lhs`.
5.  If `destructuring` is true and `lhsKind` is assignment, then
    1.  [Assert](#assert): `lhs` is a [LeftHandSideExpression](#prod-LeftHandSideExpression).
    2.  Let `assignmentPattern` be the [AssignmentPattern](#prod-AssignmentPattern) that is [covered](#sec-syntactic-grammar) by `lhs`.
6.  Repeat,
    1.  Let `nextResult` be ? [Call](#sec-call)(`iteratorRecord`.`[[NextMethod]]`, `iteratorRecord`.`[[Iterator]]`).
    2.  If `iteratorKind` is async, set `nextResult` to ? [Await](#await)(`nextResult`).
    3.  If `nextResult` [is not an Object](#sec-object-type), throw a TypeError exception.
    4.  Let `done` be ? [IteratorComplete](#sec-iteratorcomplete)(`nextResult`).
    5.  If `done` is true, return `V`.
    6.  Let `nextValue` be ? [IteratorValue](#sec-iteratorvalue)(`nextResult`).
    7.  If `lhsKind` is either assignment or var-binding, then
        1.  If `destructuring` is true, then
            1.  If `lhsKind` is assignment, then
                1.  Let `status` be [Completion](#sec-completion-ao)([DestructuringAssignmentEvaluation](#sec-runtime-semantics-destructuringassignmentevaluation) of `assignmentPattern` with argument `nextValue`).
            2.  Else,
                1.  [Assert](#assert): `lhsKind` is var-binding.
                2.  [Assert](#assert): `lhs` is a [ForBinding](#prod-ForBinding).
                3.  Let `status` be [Completion](#sec-completion-ao)([BindingInitialization](#sec-runtime-semantics-bindinginitialization) of `lhs` with arguments `nextValue` and undefined).
        2.  Else,
            1.  Let `lhsRef` be [Completion](#sec-completion-ao)([Evaluation](#sec-evaluation) of `lhs`). (It may be evaluated repeatedly.)
            2.  If `lhsRef` is an [abrupt completion](#sec-completion-record-specification-type), then
                1.  Let `status` be `lhsRef`.
            3.  Else,
                1.  Let `status` be [Completion](#sec-completion-ao)([PutValue](#sec-putvalue)(`lhsRef`.`[[Value]]`, `nextValue`)).
    8.  Else,
        1.  [Assert](#assert): `lhsKind` is lexical-binding.
        2.  [Assert](#assert): `lhs` is a [ForDeclaration](#prod-ForDeclaration).
        3.  Let `iterationEnv` be [NewDeclarativeEnvironment](#sec-newdeclarativeenvironment)(`oldEnv`).
        4.  Perform [ForDeclarationBindingInstantiation](#sec-runtime-semantics-fordeclarationbindinginstantiation) of `lhs` with argument `iterationEnv`.
        5.  Set the [running execution context](#running-execution-context)'s LexicalEnvironment to `iterationEnv`.
        6.  If `destructuring` is true, then
            1.  Let `status` be [Completion](#sec-completion-ao)([ForDeclarationBindingInitialization](#sec-runtime-semantics-fordeclarationbindinginitialization) of `lhs` with arguments `nextValue` and `iterationEnv`).
        7.  Else,
            1.  [Assert](#assert): `lhs` binds a single name.
            2.  Let `lhsName` be the sole element of the [BoundNames](#sec-static-semantics-boundnames) of `lhs`.
            3.  Let `lhsRef` be ! [ResolveBinding](#sec-resolvebinding)(`lhsName`).
            4.  Let `status` be [Completion](#sec-completion-ao)([InitializeReferencedBinding](#sec-initializereferencedbinding)(`lhsRef`, `nextValue`)).
    9.  If `status` is an [abrupt completion](#sec-completion-record-specification-type), then
        1.  Set the [running execution context](#running-execution-context)'s LexicalEnvironment to `oldEnv`.
        2.  If `iteratorKind` is async, return ? [AsyncIteratorClose](#sec-asynciteratorclose)(`iteratorRecord`, `status`).
        3.  If `iterationKind` is enumerate, then
            1.  Return ? `status`.
        4.  Else,
            1.  [Assert](#assert): `iterationKind` is iterate.
            2.  Return ? [IteratorClose](#sec-iteratorclose)(`iteratorRecord`, `status`).
    10. Let `result` be [Completion](#sec-completion-ao)([Evaluation](#sec-evaluation) of `stmt`).
    11. Set the [running execution context](#running-execution-context)'s LexicalEnvironment to `oldEnv`.
    12. If [LoopContinues](#sec-loopcontinues)(`result`, `labelSet`) is false, then
        1.  If `iterationKind` is enumerate, then
            1.  Return ? [UpdateEmpty](#sec-updateempty)(`result`, `V`).
        2.  Else,
            1.  [Assert](#assert): `iterationKind` is iterate.
            2.  Set `status` to [Completion](#sec-completion-ao)([UpdateEmpty](#sec-updateempty)(`result`, `V`)).
            3.  If `iteratorKind` is async, return ? [AsyncIteratorClose](#sec-asynciteratorclose)(`iteratorRecord`, `status`).
            4.  Return ? [IteratorClose](#sec-iteratorclose)(`iteratorRecord`, `status`).
    13. If `result`.`[[Value]]` is not empty, set `V` to `result`.`[[Value]]`.

#### 14.7.5.8 Runtime Semantics: Evaluation

[BindingIdentifier](#prod-BindingIdentifier) : [Identifier](#prod-Identifier) yield await

1.  Let `bindingId` be the [StringValue](#sec-static-semantics-stringvalue) of [BindingIdentifier](#prod-BindingIdentifier).
2.  Return ? [ResolveBinding](#sec-resolvebinding)(`bindingId`).

#### 14.7.5.9 EnumerateObjectProperties ( `O` )

The abstract operation EnumerateObjectProperties takes argument `O` (an Object) and returns an [iterator object](#sec-iterator-interface). It performs the following steps when called:

1.  Return an [iterator object](#sec-iterator-interface) whose `next` method iterates over all the String-valued keys of enumerable properties of `O`. The [iterator object](#sec-iterator-interface) is never directly accessible to ECMAScript code. The mechanics and order of enumerating the properties is not specified but must conform to the rules specified below.

The [iterator](#sec-iterator-interface)'s `throw` and `return` methods are null and are never invoked. The [iterator](#sec-iterator-interface)'s `next` method processes object properties to determine whether the [property key](#property-key) should be returned as an [iterator](#sec-iterator-interface) value. Returned [property keys](#property-key) do not include keys that are Symbols. Properties of the target object may be deleted during enumeration. A property that is deleted before it is processed by the [iterator](#sec-iterator-interface)'s `next` method is ignored. If new properties are added to the target object during enumeration, the newly added properties are not guaranteed to be processed in the active enumeration. A [property name](#property-name) will be returned by the [iterator](#sec-iterator-interface)'s `next` method at most once in any enumeration.

Enumerating the properties of the target object includes enumerating properties of its prototype, and the prototype of the prototype, and so on, recursively; but a property of a prototype is not processed if it has the same name as a property that has already been processed by the [iterator](#sec-iterator-interface)'s `next` method. The values of `[[Enumerable]]` attributes are not considered when determining if a property of a prototype object has already been processed. The enumerable property names of prototype objects must be obtained by invoking EnumerateObjectProperties passing the prototype object as the argument. EnumerateObjectProperties must obtain the own [property keys](#property-key) of the target object by calling its `[[OwnPropertyKeys]]` internal method. Property attributes of the target object must be obtained by calling its `[[GetOwnProperty]]` internal method.

In addition, if neither `O` nor any object in its prototype chain is a [Proxy exotic object](#proxy-exotic-object), [TypedArray](#typedarray), [module namespace exotic object](#module-namespace-exotic-object), or implementation provided [exotic object](#exotic-object), then the [iterator](#sec-iterator-interface) must behave as would the [iterator](#sec-iterator-interface) given by [CreateForInIterator](#sec-createforiniterator)(`O`) until one of the following occurs:

- the value of the `[[Prototype]]` internal slot of `O` or an object in its prototype chain changes,
- a property is removed from `O` or an object in its prototype chain,
- a property is added to an object in `O`'s prototype chain, or
- the value of the `[[Enumerable]]` attribute of a property of `O` or an object in its prototype chain changes.

Note 1

ECMAScript implementations are not required to implement the algorithm in [14.7.5.10.2.1](#sec-%foriniteratorprototype%.next) directly. They may choose any implementation whose behaviour will not deviate from that algorithm unless one of the constraints in the previous paragraph is violated.

The following is an informative definition of an ECMAScript generator function that conforms to these rules:

``` javascript
function* EnumerateObjectProperties(obj) {
  const visited = new Set();
  for (const key of Reflect.ownKeys(obj)) {
    if (typeof key === "symbol") continue;
    const desc = Reflect.getOwnPropertyDescriptor(obj, key);
    if (desc) {
      visited.add(key);
      if (desc.enumerable) yield key;
    }
  }
  const proto = Reflect.getPrototypeOf(obj);
  if (proto === null) return;
  for (const protoKey of EnumerateObjectProperties(proto)) {
    if (!visited.has(protoKey)) yield protoKey;
  }
}
```

Note 2

The list of [exotic objects](#exotic-object) for which implementations are not required to match [CreateForInIterator](#sec-createforiniterator) was chosen because implementations historically differed in behaviour for those cases, and agreed in all others.

#### 14.7.5.10 For-In Iterator Objects

A For-In Iterator is an object that represents a specific iteration over some specific object. For-In Iterator objects are never directly accessible to ECMAScript code; they exist solely to illustrate the behaviour of [EnumerateObjectProperties](#sec-enumerate-object-properties).

##### 14.7.5.10.1 CreateForInIterator ( `object` )

The abstract operation CreateForInIterator takes argument `object` (an Object) and returns a [For-In Iterator](#sec-for-in-iterator-objects). It is used to create a [For-In Iterator object](#sec-for-in-iterator-objects) which iterates over the own and inherited enumerable string properties of `object` in a specific order. It performs the following steps when called:

1.  Let `iterator` be [OrdinaryObjectCreate](#sec-ordinaryobjectcreate)([%ForInIteratorPrototype%](#sec-%foriniteratorprototype%-object), « `[[Object]]`, `[[ObjectWasVisited]]`, `[[VisitedKeys]]`, `[[RemainingKeys]]` »).
2.  Set `iterator`.`[[Object]]` to `object`.
3.  Set `iterator`.`[[ObjectWasVisited]]` to false.
4.  Set `iterator`.`[[VisitedKeys]]` to a new empty [List](#sec-list-and-record-specification-type).
5.  Set `iterator`.`[[RemainingKeys]]` to a new empty [List](#sec-list-and-record-specification-type).
6.  Return `iterator`.

##### 14.7.5.10.2 The %ForInIteratorPrototype% Object

The %ForInIteratorPrototype% object:

- has properties that are inherited by all [For-In Iterator objects](#sec-for-in-iterator-objects).
- is an [ordinary object](#ordinary-object).
- has a `[[Prototype]]` internal slot whose value is [%Iterator.prototype%](#sec-%iterator.prototype%-object).
- is never directly accessible to ECMAScript code.
- has the following properties:

###### 14.7.5.10.2.1 %ForInIteratorPrototype%.next ( )

1.  Let `O` be the this value.
2.  [Assert](#assert): `O` [is an Object](#sec-object-type).
3.  [Assert](#assert): `O` has all of the internal slots of a [For-In Iterator](#sec-for-in-iterator-objects) instance ([14.7.5.10.3](#sec-properties-of-for-in-iterator-instances)).
4.  Let `object` be `O`.`[[Object]]`.
5.  Repeat,
    1.  If `O`.`[[ObjectWasVisited]]` is false, then
        1.  Let `keys` be ? `object`.`[[OwnPropertyKeys]]`().
        2.  For each element `key` of `keys`, do
            1.  If `key` [is a String](#sec-ecmascript-language-types-string-type), then
                1.  Append `key` to `O`.`[[RemainingKeys]]`.
        3.  Set `O`.`[[ObjectWasVisited]]` to true.
    2.  Repeat, while `O`.`[[RemainingKeys]]` is not empty,
        1.  Let `r` be the first element of `O`.`[[RemainingKeys]]`.
        2.  Remove the first element from `O`.`[[RemainingKeys]]`.
        3.  If `O`.`[[VisitedKeys]]` does not contain `r`, then
            1.  Let `desc` be ? `object`.`[[GetOwnProperty]]`(`r`).
            2.  If `desc` is not undefined, then
                1.  Append `r` to `O`.`[[VisitedKeys]]`.
                2.  If `desc`.`[[Enumerable]]` is true, return [CreateIteratorResultObject](#sec-createiterresultobject)(`r`, false).
    3.  Set `object` to ? `object`.`[[GetPrototypeOf]]`().
    4.  Set `O`.`[[Object]]` to `object`.
    5.  Set `O`.`[[ObjectWasVisited]]` to false.
    6.  If `object` is null, return [CreateIteratorResultObject](#sec-createiterresultobject)(undefined, true).

##### 14.7.5.10.3 Properties of For-In Iterator Instances

[For-In Iterator](#sec-for-in-iterator-objects) instances are [ordinary objects](#ordinary-object) that inherit properties from the [%ForInIteratorPrototype%](#sec-%foriniteratorprototype%-object) intrinsic object. [For-In Iterator](#sec-for-in-iterator-objects) instances are initially created with the internal slots listed in [Table 38](#table-for-in-iterator-instance-slots).

| Internal Slot | Type | Description |
|----|----|----|
| `[[Object]]` | an Object | The Object value whose properties are being iterated. |
| `[[ObjectWasVisited]]` | a Boolean | true if the [iterator](#sec-iterator-interface) has invoked `[[OwnPropertyKeys]]` on `[[Object]]`, false otherwise. |
| `[[VisitedKeys]]` | a [List](#sec-list-and-record-specification-type) of Strings | The values that have been emitted by this [iterator](#sec-iterator-interface) thus far. |
| `[[RemainingKeys]]` | a [List](#sec-list-and-record-specification-type) of Strings | The values remaining to be emitted for the current object, before iterating the properties of its prototype (if its prototype is not null). |

Table 38: Internal Slots of [For-In Iterator](#sec-for-in-iterator-objects) Instances

## 14.8 The `continue` Statement

### Syntax

[ContinueStatement](#prod-ContinueStatement)\[Yield, Await\] : continue ; continue \[no [LineTerminator](#prod-LineTerminator) here\] [LabelIdentifier](#prod-LabelIdentifier)\[?Yield, ?Await\] ;

### 14.8.1 Static Semantics: Early Errors

[ContinueStatement](#prod-ContinueStatement) : continue ; continue [LabelIdentifier](#prod-LabelIdentifier) ;

- It is a Syntax Error if this [ContinueStatement](#prod-ContinueStatement) is not nested, directly or indirectly (but not crossing function or `static` initialization block boundaries), within an [IterationStatement](#prod-IterationStatement).

### 14.8.2 Runtime Semantics: Evaluation

[ContinueStatement](#prod-ContinueStatement) : continue ;

1.  Return [Completion Record](#sec-completion-record-specification-type) { `[[Type]]`: continue, `[[Value]]`: empty, `[[Target]]`: empty }.

[ContinueStatement](#prod-ContinueStatement) : continue [LabelIdentifier](#prod-LabelIdentifier) ;

1.  Let `label` be the [StringValue](#sec-static-semantics-stringvalue) of [LabelIdentifier](#prod-LabelIdentifier).
2.  Return [Completion Record](#sec-completion-record-specification-type) { `[[Type]]`: continue, `[[Value]]`: empty, `[[Target]]`: `label` }.

## 14.9 The `break` Statement

### Syntax

[BreakStatement](#prod-BreakStatement)\[Yield, Await\] : break ; break \[no [LineTerminator](#prod-LineTerminator) here\] [LabelIdentifier](#prod-LabelIdentifier)\[?Yield, ?Await\] ;

### 14.9.1 Static Semantics: Early Errors

[BreakStatement](#prod-BreakStatement) : break ;

- It is a Syntax Error if this [BreakStatement](#prod-BreakStatement) is not nested, directly or indirectly (but not crossing function or `static` initialization block boundaries), within an [IterationStatement](#prod-IterationStatement) or a [SwitchStatement](#prod-SwitchStatement).

### 14.9.2 Runtime Semantics: Evaluation

[BreakStatement](#prod-BreakStatement) : break ;

1.  Return [Completion Record](#sec-completion-record-specification-type) { `[[Type]]`: break, `[[Value]]`: empty, `[[Target]]`: empty }.

[BreakStatement](#prod-BreakStatement) : break [LabelIdentifier](#prod-LabelIdentifier) ;

1.  Let `label` be the [StringValue](#sec-static-semantics-stringvalue) of [LabelIdentifier](#prod-LabelIdentifier).
2.  Return [Completion Record](#sec-completion-record-specification-type) { `[[Type]]`: break, `[[Value]]`: empty, `[[Target]]`: `label` }.

## 14.10 The `return` Statement

### Syntax

[ReturnStatement](#prod-ReturnStatement)\[Yield, Await\] : return ; return \[no [LineTerminator](#prod-LineTerminator) here\] [Expression](#prod-Expression)\[+In, ?Yield, ?Await\] ; Note

A `return` statement causes a function to cease execution and, in most cases, returns a value to the caller. If [Expression](#prod-Expression) is omitted, the return value is undefined. Otherwise, the return value is the value of [Expression](#prod-Expression). A `return` statement may not actually return a value to the caller depending on surrounding context. For example, in a `try` block, a `return` statement's [Completion Record](#sec-completion-record-specification-type) may be replaced with another [Completion Record](#sec-completion-record-specification-type) during evaluation of the `finally` block.

### 14.10.1 Runtime Semantics: Evaluation

[ReturnStatement](#prod-ReturnStatement) : return ;

1.  Return [ReturnCompletion](#sec-returncompletion)(undefined).

[ReturnStatement](#prod-ReturnStatement) : return [Expression](#prod-Expression) ;

1.  Let `exprRef` be ? [Evaluation](#sec-evaluation) of [Expression](#prod-Expression).
2.  Let `exprValue` be ? [GetValue](#sec-getvalue)(`exprRef`).
3.  If [GetGeneratorKind](#sec-getgeneratorkind)() is async, set `exprValue` to ? [Await](#await)(`exprValue`).
4.  Return [ReturnCompletion](#sec-returncompletion)(`exprValue`).

[Legacy](#sec-conformance)

## 14.11 The `with` Statement

Note 1

Use of the [Legacy](#sec-conformance) `with` statement is discouraged in new ECMAScript code. Consider alternatives that are permitted in both [strict mode code](#sec-strict-mode-code) and [non-strict code](#non-strict-code), such as [destructuring assignment](#sec-destructuring-assignment).

### Syntax

[WithStatement](#prod-WithStatement)\[Yield, Await, Return\] : with ( [Expression](#prod-Expression)\[+In, ?Yield, ?Await\] ) [Statement](#prod-Statement)\[?Yield, ?Await, ?Return\] Note 2

The `with` statement adds an [Object Environment Record](#sec-object-environment-records) for a computed object to the lexical environment of the [running execution context](#running-execution-context). It then executes a statement using this augmented lexical environment. Finally, it restores the original lexical environment.

### 14.11.1 Static Semantics: Early Errors

[WithStatement](#prod-WithStatement) : with ( [Expression](#prod-Expression) ) [Statement](#prod-Statement)

- It is a Syntax Error if [IsStrict](#sec-isstrict)(this production) is true.
- It is a Syntax Error if [IsLabelledFunction](#sec-islabelledfunction)([Statement](#prod-Statement)) is true.

Note

It is only necessary to apply the second rule if the extension specified in [B.3.1](#sec-labelled-function-declarations) is implemented.

### 14.11.2 Runtime Semantics: Evaluation

[WithStatement](#prod-WithStatement) : with ( [Expression](#prod-Expression) ) [Statement](#prod-Statement)

1.  Let `val` be ? [Evaluation](#sec-evaluation) of [Expression](#prod-Expression).
2.  Let `obj` be ? [ToObject](#sec-toobject)(? [GetValue](#sec-getvalue)(`val`)).
3.  Let `oldEnv` be the [running execution context](#running-execution-context)'s LexicalEnvironment.
4.  Let `newEnv` be [NewObjectEnvironment](#sec-newobjectenvironment)(`obj`, true, `oldEnv`).
5.  Set the [running execution context](#running-execution-context)'s LexicalEnvironment to `newEnv`.
6.  Let `C` be [Completion](#sec-completion-ao)([Evaluation](#sec-evaluation) of [Statement](#prod-Statement)).
7.  Set the [running execution context](#running-execution-context)'s LexicalEnvironment to `oldEnv`.
8.  Return ? [UpdateEmpty](#sec-updateempty)(`C`, undefined).

Note

No matter how control leaves the embedded [Statement](#prod-Statement), whether normally or by some form of [abrupt completion](#sec-completion-record-specification-type) or exception, the LexicalEnvironment is always restored to its former state.

## 14.12 The `switch` Statement

### Syntax

[SwitchStatement](#prod-SwitchStatement)\[Yield, Await, Return\] : switch ( [Expression](#prod-Expression)\[+In, ?Yield, ?Await\] ) [CaseBlock](#prod-CaseBlock)\[?Yield, ?Await, ?Return\] [CaseBlock](#prod-CaseBlock)\[Yield, Await, Return\] : { [CaseClauses](#prod-CaseClauses)\[?Yield, ?Await, ?Return\]opt } { [CaseClauses](#prod-CaseClauses)\[?Yield, ?Await, ?Return\]opt [DefaultClause](#prod-DefaultClause)\[?Yield, ?Await, ?Return\] [CaseClauses](#prod-CaseClauses)\[?Yield, ?Await, ?Return\]opt } [CaseClauses](#prod-CaseClauses)\[Yield, Await, Return\] : [CaseClause](#prod-CaseClause)\[?Yield, ?Await, ?Return\] [CaseClauses](#prod-CaseClauses)\[?Yield, ?Await, ?Return\] [CaseClause](#prod-CaseClause)\[?Yield, ?Await, ?Return\] [CaseClause](#prod-CaseClause)\[Yield, Await, Return\] : case [Expression](#prod-Expression)\[+In, ?Yield, ?Await\] : [StatementList](#prod-StatementList)\[?Yield, ?Await, ?Return\]opt [DefaultClause](#prod-DefaultClause)\[Yield, Await, Return\] : default : [StatementList](#prod-StatementList)\[?Yield, ?Await, ?Return\]opt

### 14.12.1 Static Semantics: Early Errors

[SwitchStatement](#prod-SwitchStatement) : switch ( [Expression](#prod-Expression) ) [CaseBlock](#prod-CaseBlock)

- It is a Syntax Error if the [LexicallyDeclaredNames](#sec-static-semantics-lexicallydeclarednames) of [CaseBlock](#prod-CaseBlock) contains any duplicate entries.
- It is a Syntax Error if any element of the [LexicallyDeclaredNames](#sec-static-semantics-lexicallydeclarednames) of [CaseBlock](#prod-CaseBlock) also occurs in the [VarDeclaredNames](#sec-static-semantics-vardeclarednames) of [CaseBlock](#prod-CaseBlock).

### 14.12.2 Runtime Semantics: CaseBlockEvaluation

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) CaseBlockEvaluation takes argument `input` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [ECMAScript language value](#sec-ecmascript-language-types) or an [abrupt completion](#sec-completion-record-specification-type). It is defined piecewise over the following productions:

[CaseBlock](#prod-CaseBlock) : { }

1.  Return undefined.

[CaseBlock](#prod-CaseBlock) : { [CaseClauses](#prod-CaseClauses) }

1.  Let `V` be undefined.
2.  Let `A` be the [List](#sec-list-and-record-specification-type) of [CaseClause](#prod-CaseClause) items in [CaseClauses](#prod-CaseClauses), in source text order.
3.  Let `found` be false.
4.  For each [CaseClause](#prod-CaseClause) `C` of `A`, do
    1.  If `found` is false, then
        1.  Set `found` to ? [CaseClauseIsSelected](#sec-runtime-semantics-caseclauseisselected)(`C`, `input`).
    2.  If `found` is true, then
        1.  Let `R` be [Completion](#sec-completion-ao)([Evaluation](#sec-evaluation) of `C`).
        2.  If `R`.`[[Value]]` is not empty, set `V` to `R`.`[[Value]]`.
        3.  If `R` is an [abrupt completion](#sec-completion-record-specification-type), return ? [UpdateEmpty](#sec-updateempty)(`R`, `V`).
5.  Return `V`.

[CaseBlock](#prod-CaseBlock) : { [CaseClauses](#prod-CaseClauses)opt [DefaultClause](#prod-DefaultClause) [CaseClauses](#prod-CaseClauses)opt }

1.  Let `V` be undefined.
2.  If the first [CaseClauses](#prod-CaseClauses) is present, then
    1.  Let `A` be the [List](#sec-list-and-record-specification-type) of [CaseClause](#prod-CaseClause) items in the first [CaseClauses](#prod-CaseClauses), in source text order.
3.  Else,
    1.  Let `A` be a new empty [List](#sec-list-and-record-specification-type).
4.  Let `found` be false.
5.  For each [CaseClause](#prod-CaseClause) `C` of `A`, do
    1.  If `found` is false, then
        1.  Set `found` to ? [CaseClauseIsSelected](#sec-runtime-semantics-caseclauseisselected)(`C`, `input`).
    2.  If `found` is true, then
        1.  Let `R` be [Completion](#sec-completion-ao)([Evaluation](#sec-evaluation) of `C`).
        2.  If `R`.`[[Value]]` is not empty, set `V` to `R`.`[[Value]]`.
        3.  If `R` is an [abrupt completion](#sec-completion-record-specification-type), return ? [UpdateEmpty](#sec-updateempty)(`R`, `V`).
6.  Let `foundInB` be false.
7.  If the second [CaseClauses](#prod-CaseClauses) is present, then
    1.  Let `B` be the [List](#sec-list-and-record-specification-type) of [CaseClause](#prod-CaseClause) items in the second [CaseClauses](#prod-CaseClauses), in source text order.
8.  Else,
    1.  Let `B` be a new empty [List](#sec-list-and-record-specification-type).
9.  If `found` is false, then
    1.  For each [CaseClause](#prod-CaseClause) `C` of `B`, do
        1.  If `foundInB` is false, then
            1.  Set `foundInB` to ? [CaseClauseIsSelected](#sec-runtime-semantics-caseclauseisselected)(`C`, `input`).
        2.  If `foundInB` is true, then
            1.  Let `R` be [Completion](#sec-completion-ao)([Evaluation](#sec-evaluation) of [CaseClause](#prod-CaseClause) `C`).
            2.  If `R`.`[[Value]]` is not empty, set `V` to `R`.`[[Value]]`.
            3.  If `R` is an [abrupt completion](#sec-completion-record-specification-type), return ? [UpdateEmpty](#sec-updateempty)(`R`, `V`).
10. If `foundInB` is true, return `V`.
11. Let `defaultR` be [Completion](#sec-completion-ao)([Evaluation](#sec-evaluation) of [DefaultClause](#prod-DefaultClause)).
12. If `defaultR`.`[[Value]]` is not empty, set `V` to `defaultR`.`[[Value]]`.
13. If `defaultR` is an [abrupt completion](#sec-completion-record-specification-type), return ? [UpdateEmpty](#sec-updateempty)(`defaultR`, `V`).
14. NOTE: The following is another complete iteration of the second [CaseClauses](#prod-CaseClauses).
15. For each [CaseClause](#prod-CaseClause) `C` of `B`, do
    1.  Let `R` be [Completion](#sec-completion-ao)([Evaluation](#sec-evaluation) of [CaseClause](#prod-CaseClause) `C`).
    2.  If `R`.`[[Value]]` is not empty, set `V` to `R`.`[[Value]]`.
    3.  If `R` is an [abrupt completion](#sec-completion-record-specification-type), return ? [UpdateEmpty](#sec-updateempty)(`R`, `V`).
16. Return `V`.

### 14.12.3 CaseClauseIsSelected ( `C`, `input` )

The abstract operation CaseClauseIsSelected takes arguments `C` (a [CaseClause](#prod-CaseClause) [Parse Node](#sec-syntactic-grammar)) and `input` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a Boolean or an [abrupt completion](#sec-completion-record-specification-type). It determines whether `C` matches `input`. It performs the following steps when called:

1.  [Assert](#assert): `C` is an instance of the production [CaseClause](#prod-CaseClause) : case [Expression](#prod-Expression) : [StatementList](#prod-StatementList)opt .
2.  Let `exprRef` be ? [Evaluation](#sec-evaluation) of the [Expression](#prod-Expression) of `C`.
3.  Let `clauseSelector` be ? [GetValue](#sec-getvalue)(`exprRef`).
4.  Return [IsStrictlyEqual](#sec-isstrictlyequal)(`input`, `clauseSelector`).

Note

This operation does not execute `C`'s [StatementList](#prod-StatementList) (if any). The [CaseBlock](#prod-CaseBlock) algorithm uses its return value to determine which [StatementList](#prod-StatementList) to start executing.

### 14.12.4 Runtime Semantics: Evaluation

[SwitchStatement](#prod-SwitchStatement) : switch ( [Expression](#prod-Expression) ) [CaseBlock](#prod-CaseBlock)

1.  Let `exprRef` be ? [Evaluation](#sec-evaluation) of [Expression](#prod-Expression).
2.  Let `switchValue` be ? [GetValue](#sec-getvalue)(`exprRef`).
3.  Let `oldEnv` be the [running execution context](#running-execution-context)'s LexicalEnvironment.
4.  Let `blockEnv` be [NewDeclarativeEnvironment](#sec-newdeclarativeenvironment)(`oldEnv`).
5.  Perform [BlockDeclarationInstantiation](#sec-blockdeclarationinstantiation)([CaseBlock](#prod-CaseBlock), `blockEnv`).
6.  Set the [running execution context](#running-execution-context)'s LexicalEnvironment to `blockEnv`.
7.  Let `R` be [Completion](#sec-completion-ao)([CaseBlockEvaluation](#sec-runtime-semantics-caseblockevaluation) of [CaseBlock](#prod-CaseBlock) with argument `switchValue`).
8.  Set the [running execution context](#running-execution-context)'s LexicalEnvironment to `oldEnv`.
9.  Return `R`.

Note

No matter how control leaves the [SwitchStatement](#prod-SwitchStatement) the LexicalEnvironment is always restored to its former state.

[CaseClause](#prod-CaseClause) : case [Expression](#prod-Expression) :

1.  Return empty.

[CaseClause](#prod-CaseClause) : case [Expression](#prod-Expression) : [StatementList](#prod-StatementList)

1.  Return ? [Evaluation](#sec-evaluation) of [StatementList](#prod-StatementList).

[DefaultClause](#prod-DefaultClause) : default :

1.  Return empty.

[DefaultClause](#prod-DefaultClause) : default : [StatementList](#prod-StatementList)

1.  Return ? [Evaluation](#sec-evaluation) of [StatementList](#prod-StatementList).

## 14.13 Labelled Statements

### Syntax

[LabelledStatement](#prod-LabelledStatement)\[Yield, Await, Return\] : [LabelIdentifier](#prod-LabelIdentifier)\[?Yield, ?Await\] : [LabelledItem](#prod-LabelledItem)\[?Yield, ?Await, ?Return\] [LabelledItem](#prod-LabelledItem)\[Yield, Await, Return\] : [Statement](#prod-Statement)\[?Yield, ?Await, ?Return\] [FunctionDeclaration](#prod-FunctionDeclaration)\[?Yield, ?Await, ~Default\] Note

A [Statement](#prod-Statement) may be prefixed by a label. Labelled statements are only used in conjunction with labelled `break` and `continue` statements. ECMAScript has no `goto` statement. A [Statement](#prod-Statement) can be part of a [LabelledStatement](#prod-LabelledStatement), which itself can be part of a [LabelledStatement](#prod-LabelledStatement), and so on. The labels introduced this way are collectively referred to as the “current label set” when describing the semantics of individual statements.

### 14.13.1 Static Semantics: Early Errors

[LabelledItem](#prod-LabelledItem) : [FunctionDeclaration](#prod-FunctionDeclaration)

- It is a Syntax Error if any source text is matched by this production.

Note

An alternative definition for this rule is provided in [B.3.1](#sec-labelled-function-declarations).

### 14.13.2 Static Semantics: IsLabelledFunction ( `stmt` )

The abstract operation IsLabelledFunction takes argument `stmt` (a [Statement](#prod-Statement) [Parse Node](#sec-syntactic-grammar)) and returns a Boolean. It performs the following steps when called:

1.  If `stmt` is not a [LabelledStatement](#prod-LabelledStatement), return false.
2.  Let `item` be the [LabelledItem](#prod-LabelledItem) of `stmt`.
3.  If `item` is [LabelledItem](#prod-LabelledItem) : [FunctionDeclaration](#prod-FunctionDeclaration) , return true.
4.  Let `subStmt` be the [Statement](#prod-Statement) of `item`.
5.  Return [IsLabelledFunction](#sec-islabelledfunction)(`subStmt`).

### 14.13.3 Runtime Semantics: Evaluation

[LabelledStatement](#prod-LabelledStatement) : [LabelIdentifier](#prod-LabelIdentifier) : [LabelledItem](#prod-LabelledItem)

1.  Return ? [LabelledEvaluation](#sec-runtime-semantics-labelledevaluation) of this [LabelledStatement](#prod-LabelledStatement) with argument « ».

### 14.13.4 Runtime Semantics: LabelledEvaluation

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) LabelledEvaluation takes argument `labelSet` (a [List](#sec-list-and-record-specification-type) of Strings) and returns either a [normal completion containing](#sec-completion-record-specification-type) either an [ECMAScript language value](#sec-ecmascript-language-types) or empty, or an [abrupt completion](#sec-completion-record-specification-type). It is defined piecewise over the following productions:

[BreakableStatement](#prod-BreakableStatement) : [IterationStatement](#prod-IterationStatement)

1.  Let `stmtResult` be [Completion](#sec-completion-ao)([LoopEvaluation](#sec-runtime-semantics-loopevaluation) of [IterationStatement](#prod-IterationStatement) with argument `labelSet`).
2.  If `stmtResult` is a [break completion](#sec-completion-record-specification-type), then
    1.  If `stmtResult`.`[[Target]]` is empty, then
        1.  If `stmtResult`.`[[Value]]` is empty, set `stmtResult` to [NormalCompletion](#sec-normalcompletion)(undefined).
        2.  Else, set `stmtResult` to [NormalCompletion](#sec-normalcompletion)(`stmtResult`.`[[Value]]`).
3.  Return ? `stmtResult`.

[BreakableStatement](#prod-BreakableStatement) : [SwitchStatement](#prod-SwitchStatement)

1.  Let `stmtResult` be [Completion](#sec-completion-ao)([Evaluation](#sec-evaluation) of [SwitchStatement](#prod-SwitchStatement)).
2.  If `stmtResult` is a [break completion](#sec-completion-record-specification-type), then
    1.  If `stmtResult`.`[[Target]]` is empty, then
        1.  If `stmtResult`.`[[Value]]` is empty, set `stmtResult` to [NormalCompletion](#sec-normalcompletion)(undefined).
        2.  Else, set `stmtResult` to [NormalCompletion](#sec-normalcompletion)(`stmtResult`.`[[Value]]`).
3.  Return ? `stmtResult`.

Note 1

A [BreakableStatement](#prod-BreakableStatement) is one that can be exited via an unlabelled [BreakStatement](#prod-BreakStatement).

[LabelledStatement](#prod-LabelledStatement) : [LabelIdentifier](#prod-LabelIdentifier) : [LabelledItem](#prod-LabelledItem)

1.  Let `label` be the [StringValue](#sec-static-semantics-stringvalue) of [LabelIdentifier](#prod-LabelIdentifier).
2.  Let `newLabelSet` be the [list-concatenation](#list-concatenation) of `labelSet` and « `label` ».
3.  Let `stmtResult` be [Completion](#sec-completion-ao)([LabelledEvaluation](#sec-runtime-semantics-labelledevaluation) of [LabelledItem](#prod-LabelledItem) with argument `newLabelSet`).
4.  If `stmtResult` is a [break completion](#sec-completion-record-specification-type) and `stmtResult`.`[[Target]]` is `label`, then
    1.  Set `stmtResult` to [NormalCompletion](#sec-normalcompletion)(`stmtResult`.`[[Value]]`).
5.  Return ? `stmtResult`.

[LabelledItem](#prod-LabelledItem) : [FunctionDeclaration](#prod-FunctionDeclaration)

1.  Return ? [Evaluation](#sec-evaluation) of [FunctionDeclaration](#prod-FunctionDeclaration).

[Statement](#prod-Statement) : [BlockStatement](#prod-BlockStatement) [VariableStatement](#prod-VariableStatement) [EmptyStatement](#prod-EmptyStatement) [ExpressionStatement](#prod-ExpressionStatement) [IfStatement](#prod-IfStatement) [ContinueStatement](#prod-ContinueStatement) [BreakStatement](#prod-BreakStatement) [ReturnStatement](#prod-ReturnStatement) [WithStatement](#prod-WithStatement) [ThrowStatement](#prod-ThrowStatement) [TryStatement](#prod-TryStatement) [DebuggerStatement](#prod-DebuggerStatement)

1.  Return ? [Evaluation](#sec-evaluation) of [Statement](#prod-Statement).

Note 2

The only two productions of [Statement](#prod-Statement) which have special semantics for LabelledEvaluation are [BreakableStatement](#prod-BreakableStatement) and [LabelledStatement](#prod-LabelledStatement).

## 14.14 The `throw` Statement

### Syntax

[ThrowStatement](#prod-ThrowStatement)\[Yield, Await\] : throw \[no [LineTerminator](#prod-LineTerminator) here\] [Expression](#prod-Expression)\[+In, ?Yield, ?Await\] ;

### 14.14.1 Runtime Semantics: Evaluation

[ThrowStatement](#prod-ThrowStatement) : throw [Expression](#prod-Expression) ;

1.  Let `exprRef` be ? [Evaluation](#sec-evaluation) of [Expression](#prod-Expression).
2.  Let `exprValue` be ? [GetValue](#sec-getvalue)(`exprRef`).
3.  Return [ThrowCompletion](#sec-throwcompletion)(`exprValue`).

## 14.15 The `try` Statement

### Syntax

[TryStatement](#prod-TryStatement)\[Yield, Await, Return\] : try [Block](#prod-Block)\[?Yield, ?Await, ?Return\] [Catch](#prod-Catch)\[?Yield, ?Await, ?Return\] try [Block](#prod-Block)\[?Yield, ?Await, ?Return\] [Finally](#prod-Finally)\[?Yield, ?Await, ?Return\] try [Block](#prod-Block)\[?Yield, ?Await, ?Return\] [Catch](#prod-Catch)\[?Yield, ?Await, ?Return\] [Finally](#prod-Finally)\[?Yield, ?Await, ?Return\] [Catch](#prod-Catch)\[Yield, Await, Return\] : catch ( [CatchParameter](#prod-CatchParameter)\[?Yield, ?Await\] ) [Block](#prod-Block)\[?Yield, ?Await, ?Return\] catch [Block](#prod-Block)\[?Yield, ?Await, ?Return\] [Finally](#prod-Finally)\[Yield, Await, Return\] : finally [Block](#prod-Block)\[?Yield, ?Await, ?Return\] [CatchParameter](#prod-CatchParameter)\[Yield, Await\] : [BindingIdentifier](#prod-BindingIdentifier)\[?Yield, ?Await\] [BindingPattern](#prod-BindingPattern)\[?Yield, ?Await\] Note

The `try` statement encloses a block of code in which an exceptional condition can occur, such as a runtime error or a `throw` statement. The `catch` clause provides the exception-handling code. When a catch clause catches an exception, its [CatchParameter](#prod-CatchParameter) is bound to that exception.

### 14.15.1 Static Semantics: Early Errors

[Catch](#prod-Catch) : catch ( [CatchParameter](#prod-CatchParameter) ) [Block](#prod-Block)

- It is a Syntax Error if the [BoundNames](#sec-static-semantics-boundnames) of [CatchParameter](#prod-CatchParameter) contains any duplicate elements.
- It is a Syntax Error if any element of the [BoundNames](#sec-static-semantics-boundnames) of [CatchParameter](#prod-CatchParameter) also occurs in the [LexicallyDeclaredNames](#sec-static-semantics-lexicallydeclarednames) of [Block](#prod-Block).
- It is a Syntax Error if any element of the [BoundNames](#sec-static-semantics-boundnames) of [CatchParameter](#prod-CatchParameter) also occurs in the [VarDeclaredNames](#sec-static-semantics-vardeclarednames) of [Block](#prod-Block).

Note

An alternative [static semantics](#sec-static-semantic-rules) for this production is given in [B.3.4](#sec-variablestatements-in-catch-blocks).

### 14.15.2 Runtime Semantics: CatchClauseEvaluation

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) CatchClauseEvaluation takes argument `thrownValue` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) either an [ECMAScript language value](#sec-ecmascript-language-types) or empty, or an [abrupt completion](#sec-completion-record-specification-type). It is defined piecewise over the following productions:

[Catch](#prod-Catch) : catch ( [CatchParameter](#prod-CatchParameter) ) [Block](#prod-Block)

1.  Let `oldEnv` be the [running execution context](#running-execution-context)'s LexicalEnvironment.
2.  Let `catchEnv` be [NewDeclarativeEnvironment](#sec-newdeclarativeenvironment)(`oldEnv`).
3.  For each element `argName` of the [BoundNames](#sec-static-semantics-boundnames) of [CatchParameter](#prod-CatchParameter), do
    1.  Perform ! `catchEnv`.CreateMutableBinding(`argName`, false).
4.  Set the [running execution context](#running-execution-context)'s LexicalEnvironment to `catchEnv`.
5.  Let `status` be [Completion](#sec-completion-ao)([BindingInitialization](#sec-runtime-semantics-bindinginitialization) of [CatchParameter](#prod-CatchParameter) with arguments `thrownValue` and `catchEnv`).
6.  If `status` is an [abrupt completion](#sec-completion-record-specification-type), then
    1.  Set the [running execution context](#running-execution-context)'s LexicalEnvironment to `oldEnv`.
    2.  Return ? `status`.
7.  Let `B` be [Completion](#sec-completion-ao)([Evaluation](#sec-evaluation) of [Block](#prod-Block)).
8.  Set the [running execution context](#running-execution-context)'s LexicalEnvironment to `oldEnv`.
9.  Return ? `B`.

[Catch](#prod-Catch) : catch [Block](#prod-Block)

1.  Return ? [Evaluation](#sec-evaluation) of [Block](#prod-Block).

Note

No matter how control leaves the [Block](#prod-Block) the LexicalEnvironment is always restored to its former state.

### 14.15.3 Runtime Semantics: Evaluation

[TryStatement](#prod-TryStatement) : try [Block](#prod-Block) [Catch](#prod-Catch)

1.  Let `B` be [Completion](#sec-completion-ao)([Evaluation](#sec-evaluation) of [Block](#prod-Block)).
2.  If `B` is a [throw completion](#sec-completion-record-specification-type), let `C` be [Completion](#sec-completion-ao)([CatchClauseEvaluation](#sec-runtime-semantics-catchclauseevaluation) of [Catch](#prod-Catch) with argument `B`.`[[Value]]`).
3.  Else, let `C` be `B`.
4.  Return ? [UpdateEmpty](#sec-updateempty)(`C`, undefined).

[TryStatement](#prod-TryStatement) : try [Block](#prod-Block) [Finally](#prod-Finally)

1.  Let `B` be [Completion](#sec-completion-ao)([Evaluation](#sec-evaluation) of [Block](#prod-Block)).
2.  Let `F` be [Completion](#sec-completion-ao)([Evaluation](#sec-evaluation) of [Finally](#prod-Finally)).
3.  If `F` is a [normal completion](#sec-completion-record-specification-type), set `F` to `B`.
4.  Return ? [UpdateEmpty](#sec-updateempty)(`F`, undefined).

[TryStatement](#prod-TryStatement) : try [Block](#prod-Block) [Catch](#prod-Catch) [Finally](#prod-Finally)

1.  Let `B` be [Completion](#sec-completion-ao)([Evaluation](#sec-evaluation) of [Block](#prod-Block)).
2.  If `B` is a [throw completion](#sec-completion-record-specification-type), let `C` be [Completion](#sec-completion-ao)([CatchClauseEvaluation](#sec-runtime-semantics-catchclauseevaluation) of [Catch](#prod-Catch) with argument `B`.`[[Value]]`).
3.  Else, let `C` be `B`.
4.  Let `F` be [Completion](#sec-completion-ao)([Evaluation](#sec-evaluation) of [Finally](#prod-Finally)).
5.  If `F` is a [normal completion](#sec-completion-record-specification-type), set `F` to `C`.
6.  Return ? [UpdateEmpty](#sec-updateempty)(`F`, undefined).

## 14.16 The `debugger` Statement

### Syntax

[DebuggerStatement](#prod-DebuggerStatement) : debugger ;

### 14.16.1 Runtime Semantics: Evaluation

Note

Evaluating a [DebuggerStatement](#prod-DebuggerStatement) may allow an implementation to cause a breakpoint when run under a debugger. If a debugger is not present or active this statement has no observable effect.

[DebuggerStatement](#prod-DebuggerStatement) : debugger ;

1.  If an [implementation-defined](#implementation-defined) debugging facility is available and enabled, then
    1.  Perform an [implementation-defined](#implementation-defined) debugging action.
    2.  Return a new [implementation-defined](#implementation-defined) [Completion Record](#sec-completion-record-specification-type).
2.  Else,
    1.  Return empty.
