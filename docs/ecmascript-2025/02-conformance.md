# 2 Conformance

A conforming implementation of ECMAScript must provide and support all the types, values, objects, properties, functions, and program syntax and semantics described in this specification.

A conforming implementation of ECMAScript must interpret source text input in conformance with the latest version of the Unicode Standard and ISO/IEC 10646.

A conforming implementation of ECMAScript that provides an application programming interface (API) that supports programs that need to adapt to the linguistic and cultural conventions used by different human languages and countries must implement the interface defined by the most recent edition of ECMA-402 that is compatible with this specification.

A conforming implementation of ECMAScript may provide additional types, values, objects, properties, and functions beyond those described in this specification. In particular, a conforming implementation of ECMAScript may provide properties not described in this specification, and values for those properties, for objects that are described in this specification.

A conforming implementation of ECMAScript may support program and regular expression syntax not described in this specification. In particular, a conforming implementation of ECMAScript may support program syntax that makes use of any “future [reserved words](#sec-keywords-and-reserved-words)” noted in subclause [12.7.2](#sec-keywords-and-reserved-words) of this specification.

A conforming implementation of ECMAScript must not implement any extension that is listed as a Forbidden Extension in subclause [17.1](#sec-forbidden-extensions).

A conforming implementation of ECMAScript must not redefine any facilities that are not [implementation-defined](#implementation-defined), [implementation-approximated](#implementation-approximated), or [host-defined](#host-defined).

A conforming implementation of ECMAScript may choose to implement or not implement Normative Optional subclauses. If any Normative Optional behaviour is implemented, all of the behaviour in the containing Normative Optional clause must be implemented. A Normative Optional clause is denoted in this specification with the words "Normative Optional" in a coloured box, as shown below.

[Normative Optional](#sec-conformance)

## 2.1 Example Normative Optional Clause Heading

Example clause contents.

A conforming implementation of ECMAScript must implement Legacy subclauses, unless they are also marked as Normative Optional. All of the language features and behaviours specified within Legacy subclauses have one or more undesirable characteristics. However, their continued usage in existing applications prevents their removal from this specification. These features are not considered part of the core ECMAScript language. Programmers should not use or assume the existence of these features and behaviours when writing new ECMAScript code.

[Legacy](#sec-conformance)

## 2.2 Example Legacy Clause Heading

Example clause contents.

[Normative Optional](#sec-conformance), [Legacy](#sec-conformance)

## 2.3 Example Legacy Normative Optional Clause Heading

Example clause contents.
