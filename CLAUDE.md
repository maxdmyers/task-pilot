# task-pilot

CLI tool for managing local tasks in a JSON file. Pure Node.js, no frameworks, no build step.

## Project Structure

```
src/
  cli.js            # Entry point — command routing, arg parsing, process.exit on errors
  tasks.js          # Business logic — addTask, listTasks, completeTask, deleteTask
  storage.js        # Persistence — loadTasks/saveTasks against data/tasks.json
  utils/format.js   # ANSI-colored terminal output helpers
tests/
  tasks.test.js     # Task operation tests (12 tests)
  storage.test.js   # Storage layer tests (4 tests)
data/
  tasks.json        # Task data (user-specific, excluded from claude context via .claudeignore)
```

## Commands

```
node src/cli.js add "description" [--priority high|medium|low]
node src/cli.js list [--priority high|medium|low]
node src/cli.js complete <id>
node src/cli.js delete <id>
```

## Task Schema

```js
{
  id: number,                           // Auto-increment (max existing + 1)
  description: string,
  priority: 'high' | 'medium' | 'low', // Default: 'medium'
  completed: boolean,                   // Default: false
  createdAt: string                     // ISO 8601 timestamp
}
```

Stored as a JSON array in `data/tasks.json`, pretty-printed with 2-space indent.

## Code Style

- **CommonJS** (`require`/`module.exports`), not ESM
- **No TypeScript** — plain `.js` files
- 2-space indent, semicolons
- Files: lowercase (`cli.js`, `format.js`). Functions/vars: camelCase. Constants: `UPPER_SNAKE_CASE`
- No linter or formatter configured — follow existing style
- Modules export explicit named objects: `module.exports = { fn1, fn2 }`

## Architecture Patterns

- **Layering**: `cli.js` (arg parsing + output) → `tasks.js` (business logic) → `storage.js` (file I/O). Keep concerns separated — CLI never touches `fs`, storage never formats output.
- **CLI parsing**: Manual `process.argv.slice(2)` with `getFlag(name)` helper for `--flag value` pairs. No CLI framework.
- **Error handling**: Validate args in `cli.js`, `process.exit(1)` on bad input. Business logic returns `null` for not-found. Storage catches `ENOENT` → `[]`.
- **Data normalization**: `saveTasks()` normalizes every task on write — defaults priority, truncates description to 200 chars, coerces `completed` to boolean. Known bug: truncation corrupts long descriptions on re-save (see #3).
- **Output**: All user-facing output goes through `format.js` helpers (`formatTask`, `formatTaskList`, `formatSuccess`, `formatError`). Colors via raw ANSI escape codes.
- **I/O**: Synchronous (`readFileSync`/`writeFileSync`). No async anywhere.

## Testing

- **Framework**: Jest 29 — run with `npm test`
- **No config** — uses Jest defaults
- **Fixture-based**: `beforeEach` writes known task arrays to `data/tasks.json`. `afterAll` restores. Tests hit the real file (integration-style).
- **No mocks** — exercises full read/write path
- **Structure**: `describe()` per function, one assertion per `test()`
- **Run tests** after changing any file in `src/`
