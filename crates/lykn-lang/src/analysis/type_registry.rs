use std::collections::HashMap;

use crate::diagnostics::{Diagnostic, Severity};
use crate::reader::source_loc::Span;

/// A single field within a constructor.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct FieldDef {
    pub name: String,
    pub type_keyword: String,
}

/// A constructor belonging to a sum type.
#[derive(Debug, Clone, PartialEq)]
pub struct ConstructorDef {
    pub name: String,
    pub fields: Vec<FieldDef>,
    pub owning_type: String,
    pub span: Span,
}

/// A type definition with its constructors.
#[derive(Debug, Clone, PartialEq)]
pub struct TypeDef {
    pub name: String,
    pub module_path: Option<String>,
    pub constructors: Vec<ConstructorDef>,
    /// Blessed types (e.g., `Option`, `Result`) receive enhanced diagnostic
    /// messages.
    pub is_blessed: bool,
    pub span: Span,
}

/// Central registry mapping type names to definitions and constructor names
/// to their owning types.
#[derive(Debug, Clone, Default)]
pub struct TypeRegistry {
    types: HashMap<String, TypeDef>,
    constructor_to_type: HashMap<String, String>,
}

impl TypeRegistry {
    /// Register a type definition. Returns an error diagnostic if any
    /// constructor name is already registered to a non-blessed (user-defined)
    /// type. Blessed (prelude) types can be shadowed by user definitions per
    /// DD-15: "Shadowing allowed — local definitions win, lose compiler
    /// enhancement."
    pub fn register_type(&mut self, typedef: TypeDef) -> Result<(), Diagnostic> {
        // Collect blessed type names that will be shadowed so we can clean
        // them up after the validation pass.
        let mut shadowed_blessed: Vec<String> = Vec::new();

        for ctor in &typedef.constructors {
            if let Some(existing_type_name) = self.constructor_to_type.get(&ctor.name) {
                let existing_is_blessed = self
                    .types
                    .get(existing_type_name)
                    .is_some_and(|td| td.is_blessed);

                if existing_is_blessed {
                    // Prelude type — shadowing is allowed.
                    if !shadowed_blessed.contains(existing_type_name) {
                        shadowed_blessed.push(existing_type_name.clone());
                    }
                } else {
                    // User-defined type — real duplicate, reject.
                    return Err(Diagnostic {
                        severity: Severity::Error,
                        message: format!(
                            "duplicate constructor '{}' (already defined in type '{}')",
                            ctor.name, existing_type_name
                        ),
                        span: ctor.span,
                        suggestion: None,
                    });
                }
            }
        }

        // Remove shadowed blessed types and their constructor mappings.
        for blessed_name in &shadowed_blessed {
            if let Some(old_td) = self.types.remove(blessed_name) {
                for old_ctor in &old_td.constructors {
                    self.constructor_to_type.remove(&old_ctor.name);
                }
            }
        }

        // Insert the new type and its constructor mappings.
        for ctor in &typedef.constructors {
            self.constructor_to_type
                .insert(ctor.name.clone(), typedef.name.clone());
        }
        self.types.insert(typedef.name.clone(), typedef);
        Ok(())
    }

    /// Look up a type definition by name.
    pub fn lookup_type(&self, name: &str) -> Option<&TypeDef> {
        self.types.get(name)
    }

    /// Look up a constructor definition by name.
    pub fn lookup_constructor(&self, name: &str) -> Option<&ConstructorDef> {
        let type_name = self.constructor_to_type.get(name)?;
        let typedef = self.types.get(type_name)?;
        typedef.constructors.iter().find(|c| c.name == name)
    }

    /// Get the type definition that owns a given constructor.
    pub fn owning_type_of(&self, constructor: &str) -> Option<&TypeDef> {
        let type_name = self.constructor_to_type.get(constructor)?;
        self.types.get(type_name)
    }

    /// Return all constructors belonging to a named type.
    pub fn all_constructors_of(&self, type_name: &str) -> Vec<&ConstructorDef> {
        self.types
            .get(type_name)
            .map_or(Vec::new(), |td| td.constructors.iter().collect())
    }

