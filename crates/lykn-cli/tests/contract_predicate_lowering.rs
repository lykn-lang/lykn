use std::process::{Command, Output};

use serde_json::{Value, json};
use tempfile::TempDir;

const OBSERVE: &str = r#"
(func observe
  :args (:string label :function thunk)
  :body
  (try
    (console:log (JSON:stringify (obj :label label :value (thunk))))
    (catch err
      (console:log
        (JSON:stringify
          (obj :label label
            :error (obj :name err:name :message err:message)))))))
"#;

struct Observation {
    label: &'static str,
    expected_value: Option<Value>,
    error_message: Option<&'static str>,
}

struct Fixture {
    name: &'static str,
    source: String,
    observations: Vec<Observation>,
    following_statement_output: Option<&'static str>,
}

fn observation(label: &'static str, expected_value: Value) -> Observation {
    Observation {
        label,
        expected_value: Some(expected_value),
        error_message: None,
    }
}

fn rejected(label: &'static str, expected_message: &'static str) -> Observation {
    Observation {
        label,
        expected_value: None,
        error_message: Some(expected_message),
    }
}

fn fixture(name: &'static str, body: &str, observations: Vec<Observation>) -> Fixture {
    Fixture {
        name,
        source: format!("{OBSERVE}\n{body}"),
        observations,
        following_statement_output: None,
    }
}

fn fixtures() -> Vec<Fixture> {
    let mut nested_value_context = fixture(
        "nested-value-context",
        r#"
(func nested-check
  :args (:any x)
  :pre
    (cond
      ((and (> x 0) (or (= x 42) (= x 43))) (not (!= x 42)))
      (:else false))
  :body x)
(observe "nested-valid" (fn () (nested-check 42)))
(observe "nested-invalid" (fn () (nested-check 43)))
(if true (bind following-statement 99))
(if (= following-statement 99) (console:log "following-statement-ok"))
"#,
        vec![
            observation("nested-valid", json!(42)),
            rejected(
                "nested-invalid",
                "nested-check: pre-condition failed: (cond ((and (> x 0) (or (= x 42) (= x 43))) (not (!= x 42))) (:else false)) — caller blame",
            ),
        ],
    );
    nested_value_context.following_statement_output = Some("following-statement-ok");

    vec![
        fixture(
            "exact-yaml",
            r#"
(func parse-yaml-fixture :args (:string text) :returns :object :pre (= text "answer: 42") :body (obj :answer 42))
(exports parse-yaml-fixture)
(observe "yaml-valid" (fn () (parse-yaml-fixture "answer: 42")))
(observe "yaml-invalid" (fn () (parse-yaml-fixture "answer: 41")))
"#,
            vec![
                observation("yaml-valid", json!({"answer": 42})),
                rejected(
                    "yaml-invalid",
                    "parse-yaml-fixture: pre-condition failed: (= text \"answer: 42\") — caller blame",
                ),
            ],
        ),
        fixture(
            "strict-pre",
            r#"
(func strict-pre :args (:any x) :pre (= x 42) :body x)
(observe "pre-valid" (fn () (strict-pre 42)))
(observe "pre-invalid" (fn () (strict-pre "42")))
"#,
            vec![
                observation("pre-valid", json!(42)),
                rejected(
                    "pre-invalid",
                    "strict-pre: pre-condition failed: (= x 42) — caller blame",
                ),
            ],
        ),
        fixture(
            "strict-post",
            r#"
(func strict-post :args (:any x) :post (= ~ 42) :body x)
(observe "post-valid" (fn () (strict-post 42)))
(observe "post-invalid" (fn () (strict-post "42")))
"#,
            vec![
                observation("post-valid", json!(42)),
                rejected(
                    "post-invalid",
                    "strict-post: post-condition failed: (= ~ 42) — callee blame",
                ),
            ],
        ),
        fixture(
            "multi-clause",
            r#"
(func multi-check
  (:args (:any actual)
   :pre (= actual 42)
   :post (= ~ 42)
   :body actual)
  (:args (:any actual :any expected)
   :pre (= expected 42)
   :post (= ~ 42)
   :body actual))
(observe "multi-arity1-valid" (fn () (multi-check 42)))
(observe "multi-arity1-pre-invalid" (fn () (multi-check "42")))
(observe "multi-arity2-valid" (fn () (multi-check 42 42)))
(observe "multi-arity2-pre-invalid" (fn () (multi-check 41 41)))
(observe "multi-arity2-post-invalid" (fn () (multi-check 41 42)))
"#,
            vec![
                observation("multi-arity1-valid", json!(42)),
                rejected(
                    "multi-arity1-pre-invalid",
                    "multi-check: pre-condition failed: (= actual 42) — caller blame",
                ),
                observation("multi-arity2-valid", json!(42)),
                rejected(
                    "multi-arity2-pre-invalid",
                    "multi-check: pre-condition failed: (= expected 42) — caller blame",
                ),
                rejected(
                    "multi-arity2-post-invalid",
                    "multi-check: post-condition failed: (= ~ 42) — callee blame",
                ),
            ],
        ),
        fixture(
            "generator",
            r#"
(genfunc guarded-sequence
  :args (:any x)
  :yields :any
  :pre (= x 42)
  :body (yield x))
(observe "generator-valid" (fn () (Array:from (guarded-sequence 42))))
(observe "generator-invalid" (fn () (Array:from (guarded-sequence "42"))))
"#,
            vec![
                observation("generator-valid", json!([42])),
                rejected(
                    "generator-invalid",
                    "guarded-sequence: pre-condition failed: (= x 42) — caller blame",
                ),
            ],
        ),
        nested_value_context,
        fixture(
            "resolved-bound-head",
            r#"
(func callback-check
  :args (:function not)
  :pre (not false)
  :body 7)
(observe "bound-negation-valid" (fn () (callback-check (fn (:boolean value) (if value false true)))))
(observe "bound-negation-invalid" (fn () (callback-check (fn (:boolean value) value))))
"#,
            vec![
                observation("bound-negation-valid", json!(7)),
                rejected(
                    "bound-negation-invalid",
                    "callback-check: pre-condition failed: (not false) — caller blame",
                ),
            ],
        ),
    ]
}

