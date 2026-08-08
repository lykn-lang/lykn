# Deno Task Runner

Using `deno task` for lykn project scripts. Tasks are defined in
`deno.json` and replace `npm run` / `npm scripts`.

For the full treatment, see the JS guide `12-deno/12-03-task-runner.md`.

Target environment: **Deno**, **ESM-only**. Use `deno task` for task
orchestration; use lykn wrappers inside tasks for normal lykn project actions.

---

## ID-01: Define Tasks in `deno.json`

**Strength**: SHOULD

```json
{
  "tasks": {
    "build": "lykn build",
    "dev": "lykn run packages/myapp/main.lykn",
    "test": "lykn test",
    "lint": "lykn lint packages/myapp test",
    "check": "lykn build && lykn lint packages/myapp test && lykn test",
    "fmt": "lykn fmt -w packages/myapp/*.lykn test/**/*.lykn",
    "dist": "lykn dist"
  }
}
```

---

## ID-02: `deno task` Replaces `npm run`

```sh
deno task build     # build workspace packages
deno task test      # compile lykn tests + run Deno's test runner
deno task lint      # lint lykn source
deno task check     # build + lint + test
deno task dev       # run the lykn entry point
```

---

## ID-03: lykn Build Tasks

Typical `deno.json` tasks for lykn projects call the lykn wrappers directly:

```json
{
  "tasks": {
    "build": "lykn build",
    "test": "lykn test",
    "lint": "lykn lint packages/myapp test",
    "check": "lykn build && lykn lint packages/myapp test && lykn test",
    "run": "lykn run packages/myapp/main.lykn"
  }
}
```

---

## ID-04: Watch Mode

```sh
# Run the configured development task
deno task dev
```

`deno task` remains useful as the cross-platform task runner. If you need
file-watch behaviour, put the watcher around the lykn command or use an
external watcher that re-runs the task; do not make repo-root generated JS the
primary workflow target.

---

## Related Guidelines

- **Project Structure**: See `10-project-structure.md` ID-15
- **No-Node Boundary**: See `14-no-node-boundary.md` ID-07