    /// Check whether a given name is a registered constructor.
    pub fn is_constructor(&self, name: &str) -> bool {
        self.constructor_to_type.contains_key(name)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::reader::source_loc::Span;

    fn span() -> Span {
        Span::default()
    }

    fn option_type() -> TypeDef {
        TypeDef {
            name: "Option".into(),
            module_path: None,
            constructors: vec![
                ConstructorDef {
                    name: "Some".into(),
                    fields: vec![FieldDef {
                        name: "value".into(),
                        type_keyword: "any".into(),
                    }],
                    owning_type: "Option".into(),
                    span: span(),
                },
                ConstructorDef {
                    name: "None".into(),
                    fields: vec![],
                    owning_type: "Option".into(),
                    span: span(),
                },
            ],
            is_blessed: true,
            span: span(),
        }
    }

    #[test]
    fn test_register_and_lookup_type() {
        let mut reg = TypeRegistry::default();
        reg.register_type(option_type()).unwrap();

        let td = reg.lookup_type("Option").unwrap();
        assert_eq!(td.name, "Option");
        assert_eq!(td.constructors.len(), 2);
    }

    #[test]
    fn test_lookup_constructor() {
        let mut reg = TypeRegistry::default();
        reg.register_type(option_type()).unwrap();

        let ctor = reg.lookup_constructor("Some").unwrap();
        assert_eq!(ctor.owning_type, "Option");
        assert_eq!(ctor.fields.len(), 1);

        let ctor = reg.lookup_constructor("None").unwrap();
        assert_eq!(ctor.fields.len(), 0);
    }

    #[test]
    fn test_owning_type_of() {
        let mut reg = TypeRegistry::default();
        reg.register_type(option_type()).unwrap();

        let td = reg.owning_type_of("Some").unwrap();
        assert_eq!(td.name, "Option");

        assert!(reg.owning_type_of("Nonexistent").is_none());
    }

    #[test]
    fn test_all_constructors_of() {
        let mut reg = TypeRegistry::default();
        reg.register_type(option_type()).unwrap();

        let ctors = reg.all_constructors_of("Option");
        assert_eq!(ctors.len(), 2);

        let ctors = reg.all_constructors_of("Nonexistent");
        assert!(ctors.is_empty());
    }

    #[test]
    fn test_duplicate_constructor_detection_user_vs_user() {
        let mut reg = TypeRegistry::default();

        // Register a non-blessed user type.
        let user_type = TypeDef {
            name: "MyOption".into(),
            module_path: None,
            constructors: vec![ConstructorDef {
                name: "Present".into(),
                fields: vec![],
                owning_type: "MyOption".into(),
                span: span(),
            }],
            is_blessed: false,
            span: span(),
        };
        reg.register_type(user_type).unwrap();

        // A second user type reusing the same constructor name should fail.
        let bad = TypeDef {
            name: "Another".into(),
            module_path: None,
            constructors: vec![ConstructorDef {
                name: "Present".into(),
                fields: vec![],
                owning_type: "Another".into(),
                span: span(),
            }],
            is_blessed: false,
            span: span(),
        };

        let err = reg.register_type(bad).unwrap_err();
        assert_eq!(err.severity, Severity::Error);
        assert!(err.message.contains("duplicate constructor 'Present'"));
        assert!(err.message.contains("MyOption"));
    }

    #[test]
    fn test_shadow_blessed_type_allowed() {
        let mut reg = TypeRegistry::default();
        reg.register_type(option_type()).unwrap();

        // A user-defined type reusing blessed constructor names should
        // succeed — DD-15 says shadowing is allowed.
        let user_option = TypeDef {
            name: "Option".into(),
            module_path: None,
            constructors: vec![
                ConstructorDef {
                    name: "Some".into(),
                    fields: vec![FieldDef {
                        name: "value".into(),
                        type_keyword: "any".into(),
                    }],
                    owning_type: "Option".into(),
                    span: span(),
                },
                ConstructorDef {
                    name: "None".into(),
                    fields: vec![],
                    owning_type: "Option".into(),
                    span: span(),
                },
            ],
            is_blessed: false,
            span: span(),
        };

        reg.register_type(user_option).unwrap();

        // The user type should have replaced the blessed one.
        let td = reg.lookup_type("Option").unwrap();
        assert!(!td.is_blessed);
        assert!(reg.is_constructor("Some"));
        assert!(reg.is_constructor("None"));
    }

    #[test]
    fn test_shadow_blessed_partial_overlap() {
        let mut reg = TypeRegistry::default();
        reg.register_type(option_type()).unwrap();

        // A user type that reuses only "Some" from blessed Option.
        // This shadows the entire blessed Option type (removes all its
        // constructors) and registers the new type.
        let custom = TypeDef {
            name: "Custom".into(),
            module_path: None,
            constructors: vec![ConstructorDef {
                name: "Some".into(),
                fields: vec![],
                owning_type: "Custom".into(),
                span: span(),
            }],
            is_blessed: false,
            span: span(),
        };

        reg.register_type(custom).unwrap();

        // "Some" now belongs to Custom.
        let ctor = reg.lookup_constructor("Some").unwrap();
        assert_eq!(ctor.owning_type, "Custom");

        // Blessed Option and its "None" constructor are gone.
        assert!(reg.lookup_type("Option").is_none());
        assert!(!reg.is_constructor("None"));
    }

    #[test]
    fn test_is_constructor() {
        let mut reg = TypeRegistry::default();
        reg.register_type(option_type()).unwrap();

        assert!(reg.is_constructor("Some"));
        assert!(reg.is_constructor("None"));
        assert!(!reg.is_constructor("Option"));
        assert!(!reg.is_constructor("Nonexistent"));
    }

    #[test]
    fn test_blessed_type_flag() {
        let mut reg = TypeRegistry::default();
        reg.register_type(option_type()).unwrap();

        let td = reg.lookup_type("Option").unwrap();
        assert!(td.is_blessed);
    }

    #[test]
    fn test_lookup_nonexistent_type() {
        let reg = TypeRegistry::default();
        assert!(reg.lookup_type("Foo").is_none());
        assert!(reg.lookup_constructor("Foo").is_none());
    }
}
