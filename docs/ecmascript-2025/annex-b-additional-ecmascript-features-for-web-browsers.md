# Annex B (normative) Additional ECMAScript Features for Web Browsers

The ECMAScript language syntax and semantics defined in this annex are required when the ECMAScript [host](#host) is a web browser. The content of this annex is normative but optional if the ECMAScript [host](#host) is not a web browser.

Note

This annex describes various legacy features and other characteristics of web browser ECMAScript [hosts](#host). All of the language features and behaviours specified in this annex have one or more undesirable characteristics and in the absence of legacy usage would be removed from this specification. However, the usage of these features by large numbers of existing web pages means that web browsers must continue to support them. The specifications in this annex define the requirements for interoperable implementations of these legacy features.

These features are not considered part of the core ECMAScript language. Programmers should not use or assume the existence of these features and behaviours when writing new ECMAScript code. ECMAScript implementations are discouraged from implementing these features unless the implementation is part of a web browser or is required to run the same legacy ECMAScript code that web browsers encounter.

## B.1 Additional Syntax

### B.1.1 HTML-like Comments

The syntax and semantics of [12.4](#sec-comments) is extended as follows except that this extension is not allowed when parsing source text using the [goal symbol](#sec-context-free-grammars) [Module](#prod-Module):

#### Syntax

[InputElementHashbangOrRegExp](#prod-annexB-InputElementHashbangOrRegExp) :: [WhiteSpace](#prod-WhiteSpace) [LineTerminator](#prod-LineTerminator) [Comment](#prod-annexB-Comment) [CommonToken](#prod-CommonToken) [HashbangComment](#prod-HashbangComment) [RegularExpressionLiteral](#prod-RegularExpressionLiteral) [HTMLCloseComment](#prod-annexB-HTMLCloseComment) [Comment](#prod-annexB-Comment) :: [MultiLineComment](#prod-annexB-MultiLineComment) [SingleLineComment](#prod-SingleLineComment) [SingleLineHTMLOpenComment](#prod-annexB-SingleLineHTMLOpenComment) [SingleLineHTMLCloseComment](#prod-annexB-SingleLineHTMLCloseComment) [SingleLineDelimitedComment](#prod-annexB-SingleLineDelimitedComment) [MultiLineComment](#prod-annexB-MultiLineComment) :: /\* [FirstCommentLine](#prod-annexB-FirstCommentLine)opt [LineTerminator](#prod-LineTerminator) [MultiLineCommentChars](#prod-MultiLineCommentChars)opt \*/ [HTMLCloseComment](#prod-annexB-HTMLCloseComment)opt [FirstCommentLine](#prod-annexB-FirstCommentLine) :: [SingleLineDelimitedCommentChars](#prod-annexB-SingleLineDelimitedCommentChars) [SingleLineHTMLOpenComment](#prod-annexB-SingleLineHTMLOpenComment) :: \<!-- [SingleLineCommentChars](#prod-SingleLineCommentChars)opt [SingleLineHTMLCloseComment](#prod-annexB-SingleLineHTMLCloseComment) :: [LineTerminatorSequence](#prod-LineTerminatorSequence) [HTMLCloseComment](#prod-annexB-HTMLCloseComment) [SingleLineDelimitedComment](#prod-annexB-SingleLineDelimitedComment) :: /\* [SingleLineDelimitedCommentChars](#prod-annexB-SingleLineDelimitedCommentChars)opt \*/ [HTMLCloseComment](#prod-annexB-HTMLCloseComment) :: [WhiteSpaceSequence](#prod-annexB-WhiteSpaceSequence)opt [SingleLineDelimitedCommentSequence](#prod-annexB-SingleLineDelimitedCommentSequence)opt --\> [SingleLineCommentChars](#prod-SingleLineCommentChars)opt [SingleLineDelimitedCommentChars](#prod-annexB-SingleLineDelimitedCommentChars) :: [SingleLineNotAsteriskChar](#prod-annexB-SingleLineNotAsteriskChar) [SingleLineDelimitedCommentChars](#prod-annexB-SingleLineDelimitedCommentChars)opt \* [SingleLinePostAsteriskCommentChars](#prod-annexB-SingleLinePostAsteriskCommentChars)opt [SingleLineNotAsteriskChar](#prod-annexB-SingleLineNotAsteriskChar) :: [SourceCharacter](#prod-SourceCharacter) but not one of \* or [LineTerminator](#prod-LineTerminator) [SingleLinePostAsteriskCommentChars](#prod-annexB-SingleLinePostAsteriskCommentChars) :: [SingleLineNotForwardSlashOrAsteriskChar](#prod-annexB-SingleLineNotForwardSlashOrAsteriskChar) [SingleLineDelimitedCommentChars](#prod-annexB-SingleLineDelimitedCommentChars)opt \* [SingleLinePostAsteriskCommentChars](#prod-annexB-SingleLinePostAsteriskCommentChars)opt [SingleLineNotForwardSlashOrAsteriskChar](#prod-annexB-SingleLineNotForwardSlashOrAsteriskChar) :: [SourceCharacter](#prod-SourceCharacter) but not one of / or \* or [LineTerminator](#prod-LineTerminator) [WhiteSpaceSequence](#prod-annexB-WhiteSpaceSequence) :: [WhiteSpace](#prod-WhiteSpace) [WhiteSpaceSequence](#prod-annexB-WhiteSpaceSequence)opt [SingleLineDelimitedCommentSequence](#prod-annexB-SingleLineDelimitedCommentSequence) :: [SingleLineDelimitedComment](#prod-annexB-SingleLineDelimitedComment) [WhiteSpaceSequence](#prod-annexB-WhiteSpaceSequence)opt [SingleLineDelimitedCommentSequence](#prod-annexB-SingleLineDelimitedCommentSequence)opt

Similar to a [MultiLineComment](#prod-annexB-MultiLineComment) that contains a line terminator code point, a [SingleLineHTMLCloseComment](#prod-annexB-SingleLineHTMLCloseComment) is considered to be a [LineTerminator](#prod-LineTerminator) for purposes of parsing by the syntactic grammar.

### B.1.2 Regular Expressions Patterns

The syntax of [22.2.1](#sec-patterns) is modified and extended as follows. These changes introduce ambiguities that are broken by the ordering of grammar productions and by contextual information. When parsing using the following grammar, each alternative is considered only if previous production alternatives do not match.

This alternative pattern grammar and semantics only changes the syntax and semantics of BMP patterns. The following grammar extensions include productions parameterized with the \[UnicodeMode\] parameter. However, none of these extensions change the syntax of Unicode patterns recognized when parsing with the \[UnicodeMode\] parameter present on the [goal symbol](#sec-context-free-grammars).

#### Syntax

[Term](#prod-annexB-Term)\[UnicodeMode, UnicodeSetsMode, NamedCaptureGroups\] :: \[+UnicodeMode\] [Assertion](#prod-annexB-Assertion)\[+UnicodeMode, ?UnicodeSetsMode, ?NamedCaptureGroups\] \[+UnicodeMode\] [Atom](#prod-Atom)\[+UnicodeMode, ?UnicodeSetsMode, ?NamedCaptureGroups\] [Quantifier](#prod-Quantifier) \[+UnicodeMode\] [Atom](#prod-Atom)\[+UnicodeMode, ?UnicodeSetsMode, ?NamedCaptureGroups\] \[~UnicodeMode\] [QuantifiableAssertion](#prod-annexB-QuantifiableAssertion)\[?NamedCaptureGroups\] [Quantifier](#prod-Quantifier) \[~UnicodeMode\] [Assertion](#prod-annexB-Assertion)\[~UnicodeMode, ~UnicodeSetsMode, ?NamedCaptureGroups\] \[~UnicodeMode\] [ExtendedAtom](#prod-annexB-ExtendedAtom)\[?NamedCaptureGroups\] [Quantifier](#prod-Quantifier) \[~UnicodeMode\] [ExtendedAtom](#prod-annexB-ExtendedAtom)\[?NamedCaptureGroups\] [Assertion](#prod-annexB-Assertion)\[UnicodeMode, UnicodeSetsMode, NamedCaptureGroups\] :: ^ \$ \b \B \[+UnicodeMode\] (?= [Disjunction](#prod-Disjunction)\[+UnicodeMode, ?UnicodeSetsMode, ?NamedCaptureGroups\] ) \[+UnicodeMode\] (?! [Disjunction](#prod-Disjunction)\[+UnicodeMode, ?UnicodeSetsMode, ?NamedCaptureGroups\] ) \[~UnicodeMode\] [QuantifiableAssertion](#prod-annexB-QuantifiableAssertion)\[?NamedCaptureGroups\] (?\<= [Disjunction](#prod-Disjunction)\[?UnicodeMode, ?UnicodeSetsMode, ?NamedCaptureGroups\] ) (?\<! [Disjunction](#prod-Disjunction)\[?UnicodeMode, ?UnicodeSetsMode, ?NamedCaptureGroups\] ) [QuantifiableAssertion](#prod-annexB-QuantifiableAssertion)\[NamedCaptureGroups\] :: (?= [Disjunction](#prod-Disjunction)\[~UnicodeMode, ~UnicodeSetsMode, ?NamedCaptureGroups\] ) (?! [Disjunction](#prod-Disjunction)\[~UnicodeMode, ~UnicodeSetsMode, ?NamedCaptureGroups\] ) [ExtendedAtom](#prod-annexB-ExtendedAtom)\[NamedCaptureGroups\] :: . \\ [AtomEscape](#prod-annexB-AtomEscape)\[~UnicodeMode, ?NamedCaptureGroups\] \\ \[lookahead = c\] [CharacterClass](#prod-CharacterClass)\[~UnicodeMode, ~UnicodeSetsMode\] ( [GroupSpecifier](#prod-GroupSpecifier)\[~UnicodeMode\]opt [Disjunction](#prod-Disjunction)\[~UnicodeMode, ~UnicodeSetsMode, ?NamedCaptureGroups\] ) (? [RegularExpressionModifiers](#prod-RegularExpressionModifiers) : [Disjunction](#prod-Disjunction)\[~UnicodeMode, ~UnicodeSetsMode, ?NamedCaptureGroups\] ) (? [RegularExpressionModifiers](#prod-RegularExpressionModifiers) - [RegularExpressionModifiers](#prod-RegularExpressionModifiers) : [Disjunction](#prod-Disjunction)\[~UnicodeMode, ~UnicodeSetsMode, ?NamedCaptureGroups\] ) [InvalidBracedQuantifier](#prod-annexB-InvalidBracedQuantifier) [ExtendedPatternCharacter](#prod-annexB-ExtendedPatternCharacter) [InvalidBracedQuantifier](#prod-annexB-InvalidBracedQuantifier) :: { [DecimalDigits](#prod-DecimalDigits)\[~Sep\] } { [DecimalDigits](#prod-DecimalDigits)\[~Sep\] ,} { [DecimalDigits](#prod-DecimalDigits)\[~Sep\] , [DecimalDigits](#prod-DecimalDigits)\[~Sep\] } [ExtendedPatternCharacter](#prod-annexB-ExtendedPatternCharacter) :: [SourceCharacter](#prod-SourceCharacter) but not one of ^ \$ \\ . \* + ? ( ) \[ \| [AtomEscape](#prod-annexB-AtomEscape)\[UnicodeMode, NamedCaptureGroups\] :: \[+UnicodeMode\] [DecimalEscape](#prod-DecimalEscape) \[~UnicodeMode\] [DecimalEscape](#prod-DecimalEscape) but only if the [CapturingGroupNumber](#sec-patterns-static-semantics-capturing-group-number) of [DecimalEscape](#prod-DecimalEscape) is ≤ [CountLeftCapturingParensWithin](#sec-countleftcapturingparenswithin)(the [Pattern](#prod-Pattern) containing [DecimalEscape](#prod-DecimalEscape)) [CharacterClassEscape](#prod-CharacterClassEscape)\[?UnicodeMode\] [CharacterEscape](#prod-annexB-CharacterEscape)\[?UnicodeMode, ?NamedCaptureGroups\] \[+NamedCaptureGroups\] k [GroupName](#prod-GroupName)\[?UnicodeMode\] [CharacterEscape](#prod-annexB-CharacterEscape)\[UnicodeMode, NamedCaptureGroups\] :: [ControlEscape](#prod-ControlEscape) c [AsciiLetter](#prod-AsciiLetter) 0 \[lookahead ∉ [DecimalDigit](#prod-DecimalDigit)\] [HexEscapeSequence](#prod-HexEscapeSequence) [RegExpUnicodeEscapeSequence](#prod-RegExpUnicodeEscapeSequence)\[?UnicodeMode\] \[~UnicodeMode\] [LegacyOctalEscapeSequence](#prod-LegacyOctalEscapeSequence) [IdentityEscape](#prod-annexB-IdentityEscape)\[?UnicodeMode, ?NamedCaptureGroups\] [IdentityEscape](#prod-annexB-IdentityEscape)\[UnicodeMode, NamedCaptureGroups\] :: \[+UnicodeMode\] [SyntaxCharacter](#prod-SyntaxCharacter) \[+UnicodeMode\] / \[~UnicodeMode\] [SourceCharacterIdentityEscape](#prod-annexB-SourceCharacterIdentityEscape)\[?NamedCaptureGroups\] [SourceCharacterIdentityEscape](#prod-annexB-SourceCharacterIdentityEscape)\[NamedCaptureGroups\] :: \[~NamedCaptureGroups\] [SourceCharacter](#prod-SourceCharacter) but not c \[+NamedCaptureGroups\] [SourceCharacter](#prod-SourceCharacter) but not one of c or k [ClassAtomNoDash](#prod-annexB-ClassAtomNoDash)\[UnicodeMode, NamedCaptureGroups\] :: [SourceCharacter](#prod-SourceCharacter) but not one of \\ or \] or - \\ [ClassEscape](#prod-annexB-ClassEscape)\[?UnicodeMode, ?NamedCaptureGroups\] \\ \[lookahead = c\] [ClassEscape](#prod-annexB-ClassEscape)\[UnicodeMode, NamedCaptureGroups\] :: b \[+UnicodeMode\] - \[~UnicodeMode\] c [ClassControlLetter](#prod-annexB-ClassControlLetter) [CharacterClassEscape](#prod-CharacterClassEscape)\[?UnicodeMode\] [CharacterEscape](#prod-annexB-CharacterEscape)\[?UnicodeMode, ?NamedCaptureGroups\] [ClassControlLetter](#prod-annexB-ClassControlLetter) :: [DecimalDigit](#prod-DecimalDigit) \_ Note

When the same left-hand sides occurs with both \[+UnicodeMode\] and \[~UnicodeMode\] guards it is to control the disambiguation priority.

#### B.1.2.1 Static Semantics: Early Errors

The semantics of [22.2.1.1](#sec-patterns-static-semantics-early-errors) is extended as follows:

[ExtendedAtom](#prod-annexB-ExtendedAtom) :: [InvalidBracedQuantifier](#prod-annexB-InvalidBracedQuantifier)

- It is a Syntax Error if any source text is matched by this production.

Additionally, the rules for the following productions are modified with the addition of the *highlighted* text:

[NonemptyClassRanges](#prod-NonemptyClassRanges) :: [ClassAtom](#prod-ClassAtom) - [ClassAtom](#prod-ClassAtom) [ClassContents](#prod-ClassContents)

- It is a Syntax Error if [IsCharacterClass](#sec-patterns-static-semantics-is-character-class) of the first [ClassAtom](#prod-ClassAtom) is true or [IsCharacterClass](#sec-patterns-static-semantics-is-character-class) of the second [ClassAtom](#prod-ClassAtom) is true *and this production has a _(\[UnicodeMode\]) parameter*.
- It is a Syntax Error if [IsCharacterClass](#sec-patterns-static-semantics-is-character-class) of the first [ClassAtom](#prod-ClassAtom) is false, [IsCharacterClass](#sec-patterns-static-semantics-is-character-class) of the second [ClassAtom](#prod-ClassAtom) is false, and the [CharacterValue](#sec-patterns-static-semantics-character-value) of the first [ClassAtom](#prod-ClassAtom) is strictly greater than the [CharacterValue](#sec-patterns-static-semantics-character-value) of the second [ClassAtom](#prod-ClassAtom).

[NonemptyClassRangesNoDash](#prod-NonemptyClassRangesNoDash) :: [ClassAtomNoDash](#prod-annexB-ClassAtomNoDash) - [ClassAtom](#prod-ClassAtom) [ClassContents](#prod-ClassContents)

- It is a Syntax Error if [IsCharacterClass](#sec-patterns-static-semantics-is-character-class) of [ClassAtomNoDash](#prod-annexB-ClassAtomNoDash) is true or [IsCharacterClass](#sec-patterns-static-semantics-is-character-class) of [ClassAtom](#prod-ClassAtom) is true *and this production has a _(\[UnicodeMode\]) parameter*.
- It is a Syntax Error if [IsCharacterClass](#sec-patterns-static-semantics-is-character-class) of [ClassAtomNoDash](#prod-annexB-ClassAtomNoDash) is false, [IsCharacterClass](#sec-patterns-static-semantics-is-character-class) of [ClassAtom](#prod-ClassAtom) is false, and the [CharacterValue](#sec-patterns-static-semantics-character-value) of [ClassAtomNoDash](#prod-annexB-ClassAtomNoDash) is strictly greater than the [CharacterValue](#sec-patterns-static-semantics-character-value) of [ClassAtom](#prod-ClassAtom).

#### B.1.2.2 Static Semantics: CountLeftCapturingParensWithin and CountLeftCapturingParensBefore

In the definitions of [CountLeftCapturingParensWithin](#sec-countleftcapturingparenswithin) and [CountLeftCapturingParensBefore](#sec-countleftcapturingparensbefore), references to “ [Atom](#prod-Atom) :: ( [GroupSpecifier](#prod-GroupSpecifier)opt [Disjunction](#prod-Disjunction) ) ” are to be interpreted as meaning “ [Atom](#prod-Atom) :: ( [GroupSpecifier](#prod-GroupSpecifier)opt [Disjunction](#prod-Disjunction) ) ” or “ [ExtendedAtom](#prod-annexB-ExtendedAtom) :: ( [GroupSpecifier](#prod-GroupSpecifier)opt [Disjunction](#prod-Disjunction) ) ”.

#### B.1.2.3 Static Semantics: IsCharacterClass

The semantics of [22.2.1.6](#sec-patterns-static-semantics-is-character-class) is extended as follows:

[ClassAtomNoDash](#prod-annexB-ClassAtomNoDash) :: \\ \[lookahead = c\]

1.  Return false.

#### B.1.2.4 Static Semantics: CharacterValue

The semantics of [22.2.1.7](#sec-patterns-static-semantics-character-value) is extended as follows:

[ClassAtomNoDash](#prod-annexB-ClassAtomNoDash) :: \\ \[lookahead = c\]

1.  Return the numeric value of U+005C (REVERSE SOLIDUS).

[ClassEscape](#prod-annexB-ClassEscape) :: c [ClassControlLetter](#prod-annexB-ClassControlLetter)

1.  Let `ch` be the code point matched by [ClassControlLetter](#prod-annexB-ClassControlLetter).
2.  Let `i` be the numeric value of `ch`.
3.  Return the remainder of dividing `i` by 32.

[CharacterEscape](#prod-annexB-CharacterEscape) :: [LegacyOctalEscapeSequence](#prod-LegacyOctalEscapeSequence)

1.  Return the MV of [LegacyOctalEscapeSequence](#prod-LegacyOctalEscapeSequence) (see [12.9.4.3](#sec-string-literals-static-semantics-mv)).

#### B.1.2.5 Runtime Semantics: CompileSubpattern

The semantics of [CompileSubpattern](#sec-compilesubpattern) is extended as follows:

The rule for [Term](#prod-annexB-Term) :: [QuantifiableAssertion](#prod-annexB-QuantifiableAssertion) [Quantifier](#prod-Quantifier) is the same as for [Term](#prod-annexB-Term) :: [Atom](#prod-Atom) [Quantifier](#prod-Quantifier) but with [QuantifiableAssertion](#prod-annexB-QuantifiableAssertion) substituted for [Atom](#prod-Atom).

The rule for [Term](#prod-annexB-Term) :: [ExtendedAtom](#prod-annexB-ExtendedAtom) [Quantifier](#prod-Quantifier) is the same as for [Term](#prod-annexB-Term) :: [Atom](#prod-Atom) [Quantifier](#prod-Quantifier) but with [ExtendedAtom](#prod-annexB-ExtendedAtom) substituted for [Atom](#prod-Atom).

The rule for [Term](#prod-annexB-Term) :: [ExtendedAtom](#prod-annexB-ExtendedAtom) is the same as for [Term](#prod-annexB-Term) :: [Atom](#prod-Atom) but with [ExtendedAtom](#prod-annexB-ExtendedAtom) substituted for [Atom](#prod-Atom).

#### B.1.2.6 Runtime Semantics: CompileAssertion

[CompileAssertion](#sec-compileassertion) rules for the [Assertion](#prod-annexB-Assertion) :: (?= [Disjunction](#prod-Disjunction) ) and [Assertion](#prod-annexB-Assertion) :: (?! [Disjunction](#prod-Disjunction) ) productions are also used for the [QuantifiableAssertion](#prod-annexB-QuantifiableAssertion) productions, but with [QuantifiableAssertion](#prod-annexB-QuantifiableAssertion) substituted for [Assertion](#prod-annexB-Assertion).

#### B.1.2.7 Runtime Semantics: CompileAtom

[CompileAtom](#sec-compileatom) rules for the [Atom](#prod-Atom) productions except for [Atom](#prod-Atom) :: [PatternCharacter](#prod-PatternCharacter) are also used for the [ExtendedAtom](#prod-annexB-ExtendedAtom) productions, but with [ExtendedAtom](#prod-annexB-ExtendedAtom) substituted for [Atom](#prod-Atom). The following rules, with parameter `direction`, are also added:

[ExtendedAtom](#prod-annexB-ExtendedAtom) :: \\ \[lookahead = c\]

1.  Let `A` be the [CharSet](#pattern-charset) containing the single character `\` U+005C (REVERSE SOLIDUS).
2.  Return [CharacterSetMatcher](#sec-runtime-semantics-charactersetmatcher-abstract-operation)(`rer`, `A`, false, `direction`).

[ExtendedAtom](#prod-annexB-ExtendedAtom) :: [ExtendedPatternCharacter](#prod-annexB-ExtendedPatternCharacter)

1.  Let `ch` be the character represented by [ExtendedPatternCharacter](#prod-annexB-ExtendedPatternCharacter).
2.  Let `A` be a one-element [CharSet](#pattern-charset) containing the character `ch`.
3.  Return [CharacterSetMatcher](#sec-runtime-semantics-charactersetmatcher-abstract-operation)(`rer`, `A`, false, `direction`).

#### B.1.2.8 Runtime Semantics: CompileToCharSet

The semantics of [22.2.2.9](#sec-compiletocharset) is extended as follows:

The following two rules replace the corresponding rules of [CompileToCharSet](#sec-compiletocharset).

[NonemptyClassRanges](#prod-NonemptyClassRanges) :: [ClassAtom](#prod-ClassAtom) - [ClassAtom](#prod-ClassAtom) [ClassContents](#prod-ClassContents)

1.  Let `A` be [CompileToCharSet](#sec-compiletocharset) of the first [ClassAtom](#prod-ClassAtom) with argument `rer`.
2.  Let `B` be [CompileToCharSet](#sec-compiletocharset) of the second [ClassAtom](#prod-ClassAtom) with argument `rer`.
3.  Let `C` be [CompileToCharSet](#sec-compiletocharset) of [ClassContents](#prod-ClassContents) with argument `rer`.
4.  Let `D` be [CharacterRangeOrUnion](#sec-runtime-semantics-characterrangeorunion-abstract-operation)(`rer`, `A`, `B`).
5.  Return the union of `D` and `C`.

[NonemptyClassRangesNoDash](#prod-NonemptyClassRangesNoDash) :: [ClassAtomNoDash](#prod-annexB-ClassAtomNoDash) - [ClassAtom](#prod-ClassAtom) [ClassContents](#prod-ClassContents)

1.  Let `A` be [CompileToCharSet](#sec-compiletocharset) of [ClassAtomNoDash](#prod-annexB-ClassAtomNoDash) with argument `rer`.
2.  Let `B` be [CompileToCharSet](#sec-compiletocharset) of [ClassAtom](#prod-ClassAtom) with argument `rer`.
3.  Let `C` be [CompileToCharSet](#sec-compiletocharset) of [ClassContents](#prod-ClassContents) with argument `rer`.
4.  Let `D` be [CharacterRangeOrUnion](#sec-runtime-semantics-characterrangeorunion-abstract-operation)(`rer`, `A`, `B`).
5.  Return the union of `D` and `C`.

In addition, the following rules are added to [CompileToCharSet](#sec-compiletocharset).

[ClassEscape](#prod-annexB-ClassEscape) :: c [ClassControlLetter](#prod-annexB-ClassControlLetter)

1.  Let `cv` be the [CharacterValue](#sec-patterns-static-semantics-character-value) of this [ClassEscape](#prod-annexB-ClassEscape).
2.  Let `c` be the character whose character value is `cv`.
3.  Return the [CharSet](#pattern-charset) containing the single character `c`.

[ClassAtomNoDash](#prod-annexB-ClassAtomNoDash) :: \\ \[lookahead = c\]

1.  Return the [CharSet](#pattern-charset) containing the single character `\` U+005C (REVERSE SOLIDUS).

Note

This production can only be reached from the sequence `\c` within a character class where it is not followed by an acceptable control character.

##### B.1.2.8.1 CharacterRangeOrUnion ( `rer`, `A`, `B` )

The abstract operation CharacterRangeOrUnion takes arguments `rer` (a [RegExp Record](#sec-regexp-records)), `A` (a [CharSet](#pattern-charset)), and `B` (a [CharSet](#pattern-charset)) and returns a [CharSet](#pattern-charset). It performs the following steps when called:

1.  If [HasEitherUnicodeFlag](#sec-runtime-semantics-haseitherunicodeflag-abstract-operation)(`rer`) is false, then
    1.  If `A` does not contain exactly one character or `B` does not contain exactly one character, then
        1.  Let `C` be the [CharSet](#pattern-charset) containing the single character `-` U+002D (HYPHEN-MINUS).
        2.  Return the union of [CharSets](#pattern-charset) `A`, `B` and `C`.
2.  Return [CharacterRange](#sec-runtime-semantics-characterrange-abstract-operation)(`A`, `B`).

#### B.1.2.9 Static Semantics: ParsePattern ( `patternText`, `u`, `v` )

The semantics of [22.2.3.4](#sec-parsepattern) is extended as follows:

The abstract operation [ParsePattern](#sec-parsepattern) takes arguments `patternText` (a sequence of Unicode code points), `u` (a Boolean), and `v` (a Boolean). It performs the following steps when called:

1.  If `v` is true and `u` is true, then
    1.  Let `parseResult` be a [List](#sec-list-and-record-specification-type) containing one or more SyntaxError objects.
2.  Else if `v` is true, then
    1.  Let `parseResult` be [ParseText](#sec-parsetext)(`patternText`, [Pattern](#prod-Pattern)\[+UnicodeMode, +UnicodeSetsMode, +NamedCaptureGroups\]).
3.  Else if `u` is true, then
    1.  Let `parseResult` be [ParseText](#sec-parsetext)(`patternText`, [Pattern](#prod-Pattern)\[+UnicodeMode, ~UnicodeSetsMode, +NamedCaptureGroups\]).
4.  Else,
    1.  Let `parseResult` be [ParseText](#sec-parsetext)(`patternText`, [Pattern](#prod-Pattern)\[~UnicodeMode, ~UnicodeSetsMode, ~NamedCaptureGroups\]).
    2.  If `parseResult` is a [Parse Node](#sec-syntactic-grammar) and `parseResult` contains a [GroupName](#prod-GroupName), then
        1.  Set `parseResult` to [ParseText](#sec-parsetext)(`patternText`, [Pattern](#prod-Pattern)\[~UnicodeMode, ~UnicodeSetsMode, +NamedCaptureGroups\]).
5.  Return `parseResult`.

## B.2 Additional Built-in Properties

When the ECMAScript [host](#host) is a web browser the following additional properties of the standard built-in objects are defined.

### B.2.1 Additional Properties of the Global Object

The entries in [Table 100](#table-additional-well-known-intrinsic-objects) are added to [Table 6](#table-well-known-intrinsic-objects).

| Intrinsic Name | Global Name | ECMAScript Language Association |
|----|----|----|
| [%escape%](#sec-escape-string) | `escape` | The `escape` function ([B.2.1.1](#sec-escape-string)) |
| [%unescape%](#sec-unescape-string) | `unescape` | The `unescape` function ([B.2.1.2](#sec-unescape-string)) |

Table 100: Additional Well-known Intrinsic Objects

#### B.2.1.1 escape ( `string` )

This function is a property of the [global object](#sec-global-object). It computes a new version of a String value in which certain code units have been replaced by a hexadecimal escape sequence.

When replacing a code unit of numeric value less than or equal to 0x00FF, a two-digit escape sequence of the form `%``xx` is used. When replacing a code unit of numeric value strictly greater than 0x00FF, a four-digit escape sequence of the form `%u``xxxx` is used.

It is the %escape% intrinsic object.

It performs the following steps when called:

1.  Set `string` to ? [ToString](#sec-tostring)(`string`).
2.  Let `len` be the length of `string`.
3.  Let `R` be the empty String.
4.  Let `unescapedSet` be the [string-concatenation](#string-concatenation) of [the ASCII word characters](#ASCII-word-characters) and "@\*+-./".
5.  Let `k` be 0.
6.  Repeat, while `k` \< `len`,
    1.  Let `C` be the code unit at index `k` within `string`.
    2.  If `unescapedSet` contains `C`, then
        1.  Let `S` be `C`.
    3.  Else,
        1.  Let `n` be the numeric value of `C`.
        2.  If `n` \< 256, then
            1.  Let `hex` be the String representation of `n`, formatted as an uppercase hexadecimal number.
            2.  Let `S` be the [string-concatenation](#string-concatenation) of "%" and [StringPad](#sec-stringpad)(`hex`, 2, "0", start).
        3.  Else,
            1.  Let `hex` be the String representation of `n`, formatted as an uppercase hexadecimal number.
            2.  Let `S` be the [string-concatenation](#string-concatenation) of "%u" and [StringPad](#sec-stringpad)(`hex`, 4, "0", start).
    4.  Set `R` to the [string-concatenation](#string-concatenation) of `R` and `S`.
    5.  Set `k` to `k` + 1.
7.  Return `R`.

Note

The encoding is partly based on the encoding described in RFC 1738, but the entire encoding specified in this standard is described above without regard to the contents of RFC 1738. This encoding does not reflect changes to RFC 1738 made by RFC 3986.

#### B.2.1.2 unescape ( `string` )

This function is a property of the [global object](#sec-global-object). It computes a new version of a String value in which each escape sequence of the sort that might be introduced by the `escape` function is replaced with the code unit that it represents.

It is the %unescape% intrinsic object.

It performs the following steps when called:

1.  Set `string` to ? [ToString](#sec-tostring)(`string`).
2.  Let `len` be the length of `string`.
3.  Let `R` be the empty String.
4.  Let `k` be 0.
5.  Repeat, while `k` \< `len`,
    1.  Let `C` be the code unit at index `k` within `string`.
    2.  If `C` is the code unit 0x0025 (PERCENT SIGN), then
        1.  Let `hexDigits` be the empty String.
        2.  Let `optionalAdvance` be 0.
        3.  If `k` + 5 \< `len` and the code unit at index `k` + 1 within `string` is the code unit 0x0075 (LATIN SMALL LETTER U), then
            1.  Set `hexDigits` to the [substring](#substring) of `string` from `k` + 2 to `k` + 6.
            2.  Set `optionalAdvance` to 5.
        4.  Else if `k` + 3 ≤ `len`, then
            1.  Set `hexDigits` to the [substring](#substring) of `string` from `k` + 1 to `k` + 3.
            2.  Set `optionalAdvance` to 2.
        5.  Let `parseResult` be [ParseText](#sec-parsetext)(`hexDigits`, [HexDigits](#prod-HexDigits)\[~Sep\]).
        6.  If `parseResult` is a [Parse Node](#sec-syntactic-grammar), then
            1.  Let `n` be the MV of `parseResult`.
            2.  Set `C` to the code unit whose numeric value is `n`.
            3.  Set `k` to `k` + `optionalAdvance`.
    3.  Set `R` to the [string-concatenation](#string-concatenation) of `R` and `C`.
    4.  Set `k` to `k` + 1.
6.  Return `R`.

### B.2.2 Additional Properties of the String.prototype Object

#### B.2.2.1 String.prototype.substr ( `start`, `length` )

This method returns a substring of the result of converting the this value to a String, starting from index `start` and running for `length` code units (or through the end of the String if `length` is undefined). If `start` is negative, it is treated as `sourceLength` + `start` where `sourceLength` is the length of the String. The result [is a String](#sec-ecmascript-language-types-string-type) value, not a String object.

It performs the following steps when called:

1.  Let `O` be ? [RequireObjectCoercible](#sec-requireobjectcoercible)(this value).
2.  Let `S` be ? [ToString](#sec-tostring)(`O`).
3.  Let `size` be the length of `S`.
4.  Let `intStart` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`start`).
5.  If `intStart` = -∞, set `intStart` to 0.
6.  Else if `intStart` \< 0, set `intStart` to [max](#eqn-max)(`size` + `intStart`, 0).
7.  Else, set `intStart` to [min](#eqn-min)(`intStart`, `size`).
8.  If `length` is undefined, let `intLength` be `size`; otherwise let `intLength` be ? [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`length`).
9.  Set `intLength` to the result of [clamping](#clamping) `intLength` between 0 and `size`.
10. Let `intEnd` be [min](#eqn-min)(`intStart` + `intLength`, `size`).
11. Return the [substring](#substring) of `S` from `intStart` to `intEnd`.

Note

This method is intentionally generic; it does not require that its this value be a String object. Therefore it can be transferred to other kinds of objects for use as a method.

#### B.2.2.2 String.prototype.anchor ( `name` )

This method performs the following steps when called:

1.  Let `S` be the this value.
2.  Return ? [CreateHTML](#sec-createhtml)(`S`, "a", "name", `name`).

##### B.2.2.2.1 CreateHTML ( `string`, `tag`, `attribute`, `value` )

The abstract operation CreateHTML takes arguments `string` (an [ECMAScript language value](#sec-ecmascript-language-types)), `tag` (a String), `attribute` (a String), and `value` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a String or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `str` be ? [RequireObjectCoercible](#sec-requireobjectcoercible)(`string`).
2.  Let `S` be ? [ToString](#sec-tostring)(`str`).
3.  Let `p1` be the [string-concatenation](#string-concatenation) of "\<" and `tag`.
4.  If `attribute` is not the empty String, then
    1.  Let `V` be ? [ToString](#sec-tostring)(`value`).
    2.  Let `escapedV` be the String value that is the same as `V` except that each occurrence of the code unit 0x0022 (QUOTATION MARK) in `V` has been replaced with the six code unit sequence "&quot;".
    3.  Set `p1` to the [string-concatenation](#string-concatenation) of:
        - `p1`
        - the code unit 0x0020 (SPACE)
        - `attribute`
        - the code unit 0x003D (EQUALS SIGN)
        - the code unit 0x0022 (QUOTATION MARK)
        - `escapedV`
        - the code unit 0x0022 (QUOTATION MARK)
5.  Let `p2` be the [string-concatenation](#string-concatenation) of `p1` and "\>".
6.  Let `p3` be the [string-concatenation](#string-concatenation) of `p2` and `S`.
7.  Let `p4` be the [string-concatenation](#string-concatenation) of `p3`, "\</", `tag`, and "\>".
8.  Return `p4`.

#### B.2.2.3 String.prototype.big ( )

This method performs the following steps when called:

1.  Let `S` be the this value.
2.  Return ? [CreateHTML](#sec-createhtml)(`S`, "big", "", "").

#### B.2.2.4 String.prototype.blink ( )

This method performs the following steps when called:

1.  Let `S` be the this value.
2.  Return ? [CreateHTML](#sec-createhtml)(`S`, "blink", "", "").

#### B.2.2.5 String.prototype.bold ( )

This method performs the following steps when called:

1.  Let `S` be the this value.
2.  Return ? [CreateHTML](#sec-createhtml)(`S`, "b", "", "").

#### B.2.2.6 String.prototype.fixed ( )

This method performs the following steps when called:

1.  Let `S` be the this value.
2.  Return ? [CreateHTML](#sec-createhtml)(`S`, "tt", "", "").

#### B.2.2.7 String.prototype.fontcolor ( `colour` )

This method performs the following steps when called:

1.  Let `S` be the this value.
2.  Return ? [CreateHTML](#sec-createhtml)(`S`, "font", "color", `colour`).

#### B.2.2.8 String.prototype.fontsize ( `size` )

This method performs the following steps when called:

1.  Let `S` be the this value.
2.  Return ? [CreateHTML](#sec-createhtml)(`S`, "font", "size", `size`).

#### B.2.2.9 String.prototype.italics ( )

This method performs the following steps when called:

1.  Let `S` be the this value.
2.  Return ? [CreateHTML](#sec-createhtml)(`S`, "i", "", "").

#### B.2.2.10 String.prototype.link ( `url` )

This method performs the following steps when called:

1.  Let `S` be the this value.
2.  Return ? [CreateHTML](#sec-createhtml)(`S`, "a", "href", `url`).

#### B.2.2.11 String.prototype.small ( )

This method performs the following steps when called:

1.  Let `S` be the this value.
2.  Return ? [CreateHTML](#sec-createhtml)(`S`, "small", "", "").

#### B.2.2.12 String.prototype.strike ( )

This method performs the following steps when called:

1.  Let `S` be the this value.
2.  Return ? [CreateHTML](#sec-createhtml)(`S`, "strike", "", "").

#### B.2.2.13 String.prototype.sub ( )

This method performs the following steps when called:

1.  Let `S` be the this value.
2.  Return ? [CreateHTML](#sec-createhtml)(`S`, "sub", "", "").

#### B.2.2.14 String.prototype.sup ( )

This method performs the following steps when called:

1.  Let `S` be the this value.
2.  Return ? [CreateHTML](#sec-createhtml)(`S`, "sup", "", "").

#### B.2.2.15 String.prototype.trimLeft ( )

Note

The property "trimStart" is preferred. The "trimLeft" property is provided principally for compatibility with old code. It is recommended that the "trimStart" property be used in new ECMAScript code.

The initial value of the "trimLeft" property is %String.prototype.trimStart%, defined in [22.1.3.34](#sec-string.prototype.trimstart).

#### B.2.2.16 String.prototype.trimRight ( )

Note

The property "trimEnd" is preferred. The "trimRight" property is provided principally for compatibility with old code. It is recommended that the "trimEnd" property be used in new ECMAScript code.

The initial value of the "trimRight" property is %String.prototype.trimEnd%, defined in [22.1.3.33](#sec-string.prototype.trimend).

### B.2.3 Additional Properties of the Date.prototype Object

#### B.2.3.1 Date.prototype.getYear ( )

Note

The `getFullYear` method is preferred for nearly all purposes, because it avoids the “year 2000 problem.”

This method performs the following steps when called:

1.  Let `dateObject` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`dateObject`, `[[DateValue]]`).
3.  Let `t` be `dateObject`.`[[DateValue]]`.
4.  If `t` is NaN, return NaN.
5.  Return [YearFromTime](#sec-yearfromtime)([LocalTime](#sec-localtime)(`t`)) - 1900_(𝔽).

#### B.2.3.2 Date.prototype.setYear ( `year` )

Note

The `setFullYear` method is preferred for nearly all purposes, because it avoids the “year 2000 problem.”

This method performs the following steps when called:

1.  Let `dateObject` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`dateObject`, `[[DateValue]]`).
3.  Let `t` be `dateObject`.`[[DateValue]]`.
4.  Let `y` be ? [ToNumber](#sec-tonumber)(`year`).
5.  If `t` is NaN, set `t` to +0_(𝔽); otherwise, set `t` to [LocalTime](#sec-localtime)(`t`).
6.  Let `yyyy` be [MakeFullYear](#sec-makefullyear)(`y`).
7.  Let `d` be [MakeDay](#sec-makeday)(`yyyy`, [MonthFromTime](#sec-monthfromtime)(`t`), [DateFromTime](#sec-datefromtime)(`t`)).
8.  Let `date` be [MakeDate](#sec-makedate)(`d`, [TimeWithinDay](#sec-timewithinday)(`t`)).
9.  Let `u` be [TimeClip](#sec-timeclip)([UTC](#sec-utc-t)(`date`)).
10. Set `dateObject`.`[[DateValue]]` to `u`.
11. Return `u`.

#### B.2.3.3 Date.prototype.toGMTString ( )

Note

The `toUTCString` method is preferred. This method is provided principally for compatibility with old code.

The initial value of the "toGMTString" property is %Date.prototype.toUTCString%, defined in [21.4.4.43](#sec-date.prototype.toutcstring).

### B.2.4 Additional Properties of the RegExp.prototype Object

#### B.2.4.1 RegExp.prototype.compile ( `pattern`, `flags` )

This method performs the following steps when called:

1.  Let `O` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`O`, `[[RegExpMatcher]]`).
3.  If `pattern` [is an Object](#sec-object-type) and `pattern` has a `[[RegExpMatcher]]` internal slot, then
    1.  If `flags` is not undefined, throw a TypeError exception.
    2.  Let `P` be `pattern`.`[[OriginalSource]]`.
    3.  Let `F` be `pattern`.`[[OriginalFlags]]`.
4.  Else,
    1.  Let `P` be `pattern`.
    2.  Let `F` be `flags`.
5.  Return ? [RegExpInitialize](#sec-regexpinitialize)(`O`, `P`, `F`).

Note

This method completely reinitializes the this value RegExp with a new pattern and flags. An implementation may interpret use of this method as an assertion that the resulting RegExp object will be used multiple times and hence is a candidate for extra optimization.

## B.3 Other Additional Features

### B.3.1 Labelled Function Declarations

Prior to ECMAScript 2015, the specification of [LabelledStatement](#prod-LabelledStatement) did not allow for the association of a statement label with a [FunctionDeclaration](#prod-FunctionDeclaration). However, a labelled [FunctionDeclaration](#prod-FunctionDeclaration) was an allowable extension for [non-strict code](#non-strict-code) and most browser-hosted ECMAScript implementations supported that extension. In ECMAScript 2015 and later, the grammar production for [LabelledStatement](#prod-LabelledStatement) permits use of [FunctionDeclaration](#prod-FunctionDeclaration) as a [LabelledItem](#prod-LabelledItem) but [14.13.1](#sec-labelled-statements-static-semantics-early-errors) includes an Early Error rule that produces a Syntax Error if that occurs. That rule is modified with the addition of the *highlighted* text:

[LabelledItem](#prod-LabelledItem) : [FunctionDeclaration](#prod-FunctionDeclaration)

- It is a Syntax Error if any source text *that is [strict mode code](#sec-strict-mode-code)* is matched by this production.

Note

The [early error](#early-error) rules for [WithStatement](#prod-WithStatement), [IfStatement](#prod-annexB-IfStatement), and [IterationStatement](#prod-IterationStatement) prevent these statements from containing a labelled [FunctionDeclaration](#prod-FunctionDeclaration) in [non-strict code](#non-strict-code).

### B.3.2 Block-Level Function Declarations Web Legacy Compatibility Semantics

Prior to ECMAScript 2015, the ECMAScript specification did not define the occurrence of a [FunctionDeclaration](#prod-FunctionDeclaration) as an element of a [Block](#prod-Block) statement's [StatementList](#prod-StatementList). However, support for that form of [FunctionDeclaration](#prod-FunctionDeclaration) was an allowable extension and most browser-hosted ECMAScript implementations permitted them. Unfortunately, the semantics of such declarations differ among those implementations. Because of these semantic differences, existing web [ECMAScript source text](#sec-source-text) that uses [Block](#prod-Block) level function declarations is only portable among browser implementations if the usage only depends upon the semantic intersection of all of the browser implementations for such declarations. The following are the use cases that fall within that intersection semantics:

1.  A function is declared and only referenced within a single block.

    - One or more [FunctionDeclaration](#prod-FunctionDeclaration)s whose [BindingIdentifier](#prod-BindingIdentifier) is the name `f` occur within the function code of an enclosing function `g` and that declaration is nested within a [Block](#prod-Block).
    - No other declaration of `f` that is not a `var` declaration occurs within the function code of `g`.
    - All occurrences of `f` as an [IdentifierReference](#prod-IdentifierReference) are within the [StatementList](#prod-StatementList) of the [Block](#prod-Block) containing the declaration of `f`.

2.  A function is declared and possibly used within a single [Block](#prod-Block) but also referenced by an inner function definition that is not contained within that same [Block](#prod-Block).

    - One or more [FunctionDeclaration](#prod-FunctionDeclaration)s whose [BindingIdentifier](#prod-BindingIdentifier) is the name `f` occur within the function code of an enclosing function `g` and that declaration is nested within a [Block](#prod-Block).
    - No other declaration of `f` that is not a `var` declaration occurs within the function code of `g`.
    - There may be occurrences of `f` as an [IdentifierReference](#prod-IdentifierReference) within the [StatementList](#prod-StatementList) of the [Block](#prod-Block) containing the declaration of `f`.
    - There is at least one occurrence of `f` as an [IdentifierReference](#prod-IdentifierReference) within another function `h` that is nested within `g` and no other declaration of `f` shadows the references to `f` from within `h`.
    - All invocations of `h` occur after the declaration of `f` has been evaluated.

3.  A function is declared and possibly used within a single block but also referenced within subsequent blocks.

    - One or more [FunctionDeclaration](#prod-FunctionDeclaration) whose [BindingIdentifier](#prod-BindingIdentifier) is the name `f` occur within the function code of an enclosing function `g` and that declaration is nested within a [Block](#prod-Block).
    - No other declaration of `f` that is not a `var` declaration occurs within the function code of `g`.
    - There may be occurrences of `f` as an [IdentifierReference](#prod-IdentifierReference) within the [StatementList](#prod-StatementList) of the [Block](#prod-Block) containing the declaration of `f`.
    - There is at least one occurrence of `f` as an [IdentifierReference](#prod-IdentifierReference) within the function code of `g` that lexically follows the [Block](#prod-Block) containing the declaration of `f`.

The first use case is interoperable with the semantics of [Block](#prod-Block) level function declarations provided by ECMAScript 2015. Any pre-existing [ECMAScript source text](#sec-source-text) that employs that use case will operate using the Block level function declarations semantics defined by clauses [10](#sec-ordinary-and-exotic-objects-behaviours), [14](#sec-ecmascript-language-statements-and-declarations), and [15](#sec-ecmascript-language-functions-and-classes).

ECMAScript 2015 interoperability for the second and third use cases requires the following extensions to the clause [10](#sec-ordinary-and-exotic-objects-behaviours), clause [15](#sec-ecmascript-language-functions-and-classes), clause [19.2.1](#sec-eval-x) and clause [16.1.7](#sec-globaldeclarationinstantiation) semantics.

If an ECMAScript implementation has a mechanism for reporting diagnostic warning messages, a warning should be produced when code contains a [FunctionDeclaration](#prod-FunctionDeclaration) for which these compatibility semantics are applied and introduce observable differences from non-compatibility semantics. For example, if a var binding is not introduced because its introduction would create an [early error](#early-error), a warning message should not be produced.

#### B.3.2.1 Changes to FunctionDeclarationInstantiation

During [FunctionDeclarationInstantiation](#sec-functiondeclarationinstantiation) the following steps are performed in place of step [29](#step-functiondeclarationinstantiation-web-compat-insertion-point):

29. If `strict` is false, then
    1.  For each [FunctionDeclaration](#prod-FunctionDeclaration) `f` that is directly contained in the [StatementList](#prod-StatementList) of any [Block](#prod-Block), [CaseClause](#prod-CaseClause), or [DefaultClause](#prod-DefaultClause) `x` such that `code` [Contains](#sec-static-semantics-contains) `x` is true, do
        1.  Let `F` be the [StringValue](#sec-static-semantics-stringvalue) of the [BindingIdentifier](#prod-BindingIdentifier) of `f`.
        2.  If replacing the [FunctionDeclaration](#prod-FunctionDeclaration) `f` with a [VariableStatement](#prod-VariableStatement) that has `F` as a [BindingIdentifier](#prod-BindingIdentifier) would not produce any Early Errors for `func` and `parameterNames` does not contain `F`, then
            1.  NOTE: A var binding for `F` is only instantiated here if it is neither a VarDeclaredName, the name of a formal parameter, or another [FunctionDeclaration](#prod-FunctionDeclaration).
            2.  If `instantiatedVarNames` does not contain `F` and `F` is not "arguments", then
                1.  Perform ! `varEnv`.CreateMutableBinding(`F`, false).
                2.  Perform ! `varEnv`.InitializeBinding(`F`, undefined).
                3.  Append `F` to `instantiatedVarNames`.
            3.  When the [FunctionDeclaration](#prod-FunctionDeclaration) `f` is evaluated, perform the following steps in place of the [FunctionDeclaration](#prod-FunctionDeclaration) [Evaluation](#sec-evaluation) algorithm provided in [15.2.6](#sec-function-definitions-runtime-semantics-evaluation):
                1.  Let `fEnv` be the [running execution context](#running-execution-context)'s VariableEnvironment.
                2.  Let `bEnv` be the [running execution context](#running-execution-context)'s LexicalEnvironment.
                3.  Let `fObj` be ! `bEnv`.GetBindingValue(`F`, false).
                4.  Perform ! `fEnv`.SetMutableBinding(`F`, `fObj`, false).
                5.  Return unused.

#### B.3.2.2 Changes to GlobalDeclarationInstantiation

During [GlobalDeclarationInstantiation](#sec-globaldeclarationinstantiation) the following steps are performed in place of step [12](#step-globaldeclarationinstantiation-web-compat-insertion-point):

12. Perform the following steps:
    1.  Let `strict` be [ScriptIsStrict](#sec-scriptisstrict) of `script`.
    2.  If `strict` is false, then
        1.  Let `declaredFunctionOrVarNames` be the [list-concatenation](#list-concatenation) of `declaredFunctionNames` and `declaredVarNames`.
        2.  For each [FunctionDeclaration](#prod-FunctionDeclaration) `f` that is directly contained in the [StatementList](#prod-StatementList) of any [Block](#prod-Block), [CaseClause](#prod-CaseClause), or [DefaultClause](#prod-DefaultClause) `x` such that `script` [Contains](#sec-static-semantics-contains) `x` is true, do
            1.  Let `F` be the [StringValue](#sec-static-semantics-stringvalue) of the [BindingIdentifier](#prod-BindingIdentifier) of `f`.
            2.  If replacing the [FunctionDeclaration](#prod-FunctionDeclaration) `f` with a [VariableStatement](#prod-VariableStatement) that has `F` as a [BindingIdentifier](#prod-BindingIdentifier) would not produce any Early Errors for `script`, then
                1.  If [HasLexicalDeclaration](#sec-haslexicaldeclaration)(`env`, `F`) is false, then
                    1.  Let `fnDefinable` be ? [CanDeclareGlobalVar](#sec-candeclareglobalvar)(`env`, `F`).
                    2.  If `fnDefinable` is true, then
                        1.  NOTE: A var binding for `F` is only instantiated here if it is neither a VarDeclaredName nor the name of another [FunctionDeclaration](#prod-FunctionDeclaration).
                        2.  If `declaredFunctionOrVarNames` does not contain `F`, then
                            1.  Perform ? [CreateGlobalVarBinding](#sec-createglobalvarbinding)(`env`, `F`, false).
                            2.  Append `F` to `declaredFunctionOrVarNames`.
                        3.  When the [FunctionDeclaration](#prod-FunctionDeclaration) `f` is evaluated, perform the following steps in place of the [FunctionDeclaration](#prod-FunctionDeclaration) [Evaluation](#sec-evaluation) algorithm provided in [15.2.6](#sec-function-definitions-runtime-semantics-evaluation):
                            1.  Let `gEnv` be the [running execution context](#running-execution-context)'s VariableEnvironment.
                            2.  Let `bEnv` be the [running execution context](#running-execution-context)'s LexicalEnvironment.
                            3.  Let `fObj` be ! `bEnv`.GetBindingValue(`F`, false).
                            4.  Perform ? `gEnv`.SetMutableBinding(`F`, `fObj`, false).
                            5.  Return unused.

#### B.3.2.3 Changes to EvalDeclarationInstantiation

During [EvalDeclarationInstantiation](#sec-evaldeclarationinstantiation) the following steps are performed in place of step [13](#step-evaldeclarationinstantiation-web-compat-insertion-point):

13. If `strict` is false, then
    1.  Let `declaredFunctionOrVarNames` be the [list-concatenation](#list-concatenation) of `declaredFunctionNames` and `declaredVarNames`.
    2.  For each [FunctionDeclaration](#prod-FunctionDeclaration) `f` that is directly contained in the [StatementList](#prod-StatementList) of any [Block](#prod-Block), [CaseClause](#prod-CaseClause), or [DefaultClause](#prod-DefaultClause) `x` such that `body` [Contains](#sec-static-semantics-contains) `x` is true, do
        1.  Let `F` be the [StringValue](#sec-static-semantics-stringvalue) of the [BindingIdentifier](#prod-BindingIdentifier) of `f`.
        2.  If replacing the [FunctionDeclaration](#prod-FunctionDeclaration) `f` with a [VariableStatement](#prod-VariableStatement) that has `F` as a [BindingIdentifier](#prod-BindingIdentifier) would not produce any Early Errors for `body`, then
            1.  Let `bindingExists` be false.
            2.  Let `thisEnv` be `lexEnv`.
            3.  [Assert](#assert): The following loop will terminate.
            4.  Repeat, while `thisEnv` is not `varEnv`,
                1.  If `thisEnv` [is not an Object](#sec-object-type) [Environment Record](#sec-environment-records), then
                    1.  If ! `thisEnv`.HasBinding(`F`) is true, then
                        1.  Let `bindingExists` be true.
                2.  Set `thisEnv` to `thisEnv`.`[[OuterEnv]]`.
            5.  If `bindingExists` is false and `varEnv` is a [Global Environment Record](#sec-global-environment-records), then
                1.  If [HasLexicalDeclaration](#sec-haslexicaldeclaration)(`varEnv`, `F`) is false, then
                    1.  Let `fnDefinable` be ? [CanDeclareGlobalVar](#sec-candeclareglobalvar)(`varEnv`, `F`).
                2.  Else,
                    1.  Let `fnDefinable` be false.
            6.  Else,
                1.  Let `fnDefinable` be true.
            7.  If `bindingExists` is false and `fnDefinable` is true, then
                1.  If `declaredFunctionOrVarNames` does not contain `F`, then
                    1.  If `varEnv` is a [Global Environment Record](#sec-global-environment-records), then
                        1.  Perform ? [CreateGlobalVarBinding](#sec-createglobalvarbinding)(`varEnv`, `F`, true).
                    2.  Else,
                        1.  Let `bindingExists` be ! `varEnv`.HasBinding(`F`).
                        2.  If `bindingExists` is false, then
                            1.  Perform ! `varEnv`.CreateMutableBinding(`F`, true).
                            2.  Perform ! `varEnv`.InitializeBinding(`F`, undefined).
                    3.  Append `F` to `declaredFunctionOrVarNames`.
                2.  When the [FunctionDeclaration](#prod-FunctionDeclaration) `f` is evaluated, perform the following steps in place of the [FunctionDeclaration](#prod-FunctionDeclaration) [Evaluation](#sec-evaluation) algorithm provided in [15.2.6](#sec-function-definitions-runtime-semantics-evaluation):
                    1.  Let `gEnv` be the [running execution context](#running-execution-context)'s VariableEnvironment.
                    2.  Let `bEnv` be the [running execution context](#running-execution-context)'s LexicalEnvironment.
                    3.  Let `fObj` be ! `bEnv`.GetBindingValue(`F`, false).
                    4.  Perform ? `gEnv`.SetMutableBinding(`F`, `fObj`, false).
                    5.  Return unused.

#### B.3.2.4 Changes to Block Static Semantics: Early Errors

The rules for the following production in [14.2.1](#sec-block-static-semantics-early-errors) are modified with the addition of the *highlighted* text:

[Block](#prod-Block) : { [StatementList](#prod-StatementList) }

- It is a Syntax Error if the [LexicallyDeclaredNames](#sec-static-semantics-lexicallydeclarednames) of [StatementList](#prod-StatementList) contains any duplicate entries*, unless [IsStrict](#sec-isstrict)(this production) is false and the duplicate entries are only bound by FunctionDeclarations*.
- It is a Syntax Error if any element of the [LexicallyDeclaredNames](#sec-static-semantics-lexicallydeclarednames) of [StatementList](#prod-StatementList) also occurs in the [VarDeclaredNames](#sec-static-semantics-vardeclarednames) of [StatementList](#prod-StatementList).

#### B.3.2.5 Changes to `switch` Statement Static Semantics: Early Errors

The rules for the following production in [14.12.1](#sec-switch-statement-static-semantics-early-errors) are modified with the addition of the *highlighted* text:

[SwitchStatement](#prod-SwitchStatement) : switch ( [Expression](#prod-Expression) ) [CaseBlock](#prod-CaseBlock)

- It is a Syntax Error if the [LexicallyDeclaredNames](#sec-static-semantics-lexicallydeclarednames) of [CaseBlock](#prod-CaseBlock) contains any duplicate entries*, unless [IsStrict](#sec-isstrict)(this production) is false and the duplicate entries are only bound by FunctionDeclarations*.
- It is a Syntax Error if any element of the [LexicallyDeclaredNames](#sec-static-semantics-lexicallydeclarednames) of [CaseBlock](#prod-CaseBlock) also occurs in the [VarDeclaredNames](#sec-static-semantics-vardeclarednames) of [CaseBlock](#prod-CaseBlock).

#### B.3.2.6 Changes to BlockDeclarationInstantiation

During [BlockDeclarationInstantiation](#sec-blockdeclarationinstantiation) the following steps are performed in place of step [3.a.ii.1](#step-blockdeclarationinstantiation-createmutablebinding):

1.  If ! `env`.HasBinding(`dn`) is false, then
    1.  Perform ! `env`.CreateMutableBinding(`dn`, false).

During [BlockDeclarationInstantiation](#sec-blockdeclarationinstantiation) the following steps are performed in place of step [3.b.iii](#step-blockdeclarationinstantiation-initializebinding):

3.  Perform the following steps:
    1.  If the binding for `fn` in `env` is an uninitialized binding, then
        1.  Perform ! `env`.InitializeBinding(`fn`, `fo`).
    2.  Else,
        1.  [Assert](#assert): `d` is a [FunctionDeclaration](#prod-FunctionDeclaration).
        2.  Perform ! `env`.SetMutableBinding(`fn`, `fo`, false).

### B.3.3 FunctionDeclarations in IfStatement Statement Clauses

The following augments the [IfStatement](#prod-annexB-IfStatement) production in [14.6](#sec-if-statement):

[IfStatement](#prod-annexB-IfStatement)\[Yield, Await, Return\] : if ( [Expression](#prod-Expression)\[+In, ?Yield, ?Await\] ) [FunctionDeclaration](#prod-FunctionDeclaration)\[?Yield, ?Await, ~Default\] else [Statement](#prod-Statement)\[?Yield, ?Await, ?Return\] if ( [Expression](#prod-Expression)\[+In, ?Yield, ?Await\] ) [Statement](#prod-Statement)\[?Yield, ?Await, ?Return\] else [FunctionDeclaration](#prod-FunctionDeclaration)\[?Yield, ?Await, ~Default\] if ( [Expression](#prod-Expression)\[+In, ?Yield, ?Await\] ) [FunctionDeclaration](#prod-FunctionDeclaration)\[?Yield, ?Await, ~Default\] else [FunctionDeclaration](#prod-FunctionDeclaration)\[?Yield, ?Await, ~Default\] if ( [Expression](#prod-Expression)\[+In, ?Yield, ?Await\] ) [FunctionDeclaration](#prod-FunctionDeclaration)\[?Yield, ?Await, ~Default\] \[lookahead ≠ else\]

This production only applies when parsing [non-strict code](#non-strict-code). [Source text matched by](#sec-algorithm-conventions-syntax-directed-operations) this production is processed as if each matching occurrence of [FunctionDeclaration](#prod-FunctionDeclaration)\[?Yield, ?Await, ~Default\] was the sole [StatementListItem](#prod-StatementListItem) of a [BlockStatement](#prod-BlockStatement) occupying that position in the source text. The semantics of such a synthetic [BlockStatement](#prod-BlockStatement) includes the web legacy compatibility semantics specified in [B.3.2](#sec-block-level-function-declarations-web-legacy-compatibility-semantics).

### B.3.4 VariableStatements in Catch Blocks

The content of subclause [14.15.1](#sec-try-statement-static-semantics-early-errors) is replaced with the following:

[Catch](#prod-Catch) : catch ( [CatchParameter](#prod-CatchParameter) ) [Block](#prod-Block)

- It is a Syntax Error if the [BoundNames](#sec-static-semantics-boundnames) of [CatchParameter](#prod-CatchParameter) contains any duplicate elements.
- It is a Syntax Error if any element of the [BoundNames](#sec-static-semantics-boundnames) of [CatchParameter](#prod-CatchParameter) also occurs in the [LexicallyDeclaredNames](#sec-static-semantics-lexicallydeclarednames) of [Block](#prod-Block).
- It is a Syntax Error if any element of the [BoundNames](#sec-static-semantics-boundnames) of [CatchParameter](#prod-CatchParameter) also occurs in the [VarDeclaredNames](#sec-static-semantics-vardeclarednames) of [Block](#prod-Block) unless [CatchParameter](#prod-CatchParameter) is [CatchParameter](#prod-CatchParameter) : [BindingIdentifier](#prod-BindingIdentifier) .

Note

The [Block](#prod-Block) of a [Catch](#prod-Catch) clause may contain `var` declarations that bind a name that is also bound by the [CatchParameter](#prod-CatchParameter). At runtime, such bindings are instantiated in the VariableDeclarationEnvironment. They do not shadow the same-named bindings introduced by the [CatchParameter](#prod-CatchParameter) and hence the [Initializer](#prod-Initializer) for such `var` declarations will assign to the corresponding catch parameter rather than the `var` binding.

This modified behaviour also applies to `var` and `function` declarations introduced by [direct eval](#sec-function-calls-runtime-semantics-evaluation) calls contained within the [Block](#prod-Block) of a [Catch](#prod-Catch) clause. This change is accomplished by modifying the algorithm of [19.2.1.3](#sec-evaldeclarationinstantiation) as follows:

Step [3.d.i.2.a.i](#step-evaldeclarationinstantiation-throw-duplicate-binding) is replaced by:

1.  If `thisEnv` is not the [Environment Record](#sec-environment-records) for a [Catch](#prod-Catch) clause, throw a SyntaxError exception.

Step [13.b.ii.4.a.i.i](#step-evaldeclarationinstantiation-web-compat-bindingexists) is replaced by:

1.  If `thisEnv` is not the [Environment Record](#sec-environment-records) for a [Catch](#prod-Catch) clause, let `bindingExists` be true.

### B.3.5 Initializers in ForIn Statement Heads

The following augments the [ForInOfStatement](#prod-annexB-ForInOfStatement) production in [14.7.5](#sec-for-in-and-for-of-statements):

[ForInOfStatement](#prod-annexB-ForInOfStatement)\[Yield, Await, Return\] : for ( var [BindingIdentifier](#prod-BindingIdentifier)\[?Yield, ?Await\] [Initializer](#prod-Initializer)\[~In, ?Yield, ?Await\] in [Expression](#prod-Expression)\[+In, ?Yield, ?Await\] ) [Statement](#prod-Statement)\[?Yield, ?Await, ?Return\]

This production only applies when parsing [non-strict code](#non-strict-code).

The [static semantics](#sec-static-semantic-rules) of [ContainsDuplicateLabels](#sec-static-semantics-containsduplicatelabels) in [8.3.1](#sec-static-semantics-containsduplicatelabels) are augmented with the following:

[ForInOfStatement](#prod-annexB-ForInOfStatement) : for ( var [BindingIdentifier](#prod-BindingIdentifier) [Initializer](#prod-Initializer) in [Expression](#prod-Expression) ) [Statement](#prod-Statement)

1.  Return [ContainsDuplicateLabels](#sec-static-semantics-containsduplicatelabels) of [Statement](#prod-Statement) with argument `labelSet`.

The [static semantics](#sec-static-semantic-rules) of [ContainsUndefinedBreakTarget](#sec-static-semantics-containsundefinedbreaktarget) in [8.3.2](#sec-static-semantics-containsundefinedbreaktarget) are augmented with the following:

[ForInOfStatement](#prod-annexB-ForInOfStatement) : for ( var [BindingIdentifier](#prod-BindingIdentifier) [Initializer](#prod-Initializer) in [Expression](#prod-Expression) ) [Statement](#prod-Statement)

1.  Return [ContainsUndefinedBreakTarget](#sec-static-semantics-containsundefinedbreaktarget) of [Statement](#prod-Statement) with argument `labelSet`.

The [static semantics](#sec-static-semantic-rules) of [ContainsUndefinedContinueTarget](#sec-static-semantics-containsundefinedcontinuetarget) in [8.3.3](#sec-static-semantics-containsundefinedcontinuetarget) are augmented with the following:

[ForInOfStatement](#prod-annexB-ForInOfStatement) : for ( var [BindingIdentifier](#prod-BindingIdentifier) [Initializer](#prod-Initializer) in [Expression](#prod-Expression) ) [Statement](#prod-Statement)

1.  Return [ContainsUndefinedContinueTarget](#sec-static-semantics-containsundefinedcontinuetarget) of [Statement](#prod-Statement) with arguments `iterationSet` and « ».

The [static semantics](#sec-static-semantic-rules) of [IsDestructuring](#sec-static-semantics-isdestructuring) in [14.7.5.2](#sec-static-semantics-isdestructuring) are augmented with the following:

[BindingIdentifier](#prod-BindingIdentifier) : [Identifier](#prod-Identifier) yield await

1.  Return false.

The [static semantics](#sec-static-semantic-rules) of [VarDeclaredNames](#sec-static-semantics-vardeclarednames) in [8.2.6](#sec-static-semantics-vardeclarednames) are augmented with the following:

[ForInOfStatement](#prod-annexB-ForInOfStatement) : for ( var [BindingIdentifier](#prod-BindingIdentifier) [Initializer](#prod-Initializer) in [Expression](#prod-Expression) ) [Statement](#prod-Statement)

1.  Let `names1` be the [BoundNames](#sec-static-semantics-boundnames) of [BindingIdentifier](#prod-BindingIdentifier).
2.  Let `names2` be the [VarDeclaredNames](#sec-static-semantics-vardeclarednames) of [Statement](#prod-Statement).
3.  Return the [list-concatenation](#list-concatenation) of `names1` and `names2`.

The [static semantics](#sec-static-semantic-rules) of [VarScopedDeclarations](#sec-static-semantics-varscopeddeclarations) in [8.2.7](#sec-static-semantics-varscopeddeclarations) are augmented with the following:

[ForInOfStatement](#prod-annexB-ForInOfStatement) : for ( var [BindingIdentifier](#prod-BindingIdentifier) [Initializer](#prod-Initializer) in [Expression](#prod-Expression) ) [Statement](#prod-Statement)

1.  Let `declarations1` be « [BindingIdentifier](#prod-BindingIdentifier) ».
2.  Let `declarations2` be the [VarScopedDeclarations](#sec-static-semantics-varscopeddeclarations) of [Statement](#prod-Statement).
3.  Return the [list-concatenation](#list-concatenation) of `declarations1` and `declarations2`.

The [runtime semantics](#sec-runtime-semantics) of [ForInOfLoopEvaluation](#sec-runtime-semantics-forinofloopevaluation) in [14.7.5.5](#sec-runtime-semantics-forinofloopevaluation) are augmented with the following:

[ForInOfStatement](#prod-annexB-ForInOfStatement) : for ( var [BindingIdentifier](#prod-BindingIdentifier) [Initializer](#prod-Initializer) in [Expression](#prod-Expression) ) [Statement](#prod-Statement)

1.  Let `bindingId` be the [StringValue](#sec-static-semantics-stringvalue) of [BindingIdentifier](#prod-BindingIdentifier).
2.  Let `lhs` be ? [ResolveBinding](#sec-resolvebinding)(`bindingId`).
3.  If [IsAnonymousFunctionDefinition](#sec-isanonymousfunctiondefinition)([Initializer](#prod-Initializer)) is true, then
    1.  Let `value` be ? [NamedEvaluation](#sec-runtime-semantics-namedevaluation) of [Initializer](#prod-Initializer) with argument `bindingId`.
4.  Else,
    1.  Let `rhs` be ? [Evaluation](#sec-evaluation) of [Initializer](#prod-Initializer).
    2.  Let `value` be ? [GetValue](#sec-getvalue)(`rhs`).
5.  Perform ? [PutValue](#sec-putvalue)(`lhs`, `value`).
6.  Let `keyResult` be ? [ForIn/OfHeadEvaluation](#sec-runtime-semantics-forinofheadevaluation)(« », [Expression](#prod-Expression), enumerate).
7.  Return ? [ForIn/OfBodyEvaluation](#sec-runtime-semantics-forin-div-ofbodyevaluation-lhs-stmt-iterator-lhskind-labelset)([BindingIdentifier](#prod-BindingIdentifier), [Statement](#prod-Statement), `keyResult`, enumerate, var-binding, `labelSet`).

### B.3.6 The `[[IsHTMLDDA]]` Internal Slot

An `[[IsHTMLDDA]]` internal slot may exist on [host-defined](#host-defined) objects. Objects with an `[[IsHTMLDDA]]` internal slot behave like undefined in the [ToBoolean](#sec-toboolean) and [IsLooselyEqual](#sec-islooselyequal) [abstract operations](#sec-algorithm-conventions-abstract-operations) and when used as an operand for the [`typeof` operator](#sec-typeof-operator).

Note

Objects with an `[[IsHTMLDDA]]` internal slot are never created by this specification. However, the [`document.all` object](https://html.spec.whatwg.org/multipage/obsolete.html#dom-document-all) in web browsers is a [host-defined](#host-defined) [exotic object](#exotic-object) with this slot that exists for web compatibility purposes. There are no other known examples of this type of object and implementations should not create any with the exception of `document.all`.

#### B.3.6.1 Changes to ToBoolean

The following step replaces step [3](#step-to-boolean-web-compat-insertion-point) of [ToBoolean](#sec-toboolean):

3.  If `argument` [is an Object](#sec-object-type) and `argument` has an `[[IsHTMLDDA]]` internal slot, return false.

#### B.3.6.2 Changes to IsLooselyEqual

The following steps replace step [4](#step-abstract-equality-comparison-web-compat-insertion-point) of [IsLooselyEqual](#sec-islooselyequal):

4.  Perform the following steps:
    1.  If `x` [is an Object](#sec-object-type), `x` has an `[[IsHTMLDDA]]` internal slot, and `y` is either undefined or null, return true.
    2.  If `x` is either undefined or null, `y` [is an Object](#sec-object-type), and `y` has an `[[IsHTMLDDA]]` internal slot, return true.

#### B.3.6.3 Changes to the `typeof` Operator

The following step replaces step [12](#step-typeof-web-compat-insertion-point) of [the evaluation semantics for `typeof`](#sec-typeof-operator-runtime-semantics-evaluation):

12. If `val` has an `[[IsHTMLDDA]]` internal slot, return "undefined".

### B.3.7 Non-default behaviour in HostMakeJobCallback

The [HostMakeJobCallback](#sec-hostmakejobcallback) abstract operation allows [hosts](#host) which are web browsers to specify non-default behaviour.

### B.3.8 Non-default behaviour in HostEnsureCanAddPrivateElement

The [HostEnsureCanAddPrivateElement](#sec-hostensurecanaddprivateelement) abstract operation allows [hosts](#host) which are web browsers to specify non-default behaviour.
