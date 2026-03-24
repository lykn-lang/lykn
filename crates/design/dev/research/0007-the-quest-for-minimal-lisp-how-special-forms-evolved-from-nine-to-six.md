# The quest for minimal Lisp: How special forms evolved from nine to six

What began as John McCarthy's **nine-operator definition** in 1960 was progressively reduced over three decades to Scheme's **six semantic primitives** plus a macro system—revealing that most familiar Lisp constructs are syntactic convenience, not computational necessity. This minimalist trajectory, driven by the insight that lambda calculus could serve as a programming language's foundation, fundamentally shaped how we understand the boundary between essential language primitives and derived syntactic sugar.

The evolution happened in distinct phases: McCarthy's mathematical formalization (1958-1960), Steele and Sussman's lambda calculus connection (1975-1979), the Scheme standardization process (1978-1998), and theoretical work proving what truly cannot be derived. Each phase identified forms previously thought primitive that could actually be expressed in terms of simpler constructs.

## McCarthy's original nine operators defined computational completeness

John McCarthy's landmark 1960 paper "Recursive Functions of Symbolic Expressions and Their Computation by Machine" established the first formal specification of Lisp's primitives. McCarthy carefully distinguished between **five elementary functions** that evaluate their arguments and **four special forms** with non-standard evaluation rules.

The five elementary functions were: **ATOM** (test if atomic symbol), **EQ** (equality of atoms), **CAR** (first element of pair), **CDR** (second element of pair), and **CONS** (construct pair). These handle all data manipulation.

The four special forms were: **QUOTE** (prevent evaluation), **COND** (conditional with lazy evaluation), **LAMBDA** (function abstraction), and **LABEL** (recursive naming). McCarthy's universal function `eval` explicitly dispatched on these nine operators, making them the implementation's irreducible core.

McCarthy explained his motivation in his 1978 "History of LISP": "One mathematical consideration that influenced LISP was to express programs as applicative expressions built up from variables and constants using functions. I considered it important to make these expressions obey the usual mathematical laws allowing replacement of expressions by expressions giving the same value."

The theoretical elegance was intentional. McCarthy noted that "these simplifications made LISP into a way of describing computable functions **much neater than Turing machines** or the general recursive definitions used in recursive function theory." Paul Graham later characterized this as discovery rather than design: "It's not something McCarthy designed so much as something he discovered. It's what you get when you try to axiomatize computation."

Notably, **LABEL was later proven unnecessary**—D.M.R. Park pointed out it could be achieved using the Y combinator, reducing McCarthy's special forms from four to three in theory. The exact date of Park's observation is not recorded in McCarthy's 1979 "History of Lisp" paper, but Park was part of the original MIT AI team (he is listed as a co-author of the 1960 LISP I Programmer's Manual and worked on the first Lisp compiler with Robert Brayton), so the observation likely came sometime between 1959 and the early 1960s. McCarthy included LABEL for practical recursive definitions, establishing a pattern that would repeat: theoretical minimalism versus practical convenience.

## Steele and Sussman revealed lambda as the universal abstraction

The "Lambda Papers"—a series of MIT AI Memos published between 1975 and 1979 by Gerald Jay Sussman and Guy L. Steele Jr.—fundamentally reconceived what counted as primitive. Their key insight, articulated in "Lambda: The Ultimate Imperative" (1976): "The models require only (possibly self-referent) lambda application, conditionals, and (rarely) assignment."

The original Scheme implementation distinguished between **AINTs** (primitive special forms) and **AMACROs** (derived forms). The AINTs numbered seven: LAMBDA, IF, QUOTE, LABELS, ASET' (assignment), CATCH (continuations), and DEFINE. Everything else—COND, AND, OR, BLOCK, DO, PROG—was "explicitly not primitive," implemented through macro expansion.

The 1978 RABBIT compiler thesis made this philosophy operational. Steele wrote: "All of the traditional imperative constructs, such as sequencing, assignment, looping, GOTO, as well as many standard LISP constructs such as AND, OR, and COND, are expressed as macros in terms of the applicative basis set." The compiler focused on "a small basis set which reflects the semantics of lambda-calculus" rather than specialized knowledge about many constructs.

