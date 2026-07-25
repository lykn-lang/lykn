# 5 Notational Conventions

## 5.1 Syntactic and Lexical Grammars

### 5.1.1 Context-Free Grammars

A *context-free grammar* consists of a number of *productions*. Each production has an abstract symbol called a *nonterminal* as its *left-hand side*, and a sequence of zero or more nonterminal and *terminal* symbols as its *right-hand side*. For each grammar, the terminal symbols are drawn from a specified alphabet.

A chain production is a production that has exactly one nonterminal symbol on its right-hand side along with zero or more terminal symbols.

Starting from a sentence consisting of a single distinguished nonterminal, called the goal symbol, a given context-free grammar specifies a *language*, namely, the (perhaps infinite) set of possible sequences of terminal symbols that can result from repeatedly replacing any nonterminal in the sequence with a right-hand side of a production for which the nonterminal is the left-hand side.

### 5.1.2 The Lexical and RegExp Grammars

A *lexical grammar* for ECMAScript is given in clause [12](#sec-ecmascript-language-lexical-grammar). This grammar has as its terminal symbols Unicode code points that conform to the rules for [SourceCharacter](#prod-SourceCharacter) defined in [11.1](#sec-source-text). It defines a set of productions, starting from the [goal symbol](#sec-context-free-grammars) [InputElementDiv](#prod-InputElementDiv), [InputElementTemplateTail](#prod-InputElementTemplateTail), [InputElementRegExp](#prod-InputElementRegExp), [InputElementRegExpOrTemplateTail](#prod-InputElementRegExpOrTemplateTail), or [InputElementHashbangOrRegExp](#prod-InputElementHashbangOrRegExp), that describe how sequences of such code points are translated into a sequence of input elements.

Input elements other than white space and comments form the terminal symbols for the syntactic grammar for ECMAScript and are called ECMAScript *tokens*. These tokens are the [reserved words](#sec-keywords-and-reserved-words), identifiers, literals, and punctuators of the ECMAScript language. Moreover, line terminators, although not considered to be tokens, also become part of the stream of input elements and guide the process of automatic semicolon insertion ([12.10](#sec-automatic-semicolon-insertion)). Simple white space and single-line comments are discarded and do not appear in the stream of input elements for the syntactic grammar. A [MultiLineComment](#prod-MultiLineComment) (that is, a comment of the form `/*`…`*/` regardless of whether it spans more than one line) is likewise simply discarded if it contains no line terminator; but if a [MultiLineComment](#prod-MultiLineComment) contains one or more line terminators, then it is replaced by a single line terminator, which becomes part of the stream of input elements for the syntactic grammar.

A *RegExp grammar* for ECMAScript is given in [22.2.1](#sec-patterns). This grammar also has as its terminal symbols the code points as defined by [SourceCharacter](#prod-SourceCharacter). It defines a set of productions, starting from the [goal symbol](#sec-context-free-grammars) [Pattern](#prod-Pattern), that describe how sequences of code points are translated into regular expression patterns.

Productions of the lexical and RegExp grammars are distinguished by having two colons “**::**” as separating punctuation. The lexical and RegExp grammars share some productions.

### 5.1.3 The Numeric String Grammar

A *numeric string grammar* appears in [7.1.4.1](#sec-tonumber-applied-to-the-string-type). It has as its terminal symbols [SourceCharacter](#prod-SourceCharacter), and is used for translating Strings into numeric values starting from the [goal symbol](#sec-context-free-grammars) [StringNumericLiteral](#prod-StringNumericLiteral) (which is similar to but distinct from the [lexical grammar for numeric literals](#sec-literals-numeric-literals)).

Productions of the numeric string grammar are distinguished by having three colons “**:::**” as punctuation, and are never used for parsing source text.

### 5.1.4 The Syntactic Grammar

The *syntactic grammar* for ECMAScript is given in clauses [13](#sec-ecmascript-language-expressions) through [16](#sec-ecmascript-language-scripts-and-modules). This grammar has ECMAScript tokens defined by the lexical grammar as its terminal symbols ([5.1.2](#sec-lexical-and-regexp-grammars)). It defines a set of productions, starting from two alternative [goal symbols](#sec-context-free-grammars) [Script](#prod-Script) and [Module](#prod-Module), that describe how sequences of tokens form syntactically correct independent components of ECMAScript programs.

When a stream of code points is to be parsed as an ECMAScript [Script](#prod-Script) or [Module](#prod-Module), it is first converted to a stream of input elements by repeated application of the lexical grammar; this stream of input elements is then parsed by a single application of the syntactic grammar. The input stream is syntactically in error if the tokens in the stream of input elements cannot be parsed as a single instance of the goal nonterminal ([Script](#prod-Script) or [Module](#prod-Module)), with no tokens left over.

When a parse is successful, it constructs a *parse tree*, a rooted tree structure in which each node is a Parse Node. Each Parse Node is an *instance* of a symbol in the grammar; it represents a span of the source text that can be derived from that symbol. The root node of the parse tree, representing the whole of the source text, is an instance of the parse's [goal symbol](#sec-context-free-grammars). When a Parse Node is an instance of a nonterminal, it is also an instance of some production that has that nonterminal as its left-hand side. Moreover, it has zero or more *children*, one for each symbol on the production's right-hand side: each child is a Parse Node that is an instance of the corresponding symbol.

New Parse Nodes are instantiated for each invocation of the parser and never reused between parses even of identical source text. Parse Nodes are considered the same Parse Node if and only if they represent the same span of source text, are instances of the same grammar symbol, and resulted from the same parser invocation.

Note 1

Parsing the same String multiple times will lead to different Parse Nodes. For example, consider:

``` javascript
let str = "1 + 1;";
eval(str);
eval(str);
```

Each call to `eval` converts the value of `str` into [ECMAScript source text](#sec-source-text) and performs an independent parse that creates its own separate tree of Parse Nodes. The trees are distinct even though each parse operates upon a source text that was derived from the same String value.

Note 2

Parse Nodes are specification artefacts, and implementations are not required to use an analogous data structure.

Productions of the syntactic grammar are distinguished by having just one colon “**:**” as punctuation.

The syntactic grammar as presented in clauses [13](#sec-ecmascript-language-expressions) through [16](#sec-ecmascript-language-scripts-and-modules) is not a complete account of which token sequences are accepted as a correct ECMAScript [Script](#prod-Script) or [Module](#prod-Module). Certain additional token sequences are also accepted, namely, those that would be described by the grammar if only semicolons were added to the sequence in certain places (such as before line terminator characters). Furthermore, certain token sequences that are described by the grammar are not considered acceptable if a line terminator character appears in certain “awkward” places.

In certain cases, in order to avoid ambiguities, the syntactic grammar uses generalized productions that permit token sequences that do not form a valid ECMAScript [Script](#prod-Script) or [Module](#prod-Module). For example, this technique is used for object literals and object destructuring patterns. In such cases a more restrictive *supplemental grammar* is provided that further restricts the acceptable token sequences. Typically, an [early error](#early-error) rule will then state that, in certain contexts, "`P` must cover an `N`", where `P` is a Parse Node (an instance of the generalized production) and `N` is a nonterminal from the supplemental grammar. This means:

1.  The sequence of tokens originally matched by `P` is parsed again using `N` as the [goal symbol](#sec-context-free-grammars). If `N` takes grammatical parameters, then they are set to the same values used when `P` was originally parsed.
2.  If the sequence of tokens can be parsed as a single instance of `N`, with no tokens left over, then:
    1.  We refer to that instance of `N` (a Parse Node, unique for a given `P`) as "the `N` that is covered by `P`".
    2.  All Early Error rules for `N` and its derived productions also apply to the `N` that is covered by `P`.
3.  Otherwise (if the parse fails), it is an early Syntax Error.

### 5.1.5 Grammar Notation

#### 5.1.5.1 Terminal Symbols

In the ECMAScript grammars, some terminal symbols are shown in `fixed-width` font. These are to appear in a source text exactly as written. All terminal symbol code points specified in this way are to be understood as the appropriate Unicode code points from the Basic Latin block, as opposed to any similar-looking code points from other Unicode ranges. A code point in a terminal symbol cannot be expressed by a `\` [UnicodeEscapeSequence](#prod-UnicodeEscapeSequence).

In grammars whose terminal symbols are individual Unicode code points (i.e., the lexical, RegExp, and numeric string grammars), a contiguous run of multiple fixed-width code points appearing in a production is a simple shorthand for the same sequence of code points, written as standalone terminal symbols.

For example, the production:

[HexIntegerLiteral](#prod-grammar-notation-HexIntegerLiteral) :: 0x [HexDigits](#prod-HexDigits)

is a shorthand for:

[HexIntegerLiteral](#prod-grammar-notation-HexIntegerLiteral) :: 0 x [HexDigits](#prod-HexDigits)

In contrast, in the syntactic grammar, a contiguous run of fixed-width code points is a single terminal symbol.

Terminal symbols come in two other forms:

- In the lexical and RegExp grammars, Unicode code points without a conventional printed representation are instead shown in the form "\<ABBREV\>" where "ABBREV" is a mnemonic for the code point or set of code points. These forms are defined in [Unicode Format-Control Characters](#sec-unicode-format-control-characters), [White Space](#sec-white-space), and [Line Terminators](#sec-line-terminators).
- In the syntactic grammar, certain terminal symbols (e.g. [IdentifierName](#prod-IdentifierName) and [RegularExpressionLiteral](#prod-RegularExpressionLiteral)) are shown in italics, as they refer to the nonterminals of the same name in the lexical grammar.

#### 5.1.5.2 Nonterminal Symbols and Productions

Nonterminal symbols are shown in *italic* type. The definition of a nonterminal (also called a “production”) is introduced by the name of the nonterminal being defined followed by one or more colons. (The number of colons indicates to which grammar the production belongs.) One or more alternative right-hand sides for the nonterminal then follow on succeeding lines. For example, the syntactic definition:

[WhileStatement](#prod-grammar-notation-WhileStatement) : while ( [Expression](#prod-Expression) ) [Statement](#prod-Statement)

states that the nonterminal [WhileStatement](#prod-grammar-notation-WhileStatement) represents the token `while`, followed by a left parenthesis token, followed by an [Expression](#prod-Expression), followed by a right parenthesis token, followed by a [Statement](#prod-Statement). The occurrences of [Expression](#prod-Expression) and [Statement](#prod-Statement) are themselves nonterminals. As another example, the syntactic definition:

[ArgumentList](#prod-grammar-notation-ArgumentList) : [AssignmentExpression](#prod-AssignmentExpression) [ArgumentList](#prod-grammar-notation-ArgumentList) , [AssignmentExpression](#prod-AssignmentExpression)

states that an [ArgumentList](#prod-grammar-notation-ArgumentList) may represent either a single [AssignmentExpression](#prod-AssignmentExpression) or an [ArgumentList](#prod-grammar-notation-ArgumentList), followed by a comma, followed by an [AssignmentExpression](#prod-AssignmentExpression). This definition of [ArgumentList](#prod-grammar-notation-ArgumentList) is recursive, that is, it is defined in terms of itself. The result is that an [ArgumentList](#prod-grammar-notation-ArgumentList) may contain any positive number of arguments, separated by commas, where each argument expression is an [AssignmentExpression](#prod-AssignmentExpression). Such recursive definitions of nonterminals are common.

#### 5.1.5.3 Optional Symbols

The subscripted suffix “_(opt)”, which may appear after a terminal or nonterminal, indicates an optional symbol. The alternative containing the optional symbol actually specifies two right-hand sides, one that omits the optional element and one that includes it. This means that:

[VariableDeclaration](#prod-grammar-notation-VariableDeclaration) : [BindingIdentifier](#prod-BindingIdentifier) [Initializer](#prod-Initializer)opt

is a convenient abbreviation for:

[VariableDeclaration](#prod-grammar-notation-VariableDeclaration) : [BindingIdentifier](#prod-BindingIdentifier) [BindingIdentifier](#prod-BindingIdentifier) [Initializer](#prod-Initializer)

and that:

[ForStatement](#prod-grammar-notation-ForStatement) : for ( [LexicalDeclaration](#prod-LexicalDeclaration) [Expression](#prod-Expression)opt ; [Expression](#prod-Expression)opt ) [Statement](#prod-Statement)

is a convenient abbreviation for:

[ForStatement](#prod-grammar-notation-ForStatement) : for ( [LexicalDeclaration](#prod-LexicalDeclaration) ; [Expression](#prod-Expression)opt ) [Statement](#prod-Statement) for ( [LexicalDeclaration](#prod-LexicalDeclaration) [Expression](#prod-Expression) ; [Expression](#prod-Expression)opt ) [Statement](#prod-Statement)

which in turn is an abbreviation for:

[ForStatement](#prod-grammar-notation-ForStatement) : for ( [LexicalDeclaration](#prod-LexicalDeclaration) ; ) [Statement](#prod-Statement) for ( [LexicalDeclaration](#prod-LexicalDeclaration) ; [Expression](#prod-Expression) ) [Statement](#prod-Statement) for ( [LexicalDeclaration](#prod-LexicalDeclaration) [Expression](#prod-Expression) ; ) [Statement](#prod-Statement) for ( [LexicalDeclaration](#prod-LexicalDeclaration) [Expression](#prod-Expression) ; [Expression](#prod-Expression) ) [Statement](#prod-Statement)

so, in this example, the nonterminal [ForStatement](#prod-grammar-notation-ForStatement) actually has four alternative right-hand sides.

#### 5.1.5.4 Grammatical Parameters

A production may be parameterized by a subscripted annotation of the form “_(\[parameters\])”, which may appear as a suffix to the nonterminal symbol defined by the production. “_(parameters)” may be either a single name or a comma separated list of names. A parameterized production is shorthand for a set of productions defining all combinations of the parameter names, preceded by an underscore, appended to the parameterized nonterminal symbol. This means that:

[StatementList](#prod-grammar-notation-StatementList)\[Return\] : [ReturnStatement](#prod-ReturnStatement) [ExpressionStatement](#prod-ExpressionStatement)

is a convenient abbreviation for:

[StatementList](#prod-grammar-notation-StatementList) : [ReturnStatement](#prod-ReturnStatement) [ExpressionStatement](#prod-ExpressionStatement) [StatementList_Return](#prod-grammar-notation-StatementList_Return) : [ReturnStatement](#prod-ReturnStatement) [ExpressionStatement](#prod-ExpressionStatement)

and that:

[StatementList](#prod-grammar-notation-StatementList)\[Return, In\] : [ReturnStatement](#prod-ReturnStatement) [ExpressionStatement](#prod-ExpressionStatement)

is an abbreviation for:

[StatementList](#prod-grammar-notation-StatementList) : [ReturnStatement](#prod-ReturnStatement) [ExpressionStatement](#prod-ExpressionStatement) [StatementList_Return](#prod-grammar-notation-StatementList_Return) : [ReturnStatement](#prod-ReturnStatement) [ExpressionStatement](#prod-ExpressionStatement) [StatementList_In](#prod-grammar-notation-StatementList_In) : [ReturnStatement](#prod-ReturnStatement) [ExpressionStatement](#prod-ExpressionStatement) [StatementList_Return_In](#prod-grammar-notation-StatementList_Return_In) : [ReturnStatement](#prod-ReturnStatement) [ExpressionStatement](#prod-ExpressionStatement)

Multiple parameters produce a combinatoric number of productions, not all of which are necessarily referenced in a complete grammar.

References to nonterminals on the right-hand side of a production can also be parameterized. For example:

[StatementList](#prod-grammar-notation-StatementList) : [ReturnStatement](#prod-ReturnStatement) [ExpressionStatement](#prod-ExpressionStatement)\[+In\]

is equivalent to saying:

[StatementList](#prod-grammar-notation-StatementList) : [ReturnStatement](#prod-ReturnStatement) ExpressionStatement_In

and:

[StatementList](#prod-grammar-notation-StatementList) : [ReturnStatement](#prod-ReturnStatement) [ExpressionStatement](#prod-ExpressionStatement)\[~In\]

is equivalent to:

[StatementList](#prod-grammar-notation-StatementList) : [ReturnStatement](#prod-ReturnStatement) [ExpressionStatement](#prod-ExpressionStatement)

A nonterminal reference may have both a parameter list and an “_(opt)” suffix. For example:

[VariableDeclaration](#prod-grammar-notation-VariableDeclaration) : [BindingIdentifier](#prod-BindingIdentifier) [Initializer](#prod-Initializer)\[+In\]opt

is an abbreviation for:

[VariableDeclaration](#prod-grammar-notation-VariableDeclaration) : [BindingIdentifier](#prod-BindingIdentifier) [BindingIdentifier](#prod-BindingIdentifier) Initializer_In

Prefixing a parameter name with “_(?)” on a right-hand side nonterminal reference makes that parameter value dependent upon the occurrence of the parameter name on the reference to the current production's left-hand side symbol. For example:

[VariableDeclaration](#prod-grammar-notation-VariableDeclaration)\[In\] : [BindingIdentifier](#prod-BindingIdentifier) [Initializer](#prod-Initializer)\[?In\]

is an abbreviation for:

[VariableDeclaration](#prod-grammar-notation-VariableDeclaration) : [BindingIdentifier](#prod-BindingIdentifier) [Initializer](#prod-Initializer) [VariableDeclaration_In](#prod-grammar-notation-VariableDeclaration_In) : [BindingIdentifier](#prod-BindingIdentifier) Initializer_In

If a right-hand side alternative is prefixed with “\[+parameter\]” that alternative is only available if the named parameter was used in referencing the production's nonterminal symbol. If a right-hand side alternative is prefixed with “\[~parameter\]” that alternative is only available if the named parameter was *not* used in referencing the production's nonterminal symbol. This means that:

[StatementList](#prod-grammar-notation-StatementList)\[Return\] : \[+Return\] [ReturnStatement](#prod-ReturnStatement) [ExpressionStatement](#prod-ExpressionStatement)

is an abbreviation for:

[StatementList](#prod-grammar-notation-StatementList) : [ExpressionStatement](#prod-ExpressionStatement) [StatementList_Return](#prod-grammar-notation-StatementList_Return) : [ReturnStatement](#prod-ReturnStatement) [ExpressionStatement](#prod-ExpressionStatement)

and that:

[StatementList](#prod-grammar-notation-StatementList)\[Return\] : \[~Return\] [ReturnStatement](#prod-ReturnStatement) [ExpressionStatement](#prod-ExpressionStatement)

is an abbreviation for:

[StatementList](#prod-grammar-notation-StatementList) : [ReturnStatement](#prod-ReturnStatement) [ExpressionStatement](#prod-ExpressionStatement) [StatementList_Return](#prod-grammar-notation-StatementList_Return) : [ExpressionStatement](#prod-ExpressionStatement)

#### 5.1.5.5 one of

When the words “**one of**” follow the colon(s) in a grammar definition, they signify that each of the terminal symbols on the following line or lines is an alternative definition. For example, the lexical grammar for ECMAScript contains the production:

[NonZeroDigit](#prod-grammar-notation-NonZeroDigit) :: one of 1 2 3 4 5 6 7 8 9

which is merely a convenient abbreviation for:

[NonZeroDigit](#prod-grammar-notation-NonZeroDigit) :: 1 2 3 4 5 6 7 8 9

#### 5.1.5.6 \[empty\]

If the phrase “\[empty\]” appears as the right-hand side of a production, it indicates that the production's right-hand side contains no terminals or nonterminals.

#### 5.1.5.7 Lookahead Restrictions

If the phrase “\[lookahead = `seq`\]” appears in the right-hand side of a production, it indicates that the production may only be used if the token sequence `seq` is a prefix of the immediately following input token sequence. Similarly, “\[lookahead ∈ `set`\]”, where `set` is a [finite](#finite) non-empty set of token sequences, indicates that the production may only be used if some element of `set` is a prefix of the immediately following token sequence. For convenience, the set can also be written as a nonterminal, in which case it represents the set of all token sequences to which that nonterminal could expand. It is considered an editorial error if the nonterminal could expand to infinitely many distinct token sequences.

These conditions may be negated. “\[lookahead ≠ `seq`\]” indicates that the containing production may only be used if `seq` is *not* a prefix of the immediately following input token sequence, and “\[lookahead ∉ `set`\]” indicates that the production may only be used if *no* element of `set` is a prefix of the immediately following token sequence.

As an example, given the definitions:

[DecimalDigit](#prod-grammar-notation-DecimalDigit) :: one of 0 1 2 3 4 5 6 7 8 9 [DecimalDigits](#prod-grammar-notation-DecimalDigits) :: [DecimalDigit](#prod-grammar-notation-DecimalDigit) [DecimalDigits](#prod-grammar-notation-DecimalDigits) [DecimalDigit](#prod-grammar-notation-DecimalDigit)

the definition:

[LookaheadExample](#prod-grammar-notation-LookaheadExample) :: n \[lookahead ∉ { 1, 3, 5, 7, 9 }\] [DecimalDigits](#prod-grammar-notation-DecimalDigits) [DecimalDigit](#prod-grammar-notation-DecimalDigit) \[lookahead ∉ [DecimalDigit](#prod-grammar-notation-DecimalDigit)\]

matches either the letter `n` followed by one or more decimal digits the first of which is even, or a decimal digit not followed by another decimal digit.

Note that when these phrases are used in the syntactic grammar, it may not be possible to unambiguously identify the immediately following token sequence because determining later tokens requires knowing which lexical [goal symbol](#sec-context-free-grammars) to use at later positions. As such, when these are used in the syntactic grammar, it is considered an editorial error for a token sequence `seq` to appear in a lookahead restriction (including as part of a set of sequences) if the choices of lexical [goal symbols](#sec-context-free-grammars) to use could change whether or not `seq` would be a prefix of the resulting token sequence.

#### 5.1.5.8 \[no [LineTerminator](#prod-LineTerminator) here\]

If the phrase “\[no [LineTerminator](#prod-LineTerminator) here\]” appears in the right-hand side of a production of the syntactic grammar, it indicates that the production is *a restricted production*: it may not be used if a [LineTerminator](#prod-LineTerminator) occurs in the input stream at the indicated position. For example, the production:

[ThrowStatement](#prod-grammar-notation-ThrowStatement) : throw \[no [LineTerminator](#prod-LineTerminator) here\] [Expression](#prod-Expression) ;

indicates that the production may not be used if a [LineTerminator](#prod-LineTerminator) occurs in the script between the `throw` token and the [Expression](#prod-Expression).

Unless the presence of a [LineTerminator](#prod-LineTerminator) is forbidden by a restricted production, any number of occurrences of [LineTerminator](#prod-LineTerminator) may appear between any two consecutive tokens in the stream of input elements without affecting the syntactic acceptability of the script.

#### 5.1.5.9 but not

The right-hand side of a production may specify that certain expansions are not permitted by using the phrase “**but not**” and then indicating the expansions to be excluded. For example, the production:

[Identifier](#prod-grammar-notation-Identifier) :: [IdentifierName](#prod-IdentifierName) but not [ReservedWord](#prod-ReservedWord)

means that the nonterminal [Identifier](#prod-grammar-notation-Identifier) may be replaced by any sequence of code points that could replace [IdentifierName](#prod-IdentifierName) provided that the same sequence of code points could not replace [ReservedWord](#prod-ReservedWord).

#### 5.1.5.10 Descriptive Phrases

Finally, a few nonterminal symbols are described by a descriptive phrase in sans-serif type in cases where it would be impractical to list all the alternatives:

[SourceCharacter](#prod-grammar-notation-SourceCharacter) :: any Unicode code point

## 5.2 Algorithm Conventions

The specification often uses a numbered list to specify steps in an algorithm. These algorithms are used to precisely specify the required semantics of ECMAScript language constructs. The algorithms are not intended to imply the use of any specific implementation technique. In practice, there may be more efficient algorithms available to implement a given feature.

Algorithms may be explicitly parameterized with an ordered, comma-separated sequence of alias names which may be used within the algorithm steps to reference the argument passed in that position. Optional parameters are denoted with surrounding brackets (\[ , `name` \]) and are no different from required parameters within algorithm steps. A rest parameter may appear at the end of a parameter list, denoted with leading ellipsis (, ...`name`). The rest parameter captures all of the arguments provided following the required and optional parameters into a [List](#sec-list-and-record-specification-type). If there are no such additional arguments, that [List](#sec-list-and-record-specification-type) is empty.

Algorithm steps may be subdivided into sequential substeps. Substeps are indented and may themselves be further divided into indented substeps. Outline numbering conventions are used to identify substeps with the first level of substeps labelled with lowercase alphabetic characters and the second level of substeps labelled with lowercase roman numerals. If more than three levels are required these rules repeat with the fourth level using numeric labels. For example:

1.  Top-level step
    1.  Substep.
    2.  Substep.
        1.  Subsubstep.
            1.  Subsubsubstep
                1.  Subsubsubsubstep
                    1.  Subsubsubsubsubstep

A step or substep may be written as an “if” predicate that conditions its substeps. In this case, the substeps are only applied if the predicate is true. If a step or substep begins with the word “else”, it is a predicate that is the negation of the preceding “if” predicate step at the same level.

A step may specify the iterative application of its substeps.

A step that begins with “Assert:” asserts an invariant condition of its algorithm. Such assertions are used to make explicit algorithmic invariants that would otherwise be implicit. Such assertions add no additional semantic requirements and hence need not be checked by an implementation. They are used simply to clarify algorithms.

Algorithm steps may declare named aliases for any value using the form “Let `x` be `someValue`”. These aliases are reference-like in that both `x` and `someValue` refer to the same underlying data and modifications to either are visible to both. Algorithm steps that want to avoid this reference-like behaviour should explicitly make a copy of the right-hand side: “Let `x` be a copy of `someValue`” creates a shallow copy of `someValue`.

Once declared, an alias may be referenced in any subsequent steps and must not be referenced from steps prior to the alias's declaration. Aliases may be modified using the form “Set `x` to `someOtherValue`”.

### 5.2.1 Abstract Operations

In order to facilitate their use in multiple parts of this specification, some algorithms, called abstract operations, are named and written in parameterized functional form so that they may be referenced by name from within other algorithms. Abstract operations are typically referenced using a functional application style such as OperationName(`arg1`, `arg2`). Some abstract operations are treated as polymorphically dispatched methods of class-like specification abstractions. Such method-like abstract operations are typically referenced using a method application style such as `someValue`.OperationName(`arg1`, `arg2`).

### 5.2.2 Syntax-Directed Operations

A syntax-directed operation is a named operation whose definition consists of algorithms, each of which is associated with one or more productions from one of the ECMAScript grammars. A production that has multiple alternative definitions will typically have a distinct algorithm for each alternative. When an algorithm is associated with a grammar production, it may reference the terminal and nonterminal symbols of the production alternative as if they were parameters of the algorithm. When used in this manner, nonterminal symbols refer to the actual alternative definition that is matched when parsing the source text. The source text matched by a grammar production or [Parse Node](#sec-syntactic-grammar) derived from it is the portion of the source text that starts at the beginning of the first terminal that participated in the match and ends at the end of the last terminal that participated in the match.

When an algorithm is associated with a production alternative, the alternative is typically shown without any “\[ \]” grammar annotations. Such annotations should only affect the syntactic recognition of the alternative and have no effect on the associated semantics for the alternative.

Syntax-directed operations are invoked with a parse node and, optionally, other parameters by using the conventions on steps [1](#step-sdo-invocation-example-1), [3](#step-sdo-invocation-example-2), and [4](#step-sdo-invocation-example-3) in the following algorithm:

1.  Let `status` be SyntaxDirectedOperation of SomeNonTerminal.
2.  Let `someParseNode` be the parse of some source text.
3.  Perform SyntaxDirectedOperation of `someParseNode`.
4.  Perform SyntaxDirectedOperation of `someParseNode` with argument "value".

Unless explicitly specified otherwise, all [chain productions](#sec-context-free-grammars) have an implicit definition for every operation that might be applied to that production's left-hand side nonterminal. The implicit definition simply reapplies the same operation with the same parameters, if any, to the [chain production](#sec-context-free-grammars)'s sole right-hand side nonterminal and then returns the result. For example, assume that some algorithm has a step of the form: “Return [Evaluation](#sec-evaluation) of [Block](#prod-Block)” and that there is a production:

[Block](#prod-Block) : { [StatementList](#prod-StatementList) }

but the [Evaluation](#sec-evaluation) operation does not associate an algorithm with that production. In that case, the [Evaluation](#sec-evaluation) operation implicitly includes an association of the form:

**Runtime Semantics: [Evaluation](#sec-evaluation)**

[Block](#prod-Block) : { [StatementList](#prod-StatementList) }

1.  Return [Evaluation](#sec-evaluation) of [StatementList](#prod-StatementList).

### 5.2.3 Runtime Semantics

Algorithms which specify semantics that must be called at runtime are called runtime semantics. Runtime semantics are defined by [abstract operations](#sec-algorithm-conventions-abstract-operations) or [syntax-directed operations](#sec-algorithm-conventions-syntax-directed-operations).

#### 5.2.3.1 Completion ( `completionRecord` )

The abstract operation Completion takes argument `completionRecord` (a [Completion Record](#sec-completion-record-specification-type)) and returns a [Completion Record](#sec-completion-record-specification-type). It is used to emphasize that a [Completion Record](#sec-completion-record-specification-type) is being returned. It performs the following steps when called:

1.  [Assert](#assert): `completionRecord` is a [Completion Record](#sec-completion-record-specification-type).
2.  Return `completionRecord`.

#### 5.2.3.2 Throw an Exception

Algorithms steps that say to throw an exception, such as

1.  Throw a TypeError exception.

mean the same things as:

1.  Return [ThrowCompletion](#sec-throwcompletion)(a newly created TypeError object).

#### 5.2.3.3 ReturnIfAbrupt

Algorithms steps that say or are otherwise equivalent to:

1.  [ReturnIfAbrupt](#sec-returnifabrupt)(`argument`).

mean the same thing as:

1.  [Assert](#assert): `argument` is a [Completion Record](#sec-completion-record-specification-type).
2.  If `argument` is an [abrupt completion](#sec-completion-record-specification-type), return [Completion](#sec-completion-ao)(`argument`).
3.  Else, set `argument` to `argument`.`[[Value]]`.

Algorithms steps that say or are otherwise equivalent to:

1.  [ReturnIfAbrupt](#sec-returnifabrupt)(AbstractOperation()).

mean the same thing as:

1.  Let `hygienicTemp` be AbstractOperation().
2.  [Assert](#assert): `hygienicTemp` is a [Completion Record](#sec-completion-record-specification-type).
3.  If `hygienicTemp` is an [abrupt completion](#sec-completion-record-specification-type), return [Completion](#sec-completion-ao)(`hygienicTemp`).
4.  Else, set `hygienicTemp` to `hygienicTemp`.`[[Value]]`.

Where `hygienicTemp` is ephemeral and visible only in the steps pertaining to ReturnIfAbrupt.

Algorithms steps that say or are otherwise equivalent to:

1.  Let `result` be AbstractOperation([ReturnIfAbrupt](#sec-returnifabrupt)(`argument`)).

mean the same thing as:

1.  [Assert](#assert): `argument` is a [Completion Record](#sec-completion-record-specification-type).
2.  If `argument` is an [abrupt completion](#sec-completion-record-specification-type), return [Completion](#sec-completion-ao)(`argument`).
3.  Else, set `argument` to `argument`.`[[Value]]`.
4.  Let `result` be AbstractOperation(`argument`).

#### 5.2.3.4 ReturnIfAbrupt Shorthands

Invocations of [abstract operations](#sec-algorithm-conventions-abstract-operations) and [syntax-directed operations](#sec-algorithm-conventions-syntax-directed-operations) that are prefixed by `?` indicate that [ReturnIfAbrupt](#sec-returnifabrupt) should be applied to the resulting [Completion Record](#sec-completion-record-specification-type). For example, the step:

1.  ? OperationName().

is equivalent to the following step:

1.  [ReturnIfAbrupt](#sec-returnifabrupt)(OperationName()).

Similarly, for method application style, the step:

1.  ? `someValue`.OperationName().

is equivalent to:

1.  [ReturnIfAbrupt](#sec-returnifabrupt)(`someValue`.OperationName()).

Similarly, prefix `!` is used to indicate that the following invocation of an abstract or [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) will never return an [abrupt completion](#sec-completion-record-specification-type) and that the resulting [Completion Record](#sec-completion-record-specification-type)'s `[[Value]]` field should be used in place of the return value of the operation. For example, the step:

1.  Let `val` be ! OperationName().

is equivalent to the following steps:

1.  Let `val` be OperationName().
2.  [Assert](#assert): `val` is a [normal completion](#sec-completion-record-specification-type).
3.  Set `val` to `val`.`[[Value]]`.

[Syntax-directed operations](#sec-algorithm-conventions-syntax-directed-operations) for [runtime semantics](#sec-runtime-semantics) make use of this shorthand by placing `!` or `?` before the invocation of the operation:

1.  Perform ! SyntaxDirectedOperation of NonTerminal.

#### 5.2.3.5 Implicit Normal Completion

In algorithms within [abstract operations](#sec-algorithm-conventions-abstract-operations) which are declared to return a [Completion Record](#sec-completion-record-specification-type), and within all built-in functions, the returned value is first passed to [NormalCompletion](#sec-normalcompletion), and the result is used instead. This rule does not apply within the [Completion](#sec-completion-ao) algorithm or when the value being returned is clearly marked as a [Completion Record](#sec-completion-record-specification-type) in that step; these cases are:

- when the result of applying [Completion](#sec-completion-ao), [NormalCompletion](#sec-normalcompletion), [ThrowCompletion](#sec-throwcompletion), or [ReturnCompletion](#sec-returncompletion) is directly returned
- when the result of constructing a [Completion Record](#sec-completion-record-specification-type) is directly returned

It is an editorial error if a [Completion Record](#sec-completion-record-specification-type) is returned from such an abstract operation through any other means. For example, within these [abstract operations](#sec-algorithm-conventions-abstract-operations),

1.  Return true.

means the same things as any of

1.  Return [NormalCompletion](#sec-normalcompletion)(true).

or

1.  Let `completion` be [NormalCompletion](#sec-normalcompletion)(true).
2.  Return [Completion](#sec-completion-ao)(`completion`).

or

1.  Return [Completion Record](#sec-completion-record-specification-type) { `[[Type]]`: normal, `[[Value]]`: true, `[[Target]]`: empty }.

Note that, through the [ReturnIfAbrupt](#sec-returnifabrupt) expansion, the following example is allowed, as within the expanded steps, the result of applying [Completion](#sec-completion-ao) is returned directly in the abrupt case and the implicit [NormalCompletion](#sec-normalcompletion) application occurs after unwrapping in the normal case.

1.  Return ? `completion`.

The following example would be an editorial error because a [Completion Record](#sec-completion-record-specification-type) is being returned without being annotated in that step.

1.  Let `completion` be [NormalCompletion](#sec-normalcompletion)(true).
2.  Return `completion`.

### 5.2.4 Static Semantics

Context-free grammars are not sufficiently powerful to express all the rules that define whether a stream of input elements form a valid ECMAScript [Script](#prod-Script) or [Module](#prod-Module) that may be evaluated. In some situations additional rules are needed that may be expressed using either ECMAScript algorithm conventions or prose requirements. Such rules are always associated with a production of a grammar and are called the static semantics of the production.

Static Semantic Rules have names and typically are defined using an algorithm. Named Static Semantic Rules are associated with grammar productions and a production that has multiple alternative definitions will typically have for each alternative a distinct algorithm for each applicable named static semantic rule.

A special kind of static semantic rule is an Early Error Rule. [Early error](#early-error) rules define [early error](#early-error) conditions (see clause [17](#sec-error-handling-and-language-extensions)) that are associated with specific grammar productions. [Evaluation](#sec-evaluation) of most [early error](#early-error) rules are not explicitly invoked within the algorithms of this specification. A conforming implementation must, prior to the first evaluation of a [Script](#prod-Script) or [Module](#prod-Module), validate all of the [early error](#early-error) rules of the productions used to parse that [Script](#prod-Script) or [Module](#prod-Module). If any of the [early error](#early-error) rules are violated the [Script](#prod-Script) or [Module](#prod-Module) is invalid and cannot be evaluated.

### 5.2.5 Mathematical Operations

This specification makes reference to these kinds of numeric values:

- Mathematical values: Arbitrary real numbers, used as the default numeric type.
- Extended mathematical values: [Mathematical values](#mathematical-value) together with +∞ and -∞.
- *Numbers*: [IEEE 754-2019](#sec-bibliography) binary64 (double-precision floating point) values.
- *BigInts*: [ECMAScript language values](#sec-ecmascript-language-types) representing arbitrary [integers](#integer) in a one-to-one correspondence.

In the language of this specification, numerical values are distinguished among different numeric kinds using subscript suffixes. The subscript _(𝔽) refers to Numbers, and the subscript _(ℤ) refers to BigInts. Numeric values without a subscript suffix refer to [mathematical values](#mathematical-value). This specification denotes most numeric values in base 10; it also uses numeric values of the form 0x followed by digits 0-9 or A-F as base-16 values.

In general, when this specification refers to a numerical value, such as in the phrase, "the length of `y`" or "the [integer](#integer) represented by the four hexadecimal digits ...", without explicitly specifying a numeric kind, the phrase refers to a [mathematical value](#mathematical-value). Phrases which refer to a Number or a BigInt value are explicitly annotated as such; for example, "the [Number value for](#number-value-for) the number of code points in …" or "the [BigInt value for](#bigint-value-for) …".

When the term integer is used in this specification, it refers to a [mathematical value](#mathematical-value) which is in the set of [integers](#integer), unless otherwise stated. When the term integral Number is used in this specification, it refers to a [finite](#finite) Number value whose [mathematical value](#mathematical-value) is in the set of [integers](#integer).

Numeric operators such as +, ×, =, and ≥ refer to those operations as determined by the type of the operands. When applied to [mathematical values](#mathematical-value), the operators refer to the usual mathematical operations. When applied to [extended mathematical values](#extended-mathematical-value), the operators refer to the usual mathematical operations over the extended real numbers; indeterminate forms are not defined and their use in this specification should be considered an editorial error. When applied to Numbers, the operators refer to the relevant operations within [IEEE 754-2019](#sec-bibliography). When applied to BigInts, the operators refer to the usual mathematical operations applied to the [mathematical value of](#mathematical-value-of) the BigInt. Numeric operators applied to mixed-type operands (such as a Number and a [mathematical value](#mathematical-value)) are not defined and should be considered an editorial error in this specification.

Conversions between [mathematical values](#mathematical-value) and Numbers or BigInts are always explicit in this document. A conversion from a [mathematical value](#mathematical-value) or [extended mathematical value](#extended-mathematical-value) `x` to a Number is denoted as "the [Number value for](#number-value-for) `x`" or 𝔽(`x`), and is defined in [6.1.6.1](#sec-ecmascript-language-types-number-type). A conversion from an [integer](#integer) `x` to a BigInt is denoted as "the BigInt value for `x`" or ℤ(`x`). A conversion from a Number or BigInt `x` to a [mathematical value](#mathematical-value) is denoted as "the mathematical value of `x`", or ℝ(`x`). The [mathematical value of](#mathematical-value-of) +0_(𝔽) and -0_(𝔽) is the [mathematical value](#mathematical-value) 0. The [mathematical value of](#mathematical-value-of) non-[finite](#finite) values is not defined. The extended mathematical value of `x` is the [mathematical value of](#mathematical-value-of) `x` for [finite](#finite) values, and is +∞ and -∞ for +∞_(𝔽) and -∞_(𝔽) respectively; it is not defined for NaN.

The mathematical function abs(`x`) produces the absolute value of `x`, which is -`x` if `x` \< 0 and otherwise is `x` itself.

The mathematical function min(`x1`, `x2`, … , `xN`) produces the mathematically smallest of `x1` through `xN`. The mathematical function max(`x1`, `x2`, ..., `xN`) produces the mathematically largest of `x1` through `xN`. The domain and range of these mathematical functions are the [extended mathematical values](#extended-mathematical-value).

The notation “`x` modulo `y`” (`y` must be [finite](#finite) and non-zero) computes a value `k` of the same sign as `y` (or zero) such that [abs](#eqn-abs)(`k`) \< [abs](#eqn-abs)(`y`) and `x` - `k` = `q` × `y` for some [integer](#integer) `q`.

The phrase "the result of clamping `x` between `lower` and `upper`" (where `x` is an [extended mathematical value](#extended-mathematical-value) and `lower` and `upper` are [mathematical values](#mathematical-value) such that `lower` ≤ `upper`) produces `lower` if `x` \< `lower`, produces `upper` if `x` \> `upper`, and otherwise produces `x`.

The mathematical function floor(`x`) produces the largest [integer](#integer) (closest to +∞) that is not larger than `x`.

Note

[floor](#eqn-floor)(`x`) = `x` - (`x` [modulo](#eqn-modulo) 1).

The mathematical function truncate(`x`) removes the fractional part of `x` by rounding towards zero, producing -[floor](#eqn-floor)(-`x`) if `x` \< 0 and otherwise producing [floor](#eqn-floor)(`x`).

Mathematical functions [min](#eqn-min), [max](#eqn-max), [abs](#eqn-abs), [floor](#eqn-floor), and [truncate](#eqn-truncate) are not defined for Numbers and BigInts, and any usage of those methods that have non-[mathematical value](#mathematical-value) arguments would be an editorial error in this specification.

An interval from lower bound `a` to upper bound `b` is a possibly-infinite, possibly-empty set of numeric values of the same numeric type. Each bound will be described as either inclusive or exclusive, but not both. There are four kinds of intervals, as follows:

- An [interval](#interval) from `a` (inclusive) to `b` (inclusive), also called an inclusive interval from `a` to `b`, includes all values `x` of the same numeric type such that `a` ≤ `x` ≤ `b`, and no others.
- An [interval](#interval) from `a` (inclusive) to `b` (exclusive) includes all values `x` of the same numeric type such that `a` ≤ `x` \< `b`, and no others.
- An [interval](#interval) from `a` (exclusive) to `b` (inclusive) includes all values `x` of the same numeric type such that `a` \< `x` ≤ `b`, and no others.
- An [interval](#interval) from `a` (exclusive) to `b` (exclusive) includes all values `x` of the same numeric type such that `a` \< `x` \< `b`, and no others.

For example, the [interval](#interval) from 1 (inclusive) to 2 (exclusive) consists of all [mathematical values](#mathematical-value) between 1 and 2, including 1 and not including 2. For the purpose of defining intervals, -0_(𝔽) \< +0_(𝔽), so, for example, an [inclusive interval](#inclusive-interval) with a lower bound of +0_(𝔽) includes +0_(𝔽) but not -0_(𝔽). NaN is never included in an [interval](#interval).

### 5.2.6 Value Notation

In this specification, [ECMAScript language values](#sec-ecmascript-language-types) are displayed in bold. Examples include null, true, or "hello". These are distinguished from [ECMAScript source text](#sec-source-text) such as `Function.prototype.apply` or `let n = 42;`.

### 5.2.7 Identity

In this specification, both specification values and [ECMAScript language values](#sec-ecmascript-language-types) are compared for equality. When comparing for equality, values fall into one of two categories. Values without identity are equal to other values without identity if all of their innate characteristics are the same — characteristics such as the magnitude of an [integer](#integer) or the length of a sequence. Values without identity may be manifest without prior reference by fully describing their characteristics. In contrast, each value with identity is unique and therefore only equal to itself. Values with identity are like values without identity but with an additional unguessable, unchangeable, universally-unique characteristic called *identity*. References to existing values with identity cannot be manifest simply by describing them, as the identity itself is indescribable; instead, references to these values must be explicitly passed from one place to another. Some values with identity are mutable and therefore can have their characteristics (except their identity) changed in-place, causing all holders of the value to observe the new characteristics. A value without identity is never equal to a value with identity.

From the perspective of this specification, the word “is” is used to compare two values for equality, as in “If `bool` is true, then ...”, and the word “contains” is used to search for a value inside lists using equality comparisons, as in "If `list` contains a [Record](#sec-list-and-record-specification-type) `r` such that `r`.`[[Foo]]` is true, then ...". The *specification identity* of values determines the result of these comparisons and is axiomatic in this specification.

From the perspective of the ECMAScript language, language values are compared for equality using the [SameValue](#sec-samevalue) abstract operation and the [abstract operations](#sec-algorithm-conventions-abstract-operations) it transitively calls. The algorithms of these comparison [abstract operations](#sec-algorithm-conventions-abstract-operations) determine *language identity* of [ECMAScript language values](#sec-ecmascript-language-types).

For specification values, examples of values without specification identity include, but are not limited to: [mathematical values](#mathematical-value) and [extended mathematical values](#extended-mathematical-value); [ECMAScript source text](#sec-source-text), [surrogate pairs](#surrogate-pair), [Directive Prologues](#directive-prologue), etc; UTF-16 code units; Unicode code points; [enums](#sec-enum-specification-type); [abstract operations](#sec-algorithm-conventions-abstract-operations), including [syntax-directed operations](#sec-algorithm-conventions-syntax-directed-operations), [host hooks](#host-hook), etc; and ordered pairs. Examples of specification values with specification identity include, but are not limited to: any kind of [Records](#sec-list-and-record-specification-type), including [Property Descriptors](#sec-property-descriptor-specification-type), [PrivateElements](#sec-privateelement-specification-type), etc; [Parse Nodes](#sec-syntactic-grammar); [Lists](#sec-list-and-record-specification-type); [Sets](#sec-set-and-relation-specification-type) and [Relations](#sec-set-and-relation-specification-type); [Abstract Closures](#sec-abstract-closure); [Data Blocks](#sec-data-blocks); [Private Names](#sec-private-names); [execution contexts](#sec-execution-contexts) and [execution context stacks](#execution-context-stack); [agent signifiers](#sec-agents); and [WaiterList Records](#sec-waiterlist-records).

Specification identity agrees with language identity for all [ECMAScript language values](#sec-ecmascript-language-types) except Symbol values produced by [Symbol.for](#sec-symbol.for). The [ECMAScript language values](#sec-ecmascript-language-types) without specification identity and without language identity are [undefined](#sec-ecmascript-language-types-undefined-type), [null](#sec-ecmascript-language-types-null-type), [Booleans](#sec-ecmascript-language-types-boolean-type), [Strings](#sec-ecmascript-language-types-string-type), [Numbers](#sec-ecmascript-language-types-number-type), and [BigInts](#sec-ecmascript-language-types-bigint-type). The [ECMAScript language values](#sec-ecmascript-language-types) with specification identity and language identity are [Symbols](#sec-ecmascript-language-types-symbol-type) not produced by [Symbol.for](#sec-symbol.for) and [Objects](#sec-object-type). Symbol values produced by [Symbol.for](#sec-symbol.for) have specification identity, but not language identity.
