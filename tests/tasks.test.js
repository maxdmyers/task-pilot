const fs = require('fs');
const path = require('path');
const { addTask, listTasks, completeTask, deleteTask } = require('../src/tasks');
const { DATA_FILE } = require('../src/storage');

const FIXTURE = [
  {
    id: 1,
    description: 'Test task one',
    priority: 'high',
    completed: false,
    createdAt: '2026-02-20T10:00:00.000Z',
  },
  {
    id: 2,
    description: 'Test task two',
    priority: 'low',
    completed: true,
    createdAt: '2026-02-21T10:00:00.000Z',
  },
];

beforeEach(() => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(FIXTURE, null, 2), 'utf-8');
});

afterAll(() => {
  // Restore sample data
  fs.writeFileSync(DATA_FILE, JSON.stringify(FIXTURE, null, 2), 'utf-8');
});

describe('addTask', () => {
  test('adds a task with default priority', () => {
    const task = addTask('New task');
    expect(task.id).toBe(3);
    expect(task.description).toBe('New task');
    expect(task.priority).toBe('medium');
    expect(task.completed).toBe(false);
    expect(task.createdAt).toBeDefined();
  });

  test('adds a task with specified priority', () => {
    const task = addTask('Urgent fix', 'high');
    expect(task.priority).toBe('high');
  });

  test('persists the task to storage', () => {
    addTask('Persisted task');
    const tasks = listTasks();
    expect(tasks).toHaveLength(3);
    expect(tasks[2].description).toBe('Persisted task');
  });
});

describe('listTasks', () => {
  test('returns all tasks', () => {
    const tasks = listTasks();
    expect(tasks).toHaveLength(2);
  });

  test('filters by priority', () => {
    const high = listTasks('high');
    expect(high).toHaveLength(1);
    expect(high[0].priority).toBe('high');
  });

  test('returns empty array for unmatched priority', () => {
    const medium = listTasks('medium');
    expect(medium).toHaveLength(0);
  });
});

describe('completeTask', () => {
  test('marks a task as completed', () => {
    const task = completeTask(1);
    expect(task.completed).toBe(true);
  });

  test('returns null for non-existent id', () => {
    const result = completeTask(999);
    expect(result).toBeNull();
  });

  test('persists completed state', () => {
    completeTask(1);
    const tasks = listTasks();
    const task = tasks.find(t => t.id === 1);
    expect(task.completed).toBe(true);
  });
});

describe('deleteTask', () => {
  test('removes a task by id', () => {
    const removed = deleteTask(1);
    expect(removed.id).toBe(1);
    const tasks = listTasks();
    expect(tasks).toHaveLength(1);
  });

  test('returns null for non-existent id', () => {
    const result = deleteTask(999);
    expect(result).toBeNull();
  });

  test('does not affect other tasks', () => {
    deleteTask(1);
    const tasks = listTasks();
    expect(tasks[0].id).toBe(2);
  });
});
