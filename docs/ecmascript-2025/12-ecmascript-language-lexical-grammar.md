# 12 ECMAScript Language: Lexical Grammar

The source text of an ECMAScript [Script](#prod-Script) or [Module](#prod-Module) is first converted into a sequence of input elements, which are tokens, line terminators, comments, or white space. The source text is scanned from left to right, repeatedly taking the longest possible sequence of code points as the next input element.

There are several situations where the identification of lexical input elements is sensitive to the syntactic grammar context that is consuming the input elements. This requires multiple [goal symbols](#sec-context-free-grammars) for the lexical grammar. The [InputElementHashbangOrRegExp](#prod-InputElementHashbangOrRegExp) goal is used at the start of a [Script](#prod-Script) or [Module](#prod-Module). The [InputElementRegExpOrTemplateTail](#prod-InputElementRegExpOrTemplateTail) goal is used in syntactic grammar contexts where a [RegularExpressionLiteral](#prod-RegularExpressionLiteral), a [TemplateMiddle](#prod-TemplateMiddle), or a [TemplateTail](#prod-TemplateTail) is permitted. The [InputElementRegExp](#prod-InputElementRegExp) [goal symbol](#sec-context-free-grammars) is used in all syntactic grammar contexts where a [RegularExpressionLiteral](#prod-RegularExpressionLiteral) is permitted but neither a [TemplateMiddle](#prod-TemplateMiddle), nor a [TemplateTail](#prod-TemplateTail) is permitted. The [InputElementTemplateTail](#prod-InputElementTemplateTail) goal is used in all syntactic grammar contexts where a [TemplateMiddle](#prod-TemplateMiddle) or a [TemplateTail](#prod-TemplateTail) is permitted but a [RegularExpressionLiteral](#prod-RegularExpressionLiteral) is not permitted. In all other contexts, [InputElementDiv](#prod-InputElementDiv) is used as the lexical [goal symbol](#sec-context-free-grammars).

Note

The use of multiple lexical goals ensures that there are no lexical ambiguities that would affect automatic semicolon insertion. For example, there are no syntactic grammar contexts where both a leading division or division-assignment, and a leading [RegularExpressionLiteral](#prod-RegularExpressionLiteral) are permitted. This is not affected by semicolon insertion (see [12.10](#sec-automatic-semicolon-insertion)); in examples such as the following:

``` javascript
a = b
/hi/g.exec(c).map(d);
```

where the first non-whitespace, non-comment code point after a [LineTerminator](#prod-LineTerminator) is U+002F (SOLIDUS) and the syntactic context allows division or division-assignment, no semicolon is inserted at the [LineTerminator](#prod-LineTerminator). That is, the above example is interpreted in the same way as:

``` javascript
a = b / hi / g.exec(c).map(d);
```

## Syntax

[InputElementDiv](#prod-InputElementDiv) :: [WhiteSpace](#prod-WhiteSpace) [LineTerminator](#prod-LineTerminator) [Comment](#prod-Comment) [CommonToken](#prod-CommonToken) [DivPunctuator](#prod-DivPunctuator) [RightBracePunctuator](#prod-RightBracePunctuator) [InputElementRegExp](#prod-InputElementRegExp) :: [WhiteSpace](#prod-WhiteSpace) [LineTerminator](#prod-LineTerminator) [Comment](#prod-Comment) [CommonToken](#prod-CommonToken) [RightBracePunctuator](#prod-RightBracePunctuator) [RegularExpressionLiteral](#prod-RegularExpressionLiteral) [InputElementRegExpOrTemplateTail](#prod-InputElementRegExpOrTemplateTail) :: [WhiteSpace](#prod-WhiteSpace) [LineTerminator](#prod-LineTerminator) [Comment](#prod-Comment) [CommonToken](#prod-CommonToken) [RegularExpressionLiteral](#prod-RegularExpressionLiteral) [TemplateSubstitutionTail](#prod-TemplateSubstitutionTail) [InputElementTemplateTail](#prod-InputElementTemplateTail) :: [WhiteSpace](#prod-WhiteSpace) [LineTerminator](#prod-LineTerminator) [Comment](#prod-Comment) [CommonToken](#prod-CommonToken) [DivPunctuator](#prod-DivPunctuator) [TemplateSubstitutionTail](#prod-TemplateSubstitutionTail) [InputElementHashbangOrRegExp](#prod-InputElementHashbangOrRegExp) :: [WhiteSpace](#prod-WhiteSpace) [LineTerminator](#prod-LineTerminator) [Comment](#prod-Comment) [CommonToken](#prod-CommonToken) [HashbangComment](#prod-HashbangComment) [RegularExpressionLiteral](#prod-RegularExpressionLiteral)

## 12.1 Unicode Format-Control Characters

The Unicode format-control characters (i.e., the characters in category “Cf” in the Unicode Character Database such as LEFT-TO-RIGHT MARK or RIGHT-TO-LEFT MARK) are control codes used to control the formatting of a range of text in the absence of higher-level protocols for this (such as mark-up languages).

It is useful to allow format-control characters in source text to facilitate editing and display. All format control characters may be used within comments, and within string literals, template literals, and regular expression literals.

U+FEFF (ZERO WIDTH NO-BREAK SPACE) is a format-control character used primarily at the start of a text to mark it as Unicode and to allow detection of the text's encoding and byte order. \<ZWNBSP\> characters intended for this purpose can sometimes also appear after the start of a text, for example as a result of concatenating files. In [ECMAScript source text](#sec-source-text) \<ZWNBSP\> code points are treated as white space characters (see [12.2](#sec-white-space)) outside of comments, string literals, template literals, and regular expression literals.

## 12.2 White Space

White space code points are used to improve source text readability and to separate tokens (indivisible lexical units) from each other, but are otherwise insignificant. White space code points may occur between any two tokens and at the start or end of input. White space code points may occur within a [StringLiteral](#prod-StringLiteral), a [RegularExpressionLiteral](#prod-RegularExpressionLiteral), a [Template](#prod-Template), or a [TemplateSubstitutionTail](#prod-TemplateSubstitutionTail) where they are considered significant code points forming part of a literal value. They may also occur within a [Comment](#prod-Comment), but cannot appear within any other kind of token.

The ECMAScript white space code points are listed in [Table 35](#table-white-space-code-points).

| Code Points | Name | Abbreviation |
|----|----|----|
| `U+0009` | CHARACTER TABULATION | \<TAB\> |
| `U+000B` | LINE TABULATION | \<VT\> |
| `U+000C` | FORM FEED (FF) | \<FF\> |
| `U+FEFF` | ZERO WIDTH NO-BREAK SPACE | \<ZWNBSP\> |
| any code point in general category “Space_Separator” |  | \<USP\> |

Table 35: White Space Code Points

Note 1

U+0020 (SPACE) and U+00A0 (NO-BREAK SPACE) code points are part of \<USP\>.

Note 2

Other than for the code points listed in [Table 35](#table-white-space-code-points), ECMAScript [WhiteSpace](#prod-WhiteSpace) intentionally excludes all code points that have the Unicode “White_Space” property but which are not classified in general category “Space_Separator” (“Zs”).

### Syntax

[WhiteSpace](#prod-WhiteSpace) :: \<TAB\> \<VT\> \<FF\> \<ZWNBSP\> \<USP\>

## 12.3 Line Terminators

Like white space code points, line terminator code points are used to improve source text readability and to separate tokens (indivisible lexical units) from each other. However, unlike white space code points, line terminators have some influence over the behaviour of the syntactic grammar. In general, line terminators may occur between any two tokens, but there are a few places where they are forbidden by the syntactic grammar. Line terminators also affect the process of automatic semicolon insertion ([12.10](#sec-automatic-semicolon-insertion)). A line terminator cannot occur within any token except a [StringLiteral](#prod-StringLiteral), [Template](#prod-Template), or [TemplateSubstitutionTail](#prod-TemplateSubstitutionTail). \<LF\> and \<CR\> line terminators cannot occur within a [StringLiteral](#prod-StringLiteral) token except as part of a [LineContinuation](#prod-LineContinuation).

A line terminator can occur within a [MultiLineComment](#prod-MultiLineComment) but cannot occur within a [SingleLineComment](#prod-SingleLineComment).

Line terminators are included in the set of white space code points that are matched by the `\s` class in regular expressions.

The ECMAScript line terminator code points are listed in [Table 36](#table-line-terminator-code-points).

| Code Point | Unicode Name         | Abbreviation |
|------------|----------------------|--------------|
| `U+000A`   | LINE FEED (LF)       | \<LF\>       |
| `U+000D`   | CARRIAGE RETURN (CR) | \<CR\>       |
| `U+2028`   | LINE SEPARATOR       | \<LS\>       |
| `U+2029`   | PARAGRAPH SEPARATOR  | \<PS\>       |

Table 36: Line Terminator Code Points

Only the Unicode code points in [Table 36](#table-line-terminator-code-points) are treated as line terminators. Other new line or line breaking Unicode code points are not treated as line terminators but are treated as white space if they meet the requirements listed in [Table 35](#table-white-space-code-points). The sequence \<CR\>\<LF\> is commonly used as a line terminator. It should be considered a single [SourceCharacter](#prod-SourceCharacter) for the purpose of reporting line numbers.

### Syntax

[LineTerminator](#prod-LineTerminator) :: \<LF\> \<CR\> \<LS\> \<PS\> [LineTerminatorSequence](#prod-LineTerminatorSequence) :: \<LF\> \<CR\> \[lookahead ≠ \<LF\>\] \<LS\> \<PS\> \<CR\> \<LF\>

## 12.4 Comments

Comments can be either single or multi-line. Multi-line comments cannot nest.

Because a single-line comment can contain any Unicode code point except a [LineTerminator](#prod-LineTerminator) code point, and because of the general rule that a token is always as long as possible, a single-line comment always consists of all code points from the `//` marker to the end of the line. However, the [LineTerminator](#prod-LineTerminator) at the end of the line is not considered to be part of the single-line comment; it is recognized separately by the lexical grammar and becomes part of the stream of input elements for the syntactic grammar. This point is very important, because it implies that the presence or absence of single-line comments does not affect the process of automatic semicolon insertion (see [12.10](#sec-automatic-semicolon-insertion)).

Comments behave like white space and are discarded except that, if a [MultiLineComment](#prod-MultiLineComment) contains a line terminator code point, then the entire comment is considered to be a [LineTerminator](#prod-LineTerminator) for purposes of parsing by the syntactic grammar.

### Syntax

[Comment](#prod-Comment) :: [MultiLineComment](#prod-MultiLineComment) [SingleLineComment](#prod-SingleLineComment) [MultiLineComment](#prod-MultiLineComment) :: /\* [MultiLineCommentChars](#prod-MultiLineCommentChars)opt \*/ [MultiLineCommentChars](#prod-MultiLineCommentChars) :: [MultiLineNotAsteriskChar](#prod-MultiLineNotAsteriskChar) [MultiLineCommentChars](#prod-MultiLineCommentChars)opt \* [PostAsteriskCommentChars](#prod-PostAsteriskCommentChars)opt [PostAsteriskCommentChars](#prod-PostAsteriskCommentChars) :: [MultiLineNotForwardSlashOrAsteriskChar](#prod-MultiLineNotForwardSlashOrAsteriskChar) [MultiLineCommentChars](#prod-MultiLineCommentChars)opt \* [PostAsteriskCommentChars](#prod-PostAsteriskCommentChars)opt [MultiLineNotAsteriskChar](#prod-MultiLineNotAsteriskChar) :: [SourceCharacter](#prod-SourceCharacter) but not \* [MultiLineNotForwardSlashOrAsteriskChar](#prod-MultiLineNotForwardSlashOrAsteriskChar) :: [SourceCharacter](#prod-SourceCharacter) but not one of / or \* [SingleLineComment](#prod-SingleLineComment) :: // [SingleLineCommentChars](#prod-SingleLineCommentChars)opt [SingleLineCommentChars](#prod-SingleLineCommentChars) :: [SingleLineCommentChar](#prod-SingleLineCommentChar) [SingleLineCommentChars](#prod-SingleLineCommentChars)opt [SingleLineCommentChar](#prod-SingleLineCommentChar) :: [SourceCharacter](#prod-SourceCharacter) but not [LineTerminator](#prod-LineTerminator)

A number of productions in this section are given alternative definitions in section [B.1.1](#sec-html-like-comments)

## 12.5 Hashbang Comments

Hashbang Comments are location-sensitive and like other types of comments are discarded from the stream of input elements for the syntactic grammar.

### Syntax

[HashbangComment](#prod-HashbangComment) :: \#! [SingleLineCommentChars](#prod-SingleLineCommentChars)opt

## 12.6 Tokens

### Syntax

[CommonToken](#prod-CommonToken) :: [IdentifierName](#prod-IdentifierName) [PrivateIdentifier](#prod-PrivateIdentifier) [Punctuator](#prod-Punctuator) [NumericLiteral](#prod-NumericLiteral) [StringLiteral](#prod-StringLiteral) [Template](#prod-Template) Note

The [DivPunctuator](#prod-DivPunctuator), [RegularExpressionLiteral](#prod-RegularExpressionLiteral), [RightBracePunctuator](#prod-RightBracePunctuator), and [TemplateSubstitutionTail](#prod-TemplateSubstitutionTail) productions derive additional tokens that are not included in the [CommonToken](#prod-CommonToken) production.

## 12.7 Names and Keywords

[IdentifierName](#prod-IdentifierName) and [ReservedWord](#prod-ReservedWord) are tokens that are interpreted according to the Default Identifier Syntax given in Unicode Standard Annex \#31, Identifier and Pattern Syntax, with some small modifications. [ReservedWord](#prod-ReservedWord) is an enumerated subset of [IdentifierName](#prod-IdentifierName). The syntactic grammar defines [Identifier](#prod-Identifier) as an [IdentifierName](#prod-IdentifierName) that is not a [ReservedWord](#prod-ReservedWord). The Unicode identifier grammar is based on character properties specified by the Unicode Standard. The Unicode code points in the specified categories in the latest version of the Unicode Standard must be treated as in those categories by all conforming ECMAScript implementations. ECMAScript implementations may recognize identifier code points defined in later editions of the Unicode Standard.

Note 1

This standard specifies specific code point additions: U+0024 (DOLLAR SIGN) and U+005F (LOW LINE) are permitted anywhere in an [IdentifierName](#prod-IdentifierName).

### Syntax

[PrivateIdentifier](#prod-PrivateIdentifier) :: \# [IdentifierName](#prod-IdentifierName) [IdentifierName](#prod-IdentifierName) :: [IdentifierStart](#prod-IdentifierStart) [IdentifierName](#prod-IdentifierName) [IdentifierPart](#prod-IdentifierPart) [IdentifierStart](#prod-IdentifierStart) :: [IdentifierStartChar](#prod-IdentifierStartChar) \\ [UnicodeEscapeSequence](#prod-UnicodeEscapeSequence) [IdentifierPart](#prod-IdentifierPart) :: [IdentifierPartChar](#prod-IdentifierPartChar) \\ [UnicodeEscapeSequence](#prod-UnicodeEscapeSequence) [IdentifierStartChar](#prod-IdentifierStartChar) :: [UnicodeIDStart](#prod-UnicodeIDStart) \$ \_ [IdentifierPartChar](#prod-IdentifierPartChar) :: [UnicodeIDContinue](#prod-UnicodeIDContinue) \$ [AsciiLetter](#prod-AsciiLetter) :: one of a b c d e f g h i j k l m n o p q r s t u v w x y z A B C D E F G H I J K L M N O P Q R S T U V W X Y Z [UnicodeIDStart](#prod-UnicodeIDStart) :: any Unicode code point with the Unicode property “ID_Start” [UnicodeIDContinue](#prod-UnicodeIDContinue) :: any Unicode code point with the Unicode property “ID_Continue”

The definitions of the nonterminal [UnicodeEscapeSequence](#prod-UnicodeEscapeSequence) is given in [12.9.4](#sec-literals-string-literals).

Note 2

The nonterminal [IdentifierPart](#prod-IdentifierPart) derives `_` via [UnicodeIDContinue](#prod-UnicodeIDContinue).

Note 3

The sets of code points with Unicode properties “ID_Start” and “ID_Continue” include, respectively, the code points with Unicode properties “Other_ID_Start” and “Other_ID_Continue”.

### 12.7.1 Identifier Names

Unicode escape sequences are permitted in an [IdentifierName](#prod-IdentifierName), where they contribute a single Unicode code point equal to the [IdentifierCodePoint](#sec-identifiercodepoint) of the [UnicodeEscapeSequence](#prod-UnicodeEscapeSequence). The `\` preceding the [UnicodeEscapeSequence](#prod-UnicodeEscapeSequence) does not contribute any code points. A [UnicodeEscapeSequence](#prod-UnicodeEscapeSequence) cannot be used to contribute a code point to an [IdentifierName](#prod-IdentifierName) that would otherwise be invalid. In other words, if a `\` [UnicodeEscapeSequence](#prod-UnicodeEscapeSequence) sequence were replaced by the [SourceCharacter](#prod-SourceCharacter) it contributes, the result must still be a valid [IdentifierName](#prod-IdentifierName) that has the exact same sequence of [SourceCharacter](#prod-SourceCharacter) elements as the original [IdentifierName](#prod-IdentifierName). All interpretations of [IdentifierName](#prod-IdentifierName) within this specification are based upon their actual code points regardless of whether or not an escape sequence was used to contribute any particular code point.

Two [IdentifierName](#prod-IdentifierName)s that are canonically equivalent according to the Unicode Standard are *not* equal unless, after replacement of each [UnicodeEscapeSequence](#prod-UnicodeEscapeSequence), they are represented by the exact same sequence of code points.

#### 12.7.1.1 Static Semantics: Early Errors

[IdentifierStart](#prod-IdentifierStart) :: \\ [UnicodeEscapeSequence](#prod-UnicodeEscapeSequence)

- It is a Syntax Error if the [IdentifierCodePoint](#sec-identifiercodepoint) of [UnicodeEscapeSequence](#prod-UnicodeEscapeSequence) is not some Unicode code point matched by the [IdentifierStartChar](#prod-IdentifierStartChar) lexical grammar production.

[IdentifierPart](#prod-IdentifierPart) :: \\ [UnicodeEscapeSequence](#prod-UnicodeEscapeSequence)

- It is a Syntax Error if the [IdentifierCodePoint](#sec-identifiercodepoint) of [UnicodeEscapeSequence](#prod-UnicodeEscapeSequence) is not some Unicode code point matched by the [IdentifierPartChar](#prod-IdentifierPartChar) lexical grammar production.

#### 12.7.1.2 Static Semantics: IdentifierCodePoints

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) IdentifierCodePoints takes no arguments and returns a [List](#sec-list-and-record-specification-type) of code points. It is defined piecewise over the following productions:

[IdentifierName](#prod-IdentifierName) :: [IdentifierStart](#prod-IdentifierStart)

1.  Let `cp` be the [IdentifierCodePoint](#sec-identifiercodepoint) of [IdentifierStart](#prod-IdentifierStart).
2.  Return « `cp` ».

[IdentifierName](#prod-IdentifierName) :: [IdentifierName](#prod-IdentifierName) [IdentifierPart](#prod-IdentifierPart)

1.  Let `cps` be the [IdentifierCodePoints](#sec-identifiercodepoints) of the derived [IdentifierName](#prod-IdentifierName).
2.  Let `cp` be the [IdentifierCodePoint](#sec-identifiercodepoint) of [IdentifierPart](#prod-IdentifierPart).
3.  Return the [list-concatenation](#list-concatenation) of `cps` and « `cp` ».

#### 12.7.1.3 Static Semantics: IdentifierCodePoint

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) IdentifierCodePoint takes no arguments and returns a code point. It is defined piecewise over the following productions:

[IdentifierStart](#prod-IdentifierStart) :: [IdentifierStartChar](#prod-IdentifierStartChar)

1.  Return the code point matched by [IdentifierStartChar](#prod-IdentifierStartChar).

[IdentifierPart](#prod-IdentifierPart) :: [IdentifierPartChar](#prod-IdentifierPartChar)

1.  Return the code point matched by [IdentifierPartChar](#prod-IdentifierPartChar).

[UnicodeEscapeSequence](#prod-UnicodeEscapeSequence) :: u [Hex4Digits](#prod-Hex4Digits)

1.  Return the code point whose numeric value is the MV of [Hex4Digits](#prod-Hex4Digits).

[UnicodeEscapeSequence](#prod-UnicodeEscapeSequence) :: u{ [CodePoint](#prod-CodePoint) }

1.  Return the code point whose numeric value is the MV of [CodePoint](#prod-CodePoint).

### 12.7.2 Keywords and Reserved Words

A keyword is a token that matches [IdentifierName](#prod-IdentifierName), but also has a syntactic use; that is, it appears literally, in a `fixed width` font, in some syntactic production. The keywords of ECMAScript include `if`, `while`, `async`, `await`, and many others.

A reserved word is an [IdentifierName](#prod-IdentifierName) that cannot be used as an identifier. Many keywords are reserved words, but some are not, and some are reserved only in certain contexts. `if` and `while` are reserved words. `await` is reserved only inside async functions and modules. `async` is not reserved; it can be used as a variable name or statement label without restriction.

This specification uses a combination of grammatical productions and [early error](#early-error) rules to specify which names are valid identifiers and which are reserved words. All tokens in the [ReservedWord](#prod-ReservedWord) list below, except for `await` and `yield`, are unconditionally reserved. Exceptions for `await` and `yield` are specified in [13.1](#sec-identifiers), using parameterized syntactic productions. Lastly, several [early error](#early-error) rules restrict the set of valid identifiers. See [13.1.1](#sec-identifiers-static-semantics-early-errors), [14.3.1.1](#sec-let-and-const-declarations-static-semantics-early-errors), [14.7.5.1](#sec-for-in-and-for-of-statements-static-semantics-early-errors), and [15.7.1](#sec-class-definitions-static-semantics-early-errors). In summary, there are five categories of identifier names:

- Those that are always allowed as identifiers, and are not keywords, such as `Math`, `window`, `toString`, and `_`;

- Those that are never allowed as identifiers, namely the [ReservedWord](#prod-ReservedWord)s listed below except `await` and `yield`;

- Those that are contextually allowed as identifiers, namely `await` and `yield`;

- Those that are contextually disallowed as identifiers, in [strict mode code](#sec-strict-mode-code): `let`, `static`, `implements`, `interface`, `package`, `private`, `protected`, and `public`;

- Those that are always allowed as identifiers, but also appear as keywords within certain syntactic productions, at places where [Identifier](#prod-Identifier) is not allowed: `as`, `async`, `from`, `get`, `meta`, `of`, `set`, and `target`.

The term conditional keyword, or contextual keyword, is sometimes used to refer to the keywords that fall in the last three categories, and thus can be used as identifiers in some contexts and as keywords in others.

#### Syntax

[ReservedWord](#prod-ReservedWord) :: one of await break case catch class const continue debugger default delete do else enum export extends false finally for function if import in instanceof new null return super switch this throw true try typeof var void while with yield Note 1

Per [5.1.5](#sec-grammar-notation), keywords in the grammar match literal sequences of specific [SourceCharacter](#prod-SourceCharacter) elements. A code point in a keyword cannot be expressed by a `\` [UnicodeEscapeSequence](#prod-UnicodeEscapeSequence).

An [IdentifierName](#prod-IdentifierName) can contain `\` [UnicodeEscapeSequence](#prod-UnicodeEscapeSequence)s, but it is not possible to declare a variable named "else" by spelling it `els\u{65}`. The [early error](#early-error) rules in [13.1.1](#sec-identifiers-static-semantics-early-errors) rule out identifiers with the same [StringValue](#sec-static-semantics-stringvalue) as a reserved word.

Note 2

`enum` is not currently used as a keyword in this specification. It is a *future reserved word*, set aside for use as a keyword in future language extensions.

Similarly, `implements`, `interface`, `package`, `private`, `protected`, and `public` are future reserved words in [strict mode code](#sec-strict-mode-code).

Note 3

The names `arguments` and `eval` are not keywords, but they are subject to some restrictions in [strict mode code](#sec-strict-mode-code). See [13.1.1](#sec-identifiers-static-semantics-early-errors), [8.6.4](#sec-static-semantics-assignmenttargettype), [15.2.1](#sec-function-definitions-static-semantics-early-errors), [15.5.1](#sec-generator-function-definitions-static-semantics-early-errors), [15.6.1](#sec-async-generator-function-definitions-static-semantics-early-errors), and [15.8.1](#sec-async-function-definitions-static-semantics-early-errors).

## 12.8 Punctuators

### Syntax

[Punctuator](#prod-Punctuator) :: [OptionalChainingPunctuator](#prod-OptionalChainingPunctuator) [OtherPunctuator](#prod-OtherPunctuator) [OptionalChainingPunctuator](#prod-OptionalChainingPunctuator) :: ?. \[lookahead ∉ [DecimalDigit](#prod-DecimalDigit)\] [OtherPunctuator](#prod-OtherPunctuator) :: one of { ( ) \[ \] . ... ; , \< \> \<= \>= == != === !== + - \* % \*\* ++ -- \<\< \>\> \>\>\> & \| ^ ! ~ && \|\| ?? ? : = += -= \*= %= \*\*= \<\<= \>\>= \>\>\>= &= \|= ^= &&= \|\|= ??= =\> [DivPunctuator](#prod-DivPunctuator) :: / /= [RightBracePunctuator](#prod-RightBracePunctuator) :: }

## 12.9 Literals

### 12.9.1 Null Literals

#### Syntax

[NullLiteral](#prod-NullLiteral) :: null

### 12.9.2 Boolean Literals

#### Syntax

[BooleanLiteral](#prod-BooleanLiteral) :: true false

### 12.9.3 Numeric Literals

#### Syntax

[NumericLiteralSeparator](#prod-NumericLiteralSeparator) :: \_ [NumericLiteral](#prod-NumericLiteral) :: [DecimalLiteral](#prod-DecimalLiteral) [DecimalBigIntegerLiteral](#prod-DecimalBigIntegerLiteral) [NonDecimalIntegerLiteral](#prod-NonDecimalIntegerLiteral)\[+Sep\] [NonDecimalIntegerLiteral](#prod-NonDecimalIntegerLiteral)\[+Sep\] [BigIntLiteralSuffix](#prod-BigIntLiteralSuffix) [LegacyOctalIntegerLiteral](#prod-LegacyOctalIntegerLiteral) [DecimalBigIntegerLiteral](#prod-DecimalBigIntegerLiteral) :: 0 [BigIntLiteralSuffix](#prod-BigIntLiteralSuffix) [NonZeroDigit](#prod-NonZeroDigit) [DecimalDigits](#prod-DecimalDigits)\[+Sep\]opt [BigIntLiteralSuffix](#prod-BigIntLiteralSuffix) [NonZeroDigit](#prod-NonZeroDigit) [NumericLiteralSeparator](#prod-NumericLiteralSeparator) [DecimalDigits](#prod-DecimalDigits)\[+Sep\] [BigIntLiteralSuffix](#prod-BigIntLiteralSuffix) [NonDecimalIntegerLiteral](#prod-NonDecimalIntegerLiteral)\[Sep\] :: [BinaryIntegerLiteral](#prod-BinaryIntegerLiteral)\[?Sep\] [OctalIntegerLiteral](#prod-OctalIntegerLiteral)\[?Sep\] [HexIntegerLiteral](#prod-HexIntegerLiteral)\[?Sep\] [BigIntLiteralSuffix](#prod-BigIntLiteralSuffix) :: n [DecimalLiteral](#prod-DecimalLiteral) :: [DecimalIntegerLiteral](#prod-DecimalIntegerLiteral) . [DecimalDigits](#prod-DecimalDigits)\[+Sep\]opt [ExponentPart](#prod-ExponentPart)\[+Sep\]opt . [DecimalDigits](#prod-DecimalDigits)\[+Sep\] [ExponentPart](#prod-ExponentPart)\[+Sep\]opt [DecimalIntegerLiteral](#prod-DecimalIntegerLiteral) [ExponentPart](#prod-ExponentPart)\[+Sep\]opt [DecimalIntegerLiteral](#prod-DecimalIntegerLiteral) :: 0 [NonZeroDigit](#prod-NonZeroDigit) [NonZeroDigit](#prod-NonZeroDigit) [NumericLiteralSeparator](#prod-NumericLiteralSeparator)opt [DecimalDigits](#prod-DecimalDigits)\[+Sep\] [NonOctalDecimalIntegerLiteral](#prod-NonOctalDecimalIntegerLiteral) [DecimalDigits](#prod-DecimalDigits)\[Sep\] :: [DecimalDigit](#prod-DecimalDigit) [DecimalDigits](#prod-DecimalDigits)\[?Sep\] [DecimalDigit](#prod-DecimalDigit) \[+Sep\] [DecimalDigits](#prod-DecimalDigits)\[+Sep\] [NumericLiteralSeparator](#prod-NumericLiteralSeparator) [DecimalDigit](#prod-DecimalDigit) [DecimalDigit](#prod-DecimalDigit) :: one of 0 1 2 3 4 5 6 7 8 9 [NonZeroDigit](#prod-NonZeroDigit) :: one of 1 2 3 4 5 6 7 8 9 [ExponentPart](#prod-ExponentPart)\[Sep\] :: [ExponentIndicator](#prod-ExponentIndicator) [SignedInteger](#prod-SignedInteger)\[?Sep\] [ExponentIndicator](#prod-ExponentIndicator) :: one of e E [SignedInteger](#prod-SignedInteger)\[Sep\] :: [DecimalDigits](#prod-DecimalDigits)\[?Sep\] + [DecimalDigits](#prod-DecimalDigits)\[?Sep\] - [DecimalDigits](#prod-DecimalDigits)\[?Sep\] [BinaryIntegerLiteral](#prod-BinaryIntegerLiteral)\[Sep\] :: 0b [BinaryDigits](#prod-BinaryDigits)\[?Sep\] 0B [BinaryDigits](#prod-BinaryDigits)\[?Sep\] [BinaryDigits](#prod-BinaryDigits)\[Sep\] :: [BinaryDigit](#prod-BinaryDigit) [BinaryDigits](#prod-BinaryDigits)\[?Sep\] [BinaryDigit](#prod-BinaryDigit) \[+Sep\] [BinaryDigits](#prod-BinaryDigits)\[+Sep\] [NumericLiteralSeparator](#prod-NumericLiteralSeparator) [BinaryDigit](#prod-BinaryDigit) [BinaryDigit](#prod-BinaryDigit) :: one of 0 1 [OctalIntegerLiteral](#prod-OctalIntegerLiteral)\[Sep\] :: 0o [OctalDigits](#prod-OctalDigits)\[?Sep\] 0O [OctalDigits](#prod-OctalDigits)\[?Sep\] [OctalDigits](#prod-OctalDigits)\[Sep\] :: [OctalDigit](#prod-OctalDigit) [OctalDigits](#prod-OctalDigits)\[?Sep\] [OctalDigit](#prod-OctalDigit) \[+Sep\] [OctalDigits](#prod-OctalDigits)\[+Sep\] [NumericLiteralSeparator](#prod-NumericLiteralSeparator) [OctalDigit](#prod-OctalDigit) [LegacyOctalIntegerLiteral](#prod-LegacyOctalIntegerLiteral) :: 0 [OctalDigit](#prod-OctalDigit) [LegacyOctalIntegerLiteral](#prod-LegacyOctalIntegerLiteral) [OctalDigit](#prod-OctalDigit) [NonOctalDecimalIntegerLiteral](#prod-NonOctalDecimalIntegerLiteral) :: 0 [NonOctalDigit](#prod-NonOctalDigit) [LegacyOctalLikeDecimalIntegerLiteral](#prod-LegacyOctalLikeDecimalIntegerLiteral) [NonOctalDigit](#prod-NonOctalDigit) [NonOctalDecimalIntegerLiteral](#prod-NonOctalDecimalIntegerLiteral) [DecimalDigit](#prod-DecimalDigit) [LegacyOctalLikeDecimalIntegerLiteral](#prod-LegacyOctalLikeDecimalIntegerLiteral) :: 0 [OctalDigit](#prod-OctalDigit) [LegacyOctalLikeDecimalIntegerLiteral](#prod-LegacyOctalLikeDecimalIntegerLiteral) [OctalDigit](#prod-OctalDigit) [OctalDigit](#prod-OctalDigit) :: one of 0 1 2 3 4 5 6 7 [NonOctalDigit](#prod-NonOctalDigit) :: one of 8 9 [HexIntegerLiteral](#prod-HexIntegerLiteral)\[Sep\] :: 0x [HexDigits](#prod-HexDigits)\[?Sep\] 0X [HexDigits](#prod-HexDigits)\[?Sep\] [HexDigits](#prod-HexDigits)\[Sep\] :: [HexDigit](#prod-HexDigit) [HexDigits](#prod-HexDigits)\[?Sep\] [HexDigit](#prod-HexDigit) \[+Sep\] [HexDigits](#prod-HexDigits)\[+Sep\] [NumericLiteralSeparator](#prod-NumericLiteralSeparator) [HexDigit](#prod-HexDigit) [HexDigit](#prod-HexDigit) :: one of 0 1 2 3 4 5 6 7 8 9 a b c d e f A B C D E F

The [SourceCharacter](#prod-SourceCharacter) immediately following a [NumericLiteral](#prod-NumericLiteral) must not be an [IdentifierStart](#prod-IdentifierStart) or [DecimalDigit](#prod-DecimalDigit).

Note

For example: `3in` is an error and not the two input elements `3` and `in`.

#### 12.9.3.1 Static Semantics: Early Errors

[NumericLiteral](#prod-NumericLiteral) :: [LegacyOctalIntegerLiteral](#prod-LegacyOctalIntegerLiteral) [DecimalIntegerLiteral](#prod-DecimalIntegerLiteral) :: [NonOctalDecimalIntegerLiteral](#prod-NonOctalDecimalIntegerLiteral)

- It is a Syntax Error if [IsStrict](#sec-isstrict)(this production) is true.

Note

In [non-strict code](#non-strict-code), this syntax is [Legacy](#sec-conformance).

#### 12.9.3.2 Static Semantics: MV

A numeric literal stands for a value of the [Number type](#sec-ecmascript-language-types-number-type) or the [BigInt type](#sec-ecmascript-language-types-bigint-type).

- The MV of [DecimalLiteral](#prod-DecimalLiteral) :: [DecimalIntegerLiteral](#prod-DecimalIntegerLiteral) . [DecimalDigits](#prod-DecimalDigits) is the MV of [DecimalIntegerLiteral](#prod-DecimalIntegerLiteral) plus (the MV of [DecimalDigits](#prod-DecimalDigits) × 10\*\*^(-`n`)), where `n` is the number of code points in [DecimalDigits](#prod-DecimalDigits), excluding all occurrences of [NumericLiteralSeparator](#prod-NumericLiteralSeparator).
- The MV of [DecimalLiteral](#prod-DecimalLiteral) :: [DecimalIntegerLiteral](#prod-DecimalIntegerLiteral) . [ExponentPart](#prod-ExponentPart) is the MV of [DecimalIntegerLiteral](#prod-DecimalIntegerLiteral) × 10\*\*^(`e`), where `e` is the MV of [ExponentPart](#prod-ExponentPart).
- The MV of [DecimalLiteral](#prod-DecimalLiteral) :: [DecimalIntegerLiteral](#prod-DecimalIntegerLiteral) . [DecimalDigits](#prod-DecimalDigits) [ExponentPart](#prod-ExponentPart) is (the MV of [DecimalIntegerLiteral](#prod-DecimalIntegerLiteral) plus (the MV of [DecimalDigits](#prod-DecimalDigits) × 10\*\*^(-`n`))) × 10\*\*^(`e`), where `n` is the number of code points in [DecimalDigits](#prod-DecimalDigits), excluding all occurrences of [NumericLiteralSeparator](#prod-NumericLiteralSeparator) and `e` is the MV of [ExponentPart](#prod-ExponentPart).
- The MV of [DecimalLiteral](#prod-DecimalLiteral) :: . [DecimalDigits](#prod-DecimalDigits) is the MV of [DecimalDigits](#prod-DecimalDigits) × 10\*\*^(-`n`), where `n` is the number of code points in [DecimalDigits](#prod-DecimalDigits), excluding all occurrences of [NumericLiteralSeparator](#prod-NumericLiteralSeparator).
- The MV of [DecimalLiteral](#prod-DecimalLiteral) :: . [DecimalDigits](#prod-DecimalDigits) [ExponentPart](#prod-ExponentPart) is the MV of [DecimalDigits](#prod-DecimalDigits) × 10\*\*(^(`e` - `n`)), where `n` is the number of code points in [DecimalDigits](#prod-DecimalDigits), excluding all occurrences of [NumericLiteralSeparator](#prod-NumericLiteralSeparator), and `e` is the MV of [ExponentPart](#prod-ExponentPart).
- The MV of [DecimalLiteral](#prod-DecimalLiteral) :: [DecimalIntegerLiteral](#prod-DecimalIntegerLiteral) [ExponentPart](#prod-ExponentPart) is the MV of [DecimalIntegerLiteral](#prod-DecimalIntegerLiteral) × 10\*\*^(`e`), where `e` is the MV of [ExponentPart](#prod-ExponentPart).
- The MV of [DecimalIntegerLiteral](#prod-DecimalIntegerLiteral) :: 0 is 0.
- The MV of [DecimalIntegerLiteral](#prod-DecimalIntegerLiteral) :: [NonZeroDigit](#prod-NonZeroDigit) [NumericLiteralSeparator](#prod-NumericLiteralSeparator)opt [DecimalDigits](#prod-DecimalDigits) is (the MV of [NonZeroDigit](#prod-NonZeroDigit) × 10\*\*^(`n`)) plus the MV of [DecimalDigits](#prod-DecimalDigits), where `n` is the number of code points in [DecimalDigits](#prod-DecimalDigits), excluding all occurrences of [NumericLiteralSeparator](#prod-NumericLiteralSeparator).
- The MV of [DecimalDigits](#prod-DecimalDigits) :: [DecimalDigits](#prod-DecimalDigits) [DecimalDigit](#prod-DecimalDigit) is (the MV of [DecimalDigits](#prod-DecimalDigits) × 10) plus the MV of [DecimalDigit](#prod-DecimalDigit).
- The MV of [DecimalDigits](#prod-DecimalDigits) :: [DecimalDigits](#prod-DecimalDigits) [NumericLiteralSeparator](#prod-NumericLiteralSeparator) [DecimalDigit](#prod-DecimalDigit) is (the MV of [DecimalDigits](#prod-DecimalDigits) × 10) plus the MV of [DecimalDigit](#prod-DecimalDigit).
- The MV of [ExponentPart](#prod-ExponentPart) :: [ExponentIndicator](#prod-ExponentIndicator) [SignedInteger](#prod-SignedInteger) is the MV of [SignedInteger](#prod-SignedInteger).
- The MV of [SignedInteger](#prod-SignedInteger) :: - [DecimalDigits](#prod-DecimalDigits) is the negative of the MV of [DecimalDigits](#prod-DecimalDigits).
- The MV of [DecimalDigit](#prod-DecimalDigit) :: 0 or of [HexDigit](#prod-HexDigit) :: 0 or of [OctalDigit](#prod-OctalDigit) :: 0 or of [LegacyOctalEscapeSequence](#prod-LegacyOctalEscapeSequence) :: 0 or of [BinaryDigit](#prod-BinaryDigit) :: 0 is 0.
- The MV of [DecimalDigit](#prod-DecimalDigit) :: 1 or of [NonZeroDigit](#prod-NonZeroDigit) :: 1 or of [HexDigit](#prod-HexDigit) :: 1 or of [OctalDigit](#prod-OctalDigit) :: 1 or of [BinaryDigit](#prod-BinaryDigit) :: 1 is 1.
- The MV of [DecimalDigit](#prod-DecimalDigit) :: 2 or of [NonZeroDigit](#prod-NonZeroDigit) :: 2 or of [HexDigit](#prod-HexDigit) :: 2 or of [OctalDigit](#prod-OctalDigit) :: 2 is 2.
- The MV of [DecimalDigit](#prod-DecimalDigit) :: 3 or of [NonZeroDigit](#prod-NonZeroDigit) :: 3 or of [HexDigit](#prod-HexDigit) :: 3 or of [OctalDigit](#prod-OctalDigit) :: 3 is 3.
- The MV of [DecimalDigit](#prod-DecimalDigit) :: 4 or of [NonZeroDigit](#prod-NonZeroDigit) :: 4 or of [HexDigit](#prod-HexDigit) :: 4 or of [OctalDigit](#prod-OctalDigit) :: 4 is 4.
- The MV of [DecimalDigit](#prod-DecimalDigit) :: 5 or of [NonZeroDigit](#prod-NonZeroDigit) :: 5 or of [HexDigit](#prod-HexDigit) :: 5 or of [OctalDigit](#prod-OctalDigit) :: 5 is 5.
- The MV of [DecimalDigit](#prod-DecimalDigit) :: 6 or of [NonZeroDigit](#prod-NonZeroDigit) :: 6 or of [HexDigit](#prod-HexDigit) :: 6 or of [OctalDigit](#prod-OctalDigit) :: 6 is 6.
- The MV of [DecimalDigit](#prod-DecimalDigit) :: 7 or of [NonZeroDigit](#prod-NonZeroDigit) :: 7 or of [HexDigit](#prod-HexDigit) :: 7 or of [OctalDigit](#prod-OctalDigit) :: 7 is 7.
- The MV of [DecimalDigit](#prod-DecimalDigit) :: 8 or of [NonZeroDigit](#prod-NonZeroDigit) :: 8 or of [NonOctalDigit](#prod-NonOctalDigit) :: 8 or of [HexDigit](#prod-HexDigit) :: 8 is 8.
- The MV of [DecimalDigit](#prod-DecimalDigit) :: 9 or of [NonZeroDigit](#prod-NonZeroDigit) :: 9 or of [NonOctalDigit](#prod-NonOctalDigit) :: 9 or of [HexDigit](#prod-HexDigit) :: 9 is 9.
- The MV of [HexDigit](#prod-HexDigit) :: a or of [HexDigit](#prod-HexDigit) :: A is 10.
- The MV of [HexDigit](#prod-HexDigit) :: b or of [HexDigit](#prod-HexDigit) :: B is 11.
- The MV of [HexDigit](#prod-HexDigit) :: c or of [HexDigit](#prod-HexDigit) :: C is 12.
- The MV of [HexDigit](#prod-HexDigit) :: d or of [HexDigit](#prod-HexDigit) :: D is 13.
- The MV of [HexDigit](#prod-HexDigit) :: e or of [HexDigit](#prod-HexDigit) :: E is 14.
- The MV of [HexDigit](#prod-HexDigit) :: f or of [HexDigit](#prod-HexDigit) :: F is 15.
- The MV of [BinaryDigits](#prod-BinaryDigits) :: [BinaryDigits](#prod-BinaryDigits) [BinaryDigit](#prod-BinaryDigit) is (the MV of [BinaryDigits](#prod-BinaryDigits) × 2) plus the MV of [BinaryDigit](#prod-BinaryDigit).
- The MV of [BinaryDigits](#prod-BinaryDigits) :: [BinaryDigits](#prod-BinaryDigits) [NumericLiteralSeparator](#prod-NumericLiteralSeparator) [BinaryDigit](#prod-BinaryDigit) is (the MV of [BinaryDigits](#prod-BinaryDigits) × 2) plus the MV of [BinaryDigit](#prod-BinaryDigit).
- The MV of [OctalDigits](#prod-OctalDigits) :: [OctalDigits](#prod-OctalDigits) [OctalDigit](#prod-OctalDigit) is (the MV of [OctalDigits](#prod-OctalDigits) × 8) plus the MV of [OctalDigit](#prod-OctalDigit).
- The MV of [OctalDigits](#prod-OctalDigits) :: [OctalDigits](#prod-OctalDigits) [NumericLiteralSeparator](#prod-NumericLiteralSeparator) [OctalDigit](#prod-OctalDigit) is (the MV of [OctalDigits](#prod-OctalDigits) × 8) plus the MV of [OctalDigit](#prod-OctalDigit).
- The MV of [LegacyOctalIntegerLiteral](#prod-LegacyOctalIntegerLiteral) :: [LegacyOctalIntegerLiteral](#prod-LegacyOctalIntegerLiteral) [OctalDigit](#prod-OctalDigit) is (the MV of [LegacyOctalIntegerLiteral](#prod-LegacyOctalIntegerLiteral) times 8) plus the MV of [OctalDigit](#prod-OctalDigit).
- The MV of [NonOctalDecimalIntegerLiteral](#prod-NonOctalDecimalIntegerLiteral) :: [LegacyOctalLikeDecimalIntegerLiteral](#prod-LegacyOctalLikeDecimalIntegerLiteral) [NonOctalDigit](#prod-NonOctalDigit) is (the MV of [LegacyOctalLikeDecimalIntegerLiteral](#prod-LegacyOctalLikeDecimalIntegerLiteral) times 10) plus the MV of [NonOctalDigit](#prod-NonOctalDigit).
- The MV of [NonOctalDecimalIntegerLiteral](#prod-NonOctalDecimalIntegerLiteral) :: [NonOctalDecimalIntegerLiteral](#prod-NonOctalDecimalIntegerLiteral) [DecimalDigit](#prod-DecimalDigit) is (the MV of [NonOctalDecimalIntegerLiteral](#prod-NonOctalDecimalIntegerLiteral) times 10) plus the MV of [DecimalDigit](#prod-DecimalDigit).
- The MV of [LegacyOctalLikeDecimalIntegerLiteral](#prod-LegacyOctalLikeDecimalIntegerLiteral) :: [LegacyOctalLikeDecimalIntegerLiteral](#prod-LegacyOctalLikeDecimalIntegerLiteral) [OctalDigit](#prod-OctalDigit) is (the MV of [LegacyOctalLikeDecimalIntegerLiteral](#prod-LegacyOctalLikeDecimalIntegerLiteral) times 10) plus the MV of [OctalDigit](#prod-OctalDigit).
- The MV of [HexDigits](#prod-HexDigits) :: [HexDigits](#prod-HexDigits) [HexDigit](#prod-HexDigit) is (the MV of [HexDigits](#prod-HexDigits) × 16) plus the MV of [HexDigit](#prod-HexDigit).
- The MV of [HexDigits](#prod-HexDigits) :: [HexDigits](#prod-HexDigits) [NumericLiteralSeparator](#prod-NumericLiteralSeparator) [HexDigit](#prod-HexDigit) is (the MV of [HexDigits](#prod-HexDigits) × 16) plus the MV of [HexDigit](#prod-HexDigit).

#### 12.9.3.3 Static Semantics: NumericValue

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) NumericValue takes no arguments and returns a Number or a BigInt. It is defined piecewise over the following productions:

[NumericLiteral](#prod-NumericLiteral) :: [DecimalLiteral](#prod-DecimalLiteral)

1.  Return [RoundMVResult](#sec-roundmvresult)(MV of [DecimalLiteral](#prod-DecimalLiteral)).

[NumericLiteral](#prod-NumericLiteral) :: [NonDecimalIntegerLiteral](#prod-NonDecimalIntegerLiteral)

1.  Return [𝔽](#𝔽)(MV of [NonDecimalIntegerLiteral](#prod-NonDecimalIntegerLiteral)).

[NumericLiteral](#prod-NumericLiteral) :: [LegacyOctalIntegerLiteral](#prod-LegacyOctalIntegerLiteral)

1.  Return [𝔽](#𝔽)(MV of [LegacyOctalIntegerLiteral](#prod-LegacyOctalIntegerLiteral)).

[NumericLiteral](#prod-NumericLiteral) :: [NonDecimalIntegerLiteral](#prod-NonDecimalIntegerLiteral) [BigIntLiteralSuffix](#prod-BigIntLiteralSuffix)

1.  Return the [BigInt value for](#bigint-value-for) the MV of [NonDecimalIntegerLiteral](#prod-NonDecimalIntegerLiteral).

[DecimalBigIntegerLiteral](#prod-DecimalBigIntegerLiteral) :: 0 [BigIntLiteralSuffix](#prod-BigIntLiteralSuffix)

1.  Return 0_(ℤ).

[DecimalBigIntegerLiteral](#prod-DecimalBigIntegerLiteral) :: [NonZeroDigit](#prod-NonZeroDigit) [BigIntLiteralSuffix](#prod-BigIntLiteralSuffix)

1.  Return the [BigInt value for](#bigint-value-for) the MV of [NonZeroDigit](#prod-NonZeroDigit).

[DecimalBigIntegerLiteral](#prod-DecimalBigIntegerLiteral) :: [NonZeroDigit](#prod-NonZeroDigit) [DecimalDigits](#prod-DecimalDigits) [BigIntLiteralSuffix](#prod-BigIntLiteralSuffix) [NonZeroDigit](#prod-NonZeroDigit) [NumericLiteralSeparator](#prod-NumericLiteralSeparator) [DecimalDigits](#prod-DecimalDigits) [BigIntLiteralSuffix](#prod-BigIntLiteralSuffix)

1.  Let `n` be the number of code points in [DecimalDigits](#prod-DecimalDigits), excluding all occurrences of [NumericLiteralSeparator](#prod-NumericLiteralSeparator).
2.  Let `mv` be (the MV of [NonZeroDigit](#prod-NonZeroDigit) × 10\*\*^(`n`)) plus the MV of [DecimalDigits](#prod-DecimalDigits).
3.  Return [ℤ](#ℤ)(`mv`).

### 12.9.4 String Literals

Note 1

A string literal is 0 or more Unicode code points enclosed in single or double quotes. Unicode code points may also be represented by an escape sequence. All code points may appear literally in a string literal except for the closing quote code points, U+005C (REVERSE SOLIDUS), U+000D (CARRIAGE RETURN), and U+000A (LINE FEED). Any code points may appear in the form of an escape sequence. String literals evaluate to ECMAScript String values. When generating these String values Unicode code points are UTF-16 encoded as defined in [11.1.1](#sec-utf16encodecodepoint). Code points belonging to the Basic Multilingual Plane are encoded as a single code unit element of the string. All other code points are encoded as two code unit elements of the string.

#### Syntax

[StringLiteral](#prod-StringLiteral) :: " [DoubleStringCharacters](#prod-DoubleStringCharacters)opt " ' [SingleStringCharacters](#prod-SingleStringCharacters)opt ' [DoubleStringCharacters](#prod-DoubleStringCharacters) :: [DoubleStringCharacter](#prod-DoubleStringCharacter) [DoubleStringCharacters](#prod-DoubleStringCharacters)opt [SingleStringCharacters](#prod-SingleStringCharacters) :: [SingleStringCharacter](#prod-SingleStringCharacter) [SingleStringCharacters](#prod-SingleStringCharacters)opt [DoubleStringCharacter](#prod-DoubleStringCharacter) :: [SourceCharacter](#prod-SourceCharacter) but not one of " or \\ or [LineTerminator](#prod-LineTerminator) \<LS\> \<PS\> \\ [EscapeSequence](#prod-EscapeSequence) [LineContinuation](#prod-LineContinuation) [SingleStringCharacter](#prod-SingleStringCharacter) :: [SourceCharacter](#prod-SourceCharacter) but not one of ' or \\ or [LineTerminator](#prod-LineTerminator) \<LS\> \<PS\> \\ [EscapeSequence](#prod-EscapeSequence) [LineContinuation](#prod-LineContinuation) [LineContinuation](#prod-LineContinuation) :: \\ [LineTerminatorSequence](#prod-LineTerminatorSequence) [EscapeSequence](#prod-EscapeSequence) :: [CharacterEscapeSequence](#prod-CharacterEscapeSequence) 0 \[lookahead ∉ [DecimalDigit](#prod-DecimalDigit)\] [LegacyOctalEscapeSequence](#prod-LegacyOctalEscapeSequence) [NonOctalDecimalEscapeSequence](#prod-NonOctalDecimalEscapeSequence) [HexEscapeSequence](#prod-HexEscapeSequence) [UnicodeEscapeSequence](#prod-UnicodeEscapeSequence) [CharacterEscapeSequence](#prod-CharacterEscapeSequence) :: [SingleEscapeCharacter](#prod-SingleEscapeCharacter) [NonEscapeCharacter](#prod-NonEscapeCharacter) [SingleEscapeCharacter](#prod-SingleEscapeCharacter) :: one of ' " \\ b f n r t v [NonEscapeCharacter](#prod-NonEscapeCharacter) :: [SourceCharacter](#prod-SourceCharacter) but not one of [EscapeCharacter](#prod-EscapeCharacter) or [LineTerminator](#prod-LineTerminator) [EscapeCharacter](#prod-EscapeCharacter) :: [SingleEscapeCharacter](#prod-SingleEscapeCharacter) [DecimalDigit](#prod-DecimalDigit) x u [LegacyOctalEscapeSequence](#prod-LegacyOctalEscapeSequence) :: 0 \[lookahead ∈ { 8, 9 }\] [NonZeroOctalDigit](#prod-NonZeroOctalDigit) \[lookahead ∉ [OctalDigit](#prod-OctalDigit)\] [ZeroToThree](#prod-ZeroToThree) [OctalDigit](#prod-OctalDigit) \[lookahead ∉ [OctalDigit](#prod-OctalDigit)\] [FourToSeven](#prod-FourToSeven) [OctalDigit](#prod-OctalDigit) [ZeroToThree](#prod-ZeroToThree) [OctalDigit](#prod-OctalDigit) [OctalDigit](#prod-OctalDigit) [NonZeroOctalDigit](#prod-NonZeroOctalDigit) :: [OctalDigit](#prod-OctalDigit) but not 0 [ZeroToThree](#prod-ZeroToThree) :: one of 0 1 2 3 [FourToSeven](#prod-FourToSeven) :: one of 4 5 6 7 [NonOctalDecimalEscapeSequence](#prod-NonOctalDecimalEscapeSequence) :: one of 8 9 [HexEscapeSequence](#prod-HexEscapeSequence) :: x [HexDigit](#prod-HexDigit) [HexDigit](#prod-HexDigit) [UnicodeEscapeSequence](#prod-UnicodeEscapeSequence) :: u [Hex4Digits](#prod-Hex4Digits) u{ [CodePoint](#prod-CodePoint) } [Hex4Digits](#prod-Hex4Digits) :: [HexDigit](#prod-HexDigit) [HexDigit](#prod-HexDigit) [HexDigit](#prod-HexDigit) [HexDigit](#prod-HexDigit)

The definition of the nonterminal [HexDigit](#prod-HexDigit) is given in [12.9.3](#sec-literals-numeric-literals). [SourceCharacter](#prod-SourceCharacter) is defined in [11.1](#sec-source-text).

Note 2

\<LF\> and \<CR\> cannot appear in a string literal, except as part of a [LineContinuation](#prod-LineContinuation) to produce the empty code points sequence. The proper way to include either in the String value of a string literal is to use an escape sequence such as `\n` or `\u000A`.

#### 12.9.4.1 Static Semantics: Early Errors

[EscapeSequence](#prod-EscapeSequence) :: [LegacyOctalEscapeSequence](#prod-LegacyOctalEscapeSequence) [NonOctalDecimalEscapeSequence](#prod-NonOctalDecimalEscapeSequence)

- It is a Syntax Error if [IsStrict](#sec-isstrict)(this production) is true.

Note 1

In [non-strict code](#non-strict-code), this syntax is [Legacy](#sec-conformance).

Note 2

It is possible for string literals to precede a [Use Strict Directive](#use-strict-directive) that places the enclosing code in [strict mode](#sec-strict-mode-code), and implementations must take care to enforce the above rules for such literals. For example, the following source text contains a Syntax Error:

``` javascript
function invalid() { "\7"; "use strict"; }
```

#### 12.9.4.2 Static Semantics: SV

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) SV takes no arguments and returns a String.

A string literal stands for a value of the [String type](#sec-ecmascript-language-types-string-type). SV produces String values for string literals through recursive application on the various parts of the string literal. As part of this process, some Unicode code points within the string literal are interpreted as having a [mathematical value](#mathematical-value), as described below or in [12.9.3](#sec-literals-numeric-literals).

- The SV of [StringLiteral](#prod-StringLiteral) :: " " is the empty String.
- The SV of [StringLiteral](#prod-StringLiteral) :: ' ' is the empty String.
- The SV of [DoubleStringCharacters](#prod-DoubleStringCharacters) :: [DoubleStringCharacter](#prod-DoubleStringCharacter) [DoubleStringCharacters](#prod-DoubleStringCharacters) is the [string-concatenation](#string-concatenation) of the SV of [DoubleStringCharacter](#prod-DoubleStringCharacter) and the SV of [DoubleStringCharacters](#prod-DoubleStringCharacters).
- The SV of [SingleStringCharacters](#prod-SingleStringCharacters) :: [SingleStringCharacter](#prod-SingleStringCharacter) [SingleStringCharacters](#prod-SingleStringCharacters) is the [string-concatenation](#string-concatenation) of the SV of [SingleStringCharacter](#prod-SingleStringCharacter) and the SV of [SingleStringCharacters](#prod-SingleStringCharacters).
- The SV of [DoubleStringCharacter](#prod-DoubleStringCharacter) :: [SourceCharacter](#prod-SourceCharacter) but not one of " or \\ or [LineTerminator](#prod-LineTerminator) is the result of performing [UTF16EncodeCodePoint](#sec-utf16encodecodepoint) on the code point matched by [SourceCharacter](#prod-SourceCharacter).
- The SV of [DoubleStringCharacter](#prod-DoubleStringCharacter) :: \<LS\> is the String value consisting of the code unit 0x2028 (LINE SEPARATOR).
- The SV of [DoubleStringCharacter](#prod-DoubleStringCharacter) :: \<PS\> is the String value consisting of the code unit 0x2029 (PARAGRAPH SEPARATOR).
- The SV of [DoubleStringCharacter](#prod-DoubleStringCharacter) :: [LineContinuation](#prod-LineContinuation) is the empty String.
- The SV of [SingleStringCharacter](#prod-SingleStringCharacter) :: [SourceCharacter](#prod-SourceCharacter) but not one of ' or \\ or [LineTerminator](#prod-LineTerminator) is the result of performing [UTF16EncodeCodePoint](#sec-utf16encodecodepoint) on the code point matched by [SourceCharacter](#prod-SourceCharacter).
- The SV of [SingleStringCharacter](#prod-SingleStringCharacter) :: \<LS\> is the String value consisting of the code unit 0x2028 (LINE SEPARATOR).
- The SV of [SingleStringCharacter](#prod-SingleStringCharacter) :: \<PS\> is the String value consisting of the code unit 0x2029 (PARAGRAPH SEPARATOR).
- The SV of [SingleStringCharacter](#prod-SingleStringCharacter) :: [LineContinuation](#prod-LineContinuation) is the empty String.
- The SV of [EscapeSequence](#prod-EscapeSequence) :: 0 is the String value consisting of the code unit 0x0000 (NULL).
- The SV of [CharacterEscapeSequence](#prod-CharacterEscapeSequence) :: [SingleEscapeCharacter](#prod-SingleEscapeCharacter) is the String value consisting of the code unit whose numeric value is determined by the [SingleEscapeCharacter](#prod-SingleEscapeCharacter) according to [Table 37](#table-string-single-character-escape-sequences).

| Escape Sequence | Code Unit Value | Unicode Character Name | Symbol |
|-----------------|-----------------|------------------------|--------|
| `\b`            | `0x0008`        | BACKSPACE              | \<BS\> |
| `\t`            | `0x0009`        | CHARACTER TABULATION   | \<HT\> |
| `\n`            | `0x000A`        | LINE FEED (LF)         | \<LF\> |
| `\v`            | `0x000B`        | LINE TABULATION        | \<VT\> |
| `\f`            | `0x000C`        | FORM FEED (FF)         | \<FF\> |
| `\r`            | `0x000D`        | CARRIAGE RETURN (CR)   | \<CR\> |
| `\"`            | `0x0022`        | QUOTATION MARK         | `"`    |
| `\'`            | `0x0027`        | APOSTROPHE             | `'`    |
| `\\`            | `0x005C`        | REVERSE SOLIDUS        | `\`    |

Table 37: String Single Character Escape Sequences

- The SV of [NonEscapeCharacter](#prod-NonEscapeCharacter) :: [SourceCharacter](#prod-SourceCharacter) but not one of [EscapeCharacter](#prod-EscapeCharacter) or [LineTerminator](#prod-LineTerminator) is the result of performing [UTF16EncodeCodePoint](#sec-utf16encodecodepoint) on the code point matched by [SourceCharacter](#prod-SourceCharacter).
- The SV of [EscapeSequence](#prod-EscapeSequence) :: [LegacyOctalEscapeSequence](#prod-LegacyOctalEscapeSequence) is the String value consisting of the code unit whose numeric value is the MV of [LegacyOctalEscapeSequence](#prod-LegacyOctalEscapeSequence).
- The SV of [NonOctalDecimalEscapeSequence](#prod-NonOctalDecimalEscapeSequence) :: 8 is the String value consisting of the code unit 0x0038 (DIGIT EIGHT).
- The SV of [NonOctalDecimalEscapeSequence](#prod-NonOctalDecimalEscapeSequence) :: 9 is the String value consisting of the code unit 0x0039 (DIGIT NINE).
- The SV of [HexEscapeSequence](#prod-HexEscapeSequence) :: x [HexDigit](#prod-HexDigit) [HexDigit](#prod-HexDigit) is the String value consisting of the code unit whose numeric value is the MV of [HexEscapeSequence](#prod-HexEscapeSequence).
- The SV of [Hex4Digits](#prod-Hex4Digits) :: [HexDigit](#prod-HexDigit) [HexDigit](#prod-HexDigit) [HexDigit](#prod-HexDigit) [HexDigit](#prod-HexDigit) is the String value consisting of the code unit whose numeric value is the MV of [Hex4Digits](#prod-Hex4Digits).
- The SV of [UnicodeEscapeSequence](#prod-UnicodeEscapeSequence) :: u{ [CodePoint](#prod-CodePoint) } is the result of performing [UTF16EncodeCodePoint](#sec-utf16encodecodepoint) on the MV of [CodePoint](#prod-CodePoint).
- The SV of [TemplateEscapeSequence](#prod-TemplateEscapeSequence) :: 0 is the String value consisting of the code unit 0x0000 (NULL).

#### 12.9.4.3 Static Semantics: MV

- The MV of [LegacyOctalEscapeSequence](#prod-LegacyOctalEscapeSequence) :: [ZeroToThree](#prod-ZeroToThree) [OctalDigit](#prod-OctalDigit) is (8 times the MV of [ZeroToThree](#prod-ZeroToThree)) plus the MV of [OctalDigit](#prod-OctalDigit).
- The MV of [LegacyOctalEscapeSequence](#prod-LegacyOctalEscapeSequence) :: [FourToSeven](#prod-FourToSeven) [OctalDigit](#prod-OctalDigit) is (8 times the MV of [FourToSeven](#prod-FourToSeven)) plus the MV of [OctalDigit](#prod-OctalDigit).
- The MV of [LegacyOctalEscapeSequence](#prod-LegacyOctalEscapeSequence) :: [ZeroToThree](#prod-ZeroToThree) [OctalDigit](#prod-OctalDigit) [OctalDigit](#prod-OctalDigit) is (64 (that is, 8\*\*²) times the MV of [ZeroToThree](#prod-ZeroToThree)) plus (8 times the MV of the first [OctalDigit](#prod-OctalDigit)) plus the MV of the second [OctalDigit](#prod-OctalDigit).
- The MV of [ZeroToThree](#prod-ZeroToThree) :: 0 is 0.
- The MV of [ZeroToThree](#prod-ZeroToThree) :: 1 is 1.
- The MV of [ZeroToThree](#prod-ZeroToThree) :: 2 is 2.
- The MV of [ZeroToThree](#prod-ZeroToThree) :: 3 is 3.
- The MV of [FourToSeven](#prod-FourToSeven) :: 4 is 4.
- The MV of [FourToSeven](#prod-FourToSeven) :: 5 is 5.
- The MV of [FourToSeven](#prod-FourToSeven) :: 6 is 6.
- The MV of [FourToSeven](#prod-FourToSeven) :: 7 is 7.
- The MV of [HexEscapeSequence](#prod-HexEscapeSequence) :: x [HexDigit](#prod-HexDigit) [HexDigit](#prod-HexDigit) is (16 times the MV of the first [HexDigit](#prod-HexDigit)) plus the MV of the second [HexDigit](#prod-HexDigit).
- The MV of [Hex4Digits](#prod-Hex4Digits) :: [HexDigit](#prod-HexDigit) [HexDigit](#prod-HexDigit) [HexDigit](#prod-HexDigit) [HexDigit](#prod-HexDigit) is (0x1000 × the MV of the first [HexDigit](#prod-HexDigit)) plus (0x100 × the MV of the second [HexDigit](#prod-HexDigit)) plus (0x10 × the MV of the third [HexDigit](#prod-HexDigit)) plus the MV of the fourth [HexDigit](#prod-HexDigit).

### 12.9.5 Regular Expression Literals

Note 1

A regular expression literal is an input element that is converted to a RegExp object (see [22.2](#sec-regexp-regular-expression-objects)) each time the literal is evaluated. Two regular expression literals in a program evaluate to regular expression objects that never compare as `===` to each other even if the two literals' contents are identical. A RegExp object may also be created at runtime by `new RegExp` or calling the RegExp [constructor](#constructor) as a function (see [22.2.4](#sec-regexp-constructor)).

The productions below describe the syntax for a regular expression literal and are used by the input element scanner to find the end of the regular expression literal. The source text comprising the [RegularExpressionBody](#prod-RegularExpressionBody) and the [RegularExpressionFlags](#prod-RegularExpressionFlags) are subsequently parsed again using the more stringent ECMAScript Regular Expression grammar ([22.2.1](#sec-patterns)).

An implementation may extend the ECMAScript Regular Expression grammar defined in [22.2.1](#sec-patterns), but it must not extend the [RegularExpressionBody](#prod-RegularExpressionBody) and [RegularExpressionFlags](#prod-RegularExpressionFlags) productions defined below or the productions used by these productions.

#### Syntax

[RegularExpressionLiteral](#prod-RegularExpressionLiteral) :: / [RegularExpressionBody](#prod-RegularExpressionBody) / [RegularExpressionFlags](#prod-RegularExpressionFlags) [RegularExpressionBody](#prod-RegularExpressionBody) :: [RegularExpressionFirstChar](#prod-RegularExpressionFirstChar) [RegularExpressionChars](#prod-RegularExpressionChars) [RegularExpressionChars](#prod-RegularExpressionChars) :: \[empty\] [RegularExpressionChars](#prod-RegularExpressionChars) [RegularExpressionChar](#prod-RegularExpressionChar) [RegularExpressionFirstChar](#prod-RegularExpressionFirstChar) :: [RegularExpressionNonTerminator](#prod-RegularExpressionNonTerminator) but not one of \* or \\ or / or \[ [RegularExpressionBackslashSequence](#prod-RegularExpressionBackslashSequence) [RegularExpressionClass](#prod-RegularExpressionClass) [RegularExpressionChar](#prod-RegularExpressionChar) :: [RegularExpressionNonTerminator](#prod-RegularExpressionNonTerminator) but not one of \\ or / or \[ [RegularExpressionBackslashSequence](#prod-RegularExpressionBackslashSequence) [RegularExpressionClass](#prod-RegularExpressionClass) [RegularExpressionBackslashSequence](#prod-RegularExpressionBackslashSequence) :: \\ [RegularExpressionNonTerminator](#prod-RegularExpressionNonTerminator) [RegularExpressionNonTerminator](#prod-RegularExpressionNonTerminator) :: [SourceCharacter](#prod-SourceCharacter) but not [LineTerminator](#prod-LineTerminator) [RegularExpressionClass](#prod-RegularExpressionClass) :: \[ [RegularExpressionClassChars](#prod-RegularExpressionClassChars) \] [RegularExpressionClassChars](#prod-RegularExpressionClassChars) :: \[empty\] [RegularExpressionClassChars](#prod-RegularExpressionClassChars) [RegularExpressionClassChar](#prod-RegularExpressionClassChar) [RegularExpressionClassChar](#prod-RegularExpressionClassChar) :: [RegularExpressionNonTerminator](#prod-RegularExpressionNonTerminator) but not one of \] or \\ [RegularExpressionBackslashSequence](#prod-RegularExpressionBackslashSequence) [RegularExpressionFlags](#prod-RegularExpressionFlags) :: \[empty\] [RegularExpressionFlags](#prod-RegularExpressionFlags) [IdentifierPartChar](#prod-IdentifierPartChar) Note 2

Regular expression literals may not be empty; instead of representing an empty regular expression literal, the code unit sequence `//` starts a single-line comment. To specify an empty regular expression, use: `/(?:)/`.

#### 12.9.5.1 Static Semantics: BodyText

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) BodyText takes no arguments and returns source text. It is defined piecewise over the following productions:

[RegularExpressionLiteral](#prod-RegularExpressionLiteral) :: / [RegularExpressionBody](#prod-RegularExpressionBody) / [RegularExpressionFlags](#prod-RegularExpressionFlags)

1.  Return the source text that was recognized as [RegularExpressionBody](#prod-RegularExpressionBody).

#### 12.9.5.2 Static Semantics: FlagText

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) FlagText takes no arguments and returns source text. It is defined piecewise over the following productions:

[RegularExpressionLiteral](#prod-RegularExpressionLiteral) :: / [RegularExpressionBody](#prod-RegularExpressionBody) / [RegularExpressionFlags](#prod-RegularExpressionFlags)

1.  Return the source text that was recognized as [RegularExpressionFlags](#prod-RegularExpressionFlags).

### 12.9.6 Template Literal Lexical Components

#### Syntax

[Template](#prod-Template) :: [NoSubstitutionTemplate](#prod-NoSubstitutionTemplate) [TemplateHead](#prod-TemplateHead) [NoSubstitutionTemplate](#prod-NoSubstitutionTemplate) :: \` [TemplateCharacters](#prod-TemplateCharacters)opt \` [TemplateHead](#prod-TemplateHead) :: \` [TemplateCharacters](#prod-TemplateCharacters)opt \${ [TemplateSubstitutionTail](#prod-TemplateSubstitutionTail) :: [TemplateMiddle](#prod-TemplateMiddle) [TemplateTail](#prod-TemplateTail) [TemplateMiddle](#prod-TemplateMiddle) :: } [TemplateCharacters](#prod-TemplateCharacters)opt \${ [TemplateTail](#prod-TemplateTail) :: } [TemplateCharacters](#prod-TemplateCharacters)opt \` [TemplateCharacters](#prod-TemplateCharacters) :: [TemplateCharacter](#prod-TemplateCharacter) [TemplateCharacters](#prod-TemplateCharacters)opt [TemplateCharacter](#prod-TemplateCharacter) :: \$ \[lookahead ≠ {\] \\ [TemplateEscapeSequence](#prod-TemplateEscapeSequence) \\ [NotEscapeSequence](#prod-NotEscapeSequence) [LineContinuation](#prod-LineContinuation) [LineTerminatorSequence](#prod-LineTerminatorSequence) [SourceCharacter](#prod-SourceCharacter) but not one of \` or \\ or \$ or [LineTerminator](#prod-LineTerminator) [TemplateEscapeSequence](#prod-TemplateEscapeSequence) :: [CharacterEscapeSequence](#prod-CharacterEscapeSequence) 0 \[lookahead ∉ [DecimalDigit](#prod-DecimalDigit)\] [HexEscapeSequence](#prod-HexEscapeSequence) [UnicodeEscapeSequence](#prod-UnicodeEscapeSequence) [NotEscapeSequence](#prod-NotEscapeSequence) :: 0 [DecimalDigit](#prod-DecimalDigit) [DecimalDigit](#prod-DecimalDigit) but not 0 x \[lookahead ∉ [HexDigit](#prod-HexDigit)\] x [HexDigit](#prod-HexDigit) \[lookahead ∉ [HexDigit](#prod-HexDigit)\] u \[lookahead ∉ [HexDigit](#prod-HexDigit)\] \[lookahead ≠ {\] u [HexDigit](#prod-HexDigit) \[lookahead ∉ [HexDigit](#prod-HexDigit)\] u [HexDigit](#prod-HexDigit) [HexDigit](#prod-HexDigit) \[lookahead ∉ [HexDigit](#prod-HexDigit)\] u [HexDigit](#prod-HexDigit) [HexDigit](#prod-HexDigit) [HexDigit](#prod-HexDigit) \[lookahead ∉ [HexDigit](#prod-HexDigit)\] u { \[lookahead ∉ [HexDigit](#prod-HexDigit)\] u { [NotCodePoint](#prod-NotCodePoint) \[lookahead ∉ [HexDigit](#prod-HexDigit)\] u { [CodePoint](#prod-CodePoint) \[lookahead ∉ [HexDigit](#prod-HexDigit)\] \[lookahead ≠ }\] [NotCodePoint](#prod-NotCodePoint) :: [HexDigits](#prod-HexDigits)\[~Sep\] but only if the MV of [HexDigits](#prod-HexDigits) \> 0x10FFFF [CodePoint](#prod-CodePoint) :: [HexDigits](#prod-HexDigits)\[~Sep\] but only if the MV of [HexDigits](#prod-HexDigits) ≤ 0x10FFFF Note

[TemplateSubstitutionTail](#prod-TemplateSubstitutionTail) is used by the [InputElementTemplateTail](#prod-InputElementTemplateTail) alternative lexical goal.

#### 12.9.6.1 Static Semantics: TV

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) TV takes no arguments and returns a String or undefined. A template literal component is interpreted by TV as a value of the [String type](#sec-ecmascript-language-types-string-type). TV is used to construct the indexed components of a template object (colloquially, the template values). In TV, escape sequences are replaced by the UTF-16 code unit(s) of the Unicode code point represented by the escape sequence.

- The TV of [NoSubstitutionTemplate](#prod-NoSubstitutionTemplate) :: \` \` is the empty String.
- The TV of [TemplateHead](#prod-TemplateHead) :: \` \${ is the empty String.
- The TV of [TemplateMiddle](#prod-TemplateMiddle) :: } \${ is the empty String.
- The TV of [TemplateTail](#prod-TemplateTail) :: } \` is the empty String.
- The TV of [TemplateCharacters](#prod-TemplateCharacters) :: [TemplateCharacter](#prod-TemplateCharacter) [TemplateCharacters](#prod-TemplateCharacters) is undefined if the TV of [TemplateCharacter](#prod-TemplateCharacter) is undefined or the TV of [TemplateCharacters](#prod-TemplateCharacters) is undefined. Otherwise, it is the [string-concatenation](#string-concatenation) of the TV of [TemplateCharacter](#prod-TemplateCharacter) and the TV of [TemplateCharacters](#prod-TemplateCharacters).
- The TV of [TemplateCharacter](#prod-TemplateCharacter) :: [SourceCharacter](#prod-SourceCharacter) but not one of \` or \\ or \$ or [LineTerminator](#prod-LineTerminator) is the result of performing [UTF16EncodeCodePoint](#sec-utf16encodecodepoint) on the code point matched by [SourceCharacter](#prod-SourceCharacter).
- The TV of [TemplateCharacter](#prod-TemplateCharacter) :: \$ is the String value consisting of the code unit 0x0024 (DOLLAR SIGN).
- The TV of [TemplateCharacter](#prod-TemplateCharacter) :: \\ [TemplateEscapeSequence](#prod-TemplateEscapeSequence) is the [SV](#sec-static-semantics-sv) of [TemplateEscapeSequence](#prod-TemplateEscapeSequence).
- The TV of [TemplateCharacter](#prod-TemplateCharacter) :: \\ [NotEscapeSequence](#prod-NotEscapeSequence) is undefined.
- The TV of [TemplateCharacter](#prod-TemplateCharacter) :: [LineTerminatorSequence](#prod-LineTerminatorSequence) is the [TRV](#sec-static-semantics-trv) of [LineTerminatorSequence](#prod-LineTerminatorSequence).
- The TV of [LineContinuation](#prod-LineContinuation) :: \\ [LineTerminatorSequence](#prod-LineTerminatorSequence) is the empty String.

#### 12.9.6.2 Static Semantics: TRV

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) TRV takes no arguments and returns a String. A template literal component is interpreted by TRV as a value of the [String type](#sec-ecmascript-language-types-string-type). TRV is used to construct the raw components of a template object (colloquially, the template raw values). TRV is similar to [TV](#sec-static-semantics-tv) with the difference being that in TRV, escape sequences are interpreted as they appear in the literal.

- The TRV of [NoSubstitutionTemplate](#prod-NoSubstitutionTemplate) :: \` \` is the empty String.
- The TRV of [TemplateHead](#prod-TemplateHead) :: \` \${ is the empty String.
- The TRV of [TemplateMiddle](#prod-TemplateMiddle) :: } \${ is the empty String.
- The TRV of [TemplateTail](#prod-TemplateTail) :: } \` is the empty String.
- The TRV of [TemplateCharacters](#prod-TemplateCharacters) :: [TemplateCharacter](#prod-TemplateCharacter) [TemplateCharacters](#prod-TemplateCharacters) is the [string-concatenation](#string-concatenation) of the TRV of [TemplateCharacter](#prod-TemplateCharacter) and the TRV of [TemplateCharacters](#prod-TemplateCharacters).
- The TRV of [TemplateCharacter](#prod-TemplateCharacter) :: [SourceCharacter](#prod-SourceCharacter) but not one of \` or \\ or \$ or [LineTerminator](#prod-LineTerminator) is the result of performing [UTF16EncodeCodePoint](#sec-utf16encodecodepoint) on the code point matched by [SourceCharacter](#prod-SourceCharacter).
- The TRV of [TemplateCharacter](#prod-TemplateCharacter) :: \$ is the String value consisting of the code unit 0x0024 (DOLLAR SIGN).
- The TRV of [TemplateCharacter](#prod-TemplateCharacter) :: \\ [TemplateEscapeSequence](#prod-TemplateEscapeSequence) is the [string-concatenation](#string-concatenation) of the code unit 0x005C (REVERSE SOLIDUS) and the TRV of [TemplateEscapeSequence](#prod-TemplateEscapeSequence).
- The TRV of [TemplateCharacter](#prod-TemplateCharacter) :: \\ [NotEscapeSequence](#prod-NotEscapeSequence) is the [string-concatenation](#string-concatenation) of the code unit 0x005C (REVERSE SOLIDUS) and the TRV of [NotEscapeSequence](#prod-NotEscapeSequence).
- The TRV of [TemplateEscapeSequence](#prod-TemplateEscapeSequence) :: 0 is the String value consisting of the code unit 0x0030 (DIGIT ZERO).
- The TRV of [NotEscapeSequence](#prod-NotEscapeSequence) :: 0 [DecimalDigit](#prod-DecimalDigit) is the [string-concatenation](#string-concatenation) of the code unit 0x0030 (DIGIT ZERO) and the TRV of [DecimalDigit](#prod-DecimalDigit).
- The TRV of [NotEscapeSequence](#prod-NotEscapeSequence) :: x \[lookahead ∉ [HexDigit](#prod-HexDigit)\] is the String value consisting of the code unit 0x0078 (LATIN SMALL LETTER X).
- The TRV of [NotEscapeSequence](#prod-NotEscapeSequence) :: x [HexDigit](#prod-HexDigit) \[lookahead ∉ [HexDigit](#prod-HexDigit)\] is the [string-concatenation](#string-concatenation) of the code unit 0x0078 (LATIN SMALL LETTER X) and the TRV of [HexDigit](#prod-HexDigit).
- The TRV of [NotEscapeSequence](#prod-NotEscapeSequence) :: u \[lookahead ∉ [HexDigit](#prod-HexDigit)\] \[lookahead ≠ {\] is the String value consisting of the code unit 0x0075 (LATIN SMALL LETTER U).
- The TRV of [NotEscapeSequence](#prod-NotEscapeSequence) :: u [HexDigit](#prod-HexDigit) \[lookahead ∉ [HexDigit](#prod-HexDigit)\] is the [string-concatenation](#string-concatenation) of the code unit 0x0075 (LATIN SMALL LETTER U) and the TRV of [HexDigit](#prod-HexDigit).
- The TRV of [NotEscapeSequence](#prod-NotEscapeSequence) :: u [HexDigit](#prod-HexDigit) [HexDigit](#prod-HexDigit) \[lookahead ∉ [HexDigit](#prod-HexDigit)\] is the [string-concatenation](#string-concatenation) of the code unit 0x0075 (LATIN SMALL LETTER U), the TRV of the first [HexDigit](#prod-HexDigit), and the TRV of the second [HexDigit](#prod-HexDigit).
- The TRV of [NotEscapeSequence](#prod-NotEscapeSequence) :: u [HexDigit](#prod-HexDigit) [HexDigit](#prod-HexDigit) [HexDigit](#prod-HexDigit) \[lookahead ∉ [HexDigit](#prod-HexDigit)\] is the [string-concatenation](#string-concatenation) of the code unit 0x0075 (LATIN SMALL LETTER U), the TRV of the first [HexDigit](#prod-HexDigit), the TRV of the second [HexDigit](#prod-HexDigit), and the TRV of the third [HexDigit](#prod-HexDigit).
- The TRV of [NotEscapeSequence](#prod-NotEscapeSequence) :: u { \[lookahead ∉ [HexDigit](#prod-HexDigit)\] is the [string-concatenation](#string-concatenation) of the code unit 0x0075 (LATIN SMALL LETTER U) and the code unit 0x007B (LEFT CURLY BRACKET).
- The TRV of [NotEscapeSequence](#prod-NotEscapeSequence) :: u { [NotCodePoint](#prod-NotCodePoint) \[lookahead ∉ [HexDigit](#prod-HexDigit)\] is the [string-concatenation](#string-concatenation) of the code unit 0x0075 (LATIN SMALL LETTER U), the code unit 0x007B (LEFT CURLY BRACKET), and the TRV of [NotCodePoint](#prod-NotCodePoint).
- The TRV of [NotEscapeSequence](#prod-NotEscapeSequence) :: u { [CodePoint](#prod-CodePoint) \[lookahead ∉ [HexDigit](#prod-HexDigit)\] \[lookahead ≠ }\] is the [string-concatenation](#string-concatenation) of the code unit 0x0075 (LATIN SMALL LETTER U), the code unit 0x007B (LEFT CURLY BRACKET), and the TRV of [CodePoint](#prod-CodePoint).
- The TRV of [DecimalDigit](#prod-DecimalDigit) :: one of 0 1 2 3 4 5 6 7 8 9 is the result of performing [UTF16EncodeCodePoint](#sec-utf16encodecodepoint) on the single code point matched by this production.
- The TRV of [CharacterEscapeSequence](#prod-CharacterEscapeSequence) :: [NonEscapeCharacter](#prod-NonEscapeCharacter) is the [SV](#sec-static-semantics-sv) of [NonEscapeCharacter](#prod-NonEscapeCharacter).
- The TRV of [SingleEscapeCharacter](#prod-SingleEscapeCharacter) :: one of ' " \\ b f n r t v is the result of performing [UTF16EncodeCodePoint](#sec-utf16encodecodepoint) on the single code point matched by this production.
- The TRV of [HexEscapeSequence](#prod-HexEscapeSequence) :: x [HexDigit](#prod-HexDigit) [HexDigit](#prod-HexDigit) is the [string-concatenation](#string-concatenation) of the code unit 0x0078 (LATIN SMALL LETTER X), the TRV of the first [HexDigit](#prod-HexDigit), and the TRV of the second [HexDigit](#prod-HexDigit).
- The TRV of [UnicodeEscapeSequence](#prod-UnicodeEscapeSequence) :: u [Hex4Digits](#prod-Hex4Digits) is the [string-concatenation](#string-concatenation) of the code unit 0x0075 (LATIN SMALL LETTER U) and the TRV of [Hex4Digits](#prod-Hex4Digits).
- The TRV of [UnicodeEscapeSequence](#prod-UnicodeEscapeSequence) :: u{ [CodePoint](#prod-CodePoint) } is the [string-concatenation](#string-concatenation) of the code unit 0x0075 (LATIN SMALL LETTER U), the code unit 0x007B (LEFT CURLY BRACKET), the TRV of [CodePoint](#prod-CodePoint), and the code unit 0x007D (RIGHT CURLY BRACKET).
- The TRV of [Hex4Digits](#prod-Hex4Digits) :: [HexDigit](#prod-HexDigit) [HexDigit](#prod-HexDigit) [HexDigit](#prod-HexDigit) [HexDigit](#prod-HexDigit) is the [string-concatenation](#string-concatenation) of the TRV of the first [HexDigit](#prod-HexDigit), the TRV of the second [HexDigit](#prod-HexDigit), the TRV of the third [HexDigit](#prod-HexDigit), and the TRV of the fourth [HexDigit](#prod-HexDigit).
- The TRV of [HexDigits](#prod-HexDigits) :: [HexDigits](#prod-HexDigits) [HexDigit](#prod-HexDigit) is the [string-concatenation](#string-concatenation) of the TRV of [HexDigits](#prod-HexDigits) and the TRV of [HexDigit](#prod-HexDigit).
- The TRV of [HexDigit](#prod-HexDigit) :: one of 0 1 2 3 4 5 6 7 8 9 a b c d e f A B C D E F is the result of performing [UTF16EncodeCodePoint](#sec-utf16encodecodepoint) on the single code point matched by this production.
- The TRV of [LineContinuation](#prod-LineContinuation) :: \\ [LineTerminatorSequence](#prod-LineTerminatorSequence) is the [string-concatenation](#string-concatenation) of the code unit 0x005C (REVERSE SOLIDUS) and the TRV of [LineTerminatorSequence](#prod-LineTerminatorSequence).
- The TRV of [LineTerminatorSequence](#prod-LineTerminatorSequence) :: \<LF\> is the String value consisting of the code unit 0x000A (LINE FEED).
- The TRV of [LineTerminatorSequence](#prod-LineTerminatorSequence) :: \<CR\> is the String value consisting of the code unit 0x000A (LINE FEED).
- The TRV of [LineTerminatorSequence](#prod-LineTerminatorSequence) :: \<LS\> is the String value consisting of the code unit 0x2028 (LINE SEPARATOR).
- The TRV of [LineTerminatorSequence](#prod-LineTerminatorSequence) :: \<PS\> is the String value consisting of the code unit 0x2029 (PARAGRAPH SEPARATOR).
- The TRV of [LineTerminatorSequence](#prod-LineTerminatorSequence) :: \<CR\> \<LF\> is the String value consisting of the code unit 0x000A (LINE FEED).

Note

[TV](#sec-static-semantics-tv) excludes the code units of [LineContinuation](#prod-LineContinuation) while TRV includes them. \<CR\>\<LF\> and \<CR\> [LineTerminatorSequence](#prod-LineTerminatorSequence)s are normalized to \<LF\> for both [TV](#sec-static-semantics-tv) and TRV. An explicit [TemplateEscapeSequence](#prod-TemplateEscapeSequence) is needed to include a \<CR\> or \<CR\>\<LF\> sequence.

## 12.10 Automatic Semicolon Insertion

Most ECMAScript statements and declarations must be terminated with a semicolon. Such semicolons may always appear explicitly in the source text. For convenience, however, such semicolons may be omitted from the source text in certain situations. These situations are described by saying that semicolons are automatically inserted into the source code token stream in those situations.

### 12.10.1 Rules of Automatic Semicolon Insertion

In the following rules, “token” means the actual recognized lexical token determined using the current lexical [goal symbol](#sec-context-free-grammars) as described in clause [12](#sec-ecmascript-language-lexical-grammar).

There are three basic rules of semicolon insertion:

1.  When, as the source text is parsed from left to right, a token (called the *offending token*) is encountered that is not allowed by any production of the grammar, then a semicolon is automatically inserted before the offending token if one or more of the following conditions is true:

    - The offending token is separated from the previous token by at least one [LineTerminator](#prod-LineTerminator).
    - The offending token is `}`.
    - The previous token is `)` and the inserted semicolon would then be parsed as the terminating semicolon of a do-while statement ([14.7.2](#sec-do-while-statement)).

2.  When, as the source text is parsed from left to right, the end of the input stream of tokens is encountered and the parser is unable to parse the input token stream as a single instance of the goal nonterminal, then a semicolon is automatically inserted at the end of the input stream.

3.  When, as the source text is parsed from left to right, a token is encountered that is allowed by some production of the grammar, but the production is a *restricted production* and the token would be the first token for a terminal or nonterminal immediately following the annotation “\[no [LineTerminator](#prod-LineTerminator) here\]” within the restricted production (and therefore such a token is called a restricted token), and the restricted token is separated from the previous token by at least one [LineTerminator](#prod-LineTerminator), then a semicolon is automatically inserted before the restricted token.

However, there is an additional overriding condition on the preceding rules: a semicolon is never inserted automatically if the semicolon would then be parsed as an empty statement or if that semicolon would become one of the two semicolons in the header of a `for` statement (see [14.7.4](#sec-for-statement)).

Note

The following are the only restricted productions in the grammar:

[UpdateExpression](#prod-UpdateExpression)\[Yield, Await\] : [LeftHandSideExpression](#prod-LeftHandSideExpression)\[?Yield, ?Await\] \[no [LineTerminator](#prod-LineTerminator) here\] ++ [LeftHandSideExpression](#prod-LeftHandSideExpression)\[?Yield, ?Await\] \[no [LineTerminator](#prod-LineTerminator) here\] -- [ContinueStatement](#prod-ContinueStatement)\[Yield, Await\] : continue ; continue \[no [LineTerminator](#prod-LineTerminator) here\] [LabelIdentifier](#prod-LabelIdentifier)\[?Yield, ?Await\] ; [BreakStatement](#prod-BreakStatement)\[Yield, Await\] : break ; break \[no [LineTerminator](#prod-LineTerminator) here\] [LabelIdentifier](#prod-LabelIdentifier)\[?Yield, ?Await\] ; [ReturnStatement](#prod-ReturnStatement)\[Yield, Await\] : return ; return \[no [LineTerminator](#prod-LineTerminator) here\] [Expression](#prod-Expression)\[+In, ?Yield, ?Await\] ; [ThrowStatement](#prod-ThrowStatement)\[Yield, Await\] : throw \[no [LineTerminator](#prod-LineTerminator) here\] [Expression](#prod-Expression)\[+In, ?Yield, ?Await\] ; [YieldExpression](#prod-YieldExpression)\[In, Await\] : yield yield \[no [LineTerminator](#prod-LineTerminator) here\] [AssignmentExpression](#prod-AssignmentExpression)\[?In, +Yield, ?Await\] yield \[no [LineTerminator](#prod-LineTerminator) here\] \* [AssignmentExpression](#prod-AssignmentExpression)\[?In, +Yield, ?Await\] [ArrowFunction](#prod-ArrowFunction)\[In, Yield, Await\] : [ArrowParameters](#prod-ArrowParameters)\[?Yield, ?Await\] \[no [LineTerminator](#prod-LineTerminator) here\] =\> [ConciseBody](#prod-ConciseBody)\[?In\] [AsyncFunctionDeclaration](#prod-AsyncFunctionDeclaration)\[Yield, Await, Default\] : async \[no [LineTerminator](#prod-LineTerminator) here\] function [BindingIdentifier](#prod-BindingIdentifier)\[?Yield, ?Await\] ( [FormalParameters](#prod-FormalParameters)\[~Yield, +Await\] ) { [AsyncFunctionBody](#prod-AsyncFunctionBody) } \[+Default\] async \[no [LineTerminator](#prod-LineTerminator) here\] function ( [FormalParameters](#prod-FormalParameters)\[~Yield, +Await\] ) { [AsyncFunctionBody](#prod-AsyncFunctionBody) } [AsyncFunctionExpression](#prod-AsyncFunctionExpression) : async \[no [LineTerminator](#prod-LineTerminator) here\] function [BindingIdentifier](#prod-BindingIdentifier)\[~Yield, +Await\]opt ( [FormalParameters](#prod-FormalParameters)\[~Yield, +Await\] ) { [AsyncFunctionBody](#prod-AsyncFunctionBody) } [AsyncMethod](#prod-AsyncMethod)\[Yield, Await\] : async \[no [LineTerminator](#prod-LineTerminator) here\] [ClassElementName](#prod-ClassElementName)\[?Yield, ?Await\] ( [UniqueFormalParameters](#prod-UniqueFormalParameters)\[~Yield, +Await\] ) { [AsyncFunctionBody](#prod-AsyncFunctionBody) } [AsyncGeneratorDeclaration](#prod-AsyncGeneratorDeclaration)\[Yield, Await, Default\] : async \[no [LineTerminator](#prod-LineTerminator) here\] function \* [BindingIdentifier](#prod-BindingIdentifier)\[?Yield, ?Await\] ( [FormalParameters](#prod-FormalParameters)\[+Yield, +Await\] ) { [AsyncGeneratorBody](#prod-AsyncGeneratorBody) } \[+Default\] async \[no [LineTerminator](#prod-LineTerminator) here\] function \* ( [FormalParameters](#prod-FormalParameters)\[+Yield, +Await\] ) { [AsyncGeneratorBody](#prod-AsyncGeneratorBody) } [AsyncGeneratorExpression](#prod-AsyncGeneratorExpression) : async \[no [LineTerminator](#prod-LineTerminator) here\] function \* [BindingIdentifier](#prod-BindingIdentifier)\[+Yield, +Await\]opt ( [FormalParameters](#prod-FormalParameters)\[+Yield, +Await\] ) { [AsyncGeneratorBody](#prod-AsyncGeneratorBody) } [AsyncGeneratorMethod](#prod-AsyncGeneratorMethod)\[Yield, Await\] : async \[no [LineTerminator](#prod-LineTerminator) here\] \* [ClassElementName](#prod-ClassElementName)\[?Yield, ?Await\] ( [UniqueFormalParameters](#prod-UniqueFormalParameters)\[+Yield, +Await\] ) { [AsyncGeneratorBody](#prod-AsyncGeneratorBody) } [AsyncArrowFunction](#prod-AsyncArrowFunction)\[In, Yield, Await\] : async \[no [LineTerminator](#prod-LineTerminator) here\] [AsyncArrowBindingIdentifier](#prod-AsyncArrowBindingIdentifier)\[?Yield\] \[no [LineTerminator](#prod-LineTerminator) here\] =\> [AsyncConciseBody](#prod-AsyncConciseBody)\[?In\] [CoverCallExpressionAndAsyncArrowHead](#prod-CoverCallExpressionAndAsyncArrowHead)\[?Yield, ?Await\] \[no [LineTerminator](#prod-LineTerminator) here\] =\> [AsyncConciseBody](#prod-AsyncConciseBody)\[?In\] [AsyncArrowHead](#prod-AsyncArrowHead) : async \[no [LineTerminator](#prod-LineTerminator) here\] [ArrowFormalParameters](#prod-ArrowFormalParameters)\[~Yield, +Await\]

The practical effect of these restricted productions is as follows:

- When a `++` or `--` token is encountered where the parser would treat it as a postfix operator, and at least one [LineTerminator](#prod-LineTerminator) occurred between the preceding token and the `++` or `--` token, then a semicolon is automatically inserted before the `++` or `--` token.
- When a `continue`, `break`, `return`, `throw`, or `yield` token is encountered and a [LineTerminator](#prod-LineTerminator) is encountered before the next token, a semicolon is automatically inserted after the `continue`, `break`, `return`, `throw`, or `yield` token.
- When arrow function parameter(s) are followed by a [LineTerminator](#prod-LineTerminator) before a `=>` token, a semicolon is automatically inserted and the punctuator causes a syntax error.
- When an `async` token is followed by a [LineTerminator](#prod-LineTerminator) before a `function` or [IdentifierName](#prod-IdentifierName) or `(` token, a semicolon is automatically inserted and the `async` token is not treated as part of the same expression or class element as the following tokens.
- When an `async` token is followed by a [LineTerminator](#prod-LineTerminator) before a `*` token, a semicolon is automatically inserted and the punctuator causes a syntax error.

The resulting practical advice to ECMAScript programmers is:

- A postfix `++` or `--` operator should be on the same line as its operand.
- An [Expression](#prod-Expression) in a `return` or `throw` statement or an [AssignmentExpression](#prod-AssignmentExpression) in a `yield` expression should start on the same line as the `return`, `throw`, or `yield` token.
- A [LabelIdentifier](#prod-LabelIdentifier) in a `break` or `continue` statement should be on the same line as the `break` or `continue` token.
- The end of an arrow function's parameter(s) and its `=>` should be on the same line.
- The `async` token preceding an asynchronous function or method should be on the same line as the immediately following token.

### 12.10.2 Examples of Automatic Semicolon Insertion

*This section is non-normative.*

The source

``` javascript
{ 1 2 } 3
```

is not a valid sentence in the ECMAScript grammar, even with the automatic semicolon insertion rules. In contrast, the source

``` javascript
{ 1
2 } 3
```

is also not a valid ECMAScript sentence, but is transformed by automatic semicolon insertion into the following:

``` javascript
{ 1
;2 ;} 3;
```

which is a valid ECMAScript sentence.

The source

``` javascript
for (a; b
)
```

is not a valid ECMAScript sentence and is not altered by automatic semicolon insertion because the semicolon is needed for the header of a `for` statement. Automatic semicolon insertion never inserts one of the two semicolons in the header of a `for` statement.

The source

``` javascript
return
a + b
```

is transformed by automatic semicolon insertion into the following:

``` javascript
return;
a + b;
```

Note 1

The expression `a + b` is not treated as a value to be returned by the `return` statement, because a [LineTerminator](#prod-LineTerminator) separates it from the token `return`.

The source

``` javascript
a = b
++c
```

is transformed by automatic semicolon insertion into the following:

``` javascript
a = b;
++c;
```

Note 2

The token `++` is not treated as a postfix operator applying to the variable `b`, because a [LineTerminator](#prod-LineTerminator) occurs between `b` and `++`.

The source

``` javascript
if (a > b)
else c = d
```

is not a valid ECMAScript sentence and is not altered by automatic semicolon insertion before the `else` token, even though no production of the grammar applies at that point, because an automatically inserted semicolon would then be parsed as an empty statement.

The source

``` javascript
a = b + c
(d + e).print()
```

is *not* transformed by automatic semicolon insertion, because the parenthesized expression that begins the second line can be interpreted as an argument list for a function call:

``` javascript
a = b + c(d + e).print()
```

In the circumstance that an assignment statement must begin with a left parenthesis, it is a good idea for the programmer to provide an explicit semicolon at the end of the preceding statement rather than to rely on automatic semicolon insertion.

### 12.10.3 Interesting Cases of Automatic Semicolon Insertion

*This section is non-normative.*

ECMAScript programs can be written in a style with very few semicolons by relying on automatic semicolon insertion. As described above, semicolons are not inserted at every newline, and automatic semicolon insertion can depend on multiple tokens across line terminators.

As new syntactic features are added to ECMAScript, additional grammar productions could be added that cause lines relying on automatic semicolon insertion preceding them to change grammar productions when parsed.

For the purposes of this section, a case of automatic semicolon insertion is considered interesting if it is a place where a semicolon may or may not be inserted, depending on the source text which precedes it. The rest of this section describes a number of interesting cases of automatic semicolon insertion in this version of ECMAScript.

#### 12.10.3.1 Interesting Cases of Automatic Semicolon Insertion in Statement Lists

In a [StatementList](#prod-StatementList), many [StatementListItem](#prod-StatementListItem)s end in semicolons, which may be omitted using automatic semicolon insertion. As a consequence of the rules above, at the end of a line ending an expression, a semicolon is required if the following line begins with any of the following:

- **An opening parenthesis (`(`)**. Without a semicolon, the two lines together are treated as a [CallExpression](#prod-CallExpression).
- **An opening square bracket (`[`)**. Without a semicolon, the two lines together are treated as property access, rather than an [ArrayLiteral](#prod-ArrayLiteral) or [ArrayAssignmentPattern](#prod-ArrayAssignmentPattern).
- **A template literal (`` ` ``)**. Without a semicolon, the two lines together are interpreted as a tagged Template ([13.3.11](#sec-tagged-templates)), with the previous expression as the [MemberExpression](#prod-MemberExpression).
- **Unary `+` or `-`**. Without a semicolon, the two lines together are interpreted as a usage of the corresponding binary operator.
- **A RegExp literal**. Without a semicolon, the two lines together may be parsed instead as the `/` [MultiplicativeOperator](#prod-MultiplicativeOperator), for example if the RegExp has flags.

#### 12.10.3.2 Cases of Automatic Semicolon Insertion and “\[no [LineTerminator](#prod-LineTerminator) here\]”

*This section is non-normative.*

ECMAScript contains grammar productions which include “\[no [LineTerminator](#prod-LineTerminator) here\]”. These productions are sometimes a means to have optional operands in the grammar. Introducing a [LineTerminator](#prod-LineTerminator) in these locations would change the grammar production of a source text by using the grammar production without the optional operand.

The rest of this section describes a number of productions using “\[no [LineTerminator](#prod-LineTerminator) here\]” in this version of ECMAScript.

##### 12.10.3.2.1 List of Grammar Productions with Optional Operands and “\[no [LineTerminator](#prod-LineTerminator) here\]”

- [UpdateExpression](#prod-UpdateExpression).
- [ContinueStatement](#prod-ContinueStatement).
- [BreakStatement](#prod-BreakStatement).
- [ReturnStatement](#prod-ReturnStatement).
- [YieldExpression](#prod-YieldExpression).
- Async Function Definitions ([15.8](#sec-async-function-definitions)) with relation to Function Definitions ([15.2](#sec-function-definitions))