fn execute(command: &mut Command) -> Result<Output, String> {
    command
        .output()
        .map_err(|error| format!("failed to start command: {error}"))
}

fn run_fixture(fixture: &Fixture, failures: &mut Vec<String>) {
    let temp = match TempDir::new() {
        Ok(temp) => temp,
        Err(error) => {
            failures.push(format!("{}: create temp directory: {error}", fixture.name));
            return;
        }
    };
    let source_path = temp.path().join("fixture.lykn");
    let output_path = temp.path().join("fixture.js");
    if let Err(error) = std::fs::write(&source_path, &fixture.source) {
        failures.push(format!("{}: write source: {error}", fixture.name));
        return;
    }

    let compile = execute(
        Command::new(env!("CARGO_BIN_EXE_lykn"))
            .current_dir(temp.path())
            .arg("compile")
            .arg(&source_path)
            .arg("-o")
            .arg(&output_path),
    );
    let compile = match compile {
        Ok(output) => output,
        Err(error) => {
            failures.push(format!("{}: strict compile {error}", fixture.name));
            return;
        }
    };
    if !compile.status.success() {
        failures.push(format!(
            "{}: strict compile exit {:?}\nstdout: {}\nstderr: {}\n{} observations unrun",
            fixture.name,
            compile.status.code(),
            String::from_utf8_lossy(&compile.stdout),
            String::from_utf8_lossy(&compile.stderr),
            fixture.observations.len(),
        ));
        return;
    }

    let run = execute(
        Command::new("deno")
            .current_dir(temp.path())
            .args([
                "run",
                "--no-config",
                "--cached-only",
                "--no-npm",
                "--no-remote",
                "--deny-net",
                "--no-prompt",
            ])
            .arg(&output_path),
    );
    let run = match run {
        Ok(output) => output,
        Err(error) => {
            failures.push(format!(
                "{}: Deno runtime failed to start: {error}; {} observations unrun",
                fixture.name,
                fixture.observations.len(),
            ));
            return;
        }
    };
    let stdout = String::from_utf8_lossy(&run.stdout);
    let stderr = String::from_utf8_lossy(&run.stderr);
    if !run.status.success() {
        failures.push(format!(
            "{}: Deno exit {:?}\nstdout: {stdout}\nstderr: {stderr}\n{} observations not established",
            fixture.name,
            run.status.code(),
            fixture.observations.len(),
        ));
        return;
    }

    if let Some(marker) = fixture.following_statement_output {
        if !stdout.lines().any(|line| line == marker) {
            failures.push(format!(
                "{}: following statement-position if did not emit {marker:?}; stdout: {stdout}",
                fixture.name
            ));
        }
    }
    let records: Vec<Value> = stdout
        .lines()
        .filter(|line| Some(*line) != fixture.following_statement_output)
        .filter_map(|line| match serde_json::from_str(line) {
            Ok(record) => Some(record),
            Err(error) => {
                failures.push(format!(
                    "{}: non-JSON runtime stdout {line:?}: {error}",
                    fixture.name
                ));
                None
            }
        })
        .collect();
    if records.len() != fixture.observations.len() {
        failures.push(format!(
            "{}: expected {} observations, got {}\nstdout: {stdout}\nstderr: {stderr}",
            fixture.name,
            fixture.observations.len(),
            records.len(),
        ));
    }

    for expected in &fixture.observations {
        let Some(record) = records
            .iter()
            .find(|record| record.get("label").and_then(Value::as_str) == Some(expected.label))
        else {
            failures.push(format!(
                "{} / {}: missing runtime observation; stdout: {stdout}",
                fixture.name, expected.label
            ));
            continue;
        };
        if let Some(value) = &expected.expected_value {
            if record.get("value") != Some(value) {
                failures.push(format!(
                    "{} / {}: expected value {value}, got {record}",
                    fixture.name, expected.label
                ));
            }
            if record.get("error").is_some() {
                failures.push(format!(
                    "{} / {}: expected success, got {record}",
                    fixture.name, expected.label
                ));
            }
        } else if let Some(message) = expected.error_message {
            if record.pointer("/error/name") != Some(&json!("Error"))
                || !record
                    .pointer("/error/message")
                    .and_then(Value::as_str)
                    .is_some_and(|actual| actual.contains(message))
            {
                failures.push(format!(
                    "{} / {}: expected runtime Error containing {message:?}, got {record}",
                    fixture.name, expected.label
                ));
            }
        }
    }
    eprintln!(
        "OBSERVED {}: {} inputs; exit={:?}; stdout={stdout:?}; stderr={stderr:?}",
        fixture.name,
        fixture.observations.len(),
        run.status.code(),
    );
}

#[test]
fn strict_native_contract_predicates_lower_and_preserve_blame() {
    let fixtures = fixtures();
    assert_eq!(fixtures.len(), 7, "fixed fixture family denominator");
    assert_eq!(
        fixtures
            .iter()
            .map(|fixture| fixture.observations.len())
            .sum::<usize>(),
        17,
        "fixed input observation denominator"
    );

    let mut failures = Vec::new();
    for fixture in &fixtures {
        run_fixture(fixture, &mut failures);
    }
    assert!(failures.is_empty(), "{}", failures.join("\n\n"));
}