The derivations were elegant. BLOCK (sequencing) became nested lambda applications. OR became a conditional wrapped in lambdas to avoid evaluating branches twice:

```scheme
(OR x . rest) => ((LAMBDA (V R) (IF V V (R))) x (LAMBDA () (OR . rest)))
```

What made this revolutionary was proving it wasn't just theoretically interesting but practically implementable. The RABBIT compiler produced code "as good as that produced by more traditional compilers" while treating most constructs as macro sugar over the lambda core.

Sussman and Steele later reflected that this minimalism was "the unintended outcome of the design process. We were actually trying to build something complicated and discovered, serendipitously, that we had accidentally designed something that met all our goals but was much simpler than we had intended." The lambda calculus foundation emerged from attempting to understand Carl Hewitt's Actor model.

## Scheme standardization formalized the primitive-derived boundary

The Scheme Reports progressively codified which forms were primitive versus derived, with each revision refining the distinction.

**R2RS (1985)** first introduced formal "essential" versus "non-essential" categories. Essential special forms numbered approximately twelve: variable reference, procedure call, quote, lambda, if, cond, let, letrec, define, set!, and begin. Non-essential forms included case, and, or, let*, do, and quasiquote. Critically, R2RS established that "the most fundamental of these binding constructs is the lambda special form, because **all other binding constructs can be explained in terms of lambda expressions**."

**R3RS (1986)** restructured this into "Primitive expression types" (Section 4.1) and "Derived expression types" (Section 4.2). The six primitive types were: variable references, literal expressions (quote), procedure calls, lambda expressions, conditionals (if), and assignments (set!). Derived types encompassed conditionals like cond and case, binding constructs like let and letrec, sequencing, iteration, delayed evaluation, and quasiquotation.

**R4RS (1991)** maintained this structure while providing explicit rewrite rules in Section 7.3 showing how derived forms reduce to primitives. The report stated: "Derived expression types are not semantically primitive, but can instead be explained in terms of the primitive constructs. **They are redundant in the strict sense of the word, but they capture common patterns of usage, and are therefore provided as convenient abbreviations.**"

**R5RS (1998)** reached the definitive formulation: **9 primitive constructs** supporting **14 derived forms**. The primitives comprised six expression types (variable reference, quote, procedure call, lambda, if, set!) plus three macro-related forms (let-syntax, letrec-syntax, syntax-rules). The derived forms—cond, case, and, or, let, let*, letrec, begin, do, named let, delay, and the quasiquote family—were all explicitly defined as macros in terms of primitives.

The elevation of macro forms to primitive status in R5RS represented recognition that a practical minimal language needs mechanisms for syntactic abstraction, not just computational abstraction.

## Theoretical work established the absolute minimum

Research from the 1980s and 1990s addressed fundamental questions: What is the theoretical minimum? What absolutely cannot be derived?

**Pure lambda calculus provides the theoretical floor.** Church encodings demonstrate that conditionals, numbers, and pairs can all be represented using only lambda abstraction:

- Church Booleans: TRUE ≡ λx.λy.x, FALSE ≡ λx.λy.y
- Church conditional: IF b THEN t ELSE e ≡ b t e  
- Church pairs: CONS ≡ λx.λy.λz.z x y, CAR ≡ λp.p TRUE

This means the theoretical minimum for Turing-complete computation is **three constructs**: lambda abstraction, application, and variables. Everything else is derivable.

**But practical Lisp requires more.** QUOTE cannot be eliminated because it operates at the meta-level—stopping evaluation and treating code as data. Lambda calculus has no concept of "unevaluated syntax"; quote provides homoiconicity. Similarly, SET! (mutation) requires store semantics beyond pure lambda calculus.

Kent Pitman's influential 1980 paper "Special Forms in Lisp" established that macros suffice for all user-defined special forms, while FEXPRs (functions receiving unevaluated arguments) should be eliminated. His argument: "In a Lisp dialect that allows fexprs, static analysis cannot determine generally whether an operator represents an ordinary function or a fexpr—therefore, static analysis cannot determine whether or not the operands will be evaluated."

