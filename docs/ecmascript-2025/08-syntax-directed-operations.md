# 8 Syntax-Directed Operations

In addition to those defined in this section, specialized [syntax-directed operations](#sec-algorithm-conventions-syntax-directed-operations) are defined throughout this specification.

## 8.1 Runtime Semantics: Evaluation

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) Evaluation takes no arguments and returns a [Completion Record](#sec-completion-record-specification-type).

Note

The definitions for this operation are distributed over the "ECMAScript Language" sections of this specification. Each definition appears after the defining occurrence of the relevant productions.

## 8.2 Scope Analysis

### 8.2.1 Static Semantics: BoundNames

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) BoundNames takes no arguments and returns a [List](#sec-list-and-record-specification-type) of Strings.

[Note](#note-star-default-star)

"\*default\*" is used within this specification as a synthetic name for a module's default export when it does not have another name. An entry in the module's `[[Environment]]` is created with that name and holds the corresponding value, and resolving the export named "default" by calling [ResolveExport ( `exportName` \[ , `resolveSet` \] )](#sec-resolveexport) for the module will return a [ResolvedBinding Record](#resolvedbinding-record) whose `[[BindingName]]` is "\*default\*", which will then resolve in the module's `[[Environment]]` to the above-mentioned value. This is done only for ease of specification, so that anonymous default exports can be resolved like any other export. This "\*default\*" string is never accessible to ECMAScript code or to the module linking algorithm.

It is defined piecewise over the following productions:

[BindingIdentifier](#prod-BindingIdentifier) : [Identifier](#prod-Identifier)

1.  Return a [List](#sec-list-and-record-specification-type) whose sole element is the [StringValue](#sec-static-semantics-stringvalue) of [Identifier](#prod-Identifier).

[BindingIdentifier](#prod-BindingIdentifier) : yield

1.  Return « "yield" ».

[BindingIdentifier](#prod-BindingIdentifier) : await

1.  Return « "await" ».

[LexicalDeclaration](#prod-LexicalDeclaration) : [LetOrConst](#prod-LetOrConst) [BindingList](#prod-BindingList) ;

1.  Return the [BoundNames](#sec-static-semantics-boundnames) of [BindingList](#prod-BindingList).

[BindingList](#prod-BindingList) : [BindingList](#prod-BindingList) , [LexicalBinding](#prod-LexicalBinding)

1.  Let `names1` be the [BoundNames](#sec-static-semantics-boundnames) of [BindingList](#prod-BindingList).
2.  Let `names2` be the [BoundNames](#sec-static-semantics-boundnames) of [LexicalBinding](#prod-LexicalBinding).
3.  Return the [list-concatenation](#list-concatenation) of `names1` and `names2`.

[LexicalBinding](#prod-LexicalBinding) : [BindingIdentifier](#prod-BindingIdentifier) [Initializer](#prod-Initializer)opt

1.  Return the [BoundNames](#sec-static-semantics-boundnames) of [BindingIdentifier](#prod-BindingIdentifier).

[LexicalBinding](#prod-LexicalBinding) : [BindingPattern](#prod-BindingPattern) [Initializer](#prod-Initializer)

1.  Return the [BoundNames](#sec-static-semantics-boundnames) of [BindingPattern](#prod-BindingPattern).

[VariableDeclarationList](#prod-VariableDeclarationList) : [VariableDeclarationList](#prod-VariableDeclarationList) , [VariableDeclaration](#prod-VariableDeclaration)

1.  Let `names1` be the [BoundNames](#sec-static-semantics-boundnames) of [VariableDeclarationList](#prod-VariableDeclarationList).
2.  Let `names2` be the [BoundNames](#sec-static-semantics-boundnames) of [VariableDeclaration](#prod-VariableDeclaration).
3.  Return the [list-concatenation](#list-concatenation) of `names1` and `names2`.

[VariableDeclaration](#prod-VariableDeclaration) : [BindingIdentifier](#prod-BindingIdentifier) [Initializer](#prod-Initializer)opt

1.  Return the [BoundNames](#sec-static-semantics-boundnames) of [BindingIdentifier](#prod-BindingIdentifier).

[VariableDeclaration](#prod-VariableDeclaration) : [BindingPattern](#prod-BindingPattern) [Initializer](#prod-Initializer)

1.  Return the [BoundNames](#sec-static-semantics-boundnames) of [BindingPattern](#prod-BindingPattern).

[ObjectBindingPattern](#prod-ObjectBindingPattern) : { }

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[ObjectBindingPattern](#prod-ObjectBindingPattern) : { [BindingPropertyList](#prod-BindingPropertyList) , [BindingRestProperty](#prod-BindingRestProperty) }

1.  Let `names1` be the [BoundNames](#sec-static-semantics-boundnames) of [BindingPropertyList](#prod-BindingPropertyList).
2.  Let `names2` be the [BoundNames](#sec-static-semantics-boundnames) of [BindingRestProperty](#prod-BindingRestProperty).
3.  Return the [list-concatenation](#list-concatenation) of `names1` and `names2`.

[ArrayBindingPattern](#prod-ArrayBindingPattern) : \[ [Elision](#prod-Elision)opt \]

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[ArrayBindingPattern](#prod-ArrayBindingPattern) : \[ [Elision](#prod-Elision)opt [BindingRestElement](#prod-BindingRestElement) \]

1.  Return the [BoundNames](#sec-static-semantics-boundnames) of [BindingRestElement](#prod-BindingRestElement).

[ArrayBindingPattern](#prod-ArrayBindingPattern) : \[ [BindingElementList](#prod-BindingElementList) , [Elision](#prod-Elision)opt \]

1.  Return the [BoundNames](#sec-static-semantics-boundnames) of [BindingElementList](#prod-BindingElementList).

[ArrayBindingPattern](#prod-ArrayBindingPattern) : \[ [BindingElementList](#prod-BindingElementList) , [Elision](#prod-Elision)opt [BindingRestElement](#prod-BindingRestElement) \]

1.  Let `names1` be the [BoundNames](#sec-static-semantics-boundnames) of [BindingElementList](#prod-BindingElementList).
2.  Let `names2` be the [BoundNames](#sec-static-semantics-boundnames) of [BindingRestElement](#prod-BindingRestElement).
3.  Return the [list-concatenation](#list-concatenation) of `names1` and `names2`.

[BindingPropertyList](#prod-BindingPropertyList) : [BindingPropertyList](#prod-BindingPropertyList) , [BindingProperty](#prod-BindingProperty)

1.  Let `names1` be the [BoundNames](#sec-static-semantics-boundnames) of [BindingPropertyList](#prod-BindingPropertyList).
2.  Let `names2` be the [BoundNames](#sec-static-semantics-boundnames) of [BindingProperty](#prod-BindingProperty).
3.  Return the [list-concatenation](#list-concatenation) of `names1` and `names2`.

[BindingElementList](#prod-BindingElementList) : [BindingElementList](#prod-BindingElementList) , [BindingElisionElement](#prod-BindingElisionElement)

1.  Let `names1` be the [BoundNames](#sec-static-semantics-boundnames) of [BindingElementList](#prod-BindingElementList).
2.  Let `names2` be the [BoundNames](#sec-static-semantics-boundnames) of [BindingElisionElement](#prod-BindingElisionElement).
3.  Return the [list-concatenation](#list-concatenation) of `names1` and `names2`.

[BindingElisionElement](#prod-BindingElisionElement) : [Elision](#prod-Elision)opt [BindingElement](#prod-BindingElement)

1.  Return the [BoundNames](#sec-static-semantics-boundnames) of [BindingElement](#prod-BindingElement).

[BindingProperty](#prod-BindingProperty) : [PropertyName](#prod-PropertyName) : [BindingElement](#prod-BindingElement)

1.  Return the [BoundNames](#sec-static-semantics-boundnames) of [BindingElement](#prod-BindingElement).

[SingleNameBinding](#prod-SingleNameBinding) : [BindingIdentifier](#prod-BindingIdentifier) [Initializer](#prod-Initializer)opt

1.  Return the [BoundNames](#sec-static-semantics-boundnames) of [BindingIdentifier](#prod-BindingIdentifier).

[BindingElement](#prod-BindingElement) : [BindingPattern](#prod-BindingPattern) [Initializer](#prod-Initializer)opt

1.  Return the [BoundNames](#sec-static-semantics-boundnames) of [BindingPattern](#prod-BindingPattern).

[ForDeclaration](#prod-ForDeclaration) : [LetOrConst](#prod-LetOrConst) [ForBinding](#prod-ForBinding)

1.  Return the [BoundNames](#sec-static-semantics-boundnames) of [ForBinding](#prod-ForBinding).

[FunctionDeclaration](#prod-FunctionDeclaration) : function [BindingIdentifier](#prod-BindingIdentifier) ( [FormalParameters](#prod-FormalParameters) ) { [FunctionBody](#prod-FunctionBody) }

1.  Return the [BoundNames](#sec-static-semantics-boundnames) of [BindingIdentifier](#prod-BindingIdentifier).

[FunctionDeclaration](#prod-FunctionDeclaration) : function ( [FormalParameters](#prod-FormalParameters) ) { [FunctionBody](#prod-FunctionBody) }

1.  Return « "\*default\*" ».

[FormalParameters](#prod-FormalParameters) : \[empty\]

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[FormalParameters](#prod-FormalParameters) : [FormalParameterList](#prod-FormalParameterList) , [FunctionRestParameter](#prod-FunctionRestParameter)

1.  Let `names1` be the [BoundNames](#sec-static-semantics-boundnames) of [FormalParameterList](#prod-FormalParameterList).
2.  Let `names2` be the [BoundNames](#sec-static-semantics-boundnames) of [FunctionRestParameter](#prod-FunctionRestParameter).
3.  Return the [list-concatenation](#list-concatenation) of `names1` and `names2`.

[FormalParameterList](#prod-FormalParameterList) : [FormalParameterList](#prod-FormalParameterList) , [FormalParameter](#prod-FormalParameter)

1.  Let `names1` be the [BoundNames](#sec-static-semantics-boundnames) of [FormalParameterList](#prod-FormalParameterList).
2.  Let `names2` be the [BoundNames](#sec-static-semantics-boundnames) of [FormalParameter](#prod-FormalParameter).
3.  Return the [list-concatenation](#list-concatenation) of `names1` and `names2`.

[ArrowParameters](#prod-ArrowParameters) : [CoverParenthesizedExpressionAndArrowParameterList](#prod-CoverParenthesizedExpressionAndArrowParameterList)

1.  Let `formals` be the [ArrowFormalParameters](#prod-ArrowFormalParameters) that is [covered](#sec-syntactic-grammar) by [CoverParenthesizedExpressionAndArrowParameterList](#prod-CoverParenthesizedExpressionAndArrowParameterList).
2.  Return the [BoundNames](#sec-static-semantics-boundnames) of `formals`.

[GeneratorDeclaration](#prod-GeneratorDeclaration) : function \* [BindingIdentifier](#prod-BindingIdentifier) ( [FormalParameters](#prod-FormalParameters) ) { [GeneratorBody](#prod-GeneratorBody) }

1.  Return the [BoundNames](#sec-static-semantics-boundnames) of [BindingIdentifier](#prod-BindingIdentifier).

[GeneratorDeclaration](#prod-GeneratorDeclaration) : function \* ( [FormalParameters](#prod-FormalParameters) ) { [GeneratorBody](#prod-GeneratorBody) }

1.  Return « "\*default\*" ».

[AsyncGeneratorDeclaration](#prod-AsyncGeneratorDeclaration) : async function \* [BindingIdentifier](#prod-BindingIdentifier) ( [FormalParameters](#prod-FormalParameters) ) { [AsyncGeneratorBody](#prod-AsyncGeneratorBody) }

1.  Return the [BoundNames](#sec-static-semantics-boundnames) of [BindingIdentifier](#prod-BindingIdentifier).

[AsyncGeneratorDeclaration](#prod-AsyncGeneratorDeclaration) : async function \* ( [FormalParameters](#prod-FormalParameters) ) { [AsyncGeneratorBody](#prod-AsyncGeneratorBody) }

1.  Return « "\*default\*" ».

[ClassDeclaration](#prod-ClassDeclaration) : class [BindingIdentifier](#prod-BindingIdentifier) [ClassTail](#prod-ClassTail)

1.  Return the [BoundNames](#sec-static-semantics-boundnames) of [BindingIdentifier](#prod-BindingIdentifier).

[ClassDeclaration](#prod-ClassDeclaration) : class [ClassTail](#prod-ClassTail)

1.  Return « "\*default\*" ».

[AsyncFunctionDeclaration](#prod-AsyncFunctionDeclaration) : async function [BindingIdentifier](#prod-BindingIdentifier) ( [FormalParameters](#prod-FormalParameters) ) { [AsyncFunctionBody](#prod-AsyncFunctionBody) }

1.  Return the [BoundNames](#sec-static-semantics-boundnames) of [BindingIdentifier](#prod-BindingIdentifier).

[AsyncFunctionDeclaration](#prod-AsyncFunctionDeclaration) : async function ( [FormalParameters](#prod-FormalParameters) ) { [AsyncFunctionBody](#prod-AsyncFunctionBody) }

1.  Return « "\*default\*" ».

[CoverCallExpressionAndAsyncArrowHead](#prod-CoverCallExpressionAndAsyncArrowHead) : [MemberExpression](#prod-MemberExpression) [Arguments](#prod-Arguments)

1.  Let `head` be the [AsyncArrowHead](#prod-AsyncArrowHead) that is [covered](#sec-syntactic-grammar) by [CoverCallExpressionAndAsyncArrowHead](#prod-CoverCallExpressionAndAsyncArrowHead).
2.  Return the [BoundNames](#sec-static-semantics-boundnames) of `head`.

[ImportDeclaration](#prod-ImportDeclaration) : import [ImportClause](#prod-ImportClause) [FromClause](#prod-FromClause) [WithClause](#prod-WithClause)opt ;

1.  Return the [BoundNames](#sec-static-semantics-boundnames) of [ImportClause](#prod-ImportClause).

[ImportDeclaration](#prod-ImportDeclaration) : import [ModuleSpecifier](#prod-ModuleSpecifier) [WithClause](#prod-WithClause)opt ;

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[ImportClause](#prod-ImportClause) : [ImportedDefaultBinding](#prod-ImportedDefaultBinding) , [NameSpaceImport](#prod-NameSpaceImport)

1.  Let `names1` be the [BoundNames](#sec-static-semantics-boundnames) of [ImportedDefaultBinding](#prod-ImportedDefaultBinding).
2.  Let `names2` be the [BoundNames](#sec-static-semantics-boundnames) of [NameSpaceImport](#prod-NameSpaceImport).
3.  Return the [list-concatenation](#list-concatenation) of `names1` and `names2`.

[ImportClause](#prod-ImportClause) : [ImportedDefaultBinding](#prod-ImportedDefaultBinding) , [NamedImports](#prod-NamedImports)

1.  Let `names1` be the [BoundNames](#sec-static-semantics-boundnames) of [ImportedDefaultBinding](#prod-ImportedDefaultBinding).
2.  Let `names2` be the [BoundNames](#sec-static-semantics-boundnames) of [NamedImports](#prod-NamedImports).
3.  Return the [list-concatenation](#list-concatenation) of `names1` and `names2`.

[NamedImports](#prod-NamedImports) : { }

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[ImportsList](#prod-ImportsList) : [ImportsList](#prod-ImportsList) , [ImportSpecifier](#prod-ImportSpecifier)

1.  Let `names1` be the [BoundNames](#sec-static-semantics-boundnames) of [ImportsList](#prod-ImportsList).
2.  Let `names2` be the [BoundNames](#sec-static-semantics-boundnames) of [ImportSpecifier](#prod-ImportSpecifier).
3.  Return the [list-concatenation](#list-concatenation) of `names1` and `names2`.

[ImportSpecifier](#prod-ImportSpecifier) : [ModuleExportName](#prod-ModuleExportName) as [ImportedBinding](#prod-ImportedBinding)

1.  Return the [BoundNames](#sec-static-semantics-boundnames) of [ImportedBinding](#prod-ImportedBinding).

[ExportDeclaration](#prod-ExportDeclaration) : export [ExportFromClause](#prod-ExportFromClause) [FromClause](#prod-FromClause) [WithClause](#prod-WithClause)opt ; export [NamedExports](#prod-NamedExports) ;

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[ExportDeclaration](#prod-ExportDeclaration) : export [VariableStatement](#prod-VariableStatement)

1.  Return the [BoundNames](#sec-static-semantics-boundnames) of [VariableStatement](#prod-VariableStatement).

[ExportDeclaration](#prod-ExportDeclaration) : export [Declaration](#prod-Declaration)

1.  Return the [BoundNames](#sec-static-semantics-boundnames) of [Declaration](#prod-Declaration).

[ExportDeclaration](#prod-ExportDeclaration) : export default [HoistableDeclaration](#prod-HoistableDeclaration)

1.  Let `declarationNames` be the [BoundNames](#sec-static-semantics-boundnames) of [HoistableDeclaration](#prod-HoistableDeclaration).
2.  If `declarationNames` does not include the element "\*default\*", append "\*default\*" to `declarationNames`.
3.  Return `declarationNames`.

[ExportDeclaration](#prod-ExportDeclaration) : export default [ClassDeclaration](#prod-ClassDeclaration)

1.  Let `declarationNames` be the [BoundNames](#sec-static-semantics-boundnames) of [ClassDeclaration](#prod-ClassDeclaration).
2.  If `declarationNames` does not include the element "\*default\*", append "\*default\*" to `declarationNames`.
3.  Return `declarationNames`.

[ExportDeclaration](#prod-ExportDeclaration) : export default [AssignmentExpression](#prod-AssignmentExpression) ;

1.  Return « "\*default\*" ».

### 8.2.2 Static Semantics: DeclarationPart

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) DeclarationPart takes no arguments and returns a [Parse Node](#sec-syntactic-grammar). It is defined piecewise over the following productions:

[HoistableDeclaration](#prod-HoistableDeclaration) : [FunctionDeclaration](#prod-FunctionDeclaration)

1.  Return [FunctionDeclaration](#prod-FunctionDeclaration).

[HoistableDeclaration](#prod-HoistableDeclaration) : [GeneratorDeclaration](#prod-GeneratorDeclaration)

1.  Return [GeneratorDeclaration](#prod-GeneratorDeclaration).

[HoistableDeclaration](#prod-HoistableDeclaration) : [AsyncFunctionDeclaration](#prod-AsyncFunctionDeclaration)

1.  Return [AsyncFunctionDeclaration](#prod-AsyncFunctionDeclaration).

[HoistableDeclaration](#prod-HoistableDeclaration) : [AsyncGeneratorDeclaration](#prod-AsyncGeneratorDeclaration)

1.  Return [AsyncGeneratorDeclaration](#prod-AsyncGeneratorDeclaration).

[Declaration](#prod-Declaration) : [ClassDeclaration](#prod-ClassDeclaration)

1.  Return [ClassDeclaration](#prod-ClassDeclaration).

[Declaration](#prod-Declaration) : [LexicalDeclaration](#prod-LexicalDeclaration)

1.  Return [LexicalDeclaration](#prod-LexicalDeclaration).

### 8.2.3 Static Semantics: IsConstantDeclaration

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) IsConstantDeclaration takes no arguments and returns a Boolean. It is defined piecewise over the following productions:

[LexicalDeclaration](#prod-LexicalDeclaration) : [LetOrConst](#prod-LetOrConst) [BindingList](#prod-BindingList) ;

1.  Return [IsConstantDeclaration](#sec-static-semantics-isconstantdeclaration) of [LetOrConst](#prod-LetOrConst).

[LetOrConst](#prod-LetOrConst) : let

1.  Return false.

[LetOrConst](#prod-LetOrConst) : const

1.  Return true.

[FunctionDeclaration](#prod-FunctionDeclaration) : function [BindingIdentifier](#prod-BindingIdentifier) ( [FormalParameters](#prod-FormalParameters) ) { [FunctionBody](#prod-FunctionBody) } function ( [FormalParameters](#prod-FormalParameters) ) { [FunctionBody](#prod-FunctionBody) } [GeneratorDeclaration](#prod-GeneratorDeclaration) : function \* [BindingIdentifier](#prod-BindingIdentifier) ( [FormalParameters](#prod-FormalParameters) ) { [GeneratorBody](#prod-GeneratorBody) } function \* ( [FormalParameters](#prod-FormalParameters) ) { [GeneratorBody](#prod-GeneratorBody) } [AsyncGeneratorDeclaration](#prod-AsyncGeneratorDeclaration) : async function \* [BindingIdentifier](#prod-BindingIdentifier) ( [FormalParameters](#prod-FormalParameters) ) { [AsyncGeneratorBody](#prod-AsyncGeneratorBody) } async function \* ( [FormalParameters](#prod-FormalParameters) ) { [AsyncGeneratorBody](#prod-AsyncGeneratorBody) } [AsyncFunctionDeclaration](#prod-AsyncFunctionDeclaration) : async function [BindingIdentifier](#prod-BindingIdentifier) ( [FormalParameters](#prod-FormalParameters) ) { [AsyncFunctionBody](#prod-AsyncFunctionBody) } async function ( [FormalParameters](#prod-FormalParameters) ) { [AsyncFunctionBody](#prod-AsyncFunctionBody) }

1.  Return false.

[ClassDeclaration](#prod-ClassDeclaration) : class [BindingIdentifier](#prod-BindingIdentifier) [ClassTail](#prod-ClassTail) class [ClassTail](#prod-ClassTail)

1.  Return false.

[ExportDeclaration](#prod-ExportDeclaration) : export [ExportFromClause](#prod-ExportFromClause) [FromClause](#prod-FromClause) ; export [NamedExports](#prod-NamedExports) ; export default [AssignmentExpression](#prod-AssignmentExpression) ;

1.  Return false.

Note

It is not necessary to treat `export default` [AssignmentExpression](#prod-AssignmentExpression) as a constant declaration because there is no syntax that permits assignment to the internal bound name used to reference a module's default object.

### 8.2.4 Static Semantics: LexicallyDeclaredNames

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) LexicallyDeclaredNames takes no arguments and returns a [List](#sec-list-and-record-specification-type) of Strings. It is defined piecewise over the following productions:

[Block](#prod-Block) : { }

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[StatementList](#prod-StatementList) : [StatementList](#prod-StatementList) [StatementListItem](#prod-StatementListItem)

1.  Let `names1` be the [LexicallyDeclaredNames](#sec-static-semantics-lexicallydeclarednames) of [StatementList](#prod-StatementList).
2.  Let `names2` be the [LexicallyDeclaredNames](#sec-static-semantics-lexicallydeclarednames) of [StatementListItem](#prod-StatementListItem).
3.  Return the [list-concatenation](#list-concatenation) of `names1` and `names2`.

[StatementListItem](#prod-StatementListItem) : [Statement](#prod-Statement)

1.  If [Statement](#prod-Statement) is [Statement](#prod-Statement) : [LabelledStatement](#prod-LabelledStatement) , return the [LexicallyDeclaredNames](#sec-static-semantics-lexicallydeclarednames) of [LabelledStatement](#prod-LabelledStatement).
2.  Return a new empty [List](#sec-list-and-record-specification-type).

[StatementListItem](#prod-StatementListItem) : [Declaration](#prod-Declaration)

1.  Return the [BoundNames](#sec-static-semantics-boundnames) of [Declaration](#prod-Declaration).

[CaseBlock](#prod-CaseBlock) : { }

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[CaseBlock](#prod-CaseBlock) : { [CaseClauses](#prod-CaseClauses)opt [DefaultClause](#prod-DefaultClause) [CaseClauses](#prod-CaseClauses)opt }

1.  If the first [CaseClauses](#prod-CaseClauses) is present, let `names1` be the [LexicallyDeclaredNames](#sec-static-semantics-lexicallydeclarednames) of the first [CaseClauses](#prod-CaseClauses).
2.  Else, let `names1` be a new empty [List](#sec-list-and-record-specification-type).
3.  Let `names2` be the [LexicallyDeclaredNames](#sec-static-semantics-lexicallydeclarednames) of [DefaultClause](#prod-DefaultClause).
4.  If the second [CaseClauses](#prod-CaseClauses) is present, let `names3` be the [LexicallyDeclaredNames](#sec-static-semantics-lexicallydeclarednames) of the second [CaseClauses](#prod-CaseClauses).
5.  Else, let `names3` be a new empty [List](#sec-list-and-record-specification-type).
6.  Return the [list-concatenation](#list-concatenation) of `names1`, `names2`, and `names3`.

[CaseClauses](#prod-CaseClauses) : [CaseClauses](#prod-CaseClauses) [CaseClause](#prod-CaseClause)

1.  Let `names1` be the [LexicallyDeclaredNames](#sec-static-semantics-lexicallydeclarednames) of [CaseClauses](#prod-CaseClauses).
2.  Let `names2` be the [LexicallyDeclaredNames](#sec-static-semantics-lexicallydeclarednames) of [CaseClause](#prod-CaseClause).
3.  Return the [list-concatenation](#list-concatenation) of `names1` and `names2`.

[CaseClause](#prod-CaseClause) : case [Expression](#prod-Expression) : [StatementList](#prod-StatementList)opt

1.  If the [StatementList](#prod-StatementList) is present, return the [LexicallyDeclaredNames](#sec-static-semantics-lexicallydeclarednames) of [StatementList](#prod-StatementList).
2.  Return a new empty [List](#sec-list-and-record-specification-type).

[DefaultClause](#prod-DefaultClause) : default : [StatementList](#prod-StatementList)opt

1.  If the [StatementList](#prod-StatementList) is present, return the [LexicallyDeclaredNames](#sec-static-semantics-lexicallydeclarednames) of [StatementList](#prod-StatementList).
2.  Return a new empty [List](#sec-list-and-record-specification-type).

[LabelledStatement](#prod-LabelledStatement) : [LabelIdentifier](#prod-LabelIdentifier) : [LabelledItem](#prod-LabelledItem)

1.  Return the [LexicallyDeclaredNames](#sec-static-semantics-lexicallydeclarednames) of [LabelledItem](#prod-LabelledItem).

[LabelledItem](#prod-LabelledItem) : [Statement](#prod-Statement)

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[LabelledItem](#prod-LabelledItem) : [FunctionDeclaration](#prod-FunctionDeclaration)

1.  Return the [BoundNames](#sec-static-semantics-boundnames) of [FunctionDeclaration](#prod-FunctionDeclaration).

[FunctionStatementList](#prod-FunctionStatementList) : \[empty\]

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[FunctionStatementList](#prod-FunctionStatementList) : [StatementList](#prod-StatementList)

1.  Return the [TopLevelLexicallyDeclaredNames](#sec-static-semantics-toplevellexicallydeclarednames) of [StatementList](#prod-StatementList).

[ClassStaticBlockStatementList](#prod-ClassStaticBlockStatementList) : \[empty\]

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[ClassStaticBlockStatementList](#prod-ClassStaticBlockStatementList) : [StatementList](#prod-StatementList)

1.  Return the [TopLevelLexicallyDeclaredNames](#sec-static-semantics-toplevellexicallydeclarednames) of [StatementList](#prod-StatementList).

[ConciseBody](#prod-ConciseBody) : [ExpressionBody](#prod-ExpressionBody)

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[AsyncConciseBody](#prod-AsyncConciseBody) : [ExpressionBody](#prod-ExpressionBody)

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[Script](#prod-Script) : \[empty\]

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[ScriptBody](#prod-ScriptBody) : [StatementList](#prod-StatementList)

1.  Return the [TopLevelLexicallyDeclaredNames](#sec-static-semantics-toplevellexicallydeclarednames) of [StatementList](#prod-StatementList).

Note 1

At the top level of a [Script](#prod-Script), function declarations are treated like var declarations rather than like lexical declarations.

Note 2

The LexicallyDeclaredNames of a [Module](#prod-Module) includes the names of all of its imported bindings.

[ModuleItemList](#prod-ModuleItemList) : [ModuleItemList](#prod-ModuleItemList) [ModuleItem](#prod-ModuleItem)

1.  Let `names1` be the [LexicallyDeclaredNames](#sec-static-semantics-lexicallydeclarednames) of [ModuleItemList](#prod-ModuleItemList).
2.  Let `names2` be the [LexicallyDeclaredNames](#sec-static-semantics-lexicallydeclarednames) of [ModuleItem](#prod-ModuleItem).
3.  Return the [list-concatenation](#list-concatenation) of `names1` and `names2`.

[ModuleItem](#prod-ModuleItem) : [ImportDeclaration](#prod-ImportDeclaration)

1.  Return the [BoundNames](#sec-static-semantics-boundnames) of [ImportDeclaration](#prod-ImportDeclaration).

[ModuleItem](#prod-ModuleItem) : [ExportDeclaration](#prod-ExportDeclaration)

1.  If [ExportDeclaration](#prod-ExportDeclaration) is `export` [VariableStatement](#prod-VariableStatement), return a new empty [List](#sec-list-and-record-specification-type).
2.  Return the [BoundNames](#sec-static-semantics-boundnames) of [ExportDeclaration](#prod-ExportDeclaration).

[ModuleItem](#prod-ModuleItem) : [StatementListItem](#prod-StatementListItem)

1.  Return the [LexicallyDeclaredNames](#sec-static-semantics-lexicallydeclarednames) of [StatementListItem](#prod-StatementListItem).

Note 3

At the top level of a [Module](#prod-Module), function declarations are treated like lexical declarations rather than like var declarations.

### 8.2.5 Static Semantics: LexicallyScopedDeclarations

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) LexicallyScopedDeclarations takes no arguments and returns a [List](#sec-list-and-record-specification-type) of [Parse Nodes](#sec-syntactic-grammar). It is defined piecewise over the following productions:

[StatementList](#prod-StatementList) : [StatementList](#prod-StatementList) [StatementListItem](#prod-StatementListItem)

1.  Let `declarations1` be the [LexicallyScopedDeclarations](#sec-static-semantics-lexicallyscopeddeclarations) of [StatementList](#prod-StatementList).
2.  Let `declarations2` be the [LexicallyScopedDeclarations](#sec-static-semantics-lexicallyscopeddeclarations) of [StatementListItem](#prod-StatementListItem).
3.  Return the [list-concatenation](#list-concatenation) of `declarations1` and `declarations2`.

[StatementListItem](#prod-StatementListItem) : [Statement](#prod-Statement)

1.  If [Statement](#prod-Statement) is [Statement](#prod-Statement) : [LabelledStatement](#prod-LabelledStatement) , return the [LexicallyScopedDeclarations](#sec-static-semantics-lexicallyscopeddeclarations) of [LabelledStatement](#prod-LabelledStatement).
2.  Return a new empty [List](#sec-list-and-record-specification-type).

[StatementListItem](#prod-StatementListItem) : [Declaration](#prod-Declaration)

1.  Return a [List](#sec-list-and-record-specification-type) whose sole element is the [DeclarationPart](#sec-static-semantics-declarationpart) of [Declaration](#prod-Declaration).

[CaseBlock](#prod-CaseBlock) : { }

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[CaseBlock](#prod-CaseBlock) : { [CaseClauses](#prod-CaseClauses)opt [DefaultClause](#prod-DefaultClause) [CaseClauses](#prod-CaseClauses)opt }

1.  If the first [CaseClauses](#prod-CaseClauses) is present, let `declarations1` be the [LexicallyScopedDeclarations](#sec-static-semantics-lexicallyscopeddeclarations) of the first [CaseClauses](#prod-CaseClauses).
2.  Else, let `declarations1` be a new empty [List](#sec-list-and-record-specification-type).
3.  Let `declarations2` be the [LexicallyScopedDeclarations](#sec-static-semantics-lexicallyscopeddeclarations) of [DefaultClause](#prod-DefaultClause).
4.  If the second [CaseClauses](#prod-CaseClauses) is present, let `declarations3` be the [LexicallyScopedDeclarations](#sec-static-semantics-lexicallyscopeddeclarations) of the second [CaseClauses](#prod-CaseClauses).
5.  Else, let `declarations3` be a new empty [List](#sec-list-and-record-specification-type).
6.  Return the [list-concatenation](#list-concatenation) of `declarations1`, `declarations2`, and `declarations3`.

[CaseClauses](#prod-CaseClauses) : [CaseClauses](#prod-CaseClauses) [CaseClause](#prod-CaseClause)

1.  Let `declarations1` be the [LexicallyScopedDeclarations](#sec-static-semantics-lexicallyscopeddeclarations) of [CaseClauses](#prod-CaseClauses).
2.  Let `declarations2` be the [LexicallyScopedDeclarations](#sec-static-semantics-lexicallyscopeddeclarations) of [CaseClause](#prod-CaseClause).
3.  Return the [list-concatenation](#list-concatenation) of `declarations1` and `declarations2`.

[CaseClause](#prod-CaseClause) : case [Expression](#prod-Expression) : [StatementList](#prod-StatementList)opt

1.  If the [StatementList](#prod-StatementList) is present, return the [LexicallyScopedDeclarations](#sec-static-semantics-lexicallyscopeddeclarations) of [StatementList](#prod-StatementList).
2.  Return a new empty [List](#sec-list-and-record-specification-type).

[DefaultClause](#prod-DefaultClause) : default : [StatementList](#prod-StatementList)opt

1.  If the [StatementList](#prod-StatementList) is present, return the [LexicallyScopedDeclarations](#sec-static-semantics-lexicallyscopeddeclarations) of [StatementList](#prod-StatementList).
2.  Return a new empty [List](#sec-list-and-record-specification-type).

[LabelledStatement](#prod-LabelledStatement) : [LabelIdentifier](#prod-LabelIdentifier) : [LabelledItem](#prod-LabelledItem)

1.  Return the [LexicallyScopedDeclarations](#sec-static-semantics-lexicallyscopeddeclarations) of [LabelledItem](#prod-LabelledItem).

[LabelledItem](#prod-LabelledItem) : [Statement](#prod-Statement)

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[LabelledItem](#prod-LabelledItem) : [FunctionDeclaration](#prod-FunctionDeclaration)

1.  Return « [FunctionDeclaration](#prod-FunctionDeclaration) ».

[FunctionStatementList](#prod-FunctionStatementList) : \[empty\]

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[FunctionStatementList](#prod-FunctionStatementList) : [StatementList](#prod-StatementList)

1.  Return the [TopLevelLexicallyScopedDeclarations](#sec-static-semantics-toplevellexicallyscopeddeclarations) of [StatementList](#prod-StatementList).

[ClassStaticBlockStatementList](#prod-ClassStaticBlockStatementList) : \[empty\]

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[ClassStaticBlockStatementList](#prod-ClassStaticBlockStatementList) : [StatementList](#prod-StatementList)

1.  Return the [TopLevelLexicallyScopedDeclarations](#sec-static-semantics-toplevellexicallyscopeddeclarations) of [StatementList](#prod-StatementList).

[ConciseBody](#prod-ConciseBody) : [ExpressionBody](#prod-ExpressionBody)

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[AsyncConciseBody](#prod-AsyncConciseBody) : [ExpressionBody](#prod-ExpressionBody)

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[Script](#prod-Script) : \[empty\]

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[ScriptBody](#prod-ScriptBody) : [StatementList](#prod-StatementList)

1.  Return the [TopLevelLexicallyScopedDeclarations](#sec-static-semantics-toplevellexicallyscopeddeclarations) of [StatementList](#prod-StatementList).

[Module](#prod-Module) : \[empty\]

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[ModuleItemList](#prod-ModuleItemList) : [ModuleItemList](#prod-ModuleItemList) [ModuleItem](#prod-ModuleItem)

1.  Let `declarations1` be the [LexicallyScopedDeclarations](#sec-static-semantics-lexicallyscopeddeclarations) of [ModuleItemList](#prod-ModuleItemList).
2.  Let `declarations2` be the [LexicallyScopedDeclarations](#sec-static-semantics-lexicallyscopeddeclarations) of [ModuleItem](#prod-ModuleItem).
3.  Return the [list-concatenation](#list-concatenation) of `declarations1` and `declarations2`.

[ModuleItem](#prod-ModuleItem) : [ImportDeclaration](#prod-ImportDeclaration)

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[ExportDeclaration](#prod-ExportDeclaration) : export [ExportFromClause](#prod-ExportFromClause) [FromClause](#prod-FromClause) [WithClause](#prod-WithClause)opt ; export [NamedExports](#prod-NamedExports) ; export [VariableStatement](#prod-VariableStatement)

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[ExportDeclaration](#prod-ExportDeclaration) : export [Declaration](#prod-Declaration)

1.  Return a [List](#sec-list-and-record-specification-type) whose sole element is the [DeclarationPart](#sec-static-semantics-declarationpart) of [Declaration](#prod-Declaration).

[ExportDeclaration](#prod-ExportDeclaration) : export default [HoistableDeclaration](#prod-HoistableDeclaration)

1.  Return a [List](#sec-list-and-record-specification-type) whose sole element is the [DeclarationPart](#sec-static-semantics-declarationpart) of [HoistableDeclaration](#prod-HoistableDeclaration).

[ExportDeclaration](#prod-ExportDeclaration) : export default [ClassDeclaration](#prod-ClassDeclaration)

1.  Return a [List](#sec-list-and-record-specification-type) whose sole element is [ClassDeclaration](#prod-ClassDeclaration).

[ExportDeclaration](#prod-ExportDeclaration) : export default [AssignmentExpression](#prod-AssignmentExpression) ;

1.  Return a [List](#sec-list-and-record-specification-type) whose sole element is this [ExportDeclaration](#prod-ExportDeclaration).

### 8.2.6 Static Semantics: VarDeclaredNames

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) VarDeclaredNames takes no arguments and returns a [List](#sec-list-and-record-specification-type) of Strings. It is defined piecewise over the following productions:

[Statement](#prod-Statement) : [EmptyStatement](#prod-EmptyStatement) [ExpressionStatement](#prod-ExpressionStatement) [ContinueStatement](#prod-ContinueStatement) [BreakStatement](#prod-BreakStatement) [ReturnStatement](#prod-ReturnStatement) [ThrowStatement](#prod-ThrowStatement) [DebuggerStatement](#prod-DebuggerStatement)

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[Block](#prod-Block) : { }

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[StatementList](#prod-StatementList) : [StatementList](#prod-StatementList) [StatementListItem](#prod-StatementListItem)

1.  Let `names1` be the [VarDeclaredNames](#sec-static-semantics-vardeclarednames) of [StatementList](#prod-StatementList).
2.  Let `names2` be the [VarDeclaredNames](#sec-static-semantics-vardeclarednames) of [StatementListItem](#prod-StatementListItem).
3.  Return the [list-concatenation](#list-concatenation) of `names1` and `names2`.

[StatementListItem](#prod-StatementListItem) : [Declaration](#prod-Declaration)

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[VariableStatement](#prod-VariableStatement) : var [VariableDeclarationList](#prod-VariableDeclarationList) ;

1.  Return the [BoundNames](#sec-static-semantics-boundnames) of [VariableDeclarationList](#prod-VariableDeclarationList).

[IfStatement](#prod-IfStatement) : if ( [Expression](#prod-Expression) ) [Statement](#prod-Statement) else [Statement](#prod-Statement)

1.  Let `names1` be the [VarDeclaredNames](#sec-static-semantics-vardeclarednames) of the first [Statement](#prod-Statement).
2.  Let `names2` be the [VarDeclaredNames](#sec-static-semantics-vardeclarednames) of the second [Statement](#prod-Statement).
3.  Return the [list-concatenation](#list-concatenation) of `names1` and `names2`.

[IfStatement](#prod-IfStatement) : if ( [Expression](#prod-Expression) ) [Statement](#prod-Statement)

1.  Return the [VarDeclaredNames](#sec-static-semantics-vardeclarednames) of [Statement](#prod-Statement).

[DoWhileStatement](#prod-DoWhileStatement) : do [Statement](#prod-Statement) while ( [Expression](#prod-Expression) ) ;

1.  Return the [VarDeclaredNames](#sec-static-semantics-vardeclarednames) of [Statement](#prod-Statement).

[WhileStatement](#prod-WhileStatement) : while ( [Expression](#prod-Expression) ) [Statement](#prod-Statement)

1.  Return the [VarDeclaredNames](#sec-static-semantics-vardeclarednames) of [Statement](#prod-Statement).

[ForStatement](#prod-ForStatement) : for ( [Expression](#prod-Expression)opt ; [Expression](#prod-Expression)opt ; [Expression](#prod-Expression)opt ) [Statement](#prod-Statement)

1.  Return the [VarDeclaredNames](#sec-static-semantics-vardeclarednames) of [Statement](#prod-Statement).

[ForStatement](#prod-ForStatement) : for ( var [VariableDeclarationList](#prod-VariableDeclarationList) ; [Expression](#prod-Expression)opt ; [Expression](#prod-Expression)opt ) [Statement](#prod-Statement)

1.  Let `names1` be the [BoundNames](#sec-static-semantics-boundnames) of [VariableDeclarationList](#prod-VariableDeclarationList).
2.  Let `names2` be the [VarDeclaredNames](#sec-static-semantics-vardeclarednames) of [Statement](#prod-Statement).
3.  Return the [list-concatenation](#list-concatenation) of `names1` and `names2`.

[ForStatement](#prod-ForStatement) : for ( [LexicalDeclaration](#prod-LexicalDeclaration) [Expression](#prod-Expression)opt ; [Expression](#prod-Expression)opt ) [Statement](#prod-Statement)

1.  Return the [VarDeclaredNames](#sec-static-semantics-vardeclarednames) of [Statement](#prod-Statement).

[ForInOfStatement](#prod-ForInOfStatement) : for ( [LeftHandSideExpression](#prod-LeftHandSideExpression) in [Expression](#prod-Expression) ) [Statement](#prod-Statement) for ( [ForDeclaration](#prod-ForDeclaration) in [Expression](#prod-Expression) ) [Statement](#prod-Statement) for ( [LeftHandSideExpression](#prod-LeftHandSideExpression) of [AssignmentExpression](#prod-AssignmentExpression) ) [Statement](#prod-Statement) for ( [ForDeclaration](#prod-ForDeclaration) of [AssignmentExpression](#prod-AssignmentExpression) ) [Statement](#prod-Statement) for await ( [LeftHandSideExpression](#prod-LeftHandSideExpression) of [AssignmentExpression](#prod-AssignmentExpression) ) [Statement](#prod-Statement) for await ( [ForDeclaration](#prod-ForDeclaration) of [AssignmentExpression](#prod-AssignmentExpression) ) [Statement](#prod-Statement)

1.  Return the [VarDeclaredNames](#sec-static-semantics-vardeclarednames) of [Statement](#prod-Statement).

[ForInOfStatement](#prod-ForInOfStatement) : for ( var [ForBinding](#prod-ForBinding) in [Expression](#prod-Expression) ) [Statement](#prod-Statement) for ( var [ForBinding](#prod-ForBinding) of [AssignmentExpression](#prod-AssignmentExpression) ) [Statement](#prod-Statement) for await ( var [ForBinding](#prod-ForBinding) of [AssignmentExpression](#prod-AssignmentExpression) ) [Statement](#prod-Statement)

1.  Let `names1` be the [BoundNames](#sec-static-semantics-boundnames) of [ForBinding](#prod-ForBinding).
2.  Let `names2` be the [VarDeclaredNames](#sec-static-semantics-vardeclarednames) of [Statement](#prod-Statement).
3.  Return the [list-concatenation](#list-concatenation) of `names1` and `names2`.

Note

This section is extended by Annex [B.3.5](#sec-initializers-in-forin-statement-heads).

[WithStatement](#prod-WithStatement) : with ( [Expression](#prod-Expression) ) [Statement](#prod-Statement)

1.  Return the [VarDeclaredNames](#sec-static-semantics-vardeclarednames) of [Statement](#prod-Statement).

[SwitchStatement](#prod-SwitchStatement) : switch ( [Expression](#prod-Expression) ) [CaseBlock](#prod-CaseBlock)

1.  Return the [VarDeclaredNames](#sec-static-semantics-vardeclarednames) of [CaseBlock](#prod-CaseBlock).

[CaseBlock](#prod-CaseBlock) : { }

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[CaseBlock](#prod-CaseBlock) : { [CaseClauses](#prod-CaseClauses)opt [DefaultClause](#prod-DefaultClause) [CaseClauses](#prod-CaseClauses)opt }

1.  If the first [CaseClauses](#prod-CaseClauses) is present, let `names1` be the [VarDeclaredNames](#sec-static-semantics-vardeclarednames) of the first [CaseClauses](#prod-CaseClauses).
2.  Else, let `names1` be a new empty [List](#sec-list-and-record-specification-type).
3.  Let `names2` be the [VarDeclaredNames](#sec-static-semantics-vardeclarednames) of [DefaultClause](#prod-DefaultClause).
4.  If the second [CaseClauses](#prod-CaseClauses) is present, let `names3` be the [VarDeclaredNames](#sec-static-semantics-vardeclarednames) of the second [CaseClauses](#prod-CaseClauses).
5.  Else, let `names3` be a new empty [List](#sec-list-and-record-specification-type).
6.  Return the [list-concatenation](#list-concatenation) of `names1`, `names2`, and `names3`.

[CaseClauses](#prod-CaseClauses) : [CaseClauses](#prod-CaseClauses) [CaseClause](#prod-CaseClause)

1.  Let `names1` be the [VarDeclaredNames](#sec-static-semantics-vardeclarednames) of [CaseClauses](#prod-CaseClauses).
2.  Let `names2` be the [VarDeclaredNames](#sec-static-semantics-vardeclarednames) of [CaseClause](#prod-CaseClause).
3.  Return the [list-concatenation](#list-concatenation) of `names1` and `names2`.

[CaseClause](#prod-CaseClause) : case [Expression](#prod-Expression) : [StatementList](#prod-StatementList)opt

1.  If the [StatementList](#prod-StatementList) is present, return the [VarDeclaredNames](#sec-static-semantics-vardeclarednames) of [StatementList](#prod-StatementList).
2.  Return a new empty [List](#sec-list-and-record-specification-type).

[DefaultClause](#prod-DefaultClause) : default : [StatementList](#prod-StatementList)opt

1.  If the [StatementList](#prod-StatementList) is present, return the [VarDeclaredNames](#sec-static-semantics-vardeclarednames) of [StatementList](#prod-StatementList).
2.  Return a new empty [List](#sec-list-and-record-specification-type).

[LabelledStatement](#prod-LabelledStatement) : [LabelIdentifier](#prod-LabelIdentifier) : [LabelledItem](#prod-LabelledItem)

1.  Return the [VarDeclaredNames](#sec-static-semantics-vardeclarednames) of [LabelledItem](#prod-LabelledItem).

[LabelledItem](#prod-LabelledItem) : [FunctionDeclaration](#prod-FunctionDeclaration)

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[TryStatement](#prod-TryStatement) : try [Block](#prod-Block) [Catch](#prod-Catch)

1.  Let `names1` be the [VarDeclaredNames](#sec-static-semantics-vardeclarednames) of [Block](#prod-Block).
2.  Let `names2` be the [VarDeclaredNames](#sec-static-semantics-vardeclarednames) of [Catch](#prod-Catch).
3.  Return the [list-concatenation](#list-concatenation) of `names1` and `names2`.

[TryStatement](#prod-TryStatement) : try [Block](#prod-Block) [Finally](#prod-Finally)

1.  Let `names1` be the [VarDeclaredNames](#sec-static-semantics-vardeclarednames) of [Block](#prod-Block).
2.  Let `names2` be the [VarDeclaredNames](#sec-static-semantics-vardeclarednames) of [Finally](#prod-Finally).
3.  Return the [list-concatenation](#list-concatenation) of `names1` and `names2`.

[TryStatement](#prod-TryStatement) : try [Block](#prod-Block) [Catch](#prod-Catch) [Finally](#prod-Finally)

1.  Let `names1` be the [VarDeclaredNames](#sec-static-semantics-vardeclarednames) of [Block](#prod-Block).
2.  Let `names2` be the [VarDeclaredNames](#sec-static-semantics-vardeclarednames) of [Catch](#prod-Catch).
3.  Let `names3` be the [VarDeclaredNames](#sec-static-semantics-vardeclarednames) of [Finally](#prod-Finally).
4.  Return the [list-concatenation](#list-concatenation) of `names1`, `names2`, and `names3`.

[Catch](#prod-Catch) : catch ( [CatchParameter](#prod-CatchParameter) ) [Block](#prod-Block)

1.  Return the [VarDeclaredNames](#sec-static-semantics-vardeclarednames) of [Block](#prod-Block).

[FunctionStatementList](#prod-FunctionStatementList) : \[empty\]

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[FunctionStatementList](#prod-FunctionStatementList) : [StatementList](#prod-StatementList)

1.  Return the [TopLevelVarDeclaredNames](#sec-static-semantics-toplevelvardeclarednames) of [StatementList](#prod-StatementList).

[ClassStaticBlockStatementList](#prod-ClassStaticBlockStatementList) : \[empty\]

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[ClassStaticBlockStatementList](#prod-ClassStaticBlockStatementList) : [StatementList](#prod-StatementList)

1.  Return the [TopLevelVarDeclaredNames](#sec-static-semantics-toplevelvardeclarednames) of [StatementList](#prod-StatementList).

[ConciseBody](#prod-ConciseBody) : [ExpressionBody](#prod-ExpressionBody)

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[AsyncConciseBody](#prod-AsyncConciseBody) : [ExpressionBody](#prod-ExpressionBody)

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[Script](#prod-Script) : \[empty\]

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[ScriptBody](#prod-ScriptBody) : [StatementList](#prod-StatementList)

1.  Return the [TopLevelVarDeclaredNames](#sec-static-semantics-toplevelvardeclarednames) of [StatementList](#prod-StatementList).

[ModuleItemList](#prod-ModuleItemList) : [ModuleItemList](#prod-ModuleItemList) [ModuleItem](#prod-ModuleItem)

1.  Let `names1` be the [VarDeclaredNames](#sec-static-semantics-vardeclarednames) of [ModuleItemList](#prod-ModuleItemList).
2.  Let `names2` be the [VarDeclaredNames](#sec-static-semantics-vardeclarednames) of [ModuleItem](#prod-ModuleItem).
3.  Return the [list-concatenation](#list-concatenation) of `names1` and `names2`.

[ModuleItem](#prod-ModuleItem) : [ImportDeclaration](#prod-ImportDeclaration)

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[ModuleItem](#prod-ModuleItem) : [ExportDeclaration](#prod-ExportDeclaration)

1.  If [ExportDeclaration](#prod-ExportDeclaration) is `export` [VariableStatement](#prod-VariableStatement), return the [BoundNames](#sec-static-semantics-boundnames) of [ExportDeclaration](#prod-ExportDeclaration).
2.  Return a new empty [List](#sec-list-and-record-specification-type).

### 8.2.7 Static Semantics: VarScopedDeclarations

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) VarScopedDeclarations takes no arguments and returns a [List](#sec-list-and-record-specification-type) of [Parse Nodes](#sec-syntactic-grammar). It is defined piecewise over the following productions:

[Statement](#prod-Statement) : [EmptyStatement](#prod-EmptyStatement) [ExpressionStatement](#prod-ExpressionStatement) [ContinueStatement](#prod-ContinueStatement) [BreakStatement](#prod-BreakStatement) [ReturnStatement](#prod-ReturnStatement) [ThrowStatement](#prod-ThrowStatement) [DebuggerStatement](#prod-DebuggerStatement)

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[Block](#prod-Block) : { }

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[StatementList](#prod-StatementList) : [StatementList](#prod-StatementList) [StatementListItem](#prod-StatementListItem)

1.  Let `declarations1` be the [VarScopedDeclarations](#sec-static-semantics-varscopeddeclarations) of [StatementList](#prod-StatementList).
2.  Let `declarations2` be the [VarScopedDeclarations](#sec-static-semantics-varscopeddeclarations) of [StatementListItem](#prod-StatementListItem).
3.  Return the [list-concatenation](#list-concatenation) of `declarations1` and `declarations2`.

[StatementListItem](#prod-StatementListItem) : [Declaration](#prod-Declaration)

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[VariableDeclarationList](#prod-VariableDeclarationList) : [VariableDeclaration](#prod-VariableDeclaration)

1.  Return « [VariableDeclaration](#prod-VariableDeclaration) ».

[VariableDeclarationList](#prod-VariableDeclarationList) : [VariableDeclarationList](#prod-VariableDeclarationList) , [VariableDeclaration](#prod-VariableDeclaration)

1.  Let `declarations1` be the [VarScopedDeclarations](#sec-static-semantics-varscopeddeclarations) of [VariableDeclarationList](#prod-VariableDeclarationList).
2.  Return the [list-concatenation](#list-concatenation) of `declarations1` and « [VariableDeclaration](#prod-VariableDeclaration) ».

[IfStatement](#prod-IfStatement) : if ( [Expression](#prod-Expression) ) [Statement](#prod-Statement) else [Statement](#prod-Statement)

1.  Let `declarations1` be the [VarScopedDeclarations](#sec-static-semantics-varscopeddeclarations) of the first [Statement](#prod-Statement).
2.  Let `declarations2` be the [VarScopedDeclarations](#sec-static-semantics-varscopeddeclarations) of the second [Statement](#prod-Statement).
3.  Return the [list-concatenation](#list-concatenation) of `declarations1` and `declarations2`.

[IfStatement](#prod-IfStatement) : if ( [Expression](#prod-Expression) ) [Statement](#prod-Statement)

1.  Return the [VarScopedDeclarations](#sec-static-semantics-varscopeddeclarations) of [Statement](#prod-Statement).

[DoWhileStatement](#prod-DoWhileStatement) : do [Statement](#prod-Statement) while ( [Expression](#prod-Expression) ) ;

1.  Return the [VarScopedDeclarations](#sec-static-semantics-varscopeddeclarations) of [Statement](#prod-Statement).

[WhileStatement](#prod-WhileStatement) : while ( [Expression](#prod-Expression) ) [Statement](#prod-Statement)

1.  Return the [VarScopedDeclarations](#sec-static-semantics-varscopeddeclarations) of [Statement](#prod-Statement).

[ForStatement](#prod-ForStatement) : for ( [Expression](#prod-Expression)opt ; [Expression](#prod-Expression)opt ; [Expression](#prod-Expression)opt ) [Statement](#prod-Statement)

1.  Return the [VarScopedDeclarations](#sec-static-semantics-varscopeddeclarations) of [Statement](#prod-Statement).

[ForStatement](#prod-ForStatement) : for ( var [VariableDeclarationList](#prod-VariableDeclarationList) ; [Expression](#prod-Expression)opt ; [Expression](#prod-Expression)opt ) [Statement](#prod-Statement)

1.  Let `declarations1` be the [VarScopedDeclarations](#sec-static-semantics-varscopeddeclarations) of [VariableDeclarationList](#prod-VariableDeclarationList).
2.  Let `declarations2` be the [VarScopedDeclarations](#sec-static-semantics-varscopeddeclarations) of [Statement](#prod-Statement).
3.  Return the [list-concatenation](#list-concatenation) of `declarations1` and `declarations2`.

[ForStatement](#prod-ForStatement) : for ( [LexicalDeclaration](#prod-LexicalDeclaration) [Expression](#prod-Expression)opt ; [Expression](#prod-Expression)opt ) [Statement](#prod-Statement)

1.  Return the [VarScopedDeclarations](#sec-static-semantics-varscopeddeclarations) of [Statement](#prod-Statement).

[ForInOfStatement](#prod-ForInOfStatement) : for ( [LeftHandSideExpression](#prod-LeftHandSideExpression) in [Expression](#prod-Expression) ) [Statement](#prod-Statement) for ( [ForDeclaration](#prod-ForDeclaration) in [Expression](#prod-Expression) ) [Statement](#prod-Statement) for ( [LeftHandSideExpression](#prod-LeftHandSideExpression) of [AssignmentExpression](#prod-AssignmentExpression) ) [Statement](#prod-Statement) for ( [ForDeclaration](#prod-ForDeclaration) of [AssignmentExpression](#prod-AssignmentExpression) ) [Statement](#prod-Statement) for await ( [LeftHandSideExpression](#prod-LeftHandSideExpression) of [AssignmentExpression](#prod-AssignmentExpression) ) [Statement](#prod-Statement) for await ( [ForDeclaration](#prod-ForDeclaration) of [AssignmentExpression](#prod-AssignmentExpression) ) [Statement](#prod-Statement)

1.  Return the [VarScopedDeclarations](#sec-static-semantics-varscopeddeclarations) of [Statement](#prod-Statement).

[ForInOfStatement](#prod-ForInOfStatement) : for ( var [ForBinding](#prod-ForBinding) in [Expression](#prod-Expression) ) [Statement](#prod-Statement) for ( var [ForBinding](#prod-ForBinding) of [AssignmentExpression](#prod-AssignmentExpression) ) [Statement](#prod-Statement) for await ( var [ForBinding](#prod-ForBinding) of [AssignmentExpression](#prod-AssignmentExpression) ) [Statement](#prod-Statement)

1.  Let `declarations1` be « [ForBinding](#prod-ForBinding) ».
2.  Let `declarations2` be the [VarScopedDeclarations](#sec-static-semantics-varscopeddeclarations) of [Statement](#prod-Statement).
3.  Return the [list-concatenation](#list-concatenation) of `declarations1` and `declarations2`.

Note

This section is extended by Annex [B.3.5](#sec-initializers-in-forin-statement-heads).

[WithStatement](#prod-WithStatement) : with ( [Expression](#prod-Expression) ) [Statement](#prod-Statement)

1.  Return the [VarScopedDeclarations](#sec-static-semantics-varscopeddeclarations) of [Statement](#prod-Statement).

[SwitchStatement](#prod-SwitchStatement) : switch ( [Expression](#prod-Expression) ) [CaseBlock](#prod-CaseBlock)

1.  Return the [VarScopedDeclarations](#sec-static-semantics-varscopeddeclarations) of [CaseBlock](#prod-CaseBlock).

[CaseBlock](#prod-CaseBlock) : { }

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[CaseBlock](#prod-CaseBlock) : { [CaseClauses](#prod-CaseClauses)opt [DefaultClause](#prod-DefaultClause) [CaseClauses](#prod-CaseClauses)opt }

1.  If the first [CaseClauses](#prod-CaseClauses) is present, let `declarations1` be the [VarScopedDeclarations](#sec-static-semantics-varscopeddeclarations) of the first [CaseClauses](#prod-CaseClauses).
2.  Else, let `declarations1` be a new empty [List](#sec-list-and-record-specification-type).
3.  Let `declarations2` be the [VarScopedDeclarations](#sec-static-semantics-varscopeddeclarations) of [DefaultClause](#prod-DefaultClause).
4.  If the second [CaseClauses](#prod-CaseClauses) is present, let `declarations3` be the [VarScopedDeclarations](#sec-static-semantics-varscopeddeclarations) of the second [CaseClauses](#prod-CaseClauses).
5.  Else, let `declarations3` be a new empty [List](#sec-list-and-record-specification-type).
6.  Return the [list-concatenation](#list-concatenation) of `declarations1`, `declarations2`, and `declarations3`.

[CaseClauses](#prod-CaseClauses) : [CaseClauses](#prod-CaseClauses) [CaseClause](#prod-CaseClause)

1.  Let `declarations1` be the [VarScopedDeclarations](#sec-static-semantics-varscopeddeclarations) of [CaseClauses](#prod-CaseClauses).
2.  Let `declarations2` be the [VarScopedDeclarations](#sec-static-semantics-varscopeddeclarations) of [CaseClause](#prod-CaseClause).
3.  Return the [list-concatenation](#list-concatenation) of `declarations1` and `declarations2`.

[CaseClause](#prod-CaseClause) : case [Expression](#prod-Expression) : [StatementList](#prod-StatementList)opt

1.  If the [StatementList](#prod-StatementList) is present, return the [VarScopedDeclarations](#sec-static-semantics-varscopeddeclarations) of [StatementList](#prod-StatementList).
2.  Return a new empty [List](#sec-list-and-record-specification-type).

[DefaultClause](#prod-DefaultClause) : default : [StatementList](#prod-StatementList)opt

1.  If the [StatementList](#prod-StatementList) is present, return the [VarScopedDeclarations](#sec-static-semantics-varscopeddeclarations) of [StatementList](#prod-StatementList).
2.  Return a new empty [List](#sec-list-and-record-specification-type).

[LabelledStatement](#prod-LabelledStatement) : [LabelIdentifier](#prod-LabelIdentifier) : [LabelledItem](#prod-LabelledItem)

1.  Return the [VarScopedDeclarations](#sec-static-semantics-varscopeddeclarations) of [LabelledItem](#prod-LabelledItem).

[LabelledItem](#prod-LabelledItem) : [FunctionDeclaration](#prod-FunctionDeclaration)

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[TryStatement](#prod-TryStatement) : try [Block](#prod-Block) [Catch](#prod-Catch)

1.  Let `declarations1` be the [VarScopedDeclarations](#sec-static-semantics-varscopeddeclarations) of [Block](#prod-Block).
2.  Let `declarations2` be the [VarScopedDeclarations](#sec-static-semantics-varscopeddeclarations) of [Catch](#prod-Catch).
3.  Return the [list-concatenation](#list-concatenation) of `declarations1` and `declarations2`.

[TryStatement](#prod-TryStatement) : try [Block](#prod-Block) [Finally](#prod-Finally)

1.  Let `declarations1` be the [VarScopedDeclarations](#sec-static-semantics-varscopeddeclarations) of [Block](#prod-Block).
2.  Let `declarations2` be the [VarScopedDeclarations](#sec-static-semantics-varscopeddeclarations) of [Finally](#prod-Finally).
3.  Return the [list-concatenation](#list-concatenation) of `declarations1` and `declarations2`.

[TryStatement](#prod-TryStatement) : try [Block](#prod-Block) [Catch](#prod-Catch) [Finally](#prod-Finally)

1.  Let `declarations1` be the [VarScopedDeclarations](#sec-static-semantics-varscopeddeclarations) of [Block](#prod-Block).
2.  Let `declarations2` be the [VarScopedDeclarations](#sec-static-semantics-varscopeddeclarations) of [Catch](#prod-Catch).
3.  Let `declarations3` be the [VarScopedDeclarations](#sec-static-semantics-varscopeddeclarations) of [Finally](#prod-Finally).
4.  Return the [list-concatenation](#list-concatenation) of `declarations1`, `declarations2`, and `declarations3`.

[Catch](#prod-Catch) : catch ( [CatchParameter](#prod-CatchParameter) ) [Block](#prod-Block)

1.  Return the [VarScopedDeclarations](#sec-static-semantics-varscopeddeclarations) of [Block](#prod-Block).

[FunctionStatementList](#prod-FunctionStatementList) : \[empty\]

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[FunctionStatementList](#prod-FunctionStatementList) : [StatementList](#prod-StatementList)

1.  Return the [TopLevelVarScopedDeclarations](#sec-static-semantics-toplevelvarscopeddeclarations) of [StatementList](#prod-StatementList).

[ClassStaticBlockStatementList](#prod-ClassStaticBlockStatementList) : \[empty\]

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[ClassStaticBlockStatementList](#prod-ClassStaticBlockStatementList) : [StatementList](#prod-StatementList)

1.  Return the [TopLevelVarScopedDeclarations](#sec-static-semantics-toplevelvarscopeddeclarations) of [StatementList](#prod-StatementList).

[ConciseBody](#prod-ConciseBody) : [ExpressionBody](#prod-ExpressionBody)

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[AsyncConciseBody](#prod-AsyncConciseBody) : [ExpressionBody](#prod-ExpressionBody)

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[Script](#prod-Script) : \[empty\]

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[ScriptBody](#prod-ScriptBody) : [StatementList](#prod-StatementList)

1.  Return the [TopLevelVarScopedDeclarations](#sec-static-semantics-toplevelvarscopeddeclarations) of [StatementList](#prod-StatementList).

[Module](#prod-Module) : \[empty\]

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[ModuleItemList](#prod-ModuleItemList) : [ModuleItemList](#prod-ModuleItemList) [ModuleItem](#prod-ModuleItem)

1.  Let `declarations1` be the [VarScopedDeclarations](#sec-static-semantics-varscopeddeclarations) of [ModuleItemList](#prod-ModuleItemList).
2.  Let `declarations2` be the [VarScopedDeclarations](#sec-static-semantics-varscopeddeclarations) of [ModuleItem](#prod-ModuleItem).
3.  Return the [list-concatenation](#list-concatenation) of `declarations1` and `declarations2`.

[ModuleItem](#prod-ModuleItem) : [ImportDeclaration](#prod-ImportDeclaration)

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[ModuleItem](#prod-ModuleItem) : [ExportDeclaration](#prod-ExportDeclaration)

1.  If [ExportDeclaration](#prod-ExportDeclaration) is `export` [VariableStatement](#prod-VariableStatement), return the [VarScopedDeclarations](#sec-static-semantics-varscopeddeclarations) of [VariableStatement](#prod-VariableStatement).
2.  Return a new empty [List](#sec-list-and-record-specification-type).

### 8.2.8 Static Semantics: TopLevelLexicallyDeclaredNames

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) TopLevelLexicallyDeclaredNames takes no arguments and returns a [List](#sec-list-and-record-specification-type) of Strings. It is defined piecewise over the following productions:

[StatementList](#prod-StatementList) : [StatementList](#prod-StatementList) [StatementListItem](#prod-StatementListItem)

1.  Let `names1` be the [TopLevelLexicallyDeclaredNames](#sec-static-semantics-toplevellexicallydeclarednames) of [StatementList](#prod-StatementList).
2.  Let `names2` be the [TopLevelLexicallyDeclaredNames](#sec-static-semantics-toplevellexicallydeclarednames) of [StatementListItem](#prod-StatementListItem).
3.  Return the [list-concatenation](#list-concatenation) of `names1` and `names2`.

[StatementListItem](#prod-StatementListItem) : [Statement](#prod-Statement)

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[StatementListItem](#prod-StatementListItem) : [Declaration](#prod-Declaration)

1.  If [Declaration](#prod-Declaration) is [Declaration](#prod-Declaration) : [HoistableDeclaration](#prod-HoistableDeclaration) , then
    1.  Return a new empty [List](#sec-list-and-record-specification-type).
2.  Return the [BoundNames](#sec-static-semantics-boundnames) of [Declaration](#prod-Declaration).

Note

At the top level of a function, or script, function declarations are treated like var declarations rather than like lexical declarations.

### 8.2.9 Static Semantics: TopLevelLexicallyScopedDeclarations

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) TopLevelLexicallyScopedDeclarations takes no arguments and returns a [List](#sec-list-and-record-specification-type) of [Parse Nodes](#sec-syntactic-grammar). It is defined piecewise over the following productions:

[StatementList](#prod-StatementList) : [StatementList](#prod-StatementList) [StatementListItem](#prod-StatementListItem)

1.  Let `declarations1` be the [TopLevelLexicallyScopedDeclarations](#sec-static-semantics-toplevellexicallyscopeddeclarations) of [StatementList](#prod-StatementList).
2.  Let `declarations2` be the [TopLevelLexicallyScopedDeclarations](#sec-static-semantics-toplevellexicallyscopeddeclarations) of [StatementListItem](#prod-StatementListItem).
3.  Return the [list-concatenation](#list-concatenation) of `declarations1` and `declarations2`.

[StatementListItem](#prod-StatementListItem) : [Statement](#prod-Statement)

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[StatementListItem](#prod-StatementListItem) : [Declaration](#prod-Declaration)

1.  If [Declaration](#prod-Declaration) is [Declaration](#prod-Declaration) : [HoistableDeclaration](#prod-HoistableDeclaration) , then
    1.  Return a new empty [List](#sec-list-and-record-specification-type).
2.  Return « [Declaration](#prod-Declaration) ».

### 8.2.10 Static Semantics: TopLevelVarDeclaredNames

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) TopLevelVarDeclaredNames takes no arguments and returns a [List](#sec-list-and-record-specification-type) of Strings. It is defined piecewise over the following productions:

[StatementList](#prod-StatementList) : [StatementList](#prod-StatementList) [StatementListItem](#prod-StatementListItem)

1.  Let `names1` be the [TopLevelVarDeclaredNames](#sec-static-semantics-toplevelvardeclarednames) of [StatementList](#prod-StatementList).
2.  Let `names2` be the [TopLevelVarDeclaredNames](#sec-static-semantics-toplevelvardeclarednames) of [StatementListItem](#prod-StatementListItem).
3.  Return the [list-concatenation](#list-concatenation) of `names1` and `names2`.

[StatementListItem](#prod-StatementListItem) : [Declaration](#prod-Declaration)

1.  If [Declaration](#prod-Declaration) is [Declaration](#prod-Declaration) : [HoistableDeclaration](#prod-HoistableDeclaration) , then
    1.  Return the [BoundNames](#sec-static-semantics-boundnames) of [HoistableDeclaration](#prod-HoistableDeclaration).
2.  Return a new empty [List](#sec-list-and-record-specification-type).

[StatementListItem](#prod-StatementListItem) : [Statement](#prod-Statement)

1.  If [Statement](#prod-Statement) is [Statement](#prod-Statement) : [LabelledStatement](#prod-LabelledStatement) , return the [TopLevelVarDeclaredNames](#sec-static-semantics-toplevelvardeclarednames) of [Statement](#prod-Statement).
2.  Return the [VarDeclaredNames](#sec-static-semantics-vardeclarednames) of [Statement](#prod-Statement).

Note

At the top level of a function or script, inner function declarations are treated like var declarations.

[LabelledStatement](#prod-LabelledStatement) : [LabelIdentifier](#prod-LabelIdentifier) : [LabelledItem](#prod-LabelledItem)

1.  Return the [TopLevelVarDeclaredNames](#sec-static-semantics-toplevelvardeclarednames) of [LabelledItem](#prod-LabelledItem).

[LabelledItem](#prod-LabelledItem) : [Statement](#prod-Statement)

1.  If [Statement](#prod-Statement) is [Statement](#prod-Statement) : [LabelledStatement](#prod-LabelledStatement) , return the [TopLevelVarDeclaredNames](#sec-static-semantics-toplevelvardeclarednames) of [Statement](#prod-Statement).
2.  Return the [VarDeclaredNames](#sec-static-semantics-vardeclarednames) of [Statement](#prod-Statement).

[LabelledItem](#prod-LabelledItem) : [FunctionDeclaration](#prod-FunctionDeclaration)

1.  Return the [BoundNames](#sec-static-semantics-boundnames) of [FunctionDeclaration](#prod-FunctionDeclaration).

### 8.2.11 Static Semantics: TopLevelVarScopedDeclarations

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) TopLevelVarScopedDeclarations takes no arguments and returns a [List](#sec-list-and-record-specification-type) of [Parse Nodes](#sec-syntactic-grammar). It is defined piecewise over the following productions:

[StatementList](#prod-StatementList) : [StatementList](#prod-StatementList) [StatementListItem](#prod-StatementListItem)

1.  Let `declarations1` be the [TopLevelVarScopedDeclarations](#sec-static-semantics-toplevelvarscopeddeclarations) of [StatementList](#prod-StatementList).
2.  Let `declarations2` be the [TopLevelVarScopedDeclarations](#sec-static-semantics-toplevelvarscopeddeclarations) of [StatementListItem](#prod-StatementListItem).
3.  Return the [list-concatenation](#list-concatenation) of `declarations1` and `declarations2`.

[StatementListItem](#prod-StatementListItem) : [Statement](#prod-Statement)

1.  If [Statement](#prod-Statement) is [Statement](#prod-Statement) : [LabelledStatement](#prod-LabelledStatement) , return the [TopLevelVarScopedDeclarations](#sec-static-semantics-toplevelvarscopeddeclarations) of [Statement](#prod-Statement).
2.  Return the [VarScopedDeclarations](#sec-static-semantics-varscopeddeclarations) of [Statement](#prod-Statement).

[StatementListItem](#prod-StatementListItem) : [Declaration](#prod-Declaration)

1.  If [Declaration](#prod-Declaration) is [Declaration](#prod-Declaration) : [HoistableDeclaration](#prod-HoistableDeclaration) , then
    1.  Let `declaration` be the [DeclarationPart](#sec-static-semantics-declarationpart) of [HoistableDeclaration](#prod-HoistableDeclaration).
    2.  Return « `declaration` ».
2.  Return a new empty [List](#sec-list-and-record-specification-type).

[LabelledStatement](#prod-LabelledStatement) : [LabelIdentifier](#prod-LabelIdentifier) : [LabelledItem](#prod-LabelledItem)

1.  Return the [TopLevelVarScopedDeclarations](#sec-static-semantics-toplevelvarscopeddeclarations) of [LabelledItem](#prod-LabelledItem).

[LabelledItem](#prod-LabelledItem) : [Statement](#prod-Statement)

1.  If [Statement](#prod-Statement) is [Statement](#prod-Statement) : [LabelledStatement](#prod-LabelledStatement) , return the [TopLevelVarScopedDeclarations](#sec-static-semantics-toplevelvarscopeddeclarations) of [Statement](#prod-Statement).
2.  Return the [VarScopedDeclarations](#sec-static-semantics-varscopeddeclarations) of [Statement](#prod-Statement).

[LabelledItem](#prod-LabelledItem) : [FunctionDeclaration](#prod-FunctionDeclaration)

1.  Return « [FunctionDeclaration](#prod-FunctionDeclaration) ».

## 8.3 Labels

### 8.3.1 Static Semantics: ContainsDuplicateLabels

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) ContainsDuplicateLabels takes argument `labelSet` (a [List](#sec-list-and-record-specification-type) of Strings) and returns a Boolean. It is defined piecewise over the following productions:

[Statement](#prod-Statement) : [VariableStatement](#prod-VariableStatement) [EmptyStatement](#prod-EmptyStatement) [ExpressionStatement](#prod-ExpressionStatement) [ContinueStatement](#prod-ContinueStatement) [BreakStatement](#prod-BreakStatement) [ReturnStatement](#prod-ReturnStatement) [ThrowStatement](#prod-ThrowStatement) [DebuggerStatement](#prod-DebuggerStatement) [Block](#prod-Block) : { } [StatementListItem](#prod-StatementListItem) : [Declaration](#prod-Declaration)

1.  Return false.

[StatementList](#prod-StatementList) : [StatementList](#prod-StatementList) [StatementListItem](#prod-StatementListItem)

1.  Let `hasDuplicates` be [ContainsDuplicateLabels](#sec-static-semantics-containsduplicatelabels) of [StatementList](#prod-StatementList) with argument `labelSet`.
2.  If `hasDuplicates` is true, return true.
3.  Return [ContainsDuplicateLabels](#sec-static-semantics-containsduplicatelabels) of [StatementListItem](#prod-StatementListItem) with argument `labelSet`.

[IfStatement](#prod-IfStatement) : if ( [Expression](#prod-Expression) ) [Statement](#prod-Statement) else [Statement](#prod-Statement)

1.  Let `hasDuplicate` be [ContainsDuplicateLabels](#sec-static-semantics-containsduplicatelabels) of the first [Statement](#prod-Statement) with argument `labelSet`.
2.  If `hasDuplicate` is true, return true.
3.  Return [ContainsDuplicateLabels](#sec-static-semantics-containsduplicatelabels) of the second [Statement](#prod-Statement) with argument `labelSet`.

[IfStatement](#prod-IfStatement) : if ( [Expression](#prod-Expression) ) [Statement](#prod-Statement)

1.  Return [ContainsDuplicateLabels](#sec-static-semantics-containsduplicatelabels) of [Statement](#prod-Statement) with argument `labelSet`.

[DoWhileStatement](#prod-DoWhileStatement) : do [Statement](#prod-Statement) while ( [Expression](#prod-Expression) ) ;

1.  Return [ContainsDuplicateLabels](#sec-static-semantics-containsduplicatelabels) of [Statement](#prod-Statement) with argument `labelSet`.

[WhileStatement](#prod-WhileStatement) : while ( [Expression](#prod-Expression) ) [Statement](#prod-Statement)

1.  Return [ContainsDuplicateLabels](#sec-static-semantics-containsduplicatelabels) of [Statement](#prod-Statement) with argument `labelSet`.

[ForStatement](#prod-ForStatement) : for ( [Expression](#prod-Expression)opt ; [Expression](#prod-Expression)opt ; [Expression](#prod-Expression)opt ) [Statement](#prod-Statement) for ( var [VariableDeclarationList](#prod-VariableDeclarationList) ; [Expression](#prod-Expression)opt ; [Expression](#prod-Expression)opt ) [Statement](#prod-Statement) for ( [LexicalDeclaration](#prod-LexicalDeclaration) [Expression](#prod-Expression)opt ; [Expression](#prod-Expression)opt ) [Statement](#prod-Statement)

1.  Return [ContainsDuplicateLabels](#sec-static-semantics-containsduplicatelabels) of [Statement](#prod-Statement) with argument `labelSet`.

[ForInOfStatement](#prod-ForInOfStatement) : for ( [LeftHandSideExpression](#prod-LeftHandSideExpression) in [Expression](#prod-Expression) ) [Statement](#prod-Statement) for ( var [ForBinding](#prod-ForBinding) in [Expression](#prod-Expression) ) [Statement](#prod-Statement) for ( [ForDeclaration](#prod-ForDeclaration) in [Expression](#prod-Expression) ) [Statement](#prod-Statement) for ( [LeftHandSideExpression](#prod-LeftHandSideExpression) of [AssignmentExpression](#prod-AssignmentExpression) ) [Statement](#prod-Statement) for ( var [ForBinding](#prod-ForBinding) of [AssignmentExpression](#prod-AssignmentExpression) ) [Statement](#prod-Statement) for ( [ForDeclaration](#prod-ForDeclaration) of [AssignmentExpression](#prod-AssignmentExpression) ) [Statement](#prod-Statement) for await ( [LeftHandSideExpression](#prod-LeftHandSideExpression) of [AssignmentExpression](#prod-AssignmentExpression) ) [Statement](#prod-Statement) for await ( var [ForBinding](#prod-ForBinding) of [AssignmentExpression](#prod-AssignmentExpression) ) [Statement](#prod-Statement) for await ( [ForDeclaration](#prod-ForDeclaration) of [AssignmentExpression](#prod-AssignmentExpression) ) [Statement](#prod-Statement)

1.  Return [ContainsDuplicateLabels](#sec-static-semantics-containsduplicatelabels) of [Statement](#prod-Statement) with argument `labelSet`.

Note

This section is extended by Annex [B.3.5](#sec-initializers-in-forin-statement-heads).

[WithStatement](#prod-WithStatement) : with ( [Expression](#prod-Expression) ) [Statement](#prod-Statement)

1.  Return [ContainsDuplicateLabels](#sec-static-semantics-containsduplicatelabels) of [Statement](#prod-Statement) with argument `labelSet`.

[SwitchStatement](#prod-SwitchStatement) : switch ( [Expression](#prod-Expression) ) [CaseBlock](#prod-CaseBlock)

1.  Return [ContainsDuplicateLabels](#sec-static-semantics-containsduplicatelabels) of [CaseBlock](#prod-CaseBlock) with argument `labelSet`.

[CaseBlock](#prod-CaseBlock) : { }

1.  Return false.

[CaseBlock](#prod-CaseBlock) : { [CaseClauses](#prod-CaseClauses)opt [DefaultClause](#prod-DefaultClause) [CaseClauses](#prod-CaseClauses)opt }

1.  If the first [CaseClauses](#prod-CaseClauses) is present, then
    1.  If [ContainsDuplicateLabels](#sec-static-semantics-containsduplicatelabels) of the first [CaseClauses](#prod-CaseClauses) with argument `labelSet` is true, return true.
2.  If [ContainsDuplicateLabels](#sec-static-semantics-containsduplicatelabels) of [DefaultClause](#prod-DefaultClause) with argument `labelSet` is true, return true.
3.  If the second [CaseClauses](#prod-CaseClauses) is not present, return false.
4.  Return [ContainsDuplicateLabels](#sec-static-semantics-containsduplicatelabels) of the second [CaseClauses](#prod-CaseClauses) with argument `labelSet`.

[CaseClauses](#prod-CaseClauses) : [CaseClauses](#prod-CaseClauses) [CaseClause](#prod-CaseClause)

1.  Let `hasDuplicates` be [ContainsDuplicateLabels](#sec-static-semantics-containsduplicatelabels) of [CaseClauses](#prod-CaseClauses) with argument `labelSet`.
2.  If `hasDuplicates` is true, return true.
3.  Return [ContainsDuplicateLabels](#sec-static-semantics-containsduplicatelabels) of [CaseClause](#prod-CaseClause) with argument `labelSet`.

[CaseClause](#prod-CaseClause) : case [Expression](#prod-Expression) : [StatementList](#prod-StatementList)opt

1.  If the [StatementList](#prod-StatementList) is present, return [ContainsDuplicateLabels](#sec-static-semantics-containsduplicatelabels) of [StatementList](#prod-StatementList) with argument `labelSet`.
2.  Return false.

[DefaultClause](#prod-DefaultClause) : default : [StatementList](#prod-StatementList)opt

1.  If the [StatementList](#prod-StatementList) is present, return [ContainsDuplicateLabels](#sec-static-semantics-containsduplicatelabels) of [StatementList](#prod-StatementList) with argument `labelSet`.
2.  Return false.

[LabelledStatement](#prod-LabelledStatement) : [LabelIdentifier](#prod-LabelIdentifier) : [LabelledItem](#prod-LabelledItem)

1.  Let `label` be the [StringValue](#sec-static-semantics-stringvalue) of [LabelIdentifier](#prod-LabelIdentifier).
2.  If `labelSet` contains `label`, return true.
3.  Let `newLabelSet` be the [list-concatenation](#list-concatenation) of `labelSet` and « `label` ».
4.  Return [ContainsDuplicateLabels](#sec-static-semantics-containsduplicatelabels) of [LabelledItem](#prod-LabelledItem) with argument `newLabelSet`.

[LabelledItem](#prod-LabelledItem) : [FunctionDeclaration](#prod-FunctionDeclaration)

1.  Return false.

[TryStatement](#prod-TryStatement) : try [Block](#prod-Block) [Catch](#prod-Catch)

1.  Let `hasDuplicates` be [ContainsDuplicateLabels](#sec-static-semantics-containsduplicatelabels) of [Block](#prod-Block) with argument `labelSet`.
2.  If `hasDuplicates` is true, return true.
3.  Return [ContainsDuplicateLabels](#sec-static-semantics-containsduplicatelabels) of [Catch](#prod-Catch) with argument `labelSet`.

[TryStatement](#prod-TryStatement) : try [Block](#prod-Block) [Finally](#prod-Finally)

1.  Let `hasDuplicates` be [ContainsDuplicateLabels](#sec-static-semantics-containsduplicatelabels) of [Block](#prod-Block) with argument `labelSet`.
2.  If `hasDuplicates` is true, return true.
3.  Return [ContainsDuplicateLabels](#sec-static-semantics-containsduplicatelabels) of [Finally](#prod-Finally) with argument `labelSet`.

[TryStatement](#prod-TryStatement) : try [Block](#prod-Block) [Catch](#prod-Catch) [Finally](#prod-Finally)

1.  If [ContainsDuplicateLabels](#sec-static-semantics-containsduplicatelabels) of [Block](#prod-Block) with argument `labelSet` is true, return true.
2.  If [ContainsDuplicateLabels](#sec-static-semantics-containsduplicatelabels) of [Catch](#prod-Catch) with argument `labelSet` is true, return true.
3.  Return [ContainsDuplicateLabels](#sec-static-semantics-containsduplicatelabels) of [Finally](#prod-Finally) with argument `labelSet`.

[Catch](#prod-Catch) : catch ( [CatchParameter](#prod-CatchParameter) ) [Block](#prod-Block)

1.  Return [ContainsDuplicateLabels](#sec-static-semantics-containsduplicatelabels) of [Block](#prod-Block) with argument `labelSet`.

[FunctionStatementList](#prod-FunctionStatementList) : \[empty\]

1.  Return false.

[ClassStaticBlockStatementList](#prod-ClassStaticBlockStatementList) : \[empty\]

1.  Return false.

[ModuleItemList](#prod-ModuleItemList) : [ModuleItemList](#prod-ModuleItemList) [ModuleItem](#prod-ModuleItem)

1.  Let `hasDuplicates` be [ContainsDuplicateLabels](#sec-static-semantics-containsduplicatelabels) of [ModuleItemList](#prod-ModuleItemList) with argument `labelSet`.
2.  If `hasDuplicates` is true, return true.
3.  Return [ContainsDuplicateLabels](#sec-static-semantics-containsduplicatelabels) of [ModuleItem](#prod-ModuleItem) with argument `labelSet`.

[ModuleItem](#prod-ModuleItem) : [ImportDeclaration](#prod-ImportDeclaration) [ExportDeclaration](#prod-ExportDeclaration)

1.  Return false.

### 8.3.2 Static Semantics: ContainsUndefinedBreakTarget

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) ContainsUndefinedBreakTarget takes argument `labelSet` (a [List](#sec-list-and-record-specification-type) of Strings) and returns a Boolean. It is defined piecewise over the following productions:

[Statement](#prod-Statement) : [VariableStatement](#prod-VariableStatement) [EmptyStatement](#prod-EmptyStatement) [ExpressionStatement](#prod-ExpressionStatement) [ContinueStatement](#prod-ContinueStatement) [ReturnStatement](#prod-ReturnStatement) [ThrowStatement](#prod-ThrowStatement) [DebuggerStatement](#prod-DebuggerStatement) [Block](#prod-Block) : { } [StatementListItem](#prod-StatementListItem) : [Declaration](#prod-Declaration)

1.  Return false.

[StatementList](#prod-StatementList) : [StatementList](#prod-StatementList) [StatementListItem](#prod-StatementListItem)

1.  Let `hasUndefinedLabels` be [ContainsUndefinedBreakTarget](#sec-static-semantics-containsundefinedbreaktarget) of [StatementList](#prod-StatementList) with argument `labelSet`.
2.  If `hasUndefinedLabels` is true, return true.
3.  Return [ContainsUndefinedBreakTarget](#sec-static-semantics-containsundefinedbreaktarget) of [StatementListItem](#prod-StatementListItem) with argument `labelSet`.

[IfStatement](#prod-IfStatement) : if ( [Expression](#prod-Expression) ) [Statement](#prod-Statement) else [Statement](#prod-Statement)

1.  Let `hasUndefinedLabels` be [ContainsUndefinedBreakTarget](#sec-static-semantics-containsundefinedbreaktarget) of the first [Statement](#prod-Statement) with argument `labelSet`.
2.  If `hasUndefinedLabels` is true, return true.
3.  Return [ContainsUndefinedBreakTarget](#sec-static-semantics-containsundefinedbreaktarget) of the second [Statement](#prod-Statement) with argument `labelSet`.

[IfStatement](#prod-IfStatement) : if ( [Expression](#prod-Expression) ) [Statement](#prod-Statement)

1.  Return [ContainsUndefinedBreakTarget](#sec-static-semantics-containsundefinedbreaktarget) of [Statement](#prod-Statement) with argument `labelSet`.

[DoWhileStatement](#prod-DoWhileStatement) : do [Statement](#prod-Statement) while ( [Expression](#prod-Expression) ) ;

1.  Return [ContainsUndefinedBreakTarget](#sec-static-semantics-containsundefinedbreaktarget) of [Statement](#prod-Statement) with argument `labelSet`.

[WhileStatement](#prod-WhileStatement) : while ( [Expression](#prod-Expression) ) [Statement](#prod-Statement)

1.  Return [ContainsUndefinedBreakTarget](#sec-static-semantics-containsundefinedbreaktarget) of [Statement](#prod-Statement) with argument `labelSet`.

[ForStatement](#prod-ForStatement) : for ( [Expression](#prod-Expression)opt ; [Expression](#prod-Expression)opt ; [Expression](#prod-Expression)opt ) [Statement](#prod-Statement) for ( var [VariableDeclarationList](#prod-VariableDeclarationList) ; [Expression](#prod-Expression)opt ; [Expression](#prod-Expression)opt ) [Statement](#prod-Statement) for ( [LexicalDeclaration](#prod-LexicalDeclaration) [Expression](#prod-Expression)opt ; [Expression](#prod-Expression)opt ) [Statement](#prod-Statement)

1.  Return [ContainsUndefinedBreakTarget](#sec-static-semantics-containsundefinedbreaktarget) of [Statement](#prod-Statement) with argument `labelSet`.

[ForInOfStatement](#prod-ForInOfStatement) : for ( [LeftHandSideExpression](#prod-LeftHandSideExpression) in [Expression](#prod-Expression) ) [Statement](#prod-Statement) for ( var [ForBinding](#prod-ForBinding) in [Expression](#prod-Expression) ) [Statement](#prod-Statement) for ( [ForDeclaration](#prod-ForDeclaration) in [Expression](#prod-Expression) ) [Statement](#prod-Statement) for ( [LeftHandSideExpression](#prod-LeftHandSideExpression) of [AssignmentExpression](#prod-AssignmentExpression) ) [Statement](#prod-Statement) for ( var [ForBinding](#prod-ForBinding) of [AssignmentExpression](#prod-AssignmentExpression) ) [Statement](#prod-Statement) for ( [ForDeclaration](#prod-ForDeclaration) of [AssignmentExpression](#prod-AssignmentExpression) ) [Statement](#prod-Statement) for await ( [LeftHandSideExpression](#prod-LeftHandSideExpression) of [AssignmentExpression](#prod-AssignmentExpression) ) [Statement](#prod-Statement) for await ( var [ForBinding](#prod-ForBinding) of [AssignmentExpression](#prod-AssignmentExpression) ) [Statement](#prod-Statement) for await ( [ForDeclaration](#prod-ForDeclaration) of [AssignmentExpression](#prod-AssignmentExpression) ) [Statement](#prod-Statement)

1.  Return [ContainsUndefinedBreakTarget](#sec-static-semantics-containsundefinedbreaktarget) of [Statement](#prod-Statement) with argument `labelSet`.

Note

This section is extended by Annex [B.3.5](#sec-initializers-in-forin-statement-heads).

[BreakStatement](#prod-BreakStatement) : break ;

1.  Return false.

[BreakStatement](#prod-BreakStatement) : break [LabelIdentifier](#prod-LabelIdentifier) ;

1.  If `labelSet` does not contain the [StringValue](#sec-static-semantics-stringvalue) of [LabelIdentifier](#prod-LabelIdentifier), return true.
2.  Return false.

[WithStatement](#prod-WithStatement) : with ( [Expression](#prod-Expression) ) [Statement](#prod-Statement)

1.  Return [ContainsUndefinedBreakTarget](#sec-static-semantics-containsundefinedbreaktarget) of [Statement](#prod-Statement) with argument `labelSet`.

[SwitchStatement](#prod-SwitchStatement) : switch ( [Expression](#prod-Expression) ) [CaseBlock](#prod-CaseBlock)

1.  Return [ContainsUndefinedBreakTarget](#sec-static-semantics-containsundefinedbreaktarget) of [CaseBlock](#prod-CaseBlock) with argument `labelSet`.

[CaseBlock](#prod-CaseBlock) : { }

1.  Return false.

[CaseBlock](#prod-CaseBlock) : { [CaseClauses](#prod-CaseClauses)opt [DefaultClause](#prod-DefaultClause) [CaseClauses](#prod-CaseClauses)opt }

1.  If the first [CaseClauses](#prod-CaseClauses) is present, then
    1.  If [ContainsUndefinedBreakTarget](#sec-static-semantics-containsundefinedbreaktarget) of the first [CaseClauses](#prod-CaseClauses) with argument `labelSet` is true, return true.
2.  If [ContainsUndefinedBreakTarget](#sec-static-semantics-containsundefinedbreaktarget) of [DefaultClause](#prod-DefaultClause) with argument `labelSet` is true, return true.
3.  If the second [CaseClauses](#prod-CaseClauses) is not present, return false.
4.  Return [ContainsUndefinedBreakTarget](#sec-static-semantics-containsundefinedbreaktarget) of the second [CaseClauses](#prod-CaseClauses) with argument `labelSet`.

[CaseClauses](#prod-CaseClauses) : [CaseClauses](#prod-CaseClauses) [CaseClause](#prod-CaseClause)

1.  Let `hasUndefinedLabels` be [ContainsUndefinedBreakTarget](#sec-static-semantics-containsundefinedbreaktarget) of [CaseClauses](#prod-CaseClauses) with argument `labelSet`.
2.  If `hasUndefinedLabels` is true, return true.
3.  Return [ContainsUndefinedBreakTarget](#sec-static-semantics-containsundefinedbreaktarget) of [CaseClause](#prod-CaseClause) with argument `labelSet`.

[CaseClause](#prod-CaseClause) : case [Expression](#prod-Expression) : [StatementList](#prod-StatementList)opt

1.  If the [StatementList](#prod-StatementList) is present, return [ContainsUndefinedBreakTarget](#sec-static-semantics-containsundefinedbreaktarget) of [StatementList](#prod-StatementList) with argument `labelSet`.
2.  Return false.

[DefaultClause](#prod-DefaultClause) : default : [StatementList](#prod-StatementList)opt

1.  If the [StatementList](#prod-StatementList) is present, return [ContainsUndefinedBreakTarget](#sec-static-semantics-containsundefinedbreaktarget) of [StatementList](#prod-StatementList) with argument `labelSet`.
2.  Return false.

[LabelledStatement](#prod-LabelledStatement) : [LabelIdentifier](#prod-LabelIdentifier) : [LabelledItem](#prod-LabelledItem)

1.  Let `label` be the [StringValue](#sec-static-semantics-stringvalue) of [LabelIdentifier](#prod-LabelIdentifier).
2.  Let `newLabelSet` be the [list-concatenation](#list-concatenation) of `labelSet` and « `label` ».
3.  Return [ContainsUndefinedBreakTarget](#sec-static-semantics-containsundefinedbreaktarget) of [LabelledItem](#prod-LabelledItem) with argument `newLabelSet`.

[LabelledItem](#prod-LabelledItem) : [FunctionDeclaration](#prod-FunctionDeclaration)

1.  Return false.

[TryStatement](#prod-TryStatement) : try [Block](#prod-Block) [Catch](#prod-Catch)

1.  Let `hasUndefinedLabels` be [ContainsUndefinedBreakTarget](#sec-static-semantics-containsundefinedbreaktarget) of [Block](#prod-Block) with argument `labelSet`.
2.  If `hasUndefinedLabels` is true, return true.
3.  Return [ContainsUndefinedBreakTarget](#sec-static-semantics-containsundefinedbreaktarget) of [Catch](#prod-Catch) with argument `labelSet`.

[TryStatement](#prod-TryStatement) : try [Block](#prod-Block) [Finally](#prod-Finally)

1.  Let `hasUndefinedLabels` be [ContainsUndefinedBreakTarget](#sec-static-semantics-containsundefinedbreaktarget) of [Block](#prod-Block) with argument `labelSet`.
2.  If `hasUndefinedLabels` is true, return true.
3.  Return [ContainsUndefinedBreakTarget](#sec-static-semantics-containsundefinedbreaktarget) of [Finally](#prod-Finally) with argument `labelSet`.

[TryStatement](#prod-TryStatement) : try [Block](#prod-Block) [Catch](#prod-Catch) [Finally](#prod-Finally)

1.  If [ContainsUndefinedBreakTarget](#sec-static-semantics-containsundefinedbreaktarget) of [Block](#prod-Block) with argument `labelSet` is true, return true.
2.  If [ContainsUndefinedBreakTarget](#sec-static-semantics-containsundefinedbreaktarget) of [Catch](#prod-Catch) with argument `labelSet` is true, return true.
3.  Return [ContainsUndefinedBreakTarget](#sec-static-semantics-containsundefinedbreaktarget) of [Finally](#prod-Finally) with argument `labelSet`.

[Catch](#prod-Catch) : catch ( [CatchParameter](#prod-CatchParameter) ) [Block](#prod-Block)

1.  Return [ContainsUndefinedBreakTarget](#sec-static-semantics-containsundefinedbreaktarget) of [Block](#prod-Block) with argument `labelSet`.

[FunctionStatementList](#prod-FunctionStatementList) : \[empty\]

1.  Return false.

[ClassStaticBlockStatementList](#prod-ClassStaticBlockStatementList) : \[empty\]

1.  Return false.

[ModuleItemList](#prod-ModuleItemList) : [ModuleItemList](#prod-ModuleItemList) [ModuleItem](#prod-ModuleItem)

1.  Let `hasUndefinedLabels` be [ContainsUndefinedBreakTarget](#sec-static-semantics-containsundefinedbreaktarget) of [ModuleItemList](#prod-ModuleItemList) with argument `labelSet`.
2.  If `hasUndefinedLabels` is true, return true.
3.  Return [ContainsUndefinedBreakTarget](#sec-static-semantics-containsundefinedbreaktarget) of [ModuleItem](#prod-ModuleItem) with argument `labelSet`.

[ModuleItem](#prod-ModuleItem) : [ImportDeclaration](#prod-ImportDeclaration) [ExportDeclaration](#prod-ExportDeclaration)

1.  Return false.

### 8.3.3 Static Semantics: ContainsUndefinedContinueTarget

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) ContainsUndefinedContinueTarget takes arguments `iterationSet` (a [List](#sec-list-and-record-specification-type) of Strings) and `labelSet` (a [List](#sec-list-and-record-specification-type) of Strings) and returns a Boolean. It is defined piecewise over the following productions:

[Statement](#prod-Statement) : [VariableStatement](#prod-VariableStatement) [EmptyStatement](#prod-EmptyStatement) [ExpressionStatement](#prod-ExpressionStatement) [BreakStatement](#prod-BreakStatement) [ReturnStatement](#prod-ReturnStatement) [ThrowStatement](#prod-ThrowStatement) [DebuggerStatement](#prod-DebuggerStatement) [Block](#prod-Block) : { } [StatementListItem](#prod-StatementListItem) : [Declaration](#prod-Declaration)

1.  Return false.

[Statement](#prod-Statement) : [BlockStatement](#prod-BlockStatement)

1.  Return [ContainsUndefinedContinueTarget](#sec-static-semantics-containsundefinedcontinuetarget) of [BlockStatement](#prod-BlockStatement) with arguments `iterationSet` and « ».

[BreakableStatement](#prod-BreakableStatement) : [IterationStatement](#prod-IterationStatement)

1.  Let `newIterationSet` be the [list-concatenation](#list-concatenation) of `iterationSet` and `labelSet`.
2.  Return [ContainsUndefinedContinueTarget](#sec-static-semantics-containsundefinedcontinuetarget) of [IterationStatement](#prod-IterationStatement) with arguments `newIterationSet` and « ».

[StatementList](#prod-StatementList) : [StatementList](#prod-StatementList) [StatementListItem](#prod-StatementListItem)

1.  Let `hasUndefinedLabels` be [ContainsUndefinedContinueTarget](#sec-static-semantics-containsundefinedcontinuetarget) of [StatementList](#prod-StatementList) with arguments `iterationSet` and « ».
2.  If `hasUndefinedLabels` is true, return true.
3.  Return [ContainsUndefinedContinueTarget](#sec-static-semantics-containsundefinedcontinuetarget) of [StatementListItem](#prod-StatementListItem) with arguments `iterationSet` and « ».

[IfStatement](#prod-IfStatement) : if ( [Expression](#prod-Expression) ) [Statement](#prod-Statement) else [Statement](#prod-Statement)

1.  Let `hasUndefinedLabels` be [ContainsUndefinedContinueTarget](#sec-static-semantics-containsundefinedcontinuetarget) of the first [Statement](#prod-Statement) with arguments `iterationSet` and « ».
2.  If `hasUndefinedLabels` is true, return true.
3.  Return [ContainsUndefinedContinueTarget](#sec-static-semantics-containsundefinedcontinuetarget) of the second [Statement](#prod-Statement) with arguments `iterationSet` and « ».

[IfStatement](#prod-IfStatement) : if ( [Expression](#prod-Expression) ) [Statement](#prod-Statement)

1.  Return [ContainsUndefinedContinueTarget](#sec-static-semantics-containsundefinedcontinuetarget) of [Statement](#prod-Statement) with arguments `iterationSet` and « ».

[DoWhileStatement](#prod-DoWhileStatement) : do [Statement](#prod-Statement) while ( [Expression](#prod-Expression) ) ;

1.  Return [ContainsUndefinedContinueTarget](#sec-static-semantics-containsundefinedcontinuetarget) of [Statement](#prod-Statement) with arguments `iterationSet` and « ».

[WhileStatement](#prod-WhileStatement) : while ( [Expression](#prod-Expression) ) [Statement](#prod-Statement)

1.  Return [ContainsUndefinedContinueTarget](#sec-static-semantics-containsundefinedcontinuetarget) of [Statement](#prod-Statement) with arguments `iterationSet` and « ».

[ForStatement](#prod-ForStatement) : for ( [Expression](#prod-Expression)opt ; [Expression](#prod-Expression)opt ; [Expression](#prod-Expression)opt ) [Statement](#prod-Statement) for ( var [VariableDeclarationList](#prod-VariableDeclarationList) ; [Expression](#prod-Expression)opt ; [Expression](#prod-Expression)opt ) [Statement](#prod-Statement) for ( [LexicalDeclaration](#prod-LexicalDeclaration) [Expression](#prod-Expression)opt ; [Expression](#prod-Expression)opt ) [Statement](#prod-Statement)

1.  Return [ContainsUndefinedContinueTarget](#sec-static-semantics-containsundefinedcontinuetarget) of [Statement](#prod-Statement) with arguments `iterationSet` and « ».

[ForInOfStatement](#prod-ForInOfStatement) : for ( [LeftHandSideExpression](#prod-LeftHandSideExpression) in [Expression](#prod-Expression) ) [Statement](#prod-Statement) for ( var [ForBinding](#prod-ForBinding) in [Expression](#prod-Expression) ) [Statement](#prod-Statement) for ( [ForDeclaration](#prod-ForDeclaration) in [Expression](#prod-Expression) ) [Statement](#prod-Statement) for ( [LeftHandSideExpression](#prod-LeftHandSideExpression) of [AssignmentExpression](#prod-AssignmentExpression) ) [Statement](#prod-Statement) for ( var [ForBinding](#prod-ForBinding) of [AssignmentExpression](#prod-AssignmentExpression) ) [Statement](#prod-Statement) for ( [ForDeclaration](#prod-ForDeclaration) of [AssignmentExpression](#prod-AssignmentExpression) ) [Statement](#prod-Statement) for await ( [LeftHandSideExpression](#prod-LeftHandSideExpression) of [AssignmentExpression](#prod-AssignmentExpression) ) [Statement](#prod-Statement) for await ( var [ForBinding](#prod-ForBinding) of [AssignmentExpression](#prod-AssignmentExpression) ) [Statement](#prod-Statement) for await ( [ForDeclaration](#prod-ForDeclaration) of [AssignmentExpression](#prod-AssignmentExpression) ) [Statement](#prod-Statement)

1.  Return [ContainsUndefinedContinueTarget](#sec-static-semantics-containsundefinedcontinuetarget) of [Statement](#prod-Statement) with arguments `iterationSet` and « ».

Note

This section is extended by Annex [B.3.5](#sec-initializers-in-forin-statement-heads).

[ContinueStatement](#prod-ContinueStatement) : continue ;

1.  Return false.

[ContinueStatement](#prod-ContinueStatement) : continue [LabelIdentifier](#prod-LabelIdentifier) ;

1.  If `iterationSet` does not contain the [StringValue](#sec-static-semantics-stringvalue) of [LabelIdentifier](#prod-LabelIdentifier), return true.
2.  Return false.

[WithStatement](#prod-WithStatement) : with ( [Expression](#prod-Expression) ) [Statement](#prod-Statement)

1.  Return [ContainsUndefinedContinueTarget](#sec-static-semantics-containsundefinedcontinuetarget) of [Statement](#prod-Statement) with arguments `iterationSet` and « ».

[SwitchStatement](#prod-SwitchStatement) : switch ( [Expression](#prod-Expression) ) [CaseBlock](#prod-CaseBlock)

1.  Return [ContainsUndefinedContinueTarget](#sec-static-semantics-containsundefinedcontinuetarget) of [CaseBlock](#prod-CaseBlock) with arguments `iterationSet` and « ».

[CaseBlock](#prod-CaseBlock) : { }

1.  Return false.

[CaseBlock](#prod-CaseBlock) : { [CaseClauses](#prod-CaseClauses)opt [DefaultClause](#prod-DefaultClause) [CaseClauses](#prod-CaseClauses)opt }

1.  If the first [CaseClauses](#prod-CaseClauses) is present, then
    1.  If [ContainsUndefinedContinueTarget](#sec-static-semantics-containsundefinedcontinuetarget) of the first [CaseClauses](#prod-CaseClauses) with arguments `iterationSet` and « » is true, return true.
2.  If [ContainsUndefinedContinueTarget](#sec-static-semantics-containsundefinedcontinuetarget) of [DefaultClause](#prod-DefaultClause) with arguments `iterationSet` and « » is true, return true.
3.  If the second [CaseClauses](#prod-CaseClauses) is not present, return false.
4.  Return [ContainsUndefinedContinueTarget](#sec-static-semantics-containsundefinedcontinuetarget) of the second [CaseClauses](#prod-CaseClauses) with arguments `iterationSet` and « ».

[CaseClauses](#prod-CaseClauses) : [CaseClauses](#prod-CaseClauses) [CaseClause](#prod-CaseClause)

1.  Let `hasUndefinedLabels` be [ContainsUndefinedContinueTarget](#sec-static-semantics-containsundefinedcontinuetarget) of [CaseClauses](#prod-CaseClauses) with arguments `iterationSet` and « ».
2.  If `hasUndefinedLabels` is true, return true.
3.  Return [ContainsUndefinedContinueTarget](#sec-static-semantics-containsundefinedcontinuetarget) of [CaseClause](#prod-CaseClause) with arguments `iterationSet` and « ».

[CaseClause](#prod-CaseClause) : case [Expression](#prod-Expression) : [StatementList](#prod-StatementList)opt

1.  If the [StatementList](#prod-StatementList) is present, return [ContainsUndefinedContinueTarget](#sec-static-semantics-containsundefinedcontinuetarget) of [StatementList](#prod-StatementList) with arguments `iterationSet` and « ».
2.  Return false.

[DefaultClause](#prod-DefaultClause) : default : [StatementList](#prod-StatementList)opt

1.  If the [StatementList](#prod-StatementList) is present, return [ContainsUndefinedContinueTarget](#sec-static-semantics-containsundefinedcontinuetarget) of [StatementList](#prod-StatementList) with arguments `iterationSet` and « ».
2.  Return false.

[LabelledStatement](#prod-LabelledStatement) : [LabelIdentifier](#prod-LabelIdentifier) : [LabelledItem](#prod-LabelledItem)

1.  Let `label` be the [StringValue](#sec-static-semantics-stringvalue) of [LabelIdentifier](#prod-LabelIdentifier).
2.  Let `newLabelSet` be the [list-concatenation](#list-concatenation) of `labelSet` and « `label` ».
3.  Return [ContainsUndefinedContinueTarget](#sec-static-semantics-containsundefinedcontinuetarget) of [LabelledItem](#prod-LabelledItem) with arguments `iterationSet` and `newLabelSet`.

[LabelledItem](#prod-LabelledItem) : [FunctionDeclaration](#prod-FunctionDeclaration)

1.  Return false.

[TryStatement](#prod-TryStatement) : try [Block](#prod-Block) [Catch](#prod-Catch)

1.  Let `hasUndefinedLabels` be [ContainsUndefinedContinueTarget](#sec-static-semantics-containsundefinedcontinuetarget) of [Block](#prod-Block) with arguments `iterationSet` and « ».
2.  If `hasUndefinedLabels` is true, return true.
3.  Return [ContainsUndefinedContinueTarget](#sec-static-semantics-containsundefinedcontinuetarget) of [Catch](#prod-Catch) with arguments `iterationSet` and « ».

[TryStatement](#prod-TryStatement) : try [Block](#prod-Block) [Finally](#prod-Finally)

1.  Let `hasUndefinedLabels` be [ContainsUndefinedContinueTarget](#sec-static-semantics-containsundefinedcontinuetarget) of [Block](#prod-Block) with arguments `iterationSet` and « ».
2.  If `hasUndefinedLabels` is true, return true.
3.  Return [ContainsUndefinedContinueTarget](#sec-static-semantics-containsundefinedcontinuetarget) of [Finally](#prod-Finally) with arguments `iterationSet` and « ».

[TryStatement](#prod-TryStatement) : try [Block](#prod-Block) [Catch](#prod-Catch) [Finally](#prod-Finally)

1.  If [ContainsUndefinedContinueTarget](#sec-static-semantics-containsundefinedcontinuetarget) of [Block](#prod-Block) with arguments `iterationSet` and « » is true, return true.
2.  If [ContainsUndefinedContinueTarget](#sec-static-semantics-containsundefinedcontinuetarget) of [Catch](#prod-Catch) with arguments `iterationSet` and « » is true, return true.
3.  Return [ContainsUndefinedContinueTarget](#sec-static-semantics-containsundefinedcontinuetarget) of [Finally](#prod-Finally) with arguments `iterationSet` and « ».

[Catch](#prod-Catch) : catch ( [CatchParameter](#prod-CatchParameter) ) [Block](#prod-Block)

1.  Return [ContainsUndefinedContinueTarget](#sec-static-semantics-containsundefinedcontinuetarget) of [Block](#prod-Block) with arguments `iterationSet` and « ».

[FunctionStatementList](#prod-FunctionStatementList) : \[empty\]

1.  Return false.

[ClassStaticBlockStatementList](#prod-ClassStaticBlockStatementList) : \[empty\]

1.  Return false.

[ModuleItemList](#prod-ModuleItemList) : [ModuleItemList](#prod-ModuleItemList) [ModuleItem](#prod-ModuleItem)

1.  Let `hasUndefinedLabels` be [ContainsUndefinedContinueTarget](#sec-static-semantics-containsundefinedcontinuetarget) of [ModuleItemList](#prod-ModuleItemList) with arguments `iterationSet` and « ».
2.  If `hasUndefinedLabels` is true, return true.
3.  Return [ContainsUndefinedContinueTarget](#sec-static-semantics-containsundefinedcontinuetarget) of [ModuleItem](#prod-ModuleItem) with arguments `iterationSet` and « ».

[ModuleItem](#prod-ModuleItem) : [ImportDeclaration](#prod-ImportDeclaration) [ExportDeclaration](#prod-ExportDeclaration)

1.  Return false.

## 8.4 Function Name Inference

### 8.4.1 Static Semantics: HasName

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) HasName takes no arguments and returns a Boolean. It is defined piecewise over the following productions:

[PrimaryExpression](#prod-PrimaryExpression) : [CoverParenthesizedExpressionAndArrowParameterList](#prod-CoverParenthesizedExpressionAndArrowParameterList)

1.  Let `expr` be the [ParenthesizedExpression](#prod-ParenthesizedExpression) that is [covered](#sec-syntactic-grammar) by [CoverParenthesizedExpressionAndArrowParameterList](#prod-CoverParenthesizedExpressionAndArrowParameterList).
2.  If [IsFunctionDefinition](#sec-static-semantics-isfunctiondefinition) of `expr` is false, return false.
3.  Return [HasName](#sec-static-semantics-hasname) of `expr`.

[FunctionExpression](#prod-FunctionExpression) : function ( [FormalParameters](#prod-FormalParameters) ) { [FunctionBody](#prod-FunctionBody) } [GeneratorExpression](#prod-GeneratorExpression) : function \* ( [FormalParameters](#prod-FormalParameters) ) { [GeneratorBody](#prod-GeneratorBody) } [AsyncGeneratorExpression](#prod-AsyncGeneratorExpression) : async function \* ( [FormalParameters](#prod-FormalParameters) ) { [AsyncGeneratorBody](#prod-AsyncGeneratorBody) } [AsyncFunctionExpression](#prod-AsyncFunctionExpression) : async function ( [FormalParameters](#prod-FormalParameters) ) { [AsyncFunctionBody](#prod-AsyncFunctionBody) } [ArrowFunction](#prod-ArrowFunction) : [ArrowParameters](#prod-ArrowParameters) =\> [ConciseBody](#prod-ConciseBody) [AsyncArrowFunction](#prod-AsyncArrowFunction) : async [AsyncArrowBindingIdentifier](#prod-AsyncArrowBindingIdentifier) =\> [AsyncConciseBody](#prod-AsyncConciseBody) [CoverCallExpressionAndAsyncArrowHead](#prod-CoverCallExpressionAndAsyncArrowHead) =\> [AsyncConciseBody](#prod-AsyncConciseBody) [ClassExpression](#prod-ClassExpression) : class [ClassTail](#prod-ClassTail)

1.  Return false.

[FunctionExpression](#prod-FunctionExpression) : function [BindingIdentifier](#prod-BindingIdentifier) ( [FormalParameters](#prod-FormalParameters) ) { [FunctionBody](#prod-FunctionBody) } [GeneratorExpression](#prod-GeneratorExpression) : function \* [BindingIdentifier](#prod-BindingIdentifier) ( [FormalParameters](#prod-FormalParameters) ) { [GeneratorBody](#prod-GeneratorBody) } [AsyncGeneratorExpression](#prod-AsyncGeneratorExpression) : async function \* [BindingIdentifier](#prod-BindingIdentifier) ( [FormalParameters](#prod-FormalParameters) ) { [AsyncGeneratorBody](#prod-AsyncGeneratorBody) } [AsyncFunctionExpression](#prod-AsyncFunctionExpression) : async function [BindingIdentifier](#prod-BindingIdentifier) ( [FormalParameters](#prod-FormalParameters) ) { [AsyncFunctionBody](#prod-AsyncFunctionBody) } [ClassExpression](#prod-ClassExpression) : class [BindingIdentifier](#prod-BindingIdentifier) [ClassTail](#prod-ClassTail)

1.  Return true.

### 8.4.2 Static Semantics: IsFunctionDefinition

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) IsFunctionDefinition takes no arguments and returns a Boolean. It is defined piecewise over the following productions:

[PrimaryExpression](#prod-PrimaryExpression) : [CoverParenthesizedExpressionAndArrowParameterList](#prod-CoverParenthesizedExpressionAndArrowParameterList)

1.  Let `expr` be the [ParenthesizedExpression](#prod-ParenthesizedExpression) that is [covered](#sec-syntactic-grammar) by [CoverParenthesizedExpressionAndArrowParameterList](#prod-CoverParenthesizedExpressionAndArrowParameterList).
2.  Return [IsFunctionDefinition](#sec-static-semantics-isfunctiondefinition) of `expr`.

[PrimaryExpression](#prod-PrimaryExpression) : this [IdentifierReference](#prod-IdentifierReference) [Literal](#prod-Literal) [ArrayLiteral](#prod-ArrayLiteral) [ObjectLiteral](#prod-ObjectLiteral) [RegularExpressionLiteral](#prod-RegularExpressionLiteral) [TemplateLiteral](#prod-TemplateLiteral) [MemberExpression](#prod-MemberExpression) : [MemberExpression](#prod-MemberExpression) \[ [Expression](#prod-Expression) \] [MemberExpression](#prod-MemberExpression) . [IdentifierName](#prod-IdentifierName) [MemberExpression](#prod-MemberExpression) [TemplateLiteral](#prod-TemplateLiteral) [SuperProperty](#prod-SuperProperty) [MetaProperty](#prod-MetaProperty) new [MemberExpression](#prod-MemberExpression) [Arguments](#prod-Arguments) [MemberExpression](#prod-MemberExpression) . [PrivateIdentifier](#prod-PrivateIdentifier) [NewExpression](#prod-NewExpression) : new [NewExpression](#prod-NewExpression) [LeftHandSideExpression](#prod-LeftHandSideExpression) : [CallExpression](#prod-CallExpression) [OptionalExpression](#prod-OptionalExpression) [UpdateExpression](#prod-UpdateExpression) : [LeftHandSideExpression](#prod-LeftHandSideExpression) ++ [LeftHandSideExpression](#prod-LeftHandSideExpression) -- ++ [UnaryExpression](#prod-UnaryExpression) -- [UnaryExpression](#prod-UnaryExpression) [UnaryExpression](#prod-UnaryExpression) : delete [UnaryExpression](#prod-UnaryExpression) void [UnaryExpression](#prod-UnaryExpression) typeof [UnaryExpression](#prod-UnaryExpression) + [UnaryExpression](#prod-UnaryExpression) - [UnaryExpression](#prod-UnaryExpression) ~ [UnaryExpression](#prod-UnaryExpression) ! [UnaryExpression](#prod-UnaryExpression) [AwaitExpression](#prod-AwaitExpression) [ExponentiationExpression](#prod-ExponentiationExpression) : [UpdateExpression](#prod-UpdateExpression) \*\* [ExponentiationExpression](#prod-ExponentiationExpression) [MultiplicativeExpression](#prod-MultiplicativeExpression) : [MultiplicativeExpression](#prod-MultiplicativeExpression) [MultiplicativeOperator](#prod-MultiplicativeOperator) [ExponentiationExpression](#prod-ExponentiationExpression) [AdditiveExpression](#prod-AdditiveExpression) : [AdditiveExpression](#prod-AdditiveExpression) + [MultiplicativeExpression](#prod-MultiplicativeExpression) [AdditiveExpression](#prod-AdditiveExpression) - [MultiplicativeExpression](#prod-MultiplicativeExpression) [ShiftExpression](#prod-ShiftExpression) : [ShiftExpression](#prod-ShiftExpression) \<\< [AdditiveExpression](#prod-AdditiveExpression) [ShiftExpression](#prod-ShiftExpression) \>\> [AdditiveExpression](#prod-AdditiveExpression) [ShiftExpression](#prod-ShiftExpression) \>\>\> [AdditiveExpression](#prod-AdditiveExpression) [RelationalExpression](#prod-RelationalExpression) : [RelationalExpression](#prod-RelationalExpression) \< [ShiftExpression](#prod-ShiftExpression) [RelationalExpression](#prod-RelationalExpression) \> [ShiftExpression](#prod-ShiftExpression) [RelationalExpression](#prod-RelationalExpression) \<= [ShiftExpression](#prod-ShiftExpression) [RelationalExpression](#prod-RelationalExpression) \>= [ShiftExpression](#prod-ShiftExpression) [RelationalExpression](#prod-RelationalExpression) instanceof [ShiftExpression](#prod-ShiftExpression) [RelationalExpression](#prod-RelationalExpression) in [ShiftExpression](#prod-ShiftExpression) [PrivateIdentifier](#prod-PrivateIdentifier) in [ShiftExpression](#prod-ShiftExpression) [EqualityExpression](#prod-EqualityExpression) : [EqualityExpression](#prod-EqualityExpression) == [RelationalExpression](#prod-RelationalExpression) [EqualityExpression](#prod-EqualityExpression) != [RelationalExpression](#prod-RelationalExpression) [EqualityExpression](#prod-EqualityExpression) === [RelationalExpression](#prod-RelationalExpression) [EqualityExpression](#prod-EqualityExpression) !== [RelationalExpression](#prod-RelationalExpression) [BitwiseANDExpression](#prod-BitwiseANDExpression) : [BitwiseANDExpression](#prod-BitwiseANDExpression) & [EqualityExpression](#prod-EqualityExpression) [BitwiseXORExpression](#prod-BitwiseXORExpression) : [BitwiseXORExpression](#prod-BitwiseXORExpression) ^ [BitwiseANDExpression](#prod-BitwiseANDExpression) [BitwiseORExpression](#prod-BitwiseORExpression) : [BitwiseORExpression](#prod-BitwiseORExpression) \| [BitwiseXORExpression](#prod-BitwiseXORExpression) [LogicalANDExpression](#prod-LogicalANDExpression) : [LogicalANDExpression](#prod-LogicalANDExpression) && [BitwiseORExpression](#prod-BitwiseORExpression) [LogicalORExpression](#prod-LogicalORExpression) : [LogicalORExpression](#prod-LogicalORExpression) \|\| [LogicalANDExpression](#prod-LogicalANDExpression) [CoalesceExpression](#prod-CoalesceExpression) : [CoalesceExpressionHead](#prod-CoalesceExpressionHead) ?? [BitwiseORExpression](#prod-BitwiseORExpression) [ConditionalExpression](#prod-ConditionalExpression) : [ShortCircuitExpression](#prod-ShortCircuitExpression) ? [AssignmentExpression](#prod-AssignmentExpression) : [AssignmentExpression](#prod-AssignmentExpression) [AssignmentExpression](#prod-AssignmentExpression) : [YieldExpression](#prod-YieldExpression) [LeftHandSideExpression](#prod-LeftHandSideExpression) = [AssignmentExpression](#prod-AssignmentExpression) [LeftHandSideExpression](#prod-LeftHandSideExpression) [AssignmentOperator](#prod-AssignmentOperator) [AssignmentExpression](#prod-AssignmentExpression) [LeftHandSideExpression](#prod-LeftHandSideExpression) &&= [AssignmentExpression](#prod-AssignmentExpression) [LeftHandSideExpression](#prod-LeftHandSideExpression) \|\|= [AssignmentExpression](#prod-AssignmentExpression) [LeftHandSideExpression](#prod-LeftHandSideExpression) ??= [AssignmentExpression](#prod-AssignmentExpression) [Expression](#prod-Expression) : [Expression](#prod-Expression) , [AssignmentExpression](#prod-AssignmentExpression)

1.  Return false.

[AssignmentExpression](#prod-AssignmentExpression) : [ArrowFunction](#prod-ArrowFunction) [AsyncArrowFunction](#prod-AsyncArrowFunction) [FunctionExpression](#prod-FunctionExpression) : function [BindingIdentifier](#prod-BindingIdentifier)opt ( [FormalParameters](#prod-FormalParameters) ) { [FunctionBody](#prod-FunctionBody) } [GeneratorExpression](#prod-GeneratorExpression) : function \* [BindingIdentifier](#prod-BindingIdentifier)opt ( [FormalParameters](#prod-FormalParameters) ) { [GeneratorBody](#prod-GeneratorBody) } [AsyncGeneratorExpression](#prod-AsyncGeneratorExpression) : async function \* [BindingIdentifier](#prod-BindingIdentifier)opt ( [FormalParameters](#prod-FormalParameters) ) { [AsyncGeneratorBody](#prod-AsyncGeneratorBody) } [AsyncFunctionExpression](#prod-AsyncFunctionExpression) : async function [BindingIdentifier](#prod-BindingIdentifier)opt ( [FormalParameters](#prod-FormalParameters) ) { [AsyncFunctionBody](#prod-AsyncFunctionBody) } [ClassExpression](#prod-ClassExpression) : class [BindingIdentifier](#prod-BindingIdentifier)opt [ClassTail](#prod-ClassTail)

1.  Return true.

### 8.4.3 Static Semantics: IsAnonymousFunctionDefinition ( `expr` )

The abstract operation IsAnonymousFunctionDefinition takes argument `expr` (an [AssignmentExpression](#prod-AssignmentExpression) [Parse Node](#sec-syntactic-grammar), an [Initializer](#prod-Initializer) [Parse Node](#sec-syntactic-grammar), or an [Expression](#prod-Expression) [Parse Node](#sec-syntactic-grammar)) and returns a Boolean. It determines if its argument is a function definition that does not bind a name. It performs the following steps when called:

1.  If [IsFunctionDefinition](#sec-static-semantics-isfunctiondefinition) of `expr` is false, return false.
2.  Let `hasName` be [HasName](#sec-static-semantics-hasname) of `expr`.
3.  If `hasName` is true, return false.
4.  Return true.

### 8.4.4 Static Semantics: IsIdentifierRef

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) IsIdentifierRef takes no arguments and returns a Boolean. It is defined piecewise over the following productions:

[PrimaryExpression](#prod-PrimaryExpression) : [IdentifierReference](#prod-IdentifierReference)

1.  Return true.

[PrimaryExpression](#prod-PrimaryExpression) : this [Literal](#prod-Literal) [ArrayLiteral](#prod-ArrayLiteral) [ObjectLiteral](#prod-ObjectLiteral) [FunctionExpression](#prod-FunctionExpression) [ClassExpression](#prod-ClassExpression) [GeneratorExpression](#prod-GeneratorExpression) [AsyncFunctionExpression](#prod-AsyncFunctionExpression) [AsyncGeneratorExpression](#prod-AsyncGeneratorExpression) [RegularExpressionLiteral](#prod-RegularExpressionLiteral) [TemplateLiteral](#prod-TemplateLiteral) [CoverParenthesizedExpressionAndArrowParameterList](#prod-CoverParenthesizedExpressionAndArrowParameterList) [MemberExpression](#prod-MemberExpression) : [MemberExpression](#prod-MemberExpression) \[ [Expression](#prod-Expression) \] [MemberExpression](#prod-MemberExpression) . [IdentifierName](#prod-IdentifierName) [MemberExpression](#prod-MemberExpression) [TemplateLiteral](#prod-TemplateLiteral) [SuperProperty](#prod-SuperProperty) [MetaProperty](#prod-MetaProperty) new [MemberExpression](#prod-MemberExpression) [Arguments](#prod-Arguments) [MemberExpression](#prod-MemberExpression) . [PrivateIdentifier](#prod-PrivateIdentifier) [NewExpression](#prod-NewExpression) : new [NewExpression](#prod-NewExpression) [LeftHandSideExpression](#prod-LeftHandSideExpression) : [CallExpression](#prod-CallExpression) [OptionalExpression](#prod-OptionalExpression)

1.  Return false.

### 8.4.5 Runtime Semantics: NamedEvaluation

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) NamedEvaluation takes argument `name` (a [property key](#property-key) or a [Private Name](#sec-private-names)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a [function object](#function-object) or an [abrupt completion](#sec-completion-record-specification-type). It is defined piecewise over the following productions:

[PrimaryExpression](#prod-PrimaryExpression) : [CoverParenthesizedExpressionAndArrowParameterList](#prod-CoverParenthesizedExpressionAndArrowParameterList)

1.  Let `expr` be the [ParenthesizedExpression](#prod-ParenthesizedExpression) that is [covered](#sec-syntactic-grammar) by [CoverParenthesizedExpressionAndArrowParameterList](#prod-CoverParenthesizedExpressionAndArrowParameterList).
2.  Return ? [NamedEvaluation](#sec-runtime-semantics-namedevaluation) of `expr` with argument `name`.

[ParenthesizedExpression](#prod-ParenthesizedExpression) : ( [Expression](#prod-Expression) )

1.  [Assert](#assert): [IsAnonymousFunctionDefinition](#sec-isanonymousfunctiondefinition)([Expression](#prod-Expression)) is true.
2.  Return ? [NamedEvaluation](#sec-runtime-semantics-namedevaluation) of [Expression](#prod-Expression) with argument `name`.

[FunctionExpression](#prod-FunctionExpression) : function ( [FormalParameters](#prod-FormalParameters) ) { [FunctionBody](#prod-FunctionBody) }

1.  Return [InstantiateOrdinaryFunctionExpression](#sec-runtime-semantics-instantiateordinaryfunctionexpression) of [FunctionExpression](#prod-FunctionExpression) with argument `name`.

[GeneratorExpression](#prod-GeneratorExpression) : function \* ( [FormalParameters](#prod-FormalParameters) ) { [GeneratorBody](#prod-GeneratorBody) }

1.  Return [InstantiateGeneratorFunctionExpression](#sec-runtime-semantics-instantiategeneratorfunctionexpression) of [GeneratorExpression](#prod-GeneratorExpression) with argument `name`.

[AsyncGeneratorExpression](#prod-AsyncGeneratorExpression) : async function \* ( [FormalParameters](#prod-FormalParameters) ) { [AsyncGeneratorBody](#prod-AsyncGeneratorBody) }

1.  Return [InstantiateAsyncGeneratorFunctionExpression](#sec-runtime-semantics-instantiateasyncgeneratorfunctionexpression) of [AsyncGeneratorExpression](#prod-AsyncGeneratorExpression) with argument `name`.

[AsyncFunctionExpression](#prod-AsyncFunctionExpression) : async function ( [FormalParameters](#prod-FormalParameters) ) { [AsyncFunctionBody](#prod-AsyncFunctionBody) }

1.  Return [InstantiateAsyncFunctionExpression](#sec-runtime-semantics-instantiateasyncfunctionexpression) of [AsyncFunctionExpression](#prod-AsyncFunctionExpression) with argument `name`.

[ArrowFunction](#prod-ArrowFunction) : [ArrowParameters](#prod-ArrowParameters) =\> [ConciseBody](#prod-ConciseBody)

1.  Return [InstantiateArrowFunctionExpression](#sec-runtime-semantics-instantiatearrowfunctionexpression) of [ArrowFunction](#prod-ArrowFunction) with argument `name`.

[AsyncArrowFunction](#prod-AsyncArrowFunction) : async [AsyncArrowBindingIdentifier](#prod-AsyncArrowBindingIdentifier) =\> [AsyncConciseBody](#prod-AsyncConciseBody) [CoverCallExpressionAndAsyncArrowHead](#prod-CoverCallExpressionAndAsyncArrowHead) =\> [AsyncConciseBody](#prod-AsyncConciseBody)

1.  Return [InstantiateAsyncArrowFunctionExpression](#sec-runtime-semantics-instantiateasyncarrowfunctionexpression) of [AsyncArrowFunction](#prod-AsyncArrowFunction) with argument `name`.

[ClassExpression](#prod-ClassExpression) : class [ClassTail](#prod-ClassTail)

1.  Let `value` be ? [ClassDefinitionEvaluation](#sec-runtime-semantics-classdefinitionevaluation) of [ClassTail](#prod-ClassTail) with arguments undefined and `name`.
2.  Set `value`.`[[SourceText]]` to the [source text matched by](#sec-algorithm-conventions-syntax-directed-operations) [ClassExpression](#prod-ClassExpression).
3.  Return `value`.

## 8.5 Contains

### 8.5.1 Static Semantics: Contains

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) Contains takes argument `symbol` (a grammar symbol) and returns a Boolean.

Every grammar production alternative in this specification which is not listed below implicitly has the following default definition of Contains:

1.  For each child node `child` of this [Parse Node](#sec-syntactic-grammar), do
    1.  If `child` is an instance of `symbol`, return true.
    2.  If `child` is an instance of a nonterminal, then
        1.  Let `contained` be the result of `child` [Contains](#sec-static-semantics-contains) `symbol`.
        2.  If `contained` is true, return true.
2.  Return false.

[FunctionDeclaration](#prod-FunctionDeclaration) : function [BindingIdentifier](#prod-BindingIdentifier) ( [FormalParameters](#prod-FormalParameters) ) { [FunctionBody](#prod-FunctionBody) } function ( [FormalParameters](#prod-FormalParameters) ) { [FunctionBody](#prod-FunctionBody) } [FunctionExpression](#prod-FunctionExpression) : function [BindingIdentifier](#prod-BindingIdentifier)opt ( [FormalParameters](#prod-FormalParameters) ) { [FunctionBody](#prod-FunctionBody) } [GeneratorDeclaration](#prod-GeneratorDeclaration) : function \* [BindingIdentifier](#prod-BindingIdentifier) ( [FormalParameters](#prod-FormalParameters) ) { [GeneratorBody](#prod-GeneratorBody) } function \* ( [FormalParameters](#prod-FormalParameters) ) { [GeneratorBody](#prod-GeneratorBody) } [GeneratorExpression](#prod-GeneratorExpression) : function \* [BindingIdentifier](#prod-BindingIdentifier)opt ( [FormalParameters](#prod-FormalParameters) ) { [GeneratorBody](#prod-GeneratorBody) } [AsyncGeneratorDeclaration](#prod-AsyncGeneratorDeclaration) : async function \* [BindingIdentifier](#prod-BindingIdentifier) ( [FormalParameters](#prod-FormalParameters) ) { [AsyncGeneratorBody](#prod-AsyncGeneratorBody) } async function \* ( [FormalParameters](#prod-FormalParameters) ) { [AsyncGeneratorBody](#prod-AsyncGeneratorBody) } [AsyncGeneratorExpression](#prod-AsyncGeneratorExpression) : async function \* [BindingIdentifier](#prod-BindingIdentifier)opt ( [FormalParameters](#prod-FormalParameters) ) { [AsyncGeneratorBody](#prod-AsyncGeneratorBody) } [AsyncFunctionDeclaration](#prod-AsyncFunctionDeclaration) : async function [BindingIdentifier](#prod-BindingIdentifier) ( [FormalParameters](#prod-FormalParameters) ) { [AsyncFunctionBody](#prod-AsyncFunctionBody) } async function ( [FormalParameters](#prod-FormalParameters) ) { [AsyncFunctionBody](#prod-AsyncFunctionBody) } [AsyncFunctionExpression](#prod-AsyncFunctionExpression) : async function [BindingIdentifier](#prod-BindingIdentifier)opt ( [FormalParameters](#prod-FormalParameters) ) { [AsyncFunctionBody](#prod-AsyncFunctionBody) }

1.  Return false.

Note 1

Static semantic rules that depend upon substructure generally do not look into function definitions.

[ClassTail](#prod-ClassTail) : [ClassHeritage](#prod-ClassHeritage)opt { [ClassBody](#prod-ClassBody) }

1.  If `symbol` is [ClassBody](#prod-ClassBody), return true.
2.  If `symbol` is [ClassHeritage](#prod-ClassHeritage), then
    1.  If [ClassHeritage](#prod-ClassHeritage) is present, return true; otherwise return false.
3.  If [ClassHeritage](#prod-ClassHeritage) is present, then
    1.  If [ClassHeritage](#prod-ClassHeritage) [Contains](#sec-static-semantics-contains) `symbol` is true, return true.
4.  Return the result of [ComputedPropertyContains](#sec-static-semantics-computedpropertycontains) of [ClassBody](#prod-ClassBody) with argument `symbol`.

Note 2

Static semantic rules that depend upon substructure generally do not look into class bodies except for [PropertyName](#prod-PropertyName)s.

[ClassStaticBlock](#prod-ClassStaticBlock) : static { [ClassStaticBlockBody](#prod-ClassStaticBlockBody) }

1.  Return false.

Note 3

Static semantic rules that depend upon substructure generally do not look into `static` initialization blocks.

[ArrowFunction](#prod-ArrowFunction) : [ArrowParameters](#prod-ArrowParameters) =\> [ConciseBody](#prod-ConciseBody)

1.  If `symbol` is not one of [NewTarget](#prod-NewTarget), [SuperProperty](#prod-SuperProperty), [SuperCall](#prod-SuperCall), `super`, or `this`, return false.
2.  If [ArrowParameters](#prod-ArrowParameters) [Contains](#sec-static-semantics-contains) `symbol` is true, return true.
3.  Return [ConciseBody](#prod-ConciseBody) [Contains](#sec-static-semantics-contains) `symbol`.

[ArrowParameters](#prod-ArrowParameters) : [CoverParenthesizedExpressionAndArrowParameterList](#prod-CoverParenthesizedExpressionAndArrowParameterList)

1.  Let `formals` be the [ArrowFormalParameters](#prod-ArrowFormalParameters) that is [covered](#sec-syntactic-grammar) by [CoverParenthesizedExpressionAndArrowParameterList](#prod-CoverParenthesizedExpressionAndArrowParameterList).
2.  Return `formals` [Contains](#sec-static-semantics-contains) `symbol`.

[AsyncArrowFunction](#prod-AsyncArrowFunction) : async [AsyncArrowBindingIdentifier](#prod-AsyncArrowBindingIdentifier) =\> [AsyncConciseBody](#prod-AsyncConciseBody)

1.  If `symbol` is not one of [NewTarget](#prod-NewTarget), [SuperProperty](#prod-SuperProperty), [SuperCall](#prod-SuperCall), `super`, or `this`, return false.
2.  Return [AsyncConciseBody](#prod-AsyncConciseBody) [Contains](#sec-static-semantics-contains) `symbol`.

[AsyncArrowFunction](#prod-AsyncArrowFunction) : [CoverCallExpressionAndAsyncArrowHead](#prod-CoverCallExpressionAndAsyncArrowHead) =\> [AsyncConciseBody](#prod-AsyncConciseBody)

1.  If `symbol` is not one of [NewTarget](#prod-NewTarget), [SuperProperty](#prod-SuperProperty), [SuperCall](#prod-SuperCall), `super`, or `this`, return false.
2.  Let `head` be the [AsyncArrowHead](#prod-AsyncArrowHead) that is [covered](#sec-syntactic-grammar) by [CoverCallExpressionAndAsyncArrowHead](#prod-CoverCallExpressionAndAsyncArrowHead).
3.  If `head` [Contains](#sec-static-semantics-contains) `symbol` is true, return true.
4.  Return [AsyncConciseBody](#prod-AsyncConciseBody) [Contains](#sec-static-semantics-contains) `symbol`.

Note 4

Contains is used to detect `new.target`, `this`, and `super` usage within an [ArrowFunction](#prod-ArrowFunction) or [AsyncArrowFunction](#prod-AsyncArrowFunction).

[PropertyDefinition](#prod-PropertyDefinition) : [MethodDefinition](#prod-MethodDefinition)

1.  If `symbol` is [MethodDefinition](#prod-MethodDefinition), return true.
2.  Return the result of [ComputedPropertyContains](#sec-static-semantics-computedpropertycontains) of [MethodDefinition](#prod-MethodDefinition) with argument `symbol`.

[LiteralPropertyName](#prod-LiteralPropertyName) : [IdentifierName](#prod-IdentifierName)

1.  Return false.

[MemberExpression](#prod-MemberExpression) : [MemberExpression](#prod-MemberExpression) . [IdentifierName](#prod-IdentifierName)

1.  If [MemberExpression](#prod-MemberExpression) [Contains](#sec-static-semantics-contains) `symbol` is true, return true.
2.  Return false.

[SuperProperty](#prod-SuperProperty) : super . [IdentifierName](#prod-IdentifierName)

1.  If `symbol` is the [ReservedWord](#prod-ReservedWord) `super`, return true.
2.  Return false.

[CallExpression](#prod-CallExpression) : [CallExpression](#prod-CallExpression) . [IdentifierName](#prod-IdentifierName)

1.  If [CallExpression](#prod-CallExpression) [Contains](#sec-static-semantics-contains) `symbol` is true, return true.
2.  Return false.

[OptionalChain](#prod-OptionalChain) : ?. [IdentifierName](#prod-IdentifierName)

1.  Return false.

[OptionalChain](#prod-OptionalChain) : [OptionalChain](#prod-OptionalChain) . [IdentifierName](#prod-IdentifierName)

1.  If [OptionalChain](#prod-OptionalChain) [Contains](#sec-static-semantics-contains) `symbol` is true, return true.
2.  Return false.

### 8.5.2 Static Semantics: ComputedPropertyContains

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) ComputedPropertyContains takes argument `symbol` (a grammar symbol) and returns a Boolean. It is defined piecewise over the following productions:

[ClassElementName](#prod-ClassElementName) : [PrivateIdentifier](#prod-PrivateIdentifier) [PropertyName](#prod-PropertyName) : [LiteralPropertyName](#prod-LiteralPropertyName)

1.  Return false.

[PropertyName](#prod-PropertyName) : [ComputedPropertyName](#prod-ComputedPropertyName)

1.  Return the result of [ComputedPropertyName](#prod-ComputedPropertyName) [Contains](#sec-static-semantics-contains) `symbol`.

[MethodDefinition](#prod-MethodDefinition) : [ClassElementName](#prod-ClassElementName) ( [UniqueFormalParameters](#prod-UniqueFormalParameters) ) { [FunctionBody](#prod-FunctionBody) } get [ClassElementName](#prod-ClassElementName) ( ) { [FunctionBody](#prod-FunctionBody) } set [ClassElementName](#prod-ClassElementName) ( [PropertySetParameterList](#prod-PropertySetParameterList) ) { [FunctionBody](#prod-FunctionBody) }

1.  Return the result of [ComputedPropertyContains](#sec-static-semantics-computedpropertycontains) of [ClassElementName](#prod-ClassElementName) with argument `symbol`.

[GeneratorMethod](#prod-GeneratorMethod) : \* [ClassElementName](#prod-ClassElementName) ( [UniqueFormalParameters](#prod-UniqueFormalParameters) ) { [GeneratorBody](#prod-GeneratorBody) }

1.  Return the result of [ComputedPropertyContains](#sec-static-semantics-computedpropertycontains) of [ClassElementName](#prod-ClassElementName) with argument `symbol`.

[AsyncGeneratorMethod](#prod-AsyncGeneratorMethod) : async \* [ClassElementName](#prod-ClassElementName) ( [UniqueFormalParameters](#prod-UniqueFormalParameters) ) { [AsyncGeneratorBody](#prod-AsyncGeneratorBody) }

1.  Return the result of [ComputedPropertyContains](#sec-static-semantics-computedpropertycontains) of [ClassElementName](#prod-ClassElementName) with argument `symbol`.

[ClassElementList](#prod-ClassElementList) : [ClassElementList](#prod-ClassElementList) [ClassElement](#prod-ClassElement)

1.  Let `inList` be [ComputedPropertyContains](#sec-static-semantics-computedpropertycontains) of [ClassElementList](#prod-ClassElementList) with argument `symbol`.
2.  If `inList` is true, return true.
3.  Return the result of [ComputedPropertyContains](#sec-static-semantics-computedpropertycontains) of [ClassElement](#prod-ClassElement) with argument `symbol`.

[ClassElement](#prod-ClassElement) : [ClassStaticBlock](#prod-ClassStaticBlock)

1.  Return false.

[ClassElement](#prod-ClassElement) : ;

1.  Return false.

[AsyncMethod](#prod-AsyncMethod) : async [ClassElementName](#prod-ClassElementName) ( [UniqueFormalParameters](#prod-UniqueFormalParameters) ) { [AsyncFunctionBody](#prod-AsyncFunctionBody) }

1.  Return the result of [ComputedPropertyContains](#sec-static-semantics-computedpropertycontains) of [ClassElementName](#prod-ClassElementName) with argument `symbol`.

[FieldDefinition](#prod-FieldDefinition) : [ClassElementName](#prod-ClassElementName) [Initializer](#prod-Initializer)opt

1.  Return the result of [ComputedPropertyContains](#sec-static-semantics-computedpropertycontains) of [ClassElementName](#prod-ClassElementName) with argument `symbol`.

## 8.6 Miscellaneous

These operations are used in multiple places throughout the specification.

### 8.6.1 Runtime Semantics: InstantiateFunctionObject

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) InstantiateFunctionObject takes arguments `env` (an [Environment Record](#sec-environment-records)) and `privateEnv` (a [PrivateEnvironment Record](#privateenvironment-record) or null) and returns an ECMAScript [function object](#function-object). It is defined piecewise over the following productions:

[FunctionDeclaration](#prod-FunctionDeclaration) : function [BindingIdentifier](#prod-BindingIdentifier) ( [FormalParameters](#prod-FormalParameters) ) { [FunctionBody](#prod-FunctionBody) } function ( [FormalParameters](#prod-FormalParameters) ) { [FunctionBody](#prod-FunctionBody) }

1.  Return [InstantiateOrdinaryFunctionObject](#sec-runtime-semantics-instantiateordinaryfunctionobject) of [FunctionDeclaration](#prod-FunctionDeclaration) with arguments `env` and `privateEnv`.

[GeneratorDeclaration](#prod-GeneratorDeclaration) : function \* [BindingIdentifier](#prod-BindingIdentifier) ( [FormalParameters](#prod-FormalParameters) ) { [GeneratorBody](#prod-GeneratorBody) } function \* ( [FormalParameters](#prod-FormalParameters) ) { [GeneratorBody](#prod-GeneratorBody) }

1.  Return [InstantiateGeneratorFunctionObject](#sec-runtime-semantics-instantiategeneratorfunctionobject) of [GeneratorDeclaration](#prod-GeneratorDeclaration) with arguments `env` and `privateEnv`.

[AsyncGeneratorDeclaration](#prod-AsyncGeneratorDeclaration) : async function \* [BindingIdentifier](#prod-BindingIdentifier) ( [FormalParameters](#prod-FormalParameters) ) { [AsyncGeneratorBody](#prod-AsyncGeneratorBody) } async function \* ( [FormalParameters](#prod-FormalParameters) ) { [AsyncGeneratorBody](#prod-AsyncGeneratorBody) }

1.  Return [InstantiateAsyncGeneratorFunctionObject](#sec-runtime-semantics-instantiateasyncgeneratorfunctionobject) of [AsyncGeneratorDeclaration](#prod-AsyncGeneratorDeclaration) with arguments `env` and `privateEnv`.

[AsyncFunctionDeclaration](#prod-AsyncFunctionDeclaration) : async function [BindingIdentifier](#prod-BindingIdentifier) ( [FormalParameters](#prod-FormalParameters) ) { [AsyncFunctionBody](#prod-AsyncFunctionBody) } async function ( [FormalParameters](#prod-FormalParameters) ) { [AsyncFunctionBody](#prod-AsyncFunctionBody) }

1.  Return [InstantiateAsyncFunctionObject](#sec-runtime-semantics-instantiateasyncfunctionobject) of [AsyncFunctionDeclaration](#prod-AsyncFunctionDeclaration) with arguments `env` and `privateEnv`.

### 8.6.2 Runtime Semantics: BindingInitialization

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) BindingInitialization takes arguments `value` (an [ECMAScript language value](#sec-ecmascript-language-types)) and `environment` (an [Environment Record](#sec-environment-records) or undefined) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or an [abrupt completion](#sec-completion-record-specification-type).

Note

undefined is passed for `environment` to indicate that a [PutValue](#sec-putvalue) operation should be used to assign the initialization value. This is the case for `var` statements and formal parameter lists of some [non-strict functions](#non-strict-function) (See [10.2.11](#sec-functiondeclarationinstantiation)). In those cases a lexical binding is hoisted and preinitialized prior to evaluation of its initializer.

It is defined piecewise over the following productions:

[BindingIdentifier](#prod-BindingIdentifier) : [Identifier](#prod-Identifier)

1.  Let `name` be the [StringValue](#sec-static-semantics-stringvalue) of [Identifier](#prod-Identifier).
2.  Return ? [InitializeBoundName](#sec-initializeboundname)(`name`, `value`, `environment`).

[BindingIdentifier](#prod-BindingIdentifier) : yield

1.  Return ? [InitializeBoundName](#sec-initializeboundname)("yield", `value`, `environment`).

[BindingIdentifier](#prod-BindingIdentifier) : await

1.  Return ? [InitializeBoundName](#sec-initializeboundname)("await", `value`, `environment`).

[BindingPattern](#prod-BindingPattern) : [ObjectBindingPattern](#prod-ObjectBindingPattern)

1.  Perform ? [RequireObjectCoercible](#sec-requireobjectcoercible)(`value`).
2.  Return ? [BindingInitialization](#sec-runtime-semantics-bindinginitialization) of [ObjectBindingPattern](#prod-ObjectBindingPattern) with arguments `value` and `environment`.

[BindingPattern](#prod-BindingPattern) : [ArrayBindingPattern](#prod-ArrayBindingPattern)

1.  Let `iteratorRecord` be ? [GetIterator](#sec-getiterator)(`value`, sync).
2.  Let `result` be [Completion](#sec-completion-ao)([IteratorBindingInitialization](#sec-runtime-semantics-iteratorbindinginitialization) of [ArrayBindingPattern](#prod-ArrayBindingPattern) with arguments `iteratorRecord` and `environment`).
3.  If `iteratorRecord`.`[[Done]]` is false, return ? [IteratorClose](#sec-iteratorclose)(`iteratorRecord`, `result`).
4.  Return ? `result`.

[ObjectBindingPattern](#prod-ObjectBindingPattern) : { }

1.  Return unused.

[ObjectBindingPattern](#prod-ObjectBindingPattern) : { [BindingPropertyList](#prod-BindingPropertyList) } { [BindingPropertyList](#prod-BindingPropertyList) , }

1.  Perform ? [PropertyBindingInitialization](#sec-destructuring-binding-patterns-runtime-semantics-propertybindinginitialization) of [BindingPropertyList](#prod-BindingPropertyList) with arguments `value` and `environment`.
2.  Return unused.

[ObjectBindingPattern](#prod-ObjectBindingPattern) : { [BindingRestProperty](#prod-BindingRestProperty) }

1.  Let `excludedNames` be a new empty [List](#sec-list-and-record-specification-type).
2.  Return ? [RestBindingInitialization](#sec-destructuring-binding-patterns-runtime-semantics-restbindinginitialization) of [BindingRestProperty](#prod-BindingRestProperty) with arguments `value`, `environment`, and `excludedNames`.

[ObjectBindingPattern](#prod-ObjectBindingPattern) : { [BindingPropertyList](#prod-BindingPropertyList) , [BindingRestProperty](#prod-BindingRestProperty) }

1.  Let `excludedNames` be ? [PropertyBindingInitialization](#sec-destructuring-binding-patterns-runtime-semantics-propertybindinginitialization) of [BindingPropertyList](#prod-BindingPropertyList) with arguments `value` and `environment`.
2.  Return ? [RestBindingInitialization](#sec-destructuring-binding-patterns-runtime-semantics-restbindinginitialization) of [BindingRestProperty](#prod-BindingRestProperty) with arguments `value`, `environment`, and `excludedNames`.

#### 8.6.2.1 InitializeBoundName ( `name`, `value`, `environment` )

The abstract operation InitializeBoundName takes arguments `name` (a String), `value` (an [ECMAScript language value](#sec-ecmascript-language-types)), and `environment` (an [Environment Record](#sec-environment-records) or undefined) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or an [abrupt completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  If `environment` is not undefined, then
    1.  Perform ! `environment`.InitializeBinding(`name`, `value`).
    2.  Return unused.
2.  Else,
    1.  Let `lhs` be ? [ResolveBinding](#sec-resolvebinding)(`name`).
    2.  Return ? [PutValue](#sec-putvalue)(`lhs`, `value`).

### 8.6.3 Runtime Semantics: IteratorBindingInitialization

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) IteratorBindingInitialization takes arguments `iteratorRecord` (an [Iterator Record](#sec-iterator-records)) and `environment` (an [Environment Record](#sec-environment-records) or undefined) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or an [abrupt completion](#sec-completion-record-specification-type).

Note

When undefined is passed for `environment` it indicates that a [PutValue](#sec-putvalue) operation should be used to assign the initialization value. This is the case for formal parameter lists of [non-strict functions](#non-strict-function). In that case the formal parameter bindings are preinitialized in order to deal with the possibility of multiple parameters with the same name.

It is defined piecewise over the following productions:

[ArrayBindingPattern](#prod-ArrayBindingPattern) : \[ \]

1.  Return unused.

[ArrayBindingPattern](#prod-ArrayBindingPattern) : \[ [Elision](#prod-Elision) \]

1.  Return ? [IteratorDestructuringAssignmentEvaluation](#sec-runtime-semantics-iteratordestructuringassignmentevaluation) of [Elision](#prod-Elision) with argument `iteratorRecord`.

[ArrayBindingPattern](#prod-ArrayBindingPattern) : \[ [Elision](#prod-Elision)opt [BindingRestElement](#prod-BindingRestElement) \]

1.  If [Elision](#prod-Elision) is present, then
    1.  Perform ? [IteratorDestructuringAssignmentEvaluation](#sec-runtime-semantics-iteratordestructuringassignmentevaluation) of [Elision](#prod-Elision) with argument `iteratorRecord`.
2.  Return ? [IteratorBindingInitialization](#sec-runtime-semantics-iteratorbindinginitialization) of [BindingRestElement](#prod-BindingRestElement) with arguments `iteratorRecord` and `environment`.

[ArrayBindingPattern](#prod-ArrayBindingPattern) : \[ [BindingElementList](#prod-BindingElementList) , [Elision](#prod-Elision) \]

1.  Perform ? [IteratorBindingInitialization](#sec-runtime-semantics-iteratorbindinginitialization) of [BindingElementList](#prod-BindingElementList) with arguments `iteratorRecord` and `environment`.
2.  Return ? [IteratorDestructuringAssignmentEvaluation](#sec-runtime-semantics-iteratordestructuringassignmentevaluation) of [Elision](#prod-Elision) with argument `iteratorRecord`.

[ArrayBindingPattern](#prod-ArrayBindingPattern) : \[ [BindingElementList](#prod-BindingElementList) , [Elision](#prod-Elision)opt [BindingRestElement](#prod-BindingRestElement) \]

1.  Perform ? [IteratorBindingInitialization](#sec-runtime-semantics-iteratorbindinginitialization) of [BindingElementList](#prod-BindingElementList) with arguments `iteratorRecord` and `environment`.
2.  If [Elision](#prod-Elision) is present, then
    1.  Perform ? [IteratorDestructuringAssignmentEvaluation](#sec-runtime-semantics-iteratordestructuringassignmentevaluation) of [Elision](#prod-Elision) with argument `iteratorRecord`.
3.  Return ? [IteratorBindingInitialization](#sec-runtime-semantics-iteratorbindinginitialization) of [BindingRestElement](#prod-BindingRestElement) with arguments `iteratorRecord` and `environment`.

[BindingElementList](#prod-BindingElementList) : [BindingElementList](#prod-BindingElementList) , [BindingElisionElement](#prod-BindingElisionElement)

1.  Perform ? [IteratorBindingInitialization](#sec-runtime-semantics-iteratorbindinginitialization) of [BindingElementList](#prod-BindingElementList) with arguments `iteratorRecord` and `environment`.
2.  Return ? [IteratorBindingInitialization](#sec-runtime-semantics-iteratorbindinginitialization) of [BindingElisionElement](#prod-BindingElisionElement) with arguments `iteratorRecord` and `environment`.

[BindingElisionElement](#prod-BindingElisionElement) : [Elision](#prod-Elision) [BindingElement](#prod-BindingElement)

1.  Perform ? [IteratorDestructuringAssignmentEvaluation](#sec-runtime-semantics-iteratordestructuringassignmentevaluation) of [Elision](#prod-Elision) with argument `iteratorRecord`.
2.  Return ? [IteratorBindingInitialization](#sec-runtime-semantics-iteratorbindinginitialization) of [BindingElement](#prod-BindingElement) with arguments `iteratorRecord` and `environment`.

[SingleNameBinding](#prod-SingleNameBinding) : [BindingIdentifier](#prod-BindingIdentifier) [Initializer](#prod-Initializer)opt

1.  Let `bindingId` be the [StringValue](#sec-static-semantics-stringvalue) of [BindingIdentifier](#prod-BindingIdentifier).
2.  Let `lhs` be ? [ResolveBinding](#sec-resolvebinding)(`bindingId`, `environment`).
3.  Let `v` be undefined.
4.  If `iteratorRecord`.`[[Done]]` is false, then
    1.  Let `next` be ? [IteratorStepValue](#sec-iteratorstepvalue)(`iteratorRecord`).
    2.  If `next` is not done, then
        1.  Set `v` to `next`.
5.  If [Initializer](#prod-Initializer) is present and `v` is undefined, then
    1.  If [IsAnonymousFunctionDefinition](#sec-isanonymousfunctiondefinition)([Initializer](#prod-Initializer)) is true, then
        1.  Set `v` to ? [NamedEvaluation](#sec-runtime-semantics-namedevaluation) of [Initializer](#prod-Initializer) with argument `bindingId`.
    2.  Else,
        1.  Let `defaultValue` be ? [Evaluation](#sec-evaluation) of [Initializer](#prod-Initializer).
        2.  Set `v` to ? [GetValue](#sec-getvalue)(`defaultValue`).
6.  If `environment` is undefined, return ? [PutValue](#sec-putvalue)(`lhs`, `v`).
7.  Return ? [InitializeReferencedBinding](#sec-initializereferencedbinding)(`lhs`, `v`).

[BindingElement](#prod-BindingElement) : [BindingPattern](#prod-BindingPattern) [Initializer](#prod-Initializer)opt

1.  Let `v` be undefined.
2.  If `iteratorRecord`.`[[Done]]` is false, then
    1.  Let `next` be ? [IteratorStepValue](#sec-iteratorstepvalue)(`iteratorRecord`).
    2.  If `next` is not done, then
        1.  Set `v` to `next`.
3.  If [Initializer](#prod-Initializer) is present and `v` is undefined, then
    1.  Let `defaultValue` be ? [Evaluation](#sec-evaluation) of [Initializer](#prod-Initializer).
    2.  Set `v` to ? [GetValue](#sec-getvalue)(`defaultValue`).
4.  Return ? [BindingInitialization](#sec-runtime-semantics-bindinginitialization) of [BindingPattern](#prod-BindingPattern) with arguments `v` and `environment`.

[BindingRestElement](#prod-BindingRestElement) : ... [BindingIdentifier](#prod-BindingIdentifier)

1.  Let `lhs` be ? [ResolveBinding](#sec-resolvebinding)([StringValue](#sec-static-semantics-stringvalue) of [BindingIdentifier](#prod-BindingIdentifier), `environment`).
2.  Let `A` be ! [ArrayCreate](#sec-arraycreate)(0).
3.  Let `n` be 0.
4.  Repeat,
    1.  Let `next` be done.
    2.  If `iteratorRecord`.`[[Done]]` is false, then
        1.  Set `next` to ? [IteratorStepValue](#sec-iteratorstepvalue)(`iteratorRecord`).
    3.  If `next` is done, then
        1.  If `environment` is undefined, return ? [PutValue](#sec-putvalue)(`lhs`, `A`).
        2.  Return ? [InitializeReferencedBinding](#sec-initializereferencedbinding)(`lhs`, `A`).
    4.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`A`, ! [ToString](#sec-tostring)([𝔽](#𝔽)(`n`)), `next`).
    5.  Set `n` to `n` + 1.

[BindingRestElement](#prod-BindingRestElement) : ... [BindingPattern](#prod-BindingPattern)

1.  Let `A` be ! [ArrayCreate](#sec-arraycreate)(0).
2.  Let `n` be 0.
3.  Repeat,
    1.  Let `next` be done.
    2.  If `iteratorRecord`.`[[Done]]` is false, then
        1.  Set `next` to ? [IteratorStepValue](#sec-iteratorstepvalue)(`iteratorRecord`).
    3.  If `next` is done, then
        1.  Return ? [BindingInitialization](#sec-runtime-semantics-bindinginitialization) of [BindingPattern](#prod-BindingPattern) with arguments `A` and `environment`.
    4.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`A`, ! [ToString](#sec-tostring)([𝔽](#𝔽)(`n`)), `next`).
    5.  Set `n` to `n` + 1.

[FormalParameters](#prod-FormalParameters) : \[empty\]

1.  Return unused.

[FormalParameters](#prod-FormalParameters) : [FormalParameterList](#prod-FormalParameterList) , [FunctionRestParameter](#prod-FunctionRestParameter)

1.  Perform ? [IteratorBindingInitialization](#sec-runtime-semantics-iteratorbindinginitialization) of [FormalParameterList](#prod-FormalParameterList) with arguments `iteratorRecord` and `environment`.
2.  Return ? [IteratorBindingInitialization](#sec-runtime-semantics-iteratorbindinginitialization) of [FunctionRestParameter](#prod-FunctionRestParameter) with arguments `iteratorRecord` and `environment`.

[FormalParameterList](#prod-FormalParameterList) : [FormalParameterList](#prod-FormalParameterList) , [FormalParameter](#prod-FormalParameter)

1.  Perform ? [IteratorBindingInitialization](#sec-runtime-semantics-iteratorbindinginitialization) of [FormalParameterList](#prod-FormalParameterList) with arguments `iteratorRecord` and `environment`.
2.  Return ? [IteratorBindingInitialization](#sec-runtime-semantics-iteratorbindinginitialization) of [FormalParameter](#prod-FormalParameter) with arguments `iteratorRecord` and `environment`.

[ArrowParameters](#prod-ArrowParameters) : [BindingIdentifier](#prod-BindingIdentifier)

1.  Let `v` be undefined.
2.  [Assert](#assert): `iteratorRecord`.`[[Done]]` is false.
3.  Let `next` be ? [IteratorStepValue](#sec-iteratorstepvalue)(`iteratorRecord`).
4.  If `next` is not done, then
    1.  Set `v` to `next`.
5.  Return ? [BindingInitialization](#sec-runtime-semantics-bindinginitialization) of [BindingIdentifier](#prod-BindingIdentifier) with arguments `v` and `environment`.

[ArrowParameters](#prod-ArrowParameters) : [CoverParenthesizedExpressionAndArrowParameterList](#prod-CoverParenthesizedExpressionAndArrowParameterList)

1.  Let `formals` be the [ArrowFormalParameters](#prod-ArrowFormalParameters) that is [covered](#sec-syntactic-grammar) by [CoverParenthesizedExpressionAndArrowParameterList](#prod-CoverParenthesizedExpressionAndArrowParameterList).
2.  Return ? [IteratorBindingInitialization](#sec-runtime-semantics-iteratorbindinginitialization) of `formals` with arguments `iteratorRecord` and `environment`.

[AsyncArrowBindingIdentifier](#prod-AsyncArrowBindingIdentifier) : [BindingIdentifier](#prod-BindingIdentifier)

1.  Let `v` be undefined.
2.  [Assert](#assert): `iteratorRecord`.`[[Done]]` is false.
3.  Let `next` be ? [IteratorStepValue](#sec-iteratorstepvalue)(`iteratorRecord`).
4.  If `next` is not done, then
    1.  Set `v` to `next`.
5.  Return ? [BindingInitialization](#sec-runtime-semantics-bindinginitialization) of [BindingIdentifier](#prod-BindingIdentifier) with arguments `v` and `environment`.

### 8.6.4 Static Semantics: AssignmentTargetType

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) AssignmentTargetType takes no arguments and returns simple or invalid. It is defined piecewise over the following productions:

[IdentifierReference](#prod-IdentifierReference) : [Identifier](#prod-Identifier)

1.  If [IsStrict](#sec-isstrict)(this [IdentifierReference](#prod-IdentifierReference)) is true and the [StringValue](#sec-static-semantics-stringvalue) of [Identifier](#prod-Identifier) is either "eval" or "arguments", return invalid.
2.  Return simple.

[IdentifierReference](#prod-IdentifierReference) : yield await [CallExpression](#prod-CallExpression) : [CallExpression](#prod-CallExpression) \[ [Expression](#prod-Expression) \] [CallExpression](#prod-CallExpression) . [IdentifierName](#prod-IdentifierName) [CallExpression](#prod-CallExpression) . [PrivateIdentifier](#prod-PrivateIdentifier) [MemberExpression](#prod-MemberExpression) : [MemberExpression](#prod-MemberExpression) \[ [Expression](#prod-Expression) \] [MemberExpression](#prod-MemberExpression) . [IdentifierName](#prod-IdentifierName) [SuperProperty](#prod-SuperProperty) [MemberExpression](#prod-MemberExpression) . [PrivateIdentifier](#prod-PrivateIdentifier)

1.  Return simple.

[PrimaryExpression](#prod-PrimaryExpression) : [CoverParenthesizedExpressionAndArrowParameterList](#prod-CoverParenthesizedExpressionAndArrowParameterList)

1.  Let `expr` be the [ParenthesizedExpression](#prod-ParenthesizedExpression) that is [covered](#sec-syntactic-grammar) by [CoverParenthesizedExpressionAndArrowParameterList](#prod-CoverParenthesizedExpressionAndArrowParameterList).
2.  Return the [AssignmentTargetType](#sec-static-semantics-assignmenttargettype) of `expr`.

[PrimaryExpression](#prod-PrimaryExpression) : this [Literal](#prod-Literal) [ArrayLiteral](#prod-ArrayLiteral) [ObjectLiteral](#prod-ObjectLiteral) [FunctionExpression](#prod-FunctionExpression) [ClassExpression](#prod-ClassExpression) [GeneratorExpression](#prod-GeneratorExpression) [AsyncFunctionExpression](#prod-AsyncFunctionExpression) [AsyncGeneratorExpression](#prod-AsyncGeneratorExpression) [RegularExpressionLiteral](#prod-RegularExpressionLiteral) [TemplateLiteral](#prod-TemplateLiteral) [CallExpression](#prod-CallExpression) : [CoverCallExpressionAndAsyncArrowHead](#prod-CoverCallExpressionAndAsyncArrowHead) [SuperCall](#prod-SuperCall) [ImportCall](#prod-ImportCall) [CallExpression](#prod-CallExpression) [Arguments](#prod-Arguments) [CallExpression](#prod-CallExpression) [TemplateLiteral](#prod-TemplateLiteral) [NewExpression](#prod-NewExpression) : new [NewExpression](#prod-NewExpression) [MemberExpression](#prod-MemberExpression) : [MemberExpression](#prod-MemberExpression) [TemplateLiteral](#prod-TemplateLiteral) new [MemberExpression](#prod-MemberExpression) [Arguments](#prod-Arguments) [NewTarget](#prod-NewTarget) : new . target [ImportMeta](#prod-ImportMeta) : import . meta [LeftHandSideExpression](#prod-LeftHandSideExpression) : [OptionalExpression](#prod-OptionalExpression) [UpdateExpression](#prod-UpdateExpression) : [LeftHandSideExpression](#prod-LeftHandSideExpression) ++ [LeftHandSideExpression](#prod-LeftHandSideExpression) -- ++ [UnaryExpression](#prod-UnaryExpression) -- [UnaryExpression](#prod-UnaryExpression) [UnaryExpression](#prod-UnaryExpression) : delete [UnaryExpression](#prod-UnaryExpression) void [UnaryExpression](#prod-UnaryExpression) typeof [UnaryExpression](#prod-UnaryExpression) + [UnaryExpression](#prod-UnaryExpression) - [UnaryExpression](#prod-UnaryExpression) ~ [UnaryExpression](#prod-UnaryExpression) ! [UnaryExpression](#prod-UnaryExpression) [AwaitExpression](#prod-AwaitExpression) [ExponentiationExpression](#prod-ExponentiationExpression) : [UpdateExpression](#prod-UpdateExpression) \*\* [ExponentiationExpression](#prod-ExponentiationExpression) [MultiplicativeExpression](#prod-MultiplicativeExpression) : [MultiplicativeExpression](#prod-MultiplicativeExpression) [MultiplicativeOperator](#prod-MultiplicativeOperator) [ExponentiationExpression](#prod-ExponentiationExpression) [AdditiveExpression](#prod-AdditiveExpression) : [AdditiveExpression](#prod-AdditiveExpression) + [MultiplicativeExpression](#prod-MultiplicativeExpression) [AdditiveExpression](#prod-AdditiveExpression) - [MultiplicativeExpression](#prod-MultiplicativeExpression) [ShiftExpression](#prod-ShiftExpression) : [ShiftExpression](#prod-ShiftExpression) \<\< [AdditiveExpression](#prod-AdditiveExpression) [ShiftExpression](#prod-ShiftExpression) \>\> [AdditiveExpression](#prod-AdditiveExpression) [ShiftExpression](#prod-ShiftExpression) \>\>\> [AdditiveExpression](#prod-AdditiveExpression) [RelationalExpression](#prod-RelationalExpression) : [RelationalExpression](#prod-RelationalExpression) \< [ShiftExpression](#prod-ShiftExpression) [RelationalExpression](#prod-RelationalExpression) \> [ShiftExpression](#prod-ShiftExpression) [RelationalExpression](#prod-RelationalExpression) \<= [ShiftExpression](#prod-ShiftExpression) [RelationalExpression](#prod-RelationalExpression) \>= [ShiftExpression](#prod-ShiftExpression) [RelationalExpression](#prod-RelationalExpression) instanceof [ShiftExpression](#prod-ShiftExpression) [RelationalExpression](#prod-RelationalExpression) in [ShiftExpression](#prod-ShiftExpression) [PrivateIdentifier](#prod-PrivateIdentifier) in [ShiftExpression](#prod-ShiftExpression) [EqualityExpression](#prod-EqualityExpression) : [EqualityExpression](#prod-EqualityExpression) == [RelationalExpression](#prod-RelationalExpression) [EqualityExpression](#prod-EqualityExpression) != [RelationalExpression](#prod-RelationalExpression) [EqualityExpression](#prod-EqualityExpression) === [RelationalExpression](#prod-RelationalExpression) [EqualityExpression](#prod-EqualityExpression) !== [RelationalExpression](#prod-RelationalExpression) [BitwiseANDExpression](#prod-BitwiseANDExpression) : [BitwiseANDExpression](#prod-BitwiseANDExpression) & [EqualityExpression](#prod-EqualityExpression) [BitwiseXORExpression](#prod-BitwiseXORExpression) : [BitwiseXORExpression](#prod-BitwiseXORExpression) ^ [BitwiseANDExpression](#prod-BitwiseANDExpression) [BitwiseORExpression](#prod-BitwiseORExpression) : [BitwiseORExpression](#prod-BitwiseORExpression) \| [BitwiseXORExpression](#prod-BitwiseXORExpression) [LogicalANDExpression](#prod-LogicalANDExpression) : [LogicalANDExpression](#prod-LogicalANDExpression) && [BitwiseORExpression](#prod-BitwiseORExpression) [LogicalORExpression](#prod-LogicalORExpression) : [LogicalORExpression](#prod-LogicalORExpression) \|\| [LogicalANDExpression](#prod-LogicalANDExpression) [CoalesceExpression](#prod-CoalesceExpression) : [CoalesceExpressionHead](#prod-CoalesceExpressionHead) ?? [BitwiseORExpression](#prod-BitwiseORExpression) [ConditionalExpression](#prod-ConditionalExpression) : [ShortCircuitExpression](#prod-ShortCircuitExpression) ? [AssignmentExpression](#prod-AssignmentExpression) : [AssignmentExpression](#prod-AssignmentExpression) [AssignmentExpression](#prod-AssignmentExpression) : [YieldExpression](#prod-YieldExpression) [ArrowFunction](#prod-ArrowFunction) [AsyncArrowFunction](#prod-AsyncArrowFunction) [LeftHandSideExpression](#prod-LeftHandSideExpression) = [AssignmentExpression](#prod-AssignmentExpression) [LeftHandSideExpression](#prod-LeftHandSideExpression) [AssignmentOperator](#prod-AssignmentOperator) [AssignmentExpression](#prod-AssignmentExpression) [LeftHandSideExpression](#prod-LeftHandSideExpression) &&= [AssignmentExpression](#prod-AssignmentExpression) [LeftHandSideExpression](#prod-LeftHandSideExpression) \|\|= [AssignmentExpression](#prod-AssignmentExpression) [LeftHandSideExpression](#prod-LeftHandSideExpression) ??= [AssignmentExpression](#prod-AssignmentExpression) [Expression](#prod-Expression) : [Expression](#prod-Expression) , [AssignmentExpression](#prod-AssignmentExpression)

1.  Return invalid.

### 8.6.5 Static Semantics: PropName

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) PropName takes no arguments and returns a String or empty. It is defined piecewise over the following productions:

[PropertyDefinition](#prod-PropertyDefinition) : [IdentifierReference](#prod-IdentifierReference)

1.  Return the [StringValue](#sec-static-semantics-stringvalue) of [IdentifierReference](#prod-IdentifierReference).

[PropertyDefinition](#prod-PropertyDefinition) : ... [AssignmentExpression](#prod-AssignmentExpression)

1.  Return empty.

[PropertyDefinition](#prod-PropertyDefinition) : [PropertyName](#prod-PropertyName) : [AssignmentExpression](#prod-AssignmentExpression)

1.  Return the [PropName](#sec-static-semantics-propname) of [PropertyName](#prod-PropertyName).

[LiteralPropertyName](#prod-LiteralPropertyName) : [IdentifierName](#prod-IdentifierName) [AttributeKey](#prod-AttributeKey) : [IdentifierName](#prod-IdentifierName)

1.  Return the [StringValue](#sec-static-semantics-stringvalue) of [IdentifierName](#prod-IdentifierName).

[LiteralPropertyName](#prod-LiteralPropertyName) : [StringLiteral](#prod-StringLiteral) [AttributeKey](#prod-AttributeKey) : [StringLiteral](#prod-StringLiteral)

1.  Return the [SV](#sec-static-semantics-sv) of [StringLiteral](#prod-StringLiteral).

[LiteralPropertyName](#prod-LiteralPropertyName) : [NumericLiteral](#prod-NumericLiteral)

1.  Let `nbr` be the [NumericValue](#sec-numericvalue) of [NumericLiteral](#prod-NumericLiteral).
2.  Return ! [ToString](#sec-tostring)(`nbr`).

[ComputedPropertyName](#prod-ComputedPropertyName) : \[ [AssignmentExpression](#prod-AssignmentExpression) \]

1.  Return empty.

[MethodDefinition](#prod-MethodDefinition) : [ClassElementName](#prod-ClassElementName) ( [UniqueFormalParameters](#prod-UniqueFormalParameters) ) { [FunctionBody](#prod-FunctionBody) } get [ClassElementName](#prod-ClassElementName) ( ) { [FunctionBody](#prod-FunctionBody) } set [ClassElementName](#prod-ClassElementName) ( [PropertySetParameterList](#prod-PropertySetParameterList) ) { [FunctionBody](#prod-FunctionBody) }

1.  Return the [PropName](#sec-static-semantics-propname) of [ClassElementName](#prod-ClassElementName).

[GeneratorMethod](#prod-GeneratorMethod) : \* [ClassElementName](#prod-ClassElementName) ( [UniqueFormalParameters](#prod-UniqueFormalParameters) ) { [GeneratorBody](#prod-GeneratorBody) }

1.  Return the [PropName](#sec-static-semantics-propname) of [ClassElementName](#prod-ClassElementName).

[AsyncGeneratorMethod](#prod-AsyncGeneratorMethod) : async \* [ClassElementName](#prod-ClassElementName) ( [UniqueFormalParameters](#prod-UniqueFormalParameters) ) { [AsyncGeneratorBody](#prod-AsyncGeneratorBody) }

1.  Return the [PropName](#sec-static-semantics-propname) of [ClassElementName](#prod-ClassElementName).

[ClassElement](#prod-ClassElement) : [ClassStaticBlock](#prod-ClassStaticBlock)

1.  Return empty.

[ClassElement](#prod-ClassElement) : ;

1.  Return empty.

[AsyncMethod](#prod-AsyncMethod) : async [ClassElementName](#prod-ClassElementName) ( [UniqueFormalParameters](#prod-UniqueFormalParameters) ) { [AsyncFunctionBody](#prod-AsyncFunctionBody) }

1.  Return the [PropName](#sec-static-semantics-propname) of [ClassElementName](#prod-ClassElementName).

[FieldDefinition](#prod-FieldDefinition) : [ClassElementName](#prod-ClassElementName) [Initializer](#prod-Initializer)opt

1.  Return the [PropName](#sec-static-semantics-propname) of [ClassElementName](#prod-ClassElementName).

[ClassElementName](#prod-ClassElementName) : [PrivateIdentifier](#prod-PrivateIdentifier)

1.  Return empty.
