# PRD: Add Priority to Tasks

**Date:** 2026-02-26
**Status:** Draft
**GitHub Issue:** #1

---

## Problem Statement

All tasks are treated equally — there's no way to signal what to work on first. Users scanning a flat list must mentally triage every time, slowing decisions and increasing the chance low-value work gets done before high-value work.

## Value Proposition

A single `--priority` flag at creation plus color-coded output turns the task list into a lightweight triage board without adding workflow complexity.

## User Profiles

| Persona | Description | Pain point |
|---------|-------------|------------|
| Solo developer | Uses task-pilot for personal TODOs | Can't distinguish urgent bugs from nice-to-haves at a glance |

## Goals

- [ ] Tasks can be assigned a priority (`high`, `medium`, `low`) at creation
- [ ] Default priority is `medium` when unspecified
- [ ] Task list can be filtered by priority via `--priority`
- [ ] Priority is visually distinct in CLI output (color-coded)

## Non-Goals

- Not adding priority-based sort order (list stays insertion-order)
- Not supporting priority changes after creation (no `edit` command yet)
- Not adding due dates or scheduling

## Proposed Solution

Add an optional `priority` field to the task schema. Expose via `--priority` on `add` and as a filter on `list`. Color-code priority labels in terminal output (red = high, yellow = medium, cyan = low).

## User Flows

### Flow 1: Add a task with priority

1. User runs `node src/cli.js add "Fix login bug" --priority high`
2. Task created with `priority: "high"`, persisted to `tasks.json`
3. CLI prints success with task ID

### Flow 2: Add a task without priority

1. User runs `node src/cli.js add "Update README"`
2. Task created with `priority: "medium"` (default)
3. CLI prints success

### Flow 3: Filter by priority

1. User runs `node src/cli.js list --priority high`
2. CLI shows only high-priority tasks, color-coded
3. If none match, prints "No tasks found."

## Open Questions

- [ ] Should `list` sort by priority by default (high → medium → low)?
- [ ] Should there be an `edit`/`update` command to change priority post-creation?
- [ ] Validate priority values on input, or silently accept arbitrary strings?
