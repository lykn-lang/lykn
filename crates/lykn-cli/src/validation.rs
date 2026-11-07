use lykn_lang::ast::sexpr::SExpr;
use lykn_lang::diagnostics::Diagnostic;

pub(crate) fn first_compile_validation_group(forms: &[SExpr]) -> Option<Vec<Diagnostic>> {
    let groups = [
        lykn_lang::binding::validate_reserved_names(forms),
        lykn_lang::classifier::validate_method_calls(forms),
        lykn_lang::classifier::validate_nested_fn_params(forms),
        lykn_lang::classifier::validate_no_else_if_expressions(forms),
        lykn_lang::classifier::validate_exports_declarations(forms),
    ];
    groups.into_iter().find(|group| !group.is_empty())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn first_nonempty_compile_group_keeps_the_established_priority() {
        let cases = [
            (
                "(func default :args () :body 42)\n(exports default)",
                "reserved word",
            ),
            ("(bind r ((express parts):join \"\"))", "method call"),
            ("(bind f (fn (x) x))", "expected type keyword"),
            ("(bind label (if (> 1 0) \"items\"))", "else branch"),
            ("(exports missing)", "unknown top-level binding"),
        ];
        for (source, expected) in cases {
            let forms = lykn_lang::reader::read(source).expect("fixture reads");
            let forms = lykn_lang::resolver::resolve(&forms);
            let diagnostics = first_compile_validation_group(&forms)
                .expect("fixture has one nonempty validation group");
            assert!(diagnostics[0].message.contains(expected));
        }

        let source = "(func default :args () :body 42)\n(bind r ((express parts):join \"\"))";
        let forms = lykn_lang::resolver::resolve(&lykn_lang::reader::read(source).unwrap());
        let first = first_compile_validation_group(&forms).unwrap();
        assert!(first[0].message.contains("reserved word"));
    }
}