Mitchell Wand's 1998 paper "The Theory of Fexprs is Trivial" formalized this, proving that adding fexprs to lambda calculus creates a system with **trivial equational theory**—you cannot prove any two terms equivalent without evaluating them, making source-to-source optimization impossible.

John Shutt's 2010 dissertation introduced an alternative foundation: the **vau calculus**, where operands are not automatically evaluated. In this framework, lambda becomes derivable from vau—lambda is simply vau wrapped with automatic argument evaluation. Shutt's Kernel language demonstrated this approach works practically while avoiding Wand's triviality result through "direct subexpression-evaluation style."

## Common Lisp chose practicality over minimalism

The contrast with Common Lisp illuminates the tension between theoretical elegance and practical engineering. Where Scheme has approximately 9 primitives, **Common Lisp specifies exactly 25 special operators**: block, catch, eval-when, flet, function, go, if, labels, let, let*, load-time-value, locally, macrolet, multiple-value-call, multiple-value-prog1, progn, progv, quote, return-from, setq, symbol-macrolet, tagbody, the, throw, and unwind-protect.

This larger set reflects Common Lisp's design as a practical, industrial-strength language unifying existing dialects. The hyperspec notes that implementations may freely implement any construct described as a special form using macros (and vice versa) "if an equivalent macro definition is also provided." The special operators exist because they enable efficient compilation patterns—block/return-from for non-local exits, tagbody/go for low-level control, multiple-value forms for efficient multiple return values.

Both languages converged on the same solution for extensibility: macros, not fexprs. User-defined special forms are macro-defined in both. The philosophical difference lies in how much the language specification itself relies on derived forms versus primitive special operators.

## What truly cannot be eliminated

Five forms emerge as the irreducible primitives that no macro or derivation can eliminate:

**QUOTE** must be special because it prevents evaluation. A function would evaluate its argument before application; a macro defining quote would need quote to return its argument unevaluated—circular. Quote provides the fundamental mechanism for treating code as data.

**LAMBDA** creates closures capturing the lexical environment. It is the primitive binding mechanism; all other binding forms (let, letrec) derive from it. You cannot define lambda in terms of anything simpler because it is the foundation on which definitions rest.

**IF** must not evaluate both branches. A function would evaluate all arguments before application. While theoretically derivable via Church booleans, practical eager-evaluation semantics require it as primitive to avoid unnecessary computation and errors in unevaluated branches.

**SET!** (or SETQ) requires access to a variable's location in the environment, not its value. A function receives values, not locations. Assignment fundamentally requires store semantics beyond pure lambda calculus.

**DEFINE** modifies the environment to create new bindings. It requires privileged access to the definition context that cannot be expressed through ordinary function application.

These five capture the essential capabilities: preventing evaluation (quote), creating abstractions (lambda), conditional computation (if), mutation (set!), and binding (define). Everything else—cond, let, and, or, do, begin—is syntactic convenience expressible through these primitives plus macros.

## Conclusion

The history of Lisp's core forms reveals a sustained intellectual project to discover the minimal computational essence beneath familiar programming constructs. McCarthy's nine operators were reduced to Scheme's six semantic primitives over three decades of refinement. The key insight—that lambda calculus could serve as more than theoretical foundation—emerged serendipitously from Steele and Sussman's work and was formalized through progressive Scheme standardization.

The theoretical minimum (three lambda calculus constructs) differs from the practical minimum (approximately six forms) because real programming requires meta-level operations like quotation and mutation that pure lambda calculus cannot express. The irreducible core—quote, lambda, if, set!, define—captures the capabilities no macro can simulate: preventing evaluation, creating closures, conditional execution, mutation, and binding.

This minimalist trajectory influenced language design broadly, demonstrating that apparent complexity often dissolves into elegant primitives. The tension between theoretical minimalism and practical convenience, visible in the contrast between Scheme and Common Lisp, remains central to programming language design. What McCarthy discovered in 1960—that a handful of primitives suffice for universal computation—continues to inform how we think about what programming languages fundamentally are.