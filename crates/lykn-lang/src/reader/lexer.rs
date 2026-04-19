use crate::error::LyknError;
use crate::reader::source_loc::{SourceLoc, Span};

#[derive(Debug, Clone, PartialEq)]
pub enum Token {
    LParen,
    RParen,
    Dot,
    Atom(String),
    Keyword(String),
    String(String),
    Number(f64),
    Bool(bool),
    Null,
    Hash,
    Quote,
    Quasiquote,
    Unquote,
    UnquoteSplice,
}

#[derive(Debug, Clone, PartialEq)]
pub struct SpannedToken {
    pub token: Token,
    pub span: Span,
}

pub fn tokenize(source: &str) -> Result<Vec<SpannedToken>, LyknError> {
    let mut lexer = Lexer::new(source);
    lexer.tokenize_all()
}

struct Lexer {
    chars: Vec<char>,
    pos: usize,
    line: u32,
    column: u32,
}

impl Lexer {
    fn new(source: &str) -> Self {
        Self {
            chars: source.chars().collect(),
            pos: 0,
            line: 1,
            column: 1,
        }
    }

    fn tokenize_all(&mut self) -> Result<Vec<SpannedToken>, LyknError> {
        let mut tokens = Vec::new();
        loop {
            self.skip_whitespace_and_comments();
            if self.pos >= self.chars.len() {
                break;
            }
            tokens.push(self.next_token()?);
        }
        Ok(tokens)
    }

    fn loc(&self) -> SourceLoc {
        SourceLoc {
            line: self.line,
            column: self.column,
        }
    }

    fn peek(&self) -> Option<char> {
        self.chars.get(self.pos).copied()
    }

    fn advance(&mut self) -> Option<char> {
        let ch = self.chars.get(self.pos).copied()?;
        self.pos += 1;
        if ch == '\n' {
            self.line += 1;
            self.column = 1;
        } else {
            self.column += 1;
        }
        Some(ch)
    }

    fn skip_whitespace_and_comments(&mut self) {
        loop {
            // Skip whitespace
            while self.pos < self.chars.len() {
                let ch = self.chars[self.pos];
                if ch == ' ' || ch == '\t' || ch == '\n' || ch == '\r' {
                    self.advance();
                } else {
                    break;
                }
            }
            // Skip line comments
            if self.pos < self.chars.len() && self.chars[self.pos] == ';' {
                while self.pos < self.chars.len() && self.chars[self.pos] != '\n' {
                    self.advance();
                }
                continue;
            }
            break;
        }
    }

    fn next_token(&mut self) -> Result<SpannedToken, LyknError> {
        let start = self.loc();
        let ch = self.advance().unwrap();

        match ch {
            '(' => Ok(SpannedToken {
                token: Token::LParen,
                span: Span::new(start, self.loc()),
            }),
            ')' => Ok(SpannedToken {
                token: Token::RParen,
                span: Span::new(start, self.loc()),
            }),
            '\'' => Ok(SpannedToken {
                token: Token::Quote,
                span: Span::new(start, self.loc()),
            }),
            '`' => Ok(SpannedToken {
                token: Token::Quasiquote,
                span: Span::new(start, self.loc()),
            }),
            ',' => {
                if self.peek() == Some('@') {
                    self.advance();
                    Ok(SpannedToken {
                        token: Token::UnquoteSplice,
                        span: Span::new(start, self.loc()),
                    })
                } else {
                    Ok(SpannedToken {
                        token: Token::Unquote,
                        span: Span::new(start, self.loc()),
                    })
                }
            }
            '#' => Ok(SpannedToken {
                token: Token::Hash,
                span: Span::new(start, self.loc()),
            }),
            '"' => self.read_string(start),
            ':' => {
                // Keyword: read the atom part after :
                if self.peek().is_some_and(|c| !is_delimiter(c)) {
                    let value = self.read_atom_chars();
                    Ok(SpannedToken {
                        token: Token::Keyword(value),
                        span: Span::new(start, self.loc()),
                    })
                } else {
                    // Bare colon — treat as atom
                    Ok(SpannedToken {
                        token: Token::Atom(":".to_string()),
                        span: Span::new(start, self.loc()),
                    })
                }
            }
            _ => {
                // Atom or number
                let mut value = String::new();
                value.push(ch);
                while self.peek().is_some_and(|c| !is_delimiter(c)) {
                    value.push(self.advance().unwrap());
                }

                // Check for special atoms
                let token = match value.as_str() {
                    "true" => Token::Bool(true),
                    "false" => Token::Bool(false),
                    "null" => Token::Null,
                    "." => Token::Dot,
                    _ => {
                        // Try number parse
                        if let Ok(n) = value.parse::<f64>() {
                            if value.starts_with('-')
                                || value.starts_with('+')
                                || value.starts_with(|c: char| c.is_ascii_digit())
                            {
                                Token::Number(n)
                            } else {
                                Token::Atom(value)
                            }
                        } else {
                            Token::Atom(value)
                        }
                    }
                };
                Ok(SpannedToken {
                    token,
                    span: Span::new(start, self.loc()),
                })
            }
        }
    }

