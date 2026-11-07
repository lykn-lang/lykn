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
