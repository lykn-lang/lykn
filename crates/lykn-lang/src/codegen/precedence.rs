//! JavaScript operator precedence table.
//!
//! Returns a numeric precedence level for a given operator string. Higher
//! values bind more tightly. Used by the expression emitter to decide when
//! parentheses are needed around sub-expressions.

/// Return the precedence level of a JavaScript operator.
///
/// Lower numbers bind less tightly. When a child expression has a lower
/// precedence than its parent context, it must be wrapped in parentheses.
pub fn precedence(op: &str) -> u8 {
    match op {
        "??" => 4,
        "||" | "||=" => 5,
        "&&" | "&&=" => 6,
        "|" | "|=" => 7,
        "^" | "^=" => 8,
        "&" | "&=" => 9,
        "==" | "!=" | "===" | "!==" => 10,
        "<" | ">" | "<=" | ">=" | "in" | "instanceof" => 11,
        "<<" | ">>" | ">>>" | "<<=" | ">>=" | ">>>=" => 12,
        "+" | "-" => 13,
        "*" | "/" | "%" => 14,
        "**" | "**=" => 15,
        _ => 20, // unary, call, member — highest
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_nullish_coalescing() {
        assert_eq!(precedence("??"), 4);
    }

    #[test]
    fn test_logical_or() {
        assert_eq!(precedence("||"), 5);
        assert_eq!(precedence("||="), 5);
    }

    #[test]
    fn test_logical_and() {
        assert_eq!(precedence("&&"), 6);
        assert_eq!(precedence("&&="), 6);
    }

    #[test]
    fn test_bitwise_or() {
        assert_eq!(precedence("|"), 7);
        assert_eq!(precedence("|="), 7);
    }

    #[test]
    fn test_bitwise_xor() {
        assert_eq!(precedence("^"), 8);
        assert_eq!(precedence("^="), 8);
    }

    #[test]
    fn test_bitwise_and() {
        assert_eq!(precedence("&"), 9);
        assert_eq!(precedence("&="), 9);
    }

    #[test]
    fn test_equality() {
        assert_eq!(precedence("=="), 10);
        assert_eq!(precedence("!="), 10);
        assert_eq!(precedence("==="), 10);
        assert_eq!(precedence("!=="), 10);
    }

    #[test]
    fn test_relational() {
        assert_eq!(precedence("<"), 11);
        assert_eq!(precedence(">"), 11);
        assert_eq!(precedence("<="), 11);
        assert_eq!(precedence(">="), 11);
        assert_eq!(precedence("in"), 11);
        assert_eq!(precedence("instanceof"), 11);
    }

    #[test]
    fn test_shift() {
        assert_eq!(precedence("<<"), 12);
        assert_eq!(precedence(">>"), 12);
        assert_eq!(precedence(">>>"), 12);
    }

    #[test]
    fn test_additive() {
        assert_eq!(precedence("+"), 13);
        assert_eq!(precedence("-"), 13);
    }

    #[test]
    fn test_multiplicative() {
        assert_eq!(precedence("*"), 14);
        assert_eq!(precedence("/"), 14);
        assert_eq!(precedence("%"), 14);
    }

    #[test]
    fn test_exponentiation() {
        assert_eq!(precedence("**"), 15);
        assert_eq!(precedence("**="), 15);
    }

    #[test]
    fn test_unknown_is_highest() {
        assert_eq!(precedence("typeof"), 20);
        assert_eq!(precedence("!"), 20);
        assert_eq!(precedence("some_call"), 20);
    }

    #[test]
    fn test_precedence_ordering() {
        // Verify that multiplication binds tighter than addition.
        assert!(precedence("*") > precedence("+"));
        // Verify that addition binds tighter than logical or.
        assert!(precedence("+") > precedence("||"));
    }
}
