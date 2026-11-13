//! Structural lexical regions for source functions and class members.
//!
//! Paths are child indexes in the original syntax tree. They identify an
//! occurrence in this traversal only; they are not spans or binding identity.

use crate::ast::sexpr::SExpr;

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub(crate) enum FunctionGrammar {
    SourceFunc,
    SourceGenfunc,
    TypedSource,
    Kernel,
}

#[derive(Clone, Debug, PartialEq, Eq)]
pub(crate) struct OccurrencePath(pub(crate) Vec<usize>);

#[derive(Clone, Debug)]
pub(crate) struct FunctionClauseRegions {
    pub(crate) params_path: Option<OccurrencePath>,
    pub(crate) default_paths: Vec<OccurrencePath>,
    pub(crate) pre_paths: Vec<OccurrencePath>,
    pub(crate) body_paths: Vec<OccurrencePath>,
    pub(crate) post_paths: Vec<OccurrencePath>,
}

#[derive(Clone, Debug)]
pub(crate) struct FunctionRegions {
    pub(crate) grammar: FunctionGrammar,
    pub(crate) name_path: Option<OccurrencePath>,
    pub(crate) clauses: Vec<FunctionClauseRegions>,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub(crate) enum ClassMemberGrammar {
    Method,
    Constructor,
    Getter,
    Setter,
    Field,
    Wrapper,
    Opaque,
}

#[derive(Clone, Debug)]
pub(crate) struct ClassMemberRegions {
    pub(crate) path: OccurrencePath,
    pub(crate) grammar: ClassMemberGrammar,
    pub(crate) inner: Option<Box<ClassMemberRegions>>,
    pub(crate) params_path: Option<OccurrencePath>,
    pub(crate) default_paths: Vec<OccurrencePath>,
    pub(crate) body_paths: Vec<OccurrencePath>,
    pub(crate) init_paths: Vec<OccurrencePath>,
}

#[derive(Clone, Debug)]
pub(crate) struct ClassRegions {
    pub(crate) name_path: Option<OccurrencePath>,
    pub(crate) base_paths: Vec<OccurrencePath>,
    pub(crate) members: Vec<ClassMemberRegions>,
}

#[derive(Clone, Copy, Debug)]
pub(crate) struct KeywordRange<'a> {
    pub(crate) key: &'a str,
    pub(crate) value_start: usize,
    pub(crate) value_end: usize,
}

/// Retain each selected keyword group's original indexes, with last occurrence
/// winning just like `parse_keyword_clauses`.
pub(crate) fn keyword_group_ranges(args: &[SExpr]) -> Vec<KeywordRange<'_>> {
    let mut selected = Vec::<KeywordRange<'_>>::new();
    let mut current: Option<(&str, usize)> = None;
    for (index, arg) in args.iter().enumerate() {
        if let Some(key) = arg.as_keyword().filter(|key| is_func_clause_key(key)) {
            if let Some((old_key, value_start)) = current.take() {
                insert_last(
                    &mut selected,
                    KeywordRange {
                        key: old_key,
                        value_start,
                        value_end: index,
                    },
                );
            }
            current = Some((key, index + 1));
        }
    }
    if let Some((key, value_start)) = current {
        insert_last(
            &mut selected,
            KeywordRange {
                key,
                value_start,
                value_end: args.len(),
            },
        );
    }
    selected
}

fn insert_last<'a>(ranges: &mut Vec<KeywordRange<'a>>, range: KeywordRange<'a>) {
    if let Some(previous) = ranges.iter_mut().find(|previous| previous.key == range.key) {
        *previous = range;
    } else {
        ranges.push(range);
    }
}

pub(crate) fn is_func_clause_key(name: &str) -> bool {
    matches!(
        name,
        "args" | "yields" | "returns" | "pre" | "post" | "body"
    )
}

