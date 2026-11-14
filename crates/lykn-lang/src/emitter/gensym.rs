use std::collections::HashSet;

use crate::codegen::names::{emitted_identifier_key, reserve_emitted_atom_names};

/// Deterministic gensym counter for the emitter.
///
/// Separate from the reader's gensym to ensure reproducible output
/// that matches the JS compiler's naming scheme.
#[derive(Debug)]
pub struct EmitterGensym {
    counter: usize,
    occupied: HashSet<String>,
}

impl EmitterGensym {
    pub fn new() -> Self {
        Self {
            counter: 0,
            occupied: HashSet::new(),
        }
    }

    /// Generate the next name with the given prefix, skipping occupied emitted
    /// identifiers while preserving the public spelling scheme.
    ///
    /// Produces names of the form `{prefix}__gensym{N}`.
    ///
    /// # Panics
    /// Panics only if the finite `usize` generated-name counter is exhausted;
    /// source input cannot contain enough names to reach that invariant.
    pub fn next(&mut self, prefix: &str) -> String {
        loop {
            let suffix = self.counter;
            self.counter = self
                .counter
                .checked_add(1)
                .expect("emitter gensym namespace exhausted");
            let name = format!("{prefix}__gensym{suffix}");
            if self.occupied.insert(emitted_identifier_key(&name)) {
                return name;
            }
        }
    }

    pub(super) fn reserve(&mut self, name: &str) {
        reserve_emitted_atom_names(name, &mut self.occupied);
    }

    pub(super) fn preferred(&mut self, name: &str) -> String {
        if self.occupied.insert(emitted_identifier_key(name)) {
            name.to_string()
        } else {
            self.next(name)
        }
    }

    /// Start a fresh allocation namespace by clearing the counter and all
    /// source/generated name occupancy.
    pub fn reset(&mut self) {
        self.counter = 0;
        self.occupied.clear();
    }
}

impl Default for EmitterGensym {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_next_produces_sequential_names() {
        let mut g = EmitterGensym::new();
        assert_eq!(g.next("t"), "t__gensym0");
        assert_eq!(g.next("t"), "t__gensym1");
        assert_eq!(g.next("result"), "result__gensym2");
    }

    #[test]
    fn test_reset_restarts_counter() {
        let mut g = EmitterGensym::new();
        g.next("x");
        g.next("x");
        g.reset();
        assert_eq!(g.next("x"), "x__gensym0");
    }

    #[test]
    fn test_default_starts_at_zero() {
        let mut g = EmitterGensym::default();
        assert_eq!(g.next("v"), "v__gensym0");
    }

    #[test]
    fn allocations_skip_normalized_occupancy_and_reset_namespace() {
        let mut g = EmitterGensym::new();
        g.reserve("result__gensym0!");
        assert_eq!(g.next("result"), "result__gensym1");
        assert_eq!(g.preferred("args"), "args");
        assert_eq!(g.preferred("args"), "args__gensym2");
        g.reset();
        assert_eq!(g.next("result"), "result__gensym0");
    }

    #[test]
    fn generated_candidates_compare_decoded_emitted_keys_in_both_directions() {
        let mut literal_first = EmitterGensym::new();
        literal_first.reserve("helper___gensym0");
        assert_eq!(
            literal_first.next(r"helper\u005f"),
            r"helper\u005f__gensym1"
        );

        let mut escaped_first = EmitterGensym::new();
        let escaped = escaped_first.next(r"helper\u005f");
        assert_eq!(escaped, r"helper\u005f__gensym0");
        assert_eq!(
            escaped_first.preferred("helper___gensym0"),
            "helper___gensym0__gensym1"
        );

        let mut preferred_literal_first = EmitterGensym::new();
        preferred_literal_first.reserve("await__gensym0");
        assert_eq!(
            preferred_literal_first.preferred(r"await\u005f_gensym0"),
            r"await\u005f_gensym0__gensym0"
        );

        let mut preferred_escape_first = EmitterGensym::new();
        let escaped = r"await\u005f_gensym0";
        assert_eq!(preferred_escape_first.preferred(escaped), escaped);
        assert_eq!(
            preferred_escape_first.preferred("await__gensym0"),
            "await__gensym0__gensym0"
        );
    }
}
