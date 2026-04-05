#[derive(Debug, Clone, Copy, PartialEq, Eq, Default)]
pub struct SourceLoc {
    pub line: u32,
    pub column: u32,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Default)]
pub struct Span {
    pub start: SourceLoc,
    pub end: SourceLoc,
}

impl Span {
    pub fn new(start: SourceLoc, end: SourceLoc) -> Self {
        Self { start, end }
    }
}

impl std::fmt::Display for SourceLoc {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}:{}", self.line, self.column)
    }
}

impl std::fmt::Display for Span {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}-{}", self.start, self.end)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn source_loc_default() {
        let loc = SourceLoc::default();
        assert_eq!(loc.line, 0);
        assert_eq!(loc.column, 0);
    }

    #[test]
    fn source_loc_display() {
        let loc = SourceLoc {
            line: 5,
            column: 12,
        };
        assert_eq!(format!("{loc}"), "5:12");
    }

    #[test]
    fn span_new() {
        let start = SourceLoc { line: 1, column: 1 };
        let end = SourceLoc {
            line: 1,
            column: 10,
        };
        let span = Span::new(start, end);
        assert_eq!(span.start, start);
        assert_eq!(span.end, end);
    }

    #[test]
    fn span_default() {
        let span = Span::default();
        assert_eq!(span.start, SourceLoc::default());
        assert_eq!(span.end, SourceLoc::default());
    }

    #[test]
    fn span_display() {
        let span = Span::new(
            SourceLoc { line: 1, column: 1 },
            SourceLoc { line: 3, column: 5 },
        );
        assert_eq!(format!("{span}"), "1:1-3:5");
    }
}