/// Describe the actual supported source `func`/`genfunc` header shape. A
/// malformed or unrecognized layout returns `None` for the classifier to
/// report through its established diagnostic path.
pub(crate) fn source_function_regions(form: &SExpr, generator: bool) -> Option<FunctionRegions> {
    let SExpr::List { values, .. } = form else {
        return None;
    };
    if values.first().and_then(SExpr::as_atom) != Some(if generator { "genfunc" } else { "func" }) {
        return None;
    }
    let name_path = values.get(1).map(|_| OccurrencePath(vec![1]));
    let rest = values.get(2..)?;
    if rest.is_empty() {
        return None;
    }

    let multi = matches!(rest.first(), Some(SExpr::List { values, .. })
        if values.first().and_then(SExpr::as_keyword).is_some_and(is_func_clause_key));
    let keyword = !multi
        && rest
            .first()
            .and_then(SExpr::as_keyword)
            .is_some_and(is_func_clause_key);
    let mut clauses = Vec::new();
    if multi {
        for (relative_index, clause) in rest.iter().enumerate() {
            let SExpr::List { values: items, .. } = clause else {
                return None;
            };
            if !items
                .first()
                .and_then(SExpr::as_keyword)
                .is_some_and(is_func_clause_key)
            {
                return None;
            }
            clauses.push(source_clause_regions(items, vec![relative_index + 2], 0)?);
        }
    } else if keyword {
        clauses.push(source_clause_regions(rest, Vec::new(), 2)?);
    } else {
        clauses.push(FunctionClauseRegions {
            params_path: None,
            default_paths: Vec::new(),
            pre_paths: Vec::new(),
            body_paths: (2..values.len())
                .map(|index| OccurrencePath(vec![index]))
                .collect(),
            post_paths: Vec::new(),
        });
    }
    Some(FunctionRegions {
        grammar: if generator {
            FunctionGrammar::SourceGenfunc
        } else {
            FunctionGrammar::SourceFunc
        },
        name_path,
        clauses,
    })
}

pub(crate) fn function_regions(form: &SExpr) -> Option<FunctionRegions> {
    let SExpr::List { values, .. } = form else {
        return None;
    };
    let head = values.first().and_then(SExpr::as_atom)?;
    if matches!(head, "func" | "genfunc") {
        return source_function_regions(form, head == "genfunc");
    }
    let (grammar, named) = match head {
        "fn" | "genfn" | "lambda" => (FunctionGrammar::TypedSource, false),
        "function" | "function*" | "=>" | "kernel:function" | "kernel:function*" | "kernel:=>"
        | "kernel:lambda" => (FunctionGrammar::Kernel, true),
        _ => return None,
    };
    let args_start = 1;
    let name_path = (named
        && matches!(head, "function" | "function*")
        && values.get(1).is_some_and(|value| value.as_atom().is_some()))
    .then(|| OccurrencePath(vec![1]));
    let params_index = if name_path.is_some() { 2 } else { args_start };
    let params_path = values
        .get(params_index)
        .filter(|value| matches!(value, SExpr::List { .. }))
        .map(|_| OccurrencePath(vec![params_index]));
    let default_paths = params_path
        .as_ref()
        .and_then(|path| at_path(form, path).map(|params| (params, path)))
        .map(|(params, path)| {
            if grammar == FunctionGrammar::Kernel {
                binding_default_paths(params, path)
            } else {
                typed_default_paths(params, path)
            }
        })
        .unwrap_or_default();
    let body_start = params_index + usize::from(params_path.is_some());
    let body_paths = (body_start..values.len())
        .map(|index| OccurrencePath(vec![index]))
        .collect();
    Some(FunctionRegions {
        grammar,
        name_path,
        clauses: vec![FunctionClauseRegions {
            params_path,
            default_paths,
            pre_paths: Vec::new(),
            body_paths,
            post_paths: Vec::new(),
        }],
    })
}

