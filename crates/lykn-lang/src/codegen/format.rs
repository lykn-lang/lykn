//! JavaScript source text writer with indentation tracking.
//!
//! `JsWriter` accumulates output text while managing a two-space indentation
//! level. It lazily prepends indentation only when the first write after a
//! newline occurs.

/// A buffer that builds indented JavaScript source text.
pub struct JsWriter {
    buf: String,
    indent_level: usize,
    at_line_start: bool,
}

impl JsWriter {
    /// Create a new writer with an empty buffer.
    pub fn new() -> Self {
        Self {
            buf: String::new(),
            indent_level: 0,
            at_line_start: true,
        }
    }

    /// Write a string fragment. If at the start of a line, prepend indentation
    /// first.
    pub fn write(&mut self, s: &str) {
        if s.is_empty() {
            return;
        }
        if self.at_line_start {
            for _ in 0..self.indent_level {
                self.buf.push_str("  ");
            }
            self.at_line_start = false;
        }
        self.buf.push_str(s);
    }

    /// Write a single character. If at the start of a line, prepend indentation
    /// first.
    pub fn write_char(&mut self, c: char) {
        if self.at_line_start {
            for _ in 0..self.indent_level {
                self.buf.push_str("  ");
            }
            self.at_line_start = false;
        }
        self.buf.push(c);
    }

    /// Emit a newline character and mark the next write as line-start.
    pub fn newline(&mut self) {
        self.buf.push('\n');
        self.at_line_start = true;
    }

    /// Increase indentation by one level.
    pub fn indent(&mut self) {
        self.indent_level += 1;
    }

    /// Decrease indentation by one level.
    pub fn dedent(&mut self) {
        self.indent_level = self.indent_level.saturating_sub(1);
    }

    /// Write a semicolon followed by a newline.
    pub fn semicolon(&mut self) {
        self.write(";");
        self.newline();
    }

    /// Consume the writer and return the built string.
    pub fn finish(self) -> String {
        self.buf
    }
}

impl Default for JsWriter {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_write_simple_text() {
        let mut w = JsWriter::new();
        w.write("hello");
        assert_eq!(w.finish(), "hello");
    }

    #[test]
    fn test_newline_and_indent() {
        let mut w = JsWriter::new();
        w.write("a");
        w.newline();
        w.indent();
        w.write("b");
        w.newline();
        w.dedent();
        w.write("c");
        assert_eq!(w.finish(), "a\n  b\nc");
    }

    #[test]
    fn test_semicolon() {
        let mut w = JsWriter::new();
        w.write("x = 1");
        w.semicolon();
        w.write("y = 2");
        w.semicolon();
        assert_eq!(w.finish(), "x = 1;\ny = 2;\n");
    }

    #[test]
    fn test_nested_indentation() {
        let mut w = JsWriter::new();
        w.write("if (x) {");
        w.newline();
        w.indent();
        w.write("if (y) {");
        w.newline();
        w.indent();
        w.write("z();");
        w.newline();
        w.dedent();
        w.write("}");
        w.newline();
        w.dedent();
        w.write("}");
        assert_eq!(w.finish(), "if (x) {\n  if (y) {\n    z();\n  }\n}");
    }

    #[test]
    fn test_dedent_does_not_underflow() {
        let mut w = JsWriter::new();
        w.dedent();
        w.dedent();
        w.write("ok");
        assert_eq!(w.finish(), "ok");
    }

    #[test]
    fn test_empty_write_is_noop() {
        let mut w = JsWriter::new();
        w.write("");
        w.write("a");
        assert_eq!(w.finish(), "a");
    }

    #[test]
    fn test_indent_at_start_of_buffer() {
        let mut w = JsWriter::new();
        w.indent();
        w.write("x");
        assert_eq!(w.finish(), "  x");
    }
}
