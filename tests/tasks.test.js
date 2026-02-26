const fs = require('fs');
const path = require('path');
const { addTask, listTasks, completeTask, deleteTask, isOverdue } = require('../src/tasks');
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
  {
    id: 3,
    description: 'Overdue task',
    priority: 'medium',
    completed: false,
    createdAt: '2026-01-01T10:00:00.000Z',
    dueDate: '2026-01-15',
  },
  {
    id: 4,
    description: 'Future task',
    priority: 'low',
    completed: false,
    createdAt: '2026-02-20T10:00:00.000Z',
    dueDate: '2099-12-31',
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
    expect(task.id).toBe(5);
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
    expect(tasks).toHaveLength(5);
    expect(tasks[4].description).toBe('Persisted task');
  });

  test('adds a task with a due date', () => {
    const task = addTask('Deadline task', 'high', '2026-06-15');
    expect(task.dueDate).toBe('2026-06-15');
  });

  test('omits dueDate when not provided', () => {
    const task = addTask('No deadline');
    expect(task.dueDate).toBeUndefined();
  });
});

describe('listTasks', () => {
  test('returns all tasks', () => {
    const tasks = listTasks();
    expect(tasks).toHaveLength(4);
  });

  test('filters by priority', () => {
    const high = listTasks('high');
    expect(high).toHaveLength(1);
    expect(high[0].priority).toBe('high');
  });

  test('returns empty array for unmatched priority', () => {
    const result = listTasks('nonexistent');
    expect(result).toHaveLength(0);
  });

  test('filters to overdue tasks only', () => {
    const tasks = listTasks(null, { overdue: true });
    expect(tasks).toHaveLength(1);
    expect(tasks[0].id).toBe(3);
  });

  test('overdue filter excludes completed tasks', () => {
    completeTask(3);
    const tasks = listTasks(null, { overdue: true });
    expect(tasks).toHaveLength(0);
  });

  test('overdue filter excludes future due dates', () => {
    const tasks = listTasks(null, { overdue: true });
    const ids = tasks.map(t => t.id);
    expect(ids).not.toContain(4);
  });

  test('combines priority and overdue filters', () => {
    const tasks = listTasks('high', { overdue: true });
    expect(tasks).toHaveLength(0);
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
    expect(tasks).toHaveLength(3);
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

describe('isOverdue', () => {
  test('returns true for past due date on incomplete task', () => {
    expect(isOverdue({ dueDate: '2020-01-01', completed: false })).toBe(true);
  });

  test('returns false for future due date', () => {
    expect(isOverdue({ dueDate: '2099-12-31', completed: false })).toBe(false);
  });

  test('returns false for completed task even if past due', () => {
    expect(isOverdue({ dueDate: '2020-01-01', completed: true })).toBe(false);
  });

  test('returns false when no dueDate', () => {
    expect(isOverdue({ completed: false })).toBe(false);
  });

  test('task due today is not overdue', () => {
    const today = new Date().toISOString().slice(0, 10);
    expect(isOverdue({ dueDate: today, completed: false })).toBe(false);
  });
});

describe('backward compatibility', () => {
  test('loads tasks without dueDate field gracefully', () => {
    const legacy = [
      { id: 1, description: 'Old task', priority: 'high', completed: false, createdAt: '2026-01-01T00:00:00.000Z' },
    ];
    fs.writeFileSync(DATA_FILE, JSON.stringify(legacy, null, 2), 'utf-8');
    const tasks = listTasks();
    expect(tasks).toHaveLength(1);
    expect(tasks[0].dueDate).toBeUndefined();
  });
});