fn source_clause_regions(
    items: &[SExpr],
    clause_path: Vec<usize>,
    root_offset: usize,
) -> Option<FunctionClauseRegions> {
    let ranges = keyword_group_ranges(items);
    let value_paths = |key: &str| -> Vec<OccurrencePath> {
        ranges
            .iter()
            .find(|range| range.key == key)
            .map_or_else(Vec::new, |range| {
                (range.value_start..range.value_end)
                    .map(|index| {
                        let mut path = clause_path.clone();
                        path.push(index + root_offset);
                        OccurrencePath(path)
                    })
                    .collect()
            })
    };
    let params_path = ranges
        .iter()
        .find(|range| range.key == "args")
        .filter(|range| range.value_start < range.value_end)
        .map(|range| {
            let mut path = clause_path.clone();
            path.push(range.value_start + root_offset);
            OccurrencePath(path)
        });
    let default_paths = params_path.as_ref().map_or_else(Vec::new, |path| {
        at_path_from_items(items, path, &clause_path, root_offset)
            .map(|params| typed_default_paths(params, path))
            .unwrap_or_default()
    });
    let body_paths = value_paths("body");
    if body_paths.is_empty() {
        return None;
    }
    Some(FunctionClauseRegions {
        params_path,
        default_paths,
        pre_paths: value_paths("pre"),
        body_paths,
        post_paths: value_paths("post"),
    })
}

fn at_path_from_items<'a>(
    items: &'a [SExpr],
    full_path: &OccurrencePath,
    clause_path: &[usize],
    root_offset: usize,
) -> Option<&'a SExpr> {
    let group_index = *full_path.0.get(clause_path.len())?;
    let relative_index = group_index.checked_sub(root_offset)?;
    items.get(relative_index)
}

fn typed_default_paths(params: &SExpr, params_path: &OccurrencePath) -> Vec<OccurrencePath> {
    let SExpr::List { values, .. } = params else {
        return Vec::new();
    };
    let mut out = Vec::new();
    for (index, param) in values.iter().enumerate() {
        let mut path = params_path.0.clone();
        path.push(index);
        collect_default_paths(param, &path, true, &mut out);
    }
    out
}

fn collect_default_paths(node: &SExpr, path: &[usize], typed: bool, out: &mut Vec<OccurrencePath>) {
    let SExpr::List { values, .. } = node else {
        return;
    };
    match values.first().and_then(SExpr::as_atom) {
        Some("default") => {
            let value_index = if typed { 3 } else { 2 };
            if values.get(value_index).is_some() {
                let mut value_path = path.to_vec();
                value_path.push(value_index);
                out.push(OccurrencePath(value_path));
            }
            if !typed && values.get(1).is_some() {
                let mut nested = path.to_vec();
                nested.push(1);
                collect_default_paths(&values[1], &nested, typed, out);
            }
        }
        Some("rest") => {
            let nested_index = if typed { 2 } else { 1 };
            if let Some(nested) = values.get(nested_index) {
                let mut nested_path = path.to_vec();
                nested_path.push(nested_index);
                collect_default_paths(nested, &nested_path, typed, out);
            }
        }
        Some("array" | "object") => {
            for (index, member) in values.iter().enumerate().skip(1) {
                let SExpr::List { values: parts, .. } = member else {
                    continue;
                };
                let mut member_path = path.to_vec();
                member_path.push(index);
                match parts.first().and_then(SExpr::as_atom) {
                    Some("default" | "rest" | "array" | "object") => {
                        collect_default_paths(member, &member_path, typed, out)
                    }
                    Some("alias") => {
                        let nested_index = if typed { 3 } else { 2 };
                        if let Some(nested) = parts.get(nested_index) {
                            let mut nested_path = member_path.clone();
                            nested_path.push(nested_index);
                            collect_default_paths(nested, &nested_path, typed, out);
                        }
                        if !typed && parts.get(3).is_some() {
                            let mut value_path = member_path;
                            value_path.push(3);
                            out.push(OccurrencePath(value_path));
                        }
                    }
                    _ => {}
                }
            }
        }
        _ => {}
    }
}

