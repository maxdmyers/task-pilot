# task-pilot

CLI task manager that stores tasks in a local JSON file.

## Setup

```bash
npm install
```

## Usage

```bash
# Add a task
node src/cli.js add "Fix login page redirect" --priority high

# List all tasks
node src/cli.js list

# List by priority
node src/cli.js list --priority high

# Complete a task
node src/cli.js complete 1

# Delete a task
node src/cli.js delete 2
```

## Testing

```bash
npm test
```