    fn read_string(&mut self, start: SourceLoc) -> Result<SpannedToken, LyknError> {
        let mut value = String::new();
        loop {
            match self.advance() {
                None => {
                    return Err(LyknError::Read {
                        message: "unterminated string".to_string(),
                        location: start,
                    });
                }
                Some('"') => break,
                Some('\\') => match self.advance() {
                    Some('n') => value.push('\n'),
                    Some('t') => value.push('\t'),
                    Some('\\') => value.push('\\'),
                    Some('"') => value.push('"'),
                    Some(c) => value.push(c),
                    None => {
                        return Err(LyknError::Read {
                            message: "unterminated escape in string".to_string(),
                            location: self.loc(),
                        });
                    }
                },
                Some(c) => value.push(c),
            }
        }
        Ok(SpannedToken {
            token: Token::String(value),
            span: Span::new(start, self.loc()),
        })
    }

    fn read_atom_chars(&mut self) -> String {
        let mut value = String::new();
        while self.peek().is_some_and(|c| !is_delimiter(c)) {
            value.push(self.advance().unwrap());
        }
        value
    }
}

fn is_delimiter(ch: char) -> bool {
    matches!(
        ch,
        ' ' | '\t' | '\n' | '\r' | '(' | ')' | ';' | '`' | '\'' | ','
    )
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn tokenize_atom() {
        let tokens = tokenize("foo").unwrap();
        assert_eq!(tokens.len(), 1);
        assert_eq!(tokens[0].token, Token::Atom("foo".to_string()));
    }

    #[test]
    fn tokenize_keyword() {
        let tokens = tokenize(":name").unwrap();
        assert_eq!(tokens.len(), 1);
        assert_eq!(tokens[0].token, Token::Keyword("name".to_string()));
    }

    #[test]
    fn tokenize_number() {
        let tokens = tokenize("42").unwrap();
        assert_eq!(tokens.len(), 1);
        assert_eq!(tokens[0].token, Token::Number(42.0));
    }

    #[test]
    fn tokenize_string() {
        let tokens = tokenize("\"hello\"").unwrap();
        assert_eq!(tokens.len(), 1);
        assert_eq!(tokens[0].token, Token::String("hello".to_string()));
    }

    #[test]
    fn tokenize_list() {
        let tokens = tokenize("(+ 1 2)").unwrap();
        assert_eq!(tokens.len(), 5);
        assert_eq!(tokens[0].token, Token::LParen);
        assert_eq!(tokens[1].token, Token::Atom("+".to_string()));
        assert_eq!(tokens[2].token, Token::Number(1.0));
        assert_eq!(tokens[3].token, Token::Number(2.0));
        assert_eq!(tokens[4].token, Token::RParen);
    }

    #[test]
    fn tokenize_bool() {
        let tokens = tokenize("true false").unwrap();
        assert_eq!(tokens[0].token, Token::Bool(true));
        assert_eq!(tokens[1].token, Token::Bool(false));
    }

    #[test]
    fn tokenize_null() {
        let tokens = tokenize("null").unwrap();
        assert_eq!(tokens[0].token, Token::Null);
    }

    #[test]
    fn tokenize_undefined_is_atom() {
        let tokens = tokenize("undefined").unwrap();
        assert_eq!(tokens[0].token, Token::Atom("undefined".to_string()));
    }

    #[test]
    fn tokenize_line_comment() {
        let tokens = tokenize("; comment\nfoo").unwrap();
        assert_eq!(tokens.len(), 1);
        assert_eq!(tokens[0].token, Token::Atom("foo".to_string()));
    }

    #[test]
    fn source_location_tracking() {
        let tokens = tokenize("foo\nbar").unwrap();
        assert_eq!(tokens[0].span.start.line, 1);
        assert_eq!(tokens[0].span.start.column, 1);
        assert_eq!(tokens[1].span.start.line, 2);
        assert_eq!(tokens[1].span.start.column, 1);
    }

    #[test]
    fn tokenize_utf8_em_dash() {
        let tokens = tokenize("\"Good luck \u{2014} lykn\"").unwrap();
        assert_eq!(tokens.len(), 1);
        assert_eq!(
            tokens[0].token,
            Token::String("Good luck \u{2014} lykn".to_string())
        );
    }

    #[test]
    fn tokenize_utf8_multibyte_chars() {
        // Test various multi-byte UTF-8 characters in strings
        let tokens = tokenize("\"caf\u{00e9} \u{1f600} \u{4e16}\u{754c}\"").unwrap();
        assert_eq!(tokens.len(), 1);
        assert_eq!(
            tokens[0].token,
            Token::String("caf\u{00e9} \u{1f600} \u{4e16}\u{754c}".to_string())
        );
    }
}