pub(crate) fn class_regions(form: &SExpr) -> Option<ClassRegions> {
    let SExpr::List { values, .. } = form else {
        return None;
    };
    let head = values.first().and_then(SExpr::as_atom)?;
    let (name_path, base_index, member_index) = match head {
        "class" => (values.get(1).map(|_| OccurrencePath(vec![1])), 2, 3),
        "class-expr" => (None, 1, 2),
        _ => return None,
    };
    let base_paths = match values.get(base_index) {
        Some(SExpr::List { values: bases, .. }) => bases
            .iter()
            .enumerate()
            .map(|(index, _)| OccurrencePath(vec![base_index, index]))
            .collect(),
        _ => Vec::new(),
    };
    let members = values
        .get(member_index..)?
        .iter()
        .enumerate()
        .map(|(index, member)| class_member_regions(member, vec![member_index + index]))
        .collect();
    Some(ClassRegions {
        name_path,
        base_paths,
        members,
    })
}

fn class_member_regions(member: &SExpr, path: Vec<usize>) -> ClassMemberRegions {
    let SExpr::List { values, .. } = member else {
        return ClassMemberRegions {
            path: OccurrencePath(path),
            grammar: ClassMemberGrammar::Opaque,
            inner: None,
            params_path: None,
            default_paths: Vec::new(),
            body_paths: Vec::new(),
            init_paths: Vec::new(),
        };
    };
    let head = values.first().and_then(SExpr::as_atom).unwrap_or("");
    if matches!(head, "static" | "async") {
        let inner = values.get(1).map(|member| {
            let mut inner_path = path.clone();
            inner_path.push(1);
            Box::new(class_member_regions(member, inner_path))
        });
        return ClassMemberRegions {
            path: OccurrencePath(path),
            grammar: ClassMemberGrammar::Wrapper,
            inner,
            params_path: None,
            default_paths: Vec::new(),
            body_paths: Vec::new(),
            init_paths: Vec::new(),
        };
    }
    if head == "field" {
        let init_paths = values
            .get(2)
            .map(|_| OccurrencePath([path.as_slice(), &[2]].concat()))
            .into_iter()
            .collect();
        return ClassMemberRegions {
            path: OccurrencePath(path),
            grammar: ClassMemberGrammar::Field,
            inner: None,
            params_path: None,
            default_paths: Vec::new(),
            body_paths: Vec::new(),
            init_paths,
        };
    }
    let (grammar, params_index, body_start) = match head {
        "constructor" => (ClassMemberGrammar::Constructor, 1, 2),
        "get" => (ClassMemberGrammar::Getter, 2, 3),
        "set" => (ClassMemberGrammar::Setter, 2, 3),
        _ => (ClassMemberGrammar::Method, 1, 2),
    };
    let params_path = values
        .get(params_index)
        .filter(|params| matches!(params, SExpr::List { .. }))
        .map(|_| OccurrencePath([path.as_slice(), &[params_index]].concat()));
    let default_paths = params_path
        .as_ref()
        .and_then(|params_path| {
            at_path(member, &OccurrencePath(vec![params_index]))
                .map(|params| binding_default_paths(params, params_path))
        })
        .unwrap_or_default();
    let body_paths = values
        .iter()
        .enumerate()
        .skip(body_start)
        .map(|(index, _)| OccurrencePath([path.as_slice(), &[index]].concat()))
        .collect();
    ClassMemberRegions {
        path: OccurrencePath(path),
        grammar,
        inner: None,
        params_path,
        default_paths,
        body_paths,
        init_paths: Vec::new(),
    }
}

fn binding_default_paths(params: &SExpr, params_path: &OccurrencePath) -> Vec<OccurrencePath> {
    let SExpr::List { values, .. } = params else {
        return Vec::new();
    };
    let mut out = Vec::new();
    for (index, param) in values.iter().enumerate() {
        let mut path = params_path.0.clone();
        path.push(index);
        collect_default_paths(param, &path, false, &mut out);
    }
    out
}

/// Resolve a path against the original tree without node-identity guessing.
pub(crate) fn at_path<'a>(root: &'a SExpr, path: &OccurrencePath) -> Option<&'a SExpr> {
    path.0.iter().try_fold(root, |node, index| match node {
        SExpr::List { values, .. } => values.get(*index),
        _ => None,
    })
}
