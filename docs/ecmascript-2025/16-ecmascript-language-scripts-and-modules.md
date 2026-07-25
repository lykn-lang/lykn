# 16 ECMAScript Language: Scripts and Modules

## 16.1 Scripts

### Syntax

[Script](#prod-Script) : [ScriptBody](#prod-ScriptBody)opt [ScriptBody](#prod-ScriptBody) : [StatementList](#prod-StatementList)\[~Yield, ~Await, ~Return\]

### 16.1.1 Static Semantics: Early Errors

[Script](#prod-Script) : [ScriptBody](#prod-ScriptBody)

- It is a Syntax Error if the [LexicallyDeclaredNames](#sec-static-semantics-lexicallydeclarednames) of [ScriptBody](#prod-ScriptBody) contains any duplicate entries.
- It is a Syntax Error if any element of the [LexicallyDeclaredNames](#sec-static-semantics-lexicallydeclarednames) of [ScriptBody](#prod-ScriptBody) also occurs in the [VarDeclaredNames](#sec-static-semantics-vardeclarednames) of [ScriptBody](#prod-ScriptBody).

[ScriptBody](#prod-ScriptBody) : [StatementList](#prod-StatementList)

- It is a Syntax Error if [StatementList](#prod-StatementList) [Contains](#sec-static-semantics-contains) `super` unless the source text containing `super` is eval code that is being processed by a [direct eval](#sec-function-calls-runtime-semantics-evaluation). Additional [early error](#early-error) rules for `super` within [direct eval](#sec-function-calls-runtime-semantics-evaluation) are defined in [19.2.1.1](#sec-performeval).
- It is a Syntax Error if [StatementList](#prod-StatementList) [Contains](#sec-static-semantics-contains) [NewTarget](#prod-NewTarget) unless the source text containing [NewTarget](#prod-NewTarget) is eval code that is being processed by a [direct eval](#sec-function-calls-runtime-semantics-evaluation). Additional [early error](#early-error) rules for [NewTarget](#prod-NewTarget) in [direct eval](#sec-function-calls-runtime-semantics-evaluation) are defined in [19.2.1.1](#sec-performeval).
- It is a Syntax Error if [ContainsDuplicateLabels](#sec-static-semantics-containsduplicatelabels) of [StatementList](#prod-StatementList) with argument « » is true.
- It is a Syntax Error if [ContainsUndefinedBreakTarget](#sec-static-semantics-containsundefinedbreaktarget) of [StatementList](#prod-StatementList) with argument « » is true.
- It is a Syntax Error if [ContainsUndefinedContinueTarget](#sec-static-semantics-containsundefinedcontinuetarget) of [StatementList](#prod-StatementList) with arguments « » and « » is true.
- It is a Syntax Error if [AllPrivateIdentifiersValid](#sec-static-semantics-allprivateidentifiersvalid) of [StatementList](#prod-StatementList) with argument « » is false unless the source text containing [ScriptBody](#prod-ScriptBody) is eval code that is being processed by a [direct eval](#sec-function-calls-runtime-semantics-evaluation).

### 16.1.2 Static Semantics: ScriptIsStrict

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) ScriptIsStrict takes no arguments and returns a Boolean. It is defined piecewise over the following productions:

[Script](#prod-Script) : [ScriptBody](#prod-ScriptBody)opt

1.  If [ScriptBody](#prod-ScriptBody) is present and the [Directive Prologue](#directive-prologue) of [ScriptBody](#prod-ScriptBody) contains a [Use Strict Directive](#use-strict-directive), return true; otherwise, return false.

### 16.1.3 Runtime Semantics: Evaluation

[Script](#prod-Script) : \[empty\]

1.  Return undefined.

### 16.1.4 Script Records

A Script Record encapsulates information about a script being evaluated. Each script record contains the fields listed in [Table 39](#table-script-records).

| Field Name | Value Type | Meaning |
|----|----|----|
| `[[Realm]]` | a [Realm Record](#realm-record) | The [realm](#realm) within which this script was created. |
| `[[ECMAScriptCode]]` | a [Script](#prod-Script) [Parse Node](#sec-syntactic-grammar) | The result of parsing the source text of this script. |
| `[[LoadedModules]]` | a [List](#sec-list-and-record-specification-type) of [LoadedModuleRequest Records](#loadedmodulerequest-record) | A map from the specifier strings imported by this script to the resolved [Module Record](#sec-abstract-module-records). The list does not contain two different [Records](#sec-list-and-record-specification-type) `r1` and `r2` such that [ModuleRequestsEqual](#sec-ModuleRequestsEqual)(`r1`, `r2`) is true. |
| `[[HostDefined]]` | anything (default value is empty) | Field reserved for use by [host environments](#host-environment) that need to associate additional information with a script. |

Table 39: [Script Record](#script-record) Fields

### 16.1.5 ParseScript ( `sourceText`, `realm`, `hostDefined` )

The abstract operation ParseScript takes arguments `sourceText` ([ECMAScript source text](#sec-source-text)), `realm` (a [Realm Record](#realm-record)), and `hostDefined` (anything) and returns a [Script Record](#script-record) or a non-empty [List](#sec-list-and-record-specification-type) of SyntaxError objects. It creates a [Script Record](#script-record) based upon the result of parsing `sourceText` as a [Script](#prod-Script). It performs the following steps when called:

1.  Let `script` be [ParseText](#sec-parsetext)(`sourceText`, [Script](#prod-Script)).
2.  If `script` is a [List](#sec-list-and-record-specification-type) of errors, return `script`.
3.  Return [Script Record](#script-record) { `[[Realm]]`: `realm`, `[[ECMAScriptCode]]`: `script`, `[[LoadedModules]]`: « », `[[HostDefined]]`: `hostDefined` }.

Note

An implementation may parse script source text and analyse it for Early Error conditions prior to evaluation of ParseScript for that script source text. However, the reporting of any errors must be deferred until the point where this specification actually performs ParseScript upon that source text.

### 16.1.6 ScriptEvaluation ( `scriptRecord` )

The abstract operation ScriptEvaluation takes argument `scriptRecord` (a [Script Record](#script-record)) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [ECMAScript language value](#sec-ecmascript-language-types) or an [abrupt completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `globalEnv` be `scriptRecord`.`[[Realm]]`.`[[GlobalEnv]]`.
2.  Let `scriptContext` be a new [ECMAScript code execution context](#ecmascript-code-execution-context).
3.  Set the Function of `scriptContext` to null.
4.  Set the [Realm](#realm) of `scriptContext` to `scriptRecord`.`[[Realm]]`.
5.  Set the ScriptOrModule of `scriptContext` to `scriptRecord`.
6.  Set the VariableEnvironment of `scriptContext` to `globalEnv`.
7.  Set the LexicalEnvironment of `scriptContext` to `globalEnv`.
8.  Set the PrivateEnvironment of `scriptContext` to null.
9.  Suspend the [running execution context](#running-execution-context).
10. Push `scriptContext` onto the [execution context stack](#execution-context-stack); `scriptContext` is now the [running execution context](#running-execution-context).
11. Let `script` be `scriptRecord`.`[[ECMAScriptCode]]`.
12. Let `result` be [Completion](#sec-completion-ao)([GlobalDeclarationInstantiation](#sec-globaldeclarationinstantiation)(`script`, `globalEnv`)).
13. If `result` is a [normal completion](#sec-completion-record-specification-type), then
    1.  Set `result` to [Completion](#sec-completion-ao)([Evaluation](#sec-evaluation) of `script`).
    2.  If `result` is a [normal completion](#sec-completion-record-specification-type) and `result`.`[[Value]]` is empty, then
        1.  Set `result` to [NormalCompletion](#sec-normalcompletion)(undefined).
14. Suspend `scriptContext` and remove it from the [execution context stack](#execution-context-stack).
15. [Assert](#assert): The [execution context stack](#execution-context-stack) is not empty.
16. Resume the context that is now on the top of the [execution context stack](#execution-context-stack) as the [running execution context](#running-execution-context).
17. Return ? `result`.

### 16.1.7 GlobalDeclarationInstantiation ( `script`, `env` )

The abstract operation GlobalDeclarationInstantiation takes arguments `script` (a [Script](#prod-Script) [Parse Node](#sec-syntactic-grammar)) and `env` (a [Global Environment Record](#sec-global-environment-records)) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or a [throw completion](#sec-completion-record-specification-type). `script` is the [Script](#prod-Script) for which the [execution context](#sec-execution-contexts) is being established. `env` is the global environment in which bindings are to be created.

Note 1

When an [execution context](#sec-execution-contexts) is established for evaluating scripts, declarations are instantiated in the current global environment. Each global binding declared in the code is instantiated.

It performs the following steps when called:

1.  Let `lexNames` be the [LexicallyDeclaredNames](#sec-static-semantics-lexicallydeclarednames) of `script`.
2.  Let `varNames` be the [VarDeclaredNames](#sec-static-semantics-vardeclarednames) of `script`.
3.  For each element `name` of `lexNames`, do
    1.  If [HasLexicalDeclaration](#sec-haslexicaldeclaration)(`env`, `name`) is true, throw a SyntaxError exception.
    2.  Let `hasRestrictedGlobal` be ? [HasRestrictedGlobalProperty](#sec-hasrestrictedglobalproperty)(`env`, `name`).
    3.  NOTE: Global `var` and `function` bindings (except those that are introduced by non-strict [direct eval](#sec-function-calls-runtime-semantics-evaluation)) are non-configurable and are therefore restricted global properties.
    4.  If `hasRestrictedGlobal` is true, throw a SyntaxError exception.
4.  For each element `name` of `varNames`, do
    1.  If [HasLexicalDeclaration](#sec-haslexicaldeclaration)(`env`, `name`) is true, throw a SyntaxError exception.
5.  Let `varDeclarations` be the [VarScopedDeclarations](#sec-static-semantics-varscopeddeclarations) of `script`.
6.  Let `functionsToInitialize` be a new empty [List](#sec-list-and-record-specification-type).
7.  Let `declaredFunctionNames` be a new empty [List](#sec-list-and-record-specification-type).
8.  For each element `d` of `varDeclarations`, in reverse [List](#sec-list-and-record-specification-type) order, do
    1.  If `d` is not either a [VariableDeclaration](#prod-VariableDeclaration), a [ForBinding](#prod-ForBinding), or a [BindingIdentifier](#prod-BindingIdentifier), then
        1.  [Assert](#assert): `d` is either a [FunctionDeclaration](#prod-FunctionDeclaration), a [GeneratorDeclaration](#prod-GeneratorDeclaration), an [AsyncFunctionDeclaration](#prod-AsyncFunctionDeclaration), or an [AsyncGeneratorDeclaration](#prod-AsyncGeneratorDeclaration).
        2.  NOTE: If there are multiple function declarations for the same name, the last declaration is used.
        3.  Let `fn` be the sole element of the [BoundNames](#sec-static-semantics-boundnames) of `d`.
        4.  If `declaredFunctionNames` does not contain `fn`, then
            1.  Let `fnDefinable` be ? [CanDeclareGlobalFunction](#sec-candeclareglobalfunction)(`env`, `fn`).
            2.  If `fnDefinable` is false, throw a TypeError exception.
            3.  Append `fn` to `declaredFunctionNames`.
            4.  Insert `d` as the first element of `functionsToInitialize`.
9.  Let `declaredVarNames` be a new empty [List](#sec-list-and-record-specification-type).
10. For each element `d` of `varDeclarations`, do
    1.  If `d` is either a [VariableDeclaration](#prod-VariableDeclaration), a [ForBinding](#prod-ForBinding), or a [BindingIdentifier](#prod-BindingIdentifier), then
        1.  For each String `vn` of the [BoundNames](#sec-static-semantics-boundnames) of `d`, do
            1.  If `declaredFunctionNames` does not contain `vn`, then
                1.  Let `vnDefinable` be ? [CanDeclareGlobalVar](#sec-candeclareglobalvar)(`env`, `vn`).
                2.  If `vnDefinable` is false, throw a TypeError exception.
                3.  If `declaredVarNames` does not contain `vn`, then
                    1.  Append `vn` to `declaredVarNames`.
11. NOTE: No abnormal terminations occur after this algorithm step if the [global object](#sec-global-object) is an [ordinary object](#ordinary-object). However, if the [global object](#sec-global-object) is a [Proxy exotic object](#proxy-exotic-object) it may exhibit behaviours that cause abnormal terminations in some of the following steps.
12. NOTE: Annex [B.3.2.2](#sec-web-compat-globaldeclarationinstantiation) adds additional steps at this point.
13. Let `lexDeclarations` be the [LexicallyScopedDeclarations](#sec-static-semantics-lexicallyscopeddeclarations) of `script`.
14. Let `privateEnv` be null.
15. For each element `d` of `lexDeclarations`, do
    1.  NOTE: Lexically declared names are only instantiated here but not initialized.
    2.  For each element `dn` of the [BoundNames](#sec-static-semantics-boundnames) of `d`, do
        1.  If [IsConstantDeclaration](#sec-static-semantics-isconstantdeclaration) of `d` is true, then
            1.  Perform ? `env`.CreateImmutableBinding(`dn`, true).
        2.  Else,
            1.  Perform ? `env`.CreateMutableBinding(`dn`, false).
16. For each [Parse Node](#sec-syntactic-grammar) `f` of `functionsToInitialize`, do
    1.  Let `fn` be the sole element of the [BoundNames](#sec-static-semantics-boundnames) of `f`.
    2.  Let `fo` be [InstantiateFunctionObject](#sec-runtime-semantics-instantiatefunctionobject) of `f` with arguments `env` and `privateEnv`.
    3.  Perform ? [CreateGlobalFunctionBinding](#sec-createglobalfunctionbinding)(`env`, `fn`, `fo`, false).
17. For each String `vn` of `declaredVarNames`, do
    1.  Perform ? [CreateGlobalVarBinding](#sec-createglobalvarbinding)(`env`, `vn`, false).
18. Return unused.

Note 2

[Early errors](#early-error) specified in [16.1.1](#sec-scripts-static-semantics-early-errors) prevent name conflicts between function/var declarations and let/const/class declarations as well as redeclaration of let/const/class bindings for declaration contained within a single [Script](#prod-Script). However, such conflicts and redeclarations that span more than one [Script](#prod-Script) are detected as runtime errors during GlobalDeclarationInstantiation. If any such errors are detected, no bindings are instantiated for the script. However, if the [global object](#sec-global-object) is defined using [Proxy exotic objects](#proxy-exotic-object) then the runtime tests for conflicting declarations may be unreliable resulting in an [abrupt completion](#sec-completion-record-specification-type) and some global declarations not being instantiated. If this occurs, the code for the [Script](#prod-Script) is not evaluated.

Unlike explicit var or function declarations, properties that are directly created on the [global object](#sec-global-object) result in global bindings that may be shadowed by let/const/class declarations.

## 16.2 Modules

### Syntax

[Module](#prod-Module) : [ModuleBody](#prod-ModuleBody)opt [ModuleBody](#prod-ModuleBody) : [ModuleItemList](#prod-ModuleItemList) [ModuleItemList](#prod-ModuleItemList) : [ModuleItem](#prod-ModuleItem) [ModuleItemList](#prod-ModuleItemList) [ModuleItem](#prod-ModuleItem) [ModuleItem](#prod-ModuleItem) : [ImportDeclaration](#prod-ImportDeclaration) [ExportDeclaration](#prod-ExportDeclaration) [StatementListItem](#prod-StatementListItem)\[~Yield, +Await, ~Return\] [ModuleExportName](#prod-ModuleExportName) : [IdentifierName](#prod-IdentifierName) [StringLiteral](#prod-StringLiteral)

### 16.2.1 Module Semantics

#### 16.2.1.1 Static Semantics: Early Errors

[ModuleBody](#prod-ModuleBody) : [ModuleItemList](#prod-ModuleItemList)

- It is a Syntax Error if the [LexicallyDeclaredNames](#sec-static-semantics-lexicallydeclarednames) of [ModuleItemList](#prod-ModuleItemList) contains any duplicate entries.
- It is a Syntax Error if any element of the [LexicallyDeclaredNames](#sec-static-semantics-lexicallydeclarednames) of [ModuleItemList](#prod-ModuleItemList) also occurs in the [VarDeclaredNames](#sec-static-semantics-vardeclarednames) of [ModuleItemList](#prod-ModuleItemList).
- It is a Syntax Error if the [ExportedNames](#sec-static-semantics-exportednames) of [ModuleItemList](#prod-ModuleItemList) contains any duplicate entries.
- It is a Syntax Error if any element of the [ExportedBindings](#sec-static-semantics-exportedbindings) of [ModuleItemList](#prod-ModuleItemList) does not also occur in either the [VarDeclaredNames](#sec-static-semantics-vardeclarednames) of [ModuleItemList](#prod-ModuleItemList), or the [LexicallyDeclaredNames](#sec-static-semantics-lexicallydeclarednames) of [ModuleItemList](#prod-ModuleItemList).
- It is a Syntax Error if [ModuleItemList](#prod-ModuleItemList) [Contains](#sec-static-semantics-contains) `super`.
- It is a Syntax Error if [ModuleItemList](#prod-ModuleItemList) [Contains](#sec-static-semantics-contains) [NewTarget](#prod-NewTarget).
- It is a Syntax Error if [ContainsDuplicateLabels](#sec-static-semantics-containsduplicatelabels) of [ModuleItemList](#prod-ModuleItemList) with argument « » is true.
- It is a Syntax Error if [ContainsUndefinedBreakTarget](#sec-static-semantics-containsundefinedbreaktarget) of [ModuleItemList](#prod-ModuleItemList) with argument « » is true.
- It is a Syntax Error if [ContainsUndefinedContinueTarget](#sec-static-semantics-containsundefinedcontinuetarget) of [ModuleItemList](#prod-ModuleItemList) with arguments « » and « » is true.
- It is a Syntax Error if [AllPrivateIdentifiersValid](#sec-static-semantics-allprivateidentifiersvalid) of [ModuleItemList](#prod-ModuleItemList) with argument « » is false.

Note

The duplicate [ExportedNames](#sec-static-semantics-exportednames) rule implies that multiple `export default` [ExportDeclaration](#prod-ExportDeclaration) items within a [ModuleBody](#prod-ModuleBody) is a Syntax Error. Additional error conditions relating to conflicting or duplicate declarations are checked during module linking prior to evaluation of a [Module](#prod-Module). If any such errors are detected the [Module](#prod-Module) is not evaluated.

[ModuleExportName](#prod-ModuleExportName) : [StringLiteral](#prod-StringLiteral)

- It is a Syntax Error if [IsStringWellFormedUnicode](#sec-isstringwellformedunicode)([SV](#sec-static-semantics-sv) of [StringLiteral](#prod-StringLiteral)) is false.

#### 16.2.1.2 Static Semantics: ImportedLocalNames ( `importEntries` )

The abstract operation ImportedLocalNames takes argument `importEntries` (a [List](#sec-list-and-record-specification-type) of [ImportEntry Records](#importentry-record)) and returns a [List](#sec-list-and-record-specification-type) of Strings. It creates a [List](#sec-list-and-record-specification-type) of all of the local name bindings defined by `importEntries`. It performs the following steps when called:

1.  Let `localNames` be a new empty [List](#sec-list-and-record-specification-type).
2.  For each [ImportEntry Record](#importentry-record) `i` of `importEntries`, do
    1.  Append `i`.`[[LocalName]]` to `localNames`.
3.  Return `localNames`.

#### 16.2.1.3 ModuleRequest Records

A ModuleRequest Record represents the request to import a module with given import attributes. It consists of the following fields:

|  |  |  |
|----|----|----|
| Field Name | Value Type | Meaning |
| `[[Specifier]]` | a String | The module specifier |
| `[[Attributes]]` | a [List](#sec-list-and-record-specification-type) of [ImportAttribute Records](#importattribute-record) | The import attributes |

Table 40: [ModuleRequest Record](#modulerequest-record) Fields

A LoadedModuleRequest Record represents the request to import a module together with the resulting [Module Record](#sec-abstract-module-records). It consists of the same fields defined in table [Table 40](#table-modulerequest-fields), with the addition of `[[Module]]`:

|  |  |  |
|----|----|----|
| Field Name | Value Type | Meaning |
| `[[Specifier]]` | a String | The module specifier |
| `[[Attributes]]` | a [List](#sec-list-and-record-specification-type) of [ImportAttribute Records](#importattribute-record) | The import attributes |
| `[[Module]]` | a [Module Record](#sec-abstract-module-records) | The loaded module corresponding to this module request |

Table 41: [LoadedModuleRequest Record](#loadedmodulerequest-record) Fields

An ImportAttribute Record consists of the following fields:

|             |            |                     |
|-------------|------------|---------------------|
| Field Name  | Value Type | Meaning             |
| `[[Key]]`   | a String   | The attribute key   |
| `[[Value]]` | a String   | The attribute value |

Table 42: [ImportAttribute Record](#importattribute-record) Fields

##### 16.2.1.3.1 ModuleRequestsEqual ( `left`, `right` )

The abstract operation ModuleRequestsEqual takes arguments `left` (a [ModuleRequest Record](#modulerequest-record) or a [LoadedModuleRequest Record](#loadedmodulerequest-record)) and `right` (a [ModuleRequest Record](#modulerequest-record) or a [LoadedModuleRequest Record](#loadedmodulerequest-record)) and returns a Boolean. It performs the following steps when called:

1.  If `left`.`[[Specifier]]` is not `right`.`[[Specifier]]`, return false.
2.  Let `leftAttrs` be `left`.`[[Attributes]]`.
3.  Let `rightAttrs` be `right`.`[[Attributes]]`.
4.  Let `leftAttrsCount` be the number of elements in `leftAttrs`.
5.  Let `rightAttrsCount` be the number of elements in `rightAttrs`.
6.  If `leftAttrsCount` ≠ `rightAttrsCount`, return false.
7.  For each [ImportAttribute Record](#importattribute-record) `l` of `leftAttrs`, do
    1.  If `rightAttrs` does not contain an [ImportAttribute Record](#importattribute-record) `r` such that `l`.`[[Key]]` is `r`.`[[Key]]` and `l`.`[[Value]]` is `r`.`[[Value]]`, return false.
8.  Return true.

#### 16.2.1.4 Static Semantics: ModuleRequests

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) ModuleRequests takes no arguments and returns a [List](#sec-list-and-record-specification-type) of [ModuleRequest Records](#modulerequest-record). It is defined piecewise over the following productions:

[Module](#prod-Module) : \[empty\]

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[ModuleItemList](#prod-ModuleItemList) : [ModuleItem](#prod-ModuleItem)

1.  Return the [ModuleRequests](#sec-static-semantics-modulerequests) of [ModuleItem](#prod-ModuleItem).

[ModuleItemList](#prod-ModuleItemList) : [ModuleItemList](#prod-ModuleItemList) [ModuleItem](#prod-ModuleItem)

1.  Let `requests` be the [ModuleRequests](#sec-static-semantics-modulerequests) of [ModuleItemList](#prod-ModuleItemList).
2.  Let `additionalRequests` be the [ModuleRequests](#sec-static-semantics-modulerequests) of [ModuleItem](#prod-ModuleItem).
3.  For each [ModuleRequest Record](#modulerequest-record) `mr` of `additionalRequests`, do
    1.  If `requests` does not contain a [ModuleRequest Record](#modulerequest-record) `mr2` such that [ModuleRequestsEqual](#sec-ModuleRequestsEqual)(`mr`, `mr2`) is true, then
        1.  Append `mr` to `requests`.
4.  Return `requests`.

[ModuleItem](#prod-ModuleItem) : [StatementListItem](#prod-StatementListItem)

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[ImportDeclaration](#prod-ImportDeclaration) : import [ImportClause](#prod-ImportClause) [FromClause](#prod-FromClause) ;

1.  Let `specifier` be the [SV](#sec-static-semantics-sv) of [FromClause](#prod-FromClause).
2.  Return a [List](#sec-list-and-record-specification-type) whose sole element is the [ModuleRequest Record](#modulerequest-record) { `[[Specifier]]`: `specifier`, `[[Attributes]]`: « » }.

[ImportDeclaration](#prod-ImportDeclaration) : import [ImportClause](#prod-ImportClause) [FromClause](#prod-FromClause) [WithClause](#prod-WithClause) ;

1.  Let `specifier` be the [SV](#sec-static-semantics-sv) of [FromClause](#prod-FromClause).
2.  Let `attributes` be [WithClauseToAttributes](#sec-withclausetoattributes) of [WithClause](#prod-WithClause).
3.  Return a [List](#sec-list-and-record-specification-type) whose sole element is the [ModuleRequest Record](#modulerequest-record) { `[[Specifier]]`: `specifier`, `[[Attributes]]`: `attributes` }.

[ImportDeclaration](#prod-ImportDeclaration) : import [ModuleSpecifier](#prod-ModuleSpecifier) ;

1.  Let `specifier` be the [SV](#sec-static-semantics-sv) of [ModuleSpecifier](#prod-ModuleSpecifier).
2.  Return a [List](#sec-list-and-record-specification-type) whose sole element is the [ModuleRequest Record](#modulerequest-record) { `[[Specifier]]`: `specifier`, `[[Attributes]]`: « » }.

[ImportDeclaration](#prod-ImportDeclaration) : import [ModuleSpecifier](#prod-ModuleSpecifier) [WithClause](#prod-WithClause) ;

1.  Let `specifier` be the [SV](#sec-static-semantics-sv) of [ModuleSpecifier](#prod-ModuleSpecifier).
2.  Let `attributes` be [WithClauseToAttributes](#sec-withclausetoattributes) of [WithClause](#prod-WithClause).
3.  Return a [List](#sec-list-and-record-specification-type) whose sole element is the [ModuleRequest Record](#modulerequest-record) { `[[Specifier]]`: `specifier`, `[[Attributes]]`: `attributes` }.

[ExportDeclaration](#prod-ExportDeclaration) : export [ExportFromClause](#prod-ExportFromClause) [FromClause](#prod-FromClause) ;

1.  Let `specifier` be the [SV](#sec-static-semantics-sv) of [FromClause](#prod-FromClause).
2.  Return a [List](#sec-list-and-record-specification-type) whose sole element is the [ModuleRequest Record](#modulerequest-record) { `[[Specifier]]`: `specifier`, `[[Attributes]]`: « » }.

[ExportDeclaration](#prod-ExportDeclaration) : export [ExportFromClause](#prod-ExportFromClause) [FromClause](#prod-FromClause) [WithClause](#prod-WithClause) ;

1.  Let `specifier` be the [SV](#sec-static-semantics-sv) of [FromClause](#prod-FromClause).
2.  Let `attributes` be [WithClauseToAttributes](#sec-withclausetoattributes) of [WithClause](#prod-WithClause).
3.  Return a [List](#sec-list-and-record-specification-type) whose sole element is the [ModuleRequest Record](#modulerequest-record) { `[[Specifier]]`: `specifier`, `[[Attributes]]`: `attributes` }.

[ExportDeclaration](#prod-ExportDeclaration) : export [NamedExports](#prod-NamedExports) ; export [VariableStatement](#prod-VariableStatement) export [Declaration](#prod-Declaration) export default [HoistableDeclaration](#prod-HoistableDeclaration) export default [ClassDeclaration](#prod-ClassDeclaration) export default [AssignmentExpression](#prod-AssignmentExpression) ;

1.  Return a new empty [List](#sec-list-and-record-specification-type).

#### 16.2.1.5 Abstract Module Records

A Module Record encapsulates structural information about the imports and exports of a single module. This information is used to link the imports and exports of sets of connected modules. A Module Record includes four fields that are only used when evaluating a module.

For specification purposes Module Record values are values of the [Record](#sec-list-and-record-specification-type) specification type and can be thought of as existing in a simple object-oriented hierarchy where Module Record is an abstract class with both abstract and concrete subclasses. This specification defines the abstract subclass named [Cyclic Module Record](#cyclic-module-record) and its concrete subclass named [Source Text Module Record](#sourctextmodule-record). Other specifications and implementations may define additional Module Record subclasses corresponding to alternative module definition facilities that they defined.

Module Record defines the fields listed in [Table 43](#table-module-record-fields). All Module Definition subclasses include at least those fields. Module Record also defines the abstract method list in [Table 44](#table-abstract-methods-of-module-records). All Module definition subclasses must provide concrete implementations of these abstract methods.

| Field Name | Value Type | Meaning |
|----|----|----|
| `[[Realm]]` | a [Realm Record](#realm-record) | The [Realm](#realm) within which this module was created. |
| `[[Environment]]` | a [Module Environment Record](#sec-module-environment-records) or empty | The [Environment Record](#sec-environment-records) containing the top level bindings for this module. This field is set when the module is linked. |
| `[[Namespace]]` | an Object or empty | The Module Namespace Object ([28.3](#sec-module-namespace-objects)) if one has been created for this module. |
| `[[HostDefined]]` | anything (default value is undefined) | Field reserved for use by [host environments](#host-environment) that need to associate additional information with a module. |

Table 43: [Module Record](#sec-abstract-module-records) Fields

[TABLE]

Table 44: Abstract Methods of [Module Records](#sec-abstract-module-records)

#### 16.2.1.6 Cyclic Module Records

A Cyclic Module Record is used to represent information about a module that can participate in dependency cycles with other modules that are subclasses of the [Cyclic Module Record](#cyclic-module-record) type. [Module Records](#sec-abstract-module-records) that are not subclasses of the [Cyclic Module Record](#cyclic-module-record) type must not participate in dependency cycles with [Source Text Module Records](#sourctextmodule-record).

In addition to the fields defined in [Table 43](#table-module-record-fields) [Cyclic Module Records](#cyclic-module-record) have the additional fields listed in [Table 45](#table-cyclic-module-fields)

| Field Name | Value Type | Meaning |
|----|----|----|
| `[[Status]]` | new, unlinked, linking, linked, evaluating, evaluating-async, or evaluated | Initially new. Transitions to unlinked, linking, linked, evaluating, possibly evaluating-async, evaluated (in that order) as the module progresses throughout its lifecycle. evaluating-async indicates this module is queued to execute on completion of its asynchronous dependencies or it is a module whose `[[HasTLA]]` field is true that has been executed and is pending top-level completion. |
| `[[EvaluationError]]` | a [throw completion](#sec-completion-record-specification-type) or empty | A [throw completion](#sec-completion-record-specification-type) representing the exception that occurred during evaluation. undefined if no exception occurred or if `[[Status]]` is not evaluated. |
| `[[DFSIndex]]` | an [integer](#integer) or empty | Auxiliary field used during Link and Evaluate only. If `[[Status]]` is either linking or evaluating, this non-negative number records the point at which the module was first visited during the depth-first traversal of the dependency graph. |
| `[[DFSAncestorIndex]]` | an [integer](#integer) or empty | Auxiliary field used during Link and Evaluate only. If `[[Status]]` is either linking or evaluating, this is either the module's own `[[DFSIndex]]` or that of an "earlier" module in the same strongly connected component. |
| `[[RequestedModules]]` | a [List](#sec-list-and-record-specification-type) of [ModuleRequest Records](#modulerequest-record) | A [List](#sec-list-and-record-specification-type) of the [ModuleRequest Records](#modulerequest-record) associated with the imports in this module. The [List](#sec-list-and-record-specification-type) is in source text occurrence order of the imports. |
| `[[LoadedModules]]` | a [List](#sec-list-and-record-specification-type) of [LoadedModuleRequest Records](#loadedmodulerequest-record) | A map from the specifier strings used by the module represented by this record to request the importation of a module with the relative import attributes to the resolved [Module Record](#sec-abstract-module-records). The list does not contain two different [Records](#sec-list-and-record-specification-type) `r1` and `r2` such that [ModuleRequestsEqual](#sec-ModuleRequestsEqual)(`r1`, `r2`) is true. |
| `[[CycleRoot]]` | a [Cyclic Module Record](#cyclic-module-record) or empty | The first visited module of the cycle, the root DFS ancestor of the strongly connected component. For a module not in a cycle, this would be the module itself. Once Evaluate has completed, a module's `[[DFSAncestorIndex]]` is the `[[DFSIndex]]` of its `[[CycleRoot]]`. |
| `[[HasTLA]]` | a Boolean | Whether this module is individually asynchronous (for example, if it's a [Source Text Module Record](#sourctextmodule-record) containing a top-level await). Having an asynchronous dependency does not mean this field is true. This field must not change after the module is parsed. |
| `[[AsyncEvaluationOrder]]` | unset, an [integer](#integer), or done | This field is initially set to unset, and remains unset for fully synchronous modules. For modules that are either themselves asynchronous or have an asynchronous dependency, it is set to an [integer](#integer) that determines the order in which execution of pending modules is queued by [16.2.1.6.1.3.4](#sec-async-module-execution-fulfilled). Once the pending module is executed, the field is set to done. |
| `[[TopLevelCapability]]` | a [PromiseCapability Record](#sec-promisecapability-records) or empty | If this module is the `[[CycleRoot]]` of some cycle, and Evaluate() was called on some module in that cycle, this field contains the [PromiseCapability Record](#sec-promisecapability-records) for that entire evaluation. It is used to settle the Promise object that is returned from the Evaluate() abstract method. This field will be empty for any dependencies of that module, unless a top-level Evaluate() has been initiated for some of those dependencies. |
| `[[AsyncParentModules]]` | a [List](#sec-list-and-record-specification-type) of [Cyclic Module Records](#cyclic-module-record) | If this module or a dependency has `[[HasTLA]]` true, and execution is in progress, this tracks the parent importers of this module for the top-level execution job. These parent modules will not start executing before this module has successfully completed execution. |
| `[[PendingAsyncDependencies]]` | an [integer](#integer) or empty | If this module has any asynchronous dependencies, this tracks the number of asynchronous dependency modules remaining to execute for this module. A module with asynchronous dependencies will be executed when this field reaches 0 and there are no execution errors. |

Table 45: Additional Fields of [Cyclic Module Records](#cyclic-module-record)

In addition to the methods defined in [Table 44](#table-abstract-methods-of-module-records) [Cyclic Module Records](#cyclic-module-record) have the additional methods listed in [Table 46](#table-cyclic-module-methods)

| Method | Purpose |
|----|----|
| InitializeEnvironment() | Initialize the [Environment Record](#sec-environment-records) of the module, including resolving all imported bindings, and create the module's [execution context](#sec-execution-contexts). |
| ExecuteModule(\[`promiseCapability`\]) | Evaluate the module's code within its [execution context](#sec-execution-contexts). If this module has true in `[[HasTLA]]`, then a [PromiseCapability Record](#sec-promisecapability-records) is passed as an argument, and the method is expected to resolve or reject the given capability. In this case, the method must not throw an exception, but instead reject the [PromiseCapability Record](#sec-promisecapability-records) if necessary. |

Table 46: Additional Abstract Methods of [Cyclic Module Records](#cyclic-module-record)

A GraphLoadingState Record is a [Record](#sec-list-and-record-specification-type) that contains information about the loading process of a module graph. It's used to continue loading after a call to [HostLoadImportedModule](#sec-HostLoadImportedModule). Each [GraphLoadingState Record](#graphloadingstate-record) has the fields defined in [Table 47](#table-graphloadingstate-record-fields):

| Field Name | Value Type | Meaning |
|----|----|----|
| `[[PromiseCapability]]` | a [PromiseCapability Record](#sec-promisecapability-records) | The promise to resolve when the loading process finishes. |
| `[[IsLoading]]` | a Boolean | It is true if the loading process has not finished yet, neither successfully nor with an error. |
| `[[PendingModulesCount]]` | a non-negative [integer](#integer) | It tracks the number of pending [HostLoadImportedModule](#sec-HostLoadImportedModule) calls. |
| `[[Visited]]` | a [List](#sec-list-and-record-specification-type) of [Cyclic Module Records](#cyclic-module-record) | It is a list of the [Cyclic Module Records](#cyclic-module-record) that have been already loaded by the current loading process, to avoid infinite loops with circular dependencies. |
| `[[HostDefined]]` | anything (default value is empty) | It contains [host-defined](#host-defined) data to pass from the LoadRequestedModules caller to [HostLoadImportedModule](#sec-HostLoadImportedModule). |

Table 47: [GraphLoadingState Record](#graphloadingstate-record) Fields

##### 16.2.1.6.1 Implementation of Module Record Abstract Methods

The following are the concrete methods for [Cyclic Module Record](#cyclic-module-record) that implement the corresponding [Module Record](#sec-abstract-module-records) abstract methods defined in [Table 44](#table-abstract-methods-of-module-records).

###### 16.2.1.6.1.1 LoadRequestedModules ( \[ `hostDefined` \] )

The LoadRequestedModules concrete method of a [Cyclic Module Record](#cyclic-module-record) `module` takes optional argument `hostDefined` (anything) and returns a Promise. It populates the `[[LoadedModules]]` of all the [Module Records](#sec-abstract-module-records) in the dependency graph of `module` (most of the work is done by the auxiliary function [InnerModuleLoading](#sec-InnerModuleLoading)). It takes an optional `hostDefined` parameter that is passed to the [HostLoadImportedModule](#sec-HostLoadImportedModule) hook. It performs the following steps when called:

1.  If `hostDefined` is not present, let `hostDefined` be empty.
2.  Let `pc` be ! [NewPromiseCapability](#sec-newpromisecapability)([%Promise%](#sec-promise-constructor)).
3.  Let `state` be the [GraphLoadingState Record](#graphloadingstate-record) { `[[IsLoading]]`: true, `[[PendingModulesCount]]`: 1, `[[Visited]]`: « », `[[PromiseCapability]]`: `pc`, `[[HostDefined]]`: `hostDefined` }.
4.  Perform [InnerModuleLoading](#sec-InnerModuleLoading)(`state`, `module`).
5.  Return `pc`.`[[Promise]]`.

Note

The `hostDefined` parameter can be used to pass additional information necessary to fetch the imported modules. It is used, for example, by HTML to set the correct fetch destination for `<link rel="preload" as="...">` tags. `import()` expressions never set the `hostDefined` parameter.

###### 16.2.1.6.1.1.1 InnerModuleLoading ( `state`, `module` )

The abstract operation InnerModuleLoading takes arguments `state` (a [GraphLoadingState Record](#graphloadingstate-record)) and `module` (a [Module Record](#sec-abstract-module-records)) and returns unused. It is used by LoadRequestedModules to recursively perform the actual loading process for `module`'s dependency graph. It performs the following steps when called:

1.  [Assert](#assert): `state`.`[[IsLoading]]` is true.
2.  If `module` is a [Cyclic Module Record](#cyclic-module-record), `module`.`[[Status]]` is new, and `state`.`[[Visited]]` does not contain `module`, then
    1.  Append `module` to `state`.`[[Visited]]`.
    2.  Let `requestedModulesCount` be the number of elements in `module`.`[[RequestedModules]]`.
    3.  Set `state`.`[[PendingModulesCount]]` to `state`.`[[PendingModulesCount]]` + `requestedModulesCount`.
    4.  For each [ModuleRequest Record](#modulerequest-record) `request` of `module`.`[[RequestedModules]]`, do
        1.  If [AllImportAttributesSupported](#sec-AllImportAttributesSupported)(`request`.`[[Attributes]]`) is false, then
            1.  Let `error` be [ThrowCompletion](#sec-throwcompletion)(a newly created SyntaxError object).
            2.  Perform [ContinueModuleLoading](#sec-ContinueModuleLoading)(`state`, `error`).
        2.  Else if `module`.`[[LoadedModules]]` contains a [LoadedModuleRequest Record](#loadedmodulerequest-record) `record` such that [ModuleRequestsEqual](#sec-ModuleRequestsEqual)(`record`, `request`) is true, then
            1.  Perform [InnerModuleLoading](#sec-InnerModuleLoading)(`state`, `record`.`[[Module]]`).
        3.  Else,
            1.  Perform [HostLoadImportedModule](#sec-HostLoadImportedModule)(`module`, `request`, `state`.`[[HostDefined]]`, `state`).
            2.  NOTE: [HostLoadImportedModule](#sec-HostLoadImportedModule) will call [FinishLoadingImportedModule](#sec-FinishLoadingImportedModule), which re-enters the graph loading process through [ContinueModuleLoading](#sec-ContinueModuleLoading).
        4.  If `state`.`[[IsLoading]]` is false, return unused.
3.  [Assert](#assert): `state`.`[[PendingModulesCount]]` ≥ 1.
4.  Set `state`.`[[PendingModulesCount]]` to `state`.`[[PendingModulesCount]]` - 1.
5.  If `state`.`[[PendingModulesCount]]` = 0, then
    1.  Set `state`.`[[IsLoading]]` to false.
    2.  For each [Cyclic Module Record](#cyclic-module-record) `loaded` of `state`.`[[Visited]]`, do
        1.  If `loaded`.`[[Status]]` is new, set `loaded`.`[[Status]]` to unlinked.
    3.  Perform ! [Call](#sec-call)(`state`.`[[PromiseCapability]]`.`[[Resolve]]`, undefined, « undefined »).
6.  Return unused.

###### 16.2.1.6.1.1.2 ContinueModuleLoading ( `state`, `moduleCompletion` )

The abstract operation ContinueModuleLoading takes arguments `state` (a [GraphLoadingState Record](#graphloadingstate-record)) and `moduleCompletion` (either a [normal completion containing](#sec-completion-record-specification-type) a [Module Record](#sec-abstract-module-records) or a [throw completion](#sec-completion-record-specification-type)) and returns unused. It is used to re-enter the loading process after a call to [HostLoadImportedModule](#sec-HostLoadImportedModule). It performs the following steps when called:

1.  If `state`.`[[IsLoading]]` is false, return unused.
2.  If `moduleCompletion` is a [normal completion](#sec-completion-record-specification-type), then
    1.  Perform [InnerModuleLoading](#sec-InnerModuleLoading)(`state`, `moduleCompletion`.`[[Value]]`).
3.  Else,
    1.  Set `state`.`[[IsLoading]]` to false.
    2.  Perform ! [Call](#sec-call)(`state`.`[[PromiseCapability]]`.`[[Reject]]`, undefined, « `moduleCompletion`.`[[Value]]` »).
4.  Return unused.

###### 16.2.1.6.1.2 Link ( )

The Link concrete method of a [Cyclic Module Record](#cyclic-module-record) `module` takes no arguments and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or a [throw completion](#sec-completion-record-specification-type). On success, Link transitions this module's `[[Status]]` from unlinked to linked. On failure, an exception is thrown and this module's `[[Status]]` remains unlinked. (Most of the work is done by the auxiliary function [InnerModuleLinking](#sec-InnerModuleLinking).) It performs the following steps when called:

1.  [Assert](#assert): `module`.`[[Status]]` is one of unlinked, linked, evaluating-async, or evaluated.
2.  Let `stack` be a new empty [List](#sec-list-and-record-specification-type).
3.  Let `result` be [Completion](#sec-completion-ao)([InnerModuleLinking](#sec-InnerModuleLinking)(`module`, `stack`, 0)).
4.  If `result` is an [abrupt completion](#sec-completion-record-specification-type), then
    1.  For each [Cyclic Module Record](#cyclic-module-record) `m` of `stack`, do
        1.  [Assert](#assert): `m`.`[[Status]]` is linking.
        2.  Set `m`.`[[Status]]` to unlinked.
    2.  [Assert](#assert): `module`.`[[Status]]` is unlinked.
    3.  Return ? `result`.
5.  [Assert](#assert): `module`.`[[Status]]` is one of linked, evaluating-async, or evaluated.
6.  [Assert](#assert): `stack` is empty.
7.  Return unused.

###### 16.2.1.6.1.2.1 InnerModuleLinking ( `module`, `stack`, `index` )

The abstract operation InnerModuleLinking takes arguments `module` (a [Module Record](#sec-abstract-module-records)), `stack` (a [List](#sec-list-and-record-specification-type) of [Cyclic Module Records](#cyclic-module-record)), and `index` (a non-negative [integer](#integer)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a non-negative [integer](#integer) or a [throw completion](#sec-completion-record-specification-type). It is used by Link to perform the actual linking process for `module`, as well as recursively on all other modules in the dependency graph. The `stack` and `index` parameters, as well as a module's `[[DFSIndex]]` and `[[DFSAncestorIndex]]` fields, keep track of the depth-first search (DFS) traversal. In particular, `[[DFSAncestorIndex]]` is used to discover strongly connected components (SCCs), such that all modules in an SCC transition to linked together. It performs the following steps when called:

1.  If `module` is not a [Cyclic Module Record](#cyclic-module-record), then
    1.  Perform ? `module`.Link().
    2.  Return `index`.
2.  If `module`.`[[Status]]` is one of linking, linked, evaluating-async, or evaluated, then
    1.  Return `index`.
3.  [Assert](#assert): `module`.`[[Status]]` is unlinked.
4.  Set `module`.`[[Status]]` to linking.
5.  Set `module`.`[[DFSIndex]]` to `index`.
6.  Set `module`.`[[DFSAncestorIndex]]` to `index`.
7.  Set `index` to `index` + 1.
8.  Append `module` to `stack`.
9.  For each [ModuleRequest Record](#modulerequest-record) `request` of `module`.`[[RequestedModules]]`, do
    1.  Let `requiredModule` be [GetImportedModule](#sec-GetImportedModule)(`module`, `request`).
    2.  Set `index` to ? [InnerModuleLinking](#sec-InnerModuleLinking)(`requiredModule`, `stack`, `index`).
    3.  If `requiredModule` is a [Cyclic Module Record](#cyclic-module-record), then
        1.  [Assert](#assert): `requiredModule`.`[[Status]]` is one of linking, linked, evaluating-async, or evaluated.
        2.  [Assert](#assert): `requiredModule`.`[[Status]]` is linking if and only if `stack` contains `requiredModule`.
        3.  If `requiredModule`.`[[Status]]` is linking, then
            1.  Set `module`.`[[DFSAncestorIndex]]` to [min](#eqn-min)(`module`.`[[DFSAncestorIndex]]`, `requiredModule`.`[[DFSAncestorIndex]]`).
10. Perform ? `module`.InitializeEnvironment().
11. [Assert](#assert): `module` occurs exactly once in `stack`.
12. [Assert](#assert): `module`.`[[DFSAncestorIndex]]` ≤ `module`.`[[DFSIndex]]`.
13. If `module`.`[[DFSAncestorIndex]]` = `module`.`[[DFSIndex]]`, then
    1.  Let `done` be false.
    2.  Repeat, while `done` is false,
        1.  Let `requiredModule` be the last element of `stack`.
        2.  Remove the last element of `stack`.
        3.  [Assert](#assert): `requiredModule` is a [Cyclic Module Record](#cyclic-module-record).
        4.  Set `requiredModule`.`[[Status]]` to linked.
        5.  If `requiredModule` and `module` are the same [Module Record](#sec-abstract-module-records), set `done` to true.
14. Return `index`.

###### 16.2.1.6.1.3 Evaluate ( )

The Evaluate concrete method of a [Cyclic Module Record](#cyclic-module-record) `module` takes no arguments and returns a Promise. Evaluate transitions this module's `[[Status]]` from linked to either evaluating-async or evaluated. The first time it is called on a module in a given strongly connected component, Evaluate creates and returns a Promise which resolves when the module has finished evaluating. This Promise is stored in the `[[TopLevelCapability]]` field of the `[[CycleRoot]]` for the component. Future invocations of Evaluate on any module in the component return the same Promise. (Most of the work is done by the auxiliary function [InnerModuleEvaluation](#sec-innermoduleevaluation).) It performs the following steps when called:

1.  [Assert](#assert): This call to Evaluate is not happening at the same time as another call to Evaluate within the [surrounding agent](#surrounding-agent).
2.  [Assert](#assert): `module`.`[[Status]]` is one of linked, evaluating-async, or evaluated.
3.  If `module`.`[[Status]]` is either evaluating-async or evaluated, set `module` to `module`.`[[CycleRoot]]`.
4.  If `module`.`[[TopLevelCapability]]` is not empty, then
    1.  Return `module`.`[[TopLevelCapability]]`.`[[Promise]]`.
5.  Let `stack` be a new empty [List](#sec-list-and-record-specification-type).
6.  Let `capability` be ! [NewPromiseCapability](#sec-newpromisecapability)([%Promise%](#sec-promise-constructor)).
7.  Set `module`.`[[TopLevelCapability]]` to `capability`.
8.  Let `result` be [Completion](#sec-completion-ao)([InnerModuleEvaluation](#sec-innermoduleevaluation)(`module`, `stack`, 0)).
9.  If `result` is an [abrupt completion](#sec-completion-record-specification-type), then
    1.  For each [Cyclic Module Record](#cyclic-module-record) `m` of `stack`, do
        1.  [Assert](#assert): `m`.`[[Status]]` is evaluating.
        2.  [Assert](#assert): `m`.`[[AsyncEvaluationOrder]]` is unset.
        3.  Set `m`.`[[Status]]` to evaluated.
        4.  Set `m`.`[[EvaluationError]]` to `result`.
    2.  [Assert](#assert): `module`.`[[Status]]` is evaluated.
    3.  [Assert](#assert): `module`.`[[EvaluationError]]` and `result` are the same [Completion Record](#sec-completion-record-specification-type).
    4.  Perform ! [Call](#sec-call)(`capability`.`[[Reject]]`, undefined, « `result`.`[[Value]]` »).
10. Else,
    1.  [Assert](#assert): `module`.`[[Status]]` is either evaluating-async or evaluated.
    2.  [Assert](#assert): `module`.`[[EvaluationError]]` is empty.
    3.  If `module`.`[[Status]]` is evaluated, then
        1.  NOTE: This implies that evaluation of `module` completed synchronously.
        2.  [Assert](#assert): `module`.`[[AsyncEvaluationOrder]]` is unset.
        3.  Perform ! [Call](#sec-call)(`capability`.`[[Resolve]]`, undefined, « undefined »).
    4.  [Assert](#assert): `stack` is empty.
11. Return `capability`.`[[Promise]]`.

###### 16.2.1.6.1.3.1 InnerModuleEvaluation ( `module`, `stack`, `index` )

The abstract operation InnerModuleEvaluation takes arguments `module` (a [Module Record](#sec-abstract-module-records)), `stack` (a [List](#sec-list-and-record-specification-type) of [Cyclic Module Records](#cyclic-module-record)), and `index` (a non-negative [integer](#integer)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a non-negative [integer](#integer) or a [throw completion](#sec-completion-record-specification-type). It is used by Evaluate to perform the actual evaluation process for `module`, as well as recursively on all other modules in the dependency graph. The `stack` and `index` parameters, as well as `module`'s `[[DFSIndex]]` and `[[DFSAncestorIndex]]` fields, are used the same way as in [InnerModuleLinking](#sec-InnerModuleLinking). It performs the following steps when called:

1.  If `module` is not a [Cyclic Module Record](#cyclic-module-record), then
    1.  Let `promise` be ! `module`.Evaluate().
    2.  [Assert](#assert): `promise`.`[[PromiseState]]` is not pending.
    3.  If `promise`.`[[PromiseState]]` is rejected, then
        1.  Return [ThrowCompletion](#sec-throwcompletion)(`promise`.`[[PromiseResult]]`).
    4.  Return `index`.
2.  If `module`.`[[Status]]` is either evaluating-async or evaluated, then
    1.  If `module`.`[[EvaluationError]]` is empty, return `index`.
    2.  Otherwise, return ? `module`.`[[EvaluationError]]`.
3.  If `module`.`[[Status]]` is evaluating, return `index`.
4.  [Assert](#assert): `module`.`[[Status]]` is linked.
5.  Set `module`.`[[Status]]` to evaluating.
6.  Set `module`.`[[DFSIndex]]` to `index`.
7.  Set `module`.`[[DFSAncestorIndex]]` to `index`.
8.  Set `module`.`[[PendingAsyncDependencies]]` to 0.
9.  Set `index` to `index` + 1.
10. Append `module` to `stack`.
11. For each [ModuleRequest Record](#modulerequest-record) `request` of `module`.`[[RequestedModules]]`, do
    1.  Let `requiredModule` be [GetImportedModule](#sec-GetImportedModule)(`module`, `request`).
    2.  Set `index` to ? [InnerModuleEvaluation](#sec-innermoduleevaluation)(`requiredModule`, `stack`, `index`).
    3.  If `requiredModule` is a [Cyclic Module Record](#cyclic-module-record), then
        1.  [Assert](#assert): `requiredModule`.`[[Status]]` is one of evaluating, evaluating-async, or evaluated.
        2.  [Assert](#assert): `requiredModule`.`[[Status]]` is evaluating if and only if `stack` contains `requiredModule`.
        3.  If `requiredModule`.`[[Status]]` is evaluating, then
            1.  Set `module`.`[[DFSAncestorIndex]]` to [min](#eqn-min)(`module`.`[[DFSAncestorIndex]]`, `requiredModule`.`[[DFSAncestorIndex]]`).
        4.  Else,
            1.  Set `requiredModule` to `requiredModule`.`[[CycleRoot]]`.
            2.  [Assert](#assert): `requiredModule`.`[[Status]]` is either evaluating-async or evaluated.
            3.  If `requiredModule`.`[[EvaluationError]]` is not empty, return ? `requiredModule`.`[[EvaluationError]]`.
        5.  If `requiredModule`.`[[AsyncEvaluationOrder]]` is an [integer](#integer), then
            1.  Set `module`.`[[PendingAsyncDependencies]]` to `module`.`[[PendingAsyncDependencies]]` + 1.
            2.  Append `module` to `requiredModule`.`[[AsyncParentModules]]`.
12. If `module`.`[[PendingAsyncDependencies]]` \> 0 or `module`.`[[HasTLA]]` is true, then
    1.  [Assert](#assert): `module`.`[[AsyncEvaluationOrder]]` is unset.
    2.  Set `module`.`[[AsyncEvaluationOrder]]` to [IncrementModuleAsyncEvaluationCount](#sec-IncrementModuleAsyncEvaluationCount)().
    3.  If `module`.`[[PendingAsyncDependencies]]` = 0, perform [ExecuteAsyncModule](#sec-execute-async-module)(`module`).
13. Else,
    1.  Perform ? `module`.ExecuteModule().
14. [Assert](#assert): `module` occurs exactly once in `stack`.
15. [Assert](#assert): `module`.`[[DFSAncestorIndex]]` ≤ `module`.`[[DFSIndex]]`.
16. If `module`.`[[DFSAncestorIndex]]` = `module`.`[[DFSIndex]]`, then
    1.  Let `done` be false.
    2.  Repeat, while `done` is false,
        1.  Let `requiredModule` be the last element of `stack`.
        2.  Remove the last element of `stack`.
        3.  [Assert](#assert): `requiredModule` is a [Cyclic Module Record](#cyclic-module-record).
        4.  [Assert](#assert): `requiredModule`.`[[AsyncEvaluationOrder]]` is either an [integer](#integer) or unset.
        5.  If `requiredModule`.`[[AsyncEvaluationOrder]]` is unset, set `requiredModule`.`[[Status]]` to evaluated.
        6.  Otherwise, set `requiredModule`.`[[Status]]` to evaluating-async.
        7.  If `requiredModule` and `module` are the same [Module Record](#sec-abstract-module-records), set `done` to true.
        8.  Set `requiredModule`.`[[CycleRoot]]` to `module`.
17. Return `index`.

Note 1

A module is evaluating while it is being traversed by InnerModuleEvaluation. A module is evaluated on execution completion or evaluating-async during execution if its `[[HasTLA]]` field is true or if it has asynchronous dependencies.

Note 2

Any modules depending on a module of an asynchronous cycle when that cycle is not evaluating will instead depend on the execution of the root of the cycle via `[[CycleRoot]]`. This ensures that the cycle state can be treated as a single strongly connected component through its root module state.

###### 16.2.1.6.1.3.2 ExecuteAsyncModule ( `module` )

The abstract operation ExecuteAsyncModule takes argument `module` (a [Cyclic Module Record](#cyclic-module-record)) and returns unused. It performs the following steps when called:

1.  [Assert](#assert): `module`.`[[Status]]` is either evaluating or evaluating-async.
2.  [Assert](#assert): `module`.`[[HasTLA]]` is true.
3.  Let `capability` be ! [NewPromiseCapability](#sec-newpromisecapability)([%Promise%](#sec-promise-constructor)).
4.  Let `fulfilledClosure` be a new [Abstract Closure](#sec-abstract-closure) with no parameters that captures `module` and performs the following steps when called:
    1.  Perform [AsyncModuleExecutionFulfilled](#sec-async-module-execution-fulfilled)(`module`).
    2.  Return undefined.
5.  Let `onFulfilled` be [CreateBuiltinFunction](#sec-createbuiltinfunction)(`fulfilledClosure`, 0, "", « »).
6.  Let `rejectedClosure` be a new [Abstract Closure](#sec-abstract-closure) with parameters (`error`) that captures `module` and performs the following steps when called:
    1.  Perform [AsyncModuleExecutionRejected](#sec-async-module-execution-rejected)(`module`, `error`).
    2.  Return undefined.
7.  Let `onRejected` be [CreateBuiltinFunction](#sec-createbuiltinfunction)(`rejectedClosure`, 0, "", « »).
8.  Perform [PerformPromiseThen](#sec-performpromisethen)(`capability`.`[[Promise]]`, `onFulfilled`, `onRejected`).
9.  Perform ! `module`.ExecuteModule(`capability`).
10. Return unused.

###### 16.2.1.6.1.3.3 GatherAvailableAncestors ( `module`, `execList` )

The abstract operation GatherAvailableAncestors takes arguments `module` (a [Cyclic Module Record](#cyclic-module-record)) and `execList` (a [List](#sec-list-and-record-specification-type) of [Cyclic Module Records](#cyclic-module-record)) and returns unused. It performs the following steps when called:

1.  For each [Cyclic Module Record](#cyclic-module-record) `m` of `module`.`[[AsyncParentModules]]`, do
    1.  If `execList` does not contain `m` and `m`.`[[CycleRoot]]`.`[[EvaluationError]]` is empty, then
        1.  [Assert](#assert): `m`.`[[Status]]` is evaluating-async.
        2.  [Assert](#assert): `m`.`[[EvaluationError]]` is empty.
        3.  [Assert](#assert): `m`.`[[AsyncEvaluationOrder]]` is an [integer](#integer).
        4.  [Assert](#assert): `m`.`[[PendingAsyncDependencies]]` \> 0.
        5.  Set `m`.`[[PendingAsyncDependencies]]` to `m`.`[[PendingAsyncDependencies]]` - 1.
        6.  If `m`.`[[PendingAsyncDependencies]]` = 0, then
            1.  Append `m` to `execList`.
            2.  If `m`.`[[HasTLA]]` is false, perform [GatherAvailableAncestors](#sec-gather-available-ancestors)(`m`, `execList`).
2.  Return unused.

Note

When an asynchronous execution for a root `module` is fulfilled, this function determines the list of modules which are able to synchronously execute together on this completion, populating them in `execList`.

###### 16.2.1.6.1.3.4 AsyncModuleExecutionFulfilled ( `module` )

The abstract operation AsyncModuleExecutionFulfilled takes argument `module` (a [Cyclic Module Record](#cyclic-module-record)) and returns unused. It performs the following steps when called:

1.  If `module`.`[[Status]]` is evaluated, then
    1.  [Assert](#assert): `module`.`[[EvaluationError]]` is not empty.
    2.  Return unused.
2.  [Assert](#assert): `module`.`[[Status]]` is evaluating-async.
3.  [Assert](#assert): `module`.`[[AsyncEvaluationOrder]]` is an [integer](#integer).
4.  [Assert](#assert): `module`.`[[EvaluationError]]` is empty.
5.  Set `module`.`[[AsyncEvaluationOrder]]` to done.
6.  Set `module`.`[[Status]]` to evaluated.
7.  If `module`.`[[TopLevelCapability]]` is not empty, then
    1.  [Assert](#assert): `module`.`[[CycleRoot]]` and `module` are the same [Module Record](#sec-abstract-module-records).
    2.  Perform ! [Call](#sec-call)(`module`.`[[TopLevelCapability]]`.`[[Resolve]]`, undefined, « undefined »).
8.  Let `execList` be a new empty [List](#sec-list-and-record-specification-type).
9.  Perform [GatherAvailableAncestors](#sec-gather-available-ancestors)(`module`, `execList`).
10. [Assert](#assert): All elements of `execList` have their `[[AsyncEvaluationOrder]]` field set to an [integer](#integer), `[[PendingAsyncDependencies]]` field set to 0, and `[[EvaluationError]]` field set to empty.
11. Let `sortedExecList` be a [List](#sec-list-and-record-specification-type) whose elements are the elements of `execList`, sorted by their `[[AsyncEvaluationOrder]]` field in ascending order.
12. For each [Cyclic Module Record](#cyclic-module-record) `m` of `sortedExecList`, do
    1.  If `m`.`[[Status]]` is evaluated, then
        1.  [Assert](#assert): `m`.`[[EvaluationError]]` is not empty.
    2.  Else if `m`.`[[HasTLA]]` is true, then
        1.  Perform [ExecuteAsyncModule](#sec-execute-async-module)(`m`).
    3.  Else,
        1.  Let `result` be `m`.ExecuteModule().
        2.  If `result` is an [abrupt completion](#sec-completion-record-specification-type), then
            1.  Perform [AsyncModuleExecutionRejected](#sec-async-module-execution-rejected)(`m`, `result`.`[[Value]]`).
        3.  Else,
            1.  Set `m`.`[[AsyncEvaluationOrder]]` to done.
            2.  Set `m`.`[[Status]]` to evaluated.
            3.  If `m`.`[[TopLevelCapability]]` is not empty, then
                1.  [Assert](#assert): `m`.`[[CycleRoot]]` and `m` are the same [Module Record](#sec-abstract-module-records).
                2.  Perform ! [Call](#sec-call)(`m`.`[[TopLevelCapability]]`.`[[Resolve]]`, undefined, « undefined »).
13. Return unused.

###### 16.2.1.6.1.3.5 AsyncModuleExecutionRejected ( `module`, `error` )

The abstract operation AsyncModuleExecutionRejected takes arguments `module` (a [Cyclic Module Record](#cyclic-module-record)) and `error` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns unused. It performs the following steps when called:

1.  If `module`.`[[Status]]` is evaluated, then
    1.  [Assert](#assert): `module`.`[[EvaluationError]]` is not empty.
    2.  Return unused.
2.  [Assert](#assert): `module`.`[[Status]]` is evaluating-async.
3.  [Assert](#assert): `module`.`[[AsyncEvaluationOrder]]` is an [integer](#integer).
4.  [Assert](#assert): `module`.`[[EvaluationError]]` is empty.
5.  Set `module`.`[[EvaluationError]]` to [ThrowCompletion](#sec-throwcompletion)(`error`).
6.  Set `module`.`[[Status]]` to evaluated.
7.  Set `module`.`[[AsyncEvaluationOrder]]` to done.
8.  NOTE: `module`.`[[AsyncEvaluationOrder]]` is set to done for symmetry with [AsyncModuleExecutionFulfilled](#sec-async-module-execution-fulfilled). In [InnerModuleEvaluation](#sec-innermoduleevaluation), the value of a module's `[[AsyncEvaluationOrder]]` internal slot is unused when its `[[EvaluationError]]` internal slot is not empty.
9.  For each [Cyclic Module Record](#cyclic-module-record) `m` of `module`.`[[AsyncParentModules]]`, do
    1.  Perform [AsyncModuleExecutionRejected](#sec-async-module-execution-rejected)(`m`, `error`).
10. If `module`.`[[TopLevelCapability]]` is not empty, then
    1.  [Assert](#assert): `module`.`[[CycleRoot]]` and `module` are the same [Module Record](#sec-abstract-module-records).
    2.  Perform ! [Call](#sec-call)(`module`.`[[TopLevelCapability]]`.`[[Reject]]`, undefined, « `error` »).
11. Return unused.

##### 16.2.1.6.2 Example Cyclic Module Record Graphs

This non-normative section gives a series of examples of the linking and evaluation of a few common module graphs, with a specific focus on how errors can occur.

First consider the following simple module graph:

![A module graph in which module A depends on module B, and module B depends on module C](img/module-graph-simple.svg)

Figure 2: A simple module graph

Let's first assume that there are no error conditions. When a [host](#host) first calls `A`.LoadRequestedModules(), this will complete successfully by assumption, and recursively load the dependencies of `B` and `C` as well (respectively, `C` and none), and then set `A`.`[[Status]]` = `B`.`[[Status]]` = `C`.`[[Status]]` = unlinked. Then, when the [host](#host) calls `A`.Link(), it will complete successfully (again by assumption) such that `A`.`[[Status]]` = `B`.`[[Status]]` = `C`.`[[Status]]` = linked. These preparatory steps can be performed at any time. Later, when the [host](#host) is ready to incur any possible side effects of the modules, it can call `A`.Evaluate(), which will complete successfully, returning a Promise resolving to undefined (again by assumption), recursively having evaluated first `C` and then `B`. Each module's `[[Status]]` at this point will be evaluated.

Consider then cases involving linking errors, after a successful call to `A`.LoadRequestedModules(). If [InnerModuleLinking](#sec-InnerModuleLinking) of `C` succeeds but, thereafter, fails for `B`, for example because it imports something that `C` does not provide, then the original `A`.Link() will fail, and both `A` and `B`'s `[[Status]]` remain unlinked. `C`'s `[[Status]]` has become linked, though.

Finally, consider a case involving evaluation errors after a successful call to Link(). If [InnerModuleEvaluation](#sec-innermoduleevaluation) of `C` succeeds but, thereafter, fails for `B`, for example because `B` contains code that throws an exception, then the original `A`.Evaluate() will fail, returning a rejected Promise. The resulting exception will be recorded in both `A` and `B`'s `[[EvaluationError]]` fields, and their `[[Status]]` will become evaluated. `C` will also become evaluated but, in contrast to `A` and `B`, will remain without an `[[EvaluationError]]`, as it successfully completed evaluation. Storing the exception ensures that any time a [host](#host) tries to reuse `A` or `B` by calling their Evaluate() method, it will encounter the same exception. ([Hosts](#host) are not required to reuse [Cyclic Module Records](#cyclic-module-record); similarly, [hosts](#host) are not required to expose the exception objects thrown by these methods. However, the specification enables such uses.)

Now consider a different type of error condition:

![A module graph in which module A depends on a missing (unresolvable) module, represented by ???](img/module-graph-missing.svg)

Figure 3: A module graph with an unresolvable module

In this scenario, module `A` declares a dependency on some other module, but no [Module Record](#sec-abstract-module-records) exists for that module, i.e. [HostLoadImportedModule](#sec-HostLoadImportedModule) calls [FinishLoadingImportedModule](#sec-FinishLoadingImportedModule) with an exception when asked for it. This could occur for a variety of reasons, such as the corresponding resource not existing, or the resource existing but [ParseModule](#sec-parsemodule) returning some errors when trying to parse the resulting source text. [Hosts](#host) can choose to expose the cause of failure via the completion they pass to [FinishLoadingImportedModule](#sec-FinishLoadingImportedModule). In any case, this exception causes a loading failure, which results in `A`'s `[[Status]]` remaining new.

The difference here between loading, linking and evaluation errors is due to the following characteristic:

- [Evaluation](#sec-evaluation) must be only performed once, as it can cause side effects; it is thus important to remember whether evaluation has already been performed, even if unsuccessfully. (In the error case, it makes sense to also remember the exception because otherwise subsequent Evaluate() calls would have to synthesize a new one.)
- Linking, on the other hand, is side-effect-free, and thus even if it fails, it can be retried at a later time with no issues.
- Loading closely interacts with the [host](#host), and it may be desirable for some of them to allow users to retry failed loads (for example, if the failure is caused by temporarily bad network conditions).

Now, consider a module graph with a cycle:

![A module graph in which module A depends on module B and C, but module B also depends on module A](img/module-graph-cycle.svg)

Figure 4: A cyclic module graph

Here we assume that the entry point is module `A`, so that the [host](#host) proceeds by calling `A`.LoadRequestedModules(), which performs [InnerModuleLoading](#sec-InnerModuleLoading) on `A`. This in turn calls [InnerModuleLoading](#sec-InnerModuleLoading) on `B` and `C`. Because of the cycle, this again triggers [InnerModuleLoading](#sec-InnerModuleLoading) on `A`, but at this point it is a no-op since `A`'s dependencies loading has already been triggered during this LoadRequestedModules process. When all the modules in the graph have been successfully loaded, their `[[Status]]` transitions from new to unlinked at the same time.

Then the [host](#host) proceeds by calling `A`.Link(), which performs [InnerModuleLinking](#sec-InnerModuleLinking) on `A`. This in turn calls [InnerModuleLinking](#sec-InnerModuleLinking) on `B`. Because of the cycle, this again triggers [InnerModuleLinking](#sec-InnerModuleLinking) on `A`, but at this point it is a no-op since `A`.`[[Status]]` is already linking. `B`.`[[Status]]` itself remains linking when control gets back to `A` and [InnerModuleLinking](#sec-InnerModuleLinking) is triggered on `C`. After this returns with `C`.`[[Status]]` being linked, both `A` and `B` transition from linking to linked together; this is by design, since they form a strongly connected component. It's possible to transition the status of modules in the same SCC at the same time because during this phase the module graph is traversed with a depth-first search.

An analogous story occurs for the evaluation phase of a cyclic module graph, in the success case.

Now consider a case where `A` has a linking error; for example, it tries to import a binding from `C` that does not exist. In that case, the above steps still occur, including the early return from the second call to [InnerModuleLinking](#sec-InnerModuleLinking) on `A`. However, once we unwind back to the original [InnerModuleLinking](#sec-InnerModuleLinking) on `A`, it fails during InitializeEnvironment, namely right after `C`.ResolveExport(). The thrown SyntaxError exception propagates up to `A`.Link, which resets all modules that are currently on its `stack` (these are always exactly the modules that are still linking). Hence both `A` and `B` become unlinked. Note that `C` is left as linked.

Alternatively, consider a case where `A` has an evaluation error; for example, its source code throws an exception. In that case, the evaluation-time analogue of the above steps still occurs, including the early return from the second call to [InnerModuleEvaluation](#sec-innermoduleevaluation) on `A`. However, once we unwind back to the original [InnerModuleEvaluation](#sec-innermoduleevaluation) on `A`, it fails by assumption. The exception thrown propagates up to `A`.Evaluate(), which records the error in all modules that are currently on its `stack` (i.e., the modules that are still evaluating) as well as via `[[AsyncParentModules]]`, which form a chain for modules which contain or depend on top-level `await` through the whole dependency graph through the [AsyncModuleExecutionRejected](#sec-async-module-execution-rejected) algorithm. Hence both `A` and `B` become evaluated and the exception is recorded in both `A` and `B`'s `[[EvaluationError]]` fields, while `C` is left as evaluated with no `[[EvaluationError]]`.

Lastly, consider a module graph with a cycle, where all modules complete asynchronously:

![A module graph in which module A depends on module B and C, module B depends on module D, module C depends on module D and E, and module D depends on module A](img/module-graph-cycle-async.svg)

Figure 5: An asynchronous cyclic module graph

Loading and linking happen as before, and all modules end up with `[[Status]]` set to linked.

Calling `A`.Evaluate() calls [InnerModuleEvaluation](#sec-innermoduleevaluation) on `A`, `B`, and `D`, which all transition to evaluating. Then [InnerModuleEvaluation](#sec-innermoduleevaluation) is called on `A` again, which is a no-op because it is already evaluating. At this point, `D`.`[[PendingAsyncDependencies]]` is 0, so [ExecuteAsyncModule](#sec-execute-async-module)(`D`) is called and we call `D`.ExecuteModule with a new PromiseCapability tracking the asynchronous execution of `D`. We unwind back to the [InnerModuleEvaluation](#sec-innermoduleevaluation) on `B`, setting `B`.`[[PendingAsyncDependencies]]` to 1 and `B`.`[[AsyncEvaluationOrder]]` to 1. We unwind back to the original [InnerModuleEvaluation](#sec-innermoduleevaluation) on `A`, setting `A`.`[[PendingAsyncDependencies]]` to 1. In the next iteration of the loop over `A`'s dependencies, we call [InnerModuleEvaluation](#sec-innermoduleevaluation) on `C` and thus on `D` (again a no-op) and `E`. As `E` has no dependencies and is not part of a cycle, we call [ExecuteAsyncModule](#sec-execute-async-module)(`E`) in the same manner as `D` and `E` is immediately removed from the stack. We unwind once more to the [InnerModuleEvaluation](#sec-innermoduleevaluation) on `C`, setting `C`.`[[AsyncEvaluationOrder]]` to 3. Now we finish the loop over `A`'s dependencies, set `A`.`[[AsyncEvaluationOrder]]` to 4, and remove the entire strongly connected component from the stack, transitioning all of the modules to evaluating-async at once. At this point, the fields of the modules are as given in [Table 48](#table-module-graph-cycle-async-fields-1).

[TABLE]

Table 48: Module fields after the initial Evaluate() call

Let us assume that `E` finishes executing first. When that happens, [AsyncModuleExecutionFulfilled](#sec-async-module-execution-fulfilled) is called, `E`.`[[Status]]` is set to evaluated and `C`.`[[PendingAsyncDependencies]]` is decremented to become 1. The fields of the updated modules are as given in [Table 49](#table-module-graph-cycle-async-fields-2).

[TABLE]

Table 49: Module fields after module `E` finishes executing

`D` is next to finish (as it was the only module that was still executing). When that happens, [AsyncModuleExecutionFulfilled](#sec-async-module-execution-fulfilled) is called again and `D`.`[[Status]]` is set to evaluated. Its ancestors available for execution are `B` (whose `[[AsyncEvaluationOrder]]` is 1) and `C` (whose `[[AsyncEvaluationOrder]]` is 3), thus `B` will be handled first: `B`.`[[PendingAsyncDependencies]]` is decremented to become 0, [ExecuteAsyncModule](#sec-execute-async-module) is called on `B`, and it starts executing. `C`.`[[PendingAsyncDependencies]]` is also decremented to become 0, and `C` starts executing (potentially in parallel to `B` if `B` contains an `await`). The fields of the updated modules are as given in [Table 50](#table-module-graph-cycle-async-fields-3).

[TABLE]

Table 50: Module fields after module `D` finishes executing

Let us assume that `C` finishes executing next. When that happens, [AsyncModuleExecutionFulfilled](#sec-async-module-execution-fulfilled) is called again, `C`.`[[Status]]` is set to evaluated and `A`.`[[PendingAsyncDependencies]]` is decremented to become 1. The fields of the updated modules are as given in [Table 51](#table-module-graph-cycle-async-fields-4).

[TABLE]

Table 51: Module fields after module `C` finishes executing

Then, `B` finishes executing. When that happens, [AsyncModuleExecutionFulfilled](#sec-async-module-execution-fulfilled) is called again and `B`.`[[Status]]` is set to evaluated. `A`.`[[PendingAsyncDependencies]]` is decremented to become 0, so [ExecuteAsyncModule](#sec-execute-async-module) is called and it starts executing. The fields of the updated modules are as given in [Table 52](#table-module-graph-cycle-async-fields-5).

[TABLE]

Table 52: Module fields after module `B` finishes executing

Finally, `A` finishes executing. When that happens, [AsyncModuleExecutionFulfilled](#sec-async-module-execution-fulfilled) is called again and `A`.`[[Status]]` is set to evaluated. At this point, the Promise in `A`.`[[TopLevelCapability]]` (which was returned from `A`.Evaluate()) is resolved, and this concludes the handling of this module graph. The fields of the updated module are as given in [Table 53](#table-module-graph-cycle-async-fields-6).

[TABLE]

Table 53: Module fields after module `A` finishes executing

Alternatively, consider a failure case where `C` fails execution and returns an error before `B` has finished executing. When that happens, [AsyncModuleExecutionRejected](#sec-async-module-execution-rejected) is called, which sets `C`.`[[Status]]` to evaluated and `C`.`[[EvaluationError]]` to the error. It then propagates this error to all of the AsyncParentModules by performing [AsyncModuleExecutionRejected](#sec-async-module-execution-rejected) on each of them. The fields of the updated modules are as given in [Table 54](#table-module-graph-cycle-async-fields-7).

[TABLE]

Table 54: Module fields after module `C` finishes with an error

`A` will be rejected with the same error as `C` since `C` will call [AsyncModuleExecutionRejected](#sec-async-module-execution-rejected) on `A` with `C`'s error. `A`.`[[Status]]` is set to evaluated. At this point the Promise in `A`.`[[TopLevelCapability]]` (which was returned from `A`.Evaluate()) is rejected. The fields of the updated module are as given in [Table 55](#table-module-graph-cycle-async-fields-8).

[TABLE]

Table 55: Module fields after module `A` is rejected

Then, `B` finishes executing without an error. When that happens, [AsyncModuleExecutionFulfilled](#sec-async-module-execution-fulfilled) is called again and `B`.`[[Status]]` is set to evaluated. [GatherAvailableAncestors](#sec-gather-available-ancestors) is called on `B`. However, `A`.`[[CycleRoot]]` is `A` which has an evaluation error, so it will not be added to the returned `sortedExecList` and [AsyncModuleExecutionFulfilled](#sec-async-module-execution-fulfilled) will return without further processing. Any future importer of `B` will resolve the rejection of `B`.`[[CycleRoot]]`.`[[EvaluationError]]` from the evaluation error from `C` that was set on the cycle root `A`. The fields of the updated modules are as given in [Table 56](#table-module-graph-cycle-async-fields-9).

[TABLE]

Table 56: Module fields after module `B` finishes executing in an erroring graph

#### 16.2.1.7 Source Text Module Records

A Source Text Module Record is used to represent information about a module that was defined from [ECMAScript source text](#sec-source-text) ([11](#sec-ecmascript-language-source-code)) that was parsed using the [goal symbol](#sec-context-free-grammars) [Module](#prod-Module). Its fields contain digested information about the names that are imported and exported by the module, and its concrete methods use these digests to link and evaluate the module.

A [Source Text Module Record](#sourctextmodule-record) can exist in a module graph with other subclasses of the abstract [Module Record](#sec-abstract-module-records) type, and can participate in cycles with other subclasses of the [Cyclic Module Record](#cyclic-module-record) type.

In addition to the fields defined in [Table 45](#table-cyclic-module-fields), [Source Text Module Records](#sourctextmodule-record) have the additional fields listed in [Table 57](#table-additional-fields-of-source-text-module-records). Each of these fields is initially set in [ParseModule](#sec-parsemodule).

| Field Name | Value Type | Meaning |
|----|----|----|
| `[[ECMAScriptCode]]` | a [Parse Node](#sec-syntactic-grammar) | The result of parsing the source text of this module using [Module](#prod-Module) as the [goal symbol](#sec-context-free-grammars). |
| `[[Context]]` | an [ECMAScript code execution context](#ecmascript-code-execution-context) or empty | The [execution context](#sec-execution-contexts) associated with this module. It is empty until the module's environment has been initialized. |
| `[[ImportMeta]]` | an Object or empty | An object exposed through the `import.meta` meta property. It is empty until it is accessed by ECMAScript code. |
| `[[ImportEntries]]` | a [List](#sec-list-and-record-specification-type) of [ImportEntry Records](#importentry-record) | A [List](#sec-list-and-record-specification-type) of ImportEntry records derived from the code of this module. |
| `[[LocalExportEntries]]` | a [List](#sec-list-and-record-specification-type) of [ExportEntry Records](#exportentry-record) | A [List](#sec-list-and-record-specification-type) of ExportEntry records derived from the code of this module that correspond to declarations that occur within the module. |
| `[[IndirectExportEntries]]` | a [List](#sec-list-and-record-specification-type) of [ExportEntry Records](#exportentry-record) | A [List](#sec-list-and-record-specification-type) of ExportEntry records derived from the code of this module that correspond to reexported imports that occur within the module or exports from `export * as namespace` declarations. |
| `[[StarExportEntries]]` | a [List](#sec-list-and-record-specification-type) of [ExportEntry Records](#exportentry-record) | A [List](#sec-list-and-record-specification-type) of ExportEntry records derived from the code of this module that correspond to `export *` declarations that occur within the module, not including `export * as namespace` declarations. |

Table 57: Additional Fields of [Source Text Module Records](#sourctextmodule-record)

An ImportEntry Record is a [Record](#sec-list-and-record-specification-type) that digests information about a single declarative import. Each [ImportEntry Record](#importentry-record) has the fields defined in [Table 58](#table-importentry-record-fields):

| Field Name | Value Type | Meaning |
|----|----|----|
| `[[ModuleRequest]]` | a [ModuleRequest Record](#modulerequest-record) | [ModuleRequest Record](#modulerequest-record) representing the [ModuleSpecifier](#prod-ModuleSpecifier) and import attributes of the [ImportDeclaration](#prod-ImportDeclaration). |
| `[[ImportName]]` | a String or namespace-object | The name under which the desired binding is exported by the module identified by `[[ModuleRequest]]`. The value namespace-object indicates that the import request is for the target module's namespace object. |
| `[[LocalName]]` | a String | The name that is used to locally access the imported value from within the importing module. |

Table 58: [ImportEntry Record](#importentry-record) Fields

Note 1

[Table 59](#table-import-forms-mapping-to-importentry-records) gives examples of ImportEntry records fields used to represent the syntactic import forms:

[TABLE]

Table 59 (Informative): Import Forms Mappings to [ImportEntry Records](#importentry-record)

An ExportEntry Record is a [Record](#sec-list-and-record-specification-type) that digests information about a single declarative export. Each [ExportEntry Record](#exportentry-record) has the fields defined in [Table 60](#table-exportentry-records):

| Field Name | Value Type | Meaning |
|----|----|----|
| `[[ExportName]]` | a String or null | The name used to export this binding by this module. |
| `[[ModuleRequest]]` | a [ModuleRequest Record](#modulerequest-record) or null | The [ModuleRequest Record](#modulerequest-record) representing the [ModuleSpecifier](#prod-ModuleSpecifier) and import attributes of the [ExportDeclaration](#prod-ExportDeclaration). null if the [ExportDeclaration](#prod-ExportDeclaration) does not have a [ModuleSpecifier](#prod-ModuleSpecifier). |
| `[[ImportName]]` | a String, null, all, or all-but-default | The name under which the desired binding is exported by the module identified by `[[ModuleRequest]]`. null if the [ExportDeclaration](#prod-ExportDeclaration) does not have a [ModuleSpecifier](#prod-ModuleSpecifier). all is used for `export * as ns from "mod"` declarations. all-but-default is used for `export * from "mod"` declarations. |
| `[[LocalName]]` | a String or null | The name that is used to locally access the exported value from within the importing module. null if the exported value is not locally accessible from within the module. |

Table 60: [ExportEntry Record](#exportentry-record) Fields

Note 2

[Table 61](#table-export-forms-mapping-to-exportentry-records) gives examples of the ExportEntry record fields used to represent the syntactic export forms:

| Export Statement Form | `[[ExportName]]` | `[[ModuleRequest]]` | `[[ImportName]]` | `[[LocalName]]` |
|----|----|----|----|----|
| `export var v;` | "v" | null | null | "v" |
| `export default function f() {}` | "default" | null | null | "f" |
| `export default function () {}` | "default" | null | null | "\*default\*" |
| `export default 42;` | "default" | null | null | "\*default\*" |
| `export {x};` | "x" | null | null | "x" |
| `export {v as x};` | "x" | null | null | "v" |
| `export {x} from "mod";` | "x" | "mod" | "x" | null |
| `export {v as x} from "mod";` | "x" | "mod" | "v" | null |
| `export * from "mod";` | null | "mod" | all-but-default | null |
| `export * as ns from "mod";` | "ns" | "mod" | all | null |

Table 61 (Informative): Export Forms Mappings to [ExportEntry Records](#exportentry-record)

The following definitions specify the required concrete methods and other [abstract operations](#sec-algorithm-conventions-abstract-operations) for [Source Text Module Records](#sourctextmodule-record)

##### 16.2.1.7.1 ParseModule ( `sourceText`, `realm`, `hostDefined` )

The abstract operation ParseModule takes arguments `sourceText` ([ECMAScript source text](#sec-source-text)), `realm` (a [Realm Record](#realm-record)), and `hostDefined` (anything) and returns a [Source Text Module Record](#sourctextmodule-record) or a non-empty [List](#sec-list-and-record-specification-type) of SyntaxError objects. It creates a [Source Text Module Record](#sourctextmodule-record) based upon the result of parsing `sourceText` as a [Module](#prod-Module). It performs the following steps when called:

1.  Let `body` be [ParseText](#sec-parsetext)(`sourceText`, [Module](#prod-Module)).
2.  If `body` is a [List](#sec-list-and-record-specification-type) of errors, return `body`.
3.  Let `requestedModules` be the [ModuleRequests](#sec-static-semantics-modulerequests) of `body`.
4.  Let `importEntries` be the [ImportEntries](#sec-static-semantics-importentries) of `body`.
5.  Let `importedBoundNames` be [ImportedLocalNames](#sec-importedlocalnames)(`importEntries`).
6.  Let `indirectExportEntries` be a new empty [List](#sec-list-and-record-specification-type).
7.  Let `localExportEntries` be a new empty [List](#sec-list-and-record-specification-type).
8.  Let `starExportEntries` be a new empty [List](#sec-list-and-record-specification-type).
9.  Let `exportEntries` be the [ExportEntries](#sec-static-semantics-exportentries) of `body`.
10. For each [ExportEntry Record](#exportentry-record) `ee` of `exportEntries`, do
    1.  If `ee`.`[[ModuleRequest]]` is null, then
        1.  If `importedBoundNames` does not contain `ee`.`[[LocalName]]`, then
            1.  Append `ee` to `localExportEntries`.
        2.  Else,
            1.  Let `ie` be the element of `importEntries` whose `[[LocalName]]` is `ee`.`[[LocalName]]`.
            2.  If `ie`.`[[ImportName]]` is namespace-object, then
                1.  NOTE: This is a re-export of an imported module namespace object.
                2.  Append `ee` to `localExportEntries`.
            3.  Else,
                1.  NOTE: This is a re-export of a single name.
                2.  Append the [ExportEntry Record](#exportentry-record) { `[[ModuleRequest]]`: `ie`.`[[ModuleRequest]]`, `[[ImportName]]`: `ie`.`[[ImportName]]`, `[[LocalName]]`: null, `[[ExportName]]`: `ee`.`[[ExportName]]` } to `indirectExportEntries`.
    2.  Else if `ee`.`[[ImportName]]` is all-but-default, then
        1.  [Assert](#assert): `ee`.`[[ExportName]]` is null.
        2.  Append `ee` to `starExportEntries`.
    3.  Else,
        1.  Append `ee` to `indirectExportEntries`.
11. Let `async` be `body` [Contains](#sec-static-semantics-contains) `await`.
12. Return [Source Text Module Record](#sourctextmodule-record) { `[[Realm]]`: `realm`, `[[Environment]]`: empty, `[[Namespace]]`: empty, `[[CycleRoot]]`: empty, `[[HasTLA]]`: `async`, `[[AsyncEvaluationOrder]]`: unset, `[[TopLevelCapability]]`: empty, `[[AsyncParentModules]]`: « », `[[PendingAsyncDependencies]]`: empty, `[[Status]]`: new, `[[EvaluationError]]`: empty, `[[HostDefined]]`: `hostDefined`, `[[ECMAScriptCode]]`: `body`, `[[Context]]`: empty, `[[ImportMeta]]`: empty, `[[RequestedModules]]`: `requestedModules`, `[[LoadedModules]]`: « », `[[ImportEntries]]`: `importEntries`, `[[LocalExportEntries]]`: `localExportEntries`, `[[IndirectExportEntries]]`: `indirectExportEntries`, `[[StarExportEntries]]`: `starExportEntries`, `[[DFSIndex]]`: empty, `[[DFSAncestorIndex]]`: empty }.

Note

An implementation may parse module source text and analyse it for Early Error conditions prior to the evaluation of ParseModule for that module source text. However, the reporting of any errors must be deferred until the point where this specification actually performs ParseModule upon that source text.

##### 16.2.1.7.2 Implementation of Module Record Abstract Methods

The following are the concrete methods for [Source Text Module Record](#sourctextmodule-record) that implement the corresponding [Module Record](#sec-abstract-module-records) abstract methods defined in [Table 44](#table-abstract-methods-of-module-records).

###### 16.2.1.7.2.1 GetExportedNames ( \[ `exportStarSet` \] )

The GetExportedNames concrete method of a [Source Text Module Record](#sourctextmodule-record) `module` takes optional argument `exportStarSet` (a [List](#sec-list-and-record-specification-type) of [Source Text Module Records](#sourctextmodule-record)) and returns a [List](#sec-list-and-record-specification-type) of Strings. It performs the following steps when called:

1.  [Assert](#assert): `module`.`[[Status]]` is not new.
2.  If `exportStarSet` is not present, set `exportStarSet` to a new empty [List](#sec-list-and-record-specification-type).
3.  If `exportStarSet` contains `module`, then
    1.  [Assert](#assert): We've reached the starting point of an `export *` circularity.
    2.  Return a new empty [List](#sec-list-and-record-specification-type).
4.  Append `module` to `exportStarSet`.
5.  Let `exportedNames` be a new empty [List](#sec-list-and-record-specification-type).
6.  For each [ExportEntry Record](#exportentry-record) `e` of `module`.`[[LocalExportEntries]]`, do
    1.  [Assert](#assert): `module` provides the direct binding for this export.
    2.  [Assert](#assert): `e`.`[[ExportName]]` is not null.
    3.  Append `e`.`[[ExportName]]` to `exportedNames`.
7.  For each [ExportEntry Record](#exportentry-record) `e` of `module`.`[[IndirectExportEntries]]`, do
    1.  [Assert](#assert): `module` imports a specific binding for this export.
    2.  [Assert](#assert): `e`.`[[ExportName]]` is not null.
    3.  Append `e`.`[[ExportName]]` to `exportedNames`.
8.  For each [ExportEntry Record](#exportentry-record) `e` of `module`.`[[StarExportEntries]]`, do
    1.  [Assert](#assert): `e`.`[[ModuleRequest]]` is not null.
    2.  Let `requestedModule` be [GetImportedModule](#sec-GetImportedModule)(`module`, `e`.`[[ModuleRequest]]`).
    3.  Let `starNames` be `requestedModule`.GetExportedNames(`exportStarSet`).
    4.  For each element `n` of `starNames`, do
        1.  If `n` is not "default", then
            1.  If `exportedNames` does not contain `n`, then
                1.  Append `n` to `exportedNames`.
9.  Return `exportedNames`.

Note

GetExportedNames does not filter out or throw an exception for names that have ambiguous star export bindings.

###### 16.2.1.7.2.2 ResolveExport ( `exportName` \[ , `resolveSet` \] )

The ResolveExport concrete method of a [Source Text Module Record](#sourctextmodule-record) `module` takes argument `exportName` (a String) and optional argument `resolveSet` (a [List](#sec-list-and-record-specification-type) of [Records](#sec-list-and-record-specification-type) with fields `[[Module]]` (a [Module Record](#sec-abstract-module-records)) and `[[ExportName]]` (a String)) and returns a [ResolvedBinding Record](#resolvedbinding-record), null, or ambiguous.

ResolveExport attempts to resolve an imported binding to the actual defining module and local binding name. The defining module may be the module represented by the [Module Record](#sec-abstract-module-records) this method was invoked on or some other module that is imported by that module. The parameter `resolveSet` is used to detect unresolved circular import/export paths. If a pair consisting of specific [Module Record](#sec-abstract-module-records) and `exportName` is reached that is already in `resolveSet`, an import circularity has been encountered. Before recursively calling ResolveExport, a pair consisting of `module` and `exportName` is added to `resolveSet`.

If a defining module is found, a [ResolvedBinding Record](#resolvedbinding-record) { `[[Module]]`, `[[BindingName]]` } is returned. This record identifies the resolved binding of the originally requested export, unless this is the export of a namespace with no local binding. In this case, `[[BindingName]]` will be set to namespace. If no definition was found or the request is found to be circular, null is returned. If the request is found to be ambiguous, ambiguous is returned.

It performs the following steps when called:

1.  [Assert](#assert): `module`.`[[Status]]` is not new.
2.  If `resolveSet` is not present, set `resolveSet` to a new empty [List](#sec-list-and-record-specification-type).
3.  For each [Record](#sec-list-and-record-specification-type) { `[[Module]]`, `[[ExportName]]` } `r` of `resolveSet`, do
    1.  If `module` and `r`.`[[Module]]` are the same [Module Record](#sec-abstract-module-records) and `exportName` is `r`.`[[ExportName]]`, then
        1.  [Assert](#assert): This is a circular import request.
        2.  Return null.
4.  Append the [Record](#sec-list-and-record-specification-type) { `[[Module]]`: `module`, `[[ExportName]]`: `exportName` } to `resolveSet`.
5.  For each [ExportEntry Record](#exportentry-record) `e` of `module`.`[[LocalExportEntries]]`, do
    1.  If `e`.`[[ExportName]]` is `exportName`, then
        1.  [Assert](#assert): `module` provides the direct binding for this export.
        2.  Return [ResolvedBinding Record](#resolvedbinding-record) { `[[Module]]`: `module`, `[[BindingName]]`: `e`.`[[LocalName]]` }.
6.  For each [ExportEntry Record](#exportentry-record) `e` of `module`.`[[IndirectExportEntries]]`, do
    1.  If `e`.`[[ExportName]]` is `exportName`, then
        1.  [Assert](#assert): `e`.`[[ModuleRequest]]` is not null.
        2.  Let `importedModule` be [GetImportedModule](#sec-GetImportedModule)(`module`, `e`.`[[ModuleRequest]]`).
        3.  If `e`.`[[ImportName]]` is all, then
            1.  [Assert](#assert): `module` does not provide the direct binding for this export.
            2.  Return [ResolvedBinding Record](#resolvedbinding-record) { `[[Module]]`: `importedModule`, `[[BindingName]]`: namespace }.
        4.  Else,
            1.  [Assert](#assert): `module` imports a specific binding for this export.
            2.  [Assert](#assert): `e`.`[[ImportName]]` [is a String](#sec-ecmascript-language-types-string-type).
            3.  Return `importedModule`.ResolveExport(`e`.`[[ImportName]]`, `resolveSet`).
7.  If `exportName` is "default", then
    1.  [Assert](#assert): A `default` export was not explicitly defined by this module.
    2.  Return null.
    3.  NOTE: A `default` export cannot be provided by an `export * from "mod"` declaration.
8.  Let `starResolution` be null.
9.  For each [ExportEntry Record](#exportentry-record) `e` of `module`.`[[StarExportEntries]]`, do
    1.  [Assert](#assert): `e`.`[[ModuleRequest]]` is not null.
    2.  Let `importedModule` be [GetImportedModule](#sec-GetImportedModule)(`module`, `e`.`[[ModuleRequest]]`).
    3.  Let `resolution` be `importedModule`.ResolveExport(`exportName`, `resolveSet`).
    4.  If `resolution` is ambiguous, return ambiguous.
    5.  If `resolution` is not null, then
        1.  [Assert](#assert): `resolution` is a [ResolvedBinding Record](#resolvedbinding-record).
        2.  If `starResolution` is null, then
            1.  Set `starResolution` to `resolution`.
        3.  Else,
            1.  [Assert](#assert): There is more than one `*` import that includes the requested name.
            2.  If `resolution`.`[[Module]]` and `starResolution`.`[[Module]]` are not the same [Module Record](#sec-abstract-module-records), return ambiguous.
            3.  If `resolution`.`[[BindingName]]` is not `starResolution`.`[[BindingName]]` and either `resolution`.`[[BindingName]]` or `starResolution`.`[[BindingName]]` is namespace, return ambiguous.
            4.  If `resolution`.`[[BindingName]]` [is a String](#sec-ecmascript-language-types-string-type), `starResolution`.`[[BindingName]]` [is a String](#sec-ecmascript-language-types-string-type), and `resolution`.`[[BindingName]]` is not `starResolution`.`[[BindingName]]`, return ambiguous.
10. Return `starResolution`.

##### 16.2.1.7.3 Implementation of Cyclic Module Record Abstract Methods

The following are the concrete methods for [Source Text Module Record](#sourctextmodule-record) that implement the corresponding [Cyclic Module Record](#cyclic-module-record) abstract methods defined in [Table 46](#table-cyclic-module-methods).

###### 16.2.1.7.3.1 InitializeEnvironment ( )

The InitializeEnvironment concrete method of a [Source Text Module Record](#sourctextmodule-record) `module` takes no arguments and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  For each [ExportEntry Record](#exportentry-record) `e` of `module`.`[[IndirectExportEntries]]`, do
    1.  [Assert](#assert): `e`.`[[ExportName]]` is not null.
    2.  Let `resolution` be `module`.ResolveExport(`e`.`[[ExportName]]`).
    3.  If `resolution` is either null or ambiguous, throw a SyntaxError exception.
    4.  [Assert](#assert): `resolution` is a [ResolvedBinding Record](#resolvedbinding-record).
2.  [Assert](#assert): All named exports from `module` are resolvable.
3.  Let `realm` be `module`.`[[Realm]]`.
4.  [Assert](#assert): `realm` is not undefined.
5.  Let `env` be [NewModuleEnvironment](#sec-newmoduleenvironment)(`realm`.`[[GlobalEnv]]`).
6.  Set `module`.`[[Environment]]` to `env`.
7.  For each [ImportEntry Record](#importentry-record) `in` of `module`.`[[ImportEntries]]`, do
    1.  Let `importedModule` be [GetImportedModule](#sec-GetImportedModule)(`module`, `in`.`[[ModuleRequest]]`).
    2.  If `in`.`[[ImportName]]` is namespace-object, then
        1.  Let `namespace` be [GetModuleNamespace](#sec-getmodulenamespace)(`importedModule`).
        2.  Perform ! `env`.CreateImmutableBinding(`in`.`[[LocalName]]`, true).
        3.  Perform ! `env`.InitializeBinding(`in`.`[[LocalName]]`, `namespace`).
    3.  Else,
        1.  Let `resolution` be `importedModule`.ResolveExport(`in`.`[[ImportName]]`).
        2.  If `resolution` is either null or ambiguous, throw a SyntaxError exception.
        3.  If `resolution`.`[[BindingName]]` is namespace, then
            1.  Let `namespace` be [GetModuleNamespace](#sec-getmodulenamespace)(`resolution`.`[[Module]]`).
            2.  Perform ! `env`.CreateImmutableBinding(`in`.`[[LocalName]]`, true).
            3.  Perform ! `env`.InitializeBinding(`in`.`[[LocalName]]`, `namespace`).
        4.  Else,
            1.  Perform [CreateImportBinding](#sec-createimportbinding)(`env`, `in`.`[[LocalName]]`, `resolution`.`[[Module]]`, `resolution`.`[[BindingName]]`).
8.  Let `moduleContext` be a new [ECMAScript code execution context](#ecmascript-code-execution-context).
9.  Set the Function of `moduleContext` to null.
10. [Assert](#assert): `module`.`[[Realm]]` is not undefined.
11. Set the [Realm](#realm) of `moduleContext` to `module`.`[[Realm]]`.
12. Set the ScriptOrModule of `moduleContext` to `module`.
13. Set the VariableEnvironment of `moduleContext` to `module`.`[[Environment]]`.
14. Set the LexicalEnvironment of `moduleContext` to `module`.`[[Environment]]`.
15. Set the PrivateEnvironment of `moduleContext` to null.
16. Set `module`.`[[Context]]` to `moduleContext`.
17. Push `moduleContext` onto the [execution context stack](#execution-context-stack); `moduleContext` is now the [running execution context](#running-execution-context).
18. Let `code` be `module`.`[[ECMAScriptCode]]`.
19. Let `varDeclarations` be the [VarScopedDeclarations](#sec-static-semantics-varscopeddeclarations) of `code`.
20. Let `declaredVarNames` be a new empty [List](#sec-list-and-record-specification-type).
21. For each element `d` of `varDeclarations`, do
    1.  For each element `dn` of the [BoundNames](#sec-static-semantics-boundnames) of `d`, do
        1.  If `declaredVarNames` does not contain `dn`, then
            1.  Perform ! `env`.CreateMutableBinding(`dn`, false).
            2.  Perform ! `env`.InitializeBinding(`dn`, undefined).
            3.  Append `dn` to `declaredVarNames`.
22. Let `lexDeclarations` be the [LexicallyScopedDeclarations](#sec-static-semantics-lexicallyscopeddeclarations) of `code`.
23. Let `privateEnv` be null.
24. For each element `d` of `lexDeclarations`, do
    1.  For each element `dn` of the [BoundNames](#sec-static-semantics-boundnames) of `d`, do
        1.  If [IsConstantDeclaration](#sec-static-semantics-isconstantdeclaration) of `d` is true, then
            1.  Perform ! `env`.CreateImmutableBinding(`dn`, true).
        2.  Else,
            1.  Perform ! `env`.CreateMutableBinding(`dn`, false).
        3.  If `d` is either a [FunctionDeclaration](#prod-FunctionDeclaration), a [GeneratorDeclaration](#prod-GeneratorDeclaration), an [AsyncFunctionDeclaration](#prod-AsyncFunctionDeclaration), or an [AsyncGeneratorDeclaration](#prod-AsyncGeneratorDeclaration), then
            1.  Let `fo` be [InstantiateFunctionObject](#sec-runtime-semantics-instantiatefunctionobject) of `d` with arguments `env` and `privateEnv`.
            2.  Perform ! `env`.InitializeBinding(`dn`, `fo`).
25. Remove `moduleContext` from the [execution context stack](#execution-context-stack).
26. Return unused.

###### 16.2.1.7.3.2 ExecuteModule ( \[ `capability` \] )

The ExecuteModule concrete method of a [Source Text Module Record](#sourctextmodule-record) `module` takes optional argument `capability` (a [PromiseCapability Record](#sec-promisecapability-records)) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `moduleContext` be a new [ECMAScript code execution context](#ecmascript-code-execution-context).
2.  Set the Function of `moduleContext` to null.
3.  Set the [Realm](#realm) of `moduleContext` to `module`.`[[Realm]]`.
4.  Set the ScriptOrModule of `moduleContext` to `module`.
5.  [Assert](#assert): `module` has been linked and declarations in its module environment have been instantiated.
6.  Set the VariableEnvironment of `moduleContext` to `module`.`[[Environment]]`.
7.  Set the LexicalEnvironment of `moduleContext` to `module`.`[[Environment]]`.
8.  Suspend the [running execution context](#running-execution-context).
9.  If `module`.`[[HasTLA]]` is false, then
    1.  [Assert](#assert): `capability` is not present.
    2.  Push `moduleContext` onto the [execution context stack](#execution-context-stack); `moduleContext` is now the [running execution context](#running-execution-context).
    3.  Let `result` be [Completion](#sec-completion-ao)([Evaluation](#sec-evaluation) of `module`.`[[ECMAScriptCode]]`).
    4.  Suspend `moduleContext` and remove it from the [execution context stack](#execution-context-stack).
    5.  Resume the context that is now on the top of the [execution context stack](#execution-context-stack) as the [running execution context](#running-execution-context).
    6.  If `result` is an [abrupt completion](#sec-completion-record-specification-type), then
        1.  Return ? `result`.
10. Else,
    1.  [Assert](#assert): `capability` is a [PromiseCapability Record](#sec-promisecapability-records).
    2.  Perform [AsyncBlockStart](#sec-asyncblockstart)(`capability`, `module`.`[[ECMAScriptCode]]`, `moduleContext`).
11. Return unused.

#### 16.2.1.8 Synthetic Module Records

A Synthetic Module Record is used to represent information about a module that is defined by specifications. Its exported names are statically defined at creation, while their corresponding values can change over time using [SetSyntheticModuleExport](#sec-setsyntheticmoduleexport). It has no imports or dependencies.

Note

A Synthetic Module Record could be used for defining a variety of module types: for example, JSON modules or CSS modules.

In addition to the fields defined in [Table 43](#table-module-record-fields) Synthetic Module Records have the additional fields listed in [Table 62](#table-synthetic-module-record-fields).

| Field Name | Value Type | Meaning |
|----|----|----|
| `[[ExportNames]]` | a [List](#sec-list-and-record-specification-type) of Strings | The names of the exports of the module. This list does not contain duplicates. |
| `[[EvaluationSteps]]` | an [Abstract Closure](#sec-abstract-closure) | The initialization logic to perform upon evaluation of the module, taking the [Synthetic Module Record](#sec-synthetic-module-records) as its sole argument. It must not modify `[[ExportNames]]`. It may return an [abrupt completion](#sec-completion-record-specification-type). |

Table 62: Additional Fields of [Synthetic Module Records](#sec-synthetic-module-records)

##### 16.2.1.8.1 CreateDefaultExportSyntheticModule ( `defaultExport` )

The abstract operation CreateDefaultExportSyntheticModule takes argument `defaultExport` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns a [Synthetic Module Record](#sec-synthetic-module-records). It creates a [Synthetic Module Record](#sec-synthetic-module-records) whose default export is `defaultExport`. It performs the following steps when called:

1.  Let `realm` be [the current Realm Record](#current-realm).
2.  Let `setDefaultExport` be a new [Abstract Closure](#sec-abstract-closure) with parameters (`module`) that captures `defaultExport` and performs the following steps when called:
    1.  Perform [SetSyntheticModuleExport](#sec-setsyntheticmoduleexport)(`module`, "default", `defaultExport`).
    2.  Return [NormalCompletion](#sec-normalcompletion)(unused).
3.  Return the [Synthetic Module Record](#sec-synthetic-module-records) { `[[Realm]]`: `realm`, `[[Environment]]`: empty, `[[Namespace]]`: empty, `[[HostDefined]]`: undefined, `[[ExportNames]]`: « "default" », `[[EvaluationSteps]]`: `setDefaultExport` }.

##### 16.2.1.8.2 ParseJSONModule ( `source` )

The abstract operation ParseJSONModule takes argument `source` (a String) and returns either a [normal completion containing](#sec-completion-record-specification-type) a [Synthetic Module Record](#sec-synthetic-module-records), or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `json` be ? [ParseJSON](#sec-ParseJSON)(`source`).
2.  Return [CreateDefaultExportSyntheticModule](#sec-create-default-export-synthetic-module)(`json`).

##### 16.2.1.8.3 SetSyntheticModuleExport ( `module`, `exportName`, `exportValue` )

The abstract operation SetSyntheticModuleExport takes arguments `module` (a [Synthetic Module Record](#sec-synthetic-module-records)), `exportName` (a String), and `exportValue` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns unused. It can be used to set or change the exported value for an existing export of a [Synthetic Module Record](#sec-synthetic-module-records). It performs the following steps when called:

1.  [Assert](#assert): `module`.`[[ExportNames]]` contains `exportName`.
2.  Let `envRec` be `module`.`[[Environment]]`.
3.  [Assert](#assert): `envRec` is not empty.
4.  Perform `envRec`.SetMutableBinding(`exportName`, `exportValue`, true).
5.  Return unused.

##### 16.2.1.8.4 Implementation of Module Record Abstract Methods

The following are the concrete methods for [Synthetic Module Record](#sec-synthetic-module-records) that implement the corresponding [Module Record](#sec-abstract-module-records) abstract methods defined in [Table 44](#table-abstract-methods-of-module-records).

###### 16.2.1.8.4.1 LoadRequestedModules ( )

The LoadRequestedModules concrete method of a [Synthetic Module Record](#sec-synthetic-module-records) `module` takes no arguments and returns a Promise. It performs the following steps when called:

1.  Return ! [PromiseResolve](#sec-promise-resolve)([%Promise%](#sec-promise-constructor), undefined).

Note

[Synthetic Module Records](#sec-synthetic-module-records) have no dependencies.

###### 16.2.1.8.4.2 GetExportedNames ( )

The GetExportedNames concrete method of a [Synthetic Module Record](#sec-synthetic-module-records) `module` takes no arguments and returns a [List](#sec-list-and-record-specification-type) of Strings. It performs the following steps when called:

1.  Return `module`.`[[ExportNames]]`.

###### 16.2.1.8.4.3 ResolveExport ( `exportName` )

The ResolveExport concrete method of a [Synthetic Module Record](#sec-synthetic-module-records) `module` takes argument `exportName` (a String) and returns a [ResolvedBinding Record](#resolvedbinding-record) or null. It performs the following steps when called:

1.  If `module`.`[[ExportNames]]` does not contain `exportName`, return null.
2.  Return [ResolvedBinding Record](#resolvedbinding-record) { `[[Module]]`: `module`, `[[BindingName]]`: `exportName` }.

###### 16.2.1.8.4.4 Link ( )

The Link concrete method of a [Synthetic Module Record](#sec-synthetic-module-records) `module` takes no arguments and returns a [normal completion containing](#sec-completion-record-specification-type) unused. It performs the following steps when called:

1.  Let `realm` be `module`.`[[Realm]]`.
2.  Let `env` be [NewModuleEnvironment](#sec-newmoduleenvironment)(`realm`.`[[GlobalEnv]]`).
3.  Set `module`.`[[Environment]]` to `env`.
4.  For each String `exportName` of `module`.`[[ExportNames]]`, do
    1.  Perform ! `env`.CreateMutableBinding(`exportName`, false).
    2.  Perform ! `env`.InitializeBinding(`exportName`, undefined).
5.  Return [NormalCompletion](#sec-normalcompletion)(unused).

###### 16.2.1.8.4.5 Evaluate ( )

The Evaluate concrete method of a [Synthetic Module Record](#sec-synthetic-module-records) `module` takes no arguments and returns a Promise. It performs the following steps when called:

1.  Let `moduleContext` be a new [ECMAScript code execution context](#ecmascript-code-execution-context).
2.  Set the Function of `moduleContext` to null.
3.  Set the [Realm](#realm) of `moduleContext` to `module`.`[[Realm]]`.
4.  Set the ScriptOrModule of `moduleContext` to `module`.
5.  Set the VariableEnvironment of `moduleContext` to `module`.`[[Environment]]`.
6.  Set the LexicalEnvironment of `moduleContext` to `module`.`[[Environment]]`.
7.  Suspend the [running execution context](#running-execution-context).
8.  Push `moduleContext` onto the [execution context stack](#execution-context-stack); `moduleContext` is now the [running execution context](#running-execution-context).
9.  Let `steps` be `module`.`[[EvaluationSteps]]`.
10. Let `result` be [Completion](#sec-completion-ao)(`steps`(`module`)).
11. Suspend `moduleContext` and remove it from the [execution context stack](#execution-context-stack).
12. Resume the context that is now on the top of the [execution context stack](#execution-context-stack) as the [running execution context](#running-execution-context).
13. Let `pc` be ! [NewPromiseCapability](#sec-newpromisecapability)([%Promise%](#sec-promise-constructor)).
14. [IfAbruptRejectPromise](#sec-ifabruptrejectpromise)(`result`, `pc`).
15. Perform ! [Call](#sec-call)(`pc`.`[[Resolve]]`, undefined, « undefined »).
16. Return `pc`.`[[Promise]]`.

#### 16.2.1.9 GetImportedModule ( `referrer`, `request` )

The abstract operation GetImportedModule takes arguments `referrer` (a [Cyclic Module Record](#cyclic-module-record)) and `request` (a [ModuleRequest Record](#modulerequest-record)) and returns a [Module Record](#sec-abstract-module-records). It performs the following steps when called:

1.  Let `records` be a [List](#sec-list-and-record-specification-type) consisting of each [LoadedModuleRequest Record](#loadedmodulerequest-record) `r` of `referrer`.`[[LoadedModules]]` such that [ModuleRequestsEqual](#sec-ModuleRequestsEqual)(`r`, `request`) is true.
2.  [Assert](#assert): `records` has exactly one element, since LoadRequestedModules has completed successfully on `referrer` prior to invoking this abstract operation.
3.  Let `record` be the sole element of `records`.
4.  Return `record`.`[[Module]]`.

#### 16.2.1.10 HostLoadImportedModule ( `referrer`, `moduleRequest`, `hostDefined`, `payload` )

The [host-defined](#host-defined) abstract operation HostLoadImportedModule takes arguments `referrer` (a [Script Record](#script-record), a [Cyclic Module Record](#cyclic-module-record), or a [Realm Record](#realm-record)), `moduleRequest` (a [ModuleRequest Record](#modulerequest-record)), `hostDefined` (anything), and `payload` (a [GraphLoadingState Record](#graphloadingstate-record) or a [PromiseCapability Record](#sec-promisecapability-records)) and returns unused.

[Note 1](#note-HostLoadImportedModule-referrer-Realm-Record)

An example of when `referrer` can be a [Realm Record](#realm-record) is in a web browser [host](#host). There, if a user clicks on a control given by

``` html
<button type="button" onclick="import('./foo.mjs')">Click me</button>
```

there will be no [active script or module](#job-activescriptormodule) at the time the [`import()`](#sec-import-calls) expression runs. More generally, this can happen in any situation where the [host](#host) pushes [execution contexts](#sec-execution-contexts) with null ScriptOrModule components onto the [execution context stack](#execution-context-stack).

An implementation of HostLoadImportedModule must conform to the following requirements:

- The [host environment](#host-environment) must perform [FinishLoadingImportedModule](#sec-FinishLoadingImportedModule)(`referrer`, `moduleRequest`, `payload`, `result`), where `result` is either a [normal completion containing](#sec-completion-record-specification-type) the loaded [Module Record](#sec-abstract-module-records) or a [throw completion](#sec-completion-record-specification-type), either synchronously or asynchronously.

- If this operation is called multiple times with two (`referrer`, `moduleRequest`) pairs such that:

  - the first `referrer` is the same as the second `referrer`;
  - [ModuleRequestsEqual](#sec-ModuleRequestsEqual)(the first `moduleRequest`, the second `moduleRequest`) is true;

  and it performs [FinishLoadingImportedModule](#sec-FinishLoadingImportedModule)(`referrer`, `moduleRequest`, `payload`, `result`) where `result` is a [normal completion](#sec-completion-record-specification-type), then it must perform [FinishLoadingImportedModule](#sec-FinishLoadingImportedModule)(`referrer`, `moduleRequest`, `payload`, `result`) with the same `result` each time.

- If `moduleRequest`.`[[Attributes]]` has an entry `entry` such that `entry`.`[[Key]]` is "type" and `entry`.`[[Value]]` is "json", when the [host environment](#host-environment) performs [FinishLoadingImportedModule](#sec-FinishLoadingImportedModule)(`referrer`, `moduleRequest`, `payload`, `result`), `result` must either be the [Completion Record](#sec-completion-record-specification-type) returned by an invocation of [ParseJSONModule](#sec-parse-json-module) or a [throw completion](#sec-completion-record-specification-type).

- The operation must treat `payload` as an opaque value to be passed through to [FinishLoadingImportedModule](#sec-FinishLoadingImportedModule).

The actual process performed is [host-defined](#host-defined), but typically consists of performing whatever I/O operations are necessary to load the appropriate [Module Record](#sec-abstract-module-records). Multiple different (`referrer`, `moduleRequest`.`[[Specifier]]`, `moduleRequest`.`[[Attributes]]`) triples may map to the same [Module Record](#sec-abstract-module-records) instance. The actual mapping semantics is [host-defined](#host-defined) but typically a normalization process is applied to `specifier` as part of the mapping process. A typical normalization process would include actions such as expansion of relative and abbreviated path specifiers.

Note 2

The above text requires that [hosts](#host) support JSON modules when imported with `type: "json"` (and HostLoadImportedModule completes normally), but it does not prohibit [hosts](#host) from supporting JSON modules when imported without `type: "json"`.

#### 16.2.1.11 FinishLoadingImportedModule ( `referrer`, `moduleRequest`, `payload`, `result` )

The abstract operation FinishLoadingImportedModule takes arguments `referrer` (a [Script Record](#script-record), a [Cyclic Module Record](#cyclic-module-record), or a [Realm Record](#realm-record)), `moduleRequest` (a [ModuleRequest Record](#modulerequest-record)), `payload` (a [GraphLoadingState Record](#graphloadingstate-record) or a [PromiseCapability Record](#sec-promisecapability-records)), and `result` (either a [normal completion containing](#sec-completion-record-specification-type) a [Module Record](#sec-abstract-module-records) or a [throw completion](#sec-completion-record-specification-type)) and returns unused. It performs the following steps when called:

1.  If `result` is a [normal completion](#sec-completion-record-specification-type), then
    1.  If `referrer`.`[[LoadedModules]]` contains a [LoadedModuleRequest Record](#loadedmodulerequest-record) `record` such that [ModuleRequestsEqual](#sec-ModuleRequestsEqual)(`record`, `moduleRequest`) is true, then
        1.  [Assert](#assert): `record`.`[[Module]]` and `result`.`[[Value]]` are the same [Module Record](#sec-abstract-module-records).
    2.  Else,
        1.  Append the [LoadedModuleRequest Record](#loadedmodulerequest-record) { `[[Specifier]]`: `moduleRequest`.`[[Specifier]]`, `[[Attributes]]`: `moduleRequest`.`[[Attributes]]`, `[[Module]]`: `result`.`[[Value]]` } to `referrer`.`[[LoadedModules]]`.
2.  If `payload` is a [GraphLoadingState Record](#graphloadingstate-record), then
    1.  Perform [ContinueModuleLoading](#sec-ContinueModuleLoading)(`payload`, `result`).
3.  Else,
    1.  Perform [ContinueDynamicImport](#sec-ContinueDynamicImport)(`payload`, `result`).
4.  Return unused.

#### 16.2.1.12 AllImportAttributesSupported ( `attributes` )

The abstract operation AllImportAttributesSupported takes argument `attributes` (a [List](#sec-list-and-record-specification-type) of [ImportAttribute Records](#importattribute-record)) and returns a Boolean. It performs the following steps when called:

1.  Let `supported` be [HostGetSupportedImportAttributes](#sec-hostgetsupportedimportattributes)().
2.  For each [ImportAttribute Record](#importattribute-record) `attribute` of `attributes`, do
    1.  If `supported` does not contain `attribute`.`[[Key]]`, return false.
3.  Return true.

##### 16.2.1.12.1 HostGetSupportedImportAttributes ( )

The [host-defined](#host-defined) abstract operation HostGetSupportedImportAttributes takes no arguments and returns a [List](#sec-list-and-record-specification-type) of Strings. It allows [host environments](#host-environment) to specify which import attributes they support. Only attributes with supported keys will be provided to the [host](#host).

An implementation of HostGetSupportedImportAttributes must conform to the following requrements:

- It must return a [List](#sec-list-and-record-specification-type) of Strings, each indicating a supported attribute.
- Each time this operation is called, it must return the same [List](#sec-list-and-record-specification-type) with the same contents in the same order.

The default implementation of HostGetSupportedImportAttributes is to return a new empty [List](#sec-list-and-record-specification-type).

Note

The purpose of requiring the [host](#host) to specify its supported import attributes, rather than passing all attributes to the [host](#host) and letting it then choose which ones it wants to handle, is to ensure that unsupported attributes are handled in a consistent way across different [hosts](#host).

#### 16.2.1.13 GetModuleNamespace ( `module` )

The abstract operation GetModuleNamespace takes argument `module` (an instance of a concrete subclass of [Module Record](#sec-abstract-module-records)) and returns a Module Namespace Object. It retrieves the Module Namespace Object representing `module`'s exports, lazily creating it the first time it was requested, and storing it in `module`.`[[Namespace]]` for future retrieval. It performs the following steps when called:

1.  [Assert](#assert): If `module` is a [Cyclic Module Record](#cyclic-module-record), then `module`.`[[Status]]` is not new or unlinked.
2.  Let `namespace` be `module`.`[[Namespace]]`.
3.  If `namespace` is empty, then
    1.  Let `exportedNames` be `module`.GetExportedNames().
    2.  Let `unambiguousNames` be a new empty [List](#sec-list-and-record-specification-type).
    3.  For each element `name` of `exportedNames`, do
        1.  Let `resolution` be `module`.ResolveExport(`name`).
        2.  If `resolution` is a [ResolvedBinding Record](#resolvedbinding-record), append `name` to `unambiguousNames`.
    4.  Set `namespace` to [ModuleNamespaceCreate](#sec-modulenamespacecreate)(`module`, `unambiguousNames`).
4.  Return `namespace`.

Note

GetModuleNamespace never throws. Instead, unresolvable names are simply excluded from the namespace at this point. They will lead to a real linking error later unless they are all ambiguous star exports that are not explicitly requested anywhere.

#### 16.2.1.14 Runtime Semantics: Evaluation

[Module](#prod-Module) : \[empty\]

1.  Return undefined.

[ModuleBody](#prod-ModuleBody) : [ModuleItemList](#prod-ModuleItemList)

1.  Let `result` be [Completion](#sec-completion-ao)([Evaluation](#sec-evaluation) of [ModuleItemList](#prod-ModuleItemList)).
2.  If `result` is a [normal completion](#sec-completion-record-specification-type) and `result`.`[[Value]]` is empty, then
    1.  Return undefined.
3.  Return ? `result`.

[ModuleItemList](#prod-ModuleItemList) : [ModuleItemList](#prod-ModuleItemList) [ModuleItem](#prod-ModuleItem)

1.  Let `sl` be ? [Evaluation](#sec-evaluation) of [ModuleItemList](#prod-ModuleItemList).
2.  Let `s` be [Completion](#sec-completion-ao)([Evaluation](#sec-evaluation) of [ModuleItem](#prod-ModuleItem)).
3.  Return ? [UpdateEmpty](#sec-updateempty)(`s`, `sl`).

Note

The value of a [ModuleItemList](#prod-ModuleItemList) is the value of the last value-producing item in the [ModuleItemList](#prod-ModuleItemList).

[ModuleItem](#prod-ModuleItem) : [ImportDeclaration](#prod-ImportDeclaration)

1.  Return empty.

### 16.2.2 Imports

#### Syntax

[ImportDeclaration](#prod-ImportDeclaration) : import [ImportClause](#prod-ImportClause) [FromClause](#prod-FromClause) [WithClause](#prod-WithClause)opt ; import [ModuleSpecifier](#prod-ModuleSpecifier) [WithClause](#prod-WithClause)opt ; [ImportClause](#prod-ImportClause) : [ImportedDefaultBinding](#prod-ImportedDefaultBinding) [NameSpaceImport](#prod-NameSpaceImport) [NamedImports](#prod-NamedImports) [ImportedDefaultBinding](#prod-ImportedDefaultBinding) , [NameSpaceImport](#prod-NameSpaceImport) [ImportedDefaultBinding](#prod-ImportedDefaultBinding) , [NamedImports](#prod-NamedImports) [ImportedDefaultBinding](#prod-ImportedDefaultBinding) : [ImportedBinding](#prod-ImportedBinding) [NameSpaceImport](#prod-NameSpaceImport) : \* as [ImportedBinding](#prod-ImportedBinding) [NamedImports](#prod-NamedImports) : { } { [ImportsList](#prod-ImportsList) } { [ImportsList](#prod-ImportsList) , } [FromClause](#prod-FromClause) : from [ModuleSpecifier](#prod-ModuleSpecifier) [ImportsList](#prod-ImportsList) : [ImportSpecifier](#prod-ImportSpecifier) [ImportsList](#prod-ImportsList) , [ImportSpecifier](#prod-ImportSpecifier) [ImportSpecifier](#prod-ImportSpecifier) : [ImportedBinding](#prod-ImportedBinding) [ModuleExportName](#prod-ModuleExportName) as [ImportedBinding](#prod-ImportedBinding) [ModuleSpecifier](#prod-ModuleSpecifier) : [StringLiteral](#prod-StringLiteral) [ImportedBinding](#prod-ImportedBinding) : [BindingIdentifier](#prod-BindingIdentifier)\[~Yield, +Await\] [WithClause](#prod-WithClause) : with { } with { [WithEntries](#prod-WithEntries) ,opt } [WithEntries](#prod-WithEntries) : [AttributeKey](#prod-AttributeKey) : [StringLiteral](#prod-StringLiteral) [AttributeKey](#prod-AttributeKey) : [StringLiteral](#prod-StringLiteral) , [WithEntries](#prod-WithEntries) [AttributeKey](#prod-AttributeKey) : [IdentifierName](#prod-IdentifierName) [StringLiteral](#prod-StringLiteral)

#### 16.2.2.1 Static Semantics: Early Errors

[ModuleItem](#prod-ModuleItem) : [ImportDeclaration](#prod-ImportDeclaration)

- It is a Syntax Error if the [BoundNames](#sec-static-semantics-boundnames) of [ImportDeclaration](#prod-ImportDeclaration) contains any duplicate entries.

[WithClause](#prod-WithClause) : with { [WithEntries](#prod-WithEntries) ,opt }

- It is a Syntax Error if [WithClauseToAttributes](#sec-withclausetoattributes) of [WithClause](#prod-WithClause) has two different entries `a` and `b` such that `a`.`[[Key]]` is `b`.`[[Key]]`.

#### 16.2.2.2 Static Semantics: ImportEntries

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) ImportEntries takes no arguments and returns a [List](#sec-list-and-record-specification-type) of [ImportEntry Records](#importentry-record). It is defined piecewise over the following productions:

[Module](#prod-Module) : \[empty\]

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[ModuleItemList](#prod-ModuleItemList) : [ModuleItemList](#prod-ModuleItemList) [ModuleItem](#prod-ModuleItem)

1.  Let `entries1` be the [ImportEntries](#sec-static-semantics-importentries) of [ModuleItemList](#prod-ModuleItemList).
2.  Let `entries2` be the [ImportEntries](#sec-static-semantics-importentries) of [ModuleItem](#prod-ModuleItem).
3.  Return the [list-concatenation](#list-concatenation) of `entries1` and `entries2`.

[ModuleItem](#prod-ModuleItem) : [ExportDeclaration](#prod-ExportDeclaration) [StatementListItem](#prod-StatementListItem)

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[ImportDeclaration](#prod-ImportDeclaration) : import [ImportClause](#prod-ImportClause) [FromClause](#prod-FromClause) [WithClause](#prod-WithClause)opt ;

1.  Let `module` be the sole element of the [ModuleRequests](#sec-static-semantics-modulerequests) of [ImportDeclaration](#prod-ImportDeclaration).
2.  Return the [ImportEntriesForModule](#sec-static-semantics-importentriesformodule) of [ImportClause](#prod-ImportClause) with argument `module`.

[ImportDeclaration](#prod-ImportDeclaration) : import [ModuleSpecifier](#prod-ModuleSpecifier) [WithClause](#prod-WithClause)opt ;

1.  Return a new empty [List](#sec-list-and-record-specification-type).

#### 16.2.2.3 Static Semantics: ImportEntriesForModule

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) ImportEntriesForModule takes argument `module` (a [ModuleRequest Record](#modulerequest-record)) and returns a [List](#sec-list-and-record-specification-type) of [ImportEntry Records](#importentry-record). It is defined piecewise over the following productions:

[ImportClause](#prod-ImportClause) : [ImportedDefaultBinding](#prod-ImportedDefaultBinding) , [NameSpaceImport](#prod-NameSpaceImport)

1.  Let `entries1` be the [ImportEntriesForModule](#sec-static-semantics-importentriesformodule) of [ImportedDefaultBinding](#prod-ImportedDefaultBinding) with argument `module`.
2.  Let `entries2` be the [ImportEntriesForModule](#sec-static-semantics-importentriesformodule) of [NameSpaceImport](#prod-NameSpaceImport) with argument `module`.
3.  Return the [list-concatenation](#list-concatenation) of `entries1` and `entries2`.

[ImportClause](#prod-ImportClause) : [ImportedDefaultBinding](#prod-ImportedDefaultBinding) , [NamedImports](#prod-NamedImports)

1.  Let `entries1` be the [ImportEntriesForModule](#sec-static-semantics-importentriesformodule) of [ImportedDefaultBinding](#prod-ImportedDefaultBinding) with argument `module`.
2.  Let `entries2` be the [ImportEntriesForModule](#sec-static-semantics-importentriesformodule) of [NamedImports](#prod-NamedImports) with argument `module`.
3.  Return the [list-concatenation](#list-concatenation) of `entries1` and `entries2`.

[ImportedDefaultBinding](#prod-ImportedDefaultBinding) : [ImportedBinding](#prod-ImportedBinding)

1.  Let `localName` be the sole element of the [BoundNames](#sec-static-semantics-boundnames) of [ImportedBinding](#prod-ImportedBinding).
2.  Let `defaultEntry` be the [ImportEntry Record](#importentry-record) { `[[ModuleRequest]]`: `module`, `[[ImportName]]`: "default", `[[LocalName]]`: `localName` }.
3.  Return « `defaultEntry` ».

[NameSpaceImport](#prod-NameSpaceImport) : \* as [ImportedBinding](#prod-ImportedBinding)

1.  Let `localName` be the [StringValue](#sec-static-semantics-stringvalue) of [ImportedBinding](#prod-ImportedBinding).
2.  Let `entry` be the [ImportEntry Record](#importentry-record) { `[[ModuleRequest]]`: `module`, `[[ImportName]]`: namespace-object, `[[LocalName]]`: `localName` }.
3.  Return « `entry` ».

[NamedImports](#prod-NamedImports) : { }

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[ImportsList](#prod-ImportsList) : [ImportsList](#prod-ImportsList) , [ImportSpecifier](#prod-ImportSpecifier)

1.  Let `specs1` be the [ImportEntriesForModule](#sec-static-semantics-importentriesformodule) of [ImportsList](#prod-ImportsList) with argument `module`.
2.  Let `specs2` be the [ImportEntriesForModule](#sec-static-semantics-importentriesformodule) of [ImportSpecifier](#prod-ImportSpecifier) with argument `module`.
3.  Return the [list-concatenation](#list-concatenation) of `specs1` and `specs2`.

[ImportSpecifier](#prod-ImportSpecifier) : [ImportedBinding](#prod-ImportedBinding)

1.  Let `localName` be the sole element of the [BoundNames](#sec-static-semantics-boundnames) of [ImportedBinding](#prod-ImportedBinding).
2.  Let `entry` be the [ImportEntry Record](#importentry-record) { `[[ModuleRequest]]`: `module`, `[[ImportName]]`: `localName`, `[[LocalName]]`: `localName` }.
3.  Return « `entry` ».

[ImportSpecifier](#prod-ImportSpecifier) : [ModuleExportName](#prod-ModuleExportName) as [ImportedBinding](#prod-ImportedBinding)

1.  Let `importName` be the [StringValue](#sec-static-semantics-stringvalue) of [ModuleExportName](#prod-ModuleExportName).
2.  Let `localName` be the [StringValue](#sec-static-semantics-stringvalue) of [ImportedBinding](#prod-ImportedBinding).
3.  Let `entry` be the [ImportEntry Record](#importentry-record) { `[[ModuleRequest]]`: `module`, `[[ImportName]]`: `importName`, `[[LocalName]]`: `localName` }.
4.  Return « `entry` ».

#### 16.2.2.4 Static Semantics: WithClauseToAttributes

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) WithClauseToAttributes takes no arguments and returns a [List](#sec-list-and-record-specification-type) of [ImportAttribute Records](#importattribute-record). It is defined piecewise over the following productions:

[WithClause](#prod-WithClause) : with { }

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[WithClause](#prod-WithClause) : with { [WithEntries](#prod-WithEntries) ,opt }

1.  Let `attributes` be [WithClauseToAttributes](#sec-withclausetoattributes) of [WithEntries](#prod-WithEntries).
2.  Sort `attributes` according to the lexicographic order of their `[[Key]]` field, treating the value of each such field as a sequence of UTF-16 code unit values. NOTE: This sorting is observable only in that [hosts](#host) are prohibited from changing behaviour based on the order in which attributes are enumerated.
3.  Return `attributes`.

[WithEntries](#prod-WithEntries) : [AttributeKey](#prod-AttributeKey) : [StringLiteral](#prod-StringLiteral)

1.  Let `key` be the [PropName](#sec-static-semantics-propname) of [AttributeKey](#prod-AttributeKey).
2.  Let `entry` be the [ImportAttribute Record](#importattribute-record) { `[[Key]]`: `key`, `[[Value]]`: the [SV](#sec-static-semantics-sv) of [StringLiteral](#prod-StringLiteral) }.
3.  Return « `entry` ».

[WithEntries](#prod-WithEntries) : [AttributeKey](#prod-AttributeKey) : [StringLiteral](#prod-StringLiteral) , [WithEntries](#prod-WithEntries)

1.  Let `key` be the [PropName](#sec-static-semantics-propname) of [AttributeKey](#prod-AttributeKey).
2.  Let `entry` be the [ImportAttribute Record](#importattribute-record) { `[[Key]]`: `key`, `[[Value]]`: the [SV](#sec-static-semantics-sv) of [StringLiteral](#prod-StringLiteral) }.
3.  Let `rest` be [WithClauseToAttributes](#sec-withclausetoattributes) of [WithEntries](#prod-WithEntries).
4.  Return the [list-concatenation](#list-concatenation) of « `entry` » and `rest`.

### 16.2.3 Exports

#### Syntax

[ExportDeclaration](#prod-ExportDeclaration) : export [ExportFromClause](#prod-ExportFromClause) [FromClause](#prod-FromClause) [WithClause](#prod-WithClause)opt ; export [NamedExports](#prod-NamedExports) ; export [VariableStatement](#prod-VariableStatement)\[~Yield, +Await\] export [Declaration](#prod-Declaration)\[~Yield, +Await\] export default [HoistableDeclaration](#prod-HoistableDeclaration)\[~Yield, +Await, +Default\] export default [ClassDeclaration](#prod-ClassDeclaration)\[~Yield, +Await, +Default\] export default \[lookahead ∉ { function, async \[no [LineTerminator](#prod-LineTerminator) here\] function, class }\] [AssignmentExpression](#prod-AssignmentExpression)\[+In, ~Yield, +Await\] ; [ExportFromClause](#prod-ExportFromClause) : \* \* as [ModuleExportName](#prod-ModuleExportName) [NamedExports](#prod-NamedExports) [NamedExports](#prod-NamedExports) : { } { [ExportsList](#prod-ExportsList) } { [ExportsList](#prod-ExportsList) , } [ExportsList](#prod-ExportsList) : [ExportSpecifier](#prod-ExportSpecifier) [ExportsList](#prod-ExportsList) , [ExportSpecifier](#prod-ExportSpecifier) [ExportSpecifier](#prod-ExportSpecifier) : [ModuleExportName](#prod-ModuleExportName) [ModuleExportName](#prod-ModuleExportName) as [ModuleExportName](#prod-ModuleExportName)

#### 16.2.3.1 Static Semantics: Early Errors

[ExportDeclaration](#prod-ExportDeclaration) : export [NamedExports](#prod-NamedExports) ;

- It is a Syntax Error if the [ReferencedBindings](#sec-static-semantics-referencedbindings) of [NamedExports](#prod-NamedExports) contains any [StringLiteral](#prod-StringLiteral)s.
- For each [IdentifierName](#prod-IdentifierName) `n` in the [ReferencedBindings](#sec-static-semantics-referencedbindings) of [NamedExports](#prod-NamedExports): It is a Syntax Error if the [StringValue](#sec-static-semantics-stringvalue) of `n` is a [ReservedWord](#prod-ReservedWord) or the [StringValue](#sec-static-semantics-stringvalue) of `n` is one of "implements", "interface", "let", "package", "private", "protected", "public", or "static".

Note

The above rule means that each [ReferencedBindings](#sec-static-semantics-referencedbindings) of [NamedExports](#prod-NamedExports) is treated as an [IdentifierReference](#prod-IdentifierReference).

#### 16.2.3.2 Static Semantics: ExportedBindings

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) ExportedBindings takes no arguments and returns a [List](#sec-list-and-record-specification-type) of Strings.

Note

ExportedBindings are the locally bound names that are explicitly associated with a [Module](#prod-Module)'s [ExportedNames](#sec-static-semantics-exportednames).

It is defined piecewise over the following productions:

[ModuleItemList](#prod-ModuleItemList) : [ModuleItemList](#prod-ModuleItemList) [ModuleItem](#prod-ModuleItem)

1.  Let `names1` be the [ExportedBindings](#sec-static-semantics-exportedbindings) of [ModuleItemList](#prod-ModuleItemList).
2.  Let `names2` be the [ExportedBindings](#sec-static-semantics-exportedbindings) of [ModuleItem](#prod-ModuleItem).
3.  Return the [list-concatenation](#list-concatenation) of `names1` and `names2`.

[ModuleItem](#prod-ModuleItem) : [ImportDeclaration](#prod-ImportDeclaration) [StatementListItem](#prod-StatementListItem)

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[ExportDeclaration](#prod-ExportDeclaration) : export [ExportFromClause](#prod-ExportFromClause) [FromClause](#prod-FromClause) [WithClause](#prod-WithClause)opt ;

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[ExportDeclaration](#prod-ExportDeclaration) : export [NamedExports](#prod-NamedExports) ;

1.  Return the [ExportedBindings](#sec-static-semantics-exportedbindings) of [NamedExports](#prod-NamedExports).

[ExportDeclaration](#prod-ExportDeclaration) : export [VariableStatement](#prod-VariableStatement)

1.  Return the [BoundNames](#sec-static-semantics-boundnames) of [VariableStatement](#prod-VariableStatement).

[ExportDeclaration](#prod-ExportDeclaration) : export [Declaration](#prod-Declaration)

1.  Return the [BoundNames](#sec-static-semantics-boundnames) of [Declaration](#prod-Declaration).

[ExportDeclaration](#prod-ExportDeclaration) : export default [HoistableDeclaration](#prod-HoistableDeclaration) export default [ClassDeclaration](#prod-ClassDeclaration) export default [AssignmentExpression](#prod-AssignmentExpression) ;

1.  Return the [BoundNames](#sec-static-semantics-boundnames) of this [ExportDeclaration](#prod-ExportDeclaration).

[NamedExports](#prod-NamedExports) : { }

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[ExportsList](#prod-ExportsList) : [ExportsList](#prod-ExportsList) , [ExportSpecifier](#prod-ExportSpecifier)

1.  Let `names1` be the [ExportedBindings](#sec-static-semantics-exportedbindings) of [ExportsList](#prod-ExportsList).
2.  Let `names2` be the [ExportedBindings](#sec-static-semantics-exportedbindings) of [ExportSpecifier](#prod-ExportSpecifier).
3.  Return the [list-concatenation](#list-concatenation) of `names1` and `names2`.

[ExportSpecifier](#prod-ExportSpecifier) : [ModuleExportName](#prod-ModuleExportName)

1.  Return a [List](#sec-list-and-record-specification-type) whose sole element is the [StringValue](#sec-static-semantics-stringvalue) of [ModuleExportName](#prod-ModuleExportName).

[ExportSpecifier](#prod-ExportSpecifier) : [ModuleExportName](#prod-ModuleExportName) as [ModuleExportName](#prod-ModuleExportName)

1.  Return a [List](#sec-list-and-record-specification-type) whose sole element is the [StringValue](#sec-static-semantics-stringvalue) of the first [ModuleExportName](#prod-ModuleExportName).

#### 16.2.3.3 Static Semantics: ExportedNames

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) ExportedNames takes no arguments and returns a [List](#sec-list-and-record-specification-type) of Strings.

Note

ExportedNames are the externally visible names that a [Module](#prod-Module) explicitly maps to one of its local name bindings.

It is defined piecewise over the following productions:

[ModuleItemList](#prod-ModuleItemList) : [ModuleItemList](#prod-ModuleItemList) [ModuleItem](#prod-ModuleItem)

1.  Let `names1` be the [ExportedNames](#sec-static-semantics-exportednames) of [ModuleItemList](#prod-ModuleItemList).
2.  Let `names2` be the [ExportedNames](#sec-static-semantics-exportednames) of [ModuleItem](#prod-ModuleItem).
3.  Return the [list-concatenation](#list-concatenation) of `names1` and `names2`.

[ModuleItem](#prod-ModuleItem) : [ExportDeclaration](#prod-ExportDeclaration)

1.  Return the [ExportedNames](#sec-static-semantics-exportednames) of [ExportDeclaration](#prod-ExportDeclaration).

[ModuleItem](#prod-ModuleItem) : [ImportDeclaration](#prod-ImportDeclaration) [StatementListItem](#prod-StatementListItem)

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[ExportDeclaration](#prod-ExportDeclaration) : export [ExportFromClause](#prod-ExportFromClause) [FromClause](#prod-FromClause) [WithClause](#prod-WithClause)opt ;

1.  Return the [ExportedNames](#sec-static-semantics-exportednames) of [ExportFromClause](#prod-ExportFromClause).

[ExportFromClause](#prod-ExportFromClause) : \*

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[ExportFromClause](#prod-ExportFromClause) : \* as [ModuleExportName](#prod-ModuleExportName)

1.  Return a [List](#sec-list-and-record-specification-type) whose sole element is the [StringValue](#sec-static-semantics-stringvalue) of [ModuleExportName](#prod-ModuleExportName).

[ExportFromClause](#prod-ExportFromClause) : [NamedExports](#prod-NamedExports)

1.  Return the [ExportedNames](#sec-static-semantics-exportednames) of [NamedExports](#prod-NamedExports).

[ExportDeclaration](#prod-ExportDeclaration) : export [VariableStatement](#prod-VariableStatement)

1.  Return the [BoundNames](#sec-static-semantics-boundnames) of [VariableStatement](#prod-VariableStatement).

[ExportDeclaration](#prod-ExportDeclaration) : export [Declaration](#prod-Declaration)

1.  Return the [BoundNames](#sec-static-semantics-boundnames) of [Declaration](#prod-Declaration).

[ExportDeclaration](#prod-ExportDeclaration) : export default [HoistableDeclaration](#prod-HoistableDeclaration) export default [ClassDeclaration](#prod-ClassDeclaration) export default [AssignmentExpression](#prod-AssignmentExpression) ;

1.  Return « "default" ».

[NamedExports](#prod-NamedExports) : { }

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[ExportsList](#prod-ExportsList) : [ExportsList](#prod-ExportsList) , [ExportSpecifier](#prod-ExportSpecifier)

1.  Let `names1` be the [ExportedNames](#sec-static-semantics-exportednames) of [ExportsList](#prod-ExportsList).
2.  Let `names2` be the [ExportedNames](#sec-static-semantics-exportednames) of [ExportSpecifier](#prod-ExportSpecifier).
3.  Return the [list-concatenation](#list-concatenation) of `names1` and `names2`.

[ExportSpecifier](#prod-ExportSpecifier) : [ModuleExportName](#prod-ModuleExportName)

1.  Return a [List](#sec-list-and-record-specification-type) whose sole element is the [StringValue](#sec-static-semantics-stringvalue) of [ModuleExportName](#prod-ModuleExportName).

[ExportSpecifier](#prod-ExportSpecifier) : [ModuleExportName](#prod-ModuleExportName) as [ModuleExportName](#prod-ModuleExportName)

1.  Return a [List](#sec-list-and-record-specification-type) whose sole element is the [StringValue](#sec-static-semantics-stringvalue) of the second [ModuleExportName](#prod-ModuleExportName).

#### 16.2.3.4 Static Semantics: ExportEntries

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) ExportEntries takes no arguments and returns a [List](#sec-list-and-record-specification-type) of [ExportEntry Records](#exportentry-record). It is defined piecewise over the following productions:

[Module](#prod-Module) : \[empty\]

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[ModuleItemList](#prod-ModuleItemList) : [ModuleItemList](#prod-ModuleItemList) [ModuleItem](#prod-ModuleItem)

1.  Let `entries1` be the [ExportEntries](#sec-static-semantics-exportentries) of [ModuleItemList](#prod-ModuleItemList).
2.  Let `entries2` be the [ExportEntries](#sec-static-semantics-exportentries) of [ModuleItem](#prod-ModuleItem).
3.  Return the [list-concatenation](#list-concatenation) of `entries1` and `entries2`.

[ModuleItem](#prod-ModuleItem) : [ImportDeclaration](#prod-ImportDeclaration) [StatementListItem](#prod-StatementListItem)

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[ExportDeclaration](#prod-ExportDeclaration) : export [ExportFromClause](#prod-ExportFromClause) [FromClause](#prod-FromClause) [WithClause](#prod-WithClause)opt ;

1.  Let `module` be the sole element of the [ModuleRequests](#sec-static-semantics-modulerequests) of [ExportDeclaration](#prod-ExportDeclaration).
2.  Return the [ExportEntriesForModule](#sec-static-semantics-exportentriesformodule) of [ExportFromClause](#prod-ExportFromClause) with argument `module`.

[ExportDeclaration](#prod-ExportDeclaration) : export [NamedExports](#prod-NamedExports) ;

1.  Return the [ExportEntriesForModule](#sec-static-semantics-exportentriesformodule) of [NamedExports](#prod-NamedExports) with argument null.

[ExportDeclaration](#prod-ExportDeclaration) : export [VariableStatement](#prod-VariableStatement)

1.  Let `entries` be a new empty [List](#sec-list-and-record-specification-type).
2.  Let `names` be the [BoundNames](#sec-static-semantics-boundnames) of [VariableStatement](#prod-VariableStatement).
3.  For each element `name` of `names`, do
    1.  Append the [ExportEntry Record](#exportentry-record) { `[[ModuleRequest]]`: null, `[[ImportName]]`: null, `[[LocalName]]`: `name`, `[[ExportName]]`: `name` } to `entries`.
4.  Return `entries`.

[ExportDeclaration](#prod-ExportDeclaration) : export [Declaration](#prod-Declaration)

1.  Let `entries` be a new empty [List](#sec-list-and-record-specification-type).
2.  Let `names` be the [BoundNames](#sec-static-semantics-boundnames) of [Declaration](#prod-Declaration).
3.  For each element `name` of `names`, do
    1.  Append the [ExportEntry Record](#exportentry-record) { `[[ModuleRequest]]`: null, `[[ImportName]]`: null, `[[LocalName]]`: `name`, `[[ExportName]]`: `name` } to `entries`.
4.  Return `entries`.

[ExportDeclaration](#prod-ExportDeclaration) : export default [HoistableDeclaration](#prod-HoistableDeclaration)

1.  Let `names` be the [BoundNames](#sec-static-semantics-boundnames) of [HoistableDeclaration](#prod-HoistableDeclaration).
2.  Let `localName` be the sole element of `names`.
3.  Return a [List](#sec-list-and-record-specification-type) whose sole element is a new [ExportEntry Record](#exportentry-record) { `[[ModuleRequest]]`: null, `[[ImportName]]`: null, `[[LocalName]]`: `localName`, `[[ExportName]]`: "default" }.

[ExportDeclaration](#prod-ExportDeclaration) : export default [ClassDeclaration](#prod-ClassDeclaration)

1.  Let `names` be the [BoundNames](#sec-static-semantics-boundnames) of [ClassDeclaration](#prod-ClassDeclaration).
2.  Let `localName` be the sole element of `names`.
3.  Return a [List](#sec-list-and-record-specification-type) whose sole element is a new [ExportEntry Record](#exportentry-record) { `[[ModuleRequest]]`: null, `[[ImportName]]`: null, `[[LocalName]]`: `localName`, `[[ExportName]]`: "default" }.

[ExportDeclaration](#prod-ExportDeclaration) : export default [AssignmentExpression](#prod-AssignmentExpression) ;

1.  Let `entry` be the [ExportEntry Record](#exportentry-record) { `[[ModuleRequest]]`: null, `[[ImportName]]`: null, `[[LocalName]]`: "\*default\*", `[[ExportName]]`: "default" }.
2.  Return « `entry` ».

Note

"\*default\*" is used within this specification as a synthetic name for anonymous default export values. See [this note](#note-star-default-star) for more details.

#### 16.2.3.5 Static Semantics: ExportEntriesForModule

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) ExportEntriesForModule takes argument `module` (a [ModuleRequest Record](#modulerequest-record) or null) and returns a [List](#sec-list-and-record-specification-type) of [ExportEntry Records](#exportentry-record). It is defined piecewise over the following productions:

[ExportFromClause](#prod-ExportFromClause) : \*

1.  Let `entry` be the [ExportEntry Record](#exportentry-record) { `[[ModuleRequest]]`: `module`, `[[ImportName]]`: all-but-default, `[[LocalName]]`: null, `[[ExportName]]`: null }.
2.  Return « `entry` ».

[ExportFromClause](#prod-ExportFromClause) : \* as [ModuleExportName](#prod-ModuleExportName)

1.  Let `exportName` be the [StringValue](#sec-static-semantics-stringvalue) of [ModuleExportName](#prod-ModuleExportName).
2.  Let `entry` be the [ExportEntry Record](#exportentry-record) { `[[ModuleRequest]]`: `module`, `[[ImportName]]`: all, `[[LocalName]]`: null, `[[ExportName]]`: `exportName` }.
3.  Return « `entry` ».

[NamedExports](#prod-NamedExports) : { }

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[ExportsList](#prod-ExportsList) : [ExportsList](#prod-ExportsList) , [ExportSpecifier](#prod-ExportSpecifier)

1.  Let `specs1` be the [ExportEntriesForModule](#sec-static-semantics-exportentriesformodule) of [ExportsList](#prod-ExportsList) with argument `module`.
2.  Let `specs2` be the [ExportEntriesForModule](#sec-static-semantics-exportentriesformodule) of [ExportSpecifier](#prod-ExportSpecifier) with argument `module`.
3.  Return the [list-concatenation](#list-concatenation) of `specs1` and `specs2`.

[ExportSpecifier](#prod-ExportSpecifier) : [ModuleExportName](#prod-ModuleExportName)

1.  Let `sourceName` be the [StringValue](#sec-static-semantics-stringvalue) of [ModuleExportName](#prod-ModuleExportName).
2.  If `module` is null, then
    1.  Let `localName` be `sourceName`.
    2.  Let `importName` be null.
3.  Else,
    1.  Let `localName` be null.
    2.  Let `importName` be `sourceName`.
4.  Return a [List](#sec-list-and-record-specification-type) whose sole element is a new [ExportEntry Record](#exportentry-record) { `[[ModuleRequest]]`: `module`, `[[ImportName]]`: `importName`, `[[LocalName]]`: `localName`, `[[ExportName]]`: `sourceName` }.

[ExportSpecifier](#prod-ExportSpecifier) : [ModuleExportName](#prod-ModuleExportName) as [ModuleExportName](#prod-ModuleExportName)

1.  Let `sourceName` be the [StringValue](#sec-static-semantics-stringvalue) of the first [ModuleExportName](#prod-ModuleExportName).
2.  Let `exportName` be the [StringValue](#sec-static-semantics-stringvalue) of the second [ModuleExportName](#prod-ModuleExportName).
3.  If `module` is null, then
    1.  Let `localName` be `sourceName`.
    2.  Let `importName` be null.
4.  Else,
    1.  Let `localName` be null.
    2.  Let `importName` be `sourceName`.
5.  Return a [List](#sec-list-and-record-specification-type) whose sole element is a new [ExportEntry Record](#exportentry-record) { `[[ModuleRequest]]`: `module`, `[[ImportName]]`: `importName`, `[[LocalName]]`: `localName`, `[[ExportName]]`: `exportName` }.

#### 16.2.3.6 Static Semantics: ReferencedBindings

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) ReferencedBindings takes no arguments and returns a [List](#sec-list-and-record-specification-type) of [Parse Nodes](#sec-syntactic-grammar). It is defined piecewise over the following productions:

[NamedExports](#prod-NamedExports) : { }

1.  Return a new empty [List](#sec-list-and-record-specification-type).

[ExportsList](#prod-ExportsList) : [ExportsList](#prod-ExportsList) , [ExportSpecifier](#prod-ExportSpecifier)

1.  Let `names1` be the [ReferencedBindings](#sec-static-semantics-referencedbindings) of [ExportsList](#prod-ExportsList).
2.  Let `names2` be the [ReferencedBindings](#sec-static-semantics-referencedbindings) of [ExportSpecifier](#prod-ExportSpecifier).
3.  Return the [list-concatenation](#list-concatenation) of `names1` and `names2`.

[ExportSpecifier](#prod-ExportSpecifier) : [ModuleExportName](#prod-ModuleExportName) as [ModuleExportName](#prod-ModuleExportName)

1.  Return the [ReferencedBindings](#sec-static-semantics-referencedbindings) of the first [ModuleExportName](#prod-ModuleExportName).

[ModuleExportName](#prod-ModuleExportName) : [IdentifierName](#prod-IdentifierName)

1.  Return a [List](#sec-list-and-record-specification-type) whose sole element is the [IdentifierName](#prod-IdentifierName).

[ModuleExportName](#prod-ModuleExportName) : [StringLiteral](#prod-StringLiteral)

1.  Return a [List](#sec-list-and-record-specification-type) whose sole element is the [StringLiteral](#prod-StringLiteral).

#### 16.2.3.7 Runtime Semantics: Evaluation

[ExportDeclaration](#prod-ExportDeclaration) : export [ExportFromClause](#prod-ExportFromClause) [FromClause](#prod-FromClause) [WithClause](#prod-WithClause)opt ; export [NamedExports](#prod-NamedExports) ;

1.  Return empty.

[ExportDeclaration](#prod-ExportDeclaration) : export [VariableStatement](#prod-VariableStatement)

1.  Return ? [Evaluation](#sec-evaluation) of [VariableStatement](#prod-VariableStatement).

[ExportDeclaration](#prod-ExportDeclaration) : export [Declaration](#prod-Declaration)

1.  Return ? [Evaluation](#sec-evaluation) of [Declaration](#prod-Declaration).

[ExportDeclaration](#prod-ExportDeclaration) : export default [HoistableDeclaration](#prod-HoistableDeclaration)

1.  Return ? [Evaluation](#sec-evaluation) of [HoistableDeclaration](#prod-HoistableDeclaration).

[ExportDeclaration](#prod-ExportDeclaration) : export default [ClassDeclaration](#prod-ClassDeclaration)

1.  Let `value` be ? [BindingClassDeclarationEvaluation](#sec-runtime-semantics-bindingclassdeclarationevaluation) of [ClassDeclaration](#prod-ClassDeclaration).
2.  Let `className` be the sole element of the [BoundNames](#sec-static-semantics-boundnames) of [ClassDeclaration](#prod-ClassDeclaration).
3.  If `className` is "\*default\*", then
    1.  Let `env` be the [running execution context](#running-execution-context)'s LexicalEnvironment.
    2.  Perform ? [InitializeBoundName](#sec-initializeboundname)("\*default\*", `value`, `env`).
4.  Return empty.

[ExportDeclaration](#prod-ExportDeclaration) : export default [AssignmentExpression](#prod-AssignmentExpression) ;

1.  If [IsAnonymousFunctionDefinition](#sec-isanonymousfunctiondefinition)([AssignmentExpression](#prod-AssignmentExpression)) is true, then
    1.  Let `value` be ? [NamedEvaluation](#sec-runtime-semantics-namedevaluation) of [AssignmentExpression](#prod-AssignmentExpression) with argument "default".
2.  Else,
    1.  Let `rhs` be ? [Evaluation](#sec-evaluation) of [AssignmentExpression](#prod-AssignmentExpression).
    2.  Let `value` be ? [GetValue](#sec-getvalue)(`rhs`).
3.  Let `env` be the [running execution context](#running-execution-context)'s LexicalEnvironment.
4.  Perform ? [InitializeBoundName](#sec-initializeboundname)("\*default\*", `value`, `env`).
5.  Return empty.
