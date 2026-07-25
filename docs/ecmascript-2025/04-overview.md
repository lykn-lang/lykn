# 4 Overview

This section contains a non-normative overview of the ECMAScript language.

ECMAScript is an object-oriented programming language for performing computations and manipulating computational objects within a [host environment](#host-environment). ECMAScript as defined here is not intended to be computationally self-sufficient; indeed, there are no provisions in this specification for input of external data or output of computed results. Instead, it is expected that the computational environment of an ECMAScript program will provide not only the objects and other facilities described in this specification but also certain environment-specific objects, whose description and behaviour are beyond the scope of this specification except to indicate that they may provide certain properties that can be accessed and certain functions that can be called from an ECMAScript program.

ECMAScript was originally designed to be used as a scripting language, but has become widely used as a general-purpose programming language. A *scripting language* is a programming language that is used to manipulate, customize, and automate the facilities of an existing system. In such systems, useful functionality is already available through a user interface, and the scripting language is a mechanism for exposing that functionality to program control. In this way, the existing system is said to provide a [host environment](#host-environment) of objects and facilities, which completes the capabilities of the scripting language. A scripting language is intended for use by both professional and non-professional programmers.

ECMAScript was originally designed to be a *Web scripting language*, providing a mechanism to enliven Web pages in browsers and to perform server computation as part of a Web-based client-server architecture. ECMAScript is now used to provide core scripting capabilities for a variety of [host environments](#host-environment). Therefore the core language is specified in this document apart from any particular [host environment](#host-environment).

ECMAScript usage has moved beyond simple scripting and it is now used for the full spectrum of programming tasks in many different environments and scales. As the usage of ECMAScript has expanded, so have the features and facilities it provides. ECMAScript is now a fully featured general-purpose programming language.

## 4.1 Web Scripting

A web browser provides an ECMAScript [host environment](#host-environment) for client-side computation including, for instance, objects that represent windows, menus, pop-ups, dialog boxes, text areas, anchors, frames, history, cookies, and input/output. Further, the [host environment](#host-environment) provides a means to attach scripting code to events such as change of focus, page and image loading, unloading, error and abort, selection, form submission, and mouse actions. Scripting code appears within the HTML and the displayed page is a combination of user interface elements and fixed and computed text and images. The scripting code is reactive to user interaction, and there is no need for a main program.

A web server provides a different [host environment](#host-environment) for server-side computation including objects representing requests, clients, and files; and mechanisms to lock and share data. By using browser-side and server-side scripting together, it is possible to distribute computation between the client and server while providing a customized user interface for a Web-based application.

Each Web browser and server that supports ECMAScript supplies its own [host environment](#host-environment), completing the ECMAScript execution environment.

## 4.2 Hosts and Implementations

To aid integrating ECMAScript into [host environments](#host-environment), this specification defers the definition of certain facilities (e.g., [abstract operations](#sec-algorithm-conventions-abstract-operations)), either in whole or in part, to a source outside of this specification. Editorially, this specification distinguishes the following kinds of deferrals.

An *implementation* is an external source that further defines facilities enumerated in Annex [D](#sec-host-layering-points) or those that are marked as [implementation-defined](#implementation-defined) or [implementation-approximated](#implementation-approximated). In informal use, an implementation refers to a concrete artefact, such as a particular web browser.

An implementation-defined facility is one that defers its definition to an external source without further qualification. This specification does not make any recommendations for particular behaviours, and conforming implementations are free to choose any behaviour within the constraints put forth by this specification.

An implementation-approximated facility is one that defers its definition to an external source while recommending an ideal behaviour. While conforming implementations are free to choose any behaviour within the constraints put forth by this specification, they are encouraged to strive to approximate the ideal. Some mathematical operations, such as [`Math.exp`](#sec-math.exp), are [implementation-approximated](#implementation-approximated).

A host is an external source that further defines facilities listed in Annex [D](#sec-host-layering-points) but does not further define other [implementation-defined](#implementation-defined) or [implementation-approximated](#implementation-approximated) facilities. In informal use, a [host](#host) refers to the set of all implementations, such as the set of all web browsers, that interface with this specification in the same way via Annex [D](#sec-host-layering-points). A [host](#host) is often an external specification, such as WHATWG HTML (<https://html.spec.whatwg.org/>). In other words, facilities that are [host-defined](#host-defined) are often further defined in external specifications.

A host hook is an abstract operation that is defined in whole or in part by an external source. All [host hooks](#host-hook) must be listed in Annex [D](#sec-host-layering-points). A [host hook](#host-hook) must conform to at least the following requirements:

- It must return either a [normal completion](#sec-completion-record-specification-type) or a [throw completion](#sec-completion-record-specification-type).

A host-defined facility is one that defers its definition to an external source without further qualification and is listed in Annex [D](#sec-host-layering-points). Implementations that are not [hosts](#host) may also provide definitions for [host-defined](#host-defined) facilities.

A host environment is a particular choice of definition for all [host-defined](#host-defined) facilities. A [host environment](#host-environment) typically includes objects or functions which allow obtaining input and providing output as [host-defined](#host-defined) properties of the [global object](#sec-global-object).

This specification follows the editorial convention of always using the most specific term. For example, if a facility is [host-defined](#host-defined), it should not be referred to as [implementation-defined](#implementation-defined).

Both [hosts](#host) and implementations may interface with this specification via the language types, specification types, [abstract operations](#sec-algorithm-conventions-abstract-operations), grammar productions, intrinsic objects, and intrinsic symbols defined herein.

## 4.3 ECMAScript Overview

The following is an informal overview of ECMAScript—not all parts of the language are described. This overview is not part of the standard proper.

ECMAScript is object-based: basic language and [host](#host) facilities are provided by objects, and an ECMAScript program is a cluster of communicating objects. In ECMAScript, an *object* is a collection of zero or more *properties* each with *attributes* that determine how each property can be used—for example, when the Writable attribute for a property is set to false, any attempt by executed ECMAScript code to assign a different value to the property fails. Properties are containers that hold other objects, *primitive values*, or *functions*. A primitive value is a member of one of the following built-in types: **Undefined**, **Null**, **Boolean**, **Number**, **BigInt**, **String**, and **Symbol;** an object is a member of the built-in type **Object**; and a function is a callable object. A function that is associated with an object via a property is called a *method*.

ECMAScript defines a collection of *built-in objects* that round out the definition of ECMAScript entities. These built-in objects include the [global object](#sec-global-object); objects that are fundamental to the [runtime semantics](#sec-runtime-semantics) of the language including `Object`, `Function`, `Boolean`, `Symbol`, and various `Error` objects; objects that represent and manipulate numeric values including `Math`, `Number`, and `Date`; the text processing objects `String` and `RegExp`; objects that are indexed collections of values including `Array` and nine different kinds of Typed Arrays whose elements all have a specific numeric data representation; keyed collections including `Map` and `Set` objects; objects supporting structured data including the `JSON` object, `ArrayBuffer`, `SharedArrayBuffer`, and `DataView`; objects supporting control abstractions including generator functions and `Promise` objects; and reflection objects including `Proxy` and `Reflect`.

ECMAScript also defines a set of built-in *operators*. ECMAScript operators include various unary operations, multiplicative operators, additive operators, bitwise shift operators, relational operators, equality operators, binary bitwise operators, binary logical operators, assignment operators, and the comma operator.

Large ECMAScript programs are supported by *modules* which allow a program to be divided into multiple sequences of statements and declarations. Each module explicitly identifies declarations it uses that need to be provided by other modules and which of its declarations are available for use by other modules.

ECMAScript syntax intentionally resembles Java syntax. ECMAScript syntax is relaxed to enable it to serve as an easy-to-use scripting language. For example, a variable is not required to have its type declared nor are types associated with properties, and defined functions are not required to have their declarations appear textually before calls to them.

### 4.3.1 Objects

Even though ECMAScript includes syntax for class definitions, ECMAScript objects are not fundamentally class-based such as those in C++, Smalltalk, or Java. Instead objects may be created in various ways including via a literal notation or via *[constructors](#constructor)* which create objects and then execute code that initializes all or part of them by assigning initial values to their properties. Each [constructor](#constructor) is a function that has a property named "prototype" that is used to implement *prototype-based inheritance* and *shared properties*. Objects are created by using [constructors](#constructor) in **new** expressions; for example, `new Date(2009, 11)` creates a new Date object. Invoking a [constructor](#constructor) without using **new** has consequences that depend on the [constructor](#constructor). For example, `Date()` produces a string representation of the current date and time rather than an object.

Every object created by a [constructor](#constructor) has an implicit reference (called the object's *prototype*) to the value of its [constructor](#constructor)'s "prototype" property. Furthermore, a prototype may have a non-null implicit reference to its prototype, and so on; this is called the *prototype chain*. When a reference is made to a property in an object, that reference is to the property of that name in the first object in the prototype chain that contains a property of that name. In other words, first the object mentioned directly is examined for such a property; if that object contains the named property, that is the property to which the reference refers; if that object does not contain the named property, the prototype for that object is examined next; and so on.

![An image of lots of boxes and arrows.](img/figure-1.svg)

Figure 1: Object/Prototype Relationships

In a class-based object-oriented language, in general, state is carried by instances, methods are carried by classes, and inheritance is only of structure and behaviour. In ECMAScript, the state and methods are carried by objects, while structure, behaviour, and state are all inherited.

All objects that do not directly contain a particular property that their prototype contains share that property and its value. Figure 1 illustrates this:

**CF** is a [constructor](#constructor) (and also an object). Five objects have been created by using `new` expressions: **cf₁**, **cf₂**, **cf₃**, **cf₄**, and **cf₅**. Each of these objects contains properties named "q1" and "q2". The dashed lines represent the implicit prototype relationship; so, for example, **cf₃**'s prototype is **CF_(p)**. The [constructor](#constructor), **CF**, has two properties itself, named "P1" and "P2", which are not visible to **CF_(p)**, **cf₁**, **cf₂**, **cf₃**, **cf₄**, or **cf₅**. The property named "CFP1" in **CF_(p)** is shared by **cf₁**, **cf₂**, **cf₃**, **cf₄**, and **cf₅** (but not by **CF**), as are any properties found in **CF_(p)**'s implicit prototype chain that are not named "q1", "q2", or "CFP1". Notice that there is no implicit prototype link between **CF** and **CF_(p)**.

Unlike most class-based object languages, properties can be added to objects dynamically by assigning values to them. That is, [constructors](#constructor) are not required to name or assign values to all or any of the constructed object's properties. In the above diagram, one could add a new shared property for **cf₁**, **cf₂**, **cf₃**, **cf₄**, and **cf₅** by assigning a new value to the property in **CF_(p)**.

Although ECMAScript objects are not inherently class-based, it is often convenient to define class-like abstractions based upon a common pattern of [constructor](#constructor) functions, prototype objects, and methods. The ECMAScript built-in objects themselves follow such a class-like pattern. Beginning with ECMAScript 2015, the ECMAScript language includes syntactic class definitions that permit programmers to concisely define objects that conform to the same class-like abstraction pattern used by the built-in objects.

### 4.3.2 The Strict Variant of ECMAScript

The ECMAScript Language recognizes the possibility that some users of the language may wish to restrict their usage of some features available in the language. They might do so in the interests of security, to avoid what they consider to be error-prone features, to get enhanced error checking, or for other reasons of their choosing. In support of this possibility, ECMAScript defines a strict variant of the language. The strict variant of the language excludes some specific syntactic and semantic features of the regular ECMAScript language and modifies the detailed semantics of some features. The strict variant also specifies additional error conditions that must be reported by throwing error exceptions in situations that are not specified as errors by the non-strict form of the language.

The strict variant of ECMAScript is commonly referred to as the *strict mode* of the language. Strict mode selection and use of the strict mode syntax and semantics of ECMAScript is explicitly made at the level of individual [ECMAScript source text](#sec-source-text) units as described in [11.2.2](#sec-strict-mode-code). Because strict mode is selected at the level of a syntactic source text unit, strict mode only imposes restrictions that have local effect within such a source text unit. Strict mode does not restrict or modify any aspect of the ECMAScript semantics that must operate consistently across multiple source text units. A complete ECMAScript program may be composed of both strict mode and non-strict mode [ECMAScript source text](#sec-source-text) units. In this case, strict mode only applies when actually executing code that is defined within a strict mode source text unit.

In order to conform to this specification, an ECMAScript implementation must implement both the full unrestricted ECMAScript language and the strict variant of the ECMAScript language as defined by this specification. In addition, an implementation must support the combination of unrestricted and strict mode source text units into a single composite program.

## 4.4 Terms and Definitions

For the purposes of this document, the following terms and definitions apply.

### 4.4.1 implementation-approximated

an [implementation-approximated](#implementation-approximated) facility is defined in whole or in part by an external source but has a recommended, ideal behaviour in this specification

### 4.4.2 implementation-defined

an [implementation-defined](#implementation-defined) facility is defined in whole or in part by an external source to this specification

### 4.4.3 host-defined

same as [implementation-defined](#implementation-defined)

Note

Editorially, see clause [4.2](#sec-hosts-and-implementations).

### 4.4.4 type

set of data values as defined in clause [6](#sec-ecmascript-data-types-and-values)

### 4.4.5 primitive value

member of one of the types Undefined, Null, Boolean, Number, BigInt, Symbol, or String as defined in clause [6](#sec-ecmascript-data-types-and-values)

Note

A primitive value is a datum that is represented directly at the lowest level of the language implementation.

### 4.4.6 object

member of the type Object

Note

An object is a collection of properties and has a single prototype object. The prototype may be null.

### 4.4.7 constructor

[function object](#function-object) that creates and initializes objects

Note

The value of a [constructor](#constructor)'s "prototype" property is a prototype object that is used to implement inheritance and shared properties.

### 4.4.8 prototype

object that provides shared properties for other objects

Note

When a [constructor](#constructor) creates an object, that object implicitly references the [constructor](#constructor)'s "prototype" property for the purpose of resolving property references. The [constructor](#constructor)'s "prototype" property can be referenced by the program expression `constructor``.prototype`, and properties added to an object's prototype are shared, through inheritance, by all objects sharing the prototype. Alternatively, a new object may be created with an explicitly specified prototype by using the `Object.create` built-in function.

### 4.4.9 ordinary object

object that has the default behaviour for the essential internal methods that must be supported by all objects

### 4.4.10 exotic object

object that does not have the default behaviour for one or more of the essential internal methods

Note

Any object that is not an [ordinary object](#ordinary-object) is an [exotic object](#exotic-object).

### 4.4.11 standard object

object whose semantics are defined by this specification

### 4.4.12 built-in object

object specified and supplied by an ECMAScript implementation

Note

Standard built-in objects are defined in this specification. An ECMAScript implementation may specify and supply additional kinds of built-in objects.

### 4.4.13 undefined value

primitive value used when a variable has not been assigned a value

### 4.4.14 Undefined type

type whose sole value is the undefined value

### 4.4.15 null value

primitive value that represents the intentional absence of any object value

### 4.4.16 Null type

type whose sole value is the null value

### 4.4.17 Boolean value

member of the [Boolean type](#sec-ecmascript-language-types-boolean-type)

Note

There are only two Boolean values, true and false.

### 4.4.18 Boolean type

type consisting of the primitive values true and false

### 4.4.19 Boolean object

member of the [Object type](#sec-object-type) that is an instance of the standard built-in Boolean [constructor](#constructor)

Note

A Boolean object is created by using the Boolean [constructor](#constructor) in a `new` expression, supplying a Boolean value as an argument. The resulting object has an internal slot whose value is the Boolean value. A Boolean object can be coerced to a Boolean value.

### 4.4.20 String value

primitive value that is a [finite](#finite) ordered sequence of zero or more 16-bit unsigned [integer](#integer) values

Note

A String value is a member of the [String type](#sec-ecmascript-language-types-string-type). Each [integer](#integer) value in the sequence usually represents a single 16-bit unit of UTF-16 text. However, ECMAScript does not place any restrictions or requirements on the values except that they must be 16-bit unsigned [integers](#integer).

### 4.4.21 String type

set of all possible String values

### 4.4.22 String object

member of the [Object type](#sec-object-type) that is an instance of the standard built-in String [constructor](#constructor)

Note

A String object is created by using the String [constructor](#constructor) in a `new` expression, supplying a String value as an argument. The resulting object has an internal slot whose value is the String value. A String object can be coerced to a String value by calling the String [constructor](#constructor) as a function ([22.1.1.1](#sec-string-constructor-string-value)).

### 4.4.23 Number value

primitive value corresponding to a double-precision 64-bit binary format [IEEE 754-2019](#sec-bibliography) value

Note

A Number value is a member of the [Number type](#sec-ecmascript-language-types-number-type) and is a direct representation of a number.

### 4.4.24 Number type

set of all possible Number values including NaN (“not a number”), +∞_(𝔽) (positive infinity), and -∞_(𝔽) (negative infinity)

### 4.4.25 Number object

member of the [Object type](#sec-object-type) that is an instance of the standard built-in Number [constructor](#constructor)

Note

A Number object is created by using the Number [constructor](#constructor) in a `new` expression, supplying a Number value as an argument. The resulting object has an internal slot whose value is the Number value. A Number object can be coerced to a Number value by calling the Number [constructor](#constructor) as a function ([21.1.1.1](#sec-number-constructor-number-value)).

### 4.4.26 Infinity

Number value that is the positive infinite Number value

### 4.4.27 NaN

Number value that is an [IEEE 754-2019](#sec-bibliography) NaN (“not a number”) value

### 4.4.28 BigInt value

primitive value corresponding to an arbitrary-precision [integer](#integer) value

### 4.4.29 BigInt type

set of all possible BigInt values

### 4.4.30 BigInt object

member of the [Object type](#sec-object-type) that is an instance of the standard built-in BigInt [constructor](#constructor)

### 4.4.31 Symbol value

primitive value that represents a unique, non-String Object [property key](#property-key)

### 4.4.32 Symbol type

set of all possible Symbol values

### 4.4.33 Symbol object

member of the [Object type](#sec-object-type) that is an instance of the standard built-in Symbol [constructor](#constructor)

### 4.4.34 function

member of the [Object type](#sec-object-type) that may be invoked as a subroutine

Note

In addition to its properties, a function contains executable code and state that determine how it behaves when invoked. A function's code may or may not be written in ECMAScript.

### 4.4.35 built-in function

built-in object that is a function

Note

Examples of built-in functions include `parseInt` and `Math.exp`. A [host](#host) or implementation may provide additional built-in functions that are not described in this specification.

### 4.4.36 built-in constructor

built-in function that is a [constructor](#constructor)

Note

Examples of built-in [constructors](#constructor) include `Object` and `Function`. A [host](#host) or implementation may provide additional built-in [constructors](#constructor) that are not described in this specification.

### 4.4.37 property

part of an object that associates a key (either a String value or a Symbol value) and a value

Note

Depending upon the form of the property the value may be represented either directly as a data value (a primitive value, an object, or a [function object](#function-object)) or indirectly by a pair of accessor functions.

### 4.4.38 method

function that is the value of a property

Note

When a function is called as a method of an object, the object is passed to the function as its this value.

### 4.4.39 built-in method

method that is a built-in function

Note

Standard built-in methods are defined in this specification. A [host](#host) or implementation may provide additional built-in methods that are not described in this specification.

### 4.4.40 attribute

internal value that defines some characteristic of a property

### 4.4.41 own property

property that is directly contained by its object

### 4.4.42 inherited property

property of an object that is not an own property but is a property (either own or inherited) of the object's prototype

## 4.5 Organization of This Specification

The remainder of this specification is organized as follows:

Clause [5](#sec-notational-conventions) defines the notational conventions used throughout the specification.

Clauses [6](#sec-ecmascript-data-types-and-values) through [10](#sec-ordinary-and-exotic-objects-behaviours) define the execution environment within which ECMAScript programs operate.

Clauses [11](#sec-ecmascript-language-source-code) through [17](#sec-error-handling-and-language-extensions) define the actual ECMAScript programming language including its syntactic encoding and the execution semantics of all language features.

Clauses [18](#sec-ecmascript-standard-built-in-objects) through [28](#sec-reflection) define the ECMAScript standard library. They include the definitions of all of the standard objects that are available for use by ECMAScript programs as they execute.

Clause [29](#sec-memory-model) describes the memory consistency model of accesses on SharedArrayBuffer-backed memory and methods of the Atomics object.
